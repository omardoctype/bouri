/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blackLuxury: '#07070A',
        cardLuxury: '#111118',
        goldLuxury: '#D4AF37',
        purpleLuxury: '#7C3AED',
        pinkLuxury: '#EC4899',
        offWhite: '#F8F7F3',
        grayLuxury: '#A1A1AA',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 10px 35px rgba(0,0,0,0.45)',
        glow: '0 0 0 1px rgba(212,175,55,0.2), 0 0 35px rgba(124,58,237,0.2)',
      },
      backgroundImage: {
        hero:
          'radial-gradient(circle at 10% 15%, rgba(236,72,153,0.22), transparent 35%), radial-gradient(circle at 85% 25%, rgba(124,58,237,0.2), transparent 42%), radial-gradient(circle at 60% 85%, rgba(212,175,55,0.16), transparent 38%)',
      },
    },
  },
  plugins: [],
};

