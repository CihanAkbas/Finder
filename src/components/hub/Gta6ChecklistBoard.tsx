'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getCompanion } from '@/config/companion'
import { getGame } from '@/config/games'
import { ModuleFrame } from '@/components/layout/CompanionShell'
import { useCompanionStore } from '@/store/useCompanionStore'
import { useI18n } from '@/i18n/provider'
import { checklistDetail } from '@/i18n/checklistText'
import { storyProgress } from '@/lib/storyProgress'
import { isChecklistComplete, weightedCompletion } from '@/lib/checklist'
import type { ChecklistItem } from '@/store/slice'

const titles: Record<string, string> = {
  'Main story': 'Ana hikâye', 'Optional missions': 'Yan görevler', 'Illegal operations': 'Yasa dışı operasyonlar', 'Bank robberies': 'Banka soygunları', 'Payday loan jobs': 'Kredi ofisi işleri', 'Smash and grabs': 'Vitrin soygunları', 'Stick ups': 'Silahlı soygunlar', 'Narcotics fenced': 'Satılan uyuşturucu', 'Jewelry fenced': 'Satılan mücevher', 'Marked bills fenced': 'Satılan işaretli para', 'Vaults hit': 'Açılan kasalar', 'Vehicles fenced': 'Satılan araçlar', 'Kenton sets': 'Kenton hazine setleri', 'Collectible card sets': 'Koleksiyon kartı setleri', 'WAiNK scans': 'WAiNK taramaları', 'Underwater discoveries': 'Su altı keşifleri', Magazines: 'Dergiler', 'Meditation spots': 'Meditasyon noktaları', 'Cocaine flamingos': 'Kokain flamingoları', 'Unique playlists': 'Özel çalma listeleri', 'Discovered styles': 'Keşfedilen stiller', 'Unique races won': 'Kazanılan farklı yarışlar', 'Race challenge golds': 'Yarış mücadelelerinde altın', 'Shooting range golds': 'Atış poligonunda altın', 'Arcade games': 'Atari oyunları', 'Pool opponents': 'Bilardo rakipleri', 'Golf locations': 'Golf sahaları', 'Basketball hoops': 'Basketbol potaları', 'Drone time trials': 'Drone zaman denemeleri', Stunts: 'Akrobasi hareketleri', Challenges: 'Meydan okumalar', "Bret's target decks": 'Bret hedef desteleri', 'Vehicles discovered': 'Keşfedilen araçlar', 'Weapons discovered': 'Keşfedilen silahlar',
}

