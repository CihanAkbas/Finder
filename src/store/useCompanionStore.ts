import { canonicalMarkerId } from '@/lib/markerAliases'
import { createJSONStorage, persist } from 'zustand/middleware'
import { create } from 'zustand'
import { createProgressStorage } from '@/lib/idbStorage'
import { applyOwnership, assetById, healOwnership } from '@/lib/ownership'
import { seedGta6Layers } from '@/config/games/gta6/playLayers'
import { normalizeSlice, type CustomPin, type GameSlice, type SafeTrack, type SavedOutfit, type SavedFilter, type SavedProperty } from '@/store/slice'

export type { CustomPin, GameSlice, SavedProperty }

export type Camera = { x: number; y: number; z: number }
export type FocusRequest = { game: string; id: string; x: number; y: number; zoom: number; nonce: number }

type CompanionState = {
  byGame: Record<string, GameSlice>
  pointer: { x: number; y: number } | null
  camera: Camera | null
  selected: { game: string; id: string } | null
  searchOpen: boolean
  contributeMode: boolean
  contributeDraft: { game: string; x: number; y: number } | null
  pinDraft: { game: string; x: number; y: number } | null
  importOpen: boolean
  resetOpen: boolean
  toast: string | null
  focusRequest: FocusRequest | null
  toggleClothing: (id: string) => void
  toggleOutfit: (id: string) => void
  saveOutfit: (outfit: SavedOutfit) => void
  removeOutfit: (id: string) => void
  toggleFound: (game: string, id: string) => void
  toggleChecklist: (game: string, itemId: string, markerId?: string) => void
  toggleObjective: (game: string, itemId: string, objectiveId: string) => void
  toggleDaily: (game: string, taskId: string, periodKey: string) => void
  setBusinessStart: (game: string, businessId: string, startedAt: string | null) => void
  addProperty: (game: string, templateId: string) => void
  assignSlot: (game: string, propertyId: string, index: number, vehicleId: string | null) => void
  removeProperty: (game: string, propertyId: string) => boolean
  restoreProperty: (game: string, property: SavedProperty) => void
  setPropertyNote: (game: string, propertyId: string, note: string) => void
  setSlotNote: (game: string, propertyId: string, index: number, note: string) => void
  moveVehicle: (game: string, fromId: string, fromIndex: number, toId: string, toIndex: number) => void
  toggleFavorite: (game: string, id: string) => void
  toggleRouteStop: (game: string, id: string) => void
  moveRouteStop: (game: string, id: string, direction: -1 | 1) => void
  clearRoute: (game: string) => void
  saveFilter: (game: string, name: string) => void
  applyFilter: (game: string, id: string) => void
  deleteFilter: (game: string, id: string) => void
  setStockStart: (game: string, amount: number) => void
  toggleCareer: (game: string, tierId: string) => void
  toggleOwnedAsset: (game: string, assetId: string) => boolean
  toggleOwnedVehicle: (game: string, vehicleId: string) => void
  setSafe: (game: string, safeId: string, patch: Partial<SafeTrack>) => void
  requestFocus: (request: Omit<FocusRequest, 'nonce'>) => void
  setHidden: (game: string, ids: string[]) => void
  toggleLeaves: (game: string, ids: string[], visible: boolean) => void
  setHideFound: (game: string, hide: boolean) => void
  setMapStyle: (game: string, styleId: string) => void
  setMapMode: (game: string, mode: 'story' | 'online') => void
  setMapRegion: (game: string, region: 'los-santos' | 'cayo') => void
  addPin: (game: string, pin: CustomPin) => void
  updatePin: (game: string, id: string, patch: Partial<Pick<CustomPin, 'title' | 'note' | 'color'>>) => void
  removePin: (game: string, id: string) => void
  replaceGames: (games: Record<string, Partial<GameSlice>>) => void
  resetGame: (game: string) => void
  select: (game: string, id: string) => void
  clearSelection: () => void
  setSearchOpen: (open: boolean) => void
  setContributeMode: (on: boolean) => void
  openContribute: (game: string, x: number, y: number) => void
  closeContribute: () => void
  openPinDraft: (game: string, x: number, y: number) => void
  closePinDraft: () => void
  setImportOpen: (open: boolean) => void
  setResetOpen: (open: boolean) => void
  setPointer: (pointer: { x: number; y: number } | null) => void
  setCamera: (camera: Camera) => void
  showToast: (message: string) => void
}

function sameCamera(a: Camera | null, b: Camera) {
  if (!a) return false
  return a.x.toFixed(1) === b.x.toFixed(1) && a.y.toFixed(1) === b.y.toFixed(1) && a.z.toFixed(2) === b.z.toFixed(2)
}

