/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  // Build date on the home page, so a stale cached copy is easy to recognise.
  define: { __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)) },
  build: {
    rolldownOptions: {
      output: {
        // three.js and the r3f stack in their own chunk: lessons without a 3D figure must not download it.
        advancedChunks: { includeDependenciesRecursively: false, groups: [{ name: 'three', test: /node_modules[\\/](three|three-stdlib|@react-three|troika-|meshline|camera-controls|maath|stats)/ }] },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'node',
  },
});
