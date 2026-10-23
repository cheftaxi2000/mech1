/**
 * 2 × 2 systems A x = b in the column picture (Übung 3 visualisation «Column Picture», Übung 4/5 «Matrix as a Transformation»,
 * «Composing Transformations»). Pure maths; the figures only draw what is computed here.
 * Matrices are row-wise [[a11, a12], [a21, a22]]; the columns are a₁ = (a11, a21) and a₂ = (a12, a22).
 */
export type V2 = [number, number];
export type M2 = [[number, number], [number, number]];

export const add = (p: V2, q: V2): V2 => [p[0] + q[0], p[1] + q[1]];
export const sub = (p: V2, q: V2): V2 => [p[0] - q[0], p[1] - q[1]];
export const scale = (p: V2, k: number): V2 => [p[0] * k, p[1] * k];
export const dot = (p: V2, q: V2) => p[0] * q[0] + p[1] * q[1];
export const norm = (p: V2) => Math.hypot(p[0], p[1]);
export const apply = (A: M2, x: V2): V2 => [A[0][0] * x[0] + A[0][1] * x[1], A[1][0] * x[0] + A[1][1] * x[1]];
export const mm = (A: M2, B: M2): M2 => [
  [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
  [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]],
];
export const det = (M: M2) => M[0][0] * M[1][1] - M[0][1] * M[1][0];
export const col = (M: M2, j: 0 | 1): V2 => [M[0][j], M[1][j]];
export const I2: M2 = [[1, 0], [0, 1]];
export const sameM = (M: M2, N: M2, e = 1e-9) => M.every((r, i) => r.every((v, j) => Math.abs(v - N[i][j]) < e));

const TOL = 1e-9;
const isInt = (v: number) => Math.abs(v - Math.round(v)) < 1e-7;

/** A direction scaled to small integers if possible, first non-zero entry positive. */
export function niceVec(v: V2): V2 {
  const m = Math.max(Math.abs(v[0]), Math.abs(v[1]));
  if (!(m > 0)) return [0, 0];
  const w = v.map((c) => (Math.abs(c / m) < 1e-12 ? 0 : c / m)) as V2;
  const small = Math.min(...w.filter((c) => c !== 0).map(Math.abs));
  const base = w.map((c) => c / small);
  let out: V2 | null = null;
  for (let k = 1; k <= 12 && !out; k++) {
    const c = base.map((z) => z * k);
    if (c.every((z) => Math.abs(z - Math.round(z)) < 1e-7)) out = c.map(Math.round) as V2;
  }
  const o = out ?? w;
  const s = (o[0] !== 0 ? o[0] : o[1]) < 0 ? -1 : 1;
  return [o[0] * s + 0, o[1] * s + 0];
}

/** A particular solution with small integer entries (both non-zero if possible), else xp. */
export function niceParticular(xp: V2, n: V2): V2 {
  let best = xp, bs = Infinity;
  for (let k = -80; k <= 80; k++) {
    const x = add(xp, scale(n, k / 20));
    if (!x.every(isInt)) continue;
    const r = x.map(Math.round) as V2, z = r.filter((v) => v === 0).length;
    const sc = Math.abs(r[0]) + Math.abs(r[1]) + (z === 1 ? 2 : z === 2 ? 5 : 0) + 0.1 * r.filter((v) => v < 0).length;
    if (sc < bs) { bs = sc; best = [r[0] + 0, r[1] + 0]; }
  }
  return best;
}

export type Kind2 = 'unique' | 'infinite' | 'none' | 'all';
export interface Analysis {
  a1: V2; a2: V2; det: number;
  /** rank 0, 1 or 2 */
  r: 0 | 1 | 2;
  kind: Kind2;
  /** unit direction of the column space (rank 1) */
  u: V2 | null;
  /** direction of the null space A n = 0 (rank 1) */
  n: V2 | null;
  /** the solution (unique), the minimum-norm solution (rank 1), or 0 */
  xp: V2;
  /** orthogonal projection of b onto the column space (= b when b is reachable) */
  proj: V2;
  inSpan: boolean;
  /** infinitely many: a particular solution with small integer entries */
  xc?: V2;
  /** no solution, rank 1: a first "try" whose Ax lies on the line, visibly away from the closest point */
  xg?: V2;
}

