import { describe, expect, it } from 'vitest';
import { ADDR_A, ADDR_B, PROGRAM, initial, pseudoLine, runTrace, step } from './boxcomputer';
import { euclid, subtractions } from './euclid';

describe('box computer (notes p. 11–12)', () => {
  it('starts as in Fig. 1.3: instructions in 0–7, b in box 8, a in box 9, empty registers, pc = 0', () => {
    const s = initial(12, 8);
    expect(s.mem.slice(0, 8)).toEqual(PROGRAM);
    expect(s.mem[ADDR_B]).toBe(8);
    expect(s.mem[ADDR_A]).toBe(12);
    expect([s.L, s.R, s.pc, s.halted, s.steps]).toEqual([null, null, 0, false, 0]);
  });

  it('the notes\' experiment 12, 8: first instructions copy 8 → L and 12 → R, then jump to 6 because R > L', () => {
    let s = initial(12, 8);
    s = step(s); expect([s.L, s.R, s.pc]).toEqual([8, null, 1]);
    s = step(s); expect([s.L, s.R, s.pc]).toEqual([8, 12, 2]);
    s = step(s); expect([s.pc, s.halted]).toEqual([3, false]); // L ≠ R, no stop
    s = step(s); expect(s.pc).toBe(6);                          // R > L → jump to 6
    s = step(s); expect([s.mem[ADDR_A], s.wrote]).toEqual([4, 9]); // a ← 12 − 8
    s = step(s); expect(s.pc).toBe(0);                          // jump 0
  });

  it('computes the greatest common divisor for all pairs 1..40, result in R and in both data boxes', () => {
    for (let a = 1; a <= 40; a++) for (let b = 1; b <= 40; b++) {
      const end = runTrace(a, b).at(-1)!;
      expect(end.halted).toBe(true);
      expect(end.R).toBe(euclid(a, b));
      expect(end.mem[ADDR_A]).toBe(euclid(a, b));
      expect(end.mem[ADDR_B]).toBe(euclid(a, b));
    }
  });

  it('every subtraction costs exactly 6 instructions, the final check 3: steps = 6·k + 3', () => {
    for (const [a, b] of [[12, 8], [8, 12], [100, 3], [7, 7], [60, 7]]) {
      expect(runTrace(a, b).at(-1)!.steps).toBe(6 * subtractions(a, b) + 3);
    }
  });

  it('a halted machine does not move; the box values follow the algorithm line by line', () => {
    const end = runTrace(12, 8).at(-1)!;
    expect(step(end)).toBe(end);
    expect(end.pc).toBe(2);
  });

  it('the data boxes only ever change through store instructions, instruction boxes never change', () => {
    const tr = runTrace(35, 14);
    for (const s of tr) expect(s.mem.slice(0, 8)).toEqual(PROGRAM);
    // box 8 and 9 change exactly when `wrote` is set
    for (let i = 1; i < tr.length; i++) {
      const changed = [8, 9].filter((k) => tr[i].mem[k] !== tr[i - 1].mem[k]);
      expect(changed).toEqual(tr[i].wrote === null ? [] : [tr[i].wrote]);
    }
  });

  it('every instruction belongs to a pseudo-code line', () => {
    expect(PROGRAM.map((_, pc) => pseudoLine(pc))).toEqual([0, 0, 0, 1, 4, 4, 2, 2]);
    expect(pseudoLine(2, true)).toBe(7);
  });

  it('rejects non-positive input', () => {
    expect(() => initial(0, 3)).toThrow();
  });
});
