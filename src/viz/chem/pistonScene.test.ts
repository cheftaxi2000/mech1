import { describe, expect, it } from 'vitest';
import { enthalpyBars } from '../../chem/thermo';
import { PISTON_STEPS, PS, pistonScene } from './pistonScene';
import { expectInside, expectNoOverlap, lab, shape } from './cTestKit';

const final = (s: number) => pistonScene(s, 1, 'de');

describe('pressure–volume work and ΔH = q_p (slides 16–17)', () => {
  it('every frame inside the figure', () => expectInside(pistonScene, PISTON_STEPS));
  it('final frames: labels do not overlap', () => expectNoOverlap(pistonScene, PISTON_STEPS));
  it('step 1: the piston ends at x_final, the swept height is Δx', () => {
    expect(pistonScene(0, 1, 'de').data.yp).toBe(PS.yi);
    expect(final(1).data.yp).toBeCloseTo(PS.yf, 9);
    expect(pistonScene(1, 0, 'de').data.yp).toBeCloseTo(PS.yi, 9);
    expect(lab(final(1), 'lab-dx')?.o).toBeCloseTo(1, 9);
    // the piston moves monotonically up (SVG y decreases)
    let prev = Infinity;
    for (let i = 0; i <= 20; i++) { const y = pistonScene(1, i / 20, 'de').data.yp; expect(y).toBeLessThanOrEqual(prev + 1e-9); prev = y; }
  });
  it('step 2: F = P·A and w = −F·Δx are shown', () => {
    const f = final(2);
    expect(shape(f, 'F')?.o).toBeCloseTo(1, 9); expect(lab(f, 'lab-F')?.o).toBeCloseTo(1, 9); expect(lab(f, 'f-w')?.o).toBeCloseTo(1, 9);
  });
  it('step 3: the shaded slab is exactly the swept volume A·Δx (full cylinder width × piston travel)', () => {
    const s = shape(final(3), 'slab')!;
    expect(s.pts[1][0]).toBe(PS.X1 - PS.X0); expect(s.pts[1][1]).toBe(PS.yi - PS.yf);
    expect(lab(final(3), 'f-w2')?.o).toBeCloseTo(1, 9); expect(lab(final(3), 'lab-dV')?.o).toBeCloseTo(1, 9);
  });
  it('step 4: ΔE = q_p + w — the bars q_p (up), w (down from the top of q_p) and ΔE are drawn to scale', () => {
    const f = final(4), k = PS.k;
    const q = shape(f, 'b-q')!, w = shape(f, 'b-w')!, E = shape(f, 'b-E')!;
    expect(q.pts[1][1]).toBeCloseTo(PS.qp * k, 9);
    expect(w.pts[1][1]).toBeCloseTo(-PS.w * k, 9);
    expect(w.pts[0][1]).toBeCloseTo(q.pts[0][1], 9); // w hangs from the top of q
    expect(E.pts[1][1]).toBeCloseTo((PS.qp + PS.w) * k, 9);
    expect(E.pts[0][1] + E.pts[1][1]).toBeCloseTo(PS.zero, 9);
    expect(shape(f, 'b-PV')).toBeUndefined();
  });
  it('step 5: PΔV = −w (equal amber bars) and ΔH = ΔE + PΔV has exactly the height of q_p', () => {
    const f = final(5), b = enthalpyBars(PS.qp, PS.w);
    expect(b.dH).toBe(PS.qp);
    const PV = shape(f, 'b-PV')!, H = shape(f, 'b-H')!, q = shape(f, 'b-q')!, w = shape(f, 'b-w')!;
    expect(PV.pts[1][1]).toBeCloseTo(w.pts[1][1], 9);
    expect(H.pts[1][1]).toBeCloseTo(q.pts[1][1], 9);
    expect(H.pts[0][1]).toBeCloseTo(q.pts[0][1], 9);
    expect(b.dE * PS.k).toBeCloseTo(shape(f, 'b-E')!.pts[1][1], 9);
    expect(lab(f, 'n-H')?.o).toBe(1);
  });
});
