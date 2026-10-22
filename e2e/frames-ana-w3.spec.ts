import { test } from '@playwright/test';

// Review aid, not a regression test: figures and animation frames of the Analysis week-3 lessons.
// Run with: REVIEW_FRAMES=1 npx playwright test e2e/frames-ana-w3.spec.ts  → test-results/frames/
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

const TOPICS = ['ana-stetigkeit', 'ana-transformationen', 'ana-umkehr', 'ana-asymptoten'];

for (const topic of TOPICS) {
  test(`[review] ${topic}: figures and step frames`, async ({ page }) => {
    test.setTimeout(300_000);
    await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
    for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [1180, 820, 'ipad-dark', 'dark']] as const) {
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
      await page.setViewportSize({ width: w, height: h });
      await page.goto('/#home'); await page.goto(`/#${topic}`);
      await page.locator('article.lesson h2').first().waitFor();
      await page.waitForTimeout(500);
      const steppers = page.locator('.stepper');
      for (let k = 0; k < (await steppers.count()); k++) {
        const st = steppers.nth(k);
        await st.scrollIntoViewIfNeeded();
        const n = await st.locator('.step-num').count();
        for (let i = 0; i < n; i++) {
          if (name !== 'ipad' && i < n - 1) continue;
          await st.locator('.step-num').nth(i).click();
          await page.waitForTimeout(300);
          await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/w3-${topic}-${name}-anim${k + 1}-step${i + 1}.png` });
        }
      }
      if (name !== 'ipad-dark') {
        const players = page.locator('.w3-mirror');
        for (let k = 0; k < (await players.count()); k++) {
          const pl = players.nth(k), bs = pl.locator(':scope > .v-presets button');
          for (let p = 0; p < (await bs.count()); p++) {
            await bs.nth(p).click(); await page.waitForTimeout(200);
            const nums = pl.locator('.step-num'), n = await nums.count();
            for (const i of [1, n - 1]) {
              await nums.nth(i).click(); await page.waitForTimeout(300);
              await pl.locator('.stepper-fig').screenshot({ path: `test-results/frames/w3-${topic}-${name}-player${k + 1}-ex${p + 1}-step${i + 1}.png` });
            }
          }
        }
      }
      const figs = page.locator('article.lesson figure.vdemo');
      for (let i = 0; i < (await figs.count()); i++) {
        const fig = figs.nth(i);
        await fig.scrollIntoViewIfNeeded(); await page.waitForTimeout(250);
        await fig.screenshot({ path: `test-results/frames/w3-${topic}-${name}-fig${i + 1}.png` });
        if (name !== 'ipad') continue;
        const presets = fig.locator('.v-presets button');
        for (let p = 0; p < (await presets.count()); p++) {
          await presets.nth(p).click(); await page.waitForTimeout(200);
          await fig.screenshot({ path: `test-results/frames/w3-${topic}-ipad-fig${i + 1}-preset${p + 1}.png` });
        }
      }
    }
  });

  test(`[review] ${topic}: running frames`, async ({ page }) => {
    test.setTimeout(300_000);
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
        await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/w3-${topic}-run-anim${k + 1}-step${i + 1}.png` });
      }
    }
  });
}
