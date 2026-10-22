import { describe, expect, it } from 'vitest';
import {
  G15_MAX, G15_MIN, LH_SLOPES, LIMITS, PARAB_CRIT, SYM_FNS, STET_A, STET_B, absEx, baro, cexDeriv, cexRatio, circleAreas, dnum,
  g15, g15dt, gStet, imageOfInterval, inImageG15, kuerzenReduced, leftVal, lhF, lhG, lin, noIndet, parab, plateau, potenzReduced,
  reachedAt, recip3, rightVal, solveG15, solveRecip3, squeeze, symmetryOf, wurzelReduced, fStet, type Interval,
} from './w2';

/** Brute force image of an interval by dense sampling (ends included/excluded honestly). */
function sampleImage(f: (x: number) => number, d: Interval, n = 200000) {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i <= n; i++) {
    if ((i === 0 && !d.loIn) || (i === n && !d.hiIn)) continue;
    const v = f(d.lo + ((d.hi - d.lo) * i) / n);
    lo = Math.min(lo, v); hi = Math.max(hi, v);
  }
  return { lo, hi };
}

describe('Bild / Wertebereich (Ü2 S. 2–3)', () => {
  it('f(x) = 4x + 3 on (−1, 4] has image (−1, 19]', () => {
    const im = imageOfInterval(lin, [], { lo: -1, hi: 4, loIn: false, hiIn: true });
    expect(im).toEqual({ lo: -1, hi: 19, loIn: false, hiIn: true });
  });
  it('(x − 4)² on [2, 6) has image [0, 4]: 0 at the vertex, 4 at the included end x = 2', () => {
    const d = { lo: 2, hi: 6, loIn: true, hiIn: false };
    const im = imageOfInterval(parab, PARAB_CRIT, d);
    expect(im).toEqual({ lo: 0, hi: 4, loIn: true, hiIn: true });
    expect(reachedAt(parab, PARAB_CRIT, d, 4)).toEqual([2]);
    expect(reachedAt(parab, PARAB_CRIT, d, 0)).toEqual([4]);
  });
  it('end cases: (4, 6) → (0, 4); [5, 6) → [1, 4); [2, 3] → [1, 4]', () => {
    expect(imageOfInterval(parab, PARAB_CRIT, { lo: 4, hi: 6, loIn: false, hiIn: false })).toEqual({ lo: 0, hi: 4, loIn: false, hiIn: false });
    expect(imageOfInterval(parab, PARAB_CRIT, { lo: 5, hi: 6, loIn: true, hiIn: false })).toEqual({ lo: 1, hi: 4, loIn: true, hiIn: false });
    expect(imageOfInterval(parab, PARAB_CRIT, { lo: 2, hi: 3, loIn: true, hiIn: true })).toEqual({ lo: 1, hi: 4, loIn: true, hiIn: true });
  });
  it('agrees with dense sampling on many intervals (figure grid of 0,5)', () => {
    for (let a = 0; a <= 8; a += 0.5) for (let b = a + 0.5; b <= 8; b += 0.5) {
      const d = { lo: a, hi: b, loIn: true, hiIn: true };
      const im = imageOfInterval(parab, PARAB_CRIT, d), s = sampleImage(parab, d);
      expect(im.lo).toBeCloseTo(s.lo, 6); expect(im.hi).toBeCloseTo(s.hi, 6);
    }
  });
  it('1/(x − 3): every c ≠ 0 is reached exactly once, 0 never', () => {
    for (const c of [-5, -0.2, 0.1, 3]) { const [x] = solveRecip3(c); expect(recip3(x)).toBeCloseTo(c, 12); }
    expect(solveRecip3(0)).toEqual([]);
  });
  it('g(x) = (x − 15)/(√x − 4): max 6 at x = 9, min 10 at x = 25, image ℝ ∖ (6, 10) (A-005)', () => {
    expect(g15(G15_MAX.x)).toBeCloseTo(G15_MAX.y, 12);
    expect(g15(G15_MIN.x)).toBeCloseTo(G15_MIN.y, 12);
    expect(g15(0)).toBeCloseTo(3.75, 12); // x = 0 belongs to the domain
    expect(g15dt(3)).toBeCloseTo(0, 15); expect(g15dt(5)).toBeCloseTo(0, 15);
    // left branch never above 6, right branch never below 10
    for (let x = 0; x < 16; x += 0.01) expect(g15(x)).toBeLessThanOrEqual(6 + 1e-12);
    for (let x = 16.01; x < 400; x += 0.05) expect(g15(x)).toBeGreaterThanOrEqual(10 - 1e-12);
    for (const c of [-30, 0, 3.75, 6, 10, 12, 40]) {
      expect(inImageG15(c)).toBe(true);
      const xs = solveG15(c); expect(xs.length).toBeGreaterThan(0);
      for (const x of xs) expect(g15(x)).toBeCloseTo(c, 9);
    }
    for (const c of [6.01, 8, 9.99]) { expect(inImageG15(c)).toBe(false); expect(solveG15(c)).toEqual([]); }
  });
  it('barometer: image of [0, 10 000 m] is about [0,26; 1,01] bar (A-006)', () => {
    expect(baro(0)).toBeCloseTo(1.01, 2);
    expect(baro(10000)).toBeCloseTo(0.26, 2);
    for (let h = 0; h < 10000; h += 50) expect(baro(h + 50)).toBeLessThan(baro(h));
  });
});

