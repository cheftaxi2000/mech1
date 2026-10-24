import { useMemo, useState } from 'react';
import { C } from '../../components/Chem';
import { M } from '../../components/Tex';
import { fmtNum, T, useLang, useTr } from '../../i18n';
import { NOBLE_GASES, configTex, nobleCore, valenceElectrons } from '../../chem/config';
import { ELEMENTS, byZ, bySymbol } from '../../chem/elements';
import { radial } from '../../chem/orbital';
import { subshellLetter } from '../../chem/quantum';
import { ATOMIC_RADIUS, FIRST_IE, ISOELECTRONIC, SHELL_SIZES, SUCCESSIVE_IE, meanRadius, probabilityInside, zeffEstimate } from '../../chem/trends';
import { Band, Curve, PLabel, Path, Plot, Pt, VLine } from '../plot/Plot';
import { FArrow, FLabel, LabelFig } from './LabelFig';
import { PeriodicGrid, type CellStyle } from './PeriodicGrid';
import './trends.css';

const t = String.raw;
const L_ROLE = ['cp', 'ct', 'ce', 'cv'] as const;

/* ================================================================ penetration: where are s, p, d electrons? (slide 28, hydrogen-like) */
export function Penetration() {
  const tr = useTr(), lang = useLang();
  const [n, setN] = useState(3);
  const [rc, setRc] = useState(1);
  const xmax = n === 2 ? 20 : n === 3 ? 36 : 56;
  const curves = useMemo(() => Array.from({ length: n }, (_, l) => ({ l, f: (r: number) => r * r * radial(n, l, r) ** 2 })), [n]);
  const peaks = curves.map((c) => { let best = 0, at = 0; for (let r = 0.05; r < xmax; r += 0.05) { const v = c.f(r); if (v > best) { best = v; at = r; } } return { best, at }; });
  const ymax = Math.max(...peaks.map((p) => p.best)) * 1.15;
  const num = (x: number, d: number) => fmtNum(x, d, lang, true);
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig wide">
        <Plot x={[0, xmax]} y={[0, ymax]} w={460} h={300} grid={[xmax > 40 ? 10 : 5, 0]} tick={[xmax > 40 ? 10 : 5, 0]} axes={[t`r`, t`r^2R^2`]}
          label={tr('Radiale Verteilung der Aufenthaltswahrscheinlichkeit für s-, p-, d-Elektronen derselben Schale', 'Radial distribution of the probability for s, p, d electrons of the same shell')}>
          <Band vertical from={0} to={rc} role="cn" />
          {curves.map((c) => <Curve key={c.l} f={c.f} dom={[0, xmax]} role={L_ROLE[c.l]} n={500} />)}
          {curves.map((c, i) => <PLabel key={`l${c.l}`} x={peaks[i].at} y={peaks[i].best} dx={[16, -14, -12, 0][c.l]} dy={-12} role={L_ROLE[c.l]} tex={`${n}\\mathrm{${subshellLetter(c.l)}}`} small />)}
          <VLine x={rc} role="cn" dashed />
          <PLabel x={rc / 2} y={ymax * 0.55} role="cn" small tex={t`\text{${lang === 'de' ? 'Rumpf' : 'core'}}`} />
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips" role="group" aria-label={tr('Schale', 'Shell')}>
          {[2, 3, 4].map((k) => <button key={k} type="button" aria-pressed={n === k} onClick={() => setN(k)}><M>{`n = ${k}`}</M></button>)}
        </div>
        <label className="slider wide-slider">
          <span><M>{t`r_c`}</M></span>
          <input type="range" min={0.5} max={4} step={0.5} value={rc} onChange={(e) => setRc(Number(e.target.value))} aria-label="r_c" />
          <span className="val"><M>{t`${num(rc, 1)}\,a_0`}</M></span>
        </label>
        <table className="tr-table">
          <thead><tr><th /><th><T de={<>Chance, im Rumpf zu sein (<M>{t`r < r_c`}</M>)</>} en={<>chance to be in the core (<M>{t`r < r_c`}</M>)</>} /></th><th><M>{t`\langle r\rangle`}</M></th></tr></thead>
          <tbody>
            {curves.map((c) => (
              <tr key={c.l}>
                <th><M>{`${n}\\mathrm{${subshellLetter(c.l)}}`}</M></th>
                <td><M>{t`${num(100 * probabilityInside(n, c.l, rc), 1)}\ \%`}</M></td>
                <td><M>{t`${num(meanRadius(n, c.l), 1)}\,a_0`}</M></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="vdemo-note">
          <T de={<>Für einen kleinen Rumpf (bis etwa <M>{t`1{,}5\,a_0`}</M>) hat der s-Teil am meisten Wahrscheinlichkeit nahe am Kern, der d-Teil fast keine. Wer im Rumpfgebiet ist, spürt die volle Kernladung. Wird der Rumpf grösser, überholt p das s: s hat bei etwa <M>{t`2\,a_0`}</M> einen Knoten (Nullstelle). Der Mittelwert <M>{t`\langle r\rangle`}</M> selbst wird von s nach d sogar etwas kleiner (CH-601).</>}
            en={<>For a small core (up to about <M>{t`1.5\,a_0`}</M>) the s curve has the most probability close to the nucleus, the d curve almost none. Whoever is in the core region feels the full nuclear charge. If the core gets larger, p overtakes s: s has a node (zero) at about <M>{t`2\,a_0`}</M>. The mean <M>{t`\langle r\rangle`}</M> itself even gets slightly smaller from s to d (CH-601).</>} />
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ nucleus, core electrons, valence electrons (slide 28) */
const SPEC = [1, 3, 11, 17, 19, 35];
export function ScreeningFigure() {
  const tr = useTr(), lang = useLang();
  const [Z, setZ] = useState(17);
  const el = byZ(Z)!;
  const core = nobleCore(Z)?.Z ?? 0;
  const val = Z - core;
  const zeff = zeffEstimate(Z);
  const W = 460, H = 360, cx = 150, cy = 180;
  // shells of the core, drawn as rings of dots; the valence electrons sit on the outermost ring
  const coreShells: number[] = [];
  { let left = core; for (const s of SHELL_SIZES) { if (left <= 0) break; coreShells.push(Math.min(left, s)); left -= s; } }
  const rings = coreShells.length;
  const r0 = 40, dr = rings > 3 ? 21 : 26;
  const valenceR = r0 + rings * dr + 6;
  const dots = (count: number, R: number, phase: number) => Array.from({ length: count }, (_, i) => { const a = phase + (2 * Math.PI * i) / count; return [cx + R * Math.cos(a), cy - R * Math.sin(a)] as const; });
  const ve = Math.min(val, 18);
  const vdots = dots(ve, valenceR, 0.3);
  const target = vdots[0] ?? [cx + valenceR, cy];
  const full = Z, eff = zeff ?? Z;
  const chip = (z: number) => <button key={z} type="button" aria-pressed={Z === z} onClick={() => setZ(z)}><M>{t`\mathrm{${byZ(z)!.symbol}}`}</M></button>;
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig">
        <LabelFig w={W} h={H} label={tr('Atom mit Kern, Rumpfelektronen und Valenzelektronen', 'Atom with nucleus, core electrons and valence electrons')}>
          {coreShells.map((c, i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r0 + i * dr} fill="none" stroke="var(--line)" strokeWidth={1.2} />
              {dots(c, r0 + i * dr, 0.5 * i).map(([x, y], j) => <circle key={j} cx={x} cy={y} r={4} className="lf-fill-el" fillOpacity={0.5} />)}
            </g>
          ))}
          <circle cx={cx} cy={cy} r={valenceR} fill="none" stroke="var(--ch-el)" strokeWidth={1.4} strokeDasharray="4 4" />
          {vdots.map(([x, y], j) => <circle key={j} cx={x} cy={y} r={5.2} className="lf-fill-el" stroke="var(--fg)" strokeWidth={1.4} />)}
          <circle cx={cx} cy={cy} r={11} className="lf-fill-t" />
          <FLabel x={cx} y={cy} ink="fg" small halo={false} tex={t`+${Z}`} />
          <FArrow x1={cx + 14} y1={cy} x2={target[0] - 7} y2={target[1]} ink="t" width={1 + (5 * eff) / full} opacity={0.9} />
          <FLabel x={W - 12} y={46} anchor="r" ink="t" tex={t`Z = ${Z}`} />
          <FLabel x={W - 12} y={80} anchor="r" ink="t" tex={zeff === null ? t`Z_{\mathrm{eff}} < Z` : t`Z_{\mathrm{eff}} \approx ${zeff}`} />
          <FLabel x={W - 12} y={118} anchor="r" small ink="muted" tex={t`\text{${lang === 'de' ? 'Rumpf' : 'core'}}:\ ${core}\ e^-`} />
          <FLabel x={W - 12} y={144} anchor="r" small ink="el" tex={t`\text{${lang === 'de' ? 'Valenz' : 'valence'}}:\ ${val}\ e^-`} />
        </LabelFig>
      </div>
      <figcaption className="vdemo-readout">
        <label className="slider wide-slider">
          <span><M>Z</M></span>
          <input type="range" min={3} max={54} step={1} value={Z} onChange={(e) => setZ(Number(e.target.value))} aria-label="Z" />
          <span className="val"><M>{t`\mathrm{${el.symbol}}`}</M></span>
        </label>
        <div className="lf-chips">{SPEC.map(chip)}</div>
        <p className="vdemo-note">
          {zeff === null
            ? <T de="Bei den d-Metallen schirmen die d-Elektronen schlecht ab; eine einfache Zählung gibt es hier nicht. Die Aussage der Folie bleibt: Z_eff ist kleiner als Z." en="In the d metals the d electrons screen poorly; there is no simple count here. The statement of the slide remains: Z_eff is smaller than Z." />
            : <T de={<>Der Pfeil zeigt die Anziehung durch den Kern. Je dicker, desto stärker spürt sie das Valenzelektron. Mit <M>{t`Z = ${Z}`}</M> Protonen und <M>{t`${core}`}</M> Rumpfelektronen bleiben <M p=".">{t`Z_{\mathrm{eff}} \approx ${zeff}`}</M></>}
              en={<>The arrow shows the attraction by the nucleus. The thicker it is, the more strongly the valence electron feels it. With <M>{t`Z = ${Z}`}</M> protons and <M>{t`${core}`}</M> core electrons, <M p=".">{t`Z_{\mathrm{eff}} \approx ${zeff}`}</M> remains</>} />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ heat map of the periodic table */
type Mode = 'radius' | 'ie' | 'zeff';
const MODE_INK: Record<Mode, string> = { radius: '--ch-p', ie: '--ch-e', zeff: '--ch-t' };
export function TrendMap({ initial = 'radius' }: { initial?: Mode }) {
  const tr = useTr(), lang = useLang();
  const [mode, setMode] = useState<Mode>(initial);
  const [Z, setZ] = useState(11);
  const value = (sym: string, z: number): number | null => mode === 'radius' ? ATOMIC_RADIUS[sym] : mode === 'ie' ? FIRST_IE[sym] : zeffEstimate(z);
  const range: Record<Mode, [number, number]> = { radius: [28, 220], ie: [400, 2400], zeff: [1, 8] };
  const style = (e: { symbol: string; Z: number }): CellStyle => {
    const v = value(e.symbol, e.Z);
    if (v === null) return { bg: 'var(--fill-2)', opacity: 0.5 };
    const [lo, hi] = range[mode];
    const k = Math.max(0, Math.min(1, (v - lo) / (hi - lo)));
    return { bg: `color-mix(in srgb, var(${MODE_INK[mode]}) ${Math.round(8 + 82 * k)}%, var(--panel))`, sub: String(v), ink: k > 0.72 ? '#fff' : undefined };
  };
  const el = byZ(Z)!;
  const rr = ATOMIC_RADIUS[el.symbol], ie = FIRST_IE[el.symbol], ze = zeffEstimate(Z);
  const unit = mode === 'radius' ? t`\mathrm{pm}` : mode === 'ie' ? t`\mathrm{kJ\,mol^{-1}}` : '';
  const [lo, hi] = range[mode];
  const modes: [Mode, string, string][] = [['radius', 'Atomradius', 'Atomic radius'], ['ie', '1. Ionisierungsenergie', '1st ionisation energy'], ['zeff', 'Z_eff (Schätzung)', 'Z_eff (estimate)']];
  return (
    <figure className="vdemo tr-fig tr-map">
      <div className="vdemo-fig wide">
        <PeriodicGrid label={tr('Periodensystem als Heatmap', 'Periodic table as heat map')} picked={Z} onPick={setZ} style={(e) => style(e)} />
        <div className="tr-legend" aria-hidden="true">
          <span><M>{`${lo}`}</M></span>
          <i style={{ background: `linear-gradient(90deg, color-mix(in srgb, var(${MODE_INK[mode]}) 8%, var(--panel)), color-mix(in srgb, var(${MODE_INK[mode]}) 90%, var(--panel)))` }} />
          <span><M>{`${hi}${unit ? `\\ ${unit}` : ''}`}</M></span>
        </div>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips" role="group" aria-label={tr('Welche Grösse', 'Which quantity')}>
          {modes.map(([m, de, en]) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m === 'zeff' ? <M>{t`Z_{\mathrm{eff}}\ \approx`}</M> : tr(de, en)}</button>)}
        </div>
        <p className="ob-elname"><M>{t`\mathrm{${el.symbol}}`}</M>, {lang === 'de' ? el.de : el.en}, <M>{`Z = ${Z}`}</M></p>
        <M>{configTex(Z)}</M>
        <ul className="tr-facts">
          <li><T de="Atomradius" en="atomic radius" />: <M>{t`${rr}\ \mathrm{pm}`}</M></li>
          <li><T de="1. Ionisierungsenergie" en="1st ionisation energy" />: <M>{t`${fmtNum(ie, 0, lang, true)}\ \mathrm{kJ\,mol^{-1}}`}</M></li>
          <li><M>{t`Z_{\mathrm{eff}}`}</M>: {ze === null ? <T de="nicht angegeben (d-Block)" en="not given (d block)" /> : <M>{t`\approx ${ze}`}</M>}</li>
        </ul>
        <p className="vdemo-note">
          {mode === 'radius' && <T de={<>Die Radien stammen aus der Folie 30. Kräftige Farbe heisst grosser Radius: links und unten.</>} en={<>The radii are from slide 30. Strong colour means a large radius: left and bottom.</>} />}
          {mode === 'ie' && <T de={<>Die Werte stehen nicht auf den Folien (sie zeigen nur den Trend). Kräftige Farbe heisst hohe Energie: rechts und oben.</>} en={<>The values are not on the slides (they show only the trend). Strong colour means a high energy: right and top.</>} />}
          {mode === 'zeff' && <T de={<>Eine grobe Zählung, nicht von den Folien: die Zahl der Valenzelektronen. Sie wächst von links nach rechts und bleibt in einer Spalte gleich.</>} en={<>A rough count, not from the slides: the number of valence electrons. It grows from left to right and stays the same in a column.</>} />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ atom → ion, and the isoelectronic series (slides 30–31) */
export function IonSizes() {
  const tr = useTr();
  const [sym, setSym] = useState('Na');
  const [ion, setIon] = useState(true);
  const W = 600, H = 420;
  const pair = ISOELECTRONIC.find((i) => i.symbol === sym)!;
  const atomR = ATOMIC_RADIUS[sym], ionR = pair.radius;
  const k = 0.52, ks = 0.32;
  const cation = pair.charge > 0;
  const charge = (c: number) => (Math.abs(c) === 1 ? (c > 0 ? '+' : '-') : `${Math.abs(c)}${c > 0 ? '+' : '-'}`);
  const ionTex = (s: string, c: number) => `\\mathrm{${s}}^{${charge(c).replace('-', '−')}}`;
  const shown = ion ? ionR : atomR;
  const ink = cation ? 'cat' : 'an';
  const eCount = pair.Z - pair.charge;
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={W} h={H} label={tr('Atom und Ion im Grössenvergleich, darunter die isoelektronische Reihe', 'Atom and ion compared in size, below the isoelectronic series')} className="tr-ions">
          <circle cx={150} cy={105} r={atomR * k} className="lf-fill-muted" fillOpacity={0.16} stroke="var(--muted)" strokeWidth={2} />
          <circle cx={150} cy={105} r={3.5} className="lf-fill-t" />
          <circle cx={420} cy={105} r={4} className="lf-fill-t" />
          <circle cx={420} cy={105} className={`lf-fill-${ink} tr-grow`} fillOpacity={0.2} stroke={`var(--ch-${ink})`} strokeWidth={2.4} style={{ r: shown * k }} />
          <FArrow x1={255} y1={105} x2={330} y2={105} ink="fg" />
          <FLabel x={292} y={82} small tex={cation ? t`-e^-` : t`+e^-`} />
          <FLabel x={150} y={205} tex={`\\mathrm{${sym}}`} />
          <FLabel x={150} y={228} small ink="muted" tex={`${pair.Z}\\mathrm{p}^{+},\\ ${pair.Z}\\mathrm{e}^{-}`} />
          <FLabel x={150} y={250} small ink="muted" tex={t`${atomR}\ \mathrm{pm}`} />
          <FLabel x={420} y={205} ink={ink} tex={ionTex(sym, pair.charge)} />
          <FLabel x={420} y={228} small ink="muted" tex={`${pair.Z}\\mathrm{p}^{+},\\ ${eCount}\\mathrm{e}^{-}`} />
          <FLabel x={420} y={250} small ink="muted" tex={t`${ionR}\ \mathrm{pm}`} />
          {ISOELECTRONIC.map((i, j) => {
            const x = 70 + j * 115, c = i.charge > 0 ? 'cat' : 'an';
            return (
              <g key={i.symbol}>
                <circle cx={x} cy={343} r={i.radius * ks} className={`lf-fill-${c}`} fillOpacity={0.2} stroke={`var(--ch-${c})`} strokeWidth={i.symbol === sym ? 3.4 : 1.6} />
                <circle cx={x} cy={343} r={2.6} className="lf-fill-t" />
                <FLabel x={x} y={398} small ink={c} tex={`${ionTex(i.symbol, i.charge)}`} />
                <FLabel x={x} y={290} small ink="muted" tex={t`${i.radius}\ \mathrm{pm}`} halo={false} />
              </g>
            );
          })}
          <FLabel x={8} y={272} anchor="l" small ink="muted" tex={t`10\ \mathrm{e}^{-}`} />
        </LabelFig>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips" role="group" aria-label={tr('Element', 'Element')}>
          {ISOELECTRONIC.map((i) => <button key={i.symbol} type="button" aria-pressed={sym === i.symbol} onClick={() => setSym(i.symbol)}><C>{i.symbol}</C></button>)}
        </div>
        <div className="lf-chips">
          <button type="button" aria-pressed={!ion} onClick={() => setIon(false)}>{tr('Atom', 'atom')}</button>
          <button type="button" aria-pressed={ion} onClick={() => setIon(true)}>{tr('Ion', 'ion')}</button>
        </div>
        <p className="vdemo-note">
          {cation
            ? <T de="Das Atom gibt Elektronen ab: Die Protonen bleiben, aber weniger Elektronen teilen sich ihre Anziehung. Zusätzlich fällt die äusserste Schale weg. Das Kation ist kleiner." en="The atom gives away electrons: the protons stay, but fewer electrons share their attraction. In addition the outermost shell is gone. The cation is smaller." />
            : <T de="Das Atom nimmt Elektronen auf: Die Protonen bleiben, aber mehr Elektronen stossen sich gegenseitig ab. Das Anion ist grösser." en="The atom takes up electrons: the protons stay, but more electrons repel each other. The anion is larger." />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ first ionisation energy against Z (slide 32) */
const PERIODS: Record<string, [number, number]> = { all: [1, 54], p2: [3, 10], p3: [11, 18], p4: [19, 36] };
export function IonizationPlot() {
  const tr = useTr();
  const [view, setView] = useState<'all' | 'p2' | 'p3' | 'p4'>('p2');
  const [a, b] = PERIODS[view];
  const els = ELEMENTS.filter((e) => e.Z >= a && e.Z <= b);
  const pts = els.map((e) => [e.Z, FIRST_IE[e.symbol]] as [number, number]);
  const wide = view === 'all';
  const dips: number[] = view === 'p2' ? [5, 8] : view === 'p3' ? [13, 16] : view === 'p4' ? [31] : [];
  const noble = (z: number) => NOBLE_GASES.some(([g]) => g === z);
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig wide">
        <Plot x={[a - 0.7, b + 0.7]} y={[-260, 2500]} w={460} h={320} grid={[0, 500]} tick={[0, 500]} axes={[t`Z`, t`I_1`]}
          label={tr('Erste Ionisierungsenergie gegen die Ordnungszahl', 'First ionisation energy against atomic number')}>
          <Path pts={pts} role="ce" />
          {els.map((e) => <Pt key={e.Z} x={e.Z} y={FIRST_IE[e.symbol]} role={noble(e.Z) ? 'cp' : 'ce'} r={wide ? 3.2 : 5} />)}
          {!wide && els.map((e) => <PLabel key={`s${e.Z}`} x={e.Z} y={-120} role="fg" small tex={t`\mathrm{${e.symbol}}`} />)}
          {!wide && dips.map((z) => <Pt key={`d${z}`} x={z} y={FIRST_IE[byZ(z)!.symbol]} role="pt" r={9} open />)}
          {wide && NOBLE_GASES.filter(([z]) => z <= 54).map(([z, s]) => <PLabel key={s} x={z} y={FIRST_IE[s]} dy={-12} role="cp" small tex={t`\mathrm{${s}}`} />)}
          {wide && [3, 11, 19, 37].map((z) => <PLabel key={z} x={z} y={FIRST_IE[byZ(z)!.symbol]} dy={14} role="ce" small tex={t`\mathrm{${byZ(z)!.symbol}}`} />)}
        </Plot>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips" role="group" aria-label={tr('Ausschnitt', 'Range')}>
          <button type="button" aria-pressed={view === 'p2'} onClick={() => setView('p2')}>{tr('Periode 2', 'Period 2')}</button>
          <button type="button" aria-pressed={view === 'p3'} onClick={() => setView('p3')}>{tr('Periode 3', 'Period 3')}</button>
          <button type="button" aria-pressed={view === 'p4'} onClick={() => setView('p4')}>{tr('Periode 4', 'Period 4')}</button>
          <button type="button" aria-pressed={view === 'all'} onClick={() => setView('all')}>{tr('alle', 'all')}</button>
        </div>
        <p className="vdemo-note">
          {view === 'all'
            ? <T de="Wie eine Säge: Bei jedem Edelgas (blau) ist die Energie am höchsten, beim nächsten Alkalimetall fällt sie tief ab." en="Like a saw: at every noble gas (blue) the energy is highest, and at the next alkali metal it drops deeply." />
            : <T de={<>Im Grossen steigt die Energie von links nach rechts: Die Kernladung <M>{t`Z_{\mathrm{eff}}`}</M> wächst. Die roten Ringe sind die Einbrüche, die man bei Periode 2 und 3 gut sieht.</>} en={<>On the whole the energy rises from left to right: the effective charge <M>{t`Z_{\mathrm{eff}}`}</M> grows. The red rings are the dips, easy to see in periods 2 and 3.</>} />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ successive ionisation energies (supplement to slide 32: I₂ > I₁) */
export function IonizationSteps() {
  const tr = useTr(), lang = useLang();
  const [sym, setSym] = useState('Mg');
  const ie = SUCCESSIVE_IE[sym];
  const v = valenceElectrons(bySymbol(sym).Z);
  const W = 520, H = 300, zeroY = 250, unit = 190 / 12000;
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={W} h={H} label={tr('Nacheinander entfernte Elektronen: nach den Valenzelektronen springt die Energie', 'Electrons removed one after the other: after the valence electrons the energy jumps')} className="tr-steps">
          <line className="lf-zero" x1={20} x2={W - 10} y1={zeroY} y2={zeroY} />
          {ie.map((x, i) => {
            const cx = 70 + i * 120, h = x * unit, valence = i < v;
            return (
              <g key={i}>
                <rect x={cx - 34} y={zeroY - h} width={68} height={h} rx={4} className={valence ? 'lf-fill-e' : 'lf-fill-t'} fillOpacity={0.85} />
                <FLabel x={cx} y={zeroY - h - 6} anchor="b" small ink={valence ? 'e' : 't'} tex={fmtNum(x, 0, lang, true)} />
                <FLabel x={cx} y={zeroY + 20} tex={`I_{${i + 1}}`} />
              </g>
            );
          })}
          <FLabel x={10} y={12} anchor="l" small ink="muted" tex={t`\mathrm{kJ\,mol^{-1}}`} />
        </LabelFig>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips">{Object.keys(SUCCESSIVE_IE).map((s) => <button key={s} type="button" aria-pressed={sym === s} onClick={() => setSym(s)}><C>{s}</C></button>)}</div>
        <p className="vdemo-note">
          <T de={<>Die ersten <M>{`${v}`}</M> Elektronen sind die Valenzelektronen (gelb). Dann kommt ein Rumpfelektron aus einer inneren Schale (rot), und die Energie springt auf ein Vielfaches.</>}
            en={<>The first <M>{`${v}`}</M> electrons are the valence electrons (yellow). Then a core electron from an inner shell follows (red), and the energy jumps to a multiple.</>} />
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ electron affinity (slide 32) */
export function EaFigure() {
  const tr = useTr(), lang = useLang();
  const w = 600, h = 250;
  const w1 = (de: string, en: string) => t`\text{${lang === 'de' ? de : en}}`;
  const panels = [
    { x: 20, left: 80, right: 150, tex: t`\mathrm{Cl} + e^- \to \mathrm{Cl}^-`, ea: t`\mathrm{EA} < 0`, word: w1('Energie wird frei', 'energy is released'), ink: 'v' as const, note: w1('Halogene', 'halogens') },
    { x: 320, left: 150, right: 80, tex: t`\mathrm{Ne} + e^- \to \mathrm{Ne}^-`, ea: t`\mathrm{EA} > 0`, word: w1('Energie muss zugeführt werden', 'energy must be supplied'), ink: 't' as const, note: w1('Edelgase', 'noble gases') },
  ];
  return (
    <figure className="vdemo tr-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={w} h={h} label={tr('Elektronenaffinität: Energie sinkt bei Halogenen, steigt bei Edelgasen', 'Electron affinity: energy falls for halogens, rises for noble gases')}>
          {panels.map((p) => (
            <g key={p.x}>
              <line className="lf-zero" x1={p.x + 10} x2={p.x + 100} y1={p.left + 20} y2={p.left + 20} strokeWidth={4} strokeLinecap="round" />
              <line className="lf-zero" x1={p.x + 180} x2={p.x + 270} y1={p.right + 20} y2={p.right + 20} strokeWidth={4} strokeLinecap="round" />
              <line x1={p.x + 100} x2={p.x + 180} y1={p.left + 20} y2={p.right + 20} className={`lf-stroke lf-${p.ink}`} strokeDasharray="5 5" />
              <FArrow x1={p.x + 140} y1={p.left + 20 + (p.right - p.left) * 0.2} x2={p.x + 140} y2={p.left + 20 + (p.right - p.left) * 0.85} ink={p.ink} width={3} />
              <FLabel x={p.x + 55} y={p.left + 3} anchor="b" small tex={p.tex.split('\\to')[0]} />
              <FLabel x={p.x + 225} y={p.right + 3} anchor="b" small tex={p.tex.split('\\to')[1]} />
              <FLabel x={p.x + 145} y={188} ink={p.ink} tex={p.ea} />
              <FLabel x={p.x + 145} y={214} small ink={p.ink} tex={p.word} />
              <FLabel x={p.x + 145} y={238} small ink="muted" tex={p.note} />
            </g>
          ))}
        </LabelFig>
      </div>
    </figure>
  );
}

