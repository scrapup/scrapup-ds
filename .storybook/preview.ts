import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
};

export default preview;
