import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I7Rekursion() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Eine Funktion darf sich selbst aufrufen. Das klingt nach einem Zirkelschluss und ist trotzdem eine der mächtigsten Ideen der Informatik. Wer sie verstanden hat, löst Probleme, für die es sonst kaum einfache Lösungen gibt. Diese Lektion beginnt mit der Fakultät, zeigt, was eine rekursive Funktion braucht, damit sie endet, und was passiert, wenn sie nicht endet.</p>}
        en={<p className="lede">A function may call itself. That sounds like circular reasoning and is nevertheless one of the most powerful ideas of computer science. Whoever has understood it solves problems for which there are hardly any simple solutions otherwise. This lesson starts with the factorial, shows what a recursive function needs in order to end, and what happens if it does not end.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="fak" title={<T de="1. Ein Beispiel: die Fakultät" en="1. An example: the factorial" />}>
        <Box kind="lecture" src={<Src p="119" />} title={<T de="Rekursive Definition" en="Recursive definition" />}>
          <T
            de={<>
              <p>Viele mathematische Funktionen sind (oder können) <b>rekursiv</b> definiert werden, das heisst: Die Funktion kommt in ihrer eigenen Definition vor. Hier die rekursive Definition der Fakultät:</p>
              <p><M>{t`n! = \begin{cases} 1, & \text{falls } n \le 1 \\ (n-1)! \cdot n, & \text{sonst} \end{cases}`}</M></p>
              <p>Der Wert von <M>{t`n!`}</M> ist durch den Wert von <M>{t`(n-1)!`}</M> definiert. Es ist lehrreich, sich diese Definition so zu denken: «Wenn wir die Fakultät <M>{t`(n-1)!`}</M> schon kennen, dann können wir <M>{t`n!`}</M> berechnen, indem wir <M>{t`(n-1)!`}</M> mit <M>n</M> multiplizieren.»</p>
              <p>Zum Beispiel ist <M>{t`4!`}</M> durch <M>{t`3! \cdot 4`}</M> definiert, wobei <M>{t`3!`}</M> durch <M>{t`2! \cdot 3`}</M> definiert ist, <M>{t`2! = 1! \cdot 2`}</M> und <M p=".">{t`1! = 1`}</M> Zusammengesetzt: <M p=",">{t`4! = 3! \cdot 4 = 2! \cdot 3 \cdot 4 = 1! \cdot 2 \cdot 3 \cdot 4 = 1 \cdot 2 \cdot 3 \cdot 4 = 24`}</M> das richtige Ergebnis.</p>
            </>}
            en={<>
              <p>Many mathematical functions are (or at least can be) naturally defined <b>recursively</b>, meaning that the function appears in its own definition. For instance, here is the recursive definition of the factorial:</p>
              <p><M>{t`n! = \begin{cases} 1, & \text{if } n \le 1 \\ (n-1)! \cdot n, & \text{otherwise} \end{cases}`}</M></p>
              <p>The value of <M>{t`n!`}</M> is defined in terms of the value of <M p=".">{t`(n-1)!`}</M> It is instructive to think about this definition as “If we already know the factorial <M p=",">{t`(n-1)!`}</M> then we can compute <M>{t`n!`}</M> by multiplying <M>{t`(n-1)!`}</M> with <M p=".">n</M>”</p>
              <p>For instance, the value of <M>{t`4!`}</M> is defined as <M p=",">{t`3! \cdot 4`}</M> where <M>{t`3!`}</M> is defined as <M p=",">{t`2! \cdot 3`}</M> where <M>{t`2! = 1! \cdot 2`}</M> and <M p=".">{t`1! = 1`}</M> Putting this together, we get <M p=",">{t`4! = 3! \cdot 4 = 2! \cdot 3 \cdot 4 = 1! \cdot 2 \cdot 3 \cdot 4 = 1 \cdot 2 \cdot 3 \cdot 4 = 24`}</M> the correct result!</p>
            </>}
          />
        </Box>
        <Box kind="lecture" src={<Src p="119" />} title={<T de="In C++ genauso" en="In C++ exactly the same" />}>
          <T
            de={<>
              <p>In C++ funktioniert es genau gleich: Um den Rückgabewert von <K>fac(n)</K> zu berechnen, benutzt das Programm den Rückgabewert von <K>fac(n-1)</K>:</p>
              <Code code={'// POST: return value is n!\nint fac(int n) {\n    if (n <= 1) return 1;\n    else return fac(n-1) * n;\n}'} />
              <p>Beim Aufruf von <K>fac(4)</K> ruft die Funktion <K>fac(3)</K> auf, diese <K>fac(2)</K>, und diese schliesslich <K>fac(1)</K>. Im letzten Aufruf ist die <K>if</K>-Bedingung wahr, die Funktion gibt 1 zurück. Jetzt kann <K>fac(2)</K> ihren Rückgabewert <K>fac(1) * 2</K> berechnen: Sie gibt 2 zurück. Dann berechnet <K>fac(3)</K> den Wert <K>fac(2) * 3</K> und gibt 6 zurück. Schliesslich berechnet <K>fac(4)</K> den Wert <K>fac(3) * 4</K> und gibt 24 an den ursprünglichen Aufrufer zurück.</p>
            </>}
            en={<>
              <p>In C++, this works exactly the same: to compute the return value of <K>fac(n)</K>, the program uses the return value of <K>fac(n-1)</K>:</p>
              <Code code={'// POST: return value is n!\nint fac(int n) {\n    if (n <= 1) return 1;\n    else return fac(n-1) * n;\n}'} />
              <p>When we call <K>fac(4)</K>, the function calls <K>fac(3)</K>, which in turn calls <K>fac(2)</K>, which eventually calls <K>fac(1)</K>. In the last call, the <K>if</K> condition is true, which leads to the function returning 1. The function call <K>fac(2)</K> now can compute its return value <K>fac(1) * 2</K>: it returns 2. Next, the function <K>fac(3)</K> computes its return value <K>fac(2) * 3</K> and thus returns 6. Finally, <K>fac(4)</K> computes its return value <K>fac(3) * 4</K> and hence returns 24 to the initial caller of <K>fac(4)</K>.</p>
            </>}
          />
        </Box>
        <Tracer stack tree prog={P.facRec} label={tr('fac(4): die Aufrufe bauen sich auf und dann wieder ab', 'fac(4): the calls build up and then come down again')} />
        <T
          de={<>
            <p><b>So liest du den Ablauf.</b> Drücke mehrmals auf «Schritt» und beobachte zwei Bilder gleichzeitig. <em>Rechts oben</em> wächst der Stapel der Kästen: Für jeden Aufruf von <K>fac</K> kommt ein neuer Kasten mit <em>seinem eigenen</em> <K>n</K> dazu (4, 3, 2, 1). <em>Unter dem Code</em> wächst der Aufrufbaum: Ein Aufruf nach dem anderen, jeder im vorigen. Nichts wird berechnet, bis <K>fac(1)</K> erreicht ist. Dort wird 1 zurückgegeben, und jetzt füllt sich der Baum <em>von unten nach oben</em> mit Werten: <K>1</K>, dann <K>2</K>, <K>6</K>, <K>24</K>. Jedes <K>→ Wert</K> an einem Knoten ist die Antwort, die der Aufrufer wartete.</p>
            <p>Das Entscheidende: <em>Alle vier Aufrufe sind gleichzeitig aktiv</em>, bis der innerste zurückkehrt. Vier Kästen, vier verschiedene <K>n</K>. Die Variable <K>n</K> in <K>fac(3)</K> ist eine andere als die in <K>fac(4)</K>, weil jeder Aufruf seine eigenen lokalen Variablen hat (Lektion über Aufrufe).</p>
          </>}
          en={<>
            <p><b>How to read the run.</b> Press “Step” several times and watch two pictures at once. <em>Top right</em> the stack of boxes grows: for every call of <K>fac</K> a new box with <em>its own</em> <K>n</K> is added (4, 3, 2, 1). <em>Under the code</em> the call tree grows: one call after the other, each inside the previous one. Nothing is computed until <K>fac(1)</K> is reached. There 1 is returned, and now the tree fills with values <em>from the bottom up</em>: <K>1</K>, then <K>2</K>, <K>6</K>, <K>24</K>. Each <K>→ value</K> at a node is the answer its caller was waiting for.</p>
            <p>The crucial point: <em>all four calls are active at the same time</em> until the innermost one returns. Four boxes, four different <K>n</K>. The variable <K>n</K> in <K>fac(3)</K> is a different one from that in <K>fac(4)</K>, because every call has its own local variables (lesson on calls).</p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="ende" title={<T de="2. Damit die Rekursion endet" en="2. So that the recursion ends" />}>
        <Box kind="lecture" src={<Src p="119–120" />} title={<T de="Basisfall und Fortschritt" en="Base case and progress" />}>
          <T
            de={<>
              <p>Allgemein heisst eine Funktion, die sich selbst aufruft, <b>rekursive Funktion</b>. In ihrer einfachsten Form sieht eine rekursive Funktion so aus: <K>void f() {'{ f(); }'}</K>. Diese Funktion ist aber nicht sehr nützlich: Beim Aufruf ruft sie sich für immer selbst wieder auf (genauer: bis der Aufrufstapel überläuft). Sie ist so hilfreich wie die Definition des Euro von Wim Duisenberg: «Ein Euro ist ein Euro.»</p>
              <p>In C++ ist diese unendliche Rekursion so schlimm wie eine Endlosschleife, aber noch schlimmer: Sie verbraucht Zeit <em>und</em> Speicher. Um nützlichen Code mit Rekursion zu schreiben, müssen wir die Terminierung garantieren. Wie bei Schleifen brauchen wir also einen (garantierten) Fortschritt auf eine Abbruchbedingung hin, die die Rekursion beendet. Im Beispiel endete die Rekursion bei <M>{t`n \le 1`}</M> (dann wird 1 zurückgegeben). Diesen nicht-rekursiven Fall nennen wir den <b>Basisfall</b>. Ist der Basisfall erreicht, endet die Rekursion. In jedem <b>rekursiven Fall</b> (einem Fall, der kein Basisfall ist und daher einen rekursiven Aufruf hat) erfolgt der rekursive Aufruf mit einem streng kleineren Argument (von <K>n</K> auf <K>n - 1</K>), näher an der Abbruchbedingung. Die Abbruchbedingung wird also irgendwann erreicht; die Rekursion ist endlich.</p>
              <p>Es ist daher wesentlich, dass eine Rekursion (ob rekursive mathematische Definition oder rekursive C++-Funktion) aus mindestens einem Basisfall und mindestens einem rekursiven Fall besteht, der sich mit den rekursiven Aufrufen dem Basisfall nähert. Eine sinnvolle rekursive Funktion enthält also immer eine <K>if</K>-Anweisung, die prüft, ob der Basisfall erreicht ist.</p>
            </>}
            en={<>
              <p>In general, a function that calls itself is called a <b>recursive function</b>. In its simplest form, a recursive function looks as follows: <K>void f() {'{ f(); }'}</K>. But this function is not very useful: when called, it keeps calling itself forever (or rather until the call stack overflows). It is as helpful as the following definition of the Euro by Wim Duisenberg: “<span lang="de">Ein Euro ist ein Euro.</span>”</p>
              <p>In C++, this infinite recursion is as bad as an infinite loop, but even worse: it burns time <em>and</em> memory. To write useful code with recursion, we need to guarantee termination. As with loops, we thus need a (guaranteed) progress towards a termination condition that stops the recursion. For the example before, the recursion ended when <M>{t`n \le 1`}</M> (in which case 1 is returned). We call this non-recursive case the <b>base case</b>. Once the base case is reached, the recursion terminates. In each <b>recursive case</b> (i.e., a case that is not a base case and thus has a recursive call), the recursive call is made with a strictly smaller argument (from <K>n</K> to <K>n - 1</K>) closer to the termination condition. The termination condition thus will be reached eventually; the recursion is finite.</p>
              <p>It is thus essential for recursion (whether it is a recursive mathematical definition or a recursive C++ function) to consist of at least one base case and at least one recursive case that is moving closer towards the base case with the recursive calls. A reasonable recursive function thus will always contain an <K>if</K> statement checking whether the base case has been reached.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Was geschieht, wenn der Basisfall fehlt? Der Rechner führt die Funktion Aufruf um Aufruf tiefer, und der Stapel wächst, bis kein Platz mehr da ist. Im Ablauf unten ist der Stapel <em>absichtlich klein</em> gehalten: Der Modellrechner bricht nach etwa 120 geschachtelten Aufrufen ab.</p>}
          en={<p>What happens when the base case is missing? The computer goes deeper call by call, and the stack grows until there is no space left. In the run below the stack is <em>deliberately kept small</em>: the model computer stops after about 120 nested calls.</p>}
        />
        <Tracer stack prog={P.infRec} label={tr('Rekursion ohne Basisfall', 'Recursion without a base case')} />
        <T
          de={<>
            <p>Hier siehst du, dass die Kästen im Stapel immer weiter wachsen, bis der Rechner abbricht. Der echte Rechner hat Platz für zehntausende Aufrufe (der Stapel ist meist einige Megabyte gross), das Ergebnis ist aber dasselbe: Er endet mit einem <b>Stapelüberlauf</b> (<span lang="en">stack overflow</span>), und das ist undefiniertes Verhalten, in der Regel ein «Segmentation fault». Der Test in diesem Projekt führt das Programm mit g++ aus und prüft, dass es mit dem Signal <K>SIGSEGV</K> endet.</p>
            <p>Eine Endlosschleife verschwendet nur Zeit, ein Programm läuft weiter. Die unendliche Rekursion stürzt ab, weil jeder Aufruf Speicher braucht. Dafür findet man sie meist schneller.</p>
          </>}
          en={<>
            <p>Here you see that the boxes in the stack keep growing until the computer gives up. The real computer has room for tens of thousands of calls (the stack is usually a few megabytes large), but the result is the same: it ends with a <b>stack overflow</b>, which is undefined behavior, usually a “segmentation fault”. This project’s test runs the program with g++ and checks that it ends with the signal <K>SIGSEGV</K>.</p>
            <p>An endless loop only wastes time, a program keeps running. Infinite recursion crashes because every call needs memory. But usually you find it faster.</p>
          </>}
        />
        <Box kind="tip" title={<T de="Die drei Fragen vor jeder rekursiven Funktion" en="The three questions before every recursive function" />}>
          <T
            de={<ol>
              <li><b>Was ist der Basisfall?</b> Der Fall, der ohne weiteren Aufruf beantwortet werden kann. (Bei <K>fac</K>: <K>n &lt;= 1</K>.) Schreibe ihn <em>zuerst</em>.</li>
              <li><b>Wie nähert sich jeder rekursive Aufruf dem Basisfall?</b> Es muss ein <em>messbarer</em> Fortschritt sein (<K>n</K> wird kleiner, der Bereich schrumpft). Prüfe, dass der Basisfall <em>jeden</em> Weg beendet: Was passiert mit <K>fac(0)</K>? Mit <K>fac(-5)</K>? (<K>n &lt;= 1</K> fängt beides ab. Mit <K>n == 1</K> als Basisfall würde <K>fac(0)</K> unendlich rekursieren.)</li>
              <li><b>Glaube an den rekursiven Aufruf.</b> Nimm an, <K>fac(n-1)</K> liefere schon das richtige Ergebnis, und prüfe nur, ob du daraus das Ergebnis für <K>n</K> baust (<K>* n</K>). Das ist wie bei einem Beweis durch Induktion: Man muss nicht alle Aufrufe gleichzeitig im Kopf verfolgen.</li>
            </ol>}
            en={<ol>
              <li><b>What is the base case?</b> The case that can be answered without a further call. (For <K>fac</K>: <K>n &lt;= 1</K>.) Write it <em>first</em>.</li>
              <li><b>How does each recursive call approach the base case?</b> There must be <em>measurable</em> progress (<K>n</K> gets smaller, the range shrinks). Check that the base case ends <em>every</em> path: what happens with <K>fac(0)</K>? With <K>fac(-5)</K>? (<K>n &lt;= 1</K> catches both. With <K>n == 1</K> as the base case <K>fac(0)</K> would recurse infinitely.)</li>
              <li><b>Believe in the recursive call.</b> Assume <K>fac(n-1)</K> already delivers the right result, and check only whether you build the result for <K>n</K> from it (<K>* n</K>). This is like a proof by induction: you need not follow all calls in your head at once.</li>
            </ol>}
          />
        </Box>
        <Choice
          question={<T de={<>Was ist an <K>int f(int n) {'{ return n * f(n - 1); }'}</K> falsch?</>} en={<>What is wrong with <K>int f(int n) {'{ return n * f(n - 1); }'}</K>?</>} />}
          choices={[
            { text: <T de="Es fehlt der Basisfall: Die Rekursion endet nie." en="The base case is missing: the recursion never ends." />, correct: true, why: <T de={<>Richtig. Es gibt keinen Fall ohne rekursiven Aufruf, also kommt das Programm nie zu einem <K>return</K> mit einem Wert und endet im Stapelüberlauf. Mit <K>if (n &lt;= 1) return 1;</K> davor wäre es die Fakultät.</>} en={<>Correct. There is no case without a recursive call, so the program never reaches a <K>return</K> with a value and ends in a stack overflow. With <K>if (n &lt;= 1) return 1;</K> in front it would be the factorial.</>} /> },
            { text: <T de={<>Der rekursive Aufruf mit <K>n - 1</K> ist verboten.</>} en={<>The recursive call with <K>n - 1</K> is forbidden.</>} />, why: <T de={<>Nein, <K>f(n - 1)</K> ist genau der gewollte Fortschritt. Das Problem ist, dass nichts ihn beendet.</>} en={<>No, <K>f(n - 1)</K> is exactly the intended progress. The problem is that nothing stops it.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="wichtig" title={<T de="3. Das Wichtigste" en="3. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Rekursion: Eine Funktion ruft sich selbst auf. Sie braucht mindestens einen <b>Basisfall</b> (ohne rekursiven Aufruf) und mindestens einen <b>rekursiven Fall</b> mit Fortschritt zum Basisfall.</li>
              <li>Jeder Aufruf hat seine eigenen Variablen. Alle noch nicht beendeten Aufrufe sind gleichzeitig aktiv und liegen als Kästen übereinander.</li>
              <li>Das Ergebnis entsteht beim <em>Zurückkehren</em>: von unten nach oben im Aufrufbaum.</li>
              <li>Fehlt der Basisfall oder der Fortschritt: Stapelüberlauf (undefiniertes Verhalten, meist Absturz).</li>
            </ul>}
            en={<ul>
              <li>Recursion: a function calls itself. It needs at least one <b>base case</b> (without a recursive call) and at least one <b>recursive case</b> with progress towards the base case.</li>
              <li>Every call has its own variables. All calls not yet finished are active at the same time and lie on top of each other as boxes.</li>
              <li>The result arises on <em>returning</em>: from the bottom up in the call tree.</li>
              <li>If the base case or the progress is missing: stack overflow (undefined behavior, usually a crash).</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Was passiert im Speicher genau, wenn sich eine Funktion selbst aufruft? Und ein zweites Beispiel, bei dem man nicht sofort sieht, dass es endet: der grösste gemeinsame Teiler (Skript S. 120–123).</p>}
          en={<p className="connections"><b>Next:</b> what exactly happens in memory when a function calls itself? And a second example where it is not immediately visible that it ends: the greatest common divisor (notes pp. 120–123).</p>}
        />
      </Section>
    </article>
  );
}
