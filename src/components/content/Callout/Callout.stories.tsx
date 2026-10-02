import type { Meta, StoryObj } from '@storybook/react-vite';
import { Callout } from './Callout';

const meta = {
  title: 'Content/Callout',
  component: Callout,
  args: {
    size: 'sm',
    children: (
      <>
        Agents execute the engineering workflows. <strong>Humans seal the milestones.</strong>
      </>
    ),
  },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'lg'] } },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Large: Story = { args: { size: 'lg', children: 'From scrap to forged, auditable delivery.' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <Callout>
        Agents execute the engineering workflows. <strong>Humans seal the milestones.</strong>
      </Callout>
      <Callout size="lg">From scrap to forged, auditable delivery.</Callout>
    </div>
  ),
};
