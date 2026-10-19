import { describe, expect, it } from 'vitest';
import {
  GEAR, R3, TEETH, armLength, bodyVelocity, contactVelocities, gearState, meshPhases, omega3, omegaArm, omegaArmBoxed,
  planetLineVelocity, ratioRingFixed, vA, vP, vQ, z3FromO, z3P, type Gear,
} from './planetary';

const g = GEAR;
const CASES: [number, number][] = [[1, 0.5], [1, 0], [0, 1], [1, -0.2], [-0.7, 0.9], [0.3, 0.3], [1, 0.8 / 2.8]];

describe('Planetengetriebe (p. 28): geometry of Fig. 3.21', () => {
  it('R₃ = ½(R₂ − R₁), L = R₁ + R₃ = ½(R₂ + R₁); planet touches sun and ring', () => {
    for (const G of [g, { R1: 1, R2: 4 }, { R1: 0.3, R2: 1.1 }] as Gear[]) {
      expect(R3(G)).toBeCloseTo((G.R2 - G.R1) / 2, 12);
      expect(armLength(G)).toBeCloseTo(G.R1 + R3(G), 12);
      expect(armLength(G)).toBeCloseTo((G.R2 + G.R1) / 2, 12);
      expect(armLength(G) - R3(G)).toBeCloseTo(G.R1, 12); // P: on the sun's rim
      expect(armLength(G) + R3(G)).toBeCloseTo(G.R2, 12); // Q: on the ring's rim
    }
  });
  it('the figure gear: R₁ = 0.8, R₂ = 2.8 → R₃ = 1, L = 1.8; teeth in proportion, N₂ = N₁ + 2N₃', () => {
    expect(R3(g)).toBeCloseTo(1, 12); expect(armLength(g)).toBeCloseTo(1.8, 12);
    expect(TEETH.N2).toBe(TEETH.N1 + 2 * TEETH.N3);
    expect(TEETH.N1 / g.R1).toBeCloseTo(TEETH.N3 / R3(g), 12); expect(TEETH.N2 / g.R2).toBeCloseTo(TEETH.N1 / g.R1, 12);
  });
});

describe('the handwritten solution', () => {
  it('ω₃ solves the two equations Z₃P·ω₃ = v_P and (Z₃P + PQ)·ω₃ = v_Q (solved here as a linear system)', () => {
    for (const [w1, w2] of CASES) {
      const PQ = g.R2 - g.R1;
      // unknowns x = Z₃P·ω₃, y = ω₃: x = v_P, x + PQ·y = v_Q
      const y = (vQ(g, w2) - vP(g, w1)) / PQ;
      expect(omega3(g, w1, w2)).toBeCloseTo(y, 12);
      const d = z3P(g, w1, w2);
      if (d !== null) {
        expect(d * omega3(g, w1, w2)).toBeCloseTo(vP(g, w1), 12);
        expect((d + PQ) * omega3(g, w1, w2)).toBeCloseTo(vQ(g, w2), 12);
      }
    }
  });
  it('v_A = ½(v_P + v_Q) is the velocity of the planet centre (linear distribution along PQ)', () => {
    for (const [w1, w2] of CASES) {
      expect(planetLineVelocity(g, w1, w2, armLength(g))).toBeCloseTo(vA(g, w1, w2), 12);
      expect(planetLineVelocity(g, w1, w2, g.R1)).toBeCloseTo(vP(g, w1), 12);
      expect(planetLineVelocity(g, w1, w2, g.R2)).toBeCloseTo(vQ(g, w2), 12);
      const z = z3FromO(g, w1, w2);
      if (z !== null) expect(planetLineVelocity(g, w1, w2, z)).toBeCloseTo(0, 12); // Z₃ is at rest
    }
  });
  it('ω_Arm = v_A/L equals the boxed result ω₂R₂/(R₂+R₁) + ω₁R₁/(R₂+R₁)', () => {
    for (const [w1, w2] of CASES) expect(omegaArm(g, w1, w2)).toBeCloseTo(omegaArmBoxed(g, w1, w2), 12);
    for (const G of [{ R1: 1, R2: 4 }, { R1: 0.5, R2: 3.5 }] as Gear[]) expect(omegaArm(G, 0.4, -1.3)).toBeCloseTo(omegaArmBoxed(G, 0.4, -1.3), 12);
  });
  it('ω_Arm is a weighted mean: it lies between ω₁ and ω₂', () => {
    for (const [w1, w2] of CASES) {
      const a = omegaArm(g, w1, w2);
      expect(a).toBeGreaterThanOrEqual(Math.min(w1, w2) - 1e-12); expect(a).toBeLessThanOrEqual(Math.max(w1, w2) + 1e-12);
    }
    expect(omegaArm(g, 0.6, 0.6)).toBeCloseTo(0.6, 12); // ω₁ = ω₂: everything turns together, ω₃ = ω_Arm = ω
    expect(omega3(g, 0.6, 0.6)).toBeCloseTo(0.6, 12);
  });
});

