/**
 * A tiny deterministic gas in a box (elastic walls, no collisions between particles): for pictures only.
 * Coordinates: x ∈ [0, L] (L = position of the piston wall, may change), y ∈ [0, 1]. Speeds are in box heights per second.
 * The same seed always gives the same motion, so frames are reproducible and testable.
 */
import { mulberry32 } from './entropy';

export interface Particle { x: number; y: number; vx: number; vy: number }

/** `n` particles placed on a jittered grid inside [0, L] × [0, 1] with unit-speed random directions. */
export function makeGas(n: number, L: number, seed: number): Particle[] {
  const rnd = mulberry32(seed);
  const cols = Math.max(1, Math.ceil(Math.sqrt(n * L))), rows = Math.max(1, Math.ceil(n / cols));
  const out: Particle[] = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols, r = Math.floor(i / cols);
    const a = rnd() * 2 * Math.PI;
    out.push({
      x: ((c + 0.2 + 0.6 * rnd()) / cols) * L, y: (r + 0.2 + 0.6 * rnd()) / rows,
      vx: Math.cos(a), vy: Math.sin(a),
    });
  }
  return out;
}

/** Advance by dt seconds with every velocity multiplied by `speed`; the piston wall is at x = L. Reflections are elastic. */
export function stepGas(ps: readonly Particle[], dt: number, L: number, speed: number): Particle[] {
  return ps.map((p) => {
    let { x, y, vx, vy } = p;
    x += vx * speed * dt; y += vy * speed * dt;
    // reflect (at most a few times for large steps)
    for (let k = 0; k < 4; k++) {
      if (x < 0) { x = -x; vx = Math.abs(vx); } else if (x > L) { x = 2 * L - x; vx = -Math.abs(vx); }
      if (y < 0) { y = -y; vy = Math.abs(vy); } else if (y > 1) { y = 2 - y; vy = -Math.abs(vy); }
    }
    x = Math.min(L, Math.max(0, x)); y = Math.min(1, Math.max(0, y));
    return { x, y, vx, vy };
  });
}

/** Mean kinetic energy per particle in units of (m/2)·speed² — the picture's stand-in for the thermal part of E. */
export const meanKinetic = (ps: readonly Particle[], speed: number) =>
  ps.reduce((s, p) => s + (p.vx * p.vx + p.vy * p.vy) * speed * speed, 0) / Math.max(1, ps.length);

/**
 * How fast the particles move in the picture when the internal energy is E (in units of the starting energy E₀):
 * kinetic energy ∝ speed², so speed ∝ √(E/E₀), floored so that the gas never freezes completely.
 */
export const speedForEnergy = (E: number, E0: number, base = 0.35) => base * Math.sqrt(Math.max(0.05, E / E0));

/**
 * Like `stepGas`, but the gas lives between two walls x0 <= x <= x1 (e.g. a partition or a piston on the left).
 * A particle that finds itself outside (because a wall moved over it) is pushed back inside and sent away from the wall.
 */
export function stepGasRange(ps: readonly Particle[], dt: number, x0: number, x1: number, speed: number): Particle[] {
  return ps.map((p) => {
    let { x, y, vx, vy } = p;
    x += vx * speed * dt; y += vy * speed * dt;
    for (let k = 0; k < 4; k++) {
      if (x < x0) { x = x0 + Math.min(x0 - x, x1 - x0); vx = Math.abs(vx); } else if (x > x1) { x = x1 - Math.min(x - x1, x1 - x0); vx = -Math.abs(vx); }
      if (y < 0) { y = -y; vy = Math.abs(vy); } else if (y > 1) { y = 2 - y; vy = -Math.abs(vy); }
    }
    x = Math.min(x1, Math.max(x0, x)); y = Math.min(1, Math.max(0, y));
    return { x, y, vx, vy };
  });
}
