/**
 * Step animation of «Incomplete Rank» (Übung 4, slides 18–20): A = (1 −2; 2 −4) squashes the plane onto a line.
 * Steps: 1 the plane before, with the two vectors of the slides · 2 where e₁ and e₂ go (both on one line) ·
 * 3 the morph: the grid collapses, (−2, −2) → (2, 4), (1, −2) → (5, 10) · 4 column reading of the first image ·
 * 5 column reading of the second image (LA-001: the slide's coefficient 3 should be 1).
 * Pure: (step, t) → the TrState of the shared transformation scene plus extra items.
 */
import { add, scale, type M2, type V2 } from '../../linalg/plane2';
import { ease } from '../../linalg/columnPicture';
import { fitView, ntex, tipLabel, type PItem, type View } from './planeItems';
import { trPoints, trScene } from './trScene';

export const COLLAPSE_A: M2 = [[1, -2], [2, -4]];
export const COLLAPSE_V: V2 = [-2, -2];
export const COLLAPSE_W: V2 = [1, -2];
export const COLLAPSE_STEPS = 5;
export const collapseView: View = fitView(trPoints(COLLAPSE_A, [COLLAPSE_V, COLLAPSE_W]), 520, 520, { margin: 0.8 });

const a1: V2 = [1, 2], a2: V2 = [-2, -4];
const u: V2 = [1 / Math.sqrt(5), 2 / Math.sqrt(5)];
const across: V2 = [u[1], -u[0]];
const lane = (p: V2, k: number): V2 => add(p, scale(across, 0.42 * k));
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));

/** Column chain x₁·a₁ (green) then x₂·a₂ (blue) on a lane beside the line, grown to fraction g. */
function chain(id: string, x: V2, k: number, g: number, lang: 'de' | 'en'): PItem[] {
  const s1 = scale(a1, x[0]), s2 = scale(a2, x[1]);
  const g1 = Math.min(1, g * 2), g2 = Math.max(0, g * 2 - 1);
  const out: PItem[] = [];
  if (g1 > 0) out.push({ k: 'arrow', id: `${id}-c1`, a: lane([0, 0], k), b: lane(scale(s1, g1), k), role: 'c1', w: 3 });
  if (g2 > 0) out.push({ k: 'arrow', id: `${id}-c2`, a: lane(s1, k), b: lane(add(s1, scale(s2, g2)), k), role: 'c2', w: 3 });
  const n = (v: number) => ntex(v, 2, lang);
  if (g1 >= 1) out.push({ k: 'label', id: `lab-${id}-c1`, at: lane(scale(s1, 0.5), k), tex: String.raw`a_1\cdot(${n(x[0])})`, role: 'c1', small: true, ...tipLabel(scale(across, k), 14), prio: 3 });
  if (g2 >= 1) out.push({ k: 'label', id: `lab-${id}-c2`, at: lane(add(s1, scale(s2, 0.5)), k), tex: String.raw`a_2\cdot(${n(x[1])})`, role: 'c2', small: true, ...tipLabel(scale(across, k), 14), prio: 3 });
  return out;
}

export function collapseScene(step: number, t: number, lang: 'de' | 'en') {
  const grow = step === 0 ? seg(t, 0, 0.8) : 1;
  const morphT = step < 2 ? 0 : step === 2 ? seg(t, 0.1, 1) : 1;
  const extra: PItem[] = [];
  if (step === 1) {
    const g = seg(t, 0, 0.6);
    extra.push({ k: 'arrow', id: 'a1-target', a: [0, 0], b: scale(a1, g), role: 'c1', w: 2.4, o: 0.6, dashed: true });
    extra.push({ k: 'arrow', id: 'a2-target', a: [0, 0], b: scale(a2, g), role: 'c2', w: 2.4, o: 0.6, dashed: true });
    if (t >= 0.6) {
      extra.push({ k: 'line', id: 'target-line', p: [0, 0], dir: u, role: 'aux', dashed: true, w: 2, o: seg(t, 0.6, 0.9) });
      extra.push({ k: 'label', id: 'lab-a1-target', at: a1, tex: String.raw`a_1 = (1, 2)^T`.replace(', ', lang === 'de' ? ';\\ ' : ',\\ '), role: 'c1', small: true, ...tipLabel([1, -0.3], 10), prio: 1 });
      extra.push({ k: 'label', id: 'lab-a2-target', at: a2, tex: String.raw`a_2 = (-2, -4)^T`.replace(', ', lang === 'de' ? ';\\ ' : ',\\ '), role: 'c2', small: true, ...tipLabel([1, 0.2], 10), prio: 1 });
    }
  }
  if (step === 3) extra.push(...chain('v', COLLAPSE_V, -1, seg(t, 0, 1), lang));
  if (step === 4) extra.push(...chain('w', COLLAPSE_W, 1, seg(t, 0, 1), lang));
  const sc = trScene({
    A: COLLAPSE_A, t: morphT, lang, extra,
    inputs: [
      { id: 'v', p: scale(COLLAPSE_V, grow), role: 'tgt', label: grow >= 1 ? 'v' : undefined, imgLabel: 'Av', value: true, ghost: true, w: 3.2 },
      { id: 'w', p: scale(COLLAPSE_W, grow), role: 'c3', label: grow >= 1 ? 'w' : undefined, imgLabel: 'Aw', value: true, ghost: true, w: 3.2 },
    ],
  }, collapseView);
  return { ...sc, view: collapseView, t: morphT };
}
