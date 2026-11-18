import type { Config } from "tailwindcss";

// Nike brand palette. Flat and minimal: no shadows, no rounded corners.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        nike: {
          black: "#111111",
          white: "#FFFFFF",
          "grey-100": "#F5F5F5", // image placeholder
          "grey-200": "#E5E5E5", // dividers
          "grey-300": "#CCCCCC", // sold-out outline
          "grey-400": "#BDBDBD", // sold-out text
          "grey-600": "#757575", // in-stock outline, secondary text
          volt: "#CEFF00",
        },
      },
      fontFamily: {
        // Helvetica Neue is not licensable as a web font, so the stack is system-only:
        // nothing is downloaded, so there is no font swap and no layout shift.
        sans: ['"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        display: ['"Helvetica Neue Condensed"', '"Arial Narrow"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      fontSize: {
        "2xs": ["7px", { lineHeight: "8px" }],
      },
    },
  },
  plugins: [],
};

export default config;
