import type { Locale } from '@/i18n/locale'
import { CHECKLIST_DETAILS, CHECKLIST_TAILS } from '@/i18n/checklistTr'
import { GTA6_MISSIONS, GTA6_MISSABLES } from '@/i18n/gta6Missions'

function tail(text: string) {
  const time = text.match(/^Complete within (\d{2}:\d{2})$/)
  if (time) return `${time[1]} içinde bitir`
  const head = text.match(/^Kill (\d+) enemies with a headshot$/)
  if (head) return `${head[1]} düşmanı kafa vuruşuyla öldür`
  const accuracy = text.match(/^Finish with a shooting accuracy of at least (\d+)%$/)
  if (accuracy) return `Atış isabetini en az %${accuracy[1]} tut`
  const stealth = text.match(/^Kill (\d+) enemies using stealth attacks$/)
  if (stealth) return `${stealth[1]} düşmanı gizlilik saldırısıyla öldür`
  const riding = text.match(/^Kill (\d+) enemies whilst in a vehicle$/)
  if (riding) return `Araçtayken ${riding[1]} düşman öldür`
  const enemies = text.match(/^Kill (\d+) enemies$/)
  if (enemies) return `${enemies[1]} düşman öldür`
  const yoga = text.match(/^Complete the (\d+)(?:st|nd|rd|th) yoga pose without fault$/)
  if (yoga) return `${yoga[1]}. yoga pozunu hatasız tamamla`
  const kills = text.match(/^Get (\d+) kills$/)
  if (kills) return `${kills[1]} leş al`
  const heads = text.match(/^Get (\d+) headshots$/)
  if (heads) return `${heads[1]} kafa vuruşu yap`
  const vehicles = text.match(/^Destroy (\d+) vehicles$/)
  if (vehicles) return `${vehicles[1]} aracı yok et`
  const tanks = text.match(/^Destroy (\d+) tanks$/)
  if (tanks) return `${tanks[1]} tankı yok et`

  const delivered: Record<string, string> = {
    'Deliver the repo car with minimal damage': 'Geri alınan arabayı en az hasarla teslim et',
    'Deliver the Trashmaster with no damage': 'Trashmaster’ı hasarsız teslim et',
    'Deliver the tow truck with no damage': 'Çekiciyi hasarsız teslim et',
    'Deliver the Z-Type with no damage': 'Z-Type’ı hasarsız teslim et',
    'Deliver the JB 700 with minimal damage': 'JB 700’ü en az hasarla teslim et',
    'Deliver the fire truck with no damage': 'İtfaiye aracını hasarsız teslim et',
    'Deliver the police transporter with no damage': 'Polis nakliye aracını hasarsız teslim et',
  }
  if (delivered[text]) return delivered[text]

  const light: Record<string, string> = {
    'Complete with minimal damage to Lamar’s van': 'Lamar’ın minibüsünü en az hasarla bitir',
    'Complete with minimal damage to the Bison': 'Bison’ı en az hasarla bitir',
    'Complete with minimal damage to health and armor': 'Can ve zırhı en az hasarla bitir',
    'Complete with minimal damage to the JB 700': 'JB 700’ü en az hasarla bitir',
    'Complete with minimal damage to Nigel’s car': 'Nigel’ın arabasını en az hasarla bitir',
  }
  if (light[text]) return light[text]

  const speed: Record<string, string> = {
    'Reach top speed on the Seashark': 'Seashark’ta azami hıza çık',
    'Reach top speed in the Phantom': 'Phantom’da azami hıza çık',
    'Reach top speed in the Trashmaster': 'Trashmaster’da azami hıza çık',
    'Reach top speed on the Sanchez': 'Sanchez’de azami hıza çık',
    'Reach top speed in the JB 700': 'JB 700’de azami hıza çık',
    'Reach top speed in the tow truck': 'Çekicide azami hıza çık',
    'Reach top speed in any car': 'Herhangi bir arabada azami hıza çık',
    'Reach top speed in any vehicle': 'Herhangi bir araçta azami hıza çık',
  }
  if (speed[text]) return speed[text]

  if (text === 'Don’t fall off the bicycle') return 'Bisikletten düşme'
  if (text === 'Don’t fall off the Sanchez during the chase') return 'Kovalama sırasında Sanchez’den düşme'

  return CHECKLIST_TAILS[text] ?? text
}

