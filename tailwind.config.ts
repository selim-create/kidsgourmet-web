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
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-quicksand)', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#FF8A65',   // Ana Turuncu
          secondary: '#AED581', // Pastel Yeşil
          blue: '#81D4FA',      // Bebek Mavisi
          yellow: '#FFF176',    // Pastel Sarı
          dark: '#455A64',      // Metin Rengi
          light: '#FFFBE6',     // Krem Arkaplan
          purple: '#B39DDB'     // Mor (Topluluk/Rehber)
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Blog detay sayfası için gerekli tipografi eklentisi
  ],
};
export default config;