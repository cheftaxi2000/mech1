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

export function M({ children }: { children: string }) {
  const { html, error } = useMemo(() => render(children, false), [children]);
  if (error) return <code className="tex-error" title={error}>{children}</code>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
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
