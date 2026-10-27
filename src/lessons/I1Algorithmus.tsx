import { Box, Section, Src } from '../components/Blocks';
import { K } from '../components/Code';
import { Choice, Predict } from '../components/Quiz';
import { M, MD } from '../components/Tex';
import { T, useTr } from '../i18n';
import { BoxComputer } from '../viz/info/BoxComputer';
import { EuclidDemo } from '../viz/info/EuclidDemo';
import { LevelsFigure } from '../viz/info/LevelsFigure';

const t = String.raw;

export default function I1Algorithmus() {
  const tr = useTr();
  return (
    <article className="lesson">
      <T
        de={<p className="lede">Ein <b>Algorithmus</b> ist eine Anleitung, die so genau ist, dass man sie ausführen kann, ohne nachzudenken. Wir lernen ihn am ältesten Beispiel der Informatik kennen und schauen dann, was ein Rechner dabei wirklich tut: Er öffnet Schachteln und macht den nächsten Schritt.</p>}
        en={<p className="lede">An <b>algorithm</b> is a set of instructions so precise that you can carry it out without thinking. We meet it through the oldest example in computer science, and then look at what a computer really does with it: it opens boxes and takes the next step.</p>}
      />

      {/* ------------------------------------------------------------------ 1 */}
      <Section id="algorithmus" title={<T de="1. Was ist ein Algorithmus?" en="1. What is an algorithm?" />}>
        <Box kind="lecture" src={<Src p="8–9" />} title={<T de="Informatik, Algorithmus, Euklid" en="Computer science, algorithm, Euclid" />}>
          <T
            de={<ul>
              <li>Informatik beschäftigt sich mit der <b>Automatisierung geistiger Tätigkeiten</b>.</li>
              <li>Ein Algorithmus ist eine Folge von Anweisungen, die ein Problem Schritt für Schritt löst. Die Ausführung braucht keine Intelligenz, sondern <b>Präzision</b> – das kann auch ein Computer.</li>
              <li>Euklid (3. Jh. v. Chr.): Zwei Strecken der Längen <M>a</M> und <M>b</M> sollen in gleich grosse Stücke von möglichst grosser Länge zerlegt werden.
                <ol>
                  <li>Ist <M p=",">{t`a = b`}</M> sind wir fertig: Der Algorithmus <b>hält an</b>.</li>
                  <li>Sonst ziehen wir die kürzere Strecke von der längeren ab und <b>beginnen von vorn</b> mit den neuen Längen.</li>
                </ol>
              </li>
            </ul>}
            en={<ul>
              <li>Computer science is concerned with the <b>automation of intellectual activities</b>.</li>
              <li>An algorithm is a series of instructions that solves a problem step by step. Executing it needs no intelligence, but <b>precision</b> – even a computer can do it.</li>
              <li>Euclid (3rd century BC): split two lines of lengths <M>a</M> and <M>b</M> into equally sized pieces of maximal length.
                <ol>
                  <li>If <M p=",">{t`a = b`}</M> we are done: the algorithm <b>terminates</b>.</li>
                  <li>Otherwise subtract the shorter line from the longer one and <b>restart</b> with the new lengths.</li>
                </ol>
              </li>
            </ul>}
          />
        </Box>
        <T
          de={<p>Ein Kochrezept ist ein Algorithmus für Menschen. Bei Euklid sind die Schritte noch einfacher, denn ein Rechner ist «dumm»: Er kann nur vergleichen und abziehen. Das Klügste an einem Algorithmus steckt in der <em>Idee</em>, nicht in der Ausführung.</p>}
          en={<p>A cooking recipe is an algorithm for humans. Euclid's steps are even simpler, because a computer is “stupid”: it can only compare and subtract. The clever part of an algorithm lies in the <em>idea</em>, not in carrying it out.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 2 */}
      <Section id="euklid" title={<T de="2. Euklid in Bewegung" en="2. Euclid in motion" />}>
        <T
          de={<p>Das ist Fig. 1.1 des Skripts zum Selberspielen: Die Balken sind die Längen <M>a</M> und <M p=",">b</M> die gestrichelte Linie zeigt, wo der Balken vorher war. Rechts wächst die Tabelle mit den Werten nach jedem Schritt.</p>}
          en={<p>This is Fig. 1.1 of the notes to play with: the bars are the lengths <M>a</M> and <M p=",">b</M> and the dashed outline shows where the bar was before. On the right the table grows with the values after every step.</p>}
        />
        <EuclidDemo />
        <Predict
          prompt={<T
            de={<>Bei <M p=":">{t`(a,\,b) = (12,\,8)`}</M> Welche Werte haben <M>a</M> und <M>b</M> nach dem ersten und nach dem zweiten Schritt? Was kommt am Ende heraus? Und welche Zahlen teilen <M>a</M> und <M>b</M> am Anfang <em>beide</em>?</>}
            en={<>For <M p=":">{t`(a,\,b) = (12,\,8)`}</M> what are <M>a</M> and <M>b</M> after the first and after the second step? What comes out at the end? And which numbers divide <em>both</em> <M>a</M> and <M>b</M> at the start?</>}
          />}
          answer={<T
            de={<>Zuerst ist <M p=",">{t`a > b`}</M> also <M p=",">{t`a \leftarrow 12-8 = 4`}</M> dann <M p=".">{t`(4,\,8)`}</M> Jetzt ist <M p=",">{t`b > a`}</M> also <M p=",">{t`b \leftarrow 8-4 = 4`}</M> dann <M p=":">{t`(4,\,4)`}</M> Stopp, Ergebnis <M p=".">4</M> Die gemeinsamen Teiler am Anfang sind <M p=".">{t`1,\,2,\,4`}</M> Schau auf die Chips im Bild: Es sind bei <em>jedem</em> Schritt dieselben drei. Genau das macht den Algorithmus richtig (nächster Absatz).</>}
            en={<>First <M p=",">{t`a > b`}</M> so <M p=",">{t`a \leftarrow 12-8 = 4`}</M> giving <M p=".">{t`(4,\,8)`}</M> Now <M p=",">{t`b > a`}</M> so <M p=",">{t`b \leftarrow 8-4 = 4`}</M> giving <M p=":">{t`(4,\,4)`}</M> stop, the result is <M p=".">4</M> The common divisors at the start are <M p=".">{t`1,\,2,\,4`}</M> Look at the chips in the figure: they are the same three at <em>every</em> step. That is exactly what makes the algorithm correct (next paragraph).</>}
          />}
        />

        <T
          de={<>
            <p><b>Hört er immer auf?</b> Ja. Bei jedem Schritt wird <M>a</M> oder <M>b</M> kleiner, aber beide bleiben ganze Zahlen mindestens <M p=".">1</M> Eine ganze Zahl kann nicht ewig kleiner werden.</p>
            <p><b>Ist das Ergebnis richtig?</b> Teilt eine Zahl <M>c</M> sowohl <M>a</M> als auch <M p=",">b</M> dann teilt sie auch <M p=",">{t`a-b`}</M> denn</p>
            <MD>{t`a = (a-b) + b.`}</MD>
            <p>Umgekehrt gilt dasselbe: Teilt <M>c</M> die Zahlen <M>{t`a-b`}</M> und <M p=",">b</M> dann teilt es auch <M p=".">a</M> Die <em>Menge der gemeinsamen Teiler</em> ändert sich also nie. Am Schluss ist <M p=",">{t`a = b`}</M> und der grösste gemeinsame Teiler von <M>a</M> und <M>a</M> ist <M>a</M> selbst. Das Skript führt genau diese Überlegung vor (S. 9).</p>
          </>}
          en={<>
            <p><b>Does it always stop?</b> Yes. In every step <M>a</M> or <M>b</M> gets smaller, but both stay whole numbers of at least <M p=".">1</M> A whole number cannot keep shrinking forever.</p>
            <p><b>Is the result correct?</b> If a number <M>c</M> divides both <M>a</M> and <M p=",">b</M> then it also divides <M p=",">{t`a-b`}</M> because</p>
            <MD>{t`a = (a-b) + b.`}</MD>
            <p>The reverse holds too: if <M>c</M> divides <M>{t`a-b`}</M> and <M p=",">b</M> then it also divides <M p=".">a</M> So the <em>set of common divisors</em> never changes. At the end <M p=",">{t`a = b`}</M> and the greatest common divisor of <M>a</M> and <M>a</M> is <M>a</M> itself. The notes give exactly this argument (p. 9).</p>
          </>}
        />
        <Box kind="key" title={<T de="Eine Variable ist ein Platz, keine Zahl" en="A variable is a place, not a number" />}>
          <T
            de={<p><M>a</M> bedeutet nicht «die Zahl 12», sondern «der Platz, an dem gerade eine Zahl steht». Nach Schritt 1 steht dort <M p=".">4</M> Das Skript schreibt deshalb bewusst <em>keine</em> Indizes wie <M>{t`a_1,\,a_2`}</M> hin (S. 9–10): Ein Programm verändert Werte <b>über die Zeit</b>, und dieser Gedanke zieht sich durch die ganze Vorlesung.</p>}
            en={<p><M>a</M> does not mean “the number 12” but “the place where a number currently sits”. After step 1 there is <M p=".">4</M> there. That is why the notes deliberately write <em>no</em> indices like <M>{t`a_1,\,a_2`}</M> (pp. 9–10): a program changes values <b>over time</b>, and this idea runs through the whole course.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 3 */}
      <Section id="stufen" title={<T de="3. Drei Stufen: Idee, Pseudocode, Programm" en="3. Three levels: idea, pseudo-code, program" />}>
        <Box kind="lecture" src={<Src p="10–11" fig="Fig. 1.2, 1.7" />} title={<T de="Drei Abstraktionsstufen" en="Three levels of abstraction" />}>
          <T
            de={<ol>
              <li><b>Kernidee</b> (abstrakt): das Wesentliche jedes Algorithmus, der «Heureka-Moment».</li>
              <li><b>Pseudocode</b> (halb genau): für Menschen – für Unterricht, Korrektheits- und Effizienzüberlegungen, Beweise.</li>
              <li><b>Implementierung</b> (sehr genau): für Menschen <em>und</em> Rechner – lesbar und ausführbar, in einer bestimmten Programmiersprache.</li>
            </ol>}
            en={<ol>
              <li><b>Core idea</b> (abstract): the essence of any algorithm, the “Eureka moment”.</li>
              <li><b>Pseudo-code</b> (semi-detailed): made for humans – education, correctness and efficiency discussions, proofs.</li>
              <li><b>Implementation</b> (very detailed): made for humans <em>and</em> computers – readable and executable, in a specific programming language.</li>
            </ol>}
          />
        </Box>
        <LevelsFigure />
        <T
          de={<p>Nur die unterste Stufe kann ein Rechner ausführen. Der <b>Compiler</b> übersetzt das C++-Programm in Maschinencode, die Sprache der Maschine. Die Abbildung 1.7 im Skript zeigt das C++-Programm nur angeschnitten, und dort steht <K>b = a-b</K>, wo es zum Pseudocode passend <K>a = a - b</K> heissen müsste (I-001). Oben steht die vollständige, korrekte Fassung.</p>}
          en={<p>Only the lowest level can be executed by a computer. The <b>compiler</b> translates the C++ program into machine code, the language of the machine. Figure 1.7 of the notes shows the C++ program only partly, and there it says <K>b = a-b</K> where, to match the pseudo-code, it should say <K>a = a - b</K> (I-001). The complete, correct version is shown above.</p>}
        />
      </Section>

      {/* ------------------------------------------------------------------ 4 */}
      <Section id="schachteln" title={<T de="4. Ein Rechner aus Schachteln" en="4. A computer made of boxes" />}>
        <Box kind="lecture" src={<Src p="11–12" fig="Fig. 1.3" />} title={<T de="Das Modell: der Schachtel-Rechner" en="The model: the box computer" />}>
          <T
            de={<>
              <p>Ein Rechner hat nummerierte Schachteln. Die Nummern heissen <b>Adressen</b>, die Schachteln <b>Speicherstellen</b>. Eine Schachtel enthält einen Befehl oder Daten. Dazu kommen zwei <b>Register</b> <K>L</K> und <K>R</K>, auf die der Rechner sofort zugreifen kann. Befehle sind ganz einfach: etwas aus einer Schachtel lesen oder hineinschreiben, addieren oder subtrahieren, und <b>Sprünge</b>, die von einem Vergleich abhängen.</p>
              <p>Ausführung: Beginne bei Adresse 0. Danach kommt die nächste Adresse, ausser der Befehl ist ein Sprung.</p>
              <table className="plain">
                <thead><tr><th>{tr('Adresse', 'Location')}</th><th>{tr('Bedeutung', 'Meaning')}</th></tr></thead>
                <tbody>
                  <tr><td>0</td><td>Kopiere den Inhalt von Box 8 ins Register <K>L</K>.</td></tr>
                  <tr><td>1</td><td>Kopiere den Inhalt von Box 9 ins Register <K>R</K>.</td></tr>
                  <tr><td>2</td><td>Vergleiche <K>L</K> und <K>R</K>. Sind sie gleich, halte an (Ergebnis in <K>R</K>).</td></tr>
                  <tr><td>3</td><td>Vergleiche <K>R</K> und <K>L</K>. Ist <K>R</K> grösser, springe zu 6.</td></tr>
                  <tr><td>4</td><td>Schreibe <K>L</K> minus <K>R</K> in Box 8.</td></tr>
                  <tr><td>5</td><td>Springe zu 0.</td></tr>
                  <tr><td>6</td><td>Schreibe <K>R</K> minus <K>L</K> in Box 9.</td></tr>
                  <tr><td>7</td><td>Springe zu 0.</td></tr>
                </tbody>
              </table>
            </>}
            en={<>
              <p>A computer has numbered boxes. The numbers are called <b>addresses</b>, the boxes <b>memory locations</b>. A box holds an instruction or data. In addition there are two <b>registers</b> <K>L</K> and <K>R</K> that the computer can use immediately. Instructions are very simple: read from or write into a box, add or subtract, and <b>jumps</b> that depend on a comparison.</p>
              <p>Execution: start at address 0. After that comes the next address, unless the instruction is a jump.</p>
              <table className="plain">
                <thead><tr><th>{tr('Adresse', 'Location')}</th><th>{tr('Bedeutung', 'Meaning')}</th></tr></thead>
                <tbody>
                  <tr><td>0</td><td>Copy the content of box 8 into register <K>L</K>.</td></tr>
                  <tr><td>1</td><td>Copy the content of box 9 into register <K>R</K>.</td></tr>
                  <tr><td>2</td><td>Compare <K>L</K> and <K>R</K>. If they are equal, stop (result in <K>R</K>).</td></tr>
                  <tr><td>3</td><td>Compare <K>R</K> and <K>L</K>. If <K>R</K> is greater, jump to 6.</td></tr>
                  <tr><td>4</td><td>Write <K>L</K> minus <K>R</K> into box 8.</td></tr>
                  <tr><td>5</td><td>Jump to 0.</td></tr>
                  <tr><td>6</td><td>Write <K>R</K> minus <K>L</K> into box 9.</td></tr>
                  <tr><td>7</td><td>Jump to 0.</td></tr>
                </tbody>
              </table>
            </>}
          />
        </Box>
        <T
          de={<p>Box 9 enthält <M p=",">a</M> Box 8 enthält <M p=".">b</M> Jetzt bist du der Rechner: Ein Klick führt <em>einen</em> Befehl aus. Das Feld mit dem Rahmen und dem Pfeil ▼ ist der Befehl, der als Nächstes drankommt; rechts leuchtet die Zeile des Pseudocodes, zu der er gehört.</p>}
          en={<p>Box 9 holds <M p=",">a</M> box 8 holds <M p=".">b</M> Now you are the computer: one click executes <em>one</em> instruction. The box with the frame and the arrow ▼ is the instruction that runs next; on the right the line of the pseudo-code it belongs to lights up.</p>}
        />
        <BoxComputer />
        <T
          de={<ul>
            <li><b>Die Maschine kennt Euklid nicht.</b> Sie macht nur den Befehl in der Box, auf die der Zähler zeigt. Dass dabei der grösste gemeinsame Teiler herauskommt, steckt in der Idee des Programms, nicht in der Maschine.</li>
            <li><b>Befehle und Daten liegen in gleichen Schachteln.</b> Die Befehle in Box 0–7 ändern sich nie, nur die Datenboxen 8 und 9. Die «Variable» <M>a</M> ist hier einfach Box 9.</li>
            <li><b>Eine Schleife ist ein Sprung zurück.</b> Der Befehl «jump to 0» schickt die Maschine zum Anfang, bis der Stopp-Befehl greift. Jede Subtraktion kostet genau 6 Befehle.</li>
          </ul>}
          en={<ul>
            <li><b>The machine does not know Euclid.</b> It only executes the instruction in the box the counter points to. That the greatest common divisor comes out is in the idea of the program, not in the machine.</li>
            <li><b>Instructions and data sit in the same kind of boxes.</b> The instructions in boxes 0–7 never change, only the data boxes 8 and 9. The “variable” <M>a</M> is simply box 9 here.</li>
            <li><b>A loop is a jump back.</b> The instruction “jump to 0” sends the machine back to the start until the stop instruction applies. Every subtraction costs exactly 6 instructions.</li>
          </ul>}
        />
        <Choice
          question={<T de={<>Welcher Befehl macht aus dem Pseudocode-Wort <K>while</K> eine <em>Wiederholung</em>?</>} en={<>Which instruction turns the pseudo-code word <K>while</K> into a <em>repetition</em>?</>} />}
          choices={[
            { text: <code>[8] → L</code>, why: <T de={<>Der Befehl kopiert nur eine Zahl ins Register. Er wird zwar bei jedem Durchlauf ausgeführt, aber er wiederholt nichts selbst.</>} en={<>This only copies a number into a register. It is executed in every round, but it does not repeat anything by itself.</>} /> },
            { text: <code>L = R? stop</code>, why: <T de={<>Der ist die <em>Abbruchbedingung</em>: Er entscheidet, wann die Wiederholung endet, nicht dass es eine gibt.</>} en={<>That is the <em>exit condition</em>: it decides when the repetition ends, not that there is one.</>} /> },
            { text: <code>jump to 0</code>, correct: true, why: <T de={<>Er schickt die Maschine zurück zu Box 0, also wird derselbe Programmabschnitt noch einmal ausgeführt. Ohne Sprung zurück gäbe es keine Schleife, und der Stopp-Befehl entscheidet, wann sie endet.</>} en={<>It sends the machine back to box 0, so the same section of the program runs once more. Without a jump back there would be no loop, and the stop instruction decides when it ends.</>} /> },
            { text: <code>R − L → [9]</code>, why: <T de={<>Der verändert die Datenbox 9 und sorgt dafür, dass die Zahlen kleiner werden. Das ist wichtig für das Anhalten, aber es wiederholt nichts.</>} en={<>This changes data box 9 and makes the numbers smaller. That matters for stopping, but it repeats nothing.</>} /> },
          ]}
        />
        <Predict
          prompt={<T
            de={<>Du vertauschst die Zahlen: <M>{t`(a,\,b) = (8,\,12)`}</M> statt <M p=".">{t`(12,\,8)`}</M> Kommt dasselbe heraus? Braucht die Maschine gleich viele Befehle?</>}
            en={<>You swap the numbers: <M>{t`(a,\,b) = (8,\,12)`}</M> instead of <M p=".">{t`(12,\,8)`}</M> Does the same come out? Does the machine need the same number of instructions?</>}
          />}
          answer={<T
            de={<>Ja, beides: Ergebnis <M p=",">4</M> und <M>{t`6\cdot 2 + 3 = 15`}</M> Befehle. Der Unterschied ist nur, welcher der beiden Zweige zuerst läuft (jetzt zuerst der <K>else</K>-Zweig: <M p=",">{t`b \leftarrow 12-8`}</M> dann <M p=").">{t`a \leftarrow 8-4`}</M> Probiere es oben mit dem Vorschlag <M>{t`(8,\,12)`}</M> aus.</>}
            en={<>Yes, both: the result is <M p=",">4</M> and <M>{t`6\cdot 2 + 3 = 15`}</M> instructions. The only difference is which of the two branches runs first (now the <K>else</K> branch first: <M p=",">{t`b \leftarrow 12-8`}</M> then <M p=").">{t`a \leftarrow 8-4`}</M> Try it above with the preset <M p=".">{t`(8,\,12)`}</M></>}
          />}
        />
        <Box kind="supplement" title={<T de="Die Fussnote des Skripts: warum so viele Subtraktionen?" en="The footnote of the notes: why so many subtractions?" />}>
          <T
            de={<p>Das Skript warnt (S. 12, Fussnote 1): Mit einer grossen und einer kleinen Zahl wird sehr oft subtrahiert. Bei <M>{t`(40,\,3)`}</M> sind es 15 Subtraktionen, also <M>{t`6\cdot 15+3 = 93`}</M> Befehle; bei <M>{t`(40,\,30)`}</M> nur 3 Subtraktionen und 21 Befehle. Die schnellere Fassung ersetzt die vielen Subtraktionen durch <em>einen</em> Rest einer Division. Die Division mit Rest lernen wir bei den Operatoren kennen.</p>}
            en={<p>The notes warn (p. 12, footnote 1): with a large and a small number there are very many subtractions. For <M>{t`(40,\,3)`}</M> there are 15 subtractions, that is <M>{t`6\cdot 15+3 = 93`}</M> instructions; for <M>{t`(40,\,30)`}</M> only 3 subtractions and 21 instructions. The faster version replaces the many subtractions by <em>one</em> remainder of a division. We meet division with remainder with the operators.</p>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 5 */}
      <Section id="missverstaendnisse" title={<T de="5. Typische Missverständnisse" en="5. Typical misconceptions" />}>
        <Box kind="misconception" title={<T de="«Ein Algorithmus ist ein Programm.»" en="“An algorithm is a program.”" />}>
          <T
            de={<>Nein. Der Algorithmus ist die <em>Idee</em> und kann in Worten, als Pseudocode oder als Programm in verschiedenen Sprachen stehen. Euklid hat seinen Algorithmus 2000 Jahre vor dem ersten Computer aufgeschrieben.</>}
            en={<>No. The algorithm is the <em>idea</em>, and it can be written in words, as pseudo-code or as a program in different languages. Euclid wrote down his algorithm 2000 years before the first computer.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Der Rechner versteht den Pseudocode.»" en="“The computer understands the pseudo-code.”" />}>
          <T
            de={<>Pseudocode ist für Menschen geschrieben. Ein Rechner führt nur Maschinenbefehle aus, die der Compiler aus der Programmiersprache erzeugt hat. Dazwischen liegt ein ganzer Übersetzungsweg.</>}
            en={<>Pseudo-code is written for humans. A computer only executes machine instructions that the compiler produced from the programming language. A whole path of translation lies in between.</>}
          />
        </Box>
        <Box kind="misconception" title={<T de="«Nach dem Schritt gibt es ein neues a.»" en="“After the step there is a new a.”" />}>
          <T
            de={<>Nein: Es gibt weiterhin <em>denselben</em> Platz, nur mit neuem Inhalt. Im Schachtel-Rechner siehst du das genau: Box 9 wird überschrieben, ihre Adresse bleibt 9.</>}
            en={<>No: it is still the <em>same</em> place, just with new content. In the box computer you see this exactly: box 9 is overwritten, its address stays 9.</>}
          />
        </Box>
      </Section>

      {/* ------------------------------------------------------------------ 6 */}
      <Section id="ausblick" title={<T de="6. Das Wichtigste" en="6. The essentials" />}>
        <Box kind="key">
          <T
            de={<ul>
              <li>Ein Algorithmus braucht keine Klugheit, sondern Präzision: Er <b>hält an</b> und ist <b>richtig</b>. Beides begründet man, bevor man programmiert.</li>
              <li>Euklid: Das Kürzere vom Längeren abziehen, bis beide gleich sind. Die gemeinsamen Teiler ändern sich dabei nie.</li>
              <li>Ein Rechner ist Schachteln mit Adressen, zwei Registern und einem Zähler, der auf den nächsten Befehl zeigt. Schleifen sind Sprünge zurück.</li>
              <li>Idee, Pseudocode, Programm, Maschinencode: Jede Stufe ist genauer als die vorige.</li>
            </ul>}
            en={<ul>
              <li>An algorithm needs no cleverness but precision: it <b>terminates</b> and is <b>correct</b>. Both are argued before programming.</li>
              <li>Euclid: subtract the shorter from the longer until both are equal. The common divisors never change on the way.</li>
              <li>A computer is boxes with addresses, two registers and a counter that points to the next instruction. Loops are jumps back.</li>
              <li>Idea, pseudo-code, program, machine code: every level is more precise than the one before.</li>
            </ul>}
          />
        </Box>
        <T
          de={<p className="connections"><b>Weiter:</b> Der nächste Abschnitt des Skripts (S. 12–14) zeigt, woher dieses Modell kommt: Turings Maschine und die von-Neumann-Architektur. Danach schreiben wir das erste echte C++-Programm.</p>}
          en={<p className="connections"><b>Next:</b> the next section of the notes (pp. 12–14) shows where this model comes from: Turing's machine and the von Neumann architecture. After that we write the first real C++ program.</p>}
        />
      </Section>
    </article>
  );
}
