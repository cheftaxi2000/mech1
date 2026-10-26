import { describe, expect, it } from 'vitest';
import { actsAlongConnection, reaction, resultant } from '../../physics/force';
import { norm } from '../../physics/vec';
import { K2_SCENES } from './k2Data';
import { MIN_GAP, NEAR, fernPair, phys, snapA2, type V } from './k2Geom';

describe('Fernkraft explorer geometry (Zusatzpostulat, p. 30)', () => {
  const A1: V = [100, 150], A2: V = [300, 90];
  it('force and counter-force lie on the line A₁A₂ (force.ts: actsAlongConnection), attractive and repulsive', () => {
    for (const attractive of [true, false]) {
      const p = fernPair(A1, A2, 60, attractive);
      expect(actsAlongConnection(phys(A1), phys(A2), phys(p.onA2), 1e-9)).toBe(true);
      expect(actsAlongConnection(phys(A1), phys(A2), phys(p.onA1), 1e-9)).toBe(true);
    }
  });
  it('the pair is the Reaktionsprinzip: {A₁|−F} = reaction of {A₂|F}; equal length, opposite direction', () => {
    const p = fernPair(A1, A2, 60, true);
    const re = reaction({ A: phys(A2), F: phys(p.onA2) }, phys(A1));
    expect(re.F[0]).toBeCloseTo(phys(p.onA1)[0], 12); expect(re.F[1]).toBeCloseTo(phys(p.onA1)[1], 12);
    expect(norm(phys(p.onA2))).toBeCloseTo(60, 12);
    expect(resultant([{ F: phys(p.onA2) }, { F: phys(p.onA1) }])).toEqual([0, 0, 0]);
  });
  it('attractive: A₂ is pulled towards A₁ (and vice versa); repulsive: away', () => {
    const a = fernPair(A1, A2, 60, true);
    expect(a.onA2[0]).toBeLessThan(0); expect(a.onA1[0]).toBeGreaterThan(0);
    const r = fernPair(A1, A2, 60, false);
    expect(r.onA2[0]).toBeGreaterThan(0);
  });
  it('the forbidden variant (tilted pair) is still equal and opposite but is NOT on the connecting line', () => {
    const p = fernPair(A1, A2, 60, true, (35 * Math.PI) / 180);
    expect(norm(phys(p.onA2))).toBeCloseTo(60, 12);
    expect(resultant([{ F: phys(p.onA2) }, { F: phys(p.onA1) }])).toEqual([0, 0, 0]);
    expect(actsAlongConnection(phys(A1), phys(A2), phys(p.onA2), 1e-9)).toBe(false);
  });
  it('snapping: very close → contact (points coincide); in the ring → pushed out to MIN_GAP; far → unchanged', () => {
    expect(snapA2(A1, [A1[0] + NEAR - 5, A1[1]])).toEqual({ A2: A1, contact: true });
    const mid = snapA2(A1, [A1[0] + NEAR + 5, A1[1]]);
    expect(mid.contact).toBe(false);
    expect(Math.hypot(mid.A2[0] - A1[0], mid.A2[1] - A1[1])).toBeCloseTo(MIN_GAP, 9);
    expect(snapA2(A1, [A1[0] + 200, A1[1] + 10])).toEqual({ A2: [A1[0] + 200, A1[1] + 10], contact: false });
  });
});

describe('«Wo ist die Gegenkraft?» scenes: every force has its counter-force on the other body', () => {
  const inBox = (p: readonly [number, number], b: readonly [number, number, number, number], tol = 2) => p[0] >= b[0] - tol && p[0] <= b[2] + tol && p[1] >= b[1] - tol && p[1] <= b[3] + tol;
  for (const sc of K2_SCENES) {
    describe(sc.id, () => {
      const body = (id: string) => sc.bodies.find((b) => b.id === id)!;
      for (const p of sc.pairs) {
        it(`pair ${p.id}: points lie on the right bodies, bodies differ, reaction = −force (force.ts)`, () => {
          expect(p.on).not.toBe(p.by);
          expect(inBox(p.A, body(p.on).box), 'A on the body acted upon').toBe(true);
          expect(inBox(p.B, body(p.by).box), 'B on the other body').toBe(true);
          const act = { A: phys(p.A), F: phys([p.dir[0] * p.len, p.dir[1] * p.len]) };
          const re = reaction(act, phys(p.B));
          expect(re.F[0]).toBeCloseTo(-act.F[0], 12); expect(re.F[1]).toBeCloseTo(-act.F[1], 12);
          expect(resultant([act, re])).toEqual([0, 0, 0]);
        });
        it(`pair ${p.id}: ${p.fern ? 'force at a distance: both lie on the connecting line' : 'contact force: the two points coincide'}`, () => {
          if (p.fern) {
            expect(Math.hypot(p.A[0] - p.B[0], p.A[1] - p.B[1])).toBeGreaterThan(1);
            expect(actsAlongConnection(phys(p.A), phys(p.B), phys([p.dir[0] * p.len, p.dir[1] * p.len]), 1e-9)).toBe(true);
          } else {
            expect(Math.hypot(p.A[0] - p.B[0], p.A[1] - p.B[1])).toBeLessThan(1e-9);
          }
        });
      }
    });
  }
  it('the weight G and the support force N of the book are NOT a pair: different bodies, same body acted upon', () => {
    const book = K2_SCENES.find((s) => s.id === 'book')!;
    const G = book.pairs.find((p) => p.id === 'G')!, N = book.pairs.find((p) => p.id === 'N')!;
    expect(G.on).toBe(N.on); // both act ON the book …
    expect(G.by).not.toBe(N.by); // … but their counter-forces act on different bodies (Earth vs table)
    expect(G.dir[1]).toBe(-N.dir[1]); // equal and opposite on the SAME body: that is equilibrium, not Actio/Reactio
  });
});
