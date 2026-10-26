import { describe, expect, it } from 'vitest';
import { ladder } from './force';
import { LADDER_DIR, PROOF, ladderParts, moveReference, plateNumbers, rotPart, shadow, type Plate } from './kraeftegruppe';

const close = (a: number, b: number, tol = 1e-12) => expect(Math.abs(a - b), `${a} vs ${b}`).toBeLessThanOrEqual(tol);
const S2 = Math.SQRT1_2;

describe('the plate of the proof animation (p. 35)', () => {
  const n = plateNumbers(PROOF);
  it('v_i = v_B + ω × BA_i', () => {
    expect(n.v[0]).toEqual([2, -2]);
    expect(n.v[1]).toEqual([0.5, 1.5]);
    expect(rotPart(1, [-1.5, -1])).toEqual([1, -1.5]);
    expect(rotPart(1, [2, 0.5])).toEqual([-0.5, 2]);
  });
  it('P_i = F_i · v_i', () => {
    close(n.P[0], 3); close(n.P[1], 2.5); close(n.sumP, 5.5);
  });
  it('split P_i = F_i·v_B + ω·(BA_i × F_i)', () => {
    close(n.trans[0], 1); close(n.trans[1], 1.5); close(n.rot[0], 2); close(n.rot[1], 1);
    for (let i = 0; i < 2; i++) close(n.trans[i] + n.rot[i], n.P[i]);
  });
  it('M_i are the moments about B; ω M_i is the rotation part (a·(b×c) = b·(c×a))', () => {
    close(n.Mi[0], 2); close(n.Mi[1], 1);
    for (let i = 0; i < 2; i++) close(PROOF.omega * n.Mi[i], n.rot[i]);
  });
  it('R, M_B, and the boxed formula P = R·v_B + M_B·ω', () => {
    expect(n.R).toEqual([2.5, 0]);
    close(n.MB, 3);
    close(n.translation, 2.5); close(n.rotation, 3); close(n.total, 5.5);
    close(n.total, n.sumP);
    close(n.translation, n.trans[0] + n.trans[1]); close(n.rotation, n.rot[0] + n.rot[1]);
  });
  it('the shadow of the sum is the sum of the shadows (dot product is linear)', () => {
    for (let i = 0; i < 2; i++) {
      const F = PROOF.forces[i].F, A = PROOF.forces[i].A;
      close(shadow(PROOF.vB, F) + shadow(rotPart(PROOF.omega, A), F), shadow(n.v[i], F));
      close(shadow(n.v[i], F) * Math.hypot(F[0], F[1]), n.P[i]);
    }
  });
  it('every part is a multiple of 0.5 W and at least 1 W (the stacked bars stay readable)', () => {
    for (const x of [...n.P, ...n.trans, ...n.rot]) { expect(x).toBeGreaterThanOrEqual(1); close(x * 2, Math.round(x * 2)); }
  });
});

describe('the proof plate described at B′ = A₂ (numbers of docs/QUIZ_BANK.md)', () => {
  it('v_B′ = (0,5; 1,5), R·v_B′ = 1,25, M_B′ = 4,25; the sum stays 5,5 W', () => {
    const q = moveReference(PROOF, [2, 0.5]), n = plateNumbers(q);
    expect(q.vB).toEqual([0.5, 1.5]);
    close(n.translation, 1.25); close(n.MB, 4.25); close(n.rotation, 4.25); close(n.total, 5.5);
  });
});

