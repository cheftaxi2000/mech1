import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AxisMomentExplorer, AxisProofFig, Cube39Fig, MomentPointExplorer } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S3Moment() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Das <a href="#leistung-rotation">Moment</a> einer Kraft kennst du schon aus der Leistung bei Rotation. Hier kommen zwei Ergänzungen dazu. Erstens: Man darf eine Kraft auf ihrer Wirkungslinie verschieben, das Moment bleibt gleich (Verschiebungssatz). Zweitens: Für eine Drehung um eine feste Achse zählt nur eine Zahl, das Moment bezüglich dieser Achse.</p>}
        en={<p className="lede">You already know the <a href="#leistung-rotation">moment</a> of a force from the power in rotation. Two additions come here. First: a force may be slid along its line of action, the moment stays the same (shifting theorem). Second: for a rotation about a fixed axis only one number counts, the moment about that axis.</p>}
      />

      <Box kind="intuition">
        <T
          de={<p>Eine Tür öffnest du leicht, wenn du weit weg von den Scharnieren drückst, und schwer, wenn du nahe daran drückst. Und drückst du genau in Richtung der Scharniere, bewegt sie sich gar nicht. Wie stark eine Kraft dreht, hängt also von zwei Dingen ab: wie stark sie ist und wie weit ihre Linie an der Drehachse vorbeigeht. Dieser Abstand heisst Hebelarm.</p>}
          en={<p>You open a door easily if you push far from the hinges, and with difficulty if you push close to them. And if you push straight towards the hinges, it does not move at all. How strongly a force turns therefore depends on two things: how strong it is and how far its line passes from the axis of rotation. That distance is called the lever arm.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="punkt" title={<T de="1. Moment bezüglich eines Punktes" en="1. Moment about a point" />}>
        <Box kind="lecture" src={<Src p={39} />} title={<T de="6.3 Moment einer Kraft bezüglich eines Punktes" en={<>6.3 Moment of a force about a point (<span lang="de">Moment einer Kraft bezüglich eines Punktes</span>)</>} />}>
          <MD>{t`\v M_O = \v{OA}\times\v F = \v F\times\v{AO},\qquad |\v M_O| = |\v F|\cdot\underbrace{|\v{AO}|\cdot\sin\alpha}_{a}`}</MD>
          <MD>{t`\v M_O:\ |\v M_O| = |\v F|\cdot a,\qquad \v M_O\perp\v{AO},\ W\quad\to\ \text{${tr('Verschiebungssatz', 'shifting theorem')}}`}</MD>
          <T
            de={<>
              <p>Handschriftlich: «<M p=":">a</M> Abstand <M>O</M> <M>\leftrightarrow</M> Wirkungslinie von <M>{t`\v F`}</M> <M>\to</M> d. h. die Position von <M>A</M> auf <M>W</M> hat keinen Einfluss auf <M>{t`\v M_O`}</M> <M>\to</M> dies beweist den Verschiebungssatz.»</p>
              <p><b>Verschiebungssatz:</b> «Das Moment einer Kraft bezüglich eines beliebigen Punktes <M>O</M> bleibt gleich, wenn bei gleich bleibendem Vektoranteil der Angriffspunkt der Kraft längs ihrer Wirkungslinie verschoben wird.»</p>
            </>}
            en={<>
              <p>Handwritten: “<M p=":">a</M> distance <M>O</M> <M>\leftrightarrow</M> line of action of <M>{t`\v F`}</M> <M>\to</M> i.e. the position of <M>A</M> on <M>W</M> has no influence on <M>{t`\v M_O`}</M> <M>\to</M> this proves the shifting theorem (<span lang="de">Verschiebungssatz</span>).”</p>
              <p><b>Shifting theorem:</b> “The moment of a force about an arbitrary point <M>O</M> stays the same if, with the vector part unchanged, the point of action of the force is moved along its line of action.”</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ol className="keep">
              <li><M>W</M> ist die <b>Wirkungslinie</b>: die Gerade durch <M>A</M> in Richtung <M p=".">{t`\v F`}</M></li>
              <li>Der Betrag eines Kreuzprodukts ist Länge mal Länge mal Sinus des Winkels dazwischen (<a href="#vektoren">S. 5</a>). <M>{t`|\v{AO}|\sin\alpha`}</M> ist genau der senkrechte Abstand <M>a</M> von <M>O</M> zur Linie <M p=":">W</M> der <b>Hebelarm</b>.</li>
              <li>Schiebt man <M>A</M> auf <M>W</M> hin und her, ändert sich <M>{t`\v{OA}`}</M> und auch <M p=",">\alpha</M> aber das Produkt <M>{t`|\v{AO}|\sin\alpha = a`}</M> nicht. Die Richtung von <M>{t`\v M_O`}</M> steht senkrecht auf der Ebene durch <M>O</M> und <M p=",">W</M> also auch fest. Das ist der Verschiebungssatz.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ol className="keep">
              <li><M>W</M> is the <b>line of action</b>: the straight line through <M>A</M> in the direction of <M p=".">{t`\v F`}</M></li>
              <li>The magnitude of a cross product is length times length times the sine of the angle between (<a href="#vektoren">p. 5</a>). <M>{t`|\v{AO}|\sin\alpha`}</M> is exactly the perpendicular distance <M>a</M> from <M>O</M> to the line <M p=":">W</M> the <b>lever arm</b>.</li>
              <li>If <M>A</M> slides back and forth on <M p=",">W</M> <M>{t`\v{OA}`}</M> changes and so does <M p=",">\alpha</M> but the product <M>{t`|\v{AO}|\sin\alpha = a`}</M> does not. The direction of <M>{t`\v M_O`}</M> is normal to the plane through <M>O</M> and <M p=",">W</M> so it is fixed too. That is the shifting theorem.</li>
            </ol>
          </>}
        />
        <MomentPointExplorer />
        <Box kind="lecture" src={<Src p={39} />} title={<T de="Beispiel: Würfel" en="Example: cube" />}>
          <T
            de={<p>Würfel der Kantenlänge <M p=",">L</M> <M>O</M> im Ursprung, <M>B</M> auf der x-Achse, <M>A</M> auf derselben Kante dahinter; <M p=",">{t`\v F = (0, F, 0)^\mathsf T`}</M> gesucht <M p=".">{t`\v M_O`}</M></p>}
            en={<p>Cube of edge length <M p=",">L</M> <M>O</M> at the origin, <M>B</M> on the x-axis, <M>A</M> behind it on the same edge; <M p=",">{t`\v F = (0, F, 0)^\mathsf T`}</M> wanted: <M p=".">{t`\v M_O`}</M></p>}
          />
          <MD>{t`\v M_O = \v{OA}\times\v F = \v{OB}\times\v F = \begin{pmatrix}0\\0\\LF\end{pmatrix};\qquad \begin{pmatrix}L\\L\\0\end{pmatrix}\times\begin{pmatrix}0\\F\\0\end{pmatrix} = \begin{pmatrix}L\\0\\0\end{pmatrix}\times\begin{pmatrix}0\\F\\0\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<p className="keep">Die Kraft wirkt entlang der Kante durch <M>B</M> und <M p=".">A</M> Man darf sie also nach <M>B</M> schieben und dort rechnen. Mit <M>{t`\v{OB} = (L, 0, 0)`}</M> ist das Kreuzprodukt viel einfacher, und es kommt dasselbe heraus.</p>}
          en={<p className="keep">The force acts along the edge through <M>B</M> and <M p=".">A</M> So it may be slid to <M>B</M> and computed there. With <M>{t`\v{OB} = (L, 0, 0)`}</M> the cross product is much simpler, and the result is the same.</p>}
        />
        <StepPlayer
          label={tr('Animation: Würfel, Moment mit OA und mit OB', 'Animation: cube, moment with OA and with OB')}
          steps={[
            { ms: 600, holdMs: 2400, caption: <T de={<>Die Kraft <M>{t`\v F`}</M> in <M>A</M> zeigt in y-Richtung, entlang der Kante durch <M p=".">B</M></>} en={<>The force <M>{t`\v F`}</M> at <M>A</M> points in the y-direction, along the edge through <M p=".">B</M></>} /> },
            { ms: 1200, holdMs: 3000, caption: <T de={<>Mit <M p=":">{t`\v{OA} = (L, L, 0)`}</M> <M p=",">{t`\v M_O = (0, 0, LF)`}</M> senkrecht nach oben.</>} en={<>With <M p=":">{t`\v{OA} = (L, L, 0)`}</M> <M p=",">{t`\v M_O = (0, 0, LF)`}</M> pointing straight up.</>} /> },
            { ms: 1200, holdMs: 3200, caption: <T de={<>Mit <M>{t`\v{OB} = (L, 0, 0)`}</M> kommt dasselbe heraus: <M>B</M> liegt auf der Wirkungslinie.</>} en={<>With <M>{t`\v{OB} = (L, 0, 0)`}</M> the result is the same: <M>B</M> lies on the line of action.</>} /> },
          ]}
        >
          {(step, tt) => <Cube39Fig step={step} t={tt} />}
        </StepPlayer>
        <Box kind="misconception" title={<T de={<>«Der Hebelarm ist der Abstand von <M>O</M> zum Angriffspunkt»</>} en={<>“The lever arm is the distance from <M>O</M> to the point of action”</>} />}>
          <T
            de={<p>Nur wenn <M>{t`\v F`}</M> senkrecht auf <M>{t`\v{OA}`}</M> steht. Allgemein ist es der senkrechte Abstand zur Wirkungslinie, <M p=".">{t`a = |\v{OA}|\sin\alpha`}</M> Zeigt die Kraft genau auf <M>O</M> zu, ist <M>{t`a = 0`}</M> und das Moment null, auch wenn <M>A</M> weit weg liegt.</p>}
            en={<p>Only if <M>{t`\v F`}</M> is perpendicular to <M p=".">{t`\v{OA}`}</M> In general it is the perpendicular distance to the line of action, <M p=".">{t`a = |\v{OA}|\sin\alpha`}</M> If the force points straight at <M p=",">O</M> <M>{t`a = 0`}</M> and the moment is zero, even if <M>A</M> is far away.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="achse" title={<T de="2. Moment bezüglich einer Achse" en="2. Moment about an axis" />}>
        <Box kind="lecture" src={<Src p={39} fig="Fig. 6.6" />} title={<T de={<>6.4 Moment einer Kraft bezüglich einer Achse <M p=")">\gamma</M></>} en={<>6.4 Moment of a force about an axis <M>\gamma</M> (<span lang="de">bezüglich einer Achse</span>)</>} />}>
          <T de={<p>Fig. 6.6: senkrechte Achse <M>\gamma</M> mit <M p=",">{t`\v e_\gamma`}</M> auf ihr <M>{t`B'`}</M> und <M p=";">B</M> Ebene <M>{t`E^\perp`}</M> durch <M p=";">A</M> <M>{t`\v F`}</M> in <M>A</M> mit den Komponenten <M>{t`\v F_\gamma`}</M> (parallel zur Achse) und <M>{t`\v F^\perp`}</M> (in <M p=")">{t`E^\perp`}</M> Hebelarm <M p=".">a</M></p>} en={<p>Fig. 6.6: vertical axis <M>\gamma</M> with <M p=",">{t`\v e_\gamma`}</M> on it <M>{t`B'`}</M> and <M p=";">B</M> plane <M>{t`E^\perp`}</M> through <M p=";">A</M> <M>{t`\v F`}</M> at <M>A</M> with the components <M>{t`\v F_\gamma`}</M> (parallel to the axis) and <M>{t`\v F^\perp`}</M> (in <M p=")">{t`E^\perp`}</M> lever arm <M p=".">a</M></p>} />
          <MD>{t`\begin{aligned}
M_\gamma &:= \v e_\gamma\cdot\v M_B = \v e_\gamma\cdot\v M_{B'}\\
M_\gamma &= \v e_\gamma\cdot(\v F\times\v{AB}) = \underbrace{\v e_\gamma\cdot(\v F\times\v{AB'})}_{\v M_{B'}} + \underbrace{\v e_\gamma\cdot(\v F\times\v{B'B})}_{0},\qquad \v{AB} = \v{AB'} + \v{B'B}\\
M_\gamma &= (\v F^\perp\times\v{AB})\cdot\v e_\gamma + \underbrace{(\v F_\gamma\times\v{AB})\cdot\v e_\gamma}_{0},\qquad M_\gamma = |\v F^\perp|\cdot a
\end{aligned}`}</MD>
          <T de={<p>Handschriftlich: «<M p=":">{t`M_\gamma`}</M> unabhängig von der Lage von <M>B</M> auf <M p=".">\gamma</M>»</p>} en={<p>Handwritten: “<M p=":">{t`M_\gamma`}</M> independent of where <M>B</M> lies on <M p=".">\gamma</M>”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Wozu ein Moment bezüglich einer Achse?</b> Dreht sich ein Körper um eine feste Achse (Tür, Rad), ist <M p=",">{t`\v\omega = \omega\,\v e_\gamma`}</M> und die Leistung <M>{t`\v\omega\cdot\v M_B = \omega\,(\v e_\gamma\cdot\v M_B)`}</M> braucht nur den Anteil von <M>{t`\v M_B`}</M> längs der Achse. Das ist <M p=",">{t`M_\gamma`}</M> eine Zahl mit Vorzeichen.</p>
            <ol className="keep">
              <li><b>Unabhängig von <M p=":">B</M></b> Verschiebt man <M>B</M> auf der Achse, kommt zu <M>{t`\v{AB}`}</M> ein Stück <M>{t`\v{B'B}`}</M> parallel zu <M>{t`\v e_\gamma`}</M> dazu. <M>{t`\v F\times\v{B'B}`}</M> steht senkrecht auf <M p=",">{t`\v{B'B}`}</M> also auf der Achse, und das Skalarprodukt mit <M>{t`\v e_\gamma`}</M> ist null.</li>
              <li><b>Nur <M>{t`\v F^\perp`}</M> zählt:</b> <M>{t`\v F_\gamma\times\v{AB}`}</M> steht senkrecht auf <M p=",">{t`\v F_\gamma`}</M> also auf der Achse; wieder null. Kräfte längs der Achse drehen nicht um sie (eine Tür öffnet man nicht, indem man an der Klinke nach oben zieht).</li>
              <li>Übrig bleibt die Ebene <M p=":">{t`E^\perp`}</M> dort ist es ein ebenes Moment, Kraft <M>{t`|\v F^\perp|`}</M> mal Hebelarm <M p=".">a</M></li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>Why a moment about an axis?</b> If a body turns about a fixed axis (door, wheel), <M p=",">{t`\v\omega = \omega\,\v e_\gamma`}</M> and the power <M>{t`\v\omega\cdot\v M_B = \omega\,(\v e_\gamma\cdot\v M_B)`}</M> needs only the part of <M>{t`\v M_B`}</M> along the axis. That is <M p=",">{t`M_\gamma`}</M> a number with a sign.</p>
            <ol className="keep">
              <li><b>Independent of <M p=":">B</M></b> moving <M>B</M> along the axis adds a piece <M>{t`\v{B'B}`}</M> parallel to <M>{t`\v e_\gamma`}</M> to <M p=".">{t`\v{AB}`}</M> <M>{t`\v F\times\v{B'B}`}</M> is perpendicular to <M p=",">{t`\v{B'B}`}</M> i.e. to the axis, and its dot product with <M>{t`\v e_\gamma`}</M> is zero.</li>
              <li><b>Only <M>{t`\v F^\perp`}</M> counts:</b> <M>{t`\v F_\gamma\times\v{AB}`}</M> is perpendicular to <M p=",">{t`\v F_\gamma`}</M> i.e. to the axis; zero again. Forces along the axis do not turn about it (you do not open a door by pulling the handle upwards).</li>
              <li>What remains is the plane <M p=":">{t`E^\perp`}</M> there it is a plane moment, force <M>{t`|\v F^\perp|`}</M> times lever arm <M p=".">a</M></li>
            </ol>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Moment bezüglich einer Achse', 'Animation: moment about an axis')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Achse <M p=",">\gamma</M> Punkt <M>B</M> auf ihr, Kraft <M>{t`\v F`}</M> in <M p=".">A</M> Gesucht: wie stark <M>{t`\v F`}</M> um die Achse dreht.</>} en={<>Axis <M p=",">\gamma</M> point <M>B</M> on it, force <M>{t`\v F`}</M> at <M p=".">A</M> Wanted: how strongly <M>{t`\v F`}</M> turns about the axis.</>} /> },
            { ms: 1200, holdMs: 2800, caption: <T de={<><M>{t`B'`}</M> liegt auf der Achse auf der Höhe von <M p=".">A</M> Der Weg von <M>A</M> nach <M>B</M> wird zerlegt: <M p=".">{t`\v{AB} = \v{AB'} + \v{B'B}`}</M></>} en={<><M>{t`B'`}</M> lies on the axis at the height of <M p=".">A</M> The way from <M>A</M> to <M>B</M> is split: <M p=".">{t`\v{AB} = \v{AB'} + \v{B'B}`}</M></>} /> },
            { ms: 900, holdMs: 3000, caption: <T de={<><M>{t`\v{B'B}`}</M> liegt auf der Achse; sein Beitrag hat keinen Anteil längs der Achse. Wo <M>B</M> sitzt, ist egal.</>} en={<><M>{t`\v{B'B}`}</M> lies on the axis; its contribution has no part along the axis. Where <M>B</M> sits does not matter.</>} /> },
            { ms: 1200, holdMs: 3000, caption: <T de={<>Die Kraft zerfällt in <M>{t`\v F_\gamma`}</M> (gelb, längs) und <M>{t`\v F^\perp`}</M> (blau, quer). Der gelbe Teil dreht nicht um die Achse.</>} en={<>The force splits into <M>{t`\v F_\gamma`}</M> (yellow, along) and <M>{t`\v F^\perp`}</M> (blue, across). The yellow part does not turn about the axis.</>} /> },
            { ms: 1200, holdMs: 3200, caption: <T de={<>In der Ebene <M>{t`E^\perp`}</M> bleibt ein ebenes Moment: <M p=",">{t`|M_\gamma| = |\v F^\perp|\,a`}</M> <M>a</M> = Abstand der Achse von der Wirkungslinie von <M p=".">{t`\v F^\perp`}</M></>} en={<>In the plane <M>{t`E^\perp`}</M> a plane moment remains: <M p=",">{t`|M_\gamma| = |\v F^\perp|\,a`}</M> <M>a</M> = distance of the axis from the line of action of <M p=".">{t`\v F^\perp`}</M></>} /> },
          ]}
        >
          {(step, tt) => <AxisProofFig step={step} t={tt} />}
        </StepPlayer>
        <Box kind="lecture" src={<Src p={40} />} title={<T de="Korollar 1 und 2" en={<>Corollaries 1 and 2 (<span lang="de">Korollar</span>)</>} />}>
          <T
            de={<>
              <p><b>Korollar 1:</b> «Das Moment einer Kraft <M>{t`\{A \mid \v F \ne \v 0\}`}</M> bezüglich einer Achse <M>\gamma</M> verschwindet dann und nur dann, wenn die Wirkungslinie die Achse <M>\gamma</M> schneidet oder zu ihr parallel ist.» Rand: <M p=";">{t`M_\gamma = 0 \to |\v F^\perp| = 0 \to \v F\parallel\v e_\gamma`}</M> <M p=".">{t`\to \v F^\perp\parallel\v{BA} \to a = 0`}</M></p>
              <p><b>Korollar 2:</b> «Um das Moment einer Kraft bezüglich einer Achse <M>\gamma</M> zu erhalten, zerlege man <M>{t`\v F`}</M> vorerst in zwei Komponenten <M>{t`\v F_\gamma`}</M> und <M>{t`\v F^\perp`}</M> und multipliziere den Betrag der zu <M>\gamma</M> normalen Komponente <M>{t`\v F^\perp`}</M> mit dem Abstand <M>a</M> zwischen der Achse und der Wirkungslinie von <M>{t`\v F^\perp`}</M> in <M p=".">A</M> Es gilt also <M>{t`|M_\gamma| = a\,|\v F^\perp|`}</M> (6.11). Das Vorzeichen ergibt sich aus dem Drehsinn von <M>{t`\v F^\perp`}</M> bezüglich des Einheitsvektors <M>{t`\v e_\gamma`}</M> auf der Achse.»</p>
              <p>Zwei Würfel (Kante <M p=",">a</M> Achse <M p=")">z</M> links <M>{t`\v r`}</M> entlang der x-Kante: <M p=";">{t`M_\gamma = F^\perp\cdot a`}</M> rechts <M>{t`\v r`}</M> zur Ecke, <M p=":">{t`|\v r| = \sqrt2\,a`}</M> <M p=".">{t`M_\gamma = \tfrac{\sqrt2}{2}F^\perp\cdot\sqrt2\,a = F^\perp\cdot a`}</M></p>
            </>}
            en={<>
              <p><b>Corollary 1:</b> “The moment of a force <M>{t`\{A \mid \v F \ne \v 0\}`}</M> about an axis <M>\gamma</M> vanishes if and only if the line of action meets the axis <M>\gamma</M> or is parallel to it.” Margin: <M p=";">{t`M_\gamma = 0 \to |\v F^\perp| = 0 \to \v F\parallel\v e_\gamma`}</M> <M p=".">{t`\to \v F^\perp\parallel\v{BA} \to a = 0`}</M></p>
              <p><b>Corollary 2:</b> “To obtain the moment of a force about an axis <M p=",">\gamma</M> first split <M>{t`\v F`}</M> into two components <M>{t`\v F_\gamma`}</M> and <M>{t`\v F^\perp`}</M> and multiply the magnitude of the component <M>{t`\v F^\perp`}</M> normal to <M>\gamma</M> by the distance <M>a</M> between the axis and the line of action of <M>{t`\v F^\perp`}</M> at <M p=".">A</M> Hence <M>{t`|M_\gamma| = a\,|\v F^\perp|`}</M> (6.11). The sign follows from the sense of rotation of <M>{t`\v F^\perp`}</M> with respect to the unit vector <M>{t`\v e_\gamma`}</M> on the axis.”</p>
              <p>Two cubes (edge <M p=",">a</M> axis <M p=")">z</M> left <M>{t`\v r`}</M> along the x-edge: <M p=";">{t`M_\gamma = F^\perp\cdot a`}</M> right <M>{t`\v r`}</M> to the corner, <M p=":">{t`|\v r| = \sqrt2\,a`}</M> <M p=".">{t`M_\gamma = \tfrac{\sqrt2}{2}F^\perp\cdot\sqrt2\,a = F^\perp\cdot a`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Im Explorer kannst du alle Fälle ausprobieren: Schneidet die Wirkungslinie die Achse (dann ist <M p=")">{t`a = 0`}</M> oder ist sie parallel (dann ist <M p=")">{t`\v F^\perp = 0`}</M> wird <M>{t`M_\gamma`}</M> null. Die zwei Würfel des Skripts geben beide <M p=":">{t`F^\perp a`}</M> Beim rechten ist <M>{t`\v r`}</M> zwar länger, aber nur der Teil von <M>{t`\v F^\perp`}</M> senkrecht zu <M>{t`\v r`}</M> dreht, und der ist um denselben Faktor <M>{t`\sqrt2`}</M> kleiner.</p>}
          en={<p className="keep">In the explorer you can try all cases: if the line of action meets the axis (then <M p=")">{t`a = 0`}</M> or is parallel to it (then <M p=")">{t`\v F^\perp = 0`}</M> <M>{t`M_\gamma`}</M> becomes zero. The two cubes of the notes both give <M p=".">{t`F^\perp a`}</M> On the right one <M>{t`\v r`}</M> is longer, but only the part of <M>{t`\v F^\perp`}</M> normal to <M>{t`\v r`}</M> turns, and it is smaller by the same factor <M p=".">{t`\sqrt2`}</M></p>}
        />
        <AxisMomentExplorer />
        <Box kind="misconception" title={<T de="«Ein Moment bezüglich einer Achse ist ein Vektor»" en="“A moment about an axis is a vector”" />}>
          <T
            de={<p><M>{t`\v M_B`}</M> ist ein Vektor, <M>{t`M_\gamma = \v e_\gamma\cdot\v M_B`}</M> eine Zahl mit Vorzeichen: der Anteil von <M>{t`\v M_B`}</M> längs der Achse. Positiv heisst: Die Kraft dreht im Rechtsschraubensinn um <M p=".">{t`\v e_\gamma`}</M></p>}
            en={<p><M>{t`\v M_B`}</M> is a vector, <M>{t`M_\gamma = \v e_\gamma\cdot\v M_B`}</M> a number with a sign: the part of <M>{t`\v M_B`}</M> along the axis. Positive means: the force turns in the right-hand screw sense about <M p=".">{t`\v e_\gamma`}</M></p>}
          />
        </Box>
        <Box kind="key" title={<T de="Das Wichtigste" en="The essentials" />}>
          <T
            de={<ul><li>Moment um einen Punkt: <M p=",">{t`\v M_O = \v{OA}\times\v F`}</M> Betrag Kraft mal Hebelarm <M p=".">a</M></li><li>Eine Kraft darf man auf ihrer Wirkungslinie verschieben; das Moment bleibt gleich (Verschiebungssatz).</li><li>Moment um eine Achse: nur der Teil <M>{t`\v F^\perp`}</M> quer zur Achse zählt, mal sein Abstand <M>a</M> zur Achse. Schneidet die Linie die Achse oder ist sie parallel, ist es null.</li></ul>}
            en={<ul><li>Moment about a point: <M p=",">{t`\v M_O = \v{OA}\times\v F`}</M> magnitude force times lever arm <M p=".">a</M></li><li>A force may be slid along its line of action; the moment stays the same (shifting theorem).</li><li>Moment about an axis: only the part <M>{t`\v F^\perp`}</M> across the axis counts, times its distance <M>a</M> from the axis. If the line meets the axis or is parallel to it, it is zero.</li></ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
