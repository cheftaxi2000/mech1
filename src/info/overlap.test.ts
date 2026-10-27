import { describe, expect, it } from 'vitest';
import { runProgram } from './cpp/interp';
import { P } from './cpp/programs';
import { intersect, intervalsOverlap, interval, rectanglesOverlap } from './overlap';

describe('overlap model', () => {
  it('agrees with the C++ program of the notes on a grid of rectangles', () => {
    const vals = [-1, 0, 2];
    const mism: string[] = [];
    for (const x1 of [0, 2]) for (const w1 of vals) for (const x2 of [0, 1, 3]) for (const w2 of vals) {
      const y = [0, 2], h = [1, -1];
      const stdin = `${x1} ${y[0]} ${w1} ${h[0]} ${x2} ${y[1]} ${w2} ${h[1]}\n`;
      const cpp = runProgram(P.rectFinal.code, { stdin }).stdout.split('\n')[1] === 'overlap!';
      const js = rectanglesOverlap({ x: x1, y: y[0], w: w1, h: h[0] }, { x: x2, y: y[1], w: w2, h: h[1] });
      if (cpp !== js) mism.push(stdin);
    }
    expect(mism).toEqual([]);
  });
  it('intersection is non-null exactly when the intervals overlap', () => {
    for (let a1 = -2; a1 <= 2; a1++) for (let b1 = -2; b1 <= 2; b1++) for (let a2 = -2; a2 <= 2; a2++) for (let b2 = -2; b2 <= 2; b2++)
      expect(intersect(interval(a1, b1), interval(a2, b2)) !== null).toBe(intervalsOverlap(a1, b1, a2, b2));
  });
});
