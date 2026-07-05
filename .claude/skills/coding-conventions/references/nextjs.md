# Next.js (App Router) conventions

Read with `coding-conventions` (base) and `react.md`. Applies to `apps/*` Next apps.
Performance rules (RSC waterfalls, bundle, streaming) live in the `web-performance` skill.

## Structure — thin routes, real code in `src/`

`src/app/` holds **only thin route files that re-export** the real implementation:

```ts
// src/app/[locale]/layout.ts
export { RootLayout as default, generateMetadata, generateStaticParams } from '@/layout/root-layout'
```

| Lives in | What |
|---|---|
| `src/app/[locale]/**` | route files — re-export only, no logic |
| `src/modules/<feature>/` | feature pages/components (`page.tsx`, etc.) |
| `src/layout/**` | layouts + emotion SSR `registry/` |
| `src/i18n/**` | next-international config, `client`, `server`, `locales/` |
| `src/lib/openapi-fetch/**` | typed API client + generated `api.d.ts` |
| `src/shared/types.ts` | shared route types |

Import via the `@/*` alias, never long relative paths.

## Server vs client components

- Server Component by default. Add `'use client'` only for interactivity/browser APIs, as low in
  the tree as possible.
- Data fetching in Server Components (`async` page). See `web-performance`: `client-fetch-on-server`.

## Route types

Type pages/layouts with the shared aliases from `src/shared/types.ts`, don't re-declare:
`WebPage`, `AsyncWebLayout`, `WebPageProps`, `WebPageParams`.

```tsx
export const HomePage: WebPage = async () => {
  const t = await getScopedI18n('home')
  return <main><h1>{t('title')}</h1></main>
}
```

## Metadata & caching

- Metadata via the Metadata API — `export const metadata` or `async generateMetadata()`. Never
  `next/head`.
- Optional metadata fields under `exactOptionalPropertyTypes` need `?? null` (e.g. `robots`).
- Segment cache with `export const dynamic = 'force-dynamic'` / `revalidate` — explicitly.

## i18n (next-international)

- Server: `getScopedI18n` / `getI18n` from `@/i18n/server`. Client: `useScopedI18n` /
  `I18nProviderClient` from `@/i18n/client`.
- Locales in `src/i18n/locales/<locale>.ts`; add a locale in one place (`i18n/config.ts`).
- The `middleware.ts` matcher must be a **plain string literal** (Next statically parses it —
  no `String.raw`, no computed value).

## Env & API

- Runtime env via `next-runtime-env`: `env('NEXT_PUBLIC_…')` + `<PublicEnvScript />` in the root
  layout. Don't read `process.env` in client components.
- API types are generated: edit the spec, run `pnpm api-schema:generate`; never hand-edit
  `lib/openapi-fetch/api.d.ts`. Call through the typed `openapi-fetch` client.

## Common Mistakes

| Mistake | Instead |
|---|---|
| Logic in `src/app/**` route file | re-export from `src/modules`/`src/layout` |
| `next/head` for metadata | Metadata API |
| Re-declaring page/layout prop types | `WebPage` / `AsyncWebLayout` |
| `process.env` in a client component | `env()` from `next-runtime-env` |
| Editing generated `api.d.ts` | `pnpm api-schema:generate` |
| Computed `middleware` matcher | plain string literal |
