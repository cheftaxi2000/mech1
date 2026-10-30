import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { GrowthRace, OrderExample, RatioExplorer } from '../viz/ana/W7Figures';

const t = String.raw;

export default function A7Groessen() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wer wächst schneller, <M>{t`x^{100}`}</M> oder <M p="?">{t`e^x`}</M> Am Anfang die Potenz, auf lange Sicht immer die Exponentialfunktion. Die Schreibweise «klein <M>o</M>» macht solche Vergleiche präzise: Man bildet den Quotienten und schaut, ob er gegen 0 geht. «Gross <M>O</M>» sagt etwas Schwächeres: Der Quotient bleibt beschränkt.</p>}
        en={<p className="lede">Who grows faster, <M>{t`x^{100}`}</M> or <M p="?">{t`e^x`}</M> At first the power, in the long run always the exponential. The “little <M>o</M>” notation makes such comparisons precise: form the quotient and see whether it goes to 0. “Big <M>O</M>” says something weaker: the quotient stays bounded.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Zwei Läufer: Der eine startet schnell, der andere langsam, wird aber jede Sekunde schneller. Am Anfang führt der Schnellstarter. Irgendwann überholt ihn der andere, und danach ist der Abstand nicht nur gross, sondern das Verhältnis der Strecken wächst über alle Grenzen. «Klein <M>o</M>» fragt nur nach diesem Ende des Rennens.</p>}
          en={<p>Two runners: one starts fast, the other slowly but gets faster every second. At first the fast starter leads. At some point the other overtakes, and afterwards the gap is not just large: the ratio of the distances grows beyond all bounds. “Little <M>o</M>” only asks about this end of the race.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="klein-o" title={<T de={<>1. Klein <M p=":">o</M> verschwindend klein</>} en={<>1. Little <M p=":">o</M> vanishingly small</>} />}>
        <Box kind="uebung" src={<Src u={7} p={11} />} title={<T de={<>Kleines <M>o</M></>} en={<>Little <M>o</M></>} />}>
          <T de={<p>«Im Vergleich verschwindend klein.» «<M>{t`f(x)`}</M> wächst langsamer als <M p=".">{t`g(x)`}</M>»</p>} en={<p>“Vanishingly small in comparison.” “<M>{t`f(x)`}</M> grows more slowly than <M p=".">{t`g(x)`}</M>”</p>} />
          <MD>{t`f(x) = o(g(x)) \text{ für } x \to a \quad\Longleftrightarrow\quad \lim_{x\to a}\frac{f(x)}{g(x)} = 0`}</MD>
          <MD>{t`\lim_{x\to\infty}\frac{x^2}{x^3} = \lim_{x\to\infty}\frac1x = 0 \quad\Rightarrow\quad x^2 = o(x^3)`}</MD>
          <T de={<p>Es gilt:</p>} en={<p>The following hold:</p>} />
          <MD>{t`\begin{aligned}
x^a &= o(e^{bx}) && x \to \infty,\ a, b > 0 \\
e^{-bx} &= o(x^{-a}) && x \to \infty,\ a, b > 0 \\
(\ln x)^c &= o(x^a) && x \to \infty,\ a, c > 0 \\
(\ln x)^c &= o(x^{-a}) && x \to 0^+,\ a, c > 0 \\
x^a &= o(x^b) && x \to \infty,\ 0 < a < b \\
\ln(\ln x) &= o(\ln x) && x \to \infty \\
x^a &= o(x^a \ln x) && x \to \infty
\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Definition.</b> <M>{t`f = o(g)`}</M> heisst: Teilt man <M>f</M> durch <M p=",">g</M> bleibt am Ende nichts übrig. <M>f</M> ist ein immer kleinerer Bruchteil von <M p=".">g</M> Wichtig ist, wohin <M>x</M> läuft (<M>\infty</M> oder <M p=")">{t`0^+`}</M> Die Liste ordnet die bekannten Funktionen für <M p=":">{t`x \to \infty`}</M> Logarithmen sind langsamer als jede Potenz, jede Potenz ist langsamer als jede Exponentialfunktion.</p>
            <p className="keep">Im Bild wählst du ein Paar und siehst den Quotienten <M p=".">{t`f/g`}</M> Die x-Achse ist logarithmisch, damit man weit genug hinaus sieht. Bei <M>{t`x^a`}</M> gegen <M>{t`e^{bx}`}</M> steigt der Quotient zuerst und fällt erst ab <M>{t`x = a/b`}</M> (Ableitung null; nicht im Resümee). Wie gross <M>a</M> auch ist: Der Buckel rückt nur nach rechts, das Ende ist 0.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the definition.</b> <M>{t`f = o(g)`}</M> means: divide <M>f</M> by <M>g</M> and in the end nothing is left. <M>f</M> is an ever smaller fraction of <M p=".">g</M> What matters is where <M>x</M> goes (<M>\infty</M> or <M p=")">{t`0^+`}</M> The list orders the familiar functions for <M p=":">{t`x \to \infty`}</M> logarithms are slower than every power, every power is slower than every exponential.</p>
            <p className="keep">In the figure you pick a pair and see the quotient <M p=".">{t`f/g`}</M> The x-axis is logarithmic so that you can look far enough out. For <M>{t`x^a`}</M> against <M>{t`e^{bx}`}</M> the quotient first rises and only falls from <M>{t`x = a/b`}</M> on (derivative zero; not in the summary). However large <M>a</M> is: the hump only moves to the right, the end is 0.</p>
          </>}
        />
        <RatioExplorer initial="pow-exp" />
        <T
          de={<p>Zur vierten Zeile der Liste: Für <M>{t`x \to 0^+`}</M> ist <M>{t`\ln x`}</M> negativ, und <M>{t`(\ln x)^c`}</M> ist für nicht-ganze <M>c</M> gar nicht definiert. Gemeint ist der Betrag: <M>{t`|\ln x|^c = o(x^{-a})`}</M> (A-020). Im Bild: Knopf «<M>{t`x \to 0^+`}</M>».</p>}
          en={<p>On the fourth line of the list: for <M p=",">{t`x \to 0^+`}</M> <M>{t`\ln x`}</M> is negative, and <M>{t`(\ln x)^c`}</M> is not even defined for non-integer <M p=".">c</M> Meant is the absolute value: <M>{t`|\ln x|^c = o(x^{-a})`}</M> (A-020). In the figure: button “<M>{t`x \to 0^+`}</M>”.</p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`x^{100}`}</M> wächst schneller als <M>{t`e^x`}</M>»</>} en={<>“<M>{t`x^{100}`}</M> grows faster than <M>{t`e^x`}</M>”</>} />}>
          <T
            de={<p>Lange Zeit ja: Bei <M>{t`x = 10`}</M> ist <M>{t`x^{100} = 10^{100}`}</M> und <M p=".">{t`e^{10} \approx 22\,000`}</M> Aber der Quotient <M>{t`x^{100}/e^x`}</M> hat seinen Höhepunkt bei <M>{t`x = 100`}</M> und fällt danach gegen 0. Klein <M>o</M> vergleicht das Ende, nicht den Anfang.</p>}
            en={<p>For a long time, yes: at <M>{t`x = 10`}</M> we have <M>{t`x^{100} = 10^{100}`}</M> and <M p=".">{t`e^{10} \approx 22{,}000`}</M> But the quotient <M>{t`x^{100}/e^x`}</M> peaks at <M>{t`x = 100`}</M> and then falls to 0. Little <M>o</M> compares the end, not the start.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="rennen" title={<T de="2. Das Wachstumsrennen" en="2. The growth race" />}>
        <Box kind="uebung" src={<Src u={7} p={10} />} title={<T de="Wachstum im Vergleich" en="Growth compared" />}>
          <T
            de={<p>Bild mit logarithmischer y-Achse (<M>{t`10^{-1}`}</M> bis <M p=")">{t`10^{7}`}</M> und <M>x</M> von 1 bis 10: <M>{t`x!`}</M> (rot, Punkte), <M>{t`2^x`}</M> (blau), <M>{t`x^2`}</M> (grün), <M>{t`x\ln x`}</M> (magenta), <M>x</M> (violett), <M>{t`\ln x`}</M> (braun), <M>1</M> (grau gestrichelt).</p>}
            en={<p>Figure with a logarithmic y-axis (<M>{t`10^{-1}`}</M> to <M p=")">{t`10^{7}`}</M> and <M>x</M> from 1 to 10: <M>{t`x!`}</M> (red, dots), <M>{t`2^x`}</M> (blue), <M>{t`x^2`}</M> (green), <M>{t`x\ln x`}</M> (magenta), <M>x</M> (purple), <M>{t`\ln x`}</M> (brown), <M>1</M> (grey dashed).</p>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man das Bild.</b> Auf einer logarithmischen Achse ist jeder Teilstrich zehnmal so viel wie der darunter. Nur so passen <M>{t`\ln 10 \approx 2{,}3`}</M> und <M>{t`10! \approx 3{,}6\cdot10^6`}</M> in dasselbe Bild. Am Anfang kreuzen sich die Kurven (<M>{t`x^2`}</M> liegt bis <M>{t`x = 4`}</M> über <M p=";">{t`2^x`}</M> <M>{t`x!`}</M> überholt <M>{t`2^x`}</M> zwischen 3 und 4). Danach ändert sich die Reihenfolge nie mehr, und die Abstände werden immer grösser. Schiebe <M>{t`x_\text{max}`}</M> nach rechts: Bei <M>{t`x = 40`}</M> liegt <M>{t`x!`}</M> bei <M p=".">{t`10^{48}`}</M></p>}
          en={<p className="keep"><b>How to read the figure.</b> On a logarithmic axis each mark is ten times the one below. Only this way do <M>{t`\ln 10 \approx 2.3`}</M> and <M>{t`10! \approx 3.6\cdot10^6`}</M> fit in the same picture. At first the curves cross (<M>{t`x^2`}</M> lies above <M>{t`2^x`}</M> up to <M p=";">{t`x = 4`}</M> <M>{t`x!`}</M> overtakes <M>{t`2^x`}</M> between 3 and 4). After that the order never changes again, and the gaps keep growing. Move <M>{t`x_\text{max}`}</M> to the right: at <M p=",">{t`x = 40`}</M> <M>{t`x!`}</M> is at <M p=".">{t`10^{48}`}</M></p>}
        />
        <GrowthRace />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="gross-o" title={<T de={<>3. Gross <M p=":">O</M> durch ein festes Vielfaches begrenzt</>} en={<>3. Big <M p=":">O</M> bounded by a fixed multiple</>} />}>
        <Box kind="uebung" src={<Src u={7} p={11} />} title={<T de={<>Grosses <M>O</M></>} en={<>Big <M>O</M></>} />}>
          <MD>{t`f(x) = O(g(x)) \text{ für } x \to a \quad\Longleftrightarrow\quad \lim_{x\to a}\left|\frac{f(x)}{g(x)}\right| \le A \in \mathbb R`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das.</b> <M>{t`f = O(g)`}</M> heisst: <M>f</M> ist höchstens ein festes Vielfaches von <M p=":">g</M> <M>{t`|f(x)| \le A\,|g(x)|`}</M> für alle <M>x</M> nahe bei <M p=".">a</M> Der Quotient darf also auch gegen eine Zahl ungleich 0 gehen, er darf nur nicht über alle Grenzen wachsen. Jedes klein <M>o</M> ist auch ein gross <M p=",">O</M> aber nicht umgekehrt.</p>
            <p className="keep">Beispiel (SC 12, Aussage B): <M p=",">{t`\ln(x^2) = 2\ln x`}</M> also ist <M>{t`\ln x / \ln(x^2) = \tfrac12`}</M> immer. Das geht nicht gegen 0: <M>{t`\ln x`}</M> ist <b>kein</b> <M p=",">{t`o(\ln(x^2))`}</M> wohl aber <M p=".">{t`O(\ln(x^2))`}</M> Ein konstanter Faktor ändert die Grössenordnung nicht. Im Bild: Knopf «SC 12 (B)».</p>
            <p>Zur Formel im Resümee: Der Grenzwert muss gar nicht existieren. <M>{t`f(x) = x\sin x`}</M> ist <M>{t`O(x)`}</M> (der Quotient <M>{t`\sin x`}</M> bleibt zwischen <M>-1</M> und <M p="),">1</M> aber <M>{t`\lim \sin x`}</M> gibt es nicht. Gemeint ist «<M>{t`|f/g|`}</M> bleibt nahe <M>a</M> unter einer festen Schranke <M>A</M>» (A-021).</p>
          </>}
          en={<>
            <p className="keep"><b>How to read this.</b> <M>{t`f = O(g)`}</M> means: <M>f</M> is at most a fixed multiple of <M p=":">g</M> <M>{t`|f(x)| \le A\,|g(x)|`}</M> for all <M>x</M> near <M p=".">a</M> So the quotient may also tend to a number other than 0; it just must not grow beyond all bounds. Every little <M>o</M> is also a big <M p=",">O</M> but not the other way round.</p>
            <p className="keep">Example (SC 12, statement B): <M p=",">{t`\ln(x^2) = 2\ln x`}</M> so <M>{t`\ln x / \ln(x^2) = \tfrac12`}</M> always. That does not go to 0: <M>{t`\ln x`}</M> is <b>not</b> <M p=",">{t`o(\ln(x^2))`}</M> but it is <M p=".">{t`O(\ln(x^2))`}</M> A constant factor does not change the order of magnitude. In the figure: button “SC 12 (B)”.</p>
            <p>On the formula in the summary: the limit need not exist at all. <M>{t`f(x) = x\sin x`}</M> is <M>{t`O(x)`}</M> (the quotient <M>{t`\sin x`}</M> stays between <M>-1</M> and <M p="),">1</M> but <M>{t`\lim \sin x`}</M> does not exist. Meant is “<M>{t`|f/g|`}</M> stays below a fixed bound <M>A</M> near <M>a</M>” (A-021).</p>
          </>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`f = O(g)`}</M> heisst, <M>f</M> wächst langsamer als <M>g</M>»</>} en={<>“<M>{t`f = O(g)`}</M> means <M>f</M> grows more slowly than <M>g</M>”</>} />}>
          <T
            de={<p>Nein, nur «nicht schneller». <M>{t`3x^2 = O(x^2)`}</M> stimmt, obwohl <M>{t`3x^2`}</M> immer dreimal so gross ist. «Echt langsamer» ist klein <M p=".">o</M></p>}
            en={<p>No, only “not faster”. <M>{t`3x^2 = O(x^2)`}</M> is true although <M>{t`3x^2`}</M> is always three times as large. “Strictly slower” is little <M p=".">o</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="ordnen" title={<T de="4. Beispiel: Funktionen der Grösse nach ordnen" en="4. Example: ordering functions by size" />}>
        <Box kind="uebung" src={<Src u={7} p={12} />} title={<T de="Wachstum vergleichen" en="Comparing growth" />}>
          <T de={<p>«Für <M p=":">{t`x \to +\infty`}</M> Ordne die folgenden Funktionen der Grösse nach: <M p=",">{t`f_1(x) = x^3`}</M> <M p=",">{t`f_2(x) = e^{5x+1}`}</M> <M p=",">{t`f_3(x) = \ln\bigl(e^{x^{1/4}} - 2\bigr)`}</M> <M p=".">{t`f_4(x) = \sqrt x`}</M>»</p>} en={<p>“For <M p=",">{t`x \to +\infty`}</M> order the following functions by size: <M p=",">{t`f_1(x) = x^3`}</M> <M p=",">{t`f_2(x) = e^{5x+1}`}</M> <M p=",">{t`f_3(x) = \ln\bigl(e^{x^{1/4}} - 2\bigr)`}</M> <M p=".">{t`f_4(x) = \sqrt x`}</M>”</p>} />
          <MD>{t`e^{5x+1} \gg x^3 \gg \sqrt{x} \gg \ln\bigl(e^{x^{1/4}} - 2\bigr)`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So kommt man darauf.</b></p>
            <ol className="keep">
              <li><M>{t`e^{5x+1}`}</M> ist eine Exponentialfunktion: schneller als jede Potenz, also ganz vorne.</li>
              <li><M>{t`x^3`}</M> und <M>{t`\sqrt x = x^{1/2}`}</M> sind Potenzen: Der grössere Exponent gewinnt (<M>{t`x^a = o(x^b)`}</M> für <M p=").">{t`a < b`}</M></li>
              <li><M>{t`f_3`}</M> sieht wild aus, ist aber zahm: Für grosse <M>x</M> ist <M>{t`e^{x^{1/4}}`}</M> riesig und die <M>-2</M> spielt keine Rolle, also <M p=".">{t`f_3(x) \approx \ln\bigl(e^{x^{1/4}}\bigr) = x^{1/4}`}</M> Eine Potenz mit Exponent <M p=",">{t`\tfrac14 < \tfrac12`}</M> also langsamer als <M p=".">{t`\sqrt x`}</M></li>
            </ol>
            <p>Der Tipp des Resümees für unsichere Fälle: den Quotienten bilden und den Grenzwert ansehen.</p>
          </>}
          en={<>
            <p className="keep"><b>How to get there.</b></p>
            <ol className="keep">
              <li><M>{t`e^{5x+1}`}</M> is an exponential: faster than every power, so right at the front.</li>
              <li><M>{t`x^3`}</M> and <M>{t`\sqrt x = x^{1/2}`}</M> are powers: the larger exponent wins (<M>{t`x^a = o(x^b)`}</M> for <M p=").">{t`a < b`}</M></li>
              <li><M>{t`f_3`}</M> looks wild but is tame: for large <M p=",">x</M> <M>{t`e^{x^{1/4}}`}</M> is huge and the <M>-2</M> does not matter, so <M p=".">{t`f_3(x) \approx \ln\bigl(e^{x^{1/4}}\bigr) = x^{1/4}`}</M> A power with exponent <M p=",">{t`\tfrac14 < \tfrac12`}</M> hence slower than <M p=".">{t`\sqrt x`}</M></li>
            </ol>
            <p>The summary's tip for unclear cases: form the quotient and look at the limit.</p>
          </>}
        />
        <OrderExample />
        <T
          de={<>
            <p className="keep"><b>Zwei Prüfungsbeispiele (S. 12).</b> SC 12: Richtig ist (A) <M>{t`\ln x = o\bigl(\sqrt{x^2 + x}\bigr)`}</M> für <M p=":">{t`x \to \infty`}</M> <M>{t`\sqrt{x^2 + x}`}</M> verhält sich wie <M p=",">x</M> und <M>{t`\ln x = o(x)`}</M> (dritte Zeile der Liste mit <M p=").">{t`c = a = 1`}</M> (B) ist falsch, siehe Abschnitt 3; (C) und (D) drehen die Reihenfolge um.</p>
            <p className="keep">SC 6, für <M p=":">{t`x \to 0^+`}</M> Richtig ist (C) <M p=".">{t`e^{-1/x} = o(x^4)`}</M> Mit <M>{t`u = 1/x \to \infty`}</M> wird der Quotient <M p=",">{t`e^{-1/x}/x^4 = u^4 e^{-u}`}</M> eine Potenz gegen eine Exponentialfunktion, also <M p=".">{t`\to 0`}</M> Im Bild von Abschnitt 1: Knopf «SC 6 (C)».</p>
          </>}
          en={<>
            <p className="keep"><b>Two exam examples (p. 12).</b> SC 12: correct is (A) <M>{t`\ln x = o\bigl(\sqrt{x^2 + x}\bigr)`}</M> for <M p=":">{t`x \to \infty`}</M> <M>{t`\sqrt{x^2 + x}`}</M> behaves like <M p=",">x</M> and <M>{t`\ln x = o(x)`}</M> (third line of the list with <M p=").">{t`c = a = 1`}</M> (B) is false, see section 3; (C) and (D) reverse the order.</p>
            <p className="keep">SC 6, for <M p=":">{t`x \to 0^+`}</M> correct is (C) <M p=".">{t`e^{-1/x} = o(x^4)`}</M> With <M>{t`u = 1/x \to \infty`}</M> the quotient becomes <M p=",">{t`e^{-1/x}/x^4 = u^4 e^{-u}`}</M> a power against an exponential, hence <M p=".">{t`\to 0`}</M> In the figure of section 1: button “SC 6 (C)”.</p>
          </>}
        />
      </Section>
    </article>
  );
}
