import { expect, test, type Page } from '@playwright/test';
import { SUBJECTS, TOPICS, topicSubject } from '../src/content/curriculum';

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
async function allLessonText(page: Page, mathHits: string[] = []): Promise<string> {
  const chunks: string[] = [];
  const scanFeedback = async () => {
    mathHits.push(...(await plainTextMath(page, 'article.lesson .quiz-feedback')));
    const bad = page.locator('article.lesson .quiz-feedback .tex-error');
    if (await bad.count()) mathHits.push(`KaTeX error in an explanation: ${await bad.first().textContent()}`);
  };
  const quizzes = page.locator('article.lesson .quiz');
  for (let q = 0; q < (await quizzes.count()); q++) {
    const quiz = quizzes.nth(q);
    const choices = quiz.locator('.quiz-choices button');
    for (let i = 0; i < (await choices.count()); i++) {
      await choices.nth(i).click();
      chunks.push(await textOutsideMathAndGerman(quiz.locator('.quiz-feedback')));
      await scanFeedback();
    }
    if (await quiz.locator('.numeric').count()) {
      await quiz.locator('input').fill('-999');
      await quiz.locator('.numeric button').click();
      await quiz.locator('summary').click();
      chunks.push(await textOutsideMathAndGerman(quiz.locator('.quiz-feedback')));
      await scanFeedback();
    }
    if (await quiz.locator('.predict, :scope.predict').count() || (await quiz.getAttribute('class'))?.includes('predict')) {
      const reveal = quiz.locator(':scope > button');
      if (await reveal.count()) { await reveal.click(); await scanFeedback(); }
    }
  }
  chunks.push(await textOutsideMathAndGerman(page.locator('main')));
  return chunks.join('\n');
}

/** Visible text without formulas, code, German-tagged terms and source badges. */
function textOutsideMathAndGerman(loc: ReturnType<Page['locator']>) {
  return loc.evaluate((el) => {
    const c = el.cloneNode(true) as HTMLElement;
    c.querySelectorAll('.katex, [lang="de"], [lang="en"], .src, code, canvas, svg').forEach((n) => n.remove());
    return c.textContent ?? '';
  });
}

/**
 * Mathematics must never appear as plain text: Greek letters, math symbols, lone variables (x, y, z, M, O, F)
 * and relations like "x > 0" belong in KaTeX (<M>), so they look the same everywhere (D-010).
 * `scope` limits the scan to part of the page (e.g. one quiz feedback).
 */
