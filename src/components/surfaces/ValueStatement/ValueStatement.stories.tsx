import type { Meta, StoryObj } from '@storybook/react-vite';
import { ValueStatement } from './ValueStatement';

const meta = {
  title: 'Surfaces/ValueStatement',
  component: ValueStatement,
  args: {
    pairs: [
      ['Contracts', 'over prompts.'],
      ['Evidence', 'over claims.'],
      ['Milestones', 'over velocity.'],
    ],
    note: 'While there is value in the items on the right, we value the items on the left more.',
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ValueStatement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutNote: Story = { args: { note: undefined } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <ValueStatement note="Note under the rows." pairs={[['Contracts', 'over prompts.']]} />
      <ValueStatement
        pairs={[
          ['Evidence', 'over claims.'],
          ['Milestones', 'over velocity.'],
        ]}
      />
    </div>
  ),
};
