'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/provider'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="grid h-dvh place-items-center bg-[#07080c] px-6 text-center text-[#f3efe6]">
      <div>
        <p className="font-display text-xs tracking-[0.42em] text-[#10B981]">FINDER</p>
        <h1 className="mt-3 font-display text-4xl">{t.notFoundTitle}</h1>
        <Link href="/gta5" className="mt-6 inline-flex h-11 items-center bg-[#10B981] px-5 font-semibold text-[#04140e]">
          {t.notFoundAction}
        </Link>
      </div>
    </div>
  )
}
