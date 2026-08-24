export type RevealStage = 1 | 2 | 3;
export type AssetFolder = 'structure' | 'classroom' | 'cafeteria' | 'courtyard';

export interface PositionedAsset {
  readonly id: string;
  readonly folder: AssetFolder;
  readonly file: string;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly z?: number;
  readonly reveal?: RevealStage;
}

export interface FreeActor {
  readonly id: string;
  readonly file: string;
  readonly x: number;
  readonly y: number;
  readonly z?: number;
  readonly reveal?: RevealStage;
  readonly motion?: 'hall-a' | 'hall-b' | 'hall-c' | 'garden' | 'canteen' | 'idle';
}

export const CAMPUS_PROPS: readonly PositionedAsset[] = [
  { id: 'door-class', folder: 'structure', file: 'door-classroom.png', x: 875, y: 184, width: 80, z: 11 },
  { id: 'door-lab', folder: 'structure', file: 'door-classroom.png', x: 1325, y: 188, width: 80, z: 11 },
  { id: 'door-office', folder: 'structure', file: 'door-classroom.png', x: 1815, y: 192, width: 80, z: 11 },
  { id: 'door-canteen', folder: 'structure', file: 'door-classroom.png', x: 1665, y: 446, width: 80, z: 12 },
  { id: 'window-1', folder: 'structure', file: 'window-square.png', x: 670, y: 145, width: 43, z: 10 },
  { id: 'window-2', folder: 'structure', file: 'window-square.png', x: 755, y: 145, width: 43, z: 10 },
  { id: 'window-3', folder: 'structure', file: 'window-square.png', x: 1210, y: 145, width: 43, z: 10 },
  { id: 'window-4', folder: 'structure', file: 'window-square.png', x: 1665, y: 145, width: 43, z: 10 },
  { id: 'window-5', folder: 'structure', file: 'window-square.png', x: 1990, y: 145, width: 43, z: 10 },
  { id: 'chalkboard', folder: 'classroom', file: 'chalkboard.png', x: 650, y: 205, width: 135, z: 12 },
  { id: 'charts', folder: 'classroom', file: 'charts.png', x: 805, y: 226, width: 78, z: 12 },
  { id: 'coatrack-green', folder: 'classroom', file: 'coatrack-green.png', x: 955, y: 254, width: 72, z: 12 },
  { id: 'alarm', folder: 'classroom', file: 'alarm.png', x: 1010, y: 275, width: 42, z: 13 },
  { id: 'bookshelf-1', folder: 'classroom', file: 'bookshelf.png', x: 470, y: 598, width: 92, z: 16 },
  { id: 'bookshelf-2', folder: 'classroom', file: 'bookshelf.png', x: 550, y: 642, width: 92, z: 17 },
  { id: 'bookcase-1', folder: 'classroom', file: 'bookcase.png', x: 675, y: 555, width: 92, z: 15 },
  { id: 'bookcase-2', folder: 'classroom', file: 'bookcase.png', x: 755, y: 602, width: 92, z: 17, reveal: 1 },
  { id: 'projector', folder: 'classroom', file: 'projector.png', x: 1180, y: 215, width: 98, z: 13, reveal: 2 },
  { id: 'science-1', folder: 'classroom', file: 'science-equipment.png', x: 1320, y: 330, width: 52, z: 16 },
  { id: 'science-2', folder: 'classroom', file: 'chem-set.png', x: 1400, y: 365, width: 46, z: 17, reveal: 2 },
  { id: 'coatrack-blue', folder: 'classroom', file: 'coatrack-blue.png', x: 1480, y: 280, width: 72, z: 13, reveal: 1 },
  { id: 'locker-green', folder: 'classroom', file: 'locker.png', x: 1685, y: 290, width: 60, z: 14 },
  { id: 'locker-blue', folder: 'classroom', file: 'locker-blue.png', x: 1745, y: 320, width: 60, z: 15 },
  { id: 'locker-red', folder: 'classroom', file: 'locker-red.png', x: 1805, y: 350, width: 60, z: 16, reveal: 1 },
  { id: 'coatrack-red', folder: 'classroom', file: 'coatrack-red.png', x: 1895, y: 295, width: 72, z: 14, reveal: 2 },
  { id: 'office-desk-1', folder: 'classroom', file: 'teacher-desk.png', x: 1850, y: 345, width: 92, z: 16 },
  { id: 'office-laptop-1', folder: 'classroom', file: 'laptop.png', x: 1900, y: 370, width: 38, z: 19 },
  { id: 'office-desk-2', folder: 'classroom', file: 'teacher-desk.png', x: 1970, y: 410, width: 92, z: 18, reveal: 1 },
  { id: 'office-laptop-2', folder: 'classroom', file: 'laptop.png', x: 2020, y: 435, width: 38, z: 21, reveal: 1 },
  { id: 'office-chair-1', folder: 'cafeteria', file: 'chair.png', x: 1815, y: 395, width: 46, z: 17 },
  { id: 'office-chair-2', folder: 'cafeteria', file: 'chair.png', x: 1935, y: 460, width: 46, z: 19, reveal: 1 },
  { id: 'library-table', folder: 'cafeteria', file: 'table.png', x: 810, y: 690, width: 102, z: 20, reveal: 1 },
  { id: 'library-chair', folder: 'cafeteria', file: 'chair.png', x: 780, y: 740, width: 46, z: 22, reveal: 1 },
  { id: 'canteen-fridge', folder: 'cafeteria', file: 'fridge.png', x: 2110, y: 520, width: 64, z: 17 },
  { id: 'canteen-counter', folder: 'cafeteria', file: 'counter.png', x: 1920, y: 540, width: 120, z: 17 },
  { id: 'canteen-cart', folder: 'cafeteria', file: 'lunch-cart.png', x: 2050, y: 610, width: 120, z: 19, reveal: 1 },
  { id: 'canteen-tray', folder: 'cafeteria', file: 'red-tray.png', x: 1955, y: 535, width: 48, z: 20 },
  { id: 'canteen-veg', folder: 'cafeteria', file: 'vegetables.png', x: 1998, y: 555, width: 42, z: 20, reveal: 2 },
  { id: 'canteen-pizza', folder: 'cafeteria', file: 'pizza.png', x: 2075, y: 600, width: 58, z: 20, reveal: 2 },
  { id: 'canteen-snacks', folder: 'cafeteria', file: 'snacks.png', x: 2145, y: 585, width: 48, z: 20, reveal: 3 },
  { id: 'tree-1', folder: 'courtyard', file: 'tree.png', x: 255, y: 565, width: 145, z: 15 },
  { id: 'tree-2', folder: 'courtyard', file: 'tree.png', x: 690, y: 650, width: 132, z: 20, reveal: 2 },
  { id: 'yard-bench', folder: 'courtyard', file: 'bench.png', x: 390, y: 735, width: 105, z: 21 },
  { id: 'park-bench', folder: 'courtyard', file: 'park-bench.png', x: 610, y: 760, width: 100, z: 22 },
  { id: 'fence-1', folder: 'courtyard', file: 'fence-wood.png', x: 205, y: 735, width: 70, z: 20 },
  { id: 'fence-2', folder: 'courtyard', file: 'fence-wood.png', x: 790, y: 790, width: 70, z: 24 },
  { id: 'fence-3', folder: 'structure', file: 'fence-garden.png', x: 295, y: 815, width: 82, z: 25 },
  { id: 'fence-4', folder: 'structure', file: 'fence-garden.png', x: 710, y: 835, width: 82, z: 26 },
  { id: 'pond', folder: 'courtyard', file: 'garden-pond.png', x: 470, y: 780, width: 100, z: 23 },
  { id: 'pot-1', folder: 'courtyard', file: 'garden-pot.png', x: 330, y: 685, width: 55, z: 18 },
  { id: 'pot-2', folder: 'courtyard', file: 'garden-pot.png', x: 650, y: 720, width: 55, z: 21, reveal: 1 },
  { id: 'frog', folder: 'courtyard', file: 'garden-frog.png', x: 505, y: 806, width: 34, z: 26, reveal: 3 },
  { id: 'swing', folder: 'courtyard', file: 'swing.png', x: 735, y: 620, width: 82, z: 18, reveal: 2 },
  { id: 'slide', folder: 'courtyard', file: 'slide.png', x: 820, y: 705, width: 70, z: 21, reveal: 2 },
  { id: 'play-ramp', folder: 'courtyard', file: 'play-ramp.png', x: 875, y: 755, width: 95, z: 24, reveal: 3 },
  { id: 'sports', folder: 'courtyard', file: 'sports-equipment.png', x: 565, y: 690, width: 72, z: 20, reveal: 1 },
];

