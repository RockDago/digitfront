/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        henno: ["Henno", "serif"],
        cassannet: ["Cassannet Plus", "serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
