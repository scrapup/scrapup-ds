import type { Meta, StoryObj } from '@storybook/react-vite';
import { CodeChip } from './CodeChip';

const meta = {
  title: 'Content/CodeChip',
  component: CodeChip,
  args: { children: '/plugin install scrapup' },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CodeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'install:' } };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack">
      <CodeChip>/plugin install scrapup</CodeChip>
      <CodeChip hint="install:">npm i github:scrapup/scrapup-ds</CodeChip>
    </div>
  ),
};
