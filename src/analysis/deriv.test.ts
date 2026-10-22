import { describe, expect, it } from 'vitest';
import {
  CHAIN, INV, PROD, RULE_EXAMPLES, SPECIAL, SQ_H, TAN_CLOSED, TAN_EXAMPLES, absSlope, arctanDeriv, arctanDerivSlide, central,
  chainRates, intersect, mirror, normalSlope, productAreas, sqSlope, sqSlopeSimplified, tangent, zoomGap,
} from './deriv';

describe('Ü4 p. 2–3: difference quotient of x² at 1, |x| at 0', () => {
  it('reproduces the slide table 3, 2.5, 2.1, 2.01 and the simplification 2 + h', () => {
    expect(SQ_H.map(sqSlope).map((m) => +m.toFixed(10))).toEqual([3, 2.5, 2.1, 2.01]);
    for (const h of [1, 0.5, 0.1, 0.01, -0.01, -0.5, 1e-4]) expect(sqSlope(h)).toBeCloseTo(sqSlopeSimplified(h), 9);
  });
  it('from the left the slopes are 1, 1.5, 1.9, 1.99 — the same limit 2', () => {
    expect(SQ_H.map((h) => +sqSlope(-h).toFixed(10))).toEqual([1, 1.5, 1.9, 1.99]);
    expect(sqSlope(-1e-7)).toBeCloseTo(2, 6); expect(sqSlope(1e-7)).toBeCloseTo(2, 6);
  });
  it('P(1, 1), Q(2, 4): Δx = 1, Δy = 3', () => {
    expect(2 ** 2 - 1 ** 2).toBe(3);
  });
  it('f′(x) = 2x for x² at several points', () => {
    for (const x of [-2, 0, 0.7, 3]) expect(central((s) => s * s, x)).toBeCloseTo(2 * x, 6);
  });
  it('|h|/h is −1 from the left and +1 from the right, however small h is', () => {
    for (const h of [1, 0.1, 1e-3, 1e-9]) { expect(absSlope(h)).toBe(1); expect(absSlope(-h)).toBe(-1); }
  });
  it('differentiable ⇒ continuous: f(x0 + h) − f(x0) = DQ · h → 0', () => {
    for (const h of [1e-2, 1e-4, 1e-6]) expect(Math.abs(sqSlope(h) * h)).toBeLessThan(3 * h);
  });
});

describe('Ü4 p. 4–6: every rule example matches a central difference', () => {
  it.each(RULE_EXAMPLES.map((e) => [e.id, e] as const))('%s', (_, e) => {
    for (const x of e.at) expect(e.df(x)).toBeCloseTo(central(e.f, x, 1e-6), 4);
  });
  it.each(SPECIAL.map((e) => [e.id, e] as const))('Spezialfall %s', (_, e) => {
    for (const x of e.at) expect(e.df(x)).toBeCloseTo(central(e.f, x, 1e-6), 4);
  });
  it('tan′ = 1/cos² = 1 + tan² (the two forms of the table agree)', () => {
    for (const x of [-1.2, 0, 0.4, 1.3]) expect(1 / Math.cos(x) ** 2).toBeCloseTo(1 + Math.tan(x) ** 2, 10);
  });
});

describe('product rule: area picture', () => {
  it('total change = strips + corner; per h it tends to u′v + uv′', () => {
    const { u, v, du, dv } = PROD;
    for (const h of [0.5, 0.1, 0.01]) {
      const a = productAreas(u, v, du, dv, h);
      expect(a.total).toBeCloseTo(a.stripU + a.stripV + a.corner, 12);
      expect(a.perH).toBeCloseTo(du * v + u * dv + du * dv * h, 12);
    }
    expect(productAreas(u, v, du, dv, 1e-6).perH).toBeCloseTo(du * v + u * dv, 5);
    expect(productAreas(u, v, du, dv, 1e-6).cornerPerH).toBeLessThan(1e-5);
    // u′v′ is not the answer
    expect(du * dv).not.toBeCloseTo(du * v + u * dv, 1);
  });
});

describe('chain rule: rates multiply', () => {
  it('Δu/Δx → 2, Δg/Δu → 2, Δg/Δx → 4 = (x⁴)′(1)', () => {
    const r = chainRates(1e-6);
    expect(r.rU).toBeCloseTo(CHAIN.du(1), 5); expect(r.rG).toBeCloseTo(CHAIN.dg(1), 5); expect(r.rTotal).toBeCloseTo(4, 4);
    for (const dx of [0.5, 0.2, 0.05]) { const s = chainRates(dx); expect(s.rTotal).toBeCloseTo(s.rU * s.rG, 12); }
    expect(chainRates(0.5).u1).toBeCloseTo(2.25, 12); expect(chainRates(0.5).g1).toBeCloseTo(5.0625, 12);
  });
});

