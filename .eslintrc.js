module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "@typescript-eslint/consistent-type-assertions": "warn",
        "@typescript-eslint/member-delimiter-style": [
            "warn",
            {
                multiline: {
                    delimiter: "semi",
                    requireLast: true,
                },
                singleline: {
                    delimiter: "semi",
                    requireLast: false,
                },
            },
        ],
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "warn",
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-unused-expressions": "warn",
        "@typescript-eslint/prefer-for-of": "off",
        "@typescript-eslint/quotes": ["warn", "double"],
        "@typescript-eslint/semi": ["warn", "always"],
        "@typescript-eslint/type-annotation-spacing": "warn",
        "@typescript-eslint/no-non-null-assertion": "off",
        "arrow-body-style": "warn",
        "arrow-parens": ["warn", "as-needed"],
        "brace-style": ["warn", "1tbs"],
        curly: "warn",
        "eol-last": "warn",
        eqeqeq: ["warn", "smart"],
        "id-blacklist": [
            "warn",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined",
        ],
        "id-match": "warn",
        indent: ["warn", 4],
        "max-len": [
            "warn",
            {
                code: 120,
            },
        ],
        "new-parens": "warn",
        "no-bitwise": "warn",
        "no-caller": "warn",
        "no-cond-assign": "warn",
        "no-console": "warn",
        "no-debugger": "warn",
        "no-empty": "warn",
        "no-empty-function": "warn",
        "no-eval": "warn",
        "no-extra-semi": "off",
        "no-irregular-whitespace": "warn",
        "no-multiple-empty-lines": "warn",
        "no-new-wrappers": "warn",
        "no-redeclare": "warn",
        "no-trailing-spaces": "warn",
        "no-undef-init": "warn",
        "no-underscore-dangle": "warn",
        "no-unsafe-finally": "warn",
        "no-unused-expressions": "warn",
        "no-unused-labels": "warn",
        "no-var": "warn",
        "object-curly-spacing": ["warn", "always"],
        "prefer-const": "warn",
        quotes: "warn",
        semi: "warn",
        "space-before-function-paren": [
            "warn",
            {
                anonymous: "always",
                named: "never",
                asyncArrow: "always",
            },
        ],
        "space-in-parens": ["off", "never"],
    },
};
