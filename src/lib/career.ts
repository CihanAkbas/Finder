export type CareerGroup = 'Businesses' | 'Heists' | 'Recreation'

export type CareerTier = {
  tier: 1 | 2 | 3 | 4
  challenges: string[]
  reward: string
  cash: number
  rp: number
}

export type CareerBranch = {
  id: string
  name: string
  group: CareerGroup
  note?: string
  tiers: CareerTier[]
}

type TierInput = { challenges: string[]; reward: string; cash?: number; rp?: number }

function branch(id: string, name: string, group: CareerGroup, tiers: TierInput[], note?: string): CareerBranch {
  return {
    id,
    name,
    group,
    note,
    tiers: tiers.map((tier, index) => ({
      tier: (index + 1) as CareerTier['tier'],
      challenges: tier.challenges,
      reward: tier.reward,
      cash: tier.cash ?? 0,
      rp: tier.rp ?? 0,
    })),
  }
}

const prize = { cash: 250_000, rp: 10_000 }

/** Manual checklist from the GTA Wiki Career Progress tables. It does not read a Rockstar account. */
export const CAREER: CareerBranch[] = [
  branch('gunrunning', 'Gunrunning', 'Businesses', [
    { challenges: ['Set up a Bunker', 'Complete a Resupply mission', 'Complete a Research project'], reward: 'All American Service Shirt' },
    { challenges: ['Deliver excess weapon parts to Ammu-Nation', 'Complete a Mobile Operation', 'Complete a Sell mission'], reward: 'Disruption Logistics Hoodie' },
    { challenges: ['Complete all challenges for 1 weapon at the Bunker shooting range', 'Complete 25 Resupply missions', 'Upgrade 5 weapons to Mk II'], reward: 'Hunting Camo livery for the HVY Insurgent Pick-Up Custom' },
    { challenges: ['Complete all Mobile Operations on Hard difficulty in under 10 minutes', 'Complete all challenges at the Bunker shooting range', 'Research 25 projects', 'Earn $25,000,000 selling weapons'], reward: 'BF Dune FAV', ...prize },
  ]),
  branch('after-hours', 'After Hours · Nightclub', 'Businesses', [
    { challenges: ['Set up a Nightclub', 'Complete a Club Management mission', 'Dance for 5 minutes inside a Nightclub'], reward: 'Maisonette Cap' },
    { challenges: ['Hire a second resident DJ', 'Source goods for your Nightclub basement', 'Eject a troublemaker from your Nightclub'], reward: 'Maisonette Festival T-Shirt' },
    { challenges: ['Hire all resident DJs', 'Fill up your Nightclub safe', 'Complete 25 Club Management missions'], reward: 'Dolla Dolla livery for the Mammoth Patriot Stretch' },
    { challenges: ['Unlock 8 Platinum Awards for After Hours', 'Have 25 celebrity appearances at your Nightclub', 'Keep your Nightclub popularity at 100% for 10 hours', 'Earn a total of $50,000,000 or more'], reward: 'Enus Stafford', ...prize },
  ]),
  branch('smugglers-run', "Smuggler's Run", 'Businesses', [
    { challenges: ['Set up a Hangar', 'Complete a Source Cargo mission', 'Send a staff member to source Air Freight Cargo'], reward: "Rootin' Tootin' Cap" },
    { challenges: ['Turn a Pegasus vehicle into a Personal Aircraft', 'Complete 10 Source Cargo missions', 'Complete an Air Freight Cargo sell mission'], reward: 'Orange Trickster Type Denim' },
    { challenges: ['Complete 25 Source Cargo missions', 'Fill your Hangar with Air Freight Cargo', 'Sell 50 crates of the same type of Air Freight Cargo in one sale'], reward: "Keep Runnin' Jacket" },
    { challenges: ['Complete 100 Source Cargo missions', 'Sell 1,000 crates of Air Freight Cargo', 'Sell all types of Air Freight Cargo', 'Earn $50,000,000 selling Air Freight Cargo'], reward: 'Nagasaki Havok', ...prize },
  ]),
  branch('the-contract', 'The Contract · Agency', 'Businesses', [
    { challenges: ['Set up the Agency', 'Complete a Security Contract', 'Meet the VIP'], reward: 'Trickster Agency Longsleeve' },
    { challenges: ['Complete any Data Leak during the VIP Contract', 'Complete 10 Payphone Hits', 'Complete 10 Security Contracts'], reward: 'Blue WCC DJ Pooh Tee' },
    { challenges: ['Complete the VIP Contract', 'Complete 25 Payphone Hits with the Assassination Bonus', 'Complete all Short Trips playing as Franklin and Lamar'], reward: 'Record A Studios Hoodie' },
    { challenges: ['Unlock 10 Platinum Awards for The Contract', 'Complete 100 Security Contracts on Specialist or Specialist+', 'Complete 100 Payphone Hits with the Assassination Bonus', 'Earn $5,000,000 from Security Contracts'], reward: 'Vapid Youga Custom', ...prize },
  ]),
  branch('bikers', 'Bikers', 'Businesses', [
    { challenges: ['Become President of a Motorcycle Club', 'Hire a player to join your Motorcycle Club', 'Complete a Clubhouse Contract'], reward: 'UR Baseball Tee' },
    { challenges: ['Deliver a customer bike', 'Set up any Biker business', 'Complete a Resupply mission for any Biker business'], reward: 'White Western Hoodie' },
    { challenges: ['Complete all Clubhouse Contracts', 'Sell product from all Biker businesses', 'Resupply the Clubhouse bar 10 times'], reward: 'UR Biker Jacket' },
    { challenges: ['Earn $25,000,000 selling product', 'Earn $2,500,000 delivering customer bikes', 'Earn $500,000 from your Clubhouse bar', 'Complete 50 Clubhouse Contracts'], reward: 'Western Daemon', ...prize },
  ]),
  branch('finance-felony', 'Further Adventures in Finance and Felony', 'Businesses', [
    { challenges: ['Become CEO of an Organization', 'Hire a player to join your Organization', 'Complete a VIP Work'], reward: 'SecuroServ Baseball Tee' },
    { challenges: ['Export Mixed Goods to the docks', 'Own a Special Cargo Warehouse', 'Source Cargo for your warehouse'], reward: 'Flying Bravo Pooch Overcoat' },
    { challenges: ['Source all types of Cargo', 'Sell 111 crates of Cargo in one sell mission', 'Complete 5 different VIP Works'], reward: 'Orange Pinstripe Smoking Jacket' },
    { challenges: ['Complete 10 different VIP Works and Challenges', 'Source all types of Special Items', 'Source 250 crates of Cargo', 'Earn $50,000,000 selling Cargo'], reward: 'Enus Windsor Drop', ...prize },
  ]),
  branch('drug-wars', 'Los Santos Drug Wars', 'Businesses', [
    { challenges: ['Complete all missions for The First Dose', 'Set up an Acid Lab', 'Complete 10 Source Supplies missions for the Acid Lab'], reward: 'Fatal Incursion Baseball Bat finish' },
    { challenges: ['Complete all missions for The Last Dose', 'Complete all Fooligan Jobs', 'Earn $1,000,000 selling Acid'], reward: 'Dildodude T-Shirt' },
    { challenges: ['Unlock all custom acid names', 'Complete 25 Fooligan Jobs without dying', 'Take out 100 hostile versions of yourself in The Last Dose - Checking In'], reward: "Luchadora's Mask" },
    { challenges: ['Unlock 10 Platinum Awards for Los Santos Drug Wars', 'Complete 100 Source Supplies missions for the Acid Lab', 'Complete all missions in The First Dose and The Last Dose without dying', 'Earn $10,000,000 selling Acid'], reward: 'Zirconium Journey II', ...prize },
  ]),
  branch('chop-shop', 'The Chop Shop', 'Businesses', [
    { challenges: ['Set up a Salvage Yard', 'Meet with Yusuf Amir', 'Complete a Salvage Yard Robbery'], reward: "Red's Cap" },
    { challenges: ['Sell a vehicle', 'Salvage a vehicle', 'Earn $250,000 from salvaging vehicles'], reward: "Red's Overalls" },
    { challenges: ['Complete all Salvage Yard Robberies', 'Sell 5 vehicles in perfect condition from Salvage Yard Robberies', 'Complete all bonus challenges for a Salvage Yard Robbery'], reward: 'The Sultan outfit' },
    { challenges: ['Unlock 10 Platinum Awards for The Chop Shop', 'Earn $2,500,000 from salvaging vehicles', 'Complete all bonus challenges for all Salvage Yard Robberies', 'Earn $10,000,000 from selling stolen vehicles'], reward: 'Nagasaki Buzzard Attack Chopper', ...prize },
  ]),
  branch(
    'agents-of-sabotage',
    'Agents of Sabotage',
    'Businesses',
    [
      { challenges: ['Acquire the Garment Factory', 'Meet with Pavel', 'Complete a File'], reward: "Pavel's Garrison Cap" },
      { challenges: ['Complete 5 Files', 'Complete 2 Files without losing a life', 'Earn $25,000 in additional Garment Factory earnings'], reward: 'Terrorbyte livery' },
      { challenges: ['Complete all the Files', 'Complete the priority File 2 weeks in a row', 'Complete all mission challenges for a File'], reward: "Pavel's Tank Top" },
      { challenges: ['Unlock 9 Platinum Awards for Agents of Sabotage', 'Complete 25 Files', 'Complete all mission challenges for all Files', 'Earn $100,000 in additional Garment Factory earnings'], reward: 'Vapid Firebolt ASP', ...prize },
    ],
    'The GTA Wiki notes that the Tier 1 and Tier 3 rewards are swapped in the game. This list follows the wiki table.',
  ),
  branch('bottom-dollar', 'Bottom Dollar Bounties', 'Businesses', [
    { challenges: ['Set up a Bail Office', 'Meet with Maude Eccles', 'Secure or eliminate a bounty target'], reward: 'Bottom Dollar Jacket' },
    { challenges: ['Secure or eliminate 5 standard bounty targets', 'Secure or eliminate 2 Most Wanted bounty targets', 'Earn $250,000 from securing or eliminating bounty targets'], reward: 'Stun Gun finish' },
    { challenges: ['Secure or eliminate 10 bounty targets without losing a life', 'Secure or eliminate a Most Wanted bounty target 3 days in a row', 'Secure or eliminate 25 bounty targets'], reward: 'The Bottom Dollar' },
    { challenges: ['Unlock 10 Platinum Awards for Bottom Dollar Bounties', 'Secure all bounty targets alive', 'Earn $1,000,000 in additional income from your Bail Office agents', 'Earn $5,000,000 from securing or eliminating bounty targets'], reward: 'Canis Castigator', ...prize },
  ]),
  branch('money-fronts', 'Money Fronts', 'Businesses', [
    { challenges: ['Meet Mr. Faber', 'Acquire the Hands On Car Wash', 'Complete any job at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours'], reward: 'Hands On Car Wash Cap' },
    { challenges: ['Acquire Higgins Helitours', 'Complete 10 jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours', 'Collect $100,000 from the safe inside the Hands On Car Wash'], reward: 'Higgins Helitours Tee' },
    { challenges: ['Acquire Smoke on the Water', 'Earn $500,000 from jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours', 'Obtain the maximum possible bonus in one Mr. Faber Work'], reward: 'Smoke on the Water Hoodie' },
    { challenges: ['Unlock 14 Platinum Awards for Money Fronts', 'Obtain the maximum possible bonus in all Mr. Faber Works', 'Earn $2,000,000 from jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours', 'Collect $500,000 from the safe inside the Hands On Car Wash'], reward: 'Brute Pony', ...prize },
  ]),
  branch('tuners', 'Los Santos Tuners', 'Recreation', [
    { challenges: ['Visit and become a member of the LS Car Meet', 'Take a vehicle into the LS Car Meet Test Track', 'Set up an Auto Shop'], reward: 'LS Car Meet Cap' },
    { challenges: ['Complete any Robbery Contract', 'Service and deliver 10 customer vehicles', 'Reach LS Car Meet reputation level 10'], reward: 'Atomic Tires livery for the Karin Previon' },
    { challenges: ['Complete all Robbery Contracts', 'Complete a Prize Ride Challenge', 'Deliver all 10 Exotic Exports vehicles in a day'], reward: 'Santo Capra Meet Hoodie' },
    { challenges: ['Unlock 10 Platinum Awards for Los Santos Tuners', 'Complete 25 Robbery Contracts', 'Earn $5,000,000 delivering customer vehicles', 'Reach LS Car Meet reputation level 100'], reward: 'Grotti Turismo Classic', ...prize },
  ]),
  branch('diamond-casino', 'Diamond Casino & Resort', 'Recreation', [
    { challenges: ['Visit The Diamond Casino & Resort', 'Purchase a penthouse and visit Agatha Baker', 'Complete Loose Cheng'], reward: 'Inside Track Baseball Tee' },
    { challenges: ['Complete Cashing Out', 'Recover the bonus item after completing Cashing Out', 'Complete Casino Work for Agatha Baker'], reward: 'The Diamond Casino Varsity' },
    { challenges: ['Complete 13 different Casino Work missions', 'Complete all Casino Story missions on Hard difficulty', "Take out Avery's bodyguards without being spotted in Cashing Out"], reward: 'Champagne Hoodie' },
    { challenges: ['Unlock 11 Platinum Awards for The Diamond Casino & Resort', 'Complete all Casino Story missions on Hard difficulty while taking less than 50% damage', 'Complete all Casino Story missions on Hard difficulty using only pistols', 'Complete 100 Casino Work missions for Agatha Baker'], reward: 'Enus Paragon R', ...prize },
  ]),
  branch('cayo', 'Cayo Perico Heist', 'Heists', [
    { challenges: ['Meet Miguel Madrazo inside The Music Locker', 'Set up a Kosatka', 'Find where the Madrazo files are being held'], reward: 'VIP Charter Jets Cap' },
    { challenges: ['Complete The Cayo Perico Heist as a leader', 'Help Tom Connors or English Dave with a DJ request', 'Find 10 treasure chests on Cayo Perico'], reward: 'VDG Kaleidoscope T-Shirt' },
    { challenges: ['Complete The Cayo Perico Heist on Hard difficulty', 'Complete 25 prep work missions without dying', 'Complete all DJ requests for Tom Connors and English Dave'], reward: 'Blue DS Panthers Cardigan' },
    { challenges: ['Unlock 15 Platinum Awards for The Cayo Perico Heist', 'Steal all variations of the primary target', 'Complete The Cayo Perico Heist using all approaches', 'Steal $50,000,000 in primary and secondary targets'], reward: 'Vapid Winky', ...prize },
  ]),
  branch('casino-heist', 'The Diamond Casino Heist', 'Heists', [
    { challenges: ['Meet Lester Crest at Mirror Park', 'Set up an Arcade', 'Scope the contents of the Casino vault'], reward: 'Street Crimes Tank Top' },
    { challenges: ['Complete The Diamond Casino Heist', 'Complete 25 prep missions', 'Play an arcade game'], reward: 'Bugstars Hoodie' },
    { challenges: ['Complete The Diamond Casino Heist using all approaches', 'Unlock all crew members', 'Complete The Diamond Casino Heist in under 10 minutes on Hard difficulty'], reward: 'Blue Emissive Lady Liberty mask' },
    { challenges: ['Unlock 15 Platinum Awards for The Diamond Casino Heist', 'Steal all variations of loot from the vault on Hard difficulty, without being spotted', 'Steal $50,000,000 from the vault', 'Steal $100,000 from the Daily Vault'], reward: 'Grotti Furia', ...prize },
  ]),
  branch('doomsday', 'The Doomsday Heist', 'Heists', [
    { challenges: ['Set up a Facility and meet Lester Crest', 'Set up The Data Breaches', 'Complete any setup for The Data Breaches'], reward: 'Cliffford Cap' },
    { challenges: ['Complete The Data Breaches as a leader', 'Set up The Bogdan Problem', 'Complete The Bogdan Problem as a leader'], reward: 'Cliffford Remote' },
    { challenges: ['Set up The Doomsday Scenario', 'Complete The Doomsday Scenario as a leader', 'Complete 14 prep missions without dying'], reward: 'Tartan livery for the TM-02 Khanjali' },
    { challenges: ['Unlock 10 Platinum Awards for The Doomsday Heist', 'Complete all 3 Acts using only pistols and vehicles', 'Complete the Elite Challenges for all 3 Acts', 'Complete 15 Acts as a leader'], reward: 'HVY Barrage', ...prize },
  ]),
  branch('original-heists', 'Original Heists', 'Heists', [
    { challenges: ['Own a high-end or custom apartment', 'Set up The Fleeca Job', 'Complete a setup for The Fleeca Job as a leader'], reward: 'Golden Balaclava' },
    { challenges: ['Complete The Fleeca Job as a leader', 'Complete Prison Break as a leader', 'Complete The Humane Labs Raid as a leader'], reward: 'Inmate T-Shirt' },
    { challenges: ['Complete Series A Funding as a leader', 'Complete The Pacific Standard Job as a leader', 'Complete all heists with the same crew'], reward: 'Stance Andreas livery for the Karin Kuruma' },
    { challenges: ['Unlock 15 Platinum Awards for heists', 'Earn $50,000,000 across all heists', 'Complete the Elite Challenge for each heist', 'Complete the Criminal Mastermind challenge'], reward: 'Karin Kuruma (Armored)', ...prize },
  ]),
  branch('kortz', 'The Kortz Center Heist', 'Heists', [
    { challenges: ['Meet Raf De Angelis inside your Mansion', 'Scope out the Kortz Center', 'Complete any heist prep for The Kortz Center Heist'], reward: 'Kortz T-Shirt' },
    { challenges: ['Complete The Kortz Center Heist', 'Complete 20 heist preps for The Kortz Center Heist', 'Scope all secondary targets'], reward: 'Kortz Bomber Jacket' },
    { challenges: ['Complete The Kortz Center Heist on Hard mode without being spotted', 'Keep a stolen painting for your Mansion', 'Use all 4 entry points: Loading Bay, Sewer, Staff Entrance, and Skylight'], reward: 'Grotti Silhouette livery for the Grotti Cartuccia GT' },
    { challenges: ['Unlock 15 Platinum Awards for The Kortz Center Heist', 'Complete the Elite Challenge for The Kortz Center Heist', 'Keep any 5 stolen paintings for your Mansion', 'Steal a total of $50,000,000 in primary and secondary targets'], reward: 'Vapid Caracara (Armored)', ...prize },
  ]),
]

export function tierKey(branchId: string, tier: number) {
  return `${branchId}:${tier}`
}

export function careerScore(done: string[]) {
  const keys = new Set(done)
  const total = CAREER.length * 4
  let have = 0
  for (const item of CAREER) {
    for (const tier of item.tiers) {
      if (keys.has(tierKey(item.id, tier.tier))) have += 1
    }
  }
  return { have, total }
}
