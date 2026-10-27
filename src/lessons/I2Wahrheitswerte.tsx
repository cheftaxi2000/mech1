import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { ParenView } from '../viz/info/ParenView';
import { TruthBuilder, TruthCompare } from '../viz/info/TruthTable';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I2Wahrheitswerte() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Damit ein Programm entscheiden kann, braucht es Bedingungen, und Bedingungen sind Ausdrücke vom Typ <K>bool</K>. Diese Lektion legt dafür die Grundlage: Vergleiche, <K>&amp;&amp;</K>, <K>||</K> und <K>!</K>, ihr Vorrang, und die eine Auswertungsregel, die man im Kopf haben muss, die Kurzschlussauswertung.</p>}
        en={<p className="lede">For a program to decide anything it needs conditions, and conditions are expressions of type <K>bool</K>. This lesson lays the foundation: comparisons, <K>&amp;&amp;</K>, <K>||</K> and <K>!</K>, their precedence, and the one evaluation rule one must keep in mind, short-circuit evaluation.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="bool" title={<T de="1. bool und Vergleiche" en="1. bool and comparisons" />}>
        <Box kind="lecture" src={<Src p="43–44" />} title={<T de="Wahrheitswerte und Vergleichsoperatoren" en="Truth values and relational operators" />}>
          <T
            de={<>
              <p>Um Code <b>bedingt</b> auszuführen, braucht man eine Bedingung, also einen Ausdruck mit Wahrheitswert. In der Mathematik steht 0 für «falsch» und 1 für «wahr». In C++ stellt der Typ <K>bool</K> Wahrheitswerte dar, mit den Literalen <K>false</K> und <K>true</K>: <K>bool b = true;</K></p>
              <p>Für zwei Werte arithmetischen Typs gibt es die binären <b>Vergleichsoperatoren</b>: <K>a &lt; b</K> (kleiner), <K>a &lt;= b</K> (kleiner oder gleich), <K>a &gt; b</K> (grösser), <K>a &gt;= b</K> (grösser oder gleich), <K>a == b</K> (gleich), <K>a != b</K> (ungleich). Sie sind linksassoziativ und liefern einen rvalue vom Typ <K>bool</K>.</p>
              <p>Beispiele: <K>bool b = (1 &lt; 3);</K> ist <K>true</K>; mit <K>int a = 4;</K> ist <K>(a % 3 == 1)</K> wahr und <K>(a != 2*a-1)</K> falsch.</p>
            </>}
            en={<>
              <p>To execute code <b>conditionally</b> one needs a condition, i.e. an expression with a truth value. In mathematics 0 stands for “false” and 1 for “true”. In C++ the type <K>bool</K> represents truth values, with the literals <K>false</K> and <K>true</K>: <K>bool b = true;</K></p>
              <p>For two values of arithmetic type there are the binary <b>relational operators</b>: <K>a &lt; b</K> (smaller), <K>a &lt;= b</K> (smaller or equal), <K>a &gt; b</K> (greater), <K>a &gt;= b</K> (greater or equal), <K>a == b</K> (equal), <K>a != b</K> (not equal). They are left associative and yield an rvalue of type <K>bool</K>.</p>
              <p>Examples: <K>bool b = (1 &lt; 3);</K> is <K>true</K>; with <K>int a = 4;</K>, <K>(a % 3 == 1)</K> is true and <K>(a != 2*a-1)</K> is false.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.relational} label={tr('Vergleiche ergeben bool', 'Comparisons yield bool')} />
        <T
          de={<p>Beachte die zwei verschiedenen Zeichen: <K>=</K> ist die Zuweisung, <K>==</K> der Vergleich. Und die Ausgabe: <K>std::cout</K> druckt ein <K>bool</K> als <K>1</K> oder <K>0</K>, nicht als Wort. In der Tabelle siehst du den Wert dagegen als <K>true</K> oder <K>false</K>.</p>}
          en={<p>Note the two different signs: <K>=</K> is assignment, <K>==</K> is comparison. And the output: <K>std::cout</K> prints a <K>bool</K> as <K>1</K> or <K>0</K>, not as a word. In the table you see the value as <K>true</K> or <K>false</K> instead.</p>}
        />
        <Tracer prog={P.evenOdd} inputs={['7\n', '10\n']} label={tr('Ausblick: eine Bedingung steuert das Programm (Code 4.2)', 'Outlook: a condition steers the program (Code 4.2)')} />
        <T
          de={<p>So wird später aus einem Wahrheitswert eine Entscheidung: <K>if</K> führt den einen oder den anderen Zweig aus, je nachdem, ob <K>a % 2 == 0</K> wahr ist. Im Schritt oben siehst du, dass <em>nur ein</em> Zweig läuft. Die Syntax lernen wir im nächsten Kapitel; hier geht es um das, was in der Klammer steht.</p>}
          en={<p>This is how a truth value later becomes a decision: <K>if</K> executes one branch or the other, depending on whether <K>a % 2 == 0</K> is true. In the step above you see that <em>only one</em> branch runs. We learn the syntax in the next chapter; here the point is what stands in the parentheses.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="logik" title={<T de="2. Logische Operatoren" en="2. Logical operators" />}>
        <Box kind="lecture" src={<Src p="44–45" />} title={<T de="UND, ODER, NICHT" en="AND, OR, NOT" />}>
          <T
            de={<>
              <p>Wahrheitswerte lassen sich verknüpfen. Die kanonischen Operatoren sind die <b>Konjunktion</b> (UND) <M p=",">{t`x \wedge y`}</M> wahr genau dann, wenn <M>x</M> und <M>y</M> beide wahr sind; die <b>Disjunktion</b> (ODER) <M p=",">{t`x \vee y`}</M> wahr genau dann, wenn mindestens eines wahr ist; die <b>Negation</b> (NICHT) <M p=",">{t`\neg x`}</M> wahr genau dann, wenn <M>x</M> falsch ist. Jede Boolesche Funktion lässt sich durch eine Wahrheitstabelle definieren.</p>
              <p>In C++: <K>x &amp;&amp; y</K> (UND), <K>x || y</K> (ODER), <K>!x</K> (NICHT). UND und ODER sind binär und linksassoziativ und liefern einen rvalue vom Typ <K>bool</K>; die Negation ist unär und rechtsassoziativ.</p>
              <p>Beispiele: <K>(n &lt; 0) &amp;&amp; (0 &lt; p)</K> ist für <K>n = -1</K>, <K>p = 3</K> wahr; <K>(n &lt; 0) || (0 &lt; p)</K> ist für <K>n = 1</K>, <K>p = 0</K> falsch; <K>!(n &lt; 0)</K> ist für <K>n = 1</K> wahr.</p>
            </>}
            en={<>
              <p>Truth values can be combined. The canonical operators are the <b>conjunction</b> (AND) <M p=",">{t`x \wedge y`}</M> true if and only if <M>x</M> and <M>y</M> are both true; the <b>disjunction</b> (OR) <M p=",">{t`x \vee y`}</M> true if and only if at least one is true; the <b>negation</b> (NOT) <M p=",">{t`\neg x`}</M> true if and only if <M>x</M> is false. Any Boolean function can be defined by a truth table.</p>
              <p>In C++: <K>x &amp;&amp; y</K> (AND), <K>x || y</K> (OR), <K>!x</K> (NOT). AND and OR are binary and left associative and yield an rvalue of type <K>bool</K>; the negation is unary and right associative.</p>
              <p>Examples: <K>(n &lt; 0) &amp;&amp; (0 &lt; p)</K> is true for <K>n = -1</K>, <K>p = 3</K>; <K>(n &lt; 0) || (0 &lt; p)</K> is false for <K>n = 1</K>, <K>p = 0</K>; <K>!(n &lt; 0)</K> is true for <K>n = 1</K>.</p>
            </>}
          />
        </Box>
        <table className="plain tt3">
          <thead><tr><th><M>x</M></th><th><M>y</M></th><th><M>{t`x \wedge y`}</M></th><th><M>{t`x \vee y`}</M></th><th><M>{t`\neg x`}</M></th></tr></thead>
          <tbody>
            <tr><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td></tr>
            <tr><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td></tr>
            <tr><td>1</td><td>0</td><td>0</td><td>1</td><td>0</td></tr>
            <tr><td>1</td><td>1</td><td>1</td><td>1</td><td>0</td></tr>
          </tbody>
        </table>
        <T
          de={<p>Merke dir die Tabellen in Worten: <b>UND</b> braucht <em>alle</em>, <b>ODER</b> braucht <em>mindestens eines</em>, <b>NICHT</b> dreht um. Das ODER der Mathematik ist nicht das «entweder … oder» der Alltagssprache: <K>true || true</K> ist wahr.</p>}
          en={<p>Remember the tables in words: <b>AND</b> needs <em>all</em>, <b>OR</b> needs <em>at least one</em>, <b>NOT</b> flips. The OR of mathematics is not the “either … or” of everyday language: <K>true || true</K> is true.</p>}
        />
        <Listing prog={P.logicalOps} label={tr('Beispiel 4.7', 'Example 4.7')} />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vorrang" title={<T de="3. Vorrang: wer bindet stärker?" en="3. Precedence: who binds more strongly?" />}>
        <Box kind="lecture" src={<Src p="45–46" />} title={<T de="Vorrang und Bindung der Operatoren" en="Precedence and binding of operators" />}>
          <T
            de={<>
              <p>Wie in Abschnitt 3.2 bestimmen Vorrang und Assoziativität die Auswertung. Die Negation bindet stärker als die binären logischen Operatoren: <K>!b &amp;&amp; a</K> ist <K>(!b) &amp;&amp; a</K>. Die Konjunktion bindet stärker als die Disjunktion: <K>a &amp;&amp; b || c &amp;&amp; d</K> ist <K>(a &amp;&amp; b) || (c &amp;&amp; d)</K>. Lass dich von irreführender Formatierung nicht täuschen: <K>a || b &amp;&amp; c || d</K> ist <K>a || (b &amp;&amp; c) || d</K>.</p>
              <p><b>Bindung der Operatoren:</b> Der unäre logische Operator <K>!</K> bindet stärker als die binären arithmetischen Operatoren. Diese binden stärker als die Vergleichsoperatoren, und diese stärker als die binären logischen Operatoren.</p>
              <p><i>Beispiel 4.8:</i> <K>7 + x &lt; y &amp;&amp; y != 3 * z || ! b</K> wird richtig so geklammert: <K>((7 + x) &lt; y) &amp;&amp; (y != (3 * z)) || (!b)</K>.</p>
            </>}
            en={<>
              <p>As in section 3.2, precedence and associativity determine the evaluation. The negation binds more strongly than the binary logical operators: <K>!b &amp;&amp; a</K> is <K>(!b) &amp;&amp; a</K>. The conjunction binds more strongly than the disjunction: <K>a &amp;&amp; b || c &amp;&amp; d</K> is <K>(a &amp;&amp; b) || (c &amp;&amp; d)</K>. Do not be fooled by misleading layout: <K>a || b &amp;&amp; c || d</K> is <K>a || (b &amp;&amp; c) || d</K>.</p>
              <p><b>Binding of operators:</b> the unary logical operator <K>!</K> binds more strongly than the binary arithmetic operators. These bind more strongly than the relational operators, and these more strongly than the binary logical operators.</p>
              <p><i>Example 4.8:</i> <K>7 + x &lt; y &amp;&amp; y != 3 * z || ! b</K> is correctly parenthesized like this: <K>((7 + x) &lt; y) &amp;&amp; (y != (3 * z)) || (!b)</K>.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Zum Merken die Rangfolge von <em>stark nach schwach</em>: <K>!</K>, dann <K>* / %</K>, dann <K>+ -</K>, dann <K>&lt; &lt;= &gt; &gt;=</K>, dann <K>== !=</K>, dann <K>&amp;&amp;</K>, dann <K>||</K>, am Schluss <K>=</K>. Der Compiler klammert das unten für jeden Ausdruck, den du eintippst (er zeigt die vollständige Klammerung; im Skript steht eine kürzere Fassung).</p>}
          en={<p>To remember, the ranking from <em>strong to weak</em>: <K>!</K>, then <K>* / %</K>, then <K>+ -</K>, then <K>&lt; &lt;= &gt; &gt;=</K>, then <K>== !=</K>, then <K>&amp;&amp;</K>, then <K>||</K>, finally <K>=</K>. Below, the compiler parenthesizes any expression you type (it shows the full parenthesization; the notes show a shorter version).</p>}
        />
        <ParenView presets={['7 + x < y && y != 3 * z || ! b', 'a || b && c || d', '!b && a', 'a < b == c < d']} />
        <Box kind="tip" title={<T de="Klammern bei Bedingungen" en="Parentheses in conditions" />}>
          <T
            de={<ul>
              <li><b>Bei gemischten Bedingungen immer klammern</b> (<K>(a &gt; 0) &amp;&amp; (b &gt; 0)</K> statt <K>a &gt; 0 &amp;&amp; b &gt; 0</K>). Beide sind gleich, aber die erste liest sich ohne Nachschlagen.</li>
              <li><b>Ein ODER in einem UND braucht Klammern:</b> <K>a &amp;&amp; (b || c)</K> ist etwas ganz anderes als <K>a &amp;&amp; b || c</K> = <K>(a &amp;&amp; b) || c</K>.</li>
            </ul>}
            en={<ul>
              <li><b>Always parenthesize mixed conditions</b> (<K>(a &gt; 0) &amp;&amp; (b &gt; 0)</K> instead of <K>a &gt; 0 &amp;&amp; b &gt; 0</K>). Both are the same, but the first reads without looking anything up.</li>
              <li><b>An OR inside an AND needs parentheses:</b> <K>a &amp;&amp; (b || c)</K> is something quite different from <K>a &amp;&amp; b || c</K> = <K>(a &amp;&amp; b) || c</K>.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="vollstaendig" title={<T de="4. Vollständigkeit: drei Operatoren genügen" en="4. Completeness: three operators suffice" />}>
        <Box kind="lecture" src={<Src p="46–47" />} title={<T de="Satz 4.1" en="Theorem 4.1" />}>
          <T
            de={<>
              <p>Reichen UND, ODER, NICHT? Betrachte das <b>exklusive Oder</b> (XOR) <M p=":">{t`x \oplus y`}</M> wahr genau dann, wenn <em>eines</em> der Argumente wahr ist, aber nicht beide. Es gilt <M p=";">{t`x \oplus y = (x \vee y) \wedge \neg(x \wedge y)`}</M> man prüft es mit der Wahrheitstabelle.</p>
              <p><b>Satz 4.1.</b> Jeder binäre logische Operator lässt sich durch die drei kanonischen Operatoren <M p=",">\wedge</M> <M>\vee</M> und <M>\neg</M> ausdrücken.</p>
              <p><i>Beweis.</i> Jede Boolesche Funktion wird mit dem <b>charakteristischen Vektor</b> ihrer Wahrheitstabelle identifiziert (XOR: <M p=",">{t`v = [0,1,1,0]`}</M> kurz <K>0110</K>, die Funktion heisst <M p=").">{t`f_{0110}`}</M> Zuerst erzeugt man die vier Grundfunktionen <M p=",">{t`f_{0001} = x \wedge y`}</M> <M p=",">{t`f_{0010} = x \wedge \neg y`}</M> <M p=",">{t`f_{0100} = \neg x \wedge y`}</M> <M p=".">{t`f_{1000} = \neg x \wedge \neg y`}</M> Jede Funktion mit mindestens einer 1 ist das ODER der Grundfunktionen an ihren 1-Stellen, z. B. <M p=".">{t`f_{1101} = f_{1000} \vee f_{0100} \vee f_{0001}`}</M> Schliesslich ist <M p=".">{t`f_{0000} = x \wedge \neg x`}</M> <M>\square</M></p>
              <p><i>Bemerkung 4.1.</i> Wegen <M>{t`x \vee y = \neg(\neg x \wedge \neg y)`}</M> genügen sogar zwei Operatoren, etwa UND und NICHT.</p>
            </>}
            en={<>
              <p>Are AND, OR, NOT enough? Consider the <b>exclusive or</b> (XOR) <M p=":">{t`x \oplus y`}</M> true if and only if <em>one</em> of the arguments is true, but not both. It holds <M p=";">{t`x \oplus y = (x \vee y) \wedge \neg(x \wedge y)`}</M> one checks it with the truth table.</p>
              <p><b>Theorem 4.1.</b> Any binary logical operator can be expressed in terms of the three canonical operators <M p=",">\wedge</M> <M>\vee</M> and <M p=".">\neg</M></p>
              <p><i>Proof.</i> Every Boolean function is identified with the <b>characteristic vector</b> of its truth table (XOR: <M p=",">{t`v = [0,1,1,0]`}</M> short <K>0110</K>, the function is called <M p=").">{t`f_{0110}`}</M> First one generates the four fundamental functions <M p=",">{t`f_{0001} = x \wedge y`}</M> <M p=",">{t`f_{0010} = x \wedge \neg y`}</M> <M p=",">{t`f_{0100} = \neg x \wedge y`}</M> <M p=".">{t`f_{1000} = \neg x \wedge \neg y`}</M> Any function with at least one 1 is the OR of the fundamental functions at its 1-positions, e.g. <M p=".">{t`f_{1101} = f_{1000} \vee f_{0100} \vee f_{0001}`}</M> Finally <M p=".">{t`f_{0000} = x \wedge \neg x`}</M> <M>\square</M></p>
              <p><i>Remark 4.1.</i> Because <M p=",">{t`x \vee y = \neg(\neg x \wedge \neg y)`}</M> even two operators suffice, e.g. AND and NOT.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Der Beweis ist ein Rezept, und hier läuft es: Klicke die Ausgabespalte an. Jede Zeile mit Ausgabe 1 wird zu einem Term, der <em>nur in dieser einen Zeile</em> wahr ist (eine Grundfunktion); das ODER aller Terme ist die gesuchte Formel. Die Kontrollzeile rechnet die Formel durch.</p>}
          en={<p>The proof is a recipe, and here it runs: click the output column. Every row with output 1 becomes a term that is true <em>in that one row only</em> (a fundamental function); the OR of all terms is the formula you are looking for. The check line evaluates the formula.</p>}
        />
        <TruthBuilder />
        <T
          de={<p>Das Ergebnis ist nicht immer die kürzeste Formel, aber es gibt immer eine. Für XOR kommt <K>(!x &amp;&amp; y) || (x &amp;&amp; !y)</K> heraus: «<K>x</K> ist falsch und <K>y</K> wahr, oder umgekehrt». Das ist gleichwertig zur Formel im Skript, <K>(x || y) &amp;&amp; !(x &amp;&amp; y)</K>, nur anders gebaut.</p>}
          en={<p>The result is not always the shortest formula, but there is always one. For XOR it comes out as <K>(!x &amp;&amp; y) || (x &amp;&amp; !y)</K>: “<K>x</K> is false and <K>y</K> true, or the other way round”. That is equivalent to the formula in the notes, <K>(x || y) &amp;&amp; !(x &amp;&amp; y)</K>, just built differently.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="konversion" title={<T de="5. bool und int" en="5. bool and int" />}>
        <Box kind="lecture" src={<Src p="47–48" />} title={<T de="Konversion" en="Conversion" />}>
          <T
            de={<p><K>bool</K> kann überall verwendet werden, wo <K>int</K> erwartet wird, und umgekehrt. Viele bestehende Programme benutzen <K>int</K> statt <K>bool</K>; das ist eine schlechte Idee, die aus der Sprache C stammt. Umwandlung: <K>true</K> wird zu <K>1</K>, <K>false</K> zu <K>0</K>; jeder Wert <K>≠ 0</K> wird zu <K>true</K>, <K>0</K> zu <K>false</K>. Beispiel 4.9: <K>int a = true;</K> (<K>a = 1</K>), <K>bool b = 3;</K> (<K>b = true</K>), <K>bool c = 0;</K> (<K>c = false</K>).</p>}
            en={<p><K>bool</K> can be used wherever <K>int</K> is expected, and vice versa. Many existing programs use <K>int</K> instead of <K>bool</K>; that is a bad idea, originating from the language C. Conversion: <K>true</K> becomes <K>1</K>, <K>false</K> becomes <K>0</K>; every value <K>≠ 0</K> becomes <K>true</K>, <K>0</K> becomes <K>false</K>. Example 4.9: <K>int a = true;</K> (<K>a = 1</K>), <K>bool b = 3;</K> (<K>b = true</K>), <K>bool c = 0;</K> (<K>c = false</K>).</p>}
          />
        </Box>
        <Listing prog={P.boolConv} label={tr('Beispiel 4.9', 'Example 4.9')} />
        <T
          de={<p>Warum «schlechte Idee»? Weil die Umwandlung Fehler verschluckt: <K>bool b = 3;</K> ist wahr, obwohl du vielleicht eine Zahl meintest. Ein <K>int</K>, das «eigentlich ein Wahrheitswert» ist, sagt dem Leser nichts. Nimm <K>bool</K>, wenn du eine Ja-Nein-Antwort meinst.</p>}
          en={<p>Why a “bad idea”? Because the conversion swallows errors: <K>bool b = 3;</K> is true although you may have meant a number. An <K>int</K> that is “really a truth value” tells the reader nothing. Use <K>bool</K> when you mean a yes/no answer.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="demorgan" title={<T de="6. Die Regeln von De Morgan" en="6. The rules of De Morgan" />}>
        <Box kind="lecture" src={<Src p="48" />} title={<T de="De Morgan" en="De Morgan" />}>
          <T
            de={<>
              <p>Es gilt <K>!(a &amp;&amp; b) == (!a || !b)</K> und <K>!(a || b) == (!a &amp;&amp; !b)</K>, in der Logik <M>{t`\neg(a \wedge b) = (\neg a \vee \neg b)`}</M> und <M p=".">{t`\neg(a \vee b) = (\neg a \wedge \neg b)`}</M> Nicht (sonnig und heiss) = bewölkt oder kalt. Nicht (sonnig oder heiss) = bewölkt und kalt.</p>
              <p>Diese Regeln erlauben eine andere Sicht auf logische Formeln und vereinfachen sie manchmal. <i>Beispiel 4.10</i> zeigt vier Sichtweisen auf dieselbe Formel (XOR): <K>(x || y) &amp;&amp; !(x &amp;&amp; y)</K> (<K>x</K> oder <K>y</K>, nicht beide), <K>(x || y) &amp;&amp; (!x || !y)</K>, <K>!(!x &amp;&amp; !y) &amp;&amp; !(x &amp;&amp; y)</K> (nicht keines und nicht beide), <K>!(!x &amp;&amp; !y || x &amp;&amp; y)</K> (nicht: beide oder keines).</p>
            </>}
            en={<>
              <p>It holds <K>!(a &amp;&amp; b) == (!a || !b)</K> and <K>!(a || b) == (!a &amp;&amp; !b)</K>, in logic <M>{t`\neg(a \wedge b) = (\neg a \vee \neg b)`}</M> and <M p=".">{t`\neg(a \vee b) = (\neg a \wedge \neg b)`}</M> Not (sunny and hot) = cloudy or cold. Not (sunny or hot) = cloudy and cold.</p>
              <p>These rules allow a different view on logical formulas and sometimes simplify them. <i>Example 4.10</i> shows four views of the same formula (XOR): <K>(x || y) &amp;&amp; !(x &amp;&amp; y)</K> (<K>x</K> or <K>y</K>, not both), <K>(x || y) &amp;&amp; (!x || !y)</K>, <K>!(!x &amp;&amp; !y) &amp;&amp; !(x &amp;&amp; y)</K> (not none and not both), <K>!(!x &amp;&amp; !y || x &amp;&amp; y)</K> (not: both or none).</p>
            </>}
          />
        </Box>
        <T
          de={<p>Ob zwei Formeln gleichwertig sind, entscheidet immer die Wahrheitstabelle: gleiche Spalte, gleiche Formel. Probiere unten die De-Morgan-Regeln und die vier Fassungen von XOR aus, und teste auch eine <em>falsche</em> Umformung (Nr. 3 vergisst das Umkehren von UND zu ODER).</p>}
          en={<p>Whether two formulas are equivalent is always decided by the truth table: same column, same formula. Try the De Morgan rules and the four versions of XOR below, and also test a <em>wrong</em> transformation (no. 3 forgets to turn AND into OR).</p>}
        />
        <TruthCompare presets={[['!(x && y)', '!x || !y'], ['!(x || y)', '!x && !y'], ['!(x && y)', '!x && !y'], ['(x || y) && !(x && y)', '!(!x && !y || x && y)']]} />
        <Box kind="tip" title={<T de="Negationen auflösen" en="Resolving negations" />}>
          <T
            de={<ul>
              <li><b>Verneinte Bedingungen sind schwer zu lesen.</b> Drehe sie mit De Morgan um: statt <K>!(a &gt; 0 &amp;&amp; b &gt; 0)</K> schreibe <K>a &lt;= 0 || b &lt;= 0</K> (das Gegenteil von <K>&gt;</K> ist <K>&lt;=</K>, nicht <K>&lt;</K>).</li>
              <li><b>Eselsbrücke:</b> Beim Auflösen einer Klammer mit <K>!</K> wird jedes UND zu ODER (und umgekehrt), und jeder Teil wird verneint.</li>
              <li>Prüfe jede Umformung im Zweifel mit einer Wahrheitstabelle, wie oben.</li>
            </ul>}
            en={<ul>
              <li><b>Negated conditions are hard to read.</b> Turn them around with De Morgan: instead of <K>!(a &gt; 0 &amp;&amp; b &gt; 0)</K> write <K>a &lt;= 0 || b &lt;= 0</K> (the opposite of <K>&gt;</K> is <K>&lt;=</K>, not <K>&lt;</K>).</li>
              <li><b>Mnemonic:</b> when resolving a parenthesis with <K>!</K>, every AND becomes OR (and vice versa), and every part is negated.</li>
              <li>When in doubt check every transformation with a truth table, as above.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 7 */}
      <Section id="kurzschluss" title={<T de="7. Kurzschlussauswertung" en="7. Short-circuit evaluation" />}>
        <Box kind="lecture" src={<Src p="48" />} title={<T de="Kurzschlussauswertung" en="Short-circuit evaluation" />}>
          <T
            de={<>
              <p>Für logische Ausdrücke benutzt C++ die <b>Kurzschlussauswertung</b>: Die Operatoren <K>&amp;&amp;</K> und <K>||</K> werten zuerst den linken Operanden aus. Ist das Ergebnis dann schon bekannt, wird der rechte Operand <b>nicht</b> mehr ausgewertet.</p>
              <p>Das kann schneller sein, vor allem aber gibt es <em>Garantien</em>: Es ist sehr praktisch, wenn ein Ausdruck von Bedingungen abhängt, die zuerst hergestellt sein müssen.</p>
              <p><i>Beispiel 4.11:</i> <K>bool b = (x != 0) &amp;&amp; z / x &gt; y;</K> Für <K>x = 6</K> entspricht das <M p=";">{t`z/x > y`}</M> für <K>x = 0</K> ist das Ergebnis <K>false</K>, und der zweite Ausdruck wird nicht ausgewertet: Es gibt keine Division durch null.</p>
            </>}
            en={<>
              <p>For logical expressions C++ uses <b>short-circuit evaluation</b>: the operators <K>&amp;&amp;</K> and <K>||</K> evaluate the left operand first. If the result is then already known, the right operand is <b>not</b> evaluated.</p>
              <p>That can be faster, but above all it gives <em>guarantees</em>: it is very handy when an expression depends on conditions that must be established first.</p>
              <p><i>Example 4.11:</i> <K>bool b = (x != 0) &amp;&amp; z / x &gt; y;</K> For <K>x = 6</K> that corresponds to <M p=";">{t`z/x > y`}</M> for <K>x = 0</K> the result is <K>false</K> and the second expression is not evaluated: there is no division by zero.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.shortCircuit} inputs={['6 1 12\n', '0 1 12\n']} label={tr('Mit Absicherung', 'With a guard')} />
        <T
          de={<p>Schalte auf <K>0 1 12</K>: Das Programm läuft ohne Fehler durch, obwohl <K>z / x</K> bei <K>x = 0</K> unmöglich wäre; die Division wird gar nicht ausgeführt. Die Reihenfolge der Operanden ist hier ein <em>Teil der Logik</em>. Drehst du sie um, geschieht das hier:</p>}
          en={<p>Switch to <K>0 1 12</K>: the program runs through without an error, although <K>z / x</K> would be impossible for <K>x = 0</K>; the division is never carried out. The order of the operands is <em>part of the logic</em> here. If you swap them, this happens:</p>}
        />
        <Tracer prog={P.noShortCircuit} label={tr('Falsche Reihenfolge: Division durch null', 'Wrong order: division by zero')} />
        <Box kind="tip" title={<T de="Bedingung zuerst, Gefahr danach" en="Condition first, danger afterwards" />}>
          <T
            de={<ul>
              <li><b>Die Absicherung steht immer links.</b> <K>(x != 0) &amp;&amp; (z / x &gt; y)</K> ist sicher; <K>(z / x &gt; y) &amp;&amp; (x != 0)</K> ist ein Fehler, obwohl beide mathematisch dasselbe aussagen.</li>
              <li><b>Beim ODER umgekehrt gedacht:</b> <K>a || b</K> wertet <K>b</K> nur aus, wenn <K>a</K> falsch ist.</li>
              <li><b>Nie Nebenwirkungen im rechten Operanden verstecken</b> (<K>a &amp;&amp; (++i &gt; 0)</K>): Wer den Ausdruck liest, vergisst, dass <K>++i</K> manchmal gar nicht läuft.</li>
            </ul>}
            en={<ul>
              <li><b>The guard always goes on the left.</b> <K>(x != 0) &amp;&amp; (z / x &gt; y)</K> is safe; <K>(z / x &gt; y) &amp;&amp; (x != 0)</K> is an error, although both say the same mathematically.</li>
              <li><b>Thought the other way round for OR:</b> <K>a || b</K> evaluates <K>b</K> only if <K>a</K> is false.</li>
              <li><b>Never hide side effects in the right operand</b> (<K>a &amp;&amp; (++i &gt; 0)</K>): whoever reads the expression forgets that <K>++i</K> sometimes does not run at all.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Mit <K>int x = 0;</K>: Was ist der Wert von <K>(x != 0) &amp;&amp; (10 / x &gt; 1)</K>?</>} en={<>With <K>int x = 0;</K>: what is the value of <K>(x != 0) &amp;&amp; (10 / x &gt; 1)</K>?</>} />}
          choices={[
            { text: <code>false</code>, correct: true, why: <T de={<>Ja: Die linke Seite ist <K>false</K>, also steht das Ergebnis fest, und <K>10 / x</K> wird nie ausgewertet.</>} en={<>Yes: the left side is <K>false</K>, so the result is settled and <K>10 / x</K> is never evaluated.</>} /> },
            { text: <T de="Absturz durch Division durch null" en="Crash from division by zero" />, why: <T de="Nein, gerade das verhindert die Kurzschlussauswertung. Bei vertauschten Operanden wäre es so." en="No, short-circuit evaluation prevents exactly that. With swapped operands it would be so." /> },
            { text: <code>true</code>, why: <T de={<>Nein: <K>&amp;&amp;</K> braucht beide wahr, und die linke Seite ist falsch.</>} en={<>No: <K>&amp;&amp;</K> needs both true, and the left side is false.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 8 */}
      <Section id="missverstaendnisse" title={<T de="8. Typische Missverständnisse" en="8. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<K>0 &lt; x &lt; 10</K> prüft, ob <K>x</K> zwischen 0 und 10 liegt.»</>} en={<>“<K>0 &lt; x &lt; 10</K> checks whether <K>x</K> is between 0 and 10.”</>} />}>
          <T
            de={<>In C++ wird daraus <K>(0 &lt; x) &lt; 10</K>: Die erste Klammer ist <K>0</K> oder <K>1</K>, und beides ist kleiner als 10, also ist der Ausdruck <em>immer</em> wahr. Richtig: <K>(0 &lt; x) &amp;&amp; (x &lt; 10)</K>. Das Beispiel unten mit <K>x = 50</K> zeigt den Unterschied.</>}
            en={<>In C++ this becomes <K>(0 &lt; x) &lt; 10</K>: the first parenthesis is <K>0</K> or <K>1</K>, and both are less than 10, so the expression is <em>always</em> true. Correct: <K>(0 &lt; x) &amp;&amp; (x &lt; 10)</K>. The example below with <K>x = 50</K> shows the difference.</>}
          />
        </Box>
        <Listing prog={P.chainedCompare} label={tr('Eine Bereichsprüfung, die keine ist', 'A range check that is none')} />
        <Box kind="misconception" title={<T de={<>«<K>a == b</K> und <K>a = b</K> sind fast dasselbe.»</>} en={<>“<K>a == b</K> and <K>a = b</K> are almost the same.”</>} />}>
          <T
            de={<><K>a = b</K> <em>überschreibt</em> <K>a</K> und liefert dessen neuen Wert; <K>a == b</K> verändert nichts und liefert <K>bool</K>. Wer in einer Bedingung <K>=</K> tippt, bekommt in der Regel keinen Fehler, aber ein ganz anderes Programm.</>}
            en={<><K>a = b</K> <em>overwrites</em> <K>a</K> and yields its new value; <K>a == b</K> changes nothing and yields <K>bool</K>. Whoever types <K>=</K> in a condition usually gets no error but a completely different program.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«&& und || werten immer beide Seiten aus.»" en="“&& and || always evaluate both sides.”" />}>
          <T
            de={<>Nur wenn nötig. Ist das Ergebnis nach der linken Seite bekannt, bleibt die rechte unausgeführt, samt ihren Nebenwirkungen und möglichen Fehlern.</>}
            en={<>Only if needed. Once the result is known after the left side, the right side stays unexecuted, including its side effects and possible errors.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 9 */}
      <Section id="ausblick" title={<T de="9. Das Wichtigste" en="9. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>bool</K> hat die Werte <K>true</K> und <K>false</K>; Vergleiche (<K>&lt; &lt;= &gt; &gt;= == !=</K>) liefern <K>bool</K>.</li>
              <li><K>&amp;&amp;</K> (UND), <K>||</K> (ODER), <K>!</K> (NICHT). Vorrang: <K>!</K> vor arithmetisch vor Vergleich vor <K>&amp;&amp;</K> vor <K>||</K>. Im Zweifel klammern.</li>
              <li>UND, ODER, NICHT genügen für jede Boolesche Funktion. Gleichwertigkeit prüft man mit der Wahrheitstabelle; De Morgan: <K>!(a &amp;&amp; b) == !a || !b</K>.</li>
              <li><K>bool</K> und <K>int</K> lassen sich ineinander umwandeln (ungleich 0 ist wahr), aber nimm <K>bool</K> für Wahrheitswerte.</li>
              <li>Kurzschluss: <K>&amp;&amp;</K> und <K>||</K> werten links zuerst aus und sparen die rechte Seite, wenn das Ergebnis feststeht. Absicherungen stehen links.</li>
              <li><K>0 &lt; x &lt; 10</K> ist <em>keine</em> Bereichsprüfung.</li>
            </ul>}
            en={<ul>
              <li><K>bool</K> has the values <K>true</K> and <K>false</K>; comparisons (<K>&lt; &lt;= &gt; &gt;= == !=</K>) yield <K>bool</K>.</li>
              <li><K>&amp;&amp;</K> (AND), <K>||</K> (OR), <K>!</K> (NOT). Precedence: <K>!</K> before arithmetic before comparison before <K>&amp;&amp;</K> before <K>||</K>. When in doubt parenthesize.</li>
              <li>AND, OR, NOT suffice for every Boolean function. Equivalence is checked with the truth table; De Morgan: <K>!(a &amp;&amp; b) == !a || !b</K>.</li>
              <li><K>bool</K> and <K>int</K> can be converted into each other (non-zero is true), but use <K>bool</K> for truth values.</li>
              <li>Short circuit: <K>&amp;&amp;</K> and <K>||</K> evaluate on the left first and skip the right side once the result is settled. Guards go on the left.</li>
              <li><K>0 &lt; x &lt; 10</K> is <em>not</em> a range check.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Das nächste Skript-Kapitel (infln03) macht aus Bedingungen Programmablauf: <K>if</K>, <K>while</K>, <K>for</K>, Blöcke und Sichtbarkeit.</p>}
          en={<p className="connections"><b>Next:</b> the next chapter of the notes (infln03) turns conditions into program flow: <K>if</K>, <K>while</K>, <K>for</K>, blocks and visibility.</p>}
        />
      </Section>
    </article>
  );
}
