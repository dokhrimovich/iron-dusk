module.exports = {
    root: true,

    env: {
        commonjs: true,
        node: true,
        amd: true,
        browser: true,
        es6: true
    },

    parser: '@babel/eslint-parser',

    parserOptions: {
        sourceType: 'module'
    },

    extends: ['eslint:recommended', 'plugin:react-hooks/recommended'],

    plugins: [
        'react',
        '@babel',
        'import',
        'react-hooks'
    ],

    rules: {
        // Possible Errors
        'no-cond-assign': 'off',
        'no-console': 'off',
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'off',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty-character-class': 'error',
        'no-empty': 'error',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-parens': 'off',
        'no-extra-semi': 'error',
        'no-func-assign': 'error',
        'no-inner-declarations': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': [
            'error',
            {
                skipStrings: true,
                skipRegExps: true,
                skipTemplates: true
            }
        ],
        'no-obj-calls': 'error',
        'no-prototype-builtins': 'warn',
        'no-regex-spaces': 'error',
        'no-sparse-arrays': 'error',
        'no-template-curly-in-string': 'off',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'use-isnan': 'error',
        'valid-jsdoc': 'off', // WIP
        'valid-typeof': 'error',

        // Best Practices
        'accessor-pairs': 'error',
        'array-callback-return': 'error',
        'block-scoped-var': 'error',
        'class-methods-use-this': 'off',
        'complexity': 'off',
        'consistent-return': 'off', // WIP
        'curly': 'error',
        'default-case': 'off', // WIP
        'dot-location': ['error', 'property'],
        'eqeqeq': ['error', 'smart'],
        'guard-for-in': 'off', // WIP
        'no-alert': 'error',
        'no-caller': 'error',
        'no-case-declarations': 'error',
        'no-div-regex': 'off',
        'no-else-return': 'warn',
        'no-empty-function': ['off'], // WIP: maybe use predefined emptyFn or _.noop?
        'no-empty-pattern': 'error',
        'no-eq-null': 'off',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'warn',
        'no-extra-label': 'error',
        'no-fallthrough': 'error',
        'no-floating-decimal': 'error',
        'no-global-assign': 'error',
        'no-implicit-coercion': 'warn',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-invalid-this': 'off',
        'no-iterator': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'warn',
        'no-magic-numbers': [
            'off',
            {
                ignoreArrayIndexes: true,
                ignore: [-1, 0, 1]
            }
        ],
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-multiple-empty-lines': [
            'warn',
            {
                max: 1,
                maxEOF: 1
            }
        ],
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-octal': 'error',
        'no-param-reassign': 'off',
        'no-proto': 'error',
        'no-redeclare': 'error',
        'no-restricted-properties': [
            'error',
            {
                property: '__defineGetter__',
                message: 'Please use Object.defineProperty instead.'
            },
            {
                property: '__defineSetter__',
                message: 'Please use Object.defineProperty instead.'
            }
        ],
        'no-return-assign': 'off', // WIP: discuss
        'no-script-url': 'error',
        'no-self-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'off',
        'no-unmodified-loop-condition': 'error',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-useless-escape': 'off', // WIP: this rule has a number of issues both false-positive and false-negative
        'no-useless-return': 'error',
        'no-void': 'error',
        'no-warning-comments': 'off', // WIP: we are not ready for this
        'no-with': 'error',
        'radix': ['error', 'as-needed'],
        'vars-on-top': 'off',
        'wrap-iife': [
            'error',
            'inside',
            {
                functionPrototypeMethods: true
            }
        ],
        'yoda': 'error',

        // Strict Mode
        'strict': 'off', // WIP: our module format is not supported. Consider requirejs plugin for eslint

        // Variables
        'init-declarations': 'off',
        'no-catch-shadow': 'error',
        'no-delete-var': 'error',
        'no-label-var': 'error',
        'no-restricted-globals': [ // WIP: should add some nasty vars here, also, disallow test globals here, maybe
            'error',
            'name'
        ],
        'no-shadow-restricted-names': 'error',
        'no-shadow': 'warn',
        'no-undef-init': 'error',
        'no-undef': 'error',
        'no-undefined': 'off',
        'no-unused-vars': 'warn', // WIP: we should discuss this as it was a 'good' practice to leave a lot of unused
                                  // vars
        'no-use-before-define': [
            'error',
            {
                functions: false,
                classes: false,
                variables: false
            }
        ],

        // Stylistic Issues
        'semi': 'error',
        'block-spacing': 'error',
        'no-mixed-spaces-and-tabs': 'error',
        'no-trailing-spaces': 'error',
        'no-whitespace-before-property': 'error',
        'space-before-blocks': 'error',
        'space-before-function-paren': [
            'error', {
                'anonymous': 'never',
                'named': 'never',
                'asyncArrow': 'always'
            }
        ],
        'space-in-parens': 'error',
        'space-infix-ops': 'off',
        'space-unary-ops': 'error',

        // Babel plugins
        '@babel/no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true,
                allowTernary: true
            }
        ],

        // JSX
        'react/jsx-uses-vars': 1,
        'react/jsx-uses-react': 1,
        'react/react-in-jsx-scope': 1,
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/no-deprecated': 'error',

        // React hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error'
    }
};
