import { describe, expect, it } from 'vitest';
import { allOutcomes, buildTree, evalWith, fullParen } from './expr';

describe('parenthesization (notes §3.2, Rules 1–4 and Example 4.8)', () => {
  it('Rule 1 and 2: 32 + 9 * celsius / 5 is 32 + ((9 * celsius) / 5)', () => {
    expect(fullParen('32 + 9 * celsius / 5')).toBe('32 + ((9 * celsius) / 5)');
  });
  it('left associativity of - and /', () => {
    expect(fullParen('10 - 4 - 3')).toBe('(10 - 4) - 3');
    expect(fullParen('100 / 10 / 5')).toBe('(100 / 10) / 5');
  });
  it('Rule 3: the unary minus binds stronger', () => {
    expect(fullParen('-3 - 4')).toBe('(-3) - 4');
  });
  it('Rule 4: parentheses override', () => {
    expect(fullParen('(32 + 9) * celsius')).toBe('(32 + 9) * celsius');
  });
  it('assignment is right associative: a = b = c is a = (b = c)', () => {
    expect(fullParen('a = b = c')).toBe('a = (b = c)');
  });
  it('Example 4.8 of the notes', () => {
    expect(fullParen('7 + x < y && y != 3 * z || ! b')).toBe('(((7 + x) < y) && (y != (3 * z))) || (!b)');
  });
  it('&& binds stronger than ||, and a misleading layout does not matter', () => {
    expect(fullParen('a || b && c || d')).toBe('(a || (b && c)) || d');
  });
});

describe('expression trees and evaluation order (notes §3.3)', () => {
  const vars = { celsius: 15 };
  it('Celsius to Fahrenheit: 59, and the order of 9/5*celsius gives 47 (Example 3.1)', () => {
    const first = (r: number[]) => r[0];
    expect(evalWith(buildTree('32 + 9 * celsius / 5'), vars, first).result).toBe(59);
    expect(evalWith(buildTree('32 + 9 / 5 * celsius'), vars, first).result).toBe(47);
  });
  it('a good expression: every valid order gives the same result (a+b)*(a-b)', () => {
    const o = allOutcomes(buildTree('(a + b) * (a - b)'), { a: 5, b: 3 });
    expect(o).toHaveLength(1);
    expect(o[0].result).toBe(16);
  });
  it('a bad expression: a * (a = 2) with a = 1 gives 2 or 4 depending on the order', () => {
    const o = allOutcomes(buildTree('a * (a = 2)'), { a: 1 });
    expect(o.map((x) => x.result).sort()).toEqual([2, 4]);
    const t = buildTree('a * (a = 2)');
    const leftFirst = evalWith(t, { a: 1 }, (r) => Math.min(...r));
    const rightFirst = evalWith(t, { a: 1 }, (r) => Math.max(...r));
    expect(new Set([leftFirst.result, rightFirst.result])).toEqual(new Set([2, 4]));
  });
  it('a = b = 0 sets both variables', () => {
    const o = evalWith(buildTree('a = b = 0'), { a: 7, b: 9 }, (r) => r[0]);
    expect(o.vars).toEqual({ a: 0, b: 0 });
  });
  it('every node is evaluated after its children, whatever the order', () => {
    const t = buildTree('32 + 9 * celsius / 5');
    for (const pick of [(r: number[]) => Math.min(...r), (r: number[]) => Math.max(...r)]) {
      const { order } = evalWith(t, vars, pick);
      for (const n of t.nodes) for (const c of n.children) expect(order.indexOf(c)).toBeLessThan(order.indexOf(n.id));
    }
  });
  it('integer division and modulo as in C++ (truncation, sign of the dividend)', () => {
    const f = (s: string) => evalWith(buildTree(s), {}, (r) => r[0]).result;
    expect([f('5 / 2'), f('-7 / 2'), f('7 % 3'), f('-7 % 3')]).toEqual([2, -3, 1, -1]);
  });
});
