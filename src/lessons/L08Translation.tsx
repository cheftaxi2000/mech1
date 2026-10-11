import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { transScene } from '../viz/anim/transScene';
import { SliderCrank, TranslationDemo } from '../viz/TranslationFigures';

const t = String.raw;

export default function L08Translation() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die einfachste Bewegung eines starren Körpers: Er verschiebt sich, ohne sich zu drehen. Dann bewegen sich alle seine Punkte gleich – man muss nur einen einzigen Punkt kennen. Wichtig ist, was das <em>nicht</em> heisst: Translation muss nicht geradeaus gehen.</p>}
        en={<p className="lede">The simplest motion of a rigid body: it shifts without turning. Then all its points move alike – you only need to know one point. It is important what this does <em>not</em> mean: translation does not have to go straight.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an eine Gondel im Riesenrad. Sie fährt auf einem grossen Kreis – und trotzdem bleibt sie immer aufrecht, die Passagiere sitzen nie kopfüber. Die Gondel <em>dreht sich nicht</em>, sie wird nur verschoben. Das ist eine Translation, obwohl die Bahn ein Kreis ist. Eine Autotür dagegen dreht sich beim Öffnen: keine Translation.</p>}
          en={<p>Think of a gondola on a Ferris wheel. It travels on a big circle – and yet it always stays upright; the passengers are never upside down. The gondola <em>does not turn</em>, it is only shifted. That is a translation, although the path is a circle. A car door, by contrast, turns when it opens: not a translation.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="definition" title={<T de="1. Was Translation heisst" en="1. What translation means" />}>
        <Box kind="lecture" src={<Src p={13} fig="Fig. 3.4" />}>
          <T
            de={<ul>
              <li><M p=",">{t`M, N`}</M> 2 beliebige Punkte des Körpers <M p=".">{t`\to \v a = \v r_N - \v r_M`}</M></li>
              <li>Starrer Körper: Betrag von <M p=",">{t`\v a`}</M> <M p=",">{t`|\v a|`}</M> ist konstant <M p=";">{t`\forall t`}</M> Richtung von <M>{t`\v a`}</M> ist veränderlich.</li>
              <li><M>\to</M> Falls <M>{t`\v a`}</M> konstant ist in Betrag <b>und</b> Richtung <M>\to</M> Bewegungszustand ist <b>Translation</b>.</li>
            </ul>}
            en={<ul>
              <li><M p=",">{t`M, N`}</M> any 2 points of the body <M p=".">{t`\to \v a = \v r_N - \v r_M`}</M></li>
              <li>Rigid body: the magnitude of <M p=",">{t`\v a`}</M> <M p=",">{t`|\v a|`}</M> is constant <M p=";">{t`\forall t`}</M> the direction of <M>{t`\v a`}</M> can change.</li>
              <li><M>\to</M> If <M>{t`\v a`}</M> is constant in magnitude <b>and</b> direction <M>\to</M> the state of motion is <b>translation</b>.</li>
            </ul>}
          />
          <T de="Konsequenz:" en="Consequence:" />
          <MD>{t`\v a = \text{konst} \ \to\ \dot{\v a} = \v 0 = \dot{\v r}_N - \dot{\v r}_M = \v v_N - \v v_M, \qquad \v v_N = \v v_M`}</MD>
          <T de="Alle Punkte haben die gleiche Geschwindigkeit." en={<>All points have the same velocity (<span lang="de">alle Punkte haben die gleiche Geschwindigkeit</span>).</>} />
        </Box>
        <T
          de={<p><b>So liest man das:</b> Beim starren Körper ist <M>{t`\v a`}</M> immer gleich lang (Lektion 7) – er darf sich nur drehen. Die Translation ist der Sonderfall, in dem er sich auch <em>nicht</em> dreht. Dann ändert sich <M>{t`\v a`}</M> gar nicht, seine Ableitung ist null, und die Ableitung von <M>{t`\v a = \v r_N - \v r_M`}</M> ist genau die Differenz der Geschwindigkeiten. Also sind <M>{t`\v v_N`}</M> und <M>{t`\v v_M`}</M> gleich – für jedes Paar von Punkten.</p>}
          en={<p><b>How to read this:</b> for a rigid body <M>{t`\v a`}</M> is always equally long (lesson 7) – it may only turn. Translation is the special case in which it does <em>not</em> turn either. Then <M>{t`\v a`}</M> does not change at all, its derivative is zero, and the derivative of <M>{t`\v a = \v r_N - \v r_M`}</M> is exactly the difference of the velocities. So <M>{t`\v v_N`}</M> and <M>{t`\v v_M`}</M> are equal – for every pair of points.</p>}
        />
        <Derivation title={<T de="Fig. 3.4 Schritt für Schritt" en="Fig. 3.4 step by step" />}>
          <StepPlayer
            label={tr('Animation: Translation, kongruente Bahnkurven', 'Animation: translation, congruent trajectories')}
            steps={[
              { ms: 2500, holdMs: 2000, caption: <T
                de={<>Ein starrer Körper zur Zeit <M p=".">{t`t_1`}</M> Zwei Punkte <M>M</M> und <M>N</M> und der Pfeil <M>{t`\v a`}</M> von <M>M</M> nach <M p=".">N</M></>}
                en={<>A rigid body at time <M p=".">{t`t_1`}</M> Two points <M>M</M> and <M>N</M> and the arrow <M>{t`\v a`}</M> from <M>M</M> to <M p=".">N</M></>} /> },
              { ms: 4500, holdMs: 3000, caption: <T
                de={<>Der Körper bewegt sich bis zur Zeit <M p=",">t</M> ohne sich zu drehen: <M>{t`\v a`}</M> ist derselbe Pfeil. Beide Punkte haben sich um denselben Vektor verschoben, <M>{t`\v R_M(t) = \v R_N(t)`}</M> (blau).</>}
                en={<>The body moves to time <M>t</M> without turning: <M>{t`\v a`}</M> is the same arrow. Both points have shifted by the same vector, <M>{t`\v R_M(t) = \v R_N(t)`}</M> (blue).</>} /> },
              { ms: 4500, holdMs: 3000, caption: <T
                de={<>Weiter bis <M p=".">{t`t_2`}</M> Die Bahn von <M>N</M> ist dieselbe Kurve wie die Bahn von <M p=",">M</M> nur um <M>{t`\v a`}</M> verschoben. Solche Bahnen heissen <b>kongruent</b>.</>}
                en={<>On to <M p=".">{t`t_2`}</M> The path of <M>N</M> is the same curve as the path of <M p=",">M</M> only shifted by <M p=".">{t`\v a`}</M> Such paths are called <b>congruent</b>.</>} /> },
              { ms: 3000, caption: <T
                de={<>Zur Zeit <M p=":">t</M> Weil <M>{t`\v a`}</M> sich nicht ändert, ist <M p=",">{t`\dot{\v a} = \v v_N - \v v_M = \v 0`}</M> also sind die beiden roten Pfeile gleich.</>}
                en={<>At time <M p=":">t</M> since <M>{t`\v a`}</M> does not change, <M p=",">{t`\dot{\v a} = \v v_N - \v v_M = \v 0`}</M> so the two red arrows are equal.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={transScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="arten" title={<T de="2. Geradlinig, krummlinig, kreisförmig" en="2. Straight, curved, circular" />}>
        <Box kind="lecture" src={<Src p={14} />}>
          <T de={<>Alle Bahnkurven <b>kongruent</b>: geradlinige Translation oder krummlinige Translation (Figur: «Kreisförmige Translation»).</>} en={<>All trajectories <b>congruent</b>: straight-line translation or curvilinear translation (figure: “Kreisförmige Translation”, circular translation).</>} />
        </Box>
        <T
          de={<p>Die Form der Bahn ist frei – sie kann gerade, gekrümmt oder sogar ein Kreis sein. Entscheidend ist nur, dass sich der Körper dabei nicht dreht. Wähle oben im Bild die Art der Bewegung und spiele sie ab. Zum Vergleich gibt es eine Drehung: Dort dreht sich <M>{t`\v a`}</M> mit, und die Punkte sind verschieden schnell.</p>}
          en={<p>The shape of the path is free – it can be straight, curved or even a circle. All that matters is that the body does not turn. Choose the kind of motion in the figure and play it. For comparison there is a rotation: there <M>{t`\v a`}</M> turns along and the points have different speeds.</p>}
        />
        <TranslationDemo />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="momentan" title={<T de="3. Momentane Translation" en="3. Momentary translation" />}>
        <Box kind="lecture" src={<Src p={14} />}>
          <T de={<>Figur «Momentane Translation»: ein Klotz auf zwei schrägen Schienen und ein Klotz in einer Schale; an der Stelle <M>T</M> befindet er sich momentan in Translation.</>} en={<>Figure “Momentane Translation” (momentary translation): a block on two inclined rails and a block in a bowl; at the position <M>T</M> it is momentarily in translation.</>} />
        </Box>
        <T
          de={<p><b>Momentan</b> heisst: nur in einem einzigen Augenblick. In diesem Augenblick dreht sich der Körper nicht, und alle Punkte haben dieselbe Geschwindigkeit. Einen Augenblick vorher und nachher ist das nicht so. Ein klares Beispiel ist die Stange eines Kurbeltriebs (wie im Motor): Meistens verschiebt <em>und</em> dreht sie sich. Nur wenn die Kurbel genau senkrecht steht, dreht sie sich für einen Augenblick nicht.</p>}
          en={<p><b>Momentary</b> means: only at a single instant. At that instant the body does not turn, and all points have the same velocity. An instant before and after this is not the case. A clear example is the rod of a slider crank (as in an engine): mostly it shifts <em>and</em> turns. Only when the crank stands exactly vertical does it not turn for an instant.</p>}
        />
        <SliderCrank />
        <details className="more">
          <summary><T de="Genauer hingeschaut: der Klotz in der Schale" en="A closer look: the block in the bowl" /></summary>
          <T
            de={<p>Folgt der Klotz der runden Schale und kippt dabei mit (wie in der Figur), dreht er sich um den Mittelpunkt der Schale. Streng genommen sind dann auch am tiefsten Punkt <M>T</M> seine Punkte verschieden schnell: die oberen, näher am Mittelpunkt, langsamer – im Verhältnis <M>{t`(R-h)/R`}</M> (Radius <M p=",">R</M> Höhe des Klotzes <M p=").">h</M> Gleich sind dort die <em>Richtungen</em> (alle waagrecht). Als momentane Translation kann man das nur lesen, wenn der Klotz klein gegenüber der Schale ist. Das Beispiel mit der Kurbel oben ist exakt.</p>}
            en={<p>If the block follows the round bowl and tilts with it (as in the figure), it turns about the centre of the bowl. Strictly speaking its points then have different speeds even at the lowest point <M p=":">T</M> the upper ones, nearer the centre, are slower – in the ratio <M>{t`(R-h)/R`}</M> (radius <M p=",">R</M> block height <M p=").">h</M> What is equal there are the <em>directions</em> (all horizontal). It can be read as a momentary translation only if the block is small compared with the bowl. The crank example above is exact.</p>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Häufige Missverständnisse" en="4. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Translation heisst geradeaus.»" en="“Translation means straight ahead.”" />}>
          <T de={<>Nein. Die Bahn darf jede Form haben, auch ein Kreis (Riesenrad-Gondel). Translation heisst nur: <M>{t`\v a`}</M> ändert seine Richtung nicht, der Körper dreht sich nicht.</>} en={<>No. The path may have any shape, even a circle (Ferris-wheel gondola). Translation only means: <M>{t`\v a`}</M> does not change direction, the body does not turn.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Wenn sich Punkte im Kreis bewegen, dreht sich der Körper.»" en="“If points move on circles, the body is rotating.”" />}>
          <T de={<>Nicht unbedingt. Bei der kreisförmigen Translation fährt jeder Punkt einen Kreis – aber alle Kreise sind gleich gross und haben <em>verschiedene</em> Mittelpunkte. Bei einer Drehung haben alle Kreise <em>denselben</em> Mittelpunkt auf der Achse und verschiedene Radien. Vergleiche im Bild in Abschnitt 2 «kreisförmig» mit «Vergleich: Drehung».</>} en={<>Not necessarily. In circular translation every point travels on a circle – but all circles are the same size and have <em>different</em> centres. In a rotation all circles share the <em>same</em> centre on the axis and have different radii. Compare “circular” with “compare: rotation” in the figure of section 2.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Momentane Translation ist dasselbe wie Translation.»" en="“Momentary translation is the same as translation.”" />}>
          <T de={<>Nein, nur für einen Augenblick sind alle Geschwindigkeiten gleich. Kurz danach dreht sich der Körper wieder (im Bild: drehe die Kurbel ein paar Grad weiter).</>} en={<>No, all velocities are equal only for an instant. Shortly afterwards the body turns again (in the figure: turn the crank a few degrees further).</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <MD>{t`\text{Translation: } \v a = \v r_N - \v r_M = \text{konst. (Betrag und Richtung)} \ \Rightarrow\ \v v_N = \v v_M \ \text{für alle Punkte}`}</MD>
          <T de="Alle Bahnen sind kongruent (verschobene Kopien) – gerade, gekrümmt oder kreisförmig." en="All paths are congruent (shifted copies) – straight, curved or circular." />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Das «Beispiel Würfel» auf S. 14 ist im Skript leer. Als Nächstes kommt das Gegenstück zur Translation: die <b>Rotation</b> um eine feste Achse <Src p={15} />.</p>}
          en={<p className="connections"><b>Next:</b> the “Beispiel Würfel” (cube example) on p. 14 is empty in the notes. Next comes the counterpart of translation: <b>rotation</b> about a fixed axis <Src p={15} />.</p>}
        />
      </Section>
    </article>
  );
}
