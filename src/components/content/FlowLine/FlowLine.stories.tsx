import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlowLine } from './FlowLine';

const meta = {
  title: 'Content/FlowLine',
  component: FlowLine,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof FlowLine>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Milestones: Story = { args: { steps: ['LCO', 'LCA', 'IOC', 'release'] } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <FlowLine />
      <FlowLine steps={['intent', 'spec', 'code', 'test', 'commit', 'release']} />
      <FlowLine steps={['LCO', 'LCA', 'IOC', 'release']} />
    </div>
  ),
};
