'use client'

import type { GameMarker } from '@/types/game'
import { markerGuide } from '@/lib/markerGuides'
import { useI18n } from '@/i18n/provider'

export function MarkerGuideCard({ marker }: { marker: GameMarker }) {
  const { locale } = useI18n()
  const guide = markerGuide(marker, locale)
  const tr = locale === 'tr'
  return (
    <section aria-label={tr ? 'Konum ve erişim rehberi' : 'Location and access guide'} className="space-y-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6">
      <div><h3 className="font-semibold text-white">{tr ? 'Nedir?' : 'What is here?'}</h3><p className="text-[#d9d3c8]">{guide.summary}</p></div>
      <div>
        <h3 className="font-semibold text-white">{tr ? 'Nasıl ulaşırım?' : 'How do I reach it?'}</h3>
        {guide.missingDirections ? <p className="text-xs text-amber-200">{tr ? 'Bu noktanın giriş/kat tarifi henüz belgelenmedi.' : 'Entrance/floor directions for this point are not documented yet.'}</p> : null}
        {guide.directions.length ? <ul className="list-disc space-y-1 pl-4 text-[#d9d3c8]">{guide.directions.map((text) => <li key={text}>{text}</li>)}</ul> : null}
        {!guide.directions.length && !guide.missingDirections ? <p className="text-[#d9d3c8]">{tr ? 'Ayrıntılı konum tarifi aşağıdaki konum notunda.' : 'See the location note below for the detailed description.'}</p> : null}
      </div>
      <div>
        <h3 className="font-semibold text-white">{tr ? 'Erişim ve gerekenler' : 'Access and requirements'}</h3>
        {guide.unknownAccess ? <p className="text-xs text-amber-200">{tr ? 'Bölüm, görev, alet veya kapı koşulu henüz belgelenmedi.' : 'Chapter, mission, tool or door requirements are not documented yet.'}</p> : null}
        {guide.requirements.length ? <ul className="list-disc pl-4 text-[#d9d3c8]">{guide.requirements.map((text) => <li key={text}>{text}</li>)}</ul> : null}
        {guide.facts.length ? <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">{guide.facts.map((fact) => <div key={fact.label}><dt className="text-[#8d877c]">{fact.label}</dt><dd className="text-[#d9d3c8]">{fact.value}</dd></div>)}</dl> : null}
      </div>
      {guide.warnings.map((text) => <p key={text} className="text-xs text-amber-200">{text}</p>)}
      {guide.sources.length ? <details className="text-xs"><summary className="cursor-pointer text-[#a39c90]">{tr ? 'Rehber kaynakları' : 'Guide sources'}</summary><ul className="mt-1 space-y-1">{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">{source.title}</a></li>)}</ul></details> : null}
    </section>
  )
}
