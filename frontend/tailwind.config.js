/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        darkbg: '#080B14',
        surface: {
          1: '#0F1420',
          2: '#151B2B',
          3: '#1B2335',
        },
        card: '#0F1420',
        brand: {
          DEFAULT: '#6366F1',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          soft: 'rgba(99, 102, 241, 0.12)',
        },
        primary: {
          DEFAULT: '#6366F1',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        accent: {
          DEFAULT: '#22D3EE',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
        },
        risk: {
          low: '#22C55E',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        },
        txt: {
          DEFAULT: '#F8FAFC',
          primary: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
        },
        appBorder: 'rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
