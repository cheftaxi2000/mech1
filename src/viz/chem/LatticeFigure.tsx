import { useEffect, useMemo, useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { expansionLattice, mulberry32, sampleConfig } from '../../chem/entropy';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { LS, countLeft, latticeScene } from './latticeScene';
import { useInView, useReducedMotion } from './useFrames';

const t = String.raw;
const sci = (x: number, lang: 'de' | 'en') => { const e = Math.floor(Math.log10(Math.abs(x))), m = x / 10 ** e; return `${fmtNum(m, 2, lang, true)}\\cdot 10^{${e}}`; };
const big = (n: number, _lang: 'de' | 'en') => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,');

/** Slides 11, 17–19, 21: count the arrangements W of N particles, S = k_B ln W, and open the partition. */
export function LatticeFigure() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const [N, setN] = useState(6), [open, setOpen] = useState(false), [tick, setTick] = useState(0);
  const [counts, setCounts] = useState<number[]>(() => Array(11).fill(0));
  const rnd = useMemo(() => mulberry32(2026 + N * 7 + (open ? 1 : 0)), [N, open]);
  const config = useMemo(() => sampleConfig(open ? 2 * LS.M : LS.M, N, rnd), [N, open, tick, rnd]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setCounts(Array(11).fill(0)); setTick(0); }, [N, open]);
  useEffect(() => { if (open) setCounts((c) => { const n = c.slice(); n[countLeft(config)]++; return n; }); }, [config, open]);
  useEffect(() => {
    if (reduced || !inView) return;
    const id = setInterval(() => setTick((v) => v + 1), 380);
    return () => clearInterval(id);
  }, [reduced, inView]);
  const e = expansionLattice(LS.M, N);
  const sc = latticeScene(N, open, config, counts.slice(0, N + 1), lang);
  const kb = (x: number) => fmtNum(x, 2, lang, true);
  const total = counts.reduce((s, v) => s + v, 0);
  return (
    <figure className="th-fig th-two">
      <div ref={box}>
        <SceneFig scene={sc} label={tr('Gitter mit zwei Kammern und Teilchen; darunter die Zahl der Anordnungen für jede Verteilung auf links und rechts', 'Lattice with two chambers and particles; below it the number of arrangements for each split between left and right')} />
      </div>
      <figcaption>
        <ThChips label={tr('Trennwand', 'Partition')} value={open ? 'open' : 'closed'} onPick={(v) => setOpen(v === 'open')} items={[{ id: 'closed', label: <T de="geschlossen" en="closed" /> }, { id: 'open', label: <T de="offen" en="open" /> }]} />
        <ThSlider label={<M>N</M>} min={1} max={10} step={1} value={N} onChange={setN} ink="n" aria={tr('Anzahl der Teilchen', 'Number of particles')} show={<M>{t`${N}`}</M>} />
        <div className="v-presets th-chips">
          <button type="button" onClick={() => setTick((v) => v + 1)}>{tr('neu anordnen', 'rearrange')}</button>
          <button type="button" onClick={() => { setN(10); setOpen(false); }}>{tr('Kristall: alle Plätze besetzt', 'crystal: every site occupied')}</button>
        </div>
        <div className="th-read" aria-live="polite">
          <M>{t`W_\mathrm{closed} = \binom{10}{${N}} = ${big(e.Wi, lang)},\quad S = k_\mathrm{B}\ln W = ${kb(Math.log(e.Wi))}\,k_\mathrm{B}`}</M>
          {open && <M>{t`W_\mathrm{open} = \binom{20}{${N}} = ${big(e.Wf, lang)},\quad S = ${kb(Math.log(e.Wf))}\,k_\mathrm{B}`}</M>}
          {open && <M>{t`\Delta S = k_\mathrm{B}\ln\frac{W_\mathrm{open}}{W_\mathrm{closed}} = ${kb(e.dS_kB)}\,k_\mathrm{B} = ${sci(e.dS_JK, lang)}\,\mathrm{J\,K^{-1}}`}</M>}
          <span>{open
            ? <T de={<>Die Chance, dass wieder alle Teilchen links sind: <M>{t`1 : ${big(Math.round(1 / e.pAllLeft), lang)}`}</M>. Gezählt: {total} Anordnungen angeschaut.</>} en={<>The chance that all particles are on the left again: <M>{t`1 : ${big(Math.round(1 / e.pAllLeft), lang)}`}</M>. Counted: {total} arrangements looked at.</>} />
            : e.Wi === 1 ? <T de={<>Nur eine einzige Anordnung: <M>{t`W = 1`}</M>, also <M>{t`S = 0`}</M> (3. Hauptsatz).</>} en={<>Only a single arrangement: <M>{t`W = 1`}</M>, so <M>{t`S = 0`}</M> (3rd law).</>} />
              : <T de="Die Teilchen sitzen links. Öffne die Trennwand." en="The particles sit on the left. Open the partition." />}</span>
        </div>
        <p className="th-note"><T de={<>Die Punkte zeigen, wie oft die gerade gezeigten Zufallsanordnungen <M>k</M> Teilchen links hatten; die Säulen sind die exakte Zahl <M>{t`W(k)`}</M>. «Halb–halb» hat die meisten Anordnungen, «alle links» nur eine Handvoll.</>} en={<>The dots show how often the random arrangements shown so far had <M>k</M> particles on the left; the bars are the exact number <M>{t`W(k)`}</M>. «Half and half» has by far the most arrangements, «all on the left» only a handful.</>} /></p>
      </figcaption>
    </figure>
  );
}
