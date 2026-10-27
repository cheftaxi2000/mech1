import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CaesarWheel } from '../viz/info/TextFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I6Caesar() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Julius Caesar soll seine Nachrichten verschlüsselt haben, indem er jeden Buchstaben um drei Stellen im Alphabet verschob. Die Idee ist so einfach, dass sie ein gutes Übungsbeispiel ist: Sie braucht Zeichenarithmetik, eine Funktion mit Vor- und Nachbedingung, Ein- und Ausgabe Zeichen für Zeichen, und eine Rechnung mit Rest, bei der man das Vorzeichen im Auge behalten muss.</p>}
        en={<p className="lede">Julius Caesar is said to have encrypted his messages by shifting every letter by three places in the alphabet. The idea is so simple that it makes a good exercise: it needs character arithmetic, a function with pre- and postcondition, input and output character by character, and a calculation with a remainder where one has to keep an eye on the sign.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="idee" title={<T de="1. Die Idee" en="1. The idea" />}>
        <Box kind="lecture" src={<Src p="115–116" />} title={<T de="Die Caesar-Chiffre" en="The Caesar cipher" />}>
          <T
            de={<>
              <p>Die Caesar-Chiffre ersetzt in ihrer einfachsten Form jedes druckbare Zeichen eines Textes durch ein Zeichen, das um eine Zahl im Alphabet verschoben ist (und am Ende des Alphabets wieder von vorn beginnt). Zum Beispiel wird das Wort ZEBRA bei Verschiebung um 1 zu AFCSB und bei Verschiebung um <K>-1</K> zu YDAQZ.</p>
              <p>In der Abbildung im Skript werden die (druckbaren) Zeichen durch ihren Vor-vor-vor-Vorgänger ersetzt (Verschiebung um <K>-3</K>): <K>' '</K> (32) → <K>'|'</K> (124), <K>'!'</K> (33) → <K>{"'}'"}</K> (125), <K>'D'</K> (68) → <K>'A'</K> (65), <K>'E'</K> (69) → <K>'B'</K> (66), <K>'~'</K> (126) → <K>{"'{'"}</K> (123).</p>
            </>}
            en={<>
              <p>The Caesar cipher in its simplest form replaces every printable character in a text by a character shifted by some number in the alphabet (and wrapping around at the end of the alphabet). For instance, the word ZEBRA is transformed to AFCSB when shifting by 1 or to YDAQZ when shifting by <K>-1</K>.</p>
              <p>In the illustration in the notes the (printable) characters are replaced by their pre-pre-predecessor (a shift of <K>-3</K>): <K>' '</K> (32) → <K>'|'</K> (124), <K>'!'</K> (33) → <K>{"'}'"}</K> (125), <K>'D'</K> (68) → <K>'A'</K> (65), <K>'E'</K> (69) → <K>'B'</K> (66), <K>'~'</K> (126) → <K>{"'{'"}</K> (123).</p>
            </>}
          />
        </Box>
        <T
          de={<p>Sieh dir das Rad an: Aussen steht der Klartext, innen die Chiffre, um <K>s</K> Stellen verdreht. Stelle <K>s = -3</K> ein und schau auf das Leerzeichen <K>␣</K> (Code 32) und die Tilde <K>~</K> (Code 126): Das Rad dreht sich über die <em>Ränder</em> hinweg, aus <K>␣</K> wird <K>|</K>, aus <K>~</K> wird <K>{'{'}</K>. Genau das beschreibt die Abbildung im Skript.</p>}
          en={<p>Look at the wheel: outside stands the plain text, inside the cipher, turned by <K>s</K> places. Set <K>s = -3</K> and look at the blank <K>␣</K> (code 32) and the tilde <K>~</K> (code 126): the wheel turns across the <em>edges</em>, <K>␣</K> becomes <K>|</K>, <K>~</K> becomes <K>{'{'}</K>. That is exactly what the illustration in the notes describes.</p>}
        />
        <CaesarWheel />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="formel" title={<T de="2. Die Rechnung in drei Schritten" en="2. The calculation in three steps" />}>
        <Box kind="lecture" src={<Src p="116" />} title={<T de="Wie rechnet man den neuen Code aus?" en="How do we compute the new code?" />}>
          <T
            de={<>
              <p>Wie berechnen wir den ASCII-Code eines Zeichens <K>c</K> bei Verschiebung <K>s</K>? Im Grunde brauchen wir nur <K>c + s</K>. Das Problem: Das Ergebnis kann grösser als 126 oder kleiner als 32 sein. Dann könnte man bei zu grossen Zahlen 95 abziehen (127 entspricht dann 32, 128 entspricht 33 und so weiter) und bei zu kleinen 95 addieren (31 entspricht 126, 30 entspricht 125 …). Das ginge mit einer Fallunterscheidung.</p>
              <p>Es gibt aber einen kürzeren, eleganteren Weg mit Modulo-Arithmetik. Die Idee: Man bildet das druckbare Zeichen vom Bereich <M>{t`[32, 126]`}</M> auf den Bereich <M>{t`[0, 94]`}</M> ab, indem man 32 abzieht. Dann addiert man die Verschiebung und bestimmt mit Rechnung modulo 95 die Zahl in <M p=".">{t`[0, 94]`}</M> Diese Zahl bildet man zurück, indem man 32 addiert. Zusammengefasst: <K>(c - 32 + s) % 95 + 32</K>.</p>
              <p>Nur eine Kleinigkeit: Ist <K>c - 32 + s</K> negativ, funktioniert der Modulo-Operator nicht wie gewünscht. Das vermeidet man, indem man 95 addiert (allgemein den Modul), sodass die Zahl nichtnegativ ist: <K>(c - 32 + s + 95) % 95 + 32</K>. Code 9.1 enthält das Programm mit der richtigen Modulo-Rechnung in der Funktion <K>int mod(int dividend, int divisor)</K>.</p>
            </>}
            en={<>
              <p>How do we compute the ASCII code of a character <K>c</K> with a shift <K>s</K>? We basically only need to compute <K>c + s</K>. The only problem is that the resulting number can be larger than 126 or smaller than 32. In that case we could just subtract 95 for too large numbers (so that e.g. 127 corresponds to 32 and 128 corresponds to 33, and so on) and add 95 for too small numbers (so that e.g. 31 corresponds to 126 and 30 corresponds to 125, and so on). This could be done with a case distinction.</p>
              <p>There is a shorter and more elegant way to achieve this using modulo arithmetic, however. The idea is to first map the (printable) character from the range <M>{t`[32, 126]`}</M> to the range <M>{t`[0, 94]`}</M> by subtracting 32. We then add the shift and use modulo arithmetic, modulo 95, to determine the resulting number in <M p=".">{t`[0, 94]`}</M> This number can be mapped back to the desired range by adding 32. In summary, we want to compute <K>(c - 32 + s) % 95 + 32</K>.</p>
              <p>There is only one technicality: if the number <K>c - 32 + s</K> is negative, the modulo operator does not work as desired. We avoid this by adding 95 (or, more generally, the modulus) to ensure that the number is non-negative, resulting in <K>(c - 32 + s + 95) % 95 + 32</K>. Code 9.1 contains the corresponding program with the correct modulo computation in the function <K>int mod(int dividend, int divisor)</K>.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Das Bild dazu: eine Uhr mit 95 Ziffern.</b> Subtrahiert man 32, beginnt das Zifferblatt bei 0. Die Verschiebung dreht den Zeiger um <K>s</K> Schritte, und der Rest bei Division durch 95 macht aus «zu weit gedreht» wieder einen Platz auf dem Zifferblatt: so wie 14 Uhr auf der Uhr 2 Uhr ist. Das Zurückrechnen (<K>+ 32</K>) setzt den Platz wieder in einen ASCII-Code um. Genau wie im Ring der Lektion über Ganzzahlen: Wer über das Ende hinausgeht, kommt am Anfang wieder an.</p>
            <p><b>Warum die Korrektur nötig ist.</b> In C++ hat der Rest dasselbe Vorzeichen wie der Dividend: <K>-3 % 5</K> ist <K>-3</K>, nicht <K>2</K>. Ein negativer «Platz auf dem Zifferblatt» gibt es nicht. Mit <K>+ divisor</K> wird die Zahl zuerst in den Bereich <K>0 … divisor-1</K> gebracht, nach dem zweiten <K>% divisor</K> ist sie sicher in <K>0 … divisor-1</K>. Beides ist nötig: das erste <K>%</K> bringt eine beliebig negative Zahl nach <K>-(divisor-1) … divisor-1</K>, das <K>+ divisor</K> macht sie nichtnegativ, das zweite <K>%</K> macht sie wieder kleiner als <K>divisor</K>.</p>
          </>}
          en={<>
            <p><b>The picture for this: a clock with 95 digits.</b> Subtracting 32 makes the dial start at 0. The shift turns the hand by <K>s</K> steps, and the remainder on division by 95 turns “turned too far” back into a place on the dial: as 14 o’clock is 2 o’clock on the clock. Calculating back (<K>+ 32</K>) turns the place into an ASCII code again. Exactly as in the ring of the lesson on integers: whoever goes beyond the end arrives at the beginning again.</p>
            <p><b>Why the correction is needed.</b> In C++ the remainder has the same sign as the dividend: <K>-3 % 5</K> is <K>-3</K>, not <K>2</K>. There is no negative “place on the dial”. With <K>+ divisor</K> the number is first brought into the range <K>0 … divisor-1</K>; after the second <K>% divisor</K> it is certainly in <K>0 … divisor-1</K>. Both are needed: the first <K>%</K> brings an arbitrarily negative number into <K>-(divisor-1) … divisor-1</K>, the <K>+ divisor</K> makes it non-negative, the second <K>%</K> makes it smaller than <K>divisor</K> again.</p>
          </>}
        />
        <Listing prog={P.modDemo} label={tr('-3 % 5 ist -3; mit Korrektur 2; und das Leerzeichen bei s = -3: 32 → 124', '-3 % 5 is -3; with the correction 2; and the blank at s = -3: 32 → 124')} />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="programm" title={<T de="3. Das Programm" en="3. The program" />}>
        <Box kind="lecture" src={<Src p="117" />} title={<T de="Code 9.1" en="Code 9.1" />}>
          <T
            de={<>
              <p>Code 9.1 liest einen Verschiebungswert und einen Text von der Standardeingabe und schreibt den verschlüsselten Text auf die Standardausgabe. Beachte die Zeile <K>std::cin &gt;&gt; std::noskipws;</K>: Sie sorgt dafür, dass beim Lesen von der Standardeingabe auch Leerraumzeichen <em>nicht übersprungen</em> werden.</p>
            </>}
            en={<>
              <p>Code 9.1 reads a shift value and a text from standard input and writes the encoded text to standard output. Note the line <K>std::cin &gt;&gt; std::noskipws;</K>: it makes sure that whitespace characters are <em>not skipped</em> when reading from standard input.</p>
            </>}
          />
        </Box>
        <Tracer stack prog={P.caesar} inputs={['3\nHello, World!', '-3\nKhoor/#Zruog$', '95\nHello']} label={tr('Code 9.1 mit drei Eingaben', 'Code 9.1 with three inputs')} />
        <T
          de={<>
            <p><b>Das Programm in vier Teilen.</b> <K>mod</K> ist die Rechnung von oben. <K>shift</K> wendet sie auf <em>ein</em> Zeichen an, aber nur, wenn es druckbar ist (<K>c &gt;= 32 &amp;&amp; c &lt;= 126</K>): Steuerzeichen wie der Zeilenumbruch bleiben, wie sie sind. <K>caesar</K> liest Zeichen für Zeichen und schreibt jedes verschoben aus. <K>main</K> liest zuerst die Zahl <K>s</K>.</p>
            <p><b>Wie das Lesen funktioniert.</b> Die Bedingung <K>while (std::cin &gt;&gt; next)</K> liest ein Zeichen <em>und</em> prüft, ob das Lesen geklappt hat. Das Lesen scheitert am Ende der Eingabe, und die Schleife endet. Probiere die Eingaben durch: Mit <K>3</K> wird «<K>Hello, World!</K>» zu «<K>Khoor/#Zruog$</K>», und mit <K>-3</K> läuft die Chiffre zurück zum Klartext. Und mit <K>95</K> kommt der Text unverändert heraus: Eine Verschiebung um die ganze Länge des Zifferblatts ist eine volle Umdrehung.</p>
          </>}
          en={<>
            <p><b>The program in four parts.</b> <K>mod</K> is the calculation from above. <K>shift</K> applies it to <em>one</em> character, but only if it is printable (<K>c &gt;= 32 &amp;&amp; c &lt;= 126</K>): control characters such as the line break stay as they are. <K>caesar</K> reads character by character and writes each one shifted. <K>main</K> reads the number <K>s</K> first.</p>
            <p><b>How the reading works.</b> The condition <K>while (std::cin &gt;&gt; next)</K> reads a character <em>and</em> checks whether the reading succeeded. Reading fails at the end of the input, and the loop ends. Try the inputs: with <K>3</K> “<K>Hello, World!</K>” becomes “<K>Khoor/#Zruog$</K>”, and with <K>-3</K> the cipher runs back to the plain text. And with <K>95</K> the text comes out unchanged: a shift by the whole length of the dial is one full turn.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Die Falle beim ersten Zeichen" en="The trap at the first character" />}>
          <T
            de={<ul>
              <li><b>Das erste Zeichen nach der Zahl ist der Zeilenumbruch (oder ein Leerzeichen).</b> Nach <K>std::cin &gt;&gt; s</K> steht das Lesen direkt <em>hinter</em> der Zahl. Mit <K>noskipws</K> wird das nächste Zeichen gelesen, auch wenn es ein Zwischenraum ist. Bei <K>3</K>, Zeilenumbruch, <K>Hello</K> ist das erste gelesene Zeichen der Umbruch: nicht druckbar, bleibt unverändert, die Ausgabe beginnt mit einer Leerzeile. Bei <K>3 Hello</K> (Leerzeichen) wird das Leerzeichen <em>mit verschlüsselt</em> (aus <K>' '</K> wird <K>'#'</K>). Das ist kein Fehler, aber überraschend: Probiere es oben mit der Eingabe <K>3</K> + Leerzeichen aus. Entscheide bewusst, was die Zahl von dem Text trennt.</li>
              <li><b>Ver- und Entschlüsseln sind dieselbe Funktion:</b> <K>shift(c, s)</K> und <K>shift(c, -s)</K>. Prüfe jede Chiffre, indem du sie zurückrechnest. (Der Test in diesem Projekt tut das für alle 95 Zeichen und alle Verschiebungen von <K>-200</K> bis <K>200</K>.)</li>
              <li><b>Bedingung und Lesen in einem:</b> <K>while (std::cin &gt;&gt; next)</K> ist die übliche Schreibweise. Ohne diese Bedingung (<K>while (true)</K> mit <K>cin &gt;&gt; next</K>) gäbe es nach dem Ende der Eingabe eine Endlosschleife mit dem zuletzt gelesenen Zeichen.</li>
            </ul>}
            en={<ul>
              <li><b>The first character after the number is the line break (or a blank).</b> After <K>std::cin &gt;&gt; s</K> the reading stands right <em>behind</em> the number. With <K>noskipws</K> the next character is read even if it is whitespace. With <K>3</K>, line break, <K>Hello</K> the first character read is the break: not printable, stays unchanged, the output begins with an empty line. With <K>3 Hello</K> (blank) the blank is <em>encrypted too</em> (<K>' '</K> becomes <K>'#'</K>). That is no error but surprising: try it above with the input <K>3</K> + blank. Decide deliberately what separates the number from the text.</li>
              <li><b>Encrypting and decrypting are the same function:</b> <K>shift(c, s)</K> and <K>shift(c, -s)</K>. Check every cipher by calculating it back. (This project’s test does so for all 95 characters and all shifts from <K>-200</K> to <K>200</K>.)</li>
              <li><b>Condition and reading in one:</b> <K>while (std::cin &gt;&gt; next)</K> is the usual notation. Without this condition (<K>while (true)</K> with <K>cin &gt;&gt; next</K>) there would be an endless loop with the last character read after the end of the input.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="zebra" title={<T de="4. ZEBRA: Wörter und Rad" en="4. ZEBRA: words and wheel" />}>
        <T
          de={<>
            <p>Das Beispiel im Skript, ZEBRA → AFCSB bei Verschiebung um 1, ist die Variante, in der <em>nur die 26 Grossbuchstaben</em> im Kreis laufen. Das Programm in Code 9.1 verschiebt dagegen über alle <em>95</em> druckbaren Zeichen: Dort wird aus <K>'Z'</K> (90) das nächste Zeichen <K>'['</K> (91), nicht <K>'A'</K>. Beide Rechnungen sind <em>dieselbe Idee</em> mit verschiedenem Modul: 95 oder 26, verschiedener Anfang: <K>32</K> oder <K>'A'</K>.</p>
          </>}
          en={<>
            <p>The example in the notes, ZEBRA → AFCSB when shifting by 1, is the variant in which <em>only the 26 capital letters</em> run in a circle. The program in Code 9.1, however, shifts over all <em>95</em> printable characters: there <K>'Z'</K> (90) becomes the next character <K>'['</K> (91), not <K>'A'</K>. Both calculations are <em>the same idea</em> with a different modulus: 95 or 26, and a different start: <K>32</K> or <K>'A'</K>.</p>
          </>}
        />
        <Listing prog={P.zebra} label={tr('Drei Verschiebungen von ZEBRA: über 95 Zeichen (+1), über 26 Buchstaben (+1), über 26 Buchstaben (−1)', 'Three shifts of ZEBRA: over 95 characters (+1), over 26 letters (+1), over 26 letters (−1)')} />
        <T
          de={<p>Die Ausgabe zeigt <K>[FCSB AFCSB YDAQZ</K>: Das erste Wort ist Code 9.1, das zweite und dritte sind die Beispiele des Skripts. (Das Skript benutzt AFCSB und YDAQZ für die Chiffre über das Alphabet; die Funktion <K>shift_letter</K> ist unsere eigene, nicht aus dem Skript, sie zeigt dieselbe Rechnung für 26 statt 95.)</p>}
          en={<p>The output shows <K>[FCSB AFCSB YDAQZ</K>: the first word is Code 9.1, the second and third are the examples of the notes. (The notes use AFCSB and YDAQZ for the cipher over the alphabet; the function <K>shift_letter</K> is our own, not from the notes; it shows the same calculation for 26 instead of 95.)</p>}
        />
        <Choice
          question={<T de={<>Welcher Ausdruck verschiebt einen Grossbuchstaben <K>c</K> zyklisch um <K>s</K> Stellen im Alphabet (auch für negative <K>s</K>)?</>} en={<>Which expression shifts a capital letter <K>c</K> cyclically by <K>s</K> places in the alphabet (also for negative <K>s</K>)?</>} />}
          choices={[
            { text: <K>'A' + (c - 'A' + s % 26 + 26) % 26</K>, correct: true, why: <T de={<>Richtig: <K>c - 'A'</K> ist die Stelle (0 bis 25), <K>s % 26</K> hält die Verschiebung klein, <K>+ 26</K> verhindert negative Werte, das äussere <K>% 26</K> bringt sie zurück in 0 bis 25, und <K>'A' +</K> macht wieder ein Zeichen daraus.</>} en={<>Correct: <K>c - 'A'</K> is the position (0 to 25), <K>s % 26</K> keeps the shift small, <K>+ 26</K> prevents negative values, the outer <K>% 26</K> brings it back to 0 to 25, and <K>'A' +</K> turns it into a character again.</>} /> },
            { text: <K>'A' + (c - 'A' + s) % 26</K>, why: <T de={<>Für negative <K>s</K> kann <K>c - 'A' + s</K> negativ werden, und dann ist auch der Rest negativ: Das Ergebnis liegt vor <K>'A'</K>.</>} en={<>For negative <K>s</K>, <K>c - 'A' + s</K> can become negative, and then the remainder is negative too: the result lies before <K>'A'</K>.</>} /> },
          ]}
        />
        <Predict
          prompt={<T de={<>Was geschieht mit dem Zeilenumbruch <K>'\n'</K> (Code 10), wenn man ihn mit <K>shift</K> aus Code 9.1 verarbeitet?</>} en={<>What happens to the line break <K>'\n'</K> (code 10) when it is processed with <K>shift</K> from Code 9.1?</>} />}
          answer={<T de={<>Nichts: Er liegt nicht im Bereich 32 bis 126, die Bedingung <K>c &gt;= 32 &amp;&amp; c &lt;= 126</K> ist falsch, und <K>shift</K> gibt <K>c</K> unverändert zurück. Zeilen bleiben Zeilen, auch im Chiffretext.</>} en={<>Nothing: it is not in the range 32 to 126, the condition <K>c &gt;= 32 &amp;&amp; c &lt;= 126</K> is false, and <K>shift</K> returns <K>c</K> unchanged. Lines stay lines, also in the cipher text.</>} />}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Zyklisches Verschieben: auf Platz <K>0 … n-1</K> abbilden (<K>c - 32</K>), verschieben (<K>+ s</K>), Rest bilden (<K>% 95</K>), zurückbilden (<K>+ 32</K>).</li>
              <li>Der Rest hat in C++ das Vorzeichen des Dividenden: Für negative Verschiebungen <K>(x % m + m) % m</K>, die Funktion <K>mod</K>.</li>
              <li>Nur druckbare Zeichen (32 bis 126) werden verschoben; alle anderen bleiben.</li>
              <li><K>std::cin &gt;&gt; std::noskipws</K> liest auch Leerraum; <K>while (std::cin &gt;&gt; c)</K> liest bis zum Ende der Eingabe.</li>
              <li>Entschlüsseln heisst mit <K>-s</K> verschlüsseln.</li>
            </ul>}
            en={<ul>
              <li>Cyclic shifting: map to place <K>0 … n-1</K> (<K>c - 32</K>), shift (<K>+ s</K>), take the remainder (<K>% 95</K>), map back (<K>+ 32</K>).</li>
              <li>The remainder in C++ has the sign of the dividend: for negative shifts <K>(x % m + m) % m</K>, the function <K>mod</K>.</li>
              <li>Only printable characters (32 to 126) are shifted; all others stay.</li>
              <li><K>std::cin &gt;&gt; std::noskipws</K> also reads whitespace; <K>while (std::cin &gt;&gt; c)</K> reads until the end of the input.</li>
              <li>Decrypting means encrypting with <K>-s</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Ganze Texte statt einzelner Zeichen: <K>std::string</K>, der Typ, der sich wie ein Vektor von <K>char</K> verhält (Skript S. 116–118).</p>}
          en={<p className="connections"><b>Next:</b> whole texts instead of single characters: <K>std::string</K>, the type that behaves like a vector of <K>char</K> (notes pp. 116–118).</p>}
        />
      </Section>
    </article>
  );
}
