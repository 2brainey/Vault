// 2brainey/vault/Vault-c56edab4e9ba95c3fc4abb92c22f46eb83c3b7f6/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { // <-- ADD THIS BLOCK
        'vault-dark': '#2b3446',
        'vault-slate': '#404e6d',
        'vault-border': '#404e6d',
        'vault-amber': '#e1b542',
        'vault-bronze': '#78643e',
        'vault-success': '#4ade80',
      },
    },
  },
  plugins: [],
}