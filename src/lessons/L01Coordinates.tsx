import { Box, De, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { Choice, NumericAnswer, Predict } from '../components/Quiz';
import { CoordinateExplorer } from '../viz/CoordinateExplorer';
import { ArctanDemo } from '../viz/ArctanDemo';
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
              von <M>M</M> auf die <M>x</M>-Achse ist (Fig. 1.4). Negatives <M>x</M> bedeutet, dass <M>{t`M_x`}</M> auf der Seite <M>{t`x'`}</M> liegt.{' '}
              <M>{t`M_{xy}`}</M> ist die Projektion von <M>M</M> auf die <M>xy</M>-Ebene. Wir werden sie ständig verwenden.
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
              perpendicular from <M>M</M> onto the <M>x</M>-axis (Fig. 1.4). Negative <M>x</M> means <M>{t`M_x`}</M> lies on the <M>{t`x'`}</M> side.{' '}
              <M>{t`M_{xy}`}</M> is the projection of <M>M</M> onto the <M>xy</M>-plane. We will use it constantly.
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
              <li><M p=":">\varphi</M> Winkel von der positiven <M>x</M>-Achse zur Strecke <M p=",">{t`OM_{xy}`}</M> gemessen in der <M>xy</M>-Ebene, im Gegenuhrzeigersinn bei Blick von <M p=".">+z</M></li>
              <li><M p=":">z</M> identisch mit dem kartesischen <M p=",">z</M> die Höhe über der <M>xy</M>-Ebene.</li>
            </ul>
          </>}
          en={<>
            <p><b>Meaning of the three numbers.</b></p>
            <ul>
              <li><M p=":">\rho</M> distance of <M>M</M> from the <M>z</M>-<em>axis</em> (= length <M p=").">{t`\overline{OM_{xy}}`}</M> Not the distance from the origin!</li>
              <li><M p=":">\varphi</M> angle from the positive <M>x</M>-axis to the segment <M p=",">{t`OM_{xy}`}</M> measured in the <M>xy</M>-plane, counter-clockwise when looking down from <M p=".">+z</M></li>
              <li><M p=":">z</M> identical to the Cartesian <M p=",">z</M> the height above the <M>xy</M>-plane.</li>
            </ul>
          </>}
        />
        <Derivation title={<M>{t`x = \rho\cos\varphi,\ y = \rho\sin\varphi`}</M>}>
          <StepPlayer
            label={tr('Animation der Herleitung von x = ρ cos φ, y = ρ sin φ', 'Animation of the derivation of x = ρ cos φ, y = ρ sin φ')}
            steps={[
              { ms: 4500, holdMs: 3000, caption: <T
                de={<>Projiziere <M>M</M> senkrecht nach unten auf <M p=".">{t`M_{xy}`}</M> Das ändert <M>x</M> und <M>y</M> nicht; wir können also ganz in der <M>xy</M>-Ebene arbeiten.</>}
                en={<>Project <M>M</M> straight down to <M p=".">{t`M_{xy}`}</M> This does not change <M>x</M> or <M p=",">y</M> so we can work entirely in the <M>xy</M>-plane.</>} /> },
              { ms: 5500, holdMs: 3500, caption: <T
                de={<>Wir schauen von oben auf die <M>xy</M>-Ebene. Darin bilden <M p=",">O</M> <M>{t`M_{xy}`}</M> und der Fusspunkt <M>{t`M_x`}</M> des Lotes von <M>{t`M_{xy}`}</M> auf die <M>x</M>-Achse ein rechtwinkliges Dreieck mit Hypotenuse <M>\rho</M> und Winkel <M>\varphi</M> bei <M p=".">O</M></>}
                en={<>We look down onto the <M>xy</M>-plane. In it, <M p=",">O</M> <M>{t`M_{xy}`}</M> and the foot <M>{t`M_x`}</M> of the perpendicular from <M>{t`M_{xy}`}</M> onto the <M>x</M>-axis form a right triangle with hypotenuse <M>\rho</M> and angle <M>\varphi</M> at <M p=".">O</M></>} /> },
              { ms: 10000, holdMs: 3500, caption: <T
                de={<>Im ersten Quadranten gilt: Ankathete <M p=",">{t`= \rho\cos\varphi = x`}</M> Gegenkathete <M p=".">{t`= \rho\sin\varphi = y`}</M> In den anderen Quadranten zeigt eine Kathete (oder beide) in die negative Achsenrichtung; <M>x</M> und <M>y</M> sind dann ihre Längen mit Vorzeichen. Weil auch <M>\cos</M> und <M>\sin</M> Vorzeichen tragen (Einheitskreis), gilt <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> in allen vier Quadranten. Die Animation lässt <M>\varphi</M> einmal ganz herumlaufen und in jedem Quadranten ein Dreieck stehen.</>}
                en={<>In the first quadrant: adjacent side <M p=",">{t`= \rho\cos\varphi = x`}</M> opposite side <M p=".">{t`= \rho\sin\varphi = y`}</M> In the other quadrants one leg (or both) points in the negative axis direction; <M>x</M> and <M>y</M> are then its length with a sign. Because <M>\cos</M> and <M>\sin</M> carry signs too (unit circle), <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> holds in all four quadrants. The animation sweeps <M>\varphi</M> through one full turn and leaves a triangle behind in each quadrant.</>} /> },
              { ms: 5500, holdMs: 2500, caption: <T
                de={<>Umkehrung: Pythagoras liefert <M p=";">{t`\rho^2 = x^2+y^2`}</M> die Division der beiden Gleichungen liefert <M p=".">{t`\tan\varphi = y/x`}</M></>}
                en={<>Inverse: Pythagoras gives <M p=";">{t`\rho^2 = x^2+y^2`}</M> dividing the two equations gives <M p=".">{t`\tan\varphi = y/x`}</M></>} /> },
              { ms: 8000, caption: <T
                de={<><b>Plausibilitätskontrolle (Grenzfälle).</b> <M p=":">{t`\varphi = 0`}</M> <M p=",">{t`(x,y) = (\rho, 0)`}</M> auf der positiven <M>x</M>-Achse&nbsp;✓. <M p=":">{t`\varphi = \pi/2`}</M> <M p=",">{t`(x,y) = (0, \rho)`}</M> auf der positiven <M>y</M>-Achse&nbsp;✓.</>}
                en={<><b>Sanity check (limiting cases).</b> <M p=":">{t`\varphi = 0`}</M> <M p=",">{t`(x,y) = (\rho, 0)`}</M> on the positive <M>x</M>-axis&nbsp;✓. <M p=":">{t`\varphi = \pi/2`}</M> <M p=",">{t`(x,y) = (0, \rho)`}</M> on the positive <M>y</M>-axis&nbsp;✓.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={cylScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="review" title={<T de={<>R-001 · <M>{t`\varphi = \arctan(y/x)`}</M> stimmt nur für <M>{t`x > 0`}</M></>} en={<>R-001 · <M>{t`\varphi = \arctan(y/x)`}</M> is only correct for <M>{t`x > 0`}</M></>} />}>
          <div className="r001">
            <ArctanDemo />
            <div>
              <T
                de={<>
                  <p>Der <M>\arctan</M> des Taschenrechners liefert nur Winkel zwischen <M>{t`-90^\circ`}</M> und <M p=":">{t`+90^\circ`}</M> Er «kennt» nur die rechte Halbebene.</p>
                  <p>Ein Punkt <M>M</M> links der <M>y</M>-Achse und der gegenüberliegende Punkt <M>{t`(-x,-y)`}</M> haben dasselbe Verhältnis <M p=",">{t`y/x`}</M> der <M>\arctan</M> verwechselt sie.</p>
                  <p><b>Regel:</b> Für <M>{t`x < 0`}</M> addiert man <M p=".">{t`180^\circ`}</M></p>
                </>}
                en={<>
                  <p>The calculator's <M>\arctan</M> only returns angles between <M>{t`-90^\circ`}</M> and <M p=":">{t`+90^\circ`}</M> it only “knows” the right half-plane.</p>
                  <p>A point <M>M</M> left of the <M>y</M>-axis and the opposite point <M>{t`(-x,-y)`}</M> have the same ratio <M p=",">{t`y/x`}</M> so <M>\arctan</M> mixes them up.</p>
                  <p><b>Rule:</b> for <M>{t`x < 0`}</M> add <M p=".">{t`180^\circ`}</M></p>
                </>}
              />
            </div>
          </div>
          <details className="more">
            <summary><T de="Ganz genau: Fallunterscheidung (atan2)" en="In full: all cases (atan2)" /></summary>
            <T
              de={<MD>{t`\varphi = \begin{cases} \arctan(y/x) & x>0 \\ \arctan(y/x) + 180^\circ & x<0 \\ 90^\circ & x = 0,\ y>0 \\ 270^\circ & x=0,\ y<0 \end{cases}\qquad(\text{danach auf } [0^\circ,360^\circ) \text{ reduzieren})`}</MD>}
              en={<MD>{t`\varphi = \begin{cases} \arctan(y/x) & x>0 \\ \arctan(y/x) + 180^\circ & x<0 \\ 90^\circ & x = 0,\ y>0 \\ 270^\circ & x=0,\ y<0 \end{cases}\qquad(\text{then reduce to } [0^\circ,360^\circ))`}</MD>}
            />
            <T
              de={<p>Die Formel im Skript ist die übliche Kurzschreibweise, bei der «den richtigen Quadranten wählen» stillschweigend vorausgesetzt wird. Programmiersprachen haben dafür <code>atan2(y, x)</code>.</p>}
              en={<p>The formula in the notes is the usual shorthand, with “choose the correct quadrant” left implicit. Programming languages provide <code>atan2(y, x)</code> for this.</p>}
            />
          </details>
        </Box>
        <Box kind="supplement" title={<T de={<>Wertebereiche und der Sonderfall auf der <M>z</M>-Achse</>} en={<>Ranges and the special case on the <M>z</M>-axis</>} />}>
          <T
            de={<>
              Die übliche Konvention, die im Skript nicht explizit steht, ist <M p=",">{t`\rho \ge 0`}</M> <M p=",">{t`0 \le \varphi < 2\pi`}</M> <M p=".">{t`z\in\mathbb{R}`}</M>{' '}
              Auf der <M>z</M>-Achse (<M p=")">{t`\rho = 0`}</M> liefert jedes <M>\varphi</M> denselben Punkt; <M>\varphi</M> ist dort also nicht definiert.
              Probier es im Explorer unten aus, indem du <M>{t`\rho = 0`}</M> setzt.
            </>}
            en={<>
              The usual convention, which the notes do not state explicitly, is <M p=",">{t`\rho \ge 0`}</M> <M p=",">{t`0 \le \varphi < 2\pi`}</M> <M p=".">{t`z\in\mathbb{R}`}</M>{' '}
              On the <M>z</M>-axis (<M p=")">{t`\rho = 0`}</M> every <M>\varphi</M> gives the same point, so <M>\varphi</M> is undefined there. Try it in the explorer below by setting <M p=".">{t`\rho = 0`}</M>
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
              <li><b><M>\rho</M>-line</b> (<M>{t`\varphi, z`}</M> fixed): horizontal ray starting at the <M>z</M>-axis and passing through <M p=".">M</M></li>
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
          <T de={<>Bahnkurve von <M>M</M> in sphärischen Koordinaten:</>} en={<>Trajectory of <M>M</M> in spherical coordinates:</>} />{' '}
          <M p=".">{t`r = F_r(t),\ \theta = F_\theta(t),\ \psi = F_\psi(t)`}</M>
        </Box>
        <Box kind="key" title={<T de="Notation in diesem Kurs" en="Notation in this course" />}>
          <T
            de={<>
              Die Vorlesung nennt den sphärischen Azimut <M>\psi</M> (nicht <M p=").">\varphi</M> Geometrisch ist <M>\psi</M> <em>derselbe</em> Winkel wie das zylindrische <M p=".">\varphi</M>{' '}
              <M>\theta</M> wird von der <b>positiven <M>z</M>-Achse</b> aus bis zu <M>{t`\underline{OM}`}</M> gemessen, also gilt <M p=".">{t`0 \le \theta \le \pi`}</M>{' '}
              Viele Physik- und Mathematikbücher verwenden andere Buchstaben oder vertauschen sie. Prüfe immer, welcher Winkel welcher ist, bevor du eine Formel aus einer anderen Quelle übernimmst.
            </>}
            en={<>
              The lecture calls the spherical azimuth <M>\psi</M> (not <M p=").">\varphi</M> Geometrically, <M>\psi</M> is the <em>same</em> angle as the cylindrical <M p=".">\varphi</M>{' '}
              <M>\theta</M> is measured from the <b>positive <M>z</M>-axis</b> down to <M p=",">{t`\underline{OM}`}</M> so <M p=".">{t`0 \le \theta \le \pi`}</M>{' '}
              Many physics and maths books use other letters or swap them. Always check which angle is which before using a formula from elsewhere.
            </>}
          />
        </Box>
        <T
          de={<ul>
            <li><M p=":">r</M> Abstand von <M>M</M> zum <em>Ursprung</em> <M p=".">O</M></li>
            <li><M p=":">\theta</M> Winkel zwischen <M>+z</M> und <M>{t`OM`}</M> (Polarwinkel). <M>{t`\theta=0`}</M> ist der «Nordpol», <M>{t`\theta=\pi/2`}</M> die <M>xy</M>-Ebene, <M>{t`\theta=\pi`}</M> der «Südpol».</li>
            <li><M p=":">\psi</M> Azimut, wie <M>\varphi</M> oben.</li>
          </ul>}
          en={<ul>
            <li><M p=":">r</M> distance of <M>M</M> from the <em>origin</em> <M p=".">O</M></li>
            <li><M p=":">\theta</M> angle between <M>+z</M> and <M>{t`OM`}</M> (polar angle). <M>{t`\theta=0`}</M> is the “north pole”, <M>{t`\theta=\pi/2`}</M> the <M>xy</M>-plane, <M>{t`\theta=\pi`}</M> the “south pole”.</li>
            <li><M p=":">\psi</M> azimuth, as <M>\varphi</M> above.</li>
          </ul>}
        />
        <Derivation title={<T de="die sphärischen Formeln aus den zylindrischen" en="the spherical formulas from the cylindrical ones" />}>
          <StepPlayer
            label={tr('Animation der Herleitung der sphärischen Koordinaten', 'Animation of the derivation of the spherical coordinates')}
            steps={[
              { ms: 5000, holdMs: 3000, caption: <T
                de={<>Betrachte die senkrechte Ebene, die die <M>z</M>-Achse und <M>M</M> enthält. Darin bilden <M p=",">O</M> <M>M</M> und der Fusspunkt <M>{t`M_z`}</M> des Lotes von <M>M</M> auf die <M>z</M>-Achse ein rechtwinkliges Dreieck mit Hypotenuse <M>r</M> und Winkel <M>\theta</M> bei <M p=".">O</M></>}
                en={<>Look at the vertical plane that contains the <M>z</M>-axis and <M p=".">M</M> In it, <M p=",">O</M> <M>M</M> and the foot <M>{t`M_z`}</M> of the perpendicular from <M>M</M> onto the <M>z</M>-axis form a right triangle with hypotenuse <M>r</M> and angle <M>\theta</M> at <M p=".">O</M></>} /> },
              { ms: 10000, holdMs: 4000, caption: <T
                de={<>Wir schauen frontal auf diese Ebene. Kathete entlang der <M>z</M>-Achse: <M p=".">{t`z = r\cos\theta`}</M> Die Kathete senkrecht dazu ist genau der Abstand zur <M>z</M>-Achse: <M p=".">{t`\rho = r\sin\theta`}</M> Für <M>{t`\theta > 90^\circ`}</M> liegt <M>M</M> unterhalb der <M>xy</M>-Ebene: <M>z</M> wird negativ, während <M>{t`\rho = r\sin\theta \ge 0`}</M> bleibt, weil <M p=".">{t`0 \le \theta \le \pi`}</M></>}
                en={<>We look straight at this plane. Side along the <M>z</M>-axis: <M p=".">{t`z = r\cos\theta`}</M> The side perpendicular to it is exactly the distance from the <M>z</M>-axis: <M p=".">{t`\rho = r\sin\theta`}</M> For <M>{t`\theta > 90^\circ`}</M> the point <M>M</M> lies below the <M>xy</M>-plane: <M>z</M> becomes negative, while <M>{t`\rho = r\sin\theta \ge 0`}</M> stays non-negative because <M p=".">{t`0 \le \theta \le \pi`}</M></>} /> },
              { ms: 9000, holdMs: 4000, caption: <T
                de={<>Senkrecht nach unten projiziert, ist die Kathete <M>\rho</M> genau die Strecke <M p=".">{t`OM_{xy}`}</M> Von oben gesehen gilt deshalb wie bei den Zylinderkoordinaten <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> mit <M p=".">{t`\varphi = \psi`}</M> Einsetzen von <M>{t`\rho = r\sin\theta`}</M> ergibt
                  <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi.`}</MD></>}
                en={<>Projected straight down, the side <M>\rho</M> is exactly the segment <M p=".">{t`OM_{xy}`}</M> Seen from above, therefore, as for cylindrical coordinates, <M p=",">{t`x = \rho\cos\varphi`}</M> <M>{t`y = \rho\sin\varphi`}</M> with <M p=".">{t`\varphi = \psi`}</M> Inserting <M>{t`\rho = r\sin\theta`}</M> gives
                  <MD>{t`x = r\sin\theta\cos\psi,\qquad y = r\sin\theta\sin\psi.`}</MD></>} /> },
              { ms: 7000, holdMs: 3000, caption: <T
                de={<>Konsistenzkontrolle: <M>{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M>&nbsp;✓. Geometrisch ist das zweimal Pythagoras: im Boden <M p=",">{t`\rho^2 = x^2+y^2`}</M> im senkrechten Dreieck <M p=".">{t`r^2 = \rho^2 + z^2`}</M></>}
                en={<>Consistency check: <M>{t`x^2+y^2+z^2 = r^2\sin^2\theta(\cos^2\psi+\sin^2\psi) + r^2\cos^2\theta = r^2`}</M>&nbsp;✓. Geometrically this is Pythagoras twice: in the floor <M p=",">{t`\rho^2 = x^2+y^2`}</M> in the vertical triangle <M p=".">{t`r^2 = \rho^2 + z^2`}</M></>} /> },
              { ms: 4500, caption: <T
                de={<>Umkehrung: Aus Schritt 2 folgt <M p=".">{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M></>}
                en={<>Inverse: from step 2, <M p=".">{t`\tan\theta = \rho/z = \sqrt{x^2+y^2}/z`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={sphScene} step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="review" title={<T de={<>R-001 · dasselbe bei <M>\theta</M></>} en={<>R-001 · the same for <M>\theta</M></>} />}>
          <T
            de={<p><M>{t`\theta = \arctan\big(\sqrt{x^2+y^2}/z\big)`}</M> stimmt nur oberhalb der <M>xy</M>-Ebene <M p=".">{t`(z > 0)`}</M> Immer richtig ist <M p=",">{t`\theta = \arccos(z/r)`}</M> denn <M>\arccos</M> liefert genau die Winkel von <M>{t`0^\circ`}</M> bis <M p=".">{t`180^\circ`}</M> (In der Animation oben: für <M>{t`\theta > 90^\circ`}</M> wird <M>z</M> negativ.)</p>}
            en={<p><M>{t`\theta = \arctan\big(\sqrt{x^2+y^2}/z\big)`}</M> is only correct above the <M>xy</M>-plane <M p=".">{t`(z > 0)`}</M> Always correct is <M p=",">{t`\theta = \arccos(z/r)`}</M> because <M>\arccos</M> returns exactly the angles from <M>{t`0^\circ`}</M> to <M p=".">{t`180^\circ`}</M> (In the animation above: for <M p=",">{t`\theta > 90^\circ`}</M> <M>z</M> becomes negative.)</p>}
          />
        </Box>
        <T
          de={<>
            <h3>Koordinatenlinien</h3>
            <ul>
              <li><b><M>r</M>-Linie</b>: Strahl von <M>O</M> durch <M p=".">M</M></li>
              <li><b><M>\theta</M>-Linie</b>: Meridian, ein halber Grosskreis mit Radius <M>r</M> vom Nord- zum Südpol, durch <M p=".">M</M></li>
              <li><b><M>\psi</M>-Linie</b>: Breitenkreis, ein horizontaler Kreis mit Radius <M>{t`r\sin\theta`}</M> auf der Höhe <M p=".">{t`r\cos\theta`}</M></li>
            </ul>
          </>}
          en={<>
            <h3>Coordinate lines</h3>
            <ul>
              <li><b><M>r</M>-line</b>: ray from <M>O</M> through <M p=".">M</M></li>
              <li><b><M>\theta</M>-line</b>: meridian, half of a great circle of radius <M>r</M> from the north to the south pole, through <M p=".">M</M></li>
              <li><b><M>\psi</M>-line</b>: circle of latitude, a horizontal circle of radius <M>{t`r\sin\theta`}</M> at height <M p=".">{t`r\cos\theta`}</M></li>
            </ul>
          </>}
        />
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
          de={<ul className="tasks">
            <li>Ändere im zylindrischen Modus nur <M p=".">\varphi</M> Welche Kurve beschreibt <M p="?">M</M> (Das wird die <em>Kreisbewegung</em>, S. 11.)</li>
            <li>Setze im sphärischen Modus <M p=".">{t`\theta = 90^\circ`}</M> In welcher Ebene bist du? Wie gross ist <M>\rho</M> im Vergleich zu <M p="?">r</M></li>
            <li>Setze <M p=".">{t`\rho = 0`}</M> Welche Koordinaten verlieren ihre Bedeutung?</li>
          </ul>}
          en={<ul className="tasks">
            <li>In cylindrical mode, change only <M p=".">\varphi</M> What curve does <M>M</M> follow? (This will be <em>Kreisbewegung</em>, p. 11.)</li>
            <li>In spherical mode, set <M p=".">{t`\theta = 90^\circ`}</M> Which plane are you in? What is <M>\rho</M> compared with <M p="?">r</M></li>
            <li>Set <M p=".">{t`\rho = 0`}</M> Which coordinates lose their meaning?</li>
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
            <li><b>Zuerst den Punkt verorten.</b> <M p=":">{t`x<0,\ y>0`}</M> <M>{t`M_{xy}`}</M> liegt im 2. Quadranten, also muss der Azimut zwischen <M>{t`90^\circ`}</M> und <M>{t`180^\circ`}</M> liegen. <M p=":">{t`z>0`}</M> oberhalb der <M>xy</M>-Ebene, also <M p=".">{t`\theta < 90^\circ`}</M></li>
            <li><M p=".">{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M></li>
            <li><M p=":">{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M> 4. Quadrant, Widerspruch zu Schritt 1. <M>{t`180^\circ`}</M> addieren: <M p=".">{t`\varphi = 135^\circ = 3\pi/4`}</M></li>
            <li><M p=".">{t`r = \sqrt{1+1+2} = 2`}</M></li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (passt zu Schritt 1). <M p=".">{t`\psi = \varphi = 135^\circ`}</M></li>
            <li><b>Kontrolle:</b> <M>{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M>&nbsp;✓, <M>{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M>&nbsp;✓, <M>{t`z = 2\cos45^\circ = \sqrt2`}</M>&nbsp;✓.</li>
          </ol>}
          en={<ol className="steps">
            <li><b>Locate the point first.</b> <M p=":">{t`x<0,\ y>0`}</M> <M>{t`M_{xy}`}</M> is in the 2nd quadrant, so the azimuth must lie between <M>{t`90^\circ`}</M> and <M p=".">{t`180^\circ`}</M> <M p=":">{t`z>0`}</M> above the <M>xy</M>-plane, so <M p=".">{t`\theta < 90^\circ`}</M></li>
            <li><M p=".">{t`\rho = \sqrt{(-1)^2+1^2} = \sqrt 2`}</M></li>
            <li><M p=":">{t`\arctan(y/x) = \arctan(-1) = -45^\circ`}</M> 4th quadrant, contradicts step 1. Add <M p=":">{t`180^\circ`}</M> <M p=".">{t`\varphi = 135^\circ = 3\pi/4`}</M></li>
            <li><M p=".">{t`r = \sqrt{1+1+2} = 2`}</M></li>
            <li><M>{t`\cos\theta = z/r = \sqrt2/2 \Rightarrow \theta = 45^\circ`}</M> (consistent with step 1). <M p=".">{t`\psi = \varphi = 135^\circ`}</M></li>
            <li><b>Check:</b> <M>{t`x = 2\sin45^\circ\cos135^\circ = 2\cdot\tfrac{\sqrt2}{2}\cdot\left(-\tfrac{\sqrt2}{2}\right) = -1`}</M>&nbsp;✓, <M>{t`y = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2} = 1`}</M>&nbsp;✓, <M>{t`z = 2\cos45^\circ = \sqrt2`}</M>&nbsp;✓.</li>
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
            de={<><M>\rho</M> ist der Abstand zur <M>z</M>-<em>Achse</em>, <M>r</M> der Abstand zum <em>Ursprung</em>. Sie stimmen nur in der <M>xy</M>-Ebene überein; allgemein gilt <M p=".">{t`\rho = r\sin\theta \le r`}</M></>}
            en={<><M>\rho</M> is the distance from the <M>z</M>-<em>axis</em>, <M>r</M> from the <em>origin</em>. They agree only in the <M>xy</M>-plane; in general <M p=".">{t`\rho = r\sin\theta \le r`}</M></>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>\theta</M> wird von der <M>xy</M>-Ebene aus nach oben gemessen.»</>} en={<>“<M>\theta</M> is measured up from the <M>xy</M>-plane.”</>} />}>
          <T
            de={<>Das wäre die geografische Breite. In diesem Kurs wird <M>\theta</M> von der <M>+z</M>-Achse aus gemessen; Punkte unterhalb der <M>xy</M>-Ebene haben <M p=".">{t`\theta > 90^\circ`}</M></>}
            en={<>That would be the geographic latitude. In this course <M>\theta</M> is measured from the <M>+z</M>-axis; points below the <M>xy</M>-plane have <M p=".">{t`\theta > 90^\circ`}</M></>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`(\rho, \varphi, z)`}</M> sind die Komponenten des Ortsvektors.»</>} en={<>“<M>{t`(\rho, \varphi, z)`}</M> are the components of the position vector.”</>} />}>
          <T
            de={<>
              <p>Koordinaten sind keine Vektorkomponenten, und Koordinatentripel kann man nicht wie Vektoren addieren. Gegenbeispiel: Die Punkte
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> und <M>{t`(1, \pi, 0)`}</M> sind kartesisch <M>{t`(1,0,0)`}</M> und <M p=";">{t`(-1,0,0)`}</M> ihre Vektorsumme ist der Ursprung.
                «Tripel addieren» ergäbe dagegen <M p=",">{t`(2, \pi, 0)`}</M> also <M p=".">{t`(-2,0,0)`}</M> Falsch.</p>
              <p>Die Vorlesung kommt auf S. 11 genau darauf zurück: In der zylindrischen Basis hat der Ortsvektor eines Punktes auf einem Kreis die Komponenten <M p=",">{t`(R, 0, z_0)`}</M>{' '}
                und <M>{t`(R, \varphi(t), z_0)`}</M> ist im Skript ausdrücklich als «Falsch!» durchgestrichen. Der Grund folgt in der nächsten Lektion: Der Winkel steckt in der Richtung von <M p=".">{t`\underline{e}_\rho(\varphi)`}</M></p>
            </>}
            en={<>
              <p>Coordinates are not vector components, and coordinate triples cannot be added like vectors. Counterexample: the points
                {' '}<M>{t`(\rho,\varphi,z) = (1, 0, 0)`}</M> and <M>{t`(1, \pi, 0)`}</M> are <M>{t`(1,0,0)`}</M> and <M>{t`(-1,0,0)`}</M> in Cartesian coordinates; their vector sum is the origin.
                “Adding the triples” would instead give <M p=",">{t`(2, \pi, 0)`}</M> i.e. <M p=".">{t`(-2,0,0)`}</M> Wrong.</p>
              <p>The lecture returns to exactly this point on p. 11: in the cylindrical basis the position vector of a point on a circle has components <M p=",">{t`(R, 0, z_0)`}</M>{' '}
                and <M>{t`(R, \varphi(t), z_0)`}</M> is explicitly crossed out as “Falsch!” in the notes. The reason is in the next lesson: the angle is hidden in the direction of <M p=".">{t`\underline{e}_\rho(\varphi)`}</M></p>
            </>}
          />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\arctan(y/x)`}</M> liefert immer <M p=".">\varphi</M>»</>} en={<>“<M>{t`\arctan(y/x)`}</M> always gives <M p=".">\varphi</M>”</>} />}>
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
              why: <T de={<>Fest sind <M>\rho</M> und <M p=":">z</M> alle Punkte im Abstand <M>\rho</M> von der Achse auf der Höhe <M p=",">z</M> also ein horizontaler Kreis. Deshalb erhält die Geschwindigkeit einen Term <M>{t`\rho\dot\varphi`}</M> (S. 10).</>}
                en={<>Fixed <M>\rho</M> and <M p=":">z</M> all points at distance <M>\rho</M> from the axis at height <M p=",">z</M> i.e. a horizontal circle. This is why the velocity will pick up a <M>{t`\rho\dot\varphi`}</M> term (p. 10).</>} /> },
            { text: <T de={<>die <M>z</M>-Linie</>} en={<>the <M>z</M>-line</>} />,
              why: <T de={<>Wenn man nur <M>z</M> variiert, bewegt sich <M>M</M> vertikal: eine Gerade.</>} en={<>Varying only <M>z</M> moves <M>M</M> vertically: a straight line.</>} /> },
            { text: <T de="keine, alle Koordinatenlinien sind gerade" en="none, all coordinate lines are straight" />,
              why: <T de="Das gilt nur für kartesische Koordinaten." en="That is only true for Cartesian coordinates." /> },
          ]}
        />
        <Choice
          question={<T
            de={<>Wie gross ist der zylindrische Winkel <M>\varphi</M> des Punktes <M>{t`(x,y,z) = (0,-2,5)`}</M> in der Konvention <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>}
            en={<>What is the cylindrical angle <M>\varphi</M> of the point <M p=",">{t`(x,y,z) = (0,-2,5)`}</M> using the convention <M p="?">{t`0 \le \varphi < 360^\circ`}</M></>} />}
          choices={[
            { text: <M>{t`-90^\circ`}</M>,
              why: <T de={<>Gleiche Richtung, aber ausserhalb des verlangten Bereichs. Addiere <M p=".">{t`360^\circ`}</M> (Verwendet eine Übung <M p=",">{t`(-180^\circ, 180^\circ]`}</M> wäre das die Antwort. Prüfe immer die Konvention.)</>}
                en={<>Same direction, but outside the requested range. Add <M p=".">{t`360^\circ`}</M> (If an exercise uses <M p=",">{t`(-180^\circ, 180^\circ]`}</M> this would be the answer. Always check the convention.)</>} /> },
            { text: <M>{t`270^\circ`}</M>, correct: true,
              why: <T de={<>Die Projektion des Punktes liegt auf der negativen <M>y</M>-Achse, also <M>{t`270^\circ`}</M> von <M>+x</M> aus. Beachte: <M>{t`\arctan(y/x)`}</M> ist hier nicht definiert, weil <M p=".">{t`x = 0`}</M></>}
                en={<>The point's projection lies on the negative <M>y</M>-axis, i.e. <M>{t`270^\circ`}</M> from <M p=".">+x</M> Note <M>{t`\arctan(y/x)`}</M> is undefined here because <M p=".">{t`x = 0`}</M></>} /> },
            { text: <M>{t`90^\circ`}</M>,
              why: <T de={<>Das ist die positive <M>y</M>-Achse.</>} en={<>That is the positive <M>y</M>-axis.</>} /> },
            { text: <T de="nicht definiert" en="undefined" />,
              why: <T de={<>Nicht definiert ist <M>\varphi</M> nur auf der <M>z</M>-Achse (<M p=").">{t`\rho=0`}</M> Hier ist <M p=".">{t`\rho = 2`}</M></>}
                en={<>Undefined only on the <M>z</M>-axis (<M p=").">{t`\rho=0`}</M> Here <M p=".">{t`\rho = 2`}</M></>} /> },
          ]}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>r</M> für <M p=".">{t`(x,y,z) = (2,-3,6)`}</M></>} en={<>Compute <M>r</M> for <M p=".">{t`(x,y,z) = (2,-3,6)`}</M></>} />}
          value={7}
          explain={<T
            de={<><M p=".">{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M> Vorzeichen spielen für Abstände keine Rolle.</>}
            en={<><M p=".">{t`r = \sqrt{4+9+36} = \sqrt{49} = 7`}</M> Signs do not matter for distances.</>} />}
        />
        <NumericAnswer
          question={<T de={<>Berechne <M>\theta</M> (in Grad) für <M p=".">{t`(x,y,z) = (1,1,-\sqrt2)`}</M></>} en={<>Compute <M>\theta</M> (in degrees) for <M p=".">{t`(x,y,z) = (1,1,-\sqrt2)`}</M></>} />}
          value={135} unit="°" tol={0.005}
          explain={<T
            de={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> also <M p=".">{t`\theta = 135^\circ`}</M> Das naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> ist falsch (R-001).</>}
            en={<><M p=",">{t`r = 2`}</M> <M p=",">{t`\cos\theta = z/r = -\sqrt2/2`}</M> so <M p=".">{t`\theta = 135^\circ`}</M> The naive <M>{t`\arctan(\sqrt2/(-\sqrt2)) = -45^\circ`}</M> is wrong (R-001).</>} />}
        />
        <Predict
          prompt={<T
            de={<>Jedes Koordinatensystem hat seinen Namen von einer Fläche «<M>{t`\text{eine Koordinate} = \text{const}`}</M>». Welche Fläche ist <M p="?">{t`\theta = \text{const}`}</M> Und insbesondere <M p="?">{t`\theta = 90^\circ`}</M></>}
            en={<>Each coordinate system gets its name from a surface “<M>{t`\text{one coordinate} = \text{const}`}</M>”. What surface is <M p="?">{t`\theta = \text{const}`}</M> And <M>{t`\theta = 90^\circ`}</M> in particular?</>} />}
          answer={<T
            de={<><M>{t`\theta = \text{const}`}</M> ist ein <b>Kegel</b> mit Spitze <M>O</M> um die <M>z</M>-Achse (halber Öffnungswinkel <M p=").">\theta</M> Für <M>{t`\theta = 90^\circ`}</M> öffnet sich der Kegel zur <b><M>xy</M>-Ebene</b>. Zum Vergleich: <M>{t`r = \text{const}`}</M> ist eine Kugel (→ «sphärisch»), <M>{t`\rho = \text{const}`}</M> ein Zylinder (→ «zylindrisch»).</>}
            en={<><M>{t`\theta = \text{const}`}</M> is a <b>cone</b> with apex <M>O</M> around the <M>z</M>-axis (half-opening angle <M p=").">\theta</M> For <M>{t`\theta = 90^\circ`}</M> the cone opens up into the <b><M>xy</M>-plane</b>. Compare: <M>{t`r = \text{const}`}</M> is a sphere (→ “spherical”), <M>{t`\rho = \text{const}`}</M> a cylinder (→ “cylindrical”).</>} />}
        />
      </Section>

      {/* ------------------------------------------------------------------ 9 */}
      <Section id="connections" title={<T de="9. Wie es weitergeht" en="9. Where this leads" />}>
        <T
          de={<ul>
            <li><b>Als Nächstes (S. 5):</b> Vektoren, Skalar- und Kreuzprodukt, orthonormierte Basen. Eine Lage wird zu einem Vektor <M p=".">{t`\underline r(t)`}</M></li>
            <li><b>S. 6–7:</b> Die zylindrische und die sphärische <em>Basis</em> bestehen aus Einheitsvektoren tangential zu den Koordinatenlinien dieser Lektion; <M>{t`\underline e_\varphi`}</M> ist also tangential zum <M>\varphi</M>-Kreis.</li>
            <li><b>S. 9–10:</b> Weil sich <M>{t`\underline e_\rho`}</M> dreht, wenn sich <M>\varphi</M> ändert, ist die Geschwindigkeit in zylindrischen Koordinaten <M p=".">{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M></li>
            <li><b>S. 11 und S. 16:</b> Kreisbewegung heisst «nur <M>\varphi</M> ändert sich»; der Beweis der Vorlesung, dass eine starre Rotation eine Kreisbewegung ist, wird in zylindrischen Koordinaten geführt.</li>
          </ul>}
          en={<ul>
            <li><b>Next (p. 5):</b> vectors, scalar and cross product, orthonormal bases. A position becomes a vector <M p=".">{t`\underline r(t)`}</M></li>
            <li><b>pp. 6–7:</b> the cylindrical and spherical <em>bases</em> are unit vectors tangent to the coordinate lines from this lesson, so <M>{t`\underline e_\varphi`}</M> is tangent to the <M>\varphi</M>-circle.</li>
            <li><b>pp. 9–10:</b> because <M>{t`\underline e_\rho`}</M> turns when <M>\varphi</M> changes, velocity in cylindrical coordinates is <M p=".">{t`\dot\rho\,\underline e_\rho + \rho\dot\varphi\,\underline e_\varphi + \dot z\,\underline e_z`}</M></li>
            <li><b>p. 11 and p. 16:</b> circular motion is “only <M>\varphi</M> changes”; the lecture's proof that rigid rotation is circular motion is done in cylindrical coordinates.</li>
          </ul>}
        />
      </Section>
    </article>
  );
}
