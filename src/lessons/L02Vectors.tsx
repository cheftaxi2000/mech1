import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { CrossDemo, CycleDiagram, DotDemo, PositionVectorFigure } from '../viz/VectorFigures';

const t = String.raw;

export default function L02Vectors() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">
          Koordinaten beschreiben eine Lage mit drei Zahlen. Die Vorlesung wechselt jetzt zu <em>Vektoren</em>: Pfeilen, mit denen man rechnen kann.
          Diese kurze Lektion legt das Werkzeug bereit – Ortsvektor, Basis, Skalar- und Kreuzprodukt –, das ab der Geschwindigkeit überall gebraucht wird.
        </p>}
        en={<p className="lede">
          Coordinates describe a position by three numbers. The lecture now switches to <em>vectors</em>: arrows you can calculate with.
          This short lesson prepares the tools – position vector, basis, dot and cross product – that are used everywhere from velocity onwards.
        </p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="ortsvektor" title={<T de="1. Vektor, Ortsvektor und Basis" en="1. Vector, position vector and basis" />}>
        <Box kind="lecture" src={<Src p={5} />}>
          <T
            de={<ul>
              <li><b>Vektor:</b> Pfeil mit bestimmter Länge und Richtung/Orientierung – ein Informationsträger.</li>
              <li><M p=":">{t`\v r`}</M> <b>Ortsvektor</b> (punktgebunden), definiert eindeutig die Lage von <M>M</M> (wie die Koordinaten).</li>
              <li>Bewegung: <M p=",">{t`t \mapsto \v r = \v r(t)`}</M> eine Vektorfunktion.</li>
              <li>Zur expliziten Darstellung braucht es eine <b>Basis</b>, hier orthonormierte Basisvektoren (3D-Raum):</li>
            </ul>}
            en={<ul>
              <li><b>Vector</b> (<em lang="de">Vektor</em>): an arrow with a definite length and direction/orientation – a carrier of information.</li>
              <li><M p=":">{t`\v r`}</M> <b>position vector</b> (<em lang="de">Ortsvektor</em>, bound to a point), defines the position of <M>M</M> uniquely (like the coordinates).</li>
              <li>Motion: <M p=",">{t`t \mapsto \v r = \v r(t)`}</M> a vector function.</li>
              <li>To write it out explicitly we need a <b>basis</b>, here orthonormal basis vectors (3D space):</li>
            </ul>}
          />
          <MD>{t`\v e_1,\ \v e_2,\ \v e_3, \qquad \v e_1 \perp \v e_2 \perp \v e_3, \qquad |\v e_1| = |\v e_2| = |\v e_3| = 1`}</MD>
        </Box>
        <T
          de={<p>
            «Richtung» ist die Gerade, auf der der Pfeil liegt; «Orientierung» sagt, wohin er auf ihr zeigt.
            Einen gewöhnlichen Vektor darf man parallel verschieben – er bleibt derselbe Pfeil. Der Ortsvektor nicht: Er beginnt immer im Ursprung <M>O</M> und zeigt auf <M p=".">M</M>{' '}
            Bewegt sich <M p=",">M</M> wandert seine Spitze mit und zeichnet die Bahnkurve. «Orthonormiert» heisst: Jeder Basisvektor hat die Länge 1, und je zwei stehen senkrecht aufeinander
            (die Kette <M>{t`\v e_1 \perp \v e_2 \perp \v e_3`}</M> meint also auch <M p=").">{t`\v e_1 \perp \v e_3`}</M>
          </p>}
          en={<p>
            “Direction” is the line the arrow lies on; “orientation” says which way along it the arrow points.
            An ordinary vector may be shifted parallel to itself – it stays the same arrow. The position vector may not: it always starts at the origin <M>O</M> and points to <M p=".">M</M>{' '}
            When <M>M</M> moves, its tip moves along and draws the trajectory. “Orthonormal” means: every basis vector has length 1, and any two of them are perpendicular
            (so the chain <M>{t`\v e_1 \perp \v e_2 \perp \v e_3`}</M> also means <M p=").">{t`\v e_1 \perp \v e_3`}</M>
          </p>}
        />
        <PositionVectorFigure />
        <T
          de={<p className="fig-note">Der schwarze Pfeil ist <M p=",">{t`\v r(t)`}</M> die rote Kurve die Bahn seiner Spitze. Die dicken kurzen Pfeile bei <M>O</M> sind die Basisvektoren der Länge 1. Die farbigen Strecken sind die drei Komponenten (Abschnitt 4). Mit dem Regler <M>t</M> oder «Bewegung abspielen» wandert <M>M</M> auf seiner Bahn.</p>}
          en={<p className="fig-note">The black arrow is <M p=",">{t`\v r(t)`}</M> the red curve the path of its tip. The thick short arrows at <M>O</M> are the basis vectors of length 1. The coloured segments are the three components (section 4). With the slider <M>t</M> or “Play the motion”, <M>M</M> moves along its path.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="skalarprodukt" title={<T de="2. Skalarprodukt" en="2. Dot product (Skalarprodukt)" />}>
        <Box kind="lecture" src={<Src p={5} />}>
          <MD>{t`\v a\cdot\v b = |\v a|\,|\v b|\cos\varphi`}</MD>
          <MD>{t`\v e_1\cdot\v e_1 = 1 \;\Rightarrow\; |\v e_1|^2 = 1 \;\Rightarrow\; |\v e_1| = 1, \qquad \v e_1\cdot\v e_2 = 0 \;\Rightarrow\; \varphi = \pi/2 \;\Rightarrow\; \v e_1 \perp \v e_2`}</MD>
          <MD>{t`\v a\cdot\v e_1 = |\v a|\cdot 1\cdot\cos\varphi \qquad ` + tr(t`\text{Projektion von }\v a\text{ auf }\v e_1\text{-Richtung}`, t`\text{projection of }\v a\text{ onto the }\v e_1\text{-direction}`)}</MD>
        </Box>
        <T
          de={<p>
            Das Ergebnis ist eine <b>Zahl</b>, kein Vektor. Am besten liest man es als Projektion: <M>{t`|\v b|\cos\varphi`}</M> ist der «Schatten» von <M>{t`\v b`}</M> auf der Geraden von <M p=",">{t`\v a`}</M>{' '}
            und <M>{t`\v a\cdot\v b`}</M> ist <M>{t`|\v a|`}</M> mal diesen Schatten. Hier ist <M>\varphi</M> der Winkel zwischen <M>{t`\v a`}</M> und <M p=",">{t`\v b`}</M> nicht der Zylinderwinkel – das Skript benutzt denselben Buchstaben. Ziehe die Spitze von <M p=":">{t`\v b`}</M>
          </p>}
          en={<p>
            The result is a <b>number</b>, not a vector. Read it as a projection: <M>{t`|\v b|\cos\varphi`}</M> is the “shadow” of <M>{t`\v b`}</M> on the line of <M p=",">{t`\v a`}</M>{' '}
            and <M>{t`\v a\cdot\v b`}</M> is <M>{t`|\v a|`}</M> times that shadow. Here <M>\varphi</M> is the angle between <M>{t`\v a`}</M> and <M p=",">{t`\v b`}</M> not the cylindrical angle – the notes use the same letter. Drag the tip of <M p=":">{t`\v b`}</M>
          </p>}
        />
        <DotDemo />
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=":">{t`\varphi < 90^\circ`}</M> Schatten zeigt mit <M>{t`\v a`}</M> mit, <M p=".">{t`\v a\cdot\v b > 0`}</M></li>
              <li><M p=":">{t`\varphi = 90^\circ`}</M> kein Schatten, <M p=".">{t`\v a\cdot\v b = 0`}</M> Für Vektoren <M>{t`\ne \v 0`}</M> heisst <M>{t`\v a\cdot\v b = 0`}</M> genau: senkrecht.</li>
              <li><M p=":">{t`\varphi > 90^\circ`}</M> Schatten zeigt nach hinten, <M p=".">{t`\v a\cdot\v b < 0`}</M></li>
              <li>Ist <M>{t`\v e`}</M> ein Einheitsvektor, so ist <M>{t`\v a\cdot\v e`}</M> direkt die (vorzeichenbehaftete) Länge der Projektion – so liest die Vorlesung <M p=".">{t`\v a\cdot\v e_1`}</M></li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`\varphi < 90^\circ`}</M> the shadow points along <M p=",">{t`\v a`}</M> <M p=".">{t`\v a\cdot\v b > 0`}</M></li>
              <li><M p=":">{t`\varphi = 90^\circ`}</M> no shadow, <M p=".">{t`\v a\cdot\v b = 0`}</M> For vectors <M>{t`\ne \v 0`}</M> <M>{t`\v a\cdot\v b = 0`}</M> means exactly: perpendicular.</li>
              <li><M p=":">{t`\varphi > 90^\circ`}</M> the shadow points backwards, <M p=".">{t`\v a\cdot\v b < 0`}</M></li>
              <li>If <M>{t`\v e`}</M> is a unit vector, <M>{t`\v a\cdot\v e`}</M> is directly the (signed) length of the projection – this is how the lecture reads <M p=".">{t`\v a\cdot\v e_1`}</M></li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="kreuzprodukt" title={<T de="3. Kreuzprodukt (Vektorprodukt)" en="3. Cross product (Kreuzprodukt, Vektorprodukt)" />}>
        <Box kind="lecture" src={<Src p={5} />}>
          <MD>{t`\v c = \v a\times\v b, \qquad |\v c| = |\v a|\,|\v b|\sin\varphi, \qquad \v c\perp\v a,\ \v c\perp\v b`}</MD>
          <MD>{t`\v e_1\times\v e_2 = \v e_3,\qquad \v e_2\times\v e_3 = \v e_1,\qquad \v e_3\times\v e_1 = \v e_2 \qquad\to\ ` + tr(t`\text{Rechtssystem}`, t`\text{right-handed system}`)}</MD>
        </Box>
        <T
          de={<p>
            Das Ergebnis ist ein <b>Vektor</b>. Seine Länge ist der Flächeninhalt des von <M>{t`\v a`}</M> und <M>{t`\v b`}</M> aufgespannten Parallelogramms (Grundseite <M p=",">{t`|\v a|`}</M> Höhe <M p=").">{t`|\v b|\sin\varphi`}</M>{' '}
            Er steht senkrecht auf beiden; welche der zwei senkrechten Richtungen, sagt die <b>Rechte-Hand-Regel</b>. Bewege den Schieberegler und drehe das Bild:
          </p>}
          en={<p>
            The result is a <b>vector</b>. Its length is the area of the parallelogram spanned by <M>{t`\v a`}</M> and <M>{t`\v b`}</M> (base <M p=",">{t`|\v a|`}</M> height <M p=").">{t`|\v b|\sin\varphi`}</M>{' '}
            It is perpendicular to both; which of the two perpendicular directions is fixed by the <b>right-hand rule</b>. Move the slider and rotate the view:
          </p>}
        />
        <CrossDemo />
        <div className="pair">
          <T
            de={<div>
              <p><b>Rechtssystem.</b> Die drei Gleichungen der Vorlesung folgen einem Kreis: <M>{t`1\to2\to3\to1`}</M> ergibt <M p=".">+</M> Gegen die Pfeilrichtung kehrt das Vorzeichen: <M p=".">{t`\v e_2\times\v e_1 = -\v e_3`}</M> Und ein Vektor mit sich selbst gibt <M>{t`\v 0`}</M> (<M p=",">{t`\varphi = 0`}</M> keine Fläche).</p>
              <p>Allgemein gilt deshalb <M p=":">{t`\v b\times\v a = -\,\v a\times\v b`}</M> Beim Kreuzprodukt kommt es auf die Reihenfolge an (Häkchen «Reihenfolge vertauschen» oben).</p>
            </div>}
            en={<div>
              <p><b>Right-handed system</b> (<em lang="de">Rechtssystem</em>). The lecture's three equations follow a cycle: <M>{t`1\to2\to3\to1`}</M> gives <M p=".">+</M> Against the arrows the sign flips: <M p=".">{t`\v e_2\times\v e_1 = -\v e_3`}</M> And a vector with itself gives <M>{t`\v 0`}</M> (<M p=",">{t`\varphi = 0`}</M> no area).</p>
              <p>In general, therefore, <M p=":">{t`\v b\times\v a = -\,\v a\times\v b`}</M> the order matters for the cross product (tick “swap the order” above).</p>
            </div>}
          />
          <CycleDiagram />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kartesisch" title={<T de="4. Kartesische Basis" en="4. Cartesian basis (kartesische Basis)" />}>
        <Box kind="lecture" src={<Src p={5} />}>
          <MD>{t`\v e_x,\ \v e_y,\ \v e_z, \qquad \v r = r_x\,\v e_x + r_y\,\v e_y + r_z\,\v e_z`}</MD>
        </Box>
        <T
          de={<p>
            <M>{t`\v e_x, \v e_y, \v e_z`}</M> sind <M>{t`\v e_1, \v e_2, \v e_3`}</M> in Richtung der drei Achsen. Im Bild von Abschnitt 1 sind die drei Summanden die farbigen Strecken: erst <M>{t`r_x`}</M> Schritte in <span className="nowrap"><M>x</M>-Richtung</span>, dann <M>{t`r_y`}</M> in <span className="nowrap"><M>y</M>-Richtung</span>, dann <M>{t`r_z`}</M> nach oben – und man ist bei <M p=".">M</M>{' '}
            Die Lektion <a href="#basen">Kartesische, zylindrische, sphärische Basis</a> <Src p={6} /> zeigt, wie man die Komponenten mit dem Skalarprodukt herausholt: <M p=".">{t`r_x = \v r\cdot\v e_x = x`}</M>
          </p>}
          en={<p>
            <M>{t`\v e_x, \v e_y, \v e_z`}</M> are <M>{t`\v e_1, \v e_2, \v e_3`}</M> along the three axes. In the figure of section 1 the three terms are the coloured segments: first <M>{t`r_x`}</M> steps in the <span className="nowrap"><M>x</M>-direction</span>, then <M>{t`r_y`}</M> in the <span className="nowrap"><M>y</M>-direction</span>, then <M>{t`r_z`}</M> up – and you arrive at <M p=".">M</M>{' '}
            The lesson <a href="#basen">Cartesian, cylindrical, spherical basis</a> <Src p={6} /> shows how to extract the components with the dot product: <M p=".">{t`r_x = \v r\cdot\v e_x = x`}</M>
          </p>}
        />
        <Box kind="supplement" title={<T de="Rechnen mit Komponenten" en="Calculating with components" />}>
          <T
            de={<p>Für Übungen braucht man beide Produkte in Komponenten. Sie folgen direkt aus den Regeln für die Basis (nicht im Skript):</p>}
            en={<p>Exercises need both products in components. They follow directly from the rules for the basis (not in the notes):</p>}
          />
          <MD>{t`\v a\cdot\v b = a_x b_x + a_y b_y + a_z b_z, \qquad \v a\times\v b = \begin{pmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{pmatrix}`}</MD>
          <Derivation title={<T de="aus den Basisregeln" en="from the basis rules" />} open={false}>
            <T
              de={<ol>
                <li>Ausmultiplizieren: <M>{t`(a_x\v e_x + a_y\v e_y + a_z\v e_z)\cdot(b_x\v e_x + b_y\v e_y + b_z\v e_z)`}</M> gibt neun Terme <M p=".">{t`a_i b_j\,(\v e_i\cdot\v e_j)`}</M></li>
                <li>Orthonormiert: <M>{t`\v e_i\cdot\v e_i = 1`}</M> und <M>{t`\v e_i\cdot\v e_j = 0`}</M> für <M p=".">{t`i\ne j`}</M> Es bleiben die drei Terme <M p=".">{t`a_x b_x + a_y b_y + a_z b_z`}</M></li>
                <li>Beim Kreuzprodukt dieselben neun Terme mit <M p=":">{t`\v e_i\times\v e_j`}</M> <M>{t`\v e_i\times\v e_i = \v 0`}</M> (drei fallen weg), im Kreis <M p=",">+</M> gegen den Kreis <M>-</M> (Abschnitt 3). Zum Beispiel liefern <M>{t`a_x b_y\,\v e_x\times\v e_y = a_x b_y\,\v e_z`}</M> und <M>{t`a_y b_x\,\v e_y\times\v e_x = -a_y b_x\,\v e_z`}</M> zusammen die <span className="nowrap"><M>z</M>-Komponente</span> <M p=".">{t`a_x b_y - a_y b_x`}</M></li>
              </ol>}
              en={<ol>
                <li>Expand: <M>{t`(a_x\v e_x + a_y\v e_y + a_z\v e_z)\cdot(b_x\v e_x + b_y\v e_y + b_z\v e_z)`}</M> gives nine terms <M p=".">{t`a_i b_j\,(\v e_i\cdot\v e_j)`}</M></li>
                <li>Orthonormal: <M>{t`\v e_i\cdot\v e_i = 1`}</M> and <M>{t`\v e_i\cdot\v e_j = 0`}</M> for <M p=".">{t`i\ne j`}</M> Three terms remain: <M p=".">{t`a_x b_x + a_y b_y + a_z b_z`}</M></li>
                <li>For the cross product, the same nine terms with <M p=":">{t`\v e_i\times\v e_j`}</M> <M>{t`\v e_i\times\v e_i = \v 0`}</M> (three drop out), along the cycle <M p=",">+</M> against it <M>-</M> (section 3). For example <M>{t`a_x b_y\,\v e_x\times\v e_y = a_x b_y\,\v e_z`}</M> and <M>{t`a_y b_x\,\v e_y\times\v e_x = -a_y b_x\,\v e_z`}</M> together give the <span className="nowrap"><M>z</M>-component</span> <M p=".">{t`a_x b_y - a_y b_x`}</M></li>
              </ol>}
            />
          </Derivation>
          <T
            de={<p>Beispiel: <M p=".">{t`(1,2,0)\times(3,-1,4) = (2\cdot4 - 0\cdot(-1),\ 0\cdot3 - 1\cdot4,\ 1\cdot(-1) - 2\cdot3) = (8,-4,-7)`}</M> Kontrolle: <M p="✓,">{t`(8,-4,-7)\cdot(1,2,0) = 8 - 8 = 0`}</M> senkrecht wie verlangt.</p>}
            en={<p>Example: <M p=".">{t`(1,2,0)\times(3,-1,4) = (2\cdot4 - 0\cdot(-1),\ 0\cdot3 - 1\cdot4,\ 1\cdot(-1) - 2\cdot3) = (8,-4,-7)`}</M> Check: <M p="✓,">{t`(8,-4,-7)\cdot(1,2,0) = 8 - 8 = 0`}</M> perpendicular as required.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="misconceptions" title={<T de="5. Häufiges Missverständnis und das Wichtigste" en="5. Common misconception and the essentials" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`\v a\times\v b = \v b\times\v a`}</M>»</>} en={<>“<M>{t`\v a\times\v b = \v b\times\v a`}</M>”</>} />}>
          <T de={<>Falsch: Vertauschen dreht die Richtung um, <M p=".">{t`\v b\times\v a = -\,\v a\times\v b`}</M> Beim Skalarprodukt dagegen ist die Reihenfolge egal.</>}
            en={<>Wrong: swapping reverses the direction, <M p=".">{t`\v b\times\v a = -\,\v a\times\v b`}</M> For the dot product, by contrast, the order does not matter.</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Der Ortsvektor <M>{t`\v r`}</M> zeigt immer von <M>O</M> nach <M p=";">M</M> in der kartesischen Basis ist <M p=".">{t`\v r = r_x\,\v e_x + r_y\,\v e_y + r_z\,\v e_z`}</M></li>
              <li>Skalarprodukt: eine <b>Zahl</b>, <M>{t`|\v a|`}</M> mal die Projektion von <M>{t`\v b`}</M> auf <M p=".">{t`\v a`}</M> Null genau dann, wenn die Vektoren senkrecht stehen (beide <M p=").">{t`\ne \v 0`}</M></li>
              <li>Kreuzprodukt: ein <b>Vektor</b> senkrecht auf beiden, so lang wie die Parallelogrammfläche, Richtung nach der Rechte-Hand-Regel.</li>
              <li><M p=";">{t`\v b\times\v a = -\,\v a\times\v b`}</M> parallele Vektoren geben <M p=".">{t`\v 0`}</M></li>
            </ul>}
            en={<ul>
              <li>The position vector <M>{t`\v r`}</M> always points from <M>O</M> to <M p=";">M</M> in the Cartesian basis <M p=".">{t`\v r = r_x\,\v e_x + r_y\,\v e_y + r_z\,\v e_z`}</M></li>
              <li>Dot product: a <b>number</b>, <M>{t`|\v a|`}</M> times the projection of <M>{t`\v b`}</M> onto <M p=".">{t`\v a`}</M> Zero exactly when the vectors are perpendicular (both <M p=").">{t`\ne \v 0`}</M></li>
              <li>Cross product: a <b>vector</b> perpendicular to both, as long as the parallelogram's area, direction by the right-hand rule.</li>
              <li><M p=";">{t`\v b\times\v a = -\,\v a\times\v b`}</M> parallel vectors give <M p=".">{t`\v 0`}</M></li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Wozu?</b> Das Skalarprodukt steckt im Satz der projizierten Geschwindigkeiten (<Src p={12} />: <M p=").">{t`\v v_A\cdot\v{AB} = \v v_B\cdot\v{AB}`}</M> Das Kreuzprodukt in der Kreisbewegung und Rotation (<Src p={11} />: <M p=").">{t`\v v = \v\omega\times\v r`}</M></p>}
          en={<p className="connections"><b>What for?</b> The dot product appears in the theorem of projected velocities (<Src p={12} />: <M p=").">{t`\v v_A\cdot\v{AB} = \v v_B\cdot\v{AB}`}</M> The cross product in circular motion and rotation (<Src p={11} />: <M p=").">{t`\v v = \v\omega\times\v r`}</M></p>}
        />
      </Section>
    </article>
  );
}