describe('Ü4 p. 7: inverse derivative', () => {
  it('x² + 2 on x ≥ 0: f(f⁻¹(y)) = y and (f⁻¹)′(y) = 1/f′(f⁻¹(y)) = 1/(2√(y − 2))', () => {
    for (const y of [2.5, 3, 6, 11]) {
      expect(INV.f(INV.finv(y))).toBeCloseTo(y, 12);
      expect(INV.dfinv(y)).toBeCloseTo(1 / INV.df(INV.finv(y)), 12);
      expect(INV.dfinv(y)).toBeCloseTo(central(INV.finv, y), 6);
    }
  });
  it('arctan′(y) = 1/(1 + tan²(arctan y)) = 1/(1 + y²)', () => {
    for (const y of [-3, 0, 0.5, 4]) {
      expect(arctanDerivSlide(y)).toBeCloseTo(arctanDeriv(y), 12);
      expect(arctanDeriv(y)).toBeCloseTo(central(Math.atan, y), 7);
    }
  });
  it('mirroring at y = x swaps the legs of a slope triangle: slope m becomes 1/m', () => {
    const P: [number, number] = [1, 3], Q: [number, number] = [1.5, 4];
    const [p, q] = [mirror(P), mirror(Q)];
    const m = (Q[1] - P[1]) / (Q[0] - P[0]), mm = (q[1] - p[1]) / (q[0] - p[0]);
    expect(mm).toBeCloseTo(1 / m, 12);
  });
  it('1/f is not f⁻¹: for x² + 2 at y = 3 the values differ', () => {
    expect(INV.finv(3)).toBe(1); expect(1 / INV.f(3)).toBeCloseTo(1 / 11, 12);
  });
});

describe('Ü4 p. 8–9: tangent and normal', () => {
  const [sq, rs] = TAN_EXAMPLES;
  it('x² at 1: t(x) = 2x − 1', () => {
    for (const x of [-1, 0, 2, 5]) expect(tangent(sq)(x)).toBeCloseTo(TAN_CLOSED.sq(x), 12);
  });
  it('1/√(1+2x) at 4: f(4) = 1/3, f′(4) = −1/27, t(x) = (13 − x)/27', () => {
    expect(rs.f(4)).toBeCloseTo(1 / 3, 14); expect(rs.df(4)).toBeCloseTo(-1 / 27, 14);
    expect(rs.df(4)).toBeCloseTo(central(rs.f, 4), 8);
    for (const x of [0, 4, 8, 13]) expect(tangent(rs)(x)).toBeCloseTo(TAN_CLOSED.rsqrt(x), 12);
  });
  it('check t(x0) = f(x0) and t′(x0) = f′(x0)', () => {
    for (const e of TAN_EXAMPLES) {
      expect(tangent(e)(e.x0)).toBeCloseTo(e.f(e.x0), 14);
      expect(central(tangent(e), e.x0)).toBeCloseTo(e.df(e.x0), 8);
    }
  });
  it('normal slope −1/f′(x0): perpendicular (m · m_n = −1); 27 for the second example; vertical when f′ = 0', () => {
    expect(normalSlope(2) * 2).toBeCloseTo(-1, 14);
    expect(normalSlope(-1 / 27)).toBeCloseTo(27, 12);
    expect(normalSlope(0)).toBe(Infinity);
    // normal of x² at 1: y = 1 − (x − 1)/2 = 3/2 − x/2
    expect(1 + normalSlope(2) * (0 - 1)).toBeCloseTo(1.5, 14);
  });
  it('zooming in: the gap between curve and tangent shrinks in proportion to the window', () => {
    for (const e of TAN_EXAMPLES) {
      const g1 = zoomGap(e, 1), g10 = zoomGap(e, 0.1), g100 = zoomGap(e, 0.01);
      expect(g10).toBeLessThan(g1 / 5); expect(g100).toBeLessThan(g10 / 5);
    }
    // x²: f − t = (x − 1)², max at the edge = w², relative to 1.5 w → w/1.5
    expect(zoomGap(sq, 0.3)).toBeCloseTo(0.3 / 1.5, 12);
  });
  it('two tangents meet where they are equal (Serie-4 tip)', () => {
    // tangents of x² at 1 (y = −1 + 2x) and at −1 (y = −1 − 2x) meet at (0, −1)
    const [x, y] = intersect(-1, 2, -1, -2);
    expect(x).toBeCloseTo(0, 14); expect(y).toBeCloseTo(-1, 14);
  });
});
