import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('mech1.lang', 'de'); } catch { /* ignore */ } });
});

// Ladder polodes: slider, drag of A and the sliding animation change φ and keep the two swept arcs equal.
for (const [w, h, name] of [[1180, 820, 'ipad'], [390, 844, 'phone']] as const) {
  test(`[${name}] polode figure: slider, drag, play`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#ebene-bewegung');
    const fig = page.locator('.polode');
    await fig.scrollIntoViewIfNeeded();
    const val = fig.locator('.slider').first().locator('.val');
    await expect(val).toHaveText('50°');
    await fig.locator('input[type=range]').first().fill('30');
    await expect(val).toHaveText('30°');
    // the two arcs are reported equal
    const arcs = await fig.locator('.rt-readout').nth(1).textContent();
    const nums = [...(arcs ?? '').matchAll(/=\s*([0-9]+,[0-9]+)/g)].map((m) => m[1]);
    expect(nums[0]).toBe(nums[1]);
    // drag A to the right: the ladder gets steeper
    const svg = fig.locator('svg').first();
    const box = (await svg.boundingBox())!;
    const k = box.width / 400;
    const ax = box.x + (300 - 190 * Math.cos((30 * Math.PI) / 180)) * k, ay = box.y + 250 * k;
    await page.mouse.move(ax, ay); await page.mouse.down();
    await page.mouse.move(box.x + (300 - 190 * Math.cos((65 * Math.PI) / 180)) * k, ay, { steps: 6 });
    await page.mouse.up();
    const after = parseInt((await val.textContent()) ?? '0', 10);
    expect(Math.abs(after - 65)).toBeLessThanOrEqual(2);
    // play: φ decreases and the loop stops at the end by itself
    await fig.getByRole('button', { name: /rutschen/ }).click();
    await page.waitForTimeout(700);
    const mid = parseInt((await val.textContent()) ?? '0', 10);
    expect(mid).toBeLessThan(after);
    await page.waitForTimeout(4500);
    await expect(val).toHaveText('20°');
    await expect(fig.getByRole('button', { name: /rutschen/ })).toHaveAttribute('aria-pressed', 'false');
    await page.screenshot({ path: `test-results/screens/polode-${name}.png` });
    expect(errors).toEqual([]);
  });
}
