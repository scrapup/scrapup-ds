import { useId, useRef, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { pickOption } from '../../../lib/resolveOption';
import './WaitlistForm.css';

const STATUSES = ['idle', 'submitting', 'success', 'error'] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistStatus = (typeof STATUSES)[number];

export interface WaitlistFormProps {
  /** Visually hidden input label. Default "E-mail address". */
  label?: string;
  placeholder?: string;
  cta?: string;
  /** Line under the field; '' omits it. */
  note?: string;
  successTitle?: string;
  successBody?: string;
  invalidMessage?: string;
  errorMessage?: string;
  /** Receives the trimmed e-mail. A rejected promise or a throw shows the error state. */
  onSubmit?: (email: string) => void | Promise<void>;
  /** Controlled status: overrides the internal state. */
  status?: WaitlistStatus;
  className?: string;
}

/**
 * Presentational e-mail capture (RN-13): validates, delegates to onSubmit and renders the
 * idle / submitting / success / error states. No network, storage or logging inside.
 */
export function WaitlistForm({
  label = 'E-mail address',
  placeholder = 'you@domain.dev',
  cta = 'JOIN THE WAITLIST ↗',
  note = 'No spam — one message when access opens.',
  successTitle = "You're on the list.",
  successBody = "We'll reach out at first access. Forging the public release.",
  invalidMessage = 'Enter a valid e-mail address.',
  errorMessage = 'Something went wrong. Try again.',
  onSubmit,
  status: controlledStatus,
  className,
}: WaitlistFormProps): React.JSX.Element {
  const inputId = useId();
  const messageId = useId();
  const [email, setEmail] = useState('');
  const [internalStatus, setInternalStatus] = useState<WaitlistStatus>('idle');
  const [isInvalid, setIsInvalid] = useState(false);
  const inFlight = useRef(false);
  const status = pickOption(controlledStatus, STATUSES) ?? internalStatus;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (status === 'submitting' || inFlight.current) return;
    const value = email.trim();
    if (!EMAIL.test(value)) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);
    inFlight.current = true;
    setInternalStatus('submitting');
    try {
      await onSubmit?.(value);
      setInternalStatus('success');
    } catch {
      setInternalStatus('error');
    } finally {
      inFlight.current = false;
    }
  }

  if (status === 'success') {
    return (
      <div className={cx('su-waitlist-form', 'su-waitlist-form--success', className)} role="status">
        <span aria-hidden="true" className="su-waitlist-form__check">
          ✓
        </span>
        <div>
          <p className="su-waitlist-form__success-title">{successTitle}</p>
          <p className="su-waitlist-form__success-body">{successBody}</p>
        </div>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';
  const message = isInvalid ? invalidMessage : status === 'error' ? errorMessage : undefined;
  return (
    <form
      className={cx('su-waitlist-form', className)}
      noValidate
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
    >
      <label className="su-waitlist-form__label" htmlFor={inputId}>
        {label}
      </label>
      <div className="su-waitlist-form__field">
        <input
          aria-describedby={message ? messageId : undefined}
          aria-invalid={isInvalid || undefined}
          autoComplete="email"
          className="su-waitlist-form__input"
          id={inputId}
          name="email"
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          placeholder={placeholder}
          type="email"
          value={email}
        />
        <button aria-busy={isSubmitting} className="su-waitlist-form__submit" disabled={isSubmitting} type="submit">
          {cta}
        </button>
      </div>
      {message && (
        <p className="su-waitlist-form__message" id={messageId} role="alert">
          {message}
        </p>
      )}
      {hasContent(note) && <p className="su-waitlist-form__note">{note}</p>}
    </form>
  );
}
