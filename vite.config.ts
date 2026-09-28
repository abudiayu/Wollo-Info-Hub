import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Prevent any PostCSS pass from dropping -webkit-backdrop-filter.
    // We do NOT run autoprefixer here because we write both the prefixed
    // and un-prefixed properties explicitly in the CSS.
    postcss: {},
  },
});
