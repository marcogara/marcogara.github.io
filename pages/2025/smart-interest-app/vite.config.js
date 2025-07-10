import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // This makes paths relative instead of absolute
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Remove hash from filenames for easier manual deployment
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})