/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
  "./src/**/*.{vue,js,ts,jsx,tsx}"
],
  theme: {
    colors:{
      'midnight': '#121063',
      'purple': '#3f3cbb',




    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

