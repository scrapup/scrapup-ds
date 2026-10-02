import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusPill } from './StatusPill';

const meta = {
  title: 'Content/StatusPill',
  component: StatusPill,
  args: { dot: true, children: 'BETA — PUBLIC RELEASE' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutDot: Story = { args: { dot: false } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <StatusPill>BETA — PUBLIC RELEASE</StatusPill>
      <StatusPill dot={false}>IN CONSTRUCTION</StatusPill>
    </div>
  ),
};
