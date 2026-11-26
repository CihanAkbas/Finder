import type { Locale } from '@/i18n/locale'
import { communityCategoryCopy } from '@/config/games/gta6/community'

const categories: Record<string, { name?: string; description?: string }> = {
  "finder-help": {
    "name": "İpuçları ve hikaye",
    "description": "Yayımlanmış noktalar, ipucu ve görev notuyla"
  },
  "finder-tips": {
    "name": "İpuçları"
  },
  "finder-story": {
    "name": "Hikaye yardımı"
  },
  "mg-27128": {
    "name": "İlgi noktaları",
    "description": "Konumlar"
  },
  "mg-29021": {
    "name": "Bankamatik",
    "description": "223 işaret."
  },
  "mg-29030": {
    "name": "Spor salonu",
    "description": "9 işaret."
  },
  "mg-29031": {
    "name": "Kulüp",
    "description": "5 işaret."
  },
  "mg-27129": {
    "name": "Soygunlar",
    "description": "Konumlar"
  },
  "mg-29022": {
    "name": "Banka",
    "description": "14 işaret."
  },
  "mg-29023": {
    "name": "Büyük banka",
    "description": "8 işaret."
  },
  "mg-29024": {
    "name": "Maaş günü kredisi",
    "description": "7 işaret."
  },
  "mg-29025": {
    "name": "Alt seviye kuyumcu",
    "description": "12 işaret."
  },
  "mg-29026": {
    "name": "Üst seviye kuyumcu",
    "description": "8 işaret."
  },
  "mg-29027": {
    "name": "Rehin dükkânı",
    "description": "15 işaret."
  },
  "mg-29037": {
    "name": "Çekilebilir bankamatik",
    "description": "127 işaret."
  },
  "mg-29051": {
    "name": "Market",
    "description": "72 işaret."
  },
  "mg-29052": {
    "name": "Fast food",
    "description": "21 işaret."
  },
  "mg-29054": {
    "name": "İçki dükkânı",
    "description": "14 işaret."
  },
  "mg-29082": {
    "name": "Kişi",
    "description": "10 işaret."
  },
  "mg-29083": {
    "name": "Kasa",
    "description": "40 işaret."
  },
  "mg-27130": {
    "name": "Araçlar",
    "description": "Konumlar"
  },
  "mg-29032": {
    "name": "Modifiye",
    "description": "14 işaret."
  },
  "mg-29033": {
    "name": "Benzin istasyonu",
    "description": "57 işaret."
  },
  "mg-29034": {
    "name": "Oto yıkama",
    "description": "6 işaret."
  },
  "mg-29035": {
    "name": "Elektrik şarjı",
    "description": "126 işaret."
  },
  "mg-29036": {
    "name": "Otobüs durağı",
    "description": "287 işaret."
  },
  "mg-29038": {
    "name": "Tren istasyonu",
    "description": "25 işaret."
  },
  "mg-29039": {
    "name": "Feribot iskelesi",
    "description": "2 işaret."
  },
  "mg-29040": {
    "name": "Kiralık araç",
    "description": "3 işaret."
  },
  "mg-29062": {
    "name": "Satın alınabilir garaj",
    "description": "17 işaret."
  },
  "mg-29063": {
    "name": "Garaj",
    "description": "4 işaret."
  },
  "mg-29095": {
    "name": "Özel araç",
    "description": "85 işaret."
  },
  "mg-29096": {
    "name": "Randy aracı",
    "description": "9 işaret."
  },
  "mg-29097": {
    "name": "Moses aracı",
    "description": "7 işaret."
  },
  "mg-27131": {
    "name": "Stil",
    "description": "Konumlar"
  },
  "mg-29042": {
    "name": "Günlük ve sokak",
    "description": "17 işaret."
  },
  "mg-29043": {
    "name": "Spor giyim",
    "description": "11 işaret."
  },
  "mg-29044": {
    "name": "Resmi",
    "description": "10 işaret."
  },
  "mg-29045": {
    "name": "Hediyelik ve mayo",
    "description": "24 işaret."
  },
  "mg-29046": {
    "name": "İkinci el",
    "description": "5 işaret."
  },
  "mg-29047": {
    "name": "Ayakkabı",
    "description": "17 işaret."
  },
  "mg-29048": {
    "name": "Saç ve güzellik",
    "description": "18 işaret."
  },
  "mg-29049": {
    "name": "Dövme",
    "description": "11 işaret."
  },
  "mg-29050": {
    "name": "Elektronik",
    "description": "15 işaret."
  },
  "mg-27132": {
    "name": "Yiyecek ve içecek",
    "description": "Konumlar"
  },
  "mg-29053": {
    "name": "Kafe ve paket",
    "description": "89 işaret."
  },
  "mg-29056": {
    "name": "Sokak yemeği",
    "description": "119 işaret."
  },
  "mg-27134": {
    "name": "WAiNK konumları",
    "description": "Koleksiyonlar"
  },
  "mg-29065": {
    "name": "Simge yer",
    "description": "31 işaret."
  },
  "mg-29066": {
    "name": "Tuhaflık",
    "description": "35 işaret."
  },
  "mg-29067": {
    "name": "Heykel",
    "description": "23 işaret."
  },
  "mg-27137": {
    "name": "Keşif",
    "description": "Koleksiyonlar"
  },
  "mg-29093": {
    "name": "Kitap takası",
    "description": "7 işaret."
  },
  "mg-29120": {
    "name": "Dergi",
    "description": "29 işaret."
  },
  "mg-29143": {
    "name": "Eşsiz çalma listesi",
    "description": "7 işaret."
  },
  "mg-29144": {
    "name": "1010 muralı",
    "description": "5 işaret."
  },
  "mg-27138": {
    "name": "Koleksiyon kartları",
    "description": "Koleksiyonlar"
  },
  "mg-27123": {
    "name": "Spor",
    "description": "Etkinlikler"
  },
  "mg-29011": {
    "name": "Basketbol potası",
    "description": "100 işaret."
  },
  "mg-29013": {
    "name": "Golf sahası",
    "description": "2 işaret."
  },
  "mg-29015": {
    "name": "Mini golf",
    "description": "3 işaret."
  },
  "mg-29061": {
    "name": "Bilardo masası",
    "description": "17 işaret."
  },
  "mg-27125": {
    "name": "Etkinlikler",
    "description": "Etkinlikler"
  },
  "mg-29017": {
    "name": "Atış poligonu",
    "description": "15 işaret."
  },
  "mg-29028": {
    "name": "Arcade makinesi",
    "description": "31 işaret."
  },
  "mg-29099": {
    "name": "Balık noktası",
    "description": "35 işaret."
  },
  "mg-27127": {
    "name": "Stuntlar",
    "description": "Etkinlikler"
  },
  "mg-29019": {
    "name": "Stunt atlayışı",
    "description": "130 işaret."
  },
  "mg-29057": {
    "name": "Base jump",
    "description": "25 işaret."
  },
  "mg-29059": {
    "name": "Bıçak uçuşu",
    "description": "40 işaret."
  },
  "mg-29060": {
    "name": "Köprü altı",
    "description": "202 işaret."
  },
  "mg-27136": {
    "name": "Yarış",
    "description": "Etkinlikler"
  },
  "mg-29084": {
    "name": "Yarış tanıtımı",
    "description": "1 işaret."
  },
  "mg-29085": {
    "name": "Yarış mücadelesi",
    "description": "13 işaret."
  },
  "mg-29142": {
    "name": "Top Fun drone",
    "description": "42 işaret."
  },
  "mg-27140": {
    "name": "Yasa dışı operasyonlar",
    "description": "Etkinlikler"
  }
}

