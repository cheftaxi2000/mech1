import { Box, Section } from '../components/Blocks';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { proofScene } from '../viz/force/K7ProofScene';
import '../viz/force/K7.css';

const t = String.raw;

export default function K7Kraeftegruppe() {
  const tr = useTr();
  const steps = Array.from({ length: 7 }, (_, i) => ({ ms: 3200, holdMs: 2500, caption: <T de={<>Schritt {i + 1}</>} en={<>Step {i + 1}</>} /> }));
  return (
    <article className="lesson">
      <Section id="beweis" title={<T de="Beweis" en="Proof" />}>
        <StepPlayer label={tr('Beweis', 'Proof')} steps={steps}>{(step, tt) => <AnimFigure build={proofScene} step={step} t={tt} />}</StepPlayer>
        <Box kind="key"><M>{t`P`}</M></Box>
      </Section>
    </article>
  );
}
