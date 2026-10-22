import { describe, expect, it } from 'vitest';
import { ZWS_ROOT, hits, p, transform } from '../../analysis/week3';
import {
  BISECT_SHOWN, HLINE, HWIN, MIRROR, P_MAX, bisectFrame, divLayout, divResultTex, mirrorAt, mirrorFrame, niceStep, polyTex,
  recipFrame, termTex, trTex, type HId, type MirrorId,
} from './w3scenes';

const inside = (q: readonly [number, number], x: readonly [number, number], y: readonly [number, number]) =>
  q[0] >= x[0] && q[0] <= x[1] && q[1] >= y[0] && q[1] <= y[1];

describe('transformation formula', () => {
  const id = { a: 0, b: 0, c: 1, d: 1 };
  it('writes the slide examples as on the slide', () => {
    expect(trTex(id, 'de')).toBe('p(x)');
    expect(trTex({ ...id, a: -2 }, 'de')).toBe('p(x + 2)');
    expect(trTex({ ...id, b: 4 }, 'de')).toBe('p(x) + 4');
    expect(trTex({ ...id, c: 2 }, 'de')).toBe('p(2x)');
    expect(trTex({ ...id, d: 2 }, 'de')).toBe('2\\,p(x)');
  });
  it('combinations, signs and the decimal comma', () => {
    expect(trTex({ a: 1.5, b: -3, c: -1, d: -0.5 }, 'de')).toBe('-0{,}5\\,p(-(x - 1{,}5)) - 3');
    expect(trTex({ a: 1.5, b: 0, c: 2, d: 1 }, 'en')).toBe('p(2(x - 1.5))');
    expect(trTex({ a: 0, b: 0, c: -1, d: -1 }, 'en')).toBe('-p(-x)');
  });
  it('the tracked maximum is the local maximum of p', () => {
    expect(P_MAX[1]).toBeCloseTo(8.09017, 4);
    expect(transform(p, id)(P_MAX[0])).toBe(P_MAX[1]);
  });
});

describe('bisection frames', () => {
  it('step 0 shows [1, 2] with the signs of f(1), f(2)', () => {
    const f = bisectFrame(0, 1);
    expect(f.band).toEqual([1, 2]);
    expect(f.ends.map((e) => e.sign)).toEqual([-1, 1]);
    for (const e of f.ends) expect(inside([e.x, e.y], f.x, f.y)).toBe(true);
  });
  it('each halving step ends on the kept half, zoomed, with the root inside', () => {
    const expected = [[1, 1.5], [1.25, 1.5], [1.25, 1.375], [1.3125, 1.375]];
    for (let s = 1; s <= BISECT_SHOWN; s++) {
      const f = bisectFrame(s, 1);
      expect(f.band).toEqual(expected[s - 1]);
      expect(f.dropped).toBeUndefined();
      expect(f.readout.k).toBe(s);
      expect(f.band[0] <= ZWS_ROOT && ZWS_ROOT <= f.band[1]).toBe(true);
      expect(f.x[0] < f.band[0] && f.band[1] < f.x[1]).toBe(true);
      expect(f.y[0] < 0 && 0 < f.y[1]).toBe(true);
      expect(inside([f.mid!.x, f.mid!.y], f.x, f.y)).toBe(true);
      for (const e of f.ends) expect(inside([e.x, e.y], f.x, f.y)).toBe(true);
    }
    // mid-step: the midpoint is there, the dropped half is fading
    const m = bisectFrame(1, 0.5);
    expect(m.mid!.alpha).toBe(1);
    expect(m.dropped && m.dropped.alpha > 0 && m.dropped.alpha < 1).toBe(true);
    expect(m.dropped!.from).toBe(1.5);
  });
  it('final step: 20 halvings, the root c ≈ 1.3247 in the first view', () => {
    const f = bisectFrame(BISECT_SHOWN + 1, 1);
    expect(f.readout.k).toBe(20);
    expect(f.readout.b - f.readout.a).toBeCloseTo(2 ** -20, 12);
    expect(f.root!.x).toBeCloseTo(1.3247, 4);
    expect(f.x).toEqual([0.4, 2.4]);
  });
  it('nice tick steps', () => {
    expect(niceStep(2)).toBe(0.5); expect(niceStep(0.35)).toBeCloseTo(0.1, 12); expect(niceStep(8.6)).toBe(2);
  });
});

describe('Ü4 p. 1 animation: maximum → minimum → moved to x = −2', () => {
  it('step 0: the maximum (−1/2, tan 1/4) in view', () => {
    const f = recipFrame(0, 1);
    expect(f.label).toBe('max');
    expect(f.pt[1]).toBeCloseTo(Math.tan(0.25), 12);
    expect(inside(f.pt, f.x, f.y)).toBe(true);
    expect(f.curve.length).toBeGreaterThan(0);
  });
  it('step 1 final frame: 1/f5 with its minimum 1/tan(1/4) at t = −1/2', () => {
    const f = recipFrame(1, 1);
    expect(f.label).toBe('min');
    expect(f.pt[0]).toBe(-0.5);
    expect(f.pt[1]).toBeCloseTo(1 / Math.tan(0.25), 9);
    expect(inside(f.pt, f.x, f.y)).toBe(true);
    // the curve has a branch through the minimum (between the poles t = −1 and t = 0)
    const mid = f.curve.find((b) => b.some((q) => Math.abs(q[0] + 0.5) < 0.01));
    expect(mid).toBeTruthy();
    expect(Math.min(...mid!.map((q) => q[1]))).toBeCloseTo(1 / Math.tan(0.25), 3);
  });
  it('step 2 final frame: the minimum sits at x = −2, same height', () => {
    const f = recipFrame(2, 1);
    expect(f.label).toBe('moved');
    expect(f.pt[0]).toBe(-2);
    expect(inside(f.pt, f.x, f.y)).toBe(true);
    const br = f.curve[0];
    const low = br.reduce((m, q) => (q[1] < m[1] ? q : m));
    expect(low[0]).toBeCloseTo(-2, 1);
  });
});

