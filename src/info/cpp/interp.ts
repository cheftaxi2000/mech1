import type { Expr, FuncDef, Program, Stmt, Ty } from './ast';
import { parseFragment, parseProgram } from './parser';

/** Runtime types: `n` is the C++ type name, `e` the element type of a vector. */
export interface TyV { n: 'int' | 'unsigned' | 'double' | 'float' | 'bool' | 'char' | 'string' | 'void' | 'vector' | 'ostream' | 'istream'; e?: TyV }

/** An element of a vector as the figures draw it (vectors may be nested). */
export interface ElemView { value: string; changed: boolean; sub?: ElemView[] }
export interface VarView {
  id: number; name: string; type: string; value: string;
  uninit: boolean; isConst: boolean; isRef: boolean; changed: boolean; shadowed: boolean;
  /** set for vectors: the elements, one box each */
  vec?: ElemView[];
}
export interface FrameView { fn: string; line: number; vars: VarView[] }
export type Ev =
  | { kind: 'cond'; src: string; value: boolean }
  | { kind: 'init' } | { kind: 'step'; src: string }
  | { kind: 'call'; name: string; args: string[] }
  | { kind: 'return'; value?: string }
  | { kind: 'returned'; name: string; value?: string }
  | { kind: 'input'; text: string }
  | { kind: 'ub'; msg: string }
  | { kind: 'overflow'; src: string }
  | { kind: 'end' };
export interface Snap { line: number | null; frames: FrameView[]; out: string; ev?: Ev }
export interface Trace { snaps: Snap[]; stdout: string; exit: number | null; error?: { msg: string; line: number }; truncated?: boolean }

export class RuntimeError extends Error { constructor(msg: string, public line: number) { super(msg); } }
class Stop extends Error {}

interface Cell { id: number; ty: TyV; v: unknown; init: boolean; isConst: boolean }
interface Binding { name: string; cell: Cell; isRef: boolean }
interface Frame { fn: string; line: number; scopes: Binding[][] }
interface RV { ty: TyV; v: unknown; cell?: Cell }

const INT = { n: 'int' } as TyV, DBL = { n: 'double' } as TyV, BOOL = { n: 'bool' } as TyV, STR = { n: 'string' } as TyV, VOID = { n: 'void' } as TyV;
const tyName = (t: TyV): string => (t.n === 'vector' ? `vector<${tyName(t.e!)}>` : t.n);
const isArith = (t: TyV) => ['int', 'unsigned', 'double', 'float', 'bool', 'char'].includes(t.n);
const toTy = (t: Ty): TyV => ({ n: t.name as TyV['n'], e: t.args ? toTy(t.args[0]) : undefined });

// ---------------------------------------------------------------- number formatting
/** `std::cout` formatting of a floating point number: like printf("%g") with 6 significant digits. */
export function fmtG(x: number, prec = 6): string {
  if (Number.isNaN(x)) return 'nan';
  if (!Number.isFinite(x)) return x < 0 ? '-inf' : 'inf';
  if (x === 0) return Object.is(x, -0) ? '-0' : '0';
  const exp = Number(x.toExponential(prec - 1).split('e')[1]);
  if (exp < -4 || exp >= prec) {
    const [m, e] = x.toExponential(prec - 1).split('e');
    const mant = m.includes('.') ? m.replace(/0+$/, '').replace(/\.$/, '') : m;
    const ee = Number(e);
    return `${mant}e${ee < 0 ? '-' : '+'}${String(Math.abs(ee)).padStart(2, '0')}`;
  }
  const s = x.toFixed(Math.max(0, prec - 1 - exp));
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
}

const shortestFloat = (x: number): string => {
  if (!Number.isFinite(x)) return fmtG(x);
  for (let p = 1; p <= 9; p++) { const s = x.toPrecision(p); if (Math.fround(Number(s)) === x) return String(Number(s)); }
  return String(x);
};

const showChar = (code: number) => (code >= 32 && code < 127 ? `'${String.fromCharCode(code)}'` : code === 10 ? "'\\n'" : code === 0 ? "'\\0'" : `'\\x${code.toString(16)}'`);

/** How a value appears in the variable table (precise, unlike cout). */
function display(c: Cell): string {
  if (!c.init) return '?';
  const t = c.ty;
  switch (t.n) {
    case 'bool': return c.v ? 'true' : 'false';
    case 'char': return `${showChar(c.v as number)} (${c.v})`;
    case 'float': return shortestFloat(c.v as number);
    case 'double': return Number.isInteger(c.v) && Math.abs(c.v as number) < 1e15 ? `${c.v}` : String(c.v);
    case 'string': return JSON.stringify(c.v);
    case 'vector': return `[${(c.v as Cell[]).map(display).join(', ')}]`;
    default: return String(c.v);
  }
}

