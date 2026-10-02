import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import './Eyebrow.css';

const TONES = ['cyan', 'neon', 'muted'] as const;

export type EyebrowTone = (typeof TONES)[number];

export interface EyebrowProps {
  /** Section number; renders the "// <index> — " prefix. */
  index?: string | number;
  /** cyan (default) · neon · muted. */
  tone?: EyebrowTone;
  children?: ReactNode;
  className?: string;
}

/** Mono uppercase section label, e.g. "// 02 — THE PROCESS". */
export function Eyebrow({ index, tone, children, className }: EyebrowProps): React.JSX.Element | null {
  if (!hasContent(children)) return null;
  return (
    <p className={cx('su-eyebrow', `su-eyebrow--${resolveOption(tone, TONES, 'cyan')}`, className)}>
      {hasContent(index) && <span className="su-eyebrow__index">{`// ${String(index)} — `}</span>}
      {children}
    </p>
  );
}
