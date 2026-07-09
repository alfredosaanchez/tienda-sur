/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#ECEDF0",
        surface: "#FFFFFF",
        ink: "#1C1E21",
        "ink-soft": "#5B5F66",
        accent: "#9C7A4B",
        "accent-dark": "#7A5E39",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        neu: "10px 10px 24px rgba(163,163,163,0.35), -10px -10px 24px rgba(255,255,255,0.85)",
        "neu-sm": "6px 6px 14px rgba(163,163,163,0.3), -6px -6px 14px rgba(255,255,255,0.8)",
        "neu-inset": "inset 5px 5px 12px rgba(163,163,163,0.35), inset -5px -5px 12px rgba(255,255,255,0.85)",
        "neu-pressed": "inset 3px 3px 8px rgba(163,163,163,0.4), inset -3px -3px 8px rgba(255,255,255,0.8)",
      },
      borderRadius: {
        xl2: "28px",
      },
    },
  },
  plugins: [],
};