// ---------------------------------------------------------------- conversions and arithmetic
const wrapInt = (x: number) => x | 0;
const wrapUns = (x: number) => x >>> 0;
const wrapChar = (x: number) => (x << 24) >> 24;

function convert(rv: RV, to: TyV, line: number): unknown {
  const v = rv.v;
  if (to.n === rv.ty.n && to.n !== 'vector') return v;
  if (to.n === 'vector' || rv.ty.n === 'vector') { if (to.n === rv.ty.n) return v; throw new RuntimeError('cannot convert vector', line); }
  if (to.n === 'string') { if (rv.ty.n === 'string') return v; throw new RuntimeError('cannot convert to string', line); }
  if (!isArith(rv.ty)) throw new RuntimeError(`cannot convert ${tyName(rv.ty)} to ${tyName(to)}`, line);
  const x = typeof v === 'boolean' ? Number(v) : (v as number);
  switch (to.n) {
    case 'bool': return x !== 0;
    case 'int': return wrapInt(Number.isInteger(x) ? x : Math.trunc(x));
    case 'unsigned': return wrapUns(Math.trunc(x));
    case 'char': return wrapChar(Math.trunc(x));
    case 'float': return Math.fround(x);
    case 'double': return x;
    default: throw new RuntimeError(`cannot convert to ${tyName(to)}`, line);
  }
}

/** Usual arithmetic conversions of the two operands of an arithmetic operator. */
function promote(a: TyV, b: TyV): TyV {
  if (a.n === 'double' || b.n === 'double') return DBL;
  if (a.n === 'float' || b.n === 'float') return { n: 'float' };
  if (a.n === 'unsigned' || b.n === 'unsigned') return { n: 'unsigned' };
  return INT;
}

const BUILTIN: Record<string, (a: number[]) => number> = {
  sqrt: (a) => Math.sqrt(a[0]), pow: (a) => Math.pow(a[0], a[1]), fabs: (a) => Math.abs(a[0]), floor: (a) => Math.floor(a[0]), ceil: (a) => Math.ceil(a[0]),
  sin: (a) => Math.sin(a[0]), cos: (a) => Math.cos(a[0]), tan: (a) => Math.tan(a[0]), exp: (a) => Math.exp(a[0]), log: (a) => Math.log(a[0]), round: (a) => Math.sign(a[0]) * Math.round(Math.abs(a[0])),
};

// ---------------------------------------------------------------- the interpreter
export interface RunOptions { stdin?: string; maxSnaps?: number; maxDepth?: number }

class Interp {
  frames: Frame[] = [];
  globals: Binding[] = [];
  funcs = new Map<string, FuncDef>();
  snaps: Snap[] = [];
  out = '';
  stdin: string; inPos = 0;
  nextId = 1;
  prev = new Map<number, string>();
  pending: Ev | undefined;
  ub: string | undefined;
  maxSnaps: number; maxDepth: number;
  truncated = false;
  retVal: RV | undefined; signal: 'break' | 'continue' | 'return' | null = null;
  overflowSrc: string | undefined;

  constructor(opts: RunOptions) { this.stdin = opts.stdin ?? ''; this.maxSnaps = opts.maxSnaps ?? 4000; this.maxDepth = opts.maxDepth ?? 120; }

  get frame() { return this.frames[this.frames.length - 1]; }

  // ---- state capture
  private views(): FrameView[] {
    const nextPrev = new Map<number, string>();
    const elems = (c: Cell): ElemView[] => (c.v as Cell[]).map((x) => {
      const value = display(x);
      nextPrev.set(x.id, value);
      const changed = this.prev.has(x.id) ? this.prev.get(x.id) !== value : this.prev.has(c.id);
      return { value, changed, sub: x.ty.n === 'vector' ? elems(x) : undefined };
    });
    const result = this.frames.map((f, fi) => {
      const vars: VarView[] = [];
      const seen = new Map<string, number>();
      const list: Binding[] = fi === 0 ? [...this.globals, ...f.scopes.flat()] : f.scopes.flat();
      list.forEach((b) => seen.set(b.name, (seen.get(b.name) ?? 0) + 1));
      const counts = new Map<string, number>();
      for (const b of list) {
        counts.set(b.name, (counts.get(b.name) ?? 0) + 1);
        const value = display(b.cell);
        nextPrev.set(b.cell.id, value);
        vars.push({
          id: b.cell.id, name: b.name, type: tyName(b.cell.ty) + (b.isRef ? '&' : ''), value, uninit: !b.cell.init, isConst: b.cell.isConst, isRef: b.isRef,
          changed: this.prev.has(b.cell.id) ? this.prev.get(b.cell.id) !== value : false, shadowed: counts.get(b.name)! < seen.get(b.name)!,
          vec: b.cell.ty.n === 'vector' && b.cell.init ? elems(b.cell) : undefined,
        });
      }
      return { fn: f.fn, line: f.line, vars };
    });
    this.prev = nextPrev;
    return result;
  }

