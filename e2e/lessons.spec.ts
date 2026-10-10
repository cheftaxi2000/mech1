import { expect, test, type Page } from '@playwright/test';
import { TOPICS } from '../src/content/curriculum';

const written = TOPICS.filter((t) => t.status !== 'planned');

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

test('home page and navigation render', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mechanik I');
  for (const t of TOPICS) await expect(page.getByRole('navigation').getByText(t.title, { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

for (const topic of written) {
  test(`lesson "${topic.id}" renders without math or console errors`, async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(`/#${topic.id}`);
    await expect(page.locator('article.lesson h2').first()).toBeVisible();
    await expect(page.locator('.tex-error')).toHaveCount(0);
    expect(await page.locator('.katex').count()).toBeGreaterThan(20);
    await page.screenshot({ path: `test-results/screens/${topic.id}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('coordinate explorer: switching systems keeps the point fixed', async ({ page }) => {
  await page.goto('/#koordinaten');
  const explorer = page.locator('.explorer').first();
  await expect(explorer.locator('canvas')).toBeVisible();
  const cart = explorer.locator('.readout tr').first();
  const before = (await cart.textContent()) ?? "";
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await expect(cart).toHaveText(before);
  await explorer.getByRole('tab', { name: 'Kartesisch' }).click();
  await expect(cart).toHaveText(before);
  // Moving the z slider changes the Cartesian readout.
  await explorer.getByLabel('z', { exact: true }).fill('-1');
  await expect(cart).toContainText('-1.00');
  await explorer.screenshot({ path: 'test-results/screens/explorer-cart.png' });
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-sph.png' });
  await explorer.getByRole('tab', { name: 'Zylindrisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-cyl.png' });
});

test('quiz gives feedback on a choice', async ({ page }) => {
  await page.goto('/#koordinaten');
  const quiz = page.locator('.quiz').first();
  await quiz.getByRole('button').nth(1).click();
  await expect(quiz.locator('.quiz-feedback')).toContainText('Correct');
});

test('phone width: no horizontal page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#koordinaten');
  await expect(page.locator('article.lesson h2').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
