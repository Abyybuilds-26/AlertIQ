/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          blue: "#2563EB",
          indigo: "#4F46E5",
          slate: "#0F172A",
          muted: "#475569",
          border: "#E2E8F0",
          card: "#FFFFFF",
          bg: "#F8FAFC"
        },
        risk: {
          low: {
            bg: "#ECFDF5",
            border: "#A7F3D0",
            text: "#065F46",
            badge: "#10B981"
          },
          medium: {
            bg: "#FFFBEB",
            border: "#FDE68A",
            text: "#92400E",
            badge: "#F59E0B"
          },
          high: {
            bg: "#FEF2F2",
            border: "#FECACA",
            text: "#991B1B",
            badge: "#EF4444"
          }
        }
      }
    },
  },
  plugins: [],
}
