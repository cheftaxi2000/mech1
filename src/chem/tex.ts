/**
 * Chemical formulae and reactions as TeX, so lessons never hand-write `\mathrm{H_2O}`:
 *   chemTex('2 H2 + O2 -> 2 H2O')      → \mathrm{2\,H_{2} + O_{2} \longrightarrow 2\,H_{2}O}
 *   chemTex('Ca^2+ + 2 OH^-')          → charges after ^ (digits then + or -)
 *   chemTex('H2O(l)'), '(g)', '(s)', '(aq)' → state symbols
 * Digits directly after an element symbol or «)» are subscripts; digits at the start of a term are coefficients.
 * Arrows: `->` reaction, `<->` / `<=>` equilibrium, `=>` implies.
 */
export function chemTex(src: string): string {
  const re = /(\s*(?:<->|<=>|->|=>)\s*|\s\+\s|\s+|\^[0-9]*[+-]|\([a-z]{1,2}\)|[A-Z][a-z]?|[0-9]+|[()·.]|.)/g;
  let out = '';
  let prev: 'sym' | 'close' | 'other' = 'other';
  for (const m of src.matchAll(re)) {
    const t = m[0], a = t.trim();
    if (a === '->') { out += String.raw`\;\longrightarrow\;`; prev = 'other'; }
    else if (a === '<->' || a === '<=>') { out += String.raw`\;\rightleftharpoons\;`; prev = 'other'; }
    else if (a === '=>') { out += String.raw`\;\Rightarrow\;`; prev = 'other'; }
    else if (/^\s\+\s$/.test(t)) { out += String.raw`\;+\;`; prev = 'other'; }
    else if (/^\s+$/.test(t)) { out += String.raw`\,`; prev = 'other'; }
    else if (t[0] === '^') { const body = t.slice(1); const sign = body.slice(-1) === '-' ? '−' : '+'; out += `^{${body.slice(0, -1)}${sign}}`; prev = 'other'; }
    else if (/^\([a-z]{1,2}\)$/.test(t)) { out += String.raw`\,${t}`; prev = 'other'; }
    else if (/^[A-Z][a-z]?$/.test(t)) { out += t; prev = 'sym'; }
    else if (/^[0-9]+$/.test(t)) { out += prev === 'sym' || prev === 'close' ? `_{${t}}` : t; prev = 'other'; }
    else if (t === ')') { out += t; prev = 'close'; }
    else if (t === '·') { out += String.raw`\cdot `; prev = 'other'; }
    else { out += t; prev = 'other'; }
  }
  return String.raw`\mathrm{${out}}`;
}
