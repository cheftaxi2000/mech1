import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { CompileFail, ScopeFigure } from '../viz/info/ControlFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I3Bloecke() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Zwei Fragen aus der letzten Lektion bleiben offen: Wie schreibt man <em>mehrere</em> Anweisungen in einen Rumpf? Und wo ist eine Variable wie <K>i</K> aus <K>for (int i = …)</K> eigentlich sichtbar? Beide Fragen hängen an einem Zeichenpaar: den geschweiften Klammern.</p>}
        en={<p className="lede">Two questions from the last lesson remain open: how do you write <em>several</em> statements into one body? And where is a variable like <K>i</K> from <K>for (int i = …)</K> actually visible? Both questions hang on one pair of characters: the curly braces.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="block" title={<T de="1. Blöcke: viele Anweisungen als eine" en="1. Blocks: many statements as one" />}>
        <Box kind="lecture" src={<Src p="53–54" />} title={<T de="Anweisungsblock" en="Statement block" />}>
          <T
            de={<>
              <p>Ein <b>Anweisungsblock</b> fasst mehrere Anweisungen zu einer neuen Anweisung zusammen. Ihn auszuführen heisst, alle enthaltenen Anweisungen auszuführen. Er wird durch geschweifte Klammern um die Anweisungen geschrieben:</p>
              <Code code={'{ statement_1 statement_2 ... statement_n }'} />
              <p>Ein Block kann im Prinzip überall stehen, wo eine Anweisung stehen kann. Meistens verwendet man ihn für Funktionen und Kontrollanweisungen.</p>
              <p>Beispiel 5.4: der Rumpf von <K>main</K>. Beispiel 5.5: ein Schleifenrumpf, der die Teilsumme ausgibt. Beispiel 5.6 und 5.7: die Zweige eines <K>if</K>-<K>else</K>.</p>
            </>}
            en={<>
              <p>A <b>statement block</b> groups several statements into a new statement. Executing it means executing all statements it contains. It is written with curly braces around the statements:</p>
              <Code code={'{ statement_1 statement_2 ... statement_n }'} />
              <p>A block can in principle appear everywhere a statement can appear. Most often it is used for functions and control statements.</p>
              <p>Example 5.4: the body of <K>main</K>. Example 5.5: a loop body that outputs the partial sum. Examples 5.6 and 5.7: the branches of an <K>if</K>-<K>else</K>.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.forSumBlock} inputs={['3\n']} label={tr('Beispiel 5.5: ein Block als Schleifenrumpf', 'Example 5.5: a block as loop body')} />
        <T
          de={<p>Der Block ist <em>eine</em> Anweisung. Für die for-Schleife ist es also ein einziger Rumpf, der bei jedem Durchgang ganz ausgeführt wird. Beachte, dass nach der schliessenden Klammer <em>kein</em> Semikolon steht: Das gehört nur zu Anweisungen, die damit enden, nicht zum Block.</p>}
          en={<p>The block is <em>one</em> statement. For the for loop it is therefore a single body that is executed completely at every pass. Note that there is <em>no</em> semicolon after the closing brace: that belongs to statements that end with one, not to the block.</p>}
        />
        <Box kind="misconception" title={<T de="«Die Einrückung zeigt, was zur Schleife gehört.»" en="“The indentation shows what belongs to the loop.”" />}>
          <T
            de={<>
              <p>Nicht für den Compiler. Es ist leicht, bei mehreren Anweisungen in einer Schleife oder einem <K>if</K> einen Fehler zu machen. Der folgende Code tut nicht, was der Programmierer offensichtlich wollte: Die Einrückung legt nahe, dass beide Anweisungen zum Rumpf gehören. Der Compiler ignoriert die Einrückung aber, und es gehört nur die <em>erste</em> Anweisung dazu.</p>
            </>}
            en={<>
              <p>Not for the compiler. It is easy to make a mistake with several statements in a loop or an <K>if</K>. The following code does not do what the programmer obviously intended: the indentation suggests that both statements belong to the body. The compiler ignores the indentation, however, and only the <em>first</em> statement belongs to it.</p>
            </>}
          />
        </Box>
        <Listing prog={P.forSumDangling} label={tr('Gleicher Code wie Beispiel 5.5, aber ohne Block (Eingabe 3)', 'Same code as Example 5.5 but without a block (input 3)')} />
        <T
          de={<p>Statt dreier Teilsummen erscheint nur eine Ausgabe, die letzte, <em>nach</em> der Schleife. Genauso beim <K>if</K>:</p>}
          en={<p>Instead of three partial sums there is one output only, the last one, <em>after</em> the loop. The same with <K>if</K>:</p>}
        />
        <Listing prog={P.ifDangling} label={tr('Eingabe 7: « number» erscheint trotz ungerader Zahl', 'Input 7: “ number” appears although the number is odd')} />
        <Box kind="lecture" src={<Src p="54" />} title={<T de="Empfehlung" en="Recommendation" />}>
          <T
            de={<p>Es ist eine gute Idee, in <em>jeder</em> Auswahl- oder Schleifenanweisung einen Block zu verwenden. Auch visuell zahlt sich die Konsistenz aus (Beispiel 5.7: <K>if (…) {'{'} … {'}'} else {'{'} … {'}'}</K>).</p>}
            en={<p>It is a good idea to use a statement block in <em>every</em> selection or iteration statement. Consistency also pays off visually (Example 5.7: <K>if (…) {'{'} … {'}'} else {'{'} … {'}'}</K>).</p>}
          />
        </Box>
        <Box kind="tip" title={<T de="Klammern immer setzen" en="Always write the braces" />}>
          <T
            de={<ul>
              <li><b>Auch bei nur einer Anweisung.</b> Fügst du später eine zweite hinzu, ist der Rumpf automatisch richtig. Das ist der häufigste Grund für den Fehler oben.</li>
              <li><b>Ein Semikolon hinter der Kopfzeile ist ein leerer Rumpf.</b> <K>for (…);</K> und <K>if (…);</K> compilieren ohne Fehler. Mit Block fällt das sofort auf, weil dann ein loses <K>{'{'} … {'}'}</K> dahinter steht.</li>
              <li>Moderne Editoren rücken nach <K>{'{'}</K> automatisch ein. Wenn die Einrückung «komisch» wirkt, hast du meist eine Klammer vergessen.</li>
            </ul>}
            en={<ul>
              <li><b>Even for a single statement.</b> If you add a second one later, the body is automatically right. This is the most common reason for the mistake above.</li>
              <li><b>A semicolon after the header is an empty body.</b> <K>for (…);</K> and <K>if (…);</K> compile without errors. With a block this stands out at once, because a loose <K>{'{'} … {'}'}</K> follows.</li>
              <li>Modern editors indent automatically after <K>{'{'}</K>. If the indentation looks “odd”, you have usually forgotten a brace.</li>
            </ul>}
          />
        </Box>
        <Listing prog={P.nullBody} label={tr('for (…); mit leerem Rumpf: «hello» erscheint nur einmal, nach der Schleife', 'for (…); with an empty body: “hello” appears only once, after the loop')} />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="sicht" title={<T de="2. Sichtbarkeit: wo ist eine Variable gültig?" en="2. Visibility: where is a variable valid?" />}>
        <Box kind="lecture" src={<Src p="55" />} title={<T de="Gültigkeitsbereich" en="Scope" />}>
          <T
            de={<>
              <p>Betrachte das folgende, scheinbar einfache Programm. Was passiert?</p>
              <p>Die Ausgabe von <K>i</K> hinter der Schleife führt zu einem Compilerfehler: Der Name <K>i</K> sei nicht deklariert. Das ist seltsam, wir haben <K>i</K> doch in der Schleife deklariert. Ja, aber Variablen sind nur <b>sichtbar</b> (d.h. zugreifbar), bis der <b>Gültigkeitsbereich</b> (<span lang="en">scope</span>) endet, in dem sie deklariert wurden.</p>
              <p>Ein Gültigkeitsbereich ist ein Teil des Codes, der unter anderem durch eine Kontrollstruktur (wie eine for-Schleife oder ein <K>if</K>), einen Funktionsrumpf oder einen Block festgelegt wird. Er beginnt <em>nach</em> der Deklaration und endet, wenn der aktuelle Bereich endet. Bereiche können <b>geschachtelt</b>, aber nicht verschränkt sein. In einem inneren Bereich sind die Variablen der äusseren Bereiche sichtbar, nicht aber umgekehrt. Man kann sich eine «Blickrichtung» von innen nach aussen vorstellen: Äussere Bereiche wissen nichts von dem, was im Inneren passiert.</p>
            </>}
            en={<>
              <p>Consider the following, seemingly simple program. What happens?</p>
              <p>The output of <K>i</K> after the loop leads to a compiler error: the name <K>i</K> is not declared. This is odd, we did declare <K>i</K> in the loop. Yes, but variables are only <b>visible</b> (i.e. accessible) until the <b>scope</b> they are declared in ends.</p>
              <p>A scope is a part of the code defined, among other things, by a control structure (such as a for loop or an <K>if</K>), a function body or a block. It starts <em>after</em> the declaration and ends when the current scope ends. Scopes can be <b>nested</b> but not interleaved. In an inner scope, variables declared in the outer scopes can be seen, but not vice versa. One can think of a “viewing direction” from inside to outside: outer scopes are oblivious to what happens inside.</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.scopeUndeclared} label={tr('Das Beispiel aus dem Skript', 'The example from the notes')} />
        <T
          de={<>
            <p><b>Was dahinter steckt.</b> Eine Variable braucht Speicher. Der Compiler legt diesen Speicher an, wenn die Deklaration erreicht wird, und gibt ihn wieder frei, wenn der Bereich endet. Danach <em>gibt es die Variable nicht mehr</em>, und ihr Name bedeutet nichts. Der Compilerfehler schützt dich davor, Speicher zu lesen, der längst für etwas anderes gebraucht wird.</p>
          </>}
          en={<>
            <p><b>What is behind this.</b> A variable needs memory. The compiler sets this memory up when the declaration is reached, and frees it when the scope ends. After that <em>the variable no longer exists</em>, and its name means nothing. The compiler error protects you from reading memory that has long since been used for something else.</p>
          </>}
        />
        <ScopeFigure
          code={P.scopeUndeclared.code}
          bars={[{ name: 's', from: 3, to: 8, tone: 1 }, { name: 'i', from: 4, to: 5, tone: 2 }]}
          label={tr('Gültigkeitsbereiche', 'Scopes')}
          caption={<T de={<>Der Balken zeigt, wo der Name sichtbar ist. <K>s</K> lebt bis zum Ende von <K>main</K>, <K>i</K> nur bis zum Ende der Schleife: Zeile 6 liegt ausserhalb des Balkens.</>} en={<>The bar shows where the name is visible. <K>s</K> lives until the end of <K>main</K>, <K>i</K> only until the end of the loop: line 6 lies outside the bar.</>} />}
        />
        <T
          de={<p>Skript, Abb. 5.1: Eine Variable in einem inneren Block ist im äusseren Bereich nicht zugreifbar. (Die Bildunterschrift dort sagt es umgekehrt; gemeint und gezeigt ist die Blickrichtung von innen nach aussen.)</p>}
          en={<p>Notes, Fig. 5.1: a variable in an inner block cannot be accessed in the outer scope. (The caption there says it the other way round; what is meant and shown is the viewing direction from inside to outside.)</p>}
        />
        <CompileFail prog={P.scopeBlockErr} label={tr('Dasselbe mit einem Block', 'The same with a block')} />
        <Listing prog={P.innerOuter} label={tr('Von innen sieht man nach aussen', 'From inside you can see outwards')} />
        <Box kind="tip" title={<T de="Wo deklarieren?" en="Where to declare?" />}>
          <T
            de={<ul>
              <li><b>So spät und so lokal wie möglich.</b> Eine Variable, die nur in der Schleife gebraucht wird, gehört in den Schleifenkopf. Dann kann sie nirgends sonst versehentlich benutzt werden.</li>
              <li><b>Brauchst du den Wert nach der Schleife,</b> deklariere die Variable davor, wie <K>d</K> beim Primzahltest.</li>
              <li>Die Meldung «<K>was not declared in this scope</K>» heisst fast immer: Tippfehler im Namen oder die Variable ist schon ausserhalb ihres Bereichs.</li>
            </ul>}
            en={<ul>
              <li><b>As late and as local as possible.</b> A variable needed only in the loop belongs in the loop header. Then it cannot be used anywhere else by accident.</li>
              <li><b>If you need the value after the loop,</b> declare the variable before it, like <K>d</K> in the prime test.</li>
              <li>The message “<K>was not declared in this scope</K>” almost always means: a typo in the name, or the variable is already outside its scope.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="verdeckt" title={<T de="3. Verdecken (Shadowing)" en="3. Shadowing" />}>
        <Box kind="lecture" src={<Src p="56–57" />} title={<T de="Verdeckte Variablen" en="Shadowed variables" />}>
          <T
            de={<>
              <p>Das ist nur die halbe Wahrheit. Es gibt Fälle, in denen eine Variable aus einem äusseren Bereich im inneren Bereich <em>nicht</em> sichtbar ist. Zwei Variablen <K>i</K> würden zu einem Fehler führen, denn ein Name muss eindeutig sein. Tatsächlich geht es im <em>selben</em> Bereich nicht (Code 5.2). Steht die zweite Deklaration aber in einem geschachtelten Bereich, ist es möglich: Die innere Deklaration <b>verdeckt</b> die äussere. Im inneren Bereich wird eine neue Variable dieses Namens angelegt, die alte ist vorübergehend nicht zugreifbar.</p>
              <p>Der tatsächliche Gültigkeitsbereich einer Variablen kann also kleiner sein als ihr möglicher Bereich.</p>
            </>}
            en={<>
              <p>This is only half the truth. There are scenarios in which a variable declared in an outer scope is <em>not</em> visible in an inner scope. Two variables <K>i</K> would be expected to lead to an error, as the variable name needs to be unique. Indeed, it is not possible in the <em>same</em> scope (Code 5.2). If the second declaration happens in a nested scope, however, it is possible: the inner declaration <b>shadows</b> the outer one. In the inner scope a new variable of that name is created; the old one is temporarily not accessible.</p>
              <p>The actual scope of a variable thus might be smaller than its possible scope.</p>
            </>}
          />
        </Box>
        <CompileFail prog={P.redeclSame} label={tr('Gleicher Typ, gleicher Bereich', 'Same type, same scope')} />
        <CompileFail prog={P.redeclOther} label={tr('Anderer Typ, gleicher Bereich', 'Different type, same scope')} />
        <Tracer prog={P.shadow} label={tr('Abb. 5.3: das innere i verdeckt das äussere', 'Fig. 5.3: the inner i shadows the outer one')} />
        <ScopeFigure
          code={P.shadow.code}
          bars={[{ name: tr('i (aussen)', 'i (outer)'), from: 3, to: 8, tone: 1, skip: [4, 5] }, { name: tr('i (innen)', 'i (inner)'), from: 4, to: 5, tone: 2 }]}
          label={tr('Verdeckung', 'Shadowing')}
          caption={<T de={<>Zwei verschiedene Variablen, beide <K>i</K> genannt. In den Zeilen 4–5 sieht man nur die rote (innere); in Zeile 6 wieder die blaue (äussere).</>} en={<>Two different variables, both called <K>i</K>. In lines 4–5 only the red (inner) one is visible; in line 6 the blue (outer) one again.</>} />}
        />
        <T
          de={<p>Im Ablauf siehst du es an den Werten: Während der Schleife zählt das innere <K>i</K> von 0 bis 4. Das äussere <K>i</K> behält die ganze Zeit den Wert 2, und die Ausgabe am Ende (<K>2</K>) ist seine.</p>}
          en={<p>In the run you see it in the values: during the loop the inner <K>i</K> counts from 0 to 4. The outer <K>i</K> keeps the value 2 all the time, and the final output (<K>2</K>) is its.</p>}
        />
        <Box kind="misconception" title={<T de="«Zwei Variablen mit demselben Namen sind verboten.»" en="“Two variables with the same name are forbidden.”" />}>
          <T
            de={<>Nur im <em>selben</em> Bereich. In verschachtelten Bereichen ist es erlaubt, aber selten klug: Wer den Code liest, verwechselt die beiden leicht. Verwende lieber verschiedene Namen. Sehr oft ist ein Verdecken ein Hinweis darauf, dass man die äussere Variable gar nicht verändern wollte.</>}
            en={<>Only in the <em>same</em> scope. In nested scopes it is allowed, but rarely wise: whoever reads the code easily mixes the two up. Use different names instead. Very often shadowing is a sign that you did not mean to change the outer variable at all.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="lokal" title={<T de="4. Lokale Variablen werden neu erzeugt" en="4. Local variables are created anew" />}>
        <Box kind="lecture" src={<Src p="57" />} title={<T de="Lokale Variablen" en="Local variables" />}>
          <T
            de={<>
              <p>Variablen, die in einem Block definiert sind (also nicht im globalen Bereich), heissen <b>lokale Variablen</b>. Lokale Variablen werden <em>jedes Mal neu erzeugt</em>, wenn ihre Deklaration erreicht wird: Sie bekommen eine Speicheradresse (<b>Allokation</b>), und eine mögliche Initialisierung wird ausgeführt. Erreicht der Ablauf das Ende des Bereichs, wird die Variable <b>freigegeben</b>: Der Speicher wird freigegeben und die Adresse ungültig.</p>
              <p>Versuche herauszufinden (ohne den Code auszuführen), was das folgende Programm ausgibt.</p>
            </>}
            en={<>
              <p>Variables that are defined inside a block (i.e., not within the global scope) are called <b>local variables</b>. Local variables are <em>(re-)created each time</em> their declaration is reached: they get assigned a memory address (<b>allocation</b>) and a potential initialization is executed. Once the end of its scope is reached, the variable is <b>deallocated</b>: the memory is released and the address becomes invalid.</p>
              <p>Try to figure out (without running the code) what the following program outputs.</p>
            </>}
          />
        </Box>
        <Code code={P.localRecreated.code} label={tr('Was wird ausgegeben?', 'What is printed?')} />
        <Choice
          question={<T de="Welche Ausgabe erwartest du?" en="Which output do you expect?" />}
          choices={[
            { text: <K>61718191101</K>, correct: true, why: <T de={<>Richtig, es ist die tatsächliche Ausgabe. Das <K>k</K> wird in <em>jedem</em> Durchgang neu erzeugt und mit 2 initialisiert, daher ist <K>--k</K> immer 1. Der Zähler <K>i</K> lebt dagegen ausserhalb der Schleife weiter und wächst: 6, 7, 8, 9, 10. Abwechselnd: 6 1, 7 1, 8 1, 9 1, 10 1.</>} en={<>Right, it is the actual output. The <K>k</K> is created anew in <em>each</em> pass and initialized with 2, so <K>--k</K> is always 1. The counter <K>i</K>, in contrast, lives on outside the loop and grows: 6, 7, 8, 9, 10. Alternating: 6 1, 7 1, 8 1, 9 1, 10 1.</>} /> },
            { text: <K>61708-19-210-3</K>, why: <T de={<>Das wäre es, wenn <K>k</K> seinen Wert behielte und jedes Mal um 1 sänke: <K>1, 0, -1, -2, -3</K>. Es wird aber bei jedem Durchgang <em>neu</em> mit 2 angelegt.</>} en={<>That would be the case if <K>k</K> kept its value and fell by 1 each time: <K>1, 0, -1, -2, -3</K>. But it is created <em>anew</em> with 2 at every pass.</>} /> },
          ]}
        />
        <Tracer prog={P.localRecreated} label={tr('Der Ablauf zeigt: k wird jedes Mal neu angelegt', 'The run shows: k is created anew every time')} />
        <T
          de={<p>Achte im Ablauf auf die Tabelle der Variablen: Am Ende jedes Durchgangs verschwindet <K>k</K>, und im nächsten taucht ein neues <K>k</K> mit dem Wert 2 auf. Wer einen Wert über mehrere Durchgänge behalten will, muss die Variable <em>vor</em> der Schleife deklarieren.</p>}
          en={<p>Watch the table of variables in the run: at the end of each pass <K>k</K> disappears, and in the next one a new <K>k</K> with the value 2 appears. Whoever wants to keep a value across passes must declare the variable <em>before</em> the loop.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>{'{ … }'}</K> macht aus mehreren Anweisungen eine. Setze bei <K>if</K>, <K>else</K> und Schleifen immer Klammern.</li>
              <li>Eine Variable ist von ihrer Deklaration bis zum Ende ihres Blocks sichtbar. Innen sieht man nach aussen, nicht umgekehrt.</li>
              <li>Im selben Bereich ist ein Name nur einmal erlaubt. Im geschachtelten Bereich verdeckt die innere Variable die äussere.</li>
              <li>Lokale Variablen entstehen bei jedem Erreichen ihrer Deklaration neu und verschwinden am Ende des Blocks.</li>
            </ul>}
            en={<ul>
              <li><K>{'{ … }'}</K> turns several statements into one. Always write braces for <K>if</K>, <K>else</K> and loops.</li>
              <li>A variable is visible from its declaration to the end of its block. From inside you see outwards, not the other way round.</li>
              <li>In the same scope a name is allowed only once. In a nested scope the inner variable shadows the outer one.</li>
              <li>Local variables are created anew every time their declaration is reached and disappear at the end of the block.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Die <K>for</K>-Schleife passt am besten, wenn man die Zahl der Durchgänge kennt. Für alles andere gibt es <K>while</K>, <K>do</K>-<K>while</K>, und die Sprünge <K>break</K> und <K>continue</K> (Skript S. 57–64).</p>}
          en={<p className="connections"><b>Next:</b> the <K>for</K> loop fits best when you know the number of passes. For everything else there are <K>while</K>, <K>do</K>-<K>while</K>, and the jumps <K>break</K> and <K>continue</K> (notes pp. 57–64).</p>}
        />
      </Section>
    </article>
  );
}
