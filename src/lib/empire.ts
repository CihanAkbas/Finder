import type { Vehicle } from '@/store/slice'

export type EmpireAsset = {
  id: string
  name: string
  kind: 'property' | 'business'
  price: number
  dailyFee: number
  /** Charged only while registered as CEO, VIP, or MC President. */
  registeredOnly: boolean
  note: string
}

/**
 * One of each listing. Prices are published list prices, not a weekly discount.
 * Daily fees are the post-Contract base charges. Upgrade salaries are not added.
 * Weed, cash, and document lockups are omitted because a cheapest list price was not confirmed.
 */
export const EMPIRE_ASSETS: EmpireAsset[] = [
  { id: 'low-apartment', name: 'Low-end apartment · 0120 Murrieta Heights', kind: 'property', price: 25_000, dailyFee: 35, registeredOnly: false, note: 'Utility $25 plus the $10 mechanic.' },
  { id: 'high-apartment', name: 'High-end apartment · 3 Alta Street', kind: 'property', price: 217_000, dailyFee: 85, registeredOnly: false, note: 'Utility $75 plus the $10 mechanic. Other high-end units are listed at different prices.' },
  { id: 'yacht', name: 'Galaxy Super Yacht · Pisces', kind: 'property', price: 6_000_000, dailyFee: 500, registeredOnly: false, note: 'Cheapest yacht. The fee is the same for every model.' },
  { id: 'penthouse', name: 'Casino penthouse', kind: 'property', price: 1_500_000, dailyFee: 310, registeredOnly: false, note: 'Base $300 plus the $10 mechanic. Extra rooms are $25 each and are not included.' },
  { id: 'facility', name: 'Facility · Paleto Bay', kind: 'property', price: 1_250_000, dailyFee: 210, registeredOnly: false, note: 'Base $200 plus the $10 mechanic. The orbital cannon and security room are extra.' },
  { id: 'kosatka', name: 'Kosatka', kind: 'property', price: 2_200_000, dailyFee: 150, registeredOnly: false, note: 'Flat submarine fee.' },
  { id: 'office', name: 'CEO office · Maze Bank West', kind: 'business', price: 1_000_000, dailyFee: 250, registeredOnly: false, note: 'Office fee only. Extra office garages are a separate mechanic charge.' },
  { id: 'small-warehouse', name: 'Small special cargo warehouse', kind: 'business', price: 250_000, dailyFee: 25, registeredOnly: false, note: 'Cheapest small-warehouse list price. A second warehouse is not multiplied here.' },
  { id: 'medium-warehouse', name: 'Medium special cargo warehouse', kind: 'business', price: 880_000, dailyFee: 50, registeredOnly: false, note: '42-crate listing. One warehouse only.' },
  { id: 'large-warehouse', name: 'Large special cargo warehouse', kind: 'business', price: 1_900_000, dailyFee: 75, registeredOnly: false, note: '111-crate listing. One warehouse only.' },
  { id: 'vehicle-warehouse', name: 'Vehicle warehouse · La Mesa', kind: 'business', price: 1_500_000, dailyFee: 10, registeredOnly: false, note: 'No utility fee on the warehouse. $10 is the mechanic.' },
  { id: 'clubhouse', name: 'Clubhouse · Great Chaparral', kind: 'business', price: 200_000, dailyFee: 10, registeredOnly: false, note: 'The clubhouse utility fee is $0. $10 is the mechanic.' },
  { id: 'coke', name: 'Cocaine lockup · Alamo Sea', kind: 'business', price: 975_000, dailyFee: 2_250, registeredOnly: true, note: 'Base fee while registered. Equipment, staff, and security are extra.' },
  { id: 'meth', name: 'Meth lab · Grand Senora Desert', kind: 'business', price: 910_000, dailyFee: 1_800, registeredOnly: true, note: 'Base fee while registered. Upgrades are extra.' },
  { id: 'bunker', name: 'Bunker · Paleto Forest', kind: 'business', price: 1_165_000, dailyFee: 2_000, registeredOnly: true, note: 'Base fee while registered. All three upgrades raise it to $4,500.' },
  { id: 'hangar', name: 'Hangar · LSIA A17', kind: 'business', price: 1_200_000, dailyFee: 260, registeredOnly: false, note: 'Hangar $250 plus the $10 mechanic. The per-aircraft fee is not included.' },
  { id: 'nightclub', name: 'Nightclub · Elysian Island', kind: 'business', price: 1_080_000, dailyFee: 250, registeredOnly: false, note: 'Base fee. Staff, technicians, storage floors, and garage levels are extra.' },
  { id: 'arcade', name: "Arcade · Pixel Pete's", kind: 'business', price: 1_235_000, dailyFee: 260, registeredOnly: false, note: 'Arcade $250 plus the $10 mechanic.' },
  { id: 'autoshop', name: 'Auto shop · Mission Row', kind: 'business', price: 1_670_000, dailyFee: 260, registeredOnly: false, note: 'Auto shop $250 plus the $10 mechanic.' },
  { id: 'salvage', name: 'Salvage yard · Paleto Bay', kind: 'business', price: 1_620_000, dailyFee: 250, registeredOnly: false, note: 'Base salvage yard fee.' },
  { id: 'agency', name: 'Agency, cheapest listing', kind: 'business', price: 2_010_000, dailyFee: 260, registeredOnly: false, note: 'Agency $250 plus the $10 mechanic.' },
  { id: 'acid', name: 'Acid Lab equipment upgrade', kind: 'business', price: 750_000, dailyFee: 250, registeredOnly: false, note: 'The lab upgrade after The First Dose. The Brickade is not a second purchase in this row.' },
  { id: 'bail', name: 'Bail office · Paleto Bay', kind: 'business', price: 1_650_000, dailyFee: 0, registeredOnly: false, note: 'No daily fee was published in the post-Contract table used here.' },
  { id: 'garment', name: 'Garment Factory · Darnell Bros', kind: 'business', price: 2_350_000, dailyFee: 0, registeredOnly: false, note: 'No daily fee was published in the post-Contract table used here.' },
  { id: 'carwash', name: 'Hands On Car Wash', kind: 'business', price: 1_000_000, dailyFee: 0, registeredOnly: false, note: 'No daily fee was published in the post-Contract table used here.' },
  { id: 'helitours', name: 'Higgins Helitours', kind: 'business', price: 900_000, dailyFee: 0, registeredOnly: false, note: 'No daily fee was published in the post-Contract table used here.' },
  { id: 'smoke', name: 'Smoke on the Water', kind: 'business', price: 850_000, dailyFee: 0, registeredOnly: false, note: 'No daily fee was published in the post-Contract table used here.' },
]

export function empireTotals(input: {
  assets: EmpireAsset[]
  vehicles: Vehicle[]
  ownedAssets: string[]
  ownedVehicles: string[]
  includeRegistered: boolean
}) {
  const assets = new Set(input.ownedAssets)
  const vehicles = new Set(input.ownedVehicles)
  let propertyWorth = 0
  let fees = 0
  let registeredFees = 0
  let ownedProperties = 0
  for (const asset of input.assets) {
    if (!assets.has(asset.id)) continue
    ownedProperties += 1
    propertyWorth += asset.price
    if (asset.registeredOnly) registeredFees += asset.dailyFee
    else fees += asset.dailyFee
  }
  let vehicleWorth = 0
  let ownedCars = 0
  let unpriced = 0
  for (const vehicle of input.vehicles) {
    if (!vehicles.has(vehicle.id)) continue
    ownedCars += 1
    if (vehicle.price > 0) vehicleWorth += vehicle.price
    else unpriced += 1
  }
  return {
    worth: propertyWorth + vehicleWorth,
    propertyWorth,
    vehicleWorth,
    fees: fees + (input.includeRegistered ? registeredFees : 0),
    alwaysFees: fees,
    registeredFees,
    ownedProperties,
    ownedCars,
    unpriced,
  }
}
