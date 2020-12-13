const { colors } = require("tailwindcss/defaultTheme");

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    fontFamily: {
      body: ["Manrope", "Tahoma", "Arial", "Helvetica", "sans-serif"],
    },
    fontWeight: {
      normal: 600,
      bold: 800,
    },
    extend: {
      colors: {
        dark: "#6A5D7B",
        medium: "#A9A7CA",
        light: "#EFEBF2",
      },
    },
    borderRadius: {
      sm: "0.125rem",
      default: "0.25rem",
      md: "0.375rem",
      lg: "12px",
      full: "9999px",
    },
  },
  variants: {},
  plugins: [],
};
