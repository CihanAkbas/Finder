import { GTA6_SAFEHOUSE_GUIDES } from './safehouseGuides'
import type { GuideText, MarkerGuide, GameMarker } from '@/types/game'
const t = (en: string, tr: string): GuideText => ({ en, tr })
const source = (title: string, url: string) => ({ title, url })
const alienSources = [source('PC Gamer · Alien quest', 'https://www.pcgamer.com/games/grand-theft-auto-6/gta-6-alien-ufo-location/'), source('VGC · UFO questline', 'https://www.videogameschronicle.com/guide/gta-6-full-alien-ufo-questline-walkthrough/')]
const missingSources = [source('Alcast · Missing Persons', 'https://alcasthq.com/gta-6-missing-persons/'), source('VGC · Missing Persons', 'https://www.videogameschronicle.com/guide/gta-6-serial-killer-missing-persons-locations/'), source('PC Gamer · Missing Persons', 'https://www.pcgamer.com/games/grand-theft-auto/gta-6-missing-persons-locations/')]
const skunkSources = [source('GamesRadar · Skunk Ape', 'https://www.gamesradar.com/games/grand-theft-auto/gta-6-bigfoot-skunk-ape-mr-mangrove/'), source('KeenGamer · Effigies', 'https://www.keengamer.com/articles/guides/gta-6-skunk-ape-walkthrough-all-effigy-locations-and-endings/')]
const flushSources = [source('GamesRadar · The Final Flush', 'https://www.gamesradar.com/games/grand-theft-auto/gta-6-final-flush-increase-maximum-stamina/'), source('Windows Central · The Final Flush', 'https://www.windowscentral.com/gaming/how-to-start-and-complete-the-final-flush-hidden-side-mission-in-gta-6-and-get-a-permanent-stamina-increase')]
const crabSources = [source('The Big Lead / Yahoo · Crab outpost', 'https://tech.yahoo.com/gaming/articles/gta-6-pelican-valley-crab-134156659.html'), source('Power Up Gaming · Crab lab', 'https://powerupgaming.co.uk/2026/11/27/gta-6-crab-lab-puzzle-password-safe-boathouse-code/')]
const link = (id: string, en: string, tr: string) => ({ id, label: t(en, tr) })
export const MYSTERY_GUIDES: Record<string, MarkerGuide> = {}
export const MYSTERY_FAMILIES: Record<string, string[]> = {}
function add(family: string, ids: string[], guide: MarkerGuide) {
  MYSTERY_FAMILIES[family] = [...(MYSTERY_FAMILIES[family] ?? []), ...ids]
  for (const id of ids) MYSTERY_GUIDES[id] = guide
}
const alienStart = 'gta6-community-random-event-016', alienOther = 'gta6-community-random-event-291', alienLab = 'gta6-community-easter-egg-019'
add('alien', [alienStart, alienOther], {
  summary: t('Possible opening encounter of the three-part alien quest.', 'Üç aşamalı uzaylı görevinin başlayabildiği karşılaşma alanı.'),
  requirements: [t('Reach Chapter 2 to progress the chain and search Kelly County after dark; around 02:00 is a reported time, not a guaranteed appointment.', 'Zinciri ilerletmek için 2. bölüme ulaş ve Kelly County’yi gece araştır; 02.00 civarı bildirilen bir saat, kesin randevu değil.')],
  directions: [t('Find an empty car with open doors and flashing lights. Follow the discarded clothes into the woods and interact with the woman beneath the UFO.', 'Kapıları açık, ışıkları yanıp sönen boş arabayı bul. Yerdeki kıyafetleri ormana doğru takip et ve UFO altındaki kadınla etkileşime gir.'), t('After the encounter, sleep with the same character on later nights until the dream begins. Read the keypad symbols and remember your own code; reproduce the dream puzzles at the rescue site.', 'Karşılaşmadan sonra aynı karakterle sonraki gecelerde uyuyarak rüyayı bekle. Tuş takımındaki simgeleri oku, kendi kodunu hatırla; kurtarma yerinde rüya bulmacalarını tekrarla.')],
  warnings: [t('The two roadside pins are alternative search areas, not consecutive objectives. No universal keypad code or guaranteed spawn is confirmed.', 'Yol kenarındaki iki pin alternatif arama alanlarıdır; art arda yapılacak iki hedef değildir. Evrensel bir tuş takımı kodu doğrulanmış değil.')],
  relatedPins: [link(alienStart, 'Possible roadside start', 'Olası yol kenarı başlangıcı'), link(alienOther, 'Alternative encounter area', 'Alternatif karşılaşma alanı'), link(alienLab, 'Rescue building', 'Kurtarma binası')], sources: alienSources,
})
add('alien', [alienLab], {
  summary: t('Abandoned-building record for the alien rescue stage, after the roadside encounter and dream.', 'Yol kenarı karşılaşması ve rüyadan sonraki uzaylı kurtarma aşamasının terk edilmiş bina kaydı.'),
  requirements: [t('Complete the abduction and dream first; return with the character who experienced them.', 'Önce kaçırılma ve rüya aşamalarını tamamla; bunları yaşayan karakterle geri dön.')],
  directions: [t('Compare the building south of Hamlet with the Earth-globe clue from your dream. The pin indicates the building area, not an exact doorway.', 'Hamlet’in güneyindeki binayı rüyanda Dünya küresinde gördüğün görüntüyle karşılaştır. Pin bina alanını gösterir, tam kapıyı değil.'), t('Enter the fenced compound, reach the downstairs keypad and use your dream code. Follow the elevator route and repeat the light-and-milk puzzle to reach the alien.', 'Çevrili alana gir, alt kattaki tuş takımına ulaş ve rüyandaki kodu kullan. Asansör yolunu izle; uzaylıya ulaşmak için ışık ve süt bulmacasını tekrarla.'), t('Read the controls: match the target lights, operate the lever, take milk from the left room and place it in the right-hand apparatus. Avoid the damaging middle room; carry the alien outside.', 'Kontrolleri incele: ışıkları hedef duruma getir, kolu çalıştır, soldaki odadan sütü alıp sağdaki düzeneğe yerleştir. Hasar veren orta odadan kaçın; uzaylıyı dışarı taşı.')],
  warnings: [t('Guides disagree on code examples and light colours. Use the symbols and target state shown in your own game.', 'Rehberlerin örnek kodları ve ışık renkleri farklı. Kendi oyunundaki simgeleri ve istenen ışık durumunu esas al.')],
  relatedPins: [link(alienStart, 'Return to the encounter area', 'Başlangıç alanını aç')], sources: alienSources,
})
const motel = 'gta6-community-safehouse-003', warehouse = 'gta6-gps-pin-917811', sunken = 'gta6-community-random-event-043', pink = 'gta6-community-random-event-044', trailer = 'gta6-gps-pin-917813'
const missingLinks = [link(motel, 'Start: motel notice board', 'Başlangıç: motel ilanları'), link(warehouse, 'Warehouse clue area', 'Depo ipucu alanı'), link(trailer, 'Northern tourist search area', 'Kuzeydeki turist arama alanı'), link(pink, 'Pink PRTYGRL car', 'Pembe PRTYGRL otomobil'), link(sunken, 'Submerged car', 'Batık otomobil')]
add('missing-persons', [motel, 'gta6-community-random-event-035'], {
  summary: t('Missing-person posters begin the tourist investigation; the Starlet Motel reception is a documented starting point.', 'Kayıp kişi ilanları turist soruşturmasını başlatır; Starlet Motel resepsiyonu belgelenmiş bir başlangıçtır.'),
  directions: [t('Inspect the reception posters to add the tip-line contact, then investigate the warehouse opposite Moses’s garage. Photograph all three evidence sets.', 'İhbar hattını telefona eklemek için resepsiyon ilanlarını incele; sonra Moses’ın garajının karşısındaki depoyu araştır. Üç kanıt grubunun fotoğrafını çek.')],
  requirements: [t('The investigation can be started early; both protagonists are needed for its later story sequence.', 'Soruşturmaya erken başlanabilir; sonraki hikâye aşaması için iki başkarakter de gerekir.')],
  warnings: [t('A poster elsewhere is not necessarily the motel. Match the actual notice and follow its objective.', 'Başka yerdeki bir ilan motel konumu anlamına gelmez. Bulduğun ilanı ve verdiği hedefi esas al.')], relatedPins: missingLinks, sources: missingSources,
})
add('missing-persons', [warehouse], {
  summary: t('Investigation clue area near Moses: inspect the abandoned warehouse and its evidence room.', 'Moses yakınındaki soruşturma ipucu alanı: terk edilmiş depoyu ve kanıt odasını incele.'),
  directions: [t('Find the warehouse opposite the garage. A side-wall crawlspace provides an alternative to the closed shutter. Inspect the three lockers/photos inside.', 'Garajın karşısındaki depoyu bul. Yan duvardaki geçit, kapalı kepenge alternatif giriş sağlar. İçeride üç dolabı ve fotoğrafları incele.'), t('Investigate the three victims in any order and report each discovery using the tip line. After the follow-up call, return here.', 'Üç kurbanı istediğin sırayla araştır ve her keşfi ihbar hattına bildir. Sonraki aramadan sonra buraya dön.')],
  warnings: [t('Returning alone or with your partner changes the final sequence. Keep a manual save if you want to explore the alternatives.', 'Tek başına veya partnerinle dönmek son aşamayı değiştirir. Alternatifleri görmek istiyorsan ayrı bir kayıt tut.')], relatedPins: missingLinks, sources: missingSources,
})
add('missing-persons', [pink], {
  summary: t('Susanne Keeble’s pink-car clue in the missing-tourist investigation.', 'Kayıp turist soruşturmasında Susanne Keeble’ın pembe otomobil ipucu.'),
  directions: [t('Search the junkyard by Pay ’n’ Spray, opposite the drive-in. Locate the pink DeVanity with PRTYGRL plates, examine its trunk and report the body.', 'Arabalı sinemanın karşısında, Pay ’n’ Spray yanındaki hurdalığı araştır. PRTYGRL plakalı pembe DeVanity’nin bagajını incele ve cesedi bildir.')],
  requirements: [t('Collect the warehouse photos first; check the Creepy Photos album.', 'Önce depodaki fotoğrafları al; Creepy Photos albümünü kontrol et.')], relatedPins: missingLinks, sources: missingSources,
})
add('missing-persons', [sunken], {
  summary: t('Donald Miller’s submerged-car clue in the missing-tourist investigation.', 'Kayıp turist soruşturmasında Donald Miller’ın batık otomobil ipucu.'),
  directions: [t('Use the photo’s Wild Hog Point perspective to find the inlet and submerged car. Search in daylight, inspect the remains and report the body.', 'Koydaki batık otomobili bulmak için fotoğraftaki Wild Hog Point bakış açısını eşleştir. Gündüz araştır, kalıntıları incele ve cesedi bildir.')],
  warnings: [t('Watch for alligators near the water. A map pin does not identify the exact underwater interaction point.', 'Su kenarında timsahlara dikkat et. Pin, su altındaki etkileşim noktasını kesin olarak göstermez.')], relatedPins: missingLinks, sources: missingSources,
})
add('missing-persons', [trailer], {
  summary: t('Northern missing-tourist search area; compare it with the water-tower photograph.', 'Kuzeydeki kayıp turist arama alanı; su kulesi fotoğrafıyla karşılaştır.'),
  directions: [t('Patrick Murray’s clue points to the pale-blue trailer beneath the water tower in northern Gellhorn. Enter it, inspect the loose floorboards and report the remains.', 'Patrick Murray ipucu, Gellhorn’un kuzeyindeki su kulesi altında duran açık mavi karavanı gösterir. İçeri gir, gevşek döşemeleri incele ve kalıntıları bildir.')],
  requirements: [t('Use the warehouse photo to verify the trailer before marking this location complete.', 'Bu konumu tamamlandı saymadan önce karavanı depodaki fotoğrafla doğrula.')], relatedPins: missingLinks, sources: missingSources,
})
const kirk = 'gta6-community-random-event-017', flyer = 'gta6-community-easter-egg-047', anchor = 'gta6-loc-1089607'
const effigies = ['055', '056', '057', '077', '097', '130', '131', '132', '133', '134', '441'].map(n => `gta6-community-random-event-${n}`)
add('skunk-ape', [kirk, flyer, anchor], {
  summary: t('Kirk’s Skunk Ape quest begins from a phone number on a flyer, not from collecting every effigy.', 'Kirk’ün Skunk Ape görevi, bütün totemleri toplamakla değil, bir ilandaki telefon numarasıyla başlar.'),
  directions: [t('A documented flyer is on the notice board just inside the Rusty Anchor. Read a flyer and call Kirk; follow the KK appointment and time on your phone.', 'Belgelenmiş bir ilan Rusty Anchor girişindeki panodadır. Bir ilanı oku ve Kirk’ü ara; telefondaki KK buluşmasını ve saatini takip et.'), t('Follow Kirk’s search, inspect the active effigy clues, then wait for his follow-up before the later helicopter stage.', 'Kirk’ün aramasına katıl, etkin totem ipuçlarını incele; sonraki helikopter aşamasından önce geri dönüşünü bekle.')],
  relatedPins: [link(anchor, 'Documented flyer: Rusty Anchor', 'Belgelenmiş ilan: Rusty Anchor'), link(kirk, 'Kirk meeting area', 'Kirk buluşma alanı'), ...effigies.slice(0, 3).map((id, i) => link(id, `Effigy search area ${i + 1}`, `Totem arama alanı ${i + 1}`))], sources: skunkSources,
})
add('skunk-ape', effigies, {
  locationSpecific: false,
  summary: t('A reported Skunk Ape tree-effigy location for Kirk’s investigation.', 'Kirk’ün soruşturmasıyla bağlantılı, bildirilen bir Skunk Ape ağaç totemi konumu.'),
  requirements: [t('Wait until Kirk requests effigies. His objective asks for three; it does not require every effigy pin on this map.', 'Kirk’ün totemleri istemesini bekle. Hedef üç tanedir; haritadaki bütün totem pinlerini tamamlamanı gerektirmez.')],
  directions: [t('Search the trees around the pin, use Focus to spot an effigy and study it with L2/LT. Check the mission counter after each valid examination.', 'Pin çevresindeki ağaçları araştır; totemi Focus ile bul ve L2/LT ile incele. Her geçerli incelemeden sonra görev sayacını kontrol et.')],
  warnings: [t('The community map contains more candidate points than the guide’s nine effigies. This is an unverified candidate position, not proof of an additional required collectible.', 'Topluluk haritasında rehberdeki dokuz totemden fazla aday nokta var. Bu, konumu bağımsız doğrulanmamış bir adaydır; fazladan zorunlu koleksiyon kanıtı değildir.')],
  relatedPins: [link(kirk, 'Kirk quest start', 'Kirk görev başlangıcı')], sources: skunkSources,
})
const qrIds = ['gta6-community-hidden-package-022', 'gta6-community-easter-egg-037', 'gta6-community-easter-egg-048', ...['044', '048', '069', '071', '072'].map(n => `gta6-community-waink-curiosity-${n}`)]
const merle = 'gta6-community-strangers-001', waffles = 'gta6-loc-1090263'
add('final-flush', qrIds, {
  summary: t('A #NoFlushers poster associated with the hidden Final Flush strand.', 'Gizli The Final Flush zinciriyle bağlantılı bir #NoFlushers ilanı.'),
  directions: [t('Scan a quest poster with WAiNK and reply TRUTH if the message arrives. Follow the received appointment to Dr. Merle at Frank’s Waffles.', 'Görev ilanını WAiNK ile tara; mesaj gelirse TRUTH yanıtını ver. Gelen buluşma konumunu Frank’s Waffles’taki Dr. Merle’e kadar takip et.')],
  warnings: [t('One valid poster starts the strand. These alternative poster pins are not a sequence to collect, and a separate No Flusher tag is not necessarily a quest starter.', 'Geçerli bir ilan zinciri başlatır. Bu alternatif ilan pinleri sırayla toplanacak hedefler değildir; ayrı bir No Flusher etiketi mutlaka görev başlangıcı sayılmaz.')],
  relatedPins: [link(merle, 'Dr. Merle meeting', 'Dr. Merle buluşması')], sources: flushSources,
})
add('final-flush', [merle, waffles, 'gta6-community-random-event-122'], {
  summary: t('The Final Flush meeting with Dr. Merle at Frank’s Waffles.', 'The Final Flush için Frank’s Waffles’ta Dr. Merle buluşması.'),
  requirements: [t('Scan a quest QR poster and answer the phone messages first.', 'Önce görev QR ilanını tara ve telefon mesajlarını yanıtla.')],
  directions: [t('Speak with Merle using the message’s code, then follow his van/tracker objective to the treatment facility. Use the current mission waypoint rather than a similarly named landmark.', 'Mesajdaki kodla Merle’le konuş; ardından minibüs/takip cihazı hedefini arıtma tesisine kadar izle. Benzer adlı bir simge yerine güncel görev işaretini kullan.'), t('At the facility, set the control indicators to green, operate the lever and follow Merle’s instructions to complete the experiment.', 'Tesiste kontrol göstergelerini yeşile getir, kolu çalıştır ve deneyi tamamlamak için Merle’ün talimatlarını takip et.')],
  relatedPins: [link(qrIds[0], 'Example poster location', 'Örnek ilan konumu')], sources: flushSources,
})
add('crab-lab', ['gta6-community-easter-egg-036', 'gta6-community-hidden-package-128', 'gta6-community-safe-070', 'gta6-community-weapon-spawn-024'], {
  summary: t('Pelican Valley crab-research puzzle: computer, safe and dock building are separate locks.', 'Pelican Valley yengeç araştırma bulmacası: bilgisayar, kasa ve iskele binasının kilitleri ayrıdır.'),
  directions: [t('Restore power outside. Examine the floor writing and log into the computer with CLEAVES.', 'Dışarıdan elektriği aç. Zemindeki yazıyı incele ve bilgisayara CLEAVES ile gir.'), t('The successful specimen is 0036; double it for safe code 0072. The safe note gives dock code 0212, leading to the Crabshack VF5.', 'Başarılı numune 0036’dır; iki katı kasa kodu 0072 olur. Kasadaki not, Crabshack VF5’e ulaşan iskele kapısının 0212 kodunu verir.')],
  warnings: [t('Keep leading zeroes. Do not confuse these three passwords or apply them to unrelated safes.', 'Baştaki sıfırları koru. Bu üç şifreyi birbirine karıştırma veya başka kasalara uygulama.')],
  relatedPins: [link('gta6-community-easter-egg-036', 'Lab puzzle', 'Laboratuvar bulmacası'), link('gta6-community-safe-070', 'Research safe', 'Araştırma kasası'), link('gta6-community-weapon-spawn-024', 'Crabshack VF5 pickup', 'Crabshack VF5 buluntusu')], sources: crabSources,
})
add('haunted-hotel', ['gta6-community-easter-egg-010'], {
  summary: t('Marbelle Hotel’s haunting and rooftop-clue safe puzzle in Crosstown.', 'Crosstown’daki Marbelle Hotel’in perili olay ve çatı ipuçlu kasa bulmacası.'),
  directions: [t('Use the rear entrance and climb upstairs. Continue to the roof and read the Old Note; return to the ground-floor safe.', 'Arka girişten gir ve üst katlara çık. Çatıdaki Old Note’u oku; zemin kattaki kasaya geri dön.'), t('The published code is 955214. Confirm it against your rooftop note; opening the safe resolves the fog event and reveals cash and a watch.', 'Yayımlanan kod 955214. Çatı notunla karşılaştır; kasayı açınca sis olayı çözülür, para ve saat bulunur.')],
  warnings: [t('A separate roadside ghost encounter is not a required hotel step.', 'Yol kenarındaki ayrı hayalet karşılaşması otel için gereken bir aşama değildir.')], sources: [source('GAMES.GG · Marbelle Hotel', 'https://games.gg/grand-theft-auto-vi/guides/grand-theft-auto-6-haunted-hotel-safe-code-ghost-girl-location/')],
})


