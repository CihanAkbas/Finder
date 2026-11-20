import type { Locale } from '@/i18n/locale'
import { dollars } from '@/lib/money'
import type { Vehicle } from '@/store/slice'

export function hswEligible(vehicle: Vehicle) {
  return Boolean(vehicle.isHsw || vehicle.hsw)
}

export type StatId = 'speed' | 'lap' | 'accel' | 'brake' | 'traction' | 'price' | 'hsw' | 'drive' | 'seats'

export const COMPARE_STATS: { id: StatId; label: string; better: 'high' | 'low' | 'none' }[] = [
  { id: 'speed', label: 'Top speed', better: 'high' },
  { id: 'lap', label: 'Lap time', better: 'low' },
  { id: 'accel', label: 'Acceleration', better: 'none' },
  { id: 'brake', label: 'Braking', better: 'none' },
  { id: 'traction', label: 'Traction', better: 'none' },
  { id: 'price', label: 'Price', better: 'low' },
  { id: 'hsw', label: 'HSW eligibility', better: 'none' },
  { id: 'drive', label: 'Drivetrain', better: 'none' },
  { id: 'seats', label: 'Seats', better: 'none' },
]

const RACING_ORDER = ['Super', 'Sports', 'Muscle', 'Off-Road', 'Sports Classic', 'Motorcycle', 'Open Wheel', 'Coupe', 'Sedan', 'SUV', 'Compact']

export function statNumber(vehicle: Vehicle, id: StatId) {
  if (id === 'speed') return vehicle.topSpeedMph > 0 ? vehicle.topSpeedMph : null
  if (id === 'lap') return vehicle.lapTime > 0 ? vehicle.lapTime : null
  if (id === 'price') return vehicle.price > 0 ? vehicle.price : null
  return null
}

export function statText(vehicle: Vehicle, id: StatId, locale: Locale = 'en') {
  if (id === 'speed') return vehicle.topSpeedMph > 0 ? `${vehicle.topSpeedMph} mph · ${vehicle.topSpeedKmh} km/h` : '—'
  if (id === 'lap') return vehicle.lapTime > 0 ? `${vehicle.lapTime.toFixed(1)} s` : '—'
  if (id === 'accel' || id === 'brake' || id === 'traction') return '—'
  if (id === 'price') return vehicle.price > 0 ? dollars(vehicle.price, locale) : '—'
  if (id === 'hsw') return hswEligible(vehicle) ? (locale === 'tr' ? 'Uygun' : 'Eligible') : locale === 'tr' ? 'Hayır' : 'No'
  if (id === 'drive') return vehicle.drivetrain || '—'
  if (id === 'seats') return vehicle.seats > 0 ? String(vehicle.seats) : '—'
  return '—'
}

export function winningIds(vehicles: Vehicle[], id: StatId, better: 'high' | 'low' | 'none') {
  if (better === 'none' || vehicles.length < 2) return new Set<string>()
  const scored = vehicles.flatMap((vehicle) => {
    const score = statNumber(vehicle, id)
    return score == null ? [] : [{ id: vehicle.id, score }]
  })
  if (!scored.length) return new Set<string>()
  const best = better === 'high' ? Math.max(...scored.map((row) => row.score)) : Math.min(...scored.map((row) => row.score))
  return new Set(scored.filter((row) => row.score === best).map((row) => row.id))
}

export type ClassRank = {
  className: string
  total: number
  measured: number
  byLap: Vehicle[]
  bySpeed: Vehicle[]
}

export function bestInClass(vehicles: Vehicle[]): ClassRank[] {
  const names = [...new Set(vehicles.map((vehicle) => vehicle.class))]
  names.sort((a, b) => {
    const ai = RACING_ORDER.indexOf(a)
    const bi = RACING_ORDER.indexOf(b)
    if (ai !== -1 || bi !== -1) return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
    return a.localeCompare(b)
  })
  return names.map((className) => {
    const rows = vehicles.filter((vehicle) => vehicle.class === className)
    const byLap = rows.filter((vehicle) => vehicle.lapTime > 0).sort((a, b) => a.lapTime - b.lapTime || b.topSpeedMph - a.topSpeedMph)
    const bySpeed = rows.filter((vehicle) => vehicle.topSpeedMph > 0).sort((a, b) => b.topSpeedMph - a.topSpeedMph || a.name.localeCompare(b.name))
    return { className, total: rows.length, measured: byLap.length, byLap: byLap.slice(0, 3), bySpeed: bySpeed.slice(0, 3) }
  })
}
