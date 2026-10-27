import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { CoordinateExplorer } from '../viz/CoordinateExplorer';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CylBasisAnim } from '../viz/anim/CylBasisAnim';

const t = String.raw;

export default function L03Bases() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Basis sind drei Einheitsvektoren, mit denen man jeden Vektor zusammensetzt. Die Vorlesung verbindet jetzt jedes Koordinatensystem aus der Lektion <a href="#koordinaten">Lage &amp; Koordinaten</a> mit seiner eigenen Basis. Die wichtigste Einsicht: Die zylindrische und die sphärische Basis sehen an jedem Punkt anders aus – und genau das erzeugt später die Zusatzterme in der Geschwindigkeit.</p>}
        en={<p className="lede">A basis is three unit vectors from which every vector is built. The lecture now pairs each coordinate system of the lesson <a href="#koordinaten">Position &amp; coordinates</a> with its own basis. The key insight: the cylindrical and spherical bases look different at every point – and exactly this produces the extra terms in the velocity later.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="komponenten" title={<T de="1. Komponenten in der kartesischen Basis" en="1. Components in the Cartesian basis" />}>
        <Box kind="lecture" src={<Src p={6} />}>
          <T de="Skalare und vektorielle Komponenten:" en={<>Scalar and vector components (<span lang="de">skalare und vektorielle Komponenten</span>):</>} />
          <MD>{t`r_x = \v r\cdot\v e_x = x,\qquad r_y = \v r\cdot\v e_y = y,\qquad r_z = \v r\cdot\v e_z = z`}</MD>
          <T de="Bewegung:" en="Motion:" />
          <MD tag="1">{t`\v r(t) = x(t)\,\v e_x + y(t)\,\v e_y + z(t)\,\v e_z`}</MD>
        </Box>
        <T
          de={<p>Die <b>skalare</b> Komponente <M>{t`r_x`}</M> ist eine Zahl: die Projektion von <M>{t`\v r`}</M> auf die <span className="nowrap"><M>x</M>-Richtung</span>, also das Skalarprodukt mit dem Einheitsvektor (<a href="#vektoren">Vektoren</a>). Die <b>vektorielle</b> Komponente <M>{t`r_x\,\v e_x`}</M> ist der Pfeil dazu. In der kartesischen Basis sind die skalaren Komponenten genau die Koordinaten <M p=".">{t`x, y, z`}</M> Bei einer Bewegung ändern sich in (1) nur die drei Zahlen; die Basisvektoren bleiben fest.</p>}
          en={<p>The <b>scalar</b> component <M>{t`r_x`}</M> is a number: the projection of <M>{t`\v r`}</M> onto the <span className="nowrap"><M>x</M>-direction</span>, i.e. the dot product with the unit vector (<a href="#vektoren">Vectors</a>). The <b>vector</b> component <M>{t`r_x\,\v e_x`}</M> is the corresponding arrow. In the Cartesian basis the scalar components are exactly the coordinates <M p=".">{t`x, y, z`}</M> In a motion only the three numbers in (1) change; the basis vectors stay fixed.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="regel" title={<T de="2. Die Regel: Basis gehört zu Koordinaten" en="2. The rule: a basis belongs to coordinates" />}>
        <Box kind="lecture" src={<Src p={6} />}>
          <T
            de={<p><b>Allgemein:</b> Basis <M>\longleftrightarrow</M> Koordinaten. <b>Basisvektoren:</b> Einheitsvektoren sind parallel bzw. tangential zu Koordinatenlinien im betrachteten Punkt!</p>}
            en={<p><b>In general:</b> basis <M>\longleftrightarrow</M> coordinates. <b>Basis vectors:</b> unit vectors parallel or tangent to the coordinate lines at the point considered!</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep">Das ist ein Rezept in drei Schritten, für jedes Koordinatensystem gleich:</p>
            <ol className="keep">
              <li>Zeichne durch den Punkt <M>M</M> die drei Koordinatenlinien (eine Koordinate läuft, die anderen zwei sind fest – <a href="#koordinaten">Lage &amp; Koordinaten</a>).</li>
              <li>Nimm an jeder Linie in <M>M</M> die Tangente, in die Richtung, in der die Koordinate <em>wächst</em>.</li>
              <li>Mache daraus Einheitsvektoren (Länge 1).</li>
            </ol>
            <p>Bei kartesischen Koordinaten sind die Koordinatenlinien Geraden parallel zu den Achsen. Darum ist die Basis in <M>M</M> dieselbe wie in <M>O</M> – das zeigt die Figur im Skript. Bei krummen Koordinatenlinien (Kreise) ist das nicht mehr so.</p>
          </>}
          en={<>
            <p className="keep">This is a three-step recipe, the same for every coordinate system:</p>
            <ol className="keep">
              <li>Draw the three coordinate lines through the point <M>M</M> (one coordinate runs, the other two are fixed – <a href="#koordinaten">Position &amp; coordinates</a>).</li>
              <li>At <M p=",">M</M> take the tangent to each line, pointing in the direction in which that coordinate <em>increases</em>.</li>
              <li>Make them unit vectors (length 1).</li>
            </ol>
            <p>For Cartesian coordinates the coordinate lines are straight lines parallel to the axes. So the basis at <M>M</M> is the same as at <M>O</M> – this is what the figure in the notes shows. With curved coordinate lines (circles) this is no longer true.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="zylindrisch" title={<T de="3. Zylindrische Basis" en="3. Cylindrical basis (zylindrische Basis)" />}>
        <Box kind="lecture" src={<Src p={6} />}>
          <MD>{t`\v e_\rho,\ \v e_\varphi,\ \v e_z, \qquad \v r = \rho\,\v e_\rho + z\,\v e_z`}</MD>
          <T de={<><M p=",">{t`\v e_\rho(\varphi)`}</M> auch hier sind 3 Informationen nötig! Bewegung:</>} en={<><M p=",">{t`\v e_\rho(\varphi)`}</M> here too, 3 pieces of information are needed! Motion:</>} />
          <MD tag="2">{t`\v r(t) = \rho(t)\cdot\v e_\rho\big(\varphi(t)\big) + z(t)\,\v e_z`}</MD>
        </Box>
        <Derivation title={<T de="das Rezept angewendet, Schritt für Schritt" en="the recipe applied, step by step" />}>
          <StepPlayer
            label={tr('Animation: zylindrische Basis in M', 'Animation: cylindrical basis at M')}
            steps={[
              { ms: 4500, caption: <T
                de={<>Durch <M>M</M> laufen drei Koordinatenlinien: die <span className="nowrap"><M>\rho</M>-Linie</span> (Strahl weg von der <span className="nowrap"><M>z</M>-Achse</span>), die <span className="nowrap"><M>\varphi</M>-Linie</span> (waagrechter Kreis) und die <span className="nowrap"><M>z</M>-Linie</span> (Senkrechte).</>}
                en={<>Three coordinate lines pass through <M p=":">M</M> the <span className="nowrap"><M>\rho</M>-line</span> (ray away from the <span className="nowrap"><M>z</M>-axis</span>), the <span className="nowrap"><M>\varphi</M>-line</span> (horizontal circle) and the <span className="nowrap"><M>z</M>-line</span> (vertical).</>} /> },
              { ms: 2500, holdMs: 2500, caption: <T
                de={<>In <M>M</M> die Tangenten, Länge 1, in Richtung wachsender Koordinate: <M>{t`\v e_\rho`}</M> zeigt von der Achse weg, <M>{t`\v e_\varphi`}</M> entlang des Kreises (von oben gesehen gegen den Uhrzeigersinn), <M>{t`\v e_z`}</M> nach oben. Sie stehen paarweise senkrecht.</>}
                en={<>At <M p=",">M</M> the tangents, length 1, towards increasing coordinate: <M>{t`\v e_\rho`}</M> points away from the axis, <M>{t`\v e_\varphi`}</M> along the circle (counter-clockwise seen from above), <M>{t`\v e_z`}</M> up. They are pairwise perpendicular.</>} /> },
              { ms: 4500, holdMs: 2500, caption: <T
                de={<>Jetzt wandert <M>M</M> auf dem Kreis, <M>\varphi</M> wächst. <M>{t`\v e_\rho`}</M> und <M>{t`\v e_\varphi`}</M> drehen sich mit (grau: ihre alte Lage), <M>{t`\v e_z`}</M> und das kartesische <M>{t`\v e_x`}</M> bleiben gleich. Deshalb schreibt die Vorlesung <M>{t`\v e_\rho(\varphi)`}</M> – die Richtung hängt vom Punkt ab.</>}
                en={<>Now <M>M</M> moves along the circle, <M>\varphi</M> increases. <M>{t`\v e_\rho`}</M> and <M>{t`\v e_\varphi`}</M> turn with it (grey: their old position), <M>{t`\v e_z`}</M> and the Cartesian <M>{t`\v e_x`}</M> stay the same. That is why the lecture writes <M p=":">{t`\v e_\rho(\varphi)`}</M> the direction depends on the point.</>} /> },
              { ms: 4000, caption: <T
                de={<>Der Ortsvektor: <M>\rho</M> Schritte entlang <M p=",">{t`\v e_\rho`}</M> dann <M>z</M> nach oben – man ist bei <M p=".">M</M> Also <M p=".">{t`\v r = \rho\,\v e_\rho + z\,\v e_z`}</M> Es gibt <em>keinen</em> <span className="nowrap"><M>\varphi</M>-Term</span>: Der Winkel steckt in der Richtung von <M p=".">{t`\v e_\rho(\varphi)`}</M></>}
                en={<>The position vector: <M>\rho</M> steps along <M p=",">{t`\v e_\rho`}</M> then <M>z</M> up – and you are at <M p=".">M</M> So <M p=".">{t`\v r = \rho\,\v e_\rho + z\,\v e_z`}</M> There is <em>no</em> <span className="nowrap"><M>\varphi</M>-term</span>: the angle is hidden in the direction of <M p=".">{t`\v e_\rho(\varphi)`}</M></>} /> },
            ]}
          >
            {(step, tt) => <CylBasisAnim step={step} t={tt} />}
          </StepPlayer>
        </Derivation>
        <Box kind="lecture" src={<Src p={10} />} title={<T de="Vorgriff: die Basis in kartesischen Komponenten" en="Preview: the basis in Cartesian components" />}>
          <MD>{t`\v e_\rho = \cos\varphi\,\v e_x + \sin\varphi\,\v e_y, \qquad \v e_\varphi = -\sin\varphi\,\v e_x + \cos\varphi\,\v e_y`}</MD>
          <T
            de={<p>Das ist die Animation in Formeln: <M>{t`\v e_\rho`}</M> ist der Einheitskreis-Punkt beim Winkel <M p=",">\varphi</M> <M>{t`\v e_\varphi`}</M> derselbe um <M>{t`90^\circ`}</M> weitergedreht. Weil beide von <M>\varphi</M> abhängen, ändern sie sich, wenn sich <M>M</M> bewegt – darauf baut die Geschwindigkeit in Zylinderkoordinaten auf (S. 9–10).</p>}
            en={<p>This is the animation as formulas: <M>{t`\v e_\rho`}</M> is the unit-circle point at angle <M p=",">\varphi</M> <M>{t`\v e_\varphi`}</M> the same rotated by a further <M p=".">{t`90^\circ`}</M> Because both depend on <M p=",">\varphi</M> they change when <M>M</M> moves – the velocity in cylindrical coordinates builds on this (pp. 9–10).</p>}
          />
        </Box>
        <Box keep kind="misconception" title={<T de={<>«<M p=".">{t`\v r = \rho\,\v e_\rho + \varphi\,\v e_\varphi + z\,\v e_z`}</M>»</>} en={<>“<M p=".">{t`\v r = \rho\,\v e_\rho + \varphi\,\v e_\varphi + z\,\v e_z`}</M>”</>} />}>
          <T
            de={<>Falsch – das Skript streicht genau das durch (S. 11: <M>{t`(R, \varphi(t), z_0)`}</M> «Falsch!»). <M>\varphi</M> ist ein Winkel, keine Länge, und <M>{t`\v r`}</M> hat gar keine <span className="nowrap"><M>{t`\v e_\varphi`}</M>-Komponente</span>: <M>{t`\v e_\varphi`}</M> steht senkrecht auf der Ebene, in der <M>{t`\v r`}</M> liegt. Beispiel <M p=",">{t`\rho = 1{,}5`}</M> <M p=",">{t`\varphi = 90^\circ`}</M> <M p=":">{t`z = 0`}</M> richtig ist <M p=";">{t`(0;\ 1{,}5;\ 0)`}</M> die falsche Formel landet bei <M p=".">{t`(-1{,}57;\ 1{,}5;\ 0)`}</M></>}
            en={<>Wrong – the notes cross out exactly this (p. 11: <M>{t`(R, \varphi(t), z_0)`}</M> “Falsch!”). <M>\varphi</M> is an angle, not a length, and <M>{t`\v r`}</M> has no <span className="nowrap"><M>{t`\v e_\varphi`}</M>-component</span> at all: <M>{t`\v e_\varphi`}</M> is perpendicular to the plane containing <M p=".">{t`\v r`}</M> Example <M p=",">{t`\rho = 1.5`}</M> <M p=",">{t`\varphi = 90^\circ`}</M> <M p=":">{t`z = 0`}</M> correct is <M p=";">{t`(0, 1.5, 0)`}</M> the wrong formula lands at <M p=".">{t`(-1.57, 1.5, 0)`}</M></>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="sphaerisch" title={<T de="4. Sphärische Basis" en="4. Spherical basis (sphärische Basis)" />}>
        <Box kind="lecture" src={<Src p={7} />}>
          <T de="Sphärische Basis, tangential zu Koordinatenlinien:" en="Spherical basis, tangent to the coordinate lines:" />
          <MD>{t`\v e_r,\ \v e_\theta,\ \v e_\psi, \qquad \v r = r\cdot\v e_r, \qquad \v e_r(\theta, \psi)`}</MD>
        </Box>
        <T
          de={<>
            <p>Dasselbe Rezept mit den Koordinatenlinien aus <a href="#koordinaten">Lage &amp; Koordinaten</a>:</p>
            <ul className="keep">
              <li><M>{t`\v e_r`}</M> entlang der <span className="nowrap"><M>r</M>-Linie</span>: radial nach aussen, weg von <M p=".">O</M></li>
              <li><M>{t`\v e_\theta`}</M> tangential an den Meridian, in Richtung wachsendes <M p=":">\theta</M> «nach Süden».</li>
              <li><M>{t`\v e_\psi`}</M> tangential an den Breitenkreis, in Richtung wachsendes <M p=":">\psi</M> waagrecht «nach Osten».</li>
            </ul>
            <p>Der Ortsvektor hat nur <em>einen</em> Term, <M p=".">{t`\v r = r\,\v e_r`}</M> Beide Winkel stecken in der Richtung von <M p=",">{t`\v e_r(\theta, \psi)`}</M> und wieder sind es drei Informationen. Jetzt hängen alle drei Basisvektoren vom Punkt ab (<M>{t`\v e_\psi`}</M> allerdings nur von <M p=").">\psi</M> Am Ende dieser Lektion kannst du sie im Explorer an jedem Punkt ansehen (Modus «Sphärisch»).</p>
          </>}
          en={<>
            <p>The same recipe with the coordinate lines from <a href="#koordinaten">Position &amp; coordinates</a>:</p>
            <ul className="keep">
              <li><M>{t`\v e_r`}</M> along the <span className="nowrap"><M>r</M>-line</span>: radially outwards, away from <M p=".">O</M></li>
              <li><M>{t`\v e_\theta`}</M> tangent to the meridian, towards increasing <M p=":">\theta</M> “south”.</li>
              <li><M>{t`\v e_\psi`}</M> tangent to the circle of latitude, towards increasing <M p=":">\psi</M> horizontally “east”.</li>
            </ul>
            <p>The position vector has only <em>one</em> term, <M p=".">{t`\v r = r\,\v e_r`}</M> Both angles are hidden in the direction of <M p=",">{t`\v e_r(\theta, \psi)`}</M> and again there are three pieces of information. Now all three basis vectors depend on the point (<M>{t`\v e_\psi`}</M> only on <M p=").">\psi</M> At the end of this lesson you can look at them at any point in the explorer (mode “Spherical”).</p>
          </>}
        />
        <Box keep kind="supplement" title={<T de="In kartesischen Komponenten" en="In Cartesian components" />}>
          <MD>{t`\v e_r = \begin{pmatrix} \sin\theta\cos\psi \\ \sin\theta\sin\psi \\ \cos\theta \end{pmatrix}, \quad \v e_\theta = \begin{pmatrix} \cos\theta\cos\psi \\ \cos\theta\sin\psi \\ -\sin\theta \end{pmatrix}, \quad \v e_\psi = \begin{pmatrix} -\sin\psi \\ \cos\psi \\ 0 \end{pmatrix}`}</MD>
          <T
            de={<p>So erhält man sie: <M>{t`\v r(r, \theta, \psi)`}</M> nach einer Koordinate ableiten heisst, an der Koordinatenlinie entlangzulaufen – die Ableitung ist tangential. Durch ihre Länge teilen gibt den Einheitsvektor. Die Längen sind <M p=",">1</M> <M>r</M> und <M>{t`r\sin\theta`}</M> (der Radius des Breitenkreises); genau diese Faktoren erscheinen später in <M>{t`\dot{\v r} = \dot r\,\v e_r + r\dot\theta\,\v e_\theta + r\sin\theta\,\dot\psi\,\v e_\psi`}</M> <Src p={10} />.</p>}
            en={<p>How to get them: differentiating <M>{t`\v r(r, \theta, \psi)`}</M> with respect to one coordinate means running along that coordinate line – the derivative is tangent. Dividing by its length gives the unit vector. The lengths are <M p=",">1</M> <M>r</M> and <M>{t`r\sin\theta`}</M> (the radius of the circle of latitude); exactly these factors appear later in <M>{t`\dot{\v r} = \dot r\,\v e_r + r\dot\theta\,\v e_\theta + r\sin\theta\,\dot\psi\,\v e_\psi`}</M> <Src p={10} />.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="explorer" title={<T de="5. Alle drei Basen im Vergleich" en="5. All three bases compared" />}>
        <T
          de={<p>Der Explorer aus <a href="#koordinaten">Lage &amp; Koordinaten</a>, jetzt mit der Basis in <M p=".">M</M> Jeder Basisvektor hat die Farbe der Koordinatenlinie, an der er anliegt; die Linien sind blass gezeichnet, damit die Pfeile hervortreten. Mit ⛶ oben rechts wird er bildschirmfüllend.</p>}
          en={<p>The explorer from <a href="#koordinaten">Position &amp; coordinates</a>, now with the basis at <M p=".">M</M> Each basis vector has the colour of the coordinate line it is tangent to; the lines are drawn faint so that the arrows stand out. ⛶ in the top right makes it fill the screen.</p>}
        />
        <CoordinateExplorer initialMode="cyl" basis phiDeg={70} z0={1.5} />
        <T
          de={<ul className="observe">
            <li><b>Kartesisch:</b> Die Basis in <M>M</M> ist eine Kopie der Basis in <M p=".">O</M> Verschieben ändert nichts.</li>
            <li><b>Zylindrisch:</b> Ändert man <M p=",">\varphi</M> drehen sich <M>{t`\v e_\rho`}</M> und <M p=";">{t`\v e_\varphi`}</M> <M>\rho</M> und <M>z</M> ändern an der Basis nichts.</li>
            <li><b>Sphärisch:</b> <M>\theta</M> und <M>\psi</M> drehen die Basis; <M>{t`\v e_\psi`}</M> bleibt immer waagrecht.</li>
            <li>Auf der <span className="nowrap"><M>z</M>-Achse</span> ist <M>\varphi</M> (bzw. <M p=")">\psi</M> nicht definiert. Dann haben auch <M>{t`\v e_\rho`}</M> und <M>{t`\v e_\varphi`}</M> (bzw. <M>{t`\v e_\theta`}</M> und <M p=")">{t`\v e_\psi`}</M> keine Richtung und verschwinden. Übrig bleibt zylindrisch <M p=",">{t`\v e_z`}</M> sphärisch <M p=":">{t`\v e_r`}</M> Es zeigt dort nach oben oder unten, je nachdem, ob <M>M</M> über oder unter <M>O</M> liegt.</li>
            <li>«Bewegung abspielen»: Die zylindrische Basis dreht sich unterwegs mit – die kartesische nicht.</li>
          </ul>}
          en={<ul className="observe">
            <li><b>Cartesian:</b> the basis at <M>M</M> is a copy of the basis at <M p=".">O</M> Moving changes nothing.</li>
            <li><b>Cylindrical:</b> changing <M>\varphi</M> turns <M>{t`\v e_\rho`}</M> and <M p=";">{t`\v e_\varphi`}</M> <M>\rho</M> and <M>z</M> do not change the basis.</li>
            <li><b>Spherical:</b> <M>\theta</M> and <M>\psi</M> turn the basis; <M>{t`\v e_\psi`}</M> always stays horizontal.</li>
            <li>On the <span className="nowrap"><M>z</M>-axis</span> <M>\varphi</M> (or <M p=")">\psi</M> is undefined. Then <M>{t`\v e_\rho`}</M> and <M>{t`\v e_\varphi`}</M> (or <M>{t`\v e_\theta`}</M> and <M p=")">{t`\v e_\psi`}</M> have no direction either and disappear. What remains is <M>{t`\v e_z`}</M> (cylindrical) or <M>{t`\v e_r`}</M> (spherical): it points up or down, depending on whether <M>M</M> lies above or below <M p=".">O</M></li>
            <li>“Play a motion”: the cylindrical basis turns along the way – the Cartesian one does not.</li>
          </ul>}
        />
        <Box kind="misconception" title={<T de="«Die Basisvektoren sitzen im Ursprung.»" en="“The basis vectors live at the origin.”" />}>
          <T
            de={<>Nur bei der kartesischen Basis ist das egal, weil sie überall gleich ist. <M p=",">{t`\v e_\rho`}</M> <M p=",">{t`\v e_\varphi`}</M> <M p=",">{t`\v e_r`}</M> <M p=",">{t`\v e_\theta`}</M> <M>{t`\v e_\psi`}</M> gehören zu einem bestimmten Punkt <M p=":">M</M> «tangential zu Koordinatenlinien <em>im betrachteten Punkt</em>».</>}
            en={<>Only for the Cartesian basis it does not matter, because it is the same everywhere. <M p=",">{t`\v e_\rho`}</M> <M p=",">{t`\v e_\varphi`}</M> <M p=",">{t`\v e_r`}</M> <M p=",">{t`\v e_\theta`}</M> <M>{t`\v e_\psi`}</M> belong to a particular point <M p=":">M</M> “tangent to the coordinate lines <em>at the point considered</em>”.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Merke und Ausblick" en="6. Key points and outlook" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Basisvektoren sind Einheitsvektoren tangential zu den Koordinatenlinien im betrachteten Punkt.</li>
              <li>Kartesisch: überall dieselbe Basis. Zylindrisch: <M>{t`\v e_\rho, \v e_\varphi`}</M> hängen von <M>\varphi</M> ab. Sphärisch: <M>{t`\v e_r, \v e_\theta`}</M> hängen von <M>\theta</M> und <M>\psi</M> ab, <M>{t`\v e_\psi`}</M> nur von <M p=".">\psi</M></li>
              <li><M p=",">{t`\v r = x\,\v e_x + y\,\v e_y + z\,\v e_z = \rho\,\v e_\rho + z\,\v e_z = r\,\v e_r`}</M> immer drei Informationen.</li>
            </ul>}
            en={<ul>
              <li>Basis vectors are unit vectors tangent to the coordinate lines at the point considered.</li>
              <li>Cartesian: the same basis everywhere. Cylindrical: <M>{t`\v e_\rho, \v e_\varphi`}</M> depend on <M p=".">\varphi</M> Spherical: <M>{t`\v e_r, \v e_\theta`}</M> depend on <M>\theta</M> and <M p=",">\psi</M> <M>{t`\v e_\psi`}</M> only on <M p=".">\psi</M></li>
              <li><M p=",">{t`\v r = x\,\v e_x + y\,\v e_y + z\,\v e_z = \rho\,\v e_\rho + z\,\v e_z = r\,\v e_r`}</M> always three pieces of information.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Wozu?</b> Leitet man <M>{t`\v r = \rho\,\v e_\rho + z\,\v e_z`}</M> nach der Zeit ab, muss man auch <M>{t`\v e_\rho`}</M> ableiten, weil es sich mit <M>\varphi</M> dreht: <M>{t`\dot{\v e}_\rho \ne \v 0`}</M> <Src p={9} />. Daraus entsteht der Term <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> in der Geschwindigkeit <Src p={10} />.</p>}
          en={<p className="connections"><b>What for?</b> Differentiating <M>{t`\v r = \rho\,\v e_\rho + z\,\v e_z`}</M> with respect to time, one must also differentiate <M p=",">{t`\v e_\rho`}</M> because it turns with <M p=":">\varphi</M> <M>{t`\dot{\v e}_\rho \ne \v 0`}</M> <Src p={9} />. This produces the term <M>{t`\rho\dot\varphi\,\v e_\varphi`}</M> in the velocity <Src p={10} />.</p>}
        />
      </Section>
    </article>
  );
}
