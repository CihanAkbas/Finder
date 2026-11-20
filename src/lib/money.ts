import type { Locale } from '@/i18n/locale'

function tag(locale: Locale) {
  return locale === 'tr' ? 'tr-TR' : 'en-US'
}

export function dollars(value: number, locale: Locale = 'en') {
  const formatted = Math.round(value).toLocaleString(tag(locale))
  return locale === 'tr' ? `${formatted} $` : `$${formatted}`
}

export function millions(value: number, locale: Locale = 'en') {
  const sign = value < 0 ? '-' : ''
  const body = (Math.abs(value) / 1_000_000).toLocaleString(tag(locale), {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  return locale === 'tr' ? `${sign}${body} milyon $` : `${sign}$${body}M`
}
