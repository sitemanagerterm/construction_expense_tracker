/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Navy & Gold Theme
        primary: {
          DEFAULT: '#0A1121', // Dark Navy from template
          50: '#F0F3F7',
          100: '#DDE3EB',
          200: '#B6C4D4',
          300: '#8FA3BA',
          400: '#6882A0',
          500: '#416186',
          600: '#2E4765',
          700: '#1D3046',
          800: '#0F1A28',
          900: '#0A1121',
        },
        success: '#10B981', // Emerald green
        expense: '#EF4444', // Red
        warning: '#F59E0B',
        brandbg: '#0A1121',
        surface: '#FFFFFF',
        brandtext: {
          DEFAULT: '#334155', // Slate 700 for light bg
          secondary: '#64748B', // Slate 500
          light: '#94A3B8', // Slate 400
          inverse: '#FFFFFF', // White text on dark bg
          'inverse-muted': '#CBD5E1', // Slate 300 on dark bg
        },
        accent: {
          DEFAULT: '#F4B63A', // Golden Yellow
          50: '#FEF8EB',
          100: '#FDF1D7',
          200: '#FBE3AF',
          300: '#F9D487',
          400: '#F6C55F',
          500: '#F4B63A',
          600: '#C3922E',
          700: '#926D23',
          800: '#624917',
          900: '#31240C',
        }
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'floating': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