describe('Eigenschaften (Ü2 S. 4)', () => {
  it('even/odd presets are what they claim', () => {
    for (const s of SYM_FNS) expect(symmetryOf(s.f)).toBe(s.kind);
  });
  it('plateau is monotonic increasing but not strictly', () => {
    for (let x = 0; x < 6; x += 0.01) expect(plateau(x + 0.01)).toBeGreaterThanOrEqual(plateau(x) - 1e-12);
    expect(plateau(2.5)).toBe(plateau(3.5));
  });
});

describe('Stetigkeit und einseitige Grenzwerte (Ü2 S. 4–5)', () => {
  it('drawn g jumps at a (left limit higher) and is continuous at b; f has no jump', () => {
    expect(leftVal(gStet, STET_A) - rightVal(gStet, STET_A)).toBeGreaterThan(1.5);
    expect(Math.abs(leftVal(gStet, STET_B) - rightVal(gStet, STET_B))).toBeLessThan(1e-5);
    for (let x = 0.1; x < 10; x += 0.1) expect(Math.abs(leftVal(fStet, x) - rightVal(fStet, x))).toBeLessThan(1e-5);
  });
  it('(x − 1)/(2|x − 1|): right limit ½, left limit −½, not defined at 1 (A-007)', () => {
    expect(rightVal(absEx, 1)).toBe(0.5);
    expect(leftVal(absEx, 1)).toBe(-0.5);
    expect(absEx(1)).toBeNaN();
  });
});

describe('Grenzwert-Methoden (Ü2 S. 5–7)', () => {
  for (const ex of LIMITS) {
    it(`${ex.id}: limit ${ex.value}`, () => {
      if (ex.a === Infinity) { expect(ex.f(1e7)).toBeCloseTo(ex.value, 6); return; }
      for (const s of [1, -1]) expect(ex.f(ex.a + s * 1e-6)).toBeCloseTo(ex.value, 4);
    });
  }
  it('the cancelled forms agree with the originals for x ≠ a', () => {
    const k = LIMITS.find((l) => l.id === 'kuerzen')!.f, w = LIMITS.find((l) => l.id === 'wurzel')!.f, p = LIMITS.find((l) => l.id === 'potenz')!.f;
    for (const x of [-1.7, -0.3, 0.4, 1.9, 2.1, 5]) {
      expect(k(x)).toBeCloseTo(kuerzenReduced(x), 12);
      expect(w(x)).toBeCloseTo(wurzelReduced(x), 12);
      expect(p(x)).toBeCloseTo(potenzReduced(x), 12);
    }
    expect(kuerzenReduced(2)).toBeCloseTo(0.8, 15);
    expect(wurzelReduced(0)).toBe(0.25);
    expect(k(2)).toBeNaN(); // 0/0: not defined at 2
  });
  it('x·sin(1/x) is squeezed between −|x| and |x|; from the left u = 1/x → −∞, sin(u)/u → 0 as well', () => {
    for (let x = -1; x <= 1; x += 0.001) if (x !== 0) expect(Math.abs(x * Math.sin(1 / x))).toBeLessThanOrEqual(Math.abs(x) + 1e-15);
    expect(Math.sin(-1e6) / -1e6).toBeCloseTo(0, 5);
  });
  it('unit-circle areas: ½ sin x ≤ ½ x ≤ ½ tan x and the squeeze 1 ≤ x/sin x ≤ 1/cos x → 1', () => {
    for (let x = 0.01; x < 1.5; x += 0.01) {
      const a = circleAreas(x); expect(a.small).toBeLessThan(a.sector); expect(a.sector).toBeLessThan(a.big);
      const s = squeeze(x); expect(s.mid).toBeGreaterThanOrEqual(s.lower); expect(s.mid).toBeLessThanOrEqual(s.upper);
    }
    expect(squeeze(1e-4).upper).toBeCloseTo(1, 7);
  });
  it('derivatives used by L\'Hôpital: (sin)′ = cos, (cos x − 1)′ = −sin, (tan 5x)′ = 5/cos²(5x)', () => {
    for (const x of [-0.2, 0.05, 0.13]) {
      expect(dnum(Math.sin, x)).toBeCloseTo(Math.cos(x), 8);
      expect(dnum((y) => Math.cos(y) - 1, x)).toBeCloseTo(-Math.sin(x), 8);
      expect(dnum((y) => Math.tan(5 * y), x)).toBeCloseTo(5 / Math.cos(5 * x) ** 2, 6);
    }
    expect(5 / Math.cos(0) ** 2).toBe(5);
  });
  it('zoom pair: f(0) = g(0) = 0, slopes 2 and 1, ratio → 2', () => {
    expect(lhF(0)).toBe(0); expect(lhG(0)).toBe(0);
    expect(dnum(lhF, 0)).toBeCloseTo(LH_SLOPES.f, 8); expect(dnum(lhG, 0)).toBeCloseTo(LH_SLOPES.g, 8);
    expect(lhF(1e-6) / lhG(1e-6)).toBeCloseTo(2, 5);
  });
  it('A-008: (x + sin x)/x → 1, but 1 + cos x keeps swinging between 0 and 2', () => {
    expect(cexRatio(1e8)).toBeCloseTo(1, 7);
    expect(cexDeriv(2 * Math.PI * 1e6)).toBeCloseTo(2, 6);
    expect(cexDeriv(Math.PI * (2e6 + 1))).toBeCloseTo(0, 6);
  });
  it('no 0/0: (x + 1)/(x + 2) → ½ at 0, the derivative ratio would wrongly give 1', () => {
    expect(noIndet(0)).toBe(0.5);
    expect(dnum((x) => x + 1, 0) / dnum((x) => x + 2, 0)).toBeCloseTo(1, 10);
  });
});
