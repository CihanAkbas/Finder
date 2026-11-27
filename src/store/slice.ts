import { canonicalMarkerIds } from '@/lib/markerAliases'
export type CustomPin = {
  id: string
  title: string
  note: string
  color: string
  x: number
  y: number
  createdAt: string
}

export type ChecklistGroup = 'story' | 'hobbies' | 'strangers' | 'random' | 'misc' | 'beyond'

export type MedalRank = 'none' | 'bronze' | 'silver' | 'gold'

export type ChecklistObjective = {
  id: string
  text: string
  /** Set when one checklist row covers more than one gold medal, such as a heist approach. */
  track?: string
  trackTitle?: string
}

export type ChecklistItem = {
  id: string
  title: string
  detail: string
  group: ChecklistGroup
  requiredFor100: boolean
  /** Published share of the 100% score, used by GTA VI. GTA V keeps group weights. */
  share?: number
  trophy?: 'missable' | 'online' | 'story'
  /** This row can award one or more medals toward Solid Gold, Baby! */
  solidGold?: boolean
  objectives?: ChecklistObjective[]
  /** Completing this row is the same as marking that map pin found. */
  markerId?: string
  /** Opens the map without counting the pin as the task. */
  mapId?: string
  collect?: { category: string; needed: number }
  /** Any `needed` ticked rows that share this id fill the bucket. */
  quota?: { id: string; needed: number }
}

export type DailyTask = { id: string; title: string }

export type DailySlot = {
  gunVan: { title: string; markerId?: string; note: string; stock: { name: string; discount: number }[] }
  dealers: { title: string; markerId?: string; note: string }[]
  stash: { title: string; markerId?: string; note: string }
  trials: { title: string; note: string }[]
}

export type DailyPack = {
  resets: { dailyHourUtc: number; weeklyWeekday: number; weeklyHourUtc: number }
  tasks: DailyTask[]
  /** Index 0 is Sunday in the UTC day after `dailyHourUtc`. The same weekday always returns the same row. */
  weekdays: DailySlot[]
  /** Cycled by the Thursday weekly reset, not by the calendar date modulo a placeholder list. */
  weeklyBonuses: string[][]
}

/** @deprecated Older saves and notes used this name for one combined day. */
export type DailyRotation = DailySlot & { bonuses: string[] }

export type Vehicle = {
  id: string
  name: string
  class: string
  price: number
  topSpeedMph: number
  topSpeedKmh: number
  lapTime: number
  drivetrain: string
  seats: number
  /** Fence price from the published map. Showroom price stays in `price`. */
  sellValue?: number
  /** In-game manufacturer, such as Pegassi or Grotti. */
  manufacturer?: string
  weaponized?: boolean
  armored?: boolean
  hsw?: boolean
  /** Same flag as `hsw`, exposed for the HSW filter. */
  isHsw?: boolean
  imani?: boolean
  /** Usual in-game website or how the vehicle is obtained. */
  acquisitionSource?: string
  spawnLocations?: string[]
  /** Community identification of a vehicle shown in official GTA VI footage. */
  verifiedFootage?: boolean
  note?: string
}

export type Weapon = {
  id: string
  name: string
  class: string
  damage: number
  fireRate: number
  dps: number
  ttkMs: number
  magazine: number
  range: number
  unlockRank: number
  price: number
  /** Online catalog price. Attachment and spawn notes are reference text, not a live shop feed. */
  storyUnlockCondition?: string
  attachments?: string[]
  worldSpawns?: string[]
  mk2?: boolean
  verifiedFootage?: boolean
}

export type HeistFee = { name: string; rate?: number; amount?: number }

export type HeistTarget = { id: string; name: string; value: number; primary?: boolean }

export type Heist = {
  id: string
  name: string
  hardModeBonus: number
  minPlayers?: number
  maxPlayers?: number
  fees: HeistFee[]
  targets: HeistTarget[]
  secondaries: { id: string; name: string; value: number }[]
}

export type Business = {
  id: string
  name: string
  product: string
  hoursToFill: number
  maxValue: number
  note: string
}

