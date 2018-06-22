// Copyright (Anirban Banerjee) 2013
// Using the MVC paradigm.
//      User views the View and updates the Controller.
//      Controller manipulates the Model.
//      The Model updates the View.
//
// TODO: Implement 'undo' feature.
// TODO: Add functionality to rotate/transform/permute-digits to reuse same game
//       many times.
// TODO: Implement a way to push and pop game state.
// TODO: Add clicking buttons to choose numbers (for iPad usability).
// TODO: Reduce pixel size all over (for iPad usability).
// TODO: Investigate button shape on iPad/Safari.
// TODO: Keep track of game state (empty+error count) and give
//       some visual candy on successful completion.

BLOCK_SIZE = 3;
OUTER_BORDER_SIZE = '2';
INNER_BORDER_SIZE = '0';
BOX_DEFAULT_COLOR = '#FFFFFF';
BOX_ERROR_COLOR = '#FF0000';
BOX_CHOICE_COLOR = '#FFFF33';
BOX_SINGLE_CHOICE_COLOR = '#22FF22';
BOX_SIZE = '50px';
BOX_BIG_FONT_SIZE = '30px';
BOX_SMALL_FONT_SIZE = '10px';
NOT_HERE_SYMBOL = '.';
DEFAULT_VIEW = 'DEFAULT_VIEW';
CHOICE_VIEW = 'CHOICE_VIEW';

///////////////////////////////////////////////////////////////
// Game collection.
///////////////////////////////////////////////////////////////

GAME_COLLECTION = {};

GAME_COLLECTION[0] = new Array(
    ".....149..15.2.37.74.6.....1.6..82.94..2.9..12.91..8.7.....2.13.61.3.92..925.....",
    "....59...3.1.24....9.....435...9.7.646......98......1...65.128.........7.....765.",
    "....927.8..1...4..89.6.7.32...7.6.2....2..3...7.98..6.2...73.5.5..........6.....9",
    "...1.5...45..28...2....7.3........743....9.....4..1..81.6...9.2987....6.....3..8.",
    "...54..69..93.72..3.2.6...1...7....818..3..4..23..8..69.........5....8.38714.3...",
    "..19.......7.4..2.4..81.7..8.......9.....52.1.6.4.....5........1..72..4.2986.....",
    "..3..1...6...2.7....9.3.14..5.8...32.1.7....8....5........9....3....8...427....1.",
    "..3.1..84....27...67.8......6......9....915.8..12......9.......1...4.6358...5..2.",
    "..328.957.4......2..8.97.3.12.5.9.....6.3......7.42...97.3....4..2......3...26.7.",
    "..41..6..2.5..........5...3...9.8.716..3..5...9...23..73.6.....9.1.75......29....",
    "..5..82......63..47..15...9......9.........8.2..3.91.55..7.......6.8.7.1.7.236...",
    "..713..........45..3....6.1...7.93...63...1....286......8.76......95.24...6.4....",
    "..83....5....1..6.....7.3..5.9.3.2...6....8....2.58.........579.172...8343......1",
    "..84.6....1....3..6...3.94........6....27..93......285.79.12..4......631.5.3....9",
    "..9...78....7.13...3.289..4.8......792.5.7.365......2.4..628.7...83.4....93...6..",
    "..9.1.3.....2.9..4....4..2.4....2.1.3..75....96...42...18.96.7..34..7.......8...6",
    ".1..632.........3....9..5.7..12...4.9....5.6.4.......8..514...3.9..........738..1",
    ".18...9.527...1...9....8.1..9.1..4.6.8.65..2......7....56..23....7..4.5...9.75.6.",
    ".2......91...34....8.5.2...7.....6.4.....1...31.9...78..8..6...4.71.983.....8....",
    ".2.5.9478...4.......7.....57.1.2.534.8..4.......9....7...6...5.2.51.....6487.2..9",
    ".3...24..54.98..1.1...34..6..1..7..4...2..5..8.96...3...81......2.8...7.....7.2.5",
    ".38...4.22....1.....7..98....56...48.1...396.6...8..........51..4..58....9....6.4",
    ".457..2.....8....1.8...3.6...254.....96......73.6.......3.19.78.5......3...37..9.",
    ".5.2...38..9...5..4.....7.6..695.8........1...3.64..........6.734..8...2...1.4...",
    ".69.2..8.....9.17...5....3....3......4..5...3..7...56.8..1..7..491..........4.612",
    ".7.9...6.8..426..1....1....416.35..........4..58.9.......56.9..29.7..635........2",
    ".72..3..99.......143.6......9..48..25.4.96...3.....4....3....5.61..2..8....7..1..",
    ".72.9...8.482.7....6....2.3.23.6.7......7..4..9.5.43...368.......93......5....6..",
    ".9...6..8..725.....421..5.9.3...52645.........7634......9.2731..836....2......8..",
    "1......69...6...7...8..92...92.8.341.....2....3..9..27.23..8........7.5.6...5....",
    "1.2.587.....14..2...9..65...2......1.3.5..2..65......7..5.64....8......2.....136.",
    "1.4..97..5.2..6..........647.6.........1.54......921..85......1.......4..9.7.165.",
    "19...84...4..3.6893.5......8..6...9..71....64..2.9.....6..2..71....1...67.8.6..5.",
    "2...4.9..7.61.9.....46...2...57...4.91........72............46.....92317.57.1.8..",
    "3..7.2........68..41...97..9...8..7..64.1.29..57.94.8...8...3...95........3.28...",
    "3.6.1.4.....2.36.1......5.7...38.9.4..8..43...2..7.....9.8...65.3..5.2..8.7....4.",
    "35...94...9.4....3.4.86..9.47..1.9...3.6.4.2...2.3..74.6..82.4.7....1.5...47...81",
    "4...37....2.49.1....915......68.5.1..41....2...5.1.34............2..4..897..83...",
    "4..5......2.8.74..6...2..75...7.8....9..41......6...8.1.4.89.6.2..1....3876....9.",
    "4.329.....19....8..5843......2.....5.81.7........8.27...7.1..9....8..3.....6...21",
    "41.......5...6.38........1....43......2..18..8..65.79...7..5.4......61.7....4.2.9",
    "5..89.7.......6..54.75....6..6...........9...1....3.64...2..9..72...1.8.9..4..5.2",
    "6.48.92..1.74...8..3...579.58.3..........2..8.....76..7..9.84....9...8.1....3...2",
    "7..9.4.5..4.8....6...35..7..845..1...17...98.2....1..5..2...7.....2.7..13.9..5...",
    "7.1.....99....8.64....32....1...9..6.7..83195...7..2..4.9.21...2.....6...6..4..8.",
    "8.12.5..93.6.1..5...74...........5.....1.6.9...4.2....4..3......3.8.97.2.8.....41",
    "8.3.1.5....23...6.....2.4...146.27...7..9......6..5...4......3....43...97..861...",
    "81.62.5...92.5...4...3....86.9......73...8.12.8..6....9.3.1...6....9......4.8635.",
    "9....4.866.892....75....1....3............968.....5.4.8..5.7.....14......6.....19",
    "9.4513..26....7...218.6..7....1....8..5....4..4.3....953.97861.....4.......6.....");

