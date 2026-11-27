import type { CategoryNode, GameMarker } from '@/types/game'
import pins from './communityMarkers.json'

export const COMMUNITY_REVIEWED = '2026-11-26'
export const COMMUNITY_SOURCE = 'https://www.gtabase.com/gta-6/map/'
export const COMMUNITY_GROUPS = [
  { id: 'personal', en: 'Homes & public services', tr: 'Evler ve kamu hizmetleri', color: '#34d399' },
  { id: 'discoveries', en: 'Collectibles & discoveries', tr: 'Koleksiyonlar ve keşifler', color: '#fbbf24' },
  { id: 'encounters', en: 'Encounters & mysteries', tr: 'Karşılaşmalar ve gizemler', color: '#c084fc' },
  { id: 'equipment', en: 'Weapons & vehicle locations', tr: 'Silah ve araç konumları', color: '#fda4af' },
  { id: 'places', en: 'Places & transport', tr: 'Mekânlar ve ulaşım', color: '#22d3ee' },
] as const

/** Categories missing from the existing MapGenie snapshot. Counts describe this snapshot only. */
export const COMMUNITY_LAYERS = [
  { id: 'safehouse', group: 'personal', en: 'Safehouses', tr: 'Güvenli evler', symbol: 'House' },
  { id: 'hospital', group: 'personal', en: 'Hospitals', tr: 'Hastaneler', symbol: 'Hospital' },
  { id: 'police-station', group: 'personal', en: 'Police stations', tr: 'Polis merkezleri', symbol: 'Shield' },
  { id: 'fire-station', group: 'personal', en: 'Fire stations', tr: 'İtfaiyeler', symbol: 'Flame' },
  { id: 'cocaine-flamingo', group: 'discoveries', en: 'Cocaine flamingos', tr: 'Kokain flamingoları', symbol: 'Bird', total: 125 },
  { id: 'ahol-street-art', group: 'discoveries', en: 'AHOL street art', tr: 'AHOL sokak sanatı', symbol: 'Paintbrush' },
  { id: 'hidden-package', group: 'discoveries', en: 'Hidden loot', tr: 'Gizli ganimetler', symbol: 'Package' },
  { id: 'comics', group: 'discoveries', en: 'Comics', tr: 'Çizgi romanlar', symbol: 'BookOpen' },
  { id: 'luxury-watch', group: 'discoveries', en: 'Luxury watches', tr: 'Lüks saatler', symbol: 'Watch' },
  { id: 'style-magazine', group: 'discoveries', en: 'Style magazines', tr: 'Stil dergileri', symbol: 'BookImage' },
  { id: 'message-bottle', group: 'discoveries', en: 'Messages in bottles', tr: 'Şişedeki mesajlar', symbol: 'ScrollText' },
  { id: 'meteorite', group: 'discoveries', en: 'Meteorites', tr: 'Meteor parçaları', symbol: 'Orbit' },
  { id: 'treasure', group: 'discoveries', en: 'Treasure sites', tr: 'Hazine noktaları', symbol: 'Gem' },
  { id: 'yellow-loot-box', group: 'discoveries', en: 'Yellow loot boxes', tr: 'Sarı ganimet kutuları', symbol: 'Box' },
  { id: 'scoop-container', group: 'discoveries', en: 'SCOOP containers', tr: 'SCOOP konteynerleri', symbol: 'Container' },
  { id: 'easter-egg', group: 'encounters', en: 'Secrets & easter eggs', tr: 'Sırlar ve sürprizler', symbol: 'Egg' },
  { id: 'random-event', group: 'encounters', en: 'Random encounters', tr: 'Rastgele karşılaşmalar', symbol: 'MessageCircle' },
  { id: 'car-meet', group: 'encounters', en: 'Car meets', tr: 'Otomobil buluşmaları', symbol: 'CarFront' },
  { id: 'hunting', group: 'encounters', en: 'Hunting areas', tr: 'Avlanma alanları', symbol: 'Binoculars' },
  { id: 'weapon-spawn', group: 'equipment', en: 'Weapon pickups', tr: 'Silah buluntuları', symbol: 'Crosshair' },
  { id: 'unique-weapon', group: 'equipment', en: 'Unique weapons', tr: 'Özel silahlar', symbol: 'Swords' },
  { id: 'vehicle-spawn', group: 'equipment', en: 'Vehicle spawn areas', tr: 'Araç çıkış alanları', symbol: 'Car' },
  { id: 'helipad', group: 'places', en: 'Helipads', tr: 'Helikopter pistleri', symbol: 'CircleParking' },
  { id: 'airport', group: 'places', en: 'Airports', tr: 'Havalimanları', symbol: 'Plane' },
  { id: 'cinema', group: 'places', en: 'Cinemas', tr: 'Sinemalar', symbol: 'Clapperboard' },
  { id: 'city-town', group: 'places', en: 'Cities & towns', tr: 'Şehirler ve kasabalar', symbol: 'Building2' },
  { id: 'landmark', group: 'places', en: 'Named landmarks', tr: 'Önemli mekânlar', symbol: 'Landmark' },
  { id: 'marina', group: 'places', en: 'Marinas', tr: 'Marinalar', symbol: 'Anchor' },
  { id: 'collectible-card', group: 'discoveries', en: 'Additional collectible cards', tr: 'Ek koleksiyon kartları', symbol: 'Layers' },
  { id: 'underwater', group: 'discoveries', en: 'Underwater discoveries', tr: 'Su altı keşifleri', symbol: 'Waves' },
  { id: 'shipwreck', group: 'discoveries', en: 'Shipwrecks', tr: 'Gemi enkazları', symbol: 'Ship' },
  { id: 'waink-peewee', group: 'discoveries', en: 'Peewees billboards', tr: 'Peewees reklam panoları', symbol: 'ScanLine' },
  { id: 'waink-noflusher', group: 'discoveries', en: 'No Flusher tags', tr: 'No Flusher etiketleri', symbol: 'Paintbrush' },
  { id: 'parachuting', group: 'equipment', en: 'Parachute pickups', tr: 'Paraşüt buluntuları', symbol: 'Wind' },
  { id: 'clothing-pickups', group: 'equipment', en: 'Clothing & scuba pickups', tr: 'Kıyafet ve dalış ekipmanı', symbol: 'Shirt' },
  { id: 'gang-compound', group: 'encounters', en: 'Gang compounds', tr: 'Çete yerleşkeleri', symbol: 'ShieldAlert' },
  { id: 'strangers', group: 'encounters', en: 'Side-mission contacts', tr: 'Yan görev bağlantıları', symbol: 'UserRound' },
  { id: 'missing-tourists', group: 'encounters', en: 'Missing tourists', tr: 'Kayıp turistler', symbol: 'Search' },
  { id: 'unique-animals', group: 'encounters', en: 'Unique animals', tr: 'Özel hayvanlar', symbol: 'PawPrint' },
] as const

export const communityMarkers = pins as GameMarker[]
export const communityCategories: CategoryNode[] = COMMUNITY_GROUPS.map((group) => ({
  id: `community-${group.id}`, name: group.en, icon: 'landmark', color: group.color,
  children: COMMUNITY_LAYERS.filter((layer) => layer.group === group.id).map((layer) => ({
    id: `community-${layer.id}`, name: layer.en, icon: 'landmark', color: group.color,
    ...('total' in layer ? { worldTotal: layer.total } : {}),
  })),
}))

export function communityCategoryCopy(id: string) {
  const group = COMMUNITY_GROUPS.find((group) => `community-${group.id}` === id)
  const layer = COMMUNITY_LAYERS.find((layer) => `community-${layer.id}` === id)
  return group ? { name: group.tr } : layer ? { name: layer.tr } : undefined
}
