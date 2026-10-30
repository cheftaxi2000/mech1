import { describe, expect, it } from 'vitest';
import {
  ORDER_EXAMPLE, arcosh, arsinh, artanh, cabs, ccos, csin, cx, deriv, divPoly, evalPoly, evalReal, fact, factorial, fromRoots,
  minDegree, mulPoly, overtake, pairFactor, quadRoots, rootSplits,
} from './week7';


describe('quadratic formula (Ü7 S. 5)', () => {
  it('z² − 2z + 5 = 0 → 1 ± 2i, mirror images', () => {
    const r = quadRoots(1, -2, 5);
    expect(r.kind).toBe('complex');
    expect(r.D).toBe(-16);
    expect([r.z1.re, r.z1.im, r.z2.re, r.z2.im]).toEqual([1, 2, 1, -2]);
    expect(cabs(evalPoly([5, -2, 1], r.z1))).toBeLessThan(1e-12);
  });
  it('discriminant cases', () => {
    expect(quadRoots(1, -2, 1).kind).toBe('double');
    expect(quadRoots(1, -2, -3).kind).toBe('two-real');
  });
});

describe('counting zeros (Ü7 S. 6)', () => {
  it('(z − 2)²(z² + 1): degree 4, zeros 2, 2, i, −i', () => {
    const p = mulPoly(mulPoly([-2, 1], [-2, 1]), [1, 0, 1]);
    expect(p.length - 1).toBe(4);
    for (const z of [cx(2, 0), cx(0, 1), cx(0, -1)]) expect(cabs(evalPoly(p, z))).toBeLessThan(1e-12);
    // 2 is a double zero: p and p' both vanish there
    const dp = p.slice(1).map((a, k) => (k + 1) * a);
    expect(evalReal(dp, 2)).toBeCloseTo(0, 12);
  });
  it('degree 3: (3, 0) or (1, 2); degree 5: (5,0), (3,2), (1,4)', () => {
    expect(rootSplits(3)).toEqual([[3, 0], [1, 2]]);
    expect(rootSplits(5)).toEqual([[5, 0], [3, 2], [1, 4]]);
  });
  it('SC 9: zeros −1 − i, 0, 1 + i, −1 + i → smallest degree 5', () => {
    expect(minDegree([cx(-1, -1), cx(0, 0), cx(1, 1), cx(-1, 1)])).toBe(5);
  });
  it('SC 8: x⁴ − x has exactly two real zeros (0 and 1)', () => {
    const roots = [0, 1];
    for (const r of roots) expect(evalReal([0, -1, 0, 0, 1], r)).toBe(0);
    // x³ − 1 = (x − 1)(x² + x + 1), and x² + x + 1 has D = −3 < 0
    expect(quadRoots(1, 1, 1).kind).toBe('complex');
  });
  it('a real polynomial built from pairs has real coefficients and the pairs as zeros', () => {
    const p = fromRoots([3], [cx(1, 2), cx(-2, 0.5)]);
    expect(p.length - 1).toBe(5);
    for (const z of [cx(1, 2), cx(1, -2), cx(-2, 0.5), cx(-2, -0.5), cx(3, 0)]) expect(cabs(evalPoly(p, z))).toBeLessThan(1e-9);
  });
});

describe('finding zeros (Ü7 S. 7)', () => {
  const p = [26, -34, 23, -6, 1];
  it('1 + i is a zero; the pair gives z² − 2z + 2', () => {
    expect(cabs(evalPoly(p, cx(1, 1)))).toBeLessThan(1e-12);
    expect(pairFactor(cx(1, 1))).toEqual([2, -2, 1]);
  });
  it('long division gives z² − 4z + 13 with remainder 0, rows as on the slide', () => {
    const { q, r, rows } = divPoly(p, [2, -2, 1]);
    expect(q).toEqual([13, -4, 1]);
    expect(r).toEqual([0, 0]);
    expect(rows[0].sub).toEqual([0, 0, 2, -2, 1]);            // z⁴ − 2z³ + 2z²
    expect(rows[0].rest.slice(1)).toEqual([-34, 21, -4, 0]);    // −4z³ + 21z² − 34z
    expect(rows[1].sub).toEqual([0, -8, 8, -4, 0]);             // −4z³ + 8z² − 8z  (the slide prints «−(4z³ + 8z² − 8z)», A-019)
    expect(rows[1].rest.slice(0, 3)).toEqual([26, -26, 13]);    // 13z² − 26z + 26
    expect(mulPoly([2, -2, 1], [13, -4, 1])).toEqual(p);
  });
  it('z² − 4z + 13 → 2 ± 3i', () => {
    const r = quadRoots(1, -4, 13);
    expect([r.z1.re, r.z1.im]).toEqual([2, 3]);
    for (const z of [cx(1, 1), cx(1, -1), cx(2, 3), cx(2, -3)]) expect(cabs(evalPoly(p, z))).toBeLessThan(1e-11);
  });
});

