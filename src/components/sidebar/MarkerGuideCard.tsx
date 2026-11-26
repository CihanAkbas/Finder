'use client'
import type { GameMarker } from '@/types/game'
import { markerGuide } from '@/lib/markerGuides'
import { useI18n } from '@/i18n/provider'
export function MarkerGuideCard({ marker }: { marker: GameMarker }) {
  const { locale } = useI18n(), tr = locale === 'tr'
  const guide = markerGuide(marker, locale)
  const directions = guide.directions.filter((text) => !text.startsWith('Konum notunda adı geçen yerler:') && !text.startsWith('Places named in this location note:'))
  if (!directions.length && !guide.requirements.length && !guide.facts.length) return null
  return <details className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6">
    <summary className="cursor-pointer font-semibold">{tr ? 'Ulaşım ve erişim bilgileri' : 'Directions and access'}</summary>
    <div className="mt-3 space-y-3">
      {directions.length ? <ul className="list-disc space-y-1 pl-4 text-[#d9d3c8]">{directions.map((text) => <li key={text}>{text}</li>)}</ul> : null}
      {guide.requirements.length ? <div><h3 className="font-semibold">{tr ? 'Gerekenler' : 'Requirements'}</h3><ul className="list-disc pl-4 text-[#d9d3c8]">{guide.requirements.map((text) => <li key={text}>{text}</li>)}</ul></div> : null}
      {guide.facts.length ? <dl className="grid grid-cols-2 gap-3 text-xs">{guide.facts.map((fact) => <div key={fact.label}><dt className="text-[#8d877c]">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl> : null}
      {guide.warnings.map((text) => <p key={text} className="text-xs text-amber-200">{text}</p>)}
      {guide.sources.length ? <ul className="text-xs">{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">{source.title}</a></li>)}</ul> : null}
    </div>
  </details>
}
