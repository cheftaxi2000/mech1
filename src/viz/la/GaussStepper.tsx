import { useMemo } from 'react';
import { useTr } from '../../i18n';
import type { Mat } from '../../linalg/gauss';
import { traceGauss, type FrameKind } from '../../linalg/gaussTrace';
import { StepPlayer } from '../anim/StepPlayer';
import { ElimView, frameCaption } from './ElimView';

/**
 * Replays `eliminate()` (and back substitution / `reduce()`) for one fixed system, one animation step per frame.
 * `upTo` cuts the replay (e.g. stop at the echelon form); `from` starts later. Changed entries cross-fade.
 */
export function GaussStepper({ aug, from = 0, upTo, label, headCls }: { aug: Mat; from?: number; upTo?: FrameKind; label?: string; headCls?: (j: number) => string }) {
  const tr = useTr();
  const trace = useMemo(() => traceGauss(aug), [aug]);
  const frames = useMemo(() => {
    let fs = trace.frames;
    if (upTo) { const k = fs.findIndex((f) => f.kind === upTo); if (k >= 0) fs = fs.slice(0, k + 1); }
    return fs.slice(from);
  }, [trace, upTo, from]);
  const offset = from;
  const steps = frames.map((f) => ({ caption: frameCaption(f, trace), ms: 700, holdMs: 2600 }));
  return (
    <StepPlayer steps={steps} label={label ?? tr('Gauss-Verfahren Schritt für Schritt', 'Gaussian elimination step by step')}>
      {(s, t) => {
        const f = frames[Math.min(s, frames.length - 1)];
        const prev = trace.frames[offset + s - 1];
        return <div className="anim-fig ge-anim"><ElimView frame={f} prev={prev} t={t} nVars={trace.nVars} headCls={headCls} /></div>;
      }}
    </StepPlayer>
  );
}
