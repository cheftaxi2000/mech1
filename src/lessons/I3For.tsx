import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I3For() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Schleife wiederholt Anweisungen, bis eine Bedingung nicht mehr gilt. Das ist die Stelle, an der ein Rechner seine Stärke zeigt: Eine Million Wiederholungen kosten dich genau so viele Zeilen wie drei. Diese Lektion behandelt die <K>for</K>-Schleife, ihren genauen Ablauf, und die Frage, die jede Schleife begleitet: Hört sie jemals auf?</p>}
        en={<p className="lede">A loop repeats statements until a condition no longer holds. This is where a computer shows its strength: a million repetitions cost you exactly as many lines as three. This lesson covers the <K>for</K> loop, its exact flow, and the question that accompanies every loop: does it ever stop?</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="aufbau" title={<T de="1. Aufbau und Ablauf" en="1. Structure and flow" />}>
        <Box kind="lecture" src={<Src p="50–51" />} title={<T de="Die for-Anweisung" en="The for statement" />}>
          <T
            de={<>
              <p>Die <b>for-Anweisung</b> hat die Form</p>
              <Code code={'for ( init statement; condition; expression )\n    body statement'} />
              <p>Das <K>init statement</K> ist eine Ausdrucksanweisung, eine Deklarationsanweisung oder die leere Anweisung. <K>condition</K> ist ein Ausdruck, der in <K>bool</K> umgewandelt werden kann, <K>expression</K> ein beliebiger Ausdruck, und der <K>body statement</K> eine beliebige Anweisung, der Rumpf.</p>
              <p>Beim Betreten der for-Anweisung wird das <K>init statement</K> ausgeführt, <em>nur einmal</em>. Danach gilt:</p>
              <ol>
                <li>Die Bedingung wird ausgewertet. Ist sie <K>false</K>, endet die Schleife, und das Programm macht hinter dem Rumpf weiter.</li>
                <li>Sonst wird der Rumpf ausgeführt,</li>
                <li>danach wird der Ausdruck <K>expression</K> ausgewertet,</li>
                <li>danach geht es bei Schritt 1 weiter.</li>
              </ol>
            </>}
            en={<>
              <p>The <b>for statement</b> has the form</p>
              <Code code={'for ( init statement; condition; expression )\n    body statement'} />
              <p>The <K>init statement</K> is an expression statement, a declaration statement or the null statement. <K>condition</K> is an expression that can be converted to <K>bool</K>, <K>expression</K> is an arbitrary expression, and the <K>body statement</K> is an arbitrary statement, the body.</p>
              <p>When the for statement is entered, the <K>init statement</K> is executed, <em>only once</em>. Then:</p>
              <ol>
                <li>The condition is evaluated. If it is <K>false</K>, the loop ends and the program continues after the body.</li>
                <li>Otherwise the body is executed,</li>
                <li>after which the expression <K>expression</K> is evaluated,</li>
                <li>after which execution continues with step 1.</li>
              </ol>
            </>}
          />
        </Box>
        <T
          de={<>
            <p>Das ist abstrakt, bis man es laufen sieht. Wir summieren die Zahlen von 1 bis <K>n</K> und fixieren <K>n = 2</K>. Gehe den Ablauf Schritt für Schritt durch und lies bei jedem Schritt mit: <em>Welche der vier Stationen (Init, Bedingung, Rumpf, Ausdruck) ist gerade dran?</em></p>
          </>}
          en={<>
            <p>This is abstract until you see it run. We sum the numbers from 1 to <K>n</K> and fix <K>n = 2</K>. Step through the run and read along: <em>which of the four stations (init, condition, body, expression) is it at the moment?</em></p>
          </>}
        />
        <Tracer prog={P.forSumN2} label={tr('Die Schleife für n = 2', 'The loop for n = 2')} />
        <T
          de={<>
            <p>Du siehst, dass <K>i</K> bis 3 läuft, obwohl der Rumpf nur für <K>i = 1</K> und <K>i = 2</K> ausgeführt wird. Der dritte Wert wird gebraucht, um die Bedingung falsch zu machen: <K>3 &lt;= 2</K> ist falsch, die Schleife endet, <K>s</K> bleibt 3. (Die Tabelle im Skript zeigt in der letzten Zeile <K>i = 2</K> und <K>s = 1</K>; das ist ein Tippfehler, die Werte sind nach dem letzten <K>++i</K> 3 und 3.)</p>
            <p><b>Drei Dinge, die man hier merken muss.</b> Das <K>init</K> läuft nur einmal, nicht bei jedem Durchgang. Die Bedingung wird <em>vor</em> jedem Durchgang geprüft, also auch vor dem ersten: Ist sie von Anfang an falsch, läuft der Rumpf nie. Und der Ausdruck läuft <em>nach</em> dem Rumpf, nie davor.</p>
          </>}
          en={<>
            <p>You see that <K>i</K> goes up to 3 although the body is executed only for <K>i = 1</K> and <K>i = 2</K>. The third value is needed to make the condition false: <K>3 &lt;= 2</K> is false, the loop ends, <K>s</K> stays 3. (The table in the notes shows <K>i = 2</K> and <K>s = 1</K> in its last row; that is a typo, after the last <K>++i</K> the values are 3 and 3.)</p>
            <p><b>Three things to remember here.</b> The <K>init</K> runs only once, not at every pass. The condition is checked <em>before</em> every pass, also before the first one: if it is false from the start, the body never runs. And the expression runs <em>after</em> the body, never before.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="summe" title={<T de="2. Das vollständige Programm" en="2. The complete program" />}>
        <Box kind="lecture" src={<Src p="51" />} title={<T de="Code 5.1: Summe der ersten n Zahlen" en="Code 5.1: sum of the first n numbers" />}>
          <T
            de={<p>Das Programm berechnet <M p=".">{t`\sum_{i=1}^{n} i`}</M> (Es gibt dafür eine einfache geschlossene Formel; die Summe dient hier nur, um die for-Schleife zu erklären.)</p>}
            en={<p>The program computes <M p=".">{t`\sum_{i=1}^{n} i`}</M> (There is a simple closed formula for this; the sum serves here only to explain the for loop.)</p>}
          />
        </Box>
        <Tracer prog={P.forSum} inputs={['4\n', '10\n', '0\n']} label={tr('Code 5.1', 'Code 5.1')} />
        <T
          de={<p>Für <K>n = 0</K> siehst du die Randfälle: Die Bedingung <K>1 &lt;= 0</K> ist sofort falsch, der Rumpf läuft nie, und <K>s</K> bleibt bei seinem Startwert 0. Das ist die richtige Antwort für die leere Summe. Gute Schleifen behandeln diese Grenzfälle ohne Sonderbehandlung.</p>}
          en={<p>For <K>n = 0</K> you see the edge case: the condition <K>1 &lt;= 0</K> is false at once, the body never runs, and <K>s</K> stays at its starting value 0. That is the right answer for the empty sum. Good loops handle such edge cases without special treatment.</p>}
        />
        <Box kind="tip" title={<T de="Schleifen richtig zählen" en="Counting loops correctly" />}>
          <T
            de={<ul>
              <li><b>Anzahl der Durchgänge.</b> <K>for (int i = 0; i &lt; n; ++i)</K> läuft genau <K>n</K>-mal (mit <K>i = 0, …, n-1</K>); <K>for (int i = 1; i &lt;= n; ++i)</K> ebenfalls. Der klassische Fehler ist <K>&lt;=</K> an der falschen Stelle: Dann läuft die Schleife einmal zu oft oder zu wenig (<span lang="en">off-by-one</span>).</li>
              <li><b>Teste die Grenzen im Kopf:</b> Was passiert für <K>n = 0</K>, <K>n = 1</K>? Wenn diese stimmen, stimmt der Rest meist auch.</li>
              <li><b>Die Zählvariable nicht im Rumpf verändern.</b> Wenn <K>i</K> im Rumpf mitverändert wird, kann man den Ablauf nicht mehr auf einen Blick lesen.</li>
            </ul>}
            en={<ul>
              <li><b>Number of passes.</b> <K>for (int i = 0; i &lt; n; ++i)</K> runs exactly <K>n</K> times (with <K>i = 0, …, n-1</K>); so does <K>for (int i = 1; i &lt;= n; ++i)</K>. The classic mistake is a <K>&lt;=</K> in the wrong place: the loop then runs once too often or too rarely (<span lang="en">off-by-one</span>).</li>
              <li><b>Test the boundaries in your head:</b> what happens for <K>n = 0</K>, <K>n = 1</K>? If those are right, the rest usually is too.</li>
              <li><b>Do not change the counter inside the body.</b> If <K>i</K> is changed in the body as well, the flow can no longer be read at a glance.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="ende" title={<T de="3. Endet die Schleife? Terminierung" en="3. Does the loop end? Termination" />}>
        <Box kind="lecture" src={<Src p="52" />} title={<T de="Terminierung und Endlosschleifen" en="Termination and infinite loops" />}>
          <T
            de={<>
              <p>Meistens ändert der Ausdruck (<K>++i</K>) den Wert, der in der Bedingung (<K>i &lt;= n</K>) vorkommt. Nach endlich vielen Durchgängen (hier <K>n</K>) wird die Bedingung falsch, die Schleife <b>terminiert</b>.</p>
              <p>Da der Ausdruck immer nach dem Rumpf ausgeführt wird, könnte man ihn auch als letzte Anweisung in den Rumpf schreiben. Er steht aber mit gutem Grund im Kopf der Schleife, denn eine Schleife kann <em>nicht</em> terminieren. Endlosschleifen sind leicht zu erzeugen:</p>
              <Code code={'for ( ; ; );'} />
              <p>Warum ist das eine gültige Endlosschleife? Das Init ist die leere Anweisung. Die leere Bedingung ist immer wahr. Der leere Ausdruck tut nichts, und der Rumpf ist ebenfalls die leere Anweisung.</p>
              <p>Es ist leicht, eine Endlosschleife zu schreiben. Sie zu <em>erkennen</em> ist aber im Allgemeinen unmöglich:</p>
              <p><b>Unentscheidbarkeit des Halteproblems.</b> Es gibt kein C++-Programm, das für jedes C++-Programm <K>P</K> und jede Eingabe <K>I</K> entscheiden kann, ob <K>P</K> mit der Eingabe <K>I</K> terminiert.</p>
              <p>Diese Aussage geht auf Alan Turing zurück. Sie bedeutet, dass sich die Korrektheit von Programmen im Allgemeinen nicht automatisch prüfen lässt. Es liegt also in unserer Verantwortung, Programme ohne Endlosschleifen zu schreiben.</p>
            </>}
            en={<>
              <p>Mostly the expression (<K>++i</K>) changes the value that appears in the condition (<K>i &lt;= n</K>). After a finite number of passes (here <K>n</K>) the condition becomes false, and the loop <b>terminates</b>.</p>
              <p>Since the expression is always executed after the body, one could also write it as the last statement of the body. It sits in the loop header for good reason, because a loop can <em>fail</em> to terminate. Infinite loops are easy to produce:</p>
              <Code code={'for ( ; ; );'} />
              <p>Why is this a valid infinite loop? The init is the null statement. The empty condition is always true. The empty expression does nothing, and the body is the null statement as well.</p>
              <p>It is easy to write an infinite loop. To <em>recognize</em> one is impossible in general, however:</p>
              <p><b>Undecidability of the halting problem.</b> There is no C++ program that can decide, for every C++ program <K>P</K> and every input <K>I</K>, whether <K>P</K> terminates with input <K>I</K>.</p>
              <p>This statement goes back to Alan Turing. It means that the correctness of programs cannot in general be checked automatically. So it is our responsibility to write programs without infinite loops.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was das praktisch heisst.</b> Du kannst nicht darauf warten, dass dir ein Werkzeug sagt, ob deine Schleife endet. Du musst es selbst begründen, und zwar mit einem festen Muster: Suche eine Grösse, die in jedem Durchgang <em>näher an das Ende rückt</em>, und zeige, dass sie es erreicht. Bei <K>for (int i = 1; i &lt;= n; ++i)</K> ist es <K>n - i</K>: Es sinkt in jedem Durchgang um 1, bis die Bedingung falsch wird.</p>
            <p>Wenn ein Programm bei dir «hängt» (keine Ausgabe, kein Ende), ist die erste Vermutung eine Schleife, deren Fortschritt fehlt oder in die falsche Richtung läuft. Im Terminal stoppst du es mit <K>Ctrl + C</K>.</p>
          </>}
          en={<>
            <p><b>What this means in practice.</b> You cannot wait for a tool to tell you whether your loop ends. You must justify it yourself, using a fixed pattern: find a quantity that <em>moves closer to the end</em> in every pass, and show that it gets there. For <K>for (int i = 1; i &lt;= n; ++i)</K> it is <K>n - i</K>: it drops by 1 in every pass until the condition becomes false.</p>
            <p>When a program “hangs” on you (no output, no end), the first suspicion is a loop whose progress is missing or goes in the wrong direction. In a terminal you stop it with <K>Ctrl + C</K>.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="prim" title={<T de="4. Beispiel: Primzahltest" en="4. Example: prime number test" />}>
        <Box kind="lecture" src={<Src p="52–53" />} title={<T de="Primzahltest" en="Prime number test" />}>
          <T
            de={<>
              <p>Eine natürliche Zahl <M>{t`n \ge 2`}</M> ist eine <b>Primzahl</b>, wenn kein <M>{t`d \in \{2, \dots, n-1\}`}</M> die Zahl <M>n</M> teilt. Eine Schleife, die das prüft:</p>
              <Code code={'int d;\nfor (d=2; n%d != 0; ++d);'} />
              <p>(Der Rumpf ist die leere Anweisung.) Warum terminiert sie? Sie beginnt mit <K>d = 2</K>, und <K>d</K> wird in jedem Durchgang um 1 grösser. Sie endet, sobald <K>n%d == 0</K> gilt. Für <M>{t`n \ge 2`}</M> wird irgendwann <K>d == n</K> erreicht, und dann ist <K>n%d != 0</K> falsch. Der Fortschritt <K>++d</K> garantiert also, dass die Abbruchbedingung erreicht wird.</p>
              <p>Die Schleife ist keine Endlosschleife, sofern <M>{t`n \ge 2`}</M> gilt. Für <K>n = 1</K> ist der Rest von <K>n</K> geteilt durch <K>d</K> für alle <M>{t`d \ge 2`}</M> gleich 1, und die Schleife läuft ewig. Die Schleife ist also nur für <M>{t`n \ge 2`}</M> korrekt. Das sollten wir im Programm vermerken (Vorbedingung).</p>
              <p>Die Schleife testet auch tatsächlich auf Primzahlen: Jeder mögliche Teiler <M>{t`2 \le d \le n`}</M> wird geprüft. Endet sie mit <K>d == n</K>, dann und nur dann ist <K>n</K> eine Primzahl.</p>
            </>}
            en={<>
              <p>A natural number <M>{t`n \ge 2`}</M> is a <b>prime number</b> if no <M>{t`d \in \{2, \dots, n-1\}`}</M> divides <M p=".">n</M> A loop that checks this:</p>
              <Code code={'int d;\nfor (d=2; n%d != 0; ++d);'} />
              <p>(The body is the null statement.) Why does it terminate? It starts with <K>d = 2</K>, and <K>d</K> grows by 1 in every pass. It ends as soon as <K>n%d == 0</K> holds. For <M>{t`n \ge 2`}</M> eventually <K>d == n</K> is reached, and then <K>n%d != 0</K> is false. The progress <K>++d</K> thus guarantees that the exit condition is reached.</p>
              <p>The loop is not an infinite loop, provided that <M>{t`n \ge 2`}</M> holds. For <K>n = 1</K> the remainder of <K>n</K> divided by <K>d</K> is 1 for all <M p=",">{t`d \ge 2`}</M> and the loop runs forever. So the loop is correct only for <M p=".">{t`n \ge 2`}</M> We should make a note of this in the program (pre-condition).</p>
              <p>The loop also does test for primes: every possible divisor <M>{t`2 \le d \le n`}</M> is checked. If it ends with <K>d == n</K>, then, and only then, <K>n</K> is a prime number.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.primeTest} inputs={['7\n', '12\n', '2\n']} label={tr('Primzahltest mit Vorbedingung', 'Prime test with pre-condition')} />
        <T
          de={<>
            <p><b>Warum steht <K>int d;</K> ausserhalb der Schleife?</b> Wir brauchen <K>d</K> noch nach der Schleife, im <K>if (n == d)</K>. Wäre es im Kopf deklariert (<K>for (int d = 2; …)</K>), wäre es nach der Schleife verschwunden. Das ist das Thema von Abschnitt 5.4, zwei Lektionen weiter.</p>
            <p>Beachte auch, dass die Schleife hier <em>gar keinen Rumpf braucht</em>: Die ganze Arbeit passiert in Bedingung und Fortschritt. Ein einsames Semikolon ist aber leicht zu übersehen. Sicherer ist es, den leeren Rumpf als <K>{'{}'}</K> zu schreiben.</p>
          </>}
          en={<>
            <p><b>Why is <K>int d;</K> outside the loop?</b> We need <K>d</K> after the loop, in the <K>if (n == d)</K>. Had it been declared in the header (<K>for (int d = 2; …)</K>), it would be gone after the loop. This is the topic of section 5.4, two lessons on.</p>
            <p>Note also that the loop <em>needs no body at all</em>: all the work happens in condition and progress. A lonely semicolon is easy to overlook, however. It is safer to write the empty body as <K>{'{}'}</K>.</p>
          </>}
        />
        <Choice
          question={<T de={<>Was berechnet die Schleife <K>for (d = 2; n % d != 0; ++d);</K> für <K>n = 15</K>, und wie oft wird die Bedingung ausgewertet?</>} en={<>What does the loop <K>for (d = 2; n % d != 0; ++d);</K> compute for <K>n = 15</K>, and how often is the condition evaluated?</>} />}
          choices={[
            { text: <T de={<><K>d = 3</K>, die Bedingung wird zweimal ausgewertet</>} en={<><K>d = 3</K>, the condition is evaluated twice</>} />, correct: true, why: <T de={<>Richtig. <K>15 % 2 = 1</K>, also weiter; <K>15 % 3 = 0</K>, also Schluss. Zwei Auswertungen (für <K>d = 2</K> und <K>d = 3</K>), und <K>d</K> bleibt bei 3: der kleinste Teiler, der mindestens 2 ist.</>} en={<>Correct. <K>15 % 2 = 1</K>, so go on; <K>15 % 3 = 0</K>, so stop. Two evaluations (for <K>d = 2</K> and <K>d = 3</K>), and <K>d</K> stays at 3: the smallest divisor that is at least 2.</>} /> },
            { text: <T de={<><K>d = 15</K>, denn 15 ist die letzte Zahl</>} en={<><K>d = 15</K>, since 15 is the last number</>} />, why: <T de={<>Die Schleife endet beim <em>ersten</em> Teiler, nicht beim letzten. Nur für Primzahlen läuft sie bis <K>d == n</K>.</>} en={<>The loop ends at the <em>first</em> divisor, not the last. Only for primes does it run up to <K>d == n</K>.</>} /> },
            { text: <T de={<><K>d = 5</K>, denn 5 teilt 15</>} en={<><K>d = 5</K>, since 5 divides 15</>} />, why: <T de={<>Die Schleife probiert <K>d</K> der Reihe nach, 3 kommt vor 5.</>} en={<>The loop tries <K>d</K> in order; 3 comes before 5.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>for (init; cond; expr) body</K>: Init einmal; dann Bedingung, Rumpf, Ausdruck, Bedingung, Rumpf, Ausdruck …, bis die Bedingung falsch ist.</li>
              <li>Die Bedingung wird <em>vor</em> jedem Durchgang geprüft, der Ausdruck läuft <em>nach</em> dem Rumpf. Ist die Bedingung von Anfang an falsch, läuft der Rumpf nie.</li>
              <li>Eine Schleife terminiert, wenn der Fortschritt die Bedingung nach endlich vielen Durchgängen falsch macht. Ob eine <em>beliebige</em> Schleife terminiert, kann kein Programm entscheiden (Halteproblem). Das musst du selbst begründen.</li>
              <li>Notiere Vorbedingungen (<K>n &gt;= 2</K>) als Kommentar; ausserhalb davon darf die Schleife falsch sein.</li>
            </ul>}
            en={<ul>
              <li><K>for (init; cond; expr) body</K>: init once; then condition, body, expression, condition, body, expression …, until the condition is false.</li>
              <li>The condition is checked <em>before</em> every pass, the expression runs <em>after</em> the body. If the condition is false from the start, the body never runs.</li>
              <li>A loop terminates if the progress makes the condition false after finitely many passes. Whether an <em>arbitrary</em> loop terminates, no program can decide (halting problem). You must justify it yourself.</li>
              <li>Write pre-conditions (<K>n &gt;= 2</K>) down as comments; outside of them the loop may be wrong.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Wir haben mehrmals «mehrere Anweisungen als Rumpf» gewünscht und die Frage offen gelassen, wo <K>d</K> und <K>i</K> eigentlich noch sichtbar sind. Beides klärt die nächste Lektion: Blöcke und Sichtbarkeit (Skript S. 53–57).</p>}
          en={<p className="connections"><b>Next:</b> several times we wished for “several statements as a body” and left open where <K>d</K> and <K>i</K> are actually still visible. The next lesson clears up both: blocks and visibility (notes pp. 53–57).</p>}
        />
      </Section>
    </article>
  );
}
