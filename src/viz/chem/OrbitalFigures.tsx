import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, T, useLang, useTr } from '../../i18n';
import { SLIDE_EXCEPTIONS, configTex, configuration, fillSequence, isException, subshellOrder, unpaired, valenceElectrons, blockOf } from '../../chem/config';
import { byZ } from '../../chem/elements';
import { allowedL, allowedMl, electronsInShell, hydrogenEnergy, orbitalsInShell, subshellLetter } from '../../chem/quantum';
import { contour, density, orbital, planeOf, type Kind, type Orbital } from '../../chem/orbital';
import { FLabel, LabelFig } from './LabelFig';
import { PeriodicGrid } from './PeriodicGrid';
import './orbitals.css';

const t = String.raw;
const A0_PM = 52.9177;

/* ================================================================ helpers */
export function orbitalTex(o: Orbital): string {
  const L = subshellLetter(o.l);
  const sub: Record<Kind, string> = { s: '', px: 'x', py: 'y', pz: 'z', dz2: 'z^2', dxz: 'xz', dyz: 'yz', dxy: 'xy', dx2y2: 'x^2-y^2' };
  return o.kind === 's' ? `${o.n}\\mathrm{${L}}` : `${o.n}\\mathrm{${L}}_{${sub[o.kind]}}`;
}

/** Re-render when the light/dark theme changes (the canvas reads CSS colours). */
function useThemeTick() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((x) => x + 1);
    const mo = new MutationObserver(bump);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    const mq = typeof matchMedia !== 'undefined' ? matchMedia('(prefers-color-scheme: dark)') : null;
    mq?.addEventListener('change', bump);
    return () => { mo.disconnect(); mq?.removeEventListener('change', bump); };
  }, []);
  return tick;
}
const cssColor = (name: string, fallback: string) => (typeof document === 'undefined' ? fallback : getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback);
function hex(c: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(c);
  if (!m) return [31, 95, 214];
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/* ================================================================ cross-section of a hydrogen orbital (canvas) */
const S = 260;
export function OrbitalView({ o, same }: { o: Orbital; same: boolean }) {
  const tr = useTr();
  const ref = useRef<HTMLCanvasElement>(null);
  const theme = useThemeTick();
  const c = useMemo(() => contour(o), [o.n, o.kind]); // eslint-disable-line react-hooks/exhaustive-deps
  const ref3s = useMemo(() => contour({ n: 3, l: 0, ml: 0, kind: 's' }).rmax, []);
  const half = (same ? ref3s : c.rmax) * 1.2 + 0.5;
  const plane = planeOf(o.kind);
  const [uName, vName] = plane === 'xz' ? ['x', 'z'] : plane === 'yz' ? ['y', 'z'] : ['x', 'y'];
  const pxPerA0 = S / (2 * half);
  const bar = [1, 2, 5, 10, 20, 50].filter((b) => b * pxPerA0 <= S * 0.4).pop() ?? 1;

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const [r, g, b] = hex(cssColor('--ch-p', '#1f5fd6'));
    const img = ctx.createImageData(S, S);
    const rho = new Float64Array(S * S);
    let peak = 0;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const u = ((i + 0.5) / S - 0.5) * 2 * half, v = (0.5 - (j + 0.5) / S) * 2 * half;
      const [x, y, z] = plane === 'xz' ? [u, 0, v] : plane === 'yz' ? [0, u, v] : [u, v, 0];
      const d = density(o, x, y, z);
      rho[j * S + i] = d;
      if (d > peak) peak = d;
    }
    for (let k = 0; k < S * S; k++) {
      const tt = peak > 0 ? Math.pow(rho[k] / peak, 0.4) : 0;
      img.data[4 * k] = r; img.data[4 * k + 1] = g; img.data[4 * k + 2] = b; img.data[4 * k + 3] = Math.round(255 * Math.min(1, tt * 1.05));
    }
    // 90 % contour: edge pixels between "above the level" and "below"
    const fg = hex(cssColor('--fg', '#1d1d1f').startsWith('#') && cssColor('--fg', '#1d1d1f').length === 7 ? cssColor('--fg', '#1d1d1f') : '#1d1d1f');
    const inside = (i: number, j: number) => i >= 0 && j >= 0 && i < S && j < S && rho[j * S + i] >= c.level;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const a = inside(i, j);
      if (a !== inside(i + 1, j) || a !== inside(i, j + 1)) {
        const k = 4 * (j * S + i);
        img.data[k] = fg[0]; img.data[k + 1] = fg[1]; img.data[k + 2] = fg[2]; img.data[k + 3] = 255;
      }
    }
    ctx.clearRect(0, 0, S, S);
    ctx.putImageData(img, 0, 0);
    ctx.strokeStyle = cssColor('--muted', '#888');
    ctx.globalAlpha = 0.55; ctx.lineWidth = 1; ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(0, S / 2); ctx.lineTo(S, S / 2); ctx.moveTo(S / 2, 0); ctx.lineTo(S / 2, S); ctx.stroke();
    ctx.globalAlpha = 1; ctx.setLineDash([]);
    ctx.fillStyle = cssColor('--ch-t', '#d62828');
    ctx.beginPath(); ctx.arc(S / 2, S / 2, 3.2, 0, 2 * Math.PI); ctx.fill();
  }, [o, c, half, plane, theme]);

  return (
    <LabelFig w={S} h={S} className="ob-view" label={tr(`Schnitt durch das Orbital ${o.n}${subshellLetter(o.l)}: Dichte der Aufenthaltswahrscheinlichkeit`, `Cross-section of the ${o.n}${subshellLetter(o.l)} orbital: probability density`)}
      behind={<canvas ref={ref} width={S} height={S} />}>
      <line x1={12} x2={12 + bar * pxPerA0} y1={S - 14} y2={S - 14} stroke="var(--fg)" strokeWidth={2.4} strokeLinecap="round" />
      <FLabel x={12 + (bar * pxPerA0) / 2} y={S - 22} anchor="b" small tex={`${bar}\\,a_0`} />
      <FLabel x={S - 6} y={S / 2 - 10} anchor="r" small ink="muted" tex={uName} />
      <FLabel x={S / 2 + 8} y={8} anchor="l" small ink="muted" tex={vName} />
    </LabelFig>
  );
}

