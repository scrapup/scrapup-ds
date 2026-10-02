import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { LangSwitch } from './LangSwitch';

function pressed(): string[] {
  return screen
    .getAllByRole('button')
    .filter((button) => button.getAttribute('aria-pressed') === 'true')
    .map((button) => button.textContent);
}

describe('LangSwitch', () => {
  it('renders a labelled group of EN, PT and JA with EN active by default', () => {
    render(<LangSwitch />);
    expect(screen.getByRole('group', { name: 'Language' }).className).toBe('su-lang-switch');
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual(['EN', 'PT', 'JA']);
    expect(pressed()).toEqual(['EN']);
  });

  it('marks the given value as active', () => {
    render(<LangSwitch value="JA" />);
    expect(pressed()).toEqual(['JA']);
    expect(screen.getByRole('button', { name: 'JA' }).classList.contains('su-lang-switch__option--active')).toBe(true);
  });

  it('falls back to the first option for an unknown value', () => {
    render(<LangSwitch options={['PT', 'EN']} value="FR" />);
    expect(pressed()).toEqual(['PT']);
  });

  it('calls onChange with the chosen option (mouse and keyboard)', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<LangSwitch onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'PT' }));
    await user.tab();
    await user.keyboard(' ');
    expect(onChange.mock.calls).toEqual([['PT'], ['JA']]);
  });

  it('renders and ignores clicks without onChange', async () => {
    const user = userEvent.setup();
    render(<LangSwitch />);
    await user.click(screen.getByRole('button', { name: 'JA' }));
    expect(pressed()).toEqual(['EN']);
  });

  it('renders nothing without options (D-07)', () => {
    const { container } = render(<LangSwitch options={[]} />);
    expect(container.firstElementChild).toBeNull();
  });

  it('appends className to the root', () => {
    render(<LangSwitch className="extra" />);
    expect(screen.getByRole('group').classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<LangSwitch />);
    await expectNoA11yViolations(container);
  });
});
