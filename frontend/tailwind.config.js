/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      sm: '660px',
      md: '920px',
      lg: '1094px',
      xl: '1530px',
      '2xl': '1876px',
    },
    extend: {
      // Add any custom theme extensions here
    },
  },
  plugins: [],
}
