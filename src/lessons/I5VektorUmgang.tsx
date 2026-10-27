import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I5VektorUmgang() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Vektor ist schnell angelegt und noch schneller falsch benutzt. Diese Lektion zeigt vier Arten, einen Vektor zu füllen, was bei einem Zugriff ausserhalb der Grenzen wirklich passiert (nichts Gutes), wie man sich dagegen wappnet, und eine Falle bei <K>size()</K>, in die auch Erfahrene tappen.</p>}
        en={<p className="lede">A vector is quickly created and even more quickly misused. This lesson shows four ways to fill a vector, what really happens with an access outside the bounds (nothing good), how to arm yourself against it, and a trap with <K>size()</K> that even experienced programmers fall into.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="anlegen" title={<T de="1. Vektoren anlegen" en="1. Creating vectors" />}>
        <Box kind="lecture" src={<Src p="99–100" />} title={<T de="Initialisieren" en="Initializing" />}>
          <T
            de={<>
              <p>Vektoren können auf verschiedene Weisen initialisiert werden. Einige Beispiele:</p>
              <ul>
                <li><K>std::vector&lt;int&gt; fivezeros = std::vector&lt;int&gt;(5);</K> Die fünf Elemente werden mit 0 initialisiert.</li>
                <li><K>std::vector&lt;int&gt; fivetwos = std::vector&lt;int&gt;(5, 2);</K> Die fünf Elemente werden mit 2 initialisiert.</li>
                <li><K>std::vector&lt;int&gt; countdown = {'{5, 4, 3, 2, 1}'};</K> Der Vektor wird direkt mit einer Liste von Werten initialisiert.</li>
                <li><K>std::vector&lt;int&gt; empty;</K> Deklariert und initialisiert einen leeren Vektor.</li>
              </ul>
            </>}
            en={<>
              <p>Vectors can be initialized in different ways. Here are a few examples:</p>
              <ul>
                <li><K>std::vector&lt;int&gt; fivezeros = std::vector&lt;int&gt;(5);</K> The five elements are initialized with 0.</li>
                <li><K>std::vector&lt;int&gt; fivetwos = std::vector&lt;int&gt;(5, 2);</K> The five elements are initialized with 2.</li>
                <li><K>std::vector&lt;int&gt; countdown = {'{5, 4, 3, 2, 1}'};</K> The vector is initialized with a list of values directly.</li>
                <li><K>std::vector&lt;int&gt; empty;</K> Declares and initializes an empty vector.</li>
              </ul>
            </>}
          />
        </Box>
        <Tracer prog={P.vecInit} label={tr('Die vier Arten', 'The four ways')} />
        <T
          de={<p>Gehe die vier Deklarationen durch und achte auf die Kästchen: Beim zweiten Vektor ist <em>jedes</em> Element 2, beim dritten stehen die Werte der Liste in der Reihenfolge, wie sie geschrieben sind (<K>countdown[2]</K> ist 3, das <em>dritte</em> Element), und der leere Vektor hat gar keine Kästchen. Merke die Falle in <K>std::vector&lt;int&gt;(5, 2)</K>: Die <em>erste</em> Zahl ist die Länge, die zweite der Wert, also fünf Zweier und nicht zwei Fünfer. Die Liste <K>{'{5, 2}'}</K> dagegen hätte genau zwei Elemente.</p>}
          en={<p>Step through the four declarations and watch the boxes: in the second vector <em>every</em> element is 2, in the third the values of the list stand in the order in which they are written (<K>countdown[2]</K> is 3, the <em>third</em> element), and the empty vector has no boxes at all. Remember the trap in <K>std::vector&lt;int&gt;(5, 2)</K>: the <em>first</em> number is the length, the second the value, so five twos and not two fives. The list <K>{'{5, 2}'}</K>, on the other hand, would have exactly two elements.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="push" title={<T de="2. Schreiben, Wachsen, Messen" en="2. Writing, growing, measuring" />}>
        <Box kind="lecture" src={<Src p="100" />} title={<T de="Funktionalität" en="Functionality" />}>
          <T
            de={<p>Vektoren bieten viel Funktionalität. Zwei Beispiele: <K>v.push_back(-1);</K> hängt den Wert <K>-1</K> an (am Ende hinzugefügt), und <K>v.size()</K> liefert die Grösse (Anzahl der Elemente) des Vektors. Weitere Beispiele folgen später im Kurs; eine umfassende Beschreibung steht bei cppreference.</p>}
            en={<p>Vectors offer a great deal of functionality. Two examples: <K>v.push_back(-1);</K> appends the value <K>-1</K> (added at the end), and <K>v.size()</K> yields the size (number of elements) of the vector. We will see more examples later in the course; a comprehensive description is available at cppreference.</p>}
          />
        </Box>
        <Tracer prog={P.vecWrite} label={tr('Schreiben und Anhängen', 'Writing and appending')} />
        <T
          de={<p>Beachte, dass <K>push_back</K> den Vektor <em>verlängert</em>: Ein neues Kästchen erscheint am Ende, das als geändert markiert ist, und <K>v.size()</K> liefert danach 4. Das Verlängern geht nur am Ende. <K>v[1] = 25</K> dagegen ändert nur ein vorhandenes Kästchen. Wer ein Element mit <K>v[4] = 0</K> «anhängen» will, schreibt ausserhalb des Vektors: Das ist der nächste Abschnitt.</p>}
          en={<p>Note that <K>push_back</K> <em>lengthens</em> the vector: a new box appears at the end, marked as changed, and <K>v.size()</K> returns 4 afterwards. Lengthening is possible only at the end. <K>v[1] = 25</K>, in contrast, changes only an existing box. Whoever wants to “append” an element with <K>v[4] = 0</K> writes outside the vector: that is the next section.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="grenzen" title={<T de="3. Ausserhalb der Grenzen" en="3. Outside the bounds" />}>
        <Box kind="lecture" src={<Src p="100" />} title={<T de="Achtung: undefiniertes Verhalten" en="Attention: undefined behavior" />}>
          <T
            de={<>
              <p>Der Zugriff auf Elemente <em>ausserhalb</em> der gültigen Grenzen eines Vektors führt in C++ zu <b>undefiniertem Verhalten</b>. Beispiel 7.5: Der Vektor hat 10 Elemente (Indizes 0 bis 9), die Schleife läuft aber bis <K>i &lt;= 10</K>, schreibt also auch in <K>vec[10]</K>.</p>
              <p><b>Prüfung der Grenzen:</b> Beim Indexoperator ist es allein Aufgabe des Programmierers (von uns), die Gültigkeit der Zugriffe zu prüfen.</p>
            </>}
            en={<>
              <p>Accessing elements <em>outside</em> the valid bounds of a vector leads to <b>undefined behavior</b> in C++. Example 7.5: the vector has 10 elements (indices 0 to 9), but the loop runs up to <K>i &lt;= 10</K>, so it also writes to <K>vec[10]</K>.</p>
              <p><b>Bound checks:</b> when using the subscript operator, it is the sole responsibility of the programmer (us) to check the validity of element accesses.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.vecOutOfBounds} label={tr('Beispiel 7.5', 'Example 7.5')} />
        <T
          de={<>
            <p>Der Ablauf hier ist ein <em>Modell</em>: Er hält an, sobald der Zugriff <K>vec[10]</K> kommt, und benennt den Fehler. Das echte Programm hält <em>nicht</em> an. Es schreibt einfach in die Speicherstelle <em>hinter</em> dem Vektor: <K>vec[10]</K> Was dort liegt, ist nicht bekannt, vielleicht eine andere Variable, vielleicht Verwaltungsdaten des Speichers. Das Programm kann trotzdem scheinbar normal weiterlaufen und erst später abstürzen oder falsche Ergebnisse liefern. Gerade weil nichts sofort passiert, ist der Fehler so gefährlich.</p>
            <p>Das ist die Folge der Adressrechnung der letzten Lektion: <K>v[i]</K> wird ohne Nachfrage als <K>p + s·i</K> berechnet. Der Rechner prüft nicht, ob <K>i</K> kleiner als <K>n</K> ist, denn das kostet Zeit.</p>
          </>}
          en={<>
            <p>The run here is a <em>model</em>: it stops as soon as the access <K>vec[10]</K> comes, and names the error. The real program does <em>not</em> stop. It simply writes to the memory location <em>behind</em> the vector: <K>vec[10]</K> What lies there is not known, perhaps another variable, perhaps the memory manager’s bookkeeping. The program may nevertheless seem to carry on normally and crash only later or deliver wrong results. Precisely because nothing happens at once, the error is so dangerous.</p>
            <p>It is the consequence of the address calculation of the last lesson: <K>v[i]</K> is computed as <K>p + s·i</K> without asking. The computer does not check whether <K>i</K> is smaller than <K>n</K>, because that costs time.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="100" />} title={<T de="Werkzeuge gegen den Fehler" en="Tools against the error" />}>
          <T
            de={<p>Es gibt Werkzeuge und Schalter für den Compiler, um das Verhalten etwas vorhersagbarer zu machen. Zum Beispiel kann man statt des Indexoperators die Funktion <K>at</K> verwenden, die zur Laufzeit eine Grenzprüfung einführt (ein Laufzeitfehler bei einem Zugriff ausserhalb). Mit den Compiler-Flags <K>-D_GLIBCXX_DEBUG -D_GLIBCXX_DEBUG_PEDANTIC</K> können diese Prüfungen auch für <K>[]</K> eingeführt werden. Ein Zugriff ausserhalb ist trotzdem ein schwerwiegendes Problem, das entweder unbemerkt bleiben kann oder zu einem Absturz führt.</p>}
            en={<p>There are a few tools and switches we can use with the compiler to make the behavior a bit more predictable. For instance, we can use the <K>at</K> function instead of the index operator, which introduces a bound check at runtime (resulting in a runtime error in case of an out-of-bounds access). By adding the compiler flags <K>-D_GLIBCXX_DEBUG -D_GLIBCXX_DEBUG_PEDANTIC</K>, these bound checks can be introduced for <K>[]</K> as well. An access out of bounds nevertheless is a severe problem that can either go unnoticed or lead to a crashing program.</p>}
          />
        </Box>
        <Tracer prog={P.vecAt} label={tr('v.at(10): geprüfter Zugriff', 'v.at(10): checked access')} />
        <T
          de={<>
            <p>Das echte Programm bricht hier mit der Meldung <K>terminate called after throwing an instance of 'std::out_of_range'</K> und <K>vector::_M_range_check: __n (which is 10) &gt;= this-&gt;size() (which is 10)</K> ab (der Test in diesem Projekt führt das mit g++ aus). Mit <K>-D_GLIBCXX_DEBUG</K> meldet schon <K>v[10]</K> den Fehler: <K>attempt to subscript container with out-of-bounds index 10, but container only holds 10 elements</K>.</p>
            <p>Der Preis: <K>at</K> prüft bei jedem Zugriff und ist deshalb etwas langsamer. Für Programme, die du entwickelst und testest, ist das ein guter Preis. Du <em>willst</em>, dass der Fehler laut wird.</p>
          </>}
          en={<>
            <p>The real program stops here with the message <K>terminate called after throwing an instance of 'std::out_of_range'</K> and <K>vector::_M_range_check: __n (which is 10) &gt;= this-&gt;size() (which is 10)</K> (this project’s test runs that with g++). With <K>-D_GLIBCXX_DEBUG</K> even <K>v[10]</K> reports the error: <K>attempt to subscript container with out-of-bounds index 10, but container only holds 10 elements</K>.</p>
            <p>The price: <K>at</K> checks on every access and is therefore somewhat slower. For programs you develop and test, that is a good price. You <em>want</em> the error to be loud.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Grenzfehler vermeiden" en="Avoiding bound errors" />}>
          <T
            de={<ul>
              <li><b>Schleifen über alle Elemente</b> immer mit <K>i &lt; v.size()</K> (oder besser <K>i &lt; std::ssize(v)</K>, siehe unten), nie mit einer von Hand mitgeführten Zahl, die später nicht mehr stimmt.</li>
              <li><b>Beim Entwickeln <K>at</K> oder <K>-D_GLIBCXX_DEBUG</K> verwenden</b>, beim Abgeben schnell rechnen lassen. Ein Fehler, der sofort abstürzt, ist leicht zu finden. Einer, der still falsch rechnet, kostet Stunden.</li>
              <li><b>Prüfe leere Vektoren.</b> <K>v[0]</K> auf einem leeren Vektor ist schon ausserhalb. Fragen Sie vorher <K>v.empty()</K> oder <K>v.size() &gt; 0</K>.</li>
              <li><b>Nach <K>push_back</K> haben sich Grösse und letzter Index geändert.</b> Der letzte Index ist immer <K>v.size() - 1</K>, nicht eine alte Zahl.</li>
            </ul>}
            en={<ul>
              <li><b>Loops over all elements</b> always with <K>i &lt; v.size()</K> (or better <K>i &lt; std::ssize(v)</K>, see below), never with a number kept by hand that later no longer matches.</li>
              <li><b>Use <K>at</K> or <K>-D_GLIBCXX_DEBUG</K> while developing</b>, let it compute fast when handing in. An error that crashes at once is easy to find. One that silently computes wrongly costs hours.</li>
              <li><b>Check empty vectors.</b> <K>v[0]</K> on an empty vector is already outside. Ask <K>v.empty()</K> or <K>v.size() &gt; 0</K> first.</li>
              <li><b>After <K>push_back</K> size and last index have changed.</b> The last index is always <K>v.size() - 1</K>, not an old number.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="gemischt" title={<T de="4. Vorsicht bei gemischten Ganzzahlausdrücken" en="4. Beware of mixed integer expressions" />}>
        <Box kind="lecture" src={<Src p="101" />} title={<T de="v.size() ist unsigned" en="v.size() is unsigned" />}>
          <T
            de={<>
              <p>Wirft man einen Blick in die Dokumentation des Vektortyps auf cppreference, merkt man, dass ein Teil der Funktionalität auf <b>vorzeichenlosen</b> Ganzzahltypen beruht. Zum Beispiel liefert <K>v.size()</K> einen Wert vom Typ <K>std::size_t</K>, einem vorzeichenlosen Ganzzahltyp.</p>
              <p>Damit besteht die schon besprochene Gefahr gemischter Ganzzahlausdrücke (Abschnitt 4.1.4). Beispiel 7.8, die Endlosschleife: Warum ist das eine Endlosschleife? Weil <K>a.size()</K> vorzeichenlos ist und der Ausdruck <K>a.size()-x-1</K> daher ebenfalls in eine vorzeichenlose Zahl umgewandelt wird, und die ist immer grösser oder gleich null.</p>
            </>}
            en={<>
              <p>When you look at the documentation for the vector type on cppreference, you will realise that some of its functionality is based on <b>unsigned</b> integer types. For example, <K>v.size()</K> returns a value of type <K>std::size_t</K>, which is an unsigned integer type.</p>
              <p>There is the discussed danger of mixed integer expressions (Section 4.1.4). Example 7.8, the endless loop: why is this an infinite loop? It is because <K>a.size()</K> is an unsigned integer and thus the expression <K>a.size()-x-1</K> is converted into an unsigned integer as well, and that is always greater or equal to zero.</p>
            </>}
          />
        </Box>
        <Code code={'std::vector<int> a {1,2,3};\nfor (int x = 0; a.size()-x-1 >= 0; ++x){\n    std::cout << x;\n}'} label={tr('Beispiel 7.8: Endlosschleife', 'Example 7.8: endless loop')} />
        <T
          de={<>
            <p className="keep"><b>Was der Rechner rechnet.</b> Bei <K>x = 3</K> ist <K>a.size()-x-1</K> mathematisch <K>3 - 3 - 1 = -1</K>. Aber <K>a.size()</K> ist vorzeichenlos, also wird <K>x</K> zuerst in <K>std::size_t</K> umgewandelt, und die ganze Rechnung läuft vorzeichenlos. Statt <K>-1</K> kommt die grösste vorzeichenlose Zahl heraus: <M p=",">{`2^{64} - 1`}</M> also 18 446 744 073 709 551 615 (der Test in diesem Projekt druckt <K>a.size() - 4</K> mit g++ und prüft das). Und diese Zahl ist <K>&gt;= 0</K>, wie jede vorzeichenlose Zahl. Die Bedingung bleibt wahr, für immer.</p>
            <p>Hier siehst du die Bedingung am Werk: Zur Sicherheit habe ich einen Ausstieg bei <K>x == 5</K> eingebaut, sonst liefe das Programm endlos. Die Schleife läuft weit über die drei Elemente hinaus:</p>
          </>}
          en={<>
            <p className="keep"><b>What the computer calculates.</b> At <K>x = 3</K>, <K>a.size()-x-1</K> is mathematically <K>3 - 3 - 1 = -1</K>. But <K>a.size()</K> is unsigned, so <K>x</K> is first converted to <K>std::size_t</K>, and the whole calculation runs unsigned. Instead of <K>-1</K> the largest unsigned number comes out: <M p=",">{`2^{64} - 1`}</M> i.e. 18 446 744 073 709 551 615 (this project’s test prints <K>a.size() - 4</K> with g++ and checks it). And that number is <K>&gt;= 0</K>, like every unsigned number. The condition stays true, forever.</p>
            <p>Here you see the condition at work: for safety I added an exit at <K>x == 5</K>, otherwise the program would run forever. The loop runs far beyond the three elements:</p>
          </>}
        />
        <Listing prog={P.sizeUnsigned} label={tr('Mit Notausstieg bei x == 5: die Schleife hört nicht bei 2 auf', 'With an emergency exit at x == 5: the loop does not stop at 2')} />
        <Box kind="lecture" src={<Src p="101–102" />} title={<T de="Wie man es richtig macht" en="How to do it right" />}>
          <T
            de={<>
              <p>Probleme dieser Art sind relativ selten, und bei gemischten Ganzzahlausdrücken bekommt man meist eine Compilerwarnung (wenn Warnungen eingeschaltet sind). Aber man sollte wissen: Indexbezogene Ausdrücke von Containern der Standardbibliothek sind oft vorzeichenlose Ganzzahlen. Man kann es lösen, indem man entweder die vorzeichenlose Arithmetik berücksichtigt oder explizit in vorzeichenbehaftete Typen umwandelt:</p>
              <ul>
                <li>(1) <K>x &lt; a.size()</K>: sieht natürlicher aus. Hier wird <K>x</K> in vorzeichenlos umgewandelt, was für <K>x &gt;= 0</K> gutgeht. Aber gemischte Arithmetik kann böse Folgen haben.</li>
                <li>(2) <K>int(a.size())-x-1 &gt;= 0</K>: explizite Umwandlung in <K>int</K>.</li>
                <li>(3) Seit C++20: <K>std::ssize(a)-x-1 &gt;= 0</K>. Die Standardbibliothek bietet eine Funktion, die die <em>vorzeichenbehaftete</em> Grösse liefert. Das ist die Lösung, die wir im Rest des Kurses und der Skripte verwenden.</li>
              </ul>
              <p><b>Empfehlung:</b> Um gemischte Ganzzahlausdrücke zu vermeiden, benutze <K>std::ssize(v)</K>, um die Grösse eines Vektors <K>v</K> zu erhalten. Ohne C++20 kann man <K>int(v.size())</K> verwenden.</p>
            </>}
            en={<>
              <p>These kinds of problems are relatively rare, and for mixed integer expressions you usually get a warning from the compiler (if warnings are switched on). But be aware that index-related expressions of containers in the standard library are often unsigned integers. The problems can be solved either by considering the unsigned arithmetic and making it right for it, or by explicit conversion to signed types:</p>
              <ul>
                <li>(1) <K>x &lt; a.size()</K>: looks more natural. Here <K>x</K> is converted to unsigned, which works out for <K>x &gt;= 0</K>. But mixed arithmetic can have nasty effects.</li>
                <li>(2) <K>int(a.size())-x-1 &gt;= 0</K>: explicit conversion to <K>int</K>.</li>
                <li>(3) Since C++20: <K>std::ssize(a)-x-1 &gt;= 0</K>. The standard library offers a function that returns the <em>signed</em> size. This is the solution that we will use for the remainder of this course and the lecture notes.</li>
              </ul>
              <p><b>Recommendation:</b> in order to avoid mixed integer expressions, use <K>std::ssize(v)</K> to get the size of a vector <K>v</K>. When you do not have C++20 available, you might use <K>int(v.size())</K>.</p>
            </>}
          />
        </Box>
        <Listing prog={P.sizeFixed} label={tr('Die drei Lösungen: alle geben 012 aus', 'The three solutions: all print 012')} />
        <Listing prog={P.sizeCompare} label={tr('Der Kern: a.size() - 4 >= 0 ist wahr, int(a.size()) - 4 >= 0 ist falsch', 'The core: a.size() - 4 >= 0 is true, int(a.size()) - 4 >= 0 is false')} />
        <Box kind="tip" title={<T de="Kleine Regeln gegen die Falle" en="Small rules against the trap" />}>
          <T
            de={<ul>
              <li><b>Subtrahiere nie von <K>v.size()</K>, ohne nachzudenken.</b> Bei einem leeren Vektor ist <K>v.size() - 1</K> nicht <K>-1</K>, sondern riesig. Ein Test <K>v.size() - 1 &gt;= 0</K> ist immer wahr.</li>
              <li><b>Rechne mit <K>std::ssize(v)</K></b> oder schreibe <K>i + 1 &lt; v.size()</K> statt <K>i &lt; v.size() - 1</K>: Die Addition kann nicht unter null fallen.</li>
              <li><b>Schalte Warnungen ein</b> (<K>-Wall -Wextra</K>): Der Compiler meldet viele gemischte Vergleiche.</li>
            </ul>}
            en={<ul>
              <li><b>Never subtract from <K>v.size()</K> without thinking.</b> For an empty vector <K>v.size() - 1</K> is not <K>-1</K> but huge. A test <K>v.size() - 1 &gt;= 0</K> is always true.</li>
              <li><b>Calculate with <K>std::ssize(v)</K></b> or write <K>i + 1 &lt; v.size()</K> instead of <K>i &lt; v.size() - 1</K>: the addition cannot fall below zero.</li>
              <li><b>Switch warnings on</b> (<K>-Wall -Wextra</K>): the compiler reports many mixed comparisons.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Für einen <em>leeren</em> Vektor <K>v</K>: Was ist der Wert von <K>v.size() - 1 &gt; 100</K>?</>} en={<>For an <em>empty</em> vector <K>v</K>: what is the value of <K>v.size() - 1 &gt; 100</K>?</>} />}
          choices={[
            { text: <T de={<><K>true</K>: <K>0 - 1</K> wird zur grössten vorzeichenlosen Zahl</>} en={<><K>true</K>: <K>0 - 1</K> becomes the largest unsigned number</>} />, correct: true, why: <T de={<>Richtig. <K>v.size()</K> ist 0 und vorzeichenlos, <K>0 - 1</K> ergibt also <M p=",">{`2^{64}-1`}</M> und die ist grösser als 100.</>} en={<>Correct. <K>v.size()</K> is 0 and unsigned, so <K>0 - 1</K> gives <M p=",">{`2^{64}-1`}</M> and that is larger than 100.</>} /> },
            { text: <T de={<><K>false</K>: <K>-1</K> ist nicht grösser als 100</>} en={<><K>false</K>: <K>-1</K> is not larger than 100</>} />, why: <T de={<>Das wäre die mathematische Antwort. Der Rechner rechnet hier aber vorzeichenlos: Es gibt kein <K>-1</K>.</>} en={<>That would be the mathematical answer. But the computer calculates unsigned here: there is no <K>-1</K>.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Vier Arten: <K>(n)</K> mit Nullen, <K>(n, e)</K> mit <K>e</K>, Liste <K>{'{…}'}</K>, leer. Bei <K>(5, 2)</K> ist die erste Zahl die Länge.</li>
              <li><K>push_back(x)</K> hängt hinten an; <K>size()</K> liefert die Anzahl.</li>
              <li>Zugriff ausserhalb von <K>0 … n-1</K> ist undefiniertes Verhalten: oft kein sofortiger Absturz, sondern stille Fehler. <K>at(i)</K> prüft; <K>-D_GLIBCXX_DEBUG</K> prüft auch <K>[]</K>.</li>
              <li><K>size()</K> ist vorzeichenlos: <K>v.size() - 1</K> bei leerem Vektor ist riesig. Benutze <K>std::ssize(v)</K> (oder <K>int(v.size())</K>).</li>
            </ul>}
            en={<ul>
              <li>Four ways: <K>(n)</K> with zeros, <K>(n, e)</K> with <K>e</K>, list <K>{'{…}'}</K>, empty. With <K>(5, 2)</K> the first number is the length.</li>
              <li><K>push_back(x)</K> appends at the back; <K>size()</K> returns the count.</li>
              <li>Access outside <K>0 … n-1</K> is undefined behavior: often no immediate crash but silent errors. <K>at(i)</K> checks; <K>-D_GLIBCXX_DEBUG</K> checks <K>[]</K> as well.</li>
              <li><K>size()</K> is unsigned: <K>v.size() - 1</K> for an empty vector is huge. Use <K>std::ssize(v)</K> (or <K>int(v.size())</K>).</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Tabellen und Matrizen haben zwei Indizes. Dafür verschachtelt man Vektoren: Vektoren von Vektoren (Skript S. 103–106).</p>}
          en={<p className="connections"><b>Next:</b> tables and matrices have two indices. For these one nests vectors: vectors of vectors (notes pp. 103–106).</p>}
        />
      </Section>
    </article>
  );
}
