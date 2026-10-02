import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { Panel } from '../Panel';
import './ValueStatement.css';

export interface ValueStatementProps {
  /** Rows of [preferred, rest], e.g. ["Contracts", "over prompts."]. */
  pairs: readonly (readonly [string, string])[];
  note?: ReactNode;
  className?: string;
}

/** Manifesto-style value rows: the preferred term glows, the rest stays grey. */
export function ValueStatement({ pairs, note, className }: ValueStatementProps): React.JSX.Element | null {
  if (pairs.length === 0) return null;
  return (
    <Panel className={cx('su-value-statement', className)} padding="xxl">
      <div className="su-value-statement__rows">
        {pairs.map(([preferred, rest], index) => (
          <p className="su-value-statement__row" key={`${String(index)}-${preferred}`}>
            <span className="su-value-statement__preferred">{preferred}</span> {rest}
          </p>
        ))}
      </div>
      {hasContent(note) && <p className="su-value-statement__note">{note}</p>}
    </Panel>
  );
}
