////////////////////////////////////////////////////////////////////////////////
// common.h
////////////////////////////////////////////////////////////////////////////////

#include <assert.h>

#include <iostream>
#include <atomic>
#include <chrono>
#include <cstdint>
#include <functional>
#include <memory>
#include <cstring>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>
#include <unordered_map>
#include <vector>

struct MetaView {
  const void* data;
  size_t size;
};

// Forward declaration.
struct RMSlot;

struct RMRequest {
  int slot_idx;
};

using RMCallback = void (*)(void* cb_ctx, RMRequest* request);

class RequestManager {
 public:
  RequestManager();
  ~RequestManager();

  bool prepare_request(RMRequest* request, MetaView meta, RMCallback cb,
                       void* cb_ctx);

  bool update_request(RMRequest* request, MetaView meta);

  bool start_request(RMRequest* request);

 private:
  static constexpr int kMaxSlots = 16;

  void worker_loop_();
  void drain_ready_();
  void poll_running_();

 private:
  std::unique_ptr<RMSlot> slots_[kMaxSlots];

  std::atomic<bool> running_;
  std::thread worker_;
};

////////////////////////////////////////////////////////////////////////////////
// impl.cpp
////////////////////////////////////////////////////////////////////////////////

enum class RMSlotState : uint8_t {
  FREE = 0,
  PREPARING,
  PREPARED,
  UPDATING,
  READY,
  RUNNING
};

static bool atomic_state_change(std::atomic<RMSlotState>& atom,
                                RMSlotState from, RMSlotState to) noexcept {
  for (;;) {
    RMSlotState expected = from;
    if (atom.compare_exchange_weak(expected, to, std::memory_order_acq_rel,
                                   std::memory_order_relaxed))
      return true;
    if (expected != from) return false;
  }
}

static void atomic_state_change_or_die(std::atomic<RMSlotState>& atom,
                                       RMSlotState from,
                                       RMSlotState to) noexcept {
  bool ok = atomic_state_change(atom, from, to);
  assert(ok);
}

struct RMSlot {
  std::atomic<RMSlotState> state{RMSlotState::FREE};

  RMRequest* request_ctx = nullptr;
  RMCallback cb = nullptr;
  void* cb_ctx = nullptr;
  std::vector<std::uint8_t> meta;
  bool in_flight = false;
  std::chrono::steady_clock::time_point completes_at{};

  bool prepare_request(RMRequest* request_ctx_param, RMCallback cb_param,
                       void* cb_ctx_param, const MetaView& meta_param) {
    if (!atomic_state_change(state, RMSlotState::FREE,
                             RMSlotState::PREPARING)) {
      return false;
    }
    request_ctx = request_ctx_param;
    cb = cb_param;
    cb_ctx = cb_ctx_param;
    meta.assign((const std::uint8_t*)meta_param.data,
                (const std::uint8_t*)meta_param.data + meta_param.size);

    atomic_state_change_or_die(state, RMSlotState::PREPARING,
                               RMSlotState::PREPARED);
    return true;
  }

  bool update_request(RMRequest* request_ctx_param,
                      const MetaView& meta_param) {
    if (!atomic_state_change(state, RMSlotState::PREPARED,
                             RMSlotState::UPDATING)) {
      return false;
    }
    assert(request_ctx == request_ctx_param);
    meta.assign((const std::uint8_t*)meta_param.data,
                (const std::uint8_t*)meta_param.data + meta_param.size);
    atomic_state_change_or_die(state, RMSlotState::UPDATING,
                               RMSlotState::PREPARED);
    return true;
  }

  bool start_request(RMRequest* request_ctx) {
    return atomic_state_change(state, RMSlotState::PREPARED,
                               RMSlotState::READY);
  }

  void reset() {
    assert(RMSlotState::FREE == state.load(std::memory_order_acquire));
    request_ctx = nullptr;
    cb = nullptr;
    cb_ctx = nullptr;
    meta.clear();
    in_flight = false;
    completes_at = {};
  }
};

RequestManager::RequestManager() : running_(false) {
  for (int i = 0; i < kMaxSlots; ++i) {
    slots_[i] = std::make_unique<RMSlot>();
  }
  for (int i = 0; i < kMaxSlots; ++i) {
    slots_[i]->reset();
  }
  assert(!running_);
  running_ = true;
  worker_ = std::thread(&RequestManager::worker_loop_, this);
}

RequestManager::~RequestManager() {
  running_ = false;
  worker_.join();
  for (int i = 0; i < kMaxSlots; ++i) {
    slots_[i]->reset();
    slots_[i] = nullptr;
  }
}

