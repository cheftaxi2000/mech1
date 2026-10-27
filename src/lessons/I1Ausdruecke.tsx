import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';

export default function I1Ausdruecke() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Bisher steckte jede Zahl fest im Programmtext. Jetzt kommt die Eingabe, dann der Begriff, der den Rest der Vorlesung trägt: der <b>Ausdruck</b>, mit Typ, Wert und möglicher Nebenwirkung. Zum Schluss lernen wir, dem Compiler zu sagen, was sich nie ändern darf.</p>}
        en={<p className="lede">So far every number was fixed in the program text. Now comes input, then the concept that carries the rest of the course: the <b>expression</b>, with type, value and possible side effect. Finally we learn to tell the compiler what must never change.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="eingabe" title={<T de="1. Eingabe mit std::cin" en="1. Input with std::cin" />}>
        <Box kind="lecture" src={<Src p="25–26" />} title={<T de="Eingabe" en="Input" />}>
          <T
            de={<ul>
              <li>Ein fest einprogrammierter Wert (<K>int x = 2;</K>) ist unpraktisch: Wer das Programm startet, soll seine Eingabe während des Laufs machen können, ohne den Code zu ändern.</li>
              <li>Wie <K>std::cout &lt;&lt; x</K> den Inhalt von <K>x</K> ausgibt, so wartet <K>std::cin &gt;&gt; x</K> auf eine Eingabe in der Konsole und weist sie der Variablen <K>x</K> zu.</li>
              <li>Das Programm unten ist Code 2.1 mit anderen Variablennamen. Kommentare und Namen spielen für das übersetzte Programm keine Rolle: Die Programme sind äquivalent. Wie viele Variablen man einführt, dafür gibt es keine festen Regeln; schreibe so, dass es für Menschen am besten lesbar ist.</li>
            </ul>}
            en={<ul>
              <li>A hard-coded value (<K>int x = 2;</K>) is impractical: whoever starts the program should be able to give input while it runs, without changing the code.</li>
              <li>Just as <K>std::cout &lt;&lt; x</K> outputs the content of <K>x</K>, <K>std::cin &gt;&gt; x</K> waits for input in the console and assigns it to the variable <K>x</K>.</li>
              <li>The program below is Code 2.1 with different variable names. Comments and names play no role for the translated program: the programs are equivalent. There are no fixed rules about how many variables to introduce; write so that it is as readable as possible for humans.</li>
            </ul>}
          />
        </Box>
        <Tracer prog={P.power8Vars} inputs={['2\n', '3\n']} label={tr('Eingabe, drei Zwischenergebnisse', 'Input, three intermediate results')} />
        <T
          de={<p>Zwei Beobachtungen. Beim Schritt auf <K>std::cin &gt;&gt; x;</K> hält das echte Programm an und <em>wartet auf dich</em>; die Tabelle zeigt unmittelbar danach den eingegebenen Wert. Und anders als in Code 2.1 hat jedes Zwischenergebnis seine eigene Schachtel (<K>x_squared</K>, <K>x_to_the_four</K>): Man sieht die ganze Rechnung in der Tabelle, aber es werden mehr Schachteln belegt.</p>}
          en={<p>Two observations. At the step on <K>std::cin &gt;&gt; x;</K> the real program stops and <em>waits for you</em>; right afterwards the table shows the entered value. And unlike in Code 2.1 every intermediate result has its own box (<K>x_squared</K>, <K>x_to_the_four</K>): the whole computation is visible in the table, but more boxes are occupied.</p>}
        />
        <Tracer prog={P.sumProduct} inputs={['12 7\n', '3 4\n']} label={tr('Mehrere Eingaben hintereinander', 'Several inputs in a row')} />
        <T
          de={<p><K>std::cin &gt;&gt; a &gt;&gt; b</K> liest zwei Werte hintereinander. Eingaben werden an Leerzeichen und Zeilenumbrüchen getrennt, es ist also egal, ob du <K>12 7</K> in einer Zeile oder in zwei Zeilen tippst.</p>}
          en={<p><K>std::cin &gt;&gt; a &gt;&gt; b</K> reads two values in a row. Input is separated at spaces and line breaks, so it does not matter whether you type <K>12 7</K> on one line or on two lines.</p>}
        />
        <Box kind="tip" title={<T de="Vor der Eingabe sagen, was erwartet wird" en="Say what is expected before reading" />}>
          <T
            de={<p>Ein Programm, das schweigend auf Eingabe wartet, wirkt wie ein hängendes. Gib vor <K>std::cin</K> immer einen kurzen Text aus (<K>"Compute a^8 for a = ? "</K>) und lasse den Zeilenumbruch weg, damit die Eingabe hinter dem Text steht. Und prüfe beim Testen auch <em>unsinnige</em> Eingaben: Was passiert bei einem Buchstaben statt einer Zahl? Dann schlägt das Lesen fehl; die Details dazu folgen später.</p>}
            en={<p>A program that silently waits for input looks like one that hangs. Always print a short text before <K>std::cin</K> (<K>"Compute a^8 for a = ? "</K>) and omit the line break so that the input appears behind the text. And when testing, also try <em>nonsensical</em> input: what happens with a letter instead of a number? Then the read fails; the details come later.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ausdruecke" title={<T de="2. Ausdrücke: Typ, Wert, Nebenwirkung" en="2. Expressions: type, value, side effect" />}>
        <Box kind="lecture" src={<Src p="26–28" />} title={<T de="Ausdrücke, Operatoren, Ausdrucksanweisungen" en="Expressions, operators, expression statements" />}>
          <T
            de={<>
              <p>Ein <b>Ausdruck</b> stellt eine Berechnung dar. Er hat einen festen <b>Typ</b> (bekannt zur Übersetzungszeit), einen (zeitabhängigen!) <b>Wert</b> und möglicherweise eine <b>Wirkung</b>. Wert und Wirkung ergeben sich erst bei der Auswertung zur Laufzeit.</p>
              <ul>
                <li>Ausdrücke sind <b>primär</b> (eine Variable, ein Literal) oder <b>zusammengesetzt</b> (<K>x * 3</K>). Ein <b>Operator</b> verknüpft <b>Operanden</b> (Ausdrücke) zu einem neuen Ausdruck und legt Anzahl und Typen der Operanden fest: <b>unär</b> (ein Operand), <b>binär</b> (zwei).</li>
                <li>Derselbe Operator funktioniert für mehrere Typen (<K>+</K> für <K>int</K> und für <K>double</K>). Der Compiler prüft, ob der Operator zu den Typen passt: <K>3 % 2.5</K> ist ein Fehler, denn <K>%</K> ist für zwei <K>int</K> definiert, nicht für <K>int</K> und <K>double</K>.</li>
                <li>Wo ein Wert eines Typs verlangt ist, darf ein Ausdruck dieses Typs stehen. Will man einen Ausdruck nur auswerten, schreibt man ihn mit Semikolon als <b>Ausdrucksanweisung</b>: <K>x * x;</K> rechnet 4 aus und verwirft sie. Sinnvoll wird das bei Ausdrücken mit <b>Nebenwirkung</b>.</li>
                <li>Die Zuweisung <K>x = y</K> ist ein Ausdruck: Wirkung: <K>y</K> in <K>x</K> speichern; Wert und Typ: die der linken Seite. Man kann sie sogar ausgeben: <K>std::cout &lt;&lt; (x = y)</K> gibt <K>2</K> aus, und <K>x = (y = 3)</K> setzt beide auf 3. (Bitte nicht schreiben, das lädt Fehler ein.)</li>
                <li>Auch <K>&lt;&lt;</K> und <K>&gt;&gt;</K> sind binäre Operatoren mit Nebenwirkung: Ausgabe von <K>x</K> bzw. Einlesen in die Variable des rechten Operanden.</li>
              </ul>
            </>}
            en={<>
              <p>An <b>expression</b> represents a computation. It has a fixed <b>type</b> (known at compile time), a (time-dependent!) <b>value</b> and possibly an <b>effect</b>. Value and effect result only from evaluation at run time.</p>
              <ul>
                <li>Expressions are <b>primary</b> (a variable, a literal) or <b>composed</b> (<K>x * 3</K>). An <b>operator</b> combines <b>operands</b> (expressions) into a new expression and specifies the number and types of the operands: <b>unary</b> (one operand), <b>binary</b> (two).</li>
                <li>The same operator works for several types (<K>+</K> for <K>int</K> and for <K>double</K>). The compiler checks whether the operator fits the types: <K>3 % 2.5</K> is an error, because <K>%</K> is defined for two <K>int</K>s, not for <K>int</K> and <K>double</K>.</li>
                <li>Wherever a value of a type is asked for, an expression of that type may stand. If one only wants to evaluate an expression, one writes it with a semicolon as an <b>expression statement</b>: <K>x * x;</K> computes 4 and discards it. This becomes useful for expressions with a <b>side effect</b>.</li>
                <li>The assignment <K>x = y</K> is an expression: effect: store <K>y</K> in <K>x</K>; value and type: those of the left-hand side. One can even print it: <K>std::cout &lt;&lt; (x = y)</K> prints <K>2</K>, and <K>x = (y = 3)</K> sets both to 3. (Please do not write this, it invites bugs.)</li>
                <li><K>&lt;&lt;</K> and <K>&gt;&gt;</K> are binary operators with side effects too: output of <K>x</K>, and reading into the variable of the right operand, respectively.</li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<p>Der Gedanke dahinter: In der Mathematik hat ein Term einen Wert und sonst nichts. In C++ hat ein Ausdruck <b>drei Seiten</b>, und die dritte, die Nebenwirkung, ist das, was ein Programm überhaupt erst etwas <em>tun</em> lässt:</p>}
          en={<p>The thought behind it: in mathematics a term has a value and nothing else. In C++ an expression has <b>three sides</b>, and the third, the side effect, is what lets a program <em>do</em> anything at all:</p>}
        />
        <table className="plain exprs">
          <thead><tr><th>{tr('Ausdruck', 'Expression')}</th><th>{tr('Typ (Compiler)', 'type (compiler)')}</th><th>{tr('Wert (Laufzeit)', 'value (run time)')}</th><th>{tr('Nebenwirkung', 'side effect')}</th></tr></thead>
          <tbody>
            <tr><td><K>3 * 4</K></td><td><K>int</K></td><td><K>12</K></td><td>{tr('keine', 'none')}</td></tr>
            <tr><td><K>x + 1</K></td><td><K>int</K></td><td>{tr('abhängig vom Wert von', 'depends on the value of')} <K>x</K></td><td>{tr('keine', 'none')}</td></tr>
            <tr><td><K>x = 5</K></td><td><K>int</K></td><td><K>5</K></td><td>{tr(<>speichert 5 in <K>x</K></>, <>stores 5 in <K>x</K></>)}</td></tr>
            <tr><td><K>std::cout &lt;&lt; x</K></td><td>{tr('Ausgabestrom', 'output stream')}</td><td>{tr('der Strom selbst (darum lässt sich verketten)', 'the stream itself (that is why chaining works)')}</td><td>{tr(<>gibt <K>x</K> aus</>, <>prints <K>x</K></>)}</td></tr>
            <tr><td><K>std::cin &gt;&gt; x</K></td><td>{tr('Eingabestrom', 'input stream')}</td><td>{tr('der Strom selbst', 'the stream itself')}</td><td>{tr(<>liest in <K>x</K> ein</>, <>reads into <K>x</K></>)}</td></tr>
          </tbody>
        </table>
        <T
          de={<p>Dass <K>&lt;&lt;</K> den Strom als Wert zurückgibt, ist der Grund, warum <K>std::cout &lt;&lt; a &lt;&lt; b</K> funktioniert: Es wird wie <K>(std::cout &lt;&lt; a) &lt;&lt; b</K> gelesen, und der Klammerausdruck ist wieder der Strom.</p>}
          en={<p>That <K>&lt;&lt;</K> returns the stream as its value is why <K>std::cout &lt;&lt; a &lt;&lt; b</K> works: it is read as <K>(std::cout &lt;&lt; a) &lt;&lt; b</K>, and the parenthesized expression is the stream again.</p>}
        />
        <Listing prog={P.assignValue} label={tr('Die Zuweisung hat einen Wert', 'The assignment has a value')} />
        <Tracer prog={P.chainAssign} label={tr('x = (y = 3)', 'x = (y = 3)')} />
        <T
          de={<p>Zum Verfolgen: Der <em>innere</em> Ausdruck <K>y = 3</K> wird zuerst ausgewertet (Nebenwirkung: <K>y</K> wird 3), und sein Wert 3 wandert nach <K>x</K>. Beide Zuweisungen geschehen in einer einzigen Anweisung, deshalb zeigt die Tabelle sie im selben Schritt.</p>}
          en={<p>To follow it: the <em>inner</em> expression <K>y = 3</K> is evaluated first (side effect: <K>y</K> becomes 3), and its value 3 moves on to <K>x</K>. Both assignments happen in a single statement, which is why the table shows them in the same step.</p>}
        />
        <Predict
          prompt={<T de={<>Welche Ausgabe entsteht bei <K>int x; int y = 2; std::cout &lt;&lt; (x = y); std::cout &lt;&lt; x;</K>, und welchen Wert hat <K>x</K> vor der Ausgabe?</>} en={<>What is printed by <K>int x; int y = 2; std::cout &lt;&lt; (x = y); std::cout &lt;&lt; x;</K>, and what is the value of <K>x</K> before the output?</>} />}
          answer={<T
            de={<>Es erscheint <K>22</K>. Vor der Klammer ist <K>x</K> uninitialisiert; die Auswertung von <K>(x = y)</K> speichert 2 in <K>x</K> (Nebenwirkung) <em>und</em> liefert 2 an die Ausgabe (Wert). Danach gibt die zweite Anweisung das nun gespeicherte 2 aus.</>}
            en={<>It prints <K>22</K>. Before the parenthesis <K>x</K> is uninitialized; evaluating <K>(x = y)</K> stores 2 in <K>x</K> (side effect) <em>and</em> delivers 2 to the output (value). The second statement then prints the now stored 2.</>}
          />}
        />
        <Box kind="tip" title={<T de="Nebenwirkungen: Regeln für den Alltag" en="Side effects: everyday rules" />}>
          <T
            de={<ul>
              <li><b>Eine Zuweisung pro Anweisung.</b> <K>x = (y = 3)</K> funktioniert, aber wer es liest, muss mehr denken, und genau da schleichen sich Fehler ein.</li>
              <li><b>Verwechsle <K>=</K> nicht mit dem Vergleich.</b> Weil eine Zuweisung auch ein Ausdruck mit Wert ist, kann der Compiler bei einer späteren Bedingung <em>nicht</em> immer erkennen, dass du etwas anderes meintest. Ein Vergleich kommt in der nächsten Vorlesung (<K>==</K>).</li>
              <li><b>Ein Ausdruck ohne Wirkung als Anweisung</b> (<K>x * x;</K>) ist fast immer ein Denkfehler: Du hast etwas berechnet und nichts damit gemacht.</li>
            </ul>}
            en={<ul>
              <li><b>One assignment per statement.</b> <K>x = (y = 3)</K> works, but whoever reads it has to think more, and that is where bugs creep in.</li>
              <li><b>Do not confuse <K>=</K> with comparison.</b> Because an assignment is also an expression with a value, the compiler <em>cannot</em> always tell that you meant something else in a later condition. Comparison comes in the next lecture (<K>==</K>).</li>
              <li><b>An expression without effect as a statement</b> (<K>x * x;</K>) is almost always a mistake of thought: you computed something and did nothing with it.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Was ist die <em>Nebenwirkung</em> des Ausdrucks <K>std::cout &lt;&lt; 7</K>?</>} en={<>What is the <em>side effect</em> of the expression <K>std::cout &lt;&lt; 7</K>?</>} />}
          choices={[
            { text: <T de="Der Wert 7" en="The value 7" />, why: <T de="Das ist nicht der Wert des Ausdrucks. Der Wert ist der Ausgabestrom, und die 7 ist das, was dabei geschrieben wird." en="That is not the value of the expression. The value is the output stream, and the 7 is what gets written." /> },
            { text: <T de="Die 7 erscheint auf der Konsole" en="The 7 appears on the console" />, correct: true, why: <T de="Ja. Die Ausgabe ist eine Wirkung auf die Aussenwelt; sie ist nicht der Wert des Ausdrucks." en="Yes. The output is an effect on the outside world; it is not the value of the expression." /> },
            { text: <T de="Keine, es ist nur ein Ausdruck" en="None, it is only an expression" />, why: <T de="Doch: Gerade bei <<-Ausdrücken ist die Nebenwirkung der eigentliche Zweck." en="It has one: for <<-expressions the side effect is the actual purpose." /> },
          ]}
        />
        <Listing prog={P.expressionStatement} label={tr('Ausdrucksanweisung ohne Wirkung', 'Expression statement without effect')} />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="konstanten" title={<T de="3. Konstanten: Variablen hinter Glas" en="3. Constants: variables behind glass" />}>
        <Box kind="lecture" src={<Src p="28–29" fig="Fig. 2.1" />} title={<T de="Konstanten und die Const-Richtlinie" en="Constants and the const guideline" />}>
          <T
            de={<>
              <p>Variablen können ihren Wert ändern. Soll ein Wert garantiert gleich bleiben, etwa die Lichtgeschwindigkeit im Vakuum (299792458 m/s), nimmt man eine <b>Konstante</b>: eine Variable mit unveränderlichem Wert. Man schreibt <K>const</K> vor den Typ: <K>const int speed_of_light = 299792458;</K> Konstanten kann man lesen, nicht verändern. Wie Variablen hinter Glas: man darf hinschauen, nicht anfassen.</p>
              <p>Eine Zuweisung an eine Konstante ist ein Compilerfehler. Der Compiler ist unser Freund: Gib ihm möglichst viele Gelegenheiten, sich zu beschweren.</p>
              <p><b>Const-Richtlinie:</b> Überlege bei jeder Variablen, ob sie ihren Wert während der Laufzeit ändert. Wenn nicht, mache sie mit <K>const</K> zur Konstante. Ein solches Programm heisst <b>const-korrekt</b>.</p>
            </>}
            en={<>
              <p>Variables can change their value. If a value must be guaranteed to stay the same, for instance the speed of light in a vacuum (299792458 m/s), one uses a <b>constant</b>: a variable with an immutable value. One writes <K>const</K> in front of the type: <K>const int speed_of_light = 299792458;</K> Constants can be read, not altered. Like variables behind glass: you may look, not touch.</p>
              <p>An assignment to a constant is a compiler error. The compiler is our friend: give it as many opportunities as possible to complain.</p>
              <p><b>Const guideline:</b> for each variable think about whether it changes its value during the run time. If not, make it a constant with <K>const</K>. Such a program is called <b>const-correct</b>.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Der Gewinn ist ein <em>Fehler zur Übersetzungszeit statt eines falschen Ergebnisses zur Laufzeit</em>. Ein Kommentar «ändere das nie» prüft niemand; <K>const</K> prüft der Compiler bei jedem Übersetzen. Die Meldung sieht so aus (g++ 13):</p>}
          en={<p>The gain is an <em>error at compile time instead of a wrong result at run time</em>. A comment “never change this” is checked by nobody; <K>const</K> is checked by the compiler on every compilation. The message looks like this (g++ 13):</p>}
        />
        <pre className="plain-code"><code>{`const int speed_of_light = 299792458;
speed_of_light = 300000;   // error: assignment of read-only variable 'speed_of_light'`}</code></pre>
        <Listing prog={P.constOk} label={tr('Lesen ist erlaubt', 'Reading is allowed')} />
        <Box kind="tip" title={<T de="const als Standard" en="const as the default" />}>
          <T
            de={<p>Fange beim Schreiben jeder Variablen mit <K>const</K> an und streiche es nur, wenn der Compiler dich beim ersten Ändern erwischt, oder frage dich vorher ehrlich, ob der Wert sich ändert. Dazu kommt ein Nebeneffekt für das Lesen: Wo ein <K>const</K> steht, weiss der Leser sofort, dass der Wert über das ganze Programm derselbe bleibt.</p>}
            en={<p>Start every variable with <K>const</K> and drop it only when the compiler catches you at the first change, or ask yourself honestly beforehand whether the value changes. A side effect for reading: where a <K>const</K> appears, the reader knows at once that the value stays the same throughout the program.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="missverstaendnisse" title={<T de="4. Typische Missverständnisse" en="4. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de={<>«<K>std::cin &gt;&gt; x</K> gibt einen Wert zurück, den ich verwenden kann.»</>} en={<>“<K>std::cin &gt;&gt; x</K> returns a value I can use.”</>} />}>
          <T
            de={<>Der Wert des Ausdrucks ist der Eingabestrom, nicht die gelesene Zahl. Die gelesene Zahl liegt danach in <K>x</K>. Wer <K>y = std::cin &gt;&gt; x</K> schreibt, bekommt einen Compilerfehler oder Unsinn.</>}
            en={<>The value of the expression is the input stream, not the number read. The number read is in <K>x</K> afterwards. Whoever writes <K>y = std::cin &gt;&gt; x</K> gets a compiler error or nonsense.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Eine Konstante ist eine Variable, die sich nicht ändert, bis ich sie ändere.»" en="“A constant is a variable that does not change until I change it.”" />}>
          <T
            de={<>Nein: Eine Konstante lässt sich nach der Initialisierung gar nicht mehr ändern; der Compiler verweigert jeden Versuch. Sie muss deshalb <em>bei der Deklaration</em> einen Wert bekommen.</>}
            en={<>No: a constant cannot be changed at all after initialization; the compiler refuses every attempt. It therefore has to get a value <em>at the declaration</em>.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Ein Ausdruck ist dasselbe wie eine Anweisung.»" en="“An expression is the same as a statement.”" />}>
          <T
            de={<>Ein Ausdruck liefert einen Wert, eine Anweisung wird ausgeführt. Mit einem Semikolon dahinter wird aus einem Ausdruck eine Ausdrucksanweisung: Sein Wert wird verworfen, seine Nebenwirkung geschieht.</>}
            en={<>An expression delivers a value, a statement is executed. With a semicolon behind it an expression becomes an expression statement: its value is discarded, its side effect happens.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>std::cin &gt;&gt; x</K> liest in die Variable ein; mehrere Werte lassen sich verketten.</li>
              <li>Jeder Ausdruck hat einen <b>Typ</b> (Compiler), einen <b>Wert</b> (Laufzeit) und vielleicht eine <b>Nebenwirkung</b> (Zuweisung, Ein-/Ausgabe).</li>
              <li>Ein Ausdruck mit Semikolon ist eine Anweisung: Der Wert fällt weg, die Nebenwirkung bleibt.</li>
              <li><K>const</K> macht aus einer Variablen eine Konstante: Der Compiler verhindert jede spätere Änderung. Nimm <K>const</K>, sobald sich ein Wert nicht ändert.</li>
            </ul>}
            en={<ul>
              <li><K>std::cin &gt;&gt; x</K> reads into the variable; several values can be chained.</li>
              <li>Every expression has a <b>type</b> (compiler), a <b>value</b> (run time) and perhaps a <b>side effect</b> (assignment, input/output).</li>
              <li>An expression with a semicolon is a statement: the value is dropped, the side effect remains.</li>
              <li><K>const</K> turns a variable into a constant: the compiler prevents every later change. Use <K>const</K> whenever a value does not change.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Das nächste Kapitel des Skripts (infln02) schaut genauer auf Ausdrücke: Vorrang und Auswertungsreihenfolge, ganze Zahlen und ihre Grenzen, Kommazahlen, Wahrheitswerte.</p>}
          en={<p className="connections"><b>Next:</b> the next chapter of the notes (infln02) looks more closely at expressions: precedence and evaluation order, integers and their limits, floating point numbers, truth values.</p>}
        />
      </Section>
    </article>
  );
}
