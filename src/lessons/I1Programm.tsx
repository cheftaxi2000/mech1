import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I1Programm() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein vollständiges C++-Programm, das erst einmal läuft, bevor wir es zerlegen. Danach klären wir, woraus es besteht, und gehen den Befehl für die Ausgabe genau durch.</p>}
        en={<p className="lede">A complete C++ program that first just runs, before we take it apart. After that we clarify what it consists of and go through the output statement in detail.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="ganz" title={<T de="1. Ein ganzes Programm" en="1. A complete program" />}>
        <Box kind="lecture" src={<Src p={18} fig="Code 2.1" />} title={<T de="Werkzeuge und das erste Programm" en="Tools and the first program" />}>
          <T
            de={<ul>
              <li>Früher entstanden Programme als Lochkarten. Heute benutzt man den Rechner selbst: Ein <b>Editor</b> erstellt und speichert den Programmtext, ein <b>Compiler</b> übersetzt ihn in Maschinensprache, der Rechner führt sie aus. Das <b>Betriebssystem</b> organisiert Dateien und das Starten der Programme.</li>
              <li>Code 2.1 (unten) erwartet eine Zahl, berechnet ihre achte Potenz und gibt sie aus. Bei der Eingabe <K>2</K> erscheint <K>2^8 = 256</K>.</li>
              <li>So sehen unsere Programme meist aus: eine Eingabe, eine Berechnung, eine Ausgabe auf der Konsole.</li>
            </ul>}
            en={<ul>
              <li>In the early days programs were punched into cards. Today the computer itself is used: an <b>editor</b> creates and stores the program text, a <b>compiler</b> translates it into machine language, and the computer executes that. The <b>operating system</b> organises files and the starting of programs.</li>
              <li>Code 2.1 (below) expects a number, computes its eighth power and prints it. For the input <K>2</K> it prints <K>2^8 = 256</K>.</li>
              <li>This is what our programs usually look like: an input, a computation, an output on the console.</li>
            </ul>}
          />
        </Box>
        <Tracer prog={P.power8} inputs={['2\n', '3\n', '100\n']} label="Code 2.1" />
        <T
          de={<p className="keep">Klicke dich einmal durch und beobachte zwei Dinge: Die Zeile, die als Nächstes läuft, und die Tabelle rechts. Die Anweisungen laufen <b>von oben nach unten, eine nach der anderen</b>, und jede verändert höchstens den Speicher (die Tabelle) oder die Konsole. Mehr braucht es zum Verstehen des Programms nicht. Ob <K>b</K> ein Name, ein Typ oder eine Adresse hat, klären wir in den nächsten Abschnitten.</p>}
          en={<p className="keep">Click through once and watch two things: the line that runs next, and the table on the right. The statements run <b>from top to bottom, one after the other</b>, and each changes at most the memory (the table) or the console. That is all you need to understand the program. What a name, a type or an address of <K>b</K> means is covered in the next sections.</p>}
        />
        <Box kind="tip" title={<T de="Probiere die Eingabe 100" en="Try the input 100" />}>
          <T
            de={<p>Das Programm gibt <K>1874919424</K> aus, und das ist <em>nicht</em> <K>100^8</K>. Die Warnung im Schritt zeigt, warum: Das Ergebnis passt nicht in eine <K>int</K>-Schachtel. Jede Variable hat nur endlich viel Platz. Das ist ein Kernthema der nächsten Lektion über ganze Zahlen; merke dir vorerst: <b>Ein Programm kann ohne jede Fehlermeldung ein falsches Ergebnis liefern.</b></p>}
            en={<p>The program prints <K>1874919424</K>, and that is <em>not</em> <K>100^8</K>. The warning in the step shows why: the result does not fit into an <K>int</K> box. Every variable has only a finite amount of room. That is a core topic of the next lesson about integers; for now remember: <b>a program can deliver a wrong result without any error message.</b></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="aufbau" title={<T de="2. Der Aufbau: main, Anweisungen, Kommentare" en="2. The structure: main, statements, comments" />}>
        <Box kind="lecture" src={<Src p="19" />} title={<T de="Struktur eines C++-Programms" en="Structure of a C++ program" />}>
          <T
            de={<>
              <p>Jedes C++-Programm hat eine Funktion <K>int main()</K>. Sie ist der <b>Einstiegspunkt</b>: Das Betriebssystem ruft sie beim Start auf, und ihr Inhalt wird ausgeführt. Fast jedes Programm enthält die folgenden Zeilen, die man vorerst nur abschreibt:</p>
              <pre className="plain-code"><code>{`#include <iostream>
int main() {
    // the heart of the program, consisting of
    // a sequence of statements goes here
    return 0;
}`}</code></pre>
              <ul>
                <li>Zeilen mit <K>//</K> sind <b>Kommentare</b> (mehrzeilig: <K>/* */</K>). Sie helfen nur dem Menschen, der Compiler ignoriert sie.</li>
                <li>Das Herz ist eine Folge von <b>Anweisungen</b> in <K>main</K>. Sie laufen nacheinander von oben nach unten, jede endet mit einem Semikolon, am besten eine pro Zeile.</li>
                <li>C++ ist egal, wie der Text formatiert ist (Leerzeichen, Einrückung, Leerzeilen), dem Menschen nicht.</li>
              </ul>
            </>}
            en={<>
              <p>Every C++ program has a function <K>int main()</K>. It is the <b>entry point</b>: the operating system calls it when the program starts, and its content is executed. Almost every program contains the following lines, which for now you just copy:</p>
              <pre className="plain-code"><code>{`#include <iostream>
int main() {
    // the heart of the program, consisting of
    // a sequence of statements goes here
    return 0;
}`}</code></pre>
              <ul>
                <li>Lines with <K>//</K> are <b>comments</b> (multi-line: <K>/* */</K>). They only help humans, the compiler ignores them.</li>
                <li>The heart is a sequence of <b>statements</b> in <K>main</K>. They run one after the other from top to bottom, each ends with a semicolon, ideally one per line.</li>
                <li>C++ does not care how the text is formatted (whitespace, indentation, empty lines), humans do.</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<p className="keep">Der Beweis, dass dem Compiler die Form egal ist: Das folgende Programm ist <em>derselbe</em> Code 2.1, nur unleserlich gesetzt. Es übersetzt und verhält sich identisch.</p>}
          en={<p className="keep">Proof that the compiler does not care about form: the following program is <em>the same</em> Code 2.1, just set illegibly. It compiles and behaves identically.</p>}
        />
        <Listing prog={P.power8Messy} label={tr('Gleiches Programm, unleserlich', 'Same program, illegible')} />
        <Box kind="tip" title={<T de="Formatieren ist keine Kosmetik" en="Formatting is not cosmetics" />}>
          <T
            de={<ul>
              <li>Die Einrückung zeigt dir, <em>was zu was gehört</em>. Spätere Konstrukte (Schleifen, Bedingungen) bilden Verschachtelungen, und ein falsch eingerückter Block ist eine der häufigsten Fehlerquellen beim Lesen.</li>
              <li>Eine Anweisung pro Zeile. Dann gehört eine Zeilennummer in einer Fehlermeldung zu genau einer Anweisung.</li>
              <li>Kommentiere das <em>Warum</em> und nicht das Offensichtliche: <K>// b = a^2</K> ist nützlich, <K>// b wird berechnet</K> nicht.</li>
            </ul>}
            en={<ul>
              <li>Indentation shows you <em>what belongs to what</em>. Later constructs (loops, conditions) nest, and a wrongly indented block is one of the most common sources of errors when reading.</li>
              <li>One statement per line. Then a line number in an error message belongs to exactly one statement.</li>
              <li>Comment the <em>why</em>, not the obvious: <K>// b = a^2</K> is useful, <K>// b is computed</K> is not.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="ausgabe" title={<T de="3. Ausgabe mit std::cout" en="3. Output with std::cout" />}>
        <Box kind="lecture" src={<Src p="20–21" />} title={<T de="Ausgabe" en="Output" />}>
          <T
            de={<ul>
              <li><K>std::cout &lt;&lt; 6</K> gibt die Zahl 6 auf der Konsole aus. Text steht in Anführungszeichen hinter <K>&lt;&lt;</K>; <K>\n</K> im Text ist ein Zeilenumbruch.</li>
              <li>Ohne die Zeile <K>#include &lt;iostream&gt;</K> gibt es einen Compilerfehler: Das Programm wird nicht übersetzt.</li>
              <li>Zusätzliche Funktionalität (Ein-/Ausgabe in <K>iostream</K>, Mathematik in <K>cmath</K>, …) stammt aus der C++-<b>Standardbibliothek</b> und wird mit <K>#include</K> verfügbar gemacht. Man benutzt sie mit vorangestelltem <K>std::</K> (ein <i>qualifizierter Name</i>).</li>
              <li>Statt Zahlen kann man auch das Ergebnis einer Rechnung ausgeben, und mehrere Dinge lassen sich mit <K>&lt;&lt;</K> verketten: <K>std::cout &lt;&lt; "2^8 = " &lt;&lt; 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2</K>.</li>
            </ul>}
            en={<ul>
              <li><K>std::cout &lt;&lt; 6</K> outputs the number 6 on the console. Text goes in quotes after <K>&lt;&lt;</K>; <K>\n</K> in the text is a new line.</li>
              <li>Without the line <K>#include &lt;iostream&gt;</K> there is a compiler error: the program is not translated.</li>
              <li>Additional functionality (input/output in <K>iostream</K>, mathematics in <K>cmath</K>, …) comes from the C++ <b>standard library</b> and is made available with <K>#include</K>. It is used with <K>std::</K> in front (a <i>qualified name</i>).</li>
              <li>Instead of numbers one can output the result of a computation, and several things can be chained with <K>&lt;&lt;</K>: <K>std::cout &lt;&lt; "2^8 = " &lt;&lt; 2 * 2 * 2 * 2 * 2 * 2 * 2 * 2</K>.</li>
            </ul>}
          />
        </Box>
        <Listing prog={P.hardcoded} label={tr('Berechnung in der Ausgabe', 'Computation inside the output')} />
        <T
          de={<p className="keep">Zwei Dinge fallen auf. Erstens steht der Zeilenumbruch nur dort, wo du <K>\n</K> schreibst; die Ausgabe nach der zweiten Zeile endet <em>ohne</em> Umbruch. Zweitens wird die Rechnung <K>2 * 2 * … * 2</K> erst <em>zur Laufzeit</em> ausgewertet. Im Programmtext steht keine 256.</p>}
          en={<p className="keep">Two things stand out. First, a line break appears only where you write <K>\n</K>; the output after the second line ends <em>without</em> a break. Second, the computation <K>2 * 2 * … * 2</K> is evaluated only <em>at run time</em>. The program text contains no 256.</p>}
        />
        <Listing prog={P.coutNoSpace} label={tr('cout fügt nichts von selbst ein', 'cout inserts nothing by itself')} />
        <T
          de={<p className="keep">Minimalbeispiel für die häufigste Anfängerüberraschung: <K>std::cout</K> fügt <em>nie</em> Leerzeichen oder Zeilenumbrüche ein. Aus <K>1 &lt;&lt; 2</K> wird <K>12</K>. Willst du <K>1 2</K>, schreibst du <K>&lt;&lt; " " &lt;&lt;</K> selbst dazwischen.</p>}
          en={<p className="keep">A minimal example of the most common beginner surprise: <K>std::cout</K> <em>never</em> inserts spaces or line breaks. <K>1 &lt;&lt; 2</K> becomes <K>12</K>. If you want <K>1 2</K> you write <K>&lt;&lt; " " &lt;&lt;</K> in between yourself.</p>}
        />
        <Listing prog={P.escapes} label={tr('Sonderzeichen im Text', 'Special characters in text')} />
        <table className="plain esc">
          <thead><tr><th>{tr('Schreibweise', 'Written as')}</th><th>{tr('Bedeutung', 'Meaning')}</th></tr></thead>
          <tbody>
            <tr><td><K>\n</K></td><td>{tr('Zeilenumbruch', 'new line')}</td></tr>
            <tr><td><K>\t</K></td><td>{tr('Tabulator', 'tab')}</td></tr>
            <tr><td><K>\"</K></td><td>{tr('ein Anführungszeichen im Text', 'a quotation mark inside the text')}</td></tr>
            <tr><td><K>\\</K></td><td>{tr('ein Backslash', 'a backslash')}</td></tr>
          </tbody>
        </table>
        <T
          de={<p className="keep">Warum so? Das Anführungszeichen beendet normalerweise den Text, und der Backslash leitet eine Sonderzeichenfolge ein. Wer beides im Text haben will, muss es «entschärfen»: ein Backslash davor.</p>}
          en={<p className="keep">Why? A quotation mark normally ends the text, and the backslash starts a special sequence. Whoever wants either in the text has to “defuse” it: a backslash in front.</p>}
        />
        <Box kind="tip" title={<T de="Fehlendes #include" en="A missing #include" />}>
          <T
            de={<>
              <p>So sieht der Fehler aus, wenn man <K>#include &lt;iostream&gt;</K> vergisst (g++ 13):</p>
              <pre className="plain-code"><code>{`error: 'cout' is not a member of 'std'
note: 'std::cout' is defined in header '<iostream>';
      did you forget to '#include <iostream>'?`}</code></pre>
              <p>Merke dir als Regel: <b>Sobald du etwas mit <K>std::</K> benutzt, frage dich, in welchem Header es steht.</b> Das Semikolon gehört nicht hinter <K>#include</K>, denn das ist eine Anweisung an den Compiler, keine C++-Anweisung.</p>
            </>}
            en={<>
              <p>This is what the error looks like when you forget <K>#include &lt;iostream&gt;</K> (g++ 13):</p>
              <pre className="plain-code"><code>{`error: 'cout' is not a member of 'std'
note: 'std::cout' is defined in header '<iostream>';
      did you forget to '#include <iostream>'?`}</code></pre>
              <p>Remember as a rule: <b>whenever you use something with <K>std::</K>, ask which header it lives in.</b> The semicolon does not belong after <K>#include</K>, because that is a directive to the compiler, not a C++ statement.</p>
            </>}
          />
        </Box>
        <Choice
          question={<T de={<>Was gibt <K>std::cout &lt;&lt; "a" &lt;&lt; 1 &lt;&lt; 2 &lt;&lt; "b";</K> aus?</>} en={<>What does <K>std::cout &lt;&lt; "a" &lt;&lt; 1 &lt;&lt; 2 &lt;&lt; "b";</K> print?</>} />}
          choices={[
            { text: <code>a 1 2 b</code>, why: <T de="Nein, cout setzt keine Leerzeichen. Du müsstest sie als eigenen Text mit ausgeben." en="No, cout does not insert spaces. You would have to print them as text of your own." /> },
            { text: <code>a12b</code>, correct: true, why: <T de="Genau: Die Teile werden lückenlos hintereinander geschrieben, in der Reihenfolge, in der sie dastehen." en="Exactly: the pieces are written one directly after the other, in the order in which they appear." /> },
            { text: <code>a3b</code>, why: <T de="Nein, die Zahlen werden nicht addiert. Das wäre bei einem Ausdruck wie 1 + 2 der Fall, hier sind es zwei getrennte Ausgaben." en="No, the numbers are not added. That would happen for an expression like 1 + 2; here they are two separate outputs." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Typische Missverständnisse" en="4. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«Die Einrückung ist Teil der Sprache.»" en="“Indentation is part of the language.”" />}>
          <T
            de={<>In Python ja, in C++ nein. Die Klammern <K>{'{ }'}</K> und Semikola bestimmen, was zusammengehört. Wer falsch einrückt, täuscht nur den Leser, und das ist gefährlich.</>}
            en={<>In Python yes, in C++ no. The braces <K>{'{ }'}</K> and semicolons decide what belongs together. Wrong indentation only deceives the reader, and that is dangerous.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Die Ausgabe zeigt, was im Programm steht.»" en="“The output shows what is in the program text.”" />}>
          <T
            de={<>Die Ausgabe zeigt, was zur <em>Laufzeit</em> berechnet wurde. In <K>std::cout &lt;&lt; 2 * 3</K> steht keine 6; sie entsteht erst beim Ausführen.</>}
            en={<>The output shows what was computed at <em>run time</em>. There is no 6 in <K>std::cout &lt;&lt; 2 * 3</K>; it comes into existence only when it runs.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«return 0 gibt die Zahl aus.»" en="“return 0 prints the number.”" />}>
          <T
            de={<><K>return 0;</K> beendet <K>main</K> und meldet dem Betriebssystem «alles gut». Auf der Konsole erscheint dabei nichts.</>}
            en={<><K>return 0;</K> ends <K>main</K> and reports “all fine” to the operating system. Nothing appears on the console.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Ein Programm ist <K>main</K> mit einer Folge von Anweisungen, ausgeführt von oben nach unten, jede mit Semikolon.</li>
              <li>Kommentare und Formatierung sind für Menschen; der Compiler ignoriert sie.</li>
              <li><K>std::cout &lt;&lt; …</K> gibt aus, verkettbar, ohne etwas von selbst einzufügen. Dafür braucht es <K>#include &lt;iostream&gt;</K>.</li>
              <li>Ausdrücke in der Ausgabe werden erst beim Ausführen berechnet.</li>
            </ul>}
            en={<ul>
              <li>A program is <K>main</K> with a sequence of statements, executed from top to bottom, each with a semicolon.</li>
              <li>Comments and formatting are for humans; the compiler ignores them.</li>
              <li><K>std::cout &lt;&lt; …</K> prints, chainable, inserting nothing by itself. It needs <K>#include &lt;iostream&gt;</K>.</li>
              <li>Expressions in the output are computed only when the program runs.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> In Code 2.1 stand <K>int a;</K>, <K>int b = a * a;</K> und <K>b = b * b;</K>. Was diese drei Zeilen im Speicher tun, ist das Thema von Variablen (Skript S. 21–25).</p>}
          en={<p className="connections"><b>Next:</b> Code 2.1 contained <K>int a;</K>, <K>int b = a * a;</K> and <K>b = b * b;</K>. What these three lines do in memory is the subject of variables (notes pp. 21–25).</p>}
        />
      </Section>
    </article>
  );
}
