import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../actions/Button';
import { Hero } from './Hero';

const meta = {
  title: 'Content/Hero',
  component: Hero,
  args: {
    status: 'BETA — PUBLIC RELEASE',
    kicker: 'AI-ASSISTED UNIFIED PROCESS',
    title: 'From scrap to forged, auditable delivery.',
    highlight: 'forged',
    lead: 'An open, extensible process for engineering teams: agents execute the workflows, humans seal the milestones.',
    callout: (
      <>
        Velocity without a contract is fragile. <strong>scrapup imposes one.</strong>
      </>
    ),
    actions: (
      <>
        <Button href="#waitlist">JOIN THE WAITLIST ↗</Button>
        <Button href="https://github.com/scrapup/scrapup" icon="★" variant="secondary">
          STAR ON GITHUB
        </Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="sb-story-page">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = {
  args: { status: undefined, kicker: undefined, lead: undefined, callout: undefined, actions: undefined, highlight: undefined },
};

export const AllVariants: Story = {
  render: () => (
    <>
      <Hero highlight="forged" status="BETA" title="From scrap to forged delivery." />
      <Hero kicker="MANIFESTO" lead="Beliefs behind the process." title="Engineering, sealed by humans." />
    </>
  ),
};
