import katex from 'katex';
import { useMemo } from 'react';

/**
 * Lecture notation: vectors are underlined (\v{r} → r̲), matching the Mitschrift.
 * Add new macros here only — never inline ad-hoc notation in lessons.
 */
export const TEX_MACROS: Record<string, string> = {
  '\\v': '\\underline{#1}',
  '\\e': '\\underline{e}_{#1}',
  '\\dd': '\\mathrm{d}',
};

/** Renders TeX; on a syntax error shows a visible `.tex-error` box (caught by the e2e tests). */
function render(tex: string, displayMode: boolean): { html: string; error?: string } {
  try {
    return { html: katex.renderToString(tex, { displayMode, throwOnError: true, macros: { ...TEX_MACROS }, strict: 'error' }) };
  } catch (e) {
    return { html: '', error: (e as Error).message };
  }
}

/** Inline formulas up to this length never break across lines (KaTeX would otherwise break after = or <). */
const NOBREAK_MAX = 28;

/** Trailing punctuation as TeX, so it is part of the formula's last box and never wraps onto a line of its own. */
function punctTex(p: string): string {
  const check = p.includes('✓') ? String.raw`\;\checkmark` : '';
  const rest = p.replace(/[✓\s]/g, '');
  return check + (rest ? String.raw`\text{${rest}}` : '');
}

/**
 * Inline math. `p` = punctuation directly after the formula ("." "," ":" ")" "✓." …). It is typeset
 * inside the formula (text font) so a line can never start with it.
 */
export function M({ children, p }: { children: string; p?: string }) {
  const body = children.length <= NOBREAK_MAX ? `{${children}}` : children;
  // quotation marks (« » “ ” „) have no KaTeX glyph: keep them as text, glued to the formula by a no-wrap span
  const quoted = !!p && QUOTES.test(p);
  const tex = p && !quoted ? body + punctTex(p) : body;
  const { html, error } = useMemo(() => render(tex, false), [tex]);
  if (error) return <code className="tex-error" title={error}>{children}</code>;
  if (quoted) return <span className="nowrap"><span dangerouslySetInnerHTML={{ __html: html }} />{p}</span>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}
const QUOTES = /[«»“”„]/;

export function MD({ children, tag }: { children: string; tag?: string }) {
  const { html, error } = useMemo(() => render(children, true), [children]);
  if (error) return <pre className="tex-error" title={error}>{children}</pre>;
  return (
    <div className="eq">
      <div className="eq-body" dangerouslySetInnerHTML={{ __html: html }} />
      {tag && <span className="eq-tag">({tag})</span>}
    </div>
  );
}
