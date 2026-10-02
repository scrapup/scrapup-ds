import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { TopBar } from './TopBar';

const LINKS = [
  { label: 'MANIFESTO', href: '/manifesto' },
  { label: 'DOCS', href: 'https://github.com/scrapup/scrapup#readme' },
];

describe('TopBar', () => {
  it('renders a header with the wordmark, the default tagline and the repo link', () => {
    render(<TopBar />);
    const header = screen.getByRole('banner');
    expect(header.className).toBe('su-top-bar');
    expect(screen.getByRole('img', { name: 'scrapup' })).not.toBeNull();
    expect(header.querySelector('.su-top-bar__tagline')?.textContent).toBe('AI-assisted Unified Process');
    const repo = screen.getByRole('link', { name: /github\.com\/scrapup/ });
    expect(repo.getAttribute('href')).toBe('https://github.com/scrapup/scrapup');
    expect(repo.getAttribute('rel')).toBe('noopener noreferrer');
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(screen.queryByRole('group', { name: 'Language' })).toBeNull();
  });

  it('links the wordmark home when homeHref is given', () => {
    render(<TopBar homeHref="/" />);
    expect(screen.getByRole('link', { name: 'scrapup' }).getAttribute('href')).toBe('/');
  });

  it('renders the navigation and marks the active link with aria-current', () => {
    render(<TopBar active="MANIFESTO" links={LINKS} />);
    const nav = screen.getByRole('navigation');
    const manifesto = screen.getByRole('link', { name: 'MANIFESTO' });
    expect(nav.contains(manifesto)).toBe(true);
    expect(manifesto.getAttribute('aria-current')).toBe('page');
    expect(manifesto.classList.contains('su-top-bar__link--active')).toBe(true);
    const docs = screen.getByRole('link', { name: 'DOCS' });
    expect(docs.hasAttribute('aria-current')).toBe(false);
    expect(docs.getAttribute('target')).toBe('_blank');
  });

  it('marks no link active when active matches none', () => {
    render(<TopBar active="BLOG" links={LINKS} />);
    expect(document.querySelector('[aria-current]')).toBeNull();
  });

  it('renders action-only links as buttons that call onClick', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<TopBar links={[{ label: 'WAITLIST', onClick }]} />);
    await user.click(screen.getByRole('button', { name: 'WAITLIST' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('marks an active action-only link with aria-current', () => {
    render(<TopBar active="WAITLIST" links={[{ label: 'WAITLIST', onClick: vi.fn() }]} />);
    expect(screen.getByRole('button', { name: 'WAITLIST' }).getAttribute('aria-current')).toBe('page');
  });

  it('shows the language switch only when onLang is given', async () => {
    const onLang = vi.fn();
    const user = userEvent.setup();
    render(<TopBar lang="PT" onLang={onLang} />);
    expect(screen.getByRole('button', { name: 'PT' }).getAttribute('aria-pressed')).toBe('true');
    await user.click(screen.getByRole('button', { name: 'JA' }));
    expect(onLang).toHaveBeenCalledWith('JA');
  });

  it('omits empty tagline and repo (D-07)', () => {
    const { container } = render(<TopBar repo="" tagline="" />);
    expect(container.querySelector('.su-top-bar__tagline')).toBeNull();
    expect(container.querySelector('.su-top-bar__repo')).toBeNull();
  });

  it('appends className to the root', () => {
    render(<TopBar className="extra" />);
    expect(screen.getByRole('banner').classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<TopBar active="MANIFESTO" homeHref="/" links={LINKS} onLang={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});
