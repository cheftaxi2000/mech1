import { describe, expect, it } from 'vitest';
import { dnf, equivalent, vector, vectorString } from './logic';

describe('logical values (notes §4.3)', () => {
  it('truth tables of AND, OR and XOR as in the notes', () => {
    expect(vectorString(vector('x && y'))).toBe('0001');
    expect(vectorString(vector('x || y'))).toBe('0111');
    expect(vectorString(vector('(x || y) && !(x && y)'))).toBe('0110'); // XOR, p. 46
    expect(vectorString(vector('x != y'))).toBe('0110');
  });
  it('the rules of De Morgan', () => {
    expect(equivalent('!(x && y)', '!x || !y')).toBe(true);
    expect(equivalent('!(x || y)', '!x && !y')).toBe(true);
    expect(equivalent('!(x && y)', '!x && !y')).toBe(false);
  });
  it('Example 4.10: four views of the same formula', () => {
    const forms = ['(x || y) && !(x && y)', '(x || y) && (!x || !y)', '!(!x && !y) && !(x && y)', '!(!x && !y || x && y)'];
    for (const f of forms) expect(vectorString(vector(f))).toBe('0110');
  });
  it('Theorem 4.1: all 16 binary functions are expressible with and, or, not (the proof\'s construction)', () => {
    for (let n = 0; n < 16; n++) {
      const v = [3, 2, 1, 0].map((b) => !!((n >> b) & 1));
      expect(vector(dnf(v))).toEqual(v);
    }
  });
  it('the notes\' example f1101 = f1000 ∨ f0100 ∨ f0001', () => {
    expect(dnf([true, true, false, true])).toBe('(!x && !y) || (!x && y) || (x && y)');
  });
  it('precedence: && binds stronger than ||, ! stronger than both', () => {
    expect(equivalent('x || y && !x', 'x || (y && !x)')).toBe(true);
    expect(equivalent('x || y && !x', '(x || y) && !x')).toBe(false);
    expect(equivalent('!x && y', '(!x) && y')).toBe(true);
    expect(equivalent('!x && y', '!(x && y)')).toBe(false);
  });
});
