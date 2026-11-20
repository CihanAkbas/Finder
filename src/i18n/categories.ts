import type { Locale } from '@/i18n/locale'
import { gta6CategoryCopy } from '@/i18n/gta6Map'
import type { CategoryNode } from '@/types/game'

const tr: Record<string, { name?: string; description?: string }> = {
  collectibles: { name: 'Koleksiyonlar', description: 'Hikaye ve Online toplamalar. Bu atlastaki her set, oyundaki tam sayıdır.' },
  'spaceship-parts': { name: 'Uzay gemisi parçaları', description: 'Omega’nın 50 parçası. Far Out’tan sonra herhangi bir karakter toplayabilir.' },
  'letter-scraps': { name: 'Mektup parçaları', description: 'Elli parça. %100 için hepsi gerekir.' },
  'peyote-plants': { name: 'Peyote bitkileri · 27', description: 'Hikaye modunun 27 bitkisi. 76’lık set GTA Online haritasındadır.' },
  'peyote-online': { name: 'Peyote bitkileri · 76', description: 'Genişletilmiş 76’lık Online set. Bitkiler mevsimliktir, çoğu Cadılar Bayramı civarındadır ve her biri RP verir.' },
  'nuclear-waste': { name: 'Nükleer atık', description: 'Otuz varil. Atık kıyafeti gömülü olanları pratikleştirir.' },
  'playing-cards': { name: 'İskambil kâğıtları', description: 'GTA Online’daki 54 kâğıdın tümü. Set, kumarhane fişi ve High Roller kıyafetini verir.' },
  'action-figures': { name: 'Aksiyon figürleri', description: 'GTA Online’daki 100 figürün tümü. Set, nakit ve Impotent Rage kıyafetini verir.' },
  'signal-jammers': { name: 'Sinyal bozucular', description: '50 bozucunun tümü. Onları yok et. Set nakit verir ve Avi Schwartzman’ı açar.' },
  'ld-organics': { name: 'LD Organics', description: '100 LD Organics zulasının tümü. Set nakit ve LD Organics kıyafetlerini verir.' },
  'movie-props': { name: 'Film aksesuarları', description: 'Solomon Richards için 10 aksesuarın tümü. Tabut, kaplan postu ve küre etkinlik araçlarında belirir; bu iğneler bilinen duraklardır.' },
  'ls-tags': { name: 'LS tagları', description: '60 grafiti tagının tümü.' },
  'media-sticks': { name: 'Medya çubukları', description: 'Konumu yayımlanmış medya çubukları. Onları Media Player’da çal.' },
  shipwrecks: { name: 'Gemi enkazları', description: 'Bilinen her kıyı enkazı. Her gün bir enkaz aktiftir.' },
  'hidden-caches': { name: 'Gizli zula', description: 'Los Santos çevresindeki su altı zulaları. Cayo sandıkları Cayo Perico haritasındadır.' },
  'smoke-on-the-water': { description: '30 Smoke on the Water ürün toplamasının tümü.' },
  events: { name: 'Dönen etkinlikler', description: 'Mevsim avları ile günlük Exotic Exports ve stash house panoları. Rota kurulabilsin diye işaretler sezon dışında da görünür kalır.' },
  snowmen: { name: 'Kardan adamlar', description: 'Kış kardan adamları. Günlük pano, seti 15 Aralık’tan 5 Ocak’a kadar sezonda işaretler.' },
  'jack-o-lanterns': { name: 'Balkabakları', description: 'Cadılar Bayramı balkabakları. Sezon ekim boyunca ve kasımın ilk iki günüdür.' },
  'lucky-clovers': { name: 'Dört yapraklı yoncalar', description: 'Mart yonca avı. Altın yoncalar ayrı katmandadır.' },
  'golden-clovers': { name: 'Altın yoncalar', description: 'Aynı mart avındaki altın yoncalar.' },
  yuanbao: { description: 'Ay Yeni Yılı yuanbao’su. Aktif pencere yeni yılla birlikte kayar.' },
  'ghosts-exposed': { description: 'Ekim sonundaki fotoğraf avı.' },
  'exotic-exports': { description: 'Olası spawn noktaları. Günlük pano, UTC günü için bu listeden bir araba seçer.' },
  'stash-houses': { name: 'Stash house’lar', description: 'Olası günlük stash house’lar. UTC günü için bir nokta seçilir. Bu bir takvimdir, canlı akış değildir.' },
  activities: { name: 'Zaman denemeleri', description: 'Online deneme setlerinin yayımlanmış başlangıçları. Oyunda her dönen setten bir parkur canlıdır; bu katman her başlangıcı tutar.' },
  'rc-bandito': { description: '14 RC Bandito zaman denemesinin tüm başlangıçları. Her gün bir parkur aktiftir.' },
  'hsw-trials': { name: 'HSW zaman denemeleri', description: 'Hao’s Special Works’ün 8 parkuru. Her etkinlik haftasında biri öne çıkar.' },
  'junk-energy-trials': { name: 'Junk Energy denemeleri', description: '14 Junk Energy zaman denemesinin tüm başlangıçları. Her gün bir parkur aktiftir.' },
  'junk-energy-skydives': { name: 'Junk Energy paraşütleri', description: '25 Junk Energy paraşüt başlangıcının tümü. Her gün on atlayış sunulur.' },
  operations: { name: 'Operasyonlar', description: 'Sabit sözleşme ve araç konumları. Günlük hedef yine de bu iğneler arasında yer değiştirir.' },
  kosatka: { description: '60 açık deniz park yerinin tümü. Bir istek, denizaltıyı yakındaki birine çıkarır.' },
  'payphone-hits': { name: 'Payphone Hit’ler', description: 'Payphone Hit çalabilecek 32 ankesörlü telefonun tümü.' },
  'madrazo-hits': { name: 'Madrazo Hit’ler', description: 'Günlük Madrazo Hit hedefi için 15 olası bölgenin tümü.' },
  challenges: { name: 'Meydan okumalar' },
  'stunt-jumps': { name: 'Stunt atlayışları', description: 'Rampadan fırla ve bölgeye in. %100 için herhangi 25’i sayılır.' },
  'under-bridge': { name: 'Köprünün altı', description: 'Açıklığın altından uç. 50’nin herhangi 25’i %100’e sayılır.' },
  'knife-flights': { name: 'Bıçak uçuşları', description: 'Kapıdan uç. 15’in herhangi 8’i %100’e sayılır.' },
  locations: { name: 'Konumlar' },
  landmarks: { name: 'Simge yerler', description: 'Güvenli evler, kuleler ve insanların yönünü bulduğu yerler.' },
  services: { name: 'Hizmetler' },
  'ammu-nation': { description: '11 silah dükkânının tümü. Pillbox Hill ve Cypress Flats’te atış poligonu vardır.' },
  'los-santos-customs': { description: 'Burton, LSIA, La Mesa ve Grand Senora dükkânı.' },
  convenience: { name: '24/7 ve LTD', description: 'Dokuz 24/7 market ve beş LTD Gasoline istasyonu.' },
  clothing: { name: 'Giyim', description: 'Ponsonbys, Suburban ve Binco.' },
  'gun-van': { description: 'Yayımlanmış otuz park yeri. Bugünün yeri, yılın gününün 30’a bölümüdür; her yer sırasını alır. İndirim listeleri topluluk tahminidir.' },
  properties: { name: 'Mülkler', description: 'Bu işletmelerin satın alınabilir her girişi. Birini almak diğerlerini oynatmaz.' },
  offices: { name: 'CEO ofisleri', description: 'Maze Bank Tower, Maze Bank West, Arcadius ve Lombank West.' },
  clubhouses: { name: 'Kulüp evleri', description: '12 Motorsiklet Kulübü kulüp evinin tümü.' },
  nightclubs: { name: 'Gece kulüpleri', description: '10 gece kulübü girişinin tümü.' },
  arcades: { name: 'Atari salonları', description: 'Paleto Bay’den Davis’e 6 atari girişinin tümü.' },
  agencies: { name: 'Agency’ler', description: 'Rockford Hills, Hawick, Vespucci Canals ve Little Seoul.' },
  'auto-shops': { name: 'Oto tamirhaneleri', description: 'Mission Row, Strawberry, Rancho, Burton ve La Mesa.' },
  'salvage-yards': { name: 'Hurda sahaları', description: 'Paleto Bay, Sandy Shores, Murrieta Heights, Strawberry ve La Puerta.' },
  'bail-offices': { name: 'Kefalet ofisleri', description: 'Paleto Bay, Davis, Del Perro, Mission Row ve Downtown Vinewood.' },
  bunkers: { name: 'Sığınaklar', description: '11 sığınak girişinin tümü.' },
  facilities: { name: 'Tesisler', description: '9 Doomsday tesis girişinin tümü.' },
  hangars: { name: 'Hangarlar', description: 'Fort Zancudo’da üç, LSIA’da iki ve McKenzie Field.' },
  'cargo-warehouses': { name: 'Kargo depoları', description: 'Küçükten büyüğe her CEO özel kargo deposu.' },
  'vehicle-warehouses': { name: 'Araç depoları', description: 'Import/Export araç depoları.' },
  'cocaine-lockups': { name: 'Kokain kilitleri', description: '4 MC kokain kilidinin tümü.' },
  'meth-labs': { name: 'Meth laboratuvarları', description: '4 MC meth laboratuvarının tümü.' },
  'counterfeit-cash': { name: 'Sahte nakit', description: '4 MC sahte nakit atölyesinin tümü.' },
  'weed-farms': { name: 'Esrar çiftlikleri', description: '4 MC esrar çiftliğinin tümü.' },
  'document-forgery': { name: 'Evrak sahteciliği', description: '4 MC evrak sahteciliği ofisinin tümü.' },
  'garment-factory': { name: 'Konfeksiyon fabrikası', description: 'Konfeksiyon fabrikasından metro çıkışları. Fabrika tek bir iç mekândır.' },
  apartments: { name: 'Daireler', description: 'Yayımlanmış Dynasty 8 daireleri ve yamaç evleri, yüksek katlı kuleler dahil.' },
  garages: { name: 'Bağımsız garajlar', description: 'Yayımlanmış bağımsız garajlar. Yuva sayısı kademeye bağlıdır.' },
  mansions: { name: 'Malikâneler', description: 'Richman Villa, Tongva Estate ve Vinewood Residence. Malikâne güncellemesinden yayımlanmış girişler.' },
  'office-garages': { name: 'Ofis garajları', description: 'Maze Bank Tower, Maze Bank West, Arcadius ve Lombank West garaj katları. Ofis girişini kullanırlar.' },
  casino: { name: 'Kumarhane', description: 'Kumarhane lobisi ve aynı girişten alınan Master Penthouse.' },
  'arena-workshop': { name: 'Arena atölyesi', description: 'Maze Bank Arena girişi. Arena atölyesi içeridedir.' },
  'car-meet': { name: 'LS Car Meet', description: 'Popular Street’teki Cypress Flats araç buluşması.' },
  freakshop: { description: 'Mirror Park ray sahası deposu. First Dose görevleri ve Acid Lab buradan yürür.' },
  'money-fronts': { name: 'Para vitrinleri', description: 'Hands On Car Wash, Smoke on the Water vitrini ve Higgins Helitours.' },
  'yacht-moorings': { name: 'Süper yat', description: 'Yayımlanmış 36 Galaxy Super Yacht demir yeri, üçerli 12 bölge.' },
  'mobile-bases': { name: 'Mobil üsler', description: 'Acid Lab, MOC, Avenger ve Terrorbyte servis binaları. Son üçü, sahip olduğun mülkten çağrılır.' },
  secrets: { name: 'Sürprizler' },
  'easter-eggs': { name: 'Sürprizler', description: 'Chiliad, kamp ve diğer tuhaflıklar.' },
  cayo: { description: 'Ada ganimeti, keşif noktaları ve hazırlık ekipmanı. Bu iğneler Los Santos atlasının güneyinde olduğu için Cayo haritasını kullanır.' },
  'cayo-chests': { name: 'Hazine sandıkları', description: 'Cayo Perico’daki hazine sandıkları.' },
  'cayo-stashes': { name: 'Gömülü zulalar', description: 'Adadaki gömülü zulalar.' },
  'cayo-loot': { name: 'İkincil ganimet', description: 'İkincil ganimet noktaları. İçindekiler her keşifte değişir.' },
  'cayo-infiltration': { name: 'Sızma', description: 'Drenaj tüneli, North Dock ve Main Dock kuleleri, pist kontrol kulesi, elektrik santrali ve kompleks girişleri.' },
  'cayo-cutters': { name: 'Levye makasları', description: '16 civata kesici spawnının tümü.' },
  'cayo-grapples': { name: 'Tırmanma ekipmanı', description: '16 tırmanma ekipmanı spawnının tümü.' },
  'cayo-uniforms': { name: 'Güvenlik üniformaları', description: '16 güvenlik üniforması spawnının tümü.' },
  districts: { name: 'Bölge yerleşimi', description: 'Ana kara, sulak alan ve adalar, önizleme ızgarasına yerleştirildi.' },
  'vice-city': { name: 'Vice City simgeleri' },
  leaks: { name: 'Adı geçen yerler', description: 'Fragmanlarda ve açık rehberde adı geçen yerler. Hiçbirinin ölçülmüş koordinatı yok.' },
  'leak-notes': { name: 'Adı geçen yerler', description: 'Fragmanlarda ve açık rehberde adı geçen yerler. Hiçbirinin ölçülmüş koordinatı yok.' },
}