async function plainTextMath(page: Page, scope = 'body'): Promise<string[]> {
  return page.evaluate((sel) => {
    const SYMBOL = /[\u0370-\u03FF\u1F00-\u1FFF√²³⟂⊥∥≤≥≠−×∈∞±]/;
    const LONE_VAR = /(^|[^\p{L}\p{N}])[xyzMOF](?=$|[^\p{L}\p{N}.'’-])/u;
    const RELATION = /[A-Za-z0-9]\s*[<>=]\s*[A-Za-z0-9]/;
    const bad: string[] = [];
    for (const root of document.querySelectorAll(sel)) {
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode, p = n.parentElement, s = n.textContent ?? '';
        if (!p || p.closest('.katex, script, style, code, title, svg, .slider .val')) continue;
        if (SYMBOL.test(s) || LONE_VAR.test(s) || RELATION.test(s)) bad.push(s.trim().slice(0, 80));
      }
    }
    return bad;
  }, scope);
}

const LEAK: Record<Lang, RegExp> = {
  // English function words must not appear in German mode, and vice versa.
  de: /\b(the|and|is|are|of|with|which|this|that|from|only)\b/gi,
  en: /\b(und|der|die|das|ist|sind|nicht|mit|wird|auf|eine?|dem|den)\b/gi,
};

for (const lang of LANGS) {
  test(`[${lang}] landing offers all subjects; each subject page lists its lessons`, async ({ page }) => {
    const errors = trackErrors(page);
    await open(page, lang);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Learning Lab');
    const tiles = page.locator('a.tile');
    await expect(tiles).toHaveCount(5);
    const i = lang === 'de' ? 0 : 1;
    for (const [route, subject, ch] of [['mechanik', 'mech', (c: string) => !c.startsWith('A') && !c.startsWith('LA') && !c.startsWith('CH') && !/^I\d/.test(c)], ['analysis', 'ana', (c: string) => c.startsWith('A') && !c.startsWith('LA')], ['algebra', 'la', (c: string) => c.startsWith('LA')], ['chemie', 'chem', (c: string) => c.startsWith('CH')], ['informatik', 'info', (c: string) => /^I\d/.test(c)]] as const) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(SUBJECTS[subject][i]);
      const main = page.locator('.toc');
      for (const t of TOPICS.filter((t) => ch(t.chapter))) await expect(main.getByText(t.title[i], { exact: true })).toBeVisible();
      expect(await plainTextMath(page)).toEqual([]);
    }
    expect(errors).toEqual([]);
  });

  for (const topic of written) {
    test(`[${lang}] lesson "${topic.id}" renders without math or console errors`, async ({ page }) => {
      const errors = trackErrors(page);
      await open(page, lang, `#${topic.id}`);
      await expect(page.locator('article.lesson h2').first()).toBeVisible();
      await expect(page.locator('.tex-error')).toHaveCount(0);
      // code-centred subjects (Informatik) carry fewer formulas than the maths-heavy ones
      expect(await page.locator('.katex').count()).toBeGreaterThan(topicSubject(topic) === 'info' ? -1 : 20);
      await page.screenshot({ path: `test-results/screens/${topic.id}-${lang}.png`, fullPage: true });
      expect(errors).toEqual([]);
    });

    test(`[${lang}] lesson "${topic.id}" contains no text in the other language`, async ({ page }) => {
      await open(page, lang, `#${topic.id}`);
      await expect(page.locator('article.lesson h2').first()).toBeVisible();
      const mathHits: string[] = [];
      const text = await allLessonText(page, mathHits);
      const hits = [...new Set((text.match(LEAK[lang]) ?? []).map((w) => w.toLowerCase()))];
      const context = hits.slice(0, 5).map((w) => text.match(new RegExp(`.{0,40}\\b${w}\\b.{0,40}`, 'i'))?.[0]);
      expect(hits, `leaked words, e.g.:\n${context.join('\n')}`).toEqual([]);
      expect([...mathHits, ...(await plainTextMath(page))], 'mathematics outside KaTeX').toEqual([]);
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
  const explorer = page.locator('.explorer:has([role=tablist])');
  await expect(explorer.locator('canvas')).toBeVisible();
  const cart = explorer.locator('.readout tr').first();
  const before = (await cart.textContent()) ?? '';
  expect(before).toContain('1,15'); // decimal comma
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await expect(cart).toHaveText(before);
  await explorer.getByRole('tab', { name: 'Kartesisch' }).click();
  await expect(cart).toHaveText(before);
  await explorer.getByLabel('z', { exact: true }).fill('-1');
  await expect(explorer.locator('.slider .val').nth(2)).toHaveText('\u22121,00'); // true minus sign
  await explorer.screenshot({ path: 'test-results/screens/explorer-cart.png' });
  await explorer.getByRole('tab', { name: 'Sphärisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-sph.png' });
  await explorer.getByRole('tab', { name: 'Zylindrisch' }).click();
  await explorer.screenshot({ path: 'test-results/screens/explorer-cyl.png' });
});


for (const topic of written) {
  test(`phone width: no horizontal page scroll ("${topic.id}")`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, 'de', `#${topic.id}`);
    await expect(page.locator('article.lesson h2').first()).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test.describe('derivation animation (x = ρ cos φ, y = ρ sin φ)', () => {
  test('autoplays when the figure scrolls into view, pauses, and the sweep reaches quadrant II', async ({ page }) => {
    const errors = trackErrors(page);
    await open(page, 'de', '#koordinaten');
    const player = page.locator('.stepper').first();
    await expect(player).toHaveAttribute('data-playing', '0');
    await player.locator('.stepper-fig').scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute('data-playing', '1');
    await expect.poll(async () => Number(await player.getAttribute('data-t'))).toBeGreaterThan(0);
    await player.getByRole('button', { name: 'Pause' }).click();
    const tPaused = await player.getAttribute('data-t');
    await page.waitForTimeout(400);
    await expect(player).toHaveAttribute('data-t', tPaused!);
    await player.getByRole('button', { name: 'Schritt 3 abspielen' }).click();
    await expect(player).toHaveAttribute('data-step', '2');
    await expect(player.locator('.stepper-steps li').nth(2)).toHaveClass(/active/);
    await expect.poll(async () => Number(await player.getAttribute('data-t')), { timeout: 20_000 }).toBeGreaterThan(0.45);
    await player.getByRole('button', { name: 'Pause' }).click();
    const phi = Number(await player.locator('.anim-fig').getAttribute('data-phi'));
    expect(phi).toBeGreaterThan(Math.PI / 2); // left quadrant I …
    expect(phi).toBeLessThan((3 * Math.PI) / 2); // … but not yet quadrant IV
    // the y-leg label keeps the y colour whatever the quadrant (it once took the ρ colour for x < 0)
    for (const el of await player.locator('.anim-label.ink-y').all()) {
      const [c, token] = await el.evaluate((n) => [getComputedStyle(n).color, getComputedStyle(n).getPropertyValue('--c-y-text')]);
      const probe = await page.evaluate((tok) => { const d = document.createElement('div'); d.style.color = tok; document.body.append(d); const c2 = getComputedStyle(d).color; d.remove(); return c2; }, token.trim());
      expect(c).toBe(probe);
    }
    expect(errors).toEqual([]);
  });

  test('"Next" during the pause between steps goes to exactly the next step (no skipped step)', async ({ page }) => {
    const errors = trackErrors(page);
    await open(page, 'de', '#koordinaten');
    const player = page.locator('.stepper').first();
    await player.locator('.stepper-fig').scrollIntoViewIfNeeded();
    await expect(player).toHaveAttribute('data-playing', '1');
    // wait for the hold after step 1: step 0 finished, still playing
    await expect.poll(async () => `${await player.getAttribute('data-step')}|${await player.getAttribute('data-t')}`, { timeout: 15_000 }).toBe('0|1.000');
    await player.getByRole('button', { name: 'Nächster Schritt' }).click();
    await expect(player).toHaveAttribute('data-step', '1');
    await page.waitForTimeout(3500); // longer than the old hold: it must not push us on to step 3
    await expect(player).toHaveAttribute('data-step', '1');
    expect(errors).toEqual([]);
  });

  for (const lang of LANGS) {
    test(`[${lang}] reduced motion: no autoplay; each step shows a final frame that matches its caption`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await open(page, lang, '#koordinaten');
      const player = page.locator('.stepper').first();
      await player.locator('.stepper-fig').scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(player).toHaveAttribute('data-playing', '0');
      // the very first frame is already step 1's final frame (it illustrates caption 1)
      await expect(player).toHaveAttribute('data-t', '1.000');
      await expect(player.locator('.anim-label[data-key="lab-Mxy0"]')).toBeVisible();
      const n = await player.locator('.step-num').count();
      expect(n).toBe(5);
      const mustShow: Record<number, string[]> = {
        0: ['lab-M', 'lab-Mxy0'], 1: ['lab-Mx', 'lab-rho', 'lab-phi'], 2: ['lab-sign-0', 'lab-sign-1', 'lab-sign-2', 'box-readout'],
        3: ['box-pyth', 'box-tan'], 4: ['box-lim0', 'box-lim90'],
      };
      for (let i = 0; i < n; i++) {
        await player.locator('.step-num').nth(i).click();
        await expect(player).toHaveAttribute('data-step', String(i));
        await expect(player).toHaveAttribute('data-t', '1.000');
        await expect(player).toHaveAttribute('data-playing', '0');
        await expect(player.locator('.tex-error')).toHaveCount(0);
        for (const key of mustShow[i]) await expect(player.locator(`.anim-label[data-key="${key}"]`), `step ${i + 1}: ${key}`).toBeVisible();
        await player.locator('.stepper-fig').screenshot({ path: `test-results/screens/anim-${lang}-step${i + 1}.png` });
      }
      // second animation: spherical coordinates
      const sph = page.locator('.stepper').nth(1);
      await sph.locator('.stepper-fig').scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await expect(sph).toHaveAttribute('data-playing', '0');
      const mustShowSph: Record<number, string[]> = {
        0: ['lab-M', 'lab-r', 'lab-theta', 'lab-Mz'], 1: ['lab-legz', 'lab-legrho', 'lab-ghost', 'box-readout'], 2: ['lab-legx', 'lab-legy', 'box-subst'],
        3: ['box-floor', 'box-vert', 'box-sum'], 4: ['box-tan', 'lab-theta'],
      };
      for (let i = 0; i < 5; i++) {
        await sph.locator('.step-num').nth(i).click();
        await expect(sph).toHaveAttribute('data-t', '1.000');
        await expect(sph.locator('.tex-error')).toHaveCount(0);
        for (const key of mustShowSph[i]) await expect(sph.locator(`.anim-label[data-key="${key}"]`), `sph step ${i + 1}: ${key}`).toBeVisible();
        await sph.locator('.stepper-fig').screenshot({ path: `test-results/screens/anim-sph-${lang}-step${i + 1}.png` });
      }
      // the square root in tan θ = √(x²+y²)/z must be drawn (a too-broad CSS rule once squashed KaTeX's root SVG)
      const rootSvg = sph.locator('.anim-label[data-key="box-tan"] .katex svg').first();
      expect((await rootSvg.boundingBox())!.height).toBeGreaterThan(8);
    });
  }
});
