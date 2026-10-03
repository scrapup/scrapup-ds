import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { GlitchCode } from './GlitchCode';

describe('GlitchCode', () => {
  it('renders 404 large and animated by default, with three decorative layers', () => {
    const { container } = render(<GlitchCode />);
    const root = container.firstElementChild;
    expect(root?.className).toBe('su-glitch-code su-glitch-code--lg su-glitch-code--animated');
    expect(container.querySelector('.su-glitch-code__main')?.textContent).toBe('404');
    const layers = container.querySelectorAll('.su-glitch-code__layer');
    expect([...layers].map((layer) => layer.className)).toEqual([
      'su-glitch-code__layer su-glitch-code__layer--cyan',
      'su-glitch-code__layer su-glitch-code__layer--magenta',
      'su-glitch-code__layer su-glitch-code__layer--slice',
    ]);
    for (const layer of layers) {
      expect(layer.getAttribute('aria-hidden')).toBe('true');
      expect(layer.textContent).toBe('404');
    }
  });

  it('renders custom content, the md size and static when animated is false (RN-18)', () => {
    const { container } = render(
      <GlitchCode animated={false} size="md">
        500
      </GlitchCode>,
    );
    expect(container.firstElementChild?.className).toBe('su-glitch-code su-glitch-code--md');
    expect(container.querySelector('.su-glitch-code__main')?.textContent).toBe('500');
  });

  it('falls back to lg for unknown sizes (D-05) and appends className', () => {
    expect(render(<GlitchCode className="extra" size={'xl' as never} />).container.firstElementChild?.className).toBe(
      'su-glitch-code su-glitch-code--lg su-glitch-code--animated extra',
    );
  });

  it('exposes the numeral once to assistive technology', () => {
    const { container } = render(<GlitchCode />);
    const leaves = [...container.querySelectorAll('span')].filter((span) => span.children.length === 0);
    const exposed = leaves.filter((span) => !span.closest('[aria-hidden="true"]'));
    expect(exposed.map((span) => span.textContent)).toEqual(['404']);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<GlitchCode />);
    await expectNoA11yViolations(container);
  });
});
