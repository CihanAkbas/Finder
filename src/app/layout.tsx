import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Barlow, Rajdhani, Geist_Mono } from 'next/font/google'
import { RegisterSW } from '@/components/pwa/RegisterSW'
import { LocaleProvider } from '@/i18n/provider'
import { LOCALE_COOKIE, parseLocale } from '@/i18n/locale'
import './globals.css'

export const instant = false

const display = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
})

const body = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-barlow',
})

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export async function generateMetadata(): Promise<Metadata> {
  const jar = await cookies()
  const locale = parseLocale(jar.get(LOCALE_COOKIE)?.value)
  return {
    title: {
      default: 'Finder',
      template: '%s',
    },
    description:
      locale === 'tr'
        ? 'Sınırsız etkileşimli oyun haritaları. Los Santos ve Leonida.'
        : 'Unlimited interactive game maps. Los Santos and Leonida.',
    manifest: '/manifest.webmanifest',
    appleWebApp: { capable: true, title: 'Finder' },
    icons: { icon: '/icon.svg' },
  }
}

export const viewport: Viewport = {
  themeColor: '#07080c',
  colorScheme: 'dark',
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const jar = await cookies()
  const locale = parseLocale(jar.get(LOCALE_COOKIE)?.value)
  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#07080c] text-[#f3efe6]">
        <LocaleProvider locale={locale}>
          <RegisterSW />
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
