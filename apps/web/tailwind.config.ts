import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          deep: "#0A0F1C",
          gold: "#C9A227",
          teal: "#14B8A6",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#0F172A",
        },
        accent: {
          gold: "#D4AF37",
          teal: "#14B8A6",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 4s linear infinite",
        marquee: "marquee 35s linear infinite",
        "mesh-drift": "meshDrift 18s ease-in-out infinite",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        float: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-14px)" } },
        shimmer: { "0%": { backgroundPosition: "0% center" }, "100%": { backgroundPosition: "200% center" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        meshDrift: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 40px rgba(20, 184, 166, 0.25)" },
          "50%": { boxShadow: "0 0 80px rgba(212, 175, 55, 0.35)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
