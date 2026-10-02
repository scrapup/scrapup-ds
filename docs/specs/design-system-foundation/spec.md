# Functional Specification: scrapup-ds (Design System Foundation)

> SDD Phase 1 — business intent (What / Why), technology-agnostic. The How (stack, build,
> contracts, CI, repository settings) lives in `plan.md` (Phase 2).
> Source of truth for visual values: the claude.ai/design project "scrapup Design System"
> (`f3b2dbb9-52a7-4956-895a-3f8a26729c47`) — `readme.md`, `tokens/*`, `components/*`,
> `guidelines/*`, `assets/logos/*`.

## 1. Overview and Objective

- **The Problem:** The scrapup visual identity (night-city / CRT-terminal palette, neon accent,
  square corners, mono UI chrome, glow as the one emphasis mark) exists only as a design project
  and as values hand-copied into the site. There is no versioned, reusable source: every new
  surface re-derives colors, type and patterns, drift is undetected, and the identity cannot be
  audited against a single contract — the opposite of what scrapup preaches.
- **The Solution (What):** A public, versioned **design system** for scrapup in its own
  repository (`scrapup/scrapup-ds`): design tokens (color, type, spacing, effects), brand assets,
  and a catalog of 23 reusable UI components extracted from the design project, each documented
  and viewable in isolation in a local catalog. The repository follows the same governance as the
  other scrapup repos: protected `main`, changes only via reviewed pull requests with
  Conventional-Commit titles, and automated semantic versioning with a changelog.
- **The Value (Why):** One auditable source for the brand. Surfaces (site, docs, future tools)
  consume a tagged version instead of copying values; identity changes become traceable diffs with
  a version and a changelog entry; drift between design and implementation becomes visible.

## 2. User Journeys

Actors:
- **Consumer** — a developer building a scrapup surface (e.g. the scrapup.dev site) who installs
  the design system.
- **Maintainer** — whoever evolves the design system (adds/changes tokens or components).
- **Validator** — the human who approves pull requests and seals releases.
- **System** — the design system repository and its automation.

**Main journey — consume a released version:**
1. The Consumer references a specific released version of the design system from the public Git
   repository (pinned to a tag).
2. The Consumer loads the global stylesheet (tokens + base) once.
3. The Consumer composes pages from the catalog components; visual values come from tokens only.
4. Result: the surface matches the design project without hand-copied values; upgrading is a
   version bump with a readable changelog.

**Main journey — evolve the design system:**
1. The Maintainer opens a branch and changes a token or component, with its catalog entry and
   tests.
2. The Maintainer opens a pull request whose title is a valid Conventional Commit.
3. The System validates the title and runs the quality checks; merge is blocked until both pass.
4. The Validator merges (squash; the PR title becomes the commit on `main`).
5. The System opens/updates a Release PR proposing the next version and changelog.
6. The Validator merges the Release PR; the System creates the tag and release.

**Alternative journey — browse the catalog:**
1. The Maintainer or Consumer starts the catalog locally.
2. Each component is shown in isolation with all its variants and documented properties.

**Alternative journey — re-tint the accent:**
1. The Consumer overrides the single accent token (e.g. to one of the approved alternates).
2. Every glow, primary button, highlight and accent edge follows the new accent with no further
   change.

## 3. Business Rules and Constraints

