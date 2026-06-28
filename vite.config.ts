import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/react-router')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/@tiptap')) {
            return 'editor-vendor'
          }
          if (id.includes('node_modules/@heroicons') || id.includes('node_modules/lucide-react')) {
            return 'ui-vendor'
          }
          if (
            id.includes('node_modules/@supabase') ||
            id.includes('node_modules/@tanstack') ||
            id.includes('node_modules/react-hook-form') ||
            id.includes('node_modules/zod') ||
            id.includes('node_modules/@hookform')
          ) {
            return 'data-vendor'
          }
        },
      },
    },
    // Improve chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
})
