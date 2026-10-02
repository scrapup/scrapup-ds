import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import './foundations.css';

const ACCENTS = ['neon', 'pink', 'cyan', 'violet'] as const;
type Accent = (typeof ACCENTS)[number];

const COLOR_GROUPS: Record<string, readonly string[]> = {
  Ink: ['ink-0', 'ink-1', 'ink-2', 'ink-3', 'ink-4'],
  Foreground: ['fg-1', 'fg-2', 'fg-3', 'fg-4', 'fg-5', 'fg-6', 'fg-7', 'fg-faint', 'fg-dim'],
  Signal: ['neon', 'neon-light', 'cyan', 'violet', 'magenta', 'pink'],
  Lines: ['line-faint', 'line-soft', 'line', 'line-dashed', 'line-strong', 'line-input'],
  Paper: ['paper', 'paper-ink'],
};
const SPACES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

interface TokensProps {
  /**
   * Accent override (RN-09): neon (default) or one of the approved alternates. The override is
   * applied on :root, because the accent-derived tokens (--glow-*, --shadow-*) resolve there.
   */
  accent: Accent;
}

function useRootAccent(accent: Accent): void {
  useEffect(() => {
    const root = document.documentElement;
    if (accent === 'neon') delete root.dataset.suAccent;
    else root.dataset.suAccent = accent;
    return () => {
      delete root.dataset.suAccent;
    };
  }, [accent]);
}

function Tokens({ accent }: TokensProps): React.JSX.Element {
  useRootAccent(accent);
  return (
    <main className="su-foundations">
      <section aria-labelledby="accent-title">
        <h2 className="su-foundations__title" id="accent-title">
          Accent
        </h2>
        <ul className="su-foundations__grid">
          <li>
            <div className="su-foundations__swatch su-foundations__accent" data-testid="accent-swatch" />
            <span className="su-foundations__label">--accent</span>
          </li>
          <li>
            <span className="su-foundations__glow" data-testid="glow-sample">
              JOIN THE WAITLIST ↗
            </span>
          </li>
        </ul>
      </section>
      {Object.entries(COLOR_GROUPS).map(([group, tokens]) => (
        <section aria-label={group} key={group}>
          <h2 className="su-foundations__title">{group}</h2>
          <ul className="su-foundations__grid">
            {tokens.map((token) => (
              <li key={token}>
                <div
                  className={`su-foundations__swatch su-foundations__swatch--${token}`}
                  data-testid="swatch"
                />
                <span className="su-foundations__label">--su-{token}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <section aria-labelledby="type-title">
        <h2 className="su-foundations__title" id="type-title">
          Type
        </h2>
        <p className="su-foundations__display" data-testid="type-display">
          From scrap to forged delivery
        </p>
        <p className="su-foundations__body" data-testid="type-body">
          An open, AI-assisted Unified Process for engineering teams.
        </p>
        <p className="su-foundations__mono" data-testid="type-mono">
          LCO → LCA → IOC → RELEASE
        </p>
      </section>
      <section aria-labelledby="space-title">
        <h2 className="su-foundations__title" id="space-title">
          Spacing
        </h2>
        <ul className="su-foundations__grid">
          {SPACES.map((step) => (
            <li key={step}>
              <div className={`su-foundations__space su-foundations__space--${step}`} />
              <span className="su-foundations__label">--space-{step}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

const meta = {
  title: 'Foundations/Tokens',
  component: Tokens,
  args: { accent: 'neon' },
  argTypes: { accent: { control: 'inline-radio', options: ACCENTS } },
} satisfies Meta<typeof Tokens>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
