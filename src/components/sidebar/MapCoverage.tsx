'use client'

import { COMMUNITY_REVIEWED, COMMUNITY_SOURCE, communityMarkers } from '@/config/games/gta6/community'
import { useI18n } from '@/i18n/provider'

export function MapCoverage() {
  const { locale } = useI18n()
  const tr = locale === 'tr'
  const flamingos = communityMarkers.filter((marker) => marker.category === 'community-cocaine-flamingo').length
  return (
    <details className="border-t border-white/10 px-3 py-3 text-xs leading-5 text-[#a39c90]">
      <summary className="cursor-pointer font-semibold text-[#d9d3c8]">{tr ? 'Kaynaklar ve harita kapsamı' : 'Sources & map coverage'}</summary>
      <div className="mt-2 space-y-2">
        <p>{tr ? `Son kaynak kontrolü: ${COMMUNITY_REVIEWED}. ${communityMarkers.length.toLocaleString('tr-TR')} ek topluluk konumu.` : `Sources reviewed: ${COMMUNITY_REVIEWED}. ${communityMarkers.length.toLocaleString('en-US')} additional community positions.`}</p>
        <p>{tr ? 'Sayılar haritadaki kayıtları gösterir; oyundaki her şeyin bulunduğu anlamına gelmez. Topluluk konumları yaklaşık olarak işaretlenir.' : 'Counts describe mapped records, not complete game coverage. Community positions are marked approximate.'}</p>
        <p>{tr ? `Flamingolar: ${flamingos}/125 konum haritalandı. %100 oyun tamamlaması için 100 gerekir. Hikâye görevlerinin 16/68 tanesi konuma bağlı; kalan 52 görev için doğrulanmış işaret yok.` : `Flamingos: ${flamingos}/125 mapped; 100 are needed for game completion. Story missions: 16/68 linked; 52 lack a verified waypoint.`}</p>
        <p>{tr ? 'Gizem ve karşılaşma katmanları spoiler içerebilir. Rastgele olaylar ve araçlar her ziyaretinde çıkmayabilir.' : 'Mystery and encounter layers may contain spoilers. Events and vehicles may not spawn on every visit.'}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sky-300 underline">
          <a href={COMMUNITY_SOURCE} target="_blank" rel="noreferrer">GTABase</a>
          <a href="https://gtadb.org/" target="_blank" rel="noreferrer">GTADB & contributors</a>
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
          <a href="https://mapgenie.io/grand-theft-auto-6/maps/leonida" target="_blank" rel="noreferrer">MapGenie</a>
        </div>
        <p>{tr ? 'Ek veriler: GTABase / GTADB ve katkıda bulunanlar. Konum adları ve koordinatlar uyarlanmıştır; kaynak rehber metinleri ve fotoğrafları kopyalanmamıştır.' : 'Additional data: GTABase / GTADB and contributors. Names and coordinates adapted; source guide text and photos are not reproduced.'}</p>
      </div>
    </details>
  )
}
