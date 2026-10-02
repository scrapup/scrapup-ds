import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it.each([
    ['https://github.com/scrapup', '_blank'],
    ['/manifesto', null],
  ])('renders %s as a link (target %s)', (href, target) => {
    render(<NavItem className="x" link={{ label: 'go', href }} />);
    expect(screen.getByRole('link', { name: 'go' }).getAttribute('target')).toBe(target);
  });

  it('neutralizes unsafe hrefs (D-06)', () => {
    render(<NavItem className="x" link={{ label: 'bad', href: 'javascript:alert(1)' }} />);
    expect(screen.getByRole('link', { name: 'bad' }).getAttribute('href')).toBe('#');
  });

  it('renders an action-only entry as a button and calls onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NavItem className="x" link={{ label: 'act', onClick }} />);
    await user.click(screen.getByRole('button', { name: 'act' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick on links too', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<NavItem className="x" link={{ label: 'go', href: '/', onClick }} />);
    await user.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it.each([true, false])('sets aria-current only when current (%s)', (current) => {
    render(<NavItem className="x" current={current} link={{ label: 'go', href: '/' }} />);
    expect(screen.getByRole('link').getAttribute('aria-current')).toBe(current ? 'page' : null);
  });
});
