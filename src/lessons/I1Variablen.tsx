import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing, Tracer } from '../viz/info/Tracer';
import { VarStrip } from '../viz/info/VarStrip';

const t = String.raw;

export default function I1Variablen() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Variable ist das wichtigste Werkzeug, mit dem ein Programm sich etwas merkt. Wer genau weiss, was ein Name, ein Typ, ein Wert und eine Adresse sind und in welcher Reihenfolge der Rechner eine Zuweisung auswertet, hat die Hälfte aller Anfängerfehler schon erledigt.</p>}
        en={<p className="lede">A variable is the most important tool by which a program remembers something. Whoever knows exactly what a name, a type, a value and an address are, and in which order the computer evaluates an assignment, has already dealt with half of all beginner errors.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="schachtel" title={<T de="1. Eine Variable ist eine Schachtel mit vier Eigenschaften" en="1. A variable is a box with four properties" />}>
        <Box kind="lecture" src={<Src p="21" />} title={<T de="Deklaration" en="Declaration" />}>
          <T
            de={<ul>
              <li>Eine Variable ist eine <b>Schachtel</b>, in der ein Wert liegt. Man erzeugt sie (<b>deklariert</b> sie), indem man zuerst den <b>Typ</b> und dann den <b>Namen</b> schreibt: <K>int x</K>.</li>
              <li>Der Typ legt fest, welche Werte möglich sind und welche Operationen zur Verfügung stehen: <K>int</K> für ganze Zahlen (<M p="),">{t`\mathbb{Z}`}</M> <K>unsigned int</K> (kurz <K>unsigned</K>) für natürliche Zahlen (<M p="),">{t`\mathbb{N}`}</M> <K>float</K> und <K>double</K> für reelle Zahlen (<M p=").">{t`\mathbb{R}`}</M></li>
              <li>Der Name ist die eindeutige Kennung der Schachtel: Buchstaben, Ziffern und Unterstrich, meist mit einem (kleinen) Buchstaben beginnend.</li>
              <li>Jede Variable hat ausserdem einen aktuellen <b>Wert</b> und eine <b>Adresse</b>, die der Compiler bestimmt. Anfangs ist der Wert <b>undefiniert</b>: Die Variable ist <b>nicht initialisiert</b>.</li>
              <li>Mehrere Variablen desselben Typs: <K>int x, y;</K></li>
            </ul>}
            en={<ul>
              <li>A variable is a <b>box</b> in which a value lies. You create it (<b>declare</b> it) by writing first the <b>type</b> and then the <b>name</b>: <K>int x</K>.</li>
              <li>The type determines which values are possible and which operations are available: <K>int</K> for integers (<M p="),">{t`\mathbb{Z}`}</M> <K>unsigned int</K> (short <K>unsigned</K>) for natural numbers (<M p="),">{t`\mathbb{N}`}</M> <K>float</K> and <K>double</K> for real numbers (<M p=").">{t`\mathbb{R}`}</M></li>
              <li>The name is the unique identifier of the box: letters, digits and underscore, usually starting with a (lower-case) letter.</li>
              <li>Every variable also has a current <b>value</b> and an <b>address</b> that the compiler determines. Initially the value is <b>undefined</b>: the variable is <b>uninitialized</b>.</li>
              <li>Several variables of the same type: <K>int x, y;</K></li>
            </ul>}
          />
        </Box>
        <VarStrip vars={[{ name: 'x', type: 'int', value: '2', addr: 1000 }, { name: 'y', type: 'int', value: '4', addr: 1004 }]} />
        <T
          de={<p>Aus dem Schachtel-Rechner kennst du das schon: Dort war die Variable <M>a</M> einfach die Box mit der Adresse 9. Der Name ist für <em>dich</em>, der Rechner kennt nur die Adresse. Der Compiler übersetzt jeden Namen in eine Adresse. Ein <K>int</K> belegt auf üblichen Rechnern vier Speicherzellen (Bytes), deshalb liegen die Adressen im Bild vier auseinander.</p>}
          en={<p>You already know this from the box computer: there the variable <M>a</M> was simply the box with address 9. The name is for <em>you</em>, the computer knows only the address. The compiler translates every name into an address. An <K>int</K> occupies four memory cells (bytes) on common computers, which is why the addresses in the figure are four apart.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="zuweisung" title={<T de="2. Deklaration, Zuweisung, Initialisierung" en="2. Declaration, assignment, initialization" />}>
        <Box kind="lecture" src={<Src p="22" />} title={<T de="Zuweisung und Initialisierung" en="Assignment and initialization" />}>
          <T
            de={<>
              <p>Mit einer <b>Zuweisung</b> legt man einen Wert in die Schachtel: <K>x = 2</K> weist der Variablen <K>x</K> den Wert 2 zu. Um eine uninitialisierte Variable zu vermeiden, <b>initialisiert</b> man sie schon bei der Deklaration: <K>int x = 2;</K></p>
              <p>Rechts darf auch ein Ausdruck stehen: Zuerst wird die rechte Seite <b>ausgewertet</b>, dann wird ihr Ergebnis der Variablen auf der linken Seite zugewiesen. <K>x = 3 * 4</K> weist 12 zu.</p>
              <p>Den Wert einer Variablen <b>liest</b> man, indem man einfach ihren Namen hinschreibt.</p>
            </>}
            en={<>
              <p>With an <b>assignment</b> one stores a value in the box: <K>x = 2</K> assigns the value 2 to the variable <K>x</K>. To avoid an uninitialized variable one <b>initializes</b> it right at the declaration: <K>int x = 2;</K></p>
              <p>An expression may stand on the right: first the right-hand side is <b>evaluated</b>, then its result is assigned to the variable on the left. <K>x = 3 * 4</K> assigns 12.</p>
              <p>The value of a variable is <b>read</b> by simply writing its name.</p>
            </>}
          />
        </Box>
        <Tracer prog={P.declAssign} label={tr('Deklaration und Zuweisung', 'Declaration and assignment')} />
        <T
          de={<p>Achte auf die Spalte <em>Wert</em> in der Tabelle. Nach <K>int x;</K> steht dort ein Fragezeichen: Die Schachtel existiert, ihr Inhalt ist nicht festgelegt. Erst <K>x = 2;</K> füllt sie. Die nächste Zuweisung <em>überschreibt</em> den alten Wert; er ist danach weg.</p>}
          en={<p>Watch the column <em>Value</em> in the table. After <K>int x;</K> there is a question mark: the box exists, its content is not defined. Only <K>x = 2;</K> fills it. The next assignment <em>overwrites</em> the old value; it is gone afterwards.</p>}
        />
        <Listing prog={P.varsRead} label={tr('Lesen einer Variablen', 'Reading a variable')} />
        <T
          de={<p>In <K>int y = x + 2;</K> wird zuerst <K>x</K> gelesen (also 2 eingesetzt), dann <K>2 + 2</K> berechnet, und erst am Ende das Ergebnis in <K>y</K> abgelegt. Diese Reihenfolge, <b>erst rechts auswerten, dann links speichern</b>, ist die wichtigste Regel dieses Abschnitts.</p>}
          en={<p>In <K>int y = x + 2;</K> first <K>x</K> is read (so 2 is substituted), then <K>2 + 2</K> is computed, and only at the end the result is stored in <K>y</K>. This order, <b>evaluate on the right first, then store on the left</b>, is the most important rule of this section.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="gleich" title={<T de="3. Zuweisung ist nicht Gleichheit" en="3. Assignment is not equality" />}>
        <Box kind="lecture" src={<Src p="23" />} title={<T de="Achtung, Falle!" en="Attention, trap!" />}>
          <T
            de={<p>Der Zuweisungsoperator <K>=</K> von C++ entspricht dem Zuweisungsoperator (<M p=")">{t`:=`}</M> der Mathematik, <b>nicht</b> dem Vergleichsoperator <M p=".">=</M> In C++ ist gültig, <K>x = 2;</K> und danach <K>x = 3;</K> zu schreiben: Eine Variable kann (und wird meistens) ihren Wert <b>über die Zeit</b> ändern. Sogar <K>x = x + 1;</K> ist sinnvoll: Der Wert von <K>x</K> wird gelesen (2), um die rechte Seite auszuwerten (3), und dann wieder in <K>x</K> geschrieben. In der Mathematik ergibt <M>{t`x = x + 1`}</M> nie einen Sinn.</p>}
            en={<p>The assignment operator <K>=</K> of C++ corresponds to the assignment operator (<M p=")">{t`:=`}</M> of mathematics, <b>not</b> to the comparison operator <M p=".">=</M> In C++ it is valid to write <K>x = 2;</K> and afterwards <K>x = 3;</K>: a variable can (and most likely will) change its value <b>over time</b>. Even <K>x = x + 1;</K> makes sense: the value of <K>x</K> is read (2) to evaluate the right-hand side (3), and then written back into <K>x</K>. In mathematics <M>{t`x = x + 1`}</M> never makes sense.</p>}
          />
        </Box>
        <Tracer prog={P.incr} label={tr('x = x + 1', 'x = x + 1')} />
        <T
          de={<p>Lies <K>x = x + 1</K> deshalb nie als Gleichung, sondern als Befehl: «<em>Nimm den Wert von <K>x</K>, addiere 1, lege das Ergebnis in <K>x</K>.</em>» Ein <K>x</K> steht dabei zweimal da, aber in zwei verschiedenen Rollen: rechts bedeutet es «den Wert in der Schachtel», links «die Schachtel selbst».</p>}
          en={<p>So never read <K>x = x + 1</K> as an equation but as a command: “<em>take the value of <K>x</K>, add 1, put the result into <K>x</K>.</em>” An <K>x</K> appears twice, but in two different roles: on the right it means “the value in the box”, on the left “the box itself”.</p>}
        />
        <Predict
          prompt={<T de={<>Zwei Variablen sollen ihre Werte tauschen. Der Versuch: <K>a = b; b = a;</K> mit <K>a = 1</K> und <K>b = 2</K>. Was steht danach in <K>a</K> und <K>b</K>?</>} en={<>Two variables are to exchange their values. The attempt: <K>a = b; b = a;</K> with <K>a = 1</K> and <K>b = 2</K>. What is in <K>a</K> and <K>b</K> afterwards?</>} />}
          answer={<T
            de={<>Beide enthalten 2. Nach <K>a = b;</K> ist die 1 überschrieben und <em>verloren</em>; <K>b = a;</K> kopiert dann nur noch die 2 zurück. Du brauchst eine <b>dritte Schachtel</b> als Zwischenspeicher: <K>int t = a; a = b; b = t;</K>. Wie bei zwei Gläsern Wein und Wasser, die man nur mit einem dritten Glas tauschen kann. Verfolge unten beide Versionen.</>}
            en={<>Both contain 2. After <K>a = b;</K> the 1 is overwritten and <em>lost</em>; <K>b = a;</K> then merely copies the 2 back. You need a <b>third box</b> as temporary storage: <K>int t = a; a = b; b = t;</K>. Like two glasses of wine and water, which can only be exchanged with a third glass. Follow both versions below.</>}
          />}
        />
        <Tracer prog={P.swapWrong} label={tr('Falscher Tausch', 'Wrong swap')} />
        <Tracer prog={P.swapRight} label={tr('Richtiger Tausch mit Zwischenspeicher', 'Correct swap with temporary storage')} />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="fallen" title={<T de="4. Fallstricke: Wie der Rechner reagiert, wenn etwas nicht stimmt" en="4. Pitfalls: how the computer reacts when something is off" />}>
        <Box kind="lecture" src={<Src p="22–25" />} title={<T de="Fallstricke im Skript" en="Pitfalls in the notes" />}>
          <T
            de={<ul>
              <li><b>Unverträgliche Typen.</b> Jedes Literal hat Wert und Typ (<K>-2</K> ist <K>int</K>, <K>1.2e5</K> ist <K>double</K>). Bei «verträglichen» Typen wandelt C++ <b>implizit</b> um: <K>int x = 3.5;</K> ergibt 3, <K>int y = -3.5;</K> ergibt -3. Bei unverträglichen gibt es einen Compilerfehler: <K>int x = "hello";</K>.</li>
              <li><b>Linke Seite nicht zuweisbar.</b> <K>2 = x;</K> geht nicht: Links muss stehen, <em>wohin</em> geschrieben wird, also etwas mit Adresse (ein <b>lvalue</b>, z. B. ein Variablenname). Literale und Ausdrücke wie <K>x + 4</K> sind <b>rvalues</b>: Sie haben keine Adresse.</li>
              <li><b>Nicht deklarierte Variable.</b> Namen sind <b>case-sensitive</b>: <K>my_Number</K> und <K>my_number</K> sind verschiedene Namen.</li>
              <li><b>Nicht initialisierte Variable lesen</b> ist <b>undefiniertes Verhalten</b>: Das Programm lässt sich übersetzen, ist aber fehlerhaft, und es gibt keine Garantie, was passiert. Vielleicht erscheint «zufällig» eine sinnvolle Zahl wie 0; beim nächsten Lauf etwas anderes oder ein Absturz.</li>
              <li><b>Nicht benutzte Variablen</b> sind kein Fehler, aber meist unsinnig; Compiler warnen davor, und man soll Warnungen nicht ignorieren.</li>
            </ul>}
            en={<ul>
              <li><b>Incompatible types.</b> Every literal has a value and a type (<K>-2</K> is <K>int</K>, <K>1.2e5</K> is <K>double</K>). For “compatible” types C++ converts <b>implicitly</b>: <K>int x = 3.5;</K> gives 3, <K>int y = -3.5;</K> gives -3. For incompatible ones there is a compiler error: <K>int x = "hello";</K>.</li>
              <li><b>Unassignable left-hand side.</b> <K>2 = x;</K> does not work: on the left must stand <em>where</em> to write, i.e. something with an address (an <b>lvalue</b>, e.g. a variable name). Literals and expressions like <K>x + 4</K> are <b>rvalues</b>: they have no address.</li>
              <li><b>Undeclared variable.</b> Names are <b>case-sensitive</b>: <K>my_Number</K> and <K>my_number</K> are different names.</li>
              <li><b>Reading an uninitialized variable</b> is <b>undefined behavior</b>: the program compiles but is erroneous, and nothing is guaranteed. You may “luckily” see a sensible number like 0; the next run something else or a crash.</li>
              <li><b>Unused variables</b> are not an error but usually pointless; compilers warn about them, and warnings should not be ignored.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Der Unterschied zwischen den ersten drei und dem vierten Punkt ist der wichtigste: Die ersten drei fängt der <b>Compiler</b> ab, du bekommst eine Meldung und kein Programm. Das Lesen einer nicht initialisierten Variablen fängt <em>niemand</em> ab. Hier das Verhalten Schritt für Schritt (der Interpreter dieser Seite setzt den Wert willkürlich auf 0 und warnt; ein echter Rechner liest, was zufällig in der Schachtel steht):</p>}
          en={<p>The difference between the first three and the fourth point is the most important: the first three are caught by the <b>compiler</b>, you get a message and no program. Reading an uninitialized variable is caught by <em>nobody</em>. Here is the behavior step by step (the interpreter on this page arbitrarily sets the value to 0 and warns; a real computer reads whatever happens to be in the box):</p>}
        />
        <Tracer prog={P.uninit} label={tr('Nicht initialisiert gelesen', 'Read uninitialized')} />
        <table className="plain errs">
          <thead><tr><th>{tr('Code', 'Code')}</th><th>{tr('Meldung von g++ 13', 'Message from g++ 13')}</th><th>{tr('Ursache', 'Cause')}</th></tr></thead>
          <tbody>
            <tr><td><K>int x = "hello";</K></td><td><K>invalid conversion from 'const char*' to 'int'</K></td><td>{tr('Text lässt sich nicht in eine Zahl umwandeln', 'text cannot be converted into a number')}</td></tr>
            <tr><td><K>2 = x;</K></td><td><K>lvalue required as left operand of assignment</K></td><td>{tr('links steht kein zuweisbarer Platz', 'the left side is not an assignable place')}</td></tr>
            <tr><td><K>cout &lt;&lt; my_number;</K></td><td><K>'my_number' was not declared in this scope</K></td><td>{tr('Tippfehler oder Gross-/Kleinschreibung', 'typo or upper/lower case')}</td></tr>
          </tbody>
        </table>
        <Box kind="tip" title={<T de="Weniger irren bei Variablen" en="Fewer mistakes with variables" />}>
          <T
            de={<ul>
              <li><b>Initialisiere immer bei der Deklaration</b> (<K>int x = 0;</K>). Dann gibt es das Problem «nicht initialisiert» gar nicht.</li>
              <li><b>Deklariere eine Variable erst dort, wo du sie brauchst</b>, nicht alle am Anfang. So ist ihr Wert nie lange «leer».</li>
              <li><b>Sprechende Namen</b> (<K>x_squared</K> statt <K>q</K>) sparen mehr Zeit beim Lesen, als sie beim Tippen kosten.</li>
              <li><b>Bei jeder Zuweisung zwei Fragen:</b> Was steht rechts <em>jetzt</em>? Welche Schachtel wird links überschrieben, und brauche ich den alten Wert noch (→ Zwischenspeicher)?</li>
              <li>Übersetze mit eingeschalteten Warnungen (bei g++: <K>-Wall</K>). Sie melden unter anderem nicht benutzte und möglicherweise nicht initialisierte Variablen.</li>
            </ul>}
            en={<ul>
              <li><b>Always initialize at the declaration</b> (<K>int x = 0;</K>). Then the problem “uninitialized” does not exist at all.</li>
              <li><b>Declare a variable only where you need it</b>, not all at the top. Then its value is never “empty” for long.</li>
              <li><b>Speaking names</b> (<K>x_squared</K> instead of <K>q</K>) save more time when reading than they cost when typing.</li>
              <li><b>Two questions at every assignment:</b> what is on the right <em>now</em>? Which box on the left is overwritten, and do I still need the old value (→ temporary storage)?</li>
              <li>Compile with warnings switched on (for g++: <K>-Wall</K>). They report, among other things, unused and possibly uninitialized variables.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Welche dieser Zeilen führt zu <em>undefiniertem Verhalten</em>, ohne dass der Compiler etwas meldet?</>} en={<>Which of these lines leads to <em>undefined behavior</em> without the compiler reporting anything?</>} />}
          choices={[
            { text: <code>int x = 3.5;</code>, why: <T de={<>Nein, das ist wohldefiniert: Der Nachkommateil wird abgeschnitten, <K>x</K> ist 3. Mancher Compiler warnt trotzdem.</>} en={<>No, this is well defined: the fractional part is cut off, <K>x</K> is 3. Some compilers warn nevertheless.</>} /> },
            { text: <code>int x; std::cout &lt;&lt; x;</code>, correct: true, why: <T de={<>Ja: <K>x</K> wurde nie ein Wert gegeben. Das Programm übersetzt, aber das Lesen ist undefiniert.</>} en={<>Yes: <K>x</K> was never given a value. The program compiles, but the read is undefined.</>} /> },
            { text: <code>2 = x;</code>, why: <T de="Nein, das fängt der Compiler ab (lvalue required). Es gibt gar kein Programm." en="No, the compiler catches that (lvalue required). There is no program at all." /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ausblick" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Eine Variable ist eine Schachtel mit <b>Name, Typ, Wert, Adresse</b>. Der Rechner kennt nur die Adresse.</li>
              <li><K>int x;</K> deklariert (Wert undefiniert), <K>x = 2;</K> weist zu, <K>int x = 2;</K> initialisiert.</li>
              <li>Eine Zuweisung wertet <b>zuerst rechts aus, speichert dann links</b>. <K>=</K> ist ein Befehl, keine Gleichung, und überschreibt den alten Wert.</li>
              <li>Undeklarierte Namen, falsche Typen und nicht zuweisbare linke Seiten fängt der Compiler ab. Nicht initialisierte Variablen zu lesen fängt niemand ab.</li>
            </ul>}
            en={<ul>
              <li>A variable is a box with <b>name, type, value, address</b>. The computer knows only the address.</li>
              <li><K>int x;</K> declares (value undefined), <K>x = 2;</K> assigns, <K>int x = 2;</K> initializes.</li>
              <li>An assignment <b>evaluates on the right first, then stores on the left</b>. <K>=</K> is a command, not an equation, and overwrites the old value.</li>
              <li>Undeclared names, wrong types and unassignable left-hand sides are caught by the compiler. Reading uninitialized variables is caught by nobody.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Eingabe, Ausdrücke mit und ohne Nebenwirkung, und Konstanten (Skript S. 25–29).</p>}
          en={<p className="connections"><b>Next:</b> input, expressions with and without side effects, and constants (notes pp. 25–29).</p>}
        />
      </Section>
    </article>
  );
}
