import { defineConfig } from '@playwright/test';

// Chromium is pre-installed in the cloud container; fall back to Playwright's own lookup elsewhere.
const executablePath = process.env.CHROMIUM_PATH;

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results/pw', // keep test-results/screens and /frames across runs
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
