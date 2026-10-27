import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Listing } from '../viz/info/Tracer';

const t = String.raw;

export default function I4Namensraeume() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Je grösser Programme werden, desto wahrscheinlicher heisst eine Funktion so wie eine schon vorhandene. Namensräume lösen das. Dann zeigen wir, warum man fertige Funktionen aus der Standardbibliothek benutzen sollte, statt sie selbst zu schreiben, an einem Primzahltest, der für grosse Zahlen tausendmal schneller wird.</p>}
        en={<p className="lede">The larger programs get, the more likely a function has the same name as an existing one. Namespaces solve this. Then we show why you should use ready-made functions from the standard library instead of writing them yourself, using a prime test that becomes a thousand times faster for large numbers.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="namen" title={<T de="1. Namensräume" en="1. Namespaces" />}>
        <Box kind="lecture" src={<Src p="94–96" />} title={<T de="Namensräume (name spaces)" en="Namespaces (name spaces)" />}>
          <T
            de={<>
              <p>Je grösser Programme und Projekte werden, desto wahrscheinlicher wird es, dass Funktionen oder andere Symbole einen Namen bekommen, der schon vergeben ist. Um solche <b>Namenskonflikte</b> zu vermeiden, gibt es in C++ <b>Namensräume</b>. Die Standardbibliothek hat zum Beispiel den Namensraum <K>std</K>. Deshalb schreiben wir Symbole der Standardbibliothek mit dem Präfix <K>std::</K>.</p>
              <p>Namensräume definiert man mit <K>namespace</K>. Beispiel 6.26 definiert das Symbol <K>pow</K> in zwei verschiedenen Namensräumen (<K>std</K> in <K>cmath</K> und <K>informatik</K>). In Beispiel 6.27 sieht man, wie die beiden Symbole mit ihrem Namensraum angesprochen werden: <K>std::pow(2.0, -2)</K> und <K>informatik::pow(2.0, -2)</K>.</p>
            </>}
            en={<>
              <p>The larger programs and projects become, the more likely it will get that functions or other symbols will get a name that has been declared before. To avoid such <b>name clashes</b>, C++ features <b>namespaces</b>. The standard library, for example, features the namespace <K>std</K>. This is the reason why we refer to symbols in the standard library with the prefix <K>std::</K>.</p>
              <p>Namespaces can be defined using <K>namespace</K>. Example 6.26 defines the symbol <K>pow</K> in two different namespaces (<K>std</K> in <K>cmath</K> and <K>informatik</K>). In Example 6.27 one sees how the two symbols are addressed with their namespace: <K>std::pow(2.0, -2)</K> and <K>informatik::pow(2.0, -2)</K>.</p>
            </>}
          />
        </Box>
        <Listing prog={P.namespaces} label={tr('Beispiele 6.26 und 6.27 als lauffähiges Programm', 'Examples 6.26 and 6.27 as a runnable program')} />
        <T
          de={<>
            <p><b>Ein Bild dazu:</b> Namensräume sind wie Familiennamen. Es gibt viele «Anna», aber «Anna Müller» und «Anna Meier» sind eindeutig. <K>::</K> (der <b>Bereichsoperator</b>) trennt Familie und Vorname: <K>informatik::pow</K> ist die <K>pow</K> der Familie <K>informatik</K>. Beide Funktionen leisten hier dasselbe und liefern <K>0.25</K>, sie sind aber verschiedene Funktionen mit demselben Kurznamen.</p>
            <p>Der Namensraum gehört zum Namen. Daher kann man <K>pow</K> aus <K>cmath</K> und die eigene <K>pow</K> in einem Programm benutzen, ohne dass sich der Compiler verwirrt.</p>
          </>}
          en={<>
            <p><b>A picture for this:</b> namespaces are like family names. There are many “Anna”s, but “Anna Müller” and “Anna Meier” are unambiguous. <K>::</K> (the <b>scope operator</b>) separates family and first name: <K>informatik::pow</K> is the <K>pow</K> of the family <K>informatik</K>. Both functions achieve the same here and deliver <K>0.25</K>, but they are different functions with the same short name.</p>
            <p>The namespace is part of the name. Therefore you can use <K>pow</K> from <K>cmath</K> and your own <K>pow</K> in one program without the compiler getting confused.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="95–96" />} title={<T de="using namespace: nicht empfohlen" en="using namespace: not recommended" />}>
          <T
            de={<p>Man kann festlegen, dass ein Namensraum für alle Symbole ohne den Bereichsoperator <K>::</K> verwendet wird (<K>using namespace std;</K>). Wir empfehlen das nicht, schon gar nicht für alle Symbole der Standardbibliothek. Der Bereichsoperator macht die Herkunft eines Symbols deutlich sichtbar und den Code lesbarer. Er vermeidet ausserdem Namenskollisionen, die unbemerkt bleiben könnten. Es gilt auch offiziell als schlechte Praxis. In C++ ist das Konzept des getrennten Übersetzens unabhängig vom Konzept der Namensräume.</p>}
            en={<p>A namespace can be defined to be used for all symbols not featuring the scope operator <K>::</K> (<K>using namespace std;</K>). We do not recommend this, particularly not for all symbols of the standard library. Using the scope operator with a namespace makes the symbol origin prominently visible and the code more readable. Moreover it avoids name collisions that can go unnoticed. It is also quite officially considered bad practice. In C++ the concept of separate compilation is independent of the concept of namespaces.</p>}
          />
        </Box>
        <Box kind="tip" title={<T de="Namensräume im Alltag" en="Namespaces in everyday work" />}>
          <T
            de={<ul>
              <li><b>Immer <K>std::</K> schreiben.</b> Es sind nur fünf Zeichen und sie sagen dem Leser, woher <K>cout</K>, <K>min</K> oder <K>vector</K> kommen. Mit <K>using namespace std;</K> kann eine neue Standardfunktion in einer neuen Compilerversion plötzlich deine gleichnamige Funktion verdecken oder mit ihr kollidieren.</li>
              <li><b>Unser <K>min</K> aus Beispiel 6.4</b> und <K>std::min</K> haben denselben Kurznamen. Das ging gut, weil wir <K>std::</K> immer mitschreiben. Ohne <K>using namespace std;</K> kann es nie unbemerkt zum Konflikt kommen.</li>
              <li>Es gibt auch <em>verschachtelte</em> Namensräume und lokale <K>using</K>-Deklarationen (<K>using std::cout;</K>). Für diesen Kurs genügt die Regel «Präfix schreiben».</li>
            </ul>}
            en={<ul>
              <li><b>Always write <K>std::</K>.</b> It is only five characters and tells the reader where <K>cout</K>, <K>min</K> or <K>vector</K> come from. With <K>using namespace std;</K> a new standard function in a new compiler version can suddenly shadow or clash with your function of the same name.</li>
              <li><b>Our <K>min</K> from Example 6.4</b> and <K>std::min</K> have the same short name. That went well because we always write <K>std::</K>. Without <K>using namespace std;</K> a clash can never go unnoticed.</li>
              <li>There are also <em>nested</em> namespaces and local <K>using</K> declarations (<K>using std::cout;</K>). For this course the rule “write the prefix” is enough.</li>
            </ul>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="std" title={<T de="2. Die Standardbibliothek benutzen" en="2. Use the standard library" />}>
        <Box kind="lecture" src={<Src p="96" />} title={<T de="Die C++-Standardbibliothek" en="The C++ standard library" />}>
          <T
            de={<p>Wir haben schon viel von der Standardbibliothek benutzt: Ein- und Ausgabe, Vektoren und Assertions. Hier betonen wir, wie wichtig es ist, Funktionen aus der Standardbibliothek zu verwenden. Das vermeidet, das Rad neu zu erfinden (wie bei <K>std::pow</K>), führt auf einfache Weise zu interessanten und effizienten Programmen und garantiert einen Qualitätsstandard, der sich mit selbst geschriebenem Code nicht leicht erreichen lässt. Eine Übersicht über die Funktionalität der Standardbibliothek findet man auf <K>cppreference.com</K>.</p>}
            en={<p>We have already used a lot of the standard library: input and output, vectors and assertions. Here we stress the significance of using functions from the standard library. It helps to avoid re-inventing the wheel (such as with <K>std::pow</K>), it leads to interesting and efficient programs in a simple way, and it guarantees a quality standard that cannot easily be achieved with code written from scratch. An overview of the standard library functionality can be found on <K>cppreference.com</K>.</p>}
          />
        </Box>
        <Box kind="lecture" src={<Src p="96" />} title={<T de="Beispiel: der Primzahltest" en="Example: the prime number test" />}>
          <T
            de={<>
              <p>Wir wissen: <M>{t`n \ge 2`}</M> ist genau dann eine Primzahl, wenn kein <M>{t`d \in \{2, \dots, n-1\}`}</M> die Zahl <M>n</M> teilt. Den Code kennen wir schon, jetzt als Funktion (Beispiel 6.28). Tatsächlich ist <M>{t`n \ge 2`}</M> aber schon dann eine Primzahl, wenn kein <M>{t`d \in \{2, \dots, \lfloor\sqrt{n}\rfloor\}`}</M> die Zahl <M>n</M> teilt. Dafür braucht man <K>std::sqrt</K>.</p>
            </>}
            en={<>
              <p>We know: <M>{t`n \ge 2`}</M> is a prime number if and only if there is no <M>{t`d \in \{2, \dots, n-1\}`}</M> dividing <M p=".">n</M> We already know the code, now as a function (Example 6.28). But actually a number <M>{t`n \ge 2`}</M> is a prime number already if and only if there is no <M>{t`d \in \{2, \dots, \lfloor\sqrt{n}\rfloor\}`}</M> dividing <M p=".">n</M> For this one needs <K>std::sqrt</K>.</p>
            </>}
          />
        </Box>
        <Listing prog={P.isPrimeSimple} label={tr('Beispiel 6.28: ausprobiert für n von 2 bis 30', 'Example 6.28: tried for n from 2 to 30')} />
        <Listing prog={P.isPrimeSqrt} label={tr('Mit der Wurzelschranke: dieselbe Ausgabe', 'With the square-root bound: the same output')} />
        <T
          de={<>
            <p><b>Warum genügt die Wurzel?</b> Ist <M>{t`n = d \cdot e`}</M> zerlegbar, dann ist einer der beiden Faktoren höchstens <M p=":">{t`\sqrt{n}`}</M> Wären beide grösser, wäre ihr Produkt grösser als <M p=",">{t`n`}</M> ein Widerspruch. Jede Zerlegung hat also einen kleinen Teiler, und der wird beim Suchen bis <M>{t`\lfloor\sqrt{n}\rfloor`}</M> gefunden. Die Schleife hat jetzt zwei Abbruchbedingungen: <K>d &lt;= bound</K> (zu weit gesucht) und <K>n % d != 0</K> (Teiler gefunden).</p>
            <p><b>Wie viel das bringt:</b> Für die Primzahl <M>{t`n = 1\,000\,003`}</M> probiert die einfache Version die Teiler 2 bis <M>n</M> durch, also 1 000 002 Divisionen. Die Wurzelversion probiert nur 2 bis 1000, also 999 Divisionen: gut tausendmal weniger (der Test in diesem Projekt rechnet beides nach).</p>
          </>}
          en={<>
            <p><b>Why does the square root suffice?</b> If <M>{t`n = d \cdot e`}</M> can be factored, then one of the two factors is at most <M p=":">{t`\sqrt{n}`}</M> if both were larger, their product would be larger than <M p=",">{t`n`}</M> a contradiction. Every factorization thus has a small divisor, and it is found when searching up to <M p=".">{t`\lfloor\sqrt{n}\rfloor`}</M> The loop now has two exit conditions: <K>d &lt;= bound</K> (searched too far) and <K>n % d != 0</K> (divisor found).</p>
            <p><b>What this buys:</b> for the prime <M>{t`n = 1\,000\,003`}</M> the simple version tries the divisors 2 to <M p=",">n</M> i.e. 1 000 002 divisions. The square-root version tries only 2 to 1000, i.e. 999 divisions: a good thousand times fewer (the test in this project computes both).</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="96" />} title={<T de="Wann das Beispiel funktioniert" en="When the example works" />}>
          <T
            de={<p>Das Beispiel funktioniert (nur) richtig, weil <K>std::sqrt</K> garantiert auf die nächste darstellbare <K>double</K>-Zahl rundet (IEEE-Standard 754). Wäre das nicht so, und würde zum Beispiel <M>{t`\sqrt{49}`}</M> als eine Zahl knapp unter 7 angenähert, würde der obige Primzahltest versagen.</p>}
            en={<p>The example works properly (only) because <K>std::sqrt</K> is guaranteed to round to the next representable <K>double</K> number (IEEE Standard 754). If that were not the case and, for instance, <M>{t`\sqrt{49}`}</M> were approximated as a number slightly smaller than 7, the above prime number test would fail.</p>}
          />
        </Box>
        <T
          de={<>
            <p>Das ist ein schönes Beispiel dafür, wofür die Standardbibliothek da ist: Jemand hat sich genau überlegt, was <K>sqrt</K> garantieren muss, und das getestet. Die Zeile <K>int bound = std::sqrt(n);</K> macht zwei Dinge: Sie berechnet die Wurzel als <K>double</K> und schneidet sie bei der Zuweisung an <K>int</K> ab (<M p=").">{t`\lfloor\sqrt{n}\rfloor`}</M> Für alle Quadratzahlen <M>{t`k^2`}</M> bis <M>{t`46340^2`}</M> (alle, die in einen <K>int</K> passen) ist das Ergebnis exakt <M p=";">k</M> das prüft der Test dieses Projekts.</p>
          </>}
          en={<>
            <p>This is a nice example of what the standard library is for: someone has thought carefully about what <K>sqrt</K> must guarantee, and tested it. The line <K>int bound = std::sqrt(n);</K> does two things: it computes the root as a <K>double</K> and truncates it on assignment to <K>int</K> (<M p=").">{t`\lfloor\sqrt{n}\rfloor`}</M> For all perfect squares <M>{t`k^2`}</M> up to <M>{t`46340^2`}</M> (all that fit into an <K>int</K>) the result is exactly <M p=";">k</M> this project’s test checks that.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Nicht das Rad neu erfinden" en="Do not reinvent the wheel" />}>
          <T
            de={<ul>
              <li><b>Erst nachsehen, dann schreiben.</b> Minimum, Maximum, Wurzel, Potenz, Sortieren, Suchen: Das alles gibt es (<K>std::min</K>, <K>std::sqrt</K>, <K>std::pow</K>, <K>std::sort</K>, …). Nachschlagen auf <K>cppreference.com</K> kostet eine Minute und liefert einen Vertrag, den du nicht selbst testen musst.</li>
              <li><b>Auch bei Standardfunktionen gilt der Vertrag.</b> <K>std::sqrt(-1)</K> ist nicht «Fehler», sondern liefert <K>nan</K>: eine Zahl, die keine Zahl ist. Lies, was die Funktion verspricht und was sie von dir verlangt.</li>
              <li><b>Den Header nicht vergessen:</b> <K>std::sqrt</K> und <K>std::pow</K> brauchen <K>&lt;cmath&gt;</K>, <K>std::min</K> und <K>std::max</K> brauchen <K>&lt;algorithm&gt;</K>. Fehlt er, geht es oft trotzdem auf einem Rechner, weil ein anderer Header ihn mitbringt, und auf dem nächsten nicht.</li>
            </ul>}
            en={<ul>
              <li><b>Look first, then write.</b> Minimum, maximum, root, power, sorting, searching: all of this exists (<K>std::min</K>, <K>std::sqrt</K>, <K>std::pow</K>, <K>std::sort</K>, …). Looking it up on <K>cppreference.com</K> takes a minute and gives you a contract you need not test yourself.</li>
              <li><b>The contract applies to standard functions too.</b> <K>std::sqrt(-1)</K> is not an “error” but yields <K>nan</K>: a number that is not a number. Read what the function promises and what it demands from you.</li>
              <li><b>Do not forget the header:</b> <K>std::sqrt</K> and <K>std::pow</K> need <K>&lt;cmath&gt;</K>, <K>std::min</K> and <K>std::max</K> need <K>&lt;algorithm&gt;</K>. If it is missing, it often works anyway on one machine because another header brings it along, and fails on the next.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Dein Programm definiert eine eigene Funktion <K>double pow(double b, int e)</K> und bindet <K>&lt;cmath&gt;</K> ein. Wie rufst du jeweils genau die Version aus <K>cmath</K> auf, ohne <K>using namespace std;</K>?</>} en={<>Your program defines its own function <K>double pow(double b, int e)</K> and includes <K>&lt;cmath&gt;</K>. How do you call exactly the version from <K>cmath</K>, without <K>using namespace std;</K>?</>} />}
          choices={[
            { text: <K>std::pow(2.0, 3)</K>, correct: true, why: <T de={<>Richtig: Der Präfix <K>std::</K> wählt den Namensraum der Standardbibliothek. Ohne Präfix würde dein eigenes <K>pow</K> gewählt.</>} en={<>Correct: the prefix <K>std::</K> selects the namespace of the standard library. Without a prefix your own <K>pow</K> would be selected.</>} /> },
            { text: <K>cmath::pow(2.0, 3)</K>, why: <T de={<><K>cmath</K> ist der Name der Header-Datei, kein Namensraum. Die Funktionen darin liegen im Namensraum <K>std</K>.</>} en={<><K>cmath</K> is the name of the header file, not a namespace. The functions in it live in the namespace <K>std</K>.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="wichtig" title={<T de="3. Das Wichtigste" en="3. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Namensräume verhindern Namenskonflikte. <K>std::</K> ist der Namensraum der Standardbibliothek; <K>::</K> ist der Bereichsoperator.</li>
              <li>Schreibe den Präfix <K>std::</K>; vermeide <K>using namespace std;</K>.</li>
              <li>Benutze die Standardbibliothek, statt Fertiges selbst zu schreiben, und lies ihren Vertrag.</li>
              <li>Ein besserer Algorithmus schlägt jede Mikro-Optimierung: Die Wurzelschranke macht den Primzahltest für grosse <K>n</K> tausendmal schneller.</li>
            </ul>}
            en={<ul>
              <li>Namespaces prevent name clashes. <K>std::</K> is the namespace of the standard library; <K>::</K> is the scope operator.</li>
              <li>Write the prefix <K>std::</K>; avoid <K>using namespace std;</K>.</li>
              <li>Use the standard library instead of writing ready-made things yourself, and read its contract.</li>
              <li>A better algorithm beats any micro-optimization: the square-root bound makes the prime test a thousand times faster for large <K>n</K>.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Bisher hatten wir einzelne Zahlen. Wie speichert man <em>viele</em> Werte gleichen Typs unter einem Namen? Mit Vektoren, dem Thema des nächsten Kapitels (Skript, Abschnitt 7).</p>}
          en={<p className="connections"><b>Next:</b> so far we had single numbers. How do you store <em>many</em> values of the same type under one name? With vectors, the topic of the next chapter (notes, section 7).</p>}
        />
      </Section>
    </article>
  );
}
