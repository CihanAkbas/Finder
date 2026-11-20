'use client'

import { useI18n } from '@/i18n/provider'

export function CommunityScheduleBadge() {
  const { t } = useI18n()
  return (
    <span className="border border-[#F59E0B]/50 bg-[#F59E0B]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F59E0B]">
      {t.communitySchedule}
    </span>
  )
}
