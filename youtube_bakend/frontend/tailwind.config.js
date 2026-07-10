/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Modern blue
        secondary: "#10b981", // Modern green
        dark: "#111827",
        darker: "#030712",
        light: "#f9fafb",
      }
    },
  },
  plugins: [],
}
