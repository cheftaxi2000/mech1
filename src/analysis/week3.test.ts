import { describe, expect, it } from 'vitest';
import {
  H_PI_X, P_MAX_X, P_MIN_X, P_ROOTS, ZWS_ROOT, afterStep, asym, bisect, bruch, bruchInv, dp, evalPoly, f5, f5tilde, hits,
  holeF, inv1, jumpH, longDivide, movePoint, p, pOfRecip, poleG, recipP, transform, zwsF,
} from './week3';

const near = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThan(tol);
const central = (f: (x: number) => number, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

describe('Ü3 p. 1–2: continuity, gap, pole, jump', () => {
  it('hebbare Lücke: (x²−1)/(x−1) = x + 1 for x ≠ 1, not defined at 1, limit 2 from both sides', () => {
    expect(Number.isNaN(holeF(1))).toBe(true);
    for (const x of [-3, -0.5, 0, 2.5, 7]) near(holeF(x), x + 1, 1e-12);
    for (const h of [1e-3, 1e-5]) { near(holeF(1 - h), 2, 2e-3); near(holeF(1 + h), 2, 2e-3); }
  });
  it('Polstelle: 1/x → −∞ from the left, +∞ from the right', () => {
    expect(poleG(-1e-6)).toBeLessThan(-1e5);
    expect(poleG(1e-6)).toBeGreaterThan(1e5);
  });
  it('Sprungstelle: links −2 = h(4), rechts 0', () => {
    expect(jumpH(4)).toBe(-2);
    near(jumpH(4 - 1e-10), -2, 1e-4);
    expect(jumpH(4 + 1e-10)).toBe(0);
    near(jumpH(0), -4, 1e-12); // the slide's graph starts at −4 on the y-axis
  });
});

describe('Ü3 p. 3: intermediate value theorem', () => {
  it('Bsp. 1: f(1) = −1 < 0, f(2) = 5 > 0; the root lies between', () => {
    expect(zwsF(1)).toBe(-1); expect(zwsF(2)).toBe(5);
    near(zwsF(ZWS_ROOT), 0, 1e-12);
    expect(ZWS_ROOT).toBeGreaterThan(1); expect(ZWS_ROOT).toBeLessThan(2);
    near(ZWS_ROOT, 1.324717957, 1e-9);
  });
  it('bisection keeps the sign change and closes in on the root', () => {
    const s = bisect(zwsF, 1, 2, 30);
    expect(s.slice(0, 5).map((x) => x.m)).toEqual([1.5, 1.25, 1.375, 1.3125, 1.34375]);
    near(s[0].fm, 0.875, 1e-12); near(s[1].fm, -0.296875, 1e-12);
    for (const st of s) { const [a, b] = afterStep(st); expect(zwsF(a) * zwsF(b)).toBeLessThanOrEqual(0); expect(a <= ZWS_ROOT && ZWS_ROOT <= b).toBe(true); }
    const [a, b] = afterStep(s[s.length - 1]);
    expect(b - a).toBeLessThan(1e-8);
    // after 10 halvings the interval is 1/1024 long
    const [a10, b10] = afterStep(s[9]);
    near(b10 - a10, 1 / 1024, 1e-15);
  });
  it('Bsp. 2: h(−1) = −2 − √5 < −π < −2 = h(4); the x with h(x) = −π', () => {
    near(jumpH(-1), -2 - Math.sqrt(5), 1e-12);
    expect(jumpH(-1)).toBeLessThan(-Math.PI); expect(-Math.PI).toBeLessThan(jumpH(4));
    near(jumpH(H_PI_X), -Math.PI, 1e-12);
    expect(H_PI_X > -1 && H_PI_X < 4).toBe(true);
    near(H_PI_X, 2.6967, 1e-4);
  });
});

describe('Ü3 p. 4–5: transformations of p(x) = 2x³ − 3x² − 6x + 6', () => {
  it('critical points and values', () => {
    near(dp(P_MAX_X), 0, 1e-12); near(dp(P_MIN_X), 0, 1e-12);
    near(p(P_MAX_X), 8.09017, 1e-5); near(p(P_MIN_X), -3.09017, 1e-5);
    near(central(p, 1.3), dp(1.3), 1e-6);
  });
  it('slide examples: p(x + 2), p(x) + 4, p(2x), 2p(x)', () => {
    const id = { a: 0, b: 0, c: 1, d: 1 };
    const cases = [
      [{ ...id, a: -2 }, (x: number) => p(x + 2)],
      [{ ...id, b: 4 }, (x: number) => p(x) + 4],
      [{ ...id, c: 2 }, (x: number) => p(2 * x)],
      [{ ...id, d: 2 }, (x: number) => 2 * p(x)],
    ] as const;
    for (const [tr, g] of cases) for (const x of [-2, -0.3, 1, 2.2]) near(transform(p, tr)(x), g(x), 1e-12);
  });
  it('f(x − a), a > 0: the new graph reaches the old value a later (shift right)', () => {
    const tr = { a: 1.5, b: 0, c: 1, d: 1 };
    for (const x0 of [-1, 0, 0.7]) near(transform(p, tr)(x0 + 1.5), p(x0), 1e-12);
    const [mx, my] = movePoint([P_MAX_X, p(P_MAX_X)], tr);
    near(mx, P_MAX_X + 1.5); near(my, p(P_MAX_X));
  });
  it('moved points lie on the transformed graph (any a, b, c, d)', () => {
    const tr = { a: -0.7, b: 2.5, c: -1.6, d: 0.5 };
    for (const x0 of [-1.2, 0.3, 2]) { const [x, y] = movePoint([x0, p(x0)], tr); near(transform(p, tr)(x), y, 1e-12); }
  });
  it('1/p has poles at the three zeros of p; p(1/x) → p(0) = 6', () => {
    expect(P_ROOTS.length).toBe(3);
    for (const r of P_ROOTS) near(p(r), 0, 1e-9);
    near(P_ROOTS[0], -1.6, 0.05); near(P_ROOTS[1], 0.85, 0.05); near(P_ROOTS[2], 2.25, 0.05);
    near(recipP(P_MAX_X), 1 / 8.09017, 1e-5); // bottom of the middle U
    near(pOfRecip(1e6), 6, 1e-4); near(pOfRecip(-1e6), 6, 1e-4);
  });
});

describe('Ü4 p. 1: f5(t) = |tan(t² + t)|, f̃5(x) = 1/f5(1/x)', () => {
  const M = Math.tan(0.25);
  it('positive local maximum of f5 at t = −1/2 (value tan 1/4)', () => {
    near(f5(-0.5), M, 1e-12);
    for (const h of [1e-3, 0.05, 0.2]) { expect(f5(-0.5 + h)).toBeLessThan(M); expect(f5(-0.5 - h)).toBeLessThan(M); }
    expect(f5(-0.5)).toBeGreaterThan(0);
  });
  it('positive local minimum of f̃5 at x = −2 (value 1/tan 1/4)', () => {
    near(f5tilde(-2), 1 / M, 1e-12);
    near(1 / M, 3.9163, 1e-4);
    for (const h of [1e-3, 0.1, 0.5]) { expect(f5tilde(-2 + h)).toBeGreaterThan(1 / M); expect(f5tilde(-2 - h)).toBeGreaterThan(1 / M); }
  });
});

describe('Ü3 p. 5–6: injective / surjective by horizontal lines', () => {
  it('x² = 9: two solutions, x³ = 8: one', () => {
    expect(hits((x) => x * x, -5, 5, 9).map((x) => +x.toFixed(9))).toEqual([-3, 3]);
    expect(hits((x) => x ** 3, -5, 5, 8).map((x) => +x.toFixed(9))).toEqual([2]);
  });
  it('g(−2) = g(2) = 4; on [0, ∞) only one', () => {
    expect(hits((x) => x * x, -4, 4, 4).length).toBe(2);
    expect(hits((x) => x * x, 0, 4, 4).length).toBe(1);
    expect(hits((x) => x * x, -4, 4, 0).length).toBe(1);
  });
  it('2x + 1: always exactly one hit; e^x: none for c ≤ 0', () => {
    for (const c of [-5, 0, 3]) expect(hits((x) => 2 * x + 1, -10, 10, c).length).toBe(1);
    for (const c of [-1, 0]) expect(hits(Math.exp, -10, 3, c).length).toBe(0);
    expect(hits(Math.exp, -10, 3, 2).length).toBe(1);
  });
  it('sin hits a value several times on ℝ but once on [−π/2, π/2]', () => {
    expect(hits(Math.sin, -7, 7, 0.5).length).toBe(5);
    expect(hits(Math.sin, -Math.PI / 2, Math.PI / 2, 0.5).length).toBe(1);
  });
});

describe('Ü3 p. 7–8: inverse functions', () => {
  it('Bsp. 1–3, 5: f(f⁻¹(y)) = y and f⁻¹(f(x)) = x', () => {
    for (const y of [-4, 0, 2.5]) near(2 * inv1(y) + 3, y, 1e-12);
    for (const y of [0, 0.3, 4]) near(Math.sqrt(y) ** 2, y, 1e-12);
    for (const y of [0.1, 1, 9]) near(Math.exp(Math.log(y)), y, 1e-12);
    for (const x of [-1.5, 0.2, 1.5]) near(Math.asin(Math.sin(x)), x, 1e-12);
  });
  it('Bsp. 4: the slide\'s algebra gives x = −(2y + 1)/(y − 1), an inverse of (x − 1)/(x + 2)', () => {
    for (const x of [-5, -1, 0, 3, 10]) near(bruchInv(bruch(x)), x, 1e-12);
    for (const y of [-3, 0, 0.5, 4]) near(bruch(bruchInv(y)), y, 1e-12);
    // each line of the slide holds for a sample point (x, y = f(x))
    const x = 3, y = bruch(x);
    near(y * (x + 2), x - 1, 1e-12);
    near(y * x + 2 * y, x - 1, 1e-12);
    near(y * x - x, -1 - 2 * y, 1e-12);
    near((y - 1) * x, -1 - 2 * y, 1e-12);
    // the value 1 is never reached, −2 is not in the domain
    expect(hits(bruch, -50, -2.0001, 1).length + hits(bruch, -1.9999, 50, 1).length).toBe(0);
  });
});

describe('Ü3 p. 9–11: asymptotes and polynomial division', () => {
  it('waagerecht: 2x/(x+1) = 2 − 2/(x+1) → 2; (4x²+3)/(2x²−1) → 2 for x → ±∞', () => {
    for (const x of [-7, 0.5, 3]) near(asym.h1(x), 2 - 2 / (x + 1), 1e-12);
    near(asym.h1(1e8), 2, 1e-7); near(asym.h1(-1e8), 2, 1e-7);
    near(asym.h2(1e5), 2, 1e-9); near(asym.h2(-1e5), 2, 1e-9);
    near(asym.h2(0), -3, 1e-12);
  });
  it('senkrecht: 1/(x−2) at 2, (2x+1)/(x−1) = 2 + 3/(x−1) at 1', () => {
    expect(asym.v1(2 - 1e-7)).toBeLessThan(-1e6); expect(asym.v1(2 + 1e-7)).toBeGreaterThan(1e6);
    for (const x of [-3, 0, 4]) near(asym.v2(x), 2 + 3 / (x - 1), 1e-12);
    expect(asym.v2(1 - 1e-7)).toBeLessThan(-1e6); expect(asym.v2(1 + 1e-7)).toBeGreaterThan(1e6);
  });
  it('Bsp. 1: x² : (x + 1) = x − 1 + 1/(x + 1), with the slide\'s rows', () => {
    const d = longDivide([1, 0, 0], [1, 1]);
    expect(d.q).toEqual([1, -1]); expect(d.r).toEqual([1]);
    expect(d.steps[0].sub).toEqual([1, 1, 0]); // x² + x
    expect(d.steps[0].rest).toEqual([0, -1, 0]); // −x
    expect(d.steps[1].sub).toEqual([0, -1, -1]); // −x − 1
    expect(d.steps[1].rest).toEqual([0, 0, 1]); // 1
    for (const x of [-3, 0.5, 4]) near(asym.o1(x), x - 1 + 1 / (x + 1), 1e-12);
  });
  it('Bsp. 2: (x³ − 3x + 5) : (x − 1) = x² + x − 2 + 3/(x − 1)', () => {
    const d = longDivide([1, 0, -3, 5], [1, -1]);
    expect(d.q).toEqual([1, 1, -2]); expect(d.r).toEqual([3]);
    expect(d.steps.map((s) => s.sub)).toEqual([[1, -1, 0, 0], [0, 1, -1, 0], [0, 0, -2, 2]]);
    expect(d.steps.map((s) => s.rest)).toEqual([[0, 1, -3, 5], [0, 0, -2, 5], [0, 0, 0, 3]]);
    for (const x of [-2, 0, 3]) near(asym.o2(x), evalPoly(d.q, x) + 3 / (x - 1), 1e-12);
    near(asym.o2(2), 7, 1e-12); // the low point of the right branch in the slide's graph
  });
  it('f − g → 0 for x → +∞ and x → −∞ (A-010)', () => {
    for (const x of [1e3, 1e4, -1e3, -1e4]) { // (larger |x| only measures rounding of x³)
      expect(Math.abs(asym.o1(x) - (x - 1))).toBeLessThan(2 / Math.abs(x));
      expect(Math.abs(asym.o2(x) - (x * x + x - 2))).toBeLessThan(4 / Math.abs(x));
    }
  });
});

describe('numbers quoted in the lessons', () => {
  it('bisection captions: f(1.375) ≈ 0.225, f(1.3125) ≈ −0.052; 2^−20 < 10^−6', () => {
    const s = bisect(zwsF, 1, 2, 4);
    near(s[2].fm, 0.224609375, 1e-12); near(s[3].fm, -0.051513671875, 1e-12);
    expect(2 ** -20).toBeLessThan(1e-6);
  });
  it('same signs at both ends do not exclude roots: x² − 1 on [−2, 2]', () => {
    expect(hits((x) => x * x - 1, -2, 2, 0).length).toBe(2);
  });
  it('p(2x + 2) = p(2(x + 1)): a shift by 1, not by 2', () => {
    for (const x of [-1.7, 0, 0.9]) near(transform(p, { a: -1, b: 0, c: 2, d: 1 })(x), p(2 * x + 2), 1e-12);
  });
  it('f⁻¹ ≠ 1/f: for f(x) = 2x + 3 at x = 1: 1/f = 0.2, f⁻¹ = −1', () => {
    near(1 / (2 * 1 + 3), 0.2, 1e-15); near(inv1(1), -1, 1e-15);
  });
  it('an asymptote may be crossed: x/(x² + 1) → 0 and equals 0 at x = 0', () => {
    const f = (x: number) => x / (x * x + 1);
    expect(f(0)).toBe(0); near(f(1e8), 0, 1e-7); near(f(-1e8), 0, 1e-7);
  });
  it('IVT figure presets: p = 2 three times on [−2, 3]; h = −1 never on [3, 5] (the jump is no root)', () => {
    expect(hits(p, -2, 3, 2).length).toBe(3);
    expect(hits(jumpH, 3, 5, -1).length).toBe(0);
    expect(hits(poleG, -3, 3, 0).length).toBe(0);
  });
  it('h(−1) ≈ −4.24, −π ≈ −3.14; p(1/x) → 6', () => {
    near(jumpH(-1), -4.236, 1e-3); near(-Math.PI, -3.1416, 1e-4); expect(p(0)).toBe(6);
  });
});
