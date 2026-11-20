'use client'

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
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {groups.map(([label, entries]) => (
            <details key={label}>
              <summary className="cursor-pointer text-xs text-[#d9d3c8]">{heatmapGroup(locale, label)} · {entries.length}</summary>
              <ul className="mt-1 space-y-1">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      aria-pressed={active === entry.id}
                      className={`w-full truncate px-1 py-0.5 text-left text-sm ${active === entry.id ? 'bg-white/10 text-white' : 'text-[#d9d3c8] hover:bg-white/5'}`}
                      onClick={() => useHeatmapStore.getState().setId(active === entry.id ? null : entry.id)}
                    >
                      {entry.title}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>
      </div>
    </details>
  )
}
