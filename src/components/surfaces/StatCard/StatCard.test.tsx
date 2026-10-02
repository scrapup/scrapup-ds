import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders the glowing value, body and source inside a panel', () => {
    const { container } = render(<StatCard body="more critical vulnerabilities" source="arXiv 2025" value="+37.6%" />);
    const root = container.firstElementChild;
    expect(root?.className).toBe('su-panel su-panel--default su-panel--pad-md su-stat-card su-stat-card--neon');
    expect(container.querySelector('.su-stat-card__value')?.textContent).toBe('+37.6%');
    expect(container.querySelector('.su-stat-card__title')).toBeNull();
    expect(container.querySelector('.su-stat-card__body')?.textContent).toBe('more critical vulnerabilities');
    expect(container.querySelector('.su-stat-card__source')?.textContent).toBe('arXiv 2025');
  });

  it('renders a title instead of a value', () => {
    const { container } = render(<StatCard body="b" title="Spec ≠ conformance" />);
    expect(container.querySelector('.su-stat-card__title')?.textContent).toBe('Spec ≠ conformance');
    expect(container.querySelector('.su-stat-card__value')).toBeNull();
  });

  it('renders only the body when neither value nor title is given', () => {
    const { container } = render(<StatCard body="only body" />);
    expect(container.querySelector('.su-stat-card__value, .su-stat-card__title, .su-stat-card__source')).toBeNull();
    expect(container.textContent).toBe('only body');
  });

  it('applies the cyan tone and falls back to neon for unknown tones (D-05)', () => {
    expect(render(<StatCard body="b" tone="cyan" />).container.firstElementChild?.classList.contains('su-stat-card--cyan')).toBe(
      true,
    );
    expect(
      render(<StatCard body="b" tone={'pink' as never} />).container.firstElementChild?.classList.contains('su-stat-card--neon'),
    ).toBe(true);
  });

  it('appends className to the root', () => {
    expect(render(<StatCard body="b" className="extra" />).container.firstElementChild?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<StatCard body="b" source="source" value="42" />);
    await expectNoA11yViolations(container);
  });
});