GAME_COLLECTION[1] = new Array(
    "...........9.5.2....5....83.5..89..4....7..256..3......17..3.6..64.21.....3..81.9",
    "........2.27.8...39...5.4.......736.5...91..8.7...6..4......2.......51491.96..875",
    ".......16..23.....3.....7.....8.7.6..........481..3...7.9..8.3.6.45..9...236..1.5",
    "......1....6..8...5.1..24.8.7.6..2.3..48.5.9.6.97.4.1....2..5..9.8......2571...89",
    ".....4.1..1937.4.6.8.5....792..5.74.8....3..2.....6..8..8..9..4..7.....13.......5",
    "....1..46.5..481.....2...5...2..4..9.4.9713......2.41...6..9...7...6..8.4.5..7..3",
    "....2......2563..46..81...7..67.2.9..3......2.9.3.6.....3.........9..7.1..5...8..",
    "....2..1....4.5.9..6..8...5.3....761.5.........9..4..8..75.29...21....5.8....3.2.",
    "....3....31...........9..78176..5.........8.....1.3......4.96..7.4..251.26.5.7...",
    "....38...72.....3.68..1....4..2..5........61.....8...3.5.....9.......74.9..8452.1",
    "...54...17.93.1.....1...6.4...4.6.9..2..35.6....9....783.7..5.......9.....46.....",
    "...6..8.44...1..5.69.584.17..7.......8.24...3.4...95..1..9.5..83..12.64........7.",
    "...6.18..46....3.1..5...2......9......1.2......47...52....49.283.2.58..48......1.",
    "...78...2........1.....9.65.8.9...74.4.85...3..3...29..2.....3.4.62....75.9...1.6",
    "...8.7...8...29.5.7.3...........6..1...782..4.4.1..62.....9..8...6.....54...1..92",
    "...8.7.6.2853..........4....6491..3..1..7.94.89....7..6..4...........283...53....",
    "...8.9...4.9...27.6...2.8.9..359...4...2..1.89.24875..1...4.6....7.1........3....",
    "...91.2..........4.3..8....4.623...1352.......91....5...3....4...7.4..36..4593...",
    "...93...14.2....56.7..62.......89......3...8....64.5.7.854..6126.12......9.8..4.5",
    "...93..25.69.....41.2.4...7..........5...8..6...1947.....7...82..3.5....8.6......",
    "..1...9..8967.....2...156..3.5....9....1..5...7..2.....4.6....5.27...1.8.8..4....",
    "..2.......38.7.9....5...7.15.....8...2...9.56....32..77.9.....4...7..1.3....98...",
    "..3.91..6..........4...3182.1....4.8...2.7...5.2....9.4795...6..........2..67.3..",
    "..31.5...65......7....493.....79....2..85.4....73..82...158.....86......475..32..",
    "..6841...8..9..17.......9...48....3.79..1...5...7...8..2..3...7..5..76..1..68....",
    "..7..93..6..4....785..2.61.....4....7.5.38...3...7...........5.29.8....1...7.6.93",
    "..9653.81.6...1...............1...2.31.7...98..8...6..8....6..919.3...4.43..8...7",
    ".18.5....3...761...6.4......83...6......98.41.......2.....8.39..75.....48.2......",
    ".3...57...5..2...9.18.6...2...65..1...4...62..6.7....3.4...1...32.47.9....1....5.",
    ".3...75..5...3.9.2....69.71.2...........8..56..4.7...33.8........93541........4..",
    ".3..1....9....7.2..5.3.6.14.2..6...3179..3..8..5..2.97...2.1....1....8....36.....",
    ".41......98...13.45..49.2........1.76.87.2..5.2...4....5..4...6.3...6......3.8.1.",
    ".5...749...29.8..54..5631...3.8.2.1..2.......9......6...647.3.2.....1....47..698.",
    ".6....1.24..1...9..9..38..4...27...9..4.....1...981...53..26.........7.3816...4..",
    ".64........89.43......2.........3......25...8915.4.7....36.89...56...17.4.1..5...",
    ".65..8....8749......9..5..437..2....8..6..7...1.....2..4..6...7......6.1....74.93",
    ".8...1..256..879....2.5...63..8...9..286..1..6...742..8.......3..1..38.9......52.",
    ".8..31596.9.5.2........7..46......8.9...1...2.....4.79..23..4....3.8....7........",
    ".8.4....6....8.....46.159....5....1........98....6..32.2......9.972.1.4.8..5.7.6.",
    ".8761.....9...5..........243....9..6.16..7.8.......19...439....23.....4..6.....18",
    ".9..5..2.2....7.....8..3.6...3.....6.....6.38.7..3..4..5..8.4....74.2..5.....9..2",
    ".9.5....8.2.7.1...13....25...6....178.3.9.6................3....7...93.5....2....",
    ".94...2....7...65.6..39..4...1.3..759..56....2.5.17......2.9......8............17",
    "17.8..53........9..8....4....3......85.1..964..692..5....4573..4.1....25.3...1..9",
    "3.1...2.....7...........68.863.4...1..4..639..7...3....3.6....9..62174....835...2",
    "7.9.18.3..5..4.....4.6..9..56....7.9.3.....1...2.....4...9....31..7.4.....6...5.1",
    "8......32...4.........2.95.5.....18.41..59...6......45.7...1..4...2...6.169..3...",
    "9......3....73...6.6.....95..46...7..7.3..2.12.8.......1..6285.4.398...2.........",
    "9...7...5.......9..286..3..4.573.2.63.6.4.......5.....7592....81............89...",
    "9.4.........6.7.........4.2.....45..8......2..325....9.....67.859....6.1..39...45");

