import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { FibGrowth } from '../viz/info/RecursionFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I7Fibonacci() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Man kann kaum über Rekursion sprechen, ohne die Fibonacci-Zahlen zu erwähnen. Sie sind das Standardbeispiel dafür, dass eine <em>schöne</em> rekursive Lösung eine <em>katastrophal langsame</em> sein kann. Diese Lektion zeigt, wo die Zeit verschwindet, wie die Schleife das Problem umgeht, und was daraus für die Wahl zwischen Rekursion und Iteration folgt.</p>}
        en={<p className="lede">One can hardly talk about recursion without mentioning the Fibonacci numbers. They are the standard example of a <em>beautiful</em> recursive solution being a <em>catastrophically slow</em> one. This lesson shows where the time disappears, how the loop avoids the problem, and what follows for the choice between recursion and iteration.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="fib" title={<T de="1. Die Fibonacci-Zahlen rekursiv" en="1. The Fibonacci numbers recursively" />}>
        <Box kind="lecture" src={<Src p="131–132" />} title={<T de="Definition und Programm" en="Definition and program" />}>
          <T
            de={<>
              <p>Es ist (fast) unmöglich, über Rekursion zu sprechen, ohne das Beispiel für Rekursion zu behandeln: die Fibonacci-Zahlen. Die Fibonacci-Zahlen <M>{t`(F_n)_{n \in \mathbb{N}}`}</M> sind durch die folgende Rekursion definiert:</p>
              <p><M>{t`F_n := \begin{cases} 0, & \text{falls } n = 0 \\ 1, & \text{falls } n = 1 \\ F_{n-1} + F_{n-2}, & \text{falls } n > 1 \end{cases}`}</M></p>
              <p>Die ersten Fibonacci-Zahlen sind <M p=".">{t`0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, \dots`}</M> Wie immer können wir eine mathematische Rekursion eins zu eins in ein rekursives C++-Programm übersetzen:</p>
              <Code code={'int fib(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    return fib(n-1) + fib(n-2);\n}'} />
            </>}
            en={<>
              <p>It is (almost) impossible to talk about recursion without discussing the example of recursion: the Fibonacci numbers. The Fibonacci numbers <M>{t`(F_n)_{n \in \mathbb{N}}`}</M> are defined using the following recursion:</p>
              <p><M>{t`F_n := \begin{cases} 0, & \text{if } n = 0 \\ 1, & \text{if } n = 1 \\ F_{n-1} + F_{n-2}, & \text{if } n > 1 \end{cases}`}</M></p>
              <p>The first couple of Fibonacci numbers are given as <M p=".">{t`0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, \dots`}</M> As always, we can transform a mathematical recursion into a recursive C++ program one-to-one:</p>
              <Code code={'int fib(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n    return fib(n-1) + fib(n-2);\n}'} />
            </>}
          />
        </Box>
        <Tracer stack tree="same" prog={P.fibRec} label={tr('fib(4): derselbe Aufruf mehrfach (gleiche Farbe = gleiche Argumente)', 'fib(4): the same call several times (same colour = same arguments)')} />
        <T
          de={<>
            <p><b>Jetzt sieht man das Problem.</b> Der Baum für <K>fib(4)</K> hat neun Aufrufe, aber nur fünf verschiedene Argumente (0, 1, 2, 3, 4). Die Aufrufe mit gleicher Farbe berechnen <em>dasselbe</em>: <K>fib(2)</K> kommt zweimal vor, <K>fib(1)</K> dreimal. Jedes Mal wird der Teilbaum darunter komplett neu aufgebaut. Je grösser das <K>n</K>, desto grösser der Anteil der Wiederholungen.</p>
          </>}
          en={<>
            <p><b>Now the problem is visible.</b> The tree for <K>fib(4)</K> has nine calls, but only five different arguments (0, 1, 2, 3, 4). The calls with the same colour calculate <em>the same thing</em>: <K>fib(2)</K> occurs twice, <K>fib(1)</K> three times. Every time the subtree below is built up completely anew. The larger <K>n</K>, the larger the share of repetitions.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="132" />} title={<T de="fib(50) dauert «ewig»" en="fib(50) takes “forever”" />}>
          <T
            de={<>
              <p>Misst man die Laufzeit dieser Funktion für <M p=",">{t`n = 50`}</M> ergibt sich ein überraschendes Ergebnis (Beispiel 10.2): <K>fib(50)</K> braucht «ewig», denn es berechnet <M>{t`F_{48}`}</M> zweimal, <M>{t`F_{47}`}</M> dreimal, <M>{t`F_{46}`}</M> fünfmal, <M>{t`F_{45}`}</M> achtmal, <M>{t`F_{44}`}</M> 13-mal, <M>{t`F_{43}`}</M> 21-mal, … und <M>{t`F_1`}</M> etwa <M>{t`10^9`}</M>-mal (!).</p>
              <p>Wie kommt das? Die Funktion wird immer wieder mit denselben Werten aufgerufen und löst jedes Mal dasselbe Teilproblem von Grund auf neu. Das ist äusserst ineffizient. Wenn wir den Wert von <M>{t`F_{48}`}</M> schon berechnet haben, warum sollten wir ihn nochmal berechnen? Das ist ein allgemeines Problem der Rekursion, wenn die Teilprobleme <b>überlappen</b>; es lässt sich (unter bestimmten Bedingungen) mit <b>dynamischer Programmierung</b> umgehen, was hier nicht weiter besprochen wird.</p>
            </>}
            en={<>
              <p>Measuring the running time of this function for <M>{t`n = 50`}</M> leads to a surprising result (Example 10.2): <K>fib(50)</K> takes “forever” because it computes <M>{t`F_{48}`}</M> 2 times, <M>{t`F_{47}`}</M> 3 times, <M>{t`F_{46}`}</M> 5 times, <M>{t`F_{45}`}</M> 8 times, <M>{t`F_{44}`}</M> 13 times, <M>{t`F_{43}`}</M> 21 times, … and <M>{t`F_1`}</M> around <M>{t`10^9`}</M> times (!).</p>
              <p>How come? The function is called repeatedly with the same values, and each time it solves the same subproblem from scratch. This is extremely inefficient. If we already have computed the value of <M p=",">{t`F_{48}`}</M> why should we compute it again? This is a general problem of recursion if the subproblems are <b>overlapping</b> and it can be circumvented (under certain conditions) using <b>dynamic programming</b>, which is not further discussed here.</p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p>Die Zahlen für <M>{t`F_{48}`}</M> bis <M>{t`F_{43}`}</M> stimmen: Es sind selbst Fibonacci-Zahlen (2, 3, 5, 8, 13, 21). Die Zahl am Ende stimmt in der Grössenordnung nicht ganz: <K>fib(1)</K> wird bei <K>fib(50)</K> genau <M>{t`F_{50} = 12\,586\,269\,025`}</M>-mal aufgerufen, also etwa <M>{t`1{,}3 \cdot 10^{10}`}</M> und nicht <M>{t`10^9`}</M> (der Test in diesem Projekt zählt das nach). Insgesamt sind es über <strong>40 Milliarden</strong> Aufrufe. Das ändert nichts an der Aussage, nur an der Zahl.</p>
            <p>Das Muster dahinter: Die Aufrufzahl <M>c(n)</M> erfüllt <M p=",">{t`c(n) = 1 + c(n-1) + c(n-2)`}</M> dieselbe Rekursion wie die Fibonacci-Zahlen selbst. Sie wächst daher mit jedem <M>n</M> um etwa den Faktor 1,6. Probiere es aus:</p>
          </>}
          en={<>
            <p>The numbers for <M>{t`F_{48}`}</M> to <M>{t`F_{43}`}</M> are right: they are Fibonacci numbers themselves (2, 3, 5, 8, 13, 21). The number at the end is not quite right in its order of magnitude: <K>fib(1)</K> is called exactly <M>{t`F_{50} = 12\,586\,269\,025`}</M> times in <K>fib(50)</K>, i.e. about <M>{t`1.3 \cdot 10^{10}`}</M> and not <M>{t`10^9`}</M> (this project’s test counts it). In total there are over <strong>40 billion</strong> calls. That changes nothing about the message, only the number.</p>
            <p>The pattern behind it: the number of calls <M>c(n)</M> satisfies <M p=",">{t`c(n) = 1 + c(n-1) + c(n-2)`}</M> the same recursion as the Fibonacci numbers themselves. It therefore grows by a factor of about 1.6 with every <M p=".">n</M> Try it:</p>
          </>}
        />
        <FibGrowth />
        <Tracer prog={P.fibCount} label={tr('Mit einem Zähler: fib(10) = 55 braucht 177 Aufrufe', 'With a counter: fib(10) = 55 needs 177 calls')} />
        <T
          de={<p>Das Programm zählt in der globalen Variable <K>calls</K>, wie oft <K>fib</K> aufgerufen wird: für <K>fib(10)</K> sind es 177 Aufrufe, um einen Wert zu bestimmen, der höchstens 10 Additionen braucht. Für <K>fib(40)</K> wären es über 300 Millionen, für <K>fib(50)</K> 40 Milliarden.</p>}
          en={<p>The program counts in the global variable <K>calls</K> how often <K>fib</K> is called: for <K>fib(10)</K> it is 177 calls to determine a value that needs at most 10 additions. For <K>fib(40)</K> it would be over 300 million, for <K>fib(50)</K> 40 billion.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="iter" title={<T de="2. Die Schleife als Ausweg" en="2. The loop as a way out" />}>
        <Box kind="lecture" src={<Src p="132–133" />} title={<T de="Die iterative Lösung" en="The iterative solution" />}>
          <T
            de={<>
              <p>Als Machbarkeitsnachweis geben wir eine äusserst effiziente iterative Lösung für die Fibonacci-Zahlen an. Die Idee: Jede Fibonacci-Zahl wird genau <em>einmal</em> berechnet, in aufsteigender Reihenfolge <M p=".">{t`F_0, F_1, F_2, \dots`}</M> Um <M>{t`F_i`}</M> zu bestimmen, müssen wir <M>{t`F_{i-2}`}</M> und <M>{t`F_{i-1}`}</M> kennen, es genügt also, sich die beiden zuletzt berechneten Fibonacci-Zahlen zu merken:</p>
              <Code code={'int fibonacci(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n\n    int fib2 = 0; // value two before\n    int fib1 = 1; // value one before\n    int fib;      // current value\n    for (int i = 2; i <= n; ++i) {\n        fib = fib2 + fib1; // i-th Fibonacci number\n        fib2 = fib1;\n        fib1 = fib;\n    }\n    return fib;\n}'} />
              <p>Mit dieser iterativen Implementierung können wir <K>fib(50)</K> mühelos in praktisch keiner Zeit berechnen.</p>
            </>}
            en={<>
              <p>Just for the proof of concept, we provide an extremely efficient iterative solution for the Fibonacci numbers. The idea is to compute every Fibonacci number exactly <em>once</em>, in increasing order <M p=".">{t`F_0, F_1, F_2, \dots`}</M> To compute the value of <M p=",">{t`F_i`}</M> we need to know <M>{t`F_{i-2}`}</M> and <M p=",">{t`F_{i-1}`}</M> so it is enough to memorize the two most recent Fibonacci numbers:</p>
              <Code code={'int fibonacci(int n) {\n    if (n == 0) return 0;\n    if (n == 1) return 1;\n\n    int fib2 = 0; // value two before\n    int fib1 = 1; // value one before\n    int fib;      // current value\n    for (int i = 2; i <= n; ++i) {\n        fib = fib2 + fib1; // i-th Fibonacci number\n        fib2 = fib1;\n        fib1 = fib;\n    }\n    return fib;\n}'} />
              <p>With this iterative implementation, we can easily compute <K>fib(50)</K> in essentially no time.</p>
            </>}
          />
        </Box>
        <Listing prog={P.fibIter} label={tr('fibonacci(10) und fibonacci(46)', 'fibonacci(10) and fibonacci(46)')} />
        <T
          de={<>
            <p>Hier steht <K>fibonacci(46) = 1836311903</K>: wenige Rechenschritte, sofort fertig. Es sind <K>n - 1</K> Additionen, also 45. Das Bild dahinter ist das eines Läufers, der sich nur die letzten beiden Schritte merkt (<K>fib2</K>, <K>fib1</K>) und sie bei jedem Schritt um eins weiterschiebt.</p>
            <p><b>Aber Vorsicht mit dem Typ.</b> Das Skript sagt, man könne <K>fib(50)</K> berechnen. Mit <K>int</K> geht das <em>nicht</em>: <M>{t`F_{47} = 2\,971\,215\,073`}</M> ist grösser als die grösste <K>int</K>-Zahl <M p=".">{t`2^{31}-1 = 2\,147\,483\,647`}</M> Der Überlauf liefert bei <K>fibonacci(47)</K> eine <em>negative</em> Zahl (<K>-1323752223</K>) und bei <K>fibonacci(50)</K> den Wert <K>-298632863</K>, nicht <M p=".">{t`F_{50} = 12\,586\,269\,025`}</M> Der Test in diesem Projekt führt das mit g++ aus. Für <K>n = 50</K> braucht man <K>long long</K>.</p>
          </>}
          en={<>
            <p>Here stands <K>fibonacci(46) = 1836311903</K>: a few calculation steps, done at once. It is <K>n - 1</K> additions, i.e. 45. The picture behind it is that of a runner who only remembers the last two steps (<K>fib2</K>, <K>fib1</K>) and moves them on by one at every step.</p>
            <p><b>But beware of the type.</b> The notes say one can compute <K>fib(50)</K>. With <K>int</K> that does <em>not</em> work: <M>{t`F_{47} = 2\,971\,215\,073`}</M> is larger than the largest <K>int</K> number <M p=".">{t`2^{31}-1 = 2\,147\,483\,647`}</M> The overflow yields a <em>negative</em> number at <K>fibonacci(47)</K> (<K>-1323752223</K>) and the value <K>-298632863</K> at <K>fibonacci(50)</K>, not <M p=".">{t`F_{50} = 12\,586\,269\,025`}</M> This project’s test runs that with g++. For <K>n = 50</K> you need <K>long long</K>.</p>
          </>}
        />
        <Predict
          prompt={<T de={<>Beide Fibonacci-Funktionen berechnen dasselbe. Warum ist die iterative <em>kein</em> Beispiel gegen Rekursion an sich, sondern gegen diese Art der Rekursion?</>} en={<>Both Fibonacci functions compute the same thing. Why is the iterative one <em>not</em> an example against recursion itself, but against this kind of recursion?</>} />}
          answer={<T de={<>Weil das Problem nicht in der Rekursion liegt, sondern in den <em>überlappenden Teilproblemen</em>: <K>fib(n-1)</K> und <K>fib(n-2)</K> berechnen vieles gemeinsam, und die Rekursion merkt sich nichts. Man kann die Rekursion beibehalten und sich Zwischenergebnisse merken (<b>Memoisierung</b>, ein Spezialfall der dynamischen Programmierung): Dann wird jeder Wert nur einmal berechnet. Bei <K>sum</K> oder den Bitfolgen überlappen die Teilprobleme nicht, dort ist die Rekursion kein Problem.</>} en={<>Because the problem lies not in the recursion but in the <em>overlapping subproblems</em>: <K>fib(n-1)</K> and <K>fib(n-2)</K> compute much in common, and the recursion remembers nothing. One can keep the recursion and remember intermediate results (<b>memoization</b>, a special case of dynamic programming): then each value is computed only once. With <K>sum</K> or the bit strings the subproblems do not overlap; there recursion is no problem.</>} />}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="vergleich" title={<T de="3. Rekursion oder Iteration?" en="3. Recursion or iteration?" />}>
        <Box kind="lecture" src={<Src p="133" />} title={<T de="Was ist besser?" en="What is better?" />}>
          <T
            de={<>
              <p>Was ist nun besser, Rekursion oder Iteration? Zunächst: Jedes Problem, das sich rekursiv lösen lässt, lässt sich auch iterativ lösen, und umgekehrt. Man kann Rekursion immer durch Iteration (also Schleifen) und eine explizite (eigene) Umsetzung eines Aufrufstapels (zum Beispiel mit einem Vektor) nachbilden.</p>
              <p>Oft sind rekursive Algorithmen einfacher, kürzer und eleganter. Sie sind aber fast immer weniger effizient als iterative, wegen des Mehraufwands der Funktionsaufrufe und wegen der wiederholten Berechnung derselben Lösungen bei überlappenden Teilproblemen. Zudem kann eine grosse Rekursionstiefe zu einem Stapelüberlauf führen (wieder: undefiniertes Verhalten, meist ein Segmentation Fault). Um das Beste aus beiden Welten zu bekommen, entwirft man üblicherweise zuerst eine elegante rekursive Lösung und macht daraus mit einem systematischen Vorgehen, der <b>dynamischen Programmierung</b>, eine iterative. Das wird hier nicht weiter besprochen, sondern ist eines der Hauptthemen eines Kurses über Datenstrukturen und Algorithmen.</p>
            </>}
            en={<>
              <p>So what is better? Recursion or iteration? First of all, any problem that can be solved recursively can also be solved iteratively, and vice versa. It is always possible to simulate recursion using iteration (i.e., loops) and an explicit (i.e., own) implementation of a call stack (e.g., using a vector).</p>
              <p>Often, recursive algorithms are simpler, shorter, and more elegant. But they almost always are less efficient than iterative algorithms because of the overhead due to the function calls and because of repeated computations of the same solutions due to overlapping subproblems. In addition, large recursion depth can lead to stack overflow (again: undefined behavior, typically resulting in a segmentation fault). To get the best from both worlds, a standard approach is to first design an elegant recursive solution and then turn the recursive solution into an iterative one using a systematic approach called <b>dynamic programming</b>. This is not further discussed here, but will be one of the main topics of a data structures and algorithms course.</p>
            </>}
          />
        </Box>
        <table className="plain">
          <thead><tr><th></th><th>{tr('Rekursion', 'Recursion')}</th><th>{tr('Iteration (Schleife)', 'Iteration (loop)')}</th></tr></thead>
          <tbody>
            <tr><td>{tr('Lesbarkeit bei verschachtelten Problemen', 'Readability for nested problems')}</td><td>{tr('oft sehr gut', 'often very good')}</td><td>{tr('oft mühsam (eigener Stapel)', 'often tedious (own stack)')}</td></tr>
            <tr><td>{tr('Stapelspeicher', 'Stack memory')}</td><td>{tr('pro Aufruf ein Rahmen: Tiefe zählt', 'one frame per call: depth counts')}</td><td>{tr('konstant', 'constant')}</td></tr>
            <tr><td>{tr('Überlappende Teilprobleme', 'Overlapping subproblems')}</td><td>{tr('berechnet mehrfach (Fibonacci)', 'computed repeatedly (Fibonacci)')}</td><td>{tr('Zwischenergebnisse speichern', 'store intermediate results')}</td></tr>
            <tr><td>{tr('Typische Aufgaben', 'Typical tasks')}</td><td>{tr('Bäume, Ausdrücke, Aufzählungen', 'trees, expressions, enumerations')}</td><td>{tr('Summen, Zählen, Durchlaufen', 'sums, counting, traversing')}</td></tr>
          </tbody>
        </table>
        <Box kind="tip" title={<T de="Regeln für die Entscheidung" en="Rules for deciding" />}>
          <T
            de={<ul>
              <li><b>Gibt es eine einfache Schleife? Nimm sie.</b> Summe, Fakultät, Euklid, Fibonacci: alle gehen mit einer Schleife (bei Euklid sogar mit derselben Idee, wie in der ersten Lektion).</li>
              <li><b>Ist die Struktur der Aufgabe selbst verschachtelt, nimm Rekursion:</b> Alle Bitfolgen, Sudoku, Ausdrücke, Bäume. Hier sind Schleifen der Umweg.</li>
              <li><b>Rekursion mit überlappenden Teilproblemen nie naiv verwenden:</b> Zähle die Aufrufe. Wächst die Zahl schneller als die Aufgabe, merke dir Zwischenergebnisse (später: dynamische Programmierung).</li>
              <li><b>Prüfe die Tiefe:</b> Bei einer Tiefe, die mit <K>n</K> wächst und für <K>n</K> in die Hunderttausende gehen kann, ist eine Schleife sicherer.</li>
            </ul>}
            en={<ul>
              <li><b>Is there a simple loop? Take it.</b> Sum, factorial, Euclid, Fibonacci: all work with a loop (for Euclid even with the same idea as in the first lesson).</li>
              <li><b>If the structure of the task is itself nested, take recursion:</b> all bit strings, Sudoku, expressions, trees. Here loops are the detour.</li>
              <li><b>Never use recursion with overlapping subproblems naively:</b> count the calls. If the number grows faster than the task, remember intermediate results (later: dynamic programming).</li>
              <li><b>Check the depth:</b> with a depth that grows with <K>n</K> and <K>n</K> may go into the hundreds of thousands, a loop is safer.</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Warum ist <K>fibonacci(n)</K> mit der Schleife so viel schneller als <K>fib(n)</K>?</>} en={<>Why is <K>fibonacci(n)</K> with the loop so much faster than <K>fib(n)</K>?</>} />}
          choices={[
            { text: <T de="Weil jede Fibonacci-Zahl nur einmal berechnet wird." en="Because every Fibonacci number is computed only once." />, correct: true, why: <T de={<>Richtig: <K>n - 1</K> Additionen gegen exponentiell viele Aufrufe. Die Schleife merkt sich die beiden letzten Werte, die Rekursion vergisst, was sie schon berechnet hat.</>} en={<>Correct: <K>n - 1</K> additions against exponentially many calls. The loop remembers the last two values, the recursion forgets what it has already computed.</>} /> },
            { text: <T de="Weil Schleifen grundsätzlich schneller sind als Funktionsaufrufe." en="Because loops are fundamentally faster than function calls." />, why: <T de={<>Ein Funktionsaufruf kostet etwas mehr als ein Schleifendurchgang, aber nicht eine Grössenordnung. Der entscheidende Faktor ist die Zahl der Berechnungen: 45 Additionen gegen mehrere Milliarden Aufrufe.</>} en={<>A function call costs a little more than a loop pass, but not an order of magnitude. The decisive factor is the number of calculations: 45 additions against several billion calls.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="wichtig" title={<T de="4. Das Wichtigste" en="4. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li><K>fib(n) = fib(n-1) + fib(n-2)</K> ist korrekt, aber exponentiell langsam: Die Teilprobleme überlappen, und jedes wird immer wieder neu gelöst. Aufrufzahl für <K>n = 50</K>: über 40 Milliarden.</li>
              <li>Die Schleife mit zwei Merkvariablen berechnet jede Zahl einmal: <K>n - 1</K> Additionen. Mit <K>int</K> läuft sie ab <K>F47</K> über.</li>
              <li>Jede Rekursion lässt sich durch Iteration mit eigenem Stapel ersetzen und umgekehrt. Rekursion ist oft kürzer und klarer, aber fast immer langsamer und stapelhungriger.</li>
              <li>Üblich: erst eine elegante rekursive Lösung entwerfen, dann (bei überlappenden Teilproblemen) mit dynamischer Programmierung iterativ machen.</li>
            </ul>}
            en={<ul>
              <li><K>fib(n) = fib(n-1) + fib(n-2)</K> is correct but exponentially slow: the subproblems overlap, and each is solved anew again and again. Number of calls for <K>n = 50</K>: over 40 billion.</li>
              <li>The loop with two memory variables computes every number once: <K>n - 1</K> additions. With <K>int</K> it overflows from <K>F47</K> on.</li>
              <li>Every recursion can be replaced by iteration with a stack of its own and vice versa. Recursion is often shorter and clearer, but almost always slower and hungrier for stack.</li>
              <li>Usual: first design an elegant recursive solution, then (with overlapping subproblems) make it iterative with dynamic programming.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Zum Schluss:</b> Damit ist der Stoff der Notizen von der Idee eines Algorithmus bis zur Rekursion durchlaufen. Wer die sieben Kapitel verstanden hat, kann Programme lesen, nachrechnen (mit Tabelle und Speicherbild), entwerfen (schrittweise Verfeinerung, Verträge) und begründen, dass sie enden und stimmen.</p>}
          en={<p className="connections"><b>In closing:</b> this covers the material of the notes from the idea of an algorithm to recursion. Whoever has understood the seven chapters can read programs, trace them (with table and memory picture), design them (stepwise refinement, contracts) and argue that they terminate and are correct.</p>}
        />
      </Section>
    </article>
  );
}
