import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CompileFail } from '../viz/info/ControlFigures';
import { Tracer } from '../viz/info/Tracer';

export default function I6Text() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Text wie «to be or not to be» liesse sich als <K>std::vector&lt;char&gt;</K> darstellen. Weil Texte überall vorkommen, gibt es aber einen eigenen Typ dafür: <K>std::string</K>. Er kann das, was ein Vektor kann, und zusätzlich das, was man mit Texten braucht, etwa sie vergleichen und aneinanderhängen. Diese Lektion geht die Werkzeuge der Reihe nach durch.</p>}
        en={<p className="lede">A text like “to be or not to be” could in principle be represented as <K>std::vector&lt;char&gt;</K>. Texts are ubiquitous, however, so there is a type of their own: <K>std::string</K>. It can do what a vector can do and additionally what one needs for texts, such as comparing and joining them. This lesson goes through the tools one by one.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="string" title={<T de="1. std::string" en="1. std::string" />}>
        <Box kind="lecture" src={<Src p="116–118" />} title={<T de="Strings und ihre Operationen" en="Strings and their operations" />}>
          <T
            de={<>
              <p>Der Text «to be or not to be» könnte im Prinzip als <K>vector&lt;char&gt;</K> dargestellt werden. Texte sind aber allgegenwärtig, deshalb gibt es in der Standardbibliothek einen eigenen Typ: <K>std::string</K>. Seine Verwendung braucht <K>#include &lt;string&gt;</K>. Strings haben:</p>
              <ul>
                <li><b>Deklaration und Initialisierung mit einem Literal:</b> <K>std::string text = "Essen ist fertig!"</K></li>
                <li><b>Initialisierung mit variabler Länge:</b> <K>std::string text = std::string(n, 'a')</K>: <K>text</K> wird mit <K>n</K> Zeichen <K>'a'</K> gefüllt.</li>
                <li><b>Texte vergleichen:</b> <K>if (text1 == text2) ...</K>: wahr, wenn zeichenweise gleich.</li>
                <li><b>Grösse abfragen:</b> <K>int length = text.size();</K>. Die Grösse ist nicht gleich der Textlänge, wenn eine Kodierung mit mehreren Bytes verwendet wird, etwa UTF-8.</li>
                <li><b>Einzelne Zeichen lesen:</b> <K>if (text[0] == 'a') ...</K> oder <K>text.at(0)</K>. <K>text[0]</K> prüft die Indexgrenzen nicht, <K>text.at(0)</K> schon.</li>
                <li><b>Einzelne Zeichen schreiben:</b> <K>text[0] = 'b';</K> (oder <K>text.at(0)</K>).</li>
                <li><b>Über die Zeichen iterieren:</b> <K>for (int i = 0; i &lt; std::ssize(text); ++i) std::cout &lt;&lt; text[i];</K></li>
                <li><b>Strings aneinanderhängen:</b> <K>text = ":-"; text += ")"; assert(text == ":-)");</K></li>
                <li>Viele weitere Operationen: siehe cppreference.com/w/cpp/string.</li>
              </ul>
            </>}
            en={<>
              <p>The text “to be or not to be” could in principle be represented as <K>vector&lt;char&gt;</K>. Texts are ubiquitous, however, and therefore there is a separate type for them in the standard library: <K>std::string</K>. Its use requires <K>#include &lt;string&gt;</K>. Strings have:</p>
              <ul>
                <li><b>Declaration and initialization with a literal:</b> <K>std::string text = "Essen ist fertig!"</K></li>
                <li><b>Initialization with variable length:</b> <K>std::string text = std::string(n, 'a')</K>: <K>text</K> is filled with <K>n</K> characters <K>'a'</K>.</li>
                <li><b>Comparing texts:</b> <K>if (text1 == text2) ...</K>: true if character-wise equal.</li>
                <li><b>Querying size:</b> <K>int length = text.size();</K>. The size is not equal to the text length if multi-byte encoding is used, e.g. UTF-8.</li>
                <li><b>Reading single characters:</b> <K>if (text[0] == 'a') ...</K> or <K>text.at(0)</K>. <K>text[0]</K> does not check index bounds, whereas <K>text.at(0)</K> does.</li>
                <li><b>Writing single characters:</b> <K>text[0] = 'b';</K> (or <K>text.at(0)</K>).</li>
                <li><b>Iteration over characters:</b> <K>for (int i = 0; i &lt; std::ssize(text); ++i) std::cout &lt;&lt; text[i];</K></li>
                <li><b>Concatenating strings:</b> <K>text = ":-"; text += ")"; assert(text == ":-)");</K></li>
                <li>Many more operations: see cppreference.com/w/cpp/string.</li>
              </ul>
            </>}
          />
        </Box>
        <Tracer prog={P.strOps} label={tr('Die Operationen der Reihe nach', 'The operations one by one')} />
        <T
          de={<>
            <p><b>Was du im Ablauf siehst.</b> Die Tabelle zeigt einen String mit seinen Anführungszeichen, also als Folge von Zeichen. Nach <K>text[0] = 'e'</K> ändert sich genau ein Zeichen: aus <K>"Essen ist fertig!"</K> wird <K>"essen ist fertig!"</K>. <K>smiley += ")"</K> hängt hinten an: erst <K>":-"</K>, dann <K>":-)"</K>. Der Vergleich <K>smiley == ":-)"</K> ist wahr (1), <K>smiley == ":-("</K> falsch (0), und <K>std::string(3, 'a')</K> liefert <K>aaa</K>. Alles Weitere ist wie bei einem Vektor: Index von 0 an, <K>std::ssize</K> als sichere Grösse (die letzte Lektion über Vektoren gilt hier unverändert).</p>
          </>}
          en={<>
            <p><b>What you see in the run.</b> The table shows a string with its quotes, i.e. as a sequence of characters. After <K>text[0] = 'e'</K> exactly one character changes: <K>"Essen ist fertig!"</K> becomes <K>"essen ist fertig!"</K>. <K>smiley += ")"</K> appends at the back: first <K>":-"</K>, then <K>":-)"</K>. The comparison <K>smiley == ":-)"</K> is true (1), <K>smiley == ":-("</K> false (0), and <K>std::string(3, 'a')</K> yields <K>aaa</K>. Everything else is like for a vector: index from 0, <K>std::ssize</K> as the safe size (the last lesson on vectors applies here unchanged).</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="fallen" title={<T de="2. Stolpersteine bei Texten" en="2. Stumbling blocks with texts" />}>
        <Tracer prog={P.stringAt} label={tr('text.at(5) bei einem Text der Länge 3', 'text.at(5) for a text of length 3')} />
        <T
          de={<p>Wie beim Vektor ist <K>s[5]</K> bei einem Text der Länge 3 undefiniertes Verhalten, <K>s.at(5)</K> dagegen bricht mit einem Fehler ab. Die Faustregel der Vektoren gilt: Beim Entwickeln lieber <K>at</K> oder die Prüfung über Compiler-Flags, damit ein Fehler laut wird.</p>}
          en={<p>As with the vector, <K>s[5]</K> for a text of length 3 is undefined behavior, whereas <K>s.at(5)</K> stops with an error. The rule of thumb of vectors holds: while developing prefer <K>at</K> or the checks via compiler flags, so that an error becomes loud.</p>}
        />
        <CompileFail prog={P.strLiteralPlus} label={tr('Zwei Literale kann man nicht addieren', 'Two literals cannot be added')} />
        <T
          de={<p>Das ist die häufigste Überraschung beim Aneinanderhängen: <K>"a" + "b"</K> sind zwei <em>String-Literale</em>, also Zeichenketten fester Länge, die keine <K>std::string</K> sind, und für sie ist <K>+</K> nicht definiert. Sobald <em>eines</em> der beiden ein <K>std::string</K> ist (<K>prefix + "0"</K> im Kapitel über Rekursion, <K>std::string("a") + "b"</K>), geht es. Mit <K>+=</K> auf einer String-Variablen geht es immer.</p>}
          en={<p>That is the most common surprise when joining: <K>"a" + "b"</K> are two <em>string literals</em>, i.e. character strings of fixed length that are not <K>std::string</K>, and <K>+</K> is not defined for them. As soon as <em>one</em> of the two is a <K>std::string</K> (<K>prefix + "0"</K> in the chapter on recursion, <K>std::string("a") + "b"</K>), it works. With <K>+=</K> on a string variable it always works.</p>}
        />
        <Box kind="tip" title={<T de="Tipps zu Texten" en="Tips on texts" />}>
          <T
            de={<ul>
              <li><b><K>text[i]</K> ist ein <K>char</K>, kein String.</b> <K>text[0] == "a"</K> vergleicht ein Zeichen mit einem Text und ist ein Fehler; richtig ist <K>text[0] == 'a'</K>.</li>
              <li><b>Beim Schreiben in einen String den Index prüfen:</b> <K>s[i] = 'x'</K> verlängert den String nie. Verlängern geht mit <K>+=</K>.</li>
              <li><b><K>size()</K> ist vorzeichenlos</b> wie bei Vektoren: Schreibe <K>std::ssize(text)</K>, wenn du rechnest.</li>
              <li><b>Für Zahlen im Text:</b> Ein String <K>"123"</K> ist ein Text, nicht die Zahl 123. Mit <K>c - '0'</K> kann man Ziffer für Ziffer rechnen (letzte Lektion).</li>
              <li><b>Texte vergleicht man mit <K>==</K>,</b> nicht durch Vergleichen von Adressen: Zwei Strings mit demselben Inhalt sind gleich, auch wenn sie an verschiedenen Stellen im Speicher liegen.</li>
            </ul>}
            en={<ul>
              <li><b><K>text[i]</K> is a <K>char</K>, not a string.</b> <K>text[0] == "a"</K> compares a character with a text and is an error; the right form is <K>text[0] == 'a'</K>.</li>
              <li><b>When writing into a string check the index:</b> <K>s[i] = 'x'</K> never lengthens the string. Lengthening works with <K>+=</K>.</li>
              <li><b><K>size()</K> is unsigned</b> as with vectors: write <K>std::ssize(text)</K> when you calculate.</li>
              <li><b>For numbers in the text:</b> a string <K>"123"</K> is a text, not the number 123. With <K>c - '0'</K> one can calculate digit by digit (last lesson).</li>
              <li><b>Texts are compared with <K>==</K>,</b> not by comparing addresses: two strings with the same content are equal, even if they lie at different places in memory.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Was gibt dieser Code aus? <K>std::string s = "abc"; s[1] = 'X'; s += 'd'; std::cout &lt;&lt; s &lt;&lt; s.size();</K></>} en={<>What does this code print? <K>std::string s = "abc"; s[1] = 'X'; s += 'd'; std::cout &lt;&lt; s &lt;&lt; s.size();</K></>} />}
          choices={[
            { text: <K>aXcd4</K>, correct: true, why: <T de={<>Richtig: <K>s[1] = 'X'</K> ersetzt das mittlere Zeichen (<K>aXc</K>), <K>s += 'd'</K> hängt ein Zeichen an (<K>aXcd</K>), und die Grösse ist 4.</>} en={<>Correct: <K>s[1] = 'X'</K> replaces the middle character (<K>aXc</K>), <K>s += 'd'</K> appends a character (<K>aXcd</K>), and the size is 4.</>} /> },
            { text: <K>aXcd3</K>, why: <T de={<>Die Grösse zählt nach dem Anhängen: 4, nicht mehr 3.</>} en={<>The size counts after the appending: 4, no longer 3.</>} /> },
            { text: <K>abcXd4</K>, why: <T de={<><K>s[1] = 'X'</K> <em>ersetzt</em> das Zeichen mit Index 1 (<K>b</K>), es fügt nicht ein.</>} en={<><K>s[1] = 'X'</K> <em>replaces</em> the character with index 1 (<K>b</K>), it does not insert.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="wichtig" title={<T de="3. Das Wichtigste" en="3. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>std::string</K> (<K>#include &lt;string&gt;</K>) ist ein Text; er verhält sich wie ein Vektor von <K>char</K>.</li>
              <li>Anlegen: <K>= "Literal"</K> oder <K>std::string(n, 'a')</K>. Vergleichen: <K>==</K>. Grösse: <K>size()</K> (Bytes!).</li>
              <li>Zeichen lesen und schreiben: <K>s[i]</K> (ungeprüft) oder <K>s.at(i)</K> (geprüft). Anhängen: <K>+=</K>; Aneinanderhängen mit <K>+</K> nur, wenn ein Operand ein <K>std::string</K> ist.</li>
              <li>Iterieren: <K>for (int i = 0; i &lt; std::ssize(s); ++i)</K>.</li>
            </ul>}
            en={<ul>
              <li><K>std::string</K> (<K>#include &lt;string&gt;</K>) is a text; it behaves like a vector of <K>char</K>.</li>
              <li>Creating: <K>= "literal"</K> or <K>std::string(n, 'a')</K>. Comparing: <K>==</K>. Size: <K>size()</K> (bytes!).</li>
              <li>Reading and writing characters: <K>s[i]</K> (unchecked) or <K>s.at(i)</K> (checked). Appending: <K>+=</K>; joining with <K>+</K> only if one operand is a <K>std::string</K>.</li>
              <li>Iterating: <K>for (int i = 0; i &lt; std::ssize(s); ++i)</K>.</li>
            </ul>}
          />
        </Box>
        <Code code={'std::string text = ":-";\ntext += ")";\nassert(text == ":-)");'} label={tr('Das Beispiel des Skripts zum Anhängen', 'The notes’ example for appending')} />
        <T
          de={<p className="connections"><b>Weiter:</b> Damit sind alle Werkzeuge beisammen für das letzte grosse Thema der Notizen: Funktionen, die <em>sich selbst</em> aufrufen. Rekursion (Skript, Abschnitt 10).</p>}
          en={<p className="connections"><b>Next:</b> with that all tools are together for the last big topic of the notes: functions that call <em>themselves</em>. Recursion (notes, section 10).</p>}
        />
      </Section>
    </article>
  );
}
