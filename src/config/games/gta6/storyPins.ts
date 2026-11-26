import type { GameMarker } from '@/types/game'
import { STORY_PIN_TR } from '@/i18n/gta6StoryPins'
import markers from '@/config/games/gta6/markers.json'

const byId = new Map((markers as GameMarker[]).map((marker) => [marker.id, marker]))

function fromPublished(
  baseId: string,
  tip: Omit<GameMarker, 'x' | 'y' | 'image' | 'videoUrl'> & { id: string },
): GameMarker | null {
  const base = byId.get(baseId)
  if (!base) return null
  return {
    ...tip,
    descriptionTr: STORY_PIN_TR[tip.id]?.[1],
    x: base.x,
    y: base.y,
    image: base.image,
    source: 'catalog',
    tags: [...new Set([...(tip.tags ?? []), 'Tip', 'Story help', ...(base.tags ?? [])])],
  }
}

/** Tip and story-help pins. Coordinates are copied from published MapGenie markers only. */
export const GTA6_STORY_PINS: GameMarker[] = [
  fromPublished('gta6-loc-1089552', {
    id: 'gta6-tip-jason-house-stash',
    title: "Jason's House · Floorboard Stash",
    category: 'finder-tips',
    description:
      'Tip · Key Lento\nUntil Buck Me opens BuckMe banking, stash pocket cash under the loose floorboards in Jason’s bedroom at this waterfront house. Pocket cash is lost when you are wasted or busted. The basketball hoop and shed magazines on this lot mark the same house.',
    tags: ['Tip', 'Money', 'Chapter 1'],
  }),
  fromPublished('gta6-loc-1091637', {
    id: 'gta6-tip-sm69-tower',
    title: 'Free SM-69 Sniper · Badger Tower',
    category: 'finder-tips',
    description:
      'Tip · Key Lento\nClimb Badger R&D Tower beside Nifty Threads Island Wear. Use the grey door with electrical warnings, then stairs and ladders to the control room balcony. The free Shrewsbury SM-69 leans on the railing ($1,850 at Expanded Ammu-Nation). Same climb: Delights card Thelma on the desk, parachute on the roof. Store the rifle in your personal trunk so it stays owned.',
    tags: ['Tip', 'Weapon', 'Chapter 1'],
  }),
  fromPublished('gta6-loc-1090290', {
    id: 'gta6-tip-brian-lockup',
    title: "Brian's Lockup · Code 7700",
    category: 'finder-tips',
    description:
      'Tip · Story help · Lab Fees\nSouthwest Key Lento by Isla Tropical Private Club. Keypad code 7700 (Brian texts it during Lab Fees after Moonstone Boutique). Early fence for narcotics, jewelry and marked bills at very low rates. Deposit completes Lab Fees drop-offs. Boutique back-room code reported as 0420.',
    tags: ['Tip', 'Story', 'Lab Fees', 'Fence'],
  }),
  fromPublished('gta6-loc-1090295', {
    id: 'gta6-tip-donnie-trailer',
    title: "Donnie's Trailer · Early Fence",
    category: 'finder-tips',
    description:
      'Tip · Story help · Clean Up After Donnie\nMid-island Key Lento, north of Nifty Threads. Opens as a fence after Clean Up After Donnie. Pays low for narcotics and very low for jewelry/marked bills — often better than Brian for drugs. Green drop crate. Related missions: Clean Up After Donnie, Don Gone, Island Dreams dive chain.',
    tags: ['Tip', 'Story', 'Fence'],
  }),
  fromPublished('gta6-loc-1090009', {
    id: 'gta6-tip-gear-up-ammu',
    title: "Gear Up · Chuck's Tackle & Shot",
    category: 'finder-story',
    description:
      'Story help · Gear Up\nKey Lento Ammu-Nation used in Gear Up for Jason’s early longarm. Everyday inventory is limited here; Expanded shops elsewhere stock the paid SM-69.',
    tags: ['Story', 'Gear Up'],
  }),
  fromPublished('gta6-loc-1090615', {
    id: 'gta6-tip-just-a-scratch',
    title: "Just a Scratch · Key Lento Pay 'n' Spray",
    category: 'finder-story',
    description:
      'Story help · Just a Scratch\nRespray and repair stop for the Ganado before Lucia’s release. After this mission you can call Joey to bring your car. Pay ’n’ Spray also clears vehicle heat later.',
    tags: ['Story', 'Just a Scratch'],
  }),
  fromPublished('gta6-loc-1090289', {
    id: 'gta6-tip-kenton-diving',
    title: 'Kenton · Diving & Island Dreams',
    category: 'finder-story',
    description:
      'Story help · Island Dreams\nKenton’s Key Lento shop starts diving tours and pays for ocean-floor treasure. Scuba gear is on Kenton’s boat and Jason’s boat. Metal detector is on the weapon wheel.',
    tags: ['Story', 'Island Dreams', 'Diving'],
  }),
  fromPublished('gta6-loc-1090285', {
    id: 'gta6-tip-moses-register',
    title: 'Moses · Chop Shop & Registration',
    category: 'finder-story',
    description:
      'Story help · Moses / Chapter 2\nPort Gellhorn contact. Buys untracked cars, repairs, resprays, and opens personal registration (first register free). Chapter 1 cars stay temporary until this unlock.',
    tags: ['Story', 'Moses', 'Garage'],
  }),
  fromPublished('gta6-loc-1090284', {
    id: 'gta6-tip-randy-cars',
    title: 'Randy · High-End Fence',
    category: 'finder-story',
    description:
      'Story help · Chapter 3\nBalsero showroom contact. Buys certain high-end vehicles and offers repairs/resprays. After Randy, Pay ’n’ Sprays can register standard-tracker cars.',
    tags: ['Story', 'Randy', 'Garage'],
  }),
  fromPublished('gta6-loc-1091097', {
    id: 'gta6-tip-port-gellhorn-garage',
    title: 'Port Gellhorn Station Garage',
    category: 'finder-story',
    description:
      'Story help · Daily Driver\nFree garage unlocked from Daily Driver. One of the story-given parking spots for registered cars.',
    tags: ['Story', 'Garage', 'Daily Driver'],
  }),
  fromPublished('gta6-loc-1091095', {
    id: 'gta6-tip-thompson-court',
    title: 'Thompson Court Garage',
    category: 'finder-story',
    description:
      'Story help · Company Cars\nOcean Beach garage that opens from Company Cars. Story-given parking for registered vehicles.',
    tags: ['Story', 'Garage', 'Company Cars'],
  }),
  fromPublished('gta6-loc-1096677', {
    id: 'gta6-tip-del-rio-garage',
    title: 'Del Rio Boulevard Garage',
    category: 'finder-story',
    description:
      'Story help · Vanessa laptop (Chapter 3)\nPurchasable/story garage on Del Rio. Vanessa’s Chapter 3 laptop can add this with a free pink Pfister Growler if solved before the chapter ends.',
    tags: ['Story', 'Garage', 'Missable'],
  }),
  fromPublished('gta6-loc-1089703', {
    id: 'gta6-tip-hauner-rhino',
    title: 'Mile Zero · Hauner Rhino Access',
    category: 'finder-tips',
    description:
      'Tip · Chapter 1 optional\nHauner Rhino sits at Mile Zero Air Station, reached with a stunt jump into the base. Taking it draws a six-star response. This pin uses the published south stunt-jump marker at the air station.',
    tags: ['Tip', 'Vehicle', 'Wanted'],
  }),
  fromPublished('gta6-loc-1091266', {
    id: 'gta6-tip-nifty-threads',
    title: 'Nifty Threads · Tower Landmark',
    category: 'finder-tips',
    description:
      'Tip · Key Lento\nShirt shop next to Badger R&D Tower. Use this as the waypoint for the free SM-69 climb. Donnie’s trailer sits mid-island north of here.',
    tags: ['Tip', 'Landmark'],
  }),
  fromPublished('gta6-loc-1090288', {
    id: 'gta6-tip-dunk-fence',
    title: "Dunk's Trailer · Cheap Fence",
    category: 'finder-tips',
    description:
      'Tip · Port Gellhorn\nContact fence that pays what little he can for stolen goods. Useful once Port Gellhorn opens; rates stay low across narcotics, jewelry and marked bills.',
    tags: ['Tip', 'Fence'],
  }),
  fromPublished('gta6-loc-1090286', {
    id: 'gta6-tip-yasmani',
    title: 'Yasmani · Jewelry Fence',
    category: 'finder-story',
    description:
      'Story help · Yasmani jewelry jobs\nLittle Cuba contact. Strong jewelry and marked-bill payouts; can arrange garage pickups for a cut. Tied to Yasmani’s Jewelry Jobs.',
    tags: ['Story', 'Fence', 'Yasmani'],
  }),
  fromPublished('gta6-loc-1090287', {
    id: 'gta6-tip-tyrone',
    title: 'Tyrone · Narcotics Fence',
    category: 'finder-story',
    description:
      'Story help · Chapter 3\nLa Perle apartment contact. Highest early Vice City rate band for narcotics among published contact pins.',
    tags: ['Story', 'Fence', 'Tyrone'],
  }),
  fromPublished('gta6-loc-1090132', {
    id: 'gta6-tip-buckme-fleeca',
    title: 'Buck Me · Key Lento Fleeca',
    category: 'finder-story',
    description:
      'Story help · Buck Me\nKey Lento Fleeca, the bank used to open Lucia’s BuckMe account. After this mission, deposit pocket cash here or at an ATM. The floorboard stash at Jason’s house is only for the stretch before the account exists.',
    tags: ['Story', 'Buck Me', 'Money'],
  }),
  fromPublished('gta6-loc-1091530', {
    id: 'gta6-tip-crastenburg',
    title: 'Hey Arnold · Crastenburg',
    category: 'finder-story',
    description:
      'Story help · Hey Arnold\nMeet Brian at the Crastenburg Hotel. This pin is the published poolside bar at that hotel.',
    tags: ['Story', 'Hey Arnold'],
  }),
  fromPublished('gta6-loc-1089607', {
    id: 'gta6-tip-rusty-anchor',
    title: 'Day Release · Rusty Anchor',
    category: 'finder-story',
    description:
      'Story help · Day Release\nMeet Kat and Mattia at The Rusty Anchor in Key Lento. Sunglasses for Lucia are missable in this mission.',
    tags: ['Story', 'Day Release'],
  }),
  fromPublished('gta6-loc-1091085', {
    id: 'gta6-tip-thrillbillies',
    title: 'Thrillbillies · Mud Club',
    category: 'finder-story',
    description:
      'Story help · Thrillbillies\nPublished rental desk at Thrillbilly Mud Club. The story race and the dirt-track events are on these grounds.',
    tags: ['Story', 'Thrillbillies'],
  }),
  fromPublished('gta6-loc-1089608', {
    id: 'gta6-tip-delights',
    title: 'Afternoon Delight · Delights',
    category: 'finder-story',
    description:
      'Story help · Afternoon Delight\nMeet Vicki at Delights Cabaret in Port Gellhorn. The club pin is the published waypoint.',
    tags: ['Story', 'Afternoon Delight'],
  }),
  fromPublished('gta6-loc-1089675', {
    id: 'gta6-tip-starlet-motel',
    title: 'Checking Out · Starlet Motel',
    category: 'finder-story',
    description:
      'Story help · Checking Out\nThe chapter leaves the motel. This published stunt sits on the construction pile in front of the Starlet Motel. The room door is not a separate pin.',
    tags: ['Story', 'Checking Out'],
  }),
  fromPublished('gta6-loc-1090019', {
    id: 'gta6-tip-hamlet-ammo',
    title: 'Hamlet Traders · Ammu-Nation',
    category: 'finder-tips',
    description:
      'Tip · Hamlet\nHamlet Ammu-Nation with the standard pawn inventory. Hamlet Correctional, where Coming Home picks Lucia up, has no published map pin.',
    tags: ['Tip', 'Weapon', 'Hamlet'],
  }),
  fromPublished('gta6-loc-1090298', {
    id: 'gta6-tip-pete',
    title: 'Pete · Aerial Drop-offs',
    category: 'finder-tips',
    description:
      'Tip · Wild Hog Point\nPete texts aerial drop-off spots for narcotics. This is the published contact pin.',
    tags: ['Tip', 'Fence', 'Pete'],
  }),
  fromPublished('gta6-loc-1091747', {
    id: 'gta6-tip-animal-crackers',
    title: 'Animal Crackers · Wetlands Circuit',
    category: 'finder-tips',
    description:
      'Tip · Grassrivers\nRace 1 of the published Animal Crackers set (Big Pine, Wetlands). Seven more circuits sit in the Animal Crackers layer.',
    tags: ['Tip', 'Racing'],
  }),
].filter((marker): marker is GameMarker => Boolean(marker))

export const GTA6_STORY_CATEGORIES = [
  {
    id: 'finder-help',
    name: 'Tips & story help',
    icon: 'landmark',
    color: '#fbbf24',
    description: 'Published spots with tip and mission notes',
    children: [
      {
        id: 'finder-tips',
        name: 'Tips',
        icon: 'landmark',
        color: '#34d399',
        description: `${GTA6_STORY_PINS.filter((m) => m.category === 'finder-tips').length} pins.`,
      },
      {
        id: 'finder-story',
        name: 'Story help',
        icon: 'landmark',
        color: '#f472b6',
        description: `${GTA6_STORY_PINS.filter((m) => m.category === 'finder-story').length} pins.`,
      },
    ],
  },
]
