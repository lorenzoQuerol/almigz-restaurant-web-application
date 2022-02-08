module.exports = {
	mode: "jit",
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}', 
		'./components/**/*.{js,ts,jsx,tsx}', 
		'./src/**/*.{html,js}', 
		'./node_modules/tw-elements/dist/js/**/*.js'],
	theme: {
		extend: {
			fontFamily: {
				rale: ["Raleway", "sans-serif"],
			},
		},
	},
	plugins: [
			require("daisyui"), 
			require('tw-elements/dist/plugin'),
		],
	daisyui: {
		themes: ["lofi"],
	},
};
