import type { GuideText, MarkerGuide } from '@/types/game'
const text = (en: string, tr: string): GuideText => ({ en, tr })
export const KITTY_SOURCE = 'https://www.pcgamer.com/games/grand-theft-auto/gta-6-kitty-litter-lab-locations/'
export const KITTY_LOCATIONS = [
  ['1097639', 'La Perle', 'East La Perle trailer', 'Doğu La Perle karavanı', 'Northwest gate; right, then left at the white van.', 'Kuzeybatı kapısından gir; beyaz minibüste sağa, ardından sola dön.'],
  ['1097643', 'La Perle', 'West La Perle trailer', 'Batı La Perle karavanı', 'Use the east gate; inspect the final trailer on the right.', 'Doğu kapısından gir; sağdaki son karavanı kontrol et.'],
  ['1097647', 'Decor District', 'Decor District garage', 'Decor District garajı', 'Enter the car park from the south; open the shutter.', 'Otoparka güneyden gir ve kepengi aç.'],
  ['1097641', 'Rockridge', 'Rockridge lockup', 'Rockridge garajı', 'Move the laundry van beside Peterson’s Autoshop to expose the shutter.', 'Peterson’s Autoshop yanındaki çamaşır minibüsünü çekerek kepengi açığa çıkar.'],
  ['1097655', 'Rockridge', 'Central Rockridge lockup', 'Merkez Rockridge garajı', 'Walk around the building’s right side to the brown shutter.', 'Binanın sağından dolaşarak kahverengi kepenge ulaş.'],
  ['1097642', 'Rockridge', 'Rockridge apartment', 'Rockridge dairesi', 'Right-hand stairs from the car park; apartment 5 upstairs.', 'Otoparktaki sağ merdiveni kullan; üst katta 5 numaralı daireyi bul.'],
  ['1097656', 'Rockridge', 'East Rockridge apartment', 'Doğu Rockridge dairesi', 'Find the white ground-floor door beside the apartment block.', 'Apartmanın yan tarafındaki zemin kat beyaz kapısını bul.'],
  ['1097654', 'Crosstown', 'Central Crosstown lockup', 'Merkez Crosstown garajı', 'The guarded brown shutter is behind the tattoo parlour.', 'Dövme dükkânının arkasındaki korumalı kahverengi kepengi bul.'],
  ['1097640', 'Crosstown', 'Crosstown apartment', 'Crosstown dairesi', 'Find apartment 103 near the laundry van; floor labels differ between guides.', 'Çamaşır minibüsü yakınındaki 103 numaralı daireyi bul; rehberlerin kat tarifleri farklı.'],
  ['1097657', 'Crosstown', 'North Crosstown apartment', 'Kuzey Crosstown dairesi', 'Use the car-park stairs; take the far-right upper white door.', 'Otopark merdivenlerinden çık; üst kattaki en sağ beyaz kapıya git.'],
  ['1097658', 'Crosstown', 'North Crosstown lockup', 'Kuzey Crosstown garajı', 'The laundry van blocks the shutter.', 'Çamaşır minibüsü kepengin önünde duruyor.'],
  ['1097651', 'Tequesta', 'Tequesta apartment', 'Tequesta dairesi', 'Of the two stairways beside the van, take the right one.', 'Minibüs yanındaki iki merdivenden sağdakini kullan.'],
  ['1097653', 'VCIA', 'Vice-Dale trailer', 'Vice-Dale karavanı', 'Follow the trailer-park path; enter the white trailer through its window.', 'Karavan parkındaki yolu izle; beyaz karavana pencereden gir.'],
  ['1097649', 'Salton', 'Salton apartment', 'Salton dairesi', 'Use the rear dumpster to reach the open window.', 'Arkadaki çöp konteynerine çıkarak açık pencereye ulaş.'],
  ['1097650', 'Salton', 'Salton lockup', 'Salton garajı', 'Cross the fence; the guarded shutter is beside the laundry van.', 'Çiti aş; minibüsün yanındaki korumalı kepenge git.'],
  ['1097648', 'Little Cuba', 'Little Cuba apartment', 'Little Cuba dairesi', 'Check the second door on the left near the laundry van.', 'Çamaşır minibüsü yakınında soldaki ikinci kapıyı kontrol et.'],
  ['1097644', 'Balsero', 'Balsero trailer', 'Balsero karavanı', 'Enter from the southeast; look left for purple smoke.', 'Güneydoğudan gir; solda mor duman çıkan karavanı bul.'],
  ['1097645', 'Balsero', 'South Balsero lockup', 'Güney Balsero garajı', 'Pass the guarded gate and inspect the lab beside the cat picture.', 'Korumalı kapıyı geç; kedi resminin yanındaki laboratuvarı kontrol et.'],
  ['1097646', 'Balsero', 'North Balsero lockup', 'Kuzey Balsero garajı', 'The keypad clue is on the billboard: 1999.', 'Tuş takımı ipucu reklam panosunda: 1999.'],
  ['1097652', 'Vice City', 'Vice City lockup', 'Vice City garajı', 'Past the van, find the yellow shutter beside the cat picture.', 'Minibüsü geç; kedi resminin yanındaki sarı kepengi bul.'],
].map(([id, region, en, tr, directionEn, directionTr]) => ({ id: `gta6-loc-${id}`, region, title: { en, tr }, directions: text(directionEn, directionTr) }))

export const REVIEWED_GUIDES: Record<string, MarkerGuide> = Object.fromEntries(KITTY_LOCATIONS.map(location => [location.id, {
  summary: text(`Kitty Litter lab in ${location.region}.`, `${location.region} bölgesindeki Kitty Litter laboratuvarı.`),
  directions: [location.directions],
  requirements: [text('Start the lab hunt through Tyrone’s mission chain. Destroying a lab is separate from simply discovering its location.', 'Laboratuvar avını Tyrone’ın görev zincirinden başlat. Konumu keşfetmek ile laboratuvarı yok etmek farklıdır.')],
  sources: [{ title: 'GTABase · Kitty Litter locations', url: 'https://www.gtabase.com/gta-6/map/?feature=kitty-litter-lab' }, { title: 'PC Gamer · mission progression', url: KITTY_SOURCE }],
}]))
REVIEWED_GUIDES['gta6-loc-1091986'] = {
  summary: text('A guarded radar-base lab with a safe and reported experimental equipment.', 'Korunan radar üssündeki laboratuvar; kasa ve bildirilen deneysel ekipmanlar bulunuyor.'),
  directions: [text('Watson Bay’s north side: approach Mill Station Radar Base and check the upper roof route.', 'Watson Bay’in kuzeyindeki Mill Station Radar Base’e git; üst kattaki çatı yolunu kontrol et.'), text('The reported syringe is in a glass laboratory room; the Super400 and safe are separate pickups.', 'Bildirilen şırınga cam laboratuvar odasında; Super400 ve kasa ayrı buluntulardır.')],
  warnings: [text('Player reports describe a permanent health increase for the character who uses the syringe. This effect and repeat availability have not been independently verified here.', 'Oyuncu bildirimleri, şırıngayı kullanan karakterin azami sağlığının kalıcı arttığını söylüyor. Etki ve yeniden alınabilirlik burada bağımsız doğrulanmadı.')],
  sources: [{ title: 'Player reports · Mill Station lab', url: 'https://gta6map.city/secrets/grassrivers-secret-lab-permanent-health-syringe/' }],
}
