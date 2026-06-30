import type { Metadata } from 'next'
import { env, PublicEnvScript } from 'next-runtime-env'

import type { AsyncWebLayout } from '@/shared/types'
import { i18nConfig } from '@/i18n/config'

import { RootWebLayout } from './web-layout'

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

export function generateMetadata(): Metadata {
  return {
    robots: env('NEXT_PUBLIC_META_ROBOTS'),
  }
}

export const RootLayout: AsyncWebLayout = ({ children, params }) => (
  <html lang={params.locale || i18nConfig.defaultLocale}>
    <head>
      <PublicEnvScript />
    </head>
    <body>
      <RootWebLayout params={params}>{children}</RootWebLayout>
    </body>
  </html>
)
