import { externalLinkProps } from '../../../lib/externalLinkProps';
import type { NavLink } from '../types';

interface NavItemProps {
  link: NavLink;
  className: string;
  current?: boolean;
}

/** Internal: renders a NavLink as <a> (safe link attributes, D-06) or, without href, as a <button>. */
export function NavItem({ link, className, current = false }: NavItemProps): React.JSX.Element {
  const ariaCurrent = current ? 'page' : undefined;
  if (link.href) {
    return (
      <a aria-current={ariaCurrent} className={className} onClick={link.onClick} {...externalLinkProps(link.href)}>
        {link.label}
      </a>
    );
  }
  return (
    <button aria-current={ariaCurrent} className={className} onClick={link.onClick} type="button">
      {link.label}
    </button>
  );
}
