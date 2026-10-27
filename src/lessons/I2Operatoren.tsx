import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I2Operatoren() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Vier Operatorgruppen verdienen einen genaueren Blick, weil sie sich anders verhalten, als die Mathematik erwarten lässt: die Zuweisung, die Division, das Inkrement und die Kurzformen wie <K>+=</K>.</p>}
        en={<p className="lede">Four groups of operators deserve a closer look because they behave differently from what mathematics leads one to expect: assignment, division, increment and the short forms like <K>+=</K>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="zuweisung" title={<T de="1. Die Zuweisung ist rechtsassoziativ" en="1. Assignment is right associative" />}>
        <Box kind="lecture" src={<Src p="34" />} title={<T de="Zuweisungsoperator" en="Assignment operator" />}>
          <T
            de={<ul>
              <li>Die Zuweisung <K>a = b</K> ist ein zuweisbarer Ausdruck (lvalue), man kann ihr also wieder etwas zuweisen. Daher: Was bedeutet <K>a = b = c</K>? Die Zuweisung ist <b>rechtsassoziativ</b>, also <K>a = (b = c)</K>. Das Ergebnis der Zuweisung von <K>c</K> an <K>b</K> (nämlich das neue <K>b</K>) wird <K>a</K> zugewiesen.</li>
              <li>Nützlich für Mehrfachzuweisungen wie <K>a = b = 0</K>.</li>
              <li>Rechtsassoziativ sind auch das unäre Minus und Plus; der Grund ist hier einfach, dass sie nur einen Operanden rechts haben.</li>
            </ul>}
            en={<ul>
              <li>The assignment <K>a = b</K> is itself assignable (an lvalue), so something can be assigned to it. Hence: what does <K>a = b = c</K> mean? The assignment is <b>right associative</b>, so <K>a = (b = c)</K>. The result of assigning <K>c</K> to <K>b</K> (namely the new <K>b</K>) is assigned to <K>a</K>.</li>
              <li>Useful for multiple assignments like <K>a = b = 0</K>.</li>
              <li>The unary minus and plus are right associative too; the reason there is simply that they have only an operand on the right.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Das passt zum Gedanken aus der letzten Lektion: Eine Zuweisung hat einen Wert. Bei <K>a = b = 0</K> arbeitet der Rechner von rechts nach links; zuerst wird <K>b</K> auf 0 gesetzt, und die 0 (der Wert dieser Zuweisung) landet in <K>a</K>. Gelesen von links würde es nicht gehen, denn <K>a = b</K> hätte noch den <em>alten</em> Wert von <K>b</K>.</p>}
          en={<p>This fits the thought from the last lesson: an assignment has a value. For <K>a = b = 0</K> the computer works from right to left; first <K>b</K> is set to 0, and the 0 (the value of that assignment) ends up in <K>a</K>. Reading from the left would not work, since <K>a = b</K> would still have the <em>old</em> value of <K>b</K>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="division" title={<T de="2. Division und Modulo" en="2. Division and modulo" />}>
        <Box kind="lecture" src={<Src p="34–35" />} title={<T de="Ganzzahldivision, Genauigkeitsverlust, Modulo" en="Integer division, loss of precision, modulo" />}>
          <T
            de={<>
              <p>Addition, Subtraktion und Multiplikation ganzer Zahlen liefern (in Grenzen, die wir später verstehen) das Erwartete. Der Operator <K>/</K> ist bei ganzen Zahlen die <b>ganzzahlige Division</b>: Für positive Zahlen liefert er das Ergebnis ohne Rest: <K>5 / 2</K> ergibt 2.</p>
              <p>Das hat Folgen. <M>{t`32 + 9\cdot\frac{c}{5}`}</M> und <M>{t`32 + \frac{9}{5}\cdot c`}</M> sind mathematisch gleich, in C++ aber nicht:</p>
              <p><K>32 + 9 * celsius / 5</K> liefert für 15 Grad die Ausgabe 59, <K>32 + 9 / 5 * celsius</K> die Ausgabe 47 (Beispiel 3.1).</p>
              <p><b>Richtlinie:</b> Achte auf Genauigkeitsverlust und schiebe Operationen mit möglichem Verlust nach hinten, um die Fehlerverstärkung zu vermeiden.</p>
              <p>Der Operator <K>%</K> liefert den <b>Rest</b> der ganzzahligen Division: <K>5 / 2</K> ist 2, <K>5 % 2</K> ist 1. In C++ gilt <K>(a / b) * b + a % b</K> ergibt <K>a</K> (Div-Mod-Identität) und <K>(-a) / b</K> ergibt <K>-(a / b)</K>. Daraus folgen die Ergebnisse für negative Werte (Beispiel 3.2): <K>(-3) / 5</K> ist 0 und <K>-3 % 5</K> ist -3. Mathematisch ist <M p=";">{t`-3 \bmod 5 = 2`}</M> dieses Ergebnis erhält man mit <K>(a % m + m) % m</K> (für positives <K>m</K>).</p>
            </>}
            en={<>
              <p>Addition, subtraction and multiplication of integers deliver (within limits we will understand later) the expected results. The operator <K>/</K> on integers is <b>integer division</b>: for positive numbers it delivers the result without remainder: <K>5 / 2</K> gives 2.</p>
              <p>This has consequences. <M>{t`32 + 9\cdot\frac{c}{5}`}</M> and <M>{t`32 + \frac{9}{5}\cdot c`}</M> are mathematically equal, but not in C++:</p>
              <p><K>32 + 9 * celsius / 5</K> prints 59 for 15 degrees, <K>32 + 9 / 5 * celsius</K> prints 47 (Example 3.1).</p>
              <p><b>Guideline:</b> watch out for loss of precision and postpone operations with potential loss to avoid error escalation.</p>
              <p>The operator <K>%</K> yields the <b>remainder</b> of integer division: <K>5 / 2</K> is 2, <K>5 % 2</K> is 1. In C++ <K>(a / b) * b + a % b</K> yields <K>a</K> (Div-Mod identity) and <K>(-a) / b</K> yields <K>-(a / b)</K>. From these the results for negative values follow (Example 3.2): <K>(-3) / 5</K> is 0 and <K>-3 % 5</K> is -3. Mathematically <M p=";">{t`-3 \bmod 5 = 2`}</M> that result is obtained with <K>(a % m + m) % m</K> (for positive <K>m</K>).</p>
            </>}
          />
        </Box>
        <T
          de={<p>Der Unterschied zwischen 59 und 47 ist nur die <em>Stelle</em>, an der die Division stattfindet. Bei <K>9 / 5 * celsius</K> wird zuerst <K>9 / 5</K> gerechnet, und das ist als Ganzzahldivision <K>1</K>; der Rest 4/5 ist verloren, bevor er mit <K>celsius</K> multipliziert wird. Verfolge die beiden Varianten Schritt für Schritt:</p>}
          en={<p>The difference between 59 and 47 is only the <em>place</em> where the division happens. For <K>9 / 5 * celsius</K> the <K>9 / 5</K> is computed first, and as integer division that is <K>1</K>; the remainder 4/5 is lost before it is multiplied by <K>celsius</K>. Follow both variants step by step:</p>}
        />
        <Tracer prog={P.fahrenheit} inputs={['15\n']} label={tr('Multiplizieren vor Dividieren', 'Multiply before dividing')} />
        <Tracer prog={P.fahrenheitBad} inputs={['15\n']} label={tr('Dividieren zuerst: Verlust', 'Dividing first: loss')} />
        <Listing prog={P.divMod} label={tr('Division und Modulo, auch für negative Zahlen', 'Division and modulo, also for negative numbers')} />
        <T
          de={<p>Merke die Regel dahinter: <b>C++ schneidet bei der Division Richtung 0 ab</b> (nicht nach unten). Darum ist <K>-7 / 2</K> gleich <K>-3</K> und nicht <K>-4</K>, und der Rest <K>%</K> bekommt das Vorzeichen des <em>Dividenden</em> (<K>-7 % 2</K> ist <K>-1</K>), damit die Div-Mod-Identität stimmt.</p>}
          en={<p>Remember the rule behind it: <b>C++ truncates toward 0 in division</b> (not downward). That is why <K>-7 / 2</K> equals <K>-3</K> and not <K>-4</K>, and the remainder <K>%</K> takes the sign of the <em>dividend</em> (<K>-7 % 2</K> is <K>-1</K>) so that the Div-Mod identity holds.</p>}
        />
        <Predict
          prompt={<T de={<>Wie berechnest du in C++ den mathematischen Rest <M p=",">{t`-3 \bmod 5`}</M> der in <M>{t`\{0,\dots,4\}`}</M> liegt? Warum reicht <K>a % m + m</K> nicht ganz?</>} en={<>How do you compute in C++ the mathematical remainder <M p=",">{t`-3 \bmod 5`}</M> which lies in <M p="?">{t`\{0,\dots,4\}`}</M> Why is <K>a % m + m</K> not quite enough?</>} />}
          answer={<T
            de={<><K>(a % m + m) % m</K>. Für <K>a = -3</K> ist <K>a % m = -3</K>, plus <K>m</K> ergibt 2, und das äussere <K>% m</K> ändert nichts. Für positives <K>a = 3</K> ist <K>a % m + m = 8</K>: zu gross, erst das äussere <K>% m</K> bringt es auf 3 zurück. Darum braucht man beide Schritte, um für alle Vorzeichen im Bereich <M>{t`0\ldots m-1`}</M> zu landen.</>}
            en={<><K>(a % m + m) % m</K>. For <K>a = -3</K> we have <K>a % m = -3</K>, plus <K>m</K> gives 2, and the outer <K>% m</K> changes nothing. For positive <K>a = 3</K>, <K>a % m + m = 8</K>: too large, only the outer <K>% m</K> brings it back to 3. That is why both steps are needed to land in the range <M>{t`0\ldots m-1`}</M> for every sign.</>}
          />}
        />
        <Listing prog={P.modPositive} label={tr('Mathematischer Rest', 'Mathematical remainder')} />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="inkrement" title={<T de="3. Inkrement und Dekrement" en="3. Increment and decrement" />}>
        <Box kind="lecture" src={<Src p="35–36" />} title={<T de="Inkrement- und Dekrementoperatoren" en="Increment and decrement operators" />}>
          <T
            de={<>
              <p>Eine ganzzahlige Variable um 1 zu erhöhen ist so häufig, dass es dafür Operatoren gibt. <K>a = a + 1</K> hat kleine Nachteile: Der Ausdruck ist lang, und <K>a</K> wird zweimal ausgewertet (relevant, wenn <K>a</K> durch einen aufwendigen Ausdruck oder einen mit Nebenwirkung ersetzt wird).</p>
              <ul>
                <li><b>Post-Inkrement</b> <K>expr++</K> und <b>Prä-Inkrement</b> <K>++expr</K> haben denselben Effekt: Der Wert von <K>expr</K> wird um 1 erhöht. <K>expr</K> muss zuweisbar sein, also eine Adresse haben.</li>
                <li>Verschieden ist ihr <b>Wert</b>: <K>expr++</K> liefert den <b>alten</b> Wert, <K>++expr</K> den <b>neuen</b>. Das Prä-Inkrement ist ausserdem ein Ausdruck mit Adresse (der von <K>expr</K>).</li>
                <li><K>expr--</K> und <K>--expr</K> funktionieren analog mit Verringern.</li>
              </ul>
              <p>Beispiel 3.3: <K>int a = 7; ++a</K> gibt 8 aus; danach <K>a++</K> ebenfalls 8; danach <K>a</K> gibt 9 aus. Die Anweisungen <K>++a;</K> und <K>a++;</K> sind gleichwertig, weil der Wert ignoriert wird.</p>
            </>}
            en={<>
              <p>Incrementing an integer variable by 1 is so frequent that there are operators for it. <K>a = a + 1</K> has minor disadvantages: the expression is long, and <K>a</K> is evaluated twice (relevant when <K>a</K> is replaced by an expensive expression or one with a side effect).</p>
              <ul>
                <li><b>Post-increment</b> <K>expr++</K> and <b>pre-increment</b> <K>++expr</K> have the same effect: the value of <K>expr</K> is increased by 1. <K>expr</K> must be assignable, i.e. have an address.</li>
                <li>Their <b>value</b> differs: <K>expr++</K> yields the <b>old</b> value, <K>++expr</K> the <b>new</b> one. The pre-increment is also an expression with an address (that of <K>expr</K>).</li>
                <li><K>expr--</K> and <K>--expr</K> work analogously with decreasing.</li>
              </ul>
              <p>Example 3.3: <K>int a = 7; ++a</K> prints 8; then <K>a++</K> prints 8 as well; then <K>a</K> prints 9. The statements <K>++a;</K> and <K>a++;</K> are equivalent because the value is ignored.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.incDecEx} label={tr('Prä- und Post-Inkrement', 'Pre- and post-increment')} />
        <T
          de={<p>Die Faustregel zum Merken: <b>Das <K>++</K> steht dort, wo das Erhöhen stattfindet, relativ zum Lesen.</b> Bei <K>a++</K> wird erst gelesen (alter Wert), dann erhöht; bei <K>++a</K> erst erhöht, dann gelesen. Im Schritt oben siehst du es in der Ausgabe: Beide Zeilen drucken 8, aber nach der zweiten steht in <K>a</K> bereits 9.</p>}
          en={<p>The rule of thumb: <b>the <K>++</K> sits where the increasing takes place relative to the reading.</b> With <K>a++</K> it is read first (old value), then increased; with <K>++a</K> increased first, then read. In the step above you see it in the output: both lines print 8, but after the second one <K>a</K> already holds 9.</p>}
        />
        <Box kind="tip" title={<T de="Weniger irren mit ++" en="Fewer mistakes with ++" />}>
          <T
            de={<ul>
              <li><b>Benutze <K>++</K> als eigene Anweisung</b> (<K>++i;</K> oder <K>i++;</K>), nicht mitten in einem Ausdruck. Dann ist der Unterschied zwischen Prä und Post bedeutungslos, und die Zeile ist leicht zu lesen.</li>
              <li><b>Nie dieselbe Variable zweimal im Ausdruck</b>, wenn <K>++</K> sie ändert: <K>a * a++</K> verstösst gegen die Richtlinie des letzten Abschnitts, denn welches <K>a</K> zuerst gelesen wird, ist offen.</li>
              <li>Im Zweifel in zwei Zeilen schreiben: erst rechnen, dann erhöhen.</li>
            </ul>}
            en={<ul>
              <li><b>Use <K>++</K> as a statement of its own</b> (<K>++i;</K> or <K>i++;</K>), not in the middle of an expression. Then the difference between pre and post is meaningless and the line is easy to read.</li>
              <li><b>Never the same variable twice in an expression</b> if <K>++</K> changes it: <K>a * a++</K> violates the guideline of the last section, because which <K>a</K> is read first is open.</li>
              <li>When in doubt write two lines: compute first, then increment.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="kurzformen" title={<T de="4. Arithmetische Zuweisungen" en="4. Arithmetic assignments" />}>
        <Box kind="lecture" src={<Src p="36" />} title={<T de="a += b" en="a += b" />}>
          <T
            de={<p>Um eine Variable um einen anderen Wert als 1 zu verändern, oder um einen erst zur Laufzeit bekannten, gibt es <b>arithmetische Zuweisungen</b>: <K>a += b</K> ist gleichwertig zu <K>a = a + b</K> (abgesehen davon, wie oft <K>a</K> ausgewertet wird). Analog <K>-=</K>, <K>*=</K>, <K>/=</K> und <K>%=</K>.</p>}
            en={<p>To change a variable by a value other than 1, or by one only known at run time, there are <b>arithmetic assignments</b>: <K>a += b</K> is equivalent to <K>a = a + b</K> (ignoring how often <K>a</K> is evaluated). Analogously <K>-=</K>, <K>*=</K>, <K>/=</K> and <K>%=</K>.</p>}
          />
        </Box>
        <Tracer prog={P.arithAssign} label={tr('Fünf Kurzformen hintereinander', 'Five short forms in a row')} />
        <T
          de={<p>Jede Zeile liest den alten Wert und schreibt den neuen zurück; die Operatoren sind Ganzzahloperatoren, also schneidet <K>a /= 5</K> bei 24 auf 4 ab. <K>a /= 5</K> heisst «teile <K>a</K> durch 5», <b>nicht</b> «teile 5 durch <K>a</K>»: Die Variable steht immer links.</p>}
          en={<p>Every line reads the old value and writes the new one back; the operators are integer operators, so <K>a /= 5</K> truncates 24 to 4. <K>a /= 5</K> means “divide <K>a</K> by 5”, <b>not</b> “divide 5 by <K>a</K>”: the variable is always on the left.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Typische Missverständnisse" en="5. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<K>double d = 5 / 2;</K> ergibt 2.5.»</>} en={<>“<K>double d = 5 / 2;</K> gives 2.5.”</>} />}>
          <T
            de={<>Nein, 2. Der Ausdruck <K>5 / 2</K> wird zuerst als <em>Ganzzahldivision</em> ausgewertet, denn beide Operanden sind <K>int</K>; erst das Ergebnis 2 wird nach <K>double</K> umgewandelt. Du brauchst eine Kommazahl <em>im Ausdruck</em>: <K>5 / 2.0</K>. Das Ziel der Zuweisung ändert nie, wie die rechte Seite gerechnet wird.</>}
            en={<>No, 2. The expression <K>5 / 2</K> is evaluated first as <em>integer division</em>, because both operands are <K>int</K>; only the result 2 is then converted to <K>double</K>. You need a floating point number <em>in the expression</em>: <K>5 / 2.0</K>. The target of the assignment never changes how the right-hand side is computed.</>}
          />
        </Box>
        <Listing prog={P.intDivDouble} label={tr('Das Ziel entscheidet nicht', 'The target does not decide')} />
        <Box kind="misconception" title={<T de="«-3 % 5 ist 2.»" en="“-3 % 5 is 2.”" />}>
          <T
            de={<>In der Mathematik ja, in C++ ist es <K>-3</K>. Der Rest hat das Vorzeichen des Dividenden. Wer eine Position in einem Ring ausrechnet (Wochentage, Indizes), braucht <K>(a % m + m) % m</K>.</>}
            en={<>In mathematics yes, in C++ it is <K>-3</K>. The remainder has the sign of the dividend. Whoever computes a position on a ring (weekdays, indices) needs <K>(a % m + m) % m</K>.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«a++ und ++a sind immer gleich.»" en="“a++ and ++a are always the same.”" />}>
          <T
            de={<>Beide erhöhen <K>a</K>; ihr <em>Wert</em> unterscheidet sich (alt gegen neu). Das merkt man nur, wenn man den Wert benutzt. Als eigene Anweisung sind sie gleichwertig.</>}
            en={<>Both increase <K>a</K>; their <em>value</em> differs (old versus new). You only notice when you use the value. As a statement of their own they are equivalent.</>}
          />
        </Box>
        <Choice
          question={<T de={<>Was gibt <K>std::cout &lt;&lt; -7 / 2 &lt;&lt; " " &lt;&lt; -7 % 2;</K> aus?</>} en={<>What does <K>std::cout &lt;&lt; -7 / 2 &lt;&lt; " " &lt;&lt; -7 % 2;</K> print?</>} />}
          choices={[
            { text: <code>-4 1</code>, why: <T de="Das wäre die mathematische Rundung nach unten mit nichtnegativem Rest. C++ schneidet aber Richtung 0 ab." en="That would be mathematical rounding down with a non-negative remainder. C++ truncates toward 0 though." /> },
            { text: <code>-3 -1</code>, correct: true, why: <T de={<>Ja: <K>-7 / 2</K> wird auf <K>-3</K> abgeschnitten, und der Rest ist <K>-7 - (-3)·2 = -1</K>, so dass die Div-Mod-Identität stimmt.</>} en={<>Yes: <K>-7 / 2</K> is truncated to <K>-3</K>, and the remainder is <K>-7 - (-3)·2 = -1</K>, so that the Div-Mod identity holds.</>} /> },
            { text: <code>-3.5 -1</code>, why: <T de="Nein, beide Operanden sind int: Es ist Ganzzahldivision, kein Bruch." en="No, both operands are int: this is integer division, not a fraction." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Zuweisung ist rechtsassoziativ: <K>a = b = 0</K> setzt zuerst <K>b</K>. Ihr Wert ist die linke Seite.</li>
              <li>Ganzzahldivision schneidet Richtung 0 ab; <K>%</K> hat das Vorzeichen des Dividenden; es gilt <K>(a / b) * b + a % b == a</K>. Die Zielvariable entscheidet nicht, wie gerechnet wird.</li>
              <li>Schiebe Divisionen nach hinten, damit möglichst wenig Genauigkeit verloren geht.</li>
              <li><K>a++</K> liefert den alten, <K>++a</K> den neuen Wert. Als eigene Anweisung gleichwertig; nie mehrfach im selben Ausdruck.</li>
              <li><K>a += b</K> ist <K>a = a + b</K>, ebenso für <K>-=</K>, <K>*=</K>, <K>/=</K>, <K>%=</K>.</li>
            </ul>}
            en={<ul>
              <li>Assignment is right associative: <K>a = b = 0</K> sets <K>b</K> first. Its value is the left-hand side.</li>
              <li>Integer division truncates toward 0; <K>%</K> has the sign of the dividend; <K>(a / b) * b + a % b == a</K> holds. The target variable does not decide how it is computed.</li>
              <li>Postpone divisions so that as little precision as possible is lost.</li>
              <li><K>a++</K> yields the old, <K>++a</K> the new value. Equivalent as a statement of their own; never several times in the same expression.</li>
              <li><K>a += b</K> is <K>a = a + b</K>, likewise for <K>-=</K>, <K>*=</K>, <K>/=</K>, <K>%=</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Jede Variable ist ein Stück Speicher fester Grösse. Was heisst das für die Zahlen, die eine <K>int</K>-Variable aufnehmen kann (Skript S. 37–40)?</p>}
          en={<p className="connections"><b>Next:</b> every variable is a piece of memory of fixed size. What does that mean for the numbers an <K>int</K> variable can hold (notes pp. 37–40)?</p>}
        />
      </Section>
    </article>
  );
}
