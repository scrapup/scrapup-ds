import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { WaitlistForm } from './WaitlistForm';

function deferred(): { promise: Promise<void>; resolve: () => void; reject: (error: Error) => void } {
  let resolve!: () => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe('WaitlistForm', () => {
  it('renders a labelled e-mail field, the CTA and the note', () => {
    render(<WaitlistForm />);
    const input = screen.getByLabelText('E-mail address');
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('you@domain.dev');
    expect(screen.getByRole('button', { name: 'JOIN THE WAITLIST ↗' }).getAttribute('type')).toBe('submit');
    expect(screen.getByText('No spam — one message when access opens.')).not.toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each(['', '   ', 'not-an-email', 'a@b', 'a b@c.dev'])('rejects %j with the invalid message and no call', async (value) => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    if (value) await user.type(screen.getByLabelText('E-mail address'), value);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('alert').textContent).toBe('Enter a valid e-mail address.');
    expect(screen.getByLabelText('E-mail address').getAttribute('aria-invalid')).toBe('true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed e-mail and shows the success panel (sync handler)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), '  ada@scrapup.dev ');
    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith('ada@scrapup.dev');
    expect(screen.getByRole('status').textContent).toContain("You're on the list.");
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('reaches success without a handler', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.getByRole('status').textContent).toContain("We'll reach out at first access.");
  });

  it('shows submitting state, ignores double submit, then succeeds when the promise resolves', async () => {
    const pending = deferred();
    const onSubmit = vi.fn(() => pending.promise);
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev');
    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    await user.type(screen.getByLabelText('E-mail address'), '{Enter}');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve();
      await pending.promise;
    });
    expect(screen.getByRole('status')).not.toBeNull();
  });

  it('ignores a second submit fired in the same tick, before re-render', async () => {
    const pending = deferred();
    const onSubmit = vi.fn(() => pending.promise);
    const user = userEvent.setup();
    const { container } = render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev');
    const form = container.querySelector('form');
    act(() => {
      form?.requestSubmit();
      form?.requestSubmit();
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
    await act(async () => {
      pending.resolve();
      await pending.promise;
    });
  });

  it('shows the error message, keeps the value and allows resubmitting when the promise rejects', async () => {
    const first = deferred();
    const onSubmit = vi.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(undefined);
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev');
    await user.click(screen.getByRole('button'));
    await act(async () => {
      first.reject(new Error('network'));
      await first.promise.catch(() => undefined);
    });
    expect(screen.getByRole('alert').textContent).toBe('Something went wrong. Try again.');
    expect(screen.getByLabelText('E-mail address')).toHaveProperty('value', 'ada@scrapup.dev');
    expect(screen.getByRole('button')).toHaveProperty('disabled', false);
    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('status')).not.toBeNull();
  });

  it('shows the error when the handler throws synchronously', async () => {
    const user = userEvent.setup();
    render(
      <WaitlistForm
        onSubmit={() => {
          throw new Error('boom');
        }}
      />,
    );
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.getByRole('alert').textContent).toBe('Something went wrong. Try again.');
  });

  it('clears the invalid message once a valid e-mail is submitted', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('alert')).not.toBeNull();
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each([
    ['success', 'status'],
    ['error', 'alert'],
  ] as const)('renders the controlled %s status', (status, role) => {
    render(<WaitlistForm status={status} />);
    expect(screen.getByRole(role)).not.toBeNull();
  });

  it('renders the controlled submitting status and ignores submits', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} status="submitting" />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the controlled status over internal state', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm status="idle" />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByLabelText('E-mail address')).not.toBeNull();
  });

  it('ignores an unknown controlled status (D-05)', () => {
    render(<WaitlistForm status={'done' as never} />);
    expect(screen.getByLabelText('E-mail address')).not.toBeNull();
  });

  it('uses custom copy and omits an empty note (D-07)', () => {
    render(<WaitlistForm cta="ENTRAR ↗" label="E-mail" note="" placeholder="voce@dominio.dev" />);
    expect(screen.getByLabelText('E-mail').getAttribute('placeholder')).toBe('voce@dominio.dev');
    expect(screen.getByRole('button', { name: 'ENTRAR ↗' })).not.toBeNull();
    expect(document.querySelector('.su-waitlist-form__note')).toBeNull();
  });

  it('appends className to the root', () => {
    const { container } = render(<WaitlistForm className="extra" />);
    expect(container.firstElementChild?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations (idle, invalid and success)', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(<WaitlistForm />);
    await expectNoA11yViolations(container);
    await user.click(screen.getByRole('button'));
    await expectNoA11yViolations(container);
    rerender(<WaitlistForm status="success" />);
    await expectNoA11yViolations(container);
  });
});
