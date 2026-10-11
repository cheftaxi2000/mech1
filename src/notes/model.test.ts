import { describe, expect, it } from 'vitest';
import { anchorAt, parseNote, positionOf, tiltOf } from './model';

const wrap = { left: 100, top: 50, width: 800, height: 3000 };
const sec = { left: 100, top: 650, width: 800, height: 400 };

describe('sticky-note placement', () => {
  it('anchorAt and positionOf are inverse (inside the lesson box)', () => {
    const a = anchorAt(300, 850, wrap, sec);
    expect(a).toEqual({ fx: 0.25, fy: 0.5 });
    expect(positionOf(a, wrap, sec)).toEqual({ left: 200, top: 800 });
  });
  it('keeps the note inside the lesson width', () => {
    const a = anchorAt(890, 700, wrap, sec);
    const p = positionOf(a, wrap, sec);
    expect(p.left + 210).toBeLessThanOrEqual(800);
  });
  it('follows its section when the layout reflows (section moved and taller)', () => {
    const a = anchorAt(300, 850, wrap, sec);
    const sec2 = { ...sec, top: 1250, height: 800 };
    expect(positionOf(a, wrap, sec2).top).toBe(1250 - 50 + 400);
  });
  it('tilt is stable and small', () => {
    expect(tiltOf('abc')).toBe(tiltOf('abc'));
    for (const id of ['a', 'n1', 'xyz123']) expect(Math.abs(tiltOf(id))).toBeLessThanOrEqual(2.5);
  });
  it('parseNote rejects malformed data and clamps numbers', () => {
    expect(parseNote('x', null)).toBeNull();
    expect(parseNote('x', { kind: 'other' })).toBeNull();
    const n = parseNote('x', { kind: 'note', topic: 'koordinaten', text: 'hi', fx: 7, fy: -1, color: 'red' })!;
    expect(n.fx).toBe(1); expect(n.fy).toBe(0); expect(n.color).toBe('yellow');
  });
});
