# CLAUDE.md

Guide for agents working in this repository.

## What this is

`@scrapup/ds`: the **scrapup** design system (React 19 components, brand tokens, brand assets),
distributed from Git tags. Specs: `docs/specs/design-system-foundation/` (`spec.md`, `plan.md`,
`tasks.md`).

## Commands

Use Node 24 (`nvm use 24`).

| Command | Purpose |
|---|---|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` / `npm run lint:css` | ESLint / Stylelint |
| `npm run test` / `npm run test:coverage` | Vitest unit tests (coverage at least 95%) |
| `npm run build` / `npm run test:build` | Library build / build-output tests |
| `npm run size` | Size budget (80 KB) |
| `npm run storybook` / `npm run build-storybook` | Local catalog |
| `npm run test:e2e` | Playwright against `storybook-static` (build it first) |

Visual baselines are regenerated only in the pinned container (see `CONTRIBUTING.md`).

## Layout

| Path | Content |
|---|---|
| `src/components/<group>/<Name>/` | Component, CSS, stories, unit test, barrel |
| `src/index.ts` | Public API (curated named exports; the stylesheet import stays first) |
| `src/styles.css`, `src/tokens.css`, `src/tokens/` | Stylesheet entries and tokens |
| `src/lib/` | Internal helpers (`cx`, `resolveOption`, `hasContent`, `externalLinkProps`) |
| `e2e/<group>/` | Playwright specs and visual baselines |
| `test/` | Shared test helpers, catalog and build-output tests |
| `assets/logos/` | Brand assets (do not edit) |

## Rules

- Tokens only: no inline styles, no color literals outside `src/tokens.css` / `src/tokens/**`,
  square corners (`0` or `var(--radius-*)`).
- Scope is exactly 23 components (`test/catalog.test.ts`); changing it is a spec change.
- Every component has a story, a unit test and an e2e spec.
- TypeScript is pinned to 6.0.3 (plan D-01); do not upgrade it as a side effect.
- Animations stay on by default with opt-out props; do not tie them to `prefers-reduced-motion`.
- Fonts load from Google Fonts (do not self-host).
- All artifacts are in English; README changes are replicated to `README.pt.md` and `README.ja.md`.
- Conventional Commit PR titles; squash merge; no AI co-authorship trailers; explicit,
  file-by-file `git add`.
- Never bump the version, edit `CHANGELOG.md` or create tags by hand (release-please owns them).
