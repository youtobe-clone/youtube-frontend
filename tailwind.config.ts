import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto Condensed", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "linear-playlist":
          "linear-gradient(to bottom, rgb(112 100 98 / 80%) 0%, rgb(31 29 29 / 30%) 33%, rgb(87 82 81 / 80%) 100%)",
      },
      screens: {
        sm: "290px",
      },
    },
    screens: {
      sm: "640px", // Small devices (phones, 640px and up)
      md: "768px", // Medium devices (tablets, 768px and up)
      lg: "1024px", // Large devices (desktops, 1024px and up)
      xl: "1280px", // Extra large devices (large desktops, 1280px and up)
      "2xl": "1536px", // 2XL devices (larger desktops, 1536px and up)
      "3xl": "1920px", // 2XL devices (larger desktops, 1536px and up)
      "4xl": "2560px", // 2XL devices (larger desktops, 1536px and up)
    },
  },
  plugins: [],
};
export default config;
