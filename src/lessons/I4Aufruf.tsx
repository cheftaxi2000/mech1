import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I4Aufruf() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein Funktionsaufruf wirkt wie Magie: Man schreibt <K>pow(b, e)</K> und bekommt eine Zahl. Diese Lektion öffnet die Kiste. Du siehst die fünf Schritte eines Aufrufs, verstehst, warum eine Funktion die Variablen des Aufrufers nicht ändern kann, und siehst im Speicher, wo die Parameter eigentlich liegen.</p>}
        en={<p className="lede">A function call looks like magic: you write <K>pow(b, e)</K> and get a number. This lesson opens the box. You see the five steps of a call, understand why a function cannot change the caller’s variables, and see in memory where the parameters actually live.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="schritte" title={<T de="1. Die fünf Schritte eines Aufrufs" en="1. The five steps of a call" />}>
        <Box kind="lecture" src={<Src p="74–75" />} title={<T de="Auswertung eines Funktionsaufrufs" en="Evaluation of a function call" />}>
          <T
            de={<>
              <p>Beim Aufruf einer Funktion passiert Folgendes (Beispiel 6.6 mit <K>pow(2.0, -2)</K>):</p>
              <ol>
                <li>Die Argumente des Aufrufs werden ausgewertet (hier <K>2.0</K> und <K>-2</K>).</li>
                <li>Die formalen Parameter werden mit den Ergebnissen dieser Auswertungen initialisiert (<K>b = 2.0</K>, <K>e = -2</K>).</li>
                <li>Der Rumpf der Funktion wird ausgeführt. Die formalen Parameter verhalten sich wie lokale Variablen der Funktion.</li>
                <li>Die Ausführung der Funktion endet mit <K>return expression;</K> (hier <K>return result;</K>).</li>
                <li>Der Rückgabewert ist der Wert des Funktionsaufrufs (hier <K>0.25</K>).</li>
              </ol>
            </>}
            en={<>
              <p>When a function is called, the following happens (Example 6.6 with <K>pow(2.0, -2)</K>):</p>
              <ol>
                <li>The arguments of the call are evaluated (here <K>2.0</K> and <K>-2</K>).</li>
                <li>The formal parameters are initialized with the values resulting from these evaluations (<K>b = 2.0</K>, <K>e = -2</K>).</li>
                <li>The body of the function is executed. The formal parameters behave like local variables of the function.</li>
                <li>The execution of the function ends with <K>return expression;</K> (here <K>return result;</K>).</li>
                <li>The return value is the value of the function call (here <K>0.25</K>).</li>
              </ol>
            </>}
          />
        </Box>
        <Tracer stack prog={P.scopeParams} label={tr('Beispiel 6.7: ein Aufruf, Schritt für Schritt', 'Example 6.7: one call, step by step')} />
        <T
          de={<>
            <p><b>So liest du den Ablauf.</b> Gehe bis zur Zeile <K>double z = pow(b, e);</K> und mache dann einen Schritt weiter. Es erscheint ein <em>zweiter</em> Kasten über dem von <K>main</K>: Das ist die Funktion <K>pow</K> mit ihren eigenen Variablen <K>b</K> und <K>e</K>, die als <em>Kopien</em> von <K>main</K>s <K>b</K> und <K>e</K> angelegt wurden (Schritte 1 und 2). Danach arbeitet nur noch <K>pow</K>: Die Markierung wandert durch die Funktion, <K>b</K> wird <K>0.5</K>, <K>e</K> wird <K>2</K> (Schritt 3). Bei <K>return</K> verschwindet der Kasten, und der Wert <K>0.25</K> landet in <K>z</K> (Schritte 4 und 5).</p>
            <p>Beachte, dass die Zahl in <K>z</K> erst <em>nach</em> der Rückkehr erscheint: Die Zuweisung ist der letzte Teil der Zeile. Und <K>z</K> ist bis dahin «?», denn sie wurde angelegt, aber noch nicht beschrieben.</p>
          </>}
          en={<>
            <p><b>How to read the run.</b> Go to the line <K>double z = pow(b, e);</K> and then take one more step. A <em>second</em> box appears above that of <K>main</K>: this is the function <K>pow</K> with its own variables <K>b</K> and <K>e</K>, which were created as <em>copies</em> of <K>main</K>’s <K>b</K> and <K>e</K> (steps 1 and 2). From then on only <K>pow</K> works: the marker moves through the function, <K>b</K> becomes <K>0.5</K>, <K>e</K> becomes <K>2</K> (step 3). At <K>return</K> the box disappears, and the value <K>0.25</K> lands in <K>z</K> (steps 4 and 5).</p>
            <p>Note that the number in <K>z</K> appears only <em>after</em> the return: the assignment is the last part of the line. And until then <K>z</K> is “?”, since it was created but not yet written.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="kopien" title={<T de="2. Parameter sind Kopien" en="2. Parameters are copies" />}>
        <Box kind="lecture" src={<Src p="75" />} title={<T de="Gültigkeitsbereich der formalen Parameter" en="Scope of the formal parameters" />}>
          <T
            de={<>
              <p>Wichtig: Die formalen Parameter sind nur innerhalb der Funktionsdefinition deklariert und ausserhalb unsichtbar. Sie werden bei <em>jedem</em> Aufruf neu angelegt. Das nennt man <b>automatische Speicherdauer</b>. Eine Änderung der Werte der formalen Parameter hat <em>keine Wirkung</em> auf die Werte der Argumente des Aufrufs, weil die Aufrufargumente R-Werte sind.</p>
              <p>Im Beispiel 6.7 haben die Parameter von <K>pow</K> zufällig dieselben Namen wie die Variablen in <K>main</K>. Es sind trotzdem völlig getrennte Dinge: Der Wert von <K>b</K> in <K>main</K> bleibt von der Änderung des Parameters <K>b</K> in <K>pow</K> unberührt!</p>
            </>}
            en={<>
              <p>It is important to understand that the formal parameters are declared within the function definition only and are invisible outside. They are allocated for <em>each</em> call. This is called <b>automatic storage duration</b>. Changing the values of the formal parameters has <em>no effect</em> on the values of the arguments of the call, because call arguments are R-values.</p>
              <p>In Example 6.7 the parameters of <K>pow</K> happen to have the same names as those in <K>main</K>. They are nevertheless completely separate entities: the value of <K>b</K> in <K>main</K> remains unaffected by the modification of the parameter <K>b</K> in <K>pow</K>!</p>
            </>}
          />
        </Box>
        <Listing prog={P.scopeParams} label={tr('Beispiel 6.7: Ausgabe 0.25 2 -2', 'Example 6.7: output 0.25 2 -2')} />
        <T
          de={<p>Die Ausgabe zeigt es: <K>z</K> ist <K>0.25</K>, aber <K>b</K> ist immer noch <K>2</K> und <K>e</K> immer noch <K>-2</K>, obwohl <K>pow</K> «seine» <K>b</K> und <K>e</K> verändert hat (zu <K>0.5</K> und <K>2</K>). Das ist dasselbe Prinzip wie bei verschachtelten Blöcken mit gleichnamigen Variablen in der Lektion über Sichtbarkeit, nur dass hier zwei verschiedene Funktionen im Spiel sind.</p>}
          en={<p>The output shows it: <K>z</K> is <K>0.25</K>, but <K>b</K> is still <K>2</K> and <K>e</K> still <K>-2</K>, although <K>pow</K> changed “its” <K>b</K> and <K>e</K> (to <K>0.5</K> and <K>2</K>). It is the same principle as with nested blocks with variables of the same name in the lesson on visibility, only that here two different functions are involved.</p>}
        />
        <Box kind="misconception" title={<T de="«Wenn die Funktion b ändert, ändert sich auch mein b.»" en="“If the function changes b, my b changes too.”" />}>
          <T
            de={<>Nicht bei dem, was wir bisher können. Die Funktion arbeitet mit einer <em>Kopie</em>. Das ist meist ein Segen: Du kannst Parameter im Rumpf frei verändern (wie <K>e = -e;</K> oben), ohne dass der Aufrufer etwas merkt. Soll eine Funktion die Variable des Aufrufers wirklich ändern, braucht sie eine <b>Referenz</b>. Das lernen wir in einem späteren Kapitel.</>}
            en={<>Not with what we can do so far. The function works with a <em>copy</em>. This is mostly a blessing: you can freely change parameters in the body (like <K>e = -e;</K> above) without the caller noticing. If a function is really to change the caller’s variable, it needs a <b>reference</b>. We learn that in a later chapter.</>}
          />
        </Box>
        <Choice
          question={<T de={<>Was gibt <K>main</K> aus? <K>void f(int x) {'{ x = x + 1; }'}</K> und <K>int x = 5; f(x); std::cout &lt;&lt; x;</K></>} en={<>What does <K>main</K> print? <K>void f(int x) {'{ x = x + 1; }'}</K> and <K>int x = 5; f(x); std::cout &lt;&lt; x;</K></>} />}
          choices={[
            { text: <K>5</K>, correct: true, why: <T de={<>Richtig. Das <K>x</K> in <K>f</K> ist eine Kopie. Sie wird auf 6 erhöht und mit dem Ende von <K>f</K> weggeworfen. Das <K>x</K> in <K>main</K> bleibt 5.</>} en={<>Correct. The <K>x</K> in <K>f</K> is a copy. It is raised to 6 and thrown away at the end of <K>f</K>. The <K>x</K> in <K>main</K> stays 5.</>} /> },
            { text: <K>6</K>, why: <T de={<>Das würde eine Referenz brauchen (<K>int&amp; x</K>). Bei Wertübergabe wird nur der <em>Wert</em> 5 übergeben, nicht die Variable.</>} en={<>That would need a reference (<K>int&amp; x</K>). With pass by value only the <em>value</em> 5 is passed, not the variable.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="stapel" title={<T de="3. Wo die Parameter wohnen: der Aufrufstapel" en="3. Where the parameters live: the call stack" />}>
        <Box kind="lecture" src={<Src p="76–78" />} title={<T de="Technisches zur Wertübergabe (optional)" en="Technicalities of pass by value (optional)" />}>
          <T
            de={<>
              <p>Dieser Abschnitt erklärt auf technischem Niveau, wie die Wertübergabe, das Kopieren der Argumente in die Parameter, funktioniert. Ihn verstanden zu haben ist für die kommenden Themen nicht entscheidend, aber interessant, und es hilft, Phänomene wie den <b>Stapelüberlauf</b> (<span lang="en">stack overflow</span>) und Konzepte wie Referenzen und Rekursion zu verstehen.</p>
              <p>Wenn eine Funktion zu laufen beginnt, beginnt sie an einer Adresse auf ihrem <b>Stapel</b> (<span lang="en">stack</span>) im Speicher. Die Speicherbereiche der Funktionen liegen übereinander gestapelt. Die Funktion <K>main</K> selbst wird vom Betriebssystem aufgerufen und ist keine Ausnahme.</p>
              <p>Ab dieser Adresse reserviert die Funktion Platz für ihre Variablen (neben anderem, etwa der Rücksprungadresse des Aufrufers, so weiss eine Funktion, woher sie kam). Wird <K>pow</K> aufgerufen, wird ein neuer Bereich, ein <b>Stapelrahmen</b>, geöffnet. Darin werden Parameter angelegt und die Werte der Argumente dorthin kopiert. Auch die lokale Variable <K>r</K> braucht Platz. Am Ende von <K>pow</K>, vor der Rückkehr, haben <K>r</K>, <K>e</K> und <K>b</K> neue Werte (<K>0.25</K>, <K>2</K>, <K>0.5</K>), während <K>main</K>s <K>b</K> und <K>e</K> unverändert sind.</p>
              <p><K>return r;</K> liefert den Wert <K>0.25</K>, und der Kontext von <K>pow</K> wird aufgegeben. Die <em>Zuweisung</em> in <K>main</K> speichert den Wert dann in <K>z</K>. Der Speicher von <K>pow</K> ist wieder frei, zum Beispiel für den nächsten Aufruf. (Die Spuren des alten Aufrufs werden nicht unbedingt gelöscht.)</p>
            </>}
            en={<>
              <p>This section explains on a technical level how pass by value, i.e. the copying of arguments into the parameters, works. Having understood this is not vital for the topics to come, but it is interesting, and it helps to understand phenomena such as <b>stack overflow</b> and concepts such as references and recursion.</p>
              <p>When a function starts to run, it starts at an address on its so-called <b>stack</b> in memory. The memory areas of functions are stacked on top of each other. The function <K>main</K> itself is called by the operating system and is no exception.</p>
              <p>From this address the function reserves space for its variables (among other things, such as the return address of the caller; this is how a function knows where it came from). When <K>pow</K> is called, a new area, a <b>stack frame</b>, is opened. Space for the parameters is allocated there and the values of the arguments are copied into it. The local variable <K>r</K> needs space as well. At the end of <K>pow</K>, before returning, <K>r</K>, <K>e</K> and <K>b</K> have new values (<K>0.25</K>, <K>2</K>, <K>0.5</K>) while <K>main</K>’s <K>b</K> and <K>e</K> are unchanged.</p>
              <p><K>return r;</K> delivers the value <K>0.25</K>, and the context of <K>pow</K> is given up. The <em>assignment</em> in <K>main</K> then stores the value in <K>z</K>. The memory of <K>pow</K> is free again, for example for the next call. (The traces of the old call are not necessarily removed.)</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Das Bild dazu</b> hast du schon: Es ist der Kasten-Stapel im Ablauf oben. <K>main</K> liegt unten, die jeweils laufende Funktion oben und hervorgehoben. Mit jedem Aufruf kommt ein Kasten dazu, mit jeder Rückkehr verschwindet er, wie bei einem Stapel Teller, bei dem man nur den obersten nehmen kann. Dass jeder Aufruf <em>seinen eigenen</em> Kasten bekommt, ist der Grund, warum gleichnamige Variablen sich nicht stören.</p>
            <p>Mit zwei Ebenen wird der Stapel deutlicher. Hier ruft <K>sum_of_squares</K> zweimal <K>square</K> auf. Beachte, wie hoch der Stapel am höchsten Punkt wird (drei Kästen) und dass <K>square</K> beim zweiten Aufruf einen <em>neuen</em> Kasten bekommt, nicht den alten.</p>
          </>}
          en={<>
            <p><b>The picture for this</b> you already have: it is the stack of boxes in the run above. <K>main</K> is at the bottom, the running function on top and highlighted. With every call a box is added, with every return it disappears, like a pile of plates from which you can only take the top one. That every call gets <em>its own</em> box is the reason why variables of the same name do not disturb each other.</p>
            <p>With two levels the stack becomes clearer. Here <K>sum_of_squares</K> calls <K>square</K> twice. Note how high the stack gets at its highest point (three boxes) and that <K>square</K> gets a <em>new</em> box on its second call, not the old one.</p>
          </>}
        />
        <Tracer stack prog={P.nestedCalls} label={tr('Verschachtelte Aufrufe', 'Nested calls')} />
        <Box kind="tip" title={<T de="Was der Stapel für die Praxis bedeutet" en="What the stack means in practice" />}>
          <T
            de={<ul>
              <li><b>Lokale Variablen sind nach der Rückkehr weg.</b> Gib nie die Adresse einer lokalen Variablen weiter, in der Hoffnung, sie später zu lesen. Den Wert gibst du mit <K>return</K> zurück.</li>
              <li><b>Der Stapel ist begrenzt.</b> Ruft sich eine Funktion immer weiter selbst auf (Rekursion ohne Ende), wächst der Stapel, bis der Platz ausgeht: Stapelüberlauf, das Programm stürzt ab. Das sehen wir im Kapitel über Rekursion.</li>
              <li><b>Die Reihenfolge, in der Argumente ausgewertet werden, ist nicht festgelegt.</b> Schreibe nie Aufrufe wie <K>f(i++, i++)</K>, deren Ergebnis davon abhängt, welches Argument zuerst berechnet wird.</li>
            </ul>}
            en={<ul>
              <li><b>Local variables are gone after the return.</b> Never pass on the address of a local variable in the hope of reading it later. You give the value back with <K>return</K>.</li>
              <li><b>The stack is limited.</b> If a function keeps calling itself (recursion without end), the stack grows until it runs out of space: stack overflow, the program crashes. We see this in the chapter on recursion.</li>
              <li><b>The order in which arguments are evaluated is not specified.</b> Never write calls like <K>f(i++, i++)</K> whose result depends on which argument is computed first.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Aufruf: Argumente auswerten → Parameter mit Kopien initialisieren → Rumpf ausführen → <K>return</K> → der Wert ersetzt den Aufruf.</li>
              <li>Parameter und lokale Variablen gehören zu <em>diesem</em> Aufruf. Sie entstehen beim Aufruf und verschwinden bei der Rückkehr. Gleiche Namen in verschiedenen Funktionen sind verschiedene Variablen.</li>
              <li>Wertübergabe: Die Funktion arbeitet mit Kopien. Änderungen an Parametern bleiben in der Funktion.</li>
              <li>Jede aktive Funktion hat einen Stapelrahmen. Die Rahmen liegen übereinander; ein Aufruf legt einen oben auf, eine Rückkehr nimmt ihn weg.</li>
            </ul>}
            en={<ul>
              <li>Call: evaluate arguments → initialize parameters with copies → execute body → <K>return</K> → the value replaces the call.</li>
              <li>Parameters and local variables belong to <em>this</em> call. They come into being at the call and vanish at the return. The same names in different functions are different variables.</li>
              <li>Pass by value: the function works with copies. Changes to parameters stay in the function.</li>
              <li>Every active function has a stack frame. The frames lie on top of each other; a call puts one on top, a return removes it.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Was ist mit Funktionen, die nichts zurückgeben? Und was, wenn ein Ausführungspfad kein <K>return</K> erreicht? Ausserdem: Wie dokumentiert man, was eine Funktion verlangt und garantiert? (Skript S. 78–83)</p>}
          en={<p className="connections"><b>Next:</b> what about functions that return nothing? And what if an execution path reaches no <K>return</K>? Also: how do you document what a function demands and guarantees? (notes pp. 78–83)</p>}
        />
      </Section>
    </article>
  );
}
