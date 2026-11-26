'use client'

import Link from 'next/link'
import { Map, ListChecks, ArrowUpRight } from 'lucide-react'
import { getGame } from '@/config/games'
import { getCompanion } from '@/config/companion'
import { ModuleFrame } from '@/components/layout/CompanionShell'
import { useCompanionStore } from '@/store/useCompanionStore'
import { storyProgress } from '@/lib/storyProgress'
import { useI18n } from '@/i18n/provider'

export function Gta6Dashboard() {
  const { locale } = useI18n()
  const tr = locale === 'tr'
  const slice = useCompanionStore((state) => state.byGame.gta6)
  const game = getGame('gta6')!
  const story = storyProgress(getCompanion('gta6')!.checklist, slice?.checklistDone ?? [])
  const found = new Set(slice?.found ?? [])
  const count = game.markers.filter((marker) => found.has(marker.id)).length
  return (
    <ModuleFrame title="GTA VI" kicker="LEONIDA">
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/gta6/checklist" className="stat-card min-h-56 space-y-4">
          <div className="flex items-center justify-between"><ListChecks className="size-6 text-emerald-300" /><ArrowUpRight className="size-4 text-slate-500" /></div>
          <h2 className="text-sm text-slate-300">{tr ? 'Hikâye tamamlanması' : 'Story progress'}</h2>
          <p className="font-display text-5xl font-semibold">{Math.round(story.percent)}<span className="text-2xl text-slate-500">%</span></p>
          <div className="h-1.5 overflow-hidden rounded bg-white/5"><div className="h-full bg-emerald-400" style={{ width: `${story.percent}%` }} /></div>
          <p className="text-xs text-slate-400">{story.done} / {story.total} {tr ? 'takip edilen görev' : 'tracked missions'}</p>
          {story.next ? <p className="border-t border-white/10 pt-3 text-sm"><span className="text-slate-400">{tr ? 'Sıradaki: ' : 'Next: '}</span>{story.next.title}</p> : null}
        </Link>
        <Link href="/gta6/map" className="stat-card min-h-56 space-y-4">
          <div className="flex items-center justify-between"><Map className="size-6 text-sky-300" /><ArrowUpRight className="size-4 text-slate-500" /></div>
          <h2 className="text-sm text-slate-300">{tr ? 'Bulunan konumlar' : 'Locations found'}</h2>
          <p className="font-display text-5xl font-semibold">{count.toLocaleString(tr ? 'tr-TR' : 'en-US')}<span className="text-lg text-slate-500"> / {game.markers.length.toLocaleString(tr ? 'tr-TR' : 'en-US')}</span></p>
          <div className="h-1.5 overflow-hidden rounded bg-white/5"><div className="h-full bg-sky-400" style={{ width: `${count / game.markers.length * 100}%` }} /></div>
          <p className="text-xs text-slate-400">{tr ? 'Haritadaki keşiflerine devam et' : 'Continue exploring the map'}</p>
        </Link>
      </div>
    </ModuleFrame>
  )
}
