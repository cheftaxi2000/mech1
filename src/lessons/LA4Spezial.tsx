import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { AntiDiagAnim, SpecDiag, SpecShear, SpecZones, SymmetryExplorer, TransposeAnim, TransposeExplorer } from '../viz/la/SpecFigures';

const t = String.raw;

export default function LA4Spezial() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Manche Matrizen haben ein Muster: viele Nullen an festen Stellen, oder eine Spiegelsymmetrie. Solche Matrizen erkennt man auf einen Blick, und mit ihnen rechnet es sich viel leichter. Dazu kommt eine neue Operation: das Transponieren, das Spiegeln einer Matrix an ihrer Diagonalen.</p>}
        en={<p className="lede">Some matrices have a pattern: many zeros in fixed places, or a mirror symmetry. You recognise such matrices at a glance, and calculating with them is much easier. On top of that comes a new operation: the transpose, mirroring a matrix across its diagonal.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Die <b>Diagonale</b> einer quadratischen Matrix ist die Linie von oben links nach unten rechts: <M p=".">{t`A_{11}, A_{22}, A_{33}, \dots`}</M> Fast alles in dieser Lektion beschreibt, was auf, über oder unter dieser Linie steht – wie die Mittellinie einer Strasse, an der man sich orientiert.</p>}
          en={<p>The <b>diagonal</b> of a square matrix is the line from top left to bottom right: <M p=".">{t`A_{11}, A_{22}, A_{33}, \dots`}</M> Almost everything in this lesson describes what sits on, above or below this line – like the centre line of a road you steer by.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="diagonal" title={<T de="1. Diagonalmatrix und Einheitsmatrix" en="1. Diagonal matrix and identity matrix" />}>
        <Box kind="uebung" src={<Src u={4} p={31} slides />} title={<T de="Diagonalmatrix" en={<><De en="diagonal matrix">Diagonalmatrix</De></>} />}>
          <MD>{t`\operatorname{diag}(1, 2, 6, 4) = \begin{pmatrix}1&0&0&0\\0&2&0&0\\0&0&6&0\\0&0&0&4\end{pmatrix}`}</MD>
          <T
            de={<p>Alle Einträge ausserhalb der Diagonalen sind null. Wir skalieren einfach jeden Basisvektor. Spezialfall: die Einheitsmatrix <M>{t`\mathbb{I}`}</M> mit lauter Einsen auf der Diagonalen. «Über diese Matrix solltest du dich immer freuen :)»</p>}
            en={<p>All off-diagonal entries are zero. We are simply scaling each basis vector. Special case: the identity matrix <M>{t`\mathbb{I}`}</M> (<De en="identity matrix">Einheitsmatrix</De>) with all ones on the diagonal. “You should always be happy when you see this :)”</p>}
          />
          <MD>{t`\mathbb{I} = \begin{pmatrix}1&0&\cdots&0\\0&1&\cdots&0\\\vdots&&\ddots&\vdots\\0&\cdots&0&1\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> <M>{t`\operatorname{diag}(1, 2, 6, 4)`}</M> ist eine Kurzschrift: Die vier Zahlen kommen der Reihe nach auf die Diagonale, überall sonst steht <M p=".">0</M></p>
            <p><b>Warum «jeden Basisvektor skalieren»?</b> Die erste Spalte einer Matrix ist das Bild von <M>{t`e_1`}</M> (Lektion <a href="#la-transformation">Transformation</a>). Bei einer Diagonalmatrix ist die erste Spalte <M p=",">{t`(d_1, 0, \dots, 0)^T`}</M> also <M p=".">{t`d_1 e_1`}</M> Der Pfeil <M>{t`e_1`}</M> wird nur länger oder kürzer, er dreht sich nicht. Dasselbe gilt für jede Spalte.</p>
            <p>Bei <M>{t`\mathbb{I}`}</M> sind alle Faktoren <M p=",">1</M> also bleibt jeder Pfeil, wie er ist: <M p=".">{t`\mathbb{I}v = v`}</M> Darum die Freude – mit <M>{t`\mathbb{I}`}</M> muss man nichts rechnen. Probier im Bild die Knöpfe aus, auch <M p=".">{t`\mathbb{I}`}</M></p>
          </>}
          en={<>
            <p><b>How to read this:</b> <M>{t`\operatorname{diag}(1, 2, 6, 4)`}</M> is shorthand: the four numbers go onto the diagonal in order, everywhere else there is <M p=".">0</M></p>
            <p><b>Why “scaling each basis vector”?</b> The first column of a matrix is the image of <M>{t`e_1`}</M> (lesson <a href="#la-transformation">transformation</a>). For a diagonal matrix the first column is <M p=",">{t`(d_1, 0, \dots, 0)^T`}</M> i.e. <M p=".">{t`d_1 e_1`}</M> The arrow <M>{t`e_1`}</M> only gets longer or shorter; it does not turn. The same holds for every column.</p>
            <p>For <M>{t`\mathbb{I}`}</M> all factors are <M p=",">1</M> so every arrow stays as it is: <M p=".">{t`\mathbb{I}v = v`}</M> Hence the joy – with <M>{t`\mathbb{I}`}</M> there is nothing to compute. Try the buttons in the figure, including <M p=".">{t`\mathbb{I}`}</M></p>
          </>}
        />
        <SpecDiag />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="dreieck" title={<T de={<>2. Dreiecksmatrizen <M>L</M> und <M>R</M></>} en={<>2. Triangular matrices <M>L</M> and <M>R</M></>} />}>
        <Box kind="uebung" src={<Src u={4} p={32} slides />} title={<T de="Dreiecksmatrix" en={<><De en="triangular matrix">Dreiecksmatrix</De></>} />}>
          <T
            de={<p>Links-Dreiecksmatrix <M p=":">L</M> Nullen über der Diagonalen. Rechts-Dreiecksmatrix <M p=":">R</M> Nullen unter der Diagonalen. «Davon wirst du jede Menge sehen, wenn wir die LR-Zerlegung machen.»</p>}
            en={<p>Lower triangular matrix <M>L</M> (<De en="lower triangular matrix">Links-Dreiecksmatrix</De>): zeros above the diagonal. Upper triangular matrix <M>R</M> (<De en="upper triangular matrix">Rechts-Dreiecksmatrix</De>): zeros below the diagonal. “You'll see plenty of this when we do <span lang="de">LR-Zerlegung</span>.”</p>}
          />
          <MD>{t`L = \begin{pmatrix}\ast&0&0\\\ast&\ast&0\\\ast&\ast&\ast\end{pmatrix},\qquad R = \begin{pmatrix}\ast&\ast&\ast\\0&\ast&\ast\\0&0&\ast\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> Das Sternchen <M>{t`\ast`}</M> heisst «hier darf irgendeine Zahl stehen». Der Name sagt, wo das Dreieck mit den Zahlen liegt: bei <M>L</M> links unten, bei <M>R</M> rechts oben. Das «R» kennst du schon: die Zeilen-Stufen-Form aus dem <a href="#la-gauss">Gauss-Verfahren</a> ist eine Rechts-Dreiecksmatrix.</p>
            <p>Alle vier Muster dieser Lektion im Vergleich (wähle die Art und die Grösse):</p>
          </>}
          en={<>
            <p><b>How to read this:</b> The star <M>{t`\ast`}</M> means “any number may stand here”. The name says where the triangle with the numbers sits: for <M>L</M> at the bottom left, for <M>R</M> at the top right. You already know “R”: the row echelon form from <a href="#la-gauss">Gaussian elimination</a> is an upper triangular matrix.</p>
            <p>All four patterns of this lesson side by side (pick the kind and the size):</p>
          </>}
        />
        <SpecZones />
        <T
          de={<p><b>Wie sieht eine Dreiecksmatrix als Verformung aus?</b> Das einfachste Beispiel ist eine <b>Scherung</b>: Ein Kartenstapel, den man oben seitlich schiebt. Die Matrix <M>{t`\begin{pmatrix}1&s\\0&1\end{pmatrix}`}</M> hat unter der Diagonalen eine <M>0</M> – sie ist eine Rechts-Dreiecksmatrix. Die erste Spalte ist <M p=",">{t`e_1`}</M> also bleibt der Boden liegen.</p>}
          en={<p><b>What does a triangular matrix look like as a deformation?</b> The simplest example is a <b>shear</b>: a deck of cards pushed sideways at the top. The matrix <M>{t`\begin{pmatrix}1&s\\0&1\end{pmatrix}`}</M> has a <M>0</M> below the diagonal – it is upper triangular. Its first column is <M p=",">{t`e_1`}</M> so the floor stays put.</p>}
        />
        <SpecShear />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="transponieren" title={<T de="3. Transponieren" en="3. The transpose" />}>
        <Box kind="uebung" src={<Src u={4} p={33} slides />} title={<T de="Transponierte Matrix" en={<><De en="transposed">Transponiert</De></>} />}>
          <T
            de={<p><M p=":">{t`(A^{m\times n})^T \to A^{n\times m}`}</M> die Spalten werden zu Zeilen. Für eine quadratische Matrix: «an der Diagonalen gespiegelt».</p>}
            en={<p><M p=":">{t`(A^{m\times n})^T \to A^{n\times m}`}</M> the columns become rows. For a square matrix: “mirrored across diagonal”.</p>}
          />
          <MD>{t`\begin{pmatrix}1&2\\3&4\\5&6\end{pmatrix}^T = \begin{pmatrix}1&3&5\\2&4&6\end{pmatrix},\qquad \begin{pmatrix}1&2&3\\4&5&6\\7&8&9\end{pmatrix}^T = \begin{pmatrix}1&4&7\\2&5&8\\3&6&9\end{pmatrix}`}</MD>
          <T
            de={<p>Aus der Zusammenfassung (gedruckt auf der Folie): «Die Transponierte einer Matrix erhält man, indem man sie an ihrer Diagonalen „spiegelt“.» Rechenregeln:</p>}
            en={<p>From the summary printed on the slide: “The transpose of a matrix is obtained by ‘mirroring’ it across its diagonal.” Rules (<De en="rules of calculation">Rechenregeln</De>):</p>}
          />
          <MD>{t`\begin{aligned}(A+B)^T &= A^T + B^T & (A^T)^{-1} &= (A^{-1})^T\\ (A\cdot B)^T &= B^T\cdot A^T & \operatorname{rang}(A^T) &= \operatorname{rang}(A)\\ (c\cdot A)^T &= c\cdot A^T & \det(A^T) &= \det(A)\\ (A^T)^T &= A & \operatorname{eig}(A^T) &= \operatorname{eig}(A)\end{aligned}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> Das hochgestellte <M>T</M> heisst «transponiert». <M>{t`A^{m\times n}`}</M> wird zu einer <M>{t`n\times m`}</M>-Matrix: Die Zahl der Zeilen und die Zahl der Spalten tauschen. Ein Eintrag wandert von Zeile <M p=",">i</M> Spalte <M>j</M> nach Zeile <M p=",">j</M> Spalte <M p=".">i</M> Kurz: <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M></p>
            <p>Bei einer quadratischen Matrix sieht das aus wie ein Spiegel, der auf der Diagonalen steht. Schau zu, wie die Zahlen ihre Plätze tauschen:</p>
          </>}
          en={<>
            <p><b>How to read this:</b> The superscript <M>T</M> means “transposed”. <M>{t`A^{m\times n}`}</M> becomes an <M>{t`n\times m`}</M> matrix: the number of rows and the number of columns swap. An entry moves from row <M p=",">i</M> column <M>j</M> to row <M p=",">j</M> column <M p=".">i</M> In short: <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M></p>
            <p>For a square matrix this looks like a mirror standing on the diagonal. Watch the numbers swap places:</p>
          </>}
        />
        <TransposeAnim />
        <T
          de={<p>Bei einer nicht quadratischen Matrix gibt es keinen Spiegel in der Mitte, aber die Regel bleibt: Zeile <M>i</M> wird Spalte <M p=".">i</M> Wähle Grösse und Zahlen selbst; die Knöpfe laden die Beispiele der Folien 33 und 34.</p>}
          en={<p>A matrix that is not square has no mirror in the middle, but the rule stays: row <M>i</M> becomes column <M p=".">i</M> Choose size and numbers yourself; the buttons load the examples of slides 33 and 34.</p>}
        />
        <TransposeExplorer />
        <T
          de={<>
            <p><b>Die Rechenregeln in Worten.</b></p>
            <ul>
              <li><M>{t`(A+B)^T = A^T + B^T`}</M> und <M p=":">{t`(cA)^T = cA^T`}</M> Es ist egal, ob man zuerst addiert (oder mit <M>c</M> streckt) und dann spiegelt, oder umgekehrt – beides geht Feld für Feld.</li>
              <li><M p=":">{t`(A^T)^T = A`}</M> Zweimal spiegeln bringt alles zurück.</li>
              <li><M p=":">{t`(AB)^T = B^T A^T`}</M> Beim Produkt dreht sich die Reihenfolge um. Das prüfen wir mit Zahlen in der Lektion <a href="#la-produkt">Das Matrixprodukt</a>.</li>
              <li>Inverse <M p=",">{t`A^{-1}`}</M> Rang, Determinante <M>{t`\det`}</M> und Eigenwerte <M>{t`\operatorname{eig}`}</M> kommen erst später im Kurs. Hier nur: Transponieren ändert sie nicht.</li>
            </ul>
          </>}
          en={<>
            <p><b>The rules in words.</b></p>
            <ul>
              <li><M>{t`(A+B)^T = A^T + B^T`}</M> and <M p=":">{t`(cA)^T = cA^T`}</M> it does not matter whether you first add (or stretch by <M p=")">c</M> and then mirror, or the other way round – both go cell by cell.</li>
              <li><M p=":">{t`(A^T)^T = A`}</M> mirroring twice brings everything back.</li>
              <li><M p=":">{t`(AB)^T = B^T A^T`}</M> for a product the order turns around. We check this with numbers in the lesson <a href="#la-produkt">The matrix product</a>.</li>
              <li>Inverse <M p=",">{t`A^{-1}`}</M> rank, determinant <M>{t`\det`}</M> and eigenvalues <M>{t`\operatorname{eig}`}</M> come later in the course. For now only: transposing does not change them.</li>
            </ul>
          </>}
        />
        <Box kind="uebung" src={<Src u={4} p={34} slides />} title={<T de="Du bist dran: drei Transponierte" en="Your turn: three transposes" />}>
          <T
            de={<p>Die Folie stellt drei Matrizen zum Transponieren; die erste ist mit «<M>{t`3\times 2`}</M>» beschriftet. Die Antworten sind in den Folien nicht ausgefüllt – wir rechnen sie unten aus.</p>}
            en={<p>The slide gives three matrices to transpose; the first is labelled “<M>{t`3\times 2`}</M>”. The answers are not filled in on the slides – we work them out below.</p>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Lösungen zu Folie 34" en="Solutions for slide 34" />}>
          <MD>{t`\begin{pmatrix}-2&0\\5&0\\6&2\end{pmatrix}^T = \begin{pmatrix}-2&5&6\\0&0&2\end{pmatrix}`}</MD>
          <T
            de={<p>Aus <M>{t`3\times 2`}</M> wird <M p=".">{t`2\times 3`}</M> Die erste Spalte <M>{t`(-2, 5, 6)`}</M> wird die erste Zeile.</p>}
            en={<p><M>{t`3\times 2`}</M> becomes <M p=".">{t`2\times 3`}</M> The first column <M>{t`(-2, 5, 6)`}</M> becomes the first row.</p>}
          />
          <MD>{t`\begin{pmatrix}1\\2\\3\\4\\5\end{pmatrix}^T = \begin{pmatrix}1&2&3&4&5\end{pmatrix}`}</MD>
          <T
            de={<p>Ein Spaltenvektor (<M p=")">{t`5\times 1`}</M> wird ein Zeilenvektor (<M p=").">{t`1\times 5`}</M> Darum schreibt man Spaltenvektoren im Text oft platzsparend als <M p=".">{t`(1, 2, 3, 4, 5)^T`}</M></p>}
            en={<p>A column vector (<M p=")">{t`5\times 1`}</M> becomes a row vector (<M p=").">{t`1\times 5`}</M> This is why column vectors are often written as <M>{t`(1, 2, 3, 4, 5)^T`}</M> in running text, to save space.</p>}
          />
          <MD>{t`\begin{pmatrix}1&1&1\\0&0&0\\2&2&2\end{pmatrix}^T = \begin{pmatrix}1&0&2\\1&0&2\\1&0&2\end{pmatrix}`}</MD>
          <T
            de={<p>Gleiche Zeilen werden gleiche Spalten. Die Diagonale <M>{t`1, 0, 2`}</M> bleibt stehen.</p>}
            en={<p>Equal rows become equal columns. The diagonal <M>{t`1, 0, 2`}</M> stays in place.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="symmetrisch" title={<T de="4. Symmetrische Matrizen" en="4. Symmetric matrices" />}>
        <Box kind="uebung" src={<Src u={4} p={35} slides />} title={<T de="Symmetrische Matrix" en={<><De en="symmetric matrix">Symmetrische Matrix</De></>} />}>
          <MD>{t`A^T = A,\qquad A = \begin{pmatrix}1&2&-2&0\\2&2&0&1\\-2&0&-3&0\\0&1&0&1\end{pmatrix} = A^T`}</MD>
          <T
            de={<p>«Beachte: Das muss eine quadratische Matrix sein.» «Bringt viele nützliche Eigenschaften mit» – aus der gedruckten Zusammenfassung (Auszug): <M>{t`A^TA`}</M> und <M>{t`AA^T`}</M> sind immer symmetrisch; die Eigenwerte sind reell. Wichtige Zusammenhänge: <M>A</M> symmetrisch <M>{t`\Leftrightarrow A^{-1}`}</M> symmetrisch; <M>{t`A, B`}</M> symmetrisch <M>{t`\Leftrightarrow A+B`}</M> symmetrisch; <M>A</M> symmetrisch <M>{t`\Leftrightarrow A^2`}</M> symmetrisch; <b><M>{t`A, B`}</M> symmetrisch, aber <M>AB</M> nicht unbedingt symmetrisch</b> (auf der Folie markiert).</p>}
            en={<p>“Note that this has to be a square matrix.” “Comes with lots of useful properties” – from the printed summary (excerpt): <M>{t`A^TA`}</M> and <M>{t`AA^T`}</M> are always symmetric; the eigenvalues are real. Important connections: <M>A</M> symmetric <M>{t`\Leftrightarrow A^{-1}`}</M> symmetric; <M>{t`A, B`}</M> symmetric <M>{t`\Leftrightarrow A+B`}</M> symmetric; <M>A</M> symmetric <M>{t`\Leftrightarrow A^2`}</M> symmetric; <b><M>{t`A, B`}</M> symmetric, but <M>AB</M> not necessarily symmetric</b> (highlighted on the slide).</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> <M>{t`A^T = A`}</M> heisst: Spiegeln an der Diagonalen ändert nichts. Jeder Eintrag ist gleich seinem Spiegelpartner, <M p=".">{t`A_{ij} = A_{ji}`}</M> Im Beispiel: <M>{t`A_{13} = -2`}</M> und <M p=".">{t`A_{31} = -2`}</M></p>
            <p><b>Warum quadratisch?</b> <M>{t`A^T`}</M> hat die Form <M>{t`n\times m`}</M> statt <M p=".">{t`m\times n`}</M> Gleich sein können die beiden nur, wenn sie dieselbe Form haben, also wenn <M p=".">{t`m = n`}</M></p>
            <p>Tippe im Bild auf ein Feld: rot ist das Feld, blau sein Spiegelpartner. Die zwei Prüfungen unten zeigen sofort, welches Paar die Symmetrie bricht.</p>
          </>}
          en={<>
            <p><b>How to read this:</b> <M>{t`A^T = A`}</M> means: mirroring across the diagonal changes nothing. Every entry equals its mirror partner, <M p=".">{t`A_{ij} = A_{ji}`}</M> In the example: <M>{t`A_{13} = -2`}</M> and <M p=".">{t`A_{31} = -2`}</M></p>
            <p><b>Why square?</b> <M>{t`A^T`}</M> has the shape <M>{t`n\times m`}</M> instead of <M p=".">{t`m\times n`}</M> The two can only be equal if they have the same shape, i.e. if <M p=".">{t`m = n`}</M></p>
            <p>Tap a cell in the figure: red is the cell, blue its mirror partner. The two checks below show at once which pair breaks the symmetry.</p>
          </>}
        />
        <SymmetryExplorer />
        <T
          de={<p><b>Vorsicht bei den Doppelpfeilen</b> im Auszug: Bei <M>{t`A+B`}</M> und <M>{t`A^2`}</M> gilt nur die Richtung «<M>A</M> (und <M p=")">B</M> symmetrisch <M>{t`\Rightarrow`}</M> Ergebnis symmetrisch». Rückwärts stimmt es nicht: <M>{t`\begin{pmatrix}0&1\\0&0\end{pmatrix} + \begin{pmatrix}0&0\\1&0\end{pmatrix}`}</M> ist symmetrisch, obwohl keiner der beiden Summanden es ist, und <M>{t`\begin{pmatrix}0&1\\0&0\end{pmatrix}^2`}</M> ist die Nullmatrix.</p>}
          en={<p><b>Careful with the double arrows</b> in the excerpt: for <M>{t`A+B`}</M> and <M>{t`A^2`}</M> only the direction “<M>A</M> (and <M p=")">B</M> symmetric <M>{t`\Rightarrow`}</M> result symmetric” holds. Backwards it fails: <M>{t`\begin{pmatrix}0&1\\0&0\end{pmatrix} + \begin{pmatrix}0&0\\1&0\end{pmatrix}`}</M> is symmetric although neither summand is, and <M>{t`\begin{pmatrix}0&1\\0&0\end{pmatrix}^2`}</M> is the zero matrix.</p>}
        />
        <Box kind="supplement" title={<T de={<>Beispiel: <M>{t`A, B`}</M> symmetrisch, <M>AB</M> nicht</>} en={<>Example: <M>{t`A, B`}</M> symmetric, <M>AB</M> not</>} />}>
          <MD>{t`\begin{pmatrix}1&2\\2&3\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix} = \begin{pmatrix}2&1\\3&2\end{pmatrix}`}</MD>
          <T
            de={<p>Beide Faktoren sind symmetrisch, das Ergebnis nicht: oben rechts <M p=",">1</M> unten links <M p=".">3</M> Der Grund steckt in der Regel <M p=":">{t`(AB)^T = B^TA^T = BA`}</M> Das ist nur dann wieder <M p=",">AB</M> wenn <M>A</M> und <M>B</M> vertauschen – und das tun sie meistens nicht (Lektion <a href="#la-produkt">Das Matrixprodukt</a>). Wie man <M>AB</M> ausrechnet, steht dort.</p>}
            en={<p>Both factors are symmetric, the result is not: top right <M p=",">1</M> bottom left <M p=".">3</M> The reason lies in the rule <M p=":">{t`(AB)^T = B^TA^T = BA`}</M> this is <M>AB</M> again only if <M>A</M> and <M>B</M> commute – and mostly they do not (lesson <a href="#la-produkt">The matrix product</a>). How to compute <M>AB</M> is explained there.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="antisymmetrisch" title={<T de="5. Antisymmetrische Matrizen" en="5. Antisymmetric matrices" />}>
        <Box kind="uebung" src={<Src u={4} p={36} slides />} title={<T de="Anti-/schiefsymmetrische Matrix" en={<><De en="anti-/skew-symmetric matrix">Anti-/schiefsymmetrische Matrix</De></>} />}>
          <MD>{t`A = -A^T,\qquad \begin{pmatrix}0&1&2&3\\-1&0&0&-1\\-2&0&0&-2\\-3&1&2&0\end{pmatrix}`}</MD>
          <T
            de={<p>«Die Diagonaleinträge müssen null sein.» Aus der gedruckten Zusammenfassung «Schiefsymmetrische Matrix»: <M p=";">{t`-S = S^T`}</M> alle Diagonaleinträge sind notwendigerweise <M p=";">0</M> <M p=";">{t`\det(S) = \det(S^T) = \det(-S) = (-1)^n\det(S)`}</M> die Eigenwerte sind imaginär oder <M p=";">0</M> <M>S</M> kann immer als <M>{t`A - A^T`}</M> geschrieben werden.</p>}
            en={<p>“Diagonal entries must be zero.” From the printed summary “<span lang="de">Schiefsymmetrische Matrix</span>”: <M p=";">{t`-S = S^T`}</M> all diagonal entries are necessarily <M p=";">0</M> <M p=";">{t`\det(S) = \det(S^T) = \det(-S) = (-1)^n\det(S)`}</M> the eigenvalues are imaginary or <M p=";">0</M> <M>S</M> can always be written as <M p=".">{t`A - A^T`}</M></p>}
          />
        </Box>
        <T
          de={<p><b>So liest man das:</b> <M>{t`A = -A^T`}</M> heisst: Jeder Eintrag ist das <em>Negative</em> seines Spiegelpartners, <M p=".">{t`A_{ij} = -A_{ji}`}</M> Im Beispiel: <M>{t`A_{12} = 1`}</M> und <M p=".">{t`A_{21} = -1`}</M> Warum muss dann die Diagonale null sein? Schritt für Schritt:</p>}
          en={<p><b>How to read this:</b> <M>{t`A = -A^T`}</M> means: every entry is the <em>negative</em> of its mirror partner, <M p=".">{t`A_{ij} = -A_{ji}`}</M> In the example: <M>{t`A_{12} = 1`}</M> and <M p=".">{t`A_{21} = -1`}</M> Why must the diagonal then be zero? Step by step:</p>}
        />
        <AntiDiagAnim />
        <T
          de={<>
            <p>Im Bild des Abschnitts 4 kannst du das ausprobieren: Lade «Folie 36» und ändere eine Null auf der Diagonalen – die Prüfung «antisymmetrisch» zeigt sofort, welches Feld stört.</p>
            <p><b>Die Determinanten-Zeile</b> nimmt die Regeln vorweg, die später im Kurs kommen. Man liest sie von links nach rechts: <M>{t`\det(S) = \det(S^T)`}</M> (Transponieren ändert die Determinante nicht), <M>{t`S^T = -S`}</M> (Antisymmetrie), und ein Minus vor einer <M>{t`n\times n`}</M>-Matrix gibt den Faktor <M p=".">{t`(-1)^n`}</M> Ist <M>n</M> ungerade, steht da <M p=",">{t`\det(S) = -\det(S)`}</M> also <M p=".">{t`\det(S) = 0`}</M></p>
            <p>Der Auszug beginnt mit «Symmetrische Matrizen sind immer invertierbar ausser wenn <M>{t`\det(S) = 0`}</M>» – im Kasten über <em>schief</em>symmetrische Matrizen, und das gilt für jede quadratische Matrix; wichtig ist nur: eine antisymmetrische Matrix ungerader Grösse ist nie invertierbar.</p>
          </>}
          en={<>
            <p>You can try this in the figure of section 4: load “slide 36” and change a zero on the diagonal – the check “antisymmetric” shows at once which cell is in the way.</p>
            <p><b>The determinant line</b> anticipates rules that come later in the course. Read it from left to right: <M>{t`\det(S) = \det(S^T)`}</M> (transposing does not change the determinant), <M>{t`S^T = -S`}</M> (antisymmetry), and a minus in front of an <M>{t`n\times n`}</M> matrix gives the factor <M p=".">{t`(-1)^n`}</M> If <M>n</M> is odd, this says <M p=",">{t`\det(S) = -\det(S)`}</M> so <M p=".">{t`\det(S) = 0`}</M></p>
            <p>The excerpt starts with “symmetric matrices are always invertible unless <M>{t`\det(S) = 0`}</M>” – in the box on <em>skew</em>-symmetric matrices, and it holds for every square matrix; what matters is only: an antisymmetric matrix of odd size is never invertible.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Transponieren dreht die Matrix um 90°»" en="“Transposing rotates the matrix by 90°”" />}>
        <T
          de={<p>Nein, es spiegelt. Dreht man <M>{t`\begin{pmatrix}1&2\\3&4\end{pmatrix}`}</M> um eine Vierteldrehung im Uhrzeigersinn, erhält man <M p=".">{t`\begin{pmatrix}3&1\\4&2\end{pmatrix}`}</M> Die Transponierte ist aber <M p=".">{t`\begin{pmatrix}1&3\\2&4\end{pmatrix}`}</M> Erkennungszeichen: Beim Transponieren bleibt die Diagonale (<M>1</M> und <M p=")">4</M> stehen.</p>}
          en={<p>No, it mirrors. Rotating <M>{t`\begin{pmatrix}1&2\\3&4\end{pmatrix}`}</M> a quarter turn clockwise gives <M p=".">{t`\begin{pmatrix}3&1\\4&2\end{pmatrix}`}</M> The transpose, however, is <M p=".">{t`\begin{pmatrix}1&3\\2&4\end{pmatrix}`}</M> Tell-tale sign: when transposing, the diagonal (<M>1</M> and <M p=")">4</M> stays in place.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Jede Matrix mit Nullen auf der Diagonalen ist antisymmetrisch»" en="“Every matrix with zeros on the diagonal is antisymmetric”" />}>
        <T
          de={<p>Die Nullen sind nötig, aber nicht genug. Auch jedes Paar ausserhalb muss entgegengesetzte Vorzeichen haben. <M>{t`\begin{pmatrix}0&1\\1&0\end{pmatrix}`}</M> hat eine Nulldiagonale, ist aber symmetrisch, nicht antisymmetrisch: <M p=".">{t`A_{12} = 1 \neq -1 = -A_{21}`}</M></p>}
          en={<p>The zeros are necessary but not enough. Every pair off the diagonal must also have opposite signs. <M>{t`\begin{pmatrix}0&1\\1&0\end{pmatrix}`}</M> has a zero diagonal but is symmetric, not antisymmetric: <M p=".">{t`A_{12} = 1 \neq -1 = -A_{21}`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Das Produkt symmetrischer Matrizen ist symmetrisch»" en="“The product of symmetric matrices is symmetric”" />}>
        <T
          de={<p>Summe ja, Produkt nein – genau diese Zeile ist auf der Folie markiert. Gegenbeispiel oben: <M p=".">{t`\begin{pmatrix}1&2\\2&3\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix} = \begin{pmatrix}2&1\\3&2\end{pmatrix}`}</M> Symmetrisch sind dagegen immer <M>{t`A^TA`}</M> und <M p=".">{t`AA^T`}</M></p>}
          en={<p>Sum yes, product no – exactly this line is highlighted on the slide. Counterexample above: <M p=".">{t`\begin{pmatrix}1&2\\2&3\end{pmatrix}\begin{pmatrix}0&1\\1&0\end{pmatrix} = \begin{pmatrix}2&1\\3&2\end{pmatrix}`}</M> What is always symmetric: <M>{t`A^TA`}</M> and <M p=".">{t`AA^T`}</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Diagonalmatrix: nur auf der Diagonalen Zahlen; sie streckt jeden Basisvektor für sich. <M>{t`\mathbb{I}`}</M> streckt mit <M>1</M> und ändert nichts: <M p=".">{t`\mathbb{I}v = v`}</M></li>
            <li><M>L</M> hat Nullen über, <M>R</M> Nullen unter der Diagonalen. Eine Scherung ist eine Dreiecksmatrix.</li>
            <li><M p=":">{t`A^T`}</M> Zeilen werden Spalten, <M p=",">{t`m\times n \to n\times m`}</M> <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M> Quadratisch: Spiegeln an der Diagonalen. <M p=".">{t`(AB)^T = B^TA^T`}</M></li>
            <li>Symmetrisch <M p=":">{t`A^T = A`}</M> Partner gleich. Antisymmetrisch <M p=":">{t`A = -A^T`}</M> Partner entgegengesetzt, Diagonale <M p=".">0</M> Beides nur für quadratische Matrizen.</li>
          </ul>}
          en={<ul>
            <li>Diagonal matrix: numbers only on the diagonal; it stretches each basis vector on its own. <M>{t`\mathbb{I}`}</M> stretches by <M>1</M> and changes nothing: <M p=".">{t`\mathbb{I}v = v`}</M></li>
            <li><M>L</M> has zeros above, <M>R</M> zeros below the diagonal. A shear is a triangular matrix.</li>
            <li><M p=":">{t`A^T`}</M> rows become columns, <M p=";">{t`m\times n \to n\times m`}</M> <M p=".">{t`(A^T)_{ji} = A_{ij}`}</M> Square: mirroring across the diagonal. <M p=".">{t`(AB)^T = B^TA^T`}</M></li>
            <li>Symmetric <M p=":">{t`A^T = A`}</M> partners equal. Antisymmetric <M p=":">{t`A = -A^T`}</M> partners opposite, diagonal <M p=".">0</M> Both only for square matrices.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