const titles: Record<string, string> = {
  "Points of Interest": "İlgi noktaları",
  "ATM": "Bankamatik",
  "Gym": "Spor salonu",
  "Club": "Kulüp",
  "Robberies": "Soygunlar",
  "Bank": "Banka",
  "Big Bank": "Büyük banka",
  "Payday Loans": "Maaş günü kredisi",
  "Low-End Jewelry Store": "Alt seviye kuyumcu",
  "High-End Jewelry Store": "Üst seviye kuyumcu",
  "Pawn Shop": "Rehin dükkânı",
  "ATM (Towable)": "Çekilebilir bankamatik",
  "Convenience Store": "Market",
  "Fast Food": "Fast food",
  "Liquor Store": "İçki dükkânı",
  "Contact": "Kişi",
  "Safe": "Kasa",
  "Vehicles": "Araçlar",
  "Mod Shop": "Modifiye",
  "Gas Station": "Benzin istasyonu",
  "Car Wash": "Oto yıkama",
  "Electric Charger": "Elektrik şarjı",
  "Bus Stop": "Otobüs durağı",
  "Train Station": "Tren istasyonu",
  "Ferry Terminal": "Feribot iskelesi",
  "Rental Vehicle": "Kiralık araç",
  "Purchasable Garage": "Satın alınabilir garaj",
  "Garage": "Garaj",
  "Standout Vehicle": "Özel araç",
  "Randy Vehicle": "Randy aracı",
  "Moses Vehicle": "Moses aracı",
  "Style": "Stil",
  "Casual & Street": "Günlük ve sokak",
  "Sportswear": "Spor giyim",
  "Formal": "Resmi",
  "Souvenir & Swimwear": "Hediyelik ve mayo",
  "Thrift": "İkinci el",
  "Footwear": "Ayakkabı",
  "Hair & Beauty": "Saç ve güzellik",
  "Tattoos": "Dövme",
  "Electronics": "Elektronik",
  "Food & Drink": "Yiyecek ve içecek",
  "Cafes & Takeout": "Kafe ve paket",
  "Street Food": "Sokak yemeği",
  "WAiNK Locations": "WAiNK konumları",
  "Landmark": "Simge yer",
  "Curiosity": "Tuhaflık",
  "Sculpture": "Heykel",
  "Exploration": "Keşif",
  "Book Swap": "Kitap takası",
  "Magazine": "Dergi",
  "Unique Playlist": "Eşsiz çalma listesi",
  "1010 Mural": "1010 muralı",
  "Collectible Cards": "Koleksiyon kartları",
  "Sports": "Spor",
  "Basketball Hoop": "Basketbol potası",
  "Golf Course": "Golf sahası",
  "Mini-Golf Course": "Mini golf",
  "Pool Table": "Bilardo masası",
  "Activities": "Etkinlikler",
  "Shooting Range": "Atış poligonu",
  "Arcade Machine": "Arcade makinesi",
  "Fishing Hotspot": "Balık noktası",
  "Stunts": "Stuntlar",
  "Stunt Jump": "Stunt atlayışı",
  "Base Jump": "Base jump",
  "Knife Flight": "Bıçak uçuşu",
  "Under the Bridge": "Köprü altı",
  "Racing": "Yarış",
  "Racing Introduction": "Yarış tanıtımı",
  "Racing Challenge": "Yarış mücadelesi",
  "Top Fun Drones": "Top Fun drone",
  "Illegal Operations": "Yasa dışı operasyonlar",
  "Buck Me · Key Lento Fleeca": "Buck Me · Key Lento Fleeca",
  "Hey Arnold · Crastenburg": "Hey Arnold · Crastenburg",
  "Day Release · Rusty Anchor": "Day Release · Rusty Anchor",
  "Thrillbillies · Mud Club": "Thrillbillies · Çamur kulübü",
  "Afternoon Delight · Delights": "Afternoon Delight · Delights",
  "Checking Out · Starlet Motel": "Checking Out · Starlet Motel",
  "Hamlet Traders · Ammu-Nation": "Hamlet Traders · Ammu-Nation",
  "Pete · Aerial Drop-offs": "Pete · Hava teslimatı",
  "Animal Crackers · Wetlands Circuit": "Animal Crackers · Sulak alan turu"
}

