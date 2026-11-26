'use client'

import { Layers } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useHeatmapStore } from '@/components/map/heatmapStore'
import heatmaps from '@/config/games/gta6/heatmaps.json'
import type { HeatmapEntry } from '@/config/games/gta6/heatmaps'
import { heatmapGroup } from '@/i18n/gta6Map'
import { useI18n } from '@/i18n/provider'

const catalog = heatmaps as HeatmapEntry[]

export function HeatmapPanel() {
  const { t, locale } = useI18n()
  const active = useHeatmapStore((state) => state.id)
  const status = useHeatmapStore((state) => state.status)
  const shown = useHeatmapStore((state) => state.shown)
  const [query, setQuery] = useState('')
  const needle = query.trim().toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en')
  const groups = useMemo(() => {
    const buckets = new Map<string, HeatmapEntry[]>()
    for (const entry of catalog) {
      const label = heatmapGroup(locale, entry.label)
      const haystack = `${entry.title} ${entry.label} ${label}`.toLocaleLowerCase(locale === 'tr' ? 'tr' : 'en')
      if (needle && !haystack.includes(needle)) continue
      const list = buckets.get(entry.label) ?? []
      list.push(entry)
      buckets.set(entry.label, list)
    }
    return [...buckets.entries()].sort((a, b) => heatmapGroup(locale, a[0]).localeCompare(heatmapGroup(locale, b[0]), locale === 'tr' ? 'tr' : 'en'))
  }, [locale, needle])
  const current = catalog.find((entry) => entry.id === active)

  return (
    <details className="shrink-0 border-t border-white/10 px-4 py-3">
      <summary className="cursor-pointer text-xs uppercase tracking-[0.14em] text-[#a39c90]">{t.map.heatmap}</summary>
      <div className="mt-3 space-y-2">
        <p className="text-xs leading-5 text-[#8d877c]">{t.map.heatmapHint}</p>
        {current ? (
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="min-w-0 truncate text-[#f3efe6]">
              {current.title}
              {status === 'loading' ? ` · ${t.map.heatmapLoading}` : null}
              {status === 'error' ? ` · ${t.map.heatmapFailed}` : null}
              {status === 'ready' ? ` · ${t.map.heatmapCount(shown, current.points)}` : null}
            </span>
            <button type="button" className="shrink-0 uppercase text-[#fb7185]" onClick={() => useHeatmapStore.getState().setId(null)}>
              {t.map.heatmapClear}
            </button>
          </div>
        ) : null}
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.map.heatmapSearch}
          aria-label={t.map.heatmapSearch}
          className="h-8 w-full border border-white/15 bg-black/40 px-2 text-xs"
        />
        <div className="max-h-96 space-y-3 overflow-y-auto" aria-label={t.map.heatmap}>
          {groups.map(([label, entries]) => (
            <section key={label} className="border-t border-white/10 pt-2">
              <div className="flex items-center justify-between gap-2 px-1 pb-1.5">
                <h3 className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8d877c]">{heatmapGroup(locale, label)}</h3>
                <span className="font-mono text-[10px] text-[#8d877c]">{entries.length}</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                {entries.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    aria-pressed={active === entry.id}
                    title={`${entry.title} · ${entry.points} ${locale === 'tr' ? 'kaynak noktası' : 'source points'}`}
                    className={`flex min-w-0 items-center gap-1.5 rounded-md border px-1.5 py-1.5 text-left hover:bg-white/10 ${active === entry.id ? 'border-[var(--game-accent)] bg-white/10 text-white' : 'border-transparent bg-white/[0.04] text-[#d9d3c8]'}`}
                    onClick={() => useHeatmapStore.getState().setId(active === entry.id ? null : entry.id)}
                  >
                    <Layers className={`size-4 shrink-0 ${active === entry.id ? 'text-[var(--game-accent)]' : 'text-[#8d877c]'}`} />
                    <span className="min-w-0 flex-1 truncate text-xs">{entry.title}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
          {!groups.length ? <p className="py-3 text-xs text-[#8d877c]">{locale === 'tr' ? 'Bu aramada katman bulunamadı.' : 'No layers match this search.'}</p> : null}
        </div>
      </div>
    </details>
  )
}