GAME_COLLECTION[2] = new Array(
    "..........79....8.18..94..2.5.4..62..9...1.....6..7.1.3......6.26.1.894....7...5.",
    "........447.8..5.........17.....8..9.8..6.2.1.1.7.2.6..2.4...93857..31........6.8",
    ".......8.9...85...5...76.9.......9.3..98...4...7.1....18.....3......4..2..37....1",
    "......8...91...624...13...56.7.2........7.493..9.13..2....5...........17.154....9",
    ".....4.....9..7.4....618..5.7......9.61.9.4......465.8..5.8.3.6.97........4..1...",
    ".....78....3.....9.6..9.4.2.2..79.4..352..9..7..6..2..2...4...........648.9...5..",
    "....139....8.4.73...5..6.8.1.6..2.....9.7...2......6....1..4....84.....5...5.1.4.",
    "....3..........158.92.....6...34.86..3.2.....6.7.1..42.........16....9...8.974.2.",
    "....5......9.23..7.5..7..98..64........2.8.4....3..2.18..6.1...1......86.62...4..",
    "....6.8.....8.14.6.....9....4...8.9.3...24....8.3..7.22.3..7.....64..3.849.....5.",
    "...1..5..1...9..7.2..6.7.3.5.6....218.....76.7...3......8...9..9..71....35......8",
    "...18.....2..3.19......25.456.8.42..7......1...8.....56..2......15..34...37....6.",
    "...54......1...9.7..5..2.8..3.7.......4.5.76........49..6...1....2.....658..634..",
    "...7.....3.19....68...5..49.6....59.5.3.4...........1..98...46...4..1..8....6...5",
    "..2.........9...4......6..8.6....85.1.978.......1..4...1.....29.75..8....4.2.17..",
    "..2...5..5..9.6....89..4..23..74....8.6..2.4..4..6.8.....2.9..1.1...7.9...8..5...",
    "..3...6...5.3.27....4.8...2.7...5.2.9...145....16...7..2....19.....5.8..43.1.....",
    "..4......6......5352..8......96...4...64...8....7.291....9..8..8.2.56...7..8...64",
    "..5..89.3....52...648.......7...9..5..4.6.....5.....21..3..1...5...863...2.......",
    "..6....7.....9...5......6.3...7.......4....6.135.....8.485.9.31....4.5..6.92.....",
    "..6...84.2....4....8.....73....2.5.1.2...9...6..5.3...9.....4.53........4.17.2..6",
    "..67.4.2..5.6....12....8..44.95.7..3.........8..2.19.66..1....73....5.6..2.3.61..",
    "..8..9....7.58.2..........384596..31.....4........8.5...379.51.1.......2..4.1..6.",
    "..9...2..513...7......7..14..5...67..4.6.3....96.8.....8...23.1.2..5......7...82.",
    "..9.4.5....3.819..5......8113...2....5...6..8......7.2.....38.7.8.....14...4..3.5",
    ".1........6.29.7....53......3....6......4..3.1.6...2743.7...9.5.....7...9.8..4.1.",
    ".1.....4.72.8.....548...........6......7..816..45.93..9...27.8..7..6.5........29.",
    ".2.4.5......6....9..4...7....65..134...3..2...4..6..5791....4....8..6.2.4....18..",
    ".3..7....4...25.....61..54..58.....33..481...2.......8....132.9....4......9....7.",
    ".36.892........3...8.2.1..4....9.14..7.......9.5..4...81.7...2.5......8..9.34....",
    ".6..41.9...2....41..4...6..6..53......72..4.3.8.6...5......952.2.5...7.6......3..",
    ".6..8..5.8.........3..52.......9.587...6253..1.....9..6....8........429....37..6.",
    ".63......1.2.9.6....83.25....45.............79.5..724.8...........6...1..5..897.4",
    ".7.59...6......9..1....748...........3..1.7...5.8..2.9..2.5..71.18.6...44.....8.2",
    ".7.69.458...3.7..........1..8..3....6...21.....9.84.31..5....67.6...5.....7...9..",
    ".8....293..5..3..8.......1...6..1.57..........3...4..6.6.9.....42..8653.97....46.",
    "1....7.....6.5..14.4.3612......16.4.9...85.....19.4...46......2...5.....7....29.8",
    "1...67.....8.........29...4.....5...93....7..57.83921..2...4.....3.5.4...85.....7",
    "123.7.6...7.6.2..5.............5.78.7....9....5..83...86.4....2.3..2.47....81..3.",
    "2.56...89..3..7........2..5....3.61.9.4186..7..1........89.5......7.3...1......6.",
    "24..1.......4..........97.1.3....1....8.7.934.91...5.8.62...45.91...53..4....3...",
    "3.9..........1..7874..8..6.692.5.7.44352...1.......2....749...68..13.............",
    "31456...8.....4....521.....4......6.8....6.31.67.3.....3827.......4...532........",
    "4.....97...5....68.634..........5......2...54.36...29...73..5.....194.3..49.6....",
    "4...21...7..9......3..5..988....7...3.9...2.1657.9..8..1....82....4....55....6.3.",
    "79..1...5.25...........36...8...1.6...7.8.9....156........7.5..2.6......8.....7.9",
    "79.52........8..9.18..........4..3...7.....2.638...5.4.47........2..81.7..3.758..",
    "8......4.1..96..8....5....7.9.....7.2.6..7..5..43..21....1..39..5........3...84.1",
    "8...62.........2...9..4..51.......9...65....73.7.16...1.....97...26.1.4.....85...",
    "8.732..4514..7......91..6....85..9.36...1.5.......6.8...6...7......3....4.1....3.");

