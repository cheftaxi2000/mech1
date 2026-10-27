import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { DegreeExplorer, SceneFig } from '../viz/ana/Week1Figures';
import { rootScene } from '../viz/ana/week1Scenes';

const t = String.raw;

export default function A1Grenzwerte() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In <a href="#ana-folgen">Folgen: beschränkt, monoton, konvergent</a> ging es darum, <em>was</em> ein Grenzwert ist. Jetzt geht es darum, ihn <em>auszurechnen</em> – mit zwei Werkzeugen vom Blatt: der Grad-Regel für Brüche und dem Wurzel-Trick.</p>}
        en={<p className="lede">In <a href="#ana-folgen">Sequences: bounded, monotonic, convergent</a> the question was <em>what</em> a limit is. Now we <em>compute</em> it – with two tools from the slide: the degree rule for fractions and the root trick.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="brueche" title={<T de="1. Brüche: die höchste Potenz gewinnt" en="1. Fractions: the highest power wins" />}>
        <Box kind="uebung" src={<Src u={1} p={11} />} title={<T de={<>Brüche mit <M>{t`\lim_{n\to\infty}\frac{\text{Zähler}}{\text{Nenner}}`}</M></>} en={<>Fractions <M>{t`\lim_{n\to\infty}\frac{\text{numerator}}{\text{denominator}}`}</M></>} />}>
          <MD>{t`\text{${tr('Grad (Zähler) > Grad (Nenner)', 'deg(numerator) > deg(denominator)')}:}\quad \lim_{n\to\infty}\frac{5n^3 + 3n + 7}{n^2 - 2n} = \infty`}</MD>
          <MD>{t`\text{${tr('Grad (Zähler) = Grad (Nenner)', 'deg(numerator) = deg(denominator)')}:}\quad \lim_{n\to\infty}\frac{7n^2 + 3n}{4n^2} = \frac74`}</MD>
          <MD>{t`\text{${tr('Grad (Zähler) < Grad (Nenner)', 'deg(numerator) < deg(denominator)')}:}\quad \lim_{n\to\infty}\frac{1n^5 - 4n}{6n^6 - 2} = 0`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Intuition.</b> Bei <M>{t`n = 1000`}</M> ist <M p=",">{t`7n^2 = 7\,000\,000`}</M> aber <M>{t`3n`}</M> nur <M p=".">3000</M> Für grosse <M>n</M> zählt nur noch die höchste Potenz. Der <b>Grad</b> ist der höchste Exponent von <M p=":">n</M> <M>{t`5n^3 + 3n + 7`}</M> hat Grad <M p=".">3</M></p>
            <p className="keep"><b>Die Methode.</b> Teile Zähler und Nenner durch die höchste Potenz des Nenners. Beim zweiten Beispiel durch <M p=":">{t`n^2`}</M></p>
          </>}
          en={<>
            <p><b>Intuition.</b> At <M>{t`n = 1000`}</M> we have <M p=",">{t`7n^2 = 7\,000\,000`}</M> but <M>{t`3n`}</M> is only <M p=".">3000</M> For large <M>n</M> only the highest power counts. The <b>degree</b> (<span lang="de">Grad</span>) is the highest exponent of <M p=":">n</M> <M>{t`5n^3 + 3n + 7`}</M> has degree <M p=".">3</M></p>
            <p className="keep"><b>The method.</b> Divide numerator and denominator by the highest power of the denominator. In the second example by <M p=":">{t`n^2`}</M></p>
          </>}
        />
        <MD>{t`\frac{7n^2 + 3n}{4n^2} = \frac{7 + \frac3n}{4} \;\xrightarrow{\;n\to\infty\;}\; \frac{7 + 0}{4} = \frac74`}</MD>
        <T
          de={<>
            <p className="keep"><b>Warum darf man das?</b></p>
            <ol className="keep">
              <li>Zähler und Nenner durch dieselbe Zahl <M>{t`n^2 \neq 0`}</M> teilen ändert den Bruch nicht (Kürzen). Jedes <M>{t`a_n`}</M> bleibt genau gleich.</li>
              <li>Danach steht <M>n</M> nur noch <em>unten</em> in kleinen Brüchen wie <M p=".">{t`\frac3n`}</M> Das sind Nullfolgen: <M p=".">{t`\frac3n \to 0`}</M></li>
              <li>Grenzwerte darf man summandenweise und für Zähler und Nenner getrennt nehmen, solange der Nenner nicht gegen <M>0</M> geht. Hier geht er gegen <M p=".">4</M></li>
            </ol>
            <p>Die beiden anderen Beispiele gehen gleich:</p>
          </>}
          en={<>
            <p className="keep"><b>Why is this allowed?</b></p>
            <ol className="keep">
              <li>Dividing numerator and denominator by the same number <M>{t`n^2 \neq 0`}</M> does not change the fraction (cancelling). Every <M>{t`a_n`}</M> stays exactly the same.</li>
              <li>Afterwards <M>n</M> stands only <em>below</em>, in small fractions like <M p=".">{t`\frac3n`}</M> These are null sequences: <M p=".">{t`\frac3n \to 0`}</M></li>
              <li>Limits may be taken term by term, and for numerator and denominator separately, as long as the denominator does not tend to <M p=".">0</M> Here it tends to <M p=".">4</M></li>
            </ol>
            <p>The other two examples work the same way:</p>
          </>}
        />
        <MD>{t`\frac{5n^3 + 3n + 7}{n^2 - 2n} = \frac{5n + \frac3n + \frac7{n^2}}{1 - \frac2n} \;\to\; \frac{\infty}{1} = \infty`}</MD>
        <MD>{t`\frac{n^5 - 4n}{6n^6 - 2} = \frac{\frac1n - \frac4{n^5}}{6 - \frac2{n^6}} \;\to\; \frac{0}{6} = 0`}</MD>
        <T
          de={<p className="keep">So liest man die Grad-Regel: Ist der Zählergrad grösser, bleibt oben ein <M>n</M> stehen – das wächst ohne Ende. Gleich gross: Es bleiben die Leitzahlen <M p=".">{t`\frac74`}</M> Kleiner: Oben bleibt nur <M>n</M> im Nenner – das geht gegen <M p=".">0</M> Bewege <M>n</M> im Bild und schau, wie die kleinen Brüche verschwinden.</p>}
          en={<p className="keep">How to read the degree rule: if the numerator's degree is larger, an <M>n</M> stays on top – it grows without end. Equal: the leading coefficients remain, <M p=".">{t`\frac74`}</M> Smaller: on top only <M>n</M> in denominators is left – that tends to <M p=".">0</M> Move <M>n</M> in the figure and watch the small fractions vanish.</p>}
        />
        <DegreeExplorer />
        <T
          de={<p><b>Vorzeichen.</b> Auf dem Blatt steht bei «Grad (Zähler) &gt; Grad (Nenner)» einfach <M p=".">{t`= \infty`}</M> Für das Beispiel stimmt das. Allgemein ist es <M>{t`+\infty`}</M> oder <M p=",">{t`-\infty`}</M> je nach Vorzeichen des Quotienten der Leitzahlen: <M>{t`\frac{3n - 2n^3}{n^2 + 1} \to -\infty`}</M> (vierter Knopf), weil <M p=".">{t`\frac{-2}{1} < 0`}</M></p>}
          en={<p><b>Sign.</b> For “deg(numerator) &gt; deg(denominator)” the slide simply writes <M p=".">{t`= \infty`}</M> That is right for its example. In general it is <M>{t`+\infty`}</M> or <M p=",">{t`-\infty`}</M> depending on the sign of the ratio of the leading coefficients: <M>{t`\frac{3n - 2n^3}{n^2 + 1} \to -\infty`}</M> (fourth button), because <M p=".">{t`\frac{-2}{1} < 0`}</M></p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`\frac{\infty}{\infty} = 1`}</M>»</>} en={<>“<M>{t`\frac{\infty}{\infty} = 1`}</M>”</>} />}>
          <T de={<p>Oben und unten gehen gegen <M p=",">\infty</M> aber das sagt nichts: <M>{t`\frac{7n^2}{4n^2} \to \frac74`}</M> und <M p=".">{t`\frac{n^2}{n} \to \infty`}</M> Erst kürzen, dann den Grenzwert nehmen.</p>}
            en={<p>Top and bottom tend to <M p=",">\infty</M> but that says nothing: <M>{t`\frac{7n^2}{4n^2} \to \frac74`}</M> and <M p=".">{t`\frac{n^2}{n} \to \infty`}</M> Cancel first, then take the limit.</p>} />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="wurzeln" title={<T de="2. Wurzeln: der Trick mit der 3. binomischen Formel" en="2. Roots: the trick with the third binomial formula" />}>
        <Box kind="uebung" src={<Src u={1} p={11} />} title={<T de="Wurzeln (3. Binomische Formel)" en="Roots (third binomial formula)" />}>
          <MD>{t`\lim_{n\to\infty} n\cdot\Big(\sqrt{1+\tfrac1n} - 1\Big) = \lim_{n\to\infty} n\cdot\Big(\sqrt{1+\tfrac1n} - 1\Big)\cdot\frac{\big(\sqrt{1+\frac1n} + 1\big)}{\big(\sqrt{1+\frac1n} + 1\big)}`}</MD>
          <MD>{t`= \lim_{n\to\infty}\frac{n\cdot\big[(1+\frac1n) - 1\big]}{\sqrt{1+\frac1n} + 1} = \lim_{n\to\infty}\frac{1}{\big(\sqrt{1+\frac1n} + 1\big)} = \frac{1}{\sqrt1 + 1} = \frac12`}</MD>
        </Box>
        <T
          de={<>
            <p><b>Das Problem.</b> <M>n</M> wächst ohne Ende, die Klammer <M>{t`\sqrt{1+\frac1n} - 1`}</M> geht gegen <M p=".">0</M> «<M>{t`\infty\cdot 0`}</M>» ist unentschieden – je nachdem, wer schneller ist, kommt alles Mögliche heraus. Ausmultipliziert ist es sogar <M p=":">{t`\sqrt{n^2 + n} - n`}</M> «<M p="».">{t`\infty - \infty`}</M> Einsetzen geht nicht.</p>
            <p className="keep"><b>Der Trick.</b> Die 3. binomische Formel <M>{t`(a - b)(a + b) = a^2 - b^2`}</M> macht aus einer Differenz mit Wurzel eine Differenz <em>ohne</em> Wurzel. So liest man die Zeilen:</p>
            <ol className="keep">
              <li>Mal <M p=".">{t`\frac{\sqrt{1+1/n} + 1}{\sqrt{1+1/n} + 1}`}</M> Das ist <M p=",">1</M> also ändert sich nichts.</li>
              <li>Oben steht jetzt <M>{t`(a - 1)(a + 1)`}</M> mit <M p=".">{t`a = \sqrt{1+\frac1n}`}</M> Das ist <M p=":">{t`a^2 - 1 = (1 + \frac1n) - 1 = \frac1n`}</M> die Wurzel ist weg.</li>
              <li><M p=":">{t`n\cdot\frac1n = 1`}</M> Das gefährliche <M>n</M> kürzt sich.</li>
              <li>Übrig bleibt <M p=".">{t`\frac{1}{\sqrt{1+1/n} + 1}`}</M> Hier gibt es keinen Kampf mehr: <M>{t`\frac1n \to 0`}</M> einsetzen, fertig: <M p=".">{t`\frac{1}{1+1} = \frac12`}</M></li>
            </ol>
            <p>Die Animation zeigt, was die Formel geometrisch macht.</p>
          </>}
          en={<>
            <p><b>The problem.</b> <M>n</M> grows without end, the bracket <M>{t`\sqrt{1+\frac1n} - 1`}</M> tends to <M p=".">0</M> “<M p="”">{t`\infty\cdot 0`}</M> is undecided – depending on who is faster, anything can come out. Multiplied out it is even <M p=":">{t`\sqrt{n^2 + n} - n`}</M> “<M p=".”">{t`\infty - \infty`}</M> Plugging in does not work.</p>
            <p className="keep"><b>The trick.</b> The third binomial formula <M>{t`(a - b)(a + b) = a^2 - b^2`}</M> turns a difference with a root into a difference <em>without</em> a root. How to read the lines:</p>
            <ol className="keep">
              <li>Multiply by <M p=".">{t`\frac{\sqrt{1+1/n} + 1}{\sqrt{1+1/n} + 1}`}</M> That is <M p=",">1</M> so nothing changes.</li>
              <li>On top there is now <M>{t`(a - 1)(a + 1)`}</M> with <M p=".">{t`a = \sqrt{1+\frac1n}`}</M> That is <M p=":">{t`a^2 - 1 = (1 + \frac1n) - 1 = \frac1n`}</M> the root is gone.</li>
              <li><M p=":">{t`n\cdot\frac1n = 1`}</M> the dangerous <M>n</M> cancels.</li>
              <li>What is left is <M p=".">{t`\frac{1}{\sqrt{1+1/n} + 1}`}</M> There is no fight any more: plug in <M p=",">{t`\frac1n \to 0`}</M> done: <M p=".">{t`\frac{1}{1+1} = \frac12`}</M></li>
            </ol>
            <p>The animation shows what the formula does geometrically.</p>
          </>}
        />
        <Derivation title={<T de={<>Warum <M p="">{t`n\big(\sqrt{1+\frac1n} - 1\big) \to \frac12`}</M></>} en={<>Why <M p="">{t`n\big(\sqrt{1+\frac1n} - 1\big) \to \frac12`}</M></>} />}>
          <StepPlayer
            label={tr('Animation: Quadrat der Fläche 1 + 1/n, der überstehende Winkel wird zum Rechteck', 'Animation: square of area 1 + 1/n, the overhanging L becomes a rectangle')}
            steps={[
              { ms: 1500, holdMs: 3500, caption: <T
                de={<>Blau: ein Quadrat der Fläche <M>{t`1 + \frac1n`}</M> (hier <M p="),">{t`n = 2`}</M> Seite <M p=".">{t`s = \sqrt{1 + \frac1n}`}</M> Es ragt um <M>{t`\delta = s - 1`}</M> über das graue Einheitsquadrat; der magenta Winkel hat die Fläche <M p=".">{t`\frac1n`}</M></>}
                en={<>Blue: a square of area <M>{t`1 + \frac1n`}</M> (here <M p="),">{t`n = 2`}</M> side <M p=".">{t`s = \sqrt{1 + \frac1n}`}</M> It sticks out by <M>{t`\delta = s - 1`}</M> beyond the grey unit square; the magenta L has area <M p=".">{t`\frac1n`}</M></>} /> },
              { ms: 2500, holdMs: 3500, caption: <T
                de={<>Der obere Streifen dreht sich und stellt sich auf den rechten: ein Rechteck <M p=".">{t`\delta\times(s+1)`}</M> Fläche immer noch <M p=":">{t`\frac1n`}</M> <M>{t`(s-1)(s+1) = s^2 - 1`}</M> – die 3. binomische Formel.</>}
                en={<>The top strip turns and stands on the right one: a rectangle <M p=".">{t`\delta\times(s+1)`}</M> Its area is still <M p=":">{t`\frac1n`}</M> <M>{t`(s-1)(s+1) = s^2 - 1`}</M> – the third binomial formula.</>} /> },
              { ms: 2000, holdMs: 3500, caption: <T
                de={<>Mal <M p=":">n</M> Das Rechteck wird <M>n</M>-mal so breit, seine Fläche ist <M p=".">1</M> Also <M>{t`n\delta = \frac{1}{s+1}`}</M> – genau die Zeile nach dem Trick.</>}
                en={<>Times <M p=":">n</M> the rectangle becomes <M>n</M> times as wide, its area is <M p=".">1</M> So <M>{t`n\delta = \frac{1}{s+1}`}</M> – exactly the line after the trick.</>} /> },
              { ms: 4000, caption: <T
                de={<>Jetzt wächst <M p=":">n</M> Das blaue Quadrat schrumpft zum Einheitsquadrat, <M p=".">{t`s + 1 \to 2`}</M> Die Fläche bleibt <M p=",">1</M> also geht die Breite <M>{t`n\delta`}</M> gegen <M p=".">{t`\frac12`}</M></>}
                en={<>Now <M>n</M> grows. The blue square shrinks to the unit square, <M p=".">{t`s + 1 \to 2`}</M> The area stays <M p=",">1</M> so the width <M>{t`n\delta`}</M> tends to <M p=".">{t`\frac12`}</M></>} /> },
            ]}
          >
            {(step, tt) => <SceneFig build={rootScene} step={step} t={tt} label={tr('Quadrate und Rechteck', 'squares and rectangle')} />}
          </StepPlayer>
        </Derivation>
        <T
          de={<p>Derselbe Trick hilft bei jeder Differenz mit Wurzeln, die gegen «<M p="»">{t`\infty - \infty`}</M> läuft, etwa <M p=".">{t`\sqrt{n+1} - \sqrt n`}</M> Man erweitert mit der Summe.</p>}
          en={<p>The same trick helps with every difference of roots that runs into “<M p="”,">{t`\infty - \infty`}</M> such as <M p=".">{t`\sqrt{n+1} - \sqrt n`}</M> Expand with the sum.</p>}
        />
        <Box kind="misconception" title={<T de={<>«<M>{t`\infty \cdot 0 = 0`}</M>»</>} en={<>“<M>{t`\infty \cdot 0 = 0`}</M>”</>} />}>
          <T de={<p>Hier kommt <M>{t`\frac12`}</M> heraus, nicht <M p=".">0</M> Bei «<M p="»">{t`\infty\cdot 0`}</M> und «<M p="»">{t`\infty - \infty`}</M> muss man umformen, bis kein Kampf mehr übrig ist.</p>}
            en={<p>Here the result is <M p=",">{t`\frac12`}</M> not <M p=".">0</M> With “<M p="”">{t`\infty\cdot 0`}</M> and “<M p="”">{t`\infty - \infty`}</M> you must rewrite until no fight is left.</p>} />
        </Box>
        <Box kind="misconception" title={<T de={<>«<M>{t`\sqrt{a + b} = \sqrt a + \sqrt b`}</M>»</>} en={<>“<M>{t`\sqrt{a + b} = \sqrt a + \sqrt b`}</M>”</>} />}>
          <T de={<p>Falsch: <M p=",">{t`\sqrt{9 + 16} = 5`}</M> aber <M p=".">{t`\sqrt9 + \sqrt{16} = 7`}</M> Mit diesem Fehler käme hier <M>{t`n\cdot\frac{1}{\sqrt n} = \sqrt n \to \infty`}</M> heraus.</p>}
            en={<p>Wrong: <M p=",">{t`\sqrt{9 + 16} = 5`}</M> but <M p=".">{t`\sqrt9 + \sqrt{16} = 7`}</M> With this mistake one would get <M>{t`n\cdot\frac{1}{\sqrt n} = \sqrt n \to \infty`}</M> here.</p>} />
        </Box>
        <Box kind="key">
          <T
            de={<ul>
              <li>Brüche: durch die höchste Potenz des Nenners teilen. Grad oben grösser: <M>{t`\pm\infty`}</M> (Vorzeichen der Leitzahlen); gleich: Quotient der Leitzahlen; kleiner: <M p=".">0</M></li>
              <li>Wurzel-Differenzen: mit der Summe erweitern (3. binomische Formel), dann kürzen und einsetzen.</li>
            </ul>}
            en={<ul>
              <li>Fractions: divide by the highest power of the denominator. Degree on top larger: <M>{t`\pm\infty`}</M> (sign of the leading coefficients); equal: ratio of the leading coefficients; smaller: <M p=".">0</M></li>
              <li>Differences of roots: expand with the sum (third binomial formula), then cancel and plug in.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Weiter: Summen von Folgen – <a href="#ana-reihen">Arithmetische, geometrische und harmonische Reihe</a>.</p>}
          en={<p>Next: sums of sequences – <a href="#ana-reihen">Arithmetic, geometric and harmonic series</a>.</p>}
        />
      </Section>
    </article>
  );
}
