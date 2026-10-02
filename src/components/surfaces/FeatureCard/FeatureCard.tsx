import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import { Panel } from '../Panel';
import type { PanelAccentEdge } from '../Panel';
import './FeatureCard.css';

const LABEL_TONES = ['neon', 'cyan'] as const;

export type FeatureCardLabelTone = (typeof LABEL_TONES)[number];

export interface FeatureCardProps {
  /** Neon mono index, e.g. "01". */
  index?: ReactNode;
  /** Tracked mono label, e.g. "ARCHITECT" (makes the title larger). */
  label?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  accentEdge?: PanelAccentEdge;
  /** neon (default) · cyan. */
  labelTone?: FeatureCardLabelTone;
  className?: string;
}

/** Feature or role card: index or label, a title (h3) and a body. */
export function FeatureCard({
  index,
  label,
  title,
  body,
  accentEdge,
  labelTone,
  className,
}: FeatureCardProps): React.JSX.Element {
  const isLabelled = hasContent(label);
  return (
    <Panel accentEdge={accentEdge} className={cx('su-feature-card', isLabelled && 'su-feature-card--labelled', className)}>
      {hasContent(index) && <p className="su-feature-card__index">{index}</p>}
      {isLabelled && (
        <p
          className={cx(
            'su-feature-card__label',
            `su-feature-card__label--${resolveOption(labelTone, LABEL_TONES, 'neon')}`,
          )}
        >
          {label}
        </p>
      )}
      <h3 className="su-feature-card__title">{title}</h3>
      {hasContent(body) && <p className="su-feature-card__body">{body}</p>}
    </Panel>
  );
}
