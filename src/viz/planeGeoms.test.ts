import { describe, expect, it } from 'vitest';
import { CPRESETS, CPTS, N_AB, U_AB, Z0, W0, centreFrame, vBof, type CPreset } from './planeGeom';
import { clipToDisc, gearOutline, tooth, velocityPicture, withArm, stateFromAngles, TOOTH_H } from './planetGeom';
import { planeVelocity, sdpgDefect2 } from '../physics/plane';
import { GEAR, R3, TEETH, armLength, gearState, omega3, z3FromO } from '../physics/planetary';

const dot = (a: readonly number[], b: readonly number[]) => a[0] * b[0] + a[1] * b[1];

describe('Momentanzentrum construction figure (planeGeom)', () => {
  it('v_B built from v_A and s always satisfies the SdpG', () => {
    for (const p of Object.keys(CPRESETS) as CPreset[]) {
      const { vA, s } = CPRESETS[p];
      expect(sdpgDefect2(CPTS.A, vA, CPTS.B, vBof(vA, s))).toBeCloseTo(0, 12);
    }
    expect(dot(U_AB, N_AB)).toBeCloseTo(0, 12);
  });
  it('start preset: a turning about Z₀ with ω₀ — the construction finds exactly Z₀ and ω₀', () => {
    const f = centreFrame(CPRESETS.rot.vA, CPRESETS.rot.s);
    expect(f.centre.kind).toBe('point');
    expect(f.Z![0]).toBeCloseTo(Z0[0], 9); expect(f.Z![1]).toBeCloseTo(Z0[1], 9); expect(f.w).toBeCloseTo(W0, 9);
    expect(f.zInside).toBe(true);
    // v_M from Z is perpendicular to ZM and equals the rigid field from A
    const vM = planeVelocity(CPTS.A, f.vA, f.w, CPTS.M);
    expect(f.vM![0]).toBeCloseTo(vM[0], 9); expect(f.vM![1]).toBeCloseTo(vM[1], 9);
    expect(dot(f.vM!, [CPTS.M[0] - f.Z![0], CPTS.M[1] - f.Z![1]])).toBeCloseTo(0, 9);
  });
  it('presets give the cases named on their buttons', () => {
    const k = (p: CPreset) => { const f = centreFrame(CPRESETS[p].vA, CPRESETS[p].s); return f.centre.kind === 'point' ? f.centre.via : f.centre.kind; };
    expect(k('trans')).toBe('translation');
    expect(k('tips')).toBe('tips');
    expect(k('rest')).toBe('restingPoint');
    expect(k('far')).toBe('perpendiculars');
    expect(centreFrame(CPRESETS.far.vA, CPRESETS.far.s).zInside).toBe(false); // the border marker is shown
    const tips = centreFrame(CPRESETS.tips.vA, CPRESETS.tips.s);
    expect(tips.tipsLine).not.toBeNull(); expect(tips.zInside).toBe(true);
  });
});

describe('planetary gear drawing (planetGeom)', () => {
  it('tooth shape is odd under a half-tooth shift (a tooth faces a gap)', () => {
    for (const x of [0, 0.4, 1.3, 2.9]) expect(tooth(x + Math.PI)).toBeCloseTo(-tooth(x), 12);
  });
  it('at the contacts the outlines touch but do not overlap (any time, any ω)', () => {
    for (const [w1, w2, t] of [[1, 0.5, 0], [1, 0.5, 3.7], [1, 0, 11], [-0.4, 0.9, 6.2]]) {
      const s = gearState(GEAR, w1, w2, t, TEETH), a = s.thArm + Math.PI / 2;
      const sunR = GEAR.R1 + TOOTH_H * tooth(TEETH.N1 * (a - s.th1));
      const planetIn = armLength(GEAR) - (R3(GEAR) + TOOTH_H * tooth(TEETH.N3 * (a + Math.PI - s.th3)));
      expect(sunR).toBeLessThanOrEqual(planetIn + 1e-9);
      const ringR = GEAR.R2 + TOOTH_H * tooth(TEETH.N2 * (a - s.th2));
      const planetOut = armLength(GEAR) + R3(GEAR) + TOOTH_H * tooth(TEETH.N3 * (a - s.th3));
      expect(planetOut).toBeLessThanOrEqual(ringR + 1e-9);
    }
    expect(gearOutline([0, 0], 1, 20, 0)).toHaveLength(240);
  });
  it('velocity picture: tips from the lecture’s formulas, Z₃ on the arm line, positive = counter-clockwise', () => {
    const s = stateFromAngles(GEAR, { th1: 0, th2: 0, th3: 0, thArm: 0.7 });
    const v = velocityPicture(GEAR, 1, 0.5, s, 1);
    expect(v.w3).toBeCloseTo(omega3(GEAR, 1, 0.5), 12);
    expect(v.z3).toBeCloseTo(z3FromO(GEAR, 1, 0.5)!, 12);
    // tip of v_A lies on the line through the tips of v_P and v_Q; that line passes through Z₃
    const cr = (p: readonly number[], q: readonly number[], r: readonly number[]) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
    expect(cr(v.tipP, v.tipQ, v.tipA)).toBeCloseTo(0, 12);
    expect(cr(v.tipP, v.tipQ, v.Z3!)).toBeCloseTo(0, 12);
    // positive velocity at a point on the arm = ω e_z × r with ω > 0
    const n = v.n, u = v.u;
    expect(n[0] * u[0] + n[1] * u[1]).toBeCloseTo(0, 12); expect(u[0] * n[1] - u[1] * n[0]).toBeCloseTo(1, 12);
  });
  it('helpers: withArm turns with the arm; clipToDisc stays on the circle', () => {
    const s = stateFromAngles(GEAR, { th1: 0, th2: 0, th3: 0, thArm: 0 });
    expect(withArm(s, [0.3, -0.7])[0]).toBeCloseTo(0.3, 12);
    const s2 = stateFromAngles(GEAR, { th1: 0, th2: 0, th3: 0, thArm: Math.PI / 2 });
    const q = withArm(s2, [1, 0]); expect(q[0]).toBeCloseTo(0, 12); expect(q[1]).toBeCloseTo(1, 12);
    const c = clipToDisc([0.5, 0.2], [1, 0.3], 3)!;
    for (const p of c) expect(Math.hypot(p[0], p[1])).toBeCloseTo(3, 12);
  });
});
