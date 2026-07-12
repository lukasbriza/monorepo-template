# Contributing Guide

## 📦 Repository structure & scaffolding

pnpm workspaces + Turborepo. Applications live in `apps/`, shared config in `packages/`, and the
**canonical, real** project bodies in `templates/`. Nothing is hand-copied — scaffolding is
generator-driven from `templates/` into `apps/`/`packages/`:

```bash
pnpm turbo gen <type>       # e.g. app-next, app-mobile, package-api  (see README.md for the list)
```

or `/scaffold <type> [name]` from Claude Code (wraps `turbo gen`, validates prerequisites). The
generators are defined in `turbo/generators/config.ts`; edit the matching `templates/<type>/`, never a
scaffolded copy. Dependency order for packages: `tokens → theme → styles → components`.

Updates to the template propagate into projects built from it via the **`sync-template`** skill
(3-way merge on owned paths — never a blind overwrite).

## 🛠️ Local development

```bash
corepack enable && pnpm install   # installs deps + sets up husky hooks
pnpm dev        # turbo dev
pnpm lint       # turbo lint      ·  pnpm lint:fix
pnpm ts         # typecheck
pnpm format     # prettier --write
```

- Mechanical style (formatting, import order, `import type`, quotes) is **enforced** by
  `@lukasbriza/eslint-config` + `prettier-config` — don't restate it. Semantic conventions live in the
  `coding-conventions` skill; performance in `web-performance` / `native-performance`.
- **Pre-commit** runs `lint-staged` (eslint + prettier + `tsc` on staged files); **post-commit** updates
  the graphify graph. Build library packages (e.g. `tokens`, `api`) before committing code that imports
  them, so their `dist` resolves for the pre-commit `tsc`.

## 🧪 Testing

All apps and packages **should be covered by tests** where it makes sense.

- Add a `test` script to each package's `package.json` so `pnpm test` (turbo) runs it across the workspace.
- For containerized runs, `pnpm docker:run-tests` uses `docker/tests/docker-compose-run-tests.yaml`.
- Aim for reliable, reproducible tests that reflect real-world usage.

## 🐳 Docker

Reusable build assets live in `docker/`: per-runtime Dockerfiles (`nextjs/`, `node/`, `postgres/`)
that app images build on, plus `tests/` for containerized test runs. Keep image changes runtime-specific
and reuse the shared Dockerfiles rather than adding per-app ones.

## ✅ Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/), **enforced** by
commitlint on the `commit-msg` hook (`@commitlint/config-conventional`). Commits carry **no AI
attribution** (`includeCoAuthoredBy: false`).

**Examples:**

```
feat(app-mobile): add typed routes and error boundary
fix(api): align createApiClient generic with openapi-fetch
chore(deps): bump expo to SDK 56
```

The `commit-and-pr` skill produces messages that pass the hook plus a consistent PR shape.

## 🧭 Final notes

- Always branch for a feature or fix; keep PRs focused — one purpose per PR.
- Match existing conventions; flag inconsistencies rather than introducing a new style.
- Readable, maintainable, testable code over cleverness.
