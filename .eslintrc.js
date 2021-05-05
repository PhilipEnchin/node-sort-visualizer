'use strict';

module.exports = {
  extends: 'airbnb-base/legacy',
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'func-names': 'off',
    'max-len': 'off',
    'no-bitwise': 'off',
    'no-console': ['error', { allow: ['log'] }],
    'no-multi-assign': 'off',
    'no-nested-ternary': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': 'off',
    'no-return-assign': 'off',
    'no-use-before-define': ['error', { functions: false, variables: false }],
    yoda: 'off',
  },
};
