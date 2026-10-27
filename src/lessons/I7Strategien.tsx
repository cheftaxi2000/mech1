import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { DepthCompare } from '../viz/info/RecursionFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I7Strategien() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Es gibt zwei Denkweisen, mit denen sich fast jedes rekursive Problem anpacken lässt: das Problem ein <em>Stückchen</em> kleiner machen, oder es in <em>zwei Hälften</em> teilen. Wir üben beide an einem Spielzeugproblem, das man mit einer Schleife sofort löst: die Summe aller Einträge eines Vektors. So sieht man die Strategien, ohne dass die Aufgabe vom Wesentlichen ablenkt.</p>}
        en={<p className="lede">There are two ways of thinking with which almost every recursive problem can be tackled: make the problem a <em>little bit</em> smaller, or split it into <em>two halves</em>. We practice both on a toy problem that one solves at once with a loop: the sum of all entries of a vector. That way one sees the strategies without the task distracting from the essentials.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="wofuer" title={<T de="1. Wofür Rekursion gut ist" en="1. What recursion is good for" />}>
        <Box kind="lecture" src={<Src p="127–128" />} title={<T de="Die Kraft der Rekursion" en="Power of recursion" />}>
          <T
            de={<>
              <p>Rekursion ist ein Konzept, an das man sich ein wenig gewöhnen muss, das sich aber als sehr nützliches Werkzeug zum Problemlösen erweist. Viele Probleme scheinen ohne Rekursion schwer oder gar unlösbar und werden mit Rekursion wesentlich einfacher. Neben der Aufzählung von Bitfolgen hier eine Liste von Problemen mit eleganter rekursiver Lösung und ohne nicht-triviale iterative Lösung:</p>
              <ul>
                <li><b>n Damen</b> (<span lang="en">n-queens</span>)</li>
                <li>die <b>Türme von Hanoi</b></li>
                <li>ein <b>Sudoku-Löser</b></li>
                <li><b>Ausdrucksparser</b> (zum Beispiel für die Ausdrücke aus Kapitel 3)</li>
                <li>Ein- oder Ausgabe <b>umkehren</b></li>
                <li><b>Suche in Bäumen</b></li>
              </ul>
            </>}
            en={<>
              <p>Recursion is a concept that requires a bit more time to get used to but proves a very useful tool for problem solving. Many problems appear to be hard or even impossible to solve without recursion and become significantly simpler when solved with recursion. Besides the bit string enumeration problem, here is a list of problems that admit an elegant recursive solution and no non-trivial iterative solution:</p>
              <ul>
                <li><b>n-queens</b></li>
                <li>the <b>towers of Hanoi</b></li>
                <li>a <b>Sudoku solver</b></li>
                <li><b>expression parsers</b> (for example for the expressions of chapter 3)</li>
                <li><b>reversing</b> in- or output</li>
                <li><b>searching in trees</b></li>
              </ul>
            </>}
          />
        </Box>
        <T
          de={<p>Was alle diese Probleme gemeinsam haben: Sie bestehen aus <em>gleichartigen kleineren Problemen</em>. Ein Sudoku mit einer Zahl mehr eingetragen ist wieder ein Sudoku. Ein Ausdruck <K>(a + b) * c</K> besteht aus Teilausdrücken, die selbst Ausdrücke sind. Ein Baum besteht aus kleineren Bäumen. Bei Strukturen, die in sich selbst «verschachtelt» sind, passt die Rekursion zur Struktur der Aufgabe: Der Code spiegelt die Form der Daten.</p>}
          en={<p>What all these problems have in common: they consist of <em>smaller problems of the same kind</em>. A Sudoku with one more number filled in is a Sudoku again. An expression <K>(a + b) * c</K> consists of sub-expressions that are themselves expressions. A tree consists of smaller trees. For structures that are “nested” in themselves, recursion fits the structure of the task: the code mirrors the form of the data.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="strategien" title={<T de="2. Zwei Strategien" en="2. Two strategies" />}>
        <Box kind="lecture" src={<Src p="128" />} title={<T de="Strategien und das Spielzeugproblem" en="Strategies and the toy problem" />}>
          <T
            de={<>
              <p>Es gibt zwei nützliche allgemeine rekursive Problemlösungsstrategien: <b>Verkleinern und Herrschen</b> (<span lang="en">decrease and conquer</span>) und <b>Teilen und Herrschen</b> (<span lang="en">divide and conquer</span>). Sie werden für viele Probleme immer wieder verwendet, auch für zahlreiche bekannte Algorithmen. Mehr darüber lernt man in Kursen über Datenstrukturen und Algorithmen. Hier wollen wir sie nur einführen, damit man die Begriffe kennt. Wir tun das mit einem Spielzeugproblem, das sich leicht iterativ lösen lässt: die Gesamtsumme aller Einträge eines Vektors zu berechnen.</p>
              <p>Die iterative Lösung ist geradlinig:</p>
              <Code code={'int sum(const std::vector<int>& v) {\n    int s = 0;\n    for (int i = 0; i < std::ssize(v); ++i) {\n        s += v[i];\n    }\n    return s;\n}'} />
              <p>Wir betrachten jetzt zwei verschiedene rekursive Lösungen. Wieder müssen wir uns fragen: «Welche Teilprobleme gibt es, bei denen wir auch die Lösung des Gesamtproblems wüssten, wenn wir die Lösungen dieser Teilprobleme kennten?»</p>
            </>}
            en={<>
              <p>There are two useful general recursive problem-solving strategies: <b>decrease and conquer</b> and <b>divide and conquer</b>. They are repeatedly used for a variety of problems, including numerous popular algorithms. You can learn more about them in courses about data structures and algorithms. For now, we just want to introduce them so you are familiar with the terminology. We will do that with the help of a toy problem that can be easily solved iteratively: computing the total sum of all entries in a vector.</p>
              <p>The iterative solution is straightforward:</p>
              <Code code={'int sum(const std::vector<int>& v) {\n    int s = 0;\n    for (int i = 0; i < std::ssize(v); ++i) {\n        s += v[i];\n    }\n    return s;\n}'} />
              <p>We will now look at two different recursive solutions for this problem. Again, we have to ask ourselves: “What subproblems exist such that if we knew the solutions to those subproblems, then we would also know the solution to the overall problem?”</p>
            </>}
          />
        </Box>
        <Listing prog={P.sumLoop} label={tr('Die Schleife: Summe von {−1, 4, 6, 7}', 'The loop: the sum of {−1, 4, 6, 7}')} />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="decrease" title={<T de="3. Verkleinern und Herrschen" en="3. Decrease and conquer" />}>
        <Box kind="lecture" src={<Src p="128–129" />} title={<T de="Ein Element abspalten" en="Splitting off one element" />}>
          <T
            de={<>
              <p><b>Variante 1.</b> Ein natürlicher Weg, die Teilprobleme zu wählen: Man nimmt die Summe der letzten (oder ersten) <M>{t`n-1`}</M> Einträge. Dann müssen wir nur noch den ersten Eintrag addieren. Nächste Frage: «Wann ist es einfach?» Wenn der Rest-Vektor die Länge 0 hat, dann ist die Summe 0 (Abbildung 10.6).</p>
              <p>In C++ arbeiten wir, statt für jeden Teilvektor eine neue Kopie anzulegen, mit einem einzigen Vektor und einem Index <K>from</K>, der den Anfang des Teilvektors angibt. Die Funktion <K>int sum(const std::vector&lt;int&gt;&amp; v, int from)</K> liefert die Summe des Teilvektors ab dem Index <K>from</K>:</p>
              <Code code={'int sum(const std::vector<int>& v, int from) {\n    if (from >= std::ssize(v))\n        return 0;\n    else\n        return v[from] + sum(v, from + 1);\n}'} />
              <p>Sie kann zum Beispiel mit <K>sum({'{-1, 4, 6, 7}'}, 0)</K> aufgerufen werden. Die Strategie, einen kleinen Teil (hier den ersten Eintrag) vom Problem zu entfernen, das Restproblem rekursiv zu lösen und die Lösung des Teilproblems zu nutzen, um das ursprüngliche zu lösen, heisst <b>Verkleinern und Herrschen</b>: Wir machen das Problem etwas kleiner (<em>decrease</em>) und lösen es dann (<em>conquer</em>), indem wir die Lösung des Teilproblems sinnvoll nutzen.</p>
            </>}
            en={<>
              <p><b>Variant 1.</b> One natural way of picking the subproblems for computing the sum of a vector of length <M>n</M> would be to have the sum of the last (or first) <M>{t`n-1`}</M> entries. Then we could just add the first entry and would have solved the overall problem. Next question: “When is it easy?” When the remaining subvector has length 0; then the sum is 0 (Figure 10.6).</p>
              <p>In C++, instead of creating a new copy for every subvector, we can work with a single vector as follows by having an index <K>from</K> that indicates the start index of the subvector. We thus can write a function <K>int sum(const std::vector&lt;int&gt;&amp; v, int from)</K> that returns the sum of the subvector of <K>v</K> starting at index <K>from</K>:</p>
              <Code code={'int sum(const std::vector<int>& v, int from) {\n    if (from >= std::ssize(v))\n        return 0;\n    else\n        return v[from] + sum(v, from + 1);\n}'} />
              <p>This function can be called with, say, <K>sum({'{-1, 4, 6, 7}'}, 0)</K>. This strategy of removing a small part (here the first entry) from the problem, solving the remaining problem recursively, and using the solution to the subproblem to find a solution to the original problem is called <b>decrease and conquer</b> because we make the problem slightly smaller (decrease) and then solve the problem (conquer) by using the solution to the subproblem in a meaningful way.</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.sumDecrease} label={tr('sum(v, from): ein Element nach dem anderen', 'sum(v, from): one element after the other')} />
        <T
          de={<>
            <p><b>Beobachte die Kette:</b> <K>sum(v, 0)</K> ruft <K>sum(v, 1)</K> auf, dieses <K>sum(v, 2)</K>, … bis <K>sum(v, 4)</K>: <K>from == 4 &gt;= ssize(v)</K>, das gibt 0 zurück. Auf dem Rückweg wird <em>von hinten</em> aufsummiert: <K>7 + 0 = 7</K>, <K>6 + 7 = 13</K>, <K>4 + 13 = 17</K>, <K>-1 + 17 = 16</K>. Das entspricht der Abbildung 10.6 im Skript. Beachte, dass hier der Vektor <K>v</K> (als <K>const</K>-Referenz) und nicht die Teilvektoren übergeben werden. Es wird nichts kopiert; nur der Index <K>from</K> wandert. Das ist ein typischer Trick: «Teilproblem» bedeutet «anderer Bereich desselben Vektors».</p>
          </>}
          en={<>
            <p><b>Watch the chain:</b> <K>sum(v, 0)</K> calls <K>sum(v, 1)</K>, that calls <K>sum(v, 2)</K>, … up to <K>sum(v, 4)</K>: <K>from == 4 &gt;= ssize(v)</K>, which returns 0. On the way back the sum is accumulated <em>from the back</em>: <K>7 + 0 = 7</K>, <K>6 + 7 = 13</K>, <K>4 + 13 = 17</K>, <K>-1 + 17 = 16</K>. That corresponds to Figure 10.6 of the notes. Note that here the vector <K>v</K> (as a <K>const</K> reference) is passed, not the subvectors. Nothing is copied; only the index <K>from</K> moves. This is a typical trick: “subproblem” means “other range of the same vector”.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="divide" title={<T de="4. Teilen und Herrschen" en="4. Divide and conquer" />}>
        <Box kind="lecture" src={<Src p="129–131" />} title={<T de="In zwei Hälften teilen" en="Splitting into two halves" />}>
          <T
            de={<>
              <p><b>Variante 2.</b> Es gibt einen anderen natürlichen Weg zu Teilproblemen: Kennten wir die Summe der ersten Hälfte des Vektors und die Summe der zweiten Hälfte, dann wüssten wir auch die Summe des ganzen Vektors (durch Addition der beiden Teilsummen), Abbildung 10.7.</p>
              <p>In C++ arbeiten wir wieder mit Indizes statt mit Kopien: einem Startindex <K>from</K> und einem Endindex <K>to</K>. Zeigen <K>from</K> und <K>to</K> auf denselben Eintrag, hat der Teilvektor die Länge 1, und seine Summe ist leicht zu berechnen. Ist <K>from</K> grösser als <K>to</K>, so steht das für einen leeren Teilvektor mit Summe 0. Das sind unsere beiden Basisfälle:</p>
              <Code code={'int sum(const std::vector<int>& v, int from, int to) {\n    if (from > to)\n        return 0;\n    else if (from == to)\n        return v.at(from);\n    else {\n        int middle = (from + to) / 2;\n        return sum(v, from, middle) + sum(v, middle + 1, to);\n    }\n}'} />
              <p>Die Funktion sollte etwa mit <K>sum({'{-1, 4, 6, 7}'}, 0, 3)</K> aufgerufen werden. Da das Problem in zwei Teilprobleme (ungefähr gleicher Grösse) geteilt wird, heisst diese Technik oft <b>Teilen und Herrschen</b>.</p>
              <p>Zusammengefasst: Bei <em>Verkleinern und Herrschen</em> wird ein Element entfernt und das Problem rekursiv auf dem Rest mit <em>einem</em> rekursiven Aufruf gelöst; bei <em>Teilen und Herrschen</em> werden die Elemente in zwei Hälften geteilt, auf denen das Problem mit je <em>einem</em> rekursiven Aufruf gelöst wird (Abbildung 10.8).</p>
            </>}
            en={<>
              <p><b>Variant 2.</b> There is another natural way of finding subproblems to the vector sum problem: if we knew the sum of the first half of the vector and knew the sum of the second half of the vector, then we would also know the sum of the whole vector (by just adding those two partial sums), Figure 10.7.</p>
              <p>In C++, again, instead of creating copies, we can work with indices instead: a start index <K>from</K> and an end index <K>to</K>. When <K>from</K> and <K>to</K> point to the same entry, then the subvector has length 1 and its sum is easy to compute. Likewise, if <K>from</K> is larger than <K>to</K>, then this represents an empty subvector that has sum 0. These are our two base cases:</p>
              <Code code={'int sum(const std::vector<int>& v, int from, int to) {\n    if (from > to)\n        return 0;\n    else if (from == to)\n        return v.at(from);\n    else {\n        int middle = (from + to) / 2;\n        return sum(v, from, middle) + sum(v, middle + 1, to);\n    }\n}'} />
              <p>This function then should be called for instance using <K>sum({'{-1, 4, 6, 7}'}, 0, 3)</K>. Since the problem is divided into two subproblems (of roughly equal size), this problem-solving technique is often referred to as <b>divide and conquer</b>.</p>
              <p>To summarize, using the decrease-and-conquer strategy, one element is removed and the problem is solved recursively on the remainder with one recursive call; using the divide-and-conquer strategy, the elements are divided into two halves on which the problem is solved recursively with one recursive call each (Figure 10.8).</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.sumDivide} label={tr('sum(v, from, to): in der Mitte teilen', 'sum(v, from, to): splitting in the middle')} />
        <T
          de={<>
            <p>Hier ist der Aufrufbaum kein Strich, sondern ein <em>Baum</em>: <K>sum(0,3)</K> teilt in <K>sum(0,1)</K> und <K>sum(2,3)</K>, und diese teilen sich wieder. Die Blätter sind die Teilvektoren der Länge 1 (die Summe ist der Eintrag selbst). Auf dem Rückweg werden die Werte <em>paarweise</em> addiert: erst <K>-1 + 4 = 3</K> und <K>6 + 7 = 13</K>, dann <K>3 + 13 = 16</K>. Das Ergebnis ist dasselbe wie bei der Schleife und bei Variante 1.</p>
            <p><b>Worauf man achten muss.</b> Die Mitte <K>(from + to) / 2</K> ist eine ganzzahlige Division (rundet ab). <K>sum(v, from, middle)</K> und <K>sum(v, middle + 1, to)</K> zusammen decken <em>genau</em> den Bereich ab: nichts doppelt, nichts ausgelassen. Wäre das zweite <K>sum(v, middle, to)</K>, würde der mittlere Eintrag doppelt gezählt. Ausserdem ist hier <K>v.at(from)</K> geschrieben: Die Funktion prüft, dass der Index im Vektor liegt, und meldet sonst einen Fehler, statt still falsch zu rechnen.</p>
          </>}
          en={<>
            <p>Here the call tree is not a line but a <em>tree</em>: <K>sum(0,3)</K> splits into <K>sum(0,1)</K> and <K>sum(2,3)</K>, and these split again. The leaves are the subvectors of length 1 (the sum is the entry itself). On the way back the values are added <em>in pairs</em>: first <K>-1 + 4 = 3</K> and <K>6 + 7 = 13</K>, then <K>3 + 13 = 16</K>. The result is the same as with the loop and with variant 1.</p>
            <p><b>What one must watch.</b> The middle <K>(from + to) / 2</K> is an integer division (rounds down). <K>sum(v, from, middle)</K> and <K>sum(v, middle + 1, to)</K> together cover <em>exactly</em> the range: nothing twice, nothing left out. If the second one were <K>sum(v, middle, to)</K>, the middle entry would be counted twice. Also <K>v.at(from)</K> is written here: the function checks that the index lies within the vector and reports an error otherwise, instead of silently calculating wrongly.</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="tiefe" title={<T de="5. Warum Halbieren sich lohnt: die Rekursionstiefe" en="5. Why halving pays off: the recursion depth" />}>
        <Box kind="lecture" src={<Src p="131" />} title={<T de="Zwei Vorteile" en="Two advantages" />}>
          <T
            de={<>
              <p>Die letztere Strategie hat zwei Vorteile: Erstens lässt sie sich oft gut <b>parallelisieren</b>, die erstere nicht. Zweitens führt sie zu einer kleineren <b>Rekursionstiefe</b>. Die Rekursionstiefe ist die Gesamtzahl der gleichzeitig aktiven Aufrufe, also die maximale Zahl von Funktionsaufrufen auf dem Aufrufstapel wegen des ersten rekursiven Aufrufs. Verkleinern und Herrschen führt oft dazu, dass <M>n</M> Funktionsaufrufe gleichzeitig aktiv sind, also Rekursionstiefe <M p=",">n</M> während Teilen und Herrschen wegen der Halbierung der Daten in jedem Schritt zu einer Rekursionstiefe von <M>{t`\log_2 n`}</M> führt. Eine kleinere Rekursionstiefe bedeutet weniger (Stapel-)Speicher, also können grössere Probleme gelöst werden, bevor der Speicher ausgeht. Ist kein Speicher mehr auf dem Stapel, führt das zu einem Stapelüberlauf, der undefiniertes Verhalten ist und sich oft als Segmentation Fault äussert.</p>
              <p>(Es ist nicht wichtig, genau zu verstehen, woher <M>{t`\log_2 n`}</M> kommt, aber man sollte wissen, was die Rekursionstiefe ist und wie man sie für einen konkreten Aufruf (für kleine Werte!) bestimmt.)</p>
            </>}
            en={<>
              <p>The latter strategy has two advantages: first, it is often well <b>parallelizable</b> while the former strategy is not; second, it leads to a smaller <b>recursion depth</b>. The recursion depth is the total number of calls active at the same time, so the maximum number of function calls on the call stack due to the first recursive call. Decrease and conquer often leads to <M>n</M> function calls being active at the same time, thus recursion depth <M p=",">n</M> while divide and conquer leads to a recursion depth of <M p=",">{t`\log_2 n`}</M> due to the halving of the data in each step. Smaller recursion depth means less (stack) memory is used, which means that larger problems can be solved before running out of memory. Having no memory left on the stack leads to stack overflow, which is undefined behavior and often manifests as a segmentation fault.</p>
              <p>(It is not important that you fully understand where <M>{t`\log_2 n`}</M> comes from, but you should know what the recursion depth is and how to determine it for a specific call of a recursive function (for small values!).)</p>
            </>}
          />
        </Box>
        <DepthCompare />
        <T
          de={<>
            <p><b>Wie man die Tiefe für einen Aufruf bestimmt (für kleine Werte).</b> Zähle im Aufrufbaum den längsten Weg von der Wurzel bis zu einem Blatt. Bei <K>sum(v, from)</K> mit 4 Einträgen ist der Weg <K>from = 0, 1, 2, 3, 4</K>, also 5 Aufrufe. Bei <K>sum(v, from, to)</K> mit 4 Einträgen ist er <K>(0,3), (0,1), (0,0)</K>, also 3 Aufrufe: Ein Halbieren pro Ebene. Die allgemeine Zählung (<M>n + 1</M> beziehungsweise <M p=")">{t`\lceil \log_2 n \rceil + 1`}</M> bestätigt der Test dieses Projekts mit dem Interpreter für Vektoren der Längen 1 bis 10.</p>
            <p>Der Unterschied ist drastisch: Bei einer Million Einträge braucht Verkleinern etwa eine Million Stapelkästen (ein Stapelüberlauf), Teilen nur etwa 21.</p>
          </>}
          en={<>
            <p><b>How to determine the depth for a call (for small values).</b> Count the longest path in the call tree from the root to a leaf. For <K>sum(v, from)</K> with 4 entries the path is <K>from = 0, 1, 2, 3, 4</K>, i.e. 5 calls. For <K>sum(v, from, to)</K> with 4 entries it is <K>(0,3), (0,1), (0,0)</K>, i.e. 3 calls: one halving per level. The general count (<M>n + 1</M> and <M p=",">{t`\lceil \log_2 n \rceil + 1`}</M> respectively) is confirmed by this project’s test with the interpreter for vectors of lengths 1 to 10.</p>
            <p>The difference is drastic: with a million entries decrease needs about a million stack boxes (a stack overflow), divide only about 21.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Welche Strategie wann?" en="Which strategy when?" />}>
          <T
            de={<ul>
              <li><b>Verkleinern und Herrschen</b> ist am einfachsten zu schreiben, wenn sich ein Problem natürlich um ein Element verkleinert (Fakultät, Summe ab Index <K>from</K>). Rechne mit Tiefe <M p=".">n</M></li>
              <li><b>Teilen und Herrschen</b>, wenn das Problem in zwei etwa gleich grosse unabhängige Hälften zerfällt (Summe, Suchen, Sortieren). Tiefe <M p=".">{t`\log_2 n`}</M></li>
              <li><b>Bei zwei Basisfällen alle Randfälle prüfen:</b> leerer Bereich (<K>from &gt; to</K>), ein Element (<K>from == to</K>). Dann testet man <K>n = 0</K>, <K>1</K>, <K>2</K>, <K>3</K> von Hand.</li>
              <li><b>Gibt es eine Schleife?</b> Wenn ja, brauchst du meist keine Rekursion. Rekursion lohnt sich, wenn die Struktur selbst verschachtelt ist.</li>
            </ul>}
            en={<ul>
              <li><b>Decrease and conquer</b> is easiest to write when a problem naturally shrinks by one element (factorial, sum from index <K>from</K>). Expect depth <M p=".">n</M></li>
              <li><b>Divide and conquer</b> when the problem falls apart into two roughly equal independent halves (sum, searching, sorting). Depth <M p=".">{t`\log_2 n`}</M></li>
              <li><b>With two base cases check all edge cases:</b> empty range (<K>from &gt; to</K>), one element (<K>from == to</K>). Then test <K>n = 0</K>, <K>1</K>, <K>2</K>, <K>3</K> by hand.</li>
              <li><b>Is there a loop?</b> If so, you usually need no recursion. Recursion pays off when the structure itself is nested.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Wie viele Aufrufe sind höchstens gleichzeitig aktiv bei <K>sum(v, 0, 7)</K> für einen Vektor der Länge 8 (Teilen und Herrschen)?</>} en={<>How many calls are active at most at the same time for <K>sum(v, 0, 7)</K> for a vector of length 8 (divide and conquer)?</>} />}
          choices={[
            { text: <K>4</K>, correct: true, why: <T de={<>Richtig: Der Bereich 8 → 4 → 2 → 1 wird dreimal halbiert, dazu kommt der erste Aufruf: <M p=".">{t`\log_2 8 + 1 = 4`}</M></>} en={<>Correct: the range 8 → 4 → 2 → 1 is halved three times, and the first call is added: <M p=".">{t`\log_2 8 + 1 = 4`}</M></>} /> },
            { text: <K>8</K>, why: <T de={<>Das wäre die Tiefe bei Verkleinern und Herrschen (dort sogar 9).</>} en={<>That would be the depth for decrease and conquer (there even 9).</>} /> },
            { text: <K>3</K>, why: <T de={<>Das sind nur die Halbierungen. Der erste Aufruf selbst zählt auch als aktiver Aufruf.</>} en={<>That counts only the halvings. The first call itself counts as an active call too.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="wichtig" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Rekursion passt zu Problemen, die aus gleichartigen kleineren Problemen bestehen (Bäume, Ausdrücke, Aufzählungen, Backtracking).</li>
              <li><b>Verkleinern und Herrschen:</b> ein Stück abspalten, den Rest rekursiv lösen, kombinieren. Ein rekursiver Aufruf; Tiefe etwa <M p=".">n</M></li>
              <li><b>Teilen und Herrschen:</b> in zwei Hälften teilen, beide rekursiv lösen, kombinieren. Zwei rekursive Aufrufe; Tiefe etwa <M p=";">{t`\log_2 n`}</M> oft parallelisierbar.</li>
              <li>Mit Indizes (<K>from</K>, <K>to</K>) und einer <K>const</K>-Referenz auf den Vektor kopiert man nichts.</li>
              <li>Die Rekursionstiefe (gleichzeitig aktive Aufrufe) bestimmt den Stapelbedarf: zu viel gibt Stapelüberlauf.</li>
            </ul>}
            en={<ul>
              <li>Recursion fits problems that consist of smaller problems of the same kind (trees, expressions, enumerations, backtracking).</li>
              <li><b>Decrease and conquer:</b> split off a piece, solve the rest recursively, combine. One recursive call; depth about <M p=".">n</M></li>
              <li><b>Divide and conquer:</b> split into two halves, solve both recursively, combine. Two recursive calls; depth about <M p=";">{t`\log_2 n`}</M> often parallelizable.</li>
              <li>With indices (<K>from</K>, <K>to</K>) and a <K>const</K> reference to the vector nothing is copied.</li>
              <li>The recursion depth (calls active at the same time) determines the stack need: too much gives a stack overflow.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Die berühmteste Rekursion kostet auf eine ganz andere Art: Bei den Fibonacci-Zahlen berechnet der Rechner dieselben Teilprobleme millionenfach (Skript S. 131–133).</p>}
          en={<p className="connections"><b>Next:</b> the most famous recursion costs in a very different way: with the Fibonacci numbers the computer calculates the same subproblems millions of times (notes pp. 131–133).</p>}
        />
      </Section>
    </article>
  );
}
