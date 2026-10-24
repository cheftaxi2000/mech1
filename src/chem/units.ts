/**
 * Dimensional analysis (exercise class 1, p. 8): a value times conversion factors «desired unit / given unit», in which the given
 * units cancel. A factor is `{num, den}`: `num.value num.unit = den.value den.unit`, e.g. 1 kcal = 1000 cal.
 */
export interface Qty { value: number; unit: string }
export interface Factor { num: Qty; den: Qty }

export const factor = (numValue: number, numUnit: string, denValue: number, denUnit: string): Factor => ({ num: { value: numValue, unit: numUnit }, den: { value: denValue, unit: denUnit } });

/** Apply the factors in order; each factor must have the running unit in its denominator (the units cancel). */
export function convert(start: Qty, factors: Factor[]): Qty {
  let v = start.value, u = start.unit;
  for (const f of factors) {
    if (f.den.unit !== u) throw new Error(`unit ${u} does not cancel against ${f.den.unit}`);
    v = (v * f.num.value) / f.den.value;
    u = f.num.unit;
  }
  return { value: v, unit: u };
}

/** The unit after each factor, starting with the given unit: the path the unit takes. */
export const unitPath = (start: Qty, factors: Factor[]): string[] => [start.unit, ...factors.map((f) => f.num.unit)];

/** SI prefixes to know (exercise class 1, p. 6): symbol, name, power of ten. */
export const PREFIXES: { sym: string; de: string; en: string; exp: number }[] = [
  { sym: 'G', de: 'Giga', en: 'giga', exp: 9 }, { sym: 'M', de: 'Mega', en: 'mega', exp: 6 }, { sym: 'k', de: 'Kilo', en: 'kilo', exp: 3 },
  { sym: 'd', de: 'Dezi', en: 'deci', exp: -1 }, { sym: 'c', de: 'Zenti', en: 'centi', exp: -2 }, { sym: 'm', de: 'Milli', en: 'milli', exp: -3 },
  { sym: '\\mu', de: 'Mikro', en: 'micro', exp: -6 }, { sym: 'n', de: 'Nano', en: 'nano', exp: -9 }, { sym: 'p', de: 'Piko', en: 'pico', exp: -12 },
];
