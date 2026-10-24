import { convert, type Factor, type Qty } from './units';

const unit = (s: string, cancelled: boolean) => (cancelled ? String.raw`\cancel{\mathrm{${s}}}` : String.raw`\mathrm{${s}}`);
const num = (x: number, de: boolean) => (de ? String(x).replace('.', '{,}') : String(x));

/**
 * TeX of the conversion chain after `k` factors have been applied: the given value, the factors, and the units that have
 * cancelled so far (struck through); with k = all factors the result follows. Units are TeX-safe strings (`kcal`, `m^3`).
 */
export function chainTex(start: Qty, factors: Factor[], k: number, de = false, digits = 2): string {
  const parts: string[] = [String.raw`${num(start.value, de)}\,${unit(start.unit, k >= 1)}`];
  factors.slice(0, Math.max(0, k)).forEach((f, i) => {
    const cancelNext = k >= i + 2; // this factor's numerator unit cancels against the next factor's denominator
    parts.push(String.raw`\cdot\frac{${num(f.num.value, de)}\,${unit(f.num.unit, cancelNext)}}{${num(f.den.value, de)}\,${unit(f.den.unit, true)}}`);
  });
  let out = parts.join('');
  if (k >= factors.length && factors.length > 0) {
    const r = convert(start, factors);
    const exp = Math.floor(Math.log10(Math.abs(r.value)));
    const mant = r.value / 10 ** exp;
    const val = Math.abs(exp) >= 4 ? String.raw`${num(Number(mant.toPrecision(digits)), de)}\times 10^{${exp}}` : num(Number(r.value.toPrecision(digits)), de);
    out += String.raw` = ${val}\,\mathrm{${r.unit}}`;
  }
  return out;
}
