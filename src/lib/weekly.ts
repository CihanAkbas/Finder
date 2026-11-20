import gta5Vehicles from '@/config/games/gta5/vehicles.json'
import type { Vehicle } from '@/store/slice'
import { weekIndex } from '@/lib/resets'

const vehicles = gta5Vehicles as Vehicle[]

export type WeeklySlot = {
  label: string
  name: string
  note: string
}

export type WeeklyBoard = {
  bonuses: string[]
  podium: WeeklySlot
  prizeRide: WeeklySlot
  luxury: WeeklySlot
  simeon: WeeklySlot
}

/** November 2026 community archive. The same Thursday week inside this cycle always returns the same card. */
export const SCHEDULE_WEEKS = 4
export const SCHEDULE_MARK = '2026-11'

const BONUSES = [
  ['2x Nightclub goods', '2x Security contracts'],
  ['3x Cayo Perico', '2x MC sell missions'],
  ['2x Agency pay', '2x Auto Shop contracts'],
  ['2x Hangar cargo', '2x Special cargo'],
]

const PODIUM = ['Horus', 'Veleno GT', 'Entity MT', 'Turismo Omaggio', 'Virtue', 'Ignus', 'Thrax', 'Krieger']
const PRIZE = ['Jester RR', 'Calico GTF', 'Vectre', 'Remus', 'Growler', 'Cypher', 'RT3000', 'Euros']
const LUXURY = ['Deity', 'Jubilee', 'Cavalcade XL', 'Baller ST-D', 'Aleutian', 'Astron']
const SIMEON = ['Sentinel GTS', 'Exemplar', 'Felon', 'Jackal', 'Oracle', 'Fugitive', 'Schafter']

function named(list: string[], index: number, label: string, note: string): WeeklySlot {
  const available = list.filter((name) => vehicles.some((vehicle) => vehicle.name === name))
  const pool = available.length ? available : list
  return { label, name: pool[index % pool.length], note }
}

/** Deterministic 4-week archive. Week 0 and week 4 of the Thursday reset are the same card. */
export function thisWeek(now = new Date(), weekday = 4, hourUtc = 10): WeeklyBoard {
  const week = weekIndex(now, weekday, hourUtc)
  const slot = ((week % SCHEDULE_WEEKS) + SCHEDULE_WEEKS) % SCHEDULE_WEEKS
  return {
    bonuses: BONUSES[slot],
    podium: named(PODIUM, slot, 'Podium vehicle', 'Casino Lucky Wheel feature for this schedule week.'),
    prizeRide: named(PRIZE, slot + 1, 'Prize ride', 'LS Car Meet prize ride for this schedule week.'),
    luxury: named(LUXURY, slot + 2, 'Luxury Autos', 'Featured Luxury Autos car for this schedule week.'),
    simeon: named(SIMEON, slot + 3, 'Simeon export', 'Simeon requested-vehicle feature for this schedule week.'),
  }
}
