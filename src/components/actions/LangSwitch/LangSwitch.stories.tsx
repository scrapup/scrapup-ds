import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { LangSwitch } from './LangSwitch';

const meta = {
  title: 'Actions/LangSwitch',
  component: LangSwitch,
  args: { value: 'EN' },
  argTypes: { value: { control: 'inline-radio', options: ['EN', 'PT', 'JA'] } },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof LangSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Japanese: Story = { args: { value: 'JA' } };

function InteractiveLangSwitch(): React.JSX.Element {
  const [lang, setLang] = useState('EN');
  return (
    <div className="su-story-stack">
      <LangSwitch onChange={setLang} value={lang} />
      <output className="su-story-copy" data-testid="current-lang">
        {lang}
      </output>
    </div>
  );
}

export const Interactive: Story = { render: () => <InteractiveLangSwitch /> };

export const AllVariants: Story = {
  render: () => (
    <div className="su-story-stack">
      <LangSwitch value="EN" />
      <LangSwitch value="PT" />
      <LangSwitch value="JA" />
    </div>
  ),
};
