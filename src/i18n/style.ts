import type { Locale } from '@/i18n/locale'
const categories: Record<string, string> = {
  Accessories: 'Aksesuar', Tops: 'Üst giyim', Bottoms: 'Alt giyim', Footwear: 'Ayakkabı', Shoes: 'Ayakkabı', Hair: 'Saç', Makeup: 'Makyaj', Tattoos: 'Dövme', 'One Pieces': 'Tek parça kıyafet', Other: 'Diğer', Piercings: 'Piercing', Grillz: 'Diş aksesuarı', Outfits: 'Kombin',
}
const acquisition: Record<string, [string, string, string, string]> = {
  'wardrobe-only': ['Gardırop ödülü', 'Wardrobe reward', 'Mağazada satılmaz. Ödül veya dünyadan alınan eşya olarak gardıroba eklenir.', 'Added to the wardrobe through rewards or pickups; not sold in stores.'],
  'outfit-pieces': ['Kombinin parçası', 'Outfit piece', 'İlgili hazır kombini satın aldıktan sonra bu parçayı ayrı kullanabilirsin.', 'Buy the corresponding ready-made outfit, then wear this piece separately.'],
  magazines: ['Dergiyle açılır', 'Magazine unlock', 'İlgili dergiyi WAiNK ile tarayarak kuaför seçeneklerinde aç.', 'Scan the corresponding magazine with WAiNK to unlock it at salons.'],
  collectibles: ['Koleksiyon ödülü', 'Collectible reward', 'Koleksiyon bulma ödülü. Gereken koleksiyonun ayrıntısını kaynak kaydından kontrol et.', 'A collectible reward. Check the source entry for the required collection.'],
  salons: ['Kuaför seçeneği', 'Salon option', 'Kuaför menüsünde bulunur; hangi şubede olduğu kaynakta belirtilmemiş.', 'Available through salon menus; the source does not identify a specific branch.'],
  'tattoo-parlors': ['Dövme stüdyosu', 'Tattoo parlor', 'Dövme menüsünde bulunur; hangi stüdyoda olduğu kaynakta belirtilmemiş.', 'Available through tattoo menus; the source does not identify a specific parlor.'],
  'ammu-nation': ['Ammu-Nation', 'Ammu-Nation', 'Giyim mağazası yerine Ammu-Nation üzerinden edinilir.', 'Available at Ammu-Nation.'],
}
export function styleCategory(category: string, locale: Locale) { return locale === 'tr' ? categories[category] ?? category : category }
export function styleAcquisition(key: string, locale: Locale) {
  const row = acquisition[key]
  if (!row) return null
  return { label: row[locale === 'tr' ? 0 : 1], detail: row[locale === 'tr' ? 2 : 3] }
}
