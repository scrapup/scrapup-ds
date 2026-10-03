import { cx } from '../../../lib/cx';
import { resolveOption } from '../../../lib/resolveOption';
import './GlitchCode.css';

const SIZES = ['lg', 'md'] as const;

export type GlitchCodeSize = (typeof SIZES)[number];

export interface GlitchCodeProps {
  /** The numeral. Default "404". */
  children?: string | number;
  /** lg (default, 404 page) · md. */
  size?: GlitchCodeSize;
  /** RGB-split glitch and flicker (RN-18). Default true; false renders it static. */
  animated?: boolean;
  className?: string;
}

const LAYERS = ['cyan', 'magenta', 'slice'] as const;

/** Glitching numeral with cyan/magenta channel split and a slice layer. */
export function GlitchCode({ children = '404', size, animated = true, className }: GlitchCodeProps): React.JSX.Element {
  return (
    <span
      className={cx(
        'su-glitch-code',
        `su-glitch-code--${resolveOption(size, SIZES, 'lg')}`,
        animated && 'su-glitch-code--animated',
        className,
      )}
    >
      {LAYERS.map((layer) => (
        <span aria-hidden="true" className={`su-glitch-code__layer su-glitch-code__layer--${layer}`} key={layer}>
          {children}
        </span>
      ))}
      <span className="su-glitch-code__main">{children}</span>
    </span>
  );
}
