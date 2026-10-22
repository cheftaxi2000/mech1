/**
 * Analysis 1, week 4 (Übung 4): difference quotient, derivative, rules, inverse derivative, tangent and normal.
 * Every number shown in the lessons ana-ableitung, ana-ableitungsregeln and ana-tangente is computed here and
 * checked in deriv.test.ts (numerically: closed forms against difference quotients). The lessons show the reasoning.
 */
export type Fn = (x: number) => number;

/** Difference quotient (f(x0 + h) − f(x0)) / h, h ≠ 0 (Ü4 p. 2). */
export const diffQuot = (f: Fn, x0: number, h: number) => (f(x0 + h) - f(x0)) / h;

/** Central difference, used only as a numerical check of closed-form derivatives. */
export const central = (f: Fn, x: number, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h);

/* ---------------------------------------------------------------- p. 2–3: x² at x0 = 1, |x| at 0 */
export const sq: Fn = (x) => x * x;
export const SQ_X0 = 1;
/** the slide's table: h = 1, 0.5, 0.1, 0.01 → slope 2 + h */
export const SQ_H = [1, 0.5, 0.1, 0.01] as const;
export const sqSlope = (h: number) => diffQuot(sq, SQ_X0, h);
/** the simplified form of the slide: ((1+h)² − 1)/h = (2h + h²)/h = 2 + h */
export const sqSlopeSimplified = (h: number) => 2 + h;
export const abs: Fn = Math.abs;
/** |h| / h: −1 from the left, +1 from the right */
export const absSlope = (h: number) => diffQuot(abs, 0, h);

/* ---------------------------------------------------------------- p. 4–6: rule examples */
export interface RuleExample { id: string; f: Fn; df: Fn; /** where to test (inside the domain) */ at: number[] }
const sin = Math.sin, cos = Math.cos, exp = Math.exp, ln = Math.log;
export const RULE_EXAMPLES: RuleExample[] = [
  { id: '6x^7', f: (x) => 6 * x ** 7, df: (x) => 42 * x ** 6, at: [-1.2, 0.3, 1.1] },
  { id: '1/x^2', f: (x) => 1 / x ** 2, df: (x) => -2 * x ** -3, at: [-2, 0.5, 1.7] },
  { id: '3x^5+2x-7', f: (x) => 3 * x ** 5 + 2 * x - 7, df: (x) => 15 * x ** 4 + 2, at: [-1, 0, 0.8] },
  { id: '4x^5(x^7-x^2)', f: (x) => 4 * x ** 5 * (x ** 7 - x ** 2), df: (x) => 20 * x ** 4 * (x ** 7 - x ** 2) + 4 * x ** 5 * (7 * x ** 6 - 2 * x), at: [-0.9, 0.4, 1.05] },
  { id: 'x^2/(x+1)', f: (x) => x ** 2 / (x + 1), df: (x) => (x ** 2 + 2 * x) / (x + 1) ** 2, at: [-3, -0.5, 2] },
  { id: '(3x^2+5)^3', f: (x) => (3 * x ** 2 + 5) ** 3, df: (x) => 18 * x * (3 * x ** 2 + 5) ** 2, at: [-0.7, 0.2, 1] },
  { id: 'sin(5x^3)', f: (x) => sin(5 * x ** 3), df: (x) => cos(5 * x ** 3) * 15 * x ** 2, at: [-0.6, 0.3, 0.9] },
  { id: '5e^{x^2}', f: (x) => 5 * exp(x ** 2), df: (x) => 10 * x * exp(x ** 2), at: [-1, 0.2, 0.7] },
  { id: '5ln(x^2+2)', f: (x) => 5 * ln(x ** 2 + 2), df: (x) => (5 * 2 * x) / (x ** 2 + 2), at: [-2, 0.1, 1.5] },
  { id: 'x^2 sin x', f: (x) => x ** 2 * sin(x), df: (x) => 2 * x * sin(x) + x ** 2 * cos(x), at: [-2, 0.5, 3] },
  { id: 'sin x / x', f: (x) => sin(x) / x, df: (x) => (x * cos(x) - sin(x)) / x ** 2, at: [-2, 0.5, 3] },
];

/** Spezialfälle (p. 6) with a test inner function g(x) = x² + x + 1 (> 0, cos g ≠ 0 near the test points). */
export const G = (x: number) => x * x + x + 1;
export const dG = (x: number) => 2 * x + 1;
export const SPECIAL: RuleExample[] = [
  { id: 'sin g', f: (x) => sin(G(x)), df: (x) => cos(G(x)) * dG(x), at: [-0.4, 0.1] },
  { id: 'cos g', f: (x) => cos(G(x)), df: (x) => -sin(G(x)) * dG(x), at: [-0.4, 0.1] },
  { id: 'tan g', f: (x) => Math.tan(G(x)), df: (x) => dG(x) / cos(G(x)) ** 2, at: [-0.4, 0.1] },
  { id: 'tan g (1+tan²)', f: (x) => Math.tan(G(x)), df: (x) => dG(x) + Math.tan(G(x)) ** 2 * dG(x), at: [-0.4, 0.1] },
  { id: 'ln g', f: (x) => ln(G(x)), df: (x) => dG(x) / G(x), at: [-0.4, 0.1, 2] },
  { id: 'e^g', f: (x) => exp(G(x)), df: (x) => exp(G(x)) * dG(x), at: [-0.4, 0.1] },
];

