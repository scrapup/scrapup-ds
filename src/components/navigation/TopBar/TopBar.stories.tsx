import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopBar } from './TopBar';

const LINKS = [
  { label: 'MANIFESTO', href: '#manifesto' },
  { label: 'PROCESS', href: '#process' },
  { label: 'DOCS', href: 'https://github.com/scrapup/scrapup#readme' },
];

const meta = {
  title: 'Navigation/TopBar',
  component: TopBar,
  args: { links: LINKS, active: 'MANIFESTO', homeHref: '#' },
  decorators: [
    (Story) => (
      <div className="sb-story-page">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Minimal: Story = { args: { links: [], active: undefined, repo: '' } };

function TopBarWithLanguage(): React.JSX.Element {
  const [lang, setLang] = useState('EN');
  return <TopBar active="MANIFESTO" homeHref="#" lang={lang} links={LINKS} onLang={setLang} />;
}

export const WithLanguage: Story = { render: () => <TopBarWithLanguage /> };

export const AllVariants: Story = {
  render: () => (
    <div className="sb-story-stack sb-story-stack--wide">
      <TopBar active="MANIFESTO" homeHref="#" links={LINKS} />
      <TopBar homeHref="#" lang="PT" links={LINKS} onLang={() => undefined} />
      <TopBar links={[{ label: 'WAITLIST', onClick: () => undefined }]} repo="" tagline="" />
    </div>
  ),
};
