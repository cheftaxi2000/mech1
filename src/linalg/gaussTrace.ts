import { ONE, ZERO, add, div, eq, isZero, mul, neg, q, tex, type Q } from './frac';
import { eliminate, reduce, solve, type Mat, type Op, type Solution } from './gauss';

/**
 * Everything the Gauss lessons draw, computed once and tested here (Übung 2, slides 25–36; Übung 4, slides 5–11):
 * the row operations as the TA writes them («II − I», «III − 2·I»), the elimination as a list of frames
 * (matrix, circled pivot, red multiples, notes), back substitution with free parameters, and the solution set in TeX.
 */

export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const R = (i: number) => `\\mathrm{${ROMAN[i]}}`;
const absTex = (a: Q) => (a[1] === 1 ? String(Math.abs(a[0])) : `\\frac{${Math.abs(a[0])}}{${a[1]}}`);

/** A row operation in the TA's notation: `II − I`, `III − 2·I`, `1/3·III`, `I ↔ II`. */
export function opTex(op: Op): string {
  if (op.kind === 'swap') return `${R(op.i)} \\leftrightarrow ${R(op.j)}`;
  if (op.kind === 'scale') return `${tex(op.factor)}\\cdot ${R(op.row)}`;
  const one = op.factor[0] === 1 && op.factor[1] === 1 || op.factor[0] === -1 && op.factor[1] === 1;
  return `${R(op.target)} ${op.factor[0] < 0 ? '-' : '+'} ${one ? '' : `${absTex(op.factor)}\\cdot `}${R(op.source)}`;
}

/** The first non-zero column (within `nVars`) of a row, or −1. */
export const lead = (row: readonly Q[], nVars: number) => row.slice(0, nVars).findIndex((x) => !isZero(x));

// ---------------------------------------------------------------- linear forms in the free parameters

/** const + Σ p_k · (parameter k): a solution entry such as (5 − 4β)/3. */
export interface Lin { c: Q; p: Q[] }
export const PARAMS = ['\\alpha', '\\beta', '\\gamma', '\\delta'];
const linAdd = (a: Lin, b: Lin): Lin => ({ c: add(a.c, b.c), p: a.p.map((x, k) => add(x, b.p[k])) });
const linScale = (a: Lin, f: Q): Lin => ({ c: mul(a.c, f), p: a.p.map((x) => mul(x, f)) });
const isConst = (a: Lin) => a.p.every(isZero);
const lcm = (a: number, b: number): number => { const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y)); return (a / g(a, b)) * b; };

/** TeX of a linear form with one common denominator: `\frac{5-4\beta}{3}`, `-\alpha`, `7`. */
export function linTex(l: Lin, names: string[] = PARAMS): string {
  let D = l.c[1];
  for (const x of l.p) D = lcm(D, x[1]);
  const parts: { n: number; sym: string }[] = [{ n: (l.c[0] * D) / l.c[1], sym: '' }, ...l.p.map((x, k) => ({ n: (x[0] * D) / x[1], sym: names[k] }))];
  let s = '';
  for (const { n, sym } of parts) {
    if (n === 0) continue;
    const mag = Math.abs(n) === 1 && sym ? '' : String(Math.abs(n));
    s += (n < 0 ? '-' : s ? '+' : '') + mag + sym;
  }
  if (!s) return '0';
  return D === 1 ? s : `\\frac{${s}}{${D}}`;
}

/** The solution vector of `solve()` as one linear form per entry (free variable k ↦ parameter k). */
export function solutionForms(sol: Solution): Lin[] {
  const P = sol.particular!, D = sol.dirs ?? [];
  return P.map((c, i) => ({ c, p: D.map((d) => d[i]) }));
}

/** `L = {…}` as TeX: a column vector with parameters (α, β, …), a single vector, or the empty set. */
export function solutionSetTex(sol: Solution): string {
  if (sol.kind === 'none') return 'L = \\varnothing';
  const col = (xs: string[]) => `\\begin{pmatrix}${xs.join('\\\\')}\\end{pmatrix}`;
  const forms = solutionForms(sol).map((l) => linTex(l));
  if (sol.kind === 'unique') return `L = \\left\\{ ${col(forms)} \\right\\}`;
  const names = PARAMS.slice(0, sol.freeCols.length).join(',');
  return `L = \\left\\{ ${col(forms)} \\in \\mathbb{R}^{${sol.n}} \\;\\middle|\\; ${names} \\in \\mathbb{R} \\right\\}`;
}

