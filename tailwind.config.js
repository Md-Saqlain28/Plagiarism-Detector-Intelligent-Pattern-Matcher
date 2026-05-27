/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d2ff',
        'neon-green': '#39ff14',
        'emerald-500': '#10b981',
        'dark-bg': '#0a0a0c',
        'dark-card': '#16161a',
        'dark-border': '#2a2a32',
      },
    },
  },
  plugins: [],
}
