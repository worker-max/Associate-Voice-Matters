import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#4A7C6F",
          hover: "#3A6459",
          light: "#6B9E91",
          50: "#EEF4F3",
        },
        bloom: "#E8845C",
        gold: {
          DEFAULT: "#D4A843",
          hover: "#B8902F",
        },
        slate: {
          DEFAULT: "#2C3A3F",
          soft: "#4A5458",
        },
        ivory: {
          DEFAULT: "#FAF8F3",
          card: "#F2EEE6",
        },
        mist: "#EEF4F3",
      },
      fontFamily: {
        display: ["var(--font-lora)", "Georgia", "serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        bubble: "1.75rem",
      },
      boxShadow: {
        warm: "0 12px 32px -16px rgba(44, 58, 63, 0.18)",
        lift: "0 18px 48px -20px rgba(44, 58, 63, 0.28)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.02)" },
        },
      },
      animation: {
        breathe: "breathe 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
