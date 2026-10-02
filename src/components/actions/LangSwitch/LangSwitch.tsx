import { cx } from '../../../lib/cx';
import './LangSwitch.css';

const DEFAULT_OPTIONS = ['EN', 'PT', 'JA'] as const;

export interface LangSwitchProps {
  /** Active language. Unknown values activate the first option. Default "EN". */
  value?: string;
  /** Languages offered, in order. Default EN, PT, JA. */
  options?: readonly string[];
  /** Called with the chosen option. */
  onChange?: (lang: string) => void;
  className?: string;
}

/** Segmented language switch; the active option carries the neon underline. */
export function LangSwitch({
  value = 'EN',
  options = DEFAULT_OPTIONS,
  onChange,
  className,
}: LangSwitchProps): React.JSX.Element | null {
  if (options.length === 0) return null;
  const active = options.includes(value) ? value : options[0];
  return (
    <div aria-label="Language" className={cx('su-lang-switch', className)} role="group">
      {options.map((option) => {
        const isActive = option === active;
        return (
          <button
            aria-pressed={isActive}
            className={cx('su-lang-switch__option', isActive && 'su-lang-switch__option--active')}
            key={option}
            onClick={() => onChange?.(option)}
            type="button"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
