import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import { Panel } from '../Panel';
import './StatCard.css';

const TONES = ['neon', 'cyan'] as const;

export type StatCardTone = (typeof TONES)[number];

export interface StatCardProps {
  /** Big glowing figure, e.g. "+37.6%". */
  value?: ReactNode;
  /** Short heading shown only when there is no value. */
  title?: ReactNode;
  body: ReactNode;
  /** Mono citation under the body. */
  source?: ReactNode;
  /** neon (default) · cyan. */
  tone?: StatCardTone;
  className?: string;
}

/** Evidence card: a glowing value (or a title), a body and its source. */
export function StatCard({ value, title, body, source, tone, className }: StatCardProps): React.JSX.Element {
  return (
    <Panel className={cx('su-stat-card', `su-stat-card--${resolveOption(tone, TONES, 'neon')}`, className)}>
      {hasContent(value) && <p className="su-stat-card__value">{value}</p>}
      {!hasContent(value) && hasContent(title) && <p className="su-stat-card__title">{title}</p>}
      <p className="su-stat-card__body">{body}</p>
      {hasContent(source) && <p className="su-stat-card__source">{source}</p>}
    </Panel>
  );
}
