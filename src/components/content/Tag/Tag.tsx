import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import './Tag.css';

const TONES = ['cyan', 'quiet', 'neon'] as const;

export type TagTone = (typeof TONES)[number];

export interface TagProps {
  children?: ReactNode;
  /** cyan (default) · quiet · neon. */
  tone?: TagTone;
  className?: string;
}

/** Small mono label chip. */
export function Tag({ children, tone, className }: TagProps): React.JSX.Element | null {
  if (!hasContent(children)) return null;
  return <span className={cx('su-tag', `su-tag--${resolveOption(tone, TONES, 'cyan')}`, className)}>{children}</span>;
}
