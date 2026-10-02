import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './StatementList.css';

export interface StatementListProps {
  /** Statements in order; empty entries are skipped. */
  items: readonly ReactNode[];
  className?: string;
}

/** Ruled, numbered list of display statements (manifesto beliefs). */
export function StatementList({ items, className }: StatementListProps): React.JSX.Element | null {
  const statements = items.filter((item) => hasContent(item));
  if (statements.length === 0) return null;
  return (
    <ol className={cx('su-statement-list', className)}>
      {statements.map((statement, index) => (
        // Statements are positional (numbered), so the index is their identity.
        <li className="su-statement-list__item" key={String(index)}>
          <span aria-hidden="true" className="su-statement-list__number">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="su-statement-list__text">{statement}</span>
        </li>
      ))}
    </ol>
  );
}
