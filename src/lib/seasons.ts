export type HuntId = 'snowmen' | 'jack-o-lanterns' | 'clovers' | 'yuanbao' | 'ghosts'

export type Hunt = {
  id: HuntId
  title: string
  window: string
  category: string
}

export const HUNTS: Hunt[] = [
  { id: 'snowmen', title: 'Snowmen', window: 'December 15 through January 5', category: 'snowmen' },
  { id: 'jack-o-lanterns', title: "Jack o' lanterns", window: 'October 1 through November 2', category: 'jack-o-lanterns' },
  { id: 'ghosts', title: 'Ghosts Exposed', window: 'October 20 through November 2', category: 'ghosts-exposed' },
  { id: 'clovers', title: 'Clovers', window: 'March 1 through March 20 · four-leaf and golden', category: 'lucky-clovers' },
  { id: 'yuanbao', title: 'Yuanbao', window: 'The week of Lunar New Year', category: 'yuanbao' },
]

/** Inclusive UTC dates. Lunar New Year moves, so the window is a table rather than a guessed formula. */
const YUANBAO: [string, string][] = [
  ['2026-02-10', '2026-02-24'],
  ['2027-01-28', '2027-02-14'],
  ['2028-02-16', '2028-03-02'],
  ['2029-02-05', '2029-02-19'],
]

export function huntActive(id: HuntId, now = new Date()) {
  const month = now.getUTCMonth() + 1
  const day = now.getUTCDate()
  const key = now.toISOString().slice(0, 10)
  if (id === 'snowmen') return (month === 12 && day >= 15) || (month === 1 && day <= 5)
  if (id === 'jack-o-lanterns') return month === 10 || (month === 11 && day <= 2)
  if (id === 'ghosts') return (month === 10 && day >= 20) || (month === 11 && day <= 2)
  if (id === 'clovers') return month === 3 && day <= 20
  return YUANBAO.some(([start, end]) => key >= start && key <= end)
}