bool RequestManager::prepare_request(RMRequest* request_ctx, MetaView meta,
                                     RMCallback cb, void* cb_ctx) {
  int slot = request_ctx->slot_idx;
  if (slot < 0 || slot >= kMaxSlots) return false;
  return slots_[slot]->prepare_request(request_ctx, cb, cb_ctx, meta);
}

bool RequestManager::update_request(RMRequest* request_ctx, MetaView meta) {
  int slot = request_ctx->slot_idx;
  if (slot < 0 || slot >= kMaxSlots) return false;
  return slots_[slot]->update_request(request_ctx, meta);
}

bool RequestManager::start_request(RMRequest* request_ctx) {
  int slot = request_ctx->slot_idx;
  if (slot < 0 || slot >= kMaxSlots) return false;
  return slots_[slot]->start_request(request_ctx);
}

void RequestManager::worker_loop_() {
  while (running_.load(std::memory_order_acquire)) {
    drain_ready_();
    poll_running_();
    std::this_thread::yield();
  }
}

void RequestManager::drain_ready_() {
  for (int slot = 0; slot < kMaxSlots; ++slot) {
    auto& s = *slots_[slot];

    bool ok =
        atomic_state_change(s.state, RMSlotState::READY, RMSlotState::READY);
    if (!ok) {
      continue;
    }
    // Once the slot is in READY state, only this thread has exclusive access.
    s.in_flight = true;
    s.completes_at =
        std::chrono::steady_clock::now() + std::chrono::milliseconds(100);
    atomic_state_change_or_die(s.state, RMSlotState::READY,
                               RMSlotState::RUNNING);
  }
}

void RequestManager::poll_running_() {
  auto now = std::chrono::steady_clock::now();

  for (int slot = 0; slot < kMaxSlots; ++slot) {
    auto& s = *slots_[slot];
    bool done = false;

    if (!atomic_state_change(s.state, RMSlotState::RUNNING,
                             RMSlotState::RUNNING)) {
      continue;
    }

    if (s.in_flight && now >= s.completes_at) {
      done = true;
      s.in_flight = false;
    }

    if (!done) {
      continue;
    }

    if (s.cb) s.cb(s.cb_ctx, s.request_ctx);
    atomic_state_change_or_die(s.state, RMSlotState::RUNNING,
                               RMSlotState::FREE);
    s.reset();
  }
}

////////////////////////////////////////////////////////////////////////////////
// main.cpp
////////////////////////////////////////////////////////////////////////////////


static void on_done(void* cb_ctx, RMRequest* req_ctx) {
  std::cout << "Callback slot=" << req_ctx->slot_idx << " req=" << req_ctx
            << "\n";
  *((bool*)cb_ctx) = true;
}

void main0() {
  RequestManager rm;

  RMRequest req1;
  req1.slot_idx = 2;
  bool completed = false;

  uint8_t meta[4] = {1, 2, 3, 4};

  bool ok =
      rm.prepare_request(&req1, {meta, sizeof(meta)}, &on_done, &completed);
  assert(ok);

  ok = rm.start_request(&req1);

  while (!completed) {
    std::this_thread::sleep_for(std::chrono::microseconds(300));
  }
}

void main1() {
  RequestManager rm;

  // Prepare A in slot 3
  RMRequest req1;
  req1.slot_idx = 3;
  bool completed1 = false;

  std::uint8_t metaA[4] = {1, 2, 3, 4};
  bool ok =
      rm.prepare_request(&req1, {metaA, sizeof(metaA)}, &on_done, &completed1);
  assert(ok);

  // Update A
  std::uint8_t metaA2[2] = {9, 9};
  ok = rm.update_request(&req1, {metaA2, sizeof(metaA2)});
  assert(ok);

  // Prepare B in slot 3 should fail (busy)
  RMRequest req2;
  req2.slot_idx = 3;
  bool completed2 = false;

  std::uint8_t metaB[1] = {7};
  ok = rm.prepare_request(&req2, {metaB, sizeof(metaB)}, &on_done, &completed2);
  std::cout << "Prepare B (slot 3) ok? " << ok << "\n";
  assert(!ok);

  // Start A
  ok = rm.start_request(&req1);
  assert(ok);

  // Give the worker time to run
  while (!completed1) {
    std::this_thread::sleep_for(std::chrono::microseconds(300));
  }

  // Now slot 3 should be free again; prepare B succeeds
  ok = rm.prepare_request(&req2, {metaB, sizeof(metaB)}, &on_done, &completed2);
  std::cout << "Prepare B after completion ok? " << ok << "\n";

  ok = rm.start_request(&req2);
  assert(ok);

  while (!completed2) {
    std::this_thread::sleep_for(std::chrono::microseconds(300));
  }
}

int main() {
  main0();
  main1();
}
