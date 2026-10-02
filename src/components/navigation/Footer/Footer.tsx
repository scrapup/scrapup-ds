import { Fragment } from 'react';
import { Wordmark } from '../../brand/Wordmark';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { NavItem } from '../NavItem';
import { navLinkKey } from '../types';
import type { NavLink } from '../types';
import './Footer.css';

const DEFAULT_ITEMS = ['MIT © 2026', 'scrapup.dev'] as const;
const DEFAULT_AUTHOR = 'Marco Antonio Luqueti Faustino';

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
  author = DEFAULT_AUTHOR,
  className,
}: FooterProps): React.JSX.Element {
  const visibleItems = items.filter((item) => hasContent(item));
  const visibleLinks = links.filter((link) => hasContent(link.label));
  return (
    <footer className={cx('su-footer', className)}>
      <div className="su-footer__inner">
        <div className="su-footer__meta">
          <Wordmark className="su-footer__wordmark" flicker={false} size="xs" />
          {visibleItems.map((item, index) => (
            <Fragment key={`${String(index)}-${item}`}>
              {index > 0 && (
                <span aria-hidden="true" className="su-footer__separator">
                  ·
                </span>
              )}
              <span className="su-footer__item">{item}</span>
            </Fragment>
          ))}
          {visibleLinks.length > 0 && (
            <span className="su-footer__links">
              {visibleLinks.map((link, index) => (
                <NavItem className="su-footer__link" key={`${String(index)}-${navLinkKey(link)}`} link={link} />
              ))}
            </span>
          )}
        </div>
        {hasContent(author) && <span className="su-footer__author">{author}</span>}
      </div>
    </footer>
  );
}
