import { describe, expect, it } from 'vitest';
import { PE_A, PE_KF, PE_KV, PE_PRESETS, PE_VB, powerFrame, type PePreset } from './K5Power';
import { WATT_MARKS, nfFrame, wattMarkValue } from './K5Figures';

describe('power explorer (p. 33): the five handwritten sketches', () => {
  const v = 2;
  it('the presets are exactly the classes of the page: ++ and + drive, − and −− resist, 0 is leistungslos', () => {
    const kind = (k: PePreset) => powerFrame(PE_PRESETS[k].F, v).kind;
    expect(kind('pp')).toBe('drive'); expect(kind('p')).toBe('drive'); expect(kind('m')).toBe('resist'); expect(kind('mm')).toBe('resist'); expect(kind('z')).toBe('none');
  });
  it('++ is larger than +, −− is more negative than −, 0 is exactly 0', () => {
    const P = (k: PePreset) => powerFrame(PE_PRESETS[k].F, v).P;
    expect(P('pp')).toBeGreaterThan(P('p')); expect(P('p')).toBeGreaterThan(0);
    expect(P('mm')).toBeLessThan(P('m')); expect(P('m')).toBeLessThan(0);
    expect(P('z')).toBe(0);
  });
  it('the start picture: F = (2,6; 1,5) N, v = 2,0 m/s: P = 5,2 W, α = 30°, |F| = 3,0 N, the strip is F_x = |F| cos α', () => {
    const f = powerFrame(PE_PRESETS.p.F, 2);
    expect(f.P).toBeCloseTo(5.2, 12); expect(f.Fabs).toBeCloseTo(3.0, 2); expect(((f.alpha ?? 0) * 180) / Math.PI).toBeCloseTo(29.98, 1);
    expect(f.par).toBeCloseTo(f.Fabs * Math.cos(f.alpha ?? 0), 12);
    expect(f.P).toBeCloseTo(f.Fabs * 2 * Math.cos(f.alpha ?? 0), 12);
  });
  it('F = 0: no angle, P = 0', () => {
    const f = powerFrame([0, 0], 2);
    expect(f.alpha).toBeNull(); expect(f.P).toBe(0); expect(f.kind).toBe('none');
  });
  it('everything stays inside the picture: F tip up to 3,5 N in every direction, v tip up to 3 m/s, the power bar up to 12 W', () => {
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12, x = PE_A[0] + PE_KF * 3.5 * Math.cos(a), y = PE_A[1] - PE_KF * 3.5 * Math.sin(a);
      expect(x).toBeGreaterThan(10); expect(x).toBeLessThan(PE_VB[2] - 10); expect(y).toBeGreaterThan(12); expect(y).toBeLessThan(PE_VB[3] - 40);
    }
    expect(PE_A[0] + PE_KV * 3).toBeLessThan(PE_VB[2] - 20);
    expect(200 + 12.5 * 12).toBeLessThanOrEqual(350); // BAR_X0 + BAR_K · 12 W
  });
});

describe('Fig. 5.2 left: Normalkraft', () => {
  it('tangential velocities (u = 0): both powers are 0 whatever s₁, s₂ are', () => {
    for (const s1 of [-2, -0.7, 0, 1.4, 2]) for (const s2 of [-2, -1, 0.3, 2]) {
      const f = nfFrame(s1, s2, 0);
      expect(f.P1).toBeCloseTo(0, 12); expect(f.P2).toBeCloseTo(0, 12); expect(f.sum).toBeCloseTo(0, 12);
    }
  });
  it('lift (u ≠ 0): P₁ = N u, P₂ = −N u, the sum stays 0 (N = 4 N)', () => {
    const f = nfFrame(1.4, -1, 0.5);
    expect(f.P1).toBeCloseTo(2, 12); expect(f.P2).toBeCloseTo(-2, 12); expect(f.sum).toBeCloseTo(0, 12);
  });
});

describe('everyday watts (supplement)', () => {
  it('F · v for the four marks: 1 W, ≈ 105 W, ≈ 14 kW, ≈ 4 MW — in increasing order', () => {
    const P = WATT_MARKS.map(wattMarkValue);
    expect(P[0]).toBe(1); expect(P[1]).toBeCloseTo(105, 9); expect(P[2]).toBeCloseTo(13888.9, 1); expect(P[3]).toBe(4_000_000);
    expect([...P].sort((a, b) => a - b)).toEqual(P);
    for (const p of P) { expect(p).toBeGreaterThanOrEqual(1); expect(p).toBeLessThan(1e7); }
  });
});
