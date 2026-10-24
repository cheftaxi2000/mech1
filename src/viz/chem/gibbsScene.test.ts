import { describe, expect, it } from 'vitest';
import { BAR_W, BAR_X, DH, ENERGY, ENTROPY, GH, GIBBS_STEPS, GW, UNIT, ZERO_Y, gibbsFrame } from './gibbsScene';

const bar = (f: ReturnType<typeof gibbsFrame>, k: string) => f.bars.find((b) => b.key === k)!;
const last = (s: number) => gibbsFrame(s, 1, 'de');

describe('derivation of G = H − TS (slides 24–25), N2 + 3 H2 -> 2 NH3 at 298 K', () => {
  it('numbers: −199 + 310 = +111 J/(mol K); times −298 K: +59.3, −92.4, −33.1 kJ/mol', () => {
    expect(ENTROPY.sys).toBe(-199);
    expect(ENTROPY.surr).toBeCloseTo(310.07, 2);
    expect(ENTROPY.univ).toBeCloseTo(ENTROPY.sys + ENTROPY.surr, 10);
    expect(ENERGY.sys).toBeCloseTo(59.3, 1);
    expect(ENERGY.surr).toBeCloseTo(-92.4, 10);
    expect(ENERGY.univ).toBeCloseTo(-33.1, 1);
    expect(ENERGY.univ).toBeCloseTo(ENERGY.sys + ENERGY.surr, 10); // ΔG = ΔH − TΔS
    expect(DH).toBeCloseTo(-92.4, 10);
  });
  it('step 0 (final): three entropy bars, univ = sys + surr, all teal', () => {
    const f = last(0);
    expect(f.bars.map((b) => b.valueTex)).toEqual(['-199', '+310', '+111']);
    expect(bar(f, 'univ').v).toBeCloseTo(bar(f, 'sys').v + bar(f, 'surr').v, 10);
    expect(f.bars.every((b) => b.ink === 's')).toBe(true);
    expect(f.heat).toBeNull();
  });
  it('step 0 grows the bars one after the other', () => {
    const f = gibbsFrame(0, 0.5, 'de');
    expect(Math.abs(bar(f, 'sys').v)).toBeGreaterThan(0.5);
    expect(Math.abs(bar(f, 'univ').v)).toBe(0);
    expect(Math.abs(bar(gibbsFrame(0, 0, 'de'), 'sys').v)).toBe(0);
  });
  it('step 1 (final): the heat arrow with ΔH = −92.4 kJ is shown; the surroundings bar reads −ΔH/T', () => {
    const f = last(1);
    expect(f.heat?.o).toBe(1);
    expect(f.heat?.tex).toContain('-92{,}4');
    expect(bar(f, 'surr').labelTex).toContain('-\\Delta H');
    expect(bar(f, 'surr').o).toBe(1);
  });
  it('step 2 (final): the universe bar reads ΔS_sys − ΔH_sys/T and equals the same height as before', () => {
    const f = last(2);
    expect(bar(f, 'univ').labelTex).toContain('\\Delta S_{\\mathrm{sys}} - \\Delta H_{\\mathrm{sys}}/T');
    expect(bar(f, 'univ').v).toBeCloseTo(ENTROPY.univ / 310.07, 3);
  });
  it('step 3 (final): bars flipped and in kJ: −TΔS_sys, ΔH_sys, −TΔS_univ', () => {
    const f = last(3);
    expect(f.bars.map((b) => b.valueTex)).toEqual(['+59.3'.replace('.', '{,}'), '-92{,}4', '-33{,}1']);
    expect(Math.sign(bar(f, 'sys').v)).toBe(-Math.sign(bar(last(2), 'sys').v));
    expect(Math.sign(bar(f, 'surr').v)).toBe(-Math.sign(bar(last(2), 'surr').v));
    expect(Math.sign(bar(f, 'univ').v)).toBe(-Math.sign(bar(last(2), 'univ').v));
    expect(bar(f, 'surr').labelTex).toBe('\\Delta H_{\\mathrm{sys}}');
    expect(bar(f, 'surr').ink).toBe('e');
    expect(f.unitTex).toContain('kJ');
    expect(f.heat).toBeNull();
  });
  it('step 3 (running): numbers are hidden during the morph; the bars pass through zero height', () => {
    const f = gibbsFrame(3, 0.5, 'de');
    expect(f.bars.every((b) => b.valueTex === '')).toBe(true);
    expect(f.unitTex).toBe('');
    expect(Math.abs(bar(f, 'surr').v)).toBeLessThan(0.01);
  });
  it('step 4 (final): the last bar is ΔG in indigo; it is the sum of the other two', () => {
    const f = last(4);
    expect(bar(f, 'univ').labelTex).toBe('\\Delta G');
    expect(bar(f, 'univ').ink).toBe('g');
    expect(bar(f, 'univ').v * 92.4).toBeCloseTo(bar(f, 'sys').v * 92.4 + bar(f, 'surr').v * 92.4, 6);
    expect(f.note?.tex).toContain('\\Delta G = \\Delta H - T');
  });
  it('step 5 (final): ΔS_univ > 0 ⇔ ΔG < 0, and ΔG is negative', () => {
    const f = last(5);
    expect(f.note?.tex).toContain('\\iff');
    expect(bar(f, 'univ').v).toBeLessThan(0);
    expect(bar(f, 'univ').outline).toBe(true);
  });
  it('every frame stays inside the figure and bars have the right size', () => {
    for (let s = 0; s < GIBBS_STEPS; s++) for (const t of [0, 0.25, 0.5, 0.75, 1]) {
      const f = gibbsFrame(s, t, 'en');
      for (const b of f.bars) {
        expect(b.x - BAR_W / 2).toBeGreaterThanOrEqual(0);
        expect(b.x + BAR_W / 2).toBeLessThanOrEqual(GW);
        expect(ZERO_Y - Math.abs(b.v) * UNIT - 30).toBeGreaterThanOrEqual(60); // room above for the value label and the heat strip
        expect(ZERO_Y + Math.abs(b.v) * UNIT + 30).toBeLessThanOrEqual(GH - 30); // room below for the label row
        expect(Math.abs(b.v)).toBeLessThanOrEqual(1.0000001);
      }
    }
    expect(BAR_X.sys + BAR_W / 2).toBeLessThan(BAR_X.surr - BAR_W / 2);
    expect(BAR_X.surr + BAR_W / 2).toBeLessThan(BAR_X.univ - BAR_W / 2);
  });
  it('both languages: decimal comma in German, decimal point in English', () => {
    expect(gibbsFrame(3, 1, 'de').bars[0].valueTex).toContain('{,}');
    expect(gibbsFrame(3, 1, 'en').bars[0].valueTex).toBe('+59.3');
  });
});
