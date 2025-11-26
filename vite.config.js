import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // GitHub Pages: Use GitHub Pages base path for production builds
  const base = '/research-page-new/'
  // Localhost: Use GitHub Pages base path for production builds, root for development
  // const base = command === 'build' ? '/research-page-new/' : '/'
  
  return {
    plugins: [react()],
    base,
    // GitHub Pages: Build to root directory so GitHub Pages can serve from root
    build: {
      outDir: '.',
      emptyOutDir: false, // Don't delete everything, just overwrite index.html and assets
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html'),
      },
    },
    publicDir: 'public',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})
