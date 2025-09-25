/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        header: {
          background: "hsl(var(--header-background))",
        },
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "hsl(var(--border-subtle))",
          hover: "hsl(var(--border-hover))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
        },
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
          primary: "hsl(var(--btn-primary))",
          "primary-hover": "hsl(var(--btn-primary-hover))",
          secondary: "hsl(var(--btn-secondary))",
          "secondary-hover": "hsl(var(--btn-secondary-hover))",
        },
        footer: {
          background: "hsl(var(--footer-background))",
          "text-primary": "hsl(var(--footer-text-primary))",
          "text-muted": "hsl(var(--footer-text-muted))",
        },
      },
    },
  },
  plugins: [],
};
