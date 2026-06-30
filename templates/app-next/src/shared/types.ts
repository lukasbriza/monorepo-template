import type { NextPage } from 'next'
import type { PropsWithChildren, ReactNode } from 'react'

import type { Locale } from '@/i18n/config'

/**
 * Route params shared by every localized page.
 */
export type WebPageParams = {
  locale: Locale
}

/**
 * Props shared by every localized page.
 */
export type WebPageProps<T extends WebPageParams = WebPageParams> = {
  params: T
}

/**
 * Async (server component) layout.
 */
export type AsyncWebLayout = (props: PropsWithChildren<WebPageProps>) => ReactNode

/**
 * Page component.
 */
export type WebPage<T extends WebPageProps = WebPageProps, I = T> = NextPage<T, I>
