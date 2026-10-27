import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { ArchFigure } from '../viz/info/ArchFigure';
import { Listing } from '../viz/info/Tracer';

const t = String.raw;

export default function I1Rechner() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Der Schachtel-Rechner war ein Modell. Hier sehen wir, woher es kommt und wie nah es am echten Rechner liegt, und warum zwischen «der Compiler akzeptiert es» und «das Programm ist richtig» ein grosser Unterschied besteht.</p>}
        en={<p className="lede">The box computer was a model. Here we see where it comes from, how close it is to a real computer, and why there is a big gap between “the compiler accepts it” and “the program is correct”.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="turing" title={<T de="1. Turings Maschine (1936)" en="1. Turing's machine (1936)" />}>
        <Box kind="lecture" src={<Src p="12–13" fig="Fig. 1.4" />} title={<T de="Die Idee der Turing-Maschine" en="The idea of the Turing machine" />}>
          <T
            de={<ul>
              <li>Alan Turing wollte präzise klären, was sich berechnen lässt und was nicht, und erfand dafür 1936 eine abstrakte Maschine.</li>
              <li>Neu war ihre <b>Universalität</b>: Sie lässt sich frei programmieren und kann ihren eigenen Speicher ändern, auch das Programm, das darin steht.</li>
              <li>Ein (gedanklich unendlich langes) <b>Band</b> trägt Symbole. Ein <b>Schreib-/Lesekopf</b> liest und schreibt Symbole und bewegt sich nach links oder rechts. Gesteuert wird er von einem fest verdrahteten Rechner mit Steuerwerk und internem Zustand.</li>
              <li>Eine Maschine, die dasselbe ausdrücken kann, heisst <b>Turing-vollständig</b>.</li>
            </ul>}
            en={<ul>
              <li>Alan Turing wanted to answer rigorously what can be computed and what cannot, and in 1936 invented an abstract machine for it.</li>
              <li>New was its <b>universality</b>: it can be freely programmed and can modify its own memory, even the program stored in it.</li>
              <li>A (conceptually infinitely long) <b>tape</b> carries symbols. A <b>read/write head</b> reads and writes symbols and moves left or right. It is controlled by a fixed-program computer with a control unit and an internal state.</li>
              <li>A machine with the same expressive power is called <b>Turing complete</b>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Beim Schachtel-Rechner hast du genau die Rolle des fest verdrahteten Rechners gespielt: Befehl lesen, ausführen, zum nächsten weitergehen. Drei Namen für dieselbe Idee:</p>}
          en={<p>With the box computer you played exactly the role of the fixed-program computer: read an instruction, execute it, move on to the next. Three names for the same idea:</p>}
        />
        <table className="plain map">
          <thead><tr><th>{tr('Turing-Maschine', 'Turing machine')}</th><th>{tr('Schachtel-Rechner', 'Box computer')}</th><th>{tr('Echter Rechner', 'Real computer')}</th></tr></thead>
          <tbody>
            <tr><td>{tr('Bandfeld', 'tape cell')}</td><td>{tr('Schachtel mit Adresse', 'box with an address')}</td><td>{tr('Speicherzelle', 'memory cell')}</td></tr>
            <tr><td>{tr('Position des Kopfes', 'position of the head')}</td><td>{tr('der Befehl, der als Nächstes läuft', 'the instruction that runs next')}</td><td>{tr('Befehlszähler (im Prozessor)', 'program counter (in the CPU)')}</td></tr>
            <tr><td>{tr('Steuerwerk mit Zustand', 'control unit with state')}</td><td>{tr('du, mit den Registern ', 'you, with registers ')}<K>L</K>, <K>R</K></td><td>{tr('Prozessor mit Registern', 'CPU with registers')}</td></tr>
          </tbody>
        </table>
        <Box kind="supplement" title={<T de="Programme sind Daten" en="Programs are data" />}>
          <T
            de={<p>Die Pointe der Universalität: Das Programm steht im selben Speicher wie die Daten. Im Schachtel-Rechner liegen Befehle und Zahlen in gleichartigen Schachteln. Deshalb kann ein Programm (der Compiler) ein anderes Programm als Daten lesen und in Maschinencode verwandeln, und deshalb muss ein Rechner nicht für jede Aufgabe neu gebaut werden.</p>}
            en={<p>The point of universality: the program sits in the same memory as the data. In the box computer, instructions and numbers lie in boxes of the same kind. That is why one program (the compiler) can read another program as data and turn it into machine code, and why a computer does not have to be rebuilt for every task.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="neumann" title={<T de="2. Der echte Rechner: von-Neumann-Architektur*" en="2. The real computer: von Neumann architecture*" />}>
        <Box kind="lecture" src={<Src p="13–14" fig="Fig. 1.5, 1.6" />} title={<T de="Bestandteile (nicht prüfungsrelevant)" en="Components (not examinable)" />}>
          <T
            de={<ul>
              <li><b>Speicher (RAM)</b> für Programme und Daten. Jede Zelle hat eine <b>Adresse</b> und speichert eine feste Anzahl Bits; das bestimmt, wie fein man zugreifen kann. Die Zugriffszeit hängt nicht von der Adresse ab, daher «Random Access».</li>
              <li><b>Prozessor (CPU)</b> mit sehr einfachen Operationen (Befehlen) in Maschinensprache. Er liest und schreibt den Hauptspeicher und hat eigene, sehr schnelle Speicher: die <b>Register</b>.</li>
              <li><b>Ein-/Ausgabe</b> (<K>I/O</K>) für die Kommunikation mit der Aussenwelt.</li>
              <li>Geschwindigkeit, grob gerundet: <M>{t`5\times 10^{9}`}</M> Befehle pro Sekunde bei einem Raspberry Pi, <M>{t`200\text{–}800\times 10^{9}`}</M> bei Notebook-Prozessoren, bis <M>{t`10^{12}`}</M> bei Spezialsystemen.</li>
            </ul>}
            en={<ul>
              <li><b>Memory (RAM)</b> for programs and data. Every cell has an <b>address</b> and stores a fixed number of bits; that determines the granularity of access. The access time does not depend on the address, hence “random access”.</li>
              <li><b>Processor (CPU)</b> with very simple operations (instructions) in machine language. It reads and writes main memory and has its own very fast memory: the <b>registers</b>.</li>
              <li><b><K>I/O</K></b> components for communication with the world.</li>
              <li>Speed, coarsely rounded: <M>{t`5\times 10^{9}`}</M> instructions per second for a Raspberry Pi, <M>{t`200\text{–}800\times 10^{9}`}</M> for notebook processors, up to <M>{t`10^{12}`}</M> for specialised systems.</li>
            </ul>}
          />
        </Box>
        <ArchFigure />
        <T
          de={<p>Für dieses Fach reicht ein Gedanke: <b>Speicher ist eine lange Reihe nummerierter Zellen</b>, und alles, was ein Programm kennt (Zahlen, Buchstaben, Befehle), ist am Ende ein Muster aus Bits in diesen Zellen. Wenn wir später von «Variablen», «Adressen» und «Referenzen» sprechen, meinen wir Stellen in dieser Reihe. Ein Hinweis zur Abbildung: Im Skript zählen die Adressen in Zweierschritten (0, 2, 4, …) obwohl jede Zelle 8 Bit hat; hier ist durchgezählt, wie bei üblichen Rechnern (I-002).</p>}
          en={<p>One thought is enough for this course: <b>memory is a long row of numbered cells</b>, and everything a program knows (numbers, letters, instructions) is in the end a pattern of bits in these cells. When we later speak of “variables”, “addresses” and “references”, we mean places in this row. A remark on the figure: in the notes the addresses count in steps of two (0, 2, 4, …) although every cell holds 8 bits; here they are counted consecutively, as on common computers (I-002).</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="sprachen" title={<T de="3. Programmiersprachen und die Wahl von C++" en="3. Programming languages and the choice of C++" />}>
        <Box kind="lecture" src={<Src p="14–16" />} title={<T de="Warum C++?" en="Why C++?" />}>
          <T
            de={<ul>
              <li>Die Maschinensprache ist sehr primitiv und von Rechner zu Rechner verschieden. Eine Programmiersprache erlaubt es, Absichten gegenüber Rechner <em>und</em> Menschen auszudrücken; ein <b>Compiler</b> übersetzt sie in Maschinencode.</li>
              <li>C++ ist nicht schwerer zu lernen als andere Sprachen, es verlangt aber <b>explizite Entscheidungen</b>. Das macht den späteren Wechsel zu einer «einfacheren» Sprache leichter, wie ein Führerschein für Schaltwagen, mit dem man danach auch Automat fährt.</li>
              <li>C++ eignet sich sehr gut für Systemprogrammierung und Hochleistungsrechnen, weil es sorgfältige Verwaltung von Ressourcen (Speicher, …) ermöglicht und verlangt.</li>
            </ul>}
            en={<ul>
              <li>Machine language is very primitive and varies between computers. A programming language lets us express intentions to the computer <em>and</em> to other humans; a <b>compiler</b> translates it into machine code.</li>
              <li>C++ is not harder to learn than other languages, but it requires <b>explicit decisions</b>. That makes switching to a “simpler” language easier later, like a licence for manual transmission that lets you drive an automatic afterwards.</li>
              <li>C++ is very well suited to systems programming and high-performance computing because it enables and requires careful management of resources (memory, …).</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="syntax" title={<T de="4. Syntax, Semantik und was ein Programm tun kann" en="4. Syntax, semantics and what a program can do" />}>
        <Box kind="lecture" src={<Src p="16–17" fig="Beispiel 1.1, 1.2" />} title={<T de="Syntax und Semantik" en="Syntax and semantics" />}>
          <T
            de={<>
              <p>Wie bei gesprochenen Sprachen unterscheidet man <b>Syntax</b> (Regeln, wie Zeichen zu einem gültigen Text zusammengesetzt werden) und <b>Semantik</b> (Regeln, was ein solcher Text bedeutet). Bei Programmen sind die Regeln einfacher, aber strenger.</p>
              <p><i>Beispiel 1.1:</i> «<span lang="de">Alleen sind nicht gefährlich, Rasen ist gefährlich!</span>» – Ein Mensch versteht den Satz auch ohne Satzzeichen.</p>
              <p><i>Beispiel 1.2:</i> Ein C++-Stück mit Kommentaren (<K>//</K>) und Anweisungen, getrennt durch Semikola. Der Compiler ignoriert die Kommentare. Ohne die Semikola lehnt er den Text ab: falsche Syntax.</p>
              <p>Syntax kann ein Compiler prüfen. Semantik, also welcher Algorithmus gemeint ist, verlangt meist menschliches Verständnis. Syntax und Semantik von C++ legt der ISO/IEC-Standard 14882 fest.</p>
            </>}
            en={<>
              <p>As with spoken languages we distinguish <b>syntax</b> (rules for how symbols are combined into a valid text) and <b>semantics</b> (rules for what such a text means). For programs the rules are simpler but stricter.</p>
              <p><i>Example 1.1:</i> “<span lang="de">Alleen sind nicht gefährlich, Rasen ist gefährlich!</span>” – a human understands the sentence even without punctuation.</p>
              <p><i>Example 1.2:</i> a piece of C++ with comments (<K>//</K>) and statements separated by semicolons. The compiler ignores the comments. Without the semicolons it refuses the text: wrong syntax.</p>
              <p>A compiler can check syntax. Semantics, i.e. which algorithm is meant, usually needs human understanding. The syntax and semantics of C++ are defined by the ISO/IEC standard 14882.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Das deutsche Beispiel ist mehrdeutig, und doch ist der Satz syntaktisch einwandfrei: «<span lang="de">Rasen</span>» kann der Untergrund oder das Schnellfahren sein. Syntax garantiert also nicht einmal, dass der Text <em>eine</em> Bedeutung hat. Für Programme macht der Standard die Bedeutung eindeutig, aber ob sie dem entspricht, was <em>du</em> wolltest, kann kein Compiler wissen.</p>}
          en={<p>The German example is ambiguous, and yet the sentence is syntactically flawless: “<span lang="de">Rasen</span>” can be the lawn or racing. So syntax does not even guarantee that the text has <em>one</em> meaning. For programs the standard makes the meaning unambiguous, but whether it matches what <em>you</em> wanted is something no compiler can know.</p>}
        />
        <Box kind="lecture" src={<Src p="17" />} title={<T de="Verhalten eines Programms" en="Behavior of a program" />}>
          <T
            de={<p>Bei der Übersetzung wird ein Programm entweder <b>akzeptiert</b> oder es gibt <b>Compilerfehler</b>, und der Compiler verweigert die Übersetzung. Jeden Syntaxfehler findet der Compiler, einige Semantikfehler auch. Ein erfolgreich übersetztes Programm kann zur Laufzeit ein korrektes Ergebnis liefern, ein falsches, abstürzen oder gar nicht anhalten. Es ist gut, wenn der Compiler Probleme früh findet, weil es lange dauern kann, bis ein Programm Ergebnisse zeigt.</p>}
            en={<p>During compilation a program is either <b>accepted</b> or it causes <b>compiler errors</b> and the compiler refuses to translate it. A compiler always detects every syntactical error, and some semantical errors too. A successfully translated program can, at run time, give a correct result, give an incorrect one, crash, or not terminate at all. It is good when the compiler finds problems early because it can take a while until a program shows results.</p>}
          />
        </Box>
        <T
          de={<p>Fünf Schicksale eines Programms, jeweils mit einem Beispiel aus dem Alltag der Vorlesung:</p>}
          en={<p>Five fates of a program, each with an example in the style of the course:</p>}
        />
        <table className="plain fates">
          <thead><tr><th>{tr('Schicksal', 'Fate')}</th><th>{tr('Beispiel', 'Example')}</th><th>{tr('Wer merkt es, wann?', 'Who notices, when?')}</th></tr></thead>
          <tbody>
            <tr><td>{tr('Compilerfehler', 'Compiler error')}</td><td><K>int a = 3</K> {tr('(ohne Semikolon)', '(no semicolon)')}</td><td>{tr('Der Compiler, vor dem Start. Es entsteht kein Programm.', 'The compiler, before the start. No program comes into existence.')}</td></tr>
            <tr><td>{tr('Richtig', 'Correct')}</td><td><K>b = b * b</K></td><td>{tr('Niemand muss etwas merken.', 'Nobody has to notice anything.')}</td></tr>
            <tr><td>{tr('Läuft, aber falsch', 'Runs, but wrong')}</td><td>{tr('gemeint war a⁴, geschrieben ist nur a·a', 'meant a⁴, but only a·a is written')}</td><td>{tr('Nur du, durch Nachdenken und Testen. Der Compiler kann es nicht wissen.', 'Only you, by thinking and testing. The compiler cannot know.')}</td></tr>
            <tr><td>{tr('Absturz', 'Crash')}</td><td><K>5 / x</K> {tr('mit', 'with')} <K>x = 0</K></td><td>{tr('Das laufende Programm, erst beim Ausführen dieser Zeile.', 'The running program, only when that line executes.')}</td></tr>
            <tr><td>{tr('Hält nie an', 'Never stops')}</td><td><K>while (true) {'{}'}</K></td><td>{tr('Niemand merkt es automatisch: «noch nicht fertig» sieht aus wie «arbeitet noch».', 'Nobody notices automatically: “not finished yet” looks like “still working”.')}</td></tr>
          </tbody>
        </table>
        <Listing prog={P.wrongResult} label={tr('Kompiliert, läuft, ist aber falsch', 'Compiles, runs, but is wrong')} />
        <T
          de={<p>Das Programm oben ist syntaktisch und «technisch» fehlerfrei und liefert trotzdem <K>9</K> statt <K>81</K>, denn <K>b</K> wurde nur einmal quadriert. Genau solche Fehler sind die gefährlichen: Es gibt keine Meldung, nur ein falsches Ergebnis.</p>}
          en={<p>The program above is syntactically and “technically” flawless and still prints <K>9</K> instead of <K>81</K>, because <K>b</K> was squared only once. Exactly such errors are the dangerous ones: there is no message, only a wrong result.</p>}
        />
        <Box kind="tip" title={<T de="Compilerfehler lesen" en="Reading compiler errors" />}>
          <T
            de={<ul>
              <li><b>Immer mit dem ersten Fehler anfangen.</b> Spätere Meldungen sind oft Folgefehler und verschwinden, wenn der erste behoben ist.</li>
              <li><b>Die Zeilennummer zeigt, wo der Compiler es gemerkt hat, nicht unbedingt wo der Fehler steht.</b> Ein fehlendes Semikolon nach <K>int a = 3</K> meldet g++ in der <em>nächsten</em> Zeile: <K>expected ',' or ';' before 'int'</K>. Schau also auch eine Zeile weiter oben.</li>
              <li><b>Lies den Text der Meldung, nicht nur die Position.</b> Er sagt meist genau, was fehlt: <K>'cout' is not a member of 'std'</K> heisst, dass der <K>#include &lt;iostream&gt;</K> fehlt.</li>
              <li>Der genaue Wortlaut hängt vom Compiler ab; die Meldungen hier stammen von g++ 13.</li>
            </ul>}
            en={<ul>
              <li><b>Always start with the first error.</b> Later messages are often follow-up errors and disappear once the first one is fixed.</li>
              <li><b>The line number shows where the compiler noticed it, not necessarily where the error is.</b> A missing semicolon after <K>int a = 3</K> is reported by g++ in the <em>next</em> line: <K>expected ',' or ';' before 'int'</K>. So look one line further up too.</li>
              <li><b>Read the text of the message, not only the position.</b> It usually says exactly what is missing: <K>'cout' is not a member of 'std'</K> means that the <K>#include &lt;iostream&gt;</K> is missing.</li>
              <li>The exact wording depends on the compiler; the messages here come from g++ 13.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Ein Programm lässt sich fehlerfrei übersetzen und startet. Was folgt daraus sicher?</>} en={<>A program compiles without errors and starts. What follows for certain?</>} />}
          choices={[
            { text: <T de="Das Ergebnis ist richtig." en="The result is correct." />, why: <T de="Nein. Der Compiler prüft die Form, nicht die Absicht. Das Beispiel oben übersetzt fehlerfrei und rechnet falsch." en="No. The compiler checks the form, not the intention. The example above compiles cleanly and computes the wrong thing." /> },
            { text: <T de="Es enthält keine Syntaxfehler." en="It contains no syntax errors." />, correct: true, why: <T de="Ja, das ist die einzige Garantie: Jeder Syntaxfehler wird beim Übersetzen gefunden. Über die Semantik, also Richtigkeit, Absturz oder Anhalten, sagt es nichts." en="Yes, that is the only guarantee: every syntax error is found during compilation. It says nothing about semantics, i.e. correctness, crashes or termination." /> },
            { text: <T de="Es hält irgendwann an." en="It terminates eventually." />, why: <T de="Nein. Eine Endlosschleife ist syntaktisch einwandfrei. Ob ein Programm anhält, kann der Compiler im Allgemeinen nicht entscheiden." en="No. An endless loop is syntactically flawless. In general the compiler cannot decide whether a program terminates." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Typische Missverständnisse" en="5. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«Wenn es kompiliert, stimmt es.»" en="“If it compiles, it is right.”" />}>
          <T
            de={<>Kompilieren heisst nur: Die <em>Form</em> ist gültig. Ob das Programm tut, was du willst, entscheiden Testen und Nachdenken, nicht der Compiler.</>}
            en={<>Compiling only means that the <em>form</em> is valid. Whether the program does what you want is decided by testing and thinking, not by the compiler.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Kommentare sind Teil des Programms.»" en="“Comments are part of the program.”" />}>
          <T
            de={<>Der Compiler wirft sie weg; sie ändern das Programm nicht. Ein Kommentar kann aber <em>falsch</em> werden, wenn man den Code ändert, und dann führt er die Leser in die Irre.</>}
            en={<>The compiler throws them away; they do not change the program. A comment can, however, become <em>wrong</em> when the code changes, and then it misleads readers.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Der Rechner versteht, was ich meine.»" en="“The computer understands what I mean.”" />}>
          <T
            de={<>Er führt aus, was dasteht. Menschen verzeihen fehlende Satzzeichen und Mehrdeutigkeit, Compiler nicht, und bei Mehrdeutigkeit legt der Standard eine einzige Lesart fest, die nicht unbedingt deine ist.</>}
            en={<>It executes what is written. Humans forgive missing punctuation and ambiguity, compilers do not, and for ambiguities the standard fixes a single reading which is not necessarily yours.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Turing-Maschine, Schachtel-Rechner und echter Rechner sind dieselbe Idee: Speicherzellen, ein Befehlszähler, einfache Befehle. Das Programm liegt im Speicher wie die Daten.</li>
              <li>Speicher ist eine Reihe nummerierter Zellen mit Bits. Variablen, Adressen und Referenzen sind später Stellen darin.</li>
              <li>Der Compiler übersetzt C++ in Maschinencode und findet <b>jeden Syntaxfehler</b>, aber nicht jeden Denkfehler.</li>
              <li>Ein übersetztes Programm kann richtig sein, falsch, abstürzen oder nie anhalten. Nur Nachdenken und Testen unterscheiden diese Fälle.</li>
            </ul>}
            en={<ul>
              <li>Turing machine, box computer and real computer are the same idea: memory cells, a program counter, simple instructions. The program sits in memory like the data.</li>
              <li>Memory is a row of numbered cells of bits. Variables, addresses and references are places in it later.</li>
              <li>The compiler translates C++ into machine code and finds <b>every syntax error</b>, but not every error of thought.</li>
              <li>A translated program can be right, wrong, crash or never stop. Only thinking and testing tell these cases apart.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Jetzt schreiben wir das erste echte C++-Programm und lesen es Zeile für Zeile (Skript S. 18–21).</p>}
          en={<p className="connections"><b>Next:</b> now we write the first real C++ program and read it line by line (notes pp. 18–21).</p>}
        />
      </Section>
    </article>
  );
}