/* ---------------------------------------------------------------- product rule: the area picture */
/**
 * Rectangle u·v; when x grows by h, u grows by Δu ≈ u′h and v by Δv ≈ v′h. The new area splits into the old rectangle,
 * two strips Δu·v and u·Δv and a corner Δu·Δv. Per h: u′v + uv′ + u′v′·h — the corner part vanishes as h → 0.
 * (Here u and v grow linearly, u(x0 + h) = u + u′h, so the split is exact.)
 */
export function productAreas(u: number, v: number, du: number, dv: number, h: number) {
  const Du = du * h, Dv = dv * h;
  const stripU = Du * v, stripV = u * Dv, corner = Du * Dv;
  const total = (u + Du) * (v + Dv) - u * v;
  return { Du, Dv, stripU, stripV, corner, total, perH: total / h, cornerPerH: corner / h };
}
/** the values used in the figure */
export const PROD = { u: 2.4, v: 1.6, du: 1, dv: 0.8 } as const;

/* ---------------------------------------------------------------- chain rule: stretched number lines */
/** u(x) = x², g(u) = u² near x0 = 1: rates 2 and 2 multiply to (x⁴)′(1) = 4. */
export const CHAIN = { x0: 1, u: (x: number) => x * x, du: (x: number) => 2 * x, g: (u: number) => u * u, dg: (u: number) => 2 * u } as const;
export function chainRates(dx: number) {
  const { x0, u, g } = CHAIN;
  const u0 = u(x0), u1 = u(x0 + dx), g0 = g(u0), g1 = g(u1);
  const rU = (u1 - u0) / dx, rG = (g1 - g0) / (u1 - u0);
  return { u0, u1, g0, g1, rU, rG, rTotal: (g1 - g0) / dx };
}

/* ---------------------------------------------------------------- p. 7: inverse functions */
export const INV = {
  f: (x: number) => x * x + 2, df: (x: number) => 2 * x,
  finv: (y: number) => Math.sqrt(y - 2), dfinv: (y: number) => 1 / (2 * Math.sqrt(y - 2)),
} as const;
export const arctanDeriv = (y: number) => 1 / (1 + y * y);
/** the slide's middle form 1 / (1 + tan²(arctan y)) */
export const arctanDerivSlide = (y: number) => 1 / (1 + Math.tan(Math.atan(y)) ** 2);
/** reflection at y = x */
export const mirror = (p: readonly [number, number]): [number, number] => [p[1], p[0]];

/* ---------------------------------------------------------------- p. 8–9: tangent and normal */
export interface TanExample { id: string; f: Fn; df: Fn; x0: number; dom?: [number, number] }
export const TAN_EXAMPLES: TanExample[] = [
  { id: 'sq', f: sq, df: (x) => 2 * x, x0: 1 },
  { id: 'rsqrt', f: (x) => (1 + 2 * x) ** -0.5, df: (x) => -((1 + 2 * x) ** -1.5), x0: 4, dom: [-0.5, Infinity] },
];
/** t(x) = f(x0) + f′(x0)(x − x0) */
export const tangent = (e: TanExample) => (x: number) => e.f(e.x0) + e.df(e.x0) * (x - e.x0);
/** y = y0 − (x − x0)/f′(x0); needs f′(x0) ≠ 0 (else the normal is the vertical line x = x0) */
export const normalSlope = (m: number) => (m === 0 ? Infinity : -1 / m);
/** the slide's closed forms: 2x − 1 and (13 − x)/27 */
export const TAN_CLOSED = { sq: (x: number) => 2 * x - 1, rsqrt: (x: number) => (13 - x) / 27 } as const;

/**
 * Zoom into the graph around (x0, f(x0)): window half-width w (equal scales, 4:3 window). Returns the largest vertical
 * gap between f and its tangent inside the window, as a fraction of the window height — it shrinks like w, so the
 * curve looks straighter and straighter.
 */
export function zoomGap(e: TanExample, w: number, n = 200) {
  const t = tangent(e);
  let max = 0;
  for (let i = 0; i <= n; i++) {
    const x = e.x0 - w + (2 * w * i) / n;
    if (e.dom && x <= e.dom[0]) continue;
    max = Math.max(max, Math.abs(e.f(x) - t(x)));
  }
  return max / (1.5 * w); // window height = 2 · 0.75 w
}

/** Intersection of two lines y = a1 + m1 x and y = a2 + m2 x (Serie 4, Aufgabe 3 idea). */
export function intersect(a1: number, m1: number, a2: number, m2: number): [number, number] {
  const x = (a2 - a1) / (m1 - m2);
  return [x, a1 + m1 * x];
}
