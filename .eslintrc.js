module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 9
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "no-multiple-empty-lines": [
      "warn",
      {
        "max": 2
      }
    ],
    "no-console": "off",
    "no-useless-escape": "off",
    "no-var": "warn",
    "no-const-assign": "warn",
    "no-debugger": "warn",
    "no-caller": "warn",
    "no-eval": "error",
    "no-new-func": "error",
    "no-case-declarations": "off"
  },
  "globals": {}
};