/**
 * Kräfte und Leistung (Skript Kap. 4 «Kräfte», pp. 29–32, and Kap. 5 «Leistung», pp. 33–36).
 * Notation of the lecture: a force is a point-bound vector {A | F̲} (p. 29); P = F̲ · v̲_A (p. 33); M̲_O = OP̲ × F̲ (p. 34);
 * P = R̲ · v̲_B + M̲_B · ω̲ (p. 34, proof p. 35). Pure functions; the numeric source of truth for the lessons.
 */
import { add, cross, dot, norm, scale, sub, type Vec3 } from './vec';

/** {A | F̲}: the force F applied at the point A (p. 29, Fig. 4.1). */
export interface PointForce { A: Vec3; F: Vec3 }

const ZERO: Vec3 = [0, 0, 0];

// ───────────────────────────────────── Kapitel 4: Kräfte ─────────────────────────────────────

/** Kräftegruppe with the same point of application: R̲ = Σ F̲_i (p. 29, Fig. 4.2). */
export function resultant(forces: readonly Pick<PointForce, 'F'>[]): Vec3 {
  return forces.reduce<Vec3>((s, f) => add(s, f.F), ZERO);
}

/** Partial sums R_k = F_1 + … + F_k (the head-to-tail chain of the animation). */
export function partialSums(forces: readonly Pick<PointForce, 'F'>[]): Vec3[] {
  const out: Vec3[] = [];
  let s: Vec3 = ZERO;
  for (const f of forces) { s = add(s, f.F); out.push(s); }
  return out;
}

/** Reaktionsprinzip (p. 30): the reaction to {A₂ | F̲} (exerted by A₁) is {A₁ | −F̲}. */
export function reaction(actio: PointForce, A1: Vec3): PointForce {
  return { A: A1, F: scale(-1, actio.F) };
}

/**
 * Zusatzpostulat (Fernkräfte, p. 30): the lines of action of force and counter-force lie on the line through A₁ and A₂,
 * i.e. F̲ ∥ A₁A₂̲ (F̲ × A₁A₂̲ = 0). For contact forces A₁ = A₂ there is no such line.
 */
export function actsAlongConnection(A1: Vec3, A2: Vec3, F: Vec3, tol = 1e-9): boolean {
  const d = sub(A2, A1);
  return norm(cross(F, d)) <= tol * Math.max(1, norm(F) * norm(d));
}

/** An interaction between two bodies: `on` receives {A_on | F}, the other body `by` receives the reaction. */
export interface Interaction { id: string; on: string; by: string; Aon: Vec3; Aby: Vec3; F: Vec3 }

/**
 * Systemabgrenzung (pp. 30–31). Given the set of bodies that form the system:
 * an interaction acts *inside* if both bodies belong to the system (the attack point of the reaction is also in the system, p. 30),
 * it acts from *outside* if exactly one of them does. The forces on the system's own bodies are listed.
 * Returns the forces acting ON the system's bodies, split into inner and outer ones.
 */
export function classify(system: ReadonlySet<string>, interactions: readonly Interaction[]) {
  const inner: { id: string; body: string; force: PointForce }[] = [];
  const outer: { id: string; body: string; force: PointForce }[] = [];
  for (const i of interactions) {
    const onIn = system.has(i.on), byIn = system.has(i.by);
    if (onIn) (byIn ? inner : outer).push({ id: i.id, body: i.on, force: { A: i.Aon, F: i.F } });
    if (byIn) (onIn ? inner : outer).push({ id: `${i.id}'`, body: i.by, force: { A: i.Aby, F: scale(-1, i.F) } });
  }
  return { inner, outer };
}

/** Σ F̲ of the inner forces of a system is 0, since they come in pairs {A|F}, {A′|−F} (a consequence of the Reaktionsprinzip). */
export const sumForces = (fs: readonly { force: PointForce }[]): Vec3 => resultant(fs.map((f) => f.force));

/**
 * Supplement example for Fig. in p. 31: a block (weight G down, pull Z to the right, friction −Z) sits at distance x from A on a
 * massless beam of length ℓ resting on two supports A and B (zero thickness). Vertical support forces from the lever rule,
 * the horizontal one split equally (statically undetermined; the split is our choice).
 * Returns the forces the *supports exert on the beam* (what the lecture calls F̲_A, F̲_B).
 */
export function supportForces(ell: number, x: number, G: number, Z: number): { FA: Vec3; FB: Vec3 } {
  const s = x / ell;
  return { FA: [-Z / 2, G * (1 - s), 0], FB: [-Z / 2, G * s, 0] };
}

// ─────────────────────────────── verteilte Kräfte (p. 32) ───────────────────────────────

