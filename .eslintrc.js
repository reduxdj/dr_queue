module.exports = {
  extends: ['google', 'eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      spread: true
    }
  },
  rules: {
    'require-jsdoc': 'off',
    'comma-dangle': 'off',
    semi: ['error', 'never'],
    'max-len': ['error', {code: 110, comments: 80}],
    'no-undef': 'error',
    'no-console': 1,
    curly: ['error', 'multi', 'consistent']
  },
  globals: {
    global: false,
    Promise: false,
    console: false,
    require: false,
    process: false,
    module: false,
    setTimeout: false
  }
}
