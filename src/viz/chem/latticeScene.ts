/**
 * Slides 11, 17–19, 21: microstates and Boltzmann's S = k_B ln W. 520 × 300.
 * Two chambers of 10 sites each (2 rows × 5 columns), N particles, at most one per site. Closed partition: all particles in the
 * left chamber, W = C(10, N). Open: anywhere, W = C(20, N). Below: the macrostate «k particles on the left» can be realised in
 * W(k) = C(10, k)·C(10, N−k) ways (bars, exact); dots = how often the random microstates shown so far had k on the left.
 */
import type { Lang } from '../../i18n';
import { macrostateW } from '../../chem/entropy';
import { cbuilder, type CScene } from './cscene';

export const LS = { W: 520, H: 300, M: 10, cell: 30, x0: 20, y0: 44, hx0: 28, hx1: 500, hy0: 246, hmax: 76 } as const;
/** Centre of lattice site c (0–9 left chamber, 10–19 right chamber). */
export function siteCenter(c: number): [number, number] {
  const half = c < LS.M ? 0 : 1, local = c % LS.M;
  return [LS.x0 + (half * 5 + (local % 5) + 0.5) * LS.cell, LS.y0 + (Math.floor(local / 5) + 0.5) * LS.cell];
}
export const countLeft = (config: readonly number[]) => config.filter((c) => c < LS.M).length;

export function latticeScene(N: number, open: boolean, config: readonly number[], counts: readonly number[], lang: Lang): CScene {
  const b = cbuilder(LS.W, LS.H);
  const de = lang === 'de';
  const { cell, x0, y0, M } = LS;
  for (let c = 0; c < 2 * M; c++) { const [cx, cy] = siteCenter(c); b.rect(`cell${c}`, !open && c >= M ? 'th-cell th-ghost' : 'th-cell', cx - cell / 2 + 1, cy - cell / 2 + 1, cell - 2, cell - 2, 1, 4); }
  config.forEach((c, i) => b.circle(`p${i}`, 'th-atom-n', siteCenter(c), 10));
  const px = x0 + 5 * cell;
  b.line('partition', open ? 'th-wall-dash' : 'th-wall', [px, y0 - 8], [px, y0 + 2 * cell + 8]);
  b.shape('box', 'polyline', 'th-wall-thin', [[x0, y0 - 8], [x0 + 10 * cell, y0 - 8], [x0 + 10 * cell, y0 + 2 * cell + 8], [x0, y0 + 2 * cell + 8], [x0, y0 - 8]]);
  b.label('lab-left', [x0 + 2.5 * cell, y0 - 22], de ? String.raw`\text{links}` : String.raw`\text{left}`, 'muted', 1, 'c', { small: true });
  b.label('lab-right', [x0 + 7.5 * cell, y0 - 22], de ? String.raw`\text{rechts}` : String.raw`\text{right}`, 'muted', 1, 'c', { small: true });
  const kNow = countLeft(config);
  b.label('lab-k', [x0 + 10 * cell + 14, y0 + cell], String.raw`k = ${kNow}`, 'n', 1, 'l');
  // histogram of macrostates
  const w = macrostateW(M, N), wmax = Math.max(...w), total = counts.reduce((s, v) => s + v, 0);
  const slot = (LS.hx1 - LS.hx0) / (N + 1), bw = Math.min(34, slot * 0.7);
  const hx = (k: number) => LS.hx0 + slot * (k + 0.5);
  b.line('h-axis', 'th-axis', [LS.hx0 - 6, LS.hy0], [LS.hx1 + 4, LS.hy0]);
  w.forEach((v, k) => {
    const wk = open ? v : k === N ? binomLeft(N) : 0;
    const h = wk > 0 ? Math.max(2, (wk / wmax) * LS.hmax) : 0;
    if (h > 0) b.rect(`h${k}`, k === kNow ? 'th-f-n th-now' : 'th-f', hx(k) - bw / 2, LS.hy0 - h, bw, h, 1, 2);
    b.label(`hk${k}`, [hx(k), LS.hy0 + 13], String(k), k === kNow ? 'n' : 'muted', 1, 'c', { small: true });
  });
  if (open && total > 0) {
    const pmax = wmax / w.reduce((s, v) => s + v, 0);
    counts.forEach((cnt, k) => { if (cnt > 0) b.circle(`d${k}`, 'th-s-fg', [hx(k), LS.hy0 - Math.min(LS.hmax + 8, (cnt / total / pmax) * LS.hmax)], 3.4); });
  }
  b.label('h-title', [LS.hx0 - 4, LS.hy0 - LS.hmax - 22], de ? String.raw`W(k) = \binom{10}{k}\binom{10}{N-k}` : String.raw`W(k) = \binom{10}{k}\binom{10}{N-k}`, 'fg', 1, 'l', { small: true });
  b.label('h-x', [LS.hx1 + 4, LS.hy0 + 46], de ? String.raw`k = \text{Teilchen links}` : String.raw`k = \text{particles on the left}`, 'muted', 1, 'br', { small: true });
  return b.finish({ N, open: open ? 1 : 0, k: kNow, wmax, total });
}
const binomLeft = (N: number) => macrostateW(LS.M, N)[N]; // W(N) = C(10, N)·C(10, 0)
