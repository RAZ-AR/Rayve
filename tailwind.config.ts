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
        border:     '#E4E6EA',
        input:      '#E4E6EA',
        ring:       '#009ed3',
        background: '#FFFFFF',
        foreground: '#111827',

        primary:     { DEFAULT: '#009ed3', foreground: '#FFFFFF' },
        secondary:   { DEFAULT: '#F0F2F5', foreground: '#6b7280' },
        destructive: { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
        muted:       { DEFAULT: '#F0F2F5', foreground: '#6b7280' },
        accent:      { DEFAULT: '#e0f5fb', foreground: '#005a7a' },
        popover:     { DEFAULT: '#FFFFFF', foreground: '#111827' },
        card:        { DEFAULT: '#FFFFFF', foreground: '#111827' },

        // Brand blue
        blue: {
          50:  '#e0f5fb',
          100: '#b3e5f5',
          200: '#80d4ef',
          300: '#4dc2e8',
          400: '#26b5e3',
          500: '#009ed3',
          600: '#0087b5',
          700: '#006f96',
          800: '#005a7a',
          900: '#003a5e',
        },

        // Segment accent colours
        seg: {
          retail:     '#009ed3',
          influencer: '#BE185D',
          horeca:     '#B45309',
          info:       '#1D4ED8',
        },
      },

      borderRadius: {
        sm:   '0.375rem',
        md:   '0.5rem',
        DEFAULT: '0.75rem',
        lg:   '0.75rem',
        xl:   '1rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        full: '9999px',
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'Nunito', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
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
        'card':   '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md':'0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'card-lg':'0 12px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
        'inner':  'inset 0 1px 0 rgba(255,255,255,0.7)',
      },
    },
  },
  plugins: [],
}

export default config
