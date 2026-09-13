import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        bloom: {
          cream: "#FFF9FA",
          "cream-light": "#FFFCFD",
          "cream-dark": "#FBF0F3",
          pink: {
            50: "#FFF1F2",
            100: "#FFE4E6",
            200: "#FECDD3",
            300: "#FDA4AF",
            400: "#FB7185",
            500: "#F43F5E",
            600: "#E11D48",
          },
          lavender: {
            50: "#FAF5FF",
            100: "#F3E8FF",
            200: "#E9D5FF",
            300: "#D8B4FE",
            400: "#C084FC",
          },
          matcha: {
            50: "#F0FDF4",
            100: "#DCFCE7",
            200: "#BBF7D0",
            300: "#86EFAC",
            600: "#16A34A",
          },
          butter: {
            50: "#FEFCE8",
            100: "#FEF9C3",
            200: "#FEF08A",
            400: "#FACC15",
          },
          slate: {
            50: "#F9FAFB",
            100: "#F3F4F6",
            300: "#D1D5DB",
            400: "#9CA3AF",
            500: "#6B7280",
            600: "#4B5563",
            700: "#374151",
            800: "#1F2937",
          },
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        kawaii: "0 8px 24px -4px rgba(253, 164, 175, 0.25)",
        "kawaii-sm": "0 4px 12px -2px rgba(253, 164, 175, 0.18)",
        "kawaii-lg": "0 16px 36px -6px rgba(253, 164, 175, 0.3)",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.03)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        breathe: "breathe 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
