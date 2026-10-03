# scrapup-ds

**English** | [Português](README.pt.md) | [日本語](README.ja.md)

`@scrapup/ds` is the **scrapup** design system: brand tokens, brand assets and 23 React components,
ported from the scrapup design project. It gives every scrapup surface the same look from one
stylesheet and one component library.

Status: Beta. The API may change before 1.0.

## Install

Install from a Git tag (the package is not published to npm):

```bash
npm i github:scrapup/scrapup-ds#v0.1.1 # x-release-please-version
```

Requirements: Node.js 24 or later, React 19 (`react` and `react-dom` are peer dependencies).
The package builds itself on install (`prepare`).

### Install scripts

Because the package is installed from Git, npm runs its `prepare` script to build `dist/`.

- npm 11 prints an `allow-scripts` warning for `@scrapup/ds`. In current npm releases the warning is
  advisory and the build still runs; npm states that a future release will block unreviewed install
  scripts. Approve the package once to record it in your `package.json` (`allowScripts`, pinned to
  the installed commit):

```bash
npm approve-scripts @scrapup/ds
```

- With install scripts disabled (`--ignore-scripts` or `ignore-scripts=true`), `dist/` is not built
  and the package cannot be imported. Allow scripts for this package, or run the install without
  that flag.

## Usage

Import the stylesheet once, at the entry of your app, then use the components:

```tsx
import '@scrapup/ds/styles.css';
import { Button, Panel } from '@scrapup/ds';

export function Example() {
  return (
    <Panel variant="strong">
      <Button>JOIN THE WAITLIST ↗</Button>
    </Panel>
  );
}
```

| Entry | Contents |
|---|---|
| `@scrapup/ds` | React components and their TypeScript types |
| `@scrapup/ds/styles.css` | Webfonts, tokens, base styles and component styles |
| `@scrapup/ds/tokens.css` | Tokens (custom properties) and brand keyframes only: no fonts, no base or component styles |
| `@scrapup/ds/assets/*` | Brand assets (logos) |

## Components

| Group | Components |
|---|---|
| brand | `Wordmark`, `Backdrop` |
| actions | `Button`, `LangSwitch` |
| navigation | `TopBar`, `Footer` |
| content | `Hero`, `SectionHeader`, `Eyebrow`, `StatusPill`, `Callout`, `Tag`, `CodeChip`, `FlowLine` |
| surfaces | `Panel`, `StatCard`, `FeatureCard`, `StatementList`, `ValueStatement` |
| process | `MilestoneAxis`, `PhaseSteps` |
| forms | `WaitlistForm` |
| feedback | `GlitchCode` |

Props and variants of each component are documented in its TypeScript types and in the local
catalog (see Local catalog below).

## Accent theming

The primary accent is neon (`--su-neon`). Override `--accent` on `:root` to re-tint the system:

```css
:root {
  --accent: var(--su-cyan);
}
```

Set the override on `:root`, not on a subtree. The derived tokens (`--glow-*`, `--shadow-*`,
`--border-accent*`, `--surface-accent-*`) are declared on `:root` and resolve `--accent` there; a
subtree override changes `--accent` but not the derived tokens.

## Assets

Brand assets ship in `assets/logos/` and are exported as `@scrapup/ds/assets/logos/<file>`:

| File | Use |
|---|---|
| `scrapup-wordmark-dark.png`, `scrapup-wordmark-light.png` | Wordmark on dark / light backgrounds |
| `scrapup-wordmark.gif`, `scrapup-square.gif` | Animated wordmark / square mark |
| `scrapup-avatar.png` | Avatar and app-icon tile |
| `scrapup-favicon.png` | Favicon |
| `scrapup-social.png` | Social preview |

```tsx
import wordmark from '@scrapup/ds/assets/logos/scrapup-wordmark-dark.png';
```

## Animations

Animations are part of the brand and are on by default. They do not follow the user's
reduced-motion preference; each animated component offers a property for a static rendering:

| Component | Property |
|---|---|
| `Wordmark` | `flicker={false}` |
| `GlitchCode` | `animated={false}` |
| `Backdrop` | `scanlines={false}` |

## Brand rules

- Square corners. Exceptions: status dots and avatar/app-icon tiles.
- 1px cyan-tinted hairlines; dashed borders mean "not ours / not yet".
- No backdrop blur, no emoji; unicode glyphs serve as icons.
- The product name is always lowercase: **scrapup**.
- Use the wordmark component or the shipped assets; never redraw the wordmark.
- Style with tokens only: no inline styles, no colors outside the palette.

## Fonts and privacy

`styles.css` loads Space Grotesk, IBM Plex Sans, IBM Plex Mono and Noto Sans JP from Google Fonts.
Each font stack has a local fallback, so the page still renders when the request is blocked.

- The browser requests the fonts from `fonts.googleapis.com` and `fonts.gstatic.com`, which exposes
  the visitor's IP address to Google. Cover it in your privacy notice, or use `tokens.css` and serve
  the fonts yourself.
- With a Content Security Policy, allow `style-src https://fonts.googleapis.com` and
  `font-src https://fonts.gstatic.com`.
- Optional preconnect hints:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## WaitlistForm

`WaitlistForm` is presentational: it validates the e-mail, calls `onSubmit` and renders the idle,
submitting, success and error states. It never sends, stores or logs data. The consumer owns:

- the request, its timeout, error logging, server-side validation, rate limiting and anti-bot measures;
- the legal basis and purpose of processing, consent when required, retention and data-subject rights;
- the privacy notice at the point of collection (pass it through the `note` property).

```tsx
<WaitlistForm
  note={<a href="/privacy">How we use your e-mail</a>}
  onSubmit={async (email) => {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error(`Waitlist request failed: ${response.status}`);
  }}
/>
```

## Local catalog

The catalog (Storybook) runs locally only:

```bash
npm ci
npm run storybook
```

It opens at `http://localhost:6006`.

## Releases

Versioning is automated by release-please from Conventional Commit PR titles (squash merge):
`fix:` releases a patch, `feat:` a minor version (while below 1.0). Each release creates a `vX.Y.Z`
tag, a GitHub Release and a `CHANGELOG.md` entry. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) © 2026 scrapup
