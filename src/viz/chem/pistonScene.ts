/**
 * Pure scene of the derivation on slides 16–17: pressure–volume work and ΔH = q_p. 520 × 300.
 *  0  the set-up: cylinder of area A, piston at x_initial, constant pressure P from outside
 *  1  the gas expands, the piston moves up by Δx
 *  2  the force is F = P·A, the work is w = −F·Δx (the gas pushes against the surroundings: w < 0)
 *  3  A·Δx is the swept volume ΔV, so w = −P·ΔV (shaded slab)
 *  4  bookkeeping: ΔE = q_p + w (bars)
 *  5  ΔH = ΔE + PΔV: the amber bars cancel, ΔH = q_p
 * Example numbers (kJ, illustrative): q_p = +10, w = −4 ⇒ ΔE = +6, PΔV = +4, ΔH = +10.
 */
import type { Lang } from '../../i18n';
import { ease, seg } from '../anim/geometry';
import { cbuilder, lerp, type CScene } from './cscene';

export const PS = { W: 520, H: 300, X0: 44, X1: 184, bottom: 270, top: 28, yi: 176, yf: 100, zero: 150, k: 12, qp: 10, w: -4 } as const;
export const PISTON_STEPS = 6;
const GAS: [number, number][] = [[0.14, 0.15], [0.5, 0.1], [0.82, 0.2], [0.3, 0.42], [0.68, 0.5], [0.12, 0.72], [0.46, 0.82], [0.84, 0.78], [0.62, 0.3]];

