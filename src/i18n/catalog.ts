import type { Locale } from '@/i18n/locale'
import type { Hunt } from '@/lib/seasons'

function pick(locale: Locale, text: string, map: Record<string, string>) {
  if (locale !== 'tr') return text
  return map[text] ?? text
}

const BONUSES: Record<string, string> = {
  '2x Nightclub goods': 'Gece kulübü malları 2x',
  '2x Security contracts': 'Security Contract 2x',
  '3x Cayo Perico': 'Cayo Perico 3x',
  '2x MC sell missions': 'MC satış görevleri 2x',
  '2x Agency pay': 'Agency ödemesi 2x',
  '2x Auto Shop contracts': 'Auto Shop sözleşmeleri 2x',
  '2x Hangar cargo': 'Hangar kargosu 2x',
  '2x Special cargo': 'Special Cargo 2x',
  '3x Salvage Yard robberies': 'Salvage Yard soygunları 3x',
  '2x Bail Office': 'Bail Office 2x',
  '2x Gun Van discounts': 'Gun Van indirimleri 2x',
  '2x Time trials': 'Zaman denemeleri 2x',
}

const SLOTS: Record<string, { label: string; note: string }> = {
  'Podium vehicle': {
    label: 'Podyum aracı',
    note: 'Bu takvim haftasının Casino Lucky Wheel öne çıkanı.',
  },
  'Prize ride': {
    label: 'Ödül aracı',
    note: 'Bu takvim haftasının LS Car Meet ödül aracı.',
  },
  'Luxury Autos': {
    label: 'Luxury Autos',
    note: 'Bu takvim haftasının Luxury Autos öne çıkanı.',
  },
  'Simeon export': {
    label: 'Simeon ihracı',
    note: 'Bu takvim haftasının Simeon talep aracı.',
  },
}

const DAILY_NOTES: Record<string, string> = {
  'Sunday after 06:00 UTC. Known parking spot, not today’s live Rockstar stock.': 'Pazar, 06:00 UTC’den sonra. Bilinen park yeri; bugünün canlı Rockstar stoğu değil.',
  'Monday after 06:00 UTC. Known parking spot.': 'Pazartesi, 06:00 UTC’den sonra. Bilinen park yeri.',
  'Tuesday after 06:00 UTC. Known parking spot.': 'Salı, 06:00 UTC’den sonra. Bilinen park yeri.',
  'Wednesday after 06:00 UTC. Known parking spot.': 'Çarşamba, 06:00 UTC’den sonra. Bilinen park yeri.',
  'Thursday after 06:00 UTC. Same spot as Sunday, different sample stock.': 'Perşembe, 06:00 UTC’den sonra. Pazarla aynı yer, farklı örnek stok.',
  'Friday after 06:00 UTC.': 'Cuma, 06:00 UTC’den sonra.',
  'Saturday after 06:00 UTC.': 'Cumartesi, 06:00 UTC’den sonra.',
  'Coke buyer.': 'Kokain alıcısı.',
  'Meth buyer.': 'Met alıcısı.',
  'Weed buyer.': 'Esrar alıcısı.',
  'Cash buyer.': 'Nakit alıcısı.',
  'Weed buyer on the south approach.': 'Güney yaklaşımında esrar alıcısı.',
  'Sunday stash house area.': 'Pazar stash house bölgesi.',
  'Monday stash house area.': 'Pazartesi stash house bölgesi.',
  'Tuesday stash house area.': 'Salı stash house bölgesi.',
  'Wednesday stash house area.': 'Çarşamba stash house bölgesi.',
  'Thursday stash house area.': 'Perşembe stash house bölgesi.',
  'Friday stash house area.': 'Cuma stash house bölgesi.',
  'Saturday stash house area.': 'Cumartesi stash house bölgesi.',
  'Sunday time trial. Beat the posted time.': 'Pazar zaman denemesi. Yazılı süreyi geç.',
  'Monday time trial.': 'Pazartesi zaman denemesi.',
  'Tuesday time trial.': 'Salı zaman denemesi.',
  'Wednesday time trial.': 'Çarşamba zaman denemesi.',
  'Friday time trial.': 'Cuma zaman denemesi.',
  'Saturday time trial.': 'Cumartesi zaman denemesi.',
  'Hao time trial.': 'Hao zaman denemesi.',
  'Hill climb from the observatory.': 'Gözlemevinden yokuş tırmanışı.',
  'Container sprint.': 'Konteyner sprinti.',
  'Short highway sprint.': 'Kısa otoyol sprinti.',
  'Thursday skydiving trial.': 'Perşembe paraşüt denemesi.',
  'City sprint.': 'Şehir sprinti.',
  'Desert highway.': 'Çöl otoyolu.',
  'Hill streets.': 'Tepe sokakları.',
}

export function dailyNote(locale: Locale, note: string) {
  return pick(locale, note, DAILY_NOTES)
}

const GUIDE_NOTES: Record<string, string> = {
  'Official trailer': 'Resmi fragman',
  'Standout vehicle': 'Standout araç',
  'Randy vehicle': 'Randy aracı',
  'Moses vehicle': 'Moses aracı',
  'Community identification from official footage. The public guide counts 277 vehicles and has not published this name.': 'Resmi görüntüden topluluk teşhisi. Açık rehber 277 araç sayıyor ve bu adı yayımlamıyor.',
  'Named in the public guide. Price and combat stats are not published.': 'Açık rehberde adı geçer. Fiyat ve çatışma değerleri yayımlanmadı.',
  'Confirmed on the public catalog. Combat stats and price are not published.': 'Açık katalogda adı doğrulandı. Çatışma değerleri ve fiyat yayımlanmadı.',
  'Confirmed catalog': 'Doğrulanmış katalog',
  "Donnie's H&L .38 Revolver is a Chapter 1 missable from Don Gone. Price and combat stats are not published.": 'Donnie’nin H&L .38 tabancası, Don Gone’dan kaçırılabilen bir 1. bölüm silahıdır. Fiyat ve çatışma değerleri yayımlanmadı.',
}

export function catalogNote(locale: Locale, note: string) {
  return pick(locale, note, GUIDE_NOTES)
}

