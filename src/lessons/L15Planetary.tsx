import { Derivation, Section } from '../components/Blocks';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { planetScene } from '../viz/anim/planetScene';
import { PlanetaryGear } from '../viz/PlanetaryFigures';

export default function L15Planetary() {
  const tr = useTr();
  return (
    <article className="lesson">
      <Section id="ebene" title={<T de="1. Ebene" en="1. Plane" />}>
        <Derivation title={<T de="x" en="x" />}>
          <StepPlayer label={tr('a', 'a')} steps={[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ ms: 3000, caption: <T de={`Schritt ${i}`} en={`step ${i}`} /> }))}>
            {(step, tt) => <AnimFigure build={planetScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <PlanetaryGear />
      </Section>
    </article>
  );
}
