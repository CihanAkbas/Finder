import { EMPIRE_ASSETS, type EmpireAsset } from '@/lib/empire'
import type { GameSlice, PropertyTemplate, SavedProperty } from '@/store/slice'

/**
 * Base personal-vehicle bays for one listing.
 * Extra garage floors are not added. A zero means the listing has no personal car bays.
 * `templateId` stays stable for garages already saved under an older id.
 */
const BAYS: Record<string, { slots: number; templateId?: string }> = {
  'low-apartment': { slots: 2 },
  'high-apartment': { slots: 10 },
  yacht: { slots: 0 },
  penthouse: { slots: 10, templateId: 'casino' },
  facility: { slots: 0 },
  kosatka: { slots: 0 },
  office: { slots: 20 },
  'small-warehouse': { slots: 0 },
  'medium-warehouse': { slots: 0 },
  'large-warehouse': { slots: 0 },
  'vehicle-warehouse': { slots: 0 },
  clubhouse: { slots: 10 },
  coke: { slots: 0 },
  meth: { slots: 0 },
  bunker: { slots: 0 },
  hangar: { slots: 0 },
  nightclub: { slots: 10 },
  arcade: { slots: 0 },
  autoshop: { slots: 10 },
  salvage: { slots: 0 },
  agency: { slots: 20 },
  acid: { slots: 0 },
  bail: { slots: 0 },
  garment: { slots: 0 },
  carwash: { slots: 0 },
  helitours: { slots: 0 },
  smoke: { slots: 0 },
}

export type OwnedAsset = EmpireAsset & { templateId: string; slots: number }

const eclipse: OwnedAsset = {
  id: 'eclipse',
  templateId: 'eclipse',
  name: 'Eclipse Towers, Apt 3',
  kind: 'property',
  price: 0,
  dailyFee: 0,
  registeredOnly: false,
  slots: 10,
  note: 'Garage already used by the planner. A list price is not in the fee table, so this row adds nothing to net worth.',
}

/** One record for every property and business. Empire and the garage planner both read this list. */
export const OWNED_ASSETS: OwnedAsset[] = [
  ...EMPIRE_ASSETS.map((asset) => ({
    ...asset,
    templateId: BAYS[asset.id]?.templateId ?? asset.id,
    slots: BAYS[asset.id]?.slots ?? 0,
  })),
  eclipse,
]

export const SHARED_BUSINESSES = ['acid', 'bunker', 'nightclub', 'coke', 'meth'] as const

export function assetById(id: string) {
  return OWNED_ASSETS.find((asset) => asset.id === id || asset.templateId === id)
}

export function sharesBusiness(id: string) {
  return (SHARED_BUSINESSES as readonly string[]).includes(id)
}

export function garageTemplates(): PropertyTemplate[] {
  return OWNED_ASSETS.filter((asset) => asset.slots > 0).map((asset) => ({
    id: asset.templateId,
    name: asset.name,
    slots: asset.slots,
  }))
}

function parked(properties: SavedProperty[]) {
  return properties.some((property) => property.slots.some((slot) => Boolean(slot)))
}

function emptyGarage(asset: OwnedAsset): SavedProperty {
  return {
    id: `garage-${asset.templateId}`,
    templateId: asset.templateId,
    name: asset.name,
    slots: Array.from({ length: asset.slots }, () => null),
  }
}

/**
 * Ownership lives on `ownedAssets`. A garage record exists only to hold bays.
 * Turning an asset off while a bay still has a vehicle leaves both sides unchanged.
 */
/** A saved garage means that listing is owned. This closes older saves that only had one side. */
export function healOwnership(slice: GameSlice): GameSlice {
  const extra = OWNED_ASSETS.filter(
    (asset) => slice.properties.some((property) => property.templateId === asset.templateId) && !slice.ownedAssets.includes(asset.id),
  ).map((asset) => asset.id)
  if (!extra.length) return slice
  return { ...slice, ownedAssets: [...slice.ownedAssets, ...extra] }
}

export function applyOwnership(slice: GameSlice, assetId: string, own: boolean): GameSlice | 'blocked' {
  const asset = assetById(assetId)
  if (!asset) {
    const ownedAssets = own
      ? slice.ownedAssets.includes(assetId) ? slice.ownedAssets : [...slice.ownedAssets, assetId]
      : slice.ownedAssets.filter((id) => id !== assetId)
    return { ...slice, ownedAssets }
  }
  const related = slice.properties.filter((property) => property.templateId === asset.templateId)
  if (!own && parked(related)) return 'blocked'
  const ownedAssets = own
    ? slice.ownedAssets.includes(asset.id) ? slice.ownedAssets : [...slice.ownedAssets, asset.id]
    : slice.ownedAssets.filter((id) => id !== asset.id)
  let properties = slice.properties
  if (own && asset.slots > 0 && related.length === 0) properties = [...properties, emptyGarage(asset)]
  if (!own) properties = properties.filter((property) => property.templateId !== asset.templateId)
  return { ...slice, ownedAssets, properties }
}
