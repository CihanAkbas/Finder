import { useSyncExternalStore } from 'react'
import { dailyKey, weekIndex } from '@/lib/resets'

let clientNow = Date.now()
const listeners = new Set<() => void>()
let timer = 0

function tick() {
  clientNow = Date.now()
  for (const listener of listeners) listener()
}

export function subscribeClock(listener: () => void) {
  if (typeof window === 'undefined') return () => {}
  listeners.add(listener)
  if (!timer) timer = window.setInterval(tick, 1000)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && timer) {
      window.clearInterval(timer)
      timer = 0
    }
  }
}

function getClock() {
  return clientNow
}

/** One shared second clock. Daily and weekly boards subscribe so a reset refreshes them. */
export function useClock() {
  return useSyncExternalStore(subscribeClock, getClock, () => Date.now())
}

export function useResetClock(resets?: { dailyHourUtc?: number; weeklyWeekday?: number; weeklyHourUtc?: number }) {
  const now = useClock()
  const date = new Date(now)
  const dailyHour = resets?.dailyHourUtc ?? 6
  const weekday = resets?.weeklyWeekday ?? 4
  const weeklyHour = resets?.weeklyHourUtc ?? 10
  return {
    now,
    date,
    dailyHour,
    weekday,
    weeklyHour,
    dailyPeriod: dailyKey(date, dailyHour),
    week: weekIndex(date, weekday, weeklyHour),
  }
}