/* ================================================================ quantum-number builder (slides 13–18) */
export function QuantumBuilder() {
  const tr = useTr(), lang = useLang();
  const [n, setN] = useState(3);
  const [sel, setSel] = useState<{ l: number; ml: number }>({ l: 2, ml: 0 });
  const [same, setSame] = useState(false);
  const pick = (nn: number) => { setN(nn); if (sel.l > nn - 1) setSel({ l: 0, ml: 0 }); };
  const o = orbital(n, sel.l, sel.ml);
  const c = o ? contour(o) : null;
  const num = (x: number, d: number) => fmtNum(x, d, lang, true);
  const shapeNote = (): ReactNode => {
    if (!o) return null;
    if (o.l === 0) return <T de={<>Eine Kugel. Es gibt nur eine Orientierung, darum <M p=".">{t`m_\ell = 0`}</M></>} en={<>A sphere. There is only one orientation, hence <M p=".">{t`m_\ell = 0`}</M></>} />;
    if (o.l === 1) return <T de={<>Eine Hantel mit zwei Keulen, entlang einer Achse. Drei Werte von <M>m</M>, drei Orientierungen.</>} en={<>A dumbbell with two lobes, along one axis. Three values of <M>m</M>, three orientations.</>} />;
    return o.kind === 'dz2'
      ? <T de={<>Zwei Keulen entlang <M>z</M> und ein Ring in der <M>xy</M>-Ebene. Fünf Werte von <M>m</M>, fünf Orientierungen.</>} en={<>Two lobes along <M>z</M> and a ring in the <M>xy</M> plane. Five values of <M>m</M>, five orientations.</>} />
      : <T de={<>Ein vierblättriges Kleeblatt mit vier Keulen. Fünf Werte von <M>m</M>, fünf Orientierungen.</>} en={<>A four-leaf clover with four lobes. Five values of <M>m</M>, five orientations.</>} />;
  };
  return (
    <figure className="vdemo ob-fig">
      <div className="vdemo-fig">
        {o
          ? <OrbitalView o={o} same={same} />
          : <div className="ob-empty"><T de="Die sieben f-Orbitale werden hier nicht gezeichnet." en="The seven f orbitals are not drawn here." /></div>}
      </div>
      <figcaption className="vdemo-readout ob-readout">
        <div className="lf-chips" role="group" aria-label={tr('Schale n', 'Shell n')}>
          {[1, 2, 3, 4].map((k) => <button key={k} type="button" aria-pressed={n === k} onClick={() => pick(k)}><M>{`n = ${k}`}</M></button>)}
        </div>
        <div className="ob-rows" role="group" aria-label={tr('Orbitale als Kästchen', 'Orbitals as boxes')}>
          {allowedL(n).map((l) => (
            <div key={l} className="ob-row">
              <span className="ob-lab"><M>{`${n}\\mathrm{${subshellLetter(l)}}`}</M></span>
              {allowedMl(l).map((ml) => {
                const drawable = orbital(n, l, ml) !== null;
                const on = sel.l === l && sel.ml === ml;
                return (
                  <button key={ml} type="button" className={`ob-box${on ? ' on' : ''}${drawable ? '' : ' off'}`} aria-pressed={on} disabled={!drawable}
                    title={drawable ? undefined : tr('f-Orbitale sind hier nicht gezeichnet', 'f orbitals are not drawn here')}
                    onClick={() => setSel({ l, ml })} aria-label={`${n}${subshellLetter(l)}, m=${ml}`}>
                    <span className="ob-m"><M>{`${ml}`}</M></span>
                    <svg viewBox="0 0 30 14" aria-hidden="true"><path d="M8 13V2M4.5 5.5 8 2l3.5 3.5" /><path d="M22 1v11M18.5 8.5 22 12l3.5-3.5" /></svg>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <p className="ob-count">
          <T de={<>Schale <M>{`n = ${n}`}</M>: <M>{t`n^2 = ${orbitalsInShell(n)}`}</M> Orbitale, Platz für <M>{t`2n^2 = ${electronsInShell(n)}`}</M> Elektronen.</>} en={<>Shell <M>{`n = ${n}`}</M>: <M>{t`n^2 = ${orbitalsInShell(n)}`}</M> orbitals, room for <M>{t`2n^2 = ${electronsInShell(n)}`}</M> electrons.</>} />
        </p>
        {o && c && (
          <>
            <span className="ob-qn"><M>{t`n = ${o.n},\ \ell = ${o.l},\ m_\ell = ${o.ml}`}</M><M>{t`\Rightarrow\; ${orbitalTex(o)}`}</M></span>
            <p className="vdemo-note">{shapeNote()}{' '}
              <T de={<>Radiale Knoten: <M p=".">{t`n - \ell - 1 = ${o.n - o.l - 1}`}</M></>} en={<>Radial nodes: <M p=".">{t`n - \ell - 1 = ${o.n - o.l - 1}`}</M></>} />{' '}
              <T de={<>Die Linie umschliesst 90&nbsp;% der Aufenthaltswahrscheinlichkeit, bis höchstens <M p=".">{t`r \approx ${num(c.rmax, 1)}\,a_0 \approx ${num(Math.round(c.rmax * A0_PM / 10) * 10, 0)}\ \mathrm{pm}`}</M></>}
                en={<>The line encloses 90&nbsp;% of the probability, out to at most <M p=".">{t`r \approx ${num(c.rmax, 1)}\,a_0 \approx ${num(Math.round(c.rmax * A0_PM / 10) * 10, 0)}\ \mathrm{pm}`}</M></>} />
            </p>
          </>
        )}
        <div className="lf-chips" role="group" aria-label={tr('Massstab', 'Scale')}>
          <button type="button" aria-pressed={!same} onClick={() => setSame(false)}>{tr('Massstab angepasst', 'Scale fitted')}</button>
          <button type="button" aria-pressed={same} onClick={() => setSame(true)}>{tr('gleicher Massstab', 'same scale')}</button>
        </div>
      </figcaption>
    </figure>
  );
}

/* ================================================================ energy levels: hydrogen vs. multielectron atoms (slides 19, 22) */
type Lvl = { n: number; l: number; multi: number };
// schematic energies of the multielectron atom (arbitrary units): s < p < d inside a shell, 4s below 3d (slide 22); not to scale
const LEVELS: Lvl[] = [
  { n: 1, l: 0, multi: 0 }, { n: 2, l: 0, multi: 3.6 }, { n: 2, l: 1, multi: 4.6 }, { n: 3, l: 0, multi: 6.6 }, { n: 3, l: 1, multi: 7.4 },
  { n: 4, l: 0, multi: 8.1 }, { n: 3, l: 2, multi: 8.8 }, { n: 4, l: 1, multi: 9.5 }, { n: 4, l: 2, multi: 10.4 },
];
export function EnergyLevels() {
  const tr = useTr();
  const [multi, setMulti] = useState(false);
  const W = 600, H = 380, top = 36, bot = 340, bw = 17, gap = 4;
  const yH = (n: number) => bot - (1 - 1 / (n * n)) * (bot - top);
  const yM = (v: number) => bot - (v / 11) * (bot - top) * 0.97;
  const x0 = 120, colW = [0, 0, 0];
  void colW;
  const xFor = (l: number) => x0 + [0, 90, 220][l];
  return (
    <figure className="vdemo ob-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={W} h={H} label={tr('Energieniveaus: im Wasserstoffatom hängt die Energie nur von n ab; im Mehrelektronenatom auch von ℓ', 'Energy levels: in hydrogen the energy depends on n only; in multielectron atoms also on ℓ')} className="ob-levels">
          <line className="lf-zero" x1={x0 - 50} x2={x0 - 50} y1={bot + 6} y2={top - 14} />
          <path d={`M${x0 - 50} ${top - 18} l-4 9 h8z`} fill="var(--muted)" />
          <FLabel x={x0 - 56} y={top - 16} anchor="r" small ink="muted" tex="E" />
          {!multi && <line x1={x0 - 50} x2={W - 20} y1={top} y2={top} stroke="var(--muted)" strokeDasharray="5 5" />}
          {!multi && <FLabel x={W - 24} y={top - 10} anchor="r" small ink="muted" tex={t`n = \infty,\ E = 0`} />}
          {LEVELS.map((lv) => {
            const y = multi ? yM(lv.multi) : yH(lv.n);
            const nb = 2 * lv.l + 1, x = xFor(lv.l), hide = !multi && lv.n === 4;
            const ink = lv.l === 0 ? 'var(--ch-p)' : lv.l === 1 ? 'var(--ch-t)' : 'var(--ch-e)';
            return (
              <g key={`${lv.n}${lv.l}`}>
                <g className="ob-lvl" style={{ transform: `translateY(${y}px)`, opacity: hide ? 0 : 1 }}>
                  {Array.from({ length: nb }, (_, i) => <rect key={i} x={x + i * (bw + gap)} y={-8} width={bw} height={16} rx={2.5} fill="var(--panel)" stroke={ink} strokeWidth={2} />)}
                </g>
                <FLabel x={x - 8} y={y} anchor="r" small slide opacity={hide ? 0 : 1} tex={`${lv.n}\\mathrm{${subshellLetter(lv.l)}}`} ink="fg" halo={false} />
              </g>
            );
          })}
          {!multi && [1, 2, 3].map((n) => <FLabel key={n} x={W - 24} y={yH(n)} anchor="r" small ink="muted" tex={n === 1 ? t`n=1:\ -R_H` : t`n=${n}:\ -R_H/${n * n}`} halo={false} />)}
        </LabelFig>
      </div>
      <figcaption className="vdemo-readout">
        <div className="lf-chips" role="group">
          <button type="button" aria-pressed={!multi} onClick={() => setMulti(false)}>{tr('Wasserstoff (1 Elektron)', 'Hydrogen (1 electron)')}</button>
          <button type="button" aria-pressed={multi} onClick={() => setMulti(true)}>{tr('Mehrelektronenatom', 'Multielectron atom')}</button>
        </div>
        <p className="vdemo-note">
          {multi
            ? <T de={<>Jetzt stossen sich die Elektronen ab. Die Unterschalen derselben Schale spalten auf: <M p=",">{t`E_s < E_p < E_d`}</M> und <M>4s</M> liegt noch unter <M p=".">3d</M> Die Abstände sind schematisch, nicht massstäblich (Folie 22).</>}
                en={<>Now the electrons repel each other. The subshells of one shell split apart: <M p=",">{t`E_s < E_p < E_d`}</M> and <M>4s</M> lies even below <M p=".">3d</M> The spacings are schematic, not to scale (slide 22).</>} />
            : <T de={<>Die Energie hängt nur von <M>n</M> ab: <M p=".">{t`E_n = -R_H/n^2`}</M> <M>2s</M> und <M>2p</M> liegen gleich hoch, ebenso <M>3s</M>, <M>3p</M>, <M p=".">3d</M> Je höher <M>n</M>, desto dichter die Niveaus (<M>{t`R_H = ${(-hydrogenEnergy(1) * 1e18).toFixed(2)}\cdot 10^{-18}\ \mathrm{J}`}</M> hier als Einheit).</>}
                en={<>The energy depends on <M>n</M> only: <M p=".">{t`E_n = -R_H/n^2`}</M> <M>2s</M> and <M>2p</M> lie at the same height, so do <M>3s</M>, <M>3p</M>, <M p=".">3d</M> The higher <M>n</M>, the closer the levels (<M>{t`R_H = ${(-hydrogenEnergy(1) * 1e18).toFixed(2)}\cdot 10^{-18}\ \mathrm{J}`}</M> is the unit here).</>} />}
        </p>
      </figcaption>
    </figure>
  );
}

/* ================================================================ spin and the Pauli principle (slides 20–22) */
export function SpinPauli() {
  const tr = useTr(), lang = useLang();
  const W = 600, H = 250;
  const word = (de: string, en: string) => t`\text{${lang === 'de' ? de : en}}`;
  const arrow = (x: number, y: number, up: boolean, ink = 'var(--fg)') => (
    <g stroke={ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d={up ? `M${x} ${y + 18}V${y - 18}M${x - 7} ${y - 10} ${x} ${y - 19} ${x + 7} ${y - 10}` : `M${x} ${y - 18}V${y + 18}M${x - 7} ${y + 10} ${x} ${y + 19} ${x + 7} ${y + 10}`} />
    </g>
  );
  const box = (x: number, label: string, ups: boolean[], ok: boolean, ink: 'v' | 't') => (
    <g key={x}>
      <rect x={x} y={120} width={66} height={56} rx={6} fill="var(--panel)" stroke="var(--fg)" strokeWidth={2} />
      {ups.length === 1 ? arrow(x + 33, 148, ups[0]) : <>{arrow(x + 20, 148, ups[0])}{arrow(x + 46, 148, ups[1])}</>}
      {!ok && <g stroke="var(--ch-t)" strokeWidth={4} strokeLinecap="round"><path d={`M${x + 8} 112 L${x + 58} 184`} /><path d={`M${x + 58} 112 L${x + 8} 184`} /></g>}
      <FLabel x={x + 33} y={200} small ink={ink} tex={label} />
      <FLabel x={x + 33} y={226} small ink={ink} tex={word(ok ? 'erlaubt' : 'verboten', ok ? 'allowed' : 'forbidden')} />
    </g>
  );
  return (
    <figure className="vdemo ob-fig">
      <div className="vdemo-fig wide">
        <LabelFig w={W} h={H} label={tr('Spin: zwei Einstellungen. Pauli: pro Kästchen höchstens zwei Elektronen, mit entgegengesetztem Spin', 'Spin: two orientations. Pauli: at most two electrons per box, with opposite spin')}>
          {[{ x: 90, up: true }, { x: 230, up: false }].map((e) => (
            <g key={e.x}>
              <circle cx={e.x} cy={70} r={24} fill="var(--ch-p)" fillOpacity={0.35} stroke="var(--ch-p)" strokeWidth={2} />
              <line x1={e.x - 9} x2={e.x + 9} y1={70} y2={70} stroke="var(--fg)" strokeWidth={2.4} strokeLinecap="round" />
              {arrow(e.x, 70, e.up, 'var(--ch-t)')}
              <FLabel x={e.x} y={e.up ? 22 : 118} ink="t" small tex={t`\mathrm{N}`} halo={false} />
              <FLabel x={e.x} y={e.up ? 118 : 22} ink="p" small tex={t`\mathrm{S}`} halo={false} />
              <FLabel x={e.x + 46} y={70} anchor="l" small tex={e.up ? t`m_s = +\tfrac12` : t`m_s = -\tfrac12`} />
            </g>
          ))}
          {box(360, t`\uparrow\downarrow`, [true, false], true, 'v')}
          {box(444, t`\uparrow`, [true], true, 'v')}
          {box(528, t`\uparrow\uparrow`, [true, true], false, 't')}
        </LabelFig>
      </div>
    </figure>
  );
}

/* ================================================================ electron configurations: periodic table + orbital boxes (slides 22–27) */
const BLOCK_BG: Record<string, string> = {
  s: 'color-mix(in srgb, var(--ch-p) 48%, var(--panel))', p: 'color-mix(in srgb, var(--ch-t) 40%, var(--panel))',
  d: 'color-mix(in srgb, var(--ch-e) 48%, var(--panel))', f: 'color-mix(in srgb, var(--ch-v) 30%, var(--panel))',
};
const ROWS = subshellOrder().filter(([n, l]) => (n < 5 || (n === 5 && l <= 2)) && !(l === 3)); // 1s … 5p

export function ConfigFiller({ initial = 34 }: { initial?: number }) {
  const tr = useTr(), lang = useLang();
  const [Z, setZ] = useState(initial);
  const [k, setK] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const el = byZ(Z)!;
  const seq = useMemo(() => fillSequence(Z), [Z]);
  const placed = seq.slice(0, k);
  const cfg = configuration(Z);
  const pick = (z: number) => { setPlaying(false); setZ(z); setK(z); };
  useEffect(() => {
    if (!playing) return;
    if (k >= Z) { setPlaying(false); return; }
    const id = setTimeout(() => setK((x) => x + 1), 380);
    return () => clearTimeout(id);
  }, [playing, k, Z]);
  const play = () => { if (k >= Z) setK(0); setPlaying(true); };
  const cur = k > 0 ? seq[k - 1] : null;
  const occ = (n: number, l: number, box: number, spin: 1 | -1) => placed.some((p) => p.n === n && p.l === l && p.box === box && p.spin === spin);
  const name = lang === 'de' ? el.de : el.en;
  const val = valenceElectrons(Z), unp = unpaired(Z);
  const exc = isException(Z);
  const chip = (z: number) => <button key={z} type="button" aria-pressed={Z === z} onClick={() => pick(z)}><M>{t`\mathrm{${byZ(z)!.symbol}}`}</M></button>;
  const maxRow = Math.max(...cfg.map((s) => ROWS.findIndex(([n, l]) => n === s.n && l === s.l)));
  const rows = ROWS.slice(0, Math.max(maxRow + 1, 1)).slice().reverse();
  return (
    <figure className="vdemo ob-fig ob-config">
      <div className="vdemo-fig wide ob-cfg-top">
        <div className="ob-cfg-grid">
          <PeriodicGrid label={tr('Periodensystem: Element wählen', 'Periodic table: pick an element')} picked={Z} onPick={pick}
            style={(e) => ({ bg: BLOCK_BG[blockOf(e.Z)], opacity: e.Z <= Z ? 1 : 0.38, ring: e.Z === Z })} />
        </div>
        <div className="ob-cfg-boxes" role="group" aria-label={tr('Orbitale als Kästchen mit Elektronen', 'Orbital boxes with electrons')}>
          {rows.map(([n, l]) => {
            const nb = 2 * l + 1;
            const s = cfg.find((x) => x.n === n && x.l === l);
            return (
              <div key={`${n}${l}`} className={`ob-crow${s ? '' : ' empty'}`}>
                <span className="ob-lab"><M>{`${n}\\mathrm{${subshellLetter(l)}}`}</M></span>
                {Array.from({ length: nb }, (_, b) => {
                  const up = occ(n, l, b, 1), dn = occ(n, l, b, -1);
                  const now = cur && cur.n === n && cur.l === l && cur.box === b;
                  return (
                    <span key={b} className={`ob-cbox${now ? ' now' : ''}${up || dn ? ' full' : ''}`}>
                      <svg viewBox="0 0 30 22" aria-hidden="true">
                        {up && <path className={cur && now && cur.spin === 1 ? 'new' : ''} d="M9 20V3M5 7 9 3l4 4" />}
                        {dn && <path className={cur && now && cur.spin === -1 ? 'new' : ''} d="M21 2v17M17 15l4 4 4-4" />}
                      </svg>
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className="vdemo-readout ob-readout">
        <div className="ob-cfg-ctl">
          <button type="button" className="lf-btn" onClick={() => pick(Math.max(1, Z - 1))} disabled={Z <= 1} aria-label={tr('Vorheriges Element', 'Previous element')}>‹</button>
          <button type="button" className="lf-btn primary" onClick={play}>{playing ? tr('…', '…') : tr('Elektronen einfüllen', 'Fill in the electrons')}</button>
          <button type="button" className="lf-btn" onClick={() => pick(Math.min(54, Z + 1))} disabled={Z >= 54} aria-label={tr('Nächstes Element', 'Next element')}>›</button>
        </div>
        <label className="slider wide-slider">
          <span><M>k</M></span>
          <input type="range" min={0} max={Z} step={1} value={k} onChange={(e) => { setPlaying(false); setK(Number(e.target.value)); }} aria-label={tr('Elektron Nummer', 'Electron number')} />
          <span className="val"><M>{`${k}/${Z}`}</M></span>
        </label>
        <div className="lf-chips" role="group" aria-label={tr('Beispiele', 'Examples')}>{[1, 6, 8, 10, 11, 24, 29, 34].map(chip)}</div>
        <p className="ob-elname"><M>{t`\mathrm{${el.symbol}}`}</M>, {name}, <M>{`Z = ${Z}`}</M></p>
        <M>{configTex(Z)}</M>
        <p className="vdemo-note">
          <T de={<>Valenzelektronen: <M>{`${val}`}</M>. Ungepaarte Elektronen: <M p=".">{`${unp}`}</M></>} en={<>Valence electrons: <M>{`${val}`}</M>. Unpaired electrons: <M p=".">{`${unp}`}</M></>} />
          {cur && cur.spin === -1 && <>{' '}<T de="Das letzte Elektron paart sich: Alle Kästchen dieser Unterschale hatten schon eins." en="The last electron pairs up: every box of this subshell already had one." /></>}
          {cur && cur.spin === 1 && cur.box > 0 && <>{' '}<T de="Hund: Das nächste Kästchen derselben Unterschale bekommt zuerst ein Elektron mit gleichem Spin." en="Hund: the next box of the same subshell gets an electron with the same spin first." /></>}
          {exc && <>{' '}{SLIDE_EXCEPTIONS.includes(Z)
            ? <T de="Ausnahme (Folie 27): Ein Elektron wandert von 4s nach 3d. Nicht auswendig lernen, nur wissen." en="Exception (slide 27): one electron moves from 4s to 3d. Don’t memorise, just be aware." />
            : <T de="Auch eine Ausnahme der Regel (nicht auf den Folien)." en="Also an exception to the rule (not on the slides)." />}</>}
        </p>
      </figcaption>
    </figure>
  );
}

