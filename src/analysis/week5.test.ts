import { describe, expect, it } from 'vitest';
import {
  EX1, EX2, FUNS, absErr, boxDiagonal, cabs, cadd, candidates, cdiv, changes, classify, cmul, conj, csub, cx, cylinder,
  expandTerms, globalExtrema, lhAfter, lhQuotient, mvtPoints, powerRel, rectangle, relErr, secantSlope, secondDerivTest,
  signIntervals, signTest,
} from './week5';

const central = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

describe('Fehlerrechnung (Ü5 S. 1–2)', () => {
  it('Δf ≈ df: the gap shrinks like Δx² (x² at 1: gap = Δx² exactly)', () => {
    const f = (x: number) => x * x, fp = (x: number) => 2 * x;
    for (const dx of [0.5, 0.1, 0.01]) {
      const c = changes(f, fp, 1, dx);
      expect(c.gap).toBeCloseTo(dx * dx, 12);
      expect(c.lin).toBeCloseTo(2 * dx, 12);
    }
    expect(absErr(fp, 1, -0.1)).toBeCloseTo(0.2, 12);
    expect(relErr(f, fp, 1, 0.1)).toBeCloseTo(0.2, 12);
  });
  it('Rechteck a = 12 m, b = 3 m, |Δa| = 0,1 m: E_A = 0,3 m², r_A = 0,1/12 ≈ 0,833 %', () => {
    const r = rectangle(12, 3, 0.1);
    expect(r.dA).toBeCloseTo(0.3, 12); // ΔA = bΔa exactly
    expect(r.EA).toBeCloseTo(0.3, 12);
    expect(r.rA).toBeCloseTo(0.1 / 12, 12);
    expect(r.rASimplified).toBeCloseTo(r.rA, 12);
    expect(100 * r.rA).toBeCloseTo(0.833, 3);
    // b does not change r_A
    expect(rectangle(12, 7, 0.1).rA).toBeCloseTo(r.rA, 12);
  });
  it('Zylinder: |Δr|/r = 1 % → |ΔV|/V ≈ 2 % (exactly 2,01 %), V′(r) = 2πrh', () => {
    const c = cylinder(1.7, 1, 0.01);
    expect(c.approx).toBeCloseTo(0.02, 12);
    expect(c.exact).toBeCloseTo(0.0201, 12);
    const V = (r: number) => Math.PI * r * r;
    expect(central(V, 1.7)).toBeCloseTo(2 * Math.PI * 1.7, 6);
    expect(powerRel(2, 0.01)).toBeCloseTo(0.02, 12);
    expect(powerRel(3, 0.01)).toBeCloseTo(0.03, 12);
    // x^3: exact relative change (1.01)^3 − 1 ≈ 3 %
    expect(1.01 ** 3 - 1).toBeCloseTo(0.030301, 9);
  });
  it('Quader a = 25, b = 20, c = 50, |Δa| = 1: d = √3525 ≈ 59,37, E_d ≈ 0,421, r_d ≈ 0,709 %', () => {
    const q = boxDiagonal(25, 20, 50, 1);
    expect(q.d2).toBe(3525);
    expect(q.d).toBeCloseTo(59.37, 2);
    expect(q.Ed).toBeCloseTo(0.421, 3);
    expect(q.rd).toBeCloseTo(25 / 3525, 12);
    expect(100 * q.rd).toBeCloseTo(0.709, 3);
    const d = (a: number) => Math.sqrt(a * a + 400 + 2500);
    expect(central(d, 25)).toBeCloseTo(q.dprime, 8);
    expect(q.exact).toBeCloseTo(0.4277, 3); // the true change is a bit bigger than the tangent estimate
    expect(Math.abs(q.exact - q.Ed)).toBeLessThan(0.01);
  });
});

