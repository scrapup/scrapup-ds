import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import { splitHighlight } from '../../../lib/splitHighlight';
import { Eyebrow } from '../Eyebrow';
import './SectionHeader.css';

const SIZES = ['md', 'xl'] as const;

export type SectionHeaderSize = (typeof SIZES)[number];

export interface SectionHeaderProps {
  /** Section number for the eyebrow. */
  index?: string | number;
  /** Eyebrow text; omitted → no eyebrow. */
  eyebrow?: ReactNode;
  title: string;
  /** Part of the title that glows (first match; ignored when not found). */
  highlight?: string;
  body?: ReactNode;
  /** md (default) · xl (manifesto opener). */
  size?: SectionHeaderSize;
  /** 68×3 neon bar under the title. */
  bar?: boolean;
  className?: string;
}

/** Section opener: eyebrow, h2 with optional glowing highlight, neon bar and body. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  highlight,
  body,
  size,
  bar = false,
  className,
}: SectionHeaderProps): React.JSX.Element {
  const parts = splitHighlight(title, highlight);
  return (
    <div className={cx('su-section-header', `su-section-header--${resolveOption(size, SIZES, 'md')}`, className)}>
      {hasContent(eyebrow) && (
        <Eyebrow className="su-section-header__eyebrow" index={index}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2 className="su-section-header__title">
        {parts ? (
          <>
            {parts[0]}
            <span className="su-section-header__highlight">{parts[1]}</span>
            {parts[2]}
          </>
        ) : (
          title
        )}
      </h2>
      {bar && <div aria-hidden="true" className="su-section-header__bar" />}
      {hasContent(body) && <p className="su-section-header__body">{body}</p>}
    </div>
  );
}
