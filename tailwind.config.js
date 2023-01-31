/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./render/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
