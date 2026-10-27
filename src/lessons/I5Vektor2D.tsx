import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CompileFail } from '../viz/info/ControlFigures';
import { MatrixLayout } from '../viz/info/VectorFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I5Vektor2D() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Tabelle hat Zeilen und Spalten, ein Vektor nur eine Reihe. Die Lösung ist so einfach wie überraschend: Man steckt Vektoren in einen Vektor. Wer das einmal verstanden hat, versteht auch drei und mehr Dimensionen. Am Ende der Lektion kürzen wir die langen Typnamen mit <K>using</K> und <K>auto</K> ab.</p>}
        en={<p className="lede">A table has rows and columns, a vector only one row. The solution is as simple as surprising: you put vectors into a vector. Whoever has understood this once also understands three and more dimensions. At the end of the lesson we shorten the long type names with <K>using</K> and <K>auto</K>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="verschachtelt" title={<T de="1. Vektor von Vektoren" en="1. A vector of vectors" />}>
        <Box kind="lecture" src={<Src p="103" />} title={<T de="Mehrdimensionale Vektoren" en="Multidimensional vectors" />}>
          <T
            de={<>
              <p>Für mehrdimensionale Strukturen wie Tabellen und Matrizen sind mehrdimensionale Vektoren nützlich. In C++ erhält man sie, indem man einen Vektor in einen anderen schachtelt, also einen <b>Vektor von Vektoren</b>:</p>
              <Code code={'std::vector<std::vector<int>> m;'} />
              <p>Das ist ein leerer zweidimensionaler Vektor (eine Matrix), in der jeder (hypothetische) Eintrag eine ganze Zahl ist.</p>
              <p>Es gibt viele Arten, ihn zu initialisieren; wir zeigen die zwei häufigsten. Wie ein Literal kann man Eintrag für Eintrag hinschreiben, mit einer sogenannten <b>Initialisierungsliste</b>:</p>
              <Code code={'// the 4-by-4 identity matrix\nstd::vector<std::vector<int>> matrix = {\n    {1, 0, 0, 0},\n    {0, 1, 0, 0},\n    {0, 0, 1, 0},\n    {0, 0, 0, 1}\n};'} />
              <p>Üblich ist auch, den Vektor auf eine bestimmte Grösse mit einem Standardwert zu füllen:</p>
              <Code code={'int rows = ...;\nint cols = ...;\nstd::vector<std::vector<int>> m;\nm = std::vector<std::vector<int>>(rows, std::vector<int>(cols, 1));'} />
              <p>Das erzeugt eine Matrix mit <K>rows</K> Zeilen und <K>cols</K> Spalten, alle Einträge gleich 1. Mit anderen Worten: <K>m</K> ist ein Vektor der Länge <K>rows</K>, dessen Elemente (vom Typ <K>std::vector&lt;int&gt;</K>) Vektoren der Länge <K>cols</K> sind, deren Elemente (vom Typ <K>int</K>) alle 1 sind.</p>
              <p>Auf den Vektor in Zeile <K>i</K> greift man mit <K>m[i]</K> zu, auf den Eintrag in Zeile <K>i</K> und Spalte <K>j</K> mit <K>m[i][j]</K>. Mit <K>m.size()</K> erhält man die Zahl der Zeilen von <K>m</K> und mit <K>m[0].size()</K> die Zahl der Spalten (der ersten Zeile).</p>
            </>}
            en={<>
              <p>To store multidimensional structures such as tables and matrices, multidimensional vectors can be useful. We can achieve this in C++ by nesting a vector inside another vector, resulting in a <b>vector of vectors</b>:</p>
              <Code code={'std::vector<std::vector<int>> m;'} />
              <p>This is an empty two-dimensional vector (i.e., a matrix) where every (hypothetical) entry is an integer.</p>
              <p>A multidimensional vector can be initialized in many ways. We present the two most common cases. Like a literal, we can type entry after entry, using so-called <b>initialization lists</b>:</p>
              <Code code={'// the 4-by-4 identity matrix\nstd::vector<std::vector<int>> matrix = {\n    {1, 0, 0, 0},\n    {0, 1, 0, 0},\n    {0, 0, 1, 0},\n    {0, 0, 0, 1}\n};'} />
              <p>Another commonly used initialization is filling the multidimensional vector to a specific size with a certain default value:</p>
              <Code code={'int rows = ...;\nint cols = ...;\nstd::vector<std::vector<int>> m;\nm = std::vector<std::vector<int>>(rows, std::vector<int>(cols, 1));'} />
              <p>This creates a rows-times-cols matrix with all entries equal to 1. In other words, <K>m</K> is a vector of length <K>rows</K> whose elements (of type <K>std::vector&lt;int&gt;</K>) are vectors of length <K>cols</K> whose elements (of type <K>int</K>) are all ones.</p>
              <p>We can access the vector at row <K>i</K> using <K>m[i]</K> and the element at row <K>i</K> and column <K>j</K> using <K>m[i][j]</K>. Moreover, we can use <K>m.size()</K> to get the number of rows of <K>m</K> and <K>m[0].size()</K> to get the number of columns (of the first row) of <K>m</K>.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.matrixFill} label={tr('Eine 2×3-Matrix mit lauter Einsen, dann ein Eintrag geändert', 'A 2×3 matrix of ones, then one entry changed')} />
        <T
          de={<>
            <p><b>Lies <K>m[1][2]</K> von links nach rechts:</b> Zuerst ergibt <K>m[1]</K> die <em>zweite Zeile</em>, einen ganzen Vektor. Auf diesen Vektor wird dann <K>[2]</K> angewendet, das dritte Element. Im Ablauf siehst du <K>m</K> als Reihe von zwei Kästen, in denen je drei Kästchen stehen: Die gestrichelten Rahmen sind die Zeilen. Beim Schreiben von <K>m[1][2] = 7</K> ändert sich nur ein Kästchen.</p>
            <p>Die erste Variante, die Liste, zeigt dasselbe, nur hingeschrieben:</p>
          </>}
          en={<>
            <p><b>Read <K>m[1][2]</K> from left to right:</b> first <K>m[1]</K> yields the <em>second row</em>, a whole vector. Then <K>[2]</K> is applied to this vector, the third element. In the run you see <K>m</K> as a row of two frames, each holding three boxes: the dashed frames are the rows. When writing <K>m[1][2] = 7</K> only one box changes.</p>
            <p>The first variant, the list, shows the same, just written out:</p>
          </>}
        />
        <Tracer prog={P.matrixInit} label={tr('Die 4×4-Einheitsmatrix aus einer Liste', 'The 4×4 identity matrix from a list')} />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="layout" title={<T de="2. Tabelle im Kopf, Streifen im Speicher" en="2. Table in the head, strip in memory" />}>
        <Box kind="lecture" src={<Src p="103–104" />} title={<T de="Abbildung 7.1" en="Figure 7.1" />}>
          <T
            de={<p>Wir stellen uns den zweidimensionalen Vektor als Matrix vor, im Speicher liegt er aber «flach», Zeile für Zeile (Abbildung 7.1). Diese Wahl ist willkürlich: Man könnte sich einen zweidimensionalen Vektor im Prinzip auch als Vektor von Spalten statt als Vektor von Zeilen denken.</p>}
            en={<p>While we think of this two-dimensional vector as a matrix, in memory it is stored in a flat way, row after row (Figure 7.1). Note that this choice is arbitrary: we could, in principle, also think of a two-dimensional vector as a vector of columns instead of a vector of rows.</p>}
          />
        </Box>
        <MatrixLayout />
        <T
          de={<>
            <p>Klicke ein Feld der Tabelle an: Rechts davon im Streifen leuchtet seine Position <M p=".">{String.raw`i \cdot \mathrm{cols} + j`}</M> Die Formel zeigt, warum <em>wir</em> «Zeile, Spalte» sagen und der Rechner «Position»: Mit <K>cols</K> Spalten liegt <K>m[i][j]</K> an Position <K>i · cols + j</K>. Das ist dieselbe Rechnung wie bei einem Vektor, nur zweimal angewendet.</p>
            <p><b>Eine Vorsicht.</b> Das flache Bild ist ein <em>Denkmodell</em>. In C++ ist jede Zeile ein eigener Vektor mit eigenem Speicherblock; innerhalb einer Zeile liegen die Elemente nebeneinander, zwischen den Zeilen kann eine Lücke sein (der Test in diesem Projekt misst es: <K>&amp;m[1][0] - &amp;m[0][0]</K> ist nicht <K>3</K>). Für das Programmieren ändert das nichts: <K>m[i][j]</K> verhält sich genau wie in der Tabelle. Man darf sich nur nicht darauf verlassen, dass die ganze Matrix lückenlos hintereinander liegt.</p>
          </>}
          en={<>
            <p>Click a cell of the table: to its right in the strip its position <M>{String.raw`i \cdot \mathrm{cols} + j`}</M> lights up. The formula shows why <em>we</em> say “row, column” and the computer says “position”: with <K>cols</K> columns, <K>m[i][j]</K> lies at position <K>i · cols + j</K>. It is the same calculation as for one vector, just applied twice.</p>
            <p><b>One caution.</b> The flat picture is a <em>mental model</em>. In C++ every row is a vector of its own with a memory block of its own; inside a row the elements lie next to each other, between the rows there can be a gap (this project’s test measures it: <K>&amp;m[1][0] - &amp;m[0][0]</K> is not <K>3</K>). For programming this changes nothing: <K>m[i][j]</K> behaves exactly like in the table. One just must not rely on the whole matrix lying gaplessly in a row.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="dreieck" title={<T de="3. Beispiel: die untere Dreiecksmatrix" en="3. Example: the lower triangle" />}>
        <Box kind="lecture" src={<Src p="104–105" />} title={<T de="Summe des unteren Dreiecks" en="Sum of the lower triangle" />}>
          <T
            de={<>
              <p>Mit mehrdimensionalen Vektoren arbeitet man wie mit eindimensionalen. Während man für diese typischerweise <em>eine</em> for-Schleife braucht, braucht man für jene <em>zwei</em> verschachtelte for-Schleifen, um alle Elemente zu durchlaufen.</p>
              <p>Beispiel: Gegeben ist eine quadratische <M>{String.raw`n \times n`}</M>-Matrix, und wir wollen die Summe ihrer <b>unteren Dreiecksmatrix</b> berechnen (Abbildung 7.2: die grauen Einträge unterhalb der Diagonale). Wir brauchen eine äussere Schleife über die Zeilen und eine innere über die Spalten von 0 bis (ausschliesslich) die aktuelle Zeile.</p>
              <p>Merke zum Parameter: Grosse Argumente übergibt man per <b>const-Referenz</b>, aus Effizienz (es wird nichts kopiert) und Sicherheit (das Argument ist unveränderlich).</p>
            </>}
            en={<>
              <p>We can work with multidimensional vectors in the same way as with one-dimensional vectors. While for the latter we typically need <em>one</em> for loop, for the former we need <em>two</em> nested for loops in order to iterate over all elements.</p>
              <p>Example: we are given a square <M>{String.raw`n \times n`}</M> matrix, and we want to compute the sum of its <b>lower triangle</b> (Figure 7.2: the grey entries below the diagonal). We need an outer loop over the rows and an inner loop over the columns from 0 up to (not including) the current row.</p>
              <p>Note on the parameter: we pass (large) arguments by <b>const reference</b>, for efficiency (no copies are made) and for safety (the argument is immutable).</p>
            </>}
          />
        </Box>
        <Tracer stack prog={P.lowerTriangle} label={tr('lower_triangle_sum für eine 3×3-Matrix', 'lower_triangle_sum for a 3×3 matrix')} />
        <T
          de={<>
            <p><b>Was du im Ablauf siehst.</b> Die Funktion bekommt die Matrix <em>nicht als Kopie</em>: Der Parameter <K>matrix</K> trägt die Marke «Alias» und zeigt dieselben Kästchen wie <K>m</K> in <K>main</K>. (Was <K>const std::vector&lt;…&gt;&amp;</K> genau bedeutet, klärt das nächste Kapitel; für jetzt: «nur lesen, nicht kopieren».) Achte auf die innere Schleife: Für <K>row = 0</K> läuft sie gar nicht (<K>column &lt; 0</K> ist sofort falsch), für <K>row = 1</K> einmal, für <K>row = 2</K> zweimal. Summiert werden <K>4</K>, <K>7</K> und <K>8</K>, also <K>19</K>.</p>
            <p><b>Warum <K>column &lt; row</K>?</b> Das untere Dreieck unterhalb der Diagonale besteht aus den Einträgen mit Spalte <em>kleiner</em> als Zeile. Die Diagonale selbst (<K>column == row</K>) gehört nicht dazu. Mit <K>&lt;=</K> hättest du sie mitgezählt. Das ist ein klassischer Fall, in dem die Grenze der inneren Schleife von der äusseren abhängt.</p>
          </>}
          en={<>
            <p><b>What you see in the run.</b> The function does <em>not</em> get the matrix <em>as a copy</em>: the parameter <K>matrix</K> carries the mark “alias” and shows the same boxes as <K>m</K> in <K>main</K>. (What <K>const std::vector&lt;…&gt;&amp;</K> exactly means is clarified in the next chapter; for now: “read only, do not copy”.) Watch the inner loop: for <K>row = 0</K> it does not run at all (<K>column &lt; 0</K> is false at once), for <K>row = 1</K> once, for <K>row = 2</K> twice. The sum collects <K>4</K>, <K>7</K> and <K>8</K>, i.e. <K>19</K>.</p>
            <p><b>Why <K>column &lt; row</K>?</b> The lower triangle below the diagonal consists of the entries with column <em>smaller</em> than row. The diagonal itself (<K>column == row</K>) does not belong to it. With <K>&lt;=</K> you would have counted it. This is a classic case in which the bound of the inner loop depends on the outer one.</p>
          </>}
        />
        <Choice
          question={<T de={<>Wie oft wird der Rumpf der inneren Schleife bei einer <K>n × n</K>-Matrix insgesamt ausgeführt?</>} en={<>How often is the body of the inner loop executed in total for an <K>n × n</K> matrix?</>} />}
          choices={[
            { text: <M>{String.raw`0 + 1 + 2 + \dots + (n-1)`}</M>, correct: true, why: <T de={<>Richtig: In Zeile <K>row</K> laufen <K>row</K> Durchgänge. Die Summe ist <K>n(n−1)/2</K>, etwa die Hälfte der Matrix.</>} en={<>Correct: in row <K>row</K> there are <K>row</K> passes. The sum is <K>n(n−1)/2</K>, about half the matrix.</>} /> },
            { text: <M>{String.raw`n \cdot n`}</M>, why: <T de={<>So oft liefe er, wenn die innere Schleife bei jeder Zeile bis <K>n</K> liefe. Hier hängt die Grenze von <K>row</K> ab.</>} en={<>That is how often it would run if the inner loop went up to <K>n</K> for every row. Here the bound depends on <K>row</K>.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="jagged" title={<T de="4. Nicht-rechteckige Vektoren" en="4. Non-rectangular vectors" />}>
        <Box kind="lecture" src={<Src p="105" />} title={<T de="Zeilen unterschiedlicher Länge" en="Rows of different length" />}>
          <T
            de={<>
              <p>Eine Kuriosität: Zweidimensionale Vektoren müssen keine quadratischen oder auch nur rechteckigen Matrizen sein. Es ist völlig in Ordnung (wenn auch nicht sehr üblich), einen nicht-rechteckigen zweidimensionalen Vektor zu haben, also einen Vektor von Vektoren verschiedener Länge. Im Beispiel hat jede Zeile eine andere Zahl von Einträgen. Auf die Länge einer bestimmten Zeile kommt man mit <K>cantons[row].size()</K>.</p>
              <p>Auch mehr als zwei Dimensionen sind möglich (ein Vektor von Vektoren von Vektoren …).</p>
            </>}
            en={<>
              <p>One curiosity worth noting: two-dimensional vectors do not need to correspond to square or even rectangular matrices. It is perfectly fine (although not very common) to have non-rectangular two-dimensional vectors, i.e. a vector of vectors of different length. In the example every row has a different number of entries. We can read the length of a particular row using <K>cantons[row].size()</K>.</p>
              <p>It is also possible to have multidimensional vectors with more than two dimensions (a vector of vectors of vectors of …).</p>
            </>}
          />
        </Box>
        <Listing prog={P.jagged} label={tr('Kantone, nach Zeilen gruppiert', 'Cantons, grouped by rows')} />
        <T
          de={<p>Die Ausgabe bestätigt: <K>cantons[1][2]</K> ist <K>"VS"</K>, die zweite Zeile hat 4 Einträge, die dritte 6. Deshalb darf man in der inneren Schleife nie <K>m[0].size()</K> annehmen: Bei Vektoren verschiedener Länge muss die innere Schleife bis <K>m[i].size()</K> laufen, mit der Länge <em>dieser</em> Zeile.</p>}
          en={<p>The output confirms: <K>cantons[1][2]</K> is <K>"VS"</K>, the second row has 4 entries, the third 6. That is why you must never assume <K>m[0].size()</K> in the inner loop: for vectors of different lengths the inner loop must run up to <K>m[i].size()</K>, the length of <em>this</em> row.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="alias" title={<T de="5. Kürzer schreiben: using und auto" en="5. Writing less: using and auto" />}>
        <Box kind="lecture" src={<Src p="105–106" />} title={<T de="Typ-Alias und auto" en="Type alias and auto" />}>
          <T
            de={<>
              <p>Gerade bei mehreren Dimensionen können Typnamen ziemlich lang werden. Mit einer <b>Typ-Alias-Deklaration</b> <K>using name = type</K> führen wir <K>name</K> als Alias (Abkürzung) für den Typ <K>type</K> ein. Überall, wo man <K>type</K> bräuchte, kann man dann <K>name</K> schreiben:</p>
              <Code code={'using imatrix = std::vector<std::vector<int>>;\n// POST: Matrix \'m\' was output to standard output\nvoid print(const imatrix& m);'} />
              <p>Eine Alternative, die eine noch kürzere Schreibweise erlaubt, ist das Schlüsselwort <K>auto</K>: Statt der langen Deklaration schreibt man <K>auto all_ones_matrix = std::vector&lt;std::vector&lt;int&gt;&gt;(rows, std::vector&lt;int&gt;(cols, 1));</K>. Das Schlüsselwort <K>auto</K> ist ein <em>Platzhalter</em> für den Typ der deklarierten Variablen. Der Compiler leitet den Typ von der rechten Seite ab. Zum Beispiel erkennt er bei <K>auto x = 2 + 3;</K>, dass <K>x</K> den Typ <K>int</K> hat.</p>
              <p>Die Verwendung von <K>auto</K> ist etwas ganz anderes als das Fehlen eines statischen Typs in dynamisch typisierten Sprachen (wie Python). Schreibt man später <K>std::cout &lt;&lt; x[2];</K>, führt das zu einem Fehler <em>beim Übersetzen</em>, denn der Indexoperator lässt sich nicht auf <K>int</K> anwenden. Dass man den Typ weglässt, heisst nicht, dass der Compiler ihn nicht kennt. Wir empfehlen, <K>auto</K> nur dort zu verwenden, wo es den Code deutlich kürzer macht und wo der Typ für den Programmierer offensichtlich ist.</p>
            </>}
            en={<>
              <p>Especially with several dimensions, type names can be pretty long. With a <b>type alias declaration</b> <K>using name = type</K> we introduce <K>name</K> as an alias (shortcut) for the type <K>type</K>. Wherever we have to access <K>type</K>, we can now use <K>name</K> instead:</p>
              <Code code={'using imatrix = std::vector<std::vector<int>>;\n// POST: Matrix \'m\' was output to standard output\nvoid print(const imatrix& m);'} />
              <p>An alternative that allows an even more compact notation is the keyword <K>auto</K>: instead of the long declaration one writes <K>auto all_ones_matrix = std::vector&lt;std::vector&lt;int&gt;&gt;(rows, std::vector&lt;int&gt;(cols, 1));</K>. The keyword <K>auto</K> is a <em>placeholder</em> for the type of the declared variable. The compiler deduces the type from the right-hand side. For instance, with <K>auto x = 2 + 3;</K> it deduces that <K>x</K> has type <K>int</K>.</p>
              <p>Using <K>auto</K> is very different from not having a static type in dynamically typed languages (such as Python). If we later write <K>std::cout &lt;&lt; x[2];</K>, this leads to an error <em>at compile time</em>, since the index operator cannot be applied to <K>int</K>. Omitting the type does not mean the compiler is not aware of it. We recommend using <K>auto</K> only where it makes the code significantly shorter and where it is obvious for the programmer to deduce the type.</p>
            </>}
          />
        </Box>
        <Listing prog={P.aliasAuto} label={tr('Alias, auto und eine Ausgabefunktion', 'Alias, auto and an output function')} />
        <CompileFail prog={P.autoIndexErr} label={tr('auto heisst nicht «ohne Typ»', 'auto does not mean “without a type”')} />
        <Box kind="tip" title={<T de="Verschachtelte Vektoren ohne Verwirrung" en="Nested vectors without confusion" />}>
          <T
            de={<ul>
              <li><b>Benenne Zeilen- und Spaltenindex verschieden und aussagekräftig</b> (<K>row</K>, <K>col</K> statt <K>i</K>, <K>j</K>), und notiere am Parameter, ob <K>m[i][j]</K> «Zeile i, Spalte j» bedeutet. Nichts vertauscht sich leichter.</li>
              <li><b>Beim Schreiben <K>m[i][j]</K> prüfe zuerst <K>m[i]</K>:</b> Existiert die Zeile? Eine leere Matrix hat gar keine Zeile 0, und <K>m[0].size()</K> wäre schon ein Fehler.</li>
              <li><b>Verwende ein <K>using</K>-Alias</b>, sobald ein langer Typ mehr als zweimal vorkommt. Du schreibst weniger und vermeidest Tippfehler in <K>&gt;&gt;</K> und <K>&lt;&gt;</K>.</li>
              <li><b>Vorsicht mit <K>auto</K>:</b> Bei <K>auto x = v.size();</K> ist <K>x</K> vorzeichenlos (der Typ von <K>size()</K>). Die Falle der letzten Lektion kommt durch die Hintertür zurück.</li>
            </ul>}
            en={<ul>
              <li><b>Name row and column index differently and meaningfully</b> (<K>row</K>, <K>col</K> instead of <K>i</K>, <K>j</K>), and note at the parameter whether <K>m[i][j]</K> means “row i, column j”. Nothing gets swapped more easily.</li>
              <li><b>When writing <K>m[i][j]</K> check <K>m[i]</K> first:</b> does the row exist? An empty matrix has no row 0 at all, and <K>m[0].size()</K> would already be an error.</li>
              <li><b>Use a <K>using</K> alias</b> as soon as a long type occurs more than twice. You write less and avoid typos in <K>&gt;&gt;</K> and <K>&lt;&gt;</K>.</li>
              <li><b>Careful with <K>auto</K>:</b> with <K>auto x = v.size();</K>, <K>x</K> is unsigned (the type of <K>size()</K>). The trap of the last lesson comes back through the back door.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="wichtig" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Ein <K>std::vector&lt;std::vector&lt;T&gt;&gt;</K> ist eine Tabelle: <K>m[i]</K> ist die Zeile <K>i</K>, <K>m[i][j]</K> der Eintrag, <K>m.size()</K> die Zeilenzahl, <K>m[0].size()</K> die Spaltenzahl.</li>
              <li>Initialisierung per Liste oder per <K>(rows, std::vector&lt;T&gt;(cols, wert))</K>.</li>
              <li>Zwei Indizes brauchen zwei verschachtelte Schleifen. Die Grenze der inneren kann von der äusseren abhängen.</li>
              <li>Zeilen dürfen verschieden lang sein: Benutze <K>m[i].size()</K>.</li>
              <li><K>using</K> und <K>auto</K> kürzen lange Typen. <K>auto</K> nur, wenn der Typ offensichtlich ist.</li>
            </ul>}
            en={<ul>
              <li>A <K>std::vector&lt;std::vector&lt;T&gt;&gt;</K> is a table: <K>m[i]</K> is row <K>i</K>, <K>m[i][j]</K> the entry, <K>m.size()</K> the number of rows, <K>m[0].size()</K> the number of columns.</li>
              <li>Initialization by list or by <K>(rows, std::vector&lt;T&gt;(cols, value))</K>.</li>
              <li>Two indices need two nested loops. The bound of the inner one may depend on the outer one.</li>
              <li>Rows may have different lengths: use <K>m[i].size()</K>.</li>
              <li><K>using</K> and <K>auto</K> shorten long types. <K>auto</K> only when the type is obvious.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Wir haben mehrfach «Alias» gesehen, bei <K>matrix</K> in <K>lower_triangle_sum</K>. Das ist ein neuer Typ: die Referenz. Sie löst auch ein altes Problem, das Vertauschen zweier Variablen in einer Funktion (Skript S. 107–109).</p>}
          en={<p className="connections"><b>Next:</b> we saw “alias” several times, at <K>matrix</K> in <K>lower_triangle_sum</K>. That is a new type: the reference. It also solves an old problem, swapping two variables in a function (notes pp. 107–109).</p>}
        />
      </Section>
    </article>
  );
}
