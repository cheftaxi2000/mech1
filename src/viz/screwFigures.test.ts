import { describe, expect, it } from 'vitest';
import { rigidVelocity } from '../physics/rigid';
import { distanceToAxis, vOmegaSigned } from '../physics/screw';
import { type Vec3, add, cross, dot, norm, scale, sub, vecApproxEqual } from '../physics/vec';
import { invariantScene, screwExplorerScene } from './ScrewFigures';
import { SG, SG_AXIS, SG_VERTS } from './screwGeom';

const vec = (a: { from: Vec3; to: Vec3 }) => sub(a.to, a.from);
const arrow = (d: { arrows: { key: string; from: Vec3; to: Vec3 }[] }, k: string) => d.arrows.find((a) => a.key === k)!;

describe('invariants explorer (p. 24)', () => {
  const pts: Vec3[] = [[0.45, -0.5, 0], [-0.5, 1.05, -0.25], [0.1, 0.3, -0.1], [-0.3, -0.6, 0]];
  it('at every P: ω′ is drawn exactly like ω at B (1st invariant)', () => {
    for (const P of pts) {
      const s = invariantScene(P, false);
      expect(vecApproxEqual(vec(arrow(s, 'wP')), vec(arrow(s, 'wB')))).toBe(true);
    }
  });
  it('at every P: v_P = v_ω + v_P^⊥; the blue part is the same everywhere (2nd invariant), the orange one is not', () => {
    const blues = pts.map((P) => {
      const s = invariantScene(P, false);
      const v = vec(arrow(s, 'vP')), w = vec(arrow(s, 'vwP')), p = vec(arrow(s, 'vpP'));
      expect(vecApproxEqual(add(w, p), v)).toBe(true);
      expect(dot(p, SG.omega)).toBeCloseTo(0, 12);
      expect(vecApproxEqual(scale(1 / SG.KV, v), rigidVelocity(SG.vB, SG.omega, SG.B, P))).toBe(true);
      expect(s.vw).toBeCloseTo(vOmegaSigned(SG.vB, SG.omega), 12);
      return w;
    });
    for (const w of blues) expect(vecApproxEqual(w, blues[0])).toBe(true);
    const oranges = pts.map((P) => invariantScene(P, false).vperp);
    expect(Math.max(...oranges) - Math.min(...oranges)).toBeGreaterThan(0.3);
  });
  it('moving P only along ω (the height slider) changes nothing', () => {
    const a = invariantScene([0.2, -0.4, 0], false), b = invariantScene([0.2, -0.4, -0.25], false);
    expect(vecApproxEqual(vec(arrow(a, 'vP')), vec(arrow(b, 'vP')))).toBe(true);
  });
  it('the toggle shows all 8 corners, each with the same blue part', () => {
    const s = invariantScene([0.45, -0.5, 0], true);
    const blue = SG_VERTS.map((_, i) => vec(arrow(s, `cw${i}`)));
    for (const b of blue) expect(vecApproxEqual(b, blue[0])).toBe(true);
  });
});

describe('screw explorer (p. 25, Spezialfälle)', () => {
  it('screw: B on a helix about ζ (constant distance), rising 2π p per turn; Z moves straight along ζ', () => {
    const s = screwExplorerScene('screw', 0.25, 1);
    const tb = s.lines.find((l) => l.key === 'trailB')!.pts;
    for (const p of tb) expect(distanceToAxis(SG_AXIS, p)).toBeCloseTo(norm(sub(SG.B, SG_AXIS.point)), 9);
    expect(tb[tb.length - 1][2] - tb[0][2]).toBeCloseTo(2 * Math.PI * 0.25, 9);
    for (const p of s.lines.find((l) => l.key === 'trailZ')!.pts) expect(distanceToAxis(SG_AXIS, p)).toBeCloseTo(0, 9);
    expect(s.ghosts).toHaveLength(4);
  });
  it('rotation (v_B ⊥ ω): v_ω = 0, B on a circle, Z at rest; ζ is the rotation axis', () => {
    const s = screwExplorerScene('rot', 0.25, 0.7);
    expect(dot(s.vB, s.omega)).toBeCloseTo(0, 12);
    for (const p of s.lines.find((l) => l.key === 'trailB')!.pts) expect(p[2]).toBeCloseTo(SG.B[2], 12);
    expect(norm(vec(arrow(s, 'vZ')))).toBeCloseTo(0, 12);
  });
  it('translation (ω = 0): no ζ and no point Z; B moves on a straight line along v_B', () => {
    const s = screwExplorerScene('trans', 0.25, 0.7);
    expect(s.lines.find((l) => l.key === 'zeta')).toBeUndefined();
    expect(s.lines.find((l) => l.key === 'trailZ')).toBeUndefined();
    expect(s.labels.find((l) => l.key === 'Z')).toBeUndefined();
    const tb = s.lines.find((l) => l.key === 'trailB')!.pts;
    expect(norm(cross(sub(tb[tb.length - 1], tb[0]), SG.vB))).toBeCloseTo(0, 12);
  });
  it('the drawn velocity of the moving B is v_ω + ω × ZP (tangent to its helix)', () => {
    const s = screwExplorerScene('screw', 0.25, 0.37);
    const B = s.dots.find((d) => d.key === 'B')!.at, Z = s.dots.find((d) => d.key === 'Z')!.at;
    const v = scale(1 / SG.KV, vec(arrow(s, 'vB')));
    expect(vecApproxEqual(v, add([0, 0, 0.25], cross(SG.omega, sub(B, Z))))).toBe(true);
  });
});
