/**
 * Pure helpers of the Euler-form figure (Analysis I, week 6, section «Eulerform»).
 * e^{iφ} = cos φ + i sin φ is the point of the unit circle at the arc length φ; the series is the numerical check.
 */
const TAU = 2 * Math.PI;

/** Σ_{n ≤ terms} (iφ)ⁿ / n!  as [re, im]: the power series of e^x at x = iφ. Its real part is the cosine series, its imaginary part the sine series. */
export function eulerSeries(phi: number, terms = 40): [number, number] {
  let re = 0, im = 0, tr = 1, ti = 0; // term (iφ)^n / n!
  for (let n = 0; n <= terms; n++) {
    re += tr; im += ti;
    const nr = -ti * phi / (n + 1), ni = tr * phi / (n + 1); // multiply by iφ/(n+1)
    tr = nr; ti = ni;
  }
  return [re, im];
}

/** Point of the unit circle (re, im) at angle φ. */
export const unitPoint = (phi: number): [number, number] => [Math.cos(phi), Math.sin(phi)];

/** φ in [0, 2π) from a position in the complex plane; snaps to a multiple of π/12 within `snap` radians. */
export function angleOf(x: number, y: number, snap = 0.05): number {
  let p = Math.atan2(y, x);
  if (p < 0) p += TAU;
  const k = Math.round(p / (Math.PI / 12)), s = (k * Math.PI) / 12;
  if (Math.abs(p - s) < snap) p = s;
  return p >= TAU - 1e-12 ? 0 : p;
}

/** Exact values of cos φ and sin φ for φ = 0°, 30°, 45°, 60°, 90° … (TeX and number), or null. */
const FIRST: Record<number, [[string, number], [string, number]]> = {
  0: [['1', 1], ['0', 0]],
  30: [['\\tfrac{\\sqrt3}{2}', Math.sqrt(3) / 2], ['\\tfrac12', 0.5]],
  45: [['\\tfrac{\\sqrt2}{2}', Math.SQRT1_2], ['\\tfrac{\\sqrt2}{2}', Math.SQRT1_2]],
  60: [['\\tfrac12', 0.5], ['\\tfrac{\\sqrt3}{2}', Math.sqrt(3) / 2]],
  90: [['0', 0], ['1', 1]],
};
export function exactCosSin(deg: number): { cos: [string, number]; sin: [string, number] } | null {
  if (Math.abs(deg - Math.round(deg)) > 1e-9) return null;
  const d = ((Math.round(deg) % 360) + 360) % 360, q = Math.floor(d / 90), base = FIRST[d - 90 * q];
  if (!base) return null;
  const neg = (a: [string, number]): [string, number] => (a[1] === 0 ? a : [a[0].startsWith('-') ? a[0].slice(1) : `-${a[0]}`, -a[1]]);
  let cur = base; // each quarter turn maps (cos, sin) to (−sin, cos)
  for (let i = 0; i < q; i++) cur = [neg(cur[1]), cur[0]];
  return { cos: cur[0], sin: cur[1] };
}
