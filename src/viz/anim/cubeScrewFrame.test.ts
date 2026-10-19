import { describe, expect, it } from 'vitest';
import { rigidVelocity } from '../../physics/rigid';
import { FIG330, distanceToAxis } from '../../physics/screw';
import { type Vec3, add, cross, dot, norm, scale, sub, vecApproxEqual } from '../../physics/vec';
import { partsWidth } from '../RichLabel';
import { projectPoint } from '../viewCheck';
import { CS, CS_P, CS_T, CUBE_SCREW_STEPS, SOL, cubeScrewFrame, type CubeScrewFrame } from './cubeScrewFrame';

const TS = Array.from({ length: 21 }, (_, i) => i / 20);
const HY = Math.tan((19 * Math.PI) / 180), HX = (4 / 3) * HY;
const P = (p: Vec3, f: CubeScrewFrame) => projectPoint(p, f.cam.pos, f.cam.target);
const arrow = (f: CubeScrewFrame, k: string) => f.arrows.find((a) => a.key === k);
const label = (f: CubeScrewFrame, k: string) => f.labels.find((a) => a.key === k);
const vec = (a: { from: Vec3; to: Vec3 }) => sub(a.to, a.from);

describe('cube animation (Problem Fig. 3.30): every step shows what its caption says', () => {
  const end = Array.from({ length: CUBE_SCREW_STEPS }, (_, s) => cubeScrewFrame(s, 1));
  it('step 1: the data v_B = (0, 2, 2), ω = (0, 2, 0)', () => {
    expect(vecApproxEqual(vec(arrow(end[0], 'vB')!), scale(CS.KV, FIG330.vB))).toBe(true);
    expect(vecApproxEqual(vec(arrow(end[0], 'omega')!), scale(CS.KW, FIG330.omega))).toBe(true);
    expect(end[0].arrows).toHaveLength(2);
  });
  it('step 2: v_ω = (0, 2, 0) blue, v_B^⊥ = (0, 0, 2) orange; together v_B', () => {
    const f = end[1];
    expect(vecApproxEqual(vec(arrow(f, 'vwB')!), scale(CS.KV, [0, 2, 0]))).toBe(true);
    expect(vecApproxEqual(vec(arrow(f, 'vpB')!), scale(CS.KV, [0, 0, 2]))).toBe(true);
    expect(label(f, 'vwB')).toBeDefined(); expect(label(f, 'vpB')).toBeDefined();
  });
  it('step 3: at P = (1, 0, 0): copy of v_B + ω × BP = (0, 0, −2) ends at the tip of v_P = v_ω = (0, 2, 0)', () => {
    const f = end[2];
    expect(vecApproxEqual(f.P!, [1, 0, 0])).toBe(true);
    const copy = arrow(f, 'copy')!, rot = arrow(f, 'rot')!, vP = arrow(f, 'vP')!;
    expect(vecApproxEqual(vec(rot), scale(CS.KV, [0, 0, -2]))).toBe(true);
    expect(vecApproxEqual(rot.from, copy.to)).toBe(true);
    expect(vecApproxEqual(rot.to, vP.to)).toBe(true);
    expect(vecApproxEqual(vec(vP), scale(CS.KV, SOL.vw))).toBe(true);
    for (const k of ['rot', 'vP', 'BP', 'P']) expect(label(f, k), k).toBeDefined();
  });
  it('step 4: P slides along ω to (1, 1, 0); its arrows are unchanged; ζ is drawn along the bottom front edge', () => {
    const f = end[3];
    expect(vecApproxEqual(f.P!, [1, 1, 0])).toBe(true);
    expect(vecApproxEqual(vec(arrow(f, 'vP')!), scale(CS.KV, SOL.vw))).toBe(true);
    expect(vecApproxEqual(vec(arrow(f, 'vP')!), vec(arrow(end[2], 'vP')!))).toBe(true);
    const z = f.lines.find((l) => l.key === 'zeta')!;
    for (const p of z.pts) expect(distanceToAxis(SOL.axis, p)).toBeCloseTo(0, 12);
    expect(norm(cross(sub(z.pts[1], z.pts[0]), FIG330.omega))).toBeCloseTo(0, 12);
    // every point of the drawn line has v = v_ω
    for (const p of z.pts) expect(vecApproxEqual(rigidVelocity(FIG330.vB, FIG330.omega, FIG330.B, p), SOL.vw)).toBe(true);
  });
  it('step 5: position vector (1, 0, 0) from B, direction vector (0, 1, 0) from that point', () => {
    const f = end[4];
    expect(vecApproxEqual(arrow(f, 'pos')!.to, [1, 0, 0])).toBe(true);
    expect(vecApproxEqual(arrow(f, 'dir')!.from, [1, 0, 0])).toBe(true);
    expect(vecApproxEqual(vec(arrow(f, 'dir')!), [0, 1, 0])).toBe(true);
    expect(label(f, 'pos')).toBeDefined(); expect(label(f, 'dir')).toBeDefined();
  });
  it('step 6: a quarter turn about ζ and a shift of v_ω t along it; the corners on ζ stay on ζ, every edge keeps its length', () => {
    const f = end[5];
    expect(norm(FIG330.omega) * CS_T).toBeCloseTo(Math.PI / 2, 12);
    // the corner (1, 0, 0) (index 4) moved straight along ζ by v_ω t = (0, π/2, 0)
    expect(vecApproxEqual(f.verts[4], add(CS_P, scale(CS_T, SOL.vw)), 1e-9)).toBe(true);
    for (const i of [4, 6]) expect(distanceToAxis(SOL.axis, f.verts[i])).toBeCloseTo(0, 9);
    // B after the quarter turn: from (0, 0, 0) to (1, π/2, 1) — up above ζ: the cube tipped forward over that edge
    expect(vecApproxEqual(f.verts[0], [1, Math.PI / 2, 1], 1e-9)).toBe(true);
    for (const [i, j] of [[0, 1], [0, 2], [0, 4], [7, 3]]) expect(norm(sub(f.verts[i], f.verts[j]))).toBeCloseTo(1, 9);
    // the drawn velocity of B is tangent to its path and as fast as at the start (distance 1 from ζ)
    const vB = vec(arrow(f, 'vB')!);
    expect(norm(vB)).toBeCloseTo(CS.KV * norm(FIG330.vB), 9);
    expect(dot(vB, sub(f.verts[0], add(CS_P, scale(CS_T, SOL.vw))))).toBeCloseTo(0, 9);
  });
});

