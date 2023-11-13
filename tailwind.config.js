/** @type {import('tailwindcss').Config} */
const colors = require('./src/utils/colors');

module.exports = {
    // darkMode: 'class',
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors,
        },
    },
    plugins: [],
};