GAME_COLLECTION[3] = new Array(
    "..........8..427..3.6...1...7....8.3.......5.2..39..1.6...8...27.....96...2.74...",
    "........3..29..1..1.3.75.8.2.........375.1.9.819...5.6.4...2.3........1...5...2.8",
    "......3...3.65....1.....5...4897.....6...5.9.7.........72.9.........384.4..1..6..",
    "......6.9.....875.6..7.5..33.2...5...4.1.79.2.6..24.....1..38..7............8.2.7",
    ".....85...23.4.7..8.....9.6....95....6..7..5....12....6.5.....3..8.6.14...79.....",
    "...2....718.3.546..39....1.9.5.6.....6...8......941...3..45..9.......3.5.......2.",
    "...5473.2....9......7....54....5...9..8.21...4....68...7.4.....3.5.....824.3..6..",
    "...6.5.3.....9.2...2.7.3..9..3.46..82..951.....5..8...3..1.....6.7..9.......8.1..",
    "..2..19....1.5.3.2....9...5.8.2...4.3.....5...7..6....51..2.4...26..487......6...",
    "..64...2......15....3.8.....427..1...1...........45..93....9...2...1.693...8....5",
    "..8...4...9..2..1..3.1...56.5....1.2.47....3....4135.....9.....3..7....59...86...",
    "..9.7...67...6.1.8...5....7.........1.4.3.8..8.3..26.127..9.5....13.6.8.....859..",
    "..95..4......1....261.....8..3.6.5....738.9...8..94..23..45.8...7..3.2..4..8...1.",
    "..98.6..2......6.865........4..9....5.1...84.3...1.2......5...492..4...3..4..7...",
    ".4.7....67...53.8..5.8.....59.......8.6.4...31...2........816.....96.2.....5.4.9.",
    ".5...7..47..4........89.7.2....1.428..1........52...6...9....8.4.8.61..9.6...81..",
    ".576.....4..15....16.92.4.85........2.6.8..7...4...8.2.4.....3...8..6..1..5.3.7..",
    ".7..1.....2.7..........9.2..8...24.....8....6.34...25..975...1.1...8......2.3.86.",
    ".7..5.2812....7.3..6......94.2.9.........4.6......3....38.7..5.......8....1..2..6",
    ".8..6...2..71.56.......48.75.3...7.....87.......3..4.9..1....38..5......6...9....",
    ".8..7....3..2..6..6.1.48.....3...21..4....9....85...3.1...2...5.6.1.....8.76.9.4.",
    ".9.86..5.......4.7.....2.91.6..8...5812.4..6.3..2..1.......3.......5......54...73",
    "1.63.2....8..4.6.......512......7.4....9.6.1...5..3.....3.7....5.42.87.17.....95.",
    "1.8.......9.4.37....6...3.......8.1..67....5....79....9.3.1..8.6...........64.2..",
    "4....9...6.3.8...7......3847.5.6..1....2........1.4.9.3.172......89.....5......3.",
    "4..6..21..2...3.4..19...5.....591.2...2....6...32..1575....47.....8..69....9....1",
    "6....3.2...76.4.931..2....8......9545..92..7....5.6.3.9..3.......1.......75.19...",
    "7.........8..3.......9..63.57.3....1...75.9...6.8..4..391..82.4.5..29......4....5",
    "8..2.61.5....4......1...4.7..875........6.2...34....6..7...85..3..52..8......9...",
    "..42....3..6.8......2..1.56.1..7..3.....5....5..8.372..21...54...34....2.........",
    "56...4.3...163529....7...65.2...93..87.....52.1.....4.....4.7.9...5.....4...78...",
    "....3627......14.868..4..59....2...653.........61.5..3..8.1...2.97....8....2.....",
    ".....5..4.......2.7.3.....1..2..43...4..869.5.....9.8.4...3.5...9.........75.....",
    ".....3....4.72...9......5....46..3..3.1......6....8..1..31..642.9.8...5...7..4...");


