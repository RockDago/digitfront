/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // custom font used for logos and headers
        henno: ["Henno", "serif"],
        // legacy cassannet kept in case other parts still reference it
        cassannet: ["Cassannet Plus", "serif"],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
};
