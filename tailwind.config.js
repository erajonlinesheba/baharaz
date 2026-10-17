/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'fixed',
    'absolute',
    'relative',
    'top-[32px]',
    'top-[30px]',
    'right-[20px]',
    'right-[16px]',
    'right-0',
    'left-0',
    'z-[99999]',
    'z-[999999]',
    'z-[99998]',
    'z-50',
    'block',
    'hidden',
    '!block',
    'group-hover:block',
    'group-hover:!block',
    'flex',
    'w-[280px]',
    'w-[260px]',
    'bg-white',
    'bg-[#F85606]',
    'bg-baharaz',
    'shadow-2xl',
    'rounded-lg',
    'border',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        accent: '#FF6A00',
        accent2: '#FFB800',
        baharaz: '#F85606',
      },
      maxWidth: {
        'baharaz': '1200px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}