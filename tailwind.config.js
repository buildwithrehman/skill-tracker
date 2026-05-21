/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#06060b',
          800: '#0c0c14',
          700: 'rgba(14,14,22,0.75)'
        }
      }
    },
  },
  plugins: [],
}
