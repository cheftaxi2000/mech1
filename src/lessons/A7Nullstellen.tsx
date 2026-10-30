import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { DivisionFig, QuadraticExplorer, RootBuilder } from '../viz/ana/W7Figures';

const t = String.raw;

export default function A7Nullstellen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Mit den komplexen Zahlen aus <a href="#ana-komplex">Woche 6</a> hat jede quadratische Gleichung Lösungen, auch wenn die Parabel die x-Achse nie trifft. Für Polynome mit reellen Koeffizienten gilt dazu eine schöne Regel: Nicht-reelle Nullstellen kommen immer als Spiegelpaar. Damit kann man Nullstellen zählen und, wenn eine bekannt ist, die anderen finden.</p>}
        en={<p className="lede">With the complex numbers of <a href="#ana-komplex">week 6</a> every quadratic equation has solutions, even when the parabola never meets the x-axis. For polynomials with real coefficients there is also a neat rule: non-real zeros always come as a mirror pair. With it one can count zeros and, if one is known, find the others.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="quadratisch" title={<T de="1. Komplexe Nullstellen einer quadratischen Gleichung" en="1. Complex zeros of a quadratic equation" />}>
        <Box kind="uebung" src={<Src u={7} p={5} />} title={<T de="Nullstellen von reellen Polynomen" en={<>Zeros of real polynomials (<De en="zeros">Nullstellen</De>)</>} />}>
          <MD>{t`p(z) = a_0 + a_1 z + a_2 z^2 + a_3 z^3 + \dots + a_n z^n`}</MD>
          <T de={<p><M>n</M> = Grad des Polynoms, <M>{t`a_i`}</M> = reelle Koeffizienten. «Eine Nullstelle ist eine Zahl, die beim Einsetzen null ergibt»: <M p=".">{t`p(z) = 0`}</M></p>} en={<p><M>n</M> = degree of the polynomial, <M>{t`a_i`}</M> = real coefficients. “A zero is a number that gives zero when substituted”: <M p=".">{t`p(z) = 0`}</M></p>} />
          <MD>{t`az^2 + bz + c = 0 \;\Rightarrow\; z_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`}</MD>
          <T de={<p><M p=":">{t`b^2 - 4ac > 0`}</M> 2 reelle Nullstellen; <M p=":">{t`b^2 - 4ac = 0`}</M> doppelte reelle Nullstelle; <M p=":">{t`b^2 - 4ac < 0`}</M> 2 komplexe Nullstellen.</p>} en={<p><M p=":">{t`b^2 - 4ac > 0`}</M> 2 real zeros; <M p=":">{t`b^2 - 4ac = 0`}</M> a double real zero; <M p=":">{t`b^2 - 4ac < 0`}</M> 2 complex zeros.</p>} />
          <MD>{t`z^2 - 2z + 5 = 0 \;\Rightarrow\; z_{1,2} = \frac{2 \pm \sqrt{4 - 4\cdot 5}}{2} = 1 \pm \sqrt{-4}, \qquad z_1 = 1 + 2i,\quad z_2 = 1 - 2i`}</MD>
          <T de={<p>«Die beiden Punkte sind Spiegelbilder an der reellen Achse. Komplexe Nullstellen kommen immer in komplex konjugierten Paaren vor: <M>{t`a + bi`}</M> und <M p=".">{t`a - bi`}</M>»</p>} en={<p>“The two points are mirror images in the real axis. Complex zeros always come in complex conjugate pairs: <M>{t`a + bi`}</M> and <M p=".">{t`a - bi`}</M>”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das Beispiel.</b></p>
            <ol className="keep">
              <li>Die Diskriminante <M>{t`b^2 - 4ac = 4 - 20 = -16`}</M> ist negativ. Im Reellen hiesse das «keine Lösung».</li>
              <li>Mit <M>{t`i^2 = -1`}</M> geht es weiter: <M p=".">{t`\sqrt{-4} = \sqrt{4}\cdot\sqrt{-1} = 2i`}</M> (Gemeint ist die Zahl, deren Quadrat <M>-4</M> ist; <M p={'\u00a0✓.)'}>{t`(2i)^2 = 4i^2 = -4`}</M></li>
              <li>Das <M>\pm</M> gibt zwei Zahlen mit demselben Realteil 1 und entgegengesetztem Imaginärteil: <M p=".">{t`1 \pm 2i`}</M></li>
            </ol>
            <p>Im Bild links die Parabel, rechts die komplexe Ebene. Schiebe <M>c</M> von unten nach oben: Zuerst schneidet die Parabel die Achse zweimal, dann berührt sie sie (doppelte Nullstelle), dann hebt sie ab. In diesem Moment treffen sich die zwei reellen Nullstellen und laufen senkrecht auseinander, eine nach oben, eine nach unten.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the example.</b></p>
            <ol className="keep">
              <li>The discriminant <M>{t`b^2 - 4ac = 4 - 20 = -16`}</M> is negative. In the reals this would mean “no solution”.</li>
              <li>With <M>{t`i^2 = -1`}</M> one can go on: <M p=".">{t`\sqrt{-4} = \sqrt{4}\cdot\sqrt{-1} = 2i`}</M> (Meant is the number whose square is <M p=";">-4</M> <M p={'\u00a0✓.)'}>{t`(2i)^2 = 4i^2 = -4`}</M></li>
              <li>The <M>\pm</M> gives two numbers with the same real part 1 and opposite imaginary parts: <M p=".">{t`1 \pm 2i`}</M></li>
            </ol>
            <p>In the figure: the parabola on the left, the complex plane on the right. Move <M>c</M> from bottom to top: first the parabola cuts the axis twice, then it touches it (double zero), then it lifts off. At that moment the two real zeros meet and run apart vertically, one up, one down.</p>
          </>}
        />
        <QuadraticExplorer />
        <Box kind="supplement" keep title={<T de="Warum immer ein Spiegelpaar?" en="Why always a mirror pair?" />}>
          <T
            de={<p>Konjugieren (das Vorzeichen des Imaginärteils umdrehen) verträgt sich mit Plus und Mal: <M>{t`\overline{z + w} = \bar z + \bar w`}</M> und <M p=".">{t`\overline{zw} = \bar z\,\bar w`}</M> Reelle Koeffizienten ändern sich dabei nicht, <M p=".">{t`\bar a_k = a_k`}</M> Also:</p>}
            en={<p>Conjugating (flipping the sign of the imaginary part) is compatible with plus and times: <M>{t`\overline{z + w} = \bar z + \bar w`}</M> and <M p=".">{t`\overline{zw} = \bar z\,\bar w`}</M> Real coefficients do not change, <M p=".">{t`\bar a_k = a_k`}</M> Hence:</p>}
          />
          <MD>{t`p(\bar z) = a_0 + a_1\bar z + \dots + a_n\bar z^{\,n} = \overline{a_0 + a_1 z + \dots + a_n z^n} = \overline{p(z)}`}</MD>
          <T
            de={<p>Ist <M p=",">{t`p(z) = 0`}</M> dann ist <M p=":">{t`p(\bar z) = \bar 0 = 0`}</M> Das Spiegelbild ist ebenfalls eine Nullstelle. Bei komplexen Koeffizienten gilt das nicht mehr: <M>{t`z - i`}</M> hat nur die Nullstelle <M p=".">i</M></p>}
            en={<p>If <M p=",">{t`p(z) = 0`}</M> then <M p=":">{t`p(\bar z) = \bar 0 = 0`}</M> the mirror image is a zero as well. With complex coefficients this no longer holds: <M>{t`z - i`}</M> has only the zero <M p=".">i</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="zaehlen" title={<T de="2. Nullstellen zählen" en="2. Counting zeros" />}>
        <Box kind="uebung" src={<Src u={7} p={6} />} title={<T de="Nullstellen zählen" en="Counting zeros" />}>
          <T de={<p>«Der Grad sagt, wie viele Nullstellen es insgesamt (reell + komplex) gibt. Wiederholte Nullstellen zählen mehrfach.»</p>} en={<p>“The degree tells how many zeros there are in total (real + complex). Repeated zeros count several times.”</p>} />
          <MD>{t`\text{Grad } n = \#\,\text{Nullstellen}`}</MD>
          <T de={<p>Bsp. eine doppelte Nullstelle: <M p=".">{t`p(z) = (z - 2)^2(z^2 + 1) = (z - 2)(z - 2)(z^2 + 1)`}</M> Nullstelle 2 zweimal, <M>i</M> einmal, <M>-i</M> einmal. «Vier Nullstellen gezählt, aber nur drei verschiedene Zahlen.»</p>} en={<p>Ex. a double zero: <M p=".">{t`p(z) = (z - 2)^2(z^2 + 1) = (z - 2)(z - 2)(z^2 + 1)`}</M> Zero 2 twice, <M>i</M> once, <M>-i</M> once. “Four zeros counted, but only three different numbers.”</p>} />
          <T de={<p>«<M>{t`r_p`}</M> zählt die reellen, <M>{t`c_p`}</M> die nicht-reellen Nullstellen, jeweils mit Vielfachheit.»</p>} en={<p>“<M>{t`r_p`}</M> counts the real, <M>{t`c_p`}</M> the non-real zeros, each with multiplicity.”</p>} />
          <MD>{t`r_p + c_p = n, \qquad c_p \in \{0, 2, 4, \dots\}`}</MD>
          <T de={<p>«Nicht-reelle Nullstellen kommen paarweise. Bei ungeradem Grad bleibt mindestens eine reelle übrig.» Grad 3: <M p=".">{t`(r_p, c_p) = (3, 0) \text{ oder } (1, 2)`}</M></p>} en={<p>“Non-real zeros come in pairs. For odd degree at least one real zero remains.” Degree 3: <M p=".">{t`(r_p, c_p) = (3, 0) \text{ or } (1, 2)`}</M></p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Woher kommt «Grad gleich Anzahl»?</b> Jede Nullstelle <M>{t`z_k`}</M> liefert einen Faktor <M p=".">{t`(z - z_k)`}</M> Ein Polynom vom Grad <M>n</M> zerfällt über <M>{t`\mathbb C`}</M> in genau <M>n</M> solche Faktoren (Fundamentalsatz der Algebra, nicht im Resümee bewiesen). Kommt ein Faktor zweimal vor, ist die Nullstelle doppelt und zählt zweimal.</p>
            <p className="keep"><b>Warum ist <M>{t`c_p`}</M> gerade?</b> Wegen der Spiegelpaare aus Abschnitt 1. Jedes Paar liefert zusammen einen reellen quadratischen Faktor, etwa <M p=".">{t`(z - i)(z + i) = z^2 + 1`}</M> Bei ungeradem Grad kann man nicht alles in Paare aufteilen: Eine Nullstelle bleibt allein und muss ihr eigenes Spiegelbild sein, also reell.</p>
          </>}
          en={<>
            <p className="keep"><b>Where does “degree equals number” come from?</b> Every zero <M>{t`z_k`}</M> gives a factor <M p=".">{t`(z - z_k)`}</M> A polynomial of degree <M>n</M> splits over <M>{t`\mathbb C`}</M> into exactly <M>n</M> such factors (fundamental theorem of algebra, not proved in the summary). If a factor occurs twice, the zero is double and counts twice.</p>
            <p className="keep"><b>Why is <M>{t`c_p`}</M> even?</b> Because of the mirror pairs of section 1. Each pair together gives a real quadratic factor, e.g. <M p=".">{t`(z - i)(z + i) = z^2 + 1`}</M> For odd degree not everything can be split into pairs: one zero stays alone and must be its own mirror image, hence real.</p>
          </>}
        />
        <RootBuilder />
        <T
          de={<>
            <p className="keep"><b>Beispiel aus einer Prüfung (SC 9, S. 6).</b> Ein reelles Polynom hat die Nullstellen <M p=",">{t`-1 - i`}</M> <M p=",">0</M> <M>{t`1 + i`}</M> und <M p=".">{t`-1 + i`}</M> Kleinstmöglicher Grad? Die Spiegelbilder müssen dabei sein: <M>{t`-1 - i`}</M> und <M>{t`-1 + i`}</M> sind schon ein Paar, zu <M>{t`1 + i`}</M> fehlt noch <M p=".">{t`1 - i`}</M> Mit der reellen Nullstelle 0 sind das <M>{t`2 + 2 + 1 = 5`}</M> Nullstellen, also Grad mindestens 5 (Antwort B). Im Bild: Knopf «SC 9».</p>
            <p className="keep"><b>SC 8 (S. 7).</b> Wie viele reelle Nullstellen (mit Vielfachheit) hat <M p="?">{t`x^4 - x`}</M> Ausklammern: <M p=".">{t`x^4 - x = x(x^3 - 1) = x(x - 1)(x^2 + x + 1)`}</M> Der letzte Faktor hat die Diskriminante <M p=",">{t`1 - 4 = -3 < 0`}</M> also ein komplexes Paar. Reell bleiben 0 und 1: zwei (Antwort D), und <M p=".">{t`(r_p, c_p) = (2, 2)`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>Example from an exam (SC 9, p. 6).</b> A real polynomial has the zeros <M p=",">{t`-1 - i`}</M> <M p=",">0</M> <M p=",">{t`1 + i`}</M> and <M p=".">{t`-1 + i`}</M> Smallest possible degree? The mirror images must be included: <M>{t`-1 - i`}</M> and <M>{t`-1 + i`}</M> already are a pair, <M>{t`1 + i`}</M> still needs <M p=".">{t`1 - i`}</M> With the real zero 0 that makes <M>{t`2 + 2 + 1 = 5`}</M> zeros, so degree at least 5 (answer B). In the figure: button “SC 9”.</p>
            <p className="keep"><b>SC 8 (p. 7).</b> How many real zeros (with multiplicity) does <M>{t`x^4 - x`}</M> have? Factor out: <M p=".">{t`x^4 - x = x(x^3 - 1) = x(x - 1)(x^2 + x + 1)`}</M> The last factor has discriminant <M p=",">{t`1 - 4 = -3 < 0`}</M> so a complex pair. Real are 0 and 1: two (answer D), and <M p=".">{t`(r_p, c_p) = (2, 2)`}</M></p>
          </>}
        />
        <Box kind="misconception" title={<T de="«Ein Polynom 5. Grades hat 5 verschiedene Nullstellen»" en="“A polynomial of degree 5 has 5 different zeros”" />}>
          <T
            de={<p>Es hat 5 Nullstellen <b>mit Vielfachheit</b>. <M>{t`(z - 1)^5`}</M> hat nur die eine Zahl 1 als Nullstelle, sie zählt fünfmal. Ebenso hat <M>{t`(z - 2)^2(z^2 + 1)`}</M> vier gezählte, aber nur drei verschiedene Nullstellen.</p>}
            en={<p>It has 5 zeros <b>with multiplicity</b>. <M>{t`(z - 1)^5`}</M> has only the single number 1 as a zero; it counts five times. Likewise <M>{t`(z - 2)^2(z^2 + 1)`}</M> has four counted, but only three different zeros.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="finden" title={<T de="3. Aus einer Nullstelle alle finden" en="3. Finding all zeros from one" />}>
        <Box kind="uebung" src={<Src u={7} p={7} />} title={<T de="Nullstellen finden" en="Finding zeros" />}>
          <T de={<p>«Gegeben ist eine Nullstelle <M>{t`1 + i`}</M> von <M p=".">{t`p(z)`}</M> Wir suchen die restlichen Nullstellen.»</p>} en={<p>“Given is a zero <M>{t`1 + i`}</M> of <M p=".">{t`p(z)`}</M> We look for the remaining zeros.”</p>} />
          <MD>{t`p(z) = z^4 - 6z^3 + 23z^2 - 34z + 26 = (z - z_1)(z - z_2)(z - z_3)(z - z_4)`}</MD>
          <T de={<p>Das Paar liefert einen Faktor: <M p=",">{t`1 + i \Rightarrow 1 - i`}</M></p>} en={<p>The pair gives a factor: <M p=",">{t`1 + i \Rightarrow 1 - i`}</M></p>} />
          <MD>{t`(z - (1 + i))(z - (1 - i)) = (z - 1)^2 + 1 = z^2 - 2z + 2`}</MD>
          <T de={<p>Polynomdivision:</p>} en={<p>Polynomial division:</p>} />
          <MD>{t`(z^4 - 6z^3 + 23z^2 - 34z + 26) : (z^2 - 2z + 2) = z^2 - 4z + 13`}</MD>
          <MD>{t`p(z) = (z^2 - 2z + 2)(z^2 - 4z + 13), \qquad z_{3,4} = \frac{4 \pm \sqrt{4^2 - 4\cdot 13}}{2} = 2 \pm \sqrt{-9} = 2 \pm 3i`}</MD>
          <T de={<p>«Kontrolle: vier Nullstellen für ein Polynom vierten Grades.»</p>} en={<p>“Check: four zeros for a polynomial of degree four.”</p>} />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man den Weg.</b></p>
            <ol className="keep">
              <li>Weil die Koeffizienten reell sind, ist mit <M>{t`1 + i`}</M> auch <M>{t`1 - i`}</M> eine Nullstelle. Gratis.</li>
              <li>Die zwei Faktoren zusammen geben einen <b>reellen</b> Faktor: <M p=".">{t`(z - 1 - i)(z - 1 + i) = (z - 1)^2 - i^2 = (z - 1)^2 + 1`}</M> Das ist die dritte binomische Formel mit <M>{t`a = z - 1`}</M> und <M p=".">{t`b = i`}</M></li>
              <li>Man teilt <M>p</M> durch diesen Faktor wie bei Zahlen mit Rest: jeweils den höchsten Term wegmachen. Der Rest muss 0 sein, sonst wäre <M>{t`1 + i`}</M> keine Nullstelle.</li>
              <li>Übrig bleibt ein Polynom zweiten Grades; die Mitternachtsformel gibt die letzten zwei.</li>
            </ol>
            <p>Achtung bei der zweiten Zeile der Division im Resümee: Abgezogen wird <M p=",">{t`-4z\cdot(z^2 - 2z + 2) = -4z^3 + 8z^2 - 8z`}</M> nicht <M>{t`4z^3 + \dots`}</M> wie gedruckt (A-019). Das Ergebnis <M>{t`13z^2 - 26z + 26`}</M> stimmt.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the route.</b></p>
            <ol className="keep">
              <li>Because the coefficients are real, <M>{t`1 - i`}</M> is a zero along with <M p=".">{t`1 + i`}</M> For free.</li>
              <li>The two factors together give a <b>real</b> factor: <M p=".">{t`(z - 1 - i)(z - 1 + i) = (z - 1)^2 - i^2 = (z - 1)^2 + 1`}</M> That is the difference of squares with <M>{t`a = z - 1`}</M> and <M p=".">{t`b = i`}</M></li>
              <li>Divide <M>p</M> by this factor as with numbers and remainders: remove the highest term each time. The remainder must be 0, otherwise <M>{t`1 + i`}</M> would not be a zero.</li>
              <li>What is left has degree two; the quadratic formula gives the last two.</li>
            </ol>
            <p>Careful with the second line of the division in the summary: subtracted is <M p=",">{t`-4z\cdot(z^2 - 2z + 2) = -4z^3 + 8z^2 - 8z`}</M> not <M>{t`4z^3 + \dots`}</M> as printed (A-019). The result <M>{t`13z^2 - 26z + 26`}</M> is right.</p>
          </>}
        />
        <StepPlayer
          label={tr('Animation: aus 1 + i alle vier Nullstellen', 'Animation: all four zeros from 1 + i')}
          steps={[
            { ms: 600, holdMs: 2600, caption: <T de={<>Bekannt ist eine Nullstelle, <M p=",">{t`1 + i`}</M> im ersten Quadranten.</>} en={<>One zero is known, <M p=",">{t`1 + i`}</M> in the first quadrant.</>} /> },
            { ms: 1200, holdMs: 2600, caption: <T de={<>Gespiegelt an der reellen Achse: <M>{t`1 - i`}</M> ist ebenfalls Nullstelle, weil alle Koeffizienten reell sind.</>} en={<>Mirrored in the real axis: <M>{t`1 - i`}</M> is a zero too, because all coefficients are real.</>} /> },
            { ms: 1000, holdMs: 2800, caption: <T de={<>Das Paar ergibt den reellen Faktor <M p=".">{t`z^2 - 2z + 2`}</M></>} en={<>The pair gives the real factor <M p=".">{t`z^2 - 2z + 2`}</M></>} /> },
            { ms: 2600, holdMs: 3200, caption: <T de={<>Polynomdivision in drei Zeilen, Rest 0: <M p=".">{t`p(z) = (z^2 - 2z + 2)(z^2 - 4z + 13)`}</M></>} en={<>Polynomial division in three lines, remainder 0: <M p=".">{t`p(z) = (z^2 - 2z + 2)(z^2 - 4z + 13)`}</M></>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Mitternachtsformel für den zweiten Faktor: <M p=".">{t`2 \pm 3i`}</M> Wieder ein Spiegelpaar.</>} en={<>Quadratic formula for the second factor: <M p=".">{t`2 \pm 3i`}</M> Again a mirror pair.</>} /> },
            { ms: 800, holdMs: 2800, caption: <T de={<>Vier Nullstellen für Grad 4, zwei Spiegelpaare: <M p=".">{t`(r_p, c_p) = (0, 4)`}</M></>} en={<>Four zeros for degree 4, two mirror pairs: <M p=".">{t`(r_p, c_p) = (0, 4)`}</M></>} /> },
          ]}
        >
          {(step, tt) => <DivisionFig step={step} t={tt} />}
        </StepPlayer>
      </Section>
    </article>
  );
}
