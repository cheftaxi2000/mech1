import { test } from '@playwright/test';

// Review aid, not a regression test: captures frames of the running animation for a human (or a reviewer agent) to look at.
// Run with: REVIEW_FRAMES=1 npx playwright test e2e/animation-frames.spec.ts
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture animation frames');

const PLAN: { step: number; at: number[] }[] = [
  { step: 0, at: [0.1, 0.35, 0.6] },
  { step: 1, at: [0.1, 0.2, 0.45, 0.75] },
  { step: 2, at: [0.2, 0.35, 0.5, 0.62, 0.75, 0.88] },
  { step: 3, at: [0.15, 0.35, 0.55, 0.8] },
  { step: 4, at: [0.1, 0.25, 0.5, 0.7, 0.95] },
];
const MS = [4500, 5500, 10000, 5500, 8000];

const PLAN_SPH: { step: number; at: number[] }[] = [
  { step: 0, at: [0.15, 0.5, 0.8] },
  { step: 1, at: [0.15, 0.35, 0.55, 0.68, 0.85] },
  { step: 2, at: [0.12, 0.3, 0.55, 0.75, 0.92] },
  { step: 3, at: [0.15, 0.45, 0.7, 0.9] },
  { step: 4, at: [0.2, 0.6] },
];
const MS_SPH = [5000, 10000, 9000, 7000, 4500];

test('[de] capture spherical animation frames', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/#koordinaten');
  const player = page.locator('.stepper').nth(1);
  await player.locator('.stepper-fig').scrollIntoViewIfNeeded();
  for (const { step, at } of PLAN_SPH) {
    await player.locator('.step-num').nth(step).click();
    const t0 = Date.now();
    for (const frac of at) {
      const wait = t0 + frac * MS_SPH[step] - Date.now();
      if (wait > 0) await page.waitForTimeout(wait);
      await player.locator('.stepper-fig').screenshot({ path: `test-results/frames/sph-s${step + 1}-${String(Math.round(frac * 100)).padStart(3, '0')}.png` });
    }
  }
});

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

test('[review] explorer, phone layout, dark mode', async ({ page }) => {
  test.setTimeout(120_000);
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  // 3D explorer in all three modes (lecture-oriented camera, KaTeX-font labels with halo)
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#koordinaten');
  const ex = page.locator('.explorer:has([role=tablist])');
  await ex.scrollIntoViewIfNeeded();
  for (const [tab, name] of [['Kartesisch', 'cart'], ['Zylindrisch', 'cyl'], ['Sphärisch', 'sph']] as const) {
    await ex.getByRole('tab', { name: tab }).click();
    await page.waitForTimeout(400);
    await ex.screenshot({ path: `test-results/frames/review-explorer-${name}.png` });
  }
  // phone portrait: the figure stays on screen while the captions scroll (sticky)
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#koordinaten');
  const player = page.locator('.stepper').first();
  await player.locator('.stepper-steps li').nth(3).scrollIntoViewIfNeeded();
  await player.locator('.step-num').nth(3).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/frames/review-phone-step4.png' });
  // dark mode, iPad portrait
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('/#koordinaten');
  await page.locator('.stepper').first().locator('.stepper-fig').scrollIntoViewIfNeeded();
  await page.locator('.stepper .step-num').nth(2).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/frames/review-dark-ipad-step3.png' });
});

test('[review] explorer motion (trajectory) and fullscreen', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#koordinaten');
  const ex = page.locator('.explorer:has([role=tablist])');
  await ex.scrollIntoViewIfNeeded();
  await ex.getByRole('button', { name: 'Bewegung abspielen' }).click();
  await page.waitForTimeout(500);
  await ex.screenshot({ path: 'test-results/frames/review-motion.png' });
  await ex.getByRole('button', { name: 'Vollbild' }).click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'test-results/frames/review-fullscreen.png' });
});

test('[review] vektoren figures on iPad and phone, light and dark', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#vektoren');
    await page.locator('article.lesson h2').first().waitFor();
    const figs = page.locator('article.lesson figure');
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded();
      await page.waitForTimeout(400);
      await figs.nth(i).screenshot({ path: `test-results/frames/vektoren-${name}-${i + 1}.png` });
    }
  }
});

