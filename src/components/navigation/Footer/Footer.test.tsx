import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the mono wordmark, the default meta items joined by "·" and the author', () => {
    const { container } = render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.className).toBe('su-footer');
    expect(footer.querySelector('.su-footer__wordmark.su-wordmark--xs')).not.toBeNull();
    expect(footer.querySelector('.su-wordmark--flicker')).toBeNull();
    expect([...container.querySelectorAll('.su-footer__item')].map((item) => item.textContent)).toEqual([
      'MIT © 2026',
      'scrapup.dev',
    ]);
    const separators = container.querySelectorAll('.su-footer__separator');
    expect(separators).toHaveLength(1);
    expect(separators[0]?.getAttribute('aria-hidden')).toBe('true');
    expect(footer.querySelector('.su-footer__author')?.textContent).toBe('Marco Antonio Luqueti Faustino');
  });

  it('renders links (external ones safely) and action-only links as buttons', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Footer
        links={[
          { label: 'github', href: 'https://github.com/scrapup' },
          { label: 'manifesto', href: '/manifesto' },
          { label: 'privacy', onClick },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'github' }).getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.getByRole('link', { name: 'manifesto' }).hasAttribute('target')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'privacy' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('skips empty items and repeats duplicate items without key clashes (D-07)', () => {
    const { container } = render(<Footer items={['', 'a', 'a']} />);
    expect([...container.querySelectorAll('.su-footer__item')].map((item) => item.textContent)).toEqual(['a', 'a']);
    expect(container.querySelectorAll('.su-footer__separator')).toHaveLength(1);
  });

  it('omits empty items, links and author (D-07)', () => {
    const { container } = render(<Footer author="" items={[]} />);
    expect(container.querySelector('.su-footer__item')).toBeNull();
    expect(container.querySelector('.su-footer__separator')).toBeNull();
    expect(container.querySelector('.su-footer__links')).toBeNull();
    expect(container.querySelector('.su-footer__author')).toBeNull();
  });

  it('appends className to the root', () => {
    render(<Footer className="extra" />);
    expect(screen.getByRole('contentinfo').classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Footer links={[{ label: 'github', href: 'https://github.com/scrapup' }]} />);
    await expectNoA11yViolations(container);
  });
});