export function gta6CategoryCopy(locale: Locale, id: string) {
  if (locale !== 'tr') return undefined
  return communityCategoryCopy(id) ?? categories[id]
}

export function gta6PinTitle(locale: Locale, title: string) {
  if (locale !== 'tr') return title
  return titles[title] ?? title
}

export function gta6PinDescription(locale: Locale, description: string) {
  const [head, ...rest] = description.split('\n')
  const parts = head.split(' · ')
  const header = parts[0] === 'Leonida map' && locale === 'tr'
    ? `Leonida haritası · ${parts[1] ?? ''} · ${titles[parts[2]] ?? parts[2] ?? ''}${parts.length > 3 ? ` · ${parts.slice(3).join(' · ')}` : ''}`
    : head
  const body = rest.join('\n').trim()
  if (!body) return header
  return `${header}\n${locale === 'tr' ? translatePinBody(body) : body}`
}

function translatePinBody(text: string) {
  return text
    .replace(/^Location:\s*/i, 'Konum: ')
    .replace(/The hoops is/g, 'Pota')
    .replace(/The hoop is/g, 'Pota')
    .replace(/The basketball is/g, 'Top')
    .replace(/^Route:\s*/gm, 'Hat: ')
    .replace(/^Features:\s*/gm, 'Özellikler: ')
    .replace(/^Security:\s*/gm, 'Güvenlik: ')
    .replace(/Security:/g, 'Güvenlik:')
    .replace(/Take Value:/g, 'Götürü değeri:')
    .replace(/^Style:\s*/gm, 'Stil: ')
    .replace(/^Inventory:\s*/gm, 'Stok: ')
    .replace(/^Type:\s*/gm, 'Tür: ')
    .replace(/^Cost:\s*/gm, 'Ücret: ')
    .replace(/^Price:\s*/gm, 'Fiyat: ')
    .replace(/Membership Cost:/g, 'Üyelik:')
    .replace(/^Parking Spots:\s*/gm, 'Park yeri: ')
    .replace(/^Specialty:\s*/gm, 'Uzmanlık: ')
    .replace(/\bLow\b/g, 'Düşük')
    .replace(/\bMedium\b/g, 'Orta')
    .replace(/\bHigh\b/g, 'Yüksek')
    .replace(/Changing Room/g, 'Soyunma odası')
    .replace(/Pool Table/g, 'Bilardo masası')
    .replace(/Arcade Cabinet/g, 'Arcade kabini')
    .replace(/Weapon Locker/g, 'Silah dolabı')
    .replace(/Nail Tech/g, 'Tırnak')
    .replace(/Makeup/g, 'Makyaj')
    .replace(/Everyday - Standard/g, 'Günlük, standart')
    .replace(/Pawn - Standard/g, 'Rehin, standart')
    .replace(/\bFood\b/g, 'Yemek')
    .replace(/\bCasual\b/g, 'Günlük')
    .replace(/\bSouvenir\b/g, 'Hediyelik')
    .replace(/\bSportswear\b/g, 'Spor giyim')
    .replace(/\bFormal\b/g, 'Resmi')
    .replace(/\bStreetwear\b/g, 'Sokak')
    .replace(/Beauty Salon/g, 'Güzellik salonu')
}

