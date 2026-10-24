/**
 * Diffusion picture of lecture 2, slide 28: one molecule (blue) zigzags through many others (red). The red ones are
 * frozen in place and the blue one flies straight until it comes close to one (distance `rc`), then leaves in a new
 * random direction: «collisions randomise its direction of motion». In two dimensions the average distance between
 * collisions (the mean free path) is λ = 1/(2·rc·ρ) for ρ obstacles per unit area; the tests check that.
 */
import { rand } from './particles';
export type P2 = [number, number];

export interface Walk {
  obstacles: P2[];
  path: P2[]; // every vertex: start, wall bounces, collision points
  collisionAt: number[]; // indices into `path` of the collision vertices
  segLengths: number[]; // length between successive collisions (wall bounces do not end a segment)
  rc: number; W: number; H: number;
}

export const theoryMfp = (density: number, rc: number) => 1 / (2 * rc * density);

export function makeWalk(o: { seed: number; W: number; H: number; density: number; rc: number; collisions: number }): Walk {
  const sim = { seed: o.seed };
  const { W, H, rc } = o;
  const start: P2 = [W / 2, H / 2];
  const obstacles: P2[] = [];
  const n = Math.round(o.density * W * H);
  for (let i = 0; i < n; i++) {
    const p: P2 = [rand(sim) * W, rand(sim) * H];
    if (Math.hypot(p[0] - start[0], p[1] - start[1]) > 2.2 * rc) obstacles.push(p);
  }
  const path: P2[] = [start];
  const collisionAt: number[] = [];
  const segLengths: number[] = [];
  let pos: P2 = start;
  let ang = rand(sim) * 2 * Math.PI;
  let last = -1, seg = 0;
  for (let c = 0; c < o.collisions; ) {
    const dx = Math.cos(ang), dy = Math.sin(ang);
    // distance to the box wall
    let tw = Infinity;
    if (dx > 1e-12) tw = Math.min(tw, (W - pos[0]) / dx); else if (dx < -1e-12) tw = Math.min(tw, -pos[0] / dx);
    if (dy > 1e-12) tw = Math.min(tw, (H - pos[1]) / dy); else if (dy < -1e-12) tw = Math.min(tw, -pos[1] / dy);
    // first obstacle on the ray
    let to = Infinity, hit = -1;
    for (let i = 0; i < obstacles.length; i++) {
      if (i === last) continue;
      const ox = obstacles[i][0] - pos[0], oy = obstacles[i][1] - pos[1];
      const b = ox * dx + oy * dy;
      if (b <= 0) continue;
      const d2 = ox * ox + oy * oy - b * b;
      if (d2 >= rc * rc) continue;
      const t = b - Math.sqrt(rc * rc - d2);
      if (t > 1e-9 && t < to) { to = t; hit = i; }
    }
    if (to < tw) {
      pos = [pos[0] + dx * to, pos[1] + dy * to];
      seg += to; path.push(pos); collisionAt.push(path.length - 1); segLengths.push(seg); seg = 0; c++;
      // leave in a random direction away from the obstacle (a half circle around the outward normal)
      const nx = pos[0] - obstacles[hit][0], ny = pos[1] - obstacles[hit][1];
      ang = Math.atan2(ny, nx) + (rand(sim) - 0.5) * Math.PI;
      last = hit;
    } else {
      const t = Math.max(tw - 1e-9, 0);
      pos = [pos[0] + dx * t, pos[1] + dy * t];
      seg += t; path.push(pos);
      // bounce: mirror the direction component that points out of the box
      let nx = dx, ny = dy;
      if (pos[0] <= 1e-6 || pos[0] >= W - 1e-6) nx = -dx;
      if (pos[1] <= 1e-6 || pos[1] >= H - 1e-6) ny = -dy;
      ang = Math.atan2(ny, nx); last = -1;
      pos = [Math.min(Math.max(pos[0], 1e-6), W - 1e-6), Math.min(Math.max(pos[1], 1e-6), H - 1e-6)];
    }
  }
  return { obstacles, path, collisionAt, segLengths, rc, W, H };
}

/** total length of the polyline up to vertex index k */
export function pathLength(path: P2[], k = path.length - 1): number {
  let s = 0;
  for (let i = 1; i <= k; i++) s += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  return s;
}
/** the point at path length s along the polyline, and the index of the last vertex passed */
export function pointAtLength(path: P2[], s: number): { p: P2; k: number } {
  let acc = 0;
  for (let i = 1; i < path.length; i++) {
    const L = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
    if (acc + L >= s) { const u = L ? (s - acc) / L : 0; return { p: [path[i - 1][0] + u * (path[i][0] - path[i - 1][0]), path[i - 1][1] + u * (path[i][1] - path[i - 1][1])], k: i - 1 }; }
    acc += L;
  }
  return { p: path[path.length - 1], k: path.length - 1 };
}
