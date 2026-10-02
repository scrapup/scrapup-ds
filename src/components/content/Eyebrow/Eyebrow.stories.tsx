import type { Meta, StoryObj } from '@storybook/react-vite';
import { Eyebrow } from './Eyebrow';

const meta = {
  title: 'Content/Eyebrow',
  component: Eyebrow,
  args: { tone: 'cyan', index: '02', children: 'The process' },
  argTypes: { tone: { control: 'inline-radio', options: ['cyan', 'neon', 'muted'] } },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Neon: Story = { args: { tone: 'neon' } };

export const Muted: Story = { args: { tone: 'muted', index: undefined, children: 'Beliefs' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <Eyebrow index="01">Cyan eyebrow</Eyebrow>
      <Eyebrow index="02" tone="neon">
        Neon eyebrow
      </Eyebrow>
      <Eyebrow tone="muted">Muted eyebrow</Eyebrow>
    </div>
  ),
};
