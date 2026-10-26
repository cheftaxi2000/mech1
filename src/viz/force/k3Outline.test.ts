import { describe, expect, it } from 'vitest';
import { pathOf, unionOutline, type Pt, type Rect } from './k3Outline';

const area = (p: readonly Pt[]) => Math.abs(p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2;

describe('unionOutline', () => {
  it('one rectangle: its four corners, grown by the margin', () => {
    const [l] = unionOutline([{ x0: 10, y0: 10, x1: 30, y1: 20 }], 2);
    expect(l.length).toBe(4);
    expect(area(l)).toBe(24 * 14);
  });
  it('two touching rectangles (block on a beam) form one L-shaped outline with 8 corners', () => {
    const block: Rect = { x0: 40, y0: 10, x1: 80, y1: 30 }, beam: Rect = { x0: 0, y0: 30, x1: 120, y1: 40 };
    const loops = unionOutline([block, beam], 4);
    expect(loops.length).toBe(1);
    expect(loops[0].length).toBe(8);
    // union area = block + beam grown by 4, minus the overlap of the grown rectangles
    const grown = (r: Rect) => (r.x1 - r.x0 + 8) * (r.y1 - r.y0 + 8);
    const overlap = (80 + 4 - (40 - 4)) * (30 + 4 - (30 - 4));
    expect(area(loops[0])).toBe(grown(block) + grown(beam) - overlap);
  });
  it('two far-apart rectangles give two separate outlines', () => {
    expect(unionOutline([{ x0: 0, y0: 0, x1: 10, y1: 10 }, { x0: 100, y0: 0, x1: 110, y1: 10 }], 3).length).toBe(2);
  });
  it('three bodies in a row merge into one', () => {
    const loops = unionOutline([{ x0: 0, y0: 0, x1: 10, y1: 10 }, { x0: 10, y0: 0, x1: 20, y1: 10 }, { x0: 20, y0: 0, x1: 30, y1: 10 }], 2);
    expect(loops.length).toBe(1); expect(loops[0].length).toBe(4);
  });
  it('empty input and the path string', () => {
    expect(unionOutline([], 3)).toEqual([]);
    expect(pathOf([[[0, 0], [1, 0], [1, 1]]])).toBe('M0.0,0.0L1.0,0.0L1.0,1.0Z');
  });
});
