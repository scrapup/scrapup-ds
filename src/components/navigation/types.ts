import type { MouseEventHandler } from 'react';

/** A navigation entry: a link when href is set, otherwise an action button. */
export interface NavLink {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}
