/** Integers with B bits (notes §4.1): the same bit pattern read as `unsigned` (0 … 2^B − 1) or as `int` (−2^(B−1) … 2^(B−1) − 1). */
export const size = (B: number) => 2 ** B;
export const toSigned = (u: number, B: number) => (u >= size(B - 1) ? u - size(B) : u);
export const toUnsigned = (x: number, B: number) => ((x % size(B)) + size(B)) % size(B);
export const bits = (u: number, B: number) => u.toString(2).padStart(B, '0');
export const signedRange = (B: number): [number, number] => [-size(B - 1), size(B - 1) - 1];
/** Does the mathematical result `x` of an int operation leave the domain? */
export const overflowsInt = (x: number, B: number) => x < signedRange(B)[0] || x > signedRange(B)[1];
/** Apply an operation to the pattern `u` and wrap: the hardware result for `+`, `-` and `*` on B bits. */
export function apply(u: number, op: '+' | '-' | '*', k: number, B: number): { u: number; wrapped: boolean; exact: number } {
  const exact = op === '+' ? toSigned(u, B) + k : op === '-' ? toSigned(u, B) - k : toSigned(u, B) * k;
  return { u: toUnsigned(exact, B), wrapped: overflowsInt(exact, B), exact };
}
