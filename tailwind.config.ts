import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app//*.{js,ts,jsx,tsx}",
    "./pages//.{js,ts,jsx,tsx}",
    "./components/**/.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // 👈 add DaisyUI here
  ],
};

export default config;