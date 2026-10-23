import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { ComplexExplorer, DivSteps, MulGrid, NumberSets } from '../viz/ana/Week5Figures';

const t = String.raw;

export default function A5Komplex() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die Gleichung <M>{t`x^2 = -1`}</M> hat keine reelle Lösung – jedes Quadrat ist <M p=".">{t`\geq 0`}</M> Die komplexen Zahlen fügen eine Lösung hinzu: die imaginäre Einheit <M p=".">i</M> Hier lernst du, wie man mit ihnen rechnet. Das meiste ist Rechnen wie gewohnt, plus eine Regel: <M p=".">{t`i^2 = -1`}</M></p>}
        en={<p className="lede">The equation <M>{t`x^2 = -1`}</M> has no real solution – every square is <M p=".">{t`\geq 0`}</M> The complex numbers add a solution: the imaginary unit <M p=".">i</M> Here you learn how to calculate with them. Most of it is ordinary arithmetic, plus one rule: <M p=".">{t`i^2 = -1`}</M></p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="zahlenmengen" title={<T de="1. Die Zahlenmengen" en="1. The number sets" />}>
        <Box kind="uebung" src={<Src u={5} p={6} />} title={<T de="Zahlenmengen" en={<De en="number sets">Zahlenmengen</De>} />}>
          <T
            de={<ul>
              <li><M>{t`\mathbb N`}</M> = natürliche Zahlen = <M p=",">{t`\{(0), 1; 2; 3; \dots\}`}</M> <M>{t`\mathbb N^+ = \mathbb N\setminus\{0\} = \{1; 2; 3; \dots\}`}</M></li>
              <li><M>{t`\mathbb Z`}</M> = ganze Zahlen = <M>{t`\{0; \pm1; \pm2; \pm3; \dots\}`}</M></li>
              <li><M>{t`\mathbb Q`}</M> = rationale Zahlen = <M>{t`\{p/q:\ p, q`}</M> sind <M>{t`\mathbb Z`}</M> und <M>{t`q \neq 0\}`}</M></li>
              <li><M>{t`\mathbb R`}</M> = reelle Zahlen <M>=</M> alle Zahlen, die auf der Zahlengerade liegen</li>
              <li><M>{t`\mathbb C`}</M> = komplexe Zahlen = <M>{t`\{z = a - ib:\ a, b`}</M> sind <M>{t`\mathbb R`}</M> und <M>{t`i = \sqrt{-1}`}</M> oder <M>{t`i^2 = -1\}`}</M> (<M p=":">i</M> imaginäre Einheit)</li>
            </ul>}
            en={<ul>
              <li><M>{t`\mathbb N`}</M> = natural numbers = <M p=",">{t`\{(0), 1; 2; 3; \dots\}`}</M> <M>{t`\mathbb N^+ = \mathbb N\setminus\{0\} = \{1; 2; 3; \dots\}`}</M></li>
              <li><M>{t`\mathbb Z`}</M> = integers = <M>{t`\{0; \pm1; \pm2; \pm3; \dots\}`}</M></li>
              <li><M>{t`\mathbb Q`}</M> = rational numbers = <M>{t`\{p/q:\ p, q`}</M> are in <M>{t`\mathbb Z`}</M> and <M>{t`q \neq 0\}`}</M></li>
              <li><M>{t`\mathbb R`}</M> = real numbers <M>=</M> all numbers on the number line</li>
              <li><M>{t`\mathbb C`}</M> = complex numbers = <M>{t`\{z = a - ib:\ a, b`}</M> are in <M>{t`\mathbb R`}</M> and <M>{t`i = \sqrt{-1}`}</M> or <M>{t`i^2 = -1\}`}</M> (<M p=":">i</M> <De en="imaginary unit">imaginäre Einheit</De>)</li>
            </ul>}
          />
        </Box>
        <NumberSets />
        <T
          de={<p>Jede Menge stopft ein Loch der vorigen: <M>{t`3 - 5`}</M> braucht <M p=",">{t`\mathbb Z`}</M> <M>{t`1 : 2`}</M> braucht <M p=",">{t`\mathbb Q`}</M> <M>{t`\sqrt2`}</M> braucht <M p=",">{t`\mathbb R`}</M> <M>{t`x^2 = -1`}</M> braucht <M p=".">{t`\mathbb C`}</M> Die «(0)» heisst: Ob <M>0</M> zu <M>{t`\mathbb N`}</M> gehört, ist Abmachung; <M>{t`\mathbb N^+`}</M> schliesst sie sicher aus. Zwei kleine Unschärfen in der letzten Zeile: Gemeint ist die Standardform <M>{t`z = a + bi`}</M> (die nächste Seite schreibt sie so). Und <M>{t`i = \sqrt{-1}`}</M> ist nur eine Kurzschrift – die eigentliche Definition ist <M>{t`i^2 = -1`}</M> (warum, steht unten bei den Missverständnissen).</p>}
          en={<p>Each set fills a gap of the previous one: <M>{t`3 - 5`}</M> needs <M p=",">{t`\mathbb Z`}</M> <M>{t`1 : 2`}</M> needs <M p=",">{t`\mathbb Q`}</M> <M>{t`\sqrt2`}</M> needs <M p=",">{t`\mathbb R`}</M> <M>{t`x^2 = -1`}</M> needs <M p=".">{t`\mathbb C`}</M> The “(0)” means: whether <M>0</M> belongs to <M>{t`\mathbb N`}</M> is a convention; <M>{t`\mathbb N^+`}</M> certainly excludes it. Two small imprecisions in the last line: the standard form meant is <M>{t`z = a + bi`}</M> (the next page writes it that way). And <M>{t`i = \sqrt{-1}`}</M> is only shorthand – the actual definition is <M>{t`i^2 = -1`}</M> (why, see the misconceptions below).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="komplex-ebene-rechnen" title={<T de={<>2. <M p=",">{t`z = a + bi`}</M> Real- und Imaginärteil</>} en={<>2. <M p=",">{t`z = a + bi`}</M> real and imaginary part</>} />}>
        <Box kind="uebung" src={<Src u={5} p={7} />} title={<T de="Komplexe Zahlen" en={<De en="complex numbers">Komplexe Zahlen</De>} />}>
          <MD>{t`x^2 = -1 \;\Rightarrow\; x = \pm i, \qquad i^2 = -1`}</MD>
          <MD>{t`z = a + bi, \qquad a, b \in \mathbb R`}</MD>
          <MD>{t`\mathrm{Re}(z) = a, \qquad \mathrm{Im}(z) = b \quad (\text{${tr('nicht', 'not')} } bi!)`}</MD>
          <T de={<p>Bild: <M>{t`z = 3 + 4i`}</M> als blauer Pfeil mit <M p=",">{t`|z| = 5`}</M> <M>{t`\bar z = 3 - 4i`}</M> magenta. Realteil: rechts/links. Imaginärteil: oben/unten.</p>}
            en={<p>Picture: <M>{t`z = 3 + 4i`}</M> as a blue arrow with <M p=";">{t`|z| = 5`}</M> <M>{t`\bar z = 3 - 4i`}</M> magenta. Real part: right/left. Imaginary part: up/down.</p>} />
        </Box>
        <T
          de={<p>Eine komplexe Zahl ist ein Paar aus zwei reellen Zahlen: <M>a</M> (Realteil) und <M>b</M> (Imaginärteil). Darum passt sie nicht auf die Zahlengerade, sondern in eine Ebene – wie ein Punkt auf einer Landkarte: <M>a</M> Schritte nach rechts, <M>b</M> Schritte nach oben. Der Abstand vom Nullpunkt heisst Betrag <M p=":">{t`|z|`}</M> bei <M>{t`3 + 4i`}</M> nach Pythagoras <M p=".">{t`\sqrt{3^2 + 4^2} = 5`}</M></p>}
          en={<p>A complex number is a pair of two real numbers: <M>a</M> (real part) and <M>b</M> (imaginary part). That is why it does not fit on the number line but in a plane – like a point on a map: <M>a</M> steps to the right, <M>b</M> steps up. The distance from the origin is the modulus <M p=":">{t`|z|`}</M> for <M>{t`3 + 4i`}</M> by Pythagoras <M p=".">{t`\sqrt{3^2 + 4^2} = 5`}</M></p>}
        />
        <ComplexExplorer />
        <T
          de={<p>Die Knöpfe oben im Bild gehören zu den Abschnitten 3 und 5. Wie man in der Ebene auch multipliziert und dividiert (mit Winkeln), zeigt die Lektion <a href="#ana-komplex">Polarform und Eulerform</a>.</p>}
          en={<p>The buttons above the figure belong to sections 3 and 5. How to multiply and divide in the plane as well (with angles) is shown in the lesson <a href="#ana-komplex">Polar form and Euler form</a>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="komplex-addieren" title={<T de="3. Addieren und subtrahieren" en="3. Adding and subtracting" />}>
        <Box kind="uebung" src={<Src u={5} p={7} />} title={<T de="Addieren / Subtrahieren" en={<>Adding / subtracting (<span lang="de">Addieren / Subtrahieren</span>)</>} />}>
          <T de={<p>Gleiches zu Gleichem.</p>} en={<p>Like to like (<span lang="de">Gleiches zu Gleichem</span>).</p>} />
          <MD>{t`(a + bi) \pm (c + di) = (a \pm c) + (b \pm d)\,i`}</MD>
          <MD>{t`z_1 = 3 + i, \qquad z_2 = 1 + 2i`}</MD>
          <MD>{t`z_1 + z_2 = (3 + 1) + (1 + 2)\,i = 4 + 3i, \qquad z_1 - z_2 = (3 - 1) + (1 - 2)\,i = 2 - i`}</MD>
        </Box>
        <T
          de={<p>«Gleiches zu Gleichem» heisst: Realteile zusammen, Imaginärteile zusammen – wie Äpfel und Birnen. In der Ebene ist das genau die Addition von Pfeilen: <M>{t`z_2`}</M> an die Spitze von <M>{t`z_1`}</M> hängen (Knopf <M p="»">{t`z_1 + z_2`}</M> im Bild oben). Subtrahieren heisst <M>{t`-z_2`}</M> addieren; <M>{t`-z_2`}</M> ist der umgedrehte Pfeil (Knopf <M p="»).">{t`z_1 - z_2`}</M></p>}
          en={<p>“Like to like” means: real parts together, imaginary parts together – like apples and pears. In the plane this is exactly the addition of arrows: attach <M>{t`z_2`}</M> to the tip of <M>{t`z_1`}</M> (button <M p="”">{t`z_1 + z_2`}</M> in the figure above). Subtracting means adding <M p=";">{t`-z_2`}</M> <M>{t`-z_2`}</M> is the reversed arrow (button <M p="”).">{t`z_1 - z_2`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="komplex-multiplizieren" title={<T de="4. Multiplizieren" en="4. Multiplying" />}>
        <Box kind="uebung" src={<Src u={5} p={8} />} title={<T de="Multiplizieren" en={<De en="multiplying">Multiplizieren</De>} />}>
          <T de={<p>Ausmultiplizieren. Dann <M>{t`i^2 = -1`}</M> einsetzen.</p>} en={<p>Multiply out. Then substitute <M p=".">{t`i^2 = -1`}</M></p>} />
          <MD>{t`(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i`}</MD>
          <MD>{t`(3 + i)(1 + 2i) = 3 + 6i + i + 2i^2 = 3 + 7i - 2 = 1 + 7i`}</MD>
        </Box>
        <StepPlayer
          label={tr('Animation: Rechteck-Schema mit vier Produkten, i hoch 2 wird minus 1, dann Real- und Imaginärteile zusammen', 'Animation: grid with four products, i squared becomes minus 1, then real and imaginary parts collected')}
          steps={[
            { ms: 1200, holdMs: 3000, caption: <T
              de={<>Ausmultiplizieren: jeder Teil der ersten Klammer mal jeder Teil der zweiten. Das gibt vier Felder.</>}
              en={<>Multiply out: every part of the first bracket times every part of the second. That gives four cells.</>} /> },
            { ms: 1200, holdMs: 3000, caption: <T
              de={<>Unten rechts steht <M p=".">{t`i\cdot i = i^2`}</M> Dort <M>{t`i^2 = -1`}</M> einsetzen: <M>{t`bd\,i^2`}</M> wird <M p=",">{t`-bd`}</M> <M>{t`2i^2`}</M> wird <M p=".">{t`-2`}</M></>}
              en={<>Bottom right there is <M p=".">{t`i\cdot i = i^2`}</M> Substitute <M>{t`i^2 = -1`}</M> there: <M>{t`bd\,i^2`}</M> becomes <M p=",">{t`-bd`}</M> <M>{t`2i^2`}</M> becomes <M p=".">{t`-2`}</M></>} /> },
            { ms: 1200, caption: <T
              de={<>Gleiches zu Gleichem: reelle Felder (blau) zusammen, imaginäre (magenta) zusammen. Ergebnis: <M p=".">{t`1 + 7i`}</M></>}
              en={<>Like to like: real cells (blue) together, imaginary ones (magenta) together. Result: <M p=".">{t`1 + 7i`}</M></>} /> },
          ]}
        >
          {(step, tt) => <MulGrid step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>So liest man die Zeile der Übung:</b> <M>{t`3\cdot 1 = 3`}</M> und <M>{t`3\cdot 2i = 6i`}</M> (erste Zeile des Schemas), <M>{t`i\cdot 1 = i`}</M> und <M>{t`i\cdot 2i = 2i^2`}</M> (zweite Zeile). Dann <M>{t`6i + i = 7i`}</M> und <M p=",">{t`2i^2 = -2`}</M> also <M p=".">{t`3 - 2 + 7i = 1 + 7i`}</M></p>}
          en={<p><b>How to read the line from the class:</b> <M>{t`3\cdot 1 = 3`}</M> and <M>{t`3\cdot 2i = 6i`}</M> (first row of the grid), <M>{t`i\cdot 1 = i`}</M> and <M>{t`i\cdot 2i = 2i^2`}</M> (second row). Then <M>{t`6i + i = 7i`}</M> and <M p=",">{t`2i^2 = -2`}</M> so <M p=".">{t`3 - 2 + 7i = 1 + 7i`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="komplex-konjugiert" title={<T de="5. Die konjugiert komplexe Zahl" en="5. The complex conjugate" />}>
        <Box kind="uebung" src={<Src u={5} p={8} />} title={<T de={<>Komplex konjugierte <M>{t`\bar z`}</M></>} en={<>Complex conjugate <M>{t`\bar z`}</M> (<span lang="de">komplex konjugierte</span>)</>} />}>
          <T de={<p>Vorzeichen vor <M>i</M> wechseln oder Spiegelung an der reellen Achse.</p>} en={<p>Change the sign in front of <M p=",">i</M> or reflect in the real axis.</p>} />
          <MD>{t`z = a + bi \;\Rightarrow\; \bar z = a - bi`}</MD>
          <MD>{t`(a + bi)(a - bi) = a^2 + b^2 \in \mathbb R`}</MD>
        </Box>
        <T
          de={<p><b>So liest man die zweite Zeile:</b> Das ist die dritte binomische Formel <M p=",">{t`(p + q)(p - q) = p^2 - q^2`}</M> mit <M>{t`p = a`}</M> und <M p=".">{t`q = bi`}</M> Also <M p=".">{t`a^2 - b^2 i^2 = a^2 + b^2`}</M> Das <M>i</M> ist verschwunden: <M>{t`z\,\bar z`}</M> ist immer reell und gleich <M p=".">{t`|z|^2`}</M> Bei <M p=":">{t`3 + 4i`}</M> <M p=".">{t`9 + 16 = 25 = 5^2`}</M> Genau diesen Trick braucht man beim Dividieren.</p>}
          en={<p><b>How to read the second line:</b> it is the difference of squares <M p=",">{t`(p + q)(p - q) = p^2 - q^2`}</M> with <M>{t`p = a`}</M> and <M p=".">{t`q = bi`}</M> So <M p=".">{t`a^2 - b^2 i^2 = a^2 + b^2`}</M> The <M>i</M> has disappeared: <M>{t`z\,\bar z`}</M> is always real and equal to <M p=".">{t`|z|^2`}</M> For <M p=":">{t`3 + 4i`}</M> <M p=".">{t`9 + 16 = 25 = 5^2`}</M> Exactly this trick is needed for dividing.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="komplex-dividieren" title={<T de="6. Dividieren" en="6. Dividing" />}>
        <Box kind="uebung" src={<Src u={5} p={8} />} title={<T de="Dividieren" en={<De en="dividing">Dividieren</De>} />}>
          <T de={<p>Mit dem konjugierten Nenner erweitern!</p>} en={<p>Expand with the conjugate of the denominator!</p>} />
          <MD>{t`\frac{a + bi}{c + di} = \frac{(a + bi)(c - di)}{c^2 + d^2}, \qquad c + di \neq 0`}</MD>
          <MD>{t`\frac{a + bi}{c + di} = \frac{ac + bd}{c^2 + d^2} + \frac{bc - ad}{c^2 + d^2}\,i`}</MD>
        </Box>
        <T
          de={<p>Das Problem: Durch <M>{t`1 + 2i`}</M> kann man nicht direkt teilen – man weiss nicht, was «ein Fünftel von <M p="»">i</M> sein soll, wenn <M>i</M> unten steht. Die Lösung: Den Nenner reell machen. Mit <M>{t`z\,\bar z = |z|^2`}</M> aus Abschnitt 5 geht das immer. Die Übung rechnet:</p>}
          en={<p>The problem: you cannot divide by <M>{t`1 + 2i`}</M> directly – an <M>i</M> in the denominator is awkward. The solution: make the denominator real. With <M>{t`z\,\bar z = |z|^2`}</M> from section 5 this always works. The class calculates:</p>}
        />
        <StepPlayer
          label={tr('Animation: Division Schritt für Schritt', 'Animation: division step by step')}
          steps={[
            { ms: 1000, holdMs: 3200, caption: <T
              de={<>Oben und unten mit dem konjugierten Nenner <M>{t`1 - 2i`}</M> multiplizieren. Das ist «mal 1» – der Wert bleibt gleich.</>}
              en={<>Multiply top and bottom by the conjugate of the denominator, <M p=".">{t`1 - 2i`}</M> That is “times 1” – the value stays the same.</>} /> },
            { ms: 1000, holdMs: 3200, caption: <T
              de={<>Ausmultiplizieren. Unten ist es die dritte binomische Formel: <M p=".">{t`(1 + 2i)(1 - 2i) = 1 - 4i^2`}</M></>}
              en={<>Multiply out. The bottom is the difference of squares: <M p=".">{t`(1 + 2i)(1 - 2i) = 1 - 4i^2`}</M></>} /> },
            { ms: 1000, holdMs: 3200, caption: <T
              de={<><M>{t`i^2 = -1`}</M> einsetzen. Unten steht jetzt die reelle Zahl <M p=".">5</M></>}
              en={<>Substitute <M p=".">{t`i^2 = -1`}</M> The bottom is now the real number <M p=".">5</M></>} /> },
            { ms: 1000, caption: <T
              de={<>Durch <M>5</M> teilen: <M p=".">{t`1 - i`}</M> Probe: Mal <M>{t`1 + 2i`}</M> gibt wieder <M p=".">{t`3 + i`}</M></>}
              en={<>Divide by <M p=":">5</M> <M p=".">{t`1 - i`}</M> Check: times <M>{t`1 + 2i`}</M> gives <M>{t`3 + i`}</M> again.</>} /> },
          ]}
        >
          {(step, tt) => <DivSteps step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p>Die allgemeine Formel ist dieselbe Rechnung mit Buchstaben: Unten <M p=",">{t`(c + di)(c - di) = c^2 + d^2`}</M> oben <M>{t`(a + bi)(c - di) = (ac + bd) + (bc - ad)\,i`}</M> (Multiplikationsformel mit <M>{t`-d`}</M> statt <M p=").">d</M> <M>{t`c + di \neq 0`}</M> braucht man, weil sonst <M>{t`c^2 + d^2 = 0`}</M> wäre.</p>}
          en={<p>The general formula is the same calculation with letters: bottom <M p=",">{t`(c + di)(c - di) = c^2 + d^2`}</M> top <M>{t`(a + bi)(c - di) = (ac + bd) + (bc - ad)\,i`}</M> (multiplication formula with <M>{t`-d`}</M> instead of <M p=").">d</M> <M>{t`c + di \neq 0`}</M> is needed because otherwise <M>{t`c^2 + d^2 = 0`}</M> would hold.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="komplex-merke" title={<T de="7. Typische Fehler und das Wichtigste" en="7. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`\mathrm{Im}(3 + 4i) = 4i`}</M>»</>} en={<>“<M>{t`\mathrm{Im}(3 + 4i) = 4i`}</M>”</>} />}>
          <T de={<>Nein, <M p=".">{t`\mathrm{Im}(z) = 4`}</M> Real- und Imaginärteil sind beide reelle Zahlen – die Koordinaten des Punktes.</>} en={<>No, <M p=".">{t`\mathrm{Im}(z) = 4`}</M> The real and imaginary parts are both real numbers – the coordinates of the point.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\sqrt{-1}\cdot\sqrt{-1} = \sqrt{(-1)(-1)} = \sqrt{1} = 1`}</M>»</>} en={<>“<M>{t`\sqrt{-1}\cdot\sqrt{-1} = \sqrt{(-1)(-1)} = \sqrt{1} = 1`}</M>”</>} />}>
          <T de={<>Falsch – richtig ist <M p=".">{t`i\cdot i = -1`}</M> Die Regel <M>{t`\sqrt{p}\sqrt{q} = \sqrt{pq}`}</M> gilt nur für <M p=".">{t`p, q \geq 0`}</M> Darum definiert man <M>i</M> über <M>{t`i^2 = -1`}</M> und liest <M>{t`\sqrt{-1}`}</M> nur als Kurzschrift.</>} en={<>Wrong – correct is <M p=".">{t`i\cdot i = -1`}</M> The rule <M>{t`\sqrt{p}\sqrt{q} = \sqrt{pq}`}</M> holds only for <M p=".">{t`p, q \geq 0`}</M> That is why <M>i</M> is defined by <M>{t`i^2 = -1`}</M> and <M>{t`\sqrt{-1}`}</M> is read as shorthand only.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\frac{3 + i}{1 + 2i} = 3 + \frac{i}{2i}`}</M>»</>} en={<>“<M>{t`\frac{3 + i}{1 + 2i} = 3 + \frac{i}{2i}`}</M>”</>} />}>
          <T de={<>Teile darf man nicht einzeln teilen – auch bei reellen Zahlen ist <M p=".">{t`\frac{3 + 1}{1 + 1} \neq 3 + 1`}</M> Immer mit dem konjugierten Nenner erweitern und am Schluss mit der Probe kontrollieren.</>} en={<>You may not divide the parts separately – even for real numbers <M p=".">{t`\frac{3 + 1}{1 + 1} \neq 3 + 1`}</M> Always expand with the conjugate denominator and check at the end by multiplying back.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\bar z`}</M> spiegelt an der imaginären Achse.»</>} en={<>“<M>{t`\bar z`}</M> reflects in the imaginary axis.”</>} />}>
          <T de={<>Nein, an der reellen Achse: Der Realteil bleibt, nur das Vorzeichen des Imaginärteils wechselt (oben ↔ unten).</>} en={<>No, in the real axis: the real part stays, only the sign of the imaginary part changes (up ↔ down).</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=",">{t`i^2 = -1`}</M> <M p=";">{t`z = a + bi`}</M> <M>{t`\mathrm{Re}(z) = a`}</M> und <M>{t`\mathrm{Im}(z) = b`}</M> sind reell.</li>
              <li>Addieren: Gleiches zu Gleichem (Pfeile aneinanderhängen).</li>
              <li>Multiplizieren: ausmultiplizieren, <M>{t`i^2 = -1`}</M> einsetzen.</li>
              <li><M p=";">{t`\bar z = a - bi`}</M> <M>{t`z\,\bar z = a^2 + b^2`}</M> ist reell.</li>
              <li>Dividieren: mit dem konjugierten Nenner erweitern.</li>
            </ul>}
            en={<ul>
              <li><M p=";">{t`i^2 = -1`}</M> <M p=";">{t`z = a + bi`}</M> <M>{t`\mathrm{Re}(z) = a`}</M> and <M>{t`\mathrm{Im}(z) = b`}</M> are real.</li>
              <li>Adding: like to like (arrows head to tail).</li>
              <li>Multiplying: multiply out, substitute <M p=".">{t`i^2 = -1`}</M></li>
              <li><M p=";">{t`\bar z = a - bi`}</M> <M>{t`z\,\bar z = a^2 + b^2`}</M> is real.</li>
              <li>Dividing: expand with the conjugate of the denominator.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
