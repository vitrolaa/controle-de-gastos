import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/controle-de-gastos/', // Path do repositório no GitHub Pages
  plugins: [
    tailwindcss(),
    react()
  ],
})
