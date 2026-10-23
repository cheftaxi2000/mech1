import { describe, expect, it } from 'vitest';
import {
  TRIG_TABLE, angleTex, arg, bisectorGap, cabs, cdiv, cmul, conj, cpowMul, cpowPolar, cx, distCond, div4, divPolar,
  doubleAngle, fromPolar, holds, iPow, iPowSlow, mulPolar, naiveArctan, norm2pi, powerList, probePoint, reIz, roots,
  toPolar, type C,
} from './week6';

const close = (z: C, w: C, d = 10) => { expect(z.re).toBeCloseTo(w.re, d); expect(z.im).toBeCloseTo(w.im, d); };
const PI = Math.PI;

describe('Neu auf S. 1–4: Potenzen von i, Betrag, Konjugation', () => {
  it('i^0 … i^4 = 1, i, −1, −i, 1; i^27 = i^{4·6+3} = −i', () => {
    for (let n = 0; n <= 40; n++) close(iPow(n), iPowSlow(n));
    close(iPow(27), cx(0, -1));
    expect(div4(27)).toEqual({ q: 6, r: 3 });
    close(iPow(4), cx(1, 0));
  });
  it('|3 + 2i| = √13; z z̄ = |z|²; conj(conj z) = z; conj(z1 z2) = conj z1 · conj z2', () => {
    const z = cx(3, 2);
    expect(cabs(z)).toBeCloseTo(Math.sqrt(13), 12);
    close(cmul(z, conj(z)), cx(13, 0));
    close(conj(conj(z)), z);
    const w = cx(1, -4);
    close(conj(cmul(z, w)), cmul(conj(z), conj(w)));
  });
  it('z1/z2 = z1 z̄2 / |z2|²: (3 + i)/(1 + 2i) = 1 − i (week 5 example)', () => {
    const a = cx(3, 1), b = cx(1, 2), n = cabs(b) ** 2;
    const q = cmul(a, conj(b));
    close(cx(q.re / n, q.im / n), cx(1, -1));
    close(cdiv(a, b), cx(1, -1));
  });
});

describe('Polarform (S. 5–6)', () => {
  it('√3 + i = 2(cos π/6 + i sin π/6)', () => {
    const p = toPolar(cx(Math.sqrt(3), 1));
    expect(p.r).toBeCloseTo(2, 12);
    expect(p.phi).toBeCloseTo(PI / 6, 12);
    close(fromPolar(2, PI / 6), cx(Math.sqrt(3), 1));
  });
  it('−√3 + i: r = 2, cos φ = −√3/2, sin φ = 1/2 → φ = 5π/6; arctan(b/a) gives −π/6 (wrong half)', () => {
    const z = cx(-Math.sqrt(3), 1), p = toPolar(z);
    expect(p.r).toBeCloseTo(2, 12);
    expect(z.re / p.r).toBeCloseTo(-Math.sqrt(3) / 2, 12);
    expect(z.im / p.r).toBeCloseTo(0.5, 12);
    expect(p.phi).toBeCloseTo((5 * PI) / 6, 12);
    expect(naiveArctan(z)).toBeCloseTo(-PI / 6, 12);
    expect(angleTex(p.phi)).toBe('\\tfrac{5\\pi}{6}');
    expect(angleTex(PI / 2, 'slash')).toBe('\\pi/2');
    expect(angleTex(-PI / 6, 'slash')).toBe('-\\pi/6');
    expect(angleTex(PI)).toBe('\\pi');
    expect(angleTex(1)).toBeNull();
    expect(angleTex(PI / 14)).toBe('\\tfrac{\\pi}{14}'); expect(angleTex((2 * PI) / 7, 'slash')).toBe('2\\pi/7');
  });
  it('arctan(b/a) agrees with φ (mod 2π) exactly in the right half-plane, differs by π in the left half-plane', () => {
    for (let k = 0; k < 360; k += 7) {
      const z = fromPolar(1.7, (k * PI) / 180);
      if (Math.abs(z.re) < 1e-9) continue;
      const diff = norm2pi(arg(z) - naiveArctan(z));
      if (z.re > 0) expect(Math.min(diff, 2 * PI - diff)).toBeCloseTo(0, 9);
      else expect(diff).toBeCloseTo(PI, 9);
    }
  });
  it('1: 0, i: π/2, −1: π, −i: 3π/2; z = 0 has no angle; φ + 2πk is the same point', () => {
    expect(arg(cx(1, 0))).toBe(0);
    expect(arg(cx(0, 1))).toBeCloseTo(PI / 2, 12);
    expect(arg(cx(-1, 0))).toBeCloseTo(PI, 12);
    expect(arg(cx(0, -1))).toBeCloseTo((3 * PI) / 2, 12);
    expect(arg(cx(0, 0))).toBeNaN();
    for (const k of [-2, -1, 1, 3]) close(fromPolar(2, 0.7 + 2 * PI * k), fromPolar(2, 0.7));
  });
  it('the table of special values', () => {
    for (const row of TRIG_TABLE) { expect(Math.cos(row.phi)).toBeCloseTo(row.cos, 12); expect(Math.sin(row.phi)).toBeCloseTo(row.sin, 12); }
  });
});

