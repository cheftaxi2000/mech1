import { expect, test, type Page } from '@playwright/test';
import { CHAPTERS, TOPICS } from '../src/content/curriculum';

type Lang = 'de' | 'en';
const LANGS: Lang[] = ['de', 'en'];
const written = TOPICS.filter((t) => t.status !== 'planned');

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

async function open(page: Page, lang: Lang, hash = '') {
  await page.addInitScript((l) => { try { localStorage.setItem('mech1.lang', l); } catch { /* ignore */ } }, lang);
  await page.goto(`/${hash}`);
}

/** Reveal every hidden explanation (choice feedback, predictions, numeric solutions) and return all lesson text. */
async function allLessonText(page: Page): Promise<string> {
  const chunks: string[] = [];
  const quizzes = page.locator('article.lesson .quiz');
  for (let q = 0; q < (await quizzes.count()); q++) {
    const quiz = quizzes.nth(q);
    const choices = quiz.locator('.quiz-choices button');
    for (let i = 0; i < (await choices.count()); i++) {
      await choices.nth(i).click();
      chunks.push(await textOutsideMathAndGerman(quiz.locator('.quiz-feedback')));
    }
    if (await quiz.locator('.numeric').count()) {
      await quiz.locator('input').fill('-999');
      await quiz.locator('.numeric button').click();
      await quiz.locator('summary').click();
      chunks.push(await textOutsideMathAndGerman(quiz.locator('.quiz-feedback')));
    }
    if (await quiz.locator('.predict, :scope.predict').count() || (await quiz.getAttribute('class'))?.includes('predict')) {
      const reveal = quiz.locator(':scope > button');
      if (await reveal.count()) await reveal.click();
    }
  }
  chunks.push(await textOutsideMathAndGerman(page.locator('main')));
  return chunks.join('\n');
}

/** Visible text without formulas, code, German-tagged terms and source badges. */
function textOutsideMathAndGerman(loc: ReturnType<Page['locator']>) {
  return loc.evaluate((el) => {
    const c = el.cloneNode(true) as HTMLElement;
    c.querySelectorAll('.katex, [lang="de"], .src, code, canvas, svg').forEach((n) => n.remove());
    return c.textContent ?? '';
  });
}

const LEAK: Record<Lang, RegExp> = {
  // English function words must not appear in German mode, and vice versa.
  de: /\b(the|and|is|are|of|with|which|this|that|from|only)\b/gi,
  en: /\b(und|der|die|das|ist|sind|nicht|mit|wird|auf|eine?|dem|den)\b/gi,
};

for (const lang of LANGS) {
  test(`[${lang}] home page and navigation render`, async ({ page }) => {
    const errors = trackErrors(page);
    await open(page, lang);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Mechanik I');
    const i = lang === 'de' ? 0 : 1;
    for (const t of TOPICS) await expect(page.getByRole('navigation').getByText(t.title[i], { exact: true })).toBeVisible();
    for (const ch of Object.values(CHAPTERS)) await expect(page.getByRole('navigation').getByText(ch[i], { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });

  for (const topic of written) {
    test(`[${lang}] lesson "${topic.id}" renders without math or console errors`, async ({ page }) => {
      const errors = trackErrors(page);
      await open(page, lang, `#${topic.id}`);
      await expect(page.locator('article.lesson h2').first()).toBeVisible();
      await expect(page.locator('.tex-error')).toHaveCount(0);
      expect(await page.locator('.katex').count()).toBeGreaterThan(20);
      await page.screenshot({ path: `test-results/screens/${topic.id}-${lang}.png`, fullPage: true });
      expect(errors).toEqual([]);
    });

    test(`[${lang}] lesson "${topic.id}" contains no text in the other language`, async ({ page }) => {
      await open(page, lang, `#${topic.id}`);
      await expect(page.locator('article.lesson h2').first()).toBeVisible();
      const text = await allLessonText(page);
      const hits = [...new Set((text.match(LEAK[lang]) ?? []).map((w) => w.toLowerCase()))];
      const context = hits.slice(0, 5).map((w) => text.match(new RegExp(`.{0,40}\\b${w}\\b.{0,40}`, 'i'))?.[0]);
      expect(hits, `leaked words, e.g.:\n${context.join('\n')}`).toEqual([]);
    });
  }
}

test('language toggle switches the whole page and is remembered', async ({ page }) => {
  await page.goto('/#koordinaten'); // no init script here: the reload below must read the stored choice
  await page.getByRole('button', { name: 'Deutsch' }).click();
  await expect(page.locator('article.lesson h2').first()).toHaveText('1. Der materielle Punkt und seine Bewegung');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('article.lesson h2').first()).toHaveText('1. The material point and its motion');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.reload();
  await expect(page.locator('article.lesson h2').first()).toHaveText('1. The material point and its motion');
});

test('coordinate explorer: switching systems keeps the point fixed (German number format)', async ({ page }) => {
  await open(page, 'de', '#koordinaten');
  const explorer = page.locator('.explorer').first();
  await expect(explorer.locator('canvas')).toBeVisible();
  const cart = explorer.locator('.readout tr').first();
  const before = (await cart.textContent()) ?? '';
  expect(before).toContain('1,15'); // decimal comma
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await expect(cart).toHaveText(before);
  await explorer.getByRole('tab', { name: 'Kartesisch' }).click();
  await expect(cart).toHaveText(before);
  await explorer.getByLabel('z', { exact: true }).fill('-1');
  await expect(explorer.locator('.slider .val').nth(2)).toHaveText('-1,00');
  await explorer.screenshot({ path: 'test-results/screens/explorer-cart.png' });
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-sph.png' });
  await explorer.getByRole('tab', { name: 'Zylindrisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-cyl.png' });
});

test('quiz gives feedback on a choice', async ({ page }) => {
  await open(page, 'de', '#koordinaten');
  const quiz = page.locator('.quiz').first();
  await quiz.getByRole('button').nth(1).click();
  await expect(quiz.locator('.quiz-feedback')).toContainText('Richtig');
});

test('phone width: no horizontal page scroll', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, 'de', '#koordinaten');
  await expect(page.locator('article.lesson h2').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
