import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { FeatureCard } from './FeatureCard';

describe('FeatureCard', () => {
  it('renders the index, the title as a heading and the body', () => {
    const { container } = render(<FeatureCard body="Specs before prompts." index="01" title="Traceable contract" />);
    expect(container.firstElementChild?.className).toBe('su-panel su-panel--default su-panel--pad-md su-feature-card');
    expect(container.querySelector('.su-feature-card__index')?.textContent).toBe('01');
    expect(screen.getByRole('heading', { level: 3, name: 'Traceable contract' }).className).toBe('su-feature-card__title');
    expect(container.querySelector('.su-feature-card__body')?.textContent).toBe('Specs before prompts.');
  });

  it('renders a tracked label with its tone and the large title', () => {
    const { container } = render(<FeatureCard label="ARCHITECT" labelTone="cyan" title="Owns the baseline" />);
    expect(container.querySelector('.su-feature-card__label')?.className).toBe(
      'su-feature-card__label su-feature-card__label--cyan',
    );
    expect(container.firstElementChild?.classList.contains('su-feature-card--labelled')).toBe(true);
  });

  it('falls back to the neon label tone (D-05) and omits empty slots (D-07)', () => {
    const { container } = render(<FeatureCard label="X" labelTone={'pink' as never} title="T" />);
    expect(container.querySelector('.su-feature-card__label')?.className).toBe(
      'su-feature-card__label su-feature-card__label--neon',
    );
    expect(container.querySelector('.su-feature-card__index')).toBeNull();
    expect(container.querySelector('.su-feature-card__body')).toBeNull();
  });

  it('shows the index, not the label, when both are given', () => {
    const { container } = render(<FeatureCard index="01" label="ROLE" title="T" />);
    expect(container.querySelector('.su-feature-card__label')).toBeNull();
    expect(container.querySelector('.su-feature-card__index')?.textContent).toBe('01');
  });

  it('passes the accent edge to the panel and appends className', () => {
    const { container } = render(<FeatureCard accentEdge="cyan" className="extra" title="T" />);
    const root = container.firstElementChild;
    expect(root?.classList.contains('su-panel--edge-cyan')).toBe(true);
    expect(root?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<FeatureCard body="b" index="01" title="T" />);
    await expectNoA11yViolations(container);
  });
});
