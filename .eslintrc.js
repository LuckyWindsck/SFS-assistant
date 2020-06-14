module.exports = {
  env: {
    webextensions: true,
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-alert': 'off',
    'no-console': ['warn', { allow: ['log'] }],
  },
};
