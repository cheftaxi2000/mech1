import { Box, Section, Src } from '../components/Blocks';
import { Code, K } from '../components/Code';
import { Choice } from '../components/Quiz';
import { M } from '../components/Tex';
import { T, useTr } from '../i18n';
import { P } from '../info/cpp/programs';
import { RectOverlap } from '../viz/info/FunctionFigures';
import { Listing, Tracer } from '../viz/info/Tracer';

const t = String.raw;

export default function I4Verfeinerung() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wie schreibt man ein Programm, das mehr als ein paar Zeilen hat? Nicht von vorne nach hinten, sondern von oben nach unten: erst die grobe Lösung, dann jedes Grobe feiner. Funktionen sind die Werkzeuge dafür. Wir üben es an einer Frage, die nach Mathematik klingt, aber ein Programm braucht: Überlappen zwei Rechtecke?</p>}
        en={<p className="lede">How do you write a program that has more than a few lines? Not from front to back, but from top to bottom: first the coarse solution, then each coarse part finer. Functions are the tools for this. We practice it on a question that sounds like mathematics but needs a program: do two rectangles overlap?</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="idee" title={<T de="1. Die Idee" en="1. The idea" />}>
        <Box kind="lecture" src={<Src p="83" />} title={<T de="Schrittweise Verfeinerung" en="Stepwise refinement" />}>
          <T
            de={<>
              <p>Funktionen strukturieren ein Programm. <b>Schrittweise Verfeinerung</b> ist eine Programmiertechnik, um komplexe Probleme zu lösen und eine vernünftige Struktur eines Programms zu finden. Sie geht auf Niklaus Wirth zurück, der den Namen in seinem Aufsatz über Programmentwicklung durch schrittweise Verfeinerung prägte.</p>
              <p>Die Idee ist einfach: Das Problem wird Schritt für Schritt gelöst. Man beginnt mit einer «Lösung», so grob wie möglich, auf hoher Abstraktionsebene. Diese Lösung enthält nur Kommentare und abstrakte Funktionsaufrufe. In jedem Schritt werden Kommentare durch Programmtext ersetzt, und Funktionen werden nach demselben Prinzip implementiert. Die Verfeinerung betrifft auch die Darstellung der Daten. Wird die Verfeinerung so weit wie möglich mit Funktionen umgesetzt, entstehen Teillösungen, die für andere Probleme wiederverwendet werden können.</p>
              <p>Ein wichtiger Aspekt: In jedem Schritt ist das Programm in einem Zustand, den ein <em>Compiler akzeptiert</em>.</p>
            </>}
            en={<>
              <p>Functions provide means to structure a program. <b>Stepwise refinement</b> is a programming technique to solve complex problems and to come up with a reasonable structure for a program. It goes back to Niklaus Wirth, who coined the name in his paper on program development by stepwise refinement.</p>
              <p>The idea is simple: the problem is solved step by step. You start with a “solution”, as coarse as it can be, on a high level of abstraction. This solution contains only comments and abstract function calls. At each step, comments are replaced by program text and functions are implemented using the same principle again. The refinement also refers to the development of data representation. If the refinement is realized as far as possible by functions, partial solutions emerge that might be used for other problems.</p>
              <p>One important aspect: in each step the program is in a state that can be <em>accepted by a compiler</em>.</p>
            </>}
          />
        </Box>
        <T
          de={<p><b>Warum das funktioniert.</b> Ein Mensch kann nur wenig auf einmal im Kopf behalten. Wer von vorne beginnt und gleich jede Einzelheit ausformuliert, verliert den Überblick und merkt zu spät, wenn der Ansatz nicht trägt. Wer oben beginnt, hat immer ein <em>lauffähiges</em> Programm: Man kann es testen, und jeder neue Schritt ist klein genug, dass man seinen Fehler sofort findet. Dass das Programm in jedem Schritt kompiliert, ist dabei keine Nebensache. Es ist die Sicherung: Ein Fehler, der nach einem Schritt auftaucht, liegt in diesem Schritt.</p>}
          en={<p><b>Why this works.</b> A human can only keep a little in mind at once. Whoever starts at the front and spells out every detail right away loses the overview and notices too late when the approach does not hold. Whoever starts at the top always has a <em>running</em> program: you can test it, and every new step is small enough to find its mistake at once. That the program compiles at every step is no side issue. It is the safety net: an error that shows up after a step lies in that step.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="modell" title={<T de="2. Erst modellieren" en="2. Model first" />}>
        <Box kind="lecture" src={<Src p="83–84" />} title={<T de="Zwei Rechtecke" en="Two rectangles" />}>
          <T
            de={<>
              <p>Wir wollen herausfinden, ob sich zwei Rechtecke überlappen. Wir beginnen mit der gröbsten Beschreibung der Lösung (Beispiel 6.16): <K>main</K> besteht aus drei Kommentaren («zwei Rechtecke einlesen», «gibt es eine Überlappung?», «Ergebnis ausgeben»).</p>
              <p>Ein Problem zu lösen heisst immer auch <b>modellieren</b>: Was sind die Umstände? Was brauchen wir? Wie modellieren wir Objekte mathematisch genau? Wo sind die Grenzen? Wie lautet die Frage? Wir modellieren ein Rechteck durch seine <em>linke untere Ecke</em> und zwei Zahlen für Breite und Höhe: <M p=".">{t`(x, y, w, h)`}</M> Das ist nicht die einzige Möglichkeit (man könnte auch zwei Punkte nehmen). Im Kontext der Bildanalyse soll ein Rechteck auch eine <em>Orientierung</em> haben, weshalb negative Werte für Breite und Höhe erlaubt sind.</p>
            </>}
            en={<>
              <p>We want to find out whether two rectangles overlap. We start with the coarsest possible description of the solution (Example 6.16): <K>main</K> consists of three comments (“input two rectangles”, “is there an overlap?”, “output the result”).</p>
              <p>Solving a problem always implies a <b>modeling</b> aspect: what are the circumstances? What do we need? How do we model objects in a mathematically rigorous way? What are the limits? What is the question? We model a rectangle by its <em>lower left corner</em> and two numbers for width and height: <M p=".">{t`(x, y, w, h)`}</M> This is not the only possibility (one could also use two points). Coming from the context of image analysis, a rectangle should also have an <em>orientation</em>, which is why negative values for width and height are allowed.</p>
            </>}
          />
        </Box>
        <T
          de={<p>Probiere es aus: Ziehe an den Reglern und beobachte, was <K>w &lt; 0</K> und <K>h &lt; 0</K> bedeuten. Der rote Punkt ist immer die Ecke <M p=".">{t`(x, y)`}</M> Mit negativem <K>w</K> wächst das Rechteck nach <em>links</em>, mit negativem <K>h</K> nach <em>unten</em>.</p>}
          en={<p>Try it: drag the sliders and watch what <K>w &lt; 0</K> and <K>h &lt; 0</K> mean. The red dot is always the corner <M p=".">{t`(x, y)`}</M> With negative <K>w</K> the rectangle grows to the <em>left</em>, with negative <K>h</K> <em>downward</em>.</p>}
        />
        <RectOverlap />
        <T
          de={<p>Unter dem Bild siehst du bereits die Lösung des Problems, in der Sprache der Intervalle: Die Rechtecke überlappen genau dann, wenn sich ihre <b><M>x</M>-Intervalle</b> (blau, unten) <em>und</em> ihre <b><M>y</M>-Intervalle</b> (gelb, links) überlappen. Zieh die Regler so, dass nur eines der beiden Paare überlappt: Dann gibt es kein gemeinsames Stück.</p>}
          en={<p>Under the picture you already see the solution of the problem, in the language of intervals: the rectangles overlap exactly if their <b><M>x</M> intervals</b> (blue, below) <em>and</em> their <b><M>y</M> intervals</b> (yellow, left) overlap. Drag the sliders so that only one of the two pairs overlaps: then there is no common piece.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="schritte" title={<T de="3. Die Schritte" en="3. The steps" />}>
        <T
          de={<p><b>Schritt 1: das Gerüst.</b> Wir tippen das Skelett aus Beispiel 6.16 ab. Es kompiliert, tut aber noch nichts.</p>}
          en={<p><b>Step 1: the skeleton.</b> We type in the skeleton from Example 6.16. It compiles but does nothing yet.</p>}
        />
        <Listing prog={P.rectStage1} label={tr('Schritt 1: nur Kommentare', 'Step 1: comments only')} />
        <Box kind="lecture" src={<Src p="84–85" />} title={<T de="Eingabe ergänzen" en="Adding input" />}>
          <T
            de={<p>Wir ergänzen die Eingabe der zwei Rechtecke <M>{t`(x_1, y_1, w_1, h_1)`}</M> und <M p=".">{t`(x_2, y_2, w_2, h_2)`}</M> Das Programm lässt sich schon kompilieren und testen: Fragt es den Benutzer nach zwei Rechtecken? Ein Testlauf bestätigt es.</p>}
            en={<p>We add the input of the two rectangles <M>{t`(x_1, y_1, w_1, h_1)`}</M> and <M p=".">{t`(x_2, y_2, w_2, h_2)`}</M> The program can already be compiled and tested: does it ask the user to enter two rectangles? A test run confirms it.</p>}
          />
        </Box>
        <Tracer prog={P.rectStage2} label={tr('Schritt 2: Eingabe (Beispiel 6.17)', 'Step 2: input (Example 6.17)')} />
        <T
          de={<p>Das Lösen der Hauptaufgabe wollen wir nicht in <K>main</K> selbst versuchen. Wir <b>delegieren</b> sie an eine Funktion <K>rectangles_overlap</K>, die es noch nicht gibt. Den Rest (Ergebnis ausgeben) tun wir direkt, er ist einfach genug.</p>}
          en={<p>We do not want to try to solve the main task in <K>main</K> itself. We <b>delegate</b> it to a function <K>rectangles_overlap</K>, which does not exist yet. The rest (output the result) we do directly; it is simple enough.</p>}
        />
        <Box kind="lecture" src={<Src p="85–86" />} title={<T de="Die Funktion deklarieren, damit alles kompiliert" en="Declare the function so that everything compiles" />}>
          <T
            de={<p>Damit das Programm kompiliert, ergänzen wir sofort die Funktion, zunächst als <b>Platzhalter</b>: Sie liefert vorerst immer <K>false</K> («todo»). <K>main</K> ist jetzt vollständig. Es bleibt, die Funktion zu implementieren. Vorher überlegen wir uns ihr genaues Verhalten und beschreiben es mit einer Vor- und Nachbedingung (Beispiel 6.20).</p>}
            en={<p>To keep the program compiling, we immediately add the function, at first as a <b>placeholder</b>: for now it always returns <K>false</K> (“todo”). <K>main</K> is now complete. What remains is to implement the function. Before that we think about its exact behavior and describe it with a pre- and postcondition (Example 6.20).</p>}
          />
        </Box>
        <Tracer prog={P.rectStage3} inputs={['0 0 2 2 1 1 2 2\n']} label={tr('Schritt 3: main fertig, der Platzhalter antwortet immer «kein Überlapp»', 'Step 3: main finished, the placeholder always answers “no overlap”')} />
        <T
          de={<p>Der Test zeigt es: Diese Rechtecke überlappen offensichtlich (sie teilen ein Quadrat), aber der Platzhalter sagt «<K>no overlap!</K>». Das ist kein Fehler im Verfahren, sondern der Zweck des Platzhalters: Du siehst <em>sofort</em>, dass der Rest des Programms funktioniert und nur diese eine Funktion fehlt.</p>}
          en={<p>The test shows it: these rectangles obviously overlap (they share a square), but the placeholder says “<K>no overlap!</K>”. That is no flaw in the method but the point of the placeholder: you see <em>at once</em> that the rest of the program works and only this one function is missing.</p>}
        />
        <Code code={'// PRE: (x1, y1, w1, h1), (x2, y2, w2, h2) are rectangles,\n//      where w1, h1, w2, h2 may be negative.\n// POST: returns true if (x1, y1, w1, h1) and\n//       (x2, y2, w2, h2) overlap'} label={tr('Der Vertrag (Beispiel 6.20)', 'The contract (Example 6.20)')} />
        <Box kind="lecture" src={<Src p="86–87" />} title={<T de="Auf kleinere Probleme zurückführen" en="Reduce to smaller problems" />}>
          <T
            de={<>
              <p>Wann überlappen zwei Rechtecke? Wir zeichnen das Bild und schliessen: <b>Genau dann, wenn ihre <M>x</M>- und <M>y</M>-Intervalle überlappen.</b> Das ist großartig: Wir können die Lösung wieder auf kleinere Probleme zurückführen (Beispiel 6.21): <K>rectangles_overlap</K> ruft zweimal die neue Funktion <K>intervals_overlap</K> auf, einmal für <K>[x1, x1 + w1]</K> und <K>[x2, x2 + w2]</K>, einmal für die <M>y</M>-Intervalle, und verknüpft die Ergebnisse mit <K>&amp;&amp;</K>.</p>
              <p>Wieder haben wir ein kleineres Problem, dessen gewünschtes Verhalten wir bereits in Vor- und Nachbedingung beschrieben haben (Beispiel 6.22): <K>// PRE: [a1, b1], [a2, b2] are (generalized) intervals, with [a,b] := [b,a] if a&gt;b</K>.</p>
            </>}
            en={<>
              <p>When do two rectangles overlap? We draw the picture and conclude: <b>if and only if their <M>x</M> and <M>y</M> intervals overlap.</b> That is great: we can again reduce the solution to smaller problems (Example 6.21): <K>rectangles_overlap</K> calls the new function <K>intervals_overlap</K> twice, once for <K>[x1, x1 + w1]</K> and <K>[x2, x2 + w2]</K>, once for the <M>y</M> intervals, and combines the results with <K>&amp;&amp;</K>.</p>
              <p>Again we have a smaller problem whose intended behavior we have already described in pre- and postcondition (Example 6.22): <K>// PRE: [a1, b1], [a2, b2] are (generalized) intervals, with [a,b] := [b,a] if a&gt;b</K>.</p>
            </>}
          />
        </Box>
        <T
          de={<p>«Verallgemeinertes Intervall» heisst: <K>[a, b]</K> gilt auch, wenn <K>a &gt; b</K> ist, dann ist es einfach <K>[b, a]</K>. So brauchen wir keine Fallunterscheidung für negative Breiten und Höhen: <K>x1 + w1</K> darf links von <K>x1</K> liegen.</p>}
          en={<p>“Generalized interval” means: <K>[a, b]</K> is also allowed when <K>a &gt; b</K>, then it is simply <K>[b, a]</K>. This way we need no case distinction for negative widths and heights: <K>x1 + w1</K> may lie to the left of <K>x1</K>.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="intervall" title={<T de="4. Der Kern: Intervalle" en="4. The core: intervals" />}>
        <Box kind="lecture" src={<Src p="87" />} title={<T de="Wann überlappen zwei Intervalle?" en="When do two intervals overlap?" />}>
          <T
            de={<>
              <p>Um das Problem der Intervall-Überlappung zu lösen, fragen wir uns die <em>verneinte</em> Frage: Wann überlappen sich zwei Intervalle <em>nicht</em>? Dann, wenn der linke Punkt des einen rechts vom rechten Punkt des anderen liegt, oder umgekehrt:</p>
              <p><M>{t`\min(a_1, b_1) > \max(a_2, b_2) \;\lor\; \min(a_2, b_2) > \max(a_1, b_1)`}</M></p>
              <p>Mit dem Gesetz von De Morgan ergibt sich die Bedingung, wann sie überlappen:</p>
              <p><M>{t`\min(a_1, b_1) \le \max(a_2, b_2) \;\land\; \min(a_2, b_2) \le \max(a_1, b_1)`}</M></p>
            </>}
            en={<>
              <p>To come up with a solution to the interval problem, we ask ourselves the <em>negated</em> question: when do two intervals <em>not</em> overlap? They do not overlap if the left point of one interval is to the right of the right point of the other, or the other way round:</p>
              <p><M>{t`\min(a_1, b_1) > \max(a_2, b_2) \;\lor\; \min(a_2, b_2) > \max(a_1, b_1)`}</M></p>
              <p>Applying De Morgan’s law yields the condition when they overlap:</p>
              <p><M>{t`\min(a_1, b_1) \le \max(a_2, b_2) \;\land\; \min(a_2, b_2) \le \max(a_1, b_1)`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>Der Trick mit der verneinten Frage.</b> «Wann überlappen sie?» hat viele Fälle (links ragend, rechts ragend, eines liegt im anderen, gleiche Grenzen …). «Wann überlappen sie <em>nicht</em>?» hat nur zwei: eines liegt ganz links, oder eines liegt ganz rechts. Das Gegenteil davon ist die Antwort. Das Skript bemerkt, dass die verneinte Frage oft einfacher zu sehen ist; das ist eine Frage der Intuition.</p>
            <p>Jetzt in C++, mit den Funktionen <K>std::min</K> und <K>std::max</K> aus der Standardbibliothek: Wir implementieren sie nicht selbst (siehe die letzte Lektion dieses Kapitels).</p>
          </>}
          en={<>
            <p><b>The trick with the negated question.</b> “When do they overlap?” has many cases (sticking out left, sticking out right, one inside the other, equal borders …). “When do they <em>not</em> overlap?” has only two: one lies completely to the left, or one lies completely to the right. The opposite of that is the answer. The notes remark that the negated question often seems simpler; that depends on your intuition.</p>
            <p>Now in C++, with the functions <K>std::min</K> and <K>std::max</K> from the standard library: we do not implement them ourselves (see the last lesson of this chapter).</p>
          </>}
        />
        <Tracer stack prog={P.rectFinal} inputs={['0 0 2 2 1 1 2 2\n', '0 0 1 1 5 5 1 1\n', '0 0 1 1 1 0 1 1\n', '2 2 -2 -2 0 0 1 1\n']} label={tr('Code 6.2: das fertige Programm', 'Code 6.2: the finished program')} />
        <T
          de={<>
            <p>Beobachte im Stapel, wie <K>rectangles_overlap</K> die Funktion <K>intervals_overlap</K> aufruft: erst für die <M>x</M>-Intervalle; nur wenn die überlappen, wird auch die <M>y</M>-Version überhaupt aufgerufen (<K>&amp;&amp;</K> wertet den rechten Teil nur aus, wenn der linke wahr ist; vgl. Kurzschlussauswertung). Probiere die vier Eingaben: überlappend, getrennt, <em>berührend</em> (die Rechtecke teilen nur eine Kante: das Programm zählt das als Überlapp, weil die Intervalle <em>abgeschlossen</em> sind) und eines mit negativer Breite und Höhe.</p>
          </>}
          en={<>
            <p>Watch in the stack how <K>rectangles_overlap</K> calls <K>intervals_overlap</K>: first for the <M>x</M> intervals; only if they overlap is the <M>y</M> version called at all (<K>&amp;&amp;</K> evaluates the right part only if the left is true; cf. short-circuit evaluation). Try the four inputs: overlapping, separate, <em>touching</em> (the rectangles share only an edge: the program counts that as overlap because the intervals are <em>closed</em>) and one with negative width and height.</p>
          </>}
        />
        <Box kind="lecture" src={<Src p="88" />} title={<T de="Was wir erreicht haben" en="What we have achieved" />}>
          <T
            de={<>
              <p>Nichts bleibt zu implementieren, und wir haben eine Lösung in relativ einfachen Schritten erreicht (Code 6.2). Was haben wir erreicht? Eine saubere Lösung des Problems. Auf dem Weg haben wir Lösungen für Teilprobleme mit Funktionen entwickelt, die auch in anderen Zusammenhängen nützlich sein können.</p>
              <p>Der Ansatz war <b>von oben nach unten</b> (<span lang="en">top-down</span>): Wir lösten ein Problem, indem wir es auf kleinere Probleme zurückführten, die wir wieder auf kleinere zurückführten. Der Vorteil: Wir bleiben beim ursprünglichen Problem und entdecken Wege, es in Teilprobleme zu zerlegen, indem wir alle Aspekte des Problems (und seiner Teilprobleme) betrachten.</p>
              <p>Was wir hier nicht genauer besprochen haben, ist das <b>Testen</b>. Sind die kleinsten Bausteine bekannt, können (und sollten) sie einzeln getestet werden: erst Minimum und Maximum (falls selbst implementiert), dann die Intervall-Lösung und erst dann die Rechteck-Lösung. Testen heisst meist, die Funktionen mit vielen möglichen Fällen zu füttern und dabei aktiv nach Randfällen zu suchen, die nicht funktionieren.</p>
            </>}
            en={<>
              <p>Nothing remains to be implemented, and we have achieved a solution in relatively simple steps (Code 6.2). What have we achieved? A clean solution of the problem. On the way we have developed solutions for sub-problems with functions that might be useful in other contexts as well.</p>
              <p>The approach was <b>top-down</b>: we solved a problem by reducing it to smaller problems that we reduced again to smaller problems. The advantage: we keep on track with our initial problem and discover ways to partition it into smaller problems by considering all aspects of the problem (and its sub-problems).</p>
              <p>What we have not discussed in much detail is <b>testing</b>. Once the smallest building blocks are known, they can (and should) be tested in isolation: first minimum and maximum (if implemented ourselves), then the interval solution and only then the rectangle solution. Testing usually means feeding the functions with many possible cases, thereby actively trying to find border cases that do not work.</p>
            </>}
          />
        </Box>
        <Box kind="tip" title={<T de="So testest du eine Funktion wie intervals_overlap" en="How to test a function like intervals_overlap" />}>
          <T
            de={<ul>
              <li><b>Randfälle zuerst:</b> Intervalle, die sich nur an einem Punkt berühren, gleiche Intervalle, ein Intervall im anderen, leere Länge (<K>a == b</K>), umgekehrte Reihenfolge (<K>a &gt; b</K>).</li>
              <li><b>Beide Richtungen:</b> Teste <K>(I1, I2)</K> und <K>(I2, I1)</K>. Die Funktion ist symmetrisch, das Ergebnis muss es auch sein.</li>
              <li><b>Gegenprobe im Kopf oder per Brute Force:</b> Für kleine ganze Zahlen kann man alle Kombinationen durchprobieren und mit einer einfachen, offensichtlich richtigen Methode vergleichen. (Der Test in diesem Projekt macht genau das, für alle Endpunkte von <K>-2</K> bis <K>2</K>.)</li>
            </ul>}
            en={<ul>
              <li><b>Edge cases first:</b> intervals that touch at a single point, identical intervals, one interval inside the other, zero length (<K>a == b</K>), reversed order (<K>a &gt; b</K>).</li>
              <li><b>Both directions:</b> test <K>(I1, I2)</K> and <K>(I2, I1)</K>. The function is symmetric, so the result must be too.</li>
              <li><b>A cross-check in your head or by brute force:</b> for small integers you can try all combinations and compare with a simple, obviously correct method. (The test in this project does exactly that, for all endpoints from <K>-2</K> to <K>2</K>.)</li>
            </ul>}
          />
        </Box>
        <Choice
          question={<T de={<>Rechteck 1 ist <K>(0, 0, 1, 1)</K>, Rechteck 2 ist <K>(1, 1, 1, 1)</K>. Sie berühren sich nur an der Ecke <K>(1, 1)</K>. Was gibt das Programm aus?</>} en={<>Rectangle 1 is <K>(0, 0, 1, 1)</K>, rectangle 2 is <K>(1, 1, 1, 1)</K>. They touch only at the corner <K>(1, 1)</K>. What does the program print?</>} />}
          choices={[
            { text: <K>overlap!</K>, correct: true, why: <T de={<>Richtig: Die <M>x</M>-Intervalle <K>[0, 1]</K> und <K>[1, 2]</K> teilen den Punkt 1, ebenso die <M>y</M>-Intervalle. Die Bedingung mit <K>&gt;=</K> und <K>&lt;=</K> zählt eine gemeinsame Grenze als Überlappung. Will man das nicht, muss man <K>&gt;</K> und <K>&lt;</K> verwenden. Das ist eine Entscheidung, die in die Nachbedingung gehört.</>} en={<>Correct: the <M>x</M> intervals <K>[0, 1]</K> and <K>[1, 2]</K> share the point 1, and so do the <M>y</M> intervals. The condition with <K>&gt;=</K> and <K>&lt;=</K> counts a shared border as overlap. If you do not want that, you must use <K>&gt;</K> and <K>&lt;</K>. That is a decision that belongs in the postcondition.</>} /> },
            { text: <K>no overlap!</K>, why: <T de={<>Das wäre mit offenen Intervallen so. Hier sind sie abgeschlossen, ein gemeinsamer Randpunkt reicht.</>} en={<>That would be so with open intervals. Here they are closed; one shared border point suffices.</>} /> },
          ]}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="wichtig" title={<T de="5. Das Wichtigste" en="5. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Schrittweise Verfeinerung: grob beginnen (Kommentare und Funktionsaufrufe), jeden Schritt feiner machen. In jedem Schritt kompiliert das Programm; Platzhalter-Funktionen halten es lauffähig.</li>
              <li>Erst <em>modellieren</em>: Wie stellen wir die Objekte dar (Ecke, Breite, Höhe), was ist erlaubt (negative Breite)?</li>
              <li>Vor dem Implementieren den Vertrag (Vor- und Nachbedingung) hinschreiben. Dann weiss man, was die Funktion leisten muss.</li>
              <li>Schwierige Frage? Prüfe die verneinte Frage, und zerlege in kleinere Funktionen. Zwei Rechtecke überlappen genau dann, wenn ihre <M>x</M>- und <M>y</M>-Intervalle überlappen.</li>
              <li>Teste die kleinsten Bausteine zuerst, mit Randfällen.</li>
            </ul>}
            en={<ul>
              <li>Stepwise refinement: start coarse (comments and function calls), make every step finer. At each step the program compiles; placeholder functions keep it running.</li>
              <li>First <em>model</em>: how do we represent the objects (corner, width, height), what is allowed (negative width)?</li>
              <li>Write down the contract (pre- and postcondition) before implementing. Then you know what the function must achieve.</li>
              <li>Hard question? Check the negated question, and split into smaller functions. Two rectangles overlap exactly if their <M>x</M> and <M>y</M> intervals overlap.</li>
              <li>Test the smallest building blocks first, with edge cases.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Wo darf man eine Funktion überhaupt benutzen? Wie teilt man ein Programm auf mehrere Dateien auf, und was tut der Linker? (Skript S. 88–94)</p>}
          en={<p className="connections"><b>Next:</b> where may a function be used at all? How do you split a program across several files, and what does the linker do? (notes pp. 88–94)</p>}
        />
      </Section>
    </article>
  );
}
