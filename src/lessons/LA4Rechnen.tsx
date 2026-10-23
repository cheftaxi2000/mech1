import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { AddExplorer, FactorOut, IndexExplorer, ScalarStretch, SumOfTransforms } from '../viz/la/CalcFigures';

const t = String.raw;

export default function LA4Rechnen() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Matrix ist eine Zahlentabelle – und zugleich eine Maschine, die den Raum verformt (<a href="#la-transformation">Die Matrix als Transformation des Raums</a>). Hier lernst du drei einfache Dinge: wie man über einen einzelnen Eintrag spricht, wie man zwei Matrizen addiert und was eine Zahl vor der Matrix bewirkt.</p>}
        en={<p className="lede">A matrix is a table of numbers – and at the same time a machine that deforms space (<a href="#la-transformation">The matrix as a transformation of space</a>). Here you learn three simple things: how to talk about a single entry, how to add two matrices, and what a number in front of a matrix does.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Denk an den Sitzplan im Kino: «Reihe 3, Platz 4». Die Reihe sagt man zuerst, den Platz danach. Genau so spricht man über Einträge einer Matrix. Und wenn zwei Kinos gleich gebaut sind, kann man ihre Besucherzahlen Platz für Platz zusammenzählen. Sind sie verschieden gebaut, passt nichts zusammen.</p>}
        en={<p>Think of a cinema seating plan: “row 3, seat 4”. You say the row first, the seat second. This is exactly how one talks about the entries of a matrix. And if two cinemas are built the same way, you can add up their visitor numbers seat by seat. If they are built differently, nothing fits together.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="notation" title={<T de="1. Notation: Zeilen zuerst, Spalten später" en="1. Notation: rows first, columns later" />}>
        <Box kind="uebung" src={<Src u={4} p={22} slides />} title={<T de="Notation" en={<><De en="notation">Notation</De></>} />}>
          <T
            de={<p>Eine Matrix <M>{t`A^{m\times n}`}</M> hat <M>m</M> Zeilen und <M>n</M> Spalten. «Rows before columns» – «Zeilen zuerst, Spalten später». Ein einzelner Eintrag heisst <M p=",">{t`A_{ij}`}</M> mit <M>i</M> für die Zeile und <M>j</M> für die Spalte. Beispiel: <M p=".">{t`A_{(3)(4)}`}</M></p>}
            en={<p>A matrix <M>{t`A^{m\times n}`}</M> has <M>m</M> rows and <M>n</M> columns. “Rows before columns” – <De en="rows first, columns later">Zeilen zuerst, Spalten später</De>. A single entry is called <M p=",">{t`A_{ij}`}</M> with <M>i</M> for the row and <M>j</M> for the column. Example: <M p=".">{t`A_{(3)(4)}`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>m</M> ist die Anzahl der <em>Zeilen</em> (waagrecht), <M>n</M> die Anzahl der <em>Spalten</em> (senkrecht).</li>
              <li><M>{t`A^{m\times n}`}</M> ist keine Potenz. Die kleine Zahl oben rechts nennt nur die Form der Tabelle, so wie «<M>{t`5\times 4`}</M>» die Grösse eines Zimmers nennt.</li>
              <li><M>{t`A_{ij}`}</M> ist das Feld in Zeile <M>i</M> und Spalte <M p=".">j</M> Bei <M>{t`A_{(3)(4)}`}</M> stehen die Klammern nur, damit man «3» und «4» nicht zu «34» zusammenliest.</li>
            </ol>
            <p>Stell <M>m</M> und <M>n</M> ein und tippe auf Einträge. Die Zeile wird blau, die Spalte rot, der Eintrag orange.</p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>m</M> is the number of <em>rows</em> (horizontal), <M>n</M> the number of <em>columns</em> (vertical).</li>
              <li><M>{t`A^{m\times n}`}</M> is not a power. The small number at the top right only names the shape of the table, just as “<M>{t`5\times 4`}</M>” names the size of a room.</li>
              <li><M>{t`A_{ij}`}</M> is the cell in row <M>i</M> and column <M p=".">j</M> In <M>{t`A_{(3)(4)}`}</M> the brackets are only there so that you do not read “3” and “4” as “34”.</li>
            </ol>
            <p>Set <M>m</M> and <M>n</M> and tap entries. The row turns blue, the column red, the entry orange.</p>
          </>}
        />
        <IndexExplorer />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="summe" title={<T de="2. Die Summe: Eintrag für Eintrag" en="2. The sum: entry by entry" />}>
        <Box kind="uebung" src={<Src u={4} p="23–24" slides />} title={<T de="Matrix-Addition" en={<><De en="matrix addition">Matrix-Addition</De></>} />}>
          <T
            de={<p>Einfache Addition (oder Subtraktion) Eintrag für Eintrag («index-by-index»). Achte nur darauf, dass die Matrizen die gleiche Form haben: <M p=".">{t`A^{m\times n} + B^{m\times n} = C^{m\times n}`}</M></p>}
            en={<p>Simple index-by-index addition (or subtraction). Just make sure the matrices have the same shape: <M p=".">{t`A^{m\times n} + B^{m\times n} = C^{m\times n}`}</M></p>}
          />
          <MD>{t`\begin{pmatrix}1&2&3\\4&5&6\end{pmatrix} + \begin{pmatrix}2&2&3\\4&1&2\end{pmatrix} = \begin{pmatrix}1+2&2+2&3+3\\4+4&5+1&6+2\end{pmatrix} = \begin{pmatrix}3&4&6\\8&6&8\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> Zwei Matrizen werden addiert, indem man Felder mit gleicher Adresse zusammenzählt. Das Feld oben links von <M>C</M> ist das Feld oben links von <M>A</M> plus das Feld oben links von <M p=".">B</M> In Formeln: <M p=".">{t`C_{ij} = A_{ij} + B_{ij}`}</M></p>
            <p>Dafür braucht jedes Feld einen Partner. Darum müssen beide Matrizen gleich viele Zeilen und gleich viele Spalten haben. Probiere es aus: Ändere die Form von <M>B</M> und sieh, was mit der Summe passiert.</p>
          </>}
          en={<>
            <p><b>How to read this:</b> Two matrices are added by adding the cells with the same address. The top-left cell of <M>C</M> is the top-left cell of <M>A</M> plus the top-left cell of <M p=".">B</M> In a formula: <M p=".">{t`C_{ij} = A_{ij} + B_{ij}`}</M></p>
            <p>For that, every cell needs a partner. So both matrices must have the same number of rows and the same number of columns. Try it: change the shape of <M>B</M> and see what happens to the sum.</p>
          </>}
        />
        <AddExplorer />
        <T
          de={<p><b>Und geometrisch?</b> Eine Matrix verformt den Raum. Die Summe <M>{t`A+B`}</M> ist eine neue Matrix, also auch eine Verformung. Die Folie zeigt, welche.</p>}
          en={<p><b>And geometrically?</b> A matrix deforms space. The sum <M>{t`A+B`}</M> is a new matrix, so it is a deformation too. The slide shows which one.</p>}
        />
        <Box kind="uebung" src={<Src u={4} p={24} slides />} title={<T de="Matrix-Addition, geometrisch" en={<><De en="matrix addition, geometrically">Matrix-Addition, geometrisch</De></>} />}>
          <T
            de={<p>Mit <M>{t`A = \begin{pmatrix}1&1\\0&2\end{pmatrix}`}</M> und <M>{t`B = \begin{pmatrix}2&0\\-1&0\end{pmatrix}`}</M> ist <M p=".">{t`A+B = \begin{pmatrix}3&1\\-1&2\end{pmatrix}`}</M> Angewendet auf <M p=":">{t`v = \begin{pmatrix}1\\1\end{pmatrix}`}</M></p>}
            en={<p>With <M>{t`A = \begin{pmatrix}1&1\\0&2\end{pmatrix}`}</M> and <M>{t`B = \begin{pmatrix}2&0\\-1&0\end{pmatrix}`}</M> we get <M p=".">{t`A+B = \begin{pmatrix}3&1\\-1&2\end{pmatrix}`}</M> Applied to <M p=":">{t`v = \begin{pmatrix}1\\1\end{pmatrix}`}</M></p>}
          />
          <MD>{t`Av = \begin{pmatrix}2\\2\end{pmatrix},\qquad Bv = \begin{pmatrix}2\\-1\end{pmatrix},\qquad (A+B)v = \begin{pmatrix}4\\1\end{pmatrix}`}</MD>
          <MD>{t`(A+B)\,v = A\,v + B\,v`}</MD>
          <T
            de={<p>«Die Transformation einer Summe zweier Matrizen ist dasselbe, wie beide Transformationen getrennt anzuwenden und die Ergebnisse zu addieren.»</p>}
            en={<p>“The transformation of a sum of two matrices is the same as applying both transformations separately and adding the result.”</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b></p>
            <ol>
              <li><M>Av</M> ist der Pfeil, auf den <M>v</M> unter <M>A</M> fällt (blau). <M>Bv</M> ist der Pfeil unter <M>B</M> (orange).</li>
              <li>Hänge <M>Bv</M> an die Spitze von <M p=".">Av</M> Das Ende ist <M>{t`Av + Bv`}</M> (grün).</li>
              <li>Die Matrix <M>{t`A+B`}</M> schickt <M>v</M> genau an dieses Ende. Der grüne Pfeil gehört also zu <M p=".">{t`(A+B)v`}</M></li>
            </ol>
            <p>Zieh <M>v</M> herum: Der grüne Pfeil bleibt immer die Diagonale. Ändere auch <M>A</M> und <M p=".">B</M></p>
          </>}
          en={<>
            <p><b>How to read this:</b></p>
            <ol>
              <li><M>Av</M> is the arrow onto which <M>v</M> falls under <M>A</M> (blue). <M>Bv</M> is the arrow under <M>B</M> (orange).</li>
              <li>Attach <M>Bv</M> to the tip of <M p=".">Av</M> The end is <M>{t`Av + Bv`}</M> (green).</li>
              <li>The matrix <M>{t`A+B`}</M> sends <M>v</M> to exactly this end. So the green arrow belongs to <M p=".">{t`(A+B)v`}</M></li>
            </ol>
            <p>Drag <M>v</M> around: the green arrow always stays the diagonal. Change <M>A</M> and <M>B</M> as well.</p>
          </>}
        />
        <SumOfTransforms />
        <T
          de={<div className="la-boxed"><p><b>In Worten:</b> Erst <M>A</M> auf <M>v</M> anwenden, dann <M>B</M> auf <M>v</M> anwenden, dann die beiden Pfeile addieren – das gibt dasselbe wie <M>{t`A+B`}</M> auf <M>v</M> anzuwenden: <M p=".">{t`(A+B)v = Av + Bv`}</M></p></div>}
          en={<div className="la-boxed"><p><b>In words:</b> Apply <M>A</M> to <M p=",">v</M> apply <M>B</M> to <M p=",">v</M> then add the two arrows – this gives the same as applying <M>{t`A+B`}</M> to <M p=":">v</M> <M p=".">{t`(A+B)v = Av + Bv`}</M></p></div>}
        />
        <details className="more">
          <T
            de={<><summary>Warum stimmt das immer? (Rechnung für ein Feld)</summary>
              <p>Die erste Zeile von <M>{t`(A+B)v`}</M> ist <M p=".">{t`(A_{11}+B_{11})v_1 + (A_{12}+B_{12})v_2`}</M> Man darf ausmultiplizieren und sortieren: <M p=".">{t`(A_{11}v_1 + A_{12}v_2) + (B_{11}v_1 + B_{12}v_2)`}</M> Das ist die erste Zeile von <M>Av</M> plus die erste Zeile von <M p=".">Bv</M> Mit der zweiten Zeile geht es genauso. Das ist die Erklärung der Folie; im Skript wird es später allgemein bewiesen.</p></>}
            en={<><summary>Why is this always true? (calculation for one entry)</summary>
              <p>The first row of <M>{t`(A+B)v`}</M> is <M p=".">{t`(A_{11}+B_{11})v_1 + (A_{12}+B_{12})v_2`}</M> You may multiply out and sort: <M p=".">{t`(A_{11}v_1 + A_{12}v_2) + (B_{11}v_1 + B_{12}v_2)`}</M> That is the first row of <M>Av</M> plus the first row of <M p=".">Bv</M> The second row works the same way. This explains the slide; the course proves it in general later.</p></>}
          />
        </details>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="skalar" title={<T de="3. Der Skalar: alles strecken" en="3. The scalar: stretch everything" />}>
        <Box kind="uebung" src={<Src u={4} p={25} slides />} title={<T de={<>Skalar</>} en={<><De en="scalar">Skalar</De></>} />}>
          <T
            de={<p>Eine Zahl <M>{t`\lambda`}</M> vor der Matrix wird mit jedem Eintrag multipliziert. «Geometrisch streckt es den Raum einfach um den Faktor des Skalars.»</p>}
            en={<p>A number <M>{t`\lambda`}</M> in front of the matrix is multiplied with every entry. “Geometrically it just stretches space by the factor of the scalar.”</p>}
          />
          <MD>{t`\lambda\begin{pmatrix}a&b\\c&d\end{pmatrix} = \begin{pmatrix}\lambda a&\lambda b\\\lambda c&\lambda d\end{pmatrix}`}</MD>
          <MD>{t`\begin{pmatrix}5&10&5\\15&5&0\end{pmatrix} = 5\begin{pmatrix}1&2&1\\3&1&0\end{pmatrix}`}</MD>
        </Box>
        <T
          de={<>
            <p><b>So liest man das:</b> «Skalar» ist ein Wort für eine gewöhnliche Zahl (im Gegensatz zu einem Pfeil oder einer Tabelle). <M>{t`\lambda`}</M> (lies «Lambda») ist nur der Name dieser Zahl.</p>
            <ol>
              <li>Links steht <M p=":">{t`\lambda A`}</M> Jedes der vier Felder wird mit <M>{t`\lambda`}</M> multipliziert, nicht nur eines.</li>
              <li>Unten läuft die Rechnung rückwärts: <M>5</M> steckt in jedem Eintrag, also darf man sie nach vorne ziehen («ausklammern»).</li>
              <li>Geometrisch: Jeder Pfeil <M>Av</M> wird <M>{t`\lambda`}</M>-mal so lang. Das ganze Gitter wird mit gestreckt.</li>
            </ol>
          </>}
          en={<>
            <p><b>How to read this:</b> “Scalar” is a word for an ordinary number (as opposed to an arrow or a table). <M>{t`\lambda`}</M> (read “lambda”) is just the name of that number.</p>
            <ol>
              <li>On the left is <M p=":">{t`\lambda A`}</M> every one of the four cells is multiplied by <M p=",">{t`\lambda`}</M> not just one.</li>
              <li>Below, the calculation runs backwards: <M>5</M> sits in every entry, so you may pull it to the front (“factor out”).</li>
              <li>Geometrically: every arrow <M>Av</M> becomes <M>{t`\lambda`}</M> times as long. The whole grid is stretched along.</li>
            </ol>
          </>}
        />
        <ScalarStretch />
        <T
          de={<p><b>Ausklammern probieren.</b> Die Folie rechnet rückwärts: aus einer grossen Matrix wird <M>{t`5`}</M> mal eine kleine. Tippe eigene Zahlen ein:</p>}
          en={<p><b>Try factoring out.</b> The slide works backwards: a big matrix becomes <M>{t`5`}</M> times a small one. Type your own numbers:</p>}
        />
        <FactorOut />
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«A + B geht immer»" en="“A + B always works”" />}>
        <T
          de={<p>Nein. Die Summe gibt es nur, wenn beide Matrizen genau dieselbe Form haben. Eine <M>{t`2\times 3`}</M>-Matrix und eine <M>{t`3\times 2`}</M>-Matrix haben zwar gleich viele Einträge, aber die Felder haben keine gemeinsamen Adressen. Darum ist <M>{t`A+B`}</M> dort nicht definiert.</p>}
          en={<p>No. The sum exists only if both matrices have exactly the same shape. A <M>{t`2\times 3`}</M> matrix and a <M>{t`3\times 2`}</M> matrix have the same number of entries, but their cells do not share addresses. So <M>{t`A+B`}</M> is not defined there.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de={<>«<M>{t`\lambda`}</M> multipliziert nur die erste Zahl (oder eine Zeile)»</>} en={<>“<M>{t`\lambda`}</M> multiplies only the first number (or one row)”</>} />}>
        <T
          de={<p>Der Skalar wirkt auf <em>jeden</em> Eintrag. Probe an <M p=":">{t`2\begin{pmatrix}1&1\\0&2\end{pmatrix}`}</M> Alle vier Felder verdoppeln sich, auch die <M>0</M> (sie bleibt <M p=").">0</M> Nur wenn alle Felder durch dieselbe Zahl teilbar sind, darf man sie ausklammern.</p>}
          en={<p>The scalar acts on <em>every</em> entry. Test with <M p=":">{t`2\begin{pmatrix}1&1\\0&2\end{pmatrix}`}</M> all four cells double, even the <M>0</M> (it stays <M p=").">0</M> Only if all cells are divisible by the same number may you factor it out.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«A + B verschiebt die Matrix» oder «addiert die Pfeile von A und B»" en="“A + B shifts the matrix” or “adds the arrows of A and B”" />}>
        <T
          de={<p>Nichts wird verschoben. <M>{t`A+B`}</M> ist eine neue Matrix mit eigenem Gitter. Addiert werden die <em>Bilder</em> eines Pfeils <M p=":">v</M> <M>Av</M> und <M p=".">Bv</M> Das Gitter von <M>{t`A+B`}</M> ist im Allgemeinen weder das von <M>A</M> noch das von <M p=".">B</M></p>}
          en={<p>Nothing is shifted. <M>{t`A+B`}</M> is a new matrix with its own grid. What is added are the <em>images</em> of one arrow <M p=":">v</M> <M>Av</M> and <M p=".">Bv</M> The grid of <M>{t`A+B`}</M> is in general neither the one of <M>A</M> nor the one of <M p=".">B</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li><M p=":">{t`A^{m\times n}`}</M> <M>m</M> Zeilen, <M p=";">n</M> Spalten <M>{t`A_{ij}`}</M> steht in Zeile <M p=",">i</M> Spalte <M p=".">j</M> Zeilen zuerst, Spalten später.</li>
            <li><M>{t`A+B`}</M> geht nur bei gleicher Form und rechnet Feld für Feld: <M p=".">{t`C_{ij} = A_{ij}+B_{ij}`}</M></li>
            <li>Geometrisch: <M p=".">{t`(A+B)v = Av + Bv`}</M> Erst beide Bilder von <M>v</M> bilden, dann die Pfeile addieren.</li>
            <li><M>{t`\lambda A`}</M> multipliziert jeden Eintrag und streckt den Raum um <M p=".">{t`\lambda`}</M> Gemeinsame Faktoren darf man ausklammern.</li>
          </ul>}
          en={<ul>
            <li><M p=":">{t`A^{m\times n}`}</M> <M>m</M> rows, <M p=";">n</M> columns <M>{t`A_{ij}`}</M> sits in row <M p=",">i</M> column <M p=".">j</M> Rows first, columns later.</li>
            <li><M>{t`A+B`}</M> works only for the same shape and goes cell by cell: <M p=".">{t`C_{ij} = A_{ij}+B_{ij}`}</M></li>
            <li>Geometrically: <M p=".">{t`(A+B)v = Av + Bv`}</M> First form both images of <M p=",">v</M> then add the arrows.</li>
            <li><M>{t`\lambda A`}</M> multiplies every entry and stretches space by <M p=".">{t`\lambda`}</M> Common factors may be pulled out.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
