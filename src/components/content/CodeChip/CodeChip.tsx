import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './CodeChip.css';

export interface CodeChipProps {
  /** The command or code, rendered in <code>. */
  children?: ReactNode;
  /** Dim label before the code, e.g. "install:". */
  hint?: ReactNode;
  className?: string;
}

/** Inline cyan code chip with an optional dim hint. */
export function CodeChip({ children, hint, className }: CodeChipProps): React.JSX.Element | null {
  if (!hasContent(children)) return null;
  return (
    <span className={cx('su-code-chip', className)}>
      {hasContent(hint) && <span className="su-code-chip__hint">{hint}</span>}
      <code className="su-code-chip__code">{children}</code>
    </span>
  );
}