const FACT_LABELS: [string, string][] = [
  ['Cost to register', 'Kayıt ücreti'],
  ['Sell value', 'Satış değeri'],
  ['Access', 'Erişim'],
  ['Security', 'Güvenlik'],
  ['Tracker', 'Takip'],
  ['Era', 'Dönem'],
  ['Storage', 'Depo'],
  ['Body', 'Gövde'],
  ['Specialist', 'Uzman'],
  ['Unlocked', 'Açık'],
  ['Deactivated', 'Kapalı'],
  ['Alarmed', 'Alarmlı'],
  ['Locked', 'Kilitli'],
  ['Key Cloner', 'Anahtar kopyalayıcı'],
  ['None', 'Yok'],
  ['Standard', 'Standart'],
  ['Advanced', 'Gelişmiş'],
  ['Top', 'En iyi'],
  ['Good', 'İyi'],
  ['Average', 'Orta'],
  ['Poor', 'Kötü'],
  ['Scrap', 'Hurda'],
]

export function vehicleFacts(locale: Locale, note: string) {
  const exact = catalogNote(locale, note)
  const generated = note.includes('Sell value:') || note.includes('Access:') || note.includes('Specialist:')
  if (locale !== 'tr' || exact !== note || !generated) return exact
  return FACT_LABELS.reduce((text, [from, to]) => text.replaceAll(from, to), note)
}

export function weeklyBonus(locale: Locale, text: string) {
  return pick(locale, text, BONUSES)
}

export function weeklySlot(locale: Locale, label: string, note: string) {
  if (locale !== 'tr') return { label, note }
  const row = SLOTS[label]
  return row ?? { label, note }
}

const HUNT_COPY: Record<string, { title: string; window: string }> = {
  snowmen: { title: 'Kardan adamlar', window: '15 Aralık – 5 Ocak' },
  'jack-o-lanterns': { title: 'Balkabakları', window: '1 Ekim – 2 Kasım' },
  ghosts: { title: 'Ghosts Exposed', window: '20 Ekim – 2 Kasım' },
  clovers: { title: 'Yoncalar', window: '1 Mart – 20 Mart · dört yapraklı ve altın' },
  yuanbao: { title: 'Yuanbao', window: 'Ay Yeni Yılı haftası' },
}

export function huntCopy(locale: Locale, hunt: Hunt) {
  if (locale !== 'tr') return { title: hunt.title, window: hunt.window }
  return HUNT_COPY[hunt.id] ?? { title: hunt.title, window: hunt.window }
}

const CHEAT_NAMES: Record<string, string> = {
  'Full health': 'Tam can',
  'Full armor': 'Tam zırh',
  'Raise wanted level': 'Aranma seviyesini yükselt',
  'Clear wanted level': 'Aranma seviyesini sil',
  'Weapon set': 'Silah seti',
  'Flaming bullets': 'Alevli mermiler',
  'Explosive ammo': 'Patlayan mühimmat',
  'Recharge special': 'Özel yeteneği doldur',
  'Slow motion': 'Ağır çekim',
  'Super jump': 'Süper zıplama',
  'Sky dive': 'Gökyüzü dalışı',
  'Breathe underwater': 'Su altında nefes',
  Drunk: 'Sarhoş',
  Comet: 'Comet',
  'Rapid GT': 'Rapid GT',
  Trashmaster: 'Trashmaster',
}

const CHEAT_EFFECTS: Record<string, string> = {
  'Fills health in story mode.': 'Hikaye modunda canı doldurur.',
  'Fills body armor in story mode.': 'Hikaye modunda zırhı doldurur.',
  'Adds a wanted star.': 'Bir aranma yıldızı ekler.',
  'Removes wanted stars.': 'Aranma yıldızlarını siler.',
  'Gives a set of weapons and ammo.': 'Bir silah ve cephane seti verir.',
  'Bullets set targets on fire.': 'Mermiler hedefleri tutuşturur.',
  'Bullets explode on impact.': 'Mermiler çarptığında patlar.',
  'Fills the special ability bar.': 'Özel yetenek çubuğunu doldurur.',
  'Slows the game for a short time.': 'Oyunu kısa süre yavaşlatır.',
  'Jump height is increased.': 'Zıplama yüksekliği artar.',
  'Drops the character high above the map.': 'Karakteri haritanın yukarısına bırakır.',
  'The character can stay underwater.': 'Karakter su altında kalabilir.',
  'The character is drunk for a short time.': 'Karakter kısa süre sarhoş olur.',
  'Spawns a Comet.': 'Bir Comet çıkarır.',
  'Spawns a Rapid GT.': 'Bir Rapid GT çıkarır.',
  'Spawns a Trashmaster.': 'Bir Trashmaster çıkarır.',
}

export function cheatName(locale: Locale, name: string) {
  return pick(locale, name, CHEAT_NAMES)
}

export function cheatEffect(locale: Locale, effect: string) {
  return pick(locale, effect, CHEAT_EFFECTS)
}

const CONSOLE_TR =
  'PlayStation ve Xbox’ta aynı etkiler, oyun içi telefona yazılan düğme dizileridir. PlayStation’da yenilmezlik: Sağ, X, Sağ, Sol, Sağ, R1, Sağ, Sol, X, Üçgen. Yukarıdaki PC kelimeleri güvenilir çapraz kontroldür.'

export function consoleNote(locale: Locale, note: string) {
  return locale === 'tr' ? CONSOLE_TR : note
}

const CONTROL_TITLES: Record<string, string> = {
  'On foot': 'Yaya',
  'Cars and bikes': 'Arabalar ve motosikletler',
  Planes: 'Uçaklar',
  Helicopters: 'Helikopterler',
}

const CONTROL_ROWS: Record<string, string> = {
  Move: 'Hareket',
  Sprint: 'Koş',
  Jump: 'Zıpla',
  Crouch: 'Çömel',
  'Enter or exit': 'Bin veya in',
  'Aim / fire': 'Nişan / ateş',
  Reload: 'Şarjör',
  'Change weapon': 'Silah değiştir',
  Accelerate: 'Hızlan',
  'Brake or reverse': 'Fren veya geri',
  Steer: 'Direksiyon',
  Handbrake: 'El freni',
  'Change camera': 'Kamera değiştir',
  Exit: 'İn',
  'Pitch and roll': 'Yunuslama ve yatış',
  'Mouse, in the default mouse-flight mode': 'Fare, varsayılan fare uçuş modunda',
  Speed: 'Hız',
  'W faster, S slower': 'W hızlandırır, S yavaşlatır',
  Rudder: 'Dümen',
  'Landing gear': 'İniş takımı',
  Pitch: 'Yunuslama',
  Roll: 'Yatış',
  Yaw: 'Sapma',
  'Mouse, or Q / E': 'Fare ya da Q / E',
  Climb: 'Tırman',
  Descend: 'Alçal',
  'Left Shift': 'Sol Shift',
  Space: 'Boşluk',
  'Left Ctrl': 'Sol Ctrl',
  'Right mouse / left mouse': 'Sağ fare / sol fare',
  'Mouse wheel or number keys': 'Fare tekeri veya sayı tuşları',
}

