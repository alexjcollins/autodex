/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0C',
          elevated: '#14141A',
          card: '#1C1C23',
        },
        ink: {
          DEFAULT: '#F5F5F7',
          muted: '#A1A1AA',
          subtle: '#6B6B75',
        },
        accent: {
          DEFAULT: '#FF3B30',
          amber: '#FFB020',
          emerald: '#30D158',
        },
        hairline: 'rgba(255,255,255,0.08)',
      },
      borderRadius: {
        card: '24px',
        pill: '999px',
      },
      fontFamily: {
        display: ['SF Pro Display', 'System'],
        text: ['SF Pro Text', 'System'],
      },
    },
  },
  plugins: [],
};
