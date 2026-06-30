import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import type { PlopTypes } from '@turbo/gen'

type AppNextAnswers = {
  name: string
}

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Turborepo generators.
 *
 * Scaffolding copies a canonical project body from `templates/<type>` into the
 * workspace, then post-processes it. The canonical templates are real, maintainable
 * projects (single source of truth) — generators never template binary/asset files,
 * they copy verbatim and rewrite only what must change.
 */
export default function generator(plop: PlopTypes.NodePlopAPI): void {
  // `turbo gen` returns the generators directory (`turbo/generators`) here — not a
  // file path — so resolve the repo root two levels up. cwd-independent.
  const generatorsDir = plop.getPlopfilePath()
  const repoRoot = path.resolve(generatorsDir, '..', '..')

  plop.setGenerator('app-next', {
    description: 'Scaffold a Next.js app from templates/app-next into apps/<name>',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'App name (kebab-case) — becomes apps/<name> and @lukasbriza/<name>:',
        validate: (value: string) => KEBAB_CASE.test(value) || 'Use kebab-case: a-z, 0-9 and single dashes.',
      },
    ],
    actions: [
      (rawAnswers) => {
        const { name } = rawAnswers as AppNextAnswers
        const source = path.join(repoRoot, 'templates', 'app-next')
        const destination = path.join(repoRoot, 'apps', name)

        if (existsSync(destination)) {
          throw new Error(`apps/${name} already exists — choose another name or remove it first.`)
        }

        // Copy the canonical template verbatim, skipping install/build artifacts
        // (the template is an installed workspace, so it has node_modules/.next/etc.).
        cpSync(source, destination, {
          recursive: true,
          filter: (entry) => {
            const base = path.basename(entry)
            return !['node_modules', '.next', '.turbo', '.eslintcache'].includes(base) && !base.endsWith('.tsbuildinfo')
          },
        })

        // Rename the package: @lukasbriza/next-template -> @lukasbriza/<name>.
        const packageJsonPath = path.join(destination, 'package.json')
        const renamed = readFileSync(packageJsonPath, 'utf8').replace(
          '@lukasbriza/next-template',
          `@lukasbriza/${name}`,
        )
        writeFileSync(packageJsonPath, renamed)

        return `Created apps/${name} from templates/app-next`
      },
      (rawAnswers) => {
        const { name } = rawAnswers as AppNextAnswers
        return [
          'Next steps:',
          '  pnpm install',
          `  cp apps/${name}/.env.example apps/${name}/.env.local   # then fill values`,
          `  pnpm turbo build --filter @lukasbriza/${name}`,
        ].join('\n')
      },
    ],
  })
}
