import type { Meta, StoryObj } from '@storybook/react-vite';
import { FeatureCard } from './FeatureCard';

const meta = {
  title: 'Surfaces/FeatureCard',
  component: FeatureCard,
  args: { index: '01', title: 'Traceable contract', body: 'Features derive from versioned specs, not ad-hoc prompts.' },
  argTypes: {
    labelTone: { control: 'inline-radio', options: ['neon', 'cyan'] },
    accentEdge: { control: 'inline-radio', options: [undefined, 'neon', 'cyan'] },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Role: Story = {
  args: {
    index: undefined,
    label: 'ARCHITECT',
    labelTone: 'cyan',
    accentEdge: 'cyan',
    title: 'Owns the architecture',
    body: 'Defines the baseline, fixes the constraints.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-grid">
      <FeatureCard body="Features derive from versioned specs." index="01" title="Traceable contract" />
      <FeatureCard accentEdge="neon" body="Nine lenses before concluding." index="02" title="Multi-lens validation" />
      <FeatureCard body="Seals the milestones." label="VALIDATOR" title="Adjudicates the lenses" />
      <FeatureCard
        accentEdge="cyan"
        body="Defines the baseline."
        label="ARCHITECT"
        labelTone="cyan"
        title="Owns the architecture"
      />
    </div>
  ),
};
