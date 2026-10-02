import type { Meta, StoryObj } from '@storybook/react-vite';
import { Panel } from './Panel';

const meta = {
  title: 'Surfaces/Panel',
  component: Panel,
  args: { variant: 'default', padding: 'md', children: <p className="sb-story-copy sb-story-copy--tight">Panel content</p> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'strong', 'edge', 'dashed'] },
    padding: { control: 'inline-radio', options: ['md', 'lg', 'xl', 'xxl'] },
    accentEdge: { control: 'inline-radio', options: [undefined, 'neon', 'cyan'] },
    as: { control: 'inline-radio', options: ['div', 'section', 'article'] },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Strong: Story = { args: { variant: 'strong', padding: 'xxl' } };

export const Edge: Story = { args: { variant: 'edge' } };

export const Dashed: Story = { args: { variant: 'dashed' } };

export const AccentEdge: Story = { args: { accentEdge: 'cyan' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-grid">
      <Panel>
        <p className="sb-story-copy sb-story-copy--tight">default</p>
      </Panel>
      <Panel variant="strong">
        <p className="sb-story-copy sb-story-copy--tight">strong</p>
      </Panel>
      <Panel variant="edge">
        <p className="sb-story-copy sb-story-copy--tight">edge</p>
      </Panel>
      <Panel variant="dashed">
        <p className="sb-story-copy sb-story-copy--tight">dashed — not ours / not yet</p>
      </Panel>
      <Panel accentEdge="neon">
        <p className="sb-story-copy sb-story-copy--tight">neon accent edge</p>
      </Panel>
      <Panel accentEdge="cyan" padding="xxl">
        <p className="sb-story-copy sb-story-copy--tight">cyan accent edge, xxl padding</p>
      </Panel>
    </div>
  ),
};
