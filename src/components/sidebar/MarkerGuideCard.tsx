'use client'
import { canonicalMarkerId } from '@/lib/markerAliases'
import { useMapStore } from '@/store/useMapStore'
import type { GameMarker, GameConfig } from '@/types/game'
import { markerGuide } from '@/lib/markerGuides'
import { useI18n } from '@/i18n/provider'
export function MarkerGuideCard({ marker, game }: { marker: GameMarker; game: GameConfig }) {
  const { locale } = useI18n(), tr = locale === 'tr'
  const guide = markerGuide(marker, locale)
  const related = guide.relatedPins.flatMap(ref => { const pin = game.markers.find(pin => pin.id === canonicalMarkerId(ref.id)); return pin && pin.id !== marker.id ? [{ ...ref, pin }] : [] })
  const directions = guide.directions.filter((text) => !text.startsWith('Konum notunda adı geçen yerler:') && !text.startsWith('Places named in this location note:'))
  if (!directions.length && !guide.requirements.length && !guide.facts.length && !related.length && !guide.rewards.length) return null
  return <><details className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6">
    <summary className="cursor-pointer font-semibold">{tr ? 'Ulaşım ve erişim bilgileri' : 'Directions and access'}</summary>
    <div className="mt-3 space-y-3">
      {directions.length ? <ul className="list-disc space-y-1 pl-4 text-[#d9d3c8]">{directions.map((text) => <li key={text}>{text}</li>)}</ul> : null}
      {guide.requirements.length ? <div><h3 className="font-semibold">{tr ? 'Gerekenler' : 'Requirements'}</h3><ul className="list-disc pl-4 text-[#d9d3c8]">{guide.requirements.map((text) => <li key={text}>{text}</li>)}</ul></div> : null}
      {guide.rewards.length ? <div><h3 className="font-semibold">{tr ? 'Ödüller' : 'Rewards'}</h3><ul className="list-disc pl-4 text-[#d9d3c8]">{guide.rewards.map(text => <li key={text}>{text}</li>)}</ul></div> : null}
      {guide.facts.length ? <dl className="grid grid-cols-2 gap-3 text-xs">{guide.facts.map((fact) => <div key={fact.label}><dt className="text-[#8d877c]">{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl> : null}
      {guide.warnings.map((text) => <p key={text} className="text-xs text-amber-200">{text}</p>)}
      {guide.sources.length ? <ul className="text-xs">{guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer" className="text-sky-300 underline">{source.title}</a></li>)}</ul> : null}
    </div>
  </details>{related.length ? <nav aria-label={tr ? 'Bağlantılı görev konumları' : 'Related quest locations'} className="space-y-2 rounded-lg border border-white/10 p-3"><h3 className="text-sm font-semibold">{tr ? 'Bağlantılı konumlar' : 'Related locations'}</h3>{related.map(({ id, label, pin }) => <button key={id} type="button" className="block w-full rounded border border-white/10 px-3 py-2 text-left text-sm text-emerald-300 hover:bg-white/5" onClick={() => useMapStore.getState().requestFocus({ game: game.slug, id: pin.id, x: pin.x, y: pin.y, zoom: 16 })}>{label} →</button>)}</nav> : null}</>
}