const HEAT_GROUPS: Record<string, string> = {
  'Animals - Birds': 'Hayvanlar · Kuşlar',
  'Animals - Hunting': 'Hayvanlar · Av',
  'Animals - Fishing': 'Hayvanlar · Balık',
  'Animals - Cats & Dogs': 'Hayvanlar · Kedi ve köpek',
  'Animals - Mammals': 'Hayvanlar · Memeliler',
  'Animals - Aquatic': 'Hayvanlar · Su',
  'Animals - Reptiles & Amphibians': 'Hayvanlar · Sürüngen ve iki yaşamlı',
  'Animals - Other': 'Hayvanlar · Diğer',
  Boats: 'Tekneler',
  Trailers: 'Karavanlar',
  'Cars - Sedan': 'Arabalar · Sedan',
  'Cars - Pickup': 'Arabalar · Pikap',
  'Cars - Muscle': 'Arabalar · Muscle',
  'Cars - Coupe': 'Arabalar · Coupe',
  'Cars - Sport': 'Arabalar · Spor',
  'Cars - SUV': 'Arabalar · SUV',
  'Cars - Off Road': 'Arabalar · Arazi',
  'Cars - Classic': 'Arabalar · Klasik',
  'Cars - Sport Classic': 'Arabalar · Klasik spor',
  'Cars - Super': 'Arabalar · Süper',
  'Cars - Compact': 'Arabalar · Kompakt',
  'Cars - Convertible': 'Arabalar · Üstü açık',
  'Cars - Custom': 'Arabalar · Özel',
  'Cars - Electric': 'Arabalar · Elektrik',
  'Cars - Hyper': 'Arabalar · Hyper',
  'Cars - Luxury': 'Arabalar · Lüks',
  Motorbikes: 'Motosikletler',
  Vans: 'Minibüsler',
  Trucks: 'Kamyonlar',
  Planes: 'Uçaklar',
  Bicycles: 'Bisikletler',
  Helicopters: 'Helikopterler',
  Industrial: 'Endüstriyel',
  Utility: 'Hizmet',
  Law: 'Kolluk',
  Bus: 'Otobüs',
  Drones: 'Drone',
  Quadbikes: 'ATV',
}

export function heatmapGroup(locale: Locale, label: string) {
  if (locale !== 'tr') return label
  return HEAT_GROUPS[label] ?? label
}