///////////////////////////////////////////////////////////////
// Utility functions.
///////////////////////////////////////////////////////////////
window.zeroChar = '0'.charCodeAt(0);
function getBoxId(i, j) {
  return i.toString() + j.toString();
}

function getIFromBoxId(boxId) {
    return boxId.substring(0, 1).charCodeAt(0) - window.zeroChar;
}

function getJFromBoxId(boxId) {
    return boxId.substring(1, 2).charCodeAt(0) - window.zeroChar;
}

function integerDivision(a, b) {
    var x = a - (a % b);
    return (x / b);
}

function assert(condition, message) {
    if (!condition) {
        if (!message) {
            message = "Assertion failed.";
        }
        alert(message);
        throw message;
    }
}

///////////////////////////////////////////////////////////////


function sudokuBox(maxDim, boxId) {
    this.maxDim = maxDim;
    this.boxId = boxId;
    this.allowed = new Array(this.maxDim + 1);

    this.refreshBox = refreshBox;
    function refreshBox() {
        this.view = DEFAULT_VIEW;
        // Display characteristics.
        this.displayValue = '';
        this.displayColor = BOX_DEFAULT_COLOR;
        this.displayFontSize = BOX_BIG_FONT_SIZE;

        this.allowedCount = this.maxDim;
        for (var i = 1; i <= this.maxDim; ++i) {
            this.allowed[i] = true;
        }
        this.currentChoice = '';
    }
    this.refreshBox();

    this.disAllow = disAllow;
    function disAllow(index) {
        // 'index' is between 1 .. maxDim.
        if (this.allowed[index]) {
            this.allowed[index] = false;
            this.allowedCount -= 1;
        }
    }

    this.setVal = setVal;
    function setVal(index) {
        for (var k = 1; k <= this.maxDim; ++k) {
            if (k != index) {
                this.disAllow(k);
            }
        }
        this.currentChoice = index.toString();
    }

    this.applyDefaultView = applyDefaultView;
    function applyDefaultView() {
        this.displayValue = this.currentChoice;
    }

    this.applyChoiceView = applyChoiceView;
    function applyChoiceView() {
        if ((1 == this.allowedCount) && ('' == this.currentChoice)) {
            this.displayValue = this.getAllCSV();
            this.displayFontSize = BOX_SMALL_FONT_SIZE;
            this.displayColor = BOX_SINGLE_CHOICE_COLOR;
        } else if ((1 == this.allowedCount) && ('' != this.currentChoice)) {
            this.displayValue = this.currentChoice;
        } else {
            this.displayValue = this.getAllCSV();
            this.displayFontSize = BOX_SMALL_FONT_SIZE;
            this.displayColor = BOX_CHOICE_COLOR;
        }
    }

    this.applyButtonView = applyButtonView;
    function applyButtonView() {
        index = this.view;
        // 'index' is in range 1 .. maxDim.
        assert(typeof(index) == 'number');
        assert((index >= 1) && (index <= this.maxDim));
        if ('' != this.currentChoice) {
            this.displayValue = this.currentChoice;
        } else if (!(this.allowed[index])) {
            this.displayValue = NOT_HERE_SYMBOL;
        } else if ('' == this.currentChoice) {
            this.displayValue = '';
            this.displayColor = BOX_CHOICE_COLOR;
        }
    }

    this.getDisplayPropertiesFromState = getDisplayPropertiesFromState;
    function getDisplayPropertiesFromState() {
        this.displayFontSize = BOX_BIG_FONT_SIZE;
        this.displayColor = BOX_DEFAULT_COLOR;
        if (this.allowedCount == 0) {
            this.displayValue = 'E';
            this.displayColor = BOX_ERROR_COLOR;
        } else if (DEFAULT_VIEW == this.view) {
            this.applyDefaultView();
        } else if (CHOICE_VIEW == this.view) {
            this.applyChoiceView();
        } else {
            this.applyButtonView();
        }
    }

    this.rePaint = rePaint;
    function rePaint() {
        var box = document.getElementById(this.boxId);
        box.value = this.displayValue;
        box.style.fontSize = this.displayFontSize;
        box.style.backgroundColor = this.displayColor;
    }

    this.updateView = updateView;
    function updateView() {
        this.getDisplayPropertiesFromState();
        this.rePaint();
    }

    this.getAllCSV = getAllCSV;
    function getAllCSV() {
        var result = '';
        var added = false;
        for (var i = 1; i <= this.maxDim; ++i) {
            if (!(this.allowed[i])) {
                continue;
            }
            if (added) {
                result = result + ',';
            }
            result = result + String.fromCharCode(zeroChar + i);
            added = true;
        }
        return result;
    }

    this.switchToChoicesView = switchToChoicesView;
    function switchToChoicesView() {
        this.view = CHOICE_VIEW;
    }

    this.switchToDefaultView = switchToDefaultView;
    function switchToDefaultView() {
        this.view = DEFAULT_VIEW;
    }

    this.handleButtonClick = handleButtonClick;
    function handleButtonClick(index) {
        // 'index' is in range 1 .. maxDim.
        this.view = index;
    }

    // Unit tests.
    this.assertState = assertState;
    function assertState(csv, allowedCount, choice, value, color, fontSize,
                         view) {
        assert(csv == this.getAllCSV(), 'CSV mismatch.');
        assert(allowedCount == this.allowedCount, 'Allowed count mismatch.');
        assert(choice == this.currentChoice, 'Current choice mismatch.');
        assert(value == this.displayValue, 'Display value mismatch.');
        assert(color == this.displayColor, 'Color mismatch.');
        assert(fontSize == this.displayFontSize, 'Font size mismatch.');
        assert(view == this.view, 'View mismatch.');
    }

    this.assertDefaultState = assertDefaultState;
    function assertDefaultState() {
        this.assertState(
            '1,2,3,4,5,6,7,8,9', 9, '', '', BOX_DEFAULT_COLOR,
            BOX_BIG_FONT_SIZE, DEFAULT_VIEW);
    }

    this.testDisallow = testDisallow;
    function testDisallow() {
        this.refreshBox();
        this.assertDefaultState();
        this.disAllow(1);
        assert('2,3,4,5,6,7,8,9' == this.getAllCSV());
        this.disAllow(9);
        assert('2,3,4,5,6,7,8' == this.getAllCSV());
        this.disAllow(6);
        assert('2,3,4,5,7,8' == this.getAllCSV());
    }

    this.testSwitchViews = testSwitchViews;
    function testSwitchViews() {
        this.refreshBox();
        this.assertDefaultState();
        this.handleButtonClick(1);
        assert(1 == this.view);
        this.handleButtonClick(9);
        assert(9 == this.view);
        this.switchToChoicesView();
        assert(CHOICE_VIEW == this.view);
        this.switchToDefaultView();
        assert(DEFAULT_VIEW == this.view);
        this.handleButtonClick(3);
        assert(3 == this.view);
    }

    this.testDisplayProperties = testDisplayProperties;
    function testDisplayProperties() {
        this.refreshBox();
        this.assertDefaultState();

        for (var k = 1; k <= 9; ++k) {
            this.disAllow(k);
        }
        this.getDisplayPropertiesFromState();
        this.assertState(
            '', 0, '', 'E', BOX_ERROR_COLOR, BOX_BIG_FONT_SIZE,
            DEFAULT_VIEW);
        this.switchToChoicesView();
        this.getDisplayPropertiesFromState();
        this.assertState(
            '', 0, '', 'E', BOX_ERROR_COLOR, BOX_BIG_FONT_SIZE,
            CHOICE_VIEW);
        this.handleButtonClick(3);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '', 0, '', 'E', BOX_ERROR_COLOR, BOX_BIG_FONT_SIZE, 3);

        this.refreshBox();
        this.assertDefaultState();
        for (var k = 1; k <= 6; ++k) {
            this.disAllow(k);
        }
        this.getDisplayPropertiesFromState();
        this.assertState(
            '7,8,9', 3, '', '', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE,
            DEFAULT_VIEW);
        this.switchToChoicesView();
        this.getDisplayPropertiesFromState();
        this.assertState(
            '7,8,9', 3, '', '7,8,9', BOX_CHOICE_COLOR, BOX_SMALL_FONT_SIZE,
            CHOICE_VIEW);

        this.handleButtonClick(3);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '7,8,9', 3, '', '.', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE, 3);

        this.handleButtonClick(7);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '7,8,9', 3, '', '', BOX_CHOICE_COLOR, BOX_BIG_FONT_SIZE, 7);

        this.setVal(8);
        this.switchToDefaultView();
        this.getDisplayPropertiesFromState();
        this.assertState(
            '8', 1, '8', '8', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE,
            DEFAULT_VIEW);
        this.switchToChoicesView();
        this.getDisplayPropertiesFromState();
        this.assertState(
            '8', 1, '8', '8', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE,
            CHOICE_VIEW);

        this.handleButtonClick(3);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '8', 1, '8', '8', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE, 3);

        this.refreshBox();
        this.assertDefaultState();
        for (var k = 1; k <= 9; ++k) {
            if (k != 3) {
                this.disAllow(k);
            }
        }
        this.getDisplayPropertiesFromState();
        this.assertState(
            '3', 1, '', '', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE,
            DEFAULT_VIEW);
        this.switchToChoicesView();
        this.getDisplayPropertiesFromState();
        this.assertState(
            '3', 1, '', '3', BOX_SINGLE_CHOICE_COLOR, BOX_SMALL_FONT_SIZE,
            CHOICE_VIEW);
        this.handleButtonClick(3);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '3', 1, '', '', BOX_CHOICE_COLOR, BOX_BIG_FONT_SIZE, 3);
        this.handleButtonClick(7);
        this.getDisplayPropertiesFromState();
        this.assertState(
            '3', 1, '', '.', BOX_DEFAULT_COLOR, BOX_BIG_FONT_SIZE, 7);
    }

    this.runTests = runTests;
    function runTests() {
        assert(9 == this.maxDim);
        this.assertDefaultState();
        this.testDisallow();
        this.testSwitchViews();
        this.testDisplayProperties();
    }
}