function gta6Detail(detail: string) {
  const mission = [...Object.values(GTA6_MISSIONS), ...GTA6_MISSABLES].find((row) => row.en === detail)
  if (mission) return mission.tr
  const weight = detail.match(/^Guide weight (\d+)%\. Target: (.+)\. Tick when the in-game 100% line matches\.$/)
  if (weight) {
    const targets: Record<string, string> = {
      'the whole main story': 'ana hikayenin tamamı',
      'every optional mission': 'her isteğe bağlı görev',
      '39 illegal operations': '39 yasa dışı operasyon',
      '22 bank robberies': '22 banka soygunu',
      '7 payday loan jobs': '7 maaş günü kredisi işi',
      '34 smash and grabs': '34 kapkaç',
      '100 stick ups': '100 silahlı soygun',
      '$100,000 narcotics fenced': '100.000 $ uyuşturucu satışı',
      '$100,000 jewelry fenced': '100.000 $ mücevher satışı',
      '$100,000 marked bills fenced': '100.000 $ işaretli banknot satışı',
      '8 vaults': '8 kasa',
      '$200,000 vehicles fenced': '200.000 $ araç satışı',
      '5 Kenton sets': '5 Kenton seti',
      '15 collectible card sets': '15 koleksiyon kartı seti',
      '100 WAiNK scans': '100 WAiNK taraması',
      '33 underwater discoveries': '33 su altı keşfi',
      '30 magazines': '30 dergi',
      '15 meditation spots': '15 meditasyon noktası',
      '100 cocaine flamingos': '100 kokain flamingosu',
      '2 unique playlists': '2 eşsiz çalma listesi',
      '70 discovered styles': '70 keşfedilmiş stil',
      '30 unique races won': '30 kazanılmış eşsiz yarış',
      '10 race challenge golds': '10 yarış mücadelesi altını',
      '42 shooting range golds': '42 atış poligonu altını',
      '4 arcade games': '4 arcade oyunu',
      '5 pool opponents': '5 bilardo rakibi',
      '2 golf locations': '2 golf sahası',
      '90 basketball hoops': '90 basketbol potası',
      '42 drone time trials': '42 drone zaman denemesi',
      '300 stunts': '300 stunt',
      '70 challenges': '70 meydan okuma',
      "15 Bret's target decks": '15 Bret hedef destesi',
      '200 vehicles discovered': '200 keşfedilmiş araç',
      '50 weapons discovered': '50 keşfedilmiş silah',
    }
    return `Rehber ağırlığı %${weight[1]}. Hedef: ${targets[weight[2]] ?? weight[2]}. Oyun içi %100 satırı tutunca işaretle.`
  }
  if (detail.startsWith('Chapter 1 story mission.')) return '1. bölüm hikaye görevi. Ad listede durur. %50’lik hikaye ağırlığı, ana hikaye kutusunu işaretleyince ilerler.'
  if (detail.startsWith('Chapter 2 story mission.')) return '2. bölüm hikaye görevi. Ad listede durur. %50’lik hikaye ağırlığı, ana hikaye kutusunu işaretleyince ilerler.'
  if (detail.startsWith('Named optional mission.')) return 'Adı yayımlanmış isteğe bağlı görev. %6’lık ağırlık, hepsi bitince işaretlenen ayrı kutudadır.'
  if (detail.startsWith('Named illegal operation.')) return 'İlk bölümlerde adı geçen operasyon. %3’lük ağırlık, 39’luk ayrı kutudadır.'
  if (detail.startsWith('Animals discovered.')) return 'Rehber 100 hayvan yazıyor. Tabloda bu satırın ağırlığı görünmediği için yüzdeyi oynatmaz.'
  return null
}

export function checklistDetail(locale: Locale, detail: string) {
  if (locale !== 'tr' || !detail) return detail
  return gta6Detail(detail) ?? CHECKLIST_DETAILS[detail] ?? detail
}

/** Keeps the medal name and translates the instruction after the dash. */
export function checklistObjective(locale: Locale, text: string) {
  if (locale !== 'tr') return text
  const parts = text.split(' — ')
  if (parts.length < 2) return tail(text)
  return `${parts[0]} — ${tail(parts.slice(1).join(' — '))}`
}
