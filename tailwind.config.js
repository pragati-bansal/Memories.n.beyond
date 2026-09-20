/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFF8F4',
          deep: '#FBEFE8',
        },
        blush: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          DEFAULT: '#F6DEDA',
          deep: '#EFC6C0',
        },
        rose: {
          light: '#FB7185',
          DEFAULT: '#C98D89',
          deep: '#A9645F',
        },
        burgundy: {
          light: '#BD163A',
          DEFAULT: '#A10B2B',
          deep: '#780820',
        },
        ink: {
          DEFAULT: '#3A2226',
          soft: '#6E4D50',
        },
        paper: '#FFFDFB',
        gold: '#B4884E',
        craftLine: 'rgba(161, 11, 43, 0.14)',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Manrope', 'sans-serif'],
        script: ["'Very Berry'", "'Alex Brush'", "'Great Vibes'", 'cursive'],
        brand: ["'Very Berry'", "'Alex Brush'", 'cursive'],
        handwriting: ["'Caveat'", "'Dancing Script'", 'cursive'],
      },
      boxShadow: {
        'craft-sm': '0 4px 14px -4px rgba(161, 11, 43, 0.15)',
        'craft-soft': '0 10px 30px -18px rgba(161, 11, 43, 0.28)',
        'craft-lg': '0 20px 50px -25px rgba(161, 11, 43, 0.35)',
        'craft-modal': '0 40px 80px -30px rgba(161, 11, 43, 0.50)',
        'pink-glow': '0 10px 25px -5px rgba(251, 113, 133, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
