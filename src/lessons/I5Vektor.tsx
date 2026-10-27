import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { MemoryStrip, SieveGrid } from '../viz/info/VectorFigures';
import { Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I5Vektor() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Mit <K>for (int i = 0; i &lt; n; ++i)</K> kann man über Zahlen laufen. Oft will man aber über <em>Daten</em> laufen: über alle Messwerte, alle Noten, alle Zahlen, die man sich merken muss. Dafür braucht man viele Variablen gleichen Typs unter einem Namen. Genau das ist ein Vektor, und diese Lektion zeigt ihn an einem Beispiel, das älter ist als jeder Computer: dem Sieb des Eratosthenes.</p>}
        en={<p className="lede">With <K>for (int i = 0; i &lt; n; ++i)</K> one can run over numbers. Often, however, one wants to run over <em>data</em>: over all measurements, all grades, all the numbers one has to remember. For that you need many variables of the same type under one name. That is exactly what a vector is, and this lesson shows it with an example older than any computer: the Sieve of Eratosthenes.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="sieb" title={<T de="1. Das Problem: alle Primzahlen unter n" en="1. The problem: all primes below n" />}>
        <Box kind="lecture" src={<Src p="97" />} title={<T de="Das Sieb des Eratosthenes" en="The Sieve of Eratosthenes" />}>
          <T
            de={<>
              <p>Vektoren erlauben es, eine Folge von gleichartigen Datensätzen zu speichern. Wir erklären sie am <b>Sieb des Eratosthenes</b>, das für gegebenes <M>{t`n \in \mathbb{N}`}</M> alle Primzahlen kleiner als <M>n</M> berechnet. Die Methode: alle Nicht-Primzahlen <em>streichen</em>.</p>
              <p>Man schreibt die Zahlen <M>{t`2, 3, 4, \dots`}</M> auf und streicht alle echten Vielfachen von 2, von 3 und von allen folgenden Zahlen, die nicht schon vorher gestrichen wurden. Am Ende des Streichens bleiben nur Primzahlen übrig.</p>
              <p>Wie streichen wir Zahlen? Mit einem Vektor (von Wahrheitswerten): Für jede Zahl merken wir uns, ob sie gestrichen ist.</p>
            </>}
            en={<>
              <p>Vectors allow us to store a sequence of homogeneous data sets. We illustrate them with the <b>Sieve of Eratosthenes</b>, which, for given <M p=",">{t`n \in \mathbb{N}`}</M> computes all prime numbers smaller than <M p=".">n</M> The method: <em>cross out</em> all non-prime numbers.</p>
              <p>One writes down the numbers <M>{t`2, 3, 4, \dots`}</M> and crosses out all proper multiples of 2, of 3, and of all following numbers that have not been crossed out before. At the end of the crossing out process only prime numbers remain.</p>
              <p>How do we cross out numbers? With a vector (of Booleans): for each number we remember whether it is crossed out.</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>Probiere das Verfahren zuerst von Hand.</b> Drücke «Nächste Primzahl» und beobachte: Die kleinste Zahl, die noch nicht gestrichen ist, <em>muss</em> prim sein, denn ein echter Teiler wäre kleiner und hätte sie schon gestrichen. Dann streicht man ihre Vielfachen. Der Rest ergibt sich von allein.</p>}
          en={<p><b>First try the method by hand.</b> Press “Next prime” and watch: the smallest number not yet crossed out <em>must</em> be prime, because a proper divisor would be smaller and would have crossed it out already. Then you cross out its multiples. The rest follows by itself.</p>}
        />
        <SieveGrid />
        <T
          de={<p>Die Frage für das Programm ist nur: <em>Wo merken wir uns, was gestrichen ist?</em> Bei 24 Zahlen brauchten wir 24 Variablen <K>crossed_out_2</K>, <K>crossed_out_3</K>, …, und für 1000 Zahlen 1000. Das geht nicht. Wir brauchen eine Variable, die viele Wahrheitswerte enthält, und eine Art, diese über eine Nummer anzusprechen. Das ist der Vektor.</p>}
          en={<p>The only question for the program is: <em>where do we remember what is crossed out?</em> For 24 numbers we would need 24 variables <K>crossed_out_2</K>, <K>crossed_out_3</K>, …, and for 1000 numbers 1000. That does not work. We need one variable that holds many truth values, and a way to address them by a number. That is the vector.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="vektor" title={<T de="2. Der Vektor im Programm" en="2. The vector in the program" />}>
        <Box kind="lecture" src={<Src p="97–98" />} title={<K>std::vector&lt;T&gt;</K>}>
          <T
            de={<>
              <p>Ein Vektortyp wird durch <K>std::vector&lt;T&gt;</K> angegeben, wobei <K>T</K> der Typ der Elemente ist (der <b>Basistyp</b>). Ein Vektor wird durch die Initialisierung <K>std::vector&lt;T&gt;(n,e)</K> erzeugt: <K>T</K> ist der Basistyp, <K>n</K> die Zahl der Elemente und <K>e</K> der Wert, mit dem jedes der <K>n</K> Elemente initialisiert wird. Die Zeile</p>
              <Code code={'std::vector<bool> crossed_out = std::vector<bool>(n, false);'} />
              <p>deklariert also einen Vektor namens <K>crossed_out</K> mit <K>n</K> Elementen, die alle zunächst <K>false</K> sind.</p>
              <p>Auf die Elemente einer Vektorvariablen greift man mit dem <b>Indexoperator</b> <K>[…]</K> zu, sowohl lesend als auch schreibend:</p>
              <Code code={'if (crossed_out[i]) { // read element at index i\n    ...\n    crossed_out[m] = true; // write element at index m\n    ...\n}'} />
            </>}
            en={<>
              <p>A vector type is given by <K>std::vector&lt;T&gt;</K> where <K>T</K> is the type of the elements of the vector (its <b>base type</b>). A vector can be created using the initialization <K>std::vector&lt;T&gt;(n,e)</K> where <K>T</K> is the base type, <K>n</K> is the number of elements and <K>e</K> is the value with which each of the <K>n</K> elements is initialized. So the line</p>
              <Code code={'std::vector<bool> crossed_out = std::vector<bool>(n, false);'} />
              <p>declares a vector named <K>crossed_out</K> with <K>n</K> elements, each of which is initially set to <K>false</K>.</p>
              <p>The elements of a vector variable can be accessed using the <b>index operator</b> (also subscript operator) <K>[…]</K>, for both reading and writing:</p>
              <Code code={'if (crossed_out[i]) { // read element at index i\n    ...\n    crossed_out[m] = true; // write element at index m\n    ...\n}'} />
            </>}
          />
        </Box>
        <Tracer prog={P.sieve} inputs={['24\n', '12\n', '2\n']} label={tr('Code 7.1: das Sieb als Programm', 'Code 7.1: the sieve as a program')} />
        <T
          de={<>
            <p><b>So liest du den Ablauf.</b> In der Tabelle rechts siehst du den Vektor <K>crossed_out</K> als Reihe von Kästchen, mit dem Index über jedem Kästchen. Ein rotes Kästchen heisst <K>true</K>, also gestrichen. Gehe Schritt für Schritt durch die äussere Schleife: Die Zahl <K>i</K> wird nur ausgegeben, wenn ihr Kästchen noch <K>false</K> ist. Dann streicht die innere Schleife in Schritten von <K>i</K> weiter: <K>2*i</K>, <K>3*i</K>, … Das <K>m += i</K> macht aus der Schleife eine Abfolge von Vielfachen.</p>
            <p><b>Warum beginnt die innere Schleife bei <K>2*i</K>?</b> Wir streichen <em>echte</em> Vielfache. Die Zahl <K>i</K> selbst ist prim und bleibt stehen. <b>Warum <K>i &lt; n</K> und <K>m &lt; n</K>?</b> Der Vektor hat die Indizes <K>0</K> bis <K>n-1</K>. Ein Index <K>n</K> oder grösser wäre ausserhalb: Dazu gleich mehr.</p>
            <p>Die Kästchen mit Index 0 und 1 bleiben unbenutzt: Das ist der Preis dafür, dass die Zahl <K>i</K> bequem im Kästchen <K>i</K> wohnt.</p>
          </>}
          en={<>
            <p><b>How to read the run.</b> In the table on the right you see the vector <K>crossed_out</K> as a row of boxes, with the index above each box. A red box means <K>true</K>, i.e. crossed out. Step through the outer loop: the number <K>i</K> is printed only if its box is still <K>false</K>. Then the inner loop crosses out further in steps of <K>i</K>: <K>2*i</K>, <K>3*i</K>, … The <K>m += i</K> turns the loop into a sequence of multiples.</p>
            <p><b>Why does the inner loop start at <K>2*i</K>?</b> We cross out <em>proper</em> multiples. The number <K>i</K> itself is prime and stays. <b>Why <K>i &lt; n</K> and <K>m &lt; n</K>?</b> The vector has the indices <K>0</K> to <K>n-1</K>. An index <K>n</K> or larger would be outside: more on that shortly.</p>
            <p>The boxes with index 0 and 1 stay unused: that is the price for the number <K>i</K> conveniently living in box <K>i</K>.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="speicher" title={<T de="3. Speicherlayout und Zugriff" en="3. Memory layout and access" />}>
        <Box kind="lecture" src={<Src p="98–99" />} title={<T de="Speicherlayout und Eigenschaften" en="Memory layout and properties" />}>
          <T
            de={<>
              <p>Ein Vektor belegt einen <b>zusammenhängenden</b> Speicherbereich: ein Speichersegment für jedes Element, jeweils so gross wie der Typ <K>T</K> (zum Beispiel 4 Bytes).</p>
              <p>Ein Vektor unterstützt den sogenannten <b>wahlfreien Zugriff</b> (<span lang="en">random access</span>). Gegeben ein Vektor <K>vec</K> mit Elementen vom Typ <K>T</K> und ein ganzzahliger Ausdruck <K>exp</K> mit dem Wert <M p=".">{t`i \ge 0`}</M> Dann ist der Ausdruck <K>vec[exp]</K> ein L-Wert vom Typ <K>T</K>, der sich auf das <M>i</M>-te Element von <K>vec</K> bezieht (gezählt ab <b>0</b>!). Der Wert <M>i</M> heisst <b>Index</b>, und <K>[ ]</K> ist der Index- oder Subskriptoperator.</p>
              <p>Der wahlfreie Zugriff ist sehr effizient: Es braucht nur eine Multiplikation und eine Addition, um die Speicherstelle des gesuchten Elements zu bestimmen. Ist <M>p</M> die Adresse von <K>vec</K> und <M>s</M> die Grösse von <K>T</K>, so liegt <K>vec[i]</K> an der Adresse <M p=".">{t`p + s \cdot i`}</M></p>
            </>}
            en={<>
              <p>A vector occupies a <b>contiguous</b> memory area: one memory segment for each element, each as large as the type <K>T</K> (for example 4 bytes).</p>
              <p>A vector supports so-called <b>random access</b>. Given a vector <K>vec</K> with elements of type <K>T</K> and an expression <K>exp</K> of integer type with value <M p=",">{t`i \ge 0`}</M> the expression <K>vec[exp]</K> is an L-value of type <K>T</K> that refers to the <M>i</M>-th element of <K>vec</K> (counting from <b>0</b>!). The value <M>i</M> is called <b>index</b>, and <K>[ ]</K> is the index (or subscript) operator.</p>
              <p>Random access is very efficient: it requires only a multiplication and an addition to determine the memory location of the wanted element. If <M>p</M> is the address of <K>vec</K> and <M>s</M> is the size of <K>T</K>, then <K>vec[i]</K> lies at the address <M p=".">{t`p + s \cdot i`}</M></p>
            </>}
          />
        </Box>
        <MemoryStrip />
        <T
          de={<>
            <p><b>Warum man ab 0 zählt.</b> Das erste Element liegt <em>am Anfang</em>, also im Abstand 0 von der Startadresse. Das <M>i</M>-te liegt <M>i</M> Elemente weiter, bei <M p=".">{t`p + s \cdot i`}</M> Zählte man ab 1, bräuchte jeder Zugriff eine zusätzliche Subtraktion. Der Index ist also ein <em>Abstand</em>, keine Nummer. Das erklärt auch, warum ein Vektor mit <K>n</K> Elementen die Indizes <K>0 … n-1</K> hat.</p>
            <p><b>Warum zusammenhängend wichtig ist.</b> Weil alle Elemente gleich gross sind und lückenlos aufeinanderfolgen, kann der Rechner jedes Element mit <em>einer</em> Rechnung finden, gleich schnell für das erste wie für das millionste. Das nennt man wahlfreien Zugriff. Dafür muss ein Vektor beim Wachsen manchmal in einen grösseren Speicherbereich umziehen (mehr dazu später).</p>
          </>}
          en={<>
            <p><b>Why one counts from 0.</b> The first element lies <em>at the start</em>, i.e. at distance 0 from the start address. The <M>i</M>-th lies <M>i</M> elements further, at <M p=".">{t`p + s \cdot i`}</M> If one counted from 1, every access would need an additional subtraction. The index is thus a <em>distance</em>, not a number. That also explains why a vector with <K>n</K> elements has the indices <K>0 … n-1</K>.</p>
            <p><b>Why contiguous matters.</b> Because all elements are equally large and follow each other without gaps, the computer can find any element with <em>one</em> calculation, equally fast for the first as for the millionth. This is called random access. For this, a vector must sometimes move to a larger memory area when it grows (more on that later).</p>
          </>}
        />
        <Box kind="misconception" title={<T de="«Ein Vektor mit 10 Elementen hat die Indizes 1 bis 10.»" en="“A vector with 10 elements has the indices 1 to 10.”" />}>
          <T
            de={<>Nein: <K>0</K> bis <K>9</K>. Das letzte gültige Element ist <K>v[n-1]</K>; <K>v[n]</K> ist schon <em>daneben</em>. Das ist der häufigste Fehler mit Vektoren (<span lang="en">off-by-one</span>), und die nächste Lektion zeigt, was dann passiert.</>}
            en={<>No: <K>0</K> to <K>9</K>. The last valid element is <K>v[n-1]</K>; <K>v[n]</K> is already <em>beside</em> the vector. This is the most common mistake with vectors (off-by-one), and the next lesson shows what happens then.</>}
          />
        </Box>
        <Box kind="tip" title={<T de="Gute Gewohnheiten" en="Good habits" />}>
          <T
            de={<ul>
              <li><b>Vergiss <K>#include &lt;vector&gt;</K> nicht.</b> Ohne diese Zeile kennt der Compiler <K>std::vector</K> nicht.</li>
              <li><b>Schleife über alle Elemente:</b> <K>for (int i = 0; i &lt; n; ++i)</K> mit <K>&lt;</K>, nie <K>&lt;=</K>. Das Muster «0 bis <em>ausschliesslich</em> <K>n</K>» ist das Gegenstück zu den Indizes <K>0</K> bis <K>n-1</K>.</li>
              <li><b>Wähle den Index so, dass er ein Gedächtnis ist:</b> Im Sieb wohnt die Zahl <K>i</K> im Kästchen <K>i</K>. Das spart jede Umrechnung und damit Fehler.</li>
            </ul>}
            en={<ul>
              <li><b>Do not forget <K>#include &lt;vector&gt;</K>.</b> Without that line the compiler does not know <K>std::vector</K>.</li>
              <li><b>Loop over all elements:</b> <K>for (int i = 0; i &lt; n; ++i)</K> with <K>&lt;</K>, never <K>&lt;=</K>. The pattern “0 up to <em>excluding</em> <K>n</K>” is the counterpart of the indices <K>0</K> to <K>n-1</K>.</li>
              <li><b>Choose the index so that it is a memory aid:</b> in the sieve the number <K>i</K> lives in box <K>i</K>. That saves every conversion and thereby mistakes.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Ein <K>std::vector&lt;int&gt;</K> beginnt bei Adresse 2000, ein <K>int</K> braucht 4 Bytes. Wo liegt <K>v[5]</K>?</>} en={<>A <K>std::vector&lt;int&gt;</K> starts at address 2000, an <K>int</K> takes 4 bytes. Where does <K>v[5]</K> lie?</>} />}
          choices={[
            { text: <K>2020</K>, correct: true, why: <T de={<>Richtig: <M p=".">{t`2000 + 4 \cdot 5 = 2020`}</M></>} en={<>Correct: <M p=".">{t`2000 + 4 \cdot 5 = 2020`}</M></>} /> },
            { text: <K>2005</K>, why: <T de={<>Der Abstand ist in <em>Elementen</em>, jedes ist 4 Bytes gross: also 5 mal 4, nicht 5.</>} en={<>The distance is in <em>elements</em>, each is 4 bytes large: so 5 times 4, not 5.</>} /> },
            { text: <K>2024</K>, why: <T de={<>Das wäre <K>v[6]</K>. Der Index zählt ab 0, also ist <K>v[5]</K> das <em>sechste</em> Element, fünf Elemente nach dem Start.</>} en={<>That would be <K>v[6]</K>. The index counts from 0, so <K>v[5]</K> is the <em>sixth</em> element, five elements after the start.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>std::vector&lt;T&gt;(n, e)</K>: <K>n</K> Elemente vom Typ <K>T</K>, alle mit <K>e</K> initialisiert. <K>#include &lt;vector&gt;</K> nicht vergessen.</li>
              <li><K>v[i]</K> liest und schreibt das Element mit Index <K>i</K>. Gezählt wird ab 0: gültig sind <K>0 … n-1</K>.</li>
              <li>Ein Vektor liegt zusammenhängend im Speicher. <K>v[i]</K> liegt bei <M p=",">{t`p + s \cdot i`}</M> ein Zugriff kostet eine Multiplikation und eine Addition.</li>
              <li>Sieb: Einen Vektor von Wahrheitswerten als «gestrichen»-Merkzettel benutzen; innere Schleife in Schritten von <K>i</K>.</li>
            </ul>}
            en={<ul>
              <li><K>std::vector&lt;T&gt;(n, e)</K>: <K>n</K> elements of type <K>T</K>, all initialized with <K>e</K>. Do not forget <K>#include &lt;vector&gt;</K>.</li>
              <li><K>v[i]</K> reads and writes the element with index <K>i</K>. Counting starts at 0: valid are <K>0 … n-1</K>.</li>
              <li>A vector lies contiguously in memory. <K>v[i]</K> lies at <M p=",">{t`p + s \cdot i`}</M> an access costs one multiplication and one addition.</li>
              <li>Sieve: use a vector of truth values as a “crossed out” memo; inner loop in steps of <K>i</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Welche Arten gibt es, einen Vektor anzulegen? Was passiert bei einem Zugriff ausserhalb der Grenzen? Und warum kann <K>v.size() - 1</K> gefährlich sein? (Skript S. 99–102)</p>}
          en={<p className="connections"><b>Next:</b> what ways are there to create a vector? What happens with an access outside the bounds? And why can <K>v.size() - 1</K> be dangerous? (notes pp. 99–102)</p>}
        />
      </Section>
    </article>
  );
}
