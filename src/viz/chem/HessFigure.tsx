import { useMemo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { T, useLang, useTr, type Lang } from '../../i18n';
import { HESS_EXAMPLES, formationTable, type HessRoute } from '../../chem/hess';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { SceneFig, ThChips } from './ChemFig';
import { hessScene, kj } from './hessScene';

const t = String.raw;
const num = (x: number, lang: Lang) => kj(x, lang).replace(/^\+/, '');

function captions(id: string, route: HessRoute, lang: Lang): AnimStep[] {
  const out: AnimStep[] = [];
  out.push({ ms: 700, holdMs: 2600, caption: <T
    de={<>Start: die Ausgangsstoffe stehen auf einer Linie. Wir zählen die Enthalpie von hier aus.</>}
    en={<>Start: the reactants sit on one line. We count the enthalpy from here.</>} /> });
  route.steps.forEach((s, i) => {
    const v = num(s.dH, lang);
    const up = s.dH > 0;
    const de = s.kind === 'unform' ? <>Schritt {i + 1}: Wir zerlegen <b>{s.n === 1 ? '1' : s.n}</b> Mol des Ausgangsstoffs in seine Elemente. Das kostet Energie, der Pfeil geht {up ? 'nach oben' : 'nach unten'}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M></>
      : s.kind === 'form' ? <>Schritt {i + 1}: Wir bauen das Produkt aus den Elementen auf (Bildungsenthalpie mal Koeffizient). Der Pfeil geht {up ? 'nach oben' : 'nach unten'}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M></>
      : <>Schritt {i + 1}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M> Der Pfeil geht {up ? 'nach oben' : 'nach unten'}.</>;
    const en = s.kind === 'unform' ? <>Step {i + 1}: we take the reactant apart into its elements. That costs energy, the arrow points {up ? 'up' : 'down'}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M></>
      : s.kind === 'form' ? <>Step {i + 1}: we build the product from the elements (enthalpy of formation times coefficient). The arrow points {up ? 'up' : 'down'}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M></>
      : <>Step {i + 1}: <M p=".">{t`\Delta H_{${i + 1}} = ${kj(s.dH, lang)}\,\text{kJ}`}</M> The arrow points {up ? 'up' : 'down'}.</>;
    void v;
    out.push({ ms: 1500, holdMs: 2800, caption: <T de={de} en={en} /> });
  });
  const sum = route.steps.map((s, i) => `${i ? (s.dH < 0 ? '-' : '+') : s.dH < 0 ? '-' : ''}${num(Math.abs(s.dH), lang)}`).join('');
  out.push({ ms: 1800, holdMs: 3600, caption: <T
    de={<>Der direkte Weg von Anfang bis Ende hat dieselbe Länge wie alle Schritte zusammen: <M p=".">{t`\Delta H_\mathrm{rxn} = ${sum} = ${kj(route.total, lang)}\,\text{kJ}`}</M> Die Enthalpie ist eine Zustandsfunktion, darum ist der Weg egal.</>}
    en={<>The direct way from start to end is as long as all steps together: <M p=".">{t`\Delta H_\mathrm{rxn} = ${sum} = ${kj(route.total, lang)}\,\text{kJ}`}</M> Enthalpy is a state function, so the path does not matter.</>} /> });
  void id;
  return out;
}

/** Enthalpy diagram builder (slides 23–29, exercise 4): pick a reaction, play the route step by step, see the table of ΔH°_f. */
export function HessFigure({ initial = 'propane' }: { initial?: string }) {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState(initial);
  const ex = HESS_EXAMPLES.find((e) => e.id === id)!;
  const route = useMemo(() => ex.route(), [ex]);
  const steps = useMemo(() => captions(id, route, lang), [id, route, lang]);
  const names: Record<string, [string, string]> = {
    water: ['Wasser (Folien 23–25)', 'Water (slides 23–25)'], propane: ['Propan (Folie 28)', 'Propane (slide 28)'], methanol: ['Methanol (Übung 4, Aufg. 3)', 'Methanol (exercise 4, Ex. 3)'],
    cao: ['CaO + HF (Aufg. 5a)', 'CaO + HF (Ex. 5a)'], fe: ['Fe₂O₃ + C (Aufg. 5b)', 'Fe₂O₃ + C (Ex. 5b)'],
  };
  const table = ex.rxn && ex.id !== 'water' ? formationTable(ex.rxn) : null;
  return (
    <div className="th-hess">
      <ThChips label={tr('Reaktion wählen', 'Choose a reaction')} value={id} onPick={setId} items={HESS_EXAMPLES.map((e) => ({
        id: e.id, label: e.id === 'fe' ? <T de="Fe₂O₃ + C (Aufg. 5b)" en="Fe₂O₃ + C (Ex. 5b)" /> : <T de={names[e.id][0]} en={names[e.id][1]} />,
      }))} />
      <p className="th-reaction"><C>{ex.src}</C></p>
      <StepPlayer key={id + lang} steps={steps} label={tr('Enthalpiediagramm: Stufen und Pfeile', 'Enthalpy diagram: levels and arrows')}>
        {(step, tt) => <SceneFig scene={hessScene(route, step, tt, lang)} label={tr('Enthalpiediagramm mit den Stufen der Reaktion', 'Enthalpy diagram with the levels of the reaction')} />}
      </StepPlayer>
      {table && (
        <div className="th-tablewrap">
          <table className="th-table" aria-label={tr('ΔHf der beteiligten Stoffe', 'ΔHf of the substances involved')}>
            <thead><tr><th>{tr('Stoff', 'Substance')}</th><th><M>n</M></th><th><M>{t`\Delta H^\circ_\mathrm f`}</M></th><th><M>{t`\pm\, n\,\Delta H^\circ_\mathrm f`}</M></th></tr></thead>
            <tbody>
              {table.rows.map((r, i) => (
                <tr key={i}><td><C>{r.species}</C></td><td><M>{String(r.n)}</M></td><td><M>{num(r.hf, lang)}</M></td><td><M>{kj(r.contribution, lang)}</M></td></tr>
              ))}
              <tr className="sum"><td colSpan={3}><M>{t`\Delta H^\circ_\mathrm{rxn}`}</M></td><td><M>{t`${kj(table.total, lang)}\,\text{kJ}`}</M></td></tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