  snap(line: number | null, ev?: Ev) {
    if (this.snaps.length >= this.maxSnaps) { this.truncated = true; throw new Stop(); }
    if (line !== null) this.frame.line = line;
    const e = ev ?? this.pending;
    this.pending = undefined;
    let evOut = e;
    if (this.ub) { evOut = { kind: 'ub', msg: this.ub }; this.ub = undefined; }
    else if (this.overflowSrc) { evOut = { kind: 'overflow', src: this.overflowSrc }; this.overflowSrc = undefined; }
    this.snaps.push({ line, frames: this.views(), out: this.out, ev: evOut });
  }

  // ---- scopes
  private declare(name: string, cell: Cell, isRef = false) {
    const scope = this.frame.scopes[this.frame.scopes.length - 1];
    scope.push({ name, cell, isRef });
  }
  private newCell(ty: TyV, v: unknown, init: boolean, isConst = false): Cell { return { id: this.nextId++, ty, v: ty.n === 'vector' && Array.isArray(v) ? this.cloneVec(v as Cell[]) : v, init, isConst }; }
  /** Vectors have value semantics: copying a vector copies every element (also nested vectors). */
  private cloneVec(a: Cell[]): Cell[] { return a.map((c) => ({ id: this.nextId++, ty: c.ty, v: c.ty.n === 'vector' ? this.cloneVec(c.v as Cell[]) : c.v, init: c.init, isConst: false })); }
  private lookup(name: string, line: number): Binding {
    const f = this.frame;
    for (let i = f.scopes.length - 1; i >= 0; i--) for (let j = f.scopes[i].length - 1; j >= 0; j--) if (f.scopes[i][j].name === name) return f.scopes[i][j];
    for (let j = this.globals.length - 1; j >= 0; j--) if (this.globals[j].name === name) return this.globals[j];
    throw new RuntimeError(`'${name}' was not declared in this scope`, line);
  }

  // ---- expressions
  private rv(ty: TyV, v: unknown): RV { return { ty, v }; }

  private read(c: Cell, line: number): RV {
    if (!c.init) { this.ub = `reading the uninitialized variable (undefined behavior)`; return { ty: c.ty, v: c.ty.n === 'bool' ? false : c.ty.n === 'string' ? '' : 0, cell: c }; }
    void line;
    return { ty: c.ty, v: c.v, cell: c };
  }

  /** Evaluate an expression that is only *written* (assignment target, `cin >>`, reference argument): no read, so no warning for uninitialized variables. */
  private lval(e: Expr): RV {
    if (e.k === 'id' && !e.name.includes('::')) { const c = this.lookup(e.name, e.line).cell; return { ty: c.ty, v: c.v, cell: c }; }
    return this.eval(e);
  }

  private num(r: RV): number { return typeof r.v === 'boolean' ? Number(r.v) : (r.v as number); }

  eval(e: Expr): RV {
    switch (e.k) {
      case 'num': return e.isDouble ? this.rv(DBL, e.v) : e.isUnsigned ? this.rv({ n: 'unsigned' }, e.v >>> 0) : this.rv(INT, e.v | 0);
      case 'char': return this.rv({ n: 'char' }, e.v.charCodeAt(0));
      case 'str': return this.rv(STR, e.v);
      case 'bool': return this.rv(BOOL, e.v);
      case 'id': {
        if (e.name === 'std::cout' || e.name === 'cout') return this.rv({ n: 'ostream' }, 'cout');
        if (e.name === 'std::cin' || e.name === 'cin') return this.rv({ n: 'istream' }, 'cin');
        if (e.name === 'std::endl' || e.name === 'endl') return this.rv(STR, '\n');
        return this.read(this.lookup(e.name, e.line).cell, e.line);
      }
      case 'cast': return this.rv(toTy(e.ty), convert(this.eval(e.e), toTy(e.ty), e.line));
      case 'ctor': return this.construct(toTy(e.ty), e.args, e.line);
      case 'initlist': throw new RuntimeError('a braced list needs a declared type to initialize', e.line);
      case 'unary': return this.unary(e);
      case 'postfix': {
        const r = this.eval(e.e);
        if (!r.cell) throw new RuntimeError('lvalue required as increment operand', e.line);
        const old = r.v as number;
        this.store(r.cell, { ty: r.ty, v: this.arith(e.op === '++' ? '+' : '-', r, this.rv(INT, 1), e.line, e.src).v }, e.line);
        return this.rv(r.ty, old);
      }
      case 'binary': return this.binary(e);
      case 'assign': return this.assign(e);
      case 'cond': return this.truthy(this.eval(e.c)) ? this.eval(e.a) : this.eval(e.b);
      case 'call': return this.call(e);
      case 'method': return this.method(e);
      case 'index': {
        const b = this.eval(e.base), i = this.num(this.eval(e.idx));
        if (b.ty.n !== 'vector') throw new RuntimeError('subscripted value is not a vector', e.line);
        const arr = b.v as Cell[];
        if (i < 0 || i >= arr.length) throw new RuntimeError(`index ${i} is out of bounds for a vector of size ${arr.length} (undefined behavior)`, e.line);
        return this.read(arr[i], e.line);
      }
    }
  }

