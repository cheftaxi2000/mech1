import { Derivation, Section } from '../components/Blocks';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { planeScene } from '../viz/anim/planeScene';
import { ladderScene } from '../viz/anim/ladderScene';
import { CentreDemo, WheelRays } from '../viz/PlaneFigures';

export default function L14Plane() {
  const tr = useTr();
  return (
    <article className="lesson">
      <Section id="ebene" title={<T de="1. Ebene" en="1. Plane" />}>
        <Derivation title={<T de="x" en="x" />}>
          <StepPlayer label={tr('a', 'a')} steps={[0, 1, 2, 3, 4].map((i) => ({ ms: 3000, caption: <T de={`Schritt ${i}`} en={`step ${i}`} /> }))}>
            {(step, tt) => <AnimFigure build={planeScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <CentreDemo />
        <WheelRays />
        <Derivation title={<T de="y" en="y" />}>
          <StepPlayer label={tr('a', 'a')} steps={[0, 1, 2, 3, 4, 5, 6].map((i) => ({ ms: 3000, caption: <T de={`Schritt ${i}`} en={`step ${i}`} /> }))}>
            {(step, tt) => <AnimFigure build={ladderScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
      </Section>
    </article>
  );
}
