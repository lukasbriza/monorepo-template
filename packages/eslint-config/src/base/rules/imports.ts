import type { Linter } from 'eslint'

import { extraneousDependenciesPatterns } from '../../constants'
import { getImportExtensionsRule } from '../../utils'

export const imports: Linter.RulesRecord = {
  ...getImportExtensionsRule(),
  'import/order': [
    // Sort and group imports by type
    'error',
    {
      alphabetize: {
        caseInsensitive: true,
        order: 'asc',
      },
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
    },
  ],
  // Production code must not import devDependencies; config files, scripts, tests and
  // type declarations may (see extraneousDependenciesPatterns).
  'import/no-extraneous-dependencies': ['error', { devDependencies: [...extraneousDependenciesPatterns] }],
  'import/prefer-default-export': 'off', // Prefer named exports
  'unused-imports/no-unused-imports': 'error', // Disallow unused imports
  'unused-imports/no-unused-vars': ['error', { ignoreRestSiblings: true }], // Disallow unused variables
}
