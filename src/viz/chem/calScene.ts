/**
 * Slides 20–22: the calorimeter. 400 × 300.
 * 'p' = coffee-cup calorimeter (constant pressure, ΔH_rxn = q_rxn = −q_water), 'v' = bomb (constant volume, ΔE_rxn = q_rxn = −q_water).
 * The thermometer shows T_initial (dashed) and T_final = T_initial + ΔT with ΔT = −q_rxn/(m·C_s) (supplement: the numbers are ours).
 */
import type { Lang } from '../../i18n';
import { chemTex } from '../../chem/tex';
import { WATER_CS, calorimeterDT } from '../../chem/thermo';
import { cbuilder, type CScene } from './cscene';

const W2O = chemTex('H2O');
export type CalKind = 'p' | 'v';
export const CAL = { T0: 25, Tmin: 0, Tmax: 50, yBot: 250, yTop: 62 } as const;
export const thermoY = (T: number) => CAL.yBot - ((Math.min(CAL.Tmax, Math.max(CAL.Tmin, T)) - CAL.Tmin) / (CAL.Tmax - CAL.Tmin)) * (CAL.yBot - CAL.yTop);

export function calScene(kind: CalKind, qRxn: number, mWater: number, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const dT = calorimeterDT(qRxn, mWater, WATER_CS), T1 = CAL.T0 + dT;
  const exo = qRxn < -0.05, endo = qRxn > 0.05;
  // vessel and water
  b.shape('water', 'polygon', 'th-water', [[116, 112], [284, 112], [279, 246], [121, 246]]);
  b.shape('cup', 'polyline', kind === 'p' ? 'th-wall' : 'th-wall-thin', [[108, 84], [121, 250], [279, 250], [292, 84]]);
  if (kind === 'p') {
    b.shape('ins', 'polyline', 'th-wall-dash', [[98, 78], [114, 258], [286, 258], [302, 78]]);
    b.label('lab-ins', [78, 268], de ? String.raw`\text{Isolierung}` : String.raw`\text{insulation}`, 'muted', 1, 'tl', { small: true });
  } else b.label('lab-ins', [60, 268], de ? String.raw`\text{isolierter Behälter}` : String.raw`\text{insulated container}`, 'muted', 1, 'tl', { small: true });
  // sample: open reactants (p) or sealed bomb (v)
  if (kind === 'p') b.rect('sample', exo ? 'th-f-t' : endo ? 'th-f-p' : 'th-f-n', 172, 196, 56, 34, 1, 8);
  else { b.rect('bomb', 'th-piston', 168, 168, 64, 70, 1, 12); b.rect('inner', 'th-f-n', 180, 200, 40, 28, 1, 6); b.line('wire', 'th-l-fg', [200, 168], [200, 120]); b.circle('spark', 'th-s-e', [200, 200], 4); }
  b.label('lab-rxn', [200, kind === 'p' ? 213 : 214], de ? String.raw`\text{Reaktion}` : String.raw`\text{reaction}`, 'fg', 1, 'c', { small: true });
  // heat arrows between sample and water
  const a = Math.min(1, Math.abs(qRxn) / 8);
  if (exo) { b.arrow('qa1', 'th-a-t th-flow', [172, 190], [138, 170], 1, 9); b.arrow('qa2', 'th-a-t th-flow', [228, 190], [262, 170], 1, 9); }
  if (endo) { b.arrow('qa1', 'th-a-p th-flow', [138, 170], [172, 190], 1, 9); b.arrow('qa2', 'th-a-p th-flow', [262, 170], [228, 190], 1, 9); }
  void a;
  b.label('lab-qw', [140, 150], String.raw`q_{${W2O}}`, exo ? 't' : 'p', exo || endo ? 1 : 0, 'c');
  // thermometer
  b.rect('tube', 'th-glass', 318, CAL.yTop - 6, 12, CAL.yBot - CAL.yTop + 18, 1, 6);
  b.circle('bulb', 'th-s-t', [324, CAL.yBot + 18], 11);
  b.line('merc', 'th-merc', [324, CAL.yBot + 12], [324, thermoY(T1)]);
  b.line('t0', 'th-l-dash', [300, thermoY(CAL.T0)], [346, thermoY(CAL.T0)]);
  b.label('lab-T0', [350, thermoY(CAL.T0)], String.raw`T_\mathrm{initial}`, 'muted', 1, 'l', { small: true });
  if (Math.abs(dT) > 0.05) {
    b.line('t1', 'th-l-dash', [300, thermoY(T1)], [346, thermoY(T1)]);
    b.label('lab-T1', [350, thermoY(T1) + (dT > 0 ? -2 : 4)], String.raw`T_\mathrm{final}`, exo ? 't' : 'p', 1, 'l', { small: true });
  }
  b.label('lab-K', [324, 40], String.raw`T`, 'muted', 1, 'c');
  b.label('lab-qrxn', [12, 12], kind === 'p' ? String.raw`q_\mathrm{rxn} = \Delta H_\mathrm{rxn}` : String.raw`q_\mathrm{rxn} = \Delta E_\mathrm{rxn}`, exo ? 't' : endo ? 'p' : 'fg', 1, 'tl');
  return b.finish({ dT, T1, kind: kind === 'p' ? 0 : 1 });
}
