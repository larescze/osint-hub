import type { Config } from 'tailwindcss'

export default {
	content: ['index.html', 'src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
			},
		},
	},
	plugins: [],
} satisfies Config
