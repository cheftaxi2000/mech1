import { defineConfig } from '@playwright/test';

// Chromium is pre-installed in the cloud container; fall back to Playwright's own lookup elsewhere.
const executablePath = process.env.CHROMIUM_PATH;
// PW_PORT lets several checkouts (git worktrees) run their e2e suites side by side.
const port = Number(process.env.PW_PORT ?? 4173);

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results/pw', // keep test-results/screens and /frames across runs
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${port}`,
    launchOptions: executablePath ? { executablePath } : {},
  },
  webServer: {
    command: `npm run build && npx vite preview --port ${port} --strictPort`,
    port,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
