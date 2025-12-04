/** @type {import('tailwindcss').Config} */
// tailwind.config.js
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  "#f4f8f4",
          100: "#dce8dc",
          200: "#b7d0b7",
          300: "#8bb28b",
          400: "#5e955e",
          500: "#3c6e3c", // rich forest green
          600: "#315a31",
          700: "#274727",
          800: "#1d341d",
          900: "#142414",
        },
        earth: {
          50:  "#faf7f3",
          100: "#f2e7da",
          200: "#e0c7a8",
          300: "#cda876",
          400: "#b78b50",
          500: "#966b32", // warm brown
          600: "#795429",
          700: "#5d3f1f",
          800: "#422c16",
          900: "#281a0d",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
