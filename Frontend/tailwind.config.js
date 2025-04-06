/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "jetBlack":"#191919",
        "brightRed":"#F20001"
      },
      fontFamily:{
        "sora":["Sora", "sans-serif"],
        "inter":["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
}