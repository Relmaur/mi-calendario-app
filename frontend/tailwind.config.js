/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        general_blue_1: '#557B83',
        general_blue_2: '#39AEA9',
        general_green_1: '#A2D5AB',
        general_green_2: '#E5EFC1',
        general_green_3: '#9DB5A2',
        general_gray_1: '#8e8e8e',
        general_gray_2: '#D9D9D9',
        general_gray_3: '#f2f2f2',
        general_red_1: '#C86A6A',
      } 
    },
  },
  plugins: [],
}