export function controlTitle(locale: Locale, title: string) {
  return pick(locale, title, CONTROL_TITLES)
}

export function controlText(locale: Locale, text: string) {
  return pick(locale, text, CONTROL_ROWS)
}

const SAFES: Record<string, { name: string; note: string }> = {
  nightclub: {
    name: 'Nightclub kasası',
    note: 'Tavan 250.000 $. Topluluk rakamı: popülerlik %95–100 iken 48 dakikada 50.000 $. %95’in altında bu sayaç, oyun içi basamakların yerine popülerlik puanı başına 500 $ kullanır.',
  },
  agency: {
    name: 'Agency kasası',
    note: 'Tavan 250.000 $. Topluluk rakamı: her 5 Security Contract için 500 $. 201 sözleşmeye ulaşınca oyun günü başına tavan 20.000 $ olur.',
  },
  arcade: {
    name: 'Arcade kasası',
    note: 'Tavan 100.000 $. Topluluk rakamı: her salon yuvasına bir makine konduktan sonra 48 dakikada 5.000 $.',
  },
  salvage: {
    name: 'Salvage Yard kasası',
    note: 'Topluluk rakamı: personel zirve itibardayken oyun günü başına 24.000 $, değilse 20.000 $. Tavan duvar kasasıyla 250.000 $, yoksa 100.000 $. Yüksek oran yaklaşık dört çekici işinde tutulur.',
  },
  garment: {
    name: 'Garment Factory kasası',
    note: 'Tavan 100.000 $. Topluluk rakamı: ödeme 48 dakikada 1.500–2.000 $ arasında döner. Bu sayaç 2.000 $ kullanır, dolu kasa hızlı durumdur.',
  },
}

export function safeCopy(locale: Locale, id: string, name: string, note: string) {
  if (locale !== 'tr') return { name, note }
  return SAFES[id] ?? { name, note }
}

const EMPIRE: Record<string, { name: string; note: string }> = {
  'low-apartment': {
    name: 'Alt seviye daire · 0120 Murrieta Heights',
    note: 'Aidat 25 $, bir de 10 $ tamirci.',
  },
  'high-apartment': {
    name: 'Üst seviye daire · 3 Alta Street',
    note: 'Aidat 75 $, bir de 10 $ tamirci. Diğer üst seviye daireler farklı fiyatlarda listelenir.',
  },
  yacht: {
    name: 'Galaxy Super Yacht · Pisces',
    note: 'En ucuz yat. Ücret her modelde aynıdır.',
  },
  penthouse: {
    name: 'Kumarhane çatı katı',
    note: 'Taban 300 $, bir de 10 $ tamirci. Ek odalar tanesi 25 $ ve buraya dahil değil.',
  },
  facility: {
    name: 'Facility · Paleto Bay',
    note: 'Taban 200 $, bir de 10 $ tamirci. Yörünge topu ve güvenlik odası ekstra.',
  },
  kosatka: { name: 'Kosatka', note: 'Sabit denizaltı ücreti.' },
  office: {
    name: 'CEO ofisi · Maze Bank West',
    note: 'Yalnızca ofis ücreti. Ek ofis garajları ayrı bir tamirci ücretidir.',
  },
  'small-warehouse': {
    name: 'Küçük special cargo deposu',
    note: 'En ucuz küçük depo liste fiyatı. İkinci depo burada çoğaltılmaz.',
  },
  'medium-warehouse': {
    name: 'Orta special cargo deposu',
    note: '42 kasalık liste. Yalnızca bir depo.',
  },
  'large-warehouse': {
    name: 'Büyük special cargo deposu',
    note: '111 kasalık liste. Yalnızca bir depo.',
  },
  'vehicle-warehouse': {
    name: 'Araç deposu · La Mesa',
    note: 'Deponun aidatı yok. 10 $ tamircidir.',
  },
  clubhouse: {
    name: 'Clubhouse · Great Chaparral',
    note: 'Clubhouse aidatı 0 $. 10 $ tamircidir.',
  },
  coke: {
    name: 'Kokain kilidi · Alamo Sea',
    note: 'Kayıtlıyken taban ücret. Ekipman, personel ve güvenlik ekstra.',
  },
  meth: {
    name: 'Met laboratuvarı · Grand Senora Desert',
    note: 'Kayıtlıyken taban ücret. Yükseltmeler ekstra.',
  },
  bunker: {
    name: 'Bunker · Paleto Forest',
    note: 'Kayıtlıyken taban ücret. Üç yükseltme de onu 4.500 $ yapar.',
  },
  hangar: {
    name: 'Hangar · LSIA A17',
    note: 'Hangar 250 $, bir de 10 $ tamirci. Uçak başına ücret dahil değil.',
  },
  nightclub: {
    name: 'Nightclub · Elysian Island',
    note: 'Taban ücret. Personel, teknisyenler, depo katları ve garaj seviyeleri ekstra.',
  },
  arcade: {
    name: "Arcade · Pixel Pete's",
    note: 'Arcade 250 $, bir de 10 $ tamirci.',
  },
  autoshop: {
    name: 'Auto shop · Mission Row',
    note: 'Auto shop 250 $, bir de 10 $ tamirci.',
  },
  salvage: {
    name: 'Salvage yard · Paleto Bay',
    note: 'Taban salvage yard ücreti.',
  },
  agency: {
    name: 'Agency, en ucuz liste',
    note: 'Agency 250 $, bir de 10 $ tamirci.',
  },
  acid: {
    name: 'Acid Lab ekipman yükseltmesi',
    note: 'The First Dose’tan sonraki laboratuvar yükseltmesi. Brickade bu satırda ikinci bir alışveriş değildir.',
  },
  bail: {
    name: 'Bail office · Paleto Bay',
    note: 'Burada kullanılan The Contract sonrası tabloda günlük ücret yayımlanmamıştı.',
  },
  garment: {
    name: 'Garment Factory · Darnell Bros',
    note: 'Burada kullanılan The Contract sonrası tabloda günlük ücret yayımlanmamıştı.',
  },
  carwash: {
    name: 'Hands On Car Wash',
    note: 'Burada kullanılan The Contract sonrası tabloda günlük ücret yayımlanmamıştı.',
  },
  helitours: {
    name: 'Higgins Helitours',
    note: 'Burada kullanılan The Contract sonrası tabloda günlük ücret yayımlanmamıştı.',
  },
  smoke: {
    name: 'Smoke on the Water',
    note: 'Burada kullanılan The Contract sonrası tabloda günlük ücret yayımlanmamıştı.',
  },
}

