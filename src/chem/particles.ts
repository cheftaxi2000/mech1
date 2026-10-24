/**
 * A small deterministic gas simulation for the pressure figures (lecture 2, slides 11, 22–25).
 *
 * Particles fly in a 2-D box (width W, height 1) without colliding with each other (an ideal gas: they do not
 * interact and take up no room) and bounce elastically off the four walls. Pressure is *measured* the way the
 * lecture explains it: every bounce hands an impulse 2·m·|v_normal| to the wall; the force per unit wall length
 * is the sum of the impulses per second. In two dimensions the kinetic theory gives  P·A = N·k·T  (A = W·1),
 * which is the 2-D version of PV = nRT — the test file checks that the measured value agrees with it.
 *
 * Units are arbitrary «sim units»; `kSim` fixes the speed scale so that N₂ at 300 K has v_rms = 0.4 box heights per second.
 * Species differ only in their mass (u): at the same temperature they have the same average kinetic energy, so the
 * light ones are faster (slide 26).
 */
export interface Part { x: number; y: number; vx: number; vy: number; s: number }
export interface Flash { x: number; y: number; side: 'l' | 'r' | 't' | 'b'; age: number }
interface Window { imp: number[]; dur: number }
export interface Sim {
  seed: number; // state of the random number generator
  W: number; // box width (height is 1)
  T: number; // temperature in K
  masses: number[]; // per species, in u
  parts: Part[];
  time: number;
  win: Window[]; // finished measurement windows (newest last)
  cur: Window; // window being filled
  flashes: Flash[];
  hits: number; // wall hits since the last reset of the measurement
  keep: number; // how many 0.25 s windows the pressure average covers
}

/** speed scale: kT in sim units so that v_rms(N₂, 300 K) = 0.4 box heights / s  (2-D: ½ m ⟨v²⟩ = kT) */
export const kSim = (0.4 * 0.4 * 28) / (2 * 300);
export const WINDOW_S = 0.25;
export const WINDOWS_KEPT = 8;
export const FLASH_S = 0.35;

