# Contributing

Thanks for helping improve this template.

## Setup

Requires Node 22.18+ (see `.nvmrc`) and pnpm 11.19.0.

```sh
pnpm install        # also installs lefthook git hooks via `prepare`
cp .env.example .env
pnpm dev
```

## Before you commit

- `pnpm lint` — Biome check passes (formatting is also fixed on staged files by the pre-commit hook).
- `pnpm typecheck` — `tsc --noEmit` is clean.
- `pnpm test` — native Node tests pass. Pre-push runs this automatically.

You can skip hooks once with `git commit --no-verify`, but CI runs the same
checks — a red main is worse than a slow commit.

## Where code goes

This is a layered codebase; the dependency rule decides where a change lands:

```
presentation ──▶ application ──▶ domain
       │                              ▲
       └──────▶ infrastructure ───────┘   (implements application ports)
```

- Business rules → `src/domain` (pure, no React/DOM/env, colocated `*.test.ts`).
- Use cases and state → `src/application` (zustand store factories + hooks; ports in `ports.ts`).
- Side effects → `src/infrastructure` (adapters implementing ports).
- UI and styles → `src/presentation` (SCSS Modules, tokens from `styles/global.scss`).
- Wiring → `src/main.tsx` (construct adapters, create stores, provide).

Each layer folder has a README with its rules and the new-feature checklist.
For everything else (naming, feature flags, accessibility, commit format),
follow `AGENTS.md`.

## Commits and pull requests

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.
- One logical change per PR; keep the diff scannable.
- CI must pass: Biome, typecheck, tests, audit, and build.
- New features are hidden behind a `VITE_ENABLE_*` flag until finished.
- Update the layer READMEs and this file when you change the conventions.