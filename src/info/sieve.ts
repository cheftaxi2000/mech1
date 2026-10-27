/** The Sieve of Eratosthenes, round by round (notes Code 7.1): the pure model behind the figure. */
export interface SieveRound {
  /** the number that was found to be prime in this round */
  prime: number;
  /** its proper multiples that were crossed out for the first time */
  fresh: number[];
  /** its proper multiples that were already crossed out earlier (the program writes `true` again, harmlessly) */
  again: number[];
}

/** All rounds for the numbers 2 … n-1: one round per prime. */
export function sieveRounds(n: number): SieveRound[] {
  const crossed = new Array<boolean>(Math.max(n, 0)).fill(false);
  const rounds: SieveRound[] = [];
  for (let i = 2; i < n; ++i) {
    if (crossed[i]) continue;
    const fresh: number[] = [], again: number[] = [];
    for (let m = 2 * i; m < n; m += i) { (crossed[m] ? again : fresh).push(m); crossed[m] = true; }
    rounds.push({ prime: i, fresh, again });
  }
  return rounds;
}

export const sievePrimes = (n: number): number[] => sieveRounds(n).map((r) => r.prime);
