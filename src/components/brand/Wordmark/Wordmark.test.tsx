import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Wordmark } from './Wordmark';

describe('Wordmark', () => {
  it('renders "scrap" + "up" with the md size, dark tone and flicker by default', () => {
    const { container } = render(<Wordmark />);
    const root = container.firstElementChild;
    expect(root?.textContent).toBe('scrapup');
    expect(root?.className).toBe('su-wordmark su-wordmark--md su-wordmark--dark su-wordmark--flicker');
    expect(screen.getByRole('img', { name: 'scrapup' })).toBe(root);
    expect(container.querySelector('.su-wordmark__up')?.textContent).toBe('up');
  });

  it.each(['xs', 'sm', 'md', 'xl'] as const)('applies the %s size modifier', (size) => {
    const { container } = render(<Wordmark size={size} />);
    expect(container.firstElementChild?.classList.contains(`su-wordmark--${size}`)).toBe(true);
  });

  it('applies the light tone', () => {
    const { container } = render(<Wordmark tone="light" />);
    expect(container.firstElementChild?.classList.contains('su-wordmark--light')).toBe(true);
  });

  it('falls back to the defaults for unknown size and tone (D-05)', () => {
    const { container } = render(<Wordmark size={'huge' as never} tone={'neon' as never} />);
    expect(container.firstElementChild?.className).toBe('su-wordmark su-wordmark--md su-wordmark--dark su-wordmark--flicker');
  });

  it('renders static when flicker is false (RN-18)', () => {
    const { container } = render(<Wordmark flicker={false} />);
    expect(container.firstElementChild?.classList.contains('su-wordmark--flicker')).toBe(false);
  });

  it('renders a link when href is given, with external link attributes (D-06)', () => {
    render(<Wordmark href="https://scrapup.dev" />);
    const link = screen.getByRole('link', { name: 'scrapup' });
    expect(link.getAttribute('href')).toBe('https://scrapup.dev');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    expect(link.querySelector('.su-wordmark')).not.toBeNull();
  });

  it('applies className to the link instead of the mark when href is set', () => {
    render(<Wordmark className="custom" href="/" />);
    const link = screen.getByRole('link', { name: 'scrapup' });
    expect(link.className).toBe('su-wordmark-link custom');
    expect(link.hasAttribute('target')).toBe(false);
    expect(screen.getByRole('img', { name: 'scrapup' }).classList.contains('custom')).toBe(false);
  });

  it('appends className to the root', () => {
    const { container } = render(<Wordmark className="custom" />);
    expect(container.firstElementChild?.classList.contains('custom')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Wordmark href="/" />);
    await expectNoA11yViolations(container);
  });
});