test('[review] basen: cylindrical-basis animation (final frames) and explorer with basis', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [w, h, name] of [[1180, 820, 'ipad'], [390, 844, 'phone']] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#basen');
    await page.locator('article.lesson h2').first().waitFor();
    const st = page.locator('.stepper').first();
    for (let i = 0; i < 4; i++) {
      await st.locator('.step-num').nth(i).click();
      await page.waitForTimeout(400);
      await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/basen-${name}-step${i + 1}.png` });
    }
    const ex = page.locator('.explorer:has([role=tablist])');
    for (const mode of ['Kartesisch', 'Zylindrisch', 'Sphärisch']) {
      await ex.scrollIntoViewIfNeeded();
      await ex.getByRole('tab', { name: mode }).click();
      await page.waitForTimeout(400);
      await ex.screenshot({ path: `test-results/frames/basen-${name}-explorer-${mode}.png` });
    }
  }
});

test('[review] geschwindigkeit: animation steps, running frames, figures', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#geschwindigkeit');
    await page.locator('article.lesson h2').first().waitFor();
    const st = page.locator('.stepper').first();
    for (let i = 0; i < 4; i++) {
      await st.locator('.step-num').nth(i).click();
      await page.waitForTimeout(300);
      await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/vel-${name}-step${i + 1}.png` });
    }
    const figs = page.locator('article.lesson figure.vdemo, article.lesson figure.explorer');
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      await figs.nth(i).screenshot({ path: `test-results/frames/vel-${name}-fig${i + 1}.png` });
    }
  }
  // running frames of the limit step
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#geschwindigkeit');
  await page.locator('article.lesson h2').first().waitFor();
  const st = page.locator('.stepper').first();
  await st.locator('.step-num').nth(2).click();
  for (let k = 0; k < 4; k++) { await page.waitForTimeout(1500); await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/vel-running-${k}.png` }); }
});

test('[review] v-krummlinig: e_rho animation steps and figures', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#v-krummlinig');
    await page.locator('article.lesson h2').first().waitFor();
    const st = page.locator('.stepper').first();
    for (let i = 0; i < 5; i++) {
      await st.locator('.step-num').nth(i).click();
      await page.waitForTimeout(300);
      await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/curv-${name}-step${i + 1}.png` });
    }
    const figs = page.locator('article.lesson figure.explorer');
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
      await figs.nth(i).screenshot({ path: `test-results/frames/curv-${name}-fig${i + 1}.png` });
    }
    const ex = figs.first();
    await ex.getByRole('tab', { name: 'Sphärisch' }).click(); await page.waitForTimeout(400);
    await ex.screenshot({ path: `test-results/frames/curv-${name}-fig1-sph.png` });
  }
});

test('[review] v-krummlinig: v tangent to the drawn path (student report: rho-dot = -0.4)', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#v-krummlinig');
  await page.locator('article.lesson h2').first().waitFor();
  const ex = page.locator('figure.explorer').first();
  await ex.scrollIntoViewIfNeeded();
  await ex.locator('input[aria-label="rate-0"]').fill('-0.4');
  await page.waitForTimeout(400);
  await ex.screenshot({ path: 'test-results/frames/curv-report-1.png' });
  await ex.getByRole('button', { name: 'Bewegung abspielen' }).click();
  await page.waitForTimeout(1800);
  await ex.locator('input[aria-label="rate-1"]').fill('-0.5');
  await page.waitForTimeout(1500);
  await ex.screenshot({ path: 'test-results/frames/curv-report-2.png' });
  await ex.getByRole('checkbox').check();
  await page.waitForTimeout(400);
  await ex.screenshot({ path: 'test-results/frames/curv-report-3.png' });
});

test('[review] kreisbewegung: animation steps and rotation field', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#kreisbewegung');
    await page.locator('article.lesson h2').first().waitFor();
    const st = page.locator('.stepper').first();
    for (let i = 0; i < 6; i++) {
      await st.locator('.step-num').nth(i).click();
      await page.waitForTimeout(300);
      await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/circ-${name}-step${i + 1}.png` });
    }
    const ex = page.locator('figure.explorer').first();
    await ex.scrollIntoViewIfNeeded(); await page.waitForTimeout(400);
    await ex.screenshot({ path: `test-results/frames/circ-${name}-field.png` });
    if (name === 'ipad') { await ex.getByRole('checkbox').check(); await page.waitForTimeout(300); await ex.screenshot({ path: 'test-results/frames/circ-ipad-field-wrongO.png' }); }
  }
});

test('[review] sdpg: proof animation and figures', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('mech1.lang', 'de'));
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [390, 844, 'phone', 'light'], [820, 1180, 'ipad-dark', 'dark']] as const) {
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#sdpg');
    await page.locator('article.lesson h2').first().waitFor();
    const st = page.locator('.stepper').first();
    for (let i = 0; i < 5; i++) {
      await st.locator('.step-num').nth(i).click();
      await page.waitForTimeout(300);
      await st.locator('.stepper-fig').screenshot({ path: `test-results/frames/sdpg-${name}-step${i + 1}.png` });
    }
    const figs = page.locator('article.lesson figure.vdemo');
    for (let i = 0; i < (await figs.count()); i++) {
      await figs.nth(i).scrollIntoViewIfNeeded(); await page.waitForTimeout(300);
      await figs.nth(i).screenshot({ path: `test-results/frames/sdpg-${name}-fig${i + 1}.png` });
    }
    if (name === 'ipad') {
      await figs.first().getByRole('checkbox').check(); await page.waitForTimeout(200);
      await figs.first().screenshot({ path: 'test-results/frames/sdpg-ipad-fig1-stretch.png' });
    }
  }
});
