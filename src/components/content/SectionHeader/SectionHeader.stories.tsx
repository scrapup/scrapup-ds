import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from './SectionHeader';

const meta = {
  title: 'Content/SectionHeader',
  component: SectionHeader,
  args: {
    index: '02',
    eyebrow: 'The process',
    title: 'Four milestones, sealed by humans.',
    highlight: 'sealed',
    body: 'Agents propose the risk ordering; the Validator approves it and seals each gate.',
    size: 'md',
  },
  argTypes: { size: { control: 'inline-radio', options: ['md', 'xl'] } },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Manifesto: Story = {
  args: { size: 'xl', bar: true, index: undefined, eyebrow: 'Manifesto', title: 'We believe.', highlight: undefined },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <SectionHeader body="Body copy under the title." eyebrow="The process" index="02" title="Four milestones." />
      <SectionHeader bar highlight="sealed" title="Milestones sealed by humans." />
      <SectionHeader bar eyebrow="Manifesto" size="xl" title="We believe." />
    </div>
  ),
};
