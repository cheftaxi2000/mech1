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
const NOBREAK_MAX = 48;

/**
 * Inline math. `p` = punctuation that directly follows the formula ("." "," ":" ")" …): it is kept on
 * the same line as the formula (a KaTeX box allows a line break before the next character otherwise).
 */
export function M({ children, p }: { children: string; p?: string }) {
  const tex = children.length <= NOBREAK_MAX ? `{${children}}` : children;
  const { html, error } = useMemo(() => render(tex, false), [tex]);
  if (error) return <code className="tex-error" title={error}>{children}</code>;
  const math = <span dangerouslySetInnerHTML={{ __html: html }} />;
  return p ? <span className="nowrap">{math}{p}</span> : math;
}

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
