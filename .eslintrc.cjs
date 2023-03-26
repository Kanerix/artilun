module.exports = {
	'parser': '@typescript-eslint/parser',
	'plugins': [
		'@typescript-eslint'
	],
	'extends': [
		'eslint:recommended',
		'plugin:svelte/recommended',
		'plugin:@typescript-eslint/recommended'
	],
	'env': {
		'node': true,
		'es6': true,
		'browser': true
	},
	'parserOptions': {
		'ecmaVersion': 11,
		'sourceType': 'module'
	},
	'rules': {
		'@typescript-eslint/no-var-requires': 'off',
		'indent': [
			'warn',
			'tab',
			{
				'SwitchCase': 1
			}
		],
		'quotes': [
			'warn',
			'single'
		],
		'semi': [
			'warn',
			'never'
		],
		'no-unused-vars': [
			'warn',
		],
		'brace-style': [
			'warn',
			'1tbs'
		],
		'keyword-spacing': [
			'warn',
			{
				'before': true,
				'after': true
			}
		],
		'object-curly-spacing': [
			'warn',
			'always'
		],
		'camelcase': [
			'warn',
			{
				'properties': 'always'
			}
		],
		'svelte/html-quotes': [
			'error',
			{
				'prefer': 'double', // or "single"
				'dynamic': {
					'quoted': false,
					'avoidInvalidUnquotedInHTML': false
				}
			}
		],
	},
	'overrides': [
		{
			'files': ['*.svelte'],
			'parser': 'svelte-eslint-parser',
			'parserOptions': {
				'parser': '@typescript-eslint/parser',
			},
		},
	],
	'ignorePatterns': [
		'node_modules',
		'dist',
		'.git',
		'build',
		'out',
		'**/*.d.ts'
	]
}