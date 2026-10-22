import { test } from '@playwright/test';

// Review aid, not a regression test: frames of the animations and figures of the lessons week 1 of Analysis 1 (ana-folgen, ana-grenzwerte-folgen, ana-reihen),
// final frames (reduced motion) and running frames, for a human to look at.
// Run with: REVIEW_FRAMES=1 npx playwright test e2e/frames-ana-w1.spec.ts  → test-results/frames/
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

for (const [topic, tag] of [['ana-folgen', 'w1folgen'], ['ana-grenzwerte-folgen', 'w1grenz'], ['ana-reihen', 'w1reihen']] as const) {
  test(`[review] ${topic}: step animations and figures`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
    for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/#home'); await page.goto(`/#${topic}`);
      await page.locator('article.lesson h2').first().waitFor();
      const steppers = page.locator('.stepper');
      for (let k = 0; k < (await steppers.count()); k++) {
        const st = steppers.nth(k);
        await st.scrollIntoViewIfNeeded();
        const n = await st.locator('.step-num').count();
        for (let i = 0; i < n; i++) {
          if (name === 'phone' && i < n - 1) continue;
          await st.locator('.step-num').nth(i).click();
          await page.waitForTimeout(300);
          await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/${tag}-${name}-anim${k + 1}-step${i + 1}.png` });
        }
      }
      const figs = page.locator('article.lesson figure.vdemo');
      for (let i = 0; i < (await figs.count()); i++) {
        const fig = figs.nth(i);
        await fig.scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
        await fig.screenshot({ path: `test-results/frames/${tag}-${name}-fig${i + 1}.png` });
        if (name !== 'ipad') continue;
        const presets = fig.locator('.v-presets button');
        for (let p = 0; p < (await presets.count()); p++) {
          await presets.nth(p).click(); await page.waitForTimeout(200);
          await fig.screenshot({ path: `test-results/frames/${tag}-ipad-fig${i + 1}-preset${p + 1}.png` });
        }
      }
    }
  });

  test(`[review] ${topic}: running frames`, async ({ page }) => {
    test.setTimeout(240_000);
    await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.goto(`/#${topic}`);
    await page.locator('article.lesson h2').first().waitFor();
    const steppers = page.locator('.stepper');
    for (let k = 0; k < (await steppers.count()); k++) {
      const st = steppers.nth(k);
      await st.scrollIntoViewIfNeeded();
      const n = await st.locator('.step-num').count();
      for (let i = 0; i < n; i++) {
        await st.locator('.step-num').nth(i).click();
        for (const ms of [500, 1300]) {
          await page.waitForTimeout(ms === 500 ? 500 : 800);
          await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/${tag}-run-anim${k + 1}-step${i + 1}-${ms}ms.png` });
        }
      }
    }
  });
}
