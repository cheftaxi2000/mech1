import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { StepPlayer } from '../viz/anim/StepPlayer';
import { CombineExplorer, LineExplorer, LineSceneFig, TwoLinesExplorer } from '../viz/la/LgsFigures';
import { COMBINE_WIN, SIMPLIFY_WIN, combineScene, simplifyScene } from '../viz/la/lineScenes';
import { PlanesExplorer } from '../viz/la/PlanesExplorer';
import '../viz/la/l12.css';

const t = String.raw;

function CombineAnimation() {
  const tr = useTr();
  return (
    <StepPlayer label={tr('Warum E1 + E2 durch den Schnittpunkt geht', 'Why E1 + E2 passes through the intersection')} steps={[
      { ms: 1400, caption: <T de={<>Die Geraden <M>{'E_1'}</M> (blau) und <M>{'E_2'}</M> (magenta) schneiden sich im roten Punkt <M p=".">{t`(x_0, y_0)`}</M> Dieser Punkt löst das System.</>} en={<>The lines <M>{'E_1'}</M> (blue) and <M>{'E_2'}</M> (magenta) meet in the red point <M p=".">{t`(x_0, y_0)`}</M> This point solves the system.</>} /> },
      { ms: 1200, caption: <T de={<>Der Punkt erfüllt beide Gleichungen. Also ist <M>{t`2x_0 + 3y_0`}</M> die Zahl <M>5</M> und <M>{t`x_0 - 2y_0`}</M> die Zahl <M p=".">{t`-1`}</M> Es sind nur noch Zahlen.</>} en={<>The point satisfies both equations. So <M>{t`2x_0 + 3y_0`}</M> is the number <M>5</M> and <M>{t`x_0 - 2y_0`}</M> is the number <M p=".">{t`-1`}</M> They are just numbers now.</>} /> },
      { ms: 1500, caption: <T de={<>Zahlen darf man addieren: <M p=".">{t`(2x_0 + 3y_0) + (x_0 - 2y_0) = 5 + (-1) = 4`}</M> Links steht <M p=",">{t`3x_0 + y_0`}</M> also liegt der Punkt auch auf <M>{t`3x + y = 4`}</M> (türkis).</>} en={<>Numbers may be added: <M p=".">{t`(2x_0 + 3y_0) + (x_0 - 2y_0) = 5 + (-1) = 4`}</M> On the left stands <M p=",">{t`3x_0 + y_0`}</M> so the point also lies on <M>{t`3x + y = 4`}</M> (teal).</>} /> },
    ]}>
      {(step, tt) => <LineSceneFig scene={combineScene(step, tt)} win={COMBINE_WIN} label={tr('E1, E2 und E1 + E2 durch den Punkt (1, 1)', 'E1, E2 and E1 + E2 through the point (1, 1)')} />}
    </StepPlayer>
  );
}

function SimplifyAnimation() {
  const tr = useTr();
  return (
    <StepPlayer label={tr('Vereinfachen: waagrechte und senkrechte Gerade durch denselben Punkt', 'Simplifying: horizontal and vertical line through the same point')} steps={[
      { ms: 1400, caption: <T de={<><M>{t`E_1: x - 2y = -2`}</M> (blau) und <M>{t`E_2: x + y = 2`}</M> (magenta) schneiden sich in einem Punkt. Wo genau, kann man schlecht ablesen.</>} en={<><M>{t`E_1: x - 2y = -2`}</M> (blue) and <M>{t`E_2: x + y = 2`}</M> (magenta) meet in one point. Where exactly is hard to read off.</>} /> },
      { ms: 1800, caption: <T de={<>Rechne <M p=":">{t`E_1 - E_2`}</M> Das <M>x</M> fällt weg, es bleibt <M p=".">{t`-3y = -4`}</M> Die neue Gerade (türkis) dreht sich aus <M>{'E_1'}</M> heraus, ist am Ende waagrecht und geht immer durch denselben Punkt.</>} en={<>Compute <M p=".">{t`E_1 - E_2`}</M> The <M>x</M> drops out, <M>{t`-3y = -4`}</M> is left. The new line (teal) turns out of <M p=",">{'E_1'}</M> ends up horizontal and always passes through the same point.</>} /> },
      { ms: 1800, caption: <T de={<>Rechne <M p=":">{t`E_1 + 2E_2`}</M> Jetzt fällt <M>y</M> weg, es bleibt <M p=".">{t`3x = 2`}</M> Diese Gerade (violett) ist senkrecht, wieder durch denselben Punkt.</>} en={<>Compute <M p=".">{t`E_1 + 2E_2`}</M> Now <M>y</M> drops out, <M>{t`3x = 2`}</M> is left. This line (purple) is vertical, again through the same point.</>} /> },
      { ms: 1400, caption: <T de={<>Waagrecht und senkrecht lässt sich ablesen: <M p="," >{t`y = \tfrac{4}{3}`}</M> <M p=".">{t`x = \tfrac{2}{3}`}</M> Das ist der Schnittpunkt der ursprünglichen Geraden (blass).</>} en={<>Horizontal and vertical can be read off: <M p=",">{t`y = \tfrac{4}{3}`}</M> <M p=".">{t`x = \tfrac{2}{3}`}</M> This is the intersection of the original lines (pale).</>} /> },
    ]}>
      {(step, tt) => <LineSceneFig scene={simplifyScene(step, tt)} win={SIMPLIFY_WIN} label={tr('Zwei Geraden werden durch eine waagrechte und eine senkrechte ersetzt', 'Two lines are replaced by a horizontal and a vertical one')} />}
    </StepPlayer>
  );
}