  private truthy(r: RV): boolean { if (!isArith(r.ty)) throw new RuntimeError('not a condition', 0); return typeof r.v === 'boolean' ? r.v : (r.v as number) !== 0; }

  private unary(e: Expr & { k: 'unary' }): RV {
    if (e.op === '++' || e.op === '--') {
      const r = this.eval(e.e);
      if (!r.cell) throw new RuntimeError('lvalue required as increment operand', e.line);
      const nv = this.arith(e.op === '++' ? '+' : '-', r, this.rv(INT, 1), e.line, e.src);
      this.store(r.cell, nv, e.line);
      return { ty: r.ty, v: r.cell.v, cell: r.cell };
    }
    const r = this.eval(e.e);
    if (e.op === '!') return this.rv(BOOL, !this.truthy(r));
    if (!isArith(r.ty)) throw new RuntimeError('bad operand for unary operator', e.line);
    const t = promote(r.ty, INT);
    const x = this.num(r);
    if (e.op === '+') return this.rv(t.n === 'int' ? INT : t, x);
    return this.rv(t.n === 'int' ? INT : t, t.n === 'unsigned' ? wrapUns(-x) : t.n === 'int' ? wrapInt(-x) : t.n === 'float' ? Math.fround(-x) : -x);
  }

  private arith(op: string, a: RV, b: RV, line: number, src: string): RV {
    if (!isArith(a.ty) || !isArith(b.ty)) throw new RuntimeError(`invalid operands to binary '${op}'`, line);
    const t = promote(a.ty, b.ty);
    const x = convert(a, t, line) as number, y = convert(b, t, line) as number;
    let r: number;
    switch (op) {
      case '+': r = x + y; break;
      case '-': r = x - y; break;
      case '*': r = x * y; break;
      case '/':
        if (t.n === 'int' || t.n === 'unsigned') { if (y === 0) throw new RuntimeError('division by zero (undefined behavior)', line); r = Math.trunc(x / y); } else r = x / y;
        break;
      case '%':
        if (t.n !== 'int' && t.n !== 'unsigned') throw new RuntimeError("invalid operands of types 'double' to binary 'operator%'", line);
        if (y === 0) throw new RuntimeError('division by zero (undefined behavior)', line);
        r = x % y; break;
      default: throw new RuntimeError(`unknown operator ${op}`, line);
    }
    if (t.n === 'int') { if (r > 2147483647 || r < -2147483648) this.overflowSrc = src; return this.rv(INT, op === '*' ? Math.imul(x, y) : wrapInt(r)); }
    if (t.n === 'unsigned') return this.rv(t, op === '*' ? Math.imul(x, y) >>> 0 : wrapUns(r));
    if (t.n === 'float') return this.rv(t, Math.fround(r));
    return this.rv(t, r);
  }

