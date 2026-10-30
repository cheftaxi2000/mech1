import { describe, expect, it } from 'vitest';
import { angleOf, eulerSeries, exactCosSin, unitPoint } from './eulerGeom';

describe('Euler form', () => {
  it('the power series of e^{iφ} gives cos φ + i sin φ (40 terms, φ up to 2π)', () => {
    for (let k = 0; k <= 24; k++) {
      const phi = (k * Math.PI) / 12, [re, im] = eulerSeries(phi);
      expect(re).toBeCloseTo(Math.cos(phi), 11); expect(im).toBeCloseTo(Math.sin(phi), 11);
    }
  });
  it('e^{iπ} = −1 and e^{iπ/2} = i', () => {
    const [a, b] = eulerSeries(Math.PI), [c, d] = eulerSeries(Math.PI / 2);
    expect(a).toBeCloseTo(-1, 11); expect(b).toBeCloseTo(0, 11); expect(c).toBeCloseTo(0, 11); expect(d).toBeCloseTo(1, 11);
  });
  it('the unit circle: cos² + sin² = 1, so |e^{iφ}| = 1', () => {
    for (const phi of [0.1, 1, 2.5, 4, 6]) { const [x, y] = unitPoint(phi); expect(x * x + y * y).toBeCloseTo(1, 14); }
  });
  it('exact values agree with the numbers in all four quadrants', () => {
    for (let deg = 0; deg < 360; deg += 15) {
      const e = exactCosSin(deg), phi = (deg * Math.PI) / 180;
      if (deg % 30 === 0 || deg % 45 === 0) {
        expect(e).not.toBeNull();
        expect(e!.cos[1]).toBeCloseTo(Math.cos(phi), 12); expect(e!.sin[1]).toBeCloseTo(Math.sin(phi), 12);
      } else expect(e).toBeNull();
    }
    expect(exactCosSin(120)!.cos[0]).toBe('-\\tfrac12');
    expect(exactCosSin(225)!.sin[0]).toBe('-\\tfrac{\\sqrt2}{2}');
  });
  it('angleOf gives angles in [0, 2π) and snaps to multiples of π/12', () => {
    expect(angleOf(1, 0)).toBe(0);
    expect(angleOf(0, -1)).toBeCloseTo(1.5 * Math.PI, 12);
    expect(angleOf(Math.cos(0.5236 + 0.02), Math.sin(0.5236 + 0.02))).toBeCloseTo(Math.PI / 6, 12);
    expect(angleOf(Math.cos(0.9), Math.sin(0.9))).toBeCloseTo(0.9, 12);
    for (const [x, y] of [[1, -1e-15], [-1, -1], [0.3, 0.2]]) { const a = angleOf(x, y); expect(a).toBeGreaterThanOrEqual(0); expect(a).toBeLessThan(2 * Math.PI); }
  });
});
