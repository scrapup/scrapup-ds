import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlitchCode } from './GlitchCode';

const meta = {
  title: 'Feedback/GlitchCode',
  component: GlitchCode,
  args: { size: 'lg', animated: true },
  argTypes: { size: { control: 'inline-radio', options: ['lg', 'md'] } },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof GlitchCode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Static: Story = { args: { animated: false } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-row">
      <GlitchCode animated={false} />
      <GlitchCode animated={false} size="md">
        500
      </GlitchCode>
    </div>
  ),
};