add('missing-persons', ['gta6-gps-pin-917810', 'gta6-gps-pin-917850', 'gta6-gps-pin-918805', 'gta6-gps-pin-918806', 'gta6-gps-pin-918807'], {
  locationSpecific: false,
  summary: t('An additional community marker for the missing-tourist investigation; its precise role is unverified.', 'Kayıp turist soruşturmasına ait ek topluluk işareti; bu noktanın kesin rolü doğrulanmış değil.'),
  directions: [t('Start from the motel/warehouse and compare this area against the three Creepy Photos. Use the linked named clues to avoid mistaking an extra map record for another victim.', 'Motel/depo üzerinden başla ve burayı üç Creepy Photos görüntüsüyle karşılaştır. Ek harita kaydını yeni bir kurban sanmamak için bağlantılı, adı belirli ipuçlarını kullan.')],
  warnings: [t('The investigation has three original victims. These extra pins may be alternate positions or clues; visiting every map marker is not an additional requirement.', 'Soruşturmada ilk aşamada üç kurban vardır. Ek pinler alternatif konum veya ipucu olabilir; bütün harita işaretlerini gezmek ek bir zorunluluk değildir.')],
  relatedPins: missingLinks, sources: missingSources,
})
add('missing-persons', ['gta6-gps-pin-918956'], {
  locationSpecific: false,
  summary: t('Reported mine location for the later Missing Persons rescue sequence.', 'Missing Persons zincirinin sonraki kurtarma aşaması için bildirilen maden konumu.'),
  requirements: [t('This branch follows the warehouse investigation; both protagonists must be playable.', 'Bu dal depo soruşturmasından sonra gelir; iki başkarakter de oynanabilir olmalıdır.')],
  directions: [t('Returning to the warehouse alone can lead to a partner-rescue sequence. Follow that mission waypoint to the mine; this pin does not replace the active objective.', 'Depoya tek başına dönmek, partneri kurtarma aşamasına götürebilir. Madene ulaşırken o görevin işaretini izle; bu pin etkin hedefin yerine geçmez.')],
  warnings: [t('Arriving with your partner can resolve the confrontation differently. Do not assume the mine branch is required in every playthrough.', 'Partnerinle gelmek karşılaşmayı farklı sonuçlandırabilir. Maden dalının her oynayışta zorunlu olduğunu varsayma.')], relatedPins: [link(warehouse, 'Warehouse investigation', 'Depo soruşturması')], sources: missingSources,
})
add('final-flush', ['gta6-loc-1091668'], {
  summary: t('A separate WAiNK curiosity at NoFlusher Homestead, not a confirmed Final Flush treatment-facility waypoint.', 'NoFlusher Homestead’de ayrı bir WAiNK merak noktası; The Final Flush arıtma tesisi hedefi olduğu doğrulanmış değil.'),
  directions: [t('Scan the homestead’s main building on the Y-shaped island in Wetman Bay for its curiosity entry.', 'Wetman Bay’de Y biçimli adadaki çiftlik evinin ana binasını merak noktası kaydı için tara.')],
  warnings: [t('For Merle’s mission, follow the tracker and current objective instead of choosing a place solely because its name says NoFlusher.', 'Merle’ün görevi için, adında NoFlusher geçtiği için bir yer seçmek yerine takip cihazını ve güncel hedefi izle.')],
  relatedPins: [link(merle, 'The Final Flush meeting', 'The Final Flush buluşması')], sources: flushSources,
})
MYSTERY_GUIDES[alienLab].rewards = [t('Guides report permanent Health, Stamina and Focus improvements after the rescue; no numeric amount is asserted here.', 'Rehberler kurtarma sonunda kalıcı Sağlık, Dayanıklılık ve Focus artışı bildiriyor; burada sayısal miktar verilmiyor.')]
for (const id of [merle, waffles, 'gta6-community-random-event-122']) MYSTERY_GUIDES[id].rewards = [t('Completing The Final Flush grants a permanent maximum-stamina increase.', 'The Final Flush’ı bitirmek azami dayanıklılığı kalıcı artırır.')]
for (const id of MYSTERY_FAMILIES['crab-lab']) MYSTERY_GUIDES[id].rewards = [t('The dock building contains the unique Crabshack VF5; the research safe contains cash and the dock clue.', 'İskele binasında özel Crabshack VF5 bulunur; araştırma kasasında para ve iskele ipucu vardır.')]
MYSTERY_GUIDES['gta6-community-easter-egg-010'].rewards = [t('Cash and the Crowex Ambassador "Breakfast" watch in the safe.', 'Kasada para ve Crowex Ambassador "Breakfast" saat.')]

