/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        h1: { fontSize: theme("fontSize.2xl") },
        h2: { fontSize: theme("fontSize.xl") },
        h3: { fontSize: theme("fontSize.lg") },
        h4: { fontSize: theme("fontSize.sm") },
      });
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FFD700",
        secondary: "#FF0000",
        accent1: "#4CAF50",
        accent2: "#2196F3",
        // background: "#FFFFFF",
        text: "#333333",
        stext: "#7D7D7D",
        error: "#FF5722",
        pokeborder: "#FFFF00",
        pokebackground: "#2E8BC0",
      },
    },
  },
};
