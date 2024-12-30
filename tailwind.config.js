/** @type {import('tailwindcss').Config} */
export default {
  content: [
      "index.html",
      "./**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
        colors: {
            "primary": "lime",
            "dark": "#222",
            "light": "#ddd",
            "black": "#000",
            "white": "#fff"
        }
    },
  },
  plugins: [],
}

