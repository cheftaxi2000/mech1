import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';
import { WrapRing } from '../viz/info/WrapRing';

const t = String.raw;

export default function I2Ganzzahlen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine <K>int</K>-Schachtel hat endlich viele Bits, also fasst sie endlich viele Zahlen. Wer das nicht im Kopf hat, schreibt Programme, die für kleine Eingaben stimmen und für grosse stillschweigend falsch rechnen. Diese Lektion erklärt, wo die Grenze liegt, was dahinter passiert und warum man <K>unsigned</K> meiden sollte.</p>}
        en={<p className="lede">An <K>int</K> box has a finite number of bits, so it holds a finite number of values. Whoever does not keep that in mind writes programs that are right for small inputs and silently compute wrongly for large ones. This lesson explains where the limit lies, what happens beyond it, and why one should avoid <K>unsigned</K>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="bereich" title={<T de="1. Wertebereich" en="1. Range of values" />}>
        <Box kind="lecture" src={<Src p="37–38" fig="Code 4.1" />} title={<T de="Wertebereich von int" en="Range of int" />}>
          <T
            de={<>
              <p>Jede Variable liegt irgendwo im Speicher, und die Grösse der Speicherstellen für ganze Zahlen ist begrenzt. Also können die Zahlen in C++ nur einen begrenzten Wertebereich darstellen. Man kann ihn abfragen (Code 4.1; die Ausgabe stammt von Code-Expert).</p>
              <p>Der Typ <K>int</K> wird mit <M>B</M> Bit dargestellt und umfasst die <M>{t`2^B`}</M> ganzen Zahlen</p>
              <p><M>{t`\{-2^{B-1},\ -2^{B-1}+1,\ \dots,\ -1,\ 0,\ 1,\ \dots,\ 2^{B-1}-2,\ 2^{B-1}-1\}.`}</M></p>
              <p>Auf den meisten Plattformen ist <M p=",">{t`B = 32`}</M> also reicht der Bereich von <M>{t`-2^{31}`}</M> bis <M p=".">{t`2^{31}-1`}</M> C++ garantiert nur <M p=";">{t`B \ge 16`}</M> praktisch ist auf üblicher Hardware <M p=".">{t`B \ge 32`}</M></p>
            </>}
            en={<>
              <p>Every variable lives somewhere in memory, and the size of memory locations for integers is limited. So numbers in C++ can only represent a limited range of values. The range can be queried (Code 4.1; the output is from Code-Expert).</p>
              <p>The type <K>int</K> is represented with <M>B</M> bits and comprises the <M>{t`2^B`}</M> integers</p>
              <p><M>{t`\{-2^{B-1},\ -2^{B-1}+1,\ \dots,\ -1,\ 0,\ 1,\ \dots,\ 2^{B-1}-2,\ 2^{B-1}-1\}.`}</M></p>
              <p>On most platforms <M p=",">{t`B = 32`}</M> so the range goes from <M>{t`-2^{31}`}</M> to <M p=".">{t`2^{31}-1`}</M> C++ only guarantees <M p=";">{t`B \ge 16`}</M> in practice <M>{t`B \ge 32`}</M> on common hardware.</p>
            </>}
          />
        </Box>
        <Listing prog={P.rangeInt} label="Code 4.1" />
        <T
          de={<p>Woher die Zahlen kommen: <M>B</M> Bits haben <M>{t`2^B`}</M> verschiedene Muster, und man verteilt sie so, dass etwa die Hälfte negativ ist. Weil die Null zur nichtnegativen Hälfte zählt, gibt es einen negativen Wert mehr als positive: <M>{t`-2^{31}`}</M> hat kein Gegenstück <M p=".">{t`+2^{31}`}</M> Das Bild unten zeigt alle Muster für wenige Bits auf einem Ring; mit 4 Bit sieht man jede Eigenschaft, die auch für 32 Bit gilt.</p>}
          en={<p>Where the numbers come from: <M>B</M> bits have <M>{t`2^B`}</M> different patterns, and they are distributed so that about half is negative. Because zero counts to the non-negative half, there is one more negative value than positive ones: <M>{t`-2^{31}`}</M> has no counterpart <M p=".">{t`+2^{31}`}</M> The figure below shows all patterns for few bits on a ring; with 4 bits you can see every property that also holds for 32 bits.</p>}
        />
        <WrapRing />
        <T
          de={<p>Beobachte: Gehst du mit «+ 1» von der grössten <K>int</K>-Zahl weiter, landest du bei der kleinsten, am unteren Rand des inneren Rings. Der Rechner kennt kein «zu gross»: Er hat nur diese Muster, und nach dem letzten kommt wieder das erste.</p>}
          en={<p>Observe: if you go on with “+ 1” from the largest <K>int</K> value you land on the smallest one, at the bottom of the inner ring. The computer has no “too large”: it only has these patterns, and after the last comes the first again.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ueberlauf" title={<T de="2. Über- und Unterlauf" en="2. Overflow and underflow" />}>
        <Box kind="lecture" src={<Src p="38" />} title={<T de="Überlauf und Unterlauf" en="Over- and underflow" />}>
          <T
            de={<p>Arithmetische Operationen (<K>+</K>, <K>-</K>, <K>*</K>) können Zahlen ausserhalb des gültigen Bereichs erzeugen; dann sind die Ergebnisse falsch. Beispiel: <K>power8.cpp</K> liefert <M p=".">{t`15^8 = -1732076671`}</M> In C++ ist Über- und Unterlauf bei <K>int</K> <b>undefiniertes Verhalten</b>: keine Garantien, keine Fehlermeldungen! (Praktisch lässt sich das Verhalten oft erklären, wenn man weiss, was die Hardware tut, aber auch das ist nicht garantiert.)</p>}
            en={<p>Arithmetic operations (<K>+</K>, <K>-</K>, <K>*</K>) can produce numbers outside the valid domain; then the results are incorrect. Example: <K>power8.cpp</K> gives <M p=".">{t`15^8 = -1732076671`}</M> In C++ over-/underflow of <K>int</K> is <b>undefined behavior</b>: no guarantees, no error messages! (Practically the behavior is often explainable if you know what the hardware does, but even that is not guaranteed.)</p>}
          />
        </Box>
        <Tracer prog={P.power8Big} inputs={['10\n', '14\n', '15\n', '100\n']} label={tr('a hoch 8 für verschiedene Eingaben', 'a to the power of 8 for different inputs')} />
        <T
          de={<p>Schalte die Eingabe von 14 auf 15. Bis 14 stimmt alles; ab 15 meldet der Schritt eine Warnung und die Ausgabe ist falsch, ohne dass irgendetwas «abstürzt». Der Grund: <M>{t`14^8 = 1\,475\,789\,056`}</M> passt noch in <M p=",">{t`2^{31}-1 = 2\,147\,483\,647`}</M> <M>{t`15^8 = 2\,562\,890\,625`}</M> nicht mehr.</p>}
          en={<p>Switch the input from 14 to 15. Up to 14 everything is right; from 15 on the step reports a warning and the output is wrong, without anything “crashing”. The reason: <M>{t`14^8 = 1\,475\,789\,056`}</M> still fits in <M p=",">{t`2^{31}-1 = 2\,147\,483\,647`}</M> <M>{t`15^8 = 2\,562\,890\,625`}</M> no longer.</p>}
        />
        <Box kind="supplement" title={<T de="Garantie der Sprache gegen übliches Verhalten" en="Language guarantee versus usual behavior" />}>
          <T
            de={<p>Die Ausgabe <K>-1732076671</K> ist das, was übliche Rechner tun: Sie rechnen modulo <M>{t`2^{32}`}</M> weiter (der Ring oben). Der Standard verspricht es aber <em>nicht</em>. Ein Compiler darf annehmen, dass ein <K>int</K> nie überläuft, und deshalb Code erzeugen, der bei Überlauf etwas ganz anderes tut. Rechne also nie mit dem «Herumwickeln» bei <K>int</K>; es geht um zwei Ebenen: was <em>garantiert</em> ist (nichts), und was <em>meist</em> passiert (der Ring).</p>}
            en={<p>The output <K>-1732076671</K> is what common computers do: they continue computing modulo <M>{t`2^{32}`}</M> (the ring above). The standard does <em>not</em> promise it though. A compiler may assume that an <K>int</K> never overflows and may therefore generate code that does something quite different on overflow. So never count on the “wrapping” for <K>int</K>; there are two levels: what is <em>guaranteed</em> (nothing), and what <em>usually</em> happens (the ring).</p>}
          />
        </Box>
        <Predict
          prompt={<T de={<>Das Programm rechnet <K>b = a * a; b = b * b;</K> und gibt <K>b * b</K> aus. Für welches grösste <M>a</M> stimmt es, wenn <K>int</K> 32 Bit hat? Schätze zuerst mit Zweierpotenzen.</>} en={<>The program computes <K>b = a * a; b = b * b;</K> and prints <K>b * b</K>. For which largest <M>a</M> is it right if <K>int</K> has 32 bits? Estimate first using powers of two.</>} />}
          answer={<T
            de={<>Gesucht ist <M p=",">{t`a^8 \le 2^{31}-1`}</M> also <M p=".">{t`a \le (2^{31})^{1/8} = 2^{31/8} \approx 2^{3{,}9} \approx 14{,}7`}</M> Also <M p=".">{t`a = 14`}</M> Für <M>{t`a = 15`}</M> ist es bereits zu gross, wie die Tabelle oben bestätigt. <b>Faustregel:</b> Eine <K>int</K>-Zahl fasst etwa 9 bis 10 Dezimalstellen. Ein Ergebnis mit mehr Stellen läuft über.</>}
            en={<>We need <M p=",">{t`a^8 \le 2^{31}-1`}</M> so <M p=".">{t`a \le (2^{31})^{1/8} = 2^{31/8} \approx 2^{3.9} \approx 14.7`}</M> Hence <M p=".">{t`a = 14`}</M> For <M>{t`a = 15`}</M> it is already too large, as the run above confirms. <b>Rule of thumb:</b> an <K>int</K> holds about 9 to 10 decimal digits. A result with more digits overflows.</>}
          />}
        />
        <Box kind="tip" title={<T de="Überläufe vorhersehen statt entdecken" en="Foresee overflows instead of discovering them" />}>
          <T
            de={<ul>
              <li><b>Schätze die Grössenordnung vorher.</b> Ein Produkt zweier Zahlen mit je 5 Stellen hat bis zu 10 Stellen und kann überlaufen. Mit <M>{t`2^{10} \approx 10^3`}</M> rechnest du schnell im Kopf: <M p=".">{t`2^{31} \approx 2{,}1 \cdot 10^9`}</M></li>
              <li><b>Teste die Ränder:</b> grösste und kleinste Eingabe, 0, 1, -1. Fehler passieren dort.</li>
              <li><b>Es gibt keine Fehlermeldung.</b> Ein Programm, das bei grossen Eingaben «seltsame» (negative!) Zahlen liefert, hat fast immer einen Überlauf: Das ist der erste Verdacht.</li>
              <li>Mit der Zeit lernst du später Wege, grössere Zahlen zu erlauben; bis dahin ist <K>int</K> genau so gross, wie es ist.</li>
            </ul>}
            en={<ul>
              <li><b>Estimate the order of magnitude beforehand.</b> A product of two numbers with 5 digits each has up to 10 digits and can overflow. With <M>{t`2^{10} \approx 10^3`}</M> you compute quickly in your head: <M p=".">{t`2^{31} \approx 2.1 \cdot 10^9`}</M></li>
              <li><b>Test the edges:</b> largest and smallest input, 0, 1, -1. Errors happen there.</li>
              <li><b>There is no error message.</b> A program that returns “strange” (negative!) numbers for large inputs almost always has an overflow: that is the first suspect.</li>
              <li>Later you will learn ways to allow larger numbers; until then <K>int</K> is exactly as large as it is.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="unsigned" title={<T de="3. unsigned: dieselben Bits, andere Zahl" en="3. unsigned: the same bits, a different number" />}>
        <Box kind="lecture" src={<Src p="38–39" />} title={<T de="Vorzeichenlose Ganzzahlen und Umwandlung" en="Unsigned integers and conversion" />}>
          <T
            de={<>
              <p>Neben <K>int</K> gibt es <K>unsigned int</K>, der nur Zahlen <M>{t`\ge 0`}</M> darstellt, mit dem Bereich <M p=".">{t`\{0, 1, \dots, 2^B - 1\}`}</M> Alle bisherigen Operationen gibt es auch dafür. Ein Literal wird mit dem Suffix <K>u</K> vorzeichenlos (<K>1u</K>, <K>17u</K>).</p>
              <p><b>int gegen unsigned int:</b> Bei <K>int</K> sind Über- und Unterlauf undefiniertes Verhalten. Bei <K>unsigned int</K> ist es klar definiert: Es wird <b>modulo <M>{t`2^B`}</M></b> gerechnet. In diesem Kurs ignorieren wir den Unterschied meist.</p>
              <p><b>Gemischte Ausdrücke:</b> Operanden dürfen verschiedene Typen haben, z. B. <K>17 + 17u</K>. Ein solcher Ausdruck hat den «allgemeineren» Typ <K>unsigned int</K>; die <K>int</K>-Operanden werden zuerst umgewandelt:</p>
              <p><M>{t`x \ge 0 \mapsto x,\qquad x < 0 \mapsto x + 2^B.`}</M> Der Wert <M>-1</M> wird also zu <M p=".">{t`2^B - 1`}</M> Durch eine «clevere interne Darstellung» muss beim Umwandeln eigentlich nichts getan werden (mehr dazu später; für die Prüfung nicht nötig).</p>
              <p>Umgekehrt: <K>int a = 3u;</K> wandelt <K>3u</K> nach <K>int</K>. Der Wert bleibt erhalten, weil er im Bereich von <K>int</K> liegt, sonst hängt das Ergebnis von der Implementierung ab.</p>
            </>}
            en={<>
              <p>Besides <K>int</K> there is <K>unsigned int</K>, which only represents numbers <M p=",">{t`\ge 0`}</M> with the domain <M p=".">{t`\{0, 1, \dots, 2^B - 1\}`}</M> All operations so far exist for it too. A literal becomes unsigned with the suffix <K>u</K> (<K>1u</K>, <K>17u</K>).</p>
              <p><b>int versus unsigned int:</b> for <K>int</K> over- and underflow are undefined behavior. For <K>unsigned int</K> it is clearly defined: computation is <b>modulo <M>{t`2^B`}</M></b>. In this course we usually ignore the difference.</p>
              <p><b>Mixed expressions:</b> operands may have different types, e.g. <K>17 + 17u</K>. Such an expression has the “more general” type <K>unsigned int</K>; the <K>int</K> operands are converted first:</p>
              <p><M>{t`x \ge 0 \mapsto x,\qquad x < 0 \mapsto x + 2^B.`}</M> So the value <M>-1</M> becomes <M p=".">{t`2^B - 1`}</M> Thanks to a “clever internal representation” nothing actually has to be done when converting (more about it later; not needed for the exam).</p>
              <p>The other way round: <K>int a = 3u;</K> converts <K>3u</K> to <K>int</K>. The value is preserved because it is in the domain of <K>int</K>, otherwise the result depends on the implementation.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Zurück zum Ring: Jedes Bitmuster hat <em>zwei Lesarten</em>. Aussen steht die vorzeichenlose Zahl (0 bis 15), innen die vorzeichenbehaftete (-8 bis 7). Die Umwandlungstabelle ist nichts anderes als «lies denselben Punkt auf dem Ring mit der anderen Skala»: <M>{t`-1`}</M> ist das Muster <K>1111</K>, und das ist als <K>unsigned</K> die 15, also <M p=".">{t`2^4 - 1`}</M> Probiere mit dem Ring oben nach, was <K>0 - 1</K> bei <K>unsigned</K> (die Zahl springt oben auf 15) und bei <K>int</K> (-1) ergibt.</p>}
          en={<p>Back to the ring: every bit pattern has <em>two readings</em>. The outer number is the unsigned one (0 to 15), the inner the signed one (-8 to 7). The conversion table is nothing but “read the same point of the ring with the other scale”: <M>{t`-1`}</M> is the pattern <K>1111</K>, and as <K>unsigned</K> that is 15, i.e. <M p=".">{t`2^4 - 1`}</M> Try with the ring above what <K>0 - 1</K> gives for <K>unsigned</K> (the number jumps to 15 at the top) and for <K>int</K> (-1).</p>}
        />
        <Listing prog={P.unsignedConv} label={tr('Umwandlungen', 'Conversions')} />
        <Box kind="lecture" src={<Src p="39–40" />} title={<T de="unsigned vermeiden" en="Avoid unsigned" />}>
          <T
            de={<>
              <p>Im Internet findest du zwei Lager: Das eine empfiehlt <K>unsigned</K>, wenn ein Wert nie negativ sein kann (der Code dokumentiert dann die Absicht). Wir folgen dem zweiten Lager:</p>
              <p><b>Richtlinie:</b> Vermeide vorzeichenlose Ganzzahlen, ausser du hast einen bestimmten Grund. Hauptgrund: Gemischte Ausdrücke haben überraschende Ergebnisse und führen häufig zu Fehlern.</p>
              <p><i>Beispiel 4.4:</i> <K>unsigned int a = 10; int b = -110; int c = (a + b) / 10;</K> – welche Ausgabe erwartest du? Es ist <K>c=429496719</K>. Die C++ Core Guidelines (Sutter, Stroustrup) nennen gemischte Ausdrücke und das Vermeiden negativer Werte durch <K>unsigned</K> beides «deprecated». Hauptanwendungen von <K>unsigned</K>: Bitmanipulation und explizite Speicheradressen.</p>
            </>}
            en={<>
              <p>On the internet you find two camps: one recommends <K>unsigned</K> whenever a value can never be negative (the code then documents the intention). We follow the second camp:</p>
              <p><b>Guideline:</b> avoid unsigned integers unless you have specific reasons to use them. Main reason: mixed expressions have surprising outcomes and frequently lead to errors.</p>
              <p><i>Example 4.4:</i> <K>unsigned int a = 10; int b = -110; int c = (a + b) / 10;</K> – what output do you expect? It is <K>c=429496719</K>. The C++ Core Guidelines (Sutter, Stroustrup) call mixed expressions and avoiding negative values by using <K>unsigned</K> both “deprecated”. Main uses of <K>unsigned</K>: bit manipulation and explicit memory addresses.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.unsignedSurprise} label={tr('Beispiel 4.4', 'Example 4.4')} />
        <T
          de={<p>Warum <K>429496719</K>? In <K>a + b</K> ist <K>a</K> vom Typ <K>unsigned</K>, <K>b</K> vom Typ <K>int</K>. Nach der Regel wird <K>b = -110</K> zuerst nach <K>unsigned</K> umgewandelt, wird also zu <M p=".">{t`2^{32} - 110`}</M> Die Summe ist <M p=",">{t`10 + 2^{32} - 110 = 2^{32} - 100`}</M> eine riesige positive Zahl, und <M>{t`(2^{32}-100)/10`}</M> ergibt (Ganzzahldivision) <M p=".">429496719</M> Mathematisch hätte <M>{t`(10-110)/10 = -10`}</M> herauskommen sollen. Der Fehler entsteht <em>vor</em> der Division, im Ausdruck <K>a + b</K>, und der Compiler meldet nichts.</p>}
          en={<p>Why <K>429496719</K>? In <K>a + b</K>, <K>a</K> has type <K>unsigned</K>, <K>b</K> has type <K>int</K>. By the rule <K>b = -110</K> is converted to <K>unsigned</K> first, so it becomes <M p=".">{t`2^{32} - 110`}</M> The sum is <M p=",">{t`10 + 2^{32} - 110 = 2^{32} - 100`}</M> a huge positive number, and <M>{t`(2^{32}-100)/10`}</M> gives (integer division) <M p=".">429496719</M> Mathematically <M>{t`(10-110)/10 = -10`}</M> should have come out. The error arises <em>before</em> the division, in the expression <K>a + b</K>, and the compiler says nothing.</p>}
        />
        <Choice
          question={<T de={<>Was ergibt <K>-1 &lt; 1u</K> in C++?</>} en={<>What does <K>-1 &lt; 1u</K> yield in C++?</>} />}
          choices={[
            { text: <T de="true (1), wie in der Mathematik" en="true (1), as in mathematics" />, why: <T de={<>Nein. Der Vergleich ist ein gemischter Ausdruck: <K>-1</K> wird nach <K>unsigned</K> umgewandelt und ist dann <M p=",">{t`2^{32}-1`}</M> also grösser als 1.</>} en={<>No. The comparison is a mixed expression: <K>-1</K> is converted to <K>unsigned</K> and then is <M p=",">{t`2^{32}-1`}</M> thus larger than 1.</>} /> },
            { text: <T de="false (0)" en="false (0)" />, correct: true, why: <T de={<>Ja: <K>-1</K> wird zu <M p=",">{t`2^{32}-1`}</M> und das ist nicht kleiner als 1. Ein klassischer Grund, <K>unsigned</K> zu vermeiden.</>} en={<>Yes: <K>-1</K> becomes <M p=",">{t`2^{32}-1`}</M> and that is not less than 1. A classic reason to avoid <K>unsigned</K>.</>} /> },
            { text: <T de="Compilerfehler" en="Compiler error" />, why: <T de="Nein, gemischte Typen sind erlaubt. Genau das macht sie gefährlich: Es gibt keine Meldung." en="No, mixed types are allowed. That is exactly what makes them dangerous: there is no message." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Typische Missverständnisse" en="4. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«Bei Überlauf bricht das Programm ab.»" en="“On overflow the program aborts.”" />}>
          <T
            de={<>Nein, es läuft weiter und rechnet mit dem falschen Wert. Es gibt weder eine Meldung noch einen Absturz; deshalb ist der Überlauf so gefährlich.</>}
            en={<>No, it carries on and computes with the wrong value. There is neither a message nor a crash; that is why overflow is so dangerous.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«unsigned verhindert negative Zahlen.»" en="“unsigned prevents negative numbers.”" />}>
          <T
            de={<>Es verhindert sie nicht, es <em>versteckt</em> sie: Ein negatives Ergebnis wird als riesige positive Zahl gelesen (<K>0 - 1</K> wird <M p=").">{t`2^{32}-1`}</M> Der Fehler bleibt, nur die Warnung fehlt.</>}
            en={<>It does not prevent them, it <em>hides</em> them: a negative result is read as a huge positive number (<K>0 - 1</K> becomes <M p=").">{t`2^{32}-1`}</M> The error stays, only the warning is missing.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Der Wertebereich ist symmetrisch.»" en="“The range is symmetric.”" />}>
          <T
            de={<>Es gibt einen negativen Wert mehr als positive: <M>{t`-2^{31}`}</M> bis <M p=".">{t`2^{31}-1`}</M> Darum ist <K>-x</K> für den kleinsten <K>int</K> nicht darstellbar, und <K>abs</K> des kleinsten Werts geht schief.</>}
            en={<>There is one more negative value than positive ones: <M>{t`-2^{31}`}</M> to <M p=".">{t`2^{31}-1`}</M> That is why <K>-x</K> for the smallest <K>int</K> is not representable, and <K>abs</K> of the smallest value goes wrong.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>int</K> hat <M>B</M> Bit (meist 32) und fasst <M>{t`-2^{B-1}`}</M> bis <M p=":">{t`2^{B-1}-1`}</M> etwa 9 bis 10 Dezimalstellen.</li>
              <li>Über- und Unterlauf von <K>int</K> ist undefiniertes Verhalten und liefert still falsche Ergebnisse. Üblich ist das Weiterrechnen modulo <M p=",">{t`2^B`}</M> garantiert ist es nicht.</li>
              <li><K>unsigned</K> rechnet garantiert modulo <M p=";">{t`2^B`}</M> negative <K>int</K>-Werte werden dort zu <M p=".">{t`x + 2^B`}</M> Gemischte Ausdrücke nehmen den Typ <K>unsigned</K>.</li>
              <li>Richtlinie: <K>unsigned</K> meiden. Vor jeder Rechnung die Grössenordnung abschätzen.</li>
            </ul>}
            en={<ul>
              <li><K>int</K> has <M>B</M> bits (usually 32) and holds <M>{t`-2^{B-1}`}</M> to <M p=":">{t`2^{B-1}-1`}</M> about 9 to 10 decimal digits.</li>
              <li>Over- and underflow of <K>int</K> is undefined behavior and silently yields wrong results. Continuing modulo <M>{t`2^B`}</M> is usual, but not guaranteed.</li>
              <li><K>unsigned</K> computes modulo <M>{t`2^B`}</M> by guarantee; negative <K>int</K> values become <M>{t`x + 2^B`}</M> there. Mixed expressions take the type <K>unsigned</K>.</li>
              <li>Guideline: avoid <K>unsigned</K>. Estimate the order of magnitude before every computation.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Kommazahlen haben einen riesigen Bereich, aber andere Tücken: Nicht jede Zahl lässt sich darstellen (Skript S. 40–43).</p>}
          en={<p className="connections"><b>Next:</b> floating point numbers have a huge range but other pitfalls: not every number can be represented (notes pp. 40–43).</p>}
        />
      </Section>
    </article>
  );
}
