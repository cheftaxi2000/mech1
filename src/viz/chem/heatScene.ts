/**
 * Slides 9–10, 15–16: heat flows from a hot to a cold block. 520 × 300.
 * Two identical blocks (heat capacity C = 100 J/K each) in an isolated box, T_cold = 300 K, T_hot = 300 K + ΔT.
 * x = q/q* is the heat that has flowed, in units of q* = C·ΔT/2 (the heat at which both blocks have the same temperature).
 * Left: the blocks (colour = temperature) and the entropy changes; right: ΔS_univ as a function of x.
 */
import type { Lang } from '../../i18n';
import { heatFlow, qEquilibrium } from '../../chem/entropy';
import { cbuilder, type CScene } from './cscene';

export const HF = { C: 100, Tc: 300, X0: -0.5, X1: 2.0, px0: 292, px1: 500, py0: 44, py1: 232 } as const;
export const heatBlocks = (dT: number) => ({ Th: HF.Tc + dT, Tc: HF.Tc, C: HF.C });
export const tempClass = (T: number) => `th-temp-${Math.max(0, Math.min(8, Math.round(((T - 280) / 160) * 8)))}`;
const num = (x: number, d: number, lang: Lang) => (x > 0.0004 * 10 ** (2 - d) ? '+' : x < -0.0004 * 10 ** (2 - d) ? '-' : '') + Math.abs(x).toFixed(d).replace('.', lang === 'de' ? '{,}' : '.');

export function heatCurve(dT: number, n = 60): [number, number][] {
  const b = heatBlocks(dT), qs = qEquilibrium(b);
  return Array.from({ length: n + 1 }, (_, i) => { const x = HF.X0 + ((HF.X1 - HF.X0) * i) / n; return [x, heatFlow(b, x * qs).dSuniv] as [number, number]; });
}

export function heatScene(dT: number, x: number, lang: Lang): CScene {
  const b = cbuilder(520, 300);
  const de = lang === 'de';
  const bl = heatBlocks(dT), qs = qEquilibrium(bl), q = x * qs;
  const st = heatFlow(bl, q);
  // blocks
  b.rect('hot', `th-block ${tempClass(st.Th)}`, 20, 88, 74, 84, 1, 8);
  b.rect('cold', `th-block ${tempClass(st.Tc)}`, 166, 88, 74, 84, 1, 8);
  b.label('n-hot', [57, 74], de ? String.raw`\text{Block 1}` : String.raw`\text{block 1}`, 'muted', 1, 'c', { small: true });
  b.label('n-cold', [203, 74], de ? String.raw`\text{Block 2}` : String.raw`\text{block 2}`, 'muted', 1, 'c', { small: true });
  b.label('T-hot', [57, 130], String.raw`${st.Th.toFixed(1).replace('.', de ? '{,}' : '.')}\,\mathrm{K}`, 'fg', 1, 'c', { small: true });
  b.label('T-cold', [203, 130], String.raw`${st.Tc.toFixed(1).replace('.', de ? '{,}' : '.')}\,\mathrm{K}`, 'fg', 1, 'c', { small: true });
  if (Math.abs(x) > 0.02) {
    if (q > 0) b.arrow('heat', 'th-a-t th-flow', [98, 130], [162, 130], 1, 10);
    else b.arrow('heat', 'th-a-t th-flow-rev', [162, 130], [98, 130], 1, 10);
    b.label('lab-q', [130, 112], 'q', 't', 1, 'c');
  }
  const d = (v: number) => num(v, 2, lang);
  b.label('dS-hot', [57, 196], String.raw`\Delta S = ${d(st.dSh)}`, 's', 1, 'c', { small: true });
  b.label('dS-cold', [203, 196], String.raw`\Delta S = ${d(st.dSc)}`, 's', 1, 'c', { small: true });
  const ok = st.dSuniv > 0.0005, bad = st.dSuniv < -0.0005;
  b.label('dS-univ', [130, 232], String.raw`\Delta S_\mathrm{univ} = ${d(st.dSuniv)}\,\mathrm{J\,K^{-1}}`, ok ? 'ok' : bad ? 'bad' : 'fg', 1, 'c');
  // plot of ΔS_univ(x)
  const pts = heatCurve(dT);
  const ys = pts.map((p) => p[1]);
  const ymax = Math.max(...ys, 1e-4) * 1.25, ymin = Math.min(...ys, 0) * 1.15 - 1e-5;
  const X = (v: number) => HF.px0 + ((v - HF.X0) / (HF.X1 - HF.X0)) * (HF.px1 - HF.px0);
  const Y = (v: number) => HF.py1 - ((v - ymin) / (ymax - ymin)) * (HF.py1 - HF.py0);
  b.rect('neg', 'th-f-bad', X(HF.X0), Y(0), X(0) - X(HF.X0), HF.py1 - Y(0), 0.45);
  b.line('ax-y', 'th-axis', [X(HF.X0), HF.py0 - 6], [X(HF.X0), HF.py1]);
  b.line('zero', 'th-axis', [X(HF.X0), Y(0)], [HF.px1 + 6, Y(0)]);
  b.line('x1', 'th-l-dash', [X(1), HF.py0], [X(1), HF.py1]);
  b.shape('curve', 'polyline', 'th-l-s', pts.map((p) => [X(p[0]), Y(p[1])] as [number, number]));
  b.circle('mark', ok ? 'th-s-ok' : bad ? 'th-s-bad' : 'th-s-fg', [X(x), Y(st.dSuniv)], 6);
  b.label('ax-q', [HF.px1 + 6, Y(0) - 8], 'q', 'muted', 1, 'br', { small: true });
  b.label('ax-S', [X(HF.X0) + 6, HF.py0 - 6], String.raw`\Delta S_\mathrm{univ}`, 's', 1, 'l', { small: true });
  b.label('t-0', [X(0), Y(0) + 14], '0', 'muted', 1, 'c', { small: true });
  b.label('t-1', [X(1), HF.py1 + 14], String.raw`q^{*}`, 'muted', 1, 'c', { small: true });
  b.label('t-2', [X(2), Y(0) + 14], String.raw`2q^{*}`, 'muted', 1, 'c', { small: true });
  b.label('lab-neg', [X(-0.25), HF.py1 - 18], de ? String.raw`\text{verboten}` : String.raw`\text{forbidden}`, 'bad', 1, 'c', { small: true });
  return b.finish({ q, qs, Th: st.Th, Tc: st.Tc, dSh: st.dSh, dSc: st.dSc, dSuniv: st.dSuniv, ymax, ymin });
}
