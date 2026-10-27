import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CurvatureExplorer, Ex1Figure, Ex2Figure, LhPlot, MvtExplorer, MvtFigure } from '../viz/ana/Week5Figures';

const t = String.raw;

export default function A5Mittelwertsatz() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die Ableitung sagt, wie steil eine Funktion an <em>einer</em> Stelle ist. Diese Lektion holt daraus Aussagen über ein ganzes Intervall: Der <b>Mittelwertsatz</b> verbindet die mittlere Steigung mit einer Tangente, und mit <M>{t`f'`}</M> und <M>{t`f''`}</M> findet man Hochpunkte, Tiefpunkte und Wendepunkte.</p>}
        en={<p className="lede">The derivative tells how steep a function is at <em>one</em> point. This lesson turns that into statements about a whole interval: the <b>mean value theorem</b> links the average slope with a tangent, and <M>{t`f'`}</M> and <M>{t`f''`}</M> find maxima, minima and inflection points.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="mws" title={<T de="1. Der Mittelwertsatz" en="1. The mean value theorem" />}>
        <Box kind="uebung" src={<Src u={5} p={3} />} title={<T de="Mittelwertsatz" en={<De en="mean value theorem">Mittelwertsatz</De>} />}>
          <T de={<p>Sekante: mittlere Steigung. Irgendwo dazwischen passt eine Tangente. Falls <M>f</M> auf <M>{t`[a, b]`}</M> stetig und auf <M>{t`(a, b)`}</M> differenzierbar ist:</p>}
            en={<p>Secant: average slope. Somewhere in between a tangent fits. If <M>f</M> is continuous on <M>{t`[a, b]`}</M> and differentiable on <M p=":">{t`(a, b)`}</M></p>} />
          <MD>{t`a < b \;\Rightarrow\; \exists\, c \in (a, b):\quad f'(c) = \frac{f(b) - f(a)}{b - a}`}</MD>
        </Box>
        <Box kind="intuition">
          <T
            de={<p>Du fährst 120 km in genau einer Stunde. Dann zeigte der Tacho irgendwann <em>genau</em> 120 km/h – du kannst nicht immer langsamer und nie schneller gewesen sein. Die Durchschnittsgeschwindigkeit ist die Steigung der Sekante, der Tacho die Steigung der Tangente.</p>}
            en={<p>You drive 120 km in exactly one hour. Then at some moment the speedometer showed <em>exactly</em> 120 km/h – you cannot have been slower all the time and never faster. The average speed is the slope of the secant, the speedometer the slope of the tangent.</p>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man den Satz:</b> <M>{t`\exists\, c\in(a, b)`}</M> heisst «es gibt (mindestens) ein <M>c</M> zwischen <M>a</M> und <M p="».">b</M> Der Bruch rechts ist die Steigung der Sekante durch <M>{t`(a, f(a))`}</M> und <M p=".">{t`(b, f(b))`}</M> Also: Irgendwo dazwischen ist die Tangente parallel zur Sekante. Die Animation zeigt, warum – mit dem Beispiel der Übung.</p>}
          en={<p className="keep"><b>How to read the theorem:</b> <M>{t`\exists\, c\in(a, b)`}</M> means “there is (at least) one <M>c</M> between <M>a</M> and <M p="”.">b</M> The fraction on the right is the slope of the secant through <M>{t`(a, f(a))`}</M> and <M p=".">{t`(b, f(b))`}</M> So: somewhere in between the tangent is parallel to the secant. The animation shows why – with the example from the class.</p>}
        />
        <StepPlayer
          label={tr('Animation: Sekante parallel verschieben, bis sie die Parabel berührt', 'Animation: shift the secant parallel until it touches the parabola')}
          steps={[
            { ms: 1800, holdMs: 2500, caption: <T
              de={<>Die Sekante durch <M>{t`(1, 1)`}</M> und <M>{t`(3, 9)`}</M> hat die Steigung <M p=":">{t`m = 4`}</M> die mittlere Steigung von <M>{t`f(x) = x^2`}</M> auf <M p=".">{t`[1, 3]`}</M></>}
              en={<>The secant through <M>{t`(1, 1)`}</M> and <M>{t`(3, 9)`}</M> has slope <M p=":">{t`m = 4`}</M> the average slope of <M>{t`f(x) = x^2`}</M> on <M p=".">{t`[1, 3]`}</M></>} /> },
            { ms: 2200, holdMs: 2500, caption: <T
              de={<>Eine Gerade mit derselben Steigung wird nach unten geschoben. Sie schneidet die Kurve noch zweimal (graue Punkte).</>}
              en={<>A line with the same slope is pushed down. It still cuts the curve twice (grey points).</>} /> },
            { ms: 2200, holdMs: 3000, caption: <T
              de={<>Weiter, bis die beiden Schnittpunkte zusammenfallen. Jetzt berührt die Gerade die Kurve in <M p=":">{t`(2, 4)`}</M> eine Tangente, parallel zur Sekante.</>}
              en={<>Further, until the two cut points merge. Now the line touches the curve at <M p=":">{t`(2, 4)`}</M> a tangent, parallel to the secant.</>} /> },
            { ms: 1500, caption: <T
              de={<>Diese Stelle ist <M p=".">c</M> Rechnung: <M p=",">{t`f'(c) = 2c = 4`}</M> also <M p=".">{t`c = 2`}</M></>}
              en={<>This point is <M p=".">c</M> Calculation: <M p=",">{t`f'(c) = 2c = 4`}</M> so <M p=".">{t`c = 2`}</M></>} /> },
          ]}
        >
          {(step, tt) => <MvtFigure step={step} t={tt} />}
        </StepPlayer>
        <Box kind="uebung" src={<Src u={5} p={3} />} title={<T de="Bsp." en={<>Example (<span lang="de">Bsp.</span>)</>} />}>
          <MD>{t`f(x) = x^2,\qquad [a, b] = [1, 3]`}</MD>
          <MD>{t`m_{\text{Sekante}} = \frac{9 - 1}{3 - 1} = 4, \qquad f'(c) = 2c = 4 \;\Rightarrow\; c = 2`}</MD>
        </Box>
        <T
          de={<p><b>Warum die zwei Bedingungen?</b> <em>Stetig auf <M p="">{t`[a, b]`}</M></em>: keine Sprünge, auch nicht an den Enden – sonst sagt die Sekante nichts über die Kurve. <em>Differenzierbar auf <M p="">{t`(a, b)`}</M></em>: kein Knick dazwischen – sonst gibt es dort keine Tangente. An den Enden selbst braucht man keine Ableitung. Probiere im Bild den Knopf «Knick» aus.</p>}
          en={<p><b>Why the two conditions?</b> <em>Continuous on <M p="">{t`[a, b]`}</M></em>: no jumps, not even at the ends – otherwise the secant says nothing about the curve. <em>Differentiable on <M p="">{t`(a, b)`}</M></em>: no kink in between – otherwise there is no tangent there. At the ends themselves no derivative is needed. Try the “kink” button in the figure.</p>}
        />
        <MvtExplorer />
        <T
          de={<p>Der Satz sagt nur, <em>dass</em> es ein <M>c</M> gibt – nicht, wo. Bei <M>{t`x^3 - 3x`}</M> auf <M>{t`[-2, 2]`}</M> gibt es sogar zwei. Nur bei der Parabel liegt <M>c</M> immer genau in der Mitte: <M>{t`2c = \frac{b^2 - a^2}{b - a} = a + b`}</M> (dritte binomische Formel).</p>}
          en={<p>The theorem only says <em>that</em> a <M>c</M> exists – not where. For <M>{t`x^3 - 3x`}</M> on <M>{t`[-2, 2]`}</M> there are even two. Only for the parabola does <M>c</M> always lie exactly in the middle: <M>{t`2c = \frac{b^2 - a^2}{b - a} = a + b`}</M> (difference of squares).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="rolle" title={<T de="2. Der Satz von Rolle" en="2. Rolle’s theorem" />}>
        <Box kind="uebung" src={<Src u={5} p={3} />} title={<T de="Satz von Rolle" en={<>Rolle’s theorem (<span lang="de">Satz von Rolle</span>)</>} />}>
          <T de={<p>Gleiche Höhe ⇒ irgendwo waagerecht. Dieselben Bedingungen!</p>} en={<p>Equal heights ⇒ horizontal somewhere. The same conditions!</p>} />
          <MD>{t`f(a) = f(b) \;\Rightarrow\; \exists\, c\in(a, b):\; f'(c) = 0`}</MD>
        </Box>
        <T
          de={<p className="keep">Das ist der Mittelwertsatz mit <M p=":">{t`f(a) = f(b)`}</M> Dann ist der Zähler <M>{t`f(b) - f(a) = 0`}</M> und die Sekante waagerecht. Bild: Ein Ball wird hochgeworfen und auf derselben Höhe gefangen – im höchsten Punkt fliegt er kurz waagerecht. Im Bild oben: Knopf «Rolle». Beim Knopf «Knick» mit <M>{t`|x|`}</M> sind die Höhen gleich, aber es gibt keine waagerechte Tangente – weil <M>{t`|x|`}</M> bei <M>0</M> nicht differenzierbar ist.</p>}
          en={<p className="keep">This is the mean value theorem with <M p=".">{t`f(a) = f(b)`}</M> Then the numerator is <M>{t`f(b) - f(a) = 0`}</M> and the secant is horizontal. Picture: a ball is thrown up and caught at the same height – at the top it flies horizontally for an instant. In the figure above: button “Rolle”. With the “kink” button, <M p=",">{t`|x|`}</M> the heights are equal, but there is no horizontal tangent – because <M>{t`|x|`}</M> is not differentiable at <M p=".">0</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="extremum-wendepunkt" title={<T de="3. Extremum oder Wendepunkt?" en="3. Extremum or inflection point?" />}>
        <Box kind="uebung" src={<Src u={5} p={4} />} title={<T de="Extremum oder Wendepunkt?" en={<>Extremum or inflection point? (<span lang="de">Extremum oder Wendepunkt?</span>)</>} />}>
          <MD>{t`f' > 0:\ \nearrow \qquad\qquad f' < 0:\ \searrow`}</MD>
          <T de={<p>Waagerecht ist erst ein Kandidat! <M p=".">{t`f'(x_0) = 0`}</M> Falls <M>f</M> zweimal stetig differenzierbar ist:</p>} en={<p>Horizontal is only a candidate! <M p=".">{t`f'(x_0) = 0`}</M> If <M>f</M> is twice continuously differentiable:</p>} />
          <MD>{t`\begin{array}{l|l} f'(x_0) = 0 \;\&\; f''(x_0) > 0 & \text{${tr('lokales Minimum', 'local minimum')}} \\ f'(x_0) = 0 \;\&\; f''(x_0) < 0 & \text{${tr('lokales Maximum', 'local maximum')}} \\ f'(x_0) = 0 \;\&\; f''(x_0) = 0 & \text{${tr('noch keine Entscheidung', 'no decision yet')}} \end{array}`}</MD>
          <T de={<p>Alternativ: Vorzeichenwechsel von <M>{t`f'`}</M> prüfen. <M>f</M> sei bei <M>{t`x_0`}</M> stetig, daneben differenzierbar.</p>} en={<p>Alternatively: check the sign change of <M p=".">{t`f'`}</M> Let <M>f</M> be continuous at <M p=",">{t`x_0`}</M> differentiable next to it.</p>} />
          <MD>{t`+ \to -:\ \text{Maximum} \qquad\qquad - \to +:\ \text{Minimum}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li><M>{t`f' > 0`}</M> heisst: Die Tangente steigt, der Graph geht bergauf. <M>{t`f' < 0`}</M> bergab.</li>
              <li>Ganz oben auf einem Hügel und ganz unten in einem Tal ist die Tangente waagerecht: <M p=".">{t`f'(x_0) = 0`}</M> Aber umgekehrt gilt das nicht – auch eine flache Stufe hat eine waagerechte Tangente (<M>{t`x^3`}</M> bei <M p=").">0</M> Darum «erst ein Kandidat».</li>
              <li><M>{t`f''`}</M> ist die Steigung der Steigung. <M>{t`f'' > 0`}</M> heisst: Die Steigung nimmt zu, der Graph biegt nach oben wie ein Tal – also Minimum. <M>{t`f'' < 0`}</M> biegt nach unten: Maximum.</li>
              <li><M>{t`f''(x_0) = 0`}</M> sagt nichts: <M>{t`x^4`}</M> hat dort ein Minimum, <M>{t`x^3`}</M> gar nichts.</li>
              <li>Der Vorzeichenwechsel entscheidet immer: erst bergauf, dann bergab (<M p=")">{t`+\to-`}</M> ist ein Gipfel. Kein Wechsel: kein Extremum.</li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b></p>
            <ol className="keep">
              <li><M>{t`f' > 0`}</M> means: the tangent rises, the graph goes uphill. <M>{t`f' < 0`}</M> downhill.</li>
              <li>At the very top of a hill and at the very bottom of a valley the tangent is horizontal: <M p=".">{t`f'(x_0) = 0`}</M> But not the other way round – a flat step has a horizontal tangent as well (<M>{t`x^3`}</M> at <M p=").">0</M> Hence “only a candidate”.</li>
              <li><M>{t`f''`}</M> is the slope of the slope. <M>{t`f'' > 0`}</M> means: the slope increases, the graph bends upwards like a valley – so a minimum. <M>{t`f'' < 0`}</M> bends downwards: maximum.</li>
              <li><M>{t`f''(x_0) = 0`}</M> tells nothing: <M>{t`x^4`}</M> has a minimum there, <M>{t`x^3`}</M> nothing at all.</li>
              <li>The sign change always decides: first uphill, then downhill (<M p=")">{t`+\to-`}</M> is a summit. No change: no extremum.</li>
            </ol>
          </>}
        />
        <Box kind="uebung" src={<Src u={5} p={4} />} title={<T de="Krümmung" en={<>Curvature (<span lang="de">Krümmung</span>)</>} />}>
          <MD>{t`f' = 0 \;\&\; f'' > 0:\ \text{${tr('konvex', 'convex')}} \qquad\qquad f' = 0 \;\&\; f'' < 0:\ \text{${tr('konkav', 'concave')}}`}</MD>
          <T de={<p>Waagerechte Tangente dazu ⇒ Sattelpunkt. Krümmung wechselt ⇒ Wendepunkt.</p>} en={<p>Horizontal tangent in addition ⇒ saddle point. Curvature changes ⇒ inflection point.</p>} />
          <T de={<p>Drei Skizzen (<M p="),">{t`x^3,\ x^4,\ x^3 + x`}</M> magenta wo <M p=",">{t`f'' < 0`}</M> blau wo <M p=".">{t`f'' > 0`}</M></p>} en={<p>Three sketches (<M p="),">{t`x^3,\ x^4,\ x^3 + x`}</M> magenta where <M p=",">{t`f'' < 0`}</M> blue where <M p=".">{t`f'' > 0`}</M></p>} />
        </Box>
        <T
          de={<p><b>Achtung, eine Ungenauigkeit:</b> Für die Krümmung braucht man nur das Vorzeichen von <M p=":">{t`f''`}</M> <M>{t`f'' > 0`}</M> auf einem Intervall heisst konvex (Linkskurve, wie ein Lächeln), <M>{t`f'' < 0`}</M> konkav (Rechtskurve). Das <M>{t`f' = 0`}</M> auf der Folie gehört zum Extremum-Test oben, nicht zur Krümmung: <M>{t`x^2`}</M> ist überall konvex, nicht nur bei <M p=".">0</M></p>}
          en={<p><b>Careful, one imprecision:</b> for curvature only the sign of <M>{t`f''`}</M> matters. <M>{t`f'' > 0`}</M> on an interval means convex (left turn, like a smile), <M>{t`f'' < 0`}</M> concave (right turn). The <M>{t`f' = 0`}</M> on the slide belongs to the extremum test above, not to curvature: <M>{t`x^2`}</M> is convex everywhere, not only at <M p=".">0</M></p>}
        />
        <T
          de={<p>Im Bild siehst du alles zusammen: den Graphen, gefärbt nach dem Vorzeichen von <M p=",">{t`f''`}</M> darunter die Vorzeichen von <M>{t`f'`}</M> und <M p=".">{t`f''`}</M> Ziehe <M>{t`x_0`}</M> über die besonderen Stellen (es rastet dort ein).</p>}
          en={<p>The figure shows everything together: the graph, coloured by the sign of <M p=",">{t`f''`}</M> below it the signs of <M>{t`f'`}</M> and <M p=".">{t`f''`}</M> Drag <M>{t`x_0`}</M> across the special points (it snaps there).</p>}
        />
        <CurvatureExplorer />
        <T
          de={<p>Die Tabelle der Übung, Stelle <M p=":">{t`x = 0`}</M></p>}
          en={<p>The table from the class, at <M p=":">{t`x = 0`}</M></p>}
        />
        <MD>{t`\begin{array}{c|c|l} f(x) & f''(x) & \text{${tr('bei', 'at')} } x = 0 \\ \hline x^3 & 6x:\ - \to + & \text{${tr('Sattelpunkt', 'saddle point')}} \\ x^4 & 12x^2:\ + \to + & \text{${tr('kein Wendepunkt', 'no inflection point')}} \\ x^3 + x & 6x:\ - \to + & \text{${tr('Wendepunkt', 'inflection point')}},\ f'(0) = 1 \end{array}`}</MD>
        <T
          de={<p className="keep"><b>So liest man die Tabelle:</b> Wechselt <M>{t`f''`}</M> das Vorzeichen, wechselt die Krümmung – ein Wendepunkt. Ist die Tangente dort zusätzlich waagerecht, heisst er Sattelpunkt (<M p=").">{t`x^3`}</M> Bei <M>{t`x^4`}</M> ist zwar <M p=",">{t`f''(0) = 0`}</M> aber <M>{t`12x^2`}</M> bleibt positiv: kein Wechsel, kein Wendepunkt – sondern ein Minimum.</p>}
          en={<p className="keep"><b>How to read the table:</b> if <M>{t`f''`}</M> changes sign, the curvature changes – an inflection point. If the tangent there is also horizontal, it is called a saddle point (<M p=").">{t`x^3`}</M> For <M>{t`x^4`}</M> we do have <M p=",">{t`f''(0) = 0`}</M> but <M>{t`12x^2`}</M> stays positive: no change, no inflection point – a minimum instead.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="extremalstellen" title={<T de="4. Extremalstellen auf einem Intervall bestimmen" en="4. Finding the extrema on an interval" />}>
        <Box kind="uebung" src={<Src u={5} p={5} />} title={<T de="Extremalstellen bestimmen" en={<>Finding extrema (<span lang="de">Extremalstellen bestimmen</span>)</>} />}>
          <T de={<p>Stetiges <M>f</M> auf <M p=":">{t`[a, b]`}</M> Ränder, nicht ableitbare Stellen und <M>{t`f' = 0`}</M> prüfen. Dann Werte vergleichen.</p>}
            en={<p>Continuous <M>f</M> on <M p=":">{t`[a, b]`}</M> check the ends, the points where <M>f</M> is not differentiable and <M p=".">{t`f' = 0`}</M> Then compare the values.</p>} />
        </Box>
        <T
          de={<p className="keep">Warum genau diese Stellen? Der grösste Wert liegt entweder am Rand – oder innen. Liegt er innen und ist <M>f</M> dort ableitbar, muss die Tangente waagerecht sein (sonst ginge es daneben noch höher). Also bleiben nur: Ränder, Knicke, <M p=".">{t`f' = 0`}</M> Eine kurze Liste – man vergleicht einfach die Werte.</p>}
          en={<p className="keep">Why exactly these points? The largest value is either at an end – or inside. If it is inside and <M>f</M> is differentiable there, the tangent must be horizontal (otherwise it would go higher right next to it). So only these remain: ends, kinks, <M p=".">{t`f' = 0`}</M> A short list – you simply compare the values.</p>}
        />
        <Box kind="uebung" src={<Src u={5} p={5} />} title={<T de="Bsp. 1" en={<>Example 1 (<span lang="de">Bsp. 1</span>)</>} />}>
          <MD>{t`f(x) = x^3 - x, \qquad D_f = [-\tfrac12, 1]`}</MD>
          <MD>{t`f(-\tfrac12) = \tfrac38, \qquad f(1) = 0`}</MD>
          <MD>{t`f'(x) = 3x^2 - 1 = 0 \;\Rightarrow\; x = \pm\frac{1}{\sqrt3}`}</MD>
          <MD>{t`-\frac{1}{\sqrt3}\notin D_f, \qquad f\Big(\frac{1}{\sqrt3}\Big) = -\frac{2}{3\sqrt3}`}</MD>
          <MD>{t`\max(f) = \frac38 \text{ ${tr('bei', 'at')} } x = -\frac12, \qquad \min(f) = -\frac{2}{3\sqrt3} \text{ ${tr('bei', 'at')} } x = \frac{1}{\sqrt3}`}</MD>
        </Box>
        <StepPlayer
          label={tr('Animation: Kandidaten für Maximum und Minimum von x hoch 3 minus x auf dem Intervall', 'Animation: candidates for maximum and minimum of x cubed minus x on the interval')}
          steps={[
            { ms: 1200, holdMs: 2500, caption: <T
              de={<><M p=",">{t`f(x) = x^3 - x`}</M> aber nur auf <M>{t`D_f = [-\tfrac12, 1]`}</M> (Band). Nur dort wird gesucht.</>}
              en={<><M p=",">{t`f(x) = x^3 - x`}</M> but only on <M>{t`D_f = [-\tfrac12, 1]`}</M> (band). Only there do we search.</>} /> },
            { ms: 1200, holdMs: 2500, caption: <T
              de={<>Die Ränder: <M>{t`f(-\tfrac12) = -\tfrac18 + \tfrac12 = \tfrac38`}</M> und <M p=".">{t`f(1) = 0`}</M></>}
              en={<>The ends: <M>{t`f(-\tfrac12) = -\tfrac18 + \tfrac12 = \tfrac38`}</M> and <M p=".">{t`f(1) = 0`}</M></>} /> },
            { ms: 1200, holdMs: 3500, caption: <T
              de={<><M>{t`f' = 0`}</M> bei <M p=".">{t`\pm\tfrac{1}{\sqrt3} \approx \pm 0{,}58`}</M> Aber <M>{t`-0{,}58 < -0{,}5`}</M> liegt links vom Band: nicht erlaubt (hohl).</>}
              en={<><M>{t`f' = 0`}</M> at <M p=".">{t`\pm\tfrac{1}{\sqrt3} \approx \pm 0.58`}</M> But <M>{t`-0.58 < -0.5`}</M> lies left of the band: not allowed (hollow).</>} /> },
            { ms: 1200, caption: <T
              de={<>Werte vergleichen: Am grössten ist <M>{t`\tfrac38`}</M> am Rand (blau), am kleinsten <M>{t`-\tfrac{2}{3\sqrt3} \approx -0{,}385`}</M> (magenta).</>}
              en={<>Compare the values: the largest is <M>{t`\tfrac38`}</M> at the end (blue), the smallest <M>{t`-\tfrac{2}{3\sqrt3} \approx -0.385`}</M> (magenta).</>} /> },
          ]}
        >
          {(step, tt) => <Ex1Figure step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>Warum <M p="?">{t`f(\tfrac{1}{\sqrt3}) = -\tfrac{2}{3\sqrt3}`}</M></b> <M p=",">{t`(\tfrac{1}{\sqrt3})^3 = \tfrac{1}{3\sqrt3}`}</M> und <M p=".">{t`\tfrac{1}{\sqrt3} = \tfrac{3}{3\sqrt3}`}</M> Differenz: <M p=".">{t`\tfrac{1 - 3}{3\sqrt3}`}</M> Bemerkenswert: Der ausgeschlossene Punkt hätte den Wert <M p=",">{t`+\tfrac{2}{3\sqrt3} \approx 0{,}385`}</M> mehr als <M p=".">{t`\tfrac38`}</M> Er liegt aber ausserhalb – darum gewinnt der Rand.</p>}
          en={<p><b>Why <M p="?">{t`f(\tfrac{1}{\sqrt3}) = -\tfrac{2}{3\sqrt3}`}</M></b> <M p=",">{t`(\tfrac{1}{\sqrt3})^3 = \tfrac{1}{3\sqrt3}`}</M> and <M p=".">{t`\tfrac{1}{\sqrt3} = \tfrac{3}{3\sqrt3}`}</M> Difference: <M p=".">{t`\tfrac{1 - 3}{3\sqrt3}`}</M> Remarkable: the excluded point would have the value <M p=",">{t`+\tfrac{2}{3\sqrt3} \approx 0.385`}</M> more than <M p=".">{t`\tfrac38`}</M> But it lies outside – so the end wins.</p>}
        />
        <Box kind="uebung" src={<Src u={5} p={5} />} title={<T de="Bsp. 2" en={<>Example 2 (<span lang="de">Bsp. 2</span>)</>} />}>
          <MD>{t`g(x) = x^4 - x^2, \qquad D_g = [-2, 2]`}</MD>
          <MD>{t`g'(x) = 2x(2x^2 - 1) = 0 \;\Rightarrow\; x = 0,\ \pm\frac{1}{\sqrt2}`}</MD>
          <MD>{t`\max(g) = 12 \text{ ${tr('bei', 'at')} } x = \pm 2, \qquad \min(g) = -\frac14 \text{ ${tr('bei', 'at')} } x = \pm\frac{1}{\sqrt2}`}</MD>
          <T de={<p>Lokal: nur die Umgebung. Global: alle erlaubten Stellen. Bei <M>{t`x = 0`}</M> also nur lokal!</p>} en={<p>Local: only the neighbourhood. Global: all allowed points. So at <M>{t`x = 0`}</M> only local!</p>} />
        </Box>
        <StepPlayer
          label={tr('Animation: Kandidaten von x hoch 4 minus x hoch 2 auf minus 2 bis 2, dann Zoom um 0', 'Animation: candidates of x to the 4 minus x squared on minus 2 to 2, then zoom around 0')}
          steps={[
            { ms: 1800, holdMs: 3000, caption: <T
              de={<>Kandidaten: die Ränder <M>{t`\pm 2`}</M> und <M p=",">{t`g'(x) = 0`}</M> also <M p=".">{t`x = 0,\ \pm\tfrac{1}{\sqrt2}`}</M> Ihre Werte kommen in die Tabelle.</>}
              en={<>Candidates: the ends <M>{t`\pm 2`}</M> and <M p=",">{t`g'(x) = 0`}</M> so <M p=".">{t`x = 0,\ \pm\tfrac{1}{\sqrt2}`}</M> Their values go into the table.</>} /> },
            { ms: 1000, holdMs: 3000, caption: <T
              de={<>Vergleich: Maximum <M>12</M> an beiden Rändern (blau), Minimum <M>{t`-\tfrac14`}</M> bei <M>{t`\pm\tfrac{1}{\sqrt2}`}</M> (magenta).</>}
              en={<>Comparison: maximum <M>12</M> at both ends (blue), minimum <M>{t`-\tfrac14`}</M> at <M>{t`\pm\tfrac{1}{\sqrt2}`}</M> (magenta).</>} /> },
            { ms: 2500, caption: <T
              de={<>Zoom um <M p=":">0</M> Dort ist ein kleiner Hügel, ein lokales Maximum. Global ist es nicht, denn <M p=".">{t`0 < 12`}</M></>}
              en={<>Zoom around <M p=":">0</M> there is a small hill, a local maximum. It is not global, since <M p=".">{t`0 < 12`}</M></>} /> },
          ]}
        >
          {(step, tt) => <Ex2Figure step={step} t={tt} />}
        </StepPlayer>
        <T
          de={<p><b>So liest man <M p=":">{t`g'(x) = 2x(2x^2 - 1)`}</M></b> <M>{t`4x^3 - 2x`}</M> mit <M>{t`2x`}</M> ausgeklammert. Ein Produkt ist null, wenn ein Faktor null ist: <M>{t`2x = 0`}</M> gibt <M p=",">{t`x = 0`}</M> <M>{t`2x^2 - 1 = 0`}</M> gibt <M>{t`x^2 = \tfrac12`}</M> und <M p=".">{t`x = \pm\tfrac{1}{\sqrt2}`}</M> Dort ist <M p=".">{t`g = \tfrac14 - \tfrac12 = -\tfrac14`}</M></p>}
          en={<p><b>How to read <M p=":">{t`g'(x) = 2x(2x^2 - 1)`}</M></b> <M>{t`4x^3 - 2x`}</M> with <M>{t`2x`}</M> factored out. A product is zero when a factor is zero: <M>{t`2x = 0`}</M> gives <M p=";">{t`x = 0`}</M> <M>{t`2x^2 - 1 = 0`}</M> gives <M>{t`x^2 = \tfrac12`}</M> and <M p=".">{t`x = \pm\tfrac{1}{\sqrt2}`}</M> There <M p=".">{t`g = \tfrac14 - \tfrac12 = -\tfrac14`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="lhopital-beispiel" title={<T de="5. Bernoulli-L’Hôpital: ein Beispiel" en="5. Bernoulli–L’Hôpital: an example" />}>
        <Box kind="uebung" src={<Src u={5} p={6} />} title={<T de="Bernoulli-L’Hôpital" en="Bernoulli–L’Hôpital" />}>
          <MD>{t`\lim_{x\to a}\frac{f(x)}{g(x)} = \lim_{x\to a}\frac{f'(x)}{g'(x)}`}</MD>
          <MD>{t`\text{${tr('falls', 'if')}: } \lim_{x\to a} f(x) = 0 \text{ ${tr('und', 'and')} } \lim_{x\to a} g(x) = 0`}</MD>
          <MD>{t`\text{${tr('oder', 'or')} } \lim_{x\to a} f(x) = \pm\infty \text{ ${tr('und', 'and')} } \lim_{x\to a} g(x) = \pm\infty`}</MD>
          <T de={<p><b>Bsp. 1</b></p>} en={<p><b>Example 1</b> (<span lang="de">Bsp. 1</span>)</p>} />
          <MD>{t`\lim_{x\to\infty}\frac{\ln x}{e^{2x}} = \lim_{x\to\infty}\frac{1/x}{2e^{2x}} = \lim_{x\to\infty}\frac{1}{2x\,e^{2x}} = 0`}</MD>
          <MD>{t`\lim_{x\to\infty}\ln x = \infty, \qquad \lim_{x\to\infty} e^{2x} = \infty`}</MD>
        </Box>
        <T
          de={<p>Die Regel selbst steht in der Lektion <a href="#ana-grenzwerte-funktionen">Stetigkeit und Grenzwerte von Funktionen</a> – dort auch die fehlende Bedingung: Der Grenzwert von <M>{t`f'/g'`}</M> muss existieren. <b>So liest man das Beispiel:</b> 1. Prüfen: Zähler und Nenner gehen beide gegen <M>\infty</M> – die Regel darf man anwenden. 2. Getrennt ableiten (nicht Quotientenregel!): <M p=",">{t`(\ln x)' = 1/x`}</M> <M p=".">{t`(e^{2x})' = 2e^{2x}`}</M> 3. Den Doppelbruch auflösen: Der Nenner <M>{t`2x\,e^{2x}`}</M> wächst über alle Grenzen, also geht der Bruch gegen <M p=".">0</M></p>}
          en={<p>The rule itself is in the lesson <a href="#ana-grenzwerte-funktionen">Continuity and limits of functions</a> – together with the missing condition: the limit of <M>{t`f'/g'`}</M> must exist. <b>How to read the example:</b> 1. Check: numerator and denominator both go to <M>\infty</M> – the rule may be used. 2. Differentiate separately (not the quotient rule!): <M p=",">{t`(\ln x)' = 1/x`}</M> <M p=".">{t`(e^{2x})' = 2e^{2x}`}</M> 3. Resolve the double fraction: the denominator <M>{t`2x\,e^{2x}`}</M> grows beyond all bounds, so the fraction goes to <M p=".">0</M></p>}
        />
        <LhPlot />
        <T
          de={<p>Im Bild: <M>{t`\ln x`}</M> kriecht, <M>{t`e^{2x}`}</M> rast davon. Der Nenner gewinnt, der Quotient geht gegen <M p=".">0</M></p>}
          en={<p>In the picture: <M>{t`\ln x`}</M> crawls, <M>{t`e^{2x}`}</M> races away. The denominator wins; the quotient goes to <M p=".">0</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="mws-merke" title={<T de="6. Typische Fehler und das Wichtigste" en="6. Typical mistakes and the key points" />}>
        <Box kind="misconception" title={<T de={<>«<M>{t`f'(x_0) = 0`}</M> heisst Extremum.»</>} en={<>“<M>{t`f'(x_0) = 0`}</M> means extremum.”</>} />}>
          <T de={<>Nur ein Kandidat. <M>{t`x^3`}</M> hat bei <M>0</M> eine waagerechte Tangente, aber weder Hoch- noch Tiefpunkt – einen Sattelpunkt.</>} en={<>Only a candidate. <M>{t`x^3`}</M> has a horizontal tangent at <M p=",">0</M> but neither maximum nor minimum – a saddle point.</>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`f''(x_0) = 0`}</M> heisst Wendepunkt.»</>} en={<>“<M>{t`f''(x_0) = 0`}</M> means inflection point.”</>} />}>
          <T de={<>Nein. Ein Wendepunkt braucht einen <em>Vorzeichenwechsel</em> von <M p=".">{t`f''`}</M> <M>{t`x^4`}</M> hat <M p=",">{t`f''(0) = 0`}</M> aber ein Minimum.</>} en={<>No. An inflection point needs a <em>sign change</em> of <M p=".">{t`f''`}</M> <M>{t`x^4`}</M> has <M p=",">{t`f''(0) = 0`}</M> but a minimum.</>} />
        </Box>
        <Box kind="misconception" title={<T de="«Ein lokales Maximum ist der grösste Wert.»" en="“A local maximum is the largest value.”" />}>
          <T de={<>Nur in seiner Umgebung. Bei <M>{t`x^4 - x^2`}</M> ist <M>{t`x = 0`}</M> ein lokales Maximum mit Wert <M p=",">0</M> der grösste Wert auf <M>{t`[-2, 2]`}</M> ist <M p=".">12</M></>} en={<>Only in its neighbourhood. For <M>{t`x^4 - x^2`}</M> the point <M>{t`x = 0`}</M> is a local maximum with value <M p=";">0</M> the largest value on <M>{t`[-2, 2]`}</M> is <M p=".">12</M></>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«Nur <M>{t`f' = 0`}</M> prüfen reicht.»</>} en={<>“Checking <M>{t`f' = 0`}</M> is enough.”</>} />}>
          <T de={<>Die Ränder vergisst man leicht. In Bsp. 1 liegt das Maximum genau am Rand <M p=",">{t`x = -\tfrac12`}</M> wo <M>{t`f' \neq 0`}</M> ist.</>} en={<>The ends are easily forgotten. In example 1 the maximum lies exactly at the end <M p=",">{t`x = -\tfrac12`}</M> where <M p=".">{t`f' \neq 0`}</M></>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Mittelwertsatz: Irgendwo in <M>{t`(a, b)`}</M> ist die Tangente parallel zur Sekante. Rolle: gleiche Höhe ⇒ irgendwo waagerecht.</li>
              <li><M>{t`f' = 0`}</M> ist ein Kandidat. Entscheiden mit <M>{t`f''`}</M> (wenn <M p=")">{t`\neq 0`}</M> oder dem Vorzeichenwechsel von <M p=".">{t`f'`}</M></li>
              <li><M p=":">{t`f'' > 0`}</M> konvex, <M p=":">{t`f'' < 0`}</M> konkav. Vorzeichenwechsel von <M p=":">{t`f''`}</M> Wendepunkt.</li>
              <li>Auf <M p=":">{t`[a, b]`}</M> Ränder, Knicke und <M>{t`f' = 0`}</M> sammeln, Werte vergleichen.</li>
            </ul>}
            en={<ul>
              <li>Mean value theorem: somewhere in <M>{t`(a, b)`}</M> the tangent is parallel to the secant. Rolle: equal heights ⇒ horizontal somewhere.</li>
              <li><M>{t`f' = 0`}</M> is a candidate. Decide with <M>{t`f''`}</M> (if <M p=")">{t`\neq 0`}</M> or with the sign change of <M p=".">{t`f'`}</M></li>
              <li><M p=":">{t`f'' > 0`}</M> convex, <M p=":">{t`f'' < 0`}</M> concave. Sign change of <M p=":">{t`f''`}</M> inflection point.</li>
              <li>On <M p=":">{t`[a, b]`}</M> collect the ends, kinks and <M p=",">{t`f' = 0`}</M> compare the values.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
