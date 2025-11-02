/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'hku-green': '#00663c',
				'hku-dark-green': '#004d2e',
				'hku-light-green': '#00995c'
			}
		}
	},
	plugins: []
	// Note: Add @tailwindcss/forms plugin after installation:
	// plugins: [require('@tailwindcss/forms')]
};

