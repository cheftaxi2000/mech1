import { describe, expect, it } from 'vitest';
import { PROOF, plateNumbers, shadow } from '../../physics/kraeftegruppe';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { K, NUM, PLATE, proofScene } from './K7ProofScene';

const close = (a: number, b: number, tol = 1e-6) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);
const px = (p: readonly [number, number]) => [K.BX + K.S * p[0], K.BY - K.S * p[1]] as const;
const yP = (w: number) => K.Y0 - K.KP * w;
const rectTop = (f: ReturnType<typeof proofScene>, k: string) => { const s = shape(f, k)!; return { y0: s.pts[0][1], y1: s.pts[2][1], x0: s.pts[0][0], x1: s.pts[1][0] }; };
const hasLabel = (f: ReturnType<typeof proofScene>, k: string) => (lab(f, k)?.o ?? 0) > 0.9;
const inPoly = (p: readonly [number, number], poly: readonly (readonly [number, number])[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};

describe('proof of p. 35 (plate, 2 forces): the figure', () => {
  const n = plateNumbers(PROOF);
  it('B, A₁, A₂ lie inside the plate (with a margin)', () => {
    const poly = PLATE.map(px);
    for (const p of [PROOF.B, ...PROOF.forces.map((f) => f.A)]) expect(inPoly(px(p), poly)).toBe(true);
    // 0.35 m margin: the points shifted by 0.35 m in the four directions stay inside as well
    for (const p of PROOF.forces.map((f) => f.A)) for (const d of [[0.35, 0], [-0.35, 0], [0, 0.35], [0, -0.35]]) expect(inPoly(px([p[0] + d[0], p[1] + d[1]]), poly)).toBe(true);
  });
  it('every frame inside the figure, labels of the final frames do not overlap', () => {
    expectInside(proofScene, 7);
    expectNoOverlap(proofScene, 7, 0.25);
  });
  it('step 0 (final): v_B at B, ω as ⊙, the two forces at A₁ and A₂', () => {
    const f = proofScene(0, 1, 'de');
    for (const k of ['vB', 'F1', 'F2', 'om-dot', 'plate']) expect(shape(f, k)?.o, k).toBe(1);
    const tip = shape(f, 'vB')!.pts[1];
    close(tip[0], px(PROOF.B)[0] + K.KV * PROOF.vB[0]); close(tip[1], px(PROOF.B)[1] - K.KV * PROOF.vB[1]);
    const F2 = shape(f, 'F2')!;
    close(F2.pts[0][0], px(PROOF.forces[1].A)[0]); close(F2.pts[1][0] - F2.pts[0][0], K.KF * PROOF.forces[1].F[0]);
    expect(shape(f, 'v1')).toBeUndefined(); expect(shape(f, 'L-P1')).toBeUndefined();
  });
  it('step 1 (final): v_i = v_B (copy) + ω × BA_i, drawn head to tail; the sum arrow ends at the tip of the rotation part', () => {
    const f = proofScene(1, 1, 'de');
    for (let i = 0; i < 2; i++) {
      const A = px(PROOF.forces[i].A), c = shape(f, `vt${i + 1}`)!, r = shape(f, `vr${i + 1}`)!, v = shape(f, `v${i + 1}`)!;
      close(c.pts[0][0], A[0]); close(c.pts[0][1], A[1]);
      close(r.pts[0][0], c.pts[1][0]); close(r.pts[0][1], c.pts[1][1]); // head to tail
      close(r.pts[1][0], v.pts[1][0]); close(r.pts[1][1], v.pts[1][1]); // ends where v_i ends
      close(v.pts[1][0], A[0] + K.KV * n.v[i][0]); close(v.pts[1][1], A[1] - K.KV * n.v[i][1]);
      // the rotation part is perpendicular to BA_i
      const ba = [PROOF.forces[i].A[0], PROOF.forces[i].A[1]], rr = [(r.pts[1][0] - r.pts[0][0]) / K.KV, -(r.pts[1][1] - r.pts[0][1]) / K.KV];
      close(ba[0] * rr[0] + ba[1] * rr[1], 0, 1e-6);
      expect(shape(f, `ba${i + 1}`)?.o).toBe(1);
    }
    expect(hasLabel(f, 'lab-v1') && hasLabel(f, 'lab-v2') && hasLabel(f, 'leg-t') && hasLabel(f, 'leg-r')).toBe(true);
  });
  it('step 2 (final): shadow of v_i on the line of F_i has length |v_i|cos = P_i/|F_i|; stack [P₁, P₂] reaches P = 5.5', () => {
    const f = proofScene(2, 1, 'de');
    for (let i = 0; i < 2; i++) {
      const s = shape(f, `sh${i + 1}p`)!, F = PROOF.forces[i].F, len = Math.hypot(s.pts[1][0] - s.pts[0][0], s.pts[1][1] - s.pts[0][1]);
      close(len, K.KV * n.P[i] / Math.hypot(F[0], F[1]));
      // the band lies on the line of the force: direction parallel to F (in pixels F is mirrored in y)
      const d = [s.pts[1][0] - s.pts[0][0], s.pts[1][1] - s.pts[0][1]];
      close(d[0] * -F[1] - d[1] * F[0], 0, 1e-6);
      expect(shape(f, `dr${i + 1}`)?.o).toBe(1);
    }
    const a = rectTop(f, 'L-P1'), b = rectTop(f, 'L-P2');
    close(a.y0, yP(0)); close(a.y1, yP(n.P[0])); close(b.y0, yP(n.P[0])); close(b.y1, yP(n.total));
    close(n.total, 5.5);
    expect(hasLabel(f, 'tot-L') && hasLabel(f, 'title-L')).toBe(true);
    expect(shape(f, 'L-t1')).toBeUndefined();
  });
  it('step 3 (final): every bar splits into F_i·v_B and F_i·(ω×BA_i); the pieces end where P_i ended', () => {
    const f2 = proofScene(2, 1, 'de'), f = proofScene(3, 1, 'de');
    const ids = ['L-t1', 'L-r1', 'L-t2', 'L-r2'], vals = [n.trans[0], n.rot[0], n.trans[1], n.rot[1]];
    let c = 0;
    ids.forEach((id, i) => { const r = rectTop(f, id); close(r.y0, yP(c)); c += vals[i]; close(r.y1, yP(c)); });
    close(c, n.total);
    // the second piece of force i ends exactly where the bar P_i ended
    close(rectTop(f, 'L-r1').y1, rectTop(f2, 'L-P1').y1); close(rectTop(f, 'L-r2').y1, rectTop(f2, 'L-P2').y1);
    // shadow of the sum = sum of the shadows: rose band + purple band end where the grey band of step 2 ended
    for (let i = 0; i < 2; i++) {
      const gray = shape(f2, `sh${i + 1}p`)!, t = shape(f, `sh${i + 1}t`)!, r = shape(f, `sh${i + 1}r`)!;
      close(t.pts[0][0], gray.pts[0][0]); close(t.pts[1][0], r.pts[0][0]); close(t.pts[1][1], r.pts[0][1]);
      close(r.pts[1][0], gray.pts[1][0]); close(r.pts[1][1], gray.pts[1][1]);
      const F = PROOF.forces[i].F;
      close(Math.hypot(t.pts[1][0] - t.pts[0][0], t.pts[1][1] - t.pts[0][1]), K.KV * n.trans[i] / Math.hypot(F[0], F[1]));
    }
    expect(hasLabel(f, 'lab-Ls0') && hasLabel(f, 'lab-Ls3')).toBe(true);
    expect(shape(f, 'L-P1')).toBeUndefined();
  });
  it('step 4 (final): R = F₁ + F₂ at B, shadow of v_B on R = R·v_B/|R|, right stack [t₁, t₂] reaches R·v_B', () => {
    const f = proofScene(4, 1, 'de');
    const R = shape(f, 'R')!, B = px(PROOF.B);
    close(R.pts[1][0] - B[0], K.KF * n.R[0]); close(R.pts[1][1] - B[1], -K.KF * n.R[1]);
    expect(n.R[0]).toBeCloseTo(PROOF.forces[0].F[0] + PROOF.forces[1].F[0], 12);
    const sh = shape(f, 'shR')!;
    close(Math.hypot(sh.pts[1][0] - sh.pts[0][0], sh.pts[1][1] - sh.pts[0][1]), K.KV * Math.abs(shadow(PROOF.vB, n.R as [number, number])));
    close(shadow(PROOF.vB, n.R as [number, number]) * Math.hypot(...n.R), n.translation);
    const a = rectTop(f, 'R-t1'), b = rectTop(f, 'R-t2');
    close(a.y0, yP(0)); close(a.y1, yP(n.trans[0])); close(b.y0, yP(n.trans[0])); close(b.y1, yP(n.translation));
    close(a.x0, K.RX[0]); close(a.x1, K.RX[1]);
    expect(shape(f, 'R-r1')).toBeUndefined();
    expect(hasLabel(f, 'title-R') && hasLabel(f, 'lab-RvB')).toBe(true);
    expect(shape(f, 'F1')!.o).toBeLessThan(1); // the single forces are dimmed: R replaces them
  });
  it('step 5 (final): moments M₁, M₂, M_B = ΣM_i as ⊙; right stack on top reaches R·v_B + M_B·ω = P', () => {
    const f = proofScene(5, 1, 'de');
    for (const k of ['M1-dot', 'M2-dot', 'MB-dot']) expect(shape(f, k)?.o, k).toBe(1);
    close(n.Mi[0] + n.Mi[1], n.MB); close(PROOF.omega * n.MB, n.rotation);
    const a = rectTop(f, 'R-r1'), b = rectTop(f, 'R-r2');
    close(a.y0, yP(n.translation)); close(a.y1, yP(n.translation + n.rot[0])); close(b.y1, yP(n.translation + n.rotation));
    close(b.y1, yP(n.total));
    expect(hasLabel(f, 'lab-MB')).toBe(true);
    expect(lab(f, 'title-R')?.rows?.length).toBe(2);
  });
  it('step 6 (final): both stacks end at the same height — P = R·v_B + M_B·ω = Σ F_i·v_i', () => {
    const f = proofScene(6, 1, 'de');
    const topL = rectTop(f, 'L-r2').y1, topR = rectTop(f, 'R-r2').y1;
    close(topL, topR); close(topL, yP(n.total));
    expect(shape(f, 'eq')?.o).toBe(1);
    expect(hasLabel(f, 'tot-L') && hasLabel(f, 'tot-R')).toBe(true);
    expect(f.data.total).toBeCloseTo(n.sumP, 12);
    expect(f.data.translation + f.data.rotation).toBeCloseTo(f.data.total, 12);
    expect(shape(f, 'MB-dot')?.o).toBe(1); expect(shape(f, 'M1-dot')).toBeUndefined();
  });
  it('English: same geometry, other words', () => {
    const f = proofScene(1, 1, 'en'), g = proofScene(1, 1, 'de');
    expect(f.shapes.map((s) => s.key)).toEqual(g.shapes.map((s) => s.key));
    expect(lab(f, 'leg-t')!.tex).toContain('translation'); expect(lab(g, 'leg-t')!.tex).toContain('Verschiebung');
    expect(proofScene(6, 1, 'de').labels.find((l) => l.key === 'tot-L')!.tex).toContain('{,}');
    expect(proofScene(6, 1, 'en').labels.find((l) => l.key === 'tot-L')!.tex).not.toContain('{,}');
  });
  it('the animation itself: elements of the next step are not there yet at t = 0', () => {
    expect(shape(proofScene(2, 0, 'de'), 'L-P1')).toBeUndefined();
    // the pieces start in the left stack (copies on top of their originals) and slide over
    close(rectTop(proofScene(4, 0, 'de'), 'R-t1').x0, K.LX[0]); close(rectTop(proofScene(4, 1, 'de'), 'R-t1').x0, K.RX[0]);
    expect(shape(proofScene(3, 1, 'de'), 'R-t1')).toBeUndefined();
    expect(shape(proofScene(6, 0, 'de'), 'eq')).toBeUndefined();
    expect(NUM.total).toBeCloseTo(5.5, 12);
  });
});
