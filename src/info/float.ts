/** Exact values of floating point numbers (notes §4.2): the nearest `float`/`double` to a decimal, written out digit by digit. */

/** The exact decimal expansion of a finite double (every double is a finite decimal). */
export function exactDecimal(x: number): string {
  if (!Number.isFinite(x)) return String(x);
  if (x === 0) return '0';
  const neg = x < 0; x = Math.abs(x);
  const dv = new DataView(new ArrayBuffer(8)); dv.setFloat64(0, x);
  const hi = dv.getUint32(0), lo = dv.getUint32(4);
  const expBits = (hi >>> 20) & 0x7ff;
  let m = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo);
  let e: number;
  if (expBits === 0) e = -1074; else { m |= 1n << 52n; e = expBits - 1075; }
  let s: string;
  if (e >= 0) s = (m << BigInt(e)).toString();
  else {
    const digits = (m * 5n ** BigInt(-e)).toString().padStart(-e + 1, '0');
    const k = digits.length - -e;
    s = `${digits.slice(0, k)}.${digits.slice(k)}`.replace(/\.?0+$/, '');
  }
  return (neg ? '-' : '') + s;
}

/** Distance from |x| to the next larger number of the same type: 2^(exponent − p + 1), p = 24 (float) or 53 (double). */
export function spacing(x: number, kind: 'float' | 'double'): number {
  const p = kind === 'float' ? 24 : 53;
  const a = Math.abs(x);
  if (a === 0) return kind === 'float' ? 2 ** -149 : 2 ** -1074;
  const e = Math.floor(Math.log2(a));
  const ex = 2 ** e > a ? e - 1 : 2 ** (e + 1) <= a ? e + 1 : e; // guard against log2 rounding
  return 2 ** (ex - p + 1);
}

export const toFloat = (x: number) => Math.fround(x);

/** Normalize a typed decimal like "0.10" or "1e-3" for comparison with `exactDecimal`; undefined if it is not a number. */
export function typedDecimal(txt: string): number | undefined {
  const x = Number(txt.trim().replace(',', '.'));
  return txt.trim() !== '' && Number.isFinite(x) ? x : undefined;
}

/** The typed decimal in the same canonical form as `exactDecimal` (no exponent, no superfluous zeros), or undefined if it is not a plain decimal. */
export function canonicalDecimal(txt: string): string | undefined {
  const m = /^\s*([+-]?)(\d*)\.?(\d*)(?:[eE]([+-]?\d+))?\s*$/.exec(txt.replace(',', '.'));
  if (!m || (m[2] === '' && m[3] === '')) return undefined;
  const [, sign, ip, fp, ex] = m;
  let digits = ip + fp;
  let point = ip.length + (ex ? Number(ex) : 0); // position of the decimal point inside `digits`
  if (point <= 0) { digits = '0'.repeat(1 - point) + digits; point = 1; }
  if (point > digits.length) digits += '0'.repeat(point - digits.length);
  let a = digits.slice(0, point).replace(/^0+(?=\d)/, ''), b = digits.slice(point).replace(/0+$/, '');
  if (a === '') a = '0';
  const out = b ? `${a}.${b}` : a;
  return out === '0' ? '0' : (sign === '-' ? '-' : '') + out;
}
