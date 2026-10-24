import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { T, fmtNum, useLang, useTr } from '../../i18n';
import { makeGas, speedForEnergy, stepGas } from '../../chem/gasBox';
import { SceneFig, ThChips, ThSlider } from './ChemFig';
import { FL, firstLawScene, pistonTarget } from './firstLawScene';
import { useInView, useRaf, useReducedMotion } from './useFrames';

const t = String.raw;
const PRESETS = [
  { id: 'a', q: 6, w: 4 }, { id: 'b', q: -6, w: -4 },
  { id: 'i', q: -4, w: 8 }, { id: 'ii', q: 0, w: 8 }, { id: 'iii', q: 8, w: -8 },
] as const;
type PId = (typeof PRESETS)[number]['id'] | null;

const n1 = (x: number, lang: 'de' | 'en') => fmtNum(x, 1, lang, true);
const sgn = (x: number, lang: 'de' | 'en') => (x > 0.04 ? '+' : x < -0.04 ? '-' : '') + n1(Math.abs(x), lang);

/** Slide 12–13 and exercise 1 as a toy: add heat q and work w to a gas, watch ΔE = q + w in a ledger. */
export function FirstLawFigure() {
  const tr = useTr(), lang = useLang();
  const [q, setQ] = useState(6), [w, setW] = useState(4);
  const [preset, setPreset] = useState<PId>('a');
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const [pistonY, setPistonY] = useState(() => pistonTarget(4));
  const [gas, setGas] = useState(() => makeGas(16, 0.9, 11));
  const E = FL.E0 + q + w;
  const target = pistonTarget(w);
  const L = (FL.base - pistonY) / 160;
  useRaf((dt) => {
    setPistonY((p) => (Math.abs(p - target) < 0.2 ? target : p + (target - p) * Math.min(1, dt * 7)));
    setGas((g) => stepGas(g, dt, L, speedForEnergy(E, FL.E0, 1.0)));
  }, inView && !reduced);
  const settledY = reduced ? target : pistonY;
  const scene = firstLawScene(q, w, settledY, lang);
  const Ls = (FL.base - settledY) / 160;
  const dE = q + w;
  const hot = Math.max(0, Math.min(85, 35 + (E / FL.E0 - 1) * 60));
  const items = [
    { id: 'a' as const, label: <T de="Folie 13 links" en="Slide 13 left" /> },
    { id: 'b' as const, label: <T de="Folie 13 rechts" en="Slide 13 right" /> },
    { id: 'i' as const, label: <T de="Übung 1 (i)" en="Exercise 1 (i)" /> },
    { id: 'ii' as const, label: <T de="Übung 1 (ii)" en="Exercise 1 (ii)" /> },
    { id: 'iii' as const, label: <T de="Übung 1 (iii)" en="Exercise 1 (iii)" /> },
  ];
  const pick = (id: Exclude<PId, null>) => { const p = PRESETS.find((x) => x.id === id)!; setQ(p.q); setW(p.w); setPreset(id); };
  return (
    <figure className="th-fig th-two">
      <div ref={box}>
        <SceneFig scene={scene} label={tr('Ein Gas im Zylinder mit Kolben. Rechts die Energiebuchhaltung: Anfangsenergie, Wärme q, Arbeit w, Endenergie.', 'A gas in a cylinder with a piston. On the right the energy ledger: initial energy, heat q, work w, final energy.')}>
          {gas.map((p, i) => (
            <circle key={i} className="th-atom" r={5.2}
              style={{ fill: `color-mix(in srgb, var(--ch-t) ${hot}%, color-mix(in srgb, var(--muted) 55%, var(--panel)))` }}
              cx={FL.cylX0 + 6 + Math.min(1, Math.max(0, p.y)) * (FL.cylX1 - FL.cylX0 - 12)}
              cy={FL.base - 6 - Math.min(1, Math.max(0, p.x / Ls)) * (FL.base - settledY - 12)} />
          ))}
        </SceneFig>
      </div>
      <figcaption>
        <ThChips label={tr('Beispiele', 'Examples')} items={items} value={preset} onPick={pick} />
        <ThSlider label={<M>q</M>} min={-10} max={10} step={0.5} value={q} onChange={(v) => { setQ(v); setPreset(null); }} aria={tr('Wärme q in Kilojoule', 'Heat q in kilojoules')} ink="t"
          show={<M>{t`${sgn(q, lang)}\,\mathrm{kJ}`}</M>} />
        <ThSlider label={<M>w</M>} min={-10} max={10} step={0.5} value={w} onChange={(v) => { setW(v); setPreset(null); }} aria={tr('Arbeit w in Kilojoule', 'Work w in kilojoules')} ink="e"
          show={<M>{t`${sgn(w, lang)}\,\mathrm{kJ}`}</M>} />
        <div className={`th-read ${dE > 0.04 ? 'ok' : dE < -0.04 ? 'bad' : ''}`} aria-live="polite">
          <M>{t`\Delta E = q + w = (${sgn(q, lang)}) + (${sgn(w, lang)}) = ${sgn(dE, lang)}\,\mathrm{kJ}`}</M>
          <span>
            {q > 0.04 ? <T de={<>Wärme fliesst hinein (<M p=",">{t`q>0`}</M> endotherm). </>} en={<>Heat flows in (<M p=",">{t`q>0`}</M> endothermic). </>} />
              : q < -0.04 ? <T de={<>Wärme fliesst hinaus (<M p=",">{t`q<0`}</M> exotherm). </>} en={<>Heat flows out (<M p=",">{t`q<0`}</M> exothermic). </>} />
              : <T de={<>Keine Wärme (<M p=".">{t`q=0`}</M>) </>} en={<>No heat (<M p=".">{t`q=0`}</M>) </>} />}
            {w > 0.04 ? <T de={<>Der Kolben wird hineingedrückt: Arbeit am System (<M p=").">{t`w>0`}</M></>} en={<>The piston is pushed in: work done on the system (<M p=").">{t`w>0`}</M></>} />
              : w < -0.04 ? <T de={<>Das Gas schiebt den Kolben hinaus: Arbeit vom System (<M p=").">{t`w<0`}</M></>} en={<>The gas pushes the piston out: work done by the system (<M p=").">{t`w<0`}</M></>} />
              : <T de={<>Der Kolben bleibt, wo er ist (<M p=").">{t`w=0`}</M></>} en={<>The piston stays where it is (<M p=").">{t`w=0`}</M></>} />}
          </span>
          <b className="th-verdict">
            {dE > 0.04 ? <T de="Das System gewinnt Energie: die Teilchen werden schneller." en="The system gains energy: the particles get faster." />
              : dE < -0.04 ? <T de="Das System verliert Energie: die Teilchen werden langsamer." en="The system loses energy: the particles get slower." />
              : <T de="Gewinn und Verlust heben sich auf: die Energie bleibt gleich." en="Gain and loss cancel: the energy stays the same." />}
          </b>
        </div>
        <p className="th-note"><T de={<>Die Anfangsenergie <M>{t`E_\mathrm{initial} = 20\,\mathrm{kJ}`}</M> ist hier nur eine Zahl zum Zeichnen; die Vorlesung kennt den Wert von <M>E</M> nie, nur die Änderung <M p=".">{t`\Delta E`}</M></>} en={<>The initial energy <M>{t`E_\mathrm{initial} = 20\,\mathrm{kJ}`}</M> is only a number for drawing; the lecture never knows the value of <M>E</M>, only the change <M p=".">{t`\Delta E`}</M></>} /></p>
      </figcaption>
    </figure>
  );
}
