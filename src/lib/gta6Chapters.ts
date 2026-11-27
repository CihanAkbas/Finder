import snapshot from '@/config/games/gta6/storyMissions.json'

/** Published story order; optional activities do not inflate main-story progress. */
export const GTA6_CHAPTERS = snapshot.chapters.map(chapter => ({
  id: chapter.id,
  title: chapter.title,
  missions: chapter.missions.filter(mission => !mission.optional).map(mission => mission.title),
  optionalMissions: chapter.missions.filter(mission => mission.optional).map(mission => mission.title),
}))
const byTitle = new Map(GTA6_CHAPTERS.flatMap(chapter => [...chapter.missions, ...chapter.optionalMissions].map(title => [title, chapter.id])))
export function gta6ChapterId(title: string) { return byTitle.get(title) ?? null }
