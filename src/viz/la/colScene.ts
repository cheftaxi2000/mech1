/**
 * Pure scene of the column picture (Übung 4, slides 12–13): from the model and the frame of a step it builds the
 * list of things to draw. Rank 1 puts x₁a₁ and x₂a₂ on two lanes either side of the line (the chain is collinear),
 * rank 0 gets a callout (all labels would pile up on the origin).
 */
import { add, norm, scale, sub, type M2, type V2 } from '../../linalg/plane2';
import { HIT, colResult, famX, type ColFrame, type ColModel } from '../../linalg/columnPicture';
import { ntex, placeLabels, sideLabel, tipLabel, type Handle, type PItem, type View } from './planeItems';

/** lane offset in units (rank 1) */
export const LANE = 0.3;

export interface ColScene { items: PItem[]; handles: Handle[]; callout: boolean }

export function colHandles(m: ColModel): Handle[] {
  return [
    { id: 'a1', at: m.a1, role: 'c1' },
    { id: 'a2', at: m.a2, role: 'c2' },
    { id: 'b', at: m.b, role: 'tgt' },
  ];
}

/** Dragging a tip: a₁ or a₂ edit a column of A, b edits the target. */
export function dragSystem(A: M2, b: V2, id: string, p: V2): { A: M2; b: V2 } {
  const A2: M2 = [[A[0][0], A[0][1]], [A[1][0], A[1][1]]];
  let b2: V2 = [b[0], b[1]];
  if (id === 'a1') { A2[0][0] = p[0]; A2[1][0] = p[1]; }
  else if (id === 'a2') { A2[0][1] = p[0]; A2[1][1] = p[1]; }
  else b2 = [p[0], p[1]];
  return { A: A2, b: b2 };
}

