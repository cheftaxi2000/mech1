import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I3While() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Die <K>for</K>-Schleife ist ideal, wenn man vorher weiss, wie oft etwas läuft. Oft weiss man das nicht: «lies Zahlen, bis der Benutzer 0 tippt», «rechne, bis die Folge bei 1 ankommt». Dafür gibt es <K>while</K> und <K>do</K>-<K>while</K>, und für das Verlassen mitten in einer Schleife <K>break</K> und <K>continue</K>.</p>}
        en={<p className="lede">The <K>for</K> loop is ideal when you know in advance how often something runs. Often you do not: “read numbers until the user types 0”, “compute until the sequence arrives at 1”. For these there are <K>while</K> and <K>do</K>-<K>while</K>, and for leaving in the middle of a loop <K>break</K> and <K>continue</K>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="while" title={<T de="1. Die while-Schleife" en="1. The while loop" />}>
        <Box kind="lecture" src={<Src p="57–58" />} title={<T de="while" en="while" />}>
          <T
            de={<>
              <p>Die <b>while-Schleife</b> hat die Form</p>
              <Code code={'while ( condition )\n    statement'} />
              <p><K>statement</K> ist eine beliebige Anweisung, der Rumpf, und <K>condition</K> ein boolescher Ausdruck. Die Semantik: Die Bedingung wird ausgewertet. Solange sie zu <K>true</K> ausgewertet wird, wird der Rumpf ausgeführt und die Bedingung erneut ausgewertet, bis sie <K>false</K> ist. Dann endet die Schleife, und der Rechner macht mit der nächsten Anweisung weiter.</p>
              <p>Wer aufmerksam liest, merkt, dass das dasselbe ist wie</p>
              <Code code={'for (; condition; )\n    statement'} />
              <p>man könnte also jede while-Schleife als for-Schleife schreiben. Warum dann eine weitere Kontrollstruktur? Weil while-Schleifen leichter zu lesen sein können, besonders wenn der Fortschritt nicht so einfach ist wie ein Inkrement im Ausdruck der for-Schleife. Faustregel: Für eine feste Anzahl Durchgänge (Code 5.3, eine «Zählschleife») ist die for-Schleife die beste Wahl. Ist die Abbruchbedingung komplizierter, passt eine while-Schleife eher.</p>
            </>}
            en={<>
              <p>The <b>while loop</b> has the form</p>
              <Code code={'while ( condition )\n    statement'} />
              <p><K>statement</K> is an arbitrary statement, the body, and <K>condition</K> is a boolean expression. The semantics: the condition is evaluated. As long as it evaluates to <K>true</K>, the body is executed and the condition is evaluated again, until it evaluates to <K>false</K>. Then the while loop terminates and the computer moves on to the next statement.</p>
              <p>An attentive reader might have noticed that this is equivalent to</p>
              <Code code={'for (; condition; )\n    statement'} />
              <p>so one could write any while loop in terms of a for loop. Why bother with yet another control structure then? Because while loops might be easier to read, especially when the progress is not as simple as an increment in the expression of the for loop. As a rule of thumb: if you want to iterate for a fixed number of iterations (Code 5.3, a “counting loop”), the for loop is your best guess. If the termination condition is more involved, a while loop might be more suitable.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.whileSum} inputs={['4\n', '0\n']} label={tr('Dieselbe Summe wie in Code 5.1, als while-Schleife', 'The same sum as in Code 5.1, as a while loop')} />
        <T
          de={<p>Vergleiche mit der for-Version: Das Init (<K>int i = 1;</K>) steht jetzt vor der Schleife, der Fortschritt (<K>++i;</K>) im Rumpf. Beide Schleifen laufen identisch ab. Beim <K>while</K> ist aber leicht, den Fortschritt zu <em>vergessen</em>: Fehlt <K>++i;</K>, ist die Schleife endlos, denn nichts ändert die Bedingung. Bei <K>for</K> steht der Fortschritt im Kopf und kann nicht übersehen werden.</p>}
          en={<p>Compare with the for version: the init (<K>int i = 1;</K>) now stands before the loop, the progress (<K>++i;</K>) in the body. Both loops run identically. With <K>while</K> it is easy to <em>forget</em> the progress, though: without <K>++i;</K> the loop is endless, since nothing changes the condition. With <K>for</K> the progress is in the header and cannot be overlooked.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="collatz" title={<T de="2. Ein Beispiel, bei dem while besser passt: Collatz" en="2. An example where while fits better: Collatz" />}>
        <Box kind="lecture" src={<Src p="58–60" />} title={<T de="Die Collatz-Folge" en="The Collatz sequence" />}>
          <T
            de={<>
              <p>Die <b>Collatz-Folge</b> ist für <M>{t`n \in \mathbb{N}`}</M> definiert durch <M p=",">{t`n_0 = n`}</M> und für <M p=":">{t`i \ge 1`}</M></p>
              <p><M>{t`n_i = \begin{cases} n_{i-1}/2, & \text{falls } n_{i-1} \text{ gerade} \\ 3n_{i-1}+1, & \text{falls } n_{i-1} \text{ ungerade} \end{cases}`}</M></p>
              <p>Für <M>{t`n = 5`}</M> ist <M p=",">{t`n_0 = 5`}</M> dann <M>{t`n_1 = 3 n_0 + 1 = 16`}</M> (da <M>{t`n_0`}</M> ungerade), <M>{t`n_2 = n_1/2 = 8`}</M> (da <M>{t`n_1`}</M> gerade) und so weiter. Die Folge lautet <M p=".">{t`5, 16, 8, 4, 2, 1, 4, 2, 1, \dots`}</M> Sobald <M>{t`n_i = 1`}</M> gilt, wiederholt sich <M p=",">{t`4, 2, 1`}</M> für immer.</p>
              <p>Ob die Folge für jedes <M>n</M> bei 1 ankommt, wird vermutet, aber niemand kann es beweisen! Wenn nicht, könnte die while-Schleife unten für manche <M>n</M> theoretisch endlos laufen. Endlosschleifen zu erkennen kann also schwierig sein, und wir müssen aufpassen, keinen nicht terminierenden Code zu schreiben.</p>
            </>}
            en={<>
              <p>The <b>Collatz sequence</b> is defined for <M>{t`n \in \mathbb{N}`}</M> by <M p=",">{t`n_0 = n`}</M> and for <M p=":">{t`i \ge 1`}</M></p>
              <p><M>{t`n_i = \begin{cases} n_{i-1}/2, & \text{if } n_{i-1} \text{ even} \\ 3n_{i-1}+1, & \text{if } n_{i-1} \text{ odd} \end{cases}`}</M></p>
              <p>For <M>{t`n = 5`}</M> we get <M p=",">{t`n_0 = 5`}</M> then <M>{t`n_1 = 3 n_0 + 1 = 16`}</M> (since <M>{t`n_0`}</M> is odd), <M>{t`n_2 = n_1/2 = 8`}</M> (since <M>{t`n_1`}</M> is even), and so on. The resulting sequence is <M p=".">{t`5, 16, 8, 4, 2, 1, 4, 2, 1, \dots`}</M> As soon as <M p=",">{t`n_i = 1`}</M> the numbers <M>{t`4, 2, 1`}</M> repeat forever.</p>
              <p>Whether the number 1 occurs for every <M>n</M> is conjectured and believed, but nobody can prove it! If not, the while loop below could theoretically run endlessly for some <M p=".">n</M> So recognizing endless loops can be tricky, and we have to be careful not to write code that does not terminate.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.collatz} inputs={['5\n', '6\n', '1\n']} label={tr('Collatz als while-Schleife', 'Collatz as a while loop')} />
        <T
          de={<>
            <p>Die Schleife passt sofort zur Mathematik: «Solange <K>n</K> nicht 1 ist: halbiere oder verdreifache plus eins.» Man weiss nicht, <em>wie oft</em> das geschieht, nur, <em>wann es aufhört</em>. Für <K>n = 27</K> sind es 111 Schritte, und die Folge steigt dabei bis 9232, bevor sie bei 1 landet. (Das Skript listet die ganze Folge; der Test in diesem Projekt rechnet sie nach.)</p>
            <p>Die Zeile <K>for (; n != 1;)</K> würde dasselbe tun, aber sie ist schwer zu entziffern und unnatürlich. Die while-Schleife ist klar die bessere Wahl.</p>
          </>}
          en={<>
            <p>The loop matches the mathematics immediately: “as long as <K>n</K> is not 1: halve, or triple and add one.” One does not know <em>how often</em> this happens, only <em>when it stops</em>. For <K>n = 27</K> it takes 111 steps, and the sequence climbs to 9232 before it lands at 1. (The notes list the whole sequence; the test in this project recomputes it.)</p>
            <p>The line <K>for (; n != 1;)</K> would do the same, but it is hard to decipher and unnatural. The while loop is clearly the better choice.</p>
          </>}
        />
        <Listing prog={P.collatzFor} label={tr('Zum Vergleich: dieselbe Schleife als for (; … ;), schlecht lesbar', 'For comparison: the same loop as for (; … ;), poorly readable')} />
        <Box kind="tip" title={<T de="Vorbedingungen und Überläufe" en="Pre-conditions and overflow" />}>
          <T
            de={<ul>
              <li><b>Die Schleife ist nur für <K>n &gt;= 1</K> sinnvoll.</b> Für <K>n = 0</K> bleibt <K>n</K> immer 0 (gerade, halbiert ergibt wieder 0), die Schleife endet nie. Negative Zahlen laufen in andere Zyklen. Notiere die Vorbedingung als Kommentar.</li>
              <li><b>Der Datentyp zählt.</b> Die Folge wächst zwischendurch stark. Startest du mit <K>n = 113383</K>, erreicht sie 2 482 111 348, mehr als die grösste <K>int</K>-Zahl (2 147 483 647). Dann läuft der Wert über (siehe die Lektion über Ganzzahlen), und die Schleife rechnet mit Unsinn weiter. Mit <K>unsigned int</K> oder <K>long long</K> hält es länger.</li>
            </ul>}
            en={<ul>
              <li><b>The loop makes sense only for <K>n &gt;= 1</K>.</b> For <K>n = 0</K>, <K>n</K> stays 0 forever (even, halved gives 0 again), and the loop never ends. Negative numbers run into other cycles. Write the pre-condition down as a comment.</li>
              <li><b>The data type matters.</b> The sequence grows strongly in between. Start with <K>n = 113383</K> and it reaches 2 482 111 348, more than the largest <K>int</K> number (2 147 483 647). The value then overflows (see the lesson on integers), and the loop carries on calculating nonsense. With <K>unsigned int</K> or <K>long long</K> it lasts longer.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="dowhile" title={<T de="3. do-while: mindestens einmal" en="3. do-while: at least once" />}>
        <Box kind="lecture" src={<Src p="59–61" />} title={<T de="do-while" en="do-while" />}>
          <T
            de={<>
              <p>Manchmal soll eine Anweisung mindestens einmal ausgeführt werden und dann so lange, wie eine Bedingung wahr ist. Mit while ginge das so:</p>
              <Code code={'statement\nwhile (condition)\n    statement'} />
              <p>Das ist nicht empfehlenswert. Bei einer kurzen Anweisung geht es, aber bei langen Blöcken willst du nichts kopieren (und beide Versionen synchron halten!). Für dieses häufige Muster gibt es die <b>do-while-Schleife</b>:</p>
              <Code code={'do\n    statement\nwhile (condition);'} />
              <p>(Ja, hinter der Bedingung steht ein Semikolon.) Der Rumpf wird ausgeführt, <em>dann</em> wird die Bedingung geprüft. Ist sie wahr, läuft der Rumpf wieder und die Bedingung wird erneut geprüft; ist sie falsch, endet die Schleife.</p>
              <p>Ein Beispiel ist ein einfacher Taschenrechner. Er liest wiederholt ganze Zahlen ein, addiert sie und gibt die aktuelle Summe aus, bis der Benutzer 0 tippt.</p>
            </>}
            en={<>
              <p>Sometimes a statement should be executed at least once and then for as long as a condition is true. With while this could be done as follows:</p>
              <Code code={'statement\nwhile (condition)\n    statement'} />
              <p>This is not recommended. For a short statement it is not too bad, but for whole blocks you do not want to copy anything (and keep the two versions in sync!). For this frequent pattern there is the <b>do-while loop</b>:</p>
              <Code code={'do\n    statement\nwhile (condition);'} />
              <p>(Yes, there is a semicolon after the condition.) The body is executed, <em>then</em> the condition is checked. If it is true, the body runs again and the condition is checked again; if it is false, the loop ends.</p>
              <p>One example is a simple calculator. It repeatedly reads integers, adds them up and outputs the current sum, until the user types 0.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.doWhileCalc} inputs={['3\n4\n0\n', '5\n0\n', '0\n']} label={tr('Der Taschenrechner mit do-while', 'The calculator with do-while')} />
        <T
          de={<>
            <p>Die Eingabe «0» beendet das Programm; die Bedingung wird <em>erst nach</em> dem Rumpf geprüft, sodass auch bei sofortiger 0 die Eingabeaufforderung einmal erscheint.</p>
            <p>Ohne do-while müsste <K>summand</K> mit irgendeinem Wert vorbelegt werden. Welchem? Nicht 0, denn dann endete die Schleife sofort; aber jeder andere Wert würde die Summe verändern. Man kann das umgehen, indem man die Summe mit <K>-summand</K> beginnt:</p>
          </>}
          en={<>
            <p>The input “0” ends the program; the condition is checked <em>only after</em> the body, so even for an immediate 0 the prompt appears once.</p>
            <p>Without do-while, <K>summand</K> would need to be initialized with some value. Which one? Not 0, as the loop would then terminate immediately; but any other value would affect the sum. We can get around this by starting the sum at <K>-summand</K>:</p>
          </>}
        />
        <Tracer prog={P.whileCalc} inputs={['3\n4\n0\n', '0\n']} label={tr('Die while-Version mit dem Trick', 'The while version with the trick')} />
        <T
          de={<>
            <p><b>Findest du den Unterschied?</b> Sieh dir die Ausgabe an: Die while-Version schreibt zuerst «<K>sum = 0</K>», <em>bevor</em> sie überhaupt etwas gefragt hat, und ihre Reihenfolge von Frage und Antwort ist verschoben. Das Verhalten ist also nicht dasselbe. Selbst wenn es gleich wäre, wäre der Code schlechter: Der Startwert von <K>summand</K> ist beliebig, und niemand versteht ohne Erklärung, warum <K>sum</K> mit <K>-summand</K> beginnt. Mit do-while ist es natürlich.</p>
          </>}
          en={<>
            <p><b>Can you pinpoint the difference?</b> Look at the output: the while version first writes “<K>sum = 0</K>” <em>before</em> it has asked anything, and its order of question and answer is shifted. So the behavior is not the same. Even if it were, the code would be worse: the initial value of <K>summand</K> is arbitrary, and nobody understands without an explanation why <K>sum</K> starts with <K>-summand</K>. With do-while it is natural.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Zwei Stolpersteine" en="Two stumbling blocks" />}>
          <T
            de={<ul>
              <li><b>Das Semikolon nach <K>while (…)</K> beim do-while gehört dazu.</b> Fehlt es, meldet der Compiler einen Fehler. Umgekehrt ist ein Semikolon nach dem Kopf einer <em>normalen</em> while-Schleife (<K>while (…);</K>) ein leerer Rumpf, meist ein Bug.</li>
              <li><b>Variablen im do-Block sind in der Bedingung nicht sichtbar.</b> Deshalb steht <K>summand</K> im Taschenrechner <em>vor</em> dem <K>do</K>. Der Bereich des Blocks endet vor dem <K>while</K>.</li>
            </ul>}
            en={<ul>
              <li><b>The semicolon after <K>while (…)</K> of a do-while belongs there.</b> If it is missing, the compiler reports an error. Conversely, a semicolon after the header of an <em>ordinary</em> while loop (<K>while (…);</K>) is an empty body, usually a bug.</li>
              <li><b>Variables inside the do block are not visible in the condition.</b> That is why <K>summand</K> in the calculator stands <em>before</em> the <K>do</K>. The scope of the block ends before the <K>while</K>.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="sprung" title={<T de="4. break und continue" en="4. break and continue" />}>
        <Box kind="lecture" src={<Src p="61–64" />} title={<T de="Sprunganweisungen" en="Jump statements" />}>
          <T
            de={<>
              <p>Manchmal soll man eine Schleife früh verlassen oder früh zur nächsten Iteration springen. Dafür gibt es die <b>Sprunganweisungen</b> <K>break</K> und <K>continue</K>, die unbedingte Sprünge umsetzen.</p>
              <p><K>break;</K> verlässt sofort die umgebende Schleife. Das ist nützlich, um eine Schleife «in der Mitte» abzubrechen (und unverzichtbar bei <K>switch</K>, wie wir bald sehen).</p>
              <p>Im Taschenrechner addieren wir die eingegebene Zahl zur Summe und prüfen erst dann, ob die Schleife enden soll. Weil wir bei 0 enden, ändert die letzte Addition von 0 das Ergebnis nicht, aber sie ist unnötig und fehleranfällig: Was, wenn wir eine andere Zahl (etwa <K>-1</K>) zum Beenden wählen? Auf einmal ist das Ergebnis falsch! Mit einem <K>if</K> könnte man die letzten beiden Zeilen nur ausführen, wenn <K>summand</K> nicht 0 ist, das braucht aber einen zusätzlichen Block, und die Bedingung <K>summand != 0</K> wird zweimal geprüft. Einfacher ist ein <K>break</K>, sobald 0 gelesen wurde.</p>
            </>}
            en={<>
              <p>In certain situations we might want to leave a loop early or move on to the next iteration early. We can do this with so-called <b>jump statements</b>: <K>break</K> and <K>continue</K>, which implement unconditional jumps.</p>
              <p><K>break;</K> immediately leaves the enclosing loop. This is useful to be able to break a loop “in the middle” (and indispensable for <K>switch</K> statements, as we will see soon).</p>
              <p>In the calculator we first add the input number to the sum and only then check whether to terminate the loop. Since we stop at 0, the last addition of 0 does not change the result, but it is unnecessary and error-prone: what if we decide to use a different number (say, <K>-1</K>) to terminate? All of a sudden the result is wrong! With an <K>if</K> one could execute the last two lines only if <K>summand</K> is not 0, but this requires an additional block, and the condition <K>summand != 0</K> is checked twice. It is simpler to use a <K>break</K> as soon as 0 has been read.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.breakCalc} inputs={['3\n4\n0\n', '0\n']} label={tr('Taschenrechner mit break', 'Calculator with break')} />
        <T
          de={<p>Jetzt verlässt die Eingabe 0 die Schleife <em>vor</em> den beiden letzten Zeilen. Danach ist die Bedingung des <K>do-while</K> überflüssig: Wer bis ans Ende des Rumpfs kommt, weiss schon, dass <K>summand</K> nicht 0 ist. Wir vereinfachen daher zu <K>while (true)</K> mit einem bedingten <K>break</K>. Das ist eine häufig verwendete Kombination, wie im Programm oben. Du erkennst: Die Schleife endet nicht im Kopf, sondern in der Mitte, und das Programm sagt genau dort, wann.</p>}
          en={<p>Now the input 0 leaves the loop <em>before</em> the last two lines. After that the condition of the <K>do-while</K> is redundant: whoever reaches the end of the body already knows that <K>summand</K> is not 0. We therefore simplify to <K>while (true)</K> with a conditional <K>break</K>. That is a commonly used combination, as in the program above. You see: the loop does not end in the header but in the middle, and the program says exactly there when.</p>}
        />
        <Box kind="lecture" src={<Src p="63" />} title={<T de="continue" en="continue" />}>
          <T
            de={<>
              <p>Die Anweisung <K>continue;</K> springt ebenfalls aus der aktuellen Iteration, beendet aber nicht die Schleife, sondern springt zur <em>nächsten</em> Iteration und überspringt den Rest des Rumpfs. Sollen im Taschenrechner negative Zahlen nicht zur Summe addiert werden, aber (anders als 0) das Programm auch nicht beenden, genügt ein bedingtes <K>continue</K>.</p>
              <p>Negative Zahlen werden ignoriert: Nach dem Lesen einer negativen Zahl werden die drei folgenden Anweisungen übersprungen, die Schleifenbedingung (hier <K>true</K>) wird geprüft und die nächste Iteration beginnt. Insbesondere wird die Zahl nicht addiert, und die Summe wird nicht ausgegeben.</p>
            </>}
            en={<>
              <p>The statement <K>continue;</K> also “jumps” out of the current iteration, but instead of terminating the loop it jumps to the <em>next</em> iteration, skipping the rest of the body. If, in the calculator, negative numbers should not be added to the sum but also should not lead to termination (as is the case with 0), a conditional <K>continue</K> suffices.</p>
              <p>Negative numbers are ignored: after reading a negative number, the three following statements are skipped, the loop condition (here <K>true</K>) is checked and the next iteration starts. In particular, the number is not added to the sum, and the current sum is not output.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.continueCalc} inputs={['3\n-2\n4\n0\n', '-1\n-1\n0\n']} label={tr('Taschenrechner mit continue', 'Calculator with continue')} />
        <T
          de={<p>Achte darauf, was nach der <K>-2</K> passiert: Die Zeilen mit der Addition und der Ausgabe werden übersprungen, die Frage erscheint sofort wieder, und der Rest der Schleife läuft unverändert.</p>}
          en={<p>Watch what happens after the <K>-2</K>: the lines with the addition and the output are skipped, the question appears again at once, and the rest of the loop runs unchanged.</p>}
        />
        <Box kind="lecture" src={<Src p="63–64" />}>
          <T
            de={<p>Allgemein sind <K>continue</K> und <K>break</K> nützlich, um Code zu vereinfachen oder zu verkürzen, insbesondere um verschachtelte if-else-Anweisungen oder komplexe Disjunktionen zu vermeiden. Andererseits erzeugen sie zusätzliche Sprünge und verkomplizieren damit womöglich den Kontrollfluss. Sie sollten mit Bedacht und nur dort eingesetzt werden, wo sie den Kontrollfluss vereinfachen statt komplizierter zu machen. Ihr Einsatz ist umstritten und sollte sorgfältig abgewogen (und in Projekten im Team besprochen) werden.</p>}
            en={<p>In general, the jump statements <K>continue</K> and <K>break</K> are useful for simplifying (and/or shortening) the code and, in particular, for avoiding nested if-else statements or complex disjunctions. On the other hand, they result in additional jumps and therewith potentially complicate the control flow of the program. They should be used with care, only where the control is simplified instead of made more complicated. Their use is controversial and should be carefully considered (and discussed with your teammates when working on projects).</p>}
          />
        </Box>
        <Box kind="tip" title={<T de="break und continue im Kopf behalten" en="Keeping break and continue straight" />}>
          <T
            de={<ul>
              <li><b><K>break</K> verlässt, <K>continue</K> macht weiter.</b> Merke: <K>break</K> springt <em>hinter</em> die Schleife, <K>continue</K> springt ans <em>Ende des Rumpfs</em> (und bei <K>for</K> von dort in den Ausdruck <K>++i</K>).</li>
              <li><b>Beide wirken nur auf die innerste Schleife.</b> In zwei verschachtelten Schleifen verlässt ein <K>break</K> nur die innere.</li>
              <li><b>Bei <K>while</K> muss der Fortschritt vor dem <K>continue</K> stehen,</b> sonst überspringt <K>continue</K> auch das <K>++i</K>, und die Schleife läuft endlos. Bei <K>for</K> passiert das nicht, weil <K>++i</K> im Kopf steht.</li>
            </ul>}
            en={<ul>
              <li><b><K>break</K> leaves, <K>continue</K> carries on.</b> Remember: <K>break</K> jumps <em>behind</em> the loop, <K>continue</K> jumps to the <em>end of the body</em> (and with <K>for</K> from there into the expression <K>++i</K>).</li>
              <li><b>Both affect only the innermost loop.</b> In two nested loops a <K>break</K> leaves only the inner one.</li>
              <li><b>With <K>while</K> the progress must stand before the <K>continue</K>,</b> otherwise <K>continue</K> skips the <K>++i</K> as well, and the loop runs forever. With <K>for</K> this cannot happen, because <K>++i</K> is in the header.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Welche Schleife gibt die ungeraden Zahlen unter 10 aus? (Alle drei Köpfe stehen in <K>for (int i = …)</K>)</>} en={<>Which loop outputs the odd numbers below 10? (All three heads are <K>for (int i = …)</K>)</>} />}
          choices={[
            { text: <K>{'for (i = 0; i < 10; ++i) { if (i % 2 == 0) continue; cout << i; }'}</K>, correct: true, why: <T de={<>Richtig: Bei geraden <K>i</K> wird der Rest übersprungen, sonst ausgegeben: 1, 3, 5, 7, 9.</>} en={<>Correct: for even <K>i</K> the rest is skipped, otherwise printed: 1, 3, 5, 7, 9.</>} /> },
            { text: <K>{'for (i = 0; i < 10; ++i) { if (i % 2 == 0) break; cout << i; }'}</K>, why: <T de={<>Mit <K>break</K> endet die Schleife schon bei <K>i = 0</K>: Es wird nichts ausgegeben.</>} en={<>With <K>break</K> the loop ends already at <K>i = 0</K>: nothing is printed.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>while (c) s</K>: Bedingung zuerst; der Rumpf läuft nur, solange <K>c</K> wahr ist (kann auch null Mal laufen).</li>
              <li><K>do s while (c);</K>: Rumpf zuerst; läuft mindestens einmal. Das Semikolon am Ende nicht vergessen.</li>
              <li>Zählschleife → <K>for</K>. Abbruchbedingung kompliziert oder Anzahl unbekannt → <K>while</K>/<K>do-while</K>.</li>
              <li><K>break</K> verlässt die Schleife; <K>continue</K> springt zur nächsten Iteration. Setze beide sparsam ein.</li>
              <li>Jede Schleife braucht einen <em>Fortschritt</em>, der die Bedingung irgendwann falsch macht. Bei <K>while</K> musst du ihn selbst hinschreiben.</li>
            </ul>}
            en={<ul>
              <li><K>while (c) s</K>: condition first; the body runs only while <K>c</K> is true (may run zero times).</li>
              <li><K>do s while (c);</K>: body first; runs at least once. Do not forget the semicolon at the end.</li>
              <li>Counting loop → <K>for</K>. Complicated exit condition or unknown number → <K>while</K>/<K>do-while</K>.</li>
              <li><K>break</K> leaves the loop; <K>continue</K> jumps to the next iteration. Use both sparingly.</li>
              <li>Every loop needs a <em>progress</em> that eventually makes the condition false. With <K>while</K> you must write it yourself.</li>
            </ul>}
          />
        </Box>
        <Predict
          prompt={<T de={<>Schreibe <K>for (int i = 1; i &lt;= 3; ++i) s += i;</K> als while-Schleife. Was gehört wohin?</>} en={<>Write <K>for (int i = 1; i &lt;= 3; ++i) s += i;</K> as a while loop. What goes where?</>} />}
          answer={<T de={<><K>{'int i = 1; while (i <= 3) { s += i; ++i; }'}</K>. Das Init steht davor, die Bedingung im Kopf, der Fortschritt am Ende des Rumpfs. Beachte, dass <K>i</K> hier auch <em>nach</em> der Schleife sichtbar bleibt, bei <K>for</K> nicht.</>} en={<><K>{'int i = 1; while (i <= 3) { s += i; ++i; }'}</K>. The init goes before, the condition in the head, the progress at the end of the body. Note that <K>i</K> stays visible <em>after</em> the loop here, with <K>for</K> it does not.</>} />}
        />
        <T
          de={<p className="connections"><b>Weiter:</b> Jetzt kennen wir alle Schleifen. Im letzten Teil des Kapitels sehen wir, wie sich ihr Ablauf als Diagramm zeichnen lässt, wie man die passende Kontrollstruktur wählt, und die letzte Verzweigung: <K>switch</K> (Skript S. 64–70).</p>}
          en={<p className="connections"><b>Next:</b> now we know all the loops. In the last part of the chapter we see how their flow can be drawn as a diagram, how to choose the right control structure, and the last branching statement: <K>switch</K> (notes pp. 64–70).</p>}
        />
      </Section>
    </article>
  );
}
