import { Fragment } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './FlowLine.css';

const DEFAULT_STEPS = ['scrap', 'forge', 'forged delivery'] as const;

export interface FlowLineProps {
  /** Steps joined by cyan arrows; the last one is highlighted. Default scrap → forge → forged delivery. */
  steps?: readonly string[];
  className?: string;
}

/** One-line process flow, e.g. "scrap → forge → forged delivery". */
export function FlowLine({ steps = DEFAULT_STEPS, className }: FlowLineProps): React.JSX.Element | null {
  const visibleSteps = steps.filter((step) => hasContent(step));
  if (visibleSteps.length === 0) return null;
  const lastIndex = visibleSteps.length - 1;
  return (
    <p className={cx('su-flow-line', className)}>
      {visibleSteps.map((step, index) => (
        // Steps may repeat, so the position is part of the key.
        <Fragment key={`${String(index)}-${step}`}>
          {index > 0 && (
            <span aria-hidden="true" className="su-flow-line__arrow">
              {' → '}
            </span>
          )}
          <span className={cx('su-flow-line__step', index === lastIndex && 'su-flow-line__step--last')}>{step}</span>
        </Fragment>
      ))}
    </p>
  );
}
