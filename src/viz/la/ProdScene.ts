/**
 * «Composing Transformations» (visualisation of Übung 5 by the TA, ported): the plane is deformed first by B, then by A,
 * then by C = AB in one go, then in the other order (A first, then B). Pure scene; the figure draws only what is computed here.
 * Matrices are row-wise [[a11, a12], [a21, a22]].
 */
import { apply, col, interp, mm, type M2, type V2 } from '../../linalg/plane2';

const R45 = Math.SQRT1_2;
/** B acts first, A second (the product AB is read right to left) — the presets of the visualisation. */
export const COMP_PRESETS: { de: string; en: string; B: M2; A: M2 }[] = [
  { de: 'Scherung → Drehung', en: 'Shear → Rotation', B: [[1, 1], [0, 1]], A: [[0, -1], [1, 0]] },
  { de: 'Drehung → Scherung', en: 'Rotation → Shear', B: [[0, -1], [1, 0]], A: [[1, 1], [0, 1]] },
  { de: 'Stauchung → Drehung', en: 'Squash → Rotation', B: [[1.5, 0], [0, 0.5]], A: [[0, -1], [1, 0]] },
  { de: 'Spiegelung → Spiegelung', en: 'Flip → Flip', B: [[-1, 0], [0, 1]], A: [[1, 0], [0, -1]] },
  { de: '45° → 45°', en: '45° → 45°', B: [[R45, -R45], [R45, R45]], A: [[R45, -R45], [R45, R45]] },
  { de: 'Scherung → zurück', en: 'Shear → Undo', B: [[1, 1], [0, 1]], A: [[1, -1], [0, 1]] },
  { de: 'Folien-Beispiel', en: 'Slide example', B: [[1, -2], [1, 0]], A: [[0, 2], [1, 0]] },
];

export type Seq = 'AB' | 'C' | 'BA';
/** The story: 1 start · 2 B · 3 then A · 4 C = AB in one go · 5 A first · 6 then B. u ∈ [0, 2] counts the factors applied. */
export const COMP_STEPS: { seq: Seq; from: number; to: number }[] = [
  { seq: 'AB', from: 0, to: 0 }, { seq: 'AB', from: 0, to: 1 }, { seq: 'AB', from: 1, to: 2 },
  { seq: 'C', from: 0, to: 1 }, { seq: 'BA', from: 0, to: 1 }, { seq: 'BA', from: 1, to: 2 },
];

/** The thing being transformed: a letter F (its orientation shows mirror images), inside [0, 1.5] × [0, 2.5]. */
export const SHAPE_F: V2[] = [[0, 0], [0.5, 0], [0.5, 1.1], [1.1, 1.1], [1.1, 1.55], [0.5, 1.55], [0.5, 2], [1.5, 2], [1.5, 2.5], [0, 2.5]];
/** The marked point x on the F (lower edge of the top bar). */
export const X_PT: V2 = [1, 2];

/** First / second factor and the product of a sequence. */
export function pair(A: M2, B: M2, seq: Seq) {
  return seq === 'BA' ? { F1: A, F2: B, P: mm(B, A) } : { F1: B, F2: A, P: mm(A, B) };
}

/** The plane's matrix: u ∈ [0, 1] applies the first factor, u ∈ [1, 2] puts the second on top; seq C goes straight to AB. */
export function curM(A: M2, B: M2, seq: Seq, u: number): M2 {
  const p = pair(A, B, seq);
  if (seq === 'C') return interp(p.P, Math.max(0, Math.min(1, u)));
  if (u <= 1) return interp(p.F1, Math.max(0, u));
  return mm(interp(p.F2, Math.min(1, u - 1)), p.F1);
}

const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export interface Ghost { v: V2; role: 'c1' | 'c2'; label: string }
export interface CompFrame {
  seq: Seq; u: number;
  /** the plane's current matrix */
  M: M2;
  /** opacity of the moving plane (a new sequence fades in from the start) */
  fade: number;
  /** labels of the moving images of e₁, e₂ */
  names: [string, string];
  /** where e₁, e₂ are going in this step (pale arrows) */
  ghosts: Ghost[];
  /** dashed grey outline: the F after the first factor (steps 3 and 6) */
  first: M2 | null;
  /** dashed purple outline: where «B, then A» ended (steps 4–6) */
  outlineAB: boolean;
  /** whether the product of this sequence is already known (the panel shows its entries) */
  productShown: boolean;
}

const FADE = 0.15;

