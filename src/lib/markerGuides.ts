import type { GameMarker } from '@/types/game'
import { extractLocationHints, type LocationHints } from './locationHints'
import storedHints from '@/config/games/gta6/locationHints.json'
import { GTA6_SAFEHOUSE_GUIDES } from '@/config/games/gta6/safehouseGuides'

const hintIndex = storedHints as Record<string, LocationHints>
const MAP_SOURCE = 'https://mapgenie.io/grand-theft-auto-6/maps/leonida'
const KEY_SOURCE = 'https://www.gtabase.com/gta-6/articles/how-to-get-key-cloner-in-gta-6-to-steal-keyless-cars'
const CUTTER_SOURCE = 'https://www.pcgamer.com/games/grand-theft-auto/gta-6-kit-car-locations/'
const FLAMINGO_SOURCE = 'https://www.powerpyx.com/gta-6-all-cocaine-flamingo-locations/'
const VEHICLE_SOURCE = 'https://www.gtabase.com/gta-6/map/?feature=standout-vehicle'
const categoryAdvice: Record<string, [string, string]> = {
  'community-cocaine-flamingo': ['A breakable flamingo collectible. Confirm the collectible counter after destroying it.', 'Kırılabilir flamingo koleksiyonu. Kırdıktan sonra koleksiyon sayacını kontrol et.'],
  'community-unique-weapon': ['A named weapon variant. Match the full weapon name; a normal weapon of the same type is a different item.', 'Özel adlı silah varyantı. Silahın tam adını karşılaştır; aynı türdeki normal silah farklı bir eşyadır.'],
  'community-weapon-spawn': ['A reported weapon pickup. Check the interaction prompt and the weapon name at the location.', 'Bildirilen silah buluntusu. Konumda etkileşim komutunu ve silahın adını kontrol et.'],
  'community-luxury-watch': ['A watch collectible or valuable. Check the exact watch name and pickup prompt.', 'Koleksiyon veya değerli eşya olarak bir saat. Saatin tam adını ve alma komutunu kontrol et.'],
  'community-scoop-container': ['A reported SCOOP container. Inspect the door; a required tool is listed only when stated by the location source.', 'Bildirilen SCOOP konteyneri. Kapıyı incele; gereken alet yalnızca konum kaynağında açıkça yazıyorsa listelenir.'],
  'community-treasure': ['A reported treasure site. The marker may identify a search area rather than an exact item or depth.', 'Bildirilen hazine noktası. İşaret, eşyanın tam konumu veya derinliği yerine arama alanını gösterebilir.'],
  'community-safehouse': ['A story-related safehouse. A building marker does not mean you have unlocked the home yet.', 'Hikâyeyle bağlantılı güvenli ev. Binanın işaretli olması, evin sende açıldığı anlamına gelmez.'],
  'community-random-event': ['An encounter reported by the community. Treat this as a possible event area, not a guaranteed active mission.', 'Topluluk tarafından bildirilen karşılaşma. Burası olası olay alanıdır; kesin aktif görev değildir.'],
  'community-vehicle-spawn': ['A possible vehicle spawn area. Match the model and inspect it before taking it.', 'Olası araç çıkış alanı. Modeli karşılaştır ve almadan önce aracı incele.'],
  'community-easter-egg': ['A reported secret or reference. Following the source may reveal story or puzzle spoilers.', 'Bildirilen sır veya gönderme. Kaynağı açmak hikâye ya da bulmaca çözümünü gösterebilir.'],
  'community-hospital': ['A hospital building location; public interior access is not established by this pin.', 'Hastane binasının konumu; bu işaret binanın içine serbestçe girilebildiğini doğrulamaz.'],
  'community-police-station': ['A police-station location; this does not identify a safe entrance or permission to enter.', 'Polis merkezi konumu; güvenli bir giriş veya içeri girme izni anlamına gelmez.'],
}
const placementCopy: Record<keyof typeof import('./locationHints').PLACEMENT_PATTERNS, [string, string]> = {
  garage: ['The source places this inside a garage. Find the garage entrance rather than stopping at the street pin.', 'Kaynak, nesneyi garajın içinde gösteriyor. Sokaktaki işaret yerine garaj girişini ara.'],
  roof: ['The source places this on a roof; the ground-level pin is not the pickup height.', 'Kaynak, nesneyi çatıda gösteriyor; yerdeki işaret eşyanın yüksekliğini göstermiyor.'],
  underwater: ['The source places this underwater. The pin marks the horizontal position, not the depth.', 'Kaynak, nesneyi su altında gösteriyor. İşaret yatay konumu gösterir; derinliği göstermez.'],
  container: ['The source places this inside a container. Locate its door and inspect the opening prompt.', 'Kaynak, nesneyi konteynerin içinde gösteriyor. Kapıyı bul ve açma komutunu kontrol et.'],
  bedroom: ['Look inside the bedroom mentioned by the source, not outside the building.', 'Kaynağın belirttiği yatak odasına bak; nesne binanın dışında değil.'],
  basement: ['The source specifies a basement. Find the entrance leading below ground.', 'Kaynak bodrum katını belirtiyor. Yer altına inen girişi ara.'],
  warehouse: ['The source places this inside a warehouse; check the building entrance.', 'Kaynak, nesneyi deponun içinde gösteriyor; bina girişini kontrol et.'],
  barn: ['The source places this in a barn. Look for its doors around the marked property.', 'Kaynak, nesneyi ahırda gösteriyor. İşaretli arazide ahırın kapılarını ara.'],
  behind: ['The source specifies the rear of the building; walk around it.', 'Kaynak binanın arkasını belirtiyor; binanın çevresini dolaş.'],
  dock: ['The source refers to a dock or pier. Check its surface and the waterline around it.', 'Kaynak iskele veya rıhtımı belirtiyor. Üstünü ve çevresindeki su hizasını kontrol et.'],
  beach: ['The source specifies a beach or shore. Check the marked shoreline.', 'Kaynak plaj veya kıyıyı belirtiyor. İşaretli kıyı şeridini kontrol et.'],
  trunk: ['The source puts this in a vehicle trunk. Inspect the trunk interaction.', 'Kaynak, nesneyi araç bagajında gösteriyor. Bagaj etkileşimini kontrol et.'],
  bathroom: ['The source specifies a bathroom or bathtub inside the building.', 'Kaynak binanın içindeki banyo veya küveti belirtiyor.'],
  upstairs: ['The source specifies an upper floor. A street-level pin does not identify its height.', 'Kaynak üst katı belirtiyor. Sokak seviyesindeki işaret, nesnenin yüksekliğini göstermiyor.'],
}

