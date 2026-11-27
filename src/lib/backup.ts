import { normalizeSlice, type CustomPin, type GameSlice, type SafeTrack, type SavedFilter, type SavedProperty } from '@/store/slice'

const SLUG = /^[a-z0-9-]{1,40}$/
const ID = /^[a-zA-Z0-9:_-]{1,160}$/
const MAX_LIST = 20_000

function reject(slug: string, message: string): never {
  throw new Error(`Backup for ${slug} was rejected: ${message}`)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function stringList(value: unknown, slug: string, label: string) {
  if (!Array.isArray(value)) reject(slug, `${label} must be a list of ids.`)
  if (value.length > MAX_LIST) reject(slug, `${label} is too large.`)
  const ids: string[] = []
  for (const item of value) {
    if (typeof item !== 'string' || !ID.test(item)) reject(slug, `${label} has an invalid id.`)
    ids.push(item)
  }
  return [...new Set(ids)]
}

function optionalStringList(row: Record<string, unknown>, key: string, slug: string) {
  if (!(key in row)) return undefined
  return stringList(row[key], slug, key)
}

function enumValue<T extends string>(value: unknown, allowed: readonly T[], slug: string, label: string): T {
  if (typeof value !== 'string' || !allowed.includes(value as T)) reject(slug, `${label} is not a valid value.`)
  return value as T
}

function pin(value: unknown, slug: string): CustomPin {
  if (!isRecord(value)) reject(slug, 'a custom pin is not an object.')
  if (typeof value.id !== 'string' || !ID.test(value.id)) reject(slug, 'a custom pin has an invalid id.')
  if (typeof value.title !== 'string' || value.title.trim().length === 0 || value.title.length > 500) reject(slug, 'a custom pin title is invalid.')
  if (value.note !== undefined && (typeof value.note !== 'string' || value.note.length > 4000)) reject(slug, 'a custom pin note is invalid.')
  if (typeof value.color !== 'string' || value.color.length === 0 || value.color.length > 40) reject(slug, 'a custom pin color is invalid.')
  if (typeof value.x !== 'number' || !Number.isFinite(value.x) || Math.abs(value.x) > 20_000) reject(slug, 'a custom pin has an invalid x coordinate.')
  if (typeof value.y !== 'number' || !Number.isFinite(value.y) || Math.abs(value.y) > 20_000) reject(slug, 'a custom pin has an invalid y coordinate.')
  if (value.createdAt !== undefined && (typeof value.createdAt !== 'string' || Number.isNaN(Date.parse(value.createdAt)))) {
    reject(slug, 'a custom pin has an invalid timestamp.')
  }
  return {
    id: value.id,
    title: value.title.trim().slice(0, 80),
    note: typeof value.note === 'string' ? value.note.slice(0, 2000) : '',
    color: value.color,
    x: value.x,
    y: value.y,
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : new Date(0).toISOString(),
  }
}

function property(value: unknown, slug: string): SavedProperty {
  if (!isRecord(value)) reject(slug, 'a property entry is not an object.')
  if (typeof value.id !== 'string' || !ID.test(value.id)) reject(slug, 'a property has an invalid id.')
  if (typeof value.templateId !== 'string' || !ID.test(value.templateId)) reject(slug, 'a property has an invalid template.')
  if (typeof value.name !== 'string' || value.name.length === 0 || value.name.length > 80) reject(slug, 'a property name is invalid.')
  if (!Array.isArray(value.slots) || value.slots.length > 200) reject(slug, 'property slots must be a list.')
  const slots = value.slots.map((slot) => {
    if (slot === null) return null
    if (typeof slot !== 'string' || !ID.test(slot)) reject(slug, 'a garage slot is invalid.')
    return slot
  })
  let note: string | undefined
  if ('note' in value && value.note !== undefined) {
    if (typeof value.note !== 'string' || value.note.length > 280) reject(slug, 'a property note is invalid.')
    note = value.note
  }
  let slotNotes: (string | null)[] | undefined
  if ('slotNotes' in value && value.slotNotes !== undefined) {
    if (!Array.isArray(value.slotNotes) || value.slotNotes.length > 200) reject(slug, 'property slot notes must be a list.')
    slotNotes = value.slotNotes.map((item) => {
      if (item === null || item === '') return null
      if (typeof item !== 'string' || item.length > 280) reject(slug, 'a garage note is invalid.')
      return item
    })
  }
  return { id: value.id, templateId: value.templateId, name: value.name, slots, ...(note ? { note } : {}), ...(slotNotes ? { slotNotes } : {}) }
}

function savedFilters(value: unknown, slug: string): SavedFilter[] {
  if (!Array.isArray(value) || value.length > 24) reject(slug, 'savedFilters must be a list.')
  return value.map((item) => {
    if (!isRecord(item)) reject(slug, 'a saved view is not an object.')
    if (typeof item.id !== 'string' || !ID.test(item.id)) reject(slug, 'a saved view has an invalid id.')
    if (typeof item.name !== 'string' || item.name.trim().length === 0 || item.name.length > 40) reject(slug, 'a saved view name is invalid.')
    if (typeof item.hideFound !== 'boolean') reject(slug, 'a saved view flag is invalid.')
    return {
      id: item.id,
      name: item.name.trim(),
      hiddenCategories: stringList(item.hiddenCategories, slug, 'savedFilters.hiddenCategories'),
      hideFound: item.hideFound,
    }
  })
}

function businesses(value: unknown, slug: string) {
  if (!isRecord(value)) reject(slug, 'businesses must be an object.')
  const next: GameSlice['businesses'] = {}
  for (const [id, row] of Object.entries(value)) {
    if (!SLUG.test(id) || !isRecord(row) || !('startedAt' in row)) reject(slug, 'a business timer is invalid.')
    const startedAt = row.startedAt
    if (startedAt !== null && (typeof startedAt !== 'string' || Number.isNaN(Date.parse(startedAt)))) reject(slug, 'a business timer is invalid.')
    next[id] = { startedAt }
  }
  return next
}

function safes(value: unknown, slug: string) {
  if (!isRecord(value)) reject(slug, 'safes must be an object.')
  const next: Record<string, SafeTrack> = {}
  for (const [id, row] of Object.entries(value)) {
    if (!SLUG.test(id) || !isRecord(row)) reject(slug, 'a safe timer is invalid.')
    if (typeof row.anchorAmount !== 'number' || !Number.isFinite(row.anchorAmount) || row.anchorAmount < 0 || row.anchorAmount > 10_000_000) {
      reject(slug, 'a safe amount is invalid.')
    }
    if (row.anchorAt !== null && (typeof row.anchorAt !== 'string' || Number.isNaN(Date.parse(row.anchorAt)))) reject(slug, 'a safe timestamp is invalid.')
    const track: SafeTrack = { anchorAt: row.anchorAt === null ? null : row.anchorAt, anchorAmount: Math.round(row.anchorAmount) }
    if ('popularity' in row) {
      if (typeof row.popularity !== 'number' || !Number.isFinite(row.popularity) || row.popularity < 0 || row.popularity > 100) reject(slug, 'nightclub popularity is invalid.')
      track.popularity = Math.round(row.popularity)
    }
    if ('contracts' in row) {
      if (typeof row.contracts !== 'number' || !Number.isFinite(row.contracts) || row.contracts < 0 || row.contracts > 500) reject(slug, 'agency contracts are invalid.')
      track.contracts = Math.round(row.contracts)
    }
    if ('wallSafe' in row && typeof row.wallSafe !== 'boolean') reject(slug, 'a safe flag is invalid.')
    if ('peak' in row && typeof row.peak !== 'boolean') reject(slug, 'a safe flag is invalid.')
    if ('machines' in row && typeof row.machines !== 'boolean') reject(slug, 'a safe flag is invalid.')
    if (typeof row.wallSafe === 'boolean') track.wallSafe = row.wallSafe
    if (typeof row.peak === 'boolean') track.peak = row.peak
    if (typeof row.machines === 'boolean') track.machines = row.machines
    next[id] = track
  }
  return next
}

function daily(value: unknown, slug: string) {
  if (!isRecord(value)) reject(slug, 'daily progress must be an object.')
  if (typeof value.periodKey !== 'string' || value.periodKey.length > 40) reject(slug, 'daily.periodKey is invalid.')
  return { periodKey: value.periodKey, ids: stringList(value.ids, slug, 'daily.ids') }
}

function sliceFrom(value: unknown, slug: string): GameSlice {
  if (!isRecord(value)) reject(slug, 'progress must be an object.')
  const clean: Partial<GameSlice> = {}
  for (const key of ['ownedClothes', 'savedOutfits'] as const) {
    if (key in value) clean[key] = stringList(value[key], slug, key)
  }
  if ('customOutfits' in value) {
    if (!Array.isArray(value.customOutfits) || value.customOutfits.length > 100) reject(slug, 'customOutfits must be a list.')
    clean.customOutfits = value.customOutfits.map(row => {
      if (!isRecord(row) || typeof row.id !== 'string' || !ID.test(row.id) || typeof row.name !== 'string' || !row.name.trim() || row.name.length > 80 || typeof row.createdAt !== 'string' || Number.isNaN(Date.parse(row.createdAt))) reject(slug, 'An outfit is invalid.')
      const itemIds = stringList(row.itemIds, slug, 'customOutfits.itemIds')
      if (itemIds.length > 30) reject(slug, 'An outfit has too many pieces.')
      return { id: row.id, name: row.name.trim(), createdAt: row.createdAt, itemIds }
    })
  }
  if ('found' in value) clean.found = stringList(value.found, slug, 'found')
  if ('hiddenCategories' in value) clean.hiddenCategories = stringList(value.hiddenCategories, slug, 'hiddenCategories')
  if ('layerSetup' in value) {
    if (typeof value.layerSetup !== 'boolean') reject(slug, 'layerSetup must be true or false.')
    clean.layerSetup = value.layerSetup
  }
  if ('checklistDone' in value) clean.checklistDone = stringList(value.checklistDone, slug, 'checklistDone')
  if ('objectiveDone' in value) clean.objectiveDone = stringList(value.objectiveDone, slug, 'objectiveDone')
  const careerDone = optionalStringList(value, 'careerDone', slug)
  const ownedAssets = optionalStringList(value, 'ownedAssets', slug)
  const ownedVehicles = optionalStringList(value, 'ownedVehicles', slug)
  if (careerDone) clean.careerDone = careerDone
  if (ownedAssets) clean.ownedAssets = ownedAssets
  if (ownedVehicles) clean.ownedVehicles = ownedVehicles
  const favorites = optionalStringList(value, 'favorites', slug)
  const route = optionalStringList(value, 'route', slug)
  if (favorites) clean.favorites = favorites
  if (route) clean.route = route
  if ('savedFilters' in value) clean.savedFilters = savedFilters(value.savedFilters, slug)
  if ('hideFound' in value) {
    if (typeof value.hideFound !== 'boolean') reject(slug, 'hideFound must be true or false.')
    clean.hideFound = value.hideFound
  }
  if ('mapStyle' in value) {
    if (typeof value.mapStyle !== 'string' || value.mapStyle.length === 0 || value.mapStyle.length > 40) reject(slug, 'mapStyle is invalid.')
    clean.mapStyle = value.mapStyle
  }
  if ('mapMode' in value) clean.mapMode = enumValue(value.mapMode, ['story', 'online'] as const, slug, 'mapMode')
  if ('peyoteSet' in value) clean.peyoteSet = enumValue(value.peyoteSet, ['story', 'online'] as const, slug, 'peyoteSet')
  if ('mapRegion' in value) clean.mapRegion = enumValue(value.mapRegion, ['los-santos', 'cayo'] as const, slug, 'mapRegion')
  if ('stockStart' in value) {
    if (typeof value.stockStart !== 'number' || !Number.isFinite(value.stockStart) || value.stockStart < 0 || value.stockStart > 1e15) {
      reject(slug, 'stockStart is invalid.')
    }
    clean.stockStart = value.stockStart
  }
  if ('customPins' in value) {
    if (!Array.isArray(value.customPins) || value.customPins.length > 500) reject(slug, 'customPins must be a list.')
    clean.customPins = value.customPins.map((item) => pin(item, slug))
  }
  if ('properties' in value) {
    if (!Array.isArray(value.properties) || value.properties.length > 100) reject(slug, 'properties must be a list.')
    clean.properties = value.properties.map((item) => property(item, slug))
  }
  if ('daily' in value) clean.daily = daily(value.daily, slug)
  if ('businesses' in value) clean.businesses = businesses(value.businesses, slug)
  if ('safes' in value) clean.safes = safes(value.safes, slug)
  return normalizeSlice(clean)
}

/** Rejects a backup before it can be written. Missing fields stay at their defaults. A field with the wrong shape rejects the whole file. */
export function parseBackup(text: string) {
  if (typeof text !== 'string' || text.length === 0) throw new Error('Backup was empty.')
  if (text.length > 8_000_000) throw new Error('That backup is too large.')
  let raw: unknown
  try {
    raw = JSON.parse(text) as unknown
  } catch {
    throw new Error('Backup was not valid JSON.')
  }
  if (!isRecord(raw)) throw new Error('Backup was not a JSON object.')
  if ('app' in raw && raw.app !== 'finder') throw new Error('Backup was not made by Finder.')
  if ('version' in raw && raw.version !== 1) throw new Error('Backup version is not supported.')
  if (!isRecord(raw.games)) throw new Error('Backup is missing a games object.')
  const entries = Object.entries(raw.games)
  if (entries.length === 0) throw new Error('No game progress was found in that file.')
  if (entries.length > 20) throw new Error('Backup lists too many games.')

  const result: Record<string, GameSlice> = {}
  for (const [slug, value] of entries) {
    if (!SLUG.test(slug)) throw new Error('Backup has an invalid game id.')
    result[slug] = sliceFrom(value, slug)
  }
  return result
}

export function backupPayload(games: Record<string, GameSlice>) {
  return {
    app: 'finder' as const,
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    games,
  }
}
