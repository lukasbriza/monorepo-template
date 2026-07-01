import type { Metadata } from 'next'

import { getScopedI18n } from '@/i18n/server'
import type { WebPage } from '@/shared/types'

// Disable caching for this route segment.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n('home')

  return {
    title: t('title'),
    description: t('description'),
  }
}

export const HomePage: WebPage = async () => {
  const t = await getScopedI18n('home')

  return (
    <main>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </main>
  )
}
