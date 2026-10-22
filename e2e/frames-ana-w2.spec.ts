import { test } from '@playwright/test';

// Review aid, not a regression test: frames of the week-2 Analysis animations and figures (final frames under
// reduced motion, running frames, every preset), for a human to look at.
// Run with: REVIEW_FRAMES=1 npx playwright test e2e/frames-ana-w2.spec.ts  → test-results/frames/
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

for (const [topic, tag] of [['ana-funktionen', 'w2fun'], ['ana-grenzwerte-funktionen', 'w2lim']] as const) {
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
        // sliders at their ends
        const ranges = fig.locator('input[type=range]');
        for (let r = 0; r < (await ranges.count()); r++) {
          for (const end of ['max', 'min'] as const) {
            await ranges.nth(r).evaluate((el: HTMLInputElement, e) => {
              const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
              set.call(el, e === 'max' ? el.max : el.min); el.dispatchEvent(new Event('input', { bubbles: true }));
            }, end);
            await page.waitForTimeout(200);
            await fig.screenshot({ path: `test-results/frames/${tag}-ipad-fig${i + 1}-slider${r + 1}-${end}.png` });
          }
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
