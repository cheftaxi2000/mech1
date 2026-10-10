import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { Choice, NumericAnswer, Predict } from '../components/Quiz';
import { CoordinateExplorer } from '../viz/CoordinateExplorer';
import { QuadrantTrap } from '../viz/QuadrantTrap';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CylDerivationFigure } from '../viz/anim/CylDerivationFigure';

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
              <li>Lage eines materiellen Punktes <M>M</M> zur Zeit <M>t</M>: <M>M(t)</M>, geometrischer Punkt im 3D-Raum.</li>
              <li><De en="motion">Bewegung</De> eines materiellen Punktes: Lageänderung als Funktion der Zeit, <M>M(t_1),\ M(t_2),\ \dots</M></li>
              <li>Zur Beschreibung der Lage benötigt man einen <De en="rigid reference body">starren Bezugskörper</De>, d. h. der Abstand zwischen zwei Punkten des Körpers ist konstant.</li>
            </ul>}
            en={<ul>
              <li><De en="material system">Materielles System</De>: a set of material points.</li>
              <li>Position of a material point <M>M</M> at time <M>t</M>: <M>M(t)</M>, a geometric point in 3D space.</li>
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
              <M>{t`x'Ox,\ y'Oy,\ z'Oz`}</M>: gerichtete orthogonale Achsen (im Bezugskörper). <M>x, y, z</M>: kartesische Koordinaten beschreiben
              die Lage von <M>M</M> (zur Zeit <M>t</M>). Bewegung von <M>M</M>:
            </>}
            en={<>
              <M>{t`x'Ox,\ y'Oy,\ z'Oz`}</M>: directed, mutually orthogonal axes fixed in the reference body. The numbers <M>x, y, z</M> describe the
              position of <M>M</M> at time <M>t</M>. The motion of <M>M</M> is given by three scalar functions
            </>}
          />
          <MD>{t`x = F_x(t),\qquad y = F_y(t),\qquad z = F_z(t).`}</MD>
        </Box>
        <T
          de={<>
            <p>
              <b>Zur Notation.</b> <M>{t`x'Ox`}</M> bezeichnet die Gerade durch <M>O</M>, orientiert von der Seite <M>{t`x'`}</M> zur Seite <M>x</M>.
              Die Koordinate <M>x</M> ist die <em>vorzeichenbehaftete</em> Länge <M>{t`\overline{OM_x}`}</M>, wobei <M>{t`M_x`}</M> der Fusspunkt des Lotes
              von <M>M</M> auf die <M>x</M>-Achse ist (Fig. 1.4). Negatives <M>x</M> bedeutet, dass <M>{t`M_x`}</M> auf der Seite <M>{t`x'`}</M> liegt.{' '}
              <M>{t`M_{xy}`}</M> ist die Projektion von <M>M</M> auf die <M>xy</M>-Ebene. Wir werden sie ständig verwenden.
            </p>
            <p>
              <M>F_x</M> ist die <em>Funktion</em>, <M>x</M> ihr <em>Wert</em>. Dass die Vorlesung <M>{t`x = F_x(t)`}</M> schreibt statt nur <M>x(t)</M>,
              betont genau das: Eine Bewegung ist eine Vorschrift, die jedem Zeitpunkt drei Zahlen zuordnet.
            </p>
            <h3>Koordinatenlinien</h3>
            <p>
              Fig. 1.7 zeigt die Linien <M>{t`\bar x, \bar y, \bar z`}</M> durch <M>M</M>. Eine <b>Koordinatenlinie</b> entsteht, wenn man <em>eine</em>
              {' '}Koordinate variiert und die beiden anderen festhält. Bei kartesischen Koordinaten sind das Geraden parallel zu den Achsen.
              Das wirkt jetzt trivial, ist aber die Schlüsselidee des nächsten Abschnitts: Die Vorlesung definiert Basisvektoren als Einheitsvektoren,
              die <em>im betrachteten Punkt tangential zu den Koordinatenlinien</em> liegen <Src p={6} />. In zylindrischen und sphärischen Koordinaten
              sind manche Koordinatenlinien Kreise. Genau daher kommen die zusätzlichen Terme in den Geschwindigkeitsformeln.
            </p>
          </>}
          en={<>
            <p>
              <b>Reading the notation.</b> <M>{t`x'Ox`}</M> names the straight line through <M>O</M>, oriented from the <M>{t`x'`}</M> side towards
              the <M>x</M> side. The coordinate <M>x</M> is the <em>signed</em> length <M>{t`\overline{OM_x}`}</M>, where <M>{t`M_x`}</M> is the foot of the
              perpendicular from <M>M</M> onto the <M>x</M>-axis (Fig. 1.4). Negative <M>x</M> means <M>{t`M_x`}</M> lies on the <M>{t`x'`}</M> side.{' '}
              <M>{t`M_{xy}`}</M> is the projection of <M>M</M> onto the <M>xy</M>-plane. We will use it constantly.
            </p>
            <p>
              <M>F_x</M> is the <em>function</em>, <M>x</M> its <em>value</em>. Writing <M>{t`x = F_x(t)`}</M> instead of just <M>x(t)</M> is the lecture's way of
              stressing this: a motion is a rule that assigns three numbers to every instant.
            </p>
            <h3>Coordinate lines (Koordinatenlinien)</h3>
            <p>
              Fig. 1.7 shows the lines <M>{t`\bar x, \bar y, \bar z`}</M> through <M>M</M>. A <b>coordinate line</b> is what you trace out when you
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
          <T de="Bahnkurve von M in zylindrischen Koordinaten:" en="Trajectory of M in cylindrical coordinates:" />{' '}
          <M>{t`\rho = F_\rho(t),\ \varphi = F_\varphi(t),\ z = F_z(t)`}</M>.
        </Box>
        <T
          de={<>
            <p><b>Bedeutung der drei Zahlen.</b></p>
            <ul>
              <li><M>\rho</M>: Abstand von <M>M</M> zur <M>z</M>-<em>Achse</em> (= Länge <M>{t`\overline{OM_{xy}}`}</M>). Nicht der Abstand zum Ursprung!</li>
              <li><M>\varphi</M>: Winkel von der positiven <M>x</M>-Achse zur Strecke <M>{t`OM_{xy}`}</M>, gemessen in der <M>xy</M>-Ebene, im Gegenuhrzeigersinn bei Blick von <M>+z</M>.</li>
              <li><M>z</M>: identisch mit dem kartesischen <M>z</M>, die Höhe über der <M>xy</M>-Ebene.</li>
            </ul>
          </>}
          en={<>
            <p><b>Meaning of the three numbers.</b></p>
            <ul>
              <li><M>\rho</M>: distance of <M>M</M> from the <M>z</M>-<em>axis</em> (= length <M>{t`\overline{OM_{xy}}`}</M>). Not the distance from the origin!</li>
              <li><M>\varphi</M>: angle from the positive <M>x</M>-axis to the segment <M>{t`OM_{xy}`}</M>, measured in the <M>xy</M>-plane, counter-clockwise when looking down from <M>+z</M>.</li>
              <li><M>z</M>: identical to the Cartesian <M>z</M>, the height above the <M>xy</M>-plane.</li>
            </ul>
          </>}
        />
        <Derivation title={<M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M>}>
          <StepPlayer
            label={tr('Animation der Herleitung von x = ρ cos φ, y = ρ sin φ', 'Animation of the derivation of x = ρ cos φ, y = ρ sin φ')}
            steps={[
              { ms: 4600, caption: <T
                de={<>Projiziere <M>M</M> senkrecht nach unten auf <M>{t`M_{xy}`}</M>. Das ändert <M>x</M> und <M>y</M> nicht; wir können also ganz in der <M>xy</M>-Ebene arbeiten und schauen von oben auf sie.</>}
                en={<>Project <M>M</M> straight down to <M>{t`M_{xy}`}</M>. This does not change <M>x</M> or <M>y</M>, so we can work entirely in the <M>xy</M>-plane and look at it from above.</>} /> },
              { ms: 3800, caption: <T
                de={<>In dieser Ebene bilden <M>O</M>, <M>{t`M_{xy}`}</M> und der Fusspunkt des Lotes von <M>{t`M_{xy}`}</M> auf die <M>x</M>-Achse ein rechtwinkliges Dreieck mit Hypotenuse <M>\rho</M> und Winkel <M>\varphi</M> bei <M>O</M>.</>}
                en={<>In that plane, <M>O</M>, <M>{t`M_{xy}`}</M> and the foot of the perpendicular from <M>{t`M_{xy}`}</M> onto the <M>x</M>-axis form a right triangle with hypotenuse <M>\rho</M> and angle <M>\varphi</M> at <M>O</M>.</>} /> },
              { ms: 9000, caption: <T
                de={<>Ankathete <M>{t`= \rho\cos\varphi = x`}</M>, Gegenkathete <M>{t`= \rho\sin\varphi = y`}</M>. Mit den vorzeichenbehafteten Funktionen <M>\cos</M> und <M>\sin</M> (Einheitskreis) gilt das in allen vier Quadranten, nicht nur im ersten: Die Animation lässt <M>\varphi</M> einmal ganz herumlaufen.</>}
                en={<>Adjacent side <M>{t`= \rho\cos\varphi = x`}</M>, opposite side <M>{t`= \rho\sin\varphi = y`}</M>. With the signed functions <M>\cos</M> and <M>\sin</M> (unit circle) this holds in all four quadrants, not just the first: the animation takes <M>\varphi</M> once all the way round.</>} /> },
              { ms: 5200, caption: <T
                de={<>Umkehrung: Pythagoras liefert <M>{t`\rho^2 = x^2+y^2`}</M>; die Division der beiden Gleichungen liefert <M>{t`\tan\varphi = y/x`}</M>.</>}
                en={<>Inverse: Pythagoras gives <M>{t`\rho^2 = x^2+y^2`}</M>; dividing the two equations gives <M>{t`\tan\varphi = y/x`}</M>.</>} /> },
              { ms: 8000, caption: <T
                de={<><b>Plausibilitätskontrolle (Grenzfälle).</b> <M>{t`\varphi = 0`}</M>: <M>{t`(x,y) = (\rho, 0)`}</M>, auf der positiven <M>x</M>-Achse ✓. <M>{t`\varphi = \pi/2`}</M>: <M>{t`(0,\rho)`}</M> ✓.</>}
                en={<><b>Sanity check (limiting cases).</b> <M>{t`\varphi = 0`}</M>: <M>{t`(x,y) = (\rho, 0)`}</M>, on the positive <M>x</M>-axis ✓. <M>{t`\varphi = \pi/2`}</M>: <M>{t`(0,\rho)`}</M> ✓.</>} /> },
            ]}
          >
            {(step, tt) => <CylDerivationFigure step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="review" title={<T de={<>R-001 · <M>{t`\varphi = \arctan(y/x)`}</M> stimmt nur für <M>{t`x > 0`}</M></>} en={<>R-001 · <M>{t`\varphi = \arctan(y/x)`}</M> is only correct for <M>{t`x > 0`}</M></>} />}>
          <T
            de={<p>
              <M>\tan</M> hat die Periode <M>\pi</M>, deshalb kann <M>{t`\tan\varphi = y/x`}</M> nicht zwischen <M>\varphi</M> und <M>{t`\varphi+\pi`}</M> unterscheiden.
              Der <M>\arctan</M> des Taschenrechners liefert immer Werte in <M>{t`(-\tfrac{\pi}{2}, \tfrac{\pi}{2})`}</M>. Für Punkte mit <M>{t`x<0`}</M> liegt er um <M>\pi</M> daneben,
              für <M>{t`x = 0`}</M> ist er nicht definiert. Die Formel im Skript ist die übliche Kurzschreibweise, bei der «den richtigen Quadranten wählen» stillschweigend
              vorausgesetzt wird. Korrekte Version (Ergänzung):
            </p>}
            en={<p>
              <M>\tan</M> has period <M>\pi</M>, so <M>{t`\tan\varphi = y/x`}</M> cannot distinguish <M>\varphi</M> from <M>{t`\varphi+\pi`}</M>.
              The calculator's <M>\arctan</M> always answers in <M>{t`(-\tfrac{\pi}{2}, \tfrac{\pi}{2})`}</M>. For points with <M>{t`x<0`}</M> it is off by <M>\pi</M>,
              and for <M>{t`x = 0`}</M> it is undefined. The formula in the notes is the standard shorthand, with “choose the correct quadrant” left implicit.
              Correct version (supplement):
            </p>}
          />
          <T
            de={<MD>{t`\varphi = \begin{cases} \arctan(y/x) & x>0 \\ \arctan(y/x) + \pi & x<0 \\ \pi/2 & x = 0,\ y>0 \\ 3\pi/2 & x=0,\ y<0 \end{cases}\qquad(\text{danach auf } [0,2\pi) \text{ reduzieren})`}</MD>}
            en={<MD>{t`\varphi = \begin{cases} \arctan(y/x) & x>0 \\ \arctan(y/x) + \pi & x<0 \\ \pi/2 & x = 0,\ y>0 \\ 3\pi/2 & x=0,\ y<0 \end{cases}\qquad(\text{then reduce to } [0,2\pi))`}</MD>}
          />
          <T
            de={<p>Genau das berechnet <code>atan2(y, x)</code>. Probier es aus:</p>}
            en={<p>This is what <code>atan2(y, x)</code> computes. Try it:</p>}
          />
          <QuadrantTrap />
        </Box>
        <Box kind="supplement" title={<T de={<>Wertebereiche und der Sonderfall auf der <M>z</M>-Achse</>} en={<>Ranges and the special case on the <M>z</M>-axis</>} />}>
          <T
            de={<>
              Die übliche Konvention, die im Skript nicht explizit steht, ist <M>{t`\rho \ge 0`}</M>, <M>{t`0 \le \varphi < 2\pi`}</M>, <M>{t`z\in\mathbb{R}`}</M>.
              Auf der <M>z</M>-Achse (<M>{t`\rho = 0`}</M>) liefert jedes <M>\varphi</M> denselben Punkt; <M>\varphi</M> ist dort also nicht definiert.
              Probier es im Explorer unten aus, indem du <M>{t`\rho = 0`}</M> setzt.
            </>}
            en={<>
              The usual convention, which the notes do not state explicitly, is <M>{t`\rho \ge 0`}</M>, <M>{t`0 \le \varphi < 2\pi`}</M>, <M>{t`z\in\mathbb{R}`}</M>.
              On the <M>z</M>-axis (<M>{t`\rho = 0`}</M>) every <M>\varphi</M> gives the same point, so <M>\varphi</M> is undefined there. Try it in the explorer below by setting <M>{t`\rho = 0`}</M>.
            </>}
          />
        </Box>
        <T
          de={<>
            <h3>Koordinatenlinien (Fig. 1.10)</h3>
            <ul>
              <li><b><M>\rho</M>-Linie</b> (<M>{t`\varphi, z`}</M> fest): horizontaler Strahl, der auf der <M>z</M>-Achse beginnt und durch <M>M</M> geht.</li>
              <li><b><M>\varphi</M>-Linie</b> (<M>{t`\rho, z`}</M> fest): horizontaler <em>Kreis</em> mit Radius <M>\rho</M> um die <M>z</M>-Achse, der Kreis in Fig. 1.10.</li>
              <li><b><M>z</M>-Linie</b> (<M>{t`\rho, \varphi`}</M> fest): vertikale Gerade durch <M>M</M> (die Linie <M>{t`\bar z`}</M> in der Figur).</li>
            </ul>
            <p>Zum Namen: Die <em>Fläche</em> <M>{t`\rho = \text{const}`}</M> ist ein Zylinder um die <M>z</M>-Achse. Daher kommt der Name.</p>
          </>}
          en={<>
            <h3>Coordinate lines (Fig. 1.10)</h3>
            <ul>
              <li><b><M>\rho</M>-line</b> (<M>{t`\varphi, z`}</M> fixed): horizontal ray starting at the <M>z</M>-axis and passing through <M>M</M>.</li>
              <li><b><M>\varphi</M>-line</b> (<M>{t`\rho, z`}</M> fixed): horizontal <em>circle</em> of radius <M>\rho</M> around the <M>z</M>-axis, the circle drawn in Fig. 1.10.</li>
              <li><b><M>z</M>-line</b> (<M>{t`\rho, \varphi`}</M> fixed): vertical straight line through <M>M</M> (the <M>{t`\bar z`}</M> line in the figure).</li>
            </ul>
            <p>Name check: the <em>surface</em> <M>{t`\rho = \text{const}`}</M> is a cylinder around the <M>z</M>-axis. That is where the name comes from.</p>
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
          <T de="Bahnkurve von M in sphärischen Koordinaten:" en="Trajectory of M in spherical coordinates:" />{' '}
          <M>{t`r = F_r(t),\ \theta = F_\theta(t),\ \psi = F_\psi(t)`}</M>.
        </Box>
        <Box kind="key" title={<T de="Notation in diesem Kurs" en="Notation in this course" />}>
          <T
            de={<>
              Die Vorlesung nennt den sphärischen Azimut <M>\psi</M> (nicht <M>\varphi</M>). Geometrisch ist <M>\psi</M> <em>derselbe</em> Winkel wie das zylindrische <M>\varphi</M>.{' '}
              <M>\theta</M> wird von der <b>positiven <M>z</M>-Achse</b> aus bis zu <M>{t`\underline{OM}`}</M> gemessen, also gilt <M>{t`0 \le \theta \le \pi`}</M>.
              Viele Physik- und Mathematikbücher verwenden andere Buchstaben oder vertauschen sie. Prüfe immer, welcher Winkel welcher ist, bevor du eine Formel aus einer anderen Quelle übernimmst.
            </>}
            en={<>
              The lecture calls the spherical azimuth <M>\psi</M> (not <M>\varphi</M>). Geometrically, <M>\psi</M> is the <em>same</em> angle as the cylindrical <M>\varphi</M>.{' '}
              <M>\theta</M> is measured from the <b>positive <M>z</M>-axis</b> down to <M>{t`\underline{OM}`}</M>, so <M>{t`0 \le \theta \le \pi`}</M>.
              Many physics and maths books use other letters or swap them. Always check which angle is which before using a formula from elsewhere.
            </>}
          />
        </Box>
        <T
          de={<ul>
            <li><M>r</M>: Abstand von <M>M</M> zum <em>Ursprung</em> <M>O</M>.</li>
            <li><M>\theta</M>: Winkel zwischen <M>+z</M> und <M>{t`OM`}</M> (Polarwinkel). <M>{t`\theta=0`}</M> ist der «Nordpol», <M>{t`\theta=\pi/2`}</M> die <M>xy</M>-Ebene, <M>{t`\theta=\pi`}</M> der «Südpol».</li>
            <li><M>\psi</M>: Azimut, wie <M>\varphi</M> oben.</li>
          </ul>}
          en={<ul>
            <li><M>r</M>: distance of <M>M</M> from the <em>origin</em> <M>O</M>.</li>
            <li><M>\theta</M>: angle between <M>+z</M> and <M>{t`OM`}</M> (polar angle). <M>{t`\theta=0`}</M> is the “north pole”, <M>{t`\theta=\pi/2`}</M> the <M>xy</M>-plane, <M>{t`\theta=\pi`}</M> the “south pole”.</li>
            <li><M>\psi</M>: azimuth, as <M>\varphi</M> above.</li>
          </ul>}
        />
        <Derivation title={<T de="die sphärischen Formeln aus den zylindrischen" en="the spherical formulas from the cylindrical ones" />}>
          <T
            de={<ol>
              <li>Betrachte die vertikale Ebene, die die <M>z</M>-Achse und <M>M</M> enthält. Darin bilden <M>O</M>, <M>M</M> und der Fusspunkt des Lotes von <M>M</M> auf die <M>z</M>-Achse ein rechtwinkliges Dreieck mit Hypotenuse <M>r</M> und Winkel <M>\theta</M> bei <M>O</M>.</li>
              <li>Kathete entlang der <M>z</M>-Achse: <M>{t`z = r\cos\theta`}</M>. Die Kathete senkrecht dazu ist genau der Abstand zur <M>z</M>-Achse: <M>{t`\rho = r\sin\theta`}</M>.</li>
              <li>Setze <M>{t`\rho = r\sin\theta`}</M> und <M>{t`\varphi = \psi`}</M> in <M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M> ein:
                <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi.`}</MD></li>
              <li>Konsistenzkontrolle: <M>{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M> ✓.</li>
              <li>Umkehrung: Aus Schritt 2 folgt <M>{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M>.</li>
            </ol>}
            en={<ol>
              <li>Look at the vertical plane that contains the <M>z</M>-axis and <M>M</M>. In it, <M>O</M>, <M>M</M> and the foot of the perpendicular from <M>M</M> onto the <M>z</M>-axis form a right triangle with hypotenuse <M>r</M> and angle <M>\theta</M> at <M>O</M>.</li>
              <li>Side along the <M>z</M>-axis: <M>{t`z = r\cos\theta`}</M>. The side perpendicular to it is exactly the distance from the <M>z</M>-axis: <M>{t`\rho = r\sin\theta`}</M>.</li>
              <li>Insert <M>{t`\rho = r\sin\theta`}</M> and <M>{t`\varphi = \psi`}</M> into <M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M>:
                <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi.`}</MD></li>
              <li>Consistency check: <M>{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M> ✓.</li>
              <li>Inverse: from step 2, <M>{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M>.</li>
            </ol>}
          />
        </Derivation>
        <Box kind="review" title={<T de={<>R-001 (nochmals) · <M>{t`\theta = \arctan\big(\sqrt{x^2+y^2}/z\big)`}</M> versagt für <M>{t`z < 0`}</M></>} en={<>R-001 (again) · <M>{t`\theta = \arctan\big(\sqrt{x^2+y^2}/z\big)`}</M> fails for <M>{t`z < 0`}</M></>} />}>
          <T
            de={<p>
              Für einen Punkt unterhalb der <M>xy</M>-Ebene, z. B. <M>{t`(1,0,-1)`}</M>, ist das wahre <M>{t`\theta = 135^\circ`}</M>, aber <M>{t`\arctan(1/(-1)) = -45^\circ`}</M>.
              Für <M>{t`z = 0`}</M> ist der Bruch nicht definiert, obwohl <M>{t`\theta = 90^\circ`}</M> völlig in Ordnung ist.
              Eine Form, die nie eine Quadrantenkorrektur braucht (Ergänzung): Der <M>{t`\arccos`}</M> liefert Werte in <M>{t`[0,\pi]`}</M>, genau dem Wertebereich von <M>\theta</M>. Also
            </p>}
            en={<p>
              For a point below the <M>xy</M>-plane, e.g. <M>{t`(1,0,-1)`}</M>, the true <M>{t`\theta = 135^\circ`}</M> but <M>{t`\arctan(1/(-1)) = -45^\circ`}</M>.
              For <M>{t`z = 0`}</M> the fraction is undefined although <M>{t`\theta = 90^\circ`}</M> is perfectly fine.
              A form that never needs a quadrant correction (supplement): <M>{t`\arccos`}</M> returns values in <M>{t`[0,\pi]`}</M>, exactly the range of <M>\theta</M>. So
            </p>}
          />
          <MD>{t`\theta = \arccos\!\left(\frac{z}{r}\right),\qquad r > 0.`}</MD>
        </Box>
        <T
          de={<>
            <h3>Koordinatenlinien</h3>
            <ul>
              <li><b><M>r</M>-Linie</b>: Strahl von <M>O</M> durch <M>M</M>.</li>
              <li><b><M>\theta</M>-Linie</b>: Meridian, ein halber Grosskreis mit Radius <M>r</M> vom Nord- zum Südpol, durch <M>M</M>.</li>
              <li><b><M>\psi</M>-Linie</b>: Breitenkreis, ein horizontaler Kreis mit Radius <M>{t`r\sin\theta`}</M> auf der Höhe <M>{t`r\cos\theta`}</M>.</li>
            </ul>
          </>}
          en={<>
            <h3>Coordinate lines</h3>
            <ul>
              <li><b><M>r</M>-line</b>: ray from <M>O</M> through <M>M</M>.</li>
              <li><b><M>\theta</M>-line</b>: meridian, half of a great circle of radius <M>r</M> from the north to the south pole, through <M>M</M>.</li>
              <li><b><M>\psi</M>-line</b>: circle of latitude, a horizontal circle of radius <M>{t`r\sin\theta`}</M> at height <M>{t`r\cos\theta`}</M>.</li>
            </ul>
          </>}
        />
        <Box kind="supplement" title={<T de="Analogie zur Geografie" en="Geography analogy" />}>
          <T
            de={<>
              Auf dem Globus ist <M>\psi</M> die geografische Länge und <M>\theta</M> die <em>Ko</em>-Breite, <M>{t`\theta = 90^\circ - \text{Breite}`}</M>.
              Zürich liegt auf etwa <M>{t`47{,}4^\circ`}</M> N, also ist <M>{t`\theta \approx 42{,}6^\circ`}</M>.
            </>}
            en={<>
              On the globe, <M>\psi</M> is the longitude and <M>\theta</M> is the <em>co</em>-latitude, <M>{t`\theta = 90^\circ - \text{latitude}`}</M>.
              Zürich lies at about <M>{t`47.4^\circ`}</M> N, so <M>{t`\theta \approx 42.6^\circ`}</M>.
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
          de={<ul className="tasks">
            <li>Ändere im zylindrischen Modus nur <M>\varphi</M>. Welche Kurve beschreibt <M>M</M>? (Das wird die <em>Kreisbewegung</em>, S. 11.)</li>
            <li>Setze im sphärischen Modus <M>{t`\theta = 90^\circ`}</M>. In welcher Ebene bist du? Wie gross ist <M>\rho</M> im Vergleich zu <M>r</M>?</li>
            <li>Setze <M>{t`\rho = 0`}</M>. Welche Koordinaten verlieren ihre Bedeutung?</li>
          </ul>}
          en={<ul className="tasks">
            <li>In cylindrical mode, change only <M>\varphi</M>. What curve does <M>M</M> follow? (This will be <em>Kreisbewegung</em>, p. 11.)</li>
            <li>In spherical mode, set <M>{t`\theta = 90^\circ`}</M>. Which plane are you in? What is <M>\rho</M> compared with <M>r</M>?</li>
            <li>Set <M>{t`\rho = 0`}</M>. Which coordinates lose their meaning?</li>
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
            <li><b>Zuerst den Punkt verorten.</b> <M>{t`x<0,\ y>0`}</M>: <M>{t`M_{xy}`}</M> liegt im 2. Quadranten, also muss der Azimut zwischen <M>{t`90^\circ`}</M> und <M>{t`180^\circ`}</M> liegen. <M>{t`z>0`}</M>: oberhalb der <M>xy</M>-Ebene, also <M>{t`\theta < 90^\circ`}</M>.</li>
            <li><M>{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M>.</li>
            <li><M>{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M>: 4. Quadrant, Widerspruch zu Schritt 1. <M>{t`180^\circ`}</M> addieren: <M>{t`\varphi = 135^\circ = 3\pi/4`}</M>.</li>
            <li><M>{t`r = \sqrt{1+1+2} = 2`}</M>.</li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (passt zu Schritt 1). <M>{t`\psi = \varphi = 135^\circ`}</M>.</li>
            <li><b>Kontrolle:</b> <M>{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M> ✓, <M>{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M> ✓, <M>{t`z = 2\cos45^\circ = \sqrt2`}</M> ✓.</li>
          </ol>}
          en={<ol className="steps">
            <li><b>Locate the point first.</b> <M>{t`x<0,\ y>0`}</M>: <M>{t`M_{xy}`}</M> is in the 2nd quadrant, so the azimuth must lie between <M>{t`90^\circ`}</M> and <M>{t`180^\circ`}</M>. <M>{t`z>0`}</M>: above the <M>xy</M>-plane, so <M>{t`\theta < 90^\circ`}</M>.</li>
            <li><M>{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M>.</li>
            <li><M>{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M>: 4th quadrant, contradicts step 1. Add <M>{t`180^\circ`}</M>: <M>{t`\varphi = 135^\circ = 3\pi/4`}</M>.</li>
            <li><M>{t`r = \sqrt{1+1+2} = 2`}</M>.</li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (consistent with step 1). <M>{t`\psi = \varphi = 135^\circ`}</M>.</li>
            <li><b>Check:</b> <M>{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M> ✓, <M>{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M> ✓, <M>{t`z = 2\cos45^\circ = \sqrt2`}</M> ✓.</li>
          </ol>}
        />
        <T
          de={<p>Resultat: <M>{t`(\rho,\varphi,z) = (\sqrt2,\ 3\pi/4,\ \sqrt2)`}</M>, <M>{t`(r,\theta,\psi) = (2,\ \pi/4,\ 3\pi/4)`}</M>. Eine Gewohnheit, die sich lohnt: <em>Vor dem arctan den Quadranten skizzieren.</em></p>}
          en={<p>Result: <M>{t`(\rho,\varphi,z) = (\sqrt2,\ 3\pi/4,\ \sqrt2)`}</M>, <M>{t`(r,\theta,\psi) = (2,\ \pi/4,\ 3\pi/4)`}</M>. Habit worth keeping: <em>sketch the quadrant before using arctan.</em></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="misconceptions" title={<T de="7. Typische Missverständnisse" en="7. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M>\rho</M> und <M>r</M> sind derselbe Abstand.»</>} en={<>“<M>\rho</M> and <M>r</M> are the same distance.”</>} />}>
          <T
            de={<><M>\rho</M> ist der Abstand zur <M>z</M>-<em>Achse</em>, <M>r</M> der Abstand zum <em>Ursprung</em>. Sie stimmen nur in der <M>xy</M>-Ebene überein; allgemein gilt <M>{t`\rho = r\sin\theta \le r`}</M>.</>}
            en={<><M>\rho</M> is the distance from the <M>z</M>-<em>axis</em>, <M>r</M> from the <em>origin</em>. They agree only in the <M>xy</M>-plane; in general <M>{t`\rho = r\sin\theta \le r`}</M>.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>\theta</M> wird von der <M>xy</M>-Ebene aus nach oben gemessen.»</>} en={<>“<M>\theta</M> is measured up from the <M>xy</M>-plane.”</>} />}>
          <T
            de={<>Das wäre die geografische Breite. In diesem Kurs wird <M>\theta</M> von der <M>+z</M>-Achse aus gemessen; Punkte unterhalb der <M>xy</M>-Ebene haben <M>{t`\theta > 90^\circ`}</M>.</>}
            en={<>That would be the geographic latitude. In this course <M>\theta</M> is measured from the <M>+z</M>-axis; points below the <M>xy</M>-plane have <M>{t`\theta > 90^\circ`}</M>.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`(\rho, \varphi, z)`}</M> sind die Komponenten des Ortsvektors.»</>} en={<>“<M>{t`(\rho, \varphi, z)`}</M> are the components of the position vector.”</>} />}>
          <T
            de={<>
              <p>Koordinaten sind keine Vektorkomponenten, und Koordinatentripel kann man nicht wie Vektoren addieren. Gegenbeispiel: Die Punkte
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> und <M>{t`(1, \pi, 0)`}</M> sind kartesisch <M>{t`(1,0,0)`}</M> und <M>{t`(-1,0,0)`}</M>; ihre Vektorsumme ist der Ursprung.
                «Tripel addieren» ergäbe dagegen <M>{t`(2, \pi, 0)`}</M>, also <M>{t`(-2,0,0)`}</M>. Falsch.</p>
              <p>Die Vorlesung kommt auf S. 11 genau darauf zurück: In der zylindrischen Basis hat der Ortsvektor eines Punktes auf einem Kreis die Komponenten <M>{t`(R, 0, z_0)`}</M>,
                und <M>{t`(R, \varphi(t), z_0)`}</M> ist im Skript ausdrücklich als «Falsch!» durchgestrichen. Der Grund folgt in der nächsten Lektion: Der Winkel steckt in der Richtung von <M>{t`\underline{e}_\rho(\varphi)`}</M>.</p>
            </>}
            en={<>
              <p>Coordinates are not vector components, and coordinate triples cannot be added like vectors. Counterexample: the points
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> and <M>{t`(1, \pi, 0)`}</M> are <M>{t`(1,0,0)`}</M> and <M>{t`(-1,0,0)`}</M> in Cartesian coordinates; their vector sum is the origin.
                “Adding the triples” would instead give <M>{t`(2, \pi, 0)`}</M>, i.e. <M>{t`(-2,0,0)`}</M>. Wrong.</p>
              <p>The lecture returns to exactly this point on p. 11: in the cylindrical basis the position vector of a point on a circle has components <M>{t`(R, 0, z_0)`}</M>,
                and <M>{t`(R, \varphi(t), z_0)`}</M> is explicitly crossed out as “Falsch!” in the notes. The reason is in the next lesson: the angle is hidden in the direction of <M>{t`\underline{e}_\rho(\varphi)`}</M>.</p>
            </>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\arctan(y/x)`}</M> liefert immer <M>\varphi</M>.»</>} en={<>“<M>{t`\arctan(y/x)`}</M> always gives <M>\varphi</M>.”</>} />}>
          <T de={<>Nur für <M>{t`x>0`}</M> (R-001). Prüfe immer den Quadranten.</>} en={<>Only for <M>{t`x>0`}</M> (R-001). Always check the quadrant.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="check" title={<T de="8. Überprüfe dein Verständnis" en="8. Check your understanding" />}>
        <Choice
          question={<T
            de={<>Welche Koordinatenlinie durch einen Punkt <M>M</M> (nicht auf der <M>z</M>-Achse) ist in zylindrischen Koordinaten ein Kreis?</>}
            en={<>In cylindrical coordinates, which coordinate line through a point <M>M</M> (not on the <M>z</M>-axis) is a circle?</>} />}
          choices={[
            { text: <T de={<>die <M>\rho</M>-Linie</>} en={<>the <M>\rho</M>-line</>} />,
              why: <T de={<>Wenn man <M>\rho</M> bei festem <M>{t`\varphi, z`}</M> variiert, bewegt sich <M>M</M> radial von der Achse weg: ein gerader Strahl.</>}
                en={<>Varying <M>\rho</M> with <M>{t`\varphi, z`}</M> fixed moves <M>M</M> radially away from the axis: a straight ray.</>} /> },
            { text: <T de={<>die <M>\varphi</M>-Linie</>} en={<>the <M>\varphi</M>-line</>} />, correct: true,
              why: <T de={<>Fest sind <M>\rho</M> und <M>z</M>: alle Punkte im Abstand <M>\rho</M> von der Achse auf der Höhe <M>z</M>, also ein horizontaler Kreis. Deshalb erhält die Geschwindigkeit einen Term <M>{t`\rho\dot\varphi`}</M> (S. 10).</>}
                en={<>Fixed <M>\rho</M> and <M>z</M>: all points at distance <M>\rho</M> from the axis at height <M>z</M>, i.e. a horizontal circle. This is why the velocity will pick up a <M>{t`\rho\dot\varphi`}</M> term (p. 10).</>} /> },
            { text: <T de={<>die <M>z</M>-Linie</>} en={<>the <M>z</M>-line</>} />,
              why: <T de={<>Wenn man nur <M>z</M> variiert, bewegt sich <M>M</M> vertikal: eine Gerade.</>} en={<>Varying only <M>z</M> moves <M>M</M> vertically: a straight line.</>} /> },
            { text: <T de="keine, alle Koordinatenlinien sind gerade" en="none, all coordinate lines are straight" />,
              why: <T de="Das gilt nur für kartesische Koordinaten." en="That is only true for Cartesian coordinates." /> },
          ]}
        />
        <Choice
          question={<T
            de={<>Wie gross ist der zylindrische Winkel <M>\varphi</M> des Punktes <M>{t`(x,y,z) = (0,-2,5)`}</M> in der Konvention <M>{t`0 \le \varphi < 360^\circ`}</M>?</>}
            en={<>What is the cylindrical angle <M>\varphi</M> of the point <M>{t`(x,y,z) = (0,-2,5)`}</M>, using the convention <M>{t`0 \le \varphi < 360^\circ`}</M>?</>} />}
          choices={[
            { text: <M>{t`-90^\circ`}</M>,
              why: <T de={<>Gleiche Richtung, aber ausserhalb des verlangten Bereichs. Addiere <M>{t`360^\circ`}</M>. (Verwendet eine Übung <M>{t`(-180^\circ, 180^\circ]`}</M>, wäre das die Antwort. Prüfe immer die Konvention.)</>}
                en={<>Same direction, but outside the requested range. Add <M>{t`360^\circ`}</M>. (If an exercise uses <M>{t`(-180^\circ, 180^\circ]`}</M>, this would be the answer. Always check the convention.)</>} /> },
            { text: <M>{t`270^\circ`}</M>, correct: true,
              why: <T de={<>Die Projektion des Punktes liegt auf der negativen <M>y</M>-Achse, also <M>{t`270^\circ`}</M> von <M>+x</M> aus. Beachte: <M>{t`\arctan(y/x)`}</M> ist hier nicht definiert, weil <M>{t`x = 0`}</M>.</>}
                en={<>The point's projection lies on the negative <M>y</M>-axis, i.e. <M>{t`270^\circ`}</M> from <M>+x</M>. Note <M>{t`\arctan(y/x)`}</M> is undefined here because <M>{t`x = 0`}</M>.</>} /> },
            { text: <M>{t`90^\circ`}</M>,
              why: <T de={<>Das ist die positive <M>y</M>-Achse.</>} en={<>That is the positive <M>y</M>-axis.</>} /> },
            { text: <T de="nicht definiert" en="undefined" />,
              why: <T de={<>Nicht definiert ist <M>\varphi</M> nur auf der <M>z</M>-Achse (<M>{t`\rho=0`}</M>). Hier ist <M>{t`\rho = 2`}</M>.</>}
                en={<>Undefined only on the <M>z</M>-axis (<M>{t`\rho=0`}</M>). Here <M>{t`\rho = 2`}</M>.</>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>r</M> für <M>{t`(x,y,z) = (2,-3,6)`}</M>.</>} en={<>Compute <M>r</M> for <M>{t`(x,y,z) = (2,-3,6)`}</M>.</>} />}
          value={7}
          explain={<T
            de={<><M>{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M>. Vorzeichen spielen für Abstände keine Rolle.</>}
            en={<><M>{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M>. Signs do not matter for distances.</>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>\theta</M> (in Grad) für <M>{t`(x,y,z) = (1,1,-\sqrt2)`}</M>.</>} en={<>Compute <M>\theta</M> (in degrees) for <M>{t`(x,y,z) = (1,1,-\sqrt2)`}</M>.</>} />}
          value={135} unit="°" tol={0.005}
          explain={<T
            de={<><M>{t`r = 2`}</M>, <M>{t`\cos\theta = z/r = -\sqrt2/2`}</M>, also <M>{t`\theta = 135^\circ`}</M>. Das naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> ist falsch (R-001).</>}
            en={<><M>{t`r = 2`}</M>, <M>{t`\cos\theta = z/r = -\sqrt2/2`}</M>, so <M>{t`\theta = 135^\circ`}</M>. The naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> is wrong (R-001).</>} />}
        />
        <Predict
          prompt={<T
            de={<>Jedes Koordinatensystem hat seinen Namen von einer Fläche «eine Koordinate = const». Welche Fläche ist <M>{t`\theta = \text{const}`}</M>? Und insbesondere <M>{t`\theta = 90^\circ`}</M>?</>}
            en={<>Each coordinate system gets its name from a surface <em>“one coordinate = const”</em>. What surface is <M>{t`\theta = \text{const}`}</M>? And <M>{t`\theta = 90^\circ`}</M> in particular?</>} />}
          answer={<T
            de={<><M>{t`\theta = \text{const}`}</M> ist ein <b>Kegel</b> mit Spitze <M>O</M> um die <M>z</M>-Achse (halber Öffnungswinkel <M>\theta</M>). Für <M>{t`\theta = 90^\circ`}</M> öffnet sich der Kegel zur <b><M>xy</M>-Ebene</b>. Zum Vergleich: <M>{t`r = \text{const}`}</M> ist eine Kugel (→ «sphärisch»), <M>{t`\rho = \text{const}`}</M> ein Zylinder (→ «zylindrisch»).</>}
            en={<><M>{t`\theta = \text{const}`}</M> is a <b>cone</b> with apex <M>O</M> around the <M>z</M>-axis (half-opening angle <M>\theta</M>). For <M>{t`\theta = 90^\circ`}</M> the cone opens up into the <b><M>xy</M>-plane</b>. Compare: <M>{t`r = \text{const}`}</M> is a sphere (→ “spherical”), <M>{t`\rho = \text{const}`}</M> a cylinder (→ “cylindrical”).</>} />}
        />
      </Section>

      {/* ------------------------------------------------------------------ 9 */}
      <Section id="connections" title={<T de="9. Wie es weitergeht" en="9. Where this leads" />}>
        <T
          de={<ul>
            <li><b>Als Nächstes (S. 5):</b> Vektoren, Skalar- und Kreuzprodukt, orthonormierte Basen. Eine Lage wird zu einem Vektor <M>{t`\underline r(t)`}</M>.</li>
            <li><b>S. 6–7:</b> Die zylindrische und die sphärische <em>Basis</em> bestehen aus Einheitsvektoren tangential zu den Koordinatenlinien dieser Lektion; <M>{t`\underline e_\varphi`}</M> ist also tangential zum <M>\varphi</M>-Kreis.</li>
            <li><b>S. 9–10:</b> Weil sich <M>{t`\underline e_\rho`}</M> dreht, wenn sich <M>\varphi</M> ändert, ist die Geschwindigkeit in zylindrischen Koordinaten <M>{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M>.</li>
            <li><b>S. 11 und S. 16:</b> Kreisbewegung heisst «nur <M>\varphi</M> ändert sich»; der Beweis der Vorlesung, dass eine starre Rotation eine Kreisbewegung ist, wird in zylindrischen Koordinaten geführt.</li>
          </ul>}
          en={<ul>
            <li><b>Next (p. 5):</b> vectors, scalar and cross product, orthonormal bases. A position becomes a vector <M>{t`\underline r(t)`}</M>.</li>
            <li><b>pp. 6–7:</b> the cylindrical and spherical <em>bases</em> are unit vectors tangent to the coordinate lines from this lesson, so <M>{t`\underline e_\varphi`}</M> is tangent to the <M>\varphi</M>-circle.</li>
            <li><b>pp. 9–10:</b> because <M>{t`\underline e_\rho`}</M> turns when <M>\varphi</M> changes, velocity in cylindrical coordinates is <M>{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M>.</li>
            <li><b>p. 11 and p. 16:</b> circular motion is “only <M>\varphi</M> changes”; the lecture's proof that rigid rotation is circular motion is done in cylindrical coordinates.</li>
          </ul>}
        />
      </Section>
    </article>
  );
}
