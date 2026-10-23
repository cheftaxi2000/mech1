import { describe, expect, it } from 'vitest';
import { apply, type M2, type V2 } from '../../linalg/plane2';
import { COLLAPSE_A, COLLAPSE_STEPS, collapseScene, collapseView } from './collapseScene';
import { fitView, labelBox, labelSize, placeLabels, toPx, type PItem, type View } from './planeItems';
import { trPoints, trScene } from './trScene';

type Lab = Extract<PItem, { k: 'label' }>;
type Arr = Extract<PItem, { k: 'arrow' }>;
const get = (items: PItem[], id: string) => items.find((it) => it.id === id);
const labels = (items: PItem[]) => items.filter((it): it is Lab => it.k === 'label');
const close = (u: readonly number[], v: readonly number[], e = 1e-9) => Math.abs(u[0] - v[0]) < e && Math.abs(u[1] - v[1]) < e;
function expectTidy(items: PItem[], v: View, tag: string) {
  const bs = labels(items).map((l) => ({ id: l.id, b: labelBox(toPx(v, l.at), l.dx ?? 0, l.dy ?? 0, l.anchor ?? 'c', labelSize(l.tex, l.small, v.w)) }));
  for (const { id, b } of bs) { expect(b[0], `${tag} ${id}`).toBeGreaterThanOrEqual(0); expect(b[2], `${tag} ${id}`).toBeLessThanOrEqual(v.w); expect(b[1], `${tag} ${id}`).toBeGreaterThanOrEqual(0); expect(b[3], `${tag} ${id}`).toBeLessThanOrEqual(v.h); }
  for (let p = 0; p < bs.length; p++) for (let q = p + 1; q < bs.length; q++) {
    const A = bs[p].b, B = bs[q].b;
    expect(!(A[2] < B[0] || B[2] < A[0] || A[3] < B[1] || B[3] < A[1]), `${tag}: ${bs[p].id} × ${bs[q].id}`).toBe(false);
  }
}

const A: M2 = [[3, 1], [1, 2]];
const x: V2 = [-1, 2];
const scene = (t: number, b?: V2, AA: M2 = A) => {
  const v = fitView(trPoints(AA, [x], b));
  return { v, sc: trScene({ A: AA, t, lang: 'de', b, inputs: [{ id: 'x', p: x, role: 'ax', label: 'x', imgLabel: 'Ax', stair: true, ghost: true }], drag: ['a1', 'a2', 'x'] }, v) };
};

describe('transformation scene (slides 15–17)', () => {
  it('before (t = 0): e₁, e₂ and x where they are, labelled e₁, e₂, x', () => {
    const { sc } = scene(0);
    expect((get(sc.items, 'e1') as Arr).b).toEqual([1, 0]);
    expect((get(sc.items, 'e2') as Arr).b).toEqual([0, 1]);
    expect(close((get(sc.items, 'x') as Arr).b, x)).toBe(true);
    expect(get(sc.items, 'lab-e1')).toMatchObject({ tex: 'e_1' });
    expect(get(sc.items, 'lab-x')).toMatchObject({ tex: 'x' });
  });
  it('after (t = 1): e₁ → a₁ = (3, 1), e₂ → a₂ = (1, 2), x → Ax = (−1, 3), the chain −1·a₁ then 2·a₂', () => {
    const { sc } = scene(1);
    expect(close((get(sc.items, 'e1') as Arr).b, [3, 1])).toBe(true);
    expect(close((get(sc.items, 'e2') as Arr).b, [1, 2])).toBe(true);
    expect(close((get(sc.items, 'x') as Arr).b, [-1, 3])).toBe(true);
    expect(close((get(sc.items, 'x-s1') as Arr).b, [-3, -1])).toBe(true);
    expect(close((get(sc.items, 'x-s2') as Arr).b, [-1, 3])).toBe(true);
    expect(get(sc.items, 'lab-x')).toMatchObject({ tex: 'Ax' });
    expect(get(sc.items, 'x-ghost')).toBeDefined();
    expect(sc.handles.map((h) => h.id)).toEqual(['a1', 'a2', 'x']);
  });
  it('the grid moves with the plane (warp matrix = interp at t)', () => {
    const w = get(scene(1).sc.items, 'warp') as Extract<PItem, { k: 'warp' }>;
    expect(w.M).toEqual(A);
  });
  it('find mode, rank 2: the input A⁻¹b lands on b (hit)', () => {
    const { sc } = scene(1, [-1, 3]);
    expect(get(sc.items, 'hit')).toBeDefined();
    expect(get(sc.items, 'miss')).toBeUndefined();
  });
  it('rank 1 at the end: the image line; b off the line: the miss is shown', () => {
    const R1: M2 = [[1, -2], [2, -4]];
    const v = fitView(trPoints(R1, [[0.36, -0.72]], [1, 4]));
    const sc = trScene({ A: R1, t: 1, lang: 'de', b: [1, 4], inputs: [{ id: 'x', p: [0.36, -0.72], role: 'ax' }] }, v);
    expect(get(sc.items, 'image-line')).toBeDefined();
    expect(get(sc.items, 'miss')).toBeDefined();
    const inf = trScene({ A: R1, t: 1, lang: 'de', b: [-1, -2], inputs: [] }, v);
    expect(get(inf.items, 'sol-line')).toBeDefined();
    const s = get(inf.items, 'sol-line') as Extract<PItem, { k: 'seg' }>;
    expect(close(s.a, [-1, -2], 1e-6)).toBe(true); expect(close(s.b, [-1, -2], 1e-6)).toBe(true); // the whole line lands on b
  });
  it('labels inside and not overlapping, before and after, for every preset matrix', () => {
    for (const AA of [A, [[2, 3], [1, -2]], [[1, -2], [2, -4]], [[1, 1], [0, 1]], [[0, -1], [1, 0]], [[0, 1], [1, 0]], [[2, 0], [0, 0.5]]] as M2[])
      for (const t of [0, 1]) { const { v, sc } = scene(t, undefined, AA); expectTidy(sc.items, v, `${JSON.stringify(AA)} t=${t}`); }
  });
});

