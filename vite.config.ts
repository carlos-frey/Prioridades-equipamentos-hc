import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  return {
    // Altere este base se o seu repositório no GitHub não se chamar "dados-saude"
    // Ex: repositório github.com/seu-user/meu-dashboard => base: '/meu-dashboard/'
    base: mode === 'production' ? '/dados-saude/' : '/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
  }
})