// ---------------------------------------------------------------- frames

export type FrameKind = 'start' | 'pivot' | 'swap' | 'ops' | 'echelon' | 'free' | 'back' | 'scale' | 'clear' | 'reduced' | 'verdict';
export interface BackRow { row: number; col: number; /** the equation as the echelon row says it */ eq: string; /** with the known values put in (only if all are numbers) */ subst?: string; /** `x_3 = 3` */ val: string }
export interface Frame {
  kind: FrameKind;
  /** the matrix shown in this frame */
  m: Mat;
  /** the pivot of the current round (circled bigger) */
  pivot?: [number, number];
  /** pivots found so far (circled) */
  done: [number, number][];
  /** red circled multiples for the rows below / above the pivot (kind pivot) */
  mult: { row: number; factor: Q }[];
  /** the row operations written next to the rows (kind ops / swap / scale / clear) */
  notes: { row: number; tex: string }[];
  /** the column that was cleared in this round */
  focusCol?: number;
  /** free variables (`x_2 = \alpha`) and back-substitution rows so far (cumulative) */
  free: string[];
  back: BackRow[];
  /** kind verdict: the result; `bad` = the contradictory row for «none» */
  sol?: Solution;
  bad?: number;
}

export interface Trace { frames: Frame[]; sol: Solution; echelon: Mat; reduced: Mat; nVars: number; m: number }

const sameSource = (a: Op, b: Op) => a.kind === 'add' && b.kind === 'add' && a.source === b.source;
const xname = (j: number) => `x_${j + 1}`;
const valTex = (v: Q) => (v[0] < 0 ? `(${tex(v)})` : tex(v));

