import type { Meta, StoryObj } from '@storybook/react-vite';
import { MilestoneAxis } from './MilestoneAxis';

const MILESTONES = [
  { code: 'LCO', phase: 'Inception', body: 'Objectives agreed; risks ordered.' },
  { code: 'LCA', phase: 'Elaboration', body: 'Executable baseline sealed.' },
  { code: 'IOC', phase: 'Construction', body: 'Operational capability verified.', current: true },
  { code: 'RELEASE', phase: 'Transition', body: 'Verified in production.' },
];

const meta = {
  title: 'Process/MilestoneAxis',
  component: MilestoneAxis,
  args: { milestones: MILESTONES },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof MilestoneAxis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoCurrent: Story = {
  args: { milestones: MILESTONES.map(({ code, phase, body }) => ({ code, phase, body })), meta: '' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <MilestoneAxis milestones={MILESTONES} />
      <MilestoneAxis
        currentLabel="NOW · ALPHA"
        meta=""
        milestones={[
          { code: 'LCO', phase: 'Inception', current: true },
          { code: 'LCA', phase: 'Elaboration' },
        ]}
        title="SHORT AXIS"
      />
    </div>
  ),
};
