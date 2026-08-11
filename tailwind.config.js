/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8F0',
        peach: '#FFD9B3',
        coral: '#FF8A65',
        deep: '#5D3A1A',
      },
    },
  },
  plugins: [],
};
