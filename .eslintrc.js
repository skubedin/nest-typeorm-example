module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist/*'],
  rules: {
    "simple-import-sort/exports": "error",
    'simple-import-sort/imports': 'error',
    'max-len': ['error', {
      'code': 100,
      'ignoreUrls': true,
      'ignoreComments': true,
      'ignoreTrailingComments': true
    }],
    'prettier/prettier': ['error', { printWidth: 100 }],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    "@typescript-eslint/ban-ts-comment": "off",
    "import/order": "error",
  },
};
