import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatCard } from './StatCard';

const meta = {
  title: 'Surfaces/StatCard',
  component: StatCard,
  args: {
    value: '+37.6%',
    body: 'more critical vulnerabilities after five AI refinement iterations without a human.',
    source: 'IEEE-ISTAS 2025',
    tone: 'neon',
  },
  argTypes: { tone: { control: 'inline-radio', options: ['neon', 'cyan'] } },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Cyan: Story = { args: { tone: 'cyan', value: '4', body: 'milestone gates sealed by humans.' } };

export const WithTitle: Story = {
  args: { value: undefined, title: 'Spec ≠ conformance', body: 'Scaffolding alone does not make agents follow it.' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-grid">
      <StatCard body="more critical vulnerabilities after five iterations." source="IEEE-ISTAS 2025" value="+37.6%" />
      <StatCard body="milestone gates sealed by humans." tone="cyan" value="4" />
      <StatCard body="Scaffolding alone does not make agents follow it." source="ACM TechBrief 2026" title="Spec ≠ conformance" />
      <StatCard body="Only the body." />
    </div>
  ),
};
