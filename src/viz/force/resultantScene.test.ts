import { describe, expect, it } from 'vitest';
import { resultant } from '../../physics/force';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { A0, FIG42, disp, resultantScene, sumTo } from './resultantScene';

const STEPS = 6;
const near = (p: readonly number[], q: readonly number[], tol = 1e-6) => { expect(Math.abs(p[0] - q[0])).toBeLessThan(tol); expect(Math.abs(p[1] - q[1])).toBeLessThan(tol); };
const at = (f: readonly [number, number]) => [A0[0] + disp(f)[0], A0[1] + disp(f)[1]];

describe('resultant of five forces at one point (p. 29, Fig. 4.2)', () => {
  it('the forces are the physics resultant of force.ts: R = (25; 45) N, between F₄ and F₅ as in the lecture', () => {
    const R = resultant(FIG42.map((f) => ({ F: [f[0], f[1], 0] as const })));
    expect(R).toEqual([25, 45, 0]);
    const ang = (v: readonly number[]) => (Math.atan2(v[1], v[0]) * 180) / Math.PI;
    expect(ang(sumTo(5))).toBeGreaterThan(ang(FIG42[4])); // F₅ points less steeply …
    expect(ang(sumTo(5))).toBeLessThan(ang(FIG42[3])); // … than R, which is less steep than F₄
  });
  it('step 1 (final frame): all five forces start in A, with labels', () => {
    const f = resultantScene(0, 1, 'de');
    for (let i = 1; i <= 5; i++) { near(shape(f, `F${i}`)!.pts[0], A0); expect(shape(f, `F${i}`)!.o).toBe(1); expect(lab(f, `lab-F${i}`)?.o).toBe(1); }
    near(shape(f, 'F5')!.pts[1], at(FIG42[4]));
    expect(lab(f, 'box-group')?.o).toBe(1);
  });
  it('steps 2–4 (final frames): the copies lie head to tail and the dotted arrow ends at the sum so far', () => {
    for (let k = 1; k <= 3; k++) {
      const f = resultantScene(k, 1, 'de');
      // copy k+1 starts where the sum of the first k forces ends and has the same arrow as the original
      const c = shape(f, `C${k + 1}`)!;
      near(c.pts[0], at(sumTo(k)));
      near([c.pts[1][0] - c.pts[0][0], c.pts[1][1] - c.pts[0][1]], disp(FIG42[k]));
      const s = shape(f, `S${k + 1}`)!;
      near(s.pts[0], A0); near(s.pts[1], c.pts[1]);
      expect(shape(f, 'R')).toBeUndefined();
      expect(lab(f, 'box-sum')?.o).toBe(1);
    }
  });
  it('step 5 (final frame): the end of the chain is R̲ = ΣF̲_i, drawn from A', () => {
    const f = resultantScene(4, 1, 'de');
    const R = shape(f, 'R')!;
    near(R.pts[0], A0);
    near(R.pts[1], at(sumTo(5)));
    near(shape(f, 'C5')!.pts[1], R.pts[1]); // the chain ends exactly at the tip of R
    expect(f.data.rx).toBe(25); expect(f.data.ry).toBe(45);
    expect(lab(f, 'lab-R')?.o).toBe(1);
  });
  it('step 6 (final frame) = Fig. 4.2: the five forces at full strength plus R̲, no chain', () => {
    const f = resultantScene(5, 1, 'de');
    for (let i = 1; i <= 5; i++) { expect(shape(f, `F${i}`)!.o).toBe(1); expect(lab(f, `lab-F${i}`)?.o).toBe(1); }
    expect(shape(f, 'R')?.o).toBe(1);
    for (let k = 2; k <= 5; k++) expect(shape(f, `C${k}`)).toBeUndefined();
    for (let k = 2; k <= 4; k++) expect(shape(f, `S${k}`)).toBeUndefined();
    expect(lab(f, 'box-equiv')?.o).toBe(1);
  });
  it('the read-out uses the decimal convention of the language (tuple separator)', () => {
    expect(lab(resultantScene(4, 1, 'de'), 'box-sum')!.rows![1].tex).toContain(';');
    expect(lab(resultantScene(4, 1, 'en'), 'box-sum')!.rows![1].tex).toContain(',');
  });
  it('every frame inside the figure', () => expectInside(resultantScene, STEPS));
  it('final frames: labels do not overlap', () => expectNoOverlap(resultantScene, STEPS, 0.12));
});
