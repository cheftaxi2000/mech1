import { Section } from '../components/Blocks';
import { Choice, NumericAnswer, Predict, See } from '../components/Quiz';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { Q3 } from '../content/quizValues';

const t = String.raw;

/** Quiz part, chapter 3 (lecture pp. 12–23): rigid body. */
export default function Q3Quiz() {
  return (
    <article className="lesson quiz-part">
      <T
        de={<p className="lede">Fragen zu Kapitel 3: SdpG, Translation, Rotation, Rollen, Kreiselung und allgemeine Bewegung. Jede Antwort hat eine Erklärung und einen Link zur Lektion.</p>}
        en={<p className="lede">Questions on chapter 3: SdpG, translation, rotation, rolling, spinning motion and general motion. Every answer has an explanation and a link to the lesson.</p>}
      />

      <Section id="sdpg-quiz" title={<T de="SdpG und Translation" en="SdpG and translation" />}>
        <NumericAnswer
          question={<T de={<>Ein starrer Körper, <M p=",">{t`\v v_A = (2, 1, 0)`}</M> <M p=".">{t`\v{AB} = (1, 0, 0)`}</M> Welche <span className="nowrap"><M>x</M>-Komponente</span> muss <M>{t`\v v_B`}</M> haben?</>} en={<>A rigid body, <M p=",">{t`\v v_A = (2, 1, 0)`}</M> <M p=".">{t`\v{AB} = (1, 0, 0)`}</M> Which <span className="nowrap"><M>x</M>-component</span> must <M>{t`\v v_B`}</M> have?</>} />}
          value={Q3.vBx}
          explain={<T de={<>SdpG: <M p=",">{t`\v v_B\cdot\v{AB} = \v v_A\cdot\v{AB} = 2`}</M> und <M>{t`\v v_B\cdot(1, 0, 0)`}</M> ist gerade <M p=".">{t`v_{Bx}`}</M> Die anderen Komponenten sagt die SdpG nicht. <See id="sdpg">SdpG</See></>} en={<>SdpG: <M p=",">{t`\v v_B\cdot\v{AB} = \v v_A\cdot\v{AB} = 2`}</M> and <M>{t`\v v_B\cdot(1, 0, 0)`}</M> is just <M p=".">{t`v_{Bx}`}</M> The SdpG says nothing about the other components. <See id="sdpg">SdpG</See></>} />}
        />
        <NumericAnswer
          question={<T de={<>Gleitende Leiter (S. 13): Der Fusspunkt gleitet mit <M>{t`v_H = 1\,\mathrm{m/s}`}</M> am Boden, der Winkel zum Boden ist <M p=".">{t`\alpha = 30^\circ`}</M> Wie schnell gleitet das obere Ende an der Wand?</>} en={<>Sliding ladder (p. 13): the foot slides on the floor with <M p=",">{t`v_H = 1\,\mathrm{m/s}`}</M> the angle to the floor is <M p=".">{t`\alpha = 30^\circ`}</M> How fast does the top slide along the wall?</>} />}
          value={Q3.ladderVV} unit="m/s" tol={0.01}
          explain={<T de={<><M p=".">{t`v_V = v_H\cot\alpha = \cot 30^\circ = \sqrt3 \approx 1{,}73\,\mathrm{m/s}`}</M> Je flacher die Leiter, desto schneller das obere Ende. <See id="sdpg">SdpG</See></>} en={<><M p=".">{t`v_V = v_H\cot\alpha = \cot 30^\circ = \sqrt3 \approx 1.73\,\mathrm{m/s}`}</M> The flatter the ladder, the faster the top. <See id="sdpg">SdpG</See></>} />}
        />
        <Choice
          question={<T de="Eine Gondel eines Riesenrads bleibt immer aufrecht. Welche Bewegung macht sie?" en="A gondola of a Ferris wheel always stays upright. Which motion does it perform?" />}
          choices={[
            { text: <T de="eine Rotation um die Nabe" en="a rotation about the hub" />, why: <T de="Bei einer Rotation würde sich die Gondel mitdrehen und kippen. Ihre Punkte laufen zwar auf Kreisen – aber auf gleich grossen Kreisen mit verschiedenen Mittelpunkten." en="In a rotation the gondola would turn with the wheel and tip over. Its points do move on circles – but on circles of the same size with different centres." /> },
            { text: <T de="eine Translation" en="a translation" />, correct: true, why: <T de={<>Jede Strecke in der Gondel behält Länge und Richtung. Alle Punkte haben dieselbe Geschwindigkeit, ihre Bahnen sind deckungsgleiche Kreise. <See id="translation">Translation</See></>} en={<>Every segment in the gondola keeps its length and direction. All points have the same velocity; their paths are congruent circles. <See id="translation">Translation</See></>} /> },
          ]}
        />
      </Section>

      <Section id="rotation-quiz" title={<T de="Rotation" en="Rotation" />}>
        <NumericAnswer
          question={<T de={<>Rotation mit <M p=".">{t`|\v\omega| = 2\,\mathrm{s^{-1}}`}</M> Ein Punkt <M>M</M> ist <M>{t`0{,}3\,\mathrm m`}</M> von der Achse entfernt und <M>{t`0{,}5\,\mathrm m`}</M> vom Punkt <M>O</M> auf der Achse. Wie gross ist <M p="?">{t`|\v v_M|`}</M></>} en={<>Rotation with <M p=".">{t`|\v\omega| = 2\,\mathrm{s^{-1}}`}</M> A point <M>M</M> is <M>{t`0.3\,\mathrm m`}</M> from the axis and <M>{t`0.5\,\mathrm m`}</M> from the point <M>O</M> on the axis. What is <M p="?">{t`|\v v_M|`}</M></>} />}
          value={Q3.rotSpeed} unit="m/s"
          explain={<T de={<><M p=".">{t`|\v v_M| = |\v\omega|\cdot|\v{AM}| = 2\cdot 0{,}3 = 0{,}6\,\mathrm{m/s}`}</M> Es zählt der Abstand von der Achse, nicht <M p=".">{t`|\v{OM}|`}</M> <See id="rotation">Rotation</See></>} en={<><M p=".">{t`|\v v_M| = |\v\omega|\cdot|\v{AM}| = 2\cdot 0.3 = 0.6\,\mathrm{m/s}`}</M> What counts is the distance from the axis, not <M p=".">{t`|\v{OM}|`}</M> <See id="rotation">Rotation</See></>} />}
        />
        <Choice
          question={<T de="Von einem starren Körper ruht dauernd nur ein einziger Punkt. Ist das eine Rotation?" en="Only a single point of a rigid body is at rest all the time. Is this a rotation?" />}
          choices={[
            { text: <T de="Ja, um eine Achse durch diesen Punkt." en="Yes, about an axis through this point." />, why: <T de="Nur in jedem einzelnen Augenblick: Dann ruht zwar eine ganze Achse, aber sie kann mit der Zeit wandern. Eine Rotation braucht zwei Punkte, die dauernd ruhen." en="Only at each single instant: then a whole axis is at rest, but it may wander over time. A rotation needs two points permanently at rest." /> },
            { text: <T de="Nein, das ist eine Kreiselung." en={<>No, this is a spinning motion (<span lang="de">Kreiselung</span>).</>} />, correct: true, why: <T de={<>Mit nur einem ruhenden Punkt ist es eine Kreiselung: momentan eine Rotation um eine Achse durch diesen Punkt, die aber wandern darf. <See id="kreiselung">Kreiselung</See></>} en={<>With only one point at rest it is a spinning motion: momentarily a rotation about an axis through this point, which may however wander. <See id="kreiselung">Spinning motion</See></>} /> },
          ]}
        />
      </Section>

      <Section id="rollen-quiz" title={<T de="Rollen und Kreiselung" en="Rolling and spinning motion" />}>
        <NumericAnswer
          question={<T de={<>Ein Velo fährt mit 18 km/h. Wie schnell ist der oberste Punkt des Reifens (in km/h)?</>} en={<>A bicycle rides at 18 km/h. How fast is the top point of the tyre (in km/h)?</>} />}
          value={Q3.bikeTop} unit="km/h"
          explain={<T de={<>Rollen ist eine momentane Rotation um die Berührlinie. Der oberste Punkt ist doppelt so weit von ihr entfernt wie die Nabe: <M p=".">{t`2\cdot 18 = 36\,\mathrm{km/h}`}</M> Unten ist der Reifen in Ruhe. <See id="rollen">Rollen &amp; Gleiten</See></>} en={<>Rolling is a momentary rotation about the line of contact. The top point is twice as far from it as the hub: <M p=".">{t`2\cdot 18 = 36\,\mathrm{km/h}`}</M> At the bottom the tyre is at rest. <See id="rollen">Rolling and sliding</See></>} />}
        />
        <NumericAnswer
          question={<T de={<>Ein Rad mit Radius <M>{t`R = 0{,}3\,\mathrm m`}</M> rollt auf ruhendem Boden, sein Mittelpunkt hat <M p=".">{t`v_C = 3\,\mathrm{m/s}`}</M> Wie gross ist seine Winkelschnelligkeit <M>\omega</M> (vorwärts positiv, wie in der Lektion)?</>} en={<>A wheel of radius <M>{t`R = 0.3\,\mathrm m`}</M> rolls on ground at rest; its centre has <M p=".">{t`v_C = 3\,\mathrm{m/s}`}</M> What is its angular speed <M>\omega</M> (forward positive, as in the lesson)?</>} />}
          value={Q3.wheelOmega} unit="1/s"
          explain={<T de={<>Rollen: Der Kontaktpunkt ruht. Er hat <M>{t`v_C`}</M> (mit dem Rad vorwärts) minus <M>{t`\omega R`}</M> (die Drehung um <M>C</M> schiebt den untersten Punkt nach hinten): <M p=",">{t`v_C - \omega R = 0`}</M> also <M p=".">{t`\omega = v_C/R = 10\,\mathrm{s^{-1}}`}</M> <See id="rollen">Rollen &amp; Gleiten</See></>} en={<>Rolling: the contact point is at rest. It has <M>{t`v_C`}</M> (forward with the wheel) minus <M>{t`\omega R`}</M> (turning about <M>C</M> pushes the lowest point backwards): <M p=",">{t`v_C - \omega R = 0`}</M> so <M p=".">{t`\omega = v_C/R = 10\,\mathrm{s^{-1}}`}</M> <See id="rollen">Rolling and sliding</See></>} />}
        />
        <NumericAnswer
          question={<T de={<>Ein Band läuft mit <M>{t`1\,\mathrm{m/s}`}</M> rückwärts (<M p=").">{t`u = -1\,\mathrm{m/s}`}</M> Ein Rad mit <M>{t`R = 0{,}5\,\mathrm m`}</M> fährt darauf mit <M>{t`v_C = 2\,\mathrm{m/s}`}</M> vorwärts. Welches <M>\omega</M> braucht es, damit es rollt?</>} en={<>A belt runs backwards at <M>{t`1\,\mathrm{m/s}`}</M> (<M p=").">{t`u = -1\,\mathrm{m/s}`}</M> A wheel with <M>{t`R = 0.5\,\mathrm m`}</M> moves forward on it with <M p=".">{t`v_C = 2\,\mathrm{m/s}`}</M> Which <M>\omega</M> makes it roll?</>} />}
          value={Q3.beltOmega} unit="1/s"
          explain={<T de={<>Rollen heisst gleiche Tangentialteile. Der Kontaktpunkt des Rades hat <M>{t`v_C - \omega R`}</M> (vorwärts mit dem Rad, rückwärts durch die Drehung), das Band hat <M p=":">u</M> <M p=",">{t`v_C - \omega R = u`}</M> also <M p=".">{t`\omega = (v_C - u)/R = (2 + 1)/0{,}5 = 6\,\mathrm{s^{-1}}`}</M> <See id="rollen">Rollen &amp; Gleiten</See></>} en={<>Rolling means equal tangential parts. The wheel's contact point has <M>{t`v_C - \omega R`}</M> (forward with the wheel, backward from the turning), the belt has <M p=":">u</M> <M p=",">{t`v_C - \omega R = u`}</M> so <M p=".">{t`\omega = (v_C - u)/R = (2 + 1)/0.5 = 6\,\mathrm{s^{-1}}`}</M> <See id="rollen">Rolling and sliding</See></>} />}
        />
        <Choice
          question={<T de="Ein Kegel rollt auf dem Tisch um seine Spitze. Welche Punkte ruhen in diesem Augenblick?" en="A cone rolls on the table about its tip. Which points are at rest at this instant?" />}
          choices={[
            { text: <T de="nur die Spitze" en="only the tip" />, why: <T de="Dauernd ruht nur die Spitze. In jedem Augenblick ruht aber eine ganze Achse durch sie." en="Only the tip is at rest all the time. At each instant, though, a whole axis through it is at rest." /> },
            { text: <T de="die Punkte auf der Symmetrieachse des Kegels" en="the points on the cone's axis of symmetry" />, why: <T de="Die Symmetrieachse bewegt sich mit (wie die Achse eines rollenden Rades)." en="The axis of symmetry moves along (like the axle of a rolling wheel)." /> },
            { text: <T de="die Punkte auf der Berührlinie mit dem Tisch" en="the points on the line of contact with the table" />, correct: true, why: <T de={<>Rollen auf ruhendem Boden: Die Berührlinie ruht. Sie ist die momentane Achse und geht durch die Spitze. <See id="kreiselung">Kreiselung</See></>} en={<>Rolling on ground at rest: the line of contact is at rest. It is the momentary axis and passes through the tip. <See id="kreiselung">Spinning motion</See></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Ein Kegel mit halbem Öffnungswinkel <M>{t`\gamma = 30^\circ`}</M> und Mantellinie <M>{t`L = 0{,}2\,\mathrm m`}</M> rollt um seine Spitze; die Berührlinie läuft mit <M>{t`\dot\varphi = 2\,\mathrm{s^{-1}}`}</M> herum. Wie schnell ist der Mittelpunkt <M>C</M> der Grundfläche?</>} en={<>A cone with half opening angle <M>{t`\gamma = 30^\circ`}</M> and slant line <M>{t`L = 0.2\,\mathrm m`}</M> rolls about its tip; the line of contact goes round with <M p=".">{t`\dot\varphi = 2\,\mathrm{s^{-1}}`}</M> How fast is the centre <M>C</M> of its base?</>} />}
          value={Q3.coneVC} unit="m/s"
          explain={<T de={<><M>C</M> fährt einen waagrechten Kreis mit Radius <M p=",">{t`L\cos^2\gamma = 0{,}15\,\mathrm m`}</M> also <M p=".">{t`v_C = 2\cdot 0{,}15 = 0{,}3\,\mathrm{m/s}`}</M> Der oberste Randpunkt ist doppelt so schnell. <See id="kreiselung">Kreiselung</See></>} en={<><M>C</M> travels on a horizontal circle of radius <M p=",">{t`L\cos^2\gamma = 0.15\,\mathrm m`}</M> so <M p=".">{t`v_C = 2\cdot 0.15 = 0.3\,\mathrm{m/s}`}</M> The top point of the rim is twice as fast. <See id="kreiselung">Spinning motion</See></>} />}
        />
      </Section>

      <Section id="allgemein-quiz" title={<T de="Allgemeine Bewegung" en="General motion" />}>
        <NumericAnswer
          question={<T de={<>Ein starrer Körper: <M p=",">{t`\v v_B = (1, 0, 0)\,\mathrm{m/s}`}</M> <M p=",">{t`\v\omega = (0, 0, 2)\,\mathrm{s^{-1}}`}</M> <M p=".">{t`\v{BM} = (0;\ 0{,}25;\ 0)\,\mathrm m`}</M> Wie gross ist <M p="?">{t`|\v v_M|`}</M></>} en={<>A rigid body: <M p=",">{t`\v v_B = (1, 0, 0)\,\mathrm{m/s}`}</M> <M p=",">{t`\v\omega = (0, 0, 2)\,\mathrm{s^{-1}}`}</M> <M p=".">{t`\v{BM} = (0, 0.25, 0)\,\mathrm m`}</M> What is <M p="?">{t`|\v v_M|`}</M></>} />}
          value={Q3.fieldVM} unit="m/s"
          explain={<T de={<>Grundgleichung: <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M> Der Drehteil ist <M p=",">{t`\v\omega\times\v{BM} = (-0{,}5;\ 0;\ 0)\,\mathrm{m/s}`}</M> also <M p=".">{t`\v v_M = (0{,}5;\ 0;\ 0)\,\mathrm{m/s}`}</M> Die Drehung bremst <M>M</M> hier: <M p=".">{t`|\v v_M| = 0{,}5\,\mathrm{m/s}`}</M> <See id="allgemein">Allgemeine Bewegung</See></>} en={<>Fundamental equation: <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M> The turning part is <M p=",">{t`\v\omega\times\v{BM} = (-0.5, 0, 0)\,\mathrm{m/s}`}</M> so <M p=".">{t`\v v_M = (0.5, 0, 0)\,\mathrm{m/s}`}</M> Here the turning slows <M>M</M> down: <M p=".">{t`|\v v_M| = 0.5\,\mathrm{m/s}`}</M> <See id="allgemein">General motion</See></>} />}
        />
        <Choice
          question={<T de={<>Man rechnet die Grundgleichung einmal mit Bezugspunkt <M>B</M> und einmal mit <M>C</M> aus. Was ist gleich?</>} en={<>You work out the fundamental equation once with reference point <M>B</M> and once with <M p=".">C</M> What is the same?</>} />}
          choices={[
            { text: <T de={<>der Translationsteil <M>{t`\v v_B`}</M> bzw. <M>{t`\v v_C`}</M></>} en={<>the translation part <M>{t`\v v_B`}</M> or <M>{t`\v v_C`}</M></>} />, why: <T de={<>Der hängt vom Bezugspunkt ab: Verschiedene Punkte haben verschiedene Geschwindigkeiten.</>} en={<>That depends on the reference point: different points have different velocities.</>} /> },
            { text: <M>{t`\v\omega`}</M>, correct: true, why: <T de={<>Die Platte dreht sich um denselben Winkel, egal mit welchem Punkt man mitfährt; die Rechnung auf S. 22 zeigt <M p=".">{t`\v\omega^* = \v\omega^{**}`}</M> <See id="allgemein">Allgemeine Bewegung</See></>} en={<>The plate turns by the same angle whichever point you ride with; the calculation on p. 22 shows <M p=".">{t`\v\omega^* = \v\omega^{**}`}</M> <See id="allgemein">General motion</See></>} /> },
            { text: <T de="nichts" en="nothing" />, why: <T de={<>Die Geschwindigkeit jedes einzelnen Punktes kommt in beiden Rechnungen gleich heraus – und auch <M>{t`\v\omega`}</M> ist gleich.</>} en={<>The velocity of each individual point comes out the same in both calculations – and <M>{t`\v\omega`}</M> is the same too.</>} /> },
          ]}
        />
        <Choice
          question={<T de="Ruht bei jeder Bewegung eines starren Körpers im Raum in jedem Augenblick irgendein Punkt?" en="In every motion of a rigid body in space, is some point at rest at each instant?" />}
          choices={[
            { text: <T de="Ja, man muss ihn nur finden." en="Yes, you just have to find it." />, why: <T de={<>In der Ebene stimmt das (wenn sich der Körper dreht), im Raum nicht. Gegenbeispiel: der Würfel auf S. 23.</>} en={<>In the plane this is true (if the body turns), in space not. Counter-example: the cube on p. 23.</>} /> },
            { text: <T de="Nein." en="No." />, correct: true, why: <T de={<>Die Komponente entlang <M>{t`\v\omega`}</M> ist für alle Punkte gleich: <M p=".">{t`\v\omega\cdot\v v_M = \v\omega\cdot\v v_B`}</M> Ist sie nicht null (Würfel: <M p="),">{t`-v^2/L`}</M> ruht kein Punkt. <See id="allgemein">Allgemeine Bewegung</See></>} en={<>The component along <M>{t`\v\omega`}</M> is the same for all points: <M p=".">{t`\v\omega\cdot\v v_M = \v\omega\cdot\v v_B`}</M> If it is not zero (cube: <M p="),">{t`-v^2/L`}</M> no point is at rest. <See id="allgemein">General motion</See></>} /> },
          ]}
        />
        <Predict
          prompt={<T de={<>Leite die SdpG aus der Grundgleichung <M>{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M> her.</>} en={<>Derive the SdpG from the fundamental equation <M p=".">{t`\v v_M = \v v_B + \v\omega\times\v{BM}`}</M></>} />}
          answer={<T
            de={<>Bilde auf beiden Seiten das Skalarprodukt mit <M p=".">{t`\v{BM}`}</M> Der Drehteil <M>{t`\v\omega\times\v{BM}`}</M> steht senkrecht auf <M p=",">{t`\v{BM}`}</M> fällt also weg: <MD>{t`\v v_M\cdot\v{BM} = \v v_B\cdot\v{BM}.`}</MD> <See id="allgemein">Allgemeine Bewegung</See></>}
            en={<>Take the dot product of both sides with <M p=".">{t`\v{BM}`}</M> The turning part <M>{t`\v\omega\times\v{BM}`}</M> is perpendicular to <M p=",">{t`\v{BM}`}</M> so it drops out: <MD>{t`\v v_M\cdot\v{BM} = \v v_B\cdot\v{BM}.`}</MD> <See id="allgemein">General motion</See></>} />}
        />
      </Section>
    </article>
  );
}
