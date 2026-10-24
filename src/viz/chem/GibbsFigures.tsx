import { useState, type ReactNode } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { fmtNum, T, useLang, useTr } from '../../i18n';
import {
  PRESETS, REACTIONS, THERMO, caseOf, crossoverT, dSsurr, dSuniv, deltaRxn, gasCount, gibbs, minusTdS, side, spontaneousRange,
  type Quantity, type Reaction, type Term,
} from '../../chem/gibbs';
import { chemTex } from '../../chem/tex';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { HLine, Line, PLabel, Plot, Pt, Band, VLine } from '../plot/Plot';
import { FArrow, FLabel, LabelFig, type Ink } from './LabelFig';
import { GH, GIBBS_STEPS, GW, BAR_W, UNIT, ZERO_Y, DH, DS, gibbsFrame, type BarSpec, type GFrame } from './gibbsScene';
import './gibbs.css';

const t = String.raw;

/* ================================================================ the shared bar chart (derivation, budget, explorer) */
interface Geom { w: number; h: number; zeroY: number; unit: number; barW: number; labelY: number }
const BIG: Geom = { w: GW, h: GH, zeroY: ZERO_Y, unit: UNIT, barW: BAR_W, labelY: GH - 22 };

function GibbsBars({ frame, geom = BIG, label }: { frame: GFrame; geom?: Geom; label: string }) {
  const { w, h, zeroY, unit, barW, labelY } = geom;
  const heat = frame.heat;
  return (
    <LabelFig w={w} h={h} label={label} className="gb-bars">
      <line className="lf-zero" x1={14} x2={w - 14} y1={zeroY} y2={zeroY} />
      {frame.bars.map((b: BarSpec) => {
        const hh = Math.abs(b.v) * unit;
        const y = b.v >= 0 ? zeroY - hh : zeroY;
        return (
          <g key={b.key} style={{ opacity: b.o }}>
            {hh > 0.5 && <rect className={`lf-fill-${b.ink}`} x={b.x - barW / 2} y={y} width={barW} height={hh} rx={4} fillOpacity={0.85} stroke={b.outline ? 'var(--fg)' : 'none'} strokeWidth={2.5} />}
          </g>
        );
      })}
      {frame.bars.map((b: BarSpec) => {
        const tip = zeroY - b.v * unit;
        return (
          <g key={`l${b.key}`}>
            {b.valueTex && <FLabel x={b.x} y={b.v >= 0 ? tip - 6 : tip + 6} anchor={b.v >= 0 ? 'b' : 't'} ink={b.ink} tex={b.valueTex} opacity={b.o} />}
            <FLabel x={b.x} y={labelY} ink={b.ink} tex={b.labelTex} small={w < 400} opacity={b.o} />
          </g>
        );
      })}
      {frame.unitTex && <FLabel x={8} y={12} anchor="l" ink="muted" small tex={frame.unitTex} />}
      {heat && w === GW && <HeatStrip o={heat.o} tex={heat.tex} sys={heat.sysTex} surr={heat.surrTex} />}
      {frame.note && <FLabel x={w / 2} y={h === GH ? 14 : 12} ink="fg" tex={frame.note.tex} opacity={frame.note.o} />}
    </LabelFig>
  );
}

/** System box, surroundings box and the heat arrow between them (derivation steps 1–2). */
function HeatStrip({ o, tex, sys, surr }: { o: number; tex: string; sys: string; surr: string }) {
  return (
    <g style={{ opacity: o }}>
      <rect className="lf-box" x={30} y={30} width={120} height={40} rx={8} />
      <rect className="lf-box" x={450} y={30} width={120} height={40} rx={8} />
      <FArrow x1={156} y1={50} x2={444} y2={50} ink="t" />
      <FLabel x={90} y={50} tex={sys} halo={false} opacity={o} />
      <FLabel x={510} y={50} tex={surr} halo={false} opacity={o} />
      <FLabel x={300} y={40} anchor="b" ink="t" tex={tex} opacity={o} small />
    </g>
  );
}

