import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: false,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "ghibli-dark": "#1F1F1F",        // Teks utama
        "ghibli-green": "#5E8A57",       // Aksen utama (daun)
        "ghibli-soft": "#F0F4EC",        // Background lembut
        "ghibli-pink": "#F7D6E0",        // Badge harga
        "ghibli-muted": "#777C6D",       // Teks sekunder
        "ghibli-card": "rgba(255,255,255,0.8)", // Card semi-transparan
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem", // tambahan untuk bentuk super lembut ala Ghibli
      },
      boxShadow: {
        "ghibli": "0 8px 20px rgba(94, 138, 87, 0.2)", // shadow lembut
      },
      backgroundImage: {
        "ghibli-clouds": "url('/ghibli-clouds.svg')",
        "ghibli-texture": "url('/ghibli-texture.png')",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
