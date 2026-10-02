import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { renderHighlight } from '../../../lib/renderHighlight';
import { Callout } from '../Callout';
import { StatusPill } from '../StatusPill';
import './Hero.css';

export interface HeroProps {
  /** Status pill text, e.g. "BETA — PUBLIC RELEASE". */
  status?: ReactNode;
  /** Mono line above the title. */
  kicker?: ReactNode;
  title: string;
  /** Part of the title that glows (first match; ignored when not found). */
  highlight?: string;
  lead?: ReactNode;
  /** Text set off by the neon rule under the lead. */
  callout?: ReactNode;
  /** Buttons row. */
  actions?: ReactNode;
  className?: string;
}

/** Page hero: status, kicker, h1 with a glowing highlight, lead, callout and actions. */
export function Hero({ status, kicker, title, highlight, lead, callout, actions, className }: HeroProps): React.JSX.Element {
  return (
    <div className={cx('su-hero', className)}>
      {hasContent(status) && (
        <div className="su-hero__status">
          <StatusPill>{status}</StatusPill>
        </div>
      )}
      {hasContent(kicker) && <p className="su-hero__kicker">{kicker}</p>}
      <h1 className="su-hero__title">
        {renderHighlight(title, highlight, 'su-hero__highlight')}
      </h1>
      {hasContent(lead) && <p className="su-hero__lead">{lead}</p>}
      {hasContent(callout) && (
        <div className="su-hero__callout">
          <Callout>{callout}</Callout>
        </div>
      )}
      {hasContent(actions) && <div className="su-hero__actions">{actions}</div>}
    </div>
  );
}
