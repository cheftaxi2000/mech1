import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { AsciiTable, Utf8Figure } from '../viz/info/TextFigures';
import { Listing, Tracer } from '../viz/info/Tracer';


export default function I6Zeichen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Für den Rechner gibt es nur Zahlen. Wie kommt dann ein Buchstabe auf den Bildschirm? Durch eine Vereinbarung: Jedem Zeichen wird eine Nummer zugeordnet, und wenn der Rechner «A» speichert, speichert er 65. Diese Lektion zeigt den Typ <K>char</K>, die ASCII-Tabelle, mit der man mit Buchstaben rechnen kann, und UTF-8, mit dem auch Umlaute, Euro-Zeichen und Emojis Platz finden.</p>}
        en={<p className="lede">For the computer there are only numbers. How then does a letter get on the screen? By an agreement: every character is assigned a number, and when the computer stores “A”, it stores 65. This lesson shows the type <K>char</K>, the ASCII table that lets you calculate with letters, and UTF-8, which also has room for umlauts, euro signs and emojis.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="char" title={<T de="1. Der Typ char" en="1. The type char" />}>
        <Box kind="lecture" src={<Src p="114" />} title={<T de="Zeichen und Texte" en="Characters and texts" />}>
          <T
            de={<>
              <p>Wir haben schon Texte gesehen: In <K>std::cout &lt;&lt; "Prime numbers in {'{2,...,999}'}:\n";</K> ist der Text in Anführungszeichen ein <b>String-Literal</b>. Wie können wir mit Texten arbeiten? Texte bestehen aus Zeichen. Ein <b>Zeichen</b> ist ein Wert des fundamentalen Typs <K>char</K>. Ein Text ist ein Wert des Typs <K>std::string</K>, der sich wie ein Vektor von <K>char</K>-Elementen verhält.</p>
              <p>Der Typ <K>char</K> stellt druckbare Zeichen dar, etwa <K>'a'</K>, und Steuerzeichen wie <K>'\n'</K>. Die Deklarationsanweisung <K>char c = 'a';</K> deklariert eine Variable vom Typ <K>char</K> und initialisiert sie mit <K>'a'</K>, einem Literal vom Typ <K>char</K>.</p>
              <p>Der Typ <K>char</K> ist formal ein <b>Ganzzahltyp</b>, dessen Werte in <K>int</K> und <K>unsigned int</K> umwandelbar sind. Alle arithmetischen Operatoren sind verfügbar (nicht alle scheinen sinnvoll, etwa <K>'a'/'b'</K>). <K>char</K>-Werte belegen typischerweise 8 Bit.</p>
            </>}
            en={<>
              <p>We have seen texts before: in <K>std::cout &lt;&lt; "Prime numbers in {'{2,...,999}'}:\n";</K> the text in quotes is a <b>string literal</b>. How can we work with texts? Texts comprise characters. A <b>character</b> is a value of the fundamental type <K>char</K>. A text is a value of type <K>std::string</K> that behaves like a vector of <K>char</K> elements.</p>
              <p>The type <K>char</K> represents printable characters, e.g. <K>'a'</K>, and control characters such as <K>'\n'</K>. The declaration statement <K>char c = 'a';</K> declares a variable of type <K>char</K> and initializes it with <K>'a'</K>, a literal of type <K>char</K>.</p>
              <p>The type <K>char</K> is formally an <b>integer type</b> with values that are convertible to <K>int</K> and <K>unsigned int</K>. All arithmetic operators are available (not all of which seem to make sense, such as <K>'a'/'b'</K>). <K>char</K> values typically occupy 8 bits.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.charBasics} label={tr('Dasselbe Kästchen, zwei Lesarten', 'The same box, two readings')} />
        <T
          de={<>
            <p><b>Was hier passiert.</b> Die Tabelle zeigt <K>c</K> als <K>'a' (97)</K>: Zeichen <em>und</em> Zahl, es ist dasselbe Kästchen. Was <em>ausgegeben</em> wird, hängt allein vom <em>Typ</em> des Ausdrucks ab. <K>std::cout &lt;&lt; c</K> druckt das Zeichen <K>a</K>. <K>int(c)</K> ist dieselbe Zahl als <K>int</K>, also druckt sie 97. Bei <K>c + 1</K> rechnet C++ mit <K>int</K> (wie bei jeder Rechnung mit kleinen Typen), das Ergebnis ist 98 und wird als Zahl gedruckt. Erst <K>char(c + 1)</K> macht daraus wieder ein Zeichen: <K>b</K>.</p>
            <p>Merke dir die Regel: <em>Ein Zeichen und seine Zahl sind dieselbe Information, der Typ entscheidet über die Darstellung.</em> Wer ein Zeichen als Zahl sehen will, schreibt <K>int(c)</K>, wer eine Zahl als Zeichen sehen will, schreibt <K>char(x)</K>.</p>
          </>}
          en={<>
            <p><b>What happens here.</b> The table shows <K>c</K> as <K>'a' (97)</K>: character <em>and</em> number, it is the same box. What is <em>printed</em> depends only on the <em>type</em> of the expression. <K>std::cout &lt;&lt; c</K> prints the character <K>a</K>. <K>int(c)</K> is the same number as an <K>int</K>, so it prints 97. With <K>c + 1</K> C++ calculates with <K>int</K> (as for every calculation with small types), the result is 98 and printed as a number. Only <K>char(c + 1)</K> turns it back into a character: <K>b</K>.</p>
            <p>Remember the rule: <em>a character and its number are the same information, the type decides about the display.</em> To see a character as a number write <K>int(c)</K>, to see a number as a character write <K>char(x)</K>.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ascii" title={<T de="2. ASCII: die Nummern der Zeichen" en="2. ASCII: the numbers of the characters" />}>
        <Box kind="lecture" src={<Src p="114–115" />} title={<T de="Der ASCII-Code" en="The ASCII code" />}>
          <T
            de={<>
              <p>Der <b>ASCII</b>-Code (<span lang="en">American Standard Code for Information Interchange</span>) legt konkrete Umwandlungsregeln zwischen <K>char</K> und (vorzeichenlosem) <K>int</K> fest und wird von allen gängigen Computersystemen unterstützt. Für Buchstaben und Ziffern gilt:</p>
              <ul>
                <li><K>'A'</K>, <K>'B'</K>, …, <K>'Z'</K> → 65, 66, …, 90</li>
                <li><K>'a'</K>, <K>'b'</K>, …, <K>'z'</K> → 97, 98, …, 122</li>
                <li><K>'0'</K>, <K>'1'</K>, …, <K>'9'</K> → 48, 49, …, 57</li>
              </ul>
              <p>Insgesamt gibt es 95 druckbare Zeichen mit ASCII-Code zwischen 32 und 126 (einschliesslich). Diese Zuordnung erlaubt es, mit Zeichen zu rechnen (Beispiel 9.3: Iterieren über Kleinbuchstaben).</p>
            </>}
            en={<>
              <p>The <b>ASCII</b> code (American Standard Code for Information Interchange) defines concrete conversion rules between <K>char</K> and (unsigned) <K>int</K> and is supported on all common computer systems. For the letters and digits, the numbers are as follows:</p>
              <ul>
                <li><K>'A'</K>, <K>'B'</K>, …, <K>'Z'</K> → 65, 66, …, 90</li>
                <li><K>'a'</K>, <K>'b'</K>, …, <K>'z'</K> → 97, 98, …, 122</li>
                <li><K>'0'</K>, <K>'1'</K>, …, <K>'9'</K> → 48, 49, …, 57</li>
              </ul>
              <p>In total, there are 95 printable characters with ASCII code between 32 and 126 (inclusive). This mapping allows arithmetic over characters (Example 9.3: iterating over lowercase characters).</p>
            </>}
          />
        </Box>
        <AsciiTable />
        <T
          de={<>
            <p><b>Was die Tabelle verrät.</b> Die Zeilen der Tabelle sind nach den oberen Hex-Ziffern geordnet; dahinter steckt die Binärdarstellung. Klicke ein <K>A</K> an und dann das <K>a</K>: Die Codes 65 und 97 unterscheiden sich genau um 32, also um <em>ein einziges Bit</em>. Gross- und Kleinbuchstaben sind in ASCII Nachbarn im Muster, nicht zufällig. Auch die Ziffern sind geordnet: <K>'0'</K> hat den Code 48, <K>'7'</K> den Code 55. Daraus folgt die wichtigste Zeichenrechnung überhaupt:</p>
          </>}
          en={<>
            <p><b>What the table reveals.</b> The rows of the table are ordered by the upper hex digit; behind it lies the binary representation. Click an <K>A</K> and then the <K>a</K>: the codes 65 and 97 differ by exactly 32, i.e. by <em>a single bit</em>. Capital and lowercase letters are neighbours in a pattern in ASCII, not by chance. The digits are ordered too: <K>'0'</K> has the code 48, <K>'7'</K> the code 55. From this follows the most important character calculation of all:</p>
          </>}
        />
        <Tracer prog={P.digitValue} label={tr('Rechnen mit Zeichen', 'Calculating with characters')} />
        <T
          de={<>
            <p><K>d - '0'</K> ist <K>55 - 48 = 7</K>: der <em>Wert</em> der Ziffer. Und <K>v + 1 + '0'</K> geht den Weg zurück zum Zeichen. Weil die Ziffern lückenlos aufeinanderfolgen, genügt das, ohne dass man die Codes kennen muss. Genauso bei Buchstaben: <K>c - 'a'</K> ist die Stelle im Alphabet (<K>'a'</K> ist 0, <K>'z'</K> ist 25), und <K>'a' - 'A'</K> ist 32, der Abstand zwischen Klein- und Grossbuchstaben. Schreibe immer <K>'a'</K> statt der Zahl 97: Die Absicht ist lesbar, und der Code stimmt auch auf Systemen, die einen anderen Zeichensatz benutzen.</p>
            <p>Das Ergebnis <K>'a' / 'b'</K> ist <K>0</K> (97 / 98 in Ganzzahldivision): erlaubt, aber ohne Sinn. Das meint das Skript mit «nicht alle Operatoren scheinen sinnvoll».</p>
          </>}
          en={<>
            <p><K>d - '0'</K> is <K>55 - 48 = 7</K>: the <em>value</em> of the digit. And <K>v + 1 + '0'</K> goes the way back to the character. Because the digits follow each other without gaps, this suffices without knowing the codes. Likewise with letters: <K>c - 'a'</K> is the position in the alphabet (<K>'a'</K> is 0, <K>'z'</K> is 25), and <K>'a' - 'A'</K> is 32, the distance between lowercase and capital letters. Always write <K>'a'</K> instead of the number 97: the intention is readable, and the code is also correct on systems that use a different character set.</p>
            <p>The result <K>'a' / 'b'</K> is <K>0</K> (97 / 98 in integer division): allowed, but meaningless. That is what the notes mean by “not all operators seem to make sense”.</p>
          </>}
        />
        <Listing prog={P.lowerLoop} label={tr('Beispiel 9.3: ein char als Zählvariable', 'Example 9.3: a char as the counter')} />
        <T
          de={<p>Das <K>char c</K> läuft von <K>'a'</K> (97) bis <K>'z'</K> (122): <K>++c</K> erhöht die Nummer um 1, und weil die Kleinbuchstaben lückenlos aufeinander folgen, ist das genau das nächste Zeichen.</p>}
          en={<p>The <K>char c</K> runs from <K>'a'</K> (97) to <K>'z'</K> (122): <K>++c</K> increases the number by 1, and because the lowercase letters follow each other without gaps, that is exactly the next character.</p>}
        />
        <Box kind="tip" title={<T de="Zeichen ohne Stolpersteine" en="Characters without stumbling blocks" />}>
          <T
            de={<ul>
              <li><b><K>'7'</K> ist nicht <K>7</K>.</b> Das Zeichen <K>'7'</K> hat den Wert 55. Um Ziffern auszuwerten, rechne <K>'7' - '0'</K>.</li>
              <li><b><K>'a'</K> ist nicht <K>"a"</K>.</b> Einfache Anführungszeichen: ein einzelnes Zeichen (<K>char</K>). Doppelte: ein Text (String-Literal). Sie sind verschiedene Typen.</li>
              <li><b>Stelle dich nicht auf die Lücken ein:</b> Zwischen <K>'Z'</K> (90) und <K>'a'</K> (97) liegen Zeichen wie <K>[</K> und <K>_</K>. <K>for (char c = 'A'; c &lt;= 'z'; ++c)</K> druckt sie mit.</li>
              <li><b>Auf anderen Rechnern ist <K>char</K> nicht immer gleich:</b> Ob <K>char</K> ein Vorzeichen hat, ist nicht festgelegt. Für ASCII-Zeichen (0 bis 127) spielt das keine Rolle.</li>
            </ul>}
            en={<ul>
              <li><b><K>'7'</K> is not <K>7</K>.</b> The character <K>'7'</K> has the value 55. To evaluate digits, calculate <K>'7' - '0'</K>.</li>
              <li><b><K>'a'</K> is not <K>"a"</K>.</b> Single quotes: a single character (<K>char</K>). Double quotes: a text (string literal). They are different types.</li>
              <li><b>Do not rely on gaps:</b> between <K>'Z'</K> (90) and <K>'a'</K> (97) lie characters like <K>[</K> and <K>_</K>. <K>for (char c = 'A'; c &lt;= 'z'; ++c)</K> prints them too.</li>
              <li><b><K>char</K> is not always the same on other machines:</b> whether <K>char</K> has a sign is not fixed. For ASCII characters (0 to 127) this does not matter.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Was ist der Wert von <K>'c' - 'a' + 'A'</K>, und welchen Typ hat der Ausdruck?</>} en={<>What is the value of <K>'c' - 'a' + 'A'</K>, and what type does the expression have?</>} />}
          choices={[
            { text: <T de={<><K>67</K> vom Typ <K>int</K></>} en={<><K>67</K> of type <K>int</K></>} />, correct: true, why: <T de={<>Richtig: <K>99 - 97 + 65 = 67</K>. Das ist der Code von <K>'C'</K>: Man hat «den Buchstaben an derselben Stelle im Alphabet, aber gross» ausgerechnet. Weil die Rechnung mit <K>int</K> geschieht, ist das Ergebnis eine Zahl, kein Zeichen. Mit <K>char(…)</K> bekäme man <K>'C'</K>.</>} en={<>Correct: <K>99 - 97 + 65 = 67</K>. That is the code of <K>'C'</K>: one has calculated “the letter at the same place in the alphabet, but capital”. Because the calculation happens with <K>int</K>, the result is a number, not a character. With <K>char(…)</K> one would get <K>'C'</K>.</>} /> },
            { text: <T de={<><K>'C'</K> vom Typ <K>char</K></>} en={<><K>'C'</K> of type <K>char</K></>} />, why: <T de={<>Der Wert ist zwar der Code von <K>'C'</K>, aber Rechnungen mit <K>char</K> ergeben <K>int</K>. Ausgegeben würde 67.</>} en={<>The value is indeed the code of <K>'C'</K>, but calculations with <K>char</K> yield <K>int</K>. 67 would be printed.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="utf8" title={<T de="3. Unicode und UTF-8" en="3. Unicode and UTF-8" />}>
        <Box kind="lecture" src={<Src p="115" />} title={<T de="Unicode (optional)" en="Unicode (optional)" />}>
          <T
            de={<>
              <p>128 (oder 256) Zeichen reichen offensichtlich nicht, um die Zeichen aller heutigen Schriften abzubilden (Chinesisch, Kyrillisch, Griechisch, Hebräisch, Lateinisch …). Mit der Internationalisierung von Software braucht man einen wesentlich grösseren Zeichensatz. Heute ist der <b>Unicode</b>-Standard verbreitet: Er definiert mehr als 150 Schriften mit insgesamt mehr als 137 000 Zeichen. Um rückwärtskompatibel zu sein und für Programmtext nicht zu viel Platz zu verschwenden, wurde die Kodierung mit variabler Breite <b>UTF-8</b> entwickelt. Häufig gebrauchte Zeichen (etwa das lateinische Alphabet) brauchen nur ein Byte, andere bis zu sechs.</p>
              <p>Die Bits eines Zeichens werden nach einem Muster kodiert (Tabelle: nutzbare Bits 7, 11, 16, 21, 26, 31 mit den Mustern <K>0xxxxxxx</K>, <K>110xxxxx 10xxxxxx</K>, <K>1110xxxx 10xxxxxx 10xxxxxx</K> und so weiter). <K>x</K> steht für Bits, die zur Kodierung verwendet werden können. Bemerkenswert: Für jedes Byte in einem Bytestrom lässt sich entscheiden, ob ein neues Zeichen beginnt: Bytes, die mit den Bits <K>10</K> beginnen, beginnen kein neues Zeichen.</p>
            </>}
            en={<>
              <p>A number of 128 (or 256) characters is obviously not enough to map all characters from different scripts today (such as Chinese, Cyrillic, Greek, Hebrew, Latin, …). With the internationalization of software a substantially larger character set is required. Today the <b>Unicode</b> standard is common, defining more than 150 scripts with a total of more than 137 000 characters. In order to be backwards-compatible and in order not to waste too much space for programming text, a variable width encoding called <b>UTF-8</b> has been developed. Commonly used characters (e.g. the Latin alphabet) require only one byte, other characters can require up to six.</p>
              <p>The character bit sequence is encoded via bit patterns (table: usable bits 7, 11, 16, 21, 26, 31 with the patterns <K>0xxxxxxx</K>, <K>110xxxxx 10xxxxxx</K>, <K>1110xxxx 10xxxxxx 10xxxxxx</K> and so on). <K>x</K> stands for bits that can be used for the encoding. Remarkable is that for each byte in a stream of bytes it can be decided whether a new character starts or not: bytes beginning with the bits <K>10</K> do not start a new character.</p>
            </>}
          />
        </Box>
        <Utf8Figure />
        <T
          de={<>
            <p><b>So liest du die Abbildung.</b> Jedes Zeichen hat eine Nummer (<K>U+00E4</K> für <K>ä</K>; man sagt «Code Point»). Die Nummer wird in Binärzahl geschrieben und auf die <K>x</K> der Vorlage verteilt, die zur Grösse der Nummer passt: kleiner als 128 ins Ein-Byte-Muster, kleiner als 2048 ins Zwei-Byte-Muster, und so weiter. Die <em>festen</em> Bits sind die Struktur: <K>110</K> am Anfang heisst «hier beginnt ein Zeichen aus zwei Bytes», <K>10</K> heisst «Fortsetzung». Darum findet man in einem Strom von Bytes <em>überall</em> den Anfang eines Zeichens wieder: Man geht zurück, bis ein Byte nicht mit <K>10</K> beginnt.</p>
            <p>Das <K>A</K> bleibt in UTF-8 ein Byte mit demselben Wert wie in ASCII, nämlich 65: ASCII-Text <em>ist</em> gültiger UTF-8-Text. Das ist mit «rückwärtskompatibel» gemeint.</p>
            <p>Die Folge für <K>std::string</K>: Die Länge eines Strings zählt <em>Bytes</em>, nicht Zeichen. Der Text <K>"Grüezi"</K> hat sechs Zeichen, aber <K>.size()</K> liefert 7, weil das <K>ü</K> zwei Bytes braucht (der Test in diesem Projekt prüft das mit g++). Für ASCII-Text (die Programme dieses Kurses) ist beides gleich.</p>
          </>}
          en={<>
            <p><b>How to read the figure.</b> Every character has a number (<K>U+00E4</K> for <K>ä</K>; this is called a “code point”). The number is written in binary and distributed over the <K>x</K> of the template that fits its size: below 128 into the one-byte pattern, below 2048 into the two-byte pattern, and so on. The <em>fixed</em> bits are the structure: <K>110</K> at the beginning means “a character of two bytes begins here”, <K>10</K> means “continuation”. That is why in a stream of bytes one finds the start of a character <em>anywhere</em>: one goes back until a byte does not begin with <K>10</K>.</p>
            <p>The <K>A</K> stays a byte with the same value as in ASCII, namely 65, in UTF-8: ASCII text <em>is</em> valid UTF-8 text. That is what “backwards-compatible” means.</p>
            <p>The consequence for <K>std::string</K>: the length of a string counts <em>bytes</em>, not characters. The text <K>"Grüezi"</K> has six characters, but <K>.size()</K> returns 7, because the <K>ü</K> needs two bytes (this project’s test checks that with g++). For ASCII text (the programs of this course) both are the same.</p>
          </>}
        />
        <T
          de={<p>Eine Anmerkung zur Tabelle im Skript: Sie führt auch Formen mit fünf und sechs Bytes auf (26 und 31 nutzbare Bits). Das war die ursprüngliche Definition. Der heutige Standard (RFC 3629) hört bei vier Bytes (21 Bits) auf, denn Unicode selbst endet bei <K>U+10FFFF</K>; die längeren Formen werden von modernen Programmen abgelehnt (der Test in diesem Projekt prüft das mit einem Decoder). Für alles, was du in diesem Kurs brauchst, ist das ohne Belang.</p>}
          en={<p>A remark on the table in the notes: it also lists forms with five and six bytes (26 and 31 usable bits). That was the original definition. Today’s standard (RFC 3629) stops at four bytes (21 bits), because Unicode itself ends at <K>U+10FFFF</K>; the longer forms are rejected by modern programs (this project’s test checks that with a decoder). For everything you need in this course that makes no difference.</p>}
        />
        <Box kind="tip" title={<T de="Texte und die Welt" en="Texts and the world" />}>
          <T
            de={<ul>
              <li><b>Dein C++-Programm, das <K>char</K> einzeln bearbeitet, versteht nur ASCII richtig.</b> Ein <K>ä</K> im Text ist für ein <K>char</K> zwei Bytes. Wer Zeichen einzeln verschiebt (Caesar!), zerreisst solche Zeichen.</li>
              <li><b>Eingabe aus Dateien oder Terminals kann UTF-8 enthalten.</b> Die Programme der nächsten Lektionen sind für reinen ASCII-Text gedacht.</li>
              <li><b>Quelltext selbst ist Text:</b> Auch Kommentare mit <K>ü</K> sind UTF-8. Der Compiler stört sich nicht daran, in Zeichenketten sollte man sie aber bewusst verwenden.</li>
            </ul>}
            en={<ul>
              <li><b>Your C++ program that handles <K>char</K> one by one only understands ASCII correctly.</b> An <K>ä</K> in the text is two bytes for a <K>char</K>. Whoever shifts characters one at a time (Caesar!) tears such characters apart.</li>
              <li><b>Input from files or terminals may contain UTF-8.</b> The programs of the next lessons are meant for plain ASCII text.</li>
              <li><b>Source code itself is text:</b> comments with <K>ü</K> are UTF-8 too. The compiler does not mind, but inside strings one should use them deliberately.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>char</K> ist ein Ganzzahltyp (meist 8 Bit). Zeichen und Code sind dieselbe Information. Der <em>Typ</em> entscheidet, ob <K>cout</K> ein Zeichen oder eine Zahl druckt.</li>
              <li>ASCII: <K>'A'..'Z'</K> = 65..90, <K>'a'..'z'</K> = 97..122, <K>'0'..'9'</K> = 48..57; 95 druckbare Zeichen (32–126).</li>
              <li>Mit Zeichen rechnen: <K>c - '0'</K> (Ziffernwert), <K>c - 'a'</K> (Stelle im Alphabet), <K>char(x)</K> (zurück zum Zeichen).</li>
              <li>UTF-8 kodiert Unicode in 1 bis 4 Bytes; ASCII bleibt gleich. <K>std::string::size()</K> zählt Bytes.</li>
            </ul>}
            en={<ul>
              <li><K>char</K> is an integer type (mostly 8 bits). Character and code are the same information. The <em>type</em> decides whether <K>cout</K> prints a character or a number.</li>
              <li>ASCII: <K>'A'..'Z'</K> = 65..90, <K>'a'..'z'</K> = 97..122, <K>'0'..'9'</K> = 48..57; 95 printable characters (32–126).</li>
              <li>Calculating with characters: <K>c - '0'</K> (digit value), <K>c - 'a'</K> (position in the alphabet), <K>char(x)</K> (back to the character).</li>
              <li>UTF-8 encodes Unicode in 1 to 4 bytes; ASCII stays the same. <K>std::string::size()</K> counts bytes.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Mit diesem Rechnen lässt sich eine der ältesten Verschlüsselungen programmieren: die Caesar-Chiffre. Die Schwierigkeit ist der Umbruch am Ende des Alphabets (Skript S. 115–117).</p>}
          en={<p className="connections"><b>Next:</b> with this calculating one of the oldest ciphers can be programmed: the Caesar cipher. The difficulty is the wrap-around at the end of the alphabet (notes pp. 115–117).</p>}
        />
      </Section>
    </article>
  );
}
