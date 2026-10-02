// Brand rules (plan §5.3): outside the token sources (src/tokens/*.css and the src/tokens.css
// aggregator) styles reference tokens only (RN-07) and corners stay square (RN-10).
/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'light-dark',
    ],
    'declaration-property-value-allowed-list': {
      '/^border(-(top|bottom|start|end)-(left|right|start|end))?-radius$/': ['0', '/^var\\(--radius-[a-z0-9-]+\\)$/'],
    },
    'selector-class-pattern': [
      '^su-[a-z0-9]+(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(--[a-z0-9]+(-[a-z0-9]+)*)?$',
      { message: 'Use su- BEM class names (su-block__element--modifier).' },
    ],
  },
  overrides: [
    {
      files: ['src/tokens.css', 'src/tokens/**/*.css'],
      rules: {
        'color-no-hex': null,
        'color-named': null,
        'function-disallowed-list': null,
      },
    },
  ],
};
