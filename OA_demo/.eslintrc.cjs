/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/multi-word-component-names': 'off', // 不校验组件名
    'vue/no-multiple-template-root': 0, // 不需要使用根元素包裹template的内容
    'vue/comment-directive': 'off'
  }
}
