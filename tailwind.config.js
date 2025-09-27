/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { sm: "640px", md: "768px", lg: "1024px", xl: "1200px" },
    },
    extend: {
      colors: {
        // Palette Sawaka (bruns + beiges)
        sawaka: {
          50:  "#F9F3EC",
          100: "#F4E8D9",
          200: "#EEDCC3",
          300: "#E3CBA6",
          400: "#C9A57A",
          500: "#A6774C",   // brun “marque”
          600: "#8B5F38",
          700: "#734C2C",
          800: "#5A3B22",
          900: "#3A2414",   // texte foncé / footer
        },
        cream: {
          50:  "#FFFCF8",
          100: "#FEF7F0",
          200: "#FBF0E3",   // bande “Comment ça marche”
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        display: ["Playfair Display", "ui-serif", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 8px 24px rgba(0,0,0,.06)",
        card: "0 1px 2px rgba(16, 24, 40, .06), 0 1px 3px rgba(16, 24, 40, .10)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme("colors.sawaka.900"),
            a: { color: theme("colors.sawaka.700") },
            h1: { fontFamily: theme("fontFamily.display").join(",") },
            h2: { fontFamily: theme("fontFamily.display").join(",") },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
