import { describe, expect, it } from 'vitest';
import {
  actsAlongConnection, areaSum, classify, cubeMass, densityRatio, integrate, ladder, leverArm, lineResultant, lorentz, midpointSum,
  moment, momentAbout, momentGroup, partialSums, power, powerAngle, powerKind, powerReduced, powerRotation, powerSplit, powerSum,
  powerViaMoment, reaction, resultant, rigidVelocity, rotVelocity, sumForces, supportForces, weightBox, weightHomogeneous,
  type Interaction, type PointForce,
} from './force';
import { add, dot, norm, scale, sub, vecApproxEqual, type Vec3 } from './vec';

const close = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThanOrEqual(tol * Math.max(1, Math.abs(a), Math.abs(b)));
// a deterministic pseudo-random sequence
function rng(seed: number) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32) * 2 - 1; }
const rv = (r: () => number, k = 3): Vec3 => [r() * k, r() * k, r() * k];

describe('p. 29: Kräftegruppe with a common point of application', () => {
  it('R = ΣF_i, order does not matter, partial sums end in R', () => {
    const fs = [{ F: [1, 2, 0] as Vec3 }, { F: [-3, 1, 0] as Vec3 }, { F: [0, -4, 2] as Vec3 }];
    expect(resultant(fs)).toEqual([-2, -1, 2]);
    expect(resultant([...fs].reverse())).toEqual([-2, -1, 2]);
    const ps = partialSums(fs);
    expect(ps[0]).toEqual([1, 2, 0]); expect(ps[2]).toEqual(resultant(fs));
  });
  it('Fig. 4.2 style group of five forces: R is the vector sum', () => {
    const F: Vec3[] = [[0.4, -1, 0], [-1, -3, 0], [-1.2, 0.3, 0], [0.5, 2.6, 0], [2.4, 2.5, 0]];
    const R = resultant(F.map((f) => ({ F: f })));
    close(R[0], 1.1); close(R[1], 1.4);
  });
});

describe('p. 30: Reaktionsprinzip', () => {
  it('the reaction is {A₁|−F}; pair sums to zero', () => {
    const actio: PointForce = { A: [1, 0, 0], F: [2, -1, 3] };
    const re = reaction(actio, [0, 0, 0]);
    expect(re.F).toEqual([-2, 1, -3]);
    expect(resultant([actio, re])).toEqual([0, 0, 0]);
  });
  it('Zusatzpostulat: for a Fernkraft along A₁A₂ the line of action is the connecting line', () => {
    const A1: Vec3 = [0, 0, 0], A2: Vec3 = [3, 4, 0];
    expect(actsAlongConnection(A1, A2, [6, 8, 0])).toBe(true);
    expect(actsAlongConnection(A1, A2, [-3, -4, 0])).toBe(true);
    expect(actsAlongConnection(A1, A2, [4, -3, 0])).toBe(false);
  });
});

describe('pp. 30–31: Systemabgrenzung (inner / outer forces)', () => {
  // Lastkörper (L) on Träger (T) on Stütze (S): contact forces N (on L), R (friction on L), support force FA on T; plus external G, Z on L.
  const N: Vec3 = [0, 5, 0], R: Vec3 = [-2, 0, 0], FA: Vec3 = [-1, 3, 0];
  const I: Interaction[] = [
    { id: 'N', on: 'L', by: 'T', Aon: [1, 1, 0], Aby: [1, 1, 0], F: N },
    { id: 'R', on: 'L', by: 'T', Aon: [1, 1, 0], Aby: [1, 1, 0], F: R },
    { id: 'FA', on: 'T', by: 'S', Aon: [0, 0, 0], Aby: [0, 0, 0], F: FA },
    { id: 'G', on: 'L', by: 'Erde', Aon: [1, 2, 0], Aby: [0, 0, 0], F: [0, -5, 0] },
    { id: 'Z', on: 'L', by: 'Seil', Aon: [2, 2, 0], Aby: [9, 2, 0], F: [2, 0, 0] },
  ];
  it('Lastkörper alone: N and R are outer forces', () => {
    const { inner, outer } = classify(new Set(['L']), I);
    expect(inner).toHaveLength(0);
    expect(outer.map((o) => o.id).sort()).toEqual(['G', 'N', 'R', 'Z']);
  });
  it('Lastkörper + Träger: N, R become inner (as pairs), FA is outer; inner forces sum to 0', () => {
    const { inner, outer } = classify(new Set(['L', 'T']), I);
    expect(inner.map((o) => o.id).sort()).toEqual(["N", "N'", 'R', "R'"]);
    expect(outer.map((o) => o.id).sort()).toEqual(["FA'", 'G', 'Z'].sort().map((x) => (x === "FA'" ? 'FA' : x)));
    expect(sumForces(inner)).toEqual([0, 0, 0]);
  });
  it('whole system incl. support: FA is inner too', () => {
    const { inner } = classify(new Set(['L', 'T', 'S']), I);
    expect(inner.map((o) => o.id)).toContain('FA');
    expect(sumForces(inner)).toEqual([0, 0, 0]);
  });
  it('support forces of the example are in equilibrium with weight and pull (lever rule, moments about A)', () => {
    const ell = 4, x = 1.5, G = 8, Z = 3;
    const { FA: fa, FB: fb } = supportForces(ell, x, G, Z);
    // forces on the beam: block's −N = (0,−G), −R = (Z,0) at x, supports at 0 and ell
    const sum = add(add(fa, fb), [Z, -G, 0]);
    close(sum[0], 0); close(sum[1], 0);
    // moment about A (z-component): x·(−G) + ell·FB_y = 0  (friction acts on the beam's top at zero thickness)
    close(x * -G + ell * fb[1], 0);
  });
});

