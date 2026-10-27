import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CompileFail } from '../viz/info/ControlFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I5Rueckgabe() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Referenzen können nicht nur in die Funktion hinein, sondern auch aus ihr heraus gehen. Das erlaubt Dinge wie <K>wrap_at(v, 6) = 6</K>: ein Funktionsaufruf links vom Gleichheitszeichen. Es birgt aber die gefährlichste Falle dieses Kapitels. Am Ende sehen wir <K>const T&amp;</K>, die Regel für fast alle Parameter, die keine Zahlen sind.</p>}
        en={<p className="lede">References can go not only into a function but also out of it. That allows things like <K>wrap_at(v, 6) = 6</K>: a function call left of the equals sign. But it holds the most dangerous trap of this chapter. At the end we see <K>const T&amp;</K>, the rule for almost all parameters that are not numbers.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="rueck" title={<T de="1. Rückgabe per Referenz" en="1. Return by reference" />}>
        <Box kind="lecture" src={<Src p="109–110" />} title={<T de="Wozu eine Referenz als Rückgabetyp?" en="Why a reference as return type?" />}>
          <T
            de={<>
              <p>Referenztypen kann man an vielen Stellen in C++ verwenden, sogar für den Rückgabetyp einer Funktion. Wozu ist das gut, und wo sind die Grenzen? Wir nehmen das Beispiel von vorhin, diesmal mit einem Rückgabewert (Beispiel 8.5): <K>int increment(int&amp; i) {'{ ++i; return i; }'}</K>. Damit kann man das Ergebnis des Erhöhens ausgeben: <K>std::cout &lt;&lt; increment(i)</K>.</p>
              <p>Was, wenn wir die Funktion <em>wiederholt</em> anwenden wollten, also <K>increment(increment(i))</K>? Das würde verlangen, dass <K>increment</K> einen L-Wert zurückgibt, sie gibt aber einen R-Wert zurück. Mit Referenztypen kann man einen L-Wert zurückgeben (Beispiel 8.6):</p>
              <Code code={'int& inc(int& i) {\n  i = i + 1;\n  return i;\n}'} />
              <p>Jetzt ist auch der Rückgabetyp ein Referenztyp. Das nennen wir <b>Rückgabe per Referenz</b>. Der Funktionsaufruf selbst ist jetzt ein L-Wert. Der Aufruf <K>inc(x)</K> hat genau die Semantik des Prä-Inkrements <K>++x</K>.</p>
            </>}
            en={<>
              <p>Reference types can be used in many places in C++, even for the return type of a function. How can this be useful, and what are the limits? We take on the example from before, this time with a return value (Example 8.5): <K>int increment(int&amp; i) {'{ ++i; return i; }'}</K>. Now we can also output the result of incrementing a variable: <K>std::cout &lt;&lt; increment(i)</K>.</p>
              <p>What if we wanted to apply the function <em>repeatedly</em>, i.e. <K>increment(increment(i))</K>? This would require that <K>increment</K> returns an L-value, but it currently returns an R-value. Using reference types it is possible to return an L-value (Example 8.6):</p>
              <Code code={'int& inc(int& i) {\n  i = i + 1;\n  return i;\n}'} />
              <p>Now even the return type is a reference type. We call this <b>return by reference</b>. The function call itself is now an L-value. The function call <K>inc(x)</K> has exactly the semantics of the pre-increment <K>++x</K>.</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.incByValueErr} label={tr('Rückgabe per Wert: das Ergebnis ist ein R-Wert, kein Platz', 'Return by value: the result is an R-value, not a place')} />
        <Tracer stack prog={P.incNested} label={tr('Rückgabe per Referenz: inc(inc(x))', 'Return by reference: inc(inc(x))')} />
        <T
          de={<>
            <p><b>Der Ablauf, genau gelesen.</b> Das innere <K>inc(x)</K> läuft zuerst: Es erhöht <K>x</K> auf 1 und gibt <em>die Variable <K>x</K> selbst</em> zurück, nicht eine Kopie. Dieses Ergebnis ist ein Platz, also darf es das Argument des äusseren <K>inc</K> sein, dessen Parameter <K>i</K> damit wieder ein Alias von <K>x</K> wird. Nach beiden Aufrufen ist <K>x</K> gleich 2. Mit <K>int increment(int&amp;)</K> (Rückgabe per Wert) hätte der innere Aufruf nur den <em>Wert</em> 1 geliefert, und der äussere könnte keinen Platz binden: der Fehler oben.</p>
          </>}
          en={<>
            <p><b>The run, read closely.</b> The inner <K>inc(x)</K> runs first: it raises <K>x</K> to 1 and returns <em>the variable <K>x</K> itself</em>, not a copy. This result is a place, so it may be the argument of the outer <K>inc</K>, whose parameter <K>i</K> then becomes an alias of <K>x</K> again. After both calls <K>x</K> equals 2. With <K>int increment(int&amp;)</K> (return by value) the inner call would have delivered only the <em>value</em> 1, and the outer one could not bind a place: the error above.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="wrap" title={<T de="2. Ein besseres Beispiel: wrap_at" en="2. A better example: wrap_at" />}>
        <Box kind="lecture" src={<Src p="110–111" />} title={<T de="Zugriff mit Umbruch" en="Access with wrap-around" />}>
          <T
            de={<>
              <p><b>Ein anderes Beispiel.</b> Das Beispiel des Inkrements wirkt etwas künstlich; wir haben es wegen seiner Einfachheit gewählt. Um die Nützlichkeit der Rückgabe per Referenz besser zu motivieren, nehmen wir ein anderes. Gegeben sei ein Vektor <K>v = {'{0, 1, 2, 3}'}</K>. Wir wollen eine Funktion anbieten, die auf Elemente von <K>v</K> an einem Index <K>i</K> zugreift, mit <b>Umbruch</b> (<span lang="en">wrap-around</span>) der Indizes. So etwas ist nützlich, um Randbedingungen aller Art festzulegen.</p>
              <p><K>wrap_at(v, i)</K> greift auf den Vektor <K>v</K> beim Index <K>i % v.size()</K> zu. Also <K>wrap_at(v,4)</K> ist <K>v[0]</K>, <K>wrap_at(v,5)</K> ist <K>v[1]</K>, <K>wrap_at(v,8)</K> wieder <K>v[0]</K>.</p>
            </>}
            en={<>
              <p><b>A different example.</b> The previous increment example might feel a bit artificial; we chose it for its simplicity. In order to better motivate the usefulness of the return by reference semantics, we continue with a different example. Consider a vector <K>v = {'{0, 1, 2, 3}'}</K> and assume we want to offer a function to access elements of <K>v</K> at index <K>i</K> with <b>wrap-around</b> semantics for the indices. Such functionality can be useful in order to define boundary conditions of all kinds.</p>
              <p><K>wrap_at(v, i)</K> accesses the vector <K>v</K> at the index <K>i % v.size()</K>. So <K>wrap_at(v,4)</K> is <K>v[0]</K>, <K>wrap_at(v,5)</K> is <K>v[1]</K>, <K>wrap_at(v,8)</K> is <K>v[0]</K> again.</p>
            </>}
          />
        </Box>
        <table className="plain">
          <thead><tr><th><K>i</K></th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th></tr></thead>
          <tbody><tr><td><K>i % 4</K></td><td>0</td><td>1</td><td>2</td><td>3</td><td>0</td><td>1</td><td>2</td><td>3</td><td>0</td><td>1</td><td>2</td><td>3</td></tr></tbody>
        </table>
        <T
          de={<p>Die Zeile unten ist der Index, auf den tatsächlich zugegriffen wird: Der Rest der Division bildet jede ganze Zahl auf den gültigen Bereich <K>0 … 3</K> ab, immer im Kreis. (Für negative Indizes wäre der Rest negativ; die Funktion setzt <K>index &gt;= 0</K> voraus. Das ist ihre Vorbedingung.)</p>}
          en={<p>The bottom row is the index that is actually accessed: the remainder of the division maps every integer onto the valid range <K>0 … 3</K>, going round in a circle. (For negative indices the remainder would be negative; the function assumes <K>index &gt;= 0</K>. That is its precondition.)</p>}
        />
        <Box kind="lecture" src={<Src p="110–111" />} title={<T de="Nur lesen: Rückgabe per Wert" en="Read only: return by value" />}>
          <T
            de={<p>Die Funktionalität lässt sich zum <em>Lesen</em> von Elementen so umsetzen: <K>int wrap_at(std::vector&lt;int&gt;&amp; vec, int index) {'{ return vec[index % vec.size()]; }'}</K>, mit dem Nachteil, dass wir nicht in die Indizes <em>schreiben</em> können: <K>wrap_at(v, 6) = 6;</K> ist ein Compilerfehler (<K>lvalue required as left operand of assignment</K>), weil <K>wrap_at</K> einen R-Wert zurückgibt, keinen L-Wert.</p>}
            en={<p>The functionality can be implemented for <em>reading</em> elements like this: <K>int wrap_at(std::vector&lt;int&gt;&amp; vec, int index) {'{ return vec[index % vec.size()]; }'}</K>, with the disadvantage that we cannot <em>write</em> to the indices: <K>wrap_at(v, 6) = 6;</K> is a compiler error (<K>lvalue required as left operand of assignment</K>), because <K>wrap_at</K> returns an R-value, not an L-value.</p>}
          />
        </Box>
        <CompileFail prog={P.wrapAtReadOnlyErr} label={tr('Zuweisung an einen R-Wert', 'Assignment to an R-value')} />
        <Box kind="lecture" src={<Src p="111" />} title={<T de="Lesen und Schreiben: Rückgabe per Referenz" en="Read and write: return by reference" />}>
          <T
            de={<p>Wie beim <K>inc</K>-Beispiel braucht es nur <em>ein</em> <K>&amp;</K> (Beispiel 8.10): <K>int&amp; wrap_at(…)</K>. Jetzt funktioniert es: <K>wrap_at(v, 6) = 6;</K> schreibt in <K>v[2]</K>, und danach liefert <K>wrap_at(v, 2)</K> den Wert 6. Rückgabe per Referenz liefert einen L-Wert.</p>}
            en={<p>As in the <K>inc</K> example, only <em>one</em> <K>&amp;</K> is needed (Example 8.10): <K>int&amp; wrap_at(…)</K>. Now it works: <K>wrap_at(v, 6) = 6;</K> writes to <K>v[2]</K>, and afterwards <K>wrap_at(v, 2)</K> yields the value 6. Return by reference returns an L-value.</p>}
          />
        </Box>
        <Tracer stack prog={P.wrapAt} label={tr('wrap_at mit Rückgabe per Referenz', 'wrap_at with return by reference')} />
        <T
          de={<p>Verfolge den Aufruf <K>wrap_at(v, 6) = 6</K>: Die Funktion berechnet <K>6 % 4 = 2</K> und gibt <em>das Kästchen <K>v[2]</K> selbst</em> zurück. Der Aufruf <em>ist</em> dieses Kästchen, und die Zuweisung füllt es mit 6. In der Tabelle von <K>main</K> siehst du das Kästchen mit Index 2 aufleuchten. Genau so funktioniert auch <K>vec[i] = x</K>: Der Indexoperator <em>gibt per Referenz zurück</em>.</p>}
          en={<p>Follow the call <K>wrap_at(v, 6) = 6</K>: the function computes <K>6 % 4 = 2</K> and returns <em>the box <K>v[2]</K> itself</em>. The call <em>is</em> that box, and the assignment fills it with 6. In the table of <K>main</K> you see the box with index 2 light up. This is exactly how <K>vec[i] = x</K> works too: the index operator <em>returns by reference</em>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="zombie" title={<T de="3. Die Falle: ein Alias auf etwas Totes" en="3. The trap: an alias of something dead" />}>
        <Box kind="lecture" src={<Src p="111" />} title={<T de="Temporäre Objekte" en="Temporary objects" />}>
          <T
            de={<>
              <p>Was ist an dem folgenden Code falsch?</p>
              <Code code={'int& foo(int i) {\n  return i;\n}'} />
              <p>Die Funktion gibt einen L-Wert auf ein Objekt zurück, das gleich stirbt:</p>
              <Code code={'int k = 3;\nint& j = foo(k); // j is an alias of a zombie\nstd::cout << j;  // undefined behavior!'} />
              <p>Dieses Beispiel zeigt die Gefahr der Rückgabe per Referenz.</p>
              <p><b>Referenz-Richtlinie.</b> Wenn eine Referenz erzeugt wird, muss das referenzierte Objekt mindestens so lange leben wie die Referenz selbst.</p>
            </>}
            en={<>
              <p>What is wrong about the following code?</p>
              <Code code={'int& foo(int i) {\n  return i;\n}'} />
              <p>The function returns an L-value of an object that is about to become dead:</p>
              <Code code={'int k = 3;\nint& j = foo(k); // j is an alias of a zombie\nstd::cout << j;  // undefined behavior!'} />
              <p>This example shows the danger of return by reference.</p>
              <p><b>Reference guideline.</b> When a reference is created, the object referred to must stay alive at least as long as the reference itself.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was hier schiefgeht, mit den Bildern aus der Lektion über Aufrufe.</b> Der Parameter <K>i</K> ist eine <em>Kopie</em> von <K>k</K> und liegt im Rahmen von <K>foo</K> auf dem Stapel. <K>return i;</K> gibt einen Alias auf <em>dieses</em> Kästchen heraus. Aber kaum ist <K>foo</K> fertig, wird sein Rahmen abgebaut, und der Speicher gehört bald jemand anderem. <K>j</K> zeigt auf eine Stelle, an der vielleicht noch eine 3 steht, vielleicht auch nicht. Das ist undefiniertes Verhalten: Im Test sieht es oft «richtig» aus, bis es plötzlich nicht mehr stimmt.</p>
            <p>Der Compiler kann hier helfen: <K>g++ -Wall</K> meldet <K>reference to local variable 'i' returned</K> (der Test in diesem Projekt prüft das). Eine Warnung, die du nicht überlesen darfst.</p>
          </>}
          en={<>
            <p><b>What goes wrong here, with the pictures from the lesson on calls.</b> The parameter <K>i</K> is a <em>copy</em> of <K>k</K> and lies in the frame of <K>foo</K> on the stack. <K>return i;</K> hands out an alias of <em>that</em> box. But hardly is <K>foo</K> finished, its frame is dismantled, and the memory soon belongs to someone else. <K>j</K> points to a place where perhaps a 3 still stands, perhaps not. That is undefined behavior: in a test it often looks “right” until suddenly it is not.</p>
            <p>The compiler can help here: <K>g++ -Wall</K> reports <K>reference to local variable 'i' returned</K> (this project’s test checks that). A warning you must not overlook.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="112" />} title={<T de="Wann Referenzen sinnvoll sind" en="When references make sense" />}>
          <T
            de={<p>Übergabe per Referenz kann man verwenden, um Wirkungen auf die Argumente beim Aufrufer zu ermöglichen (Beispiel <K>swap</K>). Ausserdem, um das Kopieren von Daten zu vermeiden, was die Leistung verbessert. Rückgabe per Referenz kann man verwenden, wenn der Rückgabewert einer Funktion ein L-Wert sein soll, zum Beispiel Indizes von Vektoren (<K>vec[i]=x</K>, <K>wrap_at(vec,i)=x</K>), mehr Anwendungen später im Kapitel über dynamische Datenstrukturen.</p>}
            en={<p>Pass by reference can be used in order to enable effects on the arguments at the call site (example <K>swap</K>). Moreover it can be used in order to avoid copying data, leading to improved performance. Return by reference can be used when the return value of a function should be an L-value, e.g. indices of vectors (<K>vec[i]=x</K>, <K>wrap_at(vec,i)=x</K>), more applications later in the chapter on dynamic data structures.</p>}
          />
        </Box>
        <Box kind="tip" title={<T de="Rückgabe per Referenz sicher benutzen" en="Using return by reference safely" />}>
          <T
            de={<ul>
              <li><b>Standard ist Rückgabe per Wert.</b> Gib nur dann <K>T&amp;</K> zurück, wenn der Aufrufer ausdrücklich <em>in</em> etwas schreiben soll, das <em>weiterlebt</em>.</li>
              <li><b>Prüfe die Herkunft:</b> Zeigt das zurückgegebene <K>T&amp;</K> auf einen <em>Referenzparameter</em> (wie <K>vec</K> bei <K>wrap_at</K>) oder auf ein Element eines solchen Parameters? Dann lebt es länger als der Aufruf: sicher. Zeigt es auf eine <em>lokale Variable</em> oder einen <em>Wertparameter</em>? Dann ist es ein Zombie.</li>
              <li><b>Behandle diese Compilerwarnung als Fehler:</b> <K>reference to local variable returned</K>.</li>
            </ul>}
            en={<ul>
              <li><b>The default is return by value.</b> Return <K>T&amp;</K> only if the caller is explicitly meant to write <em>into</em> something that <em>lives on</em>.</li>
              <li><b>Check the origin:</b> does the returned <K>T&amp;</K> point to a <em>reference parameter</em> (like <K>vec</K> in <K>wrap_at</K>) or to an element of one? Then it outlives the call: safe. Does it point to a <em>local variable</em> or a <em>value parameter</em>? Then it is a zombie.</li>
              <li><b>Treat this compiler warning as an error:</b> <K>reference to local variable returned</K>.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Welche dieser Funktionen ist <em>sicher</em>?</>} en={<>Which of these functions is <em>safe</em>?</>} />}
          choices={[
            { text: <K>{'int& first(std::vector<int>& v) { return v[0]; }'}</K>, correct: true, why: <T de={<>Richtig: <K>v</K> ist selbst eine Referenz auf den Vektor des Aufrufers, und <K>v[0]</K> ist ein Element <em>dieses</em> Vektors. Beides lebt nach dem Aufruf weiter.</>} en={<>Correct: <K>v</K> is itself a reference to the caller’s vector, and <K>v[0]</K> is an element of <em>that</em> vector. Both live on after the call.</>} /> },
            { text: <K>{'int& big() { int x = 1000; return x; }'}</K>, why: <T de={<><K>x</K> ist eine lokale Variable. Sie verschwindet mit dem Ende von <K>big</K>, die Referenz zeigt auf ein Zombie-Kästchen.</>} en={<><K>x</K> is a local variable. It disappears at the end of <K>big</K>, the reference points to a zombie box.</>} /> },
            { text: <K>{'int& first(std::vector<int> v) { return v[0]; }'}</K>, why: <T de={<>Hier ist <K>v</K> ein <em>Wertparameter</em>: eine Kopie des Vektors, die mit dem Aufruf verschwindet. <K>v[0]</K> gehört zur Kopie, nicht zum Original.</>} en={<>Here <K>v</K> is a <em>value parameter</em>: a copy of the vector that disappears with the call. <K>v[0]</K> belongs to the copy, not the original.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="const" title={<T de="4. const-Referenzen" en="4. Const references" />}>
        <Box kind="lecture" src={<Src p="112–113" />} title={<T de="Ein scheinbarer Widerspruch" en="A seeming paradox" />}>
          <T
            de={<>
              <p>Referenzen können sogar als <K>const</K>-Parameter übergeben werden, was auf den ersten Blick paradox wirkt. Motivation: Der Durchschnitt der Elemente eines Vektors (Beispiel 8.12). Wir übergeben per Referenz, damit der möglicherweise riesige Vektor bei jedem Aufruf nicht kopiert werden muss. Das funktioniert gut.</p>
              <p>Wir wollen der <b>const-Korrektheit</b> folgen und machen deshalb den Vektor <K>const</K>. Jetzt funktioniert das Beispiel nicht mehr (Compilerfehler). Warum? Der Compiler kann nicht wissen, dass die Funktion <K>average</K> die Daten zufällig nicht ändert, ohne die Funktion zu untersuchen. Dasselbe gilt für den Benutzer (uns): Ohne die Funktion anzusehen, wissen wir nicht, dass sie die Daten unangetastet lässt. Schliesslich waren Referenzen ursprünglich dazu gedacht, Daten zu ändern!</p>
            </>}
            en={<>
              <p>As it will turn out, references can even be passed as <K>const</K> parameters, which seems paradoxical at first sight. Motivation: computing the average of a vector (Example 8.12). We use pass by reference because we want to avoid that the potentially huge vector needs to be copied with each call. Using the function works fine in this case.</p>
              <p>We want to follow the <b>const-correctness</b> rule and therefore make the vector <K>const</K>. Now the example does not work any more (compiler error). Why? The compiler cannot know that the function <K>average</K> happens to not change the data without inspecting the function. The same is true for the user (us): without inspecting the function, we cannot know that it leaves the data intact. After all, references initially were intended to change the data!</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.averageNonConstErr} label={tr('Ein const-Vektor passt nicht zu einem T&-Parameter', 'A const vector does not fit a T& parameter')} />
        <Box kind="lecture" src={<Src p="113" />} title={<T de="Die Lösung: Übergabe per const-Referenz" en="The solution: pass by const reference" />}>
          <T
            de={<>
              <p>Die Lösung: Wir markieren den Referenzparameter zusätzlich als <K>const</K>, also Übergabe per <b>const-Referenz</b> (Beispiel 8.15): <K>double average(const std::vector&lt;double&gt;&amp; values)</K>. Jetzt funktioniert das obige Beispiel einwandfrei.</p>
              <p>Indem wir den Parameter als <K>const</K> (Referenz) deklarieren, geben wir das Versprechen ab, die Daten nicht zu ändern. Der Compiler (und wir) können sich darauf verlassen, denn es wird geprüft: Der Compiler lehnt Code ab, der das Objekt möglicherweise ändern könnte.</p>
            </>}
            en={<>
              <p>The solution: we mark the reference parameter <K>const</K> in addition, leading to a pass by <b>const reference</b> (Example 8.15): <K>double average(const std::vector&lt;double&gt;&amp; values)</K>. Now the example from above works flawlessly.</p>
              <p>By declaring the parameter a <K>const</K> (reference) we make the promise that we will not change the data. The compiler (and we) can rely on this promise because it is checked: the compiler refuses to admit code that could potentially modify the object.</p>
            </>}
          />
        </Box>
        <Listing prog={P.averageConstRef} label={tr('Beispiel 8.15: Ausgabe 9.7', 'Example 8.15: output 9.7')} />
        <CompileFail prog={P.constRefWrite} label={tr('Das Versprechen wird vom Compiler überwacht', 'The promise is policed by the compiler')} />
        <Box kind="lecture" src={<Src p="113" />} title={<T de="Initialisierung und Regel" en="Initialization and rule" />}>
          <T
            de={<>
              <p>Const-Referenzen haben den Typ <K>const T&amp;</K>, zu lesen als <K>(const T)&amp;</K>. Mit der Initialisierung <K>const T&amp; r = lvalue;</K> wird <K>r</K> mit der Adresse von <K>lvalue</K> initialisiert (effizient).</p>
              <p>Const-Referenzen können sogar mit <em>R-Werten</em> initialisiert werden: Der Compiler erzeugt ein temporäres Objekt mit ausreichender Lebensdauer. Bei <K>const T&amp; r = rvalue;</K> wird <K>r</K> mit der Adresse eines temporären Objekts mit dem Wert initialisiert (pragmatisch).</p>
              <p><b>Wann <K>const T&amp;</K>?</b> Const-Referenzen verwendet man in allen Situationen, in denen potenziell grosse Objekte an eine Funktion übergeben werden und die Funktion keinen Nebeneffekt auf die Argumente des Aufrufers haben soll.</p>
              <p><b>Regel (Übergabe per Nur-Lese-Referenz):</b> Deklariere Funktionsargumente, deren Typ kein fundamentaler Typ ist, wenn möglich als <K>const T&amp;</K>. Das ist sowohl effizient als auch sicher.</p>
            </>}
            en={<>
              <p>Const references have type <K>const T&amp;</K>, which can be interpreted as <K>(const T)&amp;</K>. With the initialization <K>const T&amp; r = lvalue;</K>, <K>r</K> is initialized with the address of <K>lvalue</K> (efficient).</p>
              <p>Const references can even be initialized with <em>R-values</em>: the compiler generates a temporary object with sufficient lifetime. With <K>const T&amp; r = rvalue;</K>, <K>r</K> is initialized with the address of a temporary object with the value (pragmatic).</p>
              <p><b>When to use <K>const T&amp;</K>.</b> Const references can be used in all kinds of situations where potentially large objects are passed to a function and the function is not supposed to have a side effect on the caller’s arguments.</p>
              <p><b>Rule (pass by read-only reference):</b> if possible, declare function argument types that are not fundamental types as <K>const T&amp;</K>, which is both efficient and safe.</p>
            </>}
          />
        </Box>
        <Listing prog={P.constRefTemp} label={tr('Eine const-Referenz auf einen R-Wert: ein temporäres Objekt', 'A const reference to an R-value: a temporary object')} />
        <T
          de={<p>Der Wert <K>2 + 3</K> hat keinen Platz, aber die const-Referenz <K>r</K> bekommt einen: den des temporären Objekts, das der Compiler anlegt und so lange leben lässt wie <K>r</K>. Weil <K>r</K> <K>const</K> ist, kann niemand das Temporäre verändern, deshalb ist das ungefährlich. Das ist auch der Grund, warum man einer Funktion mit <K>const std::vector&lt;double&gt;&amp;</K>-Parameter direkt ein Literal oder ein Rechenergebnis übergeben darf, einer mit <K>std::vector&lt;double&gt;&amp;</K> nicht.</p>}
          en={<p>The value <K>2 + 3</K> has no place, but the const reference <K>r</K> gets one: that of the temporary object that the compiler creates and keeps alive as long as <K>r</K>. Because <K>r</K> is <K>const</K>, nobody can change the temporary, which makes it harmless. This is also why one may pass a literal or a calculation result directly to a function with a <K>const std::vector&lt;double&gt;&amp;</K> parameter, but not to one with <K>std::vector&lt;double&gt;&amp;</K>.</p>}
        />
        <table className="plain">
          <thead><tr><th>{tr('Ich will …', 'I want …')}</th><th>{tr('Parameter', 'Parameter')}</th></tr></thead>
          <tbody>
            <tr><td>{tr('eine Zahl lesen (int, double, bool …)', 'read a number (int, double, bool …)')}</td><td><K>int x</K></td></tr>
            <tr><td>{tr('ein grosses Objekt nur lesen (Vektor …)', 'only read a large object (vector …)')}</td><td><K>const std::vector&lt;int&gt;&amp; v</K></td></tr>
            <tr><td>{tr('die Variable des Aufrufers ändern', 'change the caller’s variable')}</td><td><K>int&amp; x</K></td></tr>
            <tr><td>{tr('mit einer Kopie arbeiten und sie verändern', 'work on a copy and modify it')}</td><td><K>std::vector&lt;int&gt; v</K></td></tr>
          </tbody>
        </table>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Rückgabe per Referenz (<K>T&amp; f(…)</K>) gibt einen L-Wert zurück: Der Aufruf kann links von <K>=</K> stehen. So arbeitet auch <K>v[i]</K>.</li>
              <li>Das referenzierte Objekt muss länger leben als die Referenz. Eine Referenz auf eine lokale Variable oder einen Wertparameter ist ein Zombie (undefiniertes Verhalten).</li>
              <li><K>const T&amp;</K>: effizient (keine Kopie) und sicher (der Compiler überwacht, dass nichts geändert wird). Kann sogar an R-Werte binden (temporäres Objekt).</li>
              <li>Regel: Argumente, die keine fundamentalen Typen sind und nur gelesen werden, als <K>const T&amp;</K>.</li>
            </ul>}
            en={<ul>
              <li>Return by reference (<K>T&amp; f(…)</K>) returns an L-value: the call may stand left of <K>=</K>. This is also how <K>v[i]</K> works.</li>
              <li>The referenced object must live longer than the reference. A reference to a local variable or a value parameter is a zombie (undefined behavior).</li>
              <li><K>const T&amp;</K>: efficient (no copy) and safe (the compiler polices that nothing is changed). Can even bind to R-values (temporary object).</li>
              <li>Rule: arguments that are not fundamental types and are only read: <K>const T&amp;</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Damit sind die Werkzeuge für <em>Daten</em> beisammen: Vektoren und Referenzen. Das nächste Kapitel schaut auf <em>einzelne Zeichen</em>: Wie speichert ein Rechner Text, und wie rechnet man mit Buchstaben (ASCII, UTF-8, der Caesar-Chiffre)?</p>}
          en={<p className="connections"><b>Next:</b> the tools for <em>data</em> are now together: vectors and references. The next chapter looks at <em>single characters</em>: how does a computer store text, and how does one calculate with letters (ASCII, UTF-8, the Caesar cipher)?</p>}
        />
      </Section>
    </article>
  );
}
