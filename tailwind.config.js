/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f0',
          100: '#fce5e1',
          200: '#f8cbc3',
          300: '#f4a89f',
          400: '#ed7d6e',
          500: '#E10514',
          600: '#c70412',
          700: '#a2030e',
          800: '#7e020a',
          900: '#5a0107',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'elevated': '0 24px 70px rgba(15, 23, 42, 0.12)',
        'card': '0 4px 20px rgba(15, 23, 42, 0.08)',
        'sm-card': '0 2px 8px rgba(15, 23, 42, 0.05)',
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
  },
  plugins: [],
}
