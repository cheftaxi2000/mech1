import { describe, expect, it } from 'vitest';
import { CA, CB, CC, CE, CUBE, CUBE_STEPS, OMEGA, V_A, cubeFrame, muEnds } from './cubeFrame';
import { cross, dot, norm, scale, sub, vecApproxEqual } from '../../physics/vec';
import { CUBE_CAMERA } from './CubeAnim';

const { a, v } = CUBE;

describe('Beispiel Würfel, Rotation (p. 19)', () => {
  it('the handwritten solution: v_Bx = v by SdpG, ω = (v/a)(1,0,1) reproduces v_A and v_B, C lies on μ', () => {
    const vB = [v, v, -v] as const;
    expect(dot(V_A, sub(CB, CA))).toBeCloseTo(dot(vB, sub(CB, CA)), 12); // SdpG along AB
    expect(vecApproxEqual(cross(OMEGA, sub(CA, CE)), V_A)).toBe(true); // v_A = ω × EA
    expect(vecApproxEqual(cross(OMEGA, sub(CB, CE)), vB)).toBe(true); // v_B = ω × EB
    expect(norm(cross(OMEGA, sub(CC, CE)))).toBeLessThan(1e-12); // C on μ
    expect(OMEGA[1]).toBe(0);
  });
  it('the axis drawn passes through E and C', () => {
    const [p, q] = muEnds(1), d = sub(q, p);
    for (const X of [CE, CC]) expect(norm(cross(d, sub(X, p))) / norm(d)).toBeLessThan(1e-9);
  });
  it('step 5: turning about μ keeps E and C fixed and every edge length', () => {
    for (const t of [0.3, 0.7, 1]) {
      const f = cubeFrame(5, t);
      expect(norm(sub(f.P.E, CE))).toBeLessThan(1e-12);
      expect(norm(sub(f.P.C, CC))).toBeLessThan(1e-12);
      expect(norm(sub(f.P.A, f.P.B))).toBeCloseTo(a, 12);
      // the drawn velocities are ω × EP at the turned positions
      expect(vecApproxEqual(f.vA, scale(CUBE.KV, cross(OMEGA, sub(f.P.A, CE))))).toBe(true);
    }
  });
  it('final frames show what the captions say', () => {
    const f = Array.from({ length: CUBE_STEPS }, (_, s) => cubeFrame(s, 1));
    expect(f[0].vBknown).toBe(false); expect(f[0].vBx).toBe(0);
    expect(f[1].vBknown).toBe(true); expect(f[1].vBx).toBe(v); expect(f[1].proj).toBe(1);
    expect(f[2].EA).toBe(1); expect(f[3].EB).toBe(1);
    expect(f[4].omega).toBe(1); expect(f[4].mu).toBe(1); expect(f[4].turn).toBe(0);
    expect(f[5].ghost).toBe(true); expect(f[5].turn).toBeCloseTo(CUBE.TURN, 12);
    // step 3: the components ω_x e_x, ω_z e_z at E; step 4: the trial ω_y has shrunk to nothing and «ω_y = 0» shows
    expect(f[2].comps).toBe(1); expect(f[3].wy).toBe(0); expect(f[3].wyZero).toBe(1); expect(f[2].wy).toBe(0);
  });
  it('the drawn ω is the diagonal of its drawn components (ω_y = 0)', () => {
    const w = scale(CUBE.KW * a, OMEGA);
    expect(w[1]).toBe(0);
    expect(w[0]).toBeCloseTo((CUBE.KW * a * v) / a, 12); expect(w[2]).toBeCloseTo((CUBE.KW * a * v) / a, 12);
  });
  it('camera in the lecture\'s orientation (p. 19): x to the right and nearly horizontal, y receding to the upper right, z up', () => {
    const { position, target } = CUBE_CAMERA;
    const fwd = sub(target, position), n = norm(fwd), F = scale(1 / n, fwd);
    const R = scale(1 / norm(cross(F, [0, 0, 1])), cross(F, [0, 0, 1])), U = cross(R, F);
    const scr = (d: readonly [number, number, number]) => [dot(d, R), dot(d, U)];
    const [xr, xu] = scr([1, 0, 0]), [yr, yu] = scr([0, 1, 0]), [zr, zu] = scr([0, 0, 1]);
    expect(xr).toBeGreaterThan(0.9); expect(Math.abs(xu / xr)).toBeLessThan(0.15);
    expect(yr).toBeGreaterThan(0); expect(yu).toBeGreaterThan(0);
    expect(zu).toBeGreaterThan(0.9); expect(Math.abs(zr)).toBeLessThan(0.05);
  });
});
