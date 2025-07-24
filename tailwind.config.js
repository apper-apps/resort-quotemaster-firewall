/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8B4513",
        secondary: "#D2691E", 
        accent: "#FF6B35",
        surface: "#FFF8DC",
        background: "#FAF0E6",
        success: "#228B22",
        warning: "#FFB300",
        error: "#DC143C",
        info: "#4682B4"
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}