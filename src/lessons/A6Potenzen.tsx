import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { DoubleAngleLines, PowerSpiral, RootAnimFig, RootsExplorer, RotateI } from '../viz/ana/W6Figures';

const t = String.raw;

export default function A6Potenzen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Aus <a href="#ana-komplex">Polarform und Eulerform</a> wissen wir: Mal heisst Längen multiplizieren, Winkel addieren. Wer das <M>n</M>-mal hintereinander macht, bekommt Potenzen. Rückwärts gelesen gibt es Wurzeln – und zwar gleich <M>n</M> Stück. Am Schluss fallen zwei Winkelformeln fast von selbst heraus.</p>}
        en={<p className="lede">From <a href="#ana-komplex">Polar form and Euler form</a> we know: times means multiplying lengths and adding angles. Doing it <M>n</M> times in a row gives powers. Read backwards it gives roots – and <M>n</M> of them at once. At the end two angle formulas drop out almost by themselves.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="potenzen" title={<T de="1. Potenzen" en="1. Powers" />}>
        <Box kind="uebung" src={<Src u={6} p={8} />} title={<T de="Potenzen" en={<De en="powers">Potenzen</De>} />}>
          <T de={<p>Die Länge potenzieren, den Winkel mit dem Exponenten multiplizieren.</p>} en={<p>Raise the length to the power, multiply the angle by the exponent.</p>} />
          <MD>{t`\left(re^{i\varphi}\right)^n = r^n e^{in\varphi}, \qquad n \in \mathbb N`}</MD>
          <T de={<p><b>Bsp.</b> Zuerst <M>{t`1 + i`}</M> in Eulerform schreiben.</p>} en={<p><b>Example.</b> First write <M>{t`1 + i`}</M> in Euler form.</p>} />
          <MD>{t`1 + i = \sqrt2\, e^{i\pi/4}, \qquad (1 + i)^4 = (\sqrt2)^4 e^{i\pi} = 4(-1) = -4, \qquad \frac{1}{(1 + i)^4} = -\frac14`}</MD>
          <T de={<p>Wichtig: <M>{t`r^n`}</M> für die Länge, <M>{t`n\varphi`}</M> für den Winkel.</p>} en={<p>Important: <M>{t`r^n`}</M> for the length, <M>{t`n\varphi`}</M> for the angle.</p>} />
        </Box>
        <T
          de={<p className="keep"><b>Warum?</b> <M>{t`z^n = z\cdot z\cdots z`}</M> (<M>n</M> Faktoren). Jeder Faktor multipliziert die Länge mit <M>r</M> und dreht um <M p=".">\varphi</M> Nach <M>n</M> Faktoren: Länge <M>{t`r\cdot r\cdots r = r^n`}</M> und Winkel <M p=".">{t`\varphi + \dots + \varphi = n\varphi`}</M> Die Punkte <M>{t`z, z^2, z^3, \dots`}</M> laufen darum auf einer <b>Spirale</b>: gleich grosse Drehschritte, die Länge wächst (oder schrumpft) jedes Mal um den Faktor <M p=".">r</M></p>}
          en={<p className="keep"><b>Why?</b> <M>{t`z^n = z\cdot z\cdots z`}</M> (<M>n</M> factors). Every factor multiplies the length by <M>r</M> and turns by <M p=".">\varphi</M> After <M>n</M> factors: length <M>{t`r\cdot r\cdots r = r^n`}</M> and angle <M p=".">{t`\varphi + \dots + \varphi = n\varphi`}</M> That is why the points <M>{t`z, z^2, z^3, \dots`}</M> run along a <b>spiral</b>: equal turning steps, and the length grows (or shrinks) by the factor <M>r</M> each time.</p>}
        />
        <PowerSpiral />
        <T
          de={<p className="keep"><b>So liest man das Beispiel:</b> <M>{t`1 + i`}</M> liegt rechts oben, <M>{t`r = \sqrt{1 + 1} = \sqrt2`}</M> und <M>{t`\cos\varphi = \sin\varphi = \tfrac{1}{\sqrt2} = \tfrac{\sqrt2}{2}`}</M> – also <M p=".">{t`\varphi = \tfrac{\pi}{4}`}</M> Hoch 4: Länge <M p=",">{t`(\sqrt2)^4 = 2^2 = 4`}</M> Winkel <M p=".">{t`4\cdot\tfrac{\pi}{4} = \pi`}</M> Und <M>{t`e^{i\pi} = \cos\pi + i\sin\pi = -1`}</M> (halbe Drehung). Also <M p=",">{t`(1 + i)^4 = -4`}</M> und der Kehrwert ist <M p=".">{t`-\tfrac14`}</M> Im Bild (Knopf <M p="»):">{t`(1 + i)^4`}</M> vier Viertel-pi-Schritte bis auf die negative reelle Achse.</p>}
          en={<p className="keep"><b>How to read the example:</b> <M>{t`1 + i`}</M> lies upper right, <M>{t`r = \sqrt{1 + 1} = \sqrt2`}</M> and <M>{t`\cos\varphi = \sin\varphi = \tfrac{1}{\sqrt2} = \tfrac{\sqrt2}{2}`}</M> – so <M p=".">{t`\varphi = \tfrac{\pi}{4}`}</M> To the 4th: length <M p=",">{t`(\sqrt2)^4 = 2^2 = 4`}</M> angle <M p=".">{t`4\cdot\tfrac{\pi}{4} = \pi`}</M> And <M>{t`e^{i\pi} = \cos\pi + i\sin\pi = -1`}</M> (half turn). So <M p=",">{t`(1 + i)^4 = -4`}</M> and its reciprocal is <M p=".">{t`-\tfrac14`}</M> In the figure (button <M p="”):">{t`(1 + i)^4`}</M> four quarter-pi steps down to the negative real axis.</p>}
        />
        <T
          de={<p>Zum Vergleich der Weg ohne Polarform: <M>{t`(1 + i)^2 = 1 + 2i + i^2 = 2i`}</M> und <M p=".">{t`(2i)^2 = 4i^2 = -4`}</M> Hier geht beides. Bei <M>{t`(1 + i)^{20}`}</M> gewinnt die Polarform klar: <M p=".">{t`(\sqrt2)^{20} e^{i\cdot 5\pi} = 1024\cdot(-1)`}</M></p>}
          en={<p>For comparison, the way without polar form: <M>{t`(1 + i)^2 = 1 + 2i + i^2 = 2i`}</M> and <M p=".">{t`(2i)^2 = 4i^2 = -4`}</M> Here both work. For <M>{t`(1 + i)^{20}`}</M> the polar form clearly wins: <M p=".">{t`(\sqrt2)^{20} e^{i\cdot 5\pi} = 1024\cdot(-1)`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="mal-i" title={<T de={<>2. Mal <M>i</M> heisst: Vierteldrehung</>} en={<>2. Times <M>i</M> means: a quarter turn</>} />}>
        <Box kind="uebung" src={<Src u={6} p={8} />} title={<T de={<>Was passiert beim Multiplizieren mit <M p="?">i</M></>} en={<>What happens when multiplying by <M p="?">i</M></>} />}>
          <MD>{t`i = e^{i\pi/2} \;\Rightarrow\; iz = re^{i(\varphi + \pi/2)}`}</MD>
          <T de={<p>Der Punkt dreht sich um 90° gegen den Uhrzeigersinn. Die Länge bleibt gleich.</p>} en={<p>The point turns by 90° counter-clockwise. The length stays the same.</p>} />
          <MD>{t`z = 6 + 7i \;\Rightarrow\; iz = 6i + 7i^2 = -7 + 6i`}</MD>
        </Box>
        <T
          de={<p className="keep"><M>i</M> hat Länge <M>1</M> und Winkel <M p=".">{t`\tfrac{\pi}{2}`}</M> Mal <M>1</M> ändert die Länge nicht, plus <M>{t`\tfrac{\pi}{2}`}</M> ist eine Vierteldrehung. In Koordinaten: Aus <M>{t`(a; b)`}</M> wird <M p=".">{t`(-b; a)`}</M> Bei <M p=":">{t`6 + 7i`}</M> Der alte Imaginärteil <M>7</M> wird mit Minus zum neuen Realteil, der alte Realteil <M>6</M> zum neuen Imaginärteil.</p>}
          en={<p className="keep"><M>i</M> has length <M>1</M> and angle <M p=".">{t`\tfrac{\pi}{2}`}</M> Times <M>1</M> does not change the length; plus <M>{t`\tfrac{\pi}{2}`}</M> is a quarter turn. In coordinates: <M>{t`(a, b)`}</M> becomes <M p=".">{t`(-b, a)`}</M> For <M p=":">{t`6 + 7i`}</M> the old imaginary part <M>7</M> becomes the new real part with a minus, the old real part <M>6</M> the new imaginary part.</p>}
        />
        <RotateI />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="wurzeln" title={<T de={<>3. Wurzeln ziehen: <M>n</M> Lösungen</>} en={<>3. Taking roots: <M>n</M> solutions</>} />}>
        <Box kind="uebung" src={<Src u={6} p={9} />} title={<T de="Wurzeln ziehen" en={<>Taking roots (<span lang="de">Wurzeln ziehen</span>)</>} />}>
          <T de={<p>Gesucht sind alle Zahlen, die beim Potenzieren dieselbe Zahl ergeben.</p>} en={<p>We look for all numbers that give the same number when raised to the power.</p>} />
          <MD>{t`z^n = w = Re^{i\theta}, \qquad R > 0, \quad n \in \{1, 2, \dots\}`}</MD>
          <MD>{t`z_k = \sqrt[n]{R}\, e^{i(\theta + 2\pi k)/n}, \qquad k = 0, \dots, n - 1`}</MD>
          <T de={<p>Länge: <M>n</M>-te Wurzel. Startwinkel: <M p=".">{t`\theta/n`}</M> Dann jeweils <M>{t`2\pi/n`}</M> weiterdrehen.</p>} en={<p>Length: <M>n</M>-th root. Start angle: <M p=".">{t`\theta/n`}</M> Then turn on by <M>{t`2\pi/n`}</M> each time.</p>} />
          <MD>{t`z^4 = -16 = 16e^{i\pi} \;\Rightarrow\; z_k = 2e^{i(\pi/4 + k\pi/2)}`}</MD>
          <MD>{t`\sqrt2 + i\sqrt2, \quad -\sqrt2 + i\sqrt2, \quad -\sqrt2 - i\sqrt2, \quad \sqrt2 - i\sqrt2`}</MD>
          <T de={<p>Hier entstehen vier verschiedene Lösungen. Bei <M>{t`w = 0`}</M> gibt es nur <M p=".">{t`z = 0`}</M></p>} en={<p>Here four different solutions arise. For <M>{t`w = 0`}</M> there is only <M p=".">{t`z = 0`}</M></p>} />
          <T de={<p>Bild: Kreis mit Radius 2, die vier Lösungen als Ecken eines Quadrats; <M>{t`z_0`}</M> magenta beim Winkel <M p=".">{t`\pi/4`}</M></p>} en={<p>Picture: circle of radius 2, the four solutions as corners of a square; <M>{t`z_0`}</M> in magenta at angle <M p=".">{t`\pi/4`}</M></p>} />
        </Box>
        <T
          de={<p className="keep"><b>Woher kommt die Formel?</b> Schreibe die gesuchte Zahl als <M p=".">{t`z = re^{i\varphi}`}</M> Dann ist <M p=".">{t`z^n = r^n e^{in\varphi}`}</M> Das soll <M>{t`Re^{i\theta}`}</M> sein. Zwei Bedingungen:</p>}
          en={<p className="keep"><b>Where does the formula come from?</b> Write the unknown number as <M p=".">{t`z = re^{i\varphi}`}</M> Then <M p=".">{t`z^n = r^n e^{in\varphi}`}</M> This should be <M p=".">{t`Re^{i\theta}`}</M> Two conditions:</p>}
        />
        <ul className="keep">
          <T
            de={<>
              <li><b>Länge:</b> <M p=",">{t`r^n = R`}</M> also <M p=".">{t`r = \sqrt[n]{R}`}</M> Eine einzige Möglichkeit, denn <M>r</M> ist positiv.</li>
              <li><b>Winkel:</b> <M>{t`n\varphi`}</M> muss in dieselbe Richtung zeigen wie <M p=".">\theta</M> Das heisst nicht nur <M p=",">{t`n\varphi = \theta`}</M> sondern <M>{t`n\varphi = \theta + 2\pi k`}</M> – volle Drehungen ändern nichts. Also <M p=".">{t`\varphi = \tfrac{\theta + 2\pi k}{n}`}</M></li>
              <li><b>Warum nur <M p="?">{t`k = 0, \dots, n - 1`}</M></b> Bei <M>{t`k = n`}</M> ist der Winkel <M p=":">{t`\tfrac{\theta}{n} + 2\pi`}</M> wieder derselbe Punkt wie bei <M p=".">{t`k = 0`}</M> Ab da wiederholt sich alles.</li>
            </>}
            en={<>
              <li><b>Length:</b> <M p=",">{t`r^n = R`}</M> so <M p=".">{t`r = \sqrt[n]{R}`}</M> A single possibility, since <M>r</M> is positive.</li>
              <li><b>Angle:</b> <M>{t`n\varphi`}</M> must point in the same direction as <M p=".">\theta</M> That does not only mean <M p=",">{t`n\varphi = \theta`}</M> but <M>{t`n\varphi = \theta + 2\pi k`}</M> – full turns change nothing. So <M p=".">{t`\varphi = \tfrac{\theta + 2\pi k}{n}`}</M></li>
              <li><b>Why only <M p="?">{t`k = 0, \dots, n - 1`}</M></b> For <M>{t`k = n`}</M> the angle is <M p=",">{t`\tfrac{\theta}{n} + 2\pi`}</M> the same point as for <M p=".">{t`k = 0`}</M> From there on everything repeats.</li>
            </>}
          />
        </ul>
        <T
          de={<p>Die Animation konstruiert das Beispiel der Übung genau so.</p>}
          en={<p>The animation constructs the class example exactly like this.</p>}
        />
        <StepPlayer
          label={tr('Animation: die vier Lösungen von z hoch 4 gleich −16', 'Animation: the four solutions of z to the 4th equal −16')}
          steps={[
            { ms: 900, holdMs: 3000, caption: <T
              de={<><M>{t`-16`}</M> in Eulerform: Länge <M p=",">{t`R = 16`}</M> Richtung <M>{t`\theta = \pi`}</M> (nach links). <M>w</M> selbst liegt weit ausserhalb des Bildes.</>}
              en={<><M>{t`-16`}</M> in Euler form: length <M p=",">{t`R = 16`}</M> direction <M>{t`\theta = \pi`}</M> (to the left). <M>w</M> itself lies far outside the picture.</>} /> },
            { ms: 1300, holdMs: 2800, caption: <T
              de={<>Länge der Lösungen: <M p=".">{t`\sqrt[4]{16} = 2`}</M> Alle Lösungen liegen auf dem Kreis mit Radius <M p=".">2</M></>}
              en={<>Length of the solutions: <M p=".">{t`\sqrt[4]{16} = 2`}</M> All solutions lie on the circle of radius <M p=".">2</M></>} /> },
            { ms: 1100, holdMs: 2800, caption: <T
              de={<>Startwinkel <M p=".">{t`\theta/4 = \pi/4`}</M> Das gibt <M p=".">{t`z_0 = 2e^{i\pi/4} = \sqrt2 + i\sqrt2`}</M></>}
              en={<>Start angle <M p=".">{t`\theta/4 = \pi/4`}</M> That gives <M p=".">{t`z_0 = 2e^{i\pi/4} = \sqrt2 + i\sqrt2`}</M></>} /> },
            { ms: 2400, holdMs: 2800, caption: <T
              de={<>Dreimal um <M>{t`2\pi/4 = \pi/2`}</M> weiterdrehen: <M p=",">{t`z_1`}</M> <M p=",">{t`z_2`}</M> <M p=".">{t`z_3`}</M> Ein vierter Schritt käme zurück zu <M p=".">{t`z_0`}</M></>}
              en={<>Turn on three times by <M p=":">{t`2\pi/4 = \pi/2`}</M> <M p=",">{t`z_1`}</M> <M p=",">{t`z_2`}</M> <M p=".">{t`z_3`}</M> A fourth step would come back to <M p=".">{t`z_0`}</M></>} /> },
            { ms: 900, caption: <T
              de={<>Die vier Lösungen sind die Ecken eines Quadrats: <M p=".">{t`\pm\sqrt2 \pm i\sqrt2`}</M></>}
              en={<>The four solutions are the corners of a square: <M p=".">{t`\pm\sqrt2 \pm i\sqrt2`}</M></>} /> },
          ]}
        >
          {(step, tt) => <RootAnimFig step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p>Allgemein bilden die <M>n</M> Lösungen immer ein <b>regelmässiges <M>n</M>-Eck</b> auf dem Kreis mit Radius <M p=".">{t`\sqrt[n]{R}`}</M> Probier es aus – und starte die Probe: Jede Lösung wird stetig «hoch <M>n</M>» genommen. Ihr Winkel wird dabei <M>n</M>-mal so gross, und alle landen auf <M p=".">w</M></p>}
          en={<p>In general the <M>n</M> solutions always form a <b>regular <M>n</M>-gon</b> on the circle of radius <M p=".">{t`\sqrt[n]{R}`}</M> Try it – and start the check: each solution is raised “to the <M>n</M>” continuously. Its angle becomes <M>n</M> times as large, and all of them land on <M p=".">w</M></p>}
        />
        <RootsExplorer />
        <T
          de={<p className="keep"><b>Und <M p="?">{t`w = 0`}</M></b> Dann ist <M p=",">{t`R = 0`}</M> also <M p=":">{t`r^n = 0`}</M> Nur <M>{t`r = 0`}</M> geht, und das ist der eine Punkt <M p=".">{t`z = 0`}</M> Einen Winkel gibt es dort nicht, also auch kein Vieleck. Darum verlangt die Formel <M p=".">{t`R > 0`}</M></p>}
          en={<p className="keep"><b>And <M p="?">{t`w = 0`}</M></b> Then <M p=",">{t`R = 0`}</M> so <M p=".">{t`r^n = 0`}</M> Only <M>{t`r = 0`}</M> works, and that is the single point <M p=".">{t`z = 0`}</M> There is no angle there, hence no polygon. That is why the formula requires <M p=".">{t`R > 0`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="winkelformeln" title={<T de="4. Winkelformeln aus der Eulerform" en="4. Angle formulas from the Euler form" />}>
        <Box kind="uebung" src={<Src u={6} p={11} />} title={<T de="Trigonometrische Beziehungen" en={<>Trigonometric relations (<span lang="de">Trigonometrische Beziehungen</span>)</>} />}>
          <T de={<p>Dieselbe komplexe Zahl auf zwei Arten schreiben. Dann Realteil und Imaginärteil vergleichen.</p>} en={<p>Write the same complex number in two ways. Then compare real part and imaginary part.</p>} />
          <T de={<p><b>Bsp. Doppelter Winkel</b></p>} en={<p><b>Example: double angle</b></p>} />
          <MD>{t`e^{2ix} = (e^{ix})^2, \qquad \cos(2x) + i\sin(2x) = (\cos x + i\sin x)^2`}</MD>
          <T de={<p>Rechts ausmultiplizieren und <M>{t`i^2 = -1`}</M> einsetzen.</p>} en={<p>Multiply out the right-hand side and substitute <M p=".">{t`i^2 = -1`}</M></p>} />
          <MD>{t`(\cos x + i\sin x)^2 = \cos^2 x - \sin^2 x + i\,2\sin x\cos x`}</MD>
          <MD>{t`\cos(2x) = \cos^2 x - \sin^2 x, \qquad \sin(2x) = 2\sin x\cos x`}</MD>
          <T de={<p>Für den dreifachen Winkel in Serie 6 funktioniert dieselbe Idee mit der dritten Potenz.</p>} en={<p>For the triple angle in problem set 6 (<span lang="de">Serie 6</span>) the same idea works with the third power.</p>} />
        </Box>
        <StepPlayer
          label={tr('Animation: doppelter Winkel aus der Eulerform', 'Animation: double angle from the Euler form')}
          steps={[
            { ms: 900, holdMs: 2800, caption: <T
              de={<>Potenzregel mit <M>{t`r = 1`}</M> und <M p=":">{t`n = 2`}</M> Den Winkel <M>x</M> zweimal nehmen gibt <M p=".">{t`2x`}</M></>}
              en={<>Power rule with <M>{t`r = 1`}</M> and <M p=":">{t`n = 2`}</M> taking the angle <M>x</M> twice gives <M p=".">{t`2x`}</M></>} /> },
            { ms: 900, holdMs: 2800, caption: <T
              de={<>Beide Seiten mit der Eulerform ausschreiben: links beim Winkel <M p=",">{t`2x`}</M> rechts beim Winkel <M p=".">x</M></>}
              en={<>Write both sides out with the Euler form: left at angle <M p=",">{t`2x`}</M> right at angle <M p=".">x</M></>} /> },
            { ms: 900, holdMs: 3200, caption: <T
              de={<>Rechts binomisch ausmultiplizieren, <M>{t`i^2 = -1`}</M> einsetzen. Blau: reell. Magenta: was bei <M>i</M> steht.</>}
              en={<>Expand the right-hand side, substitute <M p=".">{t`i^2 = -1`}</M> Blue: real. Magenta: what stands next to <M p=".">i</M></>} /> },
            { ms: 900, caption: <T
              de={<>Zwei komplexe Zahlen sind gleich, wenn Realteile und Imaginärteile gleich sind. Das gibt zwei Formeln auf einmal.</>}
              en={<>Two complex numbers are equal when their real parts and imaginary parts are equal. That gives two formulas at once.</>} /> },
          ]}
        >
          {(step, tt) => <DoubleAngleLines step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>Warum darf man vergleichen?</b> Links und rechts steht dieselbe Zahl. Eine komplexe Zahl ist ein Punkt der Ebene, und ein Punkt hat nur eine Koordinate nach rechts und eine nach oben. Darum müssen beide Teile einzeln übereinstimmen. Probe mit <M p=":">{t`x = \tfrac{\pi}{4}`}</M> <M>{t`\cos\tfrac{\pi}{2} = 0 = \tfrac12 - \tfrac12`}</M> und <M p=".">{t`\sin\tfrac{\pi}{2} = 1 = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2}`}</M></p>}
          en={<p><b>Why may we compare?</b> Left and right is the same number. A complex number is a point of the plane, and a point has only one coordinate to the right and one up. So both parts must agree separately. Check with <M p=":">{t`x = \tfrac{\pi}{4}`}</M> <M>{t`\cos\tfrac{\pi}{2} = 0 = \tfrac12 - \tfrac12`}</M> and <M p=".">{t`\sin\tfrac{\pi}{2} = 1 = 2\cdot\tfrac{\sqrt2}{2}\cdot\tfrac{\sqrt2}{2}`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="potenzen-merke" title={<T de="5. Typische Fehler und das Wichtigste" en="5. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`(\sqrt2\, e^{i\pi/4})^4 = 4\sqrt2\, e^{i\pi}`}</M>»</>} en={<>“<M>{t`(\sqrt2\, e^{i\pi/4})^4 = 4\sqrt2\, e^{i\pi}`}</M>”</>} />}>
          <T de={<>Die Länge wird <b>potenziert</b>, nicht mit <M>n</M> multipliziert: <M p=".">{t`(\sqrt2)^4 = 4`}</M> Nur der Winkel wird mal <M>n</M> genommen.</>}
            en={<>The length is <b>raised to the power</b>, not multiplied by <M p=":">n</M> <M p=".">{t`(\sqrt2)^4 = 4`}</M> Only the angle is multiplied by <M p=".">n</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`z^4 = -16`}</M> hat keine Lösung, Quadrate sind doch positiv.»</>} en={<>“<M>{t`z^4 = -16`}</M> has no solution, squares are positive.”</>} />}>
          <T de={<>Im Reellen stimmt das. In <M>{t`\mathbb C`}</M> hat <M>{t`z^n = w`}</M> für jedes <M>{t`w \neq 0`}</M> genau <M>n</M> Lösungen – hier vier.</>}
            en={<>In the reals that is true. In <M>{t`\mathbb C`}</M> the equation <M>{t`z^n = w`}</M> has exactly <M>n</M> solutions for every <M>{t`w \neq 0`}</M> – here four.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Radius der Wurzeln: <M>R</M> geteilt durch <M p=".»">n</M></>} en={<>“Radius of the roots: <M>R</M> divided by <M p=".”">n</M></>} />}>
          <T de={<>Radius <M p=",">{t`\sqrt[n]{R}`}</M> nicht <M p=".">{t`R/n`}</M> Bei <M>{t`-16`}</M> ist er <M p=",">{t`\sqrt[4]{16} = 2`}</M> nicht <M p=".">4</M> Geteilt durch <M>n</M> wird nur der <b>Winkel</b> <M p=".">\theta</M></>}
            en={<>Radius <M p=",">{t`\sqrt[n]{R}`}</M> not <M p=".">{t`R/n`}</M> For <M>{t`-16`}</M> it is <M p=",">{t`\sqrt[4]{16} = 2`}</M> not <M p=".">4</M> Only the <b>angle</b> <M>\theta</M> is divided by <M p=".">n</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Die Wurzeln starten immer bei der reellen Achse.»" en="“The roots always start at the real axis.”" />}>
          <T de={<>Der Startwinkel ist <M p=",">{t`\theta/n`}</M> nicht <M p=".">0</M> Nur bei positivem reellem <M>w</M> (dort ist <M p=")">{t`\theta = 0`}</M> liegt eine Lösung auf der reellen Achse.</>}
            en={<>The start angle is <M p=",">{t`\theta/n`}</M> not <M p=".">0</M> Only for a positive real <M>w</M> (there <M p=")">{t`\theta = 0`}</M> does a solution lie on the real axis.</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=":">{t`(re^{i\varphi})^n = r^n e^{in\varphi}`}</M> <M>{t`r^n`}</M> für die Länge, <M>{t`n\varphi`}</M> für den Winkel.</li>
              <li>Mal <M p=":">i</M> Vierteldrehung, Länge bleibt.</li>
              <li><M>{t`z^n = Re^{i\theta}`}</M> (<M p=")">{t`R > 0`}</M> <M>n</M> Lösungen <M p=":">{t`\sqrt[n]{R}\, e^{i(\theta + 2\pi k)/n}`}</M> regelmässiges <M>n</M>-Eck, Start bei <M p=",">{t`\theta/n`}</M> Schritt <M p=".">{t`2\pi/n`}</M></li>
              <li>Winkelformeln: <M>{t`e^{inx} = (e^{ix})^n`}</M> ausmultiplizieren, Real- und Imaginärteil vergleichen.</li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`(re^{i\varphi})^n = r^n e^{in\varphi}`}</M> <M>{t`r^n`}</M> for the length, <M>{t`n\varphi`}</M> for the angle.</li>
              <li>Times <M p=":">i</M> quarter turn, length stays.</li>
              <li><M>{t`z^n = Re^{i\theta}`}</M> (<M p=")">{t`R > 0`}</M> <M>n</M> solutions <M p=":">{t`\sqrt[n]{R}\, e^{i(\theta + 2\pi k)/n}`}</M> a regular <M>n</M>-gon, start at <M p=",">{t`\theta/n`}</M> step <M p=".">{t`2\pi/n`}</M></li>
              <li>Angle formulas: expand <M p=",">{t`e^{inx} = (e^{ix})^n`}</M> compare real and imaginary parts.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
