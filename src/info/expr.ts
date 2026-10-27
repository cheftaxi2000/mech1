import type { Expr } from './cpp/ast';
import { parseExpression } from './cpp/parser';

/**
 * Expression trees (notes §3.3): the parenthesization C++ applies, the tree, and every valid evaluation order.
 * Integer semantics only (`/` truncates, `%` keeps the sign of the dividend), which is what the notes' examples need.
 */
export { parseExpression };

const wrap = (e: Expr, top = false): string => {
  const p = (x: string) => (top ? x : `(${x})`);
  switch (e.k) {
    case 'num': case 'id': case 'bool': case 'char': case 'str': return e.src;
    case 'unary': return p(`${e.op}${wrap(e.e)}`);
    case 'postfix': return p(`${wrap(e.e)}${e.op}`);
    case 'binary': return p(`${wrap(e.l)} ${e.op} ${wrap(e.r)}`);
    case 'assign': return p(`${wrap(e.l)} ${e.op} ${wrap(e.r)}`);
    case 'cond': return p(`${wrap(e.c)} ? ${wrap(e.a)} : ${wrap(e.b)}`);
    case 'cast': return p(e.src);
    default: return e.src;
  }
};

/** The expression with every parenthesis the compiler implicitly uses; the outermost pair is left out. */
export function fullParen(src: string): string { return wrap(parseExpression(src), true); }

export interface TNode {
  id: number;
  label: string;
  kind: 'num' | 'var' | 'lvalue' | 'op';
  op?: string;
  children: number[];
  depth: number;
  /** horizontal position in "leaf units" (0 … leaves−1), for drawing */
  x: number;
}
export interface Tree { nodes: TNode[]; root: number }

export function buildTree(src: string): Tree {
  const e = parseExpression(src);
  const nodes: TNode[] = [];
  let leaf = 0;
  const go = (x: Expr, depth: number, lvalue = false): number => {
    const id = nodes.length;
    const node: TNode = { id, label: '', kind: 'op', children: [], depth, x: 0 };
    nodes.push(node);
    switch (x.k) {
      case 'num': node.kind = 'num'; node.label = x.src; node.x = leaf++; break;
      case 'id': node.kind = lvalue ? 'lvalue' : 'var'; node.label = x.name; node.x = leaf++; break;
      case 'unary': node.label = x.op; node.op = `u${x.op}`; node.children = [go(x.e, depth + 1)]; break;
      case 'binary': node.label = x.op; node.op = x.op; node.children = [go(x.l, depth + 1), go(x.r, depth + 1)]; break;
      case 'assign': node.label = x.op; node.op = x.op; node.children = [go(x.l, depth + 1, true), go(x.r, depth + 1)]; break;
      default: throw new Error(`expression tree: unsupported node ${x.k}`);
    }
    if (node.children.length) node.x = node.children.reduce((s, c) => s + nodes[c].x, 0) / node.children.length;
    return id;
  };
  const root = go(e, 0);
  return { nodes, root };
}

export interface EvalState {
  vars: Record<string, number>;
  values: (number | undefined)[];
  error?: string;
}

export const start = (t: Tree, vars: Record<string, number>): EvalState => ({
  vars: { ...vars },
  // an assignment target is a place, not a value: it needs no evaluation
  values: t.nodes.map((n) => (n.kind === 'lvalue' ? NaN : undefined)),
});

/** Nodes that may be evaluated next: not yet evaluated, all operands evaluated (leaves always qualify). */
export function ready(t: Tree, s: EvalState): number[] {
  if (s.error) return [];
  return t.nodes.filter((n) => s.values[n.id] === undefined && n.children.every((c) => s.values[c] !== undefined)).map((n) => n.id);
}

export function evalNode(t: Tree, s: EvalState, id: number): EvalState {
  const n = t.nodes[id];
  const out: EvalState = { vars: { ...s.vars }, values: [...s.values] };
  const v = (c: number) => s.values[c] as number;
  switch (n.kind) {
    case 'num': out.values[id] = Number(n.label); break;
    case 'var': out.values[id] = s.vars[n.label] ?? 0; break;
    case 'lvalue': break;
    case 'op': {
      if (n.op === 'u-') out.values[id] = -v(n.children[0]);
      else if (n.op === 'u+') out.values[id] = v(n.children[0]);
      else if (n.op === '=') { const name = t.nodes[n.children[0]].label; out.vars[name] = v(n.children[1]); out.values[id] = v(n.children[1]); }
      else {
        const a = v(n.children[0]), b = v(n.children[1]);
        if ((n.op === '/' || n.op === '%') && b === 0) { out.error = 'division by zero'; return out; }
        out.values[id] = n.op === '+' ? a + b : n.op === '-' ? a - b : n.op === '*' ? a * b : n.op === '/' ? Math.trunc(a / b) : n.op === '%' ? a % b : NaN;
      }
    }
  }
  return out;
}

export interface Outcome { result: number | undefined; vars: Record<string, number>; order: number[]; error?: string }

/** Evaluate with a chosen strategy for picking among the ready nodes. */
export function evalWith(t: Tree, vars: Record<string, number>, pick: (ready: number[]) => number): Outcome {
  let s = start(t, vars);
  const order: number[] = [];
  for (let r = ready(t, s); r.length; r = ready(t, s)) { const id = pick(r); order.push(id); s = evalNode(t, s, id); }
  return { result: s.values[t.root], vars: s.vars, order, error: s.error };
}

/** All distinct (result, final variables) pairs over every valid evaluation order. */
export function allOutcomes(t: Tree, vars: Record<string, number>, limit = 20000): { result: number | undefined; vars: Record<string, number> }[] {
  const seen = new Map<string, { result: number | undefined; vars: Record<string, number> }>();
  let count = 0;
  const go = (s: EvalState) => {
    if (count++ > limit) return;
    const r = ready(t, s);
    if (!r.length) { const key = JSON.stringify([s.values[t.root], s.vars, s.error]); if (!s.error) seen.set(key, { result: s.values[t.root], vars: s.vars }); return; }
    for (const id of r) go(evalNode(t, s, id));
  };
  go(start(t, vars));
  return [...seen.values()];
}
