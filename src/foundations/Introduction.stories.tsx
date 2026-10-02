import type { Meta, StoryObj } from '@storybook/react-vite';

function Introduction(): React.JSX.Element {
  return (
    <main className="su-intro">
      <h1>scrapup design system</h1>
      <p>Brand tokens, assets and React components for scrapup surfaces.</p>
    </main>
  );
}

const meta = {
  title: 'Foundations/Introduction',
  component: Introduction,
} satisfies Meta<typeof Introduction>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
