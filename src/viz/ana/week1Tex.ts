/** TeX for the degree-rule read-out (pure; tested in week1Tex.test.ts). */
import type { Poly } from '../../analysis/folgen';
import { num, type Lang } from './week1Scenes';

const pow = (e: number) => (e === 1 ? 'n' : `n^{${e}}`);
/** One term c·n^e without its sign: 5n^{3}, 7, \frac{3}{n}. */
function body(c: number, e: number) {
  const a = Math.abs(c);
  if (e > 0) return `${a === 1 ? '' : a}${pow(e)}`;
  if (e === 0) return `${a}`;
  return `\\frac{${a}}{${pow(-e)}}`;
}
const join = (parts: [number, string][]) => parts.map(([c, b], i) => (i === 0 ? (c < 0 ? '-' : '') + b : (c < 0 ? ' - ' : ' + ') + b)).join('');

/** Symbolic polynomial (powers may be negative after dividing), e.g. 7 + \frac{3}{n}. */
export const polyTex = (P: Poly) => join(P.map(([c, e]) => [c, body(c, e)]));

/** A positive number with a sensible number of digits: ≥ 100 → integer, ≥ 1 → 2 decimals, else 4 decimals. */
export const valTex = (v: number, lang: Lang) => num(v, v >= 100 ? 0 : v >= 1 ? 2 : 4, lang);

/** The same polynomial with every term evaluated at n, e.g. 7 + 0{,}3. */
export const polyNumTex = (P: Poly, n: number, lang: Lang) => join(P.map(([c, e]) => [c, valTex(Math.abs(c) * n ** e, lang)]));

/** Signed value. */
export const signedTex = (v: number, lang: Lang) => (v < 0 ? '-' : '') + valTex(Math.abs(v), lang);
