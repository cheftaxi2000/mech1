/**
 * Lexer for the small C++ subset the course uses (lecture notes infln01–07). It exists so that the traces shown in the
 * lessons are *computed*, never typed by hand (src/info/cpp/interp.ts); programs are cross-checked with g++ in the tests.
 */
export type TokKind = 'num' | 'char' | 'str' | 'id' | 'op' | 'eof';
export interface Token {
  kind: TokKind;
  text: string;
  /** For `num`: the literal's value and whether it is a double literal; for `char`/`str`: the decoded content. */
  value?: number | string;
  isDouble?: boolean;
  isUnsigned?: boolean;
  line: number;
  /** Offsets into the source (start inclusive, end exclusive) – used to quote expressions back to the student. */
  start: number;
  end: number;
}

export class CppSyntaxError extends Error {
  constructor(message: string, public line: number) { super(`line ${line}: ${message}`); }
}

const OPS = ['<<=', '>>=', '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=', '->', '::',
  '+', '-', '*', '/', '%', '<', '>', '=', '!', '&', '|', '^', '~', '?', ':', ';', ',', '(', ')', '{', '}', '[', ']', '.'];

const ESC: Record<string, string> = { n: '\n', t: '\t', r: '\r', '0': '\0', '\\': '\\', "'": "'", '"': '"' };

export function lex(src: string): Token[] {
  const out: Token[] = [];
  let i = 0, line = 1;
  const n = src.length;
  while (i < n) {
    const c = src[i];
    if (c === '\n') { line++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && src[i + 1] === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') line++; i++; }
      i += 2; continue;
    }
    if (c === '#') { // preprocessor line: kept as one `id`-like token "#include <...>" so the parser can check includes
      let j = i; while (j < n && src[j] !== '\n') j++;
      out.push({ kind: 'id', text: src.slice(i, j).trim(), line, start: i, end: j }); i = j; continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] ?? ''))) {
      const m = /^(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?[uUfF]?/.exec(src.slice(i))!;
      let text = m[0];
      const suffix = /[uUfF]$/.test(text) ? text.slice(-1).toLowerCase() : '';
      const body = suffix ? text.slice(0, -1) : text;
      const isDouble = /[.eE]/.test(body) || suffix === 'f';
      out.push({ kind: 'num', text, value: Number(body), isDouble, isUnsigned: suffix === 'u', line, start: i, end: i + text.length });
      i += text.length; continue;
    }
    if (/[A-Za-z_]/.test(c)) {
      let j = i; while (j < n && /\w/.test(src[j])) j++;
      out.push({ kind: 'id', text: src.slice(i, j), line, start: i, end: j }); i = j; continue;
    }
    if (c === '"' || c === "'") {
      let j = i + 1, s = '';
      while (j < n && src[j] !== c) {
        if (src[j] === '\n') throw new CppSyntaxError('missing terminating quote', line);
        if (src[j] === '\\') { const e = ESC[src[j + 1]]; if (e === undefined) throw new CppSyntaxError(`unknown escape \\${src[j + 1]}`, line); s += e; j += 2; } else s += src[j++];
      }
      if (j >= n) throw new CppSyntaxError('missing terminating quote', line);
      if (c === "'" && s.length !== 1) throw new CppSyntaxError('a char literal holds exactly one character', line);
      out.push({ kind: c === '"' ? 'str' : 'char', text: src.slice(i, j + 1), value: s, line, start: i, end: j + 1 }); i = j + 1; continue;
    }
    const op = OPS.find((o) => src.startsWith(o, i));
    if (!op) throw new CppSyntaxError(`unexpected character '${c}'`, line);
    out.push({ kind: 'op', text: op, line, start: i, end: i + op.length }); i += op.length;
  }
  out.push({ kind: 'eof', text: '', line, start: n, end: n });
  return out;
}
