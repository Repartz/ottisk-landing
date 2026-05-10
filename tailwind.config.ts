import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Палитра OTTISK — тёплые тона под ORYZO-стиль
        primary: {
          DEFAULT: '#C4A962',
          50: '#F5F0E3',
          100: '#EDE5D0',
          200: '#DDD0A8',
          300: '#CDBB80',
          400: '#C4A962', // основной — золотой
          500: '#B0943A',
          600: '#8A732D',
          700: '#645221',
          800: '#3E3214',
          900: '#181208',
          warm: '#D4A574', // охристый для градиентов и glow
        },
        accent: {
          DEFAULT: '#B87333', // терракота
        },
        secondary: {
          DEFAULT: '#2A2520',
          50: '#E8E5E0',
          100: '#D1CCC4',
          200: '#A39989',
          300: '#756B5E',
          400: '#2A2520', // тёплый графит
          500: '#24201C',
          600: '#1E1A16',
          700: '#181410',
          800: '#120F0C',
          900: '#0C0A08',
        },
        tertiary: {
          DEFAULT: '#1E1A16',
        },
        neutral: {
          DEFAULT: '#141210',
          50: '#E8E8E8',
          100: '#D1D1D1',
          200: '#A3A3A3',
          300: '#757575',
          400: '#474747',
          500: '#141210', // тёплый антрацит (НЕ чистый чёрный)
          600: '#11100E',
          700: '#0E0D0C',
          800: '#0B0A09',
          900: '#080706',
        },
        surface: '#1E1A16',
        t60: '#9A8B7A', // тёплый серо-бежевый для вторичного текста
        // CSS переменные для тем
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      fontSize: {
        display: ['clamp(4rem, 12vw, 10rem)', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'display-sm': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h1: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        h3: ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3' }],
        body: ['clamp(1rem, 1.2vw, 1.125rem)', { lineHeight: '1.7' }],
        small: ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        container: '1440px',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(196, 169, 98, 0.15), 0 0 60px rgba(196, 169, 98, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
