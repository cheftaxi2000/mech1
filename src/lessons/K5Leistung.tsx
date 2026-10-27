import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { whyScene } from '../viz/force/k5WhyScene';
import { PowerExplorer } from '../viz/force/K5Power';
import { EverydayPower, LorentzFigure, NormalForceFigure, WattScale } from '../viz/force/K5Figures';

const t = String.raw;

export default function K5Leistung() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Wagen rollt, und du hast die Hand am Griff: Du kannst mitschieben, dagegenhalten oder nur zur Seite ziehen. Die <b>Leistung</b> <M>P</M> fasst das in einer einzigen Zahl zusammen – im Skript heisst es, sie «charakterisiert die Wirkung einer Kraft». Die Formel ist kurz. Schwieriger ist es, sie zu <em>sehen</em>. Dafür ist diese Lektion da.</p>}
        en={<p className="lede">A trolley is rolling and you have a hand on the handle: you can push along, hold back, or just pull sideways. The <b>power</b> <M>P</M> sums that up in a single number – the notes say it «characterises the effect of a force». The formula is short. Harder is to <em>see</em> it. That is what this lesson is for.</p>}
      />
      <Box kind="intuition">
        <T
          de={<>
            <p>Ein Einkaufswagen rollt über den Parkplatz. Drei Dinge kann deine Hand tun:</p>
            <ol>
              <li><b>Du schiebst mit.</b> Deine Kraft zeigt in Fahrtrichtung. Du hilfst dem Wagen: Er bleibt schnell oder wird schneller.</li>
              <li><b>Du hältst dagegen.</b> Deine Kraft zeigt gegen die Fahrtrichtung. Du bremst: Dem Wagen wird Schwung genommen.</li>
              <li><b>Du ziehst zur Seite.</b> Deine Kraft steht quer zur Fahrtrichtung. Der Wagen wird abgelenkt, aber nicht schneller oder langsamer. Genauso bei einem Stein, den du an einer Schnur im Kreis schwingst: Die Schnur zieht immer zur Mitte, und der Stein bleibt gleich schnell.</li>
            </ol>
            <EverydayPower />
            <p>Die Leistung ist die Zahl dazu: <b>plus</b>, wenn die Kraft mit der Bewegung geht, <b>minus</b>, wenn sie dagegen geht, <b>null</b>, wenn sie quer steht. Sie ist umso grösser, je stärker die Kraft ist und je schneller sich der Punkt bewegt. Und sie gilt immer für <em>diesen Augenblick</em>: Eine Sekunde später kann alles anders sein. (Wie sich die Geschwindigkeit wirklich ändert, wenn mehrere Kräfte zusammenwirken, ist Sache der Dynamik – hier geht es nur um die Zahl <M p=").">P</M></p>
          </>}
          en={<>
            <p>A shopping trolley rolls across the car park. Your hand can do three things:</p>
            <ol>
              <li><b>You push along.</b> Your force points the way the trolley rolls. You help it: it stays fast or gets faster.</li>
              <li><b>You hold back.</b> Your force points against the way it rolls. You brake: momentum is taken away.</li>
              <li><b>You pull sideways.</b> Your force is at right angles to the way it rolls. The trolley is deflected, but not faster or slower. The same with a stone you swing round on a string: the string always pulls to the centre, and the stone keeps its speed.</li>
            </ol>
            <EverydayPower />
            <p>The power is the number for this: <b>plus</b> when the force goes with the motion, <b>minus</b> when it goes against it, <b>zero</b> when it is at right angles. It is larger the stronger the force and the faster the point moves. And it always belongs to <em>this instant</em>: a second later everything can be different. (How the velocity really changes when several forces act together is a matter for dynamics – here we only care about the number <M p=").">P</M></p>
          </>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="skript" title={<T de="1. Die Formel im Skript" en="1. The formula in the notes" />}>
        <Box kind="lecture" src={<Src p={33} />} title={<T de="Leistung einer Kraft" en={<><De en="power of a force">Leistung einer Kraft</De></>} />}>
          <T
            de={<p>«5 Leistung» – handschriftlich: «charakterisiert die Wirkung einer Kraft». Für die Kraft <M>{t`\{A\,|\,\v F\}`}</M> gilt:</p>}
            en={<p>«5 <De en="power">Leistung</De>» – handwritten: «characterises the effect of a force». For the force <M>{t`\{A\,|\,\v F\}`}</M> we have:</p>}
          />
          <MD>{t`\{A\,|\,\v F\}:\qquad P = \v F\cdot\v v_A,\qquad \Big[\text{N}\,\tfrac{\text{m}}{\text{s}}\Big] = [\text{W}]`}</MD>
          <MD>{t`P = |\v F|\,|\v v_A|\cos\alpha`}</MD>
          <T
            de={<>
              <p>Dazu eine kleine Skizze mit dem Winkel <M>\alpha</M> zwischen <M>\v F</M> und <M p=".">{t`\v v_A`}</M> Handschriftlich folgen fünf Skizzen (<M>\v v</M> immer nach rechts) und drei Namen:</p>
              <ul>
                <li><b>Antriebskraft</b>, <M p=":">{t`\alpha < \tfrac{\pi}{2}`}</M> <M>{t`P = \mathord{+}\mathord{+}`}</M> und <M p=".">{t`P = \mathord{+}`}</M></li>
                <li><b>Widerstandskraft</b>, <M p=":">{t`\alpha > \tfrac{\pi}{2}`}</M> <M>{t`P = \mathord{-}`}</M> und <M p=".">{t`P = \mathord{-}\mathord{-}`}</M></li>
                <li><b>leistungslos</b>, <M p=":">{t`\alpha = \tfrac{\pi}{2}`}</M> <M p=".">{t`P = 0`}</M></li>
              </ul>
            </>}
            en={<>
              <p>With a small sketch of the angle <M>\alpha</M> between <M>\v F</M> and <M p=".">{t`\v v_A`}</M> Handwritten follow five sketches (<M>\v v</M> always pointing right) and three names:</p>
              <ul>
                <li><b><De en="driving force">Antriebskraft</De></b>, <M p=":">{t`\alpha < \tfrac{\pi}{2}`}</M> <M>{t`P = \mathord{+}\mathord{+}`}</M> and <M p=".">{t`P = \mathord{+}`}</M></li>
                <li><b><De en="resisting force">Widerstandskraft</De></b>, <M p=":">{t`\alpha > \tfrac{\pi}{2}`}</M> <M>{t`P = \mathord{-}`}</M> and <M p=".">{t`P = \mathord{-}\mathord{-}`}</M></li>
                <li><b><De en="without power">leistungslos</De></b>, <M p=":">{t`\alpha = \tfrac{\pi}{2}`}</M> <M p=".">{t`P = 0`}</M></li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li><M>{t`\{A\,|\,\v F\}`}</M> ist eine Kraft, die im Punkt <M>A</M> angreift (die <a href="#kraft">Kraft als punktgebundener Vektor</a>). Jede Kraft hat ihren eigenen Punkt, und der ist wichtig.</li>
              <li><M>{t`\v v_A`}</M> ist die Geschwindigkeit <em>dieses</em> Punktes <M p=",">A</M> nicht die des ganzen Körpers und nicht die eines anderen Punktes. Bei einem drehenden Körper hat jeder Punkt seine eigene Geschwindigkeit.</li>
              <li>Der Punkt zwischen <M>\v F</M> und <M>{t`\v v_A`}</M> ist das <a href="#vektoren">Skalarprodukt</a> (S. 5). Es multipliziert Komponente mit Komponente und addiert: <M p=".">{t`\v F\cdot\v v = F_xv_x + F_yv_y + F_zv_z`}</M> Das Ergebnis ist eine <em>Zahl</em>, kein Pfeil.</li>
              <li>Die zweite Zeile ist dasselbe Skalarprodukt, geometrisch geschrieben: Länge mal Länge mal der Kosinus des Winkels dazwischen. Ist der Winkel <M>\alpha</M> spitz, ist <M>{t`\cos\alpha`}</M> positiv, bei <M>{t`90^\circ`}</M> ist er null, ist <M>\alpha</M> stumpf, wird er negativ.</li>
              <li>Einheit: Kraft mal Geschwindigkeit, also <M p=",">{t`\text{N}\cdot\text{m}/\text{s}`}</M> und das nennt man ein <b>Watt</b>, <M p=".">{t`1\,\text{W} = 1\,\text{N}\,\text{m}/\text{s}`}</M></li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read this:</b></p>
            <ol className="keep">
              <li><M>{t`\{A\,|\,\v F\}`}</M> is a force that acts at the point <M>A</M> (<a href="#kraft">force as a point-bound vector</a>). Every force has its own point, and that point matters.</li>
              <li><M>{t`\v v_A`}</M> is the velocity of <em>this</em> point <M p=",">A</M> not that of the whole body and not that of another point. In a turning body every point has its own velocity.</li>
              <li>The dot between <M>\v F</M> and <M>{t`\v v_A`}</M> is the <a href="#vektoren">dot product</a> (p. 5). It multiplies component by component and adds: <M p=".">{t`\v F\cdot\v v = F_xv_x + F_yv_y + F_zv_z`}</M> The result is a <em>number</em>, not an arrow.</li>
              <li>The second line is the same dot product, written geometrically: length times length times the cosine of the angle between them. If the angle <M>\alpha</M> is acute, <M>{t`\cos\alpha`}</M> is positive, at <M>{t`90^\circ`}</M> it is zero, and if <M>\alpha</M> is obtuse it turns negative.</li>
              <li>Unit: force times velocity, i.e. <M p=",">{t`\text{N}\cdot\text{m}/\text{s}`}</M> and that is called a <b>watt</b>, <M p=".">{t`1\,\text{W} = 1\,\text{N}\,\text{m}/\text{s}`}</M></li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bild" title={<T de="2. Mit der Bewegung, gegen sie, quer dazu" en="2. With the motion, against it, across it" />}>
        <T
          de={<>
            <p>Im Bild bewegt sich der Punkt <M>A</M> nach rechts; die gestrichelte Bahn mit den Strichen gleitet unter ihm durch, schneller bei grösserem <M p=".">v</M> Die Kraft <M>\v F</M> hängt an <M p=".">A</M> Ziehe die Spitze von <M>\v F</M> überall hin, und ziehe auch die Spitze von <M>{t`\v v_A`}</M> länger oder kürzer. Die fünf Knöpfe oben sind die fünf Skizzen aus dem Skript.</p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Nur der dicke Streifen auf der Bahn – der Teil von <M>\v F</M> längs der Bewegung – bestimmt <M p=".">P</M> Der Balken unten gehört zu «Streifenlänge mal <M p="»">v</M> und das ist <M p=".">P</M></p>
          </>}
          en={<>
            <p>In the picture the point <M>A</M> moves to the right; the dashed track with the marks slides by underneath, faster for larger <M p=".">v</M> The force <M>\v F</M> is attached to <M p=".">A</M> Drag the tip of <M>\v F</M> anywhere, and drag the tip of <M>{t`\v v_A`}</M> longer or shorter. The five buttons at the top are the five sketches of the notes.</p>
            <p className="lp-see"><b>What you should see:</b> Only the thick strip on the track – the part of <M>\v F</M> along the motion – determines <M p=".">P</M> The bar at the bottom belongs to «strip length times <M p="”">v</M> and that is <M p=".">P</M></p>
          </>}
        />
        <PowerExplorer />
        <T
          de={<>
            <p className="keep"><b>Warum nur der Streifen zählt.</b> Teile die Kraft in zwei Teile: einen <em>längs</em> der Bewegung und einen <em>quer</em> dazu. Der Querteil schiebt den Punkt weder vorwärts noch hält er ihn auf. In der Formel verschwindet er von selbst: Er steht senkrecht auf <M p=",">{t`\v v_A`}</M> und das Skalarprodukt zweier senkrechter Vektoren ist null. Mit <M>{t`\v v_A = (v, 0, 0)`}</M> sieht man es sogar ausgeschrieben: <M p=".">{t`\v F\cdot\v v_A = F_x\,v + F_y\cdot 0 + F_z\cdot 0`}</M> Übrig bleibt der Streifen <M>{t`F_x = |\v F|\cos\alpha`}</M> (die Ankathete im rechtwinkligen Dreieck) mal <M p=".">v</M> Das ist genau die zweite Zeile des Skripts.</p>
            <p><b>Die fünf Skizzen.</b> «<M p="»:">{t`P = \mathord{+}\mathord{+}`}</M> <M>\v F</M> zeigt in Richtung <M p=",">{t`\v v_A`}</M> der Streifen ist so lang wie <M>\v F</M> selbst. «<M p="»:">{t`P = \mathord{+}`}</M> <M>\v F</M> zeigt schräg nach vorn, der Streifen ist kürzer. «<M p="»:">{t`P = \mathord{-}`}</M> schräg nach hinten, der Streifen zeigt gegen <M p=".">{t`\v v_A`}</M> «<M p="»:">{t`P = \mathord{-}\mathord{-}`}</M> genau gegen <M p=".">{t`\v v_A`}</M> «<M p="»:">{t`P = 0`}</M> <M>\v F</M> steht quer, der Streifen hat die Länge null. (Wir lesen «<M>{t`\mathord{+}\mathord{+}`}</M> und «<M>{t`\mathord{+}`}</M> als «stark positiv» und «schwach positiv»; das Skript schreibt dazu keinen Text.)</p>
            <p><b>Zwei Sonderfälle.</b> Ist <M>{t`\v F = \v 0`}</M> oder <M p=",">{t`\v v_A = \v 0`}</M> dann ist <M>{t`P = 0`}</M> – auch wenn der Winkel <M>\alpha</M> dann gar keinen Sinn hat. Und: <M>P</M> ist eine Zahl <em>mit Vorzeichen</em>. Das Vorzeichen sagt nur «mit» oder «gegen» die Bewegung, nicht «gut» oder «schlecht».</p>
          </>}
          en={<>
            <p className="keep"><b>Why only the strip counts.</b> Split the force into two parts: one <em>along</em> the motion and one <em>across</em> it. The cross part neither pushes the point forward nor holds it back. In the formula it vanishes by itself: it is perpendicular to <M p=",">{t`\v v_A`}</M> and the dot product of two perpendicular vectors is zero. With <M>{t`\v v_A = (v, 0, 0)`}</M> you can even see it written out: <M p=".">{t`\v F\cdot\v v_A = F_x\,v + F_y\cdot 0 + F_z\cdot 0`}</M> What remains is the strip <M>{t`F_x = |\v F|\cos\alpha`}</M> (the adjacent side of the right triangle) times <M p=".">v</M> That is exactly the second line of the notes.</p>
            <p><b>The five sketches.</b> «<M p="»:">{t`P = \mathord{+}\mathord{+}`}</M> <M>\v F</M> points the way <M p=",">{t`\v v_A`}</M> points, the strip is as long as <M>\v F</M> itself. «<M p="»:">{t`P = \mathord{+}`}</M> <M>\v F</M> points obliquely forward, the strip is shorter. «<M p="»:">{t`P = \mathord{-}`}</M> obliquely backward, the strip points against <M p=".">{t`\v v_A`}</M> «<M p="»:">{t`P = \mathord{-}\mathord{-}`}</M> exactly against <M p=".">{t`\v v_A`}</M> «<M p="»:">{t`P = 0`}</M> <M>\v F</M> is across, the strip has length zero. (We read «<M>{t`\mathord{+}\mathord{+}`}</M> and «<M>{t`\mathord{+}`}</M> as «strongly positive» and «weakly positive»; the notes add no text.)</p>
            <p><b>Two special cases.</b> If <M>{t`\v F = \v 0`}</M> or <M p=",">{t`\v v_A = \v 0`}</M> then <M>{t`P = 0`}</M> – even though the angle <M>\alpha</M> makes no sense then. And: <M>P</M> is a number <em>with a sign</em>. The sign only says «with» or «against» the motion, not «good» or «bad».</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="plausibel" title={<T de="3. Woher kommt das Produkt?" en="3. Where does the product come from?" />}>
        <Box keep kind="supplement" title={<T de={<>Warum ist <M>{t`P = \v F\cdot\v v`}</M> plausibel?</>} en={<>Why is <M>{t`P = \v F\cdot\v v`}</M> plausible?</>} />}>
          <T
            de={<p>Das Skript <em>legt</em> die Leistung durch <M>{t`P = \v F\cdot\v v_A`}</M> fest. Hier nur ein Bild, warum das eine sinnvolle Zahl ist: Wir messen, wie stark die Kraft den Punkt auf einem kurzen Wegstück vorwärts «schiebt», und teilen durch die Zeit.</p>}
            en={<p>The notes <em>define</em> the power by <M p=".">{t`P = \v F\cdot\v v_A`}</M> Here is just a picture of why this is a sensible number: we measure how strongly the force «pushes» the point forward over a short stretch, and divide by the time.</p>}
          />
          <StepPlayer
            label={tr('Animation: Warum P = F · v', 'Animation: why P = F · v')}
            steps={[
              { ms: 2500, holdMs: 3500, caption: <T
                de={<>Du siehst den Punkt <M>A</M> mit seiner Geschwindigkeit <M>{t`\v v_A`}</M> (rosa) und der Kraft <M>\v F</M> (rot-orange). Die Frage: Wie stark schiebt <M>\v F</M> den Punkt gerade vorwärts?</>}
                en={<>You see the point <M>A</M> with its velocity <M>{t`\v v_A`}</M> (pink) and the force <M>\v F</M> (red-orange). The question: how strongly does <M>\v F</M> push the point forward right now?</>} /> },
              { ms: 3000, holdMs: 3500, caption: <T
                de={<>In der kurzen Zeit <M>{t`\mathrm{d}t`}</M> wandert <M>A</M> zum Punkt <M p=".">{t`A'`}</M> Das Wegstück ist <M p=".">{t`\mathrm{d}\v r = \v v_A\,\mathrm{d}t`}</M> (Zum Zeichnen: <M p=").">{t`\mathrm{d}t = 0{,}5\,\text{s}`}</M></>}
                en={<>In the short time <M>{t`\mathrm{d}t`}</M> the point <M>A</M> moves to <M p=".">{t`A'`}</M> The stretch is <M p=".">{t`\mathrm{d}\v r = \v v_A\,\mathrm{d}t`}</M> (For drawing: <M p=").">{t`\mathrm{d}t = 0.5\,\text{s}`}</M></>} /> },
              { ms: 3000, holdMs: 4000, caption: <T
                de={<>Der grüne Streifen ist der Teil von <M>\v F</M> längs des Weges, <M p=".">{t`|\v F|\cos\alpha`}</M> Der Rest steht quer und schiebt <M>A</M> nicht weiter.</>}
                en={<>The green strip is the part of <M>\v F</M> along the path, <M p=".">{t`|\v F|\cos\alpha`}</M> The rest is across and does not push <M>A</M> any further.</>} /> },
              { ms: 3000, holdMs: 4500, caption: <T
                de={<>Streifenlänge mal Weg ist die Fläche des Rechtecks: <M p=".">{t`|\v F|\cos\alpha\cdot|\mathrm{d}\v r| = 2{,}6\,\text{N}\cdot 1{,}0\,\text{m}`}</M> Das ist die «Schiebe-Wirkung» <M>{t`\v F\cdot\mathrm{d}\v r`}</M> auf diesem Stück. (Die Physik nennt sie Arbeit; das kommt später.)</>}
                en={<>Strip length times path is the area of the rectangle: <M p=".">{t`|\v F|\cos\alpha\cdot|\mathrm{d}\v r| = 2.6\,\text{N}\cdot 1.0\,\text{m}`}</M> This is the «push effect» <M>{t`\v F\cdot\mathrm{d}\v r`}</M> over this stretch. (Physics calls it work; that comes later.)</>} /> },
              { ms: 3500, caption: <T
                de={<>Teilt man durch <M p=",">{t`\mathrm{d}t`}</M> wird die Breite <M>{t`|\mathrm{d}\v r|/\mathrm{d}t`}</M> zu <M p=".">{t`|\v v_A|`}</M> Die Fläche ist jetzt «Schiebe-Wirkung pro Zeit»: <M p=".">{t`P = |\v F|\cos\alpha\cdot|\v v_A| = \v F\cdot\v v_A`}</M></>}
                en={<>Dividing by <M p=",">{t`\mathrm{d}t`}</M> the width <M>{t`|\mathrm{d}\v r|/\mathrm{d}t`}</M> becomes <M p=".">{t`|\v v_A|`}</M> The area is now «push effect per time»: <M p=".">{t`P = |\v F|\cos\alpha\cdot|\v v_A| = \v F\cdot\v v_A`}</M></>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={whyScene} step={step} t={tt} />}
          </StepPlayer>
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ohne" title={<T de="4. Kräfte ohne Leistung (Fig. 5.2)" en="4. Forces without power (Fig. 5.2)" />}>
        <Box kind="lecture" src={<Src p={33} fig="Fig. 5.2" />} title={<T de="Figur 5.2: Kraft ohne Leistung" en={<>Figure 5.2: <De en="force without power">Kraft ohne Leistung</De></>} />}>
          <T
            de={<>
              <p><b>Normalkraft</b> (links): Eine Kugel liegt auf einer gekrümmten Fläche. Im Berührpunkt: <M>\v N</M> auf der Kugel (Punkt <M p=")">{t`M_1`}</M> und <M>{t`-\v N`}</M> auf der Fläche (Punkt <M p=").">{t`M_2`}</M> Beide Punkte haben eine Geschwindigkeit, <M>{t`\v v_1`}</M> und <M p=",">{t`\v v_2`}</M> beide tangential an die Fläche; die Winkelzeichen zeigen, dass <M>\v N</M> darauf senkrecht steht.</p>
              <p><b>Lorentzkraft</b> (rechts): Eine Ladung <M>{t`+q`}</M> mit der Geschwindigkeit <M p=",">\v v</M> dem Feld <M>\v B</M> und der Kraft <M p=".">\v F</M> Die Figur zeichnet <M>\v F</M> senkrecht zu <M>\v v</M> (und zu <M p=").">\v B</M></p>
            </>}
            en={<>
              <p><b><De en="normal force">Normalkraft</De></b> (left): a ball lies on a curved surface. At the contact point: <M>\v N</M> on the ball (point <M p=")">{t`M_1`}</M> and <M>{t`-\v N`}</M> on the surface (point <M p=").">{t`M_2`}</M> Both points have a velocity, <M>{t`\v v_1`}</M> and <M p=",">{t`\v v_2`}</M> both tangent to the surface; the right-angle marks show that <M>\v N</M> is perpendicular to them.</p>
              <p><b><De en="Lorentz force">Lorentzkraft</De></b> (right): a charge <M>{t`+q`}</M> with velocity <M p=",">\v v</M> the field <M>\v B</M> and the force <M p=".">\v F</M> The figure draws <M>\v F</M> perpendicular to <M>\v v</M> (and to <M p=").">\v B</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Die Normalkraft.</b> «Normal» heisst «senkrecht»: Die Fläche drückt auf die Kugel, und zwar senkrecht zur Fläche. Nach dem <a href="#reaktionsprinzip">Reaktionsprinzip</a> (S. 30) drückt die Kugel mit <M>{t`-\v N`}</M> zurück auf die Fläche. <M>{t`M_1`}</M> und <M>{t`M_2`}</M> sind zwei Namen für <em>denselben Ort</em>: <M>{t`M_1`}</M> ist der Punkt der Kugel, <M>{t`M_2`}</M> der Punkt der Fläche. Sie dürfen verschieden schnell sein (die Kugel kann gleiten). Aber beide Geschwindigkeiten liegen in der Berührebene: Die Kugel dringt nicht ein und hebt nicht ab. Darum gilt <M>{t`\v N\cdot\v v_1 = 0`}</M> und <M p=".">{t`(-\v N)\cdot\v v_2 = 0`}</M></p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Wie schnell die Punkte auch gleiten – <M>{t`s_1`}</M> und <M>{t`s_2`}</M> – die beiden Leistungen bleiben null. Der dritte Schieber <M>u</M> ist eine Ergänzung, nicht aus dem Skript: Er lässt die Fläche selbst längs <M>\v N</M> fahren, wie den Boden eines Lifts.</p>
          </>}
          en={<>
            <p className="keep"><b>The normal force.</b> «Normal» means «perpendicular»: the surface presses on the ball, perpendicular to the surface. By the <a href="#reaktionsprinzip">reaction principle</a> (p. 30) the ball presses back on the surface with <M p=".">{t`-\v N`}</M> <M>{t`M_1`}</M> and <M>{t`M_2`}</M> are two names for <em>the same place</em>: <M>{t`M_1`}</M> is the point of the ball, <M>{t`M_2`}</M> the point of the surface. They may move at different speeds (the ball can slide). But both velocities lie in the contact plane: the ball neither digs in nor lifts off. So <M>{t`\v N\cdot\v v_1 = 0`}</M> and <M p=".">{t`(-\v N)\cdot\v v_2 = 0`}</M></p>
            <p className="lp-see"><b>What you should see:</b> However fast the points slide – <M>{t`s_1`}</M> and <M>{t`s_2`}</M> – both powers stay zero. The third slider <M>u</M> is a supplement, not from the notes: it lets the surface itself move along <M p=",">\v N</M> like the floor of a lift.</p>
          </>}
        />
        <NormalForceFigure />
        <T
          de={<>
            <p className="keep"><b>Die Lorentzkraft.</b> Auf eine bewegte Ladung <M>q</M> wirkt in einem Magnetfeld <M>\v B</M> die Kraft <M p=".">{t`\v F = q\,\v v\times\v B`}</M> Die Formel steht nicht auf der Seite (das Skript zeichnet nur die rechten Winkel); aus der Physik bekannt, erklärt sie, warum <M>\v F</M> senkrecht auf <M>\v v</M> steht. Das <a href="#vektoren">Kreuzprodukt</a> steht nämlich immer senkrecht auf beiden Faktoren. Also ist <M>{t`\v F\cdot\v v = 0`}</M> in jedem Augenblick, wohin sich die Ladung auch bewegt.</p>
            <p className="lp-see"><b>Was du sehen sollst:</b> Die Ladung läuft herum, <M>\v v</M> und <M>\v F</M> drehen mit, und das Winkelzeichen bleibt ein rechter Winkel. Die Leistung zeigt dauernd <M p=".">0</M></p>
          </>}
          en={<>
            <p className="keep"><b>The Lorentz force.</b> A moving charge <M>q</M> in a magnetic field <M>\v B</M> feels the force <M p=".">{t`\v F = q\,\v v\times\v B`}</M> The formula is not on the page (the notes draw only the right angles); known from physics, it explains why <M>\v F</M> is perpendicular to <M p=".">\v v</M> The <a href="#vektoren">cross product</a> is always perpendicular to both factors. So <M>{t`\v F\cdot\v v = 0`}</M> at every instant, wherever the charge moves.</p>
            <p className="lp-see"><b>What you should see:</b> The charge runs around, <M>\v v</M> and <M>\v F</M> turn with it, and the angle mark stays a right angle. The power shows <M p=".">0</M> all the time.</p>
          </>}
        />
        <LorentzFigure />
        <T
          de={<p>Wo <M>\v F</M> immer quer zur Bewegung steht, kann die Kraft die Bewegung nur <em>ablenken</em>. Das ist der Sinn von «leistungslos». (Ergänzung, kommt mit der Dynamik: Das Tempo der Ladung bleibt dabei gleich, und wirkt nur diese Kraft, läuft sie auf einem Kreis.)</p>}
          en={<p>Where <M>\v F</M> is always across the motion, the force can only <em>deflect</em> the motion. That is the point of «<De en="without power">leistungslos</De>». (Supplement, comes with dynamics: the charge keeps its speed, and if only this force acts it runs on a circle.)</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="alltag" title={<T de="5. Watt im Alltag" en="5. Watts in everyday life" />}>
        <Box kind="supplement" title={<T de="Wie viel ist ein Watt?" en="How much is a watt?" />}>
          <T
            de={<>
              <p>Ein Watt ist eine Kraft von <M>{t`1\,\text{N}`}</M> (ungefähr das Gewicht einer Tafel Schokolade), die einen Punkt mit <M>{t`1\,\text{m/s}`}</M> (ein langsamer Schritt) mit sich zieht. Die Beispiele sind gerundet und nur als Grössenordnung gemeint; die Skala ist logarithmisch, jeder Strich ist zehnmal mehr als der vorige.</p>
              <WattScale />
              <p>Ein Velofahrer, der dauernd gegen Luft und Reifen ankämpft, bringt etwa <M>{t`100`}</M> bis <M>{t`200\,\text{W}`}</M> auf die Strasse; ein Auto bei Tempo 100 braucht etwa hundertmal so viel. In jedem Beispiel ist es dieselbe Rechnung: Kraft mal Geschwindigkeit. Die Widerstandskraft (Luft, Reifen) hat dabei eine <em>negative</em> Leistung; Beine oder Motor müssen genau so viel positive Leistung liefern, damit das Tempo gleich bleibt.</p>
            </>}
            en={<>
              <p>One watt is a force of <M>{t`1\,\text{N}`}</M> (about the weight of a bar of chocolate) moving a point along at <M>{t`1\,\text{m/s}`}</M> (a slow step). The examples are rounded and meant as orders of magnitude only; the scale is logarithmic, every mark is ten times the one before.</p>
              <WattScale />
              <p>A cyclist who keeps fighting the air and the tyres puts about <M>{t`100`}</M> to <M>{t`200\,\text{W}`}</M> onto the road; a car at 100 km/h needs about a hundred times as much. In every example it is the same calculation: force times velocity. The resisting force (air, tyres) has a <em>negative</em> power; legs or engine must supply exactly as much positive power to keep the speed constant.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section long id="missverstaendnisse" title={<T de="6. Häufige Missverständnisse" en="6. Common misconceptions" />}>
        <Box kind="misconception" title={<T de="«Wer ein schweres Gewicht festhält, leistet Leistung.»" en="“Whoever holds a heavy weight up is delivering power.”" />}>
          <T
            de={<>Mechanisch nicht: Die Kraft ist gross, aber der Punkt steht still, <M>{t`\v v_A = \v 0`}</M> also <M p=".">{t`P = \v F\cdot\v 0 = 0`}</M> Dass die Arme trotzdem müde werden, liegt daran, dass die Muskeln innen dauernd arbeiten und Wärme erzeugen – das zählt hier nicht. Die Formel kennt nur Kraft <em>und</em> Bewegung des Angriffspunkts.</>}
            en={<>Mechanically no: the force is large, but the point stands still, <M>{t`\v v_A = \v 0`}</M> so <M p=".">{t`P = \v F\cdot\v 0 = 0`}</M> The arms still get tired because the muscles keep working inside and produce heat – that does not count here. The formula knows only force <em>and</em> the motion of the point of application.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Negative Leistung heisst: Die Kraft tut nichts, oder sie ist schlecht.»" en="“Negative power means: the force does nothing, or it is bad.”" />}>
          <T
            de={<>Das Vorzeichen sagt nur, ob die Kraft mit der Bewegung geht (<M p=")">{t`P > 0`}</M> oder gegen sie (<M p=").">{t`P < 0`}</M> Eine Bremse hat <em>immer</em> <M>{t`P < 0`}</M> und ist genau das, was du willst. «Widerstandskraft» ist keine Wertung, nur eine Richtung. Null gibt es erst, wenn die Kraft quer steht.</>}
            en={<>The sign only says whether the force goes with the motion (<M p=")">{t`P > 0`}</M> or against it (<M p=").">{t`P < 0`}</M> A brake <em>always</em> has <M>{t`P < 0`}</M> and is exactly what you want. «<De en="resisting force">Widerstandskraft</De>» is not a judgement, just a direction. Zero only comes when the force is across the motion.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Normalkraft leistet nie etwas.»" en="“The normal force never does anything.”" />}>
          <T
            de={<>Sie leistet nichts, <em>wenn sich die Fläche im Berührpunkt nicht längs <M>\v N</M> bewegt</em> – wie in Fig. 5.2. Steht ein Mensch im Lift, der mit <M>u</M> nach oben fährt, dann ist <M>\v N</M> (vom Boden auf den Menschen) parallel zur Bewegung des Berührpunkts: <M>{t`P = N\,u > 0`}</M> auf den Menschen, und <M>{t`-N\,u`}</M> auf den Boden. Der Schieber <M>u</M> in der Figur oben zeigt es. Der Satz heisst also nur: Eine Kraft senkrecht zur Bewegung leistet nichts.</>}
            en={<>It does nothing <em>if the surface does not move along <M>\v N</M> at the contact point</em> – as in Fig. 5.2. If a person stands in a lift moving up with <M p=",">u</M> then <M>\v N</M> (from the floor on the person) is parallel to the motion of the contact point: <M>{t`P = N\,u > 0`}</M> on the person, and <M>{t`-N\,u`}</M> on the floor. The slider <M>u</M> in the figure above shows it. So the statement really is: a force perpendicular to the motion does nothing.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Leistung hängt von der Geschwindigkeit des Körpers ab.»" en="“The power depends on the velocity of the body.”" />}>
          <T
            de={<>Sie hängt von <M>{t`\v v_A`}</M> ab, der Geschwindigkeit des <em>Angriffspunkts</em> – und die ist bei einem drehenden Körper von Punkt zu Punkt verschieden. Dieselbe Kraft <M>\v F</M> am ruhenden Berührpunkt eines <a href="#rollen">rollenden Rades</a> hat <M p=",">{t`P = 0`}</M> an der Nabe oder am obersten Punkt dagegen nicht.</>}
            en={<>It depends on <M>{t`\v v_A`}</M> the velocity of the <em>point of application</em> – and in a turning body that differs from point to point. The same force <M>\v F</M> at the resting contact point of a <a href="#rollen">rolling wheel</a> has <M p=",">{t`P = 0`}</M> at the hub or at the top point it does not.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="merke" title={<T de="7. Das Wichtigste" en="7. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=",">{t`P = \v F\cdot\v v_A`}</M> eine Zahl in Watt, <M p=".">{t`\text{W} = \text{N}\,\text{m}/\text{s}`}</M> <M>{t`\v v_A`}</M> ist die Geschwindigkeit des Angriffspunkts.</li>
              <li><M p=":">{t`P = |\v F|\,|\v v_A|\cos\alpha`}</M> Nur der Teil von <M>\v F</M> längs der Bewegung zählt.</li>
              <li><b>Antriebskraft</b> <M p=",">{t`\alpha < \tfrac{\pi}{2}`}</M> <M p=";">{t`P > 0`}</M> <b>Widerstandskraft</b> <M p=",">{t`\alpha > \tfrac{\pi}{2}`}</M> <M p=";">{t`P < 0`}</M> <b>leistungslos</b> <M p=",">{t`\alpha = \tfrac{\pi}{2}`}</M> <M p=".">{t`P = 0`}</M></li>
              <li>Fig. 5.2: Normalkraft und Lorentzkraft stehen senkrecht auf den Geschwindigkeiten, darum <M p=".">{t`P = 0`}</M></li>
            </ul>}
            en={<ul>
              <li><M p=",">{t`P = \v F\cdot\v v_A`}</M> a number in watts, <M p=".">{t`\text{W} = \text{N}\,\text{m}/\text{s}`}</M> <M>{t`\v v_A`}</M> is the velocity of the point of application.</li>
              <li><M p=":">{t`P = |\v F|\,|\v v_A|\cos\alpha`}</M> only the part of <M>\v F</M> along the motion counts.</li>
              <li><b><De en="driving force">Antriebskraft</De></b> <M p=",">{t`\alpha < \tfrac{\pi}{2}`}</M> <M p=";">{t`P > 0`}</M> <b><De en="resisting force">Widerstandskraft</De></b> <M p=",">{t`\alpha > \tfrac{\pi}{2}`}</M> <M p=";">{t`P < 0`}</M> <b><De en="without power">leistungslos</De></b> <M p=",">{t`\alpha = \tfrac{\pi}{2}`}</M> <M p=".">{t`P = 0`}</M></li>
              <li>Fig. 5.2: normal force and Lorentz force are perpendicular to the velocities, so <M p=".">{t`P = 0`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Verbindungen:</b> Das <a href="#vektoren">Skalarprodukt</a> (S. 5) steckt in der Formel, die <a href="#kraft">punktgebundene Kraft</a> liefert <M>A</M> und <M>\v F</M> und die Geschwindigkeit eines Punktes eines drehenden Körpers kennst du aus der <a href="#rotation">Rotation</a>. Im nächsten Schritt wird dort <M>{t`\v v_A = \v\omega\times\v{OP}`}</M> eingesetzt – und es taucht eine neue Grösse auf, das <a href="#leistung-rotation">Moment</a>.</p>}
          en={<p className="connections"><b>Connections:</b> the <a href="#vektoren">dot product</a> (p. 5) sits in the formula, the <a href="#kraft">point-bound force</a> supplies <M>A</M> and <M>\v F</M> and the velocity of a point of a turning body you know from <a href="#rotation">rotation</a>. In the next step <M>{t`\v v_A = \v\omega\times\v{OP}`}</M> is put in – and a new quantity appears, the <a href="#leistung-rotation">moment</a>.</p>}
        />
      </Section>
    </article>
  );
}
