import type { GameMarker } from '@/types/game'
import type { ChecklistGroup, ChecklistItem, ChecklistObjective, MedalRank } from '@/store/slice'

/** Social Club split: 69 story missions, Franklin's strangers, 42 hobbies, any 14 events, 16 miscellaneous tasks. */
export const GROUP_WEIGHTS: Record<ChecklistGroup, number> = {
  story: 55,
  hobbies: 10,
  strangers: 10,
  random: 5,
  misc: 20,
  beyond: 0,
}

export const GROUP_LABELS: Record<ChecklistGroup, string> = {
  story: 'Story missions',
  hobbies: 'Hobbies and pastimes',
  strangers: 'Strangers and freaks',
  random: 'Random events',
  misc: 'Miscellaneous',
  beyond: 'Beyond 100%',
}

export function collectProgress(item: ChecklistItem, found: ReadonlySet<string>, markers: GameMarker[]) {
  if (!item.collect) return null
  const have = markers.filter((marker) => marker.category === item.collect?.category && found.has(marker.id)).length
  return { have, needed: item.collect.needed }
}

export function isChecklistComplete(item: ChecklistItem, found: ReadonlySet<string>, manual: ReadonlySet<string>, markers: GameMarker[]) {
  const progress = collectProgress(item, found, markers)
  if (progress) return progress.have >= progress.needed
  if (item.markerId) return found.has(item.markerId)
  return manual.has(item.id)
}

/** Solid Gold, Baby! unlocks at this many gold medals. More than 70 can be earned. */
export const SOLID_GOLD_TARGET = 70

export function objectiveKey(itemId: string, objectiveId: string) {
  return `${itemId}:${objectiveId}`
}

export type MedalTrack = {
  id: string
  title: string
  objectives: ChecklistObjective[]
}

export function medalTracks(item: ChecklistItem): MedalTrack[] {
  const objectives = item.objectives ?? []
  if (!objectives.length) return []
  const groups = new Map<string, MedalTrack>()
  for (const objective of objectives) {
    const id = objective.track ?? item.id
    const existing = groups.get(id)
    if (existing) {
      existing.objectives.push(objective)
      continue
    }
    groups.set(id, { id, title: objective.trackTitle ?? item.title, objectives: [objective] })
  }
  return [...groups.values()]
}

/** Gold is every objective. At least half is silver. Fewer, or a finished mission with none, is bronze. */
export function trackMedal(itemId: string, track: MedalTrack, done: ReadonlySet<string>, missionDone: boolean): MedalRank {
  const total = track.objectives.length
  if (!total) return 'none'
  const checked = track.objectives.filter((objective) => done.has(objectiveKey(itemId, objective.id))).length
  if (checked >= total) return 'gold'
  if (checked <= 0) return missionDone ? 'bronze' : 'none'
  if (checked * 2 >= total) return 'silver'
  return 'bronze'
}

export function itemMedal(item: ChecklistItem, done: ReadonlySet<string>, missionDone: boolean): MedalRank {
  const tracks = medalTracks(item)
  if (!tracks.length) return 'none'
  const ranks = tracks.map((track) => trackMedal(item.id, track, done, missionDone))
  if (ranks.every((rank) => rank === 'gold')) return 'gold'
  if (ranks.some((rank) => rank === 'gold' || rank === 'silver')) return 'silver'
  if (ranks.some((rank) => rank === 'bronze')) return 'bronze'
  return 'none'
}

export function goldMedalTally(items: ChecklistItem[], done: ReadonlySet<string>) {
  const byGroup: Record<ChecklistGroup, number> = { story: 0, hobbies: 0, strangers: 0, random: 0, misc: 0, beyond: 0 }
  let earned = 0
  let available = 0
  for (const item of items) {
    if (!item.solidGold) continue
    for (const track of medalTracks(item)) {
      available += 1
      if (trackMedal(item.id, track, done, false) === 'gold') {
        earned += 1
        byGroup[item.group] += 1
      }
    }
  }
  return { earned, available, byGroup, target: SOLID_GOLD_TARGET }
}

function shareCompletion(items: ChecklistItem[], found: ReadonlySet<string>, manual: ReadonlySet<string>, markers: GameMarker[]) {
  const groups = Object.keys(GROUP_WEIGHTS) as ChecklistGroup[]
  const buckets = new Map<ChecklistGroup, { done: number; total: number; points: number; weight: number }>()
  let percent = 0
  for (const item of items) {
    if (!item.requiredFor100 || typeof item.share !== 'number') continue
    const complete = isChecklistComplete(item, found, manual, markers)
    percent += complete ? item.share : 0
    const bucket = buckets.get(item.group) ?? { done: 0, total: 0, points: 0, weight: 0 }
    bucket.total += 1
    bucket.weight += item.share
    if (complete) {
      bucket.done += 1
      bucket.points += item.share
    }
    buckets.set(item.group, bucket)
  }
  return {
    percent,
    rows: groups.map((group) => ({ group, ...(buckets.get(group) ?? { done: 0, total: 0, points: 0, weight: 0 }) })),
  }
}

export function weightedCompletion(items: ChecklistItem[], found: ReadonlySet<string>, manual: ReadonlySet<string>, markers: GameMarker[]) {
  if (items.some((item) => item.requiredFor100 && typeof item.share === 'number')) {
    return shareCompletion(items, found, manual, markers)
  }
  const groups = Object.keys(GROUP_WEIGHTS) as ChecklistGroup[]
  let total = 0
  const rows = groups.map((group) => {
    const groupItems = items.filter((item) => item.group === group && item.requiredFor100)
    const quotas = new Map<string, { needed: number; done: number }>()
    let plainTotal = 0
    let plainDone = 0
    for (const item of groupItems) {
      const complete = isChecklistComplete(item, found, manual, markers)
      if (item.quota) {
        const bucket = quotas.get(item.quota.id) ?? { needed: item.quota.needed, done: 0 }
        bucket.needed = item.quota.needed
        if (complete) bucket.done += 1
        quotas.set(item.quota.id, bucket)
      } else {
        plainTotal += 1
        if (complete) plainDone += 1
      }
    }
    let done = plainDone
    let count = plainTotal
    for (const bucket of quotas.values()) {
      count += bucket.needed
      done += Math.min(bucket.done, bucket.needed)
    }
    const fraction = count ? done / count : 0
    const points = fraction * GROUP_WEIGHTS[group]
    total += points
    return { group, done, total: count, points, weight: GROUP_WEIGHTS[group] }
  })
  return { percent: total, rows }
}
