/**
 * Pure scene «Freischneiden» of lesson K3 (Skript p. 31, the picture of the Lastkörper on the Träger), one step per sentence:
 *  step 0  the whole assembly: Lastkörper on the Träger on two Stützen; the loads G and Z (dark: just two arrows)
 *  step 1  we draw the system boundary around the Lastkörper (dashed frame draws itself)
 *  step 2  we cut it free: the Lastkörper is lifted off the Träger
 *  step 3  the contact is replaced by forces: N₁, N₂, R₁, R₂ on the Lastkörper and the reactions −N₁ … −R₂ on the Träger
 *  step 4  mark: every force on the Lastkörper has its reaction outside the frame → all six are outer (vermilion) = coloured picture 1 of p. 31
 *  step 5  enlarge the system to Lastkörper + Träger: the block sits down again, N and R and their reactions are now inner (grey),
 *          F_A and F_B come in as outer forces = coloured picture 2 of p. 31
 */
import type { Lang } from '../../i18n';
import { ease, type P2 } from '../anim/geometry';
import { arrowHead, sceneBuilder, type Ink, type Scene } from '../anim/scene';
import { unionOutline } from './k3Outline';

// label colours of this lesson (k34.css: .anim-label.ink-out / -in / -ld); the shared Ink union of anim/scene.ts does not list them
const OUT = 'out' as Ink, IN = 'in' as Ink, LD = 'ld' as Ink;

export const FS = {
  A: [70, 206] as P2, B: [330, 206] as P2, beamY0: 190, beamY1: 206, ground: 262,
  bx0: 138, bx1: 262, bh: 56, lift: 52, c1: 156, c2: 244, N: 34, R: 28, margin: 9,
};
const X = FS.bx0 + (FS.bx1 - FS.bx0) / 2;

export const REST_BLOCK = { x0: FS.bx0, x1: FS.bx1, y0: FS.beamY0 - FS.bh, y1: FS.beamY0 };
const BEAM = { x0: 30, x1: 370, y0: FS.beamY0, y1: FS.beamY1 };

/** Perimeter points of a closed polygon cut after the fraction f of its length. */
export function partialLoop(loop: readonly P2[], f: number): P2[] {
  const n = loop.length, segs = loop.map((p, i) => { const q = loop[(i + 1) % n]; return Math.hypot(q[0] - p[0], q[1] - p[1]); });
  const total = segs.reduce((a, b) => a + b, 0);
  let left = f * total;
  const out: P2[] = [loop[0]];
  for (let i = 0; i < n && left > 0; i++) {
    const p = loop[i], q = loop[(i + 1) % n];
    if (left >= segs[i]) { out.push(q); left -= segs[i]; } else { const k = left / segs[i]; out.push([p[0] + k * (q[0] - p[0]), p[1] + k * (q[1] - p[1])]); left = 0; }
  }
  return out;
}

export interface FreeState { lift: number; frameBlock: number; frameUnion: number; loads: number; contact: number; outer: number; inner: number; enlarge: number }
/** The numbers every drawing depends on, per (step, t) — tested without any drawing. */
export function freeState(step: number, t: number): FreeState {
  const e = ease(t);
  return {
    lift: step === 2 ? FS.lift * e : step === 3 || step === 4 ? FS.lift : step === 5 ? FS.lift * (1 - e) : 0,
    frameBlock: step === 0 ? 0 : step === 1 ? t : step === 5 ? 1 - e : 1,           // how much of the block frame is drawn / visible
    frameUnion: step === 5 ? e : 0,
    loads: step === 0 ? e : 1,
    contact: step < 3 ? 0 : step === 3 ? e : 1,                                       // growth of N, R and their reactions
    outer: step < 4 ? 0 : step === 4 ? e : 1,                                         // loads and contact forces turn vermilion
    inner: step === 5 ? e : 0,                                                        // contact forces turn grey
    enlarge: step === 5 ? e : 0,
  };
}

