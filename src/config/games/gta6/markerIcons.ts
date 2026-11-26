import { gta6Categories } from './categories'
import { leafCategories } from '@/lib/categories'

export const gta6Atlas = { url: '/maps/gta6/marker-atlas-v1.png', width: 660, height: 600, pixelRatio: 2 } as const
export type MarkerSprite = { x: number; y: number; w: number; h: number }

/** Lucide symbols used to build the local atlas. */
const symbols: Record<string, string> = {
  'mg-29021': 'Banknote', 'mg-29030': 'Dumbbell', 'mg-29031': 'Music', 'mg-29041': 'Crosshair',
  'mg-29216': 'FlaskConical', 'mg-29022': 'Landmark', 'mg-29023': 'Landmark',
  'mg-29024': 'BadgeDollarSign', 'mg-29025': 'Gem', 'mg-29026': 'Diamond',
  'mg-29027': 'Scale', 'mg-29037': 'BanknoteArrowDown', 'mg-29051': 'Store',
  'mg-29052': 'Sandwich', 'mg-29054': 'Wine', 'mg-29082': 'UserRound', 'mg-29083': 'Vault',
  'mg-29186': 'Truck', 'mg-29029': 'SprayCan', 'mg-29032': 'Wrench',
  'mg-29033': 'Fuel', 'mg-29034': 'Droplets', 'mg-29035': 'PlugZap',
  'mg-29036': 'BusFront', 'mg-29038': 'TrainFront', 'mg-29039': 'Ship',
  'mg-29040': 'CarFront', 'mg-29062': 'Warehouse', 'mg-29063': 'Warehouse',
  'mg-29095': 'Car', 'mg-29096': 'Car', 'mg-29097': 'Car',
  'mg-29042': 'Shirt', 'mg-29043': 'Shirt', 'mg-29044': 'BriefcaseBusiness',
  'mg-29045': 'Umbrella', 'mg-29046': 'ShoppingBag', 'mg-29047': 'Footprints',
  'mg-29048': 'Scissors', 'mg-29049': 'Paintbrush', 'mg-29050': 'Smartphone',
  'mg-29053': 'Coffee', 'mg-29055': 'Martini', 'mg-29056': 'Utensils',
  'mg-29065': 'Camera', 'mg-29066': 'Search', 'mg-29067': 'Landmark',
  'mg-29093': 'BookOpen', 'mg-29120': 'BookOpen', 'mg-29143': 'Headphones', 'mg-29144': 'Palette',
  'mg-29196': 'Flower2', 'mg-29011': 'CircleDot', 'mg-29013': 'Flag',
  'mg-29015': 'FlagTriangleRight', 'mg-29061': 'CircleDot',
  'mg-29017': 'Target', 'mg-29028': 'Gamepad2', 'mg-29099': 'Fish',
  'mg-29019': 'MoveUpRight', 'mg-29057': 'Wind', 'mg-29059': 'Plane', 'mg-29060': 'PlaneTakeoff',
  'mg-29142': 'Scan',
}

export const gta6IconDefinitions = [
  { id: 'finder-tips', color: '#34d399', symbol: 'Lightbulb' },
  { id: 'finder-story', color: '#f472b6', symbol: 'BookOpen' },
  ...gta6Categories.flatMap((group) => leafCategories([group]).map((leaf) => ({
    id: leaf.id,
    color: leaf.color,
    symbol: symbols[leaf.id] ?? (group.id === 'mg-27138' ? 'Layers' : group.id === 'mg-27136' ? 'Flag' : group.id === 'mg-27140' ? 'ShieldAlert' : 'MapPin'),
  }))),
]

export const gta6CategoryIcons: Record<string, MarkerSprite> = Object.fromEntries(
  gta6IconDefinitions.map((icon, index) => [icon.id, { x: (index % 11) * 60, y: Math.floor(index / 11) * 60, w: 60, h: 60 }]),
)

/** Category symbols match the legend; tags never override them. */
export function gta6Sprite(category: string) {
  return gta6CategoryIcons[category]
}
