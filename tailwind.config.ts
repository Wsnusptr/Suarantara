import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors — Suarantara
        navy: {
          DEFAULT: '#1B2D5E',
          50: '#eef1f9',
          100: '#d5dcf0',
          200: '#aab9e0',
          300: '#7f96d1',
          400: '#5473c1',
          500: '#3456b1',
          600: '#2a4494',
          700: '#1B2D5E',
          800: '#152347',
          900: '#0e1930',
        },
        gold: {
          DEFAULT: '#D4A200',
          50: '#fdf8e6',
          100: '#faefbf',
          200: '#f5df80',
          300: '#f0cf40',
          400: '#e8bd10',
          500: '#D4A200',
          600: '#a87f00',
          700: '#7c5e00',
          800: '#503c00',
          900: '#281e00',
        },
        crimson: {
          DEFAULT: '#C0392B',
          50: '#fdf0ee',
          100: '#f9d6d2',
          200: '#f2aca4',
          300: '#eb8377',
          400: '#e45949',
          500: '#C0392B',
          600: '#9a2e22',
          700: '#73221a',
          800: '#4d1711',
          900: '#260b09',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [typography],
}

export default config
