import { describe, expect, it } from 'vitest';
import { planeScene, PE, omegaOf } from './planeScene';
import { ladderScene, LS, ladderPhi } from './ladderScene';
import { planetScene, PS } from './planetScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';
import { outOfPlane } from '../../physics/plane';
import { GEAR, armLength, omega3, omegaArm } from '../../physics/planetary';

describe('p. 26: ω ⊥ E (planeScene)', () => {
  it('the drawn z-parts are the lecture’s terms: −ω_y PA_x (PA along x) and ω_x PA_y (PA along y), both ≠ 0 when tilted', () => {
    const w2 = omegaOf(2), w3 = omegaOf(3);
    expect(outOfPlane(w2, [PE.AX[0], PE.AX[1]])).toBeCloseTo(-w2[1] * PE.AX[0], 12);
    expect(outOfPlane(w3, [PE.AY[0], PE.AY[1]])).toBeCloseTo(w3[0] * PE.AY[1], 12);
    expect(planeScene(2, 1, 'de').data.vaz).toBeGreaterThan(0.3); // visibly out of the plane
    expect(planeScene(3, 1, 'de').data.vaz).toBeGreaterThan(0.3);
    expect(planeScene(1, 1, 'de').data.vaz).toBeCloseTo(0, 12); // ω ⊥ E: v_A stays in E
    expect(planeScene(4, 1, 'de').data.tilt).toBe(0);
  });
  it('every frame inside the figure', () => expectInside(planeScene, 5));
  it('final frames: labels do not overlap', () => expectNoOverlap(planeScene, 5));
  it('final frames show what the captions say', () => {
    const f0 = planeScene(0, 1, 'de'); expect(shape(f0, 'vP')?.o).toBe(1); expect(lab(f0, 'box0')?.o).toBe(1); expect(shape(f0, 'omega')).toBeUndefined();
    const f1 = planeScene(1, 1, 'de'); for (const k of ['omega', 'PA', 'vP-copy', 'wxPA', 'vA']) expect(shape(f1, k)?.o, k).toBe(1); expect(lab(f1, 'box1')?.o).toBe(1); expect(shape(f1, 'vAz')).toBeUndefined();
    const f2 = planeScene(2, 1, 'de'); expect(shape(f2, 'vAz')?.o).toBe(1); expect(lab(f2, 'lab-vAz')?.o).toBe(1); expect(lab(f2, 'box2')?.rows?.length).toBe(3);
    const f3 = planeScene(3, 1, 'de'); expect(shape(f3, 'vAz')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = planeScene(4, 1, 'de'); expect(shape(f4, 'mu')).toBeDefined(); expect(shape(f4, 'Z')?.o).toBe(1); expect(lab(f4, 'box4')?.o).toBe(1); expect(shape(f4, 'vAz')).toBeUndefined();
  });
});

describe('p. 27: ladder with the Momentanzentrum (ladderScene, supplement R-022)', () => {
  it('drawn numbers: ω = −v_H/(L sin φ), v_V = v_H cot φ, |CZ| = L in every frame', () => {
    for (const [s, t] of [[3, 1], [5, 1], [6, 0.5], [6, 1]] as const) {
      const d = ladderScene(s, t, 'de').data, phi = ladderPhi(s, t);
      expect(d.w).toBeCloseTo(-LS.VH / (LS.L * Math.sin(phi)), 12);
      expect(d.vv).toBeCloseTo(LS.VH / Math.tan(phi), 12);
      expect(d.zc).toBeCloseTo(LS.L, 12);
    }
    expect(ladderPhi(6, 1)).toBeCloseTo(LS.PHI1, 12); expect(ladderPhi(5, 1)).toBeCloseTo(LS.PHI0, 12);
  });
  it('Z lies on both perpendiculars: vertical through A, horizontal through B', () => {
    const f = ladderScene(3, 1, 'de');
    const Z = shape(f, 'Z')!.pts[0], A = shape(f, 'A')!.pts[0], B = shape(f, 'B')!.pts[0];
    expect(Z[0]).toBeCloseTo(A[0], 9); expect(Z[1]).toBeCloseTo(B[1], 9);
  });
  it('every frame inside the figure', () => expectInside(ladderScene, 7));
  it('final frames: labels do not overlap', () => expectNoOverlap(ladderScene, 7));
  it('final frames show what the captions say', () => {
    const f0 = ladderScene(0, 1, 'de'); expect(shape(f0, 'vA')?.o).toBe(1); expect(shape(f0, 'vB-dir')).toBeDefined(); expect(shape(f0, 'vB')).toBeUndefined(); expect(lab(f0, 'box0')?.o).toBe(1);
    const f1 = ladderScene(1, 1, 'de'); expect(shape(f1, 'perpA')).toBeDefined(); expect(shape(f1, 'perpB')).toBeUndefined(); expect(shape(f1, 'raA')).toBeDefined();
    const f2 = ladderScene(2, 1, 'de'); expect(shape(f2, 'perpB')).toBeDefined(); expect(shape(f2, 'Z')).toBeUndefined();
    const f3 = ladderScene(3, 1, 'de'); expect(shape(f3, 'Z')?.o).toBe(1); expect(lab(f3, 'lab-ZA')?.o).toBe(1); expect(lab(f3, 'lab-ZB')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = ladderScene(4, 1, 'de'); expect(shape(f4, 'w-arc')).toBeDefined(); expect(lab(f4, 'box4')?.o).toBe(1);
    const f5 = ladderScene(5, 1, 'de'); expect(shape(f5, 'vB')?.o).toBe(1); expect(shape(f5, 'vB-dir')).toBeUndefined(); expect(lab(f5, 'box5')?.o).toBe(1);
    const f6 = ladderScene(6, 1, 'de'); expect(shape(f6, 'trail')).toBeDefined(); expect(shape(f6, 'circle')?.o).toBe(1); expect(shape(f6, 'rect')).toBeDefined(); expect(lab(f6, 'box6')?.o).toBe(1);
  });
});

describe('p. 28: Planetengetriebe (planetScene)', () => {
  it('drawn values come from the lecture’s formulas (ω₁ = 1, ω₂ = 0.5)', () => {
    const d = planetScene(7, 1, 'de').data;
    expect(d.w3).toBeCloseTo(omega3(GEAR, PS.W1, PS.W2), 12); expect(d.w3).toBeCloseTo(0.3, 12);
    expect(d.warm).toBeCloseTo(omegaArm(GEAR, PS.W1, PS.W2), 12);
    expect(d.z3).toBeCloseTo(GEAR.R1 - (PS.W1 * GEAR.R1) / 0.3, 12);
  });
  it('step 0 ends in the lecture’s position (arm vertical); the tip of v_A lies on the line through the tips', () => {
    expect(planetScene(0, 1, 'de').data.armangle).toBeCloseTo(0, 12);
    expect(planetScene(0, 0.3, 'de').data.armangle).not.toBeCloseTo(0, 2);
    const f = planetScene(7, 1, 'de');
    const a = shape(f, 'tips')!.pts, tipA = shape(f, 'vA')!.pts[1];
    const cr = (a[1][0] - a[0][0]) * (tipA[1] - a[0][1]) - (a[1][1] - a[0][1]) * (tipA[0] - a[0][0]);
    expect(Math.abs(cr) / Math.hypot(a[1][0] - a[0][0], a[1][1] - a[0][1])).toBeLessThan(1e-6);
    // the arm’s line from O through the tip of v_A: slope ω_Arm = v_A / L
    const O = shape(f, 'O')!.pts[0], A = shape(f, 'Apin')!.pts[0];
    expect(Math.hypot(A[0] - O[0], A[1] - O[1])).toBeCloseTo(PS.S * armLength(GEAR), 9);
  });
  it('every frame inside the figure', () => expectInside(planetScene, 8), 60_000);
  it('final frames: labels do not overlap', () => expectNoOverlap(planetScene, 8));
  it('final frames show what the captions say', () => {
    const f0 = planetScene(0, 1, 'de'); expect(lab(f0, 'box0')?.rows?.length).toBe(4); expect(shape(f0, 'P')).toBeUndefined();
    const f1 = planetScene(1, 1, 'de'); expect(shape(f1, 'P')?.o).toBe(1); expect(shape(f1, 'Q')?.o).toBe(1); expect(lab(f1, 'box1')?.o).toBe(1); expect(shape(f1, 'vP')).toBeUndefined();
    const f2 = planetScene(2, 1, 'de'); expect(shape(f2, 'vP')?.o).toBe(1); expect(shape(f2, 'R1')?.o).toBe(1); expect(lab(f2, 'box2')?.o).toBe(1); expect(shape(f2, 'vQ')).toBeUndefined();
    const f3 = planetScene(3, 1, 'de'); expect(shape(f3, 'vQ')?.o).toBe(1); expect(shape(f3, 'R2')?.o).toBe(1); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = planetScene(4, 1, 'de'); expect(shape(f4, 'Z3')?.o).toBe(1); expect(shape(f4, 'tips')).toBeDefined(); expect(lab(f4, 'lab-Z3P')?.o).toBe(1); expect(lab(f4, 'box4')?.o).toBe(1);
    const f5 = planetScene(5, 1, 'de'); expect(lab(f5, 'box5')?.o).toBe(1); expect(lab(f5, 'lab-PQ')?.o).toBe(1);
    const f6 = planetScene(6, 1, 'de'); expect(shape(f6, 'vA')?.o).toBe(1); expect(lab(f6, 'box6')?.o).toBe(1);
    const f7 = planetScene(7, 1, 'de'); expect(shape(f7, 'armline')).toBeDefined(); expect(shape(f7, 'arm')?.cls).toContain('hi'); expect(lab(f7, 'box7')?.rows?.length).toBe(3);
  });
});
