import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        card: "#151515",
        muted: "#B8B8B8",
        border: "#2A2A2A",
        accent: "#FF5A1F",
        gold: "#D6A84F",
        navy: "#0B1F3A",
      },
      boxShadow: {
        glow: "0 0 45px rgba(255, 90, 31, 0.35)",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "Onest", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
