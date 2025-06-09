/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        accent: 'var(--accent)',
        'accent-gradient-light': 'var(--accent-gradient-light)',
        'accent-gradient-dark': 'var(--accent-gradient-dark)',
        'text-color': 'var(--text-color)',
        dark: 'var(--dark)',
        gray: 'var(--gray)',
        'footer-bg': 'var(--footer-bg)',
      },
      backgroundColor: {
        'header-bg': 'var(--header-bg)',
        'header-bg-scroll': 'var(--header-bg-scroll)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, var(--accent-gradient-light), var(--accent-gradient-dark))',
        'hero-overlay': 'var(--hero-overlay)',
      },
      boxShadow: {
        'card': 'var(--card-shadow)',
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      height: {
        'hero': 'calc(100vh - 88px)',
      },
    },
  },
  plugins: [],
};