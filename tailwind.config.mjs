/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,mjs,ts,tsx,vue,svelte,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Marca SuiteHub — paleta corporativa
        ink: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        navy: {
          50:  '#EEF3FA',
          100: '#D7E2F0',
          200: '#A8BEDA',
          300: '#7A9BC4',
          400: '#4D78AE',
          500: '#2A5689',
          600: '#1F4570',
          700: '#163758',
          800: '#0E2640',
          900: '#0A2540',  // navy primario PROOQ
          950: '#06192E',
        },
        brand: {
          50:  '#EEF9FF',
          100: '#D9F1FF',
          200: '#BCE6FF',
          300: '#8ED6FF',
          400: '#59BEFF',  // brand acento (light)
          500: '#2EA1FF',
          600: '#1582F5',  // brand primario PROOQ
          700: '#1269E0',
          800: '#1556B6',
          900: '#174A90',
          950: '#122D59',
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'radial-brand': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(21,130,245,0.25), transparent)',
      },
      boxShadow: {
        'glow':       '0 0 40px -8px rgba(21,130,245,0.4)',
        'glow-sm':    '0 0 20px -4px rgba(21,130,245,0.3)',
        'inner-line': 'inset 0 1px 0 0 rgba(255,255,255,0.05)',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '0% 50%' },
          '50%':  { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
};
