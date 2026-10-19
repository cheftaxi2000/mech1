import { test } from '@playwright/test';

// Review aid, not a regression test: frames of the animations and figures of lesson «zentralachse» for a human
// (or a reviewer agent) to look at. Run with: REVIEW_FRAMES=1 npx playwright test e2e/frames-zentralachse.spec.ts
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

const OUT = 'test-results/frames';

test('[review] zentralachse: final frames of every step, figures, both themes, iPad and phone', async ({ page }) => {
  test.setTimeout(300_000);
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [1180, 820, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#home'); await page.goto('/#zentralachse');
    await page.locator('article.lesson h2').first().waitFor();
    const steppers = page.locator('.stepper');
    for (let k = 0; k < (await steppers.count()); k++) {
      const st = steppers.nth(k);
      await st.scrollIntoViewIfNeeded();
      const n = await st.locator('.step-num').count();
      for (let i = 0; i < n; i++) {
        await st.locator('.step-num').nth(i).click();
        await page.waitForTimeout(450);
        await st.locator('.stepper-fig').screenshot({ path: `${OUT}/za-${name}-anim${k + 1}-step${i + 1}.png` });
      }
    }
    const figs = page.locator('article.lesson figure.explorer');
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
      await figs.nth(i).screenshot({ path: `${OUT}/za-${name}-explorer${i + 1}.png` });
    }
    if (name === 'ipad') {
      const inv = figs.nth(0);
      if (await inv.count()) {
        await inv.getByRole('checkbox').first().check(); await page.waitForTimeout(300);
        await inv.screenshot({ path: `${OUT}/za-ipad-explorer1-all.png` });
      }
      const scr = figs.nth(1);
      if (await scr.count()) {
        for (const label of ['Rotation', 'Translation', 'Schraube']) {
          await scr.getByRole('button', { name: label, exact: true }).click();
          await scr.getByRole('slider').last().fill('70'); await page.waitForTimeout(300);
          await scr.screenshot({ path: `${OUT}/za-ipad-explorer2-${label}.png` });
        }
      }
    }
  }
});

test('[review] zentralachse: running frames of the screw animation and the cube', async ({ page }) => {
  test.setTimeout(180_000);
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#zentralachse');
  await page.locator('article.lesson h2').first().waitFor();
  const plans: { k: number; steps: { i: number; ms: number; at: number[] }[] }[] = [
    { k: 0, steps: [{ i: 2, ms: 6000, at: [0.25, 0.5, 0.8] }, { i: 3, ms: 5000, at: [0.2, 0.45, 0.7] }, { i: 4, ms: 5500, at: [0.25, 0.5, 0.75] }, { i: 5, ms: 12000, at: [0.15, 0.35, 0.6, 0.85] }] },
    { k: 1, steps: [{ i: 3, ms: 4500, at: [0.3, 0.6] }, { i: 5, ms: 7000, at: [0.3, 0.6, 0.9] }] },
  ];
  for (const { k, steps } of plans) {
    const st = page.locator('.stepper').nth(k);
    if (!(await st.count())) continue;
    await st.scrollIntoViewIfNeeded();
    for (const { i, ms, at } of steps) {
      await st.locator('.step-num').nth(i).click();
      const t0 = Date.now();
      for (const frac of at) {
        const wait = t0 + frac * ms - Date.now();
        if (wait > 0) await page.waitForTimeout(wait);
        await st.locator('.stepper-fig').screenshot({ path: `${OUT}/za-run-anim${k + 1}-s${i + 1}-${String(Math.round(frac * 100)).padStart(3, '0')}.png` });
      }
    }
  }
});
