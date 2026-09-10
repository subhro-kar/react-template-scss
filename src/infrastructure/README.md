# Infrastructure layer

Adapters that implement the application ports: storage, network, ids, time,
audio, and any other side-effecting capability.

## Rules

- Every adapter implements an interface from `src/application/ports.ts`.
  Adding a capability means adding the port first, then the adapter here.
- This is the only layer (besides presentation entry points) allowed to touch
  the DOM: `localStorage`, `fetch`, `AudioContext`, `crypto`, `Date` all live
  here, behind interfaces, so application code stays testable with fakes.
- Adapters fail soft where the user experience allows it (see
  `LocalStorageTaskRepository` swallowing quota errors) and throw where the
  caller signed up for errors.
- `MemoryTaskRepository` doubles as the test fake: application tests inject
  it instead of a mocking library.
- Pure adapter logic that does not need the DOM can be tested directly with
  the native Node runner (`*.test.ts` colocated), like the rest of the code.

## When you don't need this layer

Features that are pure state (no persistence, no network) can skip it — the
application hook then just needs no port. Don't invent a repository for state
that never leaves the component tree.