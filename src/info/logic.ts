import type { Expr } from './cpp/ast';
import { parseExpression } from './cpp/parser';

/** Boolean expressions over named variables (notes §4.3): truth tables, equivalence, and the construction from the completeness proof. */
export function evalBool(e: Expr, env: Record<string, boolean>): boolean {
  switch (e.k) {
    case 'bool': return e.v;
    case 'num': return e.v !== 0;
    case 'id': if (!(e.name in env)) throw new Error(`unknown variable ${e.name}`); return env[e.name];
    case 'unary': if (e.op === '!') return !evalBool(e.e, env); break;
    case 'binary': {
      const l = () => evalBool(e.l, env), r = () => evalBool(e.r, env);
      if (e.op === '&&') return l() && r();   // short circuit, like C++
      if (e.op === '||') return l() || r();
      if (e.op === '==') return l() === r();
      if (e.op === '!=') return l() !== r();
      break;
    }
  }
  throw new Error(`unsupported in a boolean expression: ${e.src}`);
}

/** The values of `src` for (x, y) = (0,0), (0,1), (1,0), (1,1) – the notes' "characteristic vector". */
export function vector(src: string): boolean[] {
  const e = parseExpression(src);
  return [0, 1, 2, 3].map((i) => evalBool(e, { x: !!(i >> 1), y: !!(i & 1) }));
}

export const vectorString = (v: boolean[]) => v.map((b) => (b ? '1' : '0')).join('');
export const equivalent = (a: string, b: string) => vectorString(vector(a)) === vectorString(vector(b));

/** The formula built exactly as in the proof of Theorem 4.1: OR over the fundamental functions of all true rows; f0000 = x && !x. */
export function dnf(v: boolean[]): string {
  const terms = v.flatMap((b, i) => (b ? [`${i >> 1 ? 'x' : '!x'} && ${i & 1 ? 'y' : '!y'}`] : []));
  return terms.length ? terms.map((t) => (terms.length > 1 ? `(${t})` : t)).join(' || ') : 'x && !x';
}
