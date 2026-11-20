export const LOCALES = ['tr', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const LOCALE_COOKIE = 'finder-locale'

export function parseLocale(value: string | undefined | null): Locale {
  return value === 'en' ? 'en' : 'tr'
}
