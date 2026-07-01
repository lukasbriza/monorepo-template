# CLAUDE.md — monorepo-template

Durable context for this monorepo and every project scaffolded from it. Keep it tight
and high-signal. Per-app specifics live in each app's own `CLAUDE.md`.

## Stack & tooling

- Package manager: **pnpm** (`workspace:*` for internal deps). Node **>= 22**.
- Build orchestration: **Turborepo** (`turbo.json`). TypeScript 5.5.
- Workspaces: `apps/*` (deployables) and `packages/*` (libraries & shared config).
- Shared config consumed as packages, not copied:
  `@lukasbriza/eslint-config`, `@lukasbriza/prettier-config`, `@lukasbriza/ts-config`.
- Commits: Conventional Commits enforced by commitlint; husky runs `pre-commit`
  (lint-staged) and `commit-msg`.

## Core rule: config is a dependency, not a copy

Shared tooling lives in `packages/*` and is consumed via `workspace:*`. Do not copy
eslint/prettier/tsconfig content into apps — extend the shared package. If a convention
must change, change it in the shared package so every workspace inherits it.

## Adding an app or package — use `turbo gen`

Scaffolding is generator-driven from canonical templates in `templates/`:

```
pnpm turbo gen app-next            # Next.js app             -> apps/<name>
pnpm turbo gen app-nest            # NestJS app (+Prisma 7)  -> apps/<name>
pnpm turbo gen app-storybook       # Storybook host (+theme) -> apps/storybook
pnpm turbo gen package-theme       # shared MUI theme        -> packages/theme
pnpm turbo gen package-styles      # styled helpers          -> packages/styles   (needs theme)
pnpm turbo gen package-components  # component library       -> packages/components (needs theme + styles)
```

- `templates/<type>/` holds the **canonical, real** project body (single source of
  truth). Generators copy it into `apps/`/`packages/` and post-process (rename, optional
  variants, drop per-workspace `CLAUDE.md`), then optionally run `pnpm install` + `lint:fix`.
- Generators are defined in `turbo/generators/config.ts`.
- `templates/*` **are** workspaces (installed for full type-awareness, linting and
  type-checking), but `pnpm dev` / `pnpm build` scope to `--filter="./apps/*" --filter="./packages/*"`
  so templates never run or build as phantom apps. (Positive filters, not a lone
  `!./templates/*` which selects nothing; escaped double quotes so it works on Windows `cmd`.)
- Dependency order: `package-theme` → `package-styles` → `package-components`; generators
  guard against missing prerequisites.

Scaffolding is fully generator-based (the legacy `packages/cli` has been removed).

## Common tasks

```
pnpm dev        # turbo dev (persistent)
pnpm build      # turbo build
pnpm lint       # turbo lint        | pnpm lint:fix
pnpm ts         # turbo typecheck
pnpm test       # turbo test
pnpm format     # prettier write
```

## AI workflow

- Reusable AI capabilities live in `.claude/` (skills, agents, commands, hooks) and are
  distributed **in-repo**: committed here and inherited by scaffolded projects.
- Updates flow into existing projects via the `sync-template` skill: the template is a
  git remote (`template`), the last synced ref is recorded in `.claude/.template-ref`,
  and only the template's delta on owned paths is applied via 3-way merge (never a blind
  overwrite). See `.claude/skills/sync-template`.

## Guardrails

- Never edit generated/build output: `.next/`, `dist/`, `.turbo/`, `*.tsbuildinfo`,
  `node_modules/`.
- Edit conventions in `templates/` and shared `packages/*`, not in scaffolded copies —
  otherwise changes can't propagate.
- Never commit `.env.local` or other secrets; ship `.env.example` instead.
