# Contributing to scrapup-ds

Thank you for helping evolve the **scrapup** design system. This guide covers the change flow, how
to add a component and how to run the checks locally.

## Requirements

- Node.js 24 or later (`nvm use 24`)
- Docker, only to regenerate visual baselines

```bash
npm ci
```

## Change flow

1. Branch from `main` (`feat/...`, `fix/...`, `docs/...`).
2. Open a pull request against `main`. The **PR title** must be a Conventional Commit
   (`feat: add Hero component`, `fix(button): restore focus-visible outline`); the `validate` check
   enforces it.
3. The required checks must pass: `validate`, `dependency-review`, `verify`, `e2e` and CodeQL.
4. One approval is required. Merges are **squash only**: the PR title becomes the commit on `main`
   and feeds release-please.

Do not bump the version or edit `CHANGELOG.md` by hand; release-please owns both. Release tags are
created only by release-please; never create or move a `v*` tag manually.

## Checks

| Command | What it proves |
|---|---|
| `npm run typecheck` | TypeScript strict mode |
| `npm run lint` | ESLint, including no inline styles |
| `npm run lint:css` | Stylelint: tokens only, square corners, `su-` class names |
| `npm run test:coverage` | Unit tests (Vitest), coverage of at least 95% |
| `npm run build` and `npm run test:build` | Library build and its outputs |
| `npm run size` | Stylesheet + components at most 80 KB |
| `npm run build-storybook` | The catalog builds |
| `npm run test:e2e` | End-to-end tests (Playwright) against the built catalog |

## Adding a component

Each component lives in `src/components/<group>/<Name>/`:

| File | Content |
|---|---|
| `<Name>.tsx` | The component, with exported props and option types |
| `<Name>.css` | Styles with `su-` BEM classes and tokens only |
| `<Name>.stories.tsx` | `Default`, one story per variant and `AllVariants` |
| `<Name>.test.tsx` | Unit tests, including an a11y check |
| `index.ts` | Barrel for the component |

Then:

1. Export it from the group barrel and from `src/index.ts`.
2. Add `e2e/<group>/<Name>.spec.ts` (computed styles, keyboard, a11y, visual baseline).
3. Update the catalog list in `test/catalog.test.ts` and the component table in the READMEs.

The scope is 23 components; adding or removing one is a spec change, not only a code change.

## Tokens only

Colors live only in `src/tokens.css` and `src/tokens/**`. Components reference tokens
(`var(--...)`): no color literals, no inline styles, radius only `0` or `var(--radius-*)`. The ported
token files mirror the design project 1:1; new tokens derived for the package go in
`src/tokens/extensions.css`.

## Running e2e locally

```bash
npx playwright install chromium
npm run build-storybook && npm run test:e2e
```

Visual baseline tests run only in CI or with `RUN_VISUAL=1`.

## Visual baselines

Regenerate baselines only in the pinned Playwright container, never on a local machine (fonts and
rendering differ):

```bash
docker run --rm -v "$PWD":/work -v scrapup-ds-nm:/work/node_modules -w /work -e HOME=/root -e CI=1 \
  mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27 \
  bash -c "npm ci && npm run build-storybook && npx playwright test --update-snapshots"
```

Commit the updated `*.png` files with the change that caused them.

## Commits and language

- Artifacts (code, docs, commit messages, PRs) are in English; the READMEs are also kept in
  Portuguese and Japanese, replicated from the English source in the same PR.
- Commits and PRs carry no AI co-authorship trailer.
- No emoji; the product name is always lowercase **scrapup**.

## Security

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).
