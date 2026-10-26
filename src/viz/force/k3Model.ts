/**
 * Geometry of the two systems of lesson K3 in figure coordinates (y grows downward):
 *  - beamModel: the picture of p. 31 (Lastkörper on Träger on two Stützen) with all forces,
 *  - cartModel: two carts and a hand (the small introductory example).
 * Force vectors come from physics/systemModel.ts; here they only get a position and a drawing scale.
 */
import { beamInteractions, cartInteractions, type BeamExample } from '../../physics/systemModel';
import type { Interaction } from '../../physics/force';
import type { Vec3 } from '../../physics/vec';
import type { Rect } from './k3Outline';
import type { V, ViewBox } from './k34Common';

export type BodyKind = 'block' | 'beam' | 'support' | 'cart';
export interface KBody { id: string; group: string; kind: BodyKind; rect: Rect; apex?: V; name: readonly [string, string]; nameAt?: V }
export interface KForce {
  fid: string;      // id used by classify(): "N1", and "N1'" for the reaction
  tex: string;      // label, e.g. \v N_1 or -\v N_1
  body: string;     // the body this force acts on
  from: V; to: V;   // arrow (tail → head)
  at: V;            // point of application (dot)
  lab: V;           // label position
  labAnchor?: 'l' | 'r' | 't' | 'b';
}
export interface KModel { vb: ViewBox; bodies: KBody[]; forces: KForce[]; interactions: Interaction[]; names: Record<string, { acc: readonly [string, string]; en: string }> }

