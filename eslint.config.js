import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'content/**',
      'config/**',
      'docs/**',
      'assets/**',
      'i18n/**',
      'bin/**',
      '.github/**',
      '.devcontainer/**',
      '.vscode/**',
      '.superpowers/**',
      'playwright-report/**',
      'test-results/**',
      '.lighthouseci/**',
      'public/**',
      'resources/**'
    ]
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended']
];
