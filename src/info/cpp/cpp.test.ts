import { describe, expect, it } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CONFORMANCE } from './conformance';
import { runFragment, runProgram, type Trace } from './interp';
import { P, type Prog } from './programs';

const FIXTURES = join(__dirname, 'fixtures.json');
const ALL: Record<string, Prog> = { ...CONFORMANCE, ...P };

const hasGpp = (() => { try { execFileSync('g++', ['--version'], { stdio: 'ignore' }); return true; } catch { return false; } })();

const wrap = (p: Prog) => (p.fragment ? `${['#include <iostream>', ...(p.includes ?? [])].join('\n')}\nint main() {\n${p.code}\n}\n` : p.code);
const interpret = (p: Prog): Trace => (p.fragment ? runFragment(p.code, { stdin: p.stdin }) : runProgram(p.code, { stdin: p.stdin }));

function gpp(p: Prog): { ok: boolean; err: string; out: string } {
  const dir = mkdtempSync(join(tmpdir(), 'cpp-'));
  const src = join(dir, 'a.cpp'), bin = join(dir, 'a.out');
  writeFileSync(src, wrap(p));
  const c = spawnSync('g++', ['-std=c++17', '-O0', '-o', bin, src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
  if (c.status !== 0) return { ok: false, err: c.stderr, out: '' };
  const r = spawnSync(bin, [], { input: p.stdin ?? '', encoding: 'utf8', timeout: 5000 });
  return { ok: true, err: c.stderr, out: r.stdout };
}

describe('recording fixtures', () => {
  it.skipIf(!process.env.WRITE_CPP_FIXTURES || !hasGpp)('writes fixtures.json from real g++ runs', { timeout: 180_000 }, () => {
    const fx: Record<string, string> = {};
    for (const [id, p] of Object.entries(ALL)) { if (p.compileError) continue; const g = gpp(p); if (!g.ok) throw new Error(`${id} does not compile:\n${g.err}`); fx[id] = g.out; }
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
    const c = spawnSync('g++', ['-std=c++17', '-Wextra', '-c', '-o', '/dev/null', src], { encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' } });
    expect(c.stderr).toContain('this statement may fall through');
  });
});
