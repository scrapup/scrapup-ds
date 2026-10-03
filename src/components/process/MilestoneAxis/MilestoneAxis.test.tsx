import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '../../../../test/a11y';
import { MilestoneAxis } from './MilestoneAxis';
import type { Milestone } from './MilestoneAxis';

const MILESTONES: Milestone[] = [
  { code: 'LCO', phase: 'Inception', body: 'Objectives agreed.' },
  { code: 'LCA', phase: 'Elaboration', body: 'Executable baseline.', current: true },
  { code: 'IOC', phase: 'Construction' },
];

describe('MilestoneAxis', () => {
  it('renders the default header and an ordered axis inside a strong panel', () => {
    const { container } = render(<MilestoneAxis milestones={MILESTONES} />);
    const root = container.firstElementChild;
    expect(root?.className).toBe('su-panel su-panel--strong su-panel--pad-xxl su-milestone-axis');
    expect(container.querySelector('.su-milestone-axis__title')?.textContent).toBe('LIFECYCLE — MILESTONE GATES');
    expect(container.querySelector('.su-milestone-axis__meta')?.textContent).toBe('UP AI-ASSISTED');
    expect(screen.getByRole('list').tagName).toBe('OL');
    expect(screen.getAllByRole('listitem').map((item) => item.querySelector('.su-milestone-axis__code')?.textContent)).toEqual([
      'LCO',
      'LCA',
      'IOC',
    ]);
  });

  it('marks the current milestone with aria-current="step" and the current label', () => {
    const { container } = render(<MilestoneAxis currentLabel="NOW" milestones={MILESTONES} />);
    const current = container.querySelectorAll('[aria-current="step"]');
    expect(current).toHaveLength(1);
    expect(current[0]?.classList.contains('su-milestone-axis__step--current')).toBe(true);
    expect(current[0]?.querySelector('.su-milestone-axis__current-label')?.textContent).toBe('NOW');
    expect(container.querySelectorAll('.su-milestone-axis__current')).toHaveLength(1);
  });

  it('marks only the first current milestone', () => {
    const { container } = render(
      <MilestoneAxis
        milestones={[
          { code: 'A', phase: 'a', current: true },
          { code: 'B', phase: 'b', current: true },
        ]}
      />,
    );
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });

  it('skips milestones without a code and omits an empty current label (D-07)', () => {
    const { container } = render(<MilestoneAxis currentLabel="" milestones={[{ code: '', phase: 'x' }, ...MILESTONES]} />);
    expect(container.querySelectorAll('.su-milestone-axis__step')).toHaveLength(3);
    expect(container.querySelector('.su-milestone-axis__current-label')).toBeNull();
    expect(render(<MilestoneAxis milestones={[{ code: '', phase: 'x' }]} />).container.firstElementChild).toBeNull();
  });

  it('omits empty header texts and bodies (D-07)', () => {
    const { container } = render(<MilestoneAxis meta="" milestones={MILESTONES} title="" />);
    expect(container.querySelector('.su-milestone-axis__header')).toBeNull();
    expect(container.querySelectorAll('.su-milestone-axis__body')).toHaveLength(2);
  });

  it('renders nothing without milestones (D-07)', () => {
    expect(render(<MilestoneAxis milestones={[]} />).container.firstElementChild).toBeNull();
  });

  it('appends className to the root', () => {
    const { container } = render(<MilestoneAxis className="extra" milestones={MILESTONES} />);
    expect(container.firstElementChild?.classList.contains('extra')).toBe(true);
  });

  it('has no critical or serious a11y violations', async () => {
    const { container } = render(<MilestoneAxis milestones={MILESTONES} />);
    await expectNoA11yViolations(container);
  });
});