describe('Eulerform und Rechenregeln (S. 7)', () => {
  it('(2e^{iπ/6})(3e^{iπ/3}) = 6e^{iπ/2} = 6i, checked against the a + bi product', () => {
    const p = mulPolar(2, PI / 6, 3, PI / 3);
    expect(p.r).toBe(6); expect(p.phi).toBeCloseTo(PI / 2, 12);
    close(cmul(fromPolar(2, PI / 6), fromPolar(3, PI / 3)), cx(0, 6));
  });
  it('6e^{iπ/2} / (2e^{iπ/6}) = 3e^{iπ/3}', () => {
    const q = divPolar(6, PI / 2, 2, PI / 6);
    expect(q.r).toBe(3); expect(q.phi).toBeCloseTo(PI / 3, 12);
    close(cdiv(fromPolar(6, PI / 2), fromPolar(2, PI / 6)), fromPolar(3, PI / 3));
  });
  it('lengths multiply, angles add — for many random pairs (a check, the proof is the addition theorem)', () => {
    for (let s = 1; s < 50; s++) {
      const z1 = cx(Math.sin(s) * 3, Math.cos(3 * s) * 2), z2 = cx(Math.cos(7 * s), Math.sin(5 * s) * 2.5);
      const pr = cmul(z1, z2);
      expect(cabs(pr)).toBeCloseTo(cabs(z1) * cabs(z2), 10);
      const diff = norm2pi(arg(pr) - arg(z1) - arg(z2));
      expect(Math.min(diff, 2 * PI - diff)).toBeCloseTo(0, 9);
    }
  });
  it('conjugate = r e^{−iφ}', () => {
    const z = fromPolar(2.5, 1.1);
    close(conj(z), fromPolar(2.5, -1.1));
  });
});

