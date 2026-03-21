/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0b10',
          card: '#161b22',
          border: '#30363d',
          primary: '#238636',
          secondary: '#1f6feb',
          danger: '#da3633',
          alert: '#d29922',
          neon: '#00ff9d',
        }
      },
      backgroundImage: {
        'cyber-grid': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
      }
    },
  },
  plugins: [],
}
