import { describe, expect, it } from 'vitest';
import { COL_PRESETS, COL_STEPS, colFrame, colModel, colPoints, colResult, countKey, famAmp, famX, finalX, sweep } from './columnPicture';
import { add, apply, norm, scale, sub, type V2 } from './plane2';

const close = (u: V2, v: V2, e = 1e-9) => Math.abs(u[0] - v[0]) < e && Math.abs(u[1] - v[1]) < e;
const models = COL_PRESETS.map((p) => ({ p, m: colModel(p.A, p.b) }));

describe('column picture: presets and their classification (the HTML own test cases)', () => {
  it('rank 2: x = (1, −1), the slide 12 solution; 2·(1) + 3·(−1) = −1 and 1 + 2 = 3', () => {
    const { m } = models[0];
    expect(m.r).toBe(2); expect(m.kind).toBe('unique'); expect(close(m.xp, [1, -1])).toBe(true);
    expect(apply(m.A, [1, -1])).toEqual([-1, 3]);
    expect(countKey(m)).toBe('unique');
  });
  it('rank 1, b on the line: infinitely many, L = x_c + s·n with n = (2, 1) and x_c = (1, 1)', () => {
    const { m } = models[1];
    expect(m.r).toBe(1); expect(m.kind).toBe('infinite'); expect(m.n).toEqual([2, 1]); expect(m.xc).toEqual([1, 1]);
    expect(countKey(m)).toBe('infinite');
  });
  it('slide 13: columns on one line, b = (1, 4) off the line: no solution, closest point (1.8, 3.6)', () => {
    const { m } = models[2];
    expect(m.r).toBe(1); expect(m.kind).toBe('none'); expect(close(m.proj, [1.8, 3.6])).toBe(true);
    expect(norm(sub(m.b, m.proj))).toBeCloseTo(Math.hypot(0.8, 0.4), 9);
    expect(countKey(m)).toBe('none');
  });
  it('rank 0: no solution for b ≠ 0, every x for b = 0 (counted as infinitely many)', () => {
    expect(models[3].m.r).toBe(0); expect(models[3].m.kind).toBe('none');
    expect(models[4].m.kind).toBe('all'); expect(countKey(models[4].m)).toBe('infinite');
  });
  it('disp (the x played out in steps 2–3) is a solution when there is one', () => {
    for (const { m } of models) {
      if (m.kind === 'unique' || m.kind === 'infinite') expect(close(apply(m.A, m.disp), m.b, 1e-9)).toBe(true);
    }
    expect(models[3].m.disp).toEqual([1.5, -2]);
  });
});

