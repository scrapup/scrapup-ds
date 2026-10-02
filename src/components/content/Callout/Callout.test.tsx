import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders a small callout with the text in a paragraph by default', () => {
    const { container } = render(
      <Callout>
        Agents execute. <strong>Humans seal.</strong>
      </Callout>,
    );
    expect(container.firstElementChild?.className).toBe('su-callout su-callout--sm');
    const text = container.querySelector('p.su-callout__text');
    expect(text?.textContent).toBe('Agents execute. Humans seal.');
    expect(text?.querySelector('strong')?.textContent).toBe('Humans seal.');
  });

  it('applies the lg size and falls back to sm for unknown sizes (D-05)', () => {
    expect(render(<Callout size="lg">x</Callout>).container.firstElementChild?.className).toBe('su-callout su-callout--lg');
    expect(render(<Callout size={'xl' as never}>x</Callout>).container.firstElementChild?.className).toBe(
      'su-callout su-callout--sm',
    );
  });

  it('renders nothing without content (D-07) and appends className', () => {
    expect(render(<Callout />).container.firstElementChild).toBeNull();
    expect(render(<Callout className="extra">x</Callout>).container.firstElementChild?.className).toBe(
      'su-callout su-callout--sm extra',
    );
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<Callout size="lg">From scrap to forged delivery.</Callout>);
    await expectNoA11yViolations(container);
  });
});
