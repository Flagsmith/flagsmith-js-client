module.exports = {
    "env": {
        "es6": true,
        "browser": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "legacyDecorators": true,
            "modules": true
        }
    },
    "plugins": [
        "react",
        "react-hooks",
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/ban-ts-comment": "off"
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "globals": {

    },
};
