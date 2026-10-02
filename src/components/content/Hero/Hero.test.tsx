import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Button } from '../../actions/Button';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders every region in order', () => {
    const { container } = render(
      <Hero
        actions={<Button>JOIN</Button>}
        callout="Agents execute. Humans seal."
        highlight="forged"
        kicker="AI-ASSISTED UNIFIED PROCESS"
        lead="An open process for engineering teams."
        status="BETA"
        title="From scrap to forged delivery"
      />,
    );
    const regions = [...(container.firstElementChild?.children ?? [])].map((child) => child.className);
    expect(regions).toEqual([
      'su-hero__status',
      'su-hero__kicker',
      'su-hero__title',
      'su-hero__lead',
      'su-hero__callout',
      'su-hero__actions',
    ]);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('From scrap to forged delivery');
  });

  it('wraps exactly one highlight span when found', () => {
    const { container } = render(<Hero highlight="forged" title="forged and forged" />);
    const marks = container.querySelectorAll('.su-hero__highlight');
    expect(marks).toHaveLength(1);
    expect(marks[0]?.textContent).toBe('forged');
  });

  it('renders the plain title when the highlight is missing from it', () => {
    const { container } = render(<Hero highlight="absent" title="Plain title" />);
    expect(container.querySelector('.su-hero__highlight')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Plain title');
  });

  it('renders only the title when the optional regions are absent (D-07)', () => {
    const { container } = render(<Hero title="Only title" />);
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it('appends className to the root', () => {
    expect(render(<Hero className="extra" title="t" />).container.firstElementChild?.className).toBe('su-hero extra');
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Hero highlight="forged" lead="lead" status="BETA" title="From scrap to forged" />);
    await expectNoA11yViolations(container);
  });
});
