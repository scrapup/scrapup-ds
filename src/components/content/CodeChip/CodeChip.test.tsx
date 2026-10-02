import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { CodeChip } from './CodeChip';

describe('CodeChip', () => {
  it('renders the code in a <code> element', () => {
    const { container } = render(<CodeChip>/plugin install scrapup</CodeChip>);
    expect(container.firstElementChild?.className).toBe('su-code-chip');
    expect(container.querySelector('code.su-code-chip__code')?.textContent).toBe('/plugin install scrapup');
    expect(container.querySelector('.su-code-chip__hint')).toBeNull();
  });

  it('renders the dim hint before the code', () => {
    const { container } = render(<CodeChip hint="install:">npm i scrapup</CodeChip>);
    const hint = container.querySelector('.su-code-chip__hint');
    expect(hint?.textContent).toBe('install:');
    expect(hint?.nextElementSibling?.tagName).toBe('CODE');
  });

  it('renders nothing without code (D-07) and appends className', () => {
    expect(render(<CodeChip hint="x" />).container.firstElementChild).toBeNull();
    expect(render(<CodeChip className="extra">x</CodeChip>).container.firstElementChild?.className).toBe(
      'su-code-chip extra',
    );
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<CodeChip hint="run">npm test</CodeChip>);
    await expectNoA11yViolations(container);
  });
});
