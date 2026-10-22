import { describe, expect, it } from 'vitest';
import { FRACS, divided } from '../../analysis/folgen';
import { polyNumTex, polyTex, signedTex } from './week1Tex';

describe('degree-rule TeX', () => {
  it('slide polynomials as written', () => {
    expect(polyTex(FRACS.gt.P)).toBe('5n^{3} + 3n + 7');
    expect(polyTex(FRACS.gt.Q)).toBe('n^{2} - 2n');
    expect(polyTex(FRACS.lt.P)).toBe('n^{5} - 4n');
    expect(polyTex(FRACS.neg.P)).toBe('-2n^{3} + 3n');
  });
  it('after dividing by the highest power of the denominator', () => {
    const [P, Q] = divided(FRACS.eq.P, FRACS.eq.Q);
    expect(polyTex(P)).toBe('7 + \\frac{3}{n}'); expect(polyTex(Q)).toBe('4');
    const [P1, Q1] = divided(FRACS.gt.P, FRACS.gt.Q);
    expect(polyTex(P1)).toBe('5n + \\frac{3}{n} + \\frac{7}{n^{2}}'); expect(polyTex(Q1)).toBe('1 - \\frac{2}{n}');
    const [P3, Q3] = divided(FRACS.lt.P, FRACS.lt.Q);
    expect(polyTex(P3)).toBe('\\frac{1}{n} - \\frac{4}{n^{5}}'); expect(polyTex(Q3)).toBe('6 - \\frac{2}{n^{6}}');
  });
  it('numbers with the decimal comma', () => {
    const [P] = divided(FRACS.eq.P, FRACS.eq.Q);
    expect(polyNumTex(P, 10, 'de')).toBe('7 + 0{,}3');
    expect(polyNumTex(P, 10, 'en')).toBe('7 + 0.3');
    expect(signedTex(-79.94, 'de')).toBe('-79{,}94');
    expect(signedTex(210.6, 'de')).toBe('211');
  });
});
