'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { messages } from '@/i18n/messages'
import { LOCALE_COOKIE, type Locale } from '@/i18n/locale'
import { dollars, millions } from '@/lib/money'

type Bundle = (typeof messages)['tr']

type I18nValue = {
  locale: Locale
  t: Bundle
  setLocale: (locale: Locale) => void
  money: (value: number) => string
  millions: (value: number) => string
}

const I18nContext = createContext<I18nValue | null>(null)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter()
  const [current, setCurrent] = useState(locale)

  useEffect(() => {
    document.documentElement.lang = current
  }, [current])

  const value = useMemo<I18nValue>(() => {
    const setLocale = (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`
      setCurrent(next)
      document.documentElement.lang = next
      router.refresh()
    }
    return {
      locale: current,
      t: messages[current],
      setLocale,
      money: (amount) => dollars(amount, current),
      millions: (amount) => millions(amount, current),
    }
  }, [current, router])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside LocaleProvider')
  return value
}
