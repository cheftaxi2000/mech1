import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr, type Lang } from '../../i18n';
import {
  BOND_H, BOND_L, BOND_RXNS, EN, HX, ION_RADIUS, STRUCTS, VALENCE, assignedFC, assignedOx, bondRoute, bondType, bornHaberRoute,
  coulombKJ, deltaEN, dipoleD, electronsAround, en, fcSize, formalCharge, lewisDots, oxidationNumber, sumBonds, type LStruct, type StructId,
} from '../../chem/bonding';
import { configTex } from '../../chem/config';
import { ELEMENTS } from '../../chem/elements';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import { useReducedMotion } from '../figUtils';
import { cbuilder } from './cscene';
import { SceneFig, ThChips } from './ChemFig';
import { Slider } from './ChControls';
import { PeriodicGrid, type CellStyle } from './PeriodicGrid';
import { covalentScene, hcnScene, lewisScene, naclScene, signed, type CovMol } from './bondScenes';
import { hessScene, kj } from './hessScene';
import './bonding.css';

const t = String.raw;
const num = (x: number, d: number, lang: Lang) => fmtNum(x, d, lang, true);
const sym = (el: string) => t`\mathrm{${el}}`;

/* ================================================================ Lewis symbols (slide 5) */

const ROWS: Record<'2' | '3', string[]> = { 2: ['Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne'], 3: ['Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar'] };
const SIDE_ORDER = ['r', 'l', 't', 'b'] as const;
/** Dot positions of a Lewis symbol around (cx, cy), in the order the electrons are placed (k < 4: first dot of a side, k ≥ 4: its partner). */
function dotPositions(n: number, cx: number, cy: number, R: number, gap: number): [number, number][] {
  const cnt = lewisDots(n);
  return Array.from({ length: n }, (_, k) => {
    const side = SIDE_ORDER[k % 4];
    const o = cnt[side] === 2 ? (k >= 4 ? gap : -gap) : 0;
    return side === 'r' ? [cx + R, cy + o] : side === 'l' ? [cx - R, cy + o] : side === 't' ? [cx + o, cy - R] : [cx + o, cy + R];
  });
}
function LewisGlyph({ el, shown, size }: { el: string; shown: number; size: 'big' | 'small' }) {
  const n = VALENCE[el];
  const big = size === 'big';
  const W = big ? 120 : 60, cx = W / 2, cy = W / 2 + (big ? 0 : 1);
  const pts = dotPositions(n, cx, cy, big ? 34 : 17, big ? 6 : 3.2);
  return (
    <svg viewBox={`0 0 ${W} ${W}`} aria-hidden="true">
      <text className="ls-sym" x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={big ? 44 : (el.length > 1 ? 19 : 22)}>{el}</text>
      {pts.map((p, k) => <circle key={k} className="ls-dot" cx={p[0]} cy={p[1]} r={big ? 3.6 : 2} style={{ opacity: k < shown ? 1 : 0 }} />)}
    </svg>
  );
}

