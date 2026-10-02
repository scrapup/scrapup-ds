import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { SectionHeader } from './SectionHeader';

describe('SectionHeader', () => {
  it('renders the eyebrow, the md heading and the body', () => {
    const { container } = render(<SectionHeader body="Body copy." eyebrow="The process" index="02" title="Four milestones" />);
    expect(container.firstElementChild?.className).toBe('su-section-header su-section-header--md');
    expect(container.querySelector('.su-eyebrow')?.textContent).toBe('// 02 — The process');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Four milestones');
    expect(container.querySelector('.su-section-header__body')?.textContent).toBe('Body copy.');
    expect(container.querySelector('.su-section-header__bar')).toBeNull();
  });

  it('applies the xl size and the decorative neon bar', () => {
    const { container } = render(<SectionHeader bar size="xl" title="Manifesto" />);
    expect(container.firstElementChild?.className).toBe('su-section-header su-section-header--xl');
    expect(container.querySelector('.su-section-header__bar')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('falls back to md for unknown sizes (D-05)', () => {
    expect(render(<SectionHeader size={'huge' as never} title="t" />).container.firstElementChild?.className).toBe(
      'su-section-header su-section-header--md',
    );
  });

  it('highlights the first match or renders the plain title', () => {
    const { container, rerender } = render(<SectionHeader highlight="milestones" title="Four milestones" />);
    expect(container.querySelector('.su-section-header__highlight')?.textContent).toBe('milestones');
    rerender(<SectionHeader highlight="absent" title="Four milestones" />);
    expect(container.querySelector('.su-section-header__highlight')).toBeNull();
  });

  it('omits empty slots (D-07) and appends className', () => {
    const { container } = render(<SectionHeader className="extra" title="t" />);
    expect(container.querySelector('.su-eyebrow')).toBeNull();
    expect(container.querySelector('.su-section-header__body')).toBeNull();
    expect(container.firstElementChild?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<SectionHeader bar body="b" eyebrow="e" highlight="t" title="title" />);
    await expectNoA11yViolations(container);
  });
});
