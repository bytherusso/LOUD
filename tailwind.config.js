/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        street: {
          dark: '#0a0a0a',     // Fondo principal
          card: '#171717',     // Fondo de tarjetas
          accent: '#EAB308',   // Amarillo Industrial
          text: '#ededed',     // Texto claro
          muted: '#525252',    // Texto gris
          border: '#333333'    // Bordes
        }
      },
      fontFamily: {
        display: ['ui-sans-serif', 'system-ui', 'sans-serif'], 
      },
      boxShadow: {
        'hard': '6px 6px 0px 0px rgba(234, 179, 8, 1)', 
        'hard-sm': '3px 3px 0px 0px rgba(234, 179, 8, 1)',
      }
    },
  },
  plugins: [],
}