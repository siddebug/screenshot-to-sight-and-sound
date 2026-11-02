/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#1B3B2B",
          dark: "#142D21",
          light: "#264F3B",
        },
        sage: {
          DEFAULT: "#2D5A43",
          light: "#EBF4EF",
          subtle: "#F4F8F5",
        },
        cream: {
          DEFAULT: "#FBF9F5",
          dark: "#F3ECE1",
        },
        terracotta: {
          DEFAULT: "#D97757",
          light: "#FDF2EE",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 24px -12px rgba(27, 59, 43, 0.15)",
        card: "0 4px 16px -4px rgba(27, 59, 43, 0.08)",
      },
    },
  },
  plugins: [],
}