  private binary(e: Expr & { k: 'binary' }): RV {
    if (e.op === '&&') { const l = this.truthy(this.eval(e.l)); return this.rv(BOOL, l && this.truthy(this.eval(e.r))); }
    if (e.op === '||') { const l = this.truthy(this.eval(e.l)); return this.rv(BOOL, l || this.truthy(this.eval(e.r))); }
    const a = this.eval(e.l);
    if (e.op === '<<' && a.ty.n === 'ostream') { this.print(this.eval(e.r)); return a; }
    if (e.op === '>>' && a.ty.n === 'istream') {
      const target = this.lval(e.r);
      if (!target.cell) throw new RuntimeError('cin >> needs a variable', e.line);
      this.readInput(target.cell, e.line);
      return a;
    }
    const b = this.eval(e.r);
    if (['<', '>', '<=', '>=', '==', '!='].includes(e.op)) {
      if (a.ty.n === 'string' && b.ty.n === 'string') { const x = a.v as string, y = b.v as string; return this.rv(BOOL, e.op === '==' ? x === y : e.op === '!=' ? x !== y : e.op === '<' ? x < y : e.op === '>' ? x > y : e.op === '<=' ? x <= y : x >= y); }
      const t = promote(a.ty, b.ty);
      const x = convert(a, t, e.line) as number, y = convert(b, t, e.line) as number;
      return this.rv(BOOL, e.op === '<' ? x < y : e.op === '>' ? x > y : e.op === '<=' ? x <= y : e.op === '>=' ? x >= y : e.op === '==' ? x === y : x !== y);
    }
    if (e.op === '+' && a.ty.n === 'string' && b.ty.n === 'string') return this.rv(STR, (a.v as string) + (b.v as string));
    return this.arith(e.op, a, b, e.line, e.src);
  }

  private assign(e: Expr & { k: 'assign' }): RV {
    const l = this.lval(e.l);
    if (!l.cell) throw new RuntimeError('expression is not assignable (lvalue required as left operand of assignment)', e.line);
    let r = this.eval(e.r);
    if (e.op !== '=') r = this.arith(e.op[0], this.read(l.cell, e.line), r, e.line, e.src);
    this.store(l.cell, r, e.line);
    return { ty: l.cell.ty, v: l.cell.v, cell: l.cell };
  }

  private store(c: Cell, r: RV, line: number) {
    if (c.isConst) throw new RuntimeError('assignment of read-only variable', line);
    const v = convert(r, c.ty, line);
    c.v = c.ty.n === 'vector' ? this.cloneVec(v as Cell[]) : v; c.init = true;
  }

  private print(r: RV) {
    const t = r.ty;
    if (t.n === 'char') this.out += String.fromCharCode(r.v as number);
    else if (t.n === 'bool') this.out += r.v ? '1' : '0';
    else if (t.n === 'double' || t.n === 'float') this.out += fmtG(r.v as number);
    else if (t.n === 'string') this.out += r.v as string;
    else if (isArith(t)) this.out += String(r.v);
    else throw new RuntimeError('this type cannot be printed', 0);
  }

  private readInput(c: Cell, line: number) {
    const rest = this.stdin.slice(this.inPos);
    const m = /^\s*(\S+)/.exec(rest);
    if (!m) throw new RuntimeError('no more input', line);
    let tok = m[1], used = m[0].length;
    switch (c.ty.n) {
      case 'char': tok = tok[0]; used = m[0].length - m[1].length + 1; c.v = tok.charCodeAt(0); break;
      case 'string': c.v = tok; break;
      case 'bool': c.v = tok !== '0'; break;
      case 'double': case 'float': { const x = parseFloat(tok); c.v = c.ty.n === 'float' ? Math.fround(Number.isNaN(x) ? 0 : x) : Number.isNaN(x) ? 0 : x; break; }
      default: { const x = parseInt(tok, 10); c.v = c.ty.n === 'unsigned' ? wrapUns(Number.isNaN(x) ? 0 : x) : wrapInt(Number.isNaN(x) ? 0 : x); }
    }
    c.init = true;
    this.inPos += used;
    this.pending = { kind: 'input', text: tok };
  }

