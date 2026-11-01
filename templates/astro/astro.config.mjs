import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import AstroPWA from '@vite-pwa/astro';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '__APP_NAME__';
const base = `/${repo}`;

export default defineConfig({
  site: 'https://tletelieru.github.io',
  base,
  trailingSlash: 'always',
  server: { port: __PORT__ },
  vite: {
    server: {
      strictPort: true,
      allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev'],
    },
  },
  integrations: [
    react(),
    AstroPWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'] },
      manifest: {
        name: '__APP_TITLE__',
        short_name: '__APP_TITLE__',
        description: '__APP_DESCRIPTION__',
        theme_color: '#17181c',
        background_color: '#17181c',
        display: 'standalone',
        start_url: `${base}/`,
        scope: `${base}/`,
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});
