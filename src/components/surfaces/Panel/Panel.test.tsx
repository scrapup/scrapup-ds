import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Panel } from './Panel';

describe('Panel', () => {
  it('renders a default md <div> panel', () => {
    const { container } = render(<Panel>content</Panel>);
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('DIV');
    expect(root?.className).toBe('su-panel su-panel--default su-panel--pad-md');
    expect(root?.textContent).toBe('content');
  });

  it.each(['default', 'strong', 'edge', 'dashed'] as const)('applies the %s variant', (variant) => {
    const { container } = render(<Panel variant={variant}>x</Panel>);
    expect(container.firstElementChild?.classList.contains(`su-panel--${variant}`)).toBe(true);
  });

  it.each(['md', 'lg', 'xl', 'xxl'] as const)('applies the %s padding', (padding) => {
    const { container } = render(<Panel padding={padding}>x</Panel>);
    expect(container.firstElementChild?.classList.contains(`su-panel--pad-${padding}`)).toBe(true);
  });

  it.each(['neon', 'cyan'] as const)('adds the %s accent edge', (accentEdge) => {
    const { container } = render(<Panel accentEdge={accentEdge}>x</Panel>);
    expect(container.firstElementChild?.classList.contains(`su-panel--edge-${accentEdge}`)).toBe(true);
  });

  it.each(['section', 'article'] as const)('renders as <%s>', (as) => {
    const { container } = render(<Panel as={as}>x</Panel>);
    expect(container.firstElementChild?.tagName).toBe(as.toUpperCase());
  });

  it('falls back to the defaults for unknown variant, padding, edge and element (D-05)', () => {
    const { container } = render(
      <Panel accentEdge={'pink' as never} as={'span' as never} padding={'huge' as never} variant={'glass' as never}>
        x
      </Panel>,
    );
    const root = container.firstElementChild;
    expect(root?.tagName).toBe('DIV');
    expect(root?.className).toBe('su-panel su-panel--default su-panel--pad-md');
  });

  it('passes id and aria-labelledby to name a section landmark', () => {
    const { container } = render(
      <Panel aria-labelledby="pricing-title" as="section" id="pricing">
        <h2 id="pricing-title">Pricing</h2>
      </Panel>,
    );
    const root = container.firstElementChild;
    expect(root?.getAttribute('id')).toBe('pricing');
    expect(root?.getAttribute('aria-labelledby')).toBe('pricing-title');
  });

  it('appends className to the root', () => {
    const { container } = render(<Panel className="extra">x</Panel>);
    expect(container.firstElementChild?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Panel variant="strong">content</Panel>);
    await expectNoA11yViolations(container);
  });
});
