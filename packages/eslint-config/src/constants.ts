export const extraneousDependenciesPatterns = [
  '**/*.config.cjs',
  '**/*.config.js',
  '**/*.config.mjs',
  '**/*.config.ts',
  '**/scripts/**/*',
  '**/tests/**/*',
  '**/types/*.d.ts',
] as const

export const importExtensions = ['.cjs', '.js', '.ts'] as const
