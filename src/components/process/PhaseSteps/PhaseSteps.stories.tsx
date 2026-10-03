import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhaseSteps } from './PhaseSteps';

const meta = {
  title: 'Process/PhaseSteps',
  component: PhaseSteps,
  args: {
    steps: [
      { title: 'document', body: 'Spec, plan and tasks before code.' },
      { title: 'validate', body: 'Nine review lenses before concluding.' },
      { title: 'deliver', body: 'Evidence on every merge.' },
    ],
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PhaseSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <PhaseSteps steps={[{ title: 'document' }, { title: 'validate' }, { title: 'deliver' }]} />
      <PhaseSteps
        steps={[
          { title: 'intent', body: 'Raw scraps.' },
          { title: 'spec', body: 'Contracts.' },
          { title: 'code', body: 'Agents execute.' },
          { title: 'release', body: 'Humans seal.' },
        ]}
      />
    </div>
  ),
};
