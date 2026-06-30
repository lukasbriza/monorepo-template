import type { NextRequest } from 'next/server'
import { createI18nMiddleware } from 'next-international/middleware'

import { i18nConfig } from './i18n/config'

const I18nMiddleware = createI18nMiddleware({
  locales: [...i18nConfig.locales],
  defaultLocale: i18nConfig.defaultLocale,
})

export function middleware(request: NextRequest) {
  return I18nMiddleware(request)
}

export const config = {
  // Run on every route except Next internals and files with an extension (static assets).
  matcher: [String.raw`/((?!api|_next/static|_next/image|favicon.ico|.*\..*).*)`],
}
