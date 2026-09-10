# Project guidance

## Architecture (the dependency rule)

Four layers under `src/`; each has a README with its own rules:

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

- `src/domain` — pure entities and rules. No React, no DOM, no env, no fetch.
- `src/application` — ports (`ports.ts`), zustand store factories, use-case
  hooks, feature flags. Codes against interfaces, never against infrastructure
  classes.
- `src/infrastructure` — the only layer allowed `localStorage`, `fetch`,
  `crypto`, `Date`, and `AudioContext`, always behind a port.
- `src/presentation` — components, SCSS Modules, routes. Renders state and
  forwards intents; business decisions live inward.
- `src/main.tsx` is the composition root: construct adapters, build stores
  with them, and provide the stores via their `<Feature>StoreProvider`. No
  other file instantiates infrastructure.

When adding a feature, follow the checklist in
`src/presentation/README.md`. When in doubt about where code goes, move it
inward until it stops needing React, and put it there.

## State management

- zustand is the standard. Feature state lives in a store created by a
  factory (`src/application/stores/create<Feature>Store.ts`) that receives
  `Dependencies` — never a module-level singleton with hardwired imports.
- Store actions orchestrate: call a domain rule, set state, persist through a
  port. They never contain business rules.
- Components subscribe via the thin `use<Feature>` hook, one `useStore`
  selection per field, `useShallow` for grouped actions. Components never
  import a store or call `getState` directly.
- Purely local UI state (draft inputs, open/closed dialogs) stays in
  component `useState`. Don't put it in a store.

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

- `pnpm test` runs two suites:
  - **Unit** (`*.test.ts`): native Node runner over pure domain, application,
    and infrastructure code — no DOM shims, which is the point of the layering.
    `pnpm test:unit` / `pnpm test:coverage` (c8) run it alone.
  - **Components** (`*.test.tsx`): vitest + happy-dom + Testing Library smoke
    tests for common components (`vitest.config.ts`; `pnpm test:components`
    runs it alone). Keep these few and behavior-focused — render, interact,
    assert. If a component test needs business logic, that logic drifted
    into presentation; move it inward to the Node suite.
- Colocate tests next to the module they test. Unit tests never import React;
  component tests never import a store directly (provide fakes via the
  provider, as `TasksPage` consumers would).
- `pnpm build` runs `tsc --noEmit` first, so type errors fail the build.
- `MemoryTaskRepository` (infrastructure/storage) is the injected fake for
  store and application tests — no mocking libraries.

## Style

- Biome enforces formatting and lint (`pnpm lint`, autofix with
  `pnpm lint:fix`); lefthook runs Biome on staged files pre-commit and
  typecheck/tests pre-push. Don't hand-format — let Biome do it.
- Imports: `@/` alias (maps to `src/`) everywhere in presentation and entry
  code. `domain`, `application`, and `infrastructure` files keep relative
  imports — the native Node test runner loads them and does not resolve
  tsconfig paths, so a `@/` import inside those layers breaks `pnpm test`.
- TypeScript strict; `import type` for types (verbatimModuleSyntax).
- Immutability by default: domain rules return new values; store actions
  replace state, they don't mutate.
- SCSS Modules colocated with components; tokens (colors, spacing, radii,
  fonts) come from CSS custom properties in `src/presentation/styles/global.scss`.
  Never hardcode a color or size in a module.
- Accessibility is not optional: keyboard reachability, visible focus,
  labels on icon-only controls, reduced-motion respected.
- Feature flags (`VITE_ENABLE_*`) default to false in code, are documented in
  `.env.example`, and gate both the route and its nav entry. New, unfinished
  features ship behind a flag. Their types live in `src/vite-env.d.ts` and
  `scripts/validate-env.mjs` checks names and values before every dev/build —
  add a flag to all three places at once.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`,
  `chore:`) on every commit to `main`.