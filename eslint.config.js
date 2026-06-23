const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'commonjs',
            globals: {
                ...globals.node
            }
        },
        rules: {
            // 允许未使用的函数参数（如 express 的 next、err），但禁止未使用的变量
            'no-unused-vars': ['warn', {args: 'none'}],
            'no-console': 'off',
            // 现有代码大量使用 async Promise executor 与 while(true)，降级为警告
            'no-async-promise-executor': 'warn',
            'no-constant-condition': ['warn', {checkLoops: false}]
        }
    },
    {
        // 浏览器端模板脚本 + puppeteer page.evaluate() 中的浏览器上下文（含注入的 jQuery）
        files: ['views/**/*.js', 'server/crawler/**/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
                $: 'readonly',
                jQuery: 'readonly'
            }
        }
    },
    {
        ignores: ['node_modules/', 'utils/*.txt']
    }
];
