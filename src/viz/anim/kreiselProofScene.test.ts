import { describe, expect, it } from 'vitest';
import { kreiselProofScene } from './kreiselProofScene';
import { expectInside, expectNoOverlap, lab, shape } from './sceneTestKit';

const N = 6;
describe('Kreiselung proof (p. 21, Fig. 3.11)', () => {
  it('the drawn data satisfy the proof: v_M ⊥ r_M, v_N ⊥ r_N, A on μ at rest, AM, AN, AO span space', () => {
    const d = kreiselProofScene(0, 0, 'de').data;
    expect(d.vMrM).toBeCloseTo(0, 12); expect(d.vNrN).toBeCloseTo(0, 12);
    expect(d.vA).toBeCloseTo(0, 12);
    expect(Math.abs(d.spat)).toBeGreaterThan(0.3);
  });
  it('every frame inside the figure', () => expectInside(kreiselProofScene, N));
  it('final frames: labels do not overlap', () => expectNoOverlap(kreiselProofScene, N));
  it('final frames show what the captions say', () => {
    const f0 = kreiselProofScene(0, 1, 'de');
    expect(shape(f0, 'vM')).toBeDefined(); expect(shape(f0, 'vN')).toBeDefined(); expect(shape(f0, 'EM')).toBeUndefined(); expect(shape(f0, 'pin')).toBeDefined();
    const f1 = kreiselProofScene(1, 1, 'de');
    expect(shape(f1, 'rM')?.o).toBe(1); expect(shape(f1, 'ra-M')?.o).toBe(1); expect(shape(f1, 'EM')?.o).toBe(1); expect(shape(f1, 'EN')).toBeUndefined(); expect(lab(f1, 'box1')?.o).toBe(1);
    const f2 = kreiselProofScene(2, 1, 'de');
    expect(shape(f2, 'EN')?.o).toBe(1); expect(shape(f2, 'ra-N')?.o).toBe(1); expect(shape(f2, 'mu')?.o).toBe(1); expect(lab(f2, 'lab-mu')?.o).toBe(1); expect(lab(f2, 'box2')?.o).toBe(1);
    const f3 = kreiselProofScene(3, 1, 'de');
    expect(shape(f3, 'A')?.o).toBe(1); expect(shape(f3, 'AM')?.o).toBe(1); expect(shape(f3, 'AN')?.o).toBe(1); expect(shape(f3, 'AO')).toBeUndefined(); expect(lab(f3, 'box3')?.o).toBe(1);
    const f4 = kreiselProofScene(4, 1, 'de');
    expect(shape(f4, 'AO')?.o).toBe(1); expect(lab(f4, 'box4')?.o).toBe(1); expect(lab(f4, 'box3')).toBeUndefined();
    const f5 = kreiselProofScene(5, 1, 'de');
    expect(shape(f5, 'omega')).toBeDefined(); expect(shape(f5, 'cM')?.o).toBe(1); expect(lab(f5, 'lab-omega')?.o).toBe(1); expect(lab(f5, 'box5')?.o).toBe(1);
    expect(shape(f5, 'AM')).toBeUndefined();
  });
  it('the two planes have different tints; ω is drawn beyond μ, not on top of it', () => {
    const f5 = kreiselProofScene(5, 1, 'de');
    expect(shape(f5, 'EM')?.cls).not.toBe(shape(f5, 'EN')?.cls);
    const mu = shape(f5, 'mu')!.pts, w = shape(f5, 'omega')!.pts;
    // screen y grows downward: ω starts above the upper end of μ
    expect(w[0][1]).toBeLessThan(Math.min(mu[0][1], mu[1][1]));
    expect(lab(f5, 'lab-omega')!.at[1]).toBeLessThan(Math.min(mu[0][1], mu[1][1]));
  });
});
