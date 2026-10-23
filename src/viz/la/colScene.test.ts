import { describe, expect, it } from 'vitest';
import { COL_PRESETS, colFrame, colModel, colPoints } from '../../linalg/columnPicture';
import { colScene, dragSystem } from './colScene';
import { fitView, labelBox, labelSize, toPx, type PItem, type View } from './planeItems';

const models = COL_PRESETS.map((p) => colModel(p.A, p.b));
const scene = (i: number, step: number, t = 1, tau = 0) => {
  const m = models[i], v = fitView(colPoints(m));
  return { v, sc: colScene(m, colFrame(m, step, t, tau), v, 'de', tau) };
};
const get = (items: PItem[], id: string) => items.find((it) => it.id === id);
const labels = (items: PItem[]) => items.filter((it): it is Extract<PItem, { k: 'label' }> => it.k === 'label');
const boxOf = (v: View, l: Extract<PItem, { k: 'label' }>) => labelBox(toPx(v, l.at), l.dx ?? 0, l.dy ?? 0, l.anchor ?? 'c', labelSize(l.tex, l.small, v.w));

describe('column picture scene: each step shows what its caption says', () => {
  it('step 1: a₁ (green), a₂ (blue), b (red) with the target ring and three drag handles', () => {
    for (let i = 0; i < models.length; i++) {
      const { sc } = scene(i, 0);
      expect(get(sc.items, 'a1')).toMatchObject({ role: 'c1' });
      expect(get(sc.items, 'a2')).toMatchObject({ role: 'c2' });
      if (models[i].b.some((c) => c !== 0)) expect(get(sc.items, 'b')).toMatchObject({ role: 'tgt' });
      expect(get(sc.items, 'ring-b')).toBeDefined();
      expect(sc.handles.map((h) => h.id)).toEqual(['a1', 'a2', 'b']);
      expect(get(sc.items, 'x1a1')).toBeUndefined();
    }
  });
  it('step 2: x₁a₁ drawn with its value; step 3: x₂a₂ starts at the tip of x₁a₁', () => {
    const { sc } = scene(0, 1);
    expect(get(sc.items, 'x1a1')).toMatchObject({ role: 'c1', b: [2, 1] });
    expect(get(sc.items, 'lab-x1')).toMatchObject({ tex: 'x_1 = 1' });
    const s3 = scene(0, 2).sc;
    expect(get(s3.items, 'x2a2')).toMatchObject({ a: [2, 1], b: [-1, 3] });
    expect(get(s3.items, 'lab-x2')).toMatchObject({ tex: 'x_2 = -1' });
    expect(get(s3.items, 'Ax')).toBeUndefined();
  });
  it('step 4, rank 2: Ax ends on b, hit highlight, no miss', () => {
    const { sc } = scene(0, 3);
    expect(get(sc.items, 'Ax')).toMatchObject({ b: [-1, 3] });
    expect(get(sc.items, 'hit')).toBeDefined();
    expect(get(sc.items, 'miss')).toBeUndefined();
  });
  it('step 4, slide 13 (rank 1, none): span line, miss vector from b to the closest point, right angle', () => {
    const { sc } = scene(2, 3);
    expect(get(sc.items, 'span')).toBeDefined();
    const miss = get(sc.items, 'miss') as Extract<PItem, { k: 'arrow' }>;
    expect(miss.a).toEqual([1, 4]);
    expect(miss.b[0]).toBeCloseTo(1.8, 9); expect(miss.b[1]).toBeCloseTo(3.6, 9);
    expect(get(sc.items, 'right-angle')).toBeDefined();
    expect(get(sc.items, 'hit')).toBeUndefined();
  });
  it('rank 1: x₁a₁ and x₂a₂ run on two lanes either side of the line', () => {
    const { sc } = scene(1, 2), m = models[1];
    const a = get(sc.items, 'x1a1') as Extract<PItem, { k: 'arrow' }>, b = get(sc.items, 'x2a2') as Extract<PItem, { k: 'arrow' }>;
    const across = (p: readonly number[]) => p[0] * m.u![1] - p[1] * m.u![0];
    expect(Math.sign(across(a.a))).toBe(-Math.sign(across(b.a)));
  });
  it('rank 0: the callout says it all (no labels on the origin), the last line gives the verdict', () => {
    const none = scene(3, 3).sc, all = scene(4, 3).sc;
    expect(none.callout).toBe(true);
    expect(labels(none.items).every((l) => l.id.startsWith('callout') || l.id === 'lab-b')).toBe(true);
    expect(labels(none.items).at(-1)!.tex).toContain('|Ax - b| = |b|');
    expect(labels(all.items).at(-1)!.tex).toContain('\\checkmark');
  });
  it('infinitely many: a trail follows x while it walks', () => {
    expect(scene(1, 3, 1, 2).sc.items.some((it) => it.id.startsWith('trail'))).toBe(true);
  });
});

describe('column picture scene: layout', () => {
  it('in every resting frame all labels lie inside the picture and do not overlap', () => {
    for (let i = 0; i < models.length; i++) for (let s = 0; s < 4; s++) {
      const { v, sc } = scene(i, s);
      const bs = labels(sc.items).map((l) => ({ id: l.id, b: boxOf(v, l) }));
      for (const { id, b } of bs) {
        expect(b[0], `${i}/${s} ${id}`).toBeGreaterThanOrEqual(0); expect(b[2]).toBeLessThanOrEqual(v.w);
        expect(b[1], `${i}/${s} ${id}`).toBeGreaterThanOrEqual(0); expect(b[3]).toBeLessThanOrEqual(v.h);
      }
      for (let p = 0; p < bs.length; p++) for (let q = p + 1; q < bs.length; q++) {
        const A = bs[p].b, B = bs[q].b;
        const over = !(A[2] < B[0] || B[2] < A[0] || A[3] < B[1] || B[3] < A[1]);
        expect(over, `${i}/${s}: ${bs[p].id} × ${bs[q].id}`).toBe(false);
      }
    }
  });
  it('the window has square units and contains every point of the story', () => {
    for (const m of models) {
      const v = fitView(colPoints(m));
      expect((v.x[1] - v.x[0]) / (v.w - 28)).toBeCloseTo((v.y[1] - v.y[0]) / (v.h - 28), 9);
      for (const p of colPoints(m)) { expect(p[0]).toBeGreaterThan(v.x[0]); expect(p[0]).toBeLessThan(v.x[1]); expect(p[1]).toBeGreaterThan(v.y[0]); expect(p[1]).toBeLessThan(v.y[1]); }
    }
  });
  it('dragging a tip edits the right column (or b)', () => {
    const A = COL_PRESETS[0].A, b = COL_PRESETS[0].b;
    expect(dragSystem(A, b, 'a1', [1, 1]).A).toEqual([[1, 3], [1, -2]]);
    expect(dragSystem(A, b, 'a2', [0.5, 2]).A).toEqual([[2, 0.5], [1, 2]]);
    expect(dragSystem(A, b, 'b', [4, 0]).b).toEqual([4, 0]);
    expect(A).toEqual([[2, 3], [1, -2]]); // not mutated
  });
});