export function freeScene(step: number, t: number, lang: Lang): Scene {
  const sb = sceneBuilder();
  const de = lang === 'de';
  const st = freeState(step, t);
  const S = (key: string, kind: 'line' | 'polyline' | 'polygon' | 'circle', cls: string, pts: P2[], o = 1, r?: number) => { if (o > 0.01) sb.shape({ key, kind, cls, pts, o, r }); };
  const arrow = (key: string, kind: 'out' | 'in' | 'ld' | 'gh', a: P2, b: P2, o = 1, head = 8) => {
    if (o <= 0.01 || Math.hypot(b[0] - a[0], b[1] - a[1]) < 2) return;
    S(key, 'line', `ks-${kind}`, [a, b], o); S(`${key}-h`, 'polygon', `ks-${kind}-h`, arrowHead(a, b, head), o);
  };
  const grow = (a: P2, b: P2, k: number): P2 => [a[0] + k * (b[0] - a[0]), a[1] + k * (b[1] - a[1])];
  const { A, B, beamY0, beamY1, ground, c1, c2 } = FS;
  const lift = st.lift;
  const by1 = beamY0 - lift, by0 = by1 - FS.bh;                    // block bottom / top now
  const inSys = step >= 2;

  // ── ground, supports, beam ──
  S('ground', 'line', 'ks-ground', [[A[0] - 34, ground], [A[0] + 34, ground]]);
  S('ground-b', 'line', 'ks-ground', [[B[0] - 34, ground], [B[0] + 34, ground]]);
  for (const [k, P] of [['a', A], ['b', B]] as const) {
    for (let i = 0; i < 6; i++) S(`hatch-${k}${i}`, 'line', 'ks-ground', [[P[0] - 30 + i * 11, ground], [P[0] - 38 + i * 11, ground + 8]]);
    S(`stuetze-${k}`, 'polygon', 'ks-body', [P, [P[0] - 22, ground], [P[0] + 22, ground]]);
  }
  S('beam', 'polygon', `ks-body${step === 5 && st.enlarge > 0.5 ? ' sys' : ''}${step === 4 ? ' fade' : ''}`,
    [[BEAM.x0, BEAM.y0], [BEAM.x1, BEAM.y0], [BEAM.x1, BEAM.y1], [BEAM.x0, BEAM.y1]]);
  sb.label('name-beam', [356, beamY1 + 14], `\\text{${de ? 'Träger' : 'beam'}}`, 'muted', 1, 'c', {});

  // ── frames ──
  const rB = (m: number) => [[FS.bx0 - m, by0 - m], [FS.bx1 + m, by0 - m], [FS.bx1 + m, by1 + m], [FS.bx0 - m, by1 + m]] as P2[];
  if (st.frameBlock > 0.01) {
    const loop = rB(FS.margin);
    const o = step === 5 ? st.frameBlock : 1;
    if (step === 1) S('frame-block', 'polyline', 'ks-frame', partialLoop(loop, st.frameBlock));
    else { S('frame-block-fill', 'polygon', 'ks-frame-fill', loop, o); S('frame-block', 'polygon', 'ks-frame', loop, o); }
  }
  if (st.frameUnion > 0.01) {
    for (const [i, loop] of unionOutline([REST_BLOCK, BEAM], FS.margin).entries()) {
      S(`frame-union-fill${i}`, 'polygon', 'ks-frame-fill', loop as P2[], st.frameUnion);
      S(`frame-union${i}`, 'polygon', 'ks-frame', loop as P2[], st.frameUnion);
    }
  }

  // ── the block ──
  S('block', 'polygon', `ks-body${inSys ? ' sys' : ''}`, [[FS.bx0, by0], [FS.bx1, by0], [FS.bx1, by1], [FS.bx0, by1]]);
  sb.label('name-block', [FS.bx0 - FS.margin - 4, by0 - 8], `\\text{${de ? 'Lastkörper' : 'load block'}}`, 'muted', 1, 'r', {});
  const com: P2 = [X, by0 + FS.bh / 2], zp: P2 = [FS.bx1, by0 + 16];
  S('ring-com', 'circle', 'ks-ring', [com], 1, 4);

  // ── loads G and Z: dark first, vermilion once marked ──
  const gLen = 54, zLen = 52;
  const gTail: P2 = [X, com[1] - gLen], zTip: P2 = [zp[0] + zLen, zp[1]];
  const loadArrow = (key: string, a: P2, b: P2) => {
    const k = st.loads;
    arrow(`${key}-ld`, 'ld', a, grow(a, b, k), 1 - st.outer);
    arrow(`${key}-out`, 'out', a, grow(a, b, k), st.outer);
  };
  loadArrow('G', gTail, com); loadArrow('Z', zp, zTip);
  const lblInk = (o: number): Ink => (o > 0.5 ? OUT : LD);
  sb.label('G', [X + 15, gTail[1] + 11], '\\v G', lblInk(st.outer), st.loads, 'c');
  sb.label('Z', [zp[0] + zLen / 2, zp[1] - 13], '\\v Z', lblInk(st.outer), st.loads, 'c');
  S('ring-z', 'circle', 'ks-ring', [zp], 1, 4);

  // ── contact forces on the block (go up / left) and their reactions on the beam (go down / right) ──
  const kc = st.contact;
  const spec = [[1, c1], [2, c2]] as const;
  for (const [n, cx] of spec) {
    const bottom: P2 = [cx, by1], top: P2 = [cx, beamY0];
    const nTip: P2 = [cx, by1 - FS.N], rFrom: P2 = [cx, by1 - 7], rTip: P2 = [cx - FS.R, by1 - 7];
    const rrFrom: P2 = [cx, beamY0 + 8], rrTip: P2 = [cx + FS.R, beamY0 + 8], nnTip: P2 = [cx, beamY0 + FS.N - 2];
    // on the block: dark when they appear (step 3), vermilion (step 4), grey (step 5)
    const blockKind = (key: string, a: P2, b: P2) => {
      const g = grow(a, b, kc);
      arrow(`${key}-ld`, 'ld', a, g, kc > 0 ? (1 - st.outer) : 0);
      arrow(`${key}-out`, 'out', a, g, st.outer * (1 - st.inner));
      arrow(`${key}-in`, 'in', a, g, st.inner);
    };
    blockKind(`N${n}`, bottom, nTip); blockKind(`R${n}`, rFrom, rTip);
    // reactions on the beam: faint (they are not on our system), grey solid once the beam belongs to it
    const reaction = (key: string, a: P2, b: P2) => {
      const g = grow(a, b, kc);
      arrow(`${key}-gh`, 'gh', a, g, 1 - st.inner);
      arrow(`${key}-in`, 'in', a, g, st.inner);
    };
    reaction(`N${n}p`, top, nnTip); reaction(`R${n}p`, rrFrom, rrTip);
    if (kc > 0.01) { S(`dot-b${n}`, 'circle', 'ks-dot', [bottom], 1, 3); S(`dot-t${n}`, 'circle', 'ks-dot', [top], 1, 3); }
    const inkBlock: Ink = st.inner > 0.5 ? IN : st.outer > 0.5 ? OUT : LD;
    sb.label(`N${n}`, [cx, nTip[1] - 12], `\\v N_${n}`, inkBlock, kc, 'c');
    sb.label(`R${n}`, [cx - FS.R / 2 - 1, rFrom[1] - 12], `\\v R_${n}`, inkBlock, kc, 'c');
    sb.label(`N${n}p`, [cx - 17, nnTip[1] - 2], `-\\v N_${n}`, IN, kc * (0.55 + 0.45 * st.inner), 'c');
    sb.label(`R${n}p`, [cx + FS.R / 2 + 5, beamY1 + 13], `-\\v R_${n}`, IN, kc * (0.55 + 0.45 * st.inner), 'c');
  }

  // ── step 5: the support forces F_A, F_B enter (outer for Lastkörper + Träger) ──
  if (step === 5) {
    const k = st.enlarge;
    const fa: P2 = [A[0] - 22, A[1] - 42], fb: P2 = [B[0] - 20, B[1] - 40];
    arrow('FA', 'out', A, grow(A, fa, k), 1); arrow('FB', 'out', B, grow(B, fb, k), 1);
    S('dot-A', 'circle', 'ks-dot', [A], 1, 3); S('dot-B', 'circle', 'ks-dot', [B], 1, 3);
    sb.label('FA', [A[0] - 22, A[1] - 42 - 13], '\\v F_A', OUT, k, 'c'); sb.label('FB', [B[0] - 39, B[1] - 38], '\\v F_B', OUT, k, 'c');
  }

  // ── legend (from the marking step on) ──
  const lo = step >= 4 ? (step === 4 ? st.outer : 1) : 0;
  if (lo > 0.01) {
    arrow('leg-out', 'out', [18, 286], [48, 286], lo, 7);
    sb.label('leg-out', [54, 286], `\\text{${de ? 'äussere Kraft' : 'outer force'}}`, OUT, lo, 'l');
    arrow('leg-in', 'in', [226, 286], [256, 286], st.inner, 7);
    sb.label('leg-in', [262, 286], `\\text{${de ? 'innere Kraft' : 'inner force'}}`, IN, st.inner, 'l');
  }
  return sb.finish({ ...st, step });
}
