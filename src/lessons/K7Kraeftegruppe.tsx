import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useLang, useTr } from '../i18n';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { GroupPowerExplorer } from '../viz/force/K7Figures';
import { LadderExplorer } from '../viz/force/K7LadderFigure';
import { LH, LW } from '../viz/force/K7LadderScene';
import { ladderSolScene } from '../viz/force/K7LadderSolScene';
import { proofScene } from '../viz/force/K7ProofScene';
import { SceneView } from '../viz/force/K7Svg';
import '../viz/force/K7.css';

const t = String.raw;

export default function K7Kraeftegruppe() {
  const tr = useTr(), lang = useLang();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher hat <a href="#leistung">eine einzelne Kraft</a> einen einzelnen Punkt angeschoben. Jetzt greifen <b>mehrere Kräfte an verschiedenen Stellen</b> eines Körpers an, und der Körper bewegt und dreht sich. Das Skript zeigt: Die ganze Leistung steckt in zwei Produkten, <M>{t`\v R\cdot\v v_B`}</M> und <M p=".">{t`\v M_B\cdot\v\omega`}</M> Links stehen die Kräfte, rechts steht die Bewegung.</p>}
        en={<p className="lede">So far <a href="#leistung">a single force</a> has pushed a single point. Now <b>several forces act at different places</b> on a body, and the body moves and turns. The notes show: the whole power sits in two products, <M>{t`\v R\cdot\v v_B`}</M> and <M p=".">{t`\v M_B\cdot\v\omega`}</M> The forces stand on the left, the motion on the right.</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Du schraubst den Deckel eines Konfitürenglases auf. Du ziehst ihn ein wenig nach oben und drehst ihn zugleich. Jeder Finger drückt an einer anderen Stelle, und jede Stelle des Deckels bewegt sich anders: Der Rand läuft im Kreis, die Mitte fährt nur nach oben.</p>
            <p>Man könnte jeden Finger einzeln rechnen: seine Kraft mal die Geschwindigkeit <i>seiner</i> Stelle. Das ist mühsam. Aber der Deckel ist <b>starr</b>. Darum reichen zwei Angaben, um die Bewegung aller Stellen zu kennen: wie schnell sich ein Bezugspunkt bewegt und wie schnell sich der Deckel dreht. Genauso lassen sich alle Finger zu zwei Angaben zusammenfassen: wie stark sie <i>insgesamt</i> ziehen und wie stark sie <i>insgesamt</i> drehen.</p>
            <p>Dann ist die Leistung: gesamter Zug mal Hubgeschwindigkeit plus gesamte Drehwirkung mal Drehgeschwindigkeit. Zwei einfache Produkte statt vieler.</p>
          </>}
          en={<>
            <p>You unscrew the lid of a jam jar. You pull it up a little and turn it at the same time. Every finger presses at a different place, and every place on the lid moves differently: the rim runs in a circle, the middle only goes up.</p>
            <p>You could work out each finger on its own: its force times the velocity of <i>its</i> place. That is tedious. But the lid is <b>rigid</b>. So two pieces of information are enough to know the motion of every place: how fast one reference point moves and how fast the lid turns. In the same way all fingers can be packed into two pieces of information: how hard they pull <i>in total</i> and how hard they turn <i>in total</i>.</p>
            <p>Then the power is: total pull times lifting speed plus total turning effect times turning speed. Two simple products instead of many.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="skript" title={<T de="1. Was das Skript sagt" en="1. What the notes say" />}>
        <Box kind="lecture" src={<Src p={34} />} title={<T de="Mehrere Kräfte am System" en={<>Several forces on a system (<span lang="de">Mehrere Kräfte am System</span>)</>} />}>
          <T
            de={<p><b>Leistung einer Kräftegruppe:</b> die Leistungen addieren sich. Greifen alle Kräfte am selben Punkt <M>A</M> an, gilt <M p=",">{t`P = \v R\cdot\v v_A`}</M> greifen sie an verschiedenen Punkten an, muss man jede mit ihrer eigenen Geschwindigkeit multiplizieren. Für <b>starre Körper</b> ist es einfacher:</p>}
            en={<p><b>Power of a group of forces</b> (<span lang="de">Leistung einer Kräftegruppe</span>)<b>:</b> the powers add. If all forces act at the same point <M p=",">A</M> then <M p=";">{t`P = \v R\cdot\v v_A`}</M> if they act at different points, each one must be multiplied by its own velocity. For <b>rigid bodies</b> (<span lang="de">starre Körper</span>) it is simpler:</p>}
          />
          <MD>{t`\begin{aligned}
&P(\v F_1, \v F_2, \dots, \v F_n) = P(\v F_1) + P(\v F_2) + \dots + P(\v F_n)\\[4pt]
&\{A \mid \v F_i\}\ \to\ P = \v F_1\cdot\v v_A + \v F_2\cdot\v v_A + \dots + \v F_n\cdot\v v_A\\
&\qquad\qquad\ = \Big(\underbrace{\textstyle\sum_{i=1}^{n}\v F_i}_{\v R}\Big)\cdot\v v_A = \v R\cdot\v v_A\\[4pt]
&\{A_i \mid \v F_i\}\ \to\ P = \v F_1\cdot\v v_1 + \v F_2\cdot\v v_2 + \dots + \v F_n\cdot\v v_n
\end{aligned}`}</MD>
          <MD>{t`\boxed{\ P = \v R\cdot\v v_B + \v M_B\cdot\v\omega\ }`}</MD>
          <T
            de={<>
              <p>Handschriftlich: <M>{t`\v R`}</M> = «Resultierende der Kräftegruppe», <M>{t`\v M_B`}</M> = «Moment der Kräftegruppe bezüglich <M p="»">B</M></p>
              <p><b>Leistung berechnen:</b> (1) starrer Körper <M p=",">K</M> (2) Kinemate in <M p=":">B</M> <M p=",">{t`\{\v v_B, \v\omega\}`}</M> (3) Kräftegruppe <M p=".">{t`\{A_i, \v F_i\}`}</M> Dann</p>
            </>}
            en={<>
              <p>Handwritten: <M>{t`\v R`}</M> = “resultant of the group of forces” (<span lang="de">Resultierende der Kräftegruppe</span>), <M>{t`\v M_B`}</M> = “moment of the group of forces about <M p="”">B</M> (<span lang="de">Moment der Kräftegruppe bezüglich</span> <M p=")">B</M></p>
              <p><b>Computing the power</b> (<span lang="de">Leistung berechnen</span>)<b>:</b> (1) rigid body <M p=",">K</M> (2) Kinemate at <M p=":">B</M> <M p=",">{t`\{\v v_B, \v\omega\}`}</M> (3) group of forces <M p=".">{t`\{A_i, \v F_i\}`}</M> Then</p>
            </>}
          />
          <MD>{t`\to\ P = \v R\cdot\v v_B + \v M_B\cdot\v\omega,\qquad \v R = \sum_{i=1}^{n}\v F_i,\qquad \v M_B = \sum_{i=1}^{n}\big(\v{BA}_i\times\v F_i\big)`}</MD>
          <T
            de={<p><M>{t`\v R`}</M> heisst «Resultierende der Kräftegruppe», <M>{t`\v M_B`}</M> «Moment der Kräftegruppe bez. <M p="».">B</M></p>}
            en={<p><M>{t`\v R`}</M> is the “resultant of the group of forces”, <M>{t`\v M_B`}</M> the “moment of the group of forces about <M p="”.">B</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Skript:</b></p>
            <ol>
              <li><M>{t`P(\v F_1, \dots, \v F_n) = \sum P(\v F_i)`}</M> sagt: Die Leistungen mehrerer Kräfte addiert man, wie die Leistungen zweier Motoren, die zusammen ziehen.</li>
              <li>Greifen alle Kräfte am <b>selben Punkt</b> <M>A</M> an, haben sie alle dieselbe Geschwindigkeit <M p=".">{t`\v v_A`}</M> Dann darf man <M>{t`\v v_A`}</M> ausklammern, denn das Skalarprodukt ist in jedem Faktor additiv (<a href="#vektoren">S. 5</a>). Die Summe der Kräfte in der Klammer ist die <a href="#kraft">Resultierende</a> <M p=".">{t`\v R = \sum\v F_i`}</M> Mehrere Kräfte an einem Punkt wirken also wie eine einzige.</li>
              <li>Greifen sie an <b>verschiedenen Punkten</b> <M>{t`A_i`}</M> an, hat jede Kraft ihren eigenen Punkt und damit ihre eigene Geschwindigkeit <M p=".">{t`\v v_i`}</M> Ausklammern geht nicht mehr. Man bräuchte alle <M>n</M> Geschwindigkeiten.</li>
              <li>Bei einem <b>starren Körper</b> sind die Geschwindigkeiten aber nicht frei: Sie hängen über die <a href="#allgemein">Grundgleichung</a> <M>{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> zusammen. Es genügt die <De en="pair of velocity of B and angular velocity">Kinemate</De> <M>{t`\{\v v_B, \v\omega\}`}</M> in einem Punkt <M p=",">B</M> siehe <a href="#zentralachse">Kinemate</a>.</li>
              <li>Setzt man das ein, bleibt der eingerahmte Kasten übrig. Warum, zeigt der nächste Abschnitt.</li>
            </ol>
            <p><b>Was die Symbole sind:</b></p>
            <ul>
              <li><M>{t`\v R = \sum\v F_i`}</M> in N: alle Kraftpfeile zu einem Pfeil addiert (<a href="#kraft">Lektion Kraft</a>, S. 29). Er hängt nicht von <M>B</M> ab.</li>
              <li><M>{t`\v M_B = \sum\v{BA}_i\times\v F_i`}</M> in N·m: die <a href="#leistung-rotation">Momente</a> aller Kräfte um <M>B</M> zusammengezählt, <M>{t`\v M_{B,i} = \v{BA}_i\times\v F_i`}</M> ist das Moment der <M>i</M>-ten Kraft.</li>
              <li><M>{t`\v v_B`}</M> in m/s und <M>{t`\v\omega`}</M> in 1/s: die Bewegung des Körpers, beschrieben im Punkt <M p=".">B</M></li>
              <li>Beide Produkte haben die Einheit Watt: <M>{t`\mathrm{N}\cdot\mathrm{m/s} = \mathrm{W}`}</M> und <M p=".">{t`(\mathrm{N\,m})\cdot(1/\mathrm{s}) = \mathrm{W}`}</M> Kräfte werden nur mit Geschwindigkeiten multipliziert, Momente nur mit Winkelgeschwindigkeiten.</li>
            </ul>
          </>}
          en={<>
            <p><b>How to read the notes:</b></p>
            <ol>
              <li><M>{t`P(\v F_1, \dots, \v F_n) = \sum P(\v F_i)`}</M> says: you add the powers of several forces, like the powers of two engines pulling together.</li>
              <li>If all forces act at the <b>same point</b> <M p=",">A</M> they all have the same velocity <M p=".">{t`\v v_A`}</M> Then <M>{t`\v v_A`}</M> can be factored out, because the dot product is additive in each factor (<a href="#vektoren">p. 5</a>). The sum of the forces in the bracket is the <a href="#kraft">resultant</a> <M p=".">{t`\v R = \sum\v F_i`}</M> Several forces at one point therefore act like a single one.</li>
              <li>If they act at <b>different points</b> <M p=",">{t`A_i`}</M> each force has its own point and therefore its own velocity <M p=".">{t`\v v_i`}</M> Factoring out no longer works. You would need all <M>n</M> velocities.</li>
              <li>For a <b>rigid body</b> the velocities are not free, though: they are tied together by the <a href="#allgemein">fundamental equation</a> <M p=".">{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> The <De en="pair of velocity of B and angular velocity">Kinemate</De> <M>{t`\{\v v_B, \v\omega\}`}</M> at one point <M>B</M> is enough, see <a href="#zentralachse">Kinemate</a>.</li>
              <li>Insert this and the boxed formula is what remains. The next section shows why.</li>
            </ol>
            <p><b>What the symbols are:</b></p>
            <ul>
              <li><M>{t`\v R = \sum\v F_i`}</M> in N: all force arrows added into one arrow (<a href="#kraft">lesson on force</a>, p. 29). It does not depend on <M p=".">B</M></li>
              <li><M>{t`\v M_B = \sum\v{BA}_i\times\v F_i`}</M> in N·m: the <a href="#leistung-rotation">moments</a> of all forces about <M>B</M> added up, <M>{t`\v M_{B,i} = \v{BA}_i\times\v F_i`}</M> is the moment of the <M>i</M>-th force.</li>
              <li><M>{t`\v v_B`}</M> in m/s and <M>{t`\v\omega`}</M> in 1/s: the motion of the body, described at the point <M p=".">B</M></li>
              <li>Both products have the unit watt: <M>{t`\mathrm{N}\cdot\mathrm{m/s} = \mathrm{W}`}</M> and <M p=".">{t`(\mathrm{N\,m})\cdot(1/\mathrm{s}) = \mathrm{W}`}</M> Forces are only multiplied with velocities, moments only with angular velocities.</li>
            </ul>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="beweis" title={<T de="2. Warum stimmt das? Der Beweis" en="2. Why is it true? The proof" />}>
        <Box kind="lecture" src={<Src p={35} />} title={<T de="Beispiel: 2 Kräfte in B" en={<>Example: 2 forces (<span lang="de">2 Kräfte in B</span>)</>} />}>
          <T
            de={<p>Figur: ein starrer Körper mit dem Punkt <M p=",">B</M> der Geschwindigkeit <M>{t`\v v_B`}</M> und <M>{t`\v\omega`}</M> (grün) und zwei Kräften <M>{t`\v F_1`}</M> in <M>{t`A_1`}</M> und <M>{t`\v F_2`}</M> in <M p=".">{t`A_2`}</M> Handschriftlich:</p>}
            en={<p>Figure: a rigid body with the point <M p=",">B</M> the velocity <M>{t`\v v_B`}</M> and <M>{t`\v\omega`}</M> (green) and two forces <M>{t`\v F_1`}</M> at <M>{t`A_1`}</M> and <M>{t`\v F_2`}</M> at <M p=".">{t`A_2`}</M> Handwritten:</p>}
          />
          <MD>{t`\begin{aligned}
&\text{${tr('in $B$ bekannt', 'known in $B$')}}\colon\ \v v_B,\ \v\omega\\
&\v v_1 = \v v_B + \v\omega\times\v{BA}_1\\
&\v v_2 = \v v_B + \v\omega\times\v{BA}_2\\[4pt]
&P = \v F_1\cdot\v v_1 + \v F_2\cdot\v v_2\\
&\ \ = \v F_1\cdot\v v_B + \v F_1\cdot(\v\omega\times\v{BA}_1) + \v F_2\cdot\v v_B + \v F_2\cdot(\v\omega\times\v{BA}_2)\\
&\qquad\big[\,\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)\,\big]\\[4pt]
&\ \ = \underbrace{(\v F_1 + \v F_2)}_{\v R}\cdot\v v_B + \v\omega\cdot\underbrace{(\v{BA}_1\times\v F_1)}_{\v M_{B,1}} + \v\omega\cdot\underbrace{(\v{BA}_2\times\v F_2)}_{\v M_{B,2}}\\[4pt]
&\ \ = \v R\cdot\v v_B + \v\omega\cdot\v M_B\qquad \text{q.e.d.}
\end{aligned}`}</MD>
        </Box>
        <T
          de={<p>Die Animation zeigt dieselbe Rechnung Zeile für Zeile an einer ebenen Platte. Die Drehachse steht senkrecht auf der Zeichnung (<M>{t`\v\omega`}</M> zeigt aus dem Bild heraus, das ist die <M>⊙</M>-Schreibweise des Skripts auf S. 35). Das ist ein Sonderfall der allgemeinen Figur im Skript, aber jede Zeile der Rechnung bleibt genau gleich. Die Zahlen sind frei gewählt (Einheiten m, N, m/s, 1/s): <M>{t`\v F_1 = (0{,}5;\,-1)`}</M> in <M p=",">{t`A_1 = (-1{,}5;\,-1)`}</M> <M>{t`\v F_2 = (2;\,1)`}</M> in <M p=",">{t`A_2 = (2;\,0{,}5)`}</M> <M p=",">{t`\v v_B = (1;\,-0{,}5)`}</M> <M p=".">{t`\omega = 1`}</M></p>}
          en={<p>The animation shows the same calculation line by line on a flat plate. The axis of rotation is perpendicular to the drawing (<M>{t`\v\omega`}</M> points out of the page, the <M>⊙</M> notation of the notes on p. 35). This is a special case of the general figure in the notes, but every line of the calculation stays exactly the same. The numbers are freely chosen (units m, N, m/s, 1/s): <M>{t`\v F_1 = (0.5,\,-1)`}</M> at <M p=",">{t`A_1 = (-1.5,\,-1)`}</M> <M>{t`\v F_2 = (2,\,1)`}</M> at <M p=",">{t`A_2 = (2,\,0.5)`}</M> <M p=",">{t`\v v_B = (1,\,-0.5)`}</M> <M p=".">{t`\omega = 1`}</M></p>}
        />
        <Derivation title={<T de={<>Von <M>{t`\sum \v F_i\cdot\v v_i`}</M> zu <M>{t`\v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M></>} en={<>From <M>{t`\sum \v F_i\cdot\v v_i`}</M> to <M>{t`\v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Beweis von P = R·v_B + M_B·omega', 'Animation: proof of P = R·v_B + M_B·omega')}
            steps={[
              { ms: 3500, holdMs: 3000, caption: <T
                de={<>Eine Platte mit zwei Kräften <M>{t`\v F_1`}</M> in <M>{t`A_1`}</M> und <M>{t`\v F_2`}</M> in <M p=".">{t`A_2`}</M> In <M>B</M> kennt man <M>{t`\v v_B`}</M> (rosa) und <M>{t`\v\omega`}</M> (violett, <M>⊙</M> heisst: aus dem Bild heraus). Das ist die Kinemate in <M p=".">B</M></>}
                en={<>A plate with two forces <M>{t`\v F_1`}</M> at <M>{t`A_1`}</M> and <M>{t`\v F_2`}</M> at <M p=".">{t`A_2`}</M> At <M>B</M> we know <M>{t`\v v_B`}</M> (rose) and <M>{t`\v\omega`}</M> (purple, <M>⊙</M> means: out of the page). That is the Kinemate at <M p=".">B</M></>} /> },
              { ms: 4000, holdMs: 3500, caption: <T
                de={<>An jedem Punkt <M>{t`A_i`}</M> wird <M>{t`\v v_B`}</M> kopiert (rosa), dann kommt der Drehteil <M>{t`\v\omega\times\v{BA}_i`}</M> dazu (violett, senkrecht zu <M p=")">{t`\v{BA}_i`}</M> Beides zusammen ist die Geschwindigkeit <M>{t`\v v_i`}</M> des Punktes. So sagt es die Grundgleichung.</>}
                en={<>At each point <M>{t`A_i`}</M> a copy of <M>{t`\v v_B`}</M> is placed (rose), then the turning part <M>{t`\v\omega\times\v{BA}_i`}</M> is added (purple, perpendicular to <M p=")">{t`\v{BA}_i`}</M> Together they are the velocity <M>{t`\v v_i`}</M> of the point. That is what the fundamental equation says.</>} /> },
              { ms: 4000, holdMs: 3500, caption: <T
                de={<>Jede Kraft hat ihre Leistung <M p=".">{t`P_i = \v F_i\cdot\v v_i`}</M> Das ist die Länge von <M>{t`\v F_i`}</M> mal der Schatten von <M>{t`\v v_i`}</M> auf die Gerade der Kraft (grauer Streifen). Rechts liegen <M>{t`P_1`}</M> und <M>{t`P_2`}</M> übereinander: <M p=".">{t`P = P_1 + P_2`}</M></>}
                en={<>Each force has its power <M p=".">{t`P_i = \v F_i\cdot\v v_i`}</M> That is the length of <M>{t`\v F_i`}</M> times the shadow of <M>{t`\v v_i`}</M> on the line of the force (grey strip). On the right <M>{t`P_1`}</M> and <M>{t`P_2`}</M> are stacked: <M p=".">{t`P = P_1 + P_2`}</M></>} /> },
              { ms: 4500, holdMs: 4000, caption: <T
                de={<>Setzt man <M>{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> ein, zerfällt auch der Schatten: rosa vom Verschiebungsteil, violett vom Drehteil. Jeder Balken wird zu zwei Stücken. Das ist erlaubt, weil das Skalarprodukt additiv ist: Der Schatten einer Summe ist die Summe der Schatten.</>}
                en={<>Insert <M>{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> and the shadow splits as well: rose from the translation part, purple from the rotation part. Each bar becomes two pieces. This is allowed because the dot product is additive: the shadow of a sum is the sum of the shadows.</>} /> },
              { ms: 4500, holdMs: 4000, caption: <T
                de={<>Die rosa Stücke gehören zusammen: <M>{t`\v F_1\cdot\v v_B + \v F_2\cdot\v v_B`}</M> kann man zu <M>{t`(\v F_1 + \v F_2)\cdot\v v_B`}</M> zusammenfassen, denn beide Kräfte werden mit demselben <M>{t`\v v_B`}</M> multipliziert. Die Klammer ist <M p=".">{t`\v R`}</M> Die Stücke wandern in den rechten Balken: <M p=".">{t`\v R\cdot\v v_B`}</M></>}
                en={<>The rose pieces belong together: <M>{t`\v F_1\cdot\v v_B + \v F_2\cdot\v v_B`}</M> can be combined to <M p=",">{t`(\v F_1 + \v F_2)\cdot\v v_B`}</M> because both forces are multiplied with the same <M p=".">{t`\v v_B`}</M> The bracket is <M p=".">{t`\v R`}</M> The pieces move into the right bar: <M p=".">{t`\v R\cdot\v v_B`}</M></>} /> },
              { ms: 5000, holdMs: 4500, caption: <T
                de={<>Die violetten Stücke: <M>{t`\v F_i\cdot(\v\omega\times\v{BA}_i)`}</M> ist dasselbe wie <M p=",">{t`\v\omega\cdot(\v{BA}_i\times\v F_i)`}</M> nach der Regel <M>{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> (dasselbe Spatvolumen). <M>{t`\v{BA}_i\times\v F_i`}</M> ist das Moment <M>{t`M_i`}</M> der Kraft um <M p=".">B</M> Die Momente ergeben zusammen <M p=",">{t`\v M_B`}</M> die violetten Stücke bilden <M p=".">{t`\v M_B\cdot\v\omega`}</M></>}
                en={<>The purple pieces: <M>{t`\v F_i\cdot(\v\omega\times\v{BA}_i)`}</M> is the same as <M p=",">{t`\v\omega\cdot(\v{BA}_i\times\v F_i)`}</M> by the rule <M>{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> (the same parallelepiped volume). <M>{t`\v{BA}_i\times\v F_i`}</M> is the moment <M>{t`M_i`}</M> of the force about <M p=".">B</M> Together the moments give <M p=",">{t`\v M_B`}</M> and the purple pieces form <M p=".">{t`\v M_B\cdot\v\omega`}</M></>} /> },
              { ms: 4000, caption: <T
                de={<>Beide Balken sind gleich hoch: <M p=".">{t`P = \v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M> Links wurde jede Kraft einzeln gerechnet, rechts sind es nur noch zwei Produkte. Im Beispiel <M p=".">{t`P = 5{,}5\,\mathrm{W}`}</M></>}
                en={<>Both bars are equally high: <M p=".">{t`P = \v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M> On the left each force was worked out on its own, on the right there are only two products. In the example <M p=".">{t`P = 5.5\,\mathrm{W}`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={proofScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>So liest man den Beweis:</b></p>
            <ol>
              <li>«in <M>B</M> bekannt: <M>{t`\v v_B, \v\omega`}</M>» – das ist die Voraussetzung: Von diesem Körper kennt man die Kinemate in einem Punkt.</li>
              <li><M>{t`\v v_1 = \v v_B + \v\omega\times\v{BA}_1`}</M> und dasselbe für Punkt 2: Das ist die Grundgleichung für einen starren Körper (<a href="#allgemein">S. 22</a>). Sie gilt für jeden Punkt des Körpers, auch für <M>{t`A_1`}</M> und <M p=".">{t`A_2`}</M></li>
              <li><M p=":">{t`P = \v F_1\cdot\v v_1 + \v F_2\cdot\v v_2`}</M> die Leistung der Kräftegruppe an verschiedenen Punkten, jede Kraft mit der Geschwindigkeit ihres eigenen Punktes (S. 34).</li>
              <li>Jetzt wird <M>{t`\v v_i`}</M> eingesetzt, und jedes Skalarprodukt in zwei zerlegt. Das darf man, weil <M>{t`\v a\cdot(\v b + \v c) = \v a\cdot\v b + \v a\cdot\v c`}</M> gilt.</li>
              <li>Die rote Randnotiz <M>{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> ist die Regel vom Spatprodukt (<a href="#vektoren">S. 5</a>, <a href="#leistung-rotation">letzte Lektion</a>): Dreht man die Reihenfolge der drei Vektoren zyklisch, bleibt das Volumen des Spats gleich. Mit <M p=",">{t`\v a = \v F_i`}</M> <M p=",">{t`\v b = \v\omega`}</M> <M>{t`\v c = \v{BA}_i`}</M> steht dort genau der Wechsel von <M>{t`\v F_i\cdot(\v\omega\times\v{BA}_i)`}</M> zu <M p=".">{t`\v\omega\cdot(\v{BA}_i\times\v F_i)`}</M></li>
              <li>Jetzt stehen links alle Kräfte mit demselben <M p=",">{t`\v v_B`}</M> rechts alle mit demselben <M p=".">{t`\v\omega`}</M> Beides darf man ausklammern: <M>{t`(\v F_1 + \v F_2)\cdot\v v_B`}</M> und <M p=".">{t`\v\omega\cdot(\v M_{B,1} + \v M_{B,2})`}</M> Die Unterklammern im Skript zeigen: erste Klammer = <M p=",">{t`\v R`}</M> die zweite und dritte sind die Momente der beiden Kräfte, ihre Summe ist <M p=".">{t`\v M_B`}</M></li>
              <li><M p=",">{t`P = \v R\cdot\v v_B + \v\omega\cdot\v M_B`}</M> q.e.d. (<i>quod erat demonstrandum</i>, «was zu zeigen war»).</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the proof:</b></p>
            <ol>
              <li>“known in <M p=":">B</M> <M>{t`\v v_B, \v\omega`}</M>” – this is the assumption: of this body we know the Kinemate at one point.</li>
              <li><M>{t`\v v_1 = \v v_B + \v\omega\times\v{BA}_1`}</M> and the same for point 2: this is the fundamental equation for a rigid body (<a href="#allgemein">p. 22</a>). It holds for every point of the body, also for <M>{t`A_1`}</M> and <M p=".">{t`A_2`}</M></li>
              <li><M p=":">{t`P = \v F_1\cdot\v v_1 + \v F_2\cdot\v v_2`}</M> the power of a group of forces at different points, each force with the velocity of its own point (p. 34).</li>
              <li>Now <M>{t`\v v_i`}</M> is inserted and each dot product is split in two. This is allowed because <M>{t`\v a\cdot(\v b + \v c) = \v a\cdot\v b + \v a\cdot\v c`}</M> holds.</li>
              <li>The red margin note <M>{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> is the rule for the scalar triple product (<a href="#vektoren">p. 5</a>, <a href="#leistung-rotation">previous lesson</a>): if you rotate the order of the three vectors cyclically, the volume of the parallelepiped stays the same. With <M p=",">{t`\v a = \v F_i`}</M> <M p=",">{t`\v b = \v\omega`}</M> <M>{t`\v c = \v{BA}_i`}</M> this is exactly the step from <M>{t`\v F_i\cdot(\v\omega\times\v{BA}_i)`}</M> to <M p=".">{t`\v\omega\cdot(\v{BA}_i\times\v F_i)`}</M></li>
              <li>Now on the left all forces are multiplied with the same <M p=",">{t`\v v_B`}</M> on the right all with the same <M p=".">{t`\v\omega`}</M> Both can be factored out: <M>{t`(\v F_1 + \v F_2)\cdot\v v_B`}</M> and <M p=".">{t`\v\omega\cdot(\v M_{B,1} + \v M_{B,2})`}</M> The braces in the notes show: the first bracket is <M p=",">{t`\v R`}</M> the second and third are the moments of the two forces, their sum is <M p=".">{t`\v M_B`}</M></li>
              <li><M p=",">{t`P = \v R\cdot\v v_B + \v\omega\cdot\v M_B`}</M> q.e.d. (<i>quod erat demonstrandum</i>, “which was to be shown”).</li>
            </ol>
          </>}
        />
        <details className="more">
          <summary>{tr('Die Spatprodukt-Regel in der Ebene nachrechnen', 'Checking the triple-product rule in the plane')}</summary>
          <T
            de={<>
              <p>In der Ebene ist <M>{t`\v\omega = \omega\,\e z`}</M> und <M p=".">{t`\v{BA} = (x,\,y,\,0)`}</M> Dann ist <M>{t`\v\omega\times\v{BA} = \omega\,(-y,\,x,\,0)`}</M> (der Vektor steht senkrecht auf <M p=")">{t`\v{BA}`}</M> und</p>
              <MD>{t`\v F\cdot(\v\omega\times\v{BA}) = \omega\,(-F_x\,y + F_y\,x) = \omega\,(x F_y - y F_x) = \v\omega\cdot(\v{BA}\times\v F).`}</MD>
              <p>Die Klammer <M>{t`x F_y - y F_x`}</M> ist die einzige Komponente von <M p=",">{t`\v{BA}\times\v F`}</M> die in der Ebene nicht null ist: die <M>z</M>-Komponente. So rechnet auch das Programm hinter den Figuren.</p>
            </>}
            en={<>
              <p>In the plane <M>{t`\v\omega = \omega\,\e z`}</M> and <M p=".">{t`\v{BA} = (x,\,y,\,0)`}</M> Then <M>{t`\v\omega\times\v{BA} = \omega\,(-y,\,x,\,0)`}</M> (the vector is perpendicular to <M p=")">{t`\v{BA}`}</M> and</p>
              <MD>{t`\v F\cdot(\v\omega\times\v{BA}) = \omega\,(-F_x\,y + F_y\,x) = \omega\,(x F_y - y F_x) = \v\omega\cdot(\v{BA}\times\v F).`}</MD>
              <p>The bracket <M>{t`x F_y - y F_x`}</M> is the only component of <M>{t`\v{BA}\times\v F`}</M> that is not zero in the plane: the <M>z</M>-component. This is also how the program behind the figures computes.</p>
            </>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="bezugspunkt" title={<T de="3. Den Bezugspunkt B wählen" en="3. Choosing the reference point B" />}>
        <T
          de={<>
            <p>Im Beweis war <M>B</M> irgendein Punkt des Körpers. Du darfst ihn frei wählen. Wechselst du <M p=",">B</M> ändern sich alle drei Grössen <M p=",">{t`\v v_B`}</M> <M>{t`\v M_B`}</M> und damit die beiden Produkte. <b>Die Summe ändert sich nicht.</b> Das ist der Kern der Formel: Man verteilt dieselbe Leistung anders auf «Schieben» und «Drehen».</p>
            <p><b>Was du sehen sollst:</b> Ziehe <M>B</M> über die Platte. Die zwei unteren Balken verschieben sich gegeneinander, aber sie enden immer an derselben grünen Linie wie die Balken der oberen Gruppe.</p>
          </>}
          en={<>
            <p>In the proof <M>B</M> was just some point of the body. You may choose it freely. If you change <M p=",">B</M> the quantities <M p=",">{t`\v v_B`}</M> <M>{t`\v M_B`}</M> change and with them the two products. <b>The sum does not change.</b> This is the heart of the formula: the same power is shared differently between “pushing” and “turning”.</p>
            <p><b>What you should see:</b> Drag <M>B</M> over the plate. The two lower bars slide against each other, but they always end at the same green line as the bars of the upper group.</p>
          </>}
        />
        <GroupPowerExplorer />
        <T
          de={<>
            <p className="fig-note">Bedienung: <M>B</M> (roter Punkt), die Pfeilspitzen und Fusspunkte der Kräfte und die Spitze von <M>{t`\v v_B`}</M> sind ziehbar (gestrichelte Kreise). Ein Kreis ohne Pfeil ist eine dritte Kraft, die noch null ist. Der Regler setzt <M p=".">\omega</M> Dünne rosa Pfeile: die Geschwindigkeit <M>{t`\v v_i`}</M> an jedem Angriffspunkt. Die vermilionfarbene Spirale um <M>B</M> ist <M p=",">{t`\v M_B`}</M> die violette ist <M p=".">{t`\v\omega`}</M> (Gegenuhrzeigersinn: <M p=",">⊙</M> Uhrzeigersinn: <M p=").">⊗</M> Längen in m, Kräfte in N, Geschwindigkeiten in m/s, <M>\omega</M> in 1/s, Leistungen in W.</p>
            <p><b>Die Knöpfe</b> zeigen Sonderfälle:</p>
            <ul>
              <li><b>zwei Kräfte (S. 35):</b> die Platte des Beweises. Ziehe <M>B</M> auf <M p=":">{t`A_2`}</M> Dann ist <M>{t`\v M_B`}</M> nur noch das Moment von <M p=".">{t`\v F_1`}</M></li>
              <li><b>ein Angriffspunkt:</b> alle Kräfte greifen am selben Punkt an, <M>B</M> liegt auf diesem Punkt. Dann ist <M>{t`\v{BA}_i = \v 0`}</M> für alle <M p=",">i</M> also <M p=",">{t`\v M_B = \v 0`}</M> und es bleibt <M p=".">{t`P = \v R\cdot\v v_B`}</M> Das ist die erste Zeile der Seite 34. Ziehe jetzt <M>B</M> weg: Das Moment ist nicht mehr null.</li>
              <li><b>gegengleich <M p="">{t`\v R = \v 0`}</M></b> zwei gleich grosse, entgegengesetzte Kräfte an verschiedenen Punkten. Sie heben sich als Pfeile auf, ihre Leistung ist trotzdem nicht null: <M p=".">{t`P = \v M_B\cdot\v\omega`}</M> Und <M>{t`\v M_B`}</M> ist hier für jeden Punkt <M>B</M> gleich gross.</li>
              <li><b>nur Schieben <M p="">{t`\omega = 0`}</M></b> Alle Punkte haben dieselbe Geschwindigkeit, also ist <M>{t`\v v_B`}</M> überall gleich und <M>{t`P = \v R\cdot\v v_B`}</M> für jedes <M p=".">B</M></li>
              <li><b>nur Drehen um <M p="">B</M></b> Hier ist <M p=":">{t`\v v_B = \v 0`}</M> Der Körper dreht sich in diesem Augenblick um <M p=".">B</M> Es bleibt <M p=".">{t`P = \v M_B\cdot\v\omega`}</M> Ziehe aber <M p=",">B</M> und <M>{t`\v v_B`}</M> ist nicht mehr null: Beschreibt man dieselbe Bewegung an einem anderen Punkt, tritt auch <M>{t`\v R\cdot\v v_B`}</M> auf.</li>
            </ul>
          </>}
          en={<>
            <p className="fig-note">Controls: <M>B</M> (red dot), the tips and feet of the force arrows and the tip of <M>{t`\v v_B`}</M> can be dragged (dashed circles). A circle without an arrow is a third force that is still zero. The slider sets <M p=".">\omega</M> Thin rose arrows: the velocity <M>{t`\v v_i`}</M> at each point of application. The vermilion spiral around <M>B</M> is <M p=",">{t`\v M_B`}</M> the purple one is <M p=".">{t`\v\omega`}</M> (counter-clockwise: <M p=",">⊙</M> clockwise: <M p=").">⊗</M> Lengths in m, forces in N, velocities in m/s, <M>\omega</M> in 1/s, powers in W.</p>
            <p><b>The buttons</b> show special cases:</p>
            <ul>
              <li><b>two forces (p. 35):</b> the plate of the proof. Drag <M>B</M> onto <M p=":">{t`A_2`}</M> then <M>{t`\v M_B`}</M> is only the moment of <M p=".">{t`\v F_1`}</M></li>
              <li><b>one point of application:</b> all forces act at the same point, and <M>B</M> sits on that point. Then <M>{t`\v{BA}_i = \v 0`}</M> for all <M p=",">i</M> so <M p=",">{t`\v M_B = \v 0`}</M> and what remains is <M p=".">{t`P = \v R\cdot\v v_B`}</M> This is the first line of page 34. Now drag <M>B</M> away: the moment is no longer zero.</li>
              <li><b>equal and opposite <M p="">{t`\v R = \v 0`}</M></b> two equal, opposite forces at different points. As arrows they cancel, but their power is not zero: <M p=".">{t`P = \v M_B\cdot\v\omega`}</M> And here <M>{t`\v M_B`}</M> is the same for every point <M p=".">B</M></li>
              <li><b>pushing only <M p="">{t`\omega = 0`}</M></b> All points have the same velocity, so <M>{t`\v v_B`}</M> is the same everywhere and <M>{t`P = \v R\cdot\v v_B`}</M> for every <M p=".">B</M></li>
              <li><b>turning only about <M p="">B</M></b> Here <M p=":">{t`\v v_B = \v 0`}</M> at this instant the body turns about <M p=".">B</M> What remains is <M p=".">{t`P = \v M_B\cdot\v\omega`}</M> But drag <M p=",">B</M> and <M>{t`\v v_B`}</M> is no longer zero: describing the same motion at another point also brings in <M p=".">{t`\v R\cdot\v v_B`}</M></li>
            </ul>
          </>}
        />
        <Box kind="supplement" title={<T de="Warum ändert sich P nicht? (drei Zeilen)" en="Why does P not change? (three lines)" />}>
          <T
            de={<>
              <p>Das Skript sagt es nicht ausdrücklich, aber es folgt aus den Definitionen. Wechselt man von <M>B</M> nach <M p=",">{t`B'`}</M> ändern sich zwei Dinge, die man beide schon kennt:</p>
              <MD>{t`\v v_{B'} = \v v_B + \v\omega\times\v{BB'}\qquad\text{und}\qquad \v M_{B'} = \sum\v{B'A}_i\times\v F_i = \sum(\v{B'B} + \v{BA}_i)\times\v F_i = \v M_B + \v{B'B}\times\v R.`}</MD>
              <p>Setzt man beides in <M>{t`\v R\cdot\v v_{B'} + \v M_{B'}\cdot\v\omega`}</M> ein, kommen zwei neue Terme dazu:</p>
              <MD>{t`\v R\cdot(\v\omega\times\v{BB'}) + (\v{B'B}\times\v R)\cdot\v\omega = \v R\cdot(\v\omega\times\v{BB'}) - \v R\cdot(\v\omega\times\v{BB'}) = 0.`}</MD>
              <p>Der zweite Term ist nach der Spatprodukt-Regel (zyklisch vertauschen, dann <M p=")">{t`\v{B'B} = -\v{BB'}`}</M> das Negative des ersten. Sie heben sich auf: <M>{t`P`}</M> bleibt gleich.</p>
            </>}
            en={<>
              <p>The notes do not say it explicitly, but it follows from the definitions. Changing from <M>B</M> to <M p=",">{t`B'`}</M> two things change, and you already know both:</p>
              <MD>{t`\v v_{B'} = \v v_B + \v\omega\times\v{BB'}\qquad\text{and}\qquad \v M_{B'} = \sum\v{B'A}_i\times\v F_i = \sum(\v{B'B} + \v{BA}_i)\times\v F_i = \v M_B + \v{B'B}\times\v R.`}</MD>
              <p>Insert both into <M>{t`\v R\cdot\v v_{B'} + \v M_{B'}\cdot\v\omega`}</M> and two new terms appear:</p>
              <MD>{t`\v R\cdot(\v\omega\times\v{BB'}) + (\v{B'B}\times\v R)\cdot\v\omega = \v R\cdot(\v\omega\times\v{BB'}) - \v R\cdot(\v\omega\times\v{BB'}) = 0.`}</MD>
              <p>By the triple-product rule (swap cyclically, then <M p=")">{t`\v{B'B} = -\v{BB'}`}</M> the second term is the negative of the first. They cancel: <M>P</M> stays the same.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="leiter" title={<T de="4. Beispiel: die Leiter (Figur 5.6)" en="4. Example: the ladder (Figure 5.6)" />}>
        <Box kind="lecture" src={<Src p="35–36" fig="Fig. 5.6" />} title={<T de="Figur 5.6: Leiter" en={<>Figure 5.6: ladder (<span lang="de">Leiter</span>)</>} />}>
          <T
            de={<>
              <p>Figur: eine Leiter <M>AB</M> der Länge <M>L</M> unter <M p=",">{t`45^\circ`}</M> Mitte <M p=",">C</M> bei <M>B</M> die Kraft <M>{t`|\v F_B| =: G`}</M> nach unten, bei <M>C</M> die Kraft <M>{t`|\v F_C| =: W`}</M> senkrecht zur Leiter (von rechts unten auf <M>C</M> zu). Achsen <M>{t`\e x`}</M> nach rechts, <M>{t`\e y`}</M> nach oben, <M>{t`\e z`}</M> aus dem Bild. Ein Aufgabentext fehlt in der Mitschrift, alles steht in der Figur.</p>
              <p><b>Geg.:</b> <M p=",">{t`\v v_A = (v,\,0,\,0)^{\mathsf T}`}</M> <M p=".">{t`\v\omega = (0,\,0,\,\omega)^{\mathsf T}`}</M> <b>Ges.:</b> Gesamtleistung.</p>
              <p><b>① (S. 35 rechts)</b> jede Kraft mit der Geschwindigkeit ihres Punktes:</p>
            </>}
            en={<>
              <p>Figure: a ladder <M>AB</M> of length <M>L</M> at <M p=",">{t`45^\circ`}</M> midpoint <M p=",">C</M> at <M>B</M> the force <M>{t`|\v F_B| =: G`}</M> pointing down, at <M>C</M> the force <M>{t`|\v F_C| =: W`}</M> perpendicular to the ladder (coming from the lower right towards <M p=").">C</M> Axes <M>{t`\e x`}</M> to the right, <M>{t`\e y`}</M> up, <M>{t`\e z`}</M> out of the page. The task text is missing in the notes; everything is in the figure.</p>
              <p><b>Given</b> (<span lang="de">Geg.</span>)<b>:</b> <M p=",">{t`\v v_A = (v,\,0,\,0)^{\mathsf T}`}</M> <M p=".">{t`\v\omega = (0,\,0,\,\omega)^{\mathsf T}`}</M> <b>Wanted</b> (<span lang="de">Ges.</span>)<b>:</b> total power (<span lang="de">Gesamtleistung</span>).</p>
              <p><b>① (p. 35, right)</b> each force with the velocity of its own point:</p>
            </>}
          />
          <MD>{t`\begin{aligned}
\v v_C &= \v v_A + \v\omega\times\v{AC}\\
&= \begin{pmatrix}v\\0\\0\end{pmatrix} + \begin{pmatrix}0\\0\\\omega\end{pmatrix}\times\begin{pmatrix}L\sqrt2/4\\L\sqrt2/4\\0\end{pmatrix}\\
&= \begin{pmatrix}v - \omega L\sqrt2/4\\ \omega L\sqrt2/4\\0\end{pmatrix}\\[8pt]
\v v_B &= \v v_A + \v\omega\times\v{AB} = \begin{pmatrix}v - \omega L\sqrt2/2\\ \omega L\sqrt2/2\\0\end{pmatrix}\\[8pt]
P &= \sum_{i=1}^{2}\v F_i\cdot\v v_i\\
&= \underbrace{\begin{pmatrix}-\tfrac{\sqrt2}{2}W\\ \tfrac{\sqrt2}{2}W\\0\end{pmatrix}\cdot\v v_C}_{\text{in } C} + \underbrace{\begin{pmatrix}0\\-G\\0\end{pmatrix}\cdot\v v_B}_{\text{in } B}\\[6pt]
&= -\tfrac{\sqrt2}{2}Wv + W\tfrac L2\,\omega - G\omega L\tfrac{\sqrt2}{2}
\end{aligned}`}</MD>
          <T
            de={<p><b>② (S. 35 links)</b> in <M>A</M> gebündelt:</p>}
            en={<p><b>② (p. 35, left)</b> bundled at <M p=":">A</M></p>}
          />
          <MD>{t`\begin{aligned}
\v M_{AG} &= \v{AB}\times\v G = \begin{pmatrix}0\\0\\-GL\tfrac{\sqrt2}{2}\end{pmatrix}\\[8pt]
\v M_{AW} &= \v{AC}\times\v W = \begin{pmatrix}0\\0\\W\cdot\tfrac L2\end{pmatrix}\\[8pt]
P &= \v R\cdot\v v_A + \v\omega\cdot\v M_A\\
&= \begin{pmatrix}-\tfrac{\sqrt2}{2}W\\ \tfrac{\sqrt2}{2}W - G\\0\end{pmatrix}\cdot\begin{pmatrix}v\\0\\0\end{pmatrix} + \begin{pmatrix}0\\0\\\omega\end{pmatrix}\cdot\begin{pmatrix}0\\0\\-GL\tfrac{\sqrt2}{2} + W\tfrac L2\end{pmatrix}\\[6pt]
&= -\tfrac{\sqrt2}{2}Wv + \omega W\tfrac L2 - \omega GL\tfrac{\sqrt2}{2}
\end{aligned}`}</MD>
          <T
            de={<p><b>③, ④ (S. 36)</b> dieselben beiden Wege gezeichnet: ③ «in <M>B</M>»: <M p=",">{t`P_B = -G\tfrac{\sqrt2}{2}\,\omega L`}</M> «in <M>C</M>»: <M p=".">{t`P_C = +W\omega\tfrac L2 - W\tfrac{\sqrt2}{2}\,v`}</M> ④ «in <M>A</M>»: <M p=",">{t`\v R\cdot\v v_A = -v\tfrac{\sqrt2}{2}W`}</M> <M>{t`\v M_A`}</M> mit <M>{t`\v M_A = \v M_{AW} + \v M_{AG}`}</M> «bezüglich z-Achse», <M p=".">{t`\v M_A\cdot\v\omega = +W\tfrac L2\,\omega - \tfrac{\sqrt2}{2}GL\,\omega`}</M></p>}
            en={<p><b>③, ④ (p. 36)</b> the same two ways drawn: ③ “in <M>B</M>”: <M p=",">{t`P_B = -G\tfrac{\sqrt2}{2}\,\omega L`}</M> “in <M>C</M>”: <M p=".">{t`P_C = +W\omega\tfrac L2 - W\tfrac{\sqrt2}{2}\,v`}</M> ④ “in <M>A</M>”: <M p=",">{t`\v R\cdot\v v_A = -v\tfrac{\sqrt2}{2}W`}</M> <M>{t`\v M_A`}</M> with <M>{t`\v M_A = \v M_{AW} + \v M_{AG}`}</M> “about the z-axis”, <M p=".">{t`\v M_A\cdot\v\omega = +W\tfrac L2\,\omega - \tfrac{\sqrt2}{2}GL\,\omega`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Lösung:</b></p>
            <ol>
              <li>Gegeben sind nur <M>{t`\v v_A`}</M> und <M p=".">{t`\v\omega`}</M> Die Leiter bewegt sich in der Ebene: Der Fuss <M>A</M> schiebt sich nach rechts, und die Leiter dreht sich gegen den Uhrzeigersinn (<M p=").">⊙</M> Gesucht ist die Leistung beider Kräfte zusammen.</li>
              <li><b>Weg ①, Punkt für Punkt.</b> Zuerst die Geschwindigkeiten der beiden Angriffspunkte, mit der Grundgleichung: <M p=".">{t`\v v_C = \v v_A + \v\omega\times\v{AC}`}</M> In der Spalte steht <M>{t`\v\omega\times\v{AC}`}</M> als <M p=":">{t`(0,0,\omega)\times(L\sqrt2/4,\,L\sqrt2/4,\,0)`}</M> Das Kreuzprodukt mit <M>{t`\e z`}</M> dreht den Vektor um <M>{t`90^\circ`}</M> gegen den Uhrzeigersinn, also <M p=".">{t`(-L\sqrt2/4,\,L\sqrt2/4)\,\omega`}</M> Dasselbe gilt für <M p=".">B</M></li>
              <li>Dann jede Kraft mal ihre Geschwindigkeit. Bei <M>B</M> zählt nur die senkrechte Komponente von <M p=",">{t`\v v_B`}</M> weil <M>{t`\v F_B`}</M> senkrecht nach unten zeigt: <M p=".">{t`P_B = -G\cdot\tfrac{\sqrt2}{2}\omega L`}</M> Bei <M>C</M> zählt der Anteil von <M>{t`\v v_C`}</M> längs <M p=",">{t`\v F_C`}</M> also <M p=".">{t`P_C = W\,(\omega L/2 - \tfrac{\sqrt2}{2}v)`}</M> Die Summe ist die handschriftliche Zeile am Ende.</li>
              <li><b>Weg ②, in <M p=".">A</M> gebündelt.</b> Zuerst <M p=".">{t`\v R = \v F_B + \v F_C = (-\tfrac{\sqrt2}{2}W,\ \tfrac{\sqrt2}{2}W - G,\ 0)`}</M> Dann die Momente um <M p=":">A</M> <M>{t`\v M_{AG} = \v{AB}\times\v G`}</M> zeigt in <M>-z</M>-Richtung (die Kraft <M>G</M> dreht die Leiter im Uhrzeigersinn), <M>{t`\v M_{AW} = \v{AC}\times\v W`}</M> in <M>+z</M>-Richtung (<M>W</M> dreht sie gegen den Uhrzeigersinn). Beide haben nur eine <M>z</M>-Komponente, darum genügt ihr Wert.</li>
              <li>Jetzt <M p=".">{t`P = \v R\cdot\v v_A + \v\omega\cdot\v M_A`}</M> Von <M>{t`\v R`}</M> zählt nur die <M>x</M>-Komponente, weil <M>{t`\v v_A`}</M> nach rechts zeigt: <M p=".">{t`\v R\cdot\v v_A = -\tfrac{\sqrt2}{2}Wv`}</M> Von den Momenten zählt nur das <M>z</M>-Moment, weil <M>{t`\v\omega`}</M> nach <M>z</M> zeigt: <M>{t`\omega\,(W\tfrac L2 - GL\tfrac{\sqrt2}{2})`}</M></li>
              <li>Beide Wege enden bei derselben Formel. Das ist die Probe, dass die Formel für starre Körper stimmt.</li>
            </ol>
            <p>Quelle: Der Aufgabentext fehlt in der Mitschrift, und die Richtungen von <M>{t`\v F_B`}</M> und <M>{t`\v F_C`}</M> sind nur der Figur zu entnehmen (<M>{t`\v F_C = W(-\tfrac{\sqrt2}{2},\,\tfrac{\sqrt2}{2},\,0)`}</M> steht in der Rechnung). Die Pfeilspitze von <M>{t`\v F_C`}</M> liegt in der Figur bei <M p=",">C</M> die von <M>{t`\v F_B`}</M> unten. Beides ist in unserer Figur wie im Skript gezeichnet. Das handgeschriebene <M>v</M> neben dem blauen Pfeil in <M>A</M> ist <M p=".">{t`\v v_A`}</M></p>
          </>}
          en={<>
            <p><b>How to read the solution:</b></p>
            <ol>
              <li>Only <M>{t`\v v_A`}</M> and <M>{t`\v\omega`}</M> are given. The ladder moves in the plane: the foot <M>A</M> slides to the right and the ladder turns counter-clockwise (<M p=").">⊙</M> Wanted is the power of both forces together.</li>
              <li><b>Route ①, point by point.</b> First the velocities of the two points of application, with the fundamental equation: <M p=".">{t`\v v_C = \v v_A + \v\omega\times\v{AC}`}</M> The column shows <M>{t`\v\omega\times\v{AC}`}</M> as <M p=":">{t`(0,0,\omega)\times(L\sqrt2/4,\,L\sqrt2/4,\,0)`}</M> the cross product with <M>{t`\e z`}</M> turns the vector by <M>{t`90^\circ`}</M> counter-clockwise, so <M p=".">{t`(-L\sqrt2/4,\,L\sqrt2/4)\,\omega`}</M> The same holds for <M p=".">B</M></li>
              <li>Then each force times its velocity. At <M>B</M> only the vertical component of <M>{t`\v v_B`}</M> counts, because <M>{t`\v F_B`}</M> points straight down: <M p=".">{t`P_B = -G\cdot\tfrac{\sqrt2}{2}\omega L`}</M> At <M>C</M> the part of <M>{t`\v v_C`}</M> along <M>{t`\v F_C`}</M> counts, so <M p=".">{t`P_C = W\,(\omega L/2 - \tfrac{\sqrt2}{2}v)`}</M> The sum is the handwritten line at the end.</li>
              <li><b>Route ②, bundled at <M p=".">A</M></b> First <M p=".">{t`\v R = \v F_B + \v F_C = (-\tfrac{\sqrt2}{2}W,\ \tfrac{\sqrt2}{2}W - G,\ 0)`}</M> Then the moments about <M p=":">A</M> <M>{t`\v M_{AG} = \v{AB}\times\v G`}</M> points in the <M>-z</M> direction (the force <M>G</M> turns the ladder clockwise), <M>{t`\v M_{AW} = \v{AC}\times\v W`}</M> in the <M>+z</M> direction (<M>W</M> turns it counter-clockwise). Both have only a <M>z</M>-component, so their value is enough.</li>
              <li>Now <M p=".">{t`P = \v R\cdot\v v_A + \v\omega\cdot\v M_A`}</M> Of <M>{t`\v R`}</M> only the <M>x</M>-component counts, because <M>{t`\v v_A`}</M> points to the right: <M p=".">{t`\v R\cdot\v v_A = -\tfrac{\sqrt2}{2}Wv`}</M> Of the moments only the <M>z</M>-moment counts, because <M>{t`\v\omega`}</M> points along <M p=":">z</M> <M>{t`\omega\,(W\tfrac L2 - GL\tfrac{\sqrt2}{2})`}</M></li>
              <li>Both routes end at the same formula. That is the check that the formula for rigid bodies works.</li>
            </ol>
            <p>Source: the task text is missing in the notes, and the directions of <M>{t`\v F_B`}</M> and <M>{t`\v F_C`}</M> can only be read from the figure (<M>{t`\v F_C = W(-\tfrac{\sqrt2}{2},\,\tfrac{\sqrt2}{2},\,0)`}</M> appears in the calculation). In the figure the arrowhead of <M>{t`\v F_C`}</M> sits at <M p=",">C</M> that of <M>{t`\v F_B`}</M> at the bottom. Both are drawn in our figure as in the notes. The handwritten <M>v</M> next to the blue arrow at <M>A</M> is <M p=".">{t`\v v_A`}</M></p>
          </>}
        />
        <Derivation title={<T de="Die Lösung in sechs Bildern" en="The solution in six pictures" />}>
          <StepPlayer
            label={tr('Animation: Leiter, beide Wege zur Gesamtleistung', 'Animation: ladder, both routes to the total power')}
            steps={[
              { ms: 3000, holdMs: 2500, caption: <T
                de={<>Die Leiter mit den Kräften <M>{t`\v F_B`}</M> (nach unten) und <M>{t`\v F_C`}</M> (senkrecht zur Leiter). Gegeben: <M>{t`\v v_A`}</M> nach rechts und <M>{t`\v\omega`}</M> (<M p=",">⊙</M> gegen den Uhrzeigersinn). Gesucht: die Gesamtleistung <M p=".">P</M> Zahlen: <M p=",">{t`L = 4\,\mathrm{m}`}</M> <M p=",">{t`v = 1\,\mathrm{m/s}`}</M> <M p=",">{t`\omega = 0{,}5\,\mathrm{s^{-1}}`}</M> <M p=",">{t`G = 20\,\mathrm{N}`}</M> <M p=".">{t`W = 15\,\mathrm{N}`}</M></>}
                en={<>The ladder with the forces <M>{t`\v F_B`}</M> (down) and <M>{t`\v F_C`}</M> (perpendicular to the ladder). Given: <M>{t`\v v_A`}</M> to the right and <M>{t`\v\omega`}</M> (<M p=",">⊙</M> counter-clockwise). Wanted: the total power <M p=".">P</M> Numbers: <M p=",">{t`L = 4\,\mathrm{m}`}</M> <M p=",">{t`v = 1\,\mathrm{m/s}`}</M> <M p=",">{t`\omega = 0.5\,\mathrm{s^{-1}}`}</M> <M p=",">{t`G = 20\,\mathrm{N}`}</M> <M p=".">{t`W = 15\,\mathrm{N}`}</M></>} /> },
              { ms: 4500, holdMs: 3500, caption: <T
                de={<>In <M>C</M> und <M>B</M> wird <M>{t`\v v_A`}</M> kopiert (rosa) und der Drehteil <M>{t`\v\omega\times\v{AC}`}</M> bzw. <M>{t`\v\omega\times\v{AB}`}</M> angehängt (violett, senkrecht zur Leiter, in <M>B</M> doppelt so lang). Das ergibt <M>{t`\v v_C`}</M> und <M p=".">{t`\v v_B`}</M></>}
                en={<>At <M>C</M> and <M>B</M> a copy of <M>{t`\v v_A`}</M> is placed (rose) and the turning part <M>{t`\v\omega\times\v{AC}`}</M> or <M>{t`\v\omega\times\v{AB}`}</M> is attached (purple, perpendicular to the ladder, twice as long at <M p=").">B</M> This gives <M>{t`\v v_C`}</M> and <M p=".">{t`\v v_B`}</M></>} /> },
              { ms: 4500, holdMs: 4000, caption: <T
                de={<>Weg ①: Von <M>{t`\v v_B`}</M> zählt nur der Schatten auf die senkrechte Gerade von <M p=",">{t`\v F_B`}</M> von <M>{t`\v v_C`}</M> der Schatten auf die Gerade von <M p=".">{t`\v F_C`}</M> Daraus werden <M>{t`P_B = -28{,}3\,\mathrm{W}`}</M> (Anheben gegen <M>G</M> kostet Leistung) und <M>{t`P_C = 4{,}4\,\mathrm{W}`}</M> als Balken.</>}
                en={<>Route ①: of <M>{t`\v v_B`}</M> only the shadow on the vertical line of <M>{t`\v F_B`}</M> counts, of <M>{t`\v v_C`}</M> the shadow on the line of <M p=".">{t`\v F_C`}</M> These give <M>{t`P_B = -28.3\,\mathrm{W}`}</M> (lifting against <M>G</M> costs power) and <M>{t`P_C = 4.4\,\mathrm{W}`}</M> as bars.</>} /> },
              { ms: 4500, holdMs: 4000, caption: <T
                de={<>Weg ②: Die beiden Kräfte werden nach <M>A</M> verschoben und zu <M>{t`\v R`}</M> addiert. Dazu kommen die Momente um <M p=":">A</M> <M>{t`\v M_{AG}`}</M> dreht im Uhrzeigersinn (<M p="),">⊗</M> <M>{t`\v M_{AW}`}</M> gegen den Uhrzeigersinn (<M p="),">⊙</M> zusammen <M p=".">{t`\v M_A`}</M></>}
                en={<>Route ②: the two forces are moved to <M>A</M> and added to <M p=".">{t`\v R`}</M> Added to that are the moments about <M p=":">A</M> <M>{t`\v M_{AG}`}</M> turns clockwise (<M p="),">⊗</M> <M>{t`\v M_{AW}`}</M> counter-clockwise (<M p="),">⊙</M> together <M p=".">{t`\v M_A`}</M></>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<>Nun die zwei Produkte: <M>{t`\v R\cdot\v v_A = -10{,}6\,\mathrm{W}`}</M> (nur die waagrechte Komponente von <M>{t`\v R`}</M> trifft <M p=")">{t`\v v_A`}</M> und <M>{t`\v M_A\cdot\v\omega = -13{,}3\,\mathrm{W}`}</M> (nur das <M>z</M>-Moment trifft <M p=").">{t`\v\omega`}</M></>}
                en={<>Now the two products: <M>{t`\v R\cdot\v v_A = -10.6\,\mathrm{W}`}</M> (only the horizontal component of <M>{t`\v R`}</M> meets <M p=")">{t`\v v_A`}</M> and <M>{t`\v M_A\cdot\v\omega = -13.3\,\mathrm{W}`}</M> (only the <M>z</M>-moment meets <M p=").">{t`\v\omega`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Beide Wege enden an derselben Linie: <M p=".">{t`P = -23{,}9\,\mathrm{W}`}</M> Allgemein <M p=".">{t`P = -\tfrac{\sqrt2}{2}Wv + \tfrac{WL}{2}\omega - \tfrac{\sqrt2}{2}GL\omega`}</M> Negativ heisst: Die Kräfte nehmen der Leiter Leistung weg, sie bremsen die Bewegung.</>}
                en={<>Both routes end at the same line: <M p=".">{t`P = -23.9\,\mathrm{W}`}</M> In general <M p=".">{t`P = -\tfrac{\sqrt2}{2}Wv + \tfrac{WL}{2}\omega - \tfrac{\sqrt2}{2}GL\omega`}</M> Negative means: the forces take power away from the ladder, they slow the motion down.</>} /> },
            ]}
          >
            {(step, tt) => <SceneView scene={ladderSolScene(step, tt, lang)} W={LW} H={LH} className="wide" label={tr('Leiter, Lösung in sechs Schritten', 'Ladder, solution in six steps')} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>Jetzt selbst ausprobieren.</b> Die Schieber setzen <M p=",">v</M> <M p=",">\omega</M> <M>G</M> und <M>W</M> (<M p=").">{t`L = 4\,\mathrm{m}`}</M> Mit den Knöpfen oben wechselst du zwischen Weg ① («Punkt für Punkt») und Weg ② («in <M>A</M> gebündelt»). Die beiden Balkengruppen unten sind immer beide da, die nicht gewählte nur blasser. Beide enden an der Linie <M p=".">P</M></p>
            <p><b>Was du sehen sollst:</b> Bei Weg ① fällt der Schatten von <M>{t`\v v_B`}</M> auf die senkrechte Gerade durch <M p=",">B</M> bei Weg ② der Schatten von <M>{t`\v v_A`}</M> auf <M p=".">{t`\v R`}</M> Verschiebe <M>v</M> oder <M p=",">\omega</M> und die Linie bleibt zwischen beiden Balkengruppen gemeinsam.</p>
          </>}
          en={<>
            <p><b>Now try it yourself.</b> The sliders set <M p=",">v</M> <M p=",">\omega</M> <M>G</M> and <M>W</M> (<M p=").">{t`L = 4\,\mathrm{m}`}</M> With the buttons above you switch between route ① (“point by point”) and route ② (“bundled at <M>A</M>”). The two groups of bars below are always both there, the one not chosen only paler. Both end at the line <M p=".">P</M></p>
            <p><b>What you should see:</b> In route ① the shadow of <M>{t`\v v_B`}</M> falls on the vertical line through <M p=",">B</M> in route ② the shadow of <M>{t`\v v_A`}</M> on <M p=".">{t`\v R`}</M> Move <M>v</M> or <M p=",">\omega</M> and the line stays common to both groups of bars.</p>
          </>}
        />
        <LadderExplorer />
        <Box kind="supplement" title={<T de="Plausibilitätsprobe: stimmen die Vorzeichen?" en="Plausibility check: do the signs make sense?" />}>
          <T
            de={<>
              <p><b>Nur Schieben (<M p=")">{t`\omega = 0`}</M></b> Die Leiter bewegt sich ohne Drehung nach rechts. <M>{t`\v F_B`}</M> zeigt nach unten, senkrecht zur Bewegung: <M p=".">{t`P_B = 0`}</M> <M>{t`\v F_C`}</M> zeigt nach links oben, also teilweise gegen die Bewegung: <M p=",">{t`P_C = -\tfrac{\sqrt2}{2}Wv < 0`}</M> die Kraft bremst. Das gibt die Formel.</p>
              <p><b>Nur Drehen (<M p=")">{t`v = 0`}</M></b> Die Leiter dreht sich gegen den Uhrzeigersinn um <M p=".">A</M> <M>B</M> bewegt sich nach links oben, also nach oben: gegen das Gewicht <M p=",">G</M> <M p=",">{t`P_B < 0`}</M> Anheben kostet Leistung. <M>C</M> bewegt sich in Richtung von <M>{t`\v F_C`}</M> (senkrecht zur Leiter, nach links oben), <M p=":">{t`P_C > 0`}</M> Diese Kraft schiebt mit.</p>
              <p>Diese Überlegung steht nicht im Skript. Sie zeigt, dass das Ergebnis der Rechnung auch ohne Formel gut zur Anschauung passt.</p>
            </>}
            en={<>
              <p><b>Sliding only (<M p=")">{t`\omega = 0`}</M></b> The ladder moves to the right without turning. <M>{t`\v F_B`}</M> points down, perpendicular to the motion: <M p=".">{t`P_B = 0`}</M> <M>{t`\v F_C`}</M> points up-left, so partly against the motion: <M p=",">{t`P_C = -\tfrac{\sqrt2}{2}Wv < 0`}</M> the force brakes. The formula gives exactly that.</p>
              <p><b>Turning only (<M p=")">{t`v = 0`}</M></b> The ladder turns counter-clockwise about <M p=".">A</M> <M>B</M> moves to the upper left, so upwards: against the weight <M p=",">G</M> <M p=",">{t`P_B < 0`}</M> lifting costs power. <M>C</M> moves in the direction of <M>{t`\v F_C`}</M> (perpendicular to the ladder, to the upper left), <M p=":">{t`P_C > 0`}</M> this force helps push.</p>
              <p>This reasoning is not in the notes. It shows that the result of the calculation also fits intuition without the formula.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«Die Leistung ist <M p="»">{t`\v R\cdot\v v`}</M></>} en={<>“The power is <M p="”">{t`\v R\cdot\v v`}</M></>} />}>
          <T
            de={<>Das ist nur die halbe Formel. Es fehlt <M p=".">{t`\v M_B\cdot\v\omega`}</M> Allein <M>{t`\v R\cdot\v v_B`}</M> stimmt nur bei reiner Verschiebung (<M p="),">{t`\omega = 0`}</M> bei <M>{t`\v M_B = \v 0`}</M> oder wenn alle Kräfte am selben Punkt <M>B</M> angreifen. Zwei gegengleiche Kräfte haben <M p=",">{t`\v R = \v 0`}</M> aber bei einem sich drehenden Körper trotzdem Leistung.</>}
            en={<>That is only half the formula. <M p=".">{t`\v M_B\cdot\v\omega`}</M> is missing. <M>{t`\v R\cdot\v v_B`}</M> alone is right only for pure translation (<M p="),">{t`\omega = 0`}</M> for <M>{t`\v M_B = \v 0`}</M> or when all forces act at the same point <M p=".">B</M> Two equal and opposite forces have <M p=",">{t`\v R = \v 0`}</M> but on a turning body they still have power.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«Wähle ich <M>B</M> anders, ändert sich die Leistung.»</>} en={<>“If I choose <M>B</M> differently, the power changes.”</>} />}>
          <T
            de={<><M>{t`\v v_B`}</M> und <M>{t`\v M_B`}</M> hängen von <M>B</M> ab, und mit ihnen die beiden Summanden. <M>{t`\v R`}</M> und <M>{t`\v\omega`}</M> hängen nicht von <M>B</M> ab. Die Summe <M>P</M> ist die Leistung der wirklichen Kräfte an der wirklichen Bewegung und kann nicht davon abhängen, wo man rechnet. Im Explorer von Abschnitt 3 bleibt die grüne Linie stehen.</>}
            en={<><M>{t`\v v_B`}</M> and <M>{t`\v M_B`}</M> depend on <M p=",">B</M> and so do the two summands. <M>{t`\v R`}</M> and <M>{t`\v\omega`}</M> do not depend on <M p=".">B</M> The sum <M>P</M> is the power of the real forces on the real motion and cannot depend on where you calculate. In the explorer of section 3 the green line stays put.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Formel gilt für jeden Körper.»" en="“The formula holds for every body.”" />}>
          <T
            de={<>Nein. Sie braucht <M p=",">{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> und das gilt nur für <b>starre</b> Körper. Bei einem Gummiband oder einer Flüssigkeit hat jeder Punkt seine eigene Geschwindigkeit, und man muss zurück zu <M p=".">{t`\sum \v F_i\cdot\v v_i`}</M> Die erste Zeile der Seite 34 gilt dagegen immer.</>}
            en={<>No. It needs <M p=",">{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> and that holds only for <b>rigid</b> bodies. For a rubber band or a fluid every point has its own velocity, and you must go back to <M p=".">{t`\sum \v F_i\cdot\v v_i`}</M> The first line of page 34, on the other hand, always holds.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v R`}</M> und <M>{t`\v M_B`}</M> kann man zusammenzählen.»</>} en={<>“<M>{t`\v R`}</M> and <M>{t`\v M_B`}</M> can be added.”</>} />}>
          <T
            de={<><M>{t`\v R`}</M> ist in Newton, <M>{t`\v M_B`}</M> in Newtonmeter. Das sind verschiedene Dinge. Sie bilden ein <i>Paar</i>, so wie <M>{t`\v v_B`}</M> und <M>{t`\v\omega`}</M> ein Paar bilden, und jedes Glied wird mit seinem Gegenstück multipliziert. Erst die beiden Produkte, beide in Watt, darf man addieren.</>}
            en={<><M>{t`\v R`}</M> is in newtons, <M>{t`\v M_B`}</M> in newton metres. Those are different things. They form a <i>pair</i>, just as <M>{t`\v v_B`}</M> and <M>{t`\v\omega`}</M> form a pair, and each member is multiplied by its counterpart. Only the two products, both in watts, may be added.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="merke" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Leistungen addieren sich. Am selben Punkt: <M p=".">{t`P = \v R\cdot\v v_A`}</M></li>
              <li>Starrer Körper, Kinemate <M>{t`\{\v v_B, \v\omega\}`}</M> in <M p=":">B</M> <M p=".">{t`P = \v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M></li>
              <li><M>{t`\v R = \sum\v F_i`}</M> (N) und <M>{t`\v M_B = \sum\v{BA}_i\times\v F_i`}</M> (N·m). Beide Produkte sind Leistungen in W.</li>
              <li>Beweis: <M>{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> einsetzen, ausklammern, <M>{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M> benutzen.</li>
              <li>Wählt man <M>B</M> anders, ändern sich die zwei Summanden, nie ihre Summe.</li>
            </ul>}
            en={<ul>
              <li>Powers add. At the same point: <M p=".">{t`P = \v R\cdot\v v_A`}</M></li>
              <li>Rigid body, Kinemate <M>{t`\{\v v_B, \v\omega\}`}</M> at <M p=":">B</M> <M p=".">{t`P = \v R\cdot\v v_B + \v M_B\cdot\v\omega`}</M></li>
              <li><M>{t`\v R = \sum\v F_i`}</M> (N) and <M>{t`\v M_B = \sum\v{BA}_i\times\v F_i`}</M> (N·m). Both products are powers in W.</li>
              <li>Proof: insert <M p=",">{t`\v v_i = \v v_B + \v\omega\times\v{BA}_i`}</M> factor out, use <M p=".">{t`\v a\cdot(\v b\times\v c) = \v b\cdot(\v c\times\v a)`}</M></li>
              <li>If you choose <M>B</M> differently, the two summands change, never their sum.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Die Leistung einer einzelnen Kraft <M>{t`\v F\cdot\v v`}</M> (<a href="#leistung">Lektion Leistung</a>) und die Leistung bei Rotation <M>{t`\v\omega\cdot\v M_O`}</M> (<a href="#leistung-rotation">Lektion Moment</a>) sind die beiden Bausteine. Die Kinemate kommt aus <a href="#zentralachse">Kinemate und Schraube</a>, die Grundgleichung aus <a href="#allgemein">Allgemeine Bewegung</a>. Die Resultierende <M>{t`\v R`}</M> haben wir in <a href="#kraft">Die Kraft als punktgebundener Vektor</a> kennengelernt. Wo <M>{t`\v R`}</M> und <M>{t`\v M_B`}</M> zusammen einen Körper im Gleichgewicht halten, ist das Thema der Statik, die später folgt. Diese Seite beantwortet das nicht.</p>}
          en={<p className="connections"><b>Connections:</b> The power of a single force <M>{t`\v F\cdot\v v`}</M> (<a href="#leistung">lesson on power</a>) and the power in rotation <M>{t`\v\omega\cdot\v M_O`}</M> (<a href="#leistung-rotation">lesson on the moment</a>) are the two building blocks. The Kinemate comes from <a href="#zentralachse">Kinemate and screw</a>, the fundamental equation from <a href="#allgemein">General motion</a>. We met the resultant <M>{t`\v R`}</M> in <a href="#kraft">Force as a point-bound vector</a>. When <M>{t`\v R`}</M> and <M>{t`\v M_B`}</M> together hold a body in equilibrium is a topic of statics, which comes later. This page does not answer that.</p>}
        />
      </Section>
    </article>
  );
}
