import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('mech1.lang', 'de'); } catch { /* ignore */ } });
});

test('burger menu opens the chapter drawer, a click navigates and closes it', async ({ page }) => {
  await page.setViewportSize({ width: 1180, height: 820 });
  await page.goto('/#koordinaten');
  const drawer = page.locator('#chapters');
  await expect(drawer).toBeHidden();
  await page.getByRole('button', { name: 'Kapitel' }).click();
  await expect(drawer).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'test-results/screens/shell-drawer-open.png' });
  await drawer.getByText('Vektoren, Skalar- & Kreuzprodukt').click();
  await expect(page).toHaveURL(/#vektoren$/);
  await expect(drawer).toBeHidden();
  // Esc closes as well
  await page.getByRole('button', { name: 'Kapitel' }).click();
  await expect(drawer).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  // the lesson uses the full width: no permanent sidebar
  const box = await page.locator('main.content').boundingBox();
  expect(box!.x).toBeLessThan(200);
});

test('explorer fullscreen covers the viewport and Esc / the button leave it', async ({ page }) => {
  for (const [w, h, name] of [[1180, 820, 'ipad'], [390, 844, 'phone']] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#koordinaten');
    const ex = page.locator('.explorer');
    await expect(ex).toHaveCount(1); // one explorer, at the end of the lesson
    await ex.scrollIntoViewIfNeeded();
    await ex.getByRole('button', { name: 'Vollbild' }).click();
    await expect(ex).toHaveClass(/is-full/);
    const b = await ex.locator('.stage').boundingBox();
    expect(b!.width).toBeGreaterThan(w * (name === 'ipad' ? 0.6 : 0.95));
    await page.waitForTimeout(400);
    await page.screenshot({ path: `test-results/screens/shell-fullscreen-${name}.png` });
    await ex.getByRole('button', { name: 'Vollbild beenden' }).click();
    await expect(ex).not.toHaveClass(/is-full/);
  }
});