export function empireCopy(locale: Locale, id: string, name: string, note: string) {
  if (locale !== 'tr') return { name, note }
  return EMPIRE[id] ?? { name, note }
}

const BUSINESSES: Record<string, { name: string; note: string }> = {
  acid: {
    name: 'Acid Lab',
    note: 'Laboratuvar yükseltmesiyle. Tam ürün, lobi yüksek talep bonusundan önce.',
  },
  bunker: {
    name: 'Bunker',
    note: 'Personel ve ekipman yükseltmeleri. Bir tam malzeme çubuğu, tam satışa dönüşür.',
  },
  nightclub: {
    name: 'Nightclub deposu',
    note: 'Pratik bir orta depo; her mal dolu değil. Teknisyenler sayacı başlattıktan sonra da biriktirmeye devam eder.',
  },
  coke: {
    name: 'Kokain kilidi',
    note: 'Ekipman yükseltmesi, tam ürün, yüksek talepten önceki Los Santos satışı.',
  },
  meth: { name: 'Met laboratuvarı', note: 'Ekipman yükseltmesi, tam ürün.' },
  cash: { name: 'Sahte nakit', note: 'Ekipman yükseltmesi, tam ürün.' },
  weed: { name: 'Esrar çiftliği', note: 'Ekipman yükseltmesi, tam ürün.' },
  docs: {
    name: 'Evrak sahteciliği',
    note: 'Ekipman yükseltmesi, tam ürün, Los Santos satışı. En zayıf MC işletmesi.',
  },
}

export function businessCopy(locale: Locale, id: string, name: string, note: string) {
  if (locale !== 'tr') return { name, note }
  return BUSINESSES[id] ?? { name, note }
}

const STOCKS: Record<string, string> = {
  hotel:
    'Üç karakter de görevden önce LCN’de BET alır. Görevden sonra sat. Rakip hisseler düşer; bu adım yalnızca Betta kazancını sayar.',
  multi: 'Otel vuruşundan sonra düşmüşken DEB al. Çoklu hedef görevinden sonra sat.',
  vice: 'Görevden önce BAWSAQ’da FRT al. Kaydet, düşerse toparlamayı bekle, sonra sat. Buradaki çarpan, yayımlanmış temkinli kazançtır.',
  bus: 'Görevden önce VAP al, sıçramadan sonra sat.',
  construction:
    'Son suikastten önce GCD al, sonra sat. Önceki çarpanlar biriksin diye bunu en sona bırak.',
}

export function stockInstruction(locale: Locale, id: string, instruction: string) {
  if (locale !== 'tr') return instruction
  return STOCKS[id] ?? instruction
}

const CLASSES: Record<string, string> = {
  Super: 'Süper',
  Sports: 'Spor',
  Muscle: 'Muscle',
  'Off-Road': 'Arazi',
  'Sports Classic': 'Klasik spor',
  Motorcycle: 'Motosiklet',
  'Open Wheel': 'Açık tekerlek',
  Coupe: 'Coupe',
  Sport: 'Spor',
  Bicycle: 'Bisiklet',
  Dirtbike: 'Cross',
  'Personal Watercraft': 'Deniz motosikleti',
  Pickup: 'Pikap',
  Powerboat: 'Sürat teknesi',
  'Quad Bike': 'ATV',
  Riverboat: 'Nehir teknesi',
  Scooter: 'Scooter',
  Superbike: 'Süper motosiklet',
  Chopper: 'Chopper',
  Sedan: 'Sedan',
  SUV: 'SUV',
  Compact: 'Kompakt',
  Van: 'Van',
  Commercial: 'Ticari',
  Industrial: 'Endüstriyel',
  Utility: 'Hizmet',
  Emergency: 'Acil durum',
  Military: 'Askeri',
  Service: 'Servis',
  Boat: 'Tekne',
  Helicopter: 'Helikopter',
  Plane: 'Uçak',
  Cycle: 'Bisiklet',
  Rail: 'Raylı',
}

const WHEELS: Record<string, string> = {
  Melee: 'Yakın dövüş',
  Handgun: 'Tabancalar',
  SMG: 'SMG',
  MG: 'Makineli',
  Rifle: 'Saldırı tüfekleri',
  Shotgun: 'Pompalı',
  Sniper: 'Keskin nişancı',
  Heavy: 'Ağır silahlar',
  Throwable: 'Fırlatılanlar',
}

export function vehicleClass(locale: Locale, name: string) {
  return pick(locale, name, CLASSES)
}

export function weaponClass(locale: Locale, name: string) {
  return pick(locale, name, WHEELS)
}

