/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Flat keys — avoids Tailwind's 3-level nested resolution bug with hyphenated keys
        'jiva-green':       '#1a6b3c',
        'jiva-green-light': '#e8f5ee',
        'jiva-green-mid':   '#2d8653',
        'jiva-orange':      '#f59e0b',
        'jiva-orange-dark': '#d97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  // Safelist dynamic avatar colors generated at runtime in getAvatarColor()
  safelist: [
    'bg-blue-500',
    'bg-purple-500',
    'bg-green-600',
    'bg-teal-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-orange-500',
    'bg-cyan-600',
  ],
  plugins: [],
};