describe('cube animation: the view', () => {
  it('every label, arrow, line and corner stays inside the 4:3 frame', () => {
    for (let s = 0; s < CUBE_SCREW_STEPS; s++) for (const t of TS) {
      const f = cubeScrewFrame(s, t);
      for (const l of f.labels) {
        const [x, y] = P(l.at, f);
        expect(Math.abs(x), `step ${s + 1} t ${t} ${l.key}`).toBeLessThan(HX - 0.04);
        expect(Math.abs(y), `step ${s + 1} t ${t} ${l.key}`).toBeLessThan(HY - 0.03);
      }
      for (const p of [...f.arrows.flatMap((a) => [a.from, a.to]), ...f.lines.flatMap((l) => l.pts), ...f.verts]) {
        const [x, y] = P(p, f);
        expect(Math.abs(x), `step ${s + 1} t ${t}`).toBeLessThan(HX - 0.01);
        expect(Math.abs(y), `step ${s + 1} t ${t}`).toBeLessThan(HY - 0.01);
      }
    }
  });
  it('in every final frame no two labels sit on each other', () => {
    for (let s = 0; s < CUBE_SCREW_STEPS; s++) {
      const f = cubeScrewFrame(s, 1), ls = f.labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++) {
        const a = P(ls[i].at, f), b = P(ls[j].at, f);
        const wx = 0.0105 * (partsWidth(ls[i].parts) + partsWidth(ls[j].parts)) + 0.012;
        expect(Math.abs(a[0] - b[0]) > wx || Math.abs(a[1] - b[1]) > 0.03, `step ${s + 1}: ${ls[i].key} / ${ls[j].key}`).toBe(true);
      }
    }
  });
});
