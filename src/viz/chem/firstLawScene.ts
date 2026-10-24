/**
 * Pure scene of the first-law explorer: a piston–cylinder (left) and the energy «ledger» (right).
 * The student adds heat q (red, through the bottom wall) and work w (amber, pushing the piston); the ledger shows
 * E_initial → +q → +w → E_final = E_initial + q + w (ΔE = q + w, slide 12).
 * Coordinates: figure 560 × 300, SVG (y down). The particles are drawn by the component from the gas simulation.
 */
import type { Lang } from '../../i18n';
import { cbuilder, type CScene } from './cscene';

export const FL = { W: 560, H: 300, E0: 20, kJ: 5, base: 250, cylX0: 40, cylX1: 200, cylTop: 34, pistonRest: 104, kPiston: 4.2, ledX0: 282, col: 66 } as const;

/** Piston height for a given work: w > 0 (work done ON the gas) pushes the piston in, w < 0 lets it out. */
export const pistonTarget = (w: number) => Math.min(150, Math.max(64, FL.pistonRest + FL.kPiston * w));
const f = (x: number, lang: Lang, d = 1) => (Math.abs(x) < 0.05 ? (0).toFixed(d) : x.toFixed(d)).replace('.', lang === 'de' ? '{,}' : '.');
const sg = (x: number, lang: Lang) => (x > 0.04 ? '+' : x < -0.04 ? '-' : '') + f(Math.abs(x), lang);
const mk = (x: number, lang: Lang) => (x > 0.04 ? '+' : x < -0.04 ? '\\!-\\!' : '') + f(Math.abs(x), lang);

/** `pistonY` is the current (possibly still moving) piston height. */
export function firstLawScene(q: number, w: number, pistonY: number, lang: Lang): CScene {
  const { W, H, E0, kJ, base, cylX0, cylX1, cylTop, ledX0, col } = FL;
  const b = cbuilder(W, H);
  const cx = (cylX0 + cylX1) / 2;
  // cylinder, gas, piston
  b.rect('gas', 'th-gas', cylX0, pistonY, cylX1 - cylX0, base - pistonY);
  b.shape('walls', 'polyline', 'th-wall', [[cylX0, cylTop], [cylX0, base], [cylX1, base], [cylX1, cylTop]]);
  b.line('rod', 'th-wall', [cx, pistonY], [cx, cylTop - 12]);
  b.line('handle', 'th-wall', [cx - 26, cylTop - 12], [cx + 26, cylTop - 12]);
  b.rect('piston', 'th-piston', cylX0 + 2, pistonY - 9, cylX1 - cylX0 - 4, 9, 1, 2);
  // heat q through the bottom wall (red)
  const hq = Math.abs(q), hl = Math.min(26, 6 + hq * 2.2);
  if (hq > 0.04) for (const x of [cylX0 + 34, cx, cylX1 - 34]) {
    if (q > 0) b.arrow(`q-${x}`, 'th-a-t th-flow', [x, base + 4 + hl + 12], [x, base + 6], 1, 9);
    else b.arrow(`q-${x}`, 'th-a-t th-flow', [x, base + 6], [x, base + 4 + hl + 12], 1, 9);
  }
  // work w on the piston (amber), beside the rod
  const wl = Math.min(40, 8 + Math.abs(w) * 3.2);
  if (Math.abs(w) > 0.04) for (const x of [cylX0 + 36, cylX1 - 36]) {
    const top = pistonY - 12 - wl - 4;
    if (w > 0) b.arrow(`w-${x}`, 'th-a-e', [x, top], [x, pistonY - 12], 1, 9);
    else b.arrow(`w-${x}`, 'th-a-e', [x, pistonY - 12], [x, top], 1, 9);
  }
  b.label('lab-gas', [cx, base - 14], String.raw`\text{System}`, 'muted', 1, 'c', { small: true });
  b.label('lab-surr', [cylX0 - 8, cylTop + 6], lang === 'de' ? String.raw`\text{Umgebung}` : String.raw`\text{surroundings}`, 'muted', 1, 'tl', { small: true });
  if (hq > 0.04) b.label('lab-q', [cylX1 + 10, base + 28], q > 0 ? String.raw`q>0` : String.raw`q<0`, 't', 1, 'l');
  if (Math.abs(w) > 0.04) b.label('lab-w', [cylX1 + 10, pistonY - 30], w > 0 ? String.raw`w>0` : String.raw`w<0`, 'e', 1, 'l');

  // ledger: E_initial, +q, +w, E_final
  const y = (E: number) => base - E * kJ;
  const E1 = E0 + q, E2 = E0 + q + w;
  const x = (i: number) => ledX0 + i * col;
  const bw = col * 0.62;
  const bar = (key: string, i: number, Ea: number, Eb: number, cls: string) => {
    const top = Math.min(y(Ea), y(Eb)), hgt = Math.abs(y(Ea) - y(Eb));
    b.rect(key, cls, x(i), top, bw, Math.max(hgt, 1.5));
  };
  b.line('ground', 'th-axis', [ledX0 - 14, base], [ledX0 + 4 * col - 6, base]);
  bar('bar-E0', 0, 0, E0, 'th-f');
  bar('bar-q', 1, E0, E1, 'th-f-t');
  bar('bar-w', 2, E1, E2, 'th-f-e');
  bar('bar-E1', 3, 0, Math.max(E2, 0), 'th-f');
  // dashed level lines connecting the bars
  b.line('lv-0', 'th-l-dash', [x(0) + bw, y(E0)], [x(1), y(E0)]);
  b.line('lv-1', 'th-l-dash', [x(1) + bw, y(E1)], [x(2), y(E1)]);
  b.line('lv-2', 'th-l-dash', [x(2) + bw, y(E2)], [x(3), y(E2)]);
  const cxs = (i: number) => x(i) + bw / 2;
  b.label('c-E0', [cxs(0), base + 16], String.raw`E_\mathrm{initial}`, 'fg', 1, 'c', { small: true });
  b.label('c-q', [cxs(1), base + 16], 'q', 't', 1, 'c');
  b.label('c-w', [cxs(2), base + 16], 'w', 'e', 1, 'c');
  b.label('c-E1', [cxs(3), base + 16], String.raw`E_\mathrm{final}`, 'fg', 1, 'c', { small: true });
  // values above the bars
  b.label('v-E0', [cxs(0), y(E0) - 11], `${f(E0, lang, 0)}`, 'muted', 1, 'c', { small: true });
  if (Math.abs(q) > 0.04) b.label('v-q', [cxs(1), Math.min(y(E0), y(E1)) - 11], mk(q, lang), 't', 1, 'c', { small: true });
  if (Math.abs(w) > 0.04) b.label('v-w', [cxs(2), Math.min(y(E1), y(E2)) - 11], mk(w, lang), 'e', 1, 'c', { small: true });
  b.label('v-E1', [cxs(3), y(Math.max(E2, 0)) - 11], f(E2, lang), 'fg', 1, 'c', { small: true });
  b.label('unit', [W - 8, 16], String.raw`\text{kJ}`, 'muted', 1, 'tr', { small: true });
  return b.finish({ q, w, dE: q + w, E1, E2, pistonY });
}
export { sg };
