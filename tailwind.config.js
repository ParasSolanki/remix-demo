/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      data: {
        active: "state=active",
        inactive: "state=inactive",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
