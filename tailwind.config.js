/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Master Prompt Design Tokens
        primary: {
          DEFAULT: '#153E75',
          50: '#E6EBF2',
          100: '#CDD7E6',
          200: '#9AB0CC',
          300: '#6889B3',
          400: '#356199',
          500: '#153E75',
          600: '#11325E',
          700: '#0C2546',
          800: '#08192F',
          900: '#040C17',
        },
        success: '#16A34A',
        expense: '#DC2626',
        warning: '#F59E0B',
        brandbg: '#F8FAFC',
        surface: '#FFFFFF',
        brandtext: {
          DEFAULT: '#111827',
          secondary: '#6B7280',
        },
        // Accent/Orange kept for fallback or specific highlights, but mapped to warning/success generally
        accent: {
          DEFAULT: '#F97316',
          50: '#FFF1E8',
          100: '#FFDDC2',
          200: '#FFB885',
          300: '#FF9247',
          400: '#FF6D0A',
          500: '#F97316',
          600: '#CC5800',
          700: '#994200',
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,.08)',
        'modal': '0 8px 24px rgba(0,0,0,.12)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
      },
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
