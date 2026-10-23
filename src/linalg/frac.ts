/** Exact rational numbers [numerator, denominator] (denominator > 0, lowest terms). Small matrices only. */
export type Q = readonly [number, number];

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export const q = (n: number, d = 1): Q => {
  if (d === 0) throw new Error('division by zero');
  const g = gcd(n, d) || 1, s = d < 0 ? -1 : 1;
  return [(s * n) / g + 0, (s * d) / g];
};
export const ZERO = q(0), ONE = q(1);
export const add = (a: Q, b: Q) => q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
export const sub = (a: Q, b: Q) => q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
export const mul = (a: Q, b: Q) => q(a[0] * b[0], a[1] * b[1]);
export const div = (a: Q, b: Q) => q(a[0] * b[1], a[1] * b[0]);
export const neg = (a: Q) => q(-a[0], a[1]);
export const isZero = (a: Q) => a[0] === 0;
export const eq = (a: Q, b: Q) => a[0] === b[0] && a[1] === b[1];
export const num = (a: Q) => a[0] / a[1];
export const fromNum = (x: number) => q(x);

/** TeX: `3`, `-\frac{2}{3}`; with `de` a decimal comma is NOT used – fractions stay fractions. */
export const tex = (a: Q) => (a[1] === 1 ? String(a[0]) : `${a[0] < 0 ? '-' : ''}\\frac{${Math.abs(a[0])}}{${a[1]}}`);
