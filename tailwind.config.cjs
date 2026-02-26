/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
                display: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                // Scroll hero palette
                terracotta: '#E07A5F',
                sage: '#81A594',
                charcoal: '#2D2D2D',
                ivory: '#F8F5F0',
                offWhite: '#FAF7F2',
                // Legacy warm earthy
                terrain: '#1A0F06',
                amber: '#C5903A',
                sandTan: '#D9C5A0',
                dustBrown: '#7C4A1E',
                goldenHr: '#E8A830',
                // Base
                background: '#F8F5F0',
                accent: '#E07A5F',
                'accent-dark': '#C05A3F',
                primary: '#2D2D2D',
                secondary: '#81A594',
            },
            animation: {
                'fade-up': 'fadeUp 0.9s ease-out forwards',
                'fade-in': 'fadeIn 0.7s ease-out forwards',
                'float-slow': 'floatSlow 7s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(22px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                floatSlow: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
}