describe('Mittelwertsatz und Rolle (Ü5 S. 3)', () => {
  it('x² on [1, 3]: m = 4, c = 2', () => {
    expect(secantSlope(FUNS.sq.f, 1, 3)).toBe(4);
    const c = mvtPoints(FUNS.sq.fp, 1, 3, 4);
    expect(c).toHaveLength(1);
    expect((c as number[])[0]).toBeCloseTo(2, 9);
    expect(central(FUNS.sq.f, 2)).toBeCloseTo(4, 8);
  });
  it('for x² the point c is always the middle (a + b)/2', () => {
    for (const [a, b] of [[0.3, 2.9], [-1, 3], [-2.5, -0.5]]) {
      const c = mvtPoints(FUNS.sq.fp, a, b, secantSlope(FUNS.sq.f, a, b)) as number[];
      expect(c).toHaveLength(1); expect(c[0]).toBeCloseTo((a + b) / 2, 9);
    }
  });
  it('x³ − 3x on [−2, 2]: m = 1, two points c = ±2/√3', () => {
    const m = secantSlope(FUNS.cubic.f, -2, 2);
    expect(m).toBeCloseTo(1, 12);
    const c = mvtPoints(FUNS.cubic.fp, -2, 2, m) as number[];
    expect(c).toHaveLength(2);
    expect(c[0]).toBeCloseTo(-2 / Math.sqrt(3), 9);
    expect(c[1]).toBeCloseTo(2 / Math.sqrt(3), 9);
  });
  it('Rolle: x³ − 3x on [−√3, √3] has equal heights and horizontal tangents at ±1', () => {
    const s = Math.sqrt(3);
    expect(FUNS.cubic.f(-s)).toBeCloseTo(FUNS.cubic.f(s), 12);
    const c = mvtPoints(FUNS.cubic.fp, -s, s, secantSlope(FUNS.cubic.f, -s, s)) as number[];
    expect(c.map((v) => +v.toFixed(9))).toEqual([-1, 1]);
  });
  it('|x| on [−1, 1]: equal heights but no c (not differentiable at 0); on [0,5; 2] every c works', () => {
    expect(mvtPoints(FUNS.abs.fp, -1, 1, secantSlope(FUNS.abs.f, -1, 1))).toEqual([]);
    expect(mvtPoints(FUNS.abs.fp, 0.5, 2, secantSlope(FUNS.abs.f, 0.5, 2))).toBe('all');
  });
  it('touching solution: f′ − m with a double zero is found (x³ on [−1, 1]: m = 1, c = ±1/√3; x³ on [−a, a] symmetric)', () => {
    const c = mvtPoints(FUNS.x3.fp, -1, 1, secantSlope(FUNS.x3.f, -1, 1)) as number[];
    expect(c[0]).toBeCloseTo(-1 / Math.sqrt(3), 8); expect(c[1]).toBeCloseTo(1 / Math.sqrt(3), 8);
    // f′(x) = 3x² touches m = 0 at x = 0 (x³ on [−1, 0,5]? m ≠ 0) — direct touching case: g = 3x²
    const t = mvtPoints((x) => 3 * x * x, -1, 0.7, 0) as number[];
    expect(t).toHaveLength(1); expect(t[0]).toBeCloseTo(0, 3);
  });
});

