import { describe, expect, it } from 'vitest';
import { G_EARTH, SCALE_ITEMS, weightOfMass } from './kraftScale';

const by = (id: string) => weightOfMass(SCALE_ITEMS.find((i) => i.id === id)!.m);

describe('how big is 1 N? (supplement)', () => {
  it('g = 9.81 N/kg: a litre of water (1 kg) weighs 9.81 N', () => {
    expect(G_EARTH).toBe(9.81);
    expect(by('water')).toBeCloseTo(9.81, 12);
  });
  it('an apple of 100 g weighs about 1 N (0.981 N)', () => {
    expect(by('apple')).toBeCloseTo(0.981, 12);
    expect(Math.abs(by('apple') - 1)).toBeLessThan(0.02);
  });
  it('an adult of 70 kg weighs about 700 N, a small car of 1.2 t about 12 kN, a 40 t lorry about 400 kN', () => {
    expect(by('person')).toBeCloseTo(686.7, 9);
    expect(by('car')).toBeCloseTo(11772, 6);
    expect(by('truck')).toBeCloseTo(392400, 6);
  });
  it('the items are sorted by weight and span the whole log axis (1 mN … 1 MN)', () => {
    const w = SCALE_ITEMS.map((i) => weightOfMass(i.m));
    expect([...w].sort((a, b) => a - b)).toEqual(w);
    expect(w[0]).toBeGreaterThan(1e-3);
    expect(w[w.length - 1]).toBeLessThan(1e6);
  });
});
