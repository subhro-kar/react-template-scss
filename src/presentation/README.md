# Presentation layer

Components, pages, feature UIs, routing, and all SCSS. The only layer that
knows React renders anything on a screen.

## Rules

- **Components render and forward intents; they never decide.** Business
  rules come from `domain/rules`, orchestration from `application` hooks.
  A component that contains an `if` about domain state is usually a rule
  that drifted into the view.
- **SCSS Modules only, colocated with their component**
  (`Button.tsx` + `Button.module.scss`). Shared tokens and the reset live in
  `styles/global.scss`; never hardcode colors or sizes — use the CSS custom
  properties defined there.
- Accessibility floor: every interactive element is keyboard reachable,
  focus-visible styles are visible, images have alt text, and state changes
  that matter get `aria-live` or explicit labels. Reduced motion is handled
  globally in `global.scss`.
- **Routes gate on feature flags** (`application/featureFlags.ts`) and lazy
  load (`React.lazy`) so hidden features cost zero bytes. Add a route, its
  nav link, and the flag check together.
- Shared building blocks go in `components/`; anything with feature-specific
  markup goes in `features/<name>/`. A component used by two features is a
  `components/` candidate only after the second consumer exists.
- Wrap routes in `components/ErrorBoundary` so a feature crash degrades to
  a fallback instead of a blank page.

## New feature checklist

1. `domain/entities` + `domain/rules` (+ tests) — pure logic.
2. `application/ports.ts` — any capability the feature needs beyond React.
3. `application/use<Feature>.ts` — the use case hook.
4. `infrastructure/*` — port implementations.
5. `presentation/features/<feature>/` — UI + SCSS module, lazy route in
   `App.tsx`, flag in `featureFlags.ts` and `.env.example`.
6. `main.tsx` — construct and provide new adapters.