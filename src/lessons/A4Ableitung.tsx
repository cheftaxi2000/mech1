import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { SecantFig, SidesFigure } from '../viz/ana/W4Figures';

const t = String.raw;

export default function A4Ableitung() {
  const tr = useTr();
  /** decimal comma in German, point in English */
  const d = (de: string) => tr(de, de.replace('{,}', '.'));
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wie steil ist ein Graph <em>an einer Stelle</em>? Für eine Gerade ist das klar: ihre Steigung. Für eine Kurve nimmt man zuerst eine Gerade durch zwei Punkte und schiebt dann den zweiten Punkt zum ersten. Was dabei herauskommt, heisst <b>Ableitung</b>. (Vorher: <a href="#ana-asymptoten">Asymptoten</a>.)</p>}
        en={<p className="lede">How steep is a graph <em>at one point</em>? For a straight line it is clear: its slope. For a curve you first take a line through two points and then push the second point towards the first. What comes out is the <b>derivative</b> (<span lang="de">Ableitung</span>). (Before: <a href="#ana-asymptoten">Asymptotes</a>.)</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Du fährst Auto. Zwischen zwei Blicken auf den Kilometerzähler vergehen 10 Minuten, du bist 15 km gefahren: im Schnitt 90 km/h. Das ist ein <b>Differenzenquotient</b> – Weg durch Zeit. Der Tacho zeigt etwas anderes: die Geschwindigkeit <em>jetzt</em>. Die bekommt man, wenn man die Zeitspanne immer kürzer macht. Das ist die <b>Ableitung</b>.</p>}
          en={<p>You are driving. Between two looks at the odometer 10 minutes pass and you covered 15 km: 90 km/h on average. That is a <b>difference quotient</b> – distance over time. The speedometer shows something else: the speed <em>now</em>. You get it by making the time span shorter and shorter. That is the <b>derivative</b>.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="differenzenquotient" title={<T de="1. Differenzenquotient: die Steigung der Sekante" en="1. Difference quotient: the slope of the secant" />}>
        <Box kind="uebung" src={<Src u={4} p={2} />} title={<T de="Differenzenquotient" en={<De en="difference quotient">Differenzenquotient</De>} />}>
          <T
            de={<p>Zeigt die mittlere Änderungsrate der Funktion über ein Intervall <M p=".">h</M></p>}
            en={<p>Shows the average rate of change of the function over an interval <M p=".">h</M></p>}
          />
          <MD>{t`m = \frac{\Delta y}{\Delta x} = \frac{f(x_0+h) - f(x_0)}{h}, \qquad h \neq 0`}</MD>
          <T
            de={<p>Sekante: Gerade durch beide Punkte. <M>h</M> ist die Änderung in <M>x</M>-Richtung. Bild: <M>{t`f(x) = x^2`}</M> mit <M>{t`P(1, 1)`}</M> und <M p=";">{t`Q(2, 4)`}</M> Sekante (blau gepunktet) <M p=",">{t`m = 3`}</M> Tangente (magenta) <M p=";">{t`m = 2`}</M> Steigungsdreieck <M p=",">{t`\Delta x = 1`}</M> <M p=".">{t`\Delta y = 3`}</M></p>}
            en={<p>Secant: line through both points. <M>h</M> is the change in the <M>x</M>-direction. Figure: <M>{t`f(x) = x^2`}</M> with <M>{t`P(1, 1)`}</M> and <M p=";">{t`Q(2, 4)`}</M> secant (blue dotted) <M p=",">{t`m = 3`}</M> tangent (magenta) <M p=";">{t`m = 2`}</M> slope triangle <M p=",">{t`\Delta x = 1`}</M> <M p=".">{t`\Delta y = 3`}</M></p>}
          />
          <T de={<p>Bsp.</p>} en={<p>Example:</p>} />
          <MD>{t`f(x) = x^2, \quad x_0 = 1: \qquad \frac{(1+h)^2 - 1}{h} = \frac{2h + h^2}{h} = 2 + h`}</MD>
          <table className="w4-table">
            <tbody>
              <tr><th><M>h</M></th>{['1', '0{,}5', '0{,}1', '0{,}01'].map((v) => <th key={v}><M>{d(v)}</M></th>)}</tr>
              <tr><th>{tr('Steigung', 'slope')}</th>{['3', '2{,}5', '2{,}1', '2{,}01'].map((v) => <td key={v}><M>{d(v)}</M></td>)}</tr>
            </tbody>
          </table>
          <MD>{t`h \to 0 \quad\Rightarrow\quad m \to 2`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Die Zeichen:</b> <M>{t`x_0`}</M> ist die Stelle, die uns interessiert, hier <M p=".">{t`x_0 = 1`}</M> <M>h</M> ist ein kleiner Schritt nach rechts (oder nach links, wenn <M p=").">{t`h < 0`}</M> Der zweite Punkt <M>Q</M> liegt bei <M p=".">{t`x_0 + h`}</M> Dann ist <M>{t`\Delta x = h`}</M> der Weg nach rechts und <M>{t`\Delta y = f(x_0+h) - f(x_0)`}</M> der Weg nach oben. Ihr Verhältnis ist die Steigung der Sekante. <M>{t`h \neq 0`}</M> muss sein, sonst teilt man durch null.</p>
            <p><b>So liest man das Beispiel:</b></p>
            <ol>
              <li>Ausmultiplizieren: <M p=".">{t`(1+h)^2 = 1 + 2h + h^2`}</M></li>
              <li>Minus <M p=":">{t`f(1) = 1`}</M> Im Zähler bleibt <M p=".">{t`2h + h^2`}</M></li>
              <li>Durch <M>h</M> kürzen – erlaubt, weil <M p=".">{t`h \neq 0`}</M> Es bleibt <M p=".">{t`2 + h`}</M></li>
              <li>Für die Tabelle setzt man <M>h</M> ein: <M>{t`2 + 1 = 3`}</M> bis <M p=".">{t`2 + 0{,}01 = 2{,}01`}</M> Je kleiner <M p=",">h</M> desto näher bei <M p=".">2</M></li>
            </ol>
            <p>Die Animation spielt genau diese Tabelle ab:</p>
          </>}
          en={<>
            <p><b>The symbols:</b> <M>{t`x_0`}</M> is the point we care about, here <M p=".">{t`x_0 = 1`}</M> <M>h</M> is a small step to the right (or to the left if <M p=").">{t`h < 0`}</M> The second point <M>Q</M> sits at <M p=".">{t`x_0 + h`}</M> Then <M>{t`\Delta x = h`}</M> is the way to the right and <M>{t`\Delta y = f(x_0+h) - f(x_0)`}</M> the way up. Their ratio is the slope of the secant. <M>{t`h \neq 0`}</M> is needed, otherwise we divide by zero.</p>
            <p><b>How to read the example:</b></p>
            <ol>
              <li>Multiply out: <M p=".">{t`(1+h)^2 = 1 + 2h + h^2`}</M></li>
              <li>Subtract <M p=":">{t`f(1) = 1`}</M> the numerator is <M p=".">{t`2h + h^2`}</M></li>
              <li>Cancel <M>h</M> – allowed because <M p=".">{t`h \neq 0`}</M> What remains is <M p=".">{t`2 + h`}</M></li>
              <li>For the table, insert <M p=":">h</M> <M>{t`2 + 1 = 3`}</M> down to <M p=".">{t`2 + 0.01 = 2.01`}</M> The smaller <M p=",">h</M> the closer to <M p=".">2</M></li>
            </ol>
            <p>The animation plays exactly this table:</p>
          </>}
        />
        <StepPlayer
          label={tr('Animation: Q rutscht auf der Parabel zu P, die Sekante wird zur Tangente', 'Animation: Q slides along the parabola towards P, the secant becomes the tangent')}
          steps={[
            { ms: 2200, holdMs: 3000, caption: <T
              de={<>Die Sekante (türkis) geht durch <M>{t`P(1, 1)`}</M> und <M p=".">{t`Q(2, 4)`}</M> Steigungsdreieck: <M>{t`\Delta x = 1`}</M> nach rechts, <M>{t`\Delta y = 3`}</M> nach oben. Also <M p=".">{t`m = 3`}</M></>}
              en={<>The secant (teal) passes through <M>{t`P(1, 1)`}</M> and <M p=".">{t`Q(2, 4)`}</M> Slope triangle: <M>{t`\Delta x = 1`}</M> to the right, <M>{t`\Delta y = 3`}</M> up. So <M p=".">{t`m = 3`}</M></>} /> },
            { ms: 2500, holdMs: 2500, caption: <T
              de={<><M>Q</M> rutscht zurück bis <M p=".">{t`h = 0{,}5`}</M> Die Sekante wird flacher: <M p=".">{t`m = 2{,}5`}</M></>}
              en={<><M>Q</M> slides back to <M p=".">{t`h = 0.5`}</M> The secant gets flatter: <M p=".">{t`m = 2.5`}</M></>} /> },
            { ms: 2500, holdMs: 2500, caption: <T
              de={<><M p=":">{t`h = 0{,}1`}</M> <M>Q</M> ist schon nahe bei <M p=".">P</M> Das Dreieck ist winzig, sein Verhältnis nicht: <M p=".">{t`m = 2{,}1`}</M></>}
              en={<><M p=":">{t`h = 0.1`}</M> <M>Q</M> is already close to <M p=".">P</M> The triangle is tiny, its ratio is not: <M p=".">{t`m = 2.1`}</M></>} /> },
            { ms: 2500, holdMs: 2500, caption: <T
              de={<><M p=":">{t`h = 0{,}01`}</M> <M>Q</M> liegt fast auf <M p=",">P</M> <M p=".">{t`m = 2{,}01`}</M> Die Sekante dreht sich kaum noch.</>}
              en={<><M p=":">{t`h = 0.01`}</M> <M>Q</M> almost sits on <M p=",">P</M> <M p=".">{t`m = 2.01`}</M> The secant hardly turns any more.</>} /> },
            { ms: 1800, caption: <T
              de={<>Die Gerade, der sich die Sekanten nähern, ist die Tangente (magenta). Ihre Steigung ist <M p=":">2</M> <M p=".">{t`h \to 0 \Rightarrow m \to 2`}</M></>}
              en={<>The line the secants approach is the tangent (magenta). Its slope is <M p=":">2</M> <M p=".">{t`h \to 0 \Rightarrow m \to 2`}</M></>} /> },
          ]}
        >
          {(step, tt) => <SecantFig step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="differentialquotient" title={<T de="2. Differentialquotient: die Ableitung" en="2. Differential quotient: the derivative" />}>
        <Box kind="uebung" src={<Src u={4} p={3} />} title={<T de={<>Differentialquotient <M>=</M> Differenzenquotient mit <M>\lim</M></>} en={<><De en="differential quotient">Differentialquotient</De> <M>=</M> difference quotient with <M>\lim</M></>} />}>
          <MD>{t`f'(x_0) = \lim_{h\to 0} \frac{f(x_0+h) - f(x_0)}{h}`}</MD>
          <T
            de={<p>Wenn es den Differentialquotienten in <M>h</M> gibt (d. h. der rechte und linke Grenzwert stimmen überein), so ist die Funktion <M>{t`f(x)`}</M> in <M>h</M> differenzierbar. Ist die Funktion <M>{t`f(x)`}</M> in <M>h</M> differenzierbar, so ist sie dort automatisch auch stetig.</p>}
            en={<p>If the differential quotient exists in <M>h</M> (i.e. the right and the left limit agree), the function <M>{t`f(x)`}</M> is differentiable in <M p=".">h</M> If the function <M>{t`f(x)`}</M> is differentiable in <M p=",">h</M> it is automatically continuous there as well.</p>}
          />
          <T de={<p>Bsp.</p>} en={<p>Example:</p>} />
          <MD>{t`f(x) = x^2: \qquad \frac{(x+h)^2 - x^2}{h} = \frac{2xh + h^2}{h} = 2x + h, \qquad f'(x) = \lim_{h\to 0}(2x + h) = 2x`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Was heisst <M p="?">\lim</M></b> <M>{t`\lim_{h\to0}`}</M> ist der Wert, dem der Differenzenquotient immer näher kommt, wenn <M>h</M> immer kleiner wird. Man setzt <M>{t`h = 0`}</M> <em>nicht</em> einfach ein – das gäbe <M p=".">{t`\frac{0}{0}`}</M> Man kürzt zuerst, dann darf <M>h</M> verschwinden.</p>
            <p>Auf der Folie steht «in <M>h</M> differenzierbar». Gemeint ist die <b>Stelle <M>{t`x_0`}</M></b>: <M>h</M> ist nur der Schritt, der gegen <M>0</M> geht.</p>
            <p><b>So liest man das Beispiel:</b> Statt <M>1</M> steht jetzt ein beliebiges <M p=".">x</M> Gleich wie oben: ausmultiplizieren, <M>{t`x^2`}</M> fällt weg, durch <M>h</M> kürzen. Übrig bleibt <M p=".">{t`2x + h`}</M> Jetzt geht <M>h</M> gegen <M p=",">0</M> und es bleibt <M p=".">{t`f'(x) = 2x`}</M> Bei <M>{t`x = 1`}</M> ist das die <M>2</M> aus der Tabelle.</p>
            <p><b>«Der rechte und linke Grenzwert stimmen überein»:</b> <M>h</M> darf auch negativ sein. Dann liegt <M>Q</M> links von <M p=".">P</M> Beide Wege müssen zur selben Zahl führen. Das zeigt das Bild im nächsten Abschnitt.</p>
          </>}
          en={<>
            <p><b>What does <M>\lim</M> mean?</b> <M>{t`\lim_{h\to0}`}</M> is the value the difference quotient gets closer and closer to as <M>h</M> gets smaller and smaller. You do <em>not</em> simply insert <M>{t`h = 0`}</M> – that would give <M p=".">{t`\frac{0}{0}`}</M> You cancel first, then <M>h</M> may disappear.</p>
            <p>The slide says “differentiable in <M p="”.">h</M> What is meant is the <b>point <M>{t`x_0`}</M></b>: <M>h</M> is only the step that goes to <M p=".">0</M></p>
            <p><b>How to read the example:</b> instead of <M>1</M> there is now any <M p=".">x</M> Same as above: multiply out, <M>{t`x^2`}</M> cancels, divide by <M p=".">h</M> What remains is <M p=".">{t`2x + h`}</M> Now <M>h</M> goes to <M p=",">0</M> and <M>{t`f'(x) = 2x`}</M> remains. At <M>{t`x = 1`}</M> this is the <M>2</M> of the table.</p>
            <p><b>“The right and the left limit agree”:</b> <M>h</M> may also be negative. Then <M>Q</M> lies to the left of <M p=".">P</M> Both ways must lead to the same number. The figure in the next section shows this.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="knick" title={<T de="3. Von links und von rechts – der Knick" en="3. From the left and from the right – the kink" />}>
        <Box kind="uebung" src={<Src u={4} p={3} />} title={<T de={<>Stetig <M>{t`\not\Rightarrow`}</M> differenzierbar!</>} en={<>Continuous <M>{t`\not\Rightarrow`}</M> differentiable!</>} />}>
          <T
            de={<p>Bild: <M>{t`f(x) = |x|`}</M> mit <M>{t`m_\text{links} = -1`}</M> (magenta) und <M>{t`m_\text{rechts} = +1`}</M> (blau), «Knick bei <M p="».">{t`x = 0`}</M></p>}
            en={<p>Figure: <M>{t`f(x) = |x|`}</M> with <M>{t`m_\text{links} = -1`}</M> (magenta) and <M>{t`m_\text{rechts} = +1`}</M> (blue), “kink at <M p="”.">{t`x = 0`}</M></p>}
          />
          <MD>{t`f(x) = |x|: \qquad \frac{f(h) - f(0)}{h} = \frac{|h|}{h}`}</MD>
          <MD>{t`\lim_{h\to 0^-}\frac{|h|}{h} = -1 \neq 1 = \lim_{h\to 0^+}\frac{|h|}{h}`}</MD>
          <T
            de={<p>Knick bei <M p=":">0</M> keine Ableitung. <b>differenzierbar <M>\Rightarrow</M> stetig</b> – nicht umgekehrt.</p>}
            en={<p>Kink at <M p=":">0</M> no derivative. <b>differentiable <M>\Rightarrow</M> continuous</b> – not conversely.</p>}
          />
        </Box>
        <T
          de={<p>Im Bild sitzen zwei Punkte gleich weit von <M>P</M> entfernt: <M>{t`Q_-`}</M> links (Sekante amber), <M>{t`Q_+`}</M> rechts (Sekante türkis). Schieb <M>h</M> gegen <M p=".">0</M> Bei der Parabel drehen beide Sekanten in dieselbe Gerade. Bei <M>{t`|x|`}</M> passiert nichts.</p>}
          en={<p>In the figure two points sit at the same distance from <M p=":">P</M> <M>{t`Q_-`}</M> on the left (amber secant), <M>{t`Q_+`}</M> on the right (teal secant). Slide <M>h</M> towards <M p=".">0</M> For the parabola both secants turn into the same line. For <M>{t`|x|`}</M> nothing happens.</p>}
        />
        <SidesFigure />
        <T
          de={<>
            <p><b>So liest man die Rechnung für <M p=":">{t`|x|`}</M></b></p>
            <ol>
              <li>Bei <M>{t`x_0 = 0`}</M> ist <M p=",">{t`f(0) = 0`}</M> also ist der Differenzenquotient <M p=".">{t`\frac{|h|}{h}`}</M></li>
              <li>Von rechts (<M p="):">{t`h > 0`}</M> <M p=",">{t`|h| = h`}</M> also <M p="">{t`\frac{h}{h} = 1`}</M> – für jedes noch so kleine <M p=".">h</M></li>
              <li>Von links (<M p="):">{t`h < 0`}</M> <M p=",">{t`|h| = -h`}</M> also <M p=".">{t`\frac{-h}{h} = -1`}</M></li>
              <li>Zwei verschiedene Werte. Es gibt keine Zahl, der beide näher kommen – also keine Ableitung in <M p=".">0</M></li>
            </ol>
            <p>Bei der Parabel dagegen ist links <M>{t`m = 2 - h`}</M> und rechts <M>{t`m = 2 + h`}</M> (die Zahlen unter dem Bild). Beide gehen gegen <M p=".">2</M></p>
          </>}
          en={<>
            <p><b>How to read the calculation for <M p=":">{t`|x|`}</M></b></p>
            <ol>
              <li>At <M>{t`x_0 = 0`}</M> we have <M p=",">{t`f(0) = 0`}</M> so the difference quotient is <M p=".">{t`\frac{|h|}{h}`}</M></li>
              <li>From the right (<M p="):">{t`h > 0`}</M> <M p=",">{t`|h| = h`}</M> so <M p="">{t`\frac{h}{h} = 1`}</M> – for every <M p=",">h</M> however small.</li>
              <li>From the left (<M p="):">{t`h < 0`}</M> <M p=",">{t`|h| = -h`}</M> so <M p=".">{t`\frac{-h}{h} = -1`}</M></li>
              <li>Two different values. There is no number both approach – so no derivative at <M p=".">0</M></li>
            </ol>
            <p>For the parabola, in contrast, the left slope is <M>{t`m = 2 - h`}</M> and the right one <M>{t`m = 2 + h`}</M> (the numbers below the figure). Both tend to <M p=".">2</M></p>
          </>}
        />
        <Box kind="supplement" title={<T de={<>Warum differenzierbar <M>\Rightarrow</M> stetig</>} en={<>Why differentiable <M>\Rightarrow</M> continuous</>} />}>
          <T
            de={<>
              <p>Stetig in <M>{t`x_0`}</M> heisst: <M>{t`f(x_0 + h)`}</M> kommt <M>{t`f(x_0)`}</M> beliebig nahe, wenn <M>h</M> gegen <M>0</M> geht. Schreib den Unterschied als Produkt:</p>
              <MD>{t`f(x_0+h) - f(x_0) = \underbrace{\frac{f(x_0+h) - f(x_0)}{h}}_{\to\, f'(x_0)} \cdot \underbrace{h}_{\to\, 0} \;\to\; f'(x_0)\cdot 0 = 0`}</MD>
              <p>Der erste Faktor nähert sich einer festen Zahl, der zweite <M p=".">0</M> Also geht der Unterschied gegen <M p=".">0</M> Umgekehrt geht es nicht: <M>{t`|x|`}</M> ist in <M>0</M> stetig (kein Sprung), hat dort aber einen Knick.</p>
            </>}
            en={<>
              <p>Continuous at <M>{t`x_0`}</M> means: <M>{t`f(x_0 + h)`}</M> gets arbitrarily close to <M>{t`f(x_0)`}</M> as <M>h</M> goes to <M p=".">0</M> Write the difference as a product:</p>
              <MD>{t`f(x_0+h) - f(x_0) = \underbrace{\frac{f(x_0+h) - f(x_0)}{h}}_{\to\, f'(x_0)} \cdot \underbrace{h}_{\to\, 0} \;\to\; f'(x_0)\cdot 0 = 0`}</MD>
              <p>The first factor approaches a fixed number, the second <M p=".">0</M> So the difference goes to <M p=".">0</M> The converse fails: <M>{t`|x|`}</M> is continuous at <M>0</M> (no jump) but has a kink there.</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«Ich setze einfach <M>{t`h = 0`}</M> ein»</>} en={<>“I simply insert <M p="”">{t`h = 0`}</M></>} />}>
        <T
          de={<p>Dann steht <M>{t`\frac{0}{0}`}</M> da – das ist keine Zahl. Zuerst umformen und <M>h</M> kürzen (wie <M p=")">{t`\frac{2h+h^2}{h} = 2+h`}</M> erst danach <M>h</M> gegen <M>0</M> gehen lassen.</p>}
          en={<p>Then you get <M>{t`\frac{0}{0}`}</M> – which is not a number. First rewrite and cancel <M>h</M> (as in <M p="),">{t`\frac{2h+h^2}{h} = 2+h`}</M> only then let <M>h</M> go to <M p=".">0</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Stetig, also differenzierbar»" en="“Continuous, so differentiable”" />}>
        <T
          de={<p>Nein. <M>{t`|x|`}</M> hat keinen Sprung, aber einen Knick: links Steigung <M p=",">-1</M> rechts <M p=".">+1</M> Nur die Richtung «differenzierbar <M>\Rightarrow</M> stetig» gilt.</p>}
          en={<p>No. <M>{t`|x|`}</M> has no jump but a kink: slope <M>-1</M> on the left, <M>+1</M> on the right. Only the direction “differentiable <M>\Rightarrow</M> continuous” holds.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Von rechts nachrechnen reicht»" en="“Checking from the right is enough”" />}>
        <T
          de={<p>Bei <M>{t`|x|`}</M> gäbe das <M>1</M> – eine falsche Ableitung. Die Ableitung existiert nur, wenn der Grenzwert von links <em>und</em> von rechts derselbe ist. Bei glatten Funktionen wie <M>{t`x^2`}</M> ist das automatisch so; bei Knicken und Beträgen muss man beide Seiten prüfen.</p>}
          en={<p>For <M>{t`|x|`}</M> that would give <M>1</M> – a wrong derivative. The derivative exists only if the limit from the left <em>and</em> from the right is the same. For smooth functions like <M>{t`x^2`}</M> this is automatic; at kinks and absolute values you have to check both sides.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Differenzenquotient <M>{t`\frac{f(x_0+h)-f(x_0)}{h}`}</M> = Steigung der Sekante (Durchschnitt).</li>
            <li>Ableitung <M>{t`f'(x_0)`}</M> = sein Grenzwert für <M>{t`h\to0`}</M> = Steigung der Tangente (Tacho).</li>
            <li>Von links und von rechts muss derselbe Wert herauskommen; bei einem Knick nicht.</li>
            <li>differenzierbar <M>\Rightarrow</M> stetig, nicht umgekehrt.</li>
          </ul>}
          en={<ul>
            <li>Difference quotient <M>{t`\frac{f(x_0+h)-f(x_0)}{h}`}</M> = slope of the secant (average).</li>
            <li>Derivative <M>{t`f'(x_0)`}</M> = its limit for <M>{t`h\to0`}</M> = slope of the tangent (speedometer).</li>
            <li>The left and the right side must give the same value; at a kink they do not.</li>
            <li>differentiable <M>\Rightarrow</M> continuous, not conversely.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
