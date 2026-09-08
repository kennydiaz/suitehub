import { readFileSync } from 'node:fs';
import typography from '@tailwindcss/typography';

// Las rampas corporativas salen del brand kit vendorizado, no de una copia a
// mano: `npm run sync-brand` las actualiza y `npm run check-brand` las vigila.
// `ink` se queda aquí porque el kit solo define su tono base (#1E293B = ink.800).
const { ramps, typography: tipo } = JSON.parse(
  readFileSync(new URL('./src/data/brand.json', import.meta.url), 'utf8'),
);

/** "'Sora', 'Inter', system-ui" -> ['Sora', 'Inter', 'system-ui'] */
const pila = (stack) => stack.split(',').map((f) => f.trim().replace(/^'|'$/g, ''));

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,mjs,ts,tsx,vue,svelte,md,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: pila(tipo.sans.stack),
        display: pila(tipo.display.stack),
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
        navy:  ramps['prooq.navy'],   // 900 = #0A2540, navy primario PROOQ
        brand: ramps['prooq.brand'],  // 600 = #1582F5, brand primario PROOQ
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
  plugins: [typography],
};