/** ∫ f(x) dx on [a, b] by the midpoint rule with n slices (the sum Σ f(x_i)Δx of the animation). */
export function midpointSum(f: (x: number) => number, a: number, b: number, n: number): number {
  const h = (b - a) / n;
  let s = 0;
  for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h) * h;
  return s;
}

/** Adaptive-free reference value: Simpson's rule with many slices. */
export function integrate(f: (x: number) => number, a: number, b: number, n = 2000): number {
  const m = n % 2 ? n + 1 : n;
  const h = (b - a) / m;
  let s = f(a) + f(b);
  for (let i = 1; i < m; i++) s += f(a + i * h) * (i % 2 ? 4 : 2);
  return (s * h) / 3;
}

/** Linienkraftdichte q(x) [N/m] over [0, L]: R = ∫ q(x) dx (p. 32). */
export const lineResultant = (q: (x: number) => number, L: number) => integrate(q, 0, L);

/** Flächenkraftdichte s(x, y) [N/m²] on the rectangle [0,a]×[0,b]: R = ∫∫ s dA (p. 32), n×n midpoint cells. */
export function areaSum(s: (x: number, y: number) => number, a: number, b: number, n: number): number {
  const hx = a / n, hy = b / n;
  let r = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) r += s((i + 0.5) * hx, (j + 0.5) * hy) * hx * hy;
  return r;
}

/** Mass of the cube of side h centred at c for a density field ρ(x, y, z), midpoint rule with m³ cells. */
export function cubeMass(rho: (p: Vec3) => number, c: Vec3, h: number, m = 8): number {
  let s = 0;
  const d = h / m;
  for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) for (let k = 0; k < m; k++) {
    s += rho([c[0] - h / 2 + (i + 0.5) * d, c[1] - h / 2 + (j + 0.5) * d, c[2] - h / 2 + (k + 0.5) * d]) * d * d * d;
  }
  return s;
}

/** ΔM/ΔV for a cube of side h around c (p. 32, «Parenthèse»): →ρ(c) for h → 0, while ΔM → 0. */
export const densityRatio = (rho: (p: Vec3) => number, c: Vec3, h: number) => cubeMass(rho, c, h) / (h * h * h);

/** Weight of a homogeneous body (p. 32): G̲ = −ρ g V e̲_z. */
export const weightHomogeneous = (rho: number, g: number, V: number): Vec3 => [0, 0, -rho * g * V];

/** Weight from a density field: G̲ = −g ∭ ρ dV e̲_z over the box [0,a]×[0,b]×[0,c] (m³ cells per axis). */
export function weightBox(rho: (p: Vec3) => number, g: number, a: number, b: number, c: number, m = 16): Vec3 {
  let M = 0;
  const dx = a / m, dy = b / m, dz = c / m;
  for (let i = 0; i < m; i++) for (let j = 0; j < m; j++) for (let k = 0; k < m; k++) {
    M += rho([(i + 0.5) * dx, (j + 0.5) * dy, (k + 0.5) * dz]) * dx * dy * dz;
  }
  return [0, 0, -g * M];
}

// ───────────────────────────────────── Kapitel 5: Leistung ─────────────────────────────────────

/** Leistung einer Kraft {A | F̲} auf einen Punkt mit Geschwindigkeit v̲_A: P = F̲ · v̲_A (p. 33). */
export const power = (F: Vec3, v: Vec3): number => dot(F, v);

/** P = |F||v| cos α (p. 33); α is the angle between F̲ and v̲ (undefined for F = 0 or v = 0). */
export function powerAngle(F: Vec3, v: Vec3): number | null {
  const nf = norm(F), nv = norm(v);
  if (nf === 0 || nv === 0) return null;
  return Math.acos(Math.max(-1, Math.min(1, dot(F, v) / (nf * nv))));
}

export type PowerKind = 'drive' | 'resist' | 'none';
/** Antriebskraft α < π/2 (P > 0), Widerstandskraft α > π/2 (P < 0), leistungslos α = π/2 (P = 0) (p. 33, handwritten). */
export function powerKind(F: Vec3, v: Vec3, tol = 1e-9): PowerKind {
  const p = dot(F, v), s = Math.max(1, norm(F) * norm(v));
  return Math.abs(p) <= tol * s ? 'none' : p > 0 ? 'drive' : 'resist';
}

/** Lorentz force F̲ = q v̲ × B̲ (Fig. 5.2): always ⟂ v̲, so P = 0. */
export const lorentz = (q: number, v: Vec3, B: Vec3): Vec3 => scale(q, cross(v, B));

/** v̲_P = ω̲ × OP̲ for a point P of a body rotating about an axis through O with angular velocity ω̲ (p. 33). */
export const rotVelocity = (omega: Vec3, O: Vec3, P: Vec3): Vec3 => cross(omega, sub(P, O));

/** M̲_O = OP̲ × F̲: moment of the force {P | F̲} about O (p. 34). */
export const moment = (O: Vec3, f: PointForce): Vec3 => cross(sub(f.A, O), f.F);