describe('moving the reference point: the Kinemate changes, the power does not', () => {
  const plates: Plate[] = [
    PROOF,
    { B: [0.5, -0.2], vB: [-0.7, 0.3], omega: -1.3, forces: [{ A: [1, 1], F: [2, -1] }, { A: [-2, 0.5], F: [0, 1.5] }, { A: [0.3, -1.4], F: [-1, -1] }] },
    { B: [0, 0], vB: [0, 0], omega: 2, forces: [{ A: [1, 0], F: [0, 1] }, { A: [-1, 0], F: [0, -1] }] }, // a couple: R = 0
  ];
  const targets: [number, number][] = [[0, 0], [1.5, 1], [-2, 0.5], [3, -3]];
  it('P = Σ F_i·v_i for every B; R·v_B and M_B·ω change separately', () => {
    for (const p of plates) {
      const a = plateNumbers(p);
      close(a.total, a.sumP);
      for (const B2 of targets) {
        const q = moveReference(p, B2), b = plateNumbers(q);
        close(b.total, a.total, 1e-11); close(b.sumP, a.sumP, 1e-11);
        close(b.total, b.sumP, 1e-11);
        b.v.forEach((v, i) => { close(v[0], a.v[i][0], 1e-11); close(v[1], a.v[i][1], 1e-11); }); // the motion itself is unchanged
        close(q.omega, p.omega); // ω is the same for every point
        close(b.R[0], a.R[0]); close(b.R[1], a.R[1]); // R does not depend on B
      }
    }
    const a = plateNumbers(plates[0]), b = plateNumbers(moveReference(plates[0], [1.5, 1]));
    expect(Math.abs(a.translation - b.translation)).toBeGreaterThan(0.1);
    expect(Math.abs(a.rotation - b.rotation)).toBeGreaterThan(0.1);
  });
  it('all forces at one point A, B = A: M_B = 0 and P = R·v_A', () => {
    const A: [number, number] = [0.7, -0.4];
    const p: Plate = { B: A, vB: [1, 2], omega: 1.7, forces: [{ A, F: [1, 0] }, { A, F: [0, 2] }, { A, F: [-0.5, 0.5] }] };
    const n = plateNumbers(p);
    close(n.MB, 0); close(n.rotation, 0);
    close(n.total, n.R[0] * 1 + n.R[1] * 2); close(n.total, n.sumP);
  });
  it('translation only (ω = 0): P = R·v; rotation about B only (v_B = 0): P = M_B·ω', () => {
    const f = PROOF.forces;
    const a = plateNumbers({ ...PROOF, omega: 0 }); close(a.total, a.translation); close(a.rotation, 0);
    const b = plateNumbers({ ...PROOF, vB: [0, 0], forces: f }); close(b.total, b.rotation); close(b.translation, 0);
  });
  it('a couple (R = 0) still has power M_B·ω, the same for every B', () => {
    const p = plates[2];
    const n = plateNumbers(p);
    expect(n.R).toEqual([0, 0]); close(n.MB, 2); close(n.total, 4);
    for (const B2 of targets) close(plateNumbers(moveReference(p, B2)).total, 4, 1e-11);
  });
});

describe('Fig. 5.6, the ladder: the parts drawn in the figures', () => {
  const cases = [
    { L: 4, G: 3, W: 4, v: 1, omega: 0.5 }, { L: 4, G: 30, W: 20, v: 0, omega: 0.6 }, { L: 4, G: 30, W: 20, v: 1.5, omega: 0 },
    { L: 3, G: 12, W: 7, v: -0.8, omega: -0.4 },
  ];
  it('Weg I: only the part of v_B along G and of v_C along W counts (p. 36, III)', () => {
    for (const c of cases) {
      const q = ladderParts(c);
      close(q.alongG, -S2 * c.omega * c.L);
      close(q.alongW, c.omega * c.L / 2 - S2 * c.v);
      close(q.PB, q.m.parts.PB); close(q.PC, q.m.parts.PC);
      close(q.wegI, q.m.methodI);
    }
  });
  it('Weg II: R·v_A and ω·M_A (p. 36, IV); M_A = M_AG + M_AW', () => {
    for (const c of cases) {
      const q = ladderParts(c);
      close(q.MAG, -c.G * c.L * S2); close(q.MAW, c.W * c.L / 2); close(q.MA, q.MAG + q.MAW);
      close(q.RvA, -S2 * c.W * c.v); close(q.MAomega, q.m.parts.MAomega);
      close(q.R[0], -S2 * c.W); close(q.R[1], S2 * c.W - c.G);
    }
  });
  it('both ways give the handwritten result', () => {
    for (const c of cases) {
      const q = ladderParts(c), m = ladder(c);
      close(q.wegI, q.wegII); close(q.wegI, m.closed);
    }
  });
  it('the force directions are unit vectors; W is perpendicular to the ladder', () => {
    close(Math.hypot(...LADDER_DIR.W), 1); close(Math.hypot(...LADDER_DIR.G), 1);
    close(LADDER_DIR.W[0] * S2 + LADDER_DIR.W[1] * S2, 0);
  });
  it('the numbers of the worked values used in the animation (L = 4, v = 1, ω = 0.5, G = 3, W = 4)', () => {
    const q = ladderParts(cases[0]);
    close(q.PB, -3 * Math.SQRT2, 1e-12); // −G(√2/2)ωL = −3·1.414
    close(q.PC, 4 * (1 - S2), 1e-12);
    close(q.RvA, -2 * Math.SQRT2, 1e-12);
    close(q.wegI, -3 * Math.SQRT2 + 4 * (1 - S2), 1e-12);
    close(q.wegI, q.wegII);
  });
});
