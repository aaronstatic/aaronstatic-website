/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  plugins: [
    require('flowbite/plugin')
  ],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
