import type { Meta, StoryObj } from '@storybook/react-vite';
import { WaitlistForm } from './WaitlistForm';
import type { WaitlistFormProps } from './WaitlistForm';

const OUTCOMES = ['resolve', 'reject', 'pending'] as const;
type Outcome = (typeof OUTCOMES)[number];

// Story-local handlers (no network), selected by the `outcome` arg.
const HANDLERS: Record<Outcome, () => Promise<void>> = {
  resolve: () => Promise.resolve(),
  reject: () => Promise.reject(new Error('Story handler rejected')),
  pending: () => new Promise<void>(() => undefined),
};

type WaitlistStoryArgs = WaitlistFormProps & { outcome: Outcome };

const meta = {
  title: 'Forms/WaitlistForm',
  component: WaitlistForm,
  args: { outcome: 'resolve' },
  argTypes: { outcome: { control: 'inline-radio', options: OUTCOMES } },
  render: ({ outcome, ...props }) => <WaitlistForm {...props} onSubmit={HANDLERS[outcome]} />,
  decorators: [
    (Story) => (
      <div className="sb-story-form">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
} satisfies Meta<WaitlistStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {};

export const Invalid: Story = {
  play: async ({ canvasElement }) => {
    canvasElement.querySelector<HTMLButtonElement>('button[type="submit"]')?.click();
    await Promise.resolve();
  },
};

export const Success: Story = { args: { status: 'success' } };

export const HandlerRejects: Story = { args: { outcome: 'reject' } };

export const Submitting: Story = { args: { outcome: 'pending' } };

export const WithPrivacyNotice: Story = {
  args: {
    note: (
      <>
        We use your e-mail only for the launch notice. <a href="#privacy">Privacy notice</a>.
      </>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <WaitlistForm />
      <WaitlistForm status="error" />
      <WaitlistForm status="success" />
    </div>
  ),
};
