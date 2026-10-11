import { describe, expect, it } from 'vitest';
import { DT0, DT_MIN, T0, arcLength, curve, dcurve, dtAt, velScene } from './velScene';
import { H, W, labelBox, labelOverlap } from './scene';

const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 51 }, (_, i) => i / 50);
const lab = (s: ReturnType<typeof velScene>, k: string) => s.labels.find((l) => l.key === k);
const shape = (s: ReturnType<typeof velScene>, k: string) => s.shapes.find((x) => x.key === k);

describe('the physics the animation shows (lecture pp. 8–9)', () => {
  it('dcurve is the derivative of curve', () => {
    for (const t of [0.2, T0, 1.5]) {
      const h = 1e-6, a = curve(t + h), b = curve(t - h);
      expect((a[0] - b[0]) / (2 * h)).toBeCloseTo(dcurve(t)[0], 5);
      expect((a[1] - b[1]) / (2 * h)).toBeCloseTo(dcurve(t)[1], 5);
    }
  });
  it('as Δt → 0: Δr/Δt → ṙ, the chord direction → tangent, and |Δr|/Δs → 1 (R-014 a, b)', () => {
    const M = curve(T0), v = dcurve(T0), sp = Math.hypot(...v);
    for (const dt of [0.2, 0.05, 0.006]) {
      const P = curve(T0 + dt), q = [(P[0] - M[0]) / dt, (P[1] - M[1]) / dt];
      const angle = Math.acos((q[0] * v[0] + q[1] * v[1]) / (Math.hypot(q[0], q[1]) * sp));
      const ratio = Math.hypot(P[0] - M[0], P[1] - M[1]) / arcLength(T0, T0 + dt);
      if (dt === 0.006) { expect(angle).toBeLessThan(0.02); expect(ratio).toBeGreaterThan(0.9999); }
      expect(ratio).toBeLessThanOrEqual(1); // a chord is never longer than its arc
    }
  });
  it('ṡ = ds/dt equals |ṙ| (v = ṡ τ with |τ| = 1)', () => {
    const h = 1e-4;
    expect((arcLength(0, T0 + h) - arcLength(0, T0 - h)) / (2 * h)).toBeCloseTo(Math.hypot(...dcurve(T0)), 4);
  });
});

describe('frames', () => {
  it('Δt: DT0 until step 2, shrinking monotonically to DT_MIN in step 2', () => {
    expect(dtAt(1, 1)).toBe(DT0);
    let prev = Infinity;
    for (const t of ts) { const d = dtAt(2, t); expect(d).toBeLessThanOrEqual(prev + 1e-12); prev = d; }
    expect(dtAt(2, 1)).toBeCloseTo(DT_MIN, 12);
  });
  it('every frame: shapes and labels inside the figure', () => {
    for (const lang of LANGS) for (let s = 0; s < 4; s++) for (const t of ts) {
      const sc = velScene(s, t, lang);
      for (const sh of sc.shapes) for (const p of sh.pts) {
        expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(W);
        expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(H);
      }
      for (const l of sc.labels) { const b = labelBox(l); expect(b.x0).toBeGreaterThanOrEqual(0); expect(b.x1).toBeLessThanOrEqual(W); expect(b.y0).toBeGreaterThanOrEqual(0); expect(b.y1).toBeLessThanOrEqual(H); }
    }
  });
  it('final frames show what the captions say', () => {
    const f0 = velScene(0, 1, 'de');
    expect(lab(f0, 'lab-r')?.o).toBe(1); expect(lab(f0, 'lab-s')?.o).toBe(1); expect(lab(f0, 'lab-dr')).toBeUndefined();
    const f1 = velScene(1, 1, 'de');
    for (const k of ['lab-r2', 'lab-dr', 'lab-ds']) expect(lab(f1, k)?.o).toBe(1);
    const f2 = velScene(2, 1, 'de');
    expect(f2.data.dt).toBeCloseTo(DT_MIN, 12);
    expect(shape(f2, 'tangent')?.o).toBe(1);
    expect(lab(f2, 'box-limit')?.rows?.[1].tex).toMatch(/1\{,\}00/);
    const f3 = velScene(3, 1, 'en');
    expect(lab(f3, 'lab-v')?.o).toBe(1); expect(lab(f3, 'lab-tau')?.o).toBe(1); expect(lab(f3, 'box-v')?.o).toBe(1);
    expect(lab(f3, 'lab-dr')).toBeUndefined(); // the limit construction has been cleared away
  });
  it('final frames: labels do not overlap', () => {
    for (const lang of LANGS) for (let s = 0; s < 4; s++) {
      const ls = velScene(s, 1, lang).labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(labelOverlap(ls[i], ls[j]), `${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(0.2);
    }
  });
});