describe('hyperbolic functions (Ü7 S. 8–10)', () => {
  const xs = [-2.3, -1, -0.2, 0, 0.4, 1, 1.7, 3];
  it('cos(ix) = cosh x, −i sin(ix) = sinh x, sin(ix) = i sinh x', () => {
    for (const x of xs) {
      const c = ccos(cx(0, x)), s = csin(cx(0, x));
      expect(c.re).toBeCloseTo(Math.cosh(x), 10); expect(c.im).toBeCloseTo(0, 12);
      expect(s.re).toBeCloseTo(0, 12); expect(s.im).toBeCloseTo(Math.sinh(x), 10);
    }
  });
  it('definitions, values at 0, symmetry, cosh ≥ 1, |tanh| < 1, cosh² − sinh² = 1', () => {
    for (const x of xs) {
      expect(Math.cosh(x)).toBeCloseTo((Math.exp(x) + Math.exp(-x)) / 2, 10);
      expect(Math.sinh(x)).toBeCloseTo((Math.exp(x) - Math.exp(-x)) / 2, 10);
      expect(Math.cosh(-x)).toBeCloseTo(Math.cosh(x), 12);
      expect(Math.sinh(-x)).toBeCloseTo(-Math.sinh(x), 12);
      expect(Math.cosh(x)).toBeGreaterThanOrEqual(1);
      expect(Math.abs(Math.tanh(x))).toBeLessThan(1);
      expect(Math.cosh(x) ** 2 - Math.sinh(x) ** 2).toBeCloseTo(1, 9);
    }
    expect([Math.cosh(0), Math.sinh(0), Math.tanh(0)]).toEqual([1, 0, 0]);
    expect(Math.tanh(30)).toBeCloseTo(1, 12);
  });
  it('derivatives (sinh)′ = cosh, (cosh)′ = sinh, (tanh)′ = 1/cosh²', () => {
    for (const x of xs) {
      expect(deriv(Math.sinh, x)).toBeCloseTo(Math.cosh(x), 6);
      expect(deriv(Math.cosh, x)).toBeCloseTo(Math.sinh(x), 6);
      expect(deriv(Math.tanh, x)).toBeCloseTo(1 / Math.cosh(x) ** 2, 6);
    }
  });
  it('addition formulas', () => {
    for (const [x, y] of [[0.3, 1.2], [-1, 2], [2.5, -0.7]]) {
      expect(Math.sinh(x + y)).toBeCloseTo(Math.sinh(x) * Math.cosh(y) + Math.cosh(x) * Math.sinh(y), 9);
      expect(Math.cosh(x + y)).toBeCloseTo(Math.cosh(x) * Math.cosh(y) + Math.sinh(x) * Math.sinh(y), 9);
    }
  });
  it('inverse functions and their derivatives', () => {
    for (const x of [-3, -0.5, 0, 0.8, 2.4]) { expect(Math.sinh(arsinh(x))).toBeCloseTo(x, 10); expect(deriv(arsinh, x)).toBeCloseTo(1 / Math.sqrt(x * x + 1), 6); }
    for (const x of [1.01, 1.5, 3]) { expect(Math.cosh(arcosh(x))).toBeCloseTo(x, 10); expect(arcosh(x)).toBeGreaterThan(0); expect(deriv(arcosh, x, 1e-6)).toBeCloseTo(1 / Math.sqrt(x * x - 1), 4); }
    for (const x of [-0.9, -0.3, 0, 0.6]) { expect(Math.tanh(artanh(x))).toBeCloseTo(x, 10); expect(deriv(artanh, x)).toBeCloseTo(1 / (1 - x * x), 6); }
    expect(arcosh(1)).toBe(0);
  });
  it('SC 4: cosh(2x) − e^{2x}/2 → 0, so e^{2x}/2 is the asymptote', () => {
    for (const x of [1, 2, 3]) expect((Math.cosh(2 * x) - Math.exp(2 * x) / 2) / (Math.exp(-2 * x) / 2)).toBeCloseTo(1, 4);
    expect(Math.cosh(20) / (Math.exp(20) / 2)).toBeCloseTo(1, 12);
  });
});

