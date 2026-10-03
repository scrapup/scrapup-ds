import type { Meta, StoryObj } from '@storybook/react-vite';
import { WaitlistForm } from './WaitlistForm';

type Outcome = 'resolve' | 'reject' | 'pending';

interface WaitlistStoryArgs {
  /** Story-local handler outcome (no network). */
  outcome: Outcome;
}

const HANDLERS: Record<Outcome, () => Promise<void>> = {
  resolve: () => Promise.resolve(),
  reject: () => Promise.reject(new Error('Story handler rejected')),
  pending: () => new Promise<void>(() => undefined),
};

function WaitlistStory({ outcome }: WaitlistStoryArgs): React.JSX.Element {
  return <WaitlistForm onSubmit={HANDLERS[outcome]} />;
}

const meta = {
  title: 'Forms/WaitlistForm',
  component: WaitlistStory,
  args: { outcome: 'resolve' },
  argTypes: { outcome: { control: 'inline-radio', options: ['resolve', 'reject', 'pending'] } },
  decorators: [
    (Story) => (
      <div className="sb-story-form">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof WaitlistStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await Promise.resolve();
  },
};

export const Success: Story = { render: () => <WaitlistForm status="success" /> };

export const HandlerRejects: Story = { args: { outcome: 'reject' } };

export const Submitting: Story = { args: { outcome: 'pending' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <WaitlistForm />
      <WaitlistForm status="error" />
      <WaitlistForm status="success" />
    </div>
  ),
};
