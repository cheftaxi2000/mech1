import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { SignatureFigure } from '../viz/info/FunctionFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I4Funktion() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bis jetzt stand alles in <K>main</K>. Das wird schnell unübersichtlich, und was man zweimal braucht, schreibt man zweimal hin. Eine <em>Funktion</em> gibt einem Stück Code einen Namen, Eingaben und ein Ergebnis, ähnlich wie <M>{t`f(x)`}</M> in der Mathematik. Danach genügt der Name, um es zu benutzen.</p>}
        en={<p className="lede">Until now everything stood in <K>main</K>. That quickly becomes confusing, and whatever you need twice you write twice. A <em>function</em> gives a piece of code a name, inputs and a result, much like <M>{t`f(x)`}</M> in mathematics. Afterwards the name is all it takes to use it.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="warum" title={<T de="1. Warum Funktionen?" en="1. Why functions?" />}>
        <Box kind="lecture" src={<Src p="71" />} title={<T de="Funktionen strukturieren Programme" en="Functions structure programs" />}>
          <T
            de={<>
              <p>Funktionen kapseln Funktionalität, die häufig gebraucht wird (zum Beispiel das Berechnen von Potenzen), und machen sie leicht zugänglich. Funktionen strukturieren ein Programm, indem sie es in kleine Teilaufgaben zerlegen, von denen jede als Funktion umgesetzt wird. Das Programmieren mit Funktionen heisst auch <b>prozedurale Programmierung</b> (Prozedur ist ein anderes Wort für Funktion).</p>
              <p>Beispiel 6.1 berechnet die <M>n</M>-te Potenz einer Zahl: Ist <M>n</M> negativ, rechnet man mit <M p=",">{t`a^n = (1/a)^{-n}`}</M> sonst multipliziert man <M>n</M>-mal mit <M p=".">a</M></p>
              <p>Angenommen, du brauchst die Potenz an mehreren Stellen deines Programms. Ohne Funktion könntest du den Code kopieren und überall einfügen. Das hat Nachteile: Das Programm wird gross und schwer lesbar und enthält viel <b>Redundanz</b>. Redundanz ist fast immer ein schlechtes Zeichen: Einmal gemachte Fehler vervielfältigen sich, und jede Korrektur müsste an vielen Stellen passieren.</p>
            </>}
            en={<>
              <p>Functions encapsulate functionality that is frequently used (e.g. computing powers) and make it easily accessible. Functions structure a program by partitioning it into small sub-tasks, each of which is implemented as a function. Programming using functions is also known as <b>procedural programming</b> (procedure is an alternative word for function).</p>
              <p>Example 6.1 computes the <M>n</M>-th power of a number: if <M>n</M> is negative one calculates with <M p=",">{t`a^n = (1/a)^{-n}`}</M> otherwise one multiplies <M>n</M> times by <M p=".">a</M></p>
              <p>Now assume you want the power at various places in your program. Without a function you could copy and paste the code everywhere. This has disadvantages: the program becomes large and hard to read and contains a lot of <b>redundancy</b>. Redundancy is almost always a bad sign: errors once made propagate to many places, and every patch would have to be applied at many places.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.powInline} inputs={['2 -2\n', '1.5 2\n', '3 0\n']} label={tr('Beispiel 6.1 (ausgegeben wird result)', 'Example 6.1 (result is printed)')} />
        <T
          de={<p>Dieser Code ist genau das Stück, das man ungern kopiert. Im Skript gibt die letzte Zeile <K>pow(a,n)</K> aus statt <K>result</K>, und zwar nach dem Ändern von <K>a</K> und <K>n</K>. Hier steht <K>result</K>, denn das ist, was berechnet wurde.</p>}
          en={<p>This code is exactly the piece one does not want to copy. In the notes the last line prints <K>pow(a,n)</K> instead of <K>result</K>, and does so after <K>a</K> and <K>n</K> have been changed. Here it prints <K>result</K>, since that is what was computed.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="def" title={<T de="2. Eine Funktion definieren" en="2. Defining a function" />}>
        <Box kind="lecture" src={<Src p="72–73" />} title={<T de="Code 6.1 und die allgemeine Form" en="Code 6.1 and the general form" />}>
          <T
            de={<>
              <p>Code 6.1 zeigt, wie es besser geht: Die Potenz steht <em>einmal</em> in einer Funktion, und <K>main</K> ruft sie dreimal auf.</p>
            </>}
            en={<>
              <p>Code 6.1 shows how to do better: the power stands <em>once</em> in a function, and <K>main</K> calls it three times.</p>
            </>}
          />
        </Box>
        <Listing prog={P.powFn} label={tr('Code 6.1', 'Code 6.1')} />
        <Box kind="lecture" src={<Src p="72–73" />} title={<T de="Formal" en="Formally" />}>
          <T
            de={<>
              <p>Eine Funktion wird mit folgendem Konstrukt <b>deklariert und definiert</b>:</p>
              <Code code={'T fname (T1 pname1, T2 pname2, ..., Tn pnamen)\n    body'} />
              <p>Dabei ist <K>fname</K> der Name, unter dem die Funktion angesprochen und aufgerufen wird (hier <K>pow</K>). <K>T, T1, …, Tn</K> sind Typen (hier <K>double</K>, <K>double</K> und <K>int</K>). <K>T</K> ist der Typ der Funktion und bestimmt, welche Art von Daten sie zurückgeben kann. <K>pnamei</K> sind die <b>formalen Parameter</b>, über die man innerhalb der Funktion auf die Eingaben zugreift (hier <K>b</K> und <K>e</K>), und <K>Ti</K> sind deren Typen. Der <K>body</K> ist ein Anweisungsblock, der beim Aufruf ausgeführt wird.</p>
              <p>Funktionsdefinitionen stehen hintereinander ohne Trennzeichen (kein Semikolon) im Programm. Sie dürfen <em>nicht lokal</em> stehen: nicht in Blöcken, nicht in anderen Funktionen und nicht in Kontrollanweisungen.</p>
            </>}
            en={<>
              <p>A function is <b>declared and defined</b> with the following construct:</p>
              <Code code={'T fname (T1 pname1, T2 pname2, ..., Tn pnamen)\n    body'} />
              <p>Here <K>fname</K> is the name by which the function can be addressed and called (here <K>pow</K>). <K>T, T1, …, Tn</K> are types (here <K>double</K>, <K>double</K> and <K>int</K>). <K>T</K> is the type of the function and determines what kind of data can be returned. <K>pnamei</K> are the <b>formal parameters</b> by which the inputs are addressed inside the function (here <K>b</K> and <K>e</K>), and <K>Ti</K> are their types. The <K>body</K> is a statement block that is executed when the function is called.</p>
              <p>Function definitions can be written consecutively without a separator (no semicolon) in a program. They cannot occur <em>locally</em>: not within blocks, not within other functions and not within control statements.</p>
            </>}
          />
        </Box>
        <SignatureFigure />
        <T
          de={<>
            <p><b>Wie man die Kopfzeile liest.</b> Von links nach rechts: «Ich bin eine Funktion, die einen <K>double</K> liefert, heisse <K>pow</K> und erwarte zwei Eingaben: einen <K>double</K>, den ich <K>b</K> nenne, und einen <K>int</K>, den ich <K>e</K> nenne.» Die Parameternamen gelten <em>nur im Rumpf</em>. Sie sind Platzhalter für die Werte, die später beim Aufruf übergeben werden, so wie <M>x</M> in <M p=".">{t`f(x) = x^2`}</M></p>
            <p>Das Gegenstück zum Ergebnis ist die Anweisung <K>return</K>: <K>return result;</K> beendet die Funktion sofort und liefert den Wert von <K>result</K> an den Aufrufer.</p>
          </>}
          en={<>
            <p><b>How to read the header.</b> From left to right: “I am a function that delivers a <K>double</K>, am called <K>pow</K> and expect two inputs: a <K>double</K> that I call <K>b</K>, and an <K>int</K> that I call <K>e</K>.” The parameter names apply <em>only in the body</em>. They are placeholders for the values passed in later at the call, like <M>x</M> in <M p=".">{t`f(x) = x^2`}</M></p>
            <p>The counterpart of the result is the statement <K>return</K>: <K>return result;</K> ends the function at once and delivers the value of <K>result</K> to the caller.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="73" />} title={<T de="Drei nützliche Funktionen" en="Three useful functions" />}>
          <T
            de={<p>Beispiel 6.2: Das exklusive ODER <K>Xor</K> liefert <K>l != r</K>. Beispiel 6.3: Die <K>n</K>-te harmonische Zahl, mit der Rückwärtssumme berechnet. Beispiel 6.4: das Minimum zweier Zahlen. Die Kommentare vor jeder Funktion sagen, was sie voraussetzt und was sie liefert; dazu mehr in der Lektion über Vor- und Nachbedingungen.</p>}
            en={<p>Example 6.2: the exclusive OR <K>Xor</K> returns <K>l != r</K>. Example 6.3: the <K>n</K>-th harmonic number, computed with the backward sum. Example 6.4: the minimum of two numbers. The comments before each function say what it assumes and what it delivers; more on that in the lesson on pre- and postconditions.</p>}
          />
        </Box>
        <Listing prog={P.fnExamples} label={tr('Die Beispiele 6.2 bis 6.4 mit einem kleinen main', 'Examples 6.2 to 6.4 with a small main')} />
        <T
          de={<>
            <p>Zur Ausgabe: <K>Xor(true, false)</K> ist <K>1</K>, <K>Xor(true, true)</K> ist <K>0</K> (ein <K>bool</K> druckt als 1 oder 0). <K>Harmonic(4)</K> ist <M p=",">{t`1 + \tfrac12 + \tfrac13 + \tfrac14 \approx 2{,}08333`}</M> und <K>min(7, 3)</K> ist 3. Die Harmonic-Summe läuft rückwärts, von den kleinen Summanden zu den grossen, weil dabei weniger Rundungsfehler entstehen (siehe die Lektion über Fliesskommazahlen).</p>
          </>}
          en={<>
            <p>On the output: <K>Xor(true, false)</K> is <K>1</K>, <K>Xor(true, true)</K> is <K>0</K> (a <K>bool</K> prints as 1 or 0). <K>Harmonic(4)</K> is <M p=",">{t`1 + \tfrac12 + \tfrac13 + \tfrac14 \approx 2.08333`}</M> and <K>min(7, 3)</K> is 3. The harmonic sum runs backwards, from the small terms to the large ones, because that causes fewer rounding errors (see the lesson on floating point numbers).</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="aufruf" title={<T de="3. Eine Funktion aufrufen" en="3. Calling a function" />}>
        <Box kind="lecture" src={<Src p="73–74" />} title={<T de="Funktionsaufruf" en="Function call" />}>
          <T
            de={<>
              <p>So wird eine Funktion aufgerufen:</p>
              <Code code={'fname ( expression1, expression2, ..., expressionN )'} />
              <p>Alle Aufrufargumente müssen in die jeweiligen Typen der formalen Parameter umwandelbar sein. Der Funktionsaufruf ist ein <em>Ausdruck</em>, dessen Typ der Rückgabetyp der Funktion ist. Wert und Wirkung sind durch die Funktion <K>fname</K> definiert. Beispiel 6.5: <K>pow(a,n)</K> ist ein Ausdruck vom Typ <K>double</K>.</p>
              <p>Für die Typen, die wir bis jetzt kennen, sind die Argumente des Aufrufs R-Werte, und der Aufruf selbst ist ebenfalls ein R-Wert. Dieses Verhalten nennt man <b>Wertübergabe</b> (<span lang="en">pass by value</span>).</p>
            </>}
            en={<>
              <p>This is how a function is called:</p>
              <Code code={'fname ( expression1, expression2, ..., expressionN )'} />
              <p>All call arguments must be convertible to the respective formal parameter types. The function call is an <em>expression</em> whose type is the return type of the function. Value and effect are as defined by the function <K>fname</K>. Example 6.5: <K>pow(a,n)</K> is an expression of type <K>double</K>.</p>
              <p>For the types we know so far, the arguments of the call are R-values, and the call itself is an R-value as well. We call this behavior <b>pass by value</b>.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Was das für dich bedeutet.</b> Da der Aufruf ein Ausdruck ist, darfst du ihn überall hinschreiben, wo ein Wert stehen darf: in einer Ausgabe (<K>std::cout &lt;&lt; pow(2.0, 3)</K>), in einer Rechnung (<K>2 * pow(b, 2)</K>), als Argument eines anderen Aufrufs (<K>pow(pow(2.0, 2), 3)</K>) oder in einer Bedingung. Und weil die Argumente <em>Ausdrücke</em> sind, darfst du dort auch rechnen: <K>pow(b + 1, e - 1)</K>.</p>
            <p>Ein Aufruf kann auch einen Typ <em>umwandeln</em>: Für den Parameter <K>double b</K> darf man <K>2</K> übergeben. Es wird zu <K>2.0</K> umgewandelt, wie bei einer Zuweisung.</p>
          </>}
          en={<>
            <p><b>What this means for you.</b> Since the call is an expression, you may write it anywhere a value may stand: in an output (<K>std::cout &lt;&lt; pow(2.0, 3)</K>), in a calculation (<K>2 * pow(b, 2)</K>), as an argument of another call (<K>pow(pow(2.0, 2), 3)</K>) or in a condition. And because the arguments are <em>expressions</em>, you may calculate there too: <K>pow(b + 1, e - 1)</K>.</p>
            <p>A call can also <em>convert</em> a type: for the parameter <K>double b</K> one may pass <K>2</K>. It is converted to <K>2.0</K>, as in an assignment.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Typische Fehler beim Aufrufen" en="Typical mistakes when calling" />}>
          <T
            de={<ul>
              <li><b>Falsche Anzahl oder Reihenfolge der Argumente.</b> <K>pow(2, 3.0)</K> ist <em>nicht</em> dasselbe wie <K>pow(3.0, 2)</K>. Die Argumente werden der Reihe nach den Parametern zugeordnet, nicht nach Namen. Die Zahl der Argumente muss stimmen, sonst weist der Compiler den Aufruf ab.</li>
              <li><b>Das Ergebnis wegwerfen.</b> <K>pow(2.0, 3);</K> als eigene Anweisung ist erlaubt, tut aber nichts Sichtbares: Der Wert wird berechnet und verworfen. Speichere ihn (<K>double r = pow(2.0, 3);</K>) oder gib ihn aus.</li>
              <li><b>Verlustbehaftete Umwandlung.</b> Wird ein <K>double</K> an einen <K>int</K>-Parameter übergeben (<K>pow(2.0, 2.9)</K>), wird er auf 2 <em>abgeschnitten</em>, ohne Fehlermeldung. Achte darauf, welche Typen die Parameter haben.</li>
            </ul>}
            en={<ul>
              <li><b>Wrong number or order of arguments.</b> <K>pow(2, 3.0)</K> is <em>not</em> the same as <K>pow(3.0, 2)</K>. Arguments are matched to parameters in sequence, not by name. The number of arguments must be right, otherwise the compiler rejects the call.</li>
              <li><b>Throwing the result away.</b> <K>pow(2.0, 3);</K> as a statement of its own is allowed but does nothing visible: the value is computed and discarded. Store it (<K>double r = pow(2.0, 3);</K>) or print it.</li>
              <li><b>Lossy conversion.</b> If a <K>double</K> is passed to an <K>int</K> parameter (<K>pow(2.0, 2.9)</K>), it is <em>truncated</em> to 2 without any error message. Pay attention to the types of the parameters.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Welchen Typ und Wert hat der Ausdruck <K>min(7, 3) + 1</K> mit <K>int min(int a, int b)</K> aus Beispiel 6.4?</>} en={<>What type and value does the expression <K>min(7, 3) + 1</K> have, with <K>int min(int a, int b)</K> from Example 6.4?</>} />}
          choices={[
            { text: <T de={<><K>int</K>, Wert 4</>} en={<><K>int</K>, value 4</>} />, correct: true, why: <T de={<>Richtig: <K>min(7, 3)</K> ist ein Ausdruck vom Typ <K>int</K> mit dem Wert 3, und <K>3 + 1</K> ist 4. Der Aufruf verhält sich im Ausdruck wie eine Zahl.</>} en={<>Correct: <K>min(7, 3)</K> is an expression of type <K>int</K> with the value 3, and <K>3 + 1</K> is 4. The call behaves like a number within the expression.</>} /> },
            { text: <T de={<><K>int</K>, Wert 8</>} en={<><K>int</K>, value 8</>} />, why: <T de={<>8 wäre <K>max(7, 3) + 1</K>. <K>min</K> liefert den <em>kleineren</em> der beiden Werte.</>} en={<>8 would be <K>max(7, 3) + 1</K>. <K>min</K> delivers the <em>smaller</em> of the two values.</>} /> },
            { text: <T de="Es ist ein Fehler: Ein Aufruf darf nicht in einer Rechnung stehen." en="It is an error: a call may not appear in a calculation." />, why: <T de={<>Doch, der Aufruf ist ein gewöhnlicher Ausdruck (R-Wert) und darf überall stehen, wo ein Wert gebraucht wird.</>} en={<>It may: the call is an ordinary expression (R-value) and may stand wherever a value is needed.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Eine Funktion gibt einem Stück Code einen Namen, Eingaben (Parameter) und ein Ergebnis (<K>return</K>). Sie vermeidet Kopieren und damit Redundanz.</li>
              <li><K>T fname(T1 p1, …) {'{ … }'}</K>: Rückgabetyp, Name, Parameter mit Typen, Rumpf. Kein Semikolon, nicht schachtelbar.</li>
              <li>Der Aufruf <K>fname(e1, …)</K> ist ein Ausdruck mit dem Rückgabetyp. Die Argumente werden der Reihe nach zugeordnet und in die Parametertypen umgewandelt.</li>
              <li>Bei den bisher bekannten Typen werden die Argumente <em>kopiert</em> (Wertübergabe).</li>
            </ul>}
            en={<ul>
              <li>A function gives a piece of code a name, inputs (parameters) and a result (<K>return</K>). It avoids copying and thereby redundancy.</li>
              <li><K>T fname(T1 p1, …) {'{ … }'}</K>: return type, name, parameters with types, body. No semicolon, cannot be nested.</li>
              <li>The call <K>fname(e1, …)</K> is an expression with the return type. Arguments are matched in sequence and converted to the parameter types.</li>
              <li>For the types known so far the arguments are <em>copied</em> (pass by value).</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Was genau passiert im Speicher, wenn <K>main</K> die Funktion aufruft? Und warum ändert <K>b = 1.0/b;</K> in <K>pow</K> nichts an einem <K>b</K> in <K>main</K>? Das zeigt die nächste Lektion (Skript S. 74–78).</p>}
          en={<p className="connections"><b>Next:</b> what exactly happens in memory when <K>main</K> calls the function? And why does <K>b = 1.0/b;</K> in <K>pow</K> change nothing about a <K>b</K> in <K>main</K>? The next lesson shows it (notes pp. 74–78).</p>}
        />
      </Section>
    </article>
  );
}
