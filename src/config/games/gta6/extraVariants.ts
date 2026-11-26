import type { GameMarker, GuideText, MarkerGuide } from '@/types/game'
import { communityToMap } from '@/lib/communityProjection'

const text = (en: string, tr: string): GuideText => ({ en, tr })
function variant(id: string, title: string, x: number, y: number, slug: string, guide: MarkerGuide): GameMarker {
  const sourceUrl = `https://www.gtabase.com/gta-6/vehicles/${slug}`
  return { id: `gta6-community-standout-vehicle-${id}`, title, category: 'mg-29095', ...communityToMap(x, y),
    description: '', tags: ['Standout Vehicle', 'Rare vehicle', 'Nadir araç', 'Özel araç'], source: 'approximate', sourceUrl, reviewedAt: '2026-11-26',
    guide: { ...guide, sources: [...(guide.sources ?? []), { title: `GTABase · ${title}`, url: sourceUrl }] } }
}

/** Six individually reviewed variants; raw map record IDs and coordinate frame are retained. */
export const GTA6_EXTRA_VARIANTS: GameMarker[] = [
  variant('107', 'Invetero Spiderweb Coquette', -1869, -5340, 'spiderweb-coquette', {
    summary: text('A custom Coquette from the Retro standout set.', 'Retro özel araç setinden, özel görünümlü bir Coquette.'),
    directions: [text('In Key Lento, find the house with the downstairs garage.', 'Key Lento’da alt katında garaj bulunan evi bul.'), text('Use the outside stairs to reach the upper floor and inspect the photos for the garage-door code.', 'Dış merdivenle üst kata çık; garaj kapısının kodu için fotoğrafları incele.'), text('Return to the garage at the lower level and use the code from your game.', 'Alt kattaki garaja dön ve kendi oyununda bulduğun kodu kullan.')],
    requirements: [text('Garage access uses the code clue upstairs. A universal fixed code is not asserted here.', 'Garaj erişimi üst kattaki kod ipucuna bağlı. Burada evrensel sabit kod verilmiyor.')],
  }),
  variant('112', "Pfister Vanessa's Growler", -980, 1376, 'vanessas-growler', {
    summary: text('Vanessa’s pink Growler, associated with a Rockridge lockup and garage reward.', 'Rockridge’deki garaj ödülüyle bağlantılı Vanessa’nın pembe Growler’ı.'),
    directions: [text('The car is inside the Rockridge lockup at Del Rio Boulevard.', 'Araç, Del Rio Boulevard üzerindeki Rockridge garajının içinde.'), text('Follow Vanessa’s laptop messages at the Bayside apartment for the garage access clue.', 'Garaja giriş ipucu için Bayside apartmanında Vanessa’nın dizüstü bilgisayarındaki mesajları takip et.')],
    requirements: [text('The map’s garage record reports Chapter 3 and the laptop puzzle. The vehicle page separately lists advanced vehicle security; a vehicle key is not the garage-door code.', 'Haritadaki garaj kaydı 3. bölümü ve dizüstü bilgisayar bulmacasını belirtiyor. Araç sayfası ayrıca gelişmiş araç güvenliği listeliyor; araç anahtarı, garaj kapısı kodu değildir.')],
    sources: [{ title: 'GTABase · Del Rio garage record', url: 'https://www.gtabase.com/gta-6/map/' }],
  }),
  variant('116', 'Annis Drifter Elegy', -6740, 2499, 'drifter-elegy', {
    summary: text('A 1990 Elegy variant prepared for drifting, from the Street Racer set.', 'Street Racer setinden, drift için hazırlanmış 1990 Elegy varyantı.'),
    directions: [text('Look inside a garage at Gellhorn International Raceway. The vehicle is inside, not on the racing line.', 'Gellhorn International Raceway’deki garajın içine bak. Araç pist çizgisinde değil, garajda.')],
    warnings: [text('The source says a Key Cloner may be needed; it does not confirm a mandatory tool for this individual car.', 'Kaynak, Key Cloner gerekebileceğini söylüyor; bu araç için kesin bir alet zorunluluğu doğrulamıyor.')],
  }),
  variant('130', 'Progen Seaspray Emerus', -7432, 603, 'seaspray-emerus', {
    summary: text('A race-prepared Emerus with a unique Stock Car livery.', 'Stock Car setinden, özel yarış kaplamalı ve yarışa hazırlanmış Emerus.'),
    directions: [text('Find the garage at the marked Capri property and look inside it.', 'Capri’deki işaretli arazinin garajını bul ve içine bak.')],
    requirements: [text('The vehicle page explicitly lists keyless access: Key Cloner required. It unlocks in Chapter 3 during Clonin’ Keys, Makin’ Gs.', 'Araç sayfası anahtarsız erişimi açıkça belirtiyor: Key Cloner gerekli. 3. bölümde Clonin’ Keys, Makin’ Gs görevi sırasında açılır.')],
    warnings: [text('An advanced tracker is reported. Cloning the key does not remove the tracker.', 'Gelişmiş takip cihazı bildiriliyor. Anahtarı klonlamak takip cihazını kaldırmaz.')],
    sources: [{ title: 'GTABase · Key Cloner unlock', url: 'https://www.gtabase.com/gta-6/articles/how-to-get-key-cloner-in-gta-6-to-steal-keyless-cars' }],
  }),
  variant('088', 'Declasse Twinstripe Vigero', -3229, -6552, 'twinstripe-vigero', {
    summary: text('A modified Vigero ZX Convertible from the Street Racer standout set.', 'Street Racer özel araç setinden, değiştirilmiş Vigero ZX Convertible.'),
    directions: [text('Check outside Brian’s Isla Tropical private club in Key Lento.', 'Key Lento’da Brian’ın Isla Tropical özel kulübünün dışına bak.')],
    warnings: [text('Modern security is listed with a possible Key Cloner requirement. Inspect the individual car before planning the theft.', 'Modern güvenlik ve olası Key Cloner gereksinimi listeleniyor. Çalmayı planlamadan önce aracı incele.')],
  }),
  variant('098', 'Imponte Turbo Ruiner', -2227, -5827, 'turbo-ruiner', {
    summary: text('A 1982 Ruiner with a supercharger and oversized rear wheels, from the Hot Rods set.', 'Hot Rods setinden, kompresörlü ve büyük arka tekerlekli 1982 Ruiner.'),
    directions: [text('Look in the yard at the marked Key Lento property.', 'Key Lento’daki işaretli evin bahçesine bak.')],
    warnings: [text('The source does not specify security or a chapter unlock for this car.', 'Kaynak, bu aracın güvenliğini veya açıldığı bölümü belirtmiyor.')],
  }),
]

/** Source refreshes may reintroduce a record; replace by ID instead of duplicating it. */
export function addReviewedVariants(markers: GameMarker[]) {
  const variants = new Map(GTA6_EXTRA_VARIANTS.map((marker) => [marker.id, marker]))
  return [...markers.filter((marker) => !variants.has(marker.id)), ...variants.values()]
}
