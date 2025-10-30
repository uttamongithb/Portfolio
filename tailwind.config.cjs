/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#a855f7',
          dark: '#7c3aed'
        }
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0px,0px) scale(1)' },
          '33%': { transform: 'translate(30px,-20px) scale(1.05)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.98)' }
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        blob: 'blob 18s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite'
      },
      boxShadow: {
        'soft': '0 10px 30px -12px rgba(2,132,199,0.25)'
      }
    },
  },
  plugins: [],
}
