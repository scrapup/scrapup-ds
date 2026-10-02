import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { StatementList } from './StatementList';

describe('StatementList', () => {
  it('renders an ordered list with zero-padded decorative numbers', () => {
    const { container } = render(<StatementList items={['Specs are contracts.', 'Humans seal milestones.']} />);
    const list = screen.getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(list.className).toBe('su-statement-list');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    const numbers = container.querySelectorAll('.su-statement-list__number');
    expect([...numbers].map((number) => number.textContent)).toEqual(['01', '02']);
    for (const number of numbers) expect(number.getAttribute('aria-hidden')).toBe('true');
  });

  it('skips empty items and renders nothing without items (D-07)', () => {
    expect(render(<StatementList items={[]} />).container.firstElementChild).toBeNull();
    expect(render(<StatementList items={['', null]} />).container.firstElementChild).toBeNull();
    const { container } = render(<StatementList items={['', 'one']} />);
    expect(container.querySelector('.su-statement-list__number')?.textContent).toBe('01');
  });

  it('appends className to the root', () => {
    expect(render(<StatementList className="extra" items={['a']} />).container.firstElementChild?.classList.contains('extra')).toBe(
      true,
    );
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<StatementList items={['a', 'b']} />);
    await expectNoA11yViolations(container);
  });
});