export const pairOf = (fid: string) => fid.replace(/'$/, '');
export const partnerOf = (fid: string) => (fid.endsWith("'") ? pairOf(fid) : `${fid}'`);

const K = 0.9; // px per N
const px = (F: Vec3, k = K): V => [k * F[0], -k * F[1]];
const add2 = (a: V, b: V): V => [a[0] + b[0], a[1] + b[1]];
const neg = (a: V): V => [-a[0], -a[1]];

/** Names of every body that can occur (accusative with article for the German sentence, English with article). */
const NAMES: KModel['names'] = {
  last: { acc: ['den Lastkörper', 'the load block'], en: 'the load block' },
  traeger: { acc: ['den Träger', 'the beam'], en: 'the beam' },
  stuetzeA: { acc: ['die Stütze A', 'support A'], en: 'support A' },
  stuetzeB: { acc: ['die Stütze B', 'support B'], en: 'support B' },
  erde: { acc: ['die Erde', 'the Earth'], en: 'the Earth' },
  zug: { acc: ['das, was zieht (Hand, Seil)', 'whatever pulls (hand, rope)'], en: 'whatever pulls (hand, rope)' },
  boden: { acc: ['den Boden', 'the ground'], en: 'the ground' },
  w1: { acc: ['Wagen 1', 'cart 1'], en: 'cart 1' },
  w2: { acc: ['Wagen 2', 'cart 2'], en: 'cart 2' },
  hand: { acc: ['die Hand', 'the hand'], en: 'the hand' },
};

export const BEAM_VB: ViewBox = [0, 36, 640, 284];
export const BEAM_GEOM = { A: [96, 220] as V, B: [544, 220] as V, beamY0: 206, beamY1: 220, ground: 288, blockW: 200, blockH: 76, comDy: 38, s0: 0.25, s1: 0.6 };

export function beamModel(ex: BeamExample): KModel {
  const { A, B, beamY0, beamY1, ground, blockW, blockH } = BEAM_GEOM;
  const x = A[0] + ex.s * (B[0] - A[0]);
  const ints = beamInteractions(ex);
  const F = (id: string) => ints.find((i) => i.id === id)!.F;
  const top = beamY0 - blockH, c1: V = [x - 78, beamY0], c2: V = [x + 78, beamY0];
  const com: V = [x, beamY0 - BEAM_GEOM.comDy], zp: V = [x + blockW / 2, top + 20];
  const bodies: KBody[] = [
    { id: 'last', group: 'last', kind: 'block', rect: { x0: x - blockW / 2, y0: top, x1: x + blockW / 2, y1: beamY0 }, name: ['Lastkörper', 'load block'], nameAt: [x - 50, top + 14] },
    { id: 'traeger', group: 'traeger', kind: 'beam', rect: { x0: 40, y0: beamY0, x1: 600, y1: beamY1 }, name: ['Träger', 'beam'], nameAt: [592, beamY1 + 17] },
    { id: 'stuetzeA', group: 'stuetzen', kind: 'support', rect: { x0: A[0] - 28, y0: beamY1, x1: A[0] + 28, y1: ground }, apex: A, name: ['Stütze', 'support'], nameAt: [A[0], ground + 18] },
    { id: 'stuetzeB', group: 'stuetzen', kind: 'support', rect: { x0: B[0] - 28, y0: beamY1, x1: B[0] + 28, y1: ground }, apex: B, name: ['Stütze', 'support'], nameAt: [B[0], ground + 18] },
  ];
  const forces: KForce[] = [];
  const f = (o: KForce) => forces.push(o);
  const G = ex.G;
  // weight and pull (outer for every system: their reactions act on the Earth / on the hand, which are never inside)
  f({ fid: 'G', tex: '\\v G', body: 'last', from: [x, com[1] - K * G], to: com, at: com, lab: [x + 20, com[1] - K * G + 12], labAnchor: 'l' });
  const zTo = add2(zp, px(F('Z')));
  f({ fid: 'Z', tex: '\\v Z', body: 'last', from: zp, to: zTo, at: zp, lab: [(zp[0] + zTo[0]) / 2, zp[1] - 15] });
  // contact forces between Lastkörper and Träger
  for (const [n, c] of [[1, c1], [2, c2]] as const) {
    const N = px(F(`N${n}`)), R = px(F(`R${n}`));
    const nTip = add2(c, N);
    f({ fid: `N${n}`, tex: `\\v N_${n}`, body: 'last', from: c, to: nTip, at: c, lab: [c[0], nTip[1] - 13] });
    const rFrom: V = [c[0], c[1] - 6], rTip = add2(rFrom, R);
    f({ fid: `R${n}`, tex: `\\v R_${n}`, body: 'last', from: rFrom, to: rTip, at: c, lab: [(rFrom[0] + rTip[0]) / 2, rFrom[1] - 14] });
    const nDown = add2(c, neg(N));
    f({ fid: `N${n}'`, tex: `-\\v N_${n}`, body: 'traeger', from: c, to: nDown, at: c, lab: [c[0] - 14, nDown[1] - 4], labAnchor: 'r' });
    const rrFrom: V = [c[0], c[1] + 8], rrTip = add2(rrFrom, neg(R));
    f({ fid: `R${n}'`, tex: `-\\v R_${n}`, body: 'traeger', from: rrFrom, to: rrTip, at: c, lab: [rrTip[0] + 22, rrFrom[1] + 17] });
  }
  // support forces on the beam, and their reactions on the supports
  for (const [n, P, sid] of [['A', A, 'stuetzeA'], ['B', B, 'stuetzeB']] as const) {
    const v = px(F(`F${n}`)), tip = add2(P, v), tipR = add2(P, neg(v));
    f({ fid: `F${n}`, tex: `\\v F_${n}`, body: 'traeger', from: P, to: tip, at: P, lab: n === 'A' ? [tip[0] - 4, tip[1] - 14] : [tip[0] - 17, tip[1] + 4], labAnchor: n === 'A' ? undefined : 'r' });
    f({ fid: `F${n}'`, tex: `-\\v F_${n}`, body: sid, from: P, to: tipR, at: P, lab: [tipR[0] + 20, tipR[1] + 4], labAnchor: 'l' });
    // not in the Skript: the ground holds the Stütze (drawn only when the Stütze belongs to the system)
    const foot: V = [P[0], ground], hTip = add2(foot, v);
    f({ fid: `H${n}`, tex: `\\v H_${n}`, body: sid, from: foot, to: hTip, at: foot, lab: [hTip[0] - 17, hTip[1] + 2], labAnchor: 'r' });
  }
  return { vb: BEAM_VB, bodies, forces, interactions: ints, names: NAMES };
}

export const CART_VB: ViewBox = [96, 50, 392, 140];
export function cartModel(H = 70, P = 42): KModel {
  const ints = cartInteractions(H, P);
  const yb = 150, h = 62, kk = 1.3;
  const bodies: KBody[] = [
    { id: 'w1', group: 'w1', kind: 'cart', rect: { x0: 190, y0: yb - h, x1: 330, y1: yb }, name: ['Wagen 1', 'cart 1'], nameAt: [260, yb + 28] },
    { id: 'w2', group: 'w2', kind: 'cart', rect: { x0: 330, y0: yb - h, x1: 470, y1: yb }, name: ['Wagen 2', 'cart 2'], nameAt: [400, yb + 28] },
  ];
  const hy = yb - 40;
  const forces: KForce[] = [
    { fid: 'H', tex: '\\v H', body: 'w1', from: [190, hy], to: [190 + kk * H, hy], at: [190, hy], lab: [190 + kk * H / 2, hy - 15] },
    { fid: 'P', tex: '\\v P', body: 'w2', from: [330, yb - 44], to: [330 + kk * P, yb - 44], at: [330, yb - 44], lab: [330 + kk * P + 20, yb - 44], labAnchor: 'l' },
    { fid: "P'", tex: '-\\v P', body: 'w1', from: [330, yb - 22], to: [330 - kk * P, yb - 22], at: [330, yb - 22], lab: [330 - kk * P - 8, yb - 22], labAnchor: 'r' },
  ];
  return { vb: CART_VB, bodies, forces, interactions: ints, names: NAMES };
}

/** The partner force of `fid` as a drawn force (undefined for G, Z, H: their partners act on the Earth, the hand …). */
export const drawnPartner = (m: KModel, fid: string) => m.forces.find((f) => f.fid === partnerOf(fid));