export const FREE_ACTORS: readonly FreeActor[] = [
  { id: 'hall-1', file: 'student-walk.png', x: 1060, y: 455, z: 23, motion: 'hall-a' },
  { id: 'hall-2', file: 'courtyard-run.png', x: 1320, y: 500, z: 24, reveal: 1, motion: 'hall-b' },
  { id: 'hall-3', file: 'student-walk.png', x: 1490, y: 455, z: 23, reveal: 2, motion: 'hall-c' },
  { id: 'hall-wave', file: 'courtyard-wave.png', x: 1240, y: 535, z: 25, motion: 'idle' },
  { id: 'library-chat', file: 'student-chat.png', x: 610, y: 660, z: 23, reveal: 1, motion: 'idle' },
  { id: 'library-wave', file: 'student-hand.png', x: 790, y: 675, z: 24, reveal: 2, motion: 'idle' },
  { id: 'garden-run', file: 'courtyard-run.png', x: 330, y: 700, z: 23, motion: 'garden' },
  { id: 'garden-wave', file: 'courtyard-wave.png', x: 520, y: 730, z: 24, reveal: 1, motion: 'idle' },
  { id: 'canteen-queue', file: 'student-walk.png', x: 1720, y: 555, z: 20, motion: 'canteen' },
  { id: 'canteen-chat', file: 'student-chat.png', x: 2015, y: 655, z: 23, reveal: 2, motion: 'idle' },
  { id: 'lab-wave', file: 'student-hand.png', x: 1390, y: 350, z: 19, reveal: 2, motion: 'idle' },
  { id: 'office-teacher', file: 'teacher.png', x: 1920, y: 330, z: 18, reveal: 3, motion: 'idle' },
];