  private call(e: Expr & { k: 'call' }): RV {
    const bare = e.name.replace(/^std::/, '');
    const user = this.funcs.get(e.name);
    if (e.name.startsWith('limits:')) {
      const [, ty, fn] = e.name.split(':');
      const table: Record<string, [TyV, number, number]> = {
        int: [INT, -2147483648, 2147483647], unsigned: [{ n: 'unsigned' }, 0, 4294967295], double: [DBL, 2.2250738585072014e-308, Number.MAX_VALUE],
        float: [{ n: 'float' }, 1.1754943508222875e-38, 3.4028234663852886e38], char: [{ n: 'char' }, -128, 127],
      };
      const row = table[ty]; if (!row) throw new RuntimeError(`numeric_limits<${ty}> is not supported`, e.line);
      return this.rv(row[0], fn === 'min' ? row[1] : row[2]);
    }
    if (!user) {
      if (BUILTIN[bare]) { const a = e.args.map((x) => this.num(this.eval(x))); return this.rv(DBL, BUILTIN[bare](a)); }
      if (bare === 'abs') { const r = this.eval(e.args[0]); return this.rv(r.ty.n === 'double' || r.ty.n === 'float' ? r.ty : INT, Math.abs(this.num(r))); }
      if (bare === 'min' || bare === 'max') {
        const a = this.eval(e.args[0]), b = this.eval(e.args[1]); const t = promote(a.ty, b.ty);
        const x = convert(a, t, e.line) as number, y = convert(b, t, e.line) as number;
        return this.rv(t, bare === 'min' ? Math.min(x, y) : Math.max(x, y));
      }
      if (bare === 'assert') {
        if (!this.truthy(this.eval(e.args[0]))) throw new RuntimeError(`Assertion \`${e.args[0].src}' failed.`, e.line);
        return this.rv(VOID, undefined);
      }
      if (bare === 'ssize') { const r = this.eval(e.args[0]); if (r.ty.n !== 'vector') throw new RuntimeError('std::ssize needs a vector', e.line); return this.rv(INT, (r.v as Cell[]).length); }
      if (['int', 'unsigned', 'double', 'float', 'bool', 'char'].includes(bare)) { const to = { n: bare } as TyV; return this.rv(to, convert(this.eval(e.args[0]), to, e.line)); }
      if (bare === 'swap') {
        const a = this.lval(e.args[0]), b = this.lval(e.args[1]);
        if (!a.cell || !b.cell) throw new RuntimeError('swap needs two variables', e.line);
        const t = a.cell.v; a.cell.v = b.cell.v; b.cell.v = t; return this.rv(VOID, undefined);
      }
      throw new RuntimeError(`'${e.name}' was not declared in this scope`, e.line);
    }
    return this.callUser(user, e);
  }

  private callUser(fn: FuncDef, e: Expr & { k: 'call' }): RV {
    if (e.args.length !== fn.params.length) throw new RuntimeError(`wrong number of arguments to '${fn.name}'`, e.line);
    if (this.frames.length >= this.maxDepth) throw new RuntimeError('stack overflow (too many nested calls)', e.line);
    const args = e.args.map((a, i) => ({ r: fn.params[i].ty.isRef ? this.lval(a) : this.eval(a), p: fn.params[i] }));
    const frame: Frame = { fn: fn.name, line: fn.line, scopes: [[]] };
    const callerLine = e.line;
    this.frames.push(frame);
    for (const { r, p } of args) {
      const pt = toTy(p.ty);
      if (p.ty.isRef) {
        const same = !!r.cell && r.cell.ty.n === pt.n && (pt.n !== 'vector' || tyName(r.cell.ty) === tyName(pt));
        if (r.cell && same && (p.ty.isConst || !r.cell.isConst)) this.declare(p.name, r.cell, true);
        else if (p.ty.isConst) this.declare(p.name, this.newCell(pt, convert(r, pt, callerLine), true, true), true); // temporary object
        else { this.frames.pop(); throw new RuntimeError(r.cell ? 'binding a constant to a non-const reference' : `cannot bind a non-lvalue to the reference parameter '${p.name}'`, callerLine); }
      } else this.declare(p.name, this.newCell(pt, convert(r, pt, callerLine), true, p.ty.isConst));
    }
    this.pending = { kind: 'call', name: fn.name, args: args.map((a) => this.show(a.r)) };
    this.signal = null; this.retVal = undefined;
    this.execBlockBody(fn.body.body);
    this.frames.pop();
    let result = this.rv(VOID, undefined);
    if (fn.ret.name !== 'void') {
      const rt = toTy(fn.ret);
      if (fn.ret.isRef) {
        const rr = this.retVal as RV | undefined;
        if (!rr?.cell) throw new RuntimeError('cannot bind a non-const reference return value to an rvalue', callerLine);
        result = { ty: rr.cell.ty, v: rr.cell.v, cell: rr.cell };
      } else result = this.retVal ? this.rv(rt, convert(this.retVal, rt, callerLine)) : this.rv(rt, 0);
    }
    this.signal = null; this.retVal = undefined;
    this.pending = { kind: 'returned', name: fn.name, value: fn.ret.name === 'void' ? undefined : this.showV(result) };
    return result;
  }

  private method(e: Expr & { k: 'method' }): RV {
    const o = this.eval(e.obj);
    if (o.ty.n === 'vector') {
      const arr = o.v as Cell[]; const et = o.ty.e!;
      if (e.name === 'size') return this.rv({ n: 'unsigned' }, arr.length);
      if (e.name === 'push_back') { arr.push(this.newCell(et, convert(this.eval(e.args[0]), et, e.line), true)); return this.rv(VOID, undefined); }
      if (e.name === 'pop_back') { arr.pop(); return this.rv(VOID, undefined); }
      if (e.name === 'at') { const i = this.num(this.eval(e.args[0])); if (i < 0 || i >= arr.length) throw new RuntimeError(`vector::at: index ${i} out of range (size ${arr.length}) – throws std::out_of_range`, e.line); return this.read(arr[i], e.line); }
      if (e.name === 'empty') return this.rv(BOOL, arr.length === 0);
    }
    if (o.ty.n === 'string') {
      const s = o.v as string;
      if (e.name === 'size' || e.name === 'length') return this.rv({ n: 'unsigned' }, s.length);
    }
    throw new RuntimeError(`no member '${e.name}'`, e.line);
  }

