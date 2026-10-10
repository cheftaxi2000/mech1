import { test } from '@playwright/test';

// Review aid, not a regression test: captures frames of the running animation for a human (or a reviewer agent) to look at.
// Run with: REVIEW_FRAMES=1 npx playwright test e2e/animation-frames.spec.ts
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

const PLAN: { step: number; at: number[] }[] = [
  { step: 0, at: [0, 0.3, 0.5, 0.7, 0.85] },
  { step: 1, at: [0.2, 0.45, 0.7] },
  { step: 2, at: [0.1, 0.35, 0.5, 0.62, 0.75, 0.88] },
  { step: 3, at: [0.15, 0.35, 0.55, 0.8] },
  { step: 4, at: [0.1, 0.25, 0.5, 0.7, 0.95] },
];
const MS = [4600, 3800, 9000, 5200, 8000];

for (const lang of ['de', 'en'] as const) {
  test(`[${lang}] capture animation frames`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.addInitScript((l) => localStorage.setItem('mech1.lang', l), lang);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/#koordinaten');
    const player = page.locator('.stepper').first();
    await player.scrollIntoViewIfNeeded();
    for (const { step, at } of PLAN) {
      await player.locator('.step-num').nth(step).click();
      const t0 = Date.now();
      for (const frac of at) {
        const wait = t0 + frac * MS[step] - Date.now();
        if (wait > 0) await page.waitForTimeout(wait);
        await player.locator('.stepper-fig').screenshot({ path: `test-results/frames/${lang}-s${step + 1}-${String(Math.round(frac * 100)).padStart(3, '0')}.png` });
      }
    }
  });
}
