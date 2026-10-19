import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { velScene } from '../viz/anim/velScene';
import { HelixVelocity, SecantDemo } from '../viz/VelocityFigures';

const t = String.raw;

export default function L04Velocity() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher wussten wir, <em>wo</em> ein Punkt ist. Jetzt geht es darum, <em>wie schnell</em> und <em>wohin</em> er sich bewegt.</p>}
        en={<p className="lede">So far we knew <em>where</em> a point is. Now the question is <em>how fast</em> and <em>where to</em> it moves.</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Stell dir ein Auto auf einer kurvigen Strasse vor. Zwei Dinge beschreiben seine Bewegung in jedem Moment:</p>
            <ul>
              <li><b>Wie schnell?</b> Das zeigt der Tacho – eine Zahl. In der Vorlesung heisst sie <b>Schnelligkeit</b> <M p=".">{t`\dot s`}</M></li>
              <li><b>Wohin?</b> Die Richtung, in die das Auto gerade fährt – immer entlang der Strasse. Das ist ein Pfeil der Länge 1, <M p=".">{t`\v\tau`}</M></li>
            </ul>
            <p>Beides zusammen ist der <b>Geschwindigkeitsvektor</b> <M p=":">{t`\v v = \dot s\,\v\tau`}</M> ein Pfeil in Fahrtrichtung, so lang wie das Tempo. Diese Lektion zeigt, woher diese Formel kommt.</p>
          </>}
          en={<>
            <p>Picture a car on a winding road. Two things describe its motion at every moment:</p>
            <ul>
              <li><b>How fast?</b> The speedometer shows it – a number. The lecture calls it the <b>speed</b> <M p=".">{t`\dot s`}</M></li>
              <li><b>Where to?</b> The direction the car is heading – always along the road. That is an arrow of length 1, <M p=".">{t`\v\tau`}</M></li>
            </ul>
            <p>Together they make the <b>velocity vector</b> <M p=":">{t`\v v = \dot s\,\v\tau`}</M> an arrow pointing along the road, as long as the speed. This lesson shows where this formula comes from.</p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="geradlinig" title={<T de="1. Zuerst auf einer Geraden" en="1. First on a straight line" />}>
        <Box kind="lecture" src={<Src p={8} />}>
          <T de={<>Geradlinige Bewegung: <M p=":">{t`x(t)`}</M> skalare Funktion.</>} en={<>Rectilinear motion: <M p=":">{t`x(t)`}</M> a scalar function.</>} />
          <MD>{t`v = \frac{\dd x(t)}{\dd t} = \dot x = \lim_{\Delta t\to 0}\frac{x(t+\Delta t) - x(t)}{\Delta t}`}</MD>
        </Box>
        <T
          de={<>
            <p><M>{t`x(t)`}</M> sagt, wie weit <M>M</M> zur Zeit <M>t</M> vom Startpunkt <M>A</M> entfernt ist.</p>
            <p><b>Mittlere Geschwindigkeit.</b> In der kurzen Zeit <M>{t`\Delta t`}</M> kommt der Punkt um <M>{t`\Delta x = x(t+\Delta t) - x(t)`}</M> weiter. Weg durch Zeit, <M p=",">{t`\Delta x/\Delta t`}</M> ist die mittlere Geschwindigkeit. Beispiel: 100 m in 10 s ergibt 10 m/s.</p>
            <p><b>Momentane Geschwindigkeit.</b> Ein Durchschnitt verwischt, was <em>genau jetzt</em> passiert. Deshalb macht man die Zeitspanne <M>{t`\Delta t`}</M> immer kürzer. Der Wert, dem sich <M>{t`\Delta x/\Delta t`}</M> dabei nähert, ist die Geschwindigkeit <M>{t`\dot x`}</M> im Moment <M p=".">t</M> Das bedeutet «<M>{t`\lim_{\Delta t\to0}`}</M>».</p>
            <p>Im Bild unten: <M>{t`\Delta x/\Delta t`}</M> ist die Steigung der blauen Linie (Sekante). Ziehst du <M>{t`\Delta t`}</M> nach rechts gegen null, wird sie zur roten Linie (Tangente). Deren Steigung ist <M p=".">{t`\dot x`}</M> Der Punkt über einem Buchstaben heisst immer: Ableitung nach der Zeit.</p>
          </>}
          en={<>
            <p><M>{t`x(t)`}</M> says how far <M>M</M> is from the starting point <M>A</M> at time <M p=".">t</M></p>
            <p><b>Mean velocity.</b> In the short time <M>{t`\Delta t`}</M> the point moves on by <M p=".">{t`\Delta x = x(t+\Delta t) - x(t)`}</M> Distance divided by time, <M p=",">{t`\Delta x/\Delta t`}</M> is the mean velocity. Example: 100 m in 10 s gives 10 m/s.</p>
            <p><b>Instantaneous velocity.</b> An average blurs what happens <em>right now</em>. So the time span <M>{t`\Delta t`}</M> is made shorter and shorter. The value that <M>{t`\Delta x/\Delta t`}</M> approaches is the velocity <M>{t`\dot x`}</M> at the moment <M p=".">t</M> That is what “<M>{t`\lim_{\Delta t\to0}`}</M>” means.</p>
            <p>In the figure below: <M>{t`\Delta x/\Delta t`}</M> is the slope of the blue line (secant). Drag <M>{t`\Delta t`}</M> to the right towards zero and it becomes the red line (tangent). Its slope is <M p=".">{t`\dot x`}</M> A dot over a letter always means: derivative with respect to time.</p>
          </>}
        />
        <SecantDemo />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="raum" title={<T de="2. Im Raum: was wir suchen" en="2. In space: what we are looking for" />}>
        <Box kind="lecture" src={<Src p={8} />}>
          <T
            de={<ul>
              <li>Gesucht für 3D-Bewegung: <M p=".">{t`\v v \Longleftrightarrow \v r(t)`}</M></li>
              <li><b>Geschwindigkeitsvektor</b> <M p=":">{t`\v v`}</M> liegt tangential an der Bahnkurve.</li>
              <li>Zu zeigen: <M>{t`\v v = \dot{\v r} = (\dot x(t), \dot y(t), \dot z(t))`}</M> für die kartesische Basis.</li>
            </ul>}
            en={<ul>
              <li>Wanted for 3D motion: <M p=".">{t`\v v \Longleftrightarrow \v r(t)`}</M></li>
              <li><b>Velocity vector</b> (<em lang="de">Geschwindigkeitsvektor</em>) <M p=":">{t`\v v`}</M> lies tangent to the trajectory.</li>
              <li>To show: <M>{t`\v v = \dot{\v r} = (\dot x(t), \dot y(t), \dot z(t))`}</M> for the Cartesian basis.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>In Worten: Wir kennen die Bahn, also <M>{t`\v r(t)`}</M> für jede Zeit. Daraus wollen wir <M>{t`\v v`}</M> bekommen. Die Vorlesung behauptet zweierlei: <M>{t`\v v`}</M> zeigt immer entlang der Bahn («tangential»), und rechnen kann man es ganz einfach – jede Koordinate nach der Zeit ableiten. Beides zeigen wir jetzt.</p>}
          en={<p>In words: we know the path, i.e. <M>{t`\v r(t)`}</M> for every time. From it we want <M p=".">{t`\v v`}</M> The lecture claims two things: <M>{t`\v v`}</M> always points along the path (“tangent”), and computing it is easy – differentiate each coordinate with respect to time. We show both now.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vektor" title={<T de={<>3. Warum <M>{t`\v v`}</M> entlang der Bahn zeigt</>} en={<>3. Why <M>{t`\v v`}</M> points along the path</>} />}>
        <Box kind="lecture" src={<Src p={8} fig="§2.1" />}>
          <T de={<><b>Schnelligkeit</b> <M p=":">{t`\dot s`}</M></>} en={<><b>Speed</b> (<em lang="de">Schnelligkeit</em>) <M p=":">{t`\dot s`}</M></>} />
          <MD>{t`\dot s = \lim_{\Delta t\to0}\frac{s(t+\Delta t) - s(t)}{\Delta t} = \lim_{\Delta t\to 0}\frac{\Delta s}{\Delta t}, \qquad \v v = \dot s\cdot\v\tau`}</MD>
          <T de={<><M p=":">{t`\dot s`}</M> Wie schnell? <M p=":">{t`\v\tau`}</M> In welche Richtung? (<M>{t`\v\tau`}</M> tangentialer Einheitsvektor, <M>s</M> Bogenlänge.)</>} en={<><M p=":">{t`\dot s`}</M> how fast? <M p=":">{t`\v\tau`}</M> in which direction? (<M>{t`\v\tau`}</M> tangent unit vector, <M>s</M> arc length, <em lang="de">Bogenlänge</em>.)</>} />
        </Box>
        <T
          de={<p>Die <b>Bogenlänge</b> <M>{t`s(t)`}</M> ist der Kilometerzähler: wie viel Weg der Punkt <em>entlang der Kurve</em> schon zurückgelegt hat. Dann ist <M>{t`\dot s`}</M> genau wie auf der Geraden «Weg pro Zeit» – die Schnelligkeit, die der Tacho zeigt. Die Animation zeigt Schritt für Schritt, warum der Geschwindigkeitspfeil an der Kurve anliegt.</p>}
          en={<p>The <b>arc length</b> <M>{t`s(t)`}</M> is the odometer: how much distance the point has already covered <em>along the curve</em>. Then <M>{t`\dot s`}</M> is, just like on the straight line, “distance per time” – the speed the speedometer shows. The animation shows step by step why the velocity arrow lies along the curve.</p>}
        />
        <Derivation title={<T de={<><M>{t`\v v = \dot s\,\v\tau`}</M> Schritt für Schritt (S. 8–9)</>} en={<><M>{t`\v v = \dot s\,\v\tau`}</M> step by step (pp. 8–9)</>} />}>
          <StepPlayer
            label={tr('Animation: vom Differenzenquotienten zum Geschwindigkeitsvektor', 'Animation: from the difference quotient to the velocity vector')}
            steps={[
              { ms: 4500, caption: <T
                de={<>Der Punkt fährt auf der grauen <b>Bahnkurve</b>. Zur Zeit <M>t</M> ist er in <M p=".">M</M> Der schwarze Pfeil <M>{t`\v r(t)`}</M> zeigt von <M>O</M> nach <M p=".">M</M> Türkis: das Stück Kurve, das er schon gefahren ist – seine Länge ist <M p=".">{t`s(t)`}</M></>}
                en={<>The point travels on the grey <b>trajectory</b>. At time <M>t</M> it is at <M p=".">M</M> The black arrow <M>{t`\v r(t)`}</M> points from <M>O</M> to <M p=".">M</M> Teal: the piece of curve it has already covered – its length is <M p=".">{t`s(t)`}</M></>} /> },
              { ms: 3000, holdMs: 3000, caption: <T
                de={<>Ein kleines bisschen später (Zeit <M p=")">{t`t+\Delta t`}</M> ist der Punkt weiter (Kreis). Der blaue Pfeil <M>{t`\Delta\v r`}</M> zeigt von der alten zur neuen Lage: <M p=".">{t`\Delta\v r = \v r(t+\Delta t) - \v r(t)`}</M> Gefahren ist er dabei das gebogene Stück <M p=".">{t`\Delta s`}</M></>}
                en={<>A tiny bit later (time <M p=")">{t`t+\Delta t`}</M> the point has moved on (circle). The blue arrow <M>{t`\Delta\v r`}</M> points from the old to the new position: <M p=".">{t`\Delta\v r = \v r(t+\Delta t) - \v r(t)`}</M> Along the way it covered the curved piece <M p=".">{t`\Delta s`}</M></>} /> },
              { ms: 7000, holdMs: 3000, caption: <T
                de={<>Jetzt wird <M>{t`\Delta t`}</M> immer kleiner, die neue Lage rückt an <M>M</M> heran. Der blaue Pfeil <M>{t`\Delta\v r`}</M> legt sich an die Kurve an und wird so lang wie das gebogene Stück (Kasten: <M p=").">{t`|\Delta\v r|/\Delta s \to 1`}</M> Der rote Pfeil <M>{t`\Delta\v r/\Delta t`}</M> wird dabei zur Geschwindigkeit <M p=".">{t`\dot{\v r}`}</M></>}
                en={<>Now <M>{t`\Delta t`}</M> gets smaller and smaller, the new position moves up to <M p=".">M</M> The blue arrow <M>{t`\Delta\v r`}</M> snuggles up to the curve and becomes as long as the curved piece (box: <M p=").">{t`|\Delta\v r|/\Delta s \to 1`}</M> The red arrow <M>{t`\Delta\v r/\Delta t`}</M> becomes the velocity <M p=".">{t`\dot{\v r}`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Ergebnis: <M p=".">{t`\v v = \dot{\v r} = \dot s\,\v\tau`}</M> Der kurze schwarze Pfeil <M>{t`\v\tau`}</M> hat Länge 1 und sagt, <b>wohin</b>; die Zahl <M>{t`\dot s`}</M> sagt, <b>wie schnell</b>. Der rote Pfeil <M>{t`\v v`}</M> zeigt in dieselbe Richtung und ist <M>{t`\dot s`}</M> lang.</>}
                en={<>Result: <M p=".">{t`\v v = \dot{\v r} = \dot s\,\v\tau`}</M> The short black arrow <M>{t`\v\tau`}</M> has length 1 and says <b>where to</b>; the number <M>{t`\dot s`}</M> says <b>how fast</b>. The red arrow <M>{t`\v v`}</M> points the same way and has length <M p=".">{t`\dot s`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={velScene} step={step} t={tt} />}
          </StepPlayer>
          <T
            de={<p><b>Dasselbe als Rechnung</b> <Src p={9} />. Man zerlegt «Lage ändert sich mit der Zeit» in zwei Schritte: Die Zeit bestimmt, wie weit der Punkt gefahren ist <M p=",">{t`(s)`}</M> und der gefahrene Weg bestimmt, wo er ist <M p=".">{t`(\v r)`}</M> Also <M p=",">{t`\v r(t) = \v r(s(t))`}</M> und die Kettenregel gibt:</p>}
            en={<p><b>The same as a calculation</b> <Src p={9} />. Split “position changes with time” into two steps: time decides how far the point has travelled <M p=",">{t`(s)`}</M> and the distance travelled decides where it is <M p=".">{t`(\v r)`}</M> So <M p=",">{t`\v r(t) = \v r(s(t))`}</M> and the chain rule gives:</p>}
          />
          <MD>{t`\dot{\v r} = \frac{\dd\v r}{\dd t} = \frac{\dd\v r}{\dd s}\,\underbrace{\frac{\dd s}{\dd t}}_{\dot s}, \qquad \frac{\dd\v r}{\dd s} = \lim_{\Delta s\to0}\frac{\Delta\v r}{\Delta s} = \v\tau \qquad\Rightarrow\qquad \dot{\v r} = \v\tau\,\dot s = \v v`}</MD>
          <T
            de={<ul>
              <li><M p=":">{t`\dd s/\dd t = \dot s`}</M> Weg pro Zeit, die Schnelligkeit.</li>
              <li><M p=":">{t`\dd\v r/\dd s`}</M> wie sich die Lage ändert pro Stück gefahrenem Weg. Fährt man ein winziges Stück der Länge <M>{t`\Delta s`}</M> entlang der Kurve, verschiebt sich der Punkt um <M p=",">{t`\Delta\v r`}</M> und das ist (Schritt 3) gleich lang und in Fahrtrichtung. Der Quotient ist darum ein Pfeil der Länge 1 in Fahrtrichtung: <M p=".">{t`\v\tau`}</M></li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`\dd s/\dd t = \dot s`}</M> distance per time, the speed.</li>
              <li><M p=":">{t`\dd\v r/\dd s`}</M> how the position changes per bit of distance travelled. Travel a tiny piece of length <M>{t`\Delta s`}</M> along the curve and the point shifts by <M p=",">{t`\Delta\v r`}</M> which (step 3) is equally long and points in the direction of travel. So the quotient is an arrow of length 1 in the direction of travel: <M p=".">{t`\v\tau`}</M></li>
            </ul>}
          />
          <details className="more">
            <summary><T de="Genauer hingeschaut: drei stille Voraussetzungen" en="A closer look: three silent assumptions" /></summary>
            <T
              de={<ul>
                <li><M>{t`\Delta\v r`}</M> zeigt erst im Grenzwert in Fahrtrichtung; für endliches <M>{t`\Delta t`}</M> ist es eine Abkürzung quer durch die Kurve (eine Sehne).</li>
                <li>Dass <M>{t`|\Delta\v r|/\Delta s \to 1`}</M> geht, braucht eine Kurve ohne Knick in <M p=".">M</M></li>
                <li><M>{t`\v r(s(t))`}</M> setzt voraus, dass der Punkt nicht stehen bleibt und nicht umkehrt <M p=".">{t`(\dot s > 0)`}</M></li>
                <li>Wie in der Figur des Skripts beginnt die Bahn hier in <M p=".">O</M> Das muss nicht so sein: <M>s</M> zählt ab einem beliebigen Startpunkt der Bahn, <M>{t`\v r`}</M> dagegen immer ab dem Ursprung <M p=".">O</M></li>
              </ul>}
              en={<ul>
                <li><M>{t`\Delta\v r`}</M> points in the direction of travel only in the limit; for finite <M>{t`\Delta t`}</M> it is a shortcut across the curve (a chord).</li>
                <li><M>{t`|\Delta\v r|/\Delta s \to 1`}</M> needs a curve without a kink at <M p=".">M</M></li>
                <li><M>{t`\v r(s(t))`}</M> assumes the point neither stops nor turns back <M p=".">{t`(\dot s > 0)`}</M></li>
                <li>As in the figure of the notes, the path starts at <M>O</M> here. It need not: <M>s</M> counts from any starting point on the path, whereas <M>{t`\v r`}</M> always starts at the origin <M p=".">O</M></li>
              </ul>}
            />
          </details>
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kartesisch" title={<T de="4. So rechnet man: kartesische Basis" en="4. How to compute it: Cartesian basis" />}>
        <Box kind="lecture" src={<Src p={9} fig="§2.2" />}>
          <T de={<>Kartesische Basis, mit <M p=":">{t`\v r(t) = x(t)\,\v e_x + y(t)\,\v e_y + z(t)\,\v e_z`}</M></>} en={<>Cartesian basis, with <M p=":">{t`\v r(t) = x(t)\,\v e_x + y(t)\,\v e_y + z(t)\,\v e_z`}</M></>} />
          <MD>{t`\dot{\v r} = \dot x\,\v e_x + x\,\cancel{\dot{\v e}_x} + \dot y\,\v e_y + y\,\cancel{\dot{\v e}_y} + \dot z\,\v e_z + z\,\cancel{\dot{\v e}_z}`}</MD>
          <MD>{t`\boxed{\dot{\v r} = \dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z}`}</MD>
        </Box>
        <T
          de={<>
            <p>So liest man die Zeile im Skript:</p>
            <ol>
              <li><M>{t`\v r`}</M> besteht aus drei Teilen wie <M p=":">{t`x\,\v e_x`}</M> eine Zahl mal ein Basisvektor.</li>
              <li>Beim Ableiten eines Produkts gilt die Produktregel: <M p=".">{t`\tfrac{\dd}{\dd t}(x\,\v e_x) = \dot x\,\v e_x + x\,\dot{\v e}_x`}</M></li>
              <li><M>{t`\v e_x`}</M> ändert sich nie – überall und immer derselbe Pfeil (<a href="#basen">Basen</a>). Also <M>{t`\dot{\v e}_x = \v 0`}</M> und der zweite Teil fällt weg. Das sind die drei durchgestrichenen Terme.</li>
            </ol>
            <p><b>Ergebnis:</b> Man leitet einfach jede Koordinate nach der Zeit ab. Genau das wollte S. 8 «zeigen». (Die Überschrift im Skript lautet «Darstellung von <M p=",">{t`\v r = \dot{\v r}`}</M>» gemeint ist <M p=".)">{t`\v v = \dot{\v r}`}</M></p>
          </>}
          en={<>
            <p>How to read the line in the notes:</p>
            <ol>
              <li><M>{t`\v r`}</M> consists of three parts like <M p=":">{t`x\,\v e_x`}</M> a number times a basis vector.</li>
              <li>Differentiating a product uses the product rule: <M p=".">{t`\tfrac{\dd}{\dd t}(x\,\v e_x) = \dot x\,\v e_x + x\,\dot{\v e}_x`}</M></li>
              <li><M>{t`\v e_x`}</M> never changes – the same arrow everywhere and always (<a href="#basen">Bases</a>). So <M>{t`\dot{\v e}_x = \v 0`}</M> and the second part drops out. These are the three struck-out terms.</li>
            </ol>
            <p><b>Result:</b> just differentiate each coordinate with respect to time. That is exactly what p. 8 set out to “show”. (The notes' heading reads “Darstellung von <M p=",">{t`\v r = \dot{\v r}`}</M>” meaning <M p=".)">{t`\v v = \dot{\v r}`}</M></p>
          </>}
        />
        <HelixVelocity />
        <T
          de={<p><b>Beispiel im Bild:</b> <M>M</M> fährt auf einer Schraubenlinie, <M p=".">{t`\v r(t) = (R\cos\omega t,\ R\sin\omega t,\ z_0 + ct)`}</M> Dabei ist <M>R</M> der Radius, <M>\omega</M> eine feste Zahl (wie schnell der Winkel wächst, in rad/s) und <M>c</M> die Steiggeschwindigkeit in m/s. Jede Koordinate ableiten gibt <M p=".">{t`\v v = (-R\omega\sin\omega t,\ R\omega\cos\omega t,\ c)`}</M> Die Schnelligkeit ist <M p=",">{t`\dot s = |\v v| = \sqrt{R^2\omega^2 + c^2}`}</M> also immer gleich – aber die Richtung von <M>{t`\v v`}</M> dreht sich ständig mit der Kurve. Drück auf «Bewegung abspielen» und schau dem roten Pfeil zu.</p>}
          en={<p><b>Example in the figure:</b> <M>M</M> travels on a helix, <M p=".">{t`\v r(t) = (R\cos\omega t,\ R\sin\omega t,\ z_0 + ct)`}</M> Here <M>R</M> is the radius, <M>\omega</M> a fixed number (how fast the angle grows, in rad/s) and <M>c</M> the climbing speed in m/s. Differentiating each coordinate gives <M p=".">{t`\v v = (-R\omega\sin\omega t,\ R\omega\cos\omega t,\ c)`}</M> The speed is <M p=",">{t`\dot s = |\v v| = \sqrt{R^2\omega^2 + c^2}`}</M> always the same – but the direction of <M>{t`\v v`}</M> keeps turning with the curve. Press “Play the motion” and watch the red arrow.</p>}
        />
        <Box kind="lecture" src={<Src p={9} />} title={<T de="Und in der zylindrischen Basis?" en="And in the cylindrical basis?" />}>
          <MD>{t`\v r = \rho(t)\,\v e_\rho(\varphi(t)) + z(t)\,\v e_z, \qquad \dot{\v r} = \dot\rho\,\v e_\rho + \rho\,\dot{\v e}_\rho + \dot z\,\v e_z + z\,\cancel{\dot{\v e}_z}, \qquad \dot{\v e}_\rho \ne 0`}</MD>
          <T
            de={<p>Hier fällt <M>{t`\rho\,\dot{\v e}_\rho`}</M> <em>nicht</em> weg, denn <M>{t`\v e_\rho`}</M> dreht sich, wenn sich <M>\varphi</M> ändert (<a href="#basen">Basen</a>, Schritt 3 der Animation). Was dieser zusätzliche Term bedeutet, zeigt die Lektion <a href="#v-krummlinig">Geschwindigkeit in Zylinder- und Kugelkoordinaten</a> (S. 10).</p>}
            en={<p>Here <M>{t`\rho\,\dot{\v e}_\rho`}</M> does <em>not</em> drop out, because <M>{t`\v e_\rho`}</M> turns when <M>\varphi</M> changes (<a href="#basen">Bases</a>, step 3 of the animation). What this extra term means is shown in the lesson <a href="#v-krummlinig">Velocity in cylindrical and spherical coordinates</a> (p. 10).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Geschwindigkeit und Schnelligkeit sind dasselbe.»" en="“Velocity and speed are the same thing.”" />}>
          <T de={<>Nein. Die Schnelligkeit <M>{t`\dot s`}</M> ist eine Zahl – der Tacho. Die Geschwindigkeit <M>{t`\v v`}</M> ist ein Pfeil – Tacho <em>und</em> Fahrtrichtung.</>} en={<>No. The speed <M>{t`\dot s`}</M> is a number – the speedometer. The velocity <M>{t`\v v`}</M> is an arrow – speedometer <em>and</em> direction of travel.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Gleiche Schnelligkeit heisst gleiche Geschwindigkeit.»" en="“Same speed means same velocity.”" />}>
          <T de={<>Nein. Ein Auto, das mit konstant 50 km/h durch eine Kurve fährt, hat ein konstantes <M p=",">{t`\dot s`}</M> aber <M>{t`\v v`}</M> ändert die Richtung – wie bei der Schraubenlinie oben.</>} en={<>No. A car taking a bend at a constant 50 km/h has a constant <M p=",">{t`\dot s`}</M> but <M>{t`\v v`}</M> changes direction – like on the helix above.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\Delta\v r`}</M> zeigt genau in Fahrtrichtung.»</>} en={<>“<M>{t`\Delta\v r`}</M> points exactly in the direction of travel.”</>} />}>
          <T de={<>Nur im Grenzwert <M p=".">{t`\Delta t \to 0`}</M> Für jedes endliche <M>{t`\Delta t`}</M> ist <M>{t`\Delta\v r`}</M> eine Abkürzung quer durch die Kurve: schräg und kürzer als der gefahrene Weg (Animation, Schritt 2).</>} en={<>Only in the limit <M p=".">{t`\Delta t \to 0`}</M> For every finite <M p=",">{t`\Delta t`}</M> <M>{t`\Delta\v r`}</M> is a shortcut across the curve: oblique and shorter than the distance travelled (animation, step 2).</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste in drei Zeilen" en="6. The essentials in three lines" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=":">{t`\v v = \dot{\v r}`}</M> Die Geschwindigkeit ist die Zeitableitung des Ortsvektors.</li>
              <li><M p=":">{t`\v v = \dot s\,\v\tau`}</M> Schnelligkeit mal Fahrtrichtung; <M>{t`\v v`}</M> zeigt immer entlang der Bahn.</li>
              <li><M p=":">{t`\v v = \dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M> In der kartesischen Basis einfach jede Koordinate ableiten.</li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`\v v = \dot{\v r}`}</M> velocity is the time derivative of the position vector.</li>
              <li><M p=":">{t`\v v = \dot s\,\v\tau`}</M> speed times direction of travel; <M>{t`\v v`}</M> always points along the path.</li>
              <li><M p=":">{t`\v v = \dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</M> in the Cartesian basis, just differentiate each coordinate.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> In Zylinder- und Kugelkoordinaten drehen sich die Basisvektoren mit. Daraus entsteht zum Beispiel der Zusatzterm <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> <Src p={10} />; bei der Kreisbewegung bleibt nur dieser Term übrig <Src p={11} />.</p>}
          en={<p className="connections"><b>Next:</b> in cylindrical and spherical coordinates the basis vectors turn along. This produces, for example, the extra term <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> <Src p={10} />; in circular motion only this term remains <Src p={11} />.</p>}
        />
      </Section>
    </article>
  );
}