  private showV(r: RV): string { return display({ id: 0, ty: r.ty, v: r.v, init: true, isConst: false }); }
  private show(r: RV): string { return this.showV(r); }

  // ---- statements
  execBlockBody(body: Stmt[]) {
    for (const s of body) { this.exec(s); if (this.signal) return; }
  }

  private scoped(body: () => void) { this.frame.scopes.push([]); try { body(); } finally { this.frame.scopes.pop(); } }

  private zero(t: TyV): unknown { return t.n === 'bool' ? false : t.n === 'string' ? '' : t.n === 'vector' ? [] : 0; }

  /** `std::vector<T>(n)` and `std::vector<T>(n, e)`. */
  private construct(t: TyV, args: Expr[], line: number): RV {
    if (t.n !== 'vector') throw new RuntimeError('only vectors can be constructed here', line);
    const et = t.e!;
    const arr: Cell[] = [];
    if (args.length) {
      const n = this.num(this.eval(args[0]));
      if (n < 0) throw new RuntimeError('vector::vector: negative size', line);
      const fill = args[1] ? convert(this.eval(args[1]), et, line) : this.zero(et);
      for (let i = 0; i < n; i++) arr.push(this.newCell(et, fill, true));
    }
    return this.rv(t, arr);
  }

  /** `{a, b, c}` for a vector (nested lists for nested vectors). */
  private fromList(t: TyV, e: Expr, line: number): unknown {
    if (e.k !== 'initlist') { const r = this.eval(e); return convert(r, t, line); }
    if (t.n !== 'vector') throw new RuntimeError('a braced list can only initialize a vector here', line);
    return e.items.map((x) => this.newCell(t.e!, this.fromList(t.e!, x, line), true));
  }

  private makeCell(ty: Ty, item: { init?: Expr; ctor?: Expr[]; name: string }, line: number): Cell {
    if (ty.name === 'auto') {
      if (!item.init) throw new RuntimeError("declaration of 'auto' variable has no initializer", line);
      const r = this.eval(item.init);
      return this.newCell(r.ty, r.v, true, ty.isConst);
    }
    const t = toTy(ty);
    if (t.n === 'vector') {
      if (item.init) return this.newCell(t, this.fromList(t, item.init, line), true, ty.isConst);
      return this.newCell(t, this.construct(t, item.ctor ?? [], line).v, true, ty.isConst);
    }
    if (item.init) { const r = this.eval(item.init); return this.newCell(t, convert(r, t, line), true, ty.isConst); }
    if (item.ctor && item.ctor.length === 1) { const r = this.eval(item.ctor[0]); return this.newCell(t, convert(r, t, line), true, ty.isConst); }
    if (ty.isConst) throw new RuntimeError('uninitialized const variable', line);
    return this.newCell(t, t.n === 'string' ? '' : 0, t.n === 'string');
  }

