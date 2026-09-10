# Application layer

Use cases and React state. This is the only layer besides presentation that
may import React, and it never imports infrastructure directly.

## Rules

- **Ports over adapters.** Code against the interfaces in `ports.ts`; the
  infrastructure layer implements them. Tests inject fakes (see
  `infrastructure/storage/MemoryTaskRepository`).
- `useCases`/hooks own orchestration: read state, call domain rules, persist
  through ports. Business logic itself belongs in `domain/rules`, not here.
- `DependenciesContext.tsx` is the injection seam: presentation constructs
  concrete adapters in `main.tsx` and provides them; hooks read them with
  `useDependencies()`.
- `featureFlags.ts` reads compile-time `VITE_ENABLE_*` constants from
  `.env.example`. Flags default to false in code; gate the route and the UI
  entry point together.
- New port? Add it to `ports.ts`, implement it in `infrastructure`, wire it
  in `main.tsx`. Three small edits, no service-locator or reflection.

## Dependency rule

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

Imports point in the direction of the arrows — never outward, never sideways
between `infrastructure` and `application` except through `ports.ts`.