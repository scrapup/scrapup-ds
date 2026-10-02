import { LangSwitch } from '../../actions/LangSwitch';
import { Wordmark } from '../../brand/Wordmark';
import { cx } from '../../../lib/cx';
import { externalLinkProps } from '../../../lib/externalLinkProps';
import { hasContent } from '../../../lib/hasContent';
import { NavItem } from '../NavItem';
import type { NavLink } from '../types';
import './TopBar.css';

export interface TopBarProps {
  /** Mono line next to the wordmark. Default "AI-assisted Unified Process"; '' omits it. */
  tagline?: string;
  /** Uppercase navigation links. Empty → no <nav>. */
  links?: readonly NavLink[];
  /** Label of the current page's link (aria-current="page"). */
  active?: string;
  /** Active language for the switch. Default "EN". */
  lang?: string;
  /** Shows the language switch when given. */
  onLang?: (lang: string) => void;
  /** Repository label. Default "github.com/scrapup"; '' omits the link. */
  repo?: string;
  /** Repository URL. Default "https://github.com/scrapup/scrapup". */
  repoHref?: string;
  /** Wordmark link target. */
  homeHref?: string;
  className?: string;
}

/** Page header: wordmark + tagline, navigation, language switch and repository link. */
export function TopBar({
  tagline = 'AI-assisted Unified Process',
  links = [],
  active,
  lang = 'EN',
  onLang,
  repo = 'github.com/scrapup',
  repoHref = 'https://github.com/scrapup/scrapup',
  homeHref,
  className,
}: TopBarProps): React.JSX.Element {
  return (
    <header className={cx('su-top-bar', className)}>
      <div className="su-top-bar__brand">
        <Wordmark href={homeHref} />
        {hasContent(tagline) && <span className="su-top-bar__tagline">{tagline}</span>}
      </div>
      <div className="su-top-bar__actions">
        {links.length > 0 && (
          <nav aria-label="Main" className="su-top-bar__nav">
            {links.map((link) => {
              const isActive = link.label === active;
              return (
                <NavItem
                  className={cx('su-top-bar__link', isActive && 'su-top-bar__link--active')}
                  current={isActive}
                  key={link.label}
                  link={link}
                />
              );
            })}
          </nav>
        )}
        {onLang && <LangSwitch onChange={onLang} value={lang} />}
        {hasContent(repo) && (
          <a className="su-top-bar__repo" {...externalLinkProps(repoHref)}>
            <span className="su-top-bar__repo-label">{repo}</span>
            <span aria-hidden="true" className="su-top-bar__repo-arrow">
              ↗
            </span>
          </a>
        )}
      </div>
    </header>
  );
}