  exec(s: Stmt) {
    switch (s.k) {
      case 'empty': return;
      case 'decl':
        this.snap(s.line);
        for (const it of s.items) {
          if (s.ty.isRef) {
            if (!it.init) throw new RuntimeError(`'${it.name}' declared as reference but not initialized`, it.line);
            const r = this.lval(it.init);
            if (r.cell && (s.ty.isConst || !r.cell.isConst)) this.declare(it.name, r.cell, true);
            else if (s.ty.isConst) this.declare(it.name, this.newCell(r.ty, r.v, true, true), true); // a temporary object lives as long as the reference
            else throw new RuntimeError("cannot bind non-const lvalue reference to an rvalue", it.line);
          } else this.declare(it.name, this.makeCell(s.ty, it, it.line));
        }
        return;
      case 'expr': this.snap(s.line); this.eval(s.e); return;
      case 'block': this.scoped(() => this.execBlockBody(s.body)); return;
      case 'return': {
        this.retVal = s.e ? this.eval(s.e) : undefined;
        this.snap(s.line, { kind: 'return', value: this.retVal ? this.showV(this.retVal) : undefined });
        this.signal = 'return';
        return;
      }
      case 'break': this.snap(s.line); this.signal = 'break'; return;
      case 'continue': this.snap(s.line); this.signal = 'continue'; return;
      case 'if': {
        const c = this.truthy(this.eval(s.c));
        this.snap(s.line, { kind: 'cond', src: s.c.src, value: c });
        if (c) this.execInScope(s.then); else if (s.else) this.execInScope(s.else);
        return;
      }
      case 'while':
        for (;;) {
          const c = this.truthy(this.eval(s.c));
          this.snap(s.line, { kind: 'cond', src: s.c.src, value: c });
          if (!c) return;
          this.execInScope(s.body);
          if (this.signal === 'break') { this.signal = null; return; }
          if (this.signal === 'continue') this.signal = null;
          if (this.signal) return;
        }
      case 'do':
        for (;;) {
          this.execInScope(s.body);
          if (this.signal === 'break') { this.signal = null; return; }
          if (this.signal === 'continue') this.signal = null;
          if (this.signal) return;
          const c = this.truthy(this.eval(s.c));
          this.snap(s.condLine, { kind: 'cond', src: s.c.src, value: c });
          if (!c) return;
        }
      case 'for':
        this.scoped(() => {
          if (s.init) { this.snap(s.line, { kind: 'init' }); if (s.init.k === 'decl') for (const it of s.init.items) this.declare(it.name, this.makeCell(s.init.ty, it, it.line)); else if (s.init.k === 'expr') this.eval(s.init.e); }
          for (;;) {
            const c = s.c ? this.truthy(this.eval(s.c)) : true;
            this.snap(s.line, { kind: 'cond', src: s.c?.src ?? 'true', value: c });
            if (!c) return;
            this.execInScope(s.body);
            if (this.signal === 'break') { this.signal = null; return; }
            if (this.signal === 'continue') this.signal = null;
            if (this.signal) return;
            if (s.step) { this.snap(s.line, { kind: 'step', src: s.step.src }); this.eval(s.step); }
          }
        });
        return;
      case 'switch': {
        const v = this.eval(s.e);
        this.snap(s.line);
        const x = this.num(v);
        let start = s.cases.findIndex((c) => c.label !== null && this.num(this.eval(c.label)) === x);
        if (start < 0) start = s.cases.findIndex((c) => c.label === null);
        if (start < 0) return;
        this.scoped(() => {
          for (let i = start; i < s.cases.length; i++) {
            this.execBlockBody(s.cases[i].body);
            if (this.signal) break;
          }
        });
        if (this.signal === 'break') this.signal = null;
        return;
      }
    }
  }

  private execInScope(s: Stmt) {
    if (s.k === 'block') { this.scoped(() => this.execBlockBody(s.body)); } else this.scoped(() => this.exec(s));
  }

  run(prog: Program, entry: () => void) {
    for (const f of prog.funcs) this.funcs.set(f.name, f);
    this.frames.push({ fn: 'main', line: 1, scopes: [[]] });
    for (const g of prog.globals) for (const it of g.items) this.globals.push({ name: it.name, cell: this.makeCell(g.ty, it, it.line), isRef: false });
    entry();
  }
}

function finish(it: Interp, run: () => void): Trace {
  let error: Trace['error'];
  let exit: number | null = 0;
  try { run(); it.snap(null, { kind: 'end' }); }
  catch (e) {
    if (e instanceof Stop) exit = null;
    else if (e instanceof RuntimeError) { error = { msg: e.message, line: e.line }; exit = null; try { it.snap(e.line || null, { kind: 'ub', msg: e.message }); } catch { /* snapshot limit */ } }
    else throw e;
  }
  return { snaps: it.snaps, stdout: it.out, exit, error, truncated: it.truncated || undefined };
}

/** Run a complete program (with `int main()`); `main` returning without a `return` yields 0. */
export function runProgram(src: string, opts: RunOptions = {}): Trace {
  const prog = parseProgram(src);
  const it = new Interp(opts);
  return finish(it, () => it.run(prog, () => {
    const main = prog.funcs.find((f) => f.name === 'main');
    if (!main) throw new RuntimeError("undefined reference to 'main'", 1);
    it.frame.line = main.line;
    it.execBlockBody(main.body.body);
    it.signal = null;
  }));
}

/** Run statements as if they were the body of `main` (the lecture notes often show only such a snippet). */
export function runFragment(src: string, opts: RunOptions = {}): Trace {
  const body = parseFragment(src);
  const it = new Interp(opts);
  return finish(it, () => it.run({ funcs: [], globals: [], includes: [] }, () => { it.execBlockBody(body); it.signal = null; }));
}

export function runAny(src: string, opts: RunOptions & { fragment?: boolean } = {}): Trace {
  return opts.fragment ? runFragment(src, opts) : runProgram(src, opts);
}
