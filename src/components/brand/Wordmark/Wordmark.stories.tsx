import type { Meta, StoryObj } from '@storybook/react-vite';
import { Wordmark } from './Wordmark';

const meta = {
  title: 'Brand/Wordmark',
  component: Wordmark,
  args: { size: 'md', tone: 'dark', flicker: true },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'xl'] },
    tone: { control: 'inline-radio', options: ['dark', 'light'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Wordmark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Static: Story = { args: { flicker: false } };

export const Showcase: Story = { args: { size: 'xl' } };

export const OnPaper: Story = {
  args: { tone: 'light', flicker: false },
  decorators: [
    (Story) => (
      <div className="sb-story-paper">
        <Story />
      </div>
    ),
  ],
};

export const Link: Story = { args: { href: '/' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <Wordmark flicker={false} size="xs" />
      <Wordmark flicker={false} size="sm" />
      <Wordmark flicker={false} size="md" />
      <Wordmark flicker={false} size="xl" />
      <div className="sb-story-paper">
        <Wordmark flicker={false} tone="light" />
      </div>
    </div>
  ),
};
