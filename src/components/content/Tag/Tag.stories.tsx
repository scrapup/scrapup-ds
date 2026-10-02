import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';

const meta = {
  title: 'Content/Tag',
  component: Tag,
  args: { tone: 'cyan', children: 'spec-driven' },
  argTypes: { tone: { control: 'inline-radio', options: ['cyan', 'quiet', 'neon'] } },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Quiet: Story = { args: { tone: 'quiet', children: 'open tooling' } };

export const Neon: Story = { args: { tone: 'neon', children: 'forge' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-row">
      <Tag>spec-driven</Tag>
      <Tag tone="quiet">open tooling</Tag>
      <Tag tone="neon">forge</Tag>
    </div>
  ),
};
