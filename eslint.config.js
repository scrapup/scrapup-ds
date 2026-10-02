// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// Brand rules (plan §5.3). eslint-plugin-react 7.x does not support ESLint 10, so the two React
// rules are expressed as AST selectors: no inline `style` (RN-08) and no `dangerouslySetInnerHTML`.
const NO_INLINE_STYLE = {
  selector: 'JSXAttribute[name.name="style"]',
  message: 'Inline styles are forbidden (RN-08): use a `su-` class and tokens.',
};
const NO_DANGER = {
  selector: 'JSXAttribute[name.name="dangerouslySetInnerHTML"]',
  message: 'dangerouslySetInnerHTML is forbidden: render text as React children.',
};

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: { allowDefaultProject: ['*.js', 'scripts/*.mjs'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'no-restricted-syntax': ['error', NO_INLINE_STYLE, NO_DANGER],
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'test/**', 'e2e/**'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
);
