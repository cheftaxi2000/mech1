/**
 * Periodic trends (lecture 6, slides 28–32): screening, atomic and ionic radii, ionisation energy.
 */
import { NOBLE_GASES, blockOf, nobleCore, valenceElectrons } from './config';
import { radial } from './orbital';

/** Bonding atomic radii in pm, as printed on the bars of slide 30 (Brown, in units of 10² pm), Z ≤ 54. */
export const ATOMIC_RADIUS: Record<string, number> = {
  H: 31, He: 28,
  Li: 128, Be: 96, B: 84, C: 76, N: 71, O: 66, F: 57, Ne: 58,
  Na: 166, Mg: 141, Al: 121, Si: 111, P: 107, S: 105, Cl: 102, Ar: 106,
  K: 203, Ca: 176, Sc: 170, Ti: 160, V: 153, Cr: 139, Mn: 139, Fe: 132, Co: 126, Ni: 124, Cu: 132, Zn: 122,
  Ga: 122, Ge: 120, As: 119, Se: 120, Br: 120, Kr: 116,
  Rb: 220, Sr: 195, Y: 190, Zr: 175, Nb: 164, Mo: 154, Tc: 147, Ru: 146, Rh: 142, Pd: 139, Ag: 145, Cd: 144,
  In: 142, Sn: 139, Sb: 139, Te: 138, I: 139, Xe: 140,
};

/**
 * First ionisation energies in kJ/mol for Z ≤ 54 — standard tabulated values (NOT on the slides: the slide gives only the trend).
 */
export const FIRST_IE: Record<string, number> = {
  H: 1312, He: 2372,
  Li: 520, Be: 900, B: 801, C: 1086, N: 1402, O: 1314, F: 1681, Ne: 2081,
  Na: 496, Mg: 738, Al: 578, Si: 787, P: 1012, S: 1000, Cl: 1251, Ar: 1521,
  K: 419, Ca: 590, Sc: 633, Ti: 659, V: 651, Cr: 653, Mn: 717, Fe: 763, Co: 760, Ni: 737, Cu: 745, Zn: 906,
  Ga: 579, Ge: 762, As: 947, Se: 941, Br: 1140, Kr: 1351,
  Rb: 403, Sr: 550, Y: 600, Zr: 640, Nb: 652, Mo: 684, Tc: 702, Ru: 710, Rh: 720, Pd: 804, Ag: 731, Cd: 868,
  In: 558, Sn: 709, Sb: 834, Te: 869, I: 1008, Xe: 1170,
};

/** Successive ionisation energies (kJ/mol, standard values, not on the slides): the jump marks the end of the valence electrons. */
export const SUCCESSIVE_IE: Record<string, number[]> = {
  Na: [496, 4562, 6910, 9544],
  Mg: [738, 1451, 7733, 10543],
  Al: [578, 1817, 2745, 11577],
};

/** Ionic radii in pm of the isoelectronic series of slide 31 (all with 10 electrons), with atomic number and charge. */
export const ISOELECTRONIC: { symbol: string; Z: number; charge: number; radius: number }[] = [
  { symbol: 'O', Z: 8, charge: -2, radius: 126 },
  { symbol: 'F', Z: 9, charge: -1, radius: 119 },
  { symbol: 'Na', Z: 11, charge: 1, radius: 116 },
  { symbol: 'Mg', Z: 12, charge: 2, radius: 86 },
  { symbol: 'Al', Z: 13, charge: 3, radius: 68 },
];

/** Shell capacities used to draw the electrons of a "core": 2, 8, 8, 18, 18. */
export const SHELL_SIZES = [2, 8, 8, 18, 18, 32];

/** Number of core electrons = electrons of the noble-gas core (0 for H and He). */
export const coreElectrons = (Z: number) => nobleCore(Z)?.Z ?? 0;
/**
 * Rough effective nuclear charge felt by a valence electron of a main-group element: Z_eff ≈ Z − (all electrons that are not valence electrons),
 * i.e. the number of valence electrons (the core electrons, including filled d and f subshells, screen the nucleus).
 * Not on the slides; it is the simplest form of the idea of slide 28 ("core electrons screen the nucleus"). `null` for the d block, where the
 * simple counting does not work (d electrons screen less well).
 */
export function zeffEstimate(Z: number): number | null {
  if (blockOf(Z) === 'd' || blockOf(Z) === 'f') return null;
  return valenceElectrons(Z);
}

/**
 * Probability of finding a hydrogen-like electron (n, ℓ) closer than r0 (in a₀) to the nucleus: ∫₀^r0 R² r² dr.
 */
export function probabilityInside(n: number, l: number, r0: number, steps = 3000): number {
  const h = r0 / steps;
  let s = 0;
  for (let i = 0; i < steps; i++) { const r = (i + 0.5) * h; s += radial(n, l, r) ** 2 * r * r * h; }
  return s;
}
/** Mean distance ⟨r⟩ = ½(3n² − ℓ(ℓ+1)) a₀ of a hydrogen-like electron. */
export const meanRadius = (n: number, l: number) => 0.5 * (3 * n * n - l * (l + 1));

export { NOBLE_GASES };
