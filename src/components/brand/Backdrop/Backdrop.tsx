import type { ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import './Backdrop.css';

export interface BackdropProps {
  /** Bottom-left frame label. Default "FIG · 01 — IDENTITY"; empty string omits it. */
  label?: string;
  /** Top-right frame label. Default "SCRAPUP.DEV"; empty string omits it. */
  site?: string;
  /** Corner marks and frame labels. Default true. */
  marks?: boolean;
  /** CRT scanline overlay. Default true. */
  scanlines?: boolean;
  /** Fills the viewport height (page-level backdrop). Default false. */
  fullHeight?: boolean;
  children?: ReactNode;
  className?: string;
}

/** The ink stage every scrapup surface sits on: ambient glows, scanlines and frame marks. */
export function Backdrop({
  label = 'FIG · 01 — IDENTITY',
  site = 'SCRAPUP.DEV',
  marks = true,
  scanlines = true,
  fullHeight = false,
  children,
  className,
}: BackdropProps): React.JSX.Element {
  return (
    <div className={cx('su-backdrop', fullHeight && 'su-backdrop--full-height', className)}>
      <div aria-hidden="true" className="su-backdrop__ambient" />
      {scanlines && <div aria-hidden="true" className="su-backdrop__scanlines" />}
      {marks && (
        <div aria-hidden="true" className="su-backdrop__frame">
          <span className="su-backdrop__mark su-backdrop__mark--left" />
          <span className="su-backdrop__mark su-backdrop__mark--right" />
          {hasContent(site) && <span className="su-backdrop__site">{site}</span>}
          {hasContent(label) && <span className="su-backdrop__label">{label}</span>}
        </div>
      )}
      <div className="su-backdrop__content">{children}</div>
    </div>
  );
}
