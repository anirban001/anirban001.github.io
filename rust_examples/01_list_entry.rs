
#[derive(Copy, Clone, Debug)]
struct IndexList<const INDEX_COUNT: usize> {
    // Item at index 0 is the free_list (the first item)
    prevs: [usize; INDEX_COUNT],
    nexts: [usize; INDEX_COUNT],
}

impl<const INDEX_COUNT: usize> IndexList<INDEX_COUNT> {
    const fn new() -> Self {
        assert!(INDEX_COUNT >= 2);
        let mut prevs: [usize; INDEX_COUNT] = [0; INDEX_COUNT];
        let mut nexts: [usize; INDEX_COUNT] = [0; INDEX_COUNT];

        // TODO: investigate const_for.
        let mut i: usize = 0;
        while i < INDEX_COUNT {
            prevs[i] = if i > 0 {
                 i - 1
            } else {
                INDEX_COUNT - 1
            };
            nexts[i] = if i < INDEX_COUNT - 1 {
                i + 1
            } else {
                0
            };
            i += 1;
        }
        Self {
            prevs,
            nexts,
        }
    }

    fn debug_count(&self) -> usize {
        INDEX_COUNT
    }
    

    fn debug_print(&self) {
        for i in 0 .. self.debug_count() {
            println!("{}: prev: {}, next: {}", i, self.prevs[i], self.nexts[i]);
        }
    }

    fn is_full(& self) -> bool {
        self.prevs[0] == 0 && self.nexts[0] == 0
    }

    fn alloc(&mut self) -> Option<usize> {
        if self.is_full() {
            return None;
        }

        // Expected:
        //  0.next == old_next
        //  old_next.prev == 0
        let old_next = self.nexts[0];
        assert_eq!(self.prevs[old_next], 0);

        // Expected:
        //  old_next.next == old_next_next
        //  old_next_next.prev == old_next
        let old_next_next = self.nexts[old_next];
        assert_eq!(self.prevs[old_next_next], old_next);

        // Desired:
        //  0.next == old_next_next
        //  old_next_next.prev == 0
        self.nexts[0] = old_next_next;
        self.prevs[old_next_next] = 0;

        // Desired:
        //  old_next.next == old_next
        //  old_next.prev == old_next
        self.nexts[old_next] = old_next;
        self.prevs[old_next] = old_next;


        Some(old_next)
    }

    fn free(&mut self, idx: usize) {
        assert!(idx > 0);
        assert!(idx < INDEX_COUNT);
        assert_eq!(self.prevs[idx], idx);
        assert_eq!(self.nexts[idx], idx);
        
        // Current:
        //  0.next == old_next
        //  old_next.prev == 0
        let old_next = self.nexts[0];
        assert_eq!(self.prevs[old_next], 0);
        assert_ne!(old_next, idx);
        
        // Desired:
        //  0.next == idx
        //  idx.next == old_next
        //  old_next.prev == idx
        //  idx.prev == 0
        self.nexts[0] = idx;
        self.nexts[idx] = old_next;
        self.prevs[old_next] = idx;
        self.prevs[idx] = 0;
    }
}

fn dump_debug_str<const INDEX_COUNT: usize>(ls: &IndexList<INDEX_COUNT>) -> String {
    let mut result = String::new();
    use core::fmt::Write;
    let mut i: usize = 0;
    loop {
        write!(&mut result, "{} -> ", i).unwrap();
        assert_eq!(ls.prevs[ls.nexts[i]], i);
        i = ls.nexts[i];
        if i == 0 { break };
    }
    write!(&mut result, "0").unwrap();
    result
}

fn test_index_list() {
    let mut index_list = IndexList::<5>::new();
    assert_eq!(dump_debug_str(&index_list), "0 -> 1 -> 2 -> 3 -> 4 -> 0");

    // Just in case more details are required.
    index_list.debug_print();
    // println!("dump_debug_str := {}", dump_debug_str(&index_list));
    
    let i1 = index_list.alloc();
    assert_eq!(i1, Some(1));
    assert_eq!(dump_debug_str(&index_list), "0 -> 2 -> 3 -> 4 -> 0");

    let i2 = index_list.alloc();
    assert_eq!(i2, Some(2));
    assert_eq!(dump_debug_str(&index_list), "0 -> 3 -> 4 -> 0");

    let i3 = index_list.alloc();
    assert_eq!(i3, Some(3));
    assert_eq!(dump_debug_str(&index_list), "0 -> 4 -> 0");

    let i4 = index_list.alloc();
    assert_eq!(i4, Some(4));
    assert_eq!(dump_debug_str(&index_list), "0 -> 0");

    // Free in a different order.
    index_list.free(i3.unwrap());
    assert_eq!(dump_debug_str(&index_list), "0 -> 3 -> 0");

    index_list.free(i2.unwrap());
    assert_eq!(dump_debug_str(&index_list), "0 -> 2 -> 3 -> 0");

    let i2 = index_list.alloc();
    assert_eq!(i2, Some(2));
    assert_eq!(dump_debug_str(&index_list), "0 -> 3 -> 0");

    index_list.free(i2.unwrap());
    assert_eq!(dump_debug_str(&index_list), "0 -> 2 -> 3 -> 0");

    index_list.free(i1.unwrap());
    assert_eq!(dump_debug_str(&index_list), "0 -> 1 -> 2 -> 3 -> 0");

    index_list.free(i4.unwrap());
    assert_eq!(dump_debug_str(&index_list), "0 -> 4 -> 1 -> 2 -> 3 -> 0");

    let i4 = index_list.alloc();
    assert_eq!(i4, Some(4));
    assert_eq!(dump_debug_str(&index_list), "0 -> 1 -> 2 -> 3 -> 0");

    println!("Done\n");
}

//////////////////////////////////////////////////////////////////

#[derive(Copy, Clone, Debug)]
struct JobList<const INDEX_COUNT: usize> {
    free_list: IndexList<INDEX_COUNT>
}

impl<const INDEX_COUNT: usize> JobList<INDEX_COUNT> {
    const fn new() -> Self {
        Self {
            free_list: IndexList::<INDEX_COUNT>::new()
        }
    }
}

//////////////////////////////////////////////////////////////////

fn main() {
    test_index_list();
    let job_list = JobList::<3>::new();
    assert_eq!(dump_debug_str(&job_list.free_list), "0 -> 1 -> 2 -> 0");
}
