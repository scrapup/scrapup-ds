import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './StatusPill.css';

export interface StatusPillProps {
  children?: ReactNode;
  /** Glowing status dot before the label. Default true. */
  dot?: boolean;
  className?: string;
}

/** Square neon status pill, e.g. "BETA — PUBLIC RELEASE". */
export function StatusPill({ children, dot = true, className }: StatusPillProps): React.JSX.Element | null {
  if (!hasContent(children)) return null;
  return (
    <span className={cx('su-status-pill', className)}>
      {dot && <span aria-hidden="true" className="su-status-pill__dot" />}
      <span className="su-status-pill__label">{children}</span>
    </span>
  );
}
