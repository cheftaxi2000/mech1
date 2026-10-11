import { test } from '@playwright/test';

// Review aid (opt-in): renders sticky notes in every colour and state for a design review.
test.skip(!process.env.REVIEW_FRAMES, 'set REVIEW_FRAMES=1 to capture');

test('[review] sticky note gallery', async ({ page }) => {
  for (const [w, h, name, scheme] of [[1180, 820, 'ipad', 'light'], [1180, 820, 'ipad-dark', 'dark'], [390, 844, 'phone', 'light']] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.setViewportSize({ width: w, height: h });
    await page.addInitScript(() => {
      localStorage.setItem('mech1.lang', 'de');
      const now = Date.parse('2026-10-11T10:00:00Z');
      const mk = (id: string, fx: number, fy: number, color: string, title: string, text: string, folded = false) =>
        [id, { kind: 'note', topic: 'koordinaten', section: 'cartesian', fx, fy, color, title, text, folded, createdAt: now, updatedAt: now }];
      localStorage.setItem('mech1.notes', JSON.stringify(Object.fromEntries([
        mk('g1', 0.02, 0.05, 'yellow', 'Winkel φ', 'Immer von der positiven x-Achse aus messen, im Gegenuhrzeigersinn.'),
        mk('g2', 0.36, 0.05, 'pink', 'Prüfung', 'Vorzeichen von x in Quadrant II beachten!'),
        mk('g3', 0.70, 0.05, 'green', '', 'Nur Text, ohne Titel.'),
        mk('g4', 0.02, 0.45, 'blue', 'Frage an Assistenz', 'Warum ist φ auf der z-Achse nicht definiert?'),
        mk('g5', 0.40, 0.5, 'yellow', 'Zusammengeklappt', 'versteckt', true),
      ])));
    });
    await page.goto('/#koordinaten');
    await page.locator('article.lesson h2').first().waitFor();
    await page.locator('section#cartesian').scrollIntoViewIfNeeded();
    await page.locator('[data-note="g1"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `test-results/screens/notes-gallery-${name}.png` });
    if (name === 'phone') continue;
    await page.locator('[data-note="g2"]').hover();
    await page.waitForTimeout(300);
    await page.locator('[data-note="g2"]').screenshot({ path: `test-results/screens/notes-hover-${name}.png` });
  }
});
