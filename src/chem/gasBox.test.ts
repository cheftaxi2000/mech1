import { describe, expect, it } from 'vitest';
import { makeGas, meanKinetic, speedForEnergy, stepGas } from './gasBox';

describe('gas in a box (pictures)', () => {
  it('seeded: same seed, same gas; different seed differs', () => {
    expect(makeGas(12, 1.4, 3)).toEqual(makeGas(12, 1.4, 3));
    expect(makeGas(12, 1.4, 3)).not.toEqual(makeGas(12, 1.4, 4));
  });
  it('particles start inside and stay inside while the piston moves in and out', () => {
    let ps = makeGas(20, 1.5, 1);
    let L = 1.5;
    for (let i = 0; i < 2000; i++) {
      L = 1.0 + 0.5 * Math.cos(i / 40);
      ps = stepGas(ps, 1 / 60, L, 1.3);
      for (const p of ps) { expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThanOrEqual(L + 1e-9); expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThanOrEqual(1); }
    }
  });
  it('elastic walls keep the speed of every particle (fixed wall)', () => {
    const ps0 = makeGas(8, 1.2, 9);
    let ps = ps0;
    for (let i = 0; i < 500; i++) ps = stepGas(ps, 1 / 30, 1.2, 0.8);
    ps.forEach((p, i) => expect(Math.hypot(p.vx, p.vy)).toBeCloseTo(Math.hypot(ps0[i].vx, ps0[i].vy), 12));
  });
  it('mean kinetic energy scales with speed²; speedForEnergy inverts that', () => {
    const ps = makeGas(30, 1, 5);
    expect(meanKinetic(ps, 2) / meanKinetic(ps, 1)).toBeCloseTo(4, 12);
    const s1 = speedForEnergy(1, 1), s2 = speedForEnergy(4, 1);
    expect((s2 / s1) ** 2).toBeCloseTo(4, 12);
    expect(speedForEnergy(0, 1)).toBeGreaterThan(0);
  });
});

import { stepGasRange } from './gasBox';
describe('gas between two moving walls', () => {
  it('stays between the walls even when the left wall sweeps over the particles', () => {
    let ps = makeGas(20, 1, 3);
    for (let i = 0; i < 600; i++) {
      const x0 = Math.min(0.6, i / 600), x1 = 1;
      ps = stepGasRange(ps, 1 / 60, x0, x1, 0.8);
      for (const p of ps) { expect(p.x).toBeGreaterThanOrEqual(x0 - 1e-9); expect(p.x).toBeLessThanOrEqual(x1 + 1e-9); }
    }
  });
  it('a gas confined to the right half spreads over the whole box once the wall is removed', () => {
    let ps = makeGas(30, 1, 8).map((p) => ({ ...p, x: 0.5 + p.x / 2 }));
    for (let i = 0; i < 600; i++) ps = stepGasRange(ps, 1 / 60, 0, 1, 0.8);
    const left = ps.filter((p) => p.x < 0.5).length;
    expect(left).toBeGreaterThan(8); expect(left).toBeLessThan(22);
  });
});
