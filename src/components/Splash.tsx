'use client'

import { useI18n } from '@/i18n/provider'

export function Splash() {
  const { t } = useI18n()
  return (
    <div className="grid h-dvh place-items-center bg-[#07080c] text-[#e4b341]">
      <div className="text-center">
        <p className="font-display text-xs tracking-[0.45em]">FINDER</p>
        <p className="mt-3 font-display text-2xl tracking-wide text-[#f3efe6]">{t.loadingAtlas}</p>
      </div>
    </div>
  )
}
