/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './*.{js,ts,jsx,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        brandRed: '#FF2B22',
        brandOrange: '#FF6A24',
        brandBlue: '#155EEF',
        brandGold: '#FFE17D',
      },
    },
  },
  plugins: [],
};
