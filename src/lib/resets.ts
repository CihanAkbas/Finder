export function dailyKey(now = new Date(), hourUtc = 6) {
  const shifted = new Date(now.getTime() - hourUtc * 60 * 60 * 1000)
  return shifted.toISOString().slice(0, 10)
}

export function nextDailyReset(now = new Date(), hourUtc = 6) {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hourUtc, 0, 0, 0))
  if (now.getTime() >= next.getTime()) next.setUTCDate(next.getUTCDate() + 1)
  return next
}

export function nextWeeklyReset(now = new Date(), weekday = 4, hourUtc = 10) {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hourUtc, 0, 0, 0))
  const delta = (weekday - next.getUTCDay() + 7) % 7
  next.setUTCDate(next.getUTCDate() + delta)
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 7)
  return next
}

export function weekdayIndex(now = new Date(), hourUtc = 6) {
  const key = dailyKey(now, hourUtc)
  return new Date(`${key}T00:00:00Z`).getUTCDay()
}

/** Days since the Unix epoch, using the same UTC cutoff as the daily board. */
export function dayNumber(now = new Date(), hourUtc = 6) {
  const key = dailyKey(now, hourUtc)
  return Math.floor(Date.parse(`${key}T00:00:00Z`) / 86_400_000)
}

/** Day of the UTC year after the daily cutoff. 1 January is 1. */
export function dayOfYear(now = new Date(), hourUtc = 6) {
  const key = dailyKey(now, hourUtc)
  const [year, month, day] = key.split('-').map(Number)
  const utc = Date.UTC(year, month - 1, day)
  const start = Date.UTC(year, 0, 0)
  return Math.floor((utc - start) / 86_400_000)
}

/** Stable pick from a list. The same UTC day always returns the same entry. */
export function pickOf<T>(items: readonly T[], now = new Date(), hourUtc = 6): T | null {
  if (items.length === 0) return null
  return items[dayNumber(now, hourUtc) % items.length]
}

/** Weeks since the Unix epoch, aligned to the weekly reset (Thursday 10:00 UTC by default). */
export function weekIndex(now = new Date(), weekday = 4, hourUtc = 10) {
  const next = nextWeeklyReset(now, weekday, hourUtc)
  const start = next.getTime() - 7 * 86_400_000
  return Math.floor(start / (7 * 86_400_000))
}

export function rotationIndex(length: number, now = new Date(), hourUtc = 6) {
  if (length <= 0) return 0
  return weekdayIndex(now, hourUtc) % length
}

export function todaysBoard<T extends { gunVan: unknown; dealers: unknown; stash: unknown; trials: unknown }>(
  pack: {
    resets: { dailyHourUtc: number; weeklyWeekday: number; weeklyHourUtc: number }
    weekdays: T[]
    weeklyBonuses: string[][]
  },
  now = new Date(),
) {
  if (pack.weekdays.length === 0) return null
  const day = weekdayIndex(now, pack.resets.dailyHourUtc) % pack.weekdays.length
  const cycle = Math.min(4, pack.weeklyBonuses.length)
  const bonuses = cycle
    ? pack.weeklyBonuses[weekIndex(now, pack.resets.weeklyWeekday, pack.resets.weeklyHourUtc) % cycle]
    : []
  return { ...pack.weekdays[day], bonuses }
}

export function formatRemaining(target: Date, now = Date.now()) {
  const total = Math.max(0, target.getTime() - now)
  const hours = Math.floor(total / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':')
}
