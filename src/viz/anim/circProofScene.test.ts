import { describe, expect, it } from 'vitest';
import { CP, circProofScene, pointP } from './circProofScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

describe('proof 2: circular motion (p. 16)', () => {
  it('P stays at distance R from μ and at height z₀ — the drawn path is the circle', () => {
    for (const phi of [0, 1, 2.5, 4]) { const p = pointP(phi); expect(Math.hypot(p[0], p[1])).toBeCloseTo(CP.R, 12); expect(p[2]).toBe(CP.Z0); }
  });
  it('v_P drawn ⊥ DP and ⊥ μ in every frame', () => {
    for (let s = 0; s < 5; s++) for (const t of [0, 0.5, 1]) { const d = circProofScene(s, t, 'de').data; expect(d.vDP).toBeCloseTo(0, 12); expect(d.vDA).toBeCloseTo(0, 12); }
  });
  it('the statements about v_P are written in the colour of v (red), not in an axis colour', () => {
    for (const [st, k] of [[2, 'box2'], [3, 'box3']] as const) {
      const rows = lab(circProofScene(st, 1, 'de'), k)!.rows!;
      expect(rows[rows.length - 1].ink).toBe('point');
    }
  });
  it('step 4: the mark v_P ⊥ DP steps back (faint) so the new mark v_P ⊥ μ can be read', () => {
    const f = circProofScene(3, 1, 'de');
    expect(shape(f, 'ra-PD')!.o!).toBeLessThan(0.5); expect(shape(f, 'ra-Pz')!.o!).toBeCloseTo(1, 9);
  });
  it('every frame inside the figure', () => expectInside(circProofScene, 5));
  it('final frames: labels do not overlap', () => expectNoOverlap(circProofScene, 5));
  it('final frames show what the captions say', () => {
    const f0 = circProofScene(0, 1, 'de');
    expect(shape(f0, 'ra-D')?.o).toBe(1); expect(shape(f0, 'vP')).toBeUndefined();
    const f1 = circProofScene(1, 1, 'de');
    expect(shape(f1, 'circle-goal')?.o).toBe(1); expect(shape(f1, 'out')?.o).toBe(1); expect(shape(f1, 'up')?.o).toBe(1);
    const f2 = circProofScene(2, 1, 'de');
    expect(shape(f2, 'vP')?.o).toBe(1); expect(shape(f2, 'ra-PD')?.o).toBe(1); expect(shape(f2, 'out')).toBeUndefined(); expect(lab(f2, 'box2')?.o).toBe(1);
    const f3 = circProofScene(3, 1, 'de');
    expect(shape(f3, 'ra-Pz')?.o).toBe(1); expect(shape(f3, 'up')).toBeUndefined(); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = circProofScene(4, 1, 'de');
    expect(f4.data.phi).toBeCloseTo(CP.PHI0 + 2 * Math.PI, 9); expect(shape(f4, 'circle')).toBeDefined(); expect(lab(f4, 'box4')?.o).toBe(1); expect(lab(f4, 'lab-R')?.o).toBe(1);
  });
});
