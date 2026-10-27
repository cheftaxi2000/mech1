import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { ColumnPicture, ShowPreset } from '../viz/la/ColumnPicture';
import { TexMat } from '../viz/la/Mat';

const t = String.raw;

/** A column vector / matrix with coloured columns, entries as KaTeX. */
const col = (cells: string[], c?: string, cap?: string) => <TexMat cols={[cells]} cls={[c]} caption={cap ? [cap] : undefined} />;

export default function LA3Spaltenbild() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein lineares Gleichungssystem kann man auf zwei Arten lesen. Zeile für Zeile: Jede Gleichung ist eine Gerade, und man sucht den Schnittpunkt. Oder Spalte für Spalte: Man sucht eine Mischung von Pfeilen. Diese Lektion zeigt die zweite Art, das <b>Spaltenbild</b>. Es ist die Grundlage für alles, was mit Matrizen kommt.</p>}
        en={<p className="lede">A linear system can be read in two ways. Row by row: each equation is a line, and you look for the intersection. Or column by column: you look for a mix of arrows. This lesson shows the second way, the <b>column picture</b>. It is the basis of everything that follows with matrices.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an ein Rezept mit zwei Zutaten. Eine Portion von Zutat 1 ist ein fester Pfeil <M p=",">{'a_1'}</M> eine Portion von Zutat 2 ein fester Pfeil <M p=".">{'a_2'}</M> Die Mengen <M>{'x_1'}</M> und <M>{'x_2'}</M> sagen, wie viele Portionen du nimmst. Das fertige Gericht <M>b</M> ist der Pfeil, der am Ende herauskommen soll. <M>{t`Ax = b`}</M> fragt also: <em>Welche Mengen ergeben genau dieses Gericht?</em> Eine negative Menge heisst hier einfach: der Pfeil zeigt in die Gegenrichtung.</p>}
          en={<p>Think of a recipe with two ingredients. One portion of ingredient 1 is a fixed arrow <M p=",">{'a_1'}</M> one portion of ingredient 2 a fixed arrow <M p=".">{'a_2'}</M> The amounts <M>{'x_1'}</M> and <M>{'x_2'}</M> say how many portions you take. The finished dish <M>b</M> is the arrow that should come out at the end. So <M>{t`Ax = b`}</M> asks: <em>which amounts give exactly this dish?</em> A negative amount simply means: the arrow points the other way.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="matrixform" title={<T de="1. Matrixform eines LGS" en="1. Matrix form of a linear system" />}>
        <Box kind="uebung" src={<Src u={4} p={12} slides />} title={<T de="Matrixform eines LGS (Repetition)" en="Matrix Form of LGS (recap)" />}>
          <MD>{t`\begin{aligned} 2x_1 + 3x_2 &= -1 \\ x_1 - 2x_2 &= 3 \end{aligned}`}</MD>
          <MD>{t`\Downarrow`}</MD>
          <div className="la-display">
            <TexMat cols={[['2', '1'], ['3', '-2']]} cls={['k1', 'k2']} caption={['a_1', 'a_2']} />
            {col(['x_1', 'x_2'], undefined, 'x')}
            <M>=</M>
            {col(['-1', '3'], 'kb', 'b')}
          </div>
          <MD>{t`\Downarrow`}</MD>
          <div className="la-display">
            {col(['2', '1'], 'k1')}<M>{'x_1'}</M><M>+</M>{col(['3', '-2'], 'k2')}<M>{'x_2'}</M><M>=</M>{col(['-1', '3'], 'kb')}
          </div>
          <T
            de={<p>Bild (englisch beschriftet, hier übersetzt): die Spalten <M>{t`(2, 1)^T`}</M> (grün) und <M>{t`(3, -2)^T`}</M> (blau) als Pfeile, durch jede eine gestrichelte Gerade für <M>{t`\binom{2}{1}\cdot x_1`}</M> und <M>{t`\binom{3}{-2}\cdot x_2`}</M> mit dem Vermerk «Jeder Punkt auf der Geraden ist möglich!». Dazu die Kombination:</p>}
            en={<p>Figure: the columns <M>{t`(2, 1)^T`}</M> (green) and <M>{t`(3, -2)^T`}</M> (blue) as arrows, through each a dashed line for <M>{t`\binom{2}{1}\cdot x_1`}</M> and <M>{t`\binom{3}{-2}\cdot x_2`}</M> with the note “Any point along line possible!”. And the combination:</p>}
          />
          <MD>{t`\begin{pmatrix}2\\1\end{pmatrix}(1) + \begin{pmatrix}3\\-2\end{pmatrix}(-1) = \begin{pmatrix}-1\\3\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Folie:</b></p>
            <ol className="keep">
              <li><M>A</M> ist die <De en="matrix">Matrix</De>: die Zahlen vor den Unbekannten, als Tabelle. Zeile 1 gehört zur Gleichung 1, Zeile 2 zur Gleichung 2.</li>
              <li><M>x</M> sind die beiden Unbekannten <M>{'x_1'}</M> und <M p=",">{'x_2'}</M> untereinander geschrieben. <M>b</M> ist die rechte Seite.</li>
              <li><M>{t`A\cdot x = b`}</M> ist nur eine Kurzschrift für beide Gleichungen. Man rechnet «Zeile mal Spalte»: <M p=".">{t`2\cdot x_1 + 3\cdot x_2 = -1`}</M></li>
              <li>Die zweite Zeile der Folie sortiert dieselbe Rechnung nach Spalten. <M>{'x_1'}</M> multipliziert die ganze erste Spalte, <M>{'x_2'}</M> die ganze zweite. Das darf man, weil man Vektoren Eintrag für Eintrag addiert: oben steht wieder <M p=",">{t`2x_1 + 3x_2`}</M> unten <M p=".">{t`x_1 - 2x_2`}</M></li>
              <li>«Jeder Punkt auf der Geraden ist möglich» heisst: <M>{t`x_1 \cdot a_1`}</M> kann jeder Punkt auf der grünen Geraden sein, je nach <M p=".">{'x_1'}</M> Gesucht ist die eine Wahl, bei der die Summe genau <M>b</M> trifft.</li>
            </ol>
            <p>Die Spalten bekommen Namen: <M>{t`a_1 = (2, 1)^T`}</M> und <M p=".">{t`a_2 = (3, -2)^T`}</M> Dann lautet die Frage in einem Satz: Welche Mengen <M>{'x_1'}</M> und <M>{'x_2'}</M> machen <M p="?">{t`x_1 a_1 + x_2 a_2 = b`}</M> Das Bild zeigt es in vier Schritten, so wie die Visualisierung der Übung.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the slide:</b></p>
            <ol className="keep">
              <li><M>A</M> is the <De en="matrix">Matrix</De>: the numbers in front of the unknowns, as a table. Row 1 belongs to equation 1, row 2 to equation 2.</li>
              <li><M>x</M> are the two unknowns <M>{'x_1'}</M> and <M p=",">{'x_2'}</M> written one below the other. <M>b</M> is the right-hand side.</li>
              <li><M>{t`A\cdot x = b`}</M> is just shorthand for both equations. You compute “row times column”: <M p=".">{t`2\cdot x_1 + 3\cdot x_2 = -1`}</M></li>
              <li>The second line of the slide sorts the same computation by columns. <M>{'x_1'}</M> multiplies the whole first column, <M>{'x_2'}</M> the whole second one. This is allowed because vectors are added entry by entry: on top you again get <M p=",">{t`2x_1 + 3x_2`}</M> below <M p=".">{t`x_1 - 2x_2`}</M></li>
              <li>“Any point along line possible!” means: <M>{t`x_1 \cdot a_1`}</M> can be any point on the green line, depending on <M p=".">{'x_1'}</M> We look for the one choice where the sum hits <M>b</M> exactly.</li>
            </ol>
            <p>The columns get names: <M>{t`a_1 = (2, 1)^T`}</M> and <M p=".">{t`a_2 = (3, -2)^T`}</M> Then the question in one sentence is: which amounts <M>{'x_1'}</M> and <M>{'x_2'}</M> make <M p="?">{t`x_1 a_1 + x_2 a_2 = b`}</M> The figure shows it in four steps, as the exercise-class visualisation does.</p>
          </>}
        />
        <Box kind="uebung" src={<Src u={3} vis="Column Picture" />} title={<T de="Das Spaltenbild in vier Schritten" en="The column picture in four steps" />}>
          <T
            de={<p>Oben fünf Beispiele, darunter das Bild und die Matrix-Tafel: <M>A</M> mit grüner und blauer Spalte, dann <M p=",">x</M> dann <M p=".">b</M> Die Tafel zeigt auch den Rang <M>r</M> (dazu die Lektion <a href="#la-rang">Pivots, freie Variablen und Rang</a>), die Anzahl Lösungen und am Schluss die <De en="solution set">Lösungsmenge</De> <M p=".">L</M></p>}
            en={<p>On top five examples, below them the figure and the matrix panel: <M>A</M> with green and blue column, then <M p=",">x</M> then <M p=".">b</M> The panel also shows the rank <M>r</M> (see the lesson <a href="#la-rang">Pivots, free variables and rank</a>), the number of solutions and at the end the <De en="solution set">Lösungsmenge</De> <M p=".">L</M></p>}
          />
          <ColumnPicture />
        </Box>
        <T
          de={<p><b>Was man sieht.</b> In Schritt 2 wächst <M>{t`x_1 a_1`}</M> entlang der grünen Richtung. In Schritt 3 wird <M>{t`x_2 a_2`}</M> an die Spitze gehängt. Weil <M>{t`x_2 = -1`}</M> negativ ist, zeigt der blaue Pfeil nach links oben, also entgegen <M p=".">{'a_2'}</M> In Schritt 4 zeigt der dunkle Pfeil <M>{'Ax'}</M> von <M>0</M> bis zur Spitze der Kette. Er landet genau im Ring von <M p=".">b</M> Zieh eine Spitze, und alles rechnet sich neu.</p>}
          en={<p><b>What you see.</b> In step 2, <M>{t`x_1 a_1`}</M> grows along the green direction. In step 3, <M>{t`x_2 a_2`}</M> is attached at the tip. Because <M>{t`x_2 = -1`}</M> is negative, the blue arrow points up to the left, against <M p=".">{'a_2'}</M> In step 4, the dark arrow <M>{'Ax'}</M> goes from <M>0</M> to the tip of the chain. It lands exactly in the ring of <M p=".">b</M> Drag a tip, and everything is recomputed.</p>}
        />
        <T
          de={<p><b>Probe</b> für <M p=":">{t`x = (1, -1)^T`}</M> erste Zeile <M p={'\u00a0✓,'}>{t`2\cdot 1 + 3\cdot(-1) = -1`}</M> zweite Zeile <M p={'\u00a0✓.'}>{t`1 - 2\cdot(-1) = 3`}</M> Als Pfeile: <M>{t`(2, 1)^T - (3, -2)^T = (-1, 3)^T = b`}</M> – das ist die rote Spitze im Bild.</p>}
          en={<p><b>Check</b> for <M p=":">{t`x = (1, -1)^T`}</M> first row <M p={'\u00a0✓,'}>{t`2\cdot 1 + 3\cdot(-1) = -1`}</M> second row <M p={'\u00a0✓.'}>{t`1 - 2\cdot(-1) = 3`}</M> As arrows: <M>{t`(2, 1)^T - (3, -2)^T = (-1, 3)^T = b`}</M> – the red tip in the figure.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="abhaengig" title={<T de="2. Linear abhängige Spalten" en="2. Linearly dependent columns" />}>
        <Box kind="uebung" src={<Src u={4} p={13} slides />} title={<T de="Linear abhängige Spalten (Repetition)" en="Linear Dependent Columns (recap)" />}>
          <div className="la-display">
            <TexMat cols={[['1', '2'], ['-2', '-4']]} cls={['k1', 'k2']} />
            {col(['x_1', 'x_2'])}
            <M>=</M>
            {col(['1', '4'], 'kb')}
          </div>
          <div className="la-display">
            {col(['1', '2'], 'k1')}<M>{'x_1'}</M><M>+</M>{col(['-2', '-4'], 'k2')}<M>{'x_2'}</M><M>=</M>{col(['1', '4'], 'kb')}
          </div>
          <T
            de={<p>Bild: Beide Spaltenpfeile liegen auf einer Geraden durch <M p=",">0</M> der rote Pfeil <M>{t`(1, 4)^T`}</M> daneben. Handschriftlich: «Die Vektoren sind linear abhängig, also können Lösungen nur auf dieser Geraden liegen».</p>}
            en={<p>Figure: both column arrows lie on one line through <M p=",">0</M> the red arrow <M>{t`(1, 4)^T`}</M> beside it. Handwritten: “Vectors are linearly dependent so solutions can only be on this line”.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Die zweite Spalte ist <M>-2</M> mal die erste: <M p=".">{t`(-2, -4)^T = -2\cdot(1, 2)^T`}</M> Beide Pfeile zeigen also in dieselbe Richtung (oder genau entgegen). Man sagt: Sie sind <De en="linearly dependent">linear abhängig</De>.</p>
            <p className="keep">Was folgt daraus? Jede Mischung <M>{t`x_1 a_1 + x_2 a_2`}</M> ist ein Vielfaches von <M p=".">{t`(1, 2)^T`}</M> Sie bleibt immer auf der Geraden durch <M p=".">{t`(1, 2)^T`}</M> «Lösungen» meint auf der Folie genau das: alles, was <M>{'Ax'}</M> erreichen kann, liegt auf dieser Geraden.</p>
            <p>Liegt <M>b</M> darauf? Auf der Geraden ist der zweite Eintrag immer das Doppelte des ersten. Bei <M>{t`b = (1, 4)^T`}</M> ist <M p=".">{t`4 \neq 2\cdot 1`}</M> Also liegt <M>b</M> daneben, und es gibt <b>keine Lösung</b>.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> the second column is <M>-2</M> times the first: <M p=".">{t`(-2, -4)^T = -2\cdot(1, 2)^T`}</M> So both arrows point in the same direction (or exactly opposite). They are called <De en="linearly dependent">linear abhängig</De>.</p>
            <p className="keep">What follows? Every mix <M>{t`x_1 a_1 + x_2 a_2`}</M> is a multiple of <M p=".">{t`(1, 2)^T`}</M> It always stays on the line through <M p=".">{t`(1, 2)^T`}</M> “Solutions” on the slide means exactly this: everything <M>{'Ax'}</M> can reach lies on this line.</p>
            <p>Does <M>b</M> lie on it? On the line, the second entry is always twice the first. For <M>{t`b = (1, 4)^T`}</M> we have <M p=".">{t`4 \neq 2\cdot 1`}</M> So <M>b</M> lies beside the line, and there is <b>no solution</b>.</p>
          </>}
        />
        <p><ShowPreset i={2}><T de="Im Spaltenbild oben zeigen: «Rang 1 · keine»" en="Show in the column picture above: “rank 1 · none”" /></ShowPreset></p>
        <T
          de={<p>Im Bild läuft die Kette auf zwei Spuren neben der grauen Geraden, damit man <M>{t`x_1 a_1`}</M> und <M>{t`x_2 a_2`}</M> trotzdem auseinanderhält. Im Schritt 4 rutscht <M>{'Ax'}</M> auf der Geraden zum Punkt, der <M>b</M> am nächsten ist. Der orange gestrichelte Pfeil ist der Rest <M p=":">{t`Ax - b`}</M> Er steht senkrecht auf der Geraden, und er wird nie null.</p>}
          en={<p>In the figure, the chain runs on two lanes beside the grey line, so you can still tell <M>{t`x_1 a_1`}</M> and <M>{t`x_2 a_2`}</M> apart. In step 4, <M>{'Ax'}</M> slides along the line to the point closest to <M p=".">b</M> The dashed orange arrow is the remainder <M p=":">{t`Ax - b`}</M> it is perpendicular to the line, and it never becomes zero.</p>}
        />
        <T
          de={<p><b>Dieselbe Matrix, anderes <M p=":">b</M></b> Liegt <M>b</M> auf der Geraden, etwa <M p=",">{t`b = (-1, -2)^T`}</M> gibt es <em>unendlich viele</em> Lösungen. Die Visualisierung zeigt <M p=".">{t`L = \{ (1, 1)^T + \alpha\,(2, 1)^T \mid \alpha \in \mathbb{R} \}`}</M> Probe: <M p={'\u00a0✓.'}>{t`A(1, 1)^T = (1 - 2,\ 2 - 4)^T = (-1, -2)^T`}</M> Und <M p=",">{t`A(2, 1)^T = (2 - 2,\ 4 - 4)^T = 0`}</M> darum ändert das Anhängen von <M>{t`\alpha\,(2, 1)^T`}</M> nichts an <M p=".">{'Ax'}</M> Im Bild wandert <M>x</M> hin und her, und <M>{'Ax'}</M> bleibt auf <M p=".">b</M></p>}
          en={<p><b>Same matrix, different <M p=":">b</M></b> if <M>b</M> lies on the line, e.g. <M p=",">{t`b = (-1, -2)^T`}</M> there are <em>infinitely many</em> solutions. The visualisation shows <M p=".">{t`L = \{ (1, 1)^T + \alpha\,(2, 1)^T \mid \alpha \in \mathbb{R} \}`}</M> Check: <M p={'\u00a0✓.'}>{t`A(1, 1)^T = (1 - 2,\ 2 - 4)^T = (-1, -2)^T`}</M> And <M p=",">{t`A(2, 1)^T = (2 - 2,\ 4 - 4)^T = 0`}</M> so adding <M>{t`\alpha\,(2, 1)^T`}</M> does not change <M p=".">{'Ax'}</M> In the figure, <M>x</M> walks back and forth and <M>{'Ax'}</M> stays on <M p=".">b</M></p>}
        />
        <p><ShowPreset i={1}><T de="Im Spaltenbild oben zeigen: «Rang 1 · unendlich viele»" en="Show in the column picture above: “rank 1 · infinitely many”" /></ShowPreset></p>
        <T
          de={<p><b>Der extreme Fall: Rang 0.</b> Sind beide Spalten null, ist jede Mischung null: <M>{'Ax'}</M> bleibt im Nullpunkt, egal was <M>x</M> ist. Ist <M p=",">{t`b \neq 0`}</M> gibt es keine Lösung. Ist <M p=",">{t`b = 0`}</M> ist jedes <M>x</M> eine Lösung, also <M p=".">{t`L = \mathbb{R}^2`}</M></p>}
          en={<p><b>The extreme case: rank 0.</b> If both columns are zero, every mix is zero: <M>{'Ax'}</M> stays at the origin, whatever <M>x</M> is. If <M p=",">{t`b \neq 0`}</M> there is no solution. If <M p=",">{t`b = 0`}</M> every <M>x</M> is a solution, so <M p=".">{t`L = \mathbb{R}^2`}</M></p>}
        />
        <p><ShowPreset i={3}><T de="«Rang 0 · keine» zeigen" en="Show “rank 0 · none”" /></ShowPreset>{' '}<ShowPreset i={4}><T de={<>«Rang 0 · jedes <M p="»">x</M> zeigen</>} en={<>Show “rank 0 · every <M p="”">x</M></>} /></ShowPreset></p>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="faelle" title={<T de="3. Die Fälle auf einen Blick" en="3. The cases at a glance" />}>
        <T
          de={<p className="keep">Im Spaltenbild entscheidet eine einzige Frage: <em>Kann die Kette aus <M>{t`x_1 a_1`}</M> und <M>{t`x_2 a_2`}</M> die Spitze von <M>b</M> erreichen?</em></p>}
          en={<p className="keep">In the column picture, a single question decides: <em>can the chain of <M>{t`x_1 a_1`}</M> and <M>{t`x_2 a_2`}</M> reach the tip of <M p="?">b</M></em></p>}
        />
        <div className="la-cases-wrap">
          <table className="la-cases">
            <thead><tr><th><T de="Spalten" en="columns" /></th><th><T de="Rang" en="rank" /></th><th><M>b</M></th><th><T de="Lösungen" en="solutions" /></th></tr></thead>
            <tbody>
              <tr><td><T de="zeigen in zwei Richtungen" en="point in two directions" /></td><td><M>2</M></td><td><T de="beliebig" en="any" /></td><td><T de={<>genau eine (<De en="unique">eindeutig</De>)</>} en={<>exactly one (<De en="unique">eindeutig</De>)</>} /></td></tr>
              <tr><td><T de="auf einer Geraden" en="on one line" /></td><td><M>1</M></td><td><T de="auf der Geraden" en="on the line" /></td><td><T de="unendlich viele" en={<>infinitely many (<De en="infinitely many">unendlich viele</De>)</>} /></td></tr>
              <tr><td><T de="auf einer Geraden" en="on one line" /></td><td><M>1</M></td><td><T de="neben der Geraden" en="off the line" /></td><td><T de="keine" en={<>none (<De en="none">keine</De>)</>} /></td></tr>
              <tr><td><T de="beide null" en="both zero" /></td><td><M>0</M></td><td><M>{t`b = 0`}</M></td><td><T de={<>jedes <M>x</M></>} en={<>every <M>x</M></>} /></td></tr>
              <tr><td><T de="beide null" en="both zero" /></td><td><M>0</M></td><td><M>{t`b \neq 0`}</M></td><td><T de="keine" en={<>none (<De en="none">keine</De>)</>} /></td></tr>
            </tbody>
          </table>
        </div>
        <T
          de={<p>Mit zwei Unbekannten gibt es also nie «genau zwei» Lösungen: entweder keine, eine oder unendlich viele.</p>}
          en={<p>So with two unknowns there are never “exactly two” solutions: either none, one or infinitely many.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Rang 1 heisst: keine Lösung»" en="“Rank 1 means: no solution”" />}>
        <T
          de={<p>Rang 1 heisst nur: Die Spalten liegen auf einer Geraden, <M>{'Ax'}</M> kommt nicht von ihr weg. Ob es Lösungen gibt, entscheidet <M p=".">b</M> Liegt <M>b</M> auf der Geraden, gibt es sogar unendlich viele (Beispiel <M p=").">{t`b = (-1, -2)^T`}</M> Nur wenn <M>b</M> daneben liegt, gibt es keine.</p>}
          en={<p>Rank 1 only means: the columns lie on one line, and <M>{'Ax'}</M> cannot leave it. Whether there are solutions depends on <M p=".">b</M> If <M>b</M> lies on the line, there are even infinitely many (example <M p=").">{t`b = (-1, -2)^T`}</M> Only if <M>b</M> lies beside it are there none.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{'x_1'}</M> und <M>{'x_2'}</M> sind Punkte im Bild»</>} en={<>“<M>{'x_1'}</M> and <M>{'x_2'}</M> are points in the picture”</>} />}>
        <T
          de={<p><M>{'x_1'}</M> und <M>{'x_2'}</M> sind Zahlen: Mengen, wie die Portionen im Rezept. Sie strecken die Pfeile <M>{'a_1'}</M> und <M p=".">{'a_2'}</M> Im Spaltenbild ist <M>x</M> kein Pfeil, den man sieht; man sieht nur seine Wirkung, die Kette <M p=".">{t`x_1 a_1 + x_2 a_2`}</M> Darum zeigt die Tafel <M>x</M> nur als Zahlen.</p>}
          en={<p><M>{'x_1'}</M> and <M>{'x_2'}</M> are numbers: amounts, like the portions in the recipe. They stretch the arrows <M>{'a_1'}</M> and <M p=".">{'a_2'}</M> In the column picture, <M>x</M> is not an arrow you see; you only see its effect, the chain <M p=".">{t`x_1 a_1 + x_2 a_2`}</M> This is why the panel shows <M>x</M> only as numbers.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Eindeutig lösbar heisst: die Spalten schneiden sich in einem Punkt»" en="“Uniquely solvable means: the columns intersect in one point”" />}>
        <T
          de={<p>Das verwechselt die beiden Bilder. Im <em>Zeilenbild</em> ist jede Gleichung eine Gerade, und eine eindeutige Lösung ist ein Schnittpunkt. Im <em>Spaltenbild</em> sind die Spalten Pfeile ab dem Nullpunkt; sie «schneiden» sich immer in <M p=".">0</M> Hier zählt nur: Zeigen <M>{'a_1'}</M> und <M>{'a_2'}</M> in zwei verschiedene Richtungen (Rang 2)? Dann erreicht die Kette jeden Punkt, und zwar auf genau eine Art.</p>}
          en={<p>This mixes up the two pictures. In the <em>row picture</em> each equation is a line, and a unique solution is an intersection point. In the <em>column picture</em> the columns are arrows from the origin; they always “meet” at <M p=".">0</M> Here only one thing counts: do <M>{'a_1'}</M> and <M>{'a_2'}</M> point in two different directions (rank 2)? Then the chain reaches every point, in exactly one way.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li><M>{t`Ax = b`}</M> ist dasselbe wie <M p=":">{t`x_1 a_1 + x_2 a_2 = b`}</M> Welche Mengen der Spalten ergeben <M p="?">b</M></li>
            <li>Man liest es so: <M>{t`x_1 a_1`}</M> ab dem Nullpunkt, <M>{t`x_2 a_2`}</M> an der Spitze angehängt, <M>{'Ax'}</M> bis zur Spitze der Kette.</li>
            <li>Zwei Richtungen (Rang 2): genau eine Lösung. Spalten auf einer Geraden (Rang 1): <M>b</M> auf der Geraden gibt unendlich viele, daneben keine.</li>
          </ul>}
          en={<ul>
            <li><M>{t`Ax = b`}</M> is the same as <M p=":">{t`x_1 a_1 + x_2 a_2 = b`}</M> which amounts of the columns give <M p="?">b</M></li>
            <li>Read it like this: <M>{t`x_1 a_1`}</M> from the origin, <M>{t`x_2 a_2`}</M> attached at the tip, <M>{'Ax'}</M> to the tip of the chain.</li>
            <li>Two directions (rank 2): exactly one solution. Columns on one line (rank 1): <M>b</M> on the line gives infinitely many, beside it none.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
