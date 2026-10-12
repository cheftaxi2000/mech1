/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
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