function sudokuModel(blockSize) {
    this.blockSize = blockSize;
    this.maxDim = this.blockSize * this.blockSize;

    this.boxes = new Array(this.maxDim);
    for (var i = 0; i < this.maxDim; ++i) {
        this.boxes[i] = new Array(this.maxDim);
        for (var j = 0; j < this.maxDim; ++j) {
            boxId = getBoxId(i, j);
            this.boxes[i][j] = new sudokuBox(this.maxDim, boxId);
        }
    }

    this.setBoxVal = setBoxVal;
    function setBoxVal(iCurr, jCurr, index) {
        // 'index' is between 1 .. maxDim.
        if (0 == this.boxes[iCurr][jCurr].allowedCount) {
            // No op.
            return;
        }
        if (index.toString() == this.boxes[iCurr][jCurr].currentChoice) {
            // No op.
            return;
        }
        if (!(this.boxes[iCurr][jCurr].allowed[index])) {
            // Block accidental setting of disallowed values.
            return;
        }
        if (1 == this.boxes[iCurr][jCurr].allowedCount) {
            // We really cannot change the choice here. The previous
            // choice did change the states of the other boxes, this would
            // be difficult to undo at this point.
        }

        // Disallow everything apart from index in the current box.
        this.boxes[iCurr][jCurr].setVal(index);

        // Disallow index from every box in the current row.
        for (var j = 0; j < this.maxDim; ++j) {
            if (j == jCurr) {
                continue;
            }
            this.boxes[iCurr][j].disAllow(index);
        }

        // Disallow index from every box in the current column.
        for (var i = 0; i < this.maxDim; ++i) {
            if (i == iCurr) {
                continue;
            }
            this.boxes[i][jCurr].disAllow(index);
        }

        // Disallow index from every box in the current sub-box.
        // iCurr = 0 1 2 3 4 5 6 7 8
        // iMin  = 0 0 0 3 3 3 6 6 6
        var iMin = integerDivision(iCurr, this.blockSize) * this.blockSize;
        var jMin = integerDivision(jCurr, this.blockSize) * this.blockSize;
        for (var i = iMin; i < iMin + this.blockSize; ++i) {
            for (var j = jMin; j < jMin + this.blockSize; ++j) {
                if ((i == iCurr) && (j == jCurr)) {
                    continue;
                }
                this.boxes[i][j].disAllow(index);
            }
        }
    }

    this.getModelText = getModelText;
    function getModelText() {
        var result = '';
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                var c = this.boxes[i][j].currentChoice;
                if (c == '') {
                    c = '.';
                }
                result += c;
            }
            result += '\n';
        }

        return result;
    }

    this.refreshModel = refreshModel;
    function refreshModel(newGame) {
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                this.boxes[i][j].refreshBox();
            }
        }

        var gameLen = newGame.length;
        var iCurr = -1;
        var jCurr = this.maxDim - 1;
        for (var i = 0; i < gameLen; ++i) {
            var ok = (newGame[i] == '.');
            var index = newGame[i].charCodeAt(0) - window.zeroChar;
            ok = ok || ((index >= 1) && (index <= this.maxDim));
            if (!ok) {
                continue;
            }
            ++jCurr;
            if (jCurr >= this.maxDim) {
                jCurr = 0;
                ++iCurr;
            }
            if (iCurr >= this.maxDim) {
                continue;
            }
            if (newGame[i] != '.') {
                this.setBoxVal(iCurr, jCurr, index);
            }
        }
    }

    this.switchToChoicesView = switchToChoicesView;
    function switchToChoicesView() {
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                this.boxes[i][j].switchToChoicesView();
            }
        }
        this.updateAll('switchToChoicesView');
    }

    this.switchToDefaultView = switchToDefaultView;
    function switchToDefaultView() {
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                this.boxes[i][j].switchToDefaultView();
            }
        }
        this.updateAll('switchToDefaultView');
    }

    this.handleButtonClick = handleButtonClick;
    function handleButtonClick(buttonId) {
        // buttonId is in range 1 .. maxDim.
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                this.boxes[i][j].handleButtonClick(buttonId);
            }
        }
        this.updateAll('handleButtonClick');
    }

    this.updateAll = updateAll;
    function updateAll(action) {
        for (var i = 0; i < this.maxDim; ++i) {
            for (var j = 0; j < this.maxDim; ++j) {
                this.boxes[i][j].updateView();
            }
        }
        window.sudokuView.refreshAll();
    }

    this.handleKeyPress = handleKeyPress;
    function handleKeyPress(index, boxId) {
        // 'index' is between 1 .. maxDim.
        var iCurr = getIFromBoxId(boxId);
        var jCurr = getJFromBoxId(boxId);
        this.setBoxVal(iCurr, jCurr, index);
        this.updateAll('handleKeyPress');
    }
}

