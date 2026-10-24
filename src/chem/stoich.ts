/**
 * Stoichiometry (lecture 1, slides 26–31): grams ↔ moles ↔ particles and «how many grams of B react with m grams of A».
 * `molarMass` (g/mol) is the formula weight (in u) read as grams per mole (slide 30).
 */
import { N_A, u_kg } from './constants';
import { molarMass } from './formula';

/** n = m / M */
export const molesFromGrams = (grams: number, formula: string): number => grams / molarMass(formula);
export const gramsFromMoles = (mol: number, formula: string): number => mol * molarMass(formula);
export const particlesFromMoles = (mol: number): number => mol * N_A;
export const molesFromParticles = (n: number): number => n / N_A;

/** Mass of substance B (coefficient b) that reacts with `grams` of substance A (coefficient a): mol A → mol B by the ratio b/a → grams. */
export function massOfB(grams: number, A: string, a: number, B: string, b: number): number {
  return gramsFromMoles((molesFromGrams(grams, A) * b) / a, B);
}

/** The long route of slide 28: g → u → molecules → molecules → u → g, with the slide's rounded masses. */
export function slideRoute(gramsH2: number, fwH2 = 2.00, fwO2 = 32.0, uKg = 1.66e-27): { moleculesH2: number; moleculesO2: number; gramsO2: number } {
  const moleculesH2 = ((gramsH2 / 1000) / uKg) / fwH2; // g → kg → u → molecules
  const moleculesO2 = moleculesH2 / 2; // 2 H₂ : 1 O₂
  const gramsO2 = moleculesO2 * fwO2 * uKg * 1000; // molecules → u → kg → g
  return { moleculesH2, moleculesO2, gramsO2 };
}

/** Mass of one molecule in grams: M / N_A (also 1 u = 1.66×10⁻²⁴ g). */
export const gramsPerParticle = (formula: string): number => molarMass(formula) / N_A;

/** One mole of atomic mass units is one gram: N_A · u = 1 g/mol. */
export const gramsPerMoleOfU = (): number => N_A * u_kg * 1000;

/** Mass balance of a balanced equation: Σ coefficient · M on the left equals the right (law of conservation of mass). */
export function sides(reactants: [number, string][], products: [number, string][]): { left: number; right: number } {
  const s = (xs: [number, string][]) => xs.reduce((t, [c, f]) => t + c * molarMass(f), 0);
  return { left: s(reactants), right: s(products) };
}