function apply(node: CategoryNode, locale: Locale): CategoryNode {
  const copy = locale === 'tr' ? tr[node.id] ?? gta6CategoryCopy(locale, node.id) : undefined
  const pins = node.description?.match(/^(\d+) pins\.$/)
  const vice = node.id === 'landmarks' && node.name !== 'Landmarks'
  const leonida = node.description?.includes('Leonida region layout')
  const name = vice ? 'Vice City simgeleri' : copy?.name ?? node.name
  const description = pins && locale === 'tr'
    ? `${pins[1]} işaret.`
    : vice
    ? 'Resmi fragmanlardan ve Rockstar materyalinden adlar. Bir ölçüm olana kadar iğneler önizleme ızgarasında kalır.'
    : leonida
      ? 'Leonida bölge yerleşimi. Buradaki her iğne, bir ölçüm olana kadar şematiktir.'
      : copy?.description ?? node.description
  return {
    ...node,
    name,
    description,
    children: node.children?.map((child) => apply(child, locale)),
  }
}

export function localizeCategories(nodes: CategoryNode[], locale: Locale) {
  if (locale === 'en') return nodes
  return nodes.map((node) => apply(node, locale))
}

export function localizeCategory(node: CategoryNode | undefined, locale: Locale) {
  if (!node || locale === 'en') return node
  return apply(node, locale)
}
