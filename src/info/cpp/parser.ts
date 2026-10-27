import type { DeclItem, Expr, FuncDef, Param, Program, Stmt, Ty } from './ast';
import { CppSyntaxError, lex, type Token } from './lexer';

const BASE_WORDS = new Set(['int', 'unsigned', 'double', 'float', 'bool', 'char', 'void']);
const ASSIGN_OPS = new Set(['=', '+=', '-=', '*=', '/=', '%=']);
const LEVELS: string[][] = [['||'], ['&&'], ['==', '!='], ['<', '>', '<=', '>='], ['<<', '>>'], ['+', '-'], ['*', '/', '%']];

class Parser {
  private p = 0;
  constructor(private toks: Token[], private src: string) {}

  private get t() { return this.toks[this.p]; }
  private at(text: string, off = 0) { const x = this.toks[this.p + off]; return x !== undefined && x.kind !== 'str' && x.kind !== 'char' && x.text === text; }
  private eat(text: string) { if (this.at(text)) { this.p++; return true; } return false; }
  private expect(text: string) {
    if (!this.eat(text)) throw new CppSyntaxError(`expected '${text}' but found '${this.t.text || 'end of file'}'`, this.t.line);
  }
  private ident(): string {
    if (this.t.kind !== 'id') throw new CppSyntaxError(`expected a name but found '${this.t.text || 'end of file'}'`, this.t.line);
    return this.toks[this.p++].text;
  }
  private slice(from: number): string { return this.src.slice(this.toks[from].start, this.toks[this.p - 1].end); }

  // ---------------------------------------------------------------- types
  isTypeStart(off = 0): boolean {
    const x = this.toks[this.p + off];
    if (!x || x.kind !== 'id') return false;
    if (x.text === 'const' || BASE_WORDS.has(x.text)) return true;
    if (x.text === 'std' && this.at('::', off + 1)) { const y = this.toks[this.p + off + 2]; return y?.text === 'string' || y?.text === 'vector'; }
    return x.text === 'string' || x.text === 'vector';
  }

  parseType(): Ty {
    let isConst = false;
    if (this.eat('const')) isConst = true;
    if (this.at('std') && this.at('::', 1)) { this.p += 2; }
    let name = this.ident();
    let args: Ty[] | undefined;
    if (name === 'unsigned') { this.eat('int'); }
    else if (name === 'vector') { this.expect('<'); args = [this.parseType()]; this.expect('>'); }
    else if (!BASE_WORDS.has(name) && name !== 'string') throw new CppSyntaxError(`unknown type '${name}'`, this.toks[this.p - 1].line);
    if (this.eat('const')) isConst = true;
    const isRef = this.eat('&');
    return { name, args, isConst, isRef };
  }

  // ---------------------------------------------------------------- expressions
  parseExpr(): Expr { return this.parseAssign(); }

  private parseAssign(): Expr {
    const start = this.p;
    const l = this.parseCond();
    if (this.t.kind === 'op' && ASSIGN_OPS.has(this.t.text)) {
      const op = this.toks[this.p++].text;
      const r = this.parseAssign();
      return { k: 'assign', op, l, r, src: this.slice(start), line: this.toks[start].line };
    }
    return l;
  }

  private parseCond(): Expr {
    const start = this.p;
    const c = this.parseBin(0);
    if (this.eat('?')) {
      const a = this.parseAssign();
      this.expect(':');
      const b = this.parseAssign();
      return { k: 'cond', c, a, b, src: this.slice(start), line: this.toks[start].line };
    }
    return c;
  }

  private parseBin(level: number): Expr {
    if (level >= LEVELS.length) return this.parseUnary();
    const start = this.p;
    let l = this.parseBin(level + 1);
    while (this.t.kind === 'op' && LEVELS[level].includes(this.t.text)) {
      const op = this.toks[this.p++].text;
      const r = this.parseBin(level + 1);
      l = { k: 'binary', op, l, r, src: this.slice(start), line: this.toks[start].line };
    }
    return l;
  }

