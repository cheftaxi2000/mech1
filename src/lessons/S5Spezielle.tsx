import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CoupleExplorer, LinkageExplorer, ParallelExplorer, SingleForceExplorer, TwoForcesFig } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S5Spezielle() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wann darf man eine Kräftegruppe durch eine einfachere ersetzen? Der Satz zur statischen Äquivalenz gibt die Antwort: wenn Resultierende und Moment gleich bleiben. Diese Lektion geht die wichtigsten Fälle durch: eine einzelne Kraft verschieben, zwei Kräfte zu einer zusammenfassen, und den Fall, in dem das nicht geht: das <b>Kräftepaar</b>.</p>}
        en={<p className="lede">When may a group of forces be replaced by a simpler one? The theorem on static equivalence gives the answer: when the resultant and the moment stay the same. This lesson goes through the most important cases: moving a single force, combining two forces into one, and the case where that is impossible: the <b>couple</b>.</p>}
      />

      <Box kind="intuition">
        <T
          de={<p>Zwei Leute tragen ein langes Brett, einer vorne, einer hinten. Wer näher an der Mitte der Last steht, trägt mehr. Die zwei Kräfte zusammen wirken wie eine einzige Kraft an einer bestimmten Stelle dazwischen. Drehst du dagegen ein Lenkrad mit beiden Händen, links hoch und rechts runter, heben sich die Kräfte auf und das Rad dreht sich trotzdem: Das lässt sich durch keine einzelne Kraft ersetzen.</p>}
          en={<p>Two people carry a long board, one at the front, one at the back. Whoever stands closer to the middle of the load carries more. Together the two forces act like a single force at a certain place between them. If instead you turn a steering wheel with both hands, up on the left and down on the right, the forces cancel and the wheel still turns: that cannot be replaced by any single force.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="einzelkraft" title={<T de="1. Eine Einzelkraft verschieben" en="1. Moving a single force" />}>
        <Box kind="lecture" src={<Src p={41} fig="Fig. 6.8, 6.9" />} title={<T de="6.7 Spezielle Kräftegruppen" en={<>6.7 Special groups of forces (<span lang="de">Spezielle Kräftegruppen</span>)</>} />}>
          <MD>{t`\{G\}\leftrightarrow\{G^*\}\ \text{${tr('statisch äquivalent?', 'statically equivalent?')}}\qquad \v R = \v R^*;\quad \v M_P = \v M_P^*`}</MD>
          <T
            de={<>
              <p>Fig. 6.8 «Äquivalente und nicht äquivalente Einzelkräfte»: <M>{t`\v F`}</M> in <M p=",">A</M> <M>{t`\v F'`}</M> in <M>{t`A'`}</M> auf derselben Linie, <M>{t`\v F''`}</M> in <M>{t`A''`}</M> auf einer parallelen Linie. <M>{t`\v F`}</M> und <M p=":">{t`\v F'`}</M> «Ja»; <M>{t`\v F`}</M> und <M p=":">{t`\v F''`}</M> «Nein»; <M>{t`\v F'`}</M> und <M p=":">{t`\v F''`}</M> «Nein». Kasten: «<M>{t`\v F_1 \leftrightarrow \v F_2`}</M> Einzelkräfte äquivalent, falls <M>{t`\v F_1 = \v F_2`}</M> und gleiche Wirkungslinie.»</p>
              <p>Fig. 6.9 «Einzelkraft am Mechanismus»: ein Gelenkviereck; <M>{t`\v F`}</M> in <M>A</M> «erbringt Leistung», dasselbe <M>{t`\v F`}</M> in <M>O</M> am festen Lager «erbringt keine Leistung». «Kann man nicht verschieben, weil nicht statisch äquivalent.»</p>
            </>}
            en={<>
              <p>Fig. 6.8 “Equivalent and non-equivalent single forces”: <M>{t`\v F`}</M> at <M p=",">A</M> <M>{t`\v F'`}</M> at <M>{t`A'`}</M> on the same line, <M>{t`\v F''`}</M> at <M>{t`A''`}</M> on a parallel line. <M>{t`\v F`}</M> and <M p=":">{t`\v F'`}</M> “yes”; <M>{t`\v F`}</M> and <M p=":">{t`\v F''`}</M> “no”; <M>{t`\v F'`}</M> and <M p=":">{t`\v F''`}</M> “no”. Box: “<M>{t`\v F_1 \leftrightarrow \v F_2`}</M> single forces are equivalent if <M>{t`\v F_1 = \v F_2`}</M> and the same line of action.”</p>
              <p>Fig. 6.9 “Single force on a mechanism”: a four-bar linkage; <M>{t`\v F`}</M> at <M>A</M> “delivers power”, the same <M>{t`\v F`}</M> at <M>O</M> on the fixed support “delivers no power”. “Cannot be moved, because not statically equivalent.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man das.</b> Zwei gleiche Kräfte haben dieselbe Resultierende. Gleiches Moment brauchen sie auch, und nach dem <a href="#moment-achse">Verschiebungssatz</a> ist das genau dann so, wenn sie auf derselben Linie liegen. Eine Kraft darf man also auf ihrer Wirkungslinie verschieben, aber nicht seitlich. Das gilt nur für <b>starre</b> Körper: Beim Mechanismus in Fig. 6.9 bewegen sich <M>O</M> und <M>A</M> nicht wie Punkte eines starren Körpers, darum ist die Leistung verschieden.</p>}
          en={<p className="keep"><b>How to read this.</b> Two equal forces have the same resultant. They also need the same moment, and by the <a href="#moment-achse">shifting theorem</a> that holds exactly when they lie on the same line. So a force may be slid along its line of action, but not sideways. This holds only for <b>rigid</b> bodies: on the mechanism of Fig. 6.9, <M>O</M> and <M>A</M> do not move like points of one rigid body, so the power differs.</p>}
        />
        <SingleForceExplorer />
        <LinkageExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="zwei-kraefte" title={<T de="2. Zwei Kräfte in einer Ebene" en="2. Two forces in a plane" />}>
        <Box kind="lecture" src={<Src p={41} fig="Fig. 6.11, 6.12" />} title={<T de="Zwei Kräfte zu einer zusammenfassen" en="Combining two forces into one" />}>
          <T
            de={<>
              <p>Fig. 6.11 «2 Kräfte mit gemeinsamem Angriffspunkt»: <M>{t`\v F_1`}</M> und <M>{t`\v F_2`}</M> in <M p=",">A</M> <M>{t`\v R`}</M> als Diagonale des Parallelogramms; ein Punkt <M p=":">B</M> <M p=".">{t`\v M_B = \cancel{\v M_A} + \v R\times\v{AB}`}</M></p>
              <p>Fig. 6.12 «2 nichtparallele Kräfte in der gleichen Ebene»: <M>{t`\v F_1`}</M> in <M p=",">{t`A_1`}</M> <M>{t`\v F_2`}</M> in <M p=";">{t`A_2`}</M> beide werden auf ihren Linien bis zum Schnittpunkt <M>S</M> verschoben («<M>{t`\v F_1`}</M> verschieben», «<M>{t`\v F_2`}</M> verschieben»), dort addiert zu <M p=".">{t`\v R`}</M> «2 ebene Kräfte auf Einzelkraft reduzierbar, falls nicht parallel.»</p>
            </>}
            en={<>
              <p>Fig. 6.11 “2 forces with a common point of action”: <M>{t`\v F_1`}</M> and <M>{t`\v F_2`}</M> at <M p=",">A</M> <M>{t`\v R`}</M> as the diagonal of the parallelogram; a point <M p=":">B</M> <M p=".">{t`\v M_B = \cancel{\v M_A} + \v R\times\v{AB}`}</M></p>
              <p>Fig. 6.12 “2 non-parallel forces in the same plane”: <M>{t`\v F_1`}</M> at <M p=",">{t`A_1`}</M> <M>{t`\v F_2`}</M> at <M p=";">{t`A_2`}</M> both are slid along their lines to the intersection <M>S</M> (“slide <M p="”,">{t`\v F_1`}</M> “slide <M p="”),">{t`\v F_2`}</M> added there to <M p=".">{t`\v R`}</M> “2 plane forces can be reduced to a single force if they are not parallel.”</p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Greifen beide Kräfte am selben Punkt an, ist ihr Moment dort null, und die Resultierende in diesem Punkt ersetzt sie vollständig. Liegen sie nur in derselben Ebene, schneiden sich ihre Wirkungslinien (falls nicht parallel). Man schiebt beide dorthin, das ist erlaubt, und hat wieder den ersten Fall.</p>}
          en={<p className="keep">If both forces act at the same point, their moment about it is zero, and the resultant at that point replaces them completely. If they only lie in the same plane, their lines of action meet (if they are not parallel). Slide both there, which is allowed, and you are back to the first case.</p>}
        />
        <StepPlayer
          label={tr('Animation: zwei Kräfte zum Schnittpunkt schieben und addieren', 'Animation: slide two forces to the intersection and add them')}
          steps={[
            { ms: 600, holdMs: 2400, caption: <T de={<>Zwei nichtparallele Kräfte in derselben Ebene. Ihre Wirkungslinien schneiden sich in <M p=".">S</M></>} en={<>Two non-parallel forces in the same plane. Their lines of action meet at <M p=".">S</M></>} /> },
            { ms: 1500, holdMs: 2600, caption: <T de={<>Beide Kräfte gleiten auf ihrer Linie nach <M p=".">S</M> Nach dem Verschiebungssatz ändert das nichts.</>} en={<>Both forces glide along their lines to <M p=".">S</M> By the shifting theorem this changes nothing.</>} /> },
            { ms: 1200, holdMs: 2800, caption: <T de={<>In <M>S</M> haben sie einen gemeinsamen Angriffspunkt: Parallelogramm, <M p=".">{t`\v R = \v F_1 + \v F_2`}</M></>} en={<>At <M>S</M> they have a common point of action: parallelogram, <M p=".">{t`\v R = \v F_1 + \v F_2`}</M></>} /> },
            { ms: 1300, holdMs: 2800, caption: <T de={<><M>{t`\v R`}</M> darf jetzt auf seiner eigenen Linie weitergleiten. Die zwei Kräfte sind auf eine Einzelkraft reduziert.</>} en={<><M>{t`\v R`}</M> may now glide on along its own line. The two forces are reduced to a single force.</>} /> },
          ]}
        >
          {(step, tt) => <TwoForcesFig step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="parallel" title={<T de="3. Parallele Kräfte und das Kräftepaar" en="3. Parallel forces and the couple" />}>
        <Box kind="lecture" src={<Src p={42} />} title={<T de="Beispiele: 2 parallele Kräfte" en="Examples: 2 parallel forces" />}>
          <T
            de={<p><b>Mit <M p=":">{t`\v R \ne \v 0`}</M></b> <M>{t`\v F_1`}</M> auf <M p=",">{t`W_1`}</M> <M>{t`\v F_2`}</M> auf <M p=",">{t`W_2`}</M> äquivalent zu <M>{t`\v R`}</M> auf <M p=".">{t`W_R`}</M> <M p=";">{t`\v R = \v F_1 + \v F_2`}</M> wo liegt <M p="?">{t`W_R`}</M></p>}
            en={<p><b>With <M p=":">{t`\v R \ne \v 0`}</M></b> <M>{t`\v F_1`}</M> on <M p=",">{t`W_1`}</M> <M>{t`\v F_2`}</M> on <M p=",">{t`W_2`}</M> equivalent to <M>{t`\v R`}</M> on <M p=".">{t`W_R`}</M> <M p=";">{t`\v R = \v F_1 + \v F_2`}</M> where is <M p="?">{t`W_R`}</M></p>}
          />
          <MD>{t`\v M_P(\v F_1, \v F_2) = \v M_P(\v R) = \v 0\quad(P\in W_R),\qquad M_{P,z}\colon\ F_1\cdot a - F_2\cdot b = 0 \ \to\ \frac{a}{b} = \frac{F_2}{F_1}`}</MD>
          <T
            de={<p><b>Mit <M p=":">{t`\v F_1 = -\v F_2`}</M></b> <M p=",">{t`\v R = \v 0`}</M> «nicht äquivalent zu Einzelkraft! ‹Kräftepaar›».</p>}
            en={<p><b>With <M p=":">{t`\v F_1 = -\v F_2`}</M></b> <M p=",">{t`\v R = \v 0`}</M> “not equivalent to a single force! ‘Couple’ (<span lang="de">Kräftepaar</span>)”.</p>}
          />
          <MD>{t`\begin{aligned}
&\text{${tr('Dyname bezüglich', 'Dyname about')}}\ O\colon\ \v R = \v 0;\quad \v M_O = \v F\times\v{AO} + (-\v F)\times\v{A'O} = \v F\times(\v{AO} - \v{A'O}) = \v F\times\v{AA'}\quad(\v{AO} = \v{AA'} + \v{A'O})\\
&\text{${tr('Dyname bezüglich', 'Dyname about')}}\ P\colon\ \v R = \v 0;\quad \v M_P = \v M_O + \cancel{\v R\times\v{OP}} = \v F\times\v{AA'} = \v{A'A}\times\v F
\end{aligned}`}</MD>
          <T de={<p>«Für alle Punkte! <M p=":">{t`\v M_P = \v F\times\v{AA'}`}</M> Moment des Kräftepaars.»</p>} en={<p>“For all points! <M p=":">{t`\v M_P = \v F\times\v{AA'}`}</M> moment of the couple.”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ol className="keep">
              <li>Für die Lage von <M>{t`\v R`}</M> wählt man den Bezugspunkt <M>P</M> auf <M p=".">{t`W_R`}</M> Dort hat <M>{t`\v R`}</M> kein Moment, also müssen sich die Momente von <M>{t`\v F_1`}</M> und <M>{t`\v F_2`}</M> aufheben: <M p=".">{t`F_1 a = F_2 b`}</M> Das ist das Hebelgesetz. <M>{t`\v R`}</M> liegt näher bei der grösseren Kraft.</li>
              <li>Zeigt <M>{t`\v F_2`}</M> entgegen, aber ist kleiner, liegt <M>{t`\v R`}</M> ausserhalb, auf der Seite der grösseren Kraft. Je ähnlicher die Beträge, desto weiter weg.</li>
              <li>Sind sie entgegengesetzt gleich, ist <M p=".">{t`\v R = \v 0`}</M> Eine Einzelkraft mit <M>{t`\v R = \v 0`}</M> ist keine Kraft, hätte also kein Moment. Das Paar dreht aber den Körper. Es ist nicht auf eine Einzelkraft reduzierbar.</li>
              <li>Weil <M p=",">{t`\v R = \v 0`}</M> fällt der Zusatz <M>{t`\v R\times\v{OP}`}</M> weg: Das Moment eines Kräftepaars ist bezüglich <b>jedes</b> Punktes gleich, <M p=",">{t`|\v M| = b\,|\v F|`}</M> mit dem Abstand <M>b</M> der beiden Linien.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ol className="keep">
              <li>For the position of <M>{t`\v R`}</M> choose the reference point <M>P</M> on <M p=".">{t`W_R`}</M> There <M>{t`\v R`}</M> has no moment, so the moments of <M>{t`\v F_1`}</M> and <M>{t`\v F_2`}</M> must cancel: <M p=".">{t`F_1 a = F_2 b`}</M> That is the law of the lever. <M>{t`\v R`}</M> lies closer to the larger force.</li>
              <li>If <M>{t`\v F_2`}</M> points the other way but is smaller, <M>{t`\v R`}</M> lies outside, on the side of the larger force. The more similar the magnitudes, the further out.</li>
              <li>If they are equal and opposite, <M p=".">{t`\v R = \v 0`}</M> A single force with <M>{t`\v R = \v 0`}</M> is no force and would have no moment. But the couple does turn the body. It cannot be reduced to a single force.</li>
              <li>Since <M p=",">{t`\v R = \v 0`}</M> the extra term <M>{t`\v R\times\v{OP}`}</M> drops out: the moment of a couple is the same about <b>every</b> point, <M p=",">{t`|\v M| = b\,|\v F|`}</M> with the distance <M>b</M> of the two lines.</li>
            </ol>
          </>}
        />
        <ParallelExplorer />
        <Box kind="lecture" src={<Src p={43} fig="Fig. 6.15–6.17" />} title={<T de="Kräftepaar" en={<>Couple (<span lang="de">Kräftepaar</span>)</>} />}>
          <T
            de={<p>Fig. 6.15: <M>{t`\v F`}</M> in <M p=",">A</M> <M>{t`-\v F`}</M> in <M p=",">{t`A'`}</M> Abstand <M p=",">b</M> <M p=".">{t`M = b\,|\v F|`}</M> Zeichen: <M>\odot</M> <M>\leftrightarrow</M> Drehpfeil gegen den Uhrzeigersinn, <M>\otimes</M> <M>\leftrightarrow</M> im Uhrzeigersinn. Fig. 6.16 «statisch äquivalente Kräftepaare»: <M p=",">{t`|\v F'| = c\,|\v F|`}</M> <M p=".">{t`b' = b/c`}</M> Fig. 6.17 «Zahnrad»: Antrieb über ein kleines Zahnrad; am grossen Rad <M>{t`\v F`}</M> in <M>A</M> und <M>{t`-\v F`}</M> im Lager <M p=",">B</M> Abstand <M p=",">b</M> Moment <M p=".">\otimes</M></p>}
            en={<p>Fig. 6.15: <M>{t`\v F`}</M> at <M p=",">A</M> <M>{t`-\v F`}</M> at <M p=",">{t`A'`}</M> distance <M p=",">b</M> <M p=".">{t`M = b\,|\v F|`}</M> Symbols: <M>\odot</M> <M>\leftrightarrow</M> counter-clockwise arrow, <M>\otimes</M> <M>\leftrightarrow</M> clockwise. Fig. 6.16 “statically equivalent couples”: <M p=",">{t`|\v F'| = c\,|\v F|`}</M> <M p=".">{t`b' = b/c`}</M> Fig. 6.17 “gear wheel” (<span lang="de">Zahnrad</span>): driven by a small gear; on the big wheel <M>{t`\v F`}</M> at <M>A</M> and <M>{t`-\v F`}</M> at the bearing <M p=",">B</M> distance <M p=",">b</M> moment <M p=".">\otimes</M></p>}
          />
        </Box>
        <T
          de={<p className="keep">Weil nur <M>{t`b\,|\v F|`}</M> und der Drehsinn zählen, darf man ein Kräftepaar in seiner Ebene beliebig verschieben und drehen, und Kraft gegen Abstand tauschen: doppelte Kraft, halber Abstand. Beim Zahnrad wirkt der Zahn mit <M>{t`\v F`}</M> am Rand, das Lager hält mit <M>{t`-\v F`}</M> dagegen. Für das Rad ist das ein reines Drehmoment <M p=".">{t`b\,|\v F|`}</M></p>}
          en={<p className="keep">Since only <M>{t`b\,|\v F|`}</M> and the sense of rotation count, a couple may be moved and turned freely in its plane, and force may be traded for distance: double force, half the distance. On the gear the tooth acts with <M>{t`\v F`}</M> at the rim and the bearing holds against it with <M p=".">{t`-\v F`}</M> For the wheel this is a pure torque <M p=".">{t`b\,|\v F|`}</M></p>}
        />
        <CoupleExplorer />
        <Box kind="misconception" title={<T de="«Ein Kräftepaar hebt sich auf, weil die Summe null ist»" en="“A couple cancels out because the sum is zero”" />}>
          <T
            de={<p>Die Summe (Resultierende) ist null, das Moment nicht. Ein Lenkrad, an dem du links hoch und rechts runter drückst, bewegt sich nicht weg, dreht sich aber. Gleichgewicht verlangt beides: <M>{t`\v R = \v 0`}</M> <b>und</b> <M p=".">{t`\v M = \v 0`}</M></p>}
            en={<p>The sum (resultant) is zero, the moment is not. A steering wheel that you push up on the left and down on the right does not move away, but it turns. Equilibrium needs both: <M>{t`\v R = \v 0`}</M> <b>and</b> <M p=".">{t`\v M = \v 0`}</M></p>}
          />
        </Box>
        <Box kind="key" title={<T de="Das Wichtigste" en="The essentials" />}>
          <T
            de={<ul><li>Eine Einzelkraft darf man nur längs ihrer Wirkungslinie verschieben, und nur am starren Körper.</li><li>Zwei nichtparallele Kräfte in einer Ebene: zum Schnittpunkt schieben, addieren, fertig. Zwei parallele Kräfte: Hebelgesetz <M p=".">{t`F_1 a = F_2 b`}</M></li><li>Entgegengesetzt gleiche parallele Kräfte bilden ein Kräftepaar: <M p=",">{t`\v R = \v 0`}</M> aber ein Moment <M>{t`b\,|\v F|`}</M> um jeden Punkt.</li></ul>}
            en={<ul><li>A single force may only be slid along its line of action, and only on a rigid body.</li><li>Two non-parallel forces in a plane: slide to the intersection, add, done. Two parallel forces: law of the lever <M p=".">{t`F_1 a = F_2 b`}</M></li><li>Equal and opposite parallel forces form a couple: <M p=",">{t`\v R = \v 0`}</M> but a moment <M>{t`b\,|\v F|`}</M> about every point.</li></ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
