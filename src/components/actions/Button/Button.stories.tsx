import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { variant: 'primary', size: 'md', children: 'JOIN THE WAITLIST ↗' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'link'] },
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    type: { control: 'inline-radio', options: ['button', 'submit'] },
  },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = { args: { variant: 'secondary', icon: '★', children: 'STAR ON GITHUB' } };

export const Link: Story = { args: { variant: 'link', icon: '←', children: 'BACK TO SCRAPUP', href: '/' } };

export const Small: Story = { args: { size: 'sm', children: 'READ THE DOCS ↗' } };

export const External: Story = {
  args: { variant: 'secondary', href: 'https://github.com/scrapup', children: 'GITHUB ↗' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-row">
      <Button>JOIN THE WAITLIST ↗</Button>
      <Button size="sm">READ THE DOCS ↗</Button>
      <Button icon="★" variant="secondary">
        STAR ON GITHUB
      </Button>
      <Button href="/" icon="←" variant="link">
        BACK TO SCRAPUP
      </Button>
    </div>
  ),
};
