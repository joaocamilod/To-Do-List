/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        app: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          card: "var(--color-card)",
          border: "var(--color-border)",
          "text-primary": "var(--color-text-primary)",
          "text-secondary": "var(--color-text-secondary)",
          "text-muted": "var(--color-text-muted)",
        },
      },
      boxShadow: {
        "card-hover":
          "0 4px 16px 0 rgba(37, 99, 235, 0.10), 0 1px 4px 0 rgba(0,0,0,0.08)",
        modal:
          "0 24px 64px -8px rgba(0,0,0,0.35), 0 8px 24px -4px rgba(0,0,0,0.20)",
        toast: "0 8px 24px rgba(0,0,0,0.18)",
        fab: "0 6px 20px rgba(37, 99, 235, 0.40)",
        sidebar: "4px 0 24px rgba(0,0,0,0.12)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.18s ease-in-out",
        "slide-in": "slideIn 0.25s cubic-bezier(.2,.8,.2,1)",
        "slide-up": "slideUp 0.22s cubic-bezier(.2,.8,.2,1)",
        "scale-in": "scaleIn 0.20s cubic-bezier(.2,.8,.2,1)",
        "check-pop": "checkPop 0.28s cubic-bezier(.2,.8,.2,1)",
        shake: "shake 0.30s ease",
        "toast-in": "toastIn 0.22s cubic-bezier(.2,.8,.2,1)",
        "toast-out": "toastOut 0.18s ease-in forwards",
        "fab-bounce": "fabBounce 0.30s cubic-bezier(.2,.8,.2,1)",
        spin: "spin 0.75s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.97)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        checkPop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-4px)" },
          "75%": { transform: "translateX(4px)" },
        },
        toastIn: {
          "0%": { transform: "translateX(120%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        toastOut: {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "100%": { transform: "translateX(120%)", opacity: "0" },
        },
        fabBounce: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(.2,.8,.2,1)",
      },
    },
  },
  plugins: [],
};
