import { describe, expect, it } from 'vitest';
import { GHOSTS, H, PHI0, RHO, W, cylScene, labelBox, phiAt, wrap, type SceneLabel } from './cylScene';
import { labelOverlap } from './scene';

const STEPS = [0, 1, 2, 3, 4];
const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 101 }, (_, i) => i / 100);
const label = (ls: SceneLabel[], key: string) => ls.find((l) => l.key === key);
const quadrant = (phi: number) => Math.floor(wrap(phi) / (Math.PI / 2));

describe('φ timeline', () => {
  it('step 3 (index 2) sweeps φ once around, in whole degrees, through every quadrant', () => {
    const seen = new Set<number>();
    for (const t of ts) {
      const p = phiAt(2, t);
      seen.add(quadrant(p));
      expect(Math.abs(p / (Math.PI / 180) - Math.round(p / (Math.PI / 180)))).toBeLessThan(1e-9);
    }
    expect([...seen].sort()).toEqual([0, 1, 2, 3]);
    expect(phiAt(2, 0)).toBeCloseTo(PHI0);
    expect(wrap(phiAt(2, 1))).toBeCloseTo(PHI0);
  });
  it('step 5 (index 4) holds exactly φ = 0, then φ = π/2 up to and including its last frame', () => {
    for (const t of [0.16, 0.3, 0.44]) expect(phiAt(4, t)).toBe(0);
    for (const t of [0.61, 0.8, 1]) expect(phiAt(4, t)).toBeCloseTo(Math.PI / 2);
    expect(phiAt(4, 0)).toBeCloseTo(PHI0);
  });
  it('φ changes continuously within each step, and steps join without a jump', () => {
    for (const step of STEPS) {
      let prev = phiAt(step, 0);
      for (let t = 0.002; t <= 1; t += 0.002) { const p = phiAt(step, t); expect(Math.abs(p - prev)).toBeLessThan(0.08); prev = p; }
    }
    for (const step of [0, 1, 2, 3]) expect(wrap(phiAt(step, 1))).toBeCloseTo(wrap(phiAt(step + 1, 0)));
  });
});

describe('every frame', () => {
  it('keeps all labels inside the figure (estimated KaTeX box), in both languages', () => {
    for (const lang of LANGS) for (const step of STEPS) for (const t of ts) {
      for (const l of cylScene(step, t, lang).labels) {
        const b = labelBox(l);
        const where = `${lang} step ${step + 1} t=${t} ${l.key}`;
        expect(b.x0, where).toBeGreaterThanOrEqual(0); expect(b.y0, where).toBeGreaterThanOrEqual(0);
        expect(b.x1, where).toBeLessThanOrEqual(W); expect(b.y1, where).toBeLessThanOrEqual(H);
      }
    }
  });
  it('colours the legs consistently: the x-leg label is always blue, the y-leg label always orange', () => {
    for (const step of STEPS) for (const t of ts) {
      const ls = cylScene(step, t, 'de').labels;
      const lx = label(ls, 'lab-legx'), ly = label(ls, 'lab-legy');
      if (lx) expect(lx.ink).toBe('x');
      if (ly) expect(ly.ink).toBe('y');
    }
  });
  it('the readout shows φ in whole degrees in [0°, 360°) and x, y computed from exactly that angle', () => {
    for (const t of ts) {
      const box = label(cylScene(2, t, 'en').labels, 'box-readout');
      if (!box) continue;
      const [phiRow, xRow, yRow] = box.rows!.map((r) => r.tex);
      const deg = Number(/= (\d+)\^/.exec(phiRow)![1]);
      expect(deg).toBeGreaterThanOrEqual(0); expect(deg).toBeLessThan(360);
      const x = Number(/= (-?[\d.]+)/.exec(xRow)![1]), y = Number(/= (-?[\d.]+)/.exec(yRow)![1]);
      expect(x).toBeCloseTo(RHO * Math.cos((deg * Math.PI) / 180), 2);
      expect(y).toBeCloseTo(RHO * Math.sin((deg * Math.PI) / 180), 2);
    }
  });
  it('German readout uses the decimal comma (protected for KaTeX)', () => {
    const box = label(cylScene(2, 0.5, 'de').labels, 'box-readout')!;
    expect(box.rows![1].tex).toMatch(/\d\{,\}\d\d$/);
  });
});