/* ================================================================ derivation of G = H − TS (slide 25), step animation */
export function GibbsDerivation() {
  const tr = useTr(), lang = useLang();
  const steps: AnimStep[] = [
    { ms: 2200, holdMs: 2200, caption: <T
      de={<>Drei Balken: die Entropie des Systems (<M>{t`\Delta S_{\mathrm{sys}} = -199`}</M>), die der Umgebung (<M>{t`+310`}</M>) und die des Universums. Das Universum ist die Summe: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}}`}</M></>}
      en={<>Three bars: the entropy of the system (<M>{t`\Delta S_{\mathrm{sys}} = -199`}</M>), of the surroundings (<M>{t`+310`}</M>) and of the universe. The universe is the sum: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} + \Delta S_{\mathrm{surr}}`}</M></>} /> },
    { ms: 1500, holdMs: 2400, caption: <T
      de={<>Die Reaktion gibt Wärme ab (rot). Die Umgebung nimmt genau diese Wärme auf, und ihre Entropie steigt um <M p=".">{t`-\Delta H_{\mathrm{sys}}/T`}</M> Das Minus steht da, weil das System die Wärme <em>abgibt</em>.</>}
      en={<>The reaction gives off heat (red). The surroundings take up exactly this heat, and their entropy rises by <M p=".">{t`-\Delta H_{\mathrm{sys}}/T`}</M> The minus sign is there because the system <em>gives</em> the heat away.</>} /> },
    { ms: 1200, holdMs: 2400, caption: <T
      de={<>Setzt man das ein, hängt alles nur noch am System: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T`}</M> Die Balken bleiben gleich hoch, nur die Beschriftung ist ehrlicher geworden.</>}
      en={<>Insert it, and everything depends on the system alone: <M p=".">{t`\Delta S_{\mathrm{univ}} = \Delta S_{\mathrm{sys}} - \Delta H_{\mathrm{sys}}/T`}</M> The bars stay the same height; only the labelling has become more honest.</>} /> },
    { ms: 2600, holdMs: 2600, caption: <T
      de={<>Jetzt alles mal <M p=".">{t`-T`}</M> Jeder Balken klappt um und bekommt die Einheit kJ. Aus <M>{t`-T\,\Delta S_{\mathrm{surr}}`}</M> wird genau <M p=".">{t`\Delta H_{\mathrm{sys}}`}</M></>}
      en={<>Now multiply everything by <M p=".">{t`-T`}</M> Each bar flips over and gets the unit kJ. <M>{t`-T\,\Delta S_{\mathrm{surr}}`}</M> becomes exactly <M p=".">{t`\Delta H_{\mathrm{sys}}`}</M></>} /> },
    { ms: 1300, holdMs: 2600, caption: <T
      de={<>Der dritte Balken ist <M>{t`-T\,\Delta S_{\mathrm{univ}}`}</M> und gleich <M>{t`\Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</M> (die beiden anderen Balken zusammen). Diese eine Grösse bekommt einen Namen: die Gibbs-Energie <M p=".">{t`\Delta G`}</M></>}
      en={<>The third bar is <M>{t`-T\,\Delta S_{\mathrm{univ}}`}</M> and equals <M>{t`\Delta H_{\mathrm{sys}} - T\,\Delta S_{\mathrm{sys}}`}</M> (the other two bars together). This one quantity gets a name: the Gibbs free energy <M p=".">{t`\Delta G`}</M></>} /> },
    { ms: 1200, holdMs: 2600, caption: <T
      de={<>Spontan heisst <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Weil <M>{t`T > 0`}</M> ist, kehrt die Multiplikation mit <M>{t`-T`}</M> das Zeichen um: Das ist dasselbe wie <M p=".">{t`\Delta G < 0`}</M> Hier: <M p=".">{t`\Delta G = -33{,}1\ \mathrm{kJ\,mol^{-1}}`}</M></>}
      en={<>Spontaneous means <M p=".">{t`\Delta S_{\mathrm{univ}} > 0`}</M> Because <M>{t`T > 0`}</M>, multiplying by <M>{t`-T`}</M> flips the sign: that is the same as <M p=".">{t`\Delta G < 0`}</M> Here: <M p=".">{t`\Delta G = -33.1\ \mathrm{kJ\,mol^{-1}}`}</M></>} /> },
  ];
  if (steps.length !== GIBBS_STEPS) throw new Error('step count');
  return (
    <StepPlayer steps={steps} label={tr('Von der Entropie des Universums zur Gibbs-Energie', 'From the entropy of the universe to the Gibbs free energy')}>
      {(step, tt) => <GibbsBars frame={gibbsFrame(step, tt, lang)} label={tr('Balken: Entropie von System, Umgebung und Universum, dann mit −T multipliziert', 'Bars: entropy of system, surroundings and universe, then multiplied by −T')} />}
    </StepPlayer>
  );
}

