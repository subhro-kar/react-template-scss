# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |

Template-derived projects track `main`; there are no patch releases from this
repository.

## Reporting a vulnerability

Please use [GitHub's private vulnerability reporting](
https://github.com/subhro-kar/react-template-scss/security/advisories/new)
for this repository. Do **not** open a public issue for anything
security-sensitive. You will get an acknowledgement within a few days;
please allow up to 90 days for coordinated disclosure before publishing.

## Dependency hygiene

- Dependabot opens weekly update PRs (`.github/dependabot.yml`).
- CI runs `pnpm audit --prod --audit-level high` on every branch push and PR.
- pnpm 11's `allowBuilds` policy blocks dependency lifecycle scripts unless
  explicitly approved in `pnpm-workspace.yaml` — review additions there with
  the same care as a new dependency.
- Prefer few dependencies; every one is an attack surface. The template
  deliberately has no runtime dependency beyond React and zustand.