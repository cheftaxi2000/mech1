import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { BoxDiagram, RectErrorFig, RingFig, TanFigure } from '../viz/ana/Week5Figures';

const t = String.raw;

export default function A5Fehler() {
  const tr = useTr();
  /** shared formula with decimal numbers: comma in German, point in English */
  const c = (s: string) => tr(s, s.replace(/\{,\}/g, '.'));
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Jede Messung ist ein bisschen falsch. Wenn man mit dem Messwert weiterrechnet, wandert der Fehler ins Ergebnis. Wie viel davon ankommt, sagt die Tangente aus der Lektion <a href="#ana-tangente">Tangente und Normale</a>: <M p=".">{t`\Delta f \approx f'(x)\,\Delta x`}</M></p>}
        en={<p className="lede">Every measurement is a little wrong. If you keep calculating with the measured value, the error travels into the result. How much of it arrives is told by the tangent from the lesson <a href="#ana-tangente">Tangent and normal</a>: <M p=".">{t`\Delta f \approx f'(x)\,\Delta x`}</M></p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="fehler-tangente" title={<T de="1. Wie wirkt ein Messfehler auf das Ergebnis?" en="1. How does a measurement error affect the result?" />}>
        <Box kind="uebung" src={<Src u={5} p={1} />} title={<T de="Fehlerrechnung" en={<De en="error estimation">Fehlerrechnung</De>} />}>
          <T
            de={<p>Wir messen eine Grösse <M>x</M> mit Messfehler <M p=".">{t`\Delta x`}</M> Mit dieser gemessenen Grösse <M>x</M> berechnen wir eine Grösse <M p=".">{t`f(x)`}</M> Wie wirkt sich der Messfehler <M>{t`\Delta x`}</M> auf <M>f</M> aus?</p>}
            en={<p>We measure a quantity <M>x</M> with measurement error <M p=".">{t`\Delta x`}</M> With this measured quantity <M>x</M> we calculate a quantity <M p=".">{t`f(x)`}</M> How does the measurement error <M>{t`\Delta x`}</M> affect <M p="?">f</M></p>}
          />
          <MD>{t`\Delta f = f(x + \Delta x) - f(x)`}</MD>
          <T de={<p>Für kleine <M>{t`\Delta x`}</M> hilft die Tangente:</p>} en={<p>For small <M>{t`\Delta x`}</M> the tangent helps:</p>} />
          <MD>{t`\Delta f \approx df = f'(x)\cdot\Delta x`}</MD>
        </Box>
        <Box kind="intuition">
          <T
            de={<p>Du misst die Seite eines Tisches mit dem Meterband und liegst 1 mm daneben. Wie falsch ist dann die Fläche? Man könnte zweimal rechnen – mit dem gemessenen und mit dem wahren Wert – und vergleichen. Das ist <M p=".">{t`\Delta f`}</M> Einfacher: Man fragt, wie schnell <M>f</M> gerade wächst (die Steigung <M p=")">{t`f'(x)`}</M> und multipliziert mit dem kleinen Fehler. Wie beim Auto: Tacho mal kurze Zeit gibt fast genau die gefahrene Strecke.</p>}
            en={<p>You measure the side of a table with a tape measure and are off by 1 mm. How wrong is the area then? You could calculate twice – with the measured and with the true value – and compare. That is <M p=".">{t`\Delta f`}</M> Simpler: ask how fast <M>f</M> is growing right now (the slope <M p=")">{t`f'(x)`}</M> and multiply by the small error. Like in a car: speedometer times a short time gives almost exactly the distance driven.</p>}
          />
        </Box>
        <T
          de={<p>Die Animation zeigt das am Beispiel <M>{t`f(x) = x^2`}</M> bei <M p=".">{t`x = 1`}</M> <M>{t`\Delta f`}</M> ist der echte Anstieg auf der Kurve, <M>{t`df`}</M> (das «Differential») der Anstieg auf der Tangente.</p>}
          en={<p>The animation shows this for <M>{t`f(x) = x^2`}</M> at <M p=".">{t`x = 1`}</M> <M>{t`\Delta f`}</M> is the true rise on the curve, <M>{t`df`}</M> (the “differential”) the rise on the tangent.</p>}
        />
        <StepPlayer
          label={tr('Animation: Delta f auf der Kurve und df auf der Tangente, dann Zoom', 'Animation: Delta f on the curve and df on the tangent, then zoom')}
          steps={[
            { ms: 1800, holdMs: 2200, caption: <T
              de={<>Du misst <M p=",">x</M> der wahre Wert liegt um <M>{t`\Delta x`}</M> daneben (grauer Pfeil).</>}
              en={<>You measure <M p=";">x</M> the true value is off by <M>{t`\Delta x`}</M> (grey arrow).</>} /> },
            { ms: 1800, holdMs: 2800, caption: <T
              de={<>Blau: So viel ändert sich <M>f</M> wirklich, <M p=".">{t`\Delta f = f(x+\Delta x) - f(x)`}</M> Das ist der Fehler im Ergebnis.</>}
              en={<>Blue: this is how much <M>f</M> really changes, <M p=".">{t`\Delta f = f(x+\Delta x) - f(x)`}</M> It is the error in the result.</>} /> },
            { ms: 2000, holdMs: 3000, caption: <T
              de={<>Die Tangente in <M>x</M> hat die Steigung <M p=".">{t`f'(x)`}</M> Auf ihr steigt <M>f</M> nur um <M>{t`df = f'(x)\,\Delta x`}</M> (magenta). Das ist leicht zu rechnen.</>}
              en={<>The tangent at <M>x</M> has slope <M p=".">{t`f'(x)`}</M> Along it <M>f</M> rises only by <M>{t`df = f'(x)\,\Delta x`}</M> (magenta). That is easy to calculate.</>} /> },
            { ms: 1500, holdMs: 3000, caption: <T
              de={<>Rot: die Lücke <M p=".">{t`\Delta f - df`}</M> So falsch ist die Näherung. Bei diesem grossen <M>{t`\Delta x`}</M> ist sie noch deutlich.</>}
              en={<>Red: the gap <M p=".">{t`\Delta f - df`}</M> This is how wrong the approximation is. For this large <M>{t`\Delta x`}</M> it is still clearly visible.</>} /> },
            { ms: 3500, caption: <T
              de={<>Zoom: <M>{t`\Delta x`}</M> wird 4-mal kleiner, die Lücke 16-mal (sie wächst wie <M p=").">{t`\Delta x^2`}</M> Für kleine <M>{t`\Delta x`}</M> ist darum <M p=".">{t`\Delta f \approx df`}</M></>}
              en={<>Zoom: <M>{t`\Delta x`}</M> becomes 4 times smaller, the gap 16 times (it grows like <M p=").">{t`\Delta x^2`}</M> So for small <M>{t`\Delta x`}</M> we have <M p=".">{t`\Delta f \approx df`}</M></>} /> },
          ]}
        >
          {(step, tt) => <TanFigure step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>Warum gerade <M p="?">{t`\Delta x^2`}</M></b> Hier kann man exakt nachrechnen: <M p=",">{t`(1 + \Delta x)^2 - 1 = 2\Delta x + \Delta x^2`}</M> und <M>{t`df = 2\Delta x`}</M> ist der erste Teil. Übrig bleibt <M p=".">{t`\Delta x^2`}</M> Bei <M>{t`\Delta x = 0{,}01`}</M> ist das nur noch <M p=".">{t`0{,}0001`}</M></p>}
          en={<p><b>Why exactly <M p="?">{t`\Delta x^2`}</M></b> Here you can calculate exactly: <M p=",">{t`(1 + \Delta x)^2 - 1 = 2\Delta x + \Delta x^2`}</M> and <M>{t`df = 2\Delta x`}</M> is the first part. What remains is <M p=".">{t`\Delta x^2`}</M> For <M>{t`\Delta x = 0.01`}</M> that is only <M p=".">{t`0.0001`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="fehler-absolut-relativ" title={<T de="2. Absoluter und relativer Fehler" en="2. Absolute and relative error" />}>
        <Box kind="uebung" src={<Src u={5} p={1} />} title={<T de="Absoluter und relativer Fehler" en={<><De en="absolute error">Absoluter Fehler</De>, <De en="relative error">relativer Fehler</De></>} />}>
          <MD>{t`E_f = |\Delta f| \approx |f'(x)|\cdot|\Delta x|`}</MD>
          <MD>{t`r_f = \frac{E_f}{|f(x)|} \approx \frac{|f'(x)|\cdot|\Delta x|}{|f(x)|}, \qquad f(x) \neq 0`}</MD>
          <T de={<p><b>Absolut</b>: wie viel? <b>Relativ</b>: wie viel im Verhältnis? Für Prozent: <M p=".">{t`\times 100`}</M></p>} en={<p><b>Absolute</b>: how much? <b>Relative</b>: how much compared with the value? For per cent: <M p=".">{t`\times 100`}</M></p>} />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>{t`E_f`}</M> (E wie <i>error</i>) ist der <b>absolute Fehler</b>: um wie viel das Ergebnis danebenliegt, in derselben Einheit wie <M p=".">f</M> Die Betragsstriche stehen da, weil ein Fehler nach oben oder unten gehen kann – man interessiert sich nur für seine Grösse.</li>
              <li><M>{t`r_f`}</M> ist der <b>relative Fehler</b>: der absolute Fehler geteilt durch den Wert selbst. Er hat keine Einheit. Darum muss <M>{t`f(x) \neq 0`}</M> sein.</li>
            </ol>
            <p>Warum beides? 1 cm daneben ist bei einem 10 m langen Zimmer egal (<M p="),">{t`0{,}1\,\%`}</M> bei einer 5 cm langen Schraube ein Desaster (<M p=").">{t`20\,\%`}</M></p>
          </>}
          en={<>
            <p><b>How to read it:</b></p>
            <ol>
              <li><M>{t`E_f`}</M> (E for <i>error</i>) is the <b>absolute error</b>: by how much the result is off, in the same unit as <M p=".">f</M> The absolute-value bars are there because an error can go up or down – only its size matters.</li>
              <li><M>{t`r_f`}</M> is the <b>relative error</b>: the absolute error divided by the value itself. It has no unit. That is why <M>{t`f(x) \neq 0`}</M> is required.</li>
            </ol>
            <p>Why both? Being 1 cm off is irrelevant for a room 10 m long (<M p="),">{t`0.1\,\%`}</M> a disaster for a screw 5 cm long (<M p=").">{t`20\,\%`}</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="fehler-rechteck" title={<T de="3. Beispiel Rechteck" en="3. Example: rectangle" />}>
        <Box kind="uebung" src={<Src u={5} p={1} />} title={<T de="Bsp. Rechteck" en={<>Example: rectangle (<span lang="de">Bsp. Rechteck</span>)</>} />}>
          <T de={<p>Nur <M>a</M> wird gemessen. <M>b</M> ist bekannt.</p>} en={<p>Only <M>a</M> is measured. <M>b</M> is known.</p>} />
          <MD>{t`A(a) = a\cdot b, \qquad \Delta A = (a + \Delta a)\,b - a\cdot b = b\cdot\Delta a`}</MD>
          <MD>{t`\frac{|\Delta A|}{A} = \frac{b\,|\Delta a|}{a\cdot b} = \frac{|\Delta a|}{a} \qquad (a, b > 0)`}</MD>
          <MD>{c(t`a = 12\ \mathrm m,\quad b = 3\ \mathrm m,\quad |\Delta a| = 0{,}1\ \mathrm m: \qquad E_A = 0{,}3\ \mathrm m^2,\quad r_A = \frac{0{,}1}{12} \approx 0{,}833\,\%`)}</MD>
          <T de={<p>Skizze: magenta Rechteck <M p=",">{t`a \times b`}</M> rechts ein blauer Streifen der Breite <M p=".">{t`\Delta a`}</M></p>} en={<p>Sketch: magenta rectangle <M p=",">{t`a \times b`}</M> on the right a blue strip of width <M p=".">{t`\Delta a`}</M></p>} />
        </Box>
        <T
          de={<p>Der Fehler der Fläche ist genau der blaue Streifen: Höhe <M p=",">b</M> Breite <M p=".">{t`\Delta a`}</M> Probiere es aus – mache <M>{t`|\Delta a|`}</M> gross, damit du den Streifen siehst:</p>}
          en={<p>The error of the area is exactly the blue strip: height <M p=",">b</M> width <M p=".">{t`\Delta a`}</M> Try it – make <M>{t`|\Delta a|`}</M> large so you can see the strip:</p>}
        />
        <RectErrorFig />
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li><M p=":">{t`\Delta A = (a + \Delta a)\,b - a\,b`}</M> neue Fläche minus alte Fläche – genau die Definition <M p=".">{t`\Delta f = f(x + \Delta x) - f(x)`}</M></li>
              <li>Ausmultiplizieren: <M p=".">{t`a b + b\,\Delta a - a b = b\,\Delta a`}</M> Hier gibt es kein «ungefähr»: <M>A</M> hängt linear von <M>a</M> ab, der Graph ist selbst eine Gerade, also ist <M>{t`\Delta A = dA`}</M> exakt.</li>
              <li>Relativ: durch <M>{t`A = a b`}</M> teilen. <M>b</M> kürzt sich weg, es bleibt <M p=".">{t`|\Delta a|/a`}</M> <M>{t`a, b > 0`}</M> braucht man, damit <M>{t`|A| = a b`}</M> ist.</li>
              <li>Zahlen: <M p=",">{t`E_A = 3\cdot 0{,}1 = 0{,}3\ \mathrm m^2`}</M> <M p=".">{t`r_A = 0{,}1/12 = 0{,}00833 = 0{,}833\,\%`}</M></li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li><M p=":">{t`\Delta A = (a + \Delta a)\,b - a\,b`}</M> new area minus old area – exactly the definition <M p=".">{t`\Delta f = f(x + \Delta x) - f(x)`}</M></li>
              <li>Multiply out: <M p=".">{t`a b + b\,\Delta a - a b = b\,\Delta a`}</M> There is no “approximately” here: <M>A</M> depends linearly on <M p=",">a</M> the graph is itself a straight line, so <M>{t`\Delta A = dA`}</M> exactly.</li>
              <li>Relative: divide by <M p=".">{t`A = a b`}</M> <M>b</M> cancels, leaving <M p=".">{t`|\Delta a|/a`}</M> <M>{t`a, b > 0`}</M> is needed so that <M p=".">{t`|A| = a b`}</M></li>
              <li>Numbers: <M p=",">{t`E_A = 3\cdot 0.1 = 0.3\ \mathrm m^2`}</M> <M p=".">{t`r_A = 0.1/12 = 0.00833 = 0.833\,\%`}</M></li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="fehler-zylinder" title={<T de="4. Zylinder: Der Fehler verdoppelt sich" en="4. Cylinder: the error doubles" />}>
        <Box kind="uebung" src={<Src u={5} p={2} />} title={<T de="Zylinder: Nur der Radius schwankt" en={<>Cylinder: only the radius varies (<span lang="de">Nur der Radius schwankt</span>)</>} />}>
          <MD>{t`\frac{|\Delta r|}{r} = 1\,\%, \qquad h = 1 \text{ ${tr('fest', 'fixed')}}`}</MD>
          <MD>{t`V(r) = \pi r^2 h \;\Rightarrow\; V'(r) = 2\pi r h`}</MD>
          <MD>{t`\frac{|\Delta V|}{V} \approx \frac{2\pi r h\,|\Delta r|}{\pi r^2 h} = 2\,\frac{|\Delta r|}{r} = 2\,\%`}</MD>
          <T de={<p>Radius zum Quadrat ⇒ ungefähr doppelter relativer Fehler.</p>} en={<p>Radius squared ⇒ about twice the relative error.</p>} />
        </Box>
        <T
          de={<p>Warum doppelt? Schau von oben auf den Zylinder: Die Grundfläche <M>{t`\pi r^2`}</M> bekommt einen dünnen Ring. Rollt man den Ring auf, ist er ein Streifen der Länge <M>{t`2\pi r`}</M> (Umfang) und der Breite <M p=".">{t`\Delta r`}</M> Seine Fläche <M>{t`2\pi r\,\Delta r`}</M> verglichen mit <M>{t`\pi r^2`}</M> ergibt <M p=":">{t`2\,\Delta r / r`}</M> der Radius «zählt zweimal».</p>}
          en={<p>Why twice? Look at the cylinder from above: the base <M>{t`\pi r^2`}</M> gains a thin ring. Unrolled, the ring is a strip of length <M>{t`2\pi r`}</M> (circumference) and width <M p=".">{t`\Delta r`}</M> Its area <M>{t`2\pi r\,\Delta r`}</M> compared with <M>{t`\pi r^2`}</M> gives <M p=":">{t`2\,\Delta r / r`}</M> the radius “counts twice”.</p>}
        />
        <RingFig />
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li><M>h</M> ist fest, also hängt <M>V</M> nur von <M>r</M> ab. Ableiten wie <M p=":">{t`x^2`}</M> <M p=".">{t`V'(r) = 2\pi r h`}</M></li>
              <li>Absoluter Fehler: <M p=".">{t`|\Delta V| \approx V'(r)\,|\Delta r| = 2\pi r h\,|\Delta r|`}</M></li>
              <li>Relativ: durch <M>{t`V = \pi r^2 h`}</M> teilen. <M>\pi</M> und <M>h</M> kürzen sich, ein <M>r</M> auch – es bleibt <M p=".">{t`2\,|\Delta r|/r`}</M> Den Radius selbst muss man gar nicht kennen.</li>
              <li>Exakt wären es <M p=":">{t`1{,}01^2 - 1 = 2{,}01\,\%`}</M> Die Tangente ist also sehr gut.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li><M>h</M> is fixed, so <M>V</M> depends on <M>r</M> only. Differentiate like <M p=":">{t`x^2`}</M> <M p=".">{t`V'(r) = 2\pi r h`}</M></li>
              <li>Absolute error: <M p=".">{t`|\Delta V| \approx V'(r)\,|\Delta r| = 2\pi r h\,|\Delta r|`}</M></li>
              <li>Relative: divide by <M p=".">{t`V = \pi r^2 h`}</M> <M>\pi</M> and <M>h</M> cancel, and so does one <M>r</M> – leaving <M p=".">{t`2\,|\Delta r|/r`}</M> You do not even need to know the radius.</li>
              <li>Exactly it would be <M p=":">{t`1.01^2 - 1 = 2.01\,\%`}</M> So the tangent is very good.</li>
            </ol>
          </>}
        />
        <Box kind="supplement" title={<T de={<>Faustregel für <M>{t`x^n`}</M></>} en={<>Rule of thumb for <M>{t`x^n`}</M></>} />}>
          <T
            de={<p>Für <M>{t`f(x) = x^n`}</M> ist <M p=",">{t`f'(x) = n x^{n-1}`}</M> also <M p=".">{t`r_f \approx \frac{n x^{n-1}|\Delta x|}{x^n} = n\,\frac{|\Delta x|}{x}`}</M> Quadrat: doppelter, Würfel (<M p="):">{t`x^3`}</M> dreifacher relativer Fehler. Wurzel (<M p="):">{t`n = \tfrac12`}</M> halber.</p>}
            en={<p>For <M>{t`f(x) = x^n`}</M> we have <M p=",">{t`f'(x) = n x^{n-1}`}</M> so <M p=".">{t`r_f \approx \frac{n x^{n-1}|\Delta x|}{x^n} = n\,\frac{|\Delta x|}{x}`}</M> Square: twice, cube (<M p="):">{t`x^3`}</M> three times the relative error. Square root (<M p="):">{t`n = \tfrac12`}</M> half.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="fehler-quader" title={<T de="5. Beispiel Quader" en="5. Example: box" />}>
        <Box kind="uebung" src={<Src u={5} p={2} />} title={<T de="Quader: Nur eine Seite schwankt" en={<>Box: only one side varies (<span lang="de">Quader: Nur eine Seite schwankt</span>)</>} />}>
          <MD>{t`a = 25,\quad b = 20,\quad c = 50,\quad |\Delta a| = 1`}</MD>
          <MD>{t`d(a) = \sqrt{a^2 + b^2 + c^2} \;\Rightarrow\; d'(a) = \frac{a}{\sqrt{a^2 + b^2 + c^2}} = \frac{a}{d}`}</MD>
          <MD>{c(t`d = \sqrt{3525} \approx 59{,}37, \qquad E_d \approx \frac{a}{d}\,|\Delta a| = \frac{25}{\sqrt{3525}}\cdot 1 \approx 0{,}421`)}</MD>
          <MD>{c(t`r_d \approx \frac{a\,|\Delta a|}{d^2} = \frac{25}{3525} \approx 0{,}709\,\%`)}</MD>
        </Box>
        <BoxDiagram />
        <T
          de={<>
            <p><b>So liest man die Rechnung:</b></p>
            <ol>
              <li><M>d</M> ist die Raumdiagonale (zweimal Pythagoras). Nur <M>a</M> schwankt, <M>b</M> und <M>c</M> sind feste Zahlen.</li>
              <li>Ableiten nach <M>a</M> mit der Kettenregel: Die äussere Wurzel gibt <M p=",">{t`\frac{1}{2\sqrt{\cdots}}`}</M> das Innere <M p=".">{t`2a`}</M> Die 2 kürzt sich: <M p=".">{t`d'(a) = a/d`}</M></li>
              <li><M p=".">{t`E_d \approx d'(a)\,|\Delta a| = \tfrac{25}{59{,}37} \approx 0{,}421`}</M> Exakt: <M p=".">{t`\sqrt{26^2 + 20^2 + 50^2} - \sqrt{3525} \approx 0{,}428`}</M></li>
              <li><M p=",">{t`r_d = E_d / d = \frac{a\,|\Delta a|}{d\cdot d}`}</M> darum steht <M>{t`d^2 = 3525`}</M> im Nenner – die Wurzel ist weg.</li>
            </ol>
            <p>Bemerkenswert: <M>a</M> schwankt um <M p=",">{t`1/25 = 4\,\%`}</M> die Diagonale nur um <M p=".">{t`0{,}7\,\%`}</M> Die lange Seite <M>c</M> «verdünnt» den Fehler.</p>
          </>}
          en={<>
            <p><b>How to read the calculation:</b></p>
            <ol>
              <li><M>d</M> is the space diagonal (Pythagoras twice). Only <M>a</M> varies; <M>b</M> and <M>c</M> are fixed numbers.</li>
              <li>Differentiate with respect to <M>a</M> by the chain rule: the outer root gives <M p=",">{t`\frac{1}{2\sqrt{\cdots}}`}</M> the inside <M p=".">{t`2a`}</M> The 2 cancels: <M p=".">{t`d'(a) = a/d`}</M></li>
              <li><M p=".">{t`E_d \approx d'(a)\,|\Delta a| = \tfrac{25}{59.37} \approx 0.421`}</M> Exactly: <M p=".">{t`\sqrt{26^2 + 20^2 + 50^2} - \sqrt{3525} \approx 0.428`}</M></li>
              <li><M p=",">{t`r_d = E_d / d = \frac{a\,|\Delta a|}{d\cdot d}`}</M> which is why <M>{t`d^2 = 3525`}</M> is in the denominator – the root is gone.</li>
            </ol>
            <p>Remarkable: <M>a</M> varies by <M p=",">{t`1/25 = 4\,\%`}</M> the diagonal only by <M p=".">{t`0.7\,\%`}</M> The long side <M>c</M> “dilutes” the error.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="fehler-merke" title={<T de="6. Typische Fehler und das Wichtigste" en="6. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`df`}</M> ist der exakte Fehler.»</>} en={<>“<M>{t`df`}</M> is the exact error.”</>} />}>
          <T de={<>Nein, nur eine Näherung über die Tangente. Exakt ist sie nur, wenn <M>f</M> linear ist (Rechteck). Beim Zylinder: <M>{t`2\,\%`}</M> genähert, <M>{t`2{,}01\,\%`}</M> exakt.</>} en={<>No, only an approximation via the tangent. It is exact only when <M>f</M> is linear (rectangle). For the cylinder: <M>{t`2\,\%`}</M> approximated, <M>{t`2.01\,\%`}</M> exact.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«1 % Messfehler gibt 1 % Fehler im Ergebnis.»" en="“A 1 % measurement error gives a 1 % error in the result.”" />}>
          <T de={<>Nur bei linearen Formeln wie <M p=".">{t`A = a b`}</M> Bei <M>{t`r^2`}</M> werden es <M p=",">{t`2\,\%`}</M> beim Quader nur <M p=".">{t`0{,}7\,\%`}</M> Entscheidend ist <M p=".">{t`f'(x)`}</M></>} en={<>Only for linear formulas like <M p=".">{t`A = a b`}</M> With <M>{t`r^2`}</M> it becomes <M p=";">{t`2\,\%`}</M> for the box only <M p=".">{t`0.7\,\%`}</M> What matters is <M p=".">{t`f'(x)`}</M></>} />
        </Box>
        <Box kind="misconception" title={<T de="«Relativer Fehler gleich absoluter Fehler in Prozent.»" en="“Relative error equals absolute error in per cent.”" />}>
          <T de={<>Nein: erst durch den Wert <M>{t`|f(x)|`}</M> teilen, dann mal 100. <M>{t`E_A = 0{,}3\ \mathrm m^2`}</M> ist nicht <M p=",">{t`0{,}3\,\%`}</M> sondern <M>{t`0{,}3/36 = 0{,}833\,\%`}</M> der Fläche.</>} en={<>No: first divide by the value <M p=",">{t`|f(x)|`}</M> then multiply by 100. <M>{t`E_A = 0.3\ \mathrm m^2`}</M> is not <M p=",">{t`0.3\,\%`}</M> but <M>{t`0.3/36 = 0.833\,\%`}</M> of the area.</>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=":">{t`\Delta f \approx df = f'(x)\,\Delta x`}</M> der Fehler läuft über die Tangente ins Ergebnis.</li>
              <li>Absolut <M p=",">{t`E_f \approx |f'(x)|\,|\Delta x|`}</M> relativ <M p=".">{t`r_f = E_f/|f(x)|`}</M></li>
              <li>Potenz <M p=":">{t`x^n`}</M> relativer Fehler ungefähr <M>n</M>-mal so gross.</li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`\Delta f \approx df = f'(x)\,\Delta x`}</M> the error travels into the result via the tangent.</li>
              <li>Absolute <M p=",">{t`E_f \approx |f'(x)|\,|\Delta x|`}</M> relative <M p=".">{t`r_f = E_f/|f(x)|`}</M></li>
              <li>Power <M p=":">{t`x^n`}</M> the relative error is about <M>n</M> times as large.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
