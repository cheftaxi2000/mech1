import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { EvenOdd, FunctionAnatomy, FunctionTypes, ImageExplorer, MonotoneFig, ReachProbe } from '../viz/ana/W2Figures';

const t = String.raw;

export default function A2Funktionen() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Nach den Folgen und <a href="#ana-reihen">Reihen</a> kommen die Funktionen. Eine Funktion ordnet jeder erlaubten Zahl <M>x</M> genau einen Wert zu. Zwei Fragen stehen im Zentrum: Welche <M>x</M> darf man einsetzen (<b>Definitionsbereich</b>)? Und welche Werte kommen wirklich heraus (<b>Bild</b>)?</p>}
        en={<p className="lede">After sequences and <a href="#ana-reihen">series</a> come functions. A function assigns exactly one value to every allowed number <M p=".">x</M> Two questions are central: which <M>x</M> may you put in (the <b>domain</b>)? And which values really come out (the <b>image</b>)?</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an einen Getränkeautomaten. Du drückst eine Taste (<M p=")">x</M> und bekommst genau ein Getränk (<M p=").">{t`f(x)`}</M> Nur die vorhandenen Tasten funktionieren – das ist der Definitionsbereich. Und nicht jedes Getränk der Welt kommt heraus, nur die eingefüllten – das ist das Bild.</p>}
          en={<p>Think of a drinks machine. You press a button (<M p=")">x</M> and get exactly one drink (<M p=").">{t`f(x)`}</M> Only the existing buttons work – that is the domain. And not every drink in the world comes out, only the ones filled in – that is the image.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="aufbau" title={<T de="1. Wie man eine Funktion aufschreibt" en="1. How a function is written" />}>
        <Box kind="uebung" src={<Src u={2} p={2} />} title={<T de="Funktionen" en={<>Functions (<span lang="de">Funktionen</span>)</>} />}>
          <MD>{t`f\colon (-1, 4] \to \mathbb{R}, \qquad x \mapsto 4x + 3`}</MD>
          <T
            de={<p>Jeder Teil ist auf der Folie farbig beschriftet: Funktionsname, Definitionsbereich <M>{t`\mathbb{D}`}</M> («Hier: <M p="»),">{t`-1 < x \le 4`}</M> Mengenpfeil, Zielbereich, Variable/Argument, Abbildungspfeil, Funktionswert.</p>}
            en={<p>On the slide every part is labelled in colour: function name, domain <M>{t`\mathbb{D}`}</M> («<span lang="de">Hier</span>: <M p="»),">{t`-1 < x \le 4`}</M> set arrow, target set, variable/argument, maps-to arrow, function value.</p>}
          />
        </Box>
        <FunctionAnatomy />
        <T
          de={<>
            <p><b>So liest man die Zeile:</b> «<M>f</M> bildet die Zahlen von <M>-1</M> (ohne) bis <M>4</M> (mit) in die reellen Zahlen ab; dabei geht <M>x</M> auf <M p="».">{t`4x+3`}</M></p>
            <ul>
              <li><M p=":">{t`(-1, 4]`}</M> Die runde Klammer heisst «<M>-1</M> gehört nicht dazu», die eckige «<M>4</M> gehört dazu». Also <M p=".">{t`-1 < x \le 4`}</M></li>
              <li><M>{t`\mathbb{R}`}</M> ist der <b>Zielbereich</b>: die Menge, in der die Werte liegen <em>dürfen</em>. Ob alle davon auch herauskommen, sagt er nicht.</li>
              <li>Zwei verschiedene Pfeile: <M>\to</M> steht zwischen zwei <em>Mengen</em>, <M>\mapsto</M> zwischen einer <em>Zahl</em> und ihrem Wert. Zum Beispiel <M p=".">{t`2 \mapsto 11`}</M></li>
            </ul>
          </>}
          en={<>
            <p><b>How to read the line:</b> “<M>f</M> maps the numbers from <M>-1</M> (excluded) to <M>4</M> (included) into the real numbers; <M>x</M> goes to <M p="”.">{t`4x+3`}</M></p>
            <ul>
              <li><M p=":">{t`(-1, 4]`}</M> the round bracket says “<M>-1</M> is not included”, the square one “<M>4</M> is included”. So <M p=".">{t`-1 < x \le 4`}</M></li>
              <li><M>{t`\mathbb{R}`}</M> is the <b>target set</b> (<De en="target set">Zielbereich</De>): the set in which the values <em>may</em> lie. It does not say whether all of them actually come out.</li>
              <li>Two different arrows: <M>\to</M> stands between two <em>sets</em>, <M>\mapsto</M> between a <em>number</em> and its value. For example <M p=".">{t`2 \mapsto 11`}</M></li>
            </ul>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bild" title={<T de="2. Das Bild: alle erreichbaren Werte" en="2. The image: all reachable values" />}>
        <Box kind="uebung" src={<Src u={2} p={2} />} title={<T de="Bild / Wertebereich" en={<>Image / range (<span lang="de">Bild / Wertebereich</span>)</>} />}>
          <T
            de={<p>Bild/Wertebereich: Alle «erreichbaren» Funktionswerte. Für <M>{t`f(x) = 4x + 3`}</M> mit <M>{t`\mathbb{D} = (-1, 4]`}</M> ist das der Wertebereich/das Bild <M p=".">{t`\mathbb{W}(f) = \mathrm{Im}(f) = (-1, 19]`}</M></p>}
            en={<p>Image/range: all “reachable” function values. For <M>{t`f(x) = 4x + 3`}</M> with <M>{t`\mathbb{D} = (-1, 4]`}</M> the range/image is <M p=".">{t`\mathbb{W}(f) = \mathrm{Im}(f) = (-1, 19]`}</M></p>}
          />
        </Box>
        <T
          de={<p><M>{t`\mathbb{W}`}</M> steht für <em>Wertebereich</em>, <M>{t`\mathrm{Im}`}</M> für <em>image</em> (Bild) – zwei Namen für dieselbe Menge. <b>Warum <M p="?">{t`(-1, 19]`}</M></b> <M>{t`4x+3`}</M> wächst stetig mit <M p=".">x</M> Das kleinste <M>x</M> gibt also den kleinsten Wert. Aber <M>{t`x = -1`}</M> ist ausgeschlossen, also wird <M>{t`4\cdot(-1)+3 = -1`}</M> nie erreicht – nur jeder Wert knapp darüber. <M>{t`x = 4`}</M> ist erlaubt und liefert <M p=",">19</M> darum die eckige Klammer.</p>}
          en={<p><M>{t`\mathbb{W}`}</M> stands for <De en="range">Wertebereich</De>, <M>{t`\mathrm{Im}`}</M> for image – two names for the same set. <b>Why <M p="?">{t`(-1, 19]`}</M></b> <M>{t`4x+3`}</M> grows steadily with <M p=".">x</M> So the smallest <M>x</M> gives the smallest value. But <M>{t`x = -1`}</M> is excluded, so <M>{t`4\cdot(-1)+3 = -1`}</M> is never reached – only every value just above it. <M>{t`x = 4`}</M> is allowed and gives <M p=",">19</M> hence the square bracket.</p>}
        />
        <Box kind="uebung" src={<Src u={2} p={3} />} title={<M>{t`f(x) = (x-4)^2, \quad \mathbb{D} = [2, 6)`}</M>}>
          <T
            de={<p>Handskizze: die Parabel mit Scheitel bei <M p=",">{t`(4, 0)`}</M> rechts ein pinker Doppelpfeil von <M>0</M> bis <M>4</M> und ein Zickzack dazwischen: «Alle Werte dazwischen werden erreicht <M>{t`\Rightarrow \mathbb{W}(f) = [0, 4]`}</M>».</p>}
            en={<p>Hand sketch: the parabola with vertex at <M p=",">{t`(4, 0)`}</M> on the right a pink double arrow from <M>0</M> to <M>4</M> and a zig-zag in between: «<span lang="de">Alle Werte dazwischen werden erreicht</span> <M>{t`\Rightarrow \mathbb{W}(f) = [0, 4]`}</M>» (all values in between are reached).</p>}
          />
        </Box>
        <ImageExplorer />
        <T
          de={<>
            <p><b>Das Überraschende:</b> <M>{t`\mathbb{D} = [2, 6)`}</M> ist rechts offen, das Bild <M>{t`[0, 4]`}</M> aber geschlossen. Der Wert <M>4</M> käme bei <M>{t`x = 6`}</M> heraus – das ist ausgeschlossen. Er kommt aber <em>schon</em> bei <M>{t`x = 2`}</M> heraus, und <M>2</M> gehört dazu. Ein Wert ist erreicht, sobald <em>ein</em> erlaubtes <M>x</M> ihn liefert.</p>
            <p><b>So findet man das Bild</b> einer Funktion ohne Sprung auf einem Intervall:</p>
            <ol>
              <li>Kleinsten und grössten Wert suchen: an den Enden oder am Scheitel (bei <M>{t`(x-4)^2`}</M> ist der Scheitel <M p=",">{t`x = 4`}</M> Wert <M p=").">0</M></li>
              <li>Für jedes Ende des Bildes prüfen: Liefert es ein <em>erlaubtes</em> <M p="?">x</M> Dann eckige Klammer, sonst runde.</li>
              <li>Alles dazwischen wird erreicht, weil der Graph keinen Sprung hat. Das ist der Zwischenwertsatz – er kommt in <a href="#ana-stetigkeit">Lücken, Sprünge und Zwischenwertsatz</a>.</li>
            </ol>
          </>}
          en={<>
            <p><b>The surprise:</b> <M>{t`\mathbb{D} = [2, 6)`}</M> is open on the right, but the image <M>{t`[0, 4]`}</M> is closed. The value <M>4</M> would come out at <M>{t`x = 6`}</M> – which is excluded. But it <em>already</em> comes out at <M p=",">{t`x = 2`}</M> and <M>2</M> is included. A value is reached as soon as <em>one</em> allowed <M>x</M> gives it.</p>
            <p><b>How to find the image</b> of a function without jumps on an interval:</p>
            <ol>
              <li>Find the smallest and largest value: at the ends or at the vertex (for <M>{t`(x-4)^2`}</M> the vertex is <M p=",">{t`x = 4`}</M> value <M p=").">0</M></li>
              <li>For each end of the image check: is it given by an <em>allowed</em> <M p="?">x</M> Then a square bracket, otherwise a round one.</li>
              <li>Everything in between is reached because the graph has no jump. That is the intermediate value theorem – it comes in <a href="#ana-stetigkeit">Gaps, jumps and the intermediate value theorem</a>.</li>
            </ol>
          </>}
        />
        <Box kind="misconception" title={<T de="«Offenes Ende im Definitionsbereich → offenes Ende im Bild»" en="“Open end in the domain → open end in the image”" />}>
          <T
            de={<p>Falsch, wie <M>{t`[2, 6) \to [0, 4]`}</M> zeigt. Massgebend ist nur, ob der Randwert von <em>irgendeinem</em> erlaubten <M>x</M> getroffen wird. Probiere im Bild <M p=":">{t`(4, 6)`}</M> Jetzt fehlen beide Enden, denn <M>0</M> käme nur bei <M>4</M> und <M>4</M> nur bei <M>6</M> heraus.</p>}
            en={<p>Wrong, as <M>{t`[2, 6) \to [0, 4]`}</M> shows. All that matters is whether the end value is hit by <em>some</em> allowed <M p=".">x</M> Try <M>{t`(4, 6)`}</M> in the figure: now both ends are missing, since <M>0</M> would only come from <M>4</M> and <M>4</M> only from <M p=".">6</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="Ist der Zielbereich das Bild?" en="Is the target set the image?" />}>
          <T
            de={<p>Nein. Der Zielbereich <M>{t`\mathbb{R}`}</M> sagt nur, <em>wo</em> die Werte liegen dürfen. Das Bild ist, was <em>tatsächlich</em> herauskommt – hier nur <M p=".">{t`[0, 4] \subset \mathbb{R}`}</M></p>}
            en={<p>No. The target set <M>{t`\mathbb{R}`}</M> only says <em>where</em> the values may lie. The image is what <em>actually</em> comes out – here only <M p=".">{t`[0, 4] \subset \mathbb{R}`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="beispiele" title={<T de="3. Beispiele: Lücken im Definitions- und im Wertebereich" en="3. Examples: gaps in the domain and in the range" />}>
        <Box kind="uebung" src={<Src u={2} p={3} />} title={<T de="Bsp." en={<>Examples (<span lang="de">Bsp.</span>)</>} />}>
          <MD>{t`f(x) = \frac{1}{x-3} \qquad \mathbb{D}(f) \in \mathbb{R}\setminus\{3\} \qquad \mathbb{W} \in \mathbb{R}\setminus\{0\}`}</MD>
          <MD>{t`g(x) = \frac{x-15}{\sqrt{x}-4} \qquad \mathbb{D}(f) \in \mathbb{R}^+\setminus\{16\} \qquad \mathbb{W} \in \mathbb{R}\setminus(6, 10)`}</MD>
          <T
            de={<p>Daneben die beiden Graphen aus einem Plotter: <M>f</M> mit Polstelle bei <M p=",">3</M> <M>g</M> mit Polstelle bei <M p=",">16</M> links ein flacher Buckel bei etwa <M p=",">6</M> rechts eine Mulde bei etwa <M p=".">10</M></p>}
            en={<p>Next to them the two graphs from a plotter: <M>f</M> with a pole at <M p=",">3</M> <M>g</M> with a pole at <M p=",">16</M> on the left a flat hump at about <M p=",">6</M> on the right a dip at about <M p=".">10</M></p>}
          />
        </Box>
        <T
          de={<>
            <p>Auf der Folie steht «<M>\in</M>»; gemeint ist «<M p="»:">=</M> Eine Menge <em>ist gleich</em> einer Menge (<M>\in</M> heisst «ist ein Element von»). Richtig also <M p=".">{t`\mathbb{D}(f) = \mathbb{R}\setminus\{3\}`}</M></p>
            <ul>
              <li><b>Definitionsbereich:</b> Bei <M>f</M> darf der Nenner nicht <M>0</M> werden, also <M p=".">{t`x \neq 3`}</M> Bei <M>g</M> braucht <M>{t`\sqrt{x}`}</M> ein <M p=",">{t`x \ge 0`}</M> und <M>{t`\sqrt{x} = 4`}</M> bei <M>{t`x = 16`}</M> ist verboten. Also <M p=".">{t`\mathbb{D}(g) = [0, \infty)\setminus\{16\}`}</M> <M>{t`x = 0`}</M> ist erlaubt: <M p=".">{t`g(0) = \frac{-15}{-4} = 3{,}75`}</M></li>
              <li><b>Bild von <M p=":">f</M></b> <M>{t`\frac{1}{x-3} = c`}</M> hat die Lösung <M>{t`x = 3 + \frac1c`}</M> – ausser für <M p=".">{t`c = 0`}</M> Ein Bruch mit Zähler <M>1</M> ist nie <M p=".">0</M></li>
              <li><b>Bild von <M p=":">g</M></b> Der linke Ast steigt höchstens bis <M>6</M> (bei <M p="),">{t`x = 9`}</M> der rechte fällt nur bis <M>10</M> (bei <M p=").">{t`x = 25`}</M> Werte zwischen <M>6</M> und <M>10</M> trifft keiner der Äste. Also <M p=".">{t`\mathbb{W}(g) = \mathbb{R}\setminus(6, 10)`}</M></li>
            </ul>
          </>}
          en={<>
            <p>The slide writes “<M p="”;">\in</M> it means “<M p="”:">=</M> a set <em>equals</em> a set (<M>\in</M> means “is an element of”). Correct is <M p=".">{t`\mathbb{D}(f) = \mathbb{R}\setminus\{3\}`}</M></p>
            <ul>
              <li><b>Domain:</b> for <M>f</M> the denominator must not be <M p=",">0</M> so <M p=".">{t`x \neq 3`}</M> For <M>g</M> the root <M>{t`\sqrt{x}`}</M> needs <M p=",">{t`x \ge 0`}</M> and <M>{t`\sqrt{x} = 4`}</M> at <M>{t`x = 16`}</M> is forbidden. So <M p=".">{t`\mathbb{D}(g) = [0, \infty)\setminus\{16\}`}</M> <M>{t`x = 0`}</M> is allowed: <M p=".">{t`g(0) = \frac{-15}{-4} = 3.75`}</M></li>
              <li><b>Image of <M p=":">f</M></b> <M>{t`\frac{1}{x-3} = c`}</M> has the solution <M>{t`x = 3 + \frac1c`}</M> – except for <M p=".">{t`c = 0`}</M> A fraction with numerator <M>1</M> is never <M p=".">0</M></li>
              <li><b>Image of <M p=":">g</M></b> the left branch rises at most to <M>6</M> (at <M p="),">{t`x = 9`}</M> the right one falls only to <M>10</M> (at <M p=").">{t`x = 25`}</M> Values between <M>6</M> and <M>10</M> are hit by neither branch. So <M p=".">{t`\mathbb{W}(g) = \mathbb{R}\setminus(6, 10)`}</M></li>
            </ul>
          </>}
        />
        <ReachProbe />
        <details className="more">
          <summary><T de={<>Warum genau <M>6</M> und <M p="?">10</M></>} en={<>Why exactly <M>6</M> and <M p="?">10</M></>} /></summary>
          <T
            de={<p>Setze <M>{t`s = \sqrt{x}`}</M> (also <M p=").">{t`x = s^2`}</M> Dann ist <M p=".">{t`g = \frac{s^2-15}{s-4}`}</M> Die Ableitung (kommt in <a href="#ana-ableitung">Woche 4</a>) ist <M p=";">{t`\frac{(s-3)(s-5)}{(s-4)^2}`}</M> sie ist null bei <M>{t`s = 3`}</M> und <M p=",">{t`s = 5`}</M> also bei <M>{t`x = 9`}</M> und <M p=".">{t`x = 25`}</M> Dort ist <M>{t`g(9) = \frac{-6}{-1} = 6`}</M> und <M p=".">{t`g(25) = \frac{10}{1} = 10`}</M></p>}
            en={<p>Put <M>{t`s = \sqrt{x}`}</M> (so <M p=").">{t`x = s^2`}</M> Then <M p=".">{t`g = \frac{s^2-15}{s-4}`}</M> Its derivative (coming in <a href="#ana-ableitung">week 4</a>) is <M p=";">{t`\frac{(s-3)(s-5)}{(s-4)^2}`}</M> it is zero at <M>{t`s = 3`}</M> and <M p=",">{t`s = 5`}</M> i.e. at <M>{t`x = 9`}</M> and <M p=".">{t`x = 25`}</M> There <M>{t`g(9) = \frac{-6}{-1} = 6`}</M> and <M p=".">{t`g(25) = \frac{10}{1} = 10`}</M></p>}
          />
        </details>
        <Box kind="uebung" src={<Src u={2} p={3} />} title={<T de="Thermometer und Barometer" en={<>Thermometer and barometer</>} />}>
          <T
            de={<>
              <p>Thermometer <M p=".">{t`\mathbb{R}^3 \to \mathbb{R}`}</M> Input: Punkt mit Koordinaten <M p=".">{t`(x, y, z)`}</M> Output: Temperatur in °C. <M p=".">{t`\mathbb{W} = [-273{,}15, \infty)`}</M></p>
              <p>Barometer: <M p=".">{t`[0, 10\,000\,\mathrm{m}] \to \mathbb{R}`}</M> Input: Höhe in m. Output: Druck in bar. <M p=".">{t`\mathbb{W} = (0, 1]`}</M></p>
            </>}
            en={<>
              <p>Thermometer <M p=".">{t`\mathbb{R}^3 \to \mathbb{R}`}</M> Input: a point with coordinates <M p=".">{t`(x, y, z)`}</M> Output: temperature in °C. <M p=".">{t`\mathbb{W} = [-273.15, \infty)`}</M></p>
              <p>Barometer: <M p=".">{t`[0, 10\,000\,\mathrm{m}] \to \mathbb{R}`}</M> Input: height in m. Output: pressure in bar. <M p=".">{t`\mathbb{W} = (0, 1]`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<p>Der Definitionsbereich muss keine Zahlenmenge auf einer Linie sein: Das Thermometer nimmt einen ganzen Punkt im Raum, also drei Zahlen, und gibt eine Zahl zurück. Beim Barometer ist <M>{t`(0, 1]`}</M> nur grob gemeint. Der Druck fällt ohne Sprung mit der Höhe, also ist das Bild ein geschlossenes Intervall: etwa <M>{t`1{,}01`}</M> bar am Boden bis etwa <M>{t`0{,}26`}</M> bar in <M>{t`10\,000`}</M> m, also <M p=".">{t`[0{,}26;\ 1{,}01]`}</M></p>}
          en={<p>The domain need not be a set of numbers on a line: the thermometer takes a whole point in space, i.e. three numbers, and returns one number. For the barometer, <M>{t`(0, 1]`}</M> is only meant roughly. The pressure falls with height without a jump, so the image is a closed interval: about <M>{t`1.01`}</M> bar at the ground down to about <M>{t`0.26`}</M> bar at <M>{t`10\,000`}</M> m, so <M p=".">{t`[0.26,\ 1.01]`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="arten" title={<T de="4. Arten von Funktionen" en="4. Kinds of functions" />}>
        <Box kind="uebung" src={<Src u={2} p={4} />} title={<T de="Arten von Funktionen" en={<>Kinds of functions (<span lang="de">Arten von Funktionen</span>)</>} />}>
          <T
            de={<ol>
              <li>Potenzfunktionen: <M>{t`f(x) = a\cdot x^n`}</M> mit <M p=".">{t`n, a \in \mathbb{R}`}</M></li>
              <li>Polynomfunktionen: <M>{t`f(x) = a_0 + a_1x + a_2x^2 + \dots + a_nx^n`}</M> mit <M p=".">{t`n \ge 0`}</M></li>
              <li>Rationale Funktionen: Quotient zweier Polynome.</li>
              <li>Trigonometrische Funktionen: <M>{t`f(x) = \sin(x)`}</M> oder <M p=".">{t`g(x) = \cos(x)`}</M></li>
              <li>Exponential-/Logarithmusfunktionen: <M p=";">{t`f(x) = a^x = e^{x\ln(a)}`}</M> <M p=".">{t`f(x) = \log_a(x) = \frac{\ln(x)}{\ln(a)}`}</M></li>
            </ol>}
            en={<ol>
              <li>Power functions: <M>{t`f(x) = a\cdot x^n`}</M> with <M p=".">{t`n, a \in \mathbb{R}`}</M></li>
              <li>Polynomial functions: <M>{t`f(x) = a_0 + a_1x + a_2x^2 + \dots + a_nx^n`}</M> with <M p=".">{t`n \ge 0`}</M></li>
              <li>Rational functions: quotient of two polynomials.</li>
              <li>Trigonometric functions: <M>{t`f(x) = \sin(x)`}</M> or <M p=".">{t`g(x) = \cos(x)`}</M></li>
              <li>Exponential/logarithmic functions: <M p=";">{t`f(x) = a^x = e^{x\ln(a)}`}</M> <M p=".">{t`f(x) = \log_a(x) = \frac{\ln(x)}{\ln(a)}`}</M></li>
            </ol>}
          />
        </Box>
        <FunctionTypes />
        <T
          de={<p>Gymnasiumsstoff – nur zwei Zeilen zum Lesen: <M>{t`a^x = e^{x\ln(a)}`}</M> gilt, weil <M>{t`a = e^{\ln(a)}`}</M> ist, also <M p=".">{t`a^x = (e^{\ln a})^x`}</M> Und <M>{t`\log_a(x) = \frac{\ln x}{\ln a}`}</M> heisst: Jeder Logarithmus ist der natürliche, nur mit einer Konstanten skaliert. Die rationale Funktion hat Polstellen, wo der Nenner null wird (violett gestrichelt).</p>}
          en={<p>High-school material – just two lines to read: <M>{t`a^x = e^{x\ln(a)}`}</M> holds because <M p=",">{t`a = e^{\ln(a)}`}</M> so <M p=".">{t`a^x = (e^{\ln a})^x`}</M> And <M>{t`\log_a(x) = \frac{\ln x}{\ln a}`}</M> says: every logarithm is the natural one, only scaled by a constant. The rational function has poles where the denominator becomes zero (purple, dashed).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="gerade" title={<T de="5. Gerade und ungerade Funktionen" en="5. Even and odd functions" />}>
        <Box kind="uebung" src={<Src u={2} p={4} />} title={<T de="Eigenschaften von Funktionen" en={<>Properties of functions (<span lang="de">Eigenschaften von Funktionen</span>)</>} />}>
          <T
            de={<p>Gerade Funktion: <M p=".">{t`f(x) = f(-x)`}</M> Ungerade Funktion: <M p=".">{t`f(-x) = -f(x)`}</M></p>}
            en={<p>Even function: <M p=".">{t`f(x) = f(-x)`}</M> Odd function: <M p=".">{t`f(-x) = -f(x)`}</M></p>}
          />
        </Box>
        <T
          de={<p>In Worten: <b>gerade</b> heisst, bei <M>-x</M> kommt <em>derselbe</em> Wert heraus wie bei <M>x</M> – der Graph ist an der <M>y</M>-Achse gespiegelt. <b>Ungerade</b> heisst, bei <M>-x</M> kommt der <em>Gegenwert</em> heraus – der Graph ist am Ursprung gespiegelt.</p>}
          en={<p>In words: <b>even</b> means at <M>-x</M> you get the <em>same</em> value as at <M>x</M> – the graph is mirrored at the <M>y</M>-axis. <b>Odd</b> means at <M>-x</M> you get the <em>opposite</em> value – the graph is mirrored through the origin.</p>}
        />
        <EvenOdd />
        <Box kind="misconception" title={<T de="«Jede Funktion ist gerade oder ungerade»" en="“Every function is even or odd”" />}>
          <T
            de={<p>Die meisten sind keins von beiden, etwa <M p=".">{t`0{,}3x^2 + 0{,}5x - 1`}</M> Und ist eine ungerade Funktion bei <M>0</M> definiert, gilt <M p=",">{t`f(0) = -f(0)`}</M> also <M p=".">{t`f(0) = 0`}</M> Darum ist <M>{t`x^3 + 1`}</M> nicht ungerade.</p>}
            en={<p>Most are neither, e.g. <M p=".">{t`0.3x^2 + 0.5x - 1`}</M> And if an odd function is defined at <M p=",">0</M> then <M p=",">{t`f(0) = -f(0)`}</M> so <M p=".">{t`f(0) = 0`}</M> That is why <M>{t`x^3 + 1`}</M> is not odd.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="monoton" title={<T de="6. Monotonie" en="6. Monotonicity" />}>
        <Box kind="uebung" src={<Src u={2} p={4} />} title={<T de="(Strikt) monoton" en={<>(Strictly) monotonic (<span lang="de">(strikt) monoton</span>)</>} />}>
          <T
            de={<p>(Strikt) monoton wachsend für alle <M p=":">{t`x_1 < x_2`}</M> <M>{t`f(x_1) \le f(x_2)`}</M> (bzw. <M p=").">{t`f(x_1) < f(x_2)`}</M> (Strikt) monoton fallend für alle <M p=":">{t`x_1 < x_2`}</M> <M>{t`f(x_1) \ge f(x_2)`}</M> (bzw. <M p=").">{t`f(x_1) > f(x_2)`}</M></p>}
            en={<p>(Strictly) increasing if for all <M p=":">{t`x_1 < x_2`}</M> <M>{t`f(x_1) \le f(x_2)`}</M> (or <M>{t`f(x_1) < f(x_2)`}</M> for strictly). (Strictly) decreasing if for all <M p=":">{t`x_1 < x_2`}</M> <M>{t`f(x_1) \ge f(x_2)`}</M> (or <M>{t`f(x_1) > f(x_2)`}</M> for strictly).</p>}
          />
        </Box>
        <T
          de={<p>«bzw.» heisst hier: Die Version in Klammern gehört zu «strikt». Monoton wachsend: Geht man nach rechts, geht es nie hinunter. Strikt: Es geht immer echt hinauf, kein flaches Stück.</p>}
          en={<p>The version in brackets belongs to “strictly”. Increasing: walking to the right, you never go down. Strictly: you always go really up, no flat piece.</p>}
        />
        <MonotoneFig />
        <Box kind="misconception" title={<T de={<><M>{t`\frac1x`}</M> ist monoton fallend?</>} en={<>Is <M>{t`\frac1x`}</M> decreasing?</>} />}>
          <T
            de={<p>Auf <M>{t`(-\infty, 0)`}</M> und auf <M>{t`(0, \infty)`}</M> je für sich: ja. Auf ganz <M p=":">{t`\mathbb{R}\setminus\{0\}`}</M> nein. «Für alle <M p="»">{t`x_1 < x_2`}</M> erlaubt auch <M>{t`x_1 = -1`}</M> und <M p=",">{t`x_2 = 1`}</M> und da ist <M p=".">{t`f(-1) = -1 < 1 = f(1)`}</M></p>}
            en={<p>On <M>{t`(-\infty, 0)`}</M> and on <M>{t`(0, \infty)`}</M> separately: yes. On all of <M p=":">{t`\mathbb{R}\setminus\{0\}`}</M> no. “For all <M p="”">{t`x_1 < x_2`}</M> also allows <M>{t`x_1 = -1`}</M> and <M p=",">{t`x_2 = 1`}</M> and there <M p=".">{t`f(-1) = -1 < 1 = f(1)`}</M></p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li><M p=";">{t`f\colon \mathbb{D} \to \text{Zielbereich},\ x \mapsto f(x)`}</M> <M>\to</M> zwischen Mengen, <M>\mapsto</M> zwischen Zahlen.</li>
              <li>Bild <M>{t`\mathbb{W}(f) = \mathrm{Im}(f)`}</M> = alle Werte, die ein <em>erlaubtes</em> <M>x</M> wirklich liefert. Ein Randwert gehört dazu, sobald ihn irgendein erlaubtes <M>x</M> trifft.</li>
              <li>Gerade: Spiegelung an der <M>y</M>-Achse. Ungerade: Spiegelung am Ursprung.</li>
              <li>Monoton: «für alle <M p="»">{t`x_1 < x_2`}</M> – zwei beliebige Stellen vergleichen, nicht nur benachbarte.</li>
            </ul>}
            en={<ul>
              <li><M p=";">{t`f\colon \mathbb{D} \to \text{target set},\ x \mapsto f(x)`}</M> <M>\to</M> between sets, <M>\mapsto</M> between numbers.</li>
              <li>Image <M>{t`\mathbb{W}(f) = \mathrm{Im}(f)`}</M> = all values that an <em>allowed</em> <M>x</M> really gives. An end value belongs to it as soon as some allowed <M>x</M> hits it.</li>
              <li>Even: mirror at the <M>y</M>-axis. Odd: mirror through the origin.</li>
              <li>Monotonic: “for all <M p="”">{t`x_1 < x_2`}</M> – compare any two places, not only neighbouring ones.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
