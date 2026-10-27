import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { AngleExplorer, IPowers, MulAnimFig, MulExplorer } from '../viz/ana/W6Figures';

const t = String.raw;

export default function A6Polarform() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In <a href="#ana-komplex-rechnen">Komplexe Zahlen: Rechnen</a> stand ein Punkt als «<M>a</M> nach rechts, <M>b</M> nach oben». Hier beschreiben wir denselben Punkt mit <b>Länge und Winkel</b>. Der Gewinn: Multiplizieren wird ein Bild – Längen multiplizieren, Winkel addieren.</p>}
        en={<p className="lede">In <a href="#ana-komplex-rechnen">Complex numbers: arithmetic</a> a point was “<M>a</M> to the right, <M>b</M> up”. Here we describe the same point by <b>length and angle</b>. The pay-off: multiplying becomes a picture – lengths multiply, angles add.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="neu-s1-4" title={<T de="1. Neu auf S. 1–4 (der Rest ist Woche 5)" en="1. New on pp. 1–4 (the rest is week 5)" />}>
        <T
          de={<p className="keep">Die Seiten 1–4 wiederholen <a href="#ana-komplex-rechnen">Woche 5</a>: <M p=",">{t`i^2 = -1`}</M> <M p=",">{t`z = a + bi`}</M> Addieren, Ausmultiplizieren und Dividieren (dort mit dem Beispiel <M p=").">{t`\tfrac{3 + i}{1 + 2i} = 1 - i`}</M> Neu sind nur drei kleine Dinge.</p>}
          en={<p className="keep">Pages 1–4 repeat <a href="#ana-komplex-rechnen">week 5</a>: <M p=",">{t`i^2 = -1`}</M> <M p=",">{t`z = a + bi`}</M> adding, multiplying out and dividing (there with the example <M p=").">{t`\tfrac{3 + i}{1 + 2i} = 1 - i`}</M> Only three small things are new.</p>}
        />
        <Box kind="uebung" src={<Src u={6} p={2} />} title={<T de={<>Potenzen von <M>i</M></>} en={<>Powers of <M>i</M> (<span lang="de">Potenzen von i</span>)</>} />}>
          <T de={<p>Nach vier Schritten beginnt alles wieder von vorne.</p>} en={<p>After four steps everything starts over again.</p>} />
          <MD>{t`i^0 = 1,\quad i^1 = i,\quad i^2 = -1,\quad i^3 = -i,\quad i^4 = 1`}</MD>
          <MD>{t`i^{27} = i^{4\cdot 6 + 3} = (i^4)^6\, i^3 = -i`}</MD>
          <T de={<p>Tipp: Den Exponenten durch <M>4</M> teilen. Nur der Rest zählt.</p>} en={<p>Tip: divide the exponent by <M p=".">4</M> Only the remainder counts.</p>} />
        </Box>
        <T
          de={<p className="keep"><b>Warum?</b> <M>{t`i^3 = i^2\cdot i = -i`}</M> und <M p=".">{t`i^4 = i^2\cdot i^2 = (-1)(-1) = 1`}</M> Jedes Viererpaket <M>{t`i^4`}</M> ist also einfach <M>1</M> und fällt weg. Im Bild: Jeder Faktor <M>i</M> ist eine Vierteldrehung um den Nullpunkt (warum, zeigt Abschnitt 5).</p>}
          en={<p className="keep"><b>Why?</b> <M>{t`i^3 = i^2\cdot i = -i`}</M> and <M p=".">{t`i^4 = i^2\cdot i^2 = (-1)(-1) = 1`}</M> So every package of four, <M p=",">{t`i^4`}</M> is just <M>1</M> and drops out. In the picture: every factor <M>i</M> is a quarter turn about the origin (why, see section 5).</p>}
        />
        <IPowers />
        <Box kind="uebung" src={<Src u={6} p={3} />} title={<T de={<>Komplex konjugierte <M>{t`\bar z`}</M> und Betrag</>} en={<>Conjugate <M>{t`\bar z`}</M> and modulus (<span lang="de">Betrag</span>)</>} />}>
          <MD>{t`|z| = \sqrt{a^2 + b^2}, \qquad |3 + 2i| = \sqrt{13}`}</MD>
          <MD>{t`z\bar z = (a + bi)(a - bi) = a^2 + b^2 = |z|^2`}</MD>
          <MD>{t`\bar{\bar z} = z, \qquad \overline{z_1 z_2} = \bar z_1\, \bar z_2`}</MD>
          <T de={<p>Wichtig: <M>{t`|z|`}</M> ist eine nichtnegative reelle Zahl.</p>} en={<p>Important: <M>{t`|z|`}</M> is a non-negative real number.</p>} />
        </Box>
        <T
          de={<ul>
            <li><M>{t`|z|`}</M> ist die Länge des Pfeils vom Nullpunkt zu <M>z</M> (Pythagoras): <M p=".">{t`|3 + 2i| = \sqrt{9 + 4} = \sqrt{13}`}</M> Darum ist <M>{t`|z|`}</M> nie negativ und nie imaginär.</li>
            <li><M p=":">{t`\bar{\bar z} = z`}</M> Zweimal an der reellen Achse spiegeln bringt den Punkt zurück.</li>
            <li><M p=":">{t`\overline{z_1 z_2} = \bar z_1\,\bar z_2`}</M> Man darf erst multiplizieren und dann konjugieren, oder umgekehrt. Nachrechnen: In <M>{t`(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i`}</M> wechselt nur das Vorzeichen vor dem Imaginärteil, wenn man <M>b</M> und <M>d</M> durch <M>{t`-b`}</M> und <M>{t`-d`}</M> ersetzt.</li>
          </ul>}
          en={<ul>
            <li><M>{t`|z|`}</M> is the length of the arrow from the origin to <M>z</M> (Pythagoras): <M p=".">{t`|3 + 2i| = \sqrt{9 + 4} = \sqrt{13}`}</M> That is why <M>{t`|z|`}</M> is never negative and never imaginary.</li>
            <li><M p=":">{t`\bar{\bar z} = z`}</M> reflecting twice in the real axis brings the point back.</li>
            <li><M p=":">{t`\overline{z_1 z_2} = \bar z_1\,\bar z_2`}</M> you may multiply first and then conjugate, or the other way round. Check: in <M>{t`(a + bi)(c + di) = (ac - bd) + (ad + bc)\,i`}</M> only the sign of the imaginary part changes when <M>b</M> and <M>d</M> are replaced by <M>{t`-b`}</M> and <M p=".">{t`-d`}</M></li>
          </ul>}
        />
        <Box kind="uebung" src={<Src u={6} p={4} />} title={<T de="Dividieren" en={<De en="dividing">Dividieren</De>} />}>
          <T de={<p>Wir wollen das <M>i</M> aus dem Nenner entfernen. Dazu erweitern wir mit dem konjugierten Nenner.</p>} en={<p>We want to remove the <M>i</M> from the denominator. To do so we expand with the conjugate denominator.</p>} />
          <MD>{t`\frac{z_1}{z_2} = \frac{z_1 \bar z_2}{|z_2|^2}, \qquad z_2 \neq 0`}</MD>
        </Box>
        <T
          de={<p>Das ist die Formel aus Woche 5 in Kurzform: Unten steht <M p=",">{t`z_2\bar z_2 = |z_2|^2`}</M> und das ist reell. Das Beispiel <M>{t`\tfrac{3 + i}{1 + 2i} = 1 - i`}</M> ist dort Schritt für Schritt animiert.</p>}
          en={<p>This is the week-5 formula in short form: the bottom is <M p=",">{t`z_2\bar z_2 = |z_2|^2`}</M> and that is real. The example <M>{t`\tfrac{3 + i}{1 + 2i} = 1 - i`}</M> is animated step by step there.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="polarform" title={<T de="2. Polarform: Länge und Winkel" en="2. Polar form: length and angle" />}>
        <Box kind="uebung" src={<Src u={6} p={5} />} title={<T de="Polarform" en={<De en="polar form">Polarform</De>} />}>
          <T de={<p>Statt rechts/oben beschreiben wir einen Punkt mit Länge und Winkel.</p>} en={<p>Instead of right/up we describe a point by length and angle.</p>} />
          <MD>{t`z = a + bi = r(\cos\varphi + i\sin\varphi)`}</MD>
          <MD>{t`r = |z| = \sqrt{a^2 + b^2}, \qquad a = r\cos\varphi, \quad b = r\sin\varphi`}</MD>
          <MD>{t`z = \sqrt3 + i: \quad r = \sqrt{3 + 1} = 2, \quad \varphi = \tfrac{\pi}{6}, \qquad \sqrt3 + i = 2\left(\cos\tfrac{\pi}{6} + i\sin\tfrac{\pi}{6}\right)`}</MD>
          <T de={<p>Den Winkel ab der positiven reellen Achse gegen den Uhrzeigersinn messen. Bei <M>{t`z = 0`}</M> ist <M p=".">{t`r = 0`}</M> Der Winkel ist dort nicht festgelegt.</p>}
            en={<p>Measure the angle from the positive real axis, counter-clockwise. At <M>{t`z = 0`}</M> we have <M p=".">{t`r = 0`}</M> The angle is not defined there.</p>} />
          <T de={<p>Bild: <M>{t`z = \sqrt3 + i`}</M> als blauer Pfeil mit <M p=",">{t`r = 2`}</M> der Winkel <M>{t`\varphi = \pi/6`}</M> magenta an der reellen Achse.</p>}
            en={<p>Picture: <M>{t`z = \sqrt3 + i`}</M> as a blue arrow with <M p=",">{t`r = 2`}</M> the angle <M>{t`\varphi = \pi/6`}</M> in magenta at the real axis.</p>} />
        </Box>
        <T
          de={<p className="keep">Stell dir einen Uhrzeiger vor, der im Nullpunkt befestigt ist. Um seine Spitze zu beschreiben, sagst du: «so lang, und so weit gedreht». Genau das sind <M>r</M> und <M p=".">\varphi</M></p>}
          en={<p className="keep">Picture a clock hand pinned at the origin. To describe its tip you say: “this long, and turned this far”. That is exactly <M>r</M> and <M p=".">\varphi</M></p>}
        />
        <ul className="keep">
          <T
            de={<>
              <li><M>r</M> <M>=</M> Länge des Pfeils <M>=</M> Betrag <M p=".">{t`|z|`}</M></li>
              <li><M>\varphi</M> (phi) <M>=</M> Winkel von der positiven reellen Achse aus, gegen den Uhrzeigersinn, im Bogenmass.</li>
              <li><M>{t`a = r\cos\varphi`}</M> und <M>{t`b = r\sin\varphi`}</M> sind die Schatten des Pfeils auf den Achsen – die Definition von Kosinus und Sinus im rechtwinkligen Dreieck mit Hypotenuse <M p=".">r</M></li>
            </>}
            en={<>
              <li><M>r</M> <M>=</M> length of the arrow <M>=</M> modulus <M p=".">{t`|z|`}</M></li>
              <li><M>\varphi</M> (phi) <M>=</M> angle from the positive real axis, counter-clockwise, in radians.</li>
              <li><M>{t`a = r\cos\varphi`}</M> and <M>{t`b = r\sin\varphi`}</M> are the shadows of the arrow on the axes – the definition of cosine and sine in the right triangle with hypotenuse <M p=".">r</M></li>
            </>}
          />
        </ul>
        <T
          de={<p className="keep"><b>So liest man das Beispiel:</b> <M p=",">{t`a = \sqrt3`}</M> <M p=",">{t`b = 1`}</M> also <M p=".">{t`r = \sqrt{3 + 1} = 2`}</M> Dann <M>{t`\cos\varphi = \tfrac{\sqrt3}{2}`}</M> und <M p=":">{t`\sin\varphi = \tfrac12`}</M> Das ist der Winkel <M>{t`\tfrac{\pi}{6}`}</M> (30°) aus der Tabelle unten. Einsetzen in <M>{t`r(\cos\varphi + i\sin\varphi)`}</M> gibt die Polarform.</p>}
          en={<p className="keep"><b>How to read the example:</b> <M p=",">{t`a = \sqrt3`}</M> <M p=",">{t`b = 1`}</M> so <M p=".">{t`r = \sqrt{3 + 1} = 2`}</M> Then <M>{t`\cos\varphi = \tfrac{\sqrt3}{2}`}</M> and <M p=":">{t`\sin\varphi = \tfrac12`}</M> that is the angle <M>{t`\tfrac{\pi}{6}`}</M> (30°) from the table below. Substituting into <M>{t`r(\cos\varphi + i\sin\varphi)`}</M> gives the polar form.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="winkel-finden" title={<T de="3. Den richtigen Winkel finden" en="3. Finding the right angle" />}>
        <Box kind="uebung" src={<Src u={6} p={6} />} title={<T de="Den richtigen Winkel finden" en={<>Finding the right angle (<span lang="de">Den richtigen Winkel finden</span>)</>} />}>
          <T de={<p>Zuerst den Punkt grob einzeichnen. Dann den passenden Winkel bestimmen.</p>} en={<p>First sketch the point roughly. Then determine the matching angle.</p>} />
          <MD>{t`\cos\varphi = \frac{a}{r}, \qquad \sin\varphi = \frac{b}{r} \qquad (r > 0)`}</MD>
          <div className="w6-table">
            <table className="w6-trig">
              <thead><tr><th><M>\varphi</M></th><th><M>0</M></th><th><M>{t`\pi/6`}</M></th><th><M>{t`\pi/4`}</M></th><th><M>{t`\pi/3`}</M></th><th><M>{t`\pi/2`}</M></th></tr></thead>
              <tbody>
                <tr><th><M>{t`\cos\varphi`}</M></th><td><M>1</M></td><td><M>{t`\sqrt3/2`}</M></td><td><M>{t`\sqrt2/2`}</M></td><td><M>{t`1/2`}</M></td><td><M>0</M></td></tr>
                <tr><th><M>{t`\sin\varphi`}</M></th><td><M>0</M></td><td><M>{t`1/2`}</M></td><td><M>{t`\sqrt2/2`}</M></td><td><M>{t`\sqrt3/2`}</M></td><td><M>1</M></td></tr>
              </tbody>
            </table>
          </div>
          <T de={<p><b>Bsp. Linke obere Ecke</b></p>} en={<p><b>Example: upper left corner</b></p>} />
          <MD>{t`z = -\sqrt3 + i, \quad r = 2: \qquad \cos\varphi = -\frac{\sqrt3}{2}, \quad \sin\varphi = \frac12 \;\Rightarrow\; \varphi = \frac{5\pi}{6}`}</MD>
          <T de={<p><M>{t`\arctan(b/a)`}</M> allein reicht nicht: Der Wert kann in der falschen Hälfte liegen.</p>} en={<p><M>{t`\arctan(b/a)`}</M> alone is not enough: the value can lie in the wrong half.</p>} />
          <T de={<p><b>Eine ganze Drehung ändert den Punkt nicht</b></p>} en={<p><b>A full turn does not change the point</b></p>} />
          <MD>{t`\varphi \quad\text{${tr('und', 'and')}}\quad \varphi + 2\pi k, \qquad k \in \mathbb Z`}</MD>
          <T de={<p>Für unsere Beispiele wählen wir einen Winkel <M p=".">{t`0 \leq \varphi < 2\pi`}</M></p>} en={<p>For our examples we choose an angle <M p=".">{t`0 \leq \varphi < 2\pi`}</M></p>} />
          <MD>{t`1\!: 0 \qquad i\!: \frac{\pi}{2} \qquad -1\!: \pi \qquad -i\!: \frac{3\pi}{2}`}</MD>
          <T de={<p>Im Bogenmass rechnen: Eine volle Drehung entspricht <M p=".">{t`2\pi`}</M></p>} en={<p>Work in radians: a full turn corresponds to <M p=".">{t`2\pi`}</M></p>} />
        </Box>
        <T
          de={<p>Die Tabelle ist Gymnasiumstoff – man muss sie nur ablesen können. Die eigentliche Arbeit ist: <b>In welcher Ecke liegt der Punkt?</b> Bei <M>{t`-\sqrt3 + i`}</M> ist <M>a</M> negativ und <M>b</M> positiv: links oben. Die Beträge <M>{t`\tfrac{\sqrt3}{2}`}</M> und <M>{t`\tfrac12`}</M> gehören zu <M>{t`\tfrac{\pi}{6}`}</M> – aber gemessen von der <i>negativen</i> reellen Achse aus. Von der positiven Achse aus also <M p=".">{t`\pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}`}</M></p>}
          en={<p>The table is high-school material – you only need to be able to read it. The real work is: <b>which corner is the point in?</b> For <M>{t`-\sqrt3 + i`}</M> <M>a</M> is negative and <M>b</M> positive: upper left. The magnitudes <M>{t`\tfrac{\sqrt3}{2}`}</M> and <M>{t`\tfrac12`}</M> belong to <M>{t`\tfrac{\pi}{6}`}</M> – but measured from the <i>negative</i> real axis. From the positive axis it is therefore <M p=".">{t`\pi - \tfrac{\pi}{6} = \tfrac{5\pi}{6}`}</M></p>}
        />
        <T
          de={<p className="keep"><b>Warum reicht <M>{t`\arctan(b/a)`}</M> nicht?</b> Der Quotient <M>{t`b/a`}</M> vergisst die Vorzeichen: <M>{t`-\sqrt3 + i`}</M> und <M>{t`\sqrt3 - i`}</M> haben dasselbe <M p=".">{t`b/a = -\tfrac{1}{\sqrt3}`}</M> Der Taschenrechner kennt nur Winkel zwischen <M>{t`-\tfrac{\pi}{2}`}</M> und <M>{t`\tfrac{\pi}{2}`}</M> (rechte Halbebene) und gibt <M p=".">{t`-\tfrac{\pi}{6}`}</M> Im Bild unten siehst du: Links zeigt dieser Strahl genau in die Gegenrichtung. Dann muss man <M>\pi</M> addieren.</p>}
          en={<p className="keep"><b>Why is <M>{t`\arctan(b/a)`}</M> not enough?</b> The quotient <M>{t`b/a`}</M> forgets the signs: <M>{t`-\sqrt3 + i`}</M> and <M>{t`\sqrt3 - i`}</M> have the same <M p=".">{t`b/a = -\tfrac{1}{\sqrt3}`}</M> The calculator only knows angles between <M>{t`-\tfrac{\pi}{2}`}</M> and <M>{t`\tfrac{\pi}{2}`}</M> (right half-plane) and returns <M p=".">{t`-\tfrac{\pi}{6}`}</M> In the figure below you see: on the left this ray points exactly the opposite way. Then you must add <M p=".">\pi</M></p>}
        />
        <AngleExplorer />
        <T
          de={<p className="keep"><b>Warum <M p="?">{t`\varphi + 2\pi k`}</M></b> Eine ganze Drehung (<M p=",">{t`2\pi`}</M> also 360°) bringt den Uhrzeiger an dieselbe Stelle. <M>{t`\tfrac{\pi}{6}`}</M> und <M>{t`\tfrac{\pi}{6} + 2\pi = \tfrac{13\pi}{6}`}</M> sind also derselbe Punkt. Damit die Antwort eindeutig ist, wählt die Übung <M p=".">{t`0 \leq \varphi < 2\pi`}</M></p>}
          en={<p className="keep"><b>Why <M p="?">{t`\varphi + 2\pi k`}</M></b> A full turn (<M p=",">{t`2\pi`}</M> i.e. 360°) brings the clock hand to the same place. So <M>{t`\tfrac{\pi}{6}`}</M> and <M>{t`\tfrac{\pi}{6} + 2\pi = \tfrac{13\pi}{6}`}</M> are the same point. To make the answer unique, the class chooses <M p=".">{t`0 \leq \varphi < 2\pi`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="eulerform" title={<T de="4. Eulerform" en="4. Euler form" />}>
        <Box kind="uebung" src={<Src u={6} p={7} />} title={<T de="Eulerform" en={<De en="Euler form">Eulerform</De>} />}>
          <T de={<p>Die Eulerform schreibt dieselbe Zahl kürzer.</p>} en={<p>The Euler form writes the same number more briefly.</p>} />
          <MD>{t`e^{i\varphi} = \cos\varphi + i\sin\varphi, \qquad z = re^{i\varphi}`}</MD>
        </Box>
        <T
          de={<p className="keep"><M>{t`e^{i\varphi}`}</M> ist zunächst nur eine Abkürzung für <M p=":">{t`\cos\varphi + i\sin\varphi`}</M> der Punkt auf dem <b>Einheitskreis</b> (Radius 1) beim Winkel <M p=".">\varphi</M> Mal <M>r</M> gestreckt gibt <M p=".">z</M> Zum Beispiel <M p=".">{t`\sqrt3 + i = 2e^{i\pi/6}`}</M> Warum ausgerechnet «<M>e</M> hoch», zeigt der nächste Abschnitt.</p>}
          en={<p className="keep"><M>{t`e^{i\varphi}`}</M> is at first just shorthand for <M p=":">{t`\cos\varphi + i\sin\varphi`}</M> the point on the <b>unit circle</b> (radius 1) at angle <M p=".">\varphi</M> Stretched by <M>r</M> it gives <M p=".">z</M> For example <M p=".">{t`\sqrt3 + i = 2e^{i\pi/6}`}</M> Why it is “<M>e</M> to the power”, of all things, is shown in the next section.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="polar-rechnen" title={<T de="5. Multiplizieren und Dividieren: drehen und strecken" en="5. Multiplying and dividing: turn and stretch" />}>
        <Box kind="uebung" src={<Src u={6} p={7} />} title={<T de="Rechenregeln" en={<>Rules (<span lang="de">Rechenregeln</span>)</>} />}>
          <T de={<p><b>Multiplizieren:</b> Längen multiplizieren, Winkel addieren.</p>} en={<p><b>Multiplying:</b> lengths multiply, angles add.</p>} />
          <MD>{t`(r_1 e^{i\varphi_1})(r_2 e^{i\varphi_2}) = r_1 r_2\, e^{i(\varphi_1 + \varphi_2)}, \qquad (2e^{i\pi/6})(3e^{i\pi/3}) = 6e^{i\pi/2} = 6i`}</MD>
          <T de={<p><b>Dividieren:</b> Längen teilen, Winkel abziehen.</p>} en={<p><b>Dividing:</b> lengths divide, angles subtract.</p>} />
          <MD>{t`\frac{r_1 e^{i\varphi_1}}{r_2 e^{i\varphi_2}} = \frac{r_1}{r_2}\, e^{i(\varphi_1 - \varphi_2)}, \quad r_2 > 0, \qquad \frac{6e^{i\pi/2}}{2e^{i\pi/6}} = 3e^{i\pi/3}`}</MD>
          <T de={<p><b>Konjugieren:</b> <M p=".">{t`\bar z = re^{-i\varphi}`}</M> Addieren bleibt in der Form <M>{t`a + bi`}</M> meistens einfacher.</p>}
            en={<p><b>Conjugating:</b> <M p=".">{t`\bar z = re^{-i\varphi}`}</M> Adding is usually easier in the form <M p=".">{t`a + bi`}</M></p>} />
        </Box>
        <T
          de={<p className="keep">Mal <M>{t`r_2 e^{i\varphi_2}`}</M> heisst im Bild zwei Dinge: <b>strecken</b> mit <M>{t`r_2`}</M> und <b>drehen</b> um <M p=".">{t`\varphi_2`}</M> Die Animation macht das mit dem Beispiel der Übung.</p>}
          en={<p className="keep">Times <M>{t`r_2 e^{i\varphi_2}`}</M> means two things in the picture: <b>stretch</b> by <M>{t`r_2`}</M> and <b>turn</b> by <M p=".">{t`\varphi_2`}</M> The animation does this with the class example.</p>}
        />
        <StepPlayer
          label={tr('Animation: 2e^{iπ/6} mal 3e^{iπ/3} – erst strecken, dann drehen', 'Animation: 2e^{iπ/6} times 3e^{iπ/3} – first stretch, then turn')}
          steps={[
            { ms: 1100, holdMs: 2800, caption: <T
              de={<>Start: <M>{t`z_1 = 2e^{i\pi/6}`}</M> ist ein Pfeil der Länge <M>2</M> unter dem Winkel <M p=".">{t`\tfrac{\pi}{6}`}</M></>}
              en={<>Start: <M>{t`z_1 = 2e^{i\pi/6}`}</M> is an arrow of length <M>2</M> at the angle <M p=".">{t`\tfrac{\pi}{6}`}</M></>} /> },
            { ms: 1400, holdMs: 2800, caption: <T
              de={<>Mal <M>{t`z_2 = 3e^{i\pi/3}`}</M> (magenta). Zuerst die Länge: <M>2</M> wird <M p=".">{t`2\cdot 3 = 6`}</M> Der Winkel bleibt noch.</>}
              en={<>Times <M>{t`z_2 = 3e^{i\pi/3}`}</M> (magenta). First the length: <M>2</M> becomes <M p=".">{t`2\cdot 3 = 6`}</M> The angle stays for now.</>} /> },
            { ms: 1600, caption: <T
              de={<>Dann drehen um <M p=":">{t`\tfrac{\pi}{3}`}</M> <M p=".">{t`\tfrac{\pi}{6} + \tfrac{\pi}{3} = \tfrac{\pi}{2}`}</M> Ergebnis: <M p=".">{t`6e^{i\pi/2} = 6i`}</M></>}
              en={<>Then turn by <M p=":">{t`\tfrac{\pi}{3}`}</M> <M p=".">{t`\tfrac{\pi}{6} + \tfrac{\pi}{3} = \tfrac{\pi}{2}`}</M> Result: <M p=".">{t`6e^{i\pi/2} = 6i`}</M></>} /> },
          ]}
        >
          {(step, tt) => <MulAnimFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>So liest man die Zeile:</b> <M p=".">{t`r_1 r_2 = 2\cdot 3 = 6`}</M> <M p=".">{t`\varphi_1 + \varphi_2 = \tfrac{\pi}{6} + \tfrac{2\pi}{6} = \tfrac{3\pi}{6} = \tfrac{\pi}{2}`}</M> Und <M>{t`e^{i\pi/2} = \cos\tfrac{\pi}{2} + i\sin\tfrac{\pi}{2} = 0 + i = i`}</M> – darum <M p=".">{t`6e^{i\pi/2} = 6i`}</M> Die Division ist die Rechnung rückwärts: <M p=",">{t`6 : 2 = 3`}</M> <M p=".">{t`\tfrac{\pi}{2} - \tfrac{\pi}{6} = \tfrac{\pi}{3}`}</M></p>}
          en={<p><b>How to read the line:</b> <M p=".">{t`r_1 r_2 = 2\cdot 3 = 6`}</M> <M p=".">{t`\varphi_1 + \varphi_2 = \tfrac{\pi}{6} + \tfrac{2\pi}{6} = \tfrac{3\pi}{6} = \tfrac{\pi}{2}`}</M> And <M>{t`e^{i\pi/2} = \cos\tfrac{\pi}{2} + i\sin\tfrac{\pi}{2} = 0 + i = i`}</M> – hence <M p=".">{t`6e^{i\pi/2} = 6i`}</M> Division is the calculation backwards: <M p=",">{t`6 : 2 = 3`}</M> <M p=".">{t`\tfrac{\pi}{2} - \tfrac{\pi}{6} = \tfrac{\pi}{3}`}</M></p>}
        />
        <T
          de={<p>Jetzt selbst ausprobieren: Ziehe <M>{t`z_1`}</M> und <M p=".">{t`z_2`}</M> Der blaue Bogen ist <M p=",">{t`\varphi_1`}</M> der magenta Bogen <M>{t`\varphi_2`}</M> wird daran angehängt, der violette Bogen ist die Summe – der Winkel des Produkts. Mit <M>i</M> (Länge 1, Winkel <M p=")">{t`\tfrac{\pi}{2}`}</M> multiplizieren heisst: nur eine Vierteldrehung. Das erklärt den Kreis der Potenzen von <M>i</M> aus Abschnitt 1. Mit <M>{t`-1`}</M> (Winkel <M p=")">\pi</M> ist es eine halbe Drehung. Mit <M>{t`r_2 < 1`}</M> wird der Pfeil kürzer.</p>}
          en={<p>Now try it yourself: drag <M>{t`z_1`}</M> and <M p=".">{t`z_2`}</M> The blue arc is <M p=",">{t`\varphi_1`}</M> the magenta arc <M>{t`\varphi_2`}</M> is attached to it, the purple arc is the sum – the angle of the product. Multiplying by <M>i</M> (length 1, angle <M p=")">{t`\tfrac{\pi}{2}`}</M> means: just a quarter turn. That explains the circle of the powers of <M>i</M> from section 1. With <M>{t`-1`}</M> (angle <M p=")">\pi</M> it is a half turn. With <M>{t`r_2 < 1`}</M> the arrow gets shorter.</p>}
        />
        <MulExplorer />
        <T
          de={<p><b>Konjugieren:</b> <M>{t`\bar z = a - bi`}</M> ist das Spiegelbild an der reellen Achse: gleiche Länge, Winkel <M>{t`-\varphi`}</M> statt <M p=".">\varphi</M> Also <M p=".">{t`\bar z = re^{-i\varphi}`}</M> <b>Addieren</b> dagegen hat keine einfache Regel für Längen und Winkel (zwei Pfeile aneinanderhängen ändert beides kompliziert) – dafür nimmt man <M p=".">{t`a + bi`}</M></p>}
          en={<p><b>Conjugating:</b> <M>{t`\bar z = a - bi`}</M> is the mirror image in the real axis: same length, angle <M>{t`-\varphi`}</M> instead of <M p=".">\varphi</M> So <M p=".">{t`\bar z = re^{-i\varphi}`}</M> <b>Adding</b>, on the other hand, has no simple rule for lengths and angles (putting two arrows head to tail changes both in a complicated way) – for that you use <M p=".">{t`a + bi`}</M></p>}
        />
        <Box keep kind="supplement" title={<T de={<>Warum addieren sich die Winkel – und warum <M p="?">{t`e^{i\varphi}`}</M></>} en={<>Why do the angles add – and why <M p="?">{t`e^{i\varphi}`}</M></>} />}>
          <T
            de={<>
              <p>Ausmultiplizieren mit <M p=":">{t`i^2 = -1`}</M></p>
              <MD>{t`(\cos\alpha + i\sin\alpha)(\cos\beta + i\sin\beta) = (\cos\alpha\cos\beta - \sin\alpha\sin\beta) + i\,(\sin\alpha\cos\beta + \cos\alpha\sin\beta)`}</MD>
              <p>Die beiden Klammern sind genau die Additionstheoreme aus dem Gymnasium: <M>{t`\cos(\alpha + \beta)`}</M> und <M p=".">{t`\sin(\alpha + \beta)`}</M> Also <M p=".">{t`e^{i\alpha}\, e^{i\beta} = e^{i(\alpha + \beta)}`}</M> Die Längen <M>{t`r_1, r_2`}</M> sind nur reelle Faktoren und multiplizieren sich einfach.</p>
              <p>Und der Name: Für reelle Zahlen gilt <M p=".">{t`e^a\, e^b = e^{a + b}`}</M> Beim Multiplizieren addieren sich die Exponenten – genau wie hier die Winkel. Darum ist «<M>{t`e^{i\varphi}`}</M>» eine passende Schreibweise: Mit ihr rechnet man wie mit gewöhnlichen Potenzen. (Dass es wirklich dieselbe Exponentialfunktion ist, zeigt man später mit Reihen.)</p>
            </>}
            en={<>
              <p>Multiply out with <M p=":">{t`i^2 = -1`}</M></p>
              <MD>{t`(\cos\alpha + i\sin\alpha)(\cos\beta + i\sin\beta) = (\cos\alpha\cos\beta - \sin\alpha\sin\beta) + i\,(\sin\alpha\cos\beta + \cos\alpha\sin\beta)`}</MD>
              <p>The two brackets are exactly the addition theorems from school: <M>{t`\cos(\alpha + \beta)`}</M> and <M p=".">{t`\sin(\alpha + \beta)`}</M> So <M p=".">{t`e^{i\alpha}\, e^{i\beta} = e^{i(\alpha + \beta)}`}</M> The lengths <M>{t`r_1, r_2`}</M> are just real factors and simply multiply.</p>
              <p>And the name: for real numbers <M p=".">{t`e^a\, e^b = e^{a + b}`}</M> When multiplying, the exponents add – exactly like the angles here. That is why “<M>{t`e^{i\varphi}`}</M>” is a fitting notation: you calculate with it as with ordinary powers. (That it really is the same exponential function is shown later with series.)</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="polar-merke" title={<T de="6. Typische Fehler und das Wichtigste" en="6. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M p=",">{t`\varphi = \arctan(b/a)`}</M> fertig.»</>} en={<>“<M p=",">{t`\varphi = \arctan(b/a)`}</M> done.”</>} />}>
          <T de={<>Nur in der rechten Halbebene (<M p=").">{t`a > 0`}</M> Für <M>{t`-\sqrt3 + i`}</M> liefert es <M>{t`-\tfrac{\pi}{6}`}</M> statt <M p=".">{t`\tfrac{5\pi}{6}`}</M> Immer zuerst den Punkt grob einzeichnen.</>}
            en={<>Only in the right half-plane (<M p=").">{t`a > 0`}</M> For <M>{t`-\sqrt3 + i`}</M> it gives <M>{t`-\tfrac{\pi}{6}`}</M> instead of <M p=".">{t`\tfrac{5\pi}{6}`}</M> Always sketch the point roughly first.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`(2e^{i\pi/6})(3e^{i\pi/3}) = 6e^{i\pi^2/18}`}</M>»</>} en={<>“<M>{t`(2e^{i\pi/6})(3e^{i\pi/3}) = 6e^{i\pi^2/18}`}</M>”</>} />}>
          <T de={<>Längen multiplizieren, aber Winkel <b>addieren</b>: <M p=".">{t`\tfrac{\pi}{6} + \tfrac{\pi}{3} = \tfrac{\pi}{2}`}</M> Genau wie <M p=".">{t`e^a e^b = e^{a + b}`}</M></>}
            en={<>Lengths multiply, but angles <b>add</b>: <M p=".">{t`\tfrac{\pi}{6} + \tfrac{\pi}{3} = \tfrac{\pi}{2}`}</M> Just like <M p=".">{t`e^a e^b = e^{a + b}`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`|3 + 2i| = 3 + 2 = 5`}</M>»</>} en={<>“<M>{t`|3 + 2i| = 3 + 2 = 5`}</M>”</>} />}>
          <T de={<>Der Betrag ist die Länge der Diagonale, nicht die Summe der Seiten: <M p=".">{t`\sqrt{3^2 + 2^2} = \sqrt{13} \approx 3{,}61`}</M></>}
            en={<>The modulus is the length of the diagonal, not the sum of the sides: <M p=".">{t`\sqrt{3^2 + 2^2} = \sqrt{13} \approx 3.61`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`e^{i\cdot 30}`}</M> ist der Winkel 30°.»</>} en={<>“<M>{t`e^{i\cdot 30}`}</M> is the angle 30°.”</>} />}>
          <T de={<>Im Exponenten steht der Winkel im Bogenmass: 30° ist <M p=".">{t`\tfrac{\pi}{6}`}</M> <M>{t`e^{i\cdot 30}`}</M> wäre eine Drehung um 30 Radiant – fast fünf volle Umdrehungen.</>}
            en={<>The exponent holds the angle in radians: 30° is <M p=".">{t`\tfrac{\pi}{6}`}</M> <M>{t`e^{i\cdot 30}`}</M> would be a turn by 30 radians – almost five full turns.</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=";">{t`i^n`}</M> nur der Rest von <M>n</M> beim Teilen durch <M>4</M> zählt.</li>
              <li><M p=",">{t`z = r(\cos\varphi + i\sin\varphi) = re^{i\varphi}`}</M> <M p=",">{t`r = |z|`}</M> <M>\varphi</M> gegen den Uhrzeigersinn ab der positiven reellen Achse.</li>
              <li>Winkel: <M>{t`\cos\varphi = a/r`}</M> und <M>{t`\sin\varphi = b/r`}</M> – Ecke prüfen, <M>{t`\arctan(b/a)`}</M> allein reicht nicht.</li>
              <li>Mal: Längen mal, Winkel plus. Durch: Längen durch, Winkel minus. <M p=".">{t`\bar z = re^{-i\varphi}`}</M></li>
              <li>Addieren: lieber in <M p=".">{t`a + bi`}</M></li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`i^n`}</M> only the remainder of <M>n</M> after dividing by <M>4</M> counts.</li>
              <li><M p=",">{t`z = r(\cos\varphi + i\sin\varphi) = re^{i\varphi}`}</M> <M p=",">{t`r = |z|`}</M> <M>\varphi</M> counter-clockwise from the positive real axis.</li>
              <li>Angle: <M>{t`\cos\varphi = a/r`}</M> and <M>{t`\sin\varphi = b/r`}</M> – check the corner; <M>{t`\arctan(b/a)`}</M> alone is not enough.</li>
              <li>Times: lengths times, angles plus. Divided by: lengths divided, angles minus. <M p=".">{t`\bar z = re^{-i\varphi}`}</M></li>
              <li>Adding: better in <M p=".">{t`a + bi`}</M></li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
