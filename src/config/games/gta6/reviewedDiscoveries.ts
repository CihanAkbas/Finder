import type { GameMarker } from '@/types/game'
import { communityToMap } from '@/lib/communityProjection'
import { REVIEWED_GUIDES } from './reviewedGuides'
const source = 'https://gta6map.city/secrets/leviathan-sea-monster-skeleton-off-bobcat-key/'
const leviathan: GameMarker = {
  id: 'gta6-secret-leviathan', title: 'Leviathan · Bobcat Key skeleton', category: 'community-underwater', ...communityToMap(-7493.9, -2820),
  description: 'Reported giant marine skeleton on the seabed southwest of Bobcat Key.', descriptionTr: 'Bobcat Key’in güneybatısında, deniz tabanında bildirilen dev deniz canlısı iskeleti.',
  source: 'approximate', sourceUrl: source, reviewedAt: '2026-11-27', tags: ['Leviathan', 'Sea monster', 'Deniz canavarı', 'İskelet', 'Bobcat Key'],
  guide: { directions: [{en:'Travel offshore southwest of Bobcat Key and search the seabed around the marked position.',tr:'Bobcat Key’in güneybatısında açığa çık ve işaret çevresindeki deniz tabanını araştır.'}], requirements:[{en:'Bring scuba equipment and a diving light.',tr:'Dalış ekipmanı ve su altı ışığı getir.'}], warnings:[{en:'A player-reported discovery; no guaranteed reward is documented.',tr:'Oyuncuların bildirdiği bir keşif; garantili ödül belgelenmiş değil.'}], sources:[{title:'Gator Keys · location clip',url:'https://www.tiktok.com/@gatorkeys/video/7712138133290224929'},{title:'Community discovery record',url:source}] },
}
const buildings: GameMarker[] = [
  { id: 'gta6-gtadb-L501', title: 'Lombank · Tequesta office', category: 'community-landmark', ...communityToMap(-1111.7845543889507, -1461.7322457268035), description: 'Lombank office building in the GTADB landmark catalog. This does not establish a bank robbery or vault.', descriptionTr: 'GTADB mekân kataloğundaki Lombank ofis binası. Banka soygunu veya kasa noktası olduğu doğrulanmış değil.', source: 'approximate', sourceUrl: 'https://github.com/rolux/gtadb.org/blob/main/map/data/6/landmarks.json', reviewedAt: '2026-11-27', tags: ['Lombank', 'Tequesta', 'office', 'ofis'] },
  { id: 'gta6-gtadb-L1555', title: 'Hobbs Milford · SW 4th Street', category: 'community-landmark', ...communityToMap(1462.967,1764.383), description: 'Named retail location in the GTADB catalog. Other maps classify it as a bank; robbery availability is not confirmed.', descriptionTr: 'GTADB kataloğunda adı geçen ticari mekân. Bazı haritalar banka olarak sınıflandırıyor; soyulabilirliği doğrulanmış değil.', source: 'approximate', sourceUrl: 'https://github.com/rolux/gtadb.org/blob/main/map/data/6/landmarks.json', reviewedAt: '2026-11-27', tags: ['Hobbs Milford','Washington Beach','SW 4th Street'] },
]
export function addReviewedDiscoveries(markers: GameMarker[]) {
  const byId = new Map(markers.map(marker => [marker.id, REVIEWED_GUIDES[marker.id] ? { ...marker, guide: REVIEWED_GUIDES[marker.id], description: REVIEWED_GUIDES[marker.id].summary?.en ?? marker.description, descriptionTr: REVIEWED_GUIDES[marker.id].summary?.tr ?? marker.descriptionTr } : marker]))
  // A source's "Aquatic Bones" pin may already describe this discovery. Reuse its ID when colocated.
  const existing = [...byId.values()].find(marker => /aquatic bones|leviathan/i.test(marker.title) && Math.hypot(marker.x-leviathan.x,marker.y-leviathan.y)<0.0025)
  if(existing) byId.set(existing.id,{...leviathan,id:existing.id})
  else byId.set(leviathan.id,leviathan)
  for (const marker of buildings) byId.set(marker.id, marker)
  return [...byId.values()]
}
