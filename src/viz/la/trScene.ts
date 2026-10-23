/**
 * Pure scene of «the matrix as a transformation of the plane» (Übung 4, slides 14–21; TA visualisation
 * «Matrix as a Transformation»): the unit grid, e₁ / e₂ and their images, input vectors x and their images,
 * all at the fraction t of the morph from the identity to A. Used by the explorer, the collapse animation and
 * the three small pictures of slide 21.
 */
import { add, analyze, apply, interp, norm, scale, sub, type M2, type V2 } from '../../linalg/plane2';
import { findInput, morphPoints, type FindResult } from '../../linalg/transform';
import { ntex, placeLabels, sideLabel, tipLabel, type Handle, type PItem, type PRole, type View } from './planeItems';

export interface TrInput {
  id: string; p: V2; role: PRole;
  /** label of the input before (t = 0) and of its image after (t = 1) */
  label?: string; imgLabel?: string;
  /** draw the column reading x₁·(image of e₁) + x₂·(image of e₂) as a two-step chain */
  stair?: boolean;
  /** keep a pale copy of the input where it started */
  ghost?: boolean;
  /** label the image with its coordinates */
  value?: boolean;
  w?: number;
}

export interface TrState {
  A: M2; t: number;
  inputs: TrInput[];
  /** «find the input» target */
  b?: V2;
  /** draggable tips: a₁, a₂ (the images of e₁, e₂) and the given input ids / 'b' */
  drag?: string[];
  /** show the labels e₁ → a₁ */
  basisLabels?: boolean;
  lang: 'de' | 'en';
}

const O: V2 = [0, 0];
const col = (A: M2, j: 0 | 1): V2 => [A[0][j], A[1][j]];
const tup = (v: V2, lang: 'de' | 'en') => String.raw`(${ntex(v[0], 2, lang)}${lang === 'de' ? ';\ ' : ',\ '}${ntex(v[1], 2, lang)})^T`;

