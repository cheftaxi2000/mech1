import { describe, expect, it } from 'vitest';
import { add, cross, norm, sub, type Vec3 } from './vec';
import { resultant } from './force';
import {
  FIG61, alongLine, axisLeverArm, axisMoment, coupleMoment, cube39, cube40, cube43, disc623, dyname, equivalent, groupMoment,
  groupPower, halfCircleExact, halfCircleSum, inEquilibrium, intersection2, leverArmLine, leverPower, linkage, parallelResultant,
  scaleBalance, seesawBalance, seesawPower, shiftMoment, splitAxis, testMotion, type PointForce, type TestMotion,
} from './statik';

const close3 = (a: Vec3, b: Vec3, d = 9) => a.forEach((x, i) => expect(x).toBeCloseTo(b[i], d));
const MOTIONS: TestMotion[] = ['tx', 'ty', 'rotA', 'rotP'];
const power = (g: PointForce[], m: TestMotion) => { const t = testMotion(m); return groupPower(g, t.B, t.vB, t.omega); };

describe('p. 37: Wippe, Hebel', () => {
  it('power zero exactly at F_A = (b/a) F_B, for every ω', () => {
    const FB = 3, a = 2, b = 1.2, FA = seesawBalance(FB, a, b);
    for (const w of [0.5, -2, 7]) expect(seesawPower(FA, FB, a, b, w)).toBeCloseTo(0, 12);
    expect(seesawPower(FA * 1.1, FB, a, b, 1)).toBeLessThan(0);
  });
  it('the lever: sin α drops out', () => {
    const FB = 3, a = 2, b = 1.2, FA = seesawBalance(FB, a, b);
    for (const al of [0.3, 1, 2.5]) expect(leverPower(FA, FB, a, b, al, 1.7)).toBeCloseTo(0, 12);
  });
});

describe('p. 37: statische Äquivalenz (Fig. 6.1, 6.2, theorem)', () => {
  it('Fig. 6.1: {F₁, F₂} and {R̲ at A} have the same power for every test motion', () => {
    for (const m of MOTIONS) expect(power(FIG61.G, m)).toBeCloseTo(power(FIG61.Gstar, m), 12);
    expect(equivalent(FIG61.G, FIG61.Gstar)).toBe(true);
  });
  it('Fig. 6.2: one counterexample (translation along x) is enough', () => {
    expect(power(FIG61.G62, 'tx')).not.toBeCloseTo(power(FIG61.Gstar, 'tx'), 3);
    expect(equivalent(FIG61.G62, FIG61.Gstar)).toBe(false);
  });
  it('theorem: equal R̲ and M̲_O ⇔ equal power for arbitrary {v̲_O, ω̲}', () => {
    const G: PointForce[] = [{ A: [1, 2, 0], F: [1, 0, 2] }, { A: [-1, 0, 3], F: [0, -2, 1] }];
    const O: Vec3 = [0, 0, 0];
    const { R, M } = dyname(O, G);
    const Gs: PointForce[] = [{ A: O, F: R }, { A: [0, 0, 0], F: [0, 0, 0] }];
    // add a couple with moment M̲ at two points so that G* = {R̲ at O} + couple
    const couple: PointForce[] = (() => { // a couple with moment M: forces ±f at points with M = r × f
      const f: Vec3 = cross(M, [1, 0.3, 0.2]);
      const r: Vec3 = cross(f, M);
      const k = norm(M) / norm(cross(r, f));
      return [{ A: [0, 0, 0], F: scale3(-1, f) }, { A: scale3(k, r), F: f }];
    })();
    const Gstar = [...Gs, ...couple];
    expect(equivalent(G, Gstar)).toBe(true);
    for (const m of [{ B: O, vB: [1, -2, 0.5] as Vec3, omega: [0.3, 1, -2] as Vec3 }, { B: [2, 1, 1] as Vec3, vB: [0, 0, 1] as Vec3, omega: [1, 0, 0] as Vec3 }])
      expect(groupPower(G, m.B, m.vB, m.omega)).toBeCloseTo(groupPower(Gstar, m.B, m.vB, m.omega), 9);
  });
});
const scale3 = (k: number, a: Vec3): Vec3 => [k * a[0], k * a[1], k * a[2]];

describe('p. 38: half circle with line load', () => {
  it('R_x = 0, R_y = −2qr; the sum of n elements converges', () => {
    close3(halfCircleExact(2, 1.5), [0, -6, 0]);
    const R = halfCircleSum(2, 1.5, 4000);
    expect(R[0]).toBeCloseTo(0, 9);
    expect(R[1]).toBeCloseTo(-6, 5);
    expect(Math.abs(halfCircleSum(2, 1.5, 4)[1] + 6)).toBeGreaterThan(Math.abs(halfCircleSum(2, 1.5, 16)[1] + 6));
  });
});

