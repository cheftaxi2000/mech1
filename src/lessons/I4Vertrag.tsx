import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I4Vertrag() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Funktion ist wie ein Vertrag: Wer sie aufruft, muss gewisse Dinge einhalten, und dafür verspricht sie ein Ergebnis. Diese Lektion zeigt zuerst zwei Randfälle (Funktionen ohne Ergebnis, Funktionen mit vergessenem <K>return</K>) und dann, wie man den Vertrag aufschreibt und vom Rechner überwachen lässt.</p>}
        en={<p className="lede">A function is like a contract: whoever calls it must keep to certain things, and in return it promises a result. This lesson first shows two edge cases (functions without a result, functions with a forgotten <K>return</K>) and then how to write the contract down and have the computer watch over it.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="void" title={<T de="1. void: Funktionen ohne Wert" en="1. void: functions without a value" />}>
        <Box kind="lecture" src={<Src p="78–79" />} title={<T de="Der Typ void" en="The type void" />}>
          <T
            de={<>
              <p>Manchmal brauchen wir Funktionen, die nur eine <em>Wirkung</em> haben, aber keinen Wert, also nichts zurückgeben. Dafür gibt es in C++ einen besonderen Typ: <K>void</K> ist ein fundamentaler Typ mit leerem Wertebereich.</p>
              <p><K>void</K>-Funktionen brauchen kein <K>return</K>. Die Ausführung endet, wenn das Ende des Rumpfs erreicht ist, oder bei <K>return;</K> (oder <K>return expression;</K>, wobei <K>expression</K> den Typ <K>void</K> haben muss).</p>
            </>}
            en={<>
              <p>Sometimes we need functions that only have an <em>effect</em> but no value, i.e. functions that do not return a thing. C++ features a special type for such cases: <K>void</K> is a fundamental type with an empty value range.</p>
              <p><K>void</K> functions do not require a <K>return</K>. The execution ends if the end of the function body is reached, or at <K>return;</K> (or <K>return expression;</K>, where <K>expression</K> needs to have type <K>void</K>).</p>
            </>}
          />
        </Box>
        <Listing prog={P.voidPair} label={tr('print_pair (Beispiel 6.8)', 'print_pair (Example 6.8)')} />
        <T
          de={<>
            <p>Der Aufruf <K>print_pair(3,4);</K> ist eine Anweisung, kein Wert: Man kann ihn nicht in <K>int x = print_pair(3,4);</K> oder <K>std::cout &lt;&lt; print_pair(3,4)</K> verwenden. Das wäre ein Compilerfehler, denn <K>void</K> hat keinen Wert, der gespeichert oder ausgegeben werden könnte.</p>
            <p>Faustregel: Eine Funktion, die <em>etwas berechnet</em>, liefert das Ergebnis mit <K>return</K> und gibt nichts aus. Eine Funktion, die <em>etwas tut</em> (ausgeben, speichern), ist <K>void</K>. Mischt man beides, ist die Funktion schwer wiederzuverwenden: Wer nur die Zahl will, bekommt unerwünschte Ausgaben.</p>
          </>}
          en={<>
            <p>The call <K>print_pair(3,4);</K> is a statement, not a value: you cannot use it in <K>int x = print_pair(3,4);</K> or <K>std::cout &lt;&lt; print_pair(3,4)</K>. That would be a compiler error, since <K>void</K> has no value that could be stored or printed.</p>
            <p>Rule of thumb: a function that <em>computes something</em> delivers the result with <K>return</K> and prints nothing. A function that <em>does something</em> (print, store) is <K>void</K>. If you mix both, the function is hard to reuse: whoever only wants the number gets unwanted output.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="return" title={<T de="2. Jeder Pfad braucht ein return" en="2. Every path needs a return" />}>
        <Box kind="lecture" src={<Src p="79–80" />} title={<T de="Undefiniertes Verhalten ohne return" en="Undefined behavior without return" />}>
          <T
            de={<>
              <p>Für Funktionen mit einem Rückgabetyp ungleich <K>void</K> gilt das nicht: Das Verhalten ist <b>undefiniert</b>, wenn das Ende des Rumpfs ohne <K>return</K> erreicht wird.</p>
              <Code code={'bool compare(float x, float y) {\n    float delta = x - y;\n    if (delta*delta < 0.001f) return true;\n}'} label={tr('Beispiel 6.9 (falsch)', 'Example 6.9 (wrong)')} />
              <p>Hier ist der Wert von <K>compare(10,20)</K> undefiniert. Es muss sichergestellt werden, dass in einer Funktion mit Nicht-<K>void</K>-Typ <em>alle</em> Ausführungspfade ein <K>return</K> erreichen.</p>
            </>}
            en={<>
              <p>The same is not true for functions with a return type other than <K>void</K>: the behavior is <b>undefined</b> if the end of the function body is reached without a <K>return</K>.</p>
              <Code code={'bool compare(float x, float y) {\n    float delta = x - y;\n    if (delta*delta < 0.001f) return true;\n}'} label={tr('Beispiel 6.9 (falsch)', 'Example 6.9 (wrong)')} />
              <p>Here the value of <K>compare(10,20)</K> is undefined. It must be made sure that in a function with a non-<K>void</K> type <em>all</em> execution paths reach a <K>return</K>.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was «undefiniert» heisst.</b> Der Compiler muss hier nichts Sinnvolles tun. In der Praxis liest das Programm einfach irgendeinen Rest, der gerade im Register steht: Es kann <K>true</K> liefern, <K>false</K>, oder bei anderer Optimierungsstufe etwas ganz anderes, und es kann bei jedem Lauf anders sein. Ein Test, der zufällig besteht, beweist also nichts. Gut ist, dass der Compiler dich <em>warnen</em> kann: Mit <K>g++ -Wall</K> meldet er <K>control reaches end of non-void function</K>. Schalte Warnungen immer ein und behandle diese wie einen Fehler.</p>
            <p>Die Reparatur ist einfach: Jeder Pfad muss ein <K>return</K> haben.</p>
          </>}
          en={<>
            <p><b>What “undefined” means.</b> The compiler need not do anything sensible here. In practice the program simply reads whatever remainder happens to stand in a register: it may deliver <K>true</K>, <K>false</K>, or, at another optimization level, something entirely different, and it may differ from run to run. A test that passes by chance therefore proves nothing. The good news is that the compiler can <em>warn</em> you: with <K>g++ -Wall</K> it reports <K>control reaches end of non-void function</K>. Always switch warnings on and treat this one like an error.</p>
            <p>The repair is simple: every path must have a <K>return</K>.</p>
          </>}
        />
        <Listing prog={P.compareFull} label={tr('Beispiel 6.10: alle Pfade erreichen ein return (Ausgabe für compare(10,20), compare(1.0f,1.01f))', 'Example 6.10: all paths reach a return (output for compare(10,20), compare(1.0f,1.01f))')} />
        <Box kind="lecture" src={<Src p="79–80" />} title={<T de="Noch einfacher" en="Even simpler" />}>
          <T
            de={<p>Übrigens: In Funktionen, die <K>bool</K> zurückgeben, kann man ein <K>if</K> oft vermeiden (Beispiel 6.11): <K>return delta*delta &lt; 0.001f;</K></p>}
            en={<p>By the way: in functions returning a <K>bool</K>, an if statement can often be avoided (Example 6.11): <K>return delta*delta &lt; 0.001f;</K></p>}
          />
        </Box>
        <Listing prog={P.compareShort} label={tr('Beispiel 6.11: dieselbe Ausgabe, kürzer', 'Example 6.11: the same output, shorter')} />
        <T
          de={<p>Der Vergleich <K>delta*delta &lt; 0.001f</K> <em>ist</em> bereits der Wahrheitswert, den wir zurückgeben wollen. Ein <K>if</K>, das <K>true</K> oder <K>false</K> abhängig von genau diesem Vergleich liefert, sagt dasselbe zweimal. Schreibst du <K>if (x) return true; else return false;</K>, kannst du fast immer <K>return x;</K> schreiben.</p>}
          en={<p>The comparison <K>delta*delta &lt; 0.001f</K> <em>is</em> already the truth value we want to return. An <K>if</K> that delivers <K>true</K> or <K>false</K> depending on exactly this comparison says the same thing twice. If you write <K>if (x) return true; else return false;</K>, you can almost always write <K>return x;</K>.</p>}
        />
        <Choice
          question={<T de={<>Welche Funktion erreicht <em>nicht</em> auf jedem Pfad ein <K>return</K>?</>} en={<>Which function does <em>not</em> reach a <K>return</K> on every path?</>} />}
          choices={[
            { text: <K>{'int sign(int x) { if (x > 0) return 1; if (x < 0) return -1; }'}</K>, correct: true, why: <T de={<>Richtig: Für <K>x == 0</K> trifft keine Bedingung zu, und der Rumpf endet ohne <K>return</K>. Der Compiler sieht nicht, dass die drei Fälle alle Zahlen abdecken, er warnt vorsichtshalber.</>} en={<>Correct: for <K>x == 0</K> no condition holds, and the body ends without a <K>return</K>. The compiler does not see that the three cases cover all numbers; it warns to be safe.</>} /> },
            { text: <K>{'int sign(int x) { if (x > 0) return 1; else if (x < 0) return -1; else return 0; }'}</K>, why: <T de={<>Hier gibt es einen abschliessenden <K>else</K>, und jeder Zweig hat ein <K>return</K>.</>} en={<>Here there is a final <K>else</K>, and every branch has a <K>return</K>.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vertrag" title={<T de="3. Vor- und Nachbedingungen" en="3. Pre- and postconditions" />}>
        <Box kind="lecture" src={<Src p="80–81" />} title={<T de="Was eine Funktion verlangt und garantiert" en="What a function demands and guarantees" />}>
          <T
            de={<>
              <p>Du hast dich vielleicht über die Kommentare vor den Funktionen gewundert: Das sind <b>Vor- und Nachbedingungen</b>. Sie beschreiben (so vollständig wie möglich), was eine Funktion tut. Sie dokumentieren die Funktion für Benutzer und Programmierer (das spätere Ich oder andere Leute). Sie machen Programme lesbarer: Man muss nicht verstehen, <em>wie</em> die Funktion arbeitet. Und sie machen Aussagen über die Korrektheit eines Programms möglich, vorausgesetzt, sie stimmen. Der Compiler ignoriert sie.</p>
              <p><b>Vorbedingungen</b> legen fest, was beim Aufruf gelten muss, und definieren den Definitionsbereich. Die Potenz funktioniert nur, wenn keine Division durch null vorkommt, also wenn der Exponent nicht negativ oder die Basis nicht null ist: <K>// PRE: e &gt;= 0 || b != 0.0</K> (Beispiel 6.12).</p>
              <p><b>Nachbedingungen</b> legen fest, was nach dem Aufruf garantiert gilt (sofern die Vorbedingung erfüllt war): Wert und Wirkung des Aufrufs. Hier: <K>// POST: return value is b^e</K>.</p>
              <p><b>Korrektheit:</b> Gilt die Vorbedingung beim Aufruf, dann gilt auch die Nachbedingung danach. Was passiert, wenn die Vorbedingung <em>nicht</em> gilt, wird nicht gesagt. Im Jargon des C++-Standards: Die Funktion hat <b>undefiniertes Verhalten</b>.</p>
            </>}
            en={<>
              <p>You might have wondered about the comments before the functions: these are <b>pre- and postconditions</b>. They characterize (as completely as possible) what a function does. They document the function for users and programmers (the future us or other people). They make programs more readable: we do not have to understand <em>how</em> the function works. And they make statements about the correctness of a program possible, provided they are correct. They are ignored by the compiler.</p>
              <p><b>Preconditions</b> specify what must hold when the function is called and define the domain of the function. The power function works only if no division by zero is encountered, i.e. if the exponent is not negative or the base is not zero: <K>// PRE: e &gt;= 0 || b != 0.0</K> (Example 6.12).</p>
              <p><b>Postconditions</b> specify what is guaranteed to hold after the call (provided the precondition was met): value and effect of the call. Here: <K>// POST: return value is b^e</K>.</p>
              <p><b>Correctness:</b> if the precondition holds when the function is called, then the postcondition holds after the call. Nothing is said about what happens if the precondition does <em>not</em> hold. In the jargon of the C++ standard: the function has <b>undefined behavior</b>.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Der Vertrag, Zeile für Zeile.</b> Denke an einen Handwerker: Die <em>Vorbedingung</em> ist, was du ihm liefern musst (Material, Zugang zur Baustelle). Die <em>Nachbedingung</em> ist, was er dir verspricht (die fertige Wand). Liefert du das Material nicht, ist er nicht schuld, wenn die Wand schief steht. Genauso: Ruft jemand <K>pow(0.0, -1)</K> auf, hat er die Vorbedingung verletzt, und die Funktion muss nichts Sinnvolles tun.</p>
            <p>Die Verträge dürfen sich nicht beliebig lasch oder streng wählen lassen. Das Skript fragt: Ist eine <em>starke</em> oder eine <em>schwache</em> Vorbedingung nützlicher? Eine <em>starke</em> oder <em>schwache</em> Nachbedingung?</p>
          </>}
          en={<>
            <p><b>The contract, line by line.</b> Think of a craftsperson: the <em>precondition</em> is what you must deliver (material, access to the site). The <em>postcondition</em> is what they promise you (the finished wall). If you do not deliver the material, it is not their fault when the wall stands crooked. Likewise: if someone calls <K>pow(0.0, -1)</K>, they have violated the precondition, and the function need not do anything sensible.</p>
            <p>The contracts cannot be chosen arbitrarily lax or strict. The notes ask: is a <em>strong</em> or a <em>weak</em> precondition more useful? A <em>strong</em> or <em>weak</em> postcondition?</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="81" />} title={<T de="Schwach oder stark?" en="Weak or strong?" />}>
          <T
            de={<>
              <p>Die Potenzfunktion zu implementieren wäre trivial, wenn man eine sehr <em>starke</em> Vorbedingung verlangte, etwa <M>{t`b = 0`}</M> und <M p=",">{t`e = 1`}</M> und immer 0 zurückgäbe. Die Funktion wäre korrekt, aber kaum nützlich. Vorbedingungen sollten also so <b>schwach</b> wie möglich sein, also den grössten möglichen Definitionsbereich erlauben.</p>
              <p>Ebenso trivial wäre es mit einer extrem <em>schwachen</em> Nachbedingung, etwa «gibt irgendeinen Wert zurück». Wieder korrekt, aber kaum nützlich. Nachbedingungen sollten so <b>stark</b> wie möglich sein, also das Ergebnis am genauesten beschreiben.</p>
            </>}
            en={<>
              <p>To implement the power function would be trivial if we required a very <em>strong</em> precondition, for example <M>{t`b = 0`}</M> and <M p=",">{t`e = 1`}</M> and always returned 0. The function would be correct but of little use. So preconditions should be as <b>weak</b> as possible, i.e. allow the largest possible domain.</p>
              <p>It would be just as trivial with an extremely <em>weak</em> postcondition, for example “returns any value”. Again correct, but of little use. Postconditions should be as <b>strong</b> as possible, i.e. give the most detailed information about the result.</p>
            </>}
          />
        </Box>
        <table className="plain">
          <thead><tr><th></th><th>{tr('Wenig verlangen / viel versprechen', 'Demand little / promise much')}</th><th>{tr('Viel verlangen / wenig versprechen', 'Demand much / promise little')}</th></tr></thead>
          <tbody>
            <tr><td>{tr('Vorbedingung', 'Precondition')}</td><td>{tr('schwach: nützlich', 'weak: useful')}</td><td>{tr('stark: kaum nützlich', 'strong: hardly useful')}</td></tr>
            <tr><td>{tr('Nachbedingung', 'Postcondition')}</td><td>{tr('stark: nützlich', 'strong: useful')}</td><td>{tr('schwach: kaum nützlich', 'weak: hardly useful')}</td></tr>
          </tbody>
        </table>
        <T
          de={<p>Merke dir die Eselsbrücke: Eine gute Funktion <em>verlangt wenig</em> und <em>verspricht viel</em>.</p>}
          en={<p>The mnemonic: a good function <em>demands little</em> and <em>promises much</em>.</p>}
        />
        <Box kind="lecture" src={<Src p="81" />} title={<T de="Die Grenzen der Korrektheit" en="The limits of correctness" />}>
          <T
            de={<p>Ein genauer Blick auf <K>pow</K> zeigt die Grenzen dieses Ansatzes: Gilt die Vorbedingung (keine Division durch null), sollte die Funktion theoretisch ein korrektes Ergebnis liefern, tut es in Wirklichkeit aber nicht, denn es können <b>Überläufe</b> (bei grossem <K>e</K> oder <K>b</K>) oder <b>ungenaue Darstellungen</b> der Zahlen auftreten. Es wäre unerträglich kompliziert, Vor- und Nachbedingungen plattformunabhängig so anzugeben, dass sie alle Grenzen des Rechnens genau berücksichtigen. Wir machen einen Kompromiss zwischen formaler Korrektheit und lockerer Praxis und wählen mathematische Bedingungen. Es gibt eine Grauzone: Wende gesunden Menschenverstand an. Übertreibe nicht, aber werde auch nicht nachlässig.</p>}
            en={<p>A close look at <K>pow</K> reveals the limits of this approach: provided the precondition holds (no division by zero), the function should in theory return a correct result, but in reality it does not, because <b>overflows</b> (for large <K>e</K> or <K>b</K>) or <b>inaccurate representation</b> of the numbers can occur. It would be prohibitively complicated to specify pre- and postconditions in a platform-independent way such that they take precisely into account all limits of computation. We make a compromise between formal correctness and lax practice and choose mathematical conditions. There is a gray area: apply common sense. Do not over-engineer, but do not become careless either.</p>}
          />
        </Box>
        <Listing prog={P.powLimits} label={tr('Wo die Mathematik endet: pow(10.0, 400), pow(10.0, -400), pow(10.0, 15), pow(1.1, 10)', 'Where the mathematics ends: pow(10.0, 400), pow(10.0, -400), pow(10.0, 15), pow(1.1, 10)')} />
        <T
          de={<p>Die Vorbedingung ist erfüllt, und doch stimmt die Nachbedingung «Rückgabe ist <M>{t`b^e`}</M>» nicht: <K>10</K> hoch <K>400</K> ist zu gross für einen <K>double</K> (<K>inf</K>, «unendlich»), <K>10</K> hoch <K>-400</K> ist zu klein (<K>0</K>). Und <K>1e+15</K> ist die Schreibweise von <M>{t`10^{15}`}</M> bei sechs Stellen. Das <K>2.59374</K> ist auf sechs Stellen gerundet (<M p=").">{t`1{,}1^{10} = 2{,}5937424601`}</M> Das ist die Grauzone, von der das Skript spricht.</p>}
          en={<p>The precondition is met, and yet the postcondition “the return value is <M>{t`b^e`}</M>” does not hold: <K>10</K> to the <K>400</K> is too large for a <K>double</K> (<K>inf</K>, “infinity”), <K>10</K> to the <K>-400</K> is too small (<K>0</K>). And <K>1e+15</K> is how <M>{t`10^{15}`}</M> is written with six digits. The <K>2.59374</K> is rounded to six digits (<M p=").">{t`1.1^{10} = 2.5937424601`}</M> This is the gray area the notes talk about.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="assert" title={<T de="4. Der Rechner prüft mit: assert" en="4. The computer checks along: assert" />}>
        <Box kind="lecture" src={<Src p="81–83" />} title={<T de="Assertions" en="Assertions" />}>
          <T
            de={<>
              <p>Bis hierher sind Vor- und Nachbedingungen nur Kommentare: Der Compiler ignoriert sie, sie dokumentieren nur. Können wir erzwingen, dass das Programm nicht weiterläuft, wenn sie verletzt sind? Ja, mit <b>Assertions</b> (Beispiel 6.14).</p>
              <Code code={'#include <cassert>\n...\nassert ( expression )'} />
              <p>Dafür muss man den Header <K>cassert</K> aus der Standardbibliothek einbinden. <K>expression</K> ist ein in <K>bool</K> umwandelbarer Ausdruck. Wird er zu <K>true</K> ausgewertet, hat <K>assert</K> keine Wirkung. Wird er zu <K>false</K> ausgewertet, wird das Programm mit einer Fehlermeldung angehalten.</p>
              <p>Assertions können manchmal auch Nachbedingungen prüfen: Ist das Ergebnis einer komplizierten Rechnung leicht zu prüfen, lohnt sich ein <K>assert</K> (Beispiel 6.15, die grössere Nullstelle eines Polynoms: Einsetzen ergibt 0).</p>
            </>}
            en={<>
              <p>Up to this point pre- and postconditions are just comments: the compiler ignores them, they only document. Can we make sure that the program does not continue when they are violated? Yes, using <b>assertions</b> (Example 6.14).</p>
              <Code code={'#include <cassert>\n...\nassert ( expression )'} />
              <p>For this you need to include the header <K>cassert</K> from the standard library. <K>expression</K> is an expression that can be converted to <K>bool</K>. If it evaluates to <K>true</K>, <K>assert</K> has no effect. If it evaluates to <K>false</K>, the program is halted with an error message.</p>
              <p>Assertions can sometimes also check postconditions: if the result of a complicated computation is easy to check, an <K>assert</K> is worthwhile (Example 6.15, the larger root of a polynomial: plugging in gives 0).</p>
            </>}
          />
        </Box>
        <Tracer prog={P.assertPow} label={tr('Beispiel 6.14: die Vorbedingung wird verletzt', 'Example 6.14: the precondition is violated')} />
        <T
          de={<>
            <p>Im letzten Schritt siehst du, was passiert: Das Programm bricht an der <K>assert</K>-Zeile ab und nennt den verletzten Ausdruck. Die Meldung des echten Programms lautet <K>Assertion `e &gt;= 0 || b != 0.0' failed.</K>, ergänzt um Dateiname und Zeile. Der Fehler wird dort gemeldet, wo er <em>entdeckt</em> wird, nämlich am Anfang der Funktion, und nicht erst irgendwo später, wo aus der verbotenen Division durch null ein unerklärliches <K>inf</K> geworden ist.</p>
            <Code code={'// PRE: e >= 0 || b != 0.0\n// POST: return value is b^e'} />
          </>}
          en={<>
            <p>In the last step you see what happens: the program stops at the <K>assert</K> line and names the violated expression. The message of the real program reads <K>Assertion `e &gt;= 0 || b != 0.0' failed.</K>, supplemented by file name and line. The error is reported where it is <em>discovered</em>, at the beginning of the function, and not somewhere later where the forbidden division by zero has turned into an inexplicable <K>inf</K>.</p>
            <Code code={'// PRE: e >= 0 || b != 0.0\n// POST: return value is b^e'} />
          </>}
        />
        <Box kind="lecture" src={<Src p="82–83" />} title={<T de="Empfehlung" en="Recommendation" />}>
          <T
            de={<p>Assertions sind ein sehr mächtiges Werkzeug zur Fehlervermeidung bei der Entwicklung, wenn sie konsequent und häufig benutzt werden. Setze sie überall ein, wo es sinnvoll möglich ist, um zu prüfen, dass dein Programm auf Kurs ist und du keine falschen Annahmen gemacht hast. Der Laufzeitaufwand ist vernachlässigbar. Zudem kann man den Compiler anweisen, Assertions zu ignorieren, falls unbedingt nötig. Assertions sind ein grobes Werkzeug: Schlägt eine fehl, wird das Programm unwiederbringlich angehalten. C++ bietet elegantere Mittel (Ausnahmen, <span lang="en">exceptions</span>), die für diesen Kurs zu weit gehen.</p>}
            en={<p>Assertions are a very powerful tool for the avoidance of errors during the development of a program, if used consistently and frequently. Use them wherever reasonably possible to check that your program is on track and that you did not make wrong assumptions. The runtime overhead is negligible. Moreover, the compiler can be instructed to ignore assertions, if absolutely necessary. Assertions are a rough tool: if one fails, the program is halted in an unrecoverable way. C++ provides more elegant means (exceptions), which go too far for this course.</p>}
          />
        </Box>
        <Box kind="tip" title={<T de="assert richtig einsetzen" en="Using assert correctly" />}>
          <T
            de={<ul>
              <li><b>assert prüft Programmierfehler, keine Benutzereingaben.</b> Ein Benutzer, der <K>-5</K> tippt, ist kein Bug: Prüfe das mit <K>if</K> und gib eine Meldung aus. Ein <K>assert</K> ist für Dinge, die <em>nie</em> passieren dürfen, wenn der Code richtig ist.</li>
              <li><b>Nie Wichtiges in ein assert schreiben.</b> Mit <K>g++ -DNDEBUG</K> werden alle <K>assert</K> entfernt, auch ihre Ausdrücke. Ein <K>assert(++i &gt; 0)</K> würde dann das <K>++i</K> verlieren. (Mit <K>-DNDEBUG</K> gibt das Beispiel oben statt eines Abbruchs still <K>inf</K> aus. Das ist die «Kosten der Sicherheit».)</li>
              <li><b>Schreibe die Vorbedingung zweimal:</b> als Kommentar für Menschen (<K>// PRE: …</K>) und als <K>assert</K> für den Rechner. Beide sollen dasselbe sagen.</li>
            </ul>}
            en={<ul>
              <li><b>assert checks programming errors, not user input.</b> A user who types <K>-5</K> is not a bug: check that with <K>if</K> and print a message. An <K>assert</K> is for things that must <em>never</em> happen if the code is right.</li>
              <li><b>Never put anything important in an assert.</b> With <K>g++ -DNDEBUG</K> all <K>assert</K>s are removed, including their expressions. An <K>assert(++i &gt; 0)</K> would then lose the <K>++i</K>. (With <K>-DNDEBUG</K> the example above prints <K>inf</K> silently instead of aborting. That is the “price of safety”.)</li>
              <li><b>Write the precondition twice:</b> as a comment for humans (<K>// PRE: …</K>) and as an <K>assert</K> for the computer. Both should say the same.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>void</K>-Funktionen haben nur eine Wirkung. Funktionen mit Rückgabetyp müssen auf <em>jedem</em> Pfad ein <K>return</K> erreichen, sonst ist das Verhalten undefiniert.</li>
              <li>Vorbedingung: was beim Aufruf gelten muss. Nachbedingung: was danach garantiert ist. Gute Verträge verlangen wenig (schwache Vorbedingung) und versprechen viel (starke Nachbedingung).</li>
              <li>Bei verletzter Vorbedingung ist das Verhalten undefiniert. Die Zahlen des Rechners haben Grenzen (Überlauf, Rundung), die die mathematischen Verträge nicht abbilden.</li>
              <li><K>assert(…)</K> prüft Bedingungen zur Laufzeit und hält das Programm bei Verstoss an. Mit <K>-DNDEBUG</K> sind sie weg.</li>
            </ul>}
            en={<ul>
              <li><K>void</K> functions only have an effect. Functions with a return type must reach a <K>return</K> on <em>every</em> path, otherwise the behavior is undefined.</li>
              <li>Precondition: what must hold at the call. Postcondition: what is guaranteed afterwards. Good contracts demand little (weak precondition) and promise much (strong postcondition).</li>
              <li>If a precondition is violated, behavior is undefined. The computer’s numbers have limits (overflow, rounding) that mathematical contracts do not capture.</li>
              <li><K>assert(…)</K> checks conditions at run time and halts the program on a violation. With <K>-DNDEBUG</K> they are gone.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Wie baut man ein grösseres Programm aus Funktionen auf, ohne den Überblick zu verlieren? Mit schrittweiser Verfeinerung, am Beispiel «Überlappen zwei Rechtecke?» (Skript S. 83–89).</p>}
          en={<p className="connections"><b>Next:</b> how do you build a larger program from functions without losing track? With stepwise refinement, using the example “do two rectangles overlap?” (notes pp. 83–89).</p>}
        />
      </Section>
    </article>
  );
}
