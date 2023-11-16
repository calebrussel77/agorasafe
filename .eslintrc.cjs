// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/** @type {import("eslint").Linter.Config} */
const config = {
  overrides: [
    {
      extends: [
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:testing-library/react',
      ],
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        project: path.join(__dirname, 'tsconfig.json'),
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: path.join(__dirname, 'tsconfig.json'),
  },
  plugins: ['@typescript-eslint'],
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        patterns: ['@/features/*/*'],
      },
    ],
    'require-await': 'off',
    '@typescript-eslint/require-await': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/no-unescaped-entities': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/no-unsafe-assignment': 'off',
    'react/no-unknown-property': 0,
    'no-unused-vars': [1, { args: 'after-used', varsIgnorePattern: '^_' }],
    'no-console': 'off',
    'no-unsafe-optional-chaining': 0,
    '@typescript-eslint/no-misused-promises': [
      'warn',
      {
        checksVoidReturn: false,
      },
    ],
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'warn',
      { allowNullish: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'testing-library/render-result-naming-convention': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    camelcase: 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase', 'UPPER_CASE'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'with'],
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        // prefix: ['T'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: false,
        },
      },
      {
        selector: ['typeLike', 'interface'],
        format: ['PascalCase'],
      },
    ],
  },
};

module.exports = config;