describe('special cases (the student’s notes, R-023)', () => {
  it('ring fixed (ω₂ = 0): ω_Arm = ω₁R₁/(R₁+R₂); Übersetzungsverhältnis i = ω₁/ω_Arm = 1 + R₂/R₁ = 4.5; Z₃ = Q', () => {
    expect(omegaArm(g, 1, 0)).toBeCloseTo(0.8 / 3.6, 12);
    expect(1 / omegaArm(g, 1, 0)).toBeCloseTo(ratioRingFixed(g), 12);
    expect(ratioRingFixed(g)).toBeCloseTo(4.5, 12);
    expect(omega3(g, 1, 0)).toBeCloseTo(-0.4, 12); // the planet turns backwards
    expect(z3FromO(g, 1, 0)).toBeCloseTo(g.R2, 12);
  });
  it('sun fixed (ω₁ = 0): Z₃ = P, ω₃ = ω₂R₂/(R₂ − R₁), ω_Arm = ω₂R₂/(R₁+R₂)', () => {
    expect(z3FromO(g, 0, 1)).toBeCloseTo(g.R1, 12);
    expect(omega3(g, 0, 1)).toBeCloseTo(1.4, 12);
    expect(omegaArm(g, 0, 1)).toBeCloseTo(2.8 / 3.6, 12);
  });
  it('ω₂R₂ = ω₁R₁ ⇒ ω₃ = 0: the planet only shifts (all its points as fast as A), Z₃ «at infinity»', () => {
    const w2 = g.R1 / g.R2;
    expect(omega3(g, 1, w2)).toBeCloseTo(0, 12);
    expect(z3P(g, 1, w2)).toBeNull();
    expect(vA(g, 1, w2)).toBeCloseTo(vP(g, 1), 12); expect(vA(g, 1, w2)).toBeCloseTo(vQ(g, w2), 12);
    expect(omegaArm(g, 1, w2)).toBeCloseTo(0.8 / 1.8, 12);
  });
  it('ω₂ < 0 slows the arm down («ω₂ < 0 ⇒ ω_Arm ↓»); at ω₂ = −ω₁R₁/R₂ the arm stands still', () => {
    expect(omegaArm(g, 1, -0.2)).toBeLessThan(omegaArm(g, 1, 0));
    expect(omegaArm(g, 1, -0.2)).toBeCloseTo(0.24 / 3.6, 12);
    expect(omegaArm(g, 1, -g.R1 / g.R2)).toBeCloseTo(0, 12);
    // v_P > 0 and v_Q < 0: Z₃ lies between P and Q
    const z = z3FromO(g, 1, -0.2)!;
    expect(z).toBeGreaterThan(g.R1); expect(z).toBeLessThan(g.R2);
  });
  it('the animation’s values ω₁ = 1, ω₂ = 0.5 (as drawn in Fig. 3.21: v_Q > v_P > 0, Z₃ below O)', () => {
    expect(vP(g, 1)).toBeCloseTo(0.8, 12); expect(vQ(g, 0.5)).toBeCloseTo(1.4, 12);
    expect(omega3(g, 1, 0.5)).toBeCloseTo(0.3, 12);
    expect(z3P(g, 1, 0.5)).toBeCloseTo(8 / 3, 12);
    expect(z3FromO(g, 1, 0.5)!).toBeLessThan(0); expect(z3FromO(g, 1, 0.5)!).toBeGreaterThan(-g.R2);
    expect(vA(g, 1, 0.5)).toBeCloseTo(1.1, 12);
    expect(omegaArm(g, 1, 0.5)).toBeCloseTo(1.1 / 1.8, 12);
  });
});

describe('the gear in motion (figure): rolling without slipping and meshing teeth', () => {
  it('at every time the planet and the sun have the same velocity at P, the planet and the ring at Q', () => {
    for (const [w1, w2] of CASES) for (const t of [0, 0.7, 3.1, 12.4, 40]) {
      const s = gearState(g, w1, w2, t, TEETH), v = contactVelocities(g, w1, w2, s);
      expect(v.planetP[0]).toBeCloseTo(v.sunP[0], 10); expect(v.planetP[1]).toBeCloseTo(v.sunP[1], 10);
      expect(v.planetQ[0]).toBeCloseTo(v.ringQ[0], 10); expect(v.planetQ[1]).toBeCloseTo(v.ringQ[1], 10);
      // A: the arm's point and the planet's centre coincide; the planet centre moves on its circle of radius L
      expect(Math.hypot(...s.A)).toBeCloseTo(armLength(g), 12);
      expect(Math.hypot(...v.armA)).toBeCloseTo(Math.abs(vA(g, w1, w2)), 10);
    }
  });
  it('the planet centre’s path is consistent with the arm: numeric derivative of A(t) = ω_Arm e_z × A', () => {
    const h = 1e-6, s0 = gearState(g, 1, 0.5, 2, TEETH), s1 = gearState(g, 1, 0.5, 2 + h, TEETH);
    const num: [number, number] = [(s1.A[0] - s0.A[0]) / h, (s1.A[1] - s0.A[1]) / h];
    const ex = bodyVelocity([0, 0], [0, 0], omegaArm(g, 1, 0.5), s0.A);
    expect(num[0]).toBeCloseTo(ex[0], 5); expect(num[1]).toBeCloseTo(ex[1], 5);
  });
  it('the teeth stay in mesh: both meshing phases keep their start values (π and 0) for all times', () => {
    for (const [w1, w2] of CASES) for (const t of [0, 1.3, 7.9, 55]) {
      const p = meshPhases(gearState(g, w1, w2, t, TEETH), TEETH);
      const d1 = Math.abs(p.sunPlanet - Math.PI), d2 = Math.min(p.planetRing, 2 * Math.PI - p.planetRing);
      expect(d1).toBeLessThan(1e-8); expect(d2).toBeLessThan(1e-8);
    }
  });
});
