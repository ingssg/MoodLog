import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f9722f",
        "background-light": "#FFF8F3",
        "background-dark": "#23160f",
        "card-bg": "#EBD6C3",
        "card-light": "#FFF3EC",
        "card-dark": "#3a2a21",
        "text-primary-light": "#333333",
        "text-primary-dark": "#e0e0e0",
        "text-secondary-light": "#888888",
        "text-secondary-dark": "#a0a0a0",
        "text-main-light": "#4A4A4A",
        "text-main-dark": "#e0dcd9",
        "text-subtle-light": "#D98B6F",
        "text-subtle-dark": "#b88a79",
        "border-light": "#f5f1f0",
        "border-dark": "#3f2b20",
      },
      fontFamily: {
        display: ["Inter", "Noto Sans KR", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "3rem",
        full: "9999px",
      },
      boxShadow: {
        md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(0 0 0 / 0.03)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1), 0 0 0 1px rgb(0 0 0 / 0.03)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
