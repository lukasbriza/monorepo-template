# React / MUI conventions

Read with `coding-conventions` (base). Applies to the frontend apps and `@lukasbriza/components`.
Performance rules live in the `web-performance` skill.

## Components

- Function components as **arrow consts** with **named export** (library components are
  re-exported from `src/index.ts`).
- Props as a `type`, destructured in the signature with defaults: `{ disabled = false }`.
- Conditional props via spread: `{...(id && { id })}` — not `id={id || undefined}`.
- `clsx` for conditional classes: `clsx('badge', small && 'badge-small', className)`.
- Keep components small and presentational; push logic into hooks/services.

```tsx
type BadgeProps = {
  count: number
  className?: string
}

export const Badge = ({ count, className }: BadgeProps) => (
  <span className={clsx('badge', className)}>{count}</span>
)
```

## Body order (pages / complex components)

`state → hooks → handlers → effects → render`, effects grouped just above `return`.

```tsx
const HomePage = async () => {
  const t = await getScopedI18n('home') // hooks/data
  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
```

## State & effects — antipatterns

- **Derive, don't mirror** — compute from props/state during render; never `useState` + `useEffect`
  to sync a derived value. To reset state on a prop change, use `key`.
- `useEffect` only for real side effects (subscriptions, DOM, network).
- Don't define a component inside another (remounts it). See `web-performance`: `rerender-*`,
  `no-inline-components`.

## Styling (MUI + emotion)

- Use `styled` from `@lukasbriza/styles` (pre-bound to the theme) — not raw `@mui/system`.
- Read design tokens from the theme (`useTheme`, `theme.palette/…`); never hard-code colours/sizes.
- Typography uses custom variants `S/M/L/XL` + `h1..h5`; built-in `body1`/`button`/etc. are disabled
  by the theme — don't use them.
- Client components using emotion render under the SSR registry (`src/layout/registry`).

## Context pattern (three-file split)

| File | Responsibility |
|---|---|
| `types/context.ts` | `ContextBase<T>` type (adds `isProvided: boolean`) |
| `context/xxx-context.tsx` | `createContext` + Provider; Provider = default export, context = named |
| `hooks/context/use-xxx.ts` | `useContext` + guard that throws outside the provider |

- Default values set `isProvided: false`; function fields **throw**
  `new Error('… must be implemented')`, never a silent `() => {}`.
- Components never call `useContext` directly — always via the `useXxx` hook.

## Component library (@lukasbriza/components)

- One component per folder under `src/`; re-export from `src/index.ts`.
- Ship a story per component (`stories/<name>/*.stories.ts` + `.mdx`).

## Common Mistakes

| Mistake | Instead |
|---|---|
| `useEffect` to sync derived state | compute during render |
| Component defined inside a component | hoist it, pass props |
| Raw `@mui/system` `styled` | `styled` from `@lukasbriza/styles` |
| Hard-coded colour/size | theme token |
| `useContext(Ctx)` in a component | the `useXxx` hook |
