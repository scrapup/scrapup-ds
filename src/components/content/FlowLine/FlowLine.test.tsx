import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { FlowLine } from './FlowLine';

describe('FlowLine', () => {
  it('renders the default steps joined by arrows, the last one highlighted', () => {
    const { container } = render(<FlowLine />);
    expect(container.firstElementChild?.className).toBe('su-flow-line');
    expect(container.textContent).toBe('scrap → forge → forged delivery');
    const steps = container.querySelectorAll('.su-flow-line__step');
    expect([...steps].map((step) => step.className)).toEqual([
      'su-flow-line__step',
      'su-flow-line__step',
      'su-flow-line__step su-flow-line__step--last',
    ]);
    const arrows = container.querySelectorAll('.su-flow-line__arrow');
    expect(arrows).toHaveLength(2);
    for (const arrow of arrows) expect(arrow.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders custom steps, a single step without arrows', () => {
    const { container } = render(<FlowLine steps={['intent']} />);
    expect(container.textContent).toBe('intent');
    expect(container.querySelector('.su-flow-line__arrow')).toBeNull();
  });

  it('keeps repeated steps and highlights only the last', () => {
    const { container } = render(<FlowLine steps={['scrap', 'scrap']} />);
    expect(container.textContent).toBe('scrap → scrap');
    expect(container.querySelectorAll('.su-flow-line__step--last')).toHaveLength(1);
  });

  it('skips empty steps (D-07)', () => {
    const { container } = render(<FlowLine steps={['', 'a', '']} />);
    expect(container.textContent).toBe('a');
  });

  it('renders nothing without steps (D-07) and appends className', () => {
    expect(render(<FlowLine steps={[]} />).container.firstElementChild).toBeNull();
    expect(render(<FlowLine className="extra" />).container.firstElementChild?.className).toBe('su-flow-line extra');
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<FlowLine />);
    await expectNoA11yViolations(container);
  });
});
