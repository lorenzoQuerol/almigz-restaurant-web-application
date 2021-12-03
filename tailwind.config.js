

module.exports = {
    mode: 'jit',
    purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        container: {
            center: true,
          },
        extend: {
            fontFamily: {
                'rale': ['Raleway', 'sans-serif'],
              },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('daisyui'),
    ],
    daisyui: {
        
    }
};
