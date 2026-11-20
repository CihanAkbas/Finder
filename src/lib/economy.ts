import gta5Businesses from '@/config/games/gta5/businesses.json'
import gta5Heists from '@/config/games/gta5/heists.json'
import type { Business, Heist } from '@/store/slice'

export type MoneyMethod = {
  id: string
  name: string
  style: 'Active' | 'Passive'
  noteTr?: string
  nameTr?: string
  setupMinutes: number
  hourly: number
  note: string
}

const businesses = gta5Businesses as Business[]
const heists = gta5Heists as Heist[]

function business(id: string) {
  const row = businesses.find((item) => item.id === id)
  if (!row) throw new Error(id)
  return row
}

function heist(id: string) {
  const row = heists.find((item) => item.id === id)
  if (!row) throw new Error(id)
  return row
}

function feeRate(row: Heist) {
  return row.fees.reduce((sum, fee) => sum + (fee.rate ?? 0), 0)
}

function net(gross: number, row: Heist) {
  const flat = row.fees.reduce((sum, fee) => sum + (fee.amount ?? 0), 0)
  return Math.round(gross * (1 - feeRate(row)) - flat)
}

function hourly(amount: number, minutes: number) {
  return Math.round(amount / (minutes / 60))
}

/** Community ranking from the catalog payouts and a stated setup time. Not a live Rockstar feed. */
export function moneyRanking(): MoneyMethod[] {
  const cayo = heist('cayo')
  const cayoGross = 400000 + 364500
  const casino = heist('casino')
  const gold = casino.targets.find((target) => target.id === 'gold')?.value ?? 0
  const nightclub = business('nightclub')
  const bunker = business('bunker')
  const acid = business('acid')

  const rows: MoneyMethod[] = [
    {
      id: 'cayo',
      name: 'Cayo Perico',
      style: 'Active',
      setupMinutes: 75,
      hourly: hourly(net(cayoGross, cayo), 75),
      note: 'Solo tequila plus one full coke bag, after Pavel and fencing. About 75 minutes of scope-out and finale.',
      noteTr: 'Tek başına tekila ve bir tam kokain çantası, Pavel ve kaçakçılık kesintisinden sonra. Keşif ve final yaklaşık 75 dakika.',
    },
    {
      id: 'casino',
      name: 'Casino Heist',
      nameTr: 'Kumarhane soygunu',
      style: 'Active',
      setupMinutes: 120,
      hourly: hourly(net(gold, casino), 120),
      note: 'Gold target after Lester’s cut and the buyer. About two hours of prep and the finale.',
      noteTr: 'Lester’ın payı ve alıcıdan sonra altın hedef. Hazırlık ve final yaklaşık iki saat.',
    },
    {
      id: 'payphone',
      name: 'Payphone Hits',
      nameTr: 'Payphone vuruşları',
      style: 'Active',
      setupMinutes: 20,
      hourly: 85_000 * 3,
      note: 'Community figure: $85,000 a hit, about three hits in an hour once the Agency is owned. The cooldown stops a continuous chain.',
      noteTr: 'Topluluk rakamı: vuruş başına 85.000 $, Agency alındıktan sonra saatte yaklaşık üç vuruş. Bekleme süresi kesintisiz zinciri durdurur.',
    },
    {
      id: 'agency',
      name: 'Agency contracts',
      nameTr: 'Agency sözleşmeleri',
      style: 'Active',
      setupMinutes: 10,
      hourly: 300_000,
      note: 'Community figure: security contracts around $40,000 and about eight minutes each. Payphone hits are listed separately.',
      noteTr: 'Topluluk rakamı: güvenlik sözleşmeleri yaklaşık 40.000 $ ve bir tanesi yaklaşık sekiz dakika. Payphone vuruşları ayrı listelenir.',
    },
    {
      id: 'acid',
      name: 'Acid Lab',
      style: 'Passive',
      setupMinutes: Math.round(acid.hoursToFill * 60),
      hourly: Math.round(acid.maxValue / acid.hoursToFill),
      note: 'Full upgraded lab from the business catalog, before a lobby bonus. The product accrues while you do other work.',
      noteTr: 'İşletme kataloğundaki yükseltilmiş laboratuvar, lobi bonusu öncesi. Ürün sen başka iş yaparken birikir.',
    },
    {
      id: 'bunker',
      name: 'Bunker',
      style: 'Passive',
      setupMinutes: Math.round(bunker.hoursToFill * 60),
      hourly: Math.round(bunker.maxValue / bunker.hoursToFill),
      note: 'Staff and equipment upgrades, one full sell from the business catalog. Research is not included.',
      noteTr: 'Personel ve ekipman yükseltmeleri, katalogdaki bir tam satış. Araştırma dahil değildir.',
    },
    {
      id: 'nightclub',
      name: 'Nightclub',
      nameTr: 'Gece kulübü',
      style: 'Passive',
      setupMinutes: Math.round(nightclub.hoursToFill * 60),
      hourly: Math.round(nightclub.maxValue / nightclub.hoursToFill),
      note: 'The practical mid warehouse from the business catalog, not every good filled. Technicians keep working after you leave.',
      noteTr: 'Katalogdaki pratik orta depo; her mal dolu değil. Teknisyenler sen çıktıktan sonra da çalışır.',
    },
  ]
  return rows.sort((a, b) => b.hourly - a.hourly)
}
