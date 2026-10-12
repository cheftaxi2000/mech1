import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { CoordinateExplorer } from '../viz/CoordinateExplorer';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { cylScene } from '../viz/anim/cylScene';
import { sphScene } from '../viz/anim/sphScene';

const t = String.raw;

export default function L01Coordinates() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">
          Bevor wir über Geschwindigkeit, Kräfte oder starre Körper sprechen können, brauchen wir eine eindeutige Sprache dafür, <em>wo</em> sich etwas befindet.
          Dieser Abschnitt der Vorlesung baut diese Sprache auf: einen Bezugskörper und drei Arten, einer Lage Zahlen zuzuordnen.
          Alles Weitere im Kurs ist in dieser Sprache geschrieben.
        </p>}
        en={<p className="lede">
          Before we can talk about velocity, forces or rigid bodies, we need an unambiguous way to say <em>where</em> something is.
          This section of the lecture builds that language: a reference body, and three ways of attaching numbers to a position.
          Everything later in the course is written in this language.
        </p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="point" title={<T de="1. Der materielle Punkt und seine Bewegung" en="1. The material point and its motion" />}>
        <Box kind="lecture" src={<Src p={3} />}>
          <T
            de={<ul>
              <li><De en="material system">Materielles System</De>: Menge von materiellen Punkten.</li>
              <li>Lage eines materiellen Punktes <M>M</M> zur Zeit <M p=":">t</M> <M p=",">M(t)</M> geometrischer Punkt im 3D-Raum.</li>
              <li><De en="motion">Bewegung</De> eines materiellen Punktes: Lageänderung als Funktion der Zeit, <M>M(t_1),\ M(t_2),\ \dots</M></li>
              <li>Zur Beschreibung der Lage benötigt man einen <De en="rigid reference body">starren Bezugskörper</De>, d. h. der Abstand zwischen zwei Punkten des Körpers ist konstant.</li>
            </ul>}
            en={<ul>
              <li><De en="material system">Materielles System</De>: a set of material points.</li>
              <li>Position of a material point <M>M</M> at time <M p=":">t</M> <M p=",">M(t)</M> a geometric point in 3D space.</li>
              <li><De en="motion">Bewegung</De>: change of position as a function of time, <M>M(t_1),\ M(t_2),\ \dots</M></li>
              <li>To describe the position we need a <De en="rigid reference body">starrer Bezugskörper</De>: a body in which the distance between any two points is constant.</li>
            </ul>}
          />
        </Box>
        <Box kind="intuition">
          <T
            de={<>
              <p>
                Ein <em>materieller</em> Punkt ist ein Stück Materie, das so klein ist, dass seine Grösse für die gestellte Frage keine Rolle spielt:
                ein Planet auf seiner Bahn, eine Perle auf einem Draht. Er behält seine Identität: <M>M(t_1)</M> und <M>M(t_2)</M> sind
                <em> dasselbe</em> Stück Materie an zwei verschiedenen Orten. Ein <em>geometrischer</em> Punkt ist nur ein Ort. <M>M(t)</M> heisst also:
                «der Ort, den der materielle Punkt <M>M</M> zur Zeit <M>t</M> einnimmt».
              </p>
              <p>
                Lage ist immer <em>relativ</em>. «Wo ist die Kaffeetasse?» hat für jemanden auf dem Perron eine andere Antwort als für jemanden,
                der im fahrenden Zug sitzt. Der Bezugskörper ist das, <em>von dem aus</em> man misst. Er muss starr sein, sonst würden sich die
                Massstäbe während der Messung verformen.
              </p>
            </>}
            en={<>
              <p>
                A <em>material</em> point is a piece of matter small enough that its size does not matter for the question being asked:
                a planet on its orbit, a bead on a wire. It keeps its identity: <M>M(t_1)</M> and <M>M(t_2)</M> are the
                <em> same</em> piece of matter at two different places. A <em>geometric</em> point is just a location. So <M>M(t)</M> reads:
                “the location that the material point <M>M</M> occupies at time <M>t</M>”.
              </p>
              <p>
                Position is always <em>relative</em>. “Where is the coffee cup?” has a different answer for someone standing on the
                platform and for someone sitting in the moving train. The reference body is the thing you measure <em>from</em>. It must be rigid,
                otherwise your rulers would stretch while you measure.
              </p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="cartesian" title={<T de="2. Kartesische Koordinaten" en="2. Cartesian coordinates (kartesische Koordinaten)" />}>
        <Box kind="lecture" src={<Src p={3} fig="Fig. 1.4, 1.7" />}>
          <T
            de={<>
              <M p=":">{t`x'Ox,\ y'Oy,\ z'Oz`}</M> gerichtete orthogonale Achsen (im Bezugskörper). <M p=":">x, y, z</M> kartesische Koordinaten beschreiben
              die Lage von <M>M</M> (zur Zeit <M p=").">t</M> Bewegung von <M p=":">M</M>
            </>}
            en={<>
              <M p=":">{t`x'Ox,\ y'Oy,\ z'Oz`}</M> directed, mutually orthogonal axes fixed in the reference body. The numbers <M>x, y, z</M> describe the
              position of <M>M</M> at time <M p=".">t</M> The motion of <M>M</M> is given by three scalar functions
            </>}
          />
          <MD>{t`x = F_x(t),\qquad y = F_y(t),\qquad z = F_z(t).`}</MD>
        </Box>
        <T
          de={<>
            <p>
              <b>Zur Notation.</b> <M>{t`x'Ox`}</M> bezeichnet die Gerade durch <M p=",">O</M> orientiert von der Seite <M>{t`x'`}</M> zur Seite <M p=".">x</M>{' '}
              Die Koordinate <M>x</M> ist die <em>vorzeichenbehaftete</em> Länge <M p=",">{t`\overline{OM_x}`}</M> wobei <M>{t`M_x`}</M> der Fusspunkt des Lotes
              von <M>M</M> auf die <span className="nowrap"><M>x</M>-Achse</span> ist (Fig. 1.4). Negatives <M>x</M> bedeutet, dass <M>{t`M_x`}</M> auf der Seite <M>{t`x'`}</M> liegt.{' '}
              <M>{t`M_{xy}`}</M> ist die Projektion von <M>M</M> auf die <span className="nowrap"><M>xy</M>-Ebene</span>. Wir werden sie ständig verwenden.
            </p>
            <p>
              <M>F_x</M> ist die <em>Funktion</em>, <M>x</M> ihr <em>Wert</em>. Dass die Vorlesung <M>{t`x = F_x(t)`}</M> schreibt statt nur <M p=",">x(t)</M>{' '}
              betont genau das: Eine Bewegung ist eine Vorschrift, die jedem Zeitpunkt drei Zahlen zuordnet.
            </p>
            <h3>Koordinatenlinien</h3>
            <p>
              Fig. 1.7 zeigt die Linien <M>{t`\bar x, \bar y, \bar z`}</M> durch <M p=".">M</M> Eine <b>Koordinatenlinie</b> entsteht, wenn man <em>eine</em>
              {' '}Koordinate variiert und die beiden anderen festhält. Bei kartesischen Koordinaten sind das Geraden parallel zu den Achsen.
              Das wirkt jetzt trivial, ist aber die Schlüsselidee des nächsten Abschnitts: Die Vorlesung definiert Basisvektoren als Einheitsvektoren,
              die <em>im betrachteten Punkt tangential zu den Koordinatenlinien</em> liegen <Src p={6} />. In zylindrischen und sphärischen Koordinaten
              sind manche Koordinatenlinien Kreise. Genau daher kommen die zusätzlichen Terme in den Geschwindigkeitsformeln.
            </p>
          </>}
          en={<>
            <p>
              <b>Reading the notation.</b> <M>{t`x'Ox`}</M> names the straight line through <M p=",">O</M> oriented from the <M>{t`x'`}</M> side towards
              the <M>x</M> side. The coordinate <M>x</M> is the <em>signed</em> length <M p=",">{t`\overline{OM_x}`}</M> where <M>{t`M_x`}</M> is the foot of the
              perpendicular from <M>M</M> onto the <span className="nowrap"><M>x</M>-axis</span> (Fig. 1.4). Negative <M>x</M> means <M>{t`M_x`}</M> lies on the <M>{t`x'`}</M> side.{' '}
              <M>{t`M_{xy}`}</M> is the projection of <M>M</M> onto the <span className="nowrap"><M>xy</M>-plane</span>. We will use it constantly.
            </p>
            <p>
              <M>F_x</M> is the <em>function</em>, <M>x</M> its <em>value</em>. Writing <M>{t`x = F_x(t)`}</M> instead of just <M>x(t)</M> is the lecture's way of
              stressing this: a motion is a rule that assigns three numbers to every instant.
            </p>
            <h3>Coordinate lines (Koordinatenlinien)</h3>
            <p>
              Fig. 1.7 shows the lines <M>{t`\bar x, \bar y, \bar z`}</M> through <M p=".">M</M> A <b>coordinate line</b> is what you trace out when you
              let <em>one</em> coordinate vary and keep the other two fixed. For Cartesian coordinates these are straight lines parallel to the axes.
              This looks trivial now, but it is the key idea of the next section: the lecture defines basis vectors as unit vectors
              <em> tangent to the coordinate lines at the point considered</em> <Src p={6} />. In cylindrical and spherical coordinates some coordinate lines are circles,
              and that is exactly where the extra terms in the velocity formulas will come from.
            </p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="cylindrical" title={<T de={<>3. Zylindrische Koordinaten <M>{t`\rho, \varphi, z`}</M></>} en={<>3. Cylindrical coordinates (zylindrische Koordinaten) <M>{t`\rho, \varphi, z`}</M></>} />}>
        <Box kind="lecture" src={<Src p={'3–4'} fig="Fig. 1.8, 1.10" />}>
          <T de="Beziehung zwischen kartesischen und zylindrischen Koordinaten:" en="Relation between Cartesian and cylindrical coordinates:" />
          <MD>{t`x = \rho\cos\varphi,\qquad y = \rho\sin\varphi,\qquad z = z`}</MD>
          <T de="Und umgekehrt:" en="And conversely:" />
          <MD>{t`\rho = \sqrt{x^2+y^2},\qquad \varphi = \arctan\!\left(\frac{y}{x}\right),\qquad z = z.`}</MD>
          <T de={<>Bahnkurve von <M>M</M> in zylindrischen Koordinaten:</>} en={<>Trajectory of <M>M</M> in cylindrical coordinates:</>} />{' '}
          <M p=".">{t`\rho = F_\rho(t),\ \varphi = F_\varphi(t),\ z = F_z(t)`}</M>
        </Box>
        <T
          de={<>
            <p><b>Bedeutung der drei Zahlen.</b></p>
            <ul>
              <li><M p=":">\rho</M> Abstand von <M>M</M> zur <M>z</M>-<em>Achse</em> (= Länge <M p=").">{t`\overline{OM_{xy}}`}</M> Nicht der Abstand zum Ursprung!</li>
              <li><M p=":">\varphi</M> Winkel von der positiven <span className="nowrap"><M>x</M>-Achse</span> zur Strecke <M p=",">{t`OM_{xy}`}</M> gemessen in der <span className="nowrap"><M>xy</M>-Ebene</span>, im Gegenuhrzeigersinn bei Blick von <M p=".">+z</M></li>
              <li><M p=":">z</M> identisch mit dem kartesischen <M p=",">z</M> die Höhe über der <span className="nowrap"><M>xy</M>-Ebene</span>.</li>
            </ul>
          </>}
          en={<>
            <p><b>Meaning of the three numbers.</b></p>
            <ul>
              <li><M p=":">\rho</M> distance of <M>M</M> from the <M>z</M>-<em>axis</em> (= length <M p=").">{t`\overline{OM_{xy}}`}</M> Not the distance from the origin!</li>
              <li><M p=":">\varphi</M> angle from the positive <span className="nowrap"><M>x</M>-axis</span> to the segment <M p=",">{t`OM_{xy}`}</M> measured in the <span className="nowrap"><M>xy</M>-plane</span>, counter-clockwise when looking down from <M p=".">+z</M></li>
              <li><M p=":">z</M> identical to the Cartesian <M p=",">z</M> the height above the <span className="nowrap"><M>xy</M>-plane</span>.</li>
            </ul>
          </>}
        />
        <Derivation title={<M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M>}>
          <StepPlayer
            label={tr('Animation der Herleitung von x = ρ cos φ, y = ρ sin φ', 'Animation of the derivation of x = ρ cos φ, y = ρ sin φ')}
            steps={[
              { ms: 4500, holdMs: 3000, caption: <T
                de={<>Projiziere <M>M</M> senkrecht nach unten auf <M p=".">{t`M_{xy}`}</M> Das ändert <M>x</M> und <M>y</M> nicht; wir können also ganz in der <span className="nowrap"><M>xy</M>-Ebene</span> arbeiten.</>}
                en={<>Project <M>M</M> straight down to <M p=".">{t`M_{xy}`}</M> This does not change <M>x</M> or <M p=",">y</M> so we can work entirely in the <span className="nowrap"><M>xy</M>-plane</span>.</>} /> },
              { ms: 5500, holdMs: 3500, caption: <T
                de={<>Wir schauen von oben auf die <span className="nowrap"><M>xy</M>-Ebene</span>. Darin bilden <M p=",">O</M> <M>{t`M_{xy}`}</M> und der Fusspunkt <M>{t`M_x`}</M> des Lotes von <M>{t`M_{xy}`}</M> auf die <span className="nowrap"><M>x</M>-Achse</span> ein rechtwinkliges Dreieck mit Hypotenuse <M>\rho</M> und Winkel <M>\varphi</M> bei <M p=".">O</M></>}
                en={<>We look down onto the <span className="nowrap"><M>xy</M>-plane</span>. In it, <M p=",">O</M> <M>{t`M_{xy}`}</M> and the foot <M>{t`M_x`}</M> of the perpendicular from <M>{t`M_{xy}`}</M> onto the <span className="nowrap"><M>x</M>-axis</span> form a right triangle with hypotenuse <M>\rho</M> and angle <M>\varphi</M> at <M p=".">O</M></>} /> },
              { ms: 10000, holdMs: 3500, caption: <T
                de={<>Im ersten Quadranten: Ankathete <M p=",">{t`= \rho\cos\varphi = x`}</M> Gegenkathete <M p=".">{t`= \rho\sin\varphi = y`}</M> In allen Quadranten stimmen auch die Vorzeichen: <M>{t`M_{xy}`}</M> ist der Einheitskreis-Punkt <M>{t`(\cos\varphi, \sin\varphi)`}</M> mal <M p=".">\rho</M> Die Animation lässt <M>\varphi</M> einmal herumlaufen.</>}
                en={<>In the first quadrant: adjacent side <M p=",">{t`= \rho\cos\varphi = x`}</M> opposite side <M p=".">{t`= \rho\sin\varphi = y`}</M> In all quadrants the signs are right too: <M>{t`M_{xy}`}</M> is the unit-circle point <M>{t`(\cos\varphi, \sin\varphi)`}</M> times <M p=".">\rho</M> The animation sweeps <M>\varphi</M> once around.</>} /> },
              { ms: 5500, holdMs: 2500, caption: <T
                de={<>Umkehrung: Pythagoras liefert <M p=";">{t`\rho^2 = x^2+y^2`}</M> die Division der beiden Gleichungen (für <M p=")">{t`x \ne 0`}</M> liefert <M p=".">{t`\tan\varphi = y/x`}</M> Aber <M>\varphi</M> und <M>{t`\varphi + 180^\circ`}</M> (blasser Punkt gegenüber) haben denselben Tangens, und der <M>\arctan</M> liefert nur Winkel zwischen <M>{t`-90^\circ`}</M> und <M p=".">{t`90^\circ`}</M> Deshalb: Für <M>{t`x < 0`}</M> addiert man <M p=",">{t`180^\circ`}</M> für <M>{t`x > 0,\ y < 0`}</M> addiert man <M p=".">{t`360^\circ`}</M></>}
                en={<>Inverse: Pythagoras gives <M p=";">{t`\rho^2 = x^2+y^2`}</M> dividing the two equations (for <M p=")">{t`x \ne 0`}</M> gives <M p=".">{t`\tan\varphi = y/x`}</M> But <M>\varphi</M> and <M>{t`\varphi + 180^\circ`}</M> (faint point opposite) have the same tangent, and the <M>\arctan</M> only returns angles between <M>{t`-90^\circ`}</M> and <M p=".">{t`90^\circ`}</M> Hence: for <M>{t`x < 0`}</M> add <M p=",">{t`180^\circ`}</M> for <M>{t`x > 0,\ y < 0`}</M> add <M p=".">{t`360^\circ`}</M></>} /> },
              { ms: 8000, caption: <T
                de={<><b>Plausibilitätskontrolle (Grenzfälle).</b> <M p=":">{t`\varphi = 0`}</M> <M p=",">{t`(x,y) = (\rho, 0)`}</M> auf der positiven <span className="nowrap"><M>x</M>-Achse</span>&nbsp;✓. <M p=":">{t`\varphi = \pi/2`}</M> <M p=",">{t`(x,y) = (0, \rho)`}</M> auf der positiven <span className="nowrap"><M>y</M>-Achse</span>&nbsp;✓.</>}
                en={<><b>Sanity check (limiting cases).</b> <M p=":">{t`\varphi = 0`}</M> <M p=",">{t`(x,y) = (\rho, 0)`}</M> on the positive <span className="nowrap"><M>x</M>-axis</span>&nbsp;✓. <M p=":">{t`\varphi = \pi/2`}</M> <M p=",">{t`(x,y) = (0, \rho)`}</M> on the positive <span className="nowrap"><M>y</M>-axis</span>&nbsp;✓.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={cylScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="supplement" title={<T de={<>Wertebereiche und der Sonderfall auf der <span className="nowrap"><M>z</M>-Achse</span></>} en={<>Ranges and the special case on the <span className="nowrap"><M>z</M>-axis</span></>} />}>
          <T
            de={<>
              Die übliche Konvention, die im Skript nicht explizit steht, ist <M p=",">{t`\rho \ge 0`}</M> <M p=",">{t`0 \le \varphi < 2\pi`}</M> <M p=".">{t`z\in\mathbb{R}`}</M>{' '}
              Auf der <span className="nowrap"><M>z</M>-Achse</span> (<M p=")">{t`\rho = 0`}</M> liefert jedes <M>\varphi</M> denselben Punkt; <M>\varphi</M> ist dort also nicht definiert.
              Probier es im Explorer unten aus, indem du <M>{t`\rho = 0`}</M> setzt.
            </>}
            en={<>
              The usual convention, which the notes do not state explicitly, is <M p=",">{t`\rho \ge 0`}</M> <M p=",">{t`0 \le \varphi < 2\pi`}</M> <M p=".">{t`z\in\mathbb{R}`}</M>{' '}
              On the <span className="nowrap"><M>z</M>-axis</span> (<M p=")">{t`\rho = 0`}</M> every <M>\varphi</M> gives the same point, so <M>\varphi</M> is undefined there. Try it in the explorer below by setting <M p=".">{t`\rho = 0`}</M>
            </>}
          />
        </Box>
        <T
          de={<>
            <h3>Koordinatenlinien (Fig. 1.10)</h3>
            <ul>
              <li><b><span className="nowrap"><M>\rho</M>-Linie</span></b> (<M>{t`\varphi, z`}</M> fest): horizontaler Strahl, der auf der <span className="nowrap"><M>z</M>-Achse</span> beginnt und durch <M>M</M> geht.</li>
              <li><b><span className="nowrap"><M>\varphi</M>-Linie</span></b> (<M>{t`\rho, z`}</M> fest): horizontaler <em>Kreis</em> mit Radius <M>\rho</M> um die <span className="nowrap"><M>z</M>-Achse</span>, der Kreis in Fig. 1.10.</li>
              <li><b><span className="nowrap"><M>z</M>-Linie</span></b> (<M>{t`\rho, \varphi`}</M> fest): vertikale Gerade durch <M>M</M> (die Linie <M>{t`\bar z`}</M> in der Figur).</li>
            </ul>
            <p>Zum Namen: Die <em>Fläche</em> <M>{t`\rho = \text{const}`}</M> ist ein Zylinder um die <span className="nowrap"><M>z</M>-Achse</span>. Daher kommt der Name.</p>
          </>}
          en={<>
            <h3>Coordinate lines (Fig. 1.10)</h3>
            <ul>
              <li><b><span className="nowrap"><M>\rho</M>-line</span></b> (<M>{t`\varphi, z`}</M> fixed): horizontal ray starting at the <span className="nowrap"><M>z</M>-axis</span> and passing through <M p=".">M</M></li>
              <li><b><span className="nowrap"><M>\varphi</M>-line</span></b> (<M>{t`\rho, z`}</M> fixed): horizontal <em>circle</em> of radius <M>\rho</M> around the <span className="nowrap"><M>z</M>-axis</span>, the circle drawn in Fig. 1.10.</li>
              <li><b><span className="nowrap"><M>z</M>-line</span></b> (<M>{t`\rho, \varphi`}</M> fixed): vertical straight line through <M>M</M> (the <M>{t`\bar z`}</M> line in the figure).</li>
            </ul>
            <p>Name check: the <em>surface</em> <M>{t`\rho = \text{const}`}</M> is a cylinder around the <span className="nowrap"><M>z</M>-axis</span>. That is where the name comes from.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="spherical" title={<T de={<>4. Sphärische Koordinaten <M>{t`r, \theta, \psi`}</M></>} en={<>4. Spherical coordinates (sphärische Koordinaten) <M>{t`r, \theta, \psi`}</M></>} />}>
        <Box kind="lecture" src={<Src p={4} fig="Fig. 1.12" />}>
          <T de="Beziehung zwischen kartesischen und sphärischen Koordinaten:" en="Relation between Cartesian and spherical coordinates:" />
          <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi,\qquad z = r\cos\theta`}</MD>
          <T de="Und umgekehrt:" en="And conversely:" />
          <MD>{t`r = \sqrt{x^2+y^2+z^2},\qquad \theta = \arctan\!\left(\frac{\sqrt{x^2+y^2}}{z}\right),\qquad \psi = \arctan\!\left(\frac{y}{x}\right).`}</MD>
          <T de={<>Bahnkurve von <M>M</M> in sphärischen Koordinaten:</>} en={<>Trajectory of <M>M</M> in spherical coordinates:</>} />{' '}
          <M p=".">{t`r = F_r(t),\ \theta = F_\theta(t),\ \psi = F_\psi(t)`}</M>
        </Box>
        <Box kind="key" title={<T de="Notation in diesem Kurs" en="Notation in this course" />}>
          <T
            de={<>
              Die Vorlesung nennt den sphärischen Azimut <M>\psi</M> (nicht <M p=").">\varphi</M> Geometrisch ist <M>\psi</M> <em>derselbe</em> Winkel wie das zylindrische <M p=".">\varphi</M>{' '}
              <M>\theta</M> wird von der <b>positiven <span className="nowrap"><M>z</M>-Achse</span></b> aus bis zur Strecke <M>{t`OM`}</M> gemessen, also gilt <M p=".">{t`0 \le \theta \le \pi`}</M>{' '}
              Viele Physik- und Mathematikbücher verwenden andere Buchstaben oder vertauschen sie. Prüfe immer, welcher Winkel welcher ist, bevor du eine Formel aus einer anderen Quelle übernimmst.
            </>}
            en={<>
              The lecture calls the spherical azimuth <M>\psi</M> (not <M p=").">\varphi</M> Geometrically, <M>\psi</M> is the <em>same</em> angle as the cylindrical <M p=".">\varphi</M>{' '}
              <M>\theta</M> is measured from the <b>positive <span className="nowrap"><M>z</M>-axis</span></b> down to the segment <M p=",">{t`OM`}</M> so <M p=".">{t`0 \le \theta \le \pi`}</M>{' '}
              Many physics and maths books use other letters or swap them. Always check which angle is which before using a formula from elsewhere.
            </>}
          />
        </Box>
        <T
          de={<ul>
            <li><M p=":">r</M> Abstand von <M>M</M> zum <em>Ursprung</em> <M p=".">O</M></li>
            <li><M p=":">\theta</M> Winkel zwischen <M>+z</M> und <M>{t`OM`}</M> (Polarwinkel). <M>{t`\theta=0`}</M> ist der «Nordpol», <M>{t`\theta=\pi/2`}</M> die <span className="nowrap"><M>xy</M>-Ebene</span>, <M>{t`\theta=\pi`}</M> der «Südpol».</li>
          </ul>}
          en={<ul>
            <li><M p=":">r</M> distance of <M>M</M> from the <em>origin</em> <M p=".">O</M></li>
            <li><M p=":">\theta</M> angle between <M>+z</M> and <M>{t`OM`}</M> (polar angle). <M>{t`\theta=0`}</M> is the “north pole”, <M>{t`\theta=\pi/2`}</M> the <span className="nowrap"><M>xy</M>-plane</span>, <M>{t`\theta=\pi`}</M> the “south pole”.</li>
          </ul>}
        />
        <Derivation title={<T de="die sphärischen Formeln aus den zylindrischen" en="the spherical formulas from the cylindrical ones" />}>
          <StepPlayer
            label={tr('Animation der Herleitung der sphärischen Koordinaten', 'Animation of the derivation of the spherical coordinates')}
            steps={[
              { ms: 5000, holdMs: 3000, caption: <T
                de={<>Betrachte die senkrechte Ebene, die die <span className="nowrap"><M>z</M>-Achse</span> und <M>M</M> enthält. Darin bilden <M p=",">O</M> <M>M</M> und der Fusspunkt <M>{t`M_z`}</M> des Lotes von <M>M</M> auf die <span className="nowrap"><M>z</M>-Achse</span> ein rechtwinkliges Dreieck mit Hypotenuse <M>r</M> und Winkel <M>\theta</M> bei <M p=".">O</M></>}
                en={<>Look at the vertical plane that contains the <span className="nowrap"><M>z</M>-axis</span> and <M p=".">M</M> In it, <M p=",">O</M> <M>M</M> and the foot <M>{t`M_z`}</M> of the perpendicular from <M>M</M> onto the <span className="nowrap"><M>z</M>-axis</span> form a right triangle with hypotenuse <M>r</M> and angle <M>\theta</M> at <M p=".">O</M></>} /> },
              { ms: 10000, holdMs: 4000, caption: <T
                de={<>Wir schauen frontal auf diese Ebene. Die Kathete entlang der <span className="nowrap"><M>z</M>-Achse</span> ist <M p=",">{t`z = r\cos\theta`}</M> die andere ist der Abstand zur <span className="nowrap"><M>z</M>-Achse</span>: <M p=".">{t`\rho = r\sin\theta`}</M> Für <M>{t`\theta > 90^\circ`}</M> wird <M>z</M> negativ, aber <M>\rho</M> bleibt <M>{t`\ge 0`}</M> (Kasten oben rechts).</>}
                en={<>We look straight at this plane. The side along the <span className="nowrap"><M>z</M>-axis</span> is <M p=",">{t`z = r\cos\theta`}</M> the other one is the distance from the <span className="nowrap"><M>z</M>-axis</span>: <M p=".">{t`\rho = r\sin\theta`}</M> For <M>{t`\theta > 90^\circ`}</M> the height <M>z</M> becomes negative, but <M>\rho</M> stays <M>{t`\ge 0`}</M> (box at the top right).</>} /> },
              { ms: 9000, holdMs: 4000, caption: <T
                de={<>Senkrecht nach unten projiziert, ist die Kathete <M>\rho</M> genau die Strecke <M p=".">{t`OM_{xy}`}</M> Von oben gesehen gilt deshalb wie bei den Zylinderkoordinaten <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> mit <M p=".">{t`\varphi = \psi`}</M> Einsetzen von <M>{t`\rho = r\sin\theta`}</M> ergibt
                  <MD>{t`\begin{gathered} x = r\sin\theta\cos\psi, \\ y = r\sin\theta\sin\psi. \end{gathered}`}</MD></>}
                en={<>Projected straight down, the side <M>\rho</M> is exactly the segment <M p=".">{t`OM_{xy}`}</M> Seen from above, therefore, as for cylindrical coordinates, <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> with <M p=".">{t`\varphi = \psi`}</M> Inserting <M>{t`\rho = r\sin\theta`}</M> gives
                  <MD>{t`\begin{gathered} x = r\sin\theta\cos\psi, \\ y = r\sin\theta\sin\psi. \end{gathered}`}</MD></>} /> },
              { ms: 7000, holdMs: 3000, caption: <T
                de={<>Konsistenzkontrolle: <M p="✓.">{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M> Geometrisch ist das zweimal Pythagoras: im Boden <M p=",">{t`\rho^2 = x^2+y^2`}</M> im senkrechten Dreieck <M p=".">{t`r^2 = \rho^2 + z^2`}</M></>}
                en={<>Consistency check: <M p="✓.">{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M> Geometrically this is Pythagoras twice: in the floor <M p=",">{t`\rho^2 = x^2+y^2`}</M> in the vertical triangle <M p=".">{t`r^2 = \rho^2 + z^2`}</M></>} /> },
              { ms: 4500, caption: <T
                de={<>Umkehrung: <M>{t`r = \sqrt{x^2+y^2+z^2}`}</M> (Schritt 4), <M>\psi</M> wie <M>\varphi</M> aus <M>x</M> und <M p=",">y</M> und aus Schritt 2 <M p=".">{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M> Für <M>{t`z < 0`}</M> ist der <M>\arctan</M> falsch; sicher ist <M p=".">{t`\theta = \arccos(z/r)`}</M></>}
                en={<>Inverse: <M>{t`r = \sqrt{x^2+y^2+z^2}`}</M> (step 4), <M>\psi</M> like <M>\varphi</M> from <M>x</M> and <M p=",">y</M> and from step 2 <M p=".">{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M> For <M>{t`z < 0`}</M> the <M>\arctan</M> is wrong; always safe is <M p=".">{t`\theta = \arccos(z/r)`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={sphScene} step={step} t={tt} />}
          </StepPlayer>
          <details className="more">
            <summary><T de={<>Warum gilt <M>{t`z = r\cos\theta`}</M> auch für <M p="?">{t`\theta > 90^\circ`}</M></>} en={<>Why does <M>{t`z = r\cos\theta`}</M> also hold for <M p="?">{t`\theta > 90^\circ`}</M></>} /></summary>
            <T
              de={<p><M>\theta</M> wird immer von <M>+z</M> aus gemessen. Liegt <M>M</M> unter der <span className="nowrap"><M>xy</M>-Ebene</span>, hat das Dreieck bei <M>O</M> den Winkel <M p=".">{t`180^\circ - \theta`}</M> Seine Kathete entlang der Achse ist dann <M>{t`r\cos(180^\circ - \theta) = -r\cos\theta`}</M> lang. Weil <M>M</M> unten liegt, ist <M>z</M> minus diese Länge, also wieder <M p=".">{t`z = r\cos\theta`}</M> Für die andere Kathete gilt <M p=",">{t`\sin(180^\circ - \theta) = \sin\theta`}</M> also <M p=".">{t`\rho = r\sin\theta \ge 0`}</M></p>}
              en={<p><M>\theta</M> is always measured from <M p=".">+z</M> If <M>M</M> lies below the <span className="nowrap"><M>xy</M>-plane</span>, the triangle has the angle <M>{t`180^\circ - \theta`}</M> at <M p=".">O</M> Its side along the axis then has length <M p=".">{t`r\cos(180^\circ - \theta) = -r\cos\theta`}</M> Because <M>M</M> lies below, <M>z</M> is minus this length, so again <M p=".">{t`z = r\cos\theta`}</M> For the other side, <M p=",">{t`\sin(180^\circ - \theta) = \sin\theta`}</M> so <M p=".">{t`\rho = r\sin\theta \ge 0`}</M></p>}
            />
          </details>
        </Derivation>
        <T
          de={<>
            <h3>Koordinatenlinien</h3>
            <ul>
              <li><b><span className="nowrap"><M>r</M>-Linie</span></b>: Strahl von <M>O</M> durch <M p=".">M</M></li>
              <li><b><span className="nowrap"><M>\theta</M>-Linie</span></b>: Meridian, ein halber Grosskreis mit Radius <M>r</M> vom Nord- zum Südpol, durch <M p=".">M</M></li>
              <li><b><span className="nowrap"><M>\psi</M>-Linie</span></b>: Breitenkreis, ein horizontaler Kreis mit Radius <M>{t`r\sin\theta`}</M> auf der Höhe <M p=".">{t`r\cos\theta`}</M></li>
            </ul>
          </>}
          en={<>
            <h3>Coordinate lines</h3>
            <ul>
              <li><b><span className="nowrap"><M>r</M>-line</span></b>: ray from <M>O</M> through <M p=".">M</M></li>
              <li><b><span className="nowrap"><M>\theta</M>-line</span></b>: meridian, half of a great circle of radius <M>r</M> from the north to the south pole, through <M p=".">M</M></li>
              <li><b><span className="nowrap"><M>\psi</M>-line</span></b>: circle of latitude, a horizontal circle of radius <M>{t`r\sin\theta`}</M> at height <M p=".">{t`r\cos\theta`}</M></li>
            </ul>
          </>}
        />
        <Box kind="supplement" title={<T de="Woher die Namen kommen" en="Where the names come from" />}>
          <T
            de={<>Hält man eine Koordinate fest, erhält man eine Fläche. <M>{t`\rho = \text{const}`}</M> ist ein Zylinder um die <span className="nowrap"><M>z</M>-Achse</span> (→ «zylindrisch»), <M>{t`r = \text{const}`}</M> eine Kugel um <M>O</M> (→ «sphärisch»). <M>{t`\theta = \text{const}`}</M> ist ein <b>Kegel</b> mit Spitze <M>O</M> um die <span className="nowrap"><M>z</M>-Achse</span>; für <M>{t`\theta > 90^\circ`}</M> öffnet er sich nach unten, für <M>{t`\theta = 90^\circ`}</M> wird er zur <span className="nowrap"><M>xy</M>-Ebene</span>. («Kartesisch» dagegen kommt von Descartes.)</>}
            en={<>Holding one coordinate fixed gives a surface. <M>{t`\rho = \text{const}`}</M> is a cylinder around the <span className="nowrap"><M>z</M>-axis</span> (→ “cylindrical”), <M>{t`r = \text{const}`}</M> a sphere around <M>O</M> (→ “spherical”). <M>{t`\theta = \text{const}`}</M> is a <b>cone</b> with apex <M>O</M> around the <span className="nowrap"><M>z</M>-axis</span>; for <M>{t`\theta > 90^\circ`}</M> it opens downwards, for <M>{t`\theta = 90^\circ`}</M> it becomes the <span className="nowrap"><M>xy</M>-plane</span>. (“Cartesian”, by contrast, comes from Descartes.)</>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Analogie zur Geografie" en="Geography analogy" />}>
          <T
            de={<>
              Auf dem Globus ist <M>\psi</M> die geografische Länge und <M>\theta</M> die <em>Ko</em>-Breite, <M p=".">{t`\theta = 90^\circ - \text{Breite}`}</M>{' '}
              Zürich liegt auf etwa <M>{t`47{,}4^\circ`}</M> N, also ist <M p=".">{t`\theta \approx 42{,}6^\circ`}</M>
            </>}
            en={<>
              On the globe, <M>\psi</M> is the longitude and <M>\theta</M> is the <em>co</em>-latitude, <M p=".">{t`\theta = 90^\circ - \text{latitude}`}</M>{' '}
              Zürich lies at about <M>{t`47.4^\circ`}</M> N, so <M p=".">{t`\theta \approx 42.6^\circ`}</M>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="explorer" title={<T de="5. Erkunden: ein Punkt, drei Beschreibungen" en="5. Explore: one point, three descriptions" />}>
        <T
          de={<p>
            Verschiebe <M>M</M> mit den Schiebereglern und wechsle zwischen den Systemen. Der Punkt bleibt, wo er ist; nur seine Beschreibung ändert sich.
            Alle drei Koordinatentripel werden darunter live angezeigt. Achte darauf, welche Koordinatenlinien gerade und welche gekrümmt sind.
          </p>}
          en={<p>
            Move <M>M</M> with the sliders and switch between the systems. The point stays where it is; only its description changes.
            All three coordinate triples are shown live underneath. Watch which coordinate lines are straight and which are curved.
          </p>}
        />
        <CoordinateExplorer initialMode="cyl" />
        <T
          de={<ul className="observe">
            <li>Ändert man im zylindrischen Modus nur <M p=",">\varphi</M> läuft <M>M</M> auf einem waagrechten Kreis mit Radius <M>\rho</M> um die <span className="nowrap"><M>z</M>-Achse</span> – der <span className="nowrap"><M>\varphi</M>-Linie</span>. Das wird die <em>Kreisbewegung</em> (S. 11).</li>
            <li>Bei <M>{t`\theta = 90^\circ`}</M> liegt <M>M</M> in der <span className="nowrap"><M>xy</M>-Ebene</span> <M p=",">{t`(z = r\cos 90^\circ = 0)`}</M> und dort ist <M p=":">{t`\rho = r\sin 90^\circ = r`}</M> Beide Abstände sind gleich.</li>
            <li>Bei <M>{t`\rho = 0`}</M> verlieren <M>\varphi</M> und <M>\psi</M> ihre Bedeutung: Jeder Winkel beschreibt denselben Punkt auf der <span className="nowrap"><M>z</M>-Achse</span>. Ist zusätzlich <M p=",">{t`z = 0`}</M> also <M p=",">{t`M = O`}</M> ist auch <M>\theta</M> bedeutungslos.</li>
            <li>«Bewegung abspielen» zeigt eine Bahnkurve: Die drei Schieberegler werden zu drei Funktionen der Zeit – genau <M>{t`x = F_x(t),\ y = F_y(t),\ z = F_z(t)`}</M> aus der Vorlesung.</li>
          </ul>}
          en={<ul className="observe">
            <li>Changing only <M>\varphi</M> in cylindrical mode moves <M>M</M> on a horizontal circle of radius <M>\rho</M> around the <span className="nowrap"><M>z</M>-axis</span> – the <span className="nowrap"><M>\varphi</M>-line</span>. This will be <em>Kreisbewegung</em> (p. 11).</li>
            <li>At <M>{t`\theta = 90^\circ`}</M> the point <M>M</M> lies in the <span className="nowrap"><M>xy</M>-plane</span> <M p=",">{t`(z = r\cos 90^\circ = 0)`}</M> and there <M p=":">{t`\rho = r\sin 90^\circ = r`}</M> both distances are equal.</li>
            <li>At <M>{t`\rho = 0`}</M> the angles <M>\varphi</M> and <M>\psi</M> lose their meaning: every angle describes the same point on the <span className="nowrap"><M>z</M>-axis</span>. If also <M p=",">{t`z = 0`}</M> i.e. <M p=",">{t`M = O`}</M> then <M>\theta</M> means nothing either.</li>
            <li>“Play a motion” shows a trajectory: the three sliders become three functions of time – exactly <M>{t`x = F_x(t),\ y = F_y(t),\ z = F_z(t)`}</M> from the lecture.</li>
          </ul>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="example" title={<T de="6. Durchgerechnetes Beispiel (Ergänzung)" en="6. Worked example (supplement)" />}>
        <T
          de={<p>Rechne <M>{t`M = (x,y,z) = (-1,\ 1,\ \sqrt 2)`}</M> in zylindrische und sphärische Koordinaten um und rechne zur Kontrolle zurück.</p>}
          en={<p>Convert <M>{t`M = (x,y,z) = (-1,\ 1,\ \sqrt 2)`}</M> into cylindrical and spherical coordinates, then convert back as a check.</p>}
        />
        <T
          de={<ol className="steps">
            <li><b>Zuerst den Punkt verorten.</b> <M p=":">{t`x<0,\ y>0`}</M> <M>{t`M_{xy}`}</M> liegt im 2. Quadranten, also muss der Azimut zwischen <M>{t`90^\circ`}</M> und <M>{t`180^\circ`}</M> liegen. <M p=":">{t`z>0`}</M> oberhalb der <span className="nowrap"><M>xy</M>-Ebene</span>, also <M p=".">{t`\theta < 90^\circ`}</M></li>
            <li><M p=".">{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M></li>
            <li><M p=":">{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M> 4. Quadrant, Widerspruch zu Schritt 1. <M>{t`180^\circ`}</M> addieren: <M p=".">{t`\varphi = 135^\circ = 3\pi/4`}</M></li>
            <li><M p=".">{t`r = \sqrt{1+1+2} = 2`}</M></li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (passt zu Schritt 1). <M p=".">{t`\psi = \varphi = 135^\circ`}</M></li>
            <li><b>Kontrolle:</b> <M p="✓,">{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M> <M p="✓,">{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M> <M p="✓.">{t`z = 2\cos45^\circ = \sqrt2`}</M></li>
          </ol>}
          en={<ol className="steps">
            <li><b>Locate the point first.</b> <M p=":">{t`x<0,\ y>0`}</M> <M>{t`M_{xy}`}</M> is in the 2nd quadrant, so the azimuth must lie between <M>{t`90^\circ`}</M> and <M p=".">{t`180^\circ`}</M> <M p=":">{t`z>0`}</M> above the <span className="nowrap"><M>xy</M>-plane</span>, so <M p=".">{t`\theta < 90^\circ`}</M></li>
            <li><M p=".">{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M></li>
            <li><M p=":">{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M> 4th quadrant, contradicts step 1. Add <M p=":">{t`180^\circ`}</M> <M p=".">{t`\varphi = 135^\circ = 3\pi/4`}</M></li>
            <li><M p=".">{t`r = \sqrt{1+1+2} = 2`}</M></li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (consistent with step 1). <M p=".">{t`\psi = \varphi = 135^\circ`}</M></li>
            <li><b>Check:</b> <M p="✓,">{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M> <M p="✓,">{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M> <M p="✓.">{t`z = 2\cos45^\circ = \sqrt2`}</M></li>
          </ol>}
        />
        <T
          de={<p>Resultat: <M p=",">{t`(\rho,\varphi,z) = (\sqrt2,\ 3\pi/4,\ \sqrt2)`}</M> <M p=".">{t`(r,\theta,\psi) = (2,\ \pi/4,\ 3\pi/4)`}</M> Eine Gewohnheit, die sich lohnt: <em>Vor dem arctan den Quadranten skizzieren.</em></p>}
          en={<p>Result: <M p=",">{t`(\rho,\varphi,z) = (\sqrt2,\ 3\pi/4,\ \sqrt2)`}</M> <M p=".">{t`(r,\theta,\psi) = (2,\ \pi/4,\ 3\pi/4)`}</M> Habit worth keeping: <em>sketch the quadrant before using arctan.</em></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="misconceptions" title={<T de="7. Typische Missverständnisse" en="7. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M>\rho</M> und <M>r</M> sind derselbe Abstand.»</>} en={<>“<M>\rho</M> and <M>r</M> are the same distance.”</>} />}>
          <T
            de={<><M>\rho</M> ist der Abstand zur <M>z</M>-<em>Achse</em>, <M>r</M> der Abstand zum <em>Ursprung</em>. Sie stimmen nur in der <span className="nowrap"><M>xy</M>-Ebene</span> überein; allgemein gilt <M p=".">{t`\rho = r\sin\theta \le r`}</M></>}
            en={<><M>\rho</M> is the distance from the <M>z</M>-<em>axis</em>, <M>r</M> from the <em>origin</em>. They agree only in the <span className="nowrap"><M>xy</M>-plane</span>; in general <M p=".">{t`\rho = r\sin\theta \le r`}</M></>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>\theta</M> wird von der <span className="nowrap"><M>xy</M>-Ebene</span> aus nach oben gemessen.»</>} en={<>“<M>\theta</M> is measured up from the <span className="nowrap"><M>xy</M>-plane</span>.”</>} />}>
          <T
            de={<>Das wäre die geografische Breite. In diesem Kurs wird <M>\theta</M> von der <M>+z</M>-Achse aus gemessen; Punkte unterhalb der <span className="nowrap"><M>xy</M>-Ebene</span> haben <M p=".">{t`\theta > 90^\circ`}</M></>}
            en={<>That would be the geographic latitude. In this course <M>\theta</M> is measured from the <M>+z</M>-axis; points below the <span className="nowrap"><M>xy</M>-plane</span> have <M p=".">{t`\theta > 90^\circ`}</M></>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`(\rho, \varphi, z)`}</M> sind die Komponenten des Ortsvektors.»</>} en={<>“<M>{t`(\rho, \varphi, z)`}</M> are the components of the position vector.”</>} />}>
          <T
            de={<>
              <p>Koordinaten sind keine Vektorkomponenten, und Koordinatentripel kann man nicht wie Vektoren addieren. Gegenbeispiel: Die Punkte
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> und <M>{t`(1, \pi, 0)`}</M> sind kartesisch <M>{t`(1,0,0)`}</M> und <M p=";">{t`(-1,0,0)`}</M> ihre Vektorsumme ist der Ursprung.
                «Tripel addieren» ergäbe dagegen <M p=",">{t`(2, \pi, 0)`}</M> also <M p=".">{t`(-2,0,0)`}</M> Falsch.</p>
              <p>Die Vorlesung kommt auf S. 11 genau darauf zurück: In der zylindrischen Basis hat der Ortsvektor eines Punktes auf einem Kreis die Komponenten <M p=",">{t`(R, 0, z_0)`}</M>{' '}
                und <M>{t`(R, \varphi(t), z_0)`}</M> ist im Skript ausdrücklich als «Falsch!» durchgestrichen. Der Grund folgt in der Lektion <a href="#basen">Kartesische, zylindrische, sphärische Basis</a>: Der Winkel steckt in der Richtung von <M p=".">{t`\underline{e}_\rho(\varphi)`}</M></p>
            </>}
            en={<>
              <p>Coordinates are not vector components, and coordinate triples cannot be added like vectors. Counterexample: the points
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> and <M>{t`(1, \pi, 0)`}</M> are <M>{t`(1,0,0)`}</M> and <M>{t`(-1,0,0)`}</M> in Cartesian coordinates; their vector sum is the origin.
                “Adding the triples” would instead give <M p=",">{t`(2, \pi, 0)`}</M> i.e. <M p=".">{t`(-2,0,0)`}</M> Wrong.</p>
              <p>The lecture returns to exactly this point on p. 11: in the cylindrical basis the position vector of a point on a circle has components <M p=",">{t`(R, 0, z_0)`}</M>{' '}
                and <M>{t`(R, \varphi(t), z_0)`}</M> is explicitly crossed out as “Falsch!” in the notes. The reason follows in the lesson <a href="#basen">Cartesian, cylindrical, spherical basis</a>: the angle is hidden in the direction of <M p=".">{t`\underline{e}_\rho(\varphi)`}</M></p>
            </>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\arctan(y/x)`}</M> liefert immer <M p=".">\varphi</M>»</>} en={<>“<M>{t`\arctan(y/x)`}</M> always gives <M p=".">\varphi</M>”</>} />}>
          <T
            de={<ul>
              <li>Für <M>{t`x > 0,\ y \ge 0`}</M> stimmt er direkt.</li>
              <li>Für <M>{t`x < 0`}</M> addiert man <M p=".">{t`180^\circ`}</M></li>
              <li>Für <M>{t`x > 0,\ y < 0`}</M> ist der <M>\arctan</M> negativ: <M>{t`360^\circ`}</M> addieren.</li>
              <li>Für <M>{t`x = 0`}</M> ist <M>{t`y/x`}</M> nicht definiert: <M>{t`\varphi = 90^\circ`}</M> für <M p=",">{t`y > 0`}</M> <M>{t`\varphi = 270^\circ`}</M> für <M p=".">{t`y < 0`}</M></li>
            </ul>}
            en={<ul>
              <li>For <M>{t`x > 0,\ y \ge 0`}</M> it is right as it is.</li>
              <li>For <M>{t`x < 0`}</M> add <M p=".">{t`180^\circ`}</M></li>
              <li>For <M>{t`x > 0,\ y < 0`}</M> the <M>\arctan</M> is negative: add <M p=".">{t`360^\circ`}</M></li>
              <li>For <M>{t`x = 0`}</M> the quotient <M>{t`y/x`}</M> is undefined: <M>{t`\varphi = 90^\circ`}</M> for <M p=",">{t`y > 0`}</M> <M>{t`\varphi = 270^\circ`}</M> for <M p=".">{t`y < 0`}</M></li>
            </ul>}
          />
          <T de="Am sichersten: zuerst den Quadranten skizzieren." en="Safest: sketch the quadrant first." />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="connections" title={<T de="8. Das Wichtigste und wie es weitergeht" en="8. The essentials and where this leads" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Eine Lage gibt man immer <em>relativ</em> zu einem starren Bezugskörper an.</li>
              <li>Ein Punkt, drei Zahlentripel: <M p=",">{t`(x, y, z)`}</M> <M p=",">{t`(\rho, \varphi, z)`}</M> <M p=".">{t`(r, \theta, \psi)`}</M></li>
              <li><M>\rho</M> ist der Abstand zur <span className="nowrap"><M>z</M>-Achse</span>, <M>r</M> der Abstand zu <M p=".">O</M> <M>\theta</M> wird von <M>+z</M> aus gemessen; <M>\psi</M> ist derselbe Winkel wie <M p=".">\varphi</M></li>
              <li>Umrechnen: <M p=",">{t`x = \rho\cos\varphi`}</M> <M p=",">{t`y = \rho\sin\varphi`}</M> <M p=",">{t`\rho = r\sin\theta`}</M> <M p=".">{t`z = r\cos\theta`}</M></li>
              <li>Vor dem <M>\arctan</M> den Quadranten prüfen.</li>
            </ul>}
            en={<ul>
              <li>A position is always given <em>relative</em> to a rigid reference body.</li>
              <li>One point, three triples: <M p=",">{t`(x, y, z)`}</M> <M p=",">{t`(\rho, \varphi, z)`}</M> <M p=".">{t`(r, \theta, \psi)`}</M></li>
              <li><M>\rho</M> is the distance from the <span className="nowrap"><M>z</M>-axis</span>, <M>r</M> the distance from <M p=".">O</M> <M>\theta</M> is measured from <M p=";">+z</M> <M>\psi</M> is the same angle as <M p=".">\varphi</M></li>
              <li>Converting: <M p=",">{t`x = \rho\cos\varphi`}</M> <M p=",">{t`y = \rho\sin\varphi`}</M> <M p=",">{t`\rho = r\sin\theta`}</M> <M p=".">{t`z = r\cos\theta`}</M></li>
              <li>Check the quadrant before using <M p=".">\arctan</M></li>
            </ul>}
          />
        </Box>
        <T de={<h3>Wie es weitergeht</h3>} en={<h3>Where this leads</h3>} />
        <T
          de={<ul>
            <li><b>Als Nächstes (S. 5):</b> Vektoren, Skalar- und Kreuzprodukt, orthonormierte Basen. Eine Lage wird zu einem Vektor <M p=".">{t`\underline r(t)`}</M></li>
            <li><b>S. 6–7:</b> Die zylindrische und die sphärische <em>Basis</em> bestehen aus Einheitsvektoren tangential zu den Koordinatenlinien dieser Lektion; <M>{t`\underline e_\varphi`}</M> ist also tangential zum <span className="nowrap"><M>\varphi</M>-Kreis</span>.</li>
            <li><b>S. 9–10:</b> Weil sich <M>{t`\underline e_\rho`}</M> dreht, wenn sich <M>\varphi</M> ändert, ist die Geschwindigkeit in zylindrischen Koordinaten <M p=".">{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M></li>
            <li><b>S. 11 und S. 16:</b> Kreisbewegung heisst «nur <M>\varphi</M> ändert sich»; der Beweis der Vorlesung, dass eine starre Rotation eine Kreisbewegung ist, wird in zylindrischen Koordinaten geführt.</li>
          </ul>}
          en={<ul>
            <li><b>Next (p. 5):</b> vectors, scalar and cross product, orthonormal bases. A position becomes a vector <M p=".">{t`\underline r(t)`}</M></li>
            <li><b>pp. 6–7:</b> the cylindrical and spherical <em>bases</em> are unit vectors tangent to the coordinate lines from this lesson, so <M>{t`\underline e_\varphi`}</M> is tangent to the <span className="nowrap"><M>\varphi</M>-circle</span>.</li>
            <li><b>pp. 9–10:</b> because <M>{t`\underline e_\rho`}</M> turns when <M>\varphi</M> changes, velocity in cylindrical coordinates is <M p=".">{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M></li>
            <li><b>p. 11 and p. 16:</b> circular motion is “only <M>\varphi</M> changes”; the lecture's proof that rigid rotation is circular motion is done in cylindrical coordinates.</li>
          </ul>}
        />
      </Section>
    </article>
  );
}
