import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        foreground: "#ffffff",
        card: {
          DEFAULT: "#1E1F22",
          foreground: "#ffffff",
        },
        "card-alt": "#2B2D31",
        primary: {
          DEFAULT: "#5865F2",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        border: "rgba(255, 255, 255, 0.05)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#5865F2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      letterSpacing: {
        tight: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;