describe('p. 32: verteilte Kräfte', () => {
  it('Linienkraft: constant q gives qL; triangle gives ½ q₀ L; the midpoint sums converge to ∫', () => {
    close(lineResultant(() => 3, 4), 12);
    close(lineResultant((x) => 6 * x / 4, 4), 12);
    close(lineResultant((x) => Math.sin(x), Math.PI), 2, 1e-8);
    const f = (x: number) => x * x;
    let prev = Infinity;
    for (const n of [1, 2, 4, 8, 16, 32]) { const err = Math.abs(midpointSum(f, 0, 3, n) - 9); expect(err).toBeLessThan(prev); prev = err; }
    expect(prev).toBeLessThan(0.01);
  });
  it('midpointSum is exact for linear q (Trapez-like cancellation)', () => {
    close(midpointSum((x) => 2 * x + 1, 0, 3, 1), integrate((x) => 2 * x + 1, 0, 3));
  });
  it('Flächenkraft: uniform s gives s·A; midpoint sum for s = x·y', () => {
    close(areaSum(() => 5, 2, 3, 4), 30);
    close(areaSum((x, y) => x * y, 2, 3, 8), (2 * 2 / 2) * (3 * 3 / 2), 1e-3);
  });
  it('Parenthèse: ΔM → 0 but ΔM/ΔV → ρ(c)', () => {
    const rho = (p: Vec3) => 1000 + 500 * p[0] + 200 * p[2] * p[2];
    const c: Vec3 = [1, 0, 0.5];
    const hs = [1, 0.5, 0.25, 0.1, 0.01];
    const masses = hs.map((h) => cubeMass(rho, c, h));
    for (let i = 1; i < masses.length; i++) expect(masses[i]).toBeLessThan(masses[i - 1]);
    expect(masses[4]).toBeLessThan(masses[0] * 1e-5);
    const ratios = hs.map((h) => densityRatio(rho, c, h));
    close(ratios[4], rho(c), 1e-4);
    expect(Math.abs(ratios[4] - rho(c))).toBeLessThan(Math.abs(ratios[0] - rho(c)));
    expect(ratios[4]).toBeGreaterThan(900);
  });
  it('Gewicht: homogeneous G = −ρ g V e_z; a density field integrates to the same for constant ρ; 1 L water ≈ 9.81 N', () => {
    expect(weightHomogeneous(1000, 9.81, 0.001)[2]).toBeCloseTo(-9.81, 12);
    const G = weightBox(() => 7850, 9.81, 0.1, 0.2, 0.3);
    close(G[2], weightHomogeneous(7850, 9.81, 0.006)[2], 1e-12);
    // linear density: mean value in the middle
    const Gl = weightBox((p) => 1000 + 400 * p[2], 9.81, 1, 1, 2, 8);
    close(Gl[2], -9.81 * (1000 * 2 + 200 * 4), 1e-9);
  });
});

