/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}"
],
  theme: {
    colors:{
      blue: colors.blue,     // Inclui todas as variantes de azul
      green: colors.green,   // Inclui todas as variantes de verde
      purple: colors.purple, // Inclui todas as variantes de roxo
      sky: colors.sky,
      teal: colors.teal,
      midnight: colors.midnight,
      purple: colors.purple,
      slate: colors.slate,
      white: colors.white,
      




    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