/* ================================================================ why ΔS_sys alone does not decide (slide 24): the entropy budget at temperature T */
const BUDGET_SCALE = 700;
export function EntropyBudget() {
  const tr = useTr(), lang = useLang();
  const [T0, setT] = useState(298);
  const sSurr = dSsurr(DH, T0), sUniv = dSuniv(DH, DS, T0);
  const Tx = (DH * 1000) / DS;
  const n = (x: number) => (x >= 0 ? '+' : '-') + fmtNum(Math.abs(x), 0, lang, true);
  const frame: GFrame = {
    unitTex: t`\mathrm{J\,mol^{-1}\,K^{-1}}`, heat: null, note: null,
    bars: [
      { key: 'sys', x: 130, v: DS / BUDGET_SCALE, ink: 's', labelTex: t`\Delta S_{\mathrm{sys}}`, valueTex: n(DS), o: 1, outline: false },
      { key: 'surr', x: 300, v: sSurr / BUDGET_SCALE, ink: 's', labelTex: t`\Delta S_{\mathrm{surr}} = -\Delta H_{\mathrm{sys}}/T`, valueTex: n(sSurr), o: 1, outline: false },
      { key: 'univ', x: 470, v: sUniv / BUDGET_SCALE, ink: sUniv > 0 ? 'v' : 't', labelTex: t`\Delta S_{\mathrm{univ}}`, valueTex: n(sUniv), o: 1, outline: true },
    ],
  };
  const ok = sUniv > 0;
  return (
    <figure className="vdemo gb-fig">
      <div className="vdemo-fig wide">
        <GibbsBars frame={frame} label={tr('Entropie-Bilanz bei der gewählten Temperatur', 'Entropy budget at the chosen temperature')} />
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider">
          <span><M>T</M></span>
          <input type="range" min={150} max={800} step={1} value={T0} onChange={(e) => setT(Number(e.target.value))} aria-label="T" />
          <span className="val"><M>{t`${T0}\ \mathrm{K}`}</M></span>
        </label>
        <div className="lf-chips">
          <button type="button" aria-pressed={T0 === 298} onClick={() => setT(298)}><M>{t`298\ \mathrm{K}`}</M></button>
          <button type="button" aria-pressed={T0 === 464} onClick={() => setT(464)}><M>{t`464\ \mathrm{K}`}</M></button>
          <button type="button" aria-pressed={T0 === 700} onClick={() => setT(700)}><M>{t`700\ \mathrm{K}`}</M></button>
        </div>
        <M>{t`\Delta S_{\mathrm{univ}} = ${n(DS)} ${n(sSurr)} = ${n(sUniv)}\ \mathrm{J\,mol^{-1}K^{-1}}`}</M>
        <p className={`vdemo-note gb-verdict ${ok ? 'ok' : 'bad'}`}>
          {ok
            ? <T de={<>Das Universum gewinnt Entropie: Die Reaktion läuft von selbst. Der Wärmegewinn der Umgebung überwiegt.</>} en={<>The universe gains entropy: the reaction runs by itself. The heat gained by the surroundings wins.</>} />
            : <T de={<>Das Universum verliert Entropie: Bei dieser Temperatur läuft die Reaktion nicht von selbst. Die Umgebung nimmt zu wenig Wärme-Entropie auf.</>} en={<>The universe loses entropy: at this temperature the reaction does not run by itself. The surroundings gain too little heat entropy.</>} />}
          {' '}<T de={<>Die Grenze liegt bei <M p=".">{t`T = \Delta H/\Delta S \approx ${fmtNum(Tx, 0, lang, true)}\ \mathrm{K}`}</M></>} en={<>The boundary lies at <M p=".">{t`T = \Delta H/\Delta S \approx ${fmtNum(Tx, 0, lang, true)}\ \mathrm{K}`}</M></>} />
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ the sign of ΔG: three level diagrams (slide 26) */
export function GibbsSigns() {
  const tr = useTr(), lang = useLang();
  const w = 600, h = 230;
  const panels: { x: number; g1: number; g2: number; tex: string; word: string; wordEn: string; ink: Ink }[] = [
    { x: 10, g1: 70, g2: 150, tex: t`\Delta G < 0`, word: 'spontan', wordEn: 'spontaneous', ink: 'v' },
    { x: 205, g1: 110, g2: 110, tex: t`\Delta G = 0`, word: 'umkehrbar', wordEn: 'reversible', ink: 'g' },
    { x: 400, g1: 150, g2: 70, tex: t`\Delta G > 0`, word: 'nicht spontan', wordEn: 'nonspontaneous', ink: 't' },
  ];
  return (
    <figure className="vdemo gb-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={w} h={h} label={tr('Drei Fälle: G sinkt, bleibt gleich, steigt', 'Three cases: G falls, stays the same, rises')}>
          {panels.map((p) => (
            <g key={p.tex}>
              <line className="lf-zero" x1={p.x + 8} x2={p.x + 72} y1={p.g1} y2={p.g1} strokeWidth={4} strokeLinecap="round" />
              <line className="lf-zero" x1={p.x + 118} x2={p.x + 182} y1={p.g2} y2={p.g2} strokeWidth={4} strokeLinecap="round" />
              <line x1={p.x + 72} x2={p.x + 118} y1={p.g1} y2={p.g2} className={`lf-stroke lf-${p.ink}`} strokeWidth={1.6} strokeDasharray="5 5" />
              {p.g1 !== p.g2 && <FArrow x1={p.x + 95} y1={p.g1 + (p.g2 - p.g1) * 0.15} x2={p.x + 95} y2={p.g1 + (p.g2 - p.g1) * 0.85 + (p.g2 > p.g1 ? 0 : 0)} ink={p.ink} width={3} />}
              <FLabel x={p.x + 40} y={p.g1 - 12} anchor="b" small tex={t`G_{\mathrm{start}}`} ink="muted" />
              <FLabel x={p.x + 150} y={p.g2 - 12} anchor="b" small tex={t`G_{\mathrm{end}}`} ink="muted" />
              <FLabel x={p.x + 95} y={192} ink={p.ink} tex={p.tex} />
              <FLabel x={p.x + 95} y={216} small ink={p.ink} tex={t`\text{${lang === 'de' ? p.word : p.wordEn}}`} />
            </g>
          ))}
        </LabelFig>
      </div>
    </figure>
  );
}

/* ================================================================ reaction ledger: Σ products − Σ reactants for S°, ΔH°f, ΔG°f (slides 22, 27, 28) */
const trim = (x: number, d = 1) => Number(x.toFixed(d)).toString();
const NAME: Record<Quantity, { value: string; result: string; unit: string; ink: Ink }> = {
  S: { value: t`S^\circ`, result: t`\Delta S^\circ`, unit: t`\mathrm{J\,mol^{-1}\,K^{-1}}`, ink: 's' },
  H: { value: t`\Delta H^\circ_{\mathrm{f}}`, result: t`\Delta H^\circ_{\mathrm{rxn}}`, unit: t`\mathrm{kJ\,mol^{-1}}`, ink: 'e' },
  G: { value: t`\Delta G^\circ_{\mathrm{f}}`, result: t`\Delta G^\circ_{\mathrm{rxn}}`, unit: t`\mathrm{kJ\,mol^{-1}}`, ink: 'g' },
};
const termStr = (terms: Term[]) => terms.map(([a, sp]) => `${a > 1 ? `${a} ` : ''}${sp}`).join(' + ');
export const reactionStr = (r: Reaction) => `${termStr(r.reactants)} -> ${termStr(r.products)}`;
const speciesTex = ([a, sp]: Term) => chemTex(`${a > 1 ? `${a} ` : ''}${sp.replace(/\(.*\)/, '')}`);

export function ReactionLedger({ quantity: q0 = 'S', switchable = false, initial = 'nh3' }: { quantity?: Quantity; switchable?: boolean; initial?: string }) {
  const tr = useTr(), lang = useLang();
  const [q, setQ] = useState<Quantity>(q0);
  const [rid, setRid] = useState(initial);
  const r = REACTIONS.find((x) => x.id === rid)!;
  const nm = NAME[q];
  const n = (x: number) => fmtNum(Number(trim(x)), Number.isInteger(Number(trim(x))) ? 0 : 1, lang, true);

  // vertical layout: common scale for both columns; zero line placed so that positive and negative stacks fit
  const w = 600, h = 400, yTop = 78, yBot = 292;
  const segs = (terms: Term[]) => {
    let up = 0, down = 0;
    return terms.map((tm) => {
      const v = tm[0] * THERMO[tm[1]][q];
      const from = v >= 0 ? up : down;
      if (v >= 0) up += v; else down += v;
      return { tm, v, from, to: from + v };
    });
  };
  const L = segs(r.reactants), R = segs(r.products);
  const all = [...L, ...R];
  const maxUp = Math.max(1, ...all.map((s) => Math.max(s.from, s.to))), maxDown = Math.min(-0, ...all.map((s) => Math.min(s.from, s.to)));
  const span = maxUp - maxDown;
  const k = (yBot - yTop) / span;
  const zeroY = yTop + maxUp * k;
  const Y = (v: number) => zeroY - v * k;
  const sumL = side(q, r.reactants), sumR = side(q, r.products), res = deltaRxn(q, r);
  const cols: { x: number; segs: typeof L; sum: number; head: string; terms: Term[] }[] = [
    { x: 150, segs: L, sum: sumL, head: lang === 'de' ? t`\text{Edukte}` : t`\text{reactants}`, terms: r.reactants },
    { x: 450, segs: R, sum: sumR, head: lang === 'de' ? t`\text{Produkte}` : t`\text{products}`, terms: r.products },
  ];
  const BW = 150;
  const resTex = `${nm.result} = ${n(sumR)} - ${sumL < 0 ? `(${n(sumL)})` : n(sumL)} = ${n(res)}\\ ${nm.unit}`;
  const eq = (terms: Term[]) => terms.map(([a, sp]) => `${a > 1 ? `${a}\\cdot ` : ''}${THERMO[sp][q] < 0 ? `(${n(THERMO[sp][q])})` : n(THERMO[sp][q])}`).join(' + ');
  const chip = (id: string) => <button key={id} type="button" aria-pressed={rid === id} onClick={() => setRid(id)}><C>{reactionStr(REACTIONS.find((x) => x.id === id)!)}</C></button>;
  return (
    <figure className="vdemo gb-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={w} h={h} label={tr('Bilanz: Summe der Produkte minus Summe der Edukte', 'Ledger: sum of products minus sum of reactants')} className="gb-ledger">
          <line className="lf-zero" x1={20} x2={w - 20} y1={zeroY} y2={zeroY} />
          {cols.map((c, ci) => c.segs.map((s, i) => {
            const y0 = Y(Math.max(s.from, s.to)), hh = Math.abs(s.v) * k;
            const mid = Y((s.from + s.to) / 2);
            const label = <FLabel key={`${ci}-${i}`} x={c.x + (hh >= 22 ? 0 : (ci === 0 ? -BW / 2 - 6 : BW / 2 + 6))} y={hh >= 22 ? mid : mid} anchor={hh >= 22 ? 'c' : ci === 0 ? 'r' : 'l'} small ink={hh >= 22 ? 'fg' : nm.ink} tex={`${speciesTex(s.tm)}:\\ ${n(s.v)}`} halo={hh < 22} />;
            return (
              <g key={`${ci}-${i}`}>
                {hh > 0.5 && <rect className={`lf-fill-${nm.ink}`} x={c.x - BW / 2} y={y0} width={BW} height={hh} fillOpacity={i % 2 ? 0.55 : 0.85} stroke="var(--panel)" strokeWidth={1.5} />}
                {label}
              </g>
            );
          }))}
          {cols.map((c) => <line key={`n${c.x}`} x1={c.x - BW / 2 - 6} x2={c.x + BW / 2 + 6} y1={Y(c.sum)} y2={Y(c.sum)} stroke="var(--fg)" strokeWidth={2.6} />)}
          <FLabel x={150 + BW / 2 + 12} y={Y(sumL)} anchor="l" small ink="fg" tex={`\\Sigma = ${n(sumL)}`} />
          <FLabel x={450 - BW / 2 - 12} y={Y(sumR)} anchor="r" small ink="fg" tex={`\\Sigma = ${n(sumR)}`} />
          {Math.abs(Y(sumR) - Y(sumL)) > 8 && <FArrow x1={300} y1={Y(sumL)} x2={300} y2={Y(sumR)} ink={nm.ink} width={3.2} />}
          <FLabel x={w / 2} y={22} ink={nm.ink} tex={resTex} />
          {cols.map((c) => <FLabel key={`h${c.x}`} x={c.x} y={h - 66} ink="muted" tex={c.head} />)}
          {q === 'S' && cols.map((c) => {
            const ng = gasCount(c.terms);
            return (
              <g key={`g${c.x}`}>
                {Array.from({ length: ng }, (_, i) => <circle key={i} className="lf-fill-n" cx={c.x - 70 + i * 17} cy={h - 36} r={6.5} fillOpacity={0.85} />)}
                <FLabel x={c.x - 70 + Math.max(ng, 1) * 17 + 4} y={h - 36} anchor="l" small ink="n" tex={`n_{\\mathrm{gas}} = ${ng}`} />
              </g>
            );
          })}
        </LabelFig>
      </div>
      <figcaption className="vdemo-readout">
        {switchable && (
          <div className="lf-chips" role="group" aria-label={tr('Welche Grösse', 'Which quantity')}>
            {(['H', 'S', 'G'] as Quantity[]).map((x) => <button key={x} type="button" aria-pressed={q === x} onClick={() => setQ(x)}><M>{x === 'S' ? t`\Delta S^\circ` : x === 'H' ? t`\Delta H^\circ_{\mathrm{rxn}}` : t`\Delta G^\circ_{\mathrm{rxn}}`}</M></button>)}
          </div>
        )}
        <div className="lf-chips" role="group" aria-label={tr('Reaktion', 'Reaction')}>{REACTIONS.map((x) => chip(x.id))}</div>
        <M>{`${nm.result} = ${eq(r.products)} - ${r.reactants.length > 1 ? '(' : ''}${eq(r.reactants)}${r.reactants.length > 1 ? ')' : ''} = ${n(res)}\\ ${nm.unit}`}</M>
        {q === 'S' && (
          <p className="vdemo-note">
            {gasCount(r.products) < gasCount(r.reactants)
              ? <T de={<>Weniger Gasteilchen (Kreise unten) heisst weniger Anordnungen, also <M p=".">{t`\Delta S^\circ < 0`}</M></>} en={<>Fewer gas particles (circles below) means fewer arrangements, so <M p=".">{t`\Delta S^\circ < 0`}</M></>} />
              : gasCount(r.products) > gasCount(r.reactants)
                ? <T de={<>Mehr Gasteilchen (Kreise unten) heisst mehr Anordnungen, also <M p=".">{t`\Delta S^\circ > 0`}</M></>} en={<>More gas particles (circles below) means more arrangements, so <M p=".">{t`\Delta S^\circ > 0`}</M></>} />
                : <T de={<>Die Zahl der Gasteilchen ändert sich nicht; das Vorzeichen von <M>{t`\Delta S^\circ`}</M> ist weniger offensichtlich.</>} en={<>The number of gas particles does not change; the sign of <M>{t`\Delta S^\circ`}</M> is less obvious.</>} />}
          </p>
        )}
      </figcaption>
    </figure>
  );
}

/* ================================================================ the temperature explorer: ΔG = ΔH − TΔS (slides 26, 29; exercise 5, p. 10) */
const T_LADDER = [600, 1200, 3000, 6000];
const G_LADDER = [20, 50, 100, 200, 500, 1000, 2000];
const first = (ladder: number[], need: number) => ladder.find((x) => x >= need) ?? ladder[ladder.length - 1];
const tickFor = (max: number, target: number) => { const raw = max / target; const nice = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000]; return nice.find((x) => x >= raw) ?? raw; };

const PRESET_CASE = (id: string) => { const p = PRESETS.find((x) => x.id === id)!; return caseOf(p.dH, p.dS); };

export function GibbsExplorer({ initial = 'nh3' }: { initial?: string }) {
  const tr = useTr(), lang = useLang();
  const p0 = PRESETS.find((x) => x.id === initial)!;
  const [dH, setDH] = useState(p0.dH), [dS, setDS] = useState(p0.dS), [T0, setT] = useState(298);
  const [pid, setPid] = useState<string | null>(initial);
  const Tc = crossoverT(dH, dS);
  const Tmax = first(T_LADDER, Math.max(600, Tc !== null && Tc < 6000 ? Tc * 1.25 : 0));
  const gEnd = gibbs(dH, dS, Tmax);
  const yMax = first(G_LADDER, 1.15 * Math.max(Math.abs(dH), Math.abs(gEnd), 15));
  const tT = Math.min(T0, Tmax);
  const dG = gibbs(dH, dS, tT);
  const cs = caseOf(dH, dS), range = spontaneousRange(dH, dS);
  const num = (x: number, d = 1) => fmtNum(x, d, lang, true);
  const sg = (x: number, d = 1) => (x >= 0 ? '+' : '-') + num(Math.abs(x), d);
  const band: [number, number] | null = range.kind === 'all' ? [0, Tmax] : range.kind === 'below' ? [0, Math.min(range.T, Tmax)] : range.kind === 'above' && range.T < Tmax ? [range.T, Tmax] : null;
  const pick = (id: string) => { const p = PRESETS.find((x) => x.id === id)!; setDH(p.dH); setDS(p.dS); setPid(id); setT(id === 'pbs' ? 298 : 298); };
  const geom: Geom = { w: 320, h: 250, zeroY: 118, unit: 96, barW: 58, labelY: 232 };
  const frame: GFrame = {
    unitTex: t`\mathrm{kJ\,mol^{-1}}`, heat: null, note: null,
    bars: [
      { key: 'sys', x: 52, v: Math.max(-1.1, Math.min(1.1, dH / yMax)), ink: 'e', labelTex: t`\Delta H`, valueTex: sg(dH), o: 1, outline: false },
      { key: 'surr', x: 160, v: Math.max(-1.1, Math.min(1.1, minusTdS(dS, tT) / yMax)), ink: 's', labelTex: t`-T\,\Delta S`, valueTex: sg(minusTdS(dS, tT)), o: 1, outline: false },
      { key: 'univ', x: 268, v: Math.max(-1.1, Math.min(1.1, dG / yMax)), ink: 'g', labelTex: t`\Delta G`, valueTex: sg(dG), o: 1, outline: true },
    ],
  };
  const verdict = dG < 0 ? 'ok' : dG > 0 ? 'bad' : 'eq';
  const rangeText = () => {
    const tc = Tc === null ? '' : t`T_{\mathrm{c}} = \Delta H/\Delta S = ${num(Tc, 0)}\ \mathrm{K}`;
    switch (range.kind) {
      case 'all': return <T de="Bei jeder Temperatur spontan." en="Spontaneous at every temperature." />;
      case 'none': return <T de="Bei keiner Temperatur spontan." en="Spontaneous at no temperature." />;
      case 'below': return <T de={<>Spontan bei tiefen Temperaturen, <M p=",">{t`T < T_{\mathrm{c}}`}</M> <M p=".">{tc}</M></>} en={<>Spontaneous at low temperatures, <M p=",">{t`T < T_{\mathrm{c}}`}</M> <M p=".">{tc}</M></>} />;
      case 'above': return <T de={<>Spontan bei hohen Temperaturen, <M p=",">{t`T > T_{\mathrm{c}}`}</M> <M p=".">{tc}</M></>} en={<>Spontaneous at high temperatures, <M p=",">{t`T > T_{\mathrm{c}}`}</M> <M p=".">{tc}</M></>} />;
    }
  };
  const chip = (id: string, content: ReactNode) => <button key={id} type="button" aria-pressed={pid === id} onClick={() => pick(id)}>{content}</button>;
  return (
    <figure className="vdemo gb-fig gb-explorer">
      <div className="vdemo-fig wide gb-plot">
        <Plot x={[0, Tmax]} y={[-yMax, yMax]} w={460} h={340} grid={[tickFor(Tmax, 6), tickFor(yMax, 3)]} tick={[tickFor(Tmax, 6), tickFor(yMax, 3)]} axes={[t`T`, t`\Delta G`]}
          label={tr('ΔG gegen T: eine Gerade, die bei ΔH startet und die Steigung −ΔS hat', 'ΔG against T: a straight line that starts at ΔH and has slope −ΔS')}>
          {band && <Band vertical from={band[0]} to={band[1]} role="cg" />}
          <HLine y={0} role="aux" dashed={false} />
          <Line p={[0, dH]} m={-dS / 1000} role="cg" />
          <VLine x={tT} role="ct" />
          {Tc !== null && Tc <= Tmax && <><VLine x={Tc} role="pt" /><Pt x={Tc} y={0} role="pt" r={5.5} /><PLabel x={Tc} y={0} dy={Tc > 0 ? 18 : 0} tex={t`T_{\mathrm{c}}`} role="fg" small /></>}
          <Pt x={0} y={dH} role="ce" r={5} />
          <PLabel x={0} y={dH} dx={10} dy={dH > 0 ? -12 : 12} anchor="l" tex={t`\Delta H`} role="ce" small />
          <Pt x={tT} y={dG} role="cg" r={6.5} />
          <PLabel x={tT} y={dG} dx={0} dy={dG > 0 ? -14 : 16} tex={t`\Delta G`} role="cg" small />
        </Plot>
      </div>
      <figcaption className="vdemo-readout gb-readout">
        <div className="lf-chips" role="group" aria-label={tr('Beispiele', 'Examples')}>
          {chip('o3-decay', <><span className="gb-case">{PRESET_CASE('o3-decay')}</span> <C>2 O3 -&gt; 3 O2</C></>)}
          {chip('o3-form', <><span className="gb-case">{PRESET_CASE('o3-form')}</span> <C>3 O2 -&gt; 2 O3</C></>)}
          {chip('freeze', <><span className="gb-case">{PRESET_CASE('freeze')}</span> <C>H2O(l) -&gt; H2O(s)</C></>)}
          {chip('melt', <><span className="gb-case">{PRESET_CASE('melt')}</span> <C>H2O(s) -&gt; H2O(l)</C></>)}
          {chip('nh3', <><span className="gb-case">{PRESET_CASE('nh3')}</span> <C>N2 + 3 H2 -&gt; 2 NH3</C></>)}
          {chip('pbs', <><span className="gb-case">{PRESET_CASE('pbs')}</span> <T de="Übung 7" en="Exercise 7" /> (<C>PbS</C>)</>)}
        </div>
        <label className="slider wide-slider">
          <span><M>{t`\Delta H`}</M></span>
          <input type="range" min={-1000} max={1000} step={1} value={Math.round(dH)} onChange={(e) => { setDH(Number(e.target.value)); setPid(null); }} aria-label="ΔH" />
          <span className="val"><M>{t`${sg(dH, 0)}`}</M></span>
        </label>
        <label className="slider wide-slider">
          <span><M>{t`\Delta S`}</M></span>
          <input type="range" min={-300} max={300} step={1} value={Math.round(dS)} onChange={(e) => { setDS(Number(e.target.value)); setPid(null); }} aria-label="ΔS" />
          <span className="val"><M>{t`${sg(dS, 0)}`}</M></span>
        </label>
        <label className="slider wide-slider">
          <span><M>T</M></span>
          <input type="range" min={0} max={Tmax} step={Tmax > 1500 ? 10 : 1} value={tT} onChange={(e) => setT(Number(e.target.value))} aria-label="T" />
          <span className="val"><M>{t`${Math.round(tT)}\ \mathrm{K}`}</M></span>
        </label>
        <GibbsBars frame={frame} geom={geom} label={tr('Balken: ΔH, −TΔS und ΔG bei der gewählten Temperatur', 'Bars: ΔH, −TΔS and ΔG at the chosen temperature')} />
        <M>{t`\Delta G = ${sg(dH)} ${sg(minusTdS(dS, tT))} = ${sg(dG)}\ \mathrm{kJ\,mol^{-1}}`}</M>
        <p className={`vdemo-note gb-verdict ${verdict}`}>
          {verdict === 'ok' && <T de={<>Hier ist <M>{t`\Delta G < 0`}</M>: spontan.</>} en={<>Here <M>{t`\Delta G < 0`}</M>: spontaneous.</>} />}
          {verdict === 'bad' && <T de={<>Hier ist <M>{t`\Delta G > 0`}</M>: nicht spontan.</>} en={<>Here <M>{t`\Delta G > 0`}</M>: nonspontaneous.</>} />}
          {verdict === 'eq' && <T de={<>Hier ist <M>{t`\Delta G = 0`}</M>: im Gleichgewicht, umkehrbar.</>} en={<>Here <M>{t`\Delta G = 0`}</M>: at equilibrium, reversible.</>} />}
          {' '}{cs && <T de={<>Fall {cs} der Folie. </>} en={<>Case {cs} of the slide. </>} />}{rangeText()}
        </p>
      </figcaption>
    </figure>
  );
}
