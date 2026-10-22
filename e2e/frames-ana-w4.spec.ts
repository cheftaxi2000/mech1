import { test } from '@playwright/test';

// Review aid, not a regression test: frames of the week-4 Analysis animations and figures (final frames under reduced
// motion, figure presets, running frames). Run with: REVIEW_FRAMES=1 npx playwright test e2e/frames-ana-w4.spec.ts
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

for (const [topic, tag] of [['ana-ableitung', 'w4a'], ['ana-ableitungsregeln', 'w4r'], ['ana-tangente', 'w4t']] as const) {
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
        const sliders = fig.locator('input[type=range]');
        for (let s = 0; s < (await sliders.count()); s++) {
          for (const where of ['min', 'max'] as const) {
            await sliders.nth(s).evaluate((el: HTMLInputElement, wh) => {
              const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
              set.call(el, wh === 'min' ? el.min : el.max); el.dispatchEvent(new Event('input', { bubbles: true }));
            }, where);
            await page.waitForTimeout(150);
            await fig.screenshot({ path: `test-results/frames/${tag}-ipad-fig${i + 1}-slider${s + 1}-${where}.png` });
          }
        }
      }
    }
  });

  test(`[review] ${topic}: running frames`, async ({ page }) => {
    test.setTimeout(120_000);
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
        await page.waitForTimeout(900);
        await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/${tag}-run-anim${k + 1}-step${i + 1}-900ms.png` });
      }
    }
  });
}
