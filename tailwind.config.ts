import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // Editorial Warm palette
        border:     '#E2DDD3',
        input:      '#E2DDD3',
        ring:       '#6D28D9',
        background: '#FFFEF9',
        foreground: '#1C1917',

        primary:     { DEFAULT: '#6D28D9', foreground: '#FFFFFF' },
        secondary:   { DEFAULT: '#F0EBE0', foreground: '#78716C' },
        destructive: { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
        muted:       { DEFAULT: '#F0EBE0', foreground: '#78716C' },
        accent:      { DEFAULT: '#EDE9FE', foreground: '#4C1D95' },
        popover:     { DEFAULT: '#FFFEF9', foreground: '#1C1917' },
        card:        { DEFAULT: '#F0EBE0', foreground: '#1C1917' },

        // Brand tokens
        warm: {
          50:  '#FFFEF9',
          100: '#F7F3EA',
          200: '#F0EBE0',
          300: '#E8E2D5',
          400: '#DDD7C8',
          500: '#CCC8BD',
          600: '#A8A29E',
          700: '#78716C',
          800: '#57534E',
          900: '#1C1917',
        },

        // Accent violet (brand)
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },

        // Segment accent colours
        seg: {
          retail:     '#6D28D9',
          influencer: '#BE185D',
          horeca:     '#B45309',
          info:       '#1D4ED8',
        },
      },

      borderRadius: {
        sm:   '0.25rem',
        md:   '0.375rem',
        DEFAULT: '0.625rem',
        lg:   '0.625rem',
        xl:   '0.875rem',
        '2xl': '1.125rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },

      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
        tight:    '-0.02em',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.3s ease both',
        'scale-in':       'scale-in 0.2s ease both',
        'pulse-slow':     'pulse 3s ease-in-out infinite',
      },

      boxShadow: {
        'card':   '0 1px 3px rgba(28,25,23,0.07), 0 1px 2px rgba(28,25,23,0.05)',
        'card-md':'0 4px 12px rgba(28,25,23,0.08), 0 1px 3px rgba(28,25,23,0.05)',
        'card-lg':'0 12px 32px rgba(28,25,23,0.10), 0 2px 6px rgba(28,25,23,0.06)',
        'inner':  'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
    },
  },
  plugins: [],
}

export default config
