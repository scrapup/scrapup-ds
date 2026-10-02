import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { ValueStatement } from './ValueStatement';

const PAIRS: [string, string][] = [
  ['Contracts', 'over prompts.'],
  ['Evidence', 'over claims.'],
];

describe('ValueStatement', () => {
  it('renders each pair as a row with the preferred term highlighted, plus the note', () => {
    const { container } = render(<ValueStatement note="We value the right side too." pairs={PAIRS} />);
    expect(container.firstElementChild?.className).toBe('su-panel su-panel--default su-panel--pad-xxl su-value-statement');
    const rows = container.querySelectorAll('.su-value-statement__row');
    expect([...rows].map((row) => row.textContent)).toEqual(['Contracts over prompts.', 'Evidence over claims.']);
    expect(container.querySelector('.su-value-statement__preferred')?.textContent).toBe('Contracts');
    expect(container.querySelector('.su-value-statement__note')?.textContent).toBe('We value the right side too.');
  });

  it('omits the note and renders nothing without pairs (D-07)', () => {
    expect(render(<ValueStatement pairs={PAIRS} />).container.querySelector('.su-value-statement__note')).toBeNull();
    expect(render(<ValueStatement pairs={[]} />).container.firstElementChild).toBeNull();
  });

  it('appends className to the root', () => {
    expect(render(<ValueStatement className="extra" pairs={PAIRS} />).container.firstElementChild?.classList.contains('extra')).toBe(
      true,
    );
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<ValueStatement note="n" pairs={PAIRS} />);
    await expectNoA11yViolations(container);
  });
});
