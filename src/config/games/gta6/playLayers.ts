import { gta6Categories } from './categories'
import { leafCategories } from '@/lib/categories'
import { COMMUNITY_LAYERS, communityCategories } from './community'

/**
 * Layers that cover Leonida when every pin is on.
 * Gameplay tips, shops, contacts and garages stay visible.
 * The player can turn any of these back on from the filter list.
 */
export const GTA6_NOISE_LAYERS = [
  ...COMMUNITY_LAYERS.filter((layer) => ['discoveries', 'encounters'].includes(layer.group) || ['vehicle-spawn', 'helipad', 'landmark', 'city-town'].includes(layer.id)).map((layer) => `community-${layer.id}`),
  'mg-29036',
  'mg-29021',
  'mg-29037',
  'mg-29035',
  'mg-29060',
  'mg-29019',
  'mg-29057',
  'mg-29059',
  'mg-29011',
  'mg-29056',
  'mg-29053',
  'mg-29055',
  'mg-29051',
  'mg-29095',
  'mg-29142',
  'mg-29028',
  'mg-29120',
  'mg-29066',
  'mg-29099',
  'mg-29170',
  'mg-29173',
  'mg-29168',
  'mg-29176',
  'mg-29179',
  'mg-29174',
  'mg-29171',
  'mg-29167',
  'mg-29175',
  'mg-29169',
  'mg-29172',
  'mg-29181',
  'mg-29180',
  'mg-29178',
  'mg-29112',
  'mg-29114',
] as const

/** Group IDs follow the catalog so newly added categories join their relevant view. */
export const GTA6_PLAYER_VIEWS = [
  { id: 'services', title: { en: 'Essentials', tr: 'Temel ihtiyaçlar' }, groups: ['mg-27128', 'mg-27130', 'mg-27131', 'mg-27132', 'community-personal', 'community-places'] },
  { id: 'money', title: { en: 'Money', tr: 'Para kazan' }, groups: ['mg-27129', 'mg-27140'] },
  { id: 'collect', title: { en: 'Collectibles', tr: 'Koleksiyon' }, groups: ['mg-27134', 'mg-27137', 'mg-27138', 'community-discoveries'] },
  { id: 'activities', title: { en: 'Activities', tr: 'Etkinlikler' }, groups: ['mg-27123', 'mg-27125', 'mg-27127', 'mg-27136'] },
  { id: 'equipment', title: { en: 'Weapons & vehicles', tr: 'Silah ve araç' }, groups: ['community-equipment', 'mg-27130'] },
  { id: 'mysteries', title: { en: 'Encounters & secrets', tr: 'Karşılaşma ve sırlar' }, groups: ['community-encounters'] },
] as const

export function playerViewHidden(id: typeof GTA6_PLAYER_VIEWS[number]['id']): string[] {
  const view = GTA6_PLAYER_VIEWS.find((item) => item.id === id)!
  const visibleGroups = new Set<string>(view.groups)
  const moneyLayers = new Set(['community-hidden-package', 'community-yellow-loot-box', 'community-scoop-container', 'community-treasure'])
  return [...communityCategories, ...gta6Categories].flatMap((group) => visibleGroups.has(group.id) ? [] : leafCategories([group]).filter((leaf) => id !== 'money' || !moneyLayers.has(leaf.id)).map((leaf) => leaf.id))
}

type LayerSlice = {
  hiddenCategories: string[]
  layerSetup?: boolean
}

/** First open of GTA VI hides the noisy layers once. A chosen filter is left alone. */
export function seedGta6Layers<T extends LayerSlice>(slug: string, slice: T): T {
  if (slug !== 'gta6' || slice.layerSetup) return slice
  if (slice.hiddenCategories.length > 0) return { ...slice, layerSetup: true }
  return { ...slice, hiddenCategories: [...GTA6_NOISE_LAYERS], layerSetup: true }
}

/** What the map should hide before the saved filter is written. */
export function hiddenCategoryIds(slug: string, slice?: { hiddenCategories?: string[]; layerSetup?: boolean } | null) {
  const stored = slice?.hiddenCategories ?? []
  if (slug === 'gta6' && !slice?.layerSetup && stored.length === 0) return GTA6_NOISE_LAYERS
  return stored
}
