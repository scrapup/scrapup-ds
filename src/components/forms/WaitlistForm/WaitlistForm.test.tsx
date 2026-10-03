import { act, fireEvent, render, screen } from '@testing-library/react';
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
    expect(screen.getByText('No spam — one message when access opens.').tagName).toBe('P');
    expect(input.getAttribute('maxlength')).toBe('254');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each(['', '   ', 'not-an-email', 'a@b', 'a b@c.dev', 'a@b..c', 'a@.b', 'a@b.c.'])('rejects %j with the invalid message and no call', async (value) => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    if (value) await user.type(screen.getByLabelText('E-mail address'), value);
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('alert').textContent).toBe('Enter a valid e-mail address.');
    const input = screen.getByLabelText('E-mail address');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(screen.getByRole('alert').id);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('accepts an address with dotted local part and subdomains', () => {
    const onSubmit = vi.fn();
    render(<WaitlistForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('E-mail address'), { target: { value: 'a.b@c.d.e' } });
    fireEvent.submit(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith('a.b@c.d.e');
  });

  it('rejects a long run of dots after the @ in linear time', () => {
    const onSubmit = vi.fn();
    render(<WaitlistForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('E-mail address'), { target: { value: `a@${'.'.repeat(50_000)}@` } });
    const start = performance.now();
    fireEvent.submit(screen.getByRole('button'));
    expect(performance.now() - start).toBeLessThan(100);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits the trimmed e-mail and shows the success panel (sync handler)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), '  ada@scrapup.dev ');
    await user.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledWith('ada@scrapup.dev');
    const panel = screen.getByRole('status');
    expect(panel.textContent).toContain("You're on the list.");
    expect(document.activeElement).toBe(panel);
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('reaches success without a handler', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.getByRole('status').textContent).toContain("We'll reach out at first access.");
  });

  it('shows the submitting state, then succeeds when the promise resolves', async () => {
    const pending = deferred();
    const onSubmit = vi.fn(() => pending.promise);
    const user = userEvent.setup();
    render(<WaitlistForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev');
    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toHaveProperty('disabled', true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    await act(async () => {
      pending.resolve();
      await pending.promise;
    });
    expect(screen.getByRole('status').textContent).toContain("You're on the list.");
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
    expect(screen.getByRole('status').textContent).toContain("You're on the list.");
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
    expect(screen.getByRole('alert').textContent).toBe('Enter a valid e-mail address.');
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it.each([
    ['success', 'status', "You're on the list."],
    ['error', 'alert', 'Something went wrong. Try again.'],
  ] as const)('renders the controlled %s status', (status, role, text) => {
    render(<WaitlistForm status={status} />);
    expect(screen.getByRole(role).textContent).toContain(text);
  });

  it('does not steal focus when rendered with the controlled success status', () => {
    render(<WaitlistForm status="success" />);
    expect(document.activeElement).toBe(document.body);
  });

  it('marks the button busy under the controlled submitting status', () => {
    render(<WaitlistForm status="submitting" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button).toHaveProperty('disabled', true);
  });

  it('ignores a programmatic submit while the controlled status is submitting', () => {
    const onSubmit = vi.fn();
    const { container } = render(<WaitlistForm onSubmit={onSubmit} status="submitting" />);
    fireEvent.change(screen.getByLabelText('E-mail address'), { target: { value: 'ada@scrapup.dev' } });
    act(() => {
      container.querySelector('form')?.requestSubmit();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('keeps the controlled status over internal state', async () => {
    const user = userEvent.setup();
    render(<WaitlistForm status="idle" />);
    await user.type(screen.getByLabelText('E-mail address'), 'ada@scrapup.dev{Enter}');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByLabelText('E-mail address').tagName).toBe('INPUT');
  });

  it('ignores an unknown controlled status (D-05)', () => {
    render(<WaitlistForm status={'done' as never} />);
    expect(screen.getByLabelText('E-mail address').tagName).toBe('INPUT');
  });

  it('uses custom copy and omits an empty note (D-07)', () => {
    render(<WaitlistForm cta="ENTRAR ↗" label="E-mail" note="" placeholder="voce@dominio.dev" />);
    expect(screen.getByLabelText('E-mail').getAttribute('placeholder')).toBe('voce@dominio.dev');
    expect(screen.getByRole('button').textContent).toBe('ENTRAR ↗');
    expect(document.querySelector('.su-waitlist-form__note')).toBeNull();
  });

  it('renders a ReactNode note, e.g. a privacy-notice link', () => {
    render(<WaitlistForm note={<a href="#privacy">Privacy notice</a>} />);
    expect(screen.getByRole('link', { name: 'Privacy notice' }).getAttribute('href')).toBe('#privacy');
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
