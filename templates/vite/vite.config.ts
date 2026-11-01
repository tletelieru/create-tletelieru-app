import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '__APP_NAME__';

export default defineConfig({
  base: `/${repo}/`,
  server: {
    port: __PORT__,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'],
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] },
      manifest: {
        name: '__APP_TITLE__',
        short_name: '__APP_TITLE__',
        description: '__APP_DESCRIPTION__',
        theme_color: '#17181c',
        background_color: '#17181c',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
