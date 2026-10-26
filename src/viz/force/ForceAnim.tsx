import { AnimFigure } from '../anim/AnimFigure';
import { StepPlayer, type AnimStep } from '../anim/StepPlayer';
import type { Lang } from '../../i18n';
import type { Scene } from '../anim/scene';
import { resultantScene } from './resultantScene';
import { reactionScene } from './reactionScene';
import './force.css';

type Build = (step: number, t: number, lang: Lang) => Scene;

/** A step-synchronised animation of a pure force scene (the CSS of the kf-* shapes comes with this file). */
export function ForceAnim({ build, steps, label }: { build: Build; steps: AnimStep[]; label: string }) {
  return (
    <StepPlayer steps={steps} label={label}>
      {(step, tt) => <AnimFigure build={build} step={step} t={tt} />}
    </StepPlayer>
  );
}

export const RESULTANT_SCENE = resultantScene;
export const REACTION_SCENE = reactionScene;
