import { Box, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { CANCEL_EXAMPLE } from '../linalg/rankInfo';
import { GaussStepper } from '../viz/la/GaussStepper';
import { GenericRank } from '../viz/la/GaussStaircase';
import { PivotFigure, RankExplorer, SeriesExplorer } from '../viz/la/RankFigures';

const t = String.raw;

export default function LA3Rang() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Nach dem <a href="#la-gauss">Gauss-Verfahren</a> steht eine Treppe da. Diese Lektion liest sie genau: Welche Unbekannten sind durch die Treppe festgelegt, welche sind frei, und was sagt die Anzahl der Stufen – der <b>Rang</b> – über die Lösungen?</p>}
        en={<p className="lede">After <a href="#la-gauss">Gaussian elimination</a> there is a staircase. This lesson reads it carefully: which unknowns are fixed by the staircase, which are free, and what does the number of steps – the <b>rank</b> – tell us about the solutions?</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Stell dir vier Unbekannte als vier Regler vor. Jede echte, neue Gleichung blockiert einen Regler. Was übrig bleibt, darf man frei drehen. Der Rang zählt, wie viele Regler wirklich blockiert sind. Eine Gleichung, die nur eine andere wiederholt, blockiert nichts.</p>}
          en={<p>Picture four unknowns as four sliders. Every genuine, new equation locks one slider. Whatever is left can be turned freely. The rank counts how many sliders are really locked. An equation that only repeats another one locks nothing.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="pivots" title={<T de="1. Pivots und freie Variablen" en="1. Pivots and free variables" />}>
        <Box kind="uebung" src={<Src u={4} p={5} slides />} title={<T de="Pivots und freie Variablen (Repetition)" en={<>Pivots and free variables (recap)</>} />}>
          <MD>{t`\left(\begin{array}{cccc|c} x_1 & x_2 & x_3 & x_4 & 1\\ \hline 1 & 0 & 3 & 2 & 1\\ 0 & 2 & 1 & 1 & 3\\ 0 & 0 & 0 & 1 & 5\\ 0 & 0 & 0 & 0 & 0 \end{array}\right)`}</MD>
          <T
            de={<p>Pivots <M>=</M> erstes Element ungleich null in jeder Zeile. <M p=",">{t`x_1`}</M> <M p=",">{t`x_2`}</M> <M>{t`x_4`}</M> sind <b>Pivotvariablen</b> (blau), <M>{t`x_3`}</M> ist eine <b>freie Variable</b> (orange): <M p=".">{t`x_3 = \alpha,\ \alpha \in \mathbb{R}`}</M> Lösungsmenge:</p>}
            en={<p>“Pivots <M>=</M> first non-zero element in each row.” <M p=",">{t`x_1`}</M> <M p=",">{t`x_2`}</M> <M>{t`x_4`}</M> are <b>pivot variables</b> (blue), <M>{t`x_3`}</M> is a <b>free variable</b> (orange): <M p=".">{t`x_3 = \alpha,\ \alpha \in \mathbb{R}`}</M> Solution set (<i lang="de">Lösungsmenge</i>):</p>}
          />
          <MD>{t`L = \left\{ \begin{pmatrix} -9 - 3\alpha\\ -\frac{2+\alpha}{2}\\ \alpha\\ 5 \end{pmatrix} \in \mathbb{R}^4 \;\middle|\; \alpha \in \mathbb{R} \right\}`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> In jeder Zeile ist der erste Eintrag ungleich null das Pivot. Die Pivots stehen in den Spalten von <M p=",">{t`x_1`}</M> <M>{t`x_2`}</M> und <M p=".">{t`x_4`}</M> Die Spalte von <M>{t`x_3`}</M> hat kein Pivot. Keine Zeile «beginnt» mit <M p=",">{t`x_3`}</M> also legt keine Gleichung <M>{t`x_3`}</M> fest. <M>{t`x_3`}</M> ist frei und bekommt den Namen <M p=".">{t`\alpha`}</M></p>
            <p className="keep">Dann von unten rückwärts einsetzen, wie beim Gauss-Verfahren:</p>
            <ol className="keep">
              <li>Zeile <M p=":">{t`\mathrm{III}`}</M> <M p=".">{t`x_4 = 5`}</M></li>
              <li>Zeile <M p=":">{t`\mathrm{II}`}</M> <M p=",">{t`2x_2 + \alpha + 5 = 3`}</M> also <M p=".">{t`x_2 = \frac{-2-\alpha}{2} = -\frac{2+\alpha}{2}`}</M></li>
              <li>Zeile <M p=":">{t`\mathrm{I}`}</M> <M p=",">{t`x_1 + 3\alpha + 2\cdot 5 = 1`}</M> also <M p=".">{t`x_1 = -9 - 3\alpha`}</M></li>
              <li>Zeile <M p=":">{t`\mathrm{IV}`}</M> <M p=".">{t`0 = 0`}</M> Sie sagt nichts.</li>
            </ol>
            <p><b>So liest man <M p=":">L</M></b> «<M>L</M> ist die Menge aller Vektoren im <M p=",">{t`\mathbb{R}^4`}</M> die so aussehen, wobei <M>{t`\alpha`}</M> jede reelle Zahl sein darf.» Der senkrechte Strich heisst «wobei». Jedes <M>{t`\alpha`}</M> gibt eine andere Lösung. Schieb <M>{t`\alpha`}</M> und schau: Alle vier Gleichungen bleiben erfüllt.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> in every row the first non-zero entry is the pivot. The pivots stand in the columns of <M p=",">{t`x_1`}</M> <M>{t`x_2`}</M> and <M p=".">{t`x_4`}</M> The column of <M>{t`x_3`}</M> has no pivot. No row “starts” with <M p=",">{t`x_3`}</M> so no equation fixes <M p=".">{t`x_3`}</M> <M>{t`x_3`}</M> is free and gets the name <M p=".">{t`\alpha`}</M></p>
            <p className="keep">Then back substitution from the bottom, as in Gaussian elimination:</p>
            <ol className="keep">
              <li>Row <M p=":">{t`\mathrm{III}`}</M> <M p=".">{t`x_4 = 5`}</M></li>
              <li>Row <M p=":">{t`\mathrm{II}`}</M> <M p=",">{t`2x_2 + \alpha + 5 = 3`}</M> so <M p=".">{t`x_2 = \frac{-2-\alpha}{2} = -\frac{2+\alpha}{2}`}</M></li>
              <li>Row <M p=":">{t`\mathrm{I}`}</M> <M p=",">{t`x_1 + 3\alpha + 2\cdot 5 = 1`}</M> so <M p=".">{t`x_1 = -9 - 3\alpha`}</M></li>
              <li>Row <M p=":">{t`\mathrm{IV}`}</M> <M p=".">{t`0 = 0`}</M> It says nothing.</li>
            </ol>
            <p><b>How to read <M p=":">L</M></b> “<M>L</M> is the set of all vectors in <M>{t`\mathbb{R}^4`}</M> that look like this, where <M>{t`\alpha`}</M> may be any real number.” The vertical bar reads “where”. Every <M>{t`\alpha`}</M> gives a different solution. Move <M>{t`\alpha`}</M> and watch: all four equations stay satisfied.</p>
          </>}
        />
        <PivotFigure />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="rang" title={<T de="2. Was ist der Rang?" en="2. What is the rank?" />}>
        <Box kind="uebung" src={<Src u={4} p="6–7" slides />} title={<T de="Rang" en={<>Rank (<i lang="de">Rang</i>)</>} />}>
          <T
            de={<p>Folie 6 (Meme): <em>Pivotvariablen</em>, <em>linear unabhängige Gleichungen</em> und <em>linear unabhängige Spalten</em> zeigen aufeinander – es ist dieselbe Zahl. Folie 7: allgemeine Stufenform mit <M>m</M> Gleichungen («Anzahl Gleichungen»), <M>n</M> Unbekannten («Anzahl Unbekannte»), Pivots in <M>r</M> Zeilen, darunter Nullzeilen mit rechten Seiten bis <M p=".">{t`b_m`}</M> <M p=":">r</M> Rang. «Wird für die ganze LinAlg I/II wichtig sein!» «Die Anzahl Pivotvariablen ist die Anzahl linear unabhängiger Gleichungen, denn alle abhängigen Gleichungen heben sich zu null auf!»</p>}
            en={<p>Slide 6 (meme): <em>pivot variables</em>, <em>lin. independent equations</em> and <em>lin. independent columns</em> point at each other – it is the same number. Slide 7: generic echelon form with <M>m</M> equations (<i lang="de">Anzahl Gleichungen</i>), <M>n</M> unknowns (<i lang="de">Anzahl Unbekannte</i>), pivots in <M>r</M> rows, zero rows below with right-hand sides up to <M p=".">{t`b_m`}</M> <M p=":">r</M> rank (<i lang="de">Rang</i>). “Will be relevant for all of LinAlg I/II!” “The number of pivot variables represents the number of lin. independent eqs. as all dependent eqs. will cancel out to be zero!”</p>}
          />
        </Box>
        <GenericRank />
        <T
          de={<p className="keep"><b>So liest man das:</b> Der <b>Rang</b> <M>r</M> ist die Anzahl Pivots in der Stufenform. «Linear unabhängig» heisst hier: Die Gleichung lässt sich nicht aus den anderen zusammensetzen. Eine abhängige Gleichung ist eine Kombination der anderen, zum Beispiel <M p=".">{t`\mathrm{III} = \mathrm{I} + \mathrm{II}`}</M> Gauss zieht genau diese Kombination ab, und übrig bleibt eine Nullzeile. Unten passiert das Schritt für Schritt mit <M p=":">{t`\mathrm{III} = \mathrm{I} + \mathrm{II}`}</M></p>}
          en={<p className="keep"><b>How to read it:</b> the <b>rank</b> <M>r</M> is the number of pivots in the echelon form. “Linearly independent” here means: the equation cannot be put together from the others. A dependent equation is a combination of the others, for example <M p=".">{t`\mathrm{III} = \mathrm{I} + \mathrm{II}`}</M> Gauss subtracts exactly this combination, and a zero row remains. Below this happens step by step with <M p=":">{t`\mathrm{III} = \mathrm{I} + \mathrm{II}`}</M></p>}
        />
        <GaussStepper aug={CANCEL_EXAMPLE} upTo="echelon" />
        <T
          de={<p>Drei Gleichungen, aber nur zwei Pivots: Der Rang ist <M p=".">{t`r = 2`}</M> Die dritte Gleichung hat nichts Neues gesagt. Der Rang hängt nicht davon ab, wie man rechnet: Jeder richtige Weg zur Stufenform endet mit gleich vielen Pivots.</p>}
          en={<p>Three equations, but only two pivots: the rank is <M p=".">{t`r = 2`}</M> The third equation said nothing new. The rank does not depend on how you compute: every correct way to an echelon form ends with the same number of pivots.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="faelle" title={<T de="3. Die Tabelle der Fälle" en="3. The table of cases" />}>
        <Box kind="uebung" src={<Src u={4} p={8} slides />} title={<T de="Rang – Tabelle (aus einer Zusammenfassung)" en="Rank – table (from a summary)" />}>
          <MD>{t`\begin{array}{l}
\textbf{Keine Lösung:}\\
\qquad r < m \text{ und } b_i \neq 0\ \forall i > r\\[4pt]
\textbf{Eindeutige Lösung:}\quad r = n = m\\[4pt]
\textbf{Unendlich Lösungen:}\\
\qquad r < n \text{ und } b_i = 0\ \forall i > r\\
\qquad \text{Anzahl freie Parameter: } n - r\\[4pt]
\textbf{Ax = b für beliebiges b lösbar:}\\
\qquad \text{Voller Rang: } r = m \text{ oder}\\
\qquad m = n \text{ und } Ax = 0 \text{ hat nur}\\
\qquad \text{die triviale Lösung } x = 0\\[4pt]
\textbf{Ax = b für beliebiges b eindeutig lösbar:}\\
\qquad \text{Voller Rang: } r = m \text{ und gleich viele}\\
\qquad \text{Gleichungen wie Unbekannte: } m = n
\end{array}`}</MD>
          <T
            de={<p>Handschriftliche Beispiele: <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,2 \mid 1;\ 0\,0\,0 \mid 1)`}</M> mit <M p=",">{t`m = 3,\ r = 2`}</M> <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,1 \mid 1;\ 0\,0\,1 \mid 1)`}</M> mit <M p=",">{t`m = n = 3,\ r = 3`}</M> <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,2 \mid 1;\ 0\,0\,0 \mid 0)`}</M> mit <M>{t`n = 3,\ r = 2`}</M> und «Freie Variablen <M p="».">{t`= 3 - 2 = 1`}</M></p>}
            en={<p>Handwritten examples: <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,2 \mid 1;\ 0\,0\,0 \mid 1)`}</M> with <M p=",">{t`m = 3,\ r = 2`}</M> <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,1 \mid 1;\ 0\,0\,1 \mid 1)`}</M> with <M p=",">{t`m = n = 3,\ r = 3`}</M> <M>{t`(1\,1\,1 \mid 1;\ 0\,1\,2 \mid 1;\ 0\,0\,0 \mid 0)`}</M> with <M>{t`n = 3,\ r = 2`}</M> and “Free variables <M p="”.">{t`= 3 - 2 = 1`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man die Tabelle:</b> <M>{t`b_i`}</M> mit <M>{t`i > r`}</M> sind die rechten Seiten der Nullzeilen, <em>nach</em> dem Gauss-Verfahren. Eine Nullzeile mit <M>{t`b_i \neq 0`}</M> heisst <M p=":">{t`0 = b_i`}</M> Widerspruch. Gibt es keinen Widerspruch, entscheidet die Anzahl Pivots: <M>{t`r = n`}</M> heisst, jede Unbekannte hat ein Pivot. <M>{t`r < n`}</M> heisst, <M>{t`n - r`}</M> Unbekannte sind frei.</p>
            <p className="keep">Zwei Zeilen der Tabelle sind zu eng formuliert (LA-002). «Keine Lösung» gilt schon, wenn <em>eine</em> Nullzeile rechts <M>{t`b_i \neq 0`}</M> hat (nicht alle). Und «eindeutig» braucht nur <M p=":">{t`r = n`}</M> <M>{t`m = n`}</M> ist bloss der quadratische Fall. Richtig für jedes <M p=":">{t`m \times n`}</M></p>
          </>}
          en={<>
            <p className="keep"><b>How to read the table:</b> <M>{t`b_i`}</M> with <M>{t`i > r`}</M> are the right-hand sides of the zero rows, <em>after</em> elimination. A zero row with <M>{t`b_i \neq 0`}</M> says <M p=":">{t`0 = b_i`}</M> a contradiction. If there is no contradiction, the number of pivots decides: <M>{t`r = n`}</M> means every unknown has a pivot. <M>{t`r < n`}</M> means <M>{t`n - r`}</M> unknowns are free.</p>
            <p className="keep">Two lines of the table are stated too narrowly (LA-002). “No solution” already holds if <em>one</em> zero row has <M>{t`b_i \neq 0`}</M> on the right (not all of them). And “unique” only needs <M p=":">{t`r = n`}</M> <M>{t`m = n`}</M> is just the square case. Correct for every <M p=":">{t`m \times n`}</M></p>
          </>}
        />
        <T
          de={<ul className="ge-rules keep">
            <li><b>Keine Lösung</b> <M p=":">{t`\Leftrightarrow\ \operatorname{rang}[A \mid b] > r`}</M> eine Zeile lautet <M p=".">{t`0 = b_i \neq 0`}</M></li>
            <li><b>Genau eine Lösung</b> <M p=":">{t`\Leftrightarrow`}</M> lösbar und <M p=".">{t`r = n`}</M></li>
            <li><b>Unendlich viele</b> <M p=":">{t`\Leftrightarrow`}</M> lösbar und <M p=";">{t`r < n`}</M> dann <M>{t`n - r`}</M> freie Parameter.</li>
          </ul>}
          en={<ul className="ge-rules keep">
            <li><b>No solution</b> <M p=":">{t`\Leftrightarrow\ \operatorname{rank}[A \mid b] > r`}</M> one row reads <M p=".">{t`0 = b_i \neq 0`}</M></li>
            <li><b>Exactly one solution</b> <M p=":">{t`\Leftrightarrow`}</M> consistent and <M p=".">{t`r = n`}</M></li>
            <li><b>Infinitely many</b> <M p=":">{t`\Leftrightarrow`}</M> consistent and <M p=";">{t`r < n`}</M> then <M>{t`n - r`}</M> free parameters.</li>
          </ul>}
        />
        <RankExplorer />
        <T
          de={<p>Die letzten zwei Zeilen der Tabelle fragen etwas anderes: nicht «Hat <em>dieses</em> System eine Lösung?», sondern «Hat es für <em>jedes</em> <M>b</M> eine?». Das hängt nur von <M>A</M> ab. Ist <M p=",">{t`r = m`}</M> hat jede Zeile ein Pivot. Dann gibt es keine Nullzeile, also nie einen Widerspruch – egal wie <M>b</M> aussieht. Ist zusätzlich <M p=",">{t`m = n`}</M> hat auch jede Unbekannte ein Pivot: immer genau eine Lösung.</p>}
          en={<p>The last two lines of the table ask something else: not “does <em>this</em> system have a solution?” but “does it have one for <em>every</em> right-hand side?”. That depends only on <M p=".">A</M> If <M p=",">{t`r = m`}</M> every row has a pivot. Then there is no zero row, so never a contradiction – whatever <M>b</M> looks like. If in addition <M p=",">{t`m = n`}</M> every unknown has a pivot too: always exactly one solution.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="serie2" title={<T de="4. Beispiel aus der Serie 2" en="4. Example from problem set 2" />}>
        <Box kind="uebung" src={<Src u={4} p="9–11" slides />} title={<T de="Beispiel aus der Serie 2" en="Example from Series 2" />}>
          <T
            de={<p>«Geben Sie für <M>a</M> und <M>b</M> Bedingungen an, so dass das System</p>}
            en={<p>(<span lang="de">Serie 2, Aufgabe 2</span>) “Give conditions on <M>a</M> and <M>b</M> such that the system</p>}
          />
          <MD>{t`\begin{aligned} 3x_1 + 2b\,x_2 + 4x_3 &= 5\\ 3x_1 \phantom{{}+ 2b\,x_2} + 4x_3 &= 5\\ 2b\,x_2 + 3a\,x_3 &= b \end{aligned}`}</MD>
          <T
            de={<p>(a) Lösungen mit <em>zwei</em> freien Parametern besitzt, (b) Lösungen mit <em>einem</em> freien Parameter besitzt, (c) eindeutig lösbar ist, (d) keine Lösung hat, und geben Sie in jedem Fall die Lösungsmenge an.» Elimination auf den Folien:</p>}
            en={<p>(a) has solutions with <em>two</em> free parameters, (b) with <em>one</em> free parameter, (c) is uniquely solvable, (d) has no solution, and give the solution set in each case.” Elimination on the slides:</p>}
          />
          <MD>{t`\begin{gathered} \left(\begin{array}{ccc|c} 3 & 2b & 4 & 5\\ 3 & 0 & 4 & 5\\ 0 & 2b & 3a & b \end{array}\right)\\ \xrightarrow{\ \mathrm{II} - \mathrm{I}\ } \left(\begin{array}{ccc|c} 3 & 2b & 4 & 5\\ 0 & -2b & 0 & 0\\ 0 & 2b & 3a & b \end{array}\right)\\ \xrightarrow{\ \mathrm{III} + \mathrm{II}\ } \left(\begin{array}{ccc|c} 3 & 2b & 4 & 5\\ 0 & -2b & 0 & 0\\ 0 & 0 & 3a & b \end{array}\right) \end{gathered}`}</MD>
          <T
            de={<p>(a) Zwei freie Parameter – der Rang muss <M>1</M> sein (<M p=").">{t`n - r = \text{freie Parameter}`}</M> Also <M p=".">{t`a = b = 0`}</M> «Kleine Abweichung: <M>{t`x_2`}</M> und <M>{t`x_3`}</M> sind beide frei, also brauchen sie verschiedene Variablen.»</p>}
            en={<p>(a) “2 free parameters – rank must be 1” (<M p=").">{t`n - r = \text{free params}`}</M> “So <M p=".”">{t`a = b = 0`}</M> “Little deviation: both <M>{t`x_2`}</M> and <M>{t`x_3`}</M> are free, so they need separate variables.”</p>}
          />
          <MD>{t`L = \left\{ \begin{pmatrix} \frac{5 - 4\beta}{3}\\ \alpha\\ \beta \end{pmatrix} \in \mathbb{R}^3 \;\middle|\; \alpha, \beta \in \mathbb{R} \right\}`}</MD>
          <T
            de={<p>(b) Ein freier Parameter: <M p=",">{t`a \neq 0,\ b = 0`}</M> Matrix <M p=",">{t`(3\ 0\ 4 \mid 5;\ 0\ 0\ 0 \mid 0;\ 0\ 0\ 3a \mid 0)`}</M> <M p=".">{t`r = 2`}</M> (c) Eindeutig: <M p=",">{t`n = m = r`}</M> <M p=".">{t`a, b \neq 0`}</M> (d) Keine Lösung: <M p=",">{t`a = 0,\ b \neq 0`}</M> «weil die letzte Zeile nicht aufgeht».</p>}
            en={<p>(b) One free parameter: <M p=",">{t`a \neq 0,\ b = 0`}</M> matrix <M p=",">{t`(3\ 0\ 4 \mid 5;\ 0\ 0\ 0 \mid 0;\ 0\ 0\ 3a \mid 0)`}</M> <M p=".">{t`r = 2`}</M> (c) Unique: <M p=",">{t`n = m = r`}</M> <M p=".">{t`a, b \neq 0`}</M> (d) No solution: <M p=",">{t`a = 0,\ b \neq 0`}</M> “because last row won't work”.</p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Die Elimination geht für alle <M>a</M> und <M>b</M> gleich. Danach schaut man, welche Einträge null sein <em>können</em>. Die zweite Zeile <M>{t`(0\ {-2b}\ 0 \mid 0)`}</M> hat nur dann ein Pivot, wenn <M p=".">{t`b \neq 0`}</M> Die dritte Zeile <M>{t`(0\ 0\ 3a \mid b)`}</M> hat nur dann ein Pivot, wenn <M p=".">{t`a \neq 0`}</M> Ist <M>{t`a = 0`}</M> aber <M p=",">{t`b \neq 0`}</M> lautet sie <M p=":">{t`0 = b`}</M> Widerspruch.</p>
            <p>Bei (a) sieht man auf der Folie eine kleine Abweichung von der Stufenform: Für <M>{t`b = 0`}</M> rutscht das Pivot der zweiten Zeile weg. Dann zählt man die Pivots neu: Nur die erste Zeile hat eines, <M p=",">{t`r = 1`}</M> also <M>{t`n - r = 2`}</M> freie Parameter.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> the elimination is the same for all <M>a</M> and <M p=".">b</M> Afterwards you look at which entries <em>can</em> be zero. The second row <M>{t`(0\ {-2b}\ 0 \mid 0)`}</M> has a pivot only if <M p=".">{t`b \neq 0`}</M> The third row <M>{t`(0\ 0\ 3a \mid b)`}</M> has a pivot only if <M p=".">{t`a \neq 0`}</M> If <M>{t`a = 0`}</M> but <M p=",">{t`b \neq 0`}</M> it reads <M p=":">{t`0 = b`}</M> a contradiction.</p>
            <p>In (a) the slide shows a small deviation from the echelon form: for <M>{t`b = 0`}</M> the pivot of the second row slips away. Then you count the pivots again: only the first row has one, <M p=",">{t`r = 1`}</M> so <M>{t`n - r = 2`}</M> free parameters.</p>
          </>}
        />
        <SeriesExplorer />
        <Box kind="supplement" title={<T de="Die Lösungsmengen, die auf den Folien fehlen" en="The solution sets the slides leave out" />}>
          <T
            de={<>
              <p>(b) <M p=":">{t`a \neq 0,\ b = 0`}</M> Aus <M>{t`3a\,x_3 = 0`}</M> folgt <M p=".">{t`x_3 = 0`}</M> <M>{t`x_2 = \alpha`}</M> ist frei, und <M>{t`3x_1 + 0 = 5`}</M> gibt <M p=".">{t`x_1 = \frac53`}</M></p>
              <MD>{t`L = \left\{ \begin{pmatrix} \frac53\\ \alpha\\ 0 \end{pmatrix} \;\middle|\; \alpha \in \mathbb{R} \right\}`}</MD>
              <p>(c) <M p=":">{t`a \neq 0,\ b \neq 0`}</M> <M p=",">{t`x_3 = \frac{b}{3a}`}</M> aus <M>{t`-2b\,x_2 = 0`}</M> folgt <M p=",">{t`x_2 = 0`}</M> und <M p=".">{t`x_1 = \frac{5 - 4x_3}{3} = \frac{15a - 4b}{9a}`}</M></p>
              <MD>{t`L = \left\{ \begin{pmatrix} \frac{15a - 4b}{9a}\\ 0\\ \frac{b}{3a} \end{pmatrix} \right\}`}</MD>
              <p>(d) <M p=":">{t`a = 0,\ b \neq 0`}</M> <M p=".">{t`L = \varnothing`}</M> Geprüft: Für alle ganzen <M>a</M> und <M>b</M> von <M>-3</M> bis <M>3</M> stimmen diese Formeln mit dem Gauss-Verfahren des Explorers überein (das ist ein Test, kein Beweis – der Beweis ist die Rechnung oben).</p>
            </>}
            en={<>
              <p>(b) <M p=":">{t`a \neq 0,\ b = 0`}</M> from <M>{t`3a\,x_3 = 0`}</M> we get <M p=".">{t`x_3 = 0`}</M> <M>{t`x_2 = \alpha`}</M> is free, and <M>{t`3x_1 + 0 = 5`}</M> gives <M p=".">{t`x_1 = \frac53`}</M></p>
              <MD>{t`L = \left\{ \begin{pmatrix} \frac53\\ \alpha\\ 0 \end{pmatrix} \;\middle|\; \alpha \in \mathbb{R} \right\}`}</MD>
              <p>(c) <M p=":">{t`a \neq 0,\ b \neq 0`}</M> <M p=";">{t`x_3 = \frac{b}{3a}`}</M> from <M>{t`-2b\,x_2 = 0`}</M> we get <M p=",">{t`x_2 = 0`}</M> and <M p=".">{t`x_1 = \frac{5 - 4x_3}{3} = \frac{15a - 4b}{9a}`}</M></p>
              <MD>{t`L = \left\{ \begin{pmatrix} \frac{15a - 4b}{9a}\\ 0\\ \frac{b}{3a} \end{pmatrix} \right\}`}</MD>
              <p>(d) <M p=":">{t`a = 0,\ b \neq 0`}</M> <M p=".">{t`L = \varnothing`}</M> Checked: for all integers <M>a</M> and <M>b</M> from <M>-3</M> to <M>3</M> these formulas agree with the explorer's elimination (a test, not a proof – the proof is the computation above).</p>
            </>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de="«Der Rang ist die Anzahl Zeilen»" en="“The rank is the number of rows”" />}>
        <T
          de={<p>Der Rang zählt die Pivots, nicht die Zeilen. Abhängige Gleichungen werden zu Nullzeilen und zählen nicht. In Abschnitt 2 haben drei Gleichungen den Rang <M p=".">2</M> Immer gilt <M>{t`r \le m`}</M> und <M p=".">{t`r \le n`}</M></p>}
          en={<p>The rank counts pivots, not rows. Dependent equations become zero rows and do not count. In section 2, three equations have rank <M p=".">2</M> Always <M>{t`r \le m`}</M> and <M p=".">{t`r \le n`}</M></p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Eine freie Variable ist eine, die nicht vorkommt»" en="“A free variable is one that does not appear”" />}>
        <T
          de={<p>Im Beispiel von Folie 5 kommt <M>{t`x_3`}</M> sogar in zwei Gleichungen vor (<M>{t`3x_3`}</M> und <M p=").">{t`x_3`}</M> Frei ist sie, weil ihre Spalte <em>kein Pivot</em> hat: Keine Gleichung legt sie fest, die anderen Variablen passen sich ihr an.</p>}
          en={<p>In the example of slide 5, <M>{t`x_3`}</M> even appears in two equations (<M>{t`3x_3`}</M> and <M p=").">{t`x_3`}</M> It is free because its column has <em>no pivot</em>: no equation fixes it, the other variables adapt to it.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Mehr Unbekannte als Gleichungen heisst immer unendlich viele Lösungen»" en="“More unknowns than equations always means infinitely many solutions”" />}>
        <T
          de={<p>Es kann auch gar keine geben. Beispiel: <M>{t`x_1 + x_2 + x_3 = 1`}</M> und <M>{t`2x_1 + 2x_2 + 2x_3 = 5`}</M> (im Explorer «2 Gl., 3 Unb., keine»): Gauss gibt <M p=".">{t`0 = 3`}</M> Richtig ist nur: <em>Wenn</em> es Lösungen gibt, dann unendlich viele, weil <M>{t`r \le m < n`}</M> ist.</p>}
          en={<p>There can also be none at all. Example: <M>{t`x_1 + x_2 + x_3 = 1`}</M> and <M>{t`2x_1 + 2x_2 + 2x_3 = 5`}</M> (in the explorer “2 eq., 3 unkn., none”): Gauss gives <M p=".">{t`0 = 3`}</M> What is true: <em>if</em> there are solutions, there are infinitely many, because <M p=".">{t`r \le m < n`}</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Pivot <M>=</M> erster Eintrag <M>{t`\neq 0`}</M> einer Zeile der Stufenform. Spalten mit Pivot: Pivotvariablen. Spalten ohne: freie Variablen, sie bekommen Parameter <M p=".">{t`\alpha, \beta, \dots`}</M></li>
            <li>Rang <M>r</M> <M>=</M> Anzahl Pivots <M>=</M> Anzahl unabhängiger Gleichungen. Abhängige Gleichungen werden zu Nullzeilen.</li>
            <li>Keine Lösung <M p=".">{t`\Leftrightarrow \operatorname{rang}[A \mid b] > r`}</M> Sonst: <M>{t`r = n`}</M> → genau eine Lösung; <M>{t`r < n`}</M> → unendlich viele mit <M>{t`n - r`}</M> freien Parametern.</li>
            <li>Für jedes <M>b</M> lösbar <M p=";">{t`\Leftrightarrow r = m`}</M> für jedes <M>b</M> eindeutig lösbar <M p=".">{t`\Leftrightarrow r = m = n`}</M></li>
          </ul>}
          en={<ul>
            <li>Pivot <M>=</M> first entry <M>{t`\neq 0`}</M> of a row of the echelon form. Columns with a pivot: pivot variables. Columns without: free variables, they get parameters <M p=".">{t`\alpha, \beta, \dots`}</M></li>
            <li>Rank <M>r</M> <M>=</M> number of pivots <M>=</M> number of independent equations. Dependent equations become zero rows.</li>
            <li>No solution <M p=".">{t`\Leftrightarrow \operatorname{rank}[A \mid b] > r`}</M> Otherwise: <M>{t`r = n`}</M> → exactly one solution; <M>{t`r < n`}</M> → infinitely many with <M>{t`n - r`}</M> free parameters.</li>
            <li>Solvable for every <M>b</M> <M p=";">{t`\Leftrightarrow r = m`}</M> uniquely solvable for every <M>b</M> <M p=".">{t`\Leftrightarrow r = m = n`}</M></li>
          </ul>}
        />
      </Box>
    </article>
  );
}
