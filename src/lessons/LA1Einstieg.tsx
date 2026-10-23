import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { CourseRoadmap } from '../viz/la/CourseRoadmap';
import { StressMachine } from '../viz/la/StressMachine';
import '../viz/la/l12.css';

const t = String.raw;

export default function LA1Einstieg() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Wozu braucht ein Maschinenbauer Lineare Algebra? Weil fast jede Maschine, die man später rechnet, am Ende durch eine <b>Matrix</b> beschrieben wird: ein Quadrat unter Last, ein schwingendes Gerät, eine Regelung. Diese Lektion zeigt das an einem Bild, dann folgen der Kursplan, die Organisation und eine Minute MATLAB.</p>}
        en={<p className="lede">Why does a mechanical engineer need linear algebra? Because almost every machine you will calculate later is described by a <b>matrix</b> in the end: a square under load, a vibrating device, a control loop. This lesson shows it in one picture, then comes the course plan, the organisation and one minute of MATLAB.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Eine Matrix ist wie eine Maschine mit einem Schlitz: Oben wirft man einen Pfeil hinein, unten kommt ein neuer Pfeil heraus. Die Zahlen in der Matrix sind die Bauanleitung der Maschine. Wer die Zahlen lesen kann, sieht, was die Maschine mit dem ganzen Raum macht.</p>}
          en={<p>A matrix is like a machine with a slot: you drop an arrow in at the top and a new arrow comes out at the bottom. The numbers in the matrix are the building plan of the machine. If you can read the numbers, you can see what the machine does to the whole plane.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="maschine" title={<T de="1. Eine Matrix beschreibt eine Maschine" en="1. A matrix describes a machine" />}>
        <Box kind="uebung" src={<Src u={1} vis="Seven Machines, One Toolbox" />}
          title={<T de={<>«Warum Lineare Algebra?» (Folie 4)</>} en={<>“Why LinAlg?” (slide 4)</>} />}>
          <T
            de={<>
              <p>Die Folie 4 ist nur der Titel «Why LinAlg?»; der Inhalt ist die interaktive Visualisierung «Seven Machines, One Toolbox»: Jede Szene zeigt zuerst eine Bewegung und blendet dann die Matrix ein, die sie beschreibt.</p>
              <p><b>Szene «Mechanics II»</b> (die Szene, die wir hier nachbauen): Ein Quadrat steht unter Last, erst einachsig, dann zweiachsig, dann reiner Schub. Die Verformung ist <M>{t`\times 40`}</M> übertrieben. Danach erscheint die Verformungsmatrix <M>F</M> mit Zahlen, die sich live ändern, und die beiden Basispfeile <M>e_1</M> und <M>e_2</M> zeigen auf die Spalten von <M p=".">F</M></p>
              <p><b>Die anderen fünf Maschinen</b> (jeweils mit ihrer Matrix): Analysis II, die quadratische Form <M>{t`z = x^{\top}A\,x + a^{\top}x`}</M> von Kreis über Ellipse und Parabel zum Sattel. Regelungstechnik, ein Wagen mit Pendel, dessen Pole in der <M>s</M>-Ebene wandern. Dynamik, <M>{t`M\ddot q + C\dot q + K q = 0`}</M> mit echten Zahlen. Ein neuronales Netz, dessen Schichten Gewichtsmatrizen sind. Quantenmechanik, ein Teilchen im Kasten. Zum Schluss steht überall dasselbe: <M p=".">{t`y = A\,x`}</M></p>
            </>}
            en={<>
              <p>Slide 4 is only the title “Why LinAlg?”; the content is the interactive visualisation “Seven Machines, One Toolbox”: each scene first shows a motion and then fades in the matrix that describes it.</p>
              <p><b>Scene “Mechanics II”</b> (the scene we rebuild here): a square is under load, first uniaxial, then biaxial, then pure shear. The deformation is exaggerated by <M p=".">{t`\times 40`}</M> Then the deformation matrix <M>F</M> appears with numbers that change live, and the two basis arrows <M>e_1</M> and <M>e_2</M> point to the columns of <M p=".">F</M></p>
              <p><b>The other five machines</b> (each with its matrix): Analysis II, the quadratic form <M>{t`z = x^{\top}A\,x + a^{\top}x`}</M> from circle through ellipse and parabola to saddle. Control systems, a cart with a pendulum whose poles walk in the <M>s</M>-plane. Dynamics, <M>{t`M\ddot q + C\dot q + K q = 0`}</M> with real numbers. A neural network whose layers are weight matrices. Quantum mechanics, a particle in a box. At the end the same thing stands everywhere: <M p=".">{t`y = A\,x`}</M></p>
            </>}
          />
        </Box>
        <T
          de={<>
            <p><b>So liest man das Bild:</b> Das Quadrat mit der gestrichelten Linie ist das Quadrat ohne Last. Das dunkle Viereck ist dasselbe Quadrat unter Last. Die kleinen grauen Pfeile am Rand sind die Last.</p>
            <p>Die Matrix <M>F</M> hat vier Zahlen. Sie sagt, wohin jeder Punkt des Quadrats wandert. Das Wichtigste steht in den Spalten: Die erste Spalte ist der Ort, an dem der Pfeil <M>e_1</M> (ein Schritt nach rechts) landet. Die zweite Spalte ist der Ort, an dem <M>e_2</M> (ein Schritt nach oben) landet.</p>
            <p>Probiere es aus: Wähle einen Lastfall und schau, wie sich die grüne und die blaue Zahlenspalte und die beiden Pfeile gemeinsam ändern.</p>
          </>}
          en={<>
            <p><b>How to read the picture:</b> The square with the dashed outline is the square without load. The dark quadrilateral is the same square under load. The small grey arrows at the edge are the load.</p>
            <p>The matrix <M>F</M> has four numbers. It says where every point of the square goes. The most important part is in the columns: the first column is the place where the arrow <M>e_1</M> (one step to the right) lands. The second column is the place where <M>e_2</M> (one step up) lands.</p>
            <p>Try it: choose a load case and watch how the green and the blue column of numbers and the two arrows change together.</p>
          </>}
        />
        <StressMachine />
        <T
          de={<>
            <p><b>Zwei Beispiele aus dem Bild.</b> Einachsig (der Zug wirkt nur in <M>x</M>-Richtung) wird das Quadrat in <M>x</M> länger und in <M>y</M> etwas schmaler: <M>e_1</M> landet bei <M p=",">{t`(1{,}13;\ 0)`}</M> <M>e_2</M> bei <M p=".">{t`(0;\ 0{,}961)`}</M> Beim reinen Schub bleiben beide Pfeile fast gleich lang, kippen aber: <M>e_1</M> landet bei <M p=",">{t`(1;\ 0{,}169)`}</M> <M>e_2</M> bei <M p=".">{t`(0{,}169;\ 1)`}</M></p>
            <p>Wie man aus den Spalten das Bild <em>jedes</em> Punktes bekommt, nicht nur das von <M>e_1</M> und <M p=",">e_2</M> kommt in der Lektion <a href="#la-transformation">Die Matrix als Transformation des Raums</a>: Dort sind die Spalten genau die Bilder von <M>e_1</M> und <M p=".">e_2</M></p>
          </>}
          en={<>
            <p><b>Two examples from the picture.</b> Uniaxial (the pull acts only in the <M>x</M> direction) the square becomes longer in <M>x</M> and a little narrower in <M p=":">y</M> <M>e_1</M> lands at <M p=",">{t`(1.13,\ 0)`}</M> <M>e_2</M> at <M p=".">{t`(0,\ 0.961)`}</M> In pure shear both arrows stay almost the same length but tilt: <M>e_1</M> lands at <M p=",">{t`(1,\ 0.169)`}</M> <M>e_2</M> at <M p=".">{t`(0.169,\ 1)`}</M></p>
            <p>How to get the image of <em>every</em> point from the columns, not only that of <M>e_1</M> and <M p=",">e_2</M> comes in the lesson <a href="#la-transformation">The matrix as a transformation of space</a>: there the columns are exactly the images of <M>e_1</M> and <M p=".">e_2</M></p>
          </>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="kursplan" title={<T de="2. Der Kursplan" en="2. The course plan" />}>
        <Box kind="uebung" src={<Src u={1} p={11} slides />} title={<T de="«General Overview»" en="“General Overview”" />}>
          <T
            de={<p>Handgezeichnete Reise im Uhrzeigersinn von <b>L1</b> (MatLab &amp; Intro) bis <b>L14</b> (Recap), dann «LinAlg II» mit dem Kommentar «shit gets real …». Die Folie nennt zu jeder Woche Stichwörter, zum Beispiel bei L2: Pivot, Linearität?, Notation, geometrische Deutung.</p>}
            en={<p>A hand-drawn journey clockwise from <b>L1</b> (MatLab &amp; Intro) to <b>L14</b> (Recap), then “LinAlg II” with the comment “shit gets real …”. The slide gives keywords for each week, for example for L2: pivot, linearity?, notations, geometric interpretations.</p>}
          />
        </Box>
        <T
          de={<p>Der Plan als Zeitleiste. Die Wochen, die es auf dieser Seite schon gibt (L1 bis L5), sind hervorgehoben und führen zu ihren Lektionen. Der Rest ist grau.</p>}
          en={<p>The plan as a timeline. The weeks that already exist on this site (L1 to L5) are highlighted and lead to their lessons. The rest is grey.</p>}
        />
        <CourseRoadmap />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="organisation" title={<T de="3. Organisation" en="3. Organisation" />}>
        <Box kind="uebung" src={<Src u={1} p="5–8" slides />} title={<T de="Kursübersicht, Tipps, Ablauf der Übung" en="Course overview, tips, class outline" />}>
          <T
            de={<ul>
              <li><b>Prüfung:</b> keine Winterprüfung. Es gibt eine gemeinsame Prüfung von Lineare Algebra I und II im Sommer. 6 ECTS. «Wahrscheinlich eine deiner leichteren Vorlesungen, aber die wichtigste für später.»</li>
              <li><b>Bonus:</b> 10 Bonusaufgaben und 2 Lernkontrollen, je ein Punkt. Wer 9 von 12 Punkten hat, bekommt <M>{t`+0{,}25`}</M> auf die Note. Es geht darum, das eigene Denken zu zeigen: alles versuchen ist wichtiger als alles richtig haben.</li>
              <li><b>Serien:</b> wöchentlich, nicht obligatorisch. Hochladen auf SamUpload für die KI-Korrektur.</li>
              <li><b>Tipps:</b> Priorität 1 ist, eine <em>Intuition</em> und ein <em>visuelles Verständnis</em> aufzubauen (handschriftlich: «3B1B auf YouTube ist sehr gut»). Eine Zusammenfassung schreiben. Jede Woche die Serie üben.</li>
              <li><b>Ablauf der Übung:</b> 1. frischer Blick auf die Theorie für die Intuition, 2. meist kurze Fragen und einige Prüfungsfragen, 3. Empfehlungen für die Serie, 4. Schnellfragen. Die leeren Folien gibt es vor der Übung, die annotierten danach.</li>
              <li><b>Sprache:</b> Die Fachbegriffe sind meist auf Deutsch und Englisch gleich, sonst ist es markiert. Die meisten späteren Lineare-Algebra-Kurse sind auf Englisch.</li>
            </ul>}
            en={<ul>
              <li><b>Exam:</b> no winter exam. There is one joint exam for Linear Algebra I and II in the summer. 6 ECTS. “Likely one of your easier classes, yet also the most relevant for later studies.”</li>
              <li><b>Bonus:</b> 10 bonus problems and 2 <De en="learning checks">Lernkontrollen</De>, one point each. With 9 of 12 points you get <M>{t`+0.25`}</M> on your grade. The point is to show your thinking: trying everything is more important than being correct.</li>
              <li><b>Problem sets:</b> weekly, not mandatory. Upload on SamUpload for AI grading.</li>
              <li><b>Tips:</b> priority 1 is to gain an <em>intuition</em> and a <em>visual understanding</em> (handwritten: “3B1B on YT is very good”). Write a summary. Practise with the problem set every week.</li>
              <li><b>Class outline:</b> 1. a fresh look at the theory for intuition, 2. mostly short questions and some exam questions, 3. recommendations for the problem set, 4. quick-fire questions. The empty slides come before class, the annotated ones after.</li>
              <li><b>Language:</b> the terminology is mostly identical in English and German, otherwise it is marked. Most later linear algebra courses are in English.</li>
            </ul>}
          />
        </Box>
        <Box kind="supplement">
          <T
            de={<p>Gemeint ist die YouTube-Reihe «Essence» von 3Blue1Brown zur Linearen Algebra. Sie passt zu diesem Kurs, weil sie wie diese Seite mit Bildern arbeitet: erst sehen, dann rechnen.</p>}
            en={<p>The video series is called “Essence of linear algebra” (3Blue1Brown). It fits this course because, like this site, it works with pictures: see first, then calculate.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="matlab" title={<T de="4. MATLAB in einer Minute" en="4. MATLAB in one minute" />}>
        <Box kind="uebung" src={<Src u={1} p="13–14" slides />} title={<T de="«Why MATLAB?» und «Key Commands»" en="“Why MATLAB?” and “Key Commands”" />}>
          <T
            de={<>
              <p><b>Warum MATLAB?</b> Es ist auf Lineare Algebra optimiert und im Grunde eine mächtige Programmiersprache für Ingenieure und Naturwissenschaftler: Datenanalyse, Modellieren, Regelung, maschinelles Lernen, Optimierung und mehr. Manchmal kommt es in den Serienaufgaben vor, ist aber nicht prüfungsrelevant.</p>
              <p><b>Wichtige Befehle:</b></p>
            </>}
            en={<>
              <p><b>Why MATLAB?</b> It is optimised for linear algebra and essentially a powerful coding language for engineers and scientists: data analysis, modelling, control systems, machine learning, optimisation and much more. Sometimes it appears in problem-set questions, but it is not exam-relevant.</p>
              <p><b>Key commands:</b></p>
            </>}
          />
          <ul className="l12-cmds">
            <li><code>;</code><T de={<span>Zeile nicht ausgeben</span>} en={<span>don’t print the line</span>} /></li>
            <li><code>clc</code><T de={<span>Befehlsfenster leeren</span>} en={<span>clear the command window</span>} /></li>
            <li><code>clear</code><T de={<span>Variablen löschen</span>} en={<span>clear the variables</span>} /></li>
            <li><code>help …</code><T de={<span>Info zu einem Befehl oder einer Variablen</span>} en={<span>get info on a command or variable</span>} /></li>
            <li><code>1 == 2</code><T de={<span>Wahr oder falsch: Ausgabe <code>0</code> (falsch)</span>} en={<span>true or false: output <code>0</code> (false)</span>} /></li>
            <li><code>3 &gt;= 2</code><T de={<span>Ausgabe <code>1</code> (wahr)</span>} en={<span>output <code>1</code> (true)</span>} /></li>
          </ul>
          <T
            de={<p>Die Matrix von der Folie, rechts so geschrieben, wie man sie auf Papier schreibt. Das Semikolon trennt die Zeilen:</p>}
            en={<p>The matrix from the slide, on the right written as on paper. The semicolon separates the rows:</p>}
          />
          <div className="l12-code">
            <pre><code>A = [4 2 1; 2 6 3]</code></pre>
            <MD>{t`A = \begin{pmatrix} 4 & 2 & 1 \\ 2 & 6 & 3 \end{pmatrix}`}</MD>
          </div>
          <T
            de={<p>Weitere Hinweise der Folie: KI ist dein Freund (und/oder Ersatz). Es gibt viele Videos und Werkzeuge online. Ein Cheatsheet und ein Primer liegen auf Polybox. Und: MATLAB rechnet numerisch, nicht analytisch.</p>}
            en={<p>More notes from the slide: AI is your friend (and/or replacement). There are plenty of videos and tools online. A cheat sheet and a primer are on Polybox. And: MATLAB is numerical, not analytical.</p>}
          />
          <T
            de={<p><b>Das Beispiel von Folie 13:</b> Gesucht sind die Eigenvektoren dieser Matrix.</p>}
            en={<p><b>The example of slide 13:</b> find the eigenvectors of this matrix.</p>}
          />
          <MD>{t`A = \begin{pmatrix} 2 & 1 & 0 \\ 1 & 2 & 0 \\ 0 & 0 & 3 \end{pmatrix}`}</MD>
          <div className="l12-vs">
            <T
              de={<>
                <div><h4>Von Hand</h4><p>Determinante bilden, ausrechnen, Eigenwerte, dann die Eigenvektoren:</p><MD>{t`\det(A - \lambda\,\mathbb{I}) = 0 \;\ldots`}</MD><p>eine lange Rechnung.</p></div>
                <div><h4>Mit MATLAB</h4><pre><code>[V,I] = eig(A)</code></pre><p>Das war’s …</p></div>
              </>}
              en={<>
                <div><h4>By hand</h4><p>Form the determinant, calculate it, eigenvalues, then the eigenvectors:</p><MD>{t`\det(A - \lambda\,\mathbb{I}) = 0 \;\ldots`}</MD><p>a long calculation.</p></div>
                <div><h4>With MATLAB</h4><pre><code>[V,I] = eig(A)</code></pre><p>That’s it …</p></div>
              </>}
            />
          </div>
          <T
            de={<p>Was Eigenvektoren sind und was <code>eig</code> zurückgibt, erklärt der Kurs erst viel später. Hier zählt nur der Eindruck: Was von Hand eine Seite füllt, ist eine Zeile Code.</p>}
            en={<p>What eigenvectors are and what <code>eig</code> returns is explained much later in the course. Here only the impression counts: what fills a page by hand is one line of code.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Eine Matrix ist nur eine Tabelle von Zahlen»" en="“A matrix is just a table of numbers”" />}>
        <T
          de={<p>Aufgeschrieben ja, aber gemeint ist mehr: Die Matrix <M>F</M> im Bild <em>macht</em> etwas, sie verformt die ganze Ebene. Wenn du eine Matrix siehst, frage dich: Wohin schickt sie <M>e_1</M> und <M p="?">e_2</M> Die Antwort steht in den Spalten.</p>}
          en={<p>Written down, yes, but more is meant: the matrix <M>F</M> in the picture <em>does</em> something, it deforms the whole plane. When you see a matrix, ask yourself: where does it send <M>e_1</M> and <M p="?">e_2</M> The answer is in the columns.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Ohne MATLAB kann ich die Prüfung nicht bestehen»" en="“Without MATLAB I cannot pass the exam”" />}>
        <T
          de={<p>Die Folie sagt es deutlich: MATLAB kommt manchmal in den Serien vor, ist aber nicht prüfungsrelevant. Es ist ein Werkzeug zum Ausprobieren, nicht der Stoff.</p>}
          en={<p>The slide says it clearly: MATLAB sometimes appears in the problem sets but is not exam-relevant. It is a tool for trying things out, not the subject.</p>}
        />
      </Box>

      <Box kind="key">
        <T
          de={<ul>
            <li>Eine Matrix beschreibt eine Maschine: Sie sagt, wohin jeder Punkt der Ebene wandert.</li>
            <li>Die Spalten einer Matrix sind die Bilder der Basispfeile <M>e_1</M> und <M p=".">e_2</M> Das ist die wichtigste Leseregel des Kurses.</li>
            <li>Plan: L2 Gleichungssysteme und Gauss, L3 Rang und Spaltenbild, L4 die Matrix als Transformation, L5 das Produkt, dann Inverse, Determinante, Vektorräume.</li>
            <li>Bonus: 9 von 12 Punkten geben <M p=".">{t`+0{,}25`}</M> auf die Note. Priorität 1: Intuition und Bilder.</li>
            <li>MATLAB: Matrix <code>[4 2 1; 2 6 3]</code>, <code>;</code> unterdrückt die Ausgabe, nicht prüfungsrelevant.</li>
          </ul>}
          en={<ul>
            <li>A matrix describes a machine: it says where every point of the plane goes.</li>
            <li>The columns of a matrix are the images of the basis arrows <M>e_1</M> and <M p=".">e_2</M> This is the most important reading rule of the course.</li>
            <li>Plan: L2 linear systems and Gauss, L3 rank and column picture, L4 the matrix as a transformation, L5 the product, then inverse, determinant, vector spaces.</li>
            <li>Bonus: 9 of 12 points give <M p=".">{t`+0.25`}</M> on your grade. Priority 1: intuition and pictures.</li>
            <li>MATLAB: matrix <code>[4 2 1; 2 6 3]</code>, <code>;</code> suppresses the output, not exam-relevant.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
