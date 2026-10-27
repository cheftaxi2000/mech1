import { expect, test } from '@playwright/test';
import { TOPICS, topicSubject } from '../src/content/curriculum';

const mech = TOPICS.filter((t) => topicSubject(t) === 'mech');

test('Mechanik has no quiz pages any more', () => {
  expect(mech.some((t) => t.id.startsWith('quiz-'))).toBe(false);
});

test('app opens at the home menu, also when the URL carries an old lesson anchor', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.goto('/#rotation');
  await expect(page.locator('.landing')).toBeVisible();
  expect(await page.evaluate(() => window.location.hash)).toBe('');
});

test.describe('short version (Kurz)', () => {
  for (const t of mech) {
    test(`${t.id}: less text, same figures and animations`, async ({ page }) => {
      const count = () => page.evaluate(() => {
        const art = document.querySelector('article.lesson')!;
        const w = document.createTreeWalker(art, NodeFilter.SHOW_TEXT);
        let len = 0;
        while (w.nextNode()) {
          const el = (w.currentNode as Text).parentElement!;
          if (!el.closest('.katex') && el.checkVisibility()) len += w.currentNode.textContent!.trim().length;
        }
        const steppers = [...art.querySelectorAll('.stepper')].filter((e) => e.checkVisibility()).length;
        return { len, steppers, katex: [...art.querySelectorAll('.katex')].filter((e) => e.checkVisibility()).length };
      });
      await page.addInitScript(() => { try { localStorage.setItem('mech1.lang', 'de'); localStorage.setItem('mech1.detail', 'full'); } catch { /* ignore */ } });
      await page.goto(`/#${t.id}`);
      await page.waitForSelector('article.lesson');
      await page.waitForTimeout(400);
      const full = await count();
      await page.getByRole('button', { name: 'Kurz' }).click();
      await page.waitForTimeout(200);
      const short = await count();
      expect(short.len).toBeLessThan(full.len * 0.8);
      expect(short.len).toBeGreaterThan(300);
      expect(short.steppers).toBe(full.steppers); // every derivation animation stays
      expect(short.katex).toBeGreaterThan(full.katex * 0.4); // formulas stay
    });
  }
});
