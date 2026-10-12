/**
 * Start views of the 3D figures of chapters 1–2: every vector a caption talks about is seen at ≥ 60 % of its length
 * (not pointing at the camera) and does not hide under another vector. Perspective projection as in Scene.tsx.
 */
import { describe, expect, it } from 'vitest';
import { projectPoint, visibleFraction } from './viewCheck';
import { EXPLORER_CAMERA, EXPLORER_TARGET, explorerStart, localBasis } from './CoordinateExplorer';
import { cartToCyl } from '../physics/coords';
import { CB, CB_CAMERA, CB_TARGET, cylBasisFrame } from './anim/cylBasisFrame';
import type { Vec3 } from '../physics/vec';

const MIN = 0.6;

describe('coordinate explorer (lessons koordinaten, basen)', () => {
  it('with the basis (lesson basen, φ = 70°, z = 1.5): every basis vector at M is clearly visible, in all three modes', () => {
    const p = explorerStart(70, 1.5);
    for (const mode of ['cart', 'cyl', 'sph'] as const) {
      const E = localBasis(mode, p);
      expect(E).toHaveLength(3);
      for (const [e, , sub] of E) expect(visibleFraction(p, e, EXPLORER_CAMERA, EXPLORER_TARGET), `${mode} e_${sub}`).toBeGreaterThan(MIN);
    }
  });
  it('lesson koordinaten (φ = 40°): ρ (O → M_xy) and z (M_xy → M) are seen nearly at full length', () => {
    const p = explorerStart(40, 1.7), Mxy: Vec3 = [p[0], p[1], 0];
    expect(visibleFraction([0, 0, 0], Mxy, EXPLORER_CAMERA, EXPLORER_TARGET)).toBeGreaterThan(0.8);
    expect(visibleFraction(Mxy, [0, 0, p[2]], EXPLORER_CAMERA, EXPLORER_TARGET)).toBeGreaterThan(0.8);
    expect(cartToCyl(p).rho).toBeCloseTo(1.5, 12);
  });
  it('the start point M does not sit on the label of the y-axis (both lessons)', () => {
    const P = (q: Vec3) => projectPoint(q, EXPLORER_CAMERA, EXPLORER_TARGET);
    const yLab = P([0, 2.4 * 1.07, 0]); // Axes(): label at 1.07 × the axis length 2.4
    for (const p of [explorerStart(40, 1.7), explorerStart(70, 1.5)]) {
      const m = P(p);
      expect(Math.hypot(m[0] - yLab[0], m[1] - yLab[1])).toBeGreaterThan(0.07); // ≈ 40 px in a 420 px high canvas
    }
  });
  it('on the z-axis only the basis vectors that stay defined are drawn: e_z (cylindrical), e_r = ±e_z (spherical)', () => {
    const up: Vec3 = [0, 0, 1.2], down: Vec3 = [0, 0, -0.8];
    expect(localBasis('cyl', up).map((b) => b[2])).toEqual(['z']);
    expect(localBasis('sph', up).map((b) => b[2])).toEqual(['r']);
    expect(localBasis('sph', up)[0][0][2]).toBeCloseTo(1, 12);
    expect(localBasis('sph', down)[0][0][2]).toBeCloseTo(-1, 12); // θ = π: e_r points down
    expect(localBasis('sph', [0, 0, 0])).toEqual([]); // at O even e_r has no direction
    expect(localBasis('cart', [0, 0, 0])).toHaveLength(3);
  });
});

describe('cylindrical-basis animation (lesson basen)', () => {
  it('in the resting frames (start φ0 and end φ1 of the turn) e_ρ and e_φ are both clearly visible', () => {
    for (const step of [1, 2, 3]) {
      const f = cylBasisFrame(step, 1);
      for (const [name, e] of [['e_ρ', f.basis.eRho], ['e_φ', f.basis.ePhi]] as const)
        expect(visibleFraction(f.M, e, CB_CAMERA, CB_TARGET), `step ${step + 1} ${name}`).toBeGreaterThan(MIN);
    }
    expect(CB.PHI1 - CB.PHI0).toBeGreaterThan(Math.PI / 3); // the turn is large enough to see
  });
});