describe('p. 39: moment about a point, Verschiebungssatz, cube', () => {
  it('|M̲_O| = |F̲| a and sliding A along the line changes nothing', () => {
    const O: Vec3 = [0, 0, 0], A: Vec3 = [3, 1, 0], F: Vec3 = [-1, 2, 0];
    const M0 = cross(sub(A, O), F);
    for (const s of [-2, 0.4, 3]) close3(cross(sub(alongLine(A, F, s), O), F), M0);
    expect(norm(M0)).toBeCloseTo(norm(F) * leverArmLine(O, A, F), 12);
  });
  it('cube: OA̲ × F̲ = OB̲ × F̲ = (0, 0, LF)', () => {
    const c = cube39(2, 5);
    close3(cross(c.A, c.F), [0, 0, 10]);
    close3(cross(c.B, c.F), [0, 0, 10]);
  });
});

describe('p. 39–40: moment about an axis, Korollar 1 and 2', () => {
  const e: Vec3 = [0, 0, 1];
  it('M_γ does not depend on where B sits on the axis', () => {
    const A: Vec3 = [2, 1, 0.5], F: Vec3 = [-1, 2, 3];
    const m0 = axisMoment(e, [0, 0, 0], A, F);
    for (const z of [-3, 1, 4]) expect(axisMoment(e, [0, 0, z], A, F)).toBeCloseTo(m0, 12);
  });
  it('Korollar 2: |M_γ| = |F̲^⊥| a; F̲_γ contributes nothing', () => {
    const B: Vec3 = [0, 0, 0], A: Vec3 = [2, 1, 0.5], F: Vec3 = [-1, 2, 3];
    const { Fg, Fperp } = splitAxis(e, F);
    expect(axisMoment(e, B, A, Fg)).toBeCloseTo(0, 12);
    expect(Math.abs(axisMoment(e, B, A, F))).toBeCloseTo(norm(Fperp) * axisLeverArm(e, B, A, F), 12);
  });
  it('Korollar 1: zero when the line meets the axis or is parallel to it', () => {
    expect(axisMoment(e, [0, 0, 0], [2, 0, 0], [-1, 0, 4])).toBeCloseTo(0, 12); // meets the axis
    expect(axisMoment(e, [0, 0, 0], [2, 1, 0], [0, 0, 5])).toBeCloseTo(0, 12);  // parallel
    expect(axisMoment(e, [0, 0, 0], [2, 0, 0], [0, 1, 4])).not.toBeCloseTo(0, 6); // skew
  });
  it('p. 40 cubes: both give M_γ = F^⊥ a', () => {
    for (const right of [false, true]) {
      const c = cube40(1.5, 2, 3, right);
      expect(axisMoment(c.e, c.B, c.A, c.F)).toBeCloseTo(2 * 1.5, 12);
    }
    // right cube: the component of F^⊥ normal to r̲ is √2/2 F^⊥, |r̲| = √2 a
    const c = cube40(1.5, 2, 3, true);
    const r = c.A, Fp: Vec3 = [0, 2, 0];
    expect(norm(cross(r, Fp)) / norm(r)).toBeCloseTo(Math.SQRT1_2 * 2, 12);
  });
});

describe('p. 40–41: moment of a group, Dyname', () => {
  const G: PointForce[] = [{ A: [1, 0, 0], F: [0, 2, 0] }, { A: [0, 2, 1], F: [-1, 0, 1] }, { A: [-1, -1, 0], F: [1, 1, -2] }];
  it('M̲_P = M̲_O + R̲ × OP̲', () => {
    const O: Vec3 = [0, 0, 0], R = resultant(G), MO = groupMoment(O, G);
    for (const P of [[1, 2, 3], [-2, 0.5, 1], [0, 0, 0]] as Vec3[]) close3(groupMoment(P, G), shiftMoment(MO, R, O, P));
  });
  it('the power is the same computed in O and in P (p. 41)', () => {
    const O: Vec3 = [0, 0, 0], P: Vec3 = [2, -1, 1], vO: Vec3 = [1, 0.5, -1], om: Vec3 = [0.2, -1, 0.5];
    const vP = add(vO, cross(om, P));
    const dO = dyname(O, G), dP = dyname(P, G);
    const PO = dO.R[0] * vO[0] + dO.R[1] * vO[1] + dO.R[2] * vO[2] + om[0] * dO.M[0] + om[1] * dO.M[1] + om[2] * dO.M[2];
    const PP = dP.R[0] * vP[0] + dP.R[1] * vP[1] + dP.R[2] * vP[2] + om[0] * dP.M[0] + om[1] * dP.M[1] + om[2] * dP.M[2];
    expect(PP).toBeCloseTo(PO, 12);
    expect(groupPower(G, O, vO, om)).toBeCloseTo(PO, 12);
  });
});

