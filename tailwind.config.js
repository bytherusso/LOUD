/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FONDO: Un crema suave, tipo papel de arte
        'void': '#F2F2EC', 
        // SUPERFICIES: Blanco puro para destacar sobre el crema
        'void-light': '#FFFFFF',
        // TEXTO: Negro casi puro (Ink)
        'ash': '#111111',
        'ash-dim': '#666666',
        // ACENTO: Rojo Internacional (Vibrante)
        'kinetic': '#FF2200', 
      },
      fontFamily: {
        display: ['"Archivo Black"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #111111', // Sombra dura negra
      }
    },
  },
  plugins: [],
}