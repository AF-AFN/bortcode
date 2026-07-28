import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  base: '/bartcode-run-event-block-/',
  server: {
    port: 9000
  }
});