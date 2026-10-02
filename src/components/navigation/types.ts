import type { MouseEventHandler } from 'react';

interface NavLinkBase {
  /** Visible text. */
  label: string;
  /** Stable identity for `active` matching and React keys; defaults to `label` (use it with localized labels). */
  id?: string;
}

/** A navigation entry: a link (href, optional onClick) or an action button (onClick only). */
export type NavLink =
  | (NavLinkBase & { href: string; onClick?: MouseEventHandler<HTMLElement> })
  | (NavLinkBase & { href?: undefined; onClick: MouseEventHandler<HTMLElement> });

/** Identity of a nav link: its id, or its label. */
export function navLinkKey(link: NavLink): string {
  return link.id ?? link.label;
}
