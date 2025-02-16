/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#010101", // Custom color
        secondary: {
          100: "#EFF0F6",
          200: "#A0D195",
        },
        bg : "#f9f9f9",
      },
      borderRadius: {
        sm: "8px", // Custom border-radius
        md: "12px", // Custom border-radius
        lg: "20px", // Custom border-radius
        max: "100px", // Custom border-radius
      },
      fontFamily: {
        reospec: ['reospec', 'Poppins']
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],  // Extra small
        'sm': ['14px', { lineHeight: '20px' }], // Small
        'base': ['18px', { lineHeight: '28px' }], // Base (default)
        'lg': ['20px', { lineHeight: '28px' }], // Large
        'xl': ['24px', { lineHeight: '32px' }], // Extra large
        '2xl': ['28px', { lineHeight: '36px' }], // 2x large
      },
    },
  },
  plugins: [],
};
