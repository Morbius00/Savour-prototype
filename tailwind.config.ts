import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#FF6B00",
          "orange-light": "#FF8C33",
          "orange-dark": "#CC5500",
          "orange-glow": "#FF6B0033",
          black: "#0A0A0A",
          "black-card": "#111111",
          "black-border": "#1E1E1E",
          "black-hover": "#161616",
          gray: "#888888",
          "gray-light": "#BBBBBB",
          "gray-dark": "#444444",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "pulse-orange": "pulseOrange 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-dot": "bounceDot 1.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulseOrange: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,107,0,0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255,107,0,0)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)", opacity: "0.5" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