/** Lever arm: perpendicular distance of O from the line of action, |M̲_O| / |F̲|. */
export const leverArm = (O: Vec3, f: PointForce): number => (norm(f.F) === 0 ? 0 : norm(moment(O, f)) / norm(f.F));

/** P = F̲ · (ω̲ × OP̲) = ω̲ · (OP̲ × F̲) = ω̲ · M̲_O (p. 33). Both sides: the cyclic permutation of the triple product. */
export const powerRotation = (omega: Vec3, O: Vec3, f: PointForce): number => dot(f.F, rotVelocity(omega, O, f.A));
export const powerViaMoment = (omega: Vec3, O: Vec3, f: PointForce): number => dot(omega, moment(O, f));

/** M_z = M̲_O · e̲_z, the projection on the axis direction e̲ (p. 34): independent of O on the axis. */
export const momentAbout = (axisDir: Vec3, O: Vec3, f: PointForce): number => dot(moment(O, f), scale(1 / norm(axisDir), axisDir));

/** v̲_A = v̲_B + ω̲ × BA̲ (rigid body, p. 35). */
export const rigidVelocity = (B: Vec3, vB: Vec3, omega: Vec3, A: Vec3): Vec3 => add(vB, cross(omega, sub(A, B)));

/** Σ F̲_i · v̲_i, each force with the velocity of its own point of application (p. 34: «Leistung einer Kräftegruppe»). */
export function powerSum(forces: readonly PointForce[], B: Vec3, vB: Vec3, omega: Vec3): number {
  return forces.reduce((s, f) => s + dot(f.F, rigidVelocity(B, vB, omega, f.A)), 0);
}

/** M̲_B = Σ BA̲_i × F̲_i: moment of the Kräftegruppe about B (p. 34). */
export function momentGroup(B: Vec3, forces: readonly PointForce[]): Vec3 {
  return forces.reduce<Vec3>((s, f) => add(s, moment(B, f)), ZERO);
}

/** The two parts of P = R̲ · v̲_B + M̲_B · ω̲ (p. 34, boxed). */
export function powerReduced(forces: readonly PointForce[], B: Vec3, vB: Vec3, omega: Vec3) {
  const R = resultant(forces), M = momentGroup(B, forces);
  const translation = dot(R, vB), rotation = dot(M, omega);
  return { R, M, translation, rotation, total: translation + rotation };
}

/** Per force: P_i = F_i·v_B + ω·(BA_i × F_i) — the split used in the proof (p. 35). */
export function powerSplit(f: PointForce, B: Vec3, vB: Vec3, omega: Vec3) {
  const trans = dot(f.F, vB), rot = dot(omega, moment(B, f));
  return { trans, rot, total: trans + rot };
}

// ─────────────────────────── Beispiel Figur 5.6: die Leiter (pp. 35–36) ───────────────────────────

/** Ladder of length L at 45°, foot A moves with v̲_A = (v, 0, 0), ω̲ = (0, 0, ω); weight G at B (down), force W at C ⟂ ladder (up-left). */
export interface Ladder { L: number; G: number; W: number; v: number; omega: number }
const S2 = Math.SQRT1_2; // √2/2
export function ladder({ L, G, W, v, omega }: Ladder) {
  const A: Vec3 = [0, 0, 0];
  const AB: Vec3 = [L * S2, L * S2, 0], AC: Vec3 = [(L * S2) / 2, (L * S2) / 2, 0];
  const FB: Vec3 = [0, -G, 0], FC: Vec3 = [-S2 * W, S2 * W, 0];
  const vA: Vec3 = [v, 0, 0], om: Vec3 = [0, 0, omega];
  const vC = rigidVelocity(A, vA, om, AC), vB = rigidVelocity(A, vA, om, AB);
  const forces: PointForce[] = [{ A: AB, F: FB }, { A: AC, F: FC }];
  const PB = dot(FB, vB), PC = dot(FC, vC);
  const red = powerReduced(forces, A, vA, om);
  return {
    A, AB, AC, FB, FC, vA, om, vB, vC, PB, PC, forces, red,
    /** Methode II (p. 35 right): P = Σ F_i · v_i */
    methodII: PB + PC,
    /** Methode I (p. 35 left): P = R·v_A + ω·M_A */
    methodI: red.total,
    /** handwritten result: −(√2/2) W v + ω W L/2 − (√2/2) G L ω */
    closed: -S2 * W * v + omega * W * L / 2 - S2 * G * L * omega,
    /** page 36 (III, IV) */
    parts: { PB: -S2 * G * omega * L, PC: W * omega * L / 2 - S2 * W * v, RvA: -S2 * W * v, MAomega: omega * (W * L / 2 - S2 * G * L) },
  };
}