function firstTry(A: M2, R: { a1: V2; a2: V2; u: V2; proj: V2; xp: V2 }): V2 {
  let best: V2 | null = null, bs = Infinity;
  for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) {
    const x: V2 = [i, j], d = norm(sub(apply(A, x), R.proj));
    if (d < 1 || d > 3.5) continue;
    const z = +(i === 0) + +(j === 0);
    const sc = Math.abs(i) + Math.abs(j) + (z === 1 ? 1.5 : z === 2 ? 9 : 0) + 0.3 * Math.abs(d - 2);
    if (sc < bs) { bs = sc; best = x; }
  }
  if (best) return best;
  const w: V2 = [dot(R.a1, R.u), dot(R.a2, R.u)], d = dot(R.proj, R.u) > 0 ? -2 : 2;
  return add(R.xp, scale(w, d / dot(w, w)));
}

/** Rank (with tolerance), solution / minimum-norm solution, null direction, projection of b onto the column space. */
export function analyze(A: M2, b: V2): Analysis {
  const a1 = col(A, 0), a2 = col(A, 1);
  const s = Math.max(...A.flat().map(Math.abs));
  const d = det(A), bn = norm(b);
  const base = { a1, a2, det: d, u: null as V2 | null, n: null as V2 | null };
  if (s < TOL) {
    const inSpan = bn < TOL;
    return { ...base, r: 0, kind: inSpan ? 'all' : 'none', xp: [0, 0], proj: [0, 0], inSpan, xc: undefined };
  }
  if (Math.abs(d) <= TOL * Math.max(1, s * s)) {
    const n1 = norm(a1), n2 = norm(a2);
    const u = n1 >= n2 ? scale(a1, 1 / n1) : scale(a2, 1 / n2);
    const w: V2 = [dot(a1, u), dot(a2, u)], ww = dot(w, w), ub = dot(u, b); // A = u·wᵀ
    const xp: V2 = [(w[0] * ub) / ww, (w[1] * ub) / ww];
    const proj = scale(u, ub);
    const inSpan = norm(sub(b, proj)) <= 1e-9 * Math.max(1, bn);
    const n = niceVec([-w[1], w[0]]);
    const R: Analysis = { ...base, r: 1, kind: inSpan ? 'infinite' : 'none', u, n, xp, proj, inSpan };
    if (inSpan) R.xc = niceParticular(xp, n); else R.xg = firstTry(A, { a1, a2, u, proj, xp });
    return R;
  }
  const xp: V2 = [(b[0] * A[1][1] - A[0][1] * b[1]) / d, (A[0][0] * b[1] - A[1][0] * b[0]) / d]; // Cramer
  return { ...base, r: 2, kind: 'unique', xp, proj: [b[0], b[1]], inSpan: true };
}

/** The path from the identity to F: a (scaled) rotation turns, everything else goes in a straight line (1 − t)·I + t·F. */
export function interp(F: M2, t: number): M2 {
  const a = F[0][0], b = F[1][0];
  if (Math.abs(F[0][1] + b) < 1e-9 && Math.abs(F[1][1] - a) < 1e-9) {
    const k = Math.hypot(a, b);
    let th = Math.atan2(b, a);
    if (k > 1e-9 && Math.abs(th) > 1e-9) {
      if (Math.abs(th) > Math.PI - 1e-9) th = Math.PI;
      const sc = 1 - t + t * k, c = Math.cos(t * th), s = Math.sin(t * th);
      return [[sc * c, -sc * s], [sc * s, sc * c]];
    }
  }
  return [[1 - t + t * F[0][0], t * F[0][1]], [t * F[1][0], 1 - t + t * F[1][1]]];
}
