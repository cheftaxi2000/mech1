/**
 * Euclid's algorithm by repeated subtraction (lecture notes Fig. 1.1 / 1.2).
 * Pure functions: the figures and the tests import from here, lessons never recompute.
 */
export interface EuclidState {
  a: number;
  b: number;
  /** What produced this state: the start, `a ← a − b`, or `b ← b − a`. */
  op: 'start' | 'a-b' | 'b-a';
}

const assertPositive = (a: number, b: number) => {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b < 1) throw new RangeError('Euclid needs two strictly positive integers');
};

/** All states of the algorithm, from the input to the final state with a = b (one entry per executed subtraction + the start). */
export function euclidTrace(a: number, b: number): EuclidState[] {
  assertPositive(a, b);
  const out: EuclidState[] = [{ a, b, op: 'start' }];
  while (a !== b) {
    if (a > b) { a -= b; out.push({ a, b, op: 'a-b' }); } else { b -= a; out.push({ a, b, op: 'b-a' }); }
  }
  return out;
}

/** Number of subtractions until a = b. */
export const subtractions = (a: number, b: number) => euclidTrace(a, b).length - 1;

/** The result the algorithm reaches: the value of a (= b) when it stops. */
export const euclid = (a: number, b: number) => euclidTrace(a, b).at(-1)!.a;

/** All positive integers that divide both a and b, ascending. */
export function commonDivisors(a: number, b: number): number[] {
  assertPositive(a, b);
  const out: number[] = [];
  for (let c = 1; c <= Math.min(a, b); c++) if (a % c === 0 && b % c === 0) out.push(c);
  return out;
}

/** Reference implementation with the remainder (footnote 1 of the notes: the improved version). */
export const gcdRemainder = (a: number, b: number): number => { assertPositive(a, b); while (b !== 0) [a, b] = [b, a % b]; return a; };
