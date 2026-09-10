# React SCSS Template

A clean-architecture starter for React SPAs: React 19, TypeScript (strict), Vite, pnpm, react-router, SCSS Modules, PWA support, native Node tests, and GitHub Actions deploy — the conventions of [garden-arcade](https://github.com/subhro-kar), packaged for reuse.

## Use it

Click **Use this template** on GitHub, or:

```sh
git clone https://github.com/subhro-kar/react-template-scss my-app
cd my-app && rm -rf .git && git init
pnpm install
cp .env.example .env
pnpm dev
```

Then rename your app in `package.json` (`name`), `index.html` (`<title>`, meta), and `vite.config.ts` (PWA manifest), replace `public/favicon.svg` and `scripts/generate-pwa-icons.mjs` with your mark, run `pnpm icons`, and delete the example feature (`src/domain/entities/task.ts`, `src/domain/rules/tasks.*`, `src/application/useTasks.ts`, `src/presentation/features/tasks/`, plus the port/adapter wiring in `main.tsx`).

## Scripts

Requires Node 22.18+ and pnpm 11.19.0.

```sh
pnpm dev      # Vite dev server on 127.0.0.1:5173
pnpm test     # Native Node test runner over src/**/*.test.ts
pnpm build    # tsc --noEmit type check, then production build
pnpm preview  # Serve the production build locally
pnpm icons    # Regenerate PWA icons via sharp
```

## Architecture

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

- `src/domain/` — entities and business rules, pure TypeScript. No React, no DOM, no env; runs on bare Node so rules test with `node --test` and port to any runtime.
- `src/application/` — use-case hooks and `ports.ts` (the interfaces infrastructure implements). The only React-aware logic layer. Also owns build-time feature flags.
- `src/infrastructure/` — adapters: localStorage, HTTP, crypto ids, clock, audio. The only layer that touches `fetch`, `localStorage`, `Date`, or `AudioContext`.
- `src/presentation/` — components, SCSS Modules, routes. Renders state, forwards intents.
- `src/main.tsx` — the composition root where adapters are constructed and injected through `DependenciesProvider`.

Each layer folder has a README with its rules and a new-feature checklist in `src/presentation/README.md`. The bundled Tasks example is a complete vertical slice — domain rules → use-case hook → localStorage adapter → lazy-loaded route — showing how to add your own feature.

## Conventions

- **Testing:** native Node runner (`node --experimental-strip-types --test`), tests colocated as `*.test.ts`. No vitest/jest or DOM shims; keeping logic out of components is what makes that possible. `MemoryTaskRepository` is the injectable fake — no mocking libraries.
- **Feature flags:** `VITE_ENABLE_*=true|false` (see `.env.example`). Flags default to false in code, gate both route and nav link, and hidden features cost zero bytes because routes lazy-load.
- **Styles:** SCSS Modules colocated with components; design tokens are CSS custom properties in `src/presentation/styles/global.scss` (light + dark). Never hardcode colors or sizes.
- **Accessibility:** keyboard reachability, visible focus rings, labels on icon-only controls, `prefers-reduced-motion` handled globally.
- **PWA:** vite-plugin-pwa with `registerType: 'prompt'`; regenerate icons with `pnpm icons` after swapping the SVG mark in `scripts/generate-pwa-icons.mjs`.
- **pnpm 11:** the workspace pins `allowBuilds` and skips the optional `@parcel/watcher` build script; no arbitrary dependency lifecycle scripts run.

## Deployment

Pushes to `main` run tests and the production build, then deploy to Cloudflare Pages when the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets are configured (`.github/workflows/deploy.yml`; rename the Pages project in that file). Pull requests run the same verification via `ci.yml` without deploying.

## What this template deliberately omits

State libraries (the ports pattern covers most needs), CSS frameworks, test frameworks, ESLint/Prettier configs (add your own if wanted), and any backend. The `HttpTaskRepository` placeholder in `src/infrastructure/api/` shows where a real API client goes.