import { Fragment } from 'react';
import { Wordmark } from '../../brand/Wordmark';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { NavItem } from '../NavItem';
import type { NavLink } from '../types';
import './Footer.css';

const DEFAULT_ITEMS = ['MIT © 2026', 'scrapup.dev'] as const;

export interface FooterProps {
  /** Meta items joined by "·". Default "MIT © 2026", "scrapup.dev". */
  items?: readonly string[];
  /** Lowercase footer links. */
  links?: readonly NavLink[];
  /** Author credit. Default "Marco Antonio Luqueti Faustino"; '' omits it. */
  author?: string;
  className?: string;
}

/** Full-bleed footer band: mono wordmark, meta items, links and author. */
export function Footer({
  items = DEFAULT_ITEMS,
  links = [],
  author = 'Marco Antonio Luqueti Faustino',
  className,
}: FooterProps): React.JSX.Element {
  return (
    <footer className={cx('su-footer', className)}>
      <div className="su-footer__inner">
        <div className="su-footer__meta">
          <Wordmark className="su-footer__wordmark" flicker={false} size="xs" />
          {items.map((item, index) => (
            <Fragment key={item}>
              {index > 0 && (
                <span aria-hidden="true" className="su-footer__separator">
                  ·
                </span>
              )}
              <span className="su-footer__item">{item}</span>
            </Fragment>
          ))}
          {links.length > 0 && (
            <span className="su-footer__links">
              {links.map((link) => (
                <NavItem className="su-footer__link" key={link.label} link={link} />
              ))}
            </span>
          )}
        </div>
        {hasContent(author) && <span className="su-footer__author">{author}</span>}
      </div>
    </footer>
  );
}
