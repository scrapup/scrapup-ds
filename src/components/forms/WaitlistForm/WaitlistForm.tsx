import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, SyntheticEvent } from 'react';
import { cx } from '../../../lib/cx';
import { hasContent } from '../../../lib/hasContent';
import { pickOption } from '../../../lib/resolveOption';
import './WaitlistForm.css';

const STATUSES = ['idle', 'submitting', 'success', 'error'] as const;
// Dot-separated domain labels: no empty label, and no overlap between label and separator (linear time).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
// Practical address limit (RFC 5321); also bounds the validation cost.
const EMAIL_MAX_LENGTH = 254;

export type WaitlistFormStatus = (typeof STATUSES)[number];

export interface WaitlistFormProps {
  /** Visually hidden input label. Default "E-mail address". */
  label?: string;
  /** Input placeholder. Default "you@domain.dev". */
  placeholder?: string;
  /** Submit label. Default "JOIN THE WAITLIST ↗". */
  cta?: string;
  /**
   * Line under the field, e.g. a privacy-notice link. Default "No spam — one message when access
   * opens." (a purpose statement the consumer must honour or replace); '' omits it.
   */
  note?: ReactNode;
  /** Success panel title. Default "You're on the list.". */
  successTitle?: string;
  /** Success panel body. Default "We'll reach out at first access. Forging the public release.". */
  successBody?: string;
  /** Shown for an empty or malformed e-mail. Default "Enter a valid e-mail address.". */
  invalidMessage?: string;
  /** Shown when onSubmit rejects or throws. Default "Something went wrong. Try again.". */
  errorMessage?: string;
  /**
   * Receives the trimmed e-mail. A rejected promise or a throw shows the error state; the error itself
   * is discarded here (no logging inside), so record it in the handler. The handler owns timeouts: a
   * never-settling promise keeps the form busy. Client-side validation is UX only — the consumer's
   * backend must re-validate, rate-limit and apply anti-bot measures.
   */
  onSubmit?: (email: string) => void | Promise<void>;
  /**
   * Controlled status: when set, it alone decides what renders (the consumer derives transitions from
   * onSubmit); unknown values are ignored. Switching between controlled and uncontrolled after mount is
   * not supported.
   */
  status?: WaitlistFormStatus;
  className?: string;
}

interface WaitlistSuccessProps {
  title: string;
  body: string;
  className?: string;
  /** Moves focus to the panel on mount, so keyboard users keep their place after the form unmounts. */
  autoFocus: boolean;
}

function WaitlistSuccess({ title, body, className, autoFocus }: WaitlistSuccessProps): React.JSX.Element {
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (autoFocus) panelRef.current?.focus();
  }, [autoFocus]);
  return (
    <div className={cx('su-waitlist-form', 'su-waitlist-form--success', className)} ref={panelRef} role="status" tabIndex={-1}>
      <span aria-hidden="true" className="su-waitlist-form__check">
        ✓
      </span>
      <div>
        <p className="su-waitlist-form__success-title">{title}</p>
        <p className="su-waitlist-form__success-body">{body}</p>
      </div>
    </div>
  );
}

/**
 * Presentational e-mail capture (RN-13): validates, delegates to onSubmit and renders the
 * idle / submitting / success / error states. No network, storage or logging inside.
 * Consumer responsibilities: legal basis and purpose of processing, a privacy notice at the point of
 * collection (see `note`), consent when required, retention/deletion and data-subject rights.
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
  const [internalStatus, setInternalStatus] = useState<WaitlistFormStatus>('idle');
  const [isInvalid, setIsInvalid] = useState(false);
  const isInFlight = useRef(false);
  const hasSubmitted = useRef(false);
  const status = pickOption(controlledStatus, STATUSES) ?? internalStatus;

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (status === 'submitting' || isInFlight.current) return;
    const value = email.trim();
    if (!EMAIL_PATTERN.test(value)) {
      setIsInvalid(true);
      return;
    }
    setIsInvalid(false);
    isInFlight.current = true;
    setInternalStatus('submitting');
    try {
      await onSubmit?.(value);
      hasSubmitted.current = true;
      setInternalStatus('success');
    } catch {
      setInternalStatus('error');
    } finally {
      isInFlight.current = false;
    }
  }

  function resolveMessage(): string | undefined {
    if (isInvalid) return invalidMessage;
    if (status === 'error') return errorMessage;
    return undefined;
  }

  if (status === 'success') {
    return <WaitlistSuccess autoFocus={hasSubmitted.current} body={successBody} className={className} title={successTitle} />;
  }

  const isSubmitting = status === 'submitting';
  const message = resolveMessage();
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
          maxLength={EMAIL_MAX_LENGTH}
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
