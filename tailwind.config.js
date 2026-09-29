module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#0F1B2D", chalk: "#F2F4F7", corner: { red: "#C8202B", blue: "#1D56B8" }, mat: "#DDE2EA" },
      fontFamily: { display: ["var(--font-display)"], body: ["var(--font-body)"] },
    },
  },
  plugins: [],
};
