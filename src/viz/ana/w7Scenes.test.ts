import { describe, expect, it } from 'vitest';
import { COSH_STEPS, DIV_STEPS, coshFrame, coshK, divFrame, sinhK, tanhK } from './w7Scenes';

describe('S. 7 animation: final frames show what the captions say', () => {
  it('step 0: only 1 + i; step 1: mirror 1 − i; step 2: pair factor; step 3: division done; step 4: 2 ± 3i; step 5: all', () => {
    expect(divFrame(0, 1).zeros).toEqual([1, 0, 0, 0]);
    expect(divFrame(1, 1).zeros).toEqual([1, 1, 0, 0]);
    expect(divFrame(2, 1).rows.pair).toBe(1);
    expect(divFrame(2, 1).rows.quotient).toBe(0);
    const s3 = divFrame(3, 1);
    expect(s3.rows.div).toEqual([1, 1, 1]); expect(s3.rows.quotient).toBe(1); expect(s3.zeros[2]).toBe(0);
    expect(divFrame(4, 1).zeros).toEqual([1, 1, 1, 1]); expect(divFrame(4, 1).rows.result).toBe(0);
    expect(divFrame(DIV_STEPS - 1, 1).rows.result).toBe(1);
  });
});

describe('S. 8 animation: cosh, sinh, tanh from e^x and e^{−x}', () => {
  it('morphs end on the true functions', () => {
    for (const x of [-2, -0.5, 0, 1.3]) {
      expect(coshK(x, 1)).toBeCloseTo(Math.cosh(x), 12);
      expect(sinhK(x, 1)).toBeCloseTo(Math.sinh(x), 12);
      expect(tanhK(x, 1)).toBeCloseTo(Math.tanh(x), 12);
      expect(coshK(x, 0)).toBeCloseTo(Math.exp(x) / 2, 12);
    }
  });
  it('step k shows the curves of its caption', () => {
    expect(coshFrame(0, 1).half).toBe(0);
    expect(coshFrame(1, 1).half).toBe(1);
    expect(coshFrame(1, 1).coshO).toBe(0);
    expect(coshFrame(2, 1).kCosh).toBe(1); expect(coshFrame(2, 1).sinhO).toBe(0);
    expect(coshFrame(3, 1).kSinh).toBe(1); expect(coshFrame(3, 1).tanhO).toBe(0);
    expect(coshFrame(COSH_STEPS - 1, 1).kTanh).toBe(1);
  });
});
