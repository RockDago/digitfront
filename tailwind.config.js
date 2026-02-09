/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cassannet: ["Cassannet Plus", "serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true, // Active le reset CSS de Tailwind pour supprimer les marges par défaut
  },
};
