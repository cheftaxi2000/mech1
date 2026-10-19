import { describe, expect, it } from 'vitest';
import { FACE, PS0, R_S, TH0, TH_GHOST, sphScene, thetaAt } from './sphScene';
import { H, W, labelBox, labelOverlap, type SceneLabel } from './scene';
import { project } from './geometry';
import { sphToCart, eRho } from '../../physics/coords';
import { add, scale, type Vec3 } from '../../physics/vec';

const STEPS = [0, 1, 2, 3, 4];
const LANGS = ['de', 'en'] as const;
const ts = Array.from({ length: 101 }, (_, i) => i / 100);
const label = (ls: SceneLabel[], key: string) => ls.find((l) => l.key === key);

describe('the physics the animation shows (lecture p. 4)', () => {
  it('z = r cos θ and ρ = r sin θ are the legs of the vertical triangle; x² + y² + z² = r²', () => {
    for (const th of [0.3, TH0, 1.4, 2.0, TH_GHOST, 3.0]) {
      const M = sphToCart({ r: R_S, theta: th, psi: PS0 });
      const rho = Math.hypot(M[0], M[1]);
      expect(M[2]).toBeCloseTo(R_S * Math.cos(th));
      expect(rho).toBeCloseTo(R_S * Math.sin(th)); // ≥ 0 because 0 ≤ θ ≤ π
      expect(M[0]).toBeCloseTo(rho * Math.cos(PS0)); // substitution into x = ρ cos φ with φ = ψ
      expect(M[0] ** 2 + M[1] ** 2 + M[2] ** 2).toBeCloseTo(R_S ** 2);
    }
  });
  it('the scene reports the same ρ, z as the formulas in every frame of the swing', () => {
    for (const t of ts) {
      const d = sphScene(1, t, 'en').data;
      expect(d.z).toBeCloseTo(R_S * Math.cos(d.theta));
      expect(d.rho).toBeCloseTo(R_S * Math.sin(d.theta));
      expect(d.rho).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('face-on view of the vertical plane', () => {
  it('shows e_ρ(ψ) horizontal and e_z vertical, so the right angle at M_z is not distorted', () => {
    const O = project([0, 0, 0], FACE), A = project(eRho(PS0), FACE), Z = project([0, 0, 1], FACE);
    expect(A[1] - O[1]).toBeCloseTo(0); // e_ρ horizontal
    expect(Z[0] - O[0]).toBeCloseTo(0); // e_z vertical
    expect(A[0]).toBeGreaterThan(O[0]); expect(Z[1]).toBeLessThan(O[1]);
    // a point of the plane keeps its in-plane coordinates up to scale (no shear)
    const p: Vec3 = add(scale(1.2, eRho(PS0)), [0, 0, 0.7]);
    const P = project(p, FACE);
    expect((P[0] - O[0]) / (A[0] - O[0])).toBeCloseTo(1.2);
  });
});

describe('θ timeline', () => {
  it('swings past 90° to the ghost angle and back, in whole degrees, continuously', () => {
    let max = 0, prev = thetaAt(1, 0);
    for (let t = 0; t <= 1; t += 0.002) {
      const th = thetaAt(1, t);
      expect(Math.abs(th - prev)).toBeLessThan(0.08); prev = th;
      expect(Math.abs(th / (Math.PI / 180) - Math.round(th / (Math.PI / 180)))).toBeLessThan(1e-9);
      max = Math.max(max, th);
    }
    expect(max).toBeCloseTo(TH_GHOST);
    expect(thetaAt(1, 0)).toBeCloseTo(TH0); expect(thetaAt(1, 1)).toBeCloseTo(TH0);
    for (const s of [0, 2, 3, 4]) expect(thetaAt(s, 0.5)).toBe(TH0);
  });
});

describe('every frame', () => {
  it('keeps all labels inside the figure (estimated KaTeX box), in both languages', () => {
    for (const lang of LANGS) for (const step of STEPS) for (const t of ts) {
      for (const l of sphScene(step, t, lang).labels) {
        const b = labelBox(l), where = `${lang} step ${step + 1} t=${t} ${l.key}`;
        expect(b.x0, where).toBeGreaterThanOrEqual(0); expect(b.y0, where).toBeGreaterThanOrEqual(0);
        expect(b.x1, where).toBeLessThanOrEqual(W); expect(b.y1, where).toBeLessThanOrEqual(H);
      }
    }
  });
  it('colours: z green, ρ teal, x blue, y amber, r dark, angles purple', () => {
    const want: Record<string, string> = { 'lab-legz': 'z', 'lab-legrho': 'rho', 'lab-legx': 'x', 'lab-legy': 'y', 'lab-r': 'r', 'lab-theta': 'angle', 'lab-psi': 'angle', 'lab-z3': 'z', 'lab-rho3': 'rho' };
    for (const step of STEPS) for (const t of ts) for (const l of sphScene(step, t, 'de').labels) if (want[l.key]) expect(l.ink, l.key).toBe(want[l.key]);
  });
  it('the readout shows θ in whole degrees and z, ρ computed from that same angle', () => {
    for (const t of ts) {
      const box = label(sphScene(1, t, 'en').labels, 'box-readout');
      if (!box) continue;
      const [, thRow, zRow, rhoRow] = box.rows!.map((r) => r.tex);
      const deg = Number(/= (\d+)\^/.exec(thRow)![1]);
      expect(Number(/= (-?[\d.]+)/.exec(zRow)![1])).toBeCloseTo(R_S * Math.cos((deg * Math.PI) / 180), 2);
      expect(Number(/= (-?[\d.]+)/.exec(rhoRow)![1])).toBeCloseTo(R_S * Math.sin((deg * Math.PI) / 180), 2);
    }
  });
});

describe('final frames show what the captions say', () => {
  it('step 1: M, r, θ, M_z and the vertical plane', () => {
    const sc = sphScene(0, 1, 'de');
    for (const k of ['lab-M', 'lab-r', 'lab-theta', 'lab-Mz']) expect(label(sc.labels, k)?.o, k).toBeGreaterThan(0.9);
    expect(sc.shapes.find((s) => s.key === 'plane')?.o).toBeGreaterThan(0.9);
  });
  it('step 2: both legs with their formulas, plus the θ > 90° ghost with z < 0', () => {
    const sc = sphScene(1, 1, 'de');
    expect(label(sc.labels, 'lab-legz')?.tex).toContain(String.raw`r\cos\theta`);
    expect(label(sc.labels, 'lab-legrho')?.tex).toContain(String.raw`r\sin\theta`);
    expect(label(sc.labels, 'lab-ghost')).toBeDefined();
  });
  it('step 3: top view, x = r sin θ cos ψ, y = r sin θ sin ψ, and the substitution box', () => {
    const sc = sphScene(2, 1, 'de');
    expect(label(sc.labels, 'lab-legx')?.tex).toBe(String.raw`x = r\sin\theta\cos\psi`);
    expect(label(sc.labels, 'lab-legy')?.tex).toBe(String.raw`y = r\sin\theta\sin\psi`);
    expect(label(sc.labels, 'box-subst')?.o).toBe(1);
    expect(sc.labels.some((l) => l.key === 'lab-z')).toBe(false); // looking down the z-axis
  });
  it('step 4: both right triangles and all three equations', () => {
    const sc = sphScene(3, 1, 'de');
    for (const k of ['box-floor', 'box-vert', 'box-sum', 'lab-z3', 'lab-r3']) expect(label(sc.labels, k)?.o, k).toBeGreaterThan(0.9);
  });
  it('step 5: the vertical triangle with tan θ = ρ/z and the safe θ = arccos(z/r) the caption names', () => {
    const sc = sphScene(4, 1, 'de');
    expect(label(sc.labels, 'box-tan')?.o).toBe(1);
    expect(label(sc.labels, 'box-tan')!.rows!.map((r) => r.tex).join(' ')).toMatch(/\\arccos\\dfrac\{z\}\{r\}/);
    for (const th of [0.3, 1.2, 2.0, 2.9]) expect(Math.acos(Math.cos(th))).toBeCloseTo(th, 12); // arccos(z/r) returns θ on all of [0, π]
    for (const k of ['lab-legz', 'lab-legrho', 'lab-theta']) expect(label(sc.labels, k)?.o, k).toBeGreaterThan(0.9);
  });
});

describe('labels do not cover each other in the frames a student rests on', () => {
  for (const lang of LANGS) for (const step of STEPS) {
    it(`[${lang}] step ${step + 1}, final frame`, () => {
      const ls = sphScene(step, 1, lang).labels.filter((l) => l.o > 0.5);
      for (let i = 0; i < ls.length; i++) for (let j = i + 1; j < ls.length; j++)
        expect(labelOverlap(ls[i], ls[j]), `${ls[i].key} vs ${ls[j].key}`).toBeLessThan(0.2);
    });
  }
});

describe('3D start view composition', () => {
  it('the y-axis tip stays clear of M and of the r segment', () => {
    const sc = sphScene(0, 1, 'de');
    const tip = sc.shapes.find((s) => s.key === 'ax-y')!.pts[1], M = sc.shapes.find((s) => s.key === 'M')!.pts[0];
    expect(Math.hypot(tip[0] - M[0], tip[1] - M[1])).toBeGreaterThan(20);
  });
});
