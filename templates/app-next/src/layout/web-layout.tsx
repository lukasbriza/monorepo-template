import type { AsyncWebLayout } from '@/shared/types'
import { I18nProviderClient } from '@/i18n/client'

import { EmotionRegistry } from './registry'

export const RootWebLayout: AsyncWebLayout = ({ children, params }) => (
  <EmotionRegistry>
    <I18nProviderClient locale={params.locale}>{children}</I18nProviderClient>
  </EmotionRegistry>
)
