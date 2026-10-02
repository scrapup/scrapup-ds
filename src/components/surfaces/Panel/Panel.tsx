import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { pickOption, resolveOption } from '../../../lib/resolveOption';
import './Panel.css';

const VARIANTS = ['default', 'strong', 'edge', 'dashed'] as const;
const PADDINGS = ['md', 'lg', 'xl', 'xxl'] as const;
const EDGES = ['neon', 'cyan'] as const;
const ELEMENTS = ['div', 'section', 'article'] as const;

export type PanelVariant = (typeof VARIANTS)[number];
export type PanelPadding = (typeof PADDINGS)[number];
export type PanelAccentEdge = (typeof EDGES)[number];
export type PanelElement = (typeof ELEMENTS)[number];

export interface PanelProps {
  /** default (glass) · strong (accent border + glow) · edge (accent wash) · dashed ("not ours / not yet"). */
  variant?: PanelVariant;
  /** 2px left rule in the accent (neon) or cyan. */
  accentEdge?: PanelAccentEdge;
  /** md 24px (default) · lg 28px · xl 32px · xxl 42px. */
  padding?: PanelPadding;
  /** Rendered element. Default div. */
  as?: PanelElement;
  /** Element id (e.g. for in-page links). */
  id?: string;
  /** Names a section/article landmark by the id of its heading. */
  'aria-labelledby'?: string;
  children?: ReactNode;
  className?: string;
}

/** Square surface every card is built on. */
export function Panel({
  variant,
  accentEdge,
  padding,
  as,
  id,
  'aria-labelledby': labelledBy,
  children,
  className,
}: PanelProps): React.JSX.Element {
  const Element = resolveOption(as, ELEMENTS, 'div');
  const edge = pickOption(accentEdge, EDGES);
  return (
    <Element
      aria-labelledby={labelledBy}
      className={cx(
        'su-panel',
        `su-panel--${resolveOption(variant, VARIANTS, 'default')}`,
        `su-panel--pad-${resolveOption(padding, PADDINGS, 'md')}`,
        edge && `su-panel--edge-${edge}`,
        className,
      )}
      id={id}
    >
      {children}
    </Element>
  );
}
