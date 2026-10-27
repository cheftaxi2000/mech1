import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CONFORMANCE } from './conformance';
import { runFragment, runProgram, type Trace } from './interp';
import { P, type Prog } from './programs';
import { MULTIFILE } from './multifile';

const FIXTURES = join(__dirname, 'fixtures.json');
const ALL: Record<string, Prog> = { ...CONFORMANCE, ...P };

const hasGpp = (() => { try { execFileSync('g++', ['--version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

const wrap = (p: Prog) => (p.fragment ? `${['#include <iostream>', ...(p.includes ?? [])].join('\n')}\nint main() {\n${p.code}\n}\n` : p.code);
const interpret = (p: Prog): Trace => (p.fragment ? runFragment(p.code, { stdin: p.stdin }) : runProgram(p.code, { stdin: p.stdin }));

function gpp(p: Prog): { ok: boolean; err: string; out: string } {
  const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
  const src = join(dir, 'a.cpp'), bin = join(dir, 'a.out');
  writeFileSync(src, wrap(p));
  const c = spawnSync('g++', ['-std=c++20', '-O0', '-o', bin, src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
  if (c.status !== 0) return { ok: false, err: c.stderr, out: '' };
  const r = spawnSync(bin, [], { input: p.stdin ?? '', encoding: 'utf8', timeout: 5000 });
  return { ok: true, err: c.stderr, out: r.stdout };
}

describe('recording fixtures', () => {
  it.skipIf(!process.env.WRITE_CPP_FIXTURES || !hasGpp)('writes fixtures.json from real g++ runs', { timeout: 180_000 }, () => {
    const fx: Record<string, string> = {};
    for (const [id, p] of Object.entries(ALL)) { if (p.compileError || p.runtimeError) continue; const g = gpp(p); if (!g.ok) throw new Error(`${id} does not compile:\n${g.err}`); fx[id] = g.out; }
    writeFileSync(FIXTURES, JSON.stringify(fx, null, 1) + '\n');
  });
});

describe('lesson programs behave as their prose says', () => {
  it('Div-Mod identity and (-a)/b = -(a/b) hold for all signs (notes p. 35)', () => {
    for (let a = -9; a <= 9; a++) for (const b of [-5, -3, -2, -1, 1, 2, 3, 5]) {
      const t = runFragment(`int a = ${a}; int b = ${b}; std::cout << (a / b) * b + a % b << " " << ((-a) / b == -(a / b));`);
      expect(t.stdout).toBe(`${a} 1`);
    }
  });
  it('the messy and the tidy version of the first program do the same (notes p. 19)', () => {
    expect(interpret(P.power8Messy).stdout).toBe(interpret(P.power8).stdout);
  });
  it('the variable version computes the same as the reused-variable version (notes p. 26)', () => {
    expect(interpret(P.power8Vars).stdout).toBe(interpret(P.power8).stdout);
  });
  it('the broken swap leaves both variables equal, the three-box swap works', () => {
    expect(interpret(P.swapWrong).stdout).toBe('2 2');
    expect(interpret(P.swapRight).stdout).toBe('2 1');
  });
  it('an uninitialized read is flagged as undefined behavior in the trace', () => {
    expect(interpret(P.uninit).snaps.some((s) => s.ev?.kind === 'ub')).toBe(true);
  });
});

describe('interpreter = recorded g++ output', () => {
  const fx: Record<string, string> = existsSync(FIXTURES) ? JSON.parse(readFileSync(FIXTURES, 'utf8')) : {};
  for (const [id, p] of Object.entries(ALL)) {
    if (p.compileError || p.runtimeError) continue;
    it(id, () => {
      expect(fx[id], `no fixture for ${id} – run WRITE_CPP_FIXTURES=1 npx vitest run src/info/cpp`).toBeDefined();
      const t = interpret(p);
      expect(t.error).toBeUndefined();
      expect(t.stdout).toBe(fx[id]);
    });
  }
});

describe.skipIf(!hasGpp)('fixtures are still what g++ prints', () => {
  const fx: Record<string, string> = existsSync(FIXTURES) ? JSON.parse(readFileSync(FIXTURES, 'utf8')) : {};
  for (const [id, p] of Object.entries(ALL)) {
    if (p.compileError) {
      it(`${id} is rejected by the compiler (${p.compileError})`, () => { const g = gpp(p); expect(g.ok).toBe(false); expect(g.err).toContain(p.compileError!); });
    } else if (!p.runtimeError) {
      it(id, () => { const g = gpp(p); expect(g.ok, g.err).toBe(true); expect(g.out).toBe(fx[id]); });
    }
  }
});

describe('chapter 3 claims (notes pp. 49–70)', () => {
  const out = (code: string, stdin = '') => runFragment(code, { stdin }).stdout;
  it('the three ways to print the odd numbers print the same (p. 67–68)', () => {
    const a = out(P.oddContinue.code), b = out(P.oddNegated.code), c = out(P.oddStep.code);
    expect(a).toBe(b); expect(b).toBe(c);
    expect(a.trim().split('\n').length).toBe(50);
  });
  it('Collatz from 27: 111 steps, maximum 9232, the list printed in the notes (p. 59)', () => {
    const seq = out(P.collatz.code, '27\n').trim().split(' ').map(Number);
    expect(seq.length).toBe(111);
    expect(seq.slice(0, 4)).toEqual([82, 41, 124, 62]);
    expect(Math.max(...seq)).toBe(9232);
    expect(seq.at(-1)).toBe(1);
    expect(out(P.collatzFor.code, '27\n')).toBe(out(P.collatz.code, '27\n'));
  });
  it('Collatz overflows int for 113383 (peak 2 482 111 348 > 2^31 - 1)', () => {
    let n = 113383n, peak = n;
    while (n !== 1n) { n = n % 2n === 0n ? n / 2n : 3n * n + 1n; if (n > peak) peak = n; }
    expect(peak).toBe(2482111348n);
    expect(peak > 2147483647n).toBe(true);
  });
  it('for-loop with n = 2 visits i = 1, 2, 3 and ends with s = 3 (the table on p. 52 prints i=2, s=1 in its last row)', () => {
    const t = runFragment(P.forSumN2.code);
    const last = t.snaps[t.snaps.length - 1];
    expect(last).toBeDefined();
    expect(runFragment(`${P.forSumN2.code}\nstd::cout << s;`).stdout).toBe('3');
  });
  it('the prime-test loop ends with d == n exactly for primes (2 ≤ n ≤ 60)', () => {
    for (let n = 2; n <= 60; n++) {
      const o = out(P.primeTest.code, `${n}\n`);
      const prime = Array.from({ length: n - 2 }, (_, k) => k + 2).every((d) => n % d !== 0);
      expect(o.endsWith('is prime')).toBe(prime);
    }
  });
  it.skipIf(!hasGpp)('g++ warns about the missing break with -Wimplicit-fallthrough', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    const src = join(dir, 'a.cpp');
    writeFileSync(src, wrap(P.switchNoBreak));
    const c = spawnSync('g++', ['-std=c++20', '-Wextra', '-c', '-o', '/dev/null', src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    expect(c.stderr).toContain('this statement may fall through');
  });
});

describe('chapter 4 claims (notes pp. 71–96)', () => {
  const run = (p: Prog) => runProgram(p.code, { stdin: p.stdin });
  it('Code 6.1 prints 0.25, 2.25, -512', () => { expect(run(P.powFn).stdout).toBe('0.25\n2.25\n-512\n'); });
  it('Example 6.7: the call does not change b and e in main', () => { expect(run(P.scopeParams).stdout).toBe('0.25 2 -2'); });
  it('a failing assert halts the program with the expression in the message', () => {
    const t = run(P.assertPow);
    expect(t.error?.msg).toBe("Assertion `e >= 0 || b != 0.0' failed.");
  });
  it('the three versions of compare agree, also on the border (delta² < 0.001)', () => {
    expect(run(P.compareFull).stdout).toBe(run(P.compareShort).stdout);
    expect(run(P.compareFull).stdout).toBe('01');
  });
  it('intervals_overlap is exactly "closed intervals share a point" (all endpoints in -2..2)', () => {
    const body = `
      for (int a1 = -2; a1 <= 2; ++a1) for (int b1 = -2; b1 <= 2; ++b1)
      for (int a2 = -2; a2 <= 2; ++a2) for (int b2 = -2; b2 <= 2; ++b2) {
        bool brute = false;
        for (int p = -2; p <= 2; ++p)
          if (std::min(a1,b1) <= p && p <= std::max(a1,b1) && std::min(a2,b2) <= p && p <= std::max(a2,b2)) brute = true;
        if (brute != intervals_overlap(a1,b1,a2,b2)) ++bad;
      }`;
    const src = P.rectFinal.code.replace(/int main\(\) \{[\s\S]*$/, `int main() {\n  int bad = 0;${body}\n  std::cout << bad;\n  return 0;\n}`);
    expect(runProgram(src, { maxSnaps: 2_000_000 }).stdout).toBe('0');
    if (hasGpp) { const g = gpp({ code: src }); expect(g.ok, g.err).toBe(true); expect(g.out).toBe('0'); }
  });
  it('touching rectangles overlap, separated ones do not, negative sizes work', () => {
    const o = (s: string) => runProgram(P.rectFinal.code, { stdin: s }).stdout.split('\n')[1];
    expect(o('0 0 1 1 1 0 1 1\n')).toBe('overlap!');
    expect(o('0 0 1 1 5 5 1 1\n')).toBe('no overlap!');
    expect(o('2 2 -2 -2 0 0 1 1\n')).toBe('overlap!');
    expect(o('0 0 2 2 1 1 2 2\n')).toBe('overlap!');
  });
  it('the sqrt bound makes the prime test about 1000 times shorter for n = 1 000 003 (a prime)', () => {
    const n = 1_000_003;
    let simple = 0; for (let d = 2; ; d++) { simple++; if (n % d === 0) break; }
    const bound = Math.floor(Math.sqrt(n));
    let fast = 0, d = 2; while (d <= bound && n % d !== 0) { fast++; d++; }
    expect(simple).toBe(n - 1); // checks d = 2 … n
    expect(fast).toBe(bound - 1); // checks d = 2 … floor(sqrt n)
    expect(bound).toBe(1000);
  });
  it('both prime tests list the primes up to 30; sqrt is exact for all perfect squares of int range', () => {
    expect(run(P.isPrimeSimple).stdout).toBe('2 3 5 7 11 13 17 19 23 29 ');
    expect(run(P.isPrimeSqrt).stdout).toBe(run(P.isPrimeSimple).stdout);
    for (let k = 2; k <= 46340; k++) expect(Math.floor(Math.sqrt(k * k))).toBe(k);
  });
  it('pow(10.0, 400) overflows to inf, pow(10.0, -400) underflows to 0 (limits of correctness)', () => {
    expect(run(P.powLimits).stdout).toBe('inf 0 1e+15 2.59374');
  });
  it.skipIf(!hasGpp)('-DNDEBUG removes the assert: pow(0.0, -1) then silently yields inf', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    const src = join(dir, 'a.cpp'), bin = join(dir, 'a.out');
    writeFileSync(src, P.assertPow.code);
    expect(spawnSync('g++', ['-std=c++20', '-DNDEBUG', '-o', bin, src]).status).toBe(0);
    expect(spawnSync(bin, [], { encoding: 'utf8' }).stdout).toBe('inf');
  });
  it.skipIf(!hasGpp)('g++ -Wall warns: control reaches end of non-void function (Example 6.9)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    const src = join(dir, 'a.cpp');
    writeFileSync(src, P.compareBad.code);
    const c = spawnSync('g++', ['-std=c++20', '-Wall', '-c', '-o', '/dev/null', src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    expect(c.stderr).toContain('control reaches end of non-void function');
  });
  it.skipIf(!hasGpp)('separate compilation: include, forward declaration + linker, header file (Codes 6.5–6.9)', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    for (const [name, text] of Object.entries(MULTIFILE)) writeFileSync(join(dir, name), text + '\n');
    const sh = (args: string[]) => spawnSync('g++', ['-std=c++20', ...args], { cwd: dir, encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    const exe = (name: string) => spawnSync(join(dir, name), [], { encoding: 'utf8' }).stdout;
    // 1. include the source file
    expect(sh(['callpow2.cpp', '-o', 'callpow2']).status).toBe(0);
    expect(exe('callpow2')).toBe('0.25\n2.25\n5\n-512\n');
    // 2. forward declaration alone: the linker misses pow
    const noLib = sh(['callpow3.cpp', '-o', 'callpow3']);
    expect(noLib.status).not.toBe(0);
    expect(noLib.stderr).toContain("undefined reference to `pow(double, int)'");
    // 3. compile separately, then link
    expect(sh(['-c', 'mymath.cpp']).status).toBe(0);
    expect(sh(['-c', 'callpow3.cpp']).status).toBe(0);
    expect(sh(['mymath.o', 'callpow3.o', '-o', 'callpow3']).status).toBe(0);
    expect(exe('callpow3')).toBe('0.25\n');
    // 3b. defining a function in two files: the linker complains
    writeFileSync(join(dir, 'dup1.cpp'), 'int f() { return 1; }\nint main() { return f(); }\n');
    writeFileSync(join(dir, 'dup2.cpp'), 'int f() { return 2; }\n');
    const dup = sh(['dup1.cpp', 'dup2.cpp', '-o', 'dup']);
    expect(dup.status).not.toBe(0);
    expect(dup.stderr).toContain('multiple definition of `f()');
    // 4. header file
    expect(sh(['-c', 'callpow4.cpp']).status).toBe(0);
    expect(sh(['mymath.o', 'callpow4.o', '-o', 'callpow4']).status).toBe(0);
    expect(exe('callpow4')).toBe('0.25\n2.25\n5\n-512\n');
  });
});

describe('chapter 5 claims (notes pp. 97–113), checked with g++', () => {
  const build = (code: string, flags: string[] = []) => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    const src = join(dir, 'a.cpp'), bin = join(dir, 'a.out');
    writeFileSync(src, code);
    const c = spawnSync('g++', ['-std=c++20', ...flags, '-o', bin, src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    return { c, run: () => spawnSync(bin, [], { encoding: 'utf8' }) };
  };
  it.skipIf(!hasGpp)('a.size() - 4 wraps around to 2^64 - 1 (size_t is unsigned, 64 bit)', () => {
    const b = build('#include <iostream>\n#include <vector>\nint main() { std::vector<int> a{1,2,3}; std::cout << a.size() - 4; }');
    expect(b.c.status).toBe(0);
    expect(b.run().stdout).toBe('18446744073709551615');
  });
  it.skipIf(!hasGpp)('v.at(10) throws std::out_of_range (the program aborts)', () => {
    const b = build(`#include <iostream>\n#include <vector>\nint main() {\n${P.vecAt.code}\n}`);
    const r = b.run();
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('std::out_of_range');
    expect(r.stderr).toContain('which is 10) >= this->size() (which is 10)');
  });
  it.skipIf(!hasGpp)('-D_GLIBCXX_DEBUG makes v[10] a detected error', () => {
    const b = build(`#include <vector>\nint main() {\n${P.vecOutOfBounds.code}\n}`, ['-D_GLIBCXX_DEBUG', '-D_GLIBCXX_DEBUG_PEDANTIC']);
    const r = b.run();
    expect(r.status).not.toBe(0);
    expect(r.stderr).toContain('attempt to subscript container with out-of-bounds index 10');
  });
  it.skipIf(!hasGpp)('g++ -Wall warns about returning a reference to a local variable', () => {
    const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
    const src = join(dir, 'a.cpp');
    writeFileSync(src, P.dangling.code);
    const c = spawnSync('g++', ['-std=c++20', '-Wall', '-c', '-o', '/dev/null', src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    expect(c.stderr).toContain("reference to local variable 'i' returned");
  });
  it('the sieve prints exactly the primes below n (n up to 120)', () => {
    for (const n of [2, 3, 24, 120]) {
      const out = runProgram(P.sieve.code, { stdin: `${n}\n`, maxSnaps: 400000 }).stdout.split('\n')[1].trim();
      const primes = Array.from({ length: Math.max(0, n - 2) }, (_, k) => k + 2).filter((m) => Array.from({ length: m - 2 }, (_, d) => d + 2).every((d) => m % d !== 0));
      expect(out).toBe(primes.join(' '));
    }
  });
  it('the three corrected loops print 012 each; the broken one runs on past the size', () => {
    expect(runFragment(P.sizeFixed.code).stdout).toBe('012 012 012');
    expect(runFragment(P.sizeUnsigned.code).stdout).toBe('012345');
    expect(runFragment(P.sizeCompare.code).stdout).toBe('1 0');
  });
  it('a vector is copied when passed by value, shared when passed by reference', () => {
    expect(runProgram(P.vecByValue.code).stdout).toBe('1 99');
  });
  it('lower triangle sum of 1..9 is 4 + 7 + 8 = 19; average of the temperatures is 9.7', () => {
    expect(runProgram(P.lowerTriangle.code).stdout).toBe('19');
    expect(runProgram(P.averageConstRef.code).stdout).toBe('9.7');
    const t = [0.9, 1.3, 5.1, 9.1, 13.2, 17.1, 18.8, 18.6, 14.7, 10.6, 5.2, 1.8];
    expect(t.reduce((a, b) => a + b, 0) / t.length).toBeCloseTo(9.7, 10);
  });
  it.skipIf(!hasGpp)('rows of a vector of vectors are separate blocks: &m[1][0] - &m[0][0] is not 3 (the notes draw the memory as one flat strip)', () => {
    const b = build('#include <iostream>\n#include <vector>\nint main() { std::vector<std::vector<int>> m(2, std::vector<int>(3, 1)); std::cout << (&m[1][0] - &m[0][0]) << " " << (&m[0][1] - &m[0][0]); }');
    expect(b.c.status).toBe(0);
    const [rowGap, inRow] = b.run().stdout.split(' ');
    expect(inRow).toBe('1'); // inside one row the elements are adjacent
    expect(rowGap).not.toBe('3'); // between rows there is a gap (allocator bookkeeping)
  });
});
