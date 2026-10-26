/**
 * Supplement to «Kraft» (p. 29): how big is 1 N? Weights of everyday things, W = m · g with g = 9.81 N/kg.
 * Round masses (not from the Skript); the figure shows them on a logarithmic scale.
 */
export const G_EARTH = 9.81; // N/kg (rounded)
export const weightOfMass = (m: number): number => m * G_EARTH;

export interface ScaleItem { id: string; de: string; en: string; m: number }
export const SCALE_ITEMS: readonly ScaleItem[] = [
  { id: 'clip', de: 'Büroklammer', en: 'paper clip', m: 0.001 },
  { id: 'apple', de: 'Apfel', en: 'apple', m: 0.1 },
  { id: 'water', de: 'Liter Wasser', en: 'litre of water', m: 1 },
  { id: 'person', de: 'Erwachsener', en: 'adult', m: 70 },
  { id: 'car', de: 'Kleinwagen', en: 'small car', m: 1200 },
  { id: 'truck', de: 'Lastwagen', en: 'lorry', m: 40000 },
];
