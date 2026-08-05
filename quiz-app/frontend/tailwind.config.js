/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818CF8', // Indigo light
          DEFAULT: '#6366F1', // Indigo
          dark: '#4F46E5', // Indigo dark
        },
        secondary: {
          light: '#F472B6', // Pink light
          DEFAULT: '#EC4899', // Pink
          dark: '#DB2777', // Pink dark
        },
      },
    },
  },
  plugins: [],
  important: true, // Ensures Tailwind overrides MUI when utility classes are used
};
