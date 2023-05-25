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

                    primary: '#66CC8A',

                    secondary: '#377CFB',

                    accent: '#EA5234',

                    neutral: '#333C4D',

                    'base-100': '#FFFFFF',

                    info: '#3ABFF8',

                    success: '#36D399',

                    warning: '#FBBD23',

                    error: '#F87272',
                },
            },
        ],
    },

    plugins: [require('@tailwindcss/typography'), require('daisyui')],
};
