module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00AFF4',
        secondary: '#707070ff',
        tertiary: '#814686ff'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
