import type {
  Business,
  ChecklistItem,
  DailyPack,
  Heist,
  PropertyTemplate,
  StockStep,
  Vehicle,
  Weapon,
} from '@/store/slice'
import gta5Checklist from '@/config/games/gta5/checklist.json'
import gta5Daily from '@/config/games/gta5/daily.json'
import gta5Vehicles from '@/config/games/gta5/vehicles.json'
import gta5Weapons from '@/config/games/gta5/weapons.json'
import gta5Heists from '@/config/games/gta5/heists.json'
import gta5Businesses from '@/config/games/gta5/businesses.json'
import gta5Stocks from '@/config/games/gta5/stocks.json'
import gta6Checklist from '@/config/games/gta6/checklist.json'
import gta6Daily from '@/config/games/gta6/daily.json'
import gta6Vehicles from '@/config/games/gta6/vehicles.json'
import gta6Weapons from '@/config/games/gta6/weapons.json'
import gta6Heists from '@/config/games/gta6/heists.json'
import gta6Businesses from '@/config/games/gta6/businesses.json'
import gta6Stocks from '@/config/games/gta6/stocks.json'
import { garageTemplates } from '@/lib/ownership'

export type CompanionData = {
  checklist: ChecklistItem[]
  daily: DailyPack
  vehicles: Vehicle[]
  weapons: Weapon[]
  heists: Heist[]
  businesses: Business[]
  stocks: StockStep[]
  properties: PropertyTemplate[]
}

function pack(data: CompanionData): CompanionData {
  return data
}

const library: Record<string, CompanionData> = {
  gta5: pack({
    checklist: gta5Checklist as ChecklistItem[],
    daily: gta5Daily as DailyPack,
    vehicles: gta5Vehicles as Vehicle[],
    weapons: gta5Weapons as Weapon[],
    heists: gta5Heists as Heist[],
    businesses: gta5Businesses as Business[],
    stocks: gta5Stocks as StockStep[],
    properties: garageTemplates(),
  }),
  gta6: pack({
    checklist: gta6Checklist as ChecklistItem[],
    daily: gta6Daily as DailyPack,
    vehicles: gta6Vehicles as Vehicle[],
    weapons: gta6Weapons as Weapon[],
    heists: gta6Heists as Heist[],
    businesses: gta6Businesses as Business[],
    stocks: gta6Stocks as StockStep[],
    properties: [],
  }),
}

export function getCompanion(slug: string) {
  return library[slug]
}
