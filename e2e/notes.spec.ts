import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { try { localStorage.setItem('mech1.lang', 'de'); } catch { /* ignore */ } });
});

for (const [w, h, name] of [[1180, 820, 'ipad'], [390, 844, 'phone']] as const) {
  test(`sticky notes: pin, write, recolour, move, fold, list, persist, delete (${name})`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/#koordinaten');
    await page.locator('article.lesson h2').first().waitFor();
    const sec = page.locator('section#cartesian');
    await sec.scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Notiz anheften' }).click();
    await expect(page.getByText('Tippe dorthin, wo die Notiz hin soll')).toBeVisible();
    await page.screenshot({ path: `test-results/screens/notes-placing-${name}.png` });
    const box = (await sec.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.55, Math.max(box.y, 0) + h * 0.4);
    const note = page.locator('.sticky').first();
    await expect(note).toBeVisible();
    await expect(note.getByRole('textbox', { name: 'Titel der Notiz' })).toBeFocused();
    await page.keyboard.type('Winkel');
    await page.keyboard.press('Enter');
    await expect(note.locator('textarea')).toBeFocused();
    await page.keyboard.type('Merke: phi immer von +x aus messen!');
    await note.getByRole('button', { name: 'Rosa' }).click();
    await expect(note).toHaveClass(/c-pink/);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `test-results/screens/notes-note-${name}.png` });
    // move by dragging the tape
    const nb = (await note.boundingBox())!;
    await page.mouse.move(nb.x + nb.width / 2, nb.y + 6);
    await page.mouse.down();
    await page.mouse.move(nb.x + nb.width / 2 - 40, nb.y + 68, { steps: 5 });
    await page.mouse.up();
    const nb2 = (await note.boundingBox())!;
    expect(nb2.y).toBeGreaterThan(nb.y + 30);
    // persists across reload (local backend outside claude.ai)
    await page.reload();
    await page.locator('article.lesson h2').first().waitFor();
    const again = page.locator('.sticky').first();
    await expect(again.locator('textarea')).toHaveValue('Merke: phi immer von +x aus messen!');
    await expect(again.getByRole('textbox', { name: 'Titel der Notiz' })).toHaveValue('Winkel');
    // fold and unfold
    await again.hover();
    await again.getByRole('button', { name: 'Zusammenklappen' }).click();
    await expect(page.locator('.sticky.folded')).toBeVisible();
    await expect(page.locator('.sticky.folded')).toContainText('Winkel');
    await page.screenshot({ path: `test-results/screens/notes-folded-${name}.png` });
    await page.locator('.sticky.folded').getByRole('button').click();
    await expect(page.locator('.sticky textarea')).toBeVisible();
    // listed in the menu
    await page.getByRole('button', { name: 'Kapitel' }).click();
    await expect(page.locator('#chapters')).toContainText('Winkel');
    await expect(page.locator('#chapters')).toContainText('Merke: phi immer');
    await page.screenshot({ path: `test-results/screens/notes-list-${name}.png` });
    await page.keyboard.press('Escape');
    // delete with undo, then delete for good
    await page.locator('.sticky').first().hover();
    await page.locator('.sticky').first().getByRole('button', { name: 'Löschen' }).click();
    await expect(page.locator('.sticky')).toHaveCount(0);
    await page.getByRole('button', { name: 'Rückgängig' }).click();
    await expect(page.locator('.sticky')).toHaveCount(1);
    await page.locator('.sticky').first().hover();
    await page.locator('.sticky').first().getByRole('button', { name: 'Löschen' }).click();
    await expect(page.locator('.sticky')).toHaveCount(0);
    // an empty note disappears when left
    await page.getByRole('button', { name: 'Notiz anheften' }).click();
    await page.mouse.click(box.x + 60, Math.min(h - 120, 300));
    await expect(page.locator('.sticky')).toHaveCount(1);
    await page.waitForTimeout(700);
    await page.locator('.topbar .burger').focus();
    await expect(page.locator('.sticky')).toHaveCount(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}