function samePointer(a: { x: number; y: number } | null, b: { x: number; y: number } | null) {
  if (a === b) return true
  if (!a || !b) return false
  return a.x.toFixed(1) === b.x.toFixed(1) && a.y.toFixed(1) === b.y.toFixed(1)
}

function updateGame(state: { byGame: Record<string, GameSlice> }, game: string, patch: (slice: GameSlice) => GameSlice) {
  const slice = seedGta6Layers(game, healOwnership(normalizeSlice(state.byGame[game])))
  return { byGame: { ...state.byGame, [game]: patch(slice) } }
}

function togglePoint(ids: string[], id: string, limit = Infinity) {
  const canonical = canonicalMarkerId(id)
  return ids.includes(canonical) ? ids.filter(item => item !== canonical) : [...ids, canonical].slice(0, limit)
}

let toastTimer = 0

export const useCompanionStore = create<CompanionState>()(
  persist(
    (set, get) => ({
      byGame: {},
      pointer: null,
      camera: null,
      selected: null,
      searchOpen: false,
      contributeMode: false,
      contributeDraft: null,
      pinDraft: null,
      importOpen: false,
      resetOpen: false,
      toast: null,
      focusRequest: null,
      toggleClothing: (id) => set(state => updateGame(state, 'gta6', slice => ({ ...slice, ownedClothes: togglePoint(slice.ownedClothes, id) }))),
      toggleOutfit: (id) => set(state => updateGame(state, 'gta6', slice => ({ ...slice, savedOutfits: togglePoint(slice.savedOutfits, id) }))),
      saveOutfit: (outfit) => set(state => updateGame(state, 'gta6', slice => ({ ...slice, customOutfits: [...slice.customOutfits.filter(row => row.id !== outfit.id), outfit].slice(0, 100) }))),
      removeOutfit: (id) => set(state => updateGame(state, 'gta6', slice => ({ ...slice, customOutfits: slice.customOutfits.filter(row => row.id !== id) }))),
      toggleFound: (game, id) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            found: togglePoint(slice.found, id),
          })),
        ),
      toggleChecklist: (game, itemId, markerId) => {
        if (markerId) {
          get().toggleFound(game, markerId)
          return
        }
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            checklistDone: slice.checklistDone.includes(itemId)
              ? slice.checklistDone.filter((item) => item !== itemId)
              : [...slice.checklistDone, itemId],
          })),
        )
      },
      toggleObjective: (game, itemId, objectiveId) => {
        const key = `${itemId}:${objectiveId}`
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            objectiveDone: slice.objectiveDone.includes(key)
              ? slice.objectiveDone.filter((item) => item !== key)
              : [...slice.objectiveDone, key],
          })),
        )
      },
      toggleDaily: (game, taskId, periodKey) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const ids = slice.daily.periodKey === periodKey ? slice.daily.ids : []
            return {
              ...slice,
              daily: {
                periodKey,
                ids: ids.includes(taskId) ? ids.filter((item) => item !== taskId) : [...ids, taskId],
              },
            }
          }),
        ),
      setBusinessStart: (game, businessId, startedAt) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            businesses: { ...slice.businesses, [businessId]: { startedAt } },
          })),
        ),
      addProperty: (game, templateId) =>
        set((state) => {
          const slice = healOwnership(normalizeSlice(state.byGame[game]))
          const next = applyOwnership(slice, templateId, true)
          if (next === 'blocked') return state
          return { byGame: { ...state.byGame, [game]: next } }
        }),
      assignSlot: (game, propertyId, index, vehicleId) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            properties: slice.properties.map((property) => {
              if (property.id !== propertyId) return property
              const next = [...property.slots]
              if (index >= 0 && index < next.length) next[index] = vehicleId
              return { ...property, slots: next }
            }),
          })),
        ),
      removeProperty: (game, propertyId) => {
        let blocked = false
        set((state) => {
          const slice = healOwnership(normalizeSlice(state.byGame[game]))
          const property = slice.properties.find((item) => item.id === propertyId)
          if (!property) return state
          if (property.slots.some((slot) => Boolean(slot))) {
            blocked = true
            return state
          }
          const properties = slice.properties.filter((item) => item.id !== propertyId)
          const asset = assetById(property.templateId)
          const stillThere = properties.some((item) => item.templateId === property.templateId)
          const ownedAssets = asset && !stillThere ? slice.ownedAssets.filter((id) => id !== asset.id) : slice.ownedAssets
          return { byGame: { ...state.byGame, [game]: { ...slice, properties, ownedAssets } } }
        })
        return !blocked
      },
      restoreProperty: (game, property) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const asset = assetById(property.templateId)
            const ownedAssets = asset && !slice.ownedAssets.includes(asset.id) ? [...slice.ownedAssets, asset.id] : slice.ownedAssets
            if (slice.properties.some((item) => item.id === property.id)) return { ...slice, ownedAssets }
            return { ...slice, ownedAssets, properties: [...slice.properties, property] }
          }),
        ),
      setPropertyNote: (game, propertyId, note) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            properties: slice.properties.map((property) => (
              property.id === propertyId ? { ...property, note: note.trim().slice(0, 280) } : property
            )),
          })),
        ),
      setSlotNote: (game, propertyId, index, note) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            properties: slice.properties.map((property) => {
              if (property.id !== propertyId || index < 0 || index >= property.slots.length) return property
              const slotNotes = Array.from({ length: property.slots.length }, (_, slot) => property.slotNotes?.[slot] ?? null)
              slotNotes[index] = note.trim().slice(0, 280) || null
              return { ...property, slotNotes }
            }),
          })),
        ),
      moveVehicle: (game, fromId, fromIndex, toId, toIndex) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const from = slice.properties.find((property) => property.id === fromId)
            const to = slice.properties.find((property) => property.id === toId)
            const vehicleId = from?.slots[fromIndex]
            if (!from || !to || !vehicleId || to.slots[toIndex] !== null) return slice
            return {
              ...slice,
              properties: slice.properties.map((property) => {
                if (property.id !== fromId && property.id !== toId) return property
                const slots = [...property.slots]
                if (property.id === fromId) slots[fromIndex] = null
                if (property.id === toId) slots[toIndex] = vehicleId
                return { ...property, slots }
              }),
            }
          }),
        ),
      setStockStart: (game, amount) =>
        set((state) => updateGame(state, game, (slice) => ({ ...slice, stockStart: Math.max(0, amount) }))),
      toggleCareer: (game, tierId) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            careerDone: slice.careerDone.includes(tierId) ? slice.careerDone.filter((id) => id !== tierId) : [...slice.careerDone, tierId],
          })),
        ),
      toggleOwnedAsset: (game, assetId) => {
        let blocked = false
        set((state) => {
          const slice = healOwnership(normalizeSlice(state.byGame[game]))
          const next = applyOwnership(slice, assetId, !slice.ownedAssets.includes(assetId))
          if (next === 'blocked') {
            blocked = true
            return state
          }
          return { byGame: { ...state.byGame, [game]: next } }
        })
        return !blocked
      },
      toggleOwnedVehicle: (game, vehicleId) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            ownedVehicles: slice.ownedVehicles.includes(vehicleId) ? slice.ownedVehicles.filter((id) => id !== vehicleId) : [...slice.ownedVehicles, vehicleId],
          })),
        ),
      setSafe: (game, safeId, patch) => {
        if (!/^[a-z0-9-]{1,40}$/.test(safeId)) return
        set((state) =>
          updateGame(state, game, (slice) => {
            const current = slice.safes[safeId] ?? { anchorAt: null, anchorAmount: 0 }
            return {
              ...slice,
              safes: { ...slice.safes, [safeId]: { ...current, ...patch } },
            }
          }),
        )
      },
      requestFocus: (request) =>
        set({
          focusRequest: { ...request, id: canonicalMarkerId(request.id), nonce: Date.now() },
          selected: { game: request.game, id: canonicalMarkerId(request.id) },
          searchOpen: false,
        }),
      setHidden: (game, ids) =>
        set((state) => updateGame(state, game, (slice) => ({ ...slice, hiddenCategories: ids, layerSetup: true }))),
      toggleLeaves: (game, ids, visible) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const hidden = new Set(slice.hiddenCategories)
            for (const id of ids) {
              if (visible) hidden.delete(id)
              else hidden.add(id)
            }
            return { ...slice, hiddenCategories: [...hidden], layerSetup: true }
          }),
        ),
      setHideFound: (game, hide) => set((state) => updateGame(state, game, (slice) => ({ ...slice, hideFound: hide }))),
      setMapStyle: (game, styleId) => set((state) => updateGame(state, game, (slice) => ({ ...slice, mapStyle: styleId }))),
      setMapMode: (game, mode) => set((state) => updateGame(state, game, (slice) => ({ ...slice, mapMode: mode }))),
      setMapRegion: (game, mapRegion) => set((state) => updateGame(state, game, (slice) => ({ ...slice, mapRegion }))),
      addPin: (game, pin) =>
        set((state) => updateGame(state, game, (slice) => ({ ...slice, customPins: [...slice.customPins, pin] }))),
      updatePin: (game, id, patch) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            customPins: slice.customPins.map((pin) => (pin.id === id ? { ...pin, ...patch } : pin)),
          })),
        ),
      removePin: (game, id) =>
        set((state) => {
          const selected = state.selected?.game === game && state.selected.id === id ? null : state.selected
          return {
            selected,
            ...updateGame(state, game, (slice) => ({ ...slice, customPins: slice.customPins.filter((pin) => pin.id !== id) })),
          }
        }),
      replaceGames: (games) =>
        set((state) => {
          const byGame = { ...state.byGame }
          for (const [slug, slice] of Object.entries(games)) {
            byGame[slug] = seedGta6Layers(slug, healOwnership(normalizeSlice({ ...byGame[slug], ...slice })))
          }
          return { byGame }
        }),
      resetGame: (game) =>
        set((state) => {
          const byGame = { ...state.byGame }
          delete byGame[game]
          const selected = state.selected?.game === game ? null : state.selected
          return { byGame, selected }
        }),
      select: (game, id) => set({ selected: { game, id: canonicalMarkerId(id) } }),
      clearSelection: () => set({ selected: null }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setContributeMode: (contributeMode) => set({ contributeMode }),
      openContribute: (game, x, y) => set({ contributeDraft: { game, x, y } }),
      closeContribute: () => set({ contributeDraft: null }),
      openPinDraft: (game, x, y) => set({ pinDraft: { game, x, y } }),
      closePinDraft: () => set({ pinDraft: null }),
      setImportOpen: (importOpen) => set({ importOpen }),
      setResetOpen: (resetOpen) => set({ resetOpen }),
      setPointer: (pointer) => set((state) => (samePointer(state.pointer, pointer) ? state : { pointer })),
      setCamera: (camera) => set((state) => (sameCamera(state.camera, camera) ? state : { camera })),
      toggleFavorite: (game, id) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            favorites: togglePoint(slice.favorites, id, 80),
          })),
        ),
      toggleRouteStop: (game, id) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            route: togglePoint(slice.route, id, 24),
          })),
        ),
      moveRouteStop: (game, id, direction) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const index = slice.route.indexOf(canonicalMarkerId(id))
            const next = index + direction
            if (index < 0 || next < 0 || next >= slice.route.length) return slice
            const route = [...slice.route]
            const [item] = route.splice(index, 1)
            route.splice(next, 0, item)
            return { ...slice, route }
          }),
        ),
      clearRoute: (game) => set((state) => updateGame(state, game, (slice) => ({ ...slice, route: [] }))),
      saveFilter: (game, name) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const label = name.trim().slice(0, 40)
            if (!label || slice.savedFilters.length >= 12) return slice
            const filter: SavedFilter = {
              id: `view-${crypto.randomUUID()}`,
              name: label,
              hiddenCategories: slice.hiddenCategories,
              hideFound: slice.hideFound,
            }
            return { ...slice, savedFilters: [...slice.savedFilters, filter] }
          }),
        ),
      applyFilter: (game, id) =>
        set((state) =>
          updateGame(state, game, (slice) => {
            const filter = slice.savedFilters.find((item) => item.id === id)
            if (!filter) return slice
            return { ...slice, hiddenCategories: filter.hiddenCategories, hideFound: filter.hideFound }
          }),
        ),
      deleteFilter: (game, id) =>
        set((state) =>
          updateGame(state, game, (slice) => ({
            ...slice,
            savedFilters: slice.savedFilters.filter((item) => item.id !== id),
          })),
        ),
      showToast: (message) => {
        window.clearTimeout(toastTimer)
        set({ toast: message })
        toastTimer = window.setTimeout(() => set({ toast: null }), 2400)
      },
    }),
    {
      name: 'finder-map-progress',
      // Stays at 2. New lists default inside normalizeSlice, so old saves still open.
      version: 2,
      storage: createJSONStorage(createProgressStorage),
      partialize: (state) => ({ byGame: state.byGame }),
      merge: (persisted, current) => {
        const saved = (persisted as { byGame?: Record<string, Partial<GameSlice>> } | undefined)?.byGame ?? {}
        const byGame: Record<string, GameSlice> = {}
        for (const [slug, slice] of Object.entries(saved)) byGame[slug] = seedGta6Layers(slug, healOwnership(normalizeSlice(slice)))
        return { ...current, byGame }
      },
    },
  ),
)

export const PIN_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#fb7185', '#c4b5fd', '#f8fafc', '#38bdf8', '#e4b341']
export const EMPTY_PINS: CustomPin[] = []
