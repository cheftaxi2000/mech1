import { Box, Derivation, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CoshAnimFig, HypExplorer, HyperbolaFigure, InverseHyp } from '../viz/ana/W7Figures';

const t = String.raw;

export default function A7Hyperbel() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Setzt man in Cosinus und Sinus statt <M>x</M> die imaginäre Zahl <M>{t`ix`}</M> ein, kommt nichts Komplexes heraus, sondern zwei neue reelle Funktionen: <M>\cosh</M> und <M p=".">\sinh</M> Sie sind aus <M>{t`e^x`}</M> und <M>{t`e^{-x}`}</M> gebaut, verhalten sich fast wie Cosinus und Sinus, und eine Kette, die frei durchhängt, hat genau die Form von <M p=".">\cosh</M></p>}
        en={<p className="lede">If you substitute the imaginary number <M>{t`ix`}</M> for <M>x</M> in cosine and sine, nothing complex comes out, but two new real functions: <M>\cosh</M> and <M p=".">\sinh</M> They are built from <M>{t`e^x`}</M> and <M p=",">{t`e^{-x}`}</M> behave almost like cosine and sine, and a chain hanging freely has exactly the shape of <M p=".">\cosh</M></p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="definition" title={<T de={<>1. Von <M>{t`\cos(ix)`}</M> zu <M>\cosh</M></>} en={<>1. From <M>{t`\cos(ix)`}</M> to <M>\cosh</M></>} />}>
        <Box kind="uebung" src={<Src u={7} p={8} />} title={<T de="Hyperbolische Funktionen" en="Hyperbolic functions" />}>
          <MD>{t`e^{ix} = \cos(x) + i\sin(x), \qquad \cos(x) = \frac{e^{ix} + e^{-ix}}{2}, \qquad \sin(x) = \frac{e^{ix} - e^{-ix}}{2i}`}</MD>
          <T de={<p>«Aber was passiert, wenn wir statt <M>x</M> einfach <M>{t`ix`}</M> in den <M>{t`\cos(\cdot)`}</M> oder <M>{t`-i\sin(\cdot)`}</M> einsetzen?»</p>} en={<p>“But what happens if we simply substitute <M>{t`ix`}</M> for <M>x</M> in <M>{t`\cos(\cdot)`}</M> or <M p="?">{t`-i\sin(\cdot)`}</M>”</p>} />
          <MD>{t`\cos(ix) = \frac{e^{x} + e^{-x}}{2} = \cosh(x), \qquad -i\sin(ix) = \frac{e^{x} - e^{-x}}{2} = \sinh(x)`}</MD>
          <MD>{t`\cosh(x) = \frac{e^x + e^{-x}}{2}, \qquad \sinh(x) = \frac{e^x - e^{-x}}{2}, \qquad \tanh(x) = \frac{\sinh(x)}{\cosh(x)}`}</MD>
        </Box>
        <Derivation title={<T de={<>Warum <M>{t`\cos(ix) = \cosh x`}</M></>} en={<>Why <M>{t`\cos(ix) = \cosh x`}</M></>} />}>
          <T
            de={<ol>
              <li>In der Formel für den Cosinus steht <M p=".">{t`e^{i\cdot(\text{Argument})}`}</M> Mit dem Argument <M>{t`ix`}</M> wird der Exponent <M p=",">{t`i\cdot ix = i^2 x = -x`}</M> denn <M p=".">{t`i^2 = -1`}</M></li>
              <li>Der zweite Exponent wird <M p=".">{t`-i\cdot ix = +x`}</M> Also <M p=":">{t`\cos(ix) = \frac{e^{-x} + e^{x}}{2}`}</M> nur reelle Zahlen.</li>
              <li>Beim Sinus genauso: <M p=".">{t`\sin(ix) = \frac{e^{-x} - e^{x}}{2i} = \frac{-(e^x - e^{-x})}{2i}`}</M> Mit <M>{t`\frac{1}{i} = -i`}</M> wird das <M p=".">{t`i\,\frac{e^x - e^{-x}}{2} = i\sinh x`}</M> Mal <M>{t`-i`}</M> gibt <M p=".">{t`-i\cdot i\sinh x = \sinh x`}</M></li>
            </ol>}
            en={<ol>
              <li>The cosine formula contains <M p=".">{t`e^{i\cdot(\text{argument})}`}</M> With the argument <M>{t`ix`}</M> the exponent becomes <M p=",">{t`i\cdot ix = i^2 x = -x`}</M> because <M p=".">{t`i^2 = -1`}</M></li>
              <li>The second exponent becomes <M p=".">{t`-i\cdot ix = +x`}</M> So <M p=":">{t`\cos(ix) = \frac{e^{-x} + e^{x}}{2}`}</M> only real numbers.</li>
              <li>The same for the sine: <M p=".">{t`\sin(ix) = \frac{e^{-x} - e^{x}}{2i} = \frac{-(e^x - e^{-x})}{2i}`}</M> With <M>{t`\frac{1}{i} = -i`}</M> this becomes <M p=".">{t`i\,\frac{e^x - e^{-x}}{2} = i\sinh x`}</M> Times <M>{t`-i`}</M> gives <M p=".">{t`-i\cdot i\sinh x = \sinh x`}</M></li>
            </ol>}
          />
        </Derivation>
        <T
          de={<p className="keep"><b>So liest man die Definitionen.</b> <M>\cosh x</M> ist der <b>Mittelwert</b> von <M>{t`e^x`}</M> und <M p=":">{t`e^{-x}`}</M> die halbe Summe. <M>\sinh x</M> ist die halbe Differenz. Die Animation baut beide aus den zwei Exponentialkurven: halbieren, addieren, subtrahieren, teilen.</p>}
          en={<p className="keep"><b>How to read the definitions.</b> <M>\cosh x</M> is the <b>average</b> of <M>{t`e^x`}</M> and <M p=":">{t`e^{-x}`}</M> half the sum. <M>\sinh x</M> is half the difference. The animation builds both from the two exponential curves: halve, add, subtract, divide.</p>}
        />
        <StepPlayer
          label={tr('Animation: cosh, sinh und tanh aus e hoch x', 'Animation: cosh, sinh and tanh from e to the x')}
          steps={[
            { ms: 600, holdMs: 2400, caption: <T de={<>Die zwei Bausteine: <M>{t`e^x`}</M> steigt nach rechts, <M>{t`e^{-x}`}</M> ist ihr Spiegelbild an der y-Achse.</>} en={<>The two building blocks: <M>{t`e^x`}</M> rises to the right, <M>{t`e^{-x}`}</M> is its mirror image in the y-axis.</>} /> },
            { ms: 1200, holdMs: 2400, caption: <T de={<>Beide halbieren: <M>{t`\tfrac{e^x}{2}`}</M> und <M p=".">{t`\tfrac{e^{-x}}{2}`}</M> Beide gehen durch <M p=".">{t`(0;\, \tfrac12)`}</M></>} en={<>Halve both: <M>{t`\tfrac{e^x}{2}`}</M> and <M p=".">{t`\tfrac{e^{-x}}{2}`}</M> Both pass through <M p=".">{t`(0,\, \tfrac12)`}</M></>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Addieren: Über jedem <M>x</M> werden die zwei Höhen aufeinandergestapelt. Das gibt <M p=",">{t`\cosh x`}</M> mit dem tiefsten Punkt <M p=".">{t`\tfrac12 + \tfrac12 = 1`}</M></>} en={<>Add: above each <M>x</M> the two heights are stacked. That gives <M p=",">{t`\cosh x`}</M> with the lowest point <M p=".">{t`\tfrac12 + \tfrac12 = 1`}</M></>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Subtrahieren: <M>{t`\tfrac{e^x}{2} - \tfrac{e^{-x}}{2}`}</M> gibt <M p=",">{t`\sinh x`}</M> durch den Ursprung, links negativ.</>} en={<>Subtract: <M>{t`\tfrac{e^x}{2} - \tfrac{e^{-x}}{2}`}</M> gives <M p=",">{t`\sinh x`}</M> through the origin, negative on the left.</>} /> },
            { ms: 1600, holdMs: 3000, caption: <T de={<>Teilen: <M>{t`\tanh x = \sinh x / \cosh x`}</M> bleibt zwischen <M>-1</M> und <M>1</M> und schmiegt sich an die Geraden <M>{t`y = \pm 1`}</M> an.</>} en={<>Divide: <M>{t`\tanh x = \sinh x / \cosh x`}</M> stays between <M>-1</M> and <M>1</M> and hugs the lines <M p=".">{t`y = \pm 1`}</M></>} /> },
          ]}
        >
          {(step, tt) => <CoshAnimFig step={step} t={tt} />}
        </StepPlayer>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="graphen" title={<T de="2. Die drei Graphen" en="2. The three graphs" />}>
        <Box kind="uebung" src={<Src u={7} p={8} />} title={<T de="Eigenschaften" en="Properties" />}>
          <T de={<p>Graphen von <M>\cosh</M> (blau), <M>\sinh</M> (magenta), <M>\tanh</M> (grün). «<M p=":">\cosh</M> achsensymmetrisch zur y-Achse, also gerade; <M>\sinh</M> und <M p=":">\tanh</M> punktsymmetrisch zum Ursprung, also ungerade.»</p>} en={<p>Graphs of <M>\cosh</M> (blue), <M>\sinh</M> (magenta), <M>\tanh</M> (green). “<M p=":">\cosh</M> symmetric about the y-axis, i.e. even; <M>\sinh</M> and <M p=":">\tanh</M> point-symmetric about the origin, i.e. odd.”</p>} />
          <MD>{t`\cosh(0) = 1, \qquad \sinh(0) = 0, \qquad \tanh(0) = 0`}</MD>
          <T de={<p>«<M p=".">{t`\cosh x \ge 1`}</M> Der Graph von <M>\tanh</M> bleibt zwischen <M>-1</M> und <M p=".»">1</M></p>} en={<p>“<M p=".">{t`\cosh x \ge 1`}</M> The graph of <M>\tanh</M> stays between <M>-1</M> and <M p=".”">1</M></p>} />
          <MD>{t`\lim_{x\to\infty}\tanh(x) = 1, \qquad \lim_{x\to-\infty}\tanh(x) = -1`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>Warum gilt das alles?</b> Ersetzt man <M>x</M> durch <M p=",">-x</M> tauschen <M>{t`e^x`}</M> und <M>{t`e^{-x}`}</M> die Rollen.</p>
            <ul className="keep">
              <li>Die Summe bleibt gleich: <M p=".">{t`\cosh(-x) = \cosh x`}</M> Gerade.</li>
              <li>Die Differenz wechselt das Vorzeichen: <M p=".">{t`\sinh(-x) = -\sinh x`}</M> Ungerade. <M>\tanh</M> ist ungerade durch gerade, also ungerade.</li>
              <li><M p=":">{t`\cosh x \ge 1`}</M> Der Mittelwert zweier positiver Zahlen <M>a</M> und <M>{t`1/a`}</M> ist mindestens 1, mit Gleichheit nur bei <M p=",">{t`a = 1`}</M> also <M p=".">{t`x = 0`}</M></li>
              <li><M p=",">{t`|\tanh x| < 1`}</M> weil <M>{t`|e^x - e^{-x}| < e^x + e^{-x}`}</M> (beide Summanden sind positiv). Für grosse <M>x</M> ist <M>{t`e^{-x}`}</M> winzig, also <M p=".">{t`\tanh x \approx e^x / e^x = 1`}</M></li>
            </ul>
          </>}
          en={<>
            <p className="keep"><b>Why does all this hold?</b> Replacing <M>x</M> by <M>-x</M> swaps the roles of <M>{t`e^x`}</M> and <M p=".">{t`e^{-x}`}</M></p>
            <ul className="keep">
              <li>The sum stays the same: <M p=".">{t`\cosh(-x) = \cosh x`}</M> Even.</li>
              <li>The difference changes sign: <M p=".">{t`\sinh(-x) = -\sinh x`}</M> Odd. <M>\tanh</M> is odd over even, hence odd.</li>
              <li><M p=":">{t`\cosh x \ge 1`}</M> the average of two positive numbers <M>a</M> and <M>{t`1/a`}</M> is at least 1, with equality only for <M p=",">{t`a = 1`}</M> i.e. <M p=".">{t`x = 0`}</M></li>
              <li><M p=",">{t`|\tanh x| < 1`}</M> because <M>{t`|e^x - e^{-x}| < e^x + e^{-x}`}</M> (both terms are positive). For large <M p=",">x</M> <M>{t`e^{-x}`}</M> is tiny, so <M p=".">{t`\tanh x \approx e^x / e^x = 1`}</M></li>
            </ul>
          </>}
        />
        <HypExplorer />
        <T
          de={<p className="keep"><b>Beispiel aus einer Prüfung (SC 4, S. 10).</b> Welche Funktion ist für <M>{t`x \to +\infty`}</M> eine Asymptote von <M p="?">{t`\cosh(2x)`}</M> Es ist <M p=".">{t`\cosh(2x) = \tfrac{e^{2x}}{2} + \tfrac{e^{-2x}}{2}`}</M> Der zweite Teil geht gegen 0. Also schmiegt sich der Graph an <M>{t`g(x) = \tfrac{e^{2x}}{2}`}</M> an (Antwort C): Der Unterschied <M>{t`\cosh(2x) - g(x) = \tfrac{e^{-2x}}{2}`}</M> verschwindet. Im Bild oben sieht man dasselbe für <M p=":">{t`\cosh x`}</M> Er liegt für grosse <M>x</M> auf <M p=".">{t`e^x/2`}</M></p>}
          en={<p className="keep"><b>Example from an exam (SC 4, p. 10).</b> Which function is an asymptote of <M>{t`\cosh(2x)`}</M> for <M p="?">{t`x \to +\infty`}</M> We have <M p=".">{t`\cosh(2x) = \tfrac{e^{2x}}{2} + \tfrac{e^{-2x}}{2}`}</M> The second part goes to 0. So the graph hugs <M>{t`g(x) = \tfrac{e^{2x}}{2}`}</M> (answer C): the difference <M>{t`\cosh(2x) - g(x) = \tfrac{e^{-2x}}{2}`}</M> vanishes. The figure above shows the same for <M p=":">{t`\cosh x`}</M> for large <M>x</M> it lies on <M p=".">{t`e^x/2`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="rechnen" title={<T de="3. Rechnen mit sinh und cosh" en="3. Calculating with sinh and cosh" />}>
        <Box kind="uebung" src={<Src u={7} p={9} />} title={<T de="Rechenregeln" en="Rules" />}>
          <MD>{t`\cos^2(ix) + \sin^2(ix) = 1, \quad \cos(ix) = \cosh(x), \quad \sin(ix) = i\sinh(x) \quad\Rightarrow\quad \cosh^2(x) - \sinh^2(x) = 1`}</MD>
          <MD>{t`(\sinh x)' = \cosh x, \qquad (\cosh x)' = \sinh x, \qquad (\tanh x)' = \frac{\cosh^2 x - \sinh^2 x}{\cosh^2 x} = \frac{1}{\cosh^2 x}`}</MD>
          <T de={<p>«Bei der Ableitung von <M>\cosh</M> entsteht kein Minuszeichen.» Additionsformeln:</p>} en={<p>“No minus sign appears when differentiating <M p=".">\cosh</M>” Addition formulas:</p>} />
          <MD>{t`\sinh(x + y) = \sinh x\cosh y + \cosh x\sinh y, \qquad \cosh(x + y) = \cosh x\cosh y + \sinh x\sinh y`}</MD>
        </Box>
        <Derivation title={<T de={<>Die Grundgleichung <M>{t`\cosh^2 x - \sinh^2 x = 1`}</M> und die Ableitungen</>} en={<>The basic identity <M>{t`\cosh^2 x - \sinh^2 x = 1`}</M> and the derivatives</>} />}>
          <T
            de={<ol>
              <li>Aus <M>{t`\cos^2 + \sin^2 = 1`}</M> mit dem Argument <M p=":">{t`ix`}</M> <M p=".">{t`\cosh^2 x + (i\sinh x)^2 = \cosh^2 x + i^2\sinh^2 x = \cosh^2 x - \sinh^2 x = 1`}</M> Aus dem Plus wird ein Minus, wegen <M p=".">{t`i^2 = -1`}</M></li>
              <li>Direkt nachgerechnet: <M p=".">{t`\bigl(\tfrac{e^x + e^{-x}}{2}\bigr)^2 - \bigl(\tfrac{e^x - e^{-x}}{2}\bigr)^2 = \tfrac{(e^{2x} + 2 + e^{-2x}) - (e^{2x} - 2 + e^{-2x})}{4} = \tfrac{4}{4} = 1`}</M> Die «2» ist <M p=".">{t`2e^x e^{-x}`}</M></li>
              <li>Ableiten mit <M>{t`(e^x)' = e^x`}</M> und <M p=":">{t`(e^{-x})' = -e^{-x}`}</M> <M p=".">{t`(\cosh x)' = \tfrac{e^x - e^{-x}}{2} = \sinh x`}</M> Das Minus der inneren Ableitung macht aus der Summe die Differenz, nicht aus <M>\cosh</M> ein <M p=".">{t`-\sinh`}</M> Ebenso <M p=".">{t`(\sinh x)' = \tfrac{e^x + e^{-x}}{2} = \cosh x`}</M></li>
              <li>Quotientenregel: <M p=",">{t`(\tanh x)' = \tfrac{\cosh x\cdot\cosh x - \sinh x\cdot\sinh x}{\cosh^2 x}`}</M> und der Zähler ist nach Schritt 1 gleich 1.</li>
            </ol>}
            en={<ol>
              <li>From <M>{t`\cos^2 + \sin^2 = 1`}</M> with the argument <M p=":">{t`ix`}</M> <M p=".">{t`\cosh^2 x + (i\sinh x)^2 = \cosh^2 x + i^2\sinh^2 x = \cosh^2 x - \sinh^2 x = 1`}</M> The plus becomes a minus, because <M p=".">{t`i^2 = -1`}</M></li>
              <li>Checked directly: <M p=".">{t`\bigl(\tfrac{e^x + e^{-x}}{2}\bigr)^2 - \bigl(\tfrac{e^x - e^{-x}}{2}\bigr)^2 = \tfrac{(e^{2x} + 2 + e^{-2x}) - (e^{2x} - 2 + e^{-2x})}{4} = \tfrac{4}{4} = 1`}</M> The “2” is <M p=".">{t`2e^x e^{-x}`}</M></li>
              <li>Differentiate with <M>{t`(e^x)' = e^x`}</M> and <M p=":">{t`(e^{-x})' = -e^{-x}`}</M> <M p=".">{t`(\cosh x)' = \tfrac{e^x - e^{-x}}{2} = \sinh x`}</M> The minus of the inner derivative turns the sum into the difference; it does not turn <M>\cosh</M> into <M p=".">{t`-\sinh`}</M> Likewise <M p=".">{t`(\sinh x)' = \tfrac{e^x + e^{-x}}{2} = \cosh x`}</M></li>
              <li>Quotient rule: <M p=",">{t`(\tanh x)' = \tfrac{\cosh x\cdot\cosh x - \sinh x\cdot\sinh x}{\cosh^2 x}`}</M> and by step 1 the numerator is 1.</li>
            </ol>}
          />
        </Derivation>
        <Box kind="supplement" keep title={<T de="Woher der Name «hyperbolisch»?" en="Where does the name “hyperbolic” come from?" />}>
          <T
            de={<p>Die Gleichung <M>{t`\cos^2 t + \sin^2 t = 1`}</M> sagt: <M>{t`(\cos t, \sin t)`}</M> liegt auf dem Kreis <M p=".">{t`x^2 + y^2 = 1`}</M> Die neue Gleichung <M>{t`\cosh^2 t - \sinh^2 t = 1`}</M> sagt: <M>{t`(\cosh t, \sinh t)`}</M> liegt auf der Hyperbel <M p=".">{t`x^2 - y^2 = 1`}</M> Darum heissen Kreisfunktionen «trigonometrisch» und diese hier «hyperbolisch».</p>}
            en={<p>The equation <M>{t`\cos^2 t + \sin^2 t = 1`}</M> says: <M>{t`(\cos t, \sin t)`}</M> lies on the circle <M p=".">{t`x^2 + y^2 = 1`}</M> The new equation <M>{t`\cosh^2 t - \sinh^2 t = 1`}</M> says: <M>{t`(\cosh t, \sinh t)`}</M> lies on the hyperbola <M p=".">{t`x^2 - y^2 = 1`}</M> That is why the circle functions are called “trigonometric” and these “hyperbolic”.</p>}
          />
          <HyperbolaFigure />
        </Box>
        <Box kind="misconception" title={<T de={<>«Die Ableitung von <M>\cosh</M> ist <M p=",">{t`-\sinh`}</M> wie beim Cosinus»</>} en={<>“The derivative of <M>\cosh</M> is <M p=",">{t`-\sinh`}</M> as for cosine”</>} />}>
          <T
            de={<p>Beim Cosinus gilt <M p=",">{t`(\cos x)' = -\sin x`}</M> bei <M>\cosh</M> aber <M>{t`(\cosh x)' = +\sinh x`}</M> (Schritt 3 oben). Die Übung betont es eigens. Prüfe am Graphen: Rechts von 0 steigt <M>\cosh</M> und <M>\sinh</M> ist dort positiv.</p>}
            en={<p>For cosine <M p=",">{t`(\cos x)' = -\sin x`}</M> but for <M>\cosh</M> <M>{t`(\cosh x)' = +\sinh x`}</M> (step 3 above). The exercise class stresses it explicitly. Check with the graph: right of 0, <M>\cosh</M> rises and <M>\sinh</M> is positive there.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="umkehr" title={<T de="4. Umkehrfunktionen" en="4. Inverse functions" />}>
        <Box kind="uebung" src={<Src u={7} p={9} />} title={<T de="Umkehrfunktionen auf einen Blick" en="Inverse functions at a glance" />}>
          <MD>{t`\operatorname{Arsinh} x = \ln\bigl(x + \sqrt{x^2 + 1}\bigr),\ x \in \mathbb R, \qquad (\operatorname{Arsinh} x)' = \frac{1}{\sqrt{x^2 + 1}}`}</MD>
          <MD>{t`\operatorname{Arcosh} x = \ln\bigl(x + \sqrt{x^2 - 1}\bigr),\ x \ge 1, \qquad (\operatorname{Arcosh} x)' = \frac{1}{\sqrt{x^2 - 1}},\ x > 1`}</MD>
          <MD>{t`\operatorname{Artanh} x = \frac12\ln\Bigl(\frac{1 + x}{1 - x}\Bigr),\ -1 < x < 1, \qquad (\operatorname{Artanh} x)' = \frac{1}{1 - x^2}`}</MD>
          <T de={<p>S. 10: die Graphen von <M>{t`\operatorname{artanh}`}</M> (zwischen <M p="),">{t`x = \pm 1`}</M> <M>{t`\operatorname{arsinh}`}</M> und <M>{t`\operatorname{arcosh}`}</M> (ab <M p=").">{t`(1, 0)`}</M></p>} en={<p>P. 10: the graphs of <M>{t`\operatorname{artanh}`}</M> (between <M p=")">{t`x = \pm 1`}</M> <M p=",">{t`\operatorname{arsinh}`}</M> and <M>{t`\operatorname{arcosh}`}</M> (from <M p=").">{t`(1, 0)`}</M></p>} />
        </Box>
        <Derivation title={<T de={<>Woher kommt <M p="?">{t`\operatorname{Arsinh} x = \ln(x + \sqrt{x^2 + 1})`}</M></>} en={<>Where does <M>{t`\operatorname{Arsinh} x = \ln(x + \sqrt{x^2 + 1})`}</M> come from?</>} />}>
          <T
            de={<ol>
              <li>Gesucht ist <M>y</M> mit <M p=".">{t`\sinh y = x`}</M> Ausgeschrieben: <M p=".">{t`\tfrac{e^y - e^{-y}}{2} = x`}</M></li>
              <li>Setze <M>{t`u = e^y > 0`}</M> und multipliziere mit <M p=":">{t`2u`}</M> <M p=",">{t`u^2 - 1 = 2xu`}</M> also <M p=".">{t`u^2 - 2xu - 1 = 0`}</M></li>
              <li>Mitternachtsformel: <M p=".">{t`u = x \pm \sqrt{x^2 + 1}`}</M> Das Minus gäbe eine negative Zahl (denn <M p=")">{t`\sqrt{x^2 + 1} > |x|`}</M> aber <M>{t`u = e^y`}</M> ist positiv. Also <M p=".">{t`u = x + \sqrt{x^2 + 1}`}</M></li>
              <li>Zurück: <M p=".">{t`y = \ln u = \ln\bigl(x + \sqrt{x^2 + 1}\bigr)`}</M> Für <M>\cosh</M> geht es genauso; dort muss man <M>{t`y \ge 0`}</M> wählen, damit die Umkehrung eindeutig ist.</li>
            </ol>}
            en={<ol>
              <li>We look for <M>y</M> with <M p=".">{t`\sinh y = x`}</M> Written out: <M p=".">{t`\tfrac{e^y - e^{-y}}{2} = x`}</M></li>
              <li>Put <M>{t`u = e^y > 0`}</M> and multiply by <M p=":">{t`2u`}</M> <M p=",">{t`u^2 - 1 = 2xu`}</M> so <M p=".">{t`u^2 - 2xu - 1 = 0`}</M></li>
              <li>Quadratic formula: <M p=".">{t`u = x \pm \sqrt{x^2 + 1}`}</M> The minus would give a negative number (since <M p=")">{t`\sqrt{x^2 + 1} > |x|`}</M> but <M>{t`u = e^y`}</M> is positive. So <M p=".">{t`u = x + \sqrt{x^2 + 1}`}</M></li>
              <li>Back: <M p=".">{t`y = \ln u = \ln\bigl(x + \sqrt{x^2 + 1}\bigr)`}</M> For <M>\cosh</M> it works the same way; there one has to choose <M>{t`y \ge 0`}</M> so that the inverse is unique.</li>
            </ol>}
          />
        </Derivation>
        <T
          de={<p className="keep">Eine Umkehrfunktion entsteht durch Spiegeln an der Geraden <M p=".">{t`y = x`}</M> Das geht nur, wo die Funktion streng monoton ist. <M>\sinh</M> und <M>\tanh</M> sind überall streng wachsend. <M>\cosh</M> fällt links von 0 und steigt rechts: Man nimmt nur die rechte Hälfte, darum ist <M>{t`\operatorname{Arcosh}`}</M> nur für <M>{t`x \ge 1`}</M> definiert und immer <M p=".">{t`\ge 0`}</M> <M>\tanh</M> nimmt nur Werte zwischen <M>-1</M> und <M>1</M> an, darum ist <M>{t`\operatorname{Artanh}`}</M> nur dort definiert.</p>}
          en={<p className="keep">An inverse function arises by mirroring in the line <M p=".">{t`y = x`}</M> That only works where the function is strictly monotonic. <M>\sinh</M> and <M>\tanh</M> are strictly increasing everywhere. <M>\cosh</M> falls left of 0 and rises on the right: one takes only the right half, so <M>{t`\operatorname{Arcosh}`}</M> is defined only for <M>{t`x \ge 1`}</M> and is always <M p=".">{t`\ge 0`}</M> <M>\tanh</M> only takes values between <M>-1</M> and <M p=",">1</M> so <M>{t`\operatorname{Artanh}`}</M> is defined only there.</p>}
        />
        <InverseHyp />
      </Section>
    </article>
  );
}
