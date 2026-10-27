import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { FlowViewer } from '../viz/info/ControlFigures';
import { Tracer } from '../viz/info/Tracer';

export default function I3Kontrollfluss() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Programm läuft im Prinzip von oben nach unten. Auswahl und Schleifen brechen diese Reihenfolge auf. Diese Lektion fasst zusammen, was wir gesehen haben, indem wir den Ablauf <em>zeichnen</em>. Dann lernen wir, die passende Struktur zu wählen, und die letzte Verzweigung kennen: <K>switch</K>.</p>}
        en={<p className="lede">A program runs from top to bottom in principle. Selection and loops break up this order. This lesson summarizes what we have seen by <em>drawing</em> the flow. Then we learn how to choose the right structure, and meet the last branching statement: <K>switch</K>.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="fluss" title={<T de="1. Kontrollfluss und Flussdiagramme" en="1. Control flow and flow diagrams" />}>
        <Box kind="lecture" src={<Src p="64–67" />} title={<T de="Kontrollfluss" en="Control flow" />}>
          <T
            de={<>
              <p>Der <b>Kontrollfluss</b> eines Programms ist die Reihenfolge der (wiederholten) Ausführung der Anweisungen. Grundsätzlich geschieht sie von oben nach unten. Auswahlanweisungen (if-else) und Iterationsanweisungen (for, while, do-while) können diese Reihenfolge durcheinanderbringen. Manchmal helfen Diagramme des Kontrollflusses.</p>
              <p>Wir stellen fest: Alles, was wir zur Beschreibung der Kontrollstrukturen brauchen, sind bedingte Verzweigungen (<K>if</K>) und unbedingte Sprünge an beliebige Stellen im Programm (<K>goto</K>, Abb. 5.9). Die übrigen Kontrollstrukturen gibt es nur, damit wir lesbareren und verständlicheren Code schreiben können.</p>
            </>}
            en={<>
              <p>The <b>control flow</b> of a program is the order of the (repeated) execution of statements. In principle the order is from top to bottom. However, selection statements (if-else) and iteration statements (for, while, do-while) can mix up the order. Sometimes it can help to draw diagrams of the control flow.</p>
              <p>We observe that all we need to describe the control structures are conditionals (<K>if</K>) and (unconditional) jumps to arbitrary places in the program (<K>goto</K>, Fig. 5.9). The other control structures are here only for us programmers to help us write more readable and understandable code.</p>
            </>}
          />
        </Box>
        <FlowViewer />
        <T
          de={<>
            <p><b>So liest man ein Flussdiagramm.</b> Folge den Pfeilen. Ein <em>Rechteck</em> ist eine Anweisung: Man führt sie aus und geht zum nächsten Pfeil. Eine <em>Raute</em> ist eine Bedingung: Man wertet sie aus und folgt entweder dem <K>true</K>- oder dem <K>false</K>-Pfeil. Siehst du einen Pfeil, der <em>zurück nach oben</em> führt, hast du eine Schleife gefunden. Beim <K>for</K> geht der Rückweg über den Ausdruck <K>++i</K>.</p>
            <p>Schau dir danach die letzten beiden Bilder an. Das rote <K>break</K> führt aus der Schleife hinaus, an der Bedingung vorbei. Das rote <K>continue</K> führt zum Ausdruck, überspringt also nur den Rest des Rumpfs. Das ist der ganze Unterschied.</p>
            <p>Dass <K>if</K> und <K>goto</K> genügen, ist keine Aufforderung, <K>goto</K> zu benutzen. Es ist die Erklärung dafür, was die Maschine in Wahrheit tut: Auf ihrer Ebene gibt es nur Vergleiche und Sprünge (wie bei der Schachtel-Maschine aus Kapitel 1). Wir wollen die Struktur aber <em>lesen</em> können.</p>
          </>}
          en={<>
            <p><b>How to read a flow diagram.</b> Follow the arrows. A <em>rectangle</em> is a statement: you execute it and go to the next arrow. A <em>diamond</em> is a condition: you evaluate it and follow either the <K>true</K> or the <K>false</K> arrow. If you see an arrow that leads <em>back up</em>, you have found a loop. With <K>for</K> the way back goes through the expression <K>++i</K>.</p>
            <p>Then look at the last two pictures. The red <K>break</K> leads out of the loop, past the condition. The red <K>continue</K> leads to the expression, so it skips only the rest of the body. That is the whole difference.</p>
            <p>That <K>if</K> and <K>goto</K> suffice is no invitation to use <K>goto</K>. It explains what the machine really does: at its level there are only comparisons and jumps (as in the box computer of chapter 1). But we want to be able to <em>read</em> the structure.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="wahl" title={<T de="2. Die passende Struktur wählen" en="2. Choosing the right structure" />}>
        <Box kind="lecture" src={<Src p="67–68" />} title={<T de="Beispiel: ungerade Zahlen ausgeben" en="Example: print the odd numbers" />}>
          <T
            de={<>
              <p>Die «richtige» Kontrollstruktur sollte lesbar und knapp sein: wenige Anweisungen, wenige Zeilen, einfacher Kontrollfluss und einfache Ausdrücke. Diese Ziele sind oft nicht gleichzeitig erreichbar (man sucht die «eierlegende Wollmilchsau»), es gibt also einen Zielkonflikt. In manchen Situationen ist aber klar, welche die beste ist.</p>
              <p>Beispiel: Alle ungeraden Zahlen in <K>{'{0, …, 100}'}</K> ausgeben. Der erste Code tut das offensichtlich:</p>
            </>}
            en={<>
              <p>The “right” control structure should be readable and concise: few statements, few lines of code, simple control flow and simple expressions. These goals are often not achievable at the same time (one would be looking for a “jack of all trades device”), so there is a trade-off. In certain situations it is quite obvious which one is the best, though.</p>
              <p>Example: print all odd numbers in <K>{'{0, …, 100}'}</K>. The first code obviously achieves this:</p>
            </>}
          />
        </Box>
        <Code code={P.oddContinue.code} label={tr('Version 1: mit continue', 'Version 1: with continue')} />
        <T
          de={<p>Das <K>continue</K> macht es unnötig kompliziert. Die Bedingung umzukehren ergibt weniger Anweisungen und weniger Zeilen:</p>}
          en={<p>The <K>continue</K> makes it unnecessarily complicated. Negating the condition leads to fewer statements and fewer lines:</p>}
        />
        <Code code={P.oddNegated.code} label={tr('Version 2: Bedingung umgekehrt', 'Version 2: negated condition')} />
        <T
          de={<p>Immer noch läuft man über alle Zahlen, nur um die Hälfte zu überspringen. Natürlicher ist es, direkt die relevanten Zahlen zu durchlaufen:</p>}
          en={<p>It still seems unnecessary to iterate over all numbers just to skip half of them. Directly iterating over the relevant ones seems more natural:</p>}
        />
        <Code code={P.oddStep.code} label={tr('Version 3: nur die ungeraden Zahlen', 'Version 3: only the odd numbers')} />
        <T
          de={<>
            <p>Das ist die «richtige» Wahl: wenige Anweisungen, wenige Zeilen, einfacher Kontrollfluss. Alle drei Versionen geben dieselben 50 Zahlen aus (der Test in diesem Projekt prüft das). Das Skript betont: Kurzer Code ist schön, aber das wichtigste Ziel ist, dass <em>andere und dein späteres Ich</em> ihn leicht verstehen.</p>
            <p><b>Bei der Wahl hilft eine einfache Reihenfolge der Fragen.</b> Kenne ich die Zahl der Durchgänge? → <K>for</K>. Muss der Rumpf mindestens einmal laufen? → <K>do-while</K>. Sonst → <K>while</K>. Zerfällt mein Rumpf in «überspringen» und «tun»? Dann kommt meist eine Bedingung (oder eine geänderte Schleife) ohne <K>continue</K> aus.</p>
          </>}
          en={<>
            <p>This is the “right” choice: few statements, few lines of code, simple control flow. All three versions print the same 50 numbers (the test in this project checks that). The notes stress: short code is nice, but the most important goal is that <em>others and your future self</em> can easily understand it.</p>
            <p><b>A simple order of questions helps with the choice.</b> Do I know the number of passes? → <K>for</K>. Must the body run at least once? → <K>do-while</K>. Otherwise → <K>while</K>. Does my body split into “skip” and “do”? Then a condition (or a changed loop) without <K>continue</K> usually suffices.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="switch" title={<T de="3. Die switch-Anweisung" en="3. The switch statement" />}>
        <Box kind="lecture" src={<Src p="68–70" />} title={<T de="switch" en="switch" />}>
          <T
            de={<>
              <p>Zum Schluss eine weitere bedingte Anweisung, als Alternative zu if-else, die vor allem bei einer Fallunterscheidung mit sehr vielen Fällen nützlich ist. Beispiel: Wir geben zu einer Note (ganze Zahl von 1 bis 6) eine Rückmeldung aus:</p>
              <ul>
                <li>6 → «Excellent … You passed!»</li>
                <li>5, 4 → «You passed!»</li>
                <li>3 → «Close, but … You failed!»</li>
                <li>2, 1 → «You failed!»</li>
                <li>sonst → «Error!»</li>
              </ul>
              <p>Und Texte dürfen nicht doppelt stehen. Mit einer Folge verschachtelter if-else-Anweisungen geht das, aber das Programmverhalten und der Kontrollfluss sind aus dem Code nicht offensichtlich:</p>
            </>}
            en={<>
              <p>We look at one more conditional statement, an alternative to if-else, that can be particularly useful for a case distinction over a huge number of cases. Example: for a grade (an integer from 1 to 6) we output feedback:</p>
              <ul>
                <li>6 → “Excellent … You passed!”</li>
                <li>5, 4 → “You passed!”</li>
                <li>3 → “Close, but … You failed!”</li>
                <li>2, 1 → “You failed!”</li>
                <li>otherwise → “Error!”</li>
              </ul>
              <p>And texts must not be duplicated. With a sequence of nested if-else statements this works, but the program behavior and the control flow are not obvious from the code:</p>
            </>}
          />
        </Box>
        <Tracer prog={P.gradesIf} inputs={['6\n', '4\n', '3\n', '2\n', '9\n']} label={tr('Mit if-else', 'With if-else')} />
        <T
          de={<p>Ein <K>switch</K> macht denselben Code viel lesbarer:</p>}
          en={<p>A <K>switch</K> makes the same code much more readable:</p>}
        />
        <Tracer prog={P.gradesSwitch} inputs={['6\n', '4\n', '3\n', '2\n', '9\n']} label={tr('Mit switch', 'With switch')} />
        <Box kind="lecture" src={<Src p="69" />} title={<T de="Allgemeine Form und Semantik" en="General form and semantics" />}>
          <T
            de={<>
              <Code code={'switch (expression)\n    statement'} />
              <p>Dabei ist <K>expression</K> ein in einen ganzzahligen Typ umwandelbarer Ausdruck, <K>statement</K> eine beliebige Anweisung, in der die Marken <K>case</K> und <K>default</K> erlaubt sind und <K>break</K> eine besondere Bedeutung hat.</p>
              <p>Der Ausdruck wird ausgewertet. Enthält <K>statement</K> eine <K>case</K>-Marke mit dem (konstanten) Wert, wird dorthin gesprungen. Sonst springt man zur <K>default</K>-Marke, falls vorhanden. Wenn nicht, springt man über <K>statement</K> bis ans Ende der switch-Anweisung. Die <K>break</K>-Anweisung beendet die switch-Anweisung. Das heisst: Die Anweisungen hinter der passenden <K>case</K>-Marke werden ausgeführt, <em>bis</em> das Ende der switch-Anweisung oder ein <K>break</K> erreicht ist! Dieses sogenannte <b>Durchfallen</b> (<span lang="en">fall-through</span>) ist umstritten und sollte sorgfältig bedacht werden. Es wird empfohlen, entsprechende Compilerwarnungen zu aktivieren, die uns auf (unabsichtliche?) Fall-throughs aufgrund eines fehlenden <K>break</K> hinweisen.</p>
            </>}
            en={<>
              <Code code={'switch (expression)\n    statement'} />
              <p>Here <K>expression</K> is an expression convertible to an integral type, <K>statement</K> is an arbitrary statement in which the labels <K>case</K> and <K>default</K> are permitted and <K>break</K> has a special meaning.</p>
              <p>The expression is evaluated. If <K>statement</K> contains a <K>case</K> label with the (constant) value, we jump there. Otherwise we jump to the <K>default</K> label, if available. If not, we jump over <K>statement</K> to the end of the switch statement. The <K>break</K> statement terminates the switch statement. In particular, this means that the statements after the <K>case</K> label with the matching value are executed as well, <em>until</em> the end of the switch statement or a <K>break</K> statement is encountered! This so-called <b>fall-through</b> is controversial and should be considered carefully. It is recommended to enable corresponding compiler warnings making us aware of (unintentional?) fall-throughs due to a missing <K>break</K> after a case.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was die Maschine tut.</b> Das <K>switch</K> ist ein Sprung in eine Liste von Anweisungen. Die <K>case</K>-Marken sind <em>nur Sprungziele</em>, keine Bedingungen. Nach dem Sprung läuft der Rechner einfach Zeile für Zeile weiter, auch über die nächste Marke hinweg, bis er auf ein <K>break</K> oder das Ende stösst. Das erklärt das «Durchfallen» ganz von allein, und warum die Eingabe 6 «Excellent … You passed!» ausgibt: Der Sprung landet bei <K>case 6</K>, kein <K>break</K> hält ihn auf, und er läuft in <K>case 5</K> und <K>case 4</K> hinein.</p>
            <p>Hier siehst du, was passiert, wenn das <K>break</K> überall fehlt:</p>
          </>}
          en={<>
            <p><b>What the machine does.</b> The <K>switch</K> is a jump into a list of statements. The <K>case</K> labels are <em>just jump targets</em>, not conditions. After the jump the machine simply carries on line by line, also across the next label, until it meets a <K>break</K> or the end. This explains the “fall-through” by itself, and why the input 6 prints “Excellent … You passed!”: the jump lands at <K>case 6</K>, no <K>break</K> stops it, and it runs on into <K>case 5</K> and <K>case 4</K>.</p>
            <p>Here you see what happens when the <K>break</K> is missing everywhere:</p>
          </>}
        />
        <Tracer prog={P.switchNoBreak} inputs={['1\n', '2\n', '3\n', '7\n']} label={tr('switch ohne break: es läuft bis zum Ende', 'switch without break: it runs to the end')} />
        <Box kind="tip" title={<T de="switch sicher benutzen" en="Using switch safely" />}>
          <T
            de={<ul>
              <li><b>Jeder Fall endet mit <K>break</K>,</b> ausser du willst bewusst durchfallen (wie bei <K>case 5:</K> direkt vor <K>case 4:</K>, wo gar keine Anweisung dazwischen steht). Schreibe dann einen Kommentar.</li>
              <li><b>Schalte die Warnung ein:</b> <K>g++ -Wextra</K> meldet «<K>this statement may fall through</K>» bei einem vergessenen <K>break</K> (der Test dieses Projekts prüft das mit dem Beispiel oben).</li>
              <li><b>Immer ein <K>default</K>,</b> auch wenn es nur einen Fehler meldet: So fällt ein unerwarteter Wert auf, statt dass alles stillschweigend übersprungen wird.</li>
              <li><b>Nur ganzzahlige Ausdrücke</b> (und <K>char</K>), und die Marken müssen Konstanten sein. Für Bereiche (<K>x &gt; 10</K>) nimm <K>if</K>.</li>
            </ul>}
            en={<ul>
              <li><b>End every case with <K>break</K></b> unless you deliberately want to fall through (as with <K>case 5:</K> directly before <K>case 4:</K>, where there is no statement in between). Then write a comment.</li>
              <li><b>Switch the warning on:</b> <K>g++ -Wextra</K> reports “<K>this statement may fall through</K>” for a forgotten <K>break</K> (this project’s test checks that with the example above).</li>
              <li><b>Always have a <K>default</K>,</b> even if it only reports an error: an unexpected value then stands out instead of everything being skipped silently.</li>
              <li><b>Integral expressions only</b> (and <K>char</K>), and the labels must be constants. For ranges (<K>x &gt; 10</K>) use <K>if</K>.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Was gibt <K>switch (x)</K> aus dem Beispiel oben (<K>case 1: "one "; case 2: "two "; case 3: "three "; default: "other"</K>, ohne <K>break</K>) für <K>x = 2</K> aus?</>} en={<>What does the <K>switch (x)</K> from the example above (<K>case 1: "one "; case 2: "two "; case 3: "three "; default: "other"</K>, without <K>break</K>) output for <K>x = 2</K>?</>} />}
          choices={[
            { text: <K>two three other</K>, correct: true, why: <T de={<>Richtig: Der Sprung landet bei <K>case 2</K>, und ohne <K>break</K> läuft alles bis zum Ende, auch durch <K>default</K>.</>} en={<>Correct: the jump lands at <K>case 2</K>, and without <K>break</K> everything runs to the end, also through <K>default</K>.</>} /> },
            { text: <K>two</K>, why: <T de={<>Das wäre es mit <K>break</K> nach jedem Fall. Die <K>case</K>-Marken sind keine Bedingungen, die den Rest abschneiden.</>} en={<>That would be the case with a <K>break</K> after each case. The <K>case</K> labels are not conditions that cut off the rest.</>} /> },
            { text: <K>one two three other</K>, why: <T de={<>Der Sprung geht <em>direkt</em> zu <K>case 2</K>; <K>case 1</K> wird gar nicht durchlaufen.</>} en={<>The jump goes <em>directly</em> to <K>case 2</K>; <K>case 1</K> is not run through at all.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Kontrollfluss ist die Reihenfolge der Ausführung. Alle Strukturen sind nur lesbare Formen von «bedingt verzweigen» und «springen».</li>
              <li>Wähle die Struktur, die am wenigsten Anweisungen, Zeilen und Sonderfälle braucht, aber vor allem: die man am leichtesten versteht.</li>
              <li><K>switch</K> springt zur passenden <K>case</K>-Marke und läuft dann weiter, bis zu einem <K>break</K> oder dem Ende.</li>
              <li>Ein fehlendes <K>break</K> ist ein Fehler, bis das Gegenteil bewiesen ist. Compilerwarnungen einschalten.</li>
            </ul>}
            en={<ul>
              <li>Control flow is the order of execution. All structures are only readable forms of “branch conditionally” and “jump”.</li>
              <li>Choose the structure that needs the fewest statements, lines and special cases, but above all: the one that is easiest to understand.</li>
              <li><K>switch</K> jumps to the matching <K>case</K> label and then carries on until a <K>break</K> or the end.</li>
              <li>A missing <K>break</K> is a bug until proven otherwise. Switch compiler warnings on.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Damit sind die Bausteine eines Programms beisammen: Variablen, Ausdrücke, Auswahl, Schleifen. Im nächsten Kapitel verpacken wir Teile davon zu eigenen <b>Funktionen</b>, die wir mit Namen aufrufen können.</p>}
          en={<p className="connections"><b>Next:</b> now the building blocks of a program are together: variables, expressions, selection, loops. In the next chapter we pack parts of them into our own <b>functions</b> that we can call by name.</p>}
        />
      </Section>
    </article>
  );
}
