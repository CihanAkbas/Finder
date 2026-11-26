import type { GameMarker } from '@/types/game'
import { communityToMap } from '@/lib/communityProjection'

/** Reviewed against GTABase's vehicle pages on 26 Nov 2026. Positions remain community estimates. */
export const GTA6_VEHICLE_CORRECTIONS: GameMarker[] = [
  {
    // Keep the existing generic RSX ID so found/favorite/route saves still point to this car.
    id: 'gta6-community-vehicle-spawn-029',
    title: 'Grotti Status RSX',
    category: 'mg-29095',
    ...communityToMap(-5533, 2239), // GTABase standout-vehicle-290
    description: 'Gellhorn International Raceway · Stock Car\nLook for the recovery truck near the raceway. The Status is the race-livery Itali RSX variant. Advanced security requires a Key Cloner. This replaces the generic Grotti RSX pin at the same site.',
    descriptionTr: 'Gellhorn International Raceway · Yarış otomobili\nYarış pisti yakınındaki çekiciyi ara. Status, yarış kaplamalı özel Itali RSX varyantıdır. Gelişmiş güvenliği açmak için Key Cloner gerekir. Aynı yerdeki genel Grotti RSX kaydı bu araçla güncellendi.',
    tags: ['Standout Vehicle', 'Gellhorn International Raceway', 'Grotti RSX', 'Itali RSX', 'Stock Car', 'Nadir araç', 'Özel araç', 'Key Cloner'],
    source: 'approximate',
    sourceUrl: 'https://www.gtabase.com/gta-6/vehicles/status-rsx',
    reviewedAt: '2026-11-26',
  },
  {
    id: 'gta6-community-standout-vehicle-156',
    title: 'Bravado DriveShaft Gauntlet',
    category: 'mg-29095',
    ...communityToMap(-5385.9, 6977), // GTABase standout-vehicle-156
    description: 'Grayson · DriveShaft Famous\nSearch behind Sid Thompson’s house near San Malo Bay. The vehicle is a rusted 1969 Gauntlet Custom, rather than the restored black car used in social-media illustrations. Guides disagree about access security; inspect the vehicle before taking it.',
    descriptionTr: 'Grayson · DriveShaft Famous\nSan Malo Bay yakınında Sid Thompson’ın evinin arkasına bak. Araç, sosyal medya görsellerindeki restore edilmiş siyah otomobil yerine paslı bir 1969 Gauntlet Custom olarak bulunur. Kaynaklar kilit ve güvenlik konusunda uyuşmuyor; almadan önce aracı incele.',
    tags: ['Standout Vehicle', 'Grayson', "Dom's Charger", 'Dom Toretto', 'Fast & Furious', 'Driveshaft', 'Nadir araç', 'Özel araç'],
    source: 'approximate',
    sourceUrl: 'https://www.gtabase.com/gta-6/vehicles/driveshaft-gauntlet',
    reviewedAt: '2026-11-26',
  },
  {
    id: 'gta6-community-standout-vehicle-149',
    title: 'Declasse Battler Picador',
    category: 'mg-29095',
    ...communityToMap(-5109, 478), // Member report 149: South Kelly; conflicting static record 170 is not plotted.
    description: 'South Kelly County · Stock Car\nCheck the barn with green doors for the race-modified 1972 Picador. Location conflict: the source catalog also contains a distant Ambrosia point for this name. This pin follows the South Kelly report matching the vehicle page; the alternative has not been independently verified. The pickup in the shared collage is only a possible visual match.',
    descriptionTr: 'South Kelly County · Yarış otomobili\nYarış için değiştirilmiş 1972 Picador’u yeşil kapılı ahırda ara. Konum çelişkisi: kaynak katalog aynı ad için Ambrosia’da uzak bir ikinci nokta da içeriyor. Bu işaret, araç sayfasıyla uyuşan South Kelly kaydını izliyor; diğer nokta bağımsız olarak doğrulanmadı. Paylaşımdaki pickup görseliyle eşleşmesi kesin değil.',
    tags: ['Standout Vehicle', 'South Kelly County', 'Picador', 'Stock Car', 'Pickup', 'Nadir araç', 'Özel araç', 'Konum çelişkisi'],
    source: 'approximate',
    sourceUrl: 'https://www.gtabase.com/gta-6/vehicles/battler-picador',
    reviewedAt: '2026-11-26',
  },
]

/** Apply curated corrections after source imports; preserve stable IDs and avoid duplicate pins. */
export function applyVehicleCorrections(markers: GameMarker[]): GameMarker[] {
  const corrections = new Map(GTA6_VEHICLE_CORRECTIONS.map((marker) => [marker.id, marker]))
  const result = markers.map((marker) => {
    const correction = corrections.get(marker.id)
    corrections.delete(marker.id)
    return correction ?? marker
  })
  return [...result, ...corrections.values()]
}
