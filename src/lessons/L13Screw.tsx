import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ScrewAnim } from '../viz/anim/ScrewAnim';
import { CubeScrewAnim } from '../viz/anim/CubeScrewAnim';
import { InvariantExplorer, ScrewExplorer } from '../viz/ScrewFigures';

const t = String.raw;

export default function L13Screw() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Korkenzieher dreht sich und dringt dabei in den Korken ein. Auf S. 24–25 zeigt das Skript: Genau so sieht <b>jede</b> Bewegung eines starren Körpers aus – in jedem Augenblick. Sie ist eine Drehung um eine Achse, die <b>Zentralachse</b> <M p=",">\zeta</M> und zugleich ein Gleiten entlang dieser Achse. Das heisst <b>Schraubung</b>.</p>}
        en={<p className="lede">A corkscrew turns and at the same time moves into the cork. On pp. 24–25 the notes show: <b>every</b> motion of a rigid body looks exactly like this – at each instant. It is a turning about an axis, the <b>central axis</b> <M p=",">\zeta</M> and at the same time a sliding along that axis. This is called a <b>screw motion</b> (<span lang="de">Schraubung</span>).</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Dreh eine Schraube in ein Brett: Jeder Punkt der Schraube läuft auf einer <b>Schraubenlinie</b> (wie das Geländer einer Wendeltreppe), nur die Punkte auf der Mittelachse fahren geradeaus. Oder denk an einen Rugbyball, der mit Drall geworfen wird: Er dreht sich um seine lange Achse und fliegt entlang dieser Achse.</p>
            <p>Die Überraschung dieser Seiten: Das gilt nicht nur für Schrauben. Auch ein Buch, das du wild durch die Luft wirfst, schraubt sich in jedem Augenblick um eine Achse. Man sieht diese Achse nur nicht, und sie wandert mit der Zeit. Deine Randnotiz auf S. 24 trifft es: «Schraubungsachse – Rotationsachse, die Translation macht».</p>
          </>}
          en={<>
            <p>Drive a screw into a board: every point of the screw moves on a <b>helix</b> (like the handrail of a spiral staircase); only the points on its centre line go straight. Or think of a rugby ball thrown with spin: it turns about its long axis and flies along that axis.</p>
            <p>The surprise of these pages: this is not only true for screws. Even a book you throw wildly through the air screws about an axis at each instant. You just cannot see that axis, and it wanders with time. Your margin note on p. 24 says it well: “screw axis – a rotation axis that also translates”.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="kinemate" title={<T de="1. Die Kinemate" en="1. The Kinemate" />}>
        <Box kind="lecture" src={<Src p={24} />} title={<T de="Allgemeine Bewegung, Kinemate" en={<>General motion, <span lang="de">Kinemate</span></>} />}>
          <T
            de={<>
              <p>Allgemeine Bewegung: <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M></p>
              <p>Spezialfälle: <M>{t`\v\omega = \v 0 \to \v v_M = \v v_B`}</M> Translation; <M>{t`\v v_B = \v 0 \to \v v_M = \v\omega\times\v{BM}`}</M> Rotation, Rotationsachse durch <M p=".">B</M></p>
              <p>i.A.: <M p=":">{t`\{\v v_B, \v\omega\}`}</M> <b>Kinemate</b> in <M>B</M> <M>\to</M> charakterisiert Bewegungszustand! Wie verändert sich Kinemate je nach Ort?</p>
            </>}
            en={<>
              <p>General motion: <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M></p>
              <p>Special cases: <M>{t`\v\omega = \v 0 \to \v v_M = \v v_B`}</M> translation; <M>{t`\v v_B = \v 0 \to \v v_M = \v\omega\times\v{BM}`}</M> rotation, rotation axis through <M p=".">B</M></p>
              <p>In general: <M p=":">{t`\{\v v_B, \v\omega\}`}</M> <De en="the pair velocity of B and angular velocity">Kinemate</De> at <M>B</M> <M>\to</M> characterises the state of motion! How does the Kinemate change from place to place?</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Die erste Zeile ist die Grundgleichung aus der Lektion <a href="#allgemein">Allgemeine Bewegung</a> (S. 22). Kennt man die Geschwindigkeit <M>{t`\v v_B`}</M> eines Punktes <M>B</M> und die Winkelgeschwindigkeit <M p=",">{t`\v\omega`}</M> kennt man die Geschwindigkeit jedes Punktes <M p=".">M</M></li>
              <li>Die geschweifte Klammer <M>{t`\{\v v_B, \v\omega\}`}</M> fasst diese zwei Vektoren zu einem Paar zusammen. Das Paar heisst <b>Kinemate in <M p=".">B</M></b> Auf S. 23 stand dafür schon «Kinemat in <M p="».">B</M></li>
              <li><b>Bewegungszustand</b> heisst: alle Geschwindigkeiten in diesem Augenblick. Die Kinemate ist sein «Steckbrief» – zwei Pfeile statt unendlich vieler.</li>
              <li>Die Spezialfälle: Ohne Drehung (<M p=")">{t`\v\omega = \v 0`}</M> haben alle Punkte die Geschwindigkeit <M>{t`\v v_B`}</M> – eine <a href="#translation">Translation</a>. Ruht <M>B</M> (<M p=")">{t`\v v_B = \v 0`}</M> bleibt nur der Drehteil – eine <a href="#rotation">Rotation</a> um eine Achse durch <M p=".">B</M></li>
              <li>Die Frage am Schluss: Nimmt man statt <M>B</M> einen anderen Punkt <M>P</M> als Bezugspunkt, bekommt man eine andere Kinemate <M p=".">{t`\{\v v_P, \v\omega'\}`}</M> Was ändert sich dabei – und was nicht?</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>The first line is the fundamental equation from the lesson <a href="#allgemein">General rigid-body motion</a> (p. 22). If you know the velocity <M>{t`\v v_B`}</M> of one point <M>B</M> and the angular velocity <M p=",">{t`\v\omega`}</M> you know the velocity of every point <M p=".">M</M></li>
              <li>The curly bracket <M>{t`\{\v v_B, \v\omega\}`}</M> puts these two vectors together into a pair. The pair is called the <b><span lang="de">Kinemate</span> at <M p=".">B</M></b> On p. 23 it already appeared as “<span lang="de">Kinemat in</span> <M p="”.">B</M></li>
              <li><b>State of motion</b> (<span lang="de">Bewegungszustand</span>) means: all velocities at this instant. The Kinemate is its “ID card” – two arrows instead of infinitely many.</li>
              <li>The special cases: without turning (<M p=")">{t`\v\omega = \v 0`}</M> all points have the velocity <M>{t`\v v_B`}</M> – a <a href="#translation">translation</a>. If <M>B</M> is at rest (<M p=")">{t`\v v_B = \v 0`}</M> only the turning part remains – a <a href="#rotation">rotation</a> about an axis through <M p=".">B</M></li>
              <li>The question at the end: if you take another point <M>P</M> instead of <M>B</M> as the reference point, you get another Kinemate <M p=".">{t`\{\v v_P, \v\omega'\}`}</M> What changes – and what does not?</li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="invarianten" title={<T de="2. Zwei Grössen hängen nicht vom Ort ab" en="2. Two quantities do not depend on the place" />}>
        <Box kind="lecture" src={<Src p={24} />} title={<T de="1. und 2. Invariante" en={<>1st and 2nd invariant (<span lang="de">Invariante</span>)</>} />}>
          <MD>{t`\{\v v_P, \v\omega'\} \longleftrightarrow \{\v v_B, \v\omega\}`}</MD>
          <T
            de={<p><M>{t`\to\ \v\omega' = \v\omega \to`}</M> 1. Invariante (invariant bez. Ort!); <M p=".">{t`\v v_P = \v v_B + \v\omega\times\v{BP} \ne \v v_B`}</M></p>}
            en={<p><M>{t`\to\ \v\omega' = \v\omega \to`}</M> 1st invariant (invariant with respect to place!); <M p=".">{t`\v v_P = \v v_B + \v\omega\times\v{BP} \ne \v v_B`}</M></p>}
          />
          <T de={<p><M>\to</M> 2. Invariante?</p>} en={<p><M>\to</M> 2nd invariant?</p>} />
          <MD>{t`\v v_P = \v v_B + \v\omega\times\v{BP}, \qquad \v v_P\cdot\v e_\omega = \v v_B\cdot\v e_\omega + \cancel{(\v\omega\times\v{BP})\cdot\v e_\omega}`}</MD>
          <T
            de={<p>Projektion von <M>{t`\v v`}</M> in Richtung von <M p=":">{t`\v\omega`}</M> <M>{t`\v v_\omega`}</M> in jedem Punkt gleich <M p=":">{t`\to \v v_\omega`}</M> 2. Invariante. Handschriftlich auf S. 25: <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\cdot\v e_\omega`}</M> – «Projektion».</p>}
            en={<p>Projection of <M>{t`\v v`}</M> in the direction of <M p=":">{t`\v\omega`}</M> <M>{t`\v v_\omega`}</M> the same at every point <M p=":">{t`\to \v v_\omega`}</M> 2nd invariant. Handwritten on p. 25: <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\cdot\v e_\omega`}</M> – “projection”.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Invariant</b> heisst «unverändert»: Eine Invariante ist eine Grösse, die gleich bleibt, egal welchen Punkt man als Bezugspunkt nimmt. Das Skript findet zwei davon.</p>
            <h3>1. Invariante: <M>{t`\v\omega`}</M> ist überall gleich</h3>
            <p><b>Anschaulich:</b> <M>{t`\v\omega`}</M> sagt, um welche Richtung und wie schnell sich der Körper dreht. Ein starrer Körper dreht sich aber immer <em>als Ganzes</em>. Dreht sich eine Linie im Körper in einer Sekunde um <M p=",">{t`10^\circ`}</M> dreht sich jede andere Linie auch um <M>{t`10^\circ`}</M> – sonst würde sich der Winkel zwischen den beiden Linien ändern, und das verbietet die Starrheit (S. 12). Der Drehwinkel gehört also zum ganzen Körper, nicht zu einem Punkt. Darum ist auch <M>{t`\v\omega`}</M> für alle Bezugspunkte dasselbe.</p>
            <p><b>Mit Formeln</b> (die Rechnung von S. 22, mit <M>P</M> statt <M p=")">C</M> Angenommen, mit <M>P</M> als Bezugspunkt gehörte ein anderes <M>{t`\v\omega'`}</M> dazu:</p>
            <ol>
              <li>Mit <M>P</M> als Bezugspunkt: <M p=".">{t`\v v_M = \v v_P + \v\omega'\times\v{PM}`}</M></li>
              <li>Für <M>{t`\v v_P`}</M> setzt man die Grundgleichung mit <M>B</M> ein: <M p=".">{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M></li>
              <li>Mit <M>B</M> als Bezugspunkt und <M>{t`\v{BM} = \v{BP} + \v{PM}`}</M> gilt aber auch <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BP} + \v\omega\times\v{PM}`}</M></li>
              <li>Vergleicht man die beiden Ausdrücke für <M p=",">{t`\v v_M`}</M> bleibt <M>{t`\v\omega'\times\v{PM} = \v\omega\times\v{PM}`}</M> für jeden Punkt <M p=".">M</M> Das geht nur mit <M p=".">{t`\v\omega' = \v\omega`}</M></li>
            </ol>
            <p>Die mitfahrende Kamera in der Lektion <a href="#allgemein">Allgemeine Bewegung</a> zeigt dasselbe: Ob man mit <M>B</M> oder mit <M>C</M> mitfährt – die Platte dreht sich um denselben Winkel.</p>
            <h3>2. Invariante: der Teil von <M>{t`\v v`}</M> entlang <M>{t`\v\omega`}</M></h3>
            <ol>
              <li><M>{t`\v e_\omega = \v\omega/|\v\omega|`}</M> ist der Einheitsvektor in Richtung <M>{t`\v\omega`}</M> (Länge <M p=")">1</M></li>
              <li><M>{t`\v v_P\cdot\v e_\omega`}</M> ist die <b>Projektion</b> von <M>{t`\v v_P`}</M> auf die Richtung von <M p=":">{t`\v\omega`}</M> wie viel von <M>{t`\v v_P`}</M> entlang <M>{t`\v\omega`}</M> zeigt – wie der Schatten des Pfeils auf der <M>{t`\v\omega`}</M>-Geraden.</li>
              <li>Man bildet auf beiden Seiten der Grundgleichung das Skalarprodukt mit <M p=".">{t`\v e_\omega`}</M> Der letzte Term ist im Skript durchgestrichen, weil er null ist: Ein Kreuzprodukt steht senkrecht auf beiden Faktoren, also steht <M>{t`\v\omega\times\v{BP}`}</M> senkrecht auf <M p=",">{t`\v\omega`}</M> und seine Projektion auf <M>{t`\v\omega`}</M> ist <M p=".">0</M></li>
              <li>Übrig bleibt <M p=":">{t`\v v_P\cdot\v e_\omega = \v v_B\cdot\v e_\omega`}</M> dieselbe Zahl in jedem Punkt. Der zugehörige Vektor <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\,\v e_\omega`}</M> ist darum auch überall gleich.</li>
            </ol>
            <p>Bei einer Schraube ist <M>{t`\v v_\omega`}</M> die Geschwindigkeit, mit der sie ins Holz vordringt – und die ist für alle Punkte der Schraube dieselbe. Im Bild unten kannst du <M>P</M> durch den Körper schieben:</p>
          </>}
          en={<>
            <p><b>Invariant</b> means “unchanged”: an invariant is a quantity that stays the same whichever point you take as the reference point. The notes find two of them.</p>
            <h3>1st invariant: <M>{t`\v\omega`}</M> is the same everywhere</h3>
            <p><b>Intuitively:</b> <M>{t`\v\omega`}</M> tells about which direction and how fast the body turns. But a rigid body always turns <em>as a whole</em>. If one line in the body turns by <M>{t`10^\circ`}</M> in one second, every other line also turns by <M>{t`10^\circ`}</M> – otherwise the angle between the two lines would change, and rigidity forbids that (p. 12). So the angle of turning belongs to the whole body, not to a point. That is why <M>{t`\v\omega`}</M> is the same for every reference point.</p>
            <p><b>With formulas</b> (the calculation of p. 22, with <M>P</M> instead of <M p=").">C</M> Suppose that with <M>P</M> as the reference point another <M>{t`\v\omega'`}</M> belonged to it:</p>
            <ol>
              <li>With <M>P</M> as the reference point: <M p=".">{t`\v v_M = \v v_P + \v\omega'\times\v{PM}`}</M></li>
              <li>For <M>{t`\v v_P`}</M> insert the fundamental equation with <M p=":">B</M> <M p=".">{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M></li>
              <li>But with <M>B</M> as the reference point and <M>{t`\v{BM} = \v{BP} + \v{PM}`}</M> we also have <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BP} + \v\omega\times\v{PM}`}</M></li>
              <li>Comparing the two expressions for <M>{t`\v v_M`}</M> leaves <M>{t`\v\omega'\times\v{PM} = \v\omega\times\v{PM}`}</M> for every point <M p=".">M</M> This is only possible with <M p=".">{t`\v\omega' = \v\omega`}</M></li>
            </ol>
            <p>The riding camera in the lesson <a href="#allgemein">General rigid-body motion</a> shows the same: whether you ride along with <M>B</M> or with <M>C</M> – the plate turns by the same angle.</p>
            <h3>2nd invariant: the part of <M>{t`\v v`}</M> along <M>{t`\v\omega`}</M></h3>
            <ol>
              <li><M>{t`\v e_\omega = \v\omega/|\v\omega|`}</M> is the unit vector in the direction of <M>{t`\v\omega`}</M> (length <M p=").">1</M></li>
              <li><M>{t`\v v_P\cdot\v e_\omega`}</M> is the <b>projection</b> of <M>{t`\v v_P`}</M> onto the direction of <M p=":">{t`\v\omega`}</M> how much of <M>{t`\v v_P`}</M> points along <M>{t`\v\omega`}</M> – like the shadow of the arrow on the <M>{t`\v\omega`}</M> line.</li>
              <li>Take the dot product of both sides of the fundamental equation with <M p=".">{t`\v e_\omega`}</M> The last term is struck out in the notes because it is zero: a cross product is perpendicular to both factors, so <M>{t`\v\omega\times\v{BP}`}</M> is perpendicular to <M p=",">{t`\v\omega`}</M> and its projection onto <M>{t`\v\omega`}</M> is <M p=".">0</M></li>
              <li>What remains is <M p=":">{t`\v v_P\cdot\v e_\omega = \v v_B\cdot\v e_\omega`}</M> the same number at every point. So the corresponding vector <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\,\v e_\omega`}</M> is the same everywhere, too.</li>
            </ol>
            <p>For a screw, <M>{t`\v v_\omega`}</M> is the speed at which it advances into the wood – and that is the same for all points of the screw. In the figure below you can move <M>P</M> through the body:</p>
          </>}
        />
        <InvariantExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="zentralachse" title={<T de="3. Zentralachse und Schraube" en="3. Central axis and screw" />}>
        <Box kind="lecture" src={<Src p={24} fig="Fig. 3.16" />} title={<T de="Physikalisch / anschauliche Interpretation" en="Physical / intuitive interpretation" />}>
          <T
            de={<p>Fig. 3.16 «Zentralachse und Schraube»: In <M>B</M> die Vektoren <M p=",">{t`\v v_B`}</M> <M p=",">{t`\v\omega`}</M> <M>{t`\v v_\omega`}</M> (blau, parallel zu <M p=")">{t`\v\omega`}</M> und <M p=";">{t`(\v v_B)^\perp`}</M> eine Gerade <M>g</M> durch <M p=";">B</M> darauf ein Punkt <M>P</M> im Abstand <M>x</M> von <M p=";">B</M> der Einheitsvektor <M p=";">{t`\v e^\perp`}</M> die Zentralachse <M>\zeta</M> (gelbes Band, parallel zu <M p=")">{t`\v\omega`}</M> durch <M>Z</M> mit <M p=";">{t`\v v_Z = \v v_\omega`}</M> weiter ein Punkt <M>{t`B^*`}</M> mit <M>{t`\v v_{B^*}`}</M> und <M p=",">{t`(\v v_{B^*})^\perp`}</M> und <M p=".">{t`Z'`}</M> Neben der Figur:</p>}
            en={<p>Fig. 3.16 “central axis and screw” (<span lang="de">Zentralachse und Schraube</span>): at <M>B</M> the vectors <M p=",">{t`\v v_B`}</M> <M p=",">{t`\v\omega`}</M> <M>{t`\v v_\omega`}</M> (blue, parallel to <M p=")">{t`\v\omega`}</M> and <M p=";">{t`(\v v_B)^\perp`}</M> a line <M>g</M> through <M p=";">B</M> on it a point <M>P</M> at distance <M>x</M> from <M p=";">B</M> the unit vector <M p=";">{t`\v e^\perp`}</M> the central axis <M>\zeta</M> (yellow band, parallel to <M p=")">{t`\v\omega`}</M> through <M>Z</M> with <M p=";">{t`\v v_Z = \v v_\omega`}</M> also a point <M>{t`B^*`}</M> with <M>{t`\v v_{B^*}`}</M> and <M p=",">{t`(\v v_{B^*})^\perp`}</M> and <M p=".">{t`Z'`}</M> Beside the figure:</p>}
          />
          <MD>{t`\begin{aligned}
\v v_P &= \v v_B + \v\omega\times\v{BP}\\
\v v_P &= \v v_\omega + \v v_B^\perp + \v\omega\times\v{BP}\\
\v v_P &= \v v_\omega + v_B^\perp\cdot\v e^\perp - \omega\cdot x\cdot\v e^\perp\\
\v v_P &= \v v_\omega + (v_B^\perp - \omega\cdot x)\cdot\v e^\perp
\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man die vier Zeilen:</b></p>
            <ol>
              <li>Die Grundgleichung für einen Punkt <M>P</M> auf der Geraden <M p=".">g</M> <M>g</M> geht durch <M>B</M> und steht senkrecht auf <M>{t`\v\omega`}</M> und auf <M p=".">{t`\v v_B^\perp`}</M></li>
              <li><M>{t`\v v_B`}</M> wird zerlegt: <M>{t`\v v_B = \v v_\omega + \v v_B^\perp`}</M> – der Teil entlang <M>{t`\v\omega`}</M> plus der Teil senkrecht dazu.</li>
              <li><M>{t`\v e^\perp`}</M> ist der Einheitsvektor in Richtung <M p=",">{t`\v v_B^\perp`}</M> und <M>{t`v_B^\perp`}</M> (ohne Strich) dessen Länge. Also <M p=".">{t`\v v_B^\perp = v_B^\perp\,\v e^\perp`}</M> Der Drehteil <M>{t`\v\omega\times\v{BP}`}</M> hat die Länge <M p=",">{t`\omega\,x`}</M> weil <M>{t`\v{BP}`}</M> (Länge <M p=")">x</M> senkrecht auf <M>{t`\v\omega`}</M> steht. Er steht senkrecht auf <M>{t`\v\omega`}</M> und auf <M p=",">g</M> zeigt also entlang <M>{t`\v e^\perp`}</M> – auf der Seite von <M>g</M> wie in der Figur <em>gegen</em> <M p=":">{t`\v v_B^\perp`}</M> <M p=".">{t`-\omega x\,\v e^\perp`}</M></li>
              <li>Zusammengefasst: Der Teil entlang <M>{t`\v\omega`}</M> bleibt <M p=",">{t`\v v_\omega`}</M> der senkrechte Teil hat die Länge <M p=".">{t`v_B^\perp - \omega x`}</M> Er wird kleiner, je weiter <M>P</M> von <M>B</M> weg ist.</li>
            </ol>
            <p>Bei <M>{t`x = v_B^\perp/\omega`}</M> ist die Klammer null. Dort liegt der Punkt <M p=":">Z</M> Er hat nur noch <M p=".">{t`\v v_Z = \v v_\omega`}</M> Und nicht nur er: Schiebt man <M>Z</M> parallel zu <M>{t`\v\omega`}</M> weiter (zum Beispiel nach <M p=",">{t`Z'`}</M> ändert sich <M>{t`\v{BZ}`}</M> nur um ein Vielfaches von <M p=",">{t`\v\omega`}</M> und <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> Also hat die ganze Gerade durch <M>Z</M> parallel zu <M>{t`\v\omega`}</M> die Geschwindigkeit <M p=".">{t`\v v_\omega`}</M> Das ist die <b>Zentralachse</b> <M p=".">\zeta</M></p>
          </>}
          en={<>
            <p><b>How to read the four lines:</b></p>
            <ol>
              <li>The fundamental equation for a point <M>P</M> on the line <M p=".">g</M> <M>g</M> passes through <M>B</M> and is perpendicular to <M>{t`\v\omega`}</M> and to <M p=".">{t`\v v_B^\perp`}</M></li>
              <li><M>{t`\v v_B`}</M> is split: <M>{t`\v v_B = \v v_\omega + \v v_B^\perp`}</M> – the part along <M>{t`\v\omega`}</M> plus the part perpendicular to it.</li>
              <li><M>{t`\v e^\perp`}</M> is the unit vector in the direction of <M p=",">{t`\v v_B^\perp`}</M> and <M>{t`v_B^\perp`}</M> (without the bar) its length. So <M p=".">{t`\v v_B^\perp = v_B^\perp\,\v e^\perp`}</M> The turning part <M>{t`\v\omega\times\v{BP}`}</M> has the length <M p=",">{t`\omega\,x`}</M> because <M>{t`\v{BP}`}</M> (length <M p=")">x</M> is perpendicular to <M p=".">{t`\v\omega`}</M> It is perpendicular to <M>{t`\v\omega`}</M> and to <M p=",">g</M> so it points along <M>{t`\v e^\perp`}</M> – on the side of <M>g</M> taken in the figure <em>against</em> <M p=":">{t`\v v_B^\perp`}</M> <M p=".">{t`-\omega x\,\v e^\perp`}</M></li>
              <li>Collected: the part along <M>{t`\v\omega`}</M> stays <M p=",">{t`\v v_\omega`}</M> the perpendicular part has the length <M p=".">{t`v_B^\perp - \omega x`}</M> It gets smaller the further <M>P</M> is from <M p=".">B</M></li>
            </ol>
            <p>At <M>{t`x = v_B^\perp/\omega`}</M> the bracket is zero. That is where the point <M>Z</M> lies. It only has <M p=".">{t`\v v_Z = \v v_\omega`}</M> And not only <M p=":">Z</M> moving <M>Z</M> on parallel to <M>{t`\v\omega`}</M> (for example to <M p=")">{t`Z'`}</M> changes <M>{t`\v{BZ}`}</M> only by a multiple of <M p=",">{t`\v\omega`}</M> and <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> So the whole line through <M>Z</M> parallel to <M>{t`\v\omega`}</M> has the velocity <M p=".">{t`\v v_\omega`}</M> This is the <b>central axis</b> (<span lang="de">Zentralachse</span>) <M p=".">\zeta</M></p>
          </>}
        />
        <Derivation title={<T de="Fig. 3.16 Schritt für Schritt – bis zur Schraubung" en="Fig. 3.16 step by step – up to the screw motion" />}>
          <StepPlayer
            label={tr('Animation: Zentralachse und Schraube (Fig. 3.16)', 'Animation: central axis and screw (Fig. 3.16)')}
            steps={[
              { ms: 1800, holdMs: 3500, caption: <T
                de={<>Ein Körper bewegt sich. In <M>B</M> kennen wir die Kinemate: <M>{t`\v v_B`}</M> (rot) und <M>{t`\v\omega`}</M> (violett). Mehr braucht die Grundgleichung nicht.</>}
                en={<>A body moves. At <M>B</M> we know the Kinemate: <M>{t`\v v_B`}</M> (red) and <M>{t`\v\omega`}</M> (purple). The fundamental equation needs nothing more.</>} /> },
              { ms: 2600, holdMs: 3500, caption: <T
                de={<><M>{t`\v v_B`}</M> wird zerlegt: blau der Teil entlang <M p=",">{t`\v\omega`}</M> <M p=";">{t`\v v_\omega`}</M> orange der Teil senkrecht dazu, <M p=".">{t`\v v_B^\perp`}</M> Zusammen ergeben sie <M p=".">{t`\v v_B`}</M></>}
                en={<><M>{t`\v v_B`}</M> is split: blue the part along <M p=",">{t`\v\omega`}</M> <M p=";">{t`\v v_\omega`}</M> orange the part perpendicular to it, <M p=".">{t`\v v_B^\perp`}</M> Together they give <M p=".">{t`\v v_B`}</M></>} /> },
              { ms: 6000, holdMs: 4500, caption: <T
                de={<>Die Gerade <M>g</M> steht senkrecht auf <M>{t`\v\omega`}</M> und <M p=".">{t`\v v_B^\perp`}</M> Wandert <M>P</M> um <M>x</M> von <M>B</M> weg, wächst der Drehteil <M>{t`\v\omega\times\v{BP}`}</M> (violett) und zeigt gegen <M>{t`\v v_B^\perp`}</M> (orange Kopie). Also <M p=".">{t`\v v_P = \v v_\omega + (v_B^\perp - \omega x)\,\v e^\perp`}</M></>}
                en={<>The line <M>g</M> is perpendicular to <M>{t`\v\omega`}</M> and <M p=".">{t`\v v_B^\perp`}</M> As <M>P</M> moves a distance <M>x</M> away from <M p=",">B</M> the turning part <M>{t`\v\omega\times\v{BP}`}</M> (purple) grows and points against <M>{t`\v v_B^\perp`}</M> (orange copy). So <M p=".">{t`\v v_P = \v v_\omega + (v_B^\perp - \omega x)\,\v e^\perp`}</M></>} /> },
              { ms: 5000, holdMs: 4500, caption: <T
                de={<>Bei <M>{t`x = v_B^\perp/\omega`}</M> heben sich Orange und Violett auf: Im Punkt <M>Z</M> bleibt nur <M p=".">{t`\v v_Z = \v v_\omega`}</M> Dasselbe gilt auf der ganzen Geraden durch <M>Z</M> parallel zu <M>{t`\v\omega`}</M> (etwa in <M p="):">{t`Z'`}</M> der Zentralachse <M p=".">\zeta</M></>}
                en={<>At <M>{t`x = v_B^\perp/\omega`}</M> orange and purple cancel: at the point <M>Z</M> only <M>{t`\v v_Z = \v v_\omega`}</M> remains. The same holds on the whole line through <M>Z</M> parallel to <M>{t`\v\omega`}</M> (e.g. at <M p="):">{t`Z'`}</M> the central axis <M p=".">\zeta</M></>} /> },
              { ms: 5000, holdMs: 4000, caption: <T
                de={<>Hinter <M p=",">Z</M> im Punkt <M p=",">{t`B^*`}</M> ist Violett länger als Orange: Der senkrechte Teil zeigt jetzt in die Gegenrichtung. Die Spitzen aller roten Pfeile liegen auf einer Geraden – <M>{t`\v v`}</M> ändert sich gleichmässig mit <M p=".">x</M></>}
                en={<>Beyond <M p=",">Z</M> at the point <M p=",">{t`B^*`}</M> purple is longer than orange: the perpendicular part now points the other way. The tips of all red arrows lie on one straight line – <M>{t`\v v`}</M> changes evenly with <M p=".">x</M></>} /> },
              { ms: 4500, holdMs: 4500, caption: <T
                de={<>Rund um <M>\zeta</M> zeigen die senkrechten Teile entlang eines Kreises: Das ist eine Drehung um <M p=",">\zeta</M> <M p=".">{t`\v\omega\times\v{ZP}`}</M> Zusammen also <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M></>}
                en={<>All around <M>\zeta</M> the perpendicular parts point along a circle: this is a turning about <M p=",">\zeta</M> <M p=".">{t`\v\omega\times\v{ZP}`}</M> Together: <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M></>} /> },
              { ms: 11000, caption: <T
                de={<>Jetzt bewegt sich der Körper: Er dreht sich um <M>\zeta</M> und gleitet dabei mit <M>{t`\v v_\omega`}</M> entlang <M>\zeta</M> – eine Schraubung. <M>B</M> läuft auf einer Schraubenlinie, <M>Z</M> geradeaus. Die blassen Kopien zeigen jede Vierteldrehung (hier bleibt die Kinemate gleich).</>}
                en={<>Now the body moves: it turns about <M>\zeta</M> and slides with <M>{t`\v v_\omega`}</M> along <M>\zeta</M> – a screw motion. <M>B</M> moves on a helix, <M>Z</M> straight on. The faint copies show every quarter turn (here the Kinemate stays the same).</>} /> },
            ]}
          >
            {(step, tt) => <ScrewAnim step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<>
            <p><b>Warum «Schraube»?</b> Nimmt man einen Punkt <M>Z</M> auf <M>\zeta</M> als Bezugspunkt, lautet die Grundgleichung</p>
            <MD>{t`\v v_P = \underbrace{\v v_\omega}_{\text{entlang }\zeta} + \underbrace{\v\omega\times\v{ZP}}_{\text{Drehung um }\zeta}.`}</MD>
            <p>Der erste Teil ist für alle Punkte gleich: ein Gleiten entlang <M p=".">\zeta</M> Der zweite ist eine Drehung um die Achse <M p=".">\zeta</M> Drehen und gleichzeitig entlang der Drehachse gleiten – genau das tut eine Schraube.</p>
          </>}
          en={<>
            <p><b>Why “screw”?</b> Taking a point <M>Z</M> on <M>\zeta</M> as the reference point, the fundamental equation reads</p>
            <MD>{t`\v v_P = \underbrace{\v v_\omega}_{\text{along }\zeta} + \underbrace{\v\omega\times\v{ZP}}_{\text{turning about }\zeta}.`}</MD>
            <p>The first part is the same for all points: a sliding along <M p=".">\zeta</M> The second is a turning about the axis <M p=".">\zeta</M> Turning and at the same time sliding along the axis of turning – that is exactly what a screw does.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="schraube" title={<T de="4. Die Schraube und die Geschwindigkeiten" en="4. The screw and the speeds" />}>
        <Box kind="lecture" src={<Src p={25} />} title={<T de="Schraubung um die Zentralachse" en={<>Screw motion about the central axis (<span lang="de">Schraubung</span>)</>} />}>
          <T
            de={<>
              <p>Allgemeine Bewegung als «Schraubung» um Zentralachse <M p=".">\zeta</M> <M p=":">\zeta</M> Zentralachse / Schraubungsachse. Kinemate der Punkte auf <M p=":">\zeta</M> <M p=",">{t`\{\v v_\omega, \v\omega\}`}</M> «Schraube» (handschriftlich: <M>{t`\to \v v_\omega`}</M> ist invariabel). <M>\to</M> Bestimmung der Lage der Zentralachse bei allgemeinem Bewegungszustand.</p>
              <p><M p=":">{t`|\v v|_{max}`}</M> Maximaler Abstand von <M p=";">\zeta</M> <M p=":">{t`|\v v|_{min}`}</M> Minimaler Abstand von <M p=".">\zeta</M></p>
              <p><b>Merke:</b> <M>\zeta</M> braucht nicht materieller Bestandteil von Körper zu sein. (Handschriftlich: <M>\zeta</M> i.A. nicht im Körper; <M>\zeta</M> zeitlich veränderbar.)</p>
              <p>• Schraube <M p=":">{t`\{\v v_\omega, \v\omega\}`}</M> Kinemate der Punkte auf <M p=".">\zeta</M> • 1. Invariante: <M p=",">{t`\v\omega`}</M> 2. Invariante: <M p=":">{t`\v v_\omega`}</M> <M p=".">{t`\to |\v v_\omega| = \v v_B\cdot\frac{\v\omega}{|\v\omega|}`}</M></p>
            </>}
            en={<>
              <p>General motion as a “screw motion” about the central axis <M p=".">\zeta</M> <M p=":">\zeta</M> central axis / screw axis (<span lang="de">Zentralachse / Schraubungsachse</span>). Kinemate of the points on <M p=":">\zeta</M> <M p=",">{t`\{\v v_\omega, \v\omega\}`}</M> “screw” (<span lang="de">Schraube</span>; handwritten: <M>{t`\to \v v_\omega`}</M> is invariable). <M>\to</M> Determining the position of the central axis for a general state of motion.</p>
              <p><M p=":">{t`|\v v|_{max}`}</M> maximal distance from <M p=";">\zeta</M> <M p=":">{t`|\v v|_{min}`}</M> minimal distance from <M p=".">\zeta</M></p>
              <p><b>Note:</b> <M>\zeta</M> need not be a material part of the body. (Handwritten: <M>\zeta</M> in general not in the body; <M>\zeta</M> changes with time.)</p>
              <p>• Screw <M p=":">{t`\{\v v_\omega, \v\omega\}`}</M> Kinemate of the points on <M p=".">\zeta</M> • 1st invariant: <M p=",">{t`\v\omega`}</M> 2nd invariant: <M p=":">{t`\v v_\omega`}</M> <M p=".">{t`\to |\v v_\omega| = \v v_B\cdot\frac{\v\omega}{|\v\omega|}`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Für die Punkte auf <M>\zeta</M> ist die Kinemate besonders einfach: <M p=".">{t`\{\v v_\omega, \v\omega\}`}</M> Beide Vektoren zeigen in dieselbe Richtung (oder <M>{t`\v v_\omega`}</M> genau entgegen). Dieses Paar heisst <b>Schraube</b>.</li>
              <li>«<M p=":">{t`|\v v|_{min}`}</M> Minimaler Abstand» ist eine Kurzschrift: Die <em>kleinste</em> Geschwindigkeit haben die Punkte mit dem kleinsten Abstand von <M>\zeta</M> – die Punkte auf <M>\zeta</M> selbst. Die grösste hat der Punkt des Körpers, der am weitesten von <M>\zeta</M> weg ist. Die Formel dazu steht gleich unten.</li>
              <li><M>{t`|\v v_\omega| = \v v_B\cdot\v\omega/|\v\omega|`}</M> ist die Formel für die 2. Invariante: <M>{t`\v\omega/|\v\omega|`}</M> ist <M p=",">{t`\v e_\omega`}</M> also steht hier <M p=".">{t`\v v_B\cdot\v e_\omega`}</M> Genau genommen ist das eine Zahl mit Vorzeichen: Sie ist negativ, wenn <M>{t`\v v_\omega`}</M> gegen <M>{t`\v\omega`}</M> zeigt (Linksgewinde). Die Betragsstriche sind dann nicht wörtlich zu nehmen.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>For the points on <M>\zeta</M> the Kinemate is especially simple: <M p=".">{t`\{\v v_\omega, \v\omega\}`}</M> Both vectors point in the same direction (or <M>{t`\v v_\omega`}</M> exactly the opposite way). This pair is called a <b>screw</b> (<span lang="de">Schraube</span>).</li>
              <li>“<M p=":">{t`|\v v|_{min}`}</M> minimal distance” is shorthand: the <em>smallest</em> speed belongs to the points with the smallest distance from <M>\zeta</M> – the points on <M>\zeta</M> themselves. The largest belongs to the point of the body farthest from <M p=".">\zeta</M> The formula follows right below.</li>
              <li><M>{t`|\v v_\omega| = \v v_B\cdot\v\omega/|\v\omega|`}</M> is the formula for the 2nd invariant: <M>{t`\v\omega/|\v\omega|`}</M> is <M p=",">{t`\v e_\omega`}</M> so this says <M p=".">{t`\v v_B\cdot\v e_\omega`}</M> Strictly, this is a number with a sign: it is negative when <M>{t`\v v_\omega`}</M> points against <M>{t`\v\omega`}</M> (left-handed thread). The absolute-value bars are then not meant literally.</li>
            </ol>
          </>}
        />
        <Box kind="supplement" title={<T de="Wie schnell ist ein Punkt im Abstand d von ζ?" en="How fast is a point at distance d from ζ?" />}>
          <T
            de={<>
              <p>Sei <M>d</M> der Abstand des Punktes <M>P</M> von der Zentralachse. Mit <M>Z</M> auf <M>\zeta</M> gilt <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M> Die beiden Teile stehen senkrecht aufeinander (der erste zeigt entlang <M p=",">{t`\v\omega`}</M> der zweite senkrecht dazu). Darum gilt Pythagoras. Und <M>{t`|\v\omega\times\v{ZP}| = \omega\,d`}</M> – vom Vektor <M>{t`\v{ZP}`}</M> zählt nur der Teil senkrecht zu <M p=",">{t`\v\omega`}</M> und der ist <M>d</M> lang:</p>
              <MD>{t`|\v v_P|^2 = v_\omega^2 + \omega^2 d^2 .`}</MD>
              <p>Auf <M>\zeta</M> (<M p=")">{t`d = 0`}</M> ist die Geschwindigkeit am kleinsten, <M p=".">{t`|\v v_\omega|`}</M> Mit wachsendem Abstand wird sie grösser – so meint das Skript «<M p=":">{t`|\v v|_{max}`}</M> Maximaler Abstand von <M p="».">\zeta</M></p>
            </>}
            en={<>
              <p>Let <M>d</M> be the distance of the point <M>P</M> from the central axis. With <M>Z</M> on <M p=",">\zeta</M> <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M> The two parts are perpendicular to each other (the first points along <M p=",">{t`\v\omega`}</M> the second perpendicular to it). So Pythagoras applies. And <M>{t`|\v\omega\times\v{ZP}| = \omega\,d`}</M> – of the vector <M>{t`\v{ZP}`}</M> only the part perpendicular to <M>{t`\v\omega`}</M> counts, and that is <M>d</M> long:</p>
              <MD>{t`|\v v_P|^2 = v_\omega^2 + \omega^2 d^2 .`}</MD>
              <p>On <M>\zeta</M> (<M p=")">{t`d = 0`}</M> the speed is smallest, <M p=".">{t`|\v v_\omega|`}</M> It grows with the distance – this is what the notes mean by “<M p=":">{t`|\v v|_{max}`}</M> maximal distance from <M p="”.">\zeta</M></p>
            </>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Die Lage von ζ direkt ausrechnen" en="Computing the position of ζ directly" />}>
          <T
            de={<>
              <p>Aus der Konstruktion von Fig. 3.16 folgt eine Formel. <M>Z</M> liegt von <M>B</M> aus um <M>{t`x = v_B^\perp/\omega`}</M> entlang <M>g</M> entfernt, und <M>g</M> zeigt in Richtung <M p=".">{t`\v e_\omega\times\v e^\perp`}</M> Zusammen, mit <M>{t`\v\omega\times\v v_\omega = \v 0`}</M> (parallele Vektoren):</p>
              <MD>{t`\v r_Z = \v r_B + \frac{v_B^\perp}{\omega}\,\v e_\omega\times\v e^\perp = \v r_B + \frac{\v\omega\times\v v_B^\perp}{|\v\omega|^2} = \v r_B + \frac{\v\omega\times\v v_B}{|\v\omega|^2}.`}</MD>
              <p>Das ist der Punkt von <M p=",">\zeta</M> der <M>B</M> am nächsten liegt. Die Tests rechnen nach, dass die Konstruktion und diese Formel denselben Punkt geben und dass dort <M>{t`\v v = \v v_\omega`}</M> gilt.</p>
            </>}
            en={<>
              <p>The construction of Fig. 3.16 gives a formula. <M>Z</M> lies at the distance <M>{t`x = v_B^\perp/\omega`}</M> from <M>B</M> along <M p=",">g</M> and <M>g</M> points in the direction <M p=".">{t`\v e_\omega\times\v e^\perp`}</M> Together, with <M>{t`\v\omega\times\v v_\omega = \v 0`}</M> (parallel vectors):</p>
              <MD>{t`\v r_Z = \v r_B + \frac{v_B^\perp}{\omega}\,\v e_\omega\times\v e^\perp = \v r_B + \frac{\v\omega\times\v v_B^\perp}{|\v\omega|^2} = \v r_B + \frac{\v\omega\times\v v_B}{|\v\omega|^2}.`}</MD>
              <p>This is the point of <M>\zeta</M> closest to <M p=".">B</M> The tests check that the construction and this formula give the same point and that <M>{t`\v v = \v v_\omega`}</M> holds there.</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>Zur Merke-Zeile:</b> <M>\zeta</M> ist eine gedachte Gerade, kein Teil des Körpers. Ein Auto in einer Kurve dreht sich um eine Achse, die senkrecht durch den Kurvenmittelpunkt geht – weit neben dem Auto. Und weil sich die Kinemate meist mit der Zeit ändert, wandert auch <M p=".">\zeta</M> In der Animation oben wurde die Kinemate nur festgehalten, damit man die Schraubung sehen kann.</p>}
          en={<p><b>About the “note” line:</b> <M>\zeta</M> is an imagined line, not a part of the body. A car in a bend turns about an axis that passes vertically through the centre of the bend – far beside the car. And because the Kinemate usually changes with time, <M>\zeta</M> wanders too. In the animation above the Kinemate was only held fixed so that the screw motion can be seen.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="spezialfaelle" title={<T de="5. Spezialfälle" en="5. Special cases" />}>
        <Box kind="lecture" src={<Src p={25} />} title={<T de="Spezialfälle" en={<>Special cases (<span lang="de">Spezialfälle</span>)</>} />}>
          <T
            de={<ul>
              <li><M>{t`\v\omega = \v 0 \to`}</M> Translation</li>
              <li><M>{t`\v\omega \ne \v 0,\ \v v_B = \v 0 \to`}</M> Rotation, <M>{t`B \in \mu`}</M> (handschriftlich: <M>\to</M> kein <M p=")">{t`\v v_\omega`}</M></li>
              <li><M>{t`\v\omega \ne \v 0,\ \v v_B \perp \v\omega \to`}</M> Rotation, <M>{t`B \notin \mu`}</M> (handschriftlich: <M>\to</M> keine Schraubung, <M>\zeta</M> wird zur Rotationsachse)</li>
            </ul>}
            en={<ul>
              <li><M>{t`\v\omega = \v 0 \to`}</M> translation</li>
              <li><M>{t`\v\omega \ne \v 0,\ \v v_B = \v 0 \to`}</M> rotation, <M>{t`B \in \mu`}</M> (handwritten: <M>\to</M> no <M p=")">{t`\v v_\omega`}</M></li>
              <li><M>{t`\v\omega \ne \v 0,\ \v v_B \perp \v\omega \to`}</M> rotation, <M>{t`B \notin \mu`}</M> (handwritten: <M>\to</M> no screw motion, <M>\zeta</M> becomes the rotation axis)</li>
            </ul>}
          />
          <T de={<p><M>\to</M> Wichtige Anwendung: Ebene Bewegung.</p>} en={<p><M>\to</M> Important application: plane motion (<span lang="de">Ebene Bewegung</span>).</p>} />
        </Box>
        <T
          de={<>
            <p><b>So liest man die drei Fälle</b> (<M>\mu</M> ist wie auf S. 15 die Rotationsachse):</p>
            <ol>
              <li><M p=":">{t`\v\omega = \v 0`}</M> Es gibt keine Drehung und darum keine Zentralachse – die Formel für <M>Z</M> müsste durch <M>{t`|\v\omega|^2 = 0`}</M> teilen. Alle Punkte bewegen sich gleich: eine Translation.</li>
              <li><M p=":">{t`\v v_B = \v 0`}</M> <M>B</M> ruht. Dann ist <M>{t`\v v_\omega = (\v v_B\cdot\v e_\omega)\,\v e_\omega = \v 0`}</M> – kein Gleiten, also eine reine Rotation. <M>B</M> liegt auf der Achse <M>\mu</M> (die hier <M>\zeta</M> ist).</li>
              <li><M p=":">{t`\v v_B \perp \v\omega`}</M> <M>B</M> bewegt sich, aber senkrecht zu <M p=".">{t`\v\omega`}</M> Wieder ist <M p=":">{t`\v v_\omega = \v 0`}</M> keine Schraubung, nur eine Drehung. Die Punkte auf <M>\zeta</M> haben jetzt die Geschwindigkeit <M>{t`\v 0`}</M> – <M>\zeta</M> ist die Rotationsachse, und <M>B</M> liegt nicht darauf.</li>
            </ol>
            <p>Probier die drei Fälle aus. «Steigung» ist <M p=":">{t`p = v_\omega/\omega`}</M> wie weit der Körper pro Bogenmass Drehung entlang <M>\zeta</M> vorrückt (pro Umdrehung <M p=")">{t`2\pi p`}</M></p>
          </>}
          en={<>
            <p><b>How to read the three cases</b> (<M>\mu</M> is the rotation axis, as on p. 15):</p>
            <ol>
              <li><M p=":">{t`\v\omega = \v 0`}</M> there is no turning and therefore no central axis – the formula for <M>Z</M> would divide by <M p=".">{t`|\v\omega|^2 = 0`}</M> All points move alike: a translation.</li>
              <li><M p=":">{t`\v v_B = \v 0`}</M> <M>B</M> is at rest. Then <M>{t`\v v_\omega = (\v v_B\cdot\v e_\omega)\,\v e_\omega = \v 0`}</M> – no sliding, so a pure rotation. <M>B</M> lies on the axis <M>\mu</M> (which is <M>\zeta</M> here).</li>
              <li><M p=":">{t`\v v_B \perp \v\omega`}</M> <M>B</M> moves, but perpendicular to <M p=".">{t`\v\omega`}</M> Again <M p=":">{t`\v v_\omega = \v 0`}</M> no screw motion, only a turning. The points on <M>\zeta</M> now have the velocity <M>{t`\v 0`}</M> – <M>\zeta</M> is the rotation axis, and <M>B</M> is not on it.</li>
            </ol>
            <p>Try the three cases. “Pitch” is <M p=":">{t`p = v_\omega/\omega`}</M> how far the body advances along <M>\zeta</M> per radian of turning (per full turn <M p=").">{t`2\pi p`}</M></p>
          </>}
        />
        <ScrewExplorer />
        <T
          de={<p><b>Ausblick:</b> Bei einer <b>ebenen Bewegung</b> liegen alle Geschwindigkeiten in einer Ebene und <M>{t`\v\omega`}</M> steht senkrecht darauf. Dann ist immer <M p=",">{t`\v v_B \perp \v\omega`}</M> also der dritte Fall: keine Schraubung, nur eine Drehung um <M p=".">\zeta</M> Wo <M>\zeta</M> die Ebene durchstösst, ruht ein Punkt – darum geht es in der nächsten Lektion, <a href="#ebene-bewegung">Ebene Bewegung &amp; Momentanzentrum</a>.</p>}
          en={<p><b>Looking ahead:</b> in a <b>plane motion</b> all velocities lie in one plane and <M>{t`\v\omega`}</M> is perpendicular to it. Then always <M p=",">{t`\v v_B \perp \v\omega`}</M> the third case: no screw motion, only a turning about <M p=".">\zeta</M> Where <M>\zeta</M> pierces the plane, a point is at rest – that is the topic of the next lesson, <a href="#ebene-bewegung">Plane motion and instantaneous centre</a>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="beispiel" title={<T de="6. Beispiel: Würfel (Problem Fig. 3.30)" en="6. Example: cube (Problem Fig. 3.30)" />}>
        <Box kind="lecture" src={<Src p={25} fig="Fig. 3.30" />} title={<T de="Problem Figur 3.30" en="Problem figure 3.30" />}>
          <T
            de={<>
              <p>Figur: Würfel mit Kante <M>{t`1\,\text{m}`}</M> (Daten neben der Figur: <M p="),">{t`1\,\text{m},\ 2\,\text{m/s},\ 2\,\text{s}^{-1}`}</M> <M>x</M> zum Betrachter, <M>y</M> nach rechts, <M>z</M> nach oben, <M>B</M> an einer unteren Ecke, <M>{t`\v v_B`}</M> diagonal, <M>{t`\v\omega`}</M> entlang <M p=";">y</M> <M>\zeta</M> grün entlang der vorderen unteren Kante. Zweite Figur: <M p=",">{t`\v v_B^\perp = (0, 0, 2)`}</M> <M p=",">{t`\v v_B = (0, 2, 2)`}</M> <M p=",">{t`\v\omega = (0, 2, 0)`}</M> Kante <M p=".">1</M></p>
              <p>Lösung (handschriftlich). Gegeben: Kinemate in <M>B</M> <M p=".">{t`(\v v_B; \v\omega)`}</M> Gesucht: <M p=".">\zeta</M></p>
            </>}
            en={<>
              <p>Figure: cube of edge <M>{t`1\,\text{m}`}</M> (data beside the figure: <M p="),">{t`1\,\text{m},\ 2\,\text{m/s},\ 2\,\text{s}^{-1}`}</M> <M>x</M> toward the viewer, <M>y</M> to the right, <M>z</M> up, <M>B</M> at a bottom corner, <M>{t`\v v_B`}</M> diagonal, <M>{t`\v\omega`}</M> along <M p=";">y</M> <M>\zeta</M> in green along the bottom front edge. Second figure: <M p=",">{t`\v v_B^\perp = (0, 0, 2)`}</M> <M p=",">{t`\v v_B = (0, 2, 2)`}</M> <M p=",">{t`\v\omega = (0, 2, 0)`}</M> edge <M p=".">1</M></p>
              <p>Solution (handwritten). Given: Kinemate at <M>B</M> <M p=".">{t`(\v v_B; \v\omega)`}</M> Wanted: <M p=".">\zeta</M></p>
            </>}
          />
          <MD>{t`\begin{aligned}
&\v v_B = (0, 2, 2);\qquad (\v v_B\cdot\v e_\omega) = (0, 2, 2)\cdot(0, 1, 0) = 2;\qquad \v v_P = \v v_\omega = 2\cdot\v e_\omega\\
&P \in \zeta \Rightarrow \v v_P = \v v_\omega \iff \v v_P = \v v_B\cdot\v\omega\times\v{BP}\\
&\iff (0, 2, 0) = (0, 2, 2)\cdot(0, 2, 0)\times(x_P, y_P, z_P) \iff (0, 0, -2) = (2z_P, 0, -2x_P)\\
&\Rightarrow\ z_P = 0,\quad y_P\ \text{${tr('beliebig', 'arbitrary')}},\quad x_P = 1\\
&\zeta\colon\ (1, 0, 0) + \lambda\,(0, 1, 0)
\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p>Zwei Hinweise zur Mitschrift: Der Punkt «<M>{t`\cdot`}</M>» in der zweiten und dritten Zeile ist ein Schreibfehler für «<M p="»">+</M> – gemeint ist die Grundgleichung <M p=",">{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M> wie die nächste Zeile zeigt. Und <M>B</M> liegt im Ursprung, darum ist <M p=".">{t`\v{BP} = (x_P, y_P, z_P)`}</M></p>
            <p><b>So liest man die Lösung:</b></p>
            <ol>
              <li><M>{t`\v\omega = (0, 2, 0)`}</M> hat die Länge <M p=",">2</M> also <M p=".">{t`\v e_\omega = (0, 1, 0)`}</M> Die Projektion ist <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Damit <M>{t`\v v_\omega = 2\,\v e_\omega = (0, 2, 0)`}</M> und <M p=".">{t`\v v_B^\perp = \v v_B - \v v_\omega = (0, 0, 2)`}</M></li>
              <li>Ein Punkt <M>P</M> liegt auf <M p=",">\zeta</M> wenn er nur die Geschwindigkeit <M>{t`\v v_\omega`}</M> hat. Grundgleichung einsetzen und <M>{t`\v v_B`}</M> auf die andere Seite bringen: <M p=".">{t`\v\omega\times\v{BP} = \v v_\omega - \v v_B = (0, 0, -2)`}</M></li>
              <li>Das Kreuzprodukt ausgerechnet: <M p=".">{t`(0, 2, 0)\times(x_P, y_P, z_P) = (2z_P, 0, -2x_P)`}</M> Komponente für Komponente verglichen: <M>{t`2z_P = 0`}</M> und <M p=",">{t`-2x_P = -2`}</M> also <M>{t`z_P = 0`}</M> und <M p=".">{t`x_P = 1`}</M></li>
              <li><b>Warum ist <M>{t`y_P`}</M> beliebig?</b> In <M>{t`(2z_P, 0, -2x_P)`}</M> kommt <M>{t`y_P`}</M> gar nicht vor. Der Grund: Ändert man <M p=",">{t`y_P`}</M> schiebt man <M>P</M> in Richtung <M>{t`\v\omega`}</M> (entlang <M p=")">y</M> <M>{t`\v{BP}`}</M> ändert sich dabei nur um ein Vielfaches von <M p=",">{t`\v\omega`}</M> und <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> Also hat jeder Punkt <M>{t`(1, y_P, 0)`}</M> dieselbe Geschwindigkeit <M>{t`\v v_\omega`}</M> – eine ganze Gerade parallel zu <M p=".">{t`\v\omega`}</M> Das ist <M p=".">\zeta</M></li>
              <li><M>{t`\zeta\colon (1, 0, 0) + \lambda(0, 1, 0)`}</M> ist die Parameterform einer Geraden. Deine Notiz sagt es: <M>{t`(1, 0, 0)`}</M> ist der <b>Ortsvektor</b> eines Punktes der Geraden (von <M>B</M> aus), <M>{t`(0, 1, 0)`}</M> der <b>Richtungsvektor</b>, der von diesem Punkt ausgeht. Jede Zahl <M>\lambda</M> gibt einen Punkt der Geraden: <M>{t`\lambda = 0`}</M> die Ecke <M p=",">{t`(1, 0, 0)`}</M> <M>{t`\lambda = 1`}</M> die Ecke <M p=".">{t`(1, 1, 0)`}</M> Die Zentralachse ist also die vordere untere Kante des Würfels – wie die grüne Linie in Fig. 3.30.</li>
            </ol>
          </>}
          en={<>
            <p>Two remarks on the notes: the dot “<M>{t`\cdot`}</M>” in the second and third line is a slip for “<M p="”">+</M> – what is meant is the fundamental equation <M p=",">{t`\v v_P = \v v_B + \v\omega\times\v{BP}`}</M> as the next line shows. And <M>B</M> is at the origin, so <M p=".">{t`\v{BP} = (x_P, y_P, z_P)`}</M></p>
            <p><b>How to read the solution:</b></p>
            <ol>
              <li><M>{t`\v\omega = (0, 2, 0)`}</M> has length <M p=",">2</M> so <M p=".">{t`\v e_\omega = (0, 1, 0)`}</M> The projection is <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Hence <M>{t`\v v_\omega = 2\,\v e_\omega = (0, 2, 0)`}</M> and <M p=".">{t`\v v_B^\perp = \v v_B - \v v_\omega = (0, 0, 2)`}</M></li>
              <li>A point <M>P</M> lies on <M>\zeta</M> if its velocity is only <M p=".">{t`\v v_\omega`}</M> Insert the fundamental equation and bring <M>{t`\v v_B`}</M> to the other side: <M p=".">{t`\v\omega\times\v{BP} = \v v_\omega - \v v_B = (0, 0, -2)`}</M></li>
              <li>The cross product worked out: <M p=".">{t`(0, 2, 0)\times(x_P, y_P, z_P) = (2z_P, 0, -2x_P)`}</M> Compared component by component: <M>{t`2z_P = 0`}</M> and <M p=",">{t`-2x_P = -2`}</M> so <M>{t`z_P = 0`}</M> and <M p=".">{t`x_P = 1`}</M></li>
              <li><b>Why is <M>{t`y_P`}</M> arbitrary?</b> <M>{t`y_P`}</M> does not appear in <M>{t`(2z_P, 0, -2x_P)`}</M> at all. The reason: changing <M>{t`y_P`}</M> moves <M>P</M> in the direction of <M>{t`\v\omega`}</M> (along <M p=").">y</M> <M>{t`\v{BP}`}</M> then only changes by a multiple of <M p=",">{t`\v\omega`}</M> and <M p=".">{t`\v\omega\times\v\omega = \v 0`}</M> So every point <M>{t`(1, y_P, 0)`}</M> has the same velocity <M>{t`\v v_\omega`}</M> – a whole line parallel to <M p=".">{t`\v\omega`}</M> That is <M p=".">\zeta</M></li>
              <li><M>{t`\zeta\colon (1, 0, 0) + \lambda(0, 1, 0)`}</M> is the parametric form of a line. Your note says it: <M>{t`(1, 0, 0)`}</M> is the <b>position vector</b> of one point of the line (from <M p=")">B</M> <M>{t`(0, 1, 0)`}</M> the <b>direction vector</b>, which starts at that point. Every number <M>\lambda</M> gives a point of the line: <M>{t`\lambda = 0`}</M> the corner <M p=",">{t`(1, 0, 0)`}</M> <M>{t`\lambda = 1`}</M> the corner <M p=".">{t`(1, 1, 0)`}</M> So the central axis is the bottom front edge of the cube – like the green line in Fig. 3.30.</li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Der Würfel Schritt für Schritt" en="The cube step by step" />}>
          <StepPlayer
            label={tr('Animation: Würfel, Zentralachse (Problem Fig. 3.30)', 'Animation: cube, central axis (Problem Fig. 3.30)')}
            steps={[
              { ms: 1600, holdMs: 3500, caption: <T
                de={<>Gegeben ist die Kinemate in <M p=":">B</M> <M>{t`\v v_B = (0, 2, 2)\,\text{m/s}`}</M> und <M p=".">{t`\v\omega = (0, 2, 0)\,\text{s}^{-1}`}</M> <M>{t`\v\omega`}</M> ist überall gleich (1. Invariante) und darum über dem Würfel gezeichnet.</>}
                en={<>Given is the Kinemate at <M p=":">B</M> <M>{t`\v v_B = (0, 2, 2)\,\text{m/s}`}</M> and <M p=".">{t`\v\omega = (0, 2, 0)\,\text{s}^{-1}`}</M> <M>{t`\v\omega`}</M> is the same everywhere (1st invariant), so it is drawn above the cube.</>} /> },
              { ms: 2600, holdMs: 3500, caption: <T
                de={<><M p=",">{t`\v e_\omega = (0, 1, 0)`}</M> also <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Blau <M p=",">{t`\v v_\omega = (0, 2, 0)`}</M> orange <M p=".">{t`\v v_B^\perp = (0, 0, 2)`}</M></>}
                en={<><M p=",">{t`\v e_\omega = (0, 1, 0)`}</M> so <M p=".">{t`\v v_B\cdot\v e_\omega = 2`}</M> Blue <M p=",">{t`\v v_\omega = (0, 2, 0)`}</M> orange <M p=".">{t`\v v_B^\perp = (0, 0, 2)`}</M></>} /> },
              { ms: 4000, holdMs: 4500, caption: <T
                de={<>In <M p=":">{t`P = (1, 0, 0)`}</M> Zur Kopie von <M>{t`\v v_B`}</M> (grau) kommt <M>{t`\v\omega\times\v{BP} = (0, 0, -2)`}</M> (violett). Übrig bleibt <M p=":">{t`\v v_P = (0, 2, 0) = \v v_\omega`}</M> <M>P</M> liegt auf <M p=".">\zeta</M></>}
                en={<>At <M p=":">{t`P = (1, 0, 0)`}</M> to the copy of <M>{t`\v v_B`}</M> (grey) add <M>{t`\v\omega\times\v{BP} = (0, 0, -2)`}</M> (purple). What remains is <M p=":">{t`\v v_P = (0, 2, 0) = \v v_\omega`}</M> <M>P</M> lies on <M p=".">\zeta</M></>} /> },
              { ms: 4500, holdMs: 4500, caption: <T
                de={<><M>P</M> rutscht entlang der Kante, in Richtung <M p=".">{t`\v\omega`}</M> Die Pfeile bleiben gleich, weil <M p=":">{t`\v\omega\times\v\omega = \v 0`}</M> Darum ist <M>{t`y_P`}</M> beliebig, und die ganze Kante (türkis) gehört zu <M p=".">\zeta</M></>}
                en={<><M>P</M> slides along the edge, in the direction of <M p=".">{t`\v\omega`}</M> The arrows stay the same because <M p=":">{t`\v\omega\times\v\omega = \v 0`}</M> That is why <M>{t`y_P`}</M> is arbitrary, and the whole edge (teal) belongs to <M p=".">\zeta</M></>} /> },
              { ms: 3500, holdMs: 4500, caption: <T
                de={<><M p=".">{t`\zeta\colon (1, 0, 0) + \lambda(0, 1, 0)`}</M> Schwarz der Ortsvektor zu einem Punkt von <M p=",">\zeta</M> türkis der Richtungsvektor, der dort beginnt. Jedes <M>\lambda</M> gibt einen anderen Punkt der Geraden.</>}
                en={<><M p=".">{t`\zeta\colon (1, 0, 0) + \lambda(0, 1, 0)`}</M> Black the position vector of one point of <M p=",">\zeta</M> teal the direction vector starting there. Every <M>\lambda</M> gives another point of the line.</>} /> },
              { ms: 7000, caption: <T
                de={<>Bliebe die Kinemate gleich, würde der Würfel um <M>\zeta</M> schrauben: Er kippt über seine vordere untere Kante nach vorn und rutscht dabei nach rechts. Gezeigt ist eine Vierteldrehung.</>}
                en={<>If the Kinemate stayed the same, the cube would screw about <M p=":">\zeta</M> it tips forward over its bottom front edge and slides to the right at the same time. A quarter turn is shown.</>} /> },
            ]}
          >
            {(step, tt) => <CubeScrewAnim step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p><b>Probe mit der Formel aus Abschnitt 4:</b> <M>B</M> hat den Abstand <M>1</M> von <M p=",">\zeta</M> also <M p=".">{t`|\v v_B| = \sqrt{2^2 + 2^2\cdot 1^2} = 2\sqrt 2`}</M> Das stimmt mit <M>{t`|(0, 2, 2)| = 2\sqrt 2`}</M> überein&nbsp;✓. Am schnellsten sind die Ecken <M>{t`(0, 0, 1)`}</M> und <M p=",">{t`(0, 1, 1)`}</M> die am weitesten von <M>\zeta</M> weg sind (Abstand <M p="):">{t`\sqrt 2`}</M> <M p=".">{t`|\v v| = \sqrt{4 + 4\cdot 2} = 2\sqrt 3 \approx 3{,}46\,\text{m/s}`}</M> Die Formel <M>{t`\v r_Z = \v r_B + \v\omega\times\v v_B/|\v\omega|^2`}</M> gibt direkt <M p=".">{t`(0, 2, 0)\times(0, 2, 2)/4 = (1, 0, 0)`}</M></p>}
          en={<p><b>Check with the formula from section 4:</b> <M>B</M> is at distance <M>1</M> from <M p=",">\zeta</M> so <M p=".">{t`|\v v_B| = \sqrt{2^2 + 2^2\cdot 1^2} = 2\sqrt 2`}</M> This agrees with <M p="✓.">{t`|(0, 2, 2)| = 2\sqrt 2`}</M> Fastest are the corners <M>{t`(0, 0, 1)`}</M> and <M p=",">{t`(0, 1, 1)`}</M> the farthest from <M>\zeta</M> (distance <M p="):">{t`\sqrt 2`}</M> <M p=".">{t`|\v v| = \sqrt{4 + 4\cdot 2} = 2\sqrt 3 \approx 3.46\,\text{m/s}`}</M> The formula <M>{t`\v r_Z = \v r_B + \v\omega\times\v v_B/|\v\omega|^2`}</M> gives directly <M p=".">{t`(0, 2, 0)\times(0, 2, 2)/4 = (1, 0, 0)`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="missverstaendnisse" title={<T de="7. Häufige Missverständnisse" en="7. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«Die Zentralachse <M>\zeta</M> geht immer durch den Körper.»</>} en={<>“The central axis <M>\zeta</M> always passes through the body.”</>} />}>
          <T de={<>Nein. <M>\zeta</M> ist eine gedachte Gerade (Merke auf S. 25). Beim Würfel liegt sie zufällig auf einer Kante; beim Auto in der Kurve geht sie durch den Kurvenmittelpunkt, weit neben dem Auto.</>} en={<>No. <M>\zeta</M> is an imagined line (note on p. 25). For the cube it happens to lie on an edge; for a car in a bend it passes through the centre of the bend, far beside the car.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v v_\omega`}</M> ist in jedem Punkt anders.»</>} en={<>“<M>{t`\v v_\omega`}</M> is different at every point.”</>} />}>
          <T de={<>Nein, das ist gerade die 2. Invariante. Verschieden ist nur der Teil senkrecht zu <M p=".">{t`\v\omega`}</M> Im Bild in Abschnitt 2: Alle blauen Pfeile sind gleich, die orangen nicht.</>} en={<>No, that is exactly the 2nd invariant. Only the part perpendicular to <M>{t`\v\omega`}</M> differs. In the figure of section 2: all blue arrows are equal, the orange ones are not.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Die Punkte laufen auf Schraubenlinien um <M p=".">B</M>»</>} en={<>“The points move on helices about <M p=".">B</M>”</>} />}>
          <T de={<>Nein, um <M p=".">\zeta</M> <M>B</M> ist ein beliebiger Punkt; liegt er nicht auf <M p=",">\zeta</M> läuft er selbst auf einer Schraubenlinie um <M p=".">\zeta</M> Nur die Punkte auf <M>\zeta</M> fahren geradeaus.</>} en={<>No, about <M p=".">\zeta</M> <M>B</M> is any point; if it is not on <M p=",">\zeta</M> it moves on a helix about <M>\zeta</M> itself. Only the points on <M>\zeta</M> go straight.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Mit einem anderen Bezugspunkt bekommt man ein anderes <M p=".">{t`\v\omega`}</M>»</>} en={<>“A different reference point gives a different <M p=".">{t`\v\omega`}</M>”</>} />}>
          <T de={<>Nein: <M>{t`\v\omega' = \v\omega`}</M> (1. Invariante). Der Körper dreht sich als Ganzes; jede Linie in ihm dreht sich gleich schnell. Nur <M>{t`\v v`}</M> hängt vom Punkt ab.</>} en={<>No: <M>{t`\v\omega' = \v\omega`}</M> (1st invariant). The body turns as a whole; every line in it turns at the same rate. Only <M>{t`\v v`}</M> depends on the point.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="merke" title={<T de="8. Das Wichtigste" en="8. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Die <b>Kinemate</b> <M>{t`\{\v v_B, \v\omega\}`}</M> in einem Punkt <M>B</M> legt den ganzen Bewegungszustand fest.</li>
              <li>Zwei Grössen hängen nicht vom Punkt ab: <M>{t`\v\omega`}</M> (1. Invariante) und <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\,\v e_\omega`}</M> (2. Invariante).</li>
              <li>Die Punkte mit <M>{t`\v v = \v v_\omega`}</M> bilden die <b>Zentralachse</b> <M p=",">\zeta</M> eine Gerade parallel zu <M p=".">{t`\v\omega`}</M> Dort ist die Geschwindigkeit am kleinsten; im Abstand <M>d</M> ist <M p=".">{t`|\v v|^2 = v_\omega^2 + \omega^2 d^2`}</M></li>
              <li>Jede Bewegung ist in jedem Augenblick eine <b>Schraubung</b> um <M p=":">\zeta</M> <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M> Ohne <M>{t`\v v_\omega`}</M> ist sie eine Rotation, ohne <M>{t`\v\omega`}</M> eine Translation.</li>
            </ul>}
            en={<ul>
              <li>The <b><span lang="de">Kinemate</span></b> <M>{t`\{\v v_B, \v\omega\}`}</M> at one point <M>B</M> fixes the whole state of motion.</li>
              <li>Two quantities do not depend on the point: <M>{t`\v\omega`}</M> (1st invariant) and <M>{t`\v v_\omega = (\v v\cdot\v e_\omega)\,\v e_\omega`}</M> (2nd invariant).</li>
              <li>The points with <M>{t`\v v = \v v_\omega`}</M> form the <b>central axis</b> <M p=",">\zeta</M> a line parallel to <M p=".">{t`\v\omega`}</M> The speed is smallest there; at distance <M p=",">d</M> <M p=".">{t`|\v v|^2 = v_\omega^2 + \omega^2 d^2`}</M></li>
              <li>Every motion is at each instant a <b>screw motion</b> about <M p=":">\zeta</M> <M p=".">{t`\v v_P = \v v_\omega + \v\omega\times\v{ZP}`}</M> Without <M>{t`\v v_\omega`}</M> it is a rotation, without <M>{t`\v\omega`}</M> a translation.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Zusammenhänge:</b> Die Grundgleichung stammt aus <a href="#allgemein">Allgemeine Bewegung</a> (S. 22); <a href="#translation">Translation</a> und <a href="#rotation">Rotation</a> sind die Spezialfälle; bei der <a href="#kreiselung">Kreiselung</a> ruht ein Punkt, also ist <M>{t`\v v_\omega = \v 0`}</M> und <M>\zeta</M> die momentane Achse <M p=".">\mu</M> Weiter geht es mit <a href="#ebene-bewegung">Ebene Bewegung &amp; Momentanzentrum</a> (S. 26).</p>}
          en={<p className="connections"><b>Connections:</b> the fundamental equation comes from <a href="#allgemein">General rigid-body motion</a> (p. 22); <a href="#translation">translation</a> and <a href="#rotation">rotation</a> are the special cases; in <a href="#kreiselung">spinning motion</a> one point is at rest, so <M>{t`\v v_\omega = \v 0`}</M> and <M>\zeta</M> is the momentary axis <M p=".">\mu</M> Next: <a href="#ebene-bewegung">Plane motion and instantaneous centre</a> (p. 26).</p>}
        />
      </Section>
    </article>
  );
}