  private parseUnary(): Expr {
    const start = this.p, line = this.t.line;
    if (this.t.kind === 'op' && ['-', '+', '!', '++', '--'].includes(this.t.text)) {
      const op = this.toks[this.p++].text as '-' | '+' | '!' | '++' | '--';
      const e = this.parseUnary();
      return { k: 'unary', op, e, src: this.slice(start), line };
    }
    if (this.at('(') && this.isTypeStart(1)) {
      this.p++; const ty = this.parseType(); this.expect(')');
      const e = this.parseUnary();
      return { k: 'cast', ty, e, src: this.slice(start), line };
    }
    return this.parsePostfix();
  }

  private parsePostfix(): Expr {
    const start = this.p, line = this.t.line;
    let e = this.parsePrimary();
    for (;;) {
      if (this.at('++') || this.at('--')) { const op = this.toks[this.p++].text as '++' | '--'; e = { k: 'postfix', op, e, src: this.slice(start), line }; }
      else if (this.at('[')) { this.p++; const idx = this.parseExpr(); this.expect(']'); e = { k: 'index', base: e, idx, src: this.slice(start), line }; }
      else if (this.at('.')) {
        this.p++; const name = this.ident(); this.expect('(');
        const args = this.parseArgs();
        e = { k: 'method', obj: e, name, args, src: this.slice(start), line };
      } else return e;
    }
  }

  private parseArgs(): Expr[] {
    const args: Expr[] = [];
    if (!this.eat(')')) { do args.push(this.parseAssign()); while (this.eat(',')); this.expect(')'); }
    return args;
  }

  private parsePrimary(): Expr {
    const start = this.p, x = this.t, line = x.line;
    if (x.kind === 'num') { this.p++; return { k: 'num', v: x.value as number, isDouble: !!x.isDouble, isUnsigned: !!x.isUnsigned, src: x.text, line }; }
    if (x.kind === 'char') { this.p++; return { k: 'char', v: x.value as string, src: x.text, line }; }
    if (x.kind === 'str') {
      this.p++; let v = x.value as string;
      while (this.t.kind === 'str') v += this.toks[this.p++].value as string; // adjacent literals are concatenated
      return { k: 'str', v, src: this.slice(start), line };
    }
    if (x.kind === 'op' && x.text === '(') { this.p++; const e = this.parseExpr(); this.expect(')'); return { ...e, src: this.slice(start) }; }
    if (x.kind === 'id') {
      if (x.text === 'true' || x.text === 'false') { this.p++; return { k: 'bool', v: x.text === 'true', src: x.text, line }; }
      if (x.text === 'static_cast') {
        this.p++; this.expect('<'); const ty = this.parseType(); this.expect('>'); this.expect('('); const e = this.parseExpr(); this.expect(')');
        return { k: 'cast', ty, e, src: this.slice(start), line };
      }
      let name = this.ident();
      while (this.at('::')) { this.p++; name += '::' + this.ident(); }
      if (name === 'std::numeric_limits' && this.at('<')) { // std::numeric_limits<T>::min() / max()
        this.p++; const ty = this.parseType(); this.expect('>'); this.expect('::'); const fn = this.ident(); this.expect('('); this.expect(')');
        return { k: 'call', name: `limits:${ty.name}:${fn}`, args: [], src: this.slice(start), line };
      }
      if (this.eat('(')) { const args = this.parseArgs(); return { k: 'call', name, args, src: this.slice(start), line }; }
      return { k: 'id', name, src: this.slice(start), line };
    }
    throw new CppSyntaxError(`expected an expression but found '${x.text || 'end of file'}'`, line);
  }