describe('Extremum oder Wendepunkt (Ü5 S. 4)', () => {
  it('second-derivative table', () => {
    expect(secondDerivTest(FUNS.sq, 0)).toBe('min');
    expect(secondDerivTest(FUNS.x4x2, 0)).toBe('max');
    expect(secondDerivTest(FUNS.x3, 0)).toBe('undecided');
    expect(secondDerivTest(FUNS.x4, 0)).toBe('undecided'); // f″(0) = 0, yet a minimum: «noch keine Entscheidung»
    expect(secondDerivTest(FUNS.x3x, 0)).toBe('none'); // f′(0) = 1: no candidate
  });
  it('sign change of f′ decides where f″ cannot', () => {
    expect(signTest(FUNS.x4, 0)).toBe('min');
    expect(signTest(FUNS.x3, 0)).toBe('neither');
    expect(signTest(FUNS.x4x2, 0)).toBe('max');
    expect(signTest(FUNS.x4x2, 1 / Math.SQRT2)).toBe('min');
  });
  it('the slide table: x³ saddle, x⁴ no inflection point, x³ + x inflection with f′(0) = 1', () => {
    expect(classify(FUNS.x3, 0)).toBe('saddle');
    expect(classify(FUNS.x4, 0)).toBe('min');
    expect(classify(FUNS.x3x, 0)).toBe('inflection');
    expect(FUNS.x3x.fp(0)).toBe(1);
    for (const k of ['x3', 'x4', 'x3x', 'x4x2', 'x3mx', 'cubic'] as const) {
      for (const x of [-1.3, -0.4, 0.2, 0.9]) {
        expect(central(FUNS[k].f, x)).toBeCloseTo(FUNS[k].fp(x), 6);
        expect(central(FUNS[k].fp, x)).toBeCloseTo(FUNS[k].fpp(x), 6);
      }
    }
  });
  it('sign bars: f″ of x³ is − then +; f″ of x⁴ stays +; f′ of x⁴ − x² changes sign at 0, ±1/√2', () => {
    expect(signIntervals(FUNS.x3.fpp, -2, 2).map((s) => s.s)).toEqual([-1, 1]);
    expect(signIntervals(FUNS.x4.fpp, -2, 2).map((s) => s.s)).toEqual([1]);
    const fp = signIntervals(FUNS.x4x2.fp, -1.6, 1.6);
    expect(fp.map((s) => s.s)).toEqual([-1, 1, -1, 1]);
    expect(fp[0].to).toBeCloseTo(-1 / Math.SQRT2, 6);
    expect(fp[1].to).toBeCloseTo(0, 6);
    const curv = signIntervals(FUNS.x4x2.fpp, -1.6, 1.6);
    expect(curv[0].to).toBeCloseTo(-1 / Math.sqrt(6), 6); // inflection points of x⁴ − x² at ±1/√6
  });
});

describe('Extremalstellen auf [a, b] (Ü5 S. 5)', () => {
  it('Bsp. 1: x³ − x on [−1/2, 1]: max 3/8 at −1/2, min −2/(3√3) at 1/√3; −1/√3 is outside', () => {
    const c = candidates(EX1.fun, EX1.a, EX1.b, EX1.crit);
    expect(c.find((k) => k.x === -0.5)!.y).toBeCloseTo(3 / 8, 12);
    expect(c.find((k) => k.x === 1)!.y).toBeCloseTo(0, 12);
    expect(c.find((k) => k.x < -0.5)!.inside).toBe(false);
    expect(EX1.fun.f(1 / Math.sqrt(3))).toBeCloseTo(-2 / (3 * Math.sqrt(3)), 12);
    const g = globalExtrema(c);
    expect(g.max).toBeCloseTo(0.375, 12); expect(g.argmax).toEqual([-0.5]);
    expect(g.min).toBeCloseTo(-0.3849, 4); expect(g.argmin[0]).toBeCloseTo(1 / Math.sqrt(3), 12);
    // the excluded point would have been larger than every allowed value: f(−1/√3) = +2/(3√3) ≈ 0,385 > 3/8
    expect(EX1.fun.f(-1 / Math.sqrt(3))).toBeGreaterThan(0.375);
    for (const x of EX1.crit) expect(EX1.fun.fp(x)).toBeCloseTo(0, 12);
  });
  it('Bsp. 2: x⁴ − x² on [−2, 2]: table 12, −1/4, 0, −1/4, 12; max 12 at ±2, min −1/4 at ±1/√2; 0 only local', () => {
    const c = candidates(EX2.fun, EX2.a, EX2.b, EX2.crit);
    expect(c.map((k) => +k.y.toFixed(12))).toEqual([12, -0.25, 0, -0.25, 12]);
    const g = globalExtrema(c);
    expect(g.max).toBe(12); expect(g.argmax).toEqual([-2, 2]);
    expect(g.min).toBeCloseTo(-0.25, 12); expect(g.argmin).toHaveLength(2);
    expect(classify(EX2.fun, 0)).toBe('max');
    expect(EX2.fun.f(0)).toBeLessThan(g.max);
    for (const x of EX2.crit) expect(EX2.fun.fp(x)).toBeCloseTo(0, 12);
    // g′(x) = 2x(2x² − 1)
    for (const x of [-1.5, 0.3, 1.1]) expect(EX2.fun.fp(x)).toBeCloseTo(2 * x * (2 * x * x - 1), 12);
  });
});

