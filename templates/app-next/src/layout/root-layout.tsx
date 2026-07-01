import type { Metadata } from 'next'
import { env, PublicEnvScript } from 'next-runtime-env'

import { i18nConfig } from '@/i18n/config'
import type { AsyncWebLayout } from '@/shared/types'

import { RootWebLayout } from './web-layout'

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }))
}

export function generateMetadata(): Metadata {
  return {
    robots: env('NEXT_PUBLIC_META_ROBOTS') ?? null,
  }
}

export const RootLayout: AsyncWebLayout = ({ children, params }) => (
  <html lang={params.locale || i18nConfig.defaultLocale}>
    {/* eslint-disable-next-line @next/next/no-head-element */}
    <head>
      <PublicEnvScript />
    </head>
    <body>
      <RootWebLayout params={params}>{children}</RootWebLayout>
    </body>
  </html>
)