| # | Rule | Type |
|---|---|---|
| RN-01 | Repository `scrapup/scrapup-ds` is **public**, MIT-licensed (© 2026 scrapup), author Marco Antonio Luqueti Faustino | Mandatory |
| RN-02 | `main` changes only via pull request: required status checks (PR title, quality, end-to-end, dependency review, code scanning) up to date with `main`, **1 approval from a code owner** (stale approvals dismissed on new pushes, conversations resolved), squash-only merge with commit title = PR title, linear history, no force-push, no deletion. The repository admin may skip **only the approval**, and **only when merging a PR**; no one may skip the checks or push directly | Mandatory |
| RN-03 | Every PR title must be a valid Conventional Commit (types: feat, fix, docs, refactor, perf, test, build, ci, chore, revert); otherwise merge is blocked | Restrictive |
| RN-04 | Versioning is automated from Conventional Commits on `main` via a Release PR; versions are never bumped and the changelog is never edited by hand. Pre-1.0: `feat` bumps minor, `fix` bumps patch | Mandatory |
| RN-05 | Distribution is **Git-only** (consumption by tag of the public repo); no publication to a package registry | Restrictive |
| RN-06 | The catalog contains exactly the 23 components of the design project (see §7), with the variants and properties defined there; no new component without a spec change | Mandatory |
| RN-07 | Every visual value in a component comes from a design token; no hard-coded off-palette colors | Mandatory |
| RN-08 | Components carry **no inline styles**; all styling is class-based on top of the tokens, so they render correctly with zero client-side behavior where the component is static (server-rendered surfaces) | Mandatory |
| RN-09 | The accent is a single themeable token; every glow/accent derives from it (alternates: #FF3D9A, #35E6E0, #B388FF) | Mandatory |
| RN-10 | Brand rules are preserved: square corners (exceptions: status dots and avatar/app-icon tiles), 1px cyan-tinted hairlines, dashed borders mean "not ours / not yet", no backdrop blur, no emoji, unicode glyphs as icons, product name always lowercase **scrapup** | Mandatory |
| RN-11 | Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono, Noto Sans JP) are loaded from the same remote font provider used by the design project; every stack has a local fallback | Mandatory |
| RN-12 | Brand assets (wordmark dark/light PNG, wordmark/square GIF, avatar, favicon, social preview) ship with the design system and are reachable by consumers | Mandatory |
| RN-13 | **WaitlistForm is presentational only**: it never sends, stores or logs data itself; it exposes the submitted value and its states (idle/submitting/success/error) to the consumer, who owns collection and data-protection compliance | Restrictive |
| RN-14 | The catalog runs locally only; no hosted catalog deployment in this scope | Restrictive |
| RN-15 | The site screens of the design project (Landing, Manifesto, 404) are **out of scope** — neither shipped nor reproduced in the catalog | Restrictive |
| RN-16 | Artifacts (code, docs, commit messages, PRs) are in English; the repository README is trilingual (EN source, PT, JA) | Mandatory |
| RN-17 | Commits and PRs carry no AI co-authorship trailer | Mandatory |
| RN-18 | Animations are part of the brand and stay on by default; each animated component offers an opt-out property for a static rendering | Mandatory |
| RN-19 | Secret scanning and secret push protection are **enabled** on the repository (deliberate deviation from the sibling repos, which have them off); vulnerability alerts on | Mandatory |
| RN-20 | Release tags (`v*`) are created only by the release automation (process rule) and can never be moved or deleted (enforced) | Restrictive |
| RN-21 | Supply chain: automation runs with read-only permissions by default (write only where declared); third-party automation steps are pinned to immutable references and restricted to an approved list; dependency and automation updates are proposed automatically every week, and security fixes as soon as published | Mandatory |
| RN-22 | A PR that introduces a dependency with a known vulnerability of moderate severity or higher is blocked; code and automation are scanned and a high/critical security finding blocks the merge | Restrictive |
| RN-23 | Vulnerabilities are reported privately through the repository's private reporting channel, following a published security policy | Mandatory |

## 4. Edge Cases and Exception Flows (Zero Trust)

| Scenario | Expected Behavior | Severity |
|---|---|---|
| Consumer passes an unknown variant/size/tone | Component renders its documented default; never breaks layout | High |
| Required content missing (e.g. Button without label, StatCard without value or title) | Component renders without the empty slot (no empty boxes, no "undefined") | Medium |
| Remote font provider unreachable / blocked | Text renders in the fallback stack; layout remains usable | Medium |
| Consumer does not load the global stylesheet | Documented as a usage error in the README; components remain readable (semantic markup) | Medium |
| External link in Button/TopBar/Footer | Opens in a new context with no opener access to the origin page | High |
| Consumer needs a static rendering of an animated component | Animated components (Wordmark flicker, GlitchCode) expose a property to disable animation; animation is on by default and is **not** tied to the user's reduced-motion preference (OP-03) | Medium |
| WaitlistForm receives an empty or malformed e-mail | Blocked before the consumer handler is called; error state shown | High |
| WaitlistForm consumer handler fails | Error state shown, entered value preserved, form can be resubmitted | High |
| WaitlistForm submitted twice while submitting | Second submission ignored until the first resolves | Medium |
| Japanese locale content | Japanese glyphs use the JP family with looser line-height (1.7; 1.85 for long prose) | Medium |
| PR title not Conventional Commit | Merge blocked by required check | Critical |
| Quality checks fail or branch outdated vs `main` | Merge blocked | Critical |
| Direct push / force-push / deletion on `main` | Rejected by branch protection | Critical |
| Push containing a detectable secret (any branch) | Rejected by secret push protection; existing leaks raise a secret-scanning alert | Critical |
| PR without code-owner approval | Blocked for contributors; the admin can merge their own PR only by the approval bypass at merge time | High |
| Move/deletion of a `v*` tag | Rejected | Critical |
| Manual creation of a `v*` tag | Forbidden by process (not platform-enforced: GitHub does not accept the Actions app as a repository ruleset bypass actor) | Critical |
| PR adds a vulnerable dependency (≥ moderate) or code scanning finds a high/critical issue | Merge blocked, no bypass | Critical |
| Automated update PR breaks the build or tests | Stays blocked by the checks; never merged red | Medium |

## 5. Success Criteria and SLAs

**Functional Criteria:**
- [ ] Repository `scrapup/scrapup-ds` exists, public, MIT, with protection per RN-02 and RN-19..RN-23 verified via
      the GitHub API
