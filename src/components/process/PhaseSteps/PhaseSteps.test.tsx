import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { PhaseSteps } from './PhaseSteps';

describe('PhaseSteps', () => {
  it('renders an ordered list of numbered steps', () => {
    const { container } = render(
      <PhaseSteps
        steps={[
          { title: 'document', body: 'Spec, plan and tasks.' },
          { title: 'validate', body: 'Nine lenses.' },
          { title: 'deliver' },
        ]}
      />,
    );
    expect(screen.getByRole('list').className).toBe('su-phase-steps');
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    const numbers = container.querySelectorAll('.su-phase-steps__number');
    expect([...numbers].map((number) => number.textContent)).toEqual(['01', '02', '03']);
    for (const number of numbers) expect(number.getAttribute('aria-hidden')).toBe('true');
    expect(container.querySelectorAll('.su-phase-steps__body')).toHaveLength(2);
  });

  it('skips steps without a title and renders nothing without steps (D-07)', () => {
    expect(render(<PhaseSteps steps={[]} />).container.firstElementChild).toBeNull();
    expect(render(<PhaseSteps steps={[{ title: '' }]} />).container.firstElementChild).toBeNull();
    const { container } = render(<PhaseSteps steps={[{ title: '' }, { title: 'deliver' }]} />);
    expect(container.querySelector('.su-phase-steps__number')?.textContent).toBe('01');
  });

  it('appends className to the root', () => {
    expect(render(<PhaseSteps className="extra" steps={[{ title: 'a' }]} />).container.firstElementChild?.classList.contains('extra')).toBe(
      true,
    );
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<PhaseSteps steps={[{ title: 'a', body: 'b' }]} />);
    await expectNoA11yViolations(container);
  });
});