describe('p. 41–43: special groups', () => {
  it('Fig. 6.8: a force may slide along its line, not sideways', () => {
    const F: Vec3 = [2, 1, 0];
    expect(equivalent([{ A: [0, 0, 0], F }], [{ A: alongLine([0, 0, 0], F, 1.3), F }])).toBe(true);
    expect(equivalent([{ A: [0, 0, 0], F }], [{ A: [0.5, -1, 0], F }])).toBe(false);
  });
  it('Fig. 6.9: on the linkage the same force does no work at O but does at A', () => {
    const L = linkage(1.1, 2);
    const F: Vec3 = sub(L.A, L.O); // along the line O → A
    expect(norm(L.vO)).toBe(0);
    expect(Math.abs(F[0] * L.vA[0] + F[1] * L.vA[1])).toBeGreaterThan(0.1);
    close3(L.vC, L.vA);
  });
  it('Fig. 6.11: two forces at A → R̲ at A; M̲_B = M̲_A + R̲ × AB̲ with M̲_A = 0', () => {
    const A: Vec3 = [0, 0, 0], B: Vec3 = [-0.5, 1.5, 0];
    const g: PointForce[] = [{ A, F: [2, 1, 0] }, { A, F: [2, -0.8, 0] }];
    close3(groupMoment(A, g), [0, 0, 0]);
    close3(groupMoment(B, g), shiftMoment([0, 0, 0], resultant(g), A, B));
  });
  it('Fig. 6.12: two non-parallel plane forces ≡ R̲ through the intersection S', () => {
    const g: PointForce[] = [{ A: [1, 1, 0], F: [2, 1, 0] }, { A: [1, -1, 0], F: [2, -1, 0] }];
    const S = intersection2(g[0].A, g[0].F, g[1].A, g[1].F)!;
    close3(S, [-1, 0, 0]);
    expect(equivalent(g, [{ A: S, F: resultant(g) }])).toBe(true);
  });
  it('parallel forces: F₁ a = F₂ b; F₁ = −F₂ is a couple', () => {
    const r = parallelResultant(3, 0, 1, 4)!;
    expect(r.R).toBe(4); expect(r.xR).toBe(1);
    expect(3 * (r.xR - 0)).toBeCloseTo(1 * (4 - r.xR), 12);
    expect(equivalent([{ A: [0, 0, 0], F: [0, -3, 0] }, { A: [4, 0, 0], F: [0, -1, 0] }], [{ A: [r.xR, 0, 0], F: [0, -4, 0] }])).toBe(true);
    expect(parallelResultant(2, 0, -2, 3)).toBeNull();
  });
  it('couple: the same moment about every point; F̲′ = cF̲, b′ = b/c is equivalent', () => {
    const A: Vec3 = [0, 0, 0], A2: Vec3 = [2, 0, 0], F: Vec3 = [0, -1, 0];
    const g: PointForce[] = [{ A, F }, { A: A2, F: scale3(-1, F) }];
    for (const P of [[0, 0, 0], [5, -3, 1], [1, 7, 0]] as Vec3[]) close3(groupMoment(P, g), coupleMoment(A, A2, F));
    const c = 4;
    const g2: PointForce[] = [{ A: [1, 1, 0], F: scale3(c, F) }, { A: [1 + 2 / c, 1, 0], F: scale3(-c, F) }];
    expect(equivalent(g, g2)).toBe(true);
  });
});

describe('p. 43–44: equilibrium', () => {
  it('cube: components and moments about A vanish (as in the notes)', () => {
    const g = cube43(1.5, 2);
    close3(resultant(g), [0, 0, 0]);
    const A: Vec3 = [0, 0, 0];
    close3(cross(sub(g[2].A, A), g[2].F), [0, -1.5 * 2, 0]); // F̲_C × CA̲ = (0, −aF, 0)
    close3(cross(sub(g[1].A, A), g[1].F), [0, 0, 1.5 * 2]);
    close3(cross(sub(g[3].A, A), g[3].F), [0, 1.5 * 2, -1.5 * 2]);
    expect(inEquilibrium(g, A)).toBe(true);
    expect(inEquilibrium(g, [3, -1, 2])).toBe(true);
  });
  it('Fig. 6.23: A = 10 + 2√2, B = 6√2; the force polygon closes', () => {
    const { A, B } = disc623();
    const s = Math.SQRT1_2;
    const sum: Vec3 = [4 - 10 * s + A * s - B * s, -8 - 10 * s + A * s + B * s, 0];
    close3(sum, [0, 0, 0]);
    expect(A).toBeCloseTo(10 + 2 * Math.SQRT2, 12);
    expect(B).toBeCloseTo(6 * Math.SQRT2, 12);
  });
  it('Waage: A_y = F₁ + F₂, a₂ = a₁ F₁/F₂', () => {
    const w = scaleBalance(3, 2, 4);
    expect(w.Ay).toBe(7); expect(w.a2).toBe(1.5);
    expect(3 * 2 - 4 * w.a2).toBe(0);
  });
});
