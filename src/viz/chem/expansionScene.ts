/**
 * Slide 11: isothermal expansion of an ideal gas. 400 × 260, horizontal cylinder, gas to the right of the piston/partition.
 * 'vac'  – partition removed, the gas rushes into the vacuum (irreversible); afterwards the surroundings must push it back (w > 0).
 * 'rev'  – the external pressure is P − δP (gas expands slowly) or P + δP (gas is compressed): the process can be reversed at any time.
 */
import type { Lang } from '../../i18n';
import { cbuilder, type CScene } from './cscene';

export type ExpMode = 'vac' | 'rev';
export type ExpPhase = 'closed' | 'open' | 'push';
export const EX = { W: 400, H: 260, X0: 44, X1: 356, Y0: 70, Y1: 190 } as const;
export const exX = (x: number) => EX.X0 + x * (EX.X1 - EX.X0);
export const exY = (y: number) => EX.Y0 + 8 + y * (EX.Y1 - EX.Y0 - 16);

export interface ExpState { mode: ExpMode; phase: ExpPhase; x0: number; dir: -1 | 0 | 1 }

export function expansionScene(s: ExpState, lang: Lang): CScene {
  const b = cbuilder(EX.W, EX.H);
  const de = lang === 'de';
  const { mode, phase, x0, dir } = s;
  const partition = mode === 'vac' && phase === 'closed';
  const pistonMoving = (mode === 'vac' && phase === 'push') || (mode === 'rev' && dir !== 0);
  const xl = mode === 'rev' || phase === 'push' ? x0 : 0; // left wall = piston
  b.rect('gas', 'th-gas', exX(partition ? 0.5 : xl), EX.Y0, exX(1) - exX(partition ? 0.5 : xl), EX.Y1 - EX.Y0);
  b.shape('walls', 'polyline', 'th-wall', [[EX.X0 - 4, EX.Y0], [EX.X1 + 2, EX.Y0], [EX.X1 + 2, EX.Y1], [EX.X0 - 4, EX.Y1]]);
  // piston (left wall)
  const px = exX(xl);
  b.rect('piston', 'th-piston', px - 10, EX.Y0 + 2, 10, EX.Y1 - EX.Y0 - 4, 1, 2);
  b.line('rod', 'th-wall', [px - 10, (EX.Y0 + EX.Y1) / 2], [14, (EX.Y0 + EX.Y1) / 2]);
  if (partition) { b.line('partition', 'th-a-p', [exX(0.5), EX.Y0], [exX(0.5), EX.Y1]); b.label('lab-vac', [exX(0.25), (EX.Y0 + EX.Y1) / 2], de ? String.raw`\text{Vakuum}` : String.raw`\text{vacuum}`, 'muted', 1, 'c'); }
  if (mode === 'vac' && phase === 'open') b.line('partition-gone', 'th-l-dash', [exX(0.5), EX.Y0], [exX(0.5), EX.Y1], 0.5);
  // external pressure (blue) and work (amber)
  if (mode === 'rev') {
    const len = dir === 0 ? 30 : dir < 0 ? 18 : 44;
    b.arrow('Pext', 'th-a-p', [Math.max(10, px - 12 - len), EX.Y0 - 20], [px - 12, EX.Y0 - 20], 1, 9);
    b.label('lab-P', [px - 12 - len / 2, EX.Y0 - 36], dir === 0 ? 'P' : dir < 0 ? String.raw`P - \delta P` : String.raw`P + \delta P`, 'p', 1, 'c');
  }
  if (dir !== 0 && mode === 'rev') {
    if (dir < 0) { b.arrow('work', 'th-a-e', [px - 6, EX.Y1 + 24], [px - 44, EX.Y1 + 24], 1, 9); b.label('lab-w', [px - 20, EX.Y1 + 42], String.raw`w<0`, 'e', 1, 'c'); }
    else { b.arrow('work', 'th-a-e', [px - 44, EX.Y1 + 24], [px - 6, EX.Y1 + 24], 1, 9); b.label('lab-w', [px - 20, EX.Y1 + 42], String.raw`w>0`, 'e', 1, 'c'); }
  }
  if (mode === 'vac' && phase === 'open') b.label('lab-w', [exX(0.5), EX.Y1 + 30], String.raw`w = 0`, 'e', 1, 'c');
  if (mode === 'vac' && phase === 'push' && pistonMoving) { b.arrow('work', 'th-a-e', [px - 50, EX.Y1 + 24], [px - 8, EX.Y1 + 24], 1, 9); b.label('lab-w', [px - 24, EX.Y1 + 42], String.raw`w>0`, 'e', 1, 'c'); }
  return b.finish({ x0: xl, partition: partition ? 1 : 0 });
}
