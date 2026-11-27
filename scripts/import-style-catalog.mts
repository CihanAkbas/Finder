import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { calibrateStyleMap, matchStyleStore, styleMapPoint } from '../src/lib/styleStoreMatching'
import { gta6 } from '../src/config/games/gta6/config'
import type { StyleCatalog, StyleCharacter, StyleItem, StyleOutfit, StyleStore } from '../src/config/games/gta6/style/types'

// Public read-only catalog protocol, as used by the site's guest UI. X-Client is a
// public client-type header, not an authentication credential. No cookies, bearer
// tokens, browser impersonation or challenge solving are used.
const cache = join(tmpdir(), 'finder-style-public-json')
await mkdir(cache, { recursive: true })
const output = 'src/config/games/gta6/style/catalog.json'
const previous = JSON.parse(await readFile(output, 'utf8')) as StyleCatalog
const hash = (value: string) => createHash('sha256').update(value).digest('hex').slice(0, 16)
const id = (kind: string, url: string) => `fits-${kind}-${hash(url)}`
let lastRequest = 0
async function json<T>(path: string): Promise<T> {
  const url = new URL(path, 'https://gtafits.com')
  if (url.origin !== 'https://gtafits.com' || !['/api/units', '/api/comps'].includes(url.pathname)) throw Error('Unexpected public endpoint')
  const file = join(cache, hash(url.href) + '.json')
  if (process.env.STYLE_REFRESH_INDEX !== '1') {
    try { return JSON.parse(await readFile(file, 'utf8')) as T } catch {}
  }
  if (process.env.STYLE_FETCH_PUBLIC !== '1') throw Error('No cached public snapshot. Set STYLE_FETCH_PUBLIC=1 to refresh.')
  await new Promise(resolve => setTimeout(resolve, Math.max(0, 1100 - (Date.now() - lastRequest))))
  lastRequest = Date.now()
  const response = await fetch(url, { headers: { Accept: 'application/json', 'X-Client': 'web' }, signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw Error(`Public catalog returned HTTP ${response.status}; stopped without changing the catalog. Retry-After: ${response.headers.get('retry-after') ?? 'not supplied'}`)
  if (!response.headers.get('content-type')?.includes('application/json')) throw Error('Expected public JSON; no catalog was changed')
  const body = await response.text()
  const parsed = JSON.parse(body) as T
  await writeFile(file, body)
  return parsed
}
type Tag = { id: string | number; tag: string; slug: string; category: string }
type Unit = { id: string | number; slug: string; name: string; img: string | null; sources?: (string | number)[] | null; tags?: ({ id: string | number } & Partial<Tag>)[] | null; usedIn?: { name: string; slug: string }[] | null }
type Source = { id: string | number; name: string; type: string; category: string; lat?: number; lng?: number }
type Comp = { id: string | number; name: string; imgs?: string[] | null; user?: { username?: string }; units?: Unit[] | null }
type CompPage = { data: Comp[]; count?: number }
const publicUnits = await json<{ data: Unit[]; refs: { tags: Tag[]; sources: Source[] } }>('/api/units?tags=true&sources=true&refs=true')
if (!Array.isArray(publicUnits.data) || !Array.isArray(publicUnits.refs?.tags) || !Array.isArray(publicUnits.refs?.sources)) throw Error('Public catalog schema changed; no catalog was written')
const tagMap = new Map(publicUnits.refs.tags.map(tag => [String(tag.id), tag]))
const allTags = (unit: Unit) => (unit.tags ?? []).map(tag => tagMap.get(String(tag.id)) ?? tag).filter((tag): tag is Tag => Boolean(tag.category && tag.tag && tag.slug))
const character = (units: Unit[]): StyleCharacter => {
  const names = new Set(units.flatMap(unit => allTags(unit).filter(tag => tag.category === 'Character').map(tag => tag.slug)))
  return names.has('lucia') && !names.has('jason') ? 'lucia' : names.has('jason') && !names.has('lucia') ? 'jason' : 'unisex'
}
const safeImage = (value: string | null | undefined) => {
  if (!value) return undefined
  const url = value.startsWith('gta6/') ? `https://cdn.gtafits.com/${value}` : value
  return /^https:\/\/cdn\.gtafits\.com\/gta6\/(comps|items\/renders-v1|items\/icons-v1)\/[a-zA-Z0-9/_.-]+\.(jpg|jpeg|webp|png)$/.test(url) ? url : undefined
}
const sourceKey = (source: Source) => `https://gtafits.com/${source.type === 'store' ? 'stores' : 'magazine'}/${source.id}`
const sourceUrl = (source: Source) => source.type === 'store' ? sourceKey(source) : 'https://gtafits.com/items/magazines'
const transform = calibrateStyleMap(publicUnits.refs.sources.filter(source => source.type === 'store'), gta6.markers)
if (!transform) throw Error('Source map calibration failed; no catalog was written')
const stores: StyleStore[] = publicUnits.refs.sources.map(source => {
  const url = sourceUrl(source)
  const old = previous.stores.find(row => row.sourceUrl === url)
  const matched = matchStyleStore(source, gta6.markers, transform)
  const location = styleMapPoint(source, transform)
  return { id: id('store', sourceKey(source)), name: source.name, sourceUrl: url, district: old?.district ?? '', category: source.category, kind: source.type === 'store' ? 'store' : 'magazine', markerIds: matched, ...(location ? { sourcePoint: { lat: source.lat!, lng: source.lng! }, mapLocation: location } : {}) }
})
const storeBySource = new Map(publicUnits.refs.sources.map(source => [String(source.id), id('store', sourceKey(source))]))
const mappedItems = new Map<string, StyleItem>()
function remember(unit: Unit, complete: boolean) {
  if (!unit.slug || !unit.name || !/^[a-z0-9-]+$/.test(unit.slug)) throw Error('Invalid public item; no catalog was written')
  const url = `https://gtafits.com/items/${unit.slug}`
  const tags = allTags(unit)
  const existing = mappedItems.get(url)
  const item: StyleItem = existing ?? { id: id('item', url), name: unit.name, sourceUrl: url, character: character([unit]), category: tags.find(tag => tag.category === 'Category')?.tag ?? 'Other', storeIds: [], detailed: complete }
  item.imageUrl = safeImage(unit.img) ?? item.imageUrl
  item.acquisition = [...new Set([...(item.acquisition ?? []), ...tags.filter(tag => tag.category === 'Source').map(tag => tag.slug)])]
  item.types = [...new Set([...(item.types ?? []), ...tags.filter(tag => tag.category === 'Type').map(tag => tag.tag)])]
  item.storeIds = [...new Set([...item.storeIds, ...(unit.sources ?? []).map(source => storeBySource.get(String(source))).filter((value): value is string => Boolean(value))])]
  item.includedIn = [...new Map([...(item.includedIn ?? []), ...(unit.usedIn ?? []).map(pack => ({ name: pack.name, sourceUrl: `https://gtafits.com/items/${pack.slug}` }))].map(pack => [pack.sourceUrl, pack])).values()]
  mappedItems.set(url, item)
  return item.id
}
for (const unit of publicUnits.data) remember(unit, true)
const outfits = new Map<string, StyleOutfit>()
const seenPages = new Set<string>()
let advertisedOutfits = 0
for (let page = 0; page < 1000; page++) {
  const result = await json<CompPage>(`/api/comps?units=true&tags=true&unitTags=true&user=true&page=${page}&count=true`)
  if (!Array.isArray(result.data) || typeof result.count !== 'number') throw Error('Outfit pagination schema changed; no catalog was written')
  advertisedOutfits = Math.max(advertisedOutfits, result.count)
  if (!result.data.length) break
  const fingerprint = result.data.map(comp => String(comp.id)).join(',')
  if (seenPages.has(fingerprint)) throw Error('Repeated outfit page; no catalog was written')
  seenPages.add(fingerprint)
  for (const comp of result.data) {
    const url = `https://gtafits.com/outfit/${comp.id}`
    const old = previous.outfits.find(outfit => outfit.sourceUrl === url)
    outfits.set(url, { id: id('outfit', url), name: comp.name || old?.name || 'GTAFits', author: comp.user?.username ?? old?.author ?? '', sourceUrl: url, imageUrl: safeImage(comp.imgs?.[0]), character: character(comp.units ?? []), itemIds: [...new Set((comp.units ?? []).map(unit => remember(unit, false)))] })
  }
  console.log(`Public outfits: ${outfits.size}/${advertisedOutfits}`)
  if (outfits.size >= advertisedOutfits) break
}
if (outfits.size < advertisedOutfits) throw Error('Incomplete outfit pagination; no catalog was written')
// A removed community look remains available to someone who has it saved. Keep its
// stable ID, with an explicit archive flag, rather than silently dropping progress.
for (const outfit of previous.outfits) if (!outfits.has(outfit.sourceUrl)) outfits.set(outfit.sourceUrl, { ...outfit, archived: true })
for (const item of previous.items) if (!mappedItems.has(item.sourceUrl)) mappedItems.set(item.sourceUrl, { ...item, archived: true, storeIds: item.storeIds.filter(id => stores.some(store => store.id === id)) })
const items = [...mappedItems.values()]
const coverage = { items: { discovered: publicUnits.data.length, imported: publicUnits.data.length, detailed: publicUnits.data.length }, outfits: { discovered: advertisedOutfits, imported: [...outfits.values()].filter(row => !row.archived).length }, stores: { discovered: stores.length, imported: stores.length } }
const catalog: StyleCatalog = { reviewedAt: new Date().toISOString().slice(0, 10), source: 'https://gtafits.com/', coverage, mapCalibration: transform, items, outfits: [...outfits.values()], stores }
await writeFile(output, JSON.stringify(catalog, null, 2) + '\n')
console.log(JSON.stringify({ coverage, archivedItems: items.filter(item => item.archived).length, archivedOutfits: catalog.outfits.filter(row => row.archived).length, images: items.filter(item => item.imageUrl).length, mappedSources: stores.filter(store => store.markerIds.length).length }))
