import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'React SCSS Template',
        short_name: 'React Template',
        description: 'A React + TypeScript + SCSS Modules template with clean architecture.',
        theme_color: '#141a24',
        background_color: '#141a24',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        orientation: 'any',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,wav,mp3}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  // Windows may briefly lock generated assets while they are copied into the project.
  server: { watch: process.platform === 'win32' ? { usePolling: true, interval: 300 } : undefined },
  // Keep heavy vendor code in its own chunk; add one manualChunks entry per large dependency.
  build: {
    rolldownOptions: { output: { manualChunks: (id) => (id.includes('/node_modules/') ? 'vendor' : undefined) } },
  },
});
