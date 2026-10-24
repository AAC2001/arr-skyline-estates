import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f4f7fb",
          100: "#e6edf7",
          200: "#c5d4ea",
          400: "#6b84a8",
          600: "#35507a",
          700: "#243b5e",
          800: "#1a2d4a",
          900: "#12233b",
          950: "#0a1528",
        },
        gold: {
          300: "#f3dfae",
          400: "#e8c874",
          500: "#d4af37",
          600: "#b8922a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 10px 40px rgba(18, 35, 59, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
