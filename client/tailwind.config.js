/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--theme-bg)',
          'bg-secondary': 'var(--theme-bg-secondary)',
          surface: 'var(--theme-surface)',
          text: 'var(--theme-text)',
          'text-secondary': 'var(--theme-text-secondary)',
          accent: 'var(--theme-accent)',
          'accent-hover': 'var(--theme-accent-hover)',
          border: 'var(--theme-border)',
        },
      },
      borderRadius: {
        theme: 'var(--theme-card-radius)',
      },
      fontFamily: {
        'theme-heading': 'var(--theme-font)',
        'theme-body': 'var(--theme-font-body)',
      },
    },
  },
  plugins: [],
}
