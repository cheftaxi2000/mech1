import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { rollScene } from '../viz/anim/rollScene';
import { RollingWheel } from '../viz/RollingFigures';

const t = String.raw;

export default function L10Rolling() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein rollendes Rad hat eine überraschende Eigenschaft: Der Punkt unten, der gerade die Strasse berührt, steht für einen Augenblick still. Daraus folgt alles Weitere – Rollen ist eine <b>momentane Rotation</b>. Danach klärt das Skript, wann zwei Körper aufeinander rollen und wann sie gleiten.</p>}
        en={<p className="lede">A rolling wheel has a surprising property: the point at the bottom that is touching the road stands still for an instant. Everything else follows from this – rolling is a <b>momentary rotation</b>. Then the notes make precise when two bodies roll on each other and when they slide.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an einen Autoreifen auf trockener Strasse. Würde er unten rutschen, gäbe es Bremsspuren – beim normalen Fahren gibt es keine. Der Teil des Reifens, der gerade den Boden berührt, steht also still. Und ganz oben ist der Reifen doppelt so schnell wie das Auto: Bei einem fahrenden Velo sind die Speichen oben verwischt, unten sieht man sie scharf.</p>}
          en={<p>Think of a car tyre on a dry road. If it slid at the bottom there would be skid marks – in normal driving there are none. So the part of the tyre touching the ground stands still. And at the very top the tyre moves twice as fast as the car: on a moving bicycle the spokes are blurred at the top and sharp at the bottom.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="rollen" title={<T de="1. Rollen ist eine momentane Rotation" en="1. Rolling is a momentary rotation" />}>
        <Box kind="lecture" src={<Src p={20} />}>
          <T
            de={<p><b>Rollen:</b> momentane Rotation. Figur: ein Zylinder auf einer Ebene, unten die Punkte <M p=",">A</M> <M p=",">B</M> auf seiner Achse <M>C</M> und <M p=";">D</M> <M p=".">{t`\mu \leftrightarrow AB`}</M></p>}
            en={<p><b>Rolling</b> (<span lang="de">Rollen</span>): momentary rotation. Figure: a cylinder on a plane, at the bottom the points <M p=",">A</M> <M p=",">B</M> on its axis <M>C</M> and <M p=";">D</M> <M p=".">{t`\mu \leftrightarrow AB`}</M></p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> «Momentan» heisst wieder: nur in diesem Augenblick (wie bei der momentanen Translation). Der Zylinder berührt den Boden entlang der Linie <M p=".">{t`AB`}</M> Rollt er, ohne zu rutschen, ruhen die Punkte auf <M>{t`AB`}</M> in diesem Augenblick. Zwei ruhende Punkte – das ist nach S. 15 eine Rotation, mit der Achse <M p=".">{t`\mu = AB`}</M> Also nicht die eigene Achse <M p=":">{t`CD`}</M> Die bewegt sich ja mit dem Zylinder mit.</p>}
          en={<p><b>How to read this:</b> “momentary” again means: only at this instant (as with momentary translation). The cylinder touches the ground along the line <M p=".">{t`AB`}</M> If it rolls without sliding, the points on <M>{t`AB`}</M> are at rest at this instant. Two points at rest – by p. 15 that is a rotation, with the axis <M p=".">{t`\mu = AB`}</M> So not its own axis <M p=":">{t`CD`}</M> that one moves along with the cylinder.</p>}
        />
        <Derivation title={<T de="Rollen Schritt für Schritt" en="Rolling step by step" />}>
          <StepPlayer
            label={tr('Animation: rollender Zylinder, momentane Drehachse', 'Animation: rolling cylinder, momentary axis')}
            steps={[
              { ms: 2000, holdMs: 2500, caption: <T
                de={<>Ein Zylinder liegt auf einer Ebene und berührt sie entlang der Linie <M p=".">{t`AB`}</M> <M>{t`CD`}</M> ist seine eigene Achse; die rote Linie ist eine Markierung auf dem Zylinder.</>}
                en={<>A cylinder lies on a plane and touches it along the line <M p=".">{t`AB`}</M> <M>{t`CD`}</M> is its own axis; the red line is a mark on the cylinder.</>} /> },
              { ms: 4000, holdMs: 3000, caption: <T
                de={<>Er rollt nach rechts, ohne zu rutschen; die Markierung dreht sich mit. Die Punkte, die gerade den Boden berühren, ruhen in diesem Augenblick.</>}
                en={<>It rolls to the right without sliding; the mark turns with it. The points touching the ground at this instant are at rest.</>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<><M>A</M> und <M>B</M> ruhen, also ist das jetzt eine Rotation um <M p=".">{t`\mu = AB`}</M> Die Geschwindigkeit wächst mit dem Abstand von <M p=":">{t`AB`}</M> <M>C</M> hat <M p=",">{t`\v v_C`}</M> der oberste Punkt <M p=".">{t`2\,\v v_C`}</M></>}
                en={<><M>A</M> and <M>B</M> are at rest, so this is now a rotation about <M p=".">{t`\mu = AB`}</M> The velocity grows with the distance from <M p=":">{t`AB`}</M> <M>C</M> has <M p=",">{t`\v v_C`}</M> the top point <M p=".">{t`2\,\v v_C`}</M></>} /> },
              { ms: 4000, caption: <T
                de={<>Einen Augenblick später berührt eine andere Linie den Boden, und <M>\mu</M> wandert mit (gestrichelt: wo <M>\mu</M> eben noch war). Darum heisst es <b>momentane</b> Rotation.</>}
                en={<>An instant later another line touches the ground, and <M>\mu</M> moves along (dashed: where <M>\mu</M> was a moment ago). That is why it is called a <b>momentary</b> rotation.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={rollScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="supplement" title={<T de={<>Folgerung: <M>{t`v_C = \omega R`}</M></>} en={<>Consequence: <M>{t`v_C = \omega R`}</M></>} />}>
          <T
            de={<p>Dreht sich der Zylinder (Radius <M p=")">R</M> mit der Winkelschnelligkeit <M>\omega</M> um <M p=",">{t`AB`}</M> ist ein Punkt in der Höhe <M>h</M> über dem Boden <M>{t`\omega h`}</M> schnell. Für <M>C</M> ist <M p=",">{t`h = R`}</M> also <M p=".">{t`v_C = \omega R`}</M> Für den obersten Punkt ist <M p=",">{t`h = 2R`}</M> also <M p=".">{t`2\,v_C`}</M> Das ist die Formel <M>{t`|\v v| = |\v\omega|\cdot|\v{AM}|`}</M> aus der Lektion Rotation, mit der Berührlinie als Achse.</p>}
            en={<p>If the cylinder (radius <M p=")">R</M> turns with angular speed <M>\omega</M> about <M p=",">{t`AB`}</M> a point at height <M>h</M> above the ground has speed <M p=".">{t`\omega h`}</M> For <M p=",">C</M> <M p=",">{t`h = R`}</M> so <M p=".">{t`v_C = \omega R`}</M> For the top point <M p=",">{t`h = 2R`}</M> so <M p=".">{t`2\,v_C`}</M> This is the formula <M>{t`|\v v| = |\v\omega|\cdot|\v{AM}|`}</M> from the rotation lesson, with the contact line as the axis.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="gleiten" title={<T de="2. Gleiten oder Rollen?" en="2. Sliding or rolling?" />}>
        <Box kind="lecture" src={<Src p={20} />} title={<T de="Gleiten / Rollen" en={<>Sliding / rolling (<span lang="de">Gleiten / Rollen</span>)</>} />}>
          <T
            de={<p>Kontakt (ohne Eindringen) zweier Körper <M p=",">{t`Z_1`}</M> <M>{t`Z_2`}</M> in einem Punkt; Tangentialebene <M p=",">E</M> <M p=",">{t`\v n \perp E`}</M> <M>{t`\v t`}</M> in <M p=".">E</M></p>}
            en={<p>Contact (without penetration) of two bodies <M p=",">{t`Z_1`}</M> <M>{t`Z_2`}</M> at a point; tangent plane <M p=",">E</M> <M p=",">{t`\v n \perp E`}</M> <M>{t`\v t`}</M> in <M p=".">E</M></p>}
          />
          <T
            de={<ul>
              <li>«Kontakt» <M>{t`\to`}</M> <M p=";">{t`\v v_n(Z_1) = \v v_n(Z_2)`}</M></li>
              <li>Gleiten: <M p=";">{t`\v v_t(Z_1) \ne \v v_t(Z_2)`}</M></li>
              <li>Rollen: <M p=".">{t`\v v_t(Z_1) = \v v_t(Z_2)`}</M></li>
              <li>Falls <M>{t`Z_2`}</M> in Ruhe: <M>{t`\v v(Z_1) = \v 0 \leftrightarrow`}</M> Rollen; <M>{t`\v v(Z_1) = \v v_t(Z_1) \ne \v 0 \leftrightarrow`}</M> Gleiten.</li>
            </ul>}
            en={<ul>
              <li>“Contact” (<span lang="de">Kontakt</span>) <M>{t`\to`}</M> <M p=";">{t`\v v_n(Z_1) = \v v_n(Z_2)`}</M></li>
              <li>Sliding (<span lang="de">Gleiten</span>): <M p=";">{t`\v v_t(Z_1) \ne \v v_t(Z_2)`}</M></li>
              <li>Rolling (<span lang="de">Rollen</span>): <M p=".">{t`\v v_t(Z_1) = \v v_t(Z_2)`}</M></li>
              <li>If <M>{t`Z_2`}</M> is at rest: <M>{t`\v v(Z_1) = \v 0 \leftrightarrow`}</M> rolling; <M>{t`\v v(Z_1) = \v v_t(Z_1) \ne \v 0 \leftrightarrow`}</M> sliding.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Zwei Körper berühren sich in einem Punkt. <M>E</M> ist dort die gemeinsame Tangentialebene – beim Rad auf dem Band die Oberfläche des Bandes. <M>{t`\v n`}</M> steht senkrecht auf <M p=",">E</M> <M>{t`\v t`}</M> liegt in <M p=".">E</M></li>
              <li>Man zerlegt die Geschwindigkeit jedes Körpers im Kontaktpunkt in einen <b>Normalteil</b> <M>{t`\v v_n`}</M> (entlang <M p=")">{t`\v n`}</M> und einen <b>Tangentialteil</b> <M>{t`\v v_t`}</M> (in <M p=").">E</M></li>
              <li>«Kontakt ohne Eindringen» heisst: Die Normalteile sind gleich. Sonst würde ein Körper in den anderen eindringen oder sich von ihm lösen.</li>
              <li>Die Tangentialteile entscheiden. Verschieden: Die Körper reiben aneinander vorbei – <b>Gleiten</b>. Gleich: kein Rutschen – <b>Rollen</b>.</li>
              <li>Ruht <M>{t`Z_2`}</M> (zum Beispiel die Strasse), sind seine beiden Teile null. Dann heisst Rollen einfach: Der Kontaktpunkt von <M>{t`Z_1`}</M> ruht.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>Two bodies touch at a point. <M>E</M> is the common tangent plane there – for the wheel on the belt, the surface of the belt. <M>{t`\v n`}</M> is perpendicular to <M p=",">E</M> <M>{t`\v t`}</M> lies in <M p=".">E</M></li>
              <li>Split the velocity of each body at the contact point into a <b>normal part</b> <M>{t`\v v_n`}</M> (along <M p=")">{t`\v n`}</M> and a <b>tangential part</b> <M>{t`\v v_t`}</M> (in <M p=").">E</M></li>
              <li>“Contact without penetration” means: the normal parts are equal. Otherwise one body would penetrate the other or come off it.</li>
              <li>The tangential parts decide. Different: the bodies rub past each other – <b>sliding</b> (<span lang="de">Gleiten</span>). Equal: no slipping – <b>rolling</b> (<span lang="de">Rollen</span>).</li>
              <li>If <M>{t`Z_2`}</M> is at rest (for example the road), both its parts are zero. Then rolling simply means: the contact point of <M>{t`Z_1`}</M> is at rest.</li>
            </ol>
          </>}
        />
        <RollingWheel />
        <T
          de={<>
            <p>Die vier Knöpfe zeigen typische Fälle:</p>
            <ul>
              <li><b>Rollen:</b> Der rote Pfeil bei <M>K</M> verschwindet, der violette Drehpunkt liegt genau bei <M p=".">K</M> Die Bahn des roten Randpunkts (Zykloide) hat unten eine Spitze – dort steht der Punkt still.</li>
              <li><b>Rad blockiert:</b> Das Rad dreht sich nicht, alle Pfeile sind gleich (Translation). Bei <M>K</M> rutscht es mit <M>{t`v_C`}</M> über den Boden: Gleiten.</li>
              <li><b>Durchdrehen:</b> Das Rad dreht sich schneller, als es vorankommt. <M>K</M> rutscht nach hinten: auch Gleiten.</li>
              <li><b>Band läuft:</b> Das Band läuft rückwärts. Der Kontaktpunkt des Rades bewegt sich – aber genau so schnell wie das Band: Rollen.</li>
            </ul>
          </>}
          en={<>
            <p>The four buttons show typical cases:</p>
            <ul>
              <li><b>Rolling:</b> the red arrow at <M>K</M> vanishes, the purple centre of rotation lies exactly at <M p=".">K</M> The path of the red rim point (a cycloid) has a sharp tip at the bottom – there the point stands still.</li>
              <li><b>Wheel locked:</b> the wheel does not turn, all arrows are equal (translation). At <M>K</M> it slips over the ground with <M p=":">{t`v_C`}</M> sliding.</li>
              <li><b>Wheel spin:</b> the wheel turns faster than it moves forward. <M>K</M> slips backwards: sliding too.</li>
              <li><b>Belt running:</b> the belt runs backwards. The wheel’s contact point moves – but exactly as fast as the belt: rolling.</li>
            </ul>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="missverstaendnisse" title={<T de="3. Häufige Missverständnisse" en="3. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Der unterste Punkt bewegt sich mit dem Rad mit.»" en="“The bottom point moves along with the wheel.”" />}>
          <T de={<>Die <em>Stelle</em> des Kontakts wandert mit, aber der Punkt des Rades, der gerade unten ist, ruht. Im nächsten Augenblick ist es ein anderer Punkt. Darum hat die Bahn eines Randpunkts unten eine Spitze.</>} en={<>The <em>place</em> of contact moves along, but the point of the wheel that is at the bottom right now is at rest. At the next instant it is a different point. That is why the path of a rim point has a sharp tip at the bottom.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die momentane Drehachse eines rollenden Rades ist seine eigene Achse.»" en="“The momentary axis of a rolling wheel is its own axle.”" />}>
          <T de={<>Nein. Die Achse <M>{t`CD`}</M> bewegt sich mit <M p=",">{t`\v v_C`}</M> ein Punkt einer Drehachse müsste aber ruhen. Die momentane Achse ist die Berührlinie <M p=".">{t`AB`}</M></>} en={<>No. The axle <M>{t`CD`}</M> moves with <M p=",">{t`\v v_C`}</M> but a point of an axis of rotation must be at rest. The momentary axis is the contact line <M p=".">{t`AB`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Rollen heisst: Der Kontaktpunkt ruht.»" en="“Rolling means: the contact point is at rest.”" />}>
          <T de={<>Nur wenn der Untergrund ruht. Auf einem laufenden Band rollt das Rad, wenn sein Kontaktpunkt genau so schnell ist wie das Band (Knopf «Band läuft»). Allgemein zählt: gleiche Tangentialteile.</>} en={<>Only if the ground is at rest. On a running belt the wheel rolls when its contact point is exactly as fast as the belt (button “belt running”). In general what counts is: equal tangential parts.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Oben ist ein rollendes Rad so schnell wie das Fahrzeug.»" en="“At the top a rolling wheel is as fast as the vehicle.”" />}>
          <T de={<>Doppelt so schnell: <M p=".">{t`2\,v_C`}</M> Unten <M p=",">0</M> in der Mitte <M p=",">{t`v_C`}</M> dazwischen gleichmässig mit der Höhe.</>} en={<>Twice as fast: <M p=".">{t`2\,v_C`}</M> At the bottom <M p=",">0</M> in the middle <M p=",">{t`v_C`}</M> evenly with the height in between.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ausblick" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T de={<>Rollen auf ruhendem Boden: Die Berührlinie ruht, also ist das eine momentane Rotation um die Berührlinie. Die Geschwindigkeit wächst mit der Höhe: unten <M p=",">0</M> Mitte <M p=",">{t`v_C = \omega R`}</M> oben <M p=".">{t`2\,v_C`}</M></>} en={<>Rolling on ground at rest: the contact line is at rest, so this is a momentary rotation about the contact line. The velocity grows with the height: bottom <M p=",">0</M> middle <M p=",">{t`v_C = \omega R`}</M> top <M p=".">{t`2\,v_C`}</M></>} />
          <MD>{t`\text{${tr('Kontakt', 'contact')}: } \v v_n(Z_1) = \v v_n(Z_2), \qquad \text{${tr('Rollen', 'rolling')}: } \v v_t(Z_1) = \v v_t(Z_2), \qquad \text{${tr('Gleiten', 'sliding')}: } \v v_t(Z_1) \ne \v v_t(Z_2)`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Bei der Rotation ruhen zwei Punkte. Ruht nur <em>ein</em> Punkt, heisst die Bewegung <b>Kreiselung</b> <Src p={20} />.</p>}
          en={<p className="connections"><b>Next:</b> in a rotation two points are at rest. If only <em>one</em> point is at rest, the motion is called <b>spinning motion</b> (<span lang="de">Kreiselung</span>) <Src p={20} />.</p>}
        />
      </Section>
    </article>
  );
}
