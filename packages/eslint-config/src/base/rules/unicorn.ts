import type { Linter } from 'eslint'

export const unicorn: Linter.RulesRecord = {
  'unicorn/no-array-callback-reference': 'off', // Allow array callbacks to use the array reference
  'unicorn/no-nested-ternary': 'off', // We use ESLint's `no-nested-ternary` rule instead
  'unicorn/no-null': 'off', // Allow null values
  'unicorn/prevent-abbreviations': 'off', // Allow abbreviations (dir, config, params, ...)
}
