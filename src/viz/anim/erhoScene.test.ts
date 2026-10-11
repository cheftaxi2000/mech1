import { describe, expect, it } from 'vitest';
import { DPHI_MIN, M, PHI0, U, dphiAt, erhoScene } from './erhoScene';
import { H, W, labelBox, labelOverlap } from './scene';
import { ePhi, eRho } from '../../physics/coords';
import { dot, norm, scale, sub } from '../../physics/vec';

const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 51 }, (_, i) => i / 50);
const lab = (s: ReturnType<typeof erhoScene>, k: string) => s.labels.find((l) => l.key === k);
const shape = (s: ReturnType<typeof erhoScene>, k: string) => s.shapes.find((x) => x.key === k);

describe('physics shown (lecture p. 10)', () => {
  it('e_φ is e_ρ turned by +90°; both unit vectors', () => {
    for (const p of [0.2, PHI0, 2, 4]) {
      expect(norm(eRho(p))).toBeCloseTo(1, 12); expect(norm(ePhi(p))).toBeCloseTo(1, 12);
      expect(dot(eRho(p), ePhi(p))).toBeCloseTo(0, 12);
      expect(eRho(p + Math.PI / 2)[0]).toBeCloseTo(ePhi(p)[0], 12);
    }
  });
  it('Δe_ρ/Δφ → e_φ as Δφ → 0 (direction and length)', () => {
    const d = DPHI_MIN, q = scale(1 / d, sub(eRho(PHI0 + d), eRho(PHI0)));
    expect(norm(sub(q, ePhi(PHI0)))).toBeLessThan(0.02);
    const big = 40 * Math.PI / 180, qb = scale(1 / big, sub(eRho(PHI0 + big), eRho(PHI0)));
    expect(norm(qb)).toBeLessThan(1); // the chord is shorter than the arc
  });
});

describe('frames', () => {
  it('Δφ: 0, growing to 40° in step 2, shrinking to 2° in step 3', () => {
    expect(dphiAt(1, 1)).toBe(0);
    expect(dphiAt(2, 1)).toBeCloseTo(40 * Math.PI / 180, 12);
    expect(dphiAt(3, 1)).toBeCloseTo(DPHI_MIN, 12);
  });
  it('every frame inside the figure', () => {
    for (const lang of LANGS) for (let s = 0; s < 5; s++) for (const t of ts) {
      const sc = erhoScene(s, t, lang);
      for (const sh of sc.shapes) for (const p of sh.pts) { expect(p[0]).toBeGreaterThanOrEqual(0); expect(p[0]).toBeLessThanOrEqual(W); expect(p[1]).toBeGreaterThanOrEqual(0); expect(p[1]).toBeLessThanOrEqual(H); }
      for (const l of sc.labels) { const b = labelBox(l); expect(b.x0).toBeGreaterThanOrEqual(0); expect(b.x1).toBeLessThanOrEqual(W); expect(b.y0).toBeGreaterThanOrEqual(0); expect(b.y1).toBeLessThanOrEqual(H); }
    }
  });
  it('final frames show what the captions say', () => {
    expect(lab(erhoScene(0, 1, 'de'), 'box-erho')?.o).toBe(1);
    expect(lab(erhoScene(1, 1, 'de'), 'box-ephi')?.o).toBe(1);
    const f2 = erhoScene(2, 1, 'de');
    expect(lab(f2, 'lab-dphi')?.o).toBe(1); expect(lab(f2, 'lab-de')?.o).toBe(1); expect(shape(f2, 'de')?.o).toBe(1);
    const f3 = erhoScene(3, 1, 'de');
    expect(lab(f3, 'box-lim')?.rows?.[1].tex).toMatch(/1\{,\}00/);
    const dq = shape(f3, 'dq')!; // Δe_ρ/Δφ drawn from the tip of e_ρ, ≈ e_φ (SVG y down)
    const v = [(dq.pts[1][0] - dq.pts[0][0]) / U, -(dq.pts[1][1] - dq.pts[0][1]) / U];
    expect(Math.hypot(v[0] - ePhi(PHI0)[0], v[1] - ePhi(PHI0)[1])).toBeLessThan(0.02);
    const f4 = erhoScene(4, 1, 'en');
    expect(lab(f4, 'box-edot')?.o).toBe(1); expect(shape(f4, 'edot')?.o).toBe(1); expect(lab(f4, 'box-lim')).toBeUndefined();
    expect(M[0]).toBeGreaterThan(0);
  });
  it('final frames: labels do not overlap', () => {
    for (const lang of LANGS) for (let s = 0; s < 5; s++) {
      const ls = erhoScene(s, 1, lang).labels;
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(labelOverlap(ls[i], ls[j]), `${s}: ${ls[i].key} / ${ls[j].key}`).toBeLessThan(0.2);
    }
  });
});
