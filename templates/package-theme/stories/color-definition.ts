import type { Palette } from '@mui/material'

import { brandColors } from '../src/tokens'

/**
 * Palette keys whose colors are rendered in the Storybook palette story.
 */
type PaletteKey =
  | keyof Pick<Palette, 'bodyText' | 'border' | 'primary' | 'surface'>
  | ('state.error' | 'state.success' | 'state.warning')

type Colors = Record<string, unknown>

type ColorType = {
  key: PaletteKey
  title: string
  colors: Colors
}

/**
 * Colors used in the project, mapped for easy display in Storybook.
 */
export const colorDefinition: ColorType[] = [
  { key: 'primary', title: 'Primary', colors: brandColors.primary as Colors },
  { key: 'bodyText', title: 'Text', colors: brandColors.bodyText as Colors },
  { key: 'surface', title: 'Surface', colors: brandColors.surface as Colors },
  { key: 'border', title: 'Border', colors: brandColors.border as Colors },
  { key: 'state.success', title: 'State Success', colors: brandColors.state.success as Colors },
  { key: 'state.warning', title: 'State Warning', colors: brandColors.state.warning as Colors },
  { key: 'state.error', title: 'State Error', colors: brandColors.state.error as Colors },
]