export function compFrame(A: M2, B: M2, step: number, t: number): CompFrame {
  const st = COMP_STEPS[Math.max(0, Math.min(COMP_STEPS.length - 1, step))];
  const fresh = step === 3 || step === 4; // a new sequence starts from the plain plane
  const fade = fresh ? Math.min(1, t / FADE) : 1;
  const m = fresh ? Math.max(0, (t - FADE) / (1 - FADE)) : t;
  const u = st.from + (st.to - st.from) * ease(Math.max(0, Math.min(1, m)));
  const M = curM(A, B, st.seq, u);
  const P = pair(A, B, st.seq).P;
  const first = st.seq === 'BA' ? 'a' : 'b', prod = st.seq === 'BA' ? 'd' : 'c';
  let names: [string, string];
  if (st.seq === 'C') names = u < 0.5 ? ['e_1', 'e_2'] : ['c_1', 'c_2'];
  else if (u < 0.5) names = ['e_1', 'e_2'];
  else if (u < 1.5) names = [`${first}_1`, `${first}_2`];
  else names = [`${prod}_1`, `${prod}_2`];
  const target: M2 | null = step === 0 ? null : step === 1 ? B : step === 4 ? A : P;
  const tn = step === 1 ? 'b' : step === 4 ? 'a' : prod;
  const ghosts: Ghost[] = target ? [{ v: col(target, 0), role: 'c1', label: `${tn}_1` }, { v: col(target, 1), role: 'c2', label: `${tn}_2` }] : [];
  const productShown = st.seq === 'C' || (step === 2 && t >= 1) || (step === 5 && t >= 1) || (st.seq === 'AB' && step > 2);
  return { seq: st.seq, u, M, fade, names, ghosts, first: step === 2 ? B : step === 5 ? A : null, outlineAB: step >= 3, productShown };
}

/** Half width of a square window that shows the F and e₁, e₂ at every stage (I, B, AB, A, BA). */
export function compWindow(A: M2, B: M2): number {
  const pts: V2[] = [[1, 0], [0, 1], [-1, -1]];
  for (const N of [[[1, 0], [0, 1]] as M2, B, mm(A, B), A, mm(B, A)]) {
    for (const c of SHAPE_F) pts.push(apply(N, c));
    pts.push(col(N, 0), col(N, 1));
  }
  const m = Math.max(...pts.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))));
  return Math.max(3, Math.ceil(m + 0.5));
}

/**
 * A tight window [x0, x1] × [y0, y1] (integers, origin inside) around the F and e₁, e₂ at every stage, plus the viewBox
 * height for a width of 400 so that one unit is equally long on both axes (aspect between 0.7 and 1.3; the shorter side is widened).
 */
export function compBox(A: M2, B: M2): { x: [number, number]; y: [number, number]; h: number } {
  const pts: V2[] = [[0, 0], [1, 0], [0, 1]];
  for (const N of [[[1, 0], [0, 1]] as M2, B, mm(A, B), A, mm(B, A)]) {
    for (const c of SHAPE_F) pts.push(apply(N, c));
    pts.push(col(N, 0), col(N, 1));
  }
  let x0 = Math.floor(Math.min(...pts.map((p) => p[0])) - 0.6), x1 = Math.ceil(Math.max(...pts.map((p) => p[0])) + 0.6);
  let y0 = Math.floor(Math.min(...pts.map((p) => p[1])) - 0.6), y1 = Math.ceil(Math.max(...pts.map((p) => p[1])) + 0.6);
  const grow = (a: number, b: number, want: number): [number, number] => { const d = Math.ceil((want - (b - a)) / 2); return [a - d, b + d]; };
  if ((y1 - y0) / (x1 - x0) > 1.3) [x0, x1] = grow(x0, x1, (y1 - y0) / 1.3);
  if ((y1 - y0) / (x1 - x0) < 0.7) [y0, y1] = grow(y0, y1, 0.7 * (x1 - x0));
  const pad = 14, k = (400 - 2 * pad) / (x1 - x0);
  return { x: [x0, x1], y: [y0, y1], h: Math.round(2 * pad + k * (y1 - y0)) };
}

/** (AB)x = A(Bx) for the marked point (and the other order). */
export function chain(A: M2, B: M2, x: V2 = X_PT) {
  const Bx = apply(B, x), ABx = apply(A, Bx), Ax = apply(A, x), BAx = apply(B, Ax);
  return { Bx, ABx, Cx: apply(mm(A, B), x), Ax, BAx, Dx: apply(mm(B, A), x) };
}
