/**
 * Slides 8, 14–16, 20: melting (or freezing) of ice and the entropy balance ΔS_univ = ΔS_sys + ΔS_surr. 400 × 300.
 * q = ±ΔH_fus = ±6.0 kJ/mol is taken from the surroundings at T_surr; the ice (system) stays at 0 °C = 273.15 K.
 * Bars hang from the zero line: ΔS_sys = q/T_sys, ΔS_surr = −q/T_surr, ΔS_univ = their sum (J mol⁻¹ K⁻¹).
 */
import type { Lang } from '../../i18n';
import { DH_FUS_WATER, T_MELT, universeBalance } from '../../chem/entropy';
import { cbuilder, type CScene } from './cscene';

export type IceMode = 'melt' | 'freeze';
export const US = { zero: 156, k: 3.0, xs: [70, 170, 270], bw: 62, Tmin: 245, Tmax: 330 } as const;
const f1 = (x: number, lang: Lang) => (x > 0.049 ? '+' : x < -0.049 ? '-' : '') + Math.abs(x).toFixed(1).replace('.', lang === 'de' ? '{,}' : '.');

export function universeScene(mode: IceMode, Tsurr: number, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const q = mode === 'melt' ? DH_FUS_WATER : -DH_FUS_WATER;
  const u = universeBalance(q, T_MELT, Tsurr);
  const rev = Math.abs(u.univ) < 0.05, spont = u.univ >= 0.05;
  const { zero, k, xs, bw } = US;
  const bar = (key: string, i: number, v: number, cls: string) => {
    const h = Math.max(1.5, Math.abs(v) * k);
    b.rect(key, cls, xs[i], v >= 0 ? zero - h : zero, bw, h, 1, 2);
  };
  b.line('zero', 'th-axis', [30, zero], [380, zero]);
  bar('bar-sys', 0, u.sys, 'th-f-s'); bar('bar-surr', 1, u.surr, 'th-f-t');
  bar('bar-univ', 2, u.univ, rev ? 'th-f' : spont ? 'th-f-ok' : 'th-f-bad');
  const lab = (key: string, i: number, v: number, tex: string, ink: string) => {
    b.label(`n-${key}`, [xs[i] + bw / 2, v >= 0 ? zero + 16 : zero - 16], tex, ink, 1, 'c');
    b.label(`v-${key}`, [xs[i] + bw / 2, v >= 0 ? zero - v * k - 12 : zero - v * k + 12], f1(v, lang), ink, 1, 'c', { small: true });
  };
  lab('sys', 0, u.sys, String.raw`\Delta S_\mathrm{sys}`, 's'); lab('surr', 1, u.surr, String.raw`\Delta S_\mathrm{surr}`, 't'); lab('univ', 2, u.univ, String.raw`\Delta S_\mathrm{univ}`, rev ? 'fg' : spont ? 'ok' : 'bad');
  b.label('unit', [388, 292], String.raw`\mathrm{J\,mol^{-1}\,K^{-1}}`, 'muted', 1, 'br', { small: true });
  b.label('head', [388, 10], de ? (mode === 'melt' ? String.raw`\text{Eis schmilzt}` : String.raw`\text{Wasser gefriert}`) : (mode === 'melt' ? String.raw`\text{ice melts}` : String.raw`\text{water freezes}`), 'fg', 1, 'tr');
  b.label('temps', [388, 32], String.raw`T_\mathrm{sys} = 273\,\mathrm{K},\ T_\mathrm{surr} = ${Math.round(Tsurr)}\,\mathrm{K}`, 'muted', 1, 'tr', { small: true });
  return b.finish({ sys: u.sys, surr: u.surr, univ: u.univ, spont: spont ? 1 : 0, rev: rev ? 1 : 0, q });
}
