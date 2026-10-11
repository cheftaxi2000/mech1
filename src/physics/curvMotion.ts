/**
 * Motion with constant coordinate rates (lesson v-krummlinig, figure "CurvilinearVelocity").
 * q = (ρ, φ, z) or (r, θ, ψ); q(t) = q0 + rates·t. Pure, so the figure's claims are unit-testable:
 * the sum of the three velocity terms IS the derivative of the drawn trajectory (tangent to it).
 */
import { cylToCart, eR, ePhi, ePsi, eRho, eTheta, sphToCart } from './coords';
import { add, type Vec3 } from './vec';

export type CMode = 'cyl' | 'sph';
export type Q = readonly [number, number, number];

export const qAt = (q0: Q, rates: Q, t: number): Q => [q0[0] + rates[0] * t, q0[1] + rates[1] * t, q0[2] + rates[2] * t];

export const posOf = (mode: CMode, q: Q): Vec3 =>
  mode === 'cyl' ? cylToCart({ rho: q[0], phi: q[1], z: q[2] }) : sphToCart({ r: q[0], theta: q[1], psi: q[2] });

/** Region the figure can show and where the coordinates are well defined (ρ > 0, r > 0, 0 < θ < π). */
export const LIMITS = {
  cyl: { lo: [0.12, -Infinity, -1.4], hi: [2.4, Infinity, 2.0] },
  sph: { lo: [0.15, 0.06, -Infinity], hi: [2.4, Math.PI - 0.06, Infinity] },
} as const;
export const inside = (mode: CMode, q: Q) => q.every((v, i) => v >= LIMITS[mode].lo[i] && v <= LIMITS[mode].hi[i]);

/** The three terms of v (lecture p. 10), as vectors in Cartesian components. */
export function velocityTerms(mode: CMode, q: Q, rates: Q): [Vec3, Vec3, Vec3] {
  if (mode === 'cyl') {
    const [rho, phi] = q;
    const er = eRho(phi), ep = ePhi(phi);
    return [
      [rates[0] * er[0], rates[0] * er[1], 0],
      [rho * rates[1] * ep[0], rho * rates[1] * ep[1], 0],
      [0, 0, rates[2]],
    ];
  }
  const [r, th, ps] = q;
  const a = eR(th, ps), b = eTheta(th, ps), c = ePsi(ps);
  const k1 = rates[0], k2 = r * rates[1], k3 = r * Math.sin(th) * rates[2];
  return [[k1 * a[0], k1 * a[1], k1 * a[2]], [k2 * b[0], k2 * b[1], k2 * b[2]], [k3 * c[0], k3 * c[1], k3 * c[2]]];
}
export const velocityOf = (mode: CMode, q: Q, rates: Q): Vec3 => velocityTerms(mode, q, rates).reduce((s, w) => add(s, w), [0, 0, 0] as Vec3);

/** Largest |t| ≤ tMax (in the given direction) for which the motion stays inside the drawable region. */
export function timeToEdge(mode: CMode, q0: Q, rates: Q, dir: 1 | -1, tMax: number, step = 0.02): number {
  let t = 0;
  while (t + step <= tMax && inside(mode, qAt(q0, rates, dir * (t + step)))) t += step;
  return t;
}
