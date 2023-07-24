/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:react-hooks/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  ignorePatterns: ['*.js', '*.cjs', '*.d.ts'],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'jsx-quotes': ['error', 'prefer-single'],
    'space-infix-ops': 'error',
    'keyword-spacing': 'error',
    'eol-last': 'error',
    'comma-dangle': ['error', {
      'arrays': 'never',
      'objects': 'only-multiline',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],
    'object-curly-spacing': 'error',
    'space-before-function-paren': ['error', 'always'],
    'space-before-blocks': ['error', 'always'],
    'arrow-spacing': 'error',
    '@typescript-eslint/type-annotation-spacing': ['error', {
      before: false,
      after: true,
      overrides: {
        arrow: {before: true, after: true}
      }
    }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  }
};