export function colScene(m: ColModel, f: ColFrame, win: View, lang: 'de' | 'en', tau = 0): ColScene {
  const items: PItem[] = [];
  const O: V2 = [0, 0];
  const n = (v: number) => ntex(v, 2, lang);
  const { Ax, miss } = colResult(m, f);
  const axOn = f.axGrow >= 1;
  const hitNow = axOn && miss < HIT;
  const lanes = m.r === 1;
  const perp: V2 = lanes ? [m.u![1], -m.u![0]] : [0, 0]; // math unit vector across the line
  const lane = (p: V2, k: number): V2 => add(p, scale(perp, LANE * k));
  const callout = m.r === 0;

  // labels of the chain x₁a₁, x₂a₂ and of Ax go to the outside of the triangle they form
  const cen = scale(add(add(scale(m.a1, f.x[0]), O), Ax), 1 / 3);
  const away = (at: V2, dir: V2): 1 | -1 => ((at[0] - cen[0]) * -dir[1] + (at[1] - cen[1]) * dir[0] >= 0 ? 1 : -1);
  // the line of the columns / the only reachable point
  if (m.r === 1) {
    items.push({ k: 'line', id: 'span', p: O, dir: m.u!, role: 'aux', dashed: true, w: 2.4 });
    const far: V2 = norm(m.b) > 0 && m.u![0] * m.b[0] + m.u![1] * m.b[1] > 0 ? scale(m.u!, -1) : m.u!;
    for (const k of [3, 2.5, 2, 1.5, 1]) {
      const p = scale(far, k);
      if (p[0] > win.x[0] + 1 && p[0] < win.x[1] - 1 && p[1] > win.y[0] + 0.8 && p[1] < win.y[1] - 0.8) {
        items.push({ k: 'label', id: 'lab-span', at: p, tex: String.raw`\mathrm{span}\{a_1, a_2\}`, role: 'aux', small: true, ...sideLabel(far, 8, 1), prio: 9 });
        break;
      }
    }
  }
  if (m.r === 0) items.push({ k: 'dot', id: 'origin-only', at: O, role: 'aux', open: true, r: 24, o: 0.7 });

  // hit highlight at b
  if (hitNow) items.push({ k: 'dot', id: 'hit', at: m.b, role: 'tgt', r: 20, o: 0.22 });

  // trail while the family of solutions moves
  if (axOn && f.axGrow >= 1 && m.kind === 'infinite' && tau > 0) {
    for (let k = 1; k <= 12; k++) {
      const tt = tau - k * 0.3;
      if (tt < 0) break;
      items.push({ k: 'dot', id: `trail-${k}`, at: lane(scale(m.a1, famX(m, tt)[0]), -1), role: 'c1', open: true, r: 4, o: 0.75 * (1 - k / 13) });
    }
  }

  // the columns: bold in step 1, ghosts afterwards; they grow in step 1
  const bold = f.full;
  const a1t = scale(m.a1, f.g[0]), a2t = scale(m.a2, f.g[1]), bt = scale(m.b, f.g[2]);
  const zero1 = norm(m.a1) < 1e-9, zero2 = norm(m.a2) < 1e-9;
  if (f.g[1] > 0) items.push({ k: 'arrow', id: 'a2', a: O, b: a2t, role: 'c2', w: bold ? 4.5 : 2.4, o: bold ? 1 : 0.45 });
  if (f.g[0] > 0) items.push({ k: 'arrow', id: 'a1', a: O, b: a1t, role: 'c1', w: bold ? 4.5 : 2.4, o: bold ? 1 : 0.45 });
  if (!callout) {
    if (f.g[0] >= 0.55) {
      if (zero1) items.push({ k: 'label', id: 'lab-a1', at: O, tex: 'a_1 = 0', role: 'c1', anchor: 'r', dx: -12, dy: -14 });
      else { const tl = tipLabel(m.a1, 14); items.push({ k: 'label', id: 'lab-a1', at: a1t, tex: 'a_1', role: 'c1', ...tl, prio: 1 }); }
    }
    if (f.g[1] >= 0.55) {
      if (zero2) items.push({ k: 'label', id: 'lab-a2', at: O, tex: 'a_2 = 0', role: 'c2', anchor: 'l', dx: 12, dy: 14 });
      else { const tl = tipLabel(m.a2, 14); items.push({ k: 'label', id: 'lab-a2', at: a2t, tex: 'a_2', role: 'c2', ...tl, prio: 1 }); }
    }
  }
  // b with its target ring
  if (f.g[2] > 0) items.push({ k: 'arrow', id: 'b', a: O, b: bt, role: 'tgt', w: 5.5 });
  if (f.g[2] >= 0.55) {
    if (norm(m.b) < 1e-9) items.push({ k: 'label', id: 'lab-b', at: O, tex: 'b = 0', role: 'tgt', anchor: 'l', dx: 14, dy: -16 });
    else { const tl = tipLabel(m.b, 24); items.push({ k: 'label', id: 'lab-b', at: m.b, tex: 'b', role: 'tgt', ...tl, prio: 0 }); }
  }
  if (f.g[2] >= 1) items.push({ k: 'ring', id: 'ring-b', at: m.b, role: 'tgt', r: 16 });

  // x₁a₁ from the origin, x₂a₂ from its tip
  const v1 = scale(m.a1, f.x[0]), v2 = scale(m.a2, f.x[1]);
  if (f.s1) {
    const p = lane(O, -1), q = lane(v1, -1);
    items.push({ k: 'arrow', id: 'x1a1', a: p, b: q, role: 'c1', w: 4 });
    if (m.r > 0) {
      const long = Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.8;
      const mid: V2 = long ? [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] : p;
      const lo = lanes ? laneOffsetPx(perp, -1) : long ? sideLabel(v1, 7, away(mid, v1)) : { dx: -14, dy: -10, anchor: 'r' as const };
      items.push({ k: 'label', id: 'lab-x1', at: mid, tex: `x_1 = ${n(f.x[0])}`, role: 'c1', small: true, ...lo, prio: 3 });
    }
  }
  if (f.s2) {
    const base = scale(v1, f.s1 ? f.base2 : 0);
    const k = lanes ? f.base2 : 0;
    const p = lane(base, k), q = lane(add(base, v2), k);
    if (lanes && f.base2 > 0) items.push({ k: 'seg', id: 'lane-link', a: lane(base, -1), b: p, role: 'aux', dashed: true, w: 1.6 });
    items.push({ k: 'arrow', id: 'x2a2', a: p, b: q, role: 'c2', w: 4 });
    if (m.r > 0 && f.x2num) {
      const long = Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.8;
      const mid: V2 = long ? [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] : p;
      const lo = lanes ? laneOffsetPx(perp, 1) : long ? sideLabel(v2, 7, away(mid, v2)) : { dx: 14, dy: 10, anchor: 'l' as const };
      items.push({ k: 'label', id: 'lab-x2', at: mid, tex: `x_2 = ${n(f.x[1])}`, role: 'c2', small: true, ...lo, prio: 3 });
    }
  }
  // Ax
  if (f.axGrow > 0) {
    const q = scale(Ax, f.axGrow);
    if (norm(q) > 0.08) {
      items.push({ k: 'arrow', id: 'Ax', a: O, b: q, role: 'ax', w: 3 });
      if (f.axGrow > 0.6 && !callout) items.push({ k: 'label', id: 'lab-Ax', at: scale(q, 0.55), tex: String.raw`Ax`, role: 'ax', ...sideLabel(Ax, 8, away(scale(q, 0.55), Ax)), prio: 2 });
    } else if (axOn) {
      items.push({ k: 'dot', id: 'Ax0', at: O, role: 'ax', r: 6 });
      if (m.r > 0) items.push({ k: 'label', id: 'lab-Ax', at: O, tex: String.raw`Ax = 0`, role: 'ax', small: true, anchor: 'r', dx: -12, dy: 14 });
    }
  }
  // the miss Ax − b, dashed, and the right angle at the closest point
  if (axOn && miss > HIT) {
    items.push({ k: 'arrow', id: 'miss', a: m.b, b: Ax, role: 'miss', w: 3.2, dashed: true });
    if (!callout && miss > (win.x[1] - win.x[0]) / 9) {
      const mid = scale(add(m.b, Ax), 0.5);
      items.push({ k: 'label', id: 'lab-miss', at: mid, tex: String.raw`|Ax - b| = ${n(miss)}`, role: 'miss', small: true, ...sideLabel(sub(Ax, m.b), 8, 1), prio: 4 });
    }
    if (m.r === 1 && !m.inSpan && norm(sub(Ax, m.proj)) < 1e-6) {
      const mm = norm(sub(m.b, m.proj));
      if (mm > 0.5) {
        const k = 0.3;
        const e1 = scale(m.u!, (m.proj[0] * m.u![0] + m.proj[1] * m.u![1] > 0 ? 1 : -1) * k), e2 = scale(sub(m.b, m.proj), k / mm);
        items.push({ k: 'poly', id: 'right-angle', pts: [add(m.proj, e1), add(add(m.proj, e1), e2), add(m.proj, e2)], role: 'miss' });
      }
    }
  }
  // rank 0: callout (stacked labels beside the origin, on the side away from b)
  if (callout) {
    const lines: { tex: string; role: 'ax' | 'aux' | 'c1' | 'c2' | 'miss' }[] = [
      { tex: String.raw`a_1 = a_2 = 0`, role: 'ax' },
      { tex: String.raw`\mathrm{span}\{a_1, a_2\} = \{0\}`, role: 'aux' },
    ];
    if (f.s1) lines.push({ tex: String.raw`x_1 = ${n(f.x[0])} \;\Rightarrow\; x_1 a_1 = 0`, role: 'c1' });
    if (f.s2 && f.x2num) lines.push({ tex: String.raw`x_2 = ${n(f.x[1])} \;\Rightarrow\; x_2 a_2 = 0`, role: 'c2' });
    if (axOn) lines.push(m.kind === 'none'
      ? { tex: String.raw`Ax = 0,\ |Ax - b| = |b| = ${n(norm(m.b))}`, role: 'miss' }
      : { tex: String.raw`Ax = 0 = b \;\checkmark`, role: 'c1' });
    const away: V2 = norm(m.b) > 1e-9 ? [-m.b[0], -m.b[1]] : [1, 0.7]; // math direction away from b
    const sx = away[0] >= 0 ? 1 : -1, sy = away[1] >= 0 ? -1 : 1;       // screen: up is negative
    const L = lines.length;
    lines.forEach((l, i) => items.push({
      k: 'label', id: `callout-${i}`, at: O, tex: l.tex, role: l.role, small: true, anchor: sx > 0 ? 'l' : 'r',
      dx: sx * 34, dy: sy > 0 ? 34 + i * 24 : -34 - (L - 1 - i) * 24,
    }));
  }
  const obst = [
    { at: m.a1, r: 11 }, { at: m.a2, r: 11 }, { at: m.b, r: 22 }, { at: O, r: 6 },
    ...(f.s1 ? [{ at: lane(v1, -1), r: 7 }] : []),
  ];
  return { items: placeLabels(items, win, obst, (id) => id.startsWith('callout')), handles: colHandles(m), callout };
}

/** Pixel offset (viewBox units) that pushes a label across the line to the side `k` (−1 or +1). */
function laneOffsetPx(perp: V2, k: -1 | 1) {
  return tipLabel([perp[0] * k, perp[1] * k], 16);
}
