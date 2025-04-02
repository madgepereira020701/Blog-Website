import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ Correctly structured Vite config
export default defineConfig({
  plugins: [react()],
  esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  define: {
      'process.env': {}
  }
});
