import { Box, De, Section, Src } from '../components/Blocks';
import { M, MD } from '../components/Tex';
import { T } from '../i18n';
import { eliminate, mat, reduce } from '../linalg/gauss';
import { MULTI_RHS } from '../linalg/gaussTrace';
import { QMatrix } from '../viz/la/GaussMatrix';
import { GaussStepper } from '../viz/la/GaussStepper';
import { ResultStaircases } from '../viz/la/GaussStaircase';
import { NotationMorph, TwinLines } from '../viz/la/NotationFigures';
import { SolveExplorer } from '../viz/la/SolveExplorer';

const t = String.raw;
const SLIDE26 = mat([[1, 1, 1, 6], [1, 2, 1, 8], [2, 3, 5, 23]]);
const multi = eliminate(MULTI_RHS, 3);
const multiRed = reduce(multi, 3).result;
const MULTI_HEADS = ['x_1', 'x_2', 'x_3', 'b_1', 'b_2'].map((h) => (
  <M key={h}>{h}</M>
));

export default function LA2Gauss() {
  return (
    <article className="lesson">
      <T
        de={<p className="lede">In der Lektion <a href="#la-lgs">Lineare Gleichungssysteme geometrisch</a> haben wir Gleichungen kombiniert, ohne den Schnittpunkt zu verschieben. Das Gauss-Verfahren macht daraus ein Rezept: Immer dieselben einfachen Schritte, bis man die Lösung ablesen kann.</p>}
        en={<p className="lede">In the lesson <a href="#la-lgs">Linear systems, geometrically</a> we combined equations without moving the intersection. Gaussian elimination turns this into a recipe: always the same simple steps, until the solution can be read off.</p>}
      />
      <Box kind="intuition">
        <T
          de={<p>Wie beim Aufräumen eines Schranks: Zuerst räumt man das unterste Fach leer, dann das nächste. Hier räumen wir Spalte für Spalte die Zahlen unter der Diagonale weg. Übrig bleibt eine Treppe, und die liest man von unten nach oben.</p>}
          en={<p>Like tidying a cupboard: first you clear the bottom shelf, then the next one. Here we clear the numbers below the diagonal, column by column. What is left is a staircase, and you read it from the bottom up.</p>}
        />
      </Box>

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="notation" title={<T de="1. Drei Schreibweisen für dasselbe System" en="1. Three ways to write the same system" />}>
        <Box kind="uebung" src={<Src u={2} p={25} slides />} title={<T de="Notationen" en="Notations" />}>
          <T de={<p>Standardform:</p>} en={<p>Standard form:</p>} />
          <MD>{t`\begin{aligned} 3x_1 + 2x_2 - x_3 &= 2\\ x_1 - 2x_2 - 2x_3 &= 0\\ -2x_1 + x_2 + x_3 &= 3 \end{aligned}`}</MD>
          <T de={<p>Matrixform:</p>} en={<p>Matrix form:</p>} />
          <MD>{t`\begin{pmatrix} 3 & 2 & -1\\ 1 & -2 & -2\\ -2 & 1 & 1 \end{pmatrix} \begin{pmatrix} x_1\\ x_2\\ x_3 \end{pmatrix} = \begin{pmatrix} 2\\ 0\\ 3 \end{pmatrix}`}</MD>
          <T de={<p>«Erweiterte Matrix» (kann vereinfacht werden: ohne die Überschriften):</p>} en={<p><De en="augmented matrix">Erweiterte Matrix</De> (“can be simplified”: without the headers):</p>} />
          <MD>{t`\begin{array}{ccc|c} x_1 & x_2 & x_3 & 1\\ \hline 3 & 2 & -1 & 2\\ 1 & -2 & -2 & 0\\ -2 & 1 & 1 & 3 \end{array}`}</MD>
          <MD>{t`\longrightarrow\quad \left(\begin{array}{ccc|c} 3 & 2 & -1 & 2\\ 1 & -2 & -2 & 0\\ -2 & 1 & 1 & 3 \end{array}\right)`}</MD>
        </Box>
        <T
          de={<p className="keep"><b>So liest man das:</b> Alle drei Schreibweisen enthalten dieselben zwölf Zahlen. In der Matrix <M>A</M> steht in Zeile <M>i</M> und Spalte <M>j</M> die Zahl vor <M>{t`x_j`}</M> in Gleichung <M p=".">i</M> Der Vektor <M>b</M> sammelt die rechten Seiten. Die erweiterte Matrix <M>{t`[A \mid b]`}</M> klebt <M>b</M> hinter einem Strich an <M p=".">A</M> Der Strich steht dort, wo vorher das Gleichheitszeichen war.</p>}
          en={<p className="keep"><b>How to read it:</b> all three forms contain the same twelve numbers. In row <M>i</M> and column <M>j</M> of the matrix <M>A</M> stands the number in front of <M>{t`x_j`}</M> in equation <M p=".">i</M> The vector <M>b</M> collects the right-hand sides. The augmented matrix <M>{t`[A \mid b]`}</M> glues <M>b</M> to <M>A</M> behind a bar. The bar is where the equals sign used to be.</p>}
        />
        <NotationMorph />
        <T
          de={<p>Warum der Aufwand? Beim Rechnen ändern sich nur die Zahlen. Die Namen <M>{t`x_1, x_2, x_3`}</M> und die Pluszeichen schreibt man sonst bei jedem Schritt neu ab. Eine fehlende Unbekannte bekommt in der Matrix eine <M p=":">0</M> Die Spalten müssen immer dieselbe Unbekannte meinen.</p>}
          en={<p>Why bother? While computing only the numbers change. Otherwise you would copy the names <M>{t`x_1, x_2, x_3`}</M> and the plus signs at every step. A missing unknown gets a <M>0</M> in the matrix: each column must always mean the same unknown.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="idee" title={<T de="2. Ziel und Idee: Stufen erzeugen" en="2. Goal and idea: create steps" />}>
        <Box kind="uebung" src={<Src u={2} p="26–28" slides />} title={<T de="Gauss-Verfahren" en="Gaussian elimination" />}>
          <T
            de={<p>Ziel: Die Variablen von links nach rechts isolieren, so dass Stufen entstehen. Beispiel:</p>}
            en={<p>“GOAL: isolate variables from left to right to create steps.” Example:</p>}
          />
          <MD>{t`\begin{aligned} x_1 + x_2 + x_3 &= 6\\ x_1 + 2x_2 + x_3 &= 8\\ 2x_1 + 3x_2 + 5x_3 &= 23 \end{aligned}`}</MD>
          <MD>{t`\longrightarrow\quad \left(\begin{array}{ccc|c} 1 & 1 & 1 & 6\\ 1 & 2 & 1 & 8\\ 2 & 3 & 5 & 23 \end{array}\right)`}</MD>
          <T
            de={<p>Idee: Stufen erzeugen. Die <M>1</M> oben links (blau eingekreist) machen wir zu unserem «Pivot». In ihrer Spalte soll sie der einzige Eintrag ungleich null sein. Die roten, eingekreisten Zahlen <M>-1</M> und <M>-2</M> sind die Vielfachen von Zeile <M p=",">{t`\mathrm{I}`}</M> die zu Zeile <M>{t`\mathrm{II}`}</M> bzw. <M>{t`\mathrm{III}`}</M> addiert werden. Ergebnis:</p>}
            en={<p>“IDEA: Create steps.” The <M>1</M> in the top left (circled in blue) becomes our “Pivot”. “We want to make this the only non-zero entry in the column.” The red circled numbers <M>-1</M> and <M>-2</M> are the multiples of row <M>{t`\mathrm{I}`}</M> added to row <M>{t`\mathrm{II}`}</M> and <M>{t`\mathrm{III}`}</M> respectively. Result:</p>}
          />
          <MD>{t`\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6\\ 0 & 1 & 0 & 2\\ 0 & 1 & 3 & 11 \end{array}\right) \quad \begin{array}{l} \\ \mathrm{II} - \mathrm{I}\\ \mathrm{III} - 2\cdot\mathrm{I} \end{array}`}</MD>
          <T
            de={<p>«Es ist wichtig, die Umformungen beim Gauss-Verfahren aufzuschreiben. Das ist meine bevorzugte Methode (die roten Kreise), man sieht es aber oft auch so notiert: <M p=",">{t`\mathrm{II} - \mathrm{I}`}</M> <M p=".»">{t`\mathrm{III} - 2\mathrm{I}`}</M></p>}
            en={<p>“It is important to note down the manipulations for Gaussian eliminations. This is my preferred method [the red circles], but you'll also often see it noted like this: <M p=",">{t`\mathrm{II} - \mathrm{I}`}</M> <M p=".”">{t`\mathrm{III} - 2\mathrm{I}`}</M></p>}
          />
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> Die Zeilen heissen <M p=".">{t`\mathrm{I}, \mathrm{II}, \mathrm{III}`}</M> Die Notiz <M>{t`\mathrm{III} - 2\cdot\mathrm{I}`}</M> heisst: «Ersetze Zeile <M>{t`\mathrm{III}`}</M> durch Zeile <M>{t`\mathrm{III}`}</M> minus zweimal Zeile <M p=".»">{t`\mathrm{I}`}</M> Das rote <M>-2</M> sagt dasselbe kürzer: Man zählt <M>-2</M> mal Zeile <M>{t`\mathrm{I}`}</M> dazu.</p>
            <p className="keep"><b>Wie findet man das Vielfache?</b> Unter dem Pivot <M>1</M> steht in Zeile <M>{t`\mathrm{III}`}</M> eine <M p=".">2</M> Damit dort <M>0</M> entsteht, braucht man <M p=".">{t`2 - 2\cdot 1 = 0`}</M> Allgemein: Vielfaches <M p=".">{t`= -\frac{\text{Eintrag unter dem Pivot}}{\text{Pivot}}`}</M></p>
            <p className="keep"><b>Pivot</b> (das Wort heisst «Drehpunkt») ist der Eintrag, mit dem man die anderen wegrechnet. Er darf nicht <M>0</M> sein: Mit <M>0</M> kann man nichts wegrechnen. Steht dort <M p=",">0</M> tauscht man zuerst zwei Zeilen.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> the rows are called <M p=".">{t`\mathrm{I}, \mathrm{II}, \mathrm{III}`}</M> The note <M>{t`\mathrm{III} - 2\cdot\mathrm{I}`}</M> means: “replace row <M>{t`\mathrm{III}`}</M> by row <M>{t`\mathrm{III}`}</M> minus twice row <M p=".”">{t`\mathrm{I}`}</M> The red <M>-2</M> says the same in short: add <M>-2</M> times row <M p=".">{t`\mathrm{I}`}</M></p>
            <p className="keep"><b>How do you find the multiple?</b> Below the pivot <M>1</M> row <M>{t`\mathrm{III}`}</M> has a <M p=".">2</M> To get <M>0</M> there we need <M p=".">{t`2 - 2\cdot 1 = 0`}</M> In general: multiple <M p=".">{t`= -\frac{\text{entry below the pivot}}{\text{pivot}}`}</M></p>
            <p className="keep">The <b>pivot</b> (the word means “turning point”) is the entry used to clear the others. It must not be <M p=":">0</M> with <M>0</M> you cannot clear anything. If there is a <M p=",">0</M> first swap two rows.</p>
          </>}
        />
        <T
          de={<p>Der Spieler unten rechnet das Beispiel der Folien Schritt für Schritt. Kreis: Pivot; grün: die Zeile, mit der gerechnet wird; orange: die Zeilen, die sich ändern; rot: die Vielfachen und Notizen.</p>}
          en={<p>The player below computes the example of the slides step by step. Circle: pivot; green: the row we compute with; orange: the rows that change; red: the multiples and notes.</p>}
        />
        <GaussStepper aug={SLIDE26} upTo="echelon" />
        <h3><T de="Warum ändert eine Zeilenumformung die Lösung nicht?" en="Why does a row operation not change the solution?" /></h3>
        <T
          de={<p className="keep">Das ist dieselbe Überlegung wie beim Kombinieren von Gleichungen (<a href="#la-lgs">Lineare Gleichungssysteme geometrisch</a>, <Src u={2} p={13} slides />): Erfüllt ein Punkt die Gleichungen <M>{t`\mathrm{I}`}</M> und <M p=",">{t`\mathrm{II}`}</M> dann erfüllt er auch <M p=".">{t`\mathrm{II} - \mathrm{I}`}</M> Denn links und rechts zieht man gleich viel ab.</p>}
          en={<p className="keep">It is the same argument as for combining equations (<a href="#la-lgs">Linear systems, geometrically</a>, <Src u={2} p={13} slides />): if a point satisfies equations <M>{t`\mathrm{I}`}</M> and <M p=",">{t`\mathrm{II}`}</M> it also satisfies <M p=".">{t`\mathrm{II} - \mathrm{I}`}</M> You subtract the same amount on the left and on the right.</p>}
        />
        <Box kind="supplement" title={<T de="Auch umgekehrt geht nichts verloren" en="Nothing is lost the other way round either" />}>
          <T
            de={<p>Aus den neuen Zeilen <M>{t`\mathrm{I}`}</M> und <M>{t`\mathrm{II} - \mathrm{I}`}</M> bekommt man die alte Zeile <M>{t`\mathrm{II}`}</M> zurück: <M p=".">{t`(\mathrm{II} - \mathrm{I}) + \mathrm{I} = \mathrm{II}`}</M> Also hat das neue System genau dieselben Lösungen wie das alte – keine neuen, keine verlorenen. Darum darf man so lange umformen, wie man will. Ebenso erlaubt: zwei Zeilen tauschen und eine Zeile mit einer Zahl <M>{t`\neq 0`}</M> multiplizieren.</p>}
            en={<p>From the new rows <M>{t`\mathrm{I}`}</M> and <M>{t`\mathrm{II} - \mathrm{I}`}</M> you get the old row <M>{t`\mathrm{II}`}</M> back: <M p=".">{t`(\mathrm{II} - \mathrm{I}) + \mathrm{I} = \mathrm{II}`}</M> So the new system has exactly the same solutions as the old one – none gained, none lost. This is why you may transform as often as you like. Also allowed: swapping two rows and multiplying a row by a number <M p=".">{t`\neq 0`}</M></p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="stufenform" title={<T de="3. Zeilen-Stufen-Form und Rückwärtseinsetzen" en="3. Row-echelon form and back substitution" />}>
        <Box kind="uebung" src={<Src u={2} p="29–30" slides />} title={<T de="Zeilen-Stufen-Form, Rückwärtseinsetzen" en="Row-echelon form, reverse substitution" />}>
          <T de={<p>Nächster Schritt mit dem Pivot <M>1</M> in Zeile <M>{t`\mathrm{II}`}</M> und dem Vielfachen <M>-1</M> für Zeile <M p=".">{t`\mathrm{III}`}</M> Das ergibt die «Zeilen-Stufen-Form»:</p>}
            en={<p>Next step with the pivot <M>1</M> in row <M>{t`\mathrm{II}`}</M> and the multiple <M>-1</M> for row <M p=".">{t`\mathrm{III}`}</M> This gives the row-echelon form (<i lang="de">Zeilen-Stufen-Form</i>):</p>} />
          <MD>{t`\left(\begin{array}{ccc|c} 1 & 1 & 1 & 6\\ 0 & 1 & 0 & 2\\ 0 & 0 & 3 & 9 \end{array}\right)`}</MD>
          <MD>{t`\begin{aligned} x_1 + x_2 + x_3 &= 6\\ x_2 &= 2\\ 3x_3 &= 9 \end{aligned}`}</MD>
          <T de={<p>Rückwärts einsetzen, um die Variablen zu bestimmen:</p>} en={<p>“Reverse substitution to solve for variables:”</p>} />
          <MD>{t`\begin{aligned} 3x_3 = 9 &\;\to\; x_3 = 3\\ x_2 + 0\,x_3 = 2 &\;\to\; x_2 = 2\\ x_1 + x_2 + x_3 = 6 &\;\to\; x_1 = 1 \end{aligned}`}</MD>
          <T de={<p>Also liegt der Schnittpunkt bei <M p=".">{t`(x_1, x_2, x_3) = (1, 2, 3)`}</M> … oder man rechnet mit Gauss weiter bis zur «Vereinfachten Zeilen-Stufen-Form»:</p>}
            en={<p>“So intersection is at <M p=".”">{t`(x_1, x_2, x_3) = (1, 2, 3)`}</M> “…or we could have continued with Gauss to get the reduced row-echelon form” (<i lang="de">Vereinfachte Zeilen-Stufen-Form</i>):</p>} />
          <MD>{t`\left(\begin{array}{ccc|c} 1 & 0 & 0 & 1\\ 0 & 1 & 0 & 2\\ 0 & 0 & 1 & 3 \end{array}\right)`}</MD>
        </Box>
        <T
          de={<>
            <p className="keep"><b>So liest man das:</b> «Stufenform» heisst: Jede Zeile beginnt mindestens eine Spalte weiter rechts als die Zeile darüber. Die letzte Zeile enthält dann nur noch eine Unbekannte, <M p=".">{t`3x_3 = 9`}</M> Die löst man sofort. Mit <M>{t`x_3`}</M> geht man eine Zeile höher. Dort fehlt dann wieder nur eine Unbekannte. So geht es Zeile für Zeile nach oben.</p>
            <p className="keep">In der <b>vereinfachten</b> Form steht in jeder Pivotspalte nur noch das Pivot, und es ist <M p=".">1</M> Links steht dann die Einheitsmatrix, und rechts kann man die Lösung direkt ablesen. Der Spieler setzt das Beispiel fort: zuerst rückwärts einsetzen (rechts neben den Zeilen), dann bis zur vereinfachten Form.</p>
          </>}
          en={<>
            <p className="keep"><b>How to read it:</b> “echelon” (staircase) means: every row starts at least one column further right than the row above. Then the last row contains only one unknown, <M p=".">{t`3x_3 = 9`}</M> You solve it at once. With <M>{t`x_3`}</M> you go one row up. There, again, only one unknown is missing. Row by row you work your way up.</p>
            <p className="keep">In the <b>reduced</b> form every pivot column contains only the pivot, and it is <M p=".">1</M> Then the identity matrix stands on the left, and you read off the solution on the right. The player continues the example: first back substitution (next to the rows), then on to the reduced form.</p>
          </>}
        />
        <GaussStepper aug={SLIDE26} from={5} />
        <T
          de={<p>Beide Wege geben dasselbe. Rückwärts einsetzen ist von Hand meist kürzer. Die vereinfachte Form braucht mehr Schritte, aber am Ende muss man nichts mehr rechnen.</p>}
          en={<p>Both ways give the same result. Back substitution is usually shorter by hand. The reduced form needs more steps, but at the end there is nothing left to compute.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="geometrie" title={<T de="4. Was eine Zeilenumformung im Bild macht" en="4. What a row operation does in the picture" />}>
        <T
          de={<p>Jede Gleichung mit zwei Unbekannten ist eine Gerade. Eine Zeilenumformung ersetzt <em>eine</em> Gerade durch eine neue. Die neue Gerade geht wieder durch den Schnittpunkt (siehe oben). Wir nehmen das System von <Src u={2} p={33} slides />: <M>{t`x_1 + x_2 = 3`}</M> und <M p=".">{t`2x_1 - x_2 = 0`}</M></p>}
          en={<p>Every equation in two unknowns is a line. A row operation replaces <em>one</em> line by a new one. The new line again passes through the intersection (see above). We take the system of <Src u={2} p={33} slides />: <M>{t`x_1 + x_2 = 3`}</M> and <M p=".">{t`2x_1 - x_2 = 0`}</M></p>}
        />
        <TwinLines />
        <T
          de={<p>Die Gerade dreht sich, weil man <M>{t`\mathrm{II} - 2\cdot\mathrm{I}`}</M> in Gedanken langsam einschalten kann: <M>{t`\mathrm{II} - 2s\cdot\mathrm{I}`}</M> mit <M>s</M> von <M>0</M> bis <M p=".">1</M> Für jedes <M>s</M> ist das eine Kombination der beiden Gleichungen, geht also durch den Schnittpunkt. Gauss sucht die Kombination, bei der die Gerade waagrecht wird: Dann ist <M>{t`x_1`}</M> verschwunden. So sah es auch auf <Src u={2} p="14–15" slides /> aus.</p>}
          en={<p>The line turns because you can switch on <M>{t`\mathrm{II} - 2\cdot\mathrm{I}`}</M> slowly in your mind: <M>{t`\mathrm{II} - 2s\cdot\mathrm{I}`}</M> with <M>s</M> going from <M>0</M> to <M p=".">1</M> For every <M>s</M> this is a combination of the two equations, so it passes through the intersection. Gauss looks for the combination where the line becomes horizontal: then <M>{t`x_1`}</M> has disappeared. That is also what <Src u={2} p="14–15" slides /> showed.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="ergebnisse" title={<T de="5. Drei mögliche Ergebnisse" en="5. Three possible results" />}>
        <Box kind="uebung" src={<Src u={2} p="31–36" slides />} title={<T de="Mögliche Ergebnisse, Beispiele" en="Possible results, examples" />}>
          <T
            de={<p>Folie 31 zeigt drei allgemeine Stufenformen: grüne Sterne (Pivots), schwarze Sterne (beliebige Zahlen), Nullen darunter. <b>Eindeutige Lösung</b>; <b>unendlich viele Lösungen</b> (letzte Zeile ganz null, auch rechts); <b>keine Lösung</b> (letzte Zeile links null, rechts <M p=").">{t`\neq 0`}</M> Folie 32 «Mehr Spalten als Zeilen?»: <M p=",">{t`2x_1 + 2x_2 - x_3 = 2`}</M> <M p=";">{t`x_1 + x_2 + 3x_3 = 1`}</M> handschriftlich mit vertauschten Zeilen und dem Vielfachen <M p=":">-2</M> <M p=",">{t`(1\ 1\ 3 \mid 1;\ 0\ 0\ {-7} \mid 0)`}</M> «immer noch korrekte Zeilen-Stufen-Form»; <M p=",">{t`7x_3 = 0 \Rightarrow x_3 = 0`}</M> <M p=".">{t`x_1 + x_2 = 1`}</M> Folien 33–36 lösen vier Systeme: (a) <M p=";">{t`(x_1, x_2) = (1, 2)`}</M> (b) <M>{t`0\,x_2 \neq 0`}</M> – «keine Lösungen!»; (c) <M p=";">{t`(x_1, x_2, x_3) = (2, -1, 1)`}</M> (d) «Gleichungen sind nur Vielfache voneinander» – «unendlich viele Lösungen!».</p>}
            en={<p>Slide 31 shows three generic echelon forms: green stars (pivots), black stars (any numbers), zeros below. <b>Unique solution</b>; <b>infinitely many solutions</b> (last row all zero, also on the right); <b>no solutions</b> (last row zero on the left, <M>{t`\neq 0`}</M> on the right). Slide 32 “More columns than rows?”: <M p=",">{t`2x_1 + 2x_2 - x_3 = 2`}</M> <M p=";">{t`x_1 + x_2 + 3x_3 = 1`}</M> handwritten with the rows swapped and the multiple <M p=":">-2</M> <M p=",">{t`(1\ 1\ 3 \mid 1;\ 0\ 0\ {-7} \mid 0)`}</M> “still correct row-echelon form”; <M p=",">{t`7x_3 = 0 \Rightarrow x_3 = 0`}</M> <M p=".">{t`x_1 + x_2 = 1`}</M> Slides 33–36 solve four systems: (a) <M p=";">{t`(x_1, x_2) = (1, 2)`}</M> (b) <M>{t`0\,x_2 \neq 0`}</M> – “No Solutions!”; (c) <M p=";">{t`(x_1, x_2, x_3) = (2, -1, 1)`}</M> (d) “Eqs. just multiples of each other” – “Infinitely many solutions!”.</p>}
          />
        </Box>
        <ResultStaircases />
        <T
          de={<>
            <p className="keep"><b>So liest man die drei Bilder:</b> Entscheidend ist nur die Treppe am Ende. Eine Zeile <M>{t`(0\ 0\ 0 \mid 0)`}</M> heisst <M p=":">{t`0 = 0`}</M> wahr, aber ohne Information. Eine Zeile <M>{t`(0\ 0\ 0 \mid 5)`}</M> heisst <M p=":">{t`0 = 5`}</M> falsch, egal was man für die <M>{t`x_j`}</M> einsetzt. Eine Spalte ohne Pivot gehört zu einer <b>freien Variablen</b>: Sie darf jeden Wert haben. Man gibt ihr einen Namen, etwa <M p=",">{t`\alpha`}</M> und rechnet die anderen damit aus.</p>
            <p>Bei Folie 32 ist <M>{t`x_2`}</M> frei. Mit <M>{t`x_2 = \alpha`}</M> folgt <M p=".">{t`x_1 = 1 - \alpha`}</M> Die Folien 32 und 36 geben die Lösungsmenge nicht an. Der Explorer rechnet sie aus (Ergänzung: die Parameter <M>{t`\alpha, \beta`}</M> sind unsere Namen).</p>
          </>}
          en={<>
            <p className="keep"><b>How to read the three pictures:</b> only the final staircase matters. A row <M>{t`(0\ 0\ 0 \mid 0)`}</M> says <M p=":">{t`0 = 0`}</M> true, but no information. A row <M>{t`(0\ 0\ 0 \mid 5)`}</M> says <M p=":">{t`0 = 5`}</M> false, whatever you insert for the <M p=".">{t`x_j`}</M> A column without a pivot belongs to a <b>free variable</b>: it may take any value. You give it a name, say <M p=",">{t`\alpha`}</M> and compute the others from it.</p>
            <p>On slide 32, <M>{t`x_2`}</M> is free. With <M>{t`x_2 = \alpha`}</M> we get <M p=".">{t`x_1 = 1 - \alpha`}</M> Slides 32 and 36 do not give the solution set. The explorer computes it (supplement: the parameter names <M>{t`\alpha, \beta`}</M> are ours).</p>
          </>}
        />
        <SolveExplorer />
        <T
          de={<p>Ein Beispiel zum Ausprobieren: Ändert man in Folie 34 die rechte Seite <M>5</M> in <M p=",">4</M> dann wird die zweite Gleichung das Doppelte der ersten, und aus «keine Lösung» wird «unendlich viele». Eine einzige Zahl entscheidet.</p>}
          en={<p>An example to play with: if you change the right-hand side <M>5</M> of slide 34 to <M p=",">4</M> the second equation is twice the first, and “no solution” becomes “infinitely many”. A single number decides.</p>}
        />
        <Box kind="uebung" src={<Src u={2} p={37} slides />} title={<T de="Tipp zur Serie 1: Rechnungen nicht wiederholen" en="Tip for problem set 1: don't repeat calculations" />}>
          <T
            de={<p>Aufgabe 2, Gauss-Verfahren üben: «Rechnungen nicht wiederholen» – eine Tabelle <M>{t`x_1\ x_2\ x_3 \mid b_1 \mid b_2 \mid b_3`}</M> mit mehreren rechten Seiten nebeneinander.</p>}
            en={<p>Q2, Gaussian elimination practice: “don't repeat calculations” – one table <M>{t`x_1\ x_2\ x_3 \mid b_1 \mid b_2 \mid b_3`}</M> with several right-hand sides side by side.</p>}
          />
        </Box>
        <Box kind="supplement" title={<T de="Zwei rechte Seiten in einem Durchgang" en="Two right-hand sides in one pass" />}>
          <T
            de={<p>Die Zeilenumformungen hängen nur von <M>A</M> ab: Das Vielfache wird aus den Zahlen links berechnet. Darum kann man rechts mehrere Spalten mitführen. Beispiel mit <M>A</M> von Folie 26, <M>{t`b_1 = (6, 8, 23)`}</M> und unserem <M p=":">{t`b_2 = (3, 4, 10)`}</M></p>}
            en={<p>The row operations depend only on <M p=":">A</M> the multiple is computed from the numbers on the left. That is why you can carry several columns on the right. Example with <M>A</M> of slide 26, <M>{t`b_1 = (6, 8, 23)`}</M> and our <M p=":">{t`b_2 = (3, 4, 10)`}</M></p>}
          />
          <div className="ge-tip-row">
            <QMatrix m={MULTI_RHS} nVars={3} heads={MULTI_HEADS} label="[A | b1 b2]" />
            <M>{t`\longrightarrow`}</M>
            <QMatrix m={multi.result} nVars={3} label="echelon" />
            <M>{t`\longrightarrow`}</M>
            <QMatrix m={multiRed} nVars={3} label="reduced" />
          </div>
          <T
            de={<p>Rechts liest man beide Lösungen ab: <M>{t`(1, 2, 3)`}</M> für <M>{t`b_1`}</M> und <M>{t`(1, 1, 1)`}</M> für <M p=".">{t`b_2`}</M> Eine Elimination statt zwei.</p>}
            en={<p>On the right you read off both solutions: <M>{t`(1, 2, 3)`}</M> for <M>{t`b_1`}</M> and <M>{t`(1, 1, 1)`}</M> for <M p=".">{t`b_2`}</M> One elimination instead of two.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ misconceptions */}
      <Box kind="misconception" title={<T de={<>«Bei <M>{t`0 \cdot x_2 = 1`}</M> habe ich mich verrechnet»</>} en={<>“With <M>{t`0 \cdot x_2 = 1`}</M> I must have made a mistake”</>} />}>
        <T
          de={<p>Nicht unbedingt. Wenn richtig gerechnet wurde, ist das die Antwort: Das System hat <b>keine Lösung</b>. Bei Folie 34 widersprechen sich die Gleichungen: <M>{t`x_1 + x_2 = 2`}</M> und <M>{t`x_1 + x_2 = \tfrac52`}</M> (die zweite durch <M>2</M> geteilt). Im Bild: zwei parallele Geraden.</p>}
          en={<p>Not necessarily. If you computed correctly, this is the answer: the system has <b>no solution</b>. On slide 34 the equations contradict each other: <M>{t`x_1 + x_2 = 2`}</M> and <M>{t`x_1 + x_2 = \tfrac52`}</M> (the second divided by <M p=").">2</M> In the picture: two parallel lines.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Eine Nullzeile heisst, dass etwas schiefgelaufen ist»" en="“A zero row means something went wrong”" />}>
        <T
          de={<p>Eine Zeile <M>{t`(0\ 0\ 0 \mid 0)`}</M> heisst nur: Diese Gleichung war von den anderen abhängig, zum Beispiel ein Vielfaches (Folie 36). Sie sagt nichts Neues und fällt weg. Es bleiben weniger Gleichungen als Unbekannte, also gibt es freie Variablen.</p>}
          en={<p>A row <M>{t`(0\ 0\ 0 \mid 0)`}</M> only means: this equation depended on the others, for example a multiple (slide 36). It says nothing new and drops out. Fewer equations than unknowns remain, so there are free variables.</p>}
        />
      </Box>
      <Box kind="misconception" title={<T de="«Ich rechne mit der Zeile weiter, die ich gerade verändert habe»" en="“I continue with the row I have just changed”" />}>
        <T
          de={<p>In einem Schritt rechnet man immer mit der <b>Pivotzeile</b>, und die bleibt unverändert. Beispiel: Nach <M>{t`\mathrm{II} - \mathrm{I}`}</M> ist <M p=".">{t`\mathrm{II} = (0\ 1\ 0 \mid 2)`}</M> Wer jetzt für Zeile <M>{t`\mathrm{III}`}</M> «<M>{t`\mathrm{III} - 2\cdot\mathrm{II}`}</M>» mit dieser neuen Zeile rechnet, bekommt <M>{t`(2\ 1\ 5 \mid 19)`}</M> – vorne steht immer noch die <M p=".">2</M> Richtig ist <M>{t`\mathrm{III} - 2\cdot\mathrm{I}`}</M> mit der ursprünglichen Zeile <M p=".">{t`\mathrm{I}`}</M></p>}
          en={<p>Within one step you always compute with the <b>pivot row</b>, and it stays unchanged. Example: after <M>{t`\mathrm{II} - \mathrm{I}`}</M> we have <M p=".">{t`\mathrm{II} = (0\ 1\ 0 \mid 2)`}</M> If you now do “<M>{t`\mathrm{III} - 2\cdot\mathrm{II}`}</M>” with this new row, you get <M>{t`(2\ 1\ 5 \mid 19)`}</M> – the <M>2</M> in front is still there. Correct is <M>{t`\mathrm{III} - 2\cdot\mathrm{I}`}</M> with the original row <M p=".">{t`\mathrm{I}`}</M></p>}
        />
      </Box>
      <Box kind="key">
        <T
          de={<ul>
            <li>Erweiterte Matrix <M p=":">{t`[A \mid b]`}</M> nur die Zahlen, eine Zeile pro Gleichung, eine Spalte pro Unbekannte.</li>
            <li>Erlaubt (Lösung bleibt gleich): Vielfaches einer Zeile zu einer anderen addieren, Zeilen tauschen, Zeile mit Zahl <M>{t`\neq 0`}</M> multiplizieren. Immer notieren: <M p=".">{t`\mathrm{II} - \mathrm{I}`}</M></li>
            <li>Pivot für Pivot Nullen darunter erzeugen → Zeilen-Stufen-Form → von unten rückwärts einsetzen (oder weiter zur vereinfachten Form).</li>
            <li>Ergebnis ablesen: Zeile <M>{t`(0 \cdots 0 \mid c \neq 0)`}</M> → keine Lösung; sonst jede Spalte mit Pivot → genau eine Lösung; Spalten ohne Pivot → freie Variablen, unendlich viele.</li>
          </ul>}
          en={<ul>
            <li>Augmented matrix <M p=":">{t`[A \mid b]`}</M> only the numbers, one row per equation, one column per unknown.</li>
            <li>Allowed (solution stays the same): add a multiple of one row to another, swap rows, multiply a row by a number <M p=".">{t`\neq 0`}</M> Always note it: <M p=".">{t`\mathrm{II} - \mathrm{I}`}</M></li>
            <li>Pivot by pivot create zeros below → row-echelon form → back substitution from the bottom (or on to the reduced form).</li>
            <li>Read off the result: row <M>{t`(0 \cdots 0 \mid c \neq 0)`}</M> → no solution; otherwise every column has a pivot → exactly one solution; columns without a pivot → free variables, infinitely many.</li>
          </ul>}
        />
      </Box>
    </article>
  );
}