describe('final frames show what the captions say (resting frame / reduced motion)', () => {
  it('step 1: M, the vertical drop and M_xy are all visible', () => {
    const sc = cylScene(0, 1, 'de');
    expect(label(sc.labels, 'lab-M')?.o).toBeGreaterThan(0.9);
    expect(label(sc.labels, 'lab-Mxy0')?.o).toBeGreaterThan(0.9);
    expect(sc.shapes.find((s) => s.key === 'drop')?.o).toBeGreaterThan(0.9);
  });
  it('step 2: top view with the triangle, ρ, φ and the foot M_x', () => {
    const sc = cylScene(1, 1, 'de');
    for (const k of ['lab-rho', 'lab-phi', 'lab-Mx', 'lab-Mxy']) expect(label(sc.labels, k)?.o, k).toBeGreaterThan(0.9);
    expect(sc.labels.some((l) => l.key === 'lab-z')).toBe(false); // looking straight down the z-axis
  });
  it('step 3: the sweep left one ghost triangle (with its signs) in each of quadrants II, III and IV', () => {
    const sc = cylScene(2, 1, 'de');
    expect(GHOSTS.map(quadrant)).toEqual([1, 2, 3]);
    for (const k of [0, 1, 2]) expect(label(sc.labels, `lab-sign-${k}`), `sign ${k}`).toBeDefined();
    expect(sc.shapes.some((s) => s.key === 'path')).toBe(true);
  });
  it('step 4: squares and both formulas', () => {
    const sc = cylScene(3, 1, 'de');
    for (const k of ['lab-an-sq-x', 'lab-an-sq-y', 'lab-an-sq-rho', 'box-pyth', 'box-tan']) expect(label(sc.labels, k)?.o, k).toBeGreaterThan(0.9);
  });
  it('step 4: the opposite point φ + 180° (same tan φ) is shown, diametrically opposite M_xy through O', () => {
    const sc = cylScene(3, 1, 'de');
    expect(label(sc.labels, 'lab-opp')?.o).toBe(1);
    const p = sc.shapes.find((s) => s.key === 'opp-p')!.pts[0], m = sc.shapes.find((s) => s.key === 'Mxy')!.pts[0];
    const o = sc.shapes.find((s) => s.key === 'opp-line')!.pts[1]; // O
    expect(p[0] + m[0]).toBeCloseTo(2 * o[0], 6); expect(p[1] + m[1]).toBeCloseTo(2 * o[1], 6);
    expect(Math.tan(PHI0 + Math.PI)).toBeCloseTo(Math.tan(PHI0), 12);
  });
  it('step 5: ends at φ = π/2 with both limiting cases shown', () => {
    const sc = cylScene(4, 1, 'de');
    expect(sc.data.phi).toBeCloseTo(Math.PI / 2);
    expect(label(sc.labels, 'box-lim0')?.o).toBe(1);
    expect(label(sc.labels, 'box-lim90')?.o).toBe(1);
    expect(sc.shapes.some((s) => s.key === 'lim0-x')).toBe(true);
  });
});

describe('labels do not cover each other in the frames a student rests on', () => {
  const overlap = labelOverlap;
  for (const lang of LANGS) for (const step of STEPS) {
    it(`[${lang}] step ${step + 1}, final frame`, () => {
      const ls = cylScene(step, 1, lang).labels.filter((l) => l.o > 0.5);
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(overlap(ls[i], ls[j]), `${ls[i].key} vs ${ls[j].key}`).toBeLessThan(0.2);
    });
  }
});

describe('3D start view composition', () => {
  it('the y-axis arrow does not end on the vertical drop M → M_xy (as in Fig. 1.8 it runs past it)', () => {
    const sc = cylScene(0, 1, 'de');
    const yAxis = sc.shapes.find((s) => s.key === 'ax-y')!, drop = sc.shapes.find((s) => s.key === 'drop')!;
    const tip = yAxis.pts[1], dropX = drop.pts[0][0];
    expect(Math.abs(tip[0] - dropX)).toBeGreaterThan(15);
  });
});
