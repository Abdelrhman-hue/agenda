import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['"IBM Plex Sans Arabic"', "sans-serif"],
      },
      colors: {
        canvas: "#FAFBF8",
        surface: "#FFFFFF",
        primary: {
          DEFAULT: "#087F6A",
          dark: "#056653",
          light: "#DDF4EE",
        },
        accent: {
          gold: "#E7B84B",
        },
        neutral: {
          primary: "#17201E",
          muted: "#6B7672",
        },
        border: {
          subtle: "#E5EAE7",
        },
        status: {
          success: "#16855B",
          warning: "#D99A22",
          error: "#D94B4B",
        },
      },
      borderRadius: {
        card: "1rem", // 16px
        input: "0.625rem", // 10px
      },
      boxShadow: {
        level1: "0 1px 3px rgba(23, 32, 30, 0.04), 0 1px 2px rgba(23, 32, 30, 0.02)",
        level2: "0 4px 12px -2px rgba(8, 127, 106, 0.08), 0 2px 6px -1px rgba(23, 32, 30, 0.04)",
        level3: "0 10px 24px -4px rgba(23, 32, 30, 0.08), 0 4px 8px -2px rgba(23, 32, 30, 0.04)",
        level4: "0 20px 40px -8px rgba(23, 32, 30, 0.16)",
      },
    },
  },
  plugins: [],
};

export default config;