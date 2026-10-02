import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Tag } from './Tag';

describe('Tag', () => {
  it('renders the cyan tone by default', () => {
    const { container } = render(<Tag>spec</Tag>);
    expect(container.firstElementChild?.tagName).toBe('SPAN');
    expect(container.firstElementChild?.className).toBe('su-tag su-tag--cyan');
  });

  it.each(['cyan', 'quiet', 'neon'] as const)('applies the %s tone', (tone) => {
    expect(render(<Tag tone={tone}>x</Tag>).container.firstElementChild?.classList.contains(`su-tag--${tone}`)).toBe(true);
  });

  it('falls back to cyan for an unknown tone (D-05) and appends className', () => {
    expect(
      render(
        <Tag className="extra" tone={'red' as never}>
          x
        </Tag>,
      ).container.firstElementChild?.className,
    ).toBe('su-tag su-tag--cyan extra');
  });

  it('renders nothing without content (D-07)', () => {
    expect(render(<Tag />).container.firstElementChild).toBeNull();
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Tag tone="neon">forge</Tag>);
    await expectNoA11yViolations(container);
  });
});