const CHALLENGES: Record<string, string> = {
  'Set up a Bunker': 'Bir Bunker kur',
  'Complete a Resupply mission': 'Bir ikmal görevi bitir',
  'Complete a Research project': 'Bir araştırma projesi bitir',
  'Deliver excess weapon parts to Ammu-Nation': 'Fazla silah parçalarını Ammu-Nation’a teslim et',
  'Complete a Mobile Operation': 'Bir Mobile Operation bitir',
  'Complete a Sell mission': 'Bir satış görevi bitir',
  'Complete all challenges for 1 weapon at the Bunker shooting range': 'Bunker atış poligonunda 1 silahın tüm meydan okumalarını bitir',
  'Complete 25 Resupply missions': '25 ikmal görevi bitir',
  'Upgrade 5 weapons to Mk II': '5 silahı Mk II’ye yükselt',
  'Complete all Mobile Operations on Hard difficulty in under 10 minutes': 'Tüm Mobile Operation’ları Hard zorlukta 10 dakikanın altında bitir',
  'Complete all challenges at the Bunker shooting range': 'Bunker atış poligonundaki tüm meydan okumaları bitir',
  'Research 25 projects': '25 proje araştır',
  'Earn $25,000,000 selling weapons': 'Silah satarak 25.000.000 $ kazan',
  'Set up a Nightclub': 'Bir Nightclub kur',
  'Complete a Club Management mission': 'Bir Club Management görevi bitir',
  'Dance for 5 minutes inside a Nightclub': 'Bir Nightclub içinde 5 dakika dans et',
  'Hire a second resident DJ': 'İkinci yerleşik DJ’i tut',
  'Source goods for your Nightclub basement': 'Nightclub bodrumun için mal topla',
  'Eject a troublemaker from your Nightclub': 'Nightclub’ından bir bela çıkarıcıyı at',
  'Hire all resident DJs': 'Tüm yerleşik DJ’leri tut',
  'Fill up your Nightclub safe': 'Nightclub kasasını doldur',
  'Complete 25 Club Management missions': '25 Club Management görevi bitir',
  'Unlock 8 Platinum Awards for After Hours': 'After Hours için 8 Platin ödül aç',
  'Have 25 celebrity appearances at your Nightclub': 'Nightclub’ında 25 ünlü ziyareti olsun',
  'Keep your Nightclub popularity at 100% for 10 hours': 'Nightclub popülerliğini 10 saat %100 tut',
  'Earn a total of $50,000,000 or more': 'Toplamda 50.000.000 $ veya daha fazla kazan',
  'Set up a Hangar': 'Bir Hangar kur',
  'Complete a Source Cargo mission': 'Bir Source Cargo görevi bitir',
  'Send a staff member to source Air Freight Cargo': 'Bir personeli Air Freight Cargo toplamaya gönder',
  'Turn a Pegasus vehicle into a Personal Aircraft': 'Bir Pegasus aracını kişisel uçağa çevir',
  'Complete 10 Source Cargo missions': '10 Source Cargo görevi bitir',
  'Complete an Air Freight Cargo sell mission': 'Bir Air Freight Cargo satış görevi bitir',
  'Complete 25 Source Cargo missions': '25 Source Cargo görevi bitir',
  'Fill your Hangar with Air Freight Cargo': 'Hangar’ı Air Freight Cargo ile doldur',
  'Sell 50 crates of the same type of Air Freight Cargo in one sale': 'Aynı türden 50 kasa Air Freight Cargo’yu tek satışta sat',
  'Complete 100 Source Cargo missions': '100 Source Cargo görevi bitir',
  'Sell 1,000 crates of Air Freight Cargo': '1.000 kasa Air Freight Cargo sat',
  'Sell all types of Air Freight Cargo': 'Tüm Air Freight Cargo türlerini sat',
  'Earn $50,000,000 selling Air Freight Cargo': 'Air Freight Cargo satarak 50.000.000 $ kazan',
  'Set up the Agency': 'Agency’yi kur',
  'Complete a Security Contract': 'Bir Security Contract bitir',
  'Meet the VIP': 'VIP ile tanış',
  'Complete any Data Leak during the VIP Contract': 'VIP Contract sırasında herhangi bir Data Leak bitir',
  'Complete 10 Payphone Hits': '10 Payphone Hit bitir',
  'Complete 10 Security Contracts': '10 Security Contract bitir',
  'Complete the VIP Contract': 'VIP Contract’ı bitir',
  'Complete 25 Payphone Hits with the Assassination Bonus': 'Suikast bonusuyla 25 Payphone Hit bitir',
  'Complete all Short Trips playing as Franklin and Lamar': 'Franklin ve Lamar olarak tüm Short Trip’leri bitir',
  'Unlock 10 Platinum Awards for The Contract': 'The Contract için 10 Platin ödül aç',
  'Complete 100 Security Contracts on Specialist or Specialist+': 'Specialist veya Specialist+ zorlukta 100 Security Contract bitir',
  'Complete 100 Payphone Hits with the Assassination Bonus': 'Suikast bonusuyla 100 Payphone Hit bitir',
  'Earn $5,000,000 from Security Contracts': 'Security Contract’lardan 5.000.000 $ kazan',
  'Become President of a Motorcycle Club': 'Bir Motorcycle Club’ın başkanı ol',
  'Hire a player to join your Motorcycle Club': 'Motorcycle Club’ına bir oyuncu al',
  'Complete a Clubhouse Contract': 'Bir Clubhouse Contract bitir',
  'Deliver a customer bike': 'Bir müşteri motosikletini teslim et',
  'Set up any Biker business': 'Herhangi bir Biker işletmesi kur',
  'Complete a Resupply mission for any Biker business': 'Herhangi bir Biker işletmesi için ikmal görevi bitir',
  'Complete all Clubhouse Contracts': 'Tüm Clubhouse Contract’ları bitir',
  'Sell product from all Biker businesses': 'Tüm Biker işletmelerinden ürün sat',
  'Resupply the Clubhouse bar 10 times': 'Clubhouse barını 10 kez ikmal et',
  'Earn $25,000,000 selling product': 'Ürün satarak 25.000.000 $ kazan',
  'Earn $2,500,000 delivering customer bikes': 'Müşteri motosikletleri teslim ederek 2.500.000 $ kazan',
  'Earn $500,000 from your Clubhouse bar': 'Clubhouse barından 500.000 $ kazan',
  'Complete 50 Clubhouse Contracts': '50 Clubhouse Contract bitir',
  'Become CEO of an Organization': 'Bir Organization’ın CEO’su ol',
  'Hire a player to join your Organization': 'Organization’ına bir oyuncu al',
  'Complete a VIP Work': 'Bir VIP Work bitir',
  'Export Mixed Goods to the docks': 'Mixed Goods’u rıhtıma ihraç et',
  'Own a Special Cargo Warehouse': 'Bir Special Cargo deposu edin',
  'Source Cargo for your warehouse': 'Depon için kargo topla',
  'Source all types of Cargo': 'Tüm kargo türlerini topla',
  'Sell 111 crates of Cargo in one sell mission': 'Tek satış görevinde 111 kasa kargo sat',
  'Complete 5 different VIP Works': '5 farklı VIP Work bitir',
  'Complete 10 different VIP Works and Challenges': '10 farklı VIP Work ve Challenge bitir',
  'Source all types of Special Items': 'Tüm Special Item türlerini topla',
  'Source 250 crates of Cargo': '250 kasa kargo topla',
  'Earn $50,000,000 selling Cargo': 'Kargo satarak 50.000.000 $ kazan',
  'Complete all missions for The First Dose': 'The First Dose’un tüm görevlerini bitir',
  'Set up an Acid Lab': 'Bir Acid Lab kur',
  'Complete 10 Source Supplies missions for the Acid Lab': 'Acid Lab için 10 Source Supplies görevi bitir',
  'Complete all missions for The Last Dose': 'The Last Dose’un tüm görevlerini bitir',
  'Complete all Fooligan Jobs': 'Tüm Fooligan Jobs’u bitir',
  'Earn $1,000,000 selling Acid': 'Asit satarak 1.000.000 $ kazan',
  'Unlock all custom acid names': 'Tüm özel asit adlarını aç',
  'Complete 25 Fooligan Jobs without dying': 'Ölmeden 25 Fooligan Job bitir',
  'Take out 100 hostile versions of yourself in The Last Dose - Checking In': 'The Last Dose - Checking In’de kendinin 100 düşman kopyasını alt et',
  'Unlock 10 Platinum Awards for Los Santos Drug Wars': 'Los Santos Drug Wars için 10 Platin ödül aç',
  'Complete 100 Source Supplies missions for the Acid Lab': 'Acid Lab için 100 Source Supplies görevi bitir',
  'Complete all missions in The First Dose and The Last Dose without dying': 'The First Dose ve The Last Dose görevlerinin tümünü ölmeden bitir',
  'Earn $10,000,000 selling Acid': 'Asit satarak 10.000.000 $ kazan',
  'Set up a Salvage Yard': 'Bir Salvage Yard kur',
  'Meet with Yusuf Amir': 'Yusuf Amir ile görüş',
  'Complete a Salvage Yard Robbery': 'Bir Salvage Yard soygunu bitir',
  'Sell a vehicle': 'Bir araç sat',
  'Salvage a vehicle': 'Bir aracı hurdaya ayır',
  'Earn $250,000 from salvaging vehicles': 'Araç hurdasından 250.000 $ kazan',
  'Complete all Salvage Yard Robberies': 'Tüm Salvage Yard soygunlarını bitir',
  'Sell 5 vehicles in perfect condition from Salvage Yard Robberies': 'Salvage Yard soygunlarından 5 aracı kusursuz durumda sat',
  'Complete all bonus challenges for a Salvage Yard Robbery': 'Bir Salvage Yard soygununun tüm bonus meydan okumalarını bitir',
  'Unlock 10 Platinum Awards for The Chop Shop': 'The Chop Shop için 10 Platin ödül aç',
  'Earn $2,500,000 from salvaging vehicles': 'Araç hurdasından 2.500.000 $ kazan',
  'Complete all bonus challenges for all Salvage Yard Robberies': 'Tüm Salvage Yard soygunlarının bonus meydan okumalarını bitir',
  'Earn $10,000,000 from selling stolen vehicles': 'Çalıntı araç satarak 10.000.000 $ kazan',
  'Acquire the Garment Factory': 'Garment Factory’yi edin',
  'Meet with Pavel': 'Pavel ile görüş',
  'Complete a File': 'Bir File bitir',
  'Complete 5 Files': '5 File bitir',
  'Complete 2 Files without losing a life': 'Can kaybetmeden 2 File bitir',
  'Earn $25,000 in additional Garment Factory earnings': 'Garment Factory’den ek 25.000 $ kazan',
  'Complete all the Files': 'Tüm File’ları bitir',
  'Complete the priority File 2 weeks in a row': 'Öncelikli File’ı üst üste 2 hafta bitir',
  'Complete all mission challenges for a File': 'Bir File’ın tüm görev meydan okumalarını bitir',
  'Unlock 9 Platinum Awards for Agents of Sabotage': 'Agents of Sabotage için 9 Platin ödül aç',
  'Complete 25 Files': '25 File bitir',
  'Complete all mission challenges for all Files': 'Tüm File’ların görev meydan okumalarını bitir',
  'Earn $100,000 in additional Garment Factory earnings': 'Garment Factory’den ek 100.000 $ kazan',
  'Set up a Bail Office': 'Bir Bail Office kur',
  'Meet with Maude Eccles': 'Maude Eccles ile görüş',
  'Secure or eliminate a bounty target': 'Bir ödül hedefini yakala ya da etkisizleştir',
  'Secure or eliminate 5 standard bounty targets': '5 standart ödül hedefini yakala ya da etkisizleştir',
  'Secure or eliminate 2 Most Wanted bounty targets': '2 Most Wanted ödül hedefini yakala ya da etkisizleştir',
  'Earn $250,000 from securing or eliminating bounty targets': 'Ödül hedeflerinden 250.000 $ kazan',
  'Secure or eliminate 10 bounty targets without losing a life': 'Can kaybetmeden 10 ödül hedefini yakala ya da etkisizleştir',
  'Secure or eliminate a Most Wanted bounty target 3 days in a row': 'Üst üste 3 gün bir Most Wanted ödül hedefini yakala ya da etkisizleştir',
  'Secure or eliminate 25 bounty targets': '25 ödül hedefini yakala ya da etkisizleştir',
  'Unlock 10 Platinum Awards for Bottom Dollar Bounties': 'Bottom Dollar Bounties için 10 Platin ödül aç',
  'Secure all bounty targets alive': 'Tüm ödül hedeflerini canlı yakala',
  'Earn $1,000,000 in additional income from your Bail Office agents': 'Bail Office ajanlarından ek 1.000.000 $ kazan',
  'Earn $5,000,000 from securing or eliminating bounty targets': 'Ödül hedeflerinden 5.000.000 $ kazan',
  'Meet Mr. Faber': 'Bay Faber ile tanış',
  'Acquire the Hands On Car Wash': 'Hands On Car Wash’ı edin',
  'Complete any job at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours': 'Hands On Car Wash, Smoke on the Water veya Higgins Helitours’ta herhangi bir iş bitir',
  'Acquire Higgins Helitours': 'Higgins Helitours’u edin',
  'Complete 10 jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours': 'Hands On Car Wash, Smoke on the Water veya Higgins Helitours’ta 10 iş bitir',
  'Collect $100,000 from the safe inside the Hands On Car Wash': 'Hands On Car Wash kasasından 100.000 $ topla',
  'Acquire Smoke on the Water': 'Smoke on the Water’ı edin',
  'Earn $500,000 from jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours': 'Hands On Car Wash, Smoke on the Water veya Higgins Helitours işlerinden 500.000 $ kazan',
  'Obtain the maximum possible bonus in one Mr. Faber Work': 'Bir Bay Faber işinde olası en yüksek bonusu al',
  'Unlock 14 Platinum Awards for Money Fronts': 'Money Fronts için 14 Platin ödül aç',
  'Obtain the maximum possible bonus in all Mr. Faber Works': 'Tüm Bay Faber işlerinde olası en yüksek bonusu al',
  'Earn $2,000,000 from jobs at the Hands On Car Wash, Smoke on the Water, or Higgins Helitours': 'Hands On Car Wash, Smoke on the Water veya Higgins Helitours işlerinden 2.000.000 $ kazan',
  'Collect $500,000 from the safe inside the Hands On Car Wash': 'Hands On Car Wash kasasından 500.000 $ topla',
  'Visit and become a member of the LS Car Meet': 'LS Car Meet’i ziyaret et ve üye ol',
  'Take a vehicle into the LS Car Meet Test Track': 'Bir aracı LS Car Meet test pistine sok',
  'Set up an Auto Shop': 'Bir Auto Shop kur',
  'Complete any Robbery Contract': 'Herhangi bir Robbery Contract bitir',
  'Service and deliver 10 customer vehicles': '10 müşteri aracına bakım yapıp teslim et',
  'Reach LS Car Meet reputation level 10': 'LS Car Meet itibarını 10. seviyeye çıkar',
  'Complete all Robbery Contracts': 'Tüm Robbery Contract’ları bitir',
  'Complete a Prize Ride Challenge': 'Bir Prize Ride meydan okumasını bitir',
  'Deliver all 10 Exotic Exports vehicles in a day': 'Bir günde 10 Exotic Exports aracının hepsini teslim et',
  'Unlock 10 Platinum Awards for Los Santos Tuners': 'Los Santos Tuners için 10 Platin ödül aç',
  'Complete 25 Robbery Contracts': '25 Robbery Contract bitir',
  'Earn $5,000,000 delivering customer vehicles': 'Müşteri araçları teslim ederek 5.000.000 $ kazan',
  'Reach LS Car Meet reputation level 100': 'LS Car Meet itibarını 100. seviyeye çıkar',
  'Visit The Diamond Casino & Resort': 'The Diamond Casino & Resort’u ziyaret et',
  'Purchase a penthouse and visit Agatha Baker': 'Bir çatı katı al ve Agatha Baker’ı ziyaret et',
  'Complete Loose Cheng': 'Loose Cheng’i bitir',
  'Complete Cashing Out': 'Cashing Out’u bitir',
  'Recover the bonus item after completing Cashing Out': 'Cashing Out’tan sonra bonus eşyayı geri al',
  'Complete Casino Work for Agatha Baker': 'Agatha Baker için bir Casino Work bitir',
  'Complete 13 different Casino Work missions': '13 farklı Casino Work görevi bitir',
  'Complete all Casino Story missions on Hard difficulty': 'Tüm Casino hikaye görevlerini Hard zorlukta bitir',
  "Take out Avery's bodyguards without being spotted in Cashing Out": 'Cashing Out’ta fark edilmeden Avery’nin korumalarını alt et',
  'Unlock 11 Platinum Awards for The Diamond Casino & Resort': 'The Diamond Casino & Resort için 11 Platin ödül aç',
  'Complete all Casino Story missions on Hard difficulty while taking less than 50% damage': 'Tüm Casino hikaye görevlerini Hard zorlukta, %50’den az hasar alarak bitir',
  'Complete all Casino Story missions on Hard difficulty using only pistols': 'Tüm Casino hikaye görevlerini Hard zorlukta yalnızca tabancayla bitir',
  'Complete 100 Casino Work missions for Agatha Baker': 'Agatha Baker için 100 Casino Work bitir',
  'Meet Miguel Madrazo inside The Music Locker': 'The Music Locker içinde Miguel Madrazo ile tanış',
  'Set up a Kosatka': 'Bir Kosatka kur',
  'Find where the Madrazo files are being held': 'Madrazo dosyalarının tutulduğu yeri bul',
  'Complete The Cayo Perico Heist as a leader': 'The Cayo Perico Heist’i lider olarak bitir',
  'Help Tom Connors or English Dave with a DJ request': 'Tom Connors veya English Dave’in bir DJ isteğine yardım et',
  'Find 10 treasure chests on Cayo Perico': 'Cayo Perico’da 10 hazine sandığı bul',
  'Complete The Cayo Perico Heist on Hard difficulty': 'The Cayo Perico Heist’i Hard zorlukta bitir',
  'Complete 25 prep work missions without dying': 'Ölmeden 25 hazırlık görevi bitir',
  'Complete all DJ requests for Tom Connors and English Dave': 'Tom Connors ve English Dave’in tüm DJ isteklerini bitir',
  'Unlock 15 Platinum Awards for The Cayo Perico Heist': 'The Cayo Perico Heist için 15 Platin ödül aç',
  'Steal all variations of the primary target': 'Ana hedefin tüm çeşitlerini çal',
  'Complete The Cayo Perico Heist using all approaches': 'The Cayo Perico Heist’i tüm yaklaşımlarla bitir',
  'Steal $50,000,000 in primary and secondary targets': 'Ana ve yan hedeflerden 50.000.000 $ çal',
  'Meet Lester Crest at Mirror Park': 'Mirror Park’ta Lester Crest ile görüş',
  'Set up an Arcade': 'Bir Arcade kur',
  'Scope the contents of the Casino vault': 'Kumarhane kasasının içeriğini keşfet',
  'Complete The Diamond Casino Heist': 'The Diamond Casino Heist’i bitir',
  'Complete 25 prep missions': '25 hazırlık görevi bitir',
  'Play an arcade game': 'Bir arcade oyunu oyna',
  'Complete The Diamond Casino Heist using all approaches': 'The Diamond Casino Heist’i tüm yaklaşımlarla bitir',
  'Unlock all crew members': 'Tüm ekip üyelerini aç',
  'Complete The Diamond Casino Heist in under 10 minutes on Hard difficulty': 'The Diamond Casino Heist’i Hard zorlukta 10 dakikanın altında bitir',
  'Unlock 15 Platinum Awards for The Diamond Casino Heist': 'The Diamond Casino Heist için 15 Platin ödül aç',
  'Steal all variations of loot from the vault on Hard difficulty, without being spotted': 'Hard zorlukta, fark edilmeden kasadaki tüm ganimet çeşitlerini çal',
  'Steal $50,000,000 from the vault': 'Kasadan 50.000.000 $ çal',
  'Steal $100,000 from the Daily Vault': 'Günlük kasadan 100.000 $ çal',
  'Set up a Facility and meet Lester Crest': 'Bir Facility kur ve Lester Crest ile görüş',
  'Set up The Data Breaches': 'The Data Breaches’i kur',
  'Complete any setup for The Data Breaches': 'The Data Breaches için herhangi bir hazırlık bitir',
  'Complete The Data Breaches as a leader': 'The Data Breaches’i lider olarak bitir',
  'Set up The Bogdan Problem': 'The Bogdan Problem’i kur',
  'Complete The Bogdan Problem as a leader': 'The Bogdan Problem’i lider olarak bitir',
  'Set up The Doomsday Scenario': 'The Doomsday Scenario’yu kur',
  'Complete The Doomsday Scenario as a leader': 'The Doomsday Scenario’yu lider olarak bitir',
  'Complete 14 prep missions without dying': 'Ölmeden 14 hazırlık görevi bitir',
  'Unlock 10 Platinum Awards for The Doomsday Heist': 'The Doomsday Heist için 10 Platin ödül aç',
  'Complete all 3 Acts using only pistols and vehicles': '3 perdeyi de yalnızca tabanca ve araçla bitir',
  'Complete the Elite Challenges for all 3 Acts': '3 perdenin de Elite meydan okumasını bitir',
  'Complete 15 Acts as a leader': 'Lider olarak 15 perde bitir',
  'Own a high-end or custom apartment': 'Üst seviye ya da özel bir daire edin',
  'Set up The Fleeca Job': 'The Fleeca Job’ı kur',
  'Complete a setup for The Fleeca Job as a leader': 'The Fleeca Job hazırlığını lider olarak bitir',
  'Complete The Fleeca Job as a leader': 'The Fleeca Job’ı lider olarak bitir',
  'Complete Prison Break as a leader': 'Prison Break’i lider olarak bitir',
  'Complete The Humane Labs Raid as a leader': 'The Humane Labs Raid’i lider olarak bitir',
  'Complete Series A Funding as a leader': 'Series A Funding’i lider olarak bitir',
  'Complete The Pacific Standard Job as a leader': 'The Pacific Standard Job’ı lider olarak bitir',
  'Complete all heists with the same crew': 'Tüm soygunları aynı ekiple bitir',
  'Unlock 15 Platinum Awards for heists': 'Soygunlar için 15 Platin ödül aç',
  'Earn $50,000,000 across all heists': 'Tüm soygunlardan 50.000.000 $ kazan',
  'Complete the Elite Challenge for each heist': 'Her soygunun Elite meydan okumasını bitir',
  'Complete the Criminal Mastermind challenge': 'Criminal Mastermind meydan okumasını bitir',
  'Meet Raf De Angelis inside your Mansion': 'Malikânende Raf De Angelis ile tanış',
  'Scope out the Kortz Center': 'Kortz Center’ı keşfet',
  'Complete any heist prep for The Kortz Center Heist': 'The Kortz Center Heist için herhangi bir hazırlık bitir',
  'Complete The Kortz Center Heist': 'The Kortz Center Heist’i bitir',
  'Complete 20 heist preps for The Kortz Center Heist': 'The Kortz Center Heist için 20 hazırlık bitir',
  'Scope all secondary targets': 'Tüm yan hedefleri keşfet',
  'Complete The Kortz Center Heist on Hard mode without being spotted': 'The Kortz Center Heist’i Hard modda fark edilmeden bitir',
  'Keep a stolen painting for your Mansion': 'Çalıntı bir tabloyu malikânen için sakla',
  'Use all 4 entry points: Loading Bay, Sewer, Staff Entrance, and Skylight': '4 girişin hepsini kullan: Loading Bay, Sewer, Staff Entrance ve Skylight',
  'Unlock 15 Platinum Awards for The Kortz Center Heist': 'The Kortz Center Heist için 15 Platin ödül aç',
  'Complete the Elite Challenge for The Kortz Center Heist': 'The Kortz Center Heist Elite meydan okumasını bitir',
  'Keep any 5 stolen paintings for your Mansion': 'Malikânen için herhangi 5 çalıntı tablo sakla',
  'Steal a total of $50,000,000 in primary and secondary targets': 'Ana ve yan hedeflerden toplam 50.000.000 $ çal',
}

const CAREER_NOTES: Record<string, string> = {
  'agents-of-sabotage':
    'GTA Wiki, oyunda 1. ve 3. katman ödüllerinin yer değiştirdiğini yazar. Bu liste wiki tablosunu izler.',
}

export function careerChallenge(locale: Locale, text: string) {
  return pick(locale, text, CHALLENGES)
}

export function careerNote(locale: Locale, id: string, note?: string) {
  if (!note || locale !== 'tr') return note
  return CAREER_NOTES[id] ?? note
}

const STATS: Record<string, string> = {
  speed: 'Azami hız',
  lap: 'Tur süresi',
  accel: 'İvme',
  brake: 'Fren',
  traction: 'Yol tutuş',
  price: 'Fiyat',
  hsw: 'HSW uygunluğu',
  drive: 'Çekiş',
  seats: 'Koltuk',
}

export function compareStat(locale: Locale, id: string, english: string) {
  if (locale !== 'tr') return english
  return STATS[id] ?? english
}
