import type { Cheat } from '@/lib/reference'

/** D-pad sequences confirmed in public guides after the story. Rows without a published sequence are omitted. */
export const GTA6_CHEAT_GROUPS = ['Player', 'Combat', 'Environment', 'Vehicles', 'Filters'] as const

export const GTA6_CONSOLE_NOTE =
  'Open the phone with D-pad Up, hold L1/LB and R1/RB together, then enter the D-pad sequence. Cheats unlock after the story and each row also needs its own condition. Using a cheat turns off trophies and saving for that session. About 61 cheats exist; only sequences published so far are listed here.'

export const GTA6_CHEATS: Cheat[] = [
  {
    group: 'Player',
    name: '$250,000',
    code: 'Up, Right, Down, Left, Up, Left, Down, Right',
    effect: 'Adds $250,000.',
    unlock: 'Finish the story.',
  },
  {
    group: 'Player',
    name: 'Drunk',
    code: 'Up, Left, Right, Up, Up, Left, Right, Up, Left, Right',
    effect: 'Makes Jason and Lucia drunk.',
    unlock: 'Spend $2,500 on alcohol.',
  },
  {
    group: 'Player',
    name: 'Raise Heat Level',
    code: 'Left, Down, Right, Down, Up, Down, Up',
    effect: 'Raises heat across the map.',
    unlock: 'Lose a 3-star wanted level 25 times.',
  },
  {
    group: 'Player',
    name: 'Raise Wanted Level',
    code: 'Left, Down, Right, Down, Up, Right, Up',
    effect: 'Raises the wanted level.',
    unlock: 'Lose a 3-star wanted level 50 times.',
  },
  {
    group: 'Player',
    name: 'Unlimited Focus',
    code: 'Down, Up, Up, Down, Up, Down, Up, Down, Up, Right',
    effect: 'Focus never runs out.',
    unlock: 'Finish the story.',
  },
  {
    group: 'Player',
    name: 'Body Armor',
    code: 'Down, Up, Left, Up, Up, Up, Up, Up, Down, Down',
    effect: 'Adds body armor.',
    unlock: 'Complete 100 workouts.',
  },
  {
    group: 'Combat',
    name: 'Max Ammo',
    code: 'Down, Up, Right, Down, Left, Left, Up, Up, Down, Left',
    effect: 'Fills ammo to maximum.',
    unlock: 'Win 25 bronze medals or higher at shooting ranges.',
  },
  {
    group: 'Combat',
    name: 'Infinite Ammo',
    code: 'Down, Up, Right, Down, Left, Left, Up, Down, Down, Down',
    effect: 'Ammo never runs out.',
    unlock: 'Win 25 silver medals or higher at shooting ranges.',
  },
  {
    group: 'Combat',
    name: 'No Reload',
    code: 'Down, Up, Right, Down, Left, Left, Up, Down, Down, Up',
    effect: 'Ammo never runs out and weapons do not reload.',
    unlock: 'Win 25 gold medals at shooting ranges.',
  },
  {
    group: 'Combat',
    name: 'Attack Force',
    code: 'Down, Up, Left, Left, Right, Down, Down, Up, Down',
    effect: 'Bullets and melee launch targets on impact.',
    unlock: 'Finish the story.',
  },
  {
    group: 'Combat',
    name: 'Exploding Balls',
    code: 'Down, Up, Left, Left, Right, Down, Down, Up, Right',
    effect: 'Sports balls explode on impact.',
    unlock: 'Hit 20 enemies with explosive damage.',
  },
  {
    group: 'Combat',
    name: 'Vehicle Force',
    code: 'Down, Up, Left, Left, Right, Down, Left, Up, Down',
    effect: 'Vehicle collisions launch targets.',
    unlock: 'Kill 25 people with a vehicle.',
  },
  {
    group: 'Environment',
    name: 'Cycle Weather',
    code: 'Down, Right, Up, Down, Right, Up, Right',
    effect: 'Cycles the weather.',
    unlock: 'Reveal the entire map.',
  },
  {
    group: 'Vehicles',
    name: 'Maibatsu Boomazoom',
    code: 'Left, Up, Right, Down, Left, Left, Up, Left',
    effect: 'Spawns a Maibatsu Boomazoom.',
    unlock: 'Complete 5 shopping challenges.',
  },
  {
    group: 'Vehicles',
    name: 'MTL Pumper',
    code: 'Left, Up, Right, Down, Left, Right, Right, Up',
    effect: 'Spawns an MTL Pumper.',
    unlock: 'Discover the MTL Pumper in the Progress menu.',
  },
  {
    group: 'Vehicles',
    name: 'HVY Bulldozer',
    code: 'Left, Up, Right, Down, Left, Right, Right, Down',
    effect: 'Spawns an HVY Bulldozer.',
    unlock: 'Discover the HVY Bulldozer in the Progress menu.',
  },
  {
    group: 'Filters',
    name: 'Cataclysm',
    code: 'Down, Down, Up, Right, Right, Up, Left, Left, Right, Right',
    effect: 'Applies a murky smoke filter.',
    unlock: "Discover Martha's Vamos in Progress.",
  },
  {
    group: 'Filters',
    name: 'Videotape',
    code: 'Down, Down, Up, Right, Right, Up, Left, Left, Right, Down',
    effect: 'Applies a videotape filter.',
    unlock: 'Complete 50 activities with your partner.',
  },
  {
    group: 'Filters',
    name: 'Dark Mirror',
    code: 'Down, Down, Up, Right, Right, Up, Left, Left, Right, Left',
    effect: 'Flips the world and turns it black.',
    unlock: 'Make $500,000 selling vehicles.',
  },
  {
    group: 'Filters',
    name: 'Dollhouse',
    code: 'Down, Down, Up, Right, Right, Up, Left, Left, Down, Right',
    effect: 'Applies a vivid narrow filter.',
    unlock: 'Spend 8 hours with your partner.',
  },
  {
    group: 'Filters',
    name: 'Faded Glory',
    code: 'Down, Down, Up, Right, Right, Up, Left, Left, Left, Right',
    effect: 'Applies a color CRT filter.',
    unlock: 'Rob 50 stores with your partner.',
  },
]
