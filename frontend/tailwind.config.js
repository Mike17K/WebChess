/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'green-dark': '#769656',
      'green-light': '#bbcb2b',
      'yellow-light': '#eeeed2',
      'yellow-dark': '#f7f769',
      'capture-dark':'#6a874d',
      'capture-light':'#d6d6bd',
      'attack-dark':'#6a874d',
      'attack-light':'#d6d6bd',
      'red-dark':'#d46c51',
      'red-light':'#ec7e6a',

      'red-highlight-dark':'#d35d49',
      'red-highlight-light':'#e06a51',
      'yellow-highlight-dark':'#e69b0b',
      'yellow-highlight-light':'#f6ac1c',
      'green-highlight-dark':'#a5b854',
      'green-highlight-light':'#b1c65d',
      'blue-highlight-dark':'#5b9eba',
      'blue-highlight-light':'#68aec6',



    },
  },
  plugins: [],
}