/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        'text-primary': 'hsl(var(--text-primary))',
        'text-secondary': 'hsl(var(--text-secondary))',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '28px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.2)',
        'modal': '0 12px 32px hsla(0, 0%, 0%, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn var(--duration-base) var(--easing)',
        'slide-up': 'slideUp var(--duration-base) var(--easing)',
      },
      transitionDuration: {
        'fast': '100ms',
        'base': '200ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'custom': 'cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
    },
  },
  plugins: [],
}