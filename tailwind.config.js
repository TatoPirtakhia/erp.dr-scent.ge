/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      lg2: '1144px',
      xl: '1440px',
      xxl: '1880px',
    },
    extend: {
      fontFamily: {
        'bpg-arial-caps': ['BPG_Arial_Caps',"BPG_Arial", 'sans-serif'], 
        'arial-caps': ["BPG_Arial", 'sans-serif'], 
        'noto_georgian': ["Noto Sans Georgian", 'sans-serif'], 
      },
      boxShadow: {
        shadow: ' rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
      },
    },
  },
  plugins: [],
}