import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import './Callout.css';

const SIZES = ['sm', 'lg'] as const;

export type CalloutSize = (typeof SIZES)[number];

export interface CalloutProps {
  /** Text; <strong> inside is emphasized. */
  children?: ReactNode;
  /** sm = body copy (default); lg = display statement. */
  size?: CalloutSize;
  className?: string;
}

/** Text set off by the glowing neon left rule. */
export function Callout({ children, size, className }: CalloutProps): React.JSX.Element | null {
  if (!hasContent(children)) return null;
  return (
    <div className={cx('su-callout', `su-callout--${resolveOption(size, SIZES, 'sm')}`, className)}>
      <p className="su-callout__text">{children}</p>
    </div>
  );
}