describe('mirror at y = x', () => {
  it('a point (a, b) goes to (b, a); the midpoint lies on y = x', () => {
    expect(mirrorAt([1, 3], 1)).toEqual([3, 1]);
    const m = mirrorAt([1, 3], 0.5); expect(m[0]).toBe(m[1]);
  });
  it.each(Object.keys(MIRROR) as MirrorId[])('%s: final frame of step 3 shows f, f⁻¹ and the swapped sets; the copy lies on f⁻¹', (id) => {
    const ex = MIRROR[id], fr = mirrorFrame(id, 3, 1);
    expect(fr.showInv).toBe(true);
    for (const br of fr.g!) for (const q of br.filter((_, i) => i % 25 === 0)) expect(ex.finv(q[0])).toBeCloseTo(q[1], 6);
    expect(fr.point!.Q[0]).toBeCloseTo(ex.P[1], 12);
    expect(inside(ex.P, ex.win, ex.win) && inside(fr.point!.Q, ex.win, ex.win)).toBe(true);
    expect(fr.sets.filter((s) => s.role === 'g').length).toBe(2);
  });
  it('Bsp. 4: the asymptotes x = −2 and y = 1 become y = −2 and x = 1', () => {
    const fr = mirrorFrame('bruch', 2, 1);
    const mv = fr.asym.filter((a) => a.moving);
    expect(mv.some((a) => a.a[1] === -2 && a.b[1] === -2)).toBe(true);
    expect(mv.some((a) => a.a[0] === 1 && a.b[0] === 1)).toBe(true);
  });
  it('step 0 shows only f; step 1 the point only', () => {
    expect(mirrorFrame('exp', 0, 1).g).toBeNull();
    const s1 = mirrorFrame('exp', 1, 1);
    expect(s1.g).toBeNull(); expect(s1.point!.Q[0]).toBeCloseTo(Math.E, 12);
  });
});

describe('long division layout (slide p. 11)', () => {
  it('Bsp. 1: x² : (x + 1)', () => {
    const L = divLayout([1, 0, 0], [1, 1]);
    const rows = L.rows.map((r) => r.cells.filter(Boolean).join(' '));
    expect(rows).toEqual(['x^2', '-(x^2 {}+x)', '-x', '-(-x {}-1)', '1']);
    expect(L.rows.map((r) => r.line)).toEqual([false, true, false, true, false]);
    expect(divResultTex(L)).toBe('x{}-1 + \\frac{1}{x{}+1}');
  });
  it('Bsp. 2: (x³ − 3x + 5) : (x − 1)', () => {
    const L = divLayout([1, 0, -3, 5], [1, -1]);
    const rows = L.rows.map((r) => r.cells.filter(Boolean).join(' '));
    expect(rows).toEqual(['x^3 {}-3x {}+5', '-(x^3 {}-x^2)', 'x^2 {}-3x', '-(x^2 {}-x)', '-2x {}+5', '-(-2x {}+2)', '3']);
    expect(L.quotient).toEqual(['x^2', '{}+x', '{}-2']);
    expect(divResultTex(L)).toBe('x^2{}+x{}-2 + \\frac{3}{x{}-1}');
  });
  it('terms', () => {
    expect(termTex(-1, 1, true)).toBe('-x'); expect(termTex(2.5, 0, false, 'de')).toBe('{}+2{,}5'); expect(polyTex([0, 0])).toBe('0');
  });
});

describe('horizontal-line test presets', () => {
  it.each(Object.keys(HLINE) as HId[])('%s: injective/surjective flags agree with counting intersections', (id) => {
    const P = HLINE[id];
    const lo = Math.max(P.dom[0], -40), hi = Math.min(P.dom[1], 40);
    const cs = Array.from({ length: 61 }, (_, i) => -6 + i * 0.25);
    const inZ = (c: number) => c >= P.Z[0] && c <= P.Z[1];
    const counts = cs.filter(inZ).map((c) => hits(P.f, lo, hi, c).length);
    expect(Math.max(...counts) <= 1).toBe(P.injective);
    expect(Math.min(...counts) >= 1).toBe(P.surjective);
    expect(P.c >= HWIN.y[0] && P.c <= HWIN.y[1]).toBe(true);
  });
  it('default heights: g(−2) = g(2) = 4 (two hits), e^x = −1 (none)', () => {
    expect(hits(HLINE.sq.f, -40, 40, HLINE.sq.c).length).toBe(2);
    expect(hits(HLINE.sq0.f, 0, 40, HLINE.sq0.c).length).toBe(1);
    expect(hits(HLINE.exp.f, -40, 40, HLINE.exp.c).length).toBe(0);
  });
});