/** The whole elimination of [A | b] as frames: forward elimination, echelon form, back substitution, reduced form, verdict. */
export function traceGauss(aug: Mat, nVars = aug[0].length - 1): Trace {
  const e = eliminate(aug, nVars);
  const sol = solve(aug, nVars);
  const frames: Frame[] = [];
  const base = (kind: FrameKind, m: Mat, done: [number, number][]): Frame => ({ kind, m, done: done.map((d) => [...d] as [number, number]), mult: [], notes: [], free: [], back: [] });
  frames.push(base('start', aug, []));
  let prev = aug;
  const done: [number, number][] = [];
  const steps = e.steps;
  for (let i = 0; i < steps.length;) {
    const s = steps[i];
    if (s.op.kind === 'swap') {
      const f = base('swap', s.after, done);
      f.notes = [{ row: s.op.i, tex: opTex(s.op) }, { row: s.op.j, tex: opTex(s.op) }];
      frames.push(f); prev = s.after; i++; continue;
    }
    if (s.op.kind !== 'add') { i++; continue; }
    let j = i;
    while (j + 1 < steps.length && sameSource(steps[j + 1].op, s.op)) j++;
    const src = s.op.source, col = lead(prev[src], nVars);
    const group = steps.slice(i, j + 1).map((g) => g.op as Extract<Op, { kind: 'add' }>);
    const pf = base('pivot', prev, done);
    pf.pivot = [src, col]; pf.mult = group.map((g) => ({ row: g.target, factor: g.factor }));
    frames.push(pf);
    const of = base('ops', steps[j].after, done);
    of.pivot = [src, col]; of.focusCol = col; of.notes = group.map((g) => ({ row: g.target, tex: opTex(g) }));
    frames.push(of);
    done.push([src, col]);
    prev = steps[j].after; i = j + 1;
  }
  const ech = base('echelon', e.result, e.pivots);
  frames.push(ech);

  if (sol.kind === 'none') {
    const v = base('verdict', e.result, e.pivots);
    v.sol = sol;
    v.bad = e.result.findIndex((r) => r.slice(0, nVars).every(isZero) && !isZero(r[nVars]));
    frames.push(v);
    return { frames, sol, echelon: e.result, reduced: reduce(e, nVars).result, nVars, m: aug.length };
  }

  // back substitution, bottom row first
  const vars: (Lin | undefined)[] = Array.from({ length: nVars }, () => undefined);
  const nP = sol.freeCols.length;
  const unit = (k: number): Q[] => Array.from({ length: nP }, (_, i) => (i === k ? ONE : ZERO));
  sol.freeCols.forEach((c, k) => { vars[c] = { c: ZERO, p: unit(k) }; });
  const free = sol.freeCols.map((c, k) => `${xname(c)} = ${PARAMS[k]}`);
  if (free.length) { const f = base('free', e.result, e.pivots); f.free = free; frames.push(f); }
  const back: BackRow[] = [];
  for (const [r, c] of e.pivots.slice().reverse()) {
    const row = e.result[r];
    let acc: Lin = { c: row[nVars], p: unit(-1) };
    const termsSym: string[] = [], termsNum: string[] = [];
    let allNum = true;
    const coefTex = (a: Q) => (eq(a, ONE) ? '' : eq(a, q(-1)) ? '-' : tex(a));
    for (let k = c; k < nVars; k++) {
      if (isZero(row[k])) continue;
      const sym = `${coefTex(row[k])}${xname(k)}`;
      termsSym.push(sym);
      if (k > c) {
        acc = linAdd(acc, linScale(vars[k]!, neg(row[k])));
        if (!isConst(vars[k]!)) allNum = false;
        else termsNum.push(eq(row[k], ONE) ? tex(vars[k]!.c) : `${tex(row[k])}\\cdot ${valTex(vars[k]!.c)}`);
      }
    }
    const val = linScale(acc, div(ONE, row[c]));
    vars[c] = val;
    const join = (ts: string[]) => ts.map((t, i) => (i === 0 || t.startsWith('-') ? t : `+${t}`)).join('');
    const eqTex = `${join(termsSym)} = ${tex(row[nVars])}`;
    const subst = allNum && termsNum.length ? `${join([coefTex(row[c]) + xname(c), ...termsNum])} = ${tex(row[nVars])}` : undefined;
    back.push({ row: r, col: c, eq: eqTex, subst, val: `${xname(c)} = ${linTex(val)}` });
    const f = base('back', e.result, e.pivots);
    f.pivot = [r, c]; f.free = free; f.back = back.map((b) => ({ ...b }));
    frames.push(f);
  }

  // reduced form
  const red = reduce(e, nVars);
  const extra = red.steps.slice(steps.length);
  let rprev = e.result;
  for (let i = 0; i < extra.length;) {
    const s = extra[i];
    if (s.op.kind === 'scale') {
      const f = base('scale', s.after, e.pivots);
      f.pivot = [s.op.row, lead(s.after[s.op.row], nVars)];
      f.notes = [{ row: s.op.row, tex: opTex(s.op) }];
      frames.push(f); rprev = s.after; i++; continue;
    }
    if (s.op.kind !== 'add') { i++; continue; }
    let j = i;
    while (j + 1 < extra.length && sameSource(extra[j + 1].op, s.op)) j++;
    const src = s.op.source;
    const f = base('clear', extra[j].after, e.pivots);
    f.pivot = [src, lead(rprev[src], nVars)]; f.focusCol = f.pivot[1];
    f.notes = extra.slice(i, j + 1).map((g) => ({ row: (g.op as Extract<Op, { kind: 'add' }>).target, tex: opTex(g.op) }));
    frames.push(f); rprev = extra[j].after; i = j + 1;
  }
  frames.push(base('reduced', red.result, red.pivots));
  const v = base('verdict', red.result, red.pivots);
  v.sol = sol; v.free = free; v.back = back.map((b) => ({ ...b }));
  frames.push(v);
  return { frames, sol, echelon: e.result, reduced: red.result, nVars, m: aug.length };
}


/** Slide 37 «don't repeat calculations»: one table with two right-hand sides b₁ = (6, 8, 23) (slide 26) and b₂ = (3, 4, 10) (ours). */
export const MULTI_RHS: Mat = [[1, 1, 1, 6, 3], [1, 2, 1, 8, 4], [2, 3, 5, 23, 10]].map((r) => r.map((x) => q(x)));
