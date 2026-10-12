import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CircleAnim } from '../viz/anim/CircleAnim';
import { RotationField } from '../viz/CircleFigures';

const t = String.raw;

export default function L06Circle() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die Kreisbewegung ist der wichtigste Spezialfall der Mechanik: Jeder Punkt eines drehenden Körpers – Rad, Turbine, Erde – fährt im Kreis. Diese Lektion beschreibt sie mit den Werkzeugen von S. 10 und führt die <b>Winkelgeschwindigkeit</b> <M>{t`\v\omega`}</M> ein. Am Ende steht die kurze Formel <M p=",">{t`\v v = \v\omega\times\v r`}</M> die uns durch die ganze Starrkörper-Kinematik begleitet.</p>}
        en={<p className="lede">Circular motion is the most important special case in mechanics: every point of a turning body – wheel, turbine, Earth – travels on a circle. This lesson describes it with the tools of p. 10 and introduces the <b>angular velocity</b> <M p=".">{t`\v\omega`}</M> At the end stands the short formula <M p=",">{t`\v v = \v\omega\times\v r`}</M> which accompanies us through all of rigid-body kinematics.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an den Sekundenzeiger einer Uhr. Seine Spitze bleibt immer gleich weit von der Mitte (<M p=")">{t`\rho = R`}</M> und auf gleicher Höhe (<M p=").">{t`z = z_0`}</M> Nur der Winkel <M>\varphi</M> ändert sich. Wie schnell sich der Winkel ändert, ist <M>{t`\dot\varphi`}</M> – beim Sekundenzeiger eine Umdrehung pro Minute. Wie schnell die Spitze fährt, hängt zusätzlich von der Länge <M>R</M> ab: Ein langer Zeiger fährt bei gleichem <M>{t`\dot\varphi`}</M> schneller.</p>}
          en={<p>Think of the second hand of a clock. Its tip always stays at the same distance from the centre (<M p=")">{t`\rho = R`}</M> and at the same height (<M p=").">{t`z = z_0`}</M> Only the angle <M>\varphi</M> changes. How fast the angle changes is <M>{t`\dot\varphi`}</M> – for the second hand one turn per minute. How fast the tip travels also depends on the length <M p=":">R</M> a longer hand is faster at the same <M p=".">{t`\dot\varphi`}</M></p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="ort" title={<T de="1. Lage und Geschwindigkeit auf dem Kreis" en="1. Position and velocity on the circle" />}>
        <Box kind="lecture" src={<Src p={11} />}>
          <MD>{t`\rho = R, \qquad \varphi = \varphi(t), \qquad z = z_0`}</MD>
          <T de="In zylindrischer Basis:" en="In the cylindrical basis:" />
          <MD>{t`\v r(t) = R\,\v e_\rho + z_0\,\v e_z, \quad \v e_\rho(\varphi(t)); \qquad \v r : \cancel{\begin{pmatrix} R \\ \varphi(t) \\ z_0 \end{pmatrix}}\ \text{Falsch!} \ \to\ \v r : \begin{pmatrix} R \\ 0 \\ z_0 \end{pmatrix}`}</MD>
          <MD>{t`\v v = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z = R\dot\varphi\,\v e_\varphi \ ` + tr(t`\text{: tangential zum Kreis}`, t`\text{: tangent to the circle}`) + t`, \qquad \dot s = R\dot\varphi, \quad \v\tau = \v e_\varphi`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Warum steht im Skript «Falsch!»?</b> Die Spalte rechts sind die <em>Komponenten</em> von <M>{t`\v r`}</M> in der Basis <M p=",">{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> also «wie viel von jedem Basisvektor». <M>{t`\v r`}</M> enthält <M>R</M> mal <M>{t`\v e_\rho`}</M> und <M>{t`z_0`}</M> mal <M p=",">{t`\v e_z`}</M> aber <em>nichts</em> von <M p=".">{t`\v e_\varphi`}</M> Der Winkel steckt nicht in einer Komponente, sondern in der Richtung von <M>{t`\v e_\rho`}</M> (<a href="#basen">Basen</a>).</p>
            <p><b>Die Geschwindigkeit</b> folgt direkt aus S. 10: <M>R</M> ist fest, also <M p=";">{t`\dot\rho = 0`}</M> <M>{t`z_0`}</M> ist fest, also <M p=".">{t`\dot z = 0`}</M> Übrig bleibt nur der Dreh-Term: <M p=".">{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> Der Pfeil zeigt entlang des Kreises, die Schnelligkeit ist <M p=".">{t`\dot s = R\dot\varphi`}</M></p>
            <p><b><M>{t`\dot\varphi`}</M> heisst Winkelschnelligkeit</b> und wird in rad/s gemessen (Bogenmass pro Sekunde). Eine Umdrehung ist <M p=",">{t`2\pi`}</M> also ist eine Umdrehung pro Sekunde <M p=".">{t`\dot\varphi = 2\pi\ \text{rad/s} \approx 6{,}28\ \text{rad/s}`}</M></p>
          </>}
          en={<>
            <p><b>Why do the notes say “Falsch!”?</b> The column on the right holds the <em>components</em> of <M>{t`\v r`}</M> in the basis <M p=",">{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> i.e. “how much of each basis vector”. <M>{t`\v r`}</M> contains <M>R</M> times <M>{t`\v e_\rho`}</M> and <M>{t`z_0`}</M> times <M p=",">{t`\v e_z`}</M> but <em>nothing</em> of <M p=".">{t`\v e_\varphi`}</M> The angle is not in a component but in the direction of <M>{t`\v e_\rho`}</M> (<a href="#basen">Bases</a>).</p>
            <p><b>The velocity</b> follows directly from p. 10: <M>R</M> is fixed, so <M p=";">{t`\dot\rho = 0`}</M> <M>{t`z_0`}</M> is fixed, so <M p=".">{t`\dot z = 0`}</M> Only the turning term remains: <M p=".">{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> The arrow points along the circle; the speed is <M p=".">{t`\dot s = R\dot\varphi`}</M></p>
            <p><b><M>{t`\dot\varphi`}</M> is called angular speed</b> (<em lang="de">Winkelschnelligkeit</em>) and is measured in rad/s (radians per second). One turn is <M p=",">{t`2\pi`}</M> so one turn per second is <M p=".">{t`\dot\varphi = 2\pi\ \text{rad/s} \approx 6.28\ \text{rad/s}`}</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="omega" title={<T de={<>2. Winkelgeschwindigkeit und <M>{t`\v v = \v\omega\times\v r`}</M></>} en={<>2. Angular velocity and <M>{t`\v v = \v\omega\times\v r`}</M></>} />}>
        <Box kind="lecture" src={<Src p={11} />}>
          <T de={<><M p=":">{t`\dot\varphi`}</M> Winkelschnelligkeit in rad/s <M>\to</M> «Winkelgeschwindigkeit»</>} en={<><M p=":">{t`\dot\varphi`}</M> angular speed in rad/s <M>\to</M> “angular velocity” (<em lang="de">Winkelgeschwindigkeit</em>)</>} />
          <MD>{t`\v\omega = \dot\varphi\,\v e_z`}</MD>
          <T de="Umformung:" en="Rearrangement (Umformung):" />
          <MD>{t`\v e_\varphi = \v e_z\times\v e_\rho \ \to\ \v v = R\dot\varphi\,(\v e_z\times\v e_\rho) = \dot\varphi\,\v e_z\times R\,\v e_\rho`}</MD>
          <MD>{t`\v r = R\,\v e_\rho + z_0\,\v e_z \ \to\ R\,\v e_\rho = \v r - z_0\,\v e_z`}</MD>
          <MD>{t`\v v = \dot\varphi\,\v e_z\times(\v r - z_0\,\v e_z) = \dot\varphi\,\v e_z\times\v r - z_0\dot\varphi\,\cancel{\v e_z\times\v e_z}`}</MD>
          <MD>{t`\v v = \dot\varphi\,\v e_z\times\v r = \v\omega\times\v r \ ` + tr(t`\text{: Kreisbewegung}`, t`\text{: circular motion}`)}</MD>
        </Box>
        <T
          de={<p><b>Warum ein Vektor?</b> Eine Drehung hat eine <em>Achse</em> und einen <em>Drehsinn</em>. Beides packt man in einen Pfeil: <M>{t`\v\omega`}</M> liegt auf der Drehachse, seine Länge ist der Betrag der Winkelschnelligkeit, und er zeigt so, dass die Finger der rechten Hand in Drehrichtung zeigen, wenn der Daumen entlang <M>{t`\v\omega`}</M> zeigt. Dreht sich der Punkt gegen den Uhrzeigersinn (von oben gesehen), zeigt <M>{t`\v\omega`}</M> nach oben. Ist <M p=",">{t`\dot\varphi < 0`}</M> dreht der Punkt im Uhrzeigersinn, und <M>{t`\v\omega = \dot\varphi\,\v e_z`}</M> zeigt nach unten.</p>}
          en={<p><b>Why a vector?</b> A rotation has an <em>axis</em> and a <em>sense</em>. Both are packed into one arrow: <M>{t`\v\omega`}</M> lies on the axis of rotation, its length is the magnitude of the angular speed, and it points so that the fingers of the right hand point in the direction of turning when the thumb points along <M p=".">{t`\v\omega`}</M> If the point turns counter-clockwise (seen from above), <M>{t`\v\omega`}</M> points up. If <M p=",">{t`\dot\varphi < 0`}</M> the point turns clockwise and <M>{t`\v\omega = \dot\varphi\,\v e_z`}</M> points down.</p>}
        />
        <Derivation title={<T de={<><M>{t`\v v = \v\omega\times\v r`}</M> Schritt für Schritt</>} en={<><M>{t`\v v = \v\omega\times\v r`}</M> step by step</>} />}>
          <StepPlayer
            label={tr('Animation: Kreisbewegung und v = ω × r', 'Animation: circular motion and v = ω × r')}
            steps={[
              { ms: 4500, caption: <T
                de={<>Die Bahn ist ein Kreis mit Radius <M>R</M> auf der Höhe <M p=".">{t`z_0`}</M> <M>M</M> fährt darauf; dabei ändert sich nur <M p=".">\varphi</M></>}
                en={<>The path is a circle of radius <M>R</M> at height <M p=".">{t`z_0`}</M> <M>M</M> travels on it; only <M>\varphi</M> changes.</>} /> },
              { ms: 3500, holdMs: 2500, caption: <T
                de={<>In <M>M</M> die Basis <M p=".">{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> Die Geschwindigkeit hat nur den Dreh-Anteil: <M p=",">{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> tangential zum Kreis (rot).</>}
                en={<>At <M>M</M> the basis <M p=".">{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> The velocity has only the turning part: <M p=",">{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> tangent to the circle (red).</>} /> },
              { ms: 3500, holdMs: 2500, caption: <T
                de={<>Auf der Achse der Pfeil <M p=".">{t`\v\omega = \dot\varphi\,\v e_z`}</M> Der kleine Bogen zeigt den Drehsinn: Daumen nach oben, Finger drehen gegen den Uhrzeigersinn – wie <M p=".">M</M></>}
                en={<>On the axis, the arrow <M p=".">{t`\v\omega = \dot\varphi\,\v e_z`}</M> The small arc shows the sense of rotation: thumb up, fingers curl counter-clockwise – like <M p=".">M</M></>} /> },
              { ms: 3500, holdMs: 2500, caption: <T
                de={<>Erster Trick: <M p=".">{t`\v e_\varphi = \v e_z\times\v e_\rho`}</M> Dreht man <M>{t`\v e_\rho`}</M> um <M>{t`\v e_z`}</M> eine Vierteldrehung weiter, erhält man <M>{t`\v e_\varphi`}</M> – wie <M>{t`\v e_z\times\v e_x = \v e_y`}</M> (Rechtssystem, <a href="#vektoren">Vektoren</a>).</>}
                en={<>First trick: <M p=".">{t`\v e_\varphi = \v e_z\times\v e_\rho`}</M> Turning <M>{t`\v e_\rho`}</M> a quarter turn further about <M>{t`\v e_z`}</M> gives <M>{t`\v e_\varphi`}</M> – like <M>{t`\v e_z\times\v e_x = \v e_y`}</M> (right-handed system, <a href="#vektoren">Vectors</a>).</>} /> },
              { ms: 4000, holdMs: 2500, caption: <T
                de={<>Zweiter Trick: Der Ortsvektor (schwarz) besteht aus dem Stück entlang der Achse (grün, <M p=")">{t`z_0\,\v e_z`}</M> und dem Radius (türkis, <M p=").">{t`R\,\v e_\rho`}</M> Also <M p=".">{t`R\,\v e_\rho = \v r - z_0\,\v e_z`}</M></>}
                en={<>Second trick: the position vector (black) consists of the piece along the axis (green, <M p=")">{t`z_0\,\v e_z`}</M> and the radius (teal, <M p=").">{t`R\,\v e_\rho`}</M> So <M p=".">{t`R\,\v e_\rho = \v r - z_0\,\v e_z`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Einsetzen: <M p=".">{t`\v v = \dot\varphi\,\v e_z\times(\v r - z_0\,\v e_z)`}</M> Das grüne Stück liegt auf der Achse, parallel zu <M p=";">{t`\v\omega`}</M> parallele Vektoren haben Kreuzprodukt null. Es bleibt <M p=".">{t`\v v = \v\omega\times\v r`}</M></>}
                en={<>Substitute: <M p=".">{t`\v v = \dot\varphi\,\v e_z\times(\v r - z_0\,\v e_z)`}</M> The green piece lies on the axis, parallel to <M p=";">{t`\v\omega`}</M> parallel vectors have zero cross product. What remains is <M p=".">{t`\v v = \v\omega\times\v r`}</M></>} /> },
            ]}
          >
            {(step, tt) => <CircleAnim step={step} t={tt} />}
          </StepPlayer>
          <T
            de={<p><b>Was <M>{t`\v\omega\times\v r`}</M> im Bild bedeutet</b> (letzter Schritt): Die zwei Winkelmarken zeigen, dass <M>{t`\v v`}</M> senkrecht auf der Achse (also auf <M p=")">{t`\v\omega`}</M> und senkrecht auf dem Radius <M>{t`R\,\v e_\rho`}</M> steht. Damit steht <M>{t`\v v`}</M> auch senkrecht auf <M p=",">{t`\v r = R\,\v e_\rho + z_0\,\v e_z`}</M> so wie es das Kreuzprodukt verlangt. Seine Länge ist <M>{t`|\v\omega|\,|\v r|\sin\alpha`}</M> mit dem Winkel <M>\alpha</M> zwischen Achse und <M p=",">{t`\v r`}</M> und <M>{t`|\v r|\sin\alpha`}</M> ist genau der Abstand <M>R</M> von der Achse. Also <M p=",">{t`|\v v| = |\dot\varphi|\,R`}</M> wie oben.</p>}
            en={<p><b>What <M>{t`\v\omega\times\v r`}</M> means in the picture</b> (last step): the two right-angle marks show that <M>{t`\v v`}</M> is perpendicular to the axis (i.e. to <M p=")">{t`\v\omega`}</M> and to the radius <M p=".">{t`R\,\v e_\rho`}</M> So <M>{t`\v v`}</M> is also perpendicular to <M p=",">{t`\v r = R\,\v e_\rho + z_0\,\v e_z`}</M> as the cross product demands. Its length is <M>{t`|\v\omega|\,|\v r|\sin\alpha`}</M> with the angle <M>\alpha</M> between the axis and <M p=",">{t`\v r`}</M> and <M>{t`|\v r|\sin\alpha`}</M> is exactly the distance <M>R</M> from the axis. So <M p=",">{t`|\v v| = |\dot\varphi|\,R`}</M> as above.</p>}
          />
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="allgemein" title={<T de="3. Allgemein: jeder Punkt eines drehenden Körpers" en="3. In general: every point of a turning body" />}>
        <Box kind="lecture" src={<Src p={11} />}>
          <T de={<><b>Allgemein!</b> <M>{t`\v\omega \parallel`}</M> Achse der Bewegung, <M>{t`\v v = \v 0`}</M> auf der Achse.</>} en={<><b>In general!</b> <M>{t`\v\omega \parallel`}</M> the axis of the motion, <M>{t`\v v = \v 0`}</M> on the axis.</>} />
        </Box>
        <T
          de={<p>Die Formel <M>{t`\v v = \v\omega\times\v r`}</M> gilt für jeden Punkt, der um dieselbe Achse kreist – mit demselben <M p=".">{t`\v\omega`}</M> Im Bild dreht sich ein starres Gestell. Schieb <M>{t`\dot\varphi`}</M> hin und her und schau auf die Pfeile.</p>}
          en={<p>The formula <M>{t`\v v = \v\omega\times\v r`}</M> holds for every point circling the same axis – with the same <M p=".">{t`\v\omega`}</M> In the figure a rigid frame turns. Move <M>{t`\dot\varphi`}</M> back and forth and watch the arrows.</p>}
        />
        <RotationField />
        <T
          de={<ul className="observe">
            <li>Der Punkt auf der Achse hat keinen Pfeil: <M p=".">{t`\v\omega\times\v r = \v 0`}</M> wenn <M>{t`\v r`}</M> parallel zu <M>{t`\v\omega`}</M> ist.</li>
            <li>Die Länge eines Pfeils ist <M>{t`|\dot\varphi|`}</M> mal Abstand zur Achse – die Höhe spielt keine Rolle (oberer und unterer Punkt des Pfostens sind gleich schnell).</li>
            <li>Schaltest du «<M>{t`O'`}</M> neben der Achse» ein, werden die grauen Pfeile falsch: Sie sind auf der Achse nicht null und nicht tangential. <M>{t`\v r`}</M> muss von einem Punkt <em>auf</em> der Achse aus gemessen werden (das betont die Vorlesung auf S. 18 noch einmal).</li>
          </ul>}
          en={<ul className="observe">
            <li>The point on the axis has no arrow: <M>{t`\v\omega\times\v r = \v 0`}</M> when <M>{t`\v r`}</M> is parallel to <M p=".">{t`\v\omega`}</M></li>
            <li>An arrow's length is <M>{t`|\dot\varphi|`}</M> times the distance from the axis – the height does not matter (top and bottom of the post are equally fast).</li>
            <li>Switch on “<M>{t`O'`}</M> off the axis” and the grey arrows become wrong: not zero on the axis and not tangent. <M>{t`\v r`}</M> must be measured from a point <em>on</em> the axis (the lecture stresses this again on p. 18).</li>
          </ul>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kartesisch" title={<T de="4. Nachrechnen in kartesischen Komponenten" en="4. Checking it in Cartesian components" />}>
        <Box kind="lecture" src={<Src p={11} />}>
          <MD>{t`\v\omega = \dot\varphi\,\v e_z, \qquad \v r = R\cos\varphi\,\v e_x + R\sin\varphi\,\v e_y + z_0\,\v e_z`}</MD>
          <MD>{t`\v v = \v\omega\times\v r = \begin{pmatrix} 0 \\ 0 \\ \dot\varphi \end{pmatrix}\times\begin{pmatrix} R\cos\varphi \\ R\sin\varphi \\ z_0 \end{pmatrix} = \begin{pmatrix} -\dot\varphi R\sin\varphi \\ \dot\varphi R\cos\varphi \\ 0 \end{pmatrix} = \dot\varphi R\,\v e_\varphi`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li>Kreuzprodukt mit der Komponentenformel aus <a href="#vektoren">Vektoren</a>: erste Komponente <M p=",">{t`0\cdot z_0 - \dot\varphi\cdot R\sin\varphi`}</M> zweite <M p=",">{t`\dot\varphi\cdot R\cos\varphi - 0\cdot z_0`}</M> dritte <M p=".">{t`0\cdot R\sin\varphi - 0\cdot R\cos\varphi = 0`}</M></li>
              <li>Die Höhe <M>{t`z_0`}</M> fällt dabei heraus – genau wie in der Umformung oben.</li>
              <li>Das Ergebnis ist <M>{t`\dot\varphi R`}</M> mal <M p=",">{t`(-\sin\varphi, \cos\varphi, 0)`}</M> und das ist <M>{t`\v e_\varphi`}</M> (S. 10, <a href="#v-krummlinig">Zylinder- und Kugelkoordinaten</a>). Beide Wege geben also dasselbe.</li>
            </ol>
            <p>Auf der Folie der Vorlesung (L5) steht dieselbe Rechnung in der zylindrischen Basis: <M p=".">{t`(0, 0, \dot\varphi)\times(R, 0, z_0) = (0, \dot\varphi R, 0) = \dot\varphi R\,\v e_\varphi`}</M> Das darf man, weil <M>{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> ebenfalls ein Rechtssystem aus Einheitsvektoren ist.</p>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li>Cross product with the component formula from <a href="#vektoren">Vectors</a>: first component <M p=",">{t`0\cdot z_0 - \dot\varphi\cdot R\sin\varphi`}</M> second <M p=",">{t`\dot\varphi\cdot R\cos\varphi - 0\cdot z_0`}</M> third <M p=".">{t`0\cdot R\sin\varphi - 0\cdot R\cos\varphi = 0`}</M></li>
              <li>The height <M>{t`z_0`}</M> drops out – just as in the rearrangement above.</li>
              <li>The result is <M>{t`\dot\varphi R`}</M> times <M p=",">{t`(-\sin\varphi, \cos\varphi, 0)`}</M> which is <M>{t`\v e_\varphi`}</M> (p. 10, <a href="#v-krummlinig">cylindrical and spherical coordinates</a>). Both ways give the same.</li>
            </ol>
            <p>The lecture slide (L5) does the same calculation in the cylindrical basis: <M p=".">{t`(0, 0, \dot\varphi)\times(R, 0, z_0) = (0, \dot\varphi R, 0) = \dot\varphi R\,\v e_\varphi`}</M> That is allowed because <M>{t`\v e_\rho, \v e_\varphi, \v e_z`}</M> is also a right-handed system of unit vectors.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v\omega`}</M> zeigt in Bewegungsrichtung.»</>} en={<>“<M>{t`\v\omega`}</M> points in the direction of motion.”</>} />}>
          <T de={<>Nein. In Bewegungsrichtung zeigt <M p=".">{t`\v v`}</M> <M>{t`\v\omega`}</M> liegt auf der <em>Drehachse</em> und steht senkrecht auf der Kreisebene.</>} en={<>No. <M>{t`\v v`}</M> points in the direction of motion. <M>{t`\v\omega`}</M> lies on the <em>axis of rotation</em>, perpendicular to the plane of the circle.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Winkelschnelligkeit und Schnelligkeit sind dasselbe.»</>} en={<>“Angular speed and speed are the same.”</>} />}>
          <T de={<><M>{t`\dot\varphi`}</M> (rad/s) sagt, wie schnell sich der <em>Winkel</em> ändert – für alle Punkte des drehenden Körpers gleich (Beweis auf S. 17). <M>{t`\dot s = R\dot\varphi`}</M> (m/s) ist die Schnelligkeit eines Punktes – aussen grösser als innen.</>} en={<><M>{t`\dot\varphi`}</M> (rad/s) says how fast the <em>angle</em> changes – the same for all points of the turning body (proof on p. 17). <M>{t`\dot s = R\dot\varphi`}</M> (m/s) is the speed of one point – larger further out.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v v = \v\omega\times\v r`}</M> gilt mit jedem Ursprung.»</>} en={<>“<M>{t`\v v = \v\omega\times\v r`}</M> holds for any origin.”</>} />}>
          <T de={<>Nur wenn <M>O</M> auf der Drehachse liegt. Sonst kommt ein falscher Anteil dazu (im Bild oben: «<M>{t`O'`}</M> neben der Achse»). Die Umformung hat das benutzt: <M>{t`\v r = R\,\v e_\rho + z_0\,\v e_z`}</M> setzt <M>O</M> auf die Achse.</>} en={<>Only if <M>O</M> lies on the axis of rotation. Otherwise a wrong part is added (in the figure above: “<M>{t`O'`}</M> off the axis”). The rearrangement used this: <M>{t`\v r = R\,\v e_\rho + z_0\,\v e_z`}</M> puts <M>O</M> on the axis.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <MD>{t`\v v = R\dot\varphi\,\v e_\varphi, \qquad \dot s = R\dot\varphi, \qquad \v\omega = \dot\varphi\,\v e_z, \qquad \v v = \v\omega\times\v r\ \ ` + tr(t`(O \text{ auf der Achse})`, t`(O \text{ on the axis})`)}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Ein starrer Körper, der sich um eine feste Achse dreht, besteht aus lauter solchen Kreisbewegungen mit <em>demselben</em> <M>{t`\v\omega`}</M> <Src p={15} />. Darum wird <M>{t`\v v = \v\omega\times\v r`}</M> zur Grundformel der Rotation <Src p={17} />.</p>}
          en={<p className="connections"><b>Next:</b> a rigid body turning about a fixed axis consists entirely of such circular motions with the <em>same</em> <M>{t`\v\omega`}</M> <Src p={15} />. That is why <M>{t`\v v = \v\omega\times\v r`}</M> becomes the basic formula of rotation <Src p={17} />.</p>}
        />
      </Section>
    </article>
  );
}
