import type { Heist } from '@/store/slice'

/** Pavel’s 2% and the 10% fencing fee are the cuts community calculators assign on the Kosatka screen. Apartment heists use Lester’s usual assigned cut (5%), which the finale board lets the crew change. */

const MIN_CUT = 15
const MAX_CUT = 70

export function heistPayout(heist: Heist, primaryId: string, secondaryIds: string[], hard: boolean) {
  const primary = heist.targets.find((target) => target.id === primaryId) ?? heist.targets[0]
  const secondary = secondaryIds.reduce((sum, id) => sum + (heist.secondaries.find((item) => item.id === id)?.value ?? 0), 0)
  const primaryValue = (primary?.value ?? 0) * (hard ? 1 + heist.hardModeBonus : 1)
  const gross = primaryValue + secondary
  const fee = heist.fees.reduce((sum, item) => sum + gross * (item.rate ?? 0) + (item.amount ?? 0), 0)
  return { primary: primaryValue, secondary, gross, fee, pot: Math.max(0, gross - fee) }
}

/** Legal cut range for a crew. Two players cannot go below 30% because the other player is capped at 70%. */
export function crewCutLimits(crew: number) {
  const size = Math.max(1, Math.min(4, Math.floor(crew)))
  if (size <= 1) return { min: 100, max: 100 }
  const min = Math.max(MIN_CUT, 100 - MAX_CUT * (size - 1))
  const max = Math.min(MAX_CUT, 100 - MIN_CUT * (size - 1))
  return { min, max: Math.max(min, max) }
}

/**
 * Splits a pot so every cut stays inside the game's 15–70% rule and the shares add up to 100%.
 * Rounded dollar takes add up to the pot, so the crew cannot be paid more than the vault.
 */
export function splitPot(pot: number, cuts: number[]) {
  const safePot = Number.isFinite(pot) ? Math.max(0, Math.round(pot)) : 0
  const crew = Math.max(1, Math.min(4, cuts.length || 1))
  if (crew === 1) return [{ cut: 100, take: safePot }]

  const { min, max } = crewCutLimits(crew)
  const shares = Array.from({ length: crew }, () => min)
  let extra = 100 - min * crew
  for (let index = 1; index < crew; index += 1) {
    const requested = Number.isFinite(cuts[index]) ? cuts[index] : min
    const clamped = Math.min(max, Math.max(min, requested))
    const give = Math.min(Math.max(0, clamped - min), extra, max - min)
    shares[index] = min + give
    extra -= give
  }
  shares[0] = min + extra

  const takes = shares.map((cut) => Math.floor((safePot * cut) / 100))
  const drift = safePot - takes.reduce((sum, take) => sum + take, 0)
  takes[0] += drift
  return shares.map((cut, index) => ({ cut, take: Math.max(0, takes[index] ?? 0) }))
}
