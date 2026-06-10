import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import vueParser from 'vue-eslint-parser';

const prettierRules = {
  printWidth: 140,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
};

export default tseslint.config(
  { ignores: ['src/.vitepress/cache/**', 'src/.vitepress/dist/**'] },
  ...pluginVue.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  prettierPlugin,
  // .vue ファイルは vue-eslint-parser をメインに、内部スクリプトは TypeScript パーサー
  {
    files: ['src/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['src/**/*.{js,ts,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'prettier/prettier': ['error', prettierRules],
    },
  },
);
