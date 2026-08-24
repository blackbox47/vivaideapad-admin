import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // ─── General code quality (tslint-style) ─────────────────────────────
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-var': 'warn',
      'eqeqeq': ['warn', 'always', { null: 'ignore' }],
      'default-case': 'warn',
      'default-case-last': 'warn',
      'consistent-return': 'warn',
      'no-mixed-operators': 'warn',
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { allowTemplateLiterals: true }],
      'jsx-quotes': ['warn', 'prefer-double'],

      // ─── TypeScript (modern tslint replacement) ─────────────────────────
      // Keep in sync with the delombok-style rules tslint used to enforce.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      // NOTE: type-aware rules are intentionally excluded — they require
      // parserOptions.project and slow down lint significantly. To enable them,
      // switch the extends above to `tseslint.configs.recommended-type-checked`
      // and add `parserOptions: { project: './tsconfig.app.json' }` to
      // languageOptions. Excluded type-aware rules:
      //   no-floating-promises, no-misused-promises, await-thenable,
      //   no-unnecessary-condition, return-await, prefer-nullish-coalescing,
      //   prefer-optional-chain, no-unnecessary-type-assertion,
      //   no-unnecessary-template-expression, require-await
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/ban-ts-comment': [
        'warn',
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
        },
      ],
      '@typescript-eslint/array-type': [
        'warn',
        { default: 'array-simple', readonly: 'array-simple' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-module-boundary-types': 'off',

      // ─── React hooks ──────────────────────────────────────────────────────
      'react-hooks/exhaustive-deps': 'off',
    },
  },
  // shadcn/ui components live under src/components/ui/. They follow the
  // shadcn code style (no semicolons, double quotes) and export both a
  // component and a variants helper from the same file — relax the rules
  // that would otherwise flag them.
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'semi': 'off',
      'quotes': 'off',
      'jsx-quotes': 'off',
      '@typescript-eslint/no-shadow': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  // Separate config block for non-TS files (e.g. *.js, *.cjs) so react-refresh
  // doesn't try to analyze them.
  {
    files: ['**/*.{js,jsx,cjs,mjs}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
])
