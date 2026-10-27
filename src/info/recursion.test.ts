import { describe, expect, it } from 'vitest';
import { runProgram } from './cpp/interp';
import { P } from './cpp/programs';
import { callTree, decreaseDepth, divideDepth, fib, fibCalls, fibMultiplicity, treeSize } from './recursion';

const maxDepth = (code: string) => Math.max(...runProgram(code, { maxSnaps: 400000 }).snaps.map((s) => s.frames.length));

describe('recursion model', () => {
  it('fib(10) makes 177 calls = 2·F(11) − 1, as counted by the C++ program', () => {
    expect(fibCalls(10)).toBe(177n);
    expect(fibCalls(10)).toBe(2n * fib(11) - 1n);
    expect(runProgram(P.fibCount.code, { maxSnaps: 400000 }).stdout).toBe('55 177');
  });
  it('the notes: fib(50) calls F48 twice, F47 three times, F46 five times … and F1 about 1.3·10^10 times (not 10^9)', () => {
    expect([48, 47, 46, 45, 44, 43].map((k) => fibMultiplicity(50, k))).toEqual([2n, 3n, 5n, 8n, 13n, 21n]);
    expect(fibMultiplicity(50, 1)).toBe(12586269025n);
    expect(fibCalls(50)).toBe(40730022147n);
  });
  it('multiplicities by brute force (n = 14)', () => {
    const count = new Map<number, bigint>();
    const go = (n: number) => { count.set(n, (count.get(n) ?? 0n) + 1n); if (n > 1) { go(n - 1); go(n - 2); } };
    go(14);
    for (let k = 1; k <= 14; k++) expect(count.get(k)).toBe(fibMultiplicity(14, k));
  });
  it('int overflows in the iterative Fibonacci already at F47 (the notes compute F50)', () => {
    expect(fib(46)).toBe(1836311903n);
    expect(fib(47) > 2147483647n).toBe(true);
    expect(fib(46) <= 2147483647n).toBe(true);
    expect(runProgram(P.fibIter.code).stdout).toBe('55 1836311903');
  });
  it('13! overflows int; 12! does not', () => {
    const f = (n: number) => { let r = 1n; for (let i = 2; i <= n; i++) r *= BigInt(i); return r; };
    expect(f(12)).toBe(479001600n);
    expect(f(13) > 2147483647n).toBe(true);
    expect(BigInt.asIntN(32, f(13))).toBe(1932053504n);
  });
  it('recursion depth: decrease and conquer needs n + 1 calls, divide and conquer ⌈log₂ n⌉ + 1 (plus main)', () => {
    for (let n = 1; n <= 10; n++) {
      const list = `{${Array.from({ length: n }, (_, i) => i + 1).join(', ')}}`;
      const dec = P.sumDecrease.code.replace('{-1, 4, 6, 7}', list);
      const div = P.sumDivide.code.replace('{-1, 4, 6, 7}', list).replace(', 0, 3)', `, 0, ${n - 1})`);
      expect(maxDepth(dec) - 1).toBe(decreaseDepth(n));
      expect(maxDepth(div) - 1).toBe(divideDepth(n));
    }
  });
  it('all three sums give 16 for {-1, 4, 6, 7}', () => {
    for (const p of [P.sumLoop, P.sumDecrease, P.sumDivide]) expect(runProgram(p.code).stdout).toBe('16');
  });
  it('the call tree of fib(4) has 9 calls; of fac(4) a chain of 4', () => {
    expect(treeSize(callTree(runProgram(P.fibRec.code)))).toBe(9);
    const fac = callTree(runProgram(P.facRec.code));
    expect(treeSize(fac)).toBe(4);
    expect(fac[0].value).toBe('24');
  });
  it('gcd(21, 13) makes 7 calls; gcd(48, 18) makes 4 (the chain of the lesson)', () => {
    const calls = (a: number, b: number) => treeSize(callTree(runProgram(P.gcdRec.code.replace('std::cout << gcd(48, 18) << " " << gcd(7, 0);', `std::cout << gcd(${a}, ${b});`))));
    expect(calls(21, 13)).toBe(7);
    expect(calls(48, 18)).toBe(4);
  });
  it('fac(4) = 24, gcd(48, 18) = 6, bit strings come in order', () => {
    expect(runProgram(P.facRec.code).stdout).toBe('24');
    expect(runProgram(P.gcdRec.code).stdout).toBe('6 7');
    expect(runProgram(P.bitStrings.code, { maxSnaps: 400000 }).stdout).toBe('000\n001\n010\n011\n100\n101\n110\n111\n');
    expect(runProgram(P.bitStringsRef.code, { maxSnaps: 400000 }).stdout).toBe(runProgram(P.bitStrings.code, { maxSnaps: 400000 }).stdout);
  });
});
