/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Luxury premium color system (Vercel/Linear slate & deep darks)
        slate: {
          950: '#030712',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
        },
        status: {
          present: '#10b981',   // Emerald Green
          absent: '#ef4444',    // Rose Red
          holiday: '#3b82f6',   // Royal Blue
          medical: '#8b5cf6',   // Violet Purple
          cancelled: '#ef4444', // Red/Orange (we'll also support amber for updates)
          extra: '#f59e0b',     // Amber Gold
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
