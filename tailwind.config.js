module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      opacity: {
        5: "0.05",
        7: "0.07",
        8: "0.08",
        9: "0.09",
        11: "0.11",
        12: "0.12",
        14: "0.14",
        15: "0.15",
        16: "0.16",
      },
      colors: {
        base: {
          dark: "#121212",
          DEFAULT: "#121212",
          light: "#ffffff",
        },
      },
    },
  },
  plugins: [],
  darkmode: "media",
}
