/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],

    daisyui: {
        styled: true,
        base: true,
        utils: true,
        themes: [
            {
                mytheme: {

                    primary: '#172a3a',

                    secondary: '#577590',

                    accent: '#e76f51',

                    neutral: '#172a3a',

                    'base-100': '#FFFFFF',

                    info: '#f4a261',

                    success: '#90be6d',

                    warning: '#f9c74f',

                    error: '#f94144',
                },
            },
        ],
    },

    plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