export type StockStep = {
  id: string
  order: number
  mission: string
  ticker: string
  company: string
  exchange: 'LCN' | 'BAWSAQ'
  multiplier: number
  instruction: string
}

export type PropertyTemplate = { id: string; name: string; slots: number }

export type SavedProperty = {
  id: string
  templateId: string
  name: string
  slots: (string | null)[]
  note?: string
  slotNotes?: (string | null)[]
}

export type SavedFilter = {
  id: string
  name: string
  hiddenCategories: string[]
  hideFound: boolean
}

export type MapMode = 'story' | 'online'
export type PeyoteSet = 'story' | 'online'
export type MapRegion = 'los-santos' | 'cayo'

/** Wall-safe planner. The anchor is when the player last set the cash, not a Rockstar tick. */
export type SafeTrack = {
  anchorAt: string | null
  anchorAmount: number
  popularity?: number
  contracts?: number
  wallSafe?: boolean
  peak?: boolean
  machines?: boolean
}

export type SavedOutfit = { id: string; name: string; itemIds: string[]; createdAt: string }

export type GameSlice = {
  ownedClothes: string[]
  savedOutfits: string[]
  customOutfits: SavedOutfit[]
  found: string[]
  hiddenCategories: string[]
  hideFound: boolean
  customPins: CustomPin[]
  mapStyle: string
  mapMode: MapMode
  peyoteSet: PeyoteSet
  mapRegion: MapRegion
  checklistDone: string[]
  /** Checked gold-medal objectives, stored as `missionId:objectiveId`. The medal itself is derived from these. */
  objectiveDone: string[]
  daily: { periodKey: string; ids: string[] }
  businesses: Record<string, { startedAt: string | null }>
  properties: SavedProperty[]
  stockStart: number
  /** Career Progress tier ids, `branch:tier`. Manual checks. They do not change the 100% score. */
  careerDone: string[]
  /** Empire portfolio property and business ids. */
  ownedAssets: string[]
  /** Empire portfolio vehicle ids from the catalog. */
  ownedVehicles: string[]
  safes: Record<string, SafeTrack>
  /** Marker and custom pin ids kept at the top of the map list. */
  favorites: string[]
  /** Ordered stops for a personal straight-line route. */
  route: string[]
  /** Named snapshots of the category filters. */
  savedFilters: SavedFilter[]
  /** True after the player chooses a layer set, or after the GTA VI play view is applied once. */
  layerSetup: boolean
}

export function emptySlice(): GameSlice {
  return {
    ownedClothes: [],
    savedOutfits: [],
    customOutfits: [],
    found: [],
    hiddenCategories: [],
    hideFound: false,
    customPins: [],
    mapStyle: 'atlas',
    mapMode: 'story',
    peyoteSet: 'story',
    mapRegion: 'los-santos',
    checklistDone: [],
    objectiveDone: [],
    daily: { periodKey: '', ids: [] },
    businesses: {},
    properties: [],
    stockStart: 100000,
    careerDone: [],
    ownedAssets: [],
    ownedVehicles: [],
    safes: {},
    favorites: [],
    route: [],
    savedFilters: [],
    layerSetup: false,
  }
}

function stringList(value: unknown) {
  if (!Array.isArray(value)) return []
  const ids = value.filter((item): item is string => typeof item === 'string' && item.length > 0 && item.length <= 160)
  return [...new Set(ids)]
}

function noteText(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, 280)
}

function normalizeProperties(value: unknown): SavedProperty[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const row = item as Partial<SavedProperty>
    if (typeof row.id !== 'string' || typeof row.templateId !== 'string' || typeof row.name !== 'string' || !Array.isArray(row.slots)) return []
    const slots = row.slots.map((slot) => (typeof slot === 'string' ? slot : null))
    const notes = Array.isArray(row.slotNotes) ? row.slotNotes.map((note) => noteText(note) || null) : undefined
    const note = noteText(row.note)
    return [{ id: row.id, templateId: row.templateId, name: row.name, slots, ...(note ? { note } : {}), ...(notes?.some(Boolean) ? { slotNotes: notes } : {}) }]
  })
}

