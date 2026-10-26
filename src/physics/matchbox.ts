/**
 * Supplement to «Kraft» (p. 29): the same force vector F̲ applied at different points A of a body.
 * A uniform rectangle (w × h, mass m) lies on a smooth table (no friction), seen from above. A constant force F̲ of fixed
 * direction pulls at the body-fixed point A. This is NOT lecture content (the dynamics comes later): it only shows that the
 * point of application belongs to the force. Planar rigid-body dynamics: m a = F, I α = (r × F)_z, I = m (w² + h²) / 12.
 */
export interface BoxSpec { w: number; h: number; m: number }
export interface BoxState { x: number; y: number; th: number; vx: number; vy: number; om: number }
export type P2 = readonly [number, number];

export const inertia = (b: BoxSpec): number => (b.m * (b.w * b.w + b.h * b.h)) / 12;

/** A in the world: centre + R(θ)·r, with r the body-fixed position of A relative to the centre of mass. */
export function attackPoint(s: Pick<BoxState, 'x' | 'y' | 'th'>, r: P2): P2 {
  const c = Math.cos(s.th), n = Math.sin(s.th);
  return [s.x + c * r[0] - n * r[1], s.y + n * r[0] + c * r[1]];
}

/** z-component of r_world × F for the body-fixed point r at angle θ. */
export function torqueZ(r: P2, th: number, F: P2): number {
  const c = Math.cos(th), n = Math.sin(th);
  const rx = c * r[0] - n * r[1], ry = n * r[0] + c * r[1];
  return rx * F[1] - ry * F[0];
}

function deriv(b: BoxSpec, r: P2, F: P2, s: BoxState): BoxState {
  return { x: s.vx, y: s.vy, th: s.om, vx: F[0] / b.m, vy: F[1] / b.m, om: torqueZ(r, s.th, F) / inertia(b) };
}
const axpy = (s: BoxState, d: BoxState, h: number): BoxState => ({
  x: s.x + h * d.x, y: s.y + h * d.y, th: s.th + h * d.th, vx: s.vx + h * d.vx, vy: s.vy + h * d.vy, om: s.om + h * d.om,
});

/** Motion from rest at the origin for the time T; returns n + 1 samples at t = i·T/n (classical Runge–Kutta). */
export function simulateBox(b: BoxSpec, r: P2, F: P2, T: number, n = 240): BoxState[] {
  const h = T / n;
  let s: BoxState = { x: 0, y: 0, th: 0, vx: 0, vy: 0, om: 0 };
  const out = [s];
  for (let i = 0; i < n; i++) {
    const k1 = deriv(b, r, F, s), k2 = deriv(b, r, F, axpy(s, k1, h / 2)), k3 = deriv(b, r, F, axpy(s, k2, h / 2)), k4 = deriv(b, r, F, axpy(s, k3, h));
    const w = (a: number, b2: number, c: number, d: number) => (h / 6) * (a + 2 * b2 + 2 * c + d);
    s = {
      x: s.x + w(k1.x, k2.x, k3.x, k4.x), y: s.y + w(k1.y, k2.y, k3.y, k4.y), th: s.th + w(k1.th, k2.th, k3.th, k4.th),
      vx: s.vx + w(k1.vx, k2.vx, k3.vx, k4.vx), vy: s.vy + w(k1.vy, k2.vy, k3.vy, k4.vy), om: s.om + w(k1.om, k2.om, k3.om, k4.om),
    };
    out.push(s);
  }
  return out;
}

/** State at time t ∈ [0, T] from the samples (linear interpolation between two samples). */
export function stateAt(samples: readonly BoxState[], T: number, t: number): BoxState {
  const u = Math.max(0, Math.min(1, t / T)) * (samples.length - 1);
  const i = Math.min(samples.length - 2, Math.floor(u)), f = u - i, a = samples[i], c = samples[i + 1];
  const l = (p: number, q: number) => p + f * (q - p);
  return { x: l(a.x, c.x), y: l(a.y, c.y), th: l(a.th, c.th), vx: l(a.vx, c.vx), vy: l(a.vy, c.vy), om: l(a.om, c.om) };
}

/** Perpendicular distance of the centre of mass from the line of action of F̲ through A (the «lever» that turns the body). */
export function offsetFromLine(r: P2, F: P2): number {
  const n = Math.hypot(F[0], F[1]);
  return n === 0 ? 0 : Math.abs(r[0] * F[1] - r[1] * F[0]) / n;
}