export function trScene(s: TrState, view: View): { items: PItem[]; handles: Handle[] } {
  const { A, t, lang } = s;
  const Mt = interp(A, t);
  const T = (p: V2) => apply(Mt, p);
  const items: PItem[] = [];
  const done = t >= 0.999, start = t <= 0.001;
  const an = analyze(A, s.b ?? [0, 0]);

  // the grid that moves with the plane (the background grid stays as the "before")
  items.push({ k: 'warp', id: 'warp', M: Mt, role: 'aux', o: 0.55, n: 16 });

  // rank 1 at the end: the whole plane lies on one line; rank 0: on the origin
  if (done && an.r === 1) {
    items.push({ k: 'line', id: 'image-line', p: O, dir: an.u!, role: 'aux', dashed: true, w: 2.4 });
  }
  if (done && an.r === 0) items.push({ k: 'dot', id: 'image-point', at: O, role: 'aux', open: true, r: 16, o: 0.8 });

  // find mode: the target, and for rank 1 the whole line of inputs that lands on b
  let find: FindResult | null = null;
  if (s.b) {
    find = findInput(A, s.b);
    if (find.kind === 'line') {
      const L = 40, f = find;
      items.push({ k: 'seg', id: 'sol-line', a: T(add(f.x, scale(f.dir, -L))), b: T(add(f.x, scale(f.dir, L))), role: 'miss', dashed: true, w: 2.6, o: 0.9 });
    }
  }

  // e₁, e₂ where they started (pale), once the plane has moved
  if (!start) {
    items.push({ k: 'arrow', id: 'e1-ghost', a: O, b: [1, 0], role: 'c1', w: 2, o: 0.35, dashed: true });
    items.push({ k: 'arrow', id: 'e2-ghost', a: O, b: [0, 1], role: 'c2', w: 2, o: 0.35, dashed: true });
  }

  // inputs: pale start, column chain, moving image
  for (const x of s.inputs) {
    const img = T(x.p);
    if (x.ghost && !start) items.push({ k: 'arrow', id: `${x.id}-ghost`, a: O, b: x.p, role: x.role, w: 2, o: 0.4, dashed: true });
    if (x.stair) {
      const s1 = scale(T([1, 0]), x.p[0]), s2 = scale(T([0, 1]), x.p[1]);
      if (norm(s1) > 0.05) items.push({ k: 'arrow', id: `${x.id}-s1`, a: O, b: s1, role: 'c1', w: 2.6, o: 0.85 });
      if (norm(s2) > 0.05) items.push({ k: 'arrow', id: `${x.id}-s2`, a: s1, b: add(s1, s2), role: 'c2', w: 2.6, o: 0.85 });
    }
    if (norm(img) > 0.05) items.push({ k: 'arrow', id: x.id, a: O, b: img, role: x.role, w: x.w ?? 3.4 });
    else items.push({ k: 'dot', id: x.id, at: O, role: x.role, r: 5 });
    const lab = start ? x.label : done ? x.imgLabel : undefined;
    if (lab) {
      const tex = x.value && done ? `${lab} = ${tup(img, lang)}` : lab;
      items.push({ k: 'label', id: `lab-${x.id}`, at: img, tex, role: x.role === 'c3' ? 'c3' : x.role, ...tipLabel(norm(img) > 0.05 ? img : [1, -1], 10), prio: 2 });
    }
    if (x.ghost && !start && x.label) items.push({ k: 'label', id: `lab-${x.id}-ghost`, at: x.p, tex: x.label, role: x.role, small: true, ...tipLabel(x.p, 8), prio: 6 });
  }

  // the images of e₁ and e₂ (= the columns of A at the end)
  const g1 = T([1, 0]), g2 = T([0, 1]);
  if (norm(g2) > 0.03) items.push({ k: 'arrow', id: 'e2', a: O, b: g2, role: 'c2', w: 4.2 }); else items.push({ k: 'dot', id: 'e2', at: O, role: 'c2', r: 6 });
  if (norm(g1) > 0.03) items.push({ k: 'arrow', id: 'e1', a: O, b: g1, role: 'c1', w: 4.2 }); else items.push({ k: 'dot', id: 'e1', at: O, role: 'c1', r: 4 });
  if (s.basisLabels !== false) {
    const l1 = start ? 'e_1' : done ? 'a_1' : null, l2 = start ? 'e_2' : done ? 'a_2' : null;
    if (l1) items.push({ k: 'label', id: 'lab-e1', at: g1, tex: norm(g1) > 0.03 ? l1 : `${l1} = 0`, role: 'c1', ...(norm(g1) > 0.03 ? tipLabel(g1, 12) : { dx: 12, dy: 14, anchor: 'l' as const }), prio: 1 });
    if (l2) items.push({ k: 'label', id: 'lab-e2', at: g2, tex: norm(g2) > 0.03 ? l2 : `${l2} = 0`, role: 'c2', ...(norm(g2) > 0.03 ? tipLabel(g2, 12) : { dx: -12, dy: -14, anchor: 'r' as const }), prio: 1 });
    if (done) {
      items.push({ k: 'label', id: 'lab-e1-ghost', at: [1, 0], tex: 'e_1', role: 'c1', small: true, ...tipLabel([1, -0.6], 6), prio: 7 });
      items.push({ k: 'label', id: 'lab-e2-ghost', at: [0, 1], tex: 'e_2', role: 'c2', small: true, ...tipLabel([-0.6, 1], 6), prio: 7 });
    }
  }

  // find mode: target b, ring, hit or miss at the end
  if (s.b && find) {
    const b = s.b;
    if (norm(b) > 1e-9) items.push({ k: 'arrow', id: 'b', a: O, b, role: 'tgt', w: 3, o: done ? 1 : 0.55 });
    items.push({ k: 'ring', id: 'ring-b', at: b, role: 'tgt', r: 14, o: done ? 1 : 0.6 });
    items.push({ k: 'label', id: 'lab-b', at: b, tex: norm(b) > 1e-9 ? 'b' : 'b = 0', role: 'tgt', ...tipLabel(norm(b) > 1e-9 ? b : [1, 1], 20), prio: 0 });
    const Ax = apply(A, find.x);
    if (done && norm(sub(Ax, b)) < 1e-6) items.push({ k: 'dot', id: 'hit', at: b, role: 'tgt', r: 18, o: 0.22 });
    if (done && norm(sub(Ax, b)) > 1e-6) {
      items.push({ k: 'arrow', id: 'miss', a: b, b: Ax, role: 'miss', w: 2.8, dashed: true });
      items.push({ k: 'label', id: 'lab-miss', at: scale(add(b, Ax), 0.5), tex: String.raw`|Ax - b| = ${ntex(norm(sub(Ax, b)), 2, lang)}`, role: 'miss', small: true, ...sideLabel(sub(Ax, b), 8, 1), prio: 4 });
    }
  }

  const handles: Handle[] = [];
  for (const id of s.drag ?? []) {
    if (id === 'a1') handles.push({ id, at: col(A, 0), role: 'c1' });
    else if (id === 'a2') handles.push({ id, at: col(A, 1), role: 'c2' });
    else if (id === 'b' && s.b) handles.push({ id, at: s.b, role: 'tgt' });
    else { const x = s.inputs.find((q) => q.id === id); if (x) handles.push({ id, at: x.p, role: x.role }); }
  }
  const obst = [...handles.map((h) => ({ at: h.at, r: 11 })), { at: O, r: 6 }, ...(s.b ? [{ at: s.b, r: 20 }] : [])];
  return { items: placeLabels(items, view, obst), handles };
}

/** Points the window needs for the whole morph. */
export function trPoints(A: M2, inputs: V2[], b?: V2): V2[] {
  const pts: V2[] = morphPoints(A, [[1, 0], [0, 1], ...inputs]);
  pts.push(...inputs);
  if (b) pts.push(b);
  return pts;
}
