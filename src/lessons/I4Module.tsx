import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { MULTIFILE } from '../info/cpp/multifile';
import { P } from '../info/cpp/programs';
import { BuildFigure } from '../viz/info/FunctionFigures';
import { CompileFail } from '../viz/info/ControlFigures';
import { Listing } from '../viz/info/Tracer';

export default function I4Module() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Zwei Fragen, die mit der Grösse von Programmen kommen: <em>Wo</em> darf man eine Funktion benutzen? Und wie verwendet man dieselbe Funktion in vielen Programmen, ohne sie zu kopieren? Die erste Frage führt zu «Deklaration und Definition», die zweite zu Bibliotheken, getrenntem Übersetzen und dem Linker.</p>}
        en={<p className="lede">Two questions that come with the size of programs: <em>where</em> may a function be used? And how do you use the same function in many programs without copying it? The first leads to “declaration and definition”, the second to libraries, separate compilation and the linker.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="scope" title={<T de="1. Wo gilt eine Funktion?" en="1. Where is a function valid?" />}>
        <Box kind="lecture" src={<Src p="88–90" />} title={<T de="Gültigkeitsbereich einer Funktion" en="Scope of a function" />}>
          <T
            de={<>
              <p>Hier beantworten wir die Frage, wo eine Funktion benutzt werden kann. Der Gültigkeitsbereich einer Funktion beginnt mit ihrer <b>Deklaration</b>, die Funktion ist also im Quelltext ab der Stelle sichtbar, an der sie zum ersten Mal deklariert wurde (Code 6.3). Der Gültigkeitsbereich ist der Teil des Programms, in dem man die Funktion aufrufen kann. Er ist die Vereinigung aller Gültigkeitsbereiche ihrer Deklarationen (es kann mehr als eine geben). Er lässt sich durch eine zusätzliche Deklaration also erweitern.</p>
            </>}
            en={<>
              <p>In this section we answer the question where a function can be used. The scope of a function starts with its <b>declaration</b>, i.e. the function is visible in the source code from where it was declared the first time (Code 6.3). The scope of a function is the part of the program where it can be called. It is defined as the union of all scopes of its declarations (there can be more than one). This means it can be extended by an additional declaration.</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.fnNotDeclared} label={tr('Code 6.3: f wird benutzt, bevor es bekannt ist', 'Code 6.3: f is used before it is known')} />
        <T
          de={<p>Der Compiler liest den Quelltext <em>einmal von oben nach unten</em>. Trifft er in <K>main</K> auf <K>f(1)</K>, kennt er <K>f</K> noch nicht, denn die Definition kommt erst danach. Er kann nicht vorausblicken, also bricht er ab. Die einfachste Lösung: <K>f</K> <em>vor</em> <K>main</K> definieren. Aber es gibt Fälle, in denen das nicht geht.</p>}
          en={<p>The compiler reads the source text <em>once from top to bottom</em>. When it meets <K>f(1)</K> in <K>main</K>, it does not know <K>f</K> yet, because the definition comes only afterwards. It cannot look ahead, so it gives up. The simplest solution: define <K>f</K> <em>before</em> <K>main</K>. But there are cases where that is impossible.</p>}
        />
        <Box kind="lecture" src={<Src p="89–90" />} title={<T de="Deklaration und Definition" en="Declaration vs. definition" />}>
          <T
            de={<>
              <p>Hier müssen wir <b>Deklaration</b> und <b>Definition</b> unterscheiden. In einem C++-Programm kann man eine Funktion deklarieren, ohne sie zu definieren: Wir sagen dem Compiler, dass eine Funktion <em>existiert</em>, ohne ihm zu sagen, <em>was</em> sie tut. Eine Funktion muss natürlich (genau) einmal definiert werden, damit sie im Programm vorkommen kann.</p>
              <p>Eine Funktion wird <em>definiert</em>, indem man ihre Signatur (Typ, Name, Parameter) gefolgt vom Rumpf schreibt. Sie wird <em>deklariert</em>, indem man ihre Signatur gefolgt von einem Semikolon schreibt (Beispiel 6.25, <K>double pow(double b, int e);</K>). Solche Deklarationen (auch <b>Vorwärtsdeklarationen</b>) können den Gültigkeitsbereich einer Funktion erweitern, zum Beispiel für Funktionen, die sich gegenseitig aufrufen (Code 6.4).</p>
            </>}
            en={<>
              <p>Here we need to make a difference between <b>declaration</b> and <b>definition</b>. In a C++ program it is possible to declare a function without defining it: we tell the compiler that a function <em>exists</em> without telling it <em>what</em> the function does. Of course, a function needs to be defined (exactly) once for it to appear in a program.</p>
              <p>A function is <em>defined</em> by writing its signature (type, name plus parameters) followed by the body. It is <em>declared</em> by writing its signature followed by a semicolon (Example 6.25, <K>double pow(double b, int e);</K>). Such declarations (also <b>forward declarations</b>) can be used to extend the scope of a function, for example to write functions that mutually call each other (Code 6.4).</p>
            </>}
          />
        </Box>
        <T
          de={<p>(Im Skript steht bei Beispiel 6.25 <K>double pow(double e, int e);</K> mit zweimal dem Namen <K>e</K>; gemeint ist <K>double b</K>. Der Compiler lehnt die Fassung mit dem Fehler <K>conflicting declaration</K> ab, die richtige Fassung steht oben.)</p>}
          en={<p>(In the notes, Example 6.25 reads <K>double pow(double e, int e);</K> with the name <K>e</K> twice; <K>double b</K> is meant. The compiler rejects that version with the error <K>conflicting declaration</K>; the correct version is given above.)</p>}
        />
        <Listing prog={P.fnForward} label={tr('Code 6.4: zwei Funktionen rufen sich gegenseitig auf (Ausgabe: is_even(10), is_odd(10), is_even(7))', 'Code 6.4: two functions call each other (output: is_even(10), is_odd(10), is_even(7))')} />
        <T
          de={<>
            <p>Hier hilft keine Reihenfolge: <K>is_even</K> ruft <K>is_odd</K> auf und umgekehrt. Egal, welche zuerst steht, die andere ist noch unbekannt. Die Vorwärtsdeklaration in der ersten Zeile löst den Knoten: Sie sagt dem Compiler «<K>is_odd</K> kommt noch, so sieht ihr Kopf aus». Danach darf <K>is_even</K> sie aufrufen. Die Definition folgt später.</p>
            <p>Merke: <b>Deklaration heisst «es gibt das»</b>, <b>Definition heisst «so geht das»</b>. Deklarieren darf man beliebig oft (wenn die Signaturen übereinstimmen), definieren nur einmal.</p>
          </>}
          en={<>
            <p>No order helps here: <K>is_even</K> calls <K>is_odd</K> and vice versa. Whichever comes first, the other is still unknown. The forward declaration in the first line solves the knot: it tells the compiler “<K>is_odd</K> is coming, this is what its head looks like”. After that <K>is_even</K> may call it. The definition follows later.</p>
            <p>Remember: <b>declaration means “this exists”</b>, <b>definition means “this is how it works”</b>. You may declare as often as you like (if the signatures agree), but define only once.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="bibliothek" title={<T de="2. Funktionen auslagern: Bibliotheken" en="2. Moving functions out: libraries" />}>
        <Box kind="lecture" src={<Src p="90–91" />} title={<T de="Eine Quelldatei einbinden" en="Including a source file" />}>
          <T
            de={<>
              <p>Wir haben die Nachteile des Kopierens und Einfügens besprochen und Funktionen eingeführt, um Redundanz zu vermeiden und eine zentrale Code-Instanz zu haben, die man pflegen kann. Funktionen wie <K>rectangles_overlap</K> und <K>pow</K> sind in vielen Programmen nützlich. Den Quelltext zu kopieren ist keine gute Lösung. Hauptnachteil: Muss die Funktionsdefinition angepasst werden, muss man alle Programme ändern, die sie verwenden.</p>
              <p>Deshalb lagern wir die Funktion in eine <b>Bibliothek</b> aus. Der einfachste Weg ist eine Quelltextdatei (Code 6.5), die in die benutzende Datei eingebunden wird (Code 6.6). Die Wirkung ist, als würde der Inhalt der Datei dort hineinkopiert, wo die <K>#include</K>-Zeile steht.</p>
            </>}
            en={<>
              <p>We have discussed the disadvantages of copy-and-paste and introduced functions to avoid redundancy and to have a central code instance that can be maintained over time. Functions such as <K>rectangles_overlap</K> and <K>pow</K> are useful in many programs. To copy and paste the source code is not a good solution. Main disadvantage: when the function definition needs to be adapted, we have to change all programs that make use of the function.</p>
              <p>Therefore we want to outsource the function into a <b>library</b>. The easiest way is to provide a source code file (Code 6.5) and include it in the using file (Code 6.6). The effect is like copy-pasting the content of the file into where the <K>#include</K> line is positioned.</p>
            </>}
          />
        </Box>
        <Code code={MULTIFILE['mymath.cpp']} label="mymath.cpp" />
        <Code code={MULTIFILE['callpow2.cpp']} label="callpow2.cpp" />
        <T
          de={<p><K>#include &lt;…&gt;</K> in spitzen Klammern sucht die Datei in den Verzeichnissen der Standardbibliothek, <K>#include "…"</K> in Anführungszeichen zuerst im Arbeitsverzeichnis. Der <K>#include</K> ist eine Anweisung an den <em>Präprozessor</em>, der vor dem Compiler läuft und den Text der Datei einfach einfügt. (Mit <K>g++ -E callpow2.cpp</K> kannst du das Ergebnis ansehen.)</p>}
          en={<p><K>#include &lt;…&gt;</K> in angle brackets searches for the file in the directories of the standard library, <K>#include "…"</K> in quotes first in the working directory. The <K>#include</K> is an instruction to the <em>preprocessor</em>, which runs before the compiler and simply inserts the text of the file. (With <K>g++ -E callpow2.cpp</K> you can look at the result.)</p>}
        />
        <Box kind="lecture" src={<Src p="91" />} title={<T de="Der Nachteil des Einbindens" en="The disadvantage of including" />}>
          <T
            de={<p>Nachteil: Der Compiler muss die Funktionsdefinition für <em>jedes</em> Programm neu übersetzen, was bei vielen grossen Funktionen lange dauern kann. Ausserdem lässt sich eine Quelldatei nicht mehr als einmal in ein Programm einbinden (direkt oder indirekt über andere Dateien), denn eine Funktionsdefinition darf nicht mehr als einmal im Programm vorkommen. Deshalb braucht man <b>getrenntes Übersetzen</b> (<span lang="en">separate compilation</span>).</p>}
            en={<p>The disadvantage of including the source file is that the compiler needs to (re)compile the function definition for each program. This can take long for many and large functions. Moreover, it is impossible to include a source code file more than once in a program (directly or indirectly via other files), because a function definition must not occur more than once in a program. Therefore we need <b>separate compilation</b>.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="getrennt" title={<T de="3. Getrennt übersetzen und binden" en="3. Compiling separately and linking" />}>
        <Box kind="lecture" src={<Src p="91–93" />} title={<T de="Getrenntes Übersetzen" en="Separate compilation" />}>
          <T
            de={<>
              <p>Getrenntes Übersetzen verwendet man, wenn eine Quelldatei nur einmal berücksichtigt werden soll: aus Leistungsgründen (weil das Übersetzen grosser Dateien dauert), aus kommerziellen Gründen (weil zum Übersetzen der Quelltext vorliegen muss) oder weil Dateien an verschiedenen Stellen eingebunden werden.</p>
              <p>Damit das geht, muss dem Programm, das ein Symbol (wie eine Funktion) benutzt, seine Existenz durch eine (Vorwärts-)<b>Deklaration</b> mitgeteilt werden (Code 6.7).</p>
            </>}
            en={<>
              <p>Separate compilation is used whenever a source code file should be taken into account only once: for performance reasons (because compiling large files might take time), for reasons of commercial interests (because compiling source code files requires that source code is provided) or because files are included at various places in our program.</p>
              <p>To make separate compilation possible, the program using a symbol (like a function) needs to be informed about its existence by way of a (forward) <b>declaration</b> (Code 6.7).</p>
            </>}
          />
        </Box>
        <Code code={MULTIFILE['callpow3.cpp']} label="callpow3.cpp" />
        <T
          de={<>
            <p>Du fragst dich vielleicht, wie die Definition von <K>pow</K> benutzt wird, wenn sie nicht eingebunden ist. Gar nicht: Würde nur <K>callpow3.cpp</K> übersetzt, könnte das Programm nicht wissen, was <K>pow</K> tut. Also muss auch <K>mymath.cpp</K> übersetzt werden. Entwicklungsumgebungen (IDEs) verlangen deshalb, dass alle relevanten Dateien zu einem Projekt gehören, und sorgen dafür, dass der gesamte Quelltext übersetzt wird. Den Rest erledigt der <b>Linker</b> (Binder), ein kleines Programm, das zum Compiler gehört und übersetzten Code zusammenfügt, wo er zusammenpasst.</p>
            <p><b>Übersetzen und Binden</b> im Detail (das musst du nicht verstehen): Übersetzt der Compiler <K>mymath.cpp</K>, erzeugt er kein lauffähiges Programm, denn es fehlt <K>main</K>. Er erzeugt eine <b>Objektdatei</b> mit Code für <K>pow</K>. Übersetzt er <K>callpow3.cpp</K>, fehlt wieder die Definition von <K>pow</K>, er erzeugt ein fast fertiges Programm mit einer <em>Lücke</em> an der Stelle des Aufrufs. Jetzt passen die beiden Teile zusammen: Der Linker verbindet die Lücke mit dem Code von <K>pow</K>.</p>
          </>}
          en={<>
            <p>You may now wonder how the function definition of <K>pow</K> is used if it is not included. It is not: if only <K>callpow3.cpp</K> were compiled, there would be no way for the program to know what <K>pow</K> does. So <K>mymath.cpp</K> needs to be compiled as well. Integrated development environments (IDEs) therefore require that all relevant files belong to a project, and make sure that all required source code is compiled. The rest is done by the <b>linker</b>, a little program that comes with the compiler and glues compiled code together where it fits.</p>
            <p><b>Compiling and linking</b> in a bit more detail (you do not need to understand this): when the compiler compiles <K>mymath.cpp</K>, it does not produce a runnable program, because <K>main</K> is missing. It generates an <b>object file</b> with code for <K>pow</K>. When it compiles <K>callpow3.cpp</K>, the definition of <K>pow</K> is missing again; it generates a nearly working program with a <em>gap</em> where the call occurs. Now the two pieces fit together: the linker connects the gap with the code of <K>pow</K>.</p>
          </>}
        />
        <BuildFigure />
        <Code code={'g++ -c mymath.cpp                        # produces mymath.o\ng++ -c callpow3.cpp                      # produces callpow3.o\ng++ mymath.o callpow3.o -o callpow3      # the linker joins them'} label={tr('Die drei Befehle (im Test dieses Projekts mit g++ ausgeführt)', 'The three commands (executed with g++ in this project’s test)')} />
        <Box kind="tip" title={<T de="Compilerfehler oder Linkerfehler?" en="Compiler error or linker error?" />}>
          <T
            de={<ul>
              <li><b>«<K>was not declared in this scope</K>»</b> kommt vom Compiler: Der Name ist an dieser Stelle <em>unbekannt</em> (Deklaration fehlt oder steht zu spät, oder ein Tippfehler).</li>
              <li><b>«<K>undefined reference to `pow(double, int)'</K>»</b> kommt vom Linker: Der Name war bekannt (deklariert), aber nirgends <em>definiert</em>. Wird nur <K>callpow3.cpp</K> gebunden, erscheint genau diese Meldung (der Test in diesem Projekt erzeugt sie mit g++).</li>
              <li><b>«<K>multiple definition</K>»</b> (ebenfalls vom Linker): Die Funktion ist in <em>zwei</em> Dateien definiert. Eine Definition darf nur einmal im Programm vorkommen.</li>
              <li>Fehlende Definition → Datei zum Projekt hinzufügen / beim Binden angeben. Fehlende Deklaration → Header einbinden.</li>
            </ul>}
            en={<ul>
              <li><b>“<K>was not declared in this scope</K>”</b> comes from the compiler: the name is <em>unknown</em> at this point (declaration missing or too late, or a typo).</li>
              <li><b>“<K>undefined reference to `pow(double, int)'</K>”</b> comes from the linker: the name was known (declared) but is <em>defined</em> nowhere. If only <K>callpow3.cpp</K> is linked, exactly this message appears (this project’s test produces it with g++).</li>
              <li><b>“<K>multiple definition</K>”</b> (also from the linker): the function is defined in <em>two</em> files. A definition may occur only once in the program.</li>
              <li>Missing definition → add the file to the project / name it when linking. Missing declaration → include the header.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="header" title={<T de="4. Header-Dateien" en="4. Header files" />}>
        <Box kind="lecture" src={<Src p="94" />} title={<T de="Deklarationen sammeln" en="Collecting declarations" />}>
          <T
            de={<>
              <p>Für jede getrennt übersetzte Funktion eine Vorwärtsdeklaration zu schreiben wäre mühsam und würde den Code überladen. Deshalb sammelt man alle Deklarationen der in einer Datei definierten Funktionen in einer eigenen Datei, einer <b>Header-Datei</b>. Die Dateien, die die Funktionen benutzen, binden diese Header ein. Die Datei <K>mymath.h</K> enthält nur die Deklarationen aller in <K>mymath.cpp</K> definierten Funktionen (Code 6.8), und das Hauptprogramm bindet sie ein (Code 6.9).</p>
            </>}
            en={<>
              <p>Having to add a forward declaration for every function that is compiled separately would be tedious and would clutter the code. To avoid this, all declarations of functions defined in one file are collected in a separate file, a so-called <b>header file</b>. The files using (i.e. calling) the functions import these headers. File <K>mymath.h</K> contains only the declarations of all functions defined in <K>mymath.cpp</K> (Code 6.8), and the main program includes it (Code 6.9).</p>
            </>}
          />
        </Box>
        <Code code={MULTIFILE['mymath.h']} label="mymath.h" />
        <Code code={MULTIFILE['callpow4.cpp']} label="callpow4.cpp" />
        <T
          de={<>
            <p>Der Header ist der <em>Vertrag nach aussen</em>: Er enthält die Köpfe der Funktionen samt Vor- und Nachbedingung, aber nicht, wie sie arbeiten. Wer die Funktion benutzt, liest nur den Header. Wer sie ändert, ändert nur <K>mymath.cpp</K>, und alle Programme profitieren nach dem neuen Binden.</p>
            <p>Bibliotheken fassen meist mehrere ähnliche Funktionen in einer Datei zusammen. Die Standardbibliothek hat zum Beispiel den Header <K>cmath</K> mit den mathematischen Funktionen <K>pow</K>, <K>exp</K>, <K>log</K>, <K>sin</K> und so weiter.</p>
          </>}
          en={<>
            <p>The header is the <em>contract to the outside</em>: it holds the heads of the functions together with pre- and postcondition, but not how they work. Whoever uses the function reads only the header. Whoever changes it changes only <K>mymath.cpp</K>, and all programs benefit after re-linking.</p>
            <p>Libraries usually group a number of similar functions in one file. The standard library, for instance, has the header <K>cmath</K> with the mathematical functions <K>pow</K>, <K>exp</K>, <K>log</K>, <K>sin</K> and so on.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Was in den Header gehört" en="What belongs in the header" />}>
          <T
            de={<ul>
              <li><b>In den Header: Deklarationen</b> (Köpfe mit Semikolon), Kommentare mit dem Vertrag. <b>In die .cpp-Datei: Definitionen</b> (Köpfe mit Rumpf).</li>
              <li><b>Die .cpp-Datei bindet ihren eigenen Header ein.</b> Dann prüft der Compiler, dass Deklaration und Definition zusammenpassen.</li>
              <li>Ein Header kann über mehrere Wege in dieselbe Datei kommen. Deklarationen schaden dann nicht (mehrfach deklarieren ist erlaubt), aber Definitionen würden doppelt vorkommen. Deshalb gehören in Header keine Funktionsdefinitionen.</li>
            </ul>}
            en={<ul>
              <li><b>In the header: declarations</b> (heads with semicolon), comments with the contract. <b>In the .cpp file: definitions</b> (heads with body).</li>
              <li><b>The .cpp file includes its own header.</b> Then the compiler checks that declaration and definition fit together.</li>
              <li>A header can reach the same file by several routes. Declarations do not hurt then (declaring several times is allowed), but definitions would occur twice. That is why headers contain no function definitions.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Du übersetzt nur <K>callpow4.cpp</K> zu einem ausführbaren Programm (<K>g++ callpow4.cpp -o callpow4</K>) und bindest nicht <K>mymath.cpp</K>. Was passiert?</>} en={<>You compile only <K>callpow4.cpp</K> into an executable (<K>g++ callpow4.cpp -o callpow4</K>) and do not link <K>mymath.cpp</K>. What happens?</>} />}
          choices={[
            { text: <T de="Ein Linkerfehler: undefined reference to pow(double, int)" en="A linker error: undefined reference to pow(double, int)" />, correct: true, why: <T de={<>Richtig. Der Header liefert dem Compiler nur die Deklaration, deshalb kompiliert <K>callpow4.cpp</K>. Der Linker findet aber keine Definition von <K>pow</K>.</>} en={<>Correct. The header gives the compiler only the declaration, so <K>callpow4.cpp</K> compiles. But the linker finds no definition of <K>pow</K>.</>} /> },
            { text: <T de="Ein Compilerfehler: pow was not declared" en="A compiler error: pow was not declared" />, why: <T de={<>Nein, <K>pow</K> ist durch den Header deklariert. Das Problem tritt erst beim Binden auf.</>} en={<>No, <K>pow</K> is declared by the header. The problem appears only at link time.</>} /> },
            { text: <T de="Das Programm läuft und gibt 0.25 aus" en="The program runs and prints 0.25" />, why: <T de={<>Ohne die Definition gibt es keinen Code für <K>pow</K>, den man ausführen könnte.</>} en={<>Without the definition there is no code for <K>pow</K> that could be executed.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Eine Funktion gilt ab ihrer ersten Deklaration. Eine Vorwärtsdeklaration (<K>T f(…);</K>) erweitert den Gültigkeitsbereich; sie ist nötig, wenn sich Funktionen gegenseitig aufrufen.</li>
              <li>Deklaration: Name und Signatur. Definition: Signatur plus Rumpf. Deklarieren: beliebig oft; definieren: genau einmal.</li>
              <li>Quelltext einbinden kopiert ihn und übersetzt ihn jedes Mal neu. Besser: getrennt übersetzen (<K>g++ -c</K>) und binden.</li>
              <li>Der Linker verbindet Aufrufe mit Definitionen. Header-Dateien sammeln die Deklarationen und enthalten den Vertrag.</li>
              <li><em>Compilerfehler</em>: Name unbekannt. <em>Linkerfehler</em>: deklariert, aber nicht (oder mehrfach) definiert.</li>
            </ul>}
            en={<ul>
              <li>A function is valid from its first declaration. A forward declaration (<K>T f(…);</K>) extends the scope; it is needed when functions call each other.</li>
              <li>Declaration: name and signature. Definition: signature plus body. Declare: as often as you like; define: exactly once.</li>
              <li>Including source text copies it and recompiles it every time. Better: compile separately (<K>g++ -c</K>) and link.</li>
              <li>The linker connects calls with definitions. Header files collect the declarations and hold the contract.</li>
              <li><em>Compiler error</em>: name unknown. <em>Linker error</em>: declared but not (or multiply) defined.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Was, wenn zwei Bibliotheken eine Funktion <K>pow</K> definieren? Dafür gibt es Namensräume. Und: Warum man die Standardbibliothek benutzen sollte (Skript S. 94–96).</p>}
          en={<p className="connections"><b>Next:</b> what if two libraries define a function <K>pow</K>? That is what namespaces are for. And: why you should use the standard library (notes pp. 94–96).</p>}
        />
      </Section>
    </article>
  );
}
