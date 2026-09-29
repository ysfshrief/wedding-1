import type { Config } from "tailwindcss";

/**
 * Warm-neutral palette sampled from the couple's portrait
 * (cream backdrop, linen dress, sand suit, champagne frames, walnut accents).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FAF6EF",
        cream: "#F3EADD",
        linen: "#E9DECD",
        sand: "#D8C5AB",
        taupe: "#A58B73",
        champagne: {
          DEFAULT: "#B89770",
          light: "#E6D5B8",
          dark: "#7F6146",
        },
        espresso: {
          DEFAULT: "#5B4636",
          light: "#735A47",
          dark: "#3B2D24",
        },
        charcoal: "#2E241D",
      },
      fontFamily: {
        ar: ["var(--font-amiri)", "serif"],
        arSans: ["var(--font-tajawal)", "sans-serif"],
        en: ["var(--font-cormorant)", "var(--font-amiri)", "serif"],
        enSans: ["var(--font-jost)", "var(--font-tajawal)", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 24px 60px -18px rgba(59, 45, 36, 0.28)",
        champagne: "0 10px 32px -10px rgba(184, 151, 112, 0.55)",
        soft: "0 12px 40px -14px rgba(59, 45, 36, 0.16)",
      },
      backgroundImage: {
        "champagne-gradient":
          "linear-gradient(135deg, #EFE2CB 0%, #D6BC98 48%, #B89770 100%)",
        "espresso-gradient":
          "linear-gradient(160deg, #6A5241 0%, #4E3B2E 55%, #33271F 100%)",
      },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
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
