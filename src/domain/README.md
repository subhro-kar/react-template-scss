# Domain layer

Pure TypeScript: entities, value types, and business rules.

## Rules

- **No imports of React, the DOM, `fetch`, `localStorage`, or `import.meta.env`.**
  This layer must run in Node with `node --test` and stay reusable on any runtime.
- Entities are immutable — rule functions return new values instead of mutating.
- Rule functions are total: invalid input throws with a message tests can assert.
- Colocate each rule module with its `*.test.ts`; tests run with the native
  Node test runner (`pnpm test`), no extra test framework or DOM shims.
- Folder shape: `entities/` holds data shapes, `rules/` holds behavior. When a
  domain grows, split per entity (e.g. `rules/tasks.ts`, `rules/matches.ts`).

The dependency rule: `domain` imports nothing from the other layers.
`application` may import `domain`; `infrastructure` and `presentation` may
import anything inward of them. Imports always point toward this folder.