export default function LA2Lgs() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Gleichung mit zwei Unbekannten ist eine Gerade. Ein <b>lineares Gleichungssystem</b> (LGS) sind mehrere solche Geraden, und seine Lösung ist der Punkt, an dem sie sich treffen. Diese Lektion zeigt das in der Ebene und im Raum. Das Rechenverfahren dazu, Gauss, folgt in der Lektion <a href="#la-gauss">Das Gauss-Verfahren</a>.</p>}
        en={<p className="lede">An equation with two unknowns is a line. A <b>system of linear equations</b> (<De en="linear system">lineares Gleichungssystem, LGS</De>) is several such lines, and its solution is the point where they meet. This lesson shows this in the plane and in space. The method of calculation, Gauss, follows in the lesson <a href="#la-gauss">Gaussian elimination</a>.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Zwei Freunde beschreiben einen Treffpunkt. Der eine sagt: «irgendwo auf der Bahnhofstrasse». Der andere: «irgendwo auf dem Limmatquai». Jede Angabe allein ist eine ganze Linie. Erst zusammen geben sie einen Punkt: die Kreuzung. Genau so löst man ein Gleichungssystem.</p>}
          en={<p>Two friends describe a meeting place. One says: “somewhere on Bahnhofstrasse”. The other: “somewhere on Limmatquai”. Each statement alone is a whole line. Only together they give a point: the crossing. That is exactly how a system of equations is solved.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="linear" title={<T de="1. Linear oder nicht?" en="1. Linear or not?" />}>
        <Box kind="uebung" src={<Src u={2} p={4} slides />} title={<T de="«Warm up: Welche Gleichungen sind linear?»" en="“Warm up: which eqs. are linear?”" />}>
          <ul className="l12-warm keep">
            <li><span className="tick yes" aria-label="linear">✓</span><M>{t`x_1 + 18x_2 - 3x_3 + 5x_4 = 6`}</M>
              <T de={<span className="why">Jede Unbekannte steht allein, nur mit einer Zahl davor. Das ist linear, egal wie viele Unbekannte.</span>} en={<span className="why">Every unknown stands alone, with only a number in front. That is linear, no matter how many unknowns.</span>} /></li>
            <li><span className="tick no" aria-label="not linear">✗</span><M>{t`x_1 + x_2 + x_3 = \cos(x_1)`}</M>
              <T de={<span className="why">Rechts steht der Kosinus einer Unbekannten. Eine Funktion von <M>{'x_1'}</M> ist nicht linear.</span>} en={<span className="why">On the right stands the cosine of an unknown. A function of <M>{'x_1'}</M> is not linear.</span>} /></li>
            <li><span className="tick yes" aria-label="linear">✓</span><M>{t`\sin(8)\,x_1 + 3x_2 + 5x_3 = 0`}</M>
              <T de={<span className="why"><M>{t`\sin(8)`}</M> ist nur eine Zahl (etwa <M p=").">{t`0{,}989`}</M> Sie steht vor <M>{'x_1'}</M> wie die <M>3</M> vor <M p=".">{'x_2'}</M></span>} en={<span className="why"><M>{t`\sin(8)`}</M> is just a number (about <M p=").">{t`0.989`}</M> It stands in front of <M>{'x_1'}</M> like the <M>3</M> in front of <M p=".">{'x_2'}</M></span>} /></li>
            <li><span className="tick no" aria-label="not linear">✗</span><M>{t`-x + x\cdot y + z = 3`}</M>
              <T de={<span className="why">Hier werden zwei Unbekannte miteinander multipliziert: <M p=".">{t`x\cdot y`}</M> Das ist nicht linear.</span>} en={<span className="why">Here two unknowns are multiplied with each other: <M p=".">{t`x\cdot y`}</M> That is not linear.</span>} /></li>
          </ul>
        </Box>
        <Box kind="supplement">
          <T
            de={<p>Die Regel hinter den Häkchen: Eine Gleichung ist <b>linear</b>, wenn sie die Form <M>{t`a_1x_1 + a_2x_2 + \ldots + a_nx_n = b`}</M> hat. Die <M>{'a_i'}</M> und <M>b</M> sind feste Zahlen. Keine Unbekannte steht in einer Funktion, in einer Potenz oder in einem Produkt mit einer anderen Unbekannten.</p>}
            en={<p>The rule behind the ticks: an equation is <b>linear</b> if it has the form <M p=".">{t`a_1x_1 + a_2x_2 + \ldots + a_nx_n = b`}</M> The <M>{'a_i'}</M> and <M>b</M> are fixed numbers. No unknown stands inside a function, in a power or in a product with another unknown.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="gerade" title={<T de="2. Eine lineare Gleichung ist eine Gerade" en="2. A linear equation is a line" />}>
        <Box kind="uebung" src={<Src u={2} p={5} slides />} title={<T de="«Linear Equation»" en="“Linear Equation”" />}>
          <MD>{t`4x + 6y = 10`}</MD>
          <T
            de={<p>Bild: die Gerade dieser Gleichung. «Die Lösungen dieser linearen Gleichung sind alle Punkte auf dieser Geraden.»</p>}
            en={<p>Figure: the line of this equation. “The solutions to this linear equation would be any point on this line.”</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Eine <em>Lösung</em> ist ein Zahlenpaar <M p=",">{t`(x, y)`}</M> das die Gleichung wahr macht. Zum Beispiel <M p=":">{t`(1, 1)`}</M> <M p=".">{t`4\cdot 1 + 6\cdot 1 = 10`}</M> Es gibt aber unendlich viele solche Paare.</p>
            <p className="keep">Warum bilden sie eine Gerade? Löse nach <M>y</M> auf: <M p=".">{t`y = \tfrac{5}{3} - \tfrac{2}{3}x`}</M> Das ist eine Gerade mit Steigung <M p=",">{t`-\tfrac23`}</M> wie in der Analysis. Jeder Punkt darauf ist eine Lösung, jeder andere Punkt nicht.</p>
            <p>Im Bild kannst du den roten Punkt entlang der Geraden ziehen. Unten wird die Gleichung mit seinen Koordinaten nachgerechnet, exakt mit Brüchen. Mit <M>a</M> und <M>b</M> kippt die Gerade, mit <M>c</M> verschiebt sie sich parallel.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> a <em>solution</em> is a pair of numbers <M>{t`(x, y)`}</M> that makes the equation true. For example <M p=":">{t`(1, 1)`}</M> <M p=".">{t`4\cdot 1 + 6\cdot 1 = 10`}</M> But there are infinitely many such pairs.</p>
            <p className="keep">Why do they form a line? Solve for <M p=":">y</M> <M p=".">{t`y = \tfrac{5}{3} - \tfrac{2}{3}x`}</M> That is a line with slope <M p=",">{t`-\tfrac23`}</M> as in analysis. Every point on it is a solution, every other point is not.</p>
            <p>In the figure you can drag the red point along the line. Below, the equation is checked with its coordinates, exactly with fractions. With <M>a</M> and <M>b</M> the line tilts, with <M>c</M> it shifts parallel.</p>
          </>}
        />
        <LineExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="system" title={<T de="3. Ein System ist ein Schnitt" en="3. A system is an intersection" />}>
        <Box kind="uebung" src={<Src u={2} p="6–10" slides />} title={<T de="«Was ist ein lineares Gleichungssystem wirklich?» und «Anzahl Lösungen»" en="“What is a system of linear equations really?” and “Number of Solutions”" />}>
          <MD>{t`\tfrac12 x + y = 2, \qquad 3x - 2y = 1`}</MD>
          <T
            de={<p>Zwei Geraden in einem Bild: «Der Schnittpunkt löst das System!» Dann drei Systeme nebeneinander:</p>}
            en={<p>Two lines in one figure: “Intersection point solves system!” Then three systems side by side:</p>}
          />
          <T
            de={<ul>
              <li><M>{t`2x + 3y = 5`}</M> und <M p=":">{t`3x - 2y = 0`}</M> Die Geraden schneiden sich in einem Punkt.</li>
              <li><M>{t`2x + 3y = 5`}</M> und <M p=":">{t`4x + 6y = 10`}</M> «Dieselbe Gleichung, aber Faktor 2», die Geraden liegen aufeinander.</li>
              <li><M>{t`2x + 3y = 5`}</M> und <M p=":">{t`4x + 6y = 5`}</M> «parallel».</li>
            </ul>}
            en={<ul>
              <li><M>{t`2x + 3y = 5`}</M> and <M p=":">{t`3x - 2y = 0`}</M> the lines meet in one point.</li>
              <li><M>{t`2x + 3y = 5`}</M> and <M p=":">{t`4x + 6y = 10`}</M> “same eq. but factor 2”, the lines overlap.</li>
              <li><M>{t`2x + 3y = 5`}</M> and <M p=":">{t`4x + 6y = 5`}</M> “parallel”.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Eine Lösung des Systems muss <em>beide</em> Gleichungen erfüllen. Sie liegt also auf beiden Geraden. Zwei Geraden in der Ebene können nur drei Dinge tun:</p>
            <ol className="keep">
              <li>sich in genau einem Punkt schneiden: <b>genau eine Lösung</b>;</li>
              <li>aufeinander liegen: <b>unendlich viele Lösungen</b> (jeder Punkt der Geraden);</li>
              <li>parallel nebeneinander laufen: <b>keine Lösung</b>.</li>
            </ol>
            <p>Mehr Möglichkeiten gibt es nicht. Wähle ein Beispiel der Folien oder stelle mit den Reglern eigene Gleichungen ein. Die Lösung wird exakt ausgerechnet.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> a solution of the system must satisfy <em>both</em> equations. So it lies on both lines. Two lines in the plane can only do three things:</p>
            <ol className="keep">
              <li>meet in exactly one point: <b>exactly one solution</b>;</li>
              <li>lie on top of each other: <b>infinitely many solutions</b> (every point of the line);</li>
              <li>run side by side in parallel: <b>no solution</b>.</li>
            </ol>
            <p>There are no other possibilities. Choose an example of the slides or set your own equations with the sliders. The solution is computed exactly.</p>
          </>}
        />
        <TwoLinesExplorer />
        <Box kind="supplement">
          <T
            de={<p>Die Zahl <M>{t`a_1b_2 - a_2b_1`}</M> im Bild sagt sofort, ob die Geraden parallel sind. Die Steigung von <M>{t`a x + b y = c`}</M> ist <M p=".">{t`-\tfrac{a}{b}`}</M> Gleiche Steigungen <M>{t`-\tfrac{a_1}{b_1} = -\tfrac{a_2}{b_2}`}</M> heisst nach dem Ausmultiplizieren <M p=".">{t`a_1b_2 - a_2b_1 = 0`}</M> Ist die Zahl nicht null, gibt es genau einen Schnittpunkt. Ist sie null, entscheidet erst die rechte Seite, ob es dieselbe Gerade ist oder eine parallele. Die Zahl heisst später <em>Determinante</em>.</p>}
            en={<p>The number <M>{t`a_1b_2 - a_2b_1`}</M> in the figure tells at once whether the lines are parallel. The slope of <M>{t`a x + b y = c`}</M> is <M p=".">{t`-\tfrac{a}{b}`}</M> Equal slopes <M>{t`-\tfrac{a_1}{b_1} = -\tfrac{a_2}{b_2}`}</M> means, after multiplying out, <M p=".">{t`a_1b_2 - a_2b_1 = 0`}</M> If the number is not zero, there is exactly one intersection. If it is zero, only the right-hand side decides whether it is the same line or a parallel one. Later the number is called the <em>determinant</em>.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kombinieren" title={<T de="4. Gleichungen kombinieren" en="4. Combining equations" />}>
        <Box kind="uebung" src={<Src u={2} p="11–12" slides />} title={<T de="«Gleichungen kombinieren – visualisiert»" en="“Combining Equations – Visualized”" />}>
          <MD>{t`E_1:\ 2x + 3y = 5 \qquad E_2:\ x - 2y = -1`}</MD>
          <MD>{t`E_1 + E_2:\ 3x + y = 4 \qquad -E_1 + E_2:\ -x - 5y = -6 \qquad 3E_1 + E_2:\ 7x + 7y = 14`}</MD>
          <T
            de={<p>Alle neuen Geraden gehen durch denselben Punkt: «Immer noch derselbe Schnittpunkt!»</p>}
            en={<p>All new lines pass through the same point: “Still the same intersection!”</p>}
          />
        </Box>
        <T
          de={<p className="keep"><b>So liest man das:</b> <M>{t`E_1 + E_2`}</M> heisst: linke Seiten addieren, rechte Seiten addieren. Aus <M>{t`(2x + 3y) + (x - 2y) = 5 + (-1)`}</M> wird <M p=".">{t`3x + y = 4`}</M> Allgemein darf man jede Gleichung mit einer Zahl <M>{t`\alpha`}</M> oder <M>{t`\beta`}</M> malnehmen und dann addieren. Der gemeinsame Punkt der beiden Geraden ist <M p=".">{t`(1, 1)`}</M> Dreh an den Reglern:</p>}
          en={<p className="keep"><b>How to read it:</b> <M>{t`E_1 + E_2`}</M> means: add the left sides, add the right sides. <M>{t`(2x + 3y) + (x - 2y) = 5 + (-1)`}</M> becomes <M p=".">{t`3x + y = 4`}</M> In general you may multiply each equation by a number <M>{t`\alpha`}</M> or <M>{t`\beta`}</M> and then add. The common point of the two lines is <M p=".">{t`(1, 1)`}</M> Turn the sliders:</p>}
        />
        <CombineExplorer />
        <Box kind="uebung" src={<Src u={2} p={13} slides />} title={<T de="«Gleichungen kombinieren – algebraisch»" en="“Combining Equations – Algebraically”" />}>
          <MD>{t`E_1:\ 2x_0 + 3y_0 = 5 \qquad E_2:\ x_0 - 2y_0 = -1`}</MD>
          <T de={<p>«Der Punkt <M>{t`(x_0, y_0)`}</M> löst das System.»</p>} en={<p>“Point <M>{t`(x_0, y_0)`}</M> solves system.”</p>} />
          <MD>{t`E_1 + E_2 = (\underbrace{2x_0 + 3y_0}_{5}) + (\underbrace{x_0 - 2y_0}_{-1}) = 4`}</MD>
          <T de={<p>«Also muss auch <M>{t`3x + y = 4`}</M> durch <M>{t`(x_0, y_0)`}</M> gehen!»</p>} en={<p>“So <M>{t`3x + y = 4`}</M> must also intersect <M p="!”">{t`(x_0, y_0)`}</M></p>} />
        </Box>
        <T
          de={<p>Die Folie zeigt den Grund in einer Zeile. Die Animation geht sie Schritt für Schritt durch. Der Trick: Sobald man den Schnittpunkt einsetzt, sind beide Klammern nur noch Zahlen.</p>}
          en={<p>The slide gives the reason in one line. The animation goes through it step by step. The trick: as soon as you insert the intersection, both brackets are just numbers.</p>}
        />
        <CombineAnimation />
        <Box kind="uebung" src={<Src u={2} p="14–15" slides />} title={<T de="«Vereinfachen, um zu lösen»" en="“Simplifying to Solve”" />}>
          <MD>{t`E_1:\ x - 2y = -2 \qquad E_2:\ x + y = 2`}</MD>
          <T de={<MD>{t`E_1 - E_2:\ -3y = -4 \ \text{(waagrecht)} \qquad E_1 + 2E_2:\ 3x = 2 \ \text{(senkrecht)}`}</MD>} en={<MD>{t`E_1 - E_2:\ -3y = -4 \ \text{(horizontal)} \qquad E_1 + 2E_2:\ 3x = 2 \ \text{(vertical)}`}</MD>} />
          <T de={<p>Der Schnittpunkt bleibt derselbe.</p>} en={<p>The intersection stays the same.</p>} />
        </Box>
        <T
          de={<p className="keep"><b>Warum das hilft:</b> Man wählt die Zahlen so, dass eine Unbekannte wegfällt. Dann ist die neue Gerade waagrecht oder senkrecht, und man kann die Lösung direkt ablesen. Genau diese Idee macht das Gauss-Verfahren systematisch.</p>}
          en={<p className="keep"><b>Why this helps:</b> you choose the numbers so that one unknown drops out. Then the new line is horizontal or vertical, and you can read off the solution directly. Gaussian elimination makes exactly this idea systematic.</p>}
        />
        <SimplifyAnimation />
        <Box kind="supplement">
          <T
            de={<p>Darf man <M>{'E_1'}</M> und <M>{'E_2'}</M> einfach durch die neuen Gleichungen ersetzen? Ja, wenn man zurück kann: Aus <M>{t`E_1 - E_2`}</M> und <M>{t`E_1 + 2E_2`}</M> bekommt man <M>{'E_2'}</M> als Differenz geteilt durch <M p=",">3</M> dann <M>{'E_1'}</M> zurück. Darum hat das neue System genau dieselben Lösungen. Mit <M>{t`\alpha = \beta = 0`}</M> ginge das nicht: <M>{t`0 = 0`}</M> hat alle Informationen verloren.</p>}
            en={<p>May one simply replace <M>{'E_1'}</M> and <M>{'E_2'}</M> by the new equations? Yes, as long as one can go back: from <M>{t`E_1 - E_2`}</M> and <M>{t`E_1 + 2E_2`}</M> you get <M>{'E_2'}</M> as the difference divided by <M p=",">3</M> then <M>{'E_1'}</M> back. This is why the new system has exactly the same solutions. With <M>{t`\alpha = \beta = 0`}</M> this would fail: <M>{t`0 = 0`}</M> has lost all information.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ebenen" title={<T de="5. Drei Unbekannte: Ebenen im Raum" en="5. Three unknowns: planes in space" />}>
        <Box kind="uebung" src={<Src u={2} p="16–24" slides />} title={<T de="«3D», «Unendlich viele Lösungen», «Vereinfachungsprozess»" en="“3D”, “Infinitely many Solutions”, “Simplification Process”" />}>
          <T
            de={<ul>
              <li><M p=":">{t`x + y + z = 3,\ x - 2y + 3z = 4,\ 2x + y - z = 1`}</M> drei Ebenen mit einem Schnittpunkt.</li>
              <li><M p=":">{t`x + y + z = 3,\ 5,\ 7`}</M> drei parallele Ebenen. <M p=":">{t`x + y + z = 3,\ x + y + z = 5,\ x + y - z = -2`}</M> zwei parallele, von einer dritten geschnitten. Beide: «Kein gemeinsamer Schnitt aller drei Ebenen, also keine Lösung!»</li>
              <li><M p=":">{t`x + y + z = 3,\ 2x + 2y + 2z = 6,\ 3x + 3y + 3z = 9`}</M> «Die Ebenen liegen aufeinander», unendlich viele Lösungen.</li>
              <li>«Gibt es auch unendlich viele Lösungen, wenn die Ebenen nicht aufeinander liegen?» «JA!» <M p=":">{t`x + y = 2,\ x + 2y = 2,\ x - y = 2`}</M> «unendlich viele Lösungen, aber auf einer Geraden».</li>
              <li>Vereinfachen: <M p=".">{t`-x + y + z = 3,\ x + y + 2z = 5,\ x + y - z = 1`}</M> Gleichung 3 wird ersetzt durch <M>{t`-3z = -4`}</M> (eine waagrechte Ebene). Der Schnittpunkt bleibt gleich.</li>
            </ul>}
            en={<ul>
              <li><M p=":">{t`x + y + z = 3,\ x - 2y + 3z = 4,\ 2x + y - z = 1`}</M> three planes with one intersection point.</li>
              <li><M p=":">{t`x + y + z = 3,\ 5,\ 7`}</M> three parallel planes. <M p=":">{t`x + y + z = 3,\ x + y + z = 5,\ x + y - z = -2`}</M> two parallel ones, cut by a third. Both: “No intersection of all 3 planes, so no solution!”</li>
              <li><M p=":">{t`x + y + z = 3,\ 2x + 2y + 2z = 6,\ 3x + 3y + 3z = 9`}</M> “planes overlapping”, infinitely many solutions.</li>
              <li>“Can there still be infinite solutions if the planes don’t overlap?” “YES!” <M p=":">{t`x + y = 2,\ x + 2y = 2,\ x - y = 2`}</M> “infinitely many solutions, but on a line”.</li>
              <li>Simplification: <M p=".">{t`-x + y + z = 3,\ x + y + 2z = 5,\ x + y - z = 1`}</M> Equation 3 is replaced by <M>{t`-3z = -4`}</M> (a horizontal plane). The intersection point stays the same.</li>
            </ul>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Mit drei Unbekannten ist eine Lösung ein Punkt <M>{t`(x, y, z)`}</M> im Raum. Eine Gleichung wie <M>{t`x + y + z = 3`}</M> legt nur eine Bedingung fest. Zwei Richtungen bleiben frei, und das ist eine <b>Ebene</b>. Drei Gleichungen sind drei Ebenen. Die Lösung ist das, was alle drei gemeinsam haben: ein Punkt, eine Gerade, eine ganze Ebene oder nichts.</p>
            <p>Im Bild ist jede Ebene nur im Würfel <M>{t`|x|, |y|, |z| \le 5`}</M> gezeichnet. Wähle oben ein Beispiel der Folien. Die Antwort rechts wird exakt mit der Elimination ausgerechnet, nicht aus dem Bild geraten. Bei «Vereinfachen» führen drei Knöpfe durch die Folien 22 bis 24: Die Ebene <M>{'E_3'}</M> dreht sich in die waagrechte Ebene <M>{t`E_4 = E_3 - E_2`}</M> und der rote Punkt bleibt stehen. In <M>{'E_4'}</M> ist <M>x</M> und <M>y</M> verschwunden, darum ist sie waagrecht.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> with three unknowns a solution is a point <M>{t`(x, y, z)`}</M> in space. An equation like <M>{t`x + y + z = 3`}</M> fixes only one condition. Two directions stay free, and that is a <b>plane</b>. Three equations are three planes. The solution is what all three have in common: a point, a line, a whole plane or nothing.</p>
            <p>In the figure each plane is drawn only inside the cube <M p=".">{t`|x|, |y|, |z| \le 5`}</M> Choose an example of the slides at the top. The answer on the right is computed exactly by elimination, not guessed from the picture. With “Simplify”, three buttons lead through slides 22 to 24: the plane <M>{'E_3'}</M> turns into the horizontal plane <M>{t`E_4 = E_3 - E_2`}</M> and the red point stays where it is. In <M>{'E_4'}</M> both <M>x</M> and <M>y</M> have dropped out, so it is horizontal.</p>
          </>}
        />
        <PlanesExplorer />
        <T
          de={<p className="keep"><b>Das Beispiel nachgerechnet:</b> <M>{t`E_3 - E_2 = (x + y - z) - (x + y + 2z) = -3z`}</M> und <M p=",">{t`1 - 5 = -4`}</M> also <M p=".">{t`z = \tfrac43`}</M> Die Summe <M>{t`E_1 + E_2`}</M> ist <M p=";">{t`2y + 3z = 8`}</M> mit <M>{t`z = \tfrac43`}</M> gibt das <M p=".">{t`y = 2`}</M> Aus <M>{'E_2'}</M> folgt <M p=".">{t`x = 5 - 2 - \tfrac83 = \tfrac13`}</M> Der Schnittpunkt ist <M p=".">{t`(\tfrac13, 2, \tfrac43)`}</M></p>}
          en={<p className="keep"><b>The example recalculated:</b> <M>{t`E_3 - E_2 = (x + y - z) - (x + y + 2z) = -3z`}</M> and <M p=",">{t`1 - 5 = -4`}</M> so <M p=".">{t`z = \tfrac43`}</M> The sum <M>{t`E_1 + E_2`}</M> is <M p=";">{t`2y + 3z = 8`}</M> with <M>{t`z = \tfrac43`}</M> this gives <M p=".">{t`y = 2`}</M> From <M>{'E_2'}</M> follows <M p=".">{t`x = 5 - 2 - \tfrac83 = \tfrac13`}</M> The intersection is <M p=".">{t`(\tfrac13, 2, \tfrac43)`}</M></p>}
        />
        <Box kind="supplement">
          <T
            de={<p>Ohne Lösung gibt es bei drei Ebenen noch einen dritten Fall, der nicht auf den Folien ist (Knopf «Prisma»): Je zwei Ebenen schneiden sich, aber die drei Schnittgeraden laufen parallel, wie die Kanten eines Prismas. Beispiel: <M p=".">{t`x = 1,\ z = 1,\ x + z = 3`}</M> Aus den ersten zwei folgt <M p=",">{t`x + z = 2`}</M> das widerspricht der dritten.</p>}
            en={<p>Without a solution there is a third case for three planes that is not on the slides (button “prism”): every two planes cut, but the three cut lines run in parallel, like the edges of a prism. Example: <M p=".">{t`x = 1,\ z = 1,\ x + z = 3`}</M> The first two give <M p=",">{t`x + z = 2`}</M> which contradicts the third.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Drei Ebenen schneiden sich immer in einem Punkt»" en="“Three planes always meet in one point”" />}>
        <T
          de={<p>Nur im «normalen» Fall. Klick im Bild durch die Beispiele: Drei Ebenen können parallel sein, aufeinander liegen, sich in einer ganzen Geraden treffen oder paarweise schneiden, ohne gemeinsamen Punkt. Ob es genau einen Punkt gibt, sagt erst die Rechnung.</p>}
          en={<p>Only in the “normal” case. Click through the examples in the figure: three planes can be parallel, lie on top of each other, meet in a whole line or cut pairwise without a common point. Whether there is exactly one point only the calculation tells.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Parallele Geraden oder Ebenen heisst: keine Lösung – immer»" en="“Parallel lines or planes means: no solution – always”" />}>
        <T
          de={<p>Nur wenn die Gleichungen sich widersprechen, wie <M>{t`2x + 3y = 5`}</M> und <M p=".">{t`4x + 6y = 5`}</M> Bei <M>{t`2x + 3y = 5`}</M> und <M>{t`4x + 6y = 10`}</M> sind die Geraden auch «parallel», aber sie sind dieselbe Gerade: unendlich viele Lösungen. Also immer auch die rechte Seite anschauen.</p>}
          en={<p>Only if the equations contradict each other, like <M>{t`2x + 3y = 5`}</M> and <M p=".">{t`4x + 6y = 5`}</M> With <M>{t`2x + 3y = 5`}</M> and <M>{t`4x + 6y = 10`}</M> the lines are also “parallel”, but they are the same line: infinitely many solutions. So always look at the right-hand side as well.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Eine Gleichung mit drei Unbekannten hat eine Lösung»" en="“One equation with three unknowns has one solution”" />}>
        <T
          de={<p>Sie hat eine ganze Ebene voller Lösungen. <M>{t`x + y + z = 3`}</M> erfüllen zum Beispiel <M p=",">{t`(3, 0, 0)`}</M> <M>{t`(1, 1, 1)`}</M> und <M p=".">{t`(0, 5, -2)`}</M> Erst weitere Gleichungen schneiden die Lösungsmenge kleiner.</p>}
          en={<p>It has a whole plane full of solutions. <M>{t`x + y + z = 3`}</M> is satisfied for example by <M p=",">{t`(3, 0, 0)`}</M> <M>{t`(1, 1, 1)`}</M> and <M p=".">{t`(0, 5, -2)`}</M> Only further equations cut the solution set down.</p>}
        />
      </Box>

      <Box kind="key">
        <T
          de={<ul>
            <li>Linear: jede Unbekannte nur mit einer Zahl davor, keine Produkte, keine Funktionen von Unbekannten.</li>
            <li>Zwei Unbekannte: eine Gleichung ist eine Gerade. Drei Unbekannte: eine Ebene.</li>
            <li>Die Lösung eines Systems ist der gemeinsame Teil: in der Ebene ein Punkt, eine Gerade oder nichts; im Raum zusätzlich eine ganze Ebene.</li>
            <li>Kombinationen <M>{t`\alpha E_1 + \beta E_2`}</M> gehen immer durch den gemeinsamen Punkt. Geschickt gewählt, fällt eine Unbekannte weg, und die Lösung lässt sich ablesen.</li>
            <li>Parallel heisst nicht automatisch «keine Lösung»: bei gleicher Gleichung sind es unendlich viele.</li>
          </ul>}
          en={<ul>
            <li>Linear: every unknown only with a number in front, no products, no functions of unknowns.</li>
            <li>Two unknowns: one equation is a line. Three unknowns: a plane.</li>
            <li>The solution of a system is the common part: in the plane a point, a line or nothing; in space also a whole plane.</li>
            <li>Combinations <M>{t`\alpha E_1 + \beta E_2`}</M> always pass through the common point. Chosen cleverly, one unknown drops out and the solution can be read off.</li>
            <li>Parallel does not automatically mean “no solution”: for the same equation there are infinitely many.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
