import { describe, expect, it } from 'vitest';
import { expectInside, expectNoOverlap, lab, shape } from '../anim/sceneTestKit';
import { acidScene, dispScene, redoxScene, redoxState, N_ACID } from './redoxScenes';
import { SERIES, reducesCation } from '../../chem/activity';

describe('acid strength picture (slides 17, 19)', () => {
  it('splits exactly the requested number of molecules; ions come in pairs', () => {
    for (const k of [0, 2, 5, N_ACID]) {
      const f = acidScene(k);
      expect(f.shapes.filter((x) => x.cls === 'cs-ion-cat' && x.key.startsWith('h') && !x.key.startsWith('sw'))).toHaveLength(k);
      expect(f.shapes.filter((x) => x.cls === 'cs-ion-an' && x.key.startsWith('a'))).toHaveLength(k);
      expect(f.shapes.filter((x) => x.cls === 'cs-aX')).toHaveLength(N_ACID - k);
      expectInside(() => f, 1); expectNoOverlap(() => f, 1, 0.3);
    }
  });
});

describe('Mg + 2 HCl → MgCl₂ + H₂ (slides 23–26)', () => {
  it('every frame inside, final labels do not overlap', () => { expectInside(redoxScene, 3); expectNoOverlap(redoxScene, 3, 0.3); });
  it('step 0: oxidation numbers 0, +1, +1, −1, −1; nothing has moved', () => {
    const f = redoxScene(0, 1, 'en');
    expect(lab(f, 'on-mg-0')?.tex).toBe('0'); expect(lab(f, 'on-h1-0')?.tex).toBe('+1'); expect(lab(f, 'on-cl1-0')?.tex).toBe('-1');
    expect(lab(f, 'on-mg-1')).toBeUndefined();
  });
  it('step 1: two electrons have gone from Mg to the two H; Mg is now +2, H is 0, Cl is still −1', () => {
    const f = redoxScene(1, 1, 'en');
    expect(f.data).toMatchObject({ u: 1, mg: 2, h: 0, cl: -1 });
    expect(lab(f, 'on-mg-1')?.tex).toBe('+2'); expect(lab(f, 'on-h2-1')?.tex).toBe('0');
    expect(shape(f, 'e1')).toBeDefined(); expect(shape(f, 'e2')).toBeDefined();
    expect(shape(f, 'mg-i')?.o).toBe(1);
  });
  it('step 2: oxidised / reduced / unchanged and the electron count; the sum of the changes is zero', () => {
    const f = redoxScene(2, 1, 'de');
    expect(lab(f, 'w-mg')?.tex).toContain('oxidiert'); expect(lab(f, 'w-h')?.tex).toContain('reduziert'); expect(lab(f, 'w-cl')?.tex).toContain('unver');
    expect(lab(f, 'e-mg')?.tex).toContain('-2'); expect(lab(f, 'e-h')?.tex).toContain('+2');
    expect(redoxState(2, 1).num.mg - 0).toBe(2 * (1 - redoxState(2, 1).num.h));
  });
});

describe('metal in a solution (slides 27–28)', () => {
  it('every combination is drawn inside the frame', () => {
    for (const [m, c] of [['Cu', 'Ag'], ['Ag', 'Cu'], ['Fe', 'Cu'], ['Zn', 'Mg'], ['Ni', 'H'], ['Cu', 'H'], ['Al', 'Cu']]) expectInside(() => dispScene(m, c, 'en'), 1);
  });
  it('verdict follows the series: Cu + Ag⁺ reacts, Ag + Cu²⁺ does not, Ni + H⁺ reacts, Cu + H⁺ does not', () => {
    expect(dispScene('Cu', 'Ag', 'en').data.reacts).toBe(1); expect(dispScene('Ag', 'Cu', 'en').data.reacts).toBe(0);
    expect(dispScene('Ni', 'H', 'en').data.reacts).toBe(1); expect(dispScene('Cu', 'H', 'en').data.reacts).toBe(0);
    for (const A of SERIES) for (const B of SERIES) if (A.symbol !== 'H' && B.symbol !== 'H') expect(dispScene(A.symbol, B.symbol, 'en').data.reacts).toBe(reducesCation(A.symbol, B.symbol) ? 1 : 0);
  });
  it('after the reaction the strip is coated (metal) or bubbles rise (acid)', () => {
    expect(shape(dispScene('Fe', 'Cu', 'en'), 'dep0')).toBeDefined();
    expect(shape(dispScene('Zn', 'Mg', 'en'), 'dep0')).toBeUndefined();
    expect(shape(dispScene('Ni', 'H', 'en'), 'bub0')).toBeDefined();
  });
});
