/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F6F1E4',
        paper: '#FFFCF4',
        forest: '#2F4A3C',
        forestDeep: '#1F3129',
        sage: '#7C8B6F',
        gold: '#C9A227',
        goldSoft: '#E0C169',
        rust: '#A85C32',
        pink: '#C97F72',
        violet: '#8B7FE8',
        amber: '#F2A65A',
        ink: '#2B2A25',
        inkDim: '#6B6455',
        line: 'rgba(43,42,37,0.12)',
      },
      fontFamily: {
        serif: ['"Noto Serif KR"', 'serif'],
        sans: ['"Noto Sans KR"', 'sans-serif'],
        accent: ['Fraunces', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        site: '1160px',
        narrow: '640px',
        read: '760px',
      },
    },
  },
  plugins: [],
};

