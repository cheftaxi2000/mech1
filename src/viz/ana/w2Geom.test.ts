import { describe, expect, it } from 'vitest';
import { CANCEL_X, SIN_X0, SIN_X1, cancelFrame, dragEnd, ivTex, nearerEnd, niceStep, probeH, sinFrame, sinShapes, zoomW, zoomWindow } from './w2Geom';
import { LH_SLOPES, lhF, lhG } from '../../analysis/w2';

describe('interval TeX and dragging', () => {
  it('slide interval and German decimals', () => {
    expect(ivTex({ lo: 2, hi: 6, loIn: true, hiIn: false }, 'de')).toBe('[2,\\ 6)');
    expect(ivTex({ lo: 0, hi: 4, loIn: true, hiIn: true }, 'en')).toBe('[0,\\ 4]');
    expect(ivTex({ lo: 2.5, hi: 6, loIn: false, hiIn: true }, 'de')).toBe('(2{,}5;\\ 6]');
    expect(ivTex({ lo: 0.25, hi: 4, loIn: false, hiIn: true }, 'en')).toBe('(0.25,\\ 4]');
  });
  it('drag snaps to 0,5, keeps the order and the range', () => {
    const d = { lo: 2, hi: 6, loIn: true, hiIn: false };
    expect(nearerEnd(d, 2.4)).toBe('lo'); expect(nearerEnd(d, 5.1)).toBe('hi');
    expect(dragEnd(d, 2.7, 'lo').lo).toBe(2.5);
    expect(dragEnd(d, 9, 'lo').lo).toBe(5.5);
    expect(dragEnd(d, 0, 'lo').lo).toBe(1);
    expect(dragEnd(d, 12, 'hi').hi).toBe(7);
    expect(dragEnd(d, 1, 'hi').hi).toBe(2.5);
  });
});

describe('animation frames', () => {
  it('probe distance runs from 2 to 0,01', () => {
    expect(probeH(0)).toBe(2); expect(probeH(1)).toBeCloseTo(0.01, 12);
  });
  it('cancelling: step 1 nothing extra, step 2 ends with the whole reduced graph, step 3 ends at the filled limit', () => {
    expect(cancelFrame(0, 1)).toEqual({ reducedTo: -Infinity, h: null, limit: false });
    expect(cancelFrame(1, 1).reducedTo).toBe(CANCEL_X[1]);
    const f = cancelFrame(2, 1);
    expect(f.limit).toBe(true); expect(f.h).toBeCloseTo(0.04, 12);
    expect(cancelFrame(2, 0.5).limit).toBe(false);
  });
  it('sin x / x: areas appear one per step, the last step shrinks x', () => {
    const fr = [0, 1, 2, 3, 4].map((s) => sinFrame(s, 1));
    expect(fr.map((f) => [f.small, f.sector, f.big, f.squeeze])).toEqual([
      [false, false, false, false], [true, false, false, false], [true, true, false, false], [true, true, true, false], [true, true, true, true]]);
    expect(fr[0].x).toBe(SIN_X0); expect(fr[3].x).toBe(SIN_X0); expect(fr[4].x).toBe(SIN_X1);
  });
  it('unit-circle shapes stay inside the plot window x ∈ [−0,15; 1,3], y ∈ [−0,15; 1,42]', () => {
    for (const x of [0.05, SIN_X1, 0.5, SIN_X0]) {
      const s = sinShapes(x);
      for (const p of [...s.arc, ...s.big, s.T, s.P]) {
        expect(p[0]).toBeGreaterThanOrEqual(-0.15); expect(p[0]).toBeLessThanOrEqual(1.3);
        expect(p[1]).toBeGreaterThanOrEqual(-0.15); expect(p[1]).toBeLessThanOrEqual(1.42);
      }
      expect(Math.hypot(...s.P)).toBeCloseTo(1, 12);
    }
  });
  it("L'Hôpital zoom: both graphs fit at every zoom; tangents are the slopes 2 and 1", () => {
    for (let s = 0; s <= 1; s += 0.05) {
      const w = zoomW(s), win = zoomWindow(w);
      for (let k = -1; k <= 1; k += 0.1) {
        const x = k * w;
        expect(lhF(x)).toBeGreaterThan(win.y[0]); expect(lhF(x)).toBeLessThan(win.y[1]);
        expect(lhG(x)).toBeGreaterThan(win.y[0]); expect(lhG(x)).toBeLessThan(win.y[1]);
      }
      expect(w / win.step).toBeGreaterThanOrEqual(1); expect(w / win.step).toBeLessThanOrEqual(4);
    }
    expect(LH_SLOPES.f / LH_SLOPES.g).toBe(2);
    expect(niceStep(1.5)).toBe(0.5); expect(niceStep(0.02)).toBe(0.01);
  });
});
