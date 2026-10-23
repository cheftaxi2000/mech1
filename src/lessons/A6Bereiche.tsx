import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { Bisector, HalfAnimFig, RegionExplorer } from '../viz/ana/W6Figures';

const t = String.raw;

export default function A6Bereiche() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Gleichung oder Ungleichung in <M>z</M> beschreibt eine <b>Menge von Punkten</b> der Ebene: einen Kreis, eine Scheibe, eine Halbebene. Der Schlüssel ist ein Satz der Übung: <b>Beträge als Abstände lesen.</b> Dazu braucht es nur Betrag und Mal-<M>i</M> aus <a href="#ana-komplex">Polarform und Eulerform</a> und <a href="#ana-komplex-potenzen">Potenzen, Wurzeln und Winkelformeln</a>.</p>}
        en={<p className="lede">An equation or inequality in <M>z</M> describes a <b>set of points</b> of the plane: a circle, a disc, a half-plane. The key is one sentence from the class: <b>read moduli as distances.</b> For this you only need the modulus and times-<M>i</M> from <a href="#ana-komplex">Polar form and Euler form</a> and <a href="#ana-komplex-potenzen">Powers, roots and angle formulas</a>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="betrag-abstand" title={<T de="1. Ein Betrag beschreibt einen Abstand" en="1. A modulus describes a distance" />}>
        <Box kind="uebung" src={<Src u={6} p={10} />} title={<T de="Bereiche in der komplexen Ebene" en={<>Regions in the complex plane (<span lang="de">Bereiche in der komplexen Ebene</span>)</>} />}>
          <T de={<p>Ein Betrag beschreibt einen Abstand.</p>} en={<p>A modulus describes a distance.</p>} />
          <MD>{t`|z - z_0| = R: \quad \text{${tr('Kreislinie um', 'circle line around')} } z_0 \text{ ${tr('mit Radius', 'with radius')} } R`}</MD>
          <MD>{t`|z - z_0| < R: \quad \text{${tr('innen, ohne Rand', 'inside, without boundary')}} \qquad (R > 0)`}</MD>
        </Box>
        <T
          de={<p>Warum ist <M>{t`|z - z_0|`}</M> ein Abstand? <M>{t`z - z_0`}</M> ist der Pfeil von <M>{t`z_0`}</M> nach <M>z</M> (wie beim Subtrahieren in Woche 5). Sein Betrag ist seine Länge. Also: <M>{t`|z - z_0|`}</M> = Abstand zwischen den Punkten <M>z</M> und <M p=".">{t`z_0`}</M> Auf der Zahlengerade kennst du das schon: <M>{t`|x - 3|`}</M> ist der Abstand von <M>x</M> zu <M p=".">3</M></p>}
          en={<p>Why is <M>{t`|z - z_0|`}</M> a distance? <M>{t`z - z_0`}</M> is the arrow from <M>{t`z_0`}</M> to <M>z</M> (as with subtracting in week 5). Its modulus is its length. So: <M>{t`|z - z_0|`}</M> = distance between the points <M>z</M> and <M p=".">{t`z_0`}</M> You know this from the number line: <M>{t`|x - 3|`}</M> is the distance from <M>x</M> to <M p=".">3</M></p>}
        />
        <ul>
          <T
            de={<>
              <li><M p=":">{t`|z - z_0| = R`}</M> alle Punkte mit Abstand genau <M>R</M> – die Kreislinie.</li>
              <li><M p=":">{t`|z - z_0| < R`}</M> näher als <M>R</M> – das Innere, ohne die Kreislinie.</li>
              <li><M p=":">{t`|z - z_0| \leq R`}</M> das Innere mit der Kreislinie (Kreisscheibe).</li>
              <li><M p=":">{t`|z - z_0| > R`}</M> alles ausserhalb.</li>
            </>}
            en={<>
              <li><M p=":">{t`|z - z_0| = R`}</M> all points at distance exactly <M>R</M> – the circle line.</li>
              <li><M p=":">{t`|z - z_0| < R`}</M> closer than <M>R</M> – the interior, without the circle line.</li>
              <li><M p=":">{t`|z - z_0| \leq R`}</M> the interior with the circle line (disc).</li>
              <li><M p=":">{t`|z - z_0| > R`}</M> everything outside.</li>
            </>}
          />
        </ul>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="kreis-halbebene" title={<T de="2. Bsp. Kreis und Halbebene" en="2. Example: disc and half-plane" />}>
        <Box kind="uebung" src={<Src u={6} p={10} />} title={<T de="Bsp. Kreis und Halbebene" en={<>Example: disc and half-plane (<span lang="de">Kreis und Halbebene</span>)</>} />}>
          <MD>{t`|z - (1 + i)| \leq 2 \qquad\text{${tr('und als zweites Beispiel:', 'and as a second example:')}}\qquad \mathrm{Re}(iz) > 1`}</MD>
          <MD>{t`z = a + bi \;\Rightarrow\; iz = ai - b \;\Rightarrow\; -b > 1 \;\Rightarrow\; b < -1`}</MD>
          <T de={<p>Mittelpunkt <M p=",">{t`1 + i`}</M> Radius 2, Rand dabei. – Unterhalb von <M p=",">{t`y = -1`}</M> ohne Grenzlinie.</p>}
            en={<p>Centre <M p=",">{t`1 + i`}</M> radius 2, boundary included. – Below <M p=",">{t`y = -1`}</M> without the boundary line.</p>} />
          <T de={<p>Bild: links die blaue Scheibe mit durchgezogenem Rand («Rand dabei»), rechts die magenta Halbebene unter der gestrichelten Linie <M>{t`b = -1`}</M> («Rand nicht dabei»).</p>}
            en={<p>Picture: left the blue disc with a solid boundary (“boundary included”), right the magenta half-plane below the dashed line <M>{t`b = -1`}</M> (“boundary not included”).</p>} />
        </Box>
        <T
          de={<p><b>Die Scheibe:</b> <M>{t`|z - (1 + i)|`}</M> ist der Abstand von <M>z</M> zum Punkt <M p=".">{t`1 + i`}</M> «Höchstens 2» heisst: die Kreisscheibe um <M>{t`1 + i`}</M> mit Radius 2. Wegen <M>{t`\leq`}</M> gehört der Rand dazu – zum Beispiel <M p=",">{t`3 + i`}</M> genau 2 rechts vom Mittelpunkt.</p>}
          en={<p><b>The disc:</b> <M>{t`|z - (1 + i)|`}</M> is the distance from <M>z</M> to the point <M p=".">{t`1 + i`}</M> “At most 2” means: the disc around <M>{t`1 + i`}</M> with radius 2. Because of <M>{t`\leq`}</M> the boundary belongs to it – for example <M p=",">{t`3 + i`}</M> exactly 2 to the right of the centre.</p>}
        />
        <T
          de={<p><b>Die Halbebene:</b> Hier steht kein Betrag, sondern ein Realteil von <M p=".">iz</M> Den rechnet man aus. Die Animation zeigt jeden Schritt auch im Bild.</p>}
          en={<p><b>The half-plane:</b> here there is no modulus but a real part of <M p=".">iz</M> You compute it. The animation shows each step in the picture too.</p>}
        />
        <StepPlayer
          label={tr('Animation: Re(iz) > 1 heisst b < −1', 'Animation: Re(iz) > 1 means b < −1')}
          steps={[
            { ms: 800, holdMs: 2600, caption: <T
              de={<>Ein beliebiger Punkt <M p=",">{t`z = a + bi`}</M> hier <M p=".">{t`2 - 1{,}5i`}</M> <M>b</M> ist seine Höhe.</>}
              en={<>Any point <M p=",">{t`z = a + bi`}</M> here <M p=".">{t`2 - 1.5i`}</M> <M>b</M> is its height.</>} /> },
            { ms: 1500, holdMs: 3200, caption: <T
              de={<>Mal <M>i</M> dreht um 90°: <M p=".">{t`iz = ai + bi^2 = ai - b`}</M> Der Realteil von <M>iz</M> ist also <M p=".">{t`-b`}</M></>}
              en={<>Times <M>i</M> turns by 90°: <M p=".">{t`iz = ai + bi^2 = ai - b`}</M> So the real part of <M>iz</M> is <M p=".">{t`-b`}</M></>} /> },
            { ms: 1000, caption: <T
              de={<><M>{t`\mathrm{Re}(iz) > 1`}</M> heisst <M p=",">{t`-b > 1`}</M> also <M p=".">{t`b < -1`}</M> Alle Punkte unter der Linie <M p=";">{t`b = -1`}</M> die Linie selbst gestrichelt (nicht dabei).</>}
              en={<><M>{t`\mathrm{Re}(iz) > 1`}</M> means <M p=",">{t`-b > 1`}</M> so <M p=".">{t`b < -1`}</M> All points below the line <M p=";">{t`b = -1`}</M> the line itself dashed (not included).</>} /> },
          ]}
        >
          {(step, tt) => <HalfAnimFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>So liest man die Zeile:</b> 1. <M>{t`z = a + bi`}</M> einsetzen. 2. <M p=",">{t`i(a + bi) = ai + bi^2 = ai - b`}</M> weil <M p=".">{t`i^2 = -1`}</M> 3. Der Realteil (der Teil ohne <M p=")">i</M> ist <M p=";">{t`-b`}</M> die Bedingung wird <M p=".">{t`-b > 1`}</M> 4. Mal <M>{t`-1`}</M> dreht das Ungleichheitszeichen um: <M p=".">{t`b < -1`}</M> Die Übung schreibt die Grenzlinie als <M>{t`y = -1`}</M> – gemeint ist dasselbe, denn <M>b</M> ist die Koordinate nach oben.</p>}
          en={<p><b>How to read the line:</b> 1. Substitute <M p=".">{t`z = a + bi`}</M> 2. <M p=",">{t`i(a + bi) = ai + bi^2 = ai - b`}</M> because <M p=".">{t`i^2 = -1`}</M> 3. The real part (the part without <M p=")">i</M> is <M p=";">{t`-b`}</M> the condition becomes <M p=".">{t`-b > 1`}</M> 4. Multiplying by <M>{t`-1`}</M> flips the inequality sign: <M p=".">{t`b < -1`}</M> The class writes the boundary line as <M>{t`y = -1`}</M> – the same thing, since <M>b</M> is the coordinate upwards.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="mehrere-bedingungen" title={<T de="3. Mehrere Bedingungen, Rand zeichnen" en="3. Several conditions, drawing the boundary" />}>
        <Box kind="uebung" src={<><Src u={6} p={10} />, <Src u={6} p={12} /></>} title={<T de="Mehrere Bedingungen" en={<>Several conditions (<span lang="de">Mehrere Bedingungen</span>)</>} />}>
          <T de={<p>Jede Bedingung einzeln zeichnen. Dann nur die gemeinsame Menge behalten.</p>} en={<p>Draw each condition separately. Then keep only the common set.</p>} />
          <T de={<p>Rand dabei: durchgezogen. Rand ausgeschlossen: gestrichelt.</p>} en={<p>Boundary included: solid. Boundary excluded: dashed.</p>} />
          <T de={<p>Beträge als Abstände lesen. Bei mehreren Bedingungen zählt nur die gemeinsame Menge. (S. 12)</p>} en={<p>Read moduli as distances. With several conditions only the common set counts. (p. 12)</p>} />
        </Box>
        <T
          de={<p>Ob der Rand dazugehört, sagt das Zeichen: Bei <M>{t`\leq`}</M> und <M>{t`\geq`}</M> erfüllen die Randpunkte die Bedingung mit Gleichheit – sie gehören dazu. Bei <M>{t`<`}</M> und <M>{t`>`}</M> nicht. Im Bild unten kannst du das prüfen: Setze den roten Testpunkt genau auf einen Rand und schau, welche Bedingungen erfüllt sind.</p>}
          en={<p>Whether the boundary belongs is decided by the sign: with <M>{t`\leq`}</M> and <M>{t`\geq`}</M> the boundary points satisfy the condition with equality – they belong. With <M>{t`<`}</M> and <M>{t`>`}</M> they do not. You can check this in the figure below: put the red test point exactly on a boundary and see which conditions hold.</p>}
        />
        <RegionExplorer />
        <T
          de={<p>Die Knöpfe zeigen die beiden Beispiele der Übung und drei weitere: den <b>Kreisring</b> <M>{t`1 \leq |z| < 2`}</M> (innerer Rand dabei, äusserer nicht), die <b>Halbebene</b> <M>{t`\mathrm{Re}\,z \geq \mathrm{Im}\,z`}</M> (mit <M>{t`z = a + bi`}</M> heisst das <M p=":">{t`a \geq b`}</M> alles rechts unterhalb der Geraden <M p=")">{t`b = a`}</M> und die <b>Schnittmenge</b> aus Scheibe und dieser Halbebene: Hell siehst du jede Bedingung einzeln, kräftig nur das, was beide erfüllt. Beim Schnitt ist nur der Teil der Ränder kräftig, der wirklich die neue Menge begrenzt.</p>}
          en={<p>The buttons show the two class examples and three more: the <b>annulus</b> <M>{t`1 \leq |z| < 2`}</M> (inner boundary included, outer not), the <b>half-plane</b> <M>{t`\mathrm{Re}\,z \geq \mathrm{Im}\,z`}</M> (with <M>{t`z = a + bi`}</M> this means <M p=":">{t`a \geq b`}</M> everything to the lower right of the line <M p=")">{t`b = a`}</M> and the <b>intersection</b> of the disc and this half-plane: light shows each condition alone, strong only what satisfies both. In the intersection only the part of the boundaries that really bounds the new set is drawn strongly.</p>}
        />
        <Box kind="supplement" title={<T de={<>Gleich weit weg: <M>{t`|z - a| = |z - b|`}</M></>} en={<>Equally far: <M>{t`|z - a| = |z - b|`}</M></>} />}>
          <T
            de={<p>Liest man die Beträge als Abstände, heisst diese Gleichung: <M>z</M> ist gleich weit von <M>a</M> und von <M>b</M> entfernt. Das sind genau die Punkte der <b>Mittelsenkrechten</b> der Strecke von <M>a</M> nach <M p=".">b</M> Rechnerisch: Beide Seiten quadrieren und mit <M>{t`z = x + iy`}</M> ausschreiben. Die Terme <M>{t`x^2`}</M> und <M>{t`y^2`}</M> stehen auf beiden Seiten und fallen weg. Übrig bleibt eine lineare Gleichung – eine Gerade. Mit <M>{t`<`}</M> statt <M>=</M> bekommt man die Halbebene auf der Seite von <M p=".">a</M></p>}
            en={<p>Reading the moduli as distances, this equation says: <M>z</M> is equally far from <M>a</M> and from <M p=".">b</M> These are exactly the points of the <b>perpendicular bisector</b> of the segment from <M>a</M> to <M p=".">b</M> By calculation: square both sides and write them out with <M p=".">{t`z = x + iy`}</M> The terms <M>{t`x^2`}</M> and <M>{t`y^2`}</M> appear on both sides and cancel. What remains is a linear equation – a straight line. With <M>{t`<`}</M> instead of <M>=</M> you get the half-plane on the side of <M p=".">a</M></p>}
          />
          <Bisector />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="bereiche-merke" title={<T de="4. Typische Fehler und das Wichtigste" en="4. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`|z + 2| \leq 1`}</M> ist die Scheibe um <M p=".»">2</M></>} en={<>“<M>{t`|z + 2| \leq 1`}</M> is the disc around <M p=".”">2</M></>} />}>
          <T de={<>Zuerst in die Form <M>{t`|z - z_0|`}</M> bringen: <M p=".">{t`|z + 2| = |z - (-2)|`}</M> Der Mittelpunkt ist <M p=".">{t`-2`}</M> Genauso ist bei <M>{t`|z - (1 + i)|`}</M> der Mittelpunkt <M p=",">{t`1 + i`}</M> nicht <M p=".">{t`-1 - i`}</M></>}
            en={<>First bring it into the form <M p=":">{t`|z - z_0|`}</M> <M p=".">{t`|z + 2| = |z - (-2)|`}</M> The centre is <M p=".">{t`-2`}</M> Likewise for <M>{t`|z - (1 + i)|`}</M> the centre is <M p=",">{t`1 + i`}</M> not <M p=".">{t`-1 - i`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\mathrm{Re}(iz) > 1`}</M> heisst <M p=".»">{t`a > 1`}</M></>} en={<>“<M>{t`\mathrm{Re}(iz) > 1`}</M> means <M p=".”">{t`a > 1`}</M></>} />}>
          <T de={<>Erst <M>iz</M> ausrechnen, dann den Realteil nehmen. Mal <M>i</M> dreht den Punkt; der Realteil von <M>iz</M> ist <M p=",">{t`-b`}</M> nicht <M p=".">a</M></>}
            en={<>First compute <M p=",">iz</M> then take the real part. Times <M>i</M> turns the point; the real part of <M>iz</M> is <M p=",">{t`-b`}</M> not <M p=".">a</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Bei <M>{t`<`}</M> zeichne ich den Rand trotzdem durchgezogen.»</>} en={<>“With <M>{t`<`}</M> I still draw the boundary solid.”</>} />}>
          <T de={<>Durchgezogen heisst «gehört dazu». Bei <M>{t`<`}</M> und <M>{t`>`}</M> gehört der Rand nicht dazu: gestrichelt zeichnen. Testen: Einen Randpunkt einsetzen – Gleichheit erfüllt <M>{t`<`}</M> nicht.</>}
            en={<>Solid means “belongs”. With <M>{t`<`}</M> and <M>{t`>`}</M> the boundary does not belong: draw it dashed. Test: substitute a boundary point – equality does not satisfy <M p=".">{t`<`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Zwei Bedingungen: Ich schraffiere beide Mengen.»" en="“Two conditions: I shade both sets.”" />}>
          <T de={<>Gemeint ist «und»: nur die Punkte, die <b>beide</b> Bedingungen erfüllen. Jede einzeln zeichnen, dann nur die Überlappung behalten.</>}
            en={<>“And” is meant: only the points that satisfy <b>both</b> conditions. Draw each one alone, then keep only the overlap.</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M>{t`|z - z_0|`}</M> = Abstand von <M>z</M> zu <M p=".">{t`z_0`}</M> <M p=":">{t`= R`}</M> Kreislinie, <M p=":">{t`< R`}</M> innen, <M p=":">{t`> R`}</M> aussen.</li>
              <li>Real- und Imaginärteil-Bedingungen: <M>{t`z = a + bi`}</M> einsetzen, ausrechnen – das gibt Geraden und Halbebenen.</li>
              <li>Mehrere Bedingungen: jede einzeln zeichnen, nur die gemeinsame Menge behalten.</li>
              <li>Rand dabei (<M p=",">{t`\leq, \geq`}</M> <M p=")">=</M> durchgezogen; ausgeschlossen (<M p=")">{t`<, >`}</M> gestrichelt.</li>
            </ul>}
            en={<ul>
              <li><M>{t`|z - z_0|`}</M> = distance from <M>z</M> to <M p=".">{t`z_0`}</M> <M p=":">{t`= R`}</M> circle line, <M p=":">{t`< R`}</M> inside, <M p=":">{t`> R`}</M> outside.</li>
              <li>Conditions on real and imaginary parts: substitute <M p=",">{t`z = a + bi`}</M> compute – this gives lines and half-planes.</li>
              <li>Several conditions: draw each one alone, keep only the common set.</li>
              <li>Boundary included (<M p=",">{t`\leq, \geq`}</M> <M p=")">=</M> solid; excluded (<M p=")">{t`<, >`}</M> dashed.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
