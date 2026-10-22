import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { NormalFigure, TangentZoom } from '../viz/ana/W4Figures';

const t = String.raw;

export default function A4Tangente() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die Ableitung <M>{t`f'(x_0)`}</M> ist die Steigung der Tangente (Lektion <a href="#ana-ableitung">Differenzenquotient und Ableitung</a>); ausrechnen kann man sie mit den <a href="#ana-ableitungsregeln">Ableitungsregeln</a>. Jetzt schreiben wir die Tangente selbst als Funktion hin – und die Normale, die senkrecht auf ihr steht.</p>}
        en={<p className="lede">The derivative <M>{t`f'(x_0)`}</M> is the slope of the tangent (lesson <a href="#ana-ableitung">Difference quotient and derivative</a>); it is computed with the <a href="#ana-ableitungsregeln">rules of differentiation</a>. Now we write down the tangent itself as a function – and the normal, which is perpendicular to it.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Die Erde ist eine Kugel, aber auf dem Fussballplatz sieht sie flach aus. Jede glatte Kurve ist so: Schaut man nahe genug hin, sieht sie aus wie eine Gerade. Diese Gerade ist die Tangente. Darum darf man in der Nähe von <M>{t`x_0`}</M> mit ihr statt mit der Kurve rechnen.</p>}
          en={<p>The Earth is a ball, but on a football pitch it looks flat. Every smooth curve is like that: look closely enough and it looks like a straight line. That line is the tangent. This is why near <M>{t`x_0`}</M> you may calculate with it instead of the curve.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="ersatzfunktion" title={<T de="1. Lineare Ersatzfunktion: die Tangente" en="1. Linear replacement function: the tangent" />}>
        <Box kind="uebung" src={<Src u={4} p={8} />} title={<T de={<>Lineare Ersatzfunktion <M>=</M> Tangenten</>} en={<><De en="linear replacement function">Lineare Ersatzfunktion</De> <M>=</M> tangents</>} />}>
          <T
            de={<p>Nahe bei <M>{t`x_0`}</M> ersetzen wir die Funktion durch ihre Tangente.</p>}
            en={<p>Near <M>{t`x_0`}</M> we replace the function by its tangent.</p>}
          />
          <MD>{t`t(x) = f(x_0) + f'(x_0)\cdot(x - x_0)`}</MD>
          <T de={<p>Bsp.</p>} en={<p>Example:</p>} />
          <MD>{t`f(x) = x^2,\ x_0 = 1: \qquad f(1) = 1,\quad f'(1) = 2`}</MD>
          <MD>{t`t(x) = 1 + 2(x - 1) = 2x - 1`}</MD>
          <T de={<p>Noch ein Bsp.</p>} en={<p>Another example:</p>} />
          <MD>{t`f(x) = \frac{1}{\sqrt{1+2x}} = (1+2x)^{-1/2}, \qquad x_0 = 4`}</MD>
          <T
            de={<p>Als Potenz schreiben. Dann Kettenregel. Hier: <M p=".">{t`x > -1/2`}</M></p>}
            en={<p>Write it as a power. Then the chain rule. Here: <M p=".">{t`x > -1/2`}</M></p>}
          />
          <MD>{t`f'(x) = -\frac{1}{2}(1+2x)^{-3/2}\cdot 2 = -\frac{1}{(1+2x)^{3/2}}`}</MD>
          <MD>{t`f(4) = \frac{1}{3}, \qquad f'(4) = -\frac{1}{27}`}</MD>
          <MD>{t`t(x) = \frac{1}{3} - \frac{1}{27}(x - 4) = \frac{13 - x}{27}`}</MD>
          <T
            de={<p>Bild: <M>f</M> (blau) fällt von <M>1</M> bei <M>{t`x = 0`}</M> langsam ab; die Tangente <M>t</M> (magenta) berührt sie in <M p=".">{t`P(4, \frac13)`}</M> Check: <M>{t`t(x_0) = f(x_0)`}</M> und <M p=".">{t`t'(x_0) = f'(x_0)`}</M></p>}
            en={<p>Figure: <M>f</M> (blue) falls slowly from <M>1</M> at <M p=";">{t`x = 0`}</M> the tangent <M>t</M> (magenta) touches it at <M p=".">{t`P(4, \frac13)`}</M> Check: <M>{t`t(x_0) = f(x_0)`}</M> and <M p=".">{t`t'(x_0) = f'(x_0)`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Formel:</b> <M>{t`t(x)`}</M> ist eine Gerade. Sie startet auf der Höhe <M>{t`f(x_0)`}</M> und steigt pro Einheit nach rechts um <M p=".">{t`f'(x_0)`}</M> <M>{t`x - x_0`}</M> ist der Weg von <M>{t`x_0`}</M> bis <M p=".">x</M> Darum stimmt der Check sofort: Bei <M>{t`x = x_0`}</M> ist <M p=",">{t`x - x_0 = 0`}</M> also <M p=".">{t`t(x_0) = f(x_0)`}</M> Und die Steigung einer Geraden ist die Zahl vor <M p=":">x</M> <M p=".">{t`f'(x_0)`}</M></p>
            <p>«Ersatzfunktion» heisst: Nahe bei <M>{t`x_0`}</M> ist <M p=".">{t`f(x) \approx t(x)`}</M> Zoom ins Bild und schau, wie die Lücke zwischen Kurve und Tangente verschwindet:</p>
          </>}
          en={<>
            <p><b>How to read the formula:</b> <M>{t`t(x)`}</M> is a straight line. It starts at height <M>{t`f(x_0)`}</M> and rises by <M>{t`f'(x_0)`}</M> per unit to the right. <M>{t`x - x_0`}</M> is the way from <M>{t`x_0`}</M> to <M p=".">x</M> This is why the check is immediate: at <M>{t`x = x_0`}</M> we have <M p=",">{t`x - x_0 = 0`}</M> so <M p=".">{t`t(x_0) = f(x_0)`}</M> And the slope of a line is the number in front of <M p=":">x</M> <M p=".">{t`f'(x_0)`}</M></p>
            <p>“Replacement function” means: near <M>{t`x_0`}</M> we have <M p=".">{t`f(x) \approx t(x)`}</M> Zoom into the figure and watch the gap between curve and tangent disappear:</p>
          </>}
        />
        <TangentZoom />
        <T
          de={<>
            <p><b>So liest man das zweite Beispiel:</b></p>
            <ol>
              <li>Die Wurzel im Nenner als Potenz: <M p=".">{t`\frac{1}{\sqrt{1+2x}} = (1+2x)^{-1/2}`}</M> Die Wurzel gibt es nur für <M p=",">{t`1 + 2x > 0`}</M> also <M p=".">{t`x > -\frac12`}</M></li>
              <li>Kettenregel: aussen <M>{t`u^{-1/2}`}</M> gibt <M p=",">{t`-\frac12 u^{-3/2}`}</M> innen <M>{t`u = 1+2x`}</M> hat die Ableitung <M p=".">2</M> Die <M>2</M> und das <M>{t`\frac12`}</M> kürzen sich.</li>
              <li>Einsetzen bei <M p=":">4</M> <M p=",">{t`1 + 2\cdot 4 = 9`}</M> <M p=",">{t`\sqrt9 = 3`}</M> also <M p=".">{t`f(4) = \frac13`}</M> Und <M p=",">{t`9^{3/2} = 3^3 = 27`}</M> also <M p=".">{t`f'(4) = -\frac1{27}`}</M></li>
              <li>In die Formel: <M p=".">{t`t(x) = \frac13 - \frac{1}{27}(x - 4)`}</M> Auf den Nenner <M>27</M> bringen: <M p=".">{t`\frac{9 - (x - 4)}{27} = \frac{13 - x}{27}`}</M></li>
              <li>Check: <M p={'\u00a0✓,'}>{t`t(4) = \frac{9}{27} = \frac13 = f(4)`}</M> Steigung <M p={'\u00a0✓.'}>{t`-\frac1{27} = f'(4)`}</M></li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the second example:</b></p>
            <ol>
              <li>The root in the denominator as a power: <M p=".">{t`\frac{1}{\sqrt{1+2x}} = (1+2x)^{-1/2}`}</M> The root exists only for <M p=",">{t`1 + 2x > 0`}</M> so <M p=".">{t`x > -\frac12`}</M></li>
              <li>Chain rule: outside, <M>{t`u^{-1/2}`}</M> gives <M p=";">{t`-\frac12 u^{-3/2}`}</M> inside, <M>{t`u = 1+2x`}</M> has derivative <M p=".">2</M> The <M>2</M> and the <M>{t`\frac12`}</M> cancel.</li>
              <li>Insert <M p=":">4</M> <M p=",">{t`1 + 2\cdot 4 = 9`}</M> <M p=",">{t`\sqrt9 = 3`}</M> so <M p=".">{t`f(4) = \frac13`}</M> And <M p=",">{t`9^{3/2} = 3^3 = 27`}</M> so <M p=".">{t`f'(4) = -\frac1{27}`}</M></li>
              <li>Into the formula: <M p=".">{t`t(x) = \frac13 - \frac{1}{27}(x - 4)`}</M> Common denominator <M p=":">27</M> <M p=".">{t`\frac{9 - (x - 4)}{27} = \frac{13 - x}{27}`}</M></li>
              <li>Check: <M p={'\u00a0✓,'}>{t`t(4) = \frac{9}{27} = \frac13 = f(4)`}</M> slope <M p={'\u00a0✓.'}>{t`-\frac1{27} = f'(4)`}</M></li>
            </ol>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="normale" title={<T de="2. Die Normale" en="2. The normal" />}>
        <Box kind="uebung" src={<Src u={4} p={9} />} title={<T de="Tipps zur Serie 4: Tangente und Normale" en={<>Tips for problem set 4: tangent and normal (<span lang="de">Tipps zur Serie 4</span>)</>} />}>
          <T
            de={<p>Bild (englisch beschriftet) «Tangente und Normale»: Kurve <M>{t`y = f(x)`}</M> (blau), Punkt <M p=",">P</M> Tangente (magenta) und Normale (grün) durch <M p=",">P</M> mit rechtem Winkel. Gleichungen:</p>}
            en={<p>Figure “Tangent and Normal Lines”: curve <M>{t`y = f(x)`}</M> (blue), point <M p=",">P</M> tangent (magenta) and normal (green) through <M p=",">P</M> with a right angle. “Equations”:</p>}
          />
          <T
            de={<><MD>{t`\text{Tangente: } y - y_0 = f'(x_0)(x - x_0)`}</MD><MD>{t`\text{Normale: } y - y_0 = -\frac{1}{f'(x_0)}(x - x_0)`}</MD></>}
            en={<><MD>{t`\text{Tangent line: } y - y_0 = f'(x_0)(x - x_0)`}</MD><MD>{t`\text{Normal line: } y - y_0 = -\frac{1}{f'(x_0)}(x - x_0)`}</MD></>}
          />
          <T
            de={<p>Aufgabe 3: Tangente bilden; Orthogonale Steigung bilden; Der Schnittpunkt durch Gleichsetzen beider Tangenten (Aufpassen: Flüchtigkeitsfehler!!!)</p>}
            en={<p>Problem 3: form the tangent; form the orthogonal slope; the intersection by setting both tangents equal (watch out: careless mistakes!!!)</p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>{t`y_0`}</M> ist <M p=".">{t`f(x_0)`}</M> Bringt man <M>{t`y_0`}</M> nach rechts, ist die Tangentengleichung genau <M p=".">{t`t(x)`}</M> Die <b>Normale</b> geht durch denselben Punkt, steht aber senkrecht auf der Tangente. Ihre Steigung ist <M p=":">{t`-\frac{1}{f'(x_0)}`}</M> der negative Kehrwert.</p>}
          en={<p><b>How to read it:</b> <M>{t`y_0`}</M> is <M p=".">{t`f(x_0)`}</M> Bring <M>{t`y_0`}</M> to the right and the tangent equation is exactly <M p=".">{t`t(x)`}</M> The <b>normal</b> passes through the same point but is perpendicular to the tangent. Its slope is <M p=":">{t`-\frac{1}{f'(x_0)}`}</M> the negative reciprocal.</p>}
        />
        <T
          de={<p><b>Warum der negative Kehrwert?</b> Das Steigungsdreieck der Tangente geht <M>{t`\Delta x`}</M> nach rechts und <M>{t`m\,\Delta x`}</M> nach oben. Dreht man es um <M p=",">{t`90^\circ`}</M> geht es <M>{t`m\,\Delta x`}</M> nach <em>links</em> und <M>{t`\Delta x`}</M> nach oben. Steigung: <M p=".">{t`\frac{\Delta x}{-m\,\Delta x} = -\frac1m`}</M> Die Farben im Bild zeigen, welche Seite wohin wandert.</p>}
          en={<p><b>Why the negative reciprocal?</b> The slope triangle of the tangent goes <M>{t`\Delta x`}</M> to the right and <M>{t`m\,\Delta x`}</M> up. Turn it by <M>{t`90^\circ`}</M> and it goes <M>{t`m\,\Delta x`}</M> to the <em>left</em> and <M>{t`\Delta x`}</M> up. Slope: <M p=".">{t`\frac{\Delta x}{-m\,\Delta x} = -\frac1m`}</M> The colours in the figure show which leg goes where.</p>}
        />
        <NormalFigure />
        <T
          de={<p><b>Beispiel</b> (<M>{t`x^2`}</M> bei <M p="):">{t`x_0 = 1`}</M> Tangente <M>{t`y = 2x - 1`}</M> mit Steigung <M p=",">2</M> also hat die Normale die Steigung <M p=":">{t`-\frac12`}</M> <M p=".">{t`y - 1 = -\frac12(x - 1)`}</M> Ein Sonderfall fehlt auf der Folie: Ist <M p=",">{t`f'(x_0) = 0`}</M> ist die Tangente waagrecht und die Normale die senkrechte Gerade <M>{t`x = x_0`}</M> – die Formel mit <M>{t`\frac{1}{f'(x_0)}`}</M> geht dann nicht (Regler im Bild auf <M p=").">0</M></p>}
          en={<p><b>Example</b> (<M>{t`x^2`}</M> at <M p="):">{t`x_0 = 1`}</M> tangent <M>{t`y = 2x - 1`}</M> with slope <M p=",">2</M> so the normal has slope <M p=":">{t`-\frac12`}</M> <M p=".">{t`y - 1 = -\frac12(x - 1)`}</M> One special case is missing on the slide: if <M p=",">{t`f'(x_0) = 0`}</M> the tangent is horizontal and the normal is the vertical line <M>{t`x = x_0`}</M> – the formula with <M>{t`\frac{1}{f'(x_0)}`}</M> does not work then (slider in the figure at <M p=").">0</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«<M p="»">{t`t(x) = f(x_0) + f'(x)(x - x_0)`}</M></>} en={<>“<M p="”">{t`t(x) = f(x_0) + f'(x)(x - x_0)`}</M></>} />}>
        <T
          de={<p>In der Tangente steht die <em>Zahl</em> <M p=",">{t`f'(x_0)`}</M> nicht die Funktion <M p=".">{t`f'(x)`}</M> Sonst ist <M>t</M> keine Gerade. Zuerst <M>{t`f'`}</M> ausrechnen, dann <M>{t`x_0`}</M> einsetzen, erst dann in die Formel.</p>}
          en={<p>The tangent contains the <em>number</em> <M p=",">{t`f'(x_0)`}</M> not the function <M p=".">{t`f'(x)`}</M> Otherwise <M>t</M> is not a straight line. First compute <M p=",">{t`f'`}</M> then insert <M p=",">{t`x_0`}</M> only then use the formula.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die Tangente berührt die Kurve nur in einem Punkt»" en="“The tangent touches the curve in one point only”" />}>
        <T
          de={<p>Das gilt beim Kreis, aber nicht allgemein. Die Tangente kann die Kurve weiter weg nochmals schneiden, und bei <M>{t`x^3`}</M> in <M>0</M> geht sie sogar mitten durch die Kurve. Entscheidend ist nur: gleicher Punkt und gleiche Steigung bei <M p=".">{t`x_0`}</M></p>}
          en={<p>That is true for a circle, but not in general. The tangent can cut the curve again further away, and for <M>{t`x^3`}</M> at <M>0</M> it even passes right through the curve. All that matters: same point and same slope at <M p=".">{t`x_0`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«Die Normale hat die Steigung <M>{t`-f'(x_0)`}</M> oder <M p="»">{t`\frac{1}{f'(x_0)}`}</M></>} en={<>“The normal has slope <M>{t`-f'(x_0)`}</M> or <M p="”">{t`\frac{1}{f'(x_0)}`}</M></>} />}>
        <T
          de={<p>Beides zusammen: Kehrwert <em>und</em> Minus. Probe: Das Produkt der beiden Steigungen muss <M>-1</M> sein, <M p={'\u00a0✓.'}>{t`2\cdot(-\frac12) = -1`}</M></p>}
          en={<p>Both together: reciprocal <em>and</em> minus. Test: the product of the two slopes must be <M p=",">-1</M> <M p={'\u00a0✓.'}>{t`2\cdot(-\frac12) = -1`}</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Die Tangente ist die lineare Ersatzfunktion: <M p=".">{t`t(x) = f(x_0) + f'(x_0)(x - x_0)`}</M></li>
            <li>Check: <M>{t`t(x_0) = f(x_0)`}</M> und <M p=".">{t`t'(x_0) = f'(x_0)`}</M> Nahe bei <M>{t`x_0`}</M> ist <M p=".">{t`f \approx t`}</M></li>
            <li>Normale: gleicher Punkt, Steigung <M>{t`-\frac{1}{f'(x_0)}`}</M> (bei <M>{t`f'(x_0) = 0`}</M> senkrecht).</li>
          </ul>}
          en={<ul>
            <li>The tangent is the linear replacement function: <M p=".">{t`t(x) = f(x_0) + f'(x_0)(x - x_0)`}</M></li>
            <li>Check: <M>{t`t(x_0) = f(x_0)`}</M> and <M p=".">{t`t'(x_0) = f'(x_0)`}</M> Near <M>{t`x_0`}</M> we have <M p=".">{t`f \approx t`}</M></li>
            <li>Normal: same point, slope <M>{t`-\frac{1}{f'(x_0)}`}</M> (vertical if <M p=").">{t`f'(x_0) = 0`}</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
