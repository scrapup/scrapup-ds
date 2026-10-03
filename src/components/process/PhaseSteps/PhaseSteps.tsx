import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './PhaseSteps.css';

export interface PhaseStep {
  /** Lowercase step title, e.g. "document". */
  title: string;
  body?: ReactNode;
}

export interface PhaseStepsProps {
  /** Steps in order; steps without a title are skipped. */
  steps: readonly PhaseStep[];
  className?: string;
}

/** Column-ruled, numbered process steps. */
export function PhaseSteps({ steps, className }: PhaseStepsProps): React.JSX.Element | null {
  const visibleSteps = steps.filter((step) => hasContent(step.title));
  if (visibleSteps.length === 0) return null;
  return (
    <ol className={cx('su-phase-steps', className)}>
      {visibleSteps.map((step, index) => (
        <li className="su-phase-steps__step" key={`${String(index)}-${step.title}`}>
          <span aria-hidden="true" className="su-phase-steps__number">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="su-phase-steps__title">{step.title}</span>
          {hasContent(step.body) && <span className="su-phase-steps__body">{step.body}</span>}
        </li>
      ))}
    </ol>
  );
}