function normalizeFilters(value: unknown): SavedFilter[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const row = item as Partial<SavedFilter>
    if (typeof row.id !== 'string' || typeof row.name !== 'string') return []
    const name = row.name.trim().slice(0, 40)
    if (!name) return []
    return [{
      id: row.id,
      name,
      hiddenCategories: stringList(row.hiddenCategories),
      hideFound: row.hideFound === true,
    }]
  }).slice(0, 24)
}

function normalizeSafes(value: unknown): Record<string, SafeTrack> {
  if (!value || typeof value !== 'object') return {}
  const out: Record<string, SafeTrack> = {}
  for (const [id, raw] of Object.entries(value as Record<string, unknown>)) {
    if (!/^[a-z0-9-]{1,40}$/.test(id) || !raw || typeof raw !== 'object') continue
    const row = raw as Record<string, unknown>
    const amount = typeof row.anchorAmount === 'number' && Number.isFinite(row.anchorAmount) ? Math.min(10_000_000, Math.max(0, Math.round(row.anchorAmount))) : 0
    const anchorAt = typeof row.anchorAt === 'string' && !Number.isNaN(Date.parse(row.anchorAt)) ? row.anchorAt : null
    const next: SafeTrack = { anchorAt, anchorAmount: amount }
    if (typeof row.popularity === 'number' && Number.isFinite(row.popularity)) next.popularity = Math.min(100, Math.max(0, Math.round(row.popularity)))
    if (typeof row.contracts === 'number' && Number.isFinite(row.contracts)) next.contracts = Math.min(500, Math.max(0, Math.round(row.contracts)))
    if (typeof row.wallSafe === 'boolean') next.wallSafe = row.wallSafe
    if (typeof row.peak === 'boolean') next.peak = row.peak
    if (typeof row.machines === 'boolean') next.machines = row.machines
    out[id] = next
  }
  return out
}

export function normalizeSlice(partial?: Partial<GameSlice> | null): GameSlice {
  const base = emptySlice()
  if (!partial) return base
  const rest = { ...partial } as Partial<GameSlice> & { lfgPosts?: unknown }
  delete rest.lfgPosts
  return {
    ...base,
    ...rest,
    ownedClothes: stringList(rest.ownedClothes),
    savedOutfits: stringList(rest.savedOutfits),
    customOutfits: Array.isArray(rest.customOutfits) ? rest.customOutfits.filter(row => row && typeof row.id === 'string' && typeof row.name === 'string' && row.name.trim() && typeof row.createdAt === 'string' && !Number.isNaN(Date.parse(row.createdAt))).slice(0, 100).map(row => ({ id: row.id.slice(0, 160), name: row.name.trim().slice(0, 80), itemIds: stringList(row.itemIds).slice(0, 30), createdAt: row.createdAt })) : [],
    found: canonicalMarkerIds(stringList(rest.found)),
    hiddenCategories: rest.hiddenCategories ?? [],
    customPins: rest.customPins ?? [],
    checklistDone: rest.checklistDone ?? [],
    objectiveDone: rest.objectiveDone ?? [],
    daily: rest.daily?.periodKey !== undefined ? { periodKey: rest.daily.periodKey, ids: rest.daily.ids ?? [] } : base.daily,
    businesses: rest.businesses ?? {},
    properties: normalizeProperties(rest.properties),
    careerDone: stringList(rest.careerDone),
    ownedAssets: stringList(rest.ownedAssets),
    ownedVehicles: stringList(rest.ownedVehicles),
    safes: normalizeSafes(rest.safes),
    favorites: canonicalMarkerIds(stringList(rest.favorites)),
    route: canonicalMarkerIds(stringList(rest.route)),
    savedFilters: normalizeFilters(rest.savedFilters),
    layerSetup: rest.layerSetup === true,
    mapStyle: rest.mapStyle ?? base.mapStyle,
    mapMode: rest.mapMode === 'online' ? 'online' : 'story',
    peyoteSet: rest.peyoteSet === 'online' ? 'online' : 'story',
    mapRegion: rest.mapRegion === 'cayo' ? 'cayo' : 'los-santos',
  }
}
