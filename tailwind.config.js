module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lotus: {
          ivory: '#faf6f2',
          gold: '#f4c95d',
          goldDark: '#e8b42a',
          pink: '#eeb8c4',
          purple: '#b48dd3',
          saffron: '#ffd166',
          indigo: '#4a5568'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Crimson Text', 'serif']
      },
      animation: {
        'bloom': 'bloom 2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        bloom: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'pulse-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(255, 209, 102, 0.3))' },
          '50%': { filter: 'drop-shadow(0 0 12px rgba(255, 209, 102, 0.6))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}

