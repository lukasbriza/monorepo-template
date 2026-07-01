import type { PaletteOptions } from '@mui/material/styles/index'
import type { Shape, SpacingOptions } from '@mui/system'
import { createBreakpoints } from '@mui/system'

import type { WebSize } from './types'

// --- colors ---
export const gray = '#27292c'
export const black = '#151617'
export const white = '#FFFFFF'

export const monoChromaticPalette = {
  color1: '#eeeeee',
  color2: '#aeaeae',
  color3: '#909090',
  color4: '#5c5c5c',
}

export const primaryColors = {
  main: monoChromaticPalette.color2,
  light: monoChromaticPalette.color1,
  dark: monoChromaticPalette.color4,
} as const

export const brandColors = {
  primary: primaryColors,
  surface: {
    primary: monoChromaticPalette.color4,
    secondary: monoChromaticPalette.color3,
    tertiary: monoChromaticPalette.color2,
    contrast: white,
    background: monoChromaticPalette.color4,
  },
  bodyText: {
    primary: black,
    secondary: gray,
    contrast: white,
  },
  state: {
    success: { primary: '#51a147', secondary: '#73976e' },
    warning: { primary: '#e8c53c', secondary: '#d7c066' },
    error: { primary: '#b72121', secondary: '#873434' },
  },
  border: {
    primary: primaryColors.main,
    activeHover: primaryColors.dark,
    contrast: white,
  },
} as const

// --- palette ---
export const palette: PaletteOptions = {
  primary: brandColors.primary,
  bodyText: brandColors.bodyText,
  surface: brandColors.surface,
  border: brandColors.border,
  state: brandColors.state,
  common: { white, black },
  mode: 'dark',
}

// --- breakpoints ---
export const breakpoints = createBreakpoints({
  values: { xs: 0, sm: 600, md: 1024, lg: 1440, xl: 1600 },
})

// --- shape (border radius) ---
export const shape: Shape = {
  borderRadiusNone: 0,
  borderRadiusXs: 2,
  borderRadiusS: 4,
  // `borderRadius` must exist; `borderRadiusM` is the alias of preference.
  borderRadius: 8,
  borderRadiusM: 8,
  borderRadiusL: 12,
  borderRadiusXl: 16,
  borderRadius2Xl: 20,
  borderRadius3Xl: 24,
  borderRadius4Xl: 32,
}

// --- spacing + size scale (sizeN = n * sizeStep) ---
export const spacing: SpacingOptions = 5
export const sizeStep = 5

export const size = Object.fromEntries(
  Array.from({ length: 33 }, (_, index) => [`size${index}`, index * sizeStep]),
) as WebSize
