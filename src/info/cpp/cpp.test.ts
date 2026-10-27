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