function field(text: string, name: string) {
  const value = new RegExp(`^${name}:\\s*(.+)$`, 'mi').exec(text)?.[1].trim()
  return value && !/[?]|^(?:N\/A|unknown|not mentioned)$/i.test(value) ? value : undefined
}

export function markerGuide(marker: GameMarker, locale: 'en' | 'tr') {
  const tr = locale === 'tr'
  const copy = (en: string, turkish: string) => tr ? turkish : en
  const custom = marker.guide ?? GTA6_SAFEHOUSE_GUIDES[marker.id]
  const localize = (items?: { en: string; tr: string }[]) => items?.map((item) => item[locale]) ?? []
  const hints = hintIndex[marker.id] ?? extractLocationHints(marker.description, marker.sourceUrl ?? MAP_SOURCE)
  const vehicle = ['mg-29095', 'mg-29096', 'mg-29097', 'mg-29186', 'community-vehicle-spawn'].includes(marker.category)
  const collectible = marker.category.startsWith('community-') && /flamingo|street-art|package|comics|watch|magazine|bottle|meteorite|treasure|loot-box|container/.test(marker.category)
  const summary = custom?.summary?.[locale] ?? categoryAdvice[marker.category]?.[tr ? 1 : 0] ?? (vehicle
    ? copy('A vehicle location. Match the full variant name before taking or modifying it.', 'Araç konumu. Almadan veya değiştirmeden önce tam varyant adını karşılaştır.')
    : collectible ? copy('A collectible or loot location. Reaching the pin alone does not mean the item has been collected.', 'Koleksiyon veya ganimet noktası. İşarete ulaşmak, eşyayı topladığın anlamına gelmez.')
    : copy('A location from the map catalog. Check the location notes and any reported access conditions.', 'Harita kataloğundaki bir konum. Konum notunu ve bildirilen erişim koşullarını kontrol et.'))
  const directions = localize(custom?.directions)
  if (!directions.length && hints?.places?.length) directions.push(copy(`Places named in this location note: ${hints.places.join(', ')}.`, `Konum notunda adı geçen yerler: ${hints.places.join(', ')}.`))
  if (!custom?.directions?.length) for (const placement of hints?.placements ?? []) directions.push(placementCopy[placement][tr ? 1 : 0])
  const requirements = localize(custom?.requirements)
  const warnings = localize(custom?.warnings)
  const facts: { label: string; value: string }[] = []
  const access = field(marker.description, 'Access')
  const security = field(marker.description, 'Security')
  const tracker = field(marker.description, 'Tracker')
  const translations: Record<string, string> = { Unlocked: 'Araç kapısı açık', Locked: 'Araç kapısı kilitli', None: 'Yok', Alarmed: 'Alarmlı', Standard: 'Standart', Advanced: 'Gelişmiş', Tracker: 'Takip cihazı var', Deactivated: 'Devre dışı', 'Key Cloner': 'Key Cloner gerekli' }
  for (const [name, value] of [[copy('Vehicle door', 'Araç kapısı'), access], [copy('Alarm / security', 'Alarm / güvenlik'), security], [copy('Tracker', 'Takip cihazı'), tracker]] as const) {
    if (value) facts.push({ label: name, value: tr ? translations[value] ?? value : value })
  }
  const tools = new Set(hints?.tools ?? [])
  if (access && /^(?:Key Cloner|Keyless \(Key Cloner\))$/i.test(access)) tools.add('key-cloner')
  const sources = [...(custom?.sources ?? [])]
  if (custom && marker.sourceUrl) sources.push({ title: 'GTABase · location guide', url: marker.sourceUrl })
  if (hints) sources.push({ title: marker.sourceUrl ? 'GTABase · location record' : 'MapGenie · location record', url: hints.sourceUrl })
  if (tools.has('key-cloner')) {
    requirements.push(copy('Key Cloner required. It unlocks during Chapter 3: Clonin’ Keys, Makin’ Gs.', 'Key Cloner gerekli. 3. bölümde Clonin’ Keys, Makin’ Gs görevi sırasında açılır.'))
    sources.push({ title: 'GTABase · Key Cloner', url: KEY_SOURCE })
  }
  if (tools.has('cutter')) {
    requirements.push(copy('Cut-Off Tool required. Obtain it through Meet the Heders in Chapter 3.', 'Cut-Off Tool gerekli. 3. bölümde Meet the Heders göreviyle edinilir.'))
    sources.push({ title: 'PC Gamer · Cut-Off Tool', url: CUTTER_SOURCE })
  }
  if (hints?.chapter) requirements.push(copy(`The source reports an unlock in Chapter ${hints.chapter}.`, `Kaynak, ${hints.chapter}. bölümde açıldığını bildiriyor.`))
  if (vehicle) {
    warnings.push(copy('Before leaving it, check registration and garage space. Respawn is not guaranteed. Removing unique parts may lose them.', 'Bırakmadan önce kayıt durumunu ve garaj yerini kontrol et. Yeniden çıkacağı garanti değil. Özel parçaları sökmek onları kaybettirebilir.'))
    sources.push({ title: 'GTABase · keeping standout vehicles', url: VEHICLE_SOURCE })
  }
  if (marker.category === 'community-random-event' || marker.category === 'community-vehicle-spawn') warnings.push(copy('This is a reported encounter/spawn area. Arrival does not guarantee an event or vehicle.', 'Bildirilen karşılaşma/araç çıkış alanıdır. Oraya gitmek, olayın veya aracın çıkacağını garanti etmez.'))
  if (marker.category === 'community-cocaine-flamingo') {
    directions.push(copy('Break the collectible flamingo, then check the in-game collection counter before marking it found.', 'Koleksiyon flamingosunu kır; bulundu işaretlemeden önce oyun içi koleksiyon sayacını kontrol et.'))
    sources.push({ title: 'PowerPyx · Cocaine Flamingos', url: FLAMINGO_SOURCE })
  }
  const specific = Boolean(custom?.directions?.length || hints?.placements.length || marker.descriptionTr || /^Location:\s*\S/m.test(marker.description))
  return {
    summary, directions: [...new Set(directions)], requirements: [...new Set(requirements)], warnings: [...new Set(warnings)], facts,
    locationSpecific: specific,
    missingDirections: !specific,
    unknownAccess: !requirements.length && !access,
    sources: sources.filter((source, index) => sources.findIndex((item) => item.url === source.url) === index),
  }
}