describe('Bernoulli-L’Hôpital example (Ü5 S. 6)', () => {
  it('ln x / e^{2x} → 0, and after one step 1/(2x e^{2x}) → 0', () => {
    expect(lhQuotient(5)).toBeLessThan(1e-4);
    expect(lhQuotient(10)).toBeLessThan(1e-8);
    expect(lhAfter(10)).toBeCloseTo(1 / (20 * Math.exp(20)), 20);
    // the derivatives used: (ln x)′ = 1/x, (e^{2x})′ = 2e^{2x}
    expect(central(Math.log, 3)).toBeCloseTo(1 / 3, 8);
    expect(central((x) => Math.exp(2 * x), 1)).toBeCloseTo(2 * Math.exp(2), 6);
  });
});

describe('Komplexe Zahlen (Ü5 S. 6–8)', () => {
  const z1 = cx(3, 1), z2 = cx(1, 2);
  it('i² = −1; |3 + 4i| = 5; conjugate 3 − 4i', () => {
    expect(cmul(cx(0, 1), cx(0, 1))).toEqual(cx(-1, 0));
    expect(cabs(cx(3, 4))).toBe(5);
    expect(conj(cx(3, 4))).toEqual(cx(3, -4));
  });
  it('z1 + z2 = 4 + 3i, z1 − z2 = 2 − i', () => {
    expect(cadd(z1, z2)).toEqual(cx(4, 3));
    expect(csub(z1, z2)).toEqual(cx(2, -1));
  });
  it('(3 + i)(1 + 2i) = 3 + 6i + i + 2i² = 1 + 7i', () => {
    expect(expandTerms(z1, z2)).toEqual({ ac: 3, ad: 6, bc: 1, bd: 2 });
    expect(cmul(z1, z2)).toEqual(cx(1, 7));
  });
  it('(a + bi)(a − bi) = a² + b² is real', () => {
    for (const [a, b] of [[3, 4], [1, 2], [-2.5, 0.7]]) {
      const p = cmul(cx(a, b), conj(cx(a, b)));
      expect(p.im).toBeCloseTo(0, 12); expect(p.re).toBeCloseTo(a * a + b * b, 12);
    }
  });
  it('(3 + i)/(1 + 2i) = (5 − 5i)/5 = 1 − i, check (1 − i)(1 + 2i) = 3 + i', () => {
    const num = cmul(z1, conj(z2)), den = cmul(z2, conj(z2));
    expect(num).toEqual(cx(5, -5)); expect(den).toEqual(cx(5, 0));
    expect(cdiv(z1, z2)).toEqual(cx(1, -1));
    expect(cmul(cx(1, -1), z2)).toEqual(z1);
    expect(() => cdiv(z1, cx(0, 0))).toThrow();
    // the general formula agrees with multiply-back for random numbers
    for (const [a, b, c, d] of [[2, -3, 0.5, 4], [-1, 1, 2, -2]]) {
      const q = cdiv(cx(a, b), cx(c, d)), back = cmul(q, cx(c, d));
      expect(back.re).toBeCloseTo(a, 12); expect(back.im).toBeCloseTo(b, 12);
    }
  });
});
