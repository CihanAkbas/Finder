'use client'

import { useI18n } from '@/i18n/provider'

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n()
  return (
    <div role="group" aria-label={t.langLabel} className="flex h-10 items-center rounded-lg border border-white/10 p-0.5 text-[11px] font-semibold">
      {(['tr', 'en'] as const).map((item) => (
        <button
          key={item}
          type="button"
          aria-pressed={locale === item}
          className={`h-8 rounded-md px-2 uppercase tracking-wider ${locale === item ? 'bg-emerald-400/15 text-emerald-300' : 'text-slate-400 hover:text-white'}`}
          onClick={() => setLocale(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