describe('collapse animation (slides 18–20)', () => {
  it(`${COLLAPSE_STEPS} steps; step 1: the plane before, v and w labelled with their coordinates`, () => {
    const f = collapseScene(0, 1, 'de');
    expect(f.t).toBe(0);
    expect(get(f.items, 'lab-v')!).toMatchObject({ tex: 'v = (-2;\\ -2)^T' });
    expect(get(f.items, 'lab-w')!).toMatchObject({ tex: 'w = (1;\\ -2)^T' });
  });
  it('step 2: dashed arrows to a₁ = (1, 2) and a₂ = (−2, −4) and the line through both, nothing has moved yet', () => {
    const f = collapseScene(1, 1, 'de');
    expect(f.t).toBe(0);
    expect((get(f.items, 'a1-target') as Arr).b).toEqual([1, 2]);
    expect((get(f.items, 'a2-target') as Arr).b).toEqual([-2, -4]);
    expect(get(f.items, 'target-line')).toBeDefined();
  });
  it('step 3: the morph ends at A; v → (2, 4), w → (5, 10) (LA-001), both on the line y = 2x', () => {
    const f = collapseScene(2, 1, 'de');
    expect(f.t).toBe(1);
    expect(close((get(f.items, 'v') as Arr).b, [2, 4])).toBe(true);
    expect(close((get(f.items, 'w') as Arr).b, [5, 10])).toBe(true);
    expect(close(apply(COLLAPSE_A, [1, -2]), [5, 10])).toBe(true);
    expect(get(f.items, 'image-line')).toBeDefined();
    expect(get(f.items, 'lab-v')).toMatchObject({ tex: 'Av = (2;\\ 4)^T' });
  });
  it('steps 4 and 5: the column chains a₁(−2) + a₂(−2) and a₁(1) + a₂(−2) end on the images', () => {
    const lane = 0.42;
    const c4 = get(collapseScene(3, 1, 'de').items, 'v-c2') as Arr;
    const c5 = get(collapseScene(4, 1, 'de').items, 'w-c2') as Arr;
    expect(Math.hypot(c4.b[0] - 2, c4.b[1] - 4)).toBeCloseTo(lane, 9);
    expect(Math.hypot(c5.b[0] - 5, c5.b[1] - 10)).toBeCloseTo(lane, 9);
    expect(get(collapseScene(3, 1, 'de').items, 'lab-v-c1')).toMatchObject({ tex: 'a_1\\cdot(-2)' });
    expect(get(collapseScene(4, 1, 'de').items, 'lab-w-c1')).toMatchObject({ tex: 'a_1\\cdot(1)' });
  });
  it('every resting frame: labels inside and not overlapping; every frame: all points inside the window', () => {
    for (let s = 0; s < COLLAPSE_STEPS; s++) {
      expectTidy(collapseScene(s, 1, 'en').items, collapseView, `step ${s + 1}`);
      for (const tt of [0, 0.3, 0.6, 1]) for (const it of collapseScene(s, tt, 'en').items) {
        if (it.k !== 'arrow') continue;
        for (const p of [it.a, it.b]) { expect(p[0]).toBeGreaterThan(collapseView.x[0]); expect(p[0]).toBeLessThan(collapseView.x[1]); expect(p[1]).toBeGreaterThan(collapseView.y[0]); expect(p[1]).toBeLessThan(collapseView.y[1]); }
      }
    }
  });
});

describe('shared plane helpers', () => {
  it('fitView: square units, origin and all points inside, calm (integer corners)', () => {
    const v = fitView([[5, 10], [-2, -4]], 520, 520);
    expect((v.x[1] - v.x[0]) / 492).toBeCloseTo((v.y[1] - v.y[0]) / 492, 9);
    expect(Number.isInteger(v.x[0]) && Number.isInteger(v.y[0])).toBe(true);
    expect(v.x[0]).toBeLessThan(-2); expect(v.y[1]).toBeGreaterThan(10);
  });
  it('placeLabels moves a label off another one and keeps it inside', () => {
    const v = fitView([[3, 3]]);
    const items: PItem[] = [
      { k: 'label', id: 'a', at: [1, 1], tex: 'a_1', role: 'c1' },
      { k: 'label', id: 'b', at: [1, 1], tex: 'b', role: 'tgt' },
    ];
    const out = placeLabels(items, v) as Lab[];
    const box = (l: Lab) => labelBox(toPx(v, l.at), l.dx ?? 0, l.dy ?? 0, l.anchor ?? 'c', labelSize(l.tex, l.small, v.w));
    const [A1, B1] = [box(out[0]), box(out[1])];
    expect(A1[2] < B1[0] || B1[2] < A1[0] || A1[3] < B1[1] || B1[3] < A1[1]).toBe(true);
  });
});
