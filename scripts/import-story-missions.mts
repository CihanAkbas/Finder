// Import factual mission names/order from the public source HTML snapshot.
// Download the source page to STORY_SOURCE_HTML before running; no page scripts execute.
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { canonicalMarkerId } from '../src/lib/markerAliases'
const source = 'https://www.gtabase.com/gta-6/missions/'
const file = process.env.STORY_SOURCE_HTML ?? join(tmpdir(), 'finder-missions-current.html')
const html = await readFile(file, 'utf8')
const checklistPath = 'src/config/games/gta6/checklist.json'
type Row = { id: string; title: string; detail: string; detailTr?: string; group: string; requiredFor100: boolean; mapId?: string; storyOptional?: boolean; missable?: boolean; pointOfNoReturn?: boolean; [key: string]: unknown }
const checklist = JSON.parse(await readFile(checklistPath, 'utf8')) as Row[]
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#0?39;|&apos;|&rsquo;|&#8217;/g, "'").replace(/&hellip;/g, '…')
const plain = (s: string) => decode(s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
const previous = new Map(checklist.filter(row => row.id.startsWith('gta6-mission-') || row.storyOptional === true).map(row => [key(row.title), row]))
const previousOptional = new Map(checklist.filter(row => row.id.startsWith('gta6-optional-')).map(row => [key(row.title), row]))
const names = ['Prologue', 'Just Like Paradise', 'Paradise Lost', 'Tits Ass Drug Money', 'Vice City, Baby', 'Top of the World, Ma']
const headings = [...html.matchAll(/<h2>(Prologue|Chapter [1-5])<\/h2>/g)]
if (headings.length !== 6) throw Error('Expected prologue and five chapter sections')
const seen = new Set<string>(), numbered: number[] = []
const chapters = headings.map((heading, index) => {
 const section = html.slice(heading.index! + heading[0].length, headings[index + 1]?.index ?? html.indexOf('<h2>GTA 6 Endings'))
 const chapterId = index === 0 ? 'prologue' : `ch${index}`
 const missions = [...section.matchAll(/<a[^>]*href="([^"]+)"[^>]*class="items-row[^\"]*"[^>]*>([\s\S]*?)<\/a>/g)].map(match => {
  const body = match[2]
  const title = decode(body.match(/<img[^>]*alt="([^"]+)"/)?.[1] ?? '')
  const optional = /items-row--opt/.test(match[0].slice(0, match[0].indexOf('>')))
  const missable = /gtm-badge--miss/.test(body)
  const pointOfNoReturn = /POINT OF NO RETURN/.test(body)
  const number = body.match(/class="field-value[^\"]*">(\d+)<\/span>/)?.[1]
  if (!title || seen.has(key(title)) || !optional && !number) throw Error('Invalid/duplicate mission: ' + plain(body).slice(0, 100))
  seen.add(key(title)); if (number) numbered.push(Number(number))
  const existing = optional ? previousOptional.get(key(title)) ?? previous.get(key(title)) : previous.get(key(title))
  const id = existing?.id ?? `gta6-mission-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
  const sourceUrl = new URL(match[1], source).href
  return { id, title, optional, missable, pointOfNoReturn, sourceUrl }
 })
 if (!missions.length) throw Error('Empty chapter')
 return { id: chapterId, title: { en: index === 0 ? 'Prologue' : `Chapter ${index} · ${names[index]}`, tr: index === 0 ? 'Prolog' : `${index}. Bölüm · ${names[index]}` }, missions }
})
if (numbered.some((number, index) => number !== index + 1)) throw Error('Main mission numbering has gaps')
const lost = [...previous.values()].filter(row => !seen.has(key(row.title)))
if (lost.length) throw Error('Existing mission IDs would be lost: ' + lost.map(row => row.title).join(', '))
const rows = chapters.flatMap((chapter, index) => chapter.missions.map(mission => {
 const existing = mission.optional ? previousOptional.get(key(mission.title)) ?? previous.get(key(mission.title)) : previous.get(key(mission.title))
 const detail = existing?.detail ?? (mission.optional ? `Optional story activity in Chapter ${index}.` : `Main story mission in Chapter ${index}.`)
 const detailTr = existing?.detailTr ?? (!existing ? (mission.optional ? `${index}. bölümdeki isteğe bağlı hikâye görevi.` : `${index}. bölümün ana hikâye görevi.`) : undefined)
 return { ...existing, id: mission.id, title: mission.title, detail, ...(detailTr ? { detailTr } : {}), group: mission.optional ? 'strangers' : 'story', requiredFor100: false, storyOptional: mission.optional, missable: mission.missable, pointOfNoReturn: mission.pointOfNoReturn, ...(existing?.mapId ? { mapId: canonicalMarkerId(existing.mapId) } : {}) }
}))
const snapshot = { reviewedAt: process.env.STORY_REVIEWED_AT ?? new Date().toISOString().slice(0, 10), source, mainCount: numbered.length, optionalCount: rows.filter(row => row.storyOptional).length, chapters }
await writeFile('src/config/games/gta6/storyMissions.json', JSON.stringify(snapshot, null, 2) + '\n')
await writeFile(checklistPath, JSON.stringify([...checklist.filter(row => !row.id.startsWith('gta6-mission-') && !rows.some(mission => mission.id === row.id)), ...rows], null, 2) + '\n')
console.log(JSON.stringify({ main: numbered.length, optional: snapshot.optionalCount, chapters: chapters.length - 1, preservedIds: previous.size }))
