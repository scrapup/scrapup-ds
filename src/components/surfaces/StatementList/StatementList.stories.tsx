import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatementList } from './StatementList';

const meta = {
  title: 'Surfaces/StatementList',
  component: StatementList,
  args: {
    items: [
      'Specs are contracts, not suggestions.',
      'Agents execute; humans seal the milestones.',
      'Nothing is done without observable evidence.',
    ],
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatementList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <StatementList items={['A single statement.']} />
      <StatementList items={['Specs are contracts.', 'Agents execute; humans seal.', 'Evidence over claims.']} />
    </div>
  ),
};
