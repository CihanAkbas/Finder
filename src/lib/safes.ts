import type { SafeTrack } from '@/store/slice'

/** One GTA Online in-game day, in real milliseconds. */
export const IGD_MS = 48 * 60 * 1000

export type SafeControl = 'nightclub' | 'agency' | 'salvage' | 'arcade' | 'none'

export type SafeDef = {
  id: string
  name: string
  control: SafeControl
  note: string
  cap: (track: SafeTrack) => number
  perDay: (track: SafeTrack) => number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** Community figure. At 95–100% the published maximum is $50,000. Below that, $500 per point is this tracker's stand-in. */
export function nightclubPerDay(popularity = 100) {
  const point = clamp(popularity, 0, 100)
  if (point >= 95) return 50_000
  return point * 500
}

/** Community figure: $500 for every five Security Contracts, capped at $20,000. */
export function agencyPerDay(contracts = 201) {
  const steps = Math.floor(clamp(contracts, 0, 201) / 5)
  return Math.min(20_000, steps * 500)
}

export const SAFES: SafeDef[] = [
  {
    id: 'nightclub',
    name: 'Nightclub safe',
    control: 'nightclub',
    note: 'Cap $250,000. Community figure: $50,000 every 48 minutes at 95–100% popularity. Below 95% this timer uses $500 per popularity point, which is a stand-in for the in-game steps.',
    cap: () => 250_000,
    perDay: (track) => nightclubPerDay(track.popularity ?? 100),
  },
  {
    id: 'agency',
    name: 'Agency safe',
    control: 'agency',
    note: 'Cap $250,000. Community figure: $500 for every 5 Security Contracts, capped at $20,000 per in-game day once you reach 201 contracts.',
    cap: () => 250_000,
    perDay: (track) => agencyPerDay(track.contracts ?? 201),
  },
  {
    id: 'arcade',
    name: 'Arcade safe',
    control: 'arcade',
    note: 'Cap $100,000. Community figure: $5,000 every 48 minutes after every floor slot has a machine.',
    cap: () => 100_000,
    perDay: (track) => (track.machines ?? true ? 5_000 : 0),
  },
  {
    id: 'salvage',
    name: 'Salvage Yard safe',
    control: 'salvage',
    note: 'Community figure: $24,000 per in-game day with staff at peak reputation, or $20,000 without. The cap is $100,000, or $250,000 with the wall safe. About four tows holds the higher rate.',
    cap: (track) => ((track.wallSafe ?? true) ? 250_000 : 100_000),
    perDay: (track) => ((track.peak ?? true) ? 24_000 : 20_000),
  },
  {
    id: 'garment',
    name: 'Garment Factory safe',
    control: 'none',
    note: 'Cap $100,000. Community figure: the payout rolls $1,500–$2,000 every 48 minutes. This timer uses $2,000, so a full safe is the fast case.',
    cap: () => 100_000,
    perDay: () => 2_000,
  },
]

export function withSafeDefaults(track?: SafeTrack | null): SafeTrack {
  return {
    anchorAt: track?.anchorAt ?? null,
    anchorAmount: track?.anchorAmount ?? 0,
    popularity: track?.popularity ?? 100,
    contracts: track?.contracts ?? 201,
    wallSafe: track?.wallSafe ?? true,
    peak: track?.peak ?? true,
    machines: track?.machines ?? true,
  }
}

export function safeProgress(def: SafeDef, track: SafeTrack, now: number) {
  const cap = def.cap(track)
  const perDay = def.perDay(track)
  const anchor = track.anchorAt ? Date.parse(track.anchorAt) : Number.NaN
  const tracking = Number.isFinite(anchor)
  const ticks = tracking && perDay > 0 ? Math.floor(Math.max(0, now - anchor) / IGD_MS) : 0
  const amount = Math.min(cap, Math.max(0, track.anchorAmount) + ticks * perDay)
  const remaining = Math.max(0, cap - amount)
  const daysLeft = perDay > 0 && remaining > 0 ? Math.ceil(remaining / perDay) : 0
  const nextAt = tracking && perDay > 0 && amount < cap ? new Date(anchor + (ticks + 1) * IGD_MS) : null
  const fullAt = tracking && perDay > 0 && amount < cap ? new Date(anchor + (ticks + daysLeft) * IGD_MS) : null
  return { cap, perDay, amount, tracking, nextAt, fullAt, daysLeft }
}
