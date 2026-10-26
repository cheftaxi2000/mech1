import { describe, expect, it } from 'vitest';
import { BEAM_BODIES, beamInteractions, classifyBeam, classifyCarts, systemOf, type BeamBody, type BeamGroup } from './systemModel';
import { resultant } from './force';
import { norm } from './vec';

const ids = (xs: { id: string }[]) => xs.map((x) => x.id).sort();
const EX = { G: 100, Z: 50, s: 0.4 };
const near0 = (v: readonly number[]) => expect(norm(v as [number, number, number])).toBeLessThan(1e-9);

describe('p. 31 example (our numbers): every body is in equilibrium', () => {
  it.each([{ G: 100, Z: 50, s: 0.4 }, { G: 40, Z: 0, s: 0.3 }, { G: 120, Z: 80, s: 0.7 }])('%j', (ex) => {
    for (const b of BEAM_BODIES) {
      const { outer, inner } = classifyBeam(ex, new Set<BeamBody>([b]));
      // a single body: no inner forces; the forces acting on it add up to 0
      expect(inner).toEqual([]);
      near0(resultant(outer.map((o) => o.force)));
    }
    expect(beamInteractions(ex).length).toBe(10);
  });
});

describe('Systemabgrenzung: which forces are outer / inner (p. 31)', () => {
  const sys = (...g: BeamGroup[]) => systemOf(g);
  it('Lastkörper alone (coloured picture 1): G, Z, N₁, N₂, R₁, R₂ are all outer', () => {
    const c = classifyBeam(EX, sys('last'));
    expect(ids(c.outer)).toEqual(['G', 'N1', 'N2', 'R1', 'R2', 'Z']);
    expect(c.inner).toEqual([]);
    near0(c.sumOuter);
  });
  it('Lastkörper + Träger (coloured picture 2): G, Z, F_A, F_B outer; N, R and their reactions inner', () => {
    const c = classifyBeam(EX, sys('last', 'traeger'));
    expect(ids(c.outer)).toEqual(['FA', 'FB', 'G', 'Z']);
    expect(ids(c.inner)).toEqual(['N1', "N1'", 'N2', "N2'", 'R1', "R1'", 'R2', "R2'"]);
    near0(c.sumInner); near0(c.sumOuter);
  });
  it('Träger alone: the reactions −N, −R and F_A, F_B', () => {
    const c = classifyBeam(EX, sys('traeger'));
    expect(ids(c.outer)).toEqual(['FA', 'FB', "N1'", "N2'", "R1'", "R2'"]);
  });
  it('everything (with the Stützen): only G, Z and the ground forces are outer — F_A, F_B are inner', () => {
    const c = classifyBeam(EX, sys('last', 'traeger', 'stuetzen'));
    expect(ids(c.outer)).toEqual(['G', 'HA', 'HB', 'Z']);
    expect(ids(c.inner)).toEqual(['FA', "FA'", 'FB', "FB'", 'N1', "N1'", 'N2', "N2'", 'R1', "R1'", 'R2', "R2'"]);
    near0(c.sumOuter);
  });
  it('the same force N₁ is outer for the Lastkörper and inner for Lastkörper + Träger', () => {
    expect(ids(classifyBeam(EX, sys('last')).outer)).toContain('N1');
    expect(ids(classifyBeam(EX, sys('last', 'traeger')).inner)).toContain('N1');
  });
  it('the sum of the inner forces is 0 for each of the 8 choices (Reaktionsprinzip)', () => {
    const groups: BeamGroup[] = ['last', 'traeger', 'stuetzen'];
    for (let m = 0; m < 8; m++) {
      const g = groups.filter((_, i) => (m >> i) & 1);
      for (const ex of [EX, { G: 60, Z: 10, s: 0.65 }]) near0(classifyBeam(ex, systemOf(g)).sumInner);
    }
  });
  it('support forces follow the lever rule: F_A + F_B balances G and Z', () => {
    const c = classifyBeam({ G: 100, Z: 50, s: 0.25 }, systemOf(['last', 'traeger']));
    const FA = c.outer.find((o) => o.id === 'FA')!.force.F, FB = c.outer.find((o) => o.id === 'FB')!.force.F;
    expect(FA[1]).toBeCloseTo(75, 9); expect(FB[1]).toBeCloseTo(25, 9);
    expect(FA[0]).toBeCloseTo(-25, 9);
  });
});

describe('two carts', () => {
  it('cart 1: H and the reaction −P are outer; both carts: only H is outer, P and −P are inner', () => {
    const one = classifyCarts(10, 6, new Set(['w1']));
    expect(ids(one.outer)).toEqual(['H', "P'"]);
    const two = classifyCarts(10, 6, new Set(['w1', 'w2']));
    expect(ids(two.outer)).toEqual(['H']); expect(ids(two.inner)).toEqual(['P', "P'"]);
    near0(two.sumInner); expect(two.sumOuter).toEqual([10, 0, 0]);
    expect(one.sumOuter).toEqual([4, 0, 0]);
  });
});
