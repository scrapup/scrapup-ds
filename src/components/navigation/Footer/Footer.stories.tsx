import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta = {
  title: 'Navigation/Footer',
  component: Footer,
  args: {
    links: [
      { label: 'github', href: 'https://github.com/scrapup' },
      { label: 'manifesto', href: '#manifesto' },
    ],
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = { args: { links: [], items: [], author: '' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <Footer links={[{ label: 'github', href: 'https://github.com/scrapup' }]} />
      <Footer />
      <Footer author="" items={['scrapup.dev']} links={[{ label: 'privacy', onClick: () => undefined }]} />
    </div>
  ),
};
