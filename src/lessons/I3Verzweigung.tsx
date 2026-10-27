import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I3Verzweigung() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher lief jedes Programm Zeile für Zeile von oben nach unten. Interessant wird es erst, wenn ein Programm <em>entscheiden</em> kann: dieses tun oder jenes. Die Anweisung dafür ist <K>if</K>. Sie ist klein, aber fast jede nützliche Funktion enthält sie irgendwo.</p>}
        en={<p className="lede">So far every program ran line by line from top to bottom. Things get interesting once a program can <em>decide</em>: do this or do that. The statement for that is <K>if</K>. It is small, but almost every useful function contains one somewhere.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="if" title={<T de="1. Die if-Anweisung" en="1. The if statement" />}>
        <Box kind="lecture" src={<Src p="49" />} title={<T de="if" en="if" />}>
          <T
            de={<>
              <p>Fast alle interessanten Programme verwenden Verzweigungen und Sprünge. Die <b>if-Anweisung</b> hat die Form</p>
              <Code code={'if ( condition )\n    statement'} />
              <p>Dabei ist <K>condition</K> ein Ausdruck, der in <K>bool</K> umgewandelt werden kann, und <K>statement</K> eine beliebige Anweisung, der <b>Rumpf</b> (<span lang="en">body</span>) des <K>if</K>. Genau dann, wenn <K>condition</K> wahr ist, wird <K>statement</K> ausgeführt.</p>
              <p>Beispiel 5.1: Der Code liest <K>a</K> ein und gibt <K>even</K> genau dann aus, wenn die eingegebene Zahl gerade ist.</p>
            </>}
            en={<>
              <p>Almost all interesting programs use branches and jumps. The <b>if statement</b> has the form</p>
              <Code code={'if ( condition )\n    statement'} />
              <p>Here <K>condition</K> is an expression that can be converted to <K>bool</K>, and <K>statement</K> is an arbitrary statement, the <b>body</b> of the <K>if</K>. If and only if <K>condition</K> is true, <K>statement</K> is executed.</p>
              <p>Example 5.1: the code reads <K>a</K> and outputs <K>even</K> if and only if the number entered is even.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.ifOnly} inputs={['7\n', '10\n']} label={tr('Beispiel 5.1', 'Example 5.1')} />
        <T
          de={<>
            <p><b>Was der Rechner tut.</b> Er wertet zuerst die Bedingung aus. Das Ergebnis ist ein <K>bool</K>, also «wahr» oder «falsch». Ist es wahr, läuft er in den Rumpf hinein; ist es falsch, <em>überspringt</em> er den Rumpf und macht bei der nächsten Anweisung danach weiter. Probiere beide Eingaben im Ablauf oben: Bei <K>7</K> springt die Markierung direkt über die Ausgabe hinweg.</p>
            <p>Auf der Ebene der Maschine ist das genau der bedingte Sprung aus dem Schachtel-Rechner: «springe, wenn die Bedingung nicht gilt». Der Compiler übersetzt jedes <K>if</K> in einen Vergleich und einen solchen Sprung.</p>
          </>}
          en={<>
            <p><b>What the machine does.</b> It first evaluates the condition. The result is a <K>bool</K>, i.e. “true” or “false”. If it is true, the machine enters the body; if it is false, it <em>skips</em> the body and continues with the next statement after it. Try both inputs in the run above: for <K>7</K> the marker jumps right over the output.</p>
            <p>At the level of the machine this is exactly the conditional jump of the box computer: “jump if the condition does not hold”. The compiler translates every <K>if</K> into a comparison and such a jump.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="else" title={<T de="2. if-else: genau einer von beiden" en="2. if-else: exactly one of the two" />}>
        <Box kind="lecture" src={<Src p="49–50" />} title={<T de="if-else" en="if-else" />}>
          <T
            de={<>
              <p>Die <b>if-else-Anweisung</b> hat die Form</p>
              <Code code={'if ( condition )\n    statement1\nelse\n    statement2'} />
              <p><K>statement1</K> ist der Rumpf des <K>if</K>, <K>statement2</K> der Rumpf des <K>else</K>-Zweigs. Genau dann, wenn <K>condition</K> wahr ist, wird <K>statement1</K> ausgeführt, sonst <K>statement2</K>.</p>
              <p>Beispiel 5.2: Das Programm gibt <K>even</K> aus, wenn die Zahl gerade ist, und sonst <K>odd</K>.</p>
            </>}
            en={<>
              <p>The <b>if-else statement</b> has the form</p>
              <Code code={'if ( condition )\n    statement1\nelse\n    statement2'} />
              <p><K>statement1</K> is the body of the <K>if</K>, <K>statement2</K> the body of the <K>else</K> branch. If and only if <K>condition</K> is true, <K>statement1</K> is executed, otherwise <K>statement2</K>.</p>
              <p>Example 5.2: the program outputs <K>even</K> if the number is even, and <K>odd</K> otherwise.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.evenOdd} inputs={['7\n', '10\n']} label={tr('Beispiel 5.2', 'Example 5.2')} />
        <T
          de={<p>Merke dir den Unterschied zu zwei hintereinander stehenden <K>if</K>: Bei <K>if … else</K> wird die Bedingung <em>einmal</em> ausgewertet, und es läuft <em>genau ein</em> Zweig. Bei zwei getrennten <K>if</K> wird zweimal ausgewertet, und es können beide, einer oder keiner laufen.</p>}
          en={<p>Keep the difference to two <K>if</K> statements in a row in mind: with <K>if … else</K> the condition is evaluated <em>once</em> and <em>exactly one</em> branch runs. With two separate <K>if</K> statements it is evaluated twice, and both, one or none may run.</p>}
        />
        <T
          de={<p><b>Mehr als zwei Fälle.</b> Der <K>else</K>-Zweig ist selbst eine Anweisung, also darf dort wieder ein <K>if</K> stehen. So entsteht eine Kette, die von oben nach unten die erste zutreffende Bedingung sucht:</p>}
          en={<p><b>More than two cases.</b> The <K>else</K> branch is a statement itself, so another <K>if</K> may stand there. This gives a chain that searches from top to bottom for the first condition that holds:</p>}
        />
        <Tracer prog={P.elseIf} inputs={['-4\n', '0\n', '5\n']} label={tr('Eine if-else-Kette', 'An if-else chain')} />
        <T
          de={<p>Sobald eine Bedingung zutrifft, werden die übrigen gar nicht mehr ausgewertet. Die Reihenfolge der Bedingungen ist also Teil der Logik, besonders wenn sich Fälle überlappen.</p>}
          en={<p>As soon as one condition holds, the remaining ones are not evaluated at all. The order of the conditions is therefore part of the logic, especially when cases overlap.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="layout" title={<T de="3. Einrückung ist für Menschen" en="3. Indentation is for humans" />}>
        <Box kind="lecture" src={<Src p="50" />} title={<T de="Layout" en="Layout" />}>
          <T
            de={<p>Die Einrückung im Programm oben wird vom Compiler vollständig ignoriert, wir könnten alles in eine einzige Zeile schreiben. Wir helfen aber anderen (und unserem späteren Ich), den Code zu lesen, indem wir ihn entsprechend strukturieren: Anweisungen, die zu den beiden Zweigen gehören, werden eingerückt (Beispiel 5.3).</p>}
            en={<p>The indentation in the program above is completely ignored by the compiler; we could write everything on a single line. But we help others (and our future self) to read our code by structuring it accordingly: statements belonging to the two branches are indented (Example 5.3).</p>}
          />
        </Box>
        <Listing prog={P.oneLine} label={tr('Dasselbe Programm in einer Zeile: gleiche Ausgabe', 'The same program on one line: same output')} />
        <Box kind="tip" title={<T de="Drei Fehler, die jeder einmal macht" en="Three mistakes everyone makes once" />}>
          <T
            de={<ol>
              <li><b>Semikolon direkt hinter der Bedingung.</b> <K>if (a % 2 == 0);</K> ist gültig: Der Rumpf ist dann die <em>leere Anweisung</em> «<K>;</K>». Die Ausgabe in der nächsten Zeile gehört nicht mehr zum <K>if</K> und läuft immer.</li>
              <li><b><K>=</K> statt <K>==</K>.</b> <K>if (a = 0)</K> ist ebenfalls gültig. Es <em>weist zu</em>, und der Wert der Zuweisung (hier 0, also falsch) ist die Bedingung. Das Programm läuft, tut aber etwas ganz anderes.</li>
              <li><b>Einrückung, die lügt.</b> Wir sehen das im Abschnitt über Blöcke: Der Compiler liest die Einrückung nicht, du aber schon.</li>
            </ol>}
            en={<ol>
              <li><b>A semicolon right after the condition.</b> <K>if (a % 2 == 0);</K> is valid: the body is then the <em>empty statement</em> “<K>;</K>”. The output in the next line no longer belongs to the <K>if</K> and always runs.</li>
              <li><b><K>=</K> instead of <K>==</K>.</b> <K>if (a = 0)</K> is valid as well. It <em>assigns</em>, and the value of the assignment (here 0, i.e. false) is the condition. The program runs, but does something entirely different.</li>
              <li><b>Indentation that lies.</b> We see this in the section on blocks: the compiler does not read the indentation, but you do.</li>
            </ol>}
          />
        </Box>
        <Listing prog={P.ifSemicolon} label={tr('Eingabe 7: «even» erscheint trotzdem', 'Input 7: “even” appears anyway')} />
        <Listing prog={P.ifAssign} label={tr('Zuweisung als Bedingung', 'Assignment as the condition')} />
        <T
          de={<p>Im zweiten Programm zeigt die Ausgabe zweierlei: Es wurde der <K>else</K>-Zweig gewählt, und <K>a</K> ist danach 0, die Bedingung hat also die Variable verändert. Der Compiler warnt davor, wenn du ihn mit <K>-Wall</K> aufrufst. Schalte Warnungen immer ein.</p>}
          en={<p>The output of the second program shows two things: the <K>else</K> branch was chosen, and <K>a</K> is 0 afterwards, so the condition changed the variable. The compiler warns about this if you call it with <K>-Wall</K>. Always switch warnings on.</p>}
        />
        <Choice
          question={<T de={<>Was gibt dieses Programm für die Eingabe <K>10</K> aus? <K>if (a % 2 == 0) std::cout &lt;&lt; "even"; else std::cout &lt;&lt; "odd"; std::cout &lt;&lt; "!";</K></>} en={<>What does this program output for the input <K>10</K>? <K>if (a % 2 == 0) std::cout &lt;&lt; "even"; else std::cout &lt;&lt; "odd"; std::cout &lt;&lt; "!";</K></>} />}
          choices={[
            { text: <K>even!</K>, correct: true, why: <T de={<>Richtig. <K>10</K> ist gerade, also läuft der <K>if</K>-Zweig. Das <K>else</K> beendet die if-else-Anweisung. Das Ausrufezeichen steht dahinter und läuft immer.</>} en={<>Correct. <K>10</K> is even, so the <K>if</K> branch runs. The <K>else</K> ends the if-else statement. The exclamation mark comes after it and always runs.</>} /> },
            { text: <K>even</K>, why: <T de={<>Das Ausrufezeichen gehört nicht zum <K>else</K>: Zu diesem Zweig gehört nur die <em>eine</em> Anweisung direkt dahinter.</>} en={<>The exclamation mark does not belong to the <K>else</K>: only the <em>one</em> statement directly after it belongs to that branch.</>} /> },
            { text: <K>even!odd!</K>, why: <T de={<>Es läuft nie beides: Bei einer if-else-Anweisung wird genau ein Zweig gewählt.</>} en={<>Both never run: an if-else statement chooses exactly one branch.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>if (c) s</K>: <K>s</K> läuft genau dann, wenn <K>c</K> wahr ist; sonst wird <K>s</K> übersprungen.</li>
              <li><K>if (c) s1 else s2</K>: genau einer der beiden Zweige läuft; die Bedingung wird einmal ausgewertet.</li>
              <li>Die Bedingung ist ein Ausdruck vom Typ <K>bool</K>. Prüfe auf Gleichheit mit <K>==</K>, nie mit <K>=</K>.</li>
              <li>Ein Semikolon direkt hinter <K>if (…)</K> macht den Rumpf leer.</li>
              <li>Einrückung ist für Menschen. Der Compiler ignoriert sie.</li>
            </ul>}
            en={<ul>
              <li><K>if (c) s</K>: <K>s</K> runs if and only if <K>c</K> is true; otherwise <K>s</K> is skipped.</li>
              <li><K>if (c) s1 else s2</K>: exactly one of the two branches runs; the condition is evaluated once.</li>
              <li>The condition is an expression of type <K>bool</K>. Test for equality with <K>==</K>, never with <K>=</K>.</li>
              <li>A semicolon right after <K>if (…)</K> makes the body empty.</li>
              <li>Indentation is for humans. The compiler ignores it.</li>
            </ul>}
          />
        </Box>
        <Predict
          prompt={<T de={<>Ein <K>if</K> kann nur <em>eine</em> Anweisung als Rumpf haben. Wie bringst du trotzdem mehrere Anweisungen in einen Zweig?</>} en={<>An <K>if</K> can have only <em>one</em> statement as its body. How do you still get several statements into a branch?</>} />}
          answer={<T de={<>Mit geschweiften Klammern, die mehrere Anweisungen zu <em>einer</em> zusammenfassen: einem Block. Genau das ist das Thema der übernächsten Lektion.</>} en={<>With curly braces, which combine several statements into <em>one</em>: a block. That is exactly the topic of the lesson after next.</>} />}
        />
        <T
          de={<p className="connections"><b>Weiter:</b> Ein <K>if</K> läuft höchstens einmal über eine Stelle. Wie wiederholt man etwas, zum Beispiel für alle Zahlen von 1 bis <K>n</K>? Mit Schleifen, zuerst der <K>for</K>-Schleife (Skript S. 50–53).</p>}
          en={<p className="connections"><b>Next:</b> an <K>if</K> passes a place at most once. How do you repeat something, for example for all numbers from 1 to <K>n</K>? With loops, first the <K>for</K> loop (notes pp. 50–53).</p>}
        />
      </Section>
    </article>
  );
}
