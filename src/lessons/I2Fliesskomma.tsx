import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { FloatInspector } from '../viz/info/FloatInspector';
import { SciNotation } from '../viz/info/SciNotation';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I2Fliesskomma() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Mit <K>int</K> kommt man nur bis zur nächsten ganzen Zahl. Für Kommazahlen gibt es <K>float</K> und <K>double</K>: ein riesiger Wertebereich, bezahlt mit einer neuen Art von Fehler. Nicht jede Zahl, die man hinschreiben kann, lässt sich speichern.</p>}
        en={<p className="lede">With <K>int</K> you only get as far as the next whole number. For fractional numbers there are <K>float</K> and <K>double</K>: a huge range of values, paid for with a new kind of error. Not every number you can write down can be stored.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="warum" title={<T de="1. Warum nicht einfach int?" en="1. Why not simply int?" />}>
        <Box kind="lecture" src={<Src p="40–41" />} title={<T de="Ganzzahlige Division verliert den Rest" en="Integer division loses the remainder" />}>
          <T
            de={<>
              <p>Das Programm rechnet eine Temperatur von Celsius nach Fahrenheit um, mit <M p=".">{t`t_F = \frac{9\cdot t_C}{5} + 32`}</M> Für eine Eingabe wie 16 Grad erwartet man 60,8. Ausgegeben wird aber 60. Haben wir dem Programm gesagt, es soll abrunden? Nein, es passiert implizit: Bei Ausdrücken, die nur <K>int</K> enthalten, ist <K>/</K> die Ganzzahldivision (sie rundet Richtung 0), und das Ergebnis ist wieder <K>int</K>.</p>
              <p>Für Kommazahlen nimmt man den Typ <K>float</K> (oder <K>double</K>). Der Ausdruck <K>9 * celsius / 5 + 32</K> enthält jetzt <K>int</K> und <K>float</K>. C++ wandelt die <K>int</K>-Werte automatisch nach <K>float</K> um, es wird die «richtige» Division benutzt, und das Ergebnis hat den Typ <K>float</K>. Ein Hinweis: Für 15 Grad ergeben beide Programme 59; die Werte 60,8 und 60 gehören zu 16 Grad (I-003).</p>
            </>}
            en={<>
              <p>The program converts a temperature from Celsius to Fahrenheit using <M p=".">{t`t_F = \frac{9\cdot t_C}{5} + 32`}</M> For an input like 16 degrees one expects 60.8. What is printed is 60. Did we tell the program to round down? No, it happens implicitly: for expressions containing only <K>int</K>, <K>/</K> is integer division (it rounds toward 0), and the result is <K>int</K> again.</p>
              <p>For fractional numbers one uses the type <K>float</K> (or <K>double</K>). The expression <K>9 * celsius / 5 + 32</K> now contains <K>int</K> and <K>float</K>. C++ converts the <K>int</K> values to <K>float</K> automatically, the “proper” division is used, and the result has type <K>float</K>. A remark: for 15 degrees both programs give 59; the values 60.8 and 60 belong to 16 degrees (I-003).</p>
            </>}
          />
        </Box>
        <Tracer prog={P.fahrenheitInt} inputs={['16\n', '15\n']} label={tr('Mit int', 'With int')} />
        <Tracer prog={P.fahrenheitFloat} inputs={['16\n', '15\n']} label={tr('Mit float', 'With float')} />
        <T
          de={<p>Zwei Dinge, auf die du achten kannst. In der Tabelle steht bei <K>celsius</K> jetzt der Typ <K>float</K>, und die Ausgabe zeigt <K>60.8</K> (<K>std::cout</K> gibt Kommazahlen mit einem Punkt aus). Und im Ausdruck wandelt C++ die Literale 9, 5 und 32 vor der Rechnung nach <K>float</K> um: «Kommazahlen sind allgemeiner als ganze Zahlen».</p>}
          en={<p>Two things you can watch. The table now shows the type <K>float</K> for <K>celsius</K>, and the output shows <K>60.8</K> (<K>std::cout</K> prints floating point numbers with a point). And in the expression C++ converts the literals 9, 5 and 32 to <K>float</K> before computing: “floating point numbers are more general than integers”.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="typen" title={<T de="2. float, double und ihre Literale" en="2. float, double and their literals" />}>
        <Box kind="lecture" src={<Src p="41–42" fig="Fig. 4.1" />} title={<T de="Gleitkommazahlen in C++" en="Floating point numbers in C++" />}>
          <T
            de={<ul>
              <li>Die Typen <K>float</K> (Gleitkommazahl) und <K>double</K> (doppelte Genauigkeit) nähern die reellen Zahlen <M>{t`\mathbb{R}`}</M> an. Sie haben einen grossen Bereich, ausreichend für die meisten Anwendungen: <K>float</K> hat ungefähr 7 Stellen für die Mantisse und einen Exponenten bis <M p=",">\pm 38</M> <K>double</K> hat 15 Stellen und einen Exponenten bis <M p=".">\pm 308</M></li>
              <li>Gleitkommaliterale unterscheiden sich von ganzzahligen: Sie haben einen Dezimalpunkt und/oder einen Exponenten (wissenschaftliche Schreibweise). Standardmässig ist ein Literal ein <K>double</K>; mit angehängtem <K>f</K> ein <K>float</K>.</li>
              <li>Die Rechenoperationen sind analog zu denen für ganze Zahlen. Unterschiede: <K>/</K> ist die «richtige», reellwertige Division, und für Kommazahlen gibt es kein <K>%</K>. Gleitkommaarithmetik ist auf den meisten Rechnern dank Hardwareunterstützung schnell.</li>
              <li>In gemischten Ausdrücken werden ganze Zahlen vor der Auswertung in Gleitkommazahlen umgewandelt.</li>
            </ul>}
            en={<ul>
              <li>The types <K>float</K> (floating point number) and <K>double</K> (double precision) approximate the real numbers <M p=".">{t`\mathbb{R}`}</M> They have a large range, sufficient for most applications: <K>float</K> has about 7 digits for the mantissa and an exponent up to <M p=",">\pm 38</M> <K>double</K> has 15 digits and an exponent up to <M p=".">\pm 308</M></li>
              <li>Floating point literals differ from integral ones: they have a decimal point and/or an exponent (scientific notation). By default a literal is a <K>double</K>; with an appended <K>f</K> a <K>float</K>.</li>
              <li>The arithmetic operations are analogous to those for integers. Differences: <K>/</K> is the “proper”, real-valued division, and there is no <K>%</K> for floating point numbers. Floating point arithmetic is fast on most computers thanks to hardware support.</li>
              <li>In mixed expressions integers are converted to floating point numbers before evaluation.</li>
            </ul>}
          />
        </Box>
        <SciNotation />
        <Listing prog={P.floatLiterals} label={tr('Fünf Literale', 'Five literals')} />
        <table className="plain lit">
          <thead><tr><th>{tr('Literal', 'Literal')}</th><th>{tr('Typ', 'Type')}</th><th>{tr('Wert', 'Value')}</th></tr></thead>
          <tbody>
            <tr><td><K>1.0</K></td><td><K>double</K></td><td><M>1</M></td></tr>
            <tr><td><K>1.27f</K></td><td><K>float</K></td><td><M>{t`1{,}27`}</M></td></tr>
            <tr><td><K>1e3</K></td><td><K>double</K></td><td><M>1000</M></td></tr>
            <tr><td><K>1.23e-7</K></td><td><K>double</K></td><td><M>{t`1{,}23\cdot 10^{-7}`}</M></td></tr>
            <tr><td><K>1.23e-7f</K></td><td><K>float</K></td><td><M>{t`1{,}23\cdot 10^{-7}`}</M></td></tr>
          </tbody>
        </table>
        <T
          de={<p>Der Wert <K>1.0</K> wird als <K>1</K> ausgegeben und <K>1e3</K> als <K>1000</K>: <K>std::cout</K> zeigt höchstens sechs signifikante Stellen und lässt überflüssige Nullen weg; sehr kleine und sehr grosse Zahlen erscheinen mit Exponent (<K>1.23e-07</K>). Das ist eine Eigenschaft der <em>Ausgabe</em>, nicht der gespeicherten Zahl.</p>}
          en={<p>The value <K>1.0</K> is printed as <K>1</K> and <K>1e3</K> as <K>1000</K>: <K>std::cout</K> shows at most six significant digits and leaves out superfluous zeros; very small and very large numbers appear with an exponent (<K>1.23e-07</K>). That is a property of the <em>output</em>, not of the stored number.</p>}
        />
        <Box kind="tip" title={<T de="Typfehler beim Rechnen mit Kommazahlen" en="Type errors when computing with fractional numbers" />}>
          <T
            de={<ul>
              <li><b>Eine Kommazahl irgendwo im Ausdruck genügt.</b> <K>5 / 2.0</K> ist 2.5. Aber <K>1 / 2 * 3.0</K> ist 0, weil <K>1 / 2</K> zuerst als Ganzzahldivision gerechnet wird (Vorrang und Assoziativität von der letzten Lektion).</li>
              <li><b>Kein <K>%</K> für Kommazahlen:</b> <K>int a = 3 % 2.5;</K> ergibt den Fehler <K>invalid operands of types 'int' and 'double' to binary 'operator%'</K>.</li>
              <li><b><K>double</K> ist die Standardwahl.</b> Ein <K>float</K> hat nur etwa 7 Stellen; ein <K>double</K> kostet kaum mehr, und viele Rundungsprobleme werden sehr viel seltener.</li>
            </ul>}
            en={<ul>
              <li><b>One floating point number anywhere in the expression is enough.</b> <K>5 / 2.0</K> is 2.5. But <K>1 / 2 * 3.0</K> is 0, because <K>1 / 2</K> is computed first as integer division (precedence and associativity from the last lesson).</li>
              <li><b>No <K>%</K> for floating point numbers:</b> <K>int a = 3 % 2.5;</K> gives the error <K>invalid operands of types 'int' and 'double' to binary 'operator%'</K>.</li>
              <li><b><K>double</K> is the default choice.</b> A <K>float</K> has only about 7 digits; a <K>double</K> costs hardly more, and many rounding problems become far rarer.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="loecher" title={<T de="3. Die Löcher im Zahlenstrahl" en="3. The holes in the number line" />}>
        <Box kind="lecture" src={<Src p="42" />} title={<T de="Ein Programm, das nicht 0 ausgibt" en="A program that does not print 0" />}>
          <T
            de={<>
              <p>Das Programm liest zwei Zahlen <K>n1</K> und <K>n2</K> und ihre erwartete Differenz <K>d</K> und gibt <K>n1 - n2 - d</K> aus. Erwartet wird 0. Bei den Eingaben 4, 3 und 1 erscheint auch 0. Bei 1.1, 1.0 und 0.1 aber <K>2.23517e-8</K>.</p>
              <p>Was ist passiert? Offenbar lassen sich gewisse Zahlen nicht als Gleitkommazahl darstellen. Ganze Zahlen haben einen kleineren Bereich und laufen häufiger über, aber der Bereich ist <b>lückenlos</b>: jede Zahl dazwischen ist darstellbar. Gleitkommazahlen haben einen riesigen Bereich, Überläufe sind selten, aber nicht jeder Wert ist darstellbar: Es gibt <b>Löcher</b>. Während <M>{t`\mathbb{R}`}</M> lückenlos ist, sind Gleitkommazahlen es nicht. (Wie sie als Bitfolgen dargestellt werden, lernen wir später.)</p>
            </>}
            en={<>
              <p>The program reads two numbers <K>n1</K> and <K>n2</K> and their expected difference <K>d</K> and prints <K>n1 - n2 - d</K>. 0 is expected. For the inputs 4, 3 and 1 it prints 0. For 1.1, 1.0 and 0.1, however, it prints <K>2.23517e-8</K>.</p>
              <p>What happened? Evidently certain numbers cannot be represented as a floating point number. Integers have a smaller range and overflow more often, but the range is <b>contiguous</b>: every number in between is representable. Floating point numbers have a huge range, overflows are rare, but not every value is representable: there are <b>holes</b>. While <M>{t`\mathbb{R}`}</M> is contiguous, floating point numbers are not. (How they are represented as bit strings we learn later.)</p>
            </>}
          />
        </Box>
        <Tracer prog={P.floatDiff} inputs={['4 3 1\n', '1.1 1.0 0.1\n']} label={tr('n1 - n2 - d', 'n1 - n2 - d')} />
        <T
          de={<p>Die Tabelle zeigt <K>n1</K>, <K>n2</K> und <K>d</K> mit den Werten, die <K>float</K> wirklich speichert (nur auf die kürzeste Schreibweise gerundet): <K>1.1</K> wird zu <K>1.1</K>, aber in der letzten Stelle nicht exakt. Beim Ausrechnen von <K>n1 - n2 - d</K> bleibt ein kleiner Rest übrig. Um zu sehen, <em>warum</em> es keine exakte Darstellung gibt, rechne den Wert, der wirklich gespeichert wird, bis zum Ende aus:</p>}
          en={<p>The table shows <K>n1</K>, <K>n2</K> and <K>d</K> with the values <K>float</K> really stores (rounded only to the shortest notation): <K>1.1</K> becomes <K>1.1</K>, but not exactly in the last digit. When <K>n1 - n2 - d</K> is computed a small remainder is left. To see <em>why</em> there is no exact representation, work out the value that is really stored to the last digit:</p>}
        />
        <FloatInspector />
        <T
          de={<p>Die Antwort ist dieselbe wie bei <M>{t`\tfrac13`}</M> im Dezimalsystem: <M>{t`0{,}333\ldots`}</M> hört nie auf und muss irgendwo abgeschnitten werden. Der Rechner zählt in Zweierpotenzen. Ein Bruch wie <M p=",">{t`\tfrac12`}</M> <M>{t`\tfrac14`}</M> oder <M>{t`\tfrac34`}</M> ist darin <em>endlich</em> (probiere <K>0.5</K> oder <K>0.75</K>: «exakt»), aber <M>{t`\tfrac1{10}`}</M> ist es nicht: In Zweierpotenzen geschrieben hört <M>{t`0{,}1`}</M> nie auf und wird nach 24 (<K>float</K>) beziehungsweise 53 (<K>double</K>) Stellen gerundet. Gespeichert ist die <em>nächstgelegene</em> darstellbare Zahl, und die unterscheidet sich in der Regel in der letzten Stelle. Das ist keine Ungenauigkeit eines bestimmten Rechners, sondern folgt aus der Art, Zahlen zu speichern (Fachbegriff: Gleitkommadarstellung).</p>}
          en={<p>The answer is the same as for <M>{t`\tfrac13`}</M> in the decimal system: <M>{t`0.333\ldots`}</M> never ends and has to be cut off somewhere. The computer counts in powers of two. A fraction like <M p=",">{t`\tfrac12`}</M> <M>{t`\tfrac14`}</M> or <M>{t`\tfrac34`}</M> is <em>finite</em> in it (try <K>0.5</K> or <K>0.75</K>: “exact”), but <M>{t`\tfrac1{10}`}</M> is not: written in powers of two, <M>{t`0.1`}</M> never ends and is rounded after 24 (<K>float</K>) or 53 (<K>double</K>) digits. What is stored is the <em>nearest</em> representable number, and it usually differs in the last digit. That is not an inaccuracy of a particular computer but follows from the way numbers are stored (technical term: floating point representation).</p>}
        />
        <Predict
          prompt={<T de={<>Was gibt <K>double a = 0.1; double b = 0.2; double s = a + b; std::cout &lt;&lt; (s == 0.3);</K> aus? <K>==</K> vergleicht auf Gleichheit und liefert 1 für wahr und 0 für falsch.</>} en={<>What does <K>double a = 0.1; double b = 0.2; double s = a + b; std::cout &lt;&lt; (s == 0.3);</K> print? <K>==</K> compares for equality and yields 1 for true and 0 for false.</>} />}
          answer={<T
            de={<>Es erscheint <K>0</K>: <K>0.1 + 0.2</K> ist <em>nicht</em> gleich <K>0.3</K>. Jede der drei Zahlen ist durch die nächstgelegene darstellbare ersetzt, und bei der Addition entsteht ein Wert, der um etwa <M>{t`5{,}6\cdot 10^{-17}`}</M> abweicht (siehe unten die Tabelle). <b>Regel:</b> Vergleiche Kommazahlen nie mit <K>==</K>, sondern frage, ob der Abstand klein genug ist (kommt mit den Bedingungen).</>}
            en={<>It prints <K>0</K>: <K>0.1 + 0.2</K> is <em>not</em> equal to <K>0.3</K>. Each of the three numbers is replaced by the nearest representable one, and the addition produces a value that deviates by about <M>{t`5.6\cdot 10^{-17}`}</M> (see the table below). <b>Rule:</b> never compare floating point numbers with <K>==</K>; ask whether the distance is small enough (this comes with conditions).</>}
          />}
        />
        <Tracer prog={P.sumPoint} label={tr('0.1 + 0.2', '0.1 + 0.2')} />
        <Box kind="tip" title={<T de="Umgang mit Kommazahlen" en="Dealing with floating point numbers" />}>
          <T
            de={<ul>
              <li><b>Kommazahlen sind Näherungen, ganze Zahlen sind exakt</b> (solange sie in den Bereich passen). Wer Anzahlen oder Geldbeträge in Rappen zählt, nimmt <K>int</K>.</li>
              <li><b>Ein kleiner Rest ist normal.</b> Ein «<K>2.23517e-8</K>» statt 0 ist kein Programmfehler, sondern der Preis der Darstellung. Rechne damit, wenn du Ergebnisse prüfst.</li>
              <li><b>Ausgabe ist gerundet:</b> <K>std::cout</K> zeigt sechs Stellen. Dass <K>0.1 + 0.2</K> als <K>0.3</K> erscheint und trotzdem <K>== 0.3</K> falsch ist, ist kein Widerspruch: Die Ausgabe rundet, der Vergleich nicht.</li>
              <li><b>Löcher sind relativ.</b> Bei grossen Zahlen sind sie grösser: Je grösser der Wert, desto grösser der Abstand zum nächsten Nachbarn (siehe die Spalte «Abstand» oben).</li>
            </ul>}
            en={<ul>
              <li><b>Floating point numbers are approximations, integers are exact</b> (as long as they fit the range). Whoever counts quantities or amounts of money in cents uses <K>int</K>.</li>
              <li><b>A small remainder is normal.</b> A “<K>2.23517e-8</K>” instead of 0 is not a program error but the price of the representation. Expect it when you check results.</li>
              <li><b>Output is rounded:</b> <K>std::cout</K> shows six digits. That <K>0.1 + 0.2</K> appears as <K>0.3</K> and yet <K>== 0.3</K> is false is no contradiction: the output rounds, the comparison does not.</li>
              <li><b>Holes are relative.</b> For large numbers they are larger: the larger the value, the larger the distance to the next neighbour (see the column “gap” above).</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Welche dieser Zahlen lässt sich als <K>double</K> <em>exakt</em> speichern?</>} en={<>Which of these numbers can be stored <em>exactly</em> as a <K>double</K>?</>} />}
          choices={[
            { text: <code>0.1</code>, why: <T de="Nein: 1/10 ist in Zweierpotenzen nicht endlich. Probiere es im Feld oben aus." en="No: 1/10 is not finite in powers of two. Try it in the field above." /> },
            { text: <code>0.75</code>, correct: true, why: <T de={<>Ja: <M>{t`0{,}75 = \tfrac12 + \tfrac14`}</M> ist eine Summe von Zweierpotenzen und deshalb endlich im Zweiersystem.</>} en={<>Yes: <M>{t`0.75 = \tfrac12 + \tfrac14`}</M> is a sum of powers of two and therefore finite in the binary system.</>} /> },
            { text: <code>0.3</code>, why: <T de="Nein: 3/10 hat im Zweiersystem unendlich viele Stellen, genau wie 1/10." en="No: 3/10 has infinitely many digits in the binary system, just like 1/10." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Typische Missverständnisse" en="4. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«double ist exakt, float ist ungenau.»" en="“double is exact, float is imprecise.”" />}>
          <T
            de={<>Beide sind Näherungen; <K>double</K> hat nur mehr Stellen (15 statt 7) und daher feinere Lücken. Auch bei <K>double</K> ist <K>0.1 + 0.2</K> nicht <K>0.3</K>.</>}
            en={<>Both are approximations; <K>double</K> merely has more digits (15 instead of 7) and therefore finer gaps. With <K>double</K> too, <K>0.1 + 0.2</K> is not <K>0.3</K>.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Variable bekommt den Typ, den ich links hinschreibe, also rechnet die Division richtig.»" en="“The variable gets the type I write on the left, so the division is computed properly.”" />}>
          <T
            de={<>Der Typ der linken Seite entscheidet nicht darüber, wie die rechte Seite gerechnet wird. Mit <K>double d = 9 / 5;</K> ist <K>d</K> gleich 1, nicht 1,8, denn <K>9 / 5</K> ist zuerst eine Ganzzahldivision.</>}
            en={<>The type of the left-hand side does not decide how the right-hand side is computed. With <K>double d = 9 / 5;</K> <K>d</K> is 1, not 1.8, because <K>9 / 5</K> is an integer division first.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Wenn die Ausgabe 0.3 zeigt, ist die Zahl 0.3.»" en="“If the output shows 0.3, the number is 0.3.”" />}>
          <T
            de={<>Die Ausgabe rundet auf sechs Stellen. Die gespeicherte Zahl kann in einer späteren Stelle abweichen, wie das Feld oben mit der exakten Darstellung zeigt.</>}
            en={<>The output rounds to six digits. The stored number can deviate in a later digit, as the field above shows with the exact representation.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Rechnungen nur mit <K>int</K> liefern <K>int</K> (Division schneidet ab). Eine Kommazahl im Ausdruck macht ihn zu einer Kommazahl-Rechnung.</li>
              <li><K>float</K>: ca. 7 Stellen, Exponent bis <M p=".">{t`\pm 38`}</M> <K>double</K>: ca. 15 Stellen, bis <M p=".">{t`\pm 308`}</M> Literale sind <K>double</K>, mit <K>f</K> <K>float</K>.</li>
              <li>Nicht jede Zahl ist darstellbar: Es gibt Löcher. Gespeichert wird die nächstgelegene darstellbare Zahl, daher Reste wie <K>2.23517e-8</K> und <K>0.1 + 0.2 != 0.3</K>.</li>
              <li>Kommazahlen sind Näherungen, ganze Zahlen exakt (im Bereich). Nie mit <K>==</K> vergleichen.</li>
            </ul>}
            en={<ul>
              <li>Computations with <K>int</K> only yield <K>int</K> (division truncates). One floating point number in the expression makes it a floating point computation.</li>
              <li><K>float</K>: about 7 digits, exponent up to <M p=".">{t`\pm 38`}</M> <K>double</K>: about 15 digits, up to <M p=".">{t`\pm 308`}</M> Literals are <K>double</K>, with <K>f</K> <K>float</K>.</li>
              <li>Not every number is representable: there are holes. The nearest representable number is stored, hence remainders like <K>2.23517e-8</K> and <K>0.1 + 0.2 != 0.3</K>.</li>
              <li>Floating point numbers are approximations, integers exact (within range). Never compare with <K>==</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Der Typ <K>bool</K>: Wahrheitswerte als Grundlage für alle Entscheidungen im Programm (Skript S. 43–48).</p>}
          en={<p className="connections"><b>Next:</b> the type <K>bool</K>: truth values as the basis for every decision in a program (notes pp. 43–48).</p>}
        />
      </Section>
    </article>
  );
}
