import type { Trace } from './cpp/interp';

/** Recursion (notes Section 10): counts and the call tree, as pure functions. */

/** Number of calls `fib(n)` makes in total (including itself): 1 for n ≤ 1, else 1 + calls(n−1) + calls(n−2) = 2·F(n+1) − 1. */
export function fibCalls(n: number): bigint {
  let a = 1n, b = 1n; // calls(0), calls(1)
  if (n <= 1) return 1n;
  for (let i = 2; i <= n; i++) [a, b] = [b, 1n + a + b];
  return b;
}

/** The Fibonacci number F(n), exact. */
export function fib(n: number): bigint {
  let a = 0n, b = 1n;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
}

/** How often the call `fib(k)` happens while computing `fib(n)` (k ≥ 1): it is F(n − k + 1). */
export const fibMultiplicity = (n: number, k: number): bigint => (k > n ? 0n : k === n ? 1n : fib(n - k + 1));

/** Most calls active at the same time when `sum(v, from)` (decrease and conquer) is applied to a vector of length n. */
export const decreaseDepth = (n: number) => n + 1;

/** Same for the halving version `sum(v, from, to)`: ⌈log₂ n⌉ + 1 for n ≥ 1. */
export const divideDepth = (n: number) => (n <= 1 ? 1 : Math.ceil(Math.log2(n)) + 1);

/** One call of the call tree. */
export interface CallNode {
  id: number;
  label: string;
  value?: string;
  children: CallNode[];
  /** index of the snapshot at which the call happens / returns */
  from: number;
  to?: number;
  depth: number;
}

/**
 * The call tree of a trace, from the `call` and `returned` events the interpreter records between two steps (several can happen between
 * two steps, e.g. a return followed by the next call of `fib(n-1) + fib(n-2)`). The call of `main` itself is left out.
 */
export function callTree(trace: Trace): CallNode[] {
  const roots: CallNode[] = [];
  const stack: CallNode[] = [];
  let id = 0;
  trace.snaps.forEach((s, i) => {
    for (const ev of s.flow ?? []) {
      if (ev.kind === 'call') {
        const node: CallNode = { id: id++, label: `${ev.name}(${ev.args.join(', ')})`, children: [], from: i, depth: stack.length };
        (stack.length ? stack[stack.length - 1].children : roots).push(node);
        stack.push(node);
      } else if (ev.kind === 'returned') {
        const node = stack.pop();
        if (node) { node.value = ev.value; node.to = i; }
      }
    }
  });
  return roots;
}

export const treeSize = (nodes: CallNode[]): number => nodes.reduce((a, n) => a + 1 + treeSize(n.children), 0);
