/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        electricBlue: '#00CFFF',
        sunsetOrange: '#FF7A00',
        neonYellow: '#FFE500',
        brightRed: '#FF375F',
        hotMagenta: '#FF00FF',
        deepViolet: '#8A2BE2',
        ink: '#0F172A',
        glass: 'rgba(255,255,255,0.8)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 15px 35px rgba(15, 23, 42, 0.12)',
        'glow-soft': '0 10px 25px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        glass: '16px',
        pill: '999px',
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeSlide: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        gradientShift: 'gradientShift 18s ease infinite alternate',
        float: 'float 8s ease-in-out infinite',
        fadeSlide: 'fadeSlide 400ms ease forwards',
      },
      backgroundImage: {
        brand: 'linear-gradient(90deg, var(--brand-stops))',
      },
      backdropBlur: {
        glass: '10px',
        nav: '26px',
      },
      saturate: {
        nav: '1.65',
      },
    },
  },
  plugins: [],
}
