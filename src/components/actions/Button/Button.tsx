import type { MouseEventHandler, ReactNode } from 'react';
import { cx } from '../../../lib/cx';
import { externalLinkProps } from '../../../lib/externalLinkProps';
import { hasContent } from '../../../lib/hasContent';
import { resolveOption } from '../../../lib/resolveOption';
import './Button.css';

const VARIANTS = ['primary', 'secondary', 'link'] as const;
const SIZES = ['md', 'sm'] as const;
const TYPES = ['button', 'submit'] as const;

export type ButtonVariant = (typeof VARIANTS)[number];
export type ButtonSize = (typeof SIZES)[number];
export type ButtonType = (typeof TYPES)[number];

export interface ButtonProps {
  /** primary = solid neon with glow (default); secondary = cyan outline; link = bare cyan mono text. */
  variant?: ButtonVariant;
  /** md = 14/22 padding (hero, default); sm = 13/20 (cards). */
  size?: ButtonSize;
  /** Leading glyph — unicode only, e.g. "★", "←". Trailing "↗" goes in the label. */
  icon?: ReactNode;
  /** Renders an <a>; http(s) links open in a new tab (D-06). */
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  /** Native button type (ignored with href). Default "button". */
  type?: ButtonType;
  /** UPPERCASE label, e.g. "STAR ON GITHUB", "READ THE DOCS ↗". */
  children?: ReactNode;
  /** Accessible name; required when the button shows only an icon. */
  'aria-label'?: string;
  /** Disables the native button (ignored with href). */
  disabled?: boolean;
  className?: string;
}

/** Square-cornered mono uppercase action. */
export function Button({
  variant,
  size,
  icon,
  href,
  onClick,
  type,
  children,
  'aria-label': ariaLabel,
  disabled,
  className,
}: ButtonProps): React.JSX.Element {
  const classes = cx(
    'su-button',
    `su-button--${resolveOption(variant, VARIANTS, 'primary')}`,
    `su-button--${resolveOption(size, SIZES, 'md')}`,
    className,
  );
  const content = (
    <>
      {hasContent(icon) && (
        <span aria-hidden="true" className="su-button__icon">
          {icon}
        </span>
      )}
      {hasContent(children) && (
        <span className="su-button__label">{children}</span>
      )}
    </>
  );
  if (href) {
    return (
      <a aria-label={ariaLabel} className={classes} onClick={onClick} {...externalLinkProps(href)}>
        {content}
      </a>
    );
  }
  return (
    <button
      aria-label={ariaLabel}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={resolveOption(type, TYPES, 'button')}
    >
      {content}
    </button>
  );
}
