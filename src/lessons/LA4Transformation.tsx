import type { ReactNode } from 'react';
import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T, useLang } from '../i18n';
import { TexMat } from '../viz/la/Mat';
import { CollapseAnim, LandPicture } from '../viz/la/TransformFigures';
import { TransformExplorer } from '../viz/la/TransformExplorer';

const t = String.raw;

/** One worked example of slide 21: the product, its column reading, a small picture. */
function Landing({ A, x, Ax, cols, text, label }: { A: string[][]; x: [number, number]; Ax: string[]; cols: string; text: ReactNode; label: string }) {
  return (
    <div className="la-mini">
      <div className="la-display">
        <TexMat cols={A} cls={['k1', 'k2']} />
        <TexMat cols={[[String(x[0]), String(x[1])]]} />
        <M>=</M>
        <TexMat cols={[Ax]} />
      </div>
      <MD>{cols}</MD>
      <LandPicture A={[[Number(A[0][0]), Number(A[1][0])], [Number(A[0][1]), Number(A[1][1])]]} x={x} label={label} />
      <p>{text}</p>
    </div>
  );
}

export default function LA4Transformation() {
  const lang = useLang();
  const sep = lang === 'de' ? ';\\ ' : ',\\ ';
  const v = (a: string | number, b: string | number) => t`(${a}${sep}${b})^T`;
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In der Lektion <a href="#la-spaltenbild">Gleichungssysteme im Spaltenbild</a> war <M>{t`Ax`}</M> eine Mischung der Spalten von <M p=".">A</M> Jetzt kommt eine zweite Sicht, die durch die ganze Lineare Algebra trägt: Die Matrix ist eine Maschine, die <em>jeden</em> Punkt der Ebene an einen neuen Ort bringt.</p>}
        en={<p className="lede">In the lesson <a href="#la-spaltenbild">Linear systems as a column picture</a>, <M>{t`Ax`}</M> was a mix of the columns of <M p=".">A</M> Now comes a second view that carries through all of linear algebra: the matrix is a machine that moves <em>every</em> point of the plane to a new place.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir ein kariertes Gummituch vor, das auf der Ebene liegt und im Nullpunkt festgenagelt ist. Die Matrix zieht, schert oder dreht das Tuch. Die Karos werden dabei schief und verschieden gross, aber die Linien bleiben gerade und parallel. Darum genügt es zu wissen, wohin die beiden Grundpfeile <M>{'e_1'}</M> und <M>{'e_2'}</M> gehen: Der Rest des Tuchs folgt.</p>}
          en={<p>Imagine a squared rubber sheet lying on the plane, nailed down at the origin. The matrix pulls, shears or turns the sheet. The squares become slanted and of different sizes, but the lines stay straight and parallel. So it is enough to know where the two basic arrows <M>{'e_1'}</M> and <M>{'e_2'}</M> go: the rest of the sheet follows.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="kernidee" title={<T de="1. Die Kernidee" en="1. The key idea" />}>
        <Box kind="uebung" src={<Src u={4} p={14} slides />} title={<T de="Kernidee" en="Key Idea" />}>
          <MD>{t`Ax = b`}</MD>
          <T
            de={<p>«In der Matrixform fragen wir: Welcher Vektor <M>x</M> (z.&nbsp;B. <M p=",">{v(1, 2)}</M> <M>{v(1, -1)}</M> usw.) landet nach einer Transformation durch die Matrix <M>A</M> auf dem Vektor <M p="?»">b</M></p>}
            en={<p>“When considering the Matrix form, we are asking what vector <M>x</M> (e.g. <M p=",">{v(1, 2)}</M> <M>{v(1, -1)}</M> etc.) lands on the vector <M>b</M> after a transformation by the Matrix <M p=".”">A</M></p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>x</M> ist das, was man in die Maschine hineingibt. <M>A</M> bewegt es. <M>b</M> ist das, was herauskommen soll. Ein LGS zu lösen heisst also: die Eingabe finden, die auf <M>b</M> landet. Die Zahlen in <M>A</M> sagen, wie die Maschine arbeitet. Wie man das sieht, zeigt der nächste Abschnitt.</p>}
          en={<p><b>How to read it:</b> <M>x</M> is what you feed into the machine. <M>A</M> moves it. <M>b</M> is what should come out. So solving a linear system means: find the input that lands on <M p=".">b</M> The numbers in <M>A</M> say how the machine works. The next section shows how to see that.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="transformation" title={<T de="2. Die Matrix verwandelt die Ebene" en="2. The matrix transforms the plane" />}>
        <Box kind="uebung" src={<Src u={4} p="15–17" slides />} title={<T de="Was ist eine Matrix? Eine Transformation des Raums!" en="So what is a Matrix? A transformation of space!" />}>
          <T
            de={<p>Zwei Standbilder aus einem Video von 3Blue1Brown, links «vor der Transformation», rechts «nach der Transformation». Die Matrix ist <M p=",">{t`\begin{pmatrix}3 & 1\\1 & 2\end{pmatrix}`}</M> der Vektor <M p=".">{v(-1, 2)}</M> Links das gewohnte Gitter mit den Grundpfeilen. Rechts ist das Gitter schief; die Spalten der Matrix sind eingekreist und angeschrieben mit «Neue „Basis“-Vektoren», die Einträge von <M>x</M> mit «Skalierung der „Basis“-Vektoren». Dazu:</p>}
            en={<p>Two stills from a 3Blue1Brown video, left “Before Transformation”, right “After Transformation”. The matrix is <M p=",">{t`\begin{pmatrix}3 & 1\\1 & 2\end{pmatrix}`}</M> the vector <M p=".">{v(-1, 2)}</M> On the left the usual grid with the basis arrows. On the right the grid is slanted; the columns of the matrix are circled and labelled “New "basis" vectors”, the entries of <M>x</M> “Scaling of "basis" vectors”. And:</p>}
          />
          <div className="la-display">
            <TexMat cols={[['3', '1']]} cls={['k1']} /><M>(-1)</M><M>+</M><TexMat cols={[['1', '2']]} cls={['k2']} /><M>(2)</M><M>=</M><TexMat cols={[['-1', '3']]} />
          </div>
          <T
            de={<p>«Video von 3B1B – sehr zu empfehlen»: <a href="https://youtu.be/kYB8IZa5AuE" target="_blank" rel="noreferrer">3Blue1Brown, Videoreihe «Essence» zur Linearen Algebra, Kapitel 3</a> (lineare Abbildungen und Matrizen) und Kapitel 4 (Matrixmultiplikation als Hintereinanderausführung).</p>}
            en={<p>“Video from 3B1B – highly recommend”: <a href="https://youtu.be/kYB8IZa5AuE" target="_blank" rel="noreferrer">3Blue1Brown, Essence of linear algebra, chapter 3</a> (linear transformations and matrices) and chapter 4 (matrix multiplication as composition).</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man die Folien:</b></p>
            <ol>
              <li>Die <De en="basis vectors">Basisvektoren</De> sind <M>{t`e_1 = ${v(1, 0)}`}</M> (ein Schritt nach rechts) und <M>{t`e_2 = ${v(0, 1)}`}</M> (ein Schritt nach oben). Jeder Vektor ist ein Rezept aus ihnen: <M p=",">{t`x = ${v(-1, 2)} = -1\cdot e_1 + 2\cdot e_2`}</M> also einen Schritt nach links und zwei nach oben.</li>
              <li>Wohin geht <M p="?">{'e_1'}</M> Ausrechnen: <M p=".">{t`\begin{pmatrix}3 & 1\\1 & 2\end{pmatrix}\binom{1}{0} = \binom{3\cdot 1 + 1\cdot 0}{1\cdot 1 + 2\cdot 0} = \binom{3}{1}`}</M> Das ist genau die erste Spalte. Ebenso landet <M>{'e_2'}</M> auf der zweiten Spalte <M p=".">{v(1, 2)}</M> Das meint «neue Basis-Vektoren».</li>
              <li>Das Rezept bleibt gleich, nur die Zutaten sind neu: Statt <M>{t`-1\cdot e_1 + 2\cdot e_2`}</M> rechnet man <M p=".">{t`-1\cdot a_1 + 2\cdot a_2`}</M> Das ist die Zeile auf der Folie: <M p=".">{t`${v(3, 1)}(-1) + ${v(1, 2)}(2) = ${v(-1, 3)}`}</M></li>
              <li>Also landet <M>{v(-1, 2)}</M> auf <M p=".">{v(-1, 3)}</M> Das ist dieselbe Rechnung wie im Spaltenbild, nur anders angeschaut: Dort war <M>x</M> eine Menge, hier ist <M>x</M> ein Punkt, der sich bewegt.</li>
            </ol>
            <p>Warum darf man das Rezept behalten? Weil die Matrix Summen und Vielfache respektiert: Aus <M>{t`-1\cdot e_1 + 2\cdot e_2`}</M> wird <M p=".">{t`-1\cdot Ae_1 + 2\cdot Ae_2`}</M> Das ist genau die Spaltenform von <M>{'Ax'}</M> aus der letzten Lektion.</p>
          </>}
          en={<>
            <p><b>How to read the slides:</b></p>
            <ol>
              <li>The <De en="basis vectors">Basisvektoren</De> are <M>{t`e_1 = ${v(1, 0)}`}</M> (one step to the right) and <M>{t`e_2 = ${v(0, 1)}`}</M> (one step up). Every vector is a recipe made of them: <M p=",">{t`x = ${v(-1, 2)} = -1\cdot e_1 + 2\cdot e_2`}</M> so one step left and two up.</li>
              <li>Where does <M>{'e_1'}</M> go? Compute: <M p=".">{t`\begin{pmatrix}3 & 1\\1 & 2\end{pmatrix}\binom{1}{0} = \binom{3\cdot 1 + 1\cdot 0}{1\cdot 1 + 2\cdot 0} = \binom{3}{1}`}</M> That is exactly the first column. Likewise <M>{'e_2'}</M> lands on the second column <M p=".">{v(1, 2)}</M> This is what “new basis vectors” means.</li>
              <li>The recipe stays the same, only the ingredients are new: instead of <M>{t`-1\cdot e_1 + 2\cdot e_2`}</M> you compute <M p=".">{t`-1\cdot a_1 + 2\cdot a_2`}</M> That is the line on the slide: <M p=".">{t`${v(3, 1)}(-1) + ${v(1, 2)}(2) = ${v(-1, 3)}`}</M></li>
              <li>So <M>{v(-1, 2)}</M> lands on <M p=".">{v(-1, 3)}</M> This is the same computation as in the column picture, seen differently: there <M>x</M> was an amount, here <M>x</M> is a point that moves.</li>
            </ol>
            <p>Why may you keep the recipe? Because the matrix respects sums and multiples: <M>{t`-1\cdot e_1 + 2\cdot e_2`}</M> becomes <M p=".">{t`-1\cdot Ae_1 + 2\cdot Ae_2`}</M> That is exactly the column form of <M>{'Ax'}</M> from the last lesson.</p>
          </>}
        />
        <Box kind="uebung" src={<Src u={4} vis="Matrix as a Transformation" />} title={<T de="Die Ebene unter der Matrix" en="The plane under the matrix" />}>
          <T
            de={<p>Das Bild beginnt mit der Matrix der Folien. Der Regler <M>t</M> verwandelt die Ebene: <M>{t`t = 0`}</M> ist vorher, <M>{t`t = 1`}</M> nachher. Grün und blau gehen <M>{'e_1'}</M> und <M>{'e_2'}</M> auf die Spalten <M>{'a_1'}</M> und <M p=".">{'a_2'}</M> Der dunkle Pfeil ist <M>x</M> und wird zu <M p=";">{t`Ax`}</M> die dünne grün-blaue Kette daneben ist das Rezept <M p=".">{t`x_1 a_1 + x_2 a_2`}</M> Das graue Gitter bewegt sich mit, die violetten Eingaben auch.</p>}
            en={<p>The figure starts with the matrix of the slides. The slider <M>t</M> transforms the plane: <M>{t`t = 0`}</M> is before, <M>{t`t = 1`}</M> after. Green and blue, <M>{'e_1'}</M> and <M>{'e_2'}</M> go to the columns <M>{'a_1'}</M> and <M p=".">{'a_2'}</M> The dark arrow is <M>x</M> and becomes <M p=";">{t`Ax`}</M> the thin green-blue chain beside it is the recipe <M p=".">{t`x_1 a_1 + x_2 a_2`}</M> The grey grid moves along, and so do the purple inputs.</p>}
          />
        </Box>
        <TransformExplorer />
        <T
          de={<>
            <p><b>Was man ausprobieren kann.</b> Die Galerie zeigt typische Maschinen. Bei jeder lohnt sich der Blick auf die Spalten:</p>
            <ul>
              <li><b>Scherung</b> <M p=":">{t`\begin{pmatrix}1 & 1\\0 & 1\end{pmatrix}`}</M> <M>{'e_1'}</M> bleibt, <M>{'e_2'}</M> kippt nach <M p=".">{v(1, 1)}</M> Die Zeilen des Gitters rutschen seitwärts wie ein Stapel Karten.</li>
              <li><b>Drehung um <M p="°">{t`90`}</M></b> <M p=":">{t`\begin{pmatrix}0 & -1\\1 & 0\end{pmatrix}`}</M> <M>{'e_1'}</M> geht nach oben, <M>{'e_2'}</M> nach links. Das Gitter dreht sich, ohne sich zu verbiegen.</li>
              <li><b>Spiegelung</b> <M p=":">{t`\begin{pmatrix}0 & 1\\1 & 0\end{pmatrix}`}</M> <M>{'e_1'}</M> und <M>{'e_2'}</M> tauschen die Plätze; die Ebene klappt an der Diagonalen um.</li>
              <li><b>Streckung</b> <M p=":">{t`\begin{pmatrix}2 & 0\\0 & 0{,}5\end{pmatrix}`}</M> doppelt so breit, halb so hoch.</li>
            </ul>
            <p>Mit «Eingabe zu <M>b</M> finden» stellt man die Frage der Kernidee: Welches <M>x</M> landet auf <M p="?">b</M> Bei Rang 2 gibt es genau eines; man kann die Verwandlung rückgängig machen (das ist <M p=",">{t`x = A^{-1}b`}</M> mehr dazu später im Kurs). Die Einträge von <M>A</M> lassen sich auch eintippen.</p>
          </>}
          en={<>
            <p><b>What to try.</b> The gallery shows typical machines. For each, look at the columns:</p>
            <ul>
              <li><b>Shear</b> <M p=":">{t`\begin{pmatrix}1 & 1\\0 & 1\end{pmatrix}`}</M> <M>{'e_1'}</M> stays, <M>{'e_2'}</M> tips over to <M p=".">{v(1, 1)}</M> The rows of the grid slide sideways like a stack of cards.</li>
              <li><b>Rotation by <M p="°">{t`90`}</M></b> <M p=":">{t`\begin{pmatrix}0 & -1\\1 & 0\end{pmatrix}`}</M> <M>{'e_1'}</M> goes up, <M>{'e_2'}</M> to the left. The grid turns without bending.</li>
              <li><b>Reflection</b> <M p=":">{t`\begin{pmatrix}0 & 1\\1 & 0\end{pmatrix}`}</M> <M>{'e_1'}</M> and <M>{'e_2'}</M> swap places; the plane flips over the diagonal.</li>
              <li><b>Stretch</b> <M p=":">{t`\begin{pmatrix}2 & 0\\0 & 0.5\end{pmatrix}`}</M> twice as wide, half as high.</li>
            </ul>
            <p>With “Find the input for <M p="”">b</M> you ask the question of the key idea: which <M>x</M> lands on <M p="?">b</M> For rank 2 there is exactly one; the transformation can be undone (that is <M p=",">{t`x = A^{-1}b`}</M> more on this later in the course). The entries of <M>A</M> can also be typed in.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="rang" title={<T de="3. Unvollständiger Rang: die Ebene klappt zusammen" en="3. Incomplete rank: the plane folds up" />}>
        <Box kind="uebung" src={<Src u={4} p="18–20" slides />} title={<T de="Unvollständiger Rang" en="Incomplete Rank" />}>
          <T
            de={<p>«Was passiert mit den Vektoren, die durch die Matrix <M>{t`\begin{pmatrix}1 & -2\\2 & -4\end{pmatrix}`}</M> transformiert werden? Beachte: Der Rang der Matrix ist <M p=".»">1</M></p>}
            en={<p>“What's going to happen to the vectors transformed by the matrix <M p="?">{t`\begin{pmatrix}1 & -2\\2 & -4\end{pmatrix}`}</M> Notice that the Rank of the Matrix is <M p=".”">1</M></p>}
          />
          <MD>{t`\begin{pmatrix}1 & -2\\2 & -4\end{pmatrix}\begin{pmatrix}-2\\-2\end{pmatrix} = \begin{pmatrix}1\\2\end{pmatrix}(-2) + \begin{pmatrix}-2\\-4\end{pmatrix}(-2) = \begin{pmatrix}2\\4\end{pmatrix}`}</MD>
          <MD>{t`\begin{pmatrix}1 & -2\\2 & -4\end{pmatrix}\begin{pmatrix}1\\-2\end{pmatrix} = \begin{pmatrix}1\\2\end{pmatrix}(3) + \begin{pmatrix}-2\\-4\end{pmatrix}(-2) = \begin{pmatrix}-1\\-2\end{pmatrix}`}</MD>
          <T
            de={<p>Handschriftlich: «Die Matrix transformiert den Raum auf diese neuen Basisvektoren» (beide Spalten liegen auf einer Geraden) und «Da der Rang nicht voll war, klappt die Transformation den Raum praktisch auf eine Gerade zusammen.»</p>}
            en={<p>Handwritten: “The Matrix transforms space onto these new basis vectors” (both columns lie on one line) and “As the rank was not full, the transformation in effect collapses space onto a line.”</p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> Die zweite Spalte ist <M>-2</M> mal die erste. <M>{'e_1'}</M> und <M>{'e_2'}</M> landen also auf derselben Geraden durch <M p=".">{v(1, 2)}</M> Jede Eingabe ist ein Rezept aus <M>{'e_1'}</M> und <M p=",">{'e_2'}</M> ihr Bild also ein Rezept aus zwei Pfeilen auf dieser Geraden. Darum bleibt das Bild auf der Geraden: Die ganze Ebene wird flachgedrückt.</p>}
          en={<p><b>How to read it:</b> the second column is <M>-2</M> times the first. So <M>{'e_1'}</M> and <M>{'e_2'}</M> land on the same line through <M p=".">{v(1, 2)}</M> Every input is a recipe of <M>{'e_1'}</M> and <M p=",">{'e_2'}</M> so its image is a recipe of two arrows on this line. That is why the image stays on the line: the whole plane is flattened.</p>}
        />
        <CollapseAnim />
        <T
          de={<p>Auf Folie 20 steht beim zweiten Beispiel der Faktor <M>3</M> statt <M>1</M> und das Ergebnis <M p=";">{v(-1, -2)}</M> richtig ist <M p=".">{t`${v(1, 2)}\cdot 1 + ${v(-2, -4)}\cdot(-2) = ${v(5, 10)}`}</M> Die Aussage der Folie bleibt gleich: Auch <M>{v(5, 10)}</M> liegt auf der Geraden.</p>}
          en={<p>On slide 20 the second example has the factor <M>3</M> instead of <M>1</M> and the result <M p=";">{v(-1, -2)}</M> correct is <M p=".">{t`${v(1, 2)}\cdot 1 + ${v(-2, -4)}\cdot(-2) = ${v(5, 10)}`}</M> The point of the slide stays the same: <M>{v(5, 10)}</M> lies on the line too.</p>}
        />
        <T
          de={<p><b>Was heisst das für <M p="?">{t`Ax = b`}</M></b> Nach der Verwandlung liegt alles auf der Geraden. Liegt <M>b</M> daneben, kann kein <M>x</M> dort landen: keine Lösung. Liegt <M>b</M> darauf, landet eine ganze Gerade von Eingaben auf <M p=":">b</M> unendlich viele Lösungen. Das ist dasselbe Ergebnis wie im Spaltenbild. Im Bild oben: Beispiel «Rang 1», dann «Eingabe zu <M>b</M> finden», und <M>b</M> von der Geraden wegziehen.</p>}
          en={<p><b>What does this mean for <M p="?">{t`Ax = b`}</M></b> After the transformation everything lies on the line. If <M>b</M> lies beside it, no <M>x</M> can land there: no solution. If <M>b</M> lies on it, a whole line of inputs lands on <M p=":">b</M> infinitely many solutions. This is the same result as in the column picture. In the figure above: example “Rank 1”, then “Find the input for <M p="”,">b</M> and drag <M>b</M> off the line.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="landen" title={<T de="4. Wohin landen diese Vektoren?" en="4. Where would these vectors land?" />}>
        <T
          de={<p>Folie 21 stellt drei Fragen; hier die Antworten der Folie, jeweils mit Bild. Die Methode ist immer dieselbe: Die Einträge von <M>x</M> sagen, wie viel von jeder Spalte man nimmt.</p>}
          en={<p>Slide 21 asks three questions; here are the slide's answers, each with a picture. The method is always the same: the entries of <M>x</M> say how much of each column to take.</p>}
        />
        <Box kind="uebung" src={<Src u={4} p={21} slides />} title={<T de="Wohin landen diese Vektoren?" en="Where would these vectors land?" />}>
          <div className="la-minis">
            <Landing A={[['1', '0'], ['0', '1']]} x={[7, 19]} Ax={['7', '19']}
              cols={t`\begin{pmatrix}7\\19\end{pmatrix} = 7\begin{pmatrix}1\\0\end{pmatrix} + 19\begin{pmatrix}0\\1\end{pmatrix}`}
              label={lang === 'de' ? 'Die Einheitsmatrix lässt alles, wo es ist' : 'The identity leaves everything where it is'}
              text={<T de={<>Die <De en="identity matrix">Einheitsmatrix</De> <M>{t`\mathbb{I}`}</M> schickt <M>{'e_1'}</M> auf <M>{'e_1'}</M> und <M>{'e_2'}</M> auf <M p=".">{'e_2'}</M> Nichts bewegt sich.</>} en={<>The <De en="identity matrix">Einheitsmatrix</De> <M>{t`\mathbb{I}`}</M> sends <M>{'e_1'}</M> to <M>{'e_1'}</M> and <M>{'e_2'}</M> to <M p=".">{'e_2'}</M> Nothing moves.</>} />} />
            <Landing A={[['2', '1'], ['-3', '2']]} x={[1, 2]} Ax={['-4', '5']}
              cols={t`\begin{pmatrix}2\\1\end{pmatrix}(1) + \begin{pmatrix}-3\\2\end{pmatrix}(2) = \begin{pmatrix}-4\\5\end{pmatrix}`}
              label={lang === 'de' ? '(2 −3; 1 2) schickt (1, 2) nach (−4, 5)' : '(2 −3; 1 2) sends (1, 2) to (−4, 5)'}
              text={<T de={<>Einmal die erste Spalte, zweimal die zweite: <M p=",">{t`2 - 6 = -4`}</M> <M p=".">{t`1 + 4 = 5`}</M></>} en={<>Once the first column, twice the second: <M p=",">{t`2 - 6 = -4`}</M> <M p=".">{t`1 + 4 = 5`}</M></>} />} />
            <Landing A={[['1', '2'], ['-2', '-4']]} x={[-2, 1]} Ax={['-4', '-8']}
              cols={t`\begin{pmatrix}1\\2\end{pmatrix}(-2) + \begin{pmatrix}-2\\-4\end{pmatrix}(1) = \begin{pmatrix}-4\\-8\end{pmatrix}`}
              label={lang === 'de' ? '(1 −2; 2 −4) schickt (−2, 1) nach (−4, −8)' : '(1 −2; 2 −4) sends (−2, 1) to (−4, −8)'}
              text={<T de={<>Die Matrix von Abschnitt 3: Auch <M>{v(-4, -8)}</M> liegt auf der Geraden durch <M p=".">{v(1, 2)}</M></>} en={<>The matrix of section 3: <M>{v(-4, -8)}</M> also lies on the line through <M p=".">{v(1, 2)}</M></>} />} />
          </div>
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Eine Matrix ist nur eine Zahlentabelle»" en="“A matrix is just a table of numbers”" />}>
        <T
          de={<p>Man schreibt sie als Tabelle, aber sie <em>tut</em> etwas: Sie bewegt jeden Punkt der Ebene. Die Tabelle ist nur die kürzeste Beschreibung dieser Bewegung. Wer die Spalten liest, sieht die Bewegung: wohin <M>{'e_1'}</M> und <M>{'e_2'}</M> gehen.</p>}
          en={<p>You write it as a table, but it <em>does</em> something: it moves every point of the plane. The table is only the shortest description of this motion. Read the columns and you see the motion: where <M>{'e_1'}</M> and <M>{'e_2'}</M> go.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Die Spalten sind zwei Punkte der Ebene»" en="“The columns are two points of the plane”" />}>
        <T
          de={<p>Die Spalten sind die <em>Bilder</em> der Grundpfeile: <M>{'a_1'}</M> ist der Ort, wo <M>{'e_1'}</M> landet, <M>{'a_2'}</M> der Ort, wo <M>{'e_2'}</M> landet. Mit ihnen weiss man, wo jeder andere Punkt landet: <M p=".">{t`x_1 e_1 + x_2 e_2 \mapsto x_1 a_1 + x_2 a_2`}</M></p>}
          en={<p>The columns are the <em>images</em> of the basic arrows: <M>{'a_1'}</M> is where <M>{'e_1'}</M> lands, <M>{'a_2'}</M> where <M>{'e_2'}</M> lands. With them you know where every other point lands: <M p=".">{t`x_1 e_1 + x_2 e_2 \mapsto x_1 a_1 + x_2 a_2`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Rang 1 dreht die Ebene»" en="“Rank 1 rotates the plane”" />}>
        <T
          de={<p>Rang 1 dreht nicht, er drückt flach: Die ganze Ebene landet auf einer Geraden. Eine Drehung (Beispiel «Drehung um <M p="°»)">{t`90`}</M> hat Rang 2: Das Gitter bleibt ein volles Gitter, und jeder Punkt hat genau einen Ursprung.</p>}
          en={<p>Rank 1 does not turn, it flattens: the whole plane lands on one line. A rotation (example “Rotation <M p="°”)">{t`90`}</M> has rank 2: the grid stays a full grid, and every point comes from exactly one input.</p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Eine Matrix ist eine Transformation der Ebene. <M>{t`Ax = b`}</M> fragt: Welches <M>x</M> landet auf <M p="?">b</M></li>
            <li>Die Spalten sind die Bilder der Basisvektoren: <M>{t`Ae_1 = a_1`}</M> und <M p=".">{t`Ae_2 = a_2`}</M> Daraus folgt <M p=".">{t`Ax = x_1 a_1 + x_2 a_2`}</M></li>
            <li>Rang 2: Die Ebene bleibt eine Ebene. Rang 1: Sie wird auf eine Gerade gedrückt; <M>b</M> neben der Geraden wird nie erreicht.</li>
          </ul>}
          en={<ul>
            <li>A matrix is a transformation of the plane. <M>{t`Ax = b`}</M> asks: which <M>x</M> lands on <M p="?">b</M></li>
            <li>The columns are the images of the basis vectors: <M>{t`Ae_1 = a_1`}</M> and <M p=".">{t`Ae_2 = a_2`}</M> Hence <M p=".">{t`Ax = x_1 a_1 + x_2 a_2`}</M></li>
            <li>Rank 2: the plane stays a plane. Rank 1: it is squashed onto a line; a <M>b</M> beside the line is never reached.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
