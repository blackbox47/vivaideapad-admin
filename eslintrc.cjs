module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'semi': ['warn', 'always'],
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    'no-var': 'warn',
    'eqeqeq': 'warn',
    'default-case': 'warn',
    'default-case-last': 'warn',
    'consistent-return': 'warn',
    'require-await': 'warn',
    'no-mixed-operators': 'warn',
    'jsx-quotes': ['warn', 'prefer-double'],
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index']
        ],
        'pathGroups': [
          {
            pattern: 'react/**',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@assets/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@components/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@contexts/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@features/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@hooks/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@layouts/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@models/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@pages/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@reducers/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@services/**',
            group: 'internal',
            position: 'before'
          },
          {
            pattern: '@utils/**',
            group: 'internal',
            position: 'before'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'ignore',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true },
      }
    ]
  }
}
