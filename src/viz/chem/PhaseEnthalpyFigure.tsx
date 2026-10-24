import { useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr, type Lang } from '../../i18n';
import { WATER } from '../../chem/entropy';
import { SceneFig, ThChips } from './ChemFig';
import { cbuilder, type CScene } from './cscene';

const t = String.raw;
export type Phase = 'both' | 'fus' | 'vap';
const K = 4.4; // px per kJ/mol (vaporisation 40.7 kJ/mol → 179 px)

/** Slide 30: heat of fusion and heat of vaporisation of water (values: supplement; the slide gives only the symbols and ΔH > 0). 400 × 300. */
export function phaseScene(which: Phase, lang: Lang): CScene {
  const b = cbuilder(400, 300);
  const de = lang === 'de';
  const fus = WATER.dHfus / 1000, vap = WATER.dHvap / 1000;
  const base = 262;
  const f = (x: number) => fmtNum(x, 1, lang, true);
  b.line('ground', 'th-axis', [30, base], [380, base]);
  const col = (key: string, x: number, v: number, cls: string, sym: string, name: string, show: boolean) => {
    if (!show) return;
    b.rect(`bar-${key}`, cls, x, base - v * K, 90, v * K);
    b.arrow(`up-${key}`, 'th-a-t', [x + 45, base - 4], [x + 45, base - v * K + 10], 1, 9);
    b.label(`v-${key}`, [x + 45, base - v * K - 28], `${f(v)}\\,\\text{kJ/mol}`, 'fg', 1, 'c', { small: true });
    b.label(`s-${key}`, [x + 45, base - v * K - 12], sym, 'e', 1, 'c');
    b.label(`n-${key}`, [x + 45, base + 18], name, 'muted', 1, 'c', { small: true });
  };
  col('fus', 90, fus, 'th-f-e', String.raw`\Delta H_\mathrm{fus}`, de ? String.raw`\text{Schmelzen}` : String.raw`\text{melting}`, which !== 'vap');
  col('vap', 220, vap, 'th-f-e', String.raw`\Delta H_\mathrm{vap}`, de ? String.raw`\text{Verdampfen}` : String.raw`\text{boiling}`, which !== 'fus');
  b.label('unit', [390, 292], de ? String.raw`\text{Wasser, pro Mol (Ergänzung)}` : String.raw`\text{water, per mole (supplement)}`, 'muted', 1, 'br', { small: true });
  return b.finish({ fus, vap });
}

export function PhaseEnthalpyFigure() {
  const tr = useTr(), lang = useLang();
  const [w, setW] = useState<Phase>('both');
  return (
    <figure className="th-fig th-two">
      <SceneFig scene={phaseScene(w, lang)} label={tr('Zwei Säulen: Schmelzenthalpie und Verdampfungsenthalpie von Wasser', 'Two columns: enthalpy of fusion and enthalpy of vaporisation of water')} />
      <figcaption>
        <ThChips label={tr('Anzeigen', 'Show')} value={w} onPick={setW} items={[
          { id: 'both', label: <T de="beide" en="both" /> }, { id: 'fus', label: <T de="Schmelzen" en="melting" /> }, { id: 'vap', label: <T de="Verdampfen" en="boiling" /> },
        ]} />
        <p className="th-note"><T
          de={<>Beide sind positiv: Man muss Wärme zuführen (<M p=").">{t`\Delta H > 0`}</M> Beim Verdampfen reisst man die Teilchen ganz auseinander, darum braucht es etwa siebenmal mehr als beim Schmelzen.</>}
          en={<>Both are positive: heat has to be supplied (<M p=").">{t`\Delta H > 0`}</M> When boiling, the particles are pulled completely apart, so it takes about seven times more than melting.</>} /></p>
      </figcaption>
    </figure>
  );
}
