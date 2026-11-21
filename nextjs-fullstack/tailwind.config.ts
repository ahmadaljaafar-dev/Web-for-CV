import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0B0D11",
          900: "#11141B",
          800: "#181C26",
          700: "#242A38",
          600: "#343C4F",
        },
        warm: {
          white: "#F4F1EA",
          muted: "#B5B0A6",
        },
        electric: {
          DEFAULT: "#3B82F6",
          bright: "#60A5FA",
          glow: "#38BDF8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
