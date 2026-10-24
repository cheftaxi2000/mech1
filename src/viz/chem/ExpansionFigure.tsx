import { useRef, useState } from 'react';
import { M } from '../../components/Tex';
import { T, useLang, useTr } from '../../i18n';
import { makeGas, stepGasRange, type Particle } from '../../chem/gasBox';
import { SceneFig, ThChips } from './ChemFig';
import { EX, exX, exY, expansionScene, type ExpMode, type ExpPhase } from './expansionScene';
import { useInView, useRaf, useReducedMotion } from './useFrames';

const t = String.raw;
const N = 18;
const fresh = (mode: ExpMode) => (mode === 'vac' ? makeGas(N, 0.5, 21).map((p) => ({ ...p, x: 0.5 + p.x })) : makeGas(N, 0.55, 22).map((p) => ({ ...p, x: 0.45 + p.x })));

/** Slide 11: expansion into vacuum (irreversible) versus a slowly moving piston (reversible). */
export function ExpansionFigure() {
  const tr = useTr(), lang = useLang();
  const reduced = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box);
  const [mode, setMode] = useState<ExpMode>('vac');
  const [phase, setPhase] = useState<ExpPhase>('closed');
  const [xp, setXp] = useState(0.45), [dir, setDir] = useState<-1 | 0 | 1>(0), [push, setPush] = useState(0);
  const [gas, setGas] = useState<Particle[]>(() => fresh('vac'));
  const x0 = mode === 'vac' ? (phase === 'push' ? 0.5 * push : phase === 'closed' ? 0.5 : 0) : xp;
  useRaf((dt) => {
    let lo = x0;
    if (mode === 'vac' && phase === 'push' && push < 1) { const n = Math.min(1, push + dt / 4); setPush(n); lo = 0.5 * n; }
    if (mode === 'rev' && dir !== 0) { const n = Math.min(0.75, Math.max(0.15, xp + dir * dt * 0.09)); setXp(n); lo = n; if (n <= 0.15 || n >= 0.75) setDir(0); }
    setGas((g) => stepGasRange(g, dt, lo, 1, 0.45));
  }, inView && !reduced);
  const reset = (m: ExpMode) => { setMode(m); setPhase('closed'); setPush(0); setXp(0.45); setDir(0); setGas(fresh(m)); };
  const sc = expansionScene({ mode, phase, x0, dir }, lang);
  const left = gas.filter((p) => p.x < 0.5).length;
  return (
    <figure className="th-fig th-two">
      <div ref={box}>
        <SceneFig scene={sc} label={tr('Zylinder mit Gas: links Vakuum oder ein Kolben, in der Mitte eine Trennwand', 'Cylinder with gas: vacuum or a piston on the left, a partition in the middle')}>
          {gas.map((p, i) => <circle key={i} className="th-atom" r={5} cx={exX(Math.max(x0, p.x))} cy={exY(p.y)} style={{ fill: 'color-mix(in srgb, var(--ch-n) 70%, var(--panel))' }} />)}
        </SceneFig>
      </div>
      <figcaption>
        <ThChips label={tr('Vorgang', 'Process')} value={mode} onPick={reset} items={[
          { id: 'vac', label: <T de="Trennwand weg (Vakuum)" en="partition removed (vacuum)" /> }, { id: 'rev', label: <T de={<>Kolben, Druck <M>{t`P \mp \delta P`}</M></>} en={<>piston, pressure <M>{t`P \mp \delta P`}</M></>} /> },
        ]} />
        {mode === 'vac' ? (
          <div className="v-presets th-chips">
            <button type="button" disabled={phase !== 'closed'} onClick={() => setPhase('open')}>{tr('Trennwand entfernen', 'remove partition')}</button>
            <button type="button" disabled={phase !== 'open'} onClick={() => { setPush(0); setPhase('push'); }}>{tr('zurückschieben (Kolben)', 'push back (piston)')}</button>
            <button type="button" onClick={() => reset('vac')}>{tr('von vorn', 'restart')}</button>
          </div>
        ) : (
          <div className="v-presets th-chips">
            <button type="button" aria-pressed={dir === -1} onClick={() => setDir(dir === -1 ? 0 : -1)}>{tr('Druck etwas kleiner: Gas dehnt sich aus', 'pressure slightly lower: gas expands')}</button>
            <button type="button" aria-pressed={dir === 1} onClick={() => setDir(dir === 1 ? 0 : 1)}>{tr('Druck etwas grösser: Gas wird zusammengedrückt', 'pressure slightly higher: gas is compressed')}</button>
          </div>
        )}
        <div className="th-read" aria-live="polite">
          {mode === 'vac'
            ? (phase === 'closed'
              ? <T de="Das Gas ist rechts eingesperrt, links ist Vakuum." en="The gas is locked in on the right, on the left is vacuum." />
              : phase === 'open'
                ? <T de={<>Das Gas verteilt sich von selbst über den ganzen Zylinder (links jetzt {left} von {N} Teilchen). Es leistet keine Arbeit (<M p=").">{t`w = 0`}</M> <b>Spontan und irreversibel.</b></>} en={<>The gas spreads over the whole cylinder by itself (now {left} of {N} particles on the left). It does no work (<M p=").">{t`w = 0`}</M> <b>Spontaneous and irreversible.</b></>} />
                : <T de={<>Zurück geht es nur, wenn die Umgebung Arbeit leistet (<M p=").">{t`w > 0`}</M> Dann ist die Umgebung nicht mehr wie vorher: <b>irreversibel</b>.</>} en={<>It only goes back if the surroundings do work (<M p=").">{t`w > 0`}</M> Then the surroundings are no longer as before: <b>irreversible</b>.</>} />)
            : <T de={<>Ändert man den Druck nur um <M>{t`\delta P`}</M>, kehrt sich die Richtung um, ohne dass sich die Umgebung bleibend ändert: <b>reversibel</b> (ein idealisierter Grenzfall).</>} en={<>If the pressure is changed by just <M>{t`\delta P`}</M>, the direction reverses without a lasting change of the surroundings: <b>reversible</b> (an idealised limit).</>} />}
        </div>
      </figcaption>
    </figure>
  );
}
void EX;
