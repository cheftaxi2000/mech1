import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { CompositionExplorer, FingerComputer, ShapeChecker } from '../viz/la/ProdFigures';

const t = String.raw;

export default function LA5Produkt() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Matrix verformt den Raum (<a href="#la-transformation">Die Matrix als Transformation</a>). Was passiert, wenn man zwei Verformungen hintereinander ausführt? Das Ergebnis ist wieder eine Verformung – und ihre Matrix ist das <b>Matrixprodukt</b>. Hier lernst du, was es bedeutet, wann es existiert und wie man es mit den Fingern ausrechnet.</p>}
        en={<p className="lede">A matrix deforms space (<a href="#la-transformation">The matrix as a transformation</a>). What happens if you perform two deformations one after the other? The result is again a deformation – and its matrix is the <b>matrix product</b>. Here you learn what it means, when it exists, and how to compute it with your fingers.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Ein Foto am Handy: zuerst drehen, dann verzerren. Die App könnte auch beides in einem einzigen Schritt machen – mit einer einzigen, «zusammengesetzten» Bearbeitung. Genau das ist <M p=":">AB</M> eine Matrix, die auf einmal tut, wofür man sonst zwei braucht. Und wie beim Foto spielt die Reihenfolge eine Rolle.</p>}
          en={<p>A photo on your phone: first rotate it, then distort it. The app could also do both in one single step – with one “combined” edit. That is exactly <M p=":">AB</M> one matrix that does at once what otherwise needs two. And as with the photo, the order matters.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="komposition" title={<T de="1. Zwei Verformungen hintereinander" en="1. Two deformations in a row" />}>
        <Box kind="uebung" src={<Src u={4} p={26} slides />} title={<T de="Matrixmultiplikation" en={<><De en="matrix multiplication">Matrixmultiplikation</De></>} />}>
          <T
            de={<p>«Die Matrixmultiplikation stellt die gesamte Transformation dar, nachdem man zwei Transformationen angewendet hat (oder ‹Komposition›).» Über <M>{t`AB = C`}</M> steht ein Pfeil nach links: «rückwärts». «Transformation <M>B</M> und dann <M>A</M> anzuwenden ist dasselbe, wie Transformation <M>C</M> anzuwenden.»</p>}
            en={<p>“Matrix multiplication represents the total transformation after applying two transformations (or ‘composition’).” Above <M>{t`AB = C`}</M> there is an arrow to the left: “backwards”. “Applying transformation <M>B</M> and then <M>A</M> is the same as applying transformation <M p=".">C</M>”</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>{t`AB`}</M> spricht man «A mal B». Gemeint ist: zuerst <M p=",">B</M> danach <M p=".">A</M></li>
              <li>Warum «rückwärts»? Weil der Vektor rechts steht. In <M>{t`A(Bx)`}</M> kommt <M>x</M> zuerst bei <M>B</M> an, das direkt daneben steht. Erst das Ergebnis <M>Bx</M> geht dann weiter zu <M p=".">A</M></li>
              <li><M>{t`C = AB`}</M> ist die eine Matrix, die beides auf einmal tut: <M p=".">{t`Cx = (AB)x = A(Bx)`}</M></li>
            </ol>
            <p>Das Bild ist eine Umsetzung der Visualisierung «Composing Transformations» der Übung. Wähle ein Beispiel (oder tippe eigene Zahlen ein) und spiel die sechs Schritte ab.</p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>{t`AB`}</M> is read “A times B”. It means: first <M p=",">B</M> then <M p=".">A</M></li>
              <li>Why “backwards”? Because the vector stands on the right. In <M>{t`A(Bx)`}</M> the <M>x</M> reaches <M>B</M> first, which stands right next to it. Only the result <M>Bx</M> then moves on to <M p=".">A</M></li>
              <li><M>{t`C = AB`}</M> is the one matrix that does both at once: <M p=".">{t`Cx = (AB)x = A(Bx)`}</M></li>
            </ol>
            <p>The figure is a port of the class visualisation “Composing Transformations”. Pick an example (or type your own numbers) and play the six steps.</p>
          </>}
        />
        <p className="fig-src"><Src u={5} vis="Composing Transformations" /></p>
        <CompositionExplorer />
        <T
          de={<p><b>Was die Beispiele zeigen:</b> Bei «Scherung → Drehung» und «Drehung → Scherung» sind die Endbilder verschieden. Bei «Spiegelung → Spiegelung» und «45° → 45°» kommt in beiden Reihenfolgen dasselbe heraus – solche Paare sind die Ausnahme. «Scherung → zurück» endet beim unverformten <M p=":">{t`\mathsf{F}`}</M> <M>A</M> macht <M>B</M> rückgängig, <M p=".">{t`AB = \mathbb{I}`}</M></p>}
          en={<p><b>What the examples show:</b> for “Shear → Rotation” and “Rotation → Shear” the final pictures differ. For “Flip → Flip” and “45° → 45°” both orders give the same – such pairs are the exception. “Shear → Undo” ends with the undeformed <M p=":">{t`\mathsf{F}`}</M> <M>A</M> undoes <M p=",">B</M> <M p=".">{t`AB = \mathbb{I}`}</M></p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bedingung" title={<T de="2. Wann gibt es das Produkt?" en="2. When does the product exist?" />}>
        <Box kind="uebung" src={<Src u={4} p={28} slides />} title={<T de="Bedingung für die Multiplikation" en="Requirement for multiplication" />}>
          <T
            de={<p>«Wenn ein Vektor transformiert wird:» Eine Matrix mit <M>m</M> Zeilen und <M>3</M> Spalten mal einen Vektor mit <M>3</M> Einträgen ist die Kombination der drei Spalten.</p>}
            en={<p>“In case of vector being transformed:” a matrix with <M>m</M> rows and <M>3</M> columns times a vector with <M>3</M> entries is the combination of the three columns.</p>}
          />
          <MD>{t`\begin{pmatrix}a&b&c\\d&e&f\\\vdots&\vdots&\vdots\\\alpha&\beta&\gamma\end{pmatrix}\begin{pmatrix}x_1\\x_2\\x_3\end{pmatrix} = \begin{pmatrix}a\\d\\\vdots\\\alpha\end{pmatrix}x_1 + \begin{pmatrix}b\\e\\\vdots\\\beta\end{pmatrix}x_2 + \begin{pmatrix}c\\f\\\vdots\\\gamma\end{pmatrix}x_3`}</MD>
          <T
            de={<p>«Die Matrix muss so viele Spalten haben, wie der Vektor Zeilen hat.» «Dasselbe gilt für die Matrixmultiplikation:» <M p=".">{t`A^{m\times n}\cdot B^{n\times p} = C^{m\times p}`}</M> Die beiden inneren <M>n</M> sind rot markiert: «Required!»</p>}
            en={<p>“The matrix must have as many columns as the vector has rows.” “Same applies to matrix multiplication:” <M p=".">{t`A^{m\times n}\cdot B^{n\times p} = C^{m\times p}`}</M> The two inner <M>n</M> are marked in red: “Required!”</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> Jede Spalte von <M>A</M> bekommt einen Faktor aus dem Vektor. Hat <M>A</M> drei Spalten, braucht es genau drei Faktoren – nicht zwei, nicht vier. Darum: Spaltenzahl von <M>A</M> gleich Zeilenzahl von <M p=".">B</M></p>
            <p>Merkhilfe: Schreib die Formen nebeneinander, <M p=".">{t`(m\times n)(n\times p)`}</M> Die zwei inneren Zahlen müssen gleich sein und «fallen weg»; die zwei äusseren bleiben übrig und sind die Form von <M p=".">C</M> Ein Vektor ist der Spezialfall <M p=".">{t`p = 1`}</M></p>
          </>}
          en={<>
            <p><b>How to read this:</b> every column of <M>A</M> gets one factor from the vector. If <M>A</M> has three columns it needs exactly three factors – not two, not four. Hence: number of columns of <M>A</M> equals number of rows of <M p=".">B</M></p>
            <p>Memory aid: write the shapes side by side, <M p=".">{t`(m\times n)(n\times p)`}</M> The two inner numbers must agree and “drop out”; the two outer ones remain and are the shape of <M p=".">C</M> A vector is the special case <M p=".">{t`p = 1`}</M></p>
          </>}
        />
        <ShapeChecker />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="fingerrechner" title={<T de="3. Ausrechnen: der Finger-Rechner" en="3. Computing it: the finger computer" />}>
        <Box kind="uebung" src={<Src u={4} p="27, 29" slides />} title={<T de="Matrixmultiplikation und «Finger Computer»" en="Matrix multiplication and “finger computer”" />}>
          <MD>{t`\begin{pmatrix}0&2\\1&0\end{pmatrix}\begin{pmatrix}1&-2\\1&0\end{pmatrix} = \begin{pmatrix}0\cdot 1 + 2\cdot 1 & 0\cdot(-2) + 2\cdot 0\\ 1\cdot 1 + 0\cdot 1 & 1\cdot(-2) + 0\cdot 0\end{pmatrix} = \begin{pmatrix}2&0\\1&-2\end{pmatrix}`}</MD>
          <T
            de={<p>Folie 27 rechnet dasselbe spaltenweise: Die Spalten der rechten Matrix sind zwei Vektoren. <M>A</M> angewendet auf <M>{t`(1, 1)^T`}</M> gibt <M p=",">{t`(0,1)^T\cdot 1 + (2,0)^T\cdot 1 = (2, 1)^T`}</M> angewendet auf <M>{t`(-2, 0)^T`}</M> gibt <M p=".">{t`(0,1)^T\cdot(-2) + (2,0)^T\cdot 0 = (0, -2)^T`}</M> Das sind die zwei Spalten des Ergebnisses. «Ich erkläre das nächste Woche visuell.»</p>}
            en={<p>Slide 27 computes the same column by column: the columns of the right matrix are two vectors. <M>A</M> applied to <M>{t`(1, 1)^T`}</M> gives <M p=",">{t`(0,1)^T\cdot 1 + (2,0)^T\cdot 1 = (2, 1)^T`}</M> applied to <M>{t`(-2, 0)^T`}</M> it gives <M p=".">{t`(0,1)^T\cdot(-2) + (2,0)^T\cdot 0 = (0, -2)^T`}</M> These are the two columns of the result. “I'll explain this visually next week.”</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das – zwei Wege zum selben Ergebnis:</b></p>
            <ol>
              <li><b>Ein Eintrag:</b> Für das Feld in Zeile <M>i</M> und Spalte <M>j</M> fährst du mit dem linken Finger die Zeile <M>i</M> von <M>A</M> entlang und mit dem rechten Finger die Spalte <M>j</M> von <M p=".">B</M> Die Zahlen unter den Fingern multiplizierst du paarweise und zählst alles zusammen.</li>
              <li><b>Eine Spalte:</b> Die Spalte <M>j</M> von <M>C</M> ist <M>A</M> angewendet auf die Spalte <M>j</M> von <M p=".">B</M> Das ist das Bild aus Abschnitt 1: <M>A</M> verformt die Pfeile, die <M>B</M> schon gebaut hat.</li>
            </ol>
            <p>Probiere beide Arten im Bild aus. Die Beispiele von Folie 30 sind auch dabei.</p>
          </>}
          en={<>
            <p><b>How to read this – two ways to the same result:</b></p>
            <ol>
              <li><b>One entry:</b> for the cell in row <M>i</M> and column <M>j</M> run your left finger along row <M>i</M> of <M>A</M> and your right finger down column <M>j</M> of <M p=".">B</M> Multiply the numbers under your fingers pairwise and add everything up.</li>
              <li><b>One column:</b> column <M>j</M> of <M>C</M> is <M>A</M> applied to column <M>j</M> of <M p=".">B</M> This is the picture from section 1: <M>A</M> deforms the arrows that <M>B</M> has already built.</li>
            </ol>
            <p>Try both ways in the figure. The examples of slide 30 are included too.</p>
          </>}
        />
        <FingerComputer />
        <Box kind="supplement" title={<T de="Die Fingerregel als Formel" en="The finger rule as a formula" />}>
          <MD>{t`C_{ij} = A_{i1}B_{1j} + A_{i2}B_{2j} + \dots + A_{in}B_{nj} = \sum_{k=1}^{n} A_{ik}B_{kj}`}</MD>
          <T
            de={<p>Das Summenzeichen <M>{t`\sum`}</M> heisst nur «zähle alle diese Produkte zusammen», wobei <M>k</M> von <M>1</M> bis <M>n</M> läuft. Hier sieht man auch die Bedingung aus Abschnitt 2: <M>k</M> zählt gleichzeitig die Spalten von <M>A</M> und die Zeilen von <M p=",">B</M> beide müssen bis <M>n</M> reichen.</p>}
            en={<p>The summation sign <M>{t`\sum`}</M> just says “add up all these products”, with <M>k</M> running from <M>1</M> to <M p=".">n</M> The requirement of section 2 is visible here too: <M>k</M> counts the columns of <M>A</M> and the rows of <M>B</M> at the same time; both must reach <M p=".">n</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="beispiele" title={<T de="4. Die Aufgaben von Folie 30" en="4. The exercises of slide 30" />}>
        <Box kind="uebung" src={<Src u={4} p={30} slides />} title={<T de="Matrixmultiplikation – Aufgaben" en="Matrix multiplication – exercises" />}>
          <MD>{t`\begin{pmatrix}1\\1\\0\\3\end{pmatrix}\begin{pmatrix}1&0\end{pmatrix} = \begin{pmatrix}1&0\\1&0\\0&0\\3&0\end{pmatrix}`}</MD>
          <MD>{t`\begin{pmatrix}1&0\\2&2\\0&1\end{pmatrix}\begin{pmatrix}1&2\\1&0\end{pmatrix} = \ ?\qquad \begin{pmatrix}2&0&0\\0&1&0\\0&0&-2\end{pmatrix}\begin{pmatrix}8&2\\5&2\\6&9\end{pmatrix} = \ ?`}</MD>
          <T
            de={<p>Im annotierten PDF ist nur die erste Antwort stehen geblieben; die beiden anderen rechnen wir unten selbst aus.</p>}
            en={<p>In the annotated PDF only the first answer is left; we work out the other two ourselves below.</p>}
          />
        </Box>
        <T
          de={<p><b>Aufgabe 1 gelesen:</b> <M>{t`4\times 1`}</M> mal <M>{t`1\times 2`}</M> – innen <M p=",">{t`1 = 1`}</M> also existiert das Produkt und ist <M p=".">{t`4\times 2`}</M> Jede «Summe» hat nur einen Summanden. Die erste Spalte ist der Vektor mal <M p=",">1</M> die zweite der Vektor mal <M p=".">0</M></p>}
          en={<p><b>Exercise 1 read aloud:</b> <M>{t`4\times 1`}</M> times <M>{t`1\times 2`}</M> – inside <M p=",">{t`1 = 1`}</M> so the product exists and is <M p=".">{t`4\times 2`}</M> Every “sum” has a single term. The first column is the vector times <M p=",">1</M> the second the vector times <M p=".">0</M></p>}
        />
        <Box kind="supplement" title={<T de="Lösungen zu den Aufgaben 2 und 3 (von uns gerechnet)" en="Solutions to exercises 2 and 3 (computed by us)" />}>
          <T
            de={<p><b>Aufgabe 2:</b> <M>{t`3\times 2`}</M> mal <M p=":">{t`2\times 2`}</M> innen <M p=",">{t`2 = 2`}</M> Ergebnis <M p=".">{t`3\times 2`}</M></p>}
            en={<p><b>Exercise 2:</b> <M>{t`3\times 2`}</M> times <M p=":">{t`2\times 2`}</M> inside <M p=",">{t`2 = 2`}</M> result <M p=".">{t`3\times 2`}</M></p>}
          />
          <MD>{t`\begin{pmatrix}1&0\\2&2\\0&1\end{pmatrix}\begin{pmatrix}1&2\\1&0\end{pmatrix} = \begin{pmatrix}1\cdot1+0\cdot1 & 1\cdot2+0\cdot0\\ 2\cdot1+2\cdot1 & 2\cdot2+2\cdot0\\ 0\cdot1+1\cdot1 & 0\cdot2+1\cdot0\end{pmatrix} = \begin{pmatrix}1&2\\4&4\\1&0\end{pmatrix}`}</MD>
          <T
            de={<p><b>Aufgabe 3:</b> <M>{t`3\times 3`}</M> mal <M p=":">{t`3\times 2`}</M> Ergebnis <M p=".">{t`3\times 2`}</M> Links steht eine Diagonalmatrix (Lektion <a href="#la-spezial">Spezielle Matrizen</a>). Sie multipliziert einfach jede <em>Zeile</em> von rechts mit ihrer Diagonalzahl: die erste mit <M p=",">2</M> die zweite mit <M p=",">1</M> die dritte mit <M p=".">-2</M></p>}
            en={<p><b>Exercise 3:</b> <M>{t`3\times 3`}</M> times <M p=":">{t`3\times 2`}</M> result <M p=".">{t`3\times 2`}</M> On the left is a diagonal matrix (lesson <a href="#la-spezial">Special matrices</a>). It simply multiplies every <em>row</em> of the right factor by its diagonal number: the first by <M p=",">2</M> the second by <M p=",">1</M> the third by <M p=".">-2</M></p>}
          />
          <MD>{t`\begin{pmatrix}2&0&0\\0&1&0\\0&0&-2\end{pmatrix}\begin{pmatrix}8&2\\5&2\\6&9\end{pmatrix} = \begin{pmatrix}16&4\\5&2\\-12&-18\end{pmatrix}`}</MD>
        </Box>
        <Box kind="supplement" title={<T de={<>Probe mit Zahlen: <M>{t`(AB)^T = B^TA^T`}</M></>} en={<>A check with numbers: <M>{t`(AB)^T = B^TA^T`}</M></>} />}>
          <T
            de={<p>Diese Regel aus der Lektion <a href="#la-spezial">Spezielle Matrizen</a> prüfen wir an Aufgabe 2. Links: das Ergebnis oben transponieren. Rechts: zuerst beide Faktoren transponieren und in umgekehrter Reihenfolge multiplizieren.</p>}
            en={<p>We check this rule from the lesson <a href="#la-spezial">Special matrices</a> on exercise 2. Left: transpose the result above. Right: first transpose both factors and multiply them in reverse order.</p>}
          />
          <MD>{t`(AB)^T = \begin{pmatrix}1&4&1\\2&4&0\end{pmatrix},\qquad B^TA^T = \begin{pmatrix}1&1\\2&0\end{pmatrix}\begin{pmatrix}1&2&0\\0&2&1\end{pmatrix} = \begin{pmatrix}1&4&1\\2&4&0\end{pmatrix}\ \checkmark`}</MD>
          <T
            de={<p>Die Formen erklären die Umkehrung: <M>{t`A^T`}</M> ist <M>{t`2\times 3`}</M> und <M>{t`B^T`}</M> ist <M p=".">{t`2\times 2`}</M> Nur <M>{t`B^T A^T`}</M> passt zusammen. Eine Zahlenprobe ist kein Beweis, aber ein guter Test.</p>}
            en={<p>The shapes explain the reversal: <M>{t`A^T`}</M> is <M>{t`2\times 3`}</M> and <M>{t`B^T`}</M> is <M p=".">{t`2\times 2`}</M> Only <M>{t`B^T A^T`}</M> fits together. A numerical check is not a proof, but a good test.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«<M p="»">{t`AB = BA`}</M></>} en={<>“<M p="”">{t`AB = BA`}</M></>} />}>
        <T
          de={<p>Fast nie. Mit den Matrizen der Folie: <M>{t`AB = \begin{pmatrix}2&0\\1&-2\end{pmatrix}`}</M> aber <M p=".">{t`BA = \begin{pmatrix}-2&2\\0&2\end{pmatrix}`}</M> Im Bild: Schritt 6 endet woanders als die violette Kontur. Bei nicht quadratischen Matrizen existiert <M>BA</M> oft nicht einmal.</p>}
          en={<p>Almost never. With the matrices of the slide: <M>{t`AB = \begin{pmatrix}2&0\\1&-2\end{pmatrix}`}</M> but <M p=".">{t`BA = \begin{pmatrix}-2&2\\0&2\end{pmatrix}`}</M> In the figure: step 6 ends somewhere else than the purple outline. For non-square matrices <M>BA</M> often does not even exist.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>AB</M> liest man von links nach rechts: erst <M p=",">A</M> dann <M>B</M>»</>} en={<>“<M>AB</M> is read left to right: first <M p=",">A</M> then <M>B</M>”</>} />}>
        <T
          de={<p>Umgekehrt. Der Vektor steht rechts, darum wirkt die Matrix rechts zuerst: <M p=".">{t`(AB)x = A(Bx)`}</M> Deshalb steht auf Folie 26 «backwards».</p>}
          en={<p>The other way round. The vector stands on the right, so the matrix on the right acts first: <M p=".">{t`(AB)x = A(Bx)`}</M> That is why slide 26 says “backwards”.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Zeile mal Zeile»" en="“Row times row”" />}>
        <T
          de={<p>Der linke Finger läuft eine <em>Zeile</em> von <M>A</M> entlang, der rechte eine <em>Spalte</em> von <M p=".">B</M> Wer Zeile mal Zeile rechnet, erhält bei <M>{t`\begin{pmatrix}0&2\\1&0\end{pmatrix}\begin{pmatrix}1&-2\\1&0\end{pmatrix}`}</M> oben links <M>{t`0\cdot 1 + 2\cdot(-2) = -4`}</M> statt <M p=".">2</M></p>}
          en={<p>The left finger runs along a <em>row</em> of <M p=",">A</M> the right one down a <em>column</em> of <M p=".">B</M> Computing row times row gives, for <M p=",">{t`\begin{pmatrix}0&2\\1&0\end{pmatrix}\begin{pmatrix}1&-2\\1&0\end{pmatrix}`}</M> top left <M>{t`0\cdot 1 + 2\cdot(-2) = -4`}</M> instead of <M p=".">2</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li><M>{t`C = AB`}</M> heisst: zuerst <M p=",">B</M> dann <M>A</M> («rückwärts»). <M p=".">{t`(AB)x = A(Bx)`}</M></li>
            <li><M>{t`A^{m\times n}B^{n\times p} = C^{m\times p}`}</M> – die inneren Zahlen müssen gleich sein.</li>
            <li><M>{t`C_{ij}`}</M> = Zeile <M>i</M> von <M>A</M> mal Spalte <M>j</M> von <M>B</M> (paarweise multiplizieren, addieren). Spalte <M>j</M> von <M>C</M> = <M>A</M> mal Spalte <M>j</M> von <M p=".">B</M></li>
            <li>Die Reihenfolge zählt: im Allgemeinen <M p=".">{t`AB \neq BA`}</M></li>
          </ul>}
          en={<ul>
            <li><M>{t`C = AB`}</M> means: first <M p=",">B</M> then <M>A</M> (“backwards”). <M p=".">{t`(AB)x = A(Bx)`}</M></li>
            <li><M>{t`A^{m\times n}B^{n\times p} = C^{m\times p}`}</M> – the inner numbers must agree.</li>
            <li><M>{t`C_{ij}`}</M> = row <M>i</M> of <M>A</M> times column <M>j</M> of <M>B</M> (multiply pairwise, add). Column <M>j</M> of <M>C</M> = <M>A</M> times column <M>j</M> of <M p=".">B</M></li>
            <li>The order matters: in general <M p=".">{t`AB \neq BA`}</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
