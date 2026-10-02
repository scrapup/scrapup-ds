import type { Meta, StoryObj } from '@storybook/react-vite';
import { Backdrop } from './Backdrop';

const meta = {
  title: 'Brand/Backdrop',
  component: Backdrop,
  parameters: { layout: 'fullscreen' },
  args: { marks: true, scanlines: true, fullHeight: true, children: <p className="sb-story-copy">Backdrop content</p> },
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Plain: Story = { args: { marks: false, scanlines: false } };

export const CustomLabels: Story = { args: { label: 'FIG · 02 — MANIFESTO', site: 'SCRAPUP.DEV/MANIFESTO' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-grid">
      <Backdrop>
        <p className="sb-story-copy">marks + scanlines</p>
      </Backdrop>
      <Backdrop scanlines={false}>
        <p className="sb-story-copy">marks only</p>
      </Backdrop>
      <Backdrop marks={false}>
        <p className="sb-story-copy">scanlines only</p>
      </Backdrop>
      <Backdrop marks={false} scanlines={false}>
        <p className="sb-story-copy">plain</p>
      </Backdrop>
    </div>
  ),
};