  // ---------------------------------------------------------------- statements
  parseStmt(): Stmt {
    const line = this.t.line;
    if (this.at('{')) return this.parseBlock();
    if (this.eat(';')) return { k: 'empty', line };
    if (this.eat('if')) {
      this.expect('('); const c = this.parseExpr(); this.expect(')');
      const then = this.parseStmt();
      const els = this.eat('else') ? this.parseStmt() : undefined;
      return { k: 'if', c, then, else: els, line };
    }
    if (this.eat('while')) { this.expect('('); const c = this.parseExpr(); this.expect(')'); return { k: 'while', c, body: this.parseStmt(), line }; }
    if (this.eat('do')) {
      const body = this.parseStmt(); this.expect('while'); this.expect('(');
      const condLine = this.t.line; const c = this.parseExpr(); this.expect(')'); this.expect(';');
      return { k: 'do', body, c, line, condLine };
    }
    if (this.eat('for')) {
      this.expect('(');
      let init: Stmt | undefined;
      if (!this.eat(';')) init = this.isTypeStart() ? this.parseDecl() : this.parseExprStmt();
      const c = this.at(';') ? undefined : this.parseExpr(); this.expect(';');
      const step = this.at(')') ? undefined : this.parseExpr(); this.expect(')');
      return { k: 'for', init, c, step, body: this.parseStmt(), line };
    }
    if (this.eat('return')) { const e = this.at(';') ? undefined : this.parseExpr(); this.expect(';'); return { k: 'return', e, line }; }
    if (this.eat('break')) { this.expect(';'); return { k: 'break', line }; }
    if (this.eat('continue')) { this.expect(';'); return { k: 'continue', line }; }
    if (this.eat('switch')) {
      this.expect('('); const e = this.parseExpr(); this.expect(')'); this.expect('{');
      const cases: { label: Expr | null; body: Stmt[]; line: number }[] = [];
      while (!this.eat('}')) {
        const cl = this.t.line;
        let label: Expr | null;
        if (this.eat('case')) { label = this.parseCond(); } else { this.expect('default'); label = null; }
        this.expect(':');
        const body: Stmt[] = [];
        while (!this.at('case') && !this.at('default') && !this.at('}')) body.push(this.parseStmt());
        cases.push({ label, body, line: cl });
      }
      return { k: 'switch', e, cases, line };
    }
    if (this.isTypeStart()) return this.parseDecl();
    return this.parseExprStmt();
  }

  private parseExprStmt(): Stmt {
    const line = this.t.line; const e = this.parseExpr(); this.expect(';'); return { k: 'expr', e, line };
  }

  private parseDecl(): Stmt & { k: 'decl' } {
    const line = this.t.line; const ty = this.parseType();
    const items: DeclItem[] = [];
    do {
      const il = this.t.line; const name = this.ident();
      let init: Expr | undefined, ctor: Expr[] | undefined;
      if (this.eat('=')) init = this.parseAssign();
      else if (this.eat('(')) ctor = this.parseArgs();
      items.push({ name, init, ctor, line: il });
    } while (this.eat(','));
    this.expect(';');
    return { k: 'decl', ty, items, line };
  }

  parseBlock(): Stmt & { k: 'block' } {
    const line = this.t.line; this.expect('{');
    const body: Stmt[] = [];
    while (!this.at('}')) { if (this.t.kind === 'eof') throw new CppSyntaxError("expected '}' before end of file", this.t.line); body.push(this.parseStmt()); }
    const endLine = this.t.line; this.expect('}');
    return { k: 'block', body, line, endLine };
  }

  // ---------------------------------------------------------------- program
  parseProgram(): Program {
    const funcs: FuncDef[] = [], globals: (Stmt & { k: 'decl' })[] = [], includes: string[] = [];
    while (this.t.kind !== 'eof') {
      if (this.t.kind === 'id' && this.t.text.startsWith('#')) { includes.push(this.t.text); this.p++; continue; }
      if (this.at('using')) { while (!this.eat(';')) this.p++; continue; }
      const line = this.t.line;
      const save = this.p;
      const ty = this.parseType();
      const name = this.ident();
      if (this.eat('(')) {
        const params: Param[] = [];
        if (!this.eat(')')) {
          do { const pty = this.parseType(); params.push({ ty: pty, name: this.ident() }); } while (this.eat(','));
          this.expect(')');
        }
        if (this.eat(';')) continue; // forward declaration
        funcs.push({ name, ret: ty, params, body: this.parseBlock(), line });
      } else { this.p = save; globals.push(this.parseDecl()); }
    }
    return { funcs, globals, includes };
  }

  parseFragment(): Stmt[] {
    const out: Stmt[] = [];
    while (this.t.kind !== 'eof') {
      if (this.t.kind === 'id' && this.t.text.startsWith('#')) { this.p++; continue; }
      out.push(this.parseStmt());
    }
    return out;
  }
}

export function parseProgram(src: string): Program { return new Parser(lex(src), src).parseProgram(); }
export function parseFragment(src: string): Stmt[] { return new Parser(lex(src), src).parseFragment(); }

/** Parse a single expression (used by the expression-tree figures). */
export function parseExpression(src: string): Expr {
  const p = new Parser(lex(src), src);
  const e = p.parseExpr();
  return e;
}
