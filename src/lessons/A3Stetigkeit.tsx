import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { BisectPlot, IntervalStrip, IvtFigure, LimitExplorer } from '../viz/ana/W3Figures';

const t = String.raw;

export default function A3Stetigkeit() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In <a href="#ana-grenzwerte-funktionen">Stetigkeit und Grenzwerte von Funktionen</a> ging es darum, wohin eine Funktion läuft. Jetzt wird daraus ein Werkzeug: Wo ein Graph keinen Sprung macht, muss er jede Höhe dazwischen treffen – der <b>Zwischenwertsatz</b>.</p>}
        en={<p className="lede">In <a href="#ana-grenzwerte-funktionen">Continuity and limits of functions</a> we asked where a function is heading. Now this becomes a tool: where a graph makes no jump, it must hit every height in between – the <b>intermediate value theorem</b> (<span lang="de">Zwischenwertsatz</span>).</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="stetig" title={<T de="1. Stetig: ohne Absetzen zeichnen" en="1. Continuous: drawn without lifting the pen" />}>
        <Box kind="uebung" src={<Src u={3} p={1} />} title={<T de="Stetigkeit" en={<><span lang="de">Stetigkeit</span> (continuity)</>} />}>
          <T
            de={<p>Stetig heisst anschaulich: Wir können den Graphen ohne Absetzen zeichnen. An der Stelle <M>a</M> darf nichts «springen».</p>}
            en={<p>Continuous, pictorially: we can draw the graph without lifting the pen. At the point <M>a</M> nothing may “jump”.</p>}
          />
          <MD>{t`\lim_{x\to a^-} f(x) = f(a) = \lim_{x\to a^+} f(x)`}</MD>
          <T
            de={<p>Von links und rechts kommt derselbe Wert heraus. Dieser Wert muss auch <M>{t`f(a)`}</M> sein. Am Rand eines Intervalls schauen wir nur von der erlaubten Seite.</p>}
            en={<p>From the left and from the right the same value comes out. This value must also be <M p=".">{t`f(a)`}</M> At the end of an interval we only look from the allowed side.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Zeile:</b></p>
            <ol className="keep">
              <li><M>{t`x\to a^-`}</M> heisst: <M>x</M> kommt von <b>links</b> an <M>a</M> heran, also immer <M p=".">{t`x < a`}</M> Das hochgestellte Minus ist kein Vorzeichen, sondern die Richtung.</li>
              <li><M>{t`x\to a^+`}</M> heisst: von <b>rechts</b>, also immer <M p=".">{t`x > a`}</M></li>
              <li>Stetig bei <M>a</M> heisst: Beide Grenzwerte existieren, sind gleich, und <M>f</M> hat bei <M>a</M> genau diesen Wert. Fehlt eines der drei, ist dort ein Loch, ein Pol oder ein Sprung.</li>
            </ol>
            <p>Am Rand gibt es nur eine Seite: Auf <M>{t`[0, \infty)`}</M> ist <M>{t`\sqrt{x}`}</M> bei <M>0</M> stetig, weil man nur von rechts kommen kann.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the line:</b></p>
            <ol className="keep">
              <li><M>{t`x\to a^-`}</M> means: <M>x</M> approaches <M>a</M> from the <b>left</b>, so always <M p=".">{t`x < a`}</M> The raised minus is not a sign but the direction.</li>
              <li><M>{t`x\to a^+`}</M> means: from the <b>right</b>, so always <M p=".">{t`x > a`}</M></li>
              <li>Continuous at <M>a</M> means: both limits exist, they are equal, and <M>f</M> has exactly this value at <M p=".">a</M> If one of the three is missing, there is a hole, a pole or a jump.</li>
            </ol>
            <p>At an end point there is only one side: on <M>{t`[0, \infty)`}</M> the root <M>{t`\sqrt{x}`}</M> is continuous at <M p=",">0</M> because you can only come from the right.</p>
          </>}
        />
        <Box kind="uebung" src={<Src u={3} p={1} />} title={<T de="Recap: Schreibweise" en={<>Recap: notation (<span lang="de">Schreibweise</span>)</>} />}>
          <MD>{t`f\colon D \subseteq \mathbb R \to \mathbb R, \qquad x \mapsto f(x)`}</MD>
          <T
            de={<p><M p=":">D</M> erlaubte <M>x</M>-Werte. <M p=":">{t`f(D)`}</M> erreichbare <M>y</M>-Werte. Menge: Wir sammeln alle <M p=",">x</M> die eine Bedingung erfüllen, etwa <M>{t`\{x\in\mathbb R \mid x^2 < 2\}`}</M> oder z.B. <M p=".">{t`\{1, 2, 3\}`}</M> Intervalle: <M>{t`[\ ]`}</M> = Rand dabei, <M>{t`(\ )`}</M> = Rand nicht dabei. Bei <M>{t`\pm\infty`}</M> ist die Klammer immer rund.</p>}
            en={<p><M p=":">D</M> the allowed <M>x</M>-values. <M p=":">{t`f(D)`}</M> the reachable <M>y</M>-values. A set: we collect all <M>x</M> that satisfy a condition, e.g. <M>{t`\{x\in\mathbb R \mid x^2 < 2\}`}</M> or <M p=".">{t`\{1, 2, 3\}`}</M> Intervals: <M>{t`[\ ]`}</M> = end point included, <M>{t`(\ )`}</M> = not included. At <M>{t`\pm\infty`}</M> the bracket is always round.</p>}
          />
        </Box>
        <IntervalStrip />
        <T
          de={<p>Lies <M>{t`\mid`}</M> als «für die gilt». <M>{t`\infty`}</M> ist keine Zahl, die man erreicht – darum nie eine eckige Klammer.</p>}
          en={<p>Read <M>{t`\mid`}</M> as “for which”. <M>{t`\infty`}</M> is not a number you can reach – hence never a square bracket.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="luecken" title={<T de="2. Lücken und Sprünge" en="2. Gaps and jumps" />}>
        <Box kind="uebung" src={<Src u={3} p={2} />} title={<T de="Lücken und Sprünge" en={<><span lang="de">Lücken und Sprünge</span> (gaps and jumps)</>} />}>
          <T
            de={<p><b>Hebbare Lücke.</b> Hier fehlt nur ein Punkt.</p>}
            en={<p><b><De en="removable gap">Hebbare Lücke</De>.</b> Only one point is missing.</p>}
          />
          <MD>{t`f(x) = \frac{x^2-1}{x-1} = x + 1, \qquad \lim_{x\to1} f(x) = 2`}</MD>
          <T
            de={<p>Kürzen geht nur für <M p="!">{t`x \neq 1`}</M> Setzen wir <M p=",">{t`f(1) = 2`}</M> ist das Loch zu.</p>}
            en={<p>Cancelling only works for <M p="!">{t`x \neq 1`}</M> If we set <M p=",">{t`f(1) = 2`}</M> the hole is closed.</p>}
          />
          <T
            de={<p><b>Polstelle.</b> Der Graph läuft nach oben oder unten weg: <M p=",">{t`g(x) = \frac1x`}</M> <M p=",">{t`x\to0^-\colon g(x)\to-\infty`}</M> <M p=".">{t`x\to0^+\colon g(x)\to+\infty`}</M></p>}
            en={<p><b><De en="pole">Polstelle</De>.</b> The graph runs away up or down: <M p=",">{t`g(x) = \frac1x`}</M> <M p=",">{t`x\to0^-\colon g(x)\to-\infty`}</M> <M p=".">{t`x\to0^+\colon g(x)\to+\infty`}</M></p>}
          />
          <T de={<p><b>Sprungstelle.</b></p>} en={<p><b><De en="jump">Sprungstelle</De>.</b></p>} />
          <MD>{t`h(x) = \begin{cases} -2-\sqrt{4-x}, & x \le 4\\ 0, & x > 4 \end{cases}`}</MD>
          <T
            de={<p>Links: <M p=".">-2</M> Rechts: <M p=".">0</M> Die beiden Seiten passen nicht zusammen.</p>}
            en={<p>Left: <M p=".">-2</M> Right: <M p=".">0</M> The two sides do not fit together.</p>}
          />
        </Box>
        <T
          de={<p>Wähle einen Fall und schieb den Abstand gegen <M p=".">0</M> Die zwei roten Punkte kommen von links und von rechts. Stetig ist es nur, wenn beide auf denselben Wert zulaufen <em>und</em> dort ein Punkt des Graphen sitzt.</p>}
          en={<p>Pick a case and push the distance towards <M p=".">0</M> The two red points come from the left and from the right. It is continuous only if both run to the same value <em>and</em> a point of the graph sits there.</p>}
        />
        <LimitExplorer />
        <T
          de={<p className="keep"><b>Warum darf man nur für <M>{t`x \neq 1`}</M> kürzen?</b> Es ist <M p=".">{t`x^2 - 1 = (x-1)(x+1)`}</M> Kürzen heisst: <M>{t`\frac{x-1}{x-1} = 1`}</M> ersetzen. Das stimmt nur, wenn <M p=",">{t`x - 1 \neq 0`}</M> denn <M>{t`\frac00`}</M> ist nicht definiert. Darum bleibt bei <M>1</M> ein Loch, obwohl die Gerade <M>{t`x + 1`}</M> dort ohne Lücke weiterläuft.</p>}
          en={<p className="keep"><b>Why may we cancel only for <M p="?">{t`x \neq 1`}</M></b> We have <M p=".">{t`x^2 - 1 = (x-1)(x+1)`}</M> Cancelling means replacing <M>{t`\frac{x-1}{x-1}`}</M> by <M p=".">1</M> That is true only if <M p=",">{t`x - 1 \neq 0`}</M> because <M>{t`\frac00`}</M> is not defined. So a hole stays at <M p=",">1</M> although the line <M>{t`x + 1`}</M> continues there without a gap.</p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`\frac1x`}</M> ist unstetig»</>} en={<>“<M>{t`\frac1x`}</M> is discontinuous”</>} />}>
          <T
            de={<p>An jeder Stelle, wo <M>{t`\frac1x`}</M> definiert ist, ist sie stetig. Bei <M>0</M> ist sie gar nicht definiert – dort ist eine Polstelle, also ein Loch im Definitionsbereich. Wirklich unstetig ist nur <M>h</M> bei <M p=":">4</M> <M>{t`h(4) = -2`}</M> existiert, aber von rechts kommt <M p=".">0</M></p>}
            en={<p>At every point where <M>{t`\frac1x`}</M> is defined, it is continuous. At <M>0</M> it is not defined at all – there is a pole there, a gap in the domain. Truly discontinuous is only <M>h</M> at <M p=":">4</M> <M>{t`h(4) = -2`}</M> exists, but from the right comes <M p=".">0</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="zws" title={<T de="3. Der Zwischenwertsatz" en="3. The intermediate value theorem" />}>
        <Box kind="uebung" src={<Src u={3} p={3} />} title={<T de="Zwischenwertsatz" en={<>Intermediate value theorem (<span lang="de">Zwischenwertsatz</span>)</>} />}>
          <T
            de={<p>Stetig <M>=</M> kein Sprung. Starten wir unter einer Höhe und landen darüber, müssen wir diese Höhe irgendwo treffen.</p>}
            en={<p>Continuous <M>=</M> no jump. If we start below a height and land above it, we must meet this height somewhere.</p>}
          />
          <MD>{tr(t`f \text{ stetig auf } [a, b], \quad m \text{ zwischen } f(a) \text{ und } f(b)`, t`f \text{ continuous on } [a, b], \quad m \text{ between } f(a) \text{ and } f(b)`)}</MD>
          <MD>{tr(t`\Rightarrow\ \text{mindestens ein } c \in [a, b] \text{ mit } f(c) = m`, t`\Rightarrow\ \text{at least one } c \in [a, b] \text{ with } f(c) = m`)}</MD>
        </Box>
        <Box kind="intuition">
          <T
            de={<p>Du wanderst von einem Tal auf 800 m zu einer Hütte auf 1200 m. Irgendwann warst du genau auf 1000 m – du kannst ja nicht springen. Vielleicht sogar mehrmals, wenn der Weg zwischendurch wieder abwärts geht. Nur eine Seilbahn, die über die 1000 m hinwegträgt, wäre ein «Sprung».</p>}
            en={<p>You hike from a valley at 800 m to a hut at 1200 m. At some moment you were at exactly 1000 m – you cannot jump. Maybe even several times, if the path goes down again in between. Only a cable car carrying you over the 1000 m would be a “jump”.</p>}
          />
        </Box>
        <T
          de={<p>Im Bild: Die magenta Linie auf Höhe <M>m</M> liegt im türkisen Streifen zwischen <M>{t`f(a)`}</M> und <M p=".">{t`f(b)`}</M> Der blaue Graph muss sie über <M>{t`[a, b]`}</M> kreuzen. Schieb <M>m</M> und probier «mit Sprung».</p>}
          en={<p>In the picture: the magenta line at height <M>m</M> lies in the teal strip between <M>{t`f(a)`}</M> and <M p=".">{t`f(b)`}</M> The blue graph must cross it over <M p=".">{t`[a, b]`}</M> Move <M>m</M> and try “with a jump”.</p>}
        />
        <IvtFigure />
        <Box kind="uebung" src={<Src u={3} p={3} />} title={<T de="Bsp. 1: Gibt es eine Nullstelle?" en="Ex. 1: is there a zero?" />}>
          <T
            de={<p><M p=":">{t`f(x) = x^3 - x - 1`}</M> Polynom <M>\to</M> stetig. <M p=",">{t`f(1) = -1 < 0`}</M> <M p=".">{t`f(2) = 5 > 0`}</M> Also liegt eine Nullstelle zwischen <M>1</M> und <M p=".">2</M> Der ZWS sagt: mindestens eine. Er sagt nicht, wo genau.</p>}
            en={<p><M p=":">{t`f(x) = x^3 - x - 1`}</M> polynomial <M>\to</M> continuous. <M p=",">{t`f(1) = -1 < 0`}</M> <M p=".">{t`f(2) = 5 > 0`}</M> So a zero lies between <M>1</M> and <M p=".">2</M> The IVT says: at least one. It does not say where exactly.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b></p>
            <ol className="keep">
              <li>«Polynom <M>\to</M> stetig»: <M>x</M> ist stetig, und Summen und Produkte stetiger Funktionen sind stetig. Also darf man den ZWS auf <M>{t`[1, 2]`}</M> benutzen.</li>
              <li><M>{t`m = 0`}</M> liegt zwischen <M>{t`f(1) = -1`}</M> und <M p=".">{t`f(2) = 5`}</M> Also gibt es ein <M>c</M> mit <M p=".">{t`f(c) = 0`}</M></li>
            </ol>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b></p>
            <ol className="keep">
              <li>“Polynomial <M>\to</M> continuous”: <M>x</M> is continuous, and sums and products of continuous functions are continuous. So the IVT may be used on <M p=".">{t`[1, 2]`}</M></li>
              <li><M>{t`m = 0`}</M> lies between <M>{t`f(1) = -1`}</M> and <M p=".">{t`f(2) = 5`}</M> So there is a <M>c</M> with <M p=".">{t`f(c) = 0`}</M></li>
            </ol>
          </>}
        />
        <Box keep kind="supplement" title={<T de="Wie findet man die Nullstelle? Halbieren" en="How to find the zero? Halving" />}>
          <T
            de={<p>Der ZWS sagt nur «irgendwo dazwischen». Man kann ihn aber immer wieder anwenden: Mitte nehmen, Vorzeichen prüfen, die Hälfte mit dem Vorzeichenwechsel behalten. Das heisst <b>Bisektion</b>.</p>}
            en={<p>The IVT only says “somewhere in between”. But one can apply it again and again: take the midpoint, check the sign, keep the half with the change of sign. This is called <b>bisection</b>.</p>}
          />
          <StepPlayer
            label={tr('Animation: Bisektion für x hoch 3 minus x minus 1', 'Animation: bisection for x cubed minus x minus 1')}
            steps={[
              { ms: 1500, holdMs: 2500, caption: <T de={<>Start: <M p=".">{t`f(1) < 0 < f(2)`}</M> Nach dem ZWS liegt in <M>{t`[1;\ 2]`}</M> eine Nullstelle.</>} en={<>Start: <M p=".">{t`f(1) < 0 < f(2)`}</M> By the IVT a zero lies in <M p=".">{t`[1, 2]`}</M></>} /> },
              { ms: 3000, holdMs: 2500, caption: <T de={<>Mitte <M p=":">{t`1{,}5`}</M> <M p=".">{t`f(1{,}5) = 0{,}875 > 0`}</M> Der Vorzeichenwechsel liegt links: weiter mit <M p=".">{t`[1;\ 1{,}5]`}</M></>} en={<>Midpoint <M p=":">{t`1.5`}</M> <M p=".">{t`f(1.5) = 0.875 > 0`}</M> The change of sign is on the left: continue with <M p=".">{t`[1, 1.5]`}</M></>} /> },
              { ms: 3000, holdMs: 2500, caption: <T de={<>Mitte <M p=":">{t`1{,}25`}</M> <M p=".">{t`f \approx -0{,}297 < 0`}</M> Wechsel rechts: <M p=".">{t`[1{,}25;\ 1{,}5]`}</M></>} en={<>Midpoint <M p=":">{t`1.25`}</M> <M p=".">{t`f \approx -0.297 < 0`}</M> Change on the right: <M p=".">{t`[1.25, 1.5]`}</M></>} /> },
              { ms: 3000, holdMs: 2500, caption: <T de={<>Mitte <M p=":">{t`1{,}375`}</M> <M p=".">{t`f \approx 0{,}225 > 0`}</M> Weiter mit <M p=".">{t`[1{,}25;\ 1{,}375]`}</M></>} en={<>Midpoint <M p=":">{t`1.375`}</M> <M p=".">{t`f \approx 0.225 > 0`}</M> Continue with <M p=".">{t`[1.25, 1.375]`}</M></>} /> },
              { ms: 3000, holdMs: 2500, caption: <T de={<>Mitte <M p=":">{t`1{,}3125`}</M> <M p=".">{t`f \approx -0{,}052 < 0`}</M> Weiter mit <M p=".">{t`[1{,}3125;\ 1{,}375]`}</M></>} en={<>Midpoint <M p=":">{t`1.3125`}</M> <M p=".">{t`f \approx -0.052 < 0`}</M> Continue with <M p=".">{t`[1.3125, 1.375]`}</M></>} /> },
              { ms: 2500, caption: <T de={<>Jeder Schritt halbiert das Intervall. Nach 20 Schritten ist es kürzer als <M p=":">{t`0{,}000001`}</M> <M p=".">{t`c \approx 1{,}3247`}</M></>} en={<>Every step halves the interval. After 20 steps it is shorter than <M p=":">{t`0.000001`}</M> <M p=".">{t`c \approx 1.3247`}</M></>} /> },
            ]}
          >
            {(s, tt) => <BisectPlot step={s} t={tt} />}
          </StepPlayer>
        </Box>
        <Box kind="uebung" src={<Src u={3} p={3} />} title={<T de={<>Bsp. 2: Geht auch <M p="?">{t`h(x) = -\pi`}</M></>} en={<>Ex. 2: does <M>{t`h(x) = -\pi`}</M> work too?</>} />}>
          <T
            de={<p>Wir nehmen den linken Teil von <M>h</M> aus dem letzten Beispiel. Auf <M>{t`[-1, 4]`}</M> ist dieser Teil stetig.</p>}
            en={<p>We take the left part of <M>h</M> from the last example. On <M>{t`[-1, 4]`}</M> this part is continuous.</p>}
          />
          <MD>{t`h(-1) = -2-\sqrt5 < -\pi < -2 = h(4)`}</MD>
          <T
            de={<p><M>{t`-\pi`}</M> liegt dazwischen <M>\to</M> es gibt ein passendes <M>x</M> in <M p=".">{t`(-1, 4)`}</M></p>}
            en={<p><M>{t`-\pi`}</M> lies in between <M>\to</M> there is a suitable <M>x</M> in <M p=".">{t`(-1, 4)`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum gilt jede Ungleichung?</b></p>
            <ol className="keep">
              <li><M p=":">{t`h(-1) = -2-\sqrt{4-(-1)} = -2-\sqrt5 \approx -4{,}24`}</M> Für <M>{t`x = -1 \le 4`}</M> gilt die obere Zeile von <M p=".">h</M></li>
              <li><M p=",">{t`-4{,}24 < -3{,}14 < -2`}</M> also liegt <M>{t`-\pi \approx -3{,}14`}</M> dazwischen.</li>
              <li><M>{t`h(4) = -2`}</M> gehört noch zum linken Teil, weil dort <M>{t`x \le 4`}</M> steht. Der Sprung kommt erst <em>nach</em> <M p=".">4</M> Darum ist <M>h</M> auf dem geschlossenen Intervall <M>{t`[-1, 4]`}</M> stetig.</li>
            </ol>
            <p>Hier kann man das <M>x</M> sogar ausrechnen (Ergänzung): <M>{t`-2-\sqrt{4-x} = -\pi`}</M> ergibt <M p=".">{t`x = 4 - (\pi-2)^2 \approx 2{,}70`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>Why does each inequality hold?</b></p>
            <ol className="keep">
              <li><M p=".">{t`h(-1) = -2-\sqrt{4-(-1)} = -2-\sqrt5 \approx -4.24`}</M> For <M>{t`x = -1 \le 4`}</M> the upper line of <M>h</M> applies.</li>
              <li><M p=",">{t`-4.24 < -3.14 < -2`}</M> so <M>{t`-\pi \approx -3.14`}</M> lies in between.</li>
              <li><M>{t`h(4) = -2`}</M> still belongs to the left part, because it says <M>{t`x \le 4`}</M> there. The jump comes only <em>after</em> <M p=".">4</M> So <M>h</M> is continuous on the closed interval <M p=".">{t`[-1, 4]`}</M></li>
            </ol>
            <p>Here one can even compute the <M>x</M> (supplement): <M>{t`-2-\sqrt{4-x} = -\pi`}</M> gives <M p=".">{t`x = 4 - (\pi-2)^2 \approx 2.70`}</M></p>
          </>}
        />
        <Box kind="misconception" title={<T de="«Der ZWS liefert genau eine Lösung»" en="“The IVT gives exactly one solution”" />}>
          <T
            de={<p>Er liefert <b>mindestens</b> eine. Im Fall «mehrere» trifft <M>p</M> die Höhe <M>2</M> auf <M>{t`[-2, 3]`}</M> dreimal. Wie viele es sind, sagt der Satz nicht.</p>}
            en={<p>It gives <b>at least</b> one. In the case “several”, <M>p</M> meets the height <M>2</M> on <M>{t`[-2, 3]`}</M> three times. The theorem does not say how many there are.</p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Gleiches Vorzeichen an beiden Enden heisst: keine Nullstelle»" en="“Same sign at both ends means: no zero”" />}>
          <T
            de={<p>Der ZWS sagt dann einfach nichts. <M>{t`x^2 - 1`}</M> ist bei <M>-2</M> und bei <M>2</M> positiv und hat trotzdem zwei Nullstellen in <M p=".">{t`[-2, 2]`}</M></p>}
            en={<p>Then the IVT simply says nothing. <M>{t`x^2 - 1`}</M> is positive at <M>-2</M> and at <M p=",">2</M> and still has two zeros in <M p=".">{t`[-2, 2]`}</M></p>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Stetig muss man nicht prüfen»" en="“No need to check continuity”" />}>
          <T
            de={<p>Ohne Stetigkeit gilt der Satz nicht. Im Fall «mit Sprung» ist <M>{t`h(3) = -3`}</M> und <M p=",">{t`h(5) = 0`}</M> aber <M>{t`h = -1`}</M> wird nie erreicht: <M>h</M> springt bei <M>4</M> von <M>-2</M> auf <M p=".">0</M></p>}
            en={<p>Without continuity the theorem fails. In the case “with a jump”, <M>{t`h(3) = -3`}</M> and <M p=",">{t`h(5) = 0`}</M> but <M>{t`h = -1`}</M> is never reached: <M>h</M> jumps at <M>4</M> from <M>-2</M> to <M p=".">0</M></p>}
          />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Stetig bei <M p=":">a</M> <M p=".">{t`\lim_{x\to a^-} f = f(a) = \lim_{x\to a^+} f`}</M> Am Rand nur die erlaubte Seite.</li>
              <li>Hebbare Lücke: nur ein Punkt fehlt (Kürzen klappt). Pol: der Graph läuft weg. Sprung: links und rechts verschieden.</li>
              <li>ZWS: <M>f</M> stetig auf <M p=",">{t`[a, b]`}</M> <M>m</M> zwischen <M>{t`f(a)`}</M> und <M>{t`f(b)`}</M> <M>\Rightarrow</M> mindestens ein <M>c</M> mit <M p=".">{t`f(c) = m`}</M> Wo genau, findet man z.B. durch Halbieren.</li>
            </ul>}
            en={<ul>
              <li>Continuous at <M p=":">a</M> <M p=".">{t`\lim_{x\to a^-} f = f(a) = \lim_{x\to a^+} f`}</M> At an end point only the allowed side.</li>
              <li>Removable gap: only one point is missing (cancelling works). Pole: the graph runs away. Jump: left and right differ.</li>
              <li>IVT: <M>f</M> continuous on <M p=",">{t`[a, b]`}</M> <M>m</M> between <M>{t`f(a)`}</M> and <M>{t`f(b)`}</M> <M>\Rightarrow</M> at least one <M>c</M> with <M p=".">{t`f(c) = m`}</M> Where exactly is found e.g. by halving.</li>
            </ul>}
          />
        </Box>
      </Section>
    </article>
  );
}
