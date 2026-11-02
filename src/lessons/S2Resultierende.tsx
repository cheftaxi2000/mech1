import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { HalfCircleAnimFig, HalfCircleExplorer, PolygonExplorer } from '../viz/statik/StatikFigures';

const t = String.raw;

export default function S2Resultierende() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Nach dem Satz zur statischen Äquivalenz braucht man von einer Kräftegruppe nur zwei Dinge: ihre Resultierende und ihr Moment. Diese Lektion kümmert sich um das Erste. Die Resultierende ist einfach die Summe aller Kraftvektoren, bei einzelnen Kräften als Summe, bei verteilten Kräften als Integral.</p>}
        en={<p className="lede">By the theorem on static equivalence one needs only two things from a group of forces: its resultant and its moment. This lesson deals with the first. The resultant is simply the sum of all force vectors: a sum for single forces, an integral for distributed forces.</p>}
      />

      <Box kind="intuition">
        <T
          de={<p>Drei Kinder ziehen einen Schlitten an drei Seilen, jedes in eine andere Richtung. Wohin rutscht der Schlitten? So, als ob ein einziges Kind mit der <b>Summe</b> der drei Zugkräfte zöge. Dafür ist egal, wo die Seile am Schlitten festgebunden sind. Ob sich der Schlitten dabei auch dreht, hängt dagegen sehr wohl davon ab; das kommt in der nächsten Lektion.</p>}
          en={<p>Three children pull a sled with three ropes, each in a different direction. Where does the sled slide? As if a single child pulled with the <b>sum</b> of the three pulls. For that it does not matter where the ropes are tied to the sled. Whether the sled also turns does depend on it; that comes in the next lesson.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="summe" title={<T de="1. Die Resultierende als Vektorsumme" en="1. The resultant as a vector sum" />}>
        <Box kind="lecture" src={<Src p={38} fig="Fig. 6.3" />} title={<T de="6.2 Resultierende einer Kräftegruppe" en={<>6.2 Resultant of a group of forces (<span lang="de">Resultierende einer Kräftegruppe</span>)</>} />}>
          <T de={<p><M p=":">{t`\{G\}`}</M> <M p=":">{t`\v F_1, \dots, \v F_n`}</M> <M>n</M> Einzelkräfte <M>\leftrightarrow</M> Kräftegruppe.</p>} en={<p><M p=":">{t`\{G\}`}</M> <M p=":">{t`\v F_1, \dots, \v F_n`}</M> <M>n</M> single forces <M>\leftrightarrow</M> group of forces.</p>} />
          <MD>{t`\v R = \sum_{i=1}^{n}\v F_i = R_x\v e_x + R_y\v e_y + R_z\v e_z,\qquad R_x = \sum_{i=1}^{n}F_{xi},\quad R_y = \sum_{i=1}^{n}F_{yi},\quad R_z = \sum_{i=1}^{n}F_{zi}`}</MD>
          <T
            de={<p>Handschriftlich: <M>{t`\v R`}</M> «freier Vektor»; «Vektorensumme: gleiche Basis <M p=".">{t`\v e_x, \v e_y, \v e_z`}</M>» Fig. 6.3: Körper mit <M>{t`\v F_1`}</M> in <M p=",">{t`A_1`}</M> <M>{t`\v F_2`}</M> in <M p=",">{t`A_2`}</M> <M>{t`\v F_3`}</M> in <M p=";">{t`A_3`}</M> daneben das Polygon <M>{t`\v F_2, \v F_3, \v F_1`}</M> mit <M p=".">{t`\v R`}</M></p>}
            en={<p>Handwritten: <M>{t`\v R`}</M> “free vector”; “vector sum: same basis <M p=".">{t`\v e_x, \v e_y, \v e_z`}</M>” Fig. 6.3: a body with <M>{t`\v F_1`}</M> at <M p=",">{t`A_1`}</M> <M>{t`\v F_2`}</M> at <M p=",">{t`A_2`}</M> <M>{t`\v F_3`}</M> at <M p=";">{t`A_3`}</M> beside it the polygon <M>{t`\v F_2, \v F_3, \v F_1`}</M> with <M p=".">{t`\v R`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b></p>
            <ul className="keep">
              <li>Man addiert die Kräfte wie Vektoren: komponentenweise, und alle in derselben Basis. <M>{t`R_x`}</M> ist die Summe aller x-Anteile, und so weiter.</li>
              <li>Zeichnerisch legt man die Pfeile Spitze an Ende aneinander (Kraftpolygon). Der Pfeil vom Anfang des ersten zur Spitze des letzten ist <M p=".">{t`\v R`}</M> Die Reihenfolge spielt keine Rolle.</li>
              <li><b>Freier Vektor</b> heisst: <M>{t`\v R`}</M> hat Richtung und Betrag, aber keinen Angriffspunkt. Die Angriffspunkte <M>{t`A_i`}</M> fallen beim Addieren weg. Wo die Kräfte angreifen, steckt erst im Moment (nächste Lektion).</li>
            </ul>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b></p>
            <ul className="keep">
              <li>Forces are added like vectors: component by component, and all in the same basis. <M>{t`R_x`}</M> is the sum of all x-parts, and so on.</li>
              <li>Graphically, the arrows are laid tip to tail (force polygon). The arrow from the start of the first to the tip of the last is <M p=".">{t`\v R`}</M> The order does not matter.</li>
              <li><b>Free vector</b> means: <M>{t`\v R`}</M> has a direction and a magnitude, but no point of action. The points <M>{t`A_i`}</M> drop out when adding. Where the forces act only shows up in the moment (next lesson).</li>
            </ul>
          </>}
        />
        <PolygonExplorer />
        <Box kind="misconception" title={<T de="«Die Resultierende greift im Schwerpunkt der Angriffspunkte an»" en="“The resultant acts at the centre of the points of action”" />}>
          <T
            de={<p>Die Resultierende allein hat gar keinen Angriffspunkt. Will man die ganze Gruppe durch eine einzige Kraft ersetzen, muss man ihre Wirkungslinie so wählen, dass auch das Moment stimmt. Das ist nicht der Mittelpunkt der <M p=",">{t`A_i`}</M> und manchmal gibt es gar keine solche Linie (Kräftepaar, siehe <a href="#spezielle-kraeftegruppen">Spezielle Kräftegruppen</a>).</p>}
            en={<p>The resultant alone has no point of action at all. To replace the whole group by a single force, its line of action must be chosen so that the moment matches as well. That is not the centre of the <M p=",">{t`A_i`}</M> and sometimes no such line exists (couple, see <a href="#spezielle-kraeftegruppen">Special groups of forces</a>).</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="verteilt" title={<T de="2. Beispiel: Linienlast auf einem Halbkreis" en="2. Example: line load on a half circle" />}>
        <Box kind="lecture" src={<Src p={38} fig="Fig. 6.4" />} title={<T de="Resultierende einer Kräfteverteilung" en={<>Resultant of a distribution of forces (<span lang="de">Resultierende von Kräfteverteilung</span>)</>} />}>
          <T
            de={<p>Ein Halbkreis vom Radius <M>r</M> um <M p=",">M</M> belastet mit der <b>Linienkraftdichte</b> <M>{t`\v q = -q\,\v e_g`}</M> (<M>{t`\v e_g`}</M> zeigt radial nach aussen, die Last zum Mittelpunkt). Ein Stück beim Winkel <M>\varphi</M> hat die Länge <M p=":">{t`r\,d\varphi`}</M></p>}
            en={<p>A half circle of radius <M>r</M> about <M p=",">M</M> loaded with the <b>line force density</b> (<span lang="de">Linienkraftdichte</span>) <M>{t`\v q = -q\,\v e_g`}</M> (<M>{t`\v e_g`}</M> points radially outwards, the load towards the centre). A piece at the angle <M>\varphi</M> has the length <M p=":">{t`r\,d\varphi`}</M></p>}
          />
          <MD>{t`\begin{aligned}
d\v F &= -q\cdot r\,d\varphi\;\v e_g = -q\cdot r\,d\varphi\cos\varphi\;\v e_x + \big(-q\cdot r\,d\varphi\sin\varphi\;\v e_y\big)\\
R_x &= \int_0^\pi -q\,r\cos\varphi\,d\varphi = 0\\
R_y &= \int_0^\pi -q\,r\sin\varphi\,d\varphi = q\,r\cos\varphi\Big|_0^\pi = -2qr\\
\v R &= -2qr\,\v e_y
\end{aligned}`}</MD>
          <T de={<p>Daneben handschriftlich die Fläche unter <M>\cos</M> von 0 bis <M p=":">\pi</M> zwei gleich grosse Teile mit verschiedenem Vorzeichen.</p>} en={<p>Beside it, handwritten, the area under <M>\cos</M> from 0 to <M p=":">\pi</M> two equal parts with opposite signs.</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Rechnung.</b></p>
            <ol className="keep">
              <li>Eine verteilte Last ist eine Kräftegruppe aus unendlich vielen, unendlich kleinen Kräften. Ein Stück der Länge <M>{t`r\,d\varphi`}</M> trägt die Kraft <M>{t`q\cdot r\,d\varphi`}</M> (Dichte mal Länge, wie bei der <a href="#verteilte-kraefte">Kraftdichte</a>).</li>
              <li>Sie zeigt zum Mittelpunkt, also gegen <M p=".">{t`\v e_g = (\cos\varphi, \sin\varphi)`}</M> Darum die Anteile <M>{t`-qr\,d\varphi\cos\varphi`}</M> in <M>x</M> und <M>{t`-qr\,d\varphi\sin\varphi`}</M> in <M p=".">y</M></li>
              <li>Die Summe wird zum Integral über <M>\varphi</M> von 0 bis <M p=".">\pi</M> Der Cosinus ist rechts positiv und links gleich stark negativ: <M p=".">{t`R_x = 0`}</M> Der Sinus ist überall positiv: Die y-Anteile addieren sich zu <M p=".">{t`-2qr`}</M></li>
              <li>Zum Vergleich: Die Last zusammen ist <M>{t`q\cdot\pi r \approx 3{,}14\,qr`}</M> (Dichte mal Bogenlänge). Die Resultierende ist kleiner, <M p=",">{t`2qr`}</M> weil die schrägen Stücke sich teilweise gegenseitig aufheben.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read the calculation.</b></p>
            <ol className="keep">
              <li>A distributed load is a group of infinitely many, infinitely small forces. A piece of length <M>{t`r\,d\varphi`}</M> carries the force <M>{t`q\cdot r\,d\varphi`}</M> (density times length, as for the <a href="#verteilte-kraefte">force density</a>).</li>
              <li>It points towards the centre, i.e. against <M p=".">{t`\v e_g = (\cos\varphi, \sin\varphi)`}</M> Hence the parts <M>{t`-qr\,d\varphi\cos\varphi`}</M> in <M>x</M> and <M>{t`-qr\,d\varphi\sin\varphi`}</M> in <M p=".">y</M></li>
              <li>The sum becomes an integral over <M>\varphi</M> from 0 to <M p=".">\pi</M> The cosine is positive on the right and equally negative on the left: <M p=".">{t`R_x = 0`}</M> The sine is positive everywhere: the y-parts add up to <M p=".">{t`-2qr`}</M></li>
              <li>For comparison: the whole load is <M>{t`q\cdot\pi r \approx 3.14\,qr`}</M> (density times arc length). The resultant is smaller, <M p=",">{t`2qr`}</M> because the inclined pieces partly cancel each other.</li>
            </ol>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Resultierende der Halbkreislast', 'Animation: resultant of the half-circle load')}
          steps={[
            { ms: 600, holdMs: 2400, caption: <T de={<>Die Last <M>q</M> drückt überall zum Mittelpunkt <M p=".">M</M></>} en={<>The load <M>q</M> pushes towards the centre <M>M</M> everywhere.</>} /> },
            { ms: 1200, holdMs: 3000, caption: <T de={<>Ein Stück beim Winkel <M p=":">\varphi</M> <M>{t`d\v F`}</M> mit den Anteilen <M>{t`dF\cos\varphi`}</M> (blau, <M p=")">x</M> und <M>{t`dF\sin\varphi`}</M> (gelb, <M p=").">y</M></>} en={<>One piece at the angle <M p=":">\varphi</M> <M>{t`d\v F`}</M> with the parts <M>{t`dF\cos\varphi`}</M> (blue, <M p=")">x</M> and <M>{t`dF\sin\varphi`}</M> (yellow, <M p=").">y</M></>} /> },
            { ms: 1300, holdMs: 3000, caption: <T de={<>Zu jedem Stück rechts gibt es ein gespiegeltes links. Ihre x-Anteile sind entgegengesetzt gleich: <M p=".">{t`R_x = 0`}</M></>} en={<>For every piece on the right there is a mirrored one on the left. Their x-parts are equal and opposite: <M p=".">{t`R_x = 0`}</M></>} /> },
            { ms: 1300, holdMs: 3000, caption: <T de={<>Die y-Anteile zeigen alle nach unten und addieren sich: <M p=".">{t`R_y = -2qr`}</M></>} en={<>The y-parts all point down and add up: <M p=".">{t`R_y = -2qr`}</M></>} /> },
            { ms: 900, holdMs: 2800, caption: <T de={<><M p=",">{t`\v R = -2qr\,\v e_y`}</M> ein freier Vektor: Er sagt nur, wie stark und wohin die Last insgesamt drückt.</>} en={<><M p=",">{t`\v R = -2qr\,\v e_y`}</M> a free vector: it only says how hard and where the load pushes in total.</>} /> },
          ]}
        >
          {(step, tt) => <HalfCircleAnimFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p>Im Bild unten wird die Last in <M>n</M> Stücke zerlegt und wirklich summiert. Bei wenigen Stücken ist die Summe etwas zu gross, mit wachsendem <M>n</M> nähert sie sich dem Integral.</p>}
          en={<p>In the figure below the load is cut into <M>n</M> pieces and actually summed. With few pieces the sum is a bit too large; as <M>n</M> grows it approaches the integral.</p>}
        />
        <HalfCircleExplorer />
        <Box kind="misconception" title={<T de={<>«Die Resultierende ist die gesamte Last, also <M p="»">{t`q\pi r`}</M></>} en={<>“The resultant is the whole load, so <M p="”">{t`q\pi r`}</M></>} />}>
          <T
            de={<p>Nur wenn alle Teilkräfte parallel sind. Hier zeigen sie in verschiedene Richtungen, und Vektoren addiert man mit Richtung. Die Beträge <M>{t`qr\,d\varphi`}</M> zusammen ergeben <M p=",">{t`q\pi r`}</M> die Vektorsumme nur <M p=".">{t`2qr`}</M></p>}
            en={<p>Only if all the partial forces are parallel. Here they point in different directions, and vectors are added with their direction. The magnitudes <M>{t`qr\,d\varphi`}</M> together give <M p=",">{t`q\pi r`}</M> the vector sum only <M p=".">{t`2qr`}</M></p>}
          />
        </Box>
        <Box kind="key" title={<T de="Das Wichtigste" en="The essentials" />}>
          <T
            de={<ul><li>Die Resultierende ist die Summe aller Kraftvektoren, Komponente für Komponente.</li><li>Sie ist ein freier Vektor: Sie sagt, wie stark und wohin insgesamt gezogen wird, aber nicht wo.</li><li>Bei verteilten Kräften wird die Summe zum Integral. Gegenläufige Anteile heben sich auf, darum ist <M>{t`|\v R|`}</M> oft kleiner als die gesamte Last.</li></ul>}
            en={<ul><li>The resultant is the sum of all force vectors, component by component.</li><li>It is a free vector: it says how hard and where to the whole group pulls, but not where it acts.</li><li>For distributed forces the sum becomes an integral. Opposite parts cancel, so <M>{t`|\v R|`}</M> is often smaller than the whole load.</li></ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
