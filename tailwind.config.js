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
          50: '#f0fdf9',
          100: '#ccfbef',
          200: '#99f6df',
          300: '#5ceace',
          400: '#2dd4b8',
          500: '#14b8a0',
          600: '#0d9483',
          700: '#0f766b',
          800: '#115e56',
          900: '#134e48',
          950: '#042f2e',
        },
      },
    },
  },
  plugins: [],
};