function sudokuController() {
    this.switchToChoicesView = switchToChoicesView;
    function switchToChoicesView() {
        window.sudokuModel.switchToChoicesView();
    }

    this.switchToDefaultView = switchToDefaultView;
    function switchToDefaultView() {
        window.sudokuModel.switchToDefaultView();
    }

    this.handleKeyPress = handleKeyPress;
    function handleKeyPress(index, boxId) {
        // 'index' is between 1 .. maxDim.
        window.sudokuModel.handleKeyPress(index, boxId);
    }

    this.handleButtonClick = handleButtonClick;
    function handleButtonClick(buttonId) {
        window.sudokuModel.handleButtonClick(buttonId);
    }
}

function sudokuView(blockSize) {
    this.blockSize = blockSize;
    this.maxDim = this.blockSize * this.blockSize;

    this.isValidBoxId = isValidBoxId;
    function isValidBoxId(boxId) {
        var i = getIFromBoxId(boxId);
        var j = getJFromBoxId(boxId);
        if ((i < 0) || (i > (this.maxDim - 1))) {
            return false;
        }
        if ((j < 0) || (j > (this.maxDim - 1))) {
            return false;
        }
        return true;
    }

    this.handleBoxClick = handleBoxClick;
    function handleBoxClick(boxId) {
        // Can ignore clicks.
    }

    this.verifyKeyPress = verifyKeyPress;
    function verifyKeyPress(event, boxId) {
        if (!isValidBoxId(boxId)) {
            return false;
        }
        var key = String.fromCharCode(event.keyCode || event.which);
        var index = key.charCodeAt(0) - window.zeroChar;
        if ((index < 1) || (index > this.maxDim)) {
            return false;
        }
        window.sudokuController.handleKeyPress(index, boxId);
        return false;
    }

    this.handleButtonClick = handleButtonClick;
    function handleButtonClick(buttonId) {
        buttonId = buttonId.charCodeAt(0) - window.zeroChar;
        window.sudokuController.handleButtonClick(buttonId);
    }

    this.addBox = addBox;
    function addBox(tableRow, i, j) {
        var boxId = getBoxId(i, j);
        var td = document.createElement('td');
        var box = document.createElement('textarea');
        box.style.backgroundColor = BOX_DEFAULT_COLOR;
        box.style.height = BOX_SIZE;
        box.style.width = BOX_SIZE;
        box.style.resize = 'none';
        box.style.fontSize = BOX_BIG_FONT_SIZE;
        box.setAttribute('id', boxId);
        box.setAttribute(
            'onclick',
            'window.sudokuView.handleBoxClick("' + boxId + '")');
        box.setAttribute(
            'onkeypress',
            'return window.sudokuView.verifyKeyPress(event, "' + boxId + '");');
        box.setAttribute('onpaste', 'return false;');
        td.appendChild(box);
        tableRow.appendChild(td);
    }

    this.initView = initView;
    function initView() {
        this.board = document.getElementById('board');
        var outerTable = document.createElement('table');
        outerTable.setAttribute('border', OUTER_BORDER_SIZE);
        for (var i = 0; i < this.blockSize; ++i) {
            var tr = document.createElement('tr');
            for (var j = 0; j < this.blockSize; ++j) {
                var td = document.createElement('td');
                var innerTable = document.createElement('table');
                innerTable.setAttribute('border', INNER_BORDER_SIZE);
                td.appendChild(innerTable);
                tr.appendChild(td);
                for (var a = 0; a < this.blockSize; ++a) {
                    var innerTableRow = document.createElement('tr');
                    for (var b = 0; b < this.blockSize; ++b) {
                        this.addBox(innerTableRow,
                            (i * this.blockSize) + a,
                            (j * this.blockSize) + b);
                    }
                    innerTable.appendChild(innerTableRow);
                }
            }
            outerTable.appendChild(tr);
        }
        this.board.appendChild(outerTable);

        this.finalRow = document.getElementById('per_number_view');
        var outerTable = document.createElement('table');
        outerTable.setAttribute('border', INNER_BORDER_SIZE);
        outerTable.style.width = '100%';
        var tr = document.createElement('tr');
        var index = 1;
        for (var j = 0; j < this.blockSize; ++j) {
            var td = document.createElement('td');
            var innerTable = document.createElement('table');
            innerTable.setAttribute('border', INNER_BORDER_SIZE);
            innerTable.style.width = '100%';
            td.appendChild(innerTable);
            tr.appendChild(td);
            var innerTableRow = document.createElement('tr');
            for (var b = 0; b < this.blockSize; ++b, ++index) {
                var td = document.createElement('td');
                innerTableRow.appendChild(td);
                var button = document.createElement('button');
                button.setAttribute('id', 'b' + index.toString());
                button.style.height = BOX_SIZE;
                button.style.width = BOX_SIZE;
                button.style.fontSize = '14px';
                // button.style.backgroundColor = '#ccccff';
                button.setAttribute(
                    'onclick',
                    'window.sudokuView.handleButtonClick("' +
                    index.toString() + '")');
                button.innerHTML = index.toString();
                td.appendChild(button);
            }
            innerTable.appendChild(innerTableRow);
        }
        outerTable.appendChild(tr);
        this.finalRow.appendChild(outerTable);
    }

    this.refreshAll = refreshAll;
    function refreshAll() {
        document.getElementById('gameTextWindow').value = '';
    }

    this.loadGame = loadGame;
    function loadGame() {
        var gameText = document.getElementById('gameTextWindow').value;
        if ('' == gameText) {
            // No game to load.
            return;
        }
        window.sudokuModel.refreshModel(gameText);
        window.sudokuModel.updateAll('loadGame');
    }

    this.loadRandomGame = loadRandomGame;
    function loadRandomGame(difficultyLevel) {
        var items = GAME_COLLECTION[difficultyLevel];
        var gameText = items[Math.floor(Math.random() * items.length)];
        window.sudokuModel.refreshModel(gameText);
        window.sudokuModel.updateAll('loadGame');
    }

    this.getGame = getGame;
    function getGame() {
        document.getElementById('gameTextWindow').value =
            window.sudokuModel.getModelText();
    }


    this.initView();
}

function loadPage() {
    // Tests.
    // (new sudokuBox(9, '12')).runTests();
    // Initialize M, V and C.
    window.sudokuModel = new sudokuModel(BLOCK_SIZE);
    window.sudokuView = new sudokuView(BLOCK_SIZE);
    window.sudokuController = new sudokuController();
    window.sudokuModel.updateAll('init');
}

window.onload = loadPage;