describe('orders of magnitude (Ü7 S. 10–12)', () => {
  it('Stirling x! matches the integers', () => {
    for (let n = 1; n <= 10; n++) expect(factorial(n + 1e-9) / fact(n)).toBeCloseTo(1, 6);
  });
  it('x²/x³ = 1/x → 0', () => { for (const x of [10, 100, 1e4]) expect(x ** 2 / x ** 3).toBeCloseTo(1 / x, 12); });
  it('the boxed list: ratios go to 0 (checked at growing x)', () => {
    const r = (f: (x: number) => number, xs: number[]) => xs.map(f);
    const dec = (v: number[]) => v.every((y, i) => i === 0 || y < v[i - 1]);
    // x^a = o(e^{bx}): a = 5, b = 1 — the ratio first grows (up to x = a/b) then falls
    const q = (x: number) => x ** 5 / Math.exp(x);
    expect(q(5)).toBeGreaterThan(q(2));
    expect(dec(r(q, [5, 10, 20, 40, 80]))).toBe(true);
    expect(q(80)).toBeLessThan(1e-24);
    // (ln x)^c = o(x^a): c = 3, a = 0.5 — very slowly
    const q2 = (x: number) => Math.log(x) ** 3 / Math.sqrt(x);
    expect(dec(r(q2, [1e10, 1e15, 1e20, 1e30]))).toBe(true);
    // |ln x|^c = o(x^{−a}) for x → 0⁺ (A-020: ln x < 0 there)
    const q3 = (x: number) => Math.abs(Math.log(x)) ** 2 * x ** 0.5;
    expect(dec(r(q3, [1e-2, 1e-4, 1e-8, 1e-16]))).toBe(true);
    // ln(ln x) = o(ln x), x^a = o(x^a ln x)
    expect(Math.log(Math.log(1e100)) / Math.log(1e100)).toBeLessThan(0.03);
    expect(1 / Math.log(1e100)).toBeLessThan(0.005);
  });
  it('S. 12: e^{5x+1} ≫ x³ ≫ √x ≫ ln(e^{x^{1/4}} − 2) for large x', () => {
    for (const x of [1e2, 1e4, 1e6]) {
      const v = ORDER_EXAMPLE.map((f) => f.lnf(x));
      for (let i = 1; i < v.length; i++) expect(v[i]).toBeLessThan(v[i - 1]);
    }
    // the last one behaves like x^{1/4}
    expect(ORDER_EXAMPLE[3].f(1e8) / 1e2).toBeCloseTo(1, 6);
    // and x³ overtakes e^{5x+1}? never: e^{5x+1} > x³ for all x ≥ 1
    expect(overtake((x) => x ** 3, ORDER_EXAMPLE[0].f, 1, 10, 0.01)).toBeNull();
  });
  it('SC 12 (A) ln x = o(√(x² + x)); (B) ln x is not o(ln x²): ratio stays ½', () => {
    expect(Math.log(1e12) / Math.sqrt(1e24 + 1e12)).toBeLessThan(1e-10);
    for (const x of [10, 1e6, 1e12]) expect(Math.log(x) / Math.log(x * x)).toBeCloseTo(0.5, 12);
  });
  it('SC 6 (C) e^{−1/x} = o(x⁴) for x → 0⁺', () => {
    const q = (x: number) => Math.exp(-1 / x) / x ** 4;
    expect(q(0.05)).toBeLessThan(q(0.1)); expect(q(0.02)).toBeLessThan(q(0.05)); expect(q(0.01)).toBeLessThan(1e-30);
  });
  it('S. 10: 2^x overtakes x² for good at x = 4, x! overtakes 2^x at x ≈ 3.5', () => {
    expect(overtake((x) => 2 ** x, (x) => x * x, 1, 10, 0.001)).toBeCloseTo(4, 2);
    const o = overtake(factorial, (x) => 2 ** x, 1, 10, 0.001)!;
    expect(o).toBeGreaterThan(3); expect(o).toBeLessThan(4);
  });
});
