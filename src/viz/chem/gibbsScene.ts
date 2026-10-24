/**
 * Pure scene of the derivation of the Gibbs free energy (lecture 5, slide 25), with the numbers of slide 24:
 * N₂ + 3 H₂ → 2 NH₃ at 298 K. SVG coordinates (y down); every label is TeX.
 *
 *  step 0  ΔS_univ = ΔS_sys + ΔS_surr: three entropy bars (−199, +310, +111 J mol⁻¹ K⁻¹)
 *  step 1  the surroundings take the heat the system gives away: ΔS_surr = −ΔH_sys/T (heat arrow, ΔH = −92.4 kJ mol⁻¹)
 *  step 2  insert it: ΔS_univ = ΔS_sys − ΔH_sys/T
 *  step 3  multiply everything by −T: the bars flip and change units (J K⁻¹ → kJ): −TΔS_sys = +59.3, ΔH_sys = −92.4, −TΔS_univ = −33.1 kJ mol⁻¹
 *  step 4  the new bar −TΔS_univ is the Gibbs free energy: ΔG = ΔH − TΔS
 *  step 5  T > 0, so ΔS_univ > 0 ⇔ ΔG < 0
 */
import type { Lang } from '../../i18n';
import { dSsurr, dSuniv, deltaRxn, gibbs, minusTdS, REACTIONS } from '../../chem/gibbs';
import { ease, seg } from '../anim/geometry';
import type { Ink } from './LabelFig';

export const GW = 600, GH = 360, ZERO_Y = 195, UNIT = 95, BAR_W = 96;
export const BAR_X = { sys: 130, surr: 300, univ: 470 } as const;
export const T0 = 298;
const rxn = REACTIONS.find((r) => r.id === 'nh3')!;
export const DH = deltaRxn('H', rxn), DS = deltaRxn('S', rxn);
export const ENTROPY = { sys: DS, surr: dSsurr(DH, T0), univ: dSuniv(DH, DS, T0) };
export const ENERGY = { sys: minusTdS(DS, T0), surr: DH, univ: gibbs(DH, DS, T0) };
const S_MAX = Math.max(...Object.values(ENTROPY).map(Math.abs)), E_MAX = Math.max(...Object.values(ENERGY).map(Math.abs));

export type BarKey = 'sys' | 'surr' | 'univ';
export interface BarSpec { key: BarKey; x: number; v: number; ink: Ink; labelTex: string; valueTex: string; o: number; outline: boolean }
export interface GFrame {
  bars: BarSpec[];
  unitTex: string;
  heat: { o: number; tex: string; sysTex: string; surrTex: string } | null;
  note: { tex: string; o: number } | null;
}

const num = (x: number, d: number, lang: Lang) => {
  const s = (x >= 0 ? '+' : '-') + Math.abs(x).toFixed(d);
  return lang === 'de' ? s.replace('.', '{,}') : s;
};
const SYS = String.raw`\Delta S_{\mathrm{sys}}`, SURR = String.raw`\Delta S_{\mathrm{surr}}`, UNIV = String.raw`\Delta S_{\mathrm{univ}}`;
const HSYS = String.raw`\Delta H_{\mathrm{sys}}`;

export function gibbsFrame(step: number, t: number, lang: Lang): GFrame {
  const k = ease(t);
  // normalised bar heights: entropy scale before step 3, energy scale after, a smooth morph during step 3
  const morph = step < 3 ? 0 : step === 3 ? k : 1;
  const norm = (key: BarKey) => (1 - morph) * (ENTROPY[key] / S_MAX) + morph * (ENERGY[key] / E_MAX);
  const grow: Record<BarKey, number> = step === 0
    ? { sys: ease(seg(t, 0, 0.4)), surr: ease(seg(t, 0.3, 0.7)), univ: ease(seg(t, 0.6, 1)) }
    : { sys: 1, surr: 1, univ: 1 };
  const done = (key: BarKey) => (step === 0 ? grow[key] >= 1 : step === 3 ? t >= 1 : true);

  const energy = step >= 4 || (step === 3 && t >= 1);
  const inks: Record<BarKey, Ink> = step < 3 ? { sys: 's', surr: 's', univ: 's' }
    : step === 3 ? { sys: 's', surr: t >= 1 ? 'e' : 's', univ: 's' }
      : { sys: 's', surr: 'e', univ: 'g' };

  const labels: Record<BarKey, string> = energy
    ? { sys: String.raw`-T\,\Delta S_{\mathrm{sys}}`, surr: HSYS, univ: step >= 4 ? String.raw`\Delta G` : String.raw`-T\,\Delta S_{\mathrm{univ}}` }
    : {
      sys: SYS,
      surr: step >= 1 ? String.raw`-\Delta H_{\mathrm{sys}}/T` : SURR,
      univ: step >= 2 ? String.raw`\Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T` : UNIV,
    };
  const values = (key: BarKey) => (energy ? num(ENERGY[key], 1, lang) : num(ENTROPY[key], 0, lang));

  const bars: BarSpec[] = (['sys', 'surr', 'univ'] as BarKey[]).map((key) => ({
    key, x: BAR_X[key], v: norm(key) * grow[key], ink: inks[key],
    labelTex: step === 3 && t < 1 ? (key === 'sys' ? SYS : key === 'surr' ? String.raw`-\Delta H_{\mathrm{sys}}/T` : String.raw`\Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T`) : labels[key],
    valueTex: done(key) && !(step === 3 && t < 1) ? values(key) : '',
    o: step === 1 && key !== 'surr' ? 0.45 : 1,
    outline: (step === 5 && key === 'univ') || (step === 4 && key === 'univ'),
  }));

  const heatO = step === 1 ? k : step === 2 ? 1 : step === 3 ? 1 - seg(t, 0, 0.35) : 0;
  const heat = heatO > 0 ? {
    o: heatO,
    tex: String.raw`${HSYS} = ${num(DH, 1, lang)}\ \mathrm{kJ\,mol^{-1}}`,
    sysTex: lang === 'de' ? String.raw`\text{System}` : String.raw`\text{system}`,
    surrTex: lang === 'de' ? String.raw`\text{Umgebung}` : String.raw`\text{surroundings}`,
  } : null;

  const unitTex = energy ? String.raw`\mathrm{kJ\,mol^{-1}}` : step === 3 ? '' : String.raw`\mathrm{J\,mol^{-1}\,K^{-1}}`;
  const note = step === 3 ? { tex: String.raw`\times\,(-T),\quad T = ${T0}\ \mathrm{K}`, o: seg(t, 0, 0.25) }
    : step === 4 ? { tex: String.raw`\Delta G = \Delta H - T\,\Delta S`, o: k }
      : step === 5 ? { tex: String.raw`\Delta S_{\mathrm{univ}} > 0 \iff \Delta G < 0`, o: k } : null;
  return { bars, unitTex, heat, note };
}

export const GIBBS_STEPS = 6;