/** Pick an element of period 2 or 3; its valence electrons are placed one by one by the slide's rules. */
export function LewisSymbols() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const [row, setRow] = useState<'2' | '3'>('2');
  const [el, setEl] = useState('S');
  const [shown, setShown] = useState(VALENCE.S);
  const list = ROWS[row];
  const n = VALENCE[el];
  const pick = (e: string) => { setEl(e); setShown(reduced ? VALENCE[e] : 0); };
  useEffect(() => {
    if (shown >= n) return;
    const id = setTimeout(() => setShown((s) => s + 1), 260);
    return () => clearTimeout(id);
  }, [shown, n]);
  const Z = ELEMENTS.find((e) => e.symbol === el)!.Z;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <div className="ls-big"><LewisGlyph el={el} shown={shown} size="big" /></div>
        <div className="ls-row" role="group" aria-label={tr('Element wählen', 'Choose an element')}>
          {list.map((e) => <button key={e} type="button" aria-pressed={e === el} onClick={() => pick(e)} aria-label={e}><LewisGlyph el={e} shown={8} size="small" /></button>)}
        </div>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Periode', 'Period')} value={row} onPick={(r) => { setRow(r); pick(ROWS[r][(ROWS[row].indexOf(el) + 8) % 8] ?? ROWS[r][5]); }} items={[
          { id: '2', label: <T de="2. Periode" en="Period 2" /> }, { id: '3', label: <T de="3. Periode" en="Period 3" /> },
        ]} />
        <div className="v-result"><M>{t`\mathrm{${el}}:\ ${configTex(Z)}`}</M></div>
        <div className="v-result pos"><M>{t`\Rightarrow\ ${n}\ \text{${lang === 'de' ? 'Valenzelektronen' : 'valence electrons'}}`}</M></div>
        <button type="button" className="motion-btn" onClick={() => setShown(reduced ? n : 0)}><T de="Punkte neu setzen" en="Place the dots again" /></button>
        <p className="vdemo-note"><T
          de={<>Zuerst bekommt jede der vier Seiten einen Punkt, erst dann werden Paare gebildet; höchstens zwei Punkte pro Seite. Welche Seite zuerst kommt, ist egal (Folie 5: «beide sind richtig»).</>}
          en={<>First each of the four sides gets one dot, only then are pairs formed; at most two dots per side. Which side comes first does not matter (slide 5: “both are correct”).</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ Na → Cl (slide 7) */

export function NaClFig({ step, t: tt }: { step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  return <SceneFig scene={naclScene(step, tt, lang)} label={tr('Natrium gibt ein Elektron an Chlor ab; die Ionen ziehen sich an und bilden ein Gitter', 'Sodium gives an electron to chlorine; the ions attract and form a lattice')} />;
}

/* ================================================================ Born–Haber cycle (slide 8) */

export function BornHaberFigure() {
  const tr = useTr(), lang = useLang();
  const route = useMemo(() => bornHaberRoute(), []);
  const v = (i: number) => kj(route.steps[i].dH, lang);
  const steps: AnimStep[] = [
    { ms: 700, holdMs: 2400, caption: <T de={<>Start unten: festes Kochsalz <C p=".">NaCl(s)</C> Wir wollen wissen, wie viel Energie es kostet, es in freie Ionen zu zerlegen.</>} en={<>Start at the bottom: solid table salt <C p=".">NaCl(s)</C> We want to know how much energy it takes to break it into free ions.</>} /> },
    { ms: 1400, holdMs: 2800, caption: <T de={<>Zuerst rückwärts zur Bildung: NaCl zurück in die Elemente. Kostet <M p=".">{t`-\Delta H^\circ_f = ${v(0)}\,\mathrm{kJ}`}</M></>} en={<>First the formation backwards: NaCl back into the elements. Costs <M p=".">{t`-\Delta H^\circ_f = ${v(0)}\,\mathrm{kJ}`}</M></>} /> },
    { ms: 1300, holdMs: 2600, caption: <T de={<>Festes Natrium wird gasförmig: <M p=".">{t`${v(1)}\,\mathrm{kJ}`}</M></>} en={<>Solid sodium becomes a gas: <M p=".">{t`${v(1)}\,\mathrm{kJ}`}</M></>} /> },
    { ms: 1300, holdMs: 2600, caption: <T de={<>Ein halbes Mol <C>Cl2</C> wird in Atome gespalten: <M p=".">{t`${v(2)}\,\mathrm{kJ}`}</M></>} en={<>Half a mole of <C>Cl2</C> is split into atoms: <M p=".">{t`${v(2)}\,\mathrm{kJ}`}</M></>} /> },
    { ms: 1500, holdMs: 2800, caption: <T de={<>Natrium verliert sein Valenzelektron, die Ionisierungsenergie <M p=":">{t`I_1`}</M> <M p=".">{t`${v(3)}\,\mathrm{kJ}`}</M></>} en={<>Sodium loses its valence electron, the ionisation energy <M p=":">{t`I_1`}</M> <M p=".">{t`${v(3)}\,\mathrm{kJ}`}</M></>} /> },
    { ms: 1300, holdMs: 2800, caption: <T de={<>Chlor nimmt das Elektron auf. Das setzt Energie frei, der Pfeil geht nach unten: <M p=".">{t`EA = ${v(4)}\,\mathrm{kJ}`}</M></>} en={<>Chlorine takes the electron. This releases energy, the arrow points down: <M p=".">{t`EA = ${v(4)}\,\mathrm{kJ}`}</M></>} /> },
    { ms: 1700, holdMs: 3600, caption: <T de={<>Der direkte Pfeil von unten bis oben ist die Gitterenergie: <M p=".">{t`\Delta H_\mathrm{lat} = ${kj(route.total, lang)}\,\mathrm{kJ/mol}`}</M> Hess: Der Weg spielt keine Rolle.</>} en={<>The direct arrow from bottom to top is the lattice energy: <M p=".">{t`\Delta H_\mathrm{lat} = ${kj(route.total, lang)}\,\mathrm{kJ/mol}`}</M> Hess: the path does not matter.</>} /> },
  ];
  return (
    <StepPlayer key={lang} steps={steps} label={tr('Born-Haber-Kreisprozess für NaCl', 'Born–Haber cycle for NaCl')}>
      {(step, tt) => <SceneFig scene={hessScene(route, step, tt, lang)} label={tr('Energiestufen von NaCl(s) bis zu den freien Ionen', 'Energy levels from NaCl(s) to the free ions')} />}
    </StepPlayer>
  );
}

/* ================================================================ Coulomb: charge and size (slide 7 margin, exercise 7 p. 7) */

const SALTS = [
  { id: 'NaCl', cat: 'Na+', an: 'Cl-', q: 1 }, { id: 'KCl', cat: 'K+', an: 'Cl-', q: 1 }, { id: 'NaF', cat: 'Na+', an: 'F-', q: 1 },
  { id: 'MgO', cat: 'Mg2+', an: 'O2-', q: 2 },
] as const;
export function CoulombFigure() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<string>('NaCl');
  const E = (s: (typeof SALTS)[number]) => coulombKJ(s.q, s.q, ION_RADIUS[s.cat] + ION_RADIUS[s.an]);
  const ref = E(SALTS[0]);
  const s = SALTS.find((x) => x.id === id)!;
  const rc = ION_RADIUS[s.cat], ra = ION_RADIUS[s.an], k = 0.36;
  const ion = (n: string) => n.replace(/(\d?)([+-])$/, (_m, d, sg) => `^{${d}${sg === '-' ? '-' : '+'}}`);
  const maxE = Math.max(...SALTS.map(E));
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg className="pol-svg" viewBox="0 0 400 270" role="img" aria-label={tr('Zwei Ionen im Kontakt und die Coulomb-Energie im Vergleich', 'Two ions in contact and their Coulomb energy compared')}>
          <circle cx={150} cy={70} r={rc * k} className="bd-na" />
          <circle cx={150 + (rc + ra) * k} cy={70} r={ra * k} className="bd-cl" />
          <line x1={150} y1={70 + ra * k + 12} x2={150 + (rc + ra) * k} y2={70 + ra * k + 12} className="sq-ideal" />
          {SALTS.map((x, i) => {
            const w = (E(x) / maxE) * 250, y = 192 + i * 19;
            return <g key={x.id}><rect x={100} y={y - 7} width={w} height={13} className={x.id === id ? 'bl-bar-h' : 'bl-bar-l'} opacity={x.id === id ? 1 : 0.55} /></g>;
          })}
        </svg>
        {SALTS.map((x, i) => <div key={x.id} className="anim-label small" style={{ left: '24%', top: `${((192 + i * 19) / 270) * 100}%`, transform: 'translate(-100%, -50%)' }}><C>{x.id}</C></div>)}
        <div className="anim-label" style={{ left: `${(150 / 400) * 100}%`, top: `${(70 / 270) * 100}%` }}><M>{t`\mathrm{${ion(s.cat)}}`}</M></div>
        <div className="anim-label" style={{ left: `${((150 + (rc + ra) * k) / 400) * 100}%`, top: `${(70 / 270) * 100}%` }}><M>{t`\mathrm{${ion(s.an)}}`}</M></div>
        <div className="anim-label small" style={{ left: `${((150 + ((rc + ra) * k) / 2) / 400) * 100}%`, top: `${((70 + ra * k + 26) / 270) * 100}%` }}><M>{t`d = ${rc + ra}\ \mathrm{pm}`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Salz wählen', 'Choose a salt')} value={id} onPick={setId} items={SALTS.map((x) => ({ id: x.id, label: <C>{x.id}</C> }))} />
        <div className="v-result"><M>{t`E \propto \frac{Q_1 Q_2}{d} = \frac{${s.q}\cdot ${s.q}}{${rc + ra}\ \mathrm{pm}}`}</M></div>
        <div className="v-result pos"><M>{t`\frac{E}{E_\mathrm{NaCl}} = ${num(E(s) / ref, 2, lang)}`}</M></div>
        <p className="vdemo-note"><T
          de={<>Die Balken zeigen die Anziehung eines einzelnen Ionenpaars, das sich berührt (<M p=")">{t`d = r_+ + r_-`}</M> Doppelte Ladungen geben die vierfache Anziehung; kleinere Ionen kommen näher zusammen. Die Gitterenergie selbst ist grösser, weil im Kristall viele Nachbarn ziehen; der Trend ist derselbe.</>}
          en={<>The bars show the attraction of one ion pair in contact (<M p=")">{t`d = r_+ + r_-`}</M> Double charges give four times the attraction; smaller ions get closer together. The lattice energy itself is larger because many neighbours pull in the crystal; the trend is the same.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ sharing a pair (slide 9) */

export function CovalentPlayer() {
  const tr = useTr(), lang = useLang();
  const [mol, setMol] = useState<CovMol>('H2');
  const steps: AnimStep[] = [
    { ms: 600, holdMs: 2400, caption: <T de={<>Zwei Atome, jedes mit einem ungepaarten Valenzelektron (gelb).</>} en={<>Two atoms, each with one unpaired valence electron (yellow).</>} /> },
    { ms: 1500, holdMs: 2400, caption: <T de={<>Die Atome kommen sich näher, ihre Elektronenwolken überlappen.</>} en={<>The atoms come closer, their electron clouds overlap.</>} /> },
    { ms: 1400, holdMs: 3200, caption: <T de={mol === 'H2' ? <>Die zwei Elektronen sitzen jetzt zwischen den Kernen und gehören beiden. Jedes H zählt 2 Elektronen, wie Helium.</> : <>Das Paar gehört beiden Atomen. Jedes Cl zählt 6 eigene plus 2 geteilte, also 8 Elektronen, wie Argon.</>}
      en={mol === 'H2' ? <>The two electrons now sit between the nuclei and belong to both. Each H counts 2 electrons, like helium.</> : <>The pair belongs to both atoms. Each Cl counts 6 of its own plus 2 shared, so 8 electrons, like argon.</>} /> },
    { ms: 900, holdMs: 2600, caption: <T de={<>Das Bindungspaar wird als Strich gezeichnet{mol === 'Cl2' ? '; die übrigen Paare bleiben Punkte, die freien Elektronenpaare' : ''}.</>} en={<>The bonding pair is drawn as a line{mol === 'Cl2' ? '; the other pairs stay dots, the lone pairs' : ''}.</>} /> },
  ];
  return (
    <>
      <ThChips label={tr('Molekül wählen', 'Choose a molecule')} value={mol} onPick={setMol} items={[{ id: 'H2', label: <C>H2</C> }, { id: 'Cl2', label: <C>Cl2</C> }]} />
      <StepPlayer key={mol + lang} steps={steps} label={tr('Zwei Atome teilen ein Elektronenpaar', 'Two atoms share an electron pair')}>
        {(step, tt) => <SceneFig scene={covalentScene(mol, step, tt, lang)} label={tr('Zwei Atome teilen ein Elektronenpaar', 'Two atoms share an electron pair')} />}
      </StepPlayer>
    </>
  );
}

/* ================================================================ octet counting with single, double, triple bonds (slides 9–10) */

const OCTET_MOLS: StructId[] = ['H2', 'Cl2', 'CO2', 'N2', 'HCN'];
export function OctetCounter() {
  const tr = useTr();
  const [id, setId] = useState<StructId>('CO2');
  const [dots, setDots] = useState(false);
  const s = STRUCTS[id] as LStruct;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <SceneFig scene={lewisScene(s, { octet: true, book: dots ? 'dots' : 'none', w: 380, h: 170 })} label={tr('Lewis-Struktur mit gezählten Elektronen um jedes Atom', 'Lewis structure with the electrons around each atom counted')} />
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Molekül', 'Molecule')} value={id} onPick={(k) => setId(k as StructId)} items={OCTET_MOLS.map((k) => ({ id: k, label: <C>{k}</C> }))} />
        <ThChips label={tr('Darstellung', 'Display')} value={dots ? 'dots' : 'lines'} onPick={(k) => setDots(k === 'dots')} items={[
          { id: 'lines', label: <T de="Striche" en="Lines" /> }, { id: 'dots', label: <T de="Punkte" en="Dots" /> },
        ]} />
        <div className="v-result">{s.atoms.map((a, i) => <span key={i}><M>{t`\mathrm{${a.el}}{:}\ ${electronsAround(s, i)}`}</M>{i < s.atoms.length - 1 ? ', ' : ''}</span>)}</div>
        <p className="vdemo-note"><T
          de={<>Der gestrichelte Kreis zählt alle Elektronen, die ein Atom «sieht»: seine freien Paare und jedes geteilte Paar ganz. Ein Doppelstrich zählt 4, ein Dreifachstrich 6 Elektronen. H braucht nur 2.</>}
          en={<>The dashed circle counts every electron an atom “sees”: its lone pairs and every shared pair in full. A double line counts 4, a triple line 6 electrons. H needs only 2.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ electronegativity and bond polarity (slides 11–14) */

const QUICK: [string, string][] = [['F', 'F'], ['H', 'F'], ['Li', 'F'], ['H', 'Cl'], ['C', 'O'], ['Na', 'Cl']];
export function PolarityExplorer() {
  const tr = useTr(), lang = useLang();
  const [a, setA] = useState('H');
  const [b, setB] = useState('F');
  const [slot, setSlot] = useState<0 | 1>(0);
  const d = deltaEN(a, b);
  const type = bondType(a, b);
  const ea = en(a), eb = en(b);
  const neg = eb >= ea ? 1 : 0; // which atom carries δ−
  const style = (e: { symbol: string }): CellStyle => {
    const v = EN[e.symbol];
    if (v === undefined) return { bg: 'var(--fill-2)', opacity: 0.4 };
    const k = (v - 0.7) / 3.3;
    return { bg: `color-mix(in srgb, var(--ch-n) ${Math.round(6 + 70 * k)}%, var(--panel))`, sub: num(v, 1, lang).replace('{,}', ','), ink: k > 0.75 ? '#fff' : undefined, ring: e.symbol === a || e.symbol === b };
  };
  const pick = (Z: number) => {
    const s = ELEMENTS.find((e) => e.Z === Z)!.symbol;
    if (EN[s] === undefined) return;
    if (slot === 0) setA(s); else setB(s);
    setSlot(slot === 0 ? 1 : 0);
  };
  // picture: the shared cloud shifts toward the more electronegative atom
  const xA = 140, xB = 260, cy = 74;
  const shift = Math.min(1, d / 2.6) * (neg ? 1 : -1);
  const ionic = type === 'ionic';
  const pairX = 200 + shift * 52;
  const tint = Math.min(1, d / 2.4);
  const gid = `pg-${a}-${b}`;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <PeriodicGrid label={tr('Elektronegativität im Periodensystem (Folie 13)', 'Electronegativity in the periodic table (slide 13)')} onPick={pick} style={style} />
      </div>
      <div className="vdemo-fig">
        <svg className="pol-svg" viewBox="0 0 400 150" role="img" aria-label={tr('Zwei gebundene Atome: die Elektronenwolke verschiebt sich zum elektronegativeren Atom', 'Two bonded atoms: the electron cloud shifts toward the more electronegative atom')}>
          <defs>
            <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={`color-mix(in srgb, var(${neg ? '--ch-t' : '--ch-p'}) ${Math.round(12 + 50 * tint)}%, var(--panel))`} />
              <stop offset="50%" stopColor="color-mix(in srgb, var(--ch-v) 18%, var(--panel))" />
              <stop offset="100%" stopColor={`color-mix(in srgb, var(${neg ? '--ch-p' : '--ch-t'}) ${Math.round(12 + 50 * tint)}%, var(--panel))`} />
            </linearGradient>
          </defs>
          {ionic ? (
            <>
              <circle cx={neg ? xA - 8 : xA + 8} cy={cy} r={neg ? 30 : 44} fill={`color-mix(in srgb, var(${neg ? '--ch-t' : '--ch-p'}) 40%, var(--panel))`} stroke="var(--fg)" strokeWidth={1} />
              <circle cx={neg ? xB + 8 : xB - 8} cy={cy} r={neg ? 44 : 30} fill={`color-mix(in srgb, var(${neg ? '--ch-p' : '--ch-t'}) 40%, var(--panel))`} stroke="var(--fg)" strokeWidth={1} />
            </>
          ) : (
            <path d={`M ${xA - 50} ${cy} C ${xA - 50} ${cy - 56}, ${xB + 50} ${cy - 56}, ${xB + 50} ${cy} C ${xB + 50} ${cy + 56}, ${xA - 50} ${cy + 56}, ${xA - 50} ${cy} Z`} fill={`url(#${gid})`} stroke="var(--muted)" strokeWidth={0.8} />
          )}
          <text className="pol-nuc" x={xA} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={24}>{a}</text>
          <text className="pol-nuc" x={xB} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={24}>{b}</text>
          {!ionic && <>
            <circle cx={pairX} cy={cy - 5} r={3.2} className="bd-e-move" />
            <circle cx={pairX} cy={cy + 5} r={3.2} className="bd-e-move" />
          </>}
          {d > 0 && (() => {
            // dipole arrow from − to + (physicists' convention of slide 15)
            const from = neg ? xB : xA, to = neg ? xA : xB;
            const y = 136, dir = Math.sign(to - from);
            return <g><line x1={from} y1={y} x2={to - dir * 9} y2={y} className="pol-dipole" /><polygon points={`${to},${y} ${to - dir * 10},${y - 5} ${to - dir * 10},${y + 5}`} className="pol-dipole-head" /></g>;
          })()}
        </svg>
        {d > 0 && <>
          <div className="anim-label small ink-c-t" style={{ left: `${((neg ? xA : xB) / 400) * 100}%`, top: `${(14 / 150) * 100}%` }}><M>{ionic ? '+' : t`\delta^+`}</M></div>
          <div className="anim-label small ink-c-p" style={{ left: `${((neg ? xB : xA) / 400) * 100}%`, top: `${(14 / 150) * 100}%` }}><M>{ionic ? '-' : t`\delta^-`}</M></div>
          <div className="anim-label small ink-c-n" style={{ left: '50%', top: `${(124 / 150) * 100}%` }}><M>{t`\vec\mu`}</M></div>
        </>}
      </div>
      <figcaption className="vdemo-readout">
        <div className="bd-picks">
          <span className="bd-pick-label"><T de="Paar" en="Pair" /></span>
          {QUICK.map(([x, y]) => <button key={x + y} type="button" className="kf-chip" aria-pressed={a === x && b === y} onClick={() => { setA(x); setB(y); setSlot(0); }}><C>{x === y ? `${x}2` : `${x}${y}`}</C></button>)}
        </div>
        <p className="vdemo-note"><T de={<>Oder im Periodensystem tippen: zuerst das {slot === 0 ? <b>erste</b> : 'erste'}, dann das {slot === 1 ? <b>zweite</b> : 'zweite'} Atom.</>} en={<>Or tap in the periodic table: first the {slot === 0 ? <b>first</b> : 'first'}, then the {slot === 1 ? <b>second</b> : 'second'} atom.</>} /></p>
        <div className="v-result"><M>{t`\Delta EN = |${num(eb, 1, lang)} - ${num(ea, 1, lang)}| = ${num(d, 1, lang)}`}</M></div>
        <div className={`v-result ${type === 'polar' ? 'pos' : ''}`}>
          {type === 'nonpolar' && <T de="unpolare kovalente Bindung: gleich geteilt" en="nonpolar covalent bond: shared equally" />}
          {type === 'polar' && <T de="polare kovalente Bindung: ungleich geteilt" en="polar covalent bond: shared unequally" />}
          {type === 'ionic' && <M>{t`\ge 2:\ \text{${lang === 'de' ? 'Ionenbindung (Faustregel)' : 'ionic bond (rule of thumb)'}}`}</M>}
        </div>
        <p className="vdemo-note"><T
          de={<>Rot ist das Atom, das Elektronen verliert (<M p=")">{t`\delta^+`}</M> blau das, das sie anzieht (<M p=")">{t`\delta^-`}</M> wie auf Folie 14. Die Karte auf Folie 12 färbt umgekehrt (rot: viel Elektronendichte). Der Pfeil <M>{t`\vec\mu`}</M> zeigt von minus nach plus, wie in der Vorlesung.</>}
          en={<>Red is the atom that loses electrons (<M p=")">{t`\delta^+`}</M> blue the one that attracts them (<M p=")">{t`\delta^-`}</M> as on slide 14. The map on slide 12 colours the other way round (red: high electron density). The arrow <M>{t`\vec\mu`}</M> points from minus to plus, as in the lecture.</>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ dipole moment |μ| = Q r (slide 15) */

const DIP_PRESETS = [
  { id: 'e', q: 1, r: 100, label: ['Proton + Elektron', 'proton + electron'] },
  { id: 'HF', q: HX.HF.mu / dipoleD(1, HX.HF.r), r: HX.HF.r },
  { id: 'HCl', q: HX.HCl.mu / dipoleD(1, HX.HCl.r), r: HX.HCl.r },
  { id: 'HI', q: HX.HI.mu / dipoleD(1, HX.HI.r), r: HX.HI.r },
] as const;
export function DipoleFigure() {
  const tr = useTr(), lang = useLang();
  const [q, setQ] = useState(1);
  const [r, setR] = useState(100);
  const mu = dipoleD(q, r);
  const xm = 200 - r * 0.6, xp = 200 + r * 0.6; // − on the left (like F in H–F written right-to-left? keep: − left, + right)
  const rad = 10 + 16 * q;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg className="pol-svg" viewBox="0 0 400 150" role="img" aria-label={tr('Zwei Ladungen plus und minus Q im Abstand r und der Dipolpfeil', 'Two charges plus and minus Q at distance r and the dipole arrow')}>
          <circle cx={xm} cy={62} r={rad} fill="color-mix(in srgb, var(--ch-p) 30%, var(--panel))" stroke="var(--ch-p)" />
          <circle cx={xp} cy={62} r={rad} fill="color-mix(in srgb, var(--ch-t) 30%, var(--panel))" stroke="var(--ch-t)" />
          <line x1={xm} y1={118} x2={xp} y2={118} className="sq-ideal" />
          <line x1={xm + 4} y1={138} x2={xp - 10} y2={138} className="pol-dipole" />
          <polygon points={`${xp},138 ${xp - 10},133 ${xp - 10},143`} className="pol-dipole-head" />
        </svg>
        <div className="anim-label small" style={{ left: `${(xm / 400) * 100}%`, top: `${(62 / 150) * 100}%` }}><M>{t`-Q`}</M></div>
        <div className="anim-label small" style={{ left: `${(xp / 400) * 100}%`, top: `${(62 / 150) * 100}%` }}><M>{t`+Q`}</M></div>
        <div className="anim-label small" style={{ left: '50%', top: `${(108 / 150) * 100}%` }}><M>r</M></div>
        <div className="anim-label small ink-c-n" style={{ left: `${((xp + 14) / 400) * 100}%`, top: `${(138 / 150) * 100}%`, transform: 'translate(0, -50%)' }}><M>{t`\vec\mu`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Beispiel', 'Example')} value={DIP_PRESETS.find((p) => Math.abs(p.q - q) < 0.005 && p.r === r)?.id ?? ''} onPick={(id) => { const p = DIP_PRESETS.find((x) => x.id === id)!; setQ(Math.round(p.q * 100) / 100); setR(p.r); }}
          items={DIP_PRESETS.map((p) => ({ id: p.id, label: p.id === 'e' ? <T de="Proton + Elektron" en="proton + electron" /> : <C>{p.id}</C> }))} />
        <Slider label={<M>Q</M>} min={0} max={1} step={0.01} value={q} onChange={setQ} show={<M>{t`${num(q, 2, lang)}\,e`}</M>} aria="Q" />
        <Slider label={<M>r</M>} min={50} max={200} step={1} value={r} onChange={setR} show={<M>{t`${r}\ \mathrm{pm}`}</M>} aria="r" />
        <div className="v-result pos"><M>{t`|\vec\mu| = Qr = ${num(q, 2, lang)}\cdot 1{,}602\cdot10^{-19}\,\mathrm{C}\cdot ${r}\cdot 10^{-12}\,\mathrm m = ${num(mu, 2, lang)}\ \mathrm D`.replace('1{,}602', lang === 'de' ? '1{,}602' : '1.602')}</M></div>
        <p className="vdemo-note"><T
          de={<>Bei den Halogenwasserstoffen ist <M>Q</M> die Partialladung <M p=",">\delta</M> berechnet aus dem gemessenen Dipolmoment. Je weniger polar die Bindung, desto kleiner <M p=".">\delta</M> Gemessene Werte nicht auf den Folien, ausser <M p=".">{t`|\vec\mu_\mathrm{HF}| = 1{,}8\ \mathrm D`}</M></>}
          en={<>For the hydrogen halides <M>Q</M> is the partial charge <M p=",">\delta</M> computed from the measured dipole moment. The less polar the bond, the smaller <M p=".">\delta</M> The measured values are not on the slides, except <M p=".">{t`|\vec\mu_\mathrm{HF}| = 1.8\ \mathrm D`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ ionic or covalent? (slide 16, exercise 7 p. 7) */

const DEC = [
  { id: 'Cl2', a: 'Cl', b: 'Cl', metal: false, ox: 0 },
  { id: 'HCl', a: 'H', b: 'Cl', metal: false, ox: 0 },
  { id: 'NaCl', a: 'Na', b: 'Cl', metal: true, ox: 1 },
  { id: 'MnO', a: 'Mn', b: 'O', metal: true, ox: 2 },
  { id: 'Mn2O7', a: 'Mn', b: 'O', metal: true, ox: 7 },
] as const;
export function BondDecision() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState<string>('MnO');
  const c = DEC.find((x) => x.id === id)!;
  const d = deltaEN(c.a, c.b);
  const big = d >= 2;
  const high = c.ox >= 4;
  const result: 'cov1' | 'ionic' | 'cov2' = !big ? 'cov1' : high ? 'cov2' : 'ionic';
  const de = lang === 'de';
  const box = (x: number, y: number, w: number, h: number, on: boolean, lines: string[]) => (
    <g>
      <rect x={x} y={y} width={w} height={h} className={`dec-box${on ? ' on' : ''}`} />
      {lines.map((l, i) => <text key={i} x={x + w / 2} y={y + h / 2 + (i - (lines.length - 1) / 2) * 16} textAnchor="middle" dominantBaseline="central" className={`dec-text${on ? ' on' : ''}`}>{l}</text>)}
    </g>
  );
  const edge = (pts: [number, number][], on: boolean, label: string, lx: number, ly: number) => {
    const [p, q] = [pts[pts.length - 2], pts[pts.length - 1]];
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / L, uy = (q[1] - p[1]) / L;
    return (
      <g>
        <polyline points={pts.map((v) => v.join(',')).join(' ')} className={`dec-edge${on ? ' on' : ''}`} />
        <polygon points={`${q[0]},${q[1]} ${q[0] - ux * 9 - uy * 4},${q[1] - uy * 9 + ux * 4} ${q[0] - ux * 9 + uy * 4},${q[1] - uy * 9 - ux * 4}`} className={`dec-edge-head${on ? ' on' : ''}`} />
        <text x={lx} y={ly} className={`dec-text muted${on ? ' on' : ''}`} textAnchor="middle">{label}</text>
      </g>
    );
  };
  return (
    <figure className="vdemo">
      <div className="vdemo-fig wide">
        <svg className="dec-svg" viewBox="0 0 560 190" role="img" aria-label={tr('Entscheidungsbaum: ionisch oder kovalent', 'Decision tree: ionic or covalent')}>
          {box(10, 70, 120, 46, true, [de ? 'ΔEN ≥ 2 ?' : 'ΔEN ≥ 2 ?'])}
          {box(200, 112, 170, 60, big, de ? ['Metall mit hoher', 'Oxidationszahl?'] : ['metal with a high', 'oxidation number?'])}
          {box(200, 14, 120, 40, result === 'cov1', [de ? 'kovalent' : 'covalent'])}
          {box(440, 92, 110, 40, result === 'ionic', [de ? 'ionisch' : 'ionic'])}
          {box(440, 146, 110, 40, result === 'cov2', [de ? 'kovalent' : 'covalent'])}
          {edge([[130, 82], [170, 82], [170, 34], [200, 34]], !big, de ? 'nein' : 'no', 152, 52)}
          {edge([[130, 104], [170, 104], [170, 142], [200, 142]], big, de ? 'ja' : 'yes', 152, 132)}
          {edge([[370, 132], [405, 132], [405, 112], [440, 112]], result === 'ionic', de ? 'nein' : 'no', 420, 104)}
          {edge([[370, 152], [405, 152], [405, 166], [440, 166]], result === 'cov2', de ? 'ja' : 'yes', 420, 182)}
        </svg>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Stoff', 'Substance')} value={id} onPick={setId} items={DEC.map((x) => ({ id: x.id, label: <C>{x.id}</C> }))} />
        <div className="v-result"><M>{t`\Delta EN(\mathrm{${c.a}}, \mathrm{${c.b}}) = |${num(en(c.b), 1, lang)} - ${num(en(c.a), 1, lang)}| = ${num(d, 1, lang)}`}</M></div>
        {c.metal && <div className="v-result"><T de="Oxidationszahl des Metalls" en="oxidation number of the metal" />: <M>{`+${c.ox}`}</M></div>}
        <p className="vdemo-note">
          {id === 'MnO' && <T de={<>MnO ist ein ionischer Feststoff (Schmelzpunkt 1842 °C).</>} en={<>MnO is an ionic solid (melting point 1842 °C).</>} />}
          {id === 'Mn2O7' && <T de={<>Gleiche Atome, gleiches <M p=",">{t`\Delta EN`}</M> aber Mangan steht auf +7: Die Bindungen sind kovalent, <C>Mn2O7</C> ist bei 25 °C eine Flüssigkeit.</>} en={<>Same atoms, same <M p=",">{t`\Delta EN`}</M> but manganese is at +7: the bonds are covalent, <C>Mn2O7</C> is a liquid at 25 °C.</>} />}
          {(id === 'Cl2' || id === 'HCl') && <T de="Zwei Nichtmetalle: kovalent." en="Two non-metals: covalent." />}
          {id === 'NaCl' && <T de="Alkalimetall und Halogen: klar ionisch." en="Alkali metal and halogen: clearly ionic." />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ the five rules: HCN (slide 17) */

export function HcnFig({ step, t: tt }: { step: number; t: number }) {
  const lang = useLang(), tr = useTr();
  return <SceneFig scene={hcnScene(step, tt, lang)} label={tr('Lewis-Struktur von HCN nach den fünf Regeln', 'Lewis structure of HCN by the five rules')} />;
}

/* ================================================================ formal charge vs oxidation number (slides 18–20, 23; exercise 7) */

const FC_GROUPS: { id: string; tex: string; items: { id: StructId; label: string }[] }[] = [
  { id: 'cn', tex: 'CN^-', items: [{ id: 'CN', label: '' }] },
  { id: 'co2', tex: 'CO2', items: [{ id: 'CO2', label: '1' }, { id: 'CO2b', label: '2' }] },
  { id: 'ncs', tex: 'NCS^-', items: [{ id: 'NCSa', label: '1' }, { id: 'NCSb', label: '2' }, { id: 'NCSc', label: '3' }] },
  { id: 'hcl', tex: 'HCl', items: [{ id: 'HCl', label: '' }] },
  { id: 'xeo3', tex: 'XeO3', items: [{ id: 'XeO3K', label: 'K' }, { id: 'XeO3L', label: 'L' }, { id: 'XeO3M', label: 'M' }, { id: 'XeO3N', label: 'N' }] },
  { id: 'bf3', tex: 'BF3', items: [{ id: 'BF3', label: '1' }, { id: 'BF3d', label: '2' }] },
  { id: 'no', tex: 'NO', items: [{ id: 'NO', label: '' }] },
  { id: 'pf5', tex: 'PF5', items: [{ id: 'PF5', label: '' }] },
];
export function FormalChargeExplorer({ initial = 'ncs', groups }: { initial?: string; groups?: string[] }) {
  const tr = useTr();
  const list = groups ? FC_GROUPS.filter((g) => groups.includes(g.id)) : FC_GROUPS;
  const [gid, setGid] = useState(initial);
  const g = list.find((x) => x.id === gid) ?? list[0];
  const [sid, setSid] = useState<StructId>(g.items[0].id);
  const [mode, setMode] = useState<'fc' | 'ox'>('fc');
  const [octet, setOctet] = useState(false);
  const cur = g.items.some((i) => i.id === sid) ? sid : g.items[0].id;
  const s = STRUCTS[cur] as LStruct;
  const val = (i: number) => (mode === 'fc' ? formalCharge(s, i) : oxidationNumber(s, i));
  const asg = (i: number) => (mode === 'fc' ? assignedFC(s, i) : assignedOx(s, i));
  // dominant structure of the group (slide 18): smallest |FC|, negative charges on the more electronegative atoms
  const best = g.items.length > 1 ? (() => {
    const score = (id: StructId) => { const x = STRUCTS[id] as LStruct; return fcSize(x) * 100 - x.atoms.reduce((n, a, i) => n + (formalCharge(x, i) < 0 ? en(a.el) : 0), 0); };
    const scores = g.items.map((i) => score(i.id));
    const m = Math.min(...scores);
    return g.items.filter((_, k) => Math.abs(scores[k] - m) < 1e-9).map((i) => i.id);
  })() : null;
  const equal = best && best.length > 1;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <SceneFig scene={lewisScene(s, { book: mode, numbers: mode, octet, w: 380, h: s.atoms.length > 4 ? 240 : 200 })} label={tr('Lewis-Struktur mit zugeordneten Elektronen', 'Lewis structure with the electrons assigned')} />
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Teilchen', 'Species')} value={g.id} onPick={(k) => { setGid(k); const ng = list.find((x) => x.id === k)!; setSid(ng.items[0].id); }} items={list.map((x) => ({ id: x.id, label: <C>{x.tex}</C> }))} />
        {g.items.length > 1 && <ThChips label={tr('Struktur', 'Structure')} value={cur} onPick={(k) => setSid(k as StructId)} items={g.items.map((i) => ({ id: i.id, label: <>{tr('Struktur', 'structure')} <M>{t`\mathsf{${i.label}}`}</M>{best?.includes(i.id) && !equal ? ' ✓' : ''}</> }))} />}
        <ThChips label={tr('Buchhaltung', 'Bookkeeping')} value={mode} onPick={(k) => setMode(k as 'fc' | 'ox')} items={[
          { id: 'fc', label: <T de="Formalladung" en="Formal charge" /> }, { id: 'ox', label: <T de="Oxidationszahl" en="Oxidation number" /> },
        ]} />
        <label className="toggle"><input type="checkbox" checked={octet} onChange={(e) => setOctet(e.target.checked)} /> <T de="Elektronen um jedes Atom zählen" en="Count the electrons around each atom" /></label>
        <table className="bd-table">
          <thead><tr><th>{tr('Atom', 'Atom')}</th><th><T de="Valenz-e⁻" en="valence e⁻" /></th><th><T de="zugeordnet" en="assigned" /></th><th>{mode === 'fc' ? tr('Formalladung', 'formal charge') : tr('Oxidationszahl', 'oxidation no.')}</th></tr></thead>
          <tbody>{s.atoms.map((a, i) => (
            <tr key={i}><td><M>{sym(a.el)}</M></td><td><M>{String(VALENCE[a.el])}</M></td><td><M>{String(asg(i))}</M></td><td><M>{signed(val(i))}</M></td></tr>
          ))}</tbody>
        </table>
        <p className="vdemo-note">
          {mode === 'fc'
            ? <T de={<>Formalladung: Jedes geteilte Paar wird <b>halbiert</b>, freie Elektronen gehören ganz dem Atom. Die Farbe jedes Punkts zeigt, wem er zugeordnet wird.</>} en={<>Formal charge: every shared pair is <b>split in half</b>, non-bonding electrons belong fully to the atom. The colour of each dot shows whom it is assigned to.</>} />
            : <T de={<>Oxidationszahl: Jedes geteilte Paar geht <b>ganz</b> an das elektronegativere Atom, als wäre die Bindung ionisch.</>} en={<>Oxidation number: every shared pair goes <b>entirely</b> to the more electronegative atom, as if the bond were ionic.</>} />}
        </p>
        {best && <p className="bd-verdict">{equal
          ? <T de="Die Strukturen sind gleichwertig (gleiche Formalladungen an gleichwertigen Atomen): Resonanz." en="The structures are equivalent (same formal charges on equivalent atoms): resonance." />
          : <T de={<>Dominant: Struktur <M>{t`\mathsf{${g.items.find((i) => i.id === best[0])!.label}}`}</M> (Formalladungen am nächsten bei null{g.id === 'ncs' ? '; die negative Ladung sitzt auf dem elektronegativeren N' : ''}).</>} en={<>Dominant: structure <M>{t`\mathsf{${g.items.find((i) => i.id === best[0])!.label}}`}</M> (formal charges closest to zero{g.id === 'ncs' ? '; the negative charge sits on the more electronegative N' : ''}).</>} />}</p>}
        {octet && <p className="vdemo-note">{s.atoms.map((a, i) => { const n = electronsAround(s, i), w = a.el === 'H' ? 2 : 8; return <span key={i} className={n === w ? 'bd-ok' : 'bd-off'}><M>{t`\mathrm{${a.el}}{:}\ ${n}`}</M>{i < s.atoms.length - 1 ? ' · ' : ''}</span>; })}</p>}
      </figcaption>
    </figure>
  );
}

/* ================================================================ resonance (slides 21–22) */

function benzeneScene(view: 'a' | 'b' | 'blend') {
  const b = cbuilder(360, 260);
  const cx = 180, cy = 130, R = 62, RH = 102;
  const P = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return [cx + R * Math.cos(a), cy + R * Math.sin(a)] as const; });
  const H = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 2; return [cx + RH * Math.cos(a), cy + RH * Math.sin(a)] as const; });
  for (let i = 0; i < 6; i++) {
    const p = P[i], q = P[(i + 1) % 6];
    b.line(`r${i}`, 'bd-bond', [p[0], p[1]], [q[0], q[1]]);
    const dbl = view === 'a' ? i % 2 === 0 : view === 'b' ? i % 2 === 1 : false;
    if (dbl) {
      const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2, ix = (cx - mx) * 0.16, iy = (cy - my) * 0.16;
      b.line(`d${i}`, 'bd-bond', [p[0] + ix + (q[0] - p[0]) * 0.14, p[1] + iy + (q[1] - p[1]) * 0.14], [q[0] + ix - (q[0] - p[0]) * 0.14, q[1] + iy - (q[1] - p[1]) * 0.14]);
    }
    b.line(`h${i}`, 'bd-bond', [p[0] + (H[i][0] - p[0]) * 0.22, p[1] + (H[i][1] - p[1]) * 0.22], [H[i][0] - (H[i][0] - p[0]) * 0.28, H[i][1] - (H[i][1] - p[1]) * 0.28]);
    b.label(`H${i}`, [H[i][0], H[i][1]], t`\mathrm{H}`, 'fg', 1, 'c', { small: true });
  }
  if (view === 'blend') b.circle('ring', 'rs-ring', [cx, cy], R * 0.62);
  return b.finish({});
}
function ozoneBlendScene() {
  const s = STRUCTS.O3a as LStruct;
  const base = lewisScene({ ...s, atoms: s.atoms.map((a) => ({ ...a, lp: 0, at: [] })), bonds: s.bonds.map((x) => ({ ...x, order: 1 as const })) }, { w: 360, h: 200, unit: 92 });
  // add the half bond (dashed) next to both single bonds
  const b = cbuilder(360, 200);
  base.shapes.forEach((sh) => b.shape(sh.key, sh.kind, sh.cls, sh.pts, sh.o));
  base.shapes.filter((sh) => sh.cls === 'bd-bond').forEach((sh, k) => {
    const [p, q] = sh.pts, L = Math.hypot(q[0] - p[0], q[1] - p[1]), nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L;
    const side = k === 0 ? -1 : 1;
    b.line(`half${k}`, 'rs-partial', [p[0] + nx * 6 * side, p[1] + ny * 6 * side], [q[0] + nx * 6 * side, q[1] + ny * 6 * side]);
    b.label(`len${k}`, [(p[0] + q[0]) / 2 + nx * 26 * side, (p[1] + q[1]) / 2 + ny * 26 * side], t`127{,}8\ \mathrm{pm}`, 'muted', 1, 'c', { small: true });
  });
  base.labels.forEach((l) => b.label(l.key, l.at, l.tex, l.ink, l.o, l.anchor, { small: l.small }));
  b.label('ang', [180, 140], t`117^\circ`, 'n', 1, 'c', { small: true });
  return b.finish({});
}
export function ResonanceFigure() {
  const tr = useTr(), lang = useLang();
  const [mol, setMol] = useState<'O3' | 'C6H6'>('O3');
  const [view, setView] = useState<'a' | 'b' | 'blend'>('a');
  const scene = mol === 'O3'
    ? (view === 'blend' ? ozoneBlendScene() : lewisScene((view === 'a' ? STRUCTS.O3a : STRUCTS.O3b) as LStruct, { w: 360, h: 200, unit: 92, numbers: 'fc' }))
    : benzeneScene(view);
  const lenTex = (x: number) => (lang === 'de' ? String(x).replace('.', '{,}') : String(x));
  return (
    <figure className="vdemo">
      <div className="vdemo-fig"><SceneFig scene={scene} label={tr('Resonanzstrukturen und ihre Mischung', 'Resonance structures and their blend')} /></div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Molekül', 'Molecule')} value={mol} onPick={(k) => setMol(k as 'O3' | 'C6H6')} items={[{ id: 'O3', label: <C>O3</C> }, { id: 'C6H6', label: <C>C6H6</C> }]} />
        <ThChips label={tr('Ansicht', 'View')} value={view} onPick={(k) => setView(k as 'a' | 'b' | 'blend')} items={[
          { id: 'a', label: <T de="Struktur 1" en="Structure 1" /> }, { id: 'b', label: <T de="Struktur 2" en="Structure 2" /> }, { id: 'blend', label: <T de="Wirklichkeit" en="Reality" /> },
        ]} />
        <p className="vdemo-note">{mol === 'O3'
          ? (view === 'blend'
            ? <T de={<>Gemessen: beide O–O-Bindungen sind gleich lang (<M p=")">{t`${lenTex(127.8)}\ \mathrm{pm}`}</M> zwischen Einfach- (<M p=")">{t`148\ \mathrm{pm}`}</M> und Doppelbindung (<M p=")">{t`121\ \mathrm{pm}`}</M> Gestrichelt: eine «halbe» Bindung auf jeder Seite.</>} en={<>Measured: both O–O bonds have the same length (<M p=")">{t`127.8\ \mathrm{pm}`}</M> between the single (<M p=")">{t`148\ \mathrm{pm}`}</M> and the double bond (<M p=")">{t`121\ \mathrm{pm}`}</M> Dashed: a “half” bond on each side.</>} />
            : <T de={<>Beide Strukturen erfüllen die Oktettregel und haben dieselben Formalladungen, nur gespiegelt. Keine ist «die richtige».</>} en={<>Both structures satisfy the octet rule and have the same formal charges, just mirrored. Neither is “the right one”.</>} />)
          : (view === 'blend'
            ? <T de={<>Die Elektronen der Doppelbindungen sind über den ganzen Ring verteilt (Kreis). Alle sechs C–C-Bindungen sind gleich lang.</>} en={<>The electrons of the double bonds are spread over the whole ring (circle). All six C–C bonds have the same length.</>} />
            : <T de={<>Abwechselnd Einfach- und Doppelbindungen; die zweite Struktur ist die erste, um 60° gedreht.</>} en={<>Alternating single and double bonds; the second structure is the first one turned by 60°.</>} />)}</p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ bond enthalpies (slide 24) */

export function BondEnthalpyFigure() {
  const tr = useTr(), lang = useLang();
  const [id, setId] = useState('ch4');
  const r = BOND_RXNS.find((x) => x.id === id)!;
  const route = useMemo(() => bondRoute(r), [r]);
  const up = sumBonds(r.broken), down = sumBonds(r.formed);
  const terms = (list: [string, number][]) => list.map(([k, n]) => `${n}\\cdot ${BOND_H[k]}`).join(' + ');
  const bondTex = (k: string) => k.replace('-', '\\text{–}').replace('=', '{=}').replace('#', '{\\equiv}').replace(/([A-Z][a-z]?)/g, '\\mathrm{$1}');
  const steps: AnimStep[] = [
    { ms: 600, holdMs: 2200, caption: <T de={<>Start: die Ausgangsstoffe, alle gasförmig.</>} en={<>Start: the reactants, all gaseous.</>} /> },
    { ms: 1500, holdMs: 3000, caption: <T de={<>Alle Bindungen der Ausgangsstoffe brechen. Das kostet Energie: <M p=".">{t`${terms(r.broken)} = ${up}\ \mathrm{kJ}`}</M></>} en={<>All bonds of the reactants break. That costs energy: <M p=".">{t`${terms(r.broken)} = ${up}\ \mathrm{kJ}`}</M></>} /> },
    { ms: 1500, holdMs: 3000, caption: <T de={<>Die freien Atome bilden die Bindungen der Produkte. Das setzt Energie frei: <M p=".">{t`${terms(r.formed)} = ${down}\ \mathrm{kJ}`}</M></>} en={<>The free atoms form the bonds of the products. That releases energy: <M p=".">{t`${terms(r.formed)} = ${down}\ \mathrm{kJ}`}</M></>} /> },
    { ms: 1500, holdMs: 3400, caption: <T de={<>Netto: <M p=".">{t`\Delta H_\mathrm{rxn} \approx ${up} - ${down} = ${kj(up - down, lang)}\ \mathrm{kJ}`}</M> Eine Schätzung, weil die Tabelle Mittelwerte enthält.</>} en={<>Net: <M p=".">{t`\Delta H_\mathrm{rxn} \approx ${up} - ${down} = ${kj(up - down, lang)}\ \mathrm{kJ}`}</M> An estimate, because the table holds averages.</>} /> },
  ];
  return (
    <>
      <ThChips label={tr('Reaktion wählen', 'Choose a reaction')} value={id} onPick={setId} items={BOND_RXNS.map((x) => ({ id: x.id, label: <C>{x.eq.replace(/\(g\)/g, '')}</C> }))} />
      <StepPlayer key={id + lang} steps={steps} label={tr('Bindungen brechen und bilden: Enthalpiediagramm', 'Breaking and forming bonds: enthalpy diagram')}>
        {(step, tt) => <SceneFig scene={hessScene(route, step, tt, lang)} label={tr('Enthalpiediagramm über die freien Atome', 'Enthalpy diagram via the free atoms')} />}
      </StepPlayer>
      <div className="th-tablewrap">
        <table className="bd-table" aria-label={tr('Gebrochene und gebildete Bindungen', 'Bonds broken and formed')}>
          <thead><tr><th>{tr('Bindung', 'Bond')}</th><th><M>n</M></th><th><M>{t`\mathrm{kJ/mol}`}</M></th><th></th></tr></thead>
          <tbody>
            {r.broken.map(([k, n]) => <tr key={`b${k}`}><td><M>{bondTex(k)}</M></td><td><M>{String(n)}</M></td><td><M>{String(BOND_H[k])}</M></td><td><T de="gebrochen" en="broken" /></td></tr>)}
            {r.formed.map(([k, n]) => <tr key={`f${k}`}><td><M>{bondTex(k)}</M></td><td><M>{String(n)}</M></td><td><M>{String(BOND_H[k])}</M></td><td><T de="gebildet" en="formed" /></td></tr>)}
            <tr className="sum"><td colSpan={3}><M>{t`\Delta H_\mathrm{rxn} \approx ${up} - ${down}`}</M></td><td><M>{t`${kj(up - down, lang)}\ \mathrm{kJ}`}</M></td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ================================================================ more shared pairs: shorter and stronger (slides 10, 24–25) */

const FAMILIES = [['C', 'C'], ['C', 'N'], ['C', 'O'], ['N', 'N']] as const;
export function BondLengthFigure() {
  const tr = useTr(), lang = useLang();
  const [fam, setFam] = useState<string>('C-C');
  const [a, b] = fam.split('-');
  const orders = ['-', '=', '#'] as const;
  const keys = orders.map((o) => `${a}${o}${b}`);
  const k = 1.15; // px per pm
  const rows = keys.map((key, i) => ({ key, L: BOND_L[key], H: BOND_H[key], order: i + 1 }));
  const maxH = 1100;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg className="pol-svg" viewBox="0 0 420 230" role="img" aria-label={tr('Einfach-, Doppel- und Dreifachbindung: Länge massstäblich, Bindungsenthalpie als Balken', 'Single, double and triple bond: length to scale, bond enthalpy as a bar')}>
          {rows.map((r, i) => {
            const y = 40 + i * 72, x0 = 40, x1 = x0 + r.L * k;
            const offs = r.order === 1 ? [0] : r.order === 2 ? [-4, 4] : [-6, 0, 6];
            return (
              <g key={r.key}>
                {offs.map((o, j) => <line key={j} x1={x0 + 14} y1={y + o} x2={x1 - 14} y2={y + o} className="bd-bond" />)}
                <circle cx={x0} cy={y} r={14} className="bl-atom" /><circle cx={x1} cy={y} r={14} className="bl-atom" />
                <text x={x0} y={y} textAnchor="middle" dominantBaseline="central" className="bl-text">{a}</text>
                <text x={x1} y={y} textAnchor="middle" dominantBaseline="central" className="bl-text">{b}</text>
                <text x={(x0 + x1) / 2} y={y + 28} textAnchor="middle" className="bl-text muted">{r.L} pm</text>
                <rect x={250} y={y - 9} width={(r.H / maxH) * 130} height={18} className="bl-bar-h" />
                <text x={254 + (r.H / maxH) * 130} y={y} dominantBaseline="central" className="bl-text">{r.H}</text>
              </g>
            );
          })}
          <text x={250} y={14} className="bl-text muted">{lang === 'de' ? 'Enthalpie, kJ/mol' : 'enthalpy, kJ/mol'}</text>
          <text x={40} y={14} className="bl-text muted">{lang === 'de' ? 'Länge, massstäblich' : 'length, to scale'}</text>
        </svg>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Atompaar', 'Pair of atoms')} value={fam} onPick={setFam} items={FAMILIES.map(([x, y]) => ({ id: `${x}-${y}`, label: <M>{t`\mathrm{${x}}\text{–}\mathrm{${y}}`}</M> }))} />
        <p className="vdemo-note"><T
          de={<>Mehr geteilte Paare ziehen die Kerne näher zusammen und halten sie fester: kürzer und stärker. Das gilt für dasselbe Atompaar; zwei verschiedene Paare vergleicht man so nicht.</>}
          en={<>More shared pairs pull the nuclei closer together and hold them more firmly: shorter and stronger. This holds for the same pair of atoms; two different pairs cannot be compared this way.</>} /></p>
      </figcaption>
    </figure>
  );
}

/** Small helper for lessons: a static Lewis structure. */
export function LewisFigure({ id, numbers, caption }: { id: StructId; numbers?: 'fc' | 'ox'; caption?: ReactNode }) {
  const tr = useTr();
  const s = STRUCTS[id] as LStruct;
  return (
    <figure className="vdemo">
      <div className="vdemo-fig"><SceneFig scene={lewisScene(s, { numbers: numbers ?? 'none', w: 360, h: 180 })} label={tr('Lewis-Struktur', 'Lewis structure')} /></div>
      {caption && <figcaption className="vdemo-readout"><p className="vdemo-note">{caption}</p></figcaption>}
    </figure>
  );
}

/* ================================================================ oxidation number vs formal charge vs partial charge (slide 20) */

export function ChargeCompare() {
  const tr = useTr(), lang = useLang();
  const [which, setWhich] = useState<'HCl' | 'HF'>('HCl');
  const d = which === 'HCl' ? 0.18 : Math.round((HX.HF.mu / dipoleD(1, HX.HF.r)) * 100) / 100;
  const x = (v: number) => 60 + v * 300;
  const marks = [
    { v: 0, tex: tr('Formalladung', 'formal charge'), cls: 'muted', dy: 30 },
    { v: d, tex: tr('Partialladung', 'partial charge'), cls: 'fg', dy: -16 },
    { v: 1, tex: tr('Oxidationszahl', 'oxidation number'), cls: 'muted', dy: 30 },
  ];
  return (
    <figure className="vdemo">
      <div className="vdemo-fig">
        <svg className="pol-svg" viewBox="0 0 420 130" role="img" aria-label={tr('Ladung auf H: Formalladung 0, Partialladung, Oxidationszahl +1', 'Charge on H: formal charge 0, partial charge, oxidation number +1')}>
          <line x1={x(0)} y1={60} x2={x(1)} y2={60} stroke="var(--muted)" strokeWidth={1.5} />
          <rect x={x(0)} y={56} width={x(d) - x(0)} height={8} fill="color-mix(in srgb, var(--ch-t) 55%, var(--panel))" />
          {[0, 0.25, 0.5, 0.75, 1].map((v) => <line key={v} x1={x(v)} y1={54} x2={x(v)} y2={66} stroke="var(--muted)" strokeWidth={1} />)}
          {marks.map((m) => <circle key={m.v} cx={x(m.v)} cy={60} r={m.v === d ? 6 : 5} className={m.v === d ? 'bd-e-move' : 'bd-e'} />)}
          {marks.map((m) => <text key={`t${m.v}`} x={x(m.v)} y={60 + m.dy} textAnchor={m.v === 0 ? 'start' : m.v === 1 ? 'end' : 'middle'} className={`dec-text${m.cls === 'muted' ? ' muted' : ' on'}`}>{m.tex}</text>)}
        </svg>
        {[0, 1].map((v) => <div key={v} className="anim-label small" style={{ left: `${(x(v) / 420) * 100}%`, top: `${(110 / 130) * 100}%` }}><M>{v === 0 ? '0' : '+1'}</M></div>)}
        <div className="anim-label small ink-c-t" style={{ left: `${(x(d) / 420) * 100}%`, top: `${(20 / 130) * 100}%` }}><M>{t`\delta^+ = ${num(d, 2, lang)}`}</M></div>
      </div>
      <figcaption className="vdemo-readout">
        <ThChips label={tr('Molekül', 'Molecule')} value={which} onPick={(k) => setWhich(k as 'HCl' | 'HF')} items={[{ id: 'HCl', label: <C>HCl</C> }, { id: 'HF', label: <C>HF</C> }]} />
        <p className="vdemo-note"><T
          de={<>Die Ladung auf dem H-Atom auf einer Skala von 0 bis +1 Elementarladung. Die Formalladung (alles gerecht geteilt) gibt 0, die Oxidationszahl (alles an das elektronegativere Atom) gibt +1. Die wirkliche Ladung liegt dazwischen{which === 'HCl' ? ' (Folie 20: 0,18)' : ' (aus dem Dipolmoment 1,8 D)'}; das {which === 'HCl' ? 'Cl' : 'F'}-Atom trägt dieselbe Ladung mit Minus.</>}
          en={<>The charge on the H atom on a scale from 0 to +1 elementary charge. The formal charge (everything shared fairly) gives 0, the oxidation number (everything to the more electronegative atom) gives +1. The real charge lies in between{which === 'HCl' ? ' (slide 20: 0.18)' : ' (from the dipole moment 1.8 D)'}; the {which === 'HCl' ? 'chlorine' : 'fluorine'} atom carries the same charge with a minus.</>} /></p>
      </figcaption>
    </figure>
  );
}
