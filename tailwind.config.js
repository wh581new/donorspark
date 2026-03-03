/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f7f5',
          100: '#e4ebe7',
          200: '#cdd9d1',
          300: '#a8bfae',
          400: '#8fad97',
          500: '#7a9b83',
          600: '#6b8b74',
          700: '#5a7a63',
          800: '#4a6452',
          900: '#3d5344',
          950: '#2a3a2f',
        },
        navy: {
          600: '#3d4f6f',
          700: '#2e3e5c',
          800: '#1e2d47',
          900: '#1a2640',
        },
        cream: {
          50: '#fefcf8',
          100: '#faf5ed',
          200: '#f5efe3',
        },
      },
    },
  },
  plugins: [],
};
