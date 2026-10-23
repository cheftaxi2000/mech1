import { bySymbol } from './elements';

/** Parse a formula such as `Ca(OH)2` or `Al2(SO4)3` (digits are subscripts) into element counts. Charges and hydrates are not handled. */
export function parseFormula(formula: string): Record<string, number> {
  let i = 0;
  const readNumber = () => {
    let s = '';
    while (i < formula.length && /[0-9]/.test(formula[i])) s += formula[i++];
    return s ? Number(s) : 1;
  };
  const group = (closing: boolean): Record<string, number> => {
    const out: Record<string, number> = {};
    const add = (o: Record<string, number>, k: number) => { for (const [s, n] of Object.entries(o)) out[s] = (out[s] ?? 0) + n * k; };
    while (i < formula.length) {
      const c = formula[i];
      if (c === '(') { i++; const inner = group(true); add(inner, readNumber()); }
      else if (c === ')') { if (!closing) throw new Error(`unbalanced «)» in ${formula}`); i++; return out; }
      else if (/[A-Z]/.test(c)) {
        let sym = c; i++;
        while (i < formula.length && /[a-z]/.test(formula[i])) sym += formula[i++];
        bySymbol(sym); // throws for unknown symbols
        add({ [sym]: 1 }, readNumber());
      } else throw new Error(`unexpected «${c}» in ${formula}`);
    }
    if (closing) throw new Error(`missing «)» in ${formula}`);
    return out;
  };
  return group(false);
}

/** Molar mass in g/mol (sum of atomic weights). */
export const molarMass = (formula: string): number =>
  Object.entries(parseFormula(formula)).reduce((s, [sym, n]) => s + n * bySymbol(sym).mass, 0);

/** Mass fraction of each element in the compound. */
export function massFractions(formula: string): Record<string, number> {
  const M = molarMass(formula);
  return Object.fromEntries(Object.entries(parseFormula(formula)).map(([s, n]) => [s, (n * bySymbol(s).mass) / M]));
}
