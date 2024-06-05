import globals from "globals"
import pluginJs from "@eslint/js"
import stylistic from "@stylistic/eslint-plugin"

export default [
	{
		languageOptions: {
			globals: globals.browser
		},
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			"@stylistic/indent": ["warn", "tab"],
			"@stylistic/linebreak-style": ["warn", "unix"],
			"@stylistic/semi": ["warn", "never"],
			"@stylistic/space-before-function-paren": ["warn", {"anonymous": "always", "named": "never", "asyncArrow": "always"}],
			"@stylistic/space-in-parens": ["warn", "never"],
			"@stylistic/quotes": ["warn", "double"],
			"@stylistic/spaced-comment": ["warn", "always"],
			"no-console": "warn",   
		}
	},
	pluginJs.configs.recommended,
]