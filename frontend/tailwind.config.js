/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f7f9fc",
          100: "#eef2f7",
          200: "#dde5ef",
          300: "#c7d4e3",
          400: "#9fb3cc",
          500: "#758eaf",
          600: "#5a728f",
          700: "#465870",
          800: "#2f3c4f",
          900: "#1c2532"
        }
      },
      boxShadow: {
        panel: "0 16px 40px rgba(15, 23, 42, 0.08)",
      }
    },
  },
  plugins: [],
};
