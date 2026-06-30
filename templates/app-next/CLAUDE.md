# CLAUDE.md — Next.js app

Per-app context. Inherits monorepo conventions from the root `CLAUDE.md`; this file
covers only what is specific to a Next.js app.

## Stack

- Next.js 14, **App Router**, React 18, TypeScript.
- i18n: `next-international` (`src/i18n`), locale segment `src/app/[locale]`.
- Styling: MUI + `@emotion` with an SSR registry (`src/layout/registry`).
- Forms: `react-hook-form` + `yup` (`@hookform/resolvers`).
- API: `openapi-fetch` typed client (`src/lib/openapi-fetch`).
- Runtime env: `next-runtime-env` (external package, see `next.config.mjs`).

## Layout & conventions

- Routes live under `src/app/[locale]/`. Route groups like `(web)` carry shared
  layout/error/not-found without affecting the URL.
- Feature code goes in `src/modules/<feature>/`; page components are thin wrappers
  that render from the matching module.
- Path alias `@/*` → `src/*` (see `tsconfig.json`).
- Shared types in `src/shared`. Layout/registry in `src/layout`.

## i18n

- Locales and default in `src/i18n/config.ts` (`cs`, `en`; default `en`,
  `prefixDefault: true`). Middleware (`src/middleware.ts`) handles locale routing.
- Add a locale: extend `Locale` + `i18nConfig.locales` and add `src/i18n/locales/<x>.ts`.
- Translation dictionaries are typed from the locale files — keep keys in sync.

## Styling (MUI + emotion SSR)

- Do **not** bypass the emotion registry; client components that need emotion must
  render under the registry provided in `src/layout`.
- When consuming a monorepo theme/component package, add it to
  `next.config.mjs` → `transpilePackages` (dev list) so it transpiles correctly.

## API client

- The typed client is generated from an OpenAPI schema:
  `pnpm api-schema:generate` reads `src/lib/openapi-fetch/api.json` → writes `api.d.ts`.
  Regenerate after the schema changes; do not hand-edit `api.d.ts`.
- Set the real `baseUrl` in `src/lib/openapi-fetch/index.ts` (placeholder today).

## Env

- Copy `.env.example` → `.env.local` and fill values. `.env.local` is gitignored and
  must never be committed.

## Don't touch

- Generated: `.next/`, `next-env.d.ts`, `src/lib/openapi-fetch/api.d.ts`.
- This file ships from `templates/app-next/CLAUDE.md`; edit conventions there, not in
  scaffolded copies, so changes propagate via `turbo gen` / `sync-template`.
