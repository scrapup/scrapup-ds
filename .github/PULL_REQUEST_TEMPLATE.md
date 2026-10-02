<!--
PR title MUST be a Conventional Commit (enforced by the pr-title workflow), e.g.
  feat: add Hero component
  fix(button): restore focus-visible outline
With squash merge the title becomes the commit on main and feeds release-please.
-->

## What & why

<!-- What this PR changes and the problem/need it addresses. Link the spec/task. -->

- Spec/task:
- Related issue:

## Type of change

- [ ] `feat` — new functionality
- [ ] `fix` — bug fix
- [ ] `docs` — documentation only
- [ ] `refactor` / `perf`
- [ ] `test` — tests only
- [ ] `build` / `ci` / `chore`

## Checklist

- [ ] `npm run typecheck`, `npm run lint` and `npm run lint:css` pass
- [ ] `npm run test:coverage` passes (coverage ≥ 95%)
- [ ] `npm run build` and `npm run size` pass (≤ 80 KB)
- [ ] `npm run test:e2e` passes
- [ ] Styles reference tokens only; no inline styles; square corners
- [ ] Story, unit test and e2e spec added/updated for every changed component
- [ ] Docs updated when relevant (`README*.md`, `CONTRIBUTING.md`)

## Visual changes

- [ ] Not applicable
- [ ] Screenshots attached
- [ ] Visual baselines regenerated on the CI container (`npm run test:e2e:update` on
      `mcr.microsoft.com/playwright:v1.63.0-noble`) and committed — never from a local machine

## Workflows (if touched)

- [ ] Not applicable
- [ ] New actions are pinned to a full commit SHA (`# vX.Y.Z` comment) and allowlisted
- [ ] Every job declares explicit `permissions`

## Release

- [ ] I did **not** bump the version / `CHANGELOG.md` by hand (release-please owns versioning)
