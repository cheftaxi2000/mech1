import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ScrewAnim } from '../viz/anim/ScrewAnim';

export default function L13Screw() {
  const tr = useTr();
  const cap = (n: number) => <T de={`Schritt ${n}`} en={`Step ${n}`} />;
  return (
    <article className="lesson">
      <section className="section" id="a"><h2>Test</h2>
      <StepPlayer label={tr('a', 'a')} steps={[1, 2, 3, 4, 5, 6, 7].map((n) => ({ ms: n === 7 ? 10000 : 3000, holdMs: 1500, caption: cap(n) }))}>
        {(s, tt) => <ScrewAnim step={s} t={tt} />}
      </StepPlayer>
      </section>
    </article>
  );
}