/** mulberry32 — a tiny seeded generator; every call advances `sim.seed`. */
export function rand(sim: { seed: number }): number {
  sim.seed = (sim.seed + 0x6d2b79f5) | 0;
  let t = Math.imul(sim.seed ^ (sim.seed >>> 15), 1 | sim.seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const gauss = (sim: { seed: number }) => Math.sqrt(-2 * Math.log(1 - rand(sim))) * Math.cos(2 * Math.PI * rand(sim));

/** root-mean-square speed (box heights per second) of a species of mass m (u) at T (K) in the 2-D sim: √(2kT/m) */
export const vrmsSim = (T: number, m: number) => Math.sqrt((2 * kSim * T) / m);

function newPart(sim: Sim, s: number): Part {
  const sd = Math.sqrt((kSim * sim.T) / sim.masses[s]); // each velocity component is Gaussian with variance kT/m
  return { x: rand(sim) * sim.W, y: rand(sim), vx: gauss(sim) * sd, vy: gauss(sim) * sd, s };
}
/**
 * Give all particles of species s a fresh set of velocities with mean kinetic energy exactly kT: Rayleigh-distributed
 * speeds (the 2-D Maxwell shape) and evenly spread directions. The particles do not collide, so a lucky or unlucky
 * random sample would otherwise stay with a small box for ever; this keeps even 5 particles honest.
 */
function rethermalize(sim: Sim, s: number) {
  const ps = sim.parts.filter((p) => p.s === s);
  const n = ps.length;
  if (!n) return;
  const sp = ps.map(() => Math.sqrt(-2 * Math.log(1 - rand(sim))));
  const mean2 = sp.reduce((a, v) => a + v * v, 0) / n;
  const k = Math.sqrt((2 * kSim * sim.T) / (sim.masses[s] * mean2)); // ⟨v²⟩ = 2kT/m in 2-D
  const off = rand(sim);
  const order = ps.map((_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand(sim) * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  ps.forEach((p, i) => { const a = (2 * Math.PI * (order[i] + off)) / n; p.vx = Math.cos(a) * sp[i] * k; p.vy = Math.sin(a) * sp[i] * k; });
}
const emptyWin = (n: number): Window => ({ imp: new Array(n).fill(0), dur: 0 });

/** counts[s] particles of species s with masses[s] (u). */
export function createSim(o: { seed: number; W: number; T: number; masses: number[]; counts: number[]; keep?: number }): Sim {
  const sim: Sim = { seed: o.seed, W: o.W, T: o.T, masses: o.masses, parts: [], time: 0, win: [], cur: emptyWin(o.masses.length), flashes: [], hits: 0, keep: o.keep ?? WINDOWS_KEPT };
  o.counts.forEach((c, s) => { for (let i = 0; i < c; i++) sim.parts.push(newPart(sim, s)); rethermalize(sim, s); });
  return sim;
}

export const countOf = (sim: Sim, s: number) => sim.parts.reduce((a, p) => a + (p.s === s ? 1 : 0), 0);
function resetMeasurement(sim: Sim) { sim.win = []; sim.cur = emptyWin(sim.masses.length); sim.hits = 0; }

/** Change the temperature: speeds scale with √T (the average kinetic energy is proportional to T, slide 25). */
export function setT(sim: Sim, T: number) {
  if (T === sim.T) return;
  const f = Math.sqrt(T / sim.T);
  for (const p of sim.parts) { p.vx *= f; p.vy *= f; }
  sim.T = T; resetMeasurement(sim);
}
/** Move the right wall: the particles keep their relative positions (an isothermal squeeze or stretch). */
export function setWidth(sim: Sim, W: number) {
  if (W === sim.W) return;
  const f = W / sim.W;
  for (const p of sim.parts) p.x *= f;
  sim.W = W; resetMeasurement(sim);
}
/** Add or remove particles of species s until there are `n`. */
export function setCount(sim: Sim, s: number, n: number) {
  let have = countOf(sim, s);
  while (have < n) { sim.parts.push(newPart(sim, s)); have++; }
  while (have > n) { const i = sim.parts.map((p) => p.s).lastIndexOf(s); sim.parts.splice(i, 1); have--; }
  rethermalize(sim, s);
  resetMeasurement(sim);
}

function bounce(sim: Sim, p: Part, impulse: number[]) {
  const W = sim.W;
  const m = sim.masses[p.s];
  const hit = (side: Flash['side'], vn: number, x: number, y: number) => {
    impulse[p.s] += 2 * m * Math.abs(vn);
    sim.hits++;
    sim.flashes.push({ x, y, side, age: 0 });
  };
  for (let k = 0; k < 4 && (p.x < 0 || p.x > W || p.y < 0 || p.y > 1); k++) {
    if (p.x < 0) { hit('l', p.vx, 0, p.y); p.x = -p.x; p.vx = -p.vx; }
    else if (p.x > W) { hit('r', p.vx, W, p.y); p.x = 2 * W - p.x; p.vx = -p.vx; }
    if (p.y < 0) { hit('b', p.vy, p.x, 0); p.y = -p.y; p.vy = -p.vy; }
    else if (p.y > 1) { hit('t', p.vy, p.x, 1); p.y = 2 - p.y; p.vy = -p.vy; }
  }
  // a particle that was created outside by a width change is pulled back in
  p.x = Math.min(Math.max(p.x, 0), W); p.y = Math.min(Math.max(p.y, 0), 1);
}

const STEP = 1 / 120;
/** Advance by `dt` seconds (several small steps). */
export function advance(sim: Sim, dt: number) {
  let left = dt;
  while (left > 1e-12) {
    const h = Math.min(STEP, left);
    left -= h;
    for (const p of sim.parts) { p.x += p.vx * h; p.y += p.vy * h; bounce(sim, p, sim.cur.imp); }
    sim.time += h; sim.cur.dur += h;
    for (const f of sim.flashes) f.age += h;
    if (sim.flashes.length && sim.flashes[0].age > FLASH_S) sim.flashes = sim.flashes.filter((f) => f.age <= FLASH_S);
    if (sim.cur.dur >= WINDOW_S) { sim.win.push(sim.cur); while (sim.win.length > sim.keep) sim.win.shift(); sim.cur = emptyWin(sim.masses.length); }
  }
}

/** Measured pressure of species s (or of all, s = −1) in sim units: impulse per second per unit wall length (perimeter 2(W+1)). */
export function measuredP(sim: Sim, s = -1): number | null {
  const ws = sim.win.length ? sim.win : [];
  const dur = ws.reduce((a, w) => a + w.dur, 0);
  if (dur < WINDOW_S) return null;
  const imp = ws.reduce((a, w) => a + (s < 0 ? w.imp.reduce((x, y) => x + y, 0) : w.imp[s]), 0);
  return imp / (dur * 2 * (sim.W + 1));
}
/** The kinetic-theory value N·k·T/(W·1) in the same units (2-D: P·A = N·k·T). */
export function idealPSim(sim: Sim, s = -1): number {
  const n = s < 0 ? sim.parts.length : countOf(sim, s);
  return (n * kSim * sim.T) / sim.W;
}
/** Average kinetic energy ½ m v² per particle (all species, or species s). */
export function meanKE(sim: Sim, s = -1): number {
  const ps = sim.parts.filter((p) => s < 0 || p.s === s);
  if (!ps.length) return 0;
  return ps.reduce((a, p) => a + 0.5 * sim.masses[p.s] * (p.vx * p.vx + p.vy * p.vy), 0) / ps.length;
}
export const speedOf = (p: Part) => Math.hypot(p.vx, p.vy);
export const meanSpeed = (sim: Sim, s: number) => {
  const ps = sim.parts.filter((p) => p.s === s);
  return ps.length ? ps.reduce((a, p) => a + speedOf(p), 0) / ps.length : 0;
};
/** mass density of the gas in the box: Σ m / (W·1) in u per sim area (exercise 5c). */
export const massDensity = (sim: Sim) => sim.parts.reduce((a, p) => a + sim.masses[p.s], 0) / sim.W;
