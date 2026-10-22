import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { ChainLines, InverseMirror, ProductArea } from '../viz/ana/W4Figures';

const t = String.raw;

export default function A4Regeln() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In der Lektion <a href="#ana-ableitung">Differenzenquotient und Ableitung</a> haben wir <M>{t`(x^2)' = 2x`}</M> mit dem Grenzwert ausgerechnet. Das macht niemand bei jeder Funktion. Man baut Funktionen aus Bausteinen zusammen und hat für jede Bauart eine Regel. Die Potenz- und Summenregel kennst du aus der Schule; Produkt, Kette und Umkehrfunktion verdienen einen genauen Blick.</p>}
        en={<p className="lede">In the lesson <a href="#ana-ableitung">Difference quotient and derivative</a> we computed <M>{t`(x^2)' = 2x`}</M> with the limit. Nobody does that for every function. Functions are built from pieces, and for every way of building there is a rule. The power and sum rules are known from school; product, chain and inverse deserve a close look.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="potenz" title={<T de="1. Potenzen und Summen" en="1. Powers and sums" />}>
        <Box kind="uebung" src={<Src u={4} p={4} />} title={<T de="Rechenregeln – Potenzen, Summe / Differenz" en={<>Rules – powers, sum / difference (<span lang="de">Rechenregeln</span>)</>} />}>
          <T
            de={<p>Hier sind <M>{t`u, v`}</M> differenzierbar. Potenzen: Exponent nach vorne, dann um <M>1</M> kleiner.</p>}
            en={<p>Here <M>{t`u, v`}</M> are differentiable. Powers: exponent to the front, then reduce it by <M p=".">1</M></p>}
          />
          <MD>{t`(ax^n)' = anx^{n-1}, \qquad (\mathrm{const})' = 0`}</MD>
          <T
            de={<p>Für reelle Exponenten: <M p=".">{t`x > 0`}</M> Polynome gehen auf ganz <M p=".">{t`\mathbb R`}</M></p>}
            en={<p>For real exponents: <M p=".">{t`x > 0`}</M> Polynomials work on all of <M p=".">{t`\mathbb R`}</M></p>}
          />
          <MD>{t`(6x^7)' = 6\cdot 7x^6 = 42x^6`}</MD>
          <MD>{t`\left(\frac{1}{x^2}\right)' = (x^{-2})' = -2x^{-3}, \qquad x \neq 0`}</MD>
          <T
            de={<p>Summe / Differenz: Jeden Term einzeln ableiten. Konstanten fallen weg, Vorfaktoren bleiben stehen.</p>}
            en={<p>Sum / difference: differentiate each term separately. Constants drop out, factors in front stay.</p>}
          />
          <MD>{t`(u \pm v)' = u' \pm v', \qquad (3x^5 + 2x - 7)' = 15x^4 + 2`}</MD>
        </Box>
        <T
          de={<p>Zwei Hinweise. <M>{t`\frac{1}{x^2}`}</M> schreibt man zuerst als Potenz <M p=",">{t`x^{-2}`}</M> dann gilt dieselbe Regel. Und «reelle Exponenten nur für <M p="»:">{t`x > 0`}</M> <M>{t`x^{1/2} = \sqrt x`}</M> ist für negative <M>x</M> gar nicht definiert. Die Konstante <M>-7</M> fällt weg, weil eine waagrechte Gerade die Steigung <M>0</M> hat.</p>}
          en={<p>Two remarks. First write <M>{t`\frac{1}{x^2}`}</M> as a power <M p=",">{t`x^{-2}`}</M> then the same rule applies. And “real exponents only for <M p="”:">{t`x > 0`}</M> <M>{t`x^{1/2} = \sqrt x`}</M> is not even defined for negative <M p=".">x</M> The constant <M>-7</M> drops out because a horizontal line has slope <M p=".">0</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="produkt" title={<T de="2. Produktregel" en="2. Product rule" />}>
        <Box kind="uebung" src={<Src u={4} p={4} />} title={<T de="Produkt" en={<>Product (<span lang="de">Produkt</span>)</>} />}>
          <MD>{t`(uv)' = u'v + uv'`}</MD>
          <MD>{t`f(x) = 4x^5(x^7 - x^2), \qquad f'(x) = 20x^4(x^7 - x^2) + 4x^5(7x^6 - 2x)`}</MD>
        </Box>
        <T
          de={<p><b>So liest man das Beispiel:</b> <M>{t`u = 4x^5`}</M> und <M p=".">{t`v = x^7 - x^2`}</M> Abgeleitet: <M>{t`u' = 20x^4`}</M> und <M p=".">{t`v' = 7x^6 - 2x`}</M> Dann «erster abgeleitet mal zweiter» plus «erster mal zweiter abgeleitet». Ausmultiplizieren muss man nicht.</p>}
          en={<p><b>How to read the example:</b> <M>{t`u = 4x^5`}</M> and <M p=".">{t`v = x^7 - x^2`}</M> Differentiated: <M>{t`u' = 20x^4`}</M> and <M p=".">{t`v' = 7x^6 - 2x`}</M> Then “first differentiated times second” plus “first times second differentiated”. No need to multiply out.</p>}
        />
        <Box kind="supplement" title={<T de={<>Warum <M>{t`u'v + uv'`}</M> und nicht <M p="?">{t`u'v'`}</M></>} en={<>Why <M>{t`u'v + uv'`}</M> and not <M p="?">{t`u'v'`}</M></>} />}>
          <T
            de={<p>Stell dir <M>{t`u\cdot v`}</M> als Fläche eines Rechtecks vor: Breite <M p=",">u</M> Höhe <M p=".">v</M> Wächst <M>x</M> um <M p=",">h</M> wird die Breite um <M>{t`\Delta u \approx u'h`}</M> grösser, die Höhe um <M p=".">{t`\Delta v \approx v'h`}</M> Neu dazu kommen zwei Streifen und ein kleines Eckchen:</p>}
            en={<p>Think of <M>{t`u\cdot v`}</M> as the area of a rectangle: width <M p=",">u</M> height <M p=".">v</M> When <M>x</M> grows by <M p=",">h</M> the width grows by <M p=",">{t`\Delta u \approx u'h`}</M> the height by <M p=".">{t`\Delta v \approx v'h`}</M> What is added: two strips and a small corner.</p>}
          />
          <ProductArea />
          <T
            de={<p>Teilt man den Zuwachs durch <M p=",">h</M> bleibt von den Streifen <M>{t`u'v`}</M> und <M p=".">{t`uv'`}</M> Das Eckchen ist <M>{t`u'h \cdot v'h`}</M> – durch <M>h</M> geteilt bleibt <M p=",">{t`u'v'\,h`}</M> und das geht gegen <M p=".">0</M> Genau das Produkt <M p=",">{t`u'v'`}</M> das man naiv erwarten würde, ist der Teil, der verschwindet.</p>}
            en={<p>Divide the growth by <M>h</M> and the strips leave <M>{t`u'v`}</M> and <M p=".">{t`uv'`}</M> The corner is <M>{t`u'h \cdot v'h`}</M> – divided by <M>h</M> it leaves <M p=",">{t`u'v'\,h`}</M> which goes to <M p=".">0</M> Exactly the product <M>{t`u'v'`}</M> one would naively expect is the part that vanishes.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="quotient" title={<T de="3. Quotientenregel" en="3. Quotient rule" />}>
        <Box kind="uebung" src={<Src u={4} p={5} />} title={<T de="Quotientenregel" en={<De en="quotient rule">Quotientenregel</De>} />}>
          <MD>{t`\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}, \qquad v \neq 0`}</MD>
          <MD>{t`f(x) = \frac{x^2}{x+1}, \qquad x \neq -1`}</MD>
          <MD>{t`f'(x) = \frac{2x(x+1) - x^2}{(x+1)^2} = \frac{x^2 + 2x}{(x+1)^2}`}</MD>
        </Box>
        <T
          de={<p><b>So liest man das:</b> Oben fast die Produktregel, aber mit Minus – darum zählt die Reihenfolge: zuerst <M p=",">{t`u'v`}</M> dann <M>{t`uv'`}</M> abziehen. Vertauscht man sie, stimmt das Vorzeichen nicht mehr. Unten das Quadrat des Nenners. Im Beispiel: <M p=",">{t`u = x^2`}</M> <M p=",">{t`u' = 2x`}</M> <M p=",">{t`v = x + 1`}</M> <M p=".">{t`v' = 1`}</M> Im Zähler <M>{t`2x^2 + 2x - x^2 = x^2 + 2x`}</M> zusammenfassen. <M>{t`x \neq -1`}</M> weil dort der Nenner <M>0</M> wäre.</p>}
          en={<p><b>How to read it:</b> on top almost the product rule, but with a minus – so the order matters: first <M p=",">{t`u'v`}</M> then subtract <M p=".">{t`uv'`}</M> Swap them and the sign is wrong. Below, the square of the denominator. In the example: <M p=",">{t`u = x^2`}</M> <M p=",">{t`u' = 2x`}</M> <M p=",">{t`v = x + 1`}</M> <M p=".">{t`v' = 1`}</M> Combine the numerator: <M p=".">{t`2x^2 + 2x - x^2 = x^2 + 2x`}</M> <M>{t`x \neq -1`}</M> because there the denominator would be <M p=".">0</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kette" title={<T de="4. Kettenregel" en="4. Chain rule" />}>
        <Box kind="uebung" src={<Src u={4} p={5} />} title={<T de="Kettenregel" en={<De en="chain rule">Kettenregel</De>} />}>
          <T
            de={<p>Aussen ableiten, innen stehen lassen. Dann mal innere Ableitung.</p>}
            en={<p>Differentiate the outside, leave the inside as it is. Then multiply by the inner derivative.</p>}
          />
          <MD>{t`\bigl(g(u(x))\bigr)' = g'(u(x))\,u'(x)`}</MD>
          <MD>{t`f(x) = (3x^2+5)^3`}</MD>
          <MD>{t`u = 3x^2 + 5,\quad u' = 6x, \qquad g(u) = u^3,\quad g'(u) = 3u^2`}</MD>
          <MD>{t`f'(x) = 3(3x^2+5)^2 \cdot 6x = 18x(3x^2+5)^2`}</MD>
          <MD>{t`\bigl(\tan(g(x))\bigr)' = \frac{1}{\cos^2(g(x))}\cdot g'(x)`}</MD>
          <T
            de={<p>Hier: <M p=".">{t`\cos(g(x)) \neq 0`}</M> Innere Ableitung nicht vergessen!</p>}
            en={<p>Here: <M p=".">{t`\cos(g(x)) \neq 0`}</M> Do not forget the inner derivative!</p>}
          />
        </Box>
        <Box kind="intuition">
          <T
            de={<p>Zwei Zahnräder: Dreht sich das mittlere Rad doppelt so schnell wie das erste, und das letzte dreimal so schnell wie das mittlere, dreht das letzte sechsmal so schnell wie das erste. Raten <b>multiplizieren</b> sich. <M>{t`u'(x)`}</M> sagt, wie schnell <M>u</M> mit <M>x</M> wächst; <M>{t`g'(u)`}</M> wie schnell <M>g</M> mit <M>u</M> wächst.</p>}
            en={<p>Two gears: if the middle wheel turns twice as fast as the first and the last one three times as fast as the middle one, the last turns six times as fast as the first. Rates <b>multiply</b>. <M>{t`u'(x)`}</M> says how fast <M>u</M> grows with <M p=";">x</M> <M>{t`g'(u)`}</M> how fast <M>g</M> grows with <M p=".">u</M></p>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Das Bild dazu: zweimal gestreckt" en="The picture: stretched twice" />}>
          <T
            de={<p>Drei Zahlengeraden für <M>{t`u = x^2`}</M> und <M>{t`g = u^2`}</M> (also <M p=")">{t`g = x^4`}</M> bei <M p=".">{t`x_0 = 1`}</M> Ein kleines Stück <M>{t`\Delta x`}</M> wird auf der <M>u</M>-Geraden etwa <M>{t`u'(1) = 2`}</M> mal so lang, auf der <M>g</M>-Geraden nochmals <M>{t`g'(1) = 2`}</M> mal.</p>}
            en={<p>Three number lines for <M>{t`u = x^2`}</M> and <M>{t`g = u^2`}</M> (so <M p=")">{t`g = x^4`}</M> at <M p=".">{t`x_0 = 1`}</M> A small piece <M>{t`\Delta x`}</M> becomes about <M>{t`u'(1) = 2`}</M> times as long on the <M>u</M>-line, and on the <M>g</M>-line again <M>{t`g'(1) = 2`}</M> times.</p>}
          />
          <ChainLines />
          <T
            de={<p>Die Bruchrechnung <M>{t`\frac{\Delta g}{\Delta x} = \frac{\Delta g}{\Delta u}\cdot\frac{\Delta u}{\Delta x}`}</M> ist exakt (man erweitert mit <M p=")">{t`\Delta u`}</M> Für <M>{t`\Delta x \to 0`}</M> wird daraus <M p=".">{t`g'(u(x))\cdot u'(x)`}</M> Wichtig: <M>{t`g'`}</M> wird an der Stelle <M>{t`u(x)`}</M> genommen, nicht bei <M>x</M> – darum «innen stehen lassen».</p>}
            en={<p>The fraction step <M>{t`\frac{\Delta g}{\Delta x} = \frac{\Delta g}{\Delta u}\cdot\frac{\Delta u}{\Delta x}`}</M> is exact (expand by <M p=").">{t`\Delta u`}</M> For <M>{t`\Delta x \to 0`}</M> it becomes <M p=".">{t`g'(u(x))\cdot u'(x)`}</M> Important: <M>{t`g'`}</M> is taken at <M p=",">{t`u(x)`}</M> not at <M>x</M> – hence “leave the inside as it is”.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Beispiel <M p=":">{t`(3x^2+5)^3`}</M></b></p>
            <ol>
              <li>Innen steht <M p=",">{t`u = 3x^2 + 5`}</M> aussen «hoch drei»: <M p=".">{t`g(u) = u^3`}</M></li>
              <li>Aussen ableiten, innen stehen lassen: <M p=".">{t`g'(u) = 3u^2 = 3(3x^2+5)^2`}</M></li>
              <li>Mal innere Ableitung <M p=".">{t`u' = 6x`}</M> Zusammen <M p=".">{t`3\cdot 6x = 18x`}</M></li>
            </ol>
          </>}
          en={<>
            <p><b>How to read the example <M p=":">{t`(3x^2+5)^3`}</M></b></p>
            <ol>
              <li>Inside is <M p=",">{t`u = 3x^2 + 5`}</M> outside “cubed”: <M p=".">{t`g(u) = u^3`}</M></li>
              <li>Differentiate the outside, leave the inside: <M p=".">{t`g'(u) = 3u^2 = 3(3x^2+5)^2`}</M></li>
              <li>Times the inner derivative <M p=".">{t`u' = 6x`}</M> Together <M p=".">{t`3\cdot 6x = 18x`}</M></li>
            </ol>
          </>}
        />
        <Box kind="uebung" src={<Src u={4} p={6} />} title={<T de="Bsp. mit Kettenregel, Produktregel, Quotientenregel" en="Examples with the chain, product and quotient rule" />}>
          <MD>{t`\bigl(\sin(5x^3)\bigr)' = \cos(5x^3)\cdot 15x^2`}</MD>
          <MD>{t`\bigl(5e^{x^2}\bigr)' = 5e^{x^2}\cdot 2x = 10xe^{x^2}`}</MD>
          <MD>{t`\bigl(5\ln(x^2+2)\bigr)' = 5\,\frac{2x}{x^2+2}`}</MD>
          <MD>{t`\bigl(x^2\sin(x)\bigr)' = 2x\sin(x) + x^2\cos(x)`}</MD>
          <MD>{t`\left(\frac{\sin(x)}{x}\right)' = \frac{x\cdot\cos(x) - \sin(x)}{x^2}, \qquad x \neq 0`}</MD>
        </Box>
        <T
          de={<p>Immer dasselbe Muster: <b>innen</b> <M p=",">{t`5x^3`}</M> <M p=",">{t`x^2`}</M> <M p=";">{t`x^2+2`}</M> <b>aussen</b> <M p=",">\sin</M> <M p=",">{t`e^{(\,)}`}</M> <M p=".">\ln</M> Die Ableitung von <M>\ln</M> ist «eins durch das Innere», also <M p=",">{t`\frac{1}{x^2+2}`}</M> mal innere Ableitung <M p=".">{t`2x`}</M> Der Vorfaktor <M>5</M> bleibt einfach stehen.</p>}
          en={<p>Always the same pattern: <b>inside</b> <M p=",">{t`5x^3`}</M> <M p=",">{t`x^2`}</M> <M p=";">{t`x^2+2`}</M> <b>outside</b> <M p=",">\sin</M> <M p=",">{t`e^{(\,)}`}</M> <M p=".">\ln</M> The derivative of <M>\ln</M> is “one over the inside”, so <M p=",">{t`\frac{1}{x^2+2}`}</M> times the inner derivative <M p=".">{t`2x`}</M> The factor <M>5</M> simply stays.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="spezialfaelle" title={<T de="5. Spezialfälle" en="5. Special cases" />}>
        <Box kind="uebung" src={<Src u={4} p={6} />} title={<T de="Spezialfälle" en={<>Special cases (<span lang="de">Spezialfälle</span>)</>} />}>
          <T
            de={<p>Winkel im Bogenmass! Bei einer Verkettung kommt die innere Ableitung dazu.</p>}
            en={<p>Angles in radians! For a composition the inner derivative is added.</p>}
          />
          <table className="w4-rules">
            <thead><tr><th><T de="Funktion" en="function" /></th><th><T de="Ableitung" en="derivative" /></th></tr></thead>
            <tbody>
              <tr><td><M>{t`\sin(g(x))`}</M></td><td><M>{t`\cos(g(x))\cdot g'(x)`}</M></td></tr>
              <tr><td><M>{t`\cos(g(x))`}</M></td><td><M>{t`-\sin(g(x))\cdot g'(x)`}</M></td></tr>
              <tr><td><M>{t`\tan(g(x))`}</M></td><td><M>{t`\frac{g'(x)}{\cos^2(g(x))} = g'(x) + \tan^2(g(x))\cdot g'(x)`}</M></td></tr>
              <tr><td><M>{t`\ln(g(x))`}</M></td><td><M>{t`\frac{g'(x)}{g(x)}`}</M></td></tr>
              <tr><td><M>{t`e^{g(x)}`}</M></td><td><M>{t`e^{g(x)}\cdot g'(x)`}</M></td></tr>
            </tbody>
          </table>
          <T
            de={<p>Beim Tangens: <M p=".">{t`\cos(g(x)) \neq 0`}</M> Beim Logarithmus: <M p=".">{t`g(x) > 0`}</M></p>}
            en={<p>For the tangent: <M p=".">{t`\cos(g(x)) \neq 0`}</M> For the logarithm: <M p=".">{t`g(x) > 0`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Warum zwei Formen beim Tangens?</b> Mit der Quotientenregel aus <M p=":">{t`\tan = \frac{\sin}{\cos}`}</M></p>
            <MD>{t`\tan' = \frac{\cos\cdot\cos - \sin\cdot(-\sin)}{\cos^2} = \frac{\cos^2 + \sin^2}{\cos^2}`}</MD>
            <p>Jetzt gibt es zwei Wege. Wegen <M>{t`\cos^2 + \sin^2 = 1`}</M> ist das <M p=".">{t`\frac{1}{\cos^2}`}</M> Oder man teilt den Bruch auf: <M p=".">{t`\frac{\cos^2}{\cos^2} + \frac{\sin^2}{\cos^2} = 1 + \tan^2`}</M> Die zweite Form braucht man gleich bei <M p=".">\arctan</M></p>
            <p><b>Warum Bogenmass?</b> <M>{t`\sin' = \cos`}</M> gilt nur, wenn der Winkel im Bogenmass gemessen wird. In Grad käme der Faktor <M>{t`\frac{\pi}{180}`}</M> dazu. <b>Warum <M p="?">{t`g > 0`}</M></b> Der Logarithmus ist nur für positive Zahlen definiert.</p>
          </>}
          en={<>
            <p><b>Why two forms for the tangent?</b> With the quotient rule from <M p=":">{t`\tan = \frac{\sin}{\cos}`}</M></p>
            <MD>{t`\tan' = \frac{\cos\cdot\cos - \sin\cdot(-\sin)}{\cos^2} = \frac{\cos^2 + \sin^2}{\cos^2}`}</MD>
            <p>Now there are two ways. Since <M p=",">{t`\cos^2 + \sin^2 = 1`}</M> this is <M p=".">{t`\frac{1}{\cos^2}`}</M> Or split the fraction: <M p=".">{t`\frac{\cos^2}{\cos^2} + \frac{\sin^2}{\cos^2} = 1 + \tan^2`}</M> The second form is needed in a moment for <M p=".">\arctan</M></p>
            <p><b>Why radians?</b> <M>{t`\sin' = \cos`}</M> holds only if the angle is measured in radians. In degrees a factor <M>{t`\frac{\pi}{180}`}</M> would appear. <b>Why <M p="?">{t`g > 0`}</M></b> The logarithm is defined only for positive numbers.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="umkehr-ableiten" title={<T de="6. Umkehrfunktion ableiten" en="6. Differentiating the inverse function" />}>
        <Box kind="uebung" src={<Src u={4} p={7} />} title={<T de="Umkehrfunktion ableiten" en={<>Differentiating the inverse (<span lang="de">Umkehrfunktion ableiten</span>)</>} />}>
          <MD>{t`(f^{-1})'(y) = \frac{1}{f'(f^{-1}(y))}`}</MD>
          <T
            de={<p><M>f</M> auf einem Intervall umkehrbar und differenzierbar; am inneren Punkt <M p=".">{t`f' \neq 0`}</M></p>}
            en={<p><M>f</M> invertible and differentiable on an interval; at the inner point <M p=".">{t`f' \neq 0`}</M></p>}
          />
          <T
            de={<p>Bsp. <M p=".">{t`f(x) = x^2 + 2,\ x \geq 0`}</M> Nur die rechte Hälfte nehmen! Sonst treffen zwei <M>x</M> denselben Wert.</p>}
            en={<p>Example: <M p=".">{t`f(x) = x^2 + 2,\ x \geq 0`}</M> Take only the right half! Otherwise two values of <M>x</M> hit the same value.</p>}
          />
          <MD>{t`f^{-1}(y) = \sqrt{y - 2},\ y \geq 2, \qquad f'(x) = 2x`}</MD>
          <MD>{t`(f^{-1})'(y) = \frac{1}{2f^{-1}(y)} = \frac{1}{2\sqrt{y-2}}, \qquad y > 2`}</MD>
          <T
            de={<p>Bsp. Tangens: <M p=",">{t`f(x) = \tan(x),\ -\frac{\pi}{2} < x < \frac{\pi}{2}`}</M> <M p=".">{t`f^{-1}(y) = \arctan(y),\ y \in \mathbb R`}</M></p>}
            en={<p>Example tangent: <M p=",">{t`f(x) = \tan(x),\ -\frac{\pi}{2} < x < \frac{\pi}{2}`}</M> <M p=".">{t`f^{-1}(y) = \arctan(y),\ y \in \mathbb R`}</M></p>}
          />
          <MD>{t`\bigl(\arctan(y)\bigr)' = \frac{1}{1 + \tan^2(\arctan(y))} = \frac{1}{1+y^2}`}</MD>
          <T
            de={<p><b>WICHTIG:</b> <M>{t`f^{-1}`}</M> ist die Umkehrfunktion, nicht <M p=".">{t`1/f`}</M></p>}
            en={<p><b>IMPORTANT:</b> <M>{t`f^{-1}`}</M> is the inverse function, not <M p=".">{t`1/f`}</M></p>}
          />
        </Box>
        <T
          de={<p><b>Die Idee:</b> Den Graphen von <M>{t`f^{-1}`}</M> bekommt man durch Spiegeln an der Geraden <M>{t`y = x`}</M> (Lektion <a href="#ana-umkehr">Umkehrfunktion</a>). Beim Spiegeln tauschen <M>x</M> und <M>y</M> ihre Plätze – also auch die beiden Seiten des Steigungsdreiecks. Aus «<M>{t`\Delta y`}</M> durch <M p="»">{t`\Delta x`}</M> wird «<M>{t`\Delta x`}</M> durch <M p="»:">{t`\Delta y`}</M> der Kehrwert. Schieb den Regler «spiegeln»:</p>}
          en={<p><b>The idea:</b> the graph of <M>{t`f^{-1}`}</M> is obtained by mirroring at the line <M>{t`y = x`}</M> (lesson <a href="#ana-umkehr">Inverse function</a>). Mirroring swaps <M>x</M> and <M>y</M> – and so the two legs of the slope triangle. “<M>{t`\Delta y`}</M> over <M p="”">{t`\Delta x`}</M> becomes “<M>{t`\Delta x`}</M> over <M p="”:">{t`\Delta y`}</M> the reciprocal. Move the slider “mirror”:</p>}
        />
        <InverseMirror />
        <T
          de={<>
            <p><b>So liest man die Formel:</b></p>
            <ol>
              <li>Gegeben ist ein Wert <M>y</M> der Umkehrfunktion. Zuerst zurück zum passenden <M p=":">x</M> <M p=".">{t`x = f^{-1}(y)`}</M></li>
              <li>Dort die Steigung von <M>f</M> nehmen: <M p=".">{t`f'(x)`}</M></li>
              <li>Kehrwert: <M p=".">{t`\frac{1}{f'(x)}`}</M> Das ist die Steigung von <M>{t`f^{-1}`}</M> bei <M p=".">y</M></li>
            </ol>
            <p><b>Warum <M p="?">{t`f' \neq 0`}</M></b> Eine waagrechte Tangente wird beim Spiegeln senkrecht – senkrechte Geraden haben keine Steigung (man müsste durch <M>0</M> teilen). Beim Beispiel ist <M p=":">{t`f'(0) = 0`}</M> darum <M>{t`y > 2`}</M> im Ergebnis, nicht <M p=".">{t`y \geq 2`}</M></p>
            <p><b>Beispiel <M p=":">\arctan</M></b> Hier ist <M p=",">{t`f = \tan`}</M> also <M>{t`f' = 1 + \tan^2`}</M> (zweite Form aus Abschnitt 5). An der Stelle <M>{t`\arctan(y)`}</M> eingesetzt: <M p=".">{t`1 + \tan^2(\arctan(y))`}</M> Und <M>{t`\tan(\arctan(y)) = y`}</M> – Umkehrfunktion und Funktion heben sich auf. Es bleibt <M p=".">{t`\frac{1}{1+y^2}`}</M></p>
          </>}
          en={<>
            <p><b>How to read the formula:</b></p>
            <ol>
              <li>Given a value <M>y</M> of the inverse function. First go back to the matching <M p=":">x</M> <M p=".">{t`x = f^{-1}(y)`}</M></li>
              <li>Take the slope of <M>f</M> there: <M p=".">{t`f'(x)`}</M></li>
              <li>Reciprocal: <M p=".">{t`\frac{1}{f'(x)}`}</M> That is the slope of <M>{t`f^{-1}`}</M> at <M p=".">y</M></li>
            </ol>
            <p><b>Why <M p="?">{t`f' \neq 0`}</M></b> A horizontal tangent becomes vertical when mirrored – vertical lines have no slope (one would divide by <M p=").">0</M> In the example <M p=":">{t`f'(0) = 0`}</M> hence <M>{t`y > 2`}</M> in the result, not <M p=".">{t`y \geq 2`}</M></p>
            <p><b>Example <M p=":">\arctan</M></b> here <M p=",">{t`f = \tan`}</M> so <M>{t`f' = 1 + \tan^2`}</M> (second form from section 5). Inserted at <M p=":">{t`\arctan(y)`}</M> <M p=".">{t`1 + \tan^2(\arctan(y))`}</M> And <M>{t`\tan(\arctan(y)) = y`}</M> – function and inverse cancel. What remains is <M p=".">{t`\frac{1}{1+y^2}`}</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«<M p="»">{t`(uv)' = u'v'`}</M></>} en={<>“<M p="”">{t`(uv)' = u'v'`}</M></>} />}>
        <T
          de={<p>Probe mit <M p=":">{t`x\cdot x = x^2`}</M> Richtig ist <M p=".">{t`(x^2)' = 2x`}</M> Aber <M>{t`u'v' = 1\cdot 1 = 1`}</M> – falsch. Im Flächenbild ist <M>{t`u'v'`}</M> das Eckchen, das verschwindet.</p>}
          en={<p>Test with <M p=":">{t`x\cdot x = x^2`}</M> the correct answer is <M p=".">{t`(x^2)' = 2x`}</M> But <M>{t`u'v' = 1\cdot 1 = 1`}</M> – wrong. In the area picture <M>{t`u'v'`}</M> is the corner that vanishes.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die innere Ableitung kann man weglassen»" en="“The inner derivative can be dropped”" />}>
        <T
          de={<p><M>{t`(\sin(5x^3))'`}</M> ist nicht <M p=".">{t`\cos(5x^3)`}</M> Der Faktor <M>{t`15x^2`}</M> sagt, wie schnell das Innere sich ändert – ohne ihn wäre z. B. die Steigung bei grossem <M>x</M> viel zu klein. Nur wenn das Innere einfach <M>x</M> ist, ist die innere Ableitung <M>1</M> und man sieht sie nicht.</p>}
          en={<p><M>{t`(\sin(5x^3))'`}</M> is not <M p=".">{t`\cos(5x^3)`}</M> The factor <M>{t`15x^2`}</M> says how fast the inside changes – without it the slope for large <M>x</M> would be far too small. Only when the inside is simply <M>x</M> is the inner derivative <M>1</M> and you do not see it.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{t`f^{-1}`}</M> ist <M p="»">{t`1/f`}</M></>} en={<>“<M>{t`f^{-1}`}</M> is <M p="”">{t`1/f`}</M></>} />}>
        <T
          de={<p>Die hochgestellte <M>-1</M> heisst hier «rückwärts», nicht «Kehrwert». Bei <M>{t`f(x) = x^2 + 2`}</M> ist <M p=",">{t`f^{-1}(3) = 1`}</M> aber <M p=".">{t`\frac{1}{f(3)} = \frac{1}{11}`}</M> Der Kehrwert kommt erst in der <em>Ableitung</em> vor: <M p=".">{t`\frac{1}{f'(\ldots)}`}</M></p>}
          en={<p>The superscript <M>-1</M> means “backwards” here, not “reciprocal”. For <M>{t`f(x) = x^2 + 2`}</M> we have <M p=",">{t`f^{-1}(3) = 1`}</M> but <M p=".">{t`\frac{1}{f(3)} = \frac{1}{11}`}</M> The reciprocal appears only in the <em>derivative</em>: <M p=".">{t`\frac{1}{f'(\ldots)}`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Bei der Quotientenregel ist die Reihenfolge egal»" en="“In the quotient rule the order does not matter”" />}>
        <T
          de={<p>Wegen des Minus nicht: <M>{t`u'v - uv'`}</M> und <M>{t`uv' - u'v`}</M> unterscheiden sich im Vorzeichen. Merkhilfe: «Ableitung oben zuerst».</p>}
          en={<p>Because of the minus it does: <M>{t`u'v - uv'`}</M> and <M>{t`uv' - u'v`}</M> differ in sign. Memory aid: “derivative of the top first”.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Produkt: <M p=";">{t`(uv)' = u'v + uv'`}</M> Quotient: <M p=".">{t`\left(\frac uv\right)' = \frac{u'v - uv'}{v^2}`}</M></li>
            <li>Kette: aussen ableiten, innen stehen lassen, mal innere Ableitung – Raten multiplizieren sich.</li>
            <li>Umkehrfunktion: Spiegeln tauscht <M>{t`\Delta x`}</M> und <M p=",">{t`\Delta y`}</M> also <M p=".">{t`(f^{-1})'(y) = \frac{1}{f'(f^{-1}(y))}`}</M></li>
            <li><M p=",">{t`\tan' = \frac{1}{\cos^2} = 1 + \tan^2`}</M> <M p=".">{t`\arctan'(y) = \frac{1}{1+y^2}`}</M></li>
          </ul>}
          en={<ul>
            <li>Product: <M p=";">{t`(uv)' = u'v + uv'`}</M> quotient: <M p=".">{t`\left(\frac uv\right)' = \frac{u'v - uv'}{v^2}`}</M></li>
            <li>Chain: differentiate outside, leave the inside, times inner derivative – rates multiply.</li>
            <li>Inverse: mirroring swaps <M>{t`\Delta x`}</M> and <M p=",">{t`\Delta y`}</M> so <M p=".">{t`(f^{-1})'(y) = \frac{1}{f'(f^{-1}(y))}`}</M></li>
            <li><M p=",">{t`\tan' = \frac{1}{\cos^2} = 1 + \tan^2`}</M> <M p=".">{t`\arctan'(y) = \frac{1}{1+y^2}`}</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
