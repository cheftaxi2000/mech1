import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { planeScene } from '../viz/anim/planeScene';
import { ladderScene } from '../viz/anim/ladderScene';
import { CentreDemo, WheelRays } from '../viz/PlaneFigures';

const t = String.raw;

export default function L14Plane() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Viele Maschinenteile bewegen sich nur in einer Ebene: ein Rad, eine Leiter, ein Kolben, ein Zahnrad. Für diese <b>ebene Bewegung</b> wird alles viel einfacher. Das Skript zeigt zuerst, dass <M>{t`\v\omega`}</M> dann senkrecht auf der Ebene steht. Daraus folgt der <b>Satz vom Momentanzentrum</b>: In jedem Augenblick dreht sich der Körper um einen einzigen ruhenden Punkt <M p=".">Z</M></p>}
        en={<p className="lede">Many machine parts move in a single plane only: a wheel, a ladder, a piston, a gear. For this <b>plane motion</b> (<span lang="de">ebene Bewegung</span>) everything becomes much simpler. The notes first show that <M>{t`\v\omega`}</M> is then perpendicular to the plane. From this follows the <b>theorem of the instantaneous centre</b> (<span lang="de">Satz vom Momentanzentrum</span>): at every instant the body turns about a single point at rest, <M p=".">Z</M></p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Schieb ein Buch über den Tisch und dreh es dabei. Jeder Punkt des Buches bleibt auf seiner Höhe – er bewegt sich in einer Ebene parallel zur Tischplatte. Genauso ein Autorad (jeder Punkt bleibt in seiner senkrechten Ebene) oder eine Leiter, die an der Wand abrutscht. Und wenn du genau hinschaust: Das Buch dreht sich in jedem Augenblick um einen Punkt, der gerade still steht – nur wandert dieser Punkt.</p>}
          en={<p>Push a book across the table and turn it at the same time. Every point of the book stays at its height – it moves in a plane parallel to the table top. The same holds for a car wheel (every point stays in its vertical plane) or a ladder sliding down a wall. And if you look closely: at every instant the book turns about one point that is standing still right now – only this point wanders.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="ebene" title={<T de={<>1. Ebene Bewegung: <M>{t`\v\omega`}</M> steht senkrecht auf der Ebene</>} en={<>1. Plane motion: <M>{t`\v\omega`}</M> is perpendicular to the plane</>} />}>
        <Box kind="lecture" src={<Src p={26} />} title={<T de="3.1 Ebene Bewegung" en={<>3.1 Plane motion (<span lang="de">Ebene Bewegung</span>)</>} />}>
          <T
            de={<p>Bahnkurven aller Punkte bleiben in parallelen Ebenen! Ebene <M>{t`E \parallel`}</M> zu <M>{t`x, y`}</M> Ebene, Punkt <M>{t`P\in E \to \v v_P = (v_{Px},\, v_{Py},\, 0)`}</M> und Punkt <M>A</M> im gleichen Körper:</p>}
            en={<p>The paths of all points stay in parallel planes! Plane <M>E</M> parallel to the <M>{t`x, y`}</M> plane, point <M>{t`P\in E \to \v v_P = (v_{Px},\, v_{Py},\, 0)`}</M> and a point <M>A</M> of the same body:</p>}
          />
          <MD>{t`\v v_A = \v v_P + \v\omega\times\v{PA}`}</MD>
          <MD>{t`\begin{pmatrix} v_{Ax}\\ v_{Ay}\\ 0 \end{pmatrix} = \begin{pmatrix} v_{Px}\\ v_{Py}\\ 0 \end{pmatrix} + \begin{pmatrix} \omega_x\\ \omega_y\\ \omega_z \end{pmatrix}\times\begin{pmatrix} PA_x\\ PA_y\\ PA_z \end{pmatrix}`}</MD>
          <MD>{t`\begin{gathered} v_{Az} = 0 = 0 + \omega_x PA_y - \omega_y PA_x,\\ \forall\ PA_x,\, PA_y \end{gathered}`}</MD>
          <MD>{t`\to\ \v\omega = \underbrace{\begin{pmatrix} 0\\ 0\\ \omega_z \end{pmatrix}}_{\text{Rotation!}} \quad \text{${tr('oder', 'or')}} \quad \underbrace{\v\omega = \v 0}_{\text{Translation}}`}</MD>
          <T de={<p>Falls Rotation: <M>{t`\mu \perp`}</M> Ebene <M p=".">E</M></p>} en={<p>If rotation: <M>{t`\mu \perp`}</M> plane <M p=".">E</M></p>} />
        </Box>
        <T
          de={<>
            <p>In deinem Skript sind die beiden Nullen der <M>z</M>-Zeile rot eingerahmt, mit der Notiz «immer bei einer ebenen Bewegung». Genau das ist der Kern: Die <M>z</M>-Komponente jeder Geschwindigkeit ist null.</p>
            <p className="keep"><b>So liest man die Rechnung:</b></p>
            <ol className="keep">
              <li>Die Bewegungsebene <M>E</M> wird parallel zur <M>xy</M>-Ebene gelegt. Dann heisst «bleibt in der Ebene» einfach: keine Bewegung in <M>z</M>-Richtung, also <M>{t`v_z = 0`}</M> für jeden Punkt.</li>
              <li><M>P</M> und <M>A</M> sind zwei Punkte desselben starren Körpers. Für sie gilt die <a href="#allgemein">Grundgleichung</a> <M p=".">{t`\v v_A = \v v_P + \v\omega\times\v{PA}`}</M></li>
              <li>Man schreibt sie in Komponenten und schaut nur die dritte Zeile an. Links steht <M>{t`v_{Az} = 0`}</M> (ebene Bewegung), rechts zuerst <M>{t`v_{Pz} = 0`}</M> und dann die <M>z</M>-Komponente des Kreuzprodukts: <M p=".">{t`\omega_x PA_y - \omega_y PA_x`}</M> Das <M>{t`PA_z`}</M> kommt darin gar nicht vor.</li>
              <li>Also muss <M>{t`\omega_x PA_y - \omega_y PA_x = 0`}</M> sein – und zwar <M>\forall</M> («für alle») Punkte <M>A</M> des Körpers.</li>
              <li>Daraus folgt <M p=":">{t`\omega_x = \omega_y = 0`}</M> Übrig bleibt <M>{t`\v\omega = (0, 0, \omega_z)`}</M> (eine Drehung um eine Achse <M p=")">{t`\mu\perp E`}</M> oder <M>{t`\v\omega = \v 0`}</M> (eine Translation).</li>
            </ol>
          </>}
          en={<>
            <p>In your notes the two zeros of the <M>z</M>-row are framed in red, with the note «<span lang="de">immer bei einer ebenen Bewegung</span>» (always in a plane motion). That is exactly the core: the <M>z</M>-component of every velocity is zero.</p>
            <p className="keep"><b>How to read the calculation:</b></p>
            <ol className="keep">
              <li>The plane of motion <M>E</M> is placed parallel to the <M>xy</M>-plane. Then “stays in the plane” simply means: no motion in the <M>z</M>-direction, <M>{t`v_z = 0`}</M> for every point.</li>
              <li><M>P</M> and <M>A</M> are two points of the same rigid body. The <a href="#allgemein">fundamental equation</a> holds for them: <M p=".">{t`\v v_A = \v v_P + \v\omega\times\v{PA}`}</M></li>
              <li>Write it in components and look at the third row only. On the left stands <M>{t`v_{Az} = 0`}</M> (plane motion); on the right first <M>{t`v_{Pz} = 0`}</M> and then the <M>z</M>-component of the cross product, <M p=".">{t`\omega_x PA_y - \omega_y PA_x`}</M> <M>{t`PA_z`}</M> does not even appear in it.</li>
              <li>So <M>{t`\omega_x PA_y - \omega_y PA_x = 0`}</M> must hold – for <M>\forall</M> (“for all”) points <M>A</M> of the body.</li>
              <li>It follows that <M p=".">{t`\omega_x = \omega_y = 0`}</M> What remains is <M>{t`\v\omega = (0, 0, \omega_z)`}</M> (a turning about an axis <M p=")">{t`\mu\perp E`}</M> or <M>{t`\v\omega = \v 0`}</M> (a translation).</li>
            </ol>
          </>}
        />
        <T
          de={<p><b>Warum zwingt «für alle» zu <M p="?">{t`\omega_x = \omega_y = 0`}</M></b> Man braucht nur zwei Punkte <M>A</M> in zwei verschiedenen Richtungen. Liegt <M>{t`\v{PA}`}</M> längs <M p=",">x</M> bleibt <M p=":">{t`-\omega_y PA_x = 0`}</M> also <M p=".">{t`\omega_y = 0`}</M> Liegt <M>{t`\v{PA}`}</M> längs <M p=",">y</M> bleibt <M p=":">{t`\omega_x PA_y = 0`}</M> also <M p=".">{t`\omega_x = 0`}</M> Die Animation zeigt, was sonst passieren würde: Mit gekipptem <M>{t`\v\omega`}</M> würde der Punkt <M>A</M> aus der Ebene hinauslaufen.</p>}
          en={<p><b>Why does “for all” force <M p="?">{t`\omega_x = \omega_y = 0`}</M></b> You only need two points <M>A</M> in two different directions. If <M>{t`\v{PA}`}</M> lies along <M p=",">x</M> what remains is <M p=",">{t`-\omega_y PA_x = 0`}</M> so <M p=".">{t`\omega_y = 0`}</M> If <M>{t`\v{PA}`}</M> lies along <M p=",">y</M> what remains is <M p=",">{t`\omega_x PA_y = 0`}</M> so <M p=".">{t`\omega_x = 0`}</M> The animation shows what would happen otherwise: with a tilted <M>{t`\v\omega`}</M> the point <M>A</M> would run out of the plane.</p>}
        />
        <Derivation title={<T de={<>Warum <M>{t`\v\omega \perp E`}</M></>} en={<>Why <M>{t`\v\omega \perp E`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Platte in der Ebene E, gekipptes omega würde Punkte aus der Ebene führen', 'Animation: plate in the plane E, a tilted omega would carry points out of the plane')}
            steps={[
              { ms: 3500, holdMs: 2500, caption: <T
                de={<>Die Platte <M>{t`K_E`}</M> bewegt sich in ihrer Ebene <M p=",">E</M> parallel zur <M>xy</M>-Ebene. Kein Punkt verlässt <M p=",">E</M> also hat jede Geschwindigkeit die <M>z</M>-Komponente <M p=".">0</M></>}
                en={<>The plate <M>{t`K_E`}</M> moves in its plane <M p=",">E</M> parallel to the <M>xy</M>-plane. No point leaves <M p=",">E</M> so every velocity has <M>z</M>-component <M p=".">0</M></>} /> },
              { ms: 3500, holdMs: 3500, caption: <T
                de={<>Ein zweiter Punkt <M p=":">A</M> <M p=".">{t`\v v_A = \v v_P + \v\omega\times\v{PA}`}</M> Grau: <M>{t`\v v_P`}</M> nach <M>A</M> verschoben, violett: <M p=".">{t`\v\omega\times\v{PA}`}</M> Steht <M>{t`\v\omega`}</M> senkrecht auf <M p=",">E</M> liegt beides in <M p=".">E</M></>}
                en={<>A second point <M p=":">A</M> <M p=".">{t`\v v_A = \v v_P + \v\omega\times\v{PA}`}</M> Grey: <M>{t`\v v_P`}</M> moved to <M p=";">A</M> purple: <M p=".">{t`\v\omega\times\v{PA}`}</M> If <M>{t`\v\omega`}</M> is perpendicular to <M p=",">E</M> both lie in <M p=".">E</M></>} /> },
              { ms: 4000, holdMs: 3500, caption: <T
                de={<>Kippt man <M>{t`\v\omega`}</M> (<M p="),">{t`\omega_y \neq 0`}</M> zeigt <M>{t`\v v_A`}</M> aus der Ebene heraus – grün der Anteil <M p=".">{t`v_{Az} = -\omega_y PA_x`}</M> Er muss null sein, also <M p=".">{t`\omega_y = 0`}</M></>}
                en={<>Tilt <M>{t`\v\omega`}</M> (<M p=")">{t`\omega_y \neq 0`}</M> and <M>{t`\v v_A`}</M> points out of the plane – green is the part <M p=".">{t`v_{Az} = -\omega_y PA_x`}</M> It has to be zero, so <M p=".">{t`\omega_y = 0`}</M></>} /> },
              { ms: 4000, holdMs: 3500, caption: <T
                de={<>Ein Punkt <M>A</M> in der anderen Richtung (<M>{t`\v{PA}`}</M> längs <M p="),">y</M> <M>{t`\v\omega`}</M> anders gekippt: <M p=".">{t`v_{Az} = \omega_x PA_y`}</M> Also muss auch <M>{t`\omega_x = 0`}</M> sein.</>}
                en={<>A point <M>A</M> in the other direction (<M>{t`\v{PA}`}</M> along <M p="),">y</M> <M>{t`\v\omega`}</M> tilted the other way: <M p=".">{t`v_{Az} = \omega_x PA_y`}</M> So <M>{t`\omega_x = 0`}</M> as well.</>} /> },
              { ms: 3500, caption: <T
                de={<>Übrig bleibt <M p=":">{t`\v\omega = (0, 0, \omega_z)`}</M> <M>{t`\v\omega`}</M> steht senkrecht auf <M p=".">E</M> Eine Drehung um die Achse <M>{t`\mu\perp E`}</M> (türkis) – oder, wenn auch <M p=",">{t`\omega_z = 0`}</M> eine Translation.</>}
                en={<>What remains is <M p=":">{t`\v\omega = (0, 0, \omega_z)`}</M> <M>{t`\v\omega`}</M> is perpendicular to <M p=".">E</M> A turning about the axis <M>{t`\mu\perp E`}</M> (teal) – or, if <M>{t`\omega_z = 0`}</M> too, a translation.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={planeScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Ein Detail: Bei einem unendlich dünnen Stab, der in <M>E</M> liegt, gibt es nur <em>eine</em> Richtung <M p=".">{t`\v{PA}`}</M> Dann folgt nur eine der beiden Gleichungen – eine Drehung um den Stab selbst sieht man an seinen Punkten nicht (wie in der Lektion <a href="#allgemein">Allgemeine Bewegung</a>). Bei jedem echten Körper gibt es zwei Richtungen.</p>}
          en={<p>A detail: for an infinitely thin rod lying in <M>E</M> there is only <em>one</em> direction <M p=".">{t`\v{PA}`}</M> Then only one of the two equations follows – a turning about the rod itself cannot be seen at its points (as in the lesson <a href="#allgemein">General motion</a>). Every real body has two directions.</p>}
        />
        <T
          de={<p><b>Verbindung zur <a href="#zentralachse">Zentralachse</a></b> (S. 25): Bei einer ebenen Bewegung liegt <M>{t`\v v_B`}</M> in <M>E</M> und <M>{t`\v\omega`}</M> steht senkrecht darauf. Also ist <M>{t`\v v_B \perp \v\omega`}</M> – genau der Spezialfall «keine Schraubung, <M>\zeta</M> wird zur Rotationsachse». Darum schreibt das Skript dort: «Wichtige Anwendung: Ebene Bewegung».</p>}
          en={<p><b>Connection to the <a href="#zentralachse">central axis</a></b> (p. 25): in a plane motion <M>{t`\v v_B`}</M> lies in <M>E</M> and <M>{t`\v\omega`}</M> is perpendicular to it. So <M>{t`\v v_B \perp \v\omega`}</M> – exactly the special case “no screw motion, <M>\zeta</M> becomes the rotation axis”. That is why the notes say there: “<span lang="de">Wichtige Anwendung: Ebene Bewegung</span>” (important application: plane motion).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="momentanzentrum" title={<T de="2. Der Satz vom Momentanzentrum" en="2. The theorem of the instantaneous centre" />}>
        <Box kind="lecture" src={<Src p={26} fig="Fig. 3.19" />} title={<T de="Satz vom Momentanzentrum (S. 56)" en={<>Theorem of the instantaneous centre (<span lang="de">Satz vom Momentanzentrum</span>, p. 56)</>} />}>
          <T
            de={<p>Bei jeder ebenen Bewegung eines starren Körpers <M>K</M> mit <M>{t`\v\omega \neq \v 0`}</M> beschreibt der ebene Schnitt <M>{t`K_E`}</M> von <M>K</M> in der Bewegungsebene <M>E</M> eine momentane Rotation um einen Punkt <M p=",">{t`Z \equiv \mu\cap E`}</M> der <b>Momentanzentrum</b> der ebenen Bewegung heisst. Das Momentanzentrum <M>Z</M> ist der einzige momentan ruhende Punkt des in Gedanken auf die ganze Ebene <M>E</M> ausgedehnten Körpers <M p=".">{t`K_E`}</M> Die Geschwindigkeit <M>{t`\v v_M`}</M> eines beliebigen Punktes <M>M</M> von <M>K</M> in <M>E</M> ist dann nach Fig. 3.19 senkrecht zur Verbindungsgeraden mit dem Momentanzentrum <M>Z</M> und besitzt den durch den Drehsinn von <M>{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> vorgeschriebenen Richtungssinn sowie den mit dem Abstand <M>r</M> von <M>Z</M> gebildeten Betrag <M p=".">{t`v_M = \omega r`}</M></p>}
            en={<p>In every plane motion of a rigid body <M>K</M> with <M>{t`\v\omega \neq \v 0`}</M> the plane cut <M>{t`K_E`}</M> of <M>K</M> in the plane of motion <M>E</M> performs a momentary rotation about a point <M p=",">{t`Z \equiv \mu\cap E`}</M> called the <b><De en="instantaneous centre">Momentanzentrum</De></b> of the plane motion. The instantaneous centre <M>Z</M> is the only momentarily resting point of the body <M p=",">{t`K_E`}</M> imagined as extended to the whole plane <M p=".">E</M> The velocity <M>{t`\v v_M`}</M> of any point <M>M</M> of <M>K</M> in <M>E</M> is then, as in Fig. 3.19, perpendicular to the line joining it to the instantaneous centre <M p=",">Z</M> has the sense prescribed by the turning sense of <M p=",">{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> and the magnitude <M>{t`v_M = \omega r`}</M> formed with the distance <M>r</M> from <M p=".">Z</M></p>}
          />
          <T
            de={<p>Figur 3.19: der Schnitt <M p=",">{t`K_E`}</M> ein Punkt <M>M</M> mit <M>{t`\v v_M \perp r`}</M> (Winkelzeichen bei <M p="),">M</M> darunter <M>Z</M> mit dem Drehpfeil <M p=".">\omega</M></p>}
            en={<p>Figure 3.19: the cut <M p=",">{t`K_E`}</M> a point <M>M</M> with <M>{t`\v v_M \perp r`}</M> (right-angle mark at <M p="),">M</M> below it <M>Z</M> with the turning arrow <M p=".">\omega</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man den Satz:</b></p>
            <ol className="keep">
              <li>«Ebener Schnitt <M p="»:">{t`K_E`}</M> Man schneidet den Körper mit der Ebene <M>E</M> und schaut nur diese Scheibe an – alle anderen Scheiben bewegen sich genau gleich.</li>
              <li><M p=":">{t`Z \equiv \mu\cap E`}</M> Die Drehachse <M>\mu</M> steht senkrecht auf <M>E</M> (Abschnitt 1) und durchstösst <M>E</M> in genau einem Punkt. Das ist <M p=".">Z</M></li>
              <li>«In Gedanken auf die ganze Ebene ausgedehnt»: <M>Z</M> muss nicht auf dem Körper liegen. Man denkt sich eine riesige, starr mit dem Körper verbundene Glasplatte; auf ihr ruht genau ein Punkt.</li>
              <li>Um <M>Z</M> ist alles eine Drehung wie in der Lektion <a href="#rotation">Rotation</a>: <M>{t`\v v_M`}</M> steht senkrecht auf <M p=",">{t`\v{ZM}`}</M> und <M>{t`v_M = \omega r`}</M> mit <M>{t`r = |\v{ZM}|`}</M> – doppelter Abstand, doppelte Geschwindigkeit.</li>
              <li><M p=":">{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> <M>\varphi</M> ist der Drehwinkel des Körpers. Ist <M p=",">{t`\dot\varphi > 0`}</M> dreht er im Gegenuhrzeigersinn (mit <M>{t`\v e_z`}</M> aus dem Bild heraus), sonst im Uhrzeigersinn. In <M>{t`v_M = \omega r`}</M> ist mit <M>\omega</M> der Betrag gemeint.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the theorem:</b></p>
            <ol className="keep">
              <li>“Plane cut <M p="”:">{t`K_E`}</M> cut the body with the plane <M>E</M> and look at this slice only – all other slices move in exactly the same way.</li>
              <li><M p=":">{t`Z \equiv \mu\cap E`}</M> the axis <M>\mu</M> is perpendicular to <M>E</M> (section 1) and pierces <M>E</M> in exactly one point. That is <M p=".">Z</M></li>
              <li>“Imagined as extended to the whole plane”: <M>Z</M> need not lie on the body. Imagine a huge glass plate rigidly attached to the body; exactly one point of it is at rest.</li>
              <li>About <M>Z</M> everything is a turning as in the lesson <a href="#rotation">Rotation</a>: <M>{t`\v v_M`}</M> is perpendicular to <M p=",">{t`\v{ZM}`}</M> and <M>{t`v_M = \omega r`}</M> with <M>{t`r = |\v{ZM}|`}</M> – twice the distance, twice the speed.</li>
              <li><M p=":">{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> <M>\varphi</M> is the turning angle of the body. If <M p=",">{t`\dot\varphi > 0`}</M> it turns counter-clockwise (with <M>{t`\v e_z`}</M> out of the page), otherwise clockwise. In <M>{t`v_M = \omega r`}</M> <M>\omega</M> means the magnitude.</li>
            </ol>
          </>}
        />
        <T
          de={<p className="keep"><b>Das Werkzeug: <M>Z</M> aus zwei Geschwindigkeiten finden.</b> Weil jede Geschwindigkeit senkrecht auf ihrem Strahl von <M>Z</M> steht, liegt <M>Z</M> auf dem <b>Lot</b> zu <M>{t`\v v_A`}</M> durch <M>A</M> (der Geraden durch <M>A</M> senkrecht zu <M p=")">{t`\v v_A`}</M> Ebenso auf dem Lot zu <M>{t`\v v_B`}</M> durch <M p=".">B</M> Wo sich die beiden Lote schneiden, ist <M p=".">Z</M> Danach kennt man jede Geschwindigkeit: senkrecht auf ihrem Strahl, Betrag <M p=".">{t`\omega r`}</M> Probiere es aus:</p>}
          en={<p className="keep"><b>The tool: finding <M>Z</M> from two velocities.</b> Since every velocity is perpendicular to its ray from <M p=",">Z</M> <M>Z</M> lies on the <b>perpendicular</b> to <M>{t`\v v_A`}</M> through <M>A</M> (the line through <M>A</M> at right angles to <M p=").">{t`\v v_A`}</M> Likewise on the perpendicular to <M>{t`\v v_B`}</M> through <M p=".">B</M> Where the two perpendiculars meet is <M p=".">Z</M> After that every velocity is known: perpendicular to its ray, magnitude <M p=".">{t`\omega r`}</M> Try it:</p>}
        />
        <CentreDemo />
        <T
          de={<>
            <p><b>Die Sonderfälle</b> (Knöpfe über dem Bild):</p>
            <ul>
              <li><b>Lote parallel</b> (Knopf «Translation»): Dann ist <M p=",">{t`\v v_A = \v v_B`}</M> denn die SdpG erlaubt bei gleicher Richtung nur gleiche Grösse. Das ist eine Translation, <M p=".">{t`\v\omega = \v 0`}</M> Die Lote schneiden sich nie – man sagt, <M>Z</M> liegt «im Unendlichen». Der Satz gilt ja nur für <M p=".">{t`\v\omega\neq\v 0`}</M> Knopf «Lote fast parallel»: <M>Z</M> liegt weit weg, ausserhalb des Bildes (Pfeil am Rand).</li>
              <li><b>Beide Geschwindigkeiten senkrecht zu <M p="">{t`AB`}</M></b> Dann fallen beide Lote mit der Geraden <M>{t`AB`}</M> zusammen; die Richtungen allein sagen nicht, wo auf ihr <M>Z</M> liegt. Die Grössen sagen es: Die Geschwindigkeit wächst linear mit dem Abstand von <M p=",">Z</M> also trifft die Gerade durch die beiden Pfeilspitzen die Gerade <M>{t`AB`}</M> genau in <M p=".">Z</M> Genau so findet man später beim <a href="#planetengetriebe">Planetengetriebe</a> den Punkt <M p=".">{t`Z_3`}</M></li>
              <li><b>Ein Punkt ruht</b> (Knopf «<M>A</M> ruht»): Dann ist er selbst das Momentanzentrum.</li>
            </ul>
            <p>Das ganze Geschwindigkeitsfeld aus <M>{t`\v v_B`}</M> und <M>{t`\v\omega`}</M> – mit dem ruhenden Punkt als violettem Punkt – zeigt das Feld-Bild in der Lektion <a href="#allgemein">Allgemeine Bewegung</a>.</p>
          </>}
          en={<>
            <p><b>The special cases</b> (buttons above the figure):</p>
            <ul>
              <li><b>Parallel perpendiculars</b> (button “translation”): then <M p=",">{t`\v v_A = \v v_B`}</M> because for the same direction the SdpG only allows the same size. This is a translation, <M p=".">{t`\v\omega = \v 0`}</M> The perpendiculars never meet – one says <M>Z</M> lies “at infinity”. After all, the theorem holds only for <M p=".">{t`\v\omega\neq\v 0`}</M> Button “nearly parallel”: <M>Z</M> lies far away, outside the picture (arrow at the edge).</li>
              <li><b>Both velocities perpendicular to <M p="">{t`AB`}</M></b> Then both perpendiculars coincide with the line <M p=";">{t`AB`}</M> the directions alone do not tell where on it <M>Z</M> lies. The sizes do: the velocity grows linearly with the distance from <M p=",">Z</M> so the line through the two arrow tips meets the line <M>{t`AB`}</M> exactly in <M p=".">Z</M> This is exactly how the point <M>{t`Z_3`}</M> of the <a href="#planetengetriebe">planetary gear</a> is found later.</li>
              <li><b>One point at rest</b> (button “<M>A</M> at rest”): then it is the instantaneous centre itself.</li>
            </ul>
            <p>The whole velocity field from <M>{t`\v v_B`}</M> and <M>{t`\v\omega`}</M> – with the point at rest as a purple dot – is shown by the field figure in the lesson <a href="#allgemein">General motion</a>.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="rad" title={<T de="3. Das rollende Rad" en="3. The rolling wheel" />}>
        <Box kind="lecture" src={<Src p={27} fig="Fig. 3.20" />} title={<T de="Figur 3.20: rollendes Rad" en={<>Figure 3.20: rolling wheel (<span lang="de">rollendes Rad</span>)</>} />}>
          <T
            de={<p>Rad mit Mittelpunkt <M>O</M> und Radius <M p=",">R</M> Randpunkt <M>P</M> mit <M p=",">{t`\v v_P`}</M> Berührpunkt <M>Z</M> am Boden, Drehpfeile <M p=".">\omega</M> <M p=":">Z</M> Momentanzentrum; <M p=",">{t`\v v_P \perp \v{ZP}`}</M> <M p=";">{t`v_P = \omega\cdot|\v{ZP}|`}</M> <M p=",">{t`\v v_O \perp \v{ZO}`}</M> <M p=".">{t`v_O = \omega\cdot R`}</M></p>}
            en={<p>Wheel with centre <M>O</M> and radius <M p=",">R</M> rim point <M>P</M> with <M p=",">{t`\v v_P`}</M> contact point <M>Z</M> on the ground, turning arrows <M p=".">\omega</M> <M p=":">Z</M> <De en="instantaneous centre">Momentanzentrum</De>; <M p=",">{t`\v v_P \perp \v{ZP}`}</M> <M p=";">{t`v_P = \omega\cdot|\v{ZP}|`}</M> <M p=",">{t`\v v_O \perp \v{ZO}`}</M> <M p=".">{t`v_O = \omega\cdot R`}</M></p>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man das:</b> Rollt das Rad ohne zu rutschen, ruht der Berührpunkt (Lektion <a href="#rollen">Rollen</a>). Ein ruhender Punkt ist nach dem Satz das Momentanzentrum: <M p=".">Z</M> Also steht jede Geschwindigkeit senkrecht auf ihrem Strahl von <M p=",">Z</M> und ihr Betrag ist <M>\omega</M> mal Strahllänge. Für den Mittelpunkt ist die Strahllänge <M p=",">R</M> darum <M p=".">{t`v_O = \omega R`}</M> Für den obersten Punkt ist sie <M p=",">{t`2R`}</M> er ist doppelt so schnell.</p>}
          en={<p className="keep"><b>How to read this:</b> if the wheel rolls without slipping, the contact point is at rest (lesson <a href="#rollen">Rolling</a>). By the theorem a resting point is the instantaneous centre: <M p=".">Z</M> So every velocity is perpendicular to its ray from <M p=",">Z</M> and its size is <M>\omega</M> times the length of the ray. For the centre the ray has length <M p=",">R</M> hence <M p=".">{t`v_O = \omega R`}</M> For the top point it is <M p=":">{t`2R`}</M> it is twice as fast.</p>}
        />
        <WheelRays />
        <T
          de={<p>Das Rad dreht im Uhrzeigersinn, also zeigt <M>{t`\v\omega`}</M> ins Bild hinein: <M>{t`\v\omega = -\omega\,\v e_z`}</M> mit <M>{t`\omega > 0`}</M> (wie in der Lektion <a href="#rollen">Rollen</a>). Wie das Rad dabei wirklich rollt und wann es gleitet, zeigt das Bild dort.</p>}
          en={<p>The wheel turns clockwise, so <M>{t`\v\omega`}</M> points into the page: <M>{t`\v\omega = -\omega\,\v e_z`}</M> with <M>{t`\omega > 0`}</M> (as in the lesson <a href="#rollen">Rolling</a>). How the wheel actually rolls and when it slides is shown by the figure there.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="leiter" title={<T de="4. Beispiel: die Leiter mit dem Momentanzentrum" en="4. Example: the ladder with the instantaneous centre" />}>
        <Box kind="lecture" src={<Src p={27} />} title={<T de="Beispiel: Leiter, geführte Ebene Bewegung" en={<>Example: ladder, guided plane motion (<span lang="de">Leiter, geführte Ebene Bewegung</span>)</>} />}>
          <T
            de={<>
              <p>Aus SdpG: <M p=".">{t`v_V = v_H\cdot\frac{1}{\tan\varphi}`}</M></p>
              <p>Figur: Leiter <M>{t`AB`}</M> der Länge <M p=",">L</M> <M>A</M> am Boden (links unten), <M>B</M> an der Wand (rechts oben), Winkel <M>\varphi</M> bei <M p=";">A</M> Achsen <M>y</M> nach oben, <M>x</M> nach rechts. Handschriftlich: <M>{t`v_H`}</M> bei <M>A</M> nach links, <M>{t`v_V`}</M> bzw. <M>{t`\v v_B`}</M> bei <M>B</M> nach unten; <M>Z</M> im Schnittpunkt der gestrichelten Senkrechten durch <M>A</M> und Waagrechten durch <M p=",">B</M> mit Drehpfeil <M p=";">\omega</M> «<M p=",">{t`\v e_y \uparrow`}</M> <M p=",">{t`\v e_x \to`}</M> <M p="»;">{t`\v e_z \odot`}</M> «gesucht: <M p=";">{t`v_V`}</M> <M p="».">{t`\v v_B\ (0, -v_V, 0)`}</M></p>
              <p>Löse mit SMZ: <M p=",">{t`\v v_A\ (-v_H, 0, 0)`}</M> <M p="">{t`v_H =`}</M></p>
            </>}
            en={<>
              <p>From the SdpG: <M p=".">{t`v_V = v_H\cdot\frac{1}{\tan\varphi}`}</M></p>
              <p>Figure: ladder <M>{t`AB`}</M> of length <M p=",">L</M> <M>A</M> on the floor (bottom left), <M>B</M> at the wall (top right), angle <M>\varphi</M> at <M p=";">A</M> axes <M>y</M> up, <M>x</M> to the right. Handwritten: <M>{t`v_H`}</M> at <M>A</M> to the left, <M>{t`v_V`}</M> or <M>{t`\v v_B`}</M> at <M>B</M> pointing down; <M>Z</M> at the intersection of the dashed vertical through <M>A</M> and horizontal through <M p=",">B</M> with a turning arrow <M p=";">\omega</M> “<M p=",">{t`\v e_y \uparrow`}</M> <M p=",">{t`\v e_x \to`}</M> <M p="”;">{t`\v e_z \odot`}</M> “<span lang="de">gesucht</span> (wanted): <M p=";">{t`v_V`}</M> <M p="”.">{t`\v v_B\ (0, -v_V, 0)`}</M></p>
              <p><span lang="de">Löse mit SMZ</span> (solve with the theorem of the instantaneous centre): <M p=",">{t`\v v_A\ (-v_H, 0, 0)`}</M> <M p="">{t`v_H =`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p>Hier rutscht die Leiter <b>hinunter</b>: <M>A</M> gleitet nach links, weg von der Wand. Auf S. 13 (Lektion <a href="#sdpg">SdpG</a>) ging sie hinauf, und der Winkel hiess dort in der Rechnung <M p=".">\alpha</M> «SMZ» ist die Abkürzung für den Satz vom Momentanzentrum. Die Lösung bricht in deiner Mitschrift nach «<M p="»">{t`v_H =`}</M> ab – du hast «Lösung fehlt» notiert. Hier ist sie, als Ergänzung:</p>}
          en={<p>Here the ladder slides <b>down</b>: <M>A</M> slides to the left, away from the wall. On p. 13 (lesson <a href="#sdpg">SdpG</a>) it went up, and the angle was called <M>\alpha</M> in the calculation there. “SMZ” is short for <span lang="de">Satz vom Momentanzentrum</span>. In your notes the solution breaks off after “<M p="”">{t`v_H =`}</M> – you wrote «<span lang="de">Lösung fehlt</span>» (solution missing). Here it is, as a supplement:</p>}
        />
        <Box keep kind="supplement" title={<T de="Lösung mit dem Momentanzentrum" en="Solution with the instantaneous centre" />}>
          <Derivation title={<T de="Die Leiter Schritt für Schritt" en="The ladder step by step" />}>
            <StepPlayer
              label={tr('Animation: Leiter, Momentanzentrum als Schnitt der Lote', 'Animation: ladder, instantaneous centre as the intersection of the perpendiculars')}
              steps={[
                { ms: 2500, holdMs: 3000, caption: <T
                  de={<>Gegeben: <M>A</M> gleitet mit <M>{t`v_H`}</M> nach links, <M p=".">{t`\v v_A = (-v_H, 0, 0)`}</M> <M>B</M> gleitet die Wand hinunter: Die Richtung von <M>{t`\v v_B`}</M> ist bekannt, die Grösse <M>{t`v_V`}</M> gesucht (gestrichelt).</>}
                  en={<>Given: <M>A</M> slides to the left with <M p=",">{t`v_H`}</M> <M p=".">{t`\v v_A = (-v_H, 0, 0)`}</M> <M>B</M> slides down the wall: the direction of <M>{t`\v v_B`}</M> is known, its size <M>{t`v_V`}</M> is wanted (dashed).</>} /> },
                { ms: 2500, holdMs: 2500, caption: <T
                  de={<>Das Lot zu <M>{t`\v v_A`}</M> durch <M>A</M> ist die Senkrechte durch <M p=".">A</M> Auf ihr liegt <M p=",">Z</M> denn <M>{t`\v v_A`}</M> steht senkrecht auf <M p=".">{t`\v{ZA}`}</M></>}
                  en={<>The perpendicular to <M>{t`\v v_A`}</M> through <M>A</M> is the vertical through <M p=".">A</M> <M>Z</M> lies on it, because <M>{t`\v v_A`}</M> is perpendicular to <M p=".">{t`\v{ZA}`}</M></>} /> },
                { ms: 2500, holdMs: 2500, caption: <T
                  de={<>Das Lot zu <M>{t`\v v_B`}</M> durch <M>B</M> ist die Waagrechte durch <M p=".">B</M> Auch auf ihr liegt <M p=".">Z</M></>}
                  en={<>The perpendicular to <M>{t`\v v_B`}</M> through <M>B</M> is the horizontal through <M p=".">B</M> <M>Z</M> lies on it as well.</>} /> },
                { ms: 3000, holdMs: 3500, caption: <T
                  de={<>Die Lote schneiden sich in <M p=".">Z</M> Aus dem Rechteck liest man ab: <M p=",">{t`|\v{ZA}| = L\sin\varphi`}</M> <M p=".">{t`|\v{ZB}| = L\cos\varphi`}</M></>}
                  en={<>The perpendiculars meet in <M p=".">Z</M> From the rectangle: <M p=",">{t`|\v{ZA}| = L\sin\varphi`}</M> <M p=".">{t`|\v{ZB}| = L\cos\varphi`}</M></>} /> },
                { ms: 3000, holdMs: 3500, caption: <T
                  de={<>Momentan dreht sich die Leiter um <M p=":">Z</M> <M p=",">{t`v_H = \omega\,L\sin\varphi`}</M> also <M p=".">{t`\omega = \frac{v_H}{L\sin\varphi}`}</M> Drehsinn: im Uhrzeigersinn, <M>{t`\v\omega`}</M> zeigt ins Bild hinein.</>}
                  en={<>At this instant the ladder turns about <M p=":">Z</M> <M p=",">{t`v_H = \omega\,L\sin\varphi`}</M> so <M p=".">{t`\omega = \frac{v_H}{L\sin\varphi}`}</M> Sense: clockwise, <M>{t`\v\omega`}</M> points into the page.</>} /> },
                { ms: 3000, holdMs: 3500, caption: <T
                  de={<>Ebenso für <M p=":">B</M> <M p=".">{t`v_V = \omega\,L\cos\varphi = v_H\frac{\cos\varphi}{\sin\varphi} = \frac{v_H}{\tan\varphi}`}</M> Genau das Resultat der SdpG.</>}
                  en={<>Likewise for <M p=":">B</M> <M p=".">{t`v_V = \omega\,L\cos\varphi = v_H\frac{\cos\varphi}{\sin\varphi} = \frac{v_H}{\tan\varphi}`}</M> Exactly the result of the SdpG.</>} /> },
                { ms: 5000, caption: <T
                  de={<>Die Leiter rutscht weiter, und <M>Z</M> wandert mit. <M>{t`ZACB`}</M> ist immer ein Rechteck; seine Diagonalen sind gleich lang: <M p=".">{t`|\v{CZ}| = |\v{AB}| = L`}</M> <M>Z</M> läuft auf einem Kreis um die Ecke <M p=".">C</M></>}
                  en={<>The ladder slides on, and <M>Z</M> moves along. <M>{t`ZACB`}</M> is always a rectangle; its diagonals are equally long: <M p=".">{t`|\v{CZ}| = |\v{AB}| = L`}</M> <M>Z</M> runs on a circle about the corner <M p=".">C</M></>} /> },
              ]}
            >
              {(step, tt) => <AnimFigure build={ladderScene} step={step} t={tt} />}
            </StepPlayer>
          </Derivation>
          <T
            de={<p><b>Vorzeichen:</b> Das Skript schreibt <M p=".">{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> Der Winkel <M>\varphi</M> wird beim Abrutschen kleiner, also ist <M>{t`\dot\varphi = -\frac{v_H}{L\sin\varphi} < 0`}</M> – passend zur Drehung im Uhrzeigersinn. In <M>{t`v = \omega r`}</M> steht der Betrag <M p=".">{t`\frac{v_H}{L\sin\varphi}`}</M> Geprüft (Test <code>plane.test.ts</code>): Rechnet man <M>\varphi</M> aus der Lage von <M>A</M> und leitet nach der Zeit ab, kommt genau dieses <M>\omega</M> heraus.</p>}
            en={<p><b>Signs:</b> the notes write <M p=".">{t`\v\omega = \omega\,\v e_z = \dot\varphi\,\v e_z`}</M> The angle <M>\varphi</M> decreases as the ladder slides, so <M>{t`\dot\varphi = -\frac{v_H}{L\sin\varphi} < 0`}</M> – matching the clockwise turning. In <M>{t`v = \omega r`}</M> it is the magnitude <M p=".">{t`\frac{v_H}{L\sin\varphi}`}</M> Checked (test <code>plane.test.ts</code>): computing <M>\varphi</M> from the position of <M>A</M> and differentiating with respect to time gives exactly this <M p=".">\omega</M></p>}
          />
          <T
            de={<p><b>SdpG oder Momentanzentrum?</b> Die SdpG (Lektion <a href="#sdpg">SdpG</a>) gibt <M>{t`v_V`}</M> direkt. Das Momentanzentrum gibt mehr: auch <M>\omega</M> und mit <M>{t`v = \omega r`}</M> die Geschwindigkeit jedes Punktes der Leiter, zum Beispiel der Mitte (Abstand <M>{t`L/2`}</M> von <M p=",">Z</M> denn die Diagonalen halbieren sich): <M p=".">{t`v_{\text{${tr('Mitte', 'mid')}}} = \frac{v_H}{2\sin\varphi}`}</M></p>}
            en={<p><b>SdpG or instantaneous centre?</b> The SdpG (lesson <a href="#sdpg">SdpG</a>) gives <M>{t`v_V`}</M> directly. The instantaneous centre gives more: also <M>\omega</M> and, with <M p=",">{t`v = \omega r`}</M> the velocity of every point of the ladder, for example of its middle (distance <M>{t`L/2`}</M> from <M p=",">Z</M> since the diagonals bisect each other): <M p=".">{t`v_{\text{${tr('Mitte', 'mid')}}} = \frac{v_H}{2\sin\varphi}`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section long id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M>Z</M> ist ein Punkt des Körpers.»</>} en={<>“<M>Z</M> is a point of the body.”</>} />}>
          <T de={<>Nicht unbedingt. Bei der Leiter liegt <M>Z</M> in der Luft, weit weg von der Leiter. Darum sagt der Satz: der «in Gedanken auf die ganze Ebene ausgedehnte» Körper.</>} en={<>Not necessarily. For the ladder <M>Z</M> lies in the air, far from the ladder. That is why the theorem speaks of the body “imagined as extended to the whole plane”.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>Z</M> ist ein fester Drehpunkt.»</>} en={<>“<M>Z</M> is a fixed pivot.”</>} />}>
          <T de={<><M>Z</M> ruht nur in diesem Augenblick. Bei der Leiter wandert <M>Z</M> auf einem Kreis, beim Rad läuft der Berührpunkt mit dem Rad über den Boden. Darum heisst es <b>Momentan</b>zentrum.</>} en={<><M>Z</M> is at rest only at this instant. For the ladder <M>Z</M> moves on a circle; for the wheel the contact point moves over the ground with the wheel. That is why it is called the <b>instantaneous</b> centre.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Das Rad dreht sich um seine Achse <M p=",">O</M> also ist <M>O</M> das Momentanzentrum.»</>} en={<>“The wheel turns about its axle <M p=",">O</M> so <M>O</M> is the instantaneous centre.”</>} />}>
          <T de={<><M>O</M> bewegt sich ja: <M p=".">{t`v_O = \omega R`}</M> In diesem Augenblick ruht der Berührpunkt <M p=",">Z</M> nicht <M p=".">O</M> Das Momentanzentrum ist auch sonst nicht der Mittelpunkt des Körpers – es hängt von der Bewegung ab, nicht von der Form.</>} en={<><M>O</M> is moving: <M p=".">{t`v_O = \omega R`}</M> At this instant the contact point <M>Z</M> is at rest, not <M p=".">O</M> In general the instantaneous centre is not the centre of the body either – it depends on the motion, not on the shape.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Bei <M>Z</M> bewegt sich der Körper am schnellsten.»</>} en={<>“At <M>Z</M> the body moves fastest.”</>} />}>
          <T de={<>Umgekehrt: Bei <M>Z</M> ist die Geschwindigkeit null, und sie wächst mit dem Abstand: <M p=".">{t`v = \omega r`}</M> Am schnellsten ist der Punkt, der am weitesten von <M>Z</M> weg ist – beim Rad der oberste Punkt.</>} en={<>The other way round: at <M>Z</M> the velocity is zero, and it grows with the distance: <M p=".">{t`v = \omega r`}</M> The fastest point is the one farthest from <M>Z</M> – for the wheel, the top point.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="merke" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Ebene Bewegung: <M>{t`\v\omega = (0, 0, \omega_z)`}</M> steht senkrecht auf der Ebene – oder <M>{t`\v\omega = \v 0`}</M> (Translation).</li>
              <li>Für <M>{t`\v\omega \neq \v 0`}</M> ruht in jedem Augenblick genau ein Punkt <M>Z</M> der (gedanklich ausgedehnten) Ebene. Um ihn ist alles eine Drehung: <M>{t`\v v_M \perp \v{ZM}`}</M> und <M p=".">{t`v_M = \omega\,|\v{ZM}|`}</M></li>
              <li><M>Z</M> findet man als Schnitt der Lote zu zwei Geschwindigkeiten; stehen beide senkrecht auf <M p=",">{t`AB`}</M> mit der Geraden durch die Pfeilspitzen.</li>
              <li>Rollendes Rad: <M>Z</M> ist der Berührpunkt. Leiter: <M>Z</M> liegt in der Luft und wandert auf einem Kreis.</li>
            </ul>}
            en={<ul>
              <li>Plane motion: <M>{t`\v\omega = (0, 0, \omega_z)`}</M> is perpendicular to the plane – or <M>{t`\v\omega = \v 0`}</M> (translation).</li>
              <li>For <M>{t`\v\omega \neq \v 0`}</M> exactly one point <M>Z</M> of the (imagined extended) plane is at rest at every instant. About it everything is a turning: <M>{t`\v v_M \perp \v{ZM}`}</M> and <M p=".">{t`v_M = \omega\,|\v{ZM}|`}</M></li>
              <li><M>Z</M> is found as the intersection of the perpendiculars to two velocities; if both are perpendicular to <M p=",">{t`AB`}</M> with the line through the arrow tips.</li>
              <li>Rolling wheel: <M>Z</M> is the contact point. Ladder: <M>Z</M> lies in the air and moves on a circle.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Der ruhende Punkt im Feld-Bild der <a href="#allgemein">allgemeinen Bewegung</a> ist das Momentanzentrum. Das <a href="#rollen">Rollen</a> ist der wichtigste Fall, und die Leiter kennst du von der <a href="#sdpg">SdpG</a>. Als Nächstes wird das Momentanzentrum zum Werkzeug: Im <a href="#planetengetriebe">Planetengetriebe</a> dreht sich ein Zahnrad um seinen Punkt <M p=".">{t`Z_3`}</M></p>}
          en={<p className="connections"><b>Connections:</b> the point at rest in the field figure of <a href="#allgemein">general motion</a> is the instantaneous centre. <a href="#rollen">Rolling</a> is the most important case, and you know the ladder from the <a href="#sdpg">SdpG</a>. Next, the instantaneous centre becomes a tool: in the <a href="#planetengetriebe">planetary gear</a> a gear wheel turns about its point <M p=".">{t`Z_3`}</M></p>}
        />
      </Section>
    </article>
  );
}
