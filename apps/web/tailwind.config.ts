import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        line: "var(--color-line)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        accent: "var(--color-accent)"
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 0 0 1px rgba(255,255,255,0.03), 0 20px 50px rgba(0,0,0,0.35)"
      }
    }
  },
  plugins: []
};

export default config;