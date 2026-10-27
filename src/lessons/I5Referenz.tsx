import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Predict } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CompileFail } from '../viz/info/ControlFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I5Referenz() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Funktion arbeitet bisher mit Kopien. Das ist sicher, aber manchmal falsch: Eine Funktion <K>swap</K>, die zwei Variablen vertauschen soll, kann das mit Kopien nicht. Die Lösung ist kein neues Konzept für Funktionen, sondern eine neue Art von Typ, die <em>Referenz</em>: ein zweiter Name für eine Variable.</p>}
        en={<p className="lede">So far a function works with copies. That is safe, but sometimes wrong: a function <K>swap</K> that is supposed to exchange two variables cannot do so with copies. The solution is not a new concept for functions but a new kind of type, the <em>reference</em>: a second name for a variable.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="swap" title={<T de="1. Das Problem: vertauschen" en="1. The problem: swapping" />}>
        <Box kind="lecture" src={<Src p="107" />} title={<T de="Wertübergabe: ein misslungener Versuch" en="Pass by value: a failed attempt" />}>
          <T
            de={<>
              <p>Standardmässig werden Parameter in C++ <b>per Wert</b> übergeben. Eine Folge zeigt das folgende Beispiel (Beispiel 8.1, ein misslungener Versuch, eine Vertauschungsfunktion zu schreiben): Die Werte der Variablen <K>a</K> und <K>b</K> werden in die Parameter <K>x</K> und <K>y</K> der Funktion <K>swap</K> kopiert. Folglich hat das korrekt arbeitende Vertauschen der Variablen <K>x</K> und <K>y</K> in <K>swap</K> keine Wirkung auf den Aufrufer.</p>
            </>}
            en={<>
              <p>By default, parameters are passed <b>by value</b> in C++. A consequence is shown with the following example (Example 8.1, a non-working attempt to implement a swap function): the values of the variables <K>a</K> and <K>b</K> are copied to the parameters <K>x</K> and <K>y</K> in the function <K>swap</K>. Consequently, the correctly working swapping of the variables <K>x</K> and <K>y</K> in <K>swap</K> does not have an effect on the caller.</p>
            </>}
          />
        </Box>
        <Tracer stack prog={P.swapByValue} label={tr('Beispiel 8.1: vertauscht wird nur die Kopie', 'Example 8.1: only the copy is swapped')} />
        <T
          de={<p>Gehe bis ans Ende von <K>swap</K> und vergleiche die beiden Kästen: In <K>swap</K> stehen <K>x = 1</K> und <K>y = 2</K>, die Vertauschung hat dort also geklappt, in <K>main</K> aber stehen weiterhin <K>a = 2</K> und <K>b = 1</K>. Mit <K>return</K> verschwindet der Kasten von <K>swap</K> samt der vertauschten Kopien. Die Ausgabe von <K>main</K> bleibt <K>2 1</K>.</p>}
          en={<p>Go to the end of <K>swap</K> and compare the two boxes: in <K>swap</K> we have <K>x = 1</K> and <K>y = 2</K>, so the swap worked there, but in <K>main</K> there are still <K>a = 2</K> and <K>b = 1</K>. With <K>return</K> the box of <K>swap</K> disappears together with the swapped copies. The output of <K>main</K> stays <K>2 1</K>.</p>}
        />
        <Box kind="lecture" src={<Src p="107" />} title={<T de="Mit Referenzen funktioniert es" en="With references it works" />}>
          <T
            de={<p>Man kann Funktionen aber erlauben, den Wert der übergebenen Argumente zu ändern. Beispiel 8.2: Beachte den Unterschied: Die Parameter von <K>swap</K> haben einen anderen Typ, aus <K>int</K> ist <K>int&amp;</K> geworden.</p>}
            en={<p>It turns out we can enable functions to change the value of the arguments passed to them. Example 8.2: note the difference: the parameters of <K>swap</K> have a different type, <K>int</K> has become <K>int&amp;</K>.</p>}
          />
        </Box>
        <Tracer stack prog={P.swapByRef} label={tr('Beispiel 8.2: mit int& vertauscht swap die Variablen des Aufrufers', 'Example 8.2: with int& swap exchanges the caller’s variables')} />
        <T
          de={<>
            <p>Der Code von <K>swap</K> ist <em>derselbe</em> wie vorher, bis auf zwei Zeichen im Kopf. Aber im Ablauf siehst du etwas Neues: Die Parameter <K>x</K> und <K>y</K> haben die Marke «Alias» und <em>zeigen auf dieselben Werte wie</em> <K>a</K> und <K>b</K>. Wird <K>x</K> geändert, ändert sich auch <K>a</K>, denn es ist dieselbe Variable unter zwei Namen. Am Ende steht in <K>main</K> <K>1 2</K>.</p>
            <p>Mit anderen Worten: Bei <K>int x</K> bekommt die Funktion eine <em>Kopie des Werts</em>, bei <K>int&amp; x</K> bekommt sie die <em>Variable selbst</em>.</p>
          </>}
          en={<>
            <p>The code of <K>swap</K> is <em>the same</em> as before, apart from two characters in the head. But in the run you see something new: the parameters <K>x</K> and <K>y</K> carry the mark “alias” and <em>point to the same values as</em> <K>a</K> and <K>b</K>. If <K>x</K> is changed, <K>a</K> changes too, because it is the same variable under two names. At the end <K>main</K> holds <K>1 2</K>.</p>
            <p>In other words: with <K>int x</K> the function receives a <em>copy of the value</em>, with <K>int&amp; x</K> it receives the <em>variable itself</em>.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="typ" title={<T de="2. Referenztypen" en="2. Reference types" />}>
        <Box kind="lecture" src={<Src p="108" />} title={<T de="T&amp;: ein Alias" en="T&amp;: an alias" />}>
          <T
            de={<>
              <p>Tatsächlich braucht man kein neues, nur für Funktionen geltendes Konzept, sondern eine neue Klasse von Typen: die <b>Referenztypen</b>. Formal werden sie definiert als <K>T&amp;</K>, wobei <K>T</K> der zugrunde liegende Typ ist, und <K>T&amp;</K> wird als «<K>T</K>-Referenz» gelesen.</p>
              <p>Semantisch hat <K>T&amp;</K> denselben Wertebereich und dieselbe Funktionalität wie <K>T</K>, aber Initialisierung und Zuweisung funktionieren anders. Beispiel 8.3 («Anakin Skywalker alias Darth Vader»): Da die Variable <K>darth_vader</K> ein <b>Alias</b> für die Variable <K>anakin_skywalker</K> ist, wirkt eine Zuweisung an die eine auf die andere.</p>
            </>}
            en={<>
              <p>In fact, not a new concept specific to functions is required, but rather a new class of types: <b>reference types</b>. Formally, they are defined as <K>T&amp;</K>, where <K>T</K> is the underlying type, and <K>T&amp;</K> is read as “<K>T</K>-reference”.</p>
              <p>Semantically, <K>T&amp;</K> has the same range of values and functionality as <K>T</K>, but initialization and assignment work differently. Example 8.3 (“Anakin Skywalker alias Darth Vader”): because the variable <K>darth_vader</K> is an <b>alias</b> to the variable <K>anakin_skywalker</K>, an assignment to the latter has an effect on the former.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.aliasRef} label={tr('Beispiel 8.3', 'Example 8.3')} />
        <T
          de={<p>Im Ablauf haben beide Namen <em>dasselbe</em> Kästchen. Nach <K>darth_vader = 22;</K> ändern sich beide Zeilen der Tabelle gleichzeitig, denn es gibt nur <em>eine</em> Zahl 22 im Speicher, die zwei Namen hat. Eine Referenz ist keine Kopie und kein neuer Speicherplatz, sondern ein zweiter Name.</p>}
          en={<p>In the run both names have <em>the same</em> box. After <K>darth_vader = 22;</K> both rows of the table change at the same time, since there is only <em>one</em> number 22 in memory, which has two names. A reference is neither a copy nor a new storage location but a second name.</p>}
        />
        <Box kind="lecture" src={<Src p="108" />} title={<T de="Regeln für die Initialisierung" en="Rules for initialization" />}>
          <T
            de={<>
              <p>Variablen von Referenztyp müssen mit einem <b>L-Wert</b> initialisiert werden. Die Variable wird dann zum Alias des L-Werts (einem anderen Namen für das referenzierte Objekt). Eine Zuweisung an die Referenz aktualisiert das Objekt hinter dem Alias.</p>
              <Code code={'int& darth_vader = anakin_skywalker; // ok\nint& j; // error: j must be an alias of something\nint& k = 5; // error: literal 5 has no address.'} />
              <p>Intern kann ein Wert vom Typ <K>T&amp;</K> durch die Adresse eines Objekts vom Typ <K>T</K> dargestellt werden.</p>
            </>}
            en={<>
              <p>Variables of reference type must be initialized with an <b>L-value</b>. The variable becomes an alias of the L-value (a different name for the referenced object). An assignment to the reference updates the object behind the alias.</p>
              <Code code={'int& darth_vader = anakin_skywalker; // ok\nint& j; // error: j must be an alias of something\nint& k = 5; // error: literal 5 has no address.'} />
              <p>Internally, a value of type <K>T&amp;</K> can be represented by the address of an object of type <K>T</K>.</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.refNoInit} label={tr('Ein Alias von nichts', 'An alias of nothing')} />
        <CompileFail prog={P.refLiteral} label={tr('Ein Alias einer Zahl, die keinen Speicherplatz hat', 'An alias of a number without a storage location')} />
        <T
          de={<>
            <p><b>L-Wert und R-Wert.</b> Ein L-Wert ist etwas, das einen Speicherplatz hat und links vom <K>=</K> stehen kann: eine Variable, ein Vektorelement <K>v[i]</K>. Ein R-Wert hat keinen eigenen Platz: ein Literal wie <K>5</K> oder ein Ergebnis wie <K>a + b</K>. Eine Referenz ist ein zweiter Name für einen <em>Platz</em>. Wo kein Platz ist, kann man keinen zweiten Namen vergeben, und das ist die ganze Begründung für die Fehlermeldungen oben.</p>
          </>}
          en={<>
            <p><b>L-value and R-value.</b> An L-value is something that has a storage location and may stand left of the <K>=</K>: a variable, a vector element <K>v[i]</K>. An R-value has no place of its own: a literal like <K>5</K> or a result like <K>a + b</K>. A reference is a second name for a <em>place</em>. Where there is no place, one cannot give a second name, and that is the whole reason for the error messages above.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="uebergabe" title={<T de="3. Übergabe per Referenz und per Wert" en="3. Pass by reference and by value" />}>
        <Box kind="lecture" src={<Src p="108–109" />} title={<T de="Pass by reference, pass by value" en="Pass by reference, pass by value" />}>
          <T
            de={<>
              <p>Referenztypen machen es möglich, dass Funktionen den Wert ihrer Aufrufargumente ändern. Beispiel 8.4 (<K>increment</K>): Der formale Parameter <K>i</K> von <K>increment</K> wird beim Aufruf zum Alias des Aufrufarguments <K>j</K>.</p>
              <Code code={'void increment(int& i) {\n  ++i;\n}\n...\nint j = 5;\nincrement(j);\nstd::cout << j; // 6'} />
              <p><b>Übergabe per Referenz:</b> Der formale Parameter hat Referenztyp und wird (intern) mit der Adresse des Aufrufarguments (L-Wert) initialisiert und wird damit zum Alias.</p>
              <p><b>Übergabe per Wert:</b> Das Standardverhalten (ohne Referenztypen). Der formale Parameter hat keinen Referenztyp und wird mit dem Wert des aktuellen Parameters (R-Wert) initialisiert und wird damit zu einer Kopie.</p>
            </>}
            en={<>
              <p>Reference types make it possible that functions modify the value of their call arguments. Example 8.4 (<K>increment</K>): the formal parameter <K>i</K> of <K>increment</K> becomes an alias of the call argument <K>j</K> in the call.</p>
              <Code code={'void increment(int& i) {\n  ++i;\n}\n...\nint j = 5;\nincrement(j);\nstd::cout << j; // 6'} />
              <p><b>Pass by reference:</b> the formal parameter is of reference type and is (internally) initialized with the address of the call argument (L-value) and thus becomes an alias.</p>
              <p><b>Pass by value:</b> the default behavior (without reference types). The formal parameter is not of reference type and is initialized with the value of the actual parameter (R-value) and thus becomes a copy.</p>
            </>}
          />
        </Box>
        <Tracer stack prog={P.incrementRef} label={tr('Beispiel 8.4', 'Example 8.4')} />
        <T
          de={<p>Beobachte in <K>main</K> den Wert von <K>j</K>, während <K>increment</K> läuft: Er ändert sich <em>sofort</em>, schon mit dem <K>++i</K>, ohne dass irgendwo etwas «zurückgegeben» würde. Das Ergebnis der Funktion steckt in der Variable des Aufrufers.</p>}
          en={<p>Watch the value of <K>j</K> in <K>main</K> while <K>increment</K> runs: it changes <em>at once</em>, already with the <K>++i</K>, without anything being “returned” anywhere. The result of the function sits in the caller’s variable.</p>}
        />
        <Box kind="tip" title={<T de="Welche Art von Parameter wann?" en="Which kind of parameter when?" />}>
          <T
            de={<ul>
              <li><b>Nur eine Zahl lesen</b> (<K>int</K>, <K>double</K>, <K>bool</K>, …): per Wert. Kopieren ist billig, und die Funktion kann den Parameter gefahrlos als Rechenvariable verwenden.</li>
              <li><b>Die Variable des Aufrufers ändern</b> (swap, increment, einen Vektor füllen): per Referenz <K>T&amp;</K>. Der Aufruf <K>increment(j)</K> sieht dabei <em>genauso aus</em> wie bei Wertübergabe. Die Funktion ändert <K>j</K>, ohne dass es am Aufruf zu erkennen ist. Schreibe deshalb im Kommentar (<K>// POST: …</K>), was geändert wird.</li>
              <li><b>Grosse Objekte nur lesen</b> (Vektoren): per <K>const T&amp;</K>. Das kommt in der nächsten Lektion.</li>
              <li><b>Ein Literal oder Ergebnis übergeben:</b> <K>increment(5)</K> ist ein Fehler, denn <K>5</K> hat keinen Platz, auf den <K>i</K> zeigen könnte.</li>
            </ul>}
            en={<ul>
              <li><b>Only reading a number</b> (<K>int</K>, <K>double</K>, <K>bool</K>, …): by value. Copying is cheap, and the function can safely use the parameter as a working variable.</li>
              <li><b>Changing the caller’s variable</b> (swap, increment, filling a vector): by reference <K>T&amp;</K>. The call <K>increment(j)</K> looks <em>exactly the same</em> as with pass by value. The function changes <K>j</K> without this being visible at the call. Therefore state in the comment (<K>// POST: …</K>) what is changed.</li>
              <li><b>Only reading large objects</b> (vectors): by <K>const T&amp;</K>. That comes in the next lesson.</li>
              <li><b>Passing a literal or a result:</b> <K>increment(5)</K> is an error, since <K>5</K> has no place that <K>i</K> could point to.</li>
            </ul>}
          />
        </Box>
        <Listing prog={P.vecByValue} label={tr('Ein Vektor per Wert wird kopiert, per Referenz nicht: Ausgabe 1 99', 'A vector by value is copied, by reference it is not: output 1 99')} />
        <T
          de={<p>Das gilt auch für Vektoren: <K>by_value(std::vector&lt;int&gt; v)</K> kopiert den <em>ganzen</em> Vektor, alle Elemente. Die Änderung von <K>v[0]</K> bleibt in der Kopie, <K>main</K> sieht weiter <K>1</K>. Bei <K>by_ref(std::vector&lt;int&gt;&amp; v)</K> wird nichts kopiert, die Änderung ist im Original (<K>99</K>). Bei einem Vektor mit einer Million Elementen ist der Unterschied nicht nur Semantik, sondern auch Zeit.</p>}
          en={<p>This also applies to vectors: <K>by_value(std::vector&lt;int&gt; v)</K> copies the <em>whole</em> vector, all elements. The change of <K>v[0]</K> stays in the copy, <K>main</K> keeps seeing <K>1</K>. With <K>by_ref(std::vector&lt;int&gt;&amp; v)</K> nothing is copied, the change is in the original (<K>99</K>). For a vector with a million elements the difference is not only semantics but also time.</p>}
        />
        <Predict
          prompt={<T de={<>Was gibt aus: <K>int a = 1; int&amp; r = a; int b = r; b = 5; std::cout &lt;&lt; a;</K></>} en={<>What does this print: <K>int a = 1; int&amp; r = a; int b = r; b = 5; std::cout &lt;&lt; a;</K></>} />}
          answer={<T de={<><K>1</K>. Nur <K>r</K> ist ein Alias von <K>a</K>. Bei <K>int b = r;</K> wird der <em>Wert</em> 1 in eine neue Variable <K>b</K> kopiert; <K>b</K> ist kein Alias, weil dort kein <K>&amp;</K> steht. Die Zuweisung <K>b = 5</K> ändert nur <K>b</K>.</>} en={<><K>1</K>. Only <K>r</K> is an alias of <K>a</K>. With <K>int b = r;</K> the <em>value</em> 1 is copied into a new variable <K>b</K>; <K>b</K> is no alias because there is no <K>&amp;</K>. The assignment <K>b = 5</K> changes only <K>b</K>.</>} />}
        />
        <Box kind="misconception" title={<T de="«Eine Referenz kann später auf eine andere Variable zeigen.»" en="“A reference can later point to another variable.”" />}>
          <T
            de={<>Nein. Eine Referenz wird bei der Initialisierung an <em>eine</em> Variable gebunden und bleibt es. <K>r = x;</K> bindet nicht neu, sondern <em>kopiert den Wert von <K>x</K> in die Variable, auf die <K>r</K> zeigt</em>. Wer das sauber trennen will, merkt sich: Der <K>&amp;</K> gilt nur bei der Deklaration.</>}
            en={<>No. A reference is bound to <em>one</em> variable at initialization and stays so. <K>r = x;</K> does not rebind but <em>copies the value of <K>x</K> into the variable <K>r</K> points to</em>. To keep this clean, remember: the <K>&amp;</K> counts only at the declaration.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Ohne <K>&amp;</K> bekommt die Funktion eine <em>Kopie</em>: Änderungen bleiben in der Funktion (Übergabe per Wert).</li>
              <li><K>T&amp;</K> ist ein zweiter Name (Alias) für einen vorhandenen Platz. Initialisierung nur mit einem L-Wert, keine Referenz auf Literale.</li>
              <li>Ein Parameter <K>T&amp; p</K> macht <K>p</K> zum Alias des Arguments: Die Funktion verändert die Variable des Aufrufers (Übergabe per Referenz).</li>
              <li>Der Aufruf sieht gleich aus, egal ob per Wert oder per Referenz: Dokumentiere, was geändert wird.</li>
            </ul>}
            en={<ul>
              <li>Without <K>&amp;</K> the function receives a <em>copy</em>: changes stay in the function (pass by value).</li>
              <li><K>T&amp;</K> is a second name (alias) for an existing place. Initialization only with an L-value, no reference to literals.</li>
              <li>A parameter <K>T&amp; p</K> makes <K>p</K> an alias of the argument: the function changes the caller’s variable (pass by reference).</li>
              <li>The call looks the same whether by value or by reference: document what is changed.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Auch der <em>Rückgabewert</em> kann eine Referenz sein. Wozu ist das gut, welche Gefahr steckt darin, und was bedeutet <K>const T&amp;</K>? (Skript S. 109–113)</p>}
          en={<p className="connections"><b>Next:</b> the <em>return value</em> can be a reference too. What is that good for, which danger lies in it, and what does <K>const T&amp;</K> mean? (notes pp. 109–113)</p>}
        />
      </Section>
    </article>
  );
}
