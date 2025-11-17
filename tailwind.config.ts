import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // === 基础背景色系统 ===
        background: "hsl(var(--background))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          hover: "hsl(var(--surface-hover))",
          active: "hsl(var(--surface-active))",
        },
        header: {
          background: "hsl(var(--header-background))",
        },
        footer: {
          background: "hsl(var(--footer-background))",
          "text-primary": "hsl(var(--footer-text-primary))",
          "text-muted": "hsl(var(--footer-text-muted))",
        },

        // === 文本颜色系统 ===
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
          inverse: "hsl(var(--text-inverse))",
          link: "hsl(var(--text-link))",
          "link-hover": "hsl(var(--text-link-hover))",
        },

        // === 边框颜色系统 ===
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "hsl(var(--border-subtle))",
          hover: "hsl(var(--border-hover))",
          focus: "hsl(var(--border-focus))",
        },

        // === 按钮颜色系统 ===
        btn: {
          primary: {
            DEFAULT: "hsl(var(--btn-primary))",
            hover: "hsl(var(--btn-primary-hover))",
            text: "hsl(var(--btn-primary-text))",
          },
          secondary: {
            DEFAULT: "hsl(var(--btn-secondary))",
            hover: "hsl(var(--btn-secondary-hover))",
            text: "hsl(var(--btn-secondary-text))",
          },
          danger: {
            DEFAULT: "hsl(var(--btn-danger))",
            hover: "hsl(var(--btn-danger-hover))",
            text: "hsl(var(--btn-danger-text))",
          },
          disabled: {
            DEFAULT: "hsl(var(--btn-disabled))",
            text: "hsl(var(--btn-disabled-text))",
          },
        },

        // === 状态颜色系统 ===
        status: {
          success: {
            DEFAULT: "hsl(var(--status-success))",
            bg: "hsl(var(--status-success-bg))",
            text: "hsl(var(--status-success-text))",
          },
          warning: {
            DEFAULT: "hsl(var(--status-warning))",
            bg: "hsl(var(--status-warning-bg))",
            text: "hsl(var(--status-warning-text))",
          },
          error: {
            DEFAULT: "hsl(var(--status-error))",
            bg: "hsl(var(--status-error-bg))",
            text: "hsl(var(--status-error-text))",
          },
          info: {
            DEFAULT: "hsl(var(--status-info))",
            bg: "hsl(var(--status-info-bg))",
            text: "hsl(var(--status-info-text))",
          },
        },

        // === 品牌颜色系统 ===
        brand: {
          primary: "hsl(var(--brand-primary))",
          secondary: "hsl(var(--brand-secondary))",
        },
        accent: "hsl(var(--accent))",

        // === 兼容性别名 ===
        foreground: "hsl(var(--text-primary))",
        primary: {
          DEFAULT: "hsl(var(--btn-primary))",
          foreground: "hsl(var(--btn-primary-text))",
        },
        secondary: {
          DEFAULT: "hsl(var(--btn-secondary))",
          foreground: "hsl(var(--btn-secondary-text))",
        },
        destructive: {
          DEFAULT: "hsl(var(--btn-danger))",
          foreground: "hsl(var(--btn-danger-text))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text-muted))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text-primary))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text-primary))",
        },
        input: "hsl(var(--border))",
        ring: "hsl(var(--border-focus))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
