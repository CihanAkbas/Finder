'use client'

import { useI18n } from '@/i18n/provider'
import { CATALOG_REVISION, type CatalogKind } from '@/lib/provenance'

export function SourceNote({ kind }: { kind: CatalogKind }) {
  const { t, locale } = useI18n()
  const date = new Date(`${CATALOG_REVISION}T00:00:00Z`).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
  return (
    <p className="text-xs leading-5 text-[#a39c90]">
      <span className="text-[#d9d3c8]">{t.catalog.revised(date)}. </span>
      {t.catalog[kind]} {t.catalog.notLive}
    </p>
  )
}

export function SampleBanner() {
  const { t } = useI18n()
  return (
    <p className="border border-[#F59E0B]/40 bg-[#F59E0B]/10 px-3 py-2 text-sm leading-6 text-[#f3efe6]">
      <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F59E0B]">{t.archive?.badge ?? t.communitySchedule}</span>
      {t.archive?.body ?? t.catalog.schedule}
    </p>
  )
}
