import { useState, type ReactNode } from 'react';
import { M } from '../../components/Tex';
import { fmtNum, tupleSep, useLang, useTr, type Lang } from '../../i18n';
import type { Vec3 } from '../../physics/vec';
import { useFigureHeight } from '../useNarrow';
import { FullscreenButton, useFullscreen } from '../useFullscreen';
import { FrameScene } from './K6Draw';
import { K6, deriveFrame, refAnimFrame, refExplorerFrame, refNumbers, type Frame3 } from './k6Frames';
import './lp.css';

const t = String.raw;

/** One step of a 3D step animation: the scene, the step's equation card, and a fullscreen button (captions are shown in fullscreen). */
function StepStage({ frame, captions, step }: { frame: Frame3; captions: ReactNode[]; step: number }) {
  const [ref, full, toggle] = useFullscreen();
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`lp-stage${full ? ' is-full' : ''}`} data-step={step}>
      <div className="stage">
        <FrameScene f={frame} height={full ? '100%' : 380} />
        {frame.eq && <div className="lp-eq"><M>{frame.eq}</M></div>}
        <FullscreenButton full={full} onClick={toggle} />
      </div>
      {full && <div className="lp-fullcap">{captions[step]}</div>}
    </div>
  );
}

/** p. 33: the derivation P = F · v_P = ω · (OP × F), in 3D. */
export function DeriveAnim({ step, t: tt, captions }: { step: number; t: number; captions: ReactNode[] }) {
  const lang = useLang();
  return <StepStage frame={deriveFrame(step, tt, lang)} captions={captions} step={step} />;
}

/** p. 34: the proof for the reference point O′. */
export function RefAnim({ step, t: tt, captions }: { step: number; t: number; captions: ReactNode[] }) {
  const lang = useLang();
  return <StepStage frame={refAnimFrame(step, tt, lang)} captions={captions} step={step} />;
}

type FPreset = 'example' | 'tangential' | 'radial' | 'axis';
export const REF_PRESETS: Record<FPreset, { F: Vec3; de: string; en: string }> = {
  example: { F: K6.F, de: 'Beispiel', en: 'example' },
  tangential: { F: [0, 0.9, 0], de: 'tangential', en: 'tangential' },
  radial: { F: [0.9, 0, 0], de: 'radial', en: 'radial' },
  axis: { F: [0, 0, 0.9], de: 'parallel zur Achse', en: 'parallel to the axis' },
};

const vecTex = (v: Vec3, lang: Lang) => `(${v.map((x) => fmtNum(x, 2, lang, true)).join(tupleSep(lang))})`;

/**
 * Lecture p. 34, «Merke»: the moment of F̲ depends on the reference point on the axis (M̲_O ≠ M̲_O′), but its part along the
 * axis does not, so P = ω M_z is the same. Slide O′ along μ; each moment is drawn from its own point. The green pieces on the
 * axis are the parts along the axis: they always have the same length.
 */
export function RefExplorer() {
  const tr = useTr(), lang = useLang();
  const [figRef, full, toggleFull] = useFullscreen();
  const [h, setH] = useState(1.2);
  const [pre, setPre] = useState<FPreset>('example');
  const [showD, setShowD] = useState(false);
  const height = useFigureHeight(420, 340);
  const F = REF_PRESETS[pre].F;
  const frame = refExplorerFrame({ h, F, showD });
  const R = refNumbers(h, F);
  const f2 = (x: number) => fmtNum(x, 2, lang, true);
  const same = Math.abs(h) < 0.02;
  return (
    <figure className={`explorer lp-explorer${full ? ' is-full' : ''}`} ref={figRef as React.RefObject<HTMLElement>}>
      <div className="stage">
        <FrameScene f={frame} height={full ? '100%' : height} />
        <FullscreenButton full={full} onClick={toggleFull} />
      </div>
      <div className="side">
        <div className="v-presets lp-presets">
          {(Object.keys(REF_PRESETS) as FPreset[]).map((k) => (
            <button key={k} type="button" aria-pressed={pre === k} onClick={() => setPre(k)}>{tr(REF_PRESETS[k].de, REF_PRESETS[k].en)}</button>
          ))}
        </div>
        <div className="controls">
          <label className="slider lp-slider">
            <M>{t`O'`}</M>
            <input type="range" min={-1} max={1.8} step={0.05} value={h} onChange={(e) => setH(Number(e.target.value))} aria-label="O'" />
            <span className="val">{fmtNum(h, 2, lang)}</span>
          </label>
          <label className="toggle"><input type="checkbox" checked={showD} onChange={(e) => setShowD(e.target.checked)} /> {tr(<>Unterschied <M>{t`\v M_{O'} - \v M_O`}</M> zeigen</>, <>show the difference <M>{t`\v M_{O'} - \v M_O`}</M></>)}</label>
        </div>
        <figcaption>
          <table className="readout">
            <tbody>
              <tr><th><M>{t`\v M_O`}</M></th><td><M>{t`${vecTex(R.MO, lang)}\,\text{N}\,\text{m}`}</M></td></tr>
              <tr><th><M>{t`\v M_{O'}`}</M></th><td><M>{t`${vecTex(R.MOp, lang)}\,\text{N}\,\text{m}`}</M>{same ? <span className="lp-eqtag"> = <M>{t`\v M_O`}</M></span> : null}</td></tr>
              <tr><th><M>{t`M_z,\ M_z'`}</M></th><td><M>{t`${f2(R.Mz)}\ =\ ${f2(R.Mzp)}\,\text{N}\,\text{m}`}</M></td></tr>
              <tr><th><M>P</M></th><td><M>{t`\omega\,M_z = ${f2(1)}\cdot ${f2(R.Mz)} = ${f2(R.P)}\,\text{W}`}</M></td></tr>
            </tbody>
          </table>
        </figcaption>
      </div>
    </figure>
  );
}

