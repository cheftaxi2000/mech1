/**
 * Geometry of the «Fernkraft» explorer (p. 30, Zusatzpostulat): two material points A₁, A₂ and the pair of forces {A₂ | F̲}, {A₁ | −F̲}.
 * Screen coordinates (y down). The force direction is along the line A₁A₂ (attractive: A₂ is pulled towards A₁); the «forbidden variant»
 * tilts the SAME pair by an angle: still equal and opposite, but no longer on the connecting line.
 */
import type { Vec3 } from '../../physics/vec';
export type V = readonly [number, number];

/** closer than this: the two points are treated as coinciding (contact); between NEAR and MIN_GAP the gap is kept open */
export const NEAR = 40, MIN_GAP = 110;

export interface Pair { onA2: V; onA1: V }
const rot = (v: V, a: number): V => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];

/**
 * Forces of the pair for the points A1, A2 (distinct), length `len` px, attractive (A₂ pulled to A₁) or repulsive.
 * `tilt` (radians) rotates both forces; 0 = the lecture's Zusatzpostulat.
 */
export function fernPair(A1: V, A2: V, len: number, attractive: boolean, tilt = 0): Pair {
  const d = Math.hypot(A2[0] - A1[0], A2[1] - A1[1]);
  if (d === 0) return { onA2: [0, 0], onA1: [0, 0] };
  const u: V = [(A1[0] - A2[0]) / d, (A1[1] - A2[1]) / d]; // from A₂ towards A₁
  const s = attractive ? 1 : -1;
  const f = rot([s * len * u[0], s * len * u[1]], tilt);
  return { onA2: f, onA1: [-f[0], -f[1]] };
}

/** Where A₂ ends up when the user drags it to p (A₁ fixed): contact when close, never inside the forbidden ring. */
export function snapA2(A1: V, p: V): { A2: V; contact: boolean } {
  const d = Math.hypot(p[0] - A1[0], p[1] - A1[1]);
  if (d < NEAR) return { A2: A1, contact: true };
  if (d < MIN_GAP) { const k = MIN_GAP / d; return { A2: [A1[0] + k * (p[0] - A1[0]), A1[1] + k * (p[1] - A1[1])], contact: false }; }
  return { A2: p, contact: false };
}

/** screen (y down) → physics (y up), as 3D vectors for force.ts */
export const phys = (v: V): Vec3 => [v[0], -v[1], 0];