describe('column picture: steps', () => {
  it('step 1 final frame: all three vectors fully grown, nothing else, x = 0', () => {
    for (const { m } of models) {
      const f = colFrame(m, 0, 1);
      expect(f.g).toEqual([1, 1, 1]); expect(f.full).toBe(true); expect(f.s1).toBe(false); expect(f.x).toEqual([0, 0]);
      const f0 = colFrame(m, 0, 0);
      expect(f0.g).toEqual([0, 0, 0]);
    }
  });
  it('step 2 final frame: x₁a₁ with x₁ of the story; step 3: x₂a₂ attached at the tip with x₂', () => {
    for (const { m } of models) {
      const f1 = colFrame(m, 1, 1);
      expect(f1.s1).toBe(true); expect(f1.s2).toBe(false); expect(f1.x[0]).toBeCloseTo(m.disp[0], 9); expect(f1.x[1]).toBe(0);
      const f2 = colFrame(m, 2, 1);
      expect(f2.s2).toBe(true); expect(f2.base2).toBe(1); expect(f2.x2num).toBe(true);
      expect(close(f2.x, m.disp)).toBe(true);
      expect(f2.axGrow).toBe(0);
    }
  });
  it('step 3 starts with x₂ = 1 sliding to the tip (rank ≥ 1), x₂a₂ not attached at t = 0', () => {
    const m = models[0].m;
    const f = colFrame(m, 2, 0);
    expect(f.base2).toBe(0); expect(f.x[1]).toBe(1); expect(f.x2num).toBe(false);
  });
  it('step 4 final frame: Ax lands on b (unique / infinite / every x) with the tick; otherwise the miss', () => {
    for (const { p, m } of models) {
      const f = colFrame(m, 3, 1), r = colResult(m, f);
      expect(f.axGrow).toBe(1);
      if (m.kind === 'none') { expect(r.hit).toBe(false); expect(r.miss).toBeGreaterThan(0.1); }
      else expect(r.hit, p.id).toBe(true);
    }
  });
  it('rank 1, none: the story ends at the closest point x̂, the miss is perpendicular to the line (right angle)', () => {
    const { m } = models[2];
    const f = colFrame(m, 3, 1), Ax = apply(m.A, f.x);
    expect(close(Ax, m.proj, 1e-9)).toBe(true);
    expect(close(f.x, finalX(m))).toBe(true);
    const miss = sub(m.b, Ax);
    expect(Math.abs(miss[0] * m.u![0] + miss[1] * m.u![1])).toBeLessThan(1e-9);
    // before the slide the first "try" x lies on the line but away from the closest point
    const f0 = colFrame(m, 3, 0.5), A0 = apply(m.A, f0.x);
    expect(norm(sub(A0, m.proj))).toBeGreaterThan(0.5);
    expect(Math.abs(A0[0] * m.u![1] - A0[1] * m.u![0])).toBeLessThan(1e-9);
  });
  it('family of solutions: x walks along x_c + s·n and Ax stays on b the whole time', () => {
    const { m } = models[1];
    expect(famAmp(m)).toBeGreaterThan(0.3);
    for (const tau of [0, 0.7, 1.9, 3.3, 4.6]) {
      const x = famX(m, tau);
      expect(close(apply(m.A, x), m.b, 1e-9)).toBe(true);
    }
    expect(close(famX(m, 0), m.xc!)).toBe(true);
    expect(norm(sub(famX(m, 1.25), famX(m, 0)))).toBeGreaterThan(0.5); // it really moves
    const walked = colFrame(m, 3, 1, 1.25);
    expect(close(walked.x, famX(m, 1.25))).toBe(true);
  });
  it('rank 0: x wanders, Ax stays 0; b = 0 stays a hit, b ≠ 0 stays a miss of |b|', () => {
    const none = models[3].m, all = models[4].m;
    for (const tau of [0, 1, 2.5]) {
      const f = colFrame(none, 3, 1, tau), r = colResult(none, f);
      expect(norm(r.Ax)).toBe(0); expect(r.miss).toBeCloseTo(norm(none.b), 9);
      expect(colResult(all, colFrame(all, 3, 1, tau)).hit).toBe(true);
    }
  });
  it('rank 0 steps 2–3: x runs through several values (the sweep), ending on the story value', () => {
    const m = models[3].m;
    expect(sweep([3, -2, 1.5], 1)).toBeCloseTo(1.5, 9);
    const mid = colFrame(m, 1, 1 / 3).x[0];
    expect(mid).toBeCloseTo(3, 6);
    expect(colFrame(m, 1, 2 / 3).x[0]).toBeCloseTo(-2, 6);
    expect(colFrame(m, 2, 1).x[1]).toBeCloseTo(m.disp[1], 9);
  });
  it('4 steps; the chain x₁a₁ + x₂a₂ equals Ax in every resting frame of steps 3 and 4', () => {
    expect(COL_STEPS).toBe(4);
    for (const { m } of models) for (const s of [2, 3]) {
      const f = colFrame(m, s, 1);
      expect(close(add(scale(m.a1, f.x[0]), scale(m.a2, f.x[1])), apply(m.A, f.x))).toBe(true);
    }
  });
  it('the fit points contain the columns, b, the closest point and the whole walk', () => {
    for (const { m } of models) {
      const pts = colPoints(m);
      for (const q of [m.a1, m.a2, m.b, m.proj]) expect(pts.some((p) => close(p, q))).toBe(true);
    }
  });
});