describe('p. 33: P = F·v', () => {
  it('P = |F||v| cos α, classification Antrieb / Widerstand / leistungslos', () => {
    const v: Vec3 = [2, 0, 0];
    expect(powerKind([3, 1, 0], v)).toBe('drive');
    expect(powerKind([-3, 1, 0], v)).toBe('resist');
    expect(powerKind([0, 5, 0], v)).toBe('none');
    close(power([3, 4, 0], v), 6);
    close(power([3, 4, 0], v), norm([3, 4, 0]) * norm(v) * Math.cos(powerAngle([3, 4, 0], v)!));
    expect(powerAngle([0, 0, 0], v)).toBeNull();
  });
  it('Normalkraft ⟂ tangential velocity, Lorentzkraft ⟂ v: P = 0 for random data', () => {
    const r = rng(7);
    for (let k = 0; k < 50; k++) {
      const v = rv(r), B = rv(r), q = r();
      expect(Math.abs(power(lorentz(q, v, B), v))).toBeLessThan(1e-12);
    }
    expect(power([0, 7, 0], [4, 0, 0])).toBe(0);
  });
  it('contact pair: N on ball + (−N) on ground: total power N·(v₁−v₂) = 0 for equal normal velocity components', () => {
    const N: Vec3 = [0, 3, 0];
    const v1: Vec3 = [2, 0, 0], v2: Vec3 = [-1, 0, 0]; // tangential, both ⟂ N (non-penetration)
    close(power(N, v1) + power(scale(-1, N), v2), 0);
  });
});

describe('pp. 33–34: Leistung einer Kraft bei Rotation', () => {
  it('P = F·(ω×OP) = ω·(OP×F) = ω·M_O for random data (cyclic triple product)', () => {
    const r = rng(11);
    for (let k = 0; k < 100; k++) {
      const O = rv(r), P = rv(r), F = rv(r), om = rv(r);
      const f: PointForce = { A: P, F };
      close(powerRotation(om, O, f), powerViaMoment(om, O, f), 1e-12);
      close(power(F, rotVelocity(om, O, P)), dot(om, moment(O, f)), 1e-12);
    }
  });
  it('M_O = OP×F = F×PO; |M| = F · lever arm', () => {
    const f: PointForce = { A: [2, 1, 0], F: [1, 3, 0] };
    const O: Vec3 = [0, 0, 0];
    expect(moment(O, f)).toEqual([0, 0, 5]);
    expect(vecApproxEqual(moment(O, f), cross3(f.F, sub(O, f.A)))).toBe(true);
    close(leverArm(O, f), 5 / Math.hypot(1, 3));
  });
  it('Merke: M_O ≠ M_O′ in general, but M_O·ω = M_O′·ω for O′ on the axis, and M_z agrees', () => {
    const r = rng(23);
    for (let k = 0; k < 100; k++) {
      const axis: Vec3 = [0, 0, 1], om: Vec3 = [0, 0, r() * 3];
      const O: Vec3 = [0, 0, r()], O2: Vec3 = [0, 0, r() * 2 + 2];
      const f: PointForce = { A: [r() * 3, r() * 3, r() * 3], F: rv(r) };
      const dM = sub(moment(O2, f), moment(O, f));
      if (Math.abs(O[2] - O2[2]) > 1e-3 && norm(f.F) > 1e-3) expect(norm(dM)).toBeGreaterThan(0); // vectors differ (unless F ∥ axis) …
      close(dot(moment(O, f), om), dot(moment(O2, f), om), 1e-12);
      close(momentAbout(axis, O, f), momentAbout(axis, O2, f), 1e-12);
    }
  });
  it('M_O′ − M_O = O′O × F, which is ⟂ ω for O, O′ on the axis', () => {
    const O: Vec3 = [0, 0, 0], O2: Vec3 = [0, 0, 2], f: PointForce = { A: [1, 2, 3], F: [4, -1, 2] };
    const d = sub(moment(O2, f), moment(O, f));
    expect(vecApproxEqual(d, cross3(sub(O, O2), f.F))).toBe(true);
    close(dot(d, [0, 0, 1]), 0);
  });
});

function cross3(a: Vec3, b: Vec3): Vec3 { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }

