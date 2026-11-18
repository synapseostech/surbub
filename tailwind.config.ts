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
        /* ── SUBURB+ core design tokens ───────────────────────────── */
        brand: {
          DEFAULT: "#123D35", // Primary forest green
          primary: "#123D35",
          secondary: "#1D5548", // Secondary forest green
          deep: "#0B2924",
          soft: "#2A7262",
          hover: "#0E322B",
        },
        amber: {
          DEFAULT: "#E9A94A", // Warm amber accent
          accent: "#E9A94A",
          hover: "#D89839",
          soft: "#F3C987",
          wash: "#FBF3E6",
        },
        ivory: {
          DEFAULT: "#F7F5EF", // Page background
          soft: "#FBFAF6",
          deep: "#EFEBE0",
        },
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#26352F", // Main text
          secondary: "#69766F", // Secondary text
          faint: "#8C9891",
        },
        charcoal: {
          DEFAULT: "#26352F",
          main: "#26352F",
          secondary: "#69766F",
          muted: "#8C9891",
        },
        sage: {
          DEFAULT: "#DCE8DF", // Muted sage panels
          light: "#EDF3EE",
          soft: "#F2F7F3",
          dark: "#C3D5C8",
        },
        border: {
          DEFAULT: "#E7E9E3",
          subtle: "#EDEEE9",
          strong: "#D8DCD3",
        },
        status: {
          success: "#27845D",
          successSoft: "#E8F4EE",
          warning: "#D99535",
          warningSoft: "#FBF1E2",
          error: "#C84B45",
          errorSoft: "#FBEDEC",
        },
      },
      fontFamily: {
        sans: ["Manrope", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Manrope", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        display: ["clamp(1.95rem, 8.6vw, 3.5rem)", { lineHeight: "1.02", letterSpacing: "-0.045em", fontWeight: "800" }],
        "display-sm": ["clamp(2rem, 4vw, 2.9rem)", { lineHeight: "1.06", letterSpacing: "-0.04em", fontWeight: "800" }],
        h1: ["clamp(1.75rem, 3.4vw, 2.35rem)", { lineHeight: "1.12", letterSpacing: "-0.035em", fontWeight: "800" }],
        h2: ["clamp(1.45rem, 2.5vw, 1.9rem)", { lineHeight: "1.16", letterSpacing: "-0.03em", fontWeight: "800" }],
        h3: ["1.35rem", { lineHeight: "1.24", letterSpacing: "-0.025em", fontWeight: "750" }],
        card: ["1.0625rem", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "700" }],
        "body-lg": ["1.0625rem", { lineHeight: "1.6" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        label: ["0.8125rem", { lineHeight: "1.45", fontWeight: "600" }],
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.08em", fontWeight: "700" }],
      },
      maxWidth: {
        page: "1240px",
        prose: "62ch",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
        "card-xl": "26px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 61, 53, 0.04), 0 8px 24px -18px rgba(18, 61, 53, 0.12)",
        lift: "0 18px 40px -24px rgba(18, 61, 53, 0.28), 0 4px 12px -8px rgba(18, 61, 53, 0.10)",
        float: "0 28px 60px -30px rgba(11, 41, 36, 0.35), 0 8px 20px -14px rgba(11, 41, 36, 0.18)",
        inset: "inset 0 0 0 1px rgba(18, 61, 53, 0.06)",
      },
      transitionTimingFunction: {
        "out-premium": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.97) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.25s ease-out both",
        "scale-in": "scale-in 0.22s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 1.6s infinite",
        "slide-up": "slide-up 0.3s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
