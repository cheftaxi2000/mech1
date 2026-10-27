import { Fragment, type ReactNode } from 'react';
import '../viz/info/info.css';

const KEYWORDS = new Set(['int', 'double', 'float', 'bool', 'char', 'unsigned', 'long', 'short', 'void', 'auto', 'const', 'if', 'else', 'while', 'do', 'for', 'switch', 'case', 'default', 'break', 'continue', 'return', 'true', 'false', 'using', 'namespace', 'struct', 'class']);

export type Tok = { kind: 'kw' | 'num' | 'str' | 'com' | 'pre' | 'txt'; text: string };

/** Tiny C++ tokenizer: just enough to colour keywords, numbers, strings, comments and #include lines. */
export function tokenize(line: string): Tok[] {
  const out: Tok[] = [];
  const push = (kind: Tok['kind'], text: string) => { if (text) out.push({ kind, text }); };
  const ci = line.search(/\/\/(?=(?:[^"]*"[^"]*")*[^"]*$)/); // a `//` outside of a string literal
  const code = ci < 0 ? line : line.slice(0, ci);
  if (/^\s*#\w+/.test(code)) push('pre', code);
  else {
    const re = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)')|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)/g;
    let last = 0, m: RegExpExecArray | null;
    while ((m = re.exec(code))) {
      push('txt', code.slice(last, m.index));
      if (m[1]) push('str', m[0]); else if (m[2]) push('num', m[0]); else push(KEYWORDS.has(m[0]) ? 'kw' : 'txt', m[0]);
      last = m.index + m[0].length;
    }
    push('txt', code.slice(last));
  }
  if (ci >= 0) push('com', line.slice(ci));
  return out;
}

/**
 * A code listing (never translated). `active` lines are highlighted (the line that runs now), `marks` adds a small
 * annotation in the margin of a line. Comments inside the code are shown dimmed.
 */
export function Code({ code, active = [], marks = {}, label, className = '' }: {
  code: string; active?: number[]; marks?: Record<number, ReactNode>; label?: string; className?: string;
}) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <pre className={`code ${className}`} aria-label={label} tabIndex={0}>
      <code>
        {lines.map((ln, i) => (
          <span key={i} className={`cl${active.includes(i) ? ' on' : ''}`}>
            <span className="cn" aria-hidden="true">{i + 1}</span>
            <span className="ct">
              {tokenize(ln).map((t, k) => <span key={k} className={`tk-${t.kind}`}>{t.text}</span>)}
              {ln === '' && ' '}
            </span>
            {marks[i] !== undefined && <span className="cm">{marks[i]}</span>}
          </span>
        ))}
      </code>
    </pre>
  );
}

/** Inline code: a variable, keyword or short expression inside a sentence. */
export function K({ children }: { children: ReactNode }) {
  return <Fragment><code className="ic">{children}</code></Fragment>;
}