describe('pp. 34–35: Kräftegruppe am starren Körper, P = R·v_B + M_B·ω', () => {
  it('same point: Σ F_i·v_A = R·v_A', () => {
    const r = rng(3);
    const fs = [0, 1, 2, 3].map(() => ({ A: [1, 2, 3] as Vec3, F: rv(r) }));
    const v = rv(r);
    close(fs.reduce((s, f) => s + dot(f.F, v), 0), dot(resultant(fs), v), 1e-12);
  });
  it('the proof (p. 35): Σ F_i·v_i = R·v_B + ω·M_B for random forces, points, B, v_B, ω', () => {
    const r = rng(99);
    for (let k = 0; k < 200; k++) {
      const n = 1 + Math.floor(Math.abs(r()) * 5);
      const fs: PointForce[] = Array.from({ length: n }, () => ({ A: rv(r, 4), F: rv(r) }));
      const B = rv(r, 4), vB = rv(r), om = rv(r);
      const red = powerReduced(fs, B, vB, om);
      close(red.total, powerSum(fs, B, vB, om), 1e-11);
      close(red.translation + red.rotation, red.total, 1e-12);
      // per-force split adds up too
      close(fs.reduce((s, f) => s + powerSplit(f, B, vB, om).total, 0), red.total, 1e-11);
      expect(vecApproxEqual(red.M, momentGroup(B, fs))).toBe(true);
    }
  });
  it('P does not depend on the reference point: change B to B′ with v_B′ = v_B + ω×BB′ — R·v and M·ω change, the sum does not', () => {
    const r = rng(5);
    const fs: PointForce[] = Array.from({ length: 4 }, () => ({ A: rv(r, 4), F: rv(r) }));
    const B = rv(r, 2), vB = rv(r), om = rv(r), B2 = rv(r, 2);
    const a = powerReduced(fs, B, vB, om), b = powerReduced(fs, B2, rigidVelocity(B, vB, om, B2), om);
    close(a.total, b.total, 1e-11);
    expect(Math.abs(a.translation - b.translation)).toBeGreaterThan(1e-6);
  });
  it('translation only (ω=0): P = R·v; rotation about B (v_B=0): P = ω·M_B', () => {
    const fs: PointForce[] = [{ A: [1, 0, 0], F: [0, 2, 0] }, { A: [0, 1, 0], F: [-1, 0, 0] }];
    const a = powerReduced(fs, [0, 0, 0], [3, 1, 0], [0, 0, 0]);
    close(a.total, dot(resultant(fs), [3, 1, 0])); expect(a.rotation).toBe(0);
    const b = powerReduced(fs, [0, 0, 0], [0, 0, 0], [0, 0, 2]);
    expect(b.translation).toBe(0); close(b.total, 2 * (2 + 1));
  });
});

describe('pp. 35–36: Figur 5.6, die Leiter', () => {
  const s2 = Math.SQRT2 / 2;
  const cases = [
    { L: 3, G: 40, W: 25, v: 1.2, omega: 0.8 }, { L: 2, G: 10, W: 0, v: 1, omega: 1 }, { L: 1, G: 0, W: 7, v: -2, omega: 0.3 },
    { L: 5, G: 100, W: 60, v: 0, omega: -1.5 }, { L: 1, G: 3, W: 4, v: 0, omega: 0 },
  ];
  it('forces and velocities as in the handwritten solution', () => {
    const m = ladder(cases[0]);
    expect(vecApproxEqual(m.FB, [0, -40, 0])).toBe(true);
    expect(vecApproxEqual(m.FC, [-s2 * 25, s2 * 25, 0])).toBe(true);
    expect(vecApproxEqual(m.vC, [1.2 - 0.8 * 3 * Math.SQRT2 / 4, 0.8 * 3 * Math.SQRT2 / 4, 0])).toBe(true);
    expect(vecApproxEqual(m.vB, [1.2 - 0.8 * 3 * Math.SQRT2 / 2, 0.8 * 3 * Math.SQRT2 / 2, 0])).toBe(true);
    expect(dot(m.FC, sub(m.AB, m.A))).toBeCloseTo(0, 12); // W ⟂ ladder
  });
  it('moments M_AG = AB×G = (0,0,−GL√2/2) and M_AW = AC×W = (0,0,WL/2)', () => {
    const m = ladder(cases[0]);
    const MG = moment(m.A, { A: m.AB, F: m.FB }), MW = moment(m.A, { A: m.AC, F: m.FC });
    close(MG[2], -40 * 3 * s2); close(MW[2], 25 * 3 / 2);
    expect(MG[0]).toBeCloseTo(0, 12); expect(MW[1]).toBeCloseTo(0, 12);
  });
  it('Methode I = Methode II = handwritten closed form; page 36 parts', () => {
    for (const c of cases) {
      const m = ladder(c);
      close(m.methodI, m.methodII, 1e-12); close(m.methodI, m.closed, 1e-12);
      close(m.PB, m.parts.PB, 1e-12); close(m.PC, m.parts.PC, 1e-12);
      close(m.red.translation, m.parts.RvA, 1e-12); close(m.red.rotation, m.parts.MAomega, 1e-12);
      close(m.PB + m.PC, m.parts.RvA + m.parts.MAomega, 1e-12);
    }
  });
});

describe('sanity of helpers', () => {
  it('rigidVelocity keeps SdpG (projections of v on the connecting line agree)', () => {
    const r = rng(41);
    for (let k = 0; k < 50; k++) {
      const B = rv(r), A = rv(r), vB = rv(r), om = rv(r);
      const vA = rigidVelocity(B, vB, om, A), d = sub(A, B);
      close(dot(vA, d), dot(vB, d), 1e-12);
    }
  });
});
