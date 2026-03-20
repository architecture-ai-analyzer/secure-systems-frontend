/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fiap-blue': '#003366',
        'fiap-light-blue': '#0066cc',
        'fiap-gray': '#f5f5f5',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
      },
    },
  },
  plugins: [],
}