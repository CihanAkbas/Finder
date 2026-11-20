export type Cheat = { name: string; code: string; effect: string; group: string }
export type ControlRow = { action: string; input: string }

export const CHEAT_GROUPS = ['Health', 'Wanted level', 'Weapons', 'Abilities', 'World', 'Vehicles'] as const

export const CHEATS: Cheat[] = [
  { group: 'Health', name: 'Full health', code: 'PAINKILLER', effect: 'Fills health in story mode.' },
  { group: 'Health', name: 'Full armor', code: 'TURTLE', effect: 'Fills body armor in story mode.' },
  { group: 'Wanted level', name: 'Raise wanted level', code: 'FUGITIVE', effect: 'Adds a wanted star.' },
  { group: 'Wanted level', name: 'Clear wanted level', code: 'LAWYERUP', effect: 'Removes wanted stars.' },
  { group: 'Weapons', name: 'Weapon set', code: 'TOOLUP', effect: 'Gives a set of weapons and ammo.' },
  { group: 'Weapons', name: 'Flaming bullets', code: 'INCENDIARY', effect: 'Bullets set targets on fire.' },
  { group: 'Weapons', name: 'Explosive ammo', code: 'HIGHEX', effect: 'Bullets explode on impact.' },
  { group: 'Abilities', name: 'Recharge special', code: 'POWERUP', effect: 'Fills the special ability bar.' },
  { group: 'Abilities', name: 'Slow motion', code: 'SLOWMO', effect: 'Slows the game for a short time.' },
  { group: 'Abilities', name: 'Super jump', code: 'HOPTOIT', effect: 'Jump height is increased.' },
  { group: 'World', name: 'Sky dive', code: 'SKYDIVE', effect: 'Drops the character high above the map.' },
  { group: 'World', name: 'Breathe underwater', code: 'GOTGILLS', effect: 'The character can stay underwater.' },
  { group: 'World', name: 'Drunk', code: 'LIQUOR', effect: 'The character is drunk for a short time.' },
  { group: 'Vehicles', name: 'Comet', code: 'COMET', effect: 'Spawns a Comet.' },
  { group: 'Vehicles', name: 'Rapid GT', code: 'RAPIDGT', effect: 'Spawns a Rapid GT.' },
  { group: 'Vehicles', name: 'Trashmaster', code: 'TRASHED', effect: 'Spawns a Trashmaster.' },
]

export const CONSOLE_NOTE =
  'On PlayStation and Xbox the same effects are button sequences typed on the in-game phone. Invincibility on PlayStation is Right, X, Right, Left, Right, R1, Right, Left, X, Triangle. The PC words above are the reliable cross-check.'

export const CONTROL_SECTIONS: { title: string; rows: ControlRow[] }[] = [
  {
    title: 'On foot',
    rows: [
      { action: 'Move', input: 'W A S D' },
      { action: 'Sprint', input: 'Left Shift' },
      { action: 'Jump', input: 'Space' },
      { action: 'Crouch', input: 'Left Ctrl' },
      { action: 'Enter or exit', input: 'F' },
      { action: 'Aim / fire', input: 'Right mouse / left mouse' },
      { action: 'Reload', input: 'R' },
      { action: 'Change weapon', input: 'Mouse wheel or number keys' },
    ],
  },
  {
    title: 'Cars and bikes',
    rows: [
      { action: 'Accelerate', input: 'W' },
      { action: 'Brake or reverse', input: 'S' },
      { action: 'Steer', input: 'A / D' },
      { action: 'Handbrake', input: 'Space' },
      { action: 'Change camera', input: 'V' },
      { action: 'Exit', input: 'F' },
    ],
  },
  {
    title: 'Planes',
    rows: [
      { action: 'Pitch and roll', input: 'Mouse, in the default mouse-flight mode' },
      { action: 'Speed', input: 'W faster, S slower' },
      { action: 'Rudder', input: 'A / D' },
      { action: 'Landing gear', input: 'G' },
    ],
  },
  {
    title: 'Helicopters',
    rows: [
      { action: 'Pitch', input: 'W / S' },
      { action: 'Roll', input: 'A / D' },
      { action: 'Yaw', input: 'Mouse, or Q / E' },
      { action: 'Climb', input: 'Left Shift' },
      { action: 'Descend', input: 'Left Ctrl' },
    ],
  },
]
