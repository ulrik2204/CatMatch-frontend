/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  singleQuote: false,
  arrowParens: "always",
  endOfLine: "auto",
};

module.exports = config;
