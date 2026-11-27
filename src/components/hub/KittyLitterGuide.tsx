'use client'
import Link from 'next/link'
import { KITTY_LOCATIONS, KITTY_SOURCE } from '@/config/games/gta6/reviewedGuides'
import { getGame } from '@/config/games'
import { useCompanionStore } from '@/store/useCompanionStore'
import { useI18n } from '@/i18n/provider'
export function KittyLitterGuide() {
  const { locale } = useI18n(), tr = locale === 'tr'
  const foundIds = useCompanionStore(state => state.byGame.gta6?.found)
  const found = new Set(foundIds ?? [])
  const done = KITTY_LOCATIONS.filter(location => found.has(location.id)).length
  const next = KITTY_LOCATIONS.find(location => !found.has(location.id))
  const game = getGame('gta6')!
  const groups = [...new Set(KITTY_LOCATIONS.map(location => location.region))]
  return <div className="space-y-4">
    <section className="rounded-xl border border-white/10 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3"><h2 className="font-display text-2xl">Kitty Litter</h2><span className="font-mono text-sm text-emerald-300">{done} / {KITTY_LOCATIONS.length}</span></div>
      <p className="mt-2 text-sm leading-6 text-slate-300">{tr ? 'Tyrone’ın görev zincirinden laboratuvar avını aç. Minibüs ve bacadaki duman yerini bulmana yardım eder. Laboratuvarı temizledikten sonra işaretle.' : 'Unlock the lab hunt through Tyrone. Look for the laundry van and smoking chimney; mark a lab after clearing it.'}</p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-400">
        <li>{tr ? 'Tyrone ile görevleri ilerlet; ilk La Perle laboratuvarından başla.' : 'Progress Tyrone’s jobs; start at the first La Perle lab.'}</li>
        <li>{tr ? 'Bölgeler arasında geri dönüşü azaltmak için aşağıdaki sırayı kullanabilirsin. Bu zorunlu hikâye sırası değildir.' : 'The regional order below is a suggested travel order, not a mandatory story sequence.'}</li>
        <li>{tr ? 'Rehbere göre 15 laboratuvardan sonra Tyrone’ın aramasını takip et; final Spin On This görevine bağlıdır.' : 'The guide reports a Tyrone call after 15 labs and a finale tied to Spin On This.'}</li>
      </ol>
      <p className="mt-3 text-xs leading-5 text-slate-500">{tr ? 'Burada 20 katalog konumu takip edilir. Görev rehberi 19 laboratuvar sayar; görev tamamlanması için oyun içi sayacı esas al. Haritada işaretlediğin konumlar burada da işaretlenir.' : 'This tracks 20 catalog locations. The mission guide counts 19 labs; use the in-game counter for mission completion. Found markers are shared with the map.'}</p>
      {next ? <a href={`#kitty-${next.id}`} className="mt-3 inline-block text-sm text-emerald-300">{tr ? 'Sıradaki konum: ' : 'Next location: '}{next.title[locale]} ↓</a> : null}
      <details className="mt-3 text-xs text-slate-500"><summary className="cursor-pointer">{tr ? 'Görev rehberi' : 'Mission guide'}</summary><a href={KITTY_SOURCE} target="_blank" rel="noreferrer" className="mt-1 inline-block text-sky-300 underline">PC Gamer</a></details>
    </section>
    {groups.map(region => <section key={region} className="rounded-xl border border-white/10 p-3"><h3 className="px-1 pb-3 text-sm font-semibold">{region}</h3><ol className="space-y-2">{KITTY_LOCATIONS.filter(location=>location.region===region).map(location=>{
      const pin=game.markers.find(marker=>marker.id===location.id)!
      return <li id={`kitty-${location.id}`} key={location.id} className="scroll-mt-4 rounded-lg bg-white/[0.03] p-3"><div className="flex items-start gap-3"><input type="checkbox" className="mt-1 size-5 shrink-0 accent-emerald-400" aria-label={`${location.title[locale]} · ${tr ? 'temizlendi' : 'cleared'}`} checked={found.has(location.id)} onChange={()=>useCompanionStore.getState().toggleFound('gta6',location.id)} /><div className="min-w-0"><h4 className="text-sm font-semibold"><span className="mr-2 font-mono text-xs text-slate-500">{String(KITTY_LOCATIONS.indexOf(location)+1).padStart(2,'0')}</span>{location.title[locale]}</h4><p className="mt-1 text-xs leading-5 text-slate-400">{location.directions[locale]}</p><Link href={`/gta6/map?pin=${pin.id}&x=${pin.x}&y=${pin.y}&z=15`} className="mt-2 inline-block text-xs text-sky-300">{tr ? 'Haritada göster' : 'Show on map'} ↗</Link></div></div></li>
    })}</ol></section>)}
  </div>
}
