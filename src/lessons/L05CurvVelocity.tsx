import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AnimFigure } from '../viz/anim/AnimFigure';
import { erhoScene } from '../viz/anim/erhoScene';
import { CurvilinearVelocity, PathVelocity } from '../viz/VelocityFigures';
import { EX10, ex10, ex10v } from '../physics/velocity';

const t = String.raw;

export default function L05CurvVelocity() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In der kartesischen Basis war die Geschwindigkeit einfach: jede Koordinate ableiten. In Zylinder- und Kugelkoordinaten kommt ein Term dazu, der vom <em>Drehen</em> der Basisvektoren stammt. Diese Lektion zeigt, woher er kommt und was er bedeutet.</p>}
        en={<p className="lede">In the Cartesian basis velocity was simple: differentiate each coordinate. In cylindrical and spherical coordinates an extra term appears that comes from the <em>turning</em> of the basis vectors. This lesson shows where it comes from and what it means.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Du sitzt auf einem Karussell, immer im gleichen Abstand <M>\rho</M> von der Mitte und auf gleicher Höhe <M p=".">z</M> <M>\rho</M> und <M>z</M> ändern sich also nicht – trotzdem bewegst du dich! Die Bewegung steckt ganz im Drehen, also im Winkel <M p=".">\varphi</M> Du bist umso schneller, je schneller das Karussell dreht <M>{t`(\dot\varphi)`}</M> und je weiter aussen du sitzt <M p=".">{t`(\rho)`}</M> Genau das ist der neue Term <M p=".">{t`\rho\dot\varphi\,\v e_\varphi`}</M></p>}
          en={<p>You sit on a merry-go-round, always at the same distance <M>\rho</M> from the centre and at the same height <M p=".">z</M> So <M>\rho</M> and <M>z</M> do not change – and yet you move! The motion is all in the turning, i.e. in the angle <M p=".">\varphi</M> Your speed is the larger, the faster the merry-go-round turns <M>{t`(\dot\varphi)`}</M> and the further out you sit <M p=".">{t`(\rho)`}</M> That is exactly the new term <M p=".">{t`\rho\dot\varphi\,\v e_\varphi`}</M></p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="basis" title={<T de={<>1. <M>{t`\v e_\rho`}</M> und <M>{t`\v e_\varphi`}</M> in kartesischen Komponenten</>} en={<>1. <M>{t`\v e_\rho`}</M> and <M>{t`\v e_\varphi`}</M> in Cartesian components</>} />}>
        <Box kind="lecture" src={<Src p={10} />}>
          <MD>{t`\v e_\rho = \cos\varphi\cdot\v e_x + \sin\varphi\cdot\v e_y, \qquad \v e_\varphi = -\sin\varphi\cdot\v e_x + \cos\varphi\cdot\v e_y`}</MD>
        </Box>
        <T
          de={<p>Am Ende der Lektion <a href="#geschwindigkeit">Geschwindigkeitsvektor &amp; Schnelligkeit</a> blieb ein Term offen: <M p=".">{t`\rho\,\dot{\v e}_\rho`}</M> Um <M>{t`\v e_\rho`}</M> abzuleiten, schreibt die Vorlesung es in der <em>festen</em> kartesischen Basis – deren Vektoren ändern sich nie, also muss man dann nur noch Zahlen ableiten. Schritt 1 und 2 der Animation unten zeigen, woher die beiden Formeln kommen.</p>}
          en={<p>At the end of the lesson <a href="#geschwindigkeit">Velocity vector and speed</a> one term was left open: <M p=".">{t`\rho\,\dot{\v e}_\rho`}</M> To differentiate <M p=",">{t`\v e_\rho`}</M> the lecture writes it in the <em>fixed</em> Cartesian basis – whose vectors never change, so afterwards only numbers have to be differentiated. Steps 1 and 2 of the animation below show where the two formulas come from.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ableitung" title={<T de={<>2. Wie schnell sich <M>{t`\v e_\rho`}</M> dreht</>} en={<>2. How fast <M>{t`\v e_\rho`}</M> turns</>} />}>
        <Box kind="lecture" src={<Src p={10} />}>
          <MD>{t`\dot{\v e}_\rho = (\cos\varphi)^{\cdot}\cdot\v e_x + (\sin\varphi)^{\cdot}\cdot\v e_y`}</MD>
          <MD>{t`\dot{\v e}_\rho = \dot\varphi\,\underbrace{(-\sin\varphi\cdot\v e_x + \cos\varphi\cdot\v e_y)}_{\v e_\varphi}`}</MD>
        </Box>
        <Derivation title={<T de={<><M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> im Bild</>} en={<><M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> in pictures</>} />}>
          <StepPlayer
            label={tr('Animation: Ableitung von e_rho', 'Animation: derivative of e_rho')}
            steps={[
              { ms: 4000, holdMs: 2500, caption: <T
                de={<>Wir schauen von oben auf die <span className="nowrap"><M>xy</M>-Ebene</span>. <M>{t`\v e_\rho`}</M> zeigt von der Achse weg und hat Länge 1. Seine Schatten auf die Achsen sind <M>{t`\cos\varphi`}</M> und <M p=".">{t`\sin\varphi`}</M> Darum <M p=".">{t`\v e_\rho = \cos\varphi\,\v e_x + \sin\varphi\,\v e_y`}</M></>}
                en={<>We look down onto the <span className="nowrap"><M>xy</M>-plane</span>. <M>{t`\v e_\rho`}</M> points away from the axis and has length 1. Its shadows on the axes are <M>{t`\cos\varphi`}</M> and <M p=".">{t`\sin\varphi`}</M> Hence <M p=".">{t`\v e_\rho = \cos\varphi\,\v e_x + \sin\varphi\,\v e_y`}</M></>} /> },
              { ms: 4000, holdMs: 2500, caption: <T
                de={<><M>{t`\v e_\varphi`}</M> ist <M>{t`\v e_\rho`}</M> um <M>{t`90^\circ`}</M> gegen den Uhrzeigersinn gedreht. Dabei wird aus dem Schatten <M>{t`(\cos, \sin)`}</M> der Schatten <M p=".">{t`(-\sin, \cos)`}</M> Das ist die zweite Formel der Vorlesung.</>}
                en={<><M>{t`\v e_\varphi`}</M> is <M>{t`\v e_\rho`}</M> turned by <M>{t`90^\circ`}</M> counter-clockwise. The shadow <M>{t`(\cos, \sin)`}</M> becomes <M p=".">{t`(-\sin, \cos)`}</M> That is the lecture's second formula.</>} /> },
              { ms: 4500, holdMs: 2500, caption: <T
                de={<>Dreht sich <M>M</M> um einen Winkel <M>{t`\Delta\varphi`}</M> weiter (Kreis <M p=")">{t`M'`}</M> dreht sich <M>{t`\v e_\rho`}</M> um genau denselben Winkel. Zum Vergleichen zeichnen wir beide Pfeile am selben Punkt. Die Änderung <M>{t`\Delta\v e_\rho`}</M> (blau) verbindet die beiden Spitzen.</>}
                en={<>If <M>M</M> turns on by an angle <M>{t`\Delta\varphi`}</M> (circle <M p=")">{t`M'`}</M> <M>{t`\v e_\rho`}</M> turns by exactly the same angle. To compare, we draw both arrows at the same point. The change <M>{t`\Delta\v e_\rho`}</M> (blue) joins the two tips.</>} /> },
              { ms: 6500, holdMs: 2500, caption: <T
                de={<>Jetzt wird <M>{t`\Delta\varphi`}</M> immer kleiner. Die Spitze von <M>{t`\v e_\rho`}</M> läuft auf einem Kreis mit Radius 1; die Änderung zeigt deshalb immer mehr entlang dieses Kreises – also in Richtung <M p=".">{t`\v e_\varphi`}</M> Und pro Winkel ist sie gleich lang wie der Radius, also 1 (Kasten). Kurz: <M p=".">{t`\dd\v e_\rho/\dd\varphi = \v e_\varphi`}</M></>}
                en={<>Now <M>{t`\Delta\varphi`}</M> gets smaller and smaller. The tip of <M>{t`\v e_\rho`}</M> runs on a circle of radius 1, so the change points more and more along that circle – i.e. in the direction of <M p=".">{t`\v e_\varphi`}</M> And per angle it is as long as the radius, i.e. 1 (box). In short: <M p=".">{t`\dd\v e_\rho/\dd\varphi = \v e_\varphi`}</M></>} /> },
              { ms: 4000, caption: <T
                de={<>Mit der Zeit: <M>\varphi</M> ändert sich mit der Rate <M p=".">{t`\dot\varphi`}</M> Also dreht sich <M>{t`\v e_\rho`}</M> mit der Rate <M>{t`\dot\varphi`}</M> in Richtung <M p=":">{t`\v e_\varphi`}</M> <M p=".">{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> Der rote Pfeil an der Spitze zeigt das.</>}
                en={<>With time: <M>\varphi</M> changes at the rate <M p=".">{t`\dot\varphi`}</M> So <M>{t`\v e_\rho`}</M> turns at the rate <M>{t`\dot\varphi`}</M> towards <M p=":">{t`\v e_\varphi`}</M> <M p=".">{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> The red arrow at the tip shows it.</>} /> },
            ]}
          >
            {(step, tt) => <AnimFigure build={erhoScene} step={step} t={tt} />}
          </StepPlayer>
          <T
            de={<>
              <p><b>So liest man die Rechnung im Skript:</b></p>
              <ol>
                <li><M>{t`\v e_x`}</M> und <M>{t`\v e_y`}</M> ändern sich nie, also leitet man nur die Zahlen <M>{t`\cos\varphi`}</M> und <M>{t`\sin\varphi`}</M> ab.</li>
                <li><M>\varphi</M> hängt von der Zeit ab. Kettenregel («äussere mal innere Ableitung»): <M>{t`(\cos\varphi)^{\cdot} = -\sin\varphi\cdot\dot\varphi`}</M> und <M p=".">{t`(\sin\varphi)^{\cdot} = \cos\varphi\cdot\dot\varphi`}</M></li>
                <li><M>{t`\dot\varphi`}</M> ausklammern: Übrig bleibt die Klammer <M p=",">{t`-\sin\varphi\,\v e_x + \cos\varphi\,\v e_y`}</M> und das ist genau <M p=".">{t`\v e_\varphi`}</M></li>
              </ol>
            </>}
            en={<>
              <p><b>How to read the calculation in the notes:</b></p>
              <ol>
                <li><M>{t`\v e_x`}</M> and <M>{t`\v e_y`}</M> never change, so only the numbers <M>{t`\cos\varphi`}</M> and <M>{t`\sin\varphi`}</M> are differentiated.</li>
                <li><M>\varphi</M> depends on time. Chain rule (“outer times inner derivative”): <M>{t`(\cos\varphi)^{\cdot} = -\sin\varphi\cdot\dot\varphi`}</M> and <M p=".">{t`(\sin\varphi)^{\cdot} = \cos\varphi\cdot\dot\varphi`}</M></li>
                <li>Factor out <M p=":">{t`\dot\varphi`}</M> what remains is the bracket <M p=",">{t`-\sin\varphi\,\v e_x + \cos\varphi\,\v e_y`}</M> which is exactly <M p=".">{t`\v e_\varphi`}</M></li>
              </ol>
            </>}
          />
        </Derivation>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="zylindrisch" title={<T de="3. Geschwindigkeit in Zylinderkoordinaten" en="3. Velocity in cylindrical coordinates" />}>
        <Box kind="lecture" src={<Src p={10} />}>
          <MD>{t`\boxed{\dot{\v r} = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z = \v v}`}</MD>
        </Box>
        <T
          de={<>
            <p>Aus <a href="#geschwindigkeit">Geschwindigkeitsvektor &amp; Schnelligkeit</a> (S. 9) hatten wir <M p=".">{t`\dot{\v r} = \dot\rho\,\v e_\rho + \rho\,\dot{\v e}_\rho + \dot z\,\v e_z`}</M> Jetzt setzt man <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> ein – fertig. Die drei Terme sind drei Arten, sich zu bewegen:</p>
            <ul className="keep">
              <li><M p=":">{t`\dot\rho\,\v e_\rho`}</M> <b>weg von der Achse</b> (oder hin), so schnell, wie der Abstand <M>\rho</M> wächst.</li>
              <li><M p=":">{t`\rho\dot\varphi\,\v e_\varphi`}</M> <b>rundherum</b>, entlang des Kreises. Auf einem Kreis gilt: Weg ist Radius mal Winkel (Winkel im Bogenmass). Pro Zeit also <M p=".">{t`\rho\cdot\dot\varphi`}</M> Darum steht hier <M p=",">{t`\rho\dot\varphi`}</M> nicht nur <M p=".">{t`\dot\varphi`}</M></li>
              <li><M p=":">{t`\dot z\,\v e_z`}</M> <b>hoch oder runter</b>.</li>
            </ul>
            <p>Im Skript sind die drei Terme von Hand unterstrichen: Jeder ist «Schnelligkeit mal Richtung».</p>
          </>}
          en={<>
            <p>From <a href="#geschwindigkeit">Velocity vector and speed</a> (p. 9) we had <M p=".">{t`\dot{\v r} = \dot\rho\,\v e_\rho + \rho\,\dot{\v e}_\rho + \dot z\,\v e_z`}</M> Now substitute <M>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi`}</M> – done. The three terms are three ways of moving:</p>
            <ul className="keep">
              <li><M p=":">{t`\dot\rho\,\v e_\rho`}</M> <b>away from the axis</b> (or towards it), as fast as the distance <M>\rho</M> grows.</li>
              <li><M p=":">{t`\rho\dot\varphi\,\v e_\varphi`}</M> <b>around</b>, along the circle. On a circle, distance is radius times angle (angle in radians). Per time, therefore, <M p=".">{t`\rho\cdot\dot\varphi`}</M> That is why it says <M p=",">{t`\rho\dot\varphi`}</M> not just <M p=".">{t`\dot\varphi`}</M></li>
              <li><M p=":">{t`\dot z\,\v e_z`}</M> <b>up or down</b>.</li>
            </ul>
            <p>In the notes the three terms are underlined by hand: each is “speed times direction”.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="sphaerisch" title={<T de="4. Geschwindigkeit in Kugelkoordinaten" en="4. Velocity in spherical coordinates" />}>
        <Box kind="lecture" src={<Src p={10} />}>
          <MD>{t`\v r(t) = r(t)\,\v e_r, \qquad \boxed{\dot{\v r}(t) = \dot r\,\v e_r + r\dot\theta\,\v e_\theta + r\sin\theta\,\dot\psi\,\v e_\psi = \v v}`}</MD>
          <T de="Beweis: siehe Hausübung 3." en="Proof: see homework 3 (Hausübung 3)." />
        </Box>
        <T
          de={<>
            <p>Den Beweis macht ihr in der Hausübung. Verstehen kann man die Formel schon jetzt mit derselben Regel «Weg ist Radius mal Winkel»:</p>
            <ul className="keep">
              <li><M p=":">{t`\dot r\,\v e_r`}</M> <b>nach aussen</b> (oder innen), Betrag <M p=".">{t`\dot r`}</M></li>
              <li><M p=":">{t`r\dot\theta\,\v e_\theta`}</M> entlang des <b>Meridians</b>. Das ist ein Kreis mit Radius <M p=",">r</M> also Betrag <M p=".">{t`r\cdot\dot\theta`}</M></li>
              <li><M p=":">{t`r\sin\theta\,\dot\psi\,\v e_\psi`}</M> entlang des <b>Breitenkreises</b>. Sein Radius ist nur <M>{t`r\sin\theta`}</M> (am Pol 0, am Äquator <M p=").">r</M> also Betrag <M p=".">{t`r\sin\theta\cdot\dot\psi`}</M></li>
            </ul>
            <p>Das sind genau die Längenfaktoren <M p=",">1</M> <M>r</M> und <M>{t`r\sin\theta`}</M> aus der Lektion <a href="#basen">Basen</a>. Im Bild kannst du jede der drei Raten einzeln einstellen und zusehen, wohin sich <M>M</M> bewegt.</p>
          </>}
          en={<>
            <p>The proof is done in the homework. The formula can already be understood with the same rule “distance is radius times angle”:</p>
            <ul className="keep">
              <li><M p=":">{t`\dot r\,\v e_r`}</M> <b>outwards</b> (or inwards), speed <M p=".">{t`\dot r`}</M></li>
              <li><M p=":">{t`r\dot\theta\,\v e_\theta`}</M> along the <b>meridian</b>. That is a circle of radius <M p=",">r</M> so speed <M p=".">{t`r\cdot\dot\theta`}</M></li>
              <li><M p=":">{t`r\sin\theta\,\dot\psi\,\v e_\psi`}</M> along the <b>circle of latitude</b>. Its radius is only <M>{t`r\sin\theta`}</M> (0 at the pole, <M>r</M> at the equator), so speed <M p=".">{t`r\sin\theta\cdot\dot\psi`}</M></li>
            </ul>
            <p>These are exactly the length factors <M p=",">1</M> <M>r</M> and <M>{t`r\sin\theta`}</M> from the lesson <a href="#basen">Bases</a>. In the figure you can set each of the three rates separately and watch where <M>M</M> moves.</p>
          </>}
        />
        <CurvilinearVelocity />
        <T
          de={<ul className="observe">
            <li>Die rot gestrichelte Linie ist die <b>Bahn</b>, die <M>M</M> mit den eingestellten Raten fährt. <M>{t`\v v`}</M> liegt immer tangential an ihr. Ändert man eine Rate, bleibt <M>M</M> stehen und die Bahn biegt ab diesem Punkt anders weiter.</li>
            <li>Zylindrisch, nur <M>{t`\dot\varphi \ne 0`}</M> (die anderen auf 0): <M>M</M> fährt auf einem Kreis – das ist die <a href="#kreisbewegung">Kreisbewegung</a> (S. 11).</li>
            <li>Zylindrisch, nur <M p=":">{t`\dot\rho \ne 0`}</M> <M>M</M> fährt geradeaus von der Achse weg.</li>
            <li>Mit <M>{t`\dot\varphi`}</M> und <M>{t`\dot z`}</M> zusammen entsteht eine Schraubenlinie (wie in <a href="#geschwindigkeit">Geschwindigkeitsvektor &amp; Schnelligkeit</a>).</li>
            <li>Sphärisch: Je näher <M>M</M> an einem Pol ist (<M>\theta</M> nahe bei <M>0</M> oder bei <M p="),">{t`180^\circ`}</M> desto kürzer wird der <span className="nowrap"><M>{t`\v e_\psi`}</M>-Anteil</span> bei gleichem <M p=".">{t`\dot\psi`}</M></li>
          </ul>}
          en={<ul className="observe">
            <li>The red dashed line is the <b>path</b> that <M>M</M> follows with the chosen rates. <M>{t`\v v`}</M> is always tangent to it. Changing a rate keeps <M>M</M> in place and the path bends differently from that point on.</li>
            <li>Cylindrical, only <M>{t`\dot\varphi \ne 0`}</M> (the others at 0): <M>M</M> travels on a circle – the <a href="#kreisbewegung">circular motion</a> of p. 11.</li>
            <li>Cylindrical, only <M p=":">{t`\dot\rho \ne 0`}</M> <M>M</M> moves straight away from the axis.</li>
            <li>With <M>{t`\dot\varphi`}</M> and <M>{t`\dot z`}</M> together you get a helix (as in <a href="#geschwindigkeit">Velocity vector and speed</a>).</li>
            <li>Spherical: the closer <M>M</M> is to a pole (<M>\theta</M> near <M>0</M> or near <M p="),">{t`180^\circ`}</M> the shorter the <span className="nowrap"><M>{t`\v e_\psi`}</M>-part</span> for the same <M p=".">{t`\dot\psi`}</M></li>
          </ul>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="beispiel" title={<T de="5. Beispiel aus der Vorlesung" en="5. Example from the lecture" />}>
        <Box kind="lecture" src={<Src p={10} />}>
          <MD>{tr(t`\text{Gegeben: } \v r = \begin{pmatrix} at \\ at \\ b a^2 t^2 \end{pmatrix} \ \text{(Bahnkurve von } M\text{ in kartesischer Basis)}, \qquad \text{Gesucht: } \v v(t),\ \dot s(t),\ \v\tau(t)`, t`\text{Given: } \v r = \begin{pmatrix} at \\ at \\ b a^2 t^2 \end{pmatrix} \ \text{(trajectory of } M\text{ in the Cartesian basis)}, \qquad \text{Wanted: } \v v(t),\ \dot s(t),\ \v\tau(t)`)}</MD>
        </Box>
        <Box keep kind="supplement" title={<T de="Lösung (im Skript nicht ausgeführt)" en="Solution (not worked out in the notes)" />}>
          <T
            de={<ol>
              <li><b>Geschwindigkeit:</b> jede Komponente nach <M>t</M> ableiten (kartesische Basis, <a href="#geschwindigkeit">Geschwindigkeitsvektor &amp; Schnelligkeit</a>): <M p=".">{t`\v v(t) = (a,\ a,\ 2ba^2t)`}</M></li>
              <li><b>Schnelligkeit:</b> die Länge von <M p=".">{t`\v v`}</M> Sie wächst mit der Zeit:<MD>{t`\dot s = \sqrt{a^2 + a^2 + 4b^2a^4t^2} = |a|\sqrt{2 + 4b^2a^2t^2}`}</MD></li>
              <li><b>Richtung:</b> <M>{t`\v v`}</M> durch seine Länge teilen: <M p=".">{t`\v\tau = \v v/\dot s`}</M> Bei <M>{t`t = 0`}</M> ist <M p=":">{t`\v\tau = (1, 1, 0)/\sqrt2`}</M> waagrecht, entlang der Diagonalen <M p=".">{t`x = y`}</M> Später zeigt <M>{t`\v\tau`}</M> immer steiler nach oben.</li>
            </ol>}
            en={<ol>
              <li><b>Velocity:</b> differentiate each component with respect to <M>t</M> (Cartesian basis, <a href="#geschwindigkeit">Velocity vector and speed</a>): <M p=".">{t`\v v(t) = (a,\ a,\ 2ba^2t)`}</M></li>
              <li><b>Speed:</b> the length of <M p=".">{t`\v v`}</M> It grows with time:<MD>{t`\dot s = \sqrt{a^2 + a^2 + 4b^2a^4t^2} = |a|\sqrt{2 + 4b^2a^2t^2}`}</MD></li>
              <li><b>Direction:</b> divide <M>{t`\v v`}</M> by its length: <M p=".">{t`\v\tau = \v v/\dot s`}</M> At <M>{t`t = 0`}</M> <M p=":">{t`\v\tau = (1, 1, 0)/\sqrt2`}</M> horizontal, along the diagonal <M p=".">{t`x = y`}</M> Later <M>{t`\v\tau`}</M> points more and more steeply upwards.</li>
            </ol>}
          />
          <T
            de={<p className="vdemo-note">Einheiten: <M>{t`at`}</M> ist eine Länge, also hat <M>a</M> die Einheit m/s. Damit auch <M>{t`ba^2t^2`}</M> eine Länge ist, muss <M>b</M> die Einheit 1/m haben. Im Bild: <M p=",">{t`a = 0{,}5`}</M> <M p=".">{t`b = 0{,}6`}</M></p>}
            en={<p className="vdemo-note">Units: <M>{t`at`}</M> is a length, so <M>a</M> has the unit m/s. For <M>{t`ba^2t^2`}</M> to be a length too, <M>b</M> must have the unit 1/m. In the figure: <M p=",">{t`a = 0.5`}</M> <M p=".">{t`b = 0.6`}</M></p>}
          />
        </Box>
        <PathVelocity r={ex10} v={ex10v} T={EX10.T} t0={1.5} camera={[3.6, -4.2, 2.6]} target={[0.7, 0.7, 0.6]}
          note={tr(<>Die Bahn ist eine Parabel über der Diagonalen <M p=".">{t`x = y`}</M> Spiel die Bewegung ab: <M>{t`\v v`}</M> wird länger und steiler.</>, <>The path is a parabola above the diagonal <M p=".">{t`x = y`}</M> Play the motion: <M>{t`\v v`}</M> gets longer and steeper.</>)} />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section long id="missverstaendnisse" title={<T de="6. Häufige Missverständnisse" en="6. Common misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<M p=".">{t`\v v = \dot\rho\,\v e_\rho + \dot\varphi\,\v e_\varphi + \dot z\,\v e_z`}</M>»</>} en={<>“<M p=".">{t`\v v = \dot\rho\,\v e_\rho + \dot\varphi\,\v e_\varphi + \dot z\,\v e_z`}</M>”</>} />}>
          <T de={<>Da fehlt das <M p=".">\rho</M> Prüfe die Einheiten: <M>{t`\dot\varphi`}</M> hat die Einheit 1/s (Winkel pro Zeit), eine Geschwindigkeit braucht m/s. Erst <M>{t`\rho\dot\varphi`}</M> ist eine Geschwindigkeit in m/s: Weg auf dem Kreis ist Radius mal Winkel.</>} en={<>The <M>\rho</M> is missing. Check the units: <M>{t`\dot\varphi`}</M> has the unit 1/s (angle per time), a velocity needs m/s. Only <M>{t`\rho\dot\varphi`}</M> is a speed: distance on the circle is radius times angle.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v v`}</M> liegt immer tangential am Kreis um die <span className="nowrap"><M>z</M>-Achse</span>.»</>} en={<>“<M>{t`\v v`}</M> is always tangent to the circle around the <span className="nowrap"><M>z</M>-axis</span>.”</>} />}>
          <T de={<>Nein. Dieser Kreis ist nur die <span className="nowrap"><M>\varphi</M>-Koordinatenlinie</span> durch <M p=",">M</M> nicht die Bahn. <M>{t`\v v`}</M> liegt tangential an der <b>Bahn</b>. Ist <M p=",">{t`\dot\rho \ne 0`}</M> wird die Bahn eine Spirale, und <M>{t`\v v`}</M> zeigt schräg nach aussen oder innen. Nur wenn sich allein <M>\varphi</M> ändert, ist die Bahn der Kreis selbst.</>}
            en={<>No. That circle is only the <span className="nowrap"><M>\varphi</M>-coordinate line</span> through <M p=",">M</M> not the path. <M>{t`\v v`}</M> is tangent to the <b>path</b>. With <M p=",">{t`\dot\rho \ne 0`}</M> the path becomes a spiral and <M>{t`\v v`}</M> points obliquely outwards or inwards. Only when <M>\varphi</M> alone changes is the path the circle itself.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Ändern sich <M>\rho</M> und <M>z</M> nicht, steht der Punkt still.»</>} en={<>“If <M>\rho</M> and <M>z</M> do not change, the point is at rest.”</>} />}>
          <T de={<>Nein – das Karussell. Mit <M>{t`\dot\rho = \dot z = 0`}</M> bleibt <M p=",">{t`\v v = \rho\dot\varphi\,\v e_\varphi`}</M> eine Kreisbewegung.</>} en={<>No – the merry-go-round. With <M>{t`\dot\rho = \dot z = 0`}</M> what remains is <M p=",">{t`\v v = \rho\dot\varphi\,\v e_\varphi`}</M> a circular motion.</>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="ausblick" title={<T de="7. Das Wichtigste" en="7. The essentials" />}>
        <Box kind="key">
          <MD>{t`\dot{\v e}_\rho = \dot\varphi\,\v e_\varphi, \qquad \v v = \dot\rho\,\v e_\rho + \rho\dot\varphi\,\v e_\varphi + \dot z\,\v e_z, \qquad \v v = \dot r\,\v e_r + r\dot\theta\,\v e_\theta + r\sin\theta\,\dot\psi\,\v e_\psi`}</MD>
          <T de="Jeder Term ist «Schnelligkeit mal Richtung»; bei Winkeln ist die Schnelligkeit Radius mal Winkelrate." en="Each term is “speed times direction”; for angles the speed is radius times angular rate." />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Bei der Kreisbewegung ist <M>{t`\rho = R`}</M> fest und <M>z</M> fest – es bleibt nur <M>{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> <Src p={11} />.</p>}
          en={<p className="connections"><b>Next:</b> in circular motion <M>{t`\rho = R`}</M> and <M>z</M> are fixed – only <M>{t`\v v = R\dot\varphi\,\v e_\varphi`}</M> remains <Src p={11} />.</p>}
        />
      </Section>
    </article>
  );
}