- [ ] A PR with an invalid title is blocked; a valid one passes (observable on a real PR)
- [ ] Merging to `main` produces a Release PR; merging it produces tag `v0.1.0` and a changelog
- [ ] A consumer can install the design system from the Git tag and render every component
- [ ] All 23 components (§7) available with their documented variants, each with a catalog entry
- [ ] Tokens reproduce the design project values (colors, type scale, spacing, effects)
- [ ] Accent override re-tints all accent-derived styles (RN-09)
- [ ] Rules RN-07, RN-08 and RN-10 are verified automatically (no inline styles, no off-palette
      colors, square corners)

**Performance / Size:**
- Static components add zero client-side behavior when rendered on the server (RN-08).
- Size budget: distributed stylesheet + components ≤ **80 KB** minified (uncompressed), fonts and brand assets excluded; enforced automatically.

**Quality Criteria:**
- [ ] **Unit tests** for every component and utility (rendering, variants, default fallback, state
      logic, accessibility)
- [ ] **End-to-end tests in a real browser** for every component: interaction (hover, focus,
      keyboard, form flows), computed brand styles, animation on/off, accent re-tint, accessibility
      and visual regression; required to merge
- [ ] Unit-test coverage of component code ≥ **95%** (lines, branches, functions, statements); enforced automatically
- [ ] No critical accessibility violations in any catalog entry
- [ ] Visual parity reviewed by the Validator against the design project cards

## 6. Glossary

| Term | Definition in this context |
|---|---|
| Design token | Named design value (color, size, font, shadow) that components reference instead of literals |
| Accent | The single hot neon color (default "neon forge" #FF7A33) from which all glow derives |
| Glow | Neon text/box shadow marking *the one important thing* per block |
| Catalog | Local, browsable gallery of every component in isolation with its variants |
| Release PR | Automated pull request proposing the next version and changelog |
| Panel variants | default (translucent card), strong (milestone/values), edge (one highlighted option), dashed ("not ours / not yet") |
| Milestone codes | LCO, LCA, IOC, RELEASE — the four UP phase gates shown by MilestoneAxis |

## 7. Component Catalog (scope)

| Group | Component | Purpose |
|---|---|---|
| brand | Wordmark | Live-type logo "scrap**up**" with neon "up" (optional flicker) and small monogram |
| brand | Backdrop | Page background: radial glows, scanlines, corner registration marks, figure label |
| actions | Button | primary / secondary / link; md / sm; optional leading glyph; link or button |
| actions | LangSwitch | EN / PT / JA switch |
| navigation | TopBar | Wordmark + nav links + active link + LangSwitch |
| navigation | Footer | Bottom bar with links and legal line |
| content | Hero | Status pill, kicker, title with glowing highlight word, lead, callout, actions |
| content | SectionHeader | Index + eyebrow + title (+ size, accent bar) + body |
| content | Eyebrow | Mono uppercase label with tone (cyan/neon/muted) and optional index |
| content | StatusPill | Mono pill with glowing dot (e.g. "BETA · COMING SOON") |
| content | Callout | Left-ruled emphasis text (sizes) |
| content | Tag | Lowercase chip (cyan / neon tones) |
| content | CodeChip | Command chip with hint (e.g. `/plugin install scrapup`) |
| content | FlowLine | Sign-off line "document → validate → deliver" |
| surfaces | Panel | Card surface: default / strong / edge / dashed; padding |
| surfaces | StatCard | Big value or title + body + mono source citation; tone |
| surfaces | FeatureCard | Index or label + title + body; accent edge (neon/cyan) |
| surfaces | StatementList | Declarative statement list (manifesto "We believe") |
| surfaces | ValueStatement | "X over Y" value pairs + note |
| process | MilestoneAxis | LCO → LCA → IOC → RELEASE axis with phase, body and current marker |
| process | PhaseSteps | Ordered steps (document / validate / deliver) |
| forms | WaitlistForm | Presentational e-mail capture (RN-13) |
| feedback | GlitchCode | Glitching numeral (404) with RGB split |

Exact props/variants per component are taken from the design project `components/**/*.d.ts` and
formalized in `plan.md`.

## 8. Resolved Points

| # | Point | Decision |
|---|---|---|
| OP-01 | Size budget | ≤ 80 KB minified (uncompressed) for stylesheet + components; fonts/assets excluded |
| OP-02 | Minimum coverage | 95% |
| OP-03 | Reduced motion | Keep animations on; per-component opt-out property (RN-18) |

> Status: **Approved** (2026-10-01). Amended 2026-10-01: unit + end-to-end test layers made explicit (§5); RN-19 secret scanning + push protection; RN-02 rewritten (approval + admin PR bypass) and RN-20..RN-23 repository security hardening. Amended 2026-10-02: RN-20 tag creation is a process rule (platform limitation).
