# Application layer

Use cases, feature state, and React glue. This is the only layer besides
presentation that may import React, and it never imports infrastructure
directly.

## Rules

- **Ports over adapters.** Code against the interfaces in `ports.ts`; the
  infrastructure layer implements them. Tests inject fakes (see
  `infrastructure/storage/MemoryTaskRepository`).
- **State lives in zustand stores, built by factories.** A store factory
  (`stores/create<Feature>Store.ts`) receives `Dependencies` (from `ports.ts`),
  so its actions can call domain rules and persist through ports. Tests
  construct a store with fakes; `main.tsx` constructs the real one.
- **Components subscribe through a thin hook** (`use<Feature>.ts`) that binds
  the store via context and selects one field per `useStore` call, using
  `useShallow` for grouped action references — this is what keeps rerenders
  minimal. Components never import a store directly.
- Business logic itself belongs in `domain/rules`, not here. A store action
  orchestrates (call rule, set state, persist); it does not decide.
- `featureFlags.ts` reads compile-time `VITE_ENABLE_*` constants from
  `.env.example`. Flags default to false in code; gate the route and the UI
  entry point together.
- New port? Add it to `ports.ts`, implement it in `infrastructure`, pass it to
  the store factory in `main.tsx`. Three small edits, no service locator.

## Dependency rule

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

Imports point in the direction of the arrows — never outward, never sideways
between `infrastructure` and `application` except through `ports.ts`.