export function Gta6ChecklistBoard() {
  const { locale } = useI18n()
  const tr = locale === 'tr'
  const data = getCompanion('gta6')!
  const game = getGame('gta6')!
  const slice = useCompanionStore((state) => state.byGame.gta6)
  const completed = slice?.checklistDone ?? []
  const manual = new Set(completed)
  const found = new Set(slice?.found ?? [])
  const story = storyProgress(data.checklist, completed)
  const score = weightedCompletion(data.checklist, found, manual, game.markers)
  const [tab, setTab] = useState<'story' | 'completion' | 'extras'>('story')
  const [filter, setFilter] = useState<'all' | 'remaining' | 'done'>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const currentChapter = story.chapters.find((chapter) => chapter.items.some((item) => item.id === story.next?.id))?.id
  const label = (item: ChecklistItem) => tr ? titles[item.title] ?? item.title : item.title
  const matches = (item: ChecklistItem) => {
    const done = isChecklistComplete(item, found, manual, game.markers)
    return !(filter === 'remaining' && done) && !(filter === 'done' && !done) && `${label(item)} ${checklistDetail(locale, item.detail)}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale).trim())
  }
  const detail = (item: ChecklistItem) => checklistDetail(locale, item.detail)
    .replace(/^Rehber ağırlığı %\d+\. /, '').replace(/\. Oyun içi %100 satırı tutunca işaretle\.$/, '.')
    .replace(/^Guide weight \d+%\. /, '').replace(/\. Tick when the in-game 100% line matches\.$/, '.')
  const renderRow = (item: ChecklistItem, index?: number) => {
    const done = isChecklistComplete(item, found, manual, game.markers)
    const mapId = item.mapId ?? item.markerId
    const pin = game.markers.find((marker) => marker.id === mapId)
    const next = tab === 'story' && item.id === story.next?.id
    return (
      <li key={item.id} id={`check-${item.id}`} className={`rounded-xl border p-4 ${next ? 'border-emerald-400/40 bg-emerald-400/5' : 'border-white/10 bg-white/[0.02]'}`}>
        <div className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 shrink-0 accent-emerald-400" aria-label={`${label(item)} · ${tr ? 'tamamlandı' : 'completed'}`} checked={done} disabled={Boolean(item.collect)} onChange={() => useCompanionStore.getState().toggleChecklist('gta6', item.id, item.markerId)} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2"><h3 className={`text-sm font-semibold ${done ? 'text-slate-500' : 'text-slate-100'}`}>{index != null ? <span className="mr-2 font-mono text-xs text-slate-500">{String(index + 1).padStart(2, '0')}</span> : null}{label(item)}</h3>{next ? <span className="rounded bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300">{tr ? 'SIRADAKİ' : 'NEXT'}</span> : null}</div>
            {tab === 'story' ? <details className="mt-1 text-xs leading-5 text-slate-400"><summary className="cursor-pointer">{tr ? 'Görev ayrıntısı' : 'Mission details'}</summary><p className="pt-1">{detail(item)}</p></details> : <p className="mt-1 text-xs leading-5 text-slate-400">{detail(item)}</p>}
            {pin ? <Link href={`/gta6/map?pin=${pin.id}&x=${pin.x}&y=${pin.y}&z=15`} className="mt-2 inline-block text-xs text-sky-300">{tr ? 'Haritada göster' : 'View on map'} ↗</Link> : null}
          </div>
        </div>
      </li>
    )
  }
  const otherRows = data.checklist.filter((item) => tab === 'completion' ? item.requiredFor100 : !item.requiredFor100 && !item.id.startsWith('gta6-mission-')).filter(matches)
  return (
    <ModuleFrame title={tr ? 'İlerlemen' : 'Your progress'} kicker="GTA VI">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={tr ? 'İlerleme görünümü' : 'Progress view'}>
        {([['story', tr ? 'Hikâye akışı' : 'Story order'], ['completion', tr ? 'Oyunu %100 tamamlama' : '100% completion'], ['extras', tr ? 'Yan işler' : 'Side activities']] as const).map(([id, text]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={`min-h-11 rounded-lg px-4 text-sm ${tab === id ? 'bg-emerald-400 text-[#04140e]' : 'border border-white/10 text-slate-300'}`} onClick={() => { setTab(id); setFilter('all'); setQuery('') }}>{text}</button>)}
      </div>
      {tab !== 'extras' ? <div className="rounded-xl border border-white/10 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3"><h2 className="font-display text-xl">{tab === 'story' ? (tr ? 'Takip edilen hikâye görevleri' : 'Tracked story missions') : (tr ? 'Oyunun %100 kontrol listesi' : 'Game completion checklist')}</h2><span className="font-mono text-sm text-emerald-300">{tab === 'story' ? `${story.done} / ${story.total}` : `${score.percent.toFixed(0)}%`}</span></div>
        <div className="mt-3 h-1.5 overflow-hidden rounded bg-white/5"><div className="h-full bg-emerald-400" style={{ width: `${tab === 'story' ? story.percent : score.percent}%` }} /></div>
        {tab === 'story' ? <p className="mt-3 text-xs leading-5 text-slate-400">{tr ? 'Bölüm sırasıyla ilerle. Görev adları oyundaki biçimiyle korunur; ayrıntılar Türkçedir. Paralel açılan görevlerin sırası değişebilir.' : 'Follow the chapters. Mission names match the game; parallel missions may be played in a different order.'}</p> : <p className="mt-3 text-xs leading-5 text-slate-400">{tr ? 'Bu liste hikâye sırası değildir. Hedefi oyun içinde tamamladığında kutuyu işaretle; haritadaki bütün pinleri bulmak zorunlu değildir.' : 'This is not mission order. Tick a goal after meeting it in-game; finding every map pin is not required.'}</p>}
        {tab === 'story' && story.next ? <button type="button" className="mt-3 text-sm text-emerald-300" onClick={() => { if (currentChapter) setExpanded((state) => ({ ...state, [currentChapter]: true })); requestAnimationFrame(() => document.getElementById(`check-${story.next!.id}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' })) }}>{tr ? 'Sıradaki göreve git: ' : 'Go to next mission: '}{story.next.title} ↓</button> : null}
      </div> : null}
      <div className="flex flex-wrap gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label={tr ? 'Görev veya hedef ara' : 'Search missions or goals'} placeholder={tr ? 'Görev veya hedef ara…' : 'Search missions or goals…'} className="h-11 min-w-40 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 text-sm" />{(['all', 'remaining', 'done'] as const).map((id) => <button type="button" key={id} aria-pressed={filter === id} className={`rounded-lg border px-3 text-xs ${filter === id ? 'border-emerald-400 text-emerald-300' : 'border-white/10 text-slate-400'}`} onClick={() => setFilter(id)}>{id === 'all' ? (tr ? 'Tümü' : 'All') : id === 'remaining' ? (tr ? 'Kalanlar' : 'Remaining') : (tr ? 'Tamamlananlar' : 'Completed')}</button>)}</div>
      {tab === 'story' ? <div className="space-y-3">{story.chapters.map((chapter) => {
        const rows = chapter.items.filter(matches)
        const open = query.trim() ? rows.length > 0 : expanded[chapter.id] ?? chapter.id === currentChapter
        const done = chapter.items.filter((item) => manual.has(item.id)).length
        return <section key={chapter.id} className="rounded-xl border border-white/10"><button type="button" aria-expanded={open} className="flex w-full items-center justify-between gap-3 p-4 text-left" onClick={() => setExpanded((state) => ({ ...state, [chapter.id]: !open }))}><span><span className="block text-sm font-semibold">{chapter.title[locale]}</span><span className="mt-1 block text-xs text-slate-400">{done} / {chapter.items.length} {tr ? 'tamamlandı' : 'completed'}</span></span><span className="text-slate-500">{open ? '−' : '+'}</span></button>{open ? <ul className="space-y-2 border-t border-white/10 p-2">{rows.length ? rows.map((item) => renderRow(item, chapter.items.indexOf(item))) : <li className="p-3 text-sm text-slate-400">{tr ? 'Bu filtrede görev yok.' : 'No missions match this filter.'}</li>}</ul> : null}</section>
      })}<p className="text-xs text-slate-500">{tr ? 'Şimdilik ilk 3 bölümün 68 görevini takip ediyoruz; sonraki bölümler bu kataloğa henüz eklenmedi.' : 'The catalog currently tracks 68 missions across the first 3 chapters; later chapters are not included yet.'}</p></div> : <ul className="space-y-2">{otherRows.length ? otherRows.map((item) => renderRow(item)) : <li className="p-4 text-sm text-slate-400">{tr ? 'Bu filtrede sonuç yok.' : 'No results match this filter.'}</li>}</ul>}
    </ModuleFrame>
  )
}
