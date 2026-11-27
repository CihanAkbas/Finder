import { GTA6_CHAPTERS } from './gta6Chapters'
import type { ChecklistItem } from '@/store/slice'

export function storyProgress(items: ChecklistItem[], completed: readonly string[]) {
  const doneIds = new Set(completed)
  const byTitle = new Map(items.filter((item) => item.id.startsWith('gta6-mission-') || item.storyOptional === true).map((item) => [item.title, item]))
  const chapters = GTA6_CHAPTERS.map((chapter) => ({ ...chapter, items: chapter.missions.flatMap((title) => byTitle.get(title) ? [byTitle.get(title)!] : []), optionalItems: chapter.optionalMissions.flatMap((title) => byTitle.get(title) ? [byTitle.get(title)!] : []) }))
  const ordered = chapters.flatMap((chapter) => chapter.items)
  const done = ordered.filter((item) => doneIds.has(item.id)).length
  const next = ordered.find((item) => !doneIds.has(item.id))
  return { chapters, ordered, done, total: ordered.length, percent: ordered.length ? done / ordered.length * 100 : 0, next }
}
