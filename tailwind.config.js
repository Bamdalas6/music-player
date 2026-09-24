/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        player: {
          bg: "#161719",
          card: "#1E1F22",
          wheel: "#25262A",
          button: "#222327",
          buttonHover: "#2C2D32",
          border: "#2C2D31",
          copper: "#D48B5C",
          copperDark: "#A2623B",
          subtext: "#8E8E93"
        }
      },
      boxShadow: {
        'wheel': '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.06)',
        'wheel-inner': 'inset 0 4px 8px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(255, 255, 255, 0.05)',
        'phone': '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 12px #2A1F18, 0 0 0 14px #C88656',
      }
    },
  },
  plugins: [],
};
