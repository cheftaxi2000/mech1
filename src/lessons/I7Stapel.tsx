import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I7Stapel() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In der Lektion über Aufrufe haben wir gesehen, dass jede aktive Funktion einen Kasten auf dem Aufrufstapel hat. Bei Rekursion liegen viele Kästen derselben Funktion übereinander. Diese Lektion schaut darauf genau, damit «der Aufruf wartet, bis der innere fertig ist» kein Zauber bleibt, und beweist dann an Euklids Algorithmus, dass eine Rekursion endet, deren Ende nicht offensichtlich ist.</p>}
        en={<p className="lede">In the lesson on calls we saw that every active function has a box on the call stack. With recursion many boxes of the same function lie on top of each other. This lesson looks at this closely so that “the call waits until the inner one is finished” does not remain magic, and then proves with Euclid’s algorithm that a recursion ends whose end is not obvious.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="stapel" title={<T de="1. Der Aufrufstapel" en="1. The call stack" />}>
        <Box kind="lecture" src={<Src p="120–121" />} title={<T de="Was beim Aufruf im Speicher geschieht" en="What happens in memory at a call" />}>
          <T
            de={<>
              <p>Schauen wir genauer, was passiert, wenn eine rekursive Funktion aufgerufen wird, und wie der Speicher aussieht. Wir wiederholen im Grunde, was in Abschnitt 6.4 beschrieben wurde, mit dem Fokus auf Rekursion.</p>
              <p>Der <b>Stapel</b> (oder <b>Aufrufstapel</b>) ist ein Teil des Speichers, der lokale Variablen und zusätzliche Informationen über aufgerufene Funktionen speichert, einen <b>Rahmen</b> (zusammenhängender Speicherbereich) pro Aufruf. (Ein anderer Teil des Speichers ist der <b>Heap</b>, der dynamisch erzeugte Objekte speichert, mehr dazu später.)</p>
              <p>Zuerst eine einfache nicht-rekursive Funktion: <K>int f(int x) {'{ int y = 2 * x; return y; }'}</K>. Beim Aufruf <K>f(4)</K> werden das Funktionsargument (4) und die <b>Rücksprungadresse</b> (von wo wurde die Funktion aufgerufen?) auf den Aufrufstapel gelegt. Die aufgerufene Funktion nutzt den Argumentwert auf dem Stapel, um ihren formalen Parameter <K>x</K> zu initialisieren, und führt den Rumpf aus. Auch die lokale Variable <K>y</K> lebt auf dem Stapel. Erreicht der Aufruf <K>f(4)</K> das <K>return</K>, springt das Programm zur Rücksprungadresse zurück. Der Funktionsaufruf dort wird durch den Rückgabewert ersetzt, und das Programm läuft weiter. Die obersten drei Elemente (Argument, Rücksprungadresse, lokale Variable) werden vom Stapel entfernt.</p>
            </>}
            en={<>
              <p>Let us take a closer look at what happens when a recursive function is called and, in particular, how the memory looks like. We basically repeat what has been described in Section 6.4 with a focus on recursion.</p>
              <p>The <b>stack</b> (or <b>call stack</b>) is a part of the memory that stores local variables and additional information about called functions, one <b>frame</b> (i.e., a consecutive part of the memory) per call. (Another part of the memory is the <b>heap</b>, which stores dynamically created objects, as we will discuss later.)</p>
              <p>Let us first focus on a simple non-recursive function: <K>int f(int x) {'{ int y = 2 * x; return y; }'}</K>. When we call <K>f(4)</K>, the function argument (here 4) as well as the <b>return address</b> (where has the function been called from?) are pushed on the call stack. The called function then uses the argument value on the call stack to initialize its formal argument (<K>x</K>) and executes the function body. The local variable <K>y</K> lives on that stack as well. Once the function call <K>f(4)</K> has reached the return statement, the program jumps back to the return address. The function call there is replaced with the return value and the program continues with its execution. The top three elements (function argument, return address, and local variable) are deleted from the stack.</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src p="121–122" />} title={<T de="Und bei fac(4)" en="And for fac(4)" />}>
          <T
            de={<>
              <p>Ruft man eine rekursive Funktion auf, etwa <K>fac(4)</K>, werden ebenso das Argument (4) und die Rücksprungadresse auf den Stapel gelegt, und der formale Parameter <K>n</K> wird mit 4 initialisiert. Während der Ausführung trifft der Aufruf auf den (rekursiven) Aufruf von <K>fac(3)</K>. Dessen Argument und Rücksprungadresse werden auf den Stapel gelegt, und die Ausführung von <K>fac(3)</K> beginnt. Dieser Aufruf ruft <K>fac(2)</K> auf, der wiederum <K>fac(1)</K>. Der Aufrufstapel sieht jetzt so aus: <K>fac(4) ⇒ fac(3) ⇒ fac(2) ⇒ fac(1)</K>, wobei <K>fac(1)</K> oben liegt. Bis hierher ist noch kein Funktionsaufruf beendet. Alle sind gleichzeitig aktiv: Es gibt einen Stapel von Funktionsaufrufen.</p>
              <p>Der oberste Funktionsaufruf wird ausgeführt, bis er zurückkehrt (oder eine andere Funktion aufruft, dann ist er nicht mehr der oberste). Wird ein <K>return</K> (oder das Ende der Funktion) erreicht, wird der Aufruf vom Stapel entfernt und die Ausführung des nächsten Aufrufs auf dem Stapel wird fortgesetzt.</p>
              <p>Genauer: Während der Ausführung von <K>fac(1)</K> wird <K>return 1;</K> erreicht. Der Aufruf <K>fac(1)</K> wird vom Stapel entfernt, und der Rückgabewert wird an seinen Aufrufer «übergeben», den nächsten Aufruf auf dem Stapel (<K>fac(2)</K>). Der kann jetzt seinen Rückgabewert berechnen und an <K>fac(3)</K> zurückgeben, und der an <K>fac(4)</K>. Dieser berechnet ebenfalls seinen Rückgabewert und gibt ihn an seinen ursprünglichen Aufrufer zurück (Abbildung 10.1). Wie bei nicht-rekursiven Funktionen hat jeder Aufruf seine eigenen lokalen Argumente (auch die formalen Argumente).</p>
            </>}
            en={<>
              <p>When we call a recursive function, say <K>fac(4)</K>, then similarly the function argument (4) as well as the return address are pushed on the stack and the formal argument <K>n</K> of <K>fac</K> is initialized with the value 4. During the execution of that function call, it encounters a (recursive) function call to <K>fac(3)</K>. The function argument (3) as well as the return address are pushed on the stack and the execution of <K>fac(3)</K> is started. This function call then calls <K>fac(2)</K>, which in turn calls <K>fac(1)</K>. The call stack now looks as follows: <K>fac(4) ⇒ fac(3) ⇒ fac(2) ⇒ fac(1)</K>, with <K>fac(1)</K> being the top. Note that until now, no function call has terminated. They are all active “at the same time”: there is a stack of function calls.</p>
              <p>The top-most function call is executed until it returns (or it calls another function, in which case it stops being the top-most). When a return statement (or the end of the function) has been reached, the corresponding function call is removed from the stack and the execution of the next function call on the stack is being resumed.</p>
              <p>More concretely, during the execution of the function call <K>fac(1)</K>, the statement <K>return 1;</K> is reached. The function call <K>fac(1)</K> is removed from the stack and the return value is “handed over” to its caller, i.e., the next function call on the stack (<K>fac(2)</K>). The function call <K>fac(2)</K> now can compute its return value and return it to its caller <K>fac(3)</K>, which in turn returns its computed return value to <K>fac(4)</K>. This function call also computes its return value and returns it to its original caller (Figure 10.1). Note that, as with regular non-recursive functions, every function call has its own local arguments (including formal arguments).</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.facRec} label={tr('Abbildung 10.1 zum Mitverfolgen', 'Figure 10.1 to follow along')} />
        <T
          de={<>
            <p><b>Was die Abbildung im Skript und dieser Ablauf gemeinsam zeigen.</b> Der Aufruf <K>fac(4)</K> <em>wartet</em>, bis <K>fac(3)</K> ihm ein Ergebnis liefert, denn er braucht es für sein <K>* n</K>. Er wartet nicht untätig: Sein Kasten bleibt auf dem Stapel, mit seinem <K>n = 4</K>, bis er an der Reihe ist. Erst auf dem Rückweg wird multipliziert: <K>1 · 2 = 2</K>, <K>2 · 3 = 6</K>, <K>6 · 4 = 24</K>. Auf dem Hinweg wird nur <em>gerufen</em>, auf dem Rückweg <em>gerechnet</em>. Das ist die ganze Mechanik.</p>
            <p><b>Warum Rekursion Speicher kostet.</b> Jeder wartende Aufruf besetzt einen Kasten. <K>fac(1000)</K> bräuchte 1000 Kästen gleichzeitig. Eine Schleife mit derselben Wirkung braucht eine einzige Variable. Deshalb ist die Tiefe der Rekursion, die Zahl der gleichzeitig aktiven Aufrufe, eine wichtige Grösse (letzte Lektion dieses Kapitels).</p>
          </>}
          en={<>
            <p><b>What the figure in the notes and this run show together.</b> The call <K>fac(4)</K> <em>waits</em> until <K>fac(3)</K> delivers a result, because it needs it for its <K>* n</K>. It does not wait idly: its box stays on the stack, with its <K>n = 4</K>, until it is its turn. Only on the way back is there multiplication: <K>1 · 2 = 2</K>, <K>2 · 3 = 6</K>, <K>6 · 4 = 24</K>. On the way down there is only <em>calling</em>, on the way back <em>calculating</em>. That is the whole mechanism.</p>
            <p><b>Why recursion costs memory.</b> Every waiting call occupies a box. <K>fac(1000)</K> would need 1000 boxes at the same time. A loop with the same effect needs a single variable. That is why the depth of the recursion, the number of calls active at the same time, is an important quantity (last lesson of this chapter).</p>
          </>}
        />
        <Listing prog={P.facTable} label={tr('Auch Rekursion hat Grenzen des Rechnens: 13! passt nicht mehr in einen int', 'Recursion has limits of computing too: 13! no longer fits into an int')} />
        <T
          de={<p>Die Ausgabe zeigt <K>12! = 479001600</K> und dann bei <K>13!</K> eine Zahl, die kleiner ist als der Vorgänger: ein <em>Überlauf</em> des <K>int</K> (<M>{t`13! = 6\,227\,020\,800`}</M> ist grösser als <M p=").">{t`2^{31}-1`}</M> Die Rekursion rechnet korrekt, aber der Typ ist zu klein: Wie in der Lektion über Ganzzahlen. Für grössere Fakultäten braucht man <K>long long</K> (bis <K>20!</K>) oder gar andere Mittel.</p>}
          en={<p>The output shows <K>12! = 479001600</K> and then, at <K>13!</K>, a number that is smaller than its predecessor: an <em>overflow</em> of the <K>int</K> (<M>{t`13! = 6\,227\,020\,800`}</M> is larger than <M p=").">{t`2^{31}-1`}</M> The recursion calculates correctly, but the type is too small: as in the lesson on integers. For larger factorials you need <K>long long</K> (up to <K>20!</K>) or other means.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="gcd" title={<T de="2. Beispiel: der grösste gemeinsame Teiler" en="2. Example: the greatest common divisor" />}>
        <Box kind="lecture" src={<Src p="122–123" />} title={<T de="Euklids Algorithmus rekursiv" en="Euclid’s algorithm recursively" />}>
          <T
            de={<>
              <p>Im allerersten Abschnitt haben wir den Algorithmus von Euklid kennengelernt, der den grössten gemeinsamen Teiler <M>{t`\gcd(a, b)`}</M> zweier natürlicher Zahlen berechnet. Er lässt sich tatsächlich durch die folgende mathematische Rekursion beschreiben:</p>
              <p><M>{t`\gcd(a, b) = \begin{cases} a, & \text{falls } b = 0 \\ \gcd(b, a \bmod b), & \text{sonst} \end{cases}`}</M></p>
              <p>Hier ist nicht wichtig zu verstehen, <em>warum</em> der Algorithmus das richtige Ergebnis liefert. Wir vertrauen auf seine Korrektheit und wollen ihn nur umsetzen (und über seine Terminierung argumentieren). Eine mathematische Rekursion lässt sich geradlinig in ein rekursives C++-Programm übersetzen, mit einer <K>if</K>-Anweisung, die rekursiven Fall und Basisfall trennt:</p>
              <Code code={'int gcd(int a, int b) {\n    if (b == 0) return a;\n    else return gcd(b, a % b);\n}'} />
            </>}
            en={<>
              <p>In the very first section we learned about Euclid’s algorithm to compute the greatest common divisor <M>{t`\gcd(a, b)`}</M> of two natural numbers <M>a</M> and <M p=".">b</M> This algorithm can in fact be described using the following mathematical recursion:</p>
              <p><M>{t`\gcd(a, b) = \begin{cases} a, & \text{if } b = 0 \\ \gcd(b, a \bmod b), & \text{otherwise} \end{cases}`}</M></p>
              <p>It is not so important here to understand <em>why</em> this algorithm produces the correct result. We trust its correctness and just want to implement it (and argue about its termination). As we have seen before, a mathematical recursion can be translated to a recursive C++ program in a straightforward manner, having an <K>if</K> statement distinguishing between the recursive case and the base case:</p>
              <Code code={'int gcd(int a, int b) {\n    if (b == 0) return a;\n    else return gcd(b, a % b);\n}'} />
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.gcdRec} label={tr('gcd(48, 18) und gcd(7, 0)', 'gcd(48, 18) and gcd(7, 0)')} />
        <T
          de={<>
            <p><b>Der Aufrufbaum ist hier eine Kette:</b> <K>gcd(48, 18)</K> → <K>gcd(18, 12)</K> → <K>gcd(12, 6)</K> → <K>gcd(6, 0)</K>. Der letzte Aufruf hat <K>b == 0</K>, gibt <K>a = 6</K> zurück, und dieser Wert wird <em>unverändert</em> durch alle wartenden Aufrufe hindurchgereicht (jeder gibt einfach das Ergebnis des inneren zurück, ohne es zu verändern). Das ist anders als bei <K>fac</K>, wo jeder Aufruf noch multipliziert. Der zweite Aufruf, <K>gcd(7, 0)</K>, ist sofort ein Basisfall.</p>
            <p>Merke dir zwei Dinge, die diese Funktion lehrt. Erstens: Man kann die Parameter gegenüber dem Aufruf <em>vertauschen</em> (<K>gcd(b, a % b)</K> statt <K>gcd(a, …)</K>) und so den Fortschritt in einem Parameter verstecken. Zweitens: Der rekursive Aufruf steht <em>am Ende</em>: Nach ihm ist nichts mehr zu tun als das Ergebnis weiterzugeben.</p>
          </>}
          en={<>
            <p><b>The call tree is a chain here:</b> <K>gcd(48, 18)</K> → <K>gcd(18, 12)</K> → <K>gcd(12, 6)</K> → <K>gcd(6, 0)</K>. The last call has <K>b == 0</K>, returns <K>a = 6</K>, and this value is passed through <em>unchanged</em> by all waiting calls (each simply returns the result of the inner one without changing it). This is different from <K>fac</K>, where every call still multiplies. The second call, <K>gcd(7, 0)</K>, is a base case at once.</p>
            <p>Remember two things this function teaches. First: one can <em>swap</em> the parameters relative to the call (<K>gcd(b, a % b)</K> instead of <K>gcd(a, …)</K>) and thereby hide the progress in one parameter. Second: the recursive call stands <em>at the end</em>: after it there is nothing left to do but pass on the result.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="123" />} title={<T de="Terminiert die Rekursion?" en="Does the recursion terminate?" />}>
          <T
            de={<p>Interessant an dieser Funktion ist, dass die Terminierung nicht so offensichtlich ist wie bei anderen Beispielen. Es gibt einen Basisfall (wenn das zweite Argument 0 erreicht hat), aber wird dieser Basisfall überhaupt erreicht? Wir brauchen garantierten Fortschritt zum Basisfall. Das zweite Argument geht von <M>b</M> zu <M p=",">{t`a \bmod b`}</M> und das ist ein Wert <em>streng kleiner</em> als <M p=".">b</M> Wir kommen also mit jedem rekursiven Aufruf dem Basisfall <K>b == 0</K> näher; die Rekursion ist endlich.</p>}
            en={<p>What is interesting about this function is that termination might not be as obvious as in other examples. There is a base case (when the second argument has reached 0), but will this base case be reached eventually? We need guaranteed progress towards the base case. The second argument goes from <M>b</M> to <M p=",">{t`a \bmod b`}</M> which is a value <em>strictly smaller</em> than <M p=".">b</M> We thus indeed get closer to the base case <K>b == 0</K> with each recursive call; the recursion is finite.</p>}
          />
        </Box>
        <T
          de={<>
            <p><b>Das Argument in einem Satz:</b> Der Rest bei Division durch <M>b</M> liegt immer in <M p=",">{t`0, 1, \dots, b-1`}</M> ist also kleiner als <M p=".">b</M> Eine Folge natürlicher Zahlen, die in jedem Schritt <em>streng kleiner</em> wird, kann nicht ewig fallen: Spätestens bei 0 ist Schluss. Darum <em>muss</em> <K>b</K> irgendwann 0 sein. Das ist die präzise Form des «messbaren Fortschritts» aus der letzten Lektion: <K>b</K> ist das Mass, es sinkt in jedem Aufruf. Beachte die Vorbedingung <M p=":">{t`a, b \ge 0`}</M> Mit negativen Zahlen ist der Rest negativ, und das Argument stimmt nicht mehr.</p>
          </>}
          en={<>
            <p><b>The argument in one sentence:</b> the remainder on division by <M>b</M> always lies in <M p=",">{t`0, 1, \dots, b-1`}</M> so it is smaller than <M p=".">b</M> A sequence of natural numbers that becomes <em>strictly smaller</em> in every step cannot fall forever: at the latest at 0 it is over. That is why <K>b</K> <em>must</em> eventually be 0. That is the precise form of the “measurable progress” from the last lesson: <K>b</K> is the measure, it drops in every call. Note the precondition <M p=":">{t`a, b \ge 0`}</M> with negative numbers the remainder is negative, and the argument no longer holds.</p>
          </>}
        />
        <Choice
          question={<T de={<>Wie viele Aufrufe von <K>gcd</K> (den ersten eingerechnet) macht <K>gcd(21, 13)</K>?</>} en={<>How many calls of <K>gcd</K> (counting the first) does <K>gcd(21, 13)</K> make?</>} />}
          choices={[
            { text: <K>7</K>, correct: true, why: <T de={<>Richtig: Die zweiten Argumente sind 13, 8, 5, 3, 2, 1, 0, denn <K>21 % 13</K> ist 8, <K>13 % 8</K> ist 5, <K>8 % 5</K> ist 3, <K>5 % 3</K> ist 2, <K>3 % 2</K> ist 1 und <K>2 % 1</K> ist 0. Das sind sieben Aufrufe, der letzte mit <K>b == 0</K> ist der Basisfall. (Die Zahlen 21 und 13 sind aufeinanderfolgende Fibonacci-Zahlen: Das ist der schlechteste Fall für Euklid.)</>} en={<>Correct: the second arguments are 13, 8, 5, 3, 2, 1, 0, since <K>21 % 13</K> is 8, <K>13 % 8</K> is 5, <K>8 % 5</K> is 3, <K>5 % 3</K> is 2, <K>3 % 2</K> is 1 and <K>2 % 1</K> is 0. That makes seven calls, the last with <K>b == 0</K> is the base case. (The numbers 21 and 13 are consecutive Fibonacci numbers: that is the worst case for Euclid.)</>} /> },
            { text: <K>6</K>, why: <T de={<>Das vergisst den letzten Aufruf <K>gcd(1, 0)</K>. Auch der Basisfall ist ein Aufruf.</>} en={<>That forgets the last call <K>gcd(1, 0)</K>. The base case is a call too.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="wichtig" title={<T de="3. Das Wichtigste" en="3. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Jeder Aufruf hat einen Rahmen auf dem Stapel (Argumente, Rücksprungadresse, lokale Variablen). Bei Rekursion liegen mehrere Rahmen derselben Funktion übereinander, jeder mit eigenen Variablen.</li>
              <li>Hinweg: aufrufen und warten. Rückweg: Ergebnisse ablesen und weiterrechnen.</li>
              <li>Je tiefer die Rekursion, desto mehr Stapel: Die Tiefe (gleichzeitig aktive Aufrufe) ist ein Kostenmass.</li>
              <li>Terminierung zeigen: eine Grösse, die bei jedem Aufruf streng kleiner wird und nicht unter einen Basiswert fallen kann (bei <K>gcd</K>: <K>b</K>, denn <K>a % b &lt; b</K>).</li>
            </ul>}
            en={<ul>
              <li>Every call has a frame on the stack (arguments, return address, local variables). With recursion several frames of the same function lie on top of each other, each with its own variables.</li>
              <li>Way down: call and wait. Way back: read off results and calculate on.</li>
              <li>The deeper the recursion, the more stack: the depth (calls active at the same time) is a cost measure.</li>
              <li>Show termination: a quantity that becomes strictly smaller with every call and cannot fall below a base value (for <K>gcd</K>: <K>b</K>, because <K>a % b &lt; b</K>).</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Fakultät und <K>gcd</K> gehen auch mit einer Schleife. Wozu also Rekursion? Das nächste Beispiel hat keine einfache Schleifenlösung: alle Bitfolgen der Länge <K>n</K> (Skript S. 123–127).</p>}
          en={<p className="connections"><b>Next:</b> factorial and <K>gcd</K> also work with a loop. So why recursion? The next example has no simple loop solution: all bit strings of length <K>n</K> (notes pp. 123–127).</p>}
        />
      </Section>
    </article>
  );
}
