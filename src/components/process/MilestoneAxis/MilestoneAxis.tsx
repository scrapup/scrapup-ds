import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { Panel } from '../../surfaces/Panel';
import './MilestoneAxis.css';

export interface Milestone {
  /** Milestone code, e.g. "LCO". */
  code: string;
  /** Phase it closes, e.g. "Inception". */
  phase: string;
  body?: ReactNode;
  /** Marks the milestone the product is at now (one per axis). */
  current?: boolean;
}

export interface MilestoneAxisProps {
  /** Header title. Default "LIFECYCLE — MILESTONE GATES"; '' omits it. */
  title?: string;
  /** Header meta. Default "UP AI-ASSISTED"; '' omits it. */
  meta?: string;
  milestones: readonly Milestone[];
  /** Label next to the current milestone's dot. Default "NOW · BETA". */
  currentLabel?: string;
  className?: string;
}

/** Ruled axis of milestone gates (LCO → LCA → IOC → RELEASE) with the current one glowing. */
export function MilestoneAxis({
  title = 'LIFECYCLE — MILESTONE GATES',
  meta = 'UP AI-ASSISTED',
  milestones,
  currentLabel = 'NOW · BETA',
  className,
}: MilestoneAxisProps): React.JSX.Element | null {
  if (milestones.length === 0) return null;
  const hasHeader = hasContent(title) || hasContent(meta);
  return (
    <Panel className={cx('su-milestone-axis', className)} padding="xxl" variant="strong">
      {hasHeader && (
        <div className="su-milestone-axis__header">
          {hasContent(title) && <p className="su-milestone-axis__title">{title}</p>}
          {hasContent(meta) && <p className="su-milestone-axis__meta">{meta}</p>}
        </div>
      )}
      <ol className="su-milestone-axis__steps">
        {milestones.map((milestone, index) => {
          const isCurrent = milestone.current === true;
          return (
            <li
              aria-current={isCurrent ? 'step' : undefined}
              className={cx('su-milestone-axis__step', isCurrent && 'su-milestone-axis__step--current')}
              key={`${String(index)}-${milestone.code}`}
            >
              {isCurrent && (
                <span className="su-milestone-axis__current">
                  <span aria-hidden="true" className="su-milestone-axis__dot" />
                  <span className="su-milestone-axis__current-label">{currentLabel}</span>
                </span>
              )}
              <span className="su-milestone-axis__code">{milestone.code}</span>
              <span className="su-milestone-axis__phase">{milestone.phase}</span>
              {hasContent(milestone.body) && <span className="su-milestone-axis__body">{milestone.body}</span>}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
