import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FBF8F3",
        cream: "#F5EFE6",
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C97E",
          dark: "#A47E2B",
        },
        burgundy: {
          DEFAULT: "#6E1023",
          light: "#8B1D34",
          dark: "#4A0A17",
        },
        charcoal: "#2B2320",
      },
      fontFamily: {
        ar: ["var(--font-amiri)", "serif"],
        arSans: ["var(--font-tajawal)", "sans-serif"],
        en: ["var(--font-cormorant)", "serif"],
        enSans: ["var(--font-jost)", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 20px 60px -15px rgba(110, 16, 35, 0.25)",
        gold: "0 8px 30px -8px rgba(201, 162, 75, 0.4)",
        soft: "0 10px 40px -12px rgba(43, 35, 32, 0.18)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E4C97E 0%, #C9A24B 45%, #A47E2B 100%)",
        "burgundy-gradient":
          "linear-gradient(160deg, #8B1D34 0%, #6E1023 55%, #4A0A17 100%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 3s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