export function pistonScene(step: number, t: number, lang: Lang): CScene {
  const { W, H, X0, X1, bottom, yi, yf, zero, k, qp, w } = PS;
  const b = cbuilder(W, H);
  const de = lang === 'de';
  const move = step === 0 ? 0 : step === 1 ? ease(seg(t, 0.05, 0.85)) : 1;
  const yp = lerp(yi, yf, move); // piston underside
  const cx = (X0 + X1) / 2;
  // cylinder
  b.rect('gas', 'th-gas', X0, yp, X1 - X0, bottom - yp);
  if (step === 3 || step === 4 || step === 5) {
    const o = step === 3 ? ease(seg(t, 0, 0.5)) : 0.7;
    b.rect('slab', 'th-f-v', X0, yf, X1 - X0, yi - yf, o);
  }
  b.shape('walls', 'polyline', 'th-wall', [[X0, PS.top], [X0, bottom], [X1, bottom], [X1, PS.top]]);
  b.rect('piston', 'th-piston', X0 + 2, yp - 9, X1 - X0 - 4, 9, 1, 2);
  GAS.forEach(([u, v], i) => b.circle(`g${i}`, 'th-atom', [X0 + 10 + u * (X1 - X0 - 20), yp + 10 + v * (bottom - yp - 20)], 5));
  // constant external pressure P: blue arrows pressing down on the piston
  for (const x of [X0 + 24, X1 - 24]) b.arrow(`P-${x}`, 'th-a-p', [x, yp - 52], [x, yp - 12], 1, 8);
  b.label('lab-P', [X1 + 10, yp - 36], 'P', 'p', 1, 'l');
  // area A under the cylinder
  b.line('A-l', 'th-l', [X0, bottom + 12], [X1, bottom + 12]);
  b.line('A-t1', 'th-l', [X0, bottom + 7], [X0, bottom + 17]); b.line('A-t2', 'th-l', [X1, bottom + 7], [X1, bottom + 17]);
  b.label('lab-A', [cx, bottom + 26], 'A', 'fg', 1, 'c');
  // positions x_initial / x_final
  b.line('xi', 'th-l-dash', [X0 - 30, yi - 9], [X0, yi - 9]);
  b.label('lab-xi', [X0 - 32, yi - 9], String.raw`x_\mathrm{initial}`, 'muted', 1, 'r', { small: true });
  const o1 = step >= 1 ? ease(seg(step === 1 ? t : 1, 0.6, 1)) : 0;
  if (o1 > 0.02) {
    b.line('xf', 'th-l-dash', [X0 - 30, yf - 9], [X0, yf - 9], o1);
    b.label('lab-xf', [X0 - 32, yf - 9], String.raw`x_\mathrm{final}`, 'muted', o1, 'r', { small: true });
    b.arrow('dx', 'th-a-v', [X0 - 14, yi - 9 - 2], [X0 - 14, yf - 9 + 2], o1, 8);
    b.label('lab-dx', [X0 - 18, (yi + yf) / 2 - 9], String.raw`\Delta x`, 'v', o1, 'r');
  }
  // force F = P·A (step 2): amber arrow on the piston
  const oF = step === 2 ? ease(seg(t, 0.1, 0.6)) : step > 2 ? 0.0 : 0;
  if (oF > 0.02) {
    b.arrow('F', 'th-a-e', [cx, yp - 70], [cx, yp - 12], oF, 9);
    b.label('lab-F', [cx, yp - 84], String.raw`F = P A`, 'e', oF, 'c');
  }
  // formulas (step 2, 3)
  if (step === 2) b.label('f-w', [330, 70], String.raw`w = -F\,\Delta x`, 'e', ease(seg(t, 0.55, 1)), 'l', { box: true });
  if (step === 3) {
    b.label('f-w1', [330, 54], String.raw`w = -F\,\Delta x = -P A\,\Delta x`, 'e', ease(seg(t, 0.25, 0.7)), 'l', { box: true });
    b.label('f-w2', [330, 100], String.raw`w = -P\,\Delta V`, 'e', ease(seg(t, 0.65, 1)), 'l', { box: true });
    b.label('lab-dV', [cx, (yi + yf) / 2 - 12], String.raw`\Delta V = A\,\Delta x`, 'v', ease(seg(t, 0.2, 0.6)), 'c');
  }
  // bars (steps 4, 5)
  if (step >= 4) {
    const y = (E: number) => zero - E * k;
    const xs = [272, 326, 380, 434, 488], bw = 32;
    const grow = (i: number, a: number, bb: number) => (step === 4 ? ease(seg(t, a, bb)) : step === 5 && i < 3 ? 1 : step === 5 ? ease(seg(t, a, bb)) : 0);
    const bar = (key: string, i: number, Ea: number, Eb: number, cls: string, g: number) => {
      const yy1 = y(Ea), yy2 = lerp(y(Ea), y(Eb), g);
      b.rect(key, cls, xs[i], Math.min(yy1, yy2), bw, Math.max(1.5, Math.abs(yy2 - yy1)), g > 0.01 ? 1 : 0);
    };
    b.line('zero', 'th-axis', [258, zero], [W - 10, zero]);
    const gq = grow(0, 0, 0.35), gw = grow(1, 0.3, 0.65), gE = grow(2, 0.6, 1);
    bar('b-q', 0, 0, qp, 'th-f-t', gq); bar('b-w', 1, qp, qp + w, 'th-f-e', gw); bar('b-E', 2, 0, qp + w, 'th-f', gE);
    const names: [string, string, string][] = [['n-q', String.raw`q_p`, 't'], ['n-w', 'w', 'e'], ['n-E', String.raw`\Delta E`, 'fg'], ['n-PV', String.raw`P\Delta V`, 'e'], ['n-H', String.raw`\Delta H`, 'g']];
    const show = [gq, gw, gE, step === 5 ? grow(3, 0, 0.45) : 0, step === 5 ? grow(4, 0.5, 1) : 0];
    names.forEach(([key, tex, ink], i) => b.label(key, [xs[i] + bw / 2, 262], tex, ink, show[i] > 0.5 ? 1 : 0, 'c'));
    const vals = [qp, w, qp + w, -w, qp];
    const tops = [y(qp), y(qp), y(qp + w), y(-w), y(qp)];
    vals.forEach((v, i) => b.label(`v${i}`, [xs[i] + bw / 2, tops[i] - 11], (v > 0 ? '+' : v < 0 ? '\\!-\\!' : '') + Math.abs(v).toString(), ['t', 'e', 'fg', 'e', 'g'][i], show[i] > 0.9 ? 1 : 0, 'c', { small: true }));
    if (step === 5) {
      const g3 = grow(3, 0, 0.45), g4 = grow(4, 0.5, 1);
      bar('b-PV', 3, 0, -w, 'th-f-e', g3);
      bar('b-H', 4, 0, qp, 'th-f-g', g4);
      if (g4 > 0.5) { b.line('eq', 'th-l-dash', [xs[0] + bw, y(qp)], [xs[4], y(qp)], ease(seg(t, 0.8, 1))); }
    }
    b.label('unit', [W - 8, 292], de ? String.raw`\text{kJ}\;(\text{Beispielzahlen})` : String.raw`\text{kJ}\;(\text{example numbers})`, 'muted', 1, 'br', { small: true });
  }
  return b.finish({ step, move, yp, dV: move * (yi - yf) });
}