describe('Potenzen und Wurzeln (S. 8–9)', () => {
  it('(r e^{iφ})^n = r^n e^{inφ} agrees with repeated multiplication', () => {
    for (const z of [cx(1, 1), cx(0.6, 0.5), cx(-1.2, 0.3), cx(0, 1)])
      for (let n = 1; n <= 10; n++) close(cpowPolar(z, n), cpowMul(z, n), 8);
  });
  it('1 + i = √2 e^{iπ/4}; (1 + i)^4 = 4 e^{iπ} = −4; 1/(1 + i)^4 = −1/4', () => {
    const p = toPolar(cx(1, 1));
    expect(p.r).toBeCloseTo(Math.SQRT2, 12); expect(p.phi).toBeCloseTo(PI / 4, 12);
    close(cpowMul(cx(1, 1), 4), cx(-4, 0));
    close(cdiv(cx(1, 0), cpowMul(cx(1, 1), 4)), cx(-0.25, 0));
    const L = powerList(cx(1, 1), 4);
    close(L[1], cx(0, 2)); close(L[2], cx(-2, 2)); close(L[3], cx(-4, 0));
    // (1 + i)^20 = (√2)^20 e^{i·5π} = −1024
    close(cpowMul(cx(1, 1), 20), cx(-1024, 0), 8);
    expect(2 ** 10).toBe(1024);
  });
  it('i(6 + 7i) = −7 + 6i: rotation by 90°, length unchanged', () => {
    const z = cx(6, 7), w = cmul(cx(0, 1), z);
    close(w, cx(-7, 6));
    expect(cabs(w)).toBeCloseTo(cabs(z), 12);
    expect(norm2pi(arg(w) - arg(z))).toBeCloseTo(PI / 2, 12);
  });
  it('z^4 = −16: z_k = 2e^{i(π/4 + kπ/2)} = ±√2 ± i√2, and each z_k^4 = −16', () => {
    const rs = roots(cx(-16, 0), 4), s = Math.SQRT2;
    expect(rs).toHaveLength(4);
    close(rs[0].z, cx(s, s)); close(rs[1].z, cx(-s, s)); close(rs[2].z, cx(-s, -s)); close(rs[3].z, cx(s, -s));
    rs.forEach((r, k) => { expect(r.angle).toBeCloseTo(PI / 4 + (k * PI) / 2, 12); close(cpowMul(r.z, 4), cx(-16, 0), 9); });
  });
  it('roots: n distinct solutions, a regular n-gon (equal neighbour distances), every one solves z^n = w; w = 0 → only 0', () => {
    for (const w of [cx(1, 0), cx(0, 8), cx(-2, 3), cx(0.3, -0.2)])
      for (let n = 2; n <= 8; n++) {
        const rs = roots(w, n);
        expect(rs).toHaveLength(n);
        rs.forEach((r) => close(cpowMul(r.z, n), w, 8));
        const d = (a: C, b: C) => Math.hypot(a.re - b.re, a.im - b.im);
        const side = d(rs[0].z, rs[1].z);
        for (let k = 0; k < n; k++) expect(d(rs[k].z, rs[(k + 1) % n].z)).toBeCloseTo(side, 10);
      }
    expect(roots(cx(0, 0), 3)).toHaveLength(1);
  });
  it('probe path: starts at z_k (t = 0) and ends at w (t = 1) for every k', () => {
    const w = cx(-1.5, 2), n = 5, rs = roots(w, n), rr = cabs(w) ** (1 / n);
    rs.forEach((r) => { close(probePoint(rr, r.angle, n, 0), r.z); close(probePoint(rr, r.angle, n, 1), w, 9); });
  });
  it('double angle: Re and Im of (cos x + i sin x)² = cos 2x, sin 2x', () => {
    for (let x = -3; x <= 3; x += 0.37) {
      const d = doubleAngle(x);
      expect(d.re).toBeCloseTo(d.cos2x, 12); expect(d.im).toBeCloseTo(d.sin2x, 12);
      expect(d.cosForm).toBeCloseTo(d.cos2x, 12); expect(d.sinForm).toBeCloseTo(d.sin2x, 12);
    }
  });
});

describe('Bereiche (S. 10)', () => {
  it('|z − (1 + i)| ≤ 2: centre inside, 3 + i on the boundary (included), 3 + 2i outside', () => {
    const c = cx(1, 1);
    expect(distCond(c, c, '<=', 2)).toBe(true);
    expect(distCond(cx(3, 1), c, '<=', 2)).toBe(true);
    expect(distCond(cx(3, 1), c, '<', 2)).toBe(false);
    expect(distCond(cx(3, 2), c, '<=', 2)).toBe(false);
  });
  it('Re(iz) = −b, so Re(iz) > 1 ⇔ b < −1 (line b = −1 excluded)', () => {
    for (const z of [cx(0, -2), cx(3, -1), cx(-2, 0.5), cx(1, -1.01)]) {
      expect(reIz(z)).toBeCloseTo(-z.im, 12);
      expect(holds(reIz(z), '>', 1)).toBe(z.im < -1);
    }
  });
  it('the disc and Re(iz) > 1 only touch at 1 − i, which is excluded: the intersection is empty (quiz idea)', () => {
    const c = cx(1, 1);
    let found = false;
    for (let a = -1.5; a <= 3.5; a += 0.01) for (let b = -1.2; b <= -0.99; b += 0.001)
      if (distCond(cx(a, b), c, '<=', 2) && holds(reIz(cx(a, b)), '>', 1)) found = true;
    expect(found).toBe(false);
    expect(distCond(cx(1, -1), c, '<=', 2)).toBe(true);
    expect(holds(reIz(cx(1, -1)), '>', 1)).toBe(false);
  });
  it('|z − a| = |z − b| is the perpendicular bisector: midpoint on it, points on it are equidistant', () => {
    const a = cx(-1, 0), b = cx(1, 2), mid = cx(0, 1);
    expect(bisectorGap(mid, a, b)).toBeCloseTo(0, 12);
    // direction perpendicular to b − a = (2, 2) is (1, −1)
    for (const s of [-2, 0.5, 3]) expect(bisectorGap(cx(mid.re + s, mid.im - s), a, b)).toBeCloseTo(0, 12);
    expect(bisectorGap(a, a, b)).toBeLessThan(0);
  });
});
