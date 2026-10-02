import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Eyebrow } from './Eyebrow';

describe('Eyebrow', () => {
  it('renders the label in the cyan tone by default', () => {
    const { container } = render(<Eyebrow>the process</Eyebrow>);
    expect(container.firstElementChild?.className).toBe('su-eyebrow su-eyebrow--cyan');
    expect(container.textContent).toBe('the process');
  });

  it('prefixes the index as "// <index> — "', () => {
    const { container } = render(<Eyebrow index="02">the process</Eyebrow>);
    expect(container.textContent).toBe('// 02 — the process');
    expect(container.querySelector('.su-eyebrow__index')?.textContent).toBe('// 02 — ');
  });

  it('omits the prefix for an empty index (D-07)', () => {
    const { container } = render(<Eyebrow index="">intro</Eyebrow>);
    expect(container.textContent).toBe('intro');
  });

  it('accepts a numeric index, including 0', () => {
    const { container } = render(<Eyebrow index={0}>intro</Eyebrow>);
    expect(container.textContent).toBe('// 0 — intro');
  });

  it.each(['cyan', 'neon', 'muted'] as const)('applies the %s tone', (tone) => {
    const { container } = render(<Eyebrow tone={tone}>x</Eyebrow>);
    expect(container.firstElementChild?.classList.contains(`su-eyebrow--${tone}`)).toBe(true);
  });

  it('falls back to cyan for an unknown tone (D-05) and appends className', () => {
    const { container } = render(
      <Eyebrow className="extra" tone={'red' as never}>
        x
      </Eyebrow>,
    );
    expect(container.firstElementChild?.className).toBe('su-eyebrow su-eyebrow--cyan extra');
  });

  it('renders nothing without content (D-07)', () => {
    const { container } = render(<Eyebrow index="01" />);
    expect(container.firstElementChild).toBeNull();
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Eyebrow index="01">manifesto</Eyebrow>);
    await expectNoA11yViolations(container);
  });
});