/** Enrich the existing records; preserve identity, category, coordinates and source confidence. */
export function applyMysteryGuides(markers: GameMarker[]) {
  return markers.map(marker => {
    const guide = MYSTERY_GUIDES[marker.id]
    if (!guide) return marker
    const family = Object.keys(MYSTERY_FAMILIES).find(key => MYSTERY_FAMILIES[key].includes(marker.id))!
    const existing = marker.guide ?? GTA6_SAFEHOUSE_GUIDES[marker.id]
    const unique = <T,>(values: T[]) => [...new Map(values.map(value => [JSON.stringify(value), value])).values()]
    const merged: MarkerGuide = { ...existing, ...guide,
      directions: unique([...(guide.directions ?? []), ...(existing?.directions ?? [])]),
      requirements: unique([...(guide.requirements ?? []), ...(existing?.requirements ?? [])]),
      warnings: unique([...(guide.warnings ?? []), ...(existing?.warnings ?? [])]),
      rewards: unique([...(guide.rewards ?? []), ...(existing?.rewards ?? [])]),
      sources: unique([...(guide.sources ?? []), ...(existing?.sources ?? [])]),
      relatedPins: unique([...(guide.relatedPins ?? []), ...(existing?.relatedPins ?? [])]),
    }
    return { ...marker, guide: merged, reviewedAt: '2026-11-27', description: marker.description || guide.summary?.en || '', descriptionTr: marker.description ? marker.descriptionTr : guide.summary?.tr, tags: [...new Set([...(marker.tags ?? []), family, 'Reviewed secret', 'Gizli görev'])] }
  })
}
