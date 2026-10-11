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
        de={<p className="lede">Kapitel 2 der Vorlesung fragt: Wie schnell und in welche Richtung bewegt sich ein Punkt? Für eine Gerade ist das die Ableitung <M p=".">{t`\dot x`}</M> Im Raum wird daraus der Geschwindigkeitsvektor <M p=":">{t`\v v = \dot{\v r}`}</M> tangential an die Bahn, mit der Schnelligkeit <M>{t`\dot s`}</M> als Länge.</p>}
        en={<p className="lede">Chapter 2 of the lecture asks: how fast and in which direction does a point move? On a straight line this is the derivative <M p=".">{t`\dot x`}</M> In space it becomes the velocity vector <M p=":">{t`\v v = \dot{\v r}`}</M> tangent to the path, with the speed <M>{t`\dot s`}</M> as its length.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="geradlinig" title={<T de="1. Geradlinige Bewegung" en="1. Rectilinear motion (geradlinige Bewegung)" />}>
        <Box kind="lecture" src={<Src p={8} />}>
          <T de={<><M p=":">{t`x(t)`}</M> skalare Funktion (Abstand von <M>M</M> zum festen Punkt <M>A</M> auf der Geraden).</>} en={<><M p=":">{t`x(t)`}</M> a scalar function (distance of <M>M</M> from the fixed point <M>A</M> on the line).</>} />
          <MD>{t`v = \frac{\dd x(t)}{\dd t} = \dot x = \lim_{\Delta t\to 0}\frac{x(t+\Delta t) - x(t)}{\Delta t}`}</MD>
        </Box>
        <T
          de={<p>Der Bruch ist die <b>mittlere</b> Geschwindigkeit im Zeitintervall <M p=":">{t`\Delta t`}</M> zurückgelegter Weg durch Zeit. Im Graphen von <M>{t`x(t)`}</M> ist das die Steigung der Sekante. Macht man <M>{t`\Delta t`}</M> immer kleiner, wird aus der Sekante die Tangente – und aus der mittleren die <b>momentane</b> Geschwindigkeit <M p=".">{t`\dot x`}</M> Der Punkt über einer Grösse, <M p=",">{t`\dot x`}</M> heisst immer «Ableitung nach der Zeit».</p>}
          en={<p>The fraction is the <b>mean</b> velocity over the time interval <M p=":">{t`\Delta t`}</M> distance travelled divided by time. In the graph of <M>{t`x(t)`}</M> it is the slope of the secant. Making <M>{t`\Delta t`}</M> smaller and smaller turns the secant into the tangent – and the mean velocity into the <b>instantaneous</b> velocity <M p=".">{t`\dot x`}</M> A dot over a quantity, <M p=",">{t`\dot x`}</M> always means “derivative with respect to time”.</p>}
        />
        <SecantDemo />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="raum" title={<T de="2. Im Raum: was gesucht ist" en="2. In space: what we are after" />}>
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
          de={<p>Die Idee ist dieselbe wie auf der Geraden, nur mit Vektoren: Differenz der Ortsvektoren durch <M p=",">{t`\Delta t`}</M> dann <M p=".">{t`\Delta t \to 0`}</M> Dazu kommt eine zweite Zerlegung, die es auf der Geraden nicht braucht: <b>wie schnell</b> (eine Zahl) und <b>wohin</b> (eine Richtung).</p>}
          en={<p>The idea is the same as on the line, only with vectors: difference of position vectors divided by <M p=",">{t`\Delta t`}</M> then <M p=".">{t`\Delta t \to 0`}</M> On top comes a second split that the line does not need: <b>how fast</b> (a number) and <b>where to</b> (a direction).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vektor" title={<T de={<>3. Der Geschwindigkeitsvektor <M>{t`\v v`}</M></>} en={<>3. The velocity vector <M>{t`\v v`}</M></>} />}>
        <Box kind="lecture" src={<Src p={8} fig="§2.1" />}>
          <T de={<><b>Schnelligkeit</b> <M p=":">{t`\dot s`}</M></>} en={<><b>Speed</b> (<em lang="de">Schnelligkeit</em>) <M p=":">{t`\dot s`}</M></>} />
          <MD>{t`\dot s = \lim_{\Delta t\to0}\frac{s(t+\Delta t) - s(t)}{\Delta t} = \lim_{\Delta t\to 0}\frac{\Delta s}{\Delta t}, \qquad \v v = \dot s\cdot\v\tau`}</MD>
          <T de={<><M p=":">{t`\dot s`}</M> Wie schnell? <M p=":">{t`\v\tau`}</M> In welche Richtung? (<M>{t`\v\tau`}</M> tangentialer Einheitsvektor, <M>s</M> Bogenlänge.)</>} en={<><M p=":">{t`\dot s`}</M> how fast? <M p=":">{t`\v\tau`}</M> in which direction? (<M>{t`\v\tau`}</M> tangent unit vector, <M>s</M> arc length, <em lang="de">Bogenlänge</em>.)</>} />
        </Box>
        <Derivation title={<T de={<><M>{t`\dot{\v r}`}</M> ist tangential (S. 8–9)</>} en={<><M>{t`\dot{\v r}`}</M> is tangent (pp. 8–9)</>} />}>
          <StepPlayer
            label={tr('Animation: vom Differenzenquotienten zum Geschwindigkeitsvektor', 'Animation: from the difference quotient to the velocity vector')}
            steps={[
              { ms: 4500, caption: <T
                de={<>Die Bahnkurve beginnt in <M p=".">O</M> Zur Zeit <M>t</M> ist der Punkt in <M p=",">M</M> sein Ortsvektor ist <M p=".">{t`\v r(t)`}</M> Die <b>Bogenlänge</b> <M>{t`s(t)`}</M> ist der Weg, der entlang der Kurve bis <M>M</M> zurückgelegt wurde (türkis).</>}
                en={<>The trajectory starts at <M p=".">O</M> At time <M>t</M> the point is at <M p=",">M</M> its position vector is <M p=".">{t`\v r(t)`}</M> The <b>arc length</b> <M>{t`s(t)`}</M> is the distance travelled along the curve up to <M>M</M> (teal).</>} /> },
              { ms: 3000, holdMs: 2500, caption: <T
                de={<>Etwas später, zur Zeit <M p=",">{t`t+\Delta t`}</M> ist der Punkt weiter. Die Sehne <M>{t`\Delta\v r = \v r(t+\Delta t) - \v r(t)`}</M> verbindet die beiden Lagen, also <M p=".">{t`\v r(t) + \Delta\v r = \v r(t+\Delta t)`}</M> Entlang der Kurve ist das Stück <M>{t`\Delta s`}</M> dazugekommen.</>}
                en={<>A little later, at time <M p=",">{t`t+\Delta t`}</M> the point has moved on. The chord <M>{t`\Delta\v r = \v r(t+\Delta t) - \v r(t)`}</M> connects the two positions, so <M p=".">{t`\v r(t) + \Delta\v r = \v r(t+\Delta t)`}</M> Along the curve, the piece <M>{t`\Delta s`}</M> has been added.</>} /> },
              { ms: 7000, holdMs: 2500, caption: <T
                de={<>Jetzt <M p=":">{t`\Delta t \to 0`}</M> Der spätere Punkt rutscht in <M p=".">M</M> Der rote Pfeil <M>{t`\Delta\v r/\Delta t`}</M> hat dieselbe Richtung wie die Sehne und wird zu <M p=".">{t`\dot{\v r} = \lim_{\Delta t\to0}\Delta\v r/\Delta t`}</M> Die Sehne dreht sich in die Tangente: <M p=",">{t`\dot{\v r}\parallel\Delta\v r`}</M> <M p=",">{t`\Delta\v r \parallel \v\tau`}</M> also <M p=".">{t`\dot{\v r} \parallel \v\tau`}</M> Und Sehne und Bogen werden gleich lang: <M p=".">{t`|\Delta\v r|/\Delta s \to 1`}</M></>}
                en={<>Now <M p=":">{t`\Delta t \to 0`}</M> the later point slides into <M p=".">M</M> The red arrow <M>{t`\Delta\v r/\Delta t`}</M> has the direction of the chord and becomes <M p=".">{t`\dot{\v r} = \lim_{\Delta t\to0}\Delta\v r/\Delta t`}</M> The chord turns into the tangent: <M p=",">{t`\dot{\v r}\parallel\Delta\v r`}</M> <M p=",">{t`\Delta\v r \parallel \v\tau`}</M> so <M p=".">{t`\dot{\v r} \parallel \v\tau`}</M> And chord and arc become equally long: <M p=".">{t`|\Delta\v r|/\Delta s \to 1`}</M></>} /> },
              { ms: 3500, caption: <T
                de={<>Ergebnis: <M p=".">{t`\v v = \dot{\v r} = \dot s\,\v\tau`}</M> Die Richtung ist die Tangente <M>{t`\v\tau`}</M> (Länge 1), die Länge ist die Schnelligkeit <M p=".">{t`\dot s = |\v v|`}</M> Die Rechnung dazu steht direkt unter der Animation.</>}
                en={<>Result: <M p=".">{t`\v v = \dot{\v r} = \dot s\,\v\tau`}</M> The direction is the tangent <M>{t`\v\tau`}</M> (length 1), the length is the speed <M p=".">{t`\dot s = |\v v|`}</M> The calculation is right below the animation.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={velScene} step={step} t={tt} />}
          </StepPlayer>
          <T
            de={<p>Die Vorlesung rechnet das mit der <b>Kettenregel</b> nach <Src p={9} />. Man beschreibt die Lage über die Bogenlänge, <M p=",">{t`\v r(t) = \v r(s(t))`}</M> und leitet ab:</p>}
            en={<p>The lecture checks this with the <b>chain rule</b> <Src p={9} />. Describe the position through the arc length, <M p=",">{t`\v r(t) = \v r(s(t))`}</M> and differentiate:</p>}
          />
          <MD>{t`\dot{\v r} = \frac{\dd\v r}{\dd t} = \frac{\dd\v r}{\dd s}\,\underbrace{\frac{\dd s}{\dd t}}_{\dot s}, \qquad \frac{\dd\v r}{\dd s} = \lim_{\Delta s\to0}\frac{\Delta\v r}{\Delta s} = \v\tau \qquad\Rightarrow\qquad \dot{\v r} = \v\tau\,\dot s = \v v`}</MD>
          <T
            de={<p><M>{t`\dd\v r/\dd s`}</M> ist ein <b>Einheitsvektor</b>, weil <M>{t`|\Delta\v r|/\Delta s \to 1`}</M> (Schritt 3 der Animation), und er ist tangential. Genau das ist <M p=".">{t`\v\tau`}</M></p>}
            en={<p><M>{t`\dd\v r/\dd s`}</M> is a <b>unit vector</b> because <M>{t`|\Delta\v r|/\Delta s \to 1`}</M> (step 3 of the animation), and it is tangent. That is exactly <M p=".">{t`\v\tau`}</M></p>}
          />
          <details className="more">
            <summary><T de="Genauer hingeschaut: drei stille Voraussetzungen" en="A closer look: three silent assumptions" /></summary>
            <T
              de={<ul>
                <li><M>{t`\Delta\v r \parallel \v\tau`}</M> gilt erst im Grenzwert: Für endliches <M>{t`\Delta t`}</M> ist <M>{t`\Delta\v r`}</M> eine Sehne, nicht tangential.</li>
                <li>Dass <M>{t`|\Delta\v r|/\Delta s \to 1`}</M> geht, braucht eine glatte Kurve (keine Ecke in <M p=").">M</M></li>
                <li><M>{t`\v r(s(t))`}</M> setzt voraus, dass man von <M>t</M> eindeutig auf <M>s</M> umrechnen kann, also <M p=":">{t`\dot s > 0`}</M> Der Punkt bleibt nicht stehen und kehrt nicht um.</li>
              </ul>}
              en={<ul>
                <li><M>{t`\Delta\v r \parallel \v\tau`}</M> holds only in the limit: for finite <M>{t`\Delta t`}</M> the vector <M>{t`\Delta\v r`}</M> is a chord, not tangent.</li>
                <li><M>{t`|\Delta\v r|/\Delta s \to 1`}</M> needs a smooth curve (no corner at <M p=").">M</M></li>
                <li><M>{t`\v r(s(t))`}</M> requires converting uniquely from <M>t</M> to <M p=",">s</M> i.e. <M p=":">{t`\dot s > 0`}</M> the point neither stops nor turns back.</li>
              </ul>}
            />
          </details>
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kartesisch" title={<T de="4. Explizit: kartesische Basis" en="4. Explicitly: Cartesian basis" />}>
        <Box kind="lecture" src={<Src p={9} fig="§2.2" />}>
          <T de={<>Darstellung von <M p=",">{t`\v v = \dot{\v r}`}</M> kartesische Basis, mit <M p=":">{t`\v r(t) = x(t)\,\v e_x + y(t)\,\v e_y + z(t)\,\v e_z`}</M></>} en={<>Representation of <M p=",">{t`\v v = \dot{\v r}`}</M> Cartesian basis, with <M p=":">{t`\v r(t) = x(t)\,\v e_x + y(t)\,\v e_y + z(t)\,\v e_z`}</M></>} />
          <MD>{t`\dot{\v r} = \dot x\,\v e_x + x\,\cancel{\dot{\v e}_x} + \dot y\,\v e_y + y\,\cancel{\dot{\v e}_y} + \dot z\,\v e_z + z\,\cancel{\dot{\v e}_z}`}</MD>
          <MD>{t`\boxed{\dot{\v r} = \dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z}`}</MD>
        </Box>
        <T
          de={<p>Jeder Summand <M>{t`x\,\v e_x`}</M> ist ein Produkt, also gibt die Produktregel zwei Terme: <M p=".">{t`\dot x\,\v e_x + x\,\dot{\v e}_x`}</M> Die kartesischen Basisvektoren sind überall und jederzeit dieselben (Lektion 3), ihre Ableitung ist null – deshalb sind die drei Terme im Skript durchgestrichen. Übrig bleibt, was auf S. 8 «zu zeigen» war: Man leitet einfach die drei Koordinaten ab. (Das Skript schreibt in der Überschrift «Darstellung von <M p=",">{t`\v r = \dot{\v r}`}</M>» gemeint ist <M p=".)">{t`\v v = \dot{\v r}`}</M></p>}
          en={<p>Each term <M>{t`x\,\v e_x`}</M> is a product, so the product rule gives two terms: <M p=".">{t`\dot x\,\v e_x + x\,\dot{\v e}_x`}</M> The Cartesian basis vectors are the same everywhere and at all times (lesson 3); their derivative is zero – that is why the three terms are struck out in the notes. What remains is what p. 8 set out to show: just differentiate the three coordinates. (The notes' heading reads “Darstellung von <M p=",">{t`\v r = \dot{\v r}`}</M>” meaning <M p=".)">{t`\v v = \dot{\v r}`}</M></p>}
        />
        <HelixVelocity />
        <T
          de={<p>Im Bild bewegt sich <M>M</M> auf einer Schraubenlinie <M p=".">{t`\v r(t) = (R\cos\omega t,\ R\sin\omega t,\ z_0 + ct)`}</M> Ableiten Komponente für Komponente gibt <M p=",">{t`\v v = (-R\omega\sin\omega t,\ R\omega\cos\omega t,\ c)`}</M> also <M p=":">{t`\dot s = |\v v| = \sqrt{R^2\omega^2 + c^2}`}</M> konstant, obwohl sich <M>{t`\v v`}</M> dauernd dreht.</p>}
          en={<p>In the figure <M>M</M> moves on a helix <M p=".">{t`\v r(t) = (R\cos\omega t,\ R\sin\omega t,\ z_0 + ct)`}</M> Differentiating component by component gives <M p=",">{t`\v v = (-R\omega\sin\omega t,\ R\omega\cos\omega t,\ c)`}</M> so <M p=":">{t`\dot s = |\v v| = \sqrt{R^2\omega^2 + c^2}`}</M> constant, although <M>{t`\v v`}</M> keeps turning.</p>}
        />
        <Box kind="lecture" src={<Src p={9} />} title={<T de="Und in der zylindrischen Basis?" en="And in the cylindrical basis?" />}>
          <MD>{t`\v r = \rho(t)\,\v e_\rho(\varphi(t)) + z(t)\,\v e_z, \qquad \dot{\v r} = \dot\rho\,\v e_\rho + \rho\,\dot{\v e}_\rho + \dot z\,\v e_z + z\,\cancel{\dot{\v e}_z}, \qquad \dot{\v e}_\rho \ne 0`}</MD>
          <T
            de={<p>Hier fällt <M>{t`\rho\,\dot{\v e}_\rho`}</M> <em>nicht</em> weg: <M>{t`\v e_\rho`}</M> dreht sich mit <M>\varphi</M> (Lektion 3). Was dieser Term ist, zeigt die nächste Lektion (S. 10).</p>}
            en={<p>Here <M>{t`\rho\,\dot{\v e}_\rho`}</M> does <em>not</em> vanish: <M>{t`\v e_\rho`}</M> turns with <M>\varphi</M> (lesson 3). What this term is, the next lesson shows (p. 10).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Häufige Missverständnisse" en="5. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Geschwindigkeit und Schnelligkeit sind dasselbe.»" en="“Velocity and speed are the same thing.”" />}>
          <T de={<><M>{t`\v v`}</M> ist ein Vektor (Betrag <em>und</em> Richtung), <M>{t`\dot s = |\v v|`}</M> eine Zahl <M p=".">{t`\ge 0`}</M> Der Tacho zeigt <M p=",">{t`\dot s`}</M> nicht <M p=".">{t`\v v`}</M></>} en={<><M>{t`\v v`}</M> is a vector (magnitude <em>and</em> direction), <M>{t`\dot s = |\v v|`}</M> a number <M p=".">{t`\ge 0`}</M> A speedometer shows <M p=",">{t`\dot s`}</M> not <M p=".">{t`\v v`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Konstantes <M>{t`\dot s`}</M> heisst konstantes <M p=".">{t`\v v`}</M>»</>} en={<>“Constant <M>{t`\dot s`}</M> means constant <M p=".">{t`\v v`}</M>”</>} />}>
          <T de={<>Nein: Auf der Schraubenlinie oben ist <M>{t`\dot s`}</M> konstant, aber <M>{t`\v v`}</M> ändert ständig die Richtung. Konstant ist <M>{t`\v v`}</M> nur auf einer Geraden mit konstantem Tempo.</>} en={<>No: on the helix above <M>{t`\dot s`}</M> is constant, but <M>{t`\v v`}</M> keeps changing direction. <M>{t`\v v`}</M> is constant only on a straight line at constant pace.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\Delta\v r`}</M> ist tangential und so lang wie <M p=".">{t`\Delta s`}</M>»</>} en={<>“<M>{t`\Delta\v r`}</M> is tangent and as long as <M p=".">{t`\Delta s`}</M>”</>} />}>
          <T de={<>Nur im Grenzwert. Für endliches <M>{t`\Delta t`}</M> ist <M>{t`\Delta\v r`}</M> eine Sehne: schräg zur Tangente und kürzer als der Bogen (Schritt 2 und 3 der Animation).</>} en={<>Only in the limit. For finite <M>{t`\Delta t`}</M> the vector <M>{t`\Delta\v r`}</M> is a chord: oblique to the tangent and shorter than the arc (steps 2 and 3 of the animation).</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Merke und Ausblick" en="6. Key points and outlook" />}>
        <Box kind="key">
          <MD>{t`\v v = \dot{\v r} = \lim_{\Delta t\to0}\frac{\Delta\v r}{\Delta t} = \dot s\,\v\tau, \qquad \dot s = |\v v|, \qquad \v v = \dot x\,\v e_x + \dot y\,\v e_y + \dot z\,\v e_z`}</MD>
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> In zylindrischen und sphärischen Koordinaten drehen sich die Basisvektoren mit. Daraus entstehen Zusatzterme wie <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> <Src p={10} />; bei der Kreisbewegung bleibt nur dieser Term übrig <Src p={11} />.</p>}
          en={<p className="connections"><b>Next:</b> in cylindrical and spherical coordinates the basis vectors turn along. This produces extra terms like <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> <Src p={10} />; in circular motion only this term remains <Src p={11} />.</p>}
        />
      </Section>
    </article>
  );
}
