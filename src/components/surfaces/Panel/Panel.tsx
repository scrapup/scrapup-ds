import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { resolveOption } from '../../../lib/resolveOption';
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
  children?: ReactNode;
  className?: string;
}

/** Square surface every card is built on. */
export function Panel({ variant, accentEdge, padding, as, children, className }: PanelProps): React.JSX.Element {
  const Element = resolveOption(as, ELEMENTS, 'div');
  const edge = (EDGES as readonly unknown[]).includes(accentEdge) ? accentEdge : undefined;
  return (
    <Element
      className={cx(
        'su-panel',
        `su-panel--${resolveOption(variant, VARIANTS, 'default')}`,
        `su-panel--pad-${resolveOption(padding, PADDINGS, 'md')}`,
        edge && `su-panel--edge-${edge}`,
        className,
      )}
    >
      {children}
    </Element>
  );
}
