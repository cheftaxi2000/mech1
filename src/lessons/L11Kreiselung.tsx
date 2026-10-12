import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { kreiselProofScene } from '../viz/anim/kreiselProofScene';
import { KreiselExplorer } from '../viz/KreiselFigures';

const t = String.raw;

export default function L11Kreiselung() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Kreisel tanzt auf seiner Spitze: Die Spitze bleibt an ihrem Ort, alles andere bewegt sich. Ruht bei einem starren Körper nur ein einziger Punkt, heisst die Bewegung <b>Kreiselung</b>. Das Skript zeigt: Auch dann ruht in jedem Augenblick eine ganze Achse. Die Kreiselung ist also eine <b>momentane Rotation</b>.</p>}
        en={<p className="lede">A spinning top dances on its tip: the tip stays where it is, everything else moves. If only a single point of a rigid body is at rest, the motion is called <b>spinning motion</b> (<span lang="de">Kreiselung</span>). The notes show: even then a whole axis is at rest at each instant. So spinning motion is a <b>momentary rotation</b>.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an einen Kreisel, dessen Spitze in einer kleinen Mulde steckt, oder an einen Joystick: Ein Punkt ist fest, der Rest kann kippen und drehen. Noch besser zum Zuschauen: Leg einen Plastikbecher auf die Seite und stoss ihn an. Er rollt im Kreis – um die Spitze des Kegels, zu dem er gehört. Genau so einen Kegel zeigt die Figur unten.</p>}
          en={<p>Think of a spinning top whose tip sits in a small dent, or of a joystick: one point is fixed, the rest can tilt and turn. Even better to watch: lay a plastic cup on its side and push it. It rolls in a circle – about the tip of the cone it belongs to. The figure below shows exactly such a cone.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="kreiselung" title={<T de="1. Nur ein Punkt ruht" en="1. Only one point at rest" />}>
        <Box kind="lecture" src={<Src p={20} />} title={<T de="Kreiselung" en={<>Spinning motion (<span lang="de">Kreiselung</span>)</>} />}>
          <T
            de={<p>Liegt vor, falls nur 1 Punkt in Ruhe <M>{t`\to`}</M> wähle <M p=".">O</M> Bahnkurven auf Kugel mit Radius <M p=".">{t`|\v r|`}</M> <b>Behauptung:</b> Momentan ist nicht nur <M>O</M> in Ruhe, sondern eine ganze Achse durch <M p=".">O</M></p>}
            en={<p>Occurs if only 1 point is at rest <M>{t`\to`}</M> choose it as <M p=".">O</M> Trajectories on a sphere of radius <M p=".">{t`|\v r|`}</M> <b>Claim:</b> momentarily not only <M>O</M> is at rest, but a whole axis through <M p=".">O</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li>Genau ein Punkt des Körpers ruht die ganze Zeit. Man nennt ihn <M>O</M> und misst alle Ortsvektoren <M>{t`\v r`}</M> von <M>O</M> aus.</li>
              <li>Der Körper ist starr, also bleibt der Abstand <M>{t`|\v r|`}</M> jedes Punktes von <M>O</M> gleich. Ein Punkt, der immer gleich weit von <M>O</M> entfernt ist, läuft auf einer Kugel um <M p=".">O</M></li>
              <li>Die Behauptung: In jedem Augenblick ruht nicht nur <M p=",">O</M> sondern eine ganze Gerade durch <M p=".">O</M> Im nächsten Augenblick ist es eine andere Gerade – darum «momentan».</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li>Exactly one point of the body is at rest all the time. Call it <M>O</M> and measure all position vectors <M>{t`\v r`}</M> from <M p=".">O</M></li>
              <li>The body is rigid, so the distance <M>{t`|\v r|`}</M> of every point from <M>O</M> stays the same. A point that always stays at the same distance from <M>O</M> moves on a sphere about <M p=".">O</M></li>
              <li>The claim: at each instant not only <M>O</M> is at rest, but a whole straight line through <M p=".">O</M> At the next instant it is another line – hence “momentarily”.</li>
            </ol>
          </>}
        />
        <KreiselExplorer />
        <T
          de={<>
            <p>Die drei Knöpfe zeigen drei verschiedene Kreiselungen desselben Kegels:</p>
            <ul>
              <li><b>Rollen:</b> Der Kegel rollt ohne zu rutschen. Die momentane Achse <M>\mu</M> ist die Berührlinie mit dem Boden – genau wie <M>{t`AB`}</M> beim rollenden Zylinder. Die Bahn von <M>M</M> berührt den Boden mit einer Spitze.</li>
              <li><b>Ohne Eigendrehung:</b> Der Kegel wird nur um die senkrechte Achse durch <M>O</M> herumgeschoben und rutscht über den Boden. <M>\mu</M> steht senkrecht; das ist sogar eine Rotation um eine feste Achse.</li>
              <li><b>Schnelle Eigendrehung:</b> Der Kegel dreht sich schneller um sich selbst, als es zum Rollen passt. <M>\mu</M> kippt weg vom Boden.</li>
            </ul>
            <p>In allen drei Fällen geht <M>\mu</M> durch <M p=".">O</M> Das ist die Behauptung des Skripts.</p>
          </>}
          en={<>
            <p>The three buttons show three different spinning motions of the same cone:</p>
            <ul>
              <li><b>Rolling:</b> the cone rolls without slipping. The momentary axis <M>\mu</M> is the line of contact with the floor – just like <M>{t`AB`}</M> for the rolling cylinder. The path of <M>M</M> touches the floor with a sharp tip.</li>
              <li><b>No spin:</b> the cone is only pushed round the vertical axis through <M>O</M> and slides over the floor. <M>\mu</M> is vertical; this is even a rotation about a fixed axis.</li>
              <li><b>Fast spin:</b> the cone turns about itself faster than rolling requires. <M>\mu</M> tilts away from the floor.</li>
            </ul>
            <p>In all three cases <M>\mu</M> passes through <M p=".">O</M> That is the claim of the notes.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="beweis" title={<T de="2. Beweis: eine ganze Achse ruht" en="2. Proof: a whole axis is at rest" />}>
        <Box kind="lecture" src={<Src p={21} fig="Fig. 3.11" />} title={<T de="Beweis" en={<>Proof (<span lang="de">Beweis</span>)</>} />}>
          <T
            de={<>
              <p>Handschriftlich neben der Figur: <M p=",">{t`\v v_M \perp \v r_M`}</M> <M p=",">{t`E_M \perp \v v_M`}</M> <M p=",">{t`\v r_M \in E_M`}</M> <M p=",">{t`\v r_N \in E_N`}</M> <M>{t`\mu = E_M \cap E_N`}</M> (Gerade).</p>
              <p>Wähle <M p=",">{t`E_M \perp \v v_M`}</M> <M>{t`E_N \perp \v v_N \ \to\ A \in E_M,\ A \in E_N`}</M></p>
              <p>SdpG: <M>{t`\v v_A\cdot\v{AM} = \v v_M\cdot\v{AM}\ (= 0) \ \to\ \v v_A = \v 0`}</M> oder <M p=".">{t`\v v_A \perp \v{AM}`}</M> Ebenso mit <M p=":">N</M> <M>{t`\v v_A = \v 0`}</M> oder <M p=".">{t`\v v_A \perp \v{AN}`}</M></p>
              <p>Ansicht <M p=":">{t`\perp AO`}</M> <M p="?">{t`\v v_A \parallel \v{AO}`}</M> Nein, da <M p=".">{t`\v v_A\cdot\v{AO} = \v v_O\cdot\v{AO} = 0 \ \to\ \v v_A \perp \v{AO} \ \to\ \v v_A = \v 0`}</M></p>
            </>}
            en={<>
              <p>Handwritten next to the figure: <M p=",">{t`\v v_M \perp \v r_M`}</M> <M p=",">{t`E_M \perp \v v_M`}</M> <M p=",">{t`\v r_M \in E_M`}</M> <M p=",">{t`\v r_N \in E_N`}</M> <M>{t`\mu = E_M \cap E_N`}</M> (a line).</p>
              <p>Choose <M p=",">{t`E_M \perp \v v_M`}</M> <M>{t`E_N \perp \v v_N \ \to\ A \in E_M,\ A \in E_N`}</M></p>
              <p>SdpG: <M>{t`\v v_A\cdot\v{AM} = \v v_M\cdot\v{AM}\ (= 0) \ \to\ \v v_A = \v 0`}</M> or <M p=".">{t`\v v_A \perp \v{AM}`}</M> Likewise with <M p=":">N</M> <M>{t`\v v_A = \v 0`}</M> or <M p=".">{t`\v v_A \perp \v{AN}`}</M></p>
              <p>View <M p=":">{t`\perp AO`}</M> <M p="?">{t`\v v_A \parallel \v{AO}`}</M> No, since <M p=".">{t`\v v_A\cdot\v{AO} = \v v_O\cdot\v{AO} = 0 \ \to\ \v v_A \perp \v{AO} \ \to\ \v v_A = \v 0`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man den Beweis:</b></p>
            <ol>
              <li>Nimm zwei Punkte <M>M</M> und <M p=",">N</M> die sich bewegen. <M>M</M> bleibt gleich weit von <M>O</M> entfernt. Darum steht <M>{t`\v v_M`}</M> senkrecht auf <M>{t`\v r_M`}</M> – die Geschwindigkeit zeigt entlang der Kugel, nie nach aussen.</li>
              <li><M>{t`E_M`}</M> ist die Ebene durch <M>M</M> senkrecht zu <M p=".">{t`\v v_M`}</M> Weil <M>{t`\v r_M`}</M> senkrecht auf <M>{t`\v v_M`}</M> steht, liegt <M>{t`\v r_M`}</M> in dieser Ebene – und mit ihm <M p=".">O</M> Ebenso liegt <M>O</M> in <M p=".">{t`E_N`}</M></li>
              <li>Zwei Ebenen durch <M>O</M> schneiden sich in einer Geraden durch <M p=".">O</M> Das ist <M p=".">\mu</M> <M>A</M> ist irgendein Punkt auf <M p=".">\mu</M></li>
              <li>SdpG für <M>A</M> und <M p=":">M</M> <M p=".">{t`\v v_A\cdot\v{AM} = \v v_M\cdot\v{AM}`}</M> Rechts steht <M p=",">0</M> denn <M>{t`\v{AM}`}</M> liegt in <M p=",">{t`E_M`}</M> und <M>{t`\v v_M`}</M> steht senkrecht auf <M p=".">{t`E_M`}</M> Also ist <M>{t`\v v_A`}</M> null oder senkrecht zu <M p=".">{t`\v{AM}`}</M> Mit <M>N</M> genauso.</li>
              <li>Senkrecht zu <M>{t`\v{AM}`}</M> und <M>{t`\v{AN}`}</M> bleibt nur noch eine Richtung. Ist das <M p="?">{t`\v{AO}`}</M> Nein: <M>O</M> ruht, also gibt die SdpG auch <M p=".">{t`\v v_A\cdot\v{AO} = 0`}</M> Senkrecht auf allen drei Richtungen steht nur der Nullvektor: <M p=".">{t`\v v_A = \v 0`}</M></li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the proof:</b></p>
            <ol>
              <li>Take two points <M>M</M> and <M>N</M> that move. <M>M</M> stays at the same distance from <M p=".">O</M> Hence <M>{t`\v v_M`}</M> is perpendicular to <M>{t`\v r_M`}</M> – the velocity points along the sphere, never outward.</li>
              <li><M>{t`E_M`}</M> is the plane through <M>M</M> perpendicular to <M p=".">{t`\v v_M`}</M> Because <M>{t`\v r_M`}</M> is perpendicular to <M p=",">{t`\v v_M`}</M> <M>{t`\v r_M`}</M> lies in this plane – and with it <M p=".">O</M> Likewise <M>O</M> lies in <M p=".">{t`E_N`}</M></li>
              <li>Two planes through <M>O</M> intersect in a line through <M p=".">O</M> That is <M p=".">\mu</M> <M>A</M> is any point on <M p=".">\mu</M></li>
              <li>SdpG for <M>A</M> and <M p=":">M</M> <M p=".">{t`\v v_A\cdot\v{AM} = \v v_M\cdot\v{AM}`}</M> The right-hand side is <M p=",">0</M> because <M>{t`\v{AM}`}</M> lies in <M>{t`E_M`}</M> and <M>{t`\v v_M`}</M> is perpendicular to <M p=".">{t`E_M`}</M> So <M>{t`\v v_A`}</M> is zero or perpendicular to <M p=".">{t`\v{AM}`}</M> The same with <M p=".">N</M></li>
              <li>Perpendicular to <M>{t`\v{AM}`}</M> and <M>{t`\v{AN}`}</M> only one direction is left. Is it <M p="?">{t`\v{AO}`}</M> No: <M>O</M> is at rest, so the SdpG also gives <M p=".">{t`\v v_A\cdot\v{AO} = 0`}</M> Only the zero vector is perpendicular to all three directions: <M p=".">{t`\v v_A = \v 0`}</M></li>
            </ol>
          </>}
        />
        <Derivation title={<T de="Der Beweis Schritt für Schritt" en="The proof step by step" />}>
          <StepPlayer
            label={tr('Animation: Beweis, dass bei der Kreiselung eine Achse ruht', 'Animation: proof that an axis is at rest in spinning motion')}
            steps={[
              { ms: 2000, holdMs: 2500, caption: <T
                de={<>Ein Körper, von dem nur der Punkt <M>O</M> ruht – wie die Spitze eines Kreisels. <M>M</M> und <M>N</M> sind zwei weitere Punkte mit ihren Geschwindigkeiten.</>}
                en={<>A body of which only the point <M>O</M> is at rest – like the tip of a spinning top. <M>M</M> and <M>N</M> are two more points with their velocities.</>} /> },
              { ms: 4500, holdMs: 3500, caption: <T
                de={<><M>M</M> bleibt gleich weit von <M>O</M> entfernt, also <M p=".">{t`\v v_M \perp \v r_M`}</M> Die Ebene <M>{t`E_M`}</M> durch <M>M</M> senkrecht zu <M>{t`\v v_M`}</M> enthält darum <M>{t`\v r_M`}</M> – und damit <M p=".">O</M></>}
                en={<><M>M</M> stays at the same distance from <M p=",">O</M> so <M p=".">{t`\v v_M \perp \v r_M`}</M> Hence the plane <M>{t`E_M`}</M> through <M>M</M> perpendicular to <M>{t`\v v_M`}</M> contains <M>{t`\v r_M`}</M> – and with it <M p=".">O</M></>} /> },
              { ms: 4500, holdMs: 3500, caption: <T
                de={<>Ebenso für <M p=":">N</M> Die Ebene <M>{t`E_N`}</M> enthält <M p=".">O</M> Die beiden Ebenen schneiden sich in einer Geraden <M>\mu</M> durch <M p=".">O</M></>}
                en={<>Likewise for <M p=":">N</M> the plane <M>{t`E_N`}</M> contains <M p=".">O</M> The two planes intersect in a line <M>\mu</M> through <M p=".">O</M></>} /> },
              { ms: 3500, holdMs: 4000, caption: <T
                de={<><M>A</M> ist ein Punkt auf <M p=".">\mu</M> <M>{t`\v{AM}`}</M> liegt in <M p=",">{t`E_M`}</M> steht also senkrecht auf <M p=".">{t`\v v_M`}</M> Die SdpG gibt <M p=";">{t`\v v_A\cdot\v{AM} = 0`}</M> ebenso <M p=".">{t`\v v_A\cdot\v{AN} = 0`}</M></>}
                en={<><M>A</M> is a point on <M p=".">\mu</M> <M>{t`\v{AM}`}</M> lies in <M p=",">{t`E_M`}</M> so it is perpendicular to <M p=".">{t`\v v_M`}</M> The SdpG gives <M p=";">{t`\v v_A\cdot\v{AM} = 0`}</M> likewise <M p=".">{t`\v v_A\cdot\v{AN} = 0`}</M></>} /> },
              { ms: 3500, holdMs: 4000, caption: <T
                de={<>Auch <M>O</M> ruht: <M p=".">{t`\v v_A\cdot\v{AO} = 0`}</M> <M p=",">{t`\v{AM}`}</M> <M>{t`\v{AN}`}</M> und <M>{t`\v{AO}`}</M> liegen nicht in einer Ebene. Senkrecht auf allen dreien steht nur der Nullvektor: <M p=".">{t`\v v_A = \v 0`}</M></>}
                en={<><M>O</M> is at rest too: <M p=".">{t`\v v_A\cdot\v{AO} = 0`}</M> <M p=",">{t`\v{AM}`}</M> <M p=",">{t`\v{AN}`}</M> and <M>{t`\v{AO}`}</M> do not lie in one plane. Only the zero vector is perpendicular to all three: <M p=".">{t`\v v_A = \v 0`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Das gilt für jeden Punkt von <M p=":">\mu</M> Eine ganze Achse durch <M>O</M> ruht. In diesem Augenblick drehen sich alle Punkte um <M>\mu</M> (gestrichelt: die Kreise von <M>M</M> und <M p=")">N</M> mit <M p=".">{t`\v v = \v\omega\times\v r`}</M></>}
                en={<>This holds for every point of <M p=":">\mu</M> a whole axis through <M>O</M> is at rest. At this instant all points turn about <M>\mu</M> (dashed: the circles of <M>M</M> and <M p=")">N</M> with <M p=".">{t`\v v = \v\omega\times\v r`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={kreiselProofScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Eine Voraussetzung sagt das Skript nicht dazu: <M>{t`E_M`}</M> und <M>{t`E_N`}</M> müssen verschiedene Ebenen sein, sonst gibt es keine Schnittgerade. Man wählt <M>N</M> also so, dass <M>{t`\v v_N`}</M> nicht parallel zu <M>{t`\v v_M`}</M> ist.</p>}
          en={<p>The notes leave one assumption unsaid: <M>{t`E_M`}</M> and <M>{t`E_N`}</M> must be different planes, otherwise there is no line of intersection. So choose <M>N</M> such that <M>{t`\v v_N`}</M> is not parallel to <M p=".">{t`\v v_M`}</M></p>}
        />
        <details className="more">
          <summary><T de="Wann funktioniert der Beweis genau?" en="When exactly does the proof work?" /></summary>
          <T
            de={<ul>
              <li><b><M>O</M> liegt in <M p=":">{t`E_M`}</M></b> Aus <M>{t`|\v r_M|^2 = \v r_M\cdot\v r_M = \text{konst.}`}</M> folgt durch Ableiten <M p=",">{t`2\,\v r_M\cdot\v v_M = 0`}</M> also <M p=".">{t`\v v_M \perp \v r_M`}</M> Das steht im Skript nur handschriftlich.</li>
              <li><b>Eine Schnittgerade:</b> Sind <M>{t`\v v_M`}</M> und <M>{t`\v v_N`}</M> parallel, fallen <M>{t`E_M`}</M> und <M>{t`E_N`}</M> zusammen. Bei einem flachen Körper, der die Achse enthält (eine Tür an ihren Scharnieren), sind sogar alle Geschwindigkeiten parallel. Dann denkt man sich den Körper starr erweitert, wie bei Beweis 2 der Rotation.</li>
              <li><b><M>{t`\v v_A = \v 0`}</M> aus drei Bedingungen:</b> <M>{t`\v{AM}`}</M> und <M>{t`\v{AO}`}</M> liegen in <M p=",">{t`E_M`}</M> <M>{t`\v{AN}`}</M> aber nicht (sonst wäre <M p=")">{t`E_N = E_M`}</M> Zusammen zeigen die drei Vektoren in alle Raumrichtungen. Ein Vektor, der auf allen dreien senkrecht steht, hat in keiner Richtung einen Anteil – er ist <M p=".">{t`\v 0`}</M></li>
            </ul>}
            en={<ul>
              <li><b><M>O</M> lies in <M p=":">{t`E_M`}</M></b> from <M>{t`|\v r_M|^2 = \v r_M\cdot\v r_M = \text{const.}`}</M> differentiation gives <M p=",">{t`2\,\v r_M\cdot\v v_M = 0`}</M> so <M p=".">{t`\v v_M \perp \v r_M`}</M> The notes have this only in handwriting.</li>
              <li><b>One line of intersection:</b> if <M>{t`\v v_M`}</M> and <M>{t`\v v_N`}</M> are parallel, <M>{t`E_M`}</M> and <M>{t`E_N`}</M> coincide. For a flat body containing the axis (a door on its hinges) even all velocities are parallel. Then imagine the body extended rigidly, as in proof 2 of the rotation.</li>
              <li><b><M>{t`\v v_A = \v 0`}</M> from three conditions:</b> <M>{t`\v{AM}`}</M> and <M>{t`\v{AO}`}</M> lie in <M p=",">{t`E_M`}</M> but <M>{t`\v{AN}`}</M> does not (otherwise <M p=")">{t`E_N = E_M`}</M> Together the three vectors point in all directions of space. A vector perpendicular to all three has no part in any direction – it is <M p=".">{t`\v 0`}</M></li>
            </ul>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="momentan" title={<T de="3. Kreiselung ist eine momentane Rotation" en="3. Spinning motion is a momentary rotation" />}>
        <Box kind="lecture" src={<Src p={21} />}>
          <T
            de={<p>Kreiselung als momentane Rotation; 1 Punkt (<M p=")">O</M> in Ruhe: <M p=".">{t`\v v = \v\omega\times\v r`}</M> Kombination von Kreiselung und Translation <M>{t`\to`}</M> allgemeinster Bewegungszustand des starren Körpers!</p>}
            en={<p>Spinning motion as a momentary rotation; 1 point (<M p=")">O</M> at rest: <M p=".">{t`\v v = \v\omega\times\v r`}</M> Combination of spinning motion and translation <M>{t`\to`}</M> the most general state of motion of the rigid body!</p>}
          />
        </Box>
        <T
          de={<>
            <p>Weil in jedem Augenblick eine Achse <M>\mu</M> durch <M>O</M> ruht, ist die Kreiselung in jedem Augenblick eine Rotation um <M p=".">\mu</M> Darum gilt die Formel der Rotation, mit <M>O</M> auf der Achse:</p>
            <MD>{t`\v v = \v\omega\times\v r, \qquad \v r \text{ von } O \text{ aus gemessen.}`}</MD>
            <p>Neu gegenüber der Rotation ist nur eines: <M>{t`\v\omega`}</M> darf mit der Zeit seine Richtung ändern. Bei der Rotation bleibt die Achse fest; bei der Kreiselung wandert sie – aber immer durch <M p=".">O</M> Im Explorer siehst du das beim Abrollen: Die türkise Achse dreht sich mit der Berührlinie um <M p=".">O</M></p>
            <p>Der letzte Satz im Kasten ist der Ausblick auf das nächste Kapitel: Lässt man auch <M>O</M> sich bewegen, kommt eine Translation dazu. Das ergibt die allgemeinste Bewegung eines starren Körpers.</p>
          </>}
          en={<>
            <p>Because at each instant an axis <M>\mu</M> through <M>O</M> is at rest, spinning motion is at each instant a rotation about <M p=".">\mu</M> So the formula of the rotation holds, with <M>O</M> on the axis:</p>
            <MD>{t`\v v = \v\omega\times\v r, \qquad \v r \text{ measured from } O.`}</MD>
            <p>Only one thing is new compared with rotation: <M>{t`\v\omega`}</M> may change its direction over time. In a rotation the axis stays fixed; in spinning motion it wanders – but always through <M p=".">O</M> You can see this in the explorer while the cone rolls: the teal axis turns about <M>O</M> together with the line of contact.</p>
            <p>The last sentence in the box is a preview of the next chapter: if <M>O</M> may move too, a translation is added. This gives the most general motion of a rigid body.</p>
          </>}
        />
        <Box kind="supplement" title={<T de="Beispiel: der rollende Kegel" en="Example: the rolling cone" />}>
          <T
            de={<>
              <p>Der Kegel im Explorer hat den halben Öffnungswinkel <M>{t`\gamma = 25^\circ`}</M> und Mantellinien der Länge <M>L</M> (von der Spitze <M>O</M> zum Rand). <M>{t`\dot\varphi`}</M> sagt, wie schnell die Berührlinie um <M>O</M> herumläuft. Wie schnell sind die Punkte beim Rollen?</p>
              <ol>
                <li>Der Mittelpunkt <M>C</M> der Grundfläche fährt einen waagrechten Kreis um die senkrechte Achse durch <M p=".">O</M> <M>C</M> liegt auf der Kegelachse im Abstand <M>{t`L\cos\gamma`}</M> von <M p=",">O</M> und die Achse ist um <M>\gamma</M> geneigt. Der Kreis hat darum den Radius <M p=",">{t`L\cos\gamma\cdot\cos\gamma = L\cos^2\gamma`}</M> also <M p=".">{t`v_C = \dot\varphi\, L\cos^2\gamma`}</M></li>
                <li>Die Kegelachse bildet mit der Berührlinie <M>\mu</M> den Winkel <M p=".">\gamma</M> Darum hat <M>C</M> von <M>\mu</M> den Abstand <M p=".">{t`L\cos\gamma\sin\gamma`}</M> Mit <M>{t`|\v v| = |\v\omega|\cdot\text{Abstand}`}</M> folgt <M p=".">{t`|\v\omega| = \dot\varphi\,\cos\gamma/\sin\gamma`}</M> Für <M>{t`\gamma = 25^\circ`}</M> ist das gut doppelt so viel wie <M p=":">{t`\dot\varphi`}</M> Die Eigendrehung zählt mit.</li>
                <li>Der oberste Punkt des Randes ist doppelt so weit von <M>\mu</M> entfernt wie <M p=".">C</M> Er ist darum doppelt so schnell: <M p=".">{t`2\,v_C`}</M> Wie beim rollenden Zylinder.</li>
              </ol>
            </>}
            en={<>
              <p>The cone in the explorer has the half opening angle <M>{t`\gamma = 25^\circ`}</M> and slant lines of length <M>L</M> (from the tip <M>O</M> to the rim). <M>{t`\dot\varphi`}</M> says how fast the line of contact goes round <M p=".">O</M> How fast are the points when it rolls?</p>
              <ol>
                <li>The centre <M>C</M> of the base travels on a horizontal circle about the vertical axis through <M p=".">O</M> <M>C</M> lies on the cone's axis at distance <M>{t`L\cos\gamma`}</M> from <M p=",">O</M> and the axis is tilted by <M p=".">\gamma</M> So the circle has the radius <M p=",">{t`L\cos\gamma\cdot\cos\gamma = L\cos^2\gamma`}</M> and <M p=".">{t`v_C = \dot\varphi\, L\cos^2\gamma`}</M></li>
                <li>The cone's axis makes the angle <M>\gamma</M> with the line of contact <M p=".">\mu</M> So <M>C</M> is at distance <M>{t`L\cos\gamma\sin\gamma`}</M> from <M p=".">\mu</M> With <M>{t`|\v v| = |\v\omega|\cdot\text{distance}`}</M> we get <M p=".">{t`|\v\omega| = \dot\varphi\,\cos\gamma/\sin\gamma`}</M> For <M>{t`\gamma = 25^\circ`}</M> this is a little more than twice <M p=":">{t`\dot\varphi`}</M> the spin counts too.</li>
                <li>The top point of the rim is twice as far from <M>\mu</M> as <M p=".">C</M> So it is twice as fast: <M p=".">{t`2\,v_C`}</M> Just as for the rolling cylinder.</li>
              </ol>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Häufige Missverständnisse" en="4. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Wenn nur ein Punkt ruht, gibt es keine Drehachse.»" en="“If only one point is at rest, there is no axis of rotation.”" />}>
          <T de={<>Doch – in jedem Augenblick ruht eine ganze Achse durch <M p=".">O</M> Sie bleibt nur nicht dieselbe. «Nur ein Punkt in Ruhe» heisst: nur <M>O</M> ruht <em>die ganze Zeit</em>.</>} en={<>There is – at each instant a whole axis through <M>O</M> is at rest. It just does not stay the same. “Only one point at rest” means: only <M>O</M> is at rest <em>all the time</em>.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die Drehachse ist die Symmetrieachse des Kegels.»" en="“The axis of rotation is the cone’s axis of symmetry.”" />}>
          <T de={<>Die momentane Achse hat die Richtung von <M p=",">{t`\v\omega`}</M> nicht die der Symmetrieachse. Beim rollenden Kegel ist sie die Berührlinie – wie beim rollenden Zylinder nicht <M p=",">{t`CD`}</M> sondern <M p=".">{t`AB`}</M></>} en={<>The momentary axis has the direction of <M p=",">{t`\v\omega`}</M> not that of the axis of symmetry. For the rolling cone it is the line of contact – just as for the rolling cylinder it is not <M p=",">{t`CD`}</M> but <M p=".">{t`AB`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Bei der Kreiselung laufen die Punkte auf Kreisen.»" en="“In spinning motion the points move on circles.”" />}>
          <T de={<>Sie laufen auf Kugeln um <M p=",">O</M> aber meist nicht auf Kreisen (rote Bahn im Explorer). Nur in einem einzelnen Augenblick bewegen sie sich so, als ob sie auf einem Kreis um <M>\mu</M> liefen.</>} en={<>They move on spheres about <M p=",">O</M> but usually not on circles (red path in the explorer). Only at a single instant do they move as if they were on a circle about <M p=".">\mu</M></>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T de={<>Kreiselung: Nur <M>O</M> ruht dauernd. In jedem Augenblick ruht aber eine ganze Achse <M>\mu</M> durch <M p=",">O</M> also ist es eine momentane Rotation um <M p=".">\mu</M> Die Achse darf mit der Zeit wandern, geht aber immer durch <M p=".">O</M></>} en={<>Spinning motion: only <M>O</M> is at rest all the time. At each instant, though, a whole axis <M>\mu</M> through <M>O</M> is at rest, so it is a momentary rotation about <M p=".">\mu</M> The axis may wander over time but always passes through <M p=".">O</M></>} />
          <MD>{t`\v v = \v\omega\times\v r \quad (\v r ${tr(t`\text{ von } O \text{ aus}`, t`\text{ from } O`)}), \qquad \v\omega \parallel \mu`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Darf sich auch <M>O</M> bewegen, kommt eine Translation dazu – die <b>allgemeine Bewegung</b> <Src p={22} />.</p>}
          en={<p className="connections"><b>Next:</b> if <M>O</M> may move too, a translation is added – the <b>general motion</b> (<span lang="de">allgemeine Bewegung</span>) <Src p={22} />.</p>}
        />
      </Section>
    </article>
  );
}
