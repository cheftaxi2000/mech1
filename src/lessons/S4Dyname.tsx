import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { GroupMomentExplorer, GroupMomentFig } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S4Dyname() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Das Moment einer Kräftegruppe hängt vom Bezugspunkt ab. Man muss es aber nicht für jeden Punkt neu ausrechnen: Kennt man es in einem Punkt <M>O</M> und die Resultierende, folgt es in jedem anderen Punkt <M>P</M> aus einer Formel. Sie hat dieselbe Gestalt wie die <a href="#allgemein">Grundgleichung der Kinematik</a>. Das Paar aus Resultierender und Moment heisst <b>Dyname</b>.</p>}
        en={<p className="lede">The moment of a group of forces depends on the reference point. But it need not be recomputed for every point: knowing it at a point <M>O</M> and the resultant, it follows at any other point <M>P</M> from a formula. It has the same shape as the <a href="#allgemein">fundamental equation of kinematics</a>. The pair of resultant and moment is called the <b>Dyname</b>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="gruppe" title={<T de="1. Moment einer Kräftegruppe, Wechsel des Bezugspunktes" en="1. Moment of a group, change of reference point" />}>
        <Box kind="lecture" src={<Src p={40} />} title={<T de="6.5 Moment einer Kräftegruppe bezüglich eines Punktes" en={<>6.5 Moment of a group of forces about a point (<span lang="de">Moment einer Kräftegruppe</span>)</>} />}>
          <MD>{t`\{A_i \mid \v F_i\},\ i = 1, \dots, n:\qquad O:\ \v M_O = \sum_{i=1}^{n}\v{OA}_i\times\v F_i,\qquad P:\ \v M_P = \sum_{i=1}^{n}\v{PA}_i\times\v F_i,\qquad \v M_O \ne \v M_P`}</MD>
          <T de={<p>«Punktgebundener Vektor.» <M p="?">{t`\v M_O \overset{?}{\leftrightarrow} \v M_P`}</M> <M p=":">{t`\v{PA}_i = \v{PO} + \v{OA}_i`}</M></p>} en={<p>“Point-bound vector.” <M p="?">{t`\v M_O \overset{?}{\leftrightarrow} \v M_P`}</M> <M p=":">{t`\v{PA}_i = \v{PO} + \v{OA}_i`}</M></p>} />
          <MD>{t`\begin{aligned}
\v M_P &= \sum_{i=1}^{n}(\v{PO} + \v{OA}_i)\times\v F_i = \v{PO}\times\v F_1 + \v{PO}\times\v F_2 + \dots + \v{OA}_1\times\v F_1 + \v{OA}_2\times\v F_2 + \dots\\
&= \v{PO}\times\underbrace{(\v F_1 + \dots + \v F_n)}_{\v R} + \underbrace{\sum_{i=1}^{n}\v{OA}_i\times\v F_i}_{\v M_O}
\end{aligned}`}</MD>
          <MD>{t`\boxed{\ \v M_P = \v{PO}\times\v R + \v M_O = \v M_O + \v{PO}\times\v R = \v M_O + \v R\times\v{OP}\ }`}</MD>
          <T de={<p>Handschriftlich: «ähnlich zur ABBA-Formel».</p>} en={<p>Handwritten: “similar to the ABBA formula” (<span lang="de">ähnlich zur ABBA-Formel</span>).</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Rechnung.</b></p>
            <ol className="keep">
              <li>Den Weg von <M>P</M> zu jedem Angriffspunkt <M>{t`A_i`}</M> zerlegt man über <M p=":">O</M> erst von <M>P</M> nach <M>O</M> (für alle Kräfte dasselbe Stück <M p=")">{t`\v{PO}`}</M> dann von <M>O</M> nach <M p=".">{t`A_i`}</M></li>
              <li>Das Kreuzprodukt ist distributiv. Die Teile mit <M>{t`\v{PO}`}</M> kann man ausklammern: <M p=".">{t`\v{PO}\times\v F_1 + \v{PO}\times\v F_2 + \dots = \v{PO}\times\v R`}</M></li>
              <li>Die übrigen Teile sind genau die Momente bezüglich <M p=":">O</M> zusammen <M p=".">{t`\v M_O`}</M></li>
              <li>Am Schluss nur noch umgestellt: <M p=".">{t`\v{PO}\times\v R = \v R\times\v{OP}`}</M> (Zweimal das Vorzeichen gewechselt: Reihenfolge und Richtung des Vektors.)</li>
            </ol>
            <p className="keep"><b>Die «ABBA-Formel»</b> ist die <a href="#allgemein">Grundgleichung</a> <M p=".">{t`\v v_A = \v v_B + \v\omega\times\v{BA}`}</M> Vergleich: <M p=".">{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> Das Moment spielt die Rolle der Geschwindigkeit, die Resultierende die Rolle von <M p=".">{t`\v\omega`}</M> Die Resultierende ist für alle Punkte gleich, das Moment ändert sich von Punkt zu Punkt.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the calculation.</b></p>
            <ol className="keep">
              <li>The way from <M>P</M> to each point of action <M>{t`A_i`}</M> is split via <M p=":">O</M> first from <M>P</M> to <M>O</M> (the same piece <M>{t`\v{PO}`}</M> for all forces), then from <M>O</M> to <M p=".">{t`A_i`}</M></li>
              <li>The cross product is distributive. The parts with <M>{t`\v{PO}`}</M> can be factored out: <M p=".">{t`\v{PO}\times\v F_1 + \v{PO}\times\v F_2 + \dots = \v{PO}\times\v R`}</M></li>
              <li>The remaining parts are exactly the moments about <M p=",">O</M> together <M p=".">{t`\v M_O`}</M></li>
              <li>At the end only rearranged: <M p=".">{t`\v{PO}\times\v R = \v R\times\v{OP}`}</M> (The sign changed twice: order and direction of the vector.)</li>
            </ol>
            <p className="keep"><b>The “ABBA formula”</b> is the <a href="#allgemein">fundamental equation</a> <M p=".">{t`\v v_A = \v v_B + \v\omega\times\v{BA}`}</M> Compare: <M p=".">{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> The moment plays the role of the velocity, the resultant the role of <M p=".">{t`\v\omega`}</M> The resultant is the same for all points, the moment changes from point to point.</p>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Moment in P aus dem Moment in O', 'Animation: moment at P from the moment at O')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Drei Kräfte. Ihr Moment bezüglich <M>P</M> ist die Summe der einzelnen Momente <M p=".">{t`\v{PA}_i\times\v F_i`}</M></>} en={<>Three forces. Their moment about <M>P</M> is the sum of the single moments <M p=".">{t`\v{PA}_i\times\v F_i`}</M></>} /> },
            { ms: 1300, holdMs: 2800, caption: <T de={<>Jeder Weg <M>{t`\v{PA}_i`}</M> geht über <M p=":">O</M> <M p=".">{t`\v{PO} + \v{OA}_i`}</M> Das Stück <M>{t`\v{PO}`}</M> ist für alle gleich.</>} en={<>Each way <M>{t`\v{PA}_i`}</M> goes via <M p=":">O</M> <M p=".">{t`\v{PO} + \v{OA}_i`}</M> The piece <M>{t`\v{PO}`}</M> is the same for all.</>} /> },
            { ms: 1200, holdMs: 3000, caption: <T de={<>Die Teile mit <M>{t`\v{PO}`}</M> zusammen: <M p=",">{t`\v{PO}\times\v R`}</M> als ob die Resultierende (schwarz) in <M>O</M> angriffe. Die anderen Teile geben <M p=".">{t`\v M_O`}</M></>} en={<>The parts with <M>{t`\v{PO}`}</M> together: <M p=",">{t`\v{PO}\times\v R`}</M> as if the resultant (black) acted at <M p=".">O</M> The other parts give <M p=".">{t`\v M_O`}</M></>} /> },
            { ms: 700, holdMs: 3000, caption: <T de={<>Ergebnis: <M p=".">{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> Die Zahlen rechts oben bestätigen es.</>} en={<>Result: <M p=".">{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> The numbers at the top right confirm it.</>} /> },
          ]}
        >
          {(step, tt) => <GroupMomentFig step={step} t={tt} />}
        </StepPlayer>
        <GroupMomentExplorer />
        <Box kind="misconception" title={<T de="«Das Moment einer Gruppe ist überall gleich, wie die Resultierende»" en="“The moment of a group is the same everywhere, like the resultant”" />}>
          <T
            de={<p>Nur wenn <M p=",">{t`\v R = \v 0`}</M> dann fällt der Zusatz <M>{t`\v R\times\v{OP}`}</M> weg (das ist das Kräftepaar, <a href="#spezielle-kraeftegruppen">nächste Lektion</a>). Sonst ändert sich das Moment, sobald <M>P</M> die Wirkungslinie von <M>{t`\v R`}</M> durch <M>O</M> verlässt.</p>}
            en={<p>Only if <M p=",">{t`\v R = \v 0`}</M> then the extra term <M>{t`\v R\times\v{OP}`}</M> drops out (that is the couple, <a href="#spezielle-kraeftegruppen">next lesson</a>). Otherwise the moment changes as soon as <M>P</M> leaves the line of action of <M>{t`\v R`}</M> through <M p=".">O</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="dyname" title={<T de="2. Die Dyname" en="2. The Dyname" />}>
        <Box kind="lecture" src={<Src p={41} />} title={<T de="6.6 Dyname" en="6.6 Dyname" />}>
          <T
            de={<p>Für eine Kräftegruppe <M p=":">{t`\{G\}`}</M> <M p=":">{t`\v R`}</M> Resultierende, <M p=":">{t`\v M_P`}</M> Moment der Kräftegruppe bezüglich <M p=".">P</M> <M p=":">{t`\{\v R, \v M_P\}`}</M> <b>Dyname in <M>P</M></b> <M>\to</M> charakterisiert die Kräftegruppe. Leistung von <M>{t`\{G\}`}</M> bei Starrkörperbewegung:</p>}
            en={<p>For a group of forces <M p=":">{t`\{G\}`}</M> <M p=":">{t`\v R`}</M> resultant, <M p=":">{t`\v M_P`}</M> moment of the group about <M p=".">P</M> <M p=":">{t`\{\v R, \v M_P\}`}</M> <b>Dyname at <M>P</M></b> <M>\to</M> characterises the group of forces. Power of <M>{t`\{G\}`}</M> for a rigid-body motion:</p>}
          />
          <MD>{t`\begin{aligned}
&\text{${tr('berechne in $O$', 'compute at $O$')}}\colon\ P = \v v_O\cdot\v R + \v\omega\cdot\v M_O\\
&\text{${tr('berechne in $P$', 'compute at $P$')}}\colon\ P' = \v v_P\cdot\v R + \v\omega\cdot\v M_P\\[4pt]
P' &= \v v_P\cdot\v R + \v\omega\cdot\v M_P = (\v v_O + \v\omega\times\v{OP})\cdot\v R + \v\omega\cdot(\v M_O + \v R\times\v{OP})\\
&= \v v_O\cdot\v R + \v\omega\cdot\v M_O + \cancel{\v\omega\cdot(\v{OP}\times\v R)} - \cancel{\v\omega\cdot(\v{OP}\times\v R)} = P
\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum das wichtig ist.</b> Die Leistung ist eine Zahl, die nicht von unserer Wahl des Bezugspunktes abhängen darf. Die Rechnung zeigt, dass sie das auch nicht tut:</p>
            <ol className="keep">
              <li>Die Bewegung wird in <M>P</M> beschrieben: <M>{t`\v v_P = \v v_O + \v\omega\times\v{OP}`}</M> (Grundgleichung).</li>
              <li>Die Kräfte werden in <M>P</M> beschrieben: <M>{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> (Abschnitt 1).</li>
              <li>Beim Ausmultiplizieren entstehen zwei Zusatzglieder. <M>{t`(\v\omega\times\v{OP})\cdot\v R`}</M> ist ein Spatprodukt, und das darf man zyklisch vertauschen: <M p=".">{t`\v\omega\cdot(\v{OP}\times\v R)`}</M> Das andere ist <M p=",">{t`\v\omega\cdot(\v R\times\v{OP}) = -\v\omega\cdot(\v{OP}\times\v R)`}</M> also genau das Negative. Sie heben sich weg.</li>
            </ol>
            <p className="keep">Kinemate und Dyname ändern sich beide mit dem Punkt, aber ihr «Produkt» <M>{t`\v v\cdot\v R + \v\omega\cdot\v M`}</M> bleibt gleich. Darum genügt es für die Statik, die Dyname in einem einzigen, bequem gewählten Punkt zu kennen.</p>
          </>}
          en={<>
            <p className="keep"><b>Why this matters.</b> The power is a number that must not depend on our choice of reference point. The calculation shows that it does not:</p>
            <ol className="keep">
              <li>The motion is described at <M p=":">P</M> <M>{t`\v v_P = \v v_O + \v\omega\times\v{OP}`}</M> (fundamental equation).</li>
              <li>The forces are described at <M p=":">P</M> <M>{t`\v M_P = \v M_O + \v R\times\v{OP}`}</M> (section 1).</li>
              <li>Multiplying out gives two extra terms. <M>{t`(\v\omega\times\v{OP})\cdot\v R`}</M> is a triple product, which may be permuted cyclically: <M p=".">{t`\v\omega\cdot(\v{OP}\times\v R)`}</M> The other is <M p=",">{t`\v\omega\cdot(\v R\times\v{OP}) = -\v\omega\cdot(\v{OP}\times\v R)`}</M> exactly the negative. They cancel.</li>
            </ol>
            <p className="keep">Kinemate and Dyname both change with the point, but their “product” <M>{t`\v v\cdot\v R + \v\omega\cdot\v M`}</M> stays the same. That is why in statics it is enough to know the Dyname at a single, conveniently chosen point.</p>
          </>}
        />
        <Box kind="supplement" title={<T de="Kinemate und Dyname nebeneinander" en="Kinemate and Dyname side by side" />}>
          <MD>{t`\begin{array}{lll}
& \text{${tr('Kinemate (Bewegung)', 'Kinemate (motion)')}} & \text{${tr('Dyname (Kräfte)', 'Dyname (forces)')}}\\
\text{${tr('gleich für alle Punkte', 'same for all points')}} & \v\omega & \v R\\
\text{${tr('ändert sich mit dem Punkt', 'changes with the point')}} & \v v_P = \v v_O + \v\omega\times\v{OP} & \v M_P = \v M_O + \v R\times\v{OP}
\end{array}`}</MD>
          <T
            de={<p>Bei der Kinemate gibt es die <a href="#zentralachse">Zentralachse</a>, auf der <M>{t`\v v`}</M> parallel zu <M>{t`\v\omega`}</M> ist. Genauso gibt es für jede Dyname mit <M>{t`\v R \ne \v 0`}</M> eine Gerade, auf der <M>{t`\v M`}</M> parallel zu <M>{t`\v R`}</M> ist (die «Zentralachse der Kräftegruppe», nicht im Skript). Für ebene Kräftegruppen ist das Moment dort null: Die ganze Gruppe ist eine einzelne Kraft auf dieser Linie, siehe <a href="#spezielle-kraeftegruppen">Spezielle Kräftegruppen</a>. Eine <De en="Kinemate / Dyname">Dyname</De> ist also zum Rechnen dasselbe Werkzeug wie die Kinemate, nur für Kräfte.</p>}
            en={<p>For the Kinemate there is the <a href="#zentralachse">central axis</a> on which <M>{t`\v v`}</M> is parallel to <M p=".">{t`\v\omega`}</M> In the same way every Dyname with <M>{t`\v R \ne \v 0`}</M> has a line on which <M>{t`\v M`}</M> is parallel to <M>{t`\v R`}</M> (the “central axis of the group of forces”, not in the notes). For plane groups of forces the moment is zero there: the whole group is a single force on that line, see <a href="#spezielle-kraeftegruppen">Special groups of forces</a>. A Dyname is therefore the same calculating tool as the Kinemate, only for forces.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Wechsle ich den Bezugspunkt, ändert sich die Leistung»" en="“If I change the reference point, the power changes”" />}>
          <T
            de={<p>Die Leistung ist eine physikalische Grösse; sie kümmert sich nicht um unsere Wahl. Ändert sich <M>{t`\v M`}</M> beim Wechsel des Punktes, ändert sich auch <M>{t`\v v`}</M> genau so, dass die Summe gleich bleibt (Abschnitt 2).</p>}
            en={<p>The power is a physical quantity; it does not care about our choice. If <M>{t`\v M`}</M> changes with the point, <M>{t`\v v`}</M> changes in exactly the way that keeps the sum the same (section 2).</p>}
          />
        </Box>
      </Section>
    </article>
  );
}
