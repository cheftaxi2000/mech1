import { describe, expect, it } from 'vitest';
import { rigidVelocity } from '../../physics/rigid';
import { cross, norm, scale, sub, vecApproxEqual } from '../../physics/vec';
import { CG, G1, G2, G3, GB, GEN_CUBE_STEPS, G_OMEGA, G_OTHERS, G_VB, GV1, GV2, GV3, cubeGenFrame } from './cubeGenFrame';

describe('Beispiel Würfel, allgemeine Bewegung (p. 23)', () => {
  it('step 1: ω × P₁P₃ = 0 because v₁ = v₃, and ω is parallel to the space diagonal P₁P₃', () => {
    expect(vecApproxEqual(GV1, GV3)).toBe(true);
    expect(norm(cross(G_OMEGA, sub(G3, G1)))).toBeLessThan(1e-12);
  });
  it('step 2: v₂ − v₃ = ω × P₃P₂ = (v, 0, v)', () => {
    expect(vecApproxEqual(cross(G_OMEGA, sub(G2, G3)), [CG.v, 0, CG.v])).toBe(true);
    expect(vecApproxEqual(sub(GV2, GV3), [CG.v, 0, CG.v])).toBe(true);
  });
  it('step 3: v_B = v₃ + ω × P₃B = (−2v, v, 0) (v_Bz = 0, left blank in the notes, R-007)', () => {
    expect(vecApproxEqual(rigidVelocity(GV3, G_OMEGA, G3, GB), G_VB)).toBe(true);
  });
  it('the Kinemate (v_B, ω) reproduces all three given velocities', () => {
    for (const [P, vP] of [[G1, GV1], [G2, GV2], [G3, GV3]] as const) expect(vecApproxEqual(rigidVelocity(G_VB, G_OMEGA, GB, P), vP)).toBe(true);
  });
  it('step 4: the other corners get v = v_B + ω × BM', () => {
    const f = cubeGenFrame(4, 1);
    G_OTHERS.forEach((P, i) => expect(vecApproxEqual(f.othersV[i], scale(CG.KV, rigidVelocity(G_VB, G_OMEGA, GB, P)))).toBe(true));
  });
  it('final frames show what the captions say', () => {
    const f = Array.from({ length: GEN_CUBE_STEPS }, (_, s) => cubeGenFrame(s, 1));
    expect(f[0].diag).toBe(0); expect(f[0].vB).toBe(0);
    expect(f[1].diag).toBe(1); expect(f[1].omega).toBe(0);
    expect(f[2].diff).toBe(1); expect(f[2].omega).toBe(1); expect(f[2].vB).toBe(0);
    expect(f[3].vB).toBe(1); expect(f[3].edge3B).toBe(1); expect(f[3].diff).toBe(0);
    expect(f[4].others).toBe(1);
  });
});
