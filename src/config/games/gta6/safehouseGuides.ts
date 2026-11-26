import type { MarkerGuide } from '@/types/game'

/** Factual room/chapter notes from the reviewed public map records; not a claim of current save access. */
export const GTA6_SAFEHOUSE_GUIDES: Record<string, MarkerGuide> = {
  'gta6-community-safehouse-001': {
    summary: { en: 'Jason’s first safehouse, a stilt house in Key Lento.', tr: 'Jason’ın ilk güvenli evi; Key Lento’daki ayaklar üzerinde duran ev.' },
    directions: [{ en: 'Find the waterfront stilt house at the marked Key Lento property.', tr: 'Key Lento’da işaretli arazinin kıyıdaki ayaklı evini bul.' }],
    requirements: [{ en: 'The source associates this home with Chapter 1. Access follows story progress.', tr: 'Kaynak bu evi 1. bölümle ilişkilendiriyor. Kullanım hikâye ilerlemesine bağlı.' }],
  },
  'gta6-community-safehouse-002': {
    summary: { en: 'Boobie’s Bayside apartment, used by Jason and Lucia in Chapter 3.', tr: 'Jason ve Lucia’nın 3. bölümde kullandığı, Boobie’nin Bayside dairesi.' },
    directions: [{ en: 'Look for apartment 201 at Bayside Apartments near the Jack of Hearts.', tr: 'Jack of Hearts yakınındaki Bayside Apartments binasında 201 numaralı daireyi ara.' }],
    requirements: [{ en: 'Story access in Chapter 3; arriving at the building does not unlock the apartment.', tr: '3. bölümde hikâyeyle erişilir; binaya gitmek daireyi açmaz.' }],
  },
  'gta6-community-safehouse-003': {
    summary: { en: 'Jason and Lucia’s Chapter 2 motel safehouse in Port Gellhorn.', tr: 'Port Gellhorn’da Jason ve Lucia’nın 2. bölümdeki motel güvenli evi.' },
    directions: [{ en: 'Go to the Starlet Motel in Port Gellhorn and follow the room assigned by the story.', tr: 'Port Gellhorn’daki Starlet Motel’e git; hikâyede verilen odayı takip et.' }],
    requirements: [{ en: 'The source identifies this as the Chapter 2 home.', tr: 'Kaynak bu konumu 2. bölümdeki ev olarak belirtiyor.' }],
  },
  'gta6-community-safehouse-005': {
    summary: { en: 'The Y Hotel suite associated with Chapter 4.', tr: '4. bölümle bağlantılı Y Hotel süiti.' },
    directions: [{ en: 'At Y Hotel on Vice Beach, go to floor 7 and look for room 701 at the end of the hallway.', tr: 'Vice Beach’teki Y Hotel’de 7. kata çık; koridorun sonundaki 701 numaralı odayı ara.' }],
    requirements: [{ en: 'Story access is associated with Chapter 4 and Valentina.', tr: 'Hikâye erişimi 4. bölüm ve Valentina ile ilişkilendiriliyor.' }],
  },
  'gta6-community-safehouse-006': {
    summary: { en: 'Pegassi Residences, reported as a Chapter 5 safehouse.', tr: '5. bölümdeki güvenli ev olarak bildirilen Pegassi Residences.' },
    requirements: [{ en: 'Chapter 5 story progress is reported. The source does not provide a room or entrance route.', tr: '5. bölüm hikâye ilerlemesi belirtiliyor. Kaynakta oda veya giriş güzergâhı verilmemiş.' }],
  },
}
