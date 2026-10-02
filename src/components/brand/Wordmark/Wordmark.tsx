import { cx } from '../../../lib/cx';
import { externalLinkProps } from '../../../lib/externalLinkProps';
import { resolveOption } from '../../../lib/resolveOption';
import './Wordmark.css';

const SIZES = ['xs', 'sm', 'md', 'xl'] as const;
const TONES = ['dark', 'light'] as const;

export type WordmarkSize = (typeof SIZES)[number];
export type WordmarkTone = (typeof TONES)[number];

export interface WordmarkProps {
  /** xs 11.5px (footer) · sm 22px · md 24px (top bar, default) · xl 66px (hero/showcase). */
  size?: WordmarkSize;
  /** dark = on ink (default); light = on paper. */
  tone?: WordmarkTone;
  /** Neon flicker on "up" (RN-18). Default true; false renders it static. */
  flicker?: boolean;
  /** Renders the mark inside a link. */
  href?: string;
  className?: string;
}

/** The scrapup wordmark: "scrap" in light ink, "up" in neon with the flicker. Never redraw it. */
export function Wordmark({ size, tone, flicker = true, href, className }: WordmarkProps): React.JSX.Element {
  const mark = (
    // A logotype: exposed as one image named "scrapup" (WCAG 1.4.3 exempts logo text from contrast).
    <span
      aria-label="scrapup"
      className={cx(
        'su-wordmark',
        `su-wordmark--${resolveOption(size, SIZES, 'md')}`,
        `su-wordmark--${resolveOption(tone, TONES, 'dark')}`,
        flicker && 'su-wordmark--flicker',
        !href && className,
      )}
      role="img"
    >
      <span aria-hidden="true">
        scrap<span className="su-wordmark__up">up</span>
      </span>
    </span>
  );
  if (!href) return mark;
  return (
    <a className={cx('su-wordmark-link', className)} {...externalLinkProps(href)}>
      {mark}
    </a>
  );
}
