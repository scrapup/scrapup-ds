import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { StatusPill } from './StatusPill';

describe('StatusPill', () => {
  it('renders the label with a decorative glowing dot by default', () => {
    const { container } = render(<StatusPill>BETA — PUBLIC RELEASE</StatusPill>);
    expect(container.firstElementChild?.className).toBe('su-status-pill');
    const dot = container.querySelector('.su-status-pill__dot');
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelector('.su-status-pill__label')?.textContent).toBe('BETA — PUBLIC RELEASE');
  });

  it('omits the dot when dot is false', () => {
    const { container } = render(<StatusPill dot={false}>BETA</StatusPill>);
    expect(container.querySelector('.su-status-pill__dot')).toBeNull();
  });

  it('renders nothing without content (D-07) and appends className', () => {
    expect(render(<StatusPill />).container.firstElementChild).toBeNull();
    const { container } = render(<StatusPill className="extra">BETA</StatusPill>);
    expect(container.firstElementChild?.className).toBe('su-status-pill extra');
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<StatusPill>BETA</StatusPill>);
    await expectNoA11yViolations(container);
  });
});
