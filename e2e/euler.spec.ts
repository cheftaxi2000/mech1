import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('mech1.lang', 'de'); } catch { /* ignore */ } });
});

// Euler form figure (Analysis week 6): unit circle with the two shadows cos φ and sin φ, linked to the graphs.
for (const [w, h, name] of [[1180, 820, 'ipad'], [390, 844, 'phone']] as const) {
  test(`[${name}] Euler circle: slider, presets, drag, play`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#ana-komplex');
    const fig = page.locator('.eu-fig');
    await fig.scrollIntoViewIfNeeded();
    const val = fig.locator('.slider .val');
    await expect(val).toHaveText('60°');
    await fig.locator('input[type=range]').fill('180');
    await expect(val).toHaveText('180°');
    // e^{iπ} = −1: the read-out shows cos φ = −1 and sin φ = 0
    await expect(fig.locator('.v-result').nth(2)).toContainText('\\cos\\varphi = -1');
    // drag in the complex plane to the point (0, 1): φ = 90°
    const svg = fig.locator('svg').first();
    const b = (await svg.boundingBox())!;
    const k = b.width / 300, cx = b.x + 150 * k, cy = b.y + 150 * k, unit = (300 - 2 * 14) / 3 * k; // approx unit length in px
    await page.mouse.move(cx + unit, cy); await page.mouse.down();
    await page.mouse.move(cx, cy - unit, { steps: 8 }); await page.mouse.up();
    const deg = parseInt((await val.textContent()) ?? '0', 10);
    expect(Math.abs(deg - 90)).toBeLessThanOrEqual(3);
    // play changes φ by itself and Pause stops it
    await fig.getByRole('button', { name: 'Abspielen' }).click();
    await page.waitForTimeout(900);
    const moved = parseInt((await val.textContent()) ?? '0', 10);
    expect(moved).not.toBe(deg);
    await fig.getByRole('button', { name: 'Pause' }).click();
    const frozen = await val.textContent();
    await page.waitForTimeout(400);
    expect(await val.textContent()).toBe(frozen);
    await fig.screenshot({ path: `test-results/screens/euler-${name}.png` });
    expect(errors).toEqual([]);
  });
}

// Kreisbewegung in Komponenten: the velocity components are the slopes of x(t), y(t).
test('circle components figure: sliders change the read-out, play and pause', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#kreisbewegung');
  const fig = page.locator('.cc-fig');
  await fig.scrollIntoViewIfNeeded();
  const before = await fig.locator('.v-result').nth(1).textContent();
  await fig.locator('input[type=range]').nth(1).fill('2');
  expect(await fig.locator('.v-result').nth(1).textContent()).not.toBe(before);
  await fig.locator('input[type=range]').nth(0).fill('-1');
  await expect(fig.locator('.slider .val').nth(0)).toHaveText('−1,00');
  await fig.getByRole('button', { name: 'Abspielen' }).click();
  const t0 = await fig.locator('.slider .val').nth(1).textContent();
  await page.waitForTimeout(700);
  expect(await fig.locator('.slider .val').nth(1).textContent()).not.toBe(t0);
  await fig.getByRole('button', { name: 'Pause' }).click();
  await fig.screenshot({ path: 'test-results/screens/circle-components.png' });
  expect(errors).toEqual([]);
});
