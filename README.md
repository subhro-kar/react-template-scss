# React SCSS Template

[![Verify](https://github.com/subhro-kar/react-template-scss/actions/workflows/ci.yml/badge.svg)](https://github.com/subhro-kar/react-template-scss/actions/workflows/ci.yml)

A clean-architecture starter for React SPAs: React 19, TypeScript (strict), Vite, pnpm, react-router, zustand, SCSS Modules, PWA support, native Node tests, and GitHub Actions deploy — the conventions of [garden-arcade](https://github.com/subhro-kar), packaged for reuse.

## Use it

Click **Use this template** on GitHub, or:

```sh
git clone https://github.com/subhro-kar/react-template-scss my-app
cd my-app && rm -rf .git && git init
pnpm install          # also installs lefthook git hooks via `prepare`
cp .env.example .env
pnpm dev
```

Then rename your app in `package.json` (`name`), `index.html` (`<title>`, meta, JSON-LD), and `vite.config.ts` (PWA manifest); replace `YOUR.DOMAIN` in `index.html`, `public/robots.txt`, and `scripts/generate-sitemap.mjs`; swap the SVG marks in `scripts/generate-pwa-icons.mjs` and `scripts/generate-og-image.mjs` and run `pnpm icons && pnpm og-image`; rewrite `public/llms.txt` for your product; and delete the example feature (`src/domain/entities/task.ts`, `src/domain/rules/tasks.*`, `src/application/stores/createTasksStore.ts`, `src/application/useTasks.tsx`, `src/presentation/features/tasks/`, plus the wiring in `main.tsx`).

## Scripts

Requires Node 22.18+ (see `.nvmrc`) and pnpm 11.19.0.

```sh
pnpm dev            # Vite dev server on 127.0.0.1:5173
pnpm test           # Native Node test runner over src/**/*.test.ts
pnpm test:coverage  # Same, with c8 line/branch coverage
pnpm lint           # Biome lint + format check
pnpm lint:fix       # Biome autofix
pnpm typecheck      # tsc --noEmit
pnpm audit          # pnpm audit, high/critical only
pnpm build          # typecheck + production build
pnpm preview        # Serve the production build locally
pnpm icons          # Regenerate PWA icons via sharp
pnpm og-image       # Regenerate the Open Graph card
pnpm sitemap        # Regenerate sitemap.xml from the route list
```

Quality gates run automatically: lefthook fixes formatting on staged files
pre-commit and runs typecheck + tests pre-push; CI (Biome, typecheck, tests,
audit, build) runs on every branch push and PR.

## Architecture

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

- `src/domain/` — entities and business rules, pure TypeScript. No React, no DOM, no env; runs on bare Node so rules test with `node --test` and port to any runtime.
- `src/application/` — use-case hooks, **zustand store factories**, and `ports.ts` (the interfaces infrastructure implements). Stores are built by factories that receive `Dependencies`, so tests construct them with fakes. Also owns build-time feature flags.
- `src/infrastructure/` — adapters: localStorage, HTTP, crypto ids, clock, audio. The only layer that touches `fetch`, `localStorage`, `Date`, or `AudioContext`.
- `src/presentation/` — components, SCSS Modules, routes. Renders state, forwards intents. Imports use the `@/` alias; the three inner layers keep relative imports for Node test compatibility.
- `src/main.tsx` — the composition root where adapters are constructed and injected through store factories.

Each layer folder has a README with its rules and a new-feature checklist in `src/presentation/README.md`. The bundled Tasks example is a complete vertical slice — domain rules → zustand store → localStorage adapter → lazy-loaded route — showing how to add your own feature.

## Conventions

- **State:** zustand, built by store factories (`application/stores/`); components subscribe through thin hooks with one `useStore` selection per field. Local UI state stays in `useState`.
- **Testing:** native Node runner (`node --experimental-strip-types --test`), tests colocated as `*.test.ts`. No vitest/jest or DOM shims; keeping logic out of components is what makes that possible. `MemoryTaskRepository` is the injectable fake — no mocking libraries. c8 reports coverage.
- **Tooling:** Biome for lint + format (one tool, one config); lefthook for git hooks. pnpm 11's `allowBuilds` blocks dependency lifecycle scripts unless explicitly approved.
- **Feature flags:** `VITE_ENABLE_*=true|false` (see `.env.example`). Flags default to false in code, gate both route and nav link, and hidden features cost zero bytes because routes lazy-load.
- **Styles:** SCSS Modules colocated with components; design tokens are CSS custom properties in `src/presentation/styles/global.scss` (light + dark). Never hardcode colors or sizes.
- **Accessibility:** keyboard reachability, visible focus rings, labels on icon-only controls, `prefers-reduced-motion` handled globally.

## SEO & AI discoverability

Static floor included out of the box (all under `public/` unless noted):

- `llms.txt` — machine-readable site summary for AI agents and LLM crawlers
- `robots.txt` + `sitemap.xml` (generated by `pnpm sitemap`)
- Open Graph / Twitter card meta + generated 1200×630 card (`pnpm og-image`)
- Canonical link and `WebSite` JSON-LD structured data in `index.html`
- PWA manifest and icons (`pnpm icons`)

Honest caveat: this is a client-rendered SPA. Search engines index the static
`index.html` metadata fine, but content rendered from JS at runtime is not
reliably crawled. For content-heavy projects (blogs, marketing sites), use
prerendering or move to SSG/SSR — the layer separation ports over cleanly.

## Deployment

Pushes to `main` run Biome, tests, and the production build, then deploy to Cloudflare Pages when the `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repository secrets are configured (`.github/workflows/deploy.yml`; rename the Pages project in that file). Pull requests run the same verification plus a dependency audit via `ci.yml` without deploying. Dependabot opens weekly dependency and Actions updates (`.github/dependabot.yml`).

## Codebase exploration

Graphify is used to explore the code before changing behavior: run `/graphify`
or `graphify update .` to (re)build `graphify-out/`, then use `graphify query`,
`explain`, `path`, and `affected` for targeted lookups. Generated graphs lag
uncommitted changes — always verify against source. See `AGENTS.md`.

## Contributing & security

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, the dependency rule, and PR
expectations, and [SECURITY.md](SECURITY.md) for how to report vulnerabilities.
Licensed under [MIT](LICENSE).