# Project guidance

## Architecture (the dependency rule)

Four layers under `src/`; each has a README with its own rules:

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

- `src/domain` — pure entities and rules. No React, no DOM, no env, no fetch.
- `src/application` — ports (`ports.ts`), use-case hooks, feature flags. Codes
  against interfaces, never against infrastructure classes.
- `src/infrastructure` — the only layer allowed `localStorage`, `fetch`,
  `crypto`, `Date`, and `AudioContext`, always behind a port.
- `src/presentation` — components, SCSS Modules, routes. Renders state and
  forwards intents; business decisions live inward.
- `src/main.tsx` is the composition root: construct adapters there and provide
  them via `DependenciesProvider`. No other file instantiates infrastructure.

When adding a feature, follow the checklist in
`src/presentation/README.md`. When in doubt about where code goes, move it
inward until it stops needing React, and put it there.

## Codebase exploration

- Use Graphify to explore the codebase before changing behavior. Start with
  the existing `graphify-out/GRAPH_REPORT.md` and targeted `graphify query`,
  `graphify explain`, `graphify path`, or `graphify affected` commands.
- Verify graph findings against current source files; generated graphs can
  lag uncommitted changes and inferred edges are not proof.
- Keep exploration focused on the feature's entry points, state owners,
  consumers, and tests. Use `rg` for precise source lookups.
- Refresh stale code relationships with `graphify update .` when needed.
  Prefer local code extraction; do not require semantic API calls for routine
  exploration.
- If Graphify is unavailable, continue with source inspection and mention
  that limitation.

## Testing

- Native Node runner only: `pnpm test` runs
  `node --experimental-strip-types --test "src/**/*.test.ts"`. No vitest/jest,
  no DOM shims — testable code lives in domain/application/infrastructure as
  pure functions and classes, which is the point of the layering.
- Colocate `*.test.ts` next to the module it tests.
- `pnpm build` runs `tsc --noEmit` first; type errors fail the build.
- `MemoryTaskRepository` (infrastructure/storage) is the injected fake for
  application tests — no mocking libraries.

## Style

- TypeScript strict; `import type` for types (verbatimModuleSyntax).
- Immutability by default: domain rules return new values; React state is
  updated via reducers in application hooks.
- SCSS Modules colocated with components; tokens (colors, spacing, radii,
  fonts) come from CSS custom properties in `src/presentation/styles/global.scss`.
  Never hardcode a color or size in a module.
- Accessibility is not optional: keyboard reachability, visible focus,
  labels on icon-only controls, reduced-motion respected.
- Feature flags (`VITE_ENABLE_*`) default to false in code, are documented in
  `.env.example`, and gate both the route and its nav entry. New, unfinished
  features ship behind a flag.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`) on every commit to `main`.