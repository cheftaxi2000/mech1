import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    try { localStorage.setItem('mech1.lang', 'de'); } catch { /* ignore */ }
    const w = window as unknown as { __raf: number };
    w.__raf = 0;
    const orig = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb: FrameRequestCallback) => orig((t) => { w.__raf++; cb(t); });
  });
});

const frames = async (page: import('@playwright/test').Page, ms: number) => {
  const a = await page.evaluate(() => (window as unknown as { __raf: number }).__raf);
  await page.waitForTimeout(ms);
  return (await page.evaluate(() => (window as unknown as { __raf: number }).__raf)) - a;
};

// A «Play» loop that was left running must stop while its figure is scrolled out of view (battery on the iPad)
// and continue when the figure comes back.
for (const c of [
  { id: 'rollen', fig: 'figure.vdemo:has(.slider)', play: /abspielen/i },
  { id: 'ebene-bewegung', fig: '.polode', play: /rutschen/ },
  { id: 'kreisbewegung', fig: '.cc-fig', play: /Abspielen/ },
  { id: 'ana-komplex', fig: '.eu-fig', play: /Abspielen/ },
]) {
  test(`play loop of ${c.id} stops off screen and resumes`, async ({ page }) => {
    await page.setViewportSize({ width: 1180, height: 820 });
    await page.goto(`/#${c.id}`);
    const fig = page.locator(c.fig).first();
    await fig.scrollIntoViewIfNeeded();
    if (c.id === 'ebene-bewegung') await fig.locator('input[type=range]').first().fill('78'); // the longest slide, so it is still running afterwards
    await fig.getByRole('button', { name: c.play }).first().click();
    expect(await frames(page, 450)).toBeGreaterThan(8);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300); // let the IntersectionObserver report
    const away = await frames(page, 450);
    await fig.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const back = await frames(page, 450);
    expect(away).toBeLessThan(6);
    expect(back).toBeGreaterThan(8);
  });
}
