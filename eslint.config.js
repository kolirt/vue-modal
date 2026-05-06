import prettierConfig from '@vue/eslint-config-prettier'
import vueTsConfig from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', 'docs/**']
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsConfig(),
  prettierConfig,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
    }
  }
]
